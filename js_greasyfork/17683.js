// ==UserScript==
// @name          Chat Full Profile Link *OLD*
// @description   Modify the 'View Profile' link in chat to open full (instead of chat) profile
// @version       3.0
// @include       http://www.kongregate.com/games/*
// @require       https://greasyfork.org/scripts/18194/code.user.js
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/17683/Chat%20Full%20Profile%20Link%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17683/Chat%20Full%20Profile%20Link%20%2AOLD%2A.meta.js
// ==/UserScript==

// Nabb, 3rd May 2009: nabb.trap17.com
// Updated 15th May.

// This script will modify the 'View Profile' link in the user list to open the user's full profile instead of the mini-profile.

setTimeout("nFE('UserRollover.prototype.updateProfileLink','.showProfile(',';window.open(\"http://www.kongregate.com/accounts/\"+')",100)