// ==UserScript==
// @name         Fix NT read/unread
// @namespace    http://nordic-t.co
// @version      0.2
// @description  Tis for NEW NEW NT
// @author       Kostecki
// @match        https://nordic-t.co/*
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/13369/Fix%20NT%20readunread.user.js
// @updateURL https://update.greasyfork.org/scripts/13369/Fix%20NT%20readunread.meta.js
// ==/UserScript==

//GM_addStyle(".read-fix .title a {color: #e74c3c;}");

//waitForKeyElements (".conversationList", fixthisshit);
//waitForKeyElements ("#messages", fixthisshit);

//function fixthisshit() {
//$('.conversationList > li').not('.unread').addClass('read-fix');
//}

$(function() {
    $('.HasNew').siblings().css({"color": "white", "font-weight": "bold"});
});