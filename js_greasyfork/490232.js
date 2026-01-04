// ==UserScript==
// @name         户表更新
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  update the information
// @author       zhaiwei
// @match        http://cpadisc2.cpad.gov.cn/*
// @match        http://106.120.181.195/*
// @match        http://111.200.209.66/*
// @license      GPL license
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cpad.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490232/%E6%88%B7%E8%A1%A8%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/490232/%E6%88%B7%E8%A1%A8%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 生成更新按钮
    var btn = document.createElement('button');
    // 按钮文字
    btn.innerText = '一键更新';
    // 添加按钮的样式类名class值为chooseBtn
    btn.setAttribute('class', 'chooseBtn');
    // 生成style标签
    var style = document.createElement('style');
    // 把样式写进去
    style.innerText = `.chooseBtn{position:fixed;top:61.8%;right:23.6%;width:75px;height:55px;padding:3px 5px;border:3px solid #ff6138;cursor:pointer;color:#ff6138;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.chooseBtn:hover{background-color:#ff6138;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    // 点击按钮去执行一键全选函数 chooseAll
    document.querySelector('.chooseBtn').addEventListener('click', function () {
        updateAll();
        setTimeout(function() {saveAll();},1000);
    })
// 生成保存按钮
    var btnSave = document.createElement('button');
    // 按钮文字
    btnSave.innerText = '保存';
    // 添加按钮的样式类名class值为saveBtn
    btnSave.setAttribute('class', 'saveBtn');
    // 生成style标签
    var styleSave = document.createElement('style');
    // 把样式写进去
    styleSave.innerText = `.saveBtn{position:fixed;top:61.8%;right:13.6%;width:75px;height:55px;padding:3px 5px;border:3px solid #00a388;cursor:pointer;color:#00a388;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.saveBtn:hover{background-color:#00a388;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(styleSave);
    // 在body中添加button按钮
    document.body.appendChild(btnSave);
    // 点击按钮去执行一键全选函数 saveAll
    document.querySelector('.saveBtn').addEventListener('click', function () {
        saveAll();
    })
      // 一键更新函数
    function updateAll() {

        //是否为2023年度动态更新抽样户
        document.getElementsByClassName("ui-clickable fa fa-fw fa-caret-down")[10].click();
        document.getElementsByClassName("ng-tns-c6-25 ui-dropdown-item ui-corner-all")[1].click();
        //做饭是否使用清洁能源
        document.getElementsByClassName("ng-tns-c6-38 ui-dropdown-label ui-inputtext ui-corner-all")[0].click();
        document.getElementsByClassName("ng-tns-c6-38 ui-dropdown-item ui-corner-all")[2].click();
        //做饭使用清洁能源的主要类型(单选)
        document.getElementsByClassName("ng-tns-c6-39 ui-dropdown-label ui-inputtext ui-corner-all")[0].click();
        document.getElementsByClassName("ng-tns-c6-39 ui-dropdown-item ui-corner-all")[5].click();
        //是否清洁取暖
        document.getElementsByClassName("ng-tns-c6-40 ui-dropdown-label ui-inputtext ui-corner-all")[0].click();
        document.getElementsByClassName("ng-tns-c6-40 ui-dropdown-item ui-corner-all")[1].click();
        //审核人
        var event0 = new Event("input");
        document.querySelectorAll("#aac377")[0].value = "彭素兰";
        document.querySelectorAll("#aac377")[0].dispatchEvent(event0);
        //填表人
        var event1 = new Event("input");
        document.querySelectorAll("#aac378")[0].value = "于宝玉";
        document.querySelectorAll("#aac378")[0].dispatchEvent(event1);
        //填表人手机号
        var event2 = new Event("input");
        document.querySelectorAll("#aac379")[0].value = "14792418381";
        document.querySelectorAll("#aac379")[0].dispatchEvent(event2);
    }
function saveAll() {

    document.getElementsByClassName("ui-button-text ui-clickable")[6].click();
    setTimeout('document.getElementsByClassName("swal2-confirm swal2-styled")[0].click();',1000);
    setTimeout('document.getElementsByClassName("swal2-confirm swal2-styled")[0].click();',2000);
    setTimeout('document.getElementsByClassName("ui-button-text ui-clickable")[5].click();',3000);
    setTimeout('document.getElementsByClassName("swal2-confirm swal2-styled")[0].click();',4000);
    setTimeout('document.getElementsByClassName("swal2-confirm swal2-styled")[0].click();',5000);
    setTimeout('document.getElementsByClassName("swal2-confirm swal2-styled")[0].click();',6000);
    setTimeout('document.getElementsByClassName("swal2-confirm swal2-styled")[0].click();',7000);
    }

    // Your code here...
})();