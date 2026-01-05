// ==UserScript==
// @name        Furvilla - Shrink Forum Signatures
// @namespace   Shaun Dreclin
// @description Forum signatures taller than 100px will be confined to a scrolling div.
// @include     /^https?://www\.furvilla\.com/forums/thread/.*$/
// @version     1.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21733/Furvilla%20-%20Shrink%20Forum%20Signatures.user.js
// @updateURL https://update.greasyfork.org/scripts/21733/Furvilla%20-%20Shrink%20Forum%20Signatures.meta.js
// ==/UserScript==

GM_addStyle(".thread-user-post-bottom { max-height: 100px; overflow-y: auto; }");
