// ==UserScript==
// @name         Blogger Code Block Inserter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在Blogger编辑器添加代码块插入按钮
// @author       moran：http://blog.7998888.xyz/
// @match        https://www.blogger.com/blog/post/edit/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527796/Blogger%20Code%20Block%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/527796/Blogger%20Code%20Block%20Inserter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCodeButton() {
        const toolbar = document.querySelector('.hANwub');
        if (!toolbar) {
            setTimeout(addCodeButton, 1000);
            return;
        }

        if (document.querySelector('#code-block-button')) return;

        // 创建按钮容器，使用新的样式但保持原来的结构
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'code-block-button';
        buttonContainer.className = 'U26fgb mUbCce fKz7Od RUhlrc bsjNHb M9Bg4d';
        buttonContainer.setAttribute('role', 'button');
        buttonContainer.setAttribute('jscontroller', 'VXdfxd');
        buttonContainer.setAttribute('jsaction', 'click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef;touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc(preventDefault=true); touchcancel:JMtRjd;');
        
        // 使用新的按钮内部HTML结构
        buttonContainer.innerHTML = `
            <div class="VTBa7b MbhUzd" jsname="ksKsZd"></div>
            <span jsslot="" class="xjKiLb">
                <span class="Ce1Y1c" style="top: -9.5px">
                    <span class="DPvwYc sm8sCf GHpiyd" aria-hidden="true" style="font-size: 18px;width: 24px;text-align: center;display: inline-block;">&lt;&gt;</span>
                </span>
            </span>
        `;

        // 保持原来可以工作的点击事件处理
        buttonContainer.addEventListener('click', function() {
            const codeBlock = '<pre class="prettyprint lang-python">\n<code>\n// 在这里粘贴您的代码\nconsole.log("Hello World!");\n</code>\n<button class="copy-code-button">复制</button>\n</pre>\n';
            
            try {
                document.execCommand('insertText', false, codeBlock);
            } catch(e) {
                const editor = document.querySelector('[role="textbox"]');
                if (editor) {
                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;
                    editor.value = editor.value.slice(0, start) + codeBlock + editor.value.slice(end);
                    editor.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });

        // 插入到引用按钮后面
        const quoteButton = toolbar.querySelector('[data-tooltip="引用文字"]');
        if (quoteButton && quoteButton.parentNode) {
            quoteButton.parentNode.insertBefore(buttonContainer, quoteButton.nextSibling);
        }
    }

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        if (!document.querySelector('#code-block-button')) {
            addCodeButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始化
    addCodeButton();
})();