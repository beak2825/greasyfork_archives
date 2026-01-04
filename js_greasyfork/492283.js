// ==UserScript==
// @name         enable-text-selection
// @namespace    MEDS 201
// @version      1.1
// @description  Removes that pesky class on the questions
// @author       Ethan Logue
// @match        https://rit4.cipcourses.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cipcourses.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492283/enable-text-selection.user.js
// @updateURL https://update.greasyfork.org/scripts/492283/enable-text-selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var eles = document.querySelectorAll('.disable-text-selection');
        eles.forEach(ele => ele.classList.remove("disable-text-selection"));
    }, 2000);

})();