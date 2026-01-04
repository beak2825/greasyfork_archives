// ==UserScript==
// @name         Hide Season Pass Popups on Fishtank.live
// @description  Blocks the Season Pass popup advertisements for the poors on Fishtank LIVE.
// @author       phungus
// @version      1.1.0
// @license      GNU GPLv3
// @homepageURL  https://fishtank.guru
// @namespace    https://fishtank.guru
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @supportURL   https://fishtank.guru
// @match        https://www.fishtank.live/
// @match        https://www.fishtank.live/clips
// @match        https://www.fishtank.live/clip/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518916/Hide%20Season%20Pass%20Popups%20on%20Fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/518916/Hide%20Season%20Pass%20Popups%20on%20Fishtanklive.meta.js
// ==/UserScript==

GM_addStyle(`.toast_season-pass__cmkhU, .experience-daily-login_season-pass__YTtsY:has(.icon_icon__bDzMA), .item-generator_item-generator__TCQ9l {display: none;}`);