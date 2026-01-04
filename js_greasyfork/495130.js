// ==UserScript==
// @name        Remove Reddit select text embed button 
// @namespace   english
// @description    Remove Reddit select text embed button - new look reddit 
// @include     http*://*reddit.com*
// @version     1.1
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495130/Remove%20Reddit%20select%20text%20embed%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/495130/Remove%20Reddit%20select%20text%20embed%20button.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media

 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '     embed-snippet-share-button{display:none ;}     ';
document.getElementsByTagName('head')[0].appendChild(style);

 





