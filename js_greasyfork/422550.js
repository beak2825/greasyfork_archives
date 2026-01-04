// ==UserScript==
// @name         Auto Login Exam Apps
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://exam.apps.binus.ac.id/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422550/Auto%20Login%20Exam%20Apps.user.js
// @updateURL https://update.greasyfork.org/scripts/422550/Auto%20Login%20Exam%20Apps.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#Username").val(localStorage.getItem('usernameBimay'));
    $("#Password").val(localStorage.getItem('passwordBimay'));
    $("#btnSubmit").click();
    // Your code here...
})();