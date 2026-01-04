// ==UserScript==
// @name         AlienwareArena Auto Daily-Quests
// @namespace    U5levhE76dPtqAkMLISdx2sj7BES
// @version      0.4.4
// @description  Stop wasting time seeing the forum every time you forgot what to do with every daily quest
// @author       _SUDO
// @source       https://codeberg.org/Sudo/AlienwareArena-Auto-Daily-Quests
// @supportURL   https://codeberg.org/Sudo/AlienwareArena-Auto-Daily-Quests/issues
// @compatible   chrome Chrome + Tampermonkey or Violentmonkey
// @compatible   edge Edge + Tampermonkey or Violentmonkey
// @compatible   firefox Firefox + Greasemonkey or Tampermonkey or Violentmonkey
// @match        *://*.alienwarearena.com/
// @exclude      *://*.alienwarearena.com/account
// @icon         https://www.alienwarearena.com/favicon.ico
// @license      MIT
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_removeValueChangeListener
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM.notification
// @grant        GM.addStyle
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.removeValueChangeListener
// @connect      awaquest-a94f.restdb.io
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/437670/AlienwareArena%20Auto%20Daily-Quests.user.js
// @updateURL https://update.greasyfork.org/scripts/437670/AlienwareArena%20Auto%20Daily-Quests.meta.js
// ==/UserScript==
//* eslint-env browser, es6, greasemonkey, jquery */

'use strict'

var config = {
	//* When a new quest is not in your local copy of quests,
	//* send a request with the type, name and visit_url (if needed) of the new quest
	ALLOW_REPORT_NEW_QUESTS: true,

	//* When reporting, include your UUID (Universally unique identifier).
	//* All reports are approved manually, but if you include your UUID
	//* after a few reports approved, your UUID will be whitelisted and
	//* future reports will be automatically accepted without manual intervention.
	//* No raw UUID is saved directly. Please, check the Database documentation for more information.
	ALLOW_USERNAME_IN_REPORT: false,

	news_to_read: 4, // How many news will be automatically read. By default are 4 since sometimes news don't like to be read :3
	allow_modify_userAccount: true, // Allow modifying account "About me" section when performing `update_about_me` action (could remove mobile number)
	auto_claim_event_items: true, // If promotional events should be claimed automatically.
	auto_delete_comments: true, // If the comments when replying in forum should be deleted automatically afterwards.
	try_to_guess_quest: true, // When a quest is not found, tries to guess the quest automatically using the forums.
	use_browser_notif: true, // If the normal inside-page notifications can't be show, create a browser notification instead.
	use_quests_cache: true /* If the quests got from API should be cached and used later.
	This is useful when you have a slow internet connection and to reduce the server load.
	*/,
	use_sound_notif: true, // Allows using sound to get your attention when an error occurs that requires manual interaction.
	about_me_messages: [
		// Messages to use in "About Me" section of your profile. (UTF-8)
		'Those who know do not speak.\nThose who speak do not know.\n♥',
		"Imperfection is beauty, madness is genius and it's better to be absolutely ridiculous than absolutely boring.",
		'Find out who you are and do it on purpose.',
		"One's real life is often the life that one does not lead.",
	],
	forum_reply_comments: [
		// Messages to use when replying in forum. Are deleted afterwards if opted-in. (UTF-8)
		'ty',
		'Thanks',
		'Hey there, neighbor!',
		'Hello my baby, hello my honey, hello my neighbor!',
		'Hi! Thanks for the info.',
		'Hello World!',
	],
	verbose_logging: true, // If messages should be printed in console.
	dev_unsafe_mode: false, //! Expose variables and functions to the console (AD_*) and add shortcuts to some APIs.
}

/**
 * Log message to console.
 * Works exactly as `console.log()`
 * @param  {...any} args Arguments to be logged
 * @returns {void}
 */
function logger(...args) {
	if (!config.verbose_logging) return
	console.log('[AD]', ...args)
}
logger.error = function (...args) {
	if (!config.verbose_logging) return
	console.error('[AD]', ...args)
}

//** References to page URLs and element identifiers used in the script.
const ref = {
	pages: {
		mainURL: window.location.href,
		// APIs
		notifications: '/ajax/user/notifications/user-notifications-data',
		status: '/api/v1/users/arp/status',
		questAward: '/ajax/user/quest-award',
		// Pages
		ladder: '/rewards/leaderboard',
		news: '/esi/featured-tile-data/News',
		profile: '/account/personalization',
		account: '/account',
		mainForum: '/forums/board/113/awa-on-topic',
	},
	elements: {
		account: {
			// This is necessary.
			token: '#user_account_model__token',
			phone: '#user_account_model_phone',
			birthdayNotifications: '#user_account_model_birthdayNotifications',
			subscribeNewsletter: '#user_account_model_subscribeAlienware',
			customTitle: '#user_account_model_customTitle',
			twoFactorAuth: '#user_account_model_twoFactorEmailAuth',
			remindComputer: '#user_account_model_allowedComputer',
		},
		login: {
			btn: 'a.nav-link.nav-link-login',
			user: '#_username',
			pass: '#_password',
			remember: '#remember_me',
			login: '#_login',
		},
		quest: {
			container: '.quest-item',
			title: '.quest-title',
			progress: '.quest-item-progress',
		},
		quests: {
			avatars: 'div[id*=avatar-]',
			badges:
				'.account-badges__list-badge:not(.disabled):not(.account-badges__list-badge--highlight)',
			borders: '.account-borders__list-border:not(.disabled)',
			eventCalendar: '.promotional-calendar__day-claim',
		},
		forums: {
			// The forum lists threads for both, web and mobile, being fewer for mobile. So using `.text-title`
			// we ensure it will only pick all the desktop threads and prevent parsing duplicates.
			threads: '.text-title .forums__topic-link',
			// The news posts body uses a single div(`.news__landing-content.ucf__content`) as a container,
			// while the "Regular posts" uses it to display all the user info as well as the comments.
			newsBody: '.news__landing-content.ucf__content',
			regularBody: 'article:not(.post) .ucf__content div[id^="post-content"]',
		},
	},
}

/**
 * Quest Object structure
 * @typedef {object} QuestObject
 * @type {object}
 * @property {!string} type Quest type name (e.g. 'change_badge')
 * @property {!string} title Quest name (title)
 * @property {?string} visit_url Relative URL of the page to visit (no actions required)
 * @property {?boolean} revalidated If this quest was already revalidated (refetched)
 * @property {?HTMLElement} element Element used to get the quest
 */
