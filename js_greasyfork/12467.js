// ==UserScript==
// @name        Hides Trollzilla's comments
// @description Hides Trollzilla's comments on kickstarter
// @namespace   kickstarter.com/projects/Trollzilla
// @include     https://www.kickstarter.com/projects/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12467/Hides%20Trollzilla%27s%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/12467/Hides%20Trollzilla%27s%20comments.meta.js
// ==/UserScript==
//
var isoJS = unsafeWindow.jQuery;
isoJS("[href=/profile/2055722138]").parent().parent().parent().hide();