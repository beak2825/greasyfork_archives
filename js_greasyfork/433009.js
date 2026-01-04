// ==UserScript==
// @name         中石化网络学院自动保存
// @namespace    https://greasyfork.org/users/433510
// @version      0.1
// @description  每二十分钟自动保存中石化网络学院学习进度
// @author       lingyer
// @match        http://sia.sinopec.com/secure/player/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433009/%E4%B8%AD%E7%9F%B3%E5%8C%96%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/433009/%E4%B8%AD%E7%9F%B3%E5%8C%96%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var savebtn;

    savebtn = document.getElementById("totalSaveBtn");
    console.log(savebtn);
    setTimeout(savestatus, 1200000);

    function savestatus() {
        savebtn.click();
        setTimeout(savestatus, 1200000);
    }
})();