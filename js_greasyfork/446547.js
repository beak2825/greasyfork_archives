// ==UserScript==
// @name         SCAU禁止选课（恶搞向）
// @namespace    https://juejin.cn/user/1302297507801358
// @version      0.1.0
// @description  让大家选不了课，反内卷！
// @author       Smooth
// @match        *://jwxt.scau.edu.cn/*
// @grant        none
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446547/SCAU%E7%A6%81%E6%AD%A2%E9%80%89%E8%AF%BE%EF%BC%88%E6%81%B6%E6%90%9E%E5%90%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/446547/SCAU%E7%A6%81%E6%AD%A2%E9%80%89%E8%AF%BE%EF%BC%88%E6%81%B6%E6%90%9E%E5%90%91%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("脚本启动");
    setInterval(function(){
        var btns=document.getElementsByTagName('button');
        var i=0;
        for(i=0;i<btns.length;i++){
            btns[i].setAttribute('disabled', 'true');
            btns[i].classList.add('is-disabled');}
    }, 500);
    setTimeout(() => {
       alert('别卷啦，选什么课')
    }, 1000)
})();