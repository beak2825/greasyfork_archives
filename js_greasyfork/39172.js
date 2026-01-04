// ==UserScript==
// @name         BaiduSharePage
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  按住Alt键选中度盘神秘代码快捷进入对应分享页！Press Alt on keyboard and Select a baidu_secret_code to enter target share page！
// @author       Kakami
// @match        *://*/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @note         v0.2.5 去除部分不支持的(?<=exp),改为(?=exp)代替
// @note         v0.2.4 提高了特殊情况的稳定性
// @note         v0.2.4 下划线_和短横线-现在在某些情况下判定为是有效字符了
// @note         v0.2.3 添加仅用换行隔开情况的解决方案
// @note         v0.2.2 添加一种情况的解决方案，如：1ssssssGf 代码2:1234 ，12345678 代码b：1234 ，即神秘代码与提取码之间含有其他单个数字或字母被认为是有效字符（实际上是无效字符）
// @note         v0.2.2 添加一种情况的解决方案，如：1c347Cx6     c34f ，即神秘代码和提取码之间仅用空格隔开
// @note         v0.2 添加自动填充选中的提取码功能
// @note         v0.1 完成基本功能
// @downloadURL https://update.greasyfork.org/scripts/39172/BaiduSharePage.user.js
// @updateURL https://update.greasyfork.org/scripts/39172/BaiduSharePage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //自定义需要按下的按键
    function isOnKeyDown(e){
        //打开Alt键
        if(!e.altKey)return;
        //打开Ctrl键
        //if(!e.ctrlKey)return;
        //打开Shift键
        //if(!e.shiftKey)return;

        //调用
        openSharePage(e);
    }

    //监听器
    document.addEventListener('mouseup',isOnKeyDown,false);
    isInSharePage();

    //打开分享页的函数
    function openSharePage(e){
        var ae = document.activeElement;
        var currentString = "";
        var sharePassword = "";
        //获取选中的文本
        if (ae.tagName.toLowerCase() == "input" || ae.tagName.toLowerCase() == "textarea") {
            currentString = ae.value.substring(ae.selectionStart, ae.selectionEnd);
        } else {
            currentString = document.getSelection().toString();
        }
        var reg = "[^a-zA-Z0-9_-]+";
        var reg2 = ".*(：|:|码|取).*[0-9a-zA-Z].*[0-9a-zA-Z].*[0-9a-zA-Z].*[0-9a-zA-Z].*";
        var reg3 = ".*[^0-9a-zA-Z_-][2bB](:|：|,|，|\s).*[0-9a-zA-Z].*[0-9a-zA-Z].*[0-9a-zA-Z].*[0-9a-zA-Z].*";

        //去除无用字符
        currentString = currentString.replace(/(?=此帖).*(?=购买)/gm,"");
        var shareString = currentString.replace(new RegExp(reg,"gm"),"");
        //判断有没提取码
        if(currentString.match(new RegExp(reg2,"g"))){
            sharePassword = shareString.substr(-4,4);
            shareString = shareString.replace(/[0-9a-zA-Z]{4}$/g,"");
            if(currentString.match(new RegExp(reg3,"g"))){
                shareString = shareString.replace(/.$/g,"");
            }
            shareString = shareString+"#"+sharePassword;
        }else{
            //备用code space
            //判断有没验证码（特殊情况）
            var currentString2 = currentString.replace(/[^\s,，0-9a-zA-Z_-]/gm,"");
            if(currentString2.match(/[\s,，0-9a-zA-Z_-]{8,40}[\s,，]+[0-9a-zA-Z]{4}/g)){
                //shareString = shareString.replace(/[\s,，]/gm,"");
                sharePassword = shareString.substr(-4,4);
                shareString = shareString.replace(/[0-9a-zA-Z]{4}$/g,"");
                if(currentString2.match(/[^0-9a-zA-Z_-][2bB][\s,，]+[0-9a-zA-Z]{4}$/g))shareString = shareString.replace(/.$/g,"");
                shareString = shareString+"#"+sharePassword;
            }
        }
        if(shareString.length<=18)shareString = shareString.replace(/[_-]/gm,"");
        //到分享页面
        var shareUrl = "http://pan.baidu.com/s/" + shareString;
        if(shareString.length>=4&&shareString.length<50){
            //console.log(shareUrl);
            //console.log(shareString);
            //console.log(sharePassword);
            window.open(shareUrl);
        }
    }

    //自动填写提取码
    function isInSharePage(e){
        var curl = location.href.toString();
        //console.log(curl);
        if(!curl.match(/.*baidu.*share.*#[0-9a-zA-Z]{4}$/g))return;
        var Password = curl.substr(-4,4);
        //console.log(Password);
        $(":input").val(Password);
        $(".g-button-right :contains('提取文件')").click();
    }
})();