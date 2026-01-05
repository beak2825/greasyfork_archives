// ==UserScript==
// @name         Add movie ratings to IMDB links [By Pharaoh2k]
// @description  Adds movie ratings and number of voters to links on IMDB. Modified version of http://userscripts.org/scripts/show/96884
// @author       StackOverflow community (especially Brock Adams)
// @version      2023-01-28-01-Pharaoh2k
// @license      MIT
// @match        *://www.imdb.com/*
// @grant        GM_xmlhttpRequest
// TODO: Remove this
// @grant        unsafeWindow
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace    https://greasyfork.org/users/2427
// @derived-from https://greasyfork.org/en/scripts/2033-add-imdb-rating-votes-next-to-all-imdb-movie-series-links-improved
// @downloadURL https://update.greasyfork.org/scripts/2033/Add%20movie%20ratings%20to%20IMDB%20links%20%5BBy%20Pharaoh2k%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/2033/Add%20movie%20ratings%20to%20IMDB%20links%20%5BBy%20Pharaoh2k%5D.meta.js
// ==/UserScript==
// Special Thanks to Brock Adams for this script: http://stackoverflow.com/questions/23974801/gm-xmlhttprequest-data-is-being-placed-in-the-wrong-places/23992742

var maxLinksAtATime = 100; //-- Pages can have 100's of links to fetch. Don't spam server or browser.
var skipEpisodes = true; //-- I only want to see ratings for movies or TV shows, not TV episodes.
var showAsStar = false; //-- Use IMDB star instead of colored div, less info but more consistent with the rest of the site.
var addRatingToTitle = true; //-- Adds the rating to the browser's title bar (so rating will appear in browser bookmarks).
var showMetaScore = true; //-- When the metascore is available, show it
var useLightBackground = false; //-- If you prefer the site to have a light grey background

if (useLightBackground) {
	GM_addStyle('.ipc-page-background { background: #e3e2dd !important; color: black !important; }');
	// You could also try #262626 for a dark grey but not black background
}

// Nov 2022 design has `display: flex` to make all/some info flow downwards, which causes our rating to appear below the link, instead of after it
// TODO: A better solution might be to replace the <a> with a <div> containing the <a> and our rating
// TODO: Or we could try putting the rating inside the link
// TODO: Or we could make the rating float after the link, using position: absolute
GM_addStyle(`
    /* For the "Known For" section */
    .ipc-primary-image-list-card__content-top {
        flex-direction: row;
    }

    /* For the "Credits" section */
    .ipc-metadata-list-summary-item__tc {
        display: initial;
    }
`);

// The old iMDB site exposed jQuery, but the new one does not
//var $ = unsafeWindow.$;
// This was exposed by the @require
var $ = jQuery;

var fetchedLinkCnt = 0;

//const ratingSelectorNew = '.ipc-button > div > div > div > div > span:first-child';
//const ratingSelectorNew = '.ipc-button > div > div > div > div > span:first-child';
const ratingSelectorNew = "*[data-testid='hero-rating-bar__aggregate-rating__score'] > span:nth-child(1)";
const voteCountSelectorNew = "*[data-testid='hero-rating-bar__aggregate-rating__score'] + div + div";

