// ==UserScript==
// @name         Jira Remove Selected Issue from sprintboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  removes sleected issue on load
// @author       wolfposd
// @match        https://*/secure/RapidBoard.jspa*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/374700/Jira%20Remove%20Selected%20Issue%20from%20sprintboard.user.js
// @updateURL https://update.greasyfork.org/scripts/374700/Jira%20Remove%20Selected%20Issue%20from%20sprintboard.meta.js
// ==/UserScript==

removeHeader();

function removeHeader() {
    var ii = window.location.href.indexOf("&selectedIssue");
    if(ii !== -1) {
       console.log("JRSI: Removing selected issue");
       window.location.replace(window.location.href.substring(0,ii));
    }
}

