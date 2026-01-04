// ==UserScript==
// @name        Show institution on SPOJ score list
// @namespace   spt.jobsafari.dk
// @description Adds an institution column to the score page on SPOJ
// @include     http://www.spoj.com/*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369847/Show%20institution%20on%20SPOJ%20score%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/369847/Show%20institution%20on%20SPOJ%20score%20list.meta.js
// ==/UserScript==
function key (user) { return "jix_institution_mapping_" + user; }
function get_user_institution (user) {
    return window.localStorage.getItem( key(user) );
}
function set_user_institution (user, value) {
    return window.localStorage.setItem( key(user), value );
}

console.log("Running script");

$( function () {
    var location = "" + document.location;
    var match;
    console.log(location);
    if (location.match(/\/ranks2\b/)) {
        console.log("Ranking page!");
        $('thead th:nth-child(2)').after('<th>Institution</th>');

        setInterval( function () {
            $('.missing-user').each( function () {
                var $this = $(this);
                var username = $this.data('user');
                var institution = get_user_institution(username);
                if (institution) {
                    console.log("Found institution for " + username);
                    $this.text(institution);
                    $this.removeClass('missing-user');
                }
            } );
        }, 2000 );

        $('table.table a').each( function () {
            var $this = $(this);
            match = $this.attr('href').match(/\/users\b\/([^/]+)/);
            if (! match) return;

            var username = match[1];
            var institution = get_user_institution(username);
            var container = $('<td>Loading...</td>');
            $this.parent().after(container);

            if (institution) {
                container.text(institution);
            } else {
                container.addClass('missing-user').data('user', username);
                console.log("No institution known for " + username + "; attempting to load...");
                var frame = $('<iframe style="visibility: hidden; display: none">').attr('src', $this.attr('href'));
                $this.append(frame);
            }
        } );
    } else if (match = location.match(/\/users\b\/([^/]+)/)) {
        var username = match[1];
        console.log("User page for " + username);
        var $institution = $('#user-profile-left p:has(.fa-building-o)');
        if ($institution.length > 0 &&
            (match = $institution.text().match(/Institution: (.*)/))) {
            var institution = match[1];
            console.log("Institution found; it's: " + institution);
            set_user_institution(username, institution);
        } else {
            console.log("No institution found for " + username);
            set_user_institution(username, 'N/A');
        }
    }
} );
