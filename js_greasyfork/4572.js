// ==UserScript==
// @name       Gaia Online PM improvements
// @namespace  http://mathemaniac.org
// @version    1.1.1
// @description  Improves PMs on Gaia in a few different ways.
// @match      https://www.gaiaonline.com/profile/privmsg.php*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js
// @copyright  2012-2023, Sebastian Paaske Tørholm
// @downloadURL https://update.greasyfork.org/scripts/4572/Gaia%20Online%20PM%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/4572/Gaia%20Online%20PM%20improvements.meta.js
// ==/UserScript==

// Downloaded from http://userscripts.org/scripts/show/137486

$('button#btn_delete').each( function (i, e) {
    $(e).after('<a href="#" id="select_read" style="padding-left: 1em; padding-right: 1em;">Select replied</a>');
    $('#select_read').click( function (ev) {
        $('tr').each( function (i, e) {
            $('input[type="checkbox"]', e).attr('checked', $('img[alt="Replied Message"]', e).length > 0);
        });
        ev.preventDefault();
    } );
} );

(function () {
    // Hide quotes more than 10 levels deep.
    var levels = 10;
    var selector = "";
    for (var i = 0; i < levels; i++) {
        selector += 'div.quote ';
    }
    var first = $(selector + 'div.quoted').first();

    first.css({'display': 'none'});
    first.before('<a id="mathemaniac_show_deeply_nested" href="#">Show hidden quotes.</a>');
    var nestlink = $('#mathemaniac_show_deeply_nested');
    nestlink.css({
        'display': 'block',
        'border': '1px solid red',
        'padding': '0.25em',
        'margin': '0.25em',
        'text-align': 'center'
    });
    nestlink.click( function (ev) {
        nestlink.remove();
        first.css({'display': 'inherit'});
        ev.preventDefault();
    });
})();

