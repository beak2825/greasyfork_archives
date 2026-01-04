// ==UserScript==
// @name        BIGideas math autro sigh in
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bigideasmath.com/BIM/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421334/BIGideas%20math%20autro%20sigh%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/421334/BIGideas%20math%20autro%20sigh%20in.meta.js
// ==/UserScript==

(function() {
    'use strict';

//Change the username and password to urs
var userName = "xxxxx";
var Password = "xxxxx";


//setting the values....
document.querySelector("#loginForm > div.input-container > input.form-control.bi-form-control.user-input").value = userName;
document.querySelector("#loginForm > div.input-container > input.form-control.bi-form-control.password-input").value = Password;

//clicking submit
document.querySelector("#loginSubmit").click();


console.log("MaDE BY sean v")
})();