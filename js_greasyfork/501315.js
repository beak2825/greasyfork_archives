// ==UserScript==
// @name adBlocker for Worldledayly
// @version 0.0.2
// @author YakoHobisa
// @description adBlocker for Worldledayly.
// @match https://worldledaily.com/*
// @grant        none
// @namespace https://greasyfork.org/en/users/1085239-yakohobisa
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501315/adBlocker%20for%20Worldledayly.user.js
// @updateURL https://update.greasyfork.org/scripts/501315/adBlocker%20for%20Worldledayly.meta.js
// ==/UserScript==


(function ad() {
document.getElementById("worldledaily-com_160x600").style.visibility = "hidden";
}, 5000);
ad();