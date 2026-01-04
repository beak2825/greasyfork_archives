// ==UserScript==
// @name         MiWiFi Beta Remove Remove TpWatermark
// @name:zh-cn   小米路由器 Beta 去除水印
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove watermark from MiWiFi beta firmware.
// @description:zh-cn 去除小米路由器测试版固件的水印。
// @author       Howard Wu
// @license MIT
// @match        *://*/cgi-bin/luci/*
// @icon         *://miwifi.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459643/MiWiFi%20Beta%20Remove%20Remove%20TpWatermark.user.js
// @updateURL https://update.greasyfork.org/scripts/459643/MiWiFi%20Beta%20Remove%20Remove%20TpWatermark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('tp-watermark') == null) {
        return;
    }
    document.body.removeChild(document.getElementById('tp-watermark'));
})();
