// ==UserScript==
// @name         ChristianCafe Enhancements
// @namespace    ccenhancements
// @version      1.2
// @description  Provide additional functionality to ChristianCafe.com, primarily in regards to forum usage. This script is useless if not a member.
// @author       BattleOfWits
// @license      MIT
// @match        https://www.christiancafe.com/forums/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432377/ChristianCafe%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/432377/ChristianCafe%20Enhancements.meta.js
// ==/UserScript==

var currentPath = window.location.pathname;
const propertySupport = /^\p{Number}+$/u.test('1');
const urlParams = new URLSearchParams(window.location.search);
const urlHash = (window.location.hash ? window.location.hash.replace(/^#/, '') : null);

const EMOJI_GOOGLE = 1;
const EMOJI_TWIT = 2;
var emojiSrc = EMOJI_GOOGLE;

// loadType should work on many browser versions, used when need to make sure only run a function once, and not on a Back/Forward
var loadType;
try {
	loadType = String(window.performance.getEntriesByType("navigation")[0].type);
} catch (error) {
	switch (performanceNavigation.type) {
		case '0':
			loadType = 'navigate';
			break;
		case '1':
			loadType = 'reload';
			break;
		case '2':
			loadType = 'back_forward';
			break;
		default:
			loadType = 'unknown';
			break;
	}
}

// variables for icons consisting of new posts, if favorited or not
const imgPage = '<svg width="8" height="8" viewBox="0 0 16 16" version="1.1"><path style="stroke:#000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;paint-order:stroke fill" d="m 3,1 h 6 l 4,4 V 15 H 3 Z"/></svg>';
const imgStar = '<svg width="8" height="8" viewBox="0 0 16 16" version="1.1"><path style="stroke:#000;stroke-width:2;paint-order:stroke fill" d="M 8 1.3 C 7.5 1.3 6.7 6 6.3 6.3 C 5.9 6.6 1.2 5.9 1 6.4 C 0.8 6.9 5 9 5.2 9.5 C 5.4 10 3.2 14.3 3.7 14.6 C 4 14.9 7.5 11.6 8 11.6 C 8.5 11.6 11.9 14.9 12.3 14.6 C 12.7 14.3 10.6 10 10.8 9.5 C 11 9 15.2 6.9 15 6.3 C 14.8 5.9 10.2 6.6 9.7 6.3 C 9.3 6 8.5 1.3 8 1.3 z " /></svg>';
const imgPencil = '<svg width="8" height="8" viewBox="0 0 16 16" version="1.1"><path style="stroke:#000;paint-order:fill stroke;stroke-linejoin:round" d="m2.36 15.5 0.175-4.62 7.27-10.4 4.11 2.88-7.27 10.4-4.29 1.75z"/><path d="m7.79 3.38 4.11 2.88" style="stroke-width:1px;stroke:#000"/><path d="m2.54 10.9 4.11 2.88" style="stroke-width:1px;stroke:#000"/></svg>';
const fillNorm = '#fff';
const fillNew = '#5d4037';
// Date/Time settings for parsing
const dateOptionsEastern = {timeZone: 'Canada/Eastern', year: 'numeric', month: 'short', day: 'numeric'};
const dateOptions = {year: 'numeric', month: 'short', day: 'numeric'};
const timeOptionsEastern = {timeZone: 'Canada/Eastern', hour: 'numeric', minute: '2-digit', hour12: true};
const timeOptionsEasternZone = {timeZone: 'Canada/Eastern', timeZoneName: 'short', hour: 'numeric', minute: '2-digit', hour12: true};
const timeOptionsZone = {timeZoneName: 'short', hour: 'numeric', minute: '2-digit', hour12: true};

const emojiRegex = (propertySupport ? /[\u{1F1E6}-\u{1F1FF}]{2}|(?:(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\u200D)*(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu : null);

/**
 * reverse the stringify and return the array values
 */
function GetGMParse(varString) {
	var gv = GM_getValue(varString);
	if (gv) {
		gv = JSON.parse(gv);
	}
	else {
		gv = {};
	}
	return gv;
}

/**
 * Function to combine JSON into the GM_setValue
 */
function SetGMValue(varString, key, value) {
	var gv = GetGMParse(varString);
	gv[key] = value;
	GM_setValue(varString, JSON.stringify(gv));
	return gv;
}

/**
 * Function Parse the Eastern Standard times used by CC to provide a Date object
 */
function CCDateTimeParse(assumedDate) {
	var inParts = assumedDate.trim().split(' @ ');
	var inTime = inParts[1];
	const weekdays = {'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6};
	// If no specific time, on index page, assume '00:00 am' for comparison
	if (!inParts[1]) {
		// CC Times never get down to the second, so specifying 33 seconds shows it is an assumed time
		inParts[1] = '00:00:33 AM';
		assumedDate = assumedDate + ' ' + inParts[1];
	}
	// Firefox doesn't like the @, but Chrome does, so keep it out
	else {
		assumedDate = inParts[0] + ' ' + inParts[1];
	}

	// If Date is a single word, determine actual Date
	if (/^\w+$/.test(inParts[0])) {
		var now = new Date();
		var today = now.toLocaleDateString('en-CA', {timeZone: 'Canada/Eastern', weekday: 'long'});
		var dayDifference = 0;
		switch (inParts[0]) {
			case 'Today':
				dayDifference = 0;
				break;
			case 'Yesterday':
				dayDifference = -1;
				break;
			default:
				dayDifference = (-7 + weekdays[inParts[0]] - weekdays[today]) % 7;
		}
		var then = new Date(now.getTime() + (dayDifference * 24 * 3600 * 1000));
		inParts[0] = then.toLocaleDateString('en-US', dateOptionsEastern);
		assumedDate = inParts[0] + ' ' + inParts[1];
	}

	// Date coming in is EST/EDT. But don't know what yet. Start Assuming EST
	var dateObject = new Date(assumedDate + ' GMT-0500');
	var calcTime = dateObject.toLocaleTimeString('en-US', timeOptionsEastern); // Will be different if actually EDT, same if EST
	// If they are different, add an hour
	if (inTime && calcTime.toUpperCase() != inTime.toUpperCase()) {
		dateObject = new Date(assumedDate + ' GMT-0400');
	}

	return dateObject;
}

/**
 * Function to provide a Date similar to what was parsed in CCDateTimeParse. Eastern time
 */
function DateToCC(dateObject) {
	return dateObject.toLocaleDateString('en-US', dateOptionsEastern) + ' @ ' + dateObject.toLocaleTimeString('en-US', timeOptionsEasternZone);
}
/**
 * Function to provide a Date in the local time format and timezone
 */
function DateToCCLocal(dateObject) {
	return dateObject.toLocaleDateString([], dateOptions) + ' @ ' + dateObject.toLocaleTimeString([], timeOptionsZone);
}
/**
 * Function to get a Unix Epoch format from a JS Date object
 */
function DateToEpoch(dateObject) {
	return dateObject.getTime()/1000;
}
/**
 * Function to get a JS Date object from a Unix Epoch
 */
function EpochToDate(epoch) {
	return new Date(epoch * 1000);
}

/**
 * Function to convert from HTML tags to plain text
 */
function htmlDecode(input) {
	var doc = new DOMParser().parseFromString(input, "text/html");
	return doc.documentElement.textContent;
}

// General call for the Index of all Categories
var IndexPageLoader = function() {
	// Loop through each row that should be a category row
	$("table.table-striped.table-condensed tr table.table-condensed").each(function(index) {
		var categoryAnchor = $(this).find("a[href^='category.jsp'], a[href^='/forums/category.jsp']");
		var threadAnchor = $(this).find("a[href^='thread.jsp'], a[href^='/forums/thread.jsp']");

		var categoryParams = new URLSearchParams(categoryAnchor.attr("href").split('?')[1]);
		var threadParams = new URLSearchParams(threadAnchor.attr("href").split('?')[1]);
		var category = categoryParams.get('id');

		var textAfterAnchor = threadAnchor[0].nextSibling.nodeValue.trim();
		// remove any non word characters to start
		var threadDate = textAfterAnchor.replace(/^\W+/, '');
		var catIndexDate = CCDateTimeParse(threadDate);
		var catIndexDateEpoch = DateToEpoch(catIndexDate);
		var catDeets = GetGMParse('Cat_' + category);

		// Store the name for use in searches
		if (!catDeets.n) {
			SetGMValue('Cat_' + category, 'n', categoryAnchor.text().trim());
		}

		// Add in the post image for each category for new posts or not
		var catPage = $(imgPage);
		catPage.attr('width', 12).attr('height', 12);
		catPage.css('margin-right', '8px');

		// Add in the post or edit image on the thread that is "newest" (may not be newes, may be an edit)
		var threadIcon;
		var threadLinkLastSeen = threadAnchor.attr("href");
		var threadDeets = GetGMParse('Thread_'+category+'_'+threadParams.get('id'));
		if (threadDeets.pg) { threadLinkLastSeen += '&page=' + threadDeets.pg; }

		// If the viewed thread time had to have an assumed hh:mm, comaprisons need to be against this
		if (catDeets.t && catIndexDateEpoch % 10 == 3) {
			// what does this do? Converts the local of the catDeets.t to simply 33 seconds after midnight for that date, Eastern
			catDeets.t = DateToEpoch(CCDateTimeParse(EpochToDate(catDeets.t).toLocaleDateString('en-US', dateOptionsEastern)));
		}
		if (threadDeets.t && catIndexDateEpoch % 10 == 3) {
			// what does this do? Converts the local of the catDeets.t to simply 33 seconds after midnight for that date, Eastern
			threadDeets.t = DateToEpoch(CCDateTimeParse(EpochToDate(threadDeets.t).toLocaleDateString('en-US', dateOptionsEastern)));
		}

		if (catDeets.t && catDeets.t > catIndexDateEpoch) {
			threadIcon = $(imgPencil);
			// If edited, only link to the post directly if it was the last one we saw on that thread before
			if (threadDeets.pid && threadDeets.t == catIndexDateEpoch) { threadLinkLastSeen += '#' + threadDeets.pid; }
		}
		else {
			threadIcon = $(imgPage);
			// Don't want to try pointing to a specific post in all of the edited cases, but fine otherwise
			if (threadDeets.pid) { threadLinkLastSeen += '#' + threadDeets.pid; }
		}

		// Change the path bg color for if a new post or not
		catPage.find('path').attr('fill', catDeets.t && catDeets.t < catIndexDateEpoch ? fillNew : fillNorm);
		threadIcon.find('path').attr('fill', !threadDeets.t || threadDeets.t < catIndexDateEpoch ? fillNew : fillNorm);

		threadIcon.attr('width', 10).attr('height', 10);
		threadIcon.css('margin-right', '4px');

		// Add in the actual icons
		categoryAnchor.prepend(catPage);
		threadAnchor.before($('<a href="' + threadLinkLastSeen + '"></a>').append(threadIcon));
	});
	// These commented out lines are possibly how one could look at all of the Category Names. Perhaps for the search page
	//console.log(GM_listValues().filter((varname) => varname.startsWith("Cat_")));
	//var gmvariables = GM_listValues();
	//console.log(gmvariables.filter((varname) => varname.startsWith("Cat_")));
	//GM_listValues().filter((varname) => varname.startsWith("Cat_")).forEach(function(item) {
	//	console.log('Looking at: ' + item);
	//});
};

// General call for the Category listing
var CategoryPageLoader = function() {
	// Add in Search Field

	// Set the page Title
	var catDeets = GetGMParse('Cat_'+urlParams.get('id'));
	if (catDeets.n) {
		AppendToTitle(': ' + catDeets.n);
	}

	// Loop through each post row to add in link to last post and latest viewed post
	$(".table-condensed > tbody > tr").each(function(index) {
		var threadanchor = $(this).find("td:first-child > a");
		var threadlink = threadanchor.attr("href");
		var lastpostcell = $(this).find("td:nth-child(2)");
		var lastpostcontents = lastpostcell.html();

		// General form: Jul 9/2021 @ 1:45 pm
		var timeRegExp = /^\s*\b(\w{3} \d\d?\/\d{4} @ \d\d?:\d\d (?:am|pm))\b/;
		var matches = lastpostcontents.match(timeRegExp);
		var threadTime;
		// There should be a match, but if re-run on the line and the date/time was already linkified
		if (matches) {
			// Add the link to the last comment in the Last Post column
			threadTime = DateToEpoch(CCDateTimeParse(matches[1]));
			lastpostcontents = lastpostcontents.replace(timeRegExp, "<a href=\"" + threadlink + "&page=last#lastComment\">$1</a> - ");

			// Add in the last post icon based on if favorited, not, or a different post time than stored
			var threadParams = new URLSearchParams(threadlink.split('?')[1]);
			var threadDeets = GetGMParse('Thread_'+threadParams.get('category')+'_'+threadParams.get('id'));
			if (Object.keys(threadDeets).length) {
				// Pick which image to use based on if thread favorited or not
				var threadIcon = $(threadDeets.fav ? imgStar : imgPage).css('margin-right', '5px');

				// Change the path bg color for if a new post or not
				threadIcon.find('path').attr('fill', threadDeets.t < threadTime ? fillNew : fillNorm);
				if (threadDeets.pg) { threadlink += '&page=' + threadDeets.pg; }
				if (threadDeets.pid) { threadlink += '#' + threadDeets.pid; }
				threadanchor.before($('<a href="' + threadlink + '"></a>').append(threadIcon));
			}
		}

		// update the cell contents with what we modified. If no modification done, meh
		lastpostcell.html(lastpostcontents);
	});
	console.log('CCE CategoryPageLoader');
};

// General call for Forum Person Posts Search
var ForumPersonPageLoader = function() {
	// Set the page Title
	let searchTitle = $('.panel-default > .panel-body:first-child h4').first();
	AppendToTitle(': ' + searchTitle.text());
};

// General call for general Forum Search
var ForumSearchPageLoader = function() {
	let searchTerms = (urlParams.has('searchTerm') ? decodeURI(urlParams.get('searchTerm')) : null);
	if (searchTerms) {
		AppendToTitle(': ' + searchTerms);
	}
};

// General call for pages with search results (person.jsp, search.jsp)
var ForumSearchResultsLoader = function() {
	// add in the Category name based on each posts url
	$('.container > .row p.panel-title').each(function(index) {
		var title = $(this);
		var threadAnchor = $(this).find("a[href^='thread.jsp'], a[href^='/forums/thread.jsp']");
		// Some panel-titles may not actually have a thread in it, so only append the Category Name if there was a thread link
		if (threadAnchor.length) {
			var threadParams = new URLSearchParams(threadAnchor.attr("href").split('?')[1]);
			var catDeets = GetGMParse('Cat_'+threadParams.get('category'));
			// Possible to get to the page before the index page saved all the category names
			if (catDeets.n) {
				title.append(' (' + catDeets.n + ')');
			}
		}
	});
};

// General call for the Posting a New Thread. Has a subject area
var PostPageLoader = function() {
	var subjectInput = $('input[name="subject"]');
	subjectInput.attr('maxlength', 45);
	// Add in the message location box. Shouldn't exist, as it is on load.
	var subjectMessage = $('<div id="cce_subjectmessage"></div>');
	subjectInput.after(subjectMessage);
	var regexDoubleQuote = /"/;
	var regexSubjectProblem = /&|[^ -~]/g;
	var subjectProblemFound = null;

	// When the subject is changed, update the messaging
	var UpdateSubjectMessage = function() {
		var newMessages = [];
		var subjectValue = subjectInput.val() + "";
		if (subjectValue.length == 45) {
			newMessages.push('You have the max number of charcters in your Subject (45).');
		}
		if (regexDoubleQuote.test(subjectValue)) {
			newMessages.push('Double quotes (") don\'t work correctly in subjects. Try a single quote (\') instead.');
		}
		if (subjectProblemFound = subjectValue.match(regexSubjectProblem)) {
			newMessages.push('You have included ' + (subjectProblemFound.length == 1 ? 'a character' : 'characters') + ' that may show incorrectly on the thread listing: ' + subjectProblemFound.join());
		}
		subjectMessage.html(newMessages.join('<br />'));
	};
	subjectInput.change(UpdateSubjectMessage);
	subjectInput.keypress(UpdateSubjectMessage);
};

// General call for the Responding to a specific post. Provide citation.
var RespondPageLoader = function() {
	var page = urlParams.get('page');
	var time = urlParams.get('time');
	// only adding in a citation in provided a page to link to, and not a navigate back/forward (don't want to undo what was modified before)
	if (loadType !== 'back_forward' && (page || time)) {
		var inputField = $('textarea[name=content]');
		var inputLines = inputField.val().split("\n");
		// if not provided the page, a link to post won't work
		var linkPost = (page ? '/forums/thread.jsp?id='+urlParams.get('threadId')+'&category='+urlParams.get('categoryId')+'&page='+page+'#post'+urlParams.get('postId') : '');
		// If not provided a time, just call it the Original Post
		var citeText = (time ? DateToCC(new Date(time)) : 'Original Post');
		// Add in the citation line (only gets here if there is either a page and/or a time)
		var citeLine = '[size=.8em]\u00A0\u00A0\u00A0 [i]<Citation: ' + (page ? '[url=' + linkPost + ']' + citeText + '[/url]' : citeText) + '>[/i][/size]';
		inputLines[0] = inputLines[0] + citeLine;
		//inputLines.push('', '[size=x-small]Citation auto generated by [url=/forums/thread.jsp?id=34772&category=38]ChristianCafe Enhancements[/url].[/size]');
		inputField.val(inputLines.join("\n"));
	}

	// If quoting the First Post, need a button to fix some CC bugs on FPs
	if (urlParams.has('fp')) {
		//var fpFixButton = $('<input type="button" class="btn btn-lg btn-default" value="First Post Fix" title="Update formatting of a first post to fix HTML tags improperly added." style="float:right">');
		//fpFixButton.click(cce_fpfix_reply_click);
		//$('input[type=submit]:first-of-type').after(fpFixButton);
	}
};

// General call for Editing an existing post. Used as a bug fix.
var EditPageLoader = function() {
	var page = urlParams.get('requestedPage');
	if (!page && urlParams.has('page')) { page = urlParams.get('page'); } // backup option
	if (page) {
		// Don't need to edit the landing page after editing a post, just pass on what the requestedPage would be, to fix the page=-1
		// there is no form object on the landing page after post action
		$('form').each(function() {
			if ($(this).attr('action') === 'edit.jsp') {
				$(this).attr('action', 'edit.jsp?requestedPage=' + page);
			}
		});
	}
	// If editing the First Post, need a button to fix some CC bugs on FPs
	if (urlParams.has('fp')) {
		var fpFixButton = $('<input type="button" class="btn btn-lg btn-default" value="First Post Fix" title="Update formatting of a first post to fix HTML tags improperly added." style="float:right">');
		fpFixButton.click(cce_fpfixclick);
		$('input[type=submit][value=Submit]:first-of-type').after(fpFixButton);
	}
};

// General call for loading up the Thread view
var ThreadPageLoader = function() {
	// Store the last post of thread if it is seen
	var elementPagination = $('.pagination').first();
	var elementPaginationLast = elementPagination.find('[aria-label=Last]');
	var storageString = 'Thread_' + urlParams.get('category') + '_' + urlParams.get('id');
	var storageCategory = 'Cat_' + urlParams.get('category');
	var threadStored = GetGMParse(storageString);
	var categoryStored = GetGMParse(storageCategory);
	var currentPage = parseInt(elementPagination.find('li.active').text());
	var urlParamPage = (urlParams.has('page') ? Number(urlParams.get('page')) : 1);
	var lastPostAnchor = $('a[name^="post"]').last();
	var lastPid = lastPostAnchor.attr('name');
	var postDate;
	var newTime;
	var foundNewer = false;
	let errMsg = new Array();
	let threadTitle = $('.panel-default > .panel-body:first-child h4').first();
	let threadTitleContainer = threadTitle.closest('.container');

	AppendToTitle(threadTitle.text().trim());

	// Modify each post row slightly to do such things as:
	//  Add a link to itself
	//  Update the quote button to help with the Citations added by RespondPageLoader()
	var threadURL = currentPath+'?id='+urlParams.get('id')+'&category='+urlParams.get('category')+'&page='+currentPage;
	$('a[name^="post"]').each(function(index) {
		var anchor = $(this);
		var title = anchor.next('div.row').find('p.panel-title');
		// do the rest after verifying that there is a new row that has a post item in it
		if (title.length) {
			// Add in link to the post itself
			postDate = CCDateTimeParse(title.text().trim());
			title.html('<a href="'+threadURL+'#'+anchor.attr('name')+ '">' + title.text().trim() + '</a>' + ' - (' + DateToCCLocal(postDate) + ')');
			// append the current page number and the time this post comes from for citations
			var quoteLink = anchor.next('div.row').find('.panel-footer a.btn[href^="respond.jsp"], .panel-footer a.btn[href^="/forums/respond.jsp"]');
			quoteLink.attr('href', quoteLink.attr('href') + '&page=' + currentPage + '&time=' + postDate.toJSON());
			// append a "fp" URL search param to edit and quote if on first page and is the first post
			if (index == 0 && currentPage == 1) {
				var editLink = anchor.next('div.row').find('.panel-footer a.btn[href^="edit.jsp"], .panel-footer a.btn[href^="/forums/edit.jsp"]');
				if (editLink.length) {
					editLink.attr('href', editLink.attr('href') + '&fp');
				}
				quoteLink.attr('href', quoteLink.attr('href') + '&fp');
			}

			// check to see if we are looking at a new post, so we can add in an indicator
			if (!foundNewer && threadStored.t && threadStored.t < DateToEpoch(postDate)) {
				anchor.before('<div class="panel panel-info"><div class="panel-heading"><a name="newPosts"/>New Posts</div></div>');
				foundNewer = true;
			}
		}
	});

	// Possibly may be sent to a page that doesn't exist. If the active page is different from that in the URL, alert
	// user and give a means to redirect to the last page.
	if (urlParamPage && currentPage == '1' && urlParamPage != 1) {
		errMsg.push("Page " + urlParamPage + " of this thread doesn't exist.");
		let linkUrlParams = urlParams;
		linkUrlParams.set('page', 'last');
		let linkUrl = '/forums/thread.jsp?' + linkUrlParams.toString();

		// If a post had been linked to before, attempt to go to that post when it moves to the last page.
		if (window.location.hash) {
			errMsg.push("The post linked to may exist on a previous page, or it may have been deleted.");
			linkUrl += window.location.hash;
		}
		errMsg.push('Click <a href="' + linkUrl + '">to view the last page of posts</a>.');
	}

	// clear out old pid if on page with the pid, and post no longer exists. This will let it get set later
	if (threadStored.pg == currentPage && threadStored.pid && $('a[name='+threadStored.pid+']').length == 0) {
		if (threadStored.pid == urlHash) {
			errMsg.push("The post you are looking for has been deleted.")
			if (foundNewer) {
				errMsg.push('As this was the most recent post you had seen before, you may <a href="#newPosts">go to the newest posts since you were here last</a>.');
			}
		}

		threadStored.pid = null;
	}

	// Update the last page seen in the thread if it is greater than the last one stored, or simply we are on the last page (for when posts get deleted)
	if (!threadStored.pg || threadStored.pg < currentPage || elementPaginationLast.parent().hasClass('disabled')) {
		SetGMValue(storageString, 'pg', currentPage);
		threadStored.pg = currentPage;
	}

	// Now update the pid and time if we hadn't stored it before (or deleted), or if on a larger value
	if (!threadStored.pid || threadStored.pid < lastPid || !threadStored.t) {
		newTime = DateToEpoch(postDate);
		SetGMValue(storageString, 'pid', lastPid);
		SetGMValue(storageString, 't', newTime);

		// Update Category last seen post time
		if (!categoryStored.t || categoryStored.t < newTime) {
			SetGMValue(storageCategory, 't', newTime);
		}
	}

	// Add the Favorite button at the top of the page
	var paginationParentCol = elementPagination.closest('.col-md-8');
	if (paginationParentCol.length) {
		// Make the "Page x of x" first column smaller to allow for a new favorite column
		paginationParentCol.siblings('.col-md-4').removeClass('col-md-4').addClass('col-md-3');

		// The favorite "button" will be the star, but just larger, and not quite a button
		var favStar = $(imgStar).attr('id', 'cce_favbutton');
		favStar.attr('width', 20).attr('height', 20);
		favStar.css('cursor', 'pointer');
		favStar.css('margin', '6 0');
		// Add in a new column that will include the fake "button" div/img
		paginationParentCol.after('<div class="col-md-1" align="center"><div class="panel panel-default"><div class="panel-body">' + favStar[0].outerHTML + '</div></div></div>');
	}
	// When all done, make sure the favorite star has the correct current status
	UpdateFavButton(storageString, threadStored);

	// #lastComment anchor isn't actually to the last comment, but to the end of the page. Looks odd when
	// the actual last comment is long. Move that anchor to right after the anchor for actual last comment
	if (lastPostAnchor.length) {
		lastPostAnchor.after($('a[name="lastComment"]'));
	}

	// if any items have been added to the errMsg, display them.
	if (errMsg.length) {
		if (threadTitleContainer.length) {
			threadTitleContainer.before('<div class="container"><div class="panel panel-warning"><div class="panel-heading">' + errMsg.join("<br />\n") + '</div></div></div>');
		}
	}
};

// Call to change photos to lightbox link from the profile link
var ProfilePhotoToLightbox = function() {
	// Change poster photos to be clickable bringing up full image
	$('a[href^="/profile/"] > div.img').each(function() {
		var bgImage = $(this).css('background-image');
		var matches;
		if (matches = bgImage.match(/^url\("(.+)"\)$/)) {
			bgImage = matches[1];
		}
		var parent = $(this).parent('a');
		if (parent.length) {
			var userName = parent.nextAll('a').first().text();
			parent.attr('href', bgImage);
			parent.attr('data-lightbox', "postprofile");
			parent.attr('data-title', userName);
		}
	});
};

/**
 * Placed the Favorite button on the top of each thread. This is called after updating a thread's favorite status
 */
function UpdateFavButton(varString, threadDetails) {
//	var buttonFav = $('input[name=cce_favbutton]');
	var buttonFav = $('svg#cce_favbutton');
	if (buttonFav.length) {
		if (threadDetails.fav) {
			//buttonFav.val('Un-Favorite');
			buttonFav.parent().attr('title', 'Un-Favorite');
			buttonFav.find('path').attr('fill', fillNew);
			buttonFav.click({var: varString, key: 'fav', value: 0}, cce_setvalue);
		}
		else {
			//buttonFav.val('Make Favorite');
			buttonFav.parent().attr('title', 'Make Favorite');
			buttonFav.find('path').attr('fill', fillNorm);
			buttonFav.click({var: varString, key: 'fav', value: 1}, cce_setvalue);
		}
	}
}

// JS function to convert BBCode and HTML code - https://coursesweb.net/javascript/convert-bbcode-html-javascript_cs
// Only used for Preview functionality when posting/editing
var BBCodeHTML = function() {
	var me = this;						// stores the object instance
	var token_match = /{[A-Z_]+[0-9]*}/ig;

	// regular expressions for the different bbcode tokens
	var tokens = {
		'URL' : '((?:(?:[a-z][a-z\\d+\\-.]*:\\/{2}(?:(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+|[0-9.]+|\\[[a-z0-9.]+:[a-z0-9.]+:[a-z0-9.:]+\\])(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)|(?:www\\.(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)))',
		'LINK' : '([a-z0-9\-\./]+[^"\' ]*)',
		'EMAIL' : '((?:[\\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*(?:[\\w\!\#$\%\'\*\+\-\/\=\?\^\`{\|\}\~]|&)+@(?:(?:(?:(?:(?:[a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(?:\\d{1,3}\.){3}\\d{1,3}(?:\:\\d{1,5})?))',
		'TEXT' : '(.*?)',
		'SIMPLETEXT' : '([a-zA-Z0-9-+.,_ ]+)',
		'INTTEXT' : '([a-zA-Z0-9-+,_. ]+)',
		'IDENTIFIER' : '([a-zA-Z0-9-_]+)',
		'COLOR' : '([a-z]+|#[0-9abcdef]+)',
		'NUMBER'	: '([0-9]+)'
	};

	var bbcode_matches = [];          // matches for bbcode to html
	var html_tpls = [];               // html templates for bbcode to html

	/**
	 * Turns a bbcode into a regular rexpression by changing the tokens into
	 * their regex form
	 */
	var _getRegEx = function(str) {
		var matches = str.match(token_match);
		var nrmatches = matches.length;
		var i = 0;
		var replacement = '';

		if (nrmatches <= 0) {
			return new RegExp(preg_quote(str), 'g');				// no tokens so return the escaped string
		}

		for(; i < nrmatches; i += 1) {
			// Remove {, } and numbers from the token so it can match the
			// keys in tokens
			var token = matches[i].replace(/[{}0-9]/g, '');

			if (tokens[token]) {
				// Escape everything before the token
				replacement += preg_quote(str.substr(0, str.indexOf(matches[i]))) + tokens[token];

				// Remove everything before the end of the token so it can be used
				// with the next token. Doing this so that parts can be escaped
				str = str.substr(str.indexOf(matches[i]) + matches[i].length);
			}
		}

		replacement += preg_quote(str);			// add whatever is left to the string

		return new RegExp(replacement, 'gi');
	};

	/**
	 * Turns a bbcode template into the replacement form used in regular expressions
	 * by turning the tokens in $1, $2, etc.
	 */
	var _getTpls = function(str) {
		var matches = str.match(token_match);
		var nrmatches = matches.length;
		var i = 0;
		var replacement = '';
		var positions = {};
		var next_position = 0;

		if (nrmatches <= 0) {
			return str;		   // no tokens so return the string
		}

		for(; i < nrmatches; i += 1) {
			// Remove {, } and numbers from the token so it can match the
			// keys in tokens
			var token = matches[i].replace(/[{}0-9]/g, '');
			var position;

			// figure out what $# to use ($1, $2)
			if (positions[matches[i]]) {
				position = positions[matches[i]];     // if the token already has a position then use that
			} else {
				// token doesn't have a position so increment the next position
				// and record this token's position
				next_position += 1;
				position = next_position;
				positions[matches[i]] = position;
			}

			if (tokens[token]) {
				replacement += str.substr(0, str.indexOf(matches[i])) + '$' + position;
				str = str.substr(str.indexOf(matches[i]) + matches[i].length);
			}
		}

		replacement += str;

		return replacement;
	};

	/**
	 * Adds a bbcode to the list
	 */
	me.addBBCode = function(bbcode_match, bbcode_tpl) {
		// add the regular expressions and templates for bbcode to html
		bbcode_matches.push(_getRegEx(bbcode_match));
		html_tpls.push(_getTpls(bbcode_tpl));
	};

	/**
	 * Turns all of the added bbcodes into html
	 */
	me.bbcodeToHtml = function(str) {
		var nrbbcmatches = bbcode_matches.length;
		var i = 0;

		for(; i < nrbbcmatches; i += 1) {
			// Limit while iterations to prevent infinite loop
			let lim = 0;
			while (lim < 10 && bbcode_matches[i].test(str)) {
				str = str.replaceAll(bbcode_matches[i], html_tpls[i]);
				lim += 1;
			}
		}

		return str;
	};

	/**
	 * Quote regular expression characters plus an optional character
	 * taken from phpjs.org
	 */
	function preg_quote (str, delimiter) {
		return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
	}

	// adds BBCodes and their HTML
	// Adding escapes to bbcode so can paste in a thread that would otherwise parse
	me.addBBCode('[b\]{TEXT}[/b\]', '<span style="font-weight:bold;">{TEXT}</span>');
	me.addBBCode('[i\]{TEXT}[/i\]', '<span style="font-style:italic;">{TEXT}</span>');
	me.addBBCode('[u\]{TEXT}[/u\]', '<span style="text-decoration:underline;">{TEXT}</span>');
	me.addBBCode('[s\]{TEXT}[/s\]', '<span style="text-decoration:line-through;">{TEXT}</span>');
	// CC isn't very precise on url tags, not looking for urls that look like urls
	me.addBBCode('[url\={TEXT1}\]{TEXT2}[/url\]', '<a href="{TEXT1}" target="_blank">{TEXT2}</a>');
	me.addBBCode('[url\]{TEXT}[/url\]', '<a href="{TEXT}" target="_blank">{TEXT}</a>');
	me.addBBCode('[url\={LINK}\]{TEXT}[/url\]', '<a href="{LINK}" target="_blank">{TEXT}</a>');
	me.addBBCode('[url\]{LINK}[/url\]', '<a href="{LINK}" target="_blank">{LINK}</a>');
	me.addBBCode('[img\]{URL}[/img\]', '<img src="{URL}" class="img img-responsive" />');
	me.addBBCode('[img\]{LINK}[/img\]', '<img src="{LINK}" class="img img-responsive" />');
	//me.addBBCode('[color\={COLOR}\]{TEXT}[/color\]', '<span style="color:{COLOR};">{TEXT}</span>');
	me.addBBCode('[color\={TEXT1}\]{TEXT2}[/color\]', '<span style="color:{TEXT1};">{TEXT2}</span>');
	//me.addBBCode('[size\={SIMPLETEXT}\]{TEXT}[/size\]', '<span style="font-size:{SIMPLETEXT};">{TEXT}</span>');
	me.addBBCode('[size\={TEXT1}\]{TEXT2}[/size\]', '<span style="font-size:{TEXT1};">{TEXT2}</span>');
	me.addBBCode('[quote\={TEXT1}\]{TEXT2}[/quote\]', '<blockquote style="font-size: 13px;"><i class="fa fa-quote-left"></i> Original post by <a class="text1forum" href="/profile/?MemberName={TEXT1}"><b>{TEXT1}</b></a>:<br>{TEXT2}</blockquote>');
	me.addBBCode('[quote\]{TEXT}[/quote\]', '<blockquote style="font-size: 13px;">{TEXT}</blockquote>');
};
var bbcodeParser = new Object(); // creating a generic object, as not normally used unless page will have a Preview mode

// General call for loading up the New/Edit Post view
var NewEditPost = function() {
	var categoryId = $('input[name="categoryId"]').val();
	var catDeets = {};
	if (categoryId) {
		catDeets = GetGMParse('Cat_' + categoryId);
	}
	var breadcrumbND = $('ol.breadcrumb li').last();
	if (catDeets.n) {
		breadcrumbND.before('<li><a href="/forums/category.jsp?id=' + categoryId + '">' + catDeets.n + '</a></li>');
		AppendToTitle(catDeets.n);
	}

	// Append the Thread Title to the Page Title (if there is one, so not New Post)
	var threadTitle = $('.panel-heading > .panel-title').text();
	if (currentPath != '/forums/post.jsp') {
		threadTitle = threadTitle.replace('Subject: ', ' : ');
		AppendToTitle(threadTitle);
	}

	bbcodeParser = new BBCodeHTML(); // instantiate the object, but only if adding a Preview functionality
	// Find the submit button to place the preview button before
	// In case of edit.jsp: type=submit, value=Submit
	// In case of respond.jsp: type=submit, value=Yes - Post Response
	// In case of post.jsp: type=submit, value=Post New Discussion, Lower than desired
	var previewButton = $('<input type="button" class="btn btn-lg btn-default" value="Preview" style="margin-right: 15px;">');
	previewButton.click(cce_previewclick);
	var submitButton;
	switch(currentPath) {
		case '/forums/edit.jsp':
			submitButton = $('input[type=submit][value=Submit]:first-of-type');
			break;
		case '/forums/respond.jsp':
			submitButton = $('input[type=submit][value="Yes - Post Response"]:first-of-type');
			break;
		case '/forums/post.jsp':
			submitButton = $('input[type=submit][value="Post New Discussion"]:first-of-type');
			break;
	}
	submitButton.before(previewButton);

	// Prior to full submit, do some replacements (such as leading spaces)
	submitButton.click(cce_submitclick);

	if (propertySupport) {
		var emojiReplaceButton = $('<input type="button" class="btn btn-lg btn-default" value="Emoji Replace" title="Replace Emojis with image tags" style="float:right; margin-left:15px">');
		emojiReplaceButton.click(cce_emojireplace_click);
		submitButton.after(emojiReplaceButton);
	}

	var smartQuoteReplaceButton = $('<input type="button" class="btn btn-lg btn-default" value="Smart Quote Replace" title="Replace Smart Quotes with Flat Quote" style="float:right; margin-left:15px">');
	smartQuoteReplaceButton.click(cce_smartquotereplace_click);
	submitButton.after(smartQuoteReplaceButton);
};

/**
 * Call from 'Preview' button for onClick to create preview area if required, and populate
 * with a close version of what would be posted
 */
function cce_previewclick() {
	var previewField = $('#cce_preview');
	var contentField = $('textarea[name=content], textarea[name=body]');
	var contentValue = contentField.val();
	// Create a new preview field if it doesn't exist
	if (previewField.length == 0) {
		previewField = $('<div id="cce_preview" class="col-md-10" style="background: #fff; border: 1px solid #eee; padding: 15px; margin-top: 15px;"></div>');
		contentField.parent().append(previewField);
	}

	// the next line only there because CC uses UTF-8 in some locations, and ISO-8859-1 in others for forums. We want an accurate preview
	contentValue = contentValue.replace(/[^\u0000-\u00FF]/gu, function(inchar) { return "&#"+inchar.codePointAt(0)+";" });

	// Value in the input needs to get html values to escape characters, as well as deal with double and single quotes
	contentValue = $('<div/>').text(contentValue).html().replace(/"/g, "&quot;").replace(/'/g, "&apos;");

	var previewValue = SpacesReplace(contentValue);
	// Do bbcode parsing after replacing the newline with br (easier handling of multiline)
	previewValue = bbcodeParser.bbcodeToHtml(previewValue.replace(/\n/g,"<br>"));
	previewField.html(previewValue);
}

/**
 * Call from 'Submit' type button for onClick to modify the text before submitting.
 * For now, update the leading spaces to be non-breaking.
 */
function cce_submitclick() {
	var contentField = $('textarea[name=content], textarea[name=body]');
	var contentValue = contentField.val();
	contentField.val(SpacesReplace(contentValue));
}

/**
 * Call from 'First Post Fix' button for editing a first post to fix CC introduced problems.
 */
function cce_fpfixclick() {
	var contentField = $('textarea[name=content], textarea[name=body]');
	var contentValue = contentField.val();
	contentField.val(EscapeCodeReplace(contentValue));
	contentField.focus();
}

/**
 * Call from 'First Post Fix' button for quoting a first post to fix CC introduced problems.
 */
function cce_fpfix_reply_click() {
	var contentField = $('textarea[name=content], textarea[name=body]');
	var contentValue = contentField.val();
	contentValue = contentValue.replace(/(\[quote.*\])([\s\S]+)(\[\/quote\])/gm, function(m, pre, s, post) { return pre + EscapeCodeReplace(s) + post });
	contentField.val(contentValue);
	contentField.focus();
}

/**
 * Call from 'Emoji Replace' button for converting emojis to bbcode.
 */
function cce_emojireplace_click() {
	var contentField = $('textarea[name=content], textarea[name=body]');
	var contentValue = contentField.val();
	contentField.val(EmojiReplace(contentValue));
	contentField.focus();
}

/**
 * Call from 'Smart Quote Replace' button for converting pasted smart quotes to flat quotes.
 */
function cce_smartquotereplace_click() {
	var contentField = $('textarea[name=content], textarea[name=body]');
	var contentValue = contentField.val();
	contentField.val(SmartQuoteReplace(contentValue));
	contentField.focus();
}

/**
 * replace instances of &amp; with &, &quot; with ", &#164; with ¤, and similar
 * CC does too many escapes on the first post at times. A Bug workaround.
 */
function EscapeCodeReplace(input) {
	return input.replace(/(&#\w+;|&\w+;)/g, htmlDecode);
}

/**
 * replaces instances of smart quotes ‘’ “” with flat quotes ' ", since CC doesn't like the unicode
 */
function SmartQuoteReplace(input) {
/*
	input = input.replace(/(?:&#8216;|&#8217;|‘|’)/gm, "'");
	input = input.replace(/(?:&#8220;|&#8221;|“|”)/gm, '"');
	input = input.replace(/(?:&#8212;|—)/gm, '--');
	input = input.replace(/(?:&#8211;|–)/gm, '-');
*/
	input = input.replace(/(?:&#8216;|&#8217;|&#8220;|&#8221;|&#8211;|&#8212;|[‘’“”–—])/gm, function(m, c) {
		var retval = null;
		switch (m) {
			case '&#8216;':
			case '&#8217;':
			case '‘':
			case '’':
				retval = "'";
				break;
			case '&#8220;':
			case '&#8221;':
			case '“':
			case '”':
				retval = '"';
				break;
			case '&#8211;':
			case '–':
				retval = '-';
				break;
			case '&#8212;':
			case '—':
				retval = '--'
				break;
		}
		return retval;
	});
	return input;
}

/**
 * replace the spaces and tabs to start a line with non-breaking spaces
 * tab is set to 4 spaces, not worried about columns with normal spaces preceding
 */
function SpacesReplace(input) {
	return input.replace(/(^|\n|\[quote.*\])([ \t]+)/g, function(m, p, s) { return p + s.replace(/ /g, "\u{a0}").replace(/\t/g, "\u{a0}".repeat(4)) });
}

/**
 * Convert Emojis and CC converted emojis into images that work inline
 * End result: [size=inherit;display:inline-block;width:2em;vertical-align:-33%][img]https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/231a.png[/img][/size]
 */
function EmojiReplace(input, replyedit) {
	// first, clean up any Escape Codes, so we can work on compiled emojis
	input = EscapeCodeReplace(input);
	var urlStart;
	let match;
	if (emojiSrc == EMOJI_GOOGLE) {
		urlStart = 'https://raw.githubusercontent.com/googlefonts/noto-emoji/master/png/72/emoji_u';
		// github site doesn't hold the country flag emojis, but below doesn't handle newer emojis
		//urlStart = 'https://noto-website-2.storage.googleapis.com/emoji/emoji_u';
	}
	else if (emojiSrc == EMOJI_TWIT) {
		urlStart = 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/';
	}
	// emojiRegex is already compiled, so do the replacements of the matches (non-capture), to hex and bbcode tags
	return input.replace(emojiRegex, function(match) {
		var compiledCodes = [];
		var emojiURL;
		[...match].forEach((point) => {
			if (!(emojiSrc == EMOJI_GOOGLE && point == '\uFE0F')) {
				compiledCodes.push(point.codePointAt(0).toString(16));
			}
		});

		// However, if there are only 2 code points for Twitter, \uFE0F isn't actually used (but is if more than 2)
		if (emojiSrc == EMOJI_TWIT && compiledCodes.length == 2 && compiledCodes[1] == 'fe0f') {
			compiledCodes.pop();
		}

		// Deal with Google and [\u{1F1E6}-\u{1F1FF}]{2}. The URL for reliability is different for the flags.
		if (emojiSrc == EMOJI_GOOGLE && compiledCodes.length == 2
			&& Number('0x'+compiledCodes[0]) >= 0x1F1E6 && Number('0x'+compiledCodes[0]) <= 0x1F1FF
			&& Number('0x'+compiledCodes[1]) >= 0x1F1E6 && Number('0x'+compiledCodes[1]) <= 0x1F1FF)
		{
			emojiURL = 'https://noto-website-2.storage.googleapis.com/emoji/emoji_u' + compiledCodes.join('_');
		}
		else {
			emojiURL = urlStart + compiledCodes.join(emojiSrc == EMOJI_GOOGLE ? '_' : '-');
		}
		return '[size=inherit;display:inline-block;width:2em;vertical-align:-33%][img]' + emojiURL + '.png[/img][/size]';
	});
}

/**
 * Callback function for when adding a button function using jQuery
 * For now, only will do something based on changing favorite/'fav' status
 */
function cce_setvalue(event) {
	var gv = SetGMValue(event.data.var, event.data.key, event.data.value);
	if (event.data.key == 'fav') {
		UpdateFavButton(event.data.var, gv);
	}
}

/**
 * Append a string to the Page Title to make the tabs easier to distinguish
 * Will also Shorted "ChristianCafe.com:" into just "CCc:"
 */
function AppendToTitle(string) {
	var title = document.title.replace('ChristianCafe.com', 'CCc');
	title = title + " " + string;
	document.title = title;
}

/**
 * This will switch on any page load to the load up the applicable functions
 */
function PageLoadSwitch() {
	switch(currentPath) {
		case '/forums/':
		case '/forums':
		case '/forums/index.jsp':
			IndexPageLoader();
			break;
		case '/forums/category.jsp':
			CategoryPageLoader();
			break;
		case '/forums/thread.jsp':
			ThreadPageLoader();
			ProfilePhotoToLightbox();
			break;
		case '/forums/post.jsp':
			PostPageLoader();
			NewEditPost();
			break;
		case '/forums/respond.jsp':
			RespondPageLoader();
			NewEditPost();
			break;
		case '/forums/edit.jsp':
			EditPageLoader();
			NewEditPost();
			break;
		case '/forums/person.jsp':
			ForumPersonPageLoader();
			ForumSearchResultsLoader();
			ProfilePhotoToLightbox();
			break;
		case '/forums/search.jsp':
			ForumSearchPageLoader();
			ForumSearchResultsLoader();
			ProfilePhotoToLightbox();
			break;
	}

	clearTimeout(loadTimeout);
	console.log('ChristianCafe Enhancements Loaded');
}

// Add in style sheet changes (letting anchors not get covered by the header bar)
GM_addStyle('a[name]:before { display: block; content: " "; margin-top: -60px; height: 60px; visibility: hidden; }');

// Issue with on load event not getting triggered, normally on page back (some return value on CC?) 2 second work around
// if the onLoad does happen, the timeout will clear, so no double execution
let loadTimeout;
function LoadWorkaround() {
	loadTimeout = setTimeout(PageLoadSwitch, 2000);
}

window.addEventListener('load', PageLoadSwitch, true);
LoadWorkaround();
