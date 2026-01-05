// ==UserScript==
// @name         ProjectFreeTv Episode Guide
// @namespace    pftepisodeguide
// @version      0.2
// @description  Enhance ProjectFreeTV links with episode information.
// @author       splttingatms
// @include      http://projectfreetv.im/free/*
// @include      https://projectfreetv.im/free/*
// @include      http://*.projectfreetv.im/free/*
// @include      https://*.projectfreetv.im/free/*
// @include      http://projectfreetv.im/episode/*
// @include      https://projectfreetv.im/episode/*
// @include      http://*.projectfreetv.im/episode/*
// @include      https://*.projectfreetv.im/episode/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.0.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/20564/ProjectFreeTv%20Episode%20Guide.user.js
// @updateURL https://update.greasyfork.org/scripts/20564/ProjectFreeTv%20Episode%20Guide.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function isEpisodePage() {
		return window.location.href.indexOf("episode") !== -1;
	}

	function parseFullEpisodeTitle(title) {
		var parsedEpisode = title.match(/(.+) Season (\d+) Episode (\d+)/);
		return {
			series: parsedEpisode[1],
			season: parsedEpisode[2],
			episode: parsedEpisode[3]
		};
	}
	
	if (isEpisodePage()) {
		var fullEpisodeTitle = $(".title")[0].innerText;
		var episode = parseFullEpisodeTitle(fullEpisodeTitle);

		$.getJSON(`https://www.omdbapi.com/?t=${encodeURIComponent(episode.series)}&Season=${episode.season}&Episode=${episode.episode}&callback=?`, function(result) {
			$(".box b")[3].nextSibling.data = result.Plot;
		});
	} else {
		$("table tr").each(function () {
			var episodeTableRow = $(this);
			var episodeLink = $("a:first-child", episodeTableRow);
			var episode = parseFullEpisodeTitle(episodeLink.text());

			$.getJSON(`https://www.omdbapi.com/?t=${encodeURIComponent(episode.series)}&Season=${episode.season}&Episode=${episode.episode}&callback=?`, function(result) {
				episodeLink.text(`S${episode.season}E${episode.episode} ${result.Title}`);

				var plot = $("</p>")
				.text(result.Plot)
				.css({margin: 0, textAlign: 'left'});

				$("th", episodeTableRow).append(plot);
			});
		});
	}
})();