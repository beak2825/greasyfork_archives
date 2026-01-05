// ==UserScript==
// @name        Remove noscript mask on ebay
// @namespace   systemreboot.net
// @description Sets display property of noscript to none
// @include     http://www.ebay.*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22749/Remove%20noscript%20mask%20on%20ebay.user.js
// @updateURL https://update.greasyfork.org/scripts/22749/Remove%20noscript%20mask%20on%20ebay.meta.js
// ==/UserScript==

// This work is in the public domain.

// It was completed by Arun I in 2016.

// Though you are not legally obliged to do so, I would appreciate it
// if you credit me for this work by not removing this notice, and
// hopefully linking to this project at
// https://git.systemreboot.net/remove-noscript-mask-on-ebay/about/

var style = document.createElement("style");
style.innerHTML = ".nojs-msk, .nojs-msg { display: none; }";
document.body.appendChild(style);
