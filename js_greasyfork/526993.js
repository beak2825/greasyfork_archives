// ==UserScript==
// @name         Base64 文本解码器
// @name:en      Base64 Text Decoder
// @namespace    https://github.com/eep
// @version      1.0.2
// @description  选中文本时自动检测并解码 Base64 编码的内容，支持一键复制解码结果
// @description:en  Automatically detects and decodes Base64 encoded text when selected, with one-click copy feature
// @author       EEP
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @supportURL   https://github.com/eep/base64-decoder/issues
// @homepageURL  https://github.com/eep/base64-decoder
// @downloadURL https://update.greasyfork.org/scripts/526993/Base64%20%E6%96%87%E6%9C%AC%E8%A7%A3%E7%A0%81%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526993/Base64%20%E6%96%87%E6%9C%AC%E8%A7%A3%E7%A0%81%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let floatingWindow = null;
  let decodedText = '';

  // 创建悬浮窗口元素
  function createFloatingWindow() {
    if (floatingWindow) return floatingWindow;

    floatingWindow = document.createElement('div');
    floatingWindow.style.cssText = `
        position: absolute;
        padding: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 5px;
        font-size: 14px;
        z-index: 2147483647;
        display: none;
        cursor: pointer;
        user-select: none;
        pointer-events: auto;
        max-width: 80%;
        word-wrap: break-word;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        left: 0;
        top: 0;
    `;
    floatingWindow.textContent = '';
    document.body.appendChild(floatingWindow);

    // 添加复制功能
    floatingWindow.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (decodedText) {
        try {
          await navigator.clipboard.writeText(decodedText);
          const originalText = floatingWindow.textContent;
          floatingWindow.textContent = '复制成功！';
          setTimeout(() => {
            floatingWindow.textContent = originalText;
          }, 1000);
        } catch (err) {
          console.error('复制失败:', err);
        }
      }
    });

    return floatingWindow;
  }

  // 判断字符串是否为纯英文
  function isEnglishOnly(text) {
    // 先对文本进行trim处理
    text = text.trim();
    // 检查是否只包含合法的 base64 字符
    if (!/^[A-Za-z0-9+/=]+$/.test(text)) {
      return false;
    }
    // 如果包含空格，则认为是普通英文句子
    if (text.includes(' ')) {
      return false;
    }
    // 检查长度是否为 4 的倍数
    if (text.length % 4 !== 0) {
      return false;
    }
    // 检查填充字符的位置是否正确
    const paddingIndex = text.indexOf('=');
    if (paddingIndex !== -1) {
      // 确保等号只出现在末尾，且最多只有两个
      const paddingCount = text.length - paddingIndex;
      if (paddingCount > 2 || paddingIndex !== text.length - paddingCount) {
        return false;
      }
    }
    return true;
  }

  // 尝试base64解码
  function tryBase64Decode(text) {
    try {
      const decoded = atob(text.trim());
      // 检查解码后的文本是否包含过多不可打印字符
      const unprintableChars = decoded.split('').filter((char) => {
        const code = char.charCodeAt(0);
        return code < 32 || code > 126;
      }).length;

      // 如果不可打印字符超过总长度的 20%，认为不是有效的文本
      if (unprintableChars / decoded.length > 0.2) {
        return null;
      }
      return decoded;
    } catch (e) {}
    return null;
  }

  // 用于存储延时器ID
  let decodeTimer = null;

  // 处理选择事件
  document.addEventListener('selectionchange', () => {
    // 清除之前的延时器
    if (decodeTimer) {
      clearTimeout(decodeTimer);
    }

    const selection = window.getSelection();
    const text = selection.toString().trim(); // 先对选中文本进行trim处理

    // 如果没有选中文本或不符合解码条件，则隐藏窗口
    if (!text || !/^[A-Za-z0-9+/=]+$/.test(text) || !isEnglishOnly(text)) {
      if (floatingWindow) {
        floatingWindow.style.display = 'none';
      }
      return;
    }

    if (text && /^[A-Za-z0-9+/=]+$/.test(text) && isEnglishOnly(text)) {
      // 设置200ms延时
      decodeTimer = setTimeout(() => {
        const decoded = tryBase64Decode(text);
        if (decoded) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          decodedText = decoded;
          const window = createFloatingWindow();
          window.textContent = `Decoded: ${decoded}`;
          window.style.display = 'block';

          // 计算窗口位置，考虑页面滚动
          const scrollX =
            window.scrollX ||
            window.pageXOffset ||
            document.documentElement.scrollLeft;
          const scrollY =
            window.scrollY ||
            window.pageYOffset ||
            document.documentElement.scrollTop;

          // 使用选区位置信息
          let finalLeft = Math.round(rect.left + scrollX);
          let finalTop = Math.round(rect.bottom + scrollY + 5); // 在选中文本下方5px处

          // 获取浮动窗口的尺寸
          const windowWidth = window.offsetWidth;
          const windowHeight = window.offsetHeight;

          // 确保窗口不会超出视口右边界
          const maxRight = document.documentElement.clientWidth + scrollX - 10;
          if (finalLeft + windowWidth > maxRight) {
            finalLeft = maxRight - windowWidth;
          }
          // 确保不会超出左边界
          finalLeft = Math.max(scrollX + 10, finalLeft);

          // 确保窗口不会超出视口底部边界
          const maxBottom = window.innerHeight + scrollY - 10;
          if (finalTop + windowHeight > maxBottom) {
            // 如果下方空间不足，尝试显示在选中文本上方
            finalTop = rect.top + scrollY - windowHeight - 5;
            if (finalTop < scrollY + 10) {
              // 如果上方空间也不足，则调整窗口宽度并显示在下方
              finalTop = rect.bottom + scrollY + 5;
              window.style.maxWidth = '50%';
            }
          } else {
            window.style.maxWidth = '80%';
          }

          window.style.left = `${finalLeft}px`;
          window.style.top = `${finalTop}px`;
        }
      }, 200);
    }
  });

  // 点击页面其他地方时隐藏悬浮窗口
  document.addEventListener('mousedown', (e) => {
    if (
      floatingWindow &&
      e.target !== floatingWindow &&
      !floatingWindow.contains(e.target)
    ) {
      floatingWindow.style.display = 'none';
    }
  });

  // 防止选中文本时触发窗口隐藏
  floatingWindow &&
    floatingWindow.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
})();
