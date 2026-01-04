// ==UserScript==
// @name          Hides The Usernames and Puzzle ID on lichess.org/training
// @namespace     http://userstyles.org
// @description   Hides Usernames, Puzzle ID
// @author        636597
// @include       *://*lichess.org/training*

// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/419469/Hides%20The%20Usernames%20and%20Puzzle%20ID%20on%20lichessorgtraining.user.js
// @updateURL https://update.greasyfork.org/scripts/419469/Hides%20The%20Usernames%20and%20Puzzle%20ID%20on%20lichessorgtraining.meta.js
// ==/UserScript==


function hide_puzzle_info() {
	try{
		var styles = `
			a[href^="/training/"]  { visibility: hidden !important; }
            a[href^="/@/"]  { visibility: hidden !important; }
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

window.addEventListener ( "load" , hide_puzzle_info );