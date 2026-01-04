// ==UserScript==
// @name         洛学教育网
// @namespace    999
// @version      1.0
// @description  洛学教育网刷课
// @author       666
// @match        *://*.luoxuejiaoyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393387/%E6%B4%9B%E5%AD%A6%E6%95%99%E8%82%B2%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/393387/%E6%B4%9B%E5%AD%A6%E6%95%99%E8%82%B2%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        //当任务完成后，回到首页
        if(document.getElementsByClassName("btn text-sm hidden-xs js-learned-prompt color-primary open").length != 0){
            document.getElementsByClassName("back-link")[0].click()

        }
        //回到首页后，点击继续学习
        if(document.getElementsByClassName("btn btn-primary btn-lg mt10")){
            document.getElementsByClassName("btn btn-primary btn-lg mt10")[0].click()
        }
    }, 2000)
})();