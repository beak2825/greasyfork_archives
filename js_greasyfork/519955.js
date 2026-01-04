// ==UserScript==
// @name         履约-xingyun-自动勾选复选框
// @namespace    http://tampermonkey.net/
// @description  履约-xingyun-自动勾选刷新-
// @version      3.0
// @license MIT
// @author       wxq
// @include      http://xingyun.jd.com/jdosCD/ls/*
// @include      http://jagile.jd.com/jdosCD/ls/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519955/%E5%B1%A5%E7%BA%A6-xingyun-%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%A4%8D%E9%80%89%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/519955/%E5%B1%A5%E7%BA%A6-xingyun-%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%A4%8D%E9%80%89%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    function waitForElement(selector, callback, timeout = 60000, interval = 1000) {
        const startTime = Date.now();
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                setTimeout(checkElement, interval);
            }
        };
        checkElement();
    }

    function checkCheckbox(checkbox) {
        if (checkbox && !checkbox.checked) {
            try {
                checkbox.click();
                setTimeout(() => {
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }, 100);
            } catch (error) {}
        }
    }

    function checkRadioButton(radioButton) {
        if (radioButton && !radioButton.checked) {
            try {
                radioButton.click();
                setTimeout(() => {
                    if (!radioButton.checked) {
                        radioButton.checked = true;
                        radioButton.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }, 100);
            } catch (error) {}
        }
    }

    function checkSpecificCheckbox() {
        const selectors = {
            'xingyun.jd.com/deeptest': '[id^="rc-tabs-"] .ant-row.dt-invoke-footer-btn input.ant-checkbox-input[type="checkbox"]',
            'jagile.jd.com/deeptest': '[id^="rc-tabs-"] .ant-row.dt-invoke-footer-btn input.ant-checkbox-input[type="checkbox"]',
            'xingyun.jd.com/jdosCD/ls': '.topActions-right__autoRefresh input[type="checkbox"]',
            'jagile.jd.com/jdosCD/ls': '.topActions-right__autoRefresh input[type="checkbox"]'
        };

        const currentDomain = Object.keys(selectors).find(domain => location.href.includes(domain));
        if (currentDomain) {
            const selector = selectors[currentDomain];
            waitForElement(selector, checkCheckbox);
        }

        // 新增自动选中单选按钮的逻辑
        const radioSelector = 'div[id^="jdosCD_"] label[role="radio"] input[type="radio"][value="inactive"]';
        waitForElement(radioSelector, checkRadioButton);
    }

    function initScript() {
        setTimeout(checkSpecificCheckbox, 2000);
    }

    function checkUrlChange() {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            initScript();
        }
    }

    const pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        checkUrlChange();
    };

    window.addEventListener('popstate', checkUrlChange);

    initScript();

    setInterval(checkUrlChange, 1000);

    const observer = new MutationObserver(() => {
        checkSpecificCheckbox();
    });

    const config = { childList: true, subtree: true };
    const targetNode = document.body;
    observer.observe(targetNode, config);

    setInterval(checkSpecificCheckbox, 30000);
})();