// ==UserScript==
// @name         网页分辨率自动缩放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  对于使用副屏的用户，网页可以自动调整缩放比例。用户需要根据不同的屏幕尺寸选择缩放的大小，目前的设置是当分辨率为2560*1440时，缩放为125%，当分辨率为1920*1080时，缩放为100%。
// @author       Shawn Leo
// @include      *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436198/%E7%BD%91%E9%A1%B5%E5%88%86%E8%BE%A8%E7%8E%87%E8%87%AA%E5%8A%A8%E7%BC%A9%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/436198/%E7%BD%91%E9%A1%B5%E5%88%86%E8%BE%A8%E7%8E%87%E8%87%AA%E5%8A%A8%E7%BC%A9%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("屏幕分辨率为：" + screen.width + "*" + screen.height);
    if (screen.width === 2560 && screen.height === 1440) {
        document.body.style.zoom = "125%";
    }
    if (screen.width === 1920 && screen.height === 1080) {
        document.body.style.zoom = "100%";
    }
})();