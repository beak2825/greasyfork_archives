// ==UserScript==
// @name         贴吧丸
// @namespace    http://tampermonkey.net/
// @version      0.1.2.210910
// @description  浏览移动端贴吧网页无需跳转登录
// @author       GAEE
// @match        *://tieba.baidu.com/*
// @match        *://m.tieba.com/*
// @match        *://jump2.bdimg.com/*
// @match        *://tiebac.baidu.com/*
// @match        *://c.tieba.baidu.com/*
// @match        *://byokpg.smartapps.cn/*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431588/%E8%B4%B4%E5%90%A7%E4%B8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/431588/%E8%B4%B4%E5%90%A7%E4%B8%B8.meta.js
// ==/UserScript==

// @note         0.1.2 去除可见广告
// @note         0.1.1 去除首页跳转APP横幅

(function() {
    'use strict';
    const _hostList = ['tieba.baidu.com', 'm.tieba.com', 'jump2.bdimg.com', 'tiebac.baidu.com', 'c.tieba.baidu.com', 'byokpg.smartapps.cn'];
    var WL = window.location;
    var host = WL.hostname;
    var path = WL.pathname;
    var flag = encodeURIComponent('GAEE::贴吧药丸');
    var style = document.createElement("style");
    style.innerText = ".nav-bar-wrapper, .appPromote, .appBottomPromote, .fixed_bar, .j_footer_link, .tb-banner-wrapper, .tb-hotthread-wrapper, [class*='__bdad-wrap'], swan-view[class*='__nestBannerAd'], swan-view[class*='__subchain-ad'], swan-button[class*='videopb-clear-btn swan-spider-tap']{display:none!important}";
    document.head.appendChild(style);
    var execute = window[flag];
    if(_hostList.indexOf(host)==-1 || execute){
        return;
    }
    execute = true;
    if(path.indexOf('/p/')!=-1){
        var tid = /[0-9]+/.exec(path);
        WL.replace(`https://byokpg.smartapps.cn/pages/pb/pb?tid=${tid}`);
    }
})();