// ==UserScript==
// @name         湖南人文科技学院校园网直连
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  实现对校园网登陆界面登录按钮的模拟点击功能，交流学习清联系2790385607@qq.com
// @author       信院雷楠
// @match        http://172.18.18.2/eportal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=18.2
// @grant        none
// @license      extjs
// @downloadURL https://update.greasyfork.org/scripts/448745/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%96%87%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%9B%B4%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/448745/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%96%87%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%9B%B4%E8%BF%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var userid = ""
   setTimeout(function dianji(){
        document.getElementById("loginLink_div").click()
       //console.log("点击成功")
    } ,500)
    setTimeout(function title_get(){
       console.log("点击成功")
       var title = document.title
       if(title == '登录成功'){
              console.log("关闭窗口")
              var opened=window.open('https://www.baidu.com/','_self');
              opened.opener=null;
              opened.close();
       }
    } ,500)
    // Your code here...
})();