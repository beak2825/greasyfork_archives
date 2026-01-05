// ==UserScript==
// @name        Anime Instrumentality replace Flash with HTML5 audio
// @description The Anime Instrumentality blog sadly relies on Flash for audio track previews. This fixes it by replacing all audio snippets on the site with simple HTML5 audio players.
// @include     http://blog.animeinstrumentality.net/*
// @version     1
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/120503
// @downloadURL https://update.greasyfork.org/scripts/29375/Anime%20Instrumentality%20replace%20Flash%20with%20HTML5%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/29375/Anime%20Instrumentality%20replace%20Flash%20with%20HTML5%20audio.meta.js
// ==/UserScript==
$('p.audioplayer_container').each(function() {
  var script = $(this).next().find("script").text();
  var encoded = script.match(/soundFile:"([a-zA-Z0-9]+)"/)[1];
  if (encoded.length % 4 == 1) { // Fix for incorrect Base64 encoding
    encoded = encoded.slice(0, encoded.length - 1);
  }
  $('<audio controls/>')
    .attr('src', atob(encoded))
    .attr('style', 'display:block;margin:0 auto')
    .replaceAll($(this));
})
