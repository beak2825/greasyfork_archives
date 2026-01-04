// ==UserScript==
// @name         Bypass fingertabs downloads
// @match        https://fingertabs.com/*
// @description  Don't wait for the timer on the download
// @license      MIT
// @version 0.0.1.20220924092744
// @namespace https://greasyfork.org/users/941655
// @downloadURL https://update.greasyfork.org/scripts/451930/Bypass%20fingertabs%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/451930/Bypass%20fingertabs%20downloads.meta.js
// ==/UserScript==

window.onload = () => {};

document.getElementById('timer_2').style.display = 'block';
document.getElementById('timer_1').style.display = 'none';

