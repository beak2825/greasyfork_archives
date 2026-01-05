// ==UserScript==
// @name         净化小众软件
// @namespace    mutoe
// @version      0.3
// @description  净化小众软件主站(www.appinn.com) 脚本请放置在页面顶部运行, 以免页面抖动
// @author       mutoe
// @match        *://www.appinn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28873/%E5%87%80%E5%8C%96%E5%B0%8F%E4%BC%97%E8%BD%AF%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/28873/%E5%87%80%E5%8C%96%E5%B0%8F%E4%BC%97%E8%BD%AF%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var baseHideDom = '.sidebar,#postfooterinfo,#bdunc,#comments,#footer,#topbox,#fpost,.wpfp-addlink';
    baseHideDom += '.os-share-box,.comments-link,.ratings,#stopbox,a>img:not(.thumbnail_index)';

    var baseModify = baseHideDom+'{display:none !important;}';
    baseModify += '#outerwrapper,#outerbox,#outerheader,#header{background:#e8ddcb;}';
    baseModify += '#outerwrapper{margin:64px;}#wrapper{background:#fff}';
    baseModify += '#container,.spost.post{width:100% !important;}';
    baseModify += '#hbox{height: 96px;margin-bottom:0;}#container{padding-top:32px;}';

    // 核心代码 不懂勿动
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = baseModify;
    document.head.appendChild(style);
})();
