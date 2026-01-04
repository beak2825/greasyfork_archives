// ==UserScript==
// @name         CHZZK - 애드블록 팝업 삭제
// @icon         https://play-lh.googleusercontent.com/wvo3IB5dTJHyjpIHvkdzpgbFnG3LoVsqKdQ7W3IoRm-EVzISMz9tTaIYoRdZm1phL_8
// @namespace    http://tampermonkey.net/

// @license      MIT
// @author       고기
// @version      250501
// @match        *://*.chzzk.naver.com/*
// @description  치지직 광고 차단 프로그램 감지 팝업 삭제

// @downloadURL https://update.greasyfork.org/scripts/527909/CHZZK%20-%20%EC%95%A0%EB%93%9C%EB%B8%94%EB%A1%9D%20%ED%8C%9D%EC%97%85%20%EC%82%AD%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/527909/CHZZK%20-%20%EC%95%A0%EB%93%9C%EB%B8%94%EB%A1%9D%20%ED%8C%9D%EC%97%85%20%EC%82%AD%EC%A0%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function blockAdblockPopup() {
        document.querySelectorAll('[role="alertdialog"]').forEach(popup => {
            if (popup.innerText.includes("광고 차단 프로그램을 사용 중이신가요?")) {
                popup.remove();
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    blockAdblockPopup();
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(blockAdblockPopup, 1000);
})();
