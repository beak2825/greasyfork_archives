// ==UserScript==
// @name         Two-Finger Long Press for Extend Selection
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Press and hold with two fingers to select the entire text block
// @author       ChatGPT
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527901/Two-Finger%20Long%20Press%20for%20Extend%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/527901/Two-Finger%20Long%20Press%20for%20Extend%20Selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let touchStartTime = 0;
    let twoFingerTouch = false;

    document.addEventListener("touchstart", (event) => {
        if (event.touches.length === 2) {
            twoFingerTouch = true;
            touchStartTime = Date.now();
        }
    });

    document.addEventListener("touchend", (event) => {
        if (twoFingerTouch && Date.now() - touchStartTime > 500) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const newRange = document.createRange();
                
                // 선택된 텍스트의 부모 요소를 찾기
                const parentElement = range.startContainer.parentNode;
                
                // 부모 요소의 모든 텍스트 노드를 선택
                selection.selectAllChildren(parentElement);
            }
        }
        twoFingerTouch = false;
    });
})();