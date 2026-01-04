// ==UserScript==
// @name     Change My Alibaba Page Title
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Change Alibaba title!
// @author       Moming
// @match        https://*.alibaba.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415615/Change%20My%20Alibaba%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/415615/Change%20My%20Alibaba%20Page%20Title.meta.js
// ==/UserScript==


// Code Start Here

// Get page URL
var pageLink = document.URL;

// Change Page Title to More Meaningful
(function() {
    'use strict';
    if (pageLink.includes('message')) {
        // either replace an existing lang=... param or append it
        document.title = "询盘";
    }
    else if(pageLink.includes('ads')){
         document.title = "营销中心";
    }
    else if(pageLink.includes('manage_products')){
         document.title = "产品管理";
    }
    else if(pageLink.includes('manage_ad_keyword')){
        document.title = "关键词推广";
    }
    else if(pageLink.includes('campaign_list')){
        document.title = "定向推广";
    }
    else if(pageLink.includes('traffic_report')){
        document.title = "流量报告";
    }
    else if(pageLink.includes('keywordIndex')){
        document.title = "关键词指数";
    }  
    else if(pageLink.includes('videobank')){
        document.title = "视频银行";
    }     
})();