// ==UserScript==
// @name         PornHub consent cookie figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      2024-09-02
// @description  accetta cookie
// @author       figuccio
// @match        https://*.pornhub.com/*
// @exclude      https://*.pornhub.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/billy-herrington-utils@1.1.2/dist/billy-herrington-utils.umd.js
// @require      https://cdn.jsdelivr.net/npm/jabroni-outfit@1.4.8/dist/jabroni-outfit.umd.js
// @require      https://update.greasyfork.org/scripts/494204/data-manager.user.js?version=1434101
// @require      https://update.greasyfork.org/scripts/494205/pagination-manager.user.js?version=1434103
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506460/PornHub%20consent%20cookie%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/506460/PornHub%20consent%20cookie%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
setTimeout(function(){document.querySelector("#modalWrapMTubes > div > div > button").click();}, 4000);//18anni consenso
setTimeout(function(){document.querySelector("#cookieBannerWrapper > button.cbPrimaryCTA.cbButton.gtm-event-cookie-banner") .click();}, 5000);//accetta tutti cookie

})();