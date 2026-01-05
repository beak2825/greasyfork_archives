// ==UserScript==
// @name			docsReady
// @namespace		xuyiming.open@outlook.com
// @description		A JavaScript to run script when docs is ready
// @author			xymopen
// @version			1.0.1
// @grant			none
// @license			BSD 2-Clause
// @homepageURL		https://github.com/xymopen/JS_Misc/blob/master/docsReady.js
// @updateURL		https://raw.githubusercontent.com/xymopen/JS_Misc/master/docsReady.js
// ==/UserScript==

function domReady( onReady, contextWindow ) {
	var excuted = false;

	function onDelayedReady( event ) {
		if ( !excuted ) {
			excuted = true;
			onReady( event );
		}
	}

	if ( !contextWindow ) {
		contextWindow = window;
	}

	if ( "interactive" == contextWindow.document.readyState ) {
		onReady();
	} else {
		contextWindow.document.addEventListener( "DOMContentLoaded", onDelayedReady );
	}

	// In case DOMContentLoaded was not supported or not emitted or missed
	allReady( onDelayedReady, contextWindow );
}

function allReady( onReady, contextWindow ) {
	if ( !contextWindow ) {
		contextWindow = window;
	}

	if ( "complete" == contextWindow.document.readyState ) {
		onReady();
	} else {
		contextWindow.addEventListener( "load", onReady );
	}
}

function frameReady( onReady, contextFrame ) {
	if ( "complete" == contextFrame.contentDocument.readyState ) {
		onReady();
	}

	contextFrame.addEventListener( "load", onReady );
}
