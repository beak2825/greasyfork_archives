// ==UserScript==
// @name         2012 google logo for vanced neocities
// @namespace    http://exemplo.com
// @version      1.0
// @description  unFlattens the logo
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470068/2012%20google%20logo%20for%20vanced%20neocities.user.js
// @updateURL https://update.greasyfork.org/scripts/470068/2012%20google%20logo%20for%20vanced%20neocities.meta.js
// ==/UserScript==

document.querySelector('img[src="/images/srpr/logo1w.png"]').src = "https://vanced-youtube.neocities.org/images/logos/ps_logo2.png";