/**
 * This array of objects is used to store all the actions to perform to complete a certain quest.
 * @param {string} type Name of type, listed in `/api/v1/users/arp/status`
 * @param {{qName: string}} action On quest match, this will be executed. Receive quest name as a prop.
 */
const quests = [
	{
		//* This is a special type of quest
		//* Since is used with any quest that contains "visit_url"
		//* or to handle clickable quests (quest with href attribute)
		type: 'visit_url',
		action: (qName, visit_url = '/') => {
			logger(`Visiting URL: ${visit_url}`)
			if (visit_url.indexOf('://') > 0 || visit_url.indexOf('//') === 0)
				// Check if we are dealing with an absolute URL
				visit_url = new URL(visit_url)
			// If not, then is a relative URL and need the base URL
			else visit_url = new URL(visit_url, ref.pages.mainURL)

			logger('Formated URL to visit:', visit_url)

			//* Prevent leaking data and raising CORS errors
			// If the URL does not belong to AWA, then probably will require
			// extra steps to complete the quest (like a custom request),
			// and until then, we will just do nothing but inform the user.
			const winURL = new URL(ref.pages.mainURL).host.split('.').reverse()
			const questURL = visit_url.host.split('.').reverse()

			if (
				// Verify if top-level and second-level domains do not match
				winURL[0] !== questURL[0] ||
				winURL[1] !== questURL[1]
			) {
				logger('Link leads to outside ot AWA domain. Rejecting...')
				AD.notifyUser(
					`URL leads outside of AlienwareArena! Please visit the link manually.`,
					'error'
				)
				return
			}

			$.ajax({
				//* We need to use the pathname to avoid caring about regional subdomains
				//* that will cause CORS (eg. na.alienwarearena.com)
				url: visit_url.pathname,
				type: 'get',
			})
				.done(() => {
					logger('Got response from page', visit_url)
					AD.afterQuestCompletion(qName)
				})
				.fail(({ status, statusText }) => {
					logger.error('Request Error: getting page to visit!', {
						status,
						statusText,
					})
					AD.notifyUser('Error getting page to visit', 'error')
				})
		},
	},
	{
		type: 'read_articles',
		action: (qName) => {
			AD.getNews((news) => {
				if (!news) return

				// First, we need to fetch the current featured news IDs. Then get
				// the page to simulate like if it was opened normally in a tab.

				// Populate array
				let newsToRead = []
				for (let i = 0; i < (config.news_to_read || 4); i++)
					newsToRead.push(news.data[i])

				const promises = newsToRead.map((newsObj) => {
					return new Promise((resolve, reject) =>
						$.ajax({
							url: newsObj.url,
							type: 'get',
						})
							.done(() => {
								logger(`Post request send to news: ${newsObj.id}`)
								return resolve()
							})
							.fail(({ status, statusText }) => {
								logger.error(`Error in request to news ${newsObj.id}:`, {
									status,
									statusText,
								})
								return reject()
							})
					)
				})

				//* Wait until all promises are fulfilled
				//* and check for any rejections to notify the user. Errors included
				Promise.allSettled(promises).then((values) => {
					if (values.find((val) => val.status === 'rejected')) {
						AD.notifyUser(
							'Some requests were rejected, check the console for more information',
							'error'
						)
						return
					}

					AD.afterQuestCompletion(qName)
				})
			})
		},
	},
	{
		type: 'post_replies',
		action: (qName) => {
			//* NOTE: articles can be used too! (more reliable than forum)
			//* Add: https://www.alienwarearena.com/comments/${post_id}/new/ucf
			//* Remove: https://www.alienwarearena.com/forums/post/delete/${postId}

			// Create comment, see http://mdn.io/FormData
			// If you want to customize this, I suggest creating your own message with the forum editor
			// and using the "SOURCE" button of the same editor to display how is formated
			const commentURL = 2158410
			const formData = new FormData()
			formData.append(
				'topic_post[content]',
				`<p>${
					config.forum_reply_comments[
						Math.floor(Math.random() * config.forum_reply_comments.length)
					] || 'Hello World!'
				}</p>`
			)

			logger(`Send to: ${ref.pages.mainURL}/ucf/show/${commentURL}`)
			$.ajax({
				url: `/comments/${commentURL}/new/ucf`,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
			})
				.done((post_response) => {
					logger('Successfully reply in forum!')
					if (!config.auto_delete_comments) {
						logger('User opt-out of reply deletion')
						AD.notifyUser('Successfully reply in forum')
						AD.afterQuestCompletion(qName)
						return
					}
					AD.notifyUser(
						'Successfully reply in forum\nTrying to delete reply...'
					)

					const { postId } = post_response

					console.assert(
						post_response || postId,
						{ id: postId, response: post_response },
						'[AD] Error in forum response object'
					)

					// Now try to delete the reply
					// FIXME: some post found are deleted/hidden/blocked (returns 404) but allows to post on BUT NOT REMOVE THE COMMENT
					// *^ Filter them or just ignore the warning..? No user should be able to access them!!! (really is a issue from the site not mine)
					$.ajax({
						url: `/forums/post/delete/${postId}`,
						type: 'POST',
					})
						.done(() => {
							logger('Successfully deleted previous reply in forum!')
							AD.notifyUser('Removed previous reply in forum')
							AD.afterQuestCompletion(qName)
						})
						.fail(({ status, statusText }) => {
							logger.error(
								'Error trying to delete the previous reply in forum!',
								{ status, statusText }
							)
							AD.notifyUser(
								`Error trying to delete the previous reply in forum.\nPlease check manually at "${ref.pages.mainURL}/ucf/show/${commentURL}".`,
								'error'
							)
						})
				})
				.fail(({ status, statusText }) => {
					logger.error('Error trying to reply in forum', {
						status,
						statusText,
					})
					AD.notifyUser(`Error trying to reply in forum.`, 'error')
				})
		},
	},
	{
		type: 'change_border',
		action: async (qName) => {
			/*change border*/
			const doc = await AD.domParsePage(ref.pages.profile)
			const borders = AD.getRandomElement(ref.elements.quests.borders, doc)

			if (!borders) {
				AD.notifyUser(
					'You need at least one border unlocked to complete this task.\nPlease, upload one and try again later.',
					'error'
				)
				return
			}

			const selectBorderID = borders.getAttribute('data-border-id')
			logger('BORDER:', selectBorderID)
			$.ajax({
				url: '/border/select',
				type: 'POST',
				data: JSON.stringify({ id: selectBorderID }),
			})
				.done(() => {
					logger('Successfully changed border *wink wink*')
					AD.afterQuestCompletion(qName)
				})
				.fail(({ status, statusText }) => {
					logger.error('Error trying to change border', {
						status,
						statusText,
					})
				})
		},
	},
	{
		type: 'share_page',
		action: (qName) => {
			/* read news */
			AD.getNews((news) => {
				if (!news) return

				// Get the last posted news
				// and fake share event to backend
				$.ajax({
					url: `/arp/quests/share/${news.data[0].id}`,
					type: 'post',
				})
					.done(() => {
						logger('Successfully shared *wink wink*')
						AD.afterQuestCompletion(qName)
					})
					.fail(({ status, statusText }) => {
						logger.error('Error trying to fake share', { status, statusText })
					})
			})
		},
	},
	{
		type: 'change_avatar',
		action: (qName) => {
			/*change your avatar (aka pfp)*/

			//! Temp fix: change avatar quests were replaced by change border quests
			return quests[3].action(qName)
		},
	},
	{
		type: 'change_badge',
		action: async (qName) => {
			/*change badges*/
			const doc = await AD.domParsePage(ref.pages.profile)
			const badges = () => AD.getRandomElement(ref.elements.quests.badges, doc)
			logger('Badges:', badges())

			// All users start already with 56 badges
			// But I will keep this check just in case
			if (!badges()) {
				AD.notifyUser(
					'You need at least one badge to change it automatically.',
					'error'
				)
				return
			}

			// Populate the badges array, at least we know that al least one badge will be used
			// All users can have a total of 5 badges. Any duplicated badge ID will be rejected.
			const badges_ids = new Set()
			for (let i = 0; i < 5; i++)
				badges_ids.add(badges().getAttribute('data-badge-id'))

			logger(`${badges_ids.size} Badges:`, badges_ids)

			$.ajax({
				url: `/badges/update/${AD.getUser().id}`, // url update uses user_id
				type: 'post',
				data: JSON.stringify([...badges_ids]), // Convert set to array
			})
				.done((e) => {
					logger('Successfully changed badges', e)
					AD.afterQuestCompletion(qName)
				})
				.fail(({ status, statusText }) =>
					logger.error('Error trying to change badges', {
						status,
						statusText,
					})
				)
		},
	},
	{
		type: 'update_about_me',
		action: async (qName) => {
			if (!config.allow_modify_userAccount) {
				logger('User opt-out of account modification')
				AD.notifyUser(
					'You have op-out of account modification, please update your "About me" manually',
					'info'
				)
				return
			}

			const doc = await AD.domParsePage(ref.pages.account)
			const _ref = ref.elements.account
			const formData = {
				//* That's what I get it the request. I'm unsure what contains with phone number...
				// TODO: add phone number support
				/**
				 * @param {!string} username Account username
				 * @param {!string} [phone=''] Account phone number. Can be empty
				 * @param {!number} birthdayNotifications Number as boolean. If user will receive birthday notification
				 * @param {number} [subscribeAlienware] Number as boolean. If user will receive the alienwarearena newsletter
				 * @param {number} [twoFactorEmailAuth] Number as boolean. If user will need to 2FA by email to log in
				 * @param {number} [allowedComputer] Number as boolean. If user will be remembered when log in with 2FA enabled
				 * @param {!string} _token Authentication token embedded in form
				 * @param {!string} about About the user message to display on their profile
				 * @param {string} [customTitle] Hidden - not use for now? Replaces `rank` in the Status API object
				 */
				user_account_model: {
					username: AD.getUser().userName,
					phone: '',
					birthdayNotifications:
						AD.getElement(_ref.birthdayNotifications, doc)?.value.toString() ??
						0,
					subscribeAlienware:
						AD.getElement(_ref.subscribeNewsletter, doc)?.value.toString() ?? 0,

					//* Custom title seems to be useless and not configurable right now after setting it
					//* But if you were lucky enough to get it, perhaps whe should keep it for sure!
					...(AD.getElement(_ref.customTitle, doc, true)?.value && {
						customTitle:
							AD.getElement(_ref.customTitle, doc)?.value.toString() ?? '',
					}),

					//* We need to check if 2FA is ENABLED to include it
					//* If not, no matter the value, always will be enabled if included
					//* Also, Remember this computer is only in the document when 2FA is enabled
					//! MORE ANNOYING BUGS TO DEAL WITH! :)
					...(AD.getElement(_ref.twoFactorAuth, doc)?.checked && {
						twoFactorEmailAuth: 1,

						...(AD.getElement(_ref.remindComputer, doc)?.checked && {
							allowedComputer: 1,
						}),
					}),

					_token: () => AD.getElement(_ref.token, doc).value,
					about:
						config.about_me_messages[
							Math.floor(Math.random() * config.about_me_messages.length)
						] || 'Hello World!',
				},
			}

			// We could use query params and all stuff here, but
			// Jquery has a build in function to make our like easier $.param()
			$.ajax({
				url: ref.pages.account,
				type: 'post',
				data: $.param(formData),
				processData: true,
				contentType: 'application/x-www-form-urlencoded',
			})
				.done(() => {
					logger('Successfully updated about message *wink wink*')
					AD.afterQuestCompletion(qName)
				})
				.fail(({ status, statusText }) =>
					logger.error('Error trying to fake about message', {
						status,
						statusText,
					})
				)
		},
	},
]

