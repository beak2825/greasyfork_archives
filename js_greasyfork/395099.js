// ==UserScript==
// @name         Do not display discord blocked messages + No emoji reaction popup
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  I don't care about blocked messages... removes the emojis, removes the hover bacckground color
// @author       Bum
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @match        https://discordapp.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395099/Do%20not%20display%20discord%20blocked%20messages%20%2B%20No%20emoji%20reaction%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/395099/Do%20not%20display%20discord%20blocked%20messages%20%2B%20No%20emoji%20reaction%20popup.meta.js
// ==/UserScript==

var RemoveReactionPopupMenu = true;

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
 [class^="blockedSystemMessage"] ,[class^="groupStart"] {display: none !important;}
` );
    if (RemoveReactionPopupMenu){
        GM_addStyle ( `
[class^="emojiButton"]:not(button){display: none !important;}
` );
    }
    GM_addStyle ( `
[class^="message"]:hover{background:transparent !important; }
` );

})();