// ==UserScript==
// @name         Blacket Rainbow Background
// @version      1.9
// @description  Rainbow background on main containers, profile containers, and body only, keeps UI elements readable
// @author       monkxy#0001
// @match        https://*.blacket.org/*
// @grant        none
// @namespace https://greasyfork.org/users/1479014
// @downloadURL https://update.greasyfork.org/scripts/538749/Blacket%20Rainbow%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/538749/Blacket%20Rainbow%20Background.meta.js
// ==/UserScript==

(function () {
  const rainbowURL = "https://blacket.org/content/rainbow.webp";

  const rainbowCSS = `
    body, html,
    [class*="styles__background"],
    [class*="styles__app"],
    [class*="styles__container"],
    [class*="styles__modal"],
    [class*="styles__page"],
    [class*="styles__root"],
    [class*="styles__sidebar"],
    [class*="styles__topStatsContainer"],
    [class*="styles__statsContainer"],
    [class*="styles__bottomStatsContainer"],
    [class*="styles__statContainer"],
    #app,

    /* Added to cover both the roomSwitcher and other profile containers */
    #roomSwitcher.styles__profileContainer___CSuIE-camelCase,
    div.styles__profileContainer___CSuIE-camelCase[role="button"][tabindex="0"] {
      background-image: url('${rainbowURL}') !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
      background-position: center center !important;
      background-attachment: fixed !important;
      background-color: black !important;
      color: white !important;
    }

    /* UI elements get solid backgrounds to remain readable */
    textarea, input, select, button {
      background-image: none !important;
      background-color: rgba(0,0,0,0.85) !important;
      color: white !important;
      border-color: white !important;
    }
  `;

  const style = document.createElement("style");
  style.id = "blacket-rainbow-bg-profile-containers";
  style.textContent = rainbowCSS;
  document.head.appendChild(style);
})();
