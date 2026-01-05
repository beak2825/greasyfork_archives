// ==UserScript==
// @name       smallnetbuilder.com forum - goto first unread redirect
// @namespace  http://www.fmbv.nu/
// @version    0.3
// @description  smallnetbuilder.com forum - goes to first unread post.
// @match      http://www.snbforums.com/*
// @match      https://www.snbforums.com/*
// @copyright  2013, Jan Karjalainen
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3563/smallnetbuildercom%20forum%20-%20goto%20first%20unread%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/3563/smallnetbuildercom%20forum%20-%20goto%20first%20unread%20redirect.meta.js
// ==/UserScript==


(function() {

    try {

        textLink="Jump to new";

        nPage=-1;
        
	// opens 1.st such a link in tab

        for( i=0; i < document.links.length; i++ )

            if( document.links[ i ].innerHTML.match( textLink ))

		window.location.href=document.links[i].href
    }

    catch (e) {

        GM_log( 'www.snbforums.com forum - goto first unread Redirect - script exception: ' + e );
        alert ( 'www.snbforums.com - goto first unread Redirect - script exception: ' + e );

    }

}

)();
