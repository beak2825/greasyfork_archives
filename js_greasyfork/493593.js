// ==UserScript==
// @name         TMUE自动处理弹窗、点击确认和考试弹窗//切记子账号用此代码，主账号切勿使用
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Automatically handle popups, click confirm, and other buttons on https://seller.kuajingmaihuo.com/
// @author       Your Name
// @license MIT
// @match        https://seller.kuajingmaihuo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493593/TMUE%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86%E5%BC%B9%E7%AA%97%E3%80%81%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4%E5%92%8C%E8%80%83%E8%AF%95%E5%BC%B9%E7%AA%97%E5%88%87%E8%AE%B0%E5%AD%90%E8%B4%A6%E5%8F%B7%E7%94%A8%E6%AD%A4%E4%BB%A3%E7%A0%81%EF%BC%8C%E4%B8%BB%E8%B4%A6%E5%8F%B7%E5%88%87%E5%8B%BF%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493593/TMUE%E8%87%AA%E5%8A%A8%E5%A4%84%E7%90%86%E5%BC%B9%E7%AA%97%E3%80%81%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4%E5%92%8C%E8%80%83%E8%AF%95%E5%BC%B9%E7%AA%97%E5%88%87%E8%AE%B0%E5%AD%90%E8%B4%A6%E5%8F%B7%E7%94%A8%E6%AD%A4%E4%BB%A3%E7%A0%81%EF%BC%8C%E4%B8%BB%E8%B4%A6%E5%8F%B7%E5%88%87%E5%8B%BF%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to click buttons with specific text
    function clickPopupButtons(buttonText) {
        let buttons = document.querySelectorAll('button.BTN_outerWrapperBtn_5-109-0');
        buttons.forEach(function(button) {
            if (button.textContent.includes(buttonText)) {
                button.click();
            }
        });
    }

    // Helper function to close the new popup by clicking the SVG close icon
    function closeNewPopup() {
        let closeIcons = document.querySelectorAll('svg[data-testid="beast-core-icon-close"].ICN_outerWrapper_5-109-0');
        closeIcons.forEach(function(closeIcon) {
            let clickableParent = closeIcon.closest('button, div');
            if (clickableParent) {
                clickableParent.click();
            }
        });
    }

    // Helper function to click the confirmation span element
    function clickConfirmSpan() {
        let confirmSpans = document.querySelectorAll('button.BTN_outerWrapper_5-109-0 span');
        confirmSpans.forEach(function(span) {
            if (span.textContent === '确认') {
                span.click();
            }
        });
    }

    // Set an interval to try and click the buttons and close the popups every 500 milliseconds (0.5 second)
    setInterval(function() {
        clickPopupButtons('下一条');
        clickPopupButtons('我已阅读');
        closeNewPopup();
        clickConfirmSpan();
    }, 500);
})();
