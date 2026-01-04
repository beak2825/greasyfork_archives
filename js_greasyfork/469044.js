// ==UserScript==
// @name        Bible Gateway dark theme 
// @namespace   english
// @description  Bible Gateway dark theme  night mode 
// @include     http*://*biblegateway.com* 
// @version     1.2
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469044/Bible%20Gateway%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/469044/Bible%20Gateway%20dark%20theme.meta.js
// ==/UserScript==


// Main - redirect test 

//css color for added text - dark and light modes 

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =   '      .page-col{filter: invert(1)hue-rotate(180deg);} .sys-announce{display:none  !important ;}    ' ;

document.getElementsByTagName('head')[0].appendChild(style);

 

  