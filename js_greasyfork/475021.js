// ==UserScript==
// @name Achievement Tracker Comparer
// @description Compare achievements between AStats, completionist.me, Exophase, MetaGamerScore, Steam Hunters and Steam Community profiles.
// @version 1.4.8
// @author Rudey
// @homepage https://github.com/RudeySH/achievement-tracker-comparer#readme
// @supportURL https://github.com/RudeySH/achievement-tracker-comparer/issues
// @include /^https://steamcommunity\.com/id/[a-zA-Z0-9_-]{3,32}/*$/
// @include /^https://steamcommunity\.com/profiles/\d{17}/*$/
// @connect astats.nl
// @connect completionist.me
// @connect exophase.com
// @connect metagamerscore.com
// @connect steamhunters.com
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.xmlHttpRequest
// @license AGPL-3.0-or-later
// @namespace https://github.com/RudeySH/achievement-tracker-comparer
// @require https://cdnjs.cloudflare.com/ajax/libs/es6-promise-pool/2.5.0/es6-promise-pool.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/he/1.2.0/he.min.js
// @downloadURL https://update.greasyfork.org/scripts/475021/Achievement%20Tracker%20Comparer.user.js
// @updateURL https://update.greasyfork.org/scripts/475021/Achievement%20Tracker%20Comparer.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "he"
const external_he_namespaceObject = he;
var external_he_default = /*#__PURE__*/__webpack_require__.n(external_he_namespaceObject);
;// CONCATENATED MODULE: external "PromisePool"
const external_PromisePool_namespaceObject = PromisePool;
var external_PromisePool_default = /*#__PURE__*/__webpack_require__.n(external_PromisePool_namespaceObject);
;// CONCATENATED MODULE: ./src/utils/utils.ts
const iconExternalLink = '<img src="https://community.cloudflare.steamstatic.com/public/images/skin_1/iconExternalLink.gif?utm_campaign=userscript" alt="" aria-hidden="true" />';
const domParser = new DOMParser();
async function getDocument(url, details) {
    const html = await getHTML(url, details);
    return domParser.parseFromString(html, 'text/html');
}
async function getHTML(url, details) {
    const data = await xmlHttpRequest({
        method: 'GET',
        overrideMimeType: 'text/html',
        url,
        ...details,
    });
    return data.responseText;
}
async function getJSON(url, details) {
    const data = await xmlHttpRequest({
        method: 'GET',
        overrideMimeType: 'application/json',
        url,
        ...details,
    });
    return JSON.parse(data.responseText);
}
async function getRedirectURL(url) {
    const data = await xmlHttpRequest({
        method: 'GET',
        url,
    });
    return data.finalUrl;
}
function xmlHttpRequest(details) {
    return retry(() => {
        console.debug(`${details.method} ${details.url}`);
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                onabort: reject,
                onerror: reject,
                ontimeout: reject,
                onload: resolve,
                ...details,
            });
        });
    });
}
async function retry(func) {
    const attempts = 10;
    let error = undefined;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await func();
        }
        catch (e) {
            if (attempt >= attempts) {
                error = e;
                break;
            }
            await delay(1000 * attempt);
            console.debug('Retrying...');
        }
    }
    throw error;
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function mapBy(items, keySelector) {
    const map = new Map();
    for (const item of items) {
        const key = keySelector(item);
        const values = map.get(key);
        if (values !== undefined) {
            values.push(item);
        }
        else {
            map.set(key, [item]);
        }
    }
    return map;
}
function groupBy(items, keySelector) {
    const map = mapBy(items, keySelector);
    return [...map].map(([key, values]) => new Grouping(key, values));
}
class Grouping extends Array {
    constructor(key, items) {
        super(...items);
        this.key = key;
    }
}
function merge(source, target) {
    if (!target) {
        return source;
    }
    const source2 = Object.fromEntries(Object.entries(source).filter(([_, v]) => v !== undefined));
    return Object.assign({ ...target }, source2);
}
function trim(string, trim) {
    if (string.startsWith(trim)) {
        string = string.substring(trim.length);
    }
    if (string.endsWith(trim)) {
        string = string.substring(0, string.length - trim.length);
    }
    return string;
}

;// CONCATENATED MODULE: ./src/trackers/tracker.ts
class Tracker {
    constructor(profileData) {
        this.signInLink = undefined;
        this.ownProfileOnly = false;
        this.profileData = profileData;
    }
    validate(_game) {
        return [];
    }
}

;// CONCATENATED MODULE: ./src/trackers/astats.ts


