// ==UserScript==
// @name         Proste Prehraj to
// @namespace    http://tampermonkey.net/
// @version      2025-02-16
// @description  Prehraj.to free script
// @author       EmperorHeyman
// @match       *://prehraj.to/*
// @match       *://prehrajto.cz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=prehrajto.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527140/Proste%20Prehraj%20to.user.js
// @updateURL https://update.greasyfork.org/scripts/527140/Proste%20Prehraj%20to.meta.js
// ==/UserScript==

(function() {
    if (typeof sources !== 'undefined') {
        let h1 = document.getElementsByTagName("h1")[0];
        let buttons = "<h2 style='margin-top: 10px; color: #ff5722;'>Watch for free:</h2>";

        sources.videos.map((item) => {
            buttons += `<a href="${item.src}" style="
                display: inline-block;
                margin: 5px;
                padding: 10px 15px;
                background: #ff5722;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                font-size: 14px;
                transition: background 0.3s;
            " onmouseover="this.style.background='#e64a19'" onmouseout="this.style.background='#ff5722'">
                ${item.res}p
            </a>`;
        });

        h1.innerHTML = `${h1.innerHTML}<br/>${buttons}`;
    }
})();