// ==UserScript==
// @name BLAEO API
// @namespace https://rafaelgssa.gitlab.io/monkey-scripts
// @version 2.1.5
// @author rafaelgssa
// @description Useful library for communicating with the BLAEO API.
// @match *://*/*
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://greasyfork.org/scripts/405813-monkey-utils/code/Monkey%20Utils.js
// @require https://greasyfork.org/scripts/405802-monkey-dom/code/Monkey%20DOM.js
// @require https://greasyfork.org/scripts/405822-monkey-requests/code/Monkey%20Requests.js
// @grant GM.xmlHttpRequest
// @grant GM_xmlhttpRequest
// ==/UserScript==

/* global Requests */

/**
 * @typedef {Object} UserIdentification
 * @property {string} [steamId]
 * @property {string} [username]
 *
 * @typedef {BlaeoUser} GetUserResponse
 *
 * @typedef {Object} BlaeoUser
 * @property {string} id
 * @property {string} display_name
 * @property {string} steamgifts_name
 * @property {string} steam_name
 * @property {string} steam_id
 * @property {BlaeoUserStatistics} statistics
 *
 * @typedef {Object} BlaeoUserStatistics
 * @property {number} games
 * @property {number} uncategorized
 * @property {number} never_played
 * @property {number} unfinished
 * @property {number} beaten
 * @property {number} completed
 * @property {number} wont_play
 * @property {number} categorized
 *
 * @typedef {Object} GetGameResponse
 * @property {string} owner
 * @property {Omit<BlaeoGame, 'id'>} game
 *
 * @typedef {Object} GetGamesResponse
 * @property {BlaeoGame[]} games
 *
 * @typedef {Object} BlaeoGame
 * @property {string} id
 * @property {number} steam_id
 * @property {string} name
 * @property {number} playtime
 * @property {BlaeoGameProgress} [progress]
 * @property {BlaeoGameAchievements} [achievements]
 *
 * @typedef {'uncategorized' | 'never played' | 'unfinished' | 'beaten' | 'completed' | 'wont play'} BlaeoGameProgress
 *
 * @typedef {Object} BlaeoGameAchievements
 * @property {number} unlocked
 * @property {number} total
 *
 * @typedef {Object} GetRecentlyPlayedResponse
 * @property {BlaeoRecentlyPlayed[]} playtimes
 *
 * @typedef {Object} BlaeoRecentlyPlayed
 * @property {number} steam_id
 * @property {string} name
 * @property {number} minutes
 * @property {BlaeoGameProgress} progress_before
 * @property {BlaeoGameProgress} progress_now
 */

