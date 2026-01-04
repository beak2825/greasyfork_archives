// ==UserScript==
// @name         CUIT校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto login in CUIT!
// @author       f4tb3e
// @match        *://10.254.241.19/*
// @icon         https://cdn.jsdelivr.net/gh/F4tBe3/AutoUploadPics/img/202210261441224.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453987/CUIT%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453987/CUIT%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var userName = '';    //填写用户名
    var passWord = '';    //填写密码
    var netType = '';     //填写运营商
    var url = window.location.href;
    var reg_in = RegExp(/index/);
    var reg_su = RegExp(/success/);
    var netId;

    if(netType == '教育网') {
        netId = '0';
    }
    else if(netType == '联通') {
        netId = '1';
    }
    else if(netType == '移动') {
        netId = '2';
    }
    else if(netType == '电信') {
        netId = '3';
    }

    while(!reg_su.exec(url)) {
        if(reg_in.exec(url)) {
            document.getElementById("username").value = userName;
            document.getElementById("pwd_tip").setAttribute('style','font-size: 16px; color: rgba(0, 0, 0, 0.54); border: none; display: none;');
            document.getElementById("pwd").setAttribute('style','border: none; display: block; float: left; width: 240px;');
            document.getElementById("pwd").value = passWord;
            window.setTimeout("selectService('"+netType+"','"+netType+"','"+netId+"')",150);
            document.getElementById("Tj_yes").show;
            window.setTimeout("document.getElementById('loginLink').click()",150);
            break;
        }
    }

    var bigImg = document.createElement("img");
    var enter = document.createElement("br");
    bigImg.src="https://cdn.jsdelivr.net/gh/F4tBe3/AutoUploadPics/img/202210261702454.gif";
    bigImg.width="760";
    var myDiv = document.getElementById('contentDive');
    //myDiv.appendChild(enter);
    myDiv.appendChild(bigImg);
    document.createElement("userinfotable").style = "padding-top: 100px;";
})();

