// ==UserScript==
// @name         Bilibilier Conf.
// @namespace    https://greasyfork.org/zh-CN/scripts/435160-bilibilier-conf
// @version      0.3
// @description  make Bilibili video player auto widescreen
// @author       samzong.lu
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435160/Bilibilier%20Conf.user.js
// @updateURL https://update.greasyfork.org/scripts/435160/Bilibilier%20Conf.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var btn = document.getElementsByClassName('bilibili-player-iconfont bilibili-player-iconfont-widescreen-off')[0]

        if(btn !== null) {
            btn.click();
        }
    }, 1000)
})();