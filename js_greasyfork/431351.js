// ==UserScript==
// @name         Classroom padding change
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change the padding in google classroom
// @author       You
// @match        https://classroom.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431351/Classroom%20padding%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/431351/Classroom%20padding%20change.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function testLoaded() {
        if (document.querySelector(".gHz6xd") !== null) {
            document.querySelectorAll(".gHz6xd").forEach(function(elem) {elem.style.marginRight="17px"});
        } else {
            setTimeout(testLoaded, 100)
        }
    }
    testLoaded()
})();