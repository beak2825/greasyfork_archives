// ==UserScript==
// @name         Claim Free Tron With Autologin
// @namespace    Claim Free Tron
// @version      1.2
// @description  Claim Free Tron
// @author       lotocamion
// @match        https://bitmagge.com/
// @match        https://bitmagge.com/*
// @icon         https://bitcaps.io/files/logo/logo_1662456428.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457170/Claim%20Free%20Tron%20With%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/457170/Claim%20Free%20Tron%20With%20Autologin.meta.js
// ==/UserScript==

//INSTRUCTION//
//GOTO https://bitmagge.com/?ref=544 AND SIGNUP
//INSTALL THE SCRIPT AND HCAPTCHA SOLVER LINK=> https://discord.gg/WRudfx9p
//EDIT LINE 25 AND 26 WITH YOUR USERNAME AND PASSWORD
//THEN GOTO https://bitmagge.com/ AND LEAVE THE TAB OPEN



(function() {
    'use strict';
    var clicked = false;
    var address = false;
    var username = "YOURUSERNAME" //ENTER YOUR USERNAME
    var password = "YOURPASSWORD" //ENTER YOUR PASSWORD





    setTimeout(function() {
    if (document.URL =="https://bitmagge.com/"){
    document.querySelector('a.nav-link.btn.btn-info.text-white').click();
    }},5000)

    if(document.querySelector("#remember")){
    document.querySelector("#remember").click();
    }

    setInterval(function() {
    if (!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0){
    document.querySelector('input[type="text"]').value = username
    document.querySelector('input[type="password"]').value = password
    document.querySelector('button.btn.btn-primary.btn-block.btn-lg').click();
    clicked = true;
    }},5000)

    var faucetclick =setInterval(function() {
    if (document.querySelector(".h-captcha")) {
    if (document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0){
    document.querySelector('button.btn.btn-danger.btn-md.w-100.mt-2').click();
    clearInterval(faucetclick);
    } }
    }, 5000);

    setTimeout(function() {
    if (document.querySelector(".alert.alert-success")){
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }}, 55000);

    setInterval(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 60000);

    })();