// You are free to use the API in other AWA related projects!
const API_QUESTS_URL = 'https://awaquest-a94f.restdb.io/rest/quests'
const API_KEY = '625f4505fcf9897eb1119d6f'

/**
 * Will serve as cache for the quests
 * @type {QuestObject[]}
 */
let statusCache = null

/**
 * Will serve as cache for news
 * @type {NewsResponseObject[]}
 */
let newsCache = null

//** Allow to track if a refetch was already performed
let shouldRefetch = true

/**
 * @typedef {Object} __QUESTS__
 * @type {Object}
 * @property {string} type Quest type
 * @property {Array.<string>} names Quest name
 * @property {string} [visit_url] URL needed to visit to complete the quest
 */
/**
 * Allows to save a local copy of the quest status in the userscript storage
 * @param {__QUESTS__ | __QUESTS__[]} quest Quest object or array of quest objects
 * @returns {void}
 */
async function saveQuest(quest) {
	if (!quest || !config.use_quests_cache) return
	logger('Saving quests to userscript storage')

	// Save the current time as a string in ISO format
	// to keep track of when the quest was last updated
	GM_setValue('LAST_UPDATE', new Date().toISOString())

	// If its an array just save it straight to the storage
	// because its likely the response from the API
	if (Array.isArray(quest)) {
		// Remove any unused _id from the quest objects
		quest.forEach((object) => delete object['_id'])

		// Save the quest to the storage
		GM_setValue('quests', JSON.stringify(quest))
		return
	}

	// If it's not an array, then we know that the quest to save is a new
	// quest from a new report, so we need to add to its correct object

	const quests = await JSON.parse(GM_getValue('quests', []))

	// Remove any duplicates
	quest = [...new Set(quest)]

	// TODO: add logic for saving new quest without wipping others from storage
}

