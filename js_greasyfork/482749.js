// ==UserScript==
// @name         NWU自动抢馆获取token
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  用于配合NWU场馆预约助手使用
// @author       Ozymandias
// @match        app.nwu.edu.cn/*
// @match        cgzx.nwu.edu.cn
// @match        authserver.nwu.edu.cn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nwu.edu.cn
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/482749/NWU%E8%87%AA%E5%8A%A8%E6%8A%A2%E9%A6%86%E8%8E%B7%E5%8F%96token.user.js
// @updateURL https://update.greasyfork.org/scripts/482749/NWU%E8%87%AA%E5%8A%A8%E6%8A%A2%E9%A6%86%E8%8E%B7%E5%8F%96token.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 检查当前浏览器是否支持本地存储
    console.log("脚本生效")
    var url = window.location.href;
    console.log("url:"+url);
    var logout = getHashParams('logout');
    console.log("退出登录："+logout)
    if(url.startsWith("https://app.nwu.edu.cn/appsquare/wap/default/index")){
        window.onload=function(){
            var pElements = document.querySelectorAll('p');
            pElements.forEach(function(p) {
                if (p.textContent.trim() == '场馆预约') {
                    p.click();
                }
            });
        }
    }
    if(url.startsWith("http://cgzx.nwu.edu.cn:8001/#/caslogin")){
        window.location.href="http://cgzx.nwu.edu.cn/#/pages/login/wxlogin"
    }
    if(url.startsWith("https://authserver.nwu.edu.cn/authserver/logout")){
        window.location.href="https://badmin.nwuserv.top/"
    }
    if(window.location.href.startsWith("https://cgzx.nwu.edu.cn/#/pages/common/exit")){
       window.onload=function(){
            const button = document.querySelector('uni-button[data-v-46a101a0].cu-btn.bg-blue.lg');
            if (button) {
                button.click();
            }
       }
    }
    if(window.location.href.startsWith("https://cgzx.nwu.edu.cn/#/pages/index/index")){
        if(logout==="true"){
            window.onload=function(){
                window.location.href="https://cgzx.nwu.edu.cn/#/pages/common/exit?logout=true"
                // window.location.href="https://cgzx.nwu.edu.cn/admin/caslogout?logout=true"
            }
        }else{
            // alert("登陆成功")
            window.onload=function(){
                var accessToken = localStorage.getItem('Access-Token');
                // 检查值是否存在
                if (accessToken !== null) {
                    // 打印值
                    console.log('Access-Token:', accessToken);
                    var referrerUrl = document.referrer;
                    //console.log("上一次的url：" + referrerUrl);
                    //if(!referrerUrl.includes('cgzx.nwu.edu')){
                    //只有是从本地来的请求才重定向，不要影响正常使用
                    window.location.href = "https://badmin.nwuserv.top?token=" + accessToken;
                    //}
                } else {
                    //console.log('Access-Token不存在,剩余重试次数：'+(200-i-1));
                    console.log('Access-Token不存在');
                }
            }
        }
    }
    setTimeout(function(){
        url=window.location.href
        console.log(url)
        if(url.startsWith("https://cgzx.nwu.edu.cn/#/pages/index/index")){
            var accessToken = localStorage.getItem('Access-Token');
            // 检查值是否存在
            if (accessToken !== null) {
                // 打印值
                console.log('Access-Token:', accessToken);
                var referrerUrl = document.referrer;
                //console.log("上一次的url：" + referrerUrl);
                //if(!referrerUrl.includes('cgzx.nwu.edu')){
                //只有是从本地来的请求才重定向，不要影响正常使用
                window.location.href = "https://badmin.nwuserv.top?token=" + accessToken;
                //}
            } else {
                //console.log('Access-Token不存在,剩余重试次数：'+(200-i-1));
                console.log('Access-Token不存在');
            }
        }
    },2000)

    //从url参数中根据key拿value
    function getHashParams(key) {
        var hash = window.location.hash.substring(1); // 获取哈希部分内容，去除开头的 '#'
        var params = hash.split('?')[1]; // 获取参数部分
        if (params) {
            var paramMap = params.split('&'); // 分割参数
            for (var i = 0; i < paramMap.length; i++) {
                var param = paramMap[i].split('=');
                if (param[0] === key) {
                    return param[1]; // 返回参数值
                }
            }
        }
        return null; // 如果找不到参数，返回 null
    }
})();