class AStats extends Tracker {
    constructor() {
        super(...arguments);
        this.name = 'AStats';
    }
    getProfileURL() {
        return `https://www.astats.nl/astats/User_Info.php?steamID64=${this.profileData.steamid}&utm_campaign=userscript`;
    }
    getGameURL(game) {
        return `https://www.astats.nl/astats/Steam_Game_Info.php?AppID=${game.appid}&SteamID64=${this.profileData.steamid}&utm_campaign=userscript`;
    }
    async getStartedGames() {
        const games = [];
        const doc = await getDocument(`https://www.astats.nl/astats/User_Games.php?Limit=0&Hidden=1&AchievementsOnly=1&SteamID64=${this.profileData.steamid}&utm_campaign=userscript`);
        const rows = doc.querySelectorAll('table:not(.Pager) tbody tr');
        for (const row of rows) {
            const validUnlocked = parseInt(row.cells[2].textContent);
            const unlocked = validUnlocked + (parseInt(row.cells[3].textContent) || 0);
            if (unlocked <= 0) {
                continue;
            }
            const total = parseInt(row.cells[4].textContent);
            if (total <= 0) {
                continue;
            }
            const anchor = row.querySelector('a[href*="AppID="]');
            const appid = parseInt(new URL(anchor.href).searchParams.get('AppID'));
            const name = row.cells[1].textContent;
            const validTotal = row.cells[4].textContent.split(' - ').map(x => parseInt(x)).reduce((a, b) => a - b);
            const isPerfect = unlocked >= total;
            const isCompleted = isPerfect || validUnlocked > 0 && validUnlocked >= validTotal;
            const isCounted = isCompleted;
            const isTrusted = undefined;
            games.push({ appid, name, unlocked, total, isPerfect, isCompleted, isCounted, isTrusted });
        }
        return { games };
    }
    getRecoverLinkHTML() {
        return undefined;
    }
}

;// CONCATENATED MODULE: ./src/trackers/completionist.ts



class Completionist extends Tracker {
    constructor() {
        super(...arguments);
        this.name = 'completionist.me';
    }
    getProfileURL() {
        return `https://completionist.me/steam/profile/${this.profileData.steamid}?utm_campaign=userscript`;
    }
    getGameURL(game) {
        return `https://completionist.me/steam/profile/${this.profileData.steamid}/app/${game.appid}?utm_campaign=userscript`;
    }
    async getStartedGames() {
        const games = [];
        const url = `https://completionist.me/steam/profile/${this.profileData.steamid}/apps?display=flat&sort=started&order=asc&completion=started&utm_campaign=userscript`;
        const doc = await this.addStartedGames(games, url);
        const lastPageAnchor = doc.querySelector('.pagination a:last-of-type');
        if (lastPageAnchor !== null) {
            const pageCount = parseInt(new URL(lastPageAnchor.href).searchParams.get('page'));
            const iterator = this.getStartedGamesIterator(games, url, pageCount);
            const pool = new (external_PromisePool_default())(iterator, 6);
            await pool.start();
        }
        return { games };
    }
    *getStartedGamesIterator(games, url, pageCount) {
        for (let page = 2; page <= pageCount; page++) {
            yield this.addStartedGames(games, `${url}&page=${page}`);
        }
    }
    async addStartedGames(games, url) {
        var _a;
        const doc = await getDocument(url);
        const rows = doc.querySelectorAll('.games-list tbody tr');
        for (const row of rows) {
            const nameCell = row.cells[1];
            const anchor = nameCell.querySelector('a');
            const counts = row.cells[4].textContent.split('/').map(s => parseInt(s.replace(/,/g, '')));
            const unlocked = counts[0];
            const total = (_a = counts[1]) !== null && _a !== void 0 ? _a : unlocked;
            const isPerfect = unlocked >= total;
            games.push({
                appid: parseInt(anchor.href.substring(anchor.href.lastIndexOf('/') + 1)),
                name: nameCell.textContent.trim(),
                unlocked,
                total,
                isPerfect,
                isCompleted: isPerfect ? true : undefined,
                isCounted: isPerfect,
                isTrusted: nameCell.querySelector('.fa-spinner') === null,
            });
        }
        return doc;
    }
    getRecoverLinkHTML(isOwnProfile, games) {
        if (!isOwnProfile) {
            return undefined;
        }
        return `
			<form method="post" action="https://completionist.me/steam/recover/profile?utm_campaign=userscript" target="_blank">
				<input type="hidden" name="app_ids" value="${games.map(game => game.appid)}">
				<input type="hidden" name="profile_id" value="${this.profileData.steamid}">
				<button type="submit" class="whiteLink">
					Recover ${iconExternalLink}
				</button>
			</form>`;
    }
}

;// CONCATENATED MODULE: ./src/trackers/exophase.ts


