// ==UserScript==
// @name         Vipminer dogecoin Faucet
// @namespace    Claim Free dogecoin
// @version      4.1
// @description  Claim Free dogecoin
// @author       elmer76
// @match        https://vipminer.xyz/free-dogecoin-miner/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vipminer.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478974/Vipminer%20dogecoin%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/478974/Vipminer%20dogecoin%20Faucet.meta.js
// ==/UserScript==


//INSTALL THE SCRIPT AND HCAPTCHA SOLVER AND EDIT LINE 20 WITH YOUR FAUCETPAY ADDRESS
//THEN GOTO https://vipminer.xyz/free-dogecoin-miner/?r=TDpBsMSYH6wMmLCxDFLYTb2qW3wVebw3nt AND LEAVE THE TAB OPEN

(function() {
    'use strict';


    var doge = "" //EDIT WITH FAUCETPAY DOGE ADDRESS



    if(document.querySelector("#address")){
    document.querySelector("#address").value = doge
    }

    if(document.querySelector("#startButton")){
    document.querySelector("#startButton").click()
    }

    setInterval(function() {
    if (document.querySelector("#count").textContent.includes("0.00100000")){
    document.querySelector("#showContentButton").click();
    } },3000);

    setInterval(function() {
    if(document.querySelector("#count").textContent.includes("0.00100000")&& grecaptcha.getResponse().length > 0 || document.querySelector(".g-recaptcha").getAttribute("value").length > 0){
    document.querySelector("#login").click();
    }},5000);

    setTimeout(function(){
    if(document.querySelector("div[role='alert']").textContent.includes("was sent to your")){
    window.location.replace('https://vipminer.xyz/free-dogecoin-miner/?r=TDpBsMSYH6wMmLCxDFLYTb2qW3wVebw3nt')
    }}, 2000);

    setTimeout(function(){
    if(document.querySelector("div[role='alert']").textContent.includes("You have to wait")){
    window.location.replace('https://vipminer.xyz/free-dogecoin-miner/?r=TDpBsMSYH6wMmLCxDFLYTb2qW3wVebw3nt')
    }}, 20000);

    setTimeout(function(){
    if(document.querySelector("div[role='alert']").textContent.includes("try again")){
    window.location.replace('https://vipminer.xyz/free-dogecoin-miner/?r=TDpBsMSYH6wMmLCxDFLYTb2qW3wVebw3nt')
    }}, 2000);

    setTimeout(function(){
    if(document.querySelector("div[role='alert']").textContent.includes("sufficient funds")){
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }}, 2000);

    var y = $(window).scrollTop();
    $('html, body').animate({ scrollTop: y + 900})

    setTimeout(() => {
    location.reload();
    }, 180000);
})();