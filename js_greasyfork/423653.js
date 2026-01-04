// ==UserScript==
// @name         Auto Go Back AWS Educate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Go Back AWS Educate Record Answers
// @author       You
// @match        *.execute-api.us-east-1.amazonaws.com/RecordAnswers
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423653/Auto%20Go%20Back%20AWS%20Educate.user.js
// @updateURL https://update.greasyfork.org/scripts/423653/Auto%20Go%20Back%20AWS%20Educate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', window.history.back(), false);;
    // Your code here...
})();