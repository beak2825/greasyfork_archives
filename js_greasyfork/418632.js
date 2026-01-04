// ==UserScript==
// @name         Paiza Run Shortcut
// @name:ja      Paiza.io実行ショートカット
// @namespace    https://greasyfork.org/ja/users/570127
// @version      2025.12.25.2
// @description  You can run the code by using Ctrl + Enter in paiza.io
// @description:ja paiza.ioの画面全体でCtrl+Enterを用い実行できます。
// @author       universato
// @grant        none
// @match        https://paiza.io/projects/*
// @match        https://paiza.io/*/projects/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/102pi711qso33k7hbdbtf5hd6zm9
// @license      MIT
// @supportURL   https://x.com/universato
// @downloadURL https://update.greasyfork.org/scripts/418632/Paiza%20Run%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/418632/Paiza%20Run%20Shortcut.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter') return;
        if (event.altKey || event.shiftKey) return;
        if (event.isComposing) return;
        if (event.repeat) return;

        // Mac: control -> ctrlKey, command -> metaKey
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter'){
            document.querySelector('.submit-button')?.click();
        }
    });
})();