// ==UserScript==
// @name        灰尼玛
// @namespace   org.glavo
// @version     0.1
// @license     Apache 2.0
// @author      anonymous
// @description 去除网页灰色滤镜。
// @match       *://*/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455793/%E7%81%B0%E5%B0%BC%E7%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/455793/%E7%81%B0%E5%B0%BC%E7%8E%9B.meta.js
// ==/UserScript==


// https://stackoverflow.com/a/46516659/7659948
GM_addStyle ( `
    html {
        filter:grayscale(0) !important;
        -webkit-filter:grayscale(0) !important;
    }
` );