// ==UserScript==
// @name         福建水利电力职业技术学院疫情填报
// @namespace    http://wpa.qq.com/msgrd?v=3&uin=2397211045&site=qq&menu=yes
// @version      1.3
// @description  疫情填报
// @author       qq:2397211045
// @match        http://xg.fjsdxy.com/SPCP/Web/*
// @icon         https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c231cb54-3066-4b7c-8564-c7d2f3a42c6d/73c04364-d430-41e1-aeaa-2117bc399853.png
// @compatible   Chrome
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441891/%E7%A6%8F%E5%BB%BA%E6%B0%B4%E5%88%A9%E7%94%B5%E5%8A%9B%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/441891/%E7%A6%8F%E5%BB%BA%E6%B0%B4%E5%88%A9%E7%94%B5%E5%8A%9B%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
if(document.querySelector('#codeInput')==null){
                //没有找到表示登录了,不再执行后续代码
                return;
            }
            //未登录,执行登录代码
            document.querySelector('#StudentId').value='填入学号';//学号
            document.querySelector('#Name').value='填入密码';//密码
            document.querySelector('#codeInput').value=(document.getElementById("code-box").innerHTML)//验证码（自动填写）
})();

//定时器进行进入网页,有一点需要,需要判断今天早上的时间然后开始循环

setTimeout(function() {
    var now = new Date();//判断当前时间,如果为8点,13点,18点,进入体温页面.
	if(now.getHours()==8){
		 document.querySelector('#platfrom1> a').click();
	}
    if(now.getHours()==13){
		 document.querySelector('#platfrom1> a').click();
	}
    if(now.getHours()==18){
		 document.querySelector('#platfrom1> a').click();
	}
//    window.location.href = '/SPCP/Web/Account/ChooseSys';
},5000);//延迟5秒后执行点击体温页面的点击,之后会执行自动填写体温脚本,控制好时间就可以循环

setTimeout(function() {
    window.location.href = '/SPCP/Web/Account/ChooseSys';
},1800000);//延迟30分钟后进行页面的重载,进入选择页面,由于时间的间隔现在,每隔五小时才能进入一次填体温页面

//表单填写脚本,如果要填表单需要关闭重载
setTimeout( function(){
    document.querySelector('#MoveTel').value='17859935475';//学号
    document.querySelector("select[name=City]").value='350400';//输入城市
    document.querySelector("select[name=County]").value='350481';//输入地区
    document.querySelector('#ckCLS').click();
    document.querySelector('.save_form').click();
}, 4000);//延迟400毫秒

//( function(){
//    document.querySelector('.layui-m-layerbtn').click();
//})();

//填体温执行函数
( function(){
    document.querySelector("#Temper1").value='36';//设置温度
    document.querySelector("#Temper2").value='5';//设置温度
    document.querySelector('.save_form').click();
    // Your code here...
})();