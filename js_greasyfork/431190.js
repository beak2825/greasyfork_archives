// ==UserScript==
// @name         移除B站热搜框
// @namespace    http://tampermonkey.net/
// @version      1.2
// @match        *://www.bilibili.com/
// @match        *://*.bilibili.com/*
// @match        *://*.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @description  你如果不喜欢热搜信息可以移除它了
// @downloadURL https://update.greasyfork.org/scripts/431190/%E7%A7%BB%E9%99%A4B%E7%AB%99%E7%83%AD%E6%90%9C%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/431190/%E7%A7%BB%E9%99%A4B%E7%AB%99%E7%83%AD%E6%90%9C%E6%A1%86.meta.js
// ==/UserScript==

(function () {
    let app;
    let url = window.location.href;
    let idnexof = url.indexOf("history");
    if( idnexof != -1){
        //历史界面
        app=document.getElementById("internationalHeader");
    }

    else{
        if(app == null){
            //主页面
            app = document.getElementById("app");
            if (app == null){
                //登录页面
                app = document.getElementById("login-app");
                if(app == null){
                    return
                }
            }
        }

    }
    //设置监听dom改变类型
    let config = {
        //子节点
        "childList":true,
        //后代节点
        "subtree":true
    };

    let mutationObserver = new MutationObserver(function (records,mutationObserver){
        records.forEach(function (record) {
            for (let i = 0;i<record.addedNodes.length;i++){
                let node = record.addedNodes[i];
                //判断是否是HTML节点
                if (node.nodeType == 1) {
                    //找到热搜所在的节点
                    if (node.getAttribute("class") == "trending" || node.getAttribute("class") == "ad-report report-wrap-module report-scroll-module" || node.getAttribute("class") == "ad-report ad-floor report-wrap-module report-scroll-module" ) {
                        //设为隐藏
                        node.style.display = "none"
                    }
                }
            }
        });
    });
    //监听dom节点变化
    mutationObserver.observe(app,config);

})();