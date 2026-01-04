// ==UserScript==
// @name         YJSDS_Buyer_Lite
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       You
// @match        http://ucenter.yjsds.com/yjs-ucenter-start/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381065/YJSDS_Buyer_Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/381065/YJSDS_Buyer_Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //隐藏首页左侧报表标签
    $(".service").hide();
    //隐藏首页中间用户信息
    $(".ai-userbox").hide();
    //隐藏首页右侧咨询标签
    $("#is_show2").hide();
    //隐藏首页中间常用报表
    $("#data-chart").hide();

    //购物车：脚本文件检查
    if(window.location.href.indexOf("list/layout.htm")!=-1){
        var scripts = document.getElementsByTagName('script');
        var thisScript = null;
        var i = scripts.length;
        while (i--) {
            if (scripts[i].src && (scripts[i].src.indexOf('1590864') !== -1)) {
                thisScript = scripts[i];
                break;
            }
        }
        var url = (JSON.stringify(thisScript) == "{}");
        if (url === false) {
            alert("\n购物车脚本文件链接有变动，请注意更新。");
        }
    }
    //订单相关：收货地址信息隐藏、默认收货地址设置等
    if(window.location.href.indexOf("shopcar/showorder.htm")!=-1){
        //隐藏流程图
        $(".stepcon-chg").hide();
        //隐藏收货人信息
        $(".show-all").hide();
        $(".clearfix").hide();
        //模拟点击以正确显示浮动栏
        $(".yjs-textbox-muitiline").click();
        //设置默认收货地址
        $("#adderssId").val("6402882");
    }
    //合同相关：收货人信息隐藏、默认收货地址设置、同意按钮自动勾选
    if(window.location.href.indexOf("contract/beforeAddContract.htm")!=-1){
        //隐藏收货人信息
        $("#addressUl").hide();
        $(".show-all").hide();
        $("#agreeRule").click();
        $("#adderssId").val("6402882");
    }
})();