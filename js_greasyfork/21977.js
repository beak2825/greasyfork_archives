// ==UserScript==
// @name cK Userbar Helper
// @namespace cK Userbar Helper
// @description Makes editing userbars easier by unchecking the radio boxes by default.
// @version 1.0
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include http://clraik.com/forum/profile.php?do=editprofile*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/21977/cK%20Userbar%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/21977/cK%20Userbar%20Helper.meta.js
// ==/UserScript==

document.body.innerHTML = document.body.innerHTML.replace(/checked="checked"/g, '');