// ==UserScript==
// @name       Swedroid forum - goto first unread redirect
// @namespace  http://www.fmbv.nu/
// @version    0.2
// @description  Swedroid forum - goes to first unread post.
// @match      http://www.swedroid.se/forum/*
// @match      https://www.swedroid.se/forum/*
// @grant       none
// @copyright  2013, Jan Karjalainen
// @downloadURL https://update.greasyfork.org/scripts/3564/Swedroid%20forum%20-%20goto%20first%20unread%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/3564/Swedroid%20forum%20-%20goto%20first%20unread%20redirect.meta.js
// ==/UserScript==


(function() {

    try {

        textLink="Visa första olästa";

        nPage=-1;
        
	// opens 1.st such a link in tab

        for( i=0; i < document.links.length; i++ )

            if( document.links[ i ].innerHTML.match( textLink ))

		window.location.href=document.links[i].href
    }

    catch (e) {

        GM_log( 'Swedroid forum - goto first unread Redirect - script exception: ' + e );

        alert ( 'Swedroid forum - goto first unread Redirect - script exception: ' + e );

    }

}

)();
