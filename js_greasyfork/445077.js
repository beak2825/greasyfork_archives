// ==UserScript==
	// @name         black jstris theme
	// @namespace    https://jstristhememaker.com
	// @version      0.1
	// @description  script generated at https://jstristhememaker.com
	// @author       Jstris Theme Maker
	// @match        https://jstris.jezevec10.com/*
	// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
	// @grant        none
       // @license sail0r
// @downloadURL https://update.greasyfork.org/scripts/445077/black%20jstris%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/445077/black%20jstris%20theme.meta.js
	// ==/UserScript==
	(function() {
			'use strict';
			const styleTag = document.createElement("style");
			styleTag.innerText = "nav{background-color:#000000 !important;}  #sprintText{font-size:0px;}#lrem{font-size:40px;}  #glstats{filter: brightness(0.5) sepia(1) hue-rotate(0deg) saturate(0%) brightness(100);} .chl.srv{color:#000000 !important;}.chl{color:#000000;}#chatContent{background-color:#000000;}#sendMsg{color:#000000!important;background-color:#000000;}#chatInput{background-color:#000000;color:#000000!important;}";
			let head = document.querySelector("head");
			head.appendChild(styleTag);
			
	})();