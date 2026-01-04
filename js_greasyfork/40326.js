// ==UserScript==
// @name         广发通讯
// @version      2018.04.02
// @description # 禁止代购电脑进入淘宝,京东支付页面
// @author       mao
// @match        *://*/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @namespace undefined
// @downloadURL https://update.greasyfork.org/scripts/40326/%E5%B9%BF%E5%8F%91%E9%80%9A%E8%AE%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/40326/%E5%B9%BF%E5%8F%91%E9%80%9A%E8%AE%AF.meta.js
// ==/UserScript==

function hideTBQRcode(){
    $("div.qrcode-main").hide();
    clickIt();
}

function hideJDQRcode(){
    $("div.qrcode-main").hide();
    $("div.login-tab.login-tab-l").hide();
    $("div.login-tab.login-tab-r")[0].click();
    //hideJDQRcode();
}

function clickTB() {
    var j_TB = document.getElementById("J_Quick2Static");
    if (j_TB) {
        j_TB.click();
    }
    $(".iconfont.quick").hide();
    //hideTBQRcode();
}

function clickJD() {
    var j_JD = document.getElementsByClassName("login-tab login-tab-r")[0].getElementsByTagName("a");
    if(j_JD){
        j_JD[0].click();
    }

    $("div.login-tab.login-tab-l").hide();
}

function clickIt() {
    var host = window.location.host;
    if(host.indexOf("jd.com")!=-1){
        if(host=="trade.jd.com"){
            alert("请加入购物车后,到收银台结账");
            history.go(-1);
        }else{
            clickJD();
            $("#loginname").attr("readonly","readonly").val("15971258126");
        }
    }else if(host.indexOf("taobao.com")!=-1||host.indexOf("tmall.com")!=-1){
        if(host=="buy.taobao.com"||host=="buy.tmall.com"||host=="trade.1688.com"){
            alert("请加入购物车后,到收银台结账");
            history.go(-1);
        }else{
            clickTB();
            $("#TPL_username_1").attr("readonly","readonly").val("15971258126");
        }
    }else if(host.indexOf("baidu.com")!=-1){
        alert("不支持该网站");
        window.location.href="https://www.taobao.com";
    }
    else{}
}

window.onload = clickIt;