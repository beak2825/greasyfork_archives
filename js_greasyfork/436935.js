// ==UserScript==
// @name        AWS - Lazy Ass Dark Mode
// @namespace   Violentmonkey Scripts
// @match       https://*.console.aws.amazon.com/*
// @grant       none
// @version     1.1
// @author      dutzi
// @license     MIT
// @description 12/12/2021, 12:43:21 AM
// @downloadURL https://update.greasyfork.org/scripts/436935/AWS%20-%20Lazy%20Ass%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/436935/AWS%20-%20Lazy%20Ass%20Dark%20Mode.meta.js
// ==/UserScript==

document.body.style.filter = 'invert(1) contrast(0.8)';
document.querySelector('#f').style.filter = 'invert(1) contrast(0.8)';
document.querySelector('#h').style.filter = 'invert(1) contrast(0.8)';