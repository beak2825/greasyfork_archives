// ==UserScript==
// @name        seamonkey and palemoon fullscreen no navbar
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description read the title
// @author      BZZZZ
// @include     *
// @version     0.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/426271/seamonkey%20and%20palemoon%20fullscreen%20no%20navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/426271/seamonkey%20and%20palemoon%20fullscreen%20no%20navbar.meta.js
// ==/UserScript==

(function(){
var a=document.createElementNS("http://www.w3.org/1999/xhtml","div");
a.setAttribute("onclick","document.documentElement.addEventListener('keypress',new Function('ev','if(ev.key==\"F11\"){ev.preventDefault();if(document.mozFullScreen)document.mozCancelFullScreen();else document.documentElement.mozRequestFullScreen();}'),false)");
a.click();
})();
