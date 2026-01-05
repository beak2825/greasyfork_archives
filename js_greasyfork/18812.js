// ==UserScript==
// @name	Nowe posty na FSO
// @namespace	pl.kurczak
// @author	Kurczak
// @description	Otwiera wszystkie wątki z nieprzeczytanymi odpowiedziami w kartach
// @include	http://forum.siatka.org/*
// @include	http://www.forum.siatka.org/*
// @version	1.0.0
// @require http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant	none
// @run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/18812/Nowe%20posty%20na%20FSO.user.js
// @updateURL https://update.greasyfork.org/scripts/18812/Nowe%20posty%20na%20FSO.meta.js
// ==/UserScript==
function main() {
    var button = ' • <a class="open-unread" href="javascript: void(0)">Otwórz nieprzeczytane w kartach</a>';
    if ($('dt a[href*="unread"]').length) {
        $('.leftside > li').append(button);
    }
    $('.open-unread').click(function () {
        $('a[href*="unread"]').each(function (i) {
            window.open($(this).attr('href'));
        });
    });
}
$(document).ready(main);
