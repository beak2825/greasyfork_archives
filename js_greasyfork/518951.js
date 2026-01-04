// ==UserScript==
// @name         Hide Advertisements Box on Fishtank.live
// @description  Hides the advertisements box in the left panel on Fishtank LIVE.
// @author       phungus
// @version      1.0.0
// @license      GNU GPLv3
// @homepageURL  https://fishtank.guru
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @supportURL   https://fishtank.guru
// @match        https://www.fishtank.live/
// @match        https://www.fishtank.live/clips
// @match        https://www.fishtank.live/clip/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518951/Hide%20Advertisements%20Box%20on%20Fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/518951/Hide%20Advertisements%20Box%20on%20Fishtanklive.meta.js
// ==/UserScript==

GM_addStyle(`.ads_ads__Z1cPk {display: none;}`);