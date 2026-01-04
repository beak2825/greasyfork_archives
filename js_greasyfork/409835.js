// ==UserScript==
// @name         師大選課登入
// @namespace    https://ujoj.cc/
// @version      0.1
// @description  自動登入選課系統
// @author       as535364
// @include      http://cos*.ntnu.edu.tw/AasEnrollStudent/LoginCheckCtrl?language=TW
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409835/%E5%B8%AB%E5%A4%A7%E9%81%B8%E8%AA%B2%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/409835/%E5%B8%AB%E5%A4%A7%E9%81%B8%E8%AA%B2%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const studentID = "", password = "";

    document.getElementById("imageBoxTurnIntoTextButton").click();
    var checkExist = setInterval(function() {
        if (document.getElementById("messagebox-1001-displayfield-inputEl").innerText) {
            clearInterval(checkExist);
            var checkbox = document.getElementById("messagebox-1001-displayfield-inputEl").innerText;
            document.getElementById("tool-1018").click();
            document.getElementById("userid-inputEl").value = studentID;
            document.getElementById("password-inputEl").value = password;
            document.getElementById("validateCode-inputEl").value = checkbox;
            document.getElementById("button-1016-btnEl").click();
        }
    }, 50);

})();