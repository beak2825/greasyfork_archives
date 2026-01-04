// ==UserScript==
// @name         Dogecoin Faucets Give Away Free Dogetoshi
// @namespace    Claim Unlimited Dogecoin
// @version      7.0
// @description  Claim Unlimited Dogecoin[No Timer]
// @author       lotocamion
// @match        https://digitask.ru/
// @match        https://digitask.ru/*
// @icon         https://www.google.com/s2/favicons?domain=digitask.ru
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @match        *://*/recaptcha/*
// @downloadURL https://update.greasyfork.org/scripts/437397/Dogecoin%20Faucets%20Give%20Away%20Free%20Dogetoshi.user.js
// @updateURL https://update.greasyfork.org/scripts/437397/Dogecoin%20Faucets%20Give%20Away%20Free%20Dogetoshi.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var address = false;
    var checkbox = false;
    setTimeout(function() {
    if($('.main__input')) {
    $('.main__input').val("DJRVVPrCrYJn8WdZ67sbiJJ3AwG9tm4PrL");////EDIT YOUR ADDRESS HERE/////
    address = true;
    } }, random(3000,5000));
    setTimeout(function() {
    if((document.querySelector("#post-form > section.capital > div > button")) && (address == true)) {
    document.querySelector("#post-form > section.capital > div > button").click();
    } }, random(15000,20000));
    setTimeout(function() {
    if((document.querySelector("#countdown > captcha > div.center > div > input[type=checkbox]")) && (address == true)) {
    document.querySelector("#countdown > captcha > div.center > div > input[type=checkbox]").click();
    checkbox = true;
    } }, random(12000,14000));
    setTimeout(function() {
    if(document.querySelector("#countdown > captcha > button")) {
    document.querySelector("#countdown > captcha > button").click();
    checkbox = true;
    } }, random(16000,18000));
    setTimeout(function(){
    var url = "https:?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1"
    if (document.querySelector("#post-form > div:nth-child(2) > font > div")) {
    window.location.href = url;
    } }, random(500,1000));
    if(window.location.href.includes("https://digitask.ru/terms.php")) {
    window.location.replace("https://digitask.ru/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1");
    }
    setInterval(function() {
    if(document.querySelector("#reset-button")){
    document.querySelector("#reset-button").click();
    } }, 5000);
    function random(min,max){
    return min + (max - min) * Math.random();
    }
    var y = $(window).scrollTop();
    $('html, body').animate({ scrollTop: y + 900})
    setTimeout(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 55000);
    })();
