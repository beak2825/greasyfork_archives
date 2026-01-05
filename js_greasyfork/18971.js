// ==UserScript==
// @name         MyAnimeList(MAL) - Average Friends Score
// @version      1.0.11
// @description  Display next to the MAL score, the average score of your friends
// @author       Cpt_mathix
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @match        https://myanimelist.net/anime.php?*
// @match        https://myanimelist.net/manga.php?*
// @exclude      /^https?:\/\/myanimelist\.net\/(anime|manga)\/[^0-9]+/
// @license      GPL-2.0-or-later
// @grant        none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/18971/MyAnimeList%28MAL%29%20-%20Average%20Friends%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/18971/MyAnimeList%28MAL%29%20-%20Average%20Friends%20Score.meta.js
// ==/UserScript==

(function($) {
    var url = document.querySelector("#horiznav_nav > ul > li > a").href.match(/(^https?:\/\/myanimelist\.net\/(anime|manga)\/\d+\/?[^\/?]*)/)[1];

    $.get(url + '/stats', function(data) {
    	var elements = $($.parseHTML(data)).find('table.table-recently-updated > tbody > tr:nth-child(n) > td:nth-child(2)').not('.borderClass.fw-b.ac');

    	var sum = 0;
    	var count = 0;
    	$(elements).each( function() {
    		var score = $(this).text();
    		if(!isNaN(score)) {
    			sum += parseInt(score);
    			count += 1;
    		}
    	});

    	var averageScore;
    	if (sum > 0) {
    		averageScore = (sum/count).toPrecision(3);
    	} else {
    		averageScore = '-';
    	}

        $('#content div > h2').each( function() {
            if ($(this).text().trim() === "Statistics") {
                var friendScoreAnchor = $(this).next();

                var newElement = document.createElement('div');
                $(newElement).html('<span class="dark_text">Friend Score:</span> ' + averageScore);
                $(newElement).addClass('spaceit_pad');

                $(newElement).insertAfter(friendScoreAnchor);
                $(friendScoreAnchor).addClass('spaceit_pad');
            }
        });
    });
})(jQuery);