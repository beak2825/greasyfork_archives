// ==UserScript==
// @name         Code.org Auto Report
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically clicks the report link when in a code.org project.
// @author       You
// @match        https://studio.code.org/projects/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=code.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454790/Codeorg%20Auto%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/454790/Codeorg%20Auto%20Report.meta.js
// ==/UserScript==

var i = setInterval(() => {
    var ml = document.getElementsByClassName("more-link")[0];
    if (ml != undefined) {
        clearInterval(i);
        ml.click();
        var ra = document.getElementsByClassName("ui-test-report-abuse")[0].children[0];
        ra.target = "";
        ra.click();
    }
}, 10);