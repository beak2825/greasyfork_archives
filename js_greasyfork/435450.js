// ==UserScript==
// @name         xxxyNetLogin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description 仅个人使用 免点击自动登录
// @author       zhangty
// @match        111.6.96.83:9999/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435450/xxxyNetLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/435450/xxxyNetLogin.meta.js
// ==/UserScript==

(function() {

    'use strict';

    // Your code here...
    var u='20214132138';
    var p='zty369';
    var type=0;
    //var arr={0:'xxxyyd',1:'xxxylt',2:'xxxydx'}
    console.log("xxxyNetLogin Run...");
    var username=document.getElementById('userName');
    var pwd=document.getElementById('passwd');
    var loginbtn=document.getElementsByClassName('loginBtn')[0];
    var yd=document.getElementById('xxxyyd');
    var lt=document.getElementById('xxxylt');
    var dx=document.getElementById('xxxydx');
    var arr=[yd,lt,dx]
    console.log(arr[type]);
    arr[type].click();
    window.onload=function(){
    username.value=u;
    pwd.value=p;
    console.log("已填充");
    };
    let e=document.createEvent("MouseEvents");
    e.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
    setTimeout(function(){
        loginbtn.dispatchEvent(e);
    },2000);

})();