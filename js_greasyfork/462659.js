// ==UserScript==
// @name         Google Forms Numerate
// @version      0.1
// @description  Automatically prepend numbers to Google Forms questions
// @license MIT
// @author       Nash
// @match        https://docs.google.com/forms/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @namespace https://greasyfork.org/users/1048651
// @downloadURL https://update.greasyfork.org/scripts/462659/Google%20Forms%20Numerate.user.js
// @updateURL https://update.greasyfork.org/scripts/462659/Google%20Forms%20Numerate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const questions = document.querySelectorAll("span.M7eMe");
    questions.forEach(function (e, i){
        e.innerHTML = `<div><b>Question ${i+1}:</b></div> ${e.innerHTML}`
    });
})();