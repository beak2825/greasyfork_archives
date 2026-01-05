// ==UserScript==
// @name        Username History tab changer
// @namespace   jiggmin
// @description replaces the "username history" with a shorter phrase so it actually shows on one line
// @include     http://jiggmin.com/members/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3384/Username%20History%20tab%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/3384/Username%20History%20tab%20changer.meta.js
// ==/UserScript==

document.getElementById("usernamehistory-tab").innerHTML = "Aliases"
document.getElementById("activitystream-tab").innerHTML = "Activity"