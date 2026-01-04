// ==UserScript==
// @name     thwiki.cc Lyrics Reader
// @name:en     Lyrics Reader on Chinese Touhou Wiki
// @namespace https://takkkane.tumblr.com/scripts/lyricsReaderChinese
// @supportURL     https://twitter.com/TaxDelusion
// @description A script that makes easier to get lyrics from Chinese Touhou Wiki pages.
// @version  0.1.1
// @include  https://thwiki.cc/*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/428901/thwikicc%20Lyrics%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/428901/thwikicc%20Lyrics%20Reader.meta.js
// ==/UserScript==


$(document).ready(function () {

  //they're just in a row above the first lyrics row
	var lyricsHeaders = $("body").find(".tt-lyrics-header > td.tt-mainh, td.tt-tranh");

	lyricsHeaders.each(function (index, header) {

		var onClickHandler = function () {

			var lyrics = "";
      var line = "";
      var lineSeparator = '\r';
			$("body").find("tr.tt-main-ja, tr.tt-main-en, tr.tt-lyrics-sep").find("td:nth-child(" + (index + 2) + ")").each(function (i, e) {
        
        line = e.textContent.trim();
        lyrics += (line + lineSeparator);
			});

      lyrics = lyrics.trim();
			utils.copyToClipboard(lyrics, header);
			
		};

		$(header).on("click", onClickHandler);
    $(header).append("<span style='color:navy; color-background:white'>&#x2139;</span>");

	});

});


// ----- utils

var utils = {
	copyToClipboard: function (data, domElement) {
		var textArea = document.createElement("textarea");
		textArea.value = data;
		domElement.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Fallback: Copying text command was ' + msg);
      $.notify('Copying lyrics was ' + msg + '!', {'position': 'top center', 'className': successful ? 'success' : 'error'});
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
		}

		domElement.removeChild(textArea);
	}
};

console.log("Loading done!");
