// ==UserScript==
// @name           E-H Torrent Filter
// @description    Shows only galleries without torrents.
// @author         Hen-Tie
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336-hen-tie
// @include        /^https?:\/\/(e-|ex)hentai\.org\/$/
// @include        /^https?:\/\/(e-|ex)hentai\.org\/(\?page=.*|\?f_.*|tag\/.*|uploader\/.*)$/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @icon           https://i.imgur.com/pMMVGRx.png
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/382074/E-H%20Torrent%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/382074/E-H%20Torrent%20Filter.meta.js
// ==/UserScript==

$('.gldown img[title="Show torrents"]').parents('tr, .gl1t').addClass('ehtf-hidden');

$('.ip').after('<p class="ehtf-controls">Torrent Filter: Active</p>');

$('head').append(`<style data-jqstyle="ehTorrentFilter">
.ehtf-hidden {display:none;}
.ehtf-controls {text-align:center;}
</style>`);