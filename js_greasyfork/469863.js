// ==UserScript==
// @name        Codegrade full screen - inholland.nl
// @namespace   Violentmonkey Scripts
// @match       https://moodle.inholland.nl/mod/lti/view.php
// @grant       none
// @version     1.1
// @author      -
// @description 6/30/2023, 3:47:35 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469863/Codegrade%20full%20screen%20-%20inhollandnl.user.js
// @updateURL https://update.greasyfork.org/scripts/469863/Codegrade%20full%20screen%20-%20inhollandnl.meta.js
// ==/UserScript==
let frame = document.querySelector("iframe#contentframe");

if (frame.allow.includes("inholland.codegra.de")) {
  const button = document.createElement("button");
  button.textContent = "open full page";
  button.onclick = () => {
    window.open(frame.src);
  };

  document.querySelector("h2").parentElement.append(button);
}