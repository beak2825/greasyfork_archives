// ==UserScript==
// @name     Youtube Old Video Blocker
// @grant    none
// @version  1.1
// @include  https://www.youtube.com/feed/subscriptions
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @description Remove older Youtube videos from subscription feed, edit to customize threshold. It does not work on "loading more" videos (the script is not re-run when the page changes) - so just don't scroll down...
// @namespace https://greasyfork.org/users/91645
// @downloadURL https://update.greasyfork.org/scripts/26234/Youtube%20Old%20Video%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/26234/Youtube%20Old%20Video%20Blocker.meta.js
// ==/UserScript==

/*--- Use the jQuery contains selector to find content to remove.
    Beware that not all whitespace is as it appears.
*/

$("li.yt-shelf-grid-item").has("ul.yt-lockup-meta-info:contains('3 weeks ago')").css("visibility", "hidden");
$("li.yt-shelf-grid-item").has("ul.yt-lockup-meta-info:contains('4 weeks ago')").css("visibility", "hidden");
$("li.yt-shelf-grid-item").has("ul.yt-lockup-meta-info:contains('month ago')").css("visibility", "hidden");
$("li.yt-shelf-grid-item").has("ul.yt-lockup-meta-info:contains('months ago')").css("visibility", "hidden");