/**
 * Get the quest list from the API and update cache
 * @param {boolean} forceUpdate If true, will force a refetch from the API
 * @returns {Promise<__QUESTS__[]>}
 */
async function getQuests(forceUpdate = false) {
	return new Promise(async (resolve, reject) => {
		if (!forceUpdate && config.use_quests_cache) {
			// If user opt-out of cache, just ignore the cache
			// and fetch the quests from the API
			const savedQuests = await JSON.parse(GM_getValue('quests', null))

			if (savedQuests?.length > 0) {
				logger('Using storaged quests')
				return resolve(savedQuests)
			}
		}

		// If we are here, then was a forced update or no quest is saved/allowed in the storage
		// But first, check if we the last update was at least 30 minutes ago
		if (forceUpdate && config.use_quests_cache) {
			const lastUpdate = await GM_getValue('LAST_UPDATE', null)

			if (lastUpdate) {
				const lastUpdateDate = new Date(lastUpdate) // Parse to date object
				const now = new Date()
				const diff = now.getTime() - lastUpdateDate.getTime()

				// Check if is in the same day
				if (lastUpdateDate.toLocaleDateString() === now.toLocaleDateString()) {
					// Check if the difference is greater than 30 minutes
					if (diff < 1000 * 60 * 30) {
						logger('Last update was less than 30 minutes ago!')
						// Try to use the saved quests from the storage
						const savedQuests = await JSON.parse(GM_getValue('quests', null))
						if (savedQuests && savedQuests.length > 0)
							return resolve(savedQuests)
					}
				}
			}
			//* If no quests were saved, just continue to fetch the quests from the API normally
		}

		//* NOTE: You need to open the Browser Toolbox to see XMLHttpRequests
		GM_xmlhttpRequest({
			method: 'GET',
			url: API_QUESTS_URL,
			anonymous: true, // Do not send cookies
			fetch: true, // Use fetch API if available
			headers: {
				'content-type': 'application/json',
				'x-apikey': API_KEY,
			},
			onload: (response) => {
				logger('Got quests from API:', response)

				if (response.status !== 200)
					return reject(new Error('API Error', response))

				const quests = JSON.parse(response.responseText)

				// Save response to cache
				saveQuest(quests)

				resolve(quests)
			},
			onerror: (response) => reject(new Error('API Error', response)),
		})
	})
}

/**
 *
 * @param {string} type Quest type name
 * @param {string} name Quest name
 * @param {string} [visit_url] Relative URL of the page to visit (no actions required)
 * @param {number} [userID] User ID to use if opted-in
 * @returns {Promise<Boolean>} If the report succeeded
 */
async function reportNewQuest({ type, name, visitURL, userID }) {
	if (!type || !name) throw new Error('Missing type or name')

	return new Promise((resolve, reject) => {
		//* NOTE: You need to open the Browser Toolbox to see XMLHttpRequests
		GM_xmlhttpRequest({
			method: 'POST',
			url: API_QUESTS_URL,
			anonymous: true, // Do not send cookies
			fetch: true, // Use fetch API if available
			headers: {
				'content-type': 'application/json',
				'x-apikey': API_KEY,
			},
			data: {
				quest: {
					type,
					name,
					visit_url: new URL(visitURL).pathname,
					...(config.ALLOW_USERNAME_IN_REPORT && userID && { user_id: userID }),
				},
			},
			onload: (response) => {
				if (response.status !== 200) {
					return reject(new Error('API Error', response))
				}

				// If we succeeded, save the response with updated quests to cache
				saveQuest({ type, name })

				resolve(true)
			},
			onerror: (response) => reject(new Error('API Error', response)),
		})
	})
}

/**
 * Play a sound to get the user's attention
 * @see {@link https://marcgg.com/blog/2016/11/01/javascript-audio/}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/AudioContext}
 */
function notifSound() {
	if (!config.use_sound_notif) {
		logger('User disabled sound notifications')
		return
	}

	try {
		const AudioContext = window.AudioContext || window.webkitAudioContext
		const context = new AudioContext()
		const audio = context.createOscillator()
		const audioAMP = context.createGain()
		const audioLow = context.createOscillator()

		audio.type = 'sine'
		audio.frequency.value = 400
		audioAMP.gain.value = 1
		audioLow.type = 'square'
		audioLow.frequency.value = 10

		audioLow.connect(audioAMP.gain)
		audio.connect(audioAMP).connect(context.destination)
		audioLow.start()
		audio.start()

		// 1 second later, stop the oscillators
		audioLow.stop(1)
		audio.stop(1)
	} catch (err) {
		logger.error('Audio Notification Sound Error!', err)
	}
}

class AutoDaily {
	logAccountIn() {
		// Notify user
		AD.notifyUser('Login to allow me to automate your daily points :)')

		/*
			//* Auto loggin if you want...
			const mail = 'example@horsefucker.org'
			const pass = 'yoursupersecretpasswordhere'

			const loginBTN = AD.getElement(ref.elements.login.btn)
			loginBTN.click()

			//* Await 1sec
			setTimeout(() => {
				//* Try to login
				const mailBTN = AD.getElement(ref.elements.login.user)
				const passBTN = AD.getElement(ref.elements.login.pass)

				mailBTN.value = mail
				passBTN.value = pass

				//* Should remember user?
				const rememberMe = AD.getElement(ref.elements.login.remember)
				rememberMe.checked = true

				//* Click login BTN
				AD.getElement(ref.elements.login.login).click()
			}, 1000)
		*/
	}

	/**
	 * Try to get user notifications and check their success response
	 * @returns {Promise<boolean>} If user is logged in
	 */
	async isUserLogged() {
		//* Can be used a global variable embedded:
		//* window.user_is_logged_in
		return new Promise((resolve) =>
			$.ajax({
				url: ref.pages.notifications,
				type: 'get',
			})
				.done((resp) => {
					if (resp.success) {
						logger('User is logged in :)')
						return resolve(true)
					}

					logger('User is not logged in')
					return resolve(false)
				})
				.fail(({ status, statusText }) => {
					logger.error('isLoggedIn() unexpected error!', {
						status,
						statusText,
					})
					return resolve(false)
				})
		)
	}

