// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  유동을 위한 고닉 차단법
// @author       ㅇㅇ
// @match        https://gall.dcinside.com/mgallery/board/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcinside.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475765/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/475765/New%20Userscript.meta.js
// ==/UserScript==

//숨기길 원하는 고닉의 갤로그 ID를 넣어라. https://gallog.dcinside.com/{여기 올 것을 넣으면 됨}
//예를 들어, 주딱을 예시로 차단한다면 damhiya를 "" 안에 넣는다.
const nickList = new Set(["", "", ]);

function cleanBoard() {
    const cmtList = document.querySelector('.cmt_list');
    if (!cmtList) {
        return;
    }
    const liElements = cmtList.querySelectorAll('li');
    liElements.forEach(li => {
        const dataUid = li.querySelector('.cmt_nickbox [data-uid]');
        if (dataUid && nickList.has(dataUid.getAttribute('data-uid'))) {
            li.remove();
        }
    });
}

function observeMutations() {
    const targetNode = document.body;
    const config = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };
    const observer = new MutationObserver(() => {
        cleanBoard();
    });
    observer.observe(targetNode, config);
}

(function () {
    'use strict';
    observeMutations();
})();