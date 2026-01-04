// ==UserScript==
// @name         Bing quiz
// @namespace    *.bing.com/
// @version      0.2
// @description  Solve bing quiz
// @author       You
// @match        https://*.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37697/Bing%20quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/37697/Bing%20quiz.meta.js
// ==/UserScript==

setInterval(function(quiz) {
    document.getElementById("rqAnswerOption"+Math.floor(Math.random() * 4)).click();
}, 100)();
