// ==UserScript==
// @name		TILT -45° Prank
// @name:fr		INCLINAISON -45° Farce
// @namespace		VElMVCAtNDXCsCBQcmFuaw
// @description		Funny prank to tilt websites -45°
// @description:fr	Blague drôle pour incliner les sites Web de -45°
// @author		smed79
// @version		1.0
// @icon		https://i25.servimg.com/u/f25/11/94/21/24/tilt4510.png
// @twitterURL		https://github.com/smed79
// @run-at		document-start
// @include		http://*
// @include		https://*
// @grant		GM_addStyle
// @license		GPLv3
// @downloadURL https://update.greasyfork.org/scripts/453394/TILT%20-45%C2%B0%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/453394/TILT%20-45%C2%B0%20Prank.meta.js
// ==/UserScript==

GM_addStyle ( "				\
  html {				\
  transform: rotate(-45deg);		\
  -webkit-transform: rotate(-45deg);	\
  -moz-transform: rotate(-45);	\
  -ms-transform: rotate(-45deg);	\
  -o-transform: rotate(-45deg);		\
       }				\
 " );
