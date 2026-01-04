// ==UserScript==
// @name         Hides Logo coub.com
// @namespace    http://coub.com/
// @version      0.2
// @description  Hides the logo in fullscreen mode.
// @author       for.ever
// @match        *://coub.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529199/Hides%20Logo%20coubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/529199/Hides%20Logo%20coubcom.meta.js
// ==/UserScript==

function Logo_hide()
{
  const elements = document.getElementsByClassName("viewer__fullscreen-logo -hidden");
  if (elements.length > 0) {
    Array.from(elements).forEach((element) => element.remove());
  }
};
setInterval(Logo_hide, 6000);
