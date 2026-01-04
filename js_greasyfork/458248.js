// ==UserScript==
// @name         Netfilx prettier font
// @description  Use Microsoft JhengHei as Netfilx font.
// @namespace    nathan60107
// @author       nathan60107(貝果)
// @version      1.0.0
// @homepage     https://home.gamer.com.tw/creationCategory.php?owner=nathan60107&c=425332
// @match        https://www.netflix.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458248/Netfilx%20prettier%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/458248/Netfilx%20prettier%20font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fontStyle = `
.player-timedtext-text-container * {
    font-family: "Microsoft JhengHei" !important
}
`;
    let newStyle = document.createElement("style");
    newStyle.innerHTML = fontStyle;
    document.head.appendChild(newStyle);
})();