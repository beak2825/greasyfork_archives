// ==UserScript==
// @name        AniHIDE - Hide Unrelated Episodes
// @namespace   https://greasyfork.org/en/users/781076-jery-js
// @version     2.4.0
// @description Filter animes in the Home/New-Episodes pages to show only what you are watching or plan to watch based on your anime list on MAL or AL.
// @icon        https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ
// @author      Jery
// @license     MIT
// @match       https://yugenanime.*/*
// @match       https://yugenanime.tv/*
// @match       https://yugenanime.sx/*
// @match       https://anitaku.*/*
// @match       https://anitaku.pe/*
// @match       https://gogoanime.*/*
// @match       https://gogoanime.tv/*
// @match       https://gogoanime3.*/*
// @match       https://gogoanime3.co/*
// @match       https://animepahe.*/
// @match       https://animepahe.si/
// @match       https://animesuge.to/*
// @match       https://animesuge.*/*
// @match       https://*animesuge.cc/*
// @match       https://www.miruro.*/*
// @match       https://www.miruro.tv/*
// @match       https://miruro.to/*
// @match       https://miruro.online/*
// @match       https://animekai.to/*
// @match       https://animetsu.cc/*
// @match       https://kaido.to/*
// @match       https://kuudere.to/*
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @grant       GM.xmlHttpRequest
// @require     https://unpkg.com/axios/dist/axios.min.js
// @require     https://cdn.jsdelivr.net/npm/@trim21/gm-fetch@0.2.1
// @downloadURL https://update.greasyfork.org/scripts/470233/AniHIDE%20-%20Hide%20Unrelated%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/470233/AniHIDE%20-%20Hide%20Unrelated%20Episodes.meta.js
// ==/UserScript==


/**************************
 * Notify new Update
***************************/
if (GM_getValue("version") != GM_info.script.version) {
    // refreshList();
    GM_setValue("version", GM_info.script.version);
    const msg = `
        ${GM_info.script.name}:\n
        This scipt has been updated!!\n
        What's new:
         -Better handling of dynamic sites [improved detection]
         -Now skips unhiding manually added animes if they are in animelist [fix]
         -Support for alternative titles [Improved detection]
    `
    // alert(msg);
}

/* Preferred Format sample-
What's new:
         -Added AnimePahe [website]
         -Added Timeout for certain sites [workaround]
         -Notification shown for list refresh [feature]
         -Bug Fixes + Code Cleanup`
*/

/**************************
 * CONSTANTS
***************************/
const userSettingsKey = 'userSettings';
const animeListKey = 'animeList';
const manualListKey = 'manualList';


/***************************************************************
 * ANIME SITES
 * -----------
 * the timeout variable is a workaround for SPA sites like
 * Miruro which generate the page dynamically.
 ***************************************************************/
