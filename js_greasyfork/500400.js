// ==UserScript==
// @name         D-PAR-yes-WX
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://wanx.myapp.com/aop/audit/71642*
// @match        https://wanx.myapp.com/aop/audit/71870?type=audit
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/500400/D-PAR-yes-WX.user.js
// @updateURL https://update.greasyfork.org/scripts/500400/D-PAR-yes-WX.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var observer = new MutationObserver(function(mutationsList, observer) {
        mutationsList.forEach(function(mutation) {
            console.log('DOM 发生了变化:', mutation);
            checkTriggerElement();
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    var isClickCompleted = true; // 点击是否已经完成的标志位，默认为 true

    function checkTriggerElement() {
        var triggerElementSelector = 'div.label-radio:nth-child(1)';
        var triggerElement = document.querySelector(triggerElementSelector);

        if (triggerElement) {
            console.log('触发元素已找到，选择器:', triggerElementSelector);

            if (isClickCompleted) {
                var randomDelay = Math.floor(Math.random() * (12000 - 8000 + 1)) + 8000;
                isClickCompleted = false;

                setTimeout(function() {
                    simulateClick();
                }, randomDelay);
            }
        } else {
            console.error('未找到触发元素，选择器:', triggerElementSelector);

            setTimeout(function() {
                checkTriggerElement();
            }, 1000);
        }
    }

    function simulateClick() {
        var clickElementSelector = 'button.el-button--primary';
        var clickElement = document.querySelector(clickElementSelector);

        if (clickElement && !clickElement.disabled) {
            clickElement.click();
            console.log('已点击按钮，选择器:', clickElementSelector);

            clickElement.disabled = true;
            setTimeout(function() {
                clickElement.disabled = false;
            }, 1000);
        } else {
            console.error('选择器为' + clickElementSelector + '的元素未找到或已被禁用');

            setTimeout(function() {
                checkTriggerElement();
            }, 1000);
        }

        isClickCompleted = true;
    }

    checkTriggerElement();
})();
