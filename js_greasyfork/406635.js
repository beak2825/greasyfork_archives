// ==UserScript==
// @name         YouTube Auto Dark Switch
// @version      0.1
// @author       Adrian Urbaniak
// @match        https://www.youtube.com/*
// @license MIT
// @description:en Script automatically setting up dark mode on YT at specified time.
// @namespace https://greasyfork.org/users/664257
// @description Script automatically setting up dark mode on YT at specified time.
// @downloadURL https://update.greasyfork.org/scripts/406635/YouTube%20Auto%20Dark%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/406635/YouTube%20Auto%20Dark%20Switch.meta.js
// ==/UserScript==


var nightHour=18;
var dayHour=7;
var a=5; //interval in mins

function check() {
var hrs = new Date().getHours();
if (hrs >= nightHour || hrs < dayHour) {

    document.getElementsByTagName('html')[0].setAttribute('dark', 'true');
}
else
{
document.getElementsByTagName('html')[0].removeAttribute('dark');
}
setInterval(check,a*60000);
}
check();