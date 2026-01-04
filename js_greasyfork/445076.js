// ==UserScript==
	// @name        pink asethetic theme
	// @namespace    https://jstristhememaker.com
	// @version      0.1
	// @description  script generated at https://jstristhememaker.com
	// @author       Jstris Theme Maker
	// @match        https://jstris.jezevec10.com/*
	// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
	// @grant        none
        // @license sail0r
// @downloadURL https://update.greasyfork.org/scripts/445076/pink%20asethetic%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/445076/pink%20asethetic%20theme.meta.js
	// ==/UserScript==
	(function() {
			'use strict';
			const styleTag = document.createElement("style");
			styleTag.innerText = ".nav>li>a{color:#fff4ff !important;}nav{background-color:#d7b4e5 !important;}.notification-count{background-color:#612378;color:#f5deff;}.dropdown-menu{background-color:#3b2741;}.dropdown.open>a{background-color:#ad64c7;} #app{background-color:#000000;}   #statLabels>span{font-size:16px;color:#d7b4e5;}#glstats{filter: brightness(0.5) sepia(1) hue-rotate(244deg) saturate(7550%) brightness(120);}#main > div:nth-child(4){position:relative;}#gstats{position: absolute;left: -220px;bottom:46px;}";
			let head = document.querySelector("head");
			head.appendChild(styleTag);
			
	})();