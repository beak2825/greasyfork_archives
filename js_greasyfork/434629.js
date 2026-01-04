// ==UserScript==
// @name         【魔学院专用】自动点击脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  魔学院专用脚本，干掉烦人的弹窗
// @author       Mr_Black
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434629/%E3%80%90%E9%AD%94%E5%AD%A6%E9%99%A2%E4%B8%93%E7%94%A8%E3%80%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434629/%E3%80%90%E9%AD%94%E5%AD%A6%E9%99%A2%E4%B8%93%E7%94%A8%E3%80%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function del() {
        var a = document.getElementsByClassName('popup-buttons')[0];
        if (a) {
            document.getElementsByClassName('popup-buttons')[0].click();
        };
        var c = document.getElementsByClassName('popup-buttons')[0];
        if (c) {
            document.getElementsByClassName('popup-buttons')[0].click();
        };
    }
    setInterval(del, 9000);
})();
if(event.keyCode==13){
   document.getElementById('buttonClientID').click();
};