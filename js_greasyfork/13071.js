// ==UserScript==
// @name         HorribleSubs.info myanimelist.net links (HML)
// @namespace    https://github.com/Znote
// @version      1.1
// @description  Parses HorribleSubs Releases table for anime episodes, filtering out the series name and generates a MAL search link IF it doesn't have a horriblesubs link.
// @author       Stefan André Brannfjell, aka: (Znote, MrBrannfjell)
// @match        http://horriblesubs.info/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13071/HorribleSubsinfo%20myanimelistnet%20links%20%28HML%29.user.js
// @updateURL https://update.greasyfork.org/scripts/13071/HorribleSubsinfo%20myanimelistnet%20links%20%28HML%29.meta.js
// ==/UserScript==

jQuery(document).ready(function($) {
	var listcontainer = $('div.latest');
	var seasons = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15', 's16', 's17', 's18', 's19', 's20'];

	// Fix inconsistency between HS naming and MAL naming to fix empty MAL searches.
	var inconsistent_names = [
		{hs:"K - Return of Kings",mal:"K: Return of Kings"}
	];
	window.debug = inconsistent_names;
	window.listsize = listcontainer[0].innerHTML.length;

	console.log("HML:", listcontainer[0].innerHTML.length);
	setInterval(function() {
		if (window.listsize !== listcontainer[0].innerHTML.length) {
			
			console.log("HML:", "Detected that the list has changed: ", window.listsize, listcontainer[0].innerHTML.length);
			window.listsize = listcontainer[0].innerHTML.length;
			
			// Adding transition effect to show parsed elements.
			$('table.release-info .rls-label').css({"background-color":"transparent", "transition":"background-color 1s"});
			
			// Parse through elements that arent parsed. 
			$('div.latest .rls-label:not(.parsed)').each(function(index) {
				
				$(this).addClass('parsed'); // Don't parse this table row again. 
				
				// Lets try to filter out the useless parts and fetch only the series name from this row. 
				var parts = this.innerHTML.split(') ');
				var first = parts[0];
				parts = parts[1].split(' - ');
				var second = parts[0];
				var third = parts[1];
				
				// Some awkward series with bad names are hard to detect: K - return of Kings
				if (second.length < 3) {
					second = second + ' - ' + third;
					third = parts[2];
					console.log("HML:", "WTF;: ", second);
				}

				// Filter out the season word from the search (s1, s2 etc)
				var contains_season = second.split(' ');
				var generated_name = "";
				var found = false;
				var season_name = '';
				var i = 0;
				for (i; i < contains_season.length; i+=1) {
					found = $.inArray(contains_season[i].toLowerCase(), seasons) > -1;
					if (found === true) {
						found = i;
						season_name = contains_season[i];
					} else {
						if (generated_name.length !== 0) {
							generated_name = generated_name + ' ' + contains_season[i];
						} else {
							generated_name = contains_season[i];
						}
					}
				}

				if (found !== false) {
					console.log("HML:", "Found seasonal series: "+generated_name);
				}
				
				// Fix inconsistent names
				i = 0;
				for (i; i < inconsistent_names.length; i +=1) {
					//console.log("HML:", "if ("+generated_name+") is equal to ( "+inconsistent_names[i].hs+"):");
					if (generated_name == inconsistent_names[i].hs) {
						generated_name = inconsistent_names[i].mal;
						console.log("HML:", "Recognized inconsistent name, changed to: "+inconsistent_names[i].mal);
					}
				}

				// See if the series already contains a link to horriblesubs series page, then the MAL link isn't really neccesary.
				if (generated_name.indexOf('<a ') === -1) {
					console.log("HML:", "Created MAL search link for: " + generated_name);
					var MAL_search = "<a href='http://myanimelist.net/anime.php?q="+generated_name.replace("'", "")+"' target='_BLANK'>"+generated_name+"</a> "+season_name;

					this.innerHTML = this.innerHTML.replace(second, MAL_search);
					// A small heads up that its parsed now.
					$(this).css('background-color', 'rgba(0, 255, 0, 0.5)');
				} else {
					// A small heads up that it is parsed, but contains HS link.
					$(this).css('background-color', 'rgba(255, 165, 0, 0.5)');
					console.log("HML:", "Found HS link: " + generated_name);
				}
				
			});
		}
	}, 1000);

});