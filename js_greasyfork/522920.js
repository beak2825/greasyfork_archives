// ==UserScript==
// @name:nl  npo start bezochte links
// @name     npo start visited links
// @version  1
// @include  https://npo.nl/*
// @grant    none
// @run-at   document-end   
// @namespace refractor.dev 
// @description add a bit of css so visited links turn dark green (easy to customize). Both show links and episodes work.
// @description:nl Maakt bezochte links groen zodat je makkelijk kan zien wat je al bekeken hebt. Werkt voor series, maar ook voor afleveringen.
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522920/npo%20start%20visited%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/522920/npo%20start%20visited%20links.meta.js
// ==/UserScript==


ss = `
a:visited h3{
	color:darkgreen !important;
}
`


var styleSheet = document.createElement("style")
styleSheet.textContent = ss
document.head.appendChild(styleSheet)