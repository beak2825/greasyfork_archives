// ==UserScript==
// @name            移除bilibili直播间的马赛克
// @name:en         Remove the mosaic from the Bilibili live
// @namespace       http://tampermonkey.net/
// @version         2025-07-05
// @description     自动移除bilibili直播间网页版左下角和右下角的马赛克
// @description:en  Automatically remove the mosaic in the bottom left and right corners of the Bilibili live webpage version
// @author          TheChuan1503
// @match           https://live.bilibili.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/541717/%E7%A7%BB%E9%99%A4bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541717/%E7%A7%BB%E9%99%A4bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function action(){
        var doms = document.getElementsByClassName('web-player-module-area-mask')
        for (let i = 0; i < doms.length; i++) {
            var dom = doms[i]
            dom.style = {}
        }
    }
    setInterval(() => {
        action()
    }, 200)
})();