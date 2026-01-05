// ==UserScript==
// @name         ABP Maid
// @namespace    http://www.twprogrammers.com/
// @version      0.1
// @description  Cleans up the leftover elements that ABP leaves.
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @match        http*://*.playonlinux.com/*
// @downloadURL https://update.greasyfork.org/scripts/10700/ABP%20Maid.user.js
// @updateURL https://update.greasyfork.org/scripts/10700/ABP%20Maid.meta.js
// ==/UserScript==

var SITE_POL = 0;

var ACTIVE_SITE = 0;
var HOST = document.location.hostname.toLowerCase();

function detectSite()
{
    if(HOST.indexOf("playonlinux.com") >= 0) ACTIVE_SITE = SITE_POL;
}

function abpm_init()
{
    detectSite();
    switch(ACTIVE_SITE)
    {
        case SITE_POL:
            $('#ads').prev('h1').hide();
            break;
        default:
            console.log("Script run, but site unknown.");
    }
}

abpm_init();