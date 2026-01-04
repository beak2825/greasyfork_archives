// ==UserScript==
// @name         EWT自动过课堂检测
// @namespace    http://tampermonkey.net/EWT
// @version      2025-01-31
// @description  SB EWT ↓使用教程移步简介↓
// @author       Panda_Chen
// @match        https://teacher.ewt360.com/ewtbend/bend/index/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ewt360.com
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/524509/EWT%E8%87%AA%E5%8A%A8%E8%BF%87%E8%AF%BE%E5%A0%82%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524509/EWT%E8%87%AA%E5%8A%A8%E8%BF%87%E8%AF%BE%E5%A0%82%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let i =0
    function myTask() {
        if (document.querySelector(".btn-3LStS") == null) {
            console.log('没找到暂停按钮！目前绕过检测',i,'次')
        }else{
            console.log('找到暂停按钮！')
            i+=1
            document.querySelector(".btn-3LStS").click()
        }
        setTimeout(myTask, 5000);
    }
    myTask();

})();