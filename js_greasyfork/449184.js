// ==UserScript==
// @name          Reddit Hide Moderator Comments
// @namespace     http://userstyles.org
// @description   Hides Reddit Moderator Comments
// @author        636597
// @include       *://*reddit.com/*
// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/449184/Reddit%20Hide%20Moderator%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/449184/Reddit%20Hide%20Moderator%20Comments.meta.js
// ==/UserScript==

function add_css() {
    try{
        var styles = `
            div.locked.comment { display: none !important; }
        `;
        var styleSheet = document.createElement( "style" );
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild( styleSheet );
    }
    catch(e) {
        console.log( e );
    }
}

function init() {
	console.log( "Loading Reddit Moderator Comment Hider" );
    add_css();
}

( function() {
	//window.addEventListener ( "load" , init );
    init();
})();