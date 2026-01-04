// ==UserScript==
// @name Replace overscroll on spiegel.de
// @description Entfernt das Overscrolling ("zur Startseite") am Ende eines Artikel auf spiegel.de
// @grant GM_addStyle
// @include http://www.spiegel.de/*
// @version 0.0.1.20171122082738
// @namespace https://greasyfork.org/users/67252
// @downloadURL https://update.greasyfork.org/scripts/35543/Replace%20overscroll%20on%20spiegelde.user.js
// @updateURL https://update.greasyfork.org/scripts/35543/Replace%20overscroll%20on%20spiegelde.meta.js
// ==/UserScript==

// Ersetzt 'function spPageOverscroll()' in 'http://www.spiegel.de/layout/js/http/javascript-V8-33.js' durch eine gleichnamige Leerfunktion 
// Wichtig: Im Gegensatz zu anderen Benutzerscripten darf nicht '// @run-at document-start' angegeben werden.
// Basiert auf http://www.squakmt.com/replacing_javascript/

var scriptCode = new Array();   // this is where we are going to build our new script

// here's the build of the new script, one line at a time
scriptCode.push('function spPageOverscroll(){'      );
scriptCode.push('}'                                 );

// now, we put the script in a new script element in the DOM
var script = document.createElement('script');    // create the script element
script.innerHTML = scriptCode.join('\n');         // add the script code to it
scriptCode.length = 0;                            // recover the memory we used to build the script

// this is sort of hard to read, because it's doing 2 things:
// 1. finds the first <head> tag on the page
// 2. adds the new script just before the </head> tag
document.getElementsByTagName('head')[0].appendChild(script);  