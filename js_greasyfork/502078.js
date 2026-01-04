// ==UserScript==
// @name         自动填充表单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填充
// @author       72
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502078/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%A1%A8%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/502078/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%A1%A8%E5%8D%95.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function getElementText(element) {
        return Array.from(element.childNodes)
            .map(child => child.nodeType === Node.TEXT_NODE ? child.textContent.trim() : getElementText(child))
            .join(' ')
            .trim();
    }

    function autofill() {
        let filled = false;
        document.querySelectorAll('label, div, span').forEach(element => {
            const text = getElementText(element);
            let fillValue;

            switch (true) {
                case /^(贴吧id)$/.test(text): fillValue = '自动填充的名字'; break;
                case /^(姓名|姓名1)$/.test(text): fillValue = '香菜'; break;
                case /^(姓名2)$/.test(text): fillValue = '小王'; break;
                case /^(手机号|手机号1)$/.test(text): fillValue = '110'; break;
                case /^(手机号2)$/.test(text): fillValue = '112'; break;
                case /^(身份证|身份证1)$/.test(text): fillValue = '320'; break;
                case /^(身份证2)$/.test(text): fillValue = '220'; break;
            }

            if (fillValue !== undefined) {
                const inputField = element.closest('.ant-form-item, .ant-col')?.querySelector('input');
                if (inputField) {
                    inputField.value = fillValue;
                    filled = true;
                    console.log('Filled value:', fillValue, 'in input field.');
                } else {
                    console.log('Input field not found.');
                }
            }
        });

        // 滚动到页面底部
        window.scrollTo(0, document.body.scrollHeight);

        return filled;
    }

    function attemptAutofill(retries = 5, delay = 500) {
        let attempt = 0;
        const tryFill = () => {
            if (autofill() || attempt >= retries) return;
            attempt++;
            setTimeout(tryFill, delay);
        };
        tryFill();
    }

    setTimeout(() => attemptAutofill(), 100);

    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                attemptAutofill();
            }
        });
    }).observe(document.body, { attributes: true, childList: true, subtree: true });

    window.addEventListener('load', () => {
        attemptAutofill();
        window.scrollTo(0, document.body.scrollHeight);
    });

})();
