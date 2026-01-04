// ==UserScript==
// @name         DeepSeek 网页总结助手
// @namespace    https://chat.openai.com/
// @version      1.4
// @description  框选网页内容，自动用 DeepSeek 生成总结，可自定义 Prompt 和 API Key！支持自动检测正文和Markdown渲染
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      api.deepseek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537909/DeepSeek%20%E7%BD%91%E9%A1%B5%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/537909/DeepSeek%20%E7%BD%91%E9%A1%B5%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 缓存变量
  let lastSummaryResult = null;
  let buttonsVisible = GM_getValue('deepseek_buttons_visible', true);

  // 注册TamperMonkey菜单
  GM_registerMenuCommand('⚙️ 设置 API Key 和 Prompt', () => {
    createSettingsPanel();
  });

  GM_registerMenuCommand(buttonsVisible ? '👁️ 隐藏DeepSeek按钮' : '👁️ 显示DeepSeek按钮', () => {
    toggleButtons();
  });

  GM_registerMenuCommand('🐛 切换调试模式', () => {
    const currentDebugMode = GM_getValue('deepseek_debug_mode', false);
    GM_setValue('deepseek_debug_mode', !currentDebugMode);

    // 显示通知
    const newStatus = !currentDebugMode ? '已开启' : '已关闭';
    alert(`🐛 调试模式${newStatus}\n${!currentDebugMode ? '总结结果将显示详细的调试信息' : '总结结果将不再显示调试信息'}`);
  });

  // 切换按钮显示状态
  function toggleButtons() {
    buttonsVisible = !buttonsVisible;
    GM_setValue('deepseek_buttons_visible', buttonsVisible);

    if (buttonsVisible) {
      autoSummaryButton.style.display = 'flex';
    } else {
      autoSummaryButton.style.display = 'none';
    }

    // 重新注册菜单命令
    // location.reload();
  }

  // 简单的Markdown渲染器
  function renderMarkdown(text) {
    return text
      // 标题
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // 斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // 代码块
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // 行内代码
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // 列表
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      // 换行
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // 包装列表项
    let result = '<p>' + result + '</p>';
    result = result.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    result = result.replace(/<\/ul>\s*<ul>/g, '');

    return result;
  }

  // 自动检测网页正文内容
  function extractMainContent() {
    // 常见的正文选择器，按优先级排序
    const contentSelectors = [
      // 语义化标签
      'main',
      'article',
      '[role="main"]',
      '.main-content',
      '.content',
      '.post-content',
      '.article-content',
      '.entry-content',
      '.page-content',

      // 常见的内容类名
      '.content-body',
      '.article-body',
      '.post-body',
      '.main-text',
      '.text-content',
      '.article-text',

      // 中文网站常见类名
      '.article',
      '.post',
      '.content-wrap',
      '.main-wrap',
      '.container .content',

      // 特定网站适配
      '.markdown-body', // GitHub
      '.Post-RichText', // 知乎
      '.content_area', // CSDN
      '.article-content', // 简书
      '.rich_media_content', // 微信公众号
      '.content', // 通用
    ];

    let bestContent = null;
    let maxScore = 0;

    for (const selector of contentSelectors) {
      const elements = document.querySelectorAll(selector);

      for (const element of elements) {
        const text = element.innerText || element.textContent || '';
        const textLength = text.trim().length;

        // 跳过太短的内容
        if (textLength < 100) continue;

        // 计算内容质量分数
        let score = textLength;

        // 加分项
        if (element.tagName === 'MAIN' || element.tagName === 'ARTICLE') score += 1000;
        if (element.querySelector('p')) score += 500; // 包含段落
        if (element.querySelector('h1, h2, h3, h4, h5, h6')) score += 300; // 包含标题

        // 减分项
        if (element.querySelector('nav')) score -= 200; // 包含导航
        if (element.querySelector('.sidebar')) score -= 200; // 包含侧边栏
        if (element.querySelector('.footer')) score -= 200; // 包含页脚
        if (element.querySelector('.header')) score -= 200; // 包含页头
        if (element.querySelector('.ad, .advertisement')) score -= 300; // 包含广告

        // 检查是否包含太多链接（可能是导航区域）
        const links = element.querySelectorAll('a');
        const linkRatio = links.length / (textLength / 100);
        if (linkRatio > 5) score -= 400;

        if (score > maxScore) {
          maxScore = score;
          bestContent = element;
        }
      }
    }

    // 如果没找到合适的内容，尝试body但排除明显的非内容区域
    if (!bestContent) {
      const bodyText = document.body.innerText || document.body.textContent || '';
      if (bodyText.trim().length > 200) {
        // 创建一个临时元素来清理内容
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = document.body.innerHTML;

        // 移除明显的非内容元素
        const removeSelectors = [
          'nav', 'header', 'footer', 'aside',
          '.nav', '.header', '.footer', '.sidebar', '.menu',
          '.advertisement', '.ad', '.ads', '.banner',
          'script', 'style', 'noscript'
        ];

        removeSelectors.forEach(selector => {
          const elements = tempDiv.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });

        bestContent = tempDiv;
      }
    }

    if (bestContent) {
      let text = bestContent.innerText || bestContent.textContent || '';

      // 清理文本
      text = text
        .replace(/\s+/g, ' ') // 合并多个空白字符
        .replace(/\n\s*\n/g, '\n') // 合并多个换行
        .trim();

      // 限制长度，避免内容过长
      if (text.length > 16000) {
        // 智能截断：尝试在句号、换行或段落处截断
        let cutPoint = 16000;
        const sentenceEnd = text.lastIndexOf('。', cutPoint);
        const paragraphEnd = text.lastIndexOf('\n\n', cutPoint);
        const lineEnd = text.lastIndexOf('\n', cutPoint);

        // 选择最佳截断点
        if (sentenceEnd > cutPoint - 500) {
          cutPoint = sentenceEnd + 1;
        } else if (paragraphEnd > cutPoint - 1000) {
          cutPoint = paragraphEnd;
        } else if (lineEnd > cutPoint - 200) {
          cutPoint = lineEnd;
        }

        text = text.substring(0, cutPoint) + '\n\n[内容过长，已智能截断...]';
      }

      return text;
    }

    return null;
  }

  // 创建模态背景
  function createModalBackground() {
    const overlay = document.createElement('div');
    overlay.className = 'deepseek-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);

    // 淡入效果
    setTimeout(() => overlay.style.opacity = '1', 10);

    return overlay;
  }

  // 创建设置面板
  function createSettingsPanel() {
    // 检查是否已存在设置面板
    const existingPanel = document.getElementById('deepseek-settings-panel');
    if (existingPanel) {
      existingPanel.remove();
      const existingOverlay = document.querySelector('.deepseek-modal-overlay');
      if (existingOverlay) existingOverlay.remove();
      return;
    }

    const overlay = createModalBackground();

    const panel = document.createElement('div');
    panel.id = 'deepseek-settings-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: #fff;
      border: none;
      padding: 25px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      max-width: 400px;
      width: 90%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      opacity: 0;
      transition: all 0.3s ease;
    `;

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #333; font-size: 18px;">🛠️ DeepSeek 设置</h3>
        <button id="deepseek-close" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        " title="关闭">×</button>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">API Key:</label>
        <input id="deepseek-key" type="password" style="
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        " placeholder="sk-xxx" />
      </div>

      <div style="margin-bottom: 25px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Prompt 模板:</label>
        <textarea id="deepseek-prompt" style="
          width: 100%;
          height: 100px;
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.2s;
          box-sizing: border-box;
        " placeholder="请总结以下内容：{content}"></textarea>
        <small style="color: #666; font-size: 12px;">使用 {content} 作为内容占位符</small>
      </div>

      <div style="margin-bottom: 25px;">
        <label style="display: flex; align-items: center; cursor: pointer; font-weight: 500; color: #333;">
          <input type="checkbox" id="deepseek-debug" style="margin-right: 8px; transform: scale(1.2);">
          显示调试信息（输入/输出长度等）
        </label>
        <small style="color: #666; font-size: 12px; margin-left: 24px;">开启后会在总结结果中显示详细的调试信息</small>
      </div>

      <div style="display: flex; gap: 10px;">
        <button id="deepseek-save" style="
          flex: 1;
          padding: 12px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        ">💾 保存配置</button>
        <button id="deepseek-cancel" style="
          padding: 12px 20px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        ">取消</button>
      </div>
    `;

    document.body.appendChild(panel);

    // 添加样式效果
    setTimeout(() => {
      panel.style.opacity = '1';
      panel.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // 加载保存的配置
    const savedKey = GM_getValue('deepseek_api_key', '');
    const savedPrompt = localStorage.getItem('deepseek_prompt_template') || "告诉我这篇文章最有价值的信息是什么：==={content}===，用中文回复";
    const savedDebug = GM_getValue('deepseek_debug_mode', false);
    if (savedKey) document.getElementById('deepseek-key').value = savedKey;
    document.getElementById('deepseek-prompt').value = savedPrompt;
    document.getElementById('deepseek-debug').checked = savedDebug;

    // 关闭面板函数
    function closePanel() {
      panel.style.opacity = '0';
      panel.style.transform = 'translate(-50%, -50%) scale(0.9)';
      overlay.style.opacity = '0';
      setTimeout(() => {
        panel.remove();
        overlay.remove();
      }, 300);
    }

    // 事件监听
    document.getElementById('deepseek-save').onclick = () => {
      const key = document.getElementById('deepseek-key').value.trim();
      const prompt = document.getElementById('deepseek-prompt').value.trim();
      const debugMode = document.getElementById('deepseek-debug').checked;

      if (!key) {
        alert('⚠️ 请输入 API Key');
        return;
      }

      GM_setValue('deepseek_api_key', key);
      localStorage.setItem('deepseek_prompt_template', prompt);
      GM_setValue('deepseek_debug_mode', debugMode);

      // 显示成功提示
      const saveBtn = document.getElementById('deepseek-save');
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '✅ 已保存';
      saveBtn.style.background = '#28a745';
      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = '#007bff';
        closePanel();
      }, 1000);
    };

    document.getElementById('deepseek-close').onclick = closePanel;
    document.getElementById('deepseek-cancel').onclick = closePanel;

    // 点击背景关闭
    overlay.onclick = closePanel;

    // ESC键关闭
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closePanel();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // 输入框焦点样式
    const inputs = panel.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.style.borderColor = '#007bff';
      });
      input.addEventListener('blur', () => {
        input.style.borderColor = '#e1e5e9';
      });
    });

    // 按钮悬停效果
    document.getElementById('deepseek-save').addEventListener('mouseenter', function() {
      this.style.background = '#0056b3';
    });
    document.getElementById('deepseek-save').addEventListener('mouseleave', function() {
      this.style.background = '#007bff';
    });

    document.getElementById('deepseek-cancel').addEventListener('mouseenter', function() {
      this.style.background = '#545b62';
    });
    document.getElementById('deepseek-cancel').addEventListener('mouseleave', function() {
      this.style.background = '#6c757d';
    });

    document.getElementById('deepseek-close').addEventListener('mouseenter', function() {
      this.style.backgroundColor = '#f8f9fa';
    });
    document.getElementById('deepseek-close').addEventListener('mouseleave', function() {
      this.style.backgroundColor = 'transparent';
    });
  }

  // 显示总结结果弹窗
  function showResultPopup(summary, duration, isMarkdown = true, originalContent = '') {
    // 移除已存在的结果弹窗
    const existingPopup = document.getElementById('deepseek-result-popup');
    if (existingPopup) existingPopup.remove();

    const overlay = createModalBackground();

    const popup = document.createElement('div');
    popup.id = 'deepseek-result-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: #fff;
      border: none;
      padding: 0;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      max-width: 800px;
      width: 90%;
      max-height: 85vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      opacity: 0;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    `;

    const durationText = duration ? ` (${duration}ms)` : '';
    const currentUrl = window.location.href;
    const domain = window.location.hostname;

    popup.innerHTML = `
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 25px;
        border-bottom: 1px solid #e1e5e9;
        background: #f8f9fa;
        border-radius: 15px 15px 0 0;
      ">
        <h3 style="margin: 0; color: #333; font-size: 18px;">📝 总结结果${durationText}</h3>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button id="save-result" style="
            background: #17a2b8;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: background-color 0.2s;
          " title="保存为文件">💾 保存</button>
          <button id="copy-result" style="
            background: #28a745;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: background-color 0.2s;
          " title="复制到剪贴板">📋 复制</button>
          <button id="close-result" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
          " title="关闭">×</button>
        </div>
      </div>

      <div style="
        padding: 25px;
        overflow-y: auto;
        flex: 1;
        line-height: 1.6;
        color: #333;
        font-size: 14px;
      " id="result-content"></div>
    `;

    document.body.appendChild(popup);

    // 设置内容 - 支持Markdown渲染
    const contentDiv = document.getElementById('result-content');
    if (isMarkdown && (summary.includes('**') || summary.includes('##') || summary.includes('*'))) {
      contentDiv.innerHTML = renderMarkdown(summary);

      // 为渲染后的内容添加样式
      contentDiv.style.cssText += `
        h1, h2, h3 { color: #2c3e50; margin: 20px 0 10px 0; }
        h1 { font-size: 24px; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { font-size: 20px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
        h3 { font-size: 18px; }
        strong { color: #e74c3c; font-weight: 600; }
        em { color: #8e44ad; font-style: italic; }
        code { background: #f8f9fa; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; color: #e83e8c; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 8px; overflow-x: auto; border-left: 4px solid #007bff; }
        pre code { background: none; padding: 0; color: #333; }
        ul, ol { margin: 10px 0; padding-left: 20px; }
        li { margin: 5px 0; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
        p { margin: 10px 0; }
      `;
    } else {
      contentDiv.textContent = summary;
    }

    // 添加动画效果
    setTimeout(() => {
      popup.style.opacity = '1';
      popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // 关闭函数
    function closePopup() {
      popup.style.opacity = '0';
      popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
      overlay.style.opacity = '0';
      setTimeout(() => {
        popup.remove();
        overlay.remove();
      }, 300);
    }

    // 生成文件名
    function generateFileName() {
      const now = new Date();
      const timestamp = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
      return `${domain}_${timestamp}.md`;
    }

    // 生成保存内容
    function generateSaveContent() {
      const now = new Date();
      const dateStr = now.toLocaleString('zh-CN');

      return `# 网页总结

## 基本信息
- **网站**: ${domain}
- **URL**: ${currentUrl}
- **总结时间**: ${dateStr}
- **处理耗时**: ${duration}ms

## 总结内容

${summary}

## 完整原始内容

\`\`\`
${originalContent}
\`\`\`

---
*由 DeepSeek 网页总结助手生成*`;
    }

    // 保存功能
    document.getElementById('save-result').onclick = () => {
      try {
        const content = generateSaveContent();
        const fileName = generateFileName();

        // 创建下载链接
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // 显示成功提示
        const saveBtn = document.getElementById('save-result');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '✅ 已保存';
        saveBtn.style.background = '#28a745';
        setTimeout(() => {
          saveBtn.innerHTML = originalText;
          saveBtn.style.background = '#17a2b8';
        }, 2000);

      } catch (error) {
        alert('保存失败：' + error.message);
      }
    };

    // 复制功能 - 复制原始文本而不是HTML
    document.getElementById('copy-result').onclick = async () => {
      try {
        await navigator.clipboard.writeText(summary);
        const copyBtn = document.getElementById('copy-result');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ 已复制';
        copyBtn.style.background = '#20c997';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.background = '#28a745';
        }, 1500);
      } catch (err) {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = summary;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('📋 内容已复制到剪贴板');
      }
    };

    // 事件监听
    document.getElementById('close-result').onclick = closePopup;
    overlay.onclick = closePopup;

    // ESC键关闭
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // 按钮悬停效果
    const buttons = [
      { id: 'save-result', normalColor: '#17a2b8', hoverColor: '#138496' },
      { id: 'copy-result', normalColor: '#28a745', hoverColor: '#1e7e34' },
    ];

    buttons.forEach(btn => {
      const element = document.getElementById(btn.id);
      element.addEventListener('mouseenter', function() {
        if (!this.innerHTML.includes('✅')) {
          this.style.background = btn.hoverColor;
        }
      });
      element.addEventListener('mouseleave', function() {
        if (!this.innerHTML.includes('✅')) {
          this.style.background = btn.normalColor;
        }
      });
    });

    document.getElementById('close-result').addEventListener('mouseenter', function() {
      this.style.backgroundColor = '#f8f9fa';
    });
    document.getElementById('close-result').addEventListener('mouseleave', function() {
      this.style.backgroundColor = 'transparent';
    });
  }

  // API 调用函数
  function getSummary(userText) {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const key = GM_getValue('deepseek_api_key', '');
      const promptTemplate = localStorage.getItem('deepseek_prompt_template') || "告诉我这篇文章最有价值的信息是什么：==={content}===，用中文回复";

      if (!key) {
        resolve({
          summary: "❌ 未设置 API Key，请在油猴菜单中进行配置",
          duration: Math.round(performance.now() - startTime),
          originalContent: userText
        });
        return;
      }

      const prompt = promptTemplate.replace('{content}', userText);
      const body = JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,  // 增加最大输出token数，确保总结不被截断
        top_p: 0.95,       // 添加top_p参数提高输出质量
        frequency_penalty: 0.1,  // 减少重复内容
        presence_penalty: 0.1    // 鼓励多样化表达
      });

      GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.deepseek.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + key
        },
        data: body,
        onload: function (res) {
          const duration = Math.round(performance.now() - startTime);
          try {
            const json = JSON.parse(res.responseText);
            if (json.error) {
              resolve({
                summary: "❌ API 错误：" + (json.error.message || json.error),
                duration: duration,
                originalContent: userText
              });
              return;
            }
            const result = json.choices?.[0]?.message?.content?.trim();

            // 添加调试信息
            const inputLength = userText.length;
            const outputLength = result ? result.length : 0;
            const finishReason = json.choices?.[0]?.finish_reason;

            let debugInfo = '';
            const debugMode = GM_getValue('deepseek_debug_mode', false);

            if (debugMode) {
              debugInfo = `\n\n---\n📊 调试信息：\n`;
              debugInfo += `• 输入长度：${inputLength} 字符\n`;
              debugInfo += `• 输出长度：${outputLength} 字符\n`;
              debugInfo += `• 完成原因：${finishReason || '未知'}\n`;
              debugInfo += `• 处理时间：${duration}ms`;

              if (finishReason === 'length') {
                debugInfo += `\n⚠️ 输出因长度限制被截断，建议缩短输入内容或调整max_tokens参数`;
              }
            }

            resolve({
              summary: (result || "❌ 无法生成总结") + debugInfo,
              duration: duration,
              originalContent: userText
            });
          } catch (e) {
            resolve({
              summary: "❌ 响应解析失败：" + e.message,
              duration: duration,
              originalContent: userText
            });
          }
        },
        onerror: function (err) {
          const duration = Math.round(performance.now() - startTime);
          resolve({
            summary: "❌ 请求失败，请检查网络连接",
            duration: duration,
            originalContent: userText
          });
        }
      });
    });
  }

  // 创建自动总结按钮
  const autoSummaryButton = document.createElement('button');
  autoSummaryButton.innerHTML = "🤖 智能总结";
  autoSummaryButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    z-index: 9996;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.2s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    user-select: none;
    display: ${buttonsVisible ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
  `;
  autoSummaryButton.title = "自动检测并总结网页正文";
  document.body.appendChild(autoSummaryButton);

  // 自动总结按钮悬停效果
  autoSummaryButton.addEventListener('mouseenter', () => {
    autoSummaryButton.style.transform = 'translateY(-2px)';
    autoSummaryButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
  });
  autoSummaryButton.addEventListener('mouseleave', () => {
    autoSummaryButton.style.transform = 'translateY(0)';
    autoSummaryButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  });

  // 自动总结按钮点击事件
  autoSummaryButton.addEventListener('click', async () => {
    // 检查是否已配置API Key
    const apiKey = GM_getValue('deepseek_api_key', '');
    if (!apiKey) {
      // 如果没有配置API Key，先弹出设置页面
      createSettingsPanel();
      return;
    }

    // 如果有缓存的结果，直接显示
    if (lastSummaryResult) {
      showResultPopup(
        lastSummaryResult.summary,
        lastSummaryResult.duration,
        true,
        lastSummaryResult.originalContent
      );
      return;
    }

    autoSummaryButton.innerHTML = "🔍 检测中...";
    autoSummaryButton.style.cursor = "wait";

    try {
      const mainContent = extractMainContent();

      if (!mainContent) {
        showResultPopup("❌ 未能检测到网页正文内容，请尝试手动选择文本进行总结", 0, false, '');
        return;
      }

      if (mainContent.length < 50) {
        showResultPopup("❌ 检测到的内容过短，请尝试手动选择文本进行总结", 0, false, mainContent);
        return;
      }

      autoSummaryButton.innerHTML = "⏳ 总结中...";
      const result = await getSummary(mainContent);

      // 缓存成功的结果
      if (!result.summary.startsWith('❌')) {
        lastSummaryResult = result;
      }

      showResultPopup(result.summary, result.duration, true, result.originalContent);

    } catch (error) {
      showResultPopup("❌ 自动总结时发生错误：" + error.message, 0, false, '');
    } finally {
      autoSummaryButton.innerHTML = "🤖 智能总结";
      autoSummaryButton.style.cursor = "pointer";
    }
  });

  // 添加全局样式，防止与网站样式冲突
  const style = document.createElement('style');
  style.textContent = `
    #deepseek-settings-panel *, #deepseek-result-popup * {
      box-sizing: border-box !important;
    }
  `;
  document.head.appendChild(style);

})();
