// ==UserScript==
// @name            京东 HTTP to HTTPS
// @version         0.2
// @author          LisonFan
// @match           http://*.jd.com/*
// @match           http://*.*.jd.com/*
// @grant           none
// @license         MIT License
// @namespace https://lisonfan.com/
// @description 将一些支持 https 的但是没有做跳转的网站跳到 https
// @downloadURL https://update.greasyfork.org/scripts/30753/%E4%BA%AC%E4%B8%9C%20HTTP%20to%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/30753/%E4%BA%AC%E4%B8%9C%20HTTP%20to%20HTTPS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.protocol=='http:') location.protocol = "https:";
})();