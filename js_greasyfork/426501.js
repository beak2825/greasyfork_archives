// ==UserScript==
// @name         Tour of Rust
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix height of code iframe
// @author       Ariel Ferdman
// @match        https://tourofrust.com/*
// @icon         https://www.google.com/s2/favicons?domain=tourofrust.com
// @grant        none
// @esversion    6
// @downloadURL https://update.greasyfork.org/scripts/426501/Tour%20of%20Rust.user.js
// @updateURL https://update.greasyfork.org/scripts/426501/Tour%20of%20Rust.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = () => {
        let techware_a = document.querySelector('iframe');
        techware_a.style.height = "250%";
    }
})();