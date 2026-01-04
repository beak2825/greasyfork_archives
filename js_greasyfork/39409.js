// ==UserScript==
// @name         LaunchPad Autofill District
// @namespace    https://github.com/shiv213
// @version      0.0.1
// @description  Autofills district on LaunchPad
// @author       Shiv Trivedi
// @match        https://launchpad.classlink.com/?loggedout=*
// @match        https://launchpad.classlink.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39409/LaunchPad%20Autofill%20District.user.js
// @updateURL https://update.greasyfork.org/scripts/39409/LaunchPad%20Autofill%20District.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = window.setTimeout(
    function(){
        console.log("Autofilling 'FULTON'");
        document.getElementById("code").value="FULTON";
    }, 100);

})();