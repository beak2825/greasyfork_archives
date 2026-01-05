// ==UserScript==
// @name        YouTube: Hide Info/Card Button
// @description Hides the info/card button in videos
// @author      Challenger
// @namespace   https://greasyfork.org/users/11442
// @version     1
// @match       http://www.youtube.com/watch*
// @match       https://www.youtube.com/watch*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26127/YouTube%3A%20Hide%20InfoCard%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/26127/YouTube%3A%20Hide%20InfoCard%20Button.meta.js
// ==/UserScript==
GM_addStyle(".ytp-cards-button {display: none;}");