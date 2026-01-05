/******************************************************************************
 * greasyfork.org scripts "Show Favorites" Redirect by Jan Karjalainen
 * Based on the Linux.org news "Read full article" redirect by Jaap Haitsma (jaap at haitsma dot org) see: http://userscripts.org/scripts/show/5350
 *
 * version 0.1
 * 2015-11-07
 * Copyright (c) 2015, Jan Karjalainen
 * Released under the GPL license, version 4
 * http://www.gnu.org/copyleft/gpl.html
 ****************************************************************************** 
 * On load of greasyfork.org user profile page, if there is a link to favorite script set whose inner html is 'View scripts' then:
 *   - redirect to reffered link in the actual window is done
 *
 * This script asumes linux today stories contains the text "View scripts"
 * in the link to the article. 
 *
 *
 * To Install:
 *  - like any greasemonkey script: install greasemonkey, restart FF, open
 *    this script in a browser window, go to Tools/Install User Script
 *
 * To Uninstall:
 *  - like any greasemonkey script: Tools/Manage User Scripts, select 
 * 'greasyfork-showfavorites "Show Favorites" Redirect', click the Uninstall button
 *
 * Changelog: 
 *  ver 0.1
 *    2015-11-07
 *    Jan Karjalainen
 *    - 1st ver
 */

// ==UserScript==
// @name          greasyfork.org "Show Favorites" Redirect
// @description   Automatic redirect for greasyfork.org favorite scripts on user's profile page
// @namespace     http://userscript.org/
// @include       https://greasyfork.org/*/users/*
// @include       http://greasyfork.org/*/users/*
// @grant       none
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/13691/greasyforkorg%20%22Show%20Favorites%22%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/13691/greasyforkorg%20%22Show%20Favorites%22%20Redirect.meta.js
// ==/UserScript==

(function() {
    try {
        textLink="View scripts";
        nPage=-1;
	// opens 1.st such a link in tab
        for( i=0; i < document.links.length; i++ )
            if( document.links[ i ].innerHTML.match( textLink ))
		window.location.href=document.links[i].href
    }
    catch (e) {
        GM_log( 'greasyfork.org "Show Favorites" Redirect - script exception: ' + e );
        alert ( 'greasyfork.org "Show Favorites" Redirect - script exception: ' + e );
    }
}
)();
