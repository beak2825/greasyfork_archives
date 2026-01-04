// ==UserScript==
// @name         Scroll to first stackoverflow answer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scroll to the first stackoverflow answer on page load
// @author       Alex Lamson
// @match        *://superuser.com/*
// @match        *://stackoverflow.com/*
// @match        *://askubuntu.com/*
// @match        *://serverfault.com/*
// @match        *://*.stackexchange.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450025/Scroll%20to%20first%20stackoverflow%20answer.user.js
// @updateURL https://update.greasyfork.org/scripts/450025/Scroll%20to%20first%20stackoverflow%20answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // collect all the answers
    var answers = document.querySelectorAll(".answer");
    var scores = Array.from(answers).map((x) =>
      parseInt(x.getElementsByClassName("js-vote-count")[0].textContent)
    );

    // scroll to the answer with the highest score
    var i = scores.indexOf(Math.max(...scores));
    answers[i].scrollIntoView();

})();