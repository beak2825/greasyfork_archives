// ==UserScript==
// @name         彩云小译脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  彩云小译双语对照翻译!
// @author       lonelykid
// @include      https://*
// @include      http://*
// @exclude      *://*.google*/*
// @exclude      *://*.github*/*
// @exclude      *://*gov.cn/*
// @exclude      *://*edu.cn/*
// @exclude      *://*.cn/*
// @exclude      *://*.baidu.com/*
// @exclude      *://*.qq.com/*
// @exclude      *://*.bilibili.com/*
// @exclude      *://*.jianshu.com/*
// @exclude      *://*sspai.com/*
// @exclude      *://*cnki.net/*
// @exclude      *://*.160.com/*
// @exclude      *://*.huaweicloud.com/*
// @exclude      *://*ikeepstudying.com/*
// @exclude      *://*.ifdream.net/*
// @exclude      *://*.topthink.com/*
// @exclude      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?github\.com(:[0-9]{1,5})?\/.*$)/
// @exclude      *://*.wordpress.org/zh*
// @exclude      https://developer.wordpress.org/reference/*
// @exclude      *://*.oceanengine.com/*
// @exclude      *://*.lusongsong.com/*
// @exclude      *://*.cambridge.org/*
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jquery@1/dist/jquery.min.js
// @note         2021-02-05-v0.2 快捷键启用
// @note         2021-02-05-v0.1 初次发布
// @downloadURL https://update.greasyfork.org/scripts/421257/%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/421257/%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var background_key = 186;
$(document).keydown(function(e) {
    if ( e.which == background_key && !(e.metaKey || e.ctrlKey) && e.altKey ) {
        var el = document.activeElement;
        if (el && (el.tagName.toLowerCase() == 'input' && el.type == 'text' ||
                el.tagName.toLowerCase() == 'textarea')) {
            return true;
        }
        zfy();
        return true;
    }
});

GM_registerMenuCommand("翻译当前网页",zfy,'Y');

function zfy() {
    var cyfy = document.createElement("script");
    cyfy.type = "text/javascript";
    cyfy.charset = "UTF-8";
    cyfy.src = ("https:" == document.location.protocol ? "https://" : "http://") + "caiyunapp.com/dest/trs.js";
    document.body.appendChild(cyfy);
}