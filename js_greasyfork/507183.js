// ==UserScript==
// @name         Less Busy Volunteer UI
// @version      2024-09-06
// @description  Opens all acts and hides locked shifts
// @match        *://*.neopets.com/hospital/volunteer.phtml
// @icon         https://asylumaccess.org/wp-content/uploads/2020/11/Volunteer-Icon.png
// @grant        none
// @namespace https://greasyfork.org/users/1354738
// @downloadURL https://update.greasyfork.org/scripts/507183/Less%20Busy%20Volunteer%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/507183/Less%20Busy%20Volunteer%20UI.meta.js
// ==/UserScript==

var $ = window.jQuery;

const minimizedActButtons = document.querySelectorAll(".vc-act.minimize .vc-pane-btn");
if (minimizedActButtons) {
    [...minimizedActButtons].forEach(button => button.click());
}

document.head.appendChild(document.createElement("style")).innerHTML = `
  .maximize .vc-fights {
    height: auto !important;
  }

  .vc-fight.locked {
    height: 0 !important;
    opacity: 0;
  }
`
