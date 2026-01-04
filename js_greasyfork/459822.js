// ==UserScript==
// @name         volunteer注册
// @namespace    zhaiwei
// @version      0.1.1
// @description  sign up for volunteer
// @author       zhaiwei
// @match        http://ah.chinavolunteer.mca.gov.cn/subsite/anhui/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mca.gov.cn
// @grant        none
// @license      GPL license
// @downloadURL https://update.greasyfork.org/scripts/459822/volunteer%E6%B3%A8%E5%86%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/459822/volunteer%E6%B3%A8%E5%86%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
 // 生成按钮
    var signbtn = document.createElement('button');
    // 按钮文字
    signbtn.innerText = '填充';
    // 添加按钮的样式类名class值为signBtn
    signbtn.setAttribute('class', 'signBtn');
    // 生成style标签
    var signstyle = document.createElement('style');
    // 把样式写进去
    signstyle.innerText = `.signBtn{position:fixed;top:50%;right:25%;width:75px;height:55px;padding:3px 5px;border:3px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.signBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(signstyle);
    // 在body中添加button按钮
    document.body.appendChild(signbtn);
    // 点击按钮去执行填充函数 signUp
    document.querySelector('.signBtn').addEventListener('click', function () {
        signUp();
    })


    // 生成按钮
    var btnSave = document.createElement('button');
    // 按钮文字
    btnSave.innerText = '注册';
    // 添加按钮的样式类名class值为saveBtn
    btnSave.setAttribute('class', 'saveBtn');
    // 生成style标签
    var styleSave = document.createElement('style');
    // 把样式写进去
    styleSave.innerText = `.saveBtn{position:fixed;top:70%;right:25%;width:75px;height:55px;padding:3px 5px;border:3px solid #ce0000;cursor:pointer;color:#ce0000;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.saveBtn:hover{background-color:#ce0000;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(styleSave);
    // 在body中添加button按钮
    document.body.appendChild(btnSave);
    // 点击按钮去执行提交函数 saveAll
    document.querySelector('.saveBtn').addEventListener('click', function () {
        saveAll();
    })



    //填充函数
    function signUp(){
    document.querySelectorAll(".pwd_img")[0].click();
    document.querySelectorAll(".pwd_img")[2].click();
    var event = new Event("input");
    document.querySelectorAll("#password")[0].value = "Yc123456";
    document.querySelectorAll("#password")[0].dispatchEvent(event);
    document.querySelectorAll("#repeatpw")[0].value = "Yc123456";
    document.querySelectorAll("#repeatpw")[0].dispatchEvent(event);
    document.querySelectorAll("#email")[0].value = "1134847006@qq.com";
    document.querySelectorAll("#email")[0].dispatchEvent(event);
    setTimeout('document.querySelectorAll(".button-line")[1].click()',100);
    setTimeout('document.querySelectorAll("#first")[0].children[11].click()',250);
    setTimeout('document.querySelectorAll("#second")[0].children[4].click()',400);
    setTimeout('document.querySelectorAll(".form.t-c")[0].children[0].click()',500);

    //document.querySelectorAll(".vote")[0].children[2].click();
    //setTimeout("confirm()",1000);
    }

    function confirm(){
    if($('button:contains("确定")')){
    $('button:contains("确定")').click();;
    }
    }
    //提交函数
    function saveAll(){
    document.querySelectorAll(".vote")[0].children[2].click();
    }
    // Your code here...
})();