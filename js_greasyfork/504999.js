// ==UserScript==
// @name         change your university
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-08-24-3
// @description  学信网，改成你想要的大学（仅供装逼）
// @author       sword
// @match        https://my.chsi.com.cn/archive/wap/gdjy/index.action
// @icon         https://t1.chei.com.cn/archive/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504999/change%20your%20university.user.js
// @updateURL https://update.greasyfork.org/scripts/504999/change%20your%20university.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const university = "北京大学";
    const major = "计算机科学与技术 | 普通全日制";

    document.querySelectorAll('.yxmc').forEach(u=>{
        if(u.firstChild.data != '您没有考研信息！')
            u.firstChild.data = university;
    })

    document.querySelectorAll('.des').forEach((u,index)=>{
        if(index<2)
            u.firstChild.data = major;
    })

    // Your code here...
})();