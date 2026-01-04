// ==UserScript==
// @name        MunchMonitor: Choose 1st Break by Default
// @description Choose the 1st Break tab by default when making tuckshop/canteen orders
// @namespace   https://github.com/insin/greasemonkey/
// @include     https://www.munchmonitor.com/Canteen/OrderDetail/*
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/41080/MunchMonitor%3A%20Choose%201st%20Break%20by%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/41080/MunchMonitor%3A%20Choose%201st%20Break%20by%20Default.meta.js
// ==/UserScript==
document.querySelector('#mp1 > a:nth-child(1)').click()