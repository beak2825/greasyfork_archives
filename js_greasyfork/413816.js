// ==UserScript==
// @name         Jira Banner Blocker
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  This Script disable the Announcement Banner on your Jira Board
// @author       Nils K.
// @include      https://jira.*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413816/Jira%20Banner%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/413816/Jira%20Banner%20Blocker.meta.js
// ==/UserScript==


// Decativates the Announcment Banner on Jira sites
document.getElementById("announcement-banner").innerHTML="The Banner is disabled";
document.getElementById("announcement-banner").style="text-align: center; color: red; font-weight: bold; cursor: pointer";
document.getElementById("announcement-banner").onclick=disableAlternativeText;

var reminder = sessionStorage.getItem('closed');
if (reminder == 'true'){
    disableAlternativeText();
}else{
    return;
}


function disableAlternativeText() {
    document.getElementById("announcement-banner").style.display="none";
    sessionStorage.setItem('closed','true');
}
