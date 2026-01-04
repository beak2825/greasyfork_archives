// ==UserScript==
// @name         광고 제거 및 1080p 적용
// @namespace    http://tampermonkey.net/
// @version      2024-11-13
// @description  test
// @match        *://chzzk.naver.com/*
// @match        https://chzzk.naver.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517212/%EA%B4%91%EA%B3%A0%20%EC%A0%9C%EA%B1%B0%20%EB%B0%8F%201080p%20%EC%A0%81%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/517212/%EA%B4%91%EA%B3%A0%20%EC%A0%9C%EA%B1%B0%20%EB%B0%8F%201080p%20%EC%A0%81%EC%9A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('live_chatting_list_item')) {
                        console.log('live_chatting_list_item__0SGhw 추가됨, 무시');
                        return;
                    }
                    const adbb = document.querySelector(`[class^="popup_container"]`);
                    if (adbb) {
                        adbb.remove();
                        console.log("광고제거");
                    }
                    const qualityItem = document.querySelector(
                        `.pzp-pc-setting-quality-pane__list-container > li:first-child:not(.pzp-pc-ui-setting-item--checked) > div:nth-child(2)`
                );
                    if (qualityItem) {
                        const enterEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            keyCode: 13,
                            code: 'Enter',
                            which: 13,
                            bubbles: true,
                            cancelable: true
                        });
                        qualityItem.dispatchEvent(enterEvent);
                        console.log("1080p 클릭");
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();