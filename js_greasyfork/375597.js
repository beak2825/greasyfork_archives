// ==UserScript==
// @name         MyCourses
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mycourses2.mcgill.ca/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/375597/MyCourses.user.js
// @updateURL https://update.greasyfork.org/scripts/375597/MyCourses.meta.js
// ==/UserScript==
function test() {

    document.getElementById('link1').click();
}

(function() {
    'use strict';
    test();
})();