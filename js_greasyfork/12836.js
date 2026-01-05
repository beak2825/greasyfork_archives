// ==UserScript==
// @name           Dan Gilbert Comic Tweets !
// @namespace      pylbcavsdan
// @description    Dan Gilbert's tweets show up in Comic Sans.
// @include        http*://twitter.com/*/cavsdan*
// @include        http*://twitter.com/cavsdan*
// @grant          GM_addStyle
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/12836/Dan%20Gilbert%20Comic%20Tweets%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/12836/Dan%20Gilbert%20Comic%20Tweets%20%21.meta.js
// ==/UserScript==

GM_addStyle("p.js-tweet-text { font-family: 'Comic Sans MS' !important;}");