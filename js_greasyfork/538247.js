// ==UserScript==
// @name			Internet Roadtrip - Marquee Radio Name
// @description		Makes the radio name Marquee
// @namespace		Alib234.IRMRN
// @version			1.0.1.2
// @author			Alib234
// @license			GPL3
// @match			https://neal.fun/internet-roadtrip/*
// @downloadURL https://update.greasyfork.org/scripts/538247/Internet%20Roadtrip%20-%20Marquee%20Radio%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/538247/Internet%20Roadtrip%20-%20Marquee%20Radio%20Name.meta.js
// ==/UserScript==
(()=>
{
	const s=document.createElement('style');
	s.textContent=`.station-info[data-v-7771b499],.station-name[data-v-7771b499]{font-family:monospace;max-width:inherit;overflow:visible;text-overflow:visible;white-space:nowrap}`;
	document.head.appendChild(s);
	document.getElementsByClassName("station-name")[0].outerHTML='<marquee><div class="station-name"data-v-7771b499=""></div></marquee>';
})();
