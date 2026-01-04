// ==UserScript==
// @name       Redirect to Old Nexus Mods
// @version    1.0
// @description redirects new Nexus Mods to old Nexus Mods
// @include    https://www.nexusmods.com/*
// @run-at     document-start
// @namespace https://greasyfork.org/users/162192
// @downloadURL https://update.greasyfork.org/scripts/36094/Redirect%20to%20Old%20Nexus%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/36094/Redirect%20to%20Old%20Nexus%20Mods.meta.js
// ==/UserScript==
// code taken from this script: https://greasyfork.org/en/scripts/33833
// original creator: https://greasyfork.org/en/users/155269
// Thank you SpookieWookie for the original script

var changeURL = window.location.href;
location.href = changeURL.replace('https://www.','https://old.');