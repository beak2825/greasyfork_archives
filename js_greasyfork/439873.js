// ==UserScript==
// @name         美剧天堂净化丶全境守护丶大草海的卡丽熙丶龙之母丶风暴降生
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sadboy tryno save the world!!!
// @author       wasted
// @match        https://www.meijutt.tv/*
// @icon         https://www.google.com/s2/favicons?domain=meijutt.tv
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439873/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%E5%87%80%E5%8C%96%E4%B8%B6%E5%85%A8%E5%A2%83%E5%AE%88%E6%8A%A4%E4%B8%B6%E5%A4%A7%E8%8D%89%E6%B5%B7%E7%9A%84%E5%8D%A1%E4%B8%BD%E7%86%99%E4%B8%B6%E9%BE%99%E4%B9%8B%E6%AF%8D%E4%B8%B6%E9%A3%8E%E6%9A%B4%E9%99%8D%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/439873/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%E5%87%80%E5%8C%96%E4%B8%B6%E5%85%A8%E5%A2%83%E5%AE%88%E6%8A%A4%E4%B8%B6%E5%A4%A7%E8%8D%89%E6%B5%B7%E7%9A%84%E5%8D%A1%E4%B8%BD%E7%86%99%E4%B8%B6%E9%BE%99%E4%B9%8B%E6%AF%8D%E4%B8%B6%E9%A3%8E%E6%9A%B4%E9%99%8D%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let weburl = unsafeWindow.location.href;
    if(weburl.indexOf('www.meijutt.tv')!=-1){
        GM_addStyle('#HMRichBox{display:none !important}');
        GM_addStyle('.widget-weixin{display:none !important}');
    }
})();