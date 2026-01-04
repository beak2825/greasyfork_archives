// ==UserScript==
// @name         Twitch Better Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Turns black into gray
// @author       Bum
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @match        https://www.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/391267/Twitch%20Better%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/391267/Twitch%20Better%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyle") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    } GM_addStyle ( `
.root{
    --color-background-accent: var(--color-hinted-grey-1);
}
` );GM_addStyle ( `
.simplebar-scroll-content,.chat-input,.rooms-header{
   background: var(--color-hinted-grey-1);
}
` );
})();