// ==UserScript==
// @name         2012 google logo
// @namespace    http://exemplo.com
// @version      1.0
// @description  unFlattens the logo
// @match        https://oldgoogle.neocities.org/2013.*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467941/2012%20google%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/467941/2012%20google%20logo.meta.js
// ==/UserScript==

document.querySelector('#logo img').src = "https://googlewebhp.neocities.org/nav_logo224_hr.png";
