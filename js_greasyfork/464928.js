// ==UserScript==
// @name        AWS Dark Mode
// @version     0.1.0
// @grant       none
// @author      mindovermiles262
// @namespace   com.gitlhub.mindovermiles262
// @license     MIT
// @description Dark Mode for AWS
// @match       https://*.console.aws.amazon.com/*
// @downloadURL https://update.greasyfork.org/scripts/464928/AWS%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/464928/AWS%20Dark%20Mode.meta.js
// ==/UserScript==

function expires(days=30) {
  daysValidMs = days * 24 * 60 * 60 * 1000;
  return new Date(new Date().getTime() + daysValidMs).toUTCString();
}

document.cookie = `awsc-color-theme=dark; expires=${expires()}; Domain=.amazon.com; Secure=false; Path=/`
