// ==UserScript==
// @name         ניב החצוף
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  מנבנב לכם את האנטי בקלי קלות
// @author       Muffin24
// @match        https://www.fxp.co.il/modcp/antispam.php?u=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466938/%D7%A0%D7%99%D7%91%20%D7%94%D7%97%D7%A6%D7%95%D7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/466938/%D7%A0%D7%99%D7%91%20%D7%94%D7%97%D7%A6%D7%95%D7%A3.meta.js
// ==/UserScript==
document.querySelectorAll('input[type=checkbox]').forEach(input => input.click())
document.querySelector('input[type=submit]').click();
