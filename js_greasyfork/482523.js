// ==UserScript==
// @name         SJTU Postgraduate Evaluate
// @namespace    http://tampermonkey.net/
// @version      2023-12-18
// @description  评教
// @author       Okabe
// @match        http://yjs.sjtu.edu.cn/gsapp/sys/wspjapp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482523/SJTU%20Postgraduate%20Evaluate.user.js
// @updateURL https://update.greasyfork.org/scripts/482523/SJTU%20Postgraduate%20Evaluate.meta.js
// ==/UserScript==
setInterval((function() {
    'use strict';
    // Set the value of the radio button you want to select (e.g., 5 for "Strongly agree")
    var targetValue = 5;

    // Find the radio button with the specified value and check it
    var radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(function(radioButton) {
        if (parseInt(radioButton.value) === targetValue) {
            radioButton.checked = true;
        }
    });
    // Your code here...
}), 1000);
