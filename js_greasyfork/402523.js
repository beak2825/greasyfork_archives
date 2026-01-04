// ==UserScript==
// @name         河北科技大学体温自动填写
// @namespace    http://xscfw.hebust.edu.cn/survey/login
// @version      1.2
// @description  河北科技大学理工学院体温自动填写 2S后自动提交 默认早上午间体温 在36.0-36.9之间 仅供内部交流使用
// @author       XX
// @match        xscfw.hebust.edu.cn/survey/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/402523/%E6%B2%B3%E5%8C%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E4%BD%93%E6%B8%A9%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/402523/%E6%B2%B3%E5%8C%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E4%BD%93%E6%B8%A9%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict'
    setTimeout(function(){
        if(document.title == "信息收集系统-登录"){
            document.getElementById("login").click();
        }else if(window.location.href == "http://xscfw.hebust.edu.cn/survey/index"){
            if(document.getElementsByClassName("list-checked mdui-float-right")[0].innerText == "已完成"){
                window.break;
            }else{
                var div = document.getElementsByClassName("mdui-list-item mdui-ripple")[0];
                div.click();
            }
        }else{
            var x = document.getElementsByName("c3");
            x[0].value = getRndInteger(360,368);
            var y = document.getElementsByName("c6");
            y[0].value = getRndInteger(360,368);
            //2S后自动提交
            setTimeout(function(){
                document.getElementById("save").click();
            }, 2000);
            //随机数生成函数
            function getRndInteger(min, max) {
                return (( Math.floor(Math.random() * (max - min + 1) ) + min)/10).toFixed(1);
            }
        }
    },500);
    // Your code here...
})();