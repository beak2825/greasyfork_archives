// ==UserScript==
// @name        outlook microsoft 365 hide select text popup box 
// @namespace   english
// @description      outlook microsoft 365 hide select txt popup box 
// @include     http*://*office365.com*
// @version     1.11
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495132/outlook%20microsoft%20365%20hide%20select%20text%20popup%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/495132/outlook%20microsoft%20365%20hide%20select%20text%20popup%20box.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media

 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '     .ms-Layer-content     .ms-Callout-container     .css-93  .root-165       {display:none  !important  ;}          ';
document.getElementsByTagName('head')[0].appendChild(style);

 
//.ms-Callout .css-93   -no  .root-428 
//text select
//ms-Callout root-415 css-93
//
//right click email
//ms-Callout ms-ContextualMenu-Callout root-502 css-96

//ms-Callout-main calloutMain-411
//ms-TooltipHost root-165







