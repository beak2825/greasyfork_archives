// ==UserScript==
// @name        Reprap forum Paging Links
// @namespace   localhost
// @include     http://forums.reprap.org/read.php*
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @version     1
// @grant       none
// @description	Prepend reprap forum paging links to top
// @downloadURL https://update.greasyfork.org/scripts/32832/Reprap%20forum%20Paging%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/32832/Reprap%20forum%20Paging%20Links.meta.js
// ==/UserScript==
$('div.nav div.paging').clone().prependTo('div#page-info + div.nav');