// ==UserScript==
// @name     Show My Assignments in Main Nav
// @include  *3.basecamp.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @description Adds back the "My Assignments" button to Basecamp 3's top navbar.
// @version 0.0.1.20160414182305
// @namespace https://greasyfork.org/users/38770
// @downloadURL https://update.greasyfork.org/scripts/18781/Show%20My%20Assignments%20in%20Main%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/18781/Show%20My%20Assignments%20in%20Main%20Nav.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
/*jshint multistr: true */
$("ul.topnav__group.list--unbulleted.flush:not(.topnav__group--left):not(.topnav__group--right)").prepend( ' \
    <li class="topnav-menu">                                                                 \
        <a href="https://3.basecamp.com/3343011/my/assignments" class="topnav-menu__trigger">                \
                My Assignments                                                                               \
        </a>                                                                                                 \
    </li>                                                                                                    \
' );
