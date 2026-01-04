// ==UserScript==
// @name         屏蔽斗鱼弹幕特效
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动复制gitlab里的issue内容到剪切板,可直接粘贴到tower上使用.
// @author       LiTao
// @match        https://www.douyu.com/*
// @require        http://code.jquery.com/jquery-1.11.0.min.js
// @require        https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377910/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/377910/%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
    	$("#__h5player img").css("opacity","0");
    },500);
})();