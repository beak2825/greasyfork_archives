// ==UserScript==
// @name         Google logo fix neocities
// @namespace    http://exemplo.com
// @version      1.0
// @description  deFlattens the logo
// @match        https://oldgoogle.neocities.org/2013/
// @grant        none
// @license      MIT
// @Include      https://oldgoogle.neocities.*
// @downloadURL https://update.greasyfork.org/scripts/468007/Google%20logo%20fix%20neocities.user.js
// @updateURL https://update.greasyfork.org/scripts/468007/Google%20logo%20fix%20neocities.meta.js
// ==/UserScript==

document.querySelector('#logo img').src = "https://googlewebhp.neocities.org/nav_logo224_hr.png";