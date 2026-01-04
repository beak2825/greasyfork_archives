// ==UserScript==
// @name        Remove Reddit Logo and Favicon 
// @namespace   english
// @description Remove Reddit Logo and Favicon 2
// @include     http*://*reddit.com*
// @version     1.2
// @run-at document-end
// @grant       GM_addStyle 
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466378/Remove%20Reddit%20Logo%20and%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/466378/Remove%20Reddit%20Logo%20and%20Favicon.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media

 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '          ._30BbATRhFv3V83DHNDjJAO svg {display:none;}          ';
document.getElementsByTagName('head')[0].appendChild(style);

 
var favicon_link_html = document.createElement('link');
favicon_link_html.rel = 'icon';
favicon_link_html.href = 'https://pushka.com/favicon.ico';
favicon_link_html.type = 'image/x-icon';

try { 
  document.getElementsByTagName('head')[0].appendChild( favicon_link_html ); 
}
catch(e) { }



