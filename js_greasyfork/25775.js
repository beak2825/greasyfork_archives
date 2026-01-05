// ==UserScript==
// @name         MANUU INTERNET Authentication Freezer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Freeze the time for MANUU Authentication Page
// @author       Suhail Akhtar (sambhal@outlook.com)
// @website      http://suhail.cu.cc
// @include      http://10.10.10.10:1000/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25775/MANUU%20INTERNET%20Authentication%20Freezer.user.js
// @updateURL https://update.greasyfork.org/scripts/25775/MANUU%20INTERNET%20Authentication%20Freezer.meta.js
// ==/UserScript==

countDown= function(){
    console.info('MANUU INTERNET Authentication Freezer Initialized');
    console.info('Enjoy - by Suhail Akhtar sambhal@outlook.com ');

    setInterval(function(){
        window.location.reload();
    },50000);



};

document.onload = countDown;