// ==UserScript==
// @name        imgur usersub
// @namespace   https://imgur.com
// @description logo link to usersub
// @include     https://imgur.com/*
// @include     http://imgur.com/*
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25092/imgur%20usersub.user.js
// @updateURL https://update.greasyfork.org/scripts/25092/imgur%20usersub.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change introduced in GM 1.0,
    It restores the sandbox.
*/

$('#topbar .logo').attr('href','https://imgur.com/new/time');