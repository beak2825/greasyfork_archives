// ==UserScript==
// @name         复制链接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  点击按钮复制链接
// @author       xgm
// @match      https://www.douyin.com/user/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440116/%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/440116/%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义css
    let div_css = `
    #btnDiv{
        padding: 15px 30px;
        background: #fff;
        border-radius: 10px;
        position: fixed;
        left: 5%;
        bottom: 30%;
        z-index: 999;
    }
    #btnLink{
        padding: 8px 15px;
        border-radius: 10px;
        background: #0096DB;
        border: 0;
        color: #fff;
        margin-bottom: 10px;
    }
    #btnDiv p{
        line-height: 28px;
    }
    `
    // 引用自定义css
    GM_addStyle(div_css);

    // 创建元素添加到页面上
    let div = "<div id='btnDiv'><button id='btnLink'>复制链接</button><p id='divUid'></p><p id='followerCount'></p><p id='mplatformFollowersCount'></p></div>";
    $("#root").append(div);

    // 获取json数据
    let text = $("#RENDER_DATA").text();
    let decode = JSON.parse(decodeURIComponent(text));
     console.log(decode);
    let uidData = decode[30].uid;
    console.log(uidData);

    // 元素内容赋值
    $("#divUid").text("uid：" + uidData);
    $("#followerCount").text("抖音粉丝数：" + decode[30].user.user.followerCount);
    $("#mplatformFollowersCount").text("多平台粉丝数：" + decode[30].user.user.mplatformFollowersCount);

    // 复制链接内容拼接
    function copyContent(){
        let pageUrl = window.location.href + "?authorId=" + uidData;
        console.log(pageUrl);
        let copyLink = copyText(pageUrl);
        alert(copyLink ? "复制成功！" : "复制失败！");
    }

    //复制方法
    function copyText(text) {
        var textarea = document.createElement("textarea");
        var currentFocus = document.activeElement;
        document.body.appendChild(textarea);
        textarea.value = text;
        textarea.focus();
        if (textarea.setSelectionRange)
            textarea.setSelectionRange(0, textarea.value.length);
        else
            textarea.select();
        try {
            var flag = document.execCommand("copy");
        } catch(eo){
            flag = false;
        }
        document.body.removeChild(textarea);
        currentFocus.focus();
        return flag;
    }

    // 调用方法
    $("#btnLink").click(function(){
        copyContent();
    })


})();