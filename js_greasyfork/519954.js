// ==UserScript==
// @name         履约-deeptest自动勾选复选框
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  履约-deeptest自动勾选确认
// @license MIT
// @author       wxq
// @include      http://xingyun.jd.com/deeptest/*
// @include      http://jagile.jd.com/deeptest/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519954/%E5%B1%A5%E7%BA%A6-deeptest%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%A4%8D%E9%80%89%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/519954/%E5%B1%A5%E7%BA%A6-deeptest%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%A4%8D%E9%80%89%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    function waitForElements(selector, callback, timeout = 60000, interval = 1000) {
        const startTime = Date.now();
        const checkElements = () => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach((element, index) => {
                    callback(element, index);
                });
            } else if (Date.now() - startTime < timeout) {
                setTimeout(checkElements, interval);
            }
        };
        checkElements();
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

    function checkSpecificCheckboxes() {
        const selectors = {
            'xingyun.jd.com/deeptest': '[id^="rc-tabs-"] .ant-row.dt-invoke-footer-btn input.ant-checkbox-input[type="checkbox"]',
            'jagile.jd.com/deeptest': '[id^="rc-tabs-"] .ant-row.dt-invoke-footer-btn input.ant-checkbox-input[type="checkbox"]',
        };

        const currentDomain = Object.keys(selectors).find(domain => location.href.includes(domain));
        if (currentDomain) {
            const selector = selectors[currentDomain];
            waitForElements(selector, checkCheckbox);
        }
    }

    function initScript() {
        setTimeout(checkSpecificCheckboxes, 2000);
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
        checkSpecificCheckboxes();
    });

    const config = { childList: true, subtree: true };
    const targetNode = document.body;
    observer.observe(targetNode, config);

    setInterval(checkSpecificCheckboxes, 30000);
})();
