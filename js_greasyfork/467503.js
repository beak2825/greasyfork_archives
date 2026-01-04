// ==UserScript==
// @name         Vipminer DOGE Faucet
// @namespace    Claim Free Tron
// @version      3.0
// @description  Claim Free Tron
// @author       lotocamion
// @match        https://vipminer.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vipminer.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467503/Vipminer%20DOGE%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/467503/Vipminer%20DOGE%20Faucet.meta.js
// ==/UserScript==


//INSTALL THE SCRIPT AND HCAPTCHA SOLVER AND EDIT LINE 20 WITH YOUR FAUCETPAY ADDRESS
//THEN GOTO https://vipminer.xyz/free-dogecoin-miner/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn AND LEAVE THE TAB OPEN

(function() {
    'use strict';


    var tron = "DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1" //EDIT WITH FAUCETPAY TRON ADDRESS



    if(document.querySelector("#address")){
    document.querySelector("#address").value = tron
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
    window.location.replace('https://vipminer.xyz/free-dogecoin-miner/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn')
    }}, 5000);

    setTimeout(function(){
    if(document.querySelector("div[role='alert']").textContent.includes("You have to wait")){
    window.location.replace('https://vipminer.xyz/free-dogecoin-miner/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn')
    }}, 20000);

    setTimeout(function(){
    if(document.querySelector("div[role='alert']").textContent.includes("Session invalid, try again")){
    window.location.replace('https://vipminer.xyz/free-dogecoin-miner/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn')
    }}, 5000);

    setTimeout(function(){
    if(document.querySelector("div[role='alert']").textContent.includes("Unknown Error")){
    window.location.replace('https://vipminer.xyz/free-dogecoin-miner/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn')
    }}, 5000);

    var y = $(window).scrollTop();
    $('html, body').animate({ scrollTop: y + 900})

    setInterval(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 180000);
})();