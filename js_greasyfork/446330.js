// ==UserScript==
// @name         设置Surface为桌面端
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  对于Surface等触摸屏设备，将设备设置为桌面端，关闭触摸检测
// @author       wanzhiyu
// @license      MIT
// @match        *://*.feynmanlectures.caltech.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446330/%E8%AE%BE%E7%BD%AESurface%E4%B8%BA%E6%A1%8C%E9%9D%A2%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/446330/%E8%AE%BE%E7%BD%AESurface%E4%B8%BA%E6%A1%8C%E9%9D%A2%E7%AB%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    Object.defineProperty(navigator, "maxTouchPoints", {
        get: function () {
            return "0";
        }
    });
    Object.defineProperty("isTouchDevice", {
        get: function () {
            return "false";
        }
    });
})();