	async initAutoQuest() {
		logger('initAutoQuest()')

		//* Execute all quests found
		const quests = await AD.getUserStatus()
		quests.forEach((_quest) => {
			//* If quest is already completed, skip it
			if (this.isQuestCompleted(_quest)) return

			logger('initAutoQuest(): Executing quest\n', _quest)
			this.solveQuest(_quest)
		})
	}

	/**
	 * Tries to execute a quest action by the given type
	 * @param {QuestObject} _quest Quest object
	 * @returns {boolean} If quest was found and executed
	 */
	execQuestAction(_quest) {
		const { title, type, visit_url } = _quest

		const qType = quests.find((e) => e.type.includes(type))
		if (qType) {
			logger(`Executing quest "${title}" ${type} action()`)
			qType.action(title, visit_url)
			return true
		}
		return false
	}

	/**
	 * Tries to solve a quest
	 * @param {QuestObject} _quest Quest object
	 * @returns {void}
	 */
	solveQuest(_quest) {
		const { title, element } = _quest

		const questTitle = AD.getElement(ref.elements.quest.title, element)

		//* If quest was executed, stop here
		if (this.execQuestAction(_quest)) return

		//* Ignore this if the quest was revalidated
		if (!_quest.revalidated) {
			if (questTitle.nodeName === 'A' && questTitle.href !== '#') {
				logger('Quest has a link:', questTitle.href)

				//! Temp: ignore event quests
				if (/\/quests\//i.test(questTitle.href.toString())) {
					logger('Quest link contains "/quest/", ignoring quest:', _quest)
					AD.notifyUser(`Quest "${_quest.title}" requires manual interaction`)
					return
				}

				//* If the element has a quest ID, use the visit_url action
				//* with the ID instead of the element's link
				const questID = questTitle.getAttribute('data-quest-id')
				if (questID) {
					logger('Quest has a "data-quest-id" attribute:', questID)
					quests[0].action(title, `${ref.pages.questAward}/${questID}`)
					return
				}

				//* Use the visit_url action to complete the quest
				quests[0].action(title, questTitle.href)
				return
			}
		}

		logger('Quest has no link')
		this.questNotFound(_quest)
	}

	/**
	 * @param {!boolean} [forceUpdate] If true, will skip saved cache (if exists)
	 * @param {?HTMLBodyElement} [document] Document element to use
	 * @returns {Promise<QuestObject[]>}
	 */
	static async getUserStatus(forceUpdate = false) {
		return new Promise(async (resolve) => {
			if ((!forceUpdate || !shouldRefetch) && statusCache) {
				logger('Returning status from cache')
				return resolve(statusCache)
			}

			//* If we are too early and no quest was set, then we just ignore it and throw an error
			const questElements = AD.getElement(
				[ref.elements.quest.container],
				document.body,
				true
			)
			if (!questElements.length) throw new Error('Quest element not found!')

			const _quests = await getQuests(forceUpdate)

			// Create a new array with all the quests found
			const val = [...questElements].map((element) => {
				const questName = AD.getElement(ref.elements.quest.title, element)
				const questProgress = AD.getElement(
					ref.elements.quest.progress,
					element
				)

				if (!questName || !questProgress)
					throw new Error('Quest elements not found!')

				// Check if the quest name is stored in the storage
				const questObject = _quests.find((object) =>
					object.names.find((name) =>
						name.includes(AD.normalizeQuestName(questName.innerText))
					)
				)

				// Check if the quest found contains the `visit_url` property and
				// add to the object the type as `visit_url` and the url to use
				if (questObject?.visit_url) questObject.type = 'visit_url'

				return {
					type: questObject?.type || 'unknown_quest',
					title: questName.innerText,
					completed: questProgress.innerText === 'COMPLETE',
					visit_url: questObject?.visit_url || null,
					element,
				}
			})

			// Save object to cache
			logger('Saved quests to status cache!', val)
			statusCache = val

			return resolve(val)
		})
	}

	/**
	 * @param {QuestObject} _quest Quest object
	 * @returns {void}
	 */
	async questNotFound(_quest) {
		logger('Quest not found!')

		//* If the quest is not found and the storage cache is being used
		//* then it's probably because the saved quests are not updated,
		//* so we will try to refetch the quests again
		if (config.use_quests_cache && !_quest.revalidated) {
			logger('Quest not found, refetching quests...')
			shouldRefetch = true
			AD.getUserStatus(true).then((quests) =>
				this.solveQuest({
					...quests.find((q) => q.title === _quest.title),
					//* Add a revalidated property to avoid refetching this quest again
					revalidated: true,
				})
			)

			return
		}

		// If we are at this point:
		// The DB is outdated or the quest is reading a specific article
		//* Check if the quest name is included in any of the news
		//* Normally, this quest name is like "New Alienware!"
		const news = await AD.getNews()
		const found = () => {
			if (!news) return

			const foundItem = news.data.find((item) =>
				AD.normalizeQuestName(item.title).includes(
					AD.normalizeQuestName(_quest.title)
				)
			)

			if (!foundItem) return

			// Visit the article page
			// TODO: report quest
			quests[0].action(_quest.title, foundItem.url)
			return true
		}
		if (found()) return

		if (!config.try_to_guess_quest) {
			logger('User opt-out of trying to guess quests')
			AD.notifyUser('Quest not found, requires manual interaction :(', 'error')
			return
		}

		//* If the quest is not found in the news, then we will try to guess
		logger('Quest not found in news. Trying to guess the quest...')
		const perf = performance.now()
		const guess = await AD.guessQuest(_quest)
		logger('Guessing quest took:', performance.now() - perf)

		//* If the quest was guessed, then we will execute
		//* whatever the type of the quest is and hope for the best
		if (guess?.quest) {
			const wasExecuted = this.execQuestAction({
				..._quest,
				type: guess.quest,
			})
			if (wasExecuted) {
				return
			}
		}

		//* If not, check if the guess have visited an URL
		else if (guess?.visit_url?.length) {
			return
		}

		//* If the quest guess was not executed, then we will notify the user
		AD.notifyUser('Quest not guessed. Requires manual interaction :(', 'error')
	}

	/**
	 * Returns complete status of the quest
	 * @returns {Promise<Boolean>}
	 */
	isQuestCompleted({ completed, title }) {
		if (completed) {
			logger(`Quest "${title}" is already completed`)
			AD.notifyUser(`Quest "${title}" is already completed :D`)
			return true
		}

		logger(`Quest "${title}" not completed `)
		return false
	}

