// ==UserScript==
// @name         海南师范大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  海南师范大学校园网自动登录脚本
// @author       myaijarvis
// @match        http://210.37.0.141/eportal/index.jsp?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435080/%E6%B5%B7%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/435080/%E6%B5%B7%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 你的校园网账号密码
    let username="xxx";
    let password="xxx";


    // 网页自己重载了jQuery，所以这里只能用原生的JavaScript
    setTimeout(()=>{
        var un=document.querySelector('#username');
        if(un != undefined){
            un.value=username;
        }
        var pwd=document.querySelector('#pwd');
        if(pwd != undefined){
            pwd.setAttribute('type','password');
            pwd.value=password;
        }

        // 有时候输入框是这个
        var unt=document.querySelector('#username_tip');
        if(unt != undefined){
            unt.value=username;
        }
        var pwdt=document.querySelector('#pwd_tip');
        if(pwdt != undefined){
            pwdt.setAttribute('type','password');
            pwdt.value=password;
        }

        // 点击登录
        var login=document.querySelector('#loginLink_div');
        if(login != undefined){
            login.click();
        }
    },1000);
})();