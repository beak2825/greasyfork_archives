// ==UserScript==
// @name         CampusNexus - Smaller Row Heights, Remove Nobreak
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Easier to view Tasks screen for Nexus web client
// @author       You
// @include        https://campusnexus.herzing.edu/*
// @include        https://campusnexus-dev.herzing.edu/*
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/413311/CampusNexus%20-%20Smaller%20Row%20Heights%2C%20Remove%20Nobreak.user.js
// @updateURL https://update.greasyfork.org/scripts/413311/CampusNexus%20-%20Smaller%20Row%20Heights%2C%20Remove%20Nobreak.meta.js
// ==/UserScript==


GM_addStyle ( `
    .k-grid td {
      padding: 0px 0px !important;
      white-space: normal !important;
}
` );