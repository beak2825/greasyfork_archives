// ==UserScript==
// @name         Color Recovery
// @namespace    qc.color
// @version      0.1.3
// @description  几个常用的平台恢复色彩
// @author       Crazy-Fengzi
// @license      MIT
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455729/Color%20Recovery.user.js
// @updateURL https://update.greasyfork.org/scripts/455729/Color%20Recovery.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let weburl = unsafeWindow.location.href;
    console.log('当前地址:'+weburl)
    if(weburl.indexOf('tieba.baidu.com')!=-1)
    {
        GM_addStyle('.tb-allpage-filter{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('.tb-allpage-filter{ filter:none !important}')
        GM_addStyle('.tb-allpage-filter{ -webkit-filter:none !important}')
    }

    else if(weburl.indexOf('www.taobao.com')!=-1)
    {
        GM_addStyle('html,body{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('html,body{ filter:none !important}')
        GM_addStyle('html,body{ -webkit-filter:none !important}')
    }

    else if(weburl.indexOf('www.jd.com')!=-1)
    {
        GM_addStyle('html.o2_gray{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('html.o2_gray{ filter:none !important}')
        GM_addStyle('html.o2_gray{ -webkit-filter:none !important}')
    }
    else if(weburl.indexOf('www.bilibili.com')!=-1)
    {
        GM_addStyle('html.gray{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('html.gray{ filter:none !important}')
        GM_addStyle('html.gray{ -webkit-filter:none !important}')
    }
    else if(weburl.indexOf('www.youku.com')!=-1)
    {
        GM_addStyle('html{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('html{ filter:none !important}')
        GM_addStyle('html{ -webkit-filter:none !important}')
    }
    else if(weburl.indexOf('www.iqiyi.com')!=-1)
    {
        GM_addStyle('.gray{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('.gray{ filter:none !important}')
        GM_addStyle('.gray{ -webkit-filter:none !important}')
    }
    else if(weburl.indexOf('v.qq.com')!=-1)
    {
        GM_addStyle('html{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('html{ filter:none !important}')
        GM_addStyle('html{ -webkit-filter:none !important}')
        GM_addStyle('.gray-style-remembrance{ filter:none !important}')
        GM_addStyle('.gray-style-remembrance{ -webkit-filter:none !important}')
    }

    else if(weburl.indexOf('www.douyu.com')!=-1)
    {
        GM_addStyle('.grayCtrl .layout-Container{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('.grayCtrl .layout-Container{ filter:none !important}')
        GM_addStyle('.grayCtrl .layout-Container{ -webkit-filter:none !important}')
    }
    else if(weburl.indexOf('www.huya.com')!=-1)
    {
        GM_addStyle('.ssr-wrapper{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('.ssr-wrapper{ filter:none !important}')
        GM_addStyle('.ssr-wrapper{ -webkit-filter:none !important}')
    }
    else if(weburl.indexOf('www.smzdm.com')!=-1)
    {
        GM_addStyle('html{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('html{ filter:none !important}')
        GM_addStyle('html{ -webkit-filter:none !important}')
    }
    else if(weburl.indexOf('weibo.com')!=-1)
    {
        GM_addStyle('.grayTheme{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('.grayTheme{ filter:none !important}')
        GM_addStyle('.grayTheme{ -webkit-filter:none !important}')
    }else{
        GM_addStyle('html,body{ -webkit-filter: grayscale(0) !important}')
        GM_addStyle('html,body{ filter:none !important}')
        GM_addStyle('html,body{ -webkit-filter:none !important}')
    }


})();
