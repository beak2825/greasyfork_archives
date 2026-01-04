// ==UserScript==
// @name         ChatGPT自动接上文继续
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  让ChatGPT在中断回答的时候自动输入「请接上文继续」并发送
// @author       yedsn
// @match        https://chat.openai.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466125/ChatGPT%E8%87%AA%E5%8A%A8%E6%8E%A5%E4%B8%8A%E6%96%87%E7%BB%A7%E7%BB%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/466125/ChatGPT%E8%87%AA%E5%8A%A8%E6%8E%A5%E4%B8%8A%E6%96%87%E7%BB%A7%E7%BB%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoSendFlag = false;
    let checkboxContainer = null;

    // 创建checkbox
    (function generateCheckbox() {

        // 创建checkbox
        checkboxContainer = document.createElement('button');
        checkboxContainer.classList.add('btn', 'btn-autosend', 'relative', 'border-0', 'md:border');
        checkboxContainer.style.fontSize = '.875rem';
        checkboxContainer.style.lineHeight = '1.25rem';
        const checkboxLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.style.marginRight = ".5rem";
        checkbox.type = 'checkbox';
        checkbox.id = 'auto-operate-checkbox';
        checkboxLabel.appendChild(checkbox);
        const label = document.createTextNode('中断后自动发送“请接上文继续”');
        checkboxLabel.appendChild(label);
        checkboxContainer.appendChild(checkboxLabel);

        checkbox.addEventListener('change', function() {
            autoSendFlag = this.checked;
        });

        // 添加样式
        const checkboxStyle = `
<style>
.dark .btn-autosend {
    --tw-border-opacity: 1;
    --tw-bg-opacity: 1;
    --tw-text-opacity: 1;
    background-color: rgba(52,53,65,var(--tw-bg-opacity));
    border-color: rgba(86,88,105,var(--tw-border-opacity));
    color: rgba(217,217,227,var(--tw-text-opacity));
}
.light .btn-autosend {
    background-color: rgba(255,255,255,1);
    border-color: rgba(0,0,0,.1);
    color: rgba(64,65,79,1);
}
</style>
        `;
        document.body.insertAdjacentHTML('beforeend', checkboxStyle);



    })();

    // 创建一个 MutationObserver 实例，监听 body 元素内子元素的变化
    const observer = new MutationObserver(function(mutations) {

        // document.body.appendChild(checkboxContainer);
        if(!document.getElementById("auto-operate-checkbox")) {
            const btnNeutral = document.querySelector('.btn-neutral');
            if(btnNeutral) {
                btnNeutral.parentNode.insertBefore(checkboxContainer, btnNeutral);
            }
        }


        if(autoSendFlag) {
            // 执行自动发送
            const button = document.querySelector('.btn-neutral');
            if (!button || button.querySelector('div').textContent.trim() != "Stop generating") {
                // debugger

                // 找到页面中最后一个不为 __next-route-announcer__ 的 p 元素
                const paragraphs = Array.from(document.getElementsByTagName('p'));
                const lastParagraph = paragraphs.filter(p => p.id !== '__next-route-announcer__').pop();

                // 检查最后一个 p 元素内容是否以中文句号结尾
                if (lastParagraph && !lastParagraph.parentNode.classList.contains('result-streaming') && !/\。$/.test(lastParagraph.textContent.trim())) {
                    setTimeout(function () {
                        // 找到 textarea 元素，并填充内容为 "请接上文继续"
                        const textarea = document.querySelector('textarea');
                        textarea.value = '请接上文继续';

                        // 触发 input 事件
                        const event = new Event('input', { bubbles: true });
                        textarea.dispatchEvent(event);

                        // 找到与 textarea 同级的 button 元素，并点击它
                        const siblingButton = textarea.nextElementSibling;
                        siblingButton.click();
                    }, Math.floor(Math.random() * (3000 - 500 + 1) + 500));
                }


            }
        }
    });

    const observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);

})();