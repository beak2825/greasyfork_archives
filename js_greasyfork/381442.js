// ==UserScript==
// @name         RYM/iTunesAlbumSearchURIGenerator
// @description  RYM/iTunes Album Search URI Generator
// @namespace    rateyourmusic.com/~vokinpirks
// @version      1.0
// @author       vokinpirks
// @match        https://rateyourmusic.com/customchart*
// @match        https://rateyourmusic.com/release/*
// @match        https://rateyourmusic.com/misc/media_link_you_know*
// @downloadURL https://update.greasyfork.org/scripts/381442/RYMiTunesAlbumSearchURIGenerator.user.js
// @updateURL https://update.greasyfork.org/scripts/381442/RYMiTunesAlbumSearchURIGenerator.meta.js
// ==/UserScript==

// set your country code here, like us, uk, ru etc
var country = "us";
var baseURI = "https://linkmaker.itunes.apple.com/en-us?country=" + country + "&mediaType=apple_music&term=";

(function() {
    'use strict';

    var $ = unsafeWindow.jQuery;

    if (!$('.fa.fa-apple').length){
      var album = $("div.album_title").clone()
      .children()
      .remove()
      .end()
      .text();
      album = $.trim(album);
      var artist = $('a.artist').first().text();
      var searchURI = baseURI + encodeURI(artist + " " + album);
      console.log('artist: ' + artist);
      console.log('album: ' + album);
      console.log('searchURI: ' + searchURI);
      $('<a>', { href: searchURI, style: 'font-size: 10.0px', text: 'Search in iTunes'}).appendTo('div.album_title');
    }

    $('table.mbgen tbody tr').each(function (index, value){
		if (!$(this).find('.fa.fa-apple').length){
			var album = $(this).find('a.album').text();
			album = $.trim(album);
			var artist = $(this).find('a.artist').text();
			var searchURI = baseURI + encodeURI(artist + " " + album);
			console.log('artist: ' + artist);
			console.log('album: ' + album);
			console.log('searchURI: ' + searchURI);
            $(this).find('a.album').after(
              $('<a>', { href: searchURI, style: 'font-size: 10.0px; margin: 5px', text: 'Search in iTunes'})
            );
		}
    });
})();