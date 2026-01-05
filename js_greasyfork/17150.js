// ==UserScript==
// @name        kloth-dig-any
// @namespace   hypermedia
// @include     http://www.kloth.net/services/dig.php
// @description get all info from DNS, auto select ANY
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17150/kloth-dig-any.user.js
// @updateURL https://update.greasyfork.org/scripts/17150/kloth-dig-any.meta.js
// ==/UserScript==

document.getElementsByName("q")[0].value="ANY";