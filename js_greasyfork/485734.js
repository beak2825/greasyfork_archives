// ==UserScript==
// @name         DinBenDon Auto Compute
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Save your life.
// @author       Ian Yu
// @match        https://dinbendon.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485734/DinBenDon%20Auto%20Compute.user.js
// @updateURL https://update.greasyfork.org/scripts/485734/DinBenDon%20Auto%20Compute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const content = document.querySelector("#signInPanel_signInForm > table > tbody > tr:nth-child(3) > td.alignRight").textContent;
    const result = eval(content.slice(0, content.length-1));
    document.querySelector("[name=result]").value = result;
})();