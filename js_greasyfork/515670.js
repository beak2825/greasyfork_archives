// ==UserScript==
// @name         StickyUnitsWME
// @namespace    http://tampermonkey.net/
// @version      2024-11-04 - 03
// @description  Used to make Measurement Units "Sticky." Supports cookies, and a fallback unit in the event the cookie is not found. Cookie setup can be found here https://i.imgur.com/DOn3sQw.png
// @author       PlurallyDialLLC
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/515670/StickyUnitsWME.user.js
// @updateURL https://update.greasyfork.org/scripts/515670/StickyUnitsWME.meta.js
// ==/UserScript==


const METRIC = false; // To make editing easier for non-scripters.
const IMPERIAL = true; // To make editing easier for non-scripters.



//  \/ CONFIG \/

const FALLBACK_UNIT = IMPERIAL; // Unit that will be used IF a cookie is not found. Type either IMPERIAL or METRIC.

//  \/ CONFIG /\


(async function() {
    'use strict';
    const WME_COOKIE = await cookieStore.get("WME_MandateUnitType");
    const USE_IMPERIAL_UNIT = (WME_COOKIE && WME_COOKIE.value === "IMPERIAL" ) ? IMPERIAL : (WME_COOKIE && WME_COOKIE.value === "METRIC" ) ? METRIC : FALLBACK_UNIT;
    let pref = JSON.parse(localStorage.getItem("preferences-1"))
    pref.isImperial = USE_IMPERIAL_UNIT;
    localStorage.setItem("preferences-1",JSON.stringify(pref))
})();