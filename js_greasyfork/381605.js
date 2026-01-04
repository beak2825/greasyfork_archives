/* 
    Metacritic score for GOG - Adds metacritic score to GOG game's page.
	Copyright (C) 2019  T1mL3arn
	
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name Metacritic score for GOG
// @description Adds metacritic score to GOG game's page
// @version 1.2.2
// @author T1mL3arn
// @namespace https://github.com/T1mL3arn
// @icon https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Metacritic.svg/88px-Metacritic.svg.png
// @match https://gog.com/game/*
// @match https://gog.com/*/game/*
// @match https://www.gog.com/game/*
// @match https://www.gog.com/*/game/*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @grant GM_xmlhttpRequest
// @grant GM.xmlhttpRequest
// @grant GM_xmlHttpRequest
// @grant GM.xmlHttpRequest
// @grant GM_addStyle
// @grant GM.addStyle
// @license GPLv3
// @homepageURL https://github.com/t1ml3arn-userscript-js/Metacritic-score-for-GOG
// @supportURL https://github.com/t1ml3arn-userscript-js/Metacritic-score-for-GOG/issues
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/381605/Metacritic%20score%20for%20GOG.user.js
// @updateURL https://update.greasyfork.org/scripts/381605/Metacritic%20score%20for%20GOG.meta.js
// ==/UserScript==

(function () {
	// =============================================================
	//
	// Greasemonkey polyfill
	//
	// =============================================================
	
	// probably it is Greasemonkey
	if (typeof GM !== 'undefined') {
		if (typeof GM.info !== 'undefined')
			window.GM_info = GM.info;

		// VM has GM_xmlhttpRequest but GM has GM_xmlHttpRequest
		// Mad mad world !
		if (typeof GM.xmlHttpRequest !== 'undefined') {
			window.GM_xmlhttpRequest = GM.xmlHttpRequest
		}
    
    	// addStyle
		window.GM_addStyle = function(css) {
			return new Promise((resolve, reject) => {
				try {
					let style = document.head.appendChild(document.createElement('style'))
					style.type = 'text/css'
					style.textContent = css;
					resolve(style)
				} catch(e) {
					console.error(`It is not possible to add style with GM_addStyle()`)
					reject(e)
				}
			})
		}
	}

	//console.log(`[${GM_info.scriptHandler}][${GM_info.script.name} v${GM_info.script.version}] inited`)
	

	// =============================================================
	//
	// API section
	//
	// =============================================================

	const css = (() => {
		return `
.mcg-wrap {
	/* Base size for all icons */
	--size: 80px;

	display: flex;
	flex-flow: row;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;

	width: auto;
	padding: 4px;
	box-sizing: border-box;
}

.mcg-wrap * {
	all: unset;
	box-sizing: border-box;
}

.mcg-score-summary {
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: center;

	margin: 0 2px 0 2px;
}

.mcg-score-summary__score {
	display: flex;
	flex-flow: row;
	justify-content: center;
	align-items: center;

	min-width: calc(var(--size) * 0.5);
	min-height: calc(var(--size) * 0.5);
	width: calc(var(--size) * 0.5);
	height: calc(var(--size) * 0.5);
	margin: 0 4px 0 4px;

	background-color: #0f0;
	background-color: #c0c0c0;
	border-radius: 6px;
	font-family: sans-serif;
	
	font-size: 1.2em;
	font-weight: bold;
	color: white;
}

.mcg-score--bad {
	background-color: #f00;
	color: white;
}

.mcg-score--mixed {
	background-color: #fc3;
	color: #111;
}

.mcg-score--good {
	background-color: #6c3;
	color: white;
}

.mcg-score-summary__score--circle {
	border-radius: 50%;
}

.mcg-score-summary .mcg-score-summary__label {
	align-self: flex-start;
	align-self: center;
	
	max-width: 50px;

	font-size: 0.9em;
	font-size: 14px;
	font-weight: bold;
	text-align: left;
	text-align: center;
}

.mcg-logo {
	display: flex;
	flex-flow: row;
	align-items: center;
}

.mcg-logo__img {
	background-image: url(https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Metacritic.svg/200px-Metacritic.svg.png);
	background-position: center center;
	background-size: cover;
	
	min-width: calc(var(--size) * 0.5);
	min-height: calc(var(--size) * 0.5);
	width: calc(var(--size) * 0.5);
	height: calc(var(--size) * 0.5);
}

