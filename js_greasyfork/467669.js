// ==UserScript==
// @name           Jlab Auto Answer
// @description    Answers it incorrectly on purpose (supposed to be used with fake results script)
// @include        *://education.jlab.org/solquiz/question.html*
// @author       levisurely
// @license      Apache-2.0
// @version 0.0.2
// @grant        none
// @namespace https://github.com/horsehair/userscripts/blob/main/Jlab%20Auto%20Answers.user.js
// @downloadURL https://update.greasyfork.org/scripts/467669/Jlab%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/467669/Jlab%20Auto%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function () {
    document.querySelector("#answerbox > table > tbody > tr:nth-child(4) > td.text > a").click();
}, 1000);
setInterval(function () {
document.querySelector("#answerbox > table > tbody > tr > td:nth-child(10) > a").click();
}, 1000);
setInterval(function () {
    if (document.querySelector("#bottombutton").style.visibility!="hidden"){
    document.querySelector("#bottombutton > div > a").click();
    }
}, 1000);
})();