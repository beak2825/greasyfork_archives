// ==UserScript==
// @name ATG.se - Remove sidemenu by default.
// @namespace Violentmonkey Scripts
// @match https://www.atg.se/
// @include https://www.atg.se*
// @grant none
// @desription Hides the side menu on ATG.se
// @description:sv Döljer vänstermenyn på ATG.se
// @version 0.0.1.20191113095906
// @description Döljer vänstermenyn på ATG.se
// @downloadURL https://update.greasyfork.org/scripts/392359/ATGse%20-%20Remove%20sidemenu%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/392359/ATGse%20-%20Remove%20sidemenu%20by%20default.meta.js
// ==/UserScript==

_globalStore.dispatch({type: "mainMenu/CLOSE_SIDE_MENU"});
_globalStore.getState().mainMenu.sticky = false;