const animeSites = [
    {
        name: 'yugenanime',
        url: ['yugenanime.tv', 'yugenanime.sx', 'yugenanime'],
        item: '.ep-grid > li',
        title: '.ep-origin-name',
        thumbnail: '.ep-thumbnail > img'
    },
    {
        name: 'gogoanime',
        url: ['gogoanime3', 'gogoanimehd', 'gogoanime', 'anitaku'],
        item: '.items > li',
        title: '.name > a',
        thumbnail: '.img > a > img'
    },
    {
        name: 'animepahe',
        url: ['animepahe.si', 'animepahe.ru', 'animepahe.com', 'animepahe'],
        item: '.episode-wrap > .episode',
        title: '.episode-title > a',
        thumbnail: '.episode-snapshot > img',
        observe: '.episode-list-wrapper',
        timeout: 100
    },
    {
        name: 'animesuge',
        url: ['animesuge.to'],
        item: '.item',
        title: '.name > a',
        thumbnail: '.poster img'
    },
    {
        name: 'animesuge',
        url: ['animesuge.cc'],
        item: '.itemlist > li',
        title: '.name a',
        thumbnail: '.poster > img'
    },
    {
        name: 'animesuge',
        url: ['animesuge.su'],
        item: '.bs',
        title: '.tt',
        thumbnail: 'img'
    },
    {
        name: 'miruro',
        url: ['miruro'],
        item: 'a[color][title][href^="/watch"]',
        title: 'h5[title^="Title: "]',
        thumbnail: 'img[alt^="Play "]',
        observe: 'section[aria-labelledby*="continueWatching"] + div',
        timeout: 1200
    },
    {
        name: 'animekai',
        url: ['animekai.to'],
        item: '.aitem',
        title: '.title',
        thumbnail: 'img',
        observe: '.tab-body',
    },
    {
        name: 'gojo',
        url: ['animetsu.cc'],
        item: '.mx-auto > [title], .swiper-slide[title]',
        title: 'a.font-medium, div.text-xs.tracking-wide',
        thumbnail: 'img',
        observe: 'main',
        timeout: 700
    },
    {
        name: 'kaido',
        url: ['kaido.to'],
        item: '.flw-item',
        title: '.film-name > a',
        thumbnail: '.film-poster > img',
    },
    {
        name: 'kuudere',
        url: ['kuudere.to'],
        item: '.anime-card-wrapper',
        title: '.title',
        thumbnail: 'img',
        timeout: 700
    }
];

const services = [
    {
        name: "MyAnimeList",
        icon: "https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ",
        statuses: ['watching', 'plan_to_watch', 'on_hold', 'dropped', 'completed', ''],
        apiBaseUrl: 'https://api.myanimelist.net/v2/users',
        _clientId: "cfdd50f8037e9e8cf489992df497c761",
        async getAnimeList(username, status) {
            const url = `${this.apiBaseUrl}/${username}/animelist?fields="alternative_titles"&status=${status}&limit=1000`;
            const response = await GM_fetch(url, { headers: { 'X-MAL-CLIENT-ID': this._clientId } });   // using GM_fetch to bypass CORS restrictions
            const data = (await response.json()).data;
            return data.map(entry => {
                const titles = [entry.node.title, ...Object.values(entry.node.alternative_titles).flat()].filter(title => title != '');
                return new AnimeEntry(titles);
            });
        }
    },
    {
        name: "AniList",
        icon: "https://anilist.co/img/icons/android-chrome-512x512.png",
        statuses: ['CURRENT', 'PLANNING', 'COMPLETED', 'DROPPED', 'PAUSED', ''],
        apiBaseUrl: 'https://graphql.anilist.co',
        async getAnimeList(username, status) {
            let page = 1, entries = [], hasNextPage = true;
            while (hasNextPage) {
                const query = `
                    query {
                        Page(page:${page}, perPage:50) {
                            pageInfo { hasNextPage, currentPage },
                            mediaList(userName:"${username}", type:ANIME, status:${status}) {
                                media { title { romaji, english, native, userPreferred } }
                            }
                        }
                    }
                `;
                const response = await axios.post(this.apiBaseUrl, { query });
                const data = response.data.data.Page;
                entries = entries.concat(data.mediaList);
                hasNextPage = data.pageInfo.hasNextPage;
                page = data.pageInfo.currentPage + 1;
            }
            return entries.map(entry => {
                const titles = Object.values(entry.media.title).filter(title => title != null)
                return new AnimeEntry(titles)
            });
        }
    },
    {
        name: "YugenAnime",
        icon: "https://yugenanime.tv/static/img/logo__light.png",
        statuses: [1, 2, 4, 5, 3],
        apiBaseUrl: 'https://yugenanime.tv/api/mylist',
        async getAnimeList(username, status) {
            const url = `${this.apiBaseUrl}/?list_status=${status}`;
            const response = await axios.get(url);
            const doc = new DOMParser().parseFromString(response.data.query, 'text/html');
            const list = Array.from(doc.querySelectorAll('.list-entry-row'), row => {
                return new AnimeEntry([row.querySelector('.list-entry-title a').textContent.trim()]);
            });
            return list;
        }
    }
];


