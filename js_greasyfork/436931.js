// ==UserScript==
// @name         嗨学网自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  嗨学网自动播放下一个
// @author       You
// @match        https://www.haixue.com/*
// @icon         https://www.haixue.com/v5/favicon.png
// @require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436931/%E5%97%A8%E5%AD%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/436931/%E5%97%A8%E5%AD%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    function PlayNext(){
        $('.src-pages-playback-components-Next-styles__nextProg--3BjiP').click();
    }
    window.setInterval(function(){ PlayNext();
                                 },1000 * 3);

})();