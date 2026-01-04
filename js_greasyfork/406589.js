// ==UserScript==
// @name         速度固定
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  動画の速度を固定する
// @author       ぬ
// @match        https://*.app.box.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406589/%E9%80%9F%E5%BA%A6%E5%9B%BA%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/406589/%E9%80%9F%E5%BA%A6%E5%9B%BA%E5%AE%9A.meta.js
// ==/UserScript==

$(function(){
    setInterval(function(){
        document.querySelector('video').playbackRate = 16;
    },50);
})(jQuery);