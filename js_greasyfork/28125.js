// ==UserScript==
// @name	Undirect + Open external links in new tab
// @description	Removes this tracking and redirection from google search results
// @namespace 	https://greasyfork.org/users/19952-xant1k-bt
// @include	/^https?.\/\/.+google[^\/]*/
// @grant	none
// @run_at	document_end
// @author	Steve Leigh
// @version	1.1.3
// @downloadURL https://update.greasyfork.org/scripts/28125/Undirect%20%2B%20Open%20external%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/28125/Undirect%20%2B%20Open%20external%20links%20in%20new%20tab.meta.js
// ==/UserScript==

(function() {
var googlePagesPattern = /https?.\/\/.+google[^\/]*/gi;
if (!document.location.href.match(googlePagesPattern))
return;

var scriptToExecute = (function() {
var expectedRwt = function() { return true; };

var replaceRwtFunction = function() {
if (window.rwt && window.rwt != expectedRwt) {
delete window.rwt;
Object.defineProperty(window, 'rwt', {
value: expectedRwt,
writable: false
});
}
};

replaceRwtFunction();

var timeoutId = 0;
document.body.addEventListener("DOMNodeInserted", function() {
if (timeoutId) clearTimeout(timeoutId);
timeoutId = setTimeout(replaceRwtFunction, 1000);
}, false);
});

// Write script to page - since plugins often work in an isolated world, this gives us the
// ability to replace javascript added by the page
var fnContents = scriptToExecute.toString();
var executeFnScript = '(' + fnContents + ')();';

var script = document.createElement('script');
script.textContent = executeFnScript;
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
})();
(function() {
var a=0, c=document.getElementsByTagName('a');
for(a; a<c.length; a++) { if (c[a].getAttribute('href') && c[a].hostname !== location.hostname) c[a].target = '_blank'; }
})();