	/**
	 * If user opt-in and the promotion calendar is available,
	 * then will automatically claim day's reward
	 * @returns {void}
	 */
	async claimPromotionalRewards() {
		logger('claimPromotionalRewards()...')

		if (!config.auto_claim_event_items) {
			logger('User opt-out of promotions claiming')
			return
		}

		// eslint-disable-next-line no-constant-condition
		if (!typeof unsafeWindow.recaptchaCallbackPacClaim === 'function') {
			logger.error('No recaptcha claim functions available')
			return
		}

		const rewardIDs = [
			...AD.getElement([ref.elements.quests.eventCalendar], document, true),
		].map((id) => id?.getAttribute('data-id'))

		if (!rewardIDs.length) {
			logger('No rewards found')
			return
		}

		//* Get promotional reward link from the document
		const calendarRewardID = document.body.textContent.match(
			/promotional-calendar\/claim\/\d+\//
		)[0]

		if (!calendarRewardID) {
			logger('No calendar reward was found')
			return
		}

		logger(`Reward IDs: ${rewardIDs}`)

		const promises = rewardIDs.map(async (id) => {
			// Wait until recaptcha token is generated
			await unsafeWindow.recaptchaCallbackPacClaim()

			return new Promise((resolve, reject) =>
				$.ajax({
					type: 'POST',
					url: calendarRewardID + id,
					data: JSON.stringify({
						token: unsafeWindow.pacRecaptchaToken,
					}),
				})
					.done((data) => {
						logger('Successfully claimed event reward', data)
						return resolve()
					})
					.fail(({ status, statusText }) => {
						logger.error('Error trying to claim event reward', {
							status,
							statusText,
						})
						return reject()
					})
			)
		})

		//* Wait until all promises are fulfilled
		//* and check for any rejections to notify the user. Errors included
		Promise.allSettled(promises).then((values) => {
			if (values.find((val) => val.status === 'rejected')) {
				AD.notifyUser(
					'Some requests were rejected when claiming event rewards, check the console for more information',
					'error'
				)
				return
			}

			AD.notifyUser('Successfully claimed all event rewards', 'success')
		})
	}

	/**
	 * Allows performing extra actions after a quest was completed.
	 * @param {string} questName Name of the completed quest
	 * @returns {void}
	 */
	static afterQuestCompletion(questName) {
		logger('afterQuestCompletion()...')
		AD.notifyUser(
			`${questName} quest completed!<br/>Refresh the page to see the updated quest`
		)
	}

	/**
	 * Create visual in-site notification
	 * @param {string} msg Message
	 * @param {"info"|"success"|"warning"|"error"} type The color of the message will use the type
	 * @see {@link https://github.com/mouse0270/bootstrap-notify}
	 */
	static notifyUser(msg, type = 'info') {
		const browserNotif = () => {
			if (typeof GM_notification === 'function') {
				GM_notification({
					title: GM_info.script.name,
					text: `[${type.toUpperCase()}] ${msg}`,
					silent: false,
					// image:
				})
			}
		}

		try {
			$.notify(
				{
					element: 'body',
					// options
					// title: GM_info.script.name,
					message: msg,
				},
				{
					// settings
					z_index: 9999,
					// newest_on_top: true,
					placement: {
						from: 'top',
						align: 'left',
					},
					type: type,
					onShow: () => {
						logger('onShow()...')
						// Make a sound if is important
						if (type === 'warning' || type === 'error') {
							console.log('sound here.', msg)
							notifSound()
						}
					},
					delay: null, // need to be set or will cause the toast to keep triggering re-renders
					timer: null,
					allow_dismiss: true,
				}
			)
		} catch (err) {
			logger.error(
				'notifyUser(): ERROR creating notification.\nMaybe JQuery is not loaded'
			)
			if (config.use_browser_notif) browserNotif()
		}
	}

	/* ----------
	 *    UTILS
	 * ----------
	 */

	/**
	 * @typedef {object} getUserObject
	 * @type {object}
	 * @property {?number|string} userId User ID
	 * @property {?string} uuid User UUID
	 * @property {?string} userName User name
	 */
	/**
	 * Allows to get the user specify data from exposed variables
	 * @returns {getUserObject} Returns null on error
	 */
	static getUser() {
		//* user_id is present in every page as one of the embedded variables
		//* If not, can be obtained with: `ref.pages.notifications`
		// Please, if anyone has problems with this way of getting your user ID.
		// Let me know and I'll use the notifications instead

		const id = unsafeWindow.user_id
		const userName = unsafeWindow.user_username
		const uuid = unsafeWindow.user_uuid

		return {
			id: typeof id === 'number' || typeof id === 'string' ? id : null,
			uuid: typeof uuid === 'string' ? uuid : null,
			userName: typeof userName === 'string' ? userName : null,
		}
	}

	/**
	 * Removes all diacritics, symbols and punctuation characters
	 * from the quest name and convert the string to lower case
	 * @param {string} questName
	 * @param {string} [replaceSpacesWith] Character used to replace spaces
	 * @returns {string} Returns the normalized quest name
	 */
	static normalizeQuestName(questName, replaceSpacesWith) {
		//* Remove diacritics, symbols and punctuation characters
		questName = questName
			.toLocaleLowerCase()
			.normalize('NFD')
			.replace(/([\u0300-\u036f]|[^0-9a-zA-Z ])/g, '')
			.trim() // Remove spaces at the beginning and end of the string

		//* Replace spaces if requested
		if (replaceSpacesWith)
			questName = questName.replace(/\s/g, replaceSpacesWith)

		return questName
	}

	/**
	 * Allows to get a HTML element with error handling.
	 * If query string is inside of an array then all matches will be returned
	 * @param {DOMString | [DOMString]} element Element/s Query selector
	 * @param {HTMLElement} [parent=document] The parent node of the element
	 * @param {boolean} [noNotify=false] If the error notification should be suppressed
	 * @returns {HTMLElement|NodeList|null}
	 */
	static getElement(element, parent = document, noNotify = false) {
		// Keep track of the element type
		const isArray = Array.isArray(element)

		const _elem = parent.querySelectorAll(isArray ? element[0] : element)
		if (!_elem.length) {
			logger.error(`Error trying to get "${element}"`)
			if (!noNotify) AD.notifyUser('Error trying to get an element', 'error')

			return isArray ? [] : null
		}

		//* If the element is an array, then is expected to return all matches
		//* Otherwise the first element will be returned
		return isArray ? _elem : _elem[0]
	}

	/**
	 * Allows to pick a random HTML element with error handling
	 * @param {DOMString} element Elements Query selector
	 * @param {HTMLElement} [parent=document] The parent node of the element
	 * @param {boolean} [noNotify=false] If the error notification should be suppressed
	 * @returns {HTMLElement|null} Random element
	 */
	static getRandomElement(element, parent = document, noNotify = false) {
		const _elem = AD.getElement([element], parent, noNotify)
		return _elem.length ? _elem[Math.floor(Math.random() * _elem.length)] : null
	}

