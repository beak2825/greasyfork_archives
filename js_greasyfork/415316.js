// ==UserScript==
// @name         darker.mode
// @namespace    http://tampermonkey.net/
// @version      0.1.7.4
// @description  A better dark mode!
// @author       avishaiUniverse
// @match        https://www.fxp.co.il/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/415316/darkermode.user.js
// @updateURL https://update.greasyfork.org/scripts/415316/darkermode.meta.js
// ==/UserScript==

(function() {
    const httpGet = url => GM_xmlhttpRequest({ method: "GET", url, nocache: true, onload: function(response) { GM_addStyle(response.responseText) }});
    httpGet('https://raw.githubusercontent.com/avishaiDV/fxp_dark_mode/main/global.css');
    if(location.pathname == "/member.php"){
        httpGet('https://raw.githubusercontent.com/avishaiDV/fxp_dark_mode/main/profile.css');}
        if(location.pathname == "/chat.php" || "/private_chat.php"){
        httpGet('https://raw.githubusercontent.com/avishaiDV/fxp_dark_mode/main/chat.css');}
})();