function processIMDB_Links() {
	//--- Get only links that could be to IMBD movie/TV pages.
	var linksToIMBD_Shows = document.querySelectorAll("a[href*='/title/']");

	var lastLinkProcessed;

	for (var J = 0, L = linksToIMBD_Shows.length; J < L; J++) {
		const currentLink = linksToIMBD_Shows[J];

		/*--- Strict tests for the correct IMDB link to keep from spamming the page
		    with erroneous results.
		*/
		if (!/^(?:www\.)?IMDB\.com$/i.test(currentLink.hostname) ||
			!/^\/title\/tt\d+\/?$/i.test(currentLink.pathname)
		)
			continue;

		// I am beginning to think a whitelist might be better than this blacklist!

		// Skip if in Bio
		if ($(currentLink).hasClass("ipc-md-link")) {
			continue;
		}

		// Skip thumbnails on the search results page
		if ($(currentLink).closest('.primary_photo').length) {
			continue;
		}

		// Skip thumbnails in the six recommendations area of a title page
		if ($(currentLink).closest('.rec_item, .rec_poster').length) {
			continue;
		}

		// Skip top-rated episodes on the right-hand sidebar of TV series pages; they already display a rating anyway!
		if ($(currentLink).closest('#top-rated-episodes-rhs').length) {
			continue;
		}

		// Skip thumbnail of title at top of Season page
		if ($(currentLink).find(':only-child').prop('tagName') === 'IMG') {
			continue;
		}

		// Skip the thumbnail of each episode on a season page (episode names still processed)
		if ($(currentLink).closest('.image').length) {
			continue;
		}

		// Skip thumbnails in "Known For" section of actor pages
		if ($(currentLink).closest('.known-for, .knownfor-title').length && $(currentLink).find('img').length) {
			continue;
		}

		// Skip links to character pages
		// || currentLink.href.includes('/characters/')
		if ($(currentLink).closest('td.character').length) {
			continue;
		}

		// Skip episodes on actor pages
		if (skipEpisodes && $(currentLink).closest('.filmo-episodes').length) {
			continue;
		}

		// On an episode page, skip the next/previous buttons
		if ($(currentLink).closest('.bp_item').length) {
			continue;
		}

		// New layout 2021

		// The thumbnails on the "More like this" video cards
		if ($(currentLink).closest('.ipc-lockup-overlay').length) {
			continue;
		}

		if (typeof lastLinkProcessed !== 'undefined') {
			lastLinkProcessed = /[^\?]*/.exec(lastLinkProcessed)[0];
			// console.log("lastLinkProcessed="+lastLinkProcessed);

		}
		// console.log("currentLink.href="+currentLink.href.split('?')[0]);

		continueBttn.style.display = 'inline';
		continueBttn.style.top = '0px';
		continueBttn.style.left = '50%';
		continueBttn.style.position = 'fixed';
		continueBttn.style.height = '30px';
		continueBttn.style.width = '170px';
		continueBttn.style.color = 'black';
		continueBttn.style.zIndex = '1000';
		continueBttn.style.backgroundColor = 'rgba(245, 245, 149, 0.7)';
		continueBttn.style.boxShadow = '0 6px 6px rgb(0 0 0 / 60%)';
		currentLink.parentNode.insertBefore(continueBttn, currentLink);


		// Nov 2022: In the list of titles for an actor, there are now two <a>s in each row.
		//  if (lastLinkProcessed && currentLink.href === lastLinkProcessed.href) {
		if (lastLinkProcessed === currentLink.href.split('?')[0]) {
			currentLink.setAttribute("data-gm-fetched", "true");
			continue;
		}

		if (!currentLink.getAttribute("data-gm-fetched")) {
			if (fetchedLinkCnt >= maxLinksAtATime) {
				//--- Position the "continue" button.

				break;
			}


			//fetchTargetLink (currentLink); //-- AJAX-in the ratings for a given link.

			// Stagger the fetches, so we don't overwhelm IMDB's servers (or trigger any throttles they might have)
			// Needs currentLink to be a const, or a closure around it
			setTimeout(() => fetchTargetLink(currentLink), 300 * fetchedLinkCnt);

			//---Mark the link with a data attribute, so we know it's been fetched.
			currentLink.setAttribute("data-gm-fetched", "true");
			lastLinkProcessed = currentLink;
			fetchedLinkCnt++;
		}
	}
}

function fetchTargetLink(linkNode) {
	//--- This function provides a closure so that the callbacks can work correctly.

	//console.log("Fetching " + linkNode.href + ' for ', linkNode);

	/*--- Must either call AJAX in a closure or pass a context.
	    But Tampermonkey does not implement context correctly!
	    (Tries to JSON serialize a DOM node.)
	*/
	GM_xmlhttpRequest({
		method: 'get',
		url: linkNode.href,
		//context:    linkNode,
		onload: function(response) {
			prependIMDB_Rating(response, linkNode);
		},
		onload: function(response) {
			prependIMDB_Rating(response, linkNode);
		},
		onabort: function(response) {
			prependIMDB_Rating(response, linkNode);
		}
	});
}

