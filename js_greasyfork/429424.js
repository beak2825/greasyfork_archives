// ==UserScript==
// @name        Untruncate title - odysee.com
// @namespace   Violentmonkey Scripts
// @match       https://odysee.com/*
// @grant       none
// @version     0.0.2
// @author      diehardzg
// @description Untruncates odysee video titles
// @downloadURL https://update.greasyfork.org/scripts/429424/Untruncate%20title%20-%20odyseecom.user.js
// @updateURL https://update.greasyfork.org/scripts/429424/Untruncate%20title%20-%20odyseecom.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.innerHTML=`
  .claim-tile__title .truncated-text {
    display: block !important;
  }

  .claim-preview__title .truncated-text
  {
    display: block !important;
  }
`;
document.head.appendChild(css);