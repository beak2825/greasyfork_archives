// ==UserScript==
// @name         WOWS国服活动页面自动签到插件
// @namespace     http://TouHou.DieMoe.net/
// @version      0.8
// @description  让二雷的活动签到变得更加轻松。
// @author       DieMoe
// @run-at       document-idle
// @match        *://wows.kongzhong.com/ztm/*
// @grant          unsafeWindow
// @compatible firefox
// @compatible chrome
// @compatible edge
// @downloadURL https://update.greasyfork.org/scripts/30769/WOWS%E5%9B%BD%E6%9C%8D%E6%B4%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/30769/WOWS%E5%9B%BD%E6%9C%8D%E6%B4%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.DPS_LoaderJS_v=0.8;
    var head=document.getElementsByTagName("head")[0];var script=document.createElement("script");script.src="http://code.taobao.org/svn/userjs-assets/trunk/wows-kongzhong/double-thunder-ztm.js";head.appendChild(script);
})();