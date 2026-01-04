// ==UserScript==
// @name         Mobile 1668 to Desktop
// @namespace    https://www.reddit.com/user/RobotOilInc
// @version      0.1.1
// @description  Auto Redirect from mobile 1668 to desktop
// @author       RobotOilInc
// @match        https://m.1688.com/offer/*.html*offerId=*
// @match        https://m.1688.com/offer/*.html*
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/430178-mobile-1668-to-desktop
// @supportURL   https://greasyfork.org/en/scripts/430178-mobile-1668-to-desktop
// @run-at       document-start
// @icon         https://img.alicdn.com/tfs/TB1uh..zbj1gK0jSZFuXXcrHpXa-16-16.ico?x-icon
// @downloadURL https://update.greasyfork.org/scripts/430178/Mobile%201668%20to%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/430178/Mobile%201668%20to%20Desktop.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// Regex to grab offerId if not in URL
const regex = /https?:\/\/m\.1688\.com\/offer\/(.*)\.html/i;

// Get the offerId
let offerId = (new URLSearchParams(window.location.search)).get('offerId');
if (offerId == null) {
    offerId = regex.exec(window.location.href)[1]
}

window.location.href = `https://detail.1688.com/offer/${offerId}.html`;