// ==UserScript==
// @name         Fucktimebest
// @namespace    http://dcinside.com
// @version      0.1
// @description  실베 보기 좆같아서 만든 스크립트
// @author       jwh0711
// @match        https://gall.dcinside.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522786/Fucktimebest.user.js
// @updateURL https://update.greasyfork.org/scripts/522786/Fucktimebest.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        const selectors = [
            "div.content_box.r_timebest",
            "div.content_box.r_dcmedia",
            "div.content_box.r_recommend"
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => element.remove());
        });
    }

    // 페이지 로드 후 실행
    window.addEventListener('load', removeElements);

    // 동적으로 생성되는 요소들을 위해 MutationObserver 사용 (선택적)
    const observer = new MutationObserver(removeElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();