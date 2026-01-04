// ==UserScript==
// @name         斗鱼去广告
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  斗鱼去广告插件
// @description:en douyuen
// @author       favour
// @match        *://www.douyu.com/*
// @grant        none
// @name:en douyu
// @license GPLv3
// @run-at document-body
// @connect baidu.com
// @downloadURL https://update.greasyfork.org/scripts/448792/%E6%96%97%E9%B1%BC%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/448792/%E6%96%97%E9%B1%BC%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict'
    let style = document.createElement('style'),
        head = document.head;
    style.type = 'text/css';
    const text = document.createTextNode(`
    .ToTopBtn,#js-aside,.layout-Player-aside,#js-bottom,#js-room-activity,.layout-Player-guessgame,#js-player-dialog{display: none!important;}
    .layout-Player-main{margin-right: 0px!important;}
    .is-fullScreenPage #js-player-toolbar{display: none;}
     .is-fullScreenPage .layout-Player-video{bottom: 0!important;}
     .google-auto-placed, .adsbygoogle, .wm-general, .ScreenBannerAd{display:none !important;}
     .wm-general:nth-child(3){display:block !important}
    `)
    style.appendChild(text)
    head.appendChild(style)
})();