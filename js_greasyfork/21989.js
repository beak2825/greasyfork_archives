// Anti-Disabler
// version 0.5 BETA!
// 2005-06-28
// Copyright (c) 2005, Mark Pilgrim
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Anti-Disabler", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Anti-Disabler
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   restore context menus on sites that try to disable them
// @include       *
// @exclude       http://mail.google.com/*
// @exclude       https://mail.google.com/*
// @version 0.0.1.20160804074040
// @downloadURL https://update.greasyfork.org/scripts/21989/Anti-Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/21989/Anti-Disabler.meta.js
// ==/UserScript==

(function() {
    var e, i, all;

    document.onmouseup = null;
    document.onmousedown = null;
    document.oncontextmenu = null;

    all = document.getElementsByTagName("*");
    for (i = 0; i < all.length; i += 1) {
        e = all[i];
        e.onmouseup = null;
        e.onmousedown = null;
        e.oncontextmenu = null;
    }
})();


// ChangeLog
// 2005-06-28 - 0.5 - MAP - updated GMail URL
// 2005-04-21 - 0.4 - MAP - linted
// 2005-04-21 - 0.3 - MAP - exclude GMail
// 2005-04-18 - 0.2 - MAP - tidy code
// 2005-04-01 - 0.1 - MAP - initial release