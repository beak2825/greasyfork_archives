// ==UserScript==
// @name        YouTube Hide "Recommended for you" from related videos
// @namespace   http://mathemaniac.org/
// @version     1.0.2
// @description Hides videos marked as "Recommended for you" from the related videos on YouTube video pages.
// @include     http://youtube.com/watch*
// @include     http://www.youtube.com/watch*
// @include     https://youtube.com/watch*
// @include     https://www.youtube.com/watch*
// @grant       none
// @copyright   2013-2016, Sebastian Paaske Tørholm
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/4599/YouTube%20Hide%20%22Recommended%20for%20you%22%20from%20related%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/4599/YouTube%20Hide%20%22Recommended%20for%20you%22%20from%20related%20videos.meta.js
// ==/UserScript==

function hideRecommended() {
    $('#watch-related li').each( function () {
        if ($("span:contains('Recommended for you')", this).length > 0) {
            $(this).remove();
        }
    });
    $(document).one('DOMNodeInserted', '#watch-related', hideRecommended);
}

hideRecommended();
