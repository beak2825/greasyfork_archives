// ==UserScript==
// @name         妇幼系统(辅助功能)
// @namespace    http://tampermonkey.net/
// @version      V8.3
// @description  妇幼系统自动化填写功能。
// @author       Andy陆锐佳
// @match        https://10.130.20.249:8661/fyweb/*
// @match        https://fybj.newhealth.com.cn:8661/*
// @icon         https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524361/%E5%A6%87%E5%B9%BC%E7%B3%BB%E7%BB%9F%28%E8%BE%85%E5%8A%A9%E5%8A%9F%E8%83%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524361/%E5%A6%87%E5%B9%BC%E7%B3%BB%E7%BB%9F%28%E8%BE%85%E5%8A%A9%E5%8A%9F%E8%83%BD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //添加按钮
    var buttonCount = 4
    var name = ['常规体检','高危儿专案','贫血专案','营养不良专案']

    for (var i = 0; i < buttonCount; i++) {
        var button = document.createElement('button');
        button.innerText = name[i]; // 设置按钮文本
        button.id = i + 'a'
        button.style.width = '100px'; // 设置宽度为100像素
        button.style.height = '25px'; // 设置高度为50像素
        document.body.appendChild(button);
        document.body.insertBefore(button, document.body.firstChild)
    }














    //一般体检
    let button0 = document.getElementById('0a')


    // 为按钮添加点击事件监听器（一般体检）
    button0.addEventListener('click', function(){
        alert('！！通知：因本人不再从事此项目工作，避免因项目相关工作细则变动而导致的误选漏选等问题，现已不再提供此脚本功能。若因继续使用该脚本而导致项目扣分等问题，后果自负！')



    });//button0 一般体检




//_______________________________________________________________________________________________________
//_______________________________________________________________________________________________________





    //高危儿
    let button1 = document.getElementById('1a')


    // 为按钮添加点击事件监听器（一般体检）
    button1.addEventListener('click', function(){
        alert('！！通知：因本人不再从事此项目工作，避免因项目相关工作细则变动而导致的误选漏选等问题，现已不再提供此脚本功能。若因继续使用该脚本而导致项目扣分等问题，后果自负！')


    })//button1 高危儿专案




//_______________________________________________________________________________________________________
//_______________________________________________________________________________________________________






//贫血专案
    let button2 = document.getElementById('2a')


    // 为按钮添加点击事件监听器（一般体检）
    button2.addEventListener('click', function(){
        alert('！！通知：因本人不再从事此项目工作，避免因项目相关工作细则变动而导致的误选漏选等问题，现已不再提供此脚本功能。若因继续使用该脚本而导致项目扣分等问题，后果自负！')



    })//button2 贫血专案




//_______________________________________________________________________________________________________
//_______________________________________________________________________________________________________




    //营养不良专案
    let button4 = document.getElementById('3a') //P1-P3 <P1


    // 为按钮添加点击事件监听器（一般体检）
    button4.addEventListener('click', function(){
        alert('！！通知：因本人不再从事此项目工作，避免因项目相关工作细则变动而导致的误选漏选等问题，现已不再提供此脚本功能。若因继续使用该脚本而导致项目扣分等问题，后果自负！')



    })//button4 营养不良专案






//_______________________________________________________________________________________________________
//_______________________________________________________________________________________________________


})();