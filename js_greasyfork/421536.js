// ==UserScript==
// @name         Criticker Probable Score Hider
// @version      0.1.0
// @description  Hides the probable score so that users can rate movies without it influencing their rating.
// @author       sv
// @match        https://*.criticker.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/421536/Criticker%20Probable%20Score%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/421536/Criticker%20Probable%20Score%20Hider.meta.js
// ==/UserScript==

[...document.getElementsByClassName("psi_container")].forEach((a) => {
  let elem = [...a.children].find((c) => /^psi_div/.test(c.id));
  let elem2 = [...a.children].find((c) => /^psi_quip/.test(c.id));
  if (elem) elem.children[0].innerText = "??";
  if (elem2) elem2.remove();
});

