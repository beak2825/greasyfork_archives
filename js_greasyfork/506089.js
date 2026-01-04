// ==UserScript==
// @name         IP Dounford Scripts Styles
// @version      1.0.3
// @description  Centralize IP Dounford Styles
// @author       Dounford
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	function isNewerVersion () {
		const oldParts = document.getElementById('dounfordStyles').getAttribute('version').split('.')
		const newParts = GM_info.script.version.split('.')
		for (let i = 0; i < newParts.length; i++) {
			const a = ~~newParts[i]
			const b = ~~oldParts[i]
			if (a > b) return true
			if (a < b) return false
		}
		return false
	}

	(function addStyles() {
		let style = document.createElement('style');
		style.id = "dounfordStyles"
		style.setAttribute('version', GM_info.script.version)
		const styleHTML = `
		/* Hover */
		.dounfordHover:hover {
			cursor: pointer;
    		background-color: rgb(225 225 225);
		}
		/* Modal Style */
		dialog::backdrop {
			background-color: rgba(0, 0, 0, 0.855);
		}
		.dounfordModal {
			padding: 0;
			width: 600px;
			background-color: #e5e5e5;
			border-radius: 0.5rem;
			overflow: visible;
		}
		.dounfordModal label {
			margin-left: 5px;
		}
		.dounfordModalHeader {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 1rem;
			border-bottom: 1px solid #ccc;
		}
		.dounfordModalBody {
			padding: 1rem;
			text-align: center;
		}
		.dounfordModalFooter {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0.75rem;
			border-top: 1px solid #ccc;
		}
		.dounfordModalFooter > * {
			margin: 0.25rem;
		}
		
		/* Blocked User Modal */
		.blockedUser {
			display: flex;
			justify-content: space-between;
			padding: 10px;
			border-radius: 10px;
			font-weight: bold;
			align-items: center;
		}

		.blockedUser:hover {
			background-color: aliceblue;
		}
			
		/* Tooltips*/
		[dounfordTooltip] {
			position: relative;
			border-bottom: 1px dashed #000;
		}

		[dounfordTooltip]::after {
			position: absolute;
			z-index: 10;
			opacity: 0;
			pointer-events: none;
			content: attr(dounfordTooltip);
			left: 0;
			top: calc(100% + 10px);
			border-radius: 3px;
			box-shadow: 0 0 5px 2px rgba(100, 100, 100, 0.6);
			background-color: black;
			color: white;
			padding: 5px;
			width: 200px;
		}

		[dounfordTooltip]:hover::after {
			opacity: 1;
		}
			
		/* PVP Tab */
		.dounfordPVPGrid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto auto;
		    color: white;
			max-height: 1223px;
			text-align:center;
		}
		.dounfordPVPTitles {
			color: black;
			display: inline-block;
			padding: 10px;
			border: 2px solid gold;
			background-color: white;
			border-radius: 5px;
			margin: 5px;
			font-size: 1.2rem;
		}
		.dounfordPVPTitles {
			display: inline-flex;
			align-items: center;
			gap: 5px;
			border: 2px solid gold;
			border-radius: 5px;
			padding: 10px;
			font-size: 1.2rem;
			background-color: white;
			color: black;
		}
		`;

		if (document.getElementById('dounfordStyles')) {
			if (!isNewerVersion()) return
			document.getElementById('dounfordStyles').innerHTML = styleHTML
			document.getElementById('dounfordStyles').setAttribute('version', GM_info.script.version)
		} else {
			style.innerHTML = styleHTML
			document.head.appendChild(style);
		}	
	})()
})()