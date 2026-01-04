// ==UserScript==
// @name        YouTube Instant Redirect
// @namespace   MegaPiggy
// @match       https://www.youtube.com/redirect*
// @include     https://www.youtube.com/redirect*
// @version     1.0
// @author      MegaPiggy
// @license     MIT
// @description Goes to the link instead of asking you if you want to go there.
// @downloadURL https://update.greasyfork.org/scripts/493418/YouTube%20Instant%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/493418/YouTube%20Instant%20Redirect.meta.js
// ==/UserScript==

window.location.href = document.getElementById("invalid-token-redirect-goto-site-button").href;