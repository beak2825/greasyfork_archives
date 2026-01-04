// ==UserScript==
// @name Reddit Hide Comment Vote Score Count
// @description	Hides Comment Vote Score Count on reddit.com
// @namespace http://userstyles.org
// @author 636597
// @homepage https://creatitees.info
// @include *://*reddit.com/*
// @run-at document-start
// @version 0.2
// @downloadURL https://update.greasyfork.org/scripts/439710/Reddit%20Hide%20Comment%20Vote%20Score%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/439710/Reddit%20Hide%20Comment%20Vote%20Score%20Count.meta.js
// ==/UserScript==

function add_css() {
	try{
		var styles = `
			span.score { display: none !important; }
		`;
		var styleSheet = document.createElement("style");
		styleSheet.type = "text/css";
		styleSheet.innerText = styles;
		document.head.appendChild(styleSheet);
	}
	catch(e) {
		console.log( e );
	}
}

function init() {
	add_css();
}

window.addEventListener ( "load" , init );
window.addEventListener( "locationchange" , init );