	/**
	 * @typedef {object} NewsResponseObject
	 * @type {object}
	 * @property {number} id News ID
	 * @property {string} title News title
	 * @property {string} description News short description
	 * @property {string} url News url
	 * @property {boolean} featured	News comments
	 * @property {string} postedAt News date posted
	 * @property {number} upVotes	News up votes
	 * @property {number} downVotes	News up downvotes
	 * @property {string} image News image url
	 * @property {string} author News author
	 * @property {string} blurb I have no idea what this is but is the same as description.
	 * @property {string} contentType	News content type? (probably leftover property)
	 */
	/**
	 * Callback for adding two numbers.
	 *
	 * @callback NewsResponseObjectCallback
	 * @param {[NewsResponseObject]|null} news - Response news data
	 */
	/**
	 * Get all news of the website
	 * @param {NewsResponseObjectCallback} callback Callback function to use the news object
	 * @returns {?Promise<[NewsResponseObject]>} Returns news
	 */
	static async getNews(callback) {
		if (newsCache) {
			logger('getNews(): Using cached news')
			if (typeof callback === 'function') return callback(newsCache)
			return newsCache
		}

		return $.ajax({
			url: ref.pages.news,
			type: 'get',
		})
			.done((news) => {
				// logger('News:\n', news)
				newsCache = news
				if (typeof callback === 'function') return callback(news)
				return news
			})
			.fail(({ status, statusText }) => {
				logger.error('Error getNews()', { status, statusText })
				if (typeof callback === 'function') return callback(null)
				return null
			})
	}

	/**
	 * @typedef {object} ForumThreadsObject
	 * @type {object}
	 * @property {string} title Thread title
	 * @property {string} url Thread URL
	 */
	/**
	 * Get all threads from a given forum
	 * @param {string} [filter] RegExp expression to filter the threads
	 * @param {string} [forumURL] Forum URL to get the posts.
	 * Defaults to: `ref.pages.mainForum`
	 * @example
	 * await getForumThreads(/(\[daily.*?\]|\[solved\])|(chit-chat)/i)
	 * @returns {Promise<ForumThreadsObject[]|[]>} Found threads
	 */
	static async getForumThreads(filter, forumURL = ref.pages.mainForum) {
		return new Promise(async (resolve, reject) => {
			const perf = performance.now()

			const forum = await AD.domParsePage(forumURL)
			if (!forum) {
				logger.error('Error getForum()', { forum })
				return reject([])
			}

			// Parse the forum threads and return an new array of
			// objects containing the thread's title and URL
			const threads = [
				...AD.getElement([ref.elements.forums.threads], forum),
			].map((thread) => ({
				title: thread.title,
				url: thread.href,
			}))

			logger('Parsed forum threads:\n', threads)

			if (filter) {
				// Filter the threads
				const filteredThreads = threads.filter((thread) =>
					filter.test(thread.title)
				)
				logger('Filtered forum threads:\n', filteredThreads)
				logger('Time to parse forum threads:', performance.now() - perf)
				return resolve(filteredThreads)
			}

			logger('Time to parse forum threads:', performance.now() - perf)
			return resolve(threads)
		})
	}

	/**
	 * Get the body of a given thread URL (works with news outside of the forum)
	 * @param {ForumPostsObject} threadURL
	 * @returns {?Promise<Element>} Thread body element or null if error
	 */
	static async getForumThreadBody(threadURL) {
		if (!threadURL) throw new TypeError('threadURL is required')

		return new Promise(async (resolve, reject) => {
			const thread = await AD.domParsePage(threadURL)
			if (!thread) {
				logger.error('Error getForumThread()', threadURL, thread)
				return reject(null)
			}

			// First we need to check if is an article or
			// user created thread and then get the body to return
			let threadBody = null

			threadBody = AD.getElement(ref.elements.forums.newsBody, thread, true)
			if (!threadBody) {
				// If not an article, get the normal thread body
				threadBody = AD.getElement(
					ref.elements.forums.regularBody,
					thread,
					true
				)
			}

			if (!threadBody) {
				logger.error(
					'Error getForumThreadBody(): no body element found',
					threadURL,
					thread
				)
				return reject(null)
			}

			logger('Parsed forum thread body:\n', threadBody)
			return resolve(threadBody)
		})
	}

	/**
	 * Quest Object structure
	 * @typedef {object} GuessObject
	 * @type {object}
	 * @property {object} guess
	 * @property {?string} guess.quest Quest guessed using key words (if null URLs where used)
	 * @property {!string[]} guess.visit_url=[] URL of the pages visited
	 * @property {!string} guess.guess_thread URL of the thread used to guess the quest
	 */
	/**
	 * Try to guess the quest based on its name using the main forums
	 * @param {QuestObject} _quest
	 * @returns {?Promise<GuessObject>}
	 */
	static async guessQuest(_quest) {
		logger('guessQuest()...')
		if (!_quest) throw new TypeError('quest is required')

		// Dinamically create a new RegExp to match the quest name
		const strRegEx = new RegExp(`([daily.*?]|[solved]).*?${_quest.title}`, 'i')

		// Check if any threads match the quest name
		const threads = await AD.getForumThreads(strRegEx)
		if (!threads.length) return null

		logger('Threads matching quest:', threads)

		// Get the first thread found and get their body content to guess the quest
		const threadBody = await AD.getForumThreadBody(threads[0].url)
		if (!threadBody) return null

		//* Guess quest (order by duplicates)
		// We need to test this with all the quests with actions
		// and then with all the quests without actions (click, visit, etc...)
		const content = threadBody.textContent.toLocaleLowerCase()

		let choice = null
		let guess = {
			quest: null,
			visit_url: [],
			guess_thread: threads[0].url,
		}

		// Includes border
		//! Note: avatar related things is the same as change_border|change_badge
		if (/border|avatar/.test(content)) choice = 'change_border'
		// Includes badge
		else if (/badge/.test(content)) choice = 'change_badge'
		// Includes share -> buttons?
		else if (/share|button|facebook|twitter|reddit/.test(content))
			choice = 'share_page'
		// Includes post/comment/reply
		else if (/post|comment|reply|replies/.test(content)) choice = 'post_replies'
		// Includes news/articles/blog ---> links?
		else if (/news|articles|blog|read/.test(content)) choice = 'read_articles'
		// Includes rewards
		else if (/reward/.test(content)) choice = 'visit_rewards'
		// Includes leaderboard ---> ranking?
		else if (/leaderboard|ladder|rank/.test(content))
			choice = 'visit_leaderboard'
		// Includes about me
		else if (/about|yourself|account/.test(content)) choice = 'update_about_me'

		if (choice) {
			const returnChoice = {
				...guess,
				quest: choice,
			}

			logger('guessQuest(): Quest guessed:', returnChoice)
			return returnChoice
		}

		//* Okay, we didn't find the quest in the thread body
		//* Let's try to guess it from links (if any)
		const link = AD.getElement(['a'], threadBody, true)
		if (!link.length) return null

		// Pass the links directly to the visit_link action
		link.forEach((e) => {
			logger(`guessQuest(): Visiting link "${e.href}"`)
			guess.visit_url.push(e.href)
			quests[0].action(_quest.title, e.href)
		})

		return guess
	}