/***************************************************************
 * Classes for handling various data like settings, lists,
 * services and websites
 ***************************************************************/
// User settings
class UserSettings {
    constructor(usernames = {}) {
        this.usernames = usernames;
    }
    static load() {
        return GM_getValue(userSettingsKey, new UserSettings());
    }
}

// Anime entry
class AnimeEntry {
    constructor(titles) {
        this.titles = titles;
        this.skip = false;
    }
}

// Anime list
class AnimeList {
    constructor(key) {
        this.entries = GM_getValue(key, []);
    }

    clear() {
        this.entries = [];
    }

    removeEntry(entry) {
        this.entries = this.entries.filter(e => !entry.titles.some(title => e.titles.includes(title)));
    }

    addEntry(entry) {
        this.entries.push(entry);
    }

    getEntry(title) {
        return this.entries.find(e => e.titles.some(t => t.includes(title)) );
    }

    // Use jaro-winkler algorithm to compare whether the given title is similar present in the animelist
    isEntryExist(title) {
        const threshold = 0.8;
        const a = title.toLowerCase();
        return this.entries.some(e => {
            return e.titles.some(t => {
                const b = t.toLowerCase(), m = a.length, n = b.length;
                if (n == 0 || m == 0) return false;
                const max = Math.floor(Math.max(n, m) / 2) - 1, ma = Array(n).fill(false), mb = Array(m).fill(false);
                let mtc = 0;
                for (let i = 0; i < n; i++) {
                    const s = Math.max(0, i - max), e = Math.min(m, i + max + 1);
                    for (let j = s; j < e; j++) {
                        if (!mb[j] && b[i] == a[j]) {
                            ma[i] = true, mb[j] = true, mtc++;
                            break;
                        }
                    }
                }
                if (mtc == 0) return false;
                let tr = 0, k = 0;
                for (let i = 0; i < n; i++) {
                    if (ma[i]) {
                        while (!mb[k]) k++;
                        if (b[i] !== a[k]) tr++;
                        k++;
                    }
                }
                const sim = (mtc / n + mtc / m + (mtc - tr / 2) / mtc) / 3;
                // if (sim >= threshold) console.log(`jaro-winkler: ${b} - ${a} = ${sim}`);
                return sim >= threshold;
            });
        });
    }
}

// Website class
class Website {
    constructor(site) {
        this.site = site;

        // Apply initial CSS styles
        GM_addStyle(`
            /* Show eps on Hover */
            ${site.item} ${site.thumbnail}:hover {
                opacity: 1 !important;
                filter: brightness(1) !important;
                transition: .2s ease-in-out !important;
            }
        `);
    }

    // Gets all the anime items on the page
    getAnimeItems() {
        return document.querySelectorAll(this.site.item);
    }

