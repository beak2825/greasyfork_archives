// ==UserScript==
// @name        clean pixiv
// @namespace   majinX
// @include     http://www.pixiv.net/
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @description Remove pixiv time machine from top page.
// @downloadURL https://update.greasyfork.org/scripts/20914/clean%20pixiv.user.js
// @updateURL https://update.greasyfork.org/scripts/20914/clean%20pixiv.meta.js
// ==/UserScript==

$(".time-machine").hide()
$(".hot-entries").hide()