	/**
	 * Allows to fetch the content of a page as a HTML document
	 * @param {!string} page URL of the page to parse
	 * @return {Promise|null} Parser body data
	 */
	static async domParsePage(page) {
		if (!page) throw new TypeError('domParsePage expected a page as parameter')

		return new Promise((resolve, reject) =>
			$.ajax({
				url: page,
				type: 'get',
			})
				.done((html) => {
					const parser = new DOMParser().parseFromString(html, 'text/html')

					/*
					* Create and open a page with the HTML document from the parser
					{
						let w = window.open()
						w.document.write(html)
						w.document.close()
					}
					*/

					return resolve(parser.body)
				})
				.fail(({ status, statusText }) => {
					logger.error('Error domParsePage()', { status, statusText })
					return reject(null)
				})
		)
	}

	async beforeInit() {
		logger('BeforeInit()...')

		//* Check if jquery is loaded. If not, I dought something will work...
		try {
			// eslint-disable-next-line
			jQuery()
		} catch (err) {
			logger.error('No JQuery found.\n', err)
			AD.notifyUser(
				'Looks like JQuery is not loaded in the page.\nPlease verify if any extension may be interfiering.',
				'warning'
			)
			return
		}

		// Used to restore notifications backgrounds/colors
		if (typeof GM_addStyle === 'function') {
			GM_addStyle(`
				.alert-success {
					color:#004a31
				}
				.alert-info {
					color:#007d7d;
					background-color:#ccfcfc;
					border-color:#b8fbfb
				}
				.alert-error {
					color:#7d0000;
					background-color:#fccccc;
					border-color:#fbb8b8
				}
				button.close {
					padding: 0;
					background-color: transparent;
					border: 0;
					appearance: none;
				}
				.close {
					float: right;
					font-size: 1.5rem;
					font-weight: 700;
					line-height: 1;
					color: #000;
					text-shadow: 0 1px 0 #fff;
					opacity: .5;
				}
				.close:hover {
					opacity: 1;
				}
			`)
		}

		//* Do not proceed if the user is not logged in
		if (!(await this.isUserLogged())) {
			this.logAccountIn()
			return
		}

		this.initAutoQuest()
		this.claimPromotionalRewards()
	}

	async restoreConfig() {
		if (typeof GM_setValue !== 'function' || typeof GM_getValue !== 'function')
			return this

		logger('restoreConfig(): Restoring config...')

		//* Add context menu options to save and remove the config
		if (
			typeof GM_registerMenuCommand === 'function' &&
			typeof GM_deleteValue === 'function'
		) {
			GM_registerMenuCommand(
				'Save current configuration',
				() => {
					logger('Saving current config...', config)
					GM_setValue('user_config', JSON.stringify(config))
				},
				null
			)
			GM_registerMenuCommand(
				'Remove saved configuration',
				() => {
					logger('Removing saved config...')
					GM_deleteValue('user_config')
				},
				null
			)
		}

		//* Try to restore any saved configuration from localStorage
		const userConfig = await JSON.parse(GM_getValue('user_config', null))

		if (!userConfig) {
			logger('No config found in localStorage')
			return this
		}

		logger('restoreConfig(): User config found in storage', userConfig)

		//* Make typeof work properly
		const typeOf = (value) =>
			({}.toString
				.call(value)
				.match(/\s([a-zA-Z]+)/)[1]
				.toLowerCase())

		//* Only replace existing keys in the default config
		Object.keys(userConfig).forEach((key) => {
			/*
				console.table({
					'Exists in config': key in config,
					'Are types equal?': typeOf(userConfig[key]) === typeOf(config[key]),
					'Key name': key,
					'Key type': typeOf(key),
					'Key type in config': typeOf(config[key]),
					'Key value': JSON.stringify(userConfig[key]),
				})
				*/
			if (key in config)
				if (typeOf(userConfig[key]) === typeOf(config[key]))
					config[key] = userConfig[key]
				else
					logger.error(
						`restoreConfig(): Key type mismatch for ${key}\n` +
							`Expected: ${typeOf(config[key])}, ` +
							`Found: ${typeOf(userConfig[key])}`
					)
			else logger.error(`restoreConfig(): Key ${key} not found in config`)
		})

		logger('restoreConfig(): User config restored')

		//* Freeze the config object to prevent changes
		Object.freeze(config)

		return this
	}

	init() {
		logger('init()...')

		// Awaits until site loads
		if (document.readyState === 'complete') {
			logger('Document ready!')
			this.beforeInit()
		} else {
			logger('Document not ready, adding Event Listener...')
			document.addEventListener('readystatechange', () => {
				logger('Document ready!')
				if (document.readyState === 'complete') this.beforeInit()
			})
		}
	}
}

// Make life easier. Namespace the class
const AD = AutoDaily

// Make actions console accessible
// Note: this will always ignore the restored config
if (config.dev_unsafe_mode) {
	unsafeWindow.AD = AutoDaily
	unsafeWindow.AD_config = config
	unsafeWindow.AD_ref = ref
	unsafeWindow.AD_quests = quests
	unsafeWindow.AD_notifSound = notifSound
	unsafeWindow.AD_statusCache = () => statusCache
	unsafeWindow.AD_newsCache = () => newsCache
	// Return a copy of the current config
	unsafeWindow.AD_config = () => JSON.parse(JSON.stringify(config))

	if (typeof GM_registerMenuCommand === 'function') {
		//! Will trigger popup warnings
		GM_registerMenuCommand(
			'Open Status API',
			() => window.open(ref.pages.status),
			null
		)
		GM_registerMenuCommand(
			'Open Notifications API',
			() => window.open(ref.pages.notifications),
			null
		)
		GM_registerMenuCommand(
			'Open News API',
			() => window.open(ref.pages.news),
			null
		)
	}
}

// Start
//* If you don't need to restore configs, you can directly call the init() method
new AutoDaily().restoreConfig().then((that) => that.init())
