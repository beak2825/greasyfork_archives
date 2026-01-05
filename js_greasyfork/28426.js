// ==UserScript==
// @name           YouTube Auto-DisLike Playlist
// @namespace      http://userscripts.org/users/23652
// @description    Automatically clicks the 'DisLike' and then 'Next' button in a playlist
// @include        http://*.youtube.com/watch*v=*
// @include        http://youtube.com/watch*v=*
// @include        https://*.youtube.com/watch*v=*
// @include        https://youtube.com/watch*v=*
// @copyright      andwan0
// @version        2.3
// @license        GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @require        https://greasyfork.org/scripts/1884-gm-config/code/GM_config.js?version=4836
// @require        https://greasyfork.org/scripts/1885-joesimmons-library/code/JoeSimmons'%20Library.js?version=7915
// @require        https://greasyfork.org/scripts/2104-youtube-button-container-require/code/YouTube%20-%20Button%20Container%20(@require).js?version=5493
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/28426/YouTube%20Auto-DisLike%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/28426/YouTube%20Auto-DisLike%20Playlist.meta.js
// ==/UserScript==

/* CHANGELOG
2025-11-03 fixed working with youtube again!
*/



(function () {
    'use strict';

    var intv, timeStart;

    // Run a function when the page is fully loaded
    //JSL.runAt('end', function() {
        // timeouts are in milliseconds
        window.setTimeout(doLike, 10000);//change this to doDislike
        window.setTimeout(doNext, 29000);
        //window.setTimeout(reset, 61000);//reload page to reset the doLike, doNext timers...
    //});

    function reset() {
        console.log('reset()');
        location.reload(true);
    }

    function doLike() {
        console.log('doLike()');
        if (document.getElementsByClassName('ytLikeButtonViewModelHost')[1].childNodes[0].childNodes[0].childNodes[0].getAttribute('aria-pressed') != 'true') {
            document.getElementsByClassName('ytLikeButtonViewModelHost')[1].childNodes[0].childNodes[0].childNodes[0].click();
        }

        window.setTimeout(doLike, 10000);//change this to doDislike
    }

    function doDislike() {
        console.log('doDislike()');
        if (document.getElementsByClassName('ytDislikeButtonViewModelHost')[1].childNodes[0].childNodes[0].childNodes[0].getAttribute('aria-pressed') != 'true') {
            document.getElementsByClassName('ytDislikeButtonViewModelHost')[1].childNodes[0].childNodes[0].childNodes[0].click();
        }
    }

    // we don't want to spam, so we delay to make it look like we're really watching...
    function doNext() {
        console.log('doNext()');

        window.setTimeout(doNext, 29000);

        var nextButton = document.querySelector('.ytp-next-button');
        nextButton.click();
    }

}());