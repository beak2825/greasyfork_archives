// ==UserScript==
// @name        Number of Trophies
// @namespace   Violentmonkey Scripts
// @match       https://www.strava.com/athletes/*/trophy-case
// @grant       none
// @version     1.0
// @author      lordejim
// @license     MIT
// @description 7/26/2023, 12:10:53 PM
// @downloadURL https://update.greasyfork.org/scripts/471756/Number%20of%20Trophies.user.js
// @updateURL https://update.greasyfork.org/scripts/471756/Number%20of%20Trophies.meta.js
// ==/UserScript==

// Title element
const title = document.querySelector('#trophy-case > h2');

// Find all trophies
const trophies = document.querySelectorAll('#trophy-case .list-trophies > li');

// Add total
title.innerHTML += ` (${trophies.length})`;
