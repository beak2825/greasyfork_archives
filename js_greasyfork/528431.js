// ==UserScript==
// @name         CSDN-no-login-script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A script tool that allows you to copy and paste csdn code without logging in
// @author       Awan
// @license      AGPL-3.0
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528431/CSDN-no-login-script.user.js
// @updateURL https://update.greasyfork.org/scripts/528431/CSDN-no-login-script.meta.js
// ==/UserScript==

function csdn (){

    let codes = document.querySelectorAll("code");
    codes.forEach(c => {
        c.contentEditable = "true";
    });
    }
    setTimeout(csdn,10);