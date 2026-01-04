// ==UserScript==
// @name          复制链接文本
// @author        猫雷NyaRu_Official
// @description   在鼠标悬停在文本链接上时显示一个复制按钮，用于复制链接的文本内容。
// @version       1.0
// @license       Apache-2.0
// @match         *://*/*
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @grant         GM_getValue
// @grant         GM_setValue
// @namespace     https://greasyfork.org/zh-CN/users/719628
// @downloadURL https://update.greasyfork.org/scripts/474230/%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/474230/%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isEnabledDefault = false; // 默认禁用状态

    // 添加自定义样式
    GM_addStyle(`
        .copy-link-text-button {
            position: relative;
            display: inline-block;
            opacity: 0;
            font-size: 0;
            cursor: pointer;
            transition: opacity 0.2s ease-in-out;
        }

        .copy-link-text-button::before {
            content: "";
            display: inline-block;
            width: 0;
            height: 0;
            border-left: 9px solid transparent;
            border-right: 9px solid transparent;
            border-bottom: 15px solid #ccc;
            position: absolute;
            transform: translateX(-50%);
        }

        a:hover .copy-link-text-button {
            opacity: 1;
        }
    `);

    // 获取当前启用/禁用状态
    const isEnabled = GM_getValue('isEnabled', isEnabledDefault);

    // 注册菜单命令以切换启用/禁用状态
    GM_registerMenuCommand(
        `复制链接文本 - ${isEnabled ? '禁用' : '启用'}`,
        function() {
            GM_setValue('isEnabled', !isEnabled);
            location.reload(); // 刷新页面以应用更改
        }
    );

    if (isEnabled) {
        // 复制文本到剪贴板的函数
        function copyToClipboard(text) {
            const tempInput = document.createElement('input');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
        }

        // 查找文本链接并在悬停时添加复制按钮
        const textLinks = document.querySelectorAll('a');
        textLinks.forEach(link => {
            if (link.textContent.trim() !== '') {
                const copyButton = document.createElement('span');
                copyButton.className = 'copy-link-text-button';
                copyButton.addEventListener('click', function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    copyToClipboard(link.textContent);
                });

                link.appendChild(copyButton);
            }
        });
    }
})();