// eslint-disable-next-line
const BlaeoApi = (() => {
	const BLAEO_URL = 'https://www.backlog-assassins.net';

	let _xcsrfToken = '';
	let _authenticityToken = '';
	let _utf8 = '';

	/**
	 * Initializes the API.
	 */
	const init = () => {
		const xcsrfTokenField = /** @type {HTMLMetaElement | null} */ (document.querySelector(
			'[name="csrf-token"]'
		));
		const authenticityTokenField = /** @type {HTMLInputElement | null} */ (document.querySelector(
			'[name="authenticity_token"]'
		));
		const utf8Field = /** @type {HTMLInputElement | null} */ (document.querySelector(
			'[name="utf8"]'
		));
		if (xcsrfTokenField) {
			_xcsrfToken = xcsrfTokenField.content;
		}
		if (authenticityTokenField) {
			_authenticityToken = authenticityTokenField.value;
		}
		if (utf8Field) {
			_utf8 = utf8Field.value;
		}
	};

	/**
	 * Retrieves information about a user.
	 * @param {UserIdentification} identification The identification of the user.
	 * @returns {Promise<BlaeoUser | undefined>} The information about the user, if successful.
	 */
	const getUser = async (identification) => {
		const userPath = _getUserPath(identification);
		const response = /** @type {ExtendedResponse<GetUserResponse>} */ (await Requests.GET(
			`${BLAEO_URL}/users/${userPath}.json`
		));
		return response.json;
	};

	/**
	 * Retrieves information about a user's game.
	 * @param {UserIdentification} identification The identification of the user.
	 * @param {number} id The Steam ID of the game.
	 * @returns {Promise<Omit<BlaeoGame, 'id'> | undefined>} The information about the game, if successful.
	 */
	const getGame = async (identification, id) => {
		const userPath = _getUserPath(identification);
		const response = /** @type {ExtendedResponse<GetGameResponse>} */ (await Requests.GET(
			`${BLAEO_URL}/users/${userPath}/games/${id}.json`,
			{
				headers: {
					Accept: 'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
				},
			}
		));
		return response.json && response.json.game;
	};

	/**
	 * Retrieves a user's games.
	 * @param {UserIdentification} identification The identification of the user.
	 * @returns {Promise<BlaeoGame[] | undefined>} The user's games, if successful.
	 */
	const getGames = async (identification) => {
		const userPath = _getUserPath(identification);
		const response = /** @type {ExtendedResponse<GetGamesResponse>} */ (await Requests.GET(
			`${BLAEO_URL}/users/${userPath}/games.json`
		));
		return response.json && response.json.games;
	};

	/**
	 * Retrieves a user's recently played games.
	 * @param {UserIdentification} identification The identification of the user.
	 * @returns {Promise<BlaeoRecentlyPlayed[] | undefined>} The user's recently played games, if successful.
	 */
	const getRecentlyPlayed = async (identification) => {
		const userPath = _getUserPath(identification);
		const response = /** @type {ExtendedResponse<GetRecentlyPlayedResponse>} */ (await Requests.GET(
			`${BLAEO_URL}/users/${userPath}/played.json`
		));
		return response.json && response.json.playtimes;
	};

	/**
	 * Searches for games in a user's library.
	 * @param {UserIdentification} identification The identification of the user.
	 * @param {string} query The query string to search for.
	 * @returns {Promise<HTMLUListElement | undefined>} An element containing the list of matches, if successful.
	 */
	const searchGames = async (identification, query) => {
		const userPath = _getUserPath(identification);
		const response = await Requests.GET(`${BLAEO_URL}/users/${userPath}/games/filter?q=${query}`);
		if (!response.dom) {
			return;
		}
		const listEl = /** @type {HTMLUListElement | null} */ (response.dom.querySelector('.games'));
		return listEl || undefined;
	};

	/**
	 * Previews a markdown post for a user.
	 * @param {UserIdentification} identification The identification of the user.
	 * @param {string} markdown The markdown string of the post.
	 * @returns {Promise<HTMLDivElement | undefined>} An element containing the preview, if successful.
	 */
	const previewPost = async (identification, markdown) => {
		const userPath = _getUserPath(identification);
		const response = await Requests.POST(`${BLAEO_URL}/posts/preview.${userPath}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'X-CSRF-Token': _xcsrfToken,
			},
			body: Requests.convertToQuery({
				authenticity_token: _authenticityToken,
				utf8: _utf8,
				'post[text]': encodeURIComponent(markdown),
			}),
		});
		if (!response.dom) {
			return;
		}
		const previewEl = /** @type {HTMLDivElement | null} */ (response.dom.querySelector(
			'.markdown'
		));
		return previewEl || undefined;
	};

	/**
	 * Returns the path for a user based on the identification method.
	 * @param {UserIdentification} identification The identification of the user.
	 * @returns {string} The path for the user.
	 */
	const _getUserPath = ({ steamId, username }) => {
		return steamId ? `+${steamId}` : username;
	};

	return {
		BLAEO_URL,
		init,
		getUser,
		getGame,
		getGames,
		getRecentlyPlayed,
		searchGames,
		previewPost,
	};
})();
