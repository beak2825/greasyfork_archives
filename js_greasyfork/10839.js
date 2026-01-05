// ==UserScript==
// @name        The Latest Version of Google
// @description   Enable Google New Style in China
// @include     *://www.google.*/
// @include     *://www.google.*/search?* 
// @include     *://www.google.*/webhp*
// @include     *://www.google.*/preferences*
// @include     *://www.google.*/advanced_search*
// @exclude    *://www.google.*/search?*&tbm=*
// @exclude    *://www.google.*/*/*
// @version     1.1
// @grant       none
// @run-at      document-start
// @namespace https://greasyfork.org/users/12941
// @downloadURL https://update.greasyfork.org/scripts/10839/The%20Latest%20Version%20of%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/10839/The%20Latest%20Version%20of%20Google.meta.js
// ==/UserScript==

;(function(href,arg){
    (href.indexOf(arg) !== -1) || 
    (location.href = href + ((href.indexOf("?") === -1 ? "?" : "&") + arg))
})(location.href,"sclient=psy-ab");