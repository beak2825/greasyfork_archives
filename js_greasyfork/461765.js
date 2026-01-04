// ==UserScript==
// @name        Auto Username & Connect
// @namespace   Script
// @match       http://fe2.io/
// @grant       none
// @version     1.1
// @author      tide
// @description Puts in your username and hits Connect for you.
// @downloadURL https://update.greasyfork.org/scripts/461765/Auto%20Username%20%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/461765/Auto%20Username%20%20Connect.meta.js
// ==/UserScript==

var username = "Your User Here"

document.getElementById('uname').value=`${username}`
document.getElementById("connectButton").click();

// Credit to lolly for this one
document.getElementById("deathQuietenRadio").click(); // deathQuietenRadio, deathDisableRadio