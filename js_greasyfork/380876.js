// ==UserScript==
// @name         Remove Right Panel for games of FB
// @description  to remove sidebar
// @version      1.0
// @author       Enzo
// @namespace    The Household Love
// @match        https://apps.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380876/Remove%20Right%20Panel%20for%20games%20of%20FB.user.js
// @updateURL https://update.greasyfork.org/scripts/380876/Remove%20Right%20Panel%20for%20games%20of%20FB.meta.js
// ==/UserScript==

document.getElementById('rightCol').remove();
document.getElementById('bannerBelowGameContainer').remove();