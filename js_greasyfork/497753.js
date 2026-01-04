// ==UserScript==
// @name         视频长按快进，主要是手机用
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  主要是手机kiwi浏览器用
// @author       You
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        http*://*/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/497753/%E8%A7%86%E9%A2%91%E9%95%BF%E6%8C%89%E5%BF%AB%E8%BF%9B%EF%BC%8C%E4%B8%BB%E8%A6%81%E6%98%AF%E6%89%8B%E6%9C%BA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/497753/%E8%A7%86%E9%A2%91%E9%95%BF%E6%8C%89%E5%BF%AB%E8%BF%9B%EF%BC%8C%E4%B8%BB%E8%A6%81%E6%98%AF%E6%89%8B%E6%9C%BA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let eventbind = false

    $(document).ready(function () {

        $(document).bind("DOMNodeInserted", function () {
            speedup()
        })
    });

    function speedup(){
        let pressTimer
        let videoclass  = "video.player"
        if(!eventbind){
            $("video").parent().on('mousedown touchstart', function() {
                eventbind = true
                pressTimer = window.setTimeout(function() {
                    // 长按事件处理
                    $("video")[0].playbackRate = 3
                }, 1000);
            }).on('mouseup touchend', function() {
                $("video")[0].playbackRate = 1
                window.clearTimeout(pressTimer);
            });
        }
    }

})();