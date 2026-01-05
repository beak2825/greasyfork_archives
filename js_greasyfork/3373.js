// ==UserScript==
// @name        Remove all stuff from Google+ except Hangouts
// @namespace   http://userscripts.org/users/gentakojima
// @description Remove all stuff from Google+ except Hangouts. Also hides contact list hover divs.
// @include     https://plus.google.com/
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3373/Remove%20all%20stuff%20from%20Google%2B%20except%20Hangouts.user.js
// @updateURL https://update.greasyfork.org/scripts/3373/Remove%20all%20stuff%20from%20Google%2B%20except%20Hangouts.meta.js
// ==/UserScript==

function addNewStyle(newStyle) {
   var styleElement = document.getElementById('styles_js');
   if (!styleElement) {
       styleElement = document.createElement('style');
       styleElement.type = 'text/css';
       styleElement.id = 'styles_js';
       document.getElementsByTagName('head')[0].appendChild(styleElement);
   }
   styleElement.appendChild(document.createTextNode(newStyle));
}

var hide_everything = function(){
    addNewStyle(".VW,.SOb,.Zi,.K8tFub{display:none !important;}");
};
hide_everything();

var hide_hovers = function(){
    addNewStyle(".o-ms-fk{display:none !important;}")
}
hide_hovers();