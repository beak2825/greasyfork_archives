// ==UserScript==
// @name         local rustdoc theme
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sets the theme when opening local rustdoc (replace `ayu` with your prefered theme
// @author       ModProg
// @match        file:///**/target/doc/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461249/local%20rustdoc%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/461249/local%20rustdoc%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.localStorage.setItem("rustdoc-theme", "ayu");
    window.localStorage.setItem("rustdoc-preferred-dark-theme", "ayu");
    // Your code here...
})();