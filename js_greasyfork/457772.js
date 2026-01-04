// ==UserScript==
// @name         Claim Free LTC Every Second With Shortlink Option
// @namespace    Claim Free LTC
// @version      1.0
// @description  Claim Free LTC
// @author       someone elsee
// @match        https://crypto-earning.xyz/
// @match        https://crypto-earning.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crypto-earning.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457772/Claim%20Free%20LTC%20Every%20Second%20With%20Shortlink%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/457772/Claim%20Free%20LTC%20Every%20Second%20With%20Shortlink%20Option.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var clicked = true;// SET TO false; ENABLE SHORTLINK // SET TO true; DISABLE SHORTLINK
    var address = false;
    if($('.form-control')) {
    $(".form-control").val("MPC1Jf4AqyQZ43y2f1gCs2WsyqdHSBDiPG");////EDIT YOUR ADDRESS HERE/////
    address = true;
    }

    setInterval(function() {
    if (window.grecaptcha.getResponse().length > 0) {
    document.querySelector("input[value='---------------CLAIM HERE---------------']").click();
    }
    }, 10000);

    setInterval(function() {
    if(!clicked && document.querySelector("a[href='/']")){
    document.querySelector("a[href='/']").click();
    clicked = true;
    } }, 30000);

    setTimeout(function() {
    if (document.querySelector("body > center:nth-child(2) > div")) {
    window.location.replace("https://crypto-earning.xyz/?r=MLda3TqfG8DipJv6H8pP6vvZcXwe3HLR83");
    }
    }, 30000);


    })();