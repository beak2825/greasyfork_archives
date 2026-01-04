// ==UserScript==
// @name         SCUT Authentication auto login
// @name:zh-TW   華南理工自動登入
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  For sso.scut.edu.cn auto login
// @description:zh-TW  華南理工統一身分認證自動登入
// @author       A scut student
// @match        *://sso.scut.edu.cn/cas/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405215/SCUT%20Authentication%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/405215/SCUT%20Authentication%20auto%20login.meta.js
// ==/UserScript==
var delayInMilliseconds = 200;

(function () {
    'use strict';
console.warn("scut login start")
  

  setInterval(clickConfirm, delayInMilliseconds);
 
})();

function clickConfirm() {
    'use strict';
    var elements2 = document.getElementsByClassName("login_box_landing_btn");
    for(var i = 0; i < elements2.length; i++) {
        try {
            var element = elements2[i];
            if(true) {
                element.click();
                console.warn("clicked!");
                break;
            }
        }
        catch(e){}
    }
}