// ==UserScript==
// @name         FUT BOT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.easports.com/*/fifa/ultimate-team/web-app/
// @grant        GM_xmlhttpRequest
// @run-at document-idle

// @downloadURL https://update.greasyfork.org/scripts/390489/FUT%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/390489/FUT%20BOT.meta.js
// ==/UserScript==


(function (){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.fifa-bot.com/buyer.js",
        onload: function(response) {
            eval(response.responseText)
        }
    });
})()

