// ==UserScript==
// @name         ChessCom - No GameOver Dialog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Your Mother
// @author       You
// @match        https://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464250/ChessCom%20-%20No%20GameOver%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/464250/ChessCom%20-%20No%20GameOver%20Dialog.meta.js
// ==/UserScript==

(()=>{
    function addStyle(rules) {
        let s = document.createElement('style')
        s.innerText = rules
        document.head.appendChild(s)
        return s
    }

    addStyle(`.game-over-modal-content { display: none !important; }`)
})()