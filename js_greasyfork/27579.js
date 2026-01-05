// ==UserScript==
// @name     Un-dim
// @description       Un-dim hidden topic pages on Moodle for Teachers.
// @include  http://ecampus.nmit.ac.nz/moodle/course/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @version 0.0.1.20170222020755
// @namespace https://greasyfork.org/users/94055
// @downloadURL https://update.greasyfork.org/scripts/27579/Un-dim.user.js
// @updateURL https://update.greasyfork.org/scripts/27579/Un-dim.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change introduced
    in GM 1.0.   It restores the sandbox.
*/
//-- Get everything that has the class "user_type_1".
var userTypeNodes = $(".hidden");
var userTypeNodes2 = $(".dimmed_text");
userTypeNodes.removeClass ("hidden");
userTypeNodes2.removeClass ("dimmed_text");
