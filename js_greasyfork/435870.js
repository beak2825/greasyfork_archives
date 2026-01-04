// ==UserScript==
// @name         HTTP Form Submit Alerts
// @namespace    HTTP Form Submit Alerts
// @version      0.1.0
// @description  Alert the user when they submit forms.
// @author       Martin H. McWatters
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435870/HTTP%20Form%20Submit%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/435870/HTTP%20Form%20Submit%20Alerts.meta.js
// ==/UserScript==


function formSubmitted() {
    if(document.getElementsByTagName("form").onsubmit()) {
        siteURL = window.location.href || document.URL;
        alert('Wait! You are submitting a form on ' + siteURL + ". Make sure you trust this site!");
        if (siteURL[6] == 'http://') {
            alert('Are you REALLY sure? This is an insecure site. Your data is significantly more prone to hackers this way.')
        }
    }
}