class Exophase extends Tracker {
    constructor() {
        super(...arguments);
        this.name = 'Exophase';
        this.signInLink = 'https://www.exophase.com/login/?utm_campaign=userscript';
        this.ownProfileOnly = true;
    }
    getProfileURL() {
        return `https://www.exophase.com/steam/id/${this.profileData.steamid}?utm_campaign=userscript`;
    }
    getGameURL(game) {
        return `https://www.exophase.com/steam/game/id/${game.appid}/stats/${this.profileData.steamid}?utm_campaign=userscript`;
    }
    async getStartedGames() {
        var _a;
        let credentials;
        try {
            credentials = await getJSON('https://www.exophase.com/account/token?utm_campaign=userscript');
        }
        catch {
            return { games: [], signIn: true };
        }
        const overview = await getJSON('https://api.exophase.com/account/games?filter=steam&utm_campaign=userscript', { headers: { 'Authorization': `Bearer ${credentials.token}` } });
        if (((_a = overview.services.find(s => s.environment === 'steam')) === null || _a === void 0 ? void 0 : _a.canonical_id) !== this.profileData.steamid) {
            return { games: [], signIn: true, signInAs: this.profileData.personaname };
        }
        const games = overview.games['steam'].map(game => ({
            appid: parseInt(game.canonical_id),
            name: game.title,
            unlocked: game.earned_awards,
            total: game.total_awards,
            isPerfect: game.earned_awards >= game.total_awards,
            isCompleted: game.earned_awards >= game.total_awards ? true : undefined,
            isCounted: game.earned_awards >= game.total_awards,
            isTrusted: undefined,
        }));
        return { games };
    }
    getRecoverLinkHTML(isOwnProfile) {
        if (!isOwnProfile) {
            return undefined;
        }
        return `
			<a class="whiteLink" href="https://www.exophase.com/account/?utm_campaign=userscript#tools" target="_blank">
				Recover ${iconExternalLink}
			</a>`;
    }
}

;// CONCATENATED MODULE: ./src/trackers/metagamerscore.ts


class MetaGamerScore extends Tracker {
    constructor() {
        super(...arguments);
        this.name = 'MetaGamerScore';
        this.signInLink = 'https://metagamerscore.com/users/sign_in?utm_campaign=userscript';
    }
    getProfileURL() {
        return `https://metagamerscore.com/steam/id/${this.profileData.steamid}?utm_campaign=userscript`;
    }
    getGameURL(game) {
        if (!game.name) {
            return undefined;
        }
        if (!game.mgsId) {
            return `https://metagamerscore.com/my_games?user=${this.userID}&filter=${encodeURIComponent(game.name)}&utm_campaign=userscript`;
        }
        const urlFriendlyName = trim(game.name.toLowerCase().replace(/\W+/g, '-'), '-');
        return `https://metagamerscore.com/game/${game.mgsId}-${urlFriendlyName}?user=${this.userID}&utm_campaign=userscript`;
    }
    async getStartedGames() {
        const profileURL = this.getProfileURL();
        const redirectURL = await getRedirectURL(profileURL);
        this.userID = new URL(redirectURL).pathname.split('/')[2];
        let mgsGames;
        try {
            const response = await getJSON(`https://metagamerscore.com/api/mygames/steam/${this.userID}?utm_campaign=userscript`);
            if (Array.isArray(response)) {
                mgsGames = response;
            }
            else {
                return { games: [], error: response.error };
            }
        }
        catch {
            return { games: [], signIn: true };
        }
        const games = mgsGames.map(game => {
            const unlocked = game.earned + game.earnedUnobtainable;
            const total = game.total + game.totalUnobtainable;
            return {
                appid: parseInt(game.appid),
                mgsId: game.mgs_id,
                name: game.name,
                unlocked,
                total,
                isPerfect: total !== 0 && unlocked >= total,
                isCompleted: game.total !== 0 && game.earned >= game.total,
                isCounted: game.total !== 0 && game.earned >= game.total,
                isTrusted: undefined,
            };
        });
        return { games };
    }
    getRecoverLinkHTML(isOwnProfile) {
        if (!isOwnProfile) {
            return undefined;
        }
        return `
			<a class="whiteLink" href="https://metagamerscore.com/steam/index_reconcile?utm_campaign=userscript" target="_blank">
				Recover ${iconExternalLink}
			</a>`;
    }
}

;// CONCATENATED MODULE: ./src/trackers/steam.ts



