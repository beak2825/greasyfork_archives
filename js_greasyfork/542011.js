// ==UserScript==
// @name         NodeImage图片上传助手
// @namespace    https://www.nodeimage.com/
// @version      1.0.2
// @description  在NodeSeek编辑器中粘贴图片自动上传到NodeImage图床
// @author       shuai
// @match        *://www.nodeseek.com/*
// @match        *://nodeimage.com/*
// @match        *://*.nodeimage.com/*
// @icon         https://cdn.nodeimage.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      nodeimage.com
// @connect      api.nodeimage.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542011/NodeImage%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542011/NodeImage%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/**
 * @file NodeImage Uploader - Tampermonkey Script
 * @author shuai
 * @version 1.0.0
 *
 * This script integrates the NodeImage image hosting service with the NodeSeek
 * website's editor. It allows users to upload images by pasting, dragging and
 * dropping, or using a dedicated toolbar button. It handles authentication,
 * provides real-time status feedback, and automatically inserts Markdown links
 * into the editor upon successful upload.
 */

(() => {
  'use strict';

  // ===== 全局配置 (Global Configuration) =====
  // 集中管理所有可配置的常量，便于维护和调整。
  const APP = {
    api: {
      key: GM_getValue('nodeimage_apiKey', ''),
      setKey: key => {
        GM_setValue('nodeimage_apiKey', key);
        APP.api.key = key;
        UI.updateState();
      },
      clearKey: () => {
        GM_deleteValue('nodeimage_apiKey');
        APP.api.key = '';
        UI.updateState();
      },
      endpoints: {
        upload: 'https://api.nodeimage.com/api/upload',
        apiKey: 'https://api.nodeimage.com/api/user/api-key'
      }
    },
    site: {
      url: 'https://www.nodeimage.com'
    },
    storage: {
      keys: {
        loginCheck: 'nodeimage_login_check',
        loginStatus: 'nodeimage_login_status',
        logout: 'nodeimage_logout'
      },
      get: key => localStorage.getItem(APP.storage.keys[key]),
      set: (key, value) => localStorage.setItem(APP.storage.keys[key], value),
      remove: key => localStorage.removeItem(APP.storage.keys[key])
    },
    retry: {
      max: 2,
      delay: 1000
    },
    statusTimeout: 2000,
    auth: {
      recentLoginGracePeriod: 30000, // 30秒内检查近期登录
      loginCheckInterval: 3000, // 轮询登录状态的间隔
      loginCheckTimeout: 300000 // 轮询登录状态的总超时
    }
  };

  // ===== DOM选择器 (DOM Selectors) =====
  // 定义脚本中使用的所有DOM选择器。
  const SELECTORS = {
    editor: '.CodeMirror',
    toolbar: '.mde-toolbar',
    imgBtn: '.toolbar-item.i-icon.i-icon-pic[title="图片"]',
    container: '#nodeimage-toolbar-container'
  };

  // ===== 状态常量 (Status Constants) =====
  // 定义不同状态下的样式和颜色，用于UI反馈。
  const STATUS = {
    SUCCESS: { class: 'success', color: '#42d392' },
    ERROR: { class: 'error', color: '#f56c6c' },
    WARNING: { class: 'warning', color: '#e6a23c' },
    INFO: { class: 'info', color: '#0078ff' }
  };

  const MESSAGE = {
    READY: 'NodeImage已就绪',
    UPLOADING: '正在上传...',
    UPLOAD_SUCCESS: '上传成功！',
    LOGIN_EXPIRED: '登录已失效',
    LOGOUT: '已退出登录',
    RETRY: (current, max) => `重试上传 (${current}/${max})`
  };

  // ===== DOM缓存 (DOM Cache) =====
  // 缓存频繁访问的DOM元素，以提高性能并集中管理。
  const DOM = {
    editor: null,
    statusElements: new Set(),
    loginButtons: new Set(),
    getEditor: () => DOM.editor?.CodeMirror
  };

  // ===== 全局样式 (Global Styles) =====
  // 通过 GM_addStyle 注入自定义CSS，美化UI组件。
  GM_addStyle(`
    #nodeimage-status {
      margin-left: 10px;
      display: inline-block;
      font-size: 14px;
      height: 28px;
      line-height: 28px;
      transition: all 0.3s ease;
    }
    #nodeimage-status.success { color: ${STATUS.SUCCESS.color}; }
    #nodeimage-status.error { color: ${STATUS.ERROR.color}; }
    #nodeimage-status.warning { color: ${STATUS.WARNING.color}; }
    #nodeimage-status.info { color: ${STATUS.INFO.color}; }

    .nodeimage-login-btn {
      cursor: pointer;
      margin-left: 10px;
      color: ${STATUS.WARNING.color};
      font-size: 14px;
      background: rgba(230, 162, 60, 0.1);
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(230, 162, 60, 0.2);
    }

    .nodeimage-toolbar-container {
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
  `);

  // ===== 工具函数 (Utility Functions) =====
  // 封装通用的、无副作用的辅助函数。
  const Utils = {
    /**
     * 判断当前是否在NodeImage相关网站。
     * @returns {boolean}
     */
    isNodeImageSite: () => /^(.*\.)?nodeimage\.com$/.test(window.location.hostname),

    /**
     * 异步等待指定选择器的元素出现在DOM中。
     * 对于单页应用(SPA)中动态加载的元素特别有用。
     * @param {string} selector - CSS选择器。
     * @returns {Promise<Element>}
     */
    waitForElement: selector => new Promise(res => {
      const el = document.querySelector(selector);
      if (el) return res(el);
      new MutationObserver((_, o) => {
        const found = document.querySelector(selector);
        if (found) { o.disconnect(); res(found); }
      }).observe(document.body, { childList: true, subtree: true });
    }),

    /**
     * 检查当前活动元素是否在编辑器中。
     * 用于判断用户是否在编辑器内进行粘贴、拖拽等操作。
     * @returns {boolean}
     */
    isEditingInEditor: () => {
      const a = document.activeElement;
      return a && (a.classList.contains('CodeMirror') || a.closest('.CodeMirror') || a.tagName === 'TEXTAREA');
    },

    /**
     * 创建一个文件输入元素，用于触发文件选择对话框。
     * @param {Function} cb - 文件选择完成后调用的回调函数。
     */
    createFileInput: cb => {
      const i = Object.assign(document.createElement('input'), { type: 'file', multiple: true, accept: 'image/*' });
      i.onchange = e => cb([...e.target.files]);
      i.click();
    },

    /**
     * 创建一个Promise来进行延迟。
     * @param {number} ms - 延迟的毫秒数。
     * @returns {Promise<void>}
     */
    delay: ms => new Promise(r => setTimeout(r, ms))
  };

  // ===== API通信 (API Communication) =====
  // 负责与NodeImage后端API进行所有网络交互。
  const API = {
    /**
     * 封装的通用GM_xmlhttpRequest请求，返回一个Promise。
     * @param {object} options - 请求配置。
     * @param {string} options.url - 请求URL。
     * @param {string} [options.method='GET'] - 请求方法。
     * @param {FormData|null} [options.data=null] - 请求体数据。
     * @param {object} [options.headers={}] - 自定义请求头。
     * @param {boolean} [options.withAuth=false] - 是否携带API Key。
     * @returns {Promise<any>}
     */
    request: ({ url, method = 'GET', data = null, headers = {}, withAuth = false }) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method,
          url,
          headers: {
            'Accept': 'application/json',
            ...(withAuth && APP.api.key ? { 'X-API-Key': APP.api.key } : {}),
            ...headers
          },
          data,
          withCredentials: true,
          responseType: 'json',
          onload: response => {
            if (response.status === 200 && response.response) {
              resolve(response.response);
            } else {
              reject(response);
            }
          },
          onerror: reject
        });
      });
    },

    /**
     * 检查用户在NodeImage网站的登录状态，并获取API Key。
     * 这是脚本实现自动登录的关键部分。
     * @returns {Promise<boolean>} - 返回是否成功获取到Key。
     */
    checkLoginAndGetKey: async () => {
      try {
        const response = await API.request({ url: APP.api.endpoints.apiKey });

        if (response.api_key) {
          APP.api.setKey(response.api_key);
          return true;
        }

        if (response.error) {
          APP.api.clearKey();
        }

        return false;
      } catch (error) {
        APP.api.clearKey();
        return false;
      }
    },

    /**
     * 上传单个图片文件，包含自动重试逻辑。
     * @param {File} file - 要上传的文件对象。
     * @param {number} [retries=0] - 当前重试次数。
     * @returns {Promise<{url: string, markdown: string}>} - 返回包含图片链接的对象。
     */
    uploadImage: async (file, retries = 0) => {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const result = await API.request({
          url: APP.api.endpoints.upload,
          method: 'POST',
          data: formData,
          withAuth: true
        });

        if (result.success) {
          return {
            url: result.links.direct,
            markdown: result.links.markdown
          };
        } else {
          const errorMsg = result.error || '未知错误';

          if (errorMsg.toLowerCase().match(/unauthorized|invalid api key|未授权|无效的api密钥/)) {
            APP.api.clearKey();
            throw new Error(MESSAGE.LOGIN_EXPIRED);
          }

          throw new Error(errorMsg);
        }
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          APP.api.clearKey();
          throw new Error(MESSAGE.LOGIN_EXPIRED);
        }

        if (retries < APP.retry.max) {
          setStatus(STATUS.WARNING.class, MESSAGE.RETRY(retries + 1, APP.retry.max));

          await Utils.delay(APP.retry.delay);
          return API.uploadImage(file, retries + 1);
        }

        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };

  // ===== UI与状态管理 (UI & Status Management) =====
  // 负责所有与界面显示、状态更新相关的操作。

  /**
   * 设置并显示一个状态消息。
   * @param {string} cls - 状态对应的CSS类 ('success', 'error', etc.)。
   * @param {string} msg - 要显示的消息文本。
   * @param {number} [ttl=0] - 消息显示时长（毫秒），0表示永久显示直到下次更新。
   * @returns {Promise<void>}
   */
  const setStatus = (cls, msg, ttl = 0) => {
    DOM.statusElements.forEach(el => { el.className = cls; el.textContent = msg; });
    if (ttl) return Utils.delay(ttl).then(UI.updateState);
  };

  const UI = {
    /**
     * 根据当前的登录状态，更新所有UI元素（状态文本、登录按钮等）。
     */
    updateState: () => {
      const isLoggedIn = Boolean(APP.api.key);

      DOM.loginButtons.forEach(btn => {
        btn.style.display = isLoggedIn ? 'none' : 'inline-block';
      });

      DOM.statusElements.forEach(el => {
        if (isLoggedIn) {
          el.className = STATUS.SUCCESS.class;
          el.textContent = MESSAGE.READY;
        } else {
          el.textContent = '';
        }
      });
    },

    /**
     * 打开NodeImage登录页面。
     * 通过localStorage设置'login_pending'状态，用于跨页面通信。
     */
    openLogin: () => {
      APP.storage.set('loginStatus', 'login_pending');
      window.open(APP.site.url, '_blank');
    },

    /**
     * 在NodeSeek编辑器的工具栏上创建并注入脚本的UI组件。
     * @param {Element} toolbar - 编辑器工具栏元素。
     */
    setupToolbar: toolbar => {
      if (!toolbar || toolbar.querySelector(SELECTORS.container)) return;

      const container = document.createElement('div');
      container.id = 'nodeimage-toolbar-container';
      container.className = 'nodeimage-toolbar-container';
      toolbar.appendChild(container);

      const imgBtn = toolbar.querySelector(SELECTORS.imgBtn);
      if (imgBtn) {
        const newBtn = imgBtn.cloneNode(true);
        imgBtn.parentNode.replaceChild(newBtn, imgBtn);
        newBtn.addEventListener('click', async () => {
          if (!APP.api.key || !(await Auth.checkLoginIfNeeded())) {
            UI.openLogin();
            return;
          }

          Utils.createFileInput(ImageHandler.handleFiles);
        });
      }

      const statusEl = document.createElement('div');
      statusEl.id = 'nodeimage-status';
      statusEl.className = STATUS.INFO.class;
      container.appendChild(statusEl);
      DOM.statusElements.add(statusEl);

      const loginBtn = document.createElement('div');
      loginBtn.className = 'nodeimage-login-btn';
      loginBtn.textContent = '点击登录NodeImage';
      loginBtn.addEventListener('click', UI.openLogin);
      loginBtn.style.display = 'none';
      container.appendChild(loginBtn);
      DOM.loginButtons.add(loginBtn);

      UI.updateState();
    }
  };

  // ===== 图片处理 (Image Handling) =====
  // 负责处理用户通过粘贴、拖拽等方式提供的图片数据。
  const ImageHandler = {
    /**
     * 处理编辑器的粘贴事件。
     * @param {ClipboardEvent} e - 粘贴事件对象。
     */
    handlePaste: e => {
      // 检查是否在编辑器中进行操作
      if (!Utils.isEditingInEditor()) return;

      const dt = e.clipboardData || e.originalEvent?.clipboardData;
      if (!dt) return;

      let files = [];

      // 处理剪贴板中的文件
      if (dt.files && dt.files.length) {
        files = Array.from(dt.files).filter(f => f.type.startsWith('image/'));
      }
      // 处理剪贴板中的项目
      else if (dt.items && dt.items.length) {
        files = Array.from(dt.items)
          .filter(i => i.kind === 'file' && i.type.startsWith('image/'))
          .map(i => i.getAsFile())
          .filter(Boolean);
      }

      if (files.length) {
        e.preventDefault();
        e.stopPropagation();

        // 同步检查API密钥是否存在，无需异步等待
        if (!APP.api.key) {
          UI.openLogin();
          return;
        }

        ImageHandler.handleFiles(files);
      }
    },

    /**
     * 统一处理文件列表，过滤非图片文件并上传。
     * @param {File[]} files - 文件对象数组。
     */
    handleFiles: files => {
      if (!APP.api.key) {
        UI.openLogin();
        return;
      }

      files.filter(file => file?.type.startsWith('image/'))
        .forEach(ImageHandler.uploadAndInsert);
    },

    /**
     * 封装单个文件的上传、插入Markdown链接以及状态更新的完整流程。
     * @param {File} file - 要处理的图片文件。
     */
    uploadAndInsert: async file => {
      setStatus(STATUS.INFO.class, MESSAGE.UPLOADING);

      try {
        const result = await API.uploadImage(file);
        ImageHandler.insertMarkdown(result.markdown);

        await setStatus(STATUS.SUCCESS.class, MESSAGE.UPLOAD_SUCCESS, APP.statusTimeout);
      } catch (error) {
        if (error.message === MESSAGE.LOGIN_EXPIRED) {
          await Auth.checkLoginIfNeeded(true);
        }

        const errorMessage = `上传失败: ${error.message}`;
        console.error('[NodeImage]', error);

        await setStatus(STATUS.ERROR.class, errorMessage, APP.statusTimeout);
      }
    },

    /**
     * 将Markdown文本插入到CodeMirror编辑器中。
     * @param {string} markdown - 要插入的Markdown文本。
     */
    insertMarkdown: markdown => {
      const cm = DOM.getEditor();
      if (cm) {
        const cursor = cm.getCursor();
        cm.replaceRange(`\n${markdown}\n`, cursor);
      }
    }
  };

  // ===== 认证管理 (Authentication Management) =====
  // 核心模块，管理API Key的获取、存储、验证和清除。
  const Auth = {
    /**
     * 按需检查登录状态。如果已有Key且非强制检查，则直接返回true。
     * @param {boolean} [forceCheck=false] - 是否强制从服务器获取最新状态。
     * @returns {Promise<boolean>} - 用户是否已登录。
     */
    checkLoginIfNeeded: async (forceCheck = false) => {
      if (APP.api.key && !forceCheck) {
        return true;
      }

      const isLoggedIn = await API.checkLoginAndGetKey();

      if (!isLoggedIn && APP.api.key) {
        setStatus(STATUS.WARNING.class, MESSAGE.LOGIN_EXPIRED);
      }

      UI.updateState();

      return isLoggedIn;
    },

    /**
     * 检查由其他页面设置的登出标志，并清除本地认证信息。
     * 用于多标签页之间的状态同步。
     */
    checkLogoutFlag: () => {
      if (APP.storage.get('logout') === 'true') {
        APP.api.clearKey();
        APP.storage.remove('logout');
        setStatus(STATUS.WARNING.class, MESSAGE.LOGOUT);
      }
    },

    /**
     * 检查近期是否在NodeImage网站登录过。
     * 如果是，则主动获取一次API Key，以应对浏览器缓存可能导致的状态不一致。
     */
    checkRecentLogin: async () => {
      const lastLoginCheck = APP.storage.get('loginCheck');
      if (lastLoginCheck && (Date.now() - parseInt(lastLoginCheck) < APP.auth.recentLoginGracePeriod)) {
        await API.checkLoginAndGetKey();
        APP.storage.remove('loginCheck');
      }
    },

    /**
     * 设置storage事件监听器，实现跨标签页通信。
     * 当在NodeImage网站登录成功或登出时，可以通知NodeSeek页面的脚本。
     */
    setupStorageListener: () => {
      window.addEventListener('storage', event => {
        const { loginStatus, logout } = APP.storage.keys;

        if (event.key === loginStatus && event.newValue === 'login_success') {
          API.checkLoginAndGetKey();
          localStorage.removeItem(loginStatus);
        } else if (event.key === logout && event.newValue === 'true') {
          APP.api.clearKey();
          localStorage.removeItem(logout);
        }
      });
    },

    /**
     * 监听点击事件，以检测用户在NodeImage网站上的登出操作。
     */
    monitorLogout: () => {
      document.addEventListener('click', e => {
        // 优先使用ID和class进行精确匹配，回退到文本匹配
        const logoutButton = e.target.closest('#logoutBtn, .logout-btn');
        if (logoutButton || e.target.textContent?.match(/登出|注销|退出|logout|sign out/i)) {
          APP.storage.set('logout', 'true');
        }
      });
    },

    /**
     * 在NodeImage网站上轮询检查登录状态。
     * 登录成功后，通过localStorage通知其他页面，并自动关闭当前窗口。
     */
    startLoginStatusCheck: () => {
      const checkLoginInterval = setInterval(async () => {
        try {
          const isLoggedIn = await API.checkLoginAndGetKey();

          if (isLoggedIn) {
            clearInterval(checkLoginInterval);

            APP.storage.remove('loginStatus');
            APP.storage.set('loginStatus', 'login_success');
            APP.storage.set('loginCheck', Date.now().toString());
          }
        } catch (error) {}
      }, APP.auth.loginCheckInterval);

      setTimeout(() => clearInterval(checkLoginInterval), APP.auth.loginCheckTimeout);
    },

    /**
     * 处理在NodeImage网站上时的特定逻辑。
     * 主要负责登录流程的发起和登出状态的监控。
     */
    handleNodeImageSite: () => {
      if (['/login', '/register', '/'].includes(window.location.pathname)) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
          loginForm.addEventListener('submit', () => {
            APP.storage.set('loginStatus', 'login_pending');
          });
        }

        // 只有当登录状态为"login_pending"时才启动登录检查
        if (APP.storage.get('loginStatus') === 'login_pending') {
          Auth.startLoginStatusCheck();
        }
      } else if (APP.storage.get('loginStatus') === 'login_pending') {
        Auth.checkLoginIfNeeded(true);
      }

      Auth.monitorLogout();
    }
  };

  // ===== 初始化 (Initialization) =====
  // 脚本的入口点和主逻辑流程。
  const init = async () => {
    // 如果在NodeImage网站，则执行特定的登录/登出辅助逻辑。
    if (Utils.isNodeImageSite()) {
      Auth.handleNodeImageSite();
      return;
    }

    // 在NodeSeek网站上的核心初始化流程
    // 1. 全局监听，捕获所有粘贴事件
    document.addEventListener('paste', ImageHandler.handlePaste);

    // 2. 页面重新获得焦点时，检查登录状态，确保信息最新
    window.addEventListener('focus', () => Auth.checkLoginIfNeeded());

    // 3. 异步等待编辑器加载完成，然后绑定拖拽上传事件
    Utils.waitForElement(SELECTORS.editor).then(editor => {
      DOM.editor = editor;

      // 编辑器级别不再绑定粘贴事件，因为已在document上全局处理
      editor.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      });

      editor.addEventListener('drop', e => {
        e.preventDefault();
        ImageHandler.handleFiles(Array.from(e.dataTransfer.files));
      });
    });

    // 4. 异步等待工具栏加载，然后注入UI
    Utils.waitForElement(SELECTORS.toolbar).then(UI.setupToolbar);

    // 5. 使用MutationObserver监控DOM变化，以应对SPA页面切换导致的UI丢失问题
    const observer = new MutationObserver(() => {
      const toolbar = document.querySelector(SELECTORS.toolbar);
      if (toolbar && !toolbar.querySelector(SELECTORS.container)) {
        UI.setupToolbar(toolbar);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // 6. 补充监听特定点击事件，兼容某些tab切换场景
    document.addEventListener('click', e => {
      if (e.target.closest('.tab-option')) {
        setTimeout(() => {
          const toolbar = document.querySelector(SELECTORS.toolbar);
          if (toolbar && !toolbar.querySelector(SELECTORS.container)) {
            UI.setupToolbar(toolbar);
          }
        }, 100);
      }
    });

    // 7. 启动时执行一系列认证状态检查
    Auth.checkLogoutFlag(); // 检查是否在其他页面登出
    Auth.setupStorageListener(); // 设置跨页面通信
    await Auth.checkRecentLogin(); // 检查是否刚在其他页面登录
    await Auth.checkLoginIfNeeded(); // 确保当前持有有效的API Key
  };

  // 脚本从load事件后开始执行
  window.addEventListener('load', init);
})();