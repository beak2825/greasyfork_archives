// ==UserScript==
// @name         flomo> Show Whitespace
// @namespace    BetterCallSlade.com
// @version      1
// @description  显示memo的空格
// @author       BetterCallSlade
// @match        *://flomoapp.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442171/flomo%3E%20Show%20Whitespace.user.js
// @updateURL https://update.greasyfork.org/scripts/442171/flomo%3E%20Show%20Whitespace.meta.js
// ==/UserScript==

window.onload = function () {
    const memos = document.getElementsByClassName('content');

    function convertWhitespaceToDot(memoText) {
        return memoText.replaceAll(' ', '·')
    }

    for (let i = 0; i < memos.length; i++) {
        let memo = memos[i];
        memo.innerText = convertWhitespaceToDot(memo.innerText);
    }
}