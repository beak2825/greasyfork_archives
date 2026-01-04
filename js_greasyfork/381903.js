// ==UserScript==
// @name        jtb-report-dark
// @namespace   english
// @description jtb-report-dark2
// @include     http*://*jtbtravel.com.au/report* 
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381903/jtb-report-dark.user.js
// @updateURL https://update.greasyfork.org/scripts/381903/jtb-report-dark.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header


var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '    html{    filter: invert(100%)hue-rotate(180deg) !important ; background:initial !important ;background-color: #2d2d2d !important;    }  html body  background:none!important ;background-color: none !important    }  ';

document.getElementsByTagName('head')[0].appendChild(style);



