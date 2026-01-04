// ==UserScript==
// @name        Hide blue checks on twitter
// @match       https://twitter.com/*
// @version     1.0
// @description Hide blue checks on twitter.com
// @namespace   Violentmonkey Scripts
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474289/Hide%20blue%20checks%20on%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/474289/Hide%20blue%20checks%20on%20twitter.meta.js
// ==/UserScript==

setInterval(function hideBlueChecks() {
  const blueCheckIcons = document.querySelectorAll(
    'svg[data-testid="icon-verified"]'
  );
  blueCheckIcons.forEach((icon) => {
    icon.style.display = "none";
  });
}, 25);