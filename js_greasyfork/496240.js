// ==UserScript==
// @name         [GC] - Solitaire Enhancements
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @match        https://www.grundos.cafe/games/sakhmet_solitaire/
// @match        https://www.grundos.cafe/games/pyramids/
// @version      86
// @license      MIT
// @author       Cupkait
// @icon         https://i.imgur.com/4Hm2e6z.png
// @description  See your win rate as a percentage, and prevent accidentally double-clicking and drawing two cards.
// @downloadURL https://update.greasyfork.org/scripts/496240/%5BGC%5D%20-%20Solitaire%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/496240/%5BGC%5D%20-%20Solitaire%20Enhancements.meta.js
// ==/UserScript==


if (!localStorage.getItem('scriptAlert-496240')) {
    alert("The Solitaire Enhancements script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-496240', 'true');
}