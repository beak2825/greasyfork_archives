// ==UserScript==
// @name        reddit hide logo and images
// @namespace   english
// @description reddit hide logo and images private
// @include     http*://*reddit.com*
// @include     http*://*facebook.com*
// @include     http*://*messenger.com*
// @version     1.15
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376935/reddit%20hide%20logo%20and%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/376935/reddit%20hide%20logo%20and%20images.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header





var link = window.document.createElement('link');
link.rel = 'shortcut icon';
link.type = 'image/ico';
link.href = 'https://jtbtravel.com.au/wp-content/uploads/pdf/2018/globe.ico';
document.getElementsByTagName("HEAD")[0].appendChild(link);

var link2 = window.document.createElement('link');
link2.rel = 'icon';
link2.type = 'image/ico';
link2.href = 'https://jtbtravel.com.au/wp-content/uploads/pdf/2018/globe.ico';
document.getElementsByTagName("HEAD")[0].appendChild(link2);



var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '         ._30BbATRhFv3V83DHNDjJAO svg, .eEoYxe img{display:none} img{max-width:30px;height:auto;}  .jERuKu,.wrWgB {background-image:none !important ;}        ';

document.getElementsByTagName('head')[0].appendChild(style);



