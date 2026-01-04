// ==UserScript==
// @name         广州城市理工学院校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  可用于广州城市理工学院校园网快速登录
// @author       You
// @match        http://10.137.1.2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521720/%E5%B9%BF%E5%B7%9E%E5%9F%8E%E5%B8%82%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/521720/%E5%B9%BF%E5%B7%9E%E5%9F%8E%E5%B8%82%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

//请把账号改为你的学号
var number='123412341234';
//请把密码改为校园网密码，默认身份证后六位
var password='123456';

function login()
{
    console.log("正在进行登录操作");
    // 自动填写账号密码到输入框
    document.getElementById('userid').value=number;
    document.getElementById('passwd').value=password;
    // 自动点击登录按钮
    window.setTimeout(function(){
        document.getElementById('loginsubmit').click();
    },200)
}

(function() {
    'use strict';

    // Your code here...
    window.setTimeout(function()
    {
        if(document.getElementById('loginsubmit') == null){
            console.log("你已经登录")
        }
        else{
            login()
        }
    })
})();