// ==UserScript==
// @name  TDPLAYER ACFUN H5 Player
// @namespace    http://tampermonkey.net/
// @description  替换HTML5播放器
// @author       疯狂减肥带
// @match        http://www.acfun.cn/*
// @match        http://www.acfun.tv/*
// @match        http://www.aixifan.com/*
// @match        http://acfun.cn/*
// @match        http://acfun.tv/*
// @match        http://aixifan.com/*
// @grant        none
// @version 0.0.1.20171128091825
// @downloadURL https://update.greasyfork.org/scripts/31013/TDPLAYER%20ACFUN%20H5%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/31013/TDPLAYER%20ACFUN%20H5%20Player.meta.js
// ==/UserScript==
(function() {
var f=document.createElement('script');
f.src='https://t5.haotown.cn/td/script.js?time='+new Date().getTime();
document.body.appendChild(f);
})();