.mcg-logo p {
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: center;

	margin: 4px 6px;

	font-family: sans-serif;
	font-size: 22px;
	text-align: center;
	font-weight: bold;
}

.mcg-logo p > a {
	cursor: pointer;
	
	text-decoration: underline;
	font-size: 0.65em;
	font-size: 14px;
	font-weight: normal;
	color: #36c;
}`
	})()

	const defaultHeaders = {
		"Origin": null,
		"Referer": null,
		"Cache-Control": "max-age=3600",
	}

	/**
	 * Sends xmlHttpRequest via GM api (this allows crossdomain reqeusts).
	 * NOTE Different userscript engines support different
	 * details object format.
	 * 
	 * Violentmonkey @see https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest
	 * 
	 * Greasemonkey @see https://wiki.greasespot.net/GM.xmlHttpRequest
	 * @param {Object} details @see ...
	 * @returns {Promise}
	 */
	function ajax(details) {
		return new Promise((resolve, reject) => {
			details.onload = resolve
			details.onerror = reject
			GM_xmlhttpRequest(details)
		}) 
	}

	/**
	 * Returns an URL to make a search request
	 * for given game.
	 * @param {String} game Game name
	 * @param {String} platform Target platform (PC is default)
	 */
	function getSearhURL(game, platform) {
		// searches GAME only in "game" for PC platform (plats[3]=1)
		///TODO sanitize game name (trim, remove extra spacebars etc) ?
		return `https://www.metacritic.com/search/game/${game}/results?search_type=advanced&plats[3]=1`
	}

	/**
	 * Returns an array of search results from given html code
	 * @param {String} html Raw html from which search results will be parsed
	 * @returns {Array} array of objects
	 */
	function parseSearchResults(html) {
		
		const doc = new DOMParser().parseFromString(html, 'text/html')
		const yearReg = /\d{4}/
		const results = $(doc).find('ul.search_results .result_wrap')

		return results.map((ind, elt) => {
			const result = $(elt)
			let year = yearReg.exec(result.find('.main_stats p').text())
			year = year == null ? 0 : parseInt(year[0])
			
			return {
				title: result.find('.product_title').text().trim(),
				pageurl: 'https://www.metacritic.com' + result.find('.product_title > a').attr('href'),
				platform: result.find('.platform').text().trim(),
				year,
				metascore: parseInt(result.find('.metascore_w').text()),
				criticReviewsCount: 0,
				userscore: 0.0,
				userReviewsCount: 0,
				description: result.find('.deck').text().trim()
			}
		})
		.get()
	}

	function swap(arr, ind1, ind2) {
		const tmp = arr[ind1]
		arr[ind1] = arr[ind2]
		arr[ind2] = tmp
	}

	/**
	 * Returns integer which represents total user reviews
	 * @param {Object} doc jQuery document object
	 * @returns {Number}
	 */
	function getUserReviesCount(doc) {
		const reg = /\d+/
		let count = doc.find('.feature_userscore .count a').text()
		count = reg.exec(count)
		count = count == null ? 0 : parseInt(count[0])
		return count;
	}

	/**
	 * Returns float which represents user score
	 * @param {Object} doc jQuery document object
	 * @returns {Number}
	 */
	function getUserScore(doc) {
		return parseFloat(doc.find('.feature_userscore .metascore_w.user').eq(0).text())
	}
	
	function getMetascore(doc) {
		return parseInt(doc.find('.metascore_summary .metascore_w span').text())
	}

	/**
	 * Returns a number of crititc reviews
	 * @param {Object} doc jQuery document object
	 * @returns {Number}
	 */
	function getCriticReviewsCount(doc) {
		return parseInt(doc.find('.score_summary.metascore_summary a>span').text())
	}

	function parseDataFromGamePage(html) {
		const doc = $(new DOMParser().parseFromString(html, 'text/html'))
		
		const yearReg = /\d{4}/
		let year = yearReg.exec(doc.find('.release_data .data').text())
		year = year == null ? 0 : year[0]

		return {
			title: doc.find('.product_title h1').text(),
			platform: doc.find('.platform a').text(),
			year,
			metascore: getMetascore(doc),
			criticReviewsCount: getCriticReviewsCount(doc),
			userscore: getUserScore(doc),
			userReviewsCount: getUserReviesCount(doc),
		}
	}

	/**
	 * Converts given object to string 
	 * like `foo=bar&bizz=bazz`
	 * @param {Object} obj 
	 */
	function objectToUrlArgs(obj) {
		return Object.entries(obj)
			.map(kv => `${kv[0]}=${kv[1]}`)
			.join('&')
	}

	/**
	 * Query metacritic autosearch api.
	 * Returns Promise with an array with results objects.
	 * Result object properties:
	 * - url: link to page
	 * - name: game name
	 * - itemDate: release date (string ?)
	 * - imagePath: url to cover image
	 * - metaScore: critic score (int)
	 * - scoreWord: like mixed, good, bad etc
	 * - refType: item type, e.g "PC Game"
	 * - refTypeId: type id, (string)
	 * @param {String} query term for search
	 * @returns {Promise}
	 */
	function autoSearch(query) {
		return ajax({
			url: 'https://www.metacritic.com/autosearch',
			method: 'post',
			data: objectToUrlArgs({ image_size: 98, search_term: query }),
			responseType: 'json',
			// Strictly recomended to watch Network log
			// and get Request Headers from it
			headers: {
				"Origin": null,
				"Referer": "https://www.metacritic.com",
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"X-Requested-With":	"XMLHttpRequest"
			}
		})
		.then(response => JSON.parse(response.responseText).autoComplete)
	}

	/**
	 * Queries metacritic search page with given query.
	 * Returns Promise with `response` object.
	 * Html code of the page can be read from `response.responseText`
	 * @param {String} query term for search
	 * @returns {Promise}
	 */
	function fullSearch(query) {
		return ajax({
			url: getSearhURL(query),
			method: "GET",
			headers: defaultHeaders,
			context: { query }
		})
	}

	/**
	 * Returns a resolved Promise with game data object on success
	 * and rejected Promise on failure.
	 * Game data object has these fields:
	 * - title: Game title
	 * - pageurl: Game page url
	 * - platform: Game platform (pc, ps3 etc)
	 * - year: Release year (int)
	 * - metascore: Critic score (int)
	 * - criticReviewsCount: The number of critic reviews
	 * - userscore: User score (float)
	 * - userReviewsCount: The number of user reviews
	 * - description: Description of the game
	 * - queryString: Original query string
	 * @param {String} gameName Game name
	 */
	function getMetacriticGameDetails(gameName) {
		return fullSearch(gameName)
			.then(response => {
					const { context, responseText } = response
					const results = parseSearchResults(responseText)

					if (results.length == 0) {
						throw `Can't find game "${context.query}" on www.metacritic.com`
					}

					// I have to find the game in results and this is not so easy,
					// metacritic gives stupid order, e.g
					// most relevant game for "mass effect" is ME: Andromeda,
					// not the first Mass Effect game from 2007.
					// lets assume that GOG has correct game titles
					// (which is not always true)
					// then we can get game from results with the same
					// title as in search query
					const ind = results.findIndex(result => result.title.toLowerCase()===context.query.toLowerCase())
					
					if (ind != -1) 
						return results[ind]
					else {
						console.error('Metacritic results:', results)
						throw `There are results, but can't find game "${context.query}" on www.metacritic.com`
					}
				} /* Network error */
			)
			.then(gameData => {

					// request to the game page to get
					// user score and reviews count
					return ajax({
						url: gameData.pageurl,
						method: 'GET',
						headers: defaultHeaders,
						context: { gameData },
					})
				} /* catch error, if there is no such game */
			).then(response => {
					const { context, responseText } = response
					const { gameData } = context
					const doc = $(new DOMParser().parseFromString(responseText, 'text/html'))

					gameData.userReviewsCount = getUserReviesCount(doc)
					gameData.userscore = getUserScore(doc)
					gameData.criticReviewsCount = getCriticReviewsCount(doc)
					
					return { ...gameData, queryString: gameName }
				} /* catches error when fetching game page */
			);
	}

	/**
	 * Get gog product details via REST api
	 * @see https://gogapidocs.readthedocs.io/en/latest/galaxy.html#get--products-(int-product_id)
	 * @param {String} productId 
	 * @param {String} locale
	 * @returns {Promise} fullfiled with json object
	 */
	function getGOGProductDetails(productId, locale) {
		return ajax({
			url: `https://api.gog.com/products/${productId}?locale=${locale}`,
			method: 'get',
			defaultHeaders: { 'Cache-Control': 'max-age=3600' },
			responseType: 'json',
		}).then(response => JSON.parse(response.responseText))
	}

	function MetacriticLogo(props) {
		let { reviewsUrl } = props

		return `
			<div class="mcg-logo">
				<div class="mcg-logo__img" title="metacritic logo"></div>
				<p>
					metacritic
					<a href=${ reviewsUrl || "#" } target="_blank" rel="noopener noreferer">
						Read reviews
						<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22%3E %3Cpath fill=%22%23fff%22 stroke=%22%2336c%22 d=%22M1.5 4.518h5.982V10.5H1.5z%22/%3E %3Cpath fill=%22%2336c%22 d=%22M5.765 1H11v5.39L9.427 7.937l-1.31-1.31L5.393 9.35l-2.69-2.688 2.81-2.808L4.2 2.544z%22/%3E %3Cpath fill=%22%23fff%22 d=%22M9.995 2.004l.022 4.885L8.2 5.07 5.32 7.95 4.09 6.723l2.882-2.88-1.85-1.852z%22/%3E %3C/svg%3E" />
					</a>
				</p>
			</div>
		`
	}

	function getScoreColor(score) {
		// tbd - gray
		// 0-49 - red
		// 50-74 - yellow
		// 75 - 100 - green
	
		if (score === 'tbd' || score !== score)
			// default bg color is already present in css
			return ''
		else {
			if (score < 50)			return 'mcg-score--bad'
			else if (score < 75)	return 'mcg-score--mixed'
			else					return 'mcg-score--good'
		}
	}

	/**
	 * Converts user score value to its string representation.
	 * @param {Number} score user score
	 * @returns {String} a string in format like "7.0" or "8.8",
	 * or "tbd" if a given score is NaN 
	 */
	function formatUserScore(score) {
		return score !== score ? 'tbd' : score.toFixed(1)
	}

	/**
	 * Converts critic score to its string representation.
	 * @param {Number} score critic score 
	 * @returns {String} a string like "98" or "100",
	 * or "tbd" if a given score is NaN
	 */
	function formatMetaScore(score) {
		return score !== score ? 'tbd' : score
	}

	function ScoreSummary(props) {
		const { score, scoreLabel, scoreTypeClass, scoreColorClass } = props
		const scoreEltClass = `"mcg-score-summary__score ${scoreTypeClass} ${scoreColorClass}"`
		
		return `
			<div class="mcg-score-summary">
				<span class=${ scoreEltClass }>${ score }</span>
				<span class="mcg-score-summary__label">${ scoreLabel }</span>
			</div>
		`
	}

	function MetacriticScore(props) {
		const { metascore, userscore, pageurl } = props;

		return `
		<div class='mcg-wrap'>
			${ ScoreSummary({ 
				score: formatUserScore(userscore), 
				scoreLabel: 'User score', 
				scoreTypeClass: 'mcg-score-summary__score--circle',
				scoreColorClass: getScoreColor(userscore * 10),
				}) 
			}
			${ ScoreSummary({ 
				score: formatMetaScore(metascore), 
				scoreLabel: 'Meta score',
				scoreTypeClass: '',
				scoreColorClass: getScoreColor(metascore),
				})
			}
			${ MetacriticLogo({ reviewsUrl: pageurl }) }
		</div>
		`
	}

	function showMetacriticScoreElt(gameData) {
		const metascore = MetacriticScore(gameData) 
		$('div[content-summary-section-id="productDetails"] > .details')
			.append('<hr class="details__separator"/>')
			.append(metascore)
			.append('<hr class="details__separator"/>')
	}

	// =============================================================
	//
	// Code section
	//
	// =============================================================

	const documentReady = new Promise((resolve, rej) => $(document).ready(resolve))

	documentReady.then(() => GM_addStyle(css))
	
	// get game name from page's url
	let gameNameFromUrl = window.location.pathname
		.replace('/game/', '')
		.replace(/_/g, '-')
	
	// first trying to get the same game page from metacritic
	ajax({
		url: `https://www.metacritic.com/game/pc/${gameNameFromUrl}`,
		method: "GET",
		headers: defaultHeaders,
	}).then(response => {
		const { responseText, finalUrl, status } = response
		
		if (status === 200) {
			const gameData = {
				...parseDataFromGamePage(responseText),
				pageurl: finalUrl
			}

			documentReady.then(() => showMetacriticScoreElt(gameData))
		}
		else if (status === 404) {

			documentReady.then(() => {
				const productId = $(document).find('div[card-product]').attr('card-product')
		
				// get product details from gog api
				getGOGProductDetails(productId, 'en')
					.then(details => details.title)
					.then(getMetacriticGameDetails)
					.then(showMetacriticScoreElt)
			})

		}
	}, e => console.error('Error', e))
	
})();