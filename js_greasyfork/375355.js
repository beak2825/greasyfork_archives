// ==UserScript==
// @name         IMSLP Instant Download
// @namespace    https://imslp.org/
// @version      0.2
// @description  Free the Public Domain music library
// @match        https://imslp.org/wiki/*
// @match        http://petruccilibrary.ca/linkhandler.php*
// @copyright    2018, Isaac Khor
// @downloadURL https://update.greasyfork.org/scripts/375355/IMSLP%20Instant%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/375355/IMSLP%20Instant%20Download.meta.js
// ==/UserScript==

var host = window.location.hostname;

if(host == 'imslp.org') {
    // Check for download link to skip the wait
    var dllink = document.querySelector("span[id$='sm_dl_wait']");
    if(dllink) window.location.replace(dllink.getAttribute('data-id'));

    // Check for the 'I accept the disclaimer' link and auto redirect
    var disl = document.querySelector("a[href^='/wiki/Special:IMSLPDisclaimerAccept/']");
    if(disl) window.location.replace(disl.href);
} else if(host == 'petruccilibrary.ca') {
    var l = document.querySelector("a[href^='/files/']");
    if(l) window.location.replace(l.href);
}