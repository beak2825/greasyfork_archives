// ==UserScript==
// @name         Autologin Bimay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://binusmaya.binus.ac.id/login/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422549/Autologin%20Bimay.user.js
// @updateURL https://update.greasyfork.org/scripts/422549/Autologin%20Bimay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#login > form > div.user-input > label > input").val(localStorage.getItem('usernameBimay'));
    $("#login > form > p:nth-child(2) > span > input[type=password]").val(localStorage.getItem('passwordBimay'));
    $("#login > form > p:nth-child(6) > input").click();
    // Your code here...
})();