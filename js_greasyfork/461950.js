// ==UserScript==
// @name Nitrotype Captcha Bypass
// @namespace dead.tk
// @license mq
// @version 1.0
// @description This script bypasses the captcha on nitro type and allows you to race without any interruptions.
// @author mq
// @match https://www.nitrotype.com/race
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/461950/Nitrotype%20Captcha%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/461950/Nitrotype%20Captcha%20Bypass.meta.js
// ==/UserScript==

var captcha = document.getElementById('captcha');

if (captcha) {
captcha.style.display = 'none';
}