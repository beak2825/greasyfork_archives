// ==UserScript==
// @name         Galaxy Macau auto redirect
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Galaxy Macau auto redirect script
// @author       You
// @match        https://www.ticketing.galaxymacau.com/*
// @icon         https://www.google.com/s2/favicons?sz=128&domain=ticketing.galaxymacau.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461114/Galaxy%20Macau%20auto%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/461114/Galaxy%20Macau%20auto%20redirect.meta.js
// ==/UserScript==

if( window.location.href.indexOf("busy_galaxy.html") > -1 ){
    window.location.href = "https://www.ticketing.galaxymacau.com/default.aspx";
}