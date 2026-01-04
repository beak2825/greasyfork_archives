// ==UserScript==
// @name         安居客58同城去广告
// @namespace    https://wx.forwines.cn/
// @version      0.0.2
// @description  安居客,58同城去除无用广告
// @author       God
// @match          *://*.anjuke.com/*
// @match          *://*.58.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404519/%E5%AE%89%E5%B1%85%E5%AE%A258%E5%90%8C%E5%9F%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/404519/%E5%AE%89%E5%B1%85%E5%AE%A258%E5%90%8C%E5%9F%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //alert("hello word");
    var css='#content > div.sale-right > div.house-qa{display:none !important;;}';
    css +='#IFX_p940{display:none !important;;}';
    css+='#content > div.sale-right > div.div-border.r-mag-top.r-padding.find-broker{display:none !important;;}';
    css+='#content > div.sale-right > div.luna-58-wrap{display:none !important;;}';
    css+='#content > div.seo-tips{display:none !important;;}';
    css+='#seo-box{display:none !important;;}';
    css+='#content > div.sale-right{display:none !important;;}';
    css+='#content > div:nth-child(11){display:none !important;;}';
    css+='body > div.main-wrap > div.content-wrap > div.content-side-right{display:none !important;;}';
    css+='#brand_list_top_banner{display:none !important;;}';
    css+='#anjukeRecommend{display:none !important;;}';
    css+='#wangmeng_list_bottom_ditong{display:none !important;;}';
    css+='body > div.other-series-recommend{display:none !important;;}'
    loadStyle(css)
    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);

    }
})();