"use strict";
// ==UserScript==
// @name       消除哔哩哔哩暂停按钮
// @namespace    https://github.com/
// @version      2023.12.28
// @description   消除哔哩哔哩暂停按钮,方便截图
// @author       作者名
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/festival/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/cheese/play/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/483256/%E6%B6%88%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%9A%82%E5%81%9C%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/483256/%E6%B6%88%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%9A%82%E5%81%9C%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在这里放置你想要执行的代码
    var pauseButton = document.querySelectorAll('.bpx-player-video-area .bpx-player-state-wrap')[0];
    if (pauseButton) {
        pauseButton.hidden = !pauseButton.hidden;
    }
})();