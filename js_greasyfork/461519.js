// ==UserScript==
// @name         Stupid futzing to fix the router's password management nonsense
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  NetComm are bad at web design and should feel bad about me having to do this so that a LOGIN FORM, one of the most BASIC and WIDESPREAD CONCEPTS on the INTERNET, works properly with my Password Manager
// @author       You
// @match        http://192.168.8.1/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=8.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461519/Stupid%20futzing%20to%20fix%20the%20router%27s%20password%20management%20nonsense.user.js
// @updateURL https://update.greasyfork.org/scripts/461519/Stupid%20futzing%20to%20fix%20the%20router%27s%20password%20management%20nonsense.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector(".pn-password-input-active").onblur = undefined;
    onFocusPassword();
    document.querySelector(".pn-username-input").onblur = undefined;
    onFocusUsername();
})();