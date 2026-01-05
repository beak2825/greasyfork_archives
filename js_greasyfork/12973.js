// ==UserScript==
// @name       mobileread.com forum - goto first unread redirect
// @namespace  http://www.fmbv.nu/
// @version    0.4
// @description  mobileread.com forum - goes to first unread post.
// @match      http://www.mobileread.com/forums*
// @match      https://www.mobileread.com/forums*
// @copyright  2015, Jan Karjalainen
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12973/mobilereadcom%20forum%20-%20goto%20first%20unread%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/12973/mobilereadcom%20forum%20-%20goto%20first%20unread%20redirect.meta.js
// ==/UserScript==


(function() {

    try {

        var textLink="View First Unread";

        var nPage=-1;

	// opens 1.st such a link in tab

        for( var i=0; i < document.links.length; i++ ) {

            if( document.links[ i ].innerHTML.match( textLink )) {

                window.location.href=document.links[i].href
            }
        }
    }

    catch (e) {

        GM_log( 'mobileread.com forum - goto first unread Redirect - script exception: ' + e );
        alert ( 'mobileread.com - goto first unread Redirect - script exception: ' + e );

    }

}

)();
