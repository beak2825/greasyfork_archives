// ==UserScript==
// @name         Appinn Forum Upload Enhancer
// @name:zh-CN   小众软件论坛上传优化
// @license      AGPL-3.0
// @version      0.5.0
// @author       xymoryn
// @namespace    https://github.com/xymoryn
// @icon         https://h1.appinn.me/logo.png
// @description  小众软件论坛发帖或回复时，粘贴、拖曳或上传按钮选择图片/文件，自动上传到 h1.appinn.me 并转为对应的 Markdown 格式输出。
// @homepage     https://github.com/xymoryn/user-scripts
// @supportURL   https://github.com/xymoryn/user-scripts/issues
// @run-at       document-idle
// @match        https://meta.appinn.net/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/529910/Appinn%20Forum%20Upload%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/529910/Appinn%20Forum%20Upload%20Enhancer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 全局配置对象
   * @type {Object}
   */
  const CONFIG = {
    /** 是否开启调试模式，控制控制台输出 */
    DEBUG: false,

    /** 文件大小限制 (20MB) */
    MAX_FILE_SIZE: 20 * 1024 * 1024,

    /** 上传端点 */
    UPLOAD_ENDPOINT: 'https://h1.appinn.me/upload',

    /**
     * 上传配置参数
     * @property {string} authCode - 认证码（必填）
     * @property {boolean} serverCompress - 是否启用 Telegram 图片压缩：
     *   - 启用丢失透明度
     *   - 对大于 10MB 的文件无效
     * @property {'telegram'|'cfr2'|'s3'} uploadChannel - 文件上传渠道：
     *   - 'telegram': Telegram。当前小众图床唯一可用的上传渠道。
     *   - 'cfr2': Cloudflare R2
     *   - 's3': Amazon S3
     * @property {'default'|'index'|'origin'|'short'} uploadNameType - 文件命名方式：
     *   - 'default': 时间戳_原始文件名
     *   - 'index': 仅时间戳
     *   - 'origin': 原始文件名
     *   - 'short': 类似短链接的随机字母数字
     * @property {boolean} autoRetry - 上传失败时是否自动切换到其他渠道
     */
    UPLOAD_PARAMS: {
      authCode: 'appinn2',
      serverCompress: false,
      uploadChannel: 'telegram',
      uploadNameType: 'default',
      autoRetry: true,
    },

    /** 资源访问 URL 前缀 */
    ASSETS_URL_PREFIX: 'https://h1.appinn.me',

    /**
     * 支持的文件类型
     * @type {Object.<string, {test: Function, format: Function, acceptString: string}>}
     */
    SUPPORTED_MIME_TYPES: {
      'image': {
        test: (type) => type.startsWith('image/'),
        format: (filename, url) => `![${filename}](${url})`,
        acceptString: 'image/*',
      },
      'video': {
        test: (type) => type.startsWith('video/'),
        format: (filename, url) => `![${filename}|video](${url})`,
        acceptString: 'video/*',
      },
      'audio': {
        test: (type) => type.startsWith('audio/'),
        format: (filename, url) => `![${filename}|audio](${url})`,
        acceptString: 'audio/*',
      },
      'pdf': {
        test: (type) => type === 'application/pdf',
        format: (filename, url) => `[${filename}|attachment](${url})`,
        acceptString: '.pdf',
      },
    },

    /** 内容格式配置 */
    CONTENT_FORMAT: {
      /** 内容前面的换行符 */
      BEFORE: '\n',
      /** 内容后面的换行符 */
      AFTER: '\n\n',
    },

    /** DOM选择器 */
    SELECTORS: {
      REPLY_CONTROL: '#reply-control', // 回复框
      EDITOR_CONTROLS: '.toolbar-visible.wmd-controls', // 编辑器控件
      EDITOR_INPUT: '.d-editor-input', // 编辑区域
      UPLOAD_BUTTON: '.btn.upload', // 上传按钮
    },

    /** 错误类型 */
    ERROR_TYPES: {
      NETWORK: 'network', // 网络连接问题
      SERVER: 'server', // 服务器错误
      PERMISSION: 'permission', // 权限问题
      FORMAT: 'format', // 响应格式错误
      FILETYPE: 'filetype', // 文件类型不支持
      FILESIZE: 'filesize', // 文件大小超限
      UNKNOWN: 'unknown', // 未知错误
    },
  };

  /**
   * 日志工具
   * @namespace
   */
  const Logger = {
    /**
     * 输出普通日志
     * @param {...any} args - 日志参数
     */
    log(...args) {
      if (CONFIG.DEBUG) {
        console.log('[小众论坛上传]', ...args);
      }
    },

    /**
     * 输出错误日志
     * @param {...any} args - 日志参数
     */
    error(...args) {
      if (CONFIG.DEBUG) {
        console.error('[小众论坛上传]', ...args);
      }
    },
  };

  /**
   * 应用状态管理
   * @namespace
   */
  const AppState = {
    /**
     * 保存所有上传状态
     * @type {Object.<string, {insertPosition: number, placeholderText: string, active: boolean}>}
     */
    uploads: {},

    /** 上传计数器 */
    uploadCounter: 0,

    /** DOM元素缓存 */
    elements: {
      replyControl: null,
      editorInput: null,
      editorControls: null,
      uploadButton: null,
    },

    /**
     * 生成唯一上传ID
     * @returns {string} 唯一ID
     */
    generateUploadId() {
      return `${Date.now()}-${++this.uploadCounter}`;
    },

    /**
     * 添加上传状态
     * @param {string} uploadId - 上传ID
     * @param {number} position - 插入位置
     * @param {string} placeholderText - 占位符文本
     */
    addUpload(uploadId, position, placeholderText) {
      this.uploads[uploadId] = {
        insertPosition: position,
        placeholderText,
        active: true,
        timestamp: Date.now(),
      };
    },

    /**
     * 获取上传状态
     * @param {string} uploadId - 上传ID
     * @returns {Object|null} 上传状态对象
     */
    getUpload(uploadId) {
      return this.uploads[uploadId] ?? null;
    },

    /**
     * 移除上传状态
     * @param {string} uploadId - 上传ID
     */
    removeUpload(uploadId) {
      delete this.uploads[uploadId];
    },
  };

  /**
   * DOM操作工具
   * @namespace
   */
  const DOMUtils = {
    /**
     * 判断回复控制面板是否处于打开状态
     * @param {HTMLElement} element - 回复框元素
     * @returns {boolean} 是否处于打开状态
     */
    isReplyControlOpen(element) {
      return element && element.id === 'reply-control' && !element.classList.contains('closed');
    },

    /**
     * 保存编辑器状态
     * @param {HTMLTextAreaElement} editor - 编辑器元素
     * @returns {Object} 编辑器状态
     */
    saveEditorState(editor) {
      const { selectionStart, selectionEnd, scrollTop, value } = editor;
      return { selectionStart, selectionEnd, scrollTop, value };
    },

    /**
     * 触发输入事件
     * @param {HTMLTextAreaElement} editor - 编辑器元素
     */
    triggerInputEvent(editor) {
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    },
  };

  /**
   * 文件工具
   * @namespace
   */
  const FileUtils = {
    /**
     * 检查文件类型
     * @param {File} file - 文件对象
     * @returns {string|null} 文件类型或null
     */
    getFileType(file) {
      const { type: mimeType } = file;
      const entry = Object.entries(CONFIG.SUPPORTED_MIME_TYPES).find(([_, info]) =>
        info.test(mimeType),
      );
      return entry ? entry[0] : null;
    },

    /**
     * 检查文件是否合法
     * @param {File} file - 文件对象
     * @returns {{valid: boolean, error: string|null}} 检查结果及错误类型
     */
    validateFile(file) {
      // 检查类型
      const fileType = this.getFileType(file);
      if (fileType === null) {
        return {
          valid: false,
          error: CONFIG.ERROR_TYPES.FILETYPE,
        };
      }

      // 检查大小
      if (file.size > CONFIG.MAX_FILE_SIZE) {
        return {
          valid: false,
          error: CONFIG.ERROR_TYPES.FILESIZE,
        };
      }

      return { valid: true, error: null };
    },

    /**
     * 检查是否有文件在拖放数据中
     * @param {DataTransfer} dataTransfer - 数据传输对象
     * @returns {boolean} 是否有文件
     */
    hasFileInDataTransfer(dataTransfer) {
      if (!dataTransfer) return false;

      // 通过items检查
      if (dataTransfer.items?.length) {
        return [...dataTransfer.items].some((item) => item.kind === 'file');
      }

      // 通过types检查
      if (dataTransfer.types?.includes('Files')) {
        return true;
      }

      // 通过files检查
      return dataTransfer.files?.length > 0;
    },

    /**
     * 获取剪贴板中的文件
     * @param {ClipboardData} clipboardData - 剪贴板数据
     * @returns {File|null} 文件或null
     */
    getFileFromClipboard(clipboardData) {
      if (!clipboardData?.items) return null;

      for (const item of clipboardData.items) {
        if (item.kind === 'file') {
          return item.getAsFile();
        }
      }

      return null;
    },

    /**
     * 生成文件选择器的accept属性
     * @returns {string} accept属性值
     */
    generateAcceptString() {
      return Object.values(CONFIG.SUPPORTED_MIME_TYPES)
        .map((type) => type.acceptString)
        .join(',');
    },

    /**
     * 显示文件错误消息
     * @param {File} file - 文件对象
     * @param {string} errorType - 错误类型
     */
    showFileError(file, errorType) {
      const { name, type } = file;
      let message;

      switch (errorType) {
        case CONFIG.ERROR_TYPES.FILETYPE:
          message = `不支持的文件类型: ${type}`;
          break;
        case CONFIG.ERROR_TYPES.FILESIZE:
          message = `文件"${name}"超过${
            CONFIG.MAX_FILE_SIZE / (1024 * 1024)
          }MB大小限制，无法上传。`;
          break;
        default:
          message = `文件"${name}"无法上传: 未知错误`;
      }

      alert(message);
      Logger.log(message);
    },
  };

  /**
   * Markdown格式化工具
   * @namespace
   */
  const MarkdownFormatter = {
    /**
     * 获取文件对应的Markdown链接
     * @param {File} file - 文件对象
     * @param {string} url - 文件URL
     * @returns {string} Markdown格式文本
     */
    getMarkdownLink(file, url) {
      const { name: filename = `file_${Date.now()}` } = file;
      const fileType = FileUtils.getFileType(file);

      if (fileType && CONFIG.SUPPORTED_MIME_TYPES[fileType]) {
        return CONFIG.SUPPORTED_MIME_TYPES[fileType].format(filename, url);
      }

      // 默认格式
      return `[${filename}](${url})`;
    },

    /**
     * 获取占位符文本
     * @param {File} file - 文件对象
     * @param {string} uploadId - 上传ID
     * @returns {string} 占位符文本
     */
    getPlaceholderText(file, uploadId) {
      const fileType = FileUtils.getFileType(file);
      const prefix =
        fileType === 'image' || fileType === 'video' || fileType === 'audio' ? '!' : '';
      const suffix =
        fileType === 'video'
          ? '|video'
          : fileType === 'audio'
          ? '|audio'
          : fileType === 'pdf'
          ? '|attachment'
          : '';

      return `${prefix}[上传中...${uploadId}${suffix}]`;
    },

    /**
     * 获取上传失败的Markdown文本
     * @param {string} uploadId - 上传ID
     * @param {string} errorType - 错误类型
     * @returns {string} 失败提示文本
     */
    getFailureText(uploadId, errorType) {
      const errorMessages = {
        [CONFIG.ERROR_TYPES.NETWORK]: '网络错误',
        [CONFIG.ERROR_TYPES.SERVER]: '服务器错误',
        [CONFIG.ERROR_TYPES.PERMISSION]: '权限错误',
        [CONFIG.ERROR_TYPES.FORMAT]: '格式错误',
        [CONFIG.ERROR_TYPES.FILETYPE]: '类型不支持',
        [CONFIG.ERROR_TYPES.FILESIZE]: '文件过大',
        [CONFIG.ERROR_TYPES.UNKNOWN]: '未知错误',
      };

      const errorMessage = errorMessages[errorType] || '未知错误';
      return `[上传失败(${errorMessage})-${uploadId}]`;
    },

    /**
     * 格式化内容，添加配置的前后换行符
     * @param {string} content - 原始内容
     * @returns {string} 格式化后的内容
     */
    formatContent(content) {
      return CONFIG.CONTENT_FORMAT.BEFORE + content + CONFIG.CONTENT_FORMAT.AFTER;
    },
  };

  /**
   * 占位符管理器
   * @namespace
   */
  const PlaceholderManager = {
    /**
     * 插入占位符到编辑器
     * @param {HTMLTextAreaElement} editor - 编辑器元素
     * @param {Object} editorState - 编辑器状态
     * @param {string} placeholderText - 占位符文本
     * @param {string} uploadId - 上传ID
     * @param {Function} onInserted - 占位符插入完成后的回调
     */
    insertPlaceholder(editor, editorState, placeholderText, uploadId, onInserted) {
      const { selectionStart: position, scrollTop } = editorState;
      const currentText = editor.value;

      // 使用配置的格式化占位符
      const completeText = MarkdownFormatter.formatContent(placeholderText);

      // 插入带换行的占位符
      editor.value =
        currentText.substring(0, position) + completeText + currentText.substring(position);

      // 触发输入事件
      DOMUtils.triggerInputEvent(editor);

      // 将光标移动到占位符后面
      const newCursorPosition = position + completeText.length;
      editor.selectionStart = newCursorPosition;
      editor.selectionEnd = newCursorPosition;
      editor.scrollTop = scrollTop;
      editor.focus();

      // 保存上传状态
      AppState.addUpload(uploadId, position, placeholderText);

      // 调用回调函数
      onInserted?.(uploadId, position);
    },

    /**
     * 查找占位符在文本中的位置
     * @param {string} text - 编辑器文本内容
     * @param {string} uploadId - 上传ID
     * @returns {Object|null} 占位符位置信息或null
     */
    findPlaceholder(text, uploadId) {
      const regex = new RegExp(`(!)?\\[上传中...${uploadId}(\\|[a-z]+)?\\]`);
      const match = regex.exec(text);

      if (match) {
        // 仅找到占位符文本本身
        return {
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        };
      }

      return null;
    },

    /**
     * 替换编辑器中的占位符
     * @param {HTMLTextAreaElement} editor - 编辑器元素
     * @param {string} uploadId - 上传ID
     * @param {string} markdownLink - Markdown链接文本
     * @param {Function} onReplaced - 替换完成后的回调
     */
    replacePlaceholder(editor, uploadId, markdownLink, onReplaced) {
      // 保存当前用户光标状态
      const currentState = DOMUtils.saveEditorState(editor);
      const { value: currentText } = currentState;

      // 查找占位符位置
      const placeholder = this.findPlaceholder(currentText, uploadId);

      // 如果找不到占位符，使用备选策略
      if (!placeholder) {
        Logger.error('找不到占位符，将添加到编辑器末尾');
        this._appendToEditor(editor, markdownLink, onReplaced);
        return;
      }

      // 计算长度变化
      const originalLength = placeholder.end - placeholder.start;
      const newLength = markdownLink.length;
      const lengthDiff = newLength - originalLength;

      // 替换内容
      const newText =
        currentText.substring(0, placeholder.start) +
        markdownLink +
        currentText.substring(placeholder.end);

      // 更新编辑器内容
      editor.value = newText;
      DOMUtils.triggerInputEvent(editor);

      // 调整光标位置
      this._adjustCursorPosition(editor, currentState, placeholder, lengthDiff);

      // 调用回调函数
      onReplaced?.(true);
    },

    /**
     * 调整光标位置
     * @private
     * @param {HTMLTextAreaElement} editor - 编辑器元素
     * @param {Object} currentState - 当前编辑器状态
     * @param {Object} placeholder - 占位符信息
     * @param {number} lengthDiff - 长度变化
     */
    _adjustCursorPosition(editor, currentState, placeholder, lengthDiff) {
      const { selectionStart, selectionEnd, scrollTop } = currentState;
      let newSelectionStart = selectionStart;
      let newSelectionEnd = selectionEnd;

      // 情况1：光标在占位符之前 - 不需要调整
      if (selectionStart < placeholder.start) {
        // 不调整光标位置
      }
      // 情况2：光标在占位符范围内 - 移动到替换内容之后
      else if (selectionStart >= placeholder.start && selectionStart <= placeholder.end) {
        newSelectionStart = placeholder.start + (placeholder.end - placeholder.start) + lengthDiff;
        newSelectionEnd = newSelectionStart;
      }
      // 情况3：光标在占位符之后 - 根据内容长度变化调整
      else if (selectionStart > placeholder.end) {
        newSelectionStart = selectionStart + lengthDiff;
        newSelectionEnd = selectionEnd + lengthDiff;
      }

      // 设置新的光标位置
      editor.selectionStart = newSelectionStart;
      editor.selectionEnd = newSelectionEnd;
      editor.scrollTop = scrollTop;
      editor.focus();
    },

    /**
     * 将内容添加到编辑器末尾
     * @private
     * @param {HTMLTextAreaElement} editor - 编辑器元素
     * @param {string} content - 要添加的内容
     * @param {Function} onAppended - 添加完成后的回调
     */
    _appendToEditor(editor, content, onAppended) {
      const currentText = editor.value;

      // 确保有换行分隔
      let newText = currentText;
      if (newText.length > 0 && !newText.endsWith('\n')) {
        newText += '\n';
      }

      // 添加新内容，使用配置的格式
      newText += MarkdownFormatter.formatContent(content);

      // 更新编辑器内容
      editor.value = newText;
      DOMUtils.triggerInputEvent(editor);

      // 移动光标到末尾
      editor.selectionStart = newText.length;
      editor.selectionEnd = newText.length;
      editor.focus();

      // 调用回调
      onAppended?.(false);
    },
  };

  /**
   * 上传服务
   * @namespace
   */
  const UploadService = {
    /**
     * 处理文件上传
     * @param {FileList|Array<File>} files - 文件列表
     * @param {HTMLTextAreaElement} editor - 编辑器元素
     */
    processFiles(files, editor) {
      if (!files?.length) return;

      [...files].forEach((file) => {
        const validation = FileUtils.validateFile(file);

        if (validation.valid) {
          this.uploadFile(file, editor);
        } else {
          FileUtils.showFileError(file, validation.error);
        }
      });
    },

    /**
     * 上传单个文件
     * @param {File} file - 文件对象
     * @param {HTMLTextAreaElement} editor - 编辑器元素
     */
    uploadFile(file, editor) {
      // 生成唯一ID
      const uploadId = AppState.generateUploadId();

      // 获取占位符文本
      const placeholderText = MarkdownFormatter.getPlaceholderText(file, uploadId);

      // 保存当前编辑器状态
      const editorState = DOMUtils.saveEditorState(editor);

      // 插入占位符
      PlaceholderManager.insertPlaceholder(editor, editorState, placeholderText, uploadId, () => {
        // 占位符插入后执行上传
        this._executeUpload(file, editor, uploadId);
      });
    },

    /**
     * 执行文件上传
     * @private
     * @param {File} file - 文件对象
     * @param {HTMLTextAreaElement} editor - 编辑器元素
     * @param {string} uploadId - 上传ID
     */
    async _executeUpload(file, editor, uploadId) {
      try {
        const result = await this.performUpload(file);

        // 生成Markdown链接
        const markdownLink = MarkdownFormatter.getMarkdownLink(file, result.url);

        // 替换占位符
        PlaceholderManager.replacePlaceholder(editor, uploadId, markdownLink, (success) => {
          if (success) {
            Logger.log('占位符替换成功:', uploadId);
          } else {
            Logger.log('占位符未找到，已添加到编辑器末尾:', uploadId);
          }
          // 清理上传状态
          AppState.removeUpload(uploadId);
        });
      } catch (error) {
        // 处理上传失败
        Logger.error('上传文件失败:', error);

        // 确定错误类型
        const errorType = this._categorizeError(error);

        // 生成错误文本
        const failureText = MarkdownFormatter.getFailureText(uploadId, errorType);

        // 替换占位符
        PlaceholderManager.replacePlaceholder(editor, uploadId, failureText, () => {
          // 清理上传状态
          AppState.removeUpload(uploadId);
        });
      }
    },

    /**
     * 分类错误类型
     * @private
     * @param {string|Error} error - 错误信息
     * @returns {string} 错误类型
     */
    _categorizeError(error) {
      const errorStr = error.toString().toLowerCase();

      if (
        errorStr.includes('network') ||
        errorStr.includes('failed to fetch') ||
        errorStr.includes('网络请求失败')
      ) {
        return CONFIG.ERROR_TYPES.NETWORK;
      }

      if (errorStr.includes('401') || errorStr.includes('403') || errorStr.includes('permission')) {
        return CONFIG.ERROR_TYPES.PERMISSION;
      }

      if (errorStr.includes('500') || errorStr.includes('503') || errorStr.includes('服务器')) {
        return CONFIG.ERROR_TYPES.SERVER;
      }

      if (errorStr.includes('解析') || errorStr.includes('parse') || errorStr.includes('format')) {
        return CONFIG.ERROR_TYPES.FORMAT;
      }

      return CONFIG.ERROR_TYPES.UNKNOWN;
    },

    /**
     * 执行文件上传到服务器
     * @param {File} file - 文件对象
     * @returns {Promise<{url: string, filename: string}>} 上传结果
     */
    performUpload(file) {
      return new Promise((resolve, reject) => {
        const { name: filename = `file_${Date.now()}` } = file;
        const formData = new FormData();
        formData.append('filename', filename);
        formData.append('file', file);

        const params = new URLSearchParams();
        Object.entries(CONFIG.UPLOAD_PARAMS).forEach(([key, val]) => {
          params.append(key, val);
        });

        const uploadUrl = `${CONFIG.UPLOAD_ENDPOINT}?${params.toString()}`;

        GM_xmlhttpRequest({
          method: 'POST',
          url: uploadUrl,
          data: formData,
          responseType: 'json',
          onload: (response) => {
            if (response.status !== 200) {
              return reject(`HTTP错误: ${response.status}`);
            }

            try {
              const data = response.response;
              if (!data?.[0]?.src) {
                return reject('无效的响应数据');
              }

              const fileUrl = CONFIG.ASSETS_URL_PREFIX + data[0].src;
              resolve({
                url: fileUrl,
                filename,
              });
            } catch (error) {
              reject('解析响应数据失败');
            }
          },
          onerror: () => reject('网络请求失败'),
        });
      });
    },
  };

  /**
   * 事件处理
   * @namespace
   */
  const EventHandlers = {
    /**
     * 粘贴事件处理
     * @param {ClipboardEvent} e - 粘贴事件
     */
    pasteHandler(e) {
      const editor = e.target;
      const file = FileUtils.getFileFromClipboard(e.clipboardData);

      // 如果没有文件，不干预原有处理
      if (!file) return;

      // 拦截事件，自己处理
      e.preventDefault();
      e.stopPropagation();

      // 验证文件
      const validation = FileUtils.validateFile(file);

      if (validation.valid) {
        // 文件有效，上传
        UploadService.uploadFile(file, editor);
      } else {
        // 文件无效，显示错误
        FileUtils.showFileError(file, validation.error);
      }
    },

    /**
     * 拖放处理
     * @param {DragEvent} e - 拖放事件
     */
    dropHandler(e) {
      // 检查是否有文件被拖放
      if (e.dataTransfer?.files?.length > 0) {
        // 阻止默认行为
        e.preventDefault();
        e.stopPropagation();

        // 查找编辑器元素
        const { editorInput: editor } = AppState.elements;
        if (editor) {
          // 处理所有拖放文件
          UploadService.processFiles(e.dataTransfer.files, editor);
        }
      }
    },

    /**
     * 上传按钮点击事件
     * @param {MouseEvent} e - 点击事件
     */
    uploadButtonClickHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      // 创建文件选择器
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true;
      fileInput.accept = FileUtils.generateAcceptString();

      // 文件选择处理
      fileInput.addEventListener('change', function () {
        if (this.files?.length > 0) {
          const { editorInput: editor } = AppState.elements;
          if (!editor) return;

          // 处理所有选中的文件
          UploadService.processFiles(this.files, editor);
        }
      });

      // 触发文件选择对话框
      fileInput.click();
    },
  };

  /**
   * 初始化管理
   * @namespace
   */
  const Initializer = {
    /**
     * 查找并缓存DOM元素
     */
    findElements() {
      const replyControl = document.querySelector(CONFIG.SELECTORS.REPLY_CONTROL);
      if (!DOMUtils.isReplyControlOpen(replyControl)) return false;

      const editorControls = replyControl.querySelector(CONFIG.SELECTORS.EDITOR_CONTROLS);
      if (!editorControls) return false;

      // 一次性更新所有元素缓存
      Object.assign(AppState.elements, {
        replyControl,
        editorControls,
        editorInput: editorControls.querySelector(CONFIG.SELECTORS.EDITOR_INPUT),
        uploadButton: editorControls.querySelector(CONFIG.SELECTORS.UPLOAD_BUTTON),
      });

      return !!AppState.elements.editorInput;
    },

    /**
     * 设置事件处理器
     */
    setupEventHandlers() {
      const {  editorControls, uploadButton } = AppState.elements;

      if (!editorControls) return false;

      // 设置粘贴处理
      editorControls.removeEventListener('paste', EventHandlers.pasteHandler);
      editorControls.addEventListener('paste', EventHandlers.pasteHandler, { capture: true });

      // 设置拖放处理
      editorControls.removeEventListener('drop', EventHandlers.dropHandler, true);
      editorControls.addEventListener('drop', EventHandlers.dropHandler, { capture: true });

      // 设置上传按钮（如果存在）
      if (uploadButton) {
        // 检查按钮是否隐藏
        const computedStyle = window.getComputedStyle(uploadButton);
        if (computedStyle.display === 'none' || uploadButton.style.display === 'none') {
          // 设置按钮为可见
          uploadButton.style.display = 'inline-flex';

          // 清除现有的事件处理器
          const newBtn = uploadButton.cloneNode(true);
          uploadButton.parentNode.replaceChild(newBtn, uploadButton);

          // 更新缓存引用
          AppState.elements.uploadButton = newBtn;

          // 添加新的点击事件
          newBtn.addEventListener('click', EventHandlers.uploadButtonClickHandler);

          Logger.log('上传按钮已设置为可见并添加事件监听器');
        }
      }

      Logger.log('事件处理器设置完成');
      return true;
    },

    /**
     * 初始化函数
     */
    init() {
      Logger.log('初始化小众软件论坛上传优化脚本...');

      let currentObserver = null;

      /**
       * 尝试查找核心DOM元素并设置事件处理器
       */
      const attemptFullSetup = () => {
        if (this.findElements()) {
          this.setupEventHandlers();
        }
      };

      let setupWaitForReplyElement;

      /**
       * 监控 #reply-control 的状态和内容变化
       * @param {HTMLElement} replyNode - #reply-control 元素。
       */
      const setupMainReplyObserver = (replyNode) => {
        if (currentObserver) {
          currentObserver.disconnect();
        }

        currentObserver = new MutationObserver((mutations) => {
          if (!replyNode.isConnected) {
            setupWaitForReplyElement();
            return;
          }

          let needsReInit = false;

          for (const mutation of mutations) {
            // 情况1: #reply-control 的 class 属性变化 (通常表示回复框打开/关闭)
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'class' &&
              mutation.target === replyNode
            ) {
              if (DOMUtils.isReplyControlOpen(replyNode)) {
                needsReInit = true;
                break;
              }
            }
            // 情况2: #reply-control 的子元素列表或子树发生变化
            else if (
              (mutation.type === 'childList' || mutation.type === 'subtree') &&
              mutation.addedNodes.length > 0
            ) {
              if (DOMUtils.isReplyControlOpen(replyNode)) {
                const editorControlsAppeared = Array.from(mutation.addedNodes).some(
                  (node) =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    ((node.matches && node.matches(CONFIG.SELECTORS.EDITOR_CONTROLS)) ||
                      (node.querySelector && node.querySelector(CONFIG.SELECTORS.EDITOR_CONTROLS))),
                );
                if (editorControlsAppeared) {
                  needsReInit = true;
                  break;
                }
              }
            }
          }

          if (needsReInit) {
            // 延迟执行，确保DOM稳定
            setTimeout(attemptFullSetup, 200);
          }
        });

        currentObserver.observe(replyNode, {
          attributes: true,
          attributeFilter: ['class'],
          childList: true,
          subtree: true,
        });

        if (DOMUtils.isReplyControlOpen(replyNode)) {
          // 延迟执行
          setTimeout(attemptFullSetup, 50);
        }
      };

      setupWaitForReplyElement = () => {
        if (currentObserver) {
          currentObserver.disconnect();
        }

        currentObserver = new MutationObserver((mutations, obs) => {
          const replyNode = document.querySelector(CONFIG.SELECTORS.REPLY_CONTROL);
          if (replyNode) {
            setupMainReplyObserver(replyNode);
          }
        });

        currentObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      };

      // --- 初始化流程开始 ---

      // 1. 尝试立即执行一次设置 (主要应对页面直接加载完成且回复框已打开的情况)
      attemptFullSetup();

      // 2. 根据 #reply-control 是否已存在，决定启动哪个观察器
      const initialReplyNode = document.querySelector(CONFIG.SELECTORS.REPLY_CONTROL);
      if (initialReplyNode) {
        setupMainReplyObserver(initialReplyNode);
      } else {
        setupWaitForReplyElement();
      }

      Logger.log('初始化完成。');
    },
  };

  // 启动脚本
  Initializer.init();
})();