class Steam extends Tracker {
    constructor() {
        super(...arguments);
        this.name = 'Steam';
    }
    getProfileURL() {
        return this.profileData.url.substring(0, this.profileData.url.length - 1);
    }
    getGameURL(game) {
        return `${this.getProfileURL()}/stats/${game.appid}?tab=achievements`;
    }
    async getStartedGames(_formData, appids) {
        const response = await fetch(`${this.getProfileURL()}/edit/showcases`, { credentials: 'same-origin' });
        const doc = domParser.parseFromString(await response.text(), 'text/html');
        const achievementShowcaseGames = JSON.parse(doc.getElementById('showcase_preview_17').innerHTML.match(/g_rgAchievementShowcaseGamesWithAchievements = (.*);/)[1]);
        const completionistShowcaseGames = JSON.parse(doc.getElementById('showcase_preview_23').innerHTML.match(/g_rgAchievementsCompletionshipShowcasePerfectGames = (.*);/)[1]);
        appids = [...new Set([
                ...appids,
                ...achievementShowcaseGames.map(game => game.appid),
                ...completionistShowcaseGames.map(game => game.appid),
            ])];
        const games = [];
        const iterator = this.getStartedGamesIterator(appids, achievementShowcaseGames, completionistShowcaseGames, games);
        const pool = new (external_PromisePool_default())(iterator, 6);
        await pool.start();
        return { games };
    }
    *getStartedGamesIterator(appids, achievementShowcaseGames, completionistShowcaseGames, games) {
        for (const appid of appids) {
            yield this.getStartedGame(appid, achievementShowcaseGames, completionistShowcaseGames).then(game => games.push(game));
        }
    }
    async getStartedGame(appid, achievementShowcaseGames, completionistShowcaseGames) {
        var _a;
        if (appid === 247750) {
            const name = 'The Stanley Parable Demo';
            const unlocked = await this.getAchievementShowcaseCount(appid);
            const isPerfect = unlocked === 1;
            return { appid, name, unlocked, total: 1, isPerfect, isCompleted: isPerfect, isCounted: isPerfect, isTrusted: true };
        }
        const completionistShowcaseGame = completionistShowcaseGames.find(game => game.appid === appid);
        let { unlocked, total } = await this.getFavoriteGameShowcaseCounts(appid);
        total !== null && total !== void 0 ? total : (total = completionistShowcaseGame === null || completionistShowcaseGame === void 0 ? void 0 : completionistShowcaseGame.num_achievements);
        if (unlocked === undefined) {
            unlocked = await this.getAchievementShowcaseCount(appid);
            if (unlocked === 9999 && completionistShowcaseGame !== undefined) {
                unlocked = completionistShowcaseGame.num_achievements;
            }
        }
        const achievementShowcaseGame = achievementShowcaseGames.find(game => game.appid === appid);
        const name = (_a = achievementShowcaseGame === null || achievementShowcaseGame === void 0 ? void 0 : achievementShowcaseGame.name) !== null && _a !== void 0 ? _a : completionistShowcaseGame === null || completionistShowcaseGame === void 0 ? void 0 : completionistShowcaseGame.name;
        const isPerfect = total !== undefined ? unlocked >= total : undefined;
        const isCompleted = isPerfect ? true : undefined;
        const isCounted = completionistShowcaseGame !== undefined;
        const isTrusted = achievementShowcaseGame !== undefined;
        return { appid, name, unlocked, total, isPerfect, isCompleted, isCounted, isTrusted };
    }
    async getFavoriteGameShowcaseCounts(appid) {
        const url = `${this.getProfileURL()}/ajaxpreviewshowcase`;
        const body = new FormData();
        body.append('customization_type', '6');
        body.append('sessionid', unsafeWindow.g_sessionID);
        body.append('slot_data', `{"0":{"appid":${appid}}}`);
        const response = await retry(() => {
            console.debug(`POST ${url}`);
            return fetch(url, { method: 'POST', body, credentials: 'same-origin' });
        });
        const text = await response.text();
        const template = document.createElement('template');
        template.innerHTML = text.replace(/src="[^"]+"/g, '');
        const ellipsis = template.content.querySelector('.ellipsis');
        let unlocked = undefined;
        let total = undefined;
        if (ellipsis !== null) {
            const split = ellipsis.textContent.split(/\D+/).filter(s => s !== '');
            unlocked = parseInt(split[0]);
            total = parseInt(split[1]);
        }
        return { unlocked, total };
    }
    async getAchievementShowcaseCount(appid) {
        var _a;
        const url = `${this.getProfileURL()}/ajaxgetachievementsforgame/${appid}`;
        const response = await retry(() => {
            console.debug(`GET ${url}`);
            return fetch(url);
        });
        const text = await response.text();
        const template = document.createElement('template');
        template.innerHTML = text;
        const list = template.content.querySelector('.achievement_list');
        if (list === null) {
            const h3 = template.content.querySelector('h3');
            throw new Error((_a = h3 === null || h3 === void 0 ? void 0 : h3.textContent) !== null && _a !== void 0 ? _a : `Response is invalid: ${url}`);
        }
        return list.querySelectorAll('.achievement_list_item').length;
    }
    getRecoverLinkHTML() {
        return undefined;
    }
    validate(game) {
        const messages = [];
        if (game.isCounted === true) {
            if (game.isPerfect === false) {
                messages.push('counted but not perfect on Steam');
            }
            if (game.isTrusted === false) {
                messages.push('counted but not trusted on Steam');
            }
        }
        else {
            if (game.isPerfect === true && game.isTrusted === true) {
                messages.push('perfect & trusted but not counted on Steam');
            }
        }
        return messages;
    }
}

;// CONCATENATED MODULE: ./src/trackers/steam-hunters.ts



class SteamHunters extends Tracker {
    constructor() {
        super(...arguments);
        this.name = 'Steam Hunters';
    }
    getProfileURL() {
        return `https://steamhunters.com/profiles/${this.profileData.steamid}?utm_campaign=userscript`;
    }
    getGameURL(game) {
        return `https://steamhunters.com/profiles/${this.profileData.steamid}/apps/${game.appid}?utm_campaign=userscript`;
    }
    async getStartedGames() {
        const licenses = await getJSON(`https://steamhunters.com/api/steam-users/${this.profileData.steamid}/licenses?state=started&utm_campaign=userscript`);
        const games = Object.entries(licenses).map(([appid, license]) => ({
            appid: parseInt(appid),
            name: license.app.name,
            unlocked: license.achievementUnlockCount,
            total: license.app.achievementCount,
            isPerfect: license.achievementUnlockCount >= license.app.achievementCount,
            isCompleted: license.isCompleted,
            isCounted: license.isCompleted && !license.isInvalid,
            isTrusted: !license.app.isRestricted,
        }));
        return { games };
    }
    getRecoverLinkHTML(_isOwnProfile, games) {
        return `
			<form method="post" action="https://steamhunters.com/profiles/${this.profileData.steamid}/recover?utm_campaign=userscript" target="_blank">
				<input type="hidden" name="version" value="2.0">
				<input type="hidden" name="apps" value="${external_he_default().escape(JSON.stringify(games))}">
				<button type="submit" class="whiteLink">
					Recover ${iconExternalLink}
				</button>
			</form>`;
    }
}

