// ==UserScript==
// @name           Twitter last read
// @namespace      http://armeagle.nl
// @description    Keep track of your read tweets.
// @include        http*://twitter.com/*
// @version        2.8
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/3027/Twitter%20last%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/3027/Twitter%20last%20read.meta.js
// ==/UserScript==

// This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License by Alex Haan (http://creativecommons.org/licenses/by-nc-sa/3.0/)

/*
 - Adds buttons to the top tab list (with the Home and Connect buttons). Clicking the icon on the left that mark all (visible) tweets as read and stores that. Upon clicking the second icon the right the page will scroll down until the last read tweet is found (or stops at the 100th tweet).

Whenever read tweets are loaded and displayed they will be marked (background color changed). Also works separately on the notifications tab.

 - Hides "While you were away" and "Who to follow" sections.
 - Adds overlay to embedded YouTube videos so you can simply open them in a new tab/window. Can be disabled with the 'addYoutubeOverlay' setting.

 - Only tested on Firefox.
*/

function DOM_script() {
	// 2014-08-13: Twitter introduced (more) hotkeys that now break normal interaction (Ctrl+r), fixing that!
	window.addEventListener("keypress", function(event) { event.stopPropagation(); }, true);
	
//	var script = document.getElementsByTagName('head')[0].appendChild(document.createElement('script'));
//	script.setAttribute('type', 'text/javascript');
//	return script.textContent=DOM_script.toString().replace(/[\s\S]*"\$1"\);([\s\S]*)}/,"$1");

	// create container Object to prevent variables and function from going global
	var AEG = {};
	// Whether to show the confirm dialog when marking tweets read (for when the last-read tweet isn't loaded).
	AEG.markTweetsUseConfirm = true;
	// Whether to add an overlay to embedded YouTube videos that forces opening of the youtube video in a new tab.
	AEG.addYoutubeOverlay = true;

	AEG.debug = false;
	// is scrolling
	AEG.isScrolling = false;
	// prevent (near) infinite loops when scrolling to last read tweet
	AEG.maxScrollInjects = 100;
	// counter for above
	AEG.countScrollInjects = -1;
	// timeout, so not calling scrollintoview too often, reset on new inject and start new timer
	AEG.scrollInjectTimer = null;

	AEG.streamItemCount = -1;

	/* Hook on nodeinsert events for the timeline
	 *  Do it a few steps up, cause switching 'tabs' causes it to rebuild the tree.
	 *  Checking for the actualy tweet elements anyway.
	 */
	//document.querySelector('.stream-manager')
	//alert(document.getElementsByTagName("body")[0]);
	document.getElementsByTagName("body")[0].addEventListener("DOMNodeInserted", function(event) {AEG.tweetInsertHandler(event)}, false);

	AEG.addButtonBar = function() {
		// add "Mark All Read" to the top of the timeline, next to the Tweets header
		var buttonbar = document.querySelector('#global-actions');
		var li_buttonbar = document.createElement('li');
		li_buttonbar.setAttribute('id', 'AEG-button-bar');

		var li_buttonbar_box = document.createElement('div');
		li_buttonbar_box.className = 'box';

		var li_markall = document.createElement('i');
		li_markall.className = 'button';
		li_markall.setAttribute('id', 'mark-all');
		li_markall.setAttribute('title', 'Mark all tweets read');
		li_buttonbar_box.appendChild(li_markall);
		var li_scrolltolast = document.createElement('i');
		li_scrolltolast.className = 'button';
		li_scrolltolast.setAttribute('id', 'scroll-to-last');
		li_scrolltolast.setAttribute('title', 'Scroll to last read tweet');
		li_buttonbar_box.appendChild(li_scrolltolast);

		li_buttonbar.appendChild(li_buttonbar_box);

		buttonbar.appendChild(li_buttonbar);

		li_scrolltolast.addEventListener('click', function(event) {AEG.scrollToLastReadHandler(event)}, false);
		li_markall.addEventListener('click', function(event) {AEG.setLastRead(event)}, false);
	}

	AEG.addButtonBarOrig = function() {
		// add "Mark All Read" to the top of the timeline, next to the Tweets header
		var buttonbar = document.querySelector('#global-actions');

		var li_buttonbar = document.createElement('li');
		li_buttonbar.setAttribute('id', 'AEG-button-bar');

		var li_buttonbar_box = document.createElement('div');
		li_buttonbar_box.className = 'box';

		var li_markall = document.createElement('i');
		li_markall.className = 'button';
		li_markall.setAttribute('id', 'mark-all');
		li_markall.setAttribute('title', 'Mark all tweets read');
		li_buttonbar_box.appendChild(li_markall);
		var li_scrolltolast = document.createElement('i');
		li_scrolltolast.className = 'button';
		li_scrolltolast.setAttribute('id', 'scroll-to-last');
		li_scrolltolast.setAttribute('title', 'Scroll to last read tweet');
		li_buttonbar_box.appendChild(li_scrolltolast);

		li_buttonbar.appendChild(li_buttonbar_box);

		buttonbar.appendChild(li_buttonbar);

		li_scrolltolast.addEventListener('click', function(event) {AEG.scrollToLastReadHandler(event)}, false);
		li_markall.addEventListener('click', function(event) {AEG.setLastRead(event)}, false);
	}

	AEG.tweetInsertHandler = function(event) {
		var tweet = event.target;
		if ( ! tweet || ! tweet.className || tweet.className.indexOf("stream-item") < 0) {
			return;
		}
		//AEG.quotedRetweetLinkifier(tweet);
		// mark if old
		var lastReadID = AEG.getLastUrlReadID();
		if ( lastReadID != null ) {
			AEG.testAndMarkTweet(tweet, MyBigNumber(lastReadID));
			//console.log('post');
		} else {
			//console.log(['post', event.target, event.target.className.indexOf("stream-item")]);
		}
		// YouTube clickable
		AEG.makeClickableYoutube(tweet);
	}
	
	// handle quoted retweets and allow opening of the base tweet manually.
	AEG.quotedRetweetLinkifier = function(tweet) {
		//console.log(['aa', tweet, typeof tweet ]);
		/*return;
		// find quotedTweet
		var quotedTweet = tweet.querySelector('.QuoteTweet');
		if ( ! quotedTweet ) {
			return;
		}
		console.log(['bb', tweet, quotedTweet]);*/
	}

	// lookup the last tweet and store that ID in a cookie, then color all those tweets as read
	AEG.setLastRead = function(event) {
		try {
			// check whether the last read tweet is loaded, to prevent marking by accident
			var lastChild = document.querySelector('.stream > .stream-items > .stream-item:last-child');
			var oldestTweetID = AEG.getTweetIDFromElement(lastChild);
			if ( oldestTweetID <= AEG.getLastUrlReadID() || !AEG.markTweetsUseConfirm || confirm('Are you sure you want to mark all tweets read? \nThe last read tweet is not loaded.') ) {
				var firstChild = document.querySelector('.stream > .stream-items > .stream-item:first-child');
				while (firstChild.querySelector('div.tweet').hasAttribute('data-promoted')
					|| firstChild.className.indexOf('before-expanded') >= 0
					|| firstChild.className.indexOf('has-recap') >= 0) {
					firstChild = firstChild.nextElementSibling;
				}
				var lastTweetID = AEG.getTweetIDFromElement(firstChild);

				AEG.setLastUrlReadID(lastTweetID);
				AEG.markRead(lastTweetID);
			}
		} catch (exc) {
			AEG.debugHandleException('AEG.setLastRead', exc);
		}
		event.stopPropagation();
	}

	/*
	 * Mark tweets with ID equal or lower than 'id' as read. If 'true' is passed as second parameter, promoted tweets will not be marked as we'l' hide them anyway.
	 * Also make tweets with YouTube video clickable.
	 * param id MyBigNumber or null
	 */
	AEG.markRead = function(id) {
		try {
			var tweets = document.querySelectorAll('.stream > .stream-items > .stream-item');
			// from last to first
			for ( var ind = tweets.length-1; ind >= 0; ind-- ) {
				var tweet = tweets[ind];
				// skip non-tweets
				if ( tweet.className.indexOf('separated-module') >= 0 ) {
					continue;
				}
				if ( null !== id ) {
					AEG.testAndMarkTweet(tweet, id);
				}
				// YouTube clickable
				AEG.makeClickableYoutube(tweet);
			}
		} catch (exc) {
			AEG.debugHandleException('AEG.markAllRead', exc);
		}
	}
	// mark the tweet if its ID is lower or equal to id
	// @element : the insterted DOM element
	// @id : lastReadID
	AEG.testAndMarkTweet = function(element, id) {
		try {
			var tweetID = AEG.getTweetIDFromElement(element);
			if (tweetID == 0) {
				// could be liked tweet, test (again)
				if (AEG.isLikedTweet(element)) {
					element.classList.add('is-read-liked');
				}
				// skip promoted tweets
				if (AEG.isPromotedTweet(element)) {
					element.classList.add('is-promoted');
				}
				// happens with newly injected tweets. Since they're new, they don't have to be marked anyway.
				return;
			}
			//console.log(['tt', element]);

			
			// mark tweet if it's old
			if ( tweetID <= id ) {
				try {
					element.classList.add('is-read');
				} catch ( e2 ) {
					return; // error for some reason // TODO ignore instead of return? doesn't seem to happen anymore anyway
				}
			}
			if ( AEG.isScrolling ) {
				if ( element.querySelector('div.tweet').hasAttribute('data-promoted') || tweetID >= id ) {
					// Scroll this element into view, would automatically stop when the tweet we're looking for is found.
					// But just limit it to prevent an endless run
					if ( AEG.countScrollInjects++ < AEG.maxScrollInjects ) {
						window.clearTimeout(AEG.scrollInjectTimer);
						AEG.scrollInjectTimer = window.setTimeout(function(elem) {
							elem.scrollIntoView(false);
						}, 100, element);
					} else {
						window.clearTimeout(AEG.scrollInjectTimer);
						// didn't find the torrent in time, add a notice in the timeline
						AEG.isScrolling = false;
						var d = document.createElement('div');
						d.setAttribute('style', 'color: red; padding-left: 5px; font-weight: bold; border-bottom: 1px solid #EBEBEB');
						d.appendChild(document.createTextNode('max amount of repeats ('+ AEG.maxScrollInjects +') exceeded, tweet not found'));
						document.querySelector('.stream-items').insertBefore(d, element.nextSibling);
						d.scrollIntoView(false);
					}
				} else {
					AEG.isScrolling = false;
					// scroll this one into view
					window.clearTimeout(AEG.scrollInjectTimer);
					element.scrollIntoView(false);
				}
			}
		} catch (exc) {
			AEG.debugHandleException('AEG.testAndMarkTweet', exc);
		}
	}
	/*
	 * Keep scrolling down till the last read tweet is in view (or should be, scrolling till we find
	 *	a tweet with ID smaller or equal to the stored one.
	 *
	 * Use the 'dom-inserted-handler in a few ways:
	 * - checking for 'old' tweet(s) and marking that, also stopping the search
	 * - when scrolling we scroll to the last tweet in the timeline, then wait for tweets to be injected;
	 *   - we scroll every new tweet into view, until we hit a max (to prevent endless loop), or find
	 *     an 'old' tweet and then stop scrolling them into view.
	 *
	 * Using the following 'global' settings:
	 *  AEG.maxScrollInjects : (int) sets the max amount of tweets we allow to be loaded before we stop to scroll
	 */
	AEG.scrollToLastReadHandler = function(event) {
		var lastReadID = AEG.getLastUrlReadID();
		if ( lastReadID === undefined ) {
			return;
		}

		// Only initiate if the last read tweet isn't already in the list (last tweet is newer (larger ID than) lastTweet(ID)).
		var lastChild = document.querySelector('.stream > .stream-items > .stream-item:last-child');

		//var tweetChild = lastChild.querySelector('div.js-stream-tweet');
		var tweetID = AEG.getTweetIDFromElement(lastChild, false); // 3 Nov 2012, before this used to use tweetChild

		if ( tweetID > lastReadID ) {
			AEG.countScrollInjects = 0;
			AEG.isScrolling = true;

			lastChild.scrollIntoView(false);
		} else {
			// the last-read tweet is on the current page already, find it and scroll to it
			// Ignore retweets, liked tweets and the "while you were away" block.
			var lastReadTweet = document.querySelector('.stream > .stream-items > .stream-item.is-read:not([data-component-context="follow_activity"]):not(.has-recap):not(.is-liked)');
			lastReadTweet.scrollIntoView(false);
		}

		// stop the other click listener (on parent 'a' element) from being called
		event.stopPropagation();
	}
	AEG.createCookie = function(name,value,days) {
		try {
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				expires = "; expires="+date.toGMTString();
			}
			document.cookie = name+"="+value.replace(/"/g,'\'')+expires+"; path=/"; // replace the JSON double quotes with single ones
		} catch (exc) {
			AEG.debugHandleException('AEG.createCookie', exc);
		}
	};
	AEG.readCookie = function(name) {
		try {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for( var i=0; i < ca.length; i++ ) {
				var c = ca[i];
				while ( c.charAt(0) == ' ' ) {
					c = c.substring(1,c.length);
				}
				if ( c.indexOf(nameEQ) === 0 ) {
					return c.substring(nameEQ.length,c.length).replace(/'/g, '"');
				}
			}
			return null;
		} catch (exc) {
			AEG.debugHandleException('AEG.readCookie', exc);
		}
	};
	AEG.eraseCookie = function(name) {
		try {
			createCookie(name,"",-1);
		} catch (exc) {
			AEG.debugHandleException('AEG.eraseCookie', exc);
		}
	};
	AEG.debugHandleException = function(title, message) {
		if ( AEG.debug ) {
			alert(title +'\n\n'+ message);
		}
	}
	AEG.log = function(log) {
		try {
			if ( AEG.debug && console != null ) {
				console.log(log);
			}
		} catch (e) {
			// silent
		}
	}
	// get the last read Tweet ID based on the URL (to support lists)
	AEG.getLastUrlReadID = function() {
		try {
			var lastRead = AEG.getLastReadID();
			return lastRead[AEG.getPageKey()];
		} catch (e) {
			AEG.log(e);
		}
	}
	// set the last read Tweet ID based on the URL (to support lists)
	AEG.setLastUrlReadID = function(id) {
		try {
			var lastRead = AEG.getLastReadID();
			lastRead[AEG.getPageKey()] = id;
			AEG.createCookie('AEG_lastReadID', JSON.stringify(lastRead), 365);
		} catch (e) {
			AEG.log(e);
		}
	}
	// returns the object from a cookie, used by both get and set
	AEG.getLastReadID = function() {
		try {
			// if this is just a number, convert it to the new structure
			var lastRead = AEG.readCookie('AEG_lastReadID');
			if (null == lastRead) {
				return {};
			} else if ( !isNaN(MyBigNumber(lastRead)) ) {
				lastRead = {'twitter.com/': lastRead};
				AEG.createCookie('AEG_lastReadID', JSON.stringify(lastRead), 365);
				return lastRead;
			} else {
				return JSON.parse(lastRead);
			}
		} catch (e) {
			AEG.log(e);
		}
		return {};
	}
	// get key of lastRead by 'page'
	AEG.getPageKey = function() {
		var key = location.href.replace('http://','').replace('https://','').replace('#', '').replace('!/', '');
		return key;
	}

	// get the correct tweet ID from a tweet div
	/**
	 * param element DOM_Element : to get the ID from
	 * param use_base boolean    : return the 'data-item-id' even when this element is a retweet. This is needed for checking whether the last-read tweet is in view, because the retweet-id will be higher than the data-item-id
	 * return int|MyBigNumber : MyBigNumber for normal tweets, or 0
	 */
	AEG.getTweetIDFromElement = function(element, use_base) {
		var child = element.querySelector('div.original-tweet');
		if ( ! child || ! child.hasAttribute('data-item-id')) {
			return 0;
		}
		// Ignore liked tweets
		if (AEG.isLikedTweet(element)) {
			return 0;
		}
		// Ignore promoted tweets
		if (AEG.isPromotedTweet(element)) {
			return 0;
		}
		
		var tweetID = child.getAttribute('data-item-id').replace('-promoted', ''); //default value
		if ( tweetID.indexOf('_') > 0 ) {
			tweetID = tweetID.split('_')[3]; //@todo don't know what this is for anymore
		} else if ( !use_base ) {
			// try to see whether this is a retweet, if so set this tweet's id to the original ID
			if ( child.hasAttribute('data-retweet-id') ) {
				tweetID = child.getAttribute('data-retweet-id').replace('-promoted', '');
			}
		}
		return MyBigNumber(tweetID);
	}
	
	/**
	 * param element DOM_Element : root tweet element to test
	 * return boolean : true if the tweet is a retweet (and the tweet id can be very old, so needs special treatment).
	 */
	AEG.isLikedTweet = function(element) {
		// Test liked tweets. See https://github.com/ArmEagle/userscripts/issues/3 
		var context = element.querySelector('.context');
		return context && context.textContent.indexOf(' liked') >= 0;
	}
	
	/**
	 * param element DOM_Element : root tweet element to test
	 * return boolean : true if the tweet is a promoted tweet
	 */
	AEG.isPromotedTweet = function(element) {
		return element.querySelector('div.tweet').hasAttribute('data-promoted');
	}
	
	/**
	 * Make youtube embeds in tweets clickable such that you can open it in a new tab instead of opening
	 * a local version (first).
	 * Lazy overlay so the link isn't somehow hijacked. That completely disables the default funtionality.
	 *  Whereas the initial goal was to only have middle-click do its default job and keep the original
	 *  functionality on normal click. But I won't be using that anyway.
	 * param element DOM_Element : tweet element to look for youtube video in.
	 */
	AEG.makeClickableYoutube = function(element) {
		// Check script setting
		if (!AEG.addYoutubeOverlay) { return; }
		
		var player = element.querySelector('.card-type-player');
		if (!player) { return; }
		
		var url = player.getAttribute('data-card-url');
		if (!url) { return; }
		
		// no duplicates on rerun
		if (element.querySelector('.aeg-tweet-youtube-link')) {
			return;
		}
		
		var el_a = document.createElement('a');
		el_a.setAttribute('href', url);
		el_a.setAttribute('target', '_blank');
		el_a.setAttribute('class', 'aeg-tweet-youtube-link');
		// store parent of element so we can wrap it in our el_a.
		var el_parent = player.parentNode;
		el_a.appendChild(player);
		el_parent.appendChild(el_a);
		
		// add the transparent overlay.
		el_overlay = document.createElement('div');
		el_overlay.setAttribute('class', 'aeg-tweet-youtube-overlay');
		el_a.appendChild(el_overlay);
	}

	// mark all read tweets (static content loaded with the page itself)
	var lastReadID = AEG.getLastUrlReadID();
	AEG.markRead(MyBigNumber(lastReadID), false);

	function MyBigNumber(value) {
		function BigNumber(value) {
			var valueSize = 24; // number of 'digits' to use so we can always do string comparison of tweet id's by prepending zero's
			var value = String(value);

			this.padzeros = function(val) {
				while (val.length < valueSize) {
					val = '0' + val;
				}
				return val;
			}
			this.toJSON = this.toString = this.valueOf = function() {
				return this.padzeros(value);
			}
		}
		return new BigNumber(value);
	}

	AEG.addButtonBar();
}

function CSS_script() {
	var style = document.getElementsByTagName('head')[0].appendChild(document.createElement('style'));
	style.textContent = "\
	.stream-item.is-read {\
		opacity: 0.8;\
		border-top: 1px solid #e8e8e8;\
		border-left: 3px solid #3377ee;\
	}\
	.stream-item.is-read ~ .stream-item.is-read-liked {\
		border-left: 3px solid #9955ee;\
	}\
	.stream-item.is-read:hover {\
		opacity: 1.0;\
	}\
	.stream-item:first-child,\
	.stream-item.is-read ~ .stream-item.is-read {\
		border-top: 0;\
		margin-top: 0 !important;\
	}\
	.stream-item.is-read.open {\
		opacity: 0.9;\
	}\
	.stream-item.open > .expansion-container > .original-tweet {\
		border-left: 3px solid;\
		border-right: 3px solid;\
		border-radius: 0;\
	}\
	#AEG-button-bar .box {\
		padding: 3px 12px 15px;\
	}\
	#AEG-button-bar .button {\
		display: inline-block;\
		margin: 10px 5px;\
		width: 24px;\
		height: 24px;\
		cursor: pointer;\
	}\
	#AEG-button-bar .button:hover {\
		opacity:0.7;\
	}\
	#AEG-button-bar #scroll-to-last {\
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAC9UlEQVRIid2VQYgcRRSGv38RCSGEJeSwrMsyIHhTNBACXgQxRBYRYsSjojCNIqLiNBEXu+mRGEJPQDCg1EDQmwbjIYgYIupNYyQQyEEwyBDWJSyyhCUMewj5PUz3TO3MhA3etKCp5tX//v+9V/Wq4L8+tB2g2cp3STwF7Lc9D0JixXBR8EMoi/6/EkjSfDewbPtVYLcE9gTspqRTwIlQFrfuWaDZyvZJOgs0MJuGc4gLgh4wAzSMDwk9A9wPXLN9uNtpX91WIEmzfTY/DqLW1zZvdDvF6vQss0XMJ0hLwLrNE91OsUVEWx3yWdtXgEVJH4KXQ9mexh2LzNg6CX4LuCb0WOiMynXfGD6XtAicAZZD2abZyh6V9Mg0ctuXQ9m+mqT5O6CHgCXgKPD+RAZV9H9JwvaD3U77RmVfsH1F0h7bVOtIWgMeDmWxVpfL5g9JfeCB+nTNRNE8Dey0/VVNDhDKYkXweoSrf5s1+QDXvg58Y3vW9pO1fSgg6YAkEOcnSoG+AM5IovpOh7I4N46TdL5aPzAhACzYRqY37tjtFBi/BqwCf9p+exxTZdcbzCzUti2bLAngTmxrptmc0GxFcALoS5pP0nzeeL1bttcigjuDaeQfC6xWm9cAfhn6oAXbP4OG2GofNoX2A2sjLI2KY9g3cYkuVc4H4wxCWfwGfFBHpVF4y2GsqcAHq/VL0wS+lbQp6YWkle2N3QZNx681uaSfJH0UY5ppNg96FtgAvp8QCGWxDpy22QWcTNIszuI28JLtvu0NzMuhLIZ7laQ5mI9t77D9aXzxxRkA5BI3DC+C3k3SPBb5HTgqeDN0it6IPAM4Juk5oCfpWEy4RSCUxd+2j1TdeBz4PC6XpFNIn0VlmQN9CbxXleZIKIuNmHPqdZ2k+eO2z4LmwLcYNNmF6pzPSGrYPgQ8D+wErks6HMri8jjX3R+cVr4XUdh+BdgR3UGjGfqCABShLG5O49n+yUzzPbKXkKonEyStABeB7+5G/P8Z/wACzV4hetnLFgAAAABJRU5ErkJggg==);\
	}\
	#AEG-button-bar #mark-all {\
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAC5ElEQVRIidWVT2gdVRTGf18IEksIQbqQUMpDshEqSKAUuhRDpahQKll2EXiDoKLiuypG5jJTqi3zCm8p80AQ3RjUIkqwRBQ3QikIUtyIiyAlZFFKCSGELPK5ePPa92doirseuByY+53vO+fMuffC4246DJCEOAt+CXTK9jEkBJuGm4K1ssju/i+BHjHRdgIckcAeg+0Bnwti2c7vPLJAs5UuSLoGHMfsGn+DdF2wARwYGphFiSVgGtiyfb7bzn8/VCAJccH2r8CMpFXbb3fb+VZtla30KOIq6AKwa3txVGRIIAlxxvafQAP4RNJKWWR13IPVIvGhzafAFvBcd6BdkyP4FUkN4DvwSllkJCHO256qI5e0XxbZ30krvQx6VuICkAFv9DET9zMJcdr268CezVtlkQNg/D1wS9KtGr8OULZzhN+zvQMsJyE+NVaB7BcNM7ZXu+1880EPFcCz1QA9Y/tJ0F+V+k4fV7bzO0krXbW9DJwFvhpukXRSAPb6YBvKIlsDSFrpJNJvwBSQlUW2X9OzdcEycLIvMDGwPWcb90Zx3KSW7dPAAhDrILY3Kj/X/zYogCQkTYzEkYT4PJBJ94fu/STE02M50IsdwA0J3HbvqDYGg5ohTtn+0uYJ21Rr0vYXzVY6PaLQqDhu1wncqMo7MxzDReBEP6l+dpLmQcVIEWeq/Rt1Ar9Iuifp5WYrPQ6QhHTG9gTQ6S/bHUkd2x3wXhLi0Qr7NPAasAv8NJDgA0tCvGjzsfAa4pWyyA94BEtCxPbXwBLQ6bbzd+sqALgi8Y/hrNHVJMSxH15HDlyStAT8K2nobhkiKItsB/ucpLuCd4AfmqHXrnrydA74FvgI2AbOlUV2bxBTf12HeAL7GmgevA/8KOl6NecHkhq2F4FX6R28DUnnyyL7Y5TrYQ/ONPCB7TeBWUnYZsjDtuAz4FJZZNt1PIc+mc0QjwheAE7ZHAMjaRO4CfxcFtnOIRSPuf0HkqRKoOco5hIAAAAASUVORK5CYII=);\
	}\
	.aeg-tweet-youtube-link {\
		position:relative;\
		width:100%;\
		display:inline-block;\
	}\
	.aeg-tweet-youtube-overlay {\
		position: absolute;\
		left:0;\
		top:0;\
		width:100%;\
		height:100%;\
	}\
	.separated-module.has-recap, .tweet.promoted-tweet {\
		display: none;\
	}\
	li[data-component-context=suggest_who_to_follow] {\
		display: none;\
	}\
	";
}
CSS_script();

function init() {
	trigger = document.querySelector('.stream > .stream-items > .stream-item:first-child div.tweet');
	if ( trigger != null ) {
//	if (document.querySelector('.stream > .stream-items > .stream-item:first-child div.tweet')) {
		try {
			DOM_script();
			console.log('twitter last read user is done loading');
		} catch(e) {
			console.log(e);
		}
//	}
	} else {
		window.setTimeout(function() {init();}, 1000);
	}
}
init();