    // Gets the anime title from the anime item
    getAnimeTitle(animeItem) {
        const titleEl = animeItem.querySelector(this.site.title);
        // Get only text content, excluding child elements
        return titleEl ? Array.from(titleEl.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join('').trim() : '';
    }

    undarkenRelatedEps(animeList) {
        this.getAnimeItems().forEach(item => {
            const thumbnail = item.querySelector(this.site.thumbnail);
            if (!thumbnail) return;
            const title = this.getAnimeTitle(item);
            const shouldUndarken = animeList.isEntryExist(title) && !manualList.getEntry(title)?.skip;
            thumbnail.style.cssText = shouldUndarken
                ? 'opacity:1;   filter:brightness(1);   transition:.2s ease-in-out'
                : 'opacity:0.5; filter:brightness(0.3); transition:.4s ease-in-out';
        });
    }
}


/***************************************************************
 * Initialize all data and setup menu commands
 ***************************************************************/
// User settings
let userSettings = UserSettings.load();

// Anime list and manual list
const animeList = new AnimeList(animeListKey);
const manualList = new AnimeList(manualListKey);

// Service instance
let service = null;
chooseService(parseInt(GM_getValue('service', 1)));

// Register menu commands
GM_registerMenuCommand('Show Options', showOptions);


/***************************************************************
 * Functions for working of script
 ***************************************************************/
// Show menu options as a prompt
function showOptions() {
    let options = { 'Refresh Anime List': refreshList, 'Change Username': changeUsername, 'Manually Add/Remove Anime': modifyManualAnime, 'Choose Service': chooseService }
    let opt = prompt(
        `${GM_info.script.name}\n\nChoose an option:\n${Object.keys(options).map((key, i) => `${i + 1}. ${key}`).join('\n')}`, '1'
    )
    if (opt !== null) {
        let index = parseInt(opt) - 1
        let selectedOption = Object.values(options)[index]
        selectedOption()
    }
}

// Refresh the anime list from MAL and store it using GM_setValue
async function refreshList() {
    GM_setValue('lastRefreshTime', new Date().getTime());
    try {
        const username = userSettings.usernames[service.name]
        if (!username) {
            alert(`Please set your ${service.name} username to continue.`);
            changeUsername();
            return;
        }

        GM_notification("Refreshing your list...", GM_info.script.name, service.icon)

        const entriesWatching = await service.getAnimeList(username, service.statuses[0]);
        const entriesPlanned = await service.getAnimeList(username, service.statuses[1]);
        const entriesManual = manualList.entries;

        const oldAnimeList = animeList.entries.map(entry => entry.titles);
        animeList.clear();
        entriesWatching.forEach(entry => animeList.addEntry(entry));
        entriesPlanned.forEach(entry => animeList.addEntry(entry));
        entriesManual.forEach(entry => manualList.addEntry(entry));
        console.log('animeList', animeList.entries);
        const newAnimeList = animeList.entries.map(entry => entry.titles);

        GM_setValue(animeListKey, animeList.entries);

		const removedAnime = oldAnimeList.filter(oldAnime => !newAnimeList.some(newAnime => oldAnime[0] === newAnime[0]));
		const addedAnime = newAnimeList.filter(newAnime => !oldAnimeList.some(oldAnime => newAnime[0] === oldAnime[0]));
		const unchangedAnime = newAnimeList.filter(newAnime => oldAnimeList.some(oldAnime => newAnime[0] === oldAnime[0]));

        let msg = '';
        if (removedAnime.length > 0) msg += `-${removedAnime.map(a=>a[0]).join('\n-')}\n`;
        if (addedAnime.length > 0) msg += `+${addedAnime.map(a=>a[0]).join('\n+')}\n`;
        msg += `${unchangedAnime.map(a=>a[0]).join('\n')}`;

        alert(`Anime list refreshed (${newAnimeList.length - oldAnimeList.length}/${newAnimeList.length}):\n\n${msg}`);
        executeAnimeFiltering();
    } catch (error) {
        console.error('An error occurred while refreshing the anime list:', error);
        alert(`An error occurred while refreshing the anime list:\n\n${error}\n\n\nAlternatively, you can try to refresh the list from any other supported site and return here.\n\nSupported sites: ${animeSites.map(site => site.name).join(', ')}`);
    }
}

// Change MAL username
function changeUsername() {
    const newUsername = prompt(`Enter your ${service.name} username:`);
    if (newUsername) {
        userSettings.usernames[service.name] = newUsername;
        GM_setValue(userSettingsKey, userSettings);
        refreshList();
    }
}

// Manually add anime
function modifyManualAnime() {
    const animeTitle = prompt('This is a fallback mechanism to be used when the anime is not available on any service.\nFor both- Adding and Removing an anime, just enter the anime name.\n\nWith exact spelling, Enter the anime title:').trim();
    if (animeTitle == 'clear') { manualList.clear(); GM_setValue(manualListKey, manualList.entries); alert('Manual List Cleared'); return; }
    if (animeTitle) {
        const animeEntry = new AnimeEntry([animeTitle]);
        if (manualList.isEntryExist(animeTitle)) {
            manualList.removeEntry(animeEntry);
            alert(`Anime Removed Successfully:\n\n${animeEntry.titles}`);
        } else {
            animeEntry.skip = animeList.isEntryExist(animeTitle); // Mark to be skipped if already present in the animeList
            manualList.addEntry(animeEntry);
            alert(`Anime Added Successfully:\n\n${animeEntry.titles[0]}`);
        }
        GM_setValue(manualListKey, manualList.entries);
        executeAnimeFiltering();
    }
}

// Prompt the user to choose a service
function chooseService(ch) {
    let choice = typeof ch == 'number' ? ch : parseInt(GM_getValue('service', 1));

    if (typeof ch !== 'number') {
        const msg = `${GM_info.script.name}\n\nChoose a service:\n${services.map((s, i) => `${i + 1}. ${s.name}`).join('\n')}`;
        choice = prompt(msg, choice);
    }
    if (choice == null) { return } else choice = parseInt(choice);
    let newService = services[choice - 1];

    if (!newService) {
        console.log('Invalid choice. Switch to a different service for now.');
        return chooseService(parseInt(GM_getValue('service', 1)));
    } else service = newService;

    GM_setValue('service', choice);

    if (typeof ch !== 'number') {
        GM_notification(`Switched to ${service.name} service.`, GM_info.script.name, service.icon);
        refreshList();
    }

    console.log(`Switched to ${service.name} service.`);
    return service;
}

// Undarken related eps based on the anime titles
function executeAnimeFiltering() {
    const animeSite = getCurrentSite();
    if (!animeSite) return console.error('No matching website found.');

    const thisSite = new Website(animeSite);
    console.log('animeList', animeList);

    const entriesList = Object.create(animeList);
    entriesList.entries = animeList.entries.concat(manualList.entries);
    manualList.entries.forEach(e => {if (e.skip) entriesList.removeEntry(e)});
    setTimeout(() => {
        if (document.querySelector(animeSite.observe)) {
            let timeoutId;
            new MutationObserver(() => {
                clearTimeout(timeoutId); // Debounce the callback
                timeoutId = setTimeout(() => thisSite.undarkenRelatedEps(entriesList), 100);
            }).observe(document.querySelector(animeSite.observe), { childList: true, subtree: true, attributeFilter: ['src'] });
        }

        thisSite.undarkenRelatedEps(entriesList);
    }, animeSite.timeout || 0);
}

// Get the current website based on the URL
function getCurrentSite() {
    const currentUrl = window.location.href.toLowerCase();
    return animeSites.find(website => website.url.some(site => currentUrl.includes(site)));
}

// Workaround for SPA sites like Miruro for which the script doesn't auto reload on navigation
function initScript() {
    executeAnimeFiltering();

    // Handle SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL changed, re-running AniHIDE');
            executeAnimeFiltering();
        }
    }).observe(document.querySelector('body'), { subtree: true, childList: true });

    // Also watch for History API changes
    window.addEventListener('popstate', executeAnimeFiltering);
    window.addEventListener('pushstate', executeAnimeFiltering);
    window.addEventListener('replacestate', executeAnimeFiltering);
}

// Initialize the script
initScript();

// Refresh the anime list if it has been more than a week since the last refresh
const lastRefreshTime = GM_getValue('lastRefreshTime', 0);
const currentTime = new Date().getTime();
const refreshInterval = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
if (currentTime - lastRefreshTime > refreshInterval || GM_getValue("version") != GM_info.script.version) {
    refreshList();
}