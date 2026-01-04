// ==UserScript==
// @name         github-jump
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Read github code by jumping to vscode with one click
// @author       xrz
// @match        https://github.com/*/*
// @icon         https://github1s.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489040/github-jump.user.js
// @updateURL https://update.greasyfork.org/scripts/489040/github-jump.meta.js
// ==/UserScript==

GM_addStyle(".jump-btn{color: var(--color-btn-primary-text)!important;background-color:var(--color-btn-primary-bg)!important}");

(function() {
    'use strict';
    const btnMap = new Map([['Github1s','github1s.com'],['GithubDev','github.dev']]);

    function createAndAddButton(text, targetUrl) {
        const button = document.createElement("li");
        button.innerHTML = text;
        button.className = 'btn btn-sm jump-btn';
        const li = document.getElementsByClassName('pagehead-actions flex-shrink-0 d-none d-md-inline').item(0)?.getElementsByTagName('li')[0]
        document.getElementsByClassName('pagehead-actions flex-shrink-0 d-none d-md-inline').item(0)?.insertBefore(button, li)
        button.onclick = function() {
            const href = top.location.href.replace('github.com', targetUrl);
            window.open(href,'_blank');
        }
    }

    for (let [key, value] of btnMap.entries()) {
        createAndAddButton(key, value);
    }
})();