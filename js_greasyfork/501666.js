// ==UserScript==
// @name         Twitch自動
// @version      0.1
// @description  自動
// @author       a
// @match        https://www.twitch.tv/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @namespace https://greasyfork.org/users/83168
// @downloadURL https://update.greasyfork.org/scripts/501666/Twitch%E8%87%AA%E5%8B%95.user.js
// @updateURL https://update.greasyfork.org/scripts/501666/Twitch%E8%87%AA%E5%8B%95.meta.js
// ==/UserScript==

$(function(){
    setInterval(function(){
        $('button[aria-label="ボーナスを受け取る"]').click();
    },5000);
})(jQuery);