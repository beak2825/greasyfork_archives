// ==UserScript==
// @name         自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gogogo
// @author       gogo
// @match        https://www.91zhiyi.com/course/*
// @match        https://m.91zhiyi.com/#/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91zhiyi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496159/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/496159/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    player.muted()
    player.playbackRate(2)
    setInterval(function(){
            player.play();
}, 1000)
})();