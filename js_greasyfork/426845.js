// ==UserScript==
// @name         安徽科技学院疫情填报
// @version      1.0
// @description  疫情填报
// @author       https://space.bilibili.com/35460587
// @match        http://xgb.ahstu.edu.cn/SPCP/*
// @grant        none
// @namespace https://greasyfork.org/users/671338
// @downloadURL https://update.greasyfork.org/scripts/426845/%E5%AE%89%E5%BE%BD%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/426845/%E5%AE%89%E5%BE%BD%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //
if(document.querySelector('#codeInput')==null){
                //没有找到表示登录了,不再执行后续代码
                return;
            }
            //未登录,执行登录代码
            document.querySelector('#StudentId').value='填入学号';//学号
            document.querySelector('#Name').value='填入密码';//密码
            document.querySelector('#codeInput').value=(document.getElementById("code-box").innerHTML)//验证码（自动填写）
})();



setTimeout( function(){

    document.querySelector("select[name=City]").value='340300';//输入城市
    document.querySelector("select[name=County]").value='340302';//输入地区
    document.querySelector('#ckCLS').click();
    document.querySelector('.save_form').click();
}, 400);//延迟400毫秒

( function(){


    document.querySelector("#Temper1").value='36';//设置温度
    document.querySelector("#Temper2").value='5';//设置温度
    document.querySelector('.save_form').click();
})();

