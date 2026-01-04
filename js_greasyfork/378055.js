// ==UserScript==
// @name        Faction Profile Onliners Only
// @namespace   Myhedin
// @include     *.torn.com/factions.php?step=profile&ID=*
// @description:en  Show online faction members only
// @version     1.0.0
// @description Show online faction members only
// @downloadURL https://update.greasyfork.org/scripts/378055/Faction%20Profile%20Onliners%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/378055/Faction%20Profile%20Onliners%20Only.meta.js
// ==/UserScript==

document.querySelectorAll('.member-list > li').forEach(element => {
  if (element.querySelector('#icon2') !== null || element.querySelector('#icon62') !== null) {
    element.style.display = 'none';
  }
});