// ==UserScript==
// @name         Allow MIDI in work iframes
// @namespace    salembeats
// @version      1
// @description  .
// @author       Cuyler Stuwe (salembeats)
// @include      https://worker.mturk.com/projects/3*/tasks/*?assignment_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38334/Allow%20MIDI%20in%20work%20iframes.user.js
// @updateURL https://update.greasyfork.org/scripts/38334/Allow%20MIDI%20in%20work%20iframes.meta.js
// ==/UserScript==

document.querySelectorAll("iframe").forEach(iFrame => {
	iFrame.setAttribute("allow", "midi");
});