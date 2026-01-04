/* eslint-disable no-multi-spaces */
/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               download corner pop black-red theme
// @namespace          MFM3Code
// @version            0.1.2
// @description        black-red theme for download corner pop
// @author             PY-DNG
// @license            GPL-v3
// @match              NONE
// @grant              none
// ==/UserScript==

(function __MAIN__() {
	document.readyState === 'complete' ? applyStyle() : document.addEventListener('DOMContentLoaded', applyStyle);
	function applyStyle() {
		const style = document.createElement('style');
		style.innerHTML = '.with-play-bar #pop-container{bottom:100px }[class*=pop-] .progress{background:#99a3ba;}[class*=pop-] .icon {fill:#99a3ba;}.pop-info{background:#333;}.pop-info .text span{color:#fff;}.pop-info .icon svg{fill:#fff;}.pop-download{background:#333;}.pop-download .percent{background:#222;}.pop-download .percent span::after,.pop-download .percent span::before{background:red;}.pop-download .percent svg{color:red;}.pop-download.finished .percent{background:#333;}.pop-download .text strong{color:#fff;}.pop-download .text>div small{color:#99a3ba;}.pop-download .text>div div::before{background:#99a3ba;}';
		document.head.appendChild(style);
	}
})();