function prependIMDB_Rating(resp, targetLink) {
	var isError = true;
	var ratingTxt = "** Unknown Error!";
	var colnumber = 0;
	var justrate = 'RATING_NOT_FOUND';

	if (resp.status != 200 && resp.status != 304) {
		ratingTxt = '** ' + resp.status + ' Error!';
	} else {
		// Example value: ["Users rated this 8.5/10 (", "8.5/10"]
		//var ratingM = resp.responseText.match (/Users rated this (.*) \(/);
		// Example value: ["(1,914 votes) -", "1,914"]
		//var votesM  = resp.responseText.match (/\((.*) votes\) -/);

		var doc = document.createElement('div');
		doc.innerHTML = resp.responseText;
		var elem = doc.querySelector('.title-overview .vital .ratingValue strong');

		var ratingT, votesT;
		if (elem) {
			// Old site
			var title = elem && elem.title || '';

			ratingT = title.replace(/ based on .*$/, '');
			votesT = title.replace(/.* based on /, '').replace(/ user ratings/, '');
		} else {
			// New site
			var ratingElem = doc.querySelector(ratingSelectorNew);
			ratingT = ratingElem && ratingElem.textContent || '';

			var votesElem = doc.querySelector(voteCountSelectorNew);
			votesT = votesElem && votesElem.textContent || '';

			//console.log('ratingElem', ratingElem);
			//console.log('votesElem', votesElem);

			if (votesT.slice(-1) == 'K') {
				votesT = String(1000 * votesT.slice(0, -1));
			} else if (votesT.slice(-1) == 'M') {
				votesT = String(1000000 * votesT.slice(0, -1));
			}
			// Add in commas (to match old format)
			votesT = votesT.replace(/(\d)(\d\d\d)(\d\d\d)$/, '$1,$2,$3').replace(/(\d)(\d\d\d$)/, '$1,$2');
			//console.log('votesT:', votesT);
		}
		// The code below expects arrays (originally returned by string match)
		var ratingM = [ratingT, ratingT + "/10"];
		var votesM = [votesT, votesT];

		//console.log('ratingM', ratingM);
		//console.log('votesM', votesM);

		// This doesn't work on the new version of the site
		//if (/\(awaiting \d+ votes\)|\(voting begins after release\)|in development,/i.test (resp.responseText) ) {
		// hopefully this will work better
		if (ratingT == '' || votesT == '') {
			ratingTxt = "NR";
			isError = false;
			colnumber = 0;
		} else {
			if (ratingM && ratingM.length > 1 && votesM && votesM.length > 1) {
				isError = false;

				justrate = ratingM[1].substr(0, ratingM[1].indexOf("/"));

				// Let's try the metascore instead
				// Not all movied have a metascore
				var metaScoreElem = showMetaScore && doc.querySelector('.score-meta');
				//var metaScore = metaScoreElem && (Number(metaScoreElem.textContent) / 10).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
				var metaScore = metaScoreElem && metaScoreElem.textContent;
				var metaScoreColor = metaScoreElem && metaScoreElem.style.backgroundColor;

				var votes = votesM[1];
				var votesNum = Number(votes.replace(',', '', 'g'));
				var commas_found = (votes.match(/,/g) || []).length;
				if (commas_found === 1) {
					votes = votes.replace(/,\d\d\d$/, 'k');
				} else if (commas_found === 2) {
					votes = votes.replace(/,\d\d\d,\d\d\d$/, 'M');
				}

				// ratingTxt   = ratingM[1] + " - " + votesM[1];
				// We use the element style to override IMDB's reset
				ratingTxt = "<strong style=\"font-weight: bolder\">" + justrate + "</strong>" + " / " + votes;
				//ratingTxt   = "<strong>" + (metaScoreElem ? metaScore : justrate) + "</strong>" + " / " + votes;
				//ratingTxt   = "<strong>" + (metaScoreElem ? metaScore : justrate) + "</strong>" + " / " + votes + (metaScoreElem ? " (" + justrate + "i)" : "" );
				//ratingTxt   = "<strong>" + justrate + "</strong>" + " / " + votes + (metaScoreElem ? " (<strong>" + metaScore + "</strong> meta)" : "" );
				colnumber = Math.round(justrate);
				// If metaScore was found, use that for the colour instead of the IMDB rating.  But since metascores are lower than imdb scores, add 1.5.
				//colnumber = Math.round(metaScoreElem ? metaScore / 10 + 1.5 : justrate);

				//if (metaScoreElem) {
				//    justRate = metaScore / 10;
				//}
			}
		}
	}

	//console.log('ratingTxt', ratingTxt);
	//console.log('justrate', justrate);

	// NOTE: I switched from <b> to <strong> simply because on Season pages, the rating injected after episode titles was getting uglified by an IMDB CSS rule: .list_item .info b { font-size: 15px; }
	//targetLink.setAttribute("title", "Rated " + ratingTxt.replace(/<\/*strong>/g,'').replace(/\//,'by') + " users." );
	targetLink.setAttribute("title", `Rated ${justrate} by ${votes} users.`);

	if (!(justrate > 0)) {
		return;
	}


	// Slowly approach full opacity as votesNum increases.  10,000 votes results in opacity 0.5 (actually 0.6 when adjusted).
	var opacity = 1 - 1 / (1 + 0.0001 * votesNum);
	// Actually let's not start from 0; we may still want to see the numbers!
	opacity = 0.2 + 0.8 * opacity;
	// Don't use too many decimal points; it's ugly!
	//opacity = Math.round(opacity * 10000) / 10000;
	opacity = opacity.toFixed(3);

	var colors = ["#Faa", "#Faa", "#Faa", "#Faa", "#Faa", "#F88", "#Faa", "#ff7", "#7e7", "#5e5", "#0e0", "#ddd"];
	var bgCol = colors[colnumber];
	//var hue = justrate <= 6 ? 0 : justrate <= 8 ? 120 * (justrate - 6) / 2 : 120;
	//var bgCol = `hsla(${hue}, 100%, 60%, ${opacity})`;
	var resltSpan = document.createElement("span");
	// resltSpan.innerHTML = '<b><font style="border-radius: 5px;padding: 1px;border: #575757 solid 1px; background-color:' + color[colnumber] + ';">' + ' [' + ratingTxt + '] </font></b>&nbsp;';
	// resltSpan.innerHTML = '<b><font style="background-color:' + justrate + '">' + ' [' + ratingTxt + '] </font></b>&nbsp;';
	// I wanted vertical padding 1px but then the element does not fit in the "also liked" area, causing the top border to disappear!  Although reducing the font size to 70% is an alternative.
	resltSpan.innerHTML = '&nbsp;<font style="font-weight: normal;font-size: 80%;opacity: ' + opacity + ';border-radius: 3px;padding: 0.1em 0.6em;border: rgba(0,0,0,0.1) solid 1px; background-color:' + bgCol + ';color: black;">' + '' + ratingTxt + '</font>';

	if (showAsStar) {
		resltSpan.innerHTML = `
            <div class="ipl-rating-star" style="font-weight: normal">
                <span class="ipl-rating-star__star">
                    <svg class="ipl-icon ipl-star-icon  " xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                        <path d="M0 0h24v24H0z" fill="none"></path>
                    </svg>
                </span>
                <span class="ipl-rating-star__rating">${justrate}</span>
            </div>
        `;
	}

	if (isError)
		resltSpan.style.color = 'red';

	//var targetLink      = resp.context;
	//console.log ("targetLink: ", targetLink);

	// The "More like this" cards have a vertical flowing grid, so if we want rating and metascore to appear next to each other, they will need a container
	var container = document.createElement('div');
	container.style.display = 'inline-block';
	container.appendChild(resltSpan);

	//targetLink.parentNode.insertBefore (container, targetLink);
	targetLink.parentNode.insertBefore(container, targetLink.nextSibling);

	if (metaScoreElem) {
		// I am reluctant to move an element from another document into this one, multiple times.
		// Therefore we create a new element, like the original.
		var newMetaScoreElem = document.createElement(metaScoreElem.tagName);
		//newMetaScoreElem.outerHTML = metaScoreElem.outerHTML;
		newMetaScoreElem.className = metaScoreElem.className;
		newMetaScoreElem.textContent = metaScoreElem.textContent;
		newMetaScoreElem.style.backgroundColor = metaScoreElem.style.backgroundColor;
		// Missing despite the class.  It seems some pages don't include the .score-meta CSS
		newMetaScoreElem.style.color = 'white';
		newMetaScoreElem.style.padding = '2px';
		//resltSpan.parentNode.insertBefore (newMetaScoreElem, resltSpan.nextSibling);
		//resltSpan.parentNode.insertBefore (document.createTextNode(' '), resltSpan.nextSibling);
		container.appendChild(document.createTextNode(' '));
		container.appendChild(newMetaScoreElem);
	}
}

//--- Create the continue button
var continueBttn = document.createElement("button");
continueBttn.innerHTML = "Get more ratings";

continueBttn.addEventListener("click", function() {
		fetchedLinkCnt = 0;
		continueBttn.style.display = 'none';
		processIMDB_Links();
	},
	false
);

processIMDB_Links();

if (addRatingToTitle) {
	setTimeout(function() {
		// Selectors for old site and new site
		var foundRating = document.querySelectorAll('.ratingValue [itemprop=ratingValue], ' + ratingSelectorNew);
		if (foundRating.length >= 1) {
			var rating = foundRating[0].textContent;
			if (rating.match(/^[0-9]\.[0-9]$/)) {
				document.title = `(${rating}) ` + document.title;
			}
		}
	}, 2000);
}