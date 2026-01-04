// ==UserScript==
// @name         Extend Monitoring Point Box on Fishtank.live
// @description  Extends the monitoring points box on Fishtank LIVE so all camera names are visible without needing to scroll.
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
// @downloadURL https://update.greasyfork.org/scripts/518948/Extend%20Monitoring%20Point%20Box%20on%20Fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/518948/Extend%20Monitoring%20Point%20Box%20on%20Fishtanklive.meta.js
// ==/UserScript==

GM_addStyle(`.live-streams-monitoring-point_live-streams-monitoring-point__KOqPQ .live-streams-monitoring-point_list__g0ojU {max-height: 1250px;}`);