// ==UserScript==
// @name         Roblox Light Font (For my Boi Jack)
// @namespace    Font
// @version      1.81
// @description  reverts the terrible bold font.
// @author       You
// @match        https://web.roblox.com/*
// @grant        none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/398390/Roblox%20Light%20Font%20%28For%20my%20Boi%20Jack%29.user.js
// @updateURL https://update.greasyfork.org/scripts/398390/Roblox%20Light%20Font%20%28For%20my%20Boi%20Jack%29.meta.js
// ==/UserScript==

(function() {
    'use strict';



    var link = document.createElement("link"); //font is missing on some systems, so we have to make sure it exists
    link.href = "https://fonts.googleapis.com/css?family=Source+Sans+Pro:100,200,300,400,500,600,700,800,900";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

	// below from: https://stackoverflow.com/questions/39346747/tampermonkey-script-run-before-page-load

    new MutationObserver(function(mutations) { //create mutation observer that will observe page changes as the page loads
        if (document.getElementsByClassName('gotham-font')[0]) { //check if any element with "gotham-font" class has been inserted
			var gothamFontElements = document.getElementsByClassName("gotham-font"); //get all elements with the "gotham-font" class
            var gothamFontArray = Array.from(gothamFontElements) //create an array from that so we can run .forEach
			gothamFontArray.forEach(function(a){ //run the function for each element with the "gotham-font" class
				a.className = a.className.replace("gotham-font", ""); //set its className to its className without gotham-font (replace gotham-font with just blank)
			});
        }
    }).observe(document, {childList: true, subtree: true}); //observe page changes as the page loads. this stops the ugly ass font from appearing for a split second and stops it from appearing altogether


    // in Sept 2019 HCo Gotham SSm was added as the primary font-family in body and headers. this reverts that change
    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = `
h1, h2, h3, h4, h5, body, pre {
	font-family: Source Sans Pro,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif !important;
}
`
    document.head.appendChild(styleSheet)


})();