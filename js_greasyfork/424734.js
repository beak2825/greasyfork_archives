// ==UserScript==
// @name         新乡学院校园网自动登录
// @namespace    GXR
// @version      1.3
// @description  自动登录校园网跳转
// @author       GXR
// @match        http://*/portalReceiveAction.do?*
// @match        http://172.25.100.202/*
//@include       http://172.25.100.202/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424734/%E6%96%B0%E4%B9%A1%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/424734/%E6%96%B0%E4%B9%A1%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var data={
        user:'2020413'//输入您的校园网账号例如'2018010101'
        ,password:''//在引号内输入校园网密码例如'123456'
        ,loginWay:0//运营商例如中国移动0  中国联通1  中国电信  2 默认0

    };
    if(window.location.href=="http://172.25.100.202/"){
        setTimeout(close,1000)
    }else {
        setTimeout(sub,1000);
    }


    function sub(){
        let submit=document.getElementsByClassName("loginBtn");
        let userName=document.getElementById("userName");
        let passwd=document.getElementById("passwd");
        let loginWay=document.getElementsByClassName("loginWay")[0].children;
            if(userName.value!="" && passwd.value !=""){
                submit[0].click();
            }else{
            userName.value=data.user;
                passwd.value=data.password;
                //loginWay[data.loginWay].classList.add("on");
loginWay[data.loginWay].children[0].click();
                submit[0].click();
            }
    }
    function close(){
            let out=document.getElementById("loginOut");
            if(out.value=="断开"){
                let gg=document.getElementById("baidu_xc_pc_off");
                gg.click();
                setTimeout(timeOutClose,1000);
            }
    }
    function timeOutClose(){
        window.location.href="http://www.baidu.com"
    }
})();