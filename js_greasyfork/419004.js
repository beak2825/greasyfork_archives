// ==UserScript==
// @name         双语对照网页翻译(英文网页双语对照自动翻译)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  本插件开发的初心在于《自动翻译，解放双手》。双语对照网页翻译(国外英文网页,双语对照自动翻译)!English web pages, Chinese English automatic translation by Caiyun smart translation！
// @author       JasonHuang
// @license    GPL-3.0-only
// @create     2020-12-22
// @include http://*
// @include https://*
// @exclude    *://*.google*/*
// @exclude    *://*.github*/*
// @exclude    *://*gov.cn/*
// @exclude    *://*edu.cn/*
// @exclude    *://*.cn/*
// @exclude    *://*.baidu.com/*
// @exclude    *://*.qq.com/*
// @exclude    *://*.bilibili.com/*
// @exclude    *://*.jianshu.com/*
// @exclude    *://*sspai.com/*
// @exclude    *://*cnki.net/*
// @exclude    *://*.160.com/*
// @exclude    *://*.huaweicloud.com/*
// @exclude    *://*ikeepstudying.com/*
// @exclude    *://*.ifdream.net/*
// @exclude    *://*.topthink.com/*
// @exclude /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?github\.com(:[0-9]{1,5})?\/.*$)/
// @exclude    *://*.wordpress.org/zh*
// @exclude    https://developer.wordpress.org/reference/*
// @exclude    *://*.oceanengine.com/*
// @exclude    *://*.lusongsong.com/*
// @exclude    *://*.cambridge.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @run-at       document-body
// @grant    unsafeWindow
// @note    2021-06-03-V1.1.0 用户反馈自动翻译功能失效,打patch来了
// @note    2021-02-05-V1.0.2 新增用户反馈取消部分v1.0.2自动翻译功能
// @note    2020-12-22-V1.0.1 去除google/github网站自动翻译功能
// @note    2020-12-22-V1.0.0 完成英文网站自动双语翻译功能
// @downloadURL https://update.greasyfork.org/scripts/419004/%E5%8F%8C%E8%AF%AD%E5%AF%B9%E7%85%A7%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%28%E8%8B%B1%E6%96%87%E7%BD%91%E9%A1%B5%E5%8F%8C%E8%AF%AD%E5%AF%B9%E7%85%A7%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419004/%E5%8F%8C%E8%AF%AD%E5%AF%B9%E7%85%A7%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%28%E8%8B%B1%E6%96%87%E7%BD%91%E9%A1%B5%E5%8F%8C%E8%AF%AD%E5%AF%B9%E7%85%A7%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%29.meta.js
// ==/UserScript==

$(document).ready(function(){
  $("html:lang(en)").show(function() {
    var trans = document.createElement("script");
    trans.src = ("https:" == document.location.protocol ? "https://" : "http://") + "caiyunapp.com/dest/trs.js",
        trans.type = "text\/javascript";
    document.body.appendChild(trans);
  });
});
