
// ==UserScript==
// @name        Google Blue promo Box Remover
// @namespace   1.0
// @description removes the blue promo box 
// @include     https://www.google.com/?noj=1
// @include     https://www.google.*
// @version     1 
// @downloadURL https://update.greasyfork.org/scripts/10130/Google%20Blue%20promo%20Box%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/10130/Google%20Blue%20promo%20Box%20Remover.meta.js
// ==/UserScript==

var child = document.getElementById('pushdown');
child.parentNode.removeChild(child);

/*follow me on twitter exce1l */