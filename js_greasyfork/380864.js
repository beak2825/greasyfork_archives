// ==UserScript==
// @name         Always Open Telegram Link with tp Protocol
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  convert the URL from "http://t.me" or "http://telegram.me" to "tp://"
// @author       Lee
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380864/Always%20Open%20Telegram%20Link%20with%20tp%20Protocol.user.js
// @updateURL https://update.greasyfork.org/scripts/380864/Always%20Open%20Telegram%20Link%20with%20tp%20Protocol.meta.js
// ==/UserScript==

(function(){
for(var i=0;i<document.links.length;i++){
    var anchor=document.links[i];
    if(anchor.href.match(/^\S*:\/\/t.me\//) || anchor.href.match(/^\S*:\/\/telegram.me\//)){
        var temp = anchor.href.replace(/^\S*.me\//, 'tg://resolve?domain=');
        document.links[i].href = temp;
        var method = "_self";
        document.links[i].target = method;
    }
}
})();