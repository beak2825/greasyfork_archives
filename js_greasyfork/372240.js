// ==UserScript==
// @name         dailymotion undarken
// @name:zh-CN   dailymotion不变暗
// @namespace    gqqnbig.me
// @version      0.1
// @description  Do not darken the video when it's paused.
// @description:zh-CN  暂停视频时屏幕不变暗
// @author       gqqnbig
// @match        https://www.dailymotion.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372240/dailymotion%20undarken.user.js
// @updateURL https://update.greasyfork.org/scripts/372240/dailymotion%20undarken.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let text=`<style>
.np_Darken {
    display:none !important;
}
</style>`
    $("head").append($(text));
})();