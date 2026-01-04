// ==UserScript==
// @name         2012 google logo fix
// @namespace    http://exemplo.com
// @version      1.0
// @description  deFlattens the logo
// @match        https://oldgoogle.neocities.org/2013/
// @grant        none
// @license      MIT
// @Include      https://oldgoogle.neocities.org/2013.*
// @downloadURL https://update.greasyfork.org/scripts/468006/2012%20google%20logo%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/468006/2012%20google%20logo%20fix.meta.js
// ==/UserScript==

document.querySelector('#logo img').src = "https://googlewebhp.neocities.org/nav_logo224_hr.png";