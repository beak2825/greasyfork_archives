// ==UserScript==
// @name         Auto-select WoW Classic
// @description  Auto-select the "WoW Classic" filter option on Curseforge's WoW addon section
// @version      0.1
// @author       Phase
// @match        https://www.curseforge.com/wow/addons
// @grant        none
// @namespace    phase
// @downloadURL https://update.greasyfork.org/scripts/395420/Auto-select%20WoW%20Classic.user.js
// @updateURL https://update.greasyfork.org/scripts/395420/Auto-select%20WoW%20Classic.meta.js
// ==/UserScript==

$("#filter-game-version option:contains(WoW Classic)").attr('selected', 'selected');