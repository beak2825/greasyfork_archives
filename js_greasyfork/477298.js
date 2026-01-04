// ==UserScript==
// @name         一键养号
// @namespace    hx
// @version      1.4
// @description  自动关注阳光信用+每日一善超话、签到、发布微博各一条
// @author       hx
// @match        http*://*/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://greasyfork.org/scripts/477240-%E8%AF%AD%E6%96%99%E5%BA%93-%E5%BE%AE%E5%8D%9A%E8%A1%A8%E6%83%85/code/%E8%AF%AD%E6%96%99%E5%BA%93-%E5%BE%AE%E5%8D%9A%E8%A1%A8%E6%83%85.js
// @require      https://greasyfork.org/scripts/477224-%E8%AF%AD%E6%96%99%E5%BA%93-%E9%98%B3%E5%85%89%E4%BF%A1%E7%94%A8/code/%E8%AF%AD%E6%96%99%E5%BA%93-%E9%98%B3%E5%85%89%E4%BF%A1%E7%94%A8.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/477298/%E4%B8%80%E9%94%AE%E5%85%BB%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/477298/%E4%B8%80%E9%94%AE%E5%85%BB%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //版本号
    let version=1.4;

    //注册功能菜单
    GM_registerMenuCommand("启动", function (e) {
        GM_openInTab(ygxychUrl,{active:true})
    });

    //阳光信用
    let ygxychUrl="https://weibo.com/p/10080898eb7372c9e744b2bee736d10ae5c4de/super_index?yjyh";
    if($(location).attr('href')==ygxychUrl){
        ygxy();
    }
    function ygxy(){
        setTimeout(function(){
            qd();
        },1000)
        setTimeout(function(){
            let bq=ylk_vbbq[Math.floor(Math.random() * ylk_vbbq.length)];
            let wa=ylk_ygxy[Math.floor(Math.random() * ylk_ygxy.length)];
            fb("#阳光信用[超话]# #阳光信用#"+bq+"#每日一善#"+bq+wa);
        },2500)
        setTimeout(function(){
            window.location.href=mrysUrl;
        },3500)
    }

    //每日一善
    let mrysUrl="https://weibo.com/p/100808d3a2ca3dab11e10258174fda92f34806/super_index?yjyh";
    if($(location).attr('href')==mrysUrl){
        mrys();
    }
    function mrys(){
        setTimeout(function(){
            qd();
        },1000)
        setTimeout(function(){
            let bq=ylk_vbbq[Math.floor(Math.random() * ylk_vbbq.length)];
            let wa=ylk_ygxy[Math.floor(Math.random() * ylk_ygxy.length)];
            fb("#每日一善[超话]# #阳光信用#"+bq+"#每日一善#"+bq+wa);
        },2000)
        setTimeout(function(){
            //window.location.href=mrysUrl;
        },3000)
    }

    //签到
    function qd(){
        if($(".btn_bed[node-type=followBtnBox] a").attr("action-type")!="unFollow"){
            $(".btn_bed[node-type=followBtnBox] a")[0].click();
        }
        setTimeout(function(){
            if($(".btn_bed a[action-type=widget_take] span").html()=="签到"){
                $(".btn_bed a[action-type=widget_take]")[0].click();
            };
        },800)
    }

    //发博
    function fb(content){
        $("textarea[node-type=textEl]").html(content);
        $("textarea[node-type=textEl]").focus();
        setTimeout(function(){
            $("a[node-type=submit]")[0].click();
        },800)
    }

})();