;// CONCATENATED MODULE: ./src/index.ts
var _a;









const profileData = (_a = unsafeWindow.g_rgProfileData) !== null && _a !== void 0 ? _a : {};
const isOwnProfile = unsafeWindow.g_steamID === profileData.steamid;
const trackers = [
    new Completionist(profileData),
    new SteamHunters(profileData),
    new AStats(profileData),
    new Exophase(profileData),
    new MetaGamerScore(profileData),
];
window.addEventListener('load', async () => {
    const container = document.querySelector('.profile_rightcol');
    if (container === null) {
        return;
    }
    const style = document.createElement('style');
    style.innerHTML = `
		.atc button {
			border: none;
		}

		.atc button:disabled {
			pointer-events: none;
		}

		.atc button.whiteLink {
			background-color: transparent;
			font-size: inherit;
			padding: 0;
		}

		.atc form {
			display: inline;
		}

		.atc input[type="checkbox"] {
			vertical-align: top;
		}

		.atc .atc_help {
			cursor: help;
		}

		.atc .atc_profile_achievement_tracker_links {
			margin-bottom: 40px;
		}

		.atc .commentthread_entry_quotebox {
			font-size: 11px;
			height: 48px;
			min-height: 48px;
			overflow-y: scroll;
			resize: vertical;
		}

		@media screen and (max-width: 910px) {
			.atc .atc_profile_achievement_tracker_links {
				margin-top: -4px;
				margin-bottom: 12px;
				padding-bottom: 4px;
			}

			.atc .profile_count_link {
				float: none !important;
				height: auto !important;
				width: auto !important;
			}
		}`;
    document.head.appendChild(style);
    const template = document.createElement('template');
    template.innerHTML = `
		<div class="atc">
			<div class="responsive_count_link_area">
				<div class="atc_profile_achievement_tracker_links">
					<div class="profile_count_link">
						<form>
							<div class="ellipsis">
								<a>
									<span class="count_link_label">Achievement Trackers</span>&nbsp;
									<span class="profile_count_link_total">${trackers.length}</span>
								</a>
							</div>
							${trackers.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1).map(tracker => `<div>
									<label>
										<input type="checkbox" name="trackerName" value="${tracker.name}" ${tracker.ownProfileOnly && !isOwnProfile ? 'disabled' : ''} />
										${tracker.name}
									</label>
									${tracker.getProfileURL() === undefined ? '' :
        `<a class="whiteLink" href="${tracker.getProfileURL()}" target="_blank">
											${iconExternalLink}
										</a>`}
									${tracker.signInLink ? '<small class="atc_help" title="Sign-in required" aria-describedby="atc_sign_in_required">*</small>' : ''}
									${tracker.ownProfileOnly ? '<small class="atc_help" title="Own profile only" aria-describedby="atc_own_profile_only">**</small>' : ''}
								</div>`).join('')}
							<p ${isOwnProfile ? '' : 'hidden'}>
								<label>
									<input type="checkbox" name="trackerName" value="Steam" />
									Steam profile showcases (slow)
								</label>
							</p>
							<p>
								<small id="atc_sign_in_required">
									* Sign-in required
								</small>
								&nbsp;
								<small id="atc_own_profile_only">
									** Own profile only
								</small>
							</p>
							<p>
								<button type="button" class="btn_profile_action btn_medium" id="atc_btn" disabled>
									<span>Find Differences</span>
								</button>
								<span id="atc_counter">0</span>
								selected
							</p>
						</form>
						<div id="atc_output"></div>
					</div>
				</div>
			</div>
		</div>`;
    const node = document.importNode(template.content, true);
    const form = node.querySelector('form');
    const checkboxes = [...form.querySelectorAll('input[type="checkbox"]')];
    const button = form.querySelector('button#atc_btn');
    const buttonSpan = button.querySelector('span');
    const counter = form.querySelector('#atc_counter');
    const output = node.querySelector('#atc_output');
    const updateForm = async () => {
        const formData = new FormData(form);
        const trackerNames = formData.getAll('trackerName');
        button.disabled = trackerNames.length < 2;
        counter.textContent = trackerNames.length.toString();
    };
    form.addEventListener('change', updateForm);
    form.addEventListener('input', updateForm);
    button.addEventListener('click', async () => {
        const formData = new FormData(form);
        button.disabled = true;
        buttonSpan.textContent = 'Loading...';
        for (const checkbox of checkboxes) {
            checkbox.dataset['disabled'] = checkbox.disabled.toString();
            checkbox.disabled = true;
        }
        try {
            await findDifferences(formData, output);
        }
        catch (e) {
            console.error(e);
        }
        buttonSpan.textContent = 'Find Differences';
        button.disabled = false;
        for (const checkbox of checkboxes) {
            checkbox.disabled = checkbox.dataset['disabled'] === 'true';
        }
    });
    container.appendChild(node);
});
async function findDifferences(formData, output) {
    var _a, _b, _c;
    output.innerHTML = '';
    const trackerNames = formData.getAll('trackerName');
    const results = await Promise.all(trackers
        .filter(tracker => trackerNames.includes(tracker.name))
        .map(async (tracker) => ({ tracker, ...await tracker.getStartedGames(formData, []) })));
    if (trackerNames.includes('Steam')) {
        const appids = new Set();
        results.forEach(result => result.games.forEach(game => appids.add(game.appid)));
        const tracker = new Steam(profileData);
        results.push({ tracker, ...await tracker.getStartedGames(formData, [...appids]) });
    }
    const numberOfTrackersWithGames = results.filter(result => result.games.length !== 0).length;
    const mismatchedAppids = groupBy(results.flatMap(r => r.games), g => g.appid)
        .filter(group => {
        if (group.length !== numberOfTrackersWithGames) {
            return true;
        }
        const [game, ...games] = group;
        return games.some(g => g.unlocked !== game.unlocked);
    })
        .map(group => group.key);
    const mismatchedGames = [];
    const steamResult = results.find(result => result.tracker instanceof Steam);
    function* getMismatchedGamesIterator() {
        for (const appid of mismatchedAppids) {
            yield getMismatchedGame(appid).then(game => mismatchedGames.push(game));
        }
    }
    async function getMismatchedGame(appid) {
        var _a;
        let game = steamResult === null || steamResult === void 0 ? void 0 : steamResult.games.find(game => game.appid === appid);
        if (game !== undefined) {
            return game;
        }
        let doc = await getDocument(`${unsafeWindow.g_rgProfileData.url}stats/${appid}/achievements?l=english`, { headers: { 'X-ValveUserAgent': 'panorama' } });
        const match = doc.body.innerHTML.match(/g_rgAchievements = ({.*});/);
        if (match !== null) {
            const g_rgAchievements = JSON.parse(match[1]);
            const isPerfect = g_rgAchievements.totalClosed >= g_rgAchievements.total;
            return {
                appid,
                unlocked: g_rgAchievements.totalClosed,
                total: g_rgAchievements.total,
                name: (_a = doc.body.innerHTML.match(/'SetContentTitle', '(.*) Achievements'/)) === null || _a === void 0 ? void 0 : _a[1],
                isPerfect,
                isCompleted: isPerfect ? true : undefined,
                isCounted: isPerfect,
                isTrusted: undefined,
            };
        }
        doc = await getDocument(`https://steamcommunity.com/stats/${appid}/achievements`);
        const total = doc.querySelectorAll('.achieveRow').length;
        const games = results.flatMap(r => r.games).filter(game => game.appid === appid);
        game = games.find(game => game.total === total);
        if (game !== undefined) {
            return game;
        }
        game = games[0];
        const unlocked = Math.min(game.unlocked, total);
        const isPerfect = unlocked >= total && unlocked !== 0;
        return {
            appid,
            name: game.name,
            unlocked,
            total,
            isPerfect,
            isCompleted: isPerfect ? true : undefined,
            isCounted: isPerfect,
            isTrusted: undefined,
        };
    }
    const iterator = getMismatchedGamesIterator();
    const pool = new (external_PromisePool_default())(iterator, 6);
    await pool.start();
    output.innerHTML = `
		<div>
			${results.sort((a, b) => a.tracker.name.toUpperCase() < b.tracker.name.toUpperCase() ? -1 : 1).filter(result => result.tracker.name !== 'Steam').map(result => {
        var _a;
        let html = `
					<div style="margin-top: 1em;">
						<a class="whiteLink" href="${result.tracker.getProfileURL()}" target="_blank">
							${result.tracker.name} ${iconExternalLink}
						</a>
					</div>`;
        if (result.signIn) {
            html += `
						<span style="color: #b33b32;">
							✖
							<a class="whiteLink" href="${result.tracker.signInLink}" target="_blank">
								Sign in ${result.signInAs ? `as ${external_he_default().escape(result.signInAs)}` : ''} ${iconExternalLink}
							</a>
						</span>`;
        }
        else if (result.error || result.games.length === 0) {
            html += `
						<span style="color: #b33b32;">
							✖ ${(_a = result.error) !== null && _a !== void 0 ? _a : 'No achievements found'}
						</span>`;
        }
        else {
            const mismatchGames = mismatchedGames
                .map(sourceGame => ({ sourceGame, targetGame: result.games.find(game => game.appid === sourceGame.appid) }))
                .map(x => ({ sourceGame: x.sourceGame, targetGame: x.targetGame, game: merge(x.sourceGame, x.targetGame) }))
                .filter(x => { var _a; return x.sourceGame.unlocked !== ((_a = x.targetGame) === null || _a === void 0 ? void 0 : _a.unlocked); });
            const gamesWithMissingAchievements = mismatchGames.filter(x => { var _a, _b; return x.sourceGame.unlocked > ((_b = (_a = x.targetGame) === null || _a === void 0 ? void 0 : _a.unlocked) !== null && _b !== void 0 ? _b : 0); });
            const gamesWithRemovedAchievements = mismatchGames.filter(x => { var _a, _b; return x.sourceGame.unlocked < ((_b = (_a = x.targetGame) === null || _a === void 0 ? void 0 : _a.unlocked) !== null && _b !== void 0 ? _b : 0); });
            if (gamesWithMissingAchievements.length === 0 && gamesWithRemovedAchievements.length === 0) {
                html += `
							<span style="color: #90ba3c;">
								✔ Up to date
							</span>`;
            }
            else {
                if (gamesWithMissingAchievements.length !== 0) {
                    const missingAchievementsSum = gamesWithMissingAchievements
                        .map(x => { var _a, _b; return x.sourceGame.unlocked - ((_b = (_a = x.targetGame) === null || _a === void 0 ? void 0 : _a.unlocked) !== null && _b !== void 0 ? _b : 0); })
                        .reduce((a, b) => a + b);
                    const namesHTML = gamesWithMissingAchievements
                        .map(x => { var _a; return ({ name: external_he_default().escape((_a = x.game.name) !== null && _a !== void 0 ? _a : `Unknown App ${x.game.appid}`), url: result.tracker.getGameURL(x.game) }); })
                        .sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
                        .map(x => x.url !== undefined ? `<a class="whiteLink" href="${x.url}" target="_blank">${x.name}</a>` : x.name)
                        .join(' &bull; ');
                    const jsonGames = gamesWithMissingAchievements.map(x => ({ appid: x.sourceGame.appid, unlocked: x.sourceGame.unlocked, total: x.sourceGame.total }));
                    const recoverLinkHTML = result.tracker.getRecoverLinkHTML(isOwnProfile, jsonGames);
                    html += `
								<span style="color: #b33b32;">
									✖ ${missingAchievementsSum.toLocaleString()} missing achievement${missingAchievementsSum !== 1 ? 's' : ''}
									in ${gamesWithMissingAchievements.length.toLocaleString()} game${gamesWithMissingAchievements.length !== 1 ? 's' : ''}
								</span>
								<div class="commentthread_entry_quotebox">
									${namesHTML}
								</div>
								<div style="font-size: 11px; margin-bottom: 1em;">
									<a class="whiteLink" data-copy="${gamesWithMissingAchievements.map(g => g.sourceGame.appid)}">
										Copy App IDs
									</a>
									&bull;
									<a class="whiteLink" data-copy="${external_he_default().escape(JSON.stringify({ version: '2.0', apps: jsonGames }))}">
										Copy JSON
									</a>
									${recoverLinkHTML === undefined ? '' : `
										&bull;
										${recoverLinkHTML}
									`}
								</div>`;
                }
                if (gamesWithRemovedAchievements.length !== 0) {
                    const removedAchievementsSum = gamesWithRemovedAchievements
                        .map(x => { var _a, _b; return ((_b = (_a = x.targetGame) === null || _a === void 0 ? void 0 : _a.unlocked) !== null && _b !== void 0 ? _b : 0) - x.sourceGame.unlocked; })
                        .reduce((a, b) => a + b);
                    const namesHTML = gamesWithRemovedAchievements
                        .map(x => { var _a; return ({ name: external_he_default().escape((_a = x.game.name) !== null && _a !== void 0 ? _a : `Unknown App ${x.game.appid}`), url: result.tracker.getGameURL(x.game) }); })
                        .sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
                        .map(x => x.url !== undefined ? `<a class="whiteLink" href="${x.url}" target="_blank">${x.name}</a>` : x.name)
                        .join(' &bull; ');
                    const jsonGames = gamesWithMissingAchievements.map(x => ({ appid: x.sourceGame.appid, unlocked: x.sourceGame.unlocked, total: x.sourceGame.total }));
                    html += `
								<span style="color: #b33b32;">
									✖ ${removedAchievementsSum.toLocaleString()} removed achievement${removedAchievementsSum !== 1 ? 's' : ''}
									in ${gamesWithRemovedAchievements.length.toLocaleString()} game${gamesWithRemovedAchievements.length !== 1 ? 's' : ''}
								</span>
								<div class="commentthread_entry_quotebox">
									${namesHTML}
								</div>
								<div style="font-size: 11px;">
									<a class="whiteLink" data-copy="${gamesWithRemovedAchievements.map(g => g.sourceGame.appid)}">
										Copy App IDs
									</a>
									&bull;
									<a class="whiteLink" data-copy="${external_he_default().escape(JSON.stringify({ version: '2.0', apps: jsonGames }))}">
										Copy JSON
									</a>
								</div>`;
                }
            }
        }
        return html;
    }).join('')}
		</div>`;
    for (const anchor of output.querySelectorAll('a[data-copy]')) {
        anchor.addEventListener('click', async function () {
            await navigator.clipboard.writeText(this.dataset['copy']);
            alert('Copied to clipboard.');
        });
    }
    for (let sourceIndex = 0; sourceIndex < results.length; sourceIndex++) {
        const source = results[sourceIndex];
        const validationErrors = [];
        for (const game of source.games) {
            const messages = source.tracker.validate(game);
            if (messages.length !== 0) {
                validationErrors.push({ name: (_a = game.name) !== null && _a !== void 0 ? _a : `Unknown App ${game.appid}`, messages: messages.join(', ') });
            }
        }
        if (validationErrors.length !== 0) {
            // TODO: display validation errors on screen instead of logging to console
            const csv = `Name,Validation Errors\n`
                + validationErrors.map(e => `${escapeCSV(e.name)},${e.messages}`).join('\n');
            console.info(`Validation errors on ${source.tracker.name}:`);
            if (validationErrors.length <= 100) {
                console.table(validationErrors);
                console.debug(csv);
            }
            else {
                console.info(csv);
            }
        }
        for (let targetIndex = sourceIndex + 1; targetIndex < results.length; targetIndex++) {
            const target = results[targetIndex];
            // join games from both trackers into map
            const gamesMap = new Map();
            for (const game of source.games) {
                gamesMap.set(game.appid, { source: game });
            }
            for (const game of target.games) {
                let value = gamesMap.get(game.appid);
                if (value === undefined) {
                    value = {};
                    gamesMap.set(game.appid, value);
                }
                value.target = game;
            }
            // convert map into array
            const games = [...gamesMap].map(([appid, game]) => {
                var _a, _b, _c, _d;
                return ({
                    appid: appid,
                    name: (_d = (_b = (_a = game.source) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : (_c = game.target) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : `Unknown App ${appid}`,
                    source: game.source,
                    target: game.target,
                });
            });
            const differences = [];
            for (const game of games) {
                const messages = [];
                if (game.source === undefined) {
                    messages.push(`missing on ${source.tracker.name}`);
                }
                else if (game.target === undefined) {
                    messages.push(`missing on ${target.tracker.name}`);
                }
                else {
                    if (game.source.unlocked > game.target.unlocked) {
                        messages.push(`+${game.source.unlocked - game.target.unlocked} unlocked on ${source.tracker.name}`);
                    }
                    else if (game.target.unlocked > game.source.unlocked) {
                        messages.push(`+${game.target.unlocked - game.source.unlocked} unlocked on ${target.tracker.name}`);
                    }
                    else if (game.source.isPerfect === true && game.target.isPerfect === false) {
                        messages.push(`perfect on ${source.tracker.name} but not on ${target.tracker.name}`);
                    }
                    else if (game.target.isPerfect === true && game.source.isPerfect === false) {
                        messages.push(`perfect on ${target.tracker.name} but not on ${source.tracker.name}`);
                    }
                    else if (game.source.isCompleted === true && game.target.isCompleted === false) {
                        messages.push(`completed on ${source.tracker.name} but not on ${target.tracker.name}`);
                    }
                    else if (game.target.isCompleted === true && game.source.isCompleted === false) {
                        messages.push(`completed on ${target.tracker.name} but not on ${source.tracker.name}`);
                    }
                    else if (game.source.isCounted === true && game.target.isCounted === false) {
                        messages.push(`counts on ${source.tracker.name} but not on ${target.tracker.name}`);
                    }
                    else if (game.target.isCounted === true && game.source.isCounted === false) {
                        messages.push(`counts on ${target.tracker.name} but not on ${source.tracker.name}`);
                    }
                    if (game.source.isTrusted === true && game.target.isTrusted === false) {
                        messages.push(`trusted on ${source.tracker.name} but not on ${target.tracker.name}`);
                    }
                    else if (game.target.isTrusted === true && game.source.isTrusted === false) {
                        messages.push(`trusted on ${target.tracker.name} but not on ${source.tracker.name}`);
                    }
                }
                if (messages.length !== 0) {
                    differences.push({
                        appid: game.appid,
                        name: game.name,
                        messages: messages.join('; '),
                        sourceURL: source.tracker.getGameURL((_b = game.source) !== null && _b !== void 0 ? _b : game.target),
                        targetURL: target.tracker.getGameURL((_c = game.target) !== null && _c !== void 0 ? _c : game.source),
                    });
                }
            }
            if (differences.length === 0) {
                console.info(`No differences between ${source.tracker.name} and ${target.tracker.name}.`);
                continue;
            }
            differences.sort((a, b) => a.appid - b.appid);
            // TODO: display differences on screen instead of logging to console
            const csv = `App ID,Name,Differences,${source.tracker.name} URL,${target.tracker.name} URL\n`
                + differences.map(d => `${d.appid},${escapeCSV(d.name)},${d.messages},${d.sourceURL},${d.targetURL}`).join('\n');
            console.info(`Differences between ${source.tracker.name} and ${target.tracker.name}:`);
            if (differences.length <= 100) {
                console.table(differences);
                console.debug(csv);
            }
            else {
                console.info(csv);
            }
        }
    }
}
function escapeCSV(string) {
    if (string.indexOf('"') !== -1) {
        return `"${string.replace(/"/g, '""')}"`;
    }
    else if (string.indexOf(',') !== -1) {
        return `"${string}"`;
    }
    return string;
}

/******/ })()
;