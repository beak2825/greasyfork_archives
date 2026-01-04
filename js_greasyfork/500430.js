// ==UserScript==
// @name         cctv直播一步直达
// @namespace    https://github.com/helloworld
// @version      2025-1-2
// @description  点击‘导航栏直播直达直播界面’,原本需要‘捉迷藏’。
// @author       Benj
// @match        https://tv.cctv.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500430/cctv%E7%9B%B4%E6%92%AD%E4%B8%80%E6%AD%A5%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/500430/cctv%E7%9B%B4%E6%92%AD%E4%B8%80%E6%AD%A5%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cctv = $("a:contains('CCTV.直播')");
    cctv.attr('href',"https://tv.cctv.com/live/index.shtml");
var targetElement = document.getElementById('player_fullscreen_player');
        if (targetElement) {
            targetElement.click();
        }
})();