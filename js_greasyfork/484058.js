// ==UserScript==
// @name         脱离队伍
// @namespace    http://tampermonkey.net/
// @version      2024-01-06
// @description  leave the other teams
// @author       zhaiwei
// @match        http://ah.chinavolunteer.mca.gov.cn/subsite/anhui/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mca.gov.cn
// @grant        none
// @license      GPL license
// @downloadURL https://update.greasyfork.org/scripts/484058/%E8%84%B1%E7%A6%BB%E9%98%9F%E4%BC%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/484058/%E8%84%B1%E7%A6%BB%E9%98%9F%E4%BC%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
 // 生成“脱离”按钮
    var lbtn = document.createElement('button');
    // 按钮文字
    lbtn.innerText = '脱离';
    // 添加按钮的样式类名class值为leaveBtn
    lbtn.setAttribute('class', 'leaveBtn');
    // 生成style标签
    var lstyle = document.createElement('style');
    // 把样式写进去
    lstyle.innerText = `.leaveBtn{position:fixed;top:65%;left:10%;width:75px;height:55px;padding:3px 5px;border:3px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.leaveBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(lstyle);
    // 在body中添加button按钮
    document.body.appendChild(lbtn);
    // 点击按钮去执行修改函数 changeData
    document.querySelector('.leaveBtn').addEventListener('click', function () {
        leaveTeam()
    })

    function leaveTeam(){
        //
        setTimeout('document.querySelector("#orgTable > tr:nth-child(4) > td:nth-child(5)").children[0].click()',10);
        //确定
        setTimeout('document.querySelector("body > div.swal-overlay.swal-overlay--show-modal > div > div.swal-footer > div:nth-child(2) > button").click();',700);
        //
        setTimeout('document.querySelector("body > div.swal-overlay.swal-overlay--show-modal > div > div.swal-footer > div > button").click();',1700);

    }
    // Your code here...
})();