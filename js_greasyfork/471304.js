// ==UserScript==
// @name        kbin.social make upvote blue (down is red) for colorblind accessibility 
// @namespace   english
// @description  kbin.social make upvote blue (down is red) - for colorblind accessibility 

// @version     1.2
// @run-at document-end

// @license MIT
// @grant       GM_addStyle
// @include     http*://*kbin.social*
// @downloadURL https://update.greasyfork.org/scripts/471304/kbinsocial%20make%20upvote%20blue%20%28down%20is%20red%29%20for%20colorblind%20accessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/471304/kbinsocial%20make%20upvote%20blue%20%28down%20is%20red%29%20for%20colorblind%20accessibility.meta.js
// ==/UserScript==
 
 
 
//css color edit 
 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =   '       html .vote .active.vote__up button {  color: #1b6aff  !important ;}        ' ;
 
document.getElementsByTagName('head')[0].appendChild(style);
 
 

 
  