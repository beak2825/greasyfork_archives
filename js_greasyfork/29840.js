// ==UserScript==
// @name        Torrent9-720-1080
// @namespace   https://greasyfork.org/fr/users/125050-aztazt
// @description Met les vidéos 1080p et 720p dans une couleur différente
// @include     http*://*torrent9.*/*
// @version     1.0
// @grant       none
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/29840/Torrent9-720-1080.user.js
// @updateURL https://update.greasyfork.org/scripts/29840/Torrent9-720-1080.meta.js
// ==/UserScript==
this.jQuery = jQuery.noConflict(true);
var CompteLigne = 0;
var Q1080 = 0;
var Q720 = 0;

jQuery(document).ready(function () {
    jQuery('tr').each(function () {
        var UnLien = jQuery(this).find('td').first().find('a');
        if (UnLien.length > 0) {
            var Q1080 = UnLien.attr('href').search('1080');
            if (Q1080 != - 1) { jQuery(this).attr('style', 'background-color:#0F2;'); }
            var Q720 = UnLien.attr('href').search('720');
            if (Q720 != - 1) { jQuery(this).attr('style', 'background-color:#0E6;'); }
            var MorceauDeLien = UnLien.attr('href').split("/");
            var LienFinal = "/get_torrent/" + MorceauDeLien[MorceauDeLien.length - 1]+ ".torrent";
            var ImageFilm = "/_pictures/" + MorceauDeLien[MorceauDeLien.length - 1]+ ".jpg";
        }
        var LaLigne = jQuery(this);
        if (CompteLigne % 61 === 0) {
            LaLigne.append('<th class="col-md-1">D/L</th>');
            LaLigne.prepend('<th class="col-md-1">Image</th>');
        } else {
            LaLigne.prepend('<td><img title="D/L" src="'+ImageFilm+'" style="width: 100px;"></td>');
            LaLigne.append('<td><a title="D/L" href="'+LienFinal+'" style="color:#222; font-size:10px; font-weight:bold;">D/L</a></td>');
        }
        CompteLigne++;
    });

    $('ul.nav.nav-tabs.sort-cat').find('li').click(function (e) {
        $('li.active').removeClass('active');
        $(this).addClass('active');
        console.log($(this).find('a').attr('aria-controls'));
        $('div#'+table).hide();
        table = $(this).find('a').attr('aria-controls');
        $('div#'+table).show();
        e.preventDefault();
    });
});