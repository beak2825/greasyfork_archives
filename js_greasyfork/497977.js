// ==UserScript==
// @name         自动刷新erp中的退货管理模块
// @namespace    http://gywl.net/rejectRefresh
// @version      0.0.1
// @description  自动刷新erp中的退货管理模块,解决不刷新复制退款单详情不起作用问题
// @author       liuyj
// @match        https://www.gugeerp.email:9090/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/497977/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0erp%E4%B8%AD%E7%9A%84%E9%80%80%E8%B4%A7%E7%AE%A1%E7%90%86%E6%A8%A1%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/497977/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0erp%E4%B8%AD%E7%9A%84%E9%80%80%E8%B4%A7%E7%AE%A1%E7%90%86%E6%A8%A1%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 获取当前网页链接
    var currentUrl = window.location.href;
    console.log("当前currentUrl="+currentUrl);

    var refreshFlag= GM_getValue("refreshFlag");
    setInterval(function() {
        // 获取当前网页链接
        currentUrl = window.location.href;
        console.log("currentUrl="+currentUrl);
        if(currentUrl.includes("reject") && !refreshFlag){
            console.log("当前为退货管理界面,重新刷新");
            GM_setValue("refreshFlag",true);
            window.location.reload();
        }else if(currentUrl.includes("login")){
            GM_setValue("refreshFlag",false);
            console.log("登录界面");
        }
    }, 3000);
    
})();