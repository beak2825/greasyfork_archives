// ==UserScript==
// @name         好看视频 取消自动播放
// @namespace    haokan.baidu.com
// @version      0.1
// @description  在播放结束后，停止播放
// @author       e1399579
// @icon         https://hk.bdstatic.com/app/favicon.ico
// @match        *://haokan.baidu.com/v*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444345/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%20%E5%8F%96%E6%B6%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/444345/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%20%E5%8F%96%E6%B6%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

"use strict";
HTMLVideoElement.prototype.realAddEventListener = HTMLVideoElement.prototype.addEventListener;
HTMLVideoElement.prototype.addEventListener = function(type, listener, options) {
    if (type === "ended") {
        this.realAddEventListener(type, function() {
            this.pause();
            this.currentTime = 0;
        });
    } else {
        this.realAddEventListener(...arguments);
    }
};