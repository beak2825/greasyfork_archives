// ==UserScript==
// @name         Twitch ödül toplayıcı
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Twitch sadakat puanları otomatik toplar
// @author       OnurCB
// @match        https://www.twitch.tv/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395253/Twitch%20%C3%B6d%C3%BCl%20toplay%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/395253/Twitch%20%C3%B6d%C3%BCl%20toplay%C4%B1c%C4%B1.meta.js
// ==/UserScript==

(function() {
var $kutu = "div.tw-full-height.tw-relative.tw-z-above > div > div > div > button > span";

setInterval(function(){
    $($kutu).trigger( "click" );
},5000);

})();