// ==UserScript==
// @name         Google Colab Auto-Reconnect
// @version      1.4
// @description  Auto-reconnect Google Colab every 60 seconds
// @author       recursive
// @match        https://colab.research.google.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1090562
// @downloadURL https://update.greasyfork.org/scripts/468182/Google%20Colab%20Auto-Reconnect.user.js
// @updateURL https://update.greasyfork.org/scripts/468182/Google%20Colab%20Auto-Reconnect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ClickConnect() {
        console.log("Reconnecting every 60 seconds");
        const connectButton = document.querySelector("colab-connect-button");
        if (connectButton) {
            connectButton.click();
        }
    }

    setInterval(ClickConnect, 1000 * 60);

    // ボタンクリック時にポップアップが表示されないようにする
    window.addEventListener("click", function(event) {
        const target = event.target;
        if (target.tagName === "PAPER-BUTTON" && target.getAttribute("aria-label") === "Connect" && target.parentNode.tagName === "COLAB-CONNECT-BUTTON") {
            event.stopPropagation();
            event.preventDefault();
        }
    }, true);
})();