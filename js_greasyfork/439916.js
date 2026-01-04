// ==UserScript==
// @name         美剧天堂净化者
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  sad boy tryna save the world!!!
// @author       wasted
// @match        https://www.meijutt.tv/*
// @icon         https://www.google.com/s2/favicons?domain=meijutt.tv
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439916/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%E5%87%80%E5%8C%96%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/439916/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%E5%87%80%E5%8C%96%E8%80%85.meta.js
// ==/UserScript==

// 一个随性的人，等一个随性的人

let weburl = unsafeWindow.location.href;
if(weburl.indexOf('www.meijutt.tv')!=-1)
{
    GM_addStyle('#HMRichBox{display:none !important}');
    GM_addStyle('.widget-weixin{display:none !important}');
    GM_addStyle('.b-wrap>div>a>img:nth-child(1){display: none;}');
    GM_addStyle('.a960_index>iframe{display: none;}');
}

if(weburl.indexOf('www.meijutt.tv/content')!=-1)
{
    GM_addStyle('.warp>div>a>img{display:none !important}');
     GM_addStyle('.money_content-top-right{display:none !important}');
}

if(weburl.indexOf('www.meijutt.tv/video')!=-1)
{
    GM_addStyle('.a970_play>iframe{display:none !important}');
}