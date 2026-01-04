// ==UserScript==
// @name         editorial_button2link
// @namespace    http://tampermonkey.net/
// @version      2024-01-10
// @description  OMCの問題ページの解説ボタンをリンクに変更します
// @author       tamuraup
// @match        https://onlinemathcontest.com/contests/*/tasks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484439/editorial_button2link.user.js
// @updateURL https://update.greasyfork.org/scripts/484439/editorial_button2link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let buttons=Array.from(document.querySelectorAll("#content button").values()).filter(x=>x.textContent=="解説");
    if(buttons.length>0){
        const btn=buttons[0];
        const url = window.location.toString().replace("tasks","editorial");
        const editorial_link = `<a class="btn btn-primary" type="button" href="${url}">解説</a>`;
        btn.insertAdjacentHTML("afterend", editorial_link);
        btn.remove();
    }
})();