// ==UserScript==
// @name         Office 365 Outlook tasks : Large text editing box
// @description  Sets a proper large text editing box on Office 365 Outlook tasks.
// @namespace    http://tampermonkey.net/
// @version      0.2
// @match        https://outlook.office.com/owa/*
// @grant        none
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/383028/Office%20365%20Outlook%20tasks%20%3A%20Large%20text%20editing%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/383028/Office%20365%20Outlook%20tasks%20%3A%20Large%20text%20editing%20box.meta.js
// ==/UserScript==

(function() {

    waitForKeyElements ("._f_i4", setupTextBox);
    waitForKeyElements ("._f_k4", setupTextBox);

    function setupTextBox (nodes) {
        var url = window.location.href;
        if (url.indexOf("path=/tasks") > -1 || url.indexOf("viewmodel=TaskReadingPaneViewModelPopOutFactory") > -1) {
            nodes[0].style.maxWidth="100%";
            nodes[0].style.height="700px";
        }
    }

})();