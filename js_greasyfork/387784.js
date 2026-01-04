// ==UserScript==
// @name         Sun's Useful Settings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I'm A Description OF A Script :P
// @author       Sun
// @match        http://zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387784/Sun%27s%20Useful%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/387784/Sun%27s%20Useful%20Settings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

document.getElementsByClassName("hud-day-night-overlay")[0].remove();
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 99);
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 99);
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName("hud-party-joining")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();
document.getElementsByClassName("hud-respawn-corner-bottom-left")[0].remove();
document.getElementById('hud-menu-settings').style.width = "610px";
document.getElementById('hud-menu-settings').style.height = "525px";
document.getElementById('hud-menu-party').style.width = "620px";
document.getElementById('hud-menu-party').style.height = "530px";
document.getElementsByClassName('hud-intro-corner-top-right')[0].style.top = "-0.01px";
document.getElementsByClassName("hud-intro-play")[0].className = "bttn-dark";
document.getElementsByClassName('bttn-dark')[0].style.top = "10px";
document.getElementsByClassName('bttn-dark')[0].style.left = "-4.5px";