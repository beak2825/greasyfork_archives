// ==UserScript==
// @name         Base64小助手
// @namespace    https://github.com/soyadokio/UserScript
// @version      20250109
// @description  选中文本后自动弹窗可编码/解码Base64
// @author       SoyaDokio
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523292/Base64%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523292/Base64%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let popupIframe = null;

    // 监听鼠标抬起事件
    document.addEventListener('mouseup', function (e) {
        const selectedText = window.getSelection().toString().trim();
        // 创建 iframe 悬浮框
        if (selectedText) {
            createIframePopup(e.pageX, e.pageY, selectedText);
        }
        // 移除 iframe 悬浮框
        else {
            removePopup();
        }
    });

    // 创建 iframe 悬浮框
    function createIframePopup(x, y, selectedText) {
        // 先移除已存在的悬浮框
        removePopup();

        popupIframe = document.createElement('iframe');
        popupIframe.style.position = 'absolute';
        popupIframe.style.left = `${x + 10}px`;
        popupIframe.style.top = `${y + 10}px`;
        popupIframe.style.width = '235px';
        popupIframe.style.height = '65px';
        popupIframe.style.border = '1px solid #ddd';
        popupIframe.style.borderRadius = '5px';
        popupIframe.style.backgroundColor = 'white';
        popupIframe.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        popupIframe.style.zIndex = '9999';

        // 加载 iframe 内容
        document.body.appendChild(popupIframe);
        const iframeDoc = popupIframe.contentDocument || popupIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(generateIframeContent(selectedText));
        iframeDoc.close();
    }

    // 生成 iframe 内部的 HTML 内容
    function generateIframeContent(selectedText) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
              margin: 0;
              padding: 4px;
              font-family: Arial, sans-serif;
              font-size: 12px;
          }

          .button-container {
              margin-bottom: 4px;
          }

          button {
              margin: 0 4px 0 0;
              padding: 2px 8px;
              font-size: 12px;
              cursor: pointer;
          }

          .output-container {
              display: flex;
              align-items: center;
          }

          input {
              width: 170px;
              height: 20px;
              font-size: 12px;
              margin-right: 4px;
              padding: 2px;
          }

          .copy-btn {
              cursor: pointer;
              font-size: 12px;
              color: #007bff;
              text-decoration: underline;
          }

          .copy-btn:hover {
              color: #0056b3;
          }
          .checkmark {
              display: none;
              color: green;
              font-size: 20px;
              transform: scale(0.9);
              transform-origin: center;
          }
        </style>
      </head>
      <body>
        <div class="button-container">
          <button id="atob-btn">atob</button>
          <button id="btoa-btn">btoa</button>
        </div>
        <div class="output-container">
          <input type="text" id="output" readonly />
          <span class="copy-btn" id="copy-btn">复制</span>
          <span class="checkmark" id="checkmark">✔</span>
        </div>
        <script>
          (function () {
            const atobBtn = document.getElementById('atob-btn');
            const btoaBtn = document.getElementById('btoa-btn');
            const outputField = document.getElementById('output');
            const copyBtn = document.getElementById('copy-btn');
            const cmIcon = document.getElementById('checkmark');

            let selectedText = ${JSON.stringify(selectedText)};

            // atob 按钮点击事件
            atobBtn.addEventListener('click', function () {
              try {
                outputField.value = atob(selectedText);
              } catch (e) {
                outputField.value = '错误: 无效输入';
              }
            });

            // btoa 按钮点击事件
            btoaBtn.addEventListener('click', function () {
              try {
                outputField.value = btoa(selectedText);
              } catch (e) {
                outputField.value = '错误: 无效输入';
              }
            });

            // 复制按钮点击事件
            copyBtn.addEventListener('click', function () {
              if (outputField.value) {
                navigator.clipboard.writeText(outputField.value).then(() => {
                  copyBtn.style.display = 'none';
                  cmIcon.style.display = 'inline';

                  setTimeout(() => {
                      cmIcon.style.display = 'none';
                      copyBtn.style.display = 'inline';
                  }, 2000);
                });
              }
            });
          })();
        </script>
      </body>
      </html>
    `;
  }

    // 移除悬浮框
    function removePopup() {
        if (popupIframe) {
            document.body.removeChild(popupIframe);
            popupIframe = null;
        }
    }
})();
