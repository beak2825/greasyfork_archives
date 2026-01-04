// ==UserScript==
// @name         高雄大學moodle平臺自動登入
// @namespace    http://tampermonkey.net/
// @version      9.5.2.7
// @description  國立高雄大學moodle平臺自動登入
// @author       jaxx
// @match        https://elearningv4.nuk.edu.tw/*
// @icon         https://elearningv4.nuk.edu.tw/pluginfile.php/1/theme_moove/favicon/1692935050/favicon-nuk.ico
// @grant        none
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/476315/%E9%AB%98%E9%9B%84%E5%A4%A7%E5%AD%B8moodle%E5%B9%B3%E8%87%BA%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/476315/%E9%AB%98%E9%9B%84%E5%A4%A7%E5%AD%B8moodle%E5%B9%B3%E8%87%BA%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';


//此處填寫學號及密碼
const AC="a9995599";
const PW="Passw0rd";






    if(location.pathname ==="/"){
   var nameInput = document.getElementById("username");
var emailInput = document.getElementById("password");

    nameInput.value = AC;
emailInput.value = PW;


var loginButton = document.querySelector('.btn.btn-primary');

loginButton.click();}else if(location.pathname ==="/login/index.php"){







    var nameInputb = document.getElementById("username");
var emailInputb = document.getElementById("password");

    nameInputb.value = AC;
emailInputb.value = PW;

document.getElementById("loginbtn").click();


}







})();