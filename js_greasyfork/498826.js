// ==UserScript==
// @name         Programmers interviewer's screen
// @namespace    https://greasyfork.org/en/users/1323529-jaesuk-hwang
// @version      2024-06-25
// @description  There are too many sensitive information in the coding test results of Programmers. This is mainly for sharing the results with the interviewee.
// @author       Jaesuk Hwang
// @match        https://business.programmers.co.kr/tryout_tokens/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498826/Programmers%20interviewer%27s%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/498826/Programmers%20interviewer%27s%20screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector('div.navbar-application').style.display = 'none';
    document.querySelector('div.container-tryout-tokens').style.display = 'none';
    document.querySelector('div.footer-wrap').style.display = 'none';
    document.querySelectorAll('div.algorithm-tab').forEach(
        (element) => {
            element.childNodes[1].remove();
        }
    )
    document.querySelectorAll('div.arrow-submission').forEach(
        (element) => {element.style.display = 'none';}
    )
    document.querySelectorAll('h6.submission-score').forEach(
        (element) => {element.style.display = 'none';}
    )
    document.querySelectorAll('div.submission-results').forEach(
        (element) => {element.style.display = 'none';}
    )
})();