    // ==UserScript==
// @name         AIPAC contact form
// @namespace    http://tampermonkey.net/
// @description A script to fill out AIPACs form :) 
// @version  1.1
// @grant    none
// @license MIT
// @include https://www.aipac.org/contact*
// @include https://*.aiapac.org/*
// @downloadURL https://update.greasyfork.org/scripts/448304/AIPAC%20contact%20form.user.js
// @updateURL https://update.greasyfork.org/scripts/448304/AIPAC%20contact%20form.meta.js
// ==/UserScript==
    
    (function() {
        'use strict';
        document.getElementsByClassName("first-name").forEach((el) => {
            console.log(el.children[0].children[0].setAttribute("value", "Your Value"));
        });
        document.getElementsByClassName("last-name").forEach((el) => {
            console.log(el.children[0].children[0].setAttribute("value", "Your Value"));
        });

        document.getElementsByClassName("email").forEach((el) => {
            console.log(el.children[1].setAttribute("value", "your@value.org"));
        });

        document.getElementsByClassName("address1").forEach((el) => {
            console.log(el.children[0].children[0].setAttribute("value", "123 Your Value"));
        });

        document.getElementsByClassName("address2").forEach((el) => {
            console.log(el.children[0].children[0].setAttribute("value", "456 Your Value"));
        });

        document.getElementsByClassName("city").forEach((el) => {
            console.log(el.children[0].children[0].setAttribute("value", "Your Value"));
        });
        document.getElementsByClassName("state-province").forEach((el) => {
            console.log(el.children[0].children[0].setAttribute("value", "Your Value"));
        });

        document.getElementsByClassName("zip").forEach((el) => {
            console.log(el.children[0].children[0].setAttribute("value", "Your Value"));
        });

        document.getElementsByClassName("country").forEach((el) => {
            console.log(el.children[0].children[0].setAttribute("value", "Your Value"));
        });

        document.getElementsByClassName("textarea").forEach((el) => {
            console.log(el.children[1].value = "Your Value");
        });
        // Your code here...
    })();