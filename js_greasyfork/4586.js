// ==UserScript==
// @name           OkCupid Username QuickMatch
// @namespace      Eckankar-at-Gmail-dot-com
// @include        http://www.okcupid.com/quickmatch*
// @include        http://okcupid.com/quickmatch*
// @description    Adds names to QuickMatches on OkCupid.
// @version        1.0
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/4586/OkCupid%20Username%20QuickMatch.user.js
// @updateURL https://update.greasyfork.org/scripts/4586/OkCupid%20Username%20QuickMatch.meta.js
// ==/UserScript==
// Comments can be mailed to "Eckankar -at- gmail -dot- com"

$(function () {
    function addProfileLink() {
        if (! $('span.aso .profile_link').length > 0) {
            var username = Quickmatch.stack[0].sn;
            console.log(username);
            $('span.aso').prepend('<a href="http://okcupid.com/profile/' + username + '" class="profile_link">' + username + '</a> / ');
        }
    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var config = { childList: true, characterData: false, attributes: false, subtree: true };
    var observer = new MutationObserver( function (mutations) {
        addProfileLink();
    });

    $('#left #info_blocks').each( function () { observer.observe(this, config); } );

    addProfileLink();
});
