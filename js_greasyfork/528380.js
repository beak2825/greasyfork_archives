// ==UserScript==
// @name        nuke button
// @namespace   https://github.com/yassghn/nuke-button
// @version     2025-04-10
// @description kill 'em all
// @icon        https://www.svgrepo.com/download/528868/bomb-emoji.svg
// @author      yassghn
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @match       https://x.com/*
// @match       https://mobile.x.com/*
// @run-at      document-start
// @grant       none
// @license     OUI
// @require     https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/528380/nuke%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/528380/nuke%20button.meta.js
// ==/UserScript==

/* global $ */

(function () {
	'use strict';

	/**
	 * nuke-button
	 *
	 * config.mjs
	 */

	// config object
	const config = {
		projectName: 'nuke-button',
		debug: false,
		mobile: (window.location.href.startsWith('https://mobile')) ? true : false,
		behavior: {
			newTabOnError: false
		},
		selectors: {
			nukeButton: 'a[class="nuke-button"]',
			posts: 'div[data-testid="User-Name"]',
			hometl: 'div[aria-label="Timeline: Your Home Timeline"]',
			tl: 'div[aria-label*="Timeline:"]',
			statustl: 'div[aria-label="Timeline: Conversation"]',
			searchtl: 'div[aria-label="Timeline: Search timeline"]',
			status: 'article[data-testid="tweet"]',
			postHref: 'a[href*="status"]',
			avatar: 'div[data-testid="Tweet-User-Avatar"]',
			nav: 'div [role="navigation"]',
			profile: 'a[aria-label="Profile"]',
			kbd: 'a[href="/i/keyboard_shortcuts"]',
			communities: 'a[aria-label="Communities"]'
		},
		static: {
			icon: '💣',
			checkMark: '✔️',
			redCross: '❌'
		},
		features: {
			rweb_tipjar_consumption_enabled: true,
			responsive_web_graphql_exclude_directive_enabled: true,
			verified_phone_label_enabled: false,
			creator_subscriptions_tweet_preview_api_enabled: true,
			responsive_web_graphql_timeline_navigation_enabled: true,
			responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
			communities_web_enable_tweet_community_results_fetch: true,
			c9s_tweet_anatomy_moderator_badge_enabled: true,
			articles_preview_enabled: true,
			responsive_web_edit_tweet_api_enabled: true,
			graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
			view_counts_everywhere_api_enabled: true,
			longform_notetweets_consumption_enabled: true,
			responsive_web_twitter_article_tweet_consumption_enabled: true,
			tweet_awards_web_tipping_enabled: false,
			creator_subscriptions_quote_tweet_preview_enabled: false,
			freedom_of_speech_not_reach_fetch_enabled: true,
			standardized_nudges_misinfo: true,
			tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
			rweb_video_timestamps_enabled: true,
			longform_notetweets_rich_text_read_enabled: true,
			longform_notetweets_inline_media_enabled: true,
			responsive_web_enhance_cards_enabled: false,
			blue_business_profile_image_shape_enabled: false,
			tweetypie_unmention_optimization_enabled: true,
			responsive_web_text_conversations_enabled: true,
			vibe_api_enabled: true,
			responsive_web_twitter_blue_verified_badge_is_enabled: false,
			interactive_text_enabled: true,
			longform_notetweets_richtext_consumption_enabled: true,
			premium_content_api_read_enabled: true,
			profile_label_improvements_pcf_label_in_post_enabled: true,
			responsive_web_grok_analyze_post_followups_enabled: false,
			responsive_web_grok_analyze_button_fetch_trends_enabled: false,
			responsive_web_grok_share_attachment_enabled: false
		},
		fieldToggles: {
			count: 1000,
			rankingMode: "Relevance",
			withSafetyModeUserFields: true,
			includePromotedContent: true,
			withQuickPromoteEligibilityTweetFields: true,
			withVoice: true,
			withV2Timeline: true,
			withDownvotePerspective: false,
			withBirdwatchNotes: true,
			withCommunity: true,
			withSuperFollowsUserFields: true,
			withReactionsMetadata: false,
			withReactionsPerspective: false,
			withSuperFollowsTweetFields: true,
			isMetatagsQuery: false,
			withReplays: true,
			withClientEventToken: false,
			withAttachments: true,
			withConversationQueryHighlights: true,
			withMessageQueryHighlights: true,
			withMessages: true,
			with_rux_injections: false
		},
		apiEndpoints: {
			tweetDetail: 'https://x.com/i/api/graphql/nBS-WpgA6ZG0CyNHD517JQ/TweetDetail',
			following: 'https://x.com/i/api/graphql/eWTmcJY3EMh-dxIR7CYTKw/Following',
			followers: 'https://x.com/i/api/graphql/pd8Tt1qUz1YWrICegqZ8cw/Followers',
			retweeters: 'https://x.com/i/api/graphql/0BoJlKAxoNPQUHRftlwZ2w/Retweeters',
			verifiedFollowers: 'https://x.com/i/api/graphql/srYtCtUs5BuBPbYj7agW6A/BlueVerifiedFollowers',
			userid: 'https://x.com/i/api/graphql/sLVLhk0bGj3MVFEKTdax1w/UserByScreenName',
			blockUser: 'https://x.com/i/api/1.1/blocks/create.json'
		}
	};

	/**
	 * nuke-button
	 *
	 * globals.mjs
	 */


	// globals
	var gCurrentPage = '';
	var gObservers = {};
	var gProfile = '';
	var gPageChanged = false;
	var gWhiteList = [];

	// init profile href
	function initProfile() {
		// check if we're on a mobile device
		if (!config.mobile) {
			gProfile = $(config.selectors.profile).attr('href').split('/')[1];
		} else {
			gProfile = $(config.selectors.communities).attr('href').split('/')[1];
		}
	}

	// init observers
	function initObservers() {
		gObservers = { href: new MutationObserver(() => { }), timeline: new MutationObserver(() => { }) };
	}

	// init white list
	function initWhiteList() {
		// array of usernames to whitelist
		gWhiteList = ['boryshn', 'yassghn_', 'commet_w'];
	}

	// set current page
	function initCurrentPage() {
		gCurrentPage = window.location.href;
	}

	// update current page
	function setCurrentPage(page) {
		gCurrentPage = page;
	}

	function setPageChanged(changed) {
		gPageChanged = changed;
	}

	// init globals
	function initGlobals() {
		initCurrentPage();
		initObservers();
		initProfile();
		initWhiteList();
	}

	// disconnect observers
	function disconnectObservers() {
		for (let observer of gObservers) {
			observer.disconnect();
		}
	}

	/**
	 * nuke-button
	 *
	 * log.mjs
	 */


	// log
	function log(msg, err = false) {
		if (config.debug) {
			if (err) {
				console.error(msg);
			} else {
				console.log(msg);
			}
		}
	}

	function logObj(obj, depth = null) {
		if (config.debug) {
			console.dir(obj, { depth: depth });
		}
	}

	/**
	 * nuke-button
	 *
	 * fight-react.mjs
	 */


	// delete react state
	/* function deleteReactState() {
		if ($('div')[0].firstElementChild['wrappedJSObject']) {
			delete ($('div')[0].firstElementChild['wrappedJSObject'])
			return ''

		}
		if ($('div')[0].firstElementChild) {
			delete ($('div')[0].firstElementChild)

		}
		//const reactPropsKey = Object.keys(wrapped).find(key => key.startsWith('__reactProps'))
		//         //const state = wrapped[reactPropsKey].children?.props?.children?.props?.store?.getState()
		//         //delete(state)
	} */

	/**
	 *
	 * notes:
	 * reactProps.children.props.history ???
	 */
	/* async function removePostsReactProps(post, href) {
		const wrapped = $('div')[0].firstElementChild['wrappedJSObject'] || $('div')[0].firstElementChild
		const reactPropsKey = Object.keys(wrapped).find(key => key.startsWith('__reactProps'))
		const reactFiberKey = Object.keys(wrapped).find(key => key.startsWith('__reactFiber'))
		const reactProps = wrapped[reactPropsKey]
		const reactFiber = wrapped[reactFiberKey]
		logObj(reactFiber)
		logObj(reactProps)
		 delete(reactFiber.memorizedProps)
		 delete(reactFiber.stateNode)
		 delete(reactProps.children.props.children.props)
		//delete(wrapped[key])
		//wrapped[key] = {}
		//removeReactObjects(href)
		const article = $(post).find('article')[0].firstElementChild['wrappedJSObject']
		const keys = Object.keys(article).filter(key => key.startsWith('__react'))
		//console.dir(article, { depth: null })
		logObj(keys)
		keys.forEach((key) => {
			//logObj(article[key])
			if (article[key]) {
				delete (article[key])
			}
		})
		//logObj(article)
	} */

	// get react state
	function getReactState() {
		const wrapped = $('div')[0].firstElementChild['wrappedJSObject'] || $('div')[0].firstElementChild;
		const reactPropsKey = Object.keys(wrapped).find(key => key.startsWith('__reactProps'));
		const state = wrapped[reactPropsKey].children?.props?.children?.props?.store?.getState();
		return state
	}

	// remvoe post react object
	function removeReactObjects(href) {
		// todo: not sure how to approach hacking at the react obejcts
		//       need to stop them from repopulating the timeline with removed posts
		//       also causes page to crash needing to reload
		// get react state
		const reactState = getReactState();
		const statusId = href.split('/')[3];
		// get in-reply-to if it exists
		const inReply = reactState.entities.tweets.entities[statusId].in_reply_to_status_id_str;
		// remove react objects
		if (reactState.entities.tweets.entities[statusId]) {
			//delete(reactState.entities.tweets.entities[statusId])
			reactState.entities.tweets.entities[statusId].conversation_id_str = "1234";
		}
		if (reactState.entities.tweets.fetchStatus[statusId]) {
			delete (reactState.entities.tweets.fetchStatus[statusId]);
		}
		for (const key in reactState.urt) {
			if (reactState.urt[key].entries) {
				for (let i = 0; i < reactState.urt[key].entries.length; i++) {
					if (reactState.urt[key].entries[i]) {
						if (reactState.urt[key].entries[i].entryId.includes(statusId)) {
							//delete(reactState.urt[key].entries[i])
							reactState.urt[key].entries[i].entryId = 'noid-0000';
							reactState.urt[key].entries[i].sortIndex = "1234";
							reactState.urt[key].entries[i].type = 'nonexistingType';
						}
					}
				}
			}
		}
		for (const key in reactState.audio.conversationLookup) {
			if (reactState.audio.conversationLookup[key]) {
				for (let i = 0; i < reactState.audio.conversationLookup[key].length; i++) {
					delete (reactState.audio.conversationLookup[key][i]);
				}
			}
		}
	}

	// hide post from timeline
	function hidePost(post) {
		// hide html from timeline
		$(post).html('');
		$(post).hide();
	}

	/**
	 * nuke-button
	 *
	 * polling.mjs
	 */


	/**
	 * @param {string} selector
	 * @param {{
	*   name?: string
	*   stopIf?: () => boolean
	*   timeout?: number
	*   context?: Document | HTMLElement
	* }?} options
	* @returns {Promise<HTMLElement | null>}
	*/
	function getElement(selector, {
		name = null,
		stopIf = null,
		timeout = Infinity,
		context = document,
	} = {}) {
		return new Promise((resolve) => {
			let startTime = Date.now();
			let rafId;
			let timeoutId;

			function stop($element, reason) {
				resolve($element);
			}

			if (timeout !== Infinity) {
				timeoutId = setTimeout(stop, timeout, null, `${timeout}ms timeout`);
			}

			function queryElement() {
				let $element = context.querySelector(selector);
				if ($element) {
					log(`found element with selector: ${selector}`);
					stop($element);
				}
				else if (stopIf?.() === true) {
					stop(null, 'stopIf condition met');
				}
				else {
					log(`waiting for element with selector: ${selector}`);
					rafId = requestAnimationFrame(queryElement);
				}
			}

			queryElement();
		})
	}

	// poll for react state
	async function pollReactState() {
		// new promise
		const promise = new Promise((resolve) => {
			// interval id
			let intervalId = 0;
			// function to return react state
			function returnReactState(reactState) {
				log('found react state');
				logObj(reactState);
				// resolve react state
				resolve(reactState);
			}
			// poll for react state
			function poll() {
				// use set interval to poll
				intervalId = setInterval(function () {
					try {
						const reactState = getReactState();
						// clear interval
						clearInterval(intervalId);
						// resolve
						returnReactState(reactState);
					} catch (error) {
						log('waiting for react state...');
					}
				}, 1000);
			}
			// start polling
			poll();
		});
		return promise
	}

	// wait for user to login if necessary
	async function isLoggedIn(reactState) {
		// new promise
		const promise = new Promise((resolve) => {
			// interval id
			let intervalId = 0;
			// resolve promise
			function resolved() {
				log('user logged in');
				// resolve
				resolve(true);
			}
			// poll checking if user is logged in
			function pollLoggedIn() {
				// poll with set interval
				intervalId = setInterval(function () {
					//check href and window vars
					if (!(window?.__META_DATA__?.isLoggedIn == false) &&
						!window.location.href.includes('/i/flow/login')) {
						// clear interval
						clearInterval(intervalId);
						// resolve
						resolved();
					} else {
						// keep polling
						log('waiting for user login');
					}
				}, 1000);
			}
			// start polling
			pollLoggedIn();
		});
		// return promise
		return promise
	}

	/**
	 * nuke-button
	 *
	 * api-data.mjs
	 */

	// extract item content from tweet responses
	function extractTweetResponseItemContent(entry) {
		if (entry.content.entryType === 'TimelineTimelineItem')
			return [entry.content.itemContent]
		if (entry.content.entryType === 'TimelineTimelineModule')
			return entry.content.items.map((item) => item.item.itemContent)
		return []
	}

	// check if item content is a tweet entry
	function isTweetEntry(itemContent) {
		return (
			itemContent.itemType === 'TimelineTweet' &&
			itemContent.tweet_results.result.__typename !== 'TweetWithVisibilityResults' &&
			itemContent.tweet_results.result.__typename !== 'TweetTombstone'
		)
	}

	// extract user id from data
	function extractUserId(data) {
		return data?.data?.user?.result?.rest_id
	}

	// extract user response data from instructions
	function extractUserResponseData(instructions) {
		const data = instructions
			.flatMap((instr) => instr.entries || [])
			.filter(
				(entry) =>
					entry.content.entryType === "TimelineTimelineItem" &&
					entry.content.itemContent.user_results.result &&
					entry.content.itemContent.user_results.result.__typename !== "UserUnavailable"
			)
			.map((entry) => ({
				username: entry.content.itemContent.user_results.result.legacy?.screen_name,
				isBlocked: entry.content.itemContent.user_results.result.legacy.blocking ??
					entry.content.itemContent.user_results.result.smart_blocking ??
					false,
				userId: entry.content.itemContent.user_results.result?.rest_id
			})) || [];
		return data
	}

	// extract user response data from instructions
	function extractTweetResponseData(instructions) {
		const entries = instructions.flatMap((instr) => instr.entries || []);
		// collect targets
		let responseTargets = [];
		// iterate instructions
		for (const entry of entries) {
			// get item contents
			const itemContents = extractTweetResponseItemContent(entry);
			// iterate item contents
			for (const itemContent of itemContents) {
				if (isTweetEntry(itemContent)) {
					const userId = itemContent.tweet_results.result.legacy.user_id_str;
					const username = itemContent.tweet_results.result.core.user_results.result.legacy.screen_name;
					const responseTarget = { username: username, isBlocked: false, userId: userId };
					responseTargets.push(responseTarget);
				}
			}
		}
		return responseTargets
	}

	/**
	 * nuke-button
	 *
	 * browser.mjs
	 */


	// open href in new tab
	function openHrefInNewTab(href) {
		// complete url
		const url = `https://x.com${href}`;
		log(`opening url: ${url}`);
		// open new tab
		window.open(url, '_blank');
		//window.focus()
	}

	/**
	 * nuke-button
	 *
	 * whitelist.mjs
	 */


	// filter block list
	function filterDedupWhiteList(item, index, arr) {
		// do not include white listed accounts
		if (gWhiteList.indexOf(item.username) > -1) {
			return false
		}
		// dedup based username and userid
		const i = arr.findIndex((item2) => ['username', 'userId'].every((key) => item2[key] === item[key]));
		return i === index
	}

	/**
	 * nuke-button
	 *
	 * api-request.mjs
	 */


	// get cookie
	function getCookie(cname) {
		const name = cname + '=';
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; ++i) {
			const c = ca[i].trim();
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length)
			}
		}
		return ''
	}

	// api request headers
	function createRequestHeaders() {
		const headers = {
			Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
			'X-Twitter-Auth-Type': 'OAuth2Session',
			'X-Twitter-Active-User': 'yes',
			'X-Csrf-Token': getCookie('ct0')
		};
		return headers
	}

	// Universal API request function for making requests
	async function apiRequest(url, method = 'GET', body = null) {
		const options = {
			headers: createRequestHeaders(),
			method,
			credentials: 'include'
		};
		if (body) {
			options.body = body;
			options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}
		try {
			const response = await fetch(url, options);
			// check for errors
			if (response.ok) {
				// return data
				const data = await response.json();
				return data
			} else {
				// throw response error
				const errors = await response.json();
				throw errors
			}
		} catch (error) {
			// add url to error
			error.url = url;
			//throw error
			throw error
		}
	}

	// build api url
	function buildUrl(endpoint, variables) {
		// start with endpoint
		const url = `${endpoint}` +
			`?variables=${encodeURIComponent(JSON.stringify(Object.assign(variables, config.fieldToggles)))}` +
			`&features=${encodeURIComponent(JSON.stringify(config.features))}`;
		return url
	}

	// Fetches the list of users a given user is following
	async function fetchUserFollowing(userId) {
		const variables = {
			userId
		};
		const url = buildUrl(config.apiEndpoints.following, variables);
		try {
			const data = await apiRequest(url);
			return data
		} catch (e) {
			throw e
		}
	}

	// fetch users followers
	async function fetchUserFollowers(userId) {
		const variables = {
			userId
		};
		const url = buildUrl(config.apiEndpoints.followers, variables);
		try {
			const data = await apiRequest(url);
			return data
		} catch (e) {
			throw e
		}
	}

	// fetch verified followers
	async function fetchVerifiedFollowers(userId) {
		const variables = {
			userId: userId
		};
		const url = buildUrl(config.apiEndpoints.verifiedFollowers, variables);
		try {
			const data = await apiRequest(url);
			return data
		} catch (e) {
			throw e
		}
	}

	// Fetches responses for a tweet, with optional pagination cursor
	async function fetchTweetResponses(tweetId, cursor = null) {
		const variables = {
			focalTweetId: tweetId,
			cursor
		};
		const url = buildUrl(config.apiEndpoints.tweetDetail, variables);
		try {
			const data = await apiRequest(url);
			return data
		} catch (e) {
			throw e
		}
	}

	// fetch retweeters
	async function fetchTweetRetweeters(tweetId, cursor = null) {
		const variables = {
			tweetId: tweetId
		};
		const url = buildUrl(config.apiEndpoints.retweeters, variables);
		try {
			const data = await apiRequest(url);
			return data
		} catch (e) {
			throw e
		}
	}

	// blocks a user with the given user ID
	async function blockUser(userId) {
		try {
			const data = await apiRequest(config.apiEndpoints.blockUser, 'POST', `user_id=${userId}`);
			return data
		} catch (error) {
			throw error
		}
	}

	// fetch user id from username
	async function fetchUserId(username) {
		const variables = { screen_name: username };
		const url = buildUrl(config.apiEndpoints.userid, variables);
		try {
			const data = await apiRequest(url);
			return data
		} catch (e) {
			throw e
		}
	}

	// get block list
	async function getBlockList(userId, username, tweetId) {
		try {
			// get data
			const followingData = await fetchUserFollowing(userId);
			const following = extractUserResponseData(followingData?.data?.user?.result?.timeline?.timeline?.instructions);
			const followersData = await fetchUserFollowers(userId);
			const followers = extractUserResponseData(followersData?.data?.user?.result?.timeline?.timeline?.instructions);
			const verifiedFollowersData = await fetchVerifiedFollowers(userId);
			const verifiedFollowers = extractUserResponseData(verifiedFollowersData?.data?.user?.result?.timeline?.timeline?.instructions);
			const responsesData = await fetchTweetResponses(tweetId);
			const responses = extractTweetResponseData(responsesData?.data?.threaded_conversation_with_injections_v2?.instructions);
			const retweetersData = await fetchTweetRetweeters(tweetId);
			const retweeters = extractUserResponseData(retweetersData?.data?.retweeters_timeline?.timeline?.instructions);
			// add target user to front of array
			const target = [{ username: username, isBlocking: false, userId: userId }];
			// combine data
			const blockList = [].concat(target, following, followers, verifiedFollowers, responses, retweeters);
			// filter blocklist based on username and userid
			const filteredBlockList = blockList.filter(filterDedupWhiteList);
			// return block list
			return filteredBlockList
		} catch (e) {
			throw e
		}
	}

	// block a block list
	async function blockBlockList(blockList, href) {
		// init return
		let blockedTally = 0;
		let openedHref = false;
		// iterate block list
		for (const item of blockList) {
			// check if user is blocked already
			if (!item.isBlocked) {
				try {
					// block user
					const ret = await blockUser(item.userId);
					// increment blocked tally
					blockedTally += 1;
				} catch (error) {
					// log error
					log(`${error.name}, ${error.message}, ${error.cause}`, true);
					// something's going wrong, open post in new tab to finish nuke-ing later
					// probably got logged out (401), or api timeout (429)
					if (!openedHref && config.behavior.newTabOnError) {
						openHrefInNewTab(href);
						openedHref = true;
					}
				}
			}
		}
		// return success
		return blockedTally
	}

	/**
	 * nuke-button
	 *
	 * html-css.mjs
	 */


	// add processing html/css
	/* function addProcessingElement(post, href, style) {
	    // create processing html
	    const processingHtml = $(getProcessingHtml(href))
	    // make timeline item div wrappers
	    const divWrapper = $('<div/>')
	    const outterDivWrapper = $('<div/>')
	    const separatorDiv = $('<div/>')
	    const divWrapperClasses = $(post).children().eq(0).attr('class')
	    const outterDivWrapperClasses = $(post).attr('class')
	    const separatorClasses = $(post).find('div[role="separator"]').attr('class')
	    const transformCss = $(post).css('transform')
	    log(transformCss)
	    $(divWrapper).attr('class', divWrapperClasses)
	    $(outterDivWrapper).attr('class', outterDivWrapperClasses)
	    $(outterDivWrapper).attr('style', `transform: ${transformCss}; position: relative; width: 100%;`)
	    $(outterDivWrapper).attr('data-testid', 'cellInnerDiv')
	    $(separatorDiv).attr('class', separatorClasses)
	    $(separatorDiv).attr('role', 'separator')
	    // wrap divs
	    $(processingHtml).attr('class', outterDivWrapperClasses)
	    $(processingHtml).find('div').attr('class', outterDivWrapperClasses)
	    // add css to elements
	    $(processingHtml).css(getProcessingCss())
	    $(processingHtml).wrap($(outterDivWrapper)).wrap($(divWrapper))
	    const finalDiv = $(processingHtml).parents().eq(1)
	    $(finalDiv).append($(separatorDiv))
	    log($(separatorDiv))
	    log(finalDiv)
	    // add to dom
	    $(finalDiv).insertBefore($(post))
	    // return outter most div wrapper
	    return finalDiv
	} */

	// append style element to head
	function appendStyle() {
	    let $style = document.createElement('style');
	    $style.dataset.insertedBy = config.projectName;
	    $style.dataset.role = 'features';
	    document.head.appendChild($style);
	    return $style
	}

	// get twitter theme colors
	function getThemeColors() {
	    // get body style
	    const style = window.getComputedStyle($('body')[0]);
	    // try to get theme color from two different elements
	    const themeColor1 = style.getPropertyValue('--theme-color');
	    const themeColor2 = $(config.selectors.kbd).css('color');

	    return {
	        color: (themeColor1 != '') ? themeColor1 : themeColor2,
	        bg: style.getPropertyValue('background-color')
	    }
	}

	// nuke button css
	function getNukeButtonCss() {
	    const theme = getThemeColors();
	    const css =
	        `a.nuke-button {
                z-index: 1;
                position: absolute;
                width: 30px;
                height: 30px;
                top: 45px;
                text-decoration: none;
                text-align: center;
                user-select: none;
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -o-user-select: none;
            }
            a.nuke-button:hover {
                border-radius: 5px;
                background-color: ${theme.color};
            }
            #nuke-button {
                width: 100%;
                height: 100%;
                line-height: 30px;
            }
            #nuke-button-text {
                margin: 0 auto;
            }
            #processing-text {
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -o-user-select: none;
            }
            #processing-text span {
                display: inline-block;
                text-transform: uppercase;
                animation: flip 2s infinite;
                animation-delay: calc(.11s * var(--i));
            }
            #nuke-confirmation {
                height: 100px;
                width: 100%;
                text-align: center;
                justify-content: center;
                align-items: center;
                text-transform: uppercase;
                padding-top: 30px;
                border: 2px ${theme.color} solid;
                border-radius: 2px;
                box-shadow: inset 0 0 2px ${theme.bg},
                              inset 0 0 7px ${theme.bg},
                              inset 0 0 14px ${theme.color},
                              inset 0 0 21px ${theme.color},
                              inset 0 0 28px ${theme.color},
                              inset 0 0 35px ${theme.color};
                animation: glow 0.9s infinite alternate;
            }
            #nuke-confirmation-title {
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -o-user-select: none;
            }
            #nuke-confirmation-title span {
                display: inline-block;
                animation: flip 2s infinite;
                animation-delay: calc(.5s * var(--i));
            }
            .nuke-confirmation-button {
                display: inline-block;
                padding-left: 30px;
                padding-right: 30px;
            }
            .nuke-confirmation-button button {
                height: 50px;
                width: 80px;
                cursor: pointer;
                text-transform: uppercase;
            }
            @keyframes glow {
                100% {
                    box-shadow:
                           inset 0 0 3px ${theme.bg},
                           inset 0 0 10px ${theme.bg},
                           inset 0 0 20px ${theme.color},
                           inset 0 0 40px ${theme.color},
                           inset 0 0 70px ${theme.color},
                           inset 0 0 89px ${theme.color};
                }
            }
            @keyframes flip {
                0%,80% {
                    transform: rotateY(360deg);
                }
            }`;
	    return css
	}

	// nuke button html
	function getNukeButtonHtml() {
	    const nukeButtonHtml =
	        `<a class="nuke-button" data-testid="block">
                <div id="nuke-button">
                    <div id="nuke-button-text">
                        <span id="nuke-emoji">${config.static.icon}</span>
                    </div>
                </div>
            </a>`;
	    return nukeButtonHtml
	}

	// nuke confirmation html
	function getNukeConfirmationHtml() {
	    const nukeConfirmationHtml =
	        `<div id="nuke-confirmation">
                <div id="nuke-confirmation-title">
                    <span style="--i:1;">are</span>
                    <span style="--i:2;">you</span>
                    <span style="--i:3;">sure</span>
                    <span style="--i:4;">you</span>
                    <span style="--i:5;">want</span>
                    <span style="--i:6;">to</span>
                    <span style="--i:7;">nuke</span>
                    <span style="--i:8;">this</span>
                    <span style="--i:9;">thread?</span>
                </div>
                <br/>
                <div class="nuke-confirmation-button">
                    <button name="yes" type="button" value="true">
                        <span>${config.static.checkMark}</span>
                        <span>yes</span>
                    </button>
                </div>
                <div class="nuke-confirmation-button">
                    <button name="no" type="button" value="false">
                        <span>${config.static.redCross}</span>
                        <span>no</span>
                    </button>
                </div>
            </div>`;
	    return nukeConfirmationHtml
	}

	// get post href
	function getPostHref(post) {
	    // get target links attached to post
	    const links = $(post).find(config.selectors.postHref);
	    // iterate links
	    for (let i = 0; i < links.length; i++) {
	        // get href
	        const href = $(links[i]).attr('href');
	        // toss out incorrect links
	        if (href.includes('analytics') || href.includes('photo') || href.includes('history') || href.includes('retweets')) {
	            const arr = href.split('/');
	            const ret = `/${arr[1]}/${arr[2]}/${arr[3]}`;
	            return ret
	        } else if (i == links.length - 1) {
	            // return last link if none found
	            return href
	        }
	    }
	}

	// processing css
	function getProcessingCss() {
	    const theme = getThemeColors();
	    const css = {
	        'height': `100px`,
	        'text-align': 'center',
	        'justify-content': 'center',
	        'align-items': 'center',
	        'padding-top': '30px',
	        'border': `2px ${theme.color} solid`,
	        'border-radius': '2px',
	        'box-shadow': `inset 0 0 2px ${theme.bg},
                           inset 0 0 7px ${theme.bg},
                           inset 0 0 14px ${theme.color},
                           inset 0 0 21px ${theme.color},
                           inset 0 0 28px ${theme.color},
                           inset 0 0 35px ${theme.color}`,
	        'animation': 'glow 0.7s infinite alternate'
	    };
	    return css
	}

	// insert css
	function insertCss() {
	    let $style;
	    $style ??= appendStyle();
	    $style.textContent = getNukeButtonCss();
	}

	// edit status view css
	async function editStatusViewCss() {
	    // create css
	    const css = {
	        'z-index': -1,
	        'top': '17px'
	    };
	    // wait for element to load in
	    await getElement(config.selectors.status);
	    // add new style
	    $(config.selectors.status).find('div').eq(1).children().eq(2).css(css);
	}

	// html to display while processing is happening
	function getProcessingHtml(href) {
	    // remove leading slash from href
	    const info = href.substring(1, href.length);
	    // make processing text html
	    const processingTextHtml =
	        `<div id="processing-text">
                <span style="--i:1;">n</span>
                <span style="--i:2;">u</span>
                <span style="--i:3;">k</span>
                <span style="--i:4;">e</span>
                <span style="--i:5;">-</span>
                <span style="--i:6;">i</span>
                <span style="--i:7;">n</span>
                <span style="--i:8;">g</span>
                <span style="--i:10;">.</span>
                <span style="--i:11;">.</span>
                <span style="--i:12;">.</span>
            </div>`;
	    // combine and return
	    const processingHtml =
	        `<div id="processing"><article role="article" tabindex="0" data-testid="tweet">` +
	        `${processingTextHtml}<br/>` +
	        `<span id="processing-info-text">${info}</span></article></div>`;
	    return processingHtml
	}

	/**
	 * nuke-button
	 *
	 * nuke-button.mjs
	 */


	// kill 'em all
	async function killEmAll(href) {
		// get username from href
		const targetUsername = href.split('/')[1];
		const tweetId = href.split('/')[3];
		try {
			// get user data
			const userData = await fetchUserId(targetUsername);
			// check for error
			if (userData.message) {
				// throw error
				throw userData.message
			}
			// extract user id
			const targetUserId = extractUserId(userData);
			const blockList = await getBlockList(targetUserId, targetUsername, tweetId);
			const result = await blockBlockList(blockList, href);
			log(`processing finished for ${href}: blocked ${result} accounts`);
		} catch (e) {
			// log error url
			if (e.url) {
				log(`api request error for url: ${e.url}`, true);
			}
			// log error
			log(e, true);
			return undefined
		}
		// return href on success
		return href
	}

	// rebind the nuke function
	function rebindNukeCommand(post) {
		$(post).find(config.selectors.nukeButton).on('click', nuke);
	}

	// check for quote tweet
	function isQuoteTweet(post) {
		// quoted tweets have two classes
		if ($(post).attr('class').split(/\s+/).length > 1) {
			const quote = $(post).parents().eq(6).find('span:contains("Quote")');
			return quote.length > 0
		}
		return false
	}

	// should add nuke button
	function shouldAddNukeButton(post) {
		// check if post is null
		if (post != null) {
			// do not add nuke button to self's own posts
			let profile = '';
			// check for quote tweet
			if (isQuoteTweet(post)) {
				profile = $(post).parents().eq(1).find('span:contains("@")').first().text().split('@')[1];
			} else {
				profile = $(post).parents().eq(1).find('a').first().attr('href').split('/')[1];
			}
			// white list check
			const whiteListed = gWhiteList.find((username) => username.toString() === profile.toString());
			// check against global profile variable and whitelist
			if (gProfile != profile && !whiteListed) {
				return true
			}
		}
		// default return
		return false
	}

	// append nuke button html to post
	function appendNukeButtonHtml(post) {
		// check if buke button should be added
		if (shouldAddNukeButton(post)) {
			// apend html
			$(post).parents().first().parents().first().append(getNukeButtonHtml());
			// arm nuke
			$(post).parents().eq(1).find(config.selectors.nukeButton).on('click', nuke);
		}
	}

	// insert nuke button html
	function addNukeButton() {
	    // todo: breaks opening post in new tab, link at the end, probably react is looking for last link
	    $(config.selectors.avatar).each((index, post) => { appendNukeButtonHtml(post); });
	}

	// nuke confirmation
	async function nukeConfirmation(post) {
	    // init return
	    let ret = false;
	    // store post html
	    const postHtml = $(post).html();
	    // set confirmation html
	    $(post).html(getNukeConfirmationHtml());
	    // add even listeners to buttons
	    const promise = new Promise((resolve) => {
	        // yes button
	        $(post).find('button[name="yes"]').on('click', function (event) {
	            resolve(true);
	        });
	        // no button
	        $(post).find('button[name="no"]').on('click', function (event) {
	            resolve(false);
	        });
	    });
	    // await confirmation response
	    await promise.then((result) => {
	        // store return value
	        ret = result;
	        // reset post html
	        $(post).html(postHtml);
	    });
	    // return result
	    return ret
	}

	// nuke
	async function nuke(event) {
		// get upper context
		const post = $(this).parents().eq(6);
		// get post href
		const href = getPostHref(post);
		// confirm nuke-ing
		if (await nukeConfirmation(post)) {
			// log
			log('NUKE-ing!: ...' + href);
			// append processing html
			$(post).html(getProcessingHtml(href));
			// add css to elements
			$(post).find('#processing').css(getProcessingCss());
			// start nuking!
			await killEmAll(href);
			// remove react object
			removeReactObjects(href);
			// todo: error reporting, syncing with view
			// hide post from timeline
			hidePost(post);
		} else {
			rebindNukeCommand(post);
		}
	}

	/**
	 * nuke-button
	 *
	 * observe.mjs
	 */


	// on timeline change
	function onTimelineChange(mutations) {
		for (const mutation of mutations) {
			// append nuke button
			$(mutation.addedNodes).find(config.selectors.avatar).each((index, post) => { appendNukeButtonHtml(post); });
		}
	}

	function isUserPage() {
		// try to get username
		const username = window.location.href.split('/')[3];
		const url = `/${username}/header_photo`;
		// test for user page
		if ($('div').find(`a[href="${url}"]`).length == 1) {
			log(':is user page:');
			return true
		}
		// return false
		return false
	}

	// build userpage timeline selector
	function getUserPageTimelineSelector() {
		// get user display name
		const displayName = $('div[data-testid="UserName"]').find('span').first().text();
		const selector = `div[aria-label="Timeline: ${displayName}’s posts"]`;
		return selector
	}

	// observe timeline
	async function observeTimeline(selector) {
		// create observer with callback
		const observer = new MutationObserver((mutations) => { onTimelineChange(mutations); });
		// disconnect old observer
		// todo: not sure if this is necessary, maybe modals disconnect it anyway?
		gObservers.timeline.disconnect();
		gObservers.timeline = observer;
		// wait for timeline to load in
		await getElement(config.selectors.status);
		observer.observe($(selector).children().first()[0], { childList: true });
		// check if page has changed
		//if (!gPageChanged) {
		// add nuke button to initial posts
		addNukeButton();
		//}
	}

	// when home timeline navigation event is propagated
	function onHomeNavigationEvent() {
		// reset page changed if it was changed
		setPageChanged(false);
		// create timeline observer
		observeTimeline(config.selectors.hometl);
		log('home nav changed');
	}

	async function observeWindowHref() {
		setInterval(() => {
			// check if location changed
			if (gCurrentPage != window.location.href) {
				// update current page
				setCurrentPage(window.location.href);
				onWindowHrefChange();
			}
		}, 1000);
	}

	// observe for location changes
	function observeWindowHrefasdf() {
		// observer with callback
		const observer = new MutationObserver(() => {
			// check if location changed
			if (gCurrentPage != window.location.href) {
				// update current page
				setCurrentPage(window.location.href);
				onWindowHrefChange();
			}
		});
		gObservers.href.disconnect();
		gObservers.href = observer;
		observer.observe(document, { childList: true, subtree: true });
	}

	// process current page
	async function processCurrentPage(updatePage = false) {
		// check href location
		if (window.location.href.endsWith('home')) {
			// check for home
			// todo: work out updating this value after more back and forth browsing
			// todo: work out race conditions where polling fails
			// update page changed
			setPageChanged(updatePage ? true : false);
			addHomeNavigationListener();
			// wait for timeline to load in
			await getElement(config.selectors.hometl);
			// todo: dethrottle polling when no posts are loading
			observeTimeline(config.selectors.hometl);
		} else if (isUserPage()) {
			// check for userpage
			// update page changed
			setPageChanged(updatePage ? true : false);
			// get userpage timeline selector
			const selector = getUserPageTimelineSelector();
			// wait for timeline to load in
			await getElement(selector);
			observeTimeline(selector);
		} else if (window.location.href.includes('status')) {
			// check for status (post) view page
			// todo: editstatusview does not update correctly sometimes
			// todo: if you need to use 'view' for the post nuke-button does not populate to the main status
			//update page changed
			setPageChanged(updatePage ? true : false);
			// wait for timeline to load in
			await getElement(config.selectors.statustl);
			// change status view css
			editStatusViewCss();
			// obvserve timeline
			observeTimeline(config.selectors.statustl);
		} else if (window.location.href.includes('search?q=')) {
			// check for search page
			//update page changed
			setPageChanged(updatePage ? true : false);
			// wait for timeline to load in
			await getElement(config.selectors.searchtl);
			// observe timeline
			observeTimeline(config.selectors.searchtl);
		}
	}

	async function onWindowHrefChange() {
		log(`window href changed: ${window.location.href}`);
		// wait for react state
		const reactState = await pollReactState();
		// wait for login if necessary
		await isLoggedIn(reactState);
		// process current page
		processCurrentPage(true);
	}

	// add navigation listener
	function addHomeNavigationListener() {
		// add event listener for timeline tabs
		$(config.selectors.nav).eq(1).on('mousedown', onHomeNavigationEvent);
	}

	// setup mutation observers
	function observeApp() {
		// add timeline observer
		processCurrentPage();
		// add window location poling
		observeWindowHref();
	}

	/**
	 * nuke-button
	 *
	 * nuke-button.user.js
	 */

	(function () {
	    'use strict';

	    // main
	    async function main() {
	        // wait for react state
	        const reactState = await pollReactState();
	        // wait for login if necessary
	        await isLoggedIn(reactState);
	        // wait for timeline to load in
	        await getElement(config.selectors.tl);
	        // init globals
	        initGlobals();
	        // insert css
	        insertCss();
	        // observe
	        observeApp();
	    }

	    // run script
	    window.onload = main();

	})();

})();
