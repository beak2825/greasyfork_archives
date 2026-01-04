// ==UserScript==
// @name         图片路径替换
// @namespace    zgzhihu
// @version      0.35
// @description  图片URL替换
// @author       cyf0611
// @match        *://img.alicdn.com/*
// @match        *://www.xiaohongshu.com/*
// @match        *://h5.xiuxiu.meitu.com/*
// @match        https://buyertrade.taobao.com/*
// @match        https://trade.taobao.com/*
// @match        *://pbs.twimg.com/*
// @match        *://img30.360buyimg.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/397917/%E5%9B%BE%E7%89%87%E8%B7%AF%E5%BE%84%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/397917/%E5%9B%BE%E7%89%87%E8%B7%AF%E5%BE%84%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let href = location.href;


    //淘宝
    if(href.includes("alicdn")) {
        if(href.split("_").length===3) {
            location.href = href.split(/_\d/)[0];
        }
    }

    //小红书
    if(href.includes("xiaohongshu")) {
        if(href.split("?").length===2) {
            //location.href = href.split("?")[0];
        }

        $(".small-pic").on("dblclick",  function(e) {
            window.open(e.target.style.backgroundImage.replace('url("', '').split('?')[0]);
        })
    }

    //美图
    if(href.includes("h5.xiuxiu.meitu")) {
        location.href=href.replace('h5.xiuxiu','show');
    }

    //twitter
    if(href.includes("?format=jpg&name=small")) {
        location.href=href.replace('?format=jpg&name=small','.jpg:orig');
    }

    //淘宝订单可编辑
    if(href.includes("buyertrade.taobao.com") || href.includes("trade.taobao.com")) {
        $("body").eq(0).attr("contentEditable", "true");
    }

    //京东
    if(href.includes("360buyimg.com") && !href.includes("/cv/")) {
        location.href=href.replace(/\/n(.+?)_jfs/, "/cv/_jfs");
    }

})();