// ==UserScript==
// @name         阿里云盘复制
// @license No License
// @namespace    http://tampermonkey.net/
// @version      2024-07-07
// @description  解决阿里云盘网页不能复制的问题
// @author       CunShao
// @match        https://www.alipan.com/*
// @match        https://www.aliyundrive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alipan.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499915/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/499915/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.onload = function() {
    console.log('************************************');

    setTimeout(() => {
      const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'childList') {
            document.querySelectorAll('.name--TC3kz').forEach(function(element) { // 根据实际类名调整
              if (!element.querySelector('button.copy-button')) { // 检查是否已经有复制按钮
                // 创建复制按钮
                var copyButton = document.createElement('button');
                copyButton.innerText = '复制';
                copyButton.classList.add('copy-button'); // 添加类名，便于选择和避免重复
                copyButton.style.marginLeft = '10px';
                copyButton.style.display = 'inline-block';
                copyButton.style.fontSize = '12px'; // 调整按钮字体大小
                copyButton.style.padding = '2px 5px'; // 调整按钮内边距
                copyButton.style.backgroundColor = '#007bff'; // 按钮背景颜色
                copyButton.style.color = '#fff'; // 按钮文字颜色
                copyButton.style.border = 'none'; // 去除按钮边框
                copyButton.style.borderRadius = '4px'; // 按钮圆角
                copyButton.style.cursor = 'pointer'; // 鼠标悬停时显示手型光标

                // 按钮点击事件
                copyButton.addEventListener('click', function(e) {
                  e.stopPropagation(); // 防止触发父元素的点击事件
                  var directoryText = element.innerText.replace('复制', ''); // 去除“复制”按钮的文字
                  navigator.clipboard.writeText(directoryText).then(function() {
                    // 创建提示消息
                    var alertBox = document.createElement('div');
                    alertBox.innerText = '文字已复制到剪贴板!';
                    alertBox.style.position = 'fixed';
                    alertBox.style.bottom = '10px';
                    alertBox.style.right = '10px';
                    alertBox.style.backgroundColor = '#28a745';
                    alertBox.style.color = '#fff';
                    alertBox.style.padding = '10px';
                    alertBox.style.borderRadius = '4px';
                    alertBox.style.zIndex = '1000';
                    document.body.appendChild(alertBox);

                    // 设置3秒后自动关闭提示消息
                    setTimeout(function() {
                      document.body.removeChild(alertBox);
                    }, 3000);
                  }).catch(function(err) {
                    console.error('无法复制文字: ', err);
                  });
                });

                // 将按钮添加到目录文本元素旁边
                element.appendChild(copyButton);
                element.style.display = 'flex'; // 使父元素成为flex容器
                element.style.alignItems = 'center'; // 垂直居中对齐
              }
            });
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      console.log('************************************');
    }, 1000); // 延时1秒
  };
})();
