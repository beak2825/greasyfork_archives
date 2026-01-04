// ==UserScript==
// @name        Bagi/Keran AntiAntiAdblock
// @description Scripts that removes the Disable Adblock message for Bagi/Keran
// @author      LgamerLIVE
// @match       https://keran.co/*
// @match       https://bagi.co.in/*
// @grant       none
// @version     1.0
// @run-at      document-start
// @namespace https://greasyfork.org/users/706128
// @downloadURL https://update.greasyfork.org/scripts/456175/BagiKeran%20AntiAntiAdblock.user.js
// @updateURL https://update.greasyfork.org/scripts/456175/BagiKeran%20AntiAntiAdblock.meta.js
// ==/UserScript==
//
// Bagi/Keran AntiAntiAdblock
//
// How does it work?
// All block lists include a reference to "adex.js" because it's a common name for JavaScript files that are associated with serving ads.
// Knowing this, Keran/Bagi are using the a code which creates a hidden div to a file called "adex.js".
// Then they simply detect if the script is loaded or not.
//
// This script makes the file again, making it impossible for them to detect (:
var e=document.createElement('div');e.id='AntiAdblock';e.style.display='none';document.body.appendChild(e);
// Note that this script only works for Bagi/Keran and is not universal.