// ==UserScript==
// @name          invidious Always Dark Theme
// @description   Enables Dark Theme Forever.
// @author        nullgemm
// @version       0.1.3
// @grant         none
// @match         *://invidious.snopyta.org/*
// @run-at        document-idle
// @namespace     https://greasyfork.org/en/users/322108-nullgemm
// @downloadURL https://update.greasyfork.org/scripts/400268/invidious%20Always%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/400268/invidious%20Always%20Dark%20Theme.meta.js
// ==/UserScript==

document.getElementById('dark_theme').media = '';
document.getElementById('light_theme').media = 'none';
window.localStorage.setItem('dark_mode', 'dark');