// ==UserScript==
// @name           Bye Spoilers - Crunchyroll
// @name:es        Bye Spoilers - Crunchyroll
// @namespace      https://github.com/zAlfok/ByeSpoilers-Crunchyroll
// @match          https://www.crunchyroll.com/*
// @match          https://static.crunchyroll.com/vilos-v2/web/vilos/player.html
// @grant          none
// @version        1.2.3
// @license        GPL-3.0
// @author         Alfok
// @description    Censor episode's titles, thumbnails, descriptions and tooltips on Crunchyroll. Skips in-video titles (in dev progress). In other words, you'll avoid spoilers.
// @description:es Censura los títulos, miniaturas, descripciones, URLs y 'tooltips' de los episodios en Crunchyroll. Salta el título del episodio en el video (en progreso de desarrollo). En otras palabras, evitarás spoilers.
// @icon           https://raw.githubusercontent.com/zAlfok/ByeSpoilers-Crunchyroll/master/assets-images/logov2.png
// @run-at         document-start
// @resource       TITLE_INTERVALS_JSON  https://github.com/zAlfok/ByeSpoilers-Crunchyroll/raw/master/scripts/crunchyroll_titles_intervals_compactSimplified.json
// @grant          GM_getResourceText
// @homepageURL    https://github.com/zAlfok/ByeSpoilers-Crunchyroll
// @supportURL     https://github.com/zAlfok/ByeSpoilers-Crunchyroll/issues
// @downloadURL https://update.greasyfork.org/scripts/501419/Bye%20Spoilers%20-%20Crunchyroll.user.js
// @updateURL https://update.greasyfork.org/scripts/501419/Bye%20Spoilers%20-%20Crunchyroll.meta.js
// ==/UserScript==

// ------------------------------------------------------------------------------------------------------------------
// To customize the script, change the USER_CONFIG object below.
// USER CONFIGS BEGIN
const debugEnable = false; // In order to see what's happening in the script, set this to true. It will log messages to the console.
const USER_CONFIG = {
    // true: Fetch the JSON file instead of using the resource (default is false), 
    // this is works together with SKIP_EPISODE_TITLES
    // Tampermonkey has trouble with GM_getResourceText, so it's better to use fetch 
    // (just try with false first and if it doesn't work, set it to true)
    // Violentmonkey supports GM_getResourceText, so it's better to use it, to avoid 
    // downloading the file every time, however, in this initial phase could be better
    // considering that the file will be updated frequently
    FETCH_INSTEAD_OF_RESOURCE: false, 
    // true: Skip in-video episode titles (in development, default is false)
    SKIP_EPISODE_TITLES: false, 
    // true: Blur episode thumbnails on the following pages:
    // /home: Continue Watching Grid, Watchlist Grid (Hover), 
    // /watchlist: Grid of Episodes (Hover)
    // /history: Grid of Episodes
    // /series: Last Episode, Grid of Episodes
    // /watch: Next/Previous Episode, See More Episodes (Side and PopUp)
    BLUR_EPISODE_THUMBNAILS: true,

    // true: Blur episodes title on the following pages:
    // /home: Continue Watching Grid, Watchlist Grid (Hover), 
    // /watchlist: Grid of Episodes (Hover)
    // /history: Grid of Episodes
    // /series: Last Episode, Grid of Episodes
    // /watch: Next/Previous Episode, See More Episodes (Side and PopUp)
    BLUR_EPISODE_TITLES: false,

    // true: Modify episodes title to "(S#) E# - [Title Censored]" on the following pages:
    // /home: Continue Watching Grid, Continue Watching Grid (Hover), Watchlist Grid (if modifyActive is true, default is false since it's not necessary)
    // /watchlist: Grid of Episodes (if modifyActive is true, default is false since it's not necessary)
    // /history: Grid of Episodes
    // /series: Grid of Episodes, Grid of Episodes (Hover)
    // /watch: Main Title, Next/Previous Episode, See More Episodes (Side and PopUp)
    MODIFY_INSITE_EPISODE_TITLES: true,

    // true: Modify episodes title to "Anime E# - Watch on Crunchyroll" from the tab of your browser. 
    MODIFY_DOCTITLE_EPISODE_TITLE: true,

    // true: Modify episodes title when hovering over certain elements of the page to "(S#) E# - [Title Censored]":
    // /home: Continue Watching Grid
    // /watchlist: Grid of Episodes (Has to be fixed)
    // /history: Grid of Episodes
    // /series: Last Episode, Grid of Episodes 
    // /watch: Next/Previous Episode, See More Episodes (Side and PopUp)
    MODIFY_TOOLTIPS: true,

    // true: Modify URL (replaces it) if episode URL detected. WARNING: This will modify your browser history.
    MODIFY_URL_EPISODE_TITLE: true,

    // true: Blur episode description on the following pages:
    // /home: Continue Watching Grid (Hover)
    // /series: Grid of Episodes (Hover)
    // /watch: Episode Description
    BLUR_EPISODE_DESCRIPTION: true,

    // true: Removes elements related to premium trial:
    // Menu bar "TRY FREE PREMIUM" Button, Banner under player (/watch)
    HIDE_PREMIUM_TRIAL: false
};
// USER CONFIGS END, DO NOT EDIT ANYTHING BELOW IF NOT KNOWING WHAT YOU'RE DOING
// -----------------------------------------------------------------------------------------------------------------

// Global variables to know if relevant elements have been censored
let docTitleCensored = false;
let urlCensored = false;
let titleCensored = false;
// CSS string to apply to the page
let cssE = '';
let titleIntervals = {};
// List of CSS selectors to apply most of the changes (except for the tooltips)
// blurActive and modifyActive control which elements should be blurred and/or modified, advanced control if want to allow certain elements )
const cssSelectorList = {
    "THUMBNAILS": {
        "EP-IMG_HOME-CONT-WATCH_ANIME-LIST_EP-SEE-MORE-POP": {
            selector: '.card figure',
            blurAmount: 20,
            blurActive: true,
            modifyActive: false
        },
        "EP-IMG_HOME-WATCHLIST-HOVER_LIST-WATCHLIST-HOVER": {
            selector: '[data-t="watch-list-card"] .watchlist-card-image__playable-thumbnail--4RQJC figure',
            blurAmount: 20,
            blurActive: true,
            modifyActive: false
        },
        "EP-IMG_EP-NEXT_EP-PREV_EP-SEE-MORE-SIDE": {
            selector: '[data-t="playable-card-mini"] figure',
            blurAmount: 20,
            blurActive: true,
            modifyActive: false
        },
        "EP-IMG_ANIME-INIT": {
            selector: '.up-next-section figure',
            blurAmount: 20,
            blurActive: true,
            modifyActive: false
        },
        "EP-IMG_LIST-HISTORY": {
            selector: '.erc-my-lists-item a .content-image-figure-wrapper__figure-sizer--SH2-x figure',
            blurAmount: 20,
            blurActive: true,
            modifyActive: false
        }
    },
    "TITLES": {
        "EP-TIT_HOME-CONT-WATCH_ANIME-LIST_EP-SEE-MORE-POP": {
            selector: '.card h4 a',
            blurAmount: 20,
            blurActive: true,
            modifyActive: true
        },
        "EP-TIT_HOME-WATCHLIST_LIST-WATCHLIST": {
            selector: '[data-t="watch-list-card"] h5',
            blurAmount: 6,
            blurActive: true,
            modifyActive: false
        },
        "EP-TIT_EP-NEXT_EP-PREV_EP-SEE-MORE-SIDE": {
            selector: '[data-t="playable-card-mini"] h4 a',
            blurAmount: 10,
            blurActive: true,
            modifyActive: true
        },
        "EP-TIT_LIST-HISTORY": {
            selector: '.erc-my-lists-item h4 a',
            blurAmount: 10,
            blurActive: true,
            modifyActive: true
        },
        "EP-TIT_PLAYER": {
            selector: '.current-media-wrapper h1',
            blurAmount: 20,
            blurActive: true,
            modifyActive: true
        },
        "EP-TIT_HOME-CONT-WATCH-HOVER_ANIME-LIST-HOVER": {
            selector: '.card [data-t="episode-title"]',
            blurAmount: 10,
            blurActive: true,
            modifyActive: true
        }
    },
    "DESCRIPTIONS": {
        "EP-DESCR_PLAYER_EPISODE": {
            selector: '.expandable-section__wrapper--G-ttI p',
            blurAmount: 20,
            blurActive: true,
            modifyActive: false
        },
        "EP-DESCR_PLAYER_SERIES": { //needed since had to be more specific (afterwards) to avoid bluring on series description
            selector: '.erc-show-description .expandable-section__wrapper--G-ttI p',
            blurAmount: 0,
            blurActive: true,
            modifyActive: false
        },
        "EP-DESCR_HOME-WATCHLIST-HOVER_ANIME-LIST-HOVER": {
            selector: '.card [data-t="description"]',
            blurAmount: 10,
            blurActive: true,
            modifyActive: false
        }
    }
};
const langList_episodeRegexList = {
    "ar": /شاهد على كرانشي رول$/,
    "de": /Schau auf Crunchyroll$/,
    "en": /Watch on Crunchyroll$/,
    "es": /Ver en Crunchyroll en español$/,
    "es-es": /Ver en Crunchyroll en castellano$/,
    "fr": /Regardez sur Crunchyroll$/,
    "it": /Guardalo su Crunchyroll$/,
    "pt-br": /Assista na Crunchyroll$/,
    "pt-pt": /Assiste na Crunchyroll$/,
    "ru": /смотреть на Crunchyroll$/,
    "hi": /क्रंचीरोल पर देखें$/
}
// CSS just for bluring/hiding elements 
function concatStyleCSS() {
    debugEnable && console.log(USER_CONFIG.BLUR_EPISODE_THUMBNAILS ? "BLUR_EPISODE_THUMBNAILS: ON" : "BLUR_EPISODE_THUMBNAILS: OFF");      
    if (USER_CONFIG.BLUR_EPISODE_THUMBNAILS) {
        for (let key in cssSelectorList["THUMBNAILS"]) {
            let item = cssSelectorList["THUMBNAILS"][key];
            if (item.blurActive) {
                cssE = cssE + `${item.selector} { filter: blur(${item.blurAmount}px); }`;
            }
        }
    }
    debugEnable && console.log(USER_CONFIG.BLUR_EPISODE_TITLES ? "BLUR_EPISODE_TITLES: ON" : "BLUR_EPISODE_TITLES: OFF");
    if (USER_CONFIG.BLUR_EPISODE_TITLES) {
        for (let key in cssSelectorList["TITLES"]) {
            let item = cssSelectorList["TITLES"][key];
            if (item.blurActive) {
                cssE = cssE + `${item.selector} { filter: blur(${item.blurAmount}px); }`;
            }
        }
    }
    debugEnable && console.log(USER_CONFIG.BLUR_EPISODE_DESCRIPTION ? "BLUR_EPISODE_DESCRIPTION: ON" : "BLUR_EPISODE_DESCRIPTION: OFF");
    if (USER_CONFIG.BLUR_EPISODE_DESCRIPTION) {
        for (let key in cssSelectorList["DESCRIPTIONS"]) {
            let item = cssSelectorList["DESCRIPTIONS"][key];
            if (item.blurActive) {
                cssE = cssE + `${item.selector} { filter: blur(${item.blurAmount}px); }`;
            }
        }
    }
    debugEnable && console.log(USER_CONFIG.HIDE_PREMIUM_TRIAL ? "HIDE_PREMIUM_TRIAL: ON, some things will be executed by modifying on mainLogic" : "HIDE_PREMIUM_TRIAL: OFF");
    if (USER_CONFIG.HIDE_PREMIUM_TRIAL) {
        cssE = cssE + '.erc-user-actions > :first-child, .banner-wrapper, .button-wrapper { display: none; }';
        // cssE = cssE + 'vsc-initialized { height: 0%};'; // Not 0% in all cases, it's done on mainLogic, kept here for reference
    }
}
// Gets the serie's name and the episode's number and title from the episode page
function getEpisodeTitleFromEpisodeSite() {
    debugEnable && console.log("[getEpisodeTitleFromEpisodeSite]: Getting episode title from episode site");
    const $episodeTitle = document.querySelector('.erc-current-media-info h1.title, .card h4 a ');
    const $seriesName = document.querySelector('.show-title-link h4, .hero-heading-line h1'); // show-title-link is series name on episode player page, .hero-heading-line is series name on series episode list page
    let episodeTitle = "";
    let episodeNumber = "";
    let seriesName = $seriesName?.textContent ?? "";
    if ($episodeTitle?.textContent) {
        episodeTitle = $episodeTitle.textContent.split(' - ');
        if (episodeTitle.length > 0) {
            debugEnable && console.log('[getEpisodeTitleFromEpisodeSite]: Episode title with separator: ', $episodeTitle.textContent);
            episodeNumber = episodeTitle[0];
            episodeTitle = episodeTitle[1];
        } else {
            debugEnable && console.log('[getEpisodeTitleFromEpisodeSite]: Episode title without separator: ', $episodeTitle.textContent);
        }
    } else {
        debugEnable && console.warn('[getEpisodeTitleFromEpisodeSite]: Episode title not found');
    }
    return [episodeNumber, episodeTitle, seriesName];
}
// Censor the URL only on episode pages
function censorUrl() {
    let [episodeNumber, episodeTitle, seriesName] = getEpisodeTitleFromEpisodeSite();
    debugEnable && console.log(`[censorUrl]: New title: censored-${seriesName.replace(/ /g, "_")}-${episodeNumber}`);
    window.history.replaceState(null, '', `censored-${seriesName.replace(/ /g, "_")}-${episodeNumber}`);
    urlCensored = true;
    debugEnable && console.log("[censorUrl]: URL censored");
    
    if (docTitleCensored && titleCensored) {
        document.documentElement.style.filter = 'none';
    }
}
// Censor the document title (browser's taba) only on episode pages
function censorDocTitle() {
    const crunchyLang = document.documentElement.lang;
    const episodeRegex = langList_episodeRegexList[crunchyLang] || langList_episodeRegexList["en"];
    const [episodeNumber, episodeTitle, seriesName] = getEpisodeTitleFromEpisodeSite();

    if (document.title.includes("[Title Censored]")) {
        debugEnable && console.log("[censorDocTitle]: Title already censored");
        return;
    }
    const titleSuffix = episodeRegex.source.replace('\$', "");
    let newTitle = "[Title Censored] - " + titleSuffix;
    if (!!seriesName && !!episodeNumber) {
        newTitle = `${seriesName} Episode ${episodeNumber} [Title Censored] - ${titleSuffix}`;
    } else if (!!seriesName) {
        newTitle = `${seriesName} [Title Censored] - ${titleSuffix}`;
    } else if (!!episodeNumber) {
        newTitle = `Episode ${episodeNumber} [Title Censored] - ${titleSuffix}`;
    }
    debugEnable && console.log("[censorDocTitle]: New title: ", newTitle);
    document.title = newTitle;
    docTitleCensored = true;
    debugEnable && console.log("[censorDocTitle]: Title censored");

    if (titleCensored && (isEpisodePage() && urlCensored)) {
        document.documentElement.style.filter = 'none';
    }
}
// Censor tooltips with episode titles (exlusion made on mainLogic for watchlist page)
function censorTooltips() {
    const tooltipTitles = document.querySelectorAll(
        '.card div a[title], ' + // TOOLTIPS_HOME-CONT-WATCH_ANIME-LIST_EP-SEE-MORE-POP
        '[data-t="playable-card-mini"] a[title], ' + //TOOLTIPS_EP-NEXT_EP-PREV_EP-SEE-MORE-SIDE
        '.erc-my-lists-item a[title], ' + //TOOLTIPS_WATCHLIST_HISTORY
        '.erc-series-hero a[title] '  //TOOLTIPS_SERIES
    );
    if (tooltipTitles.length === 0) {
        debugEnable && console.log("[censorTooltips]: No elements found with title attribute");
        return;
    }
    tooltipTitles.forEach(element => {
        const originalTitle = element.getAttribute('title');

        if (originalTitle.includes('[Title Censored]')) {
            debugEnable && console.log("[censorTooltips]: Title already censored");
            return;
        }
        parts = originalTitle.split(' - ');
        let newTitle = parts.length > 1 ? parts[0]+" - [Title Censored]" : "[Title Censored]";
        debugEnable && console.log("[censorTooltips]: New title: ", newTitle);
        element.setAttribute('title', newTitle);
        debugEnable && console.log("[censorTooltips]: Title censored");
    });
    debugEnable && console.log("[censorTooltips]: Censored all elements with title attribute");
}
// Group of functions to determine the current page
function isHomePage() {
    let currentPath = window.location.pathname;
    // Extract keys from the object and build a regular expression (in case of more languages in the future)
    const validPaths = Object.keys(langList_episodeRegexList).map(key => `/${key}/`);
    const isValid = currentPath === "/" || validPaths.includes(currentPath) || validPaths.includes(`${currentPath}/`);
    debugEnable && console.log("[isHomePage]: Current path is valid: ", isValid, " - Current path is: ", currentPath);
    return isValid;
}
function isSeriesPage() {
    let currentPath = window.location.pathname;
    let isValid = currentPath.includes('/series');
    debugEnable && console.log("[isSeriesPage]: Current path is valid: ", isValid, " - Current path is: ", currentPath);
    return isValid;
}
function isHistoryPage() {
    let currentPath = window.location.pathname;
    let isValid = currentPath.includes('/history');
    debugEnable && console.log("[isHistoryPage]: Current path is valid: ", isValid, " - Current path is: ", currentPath);
    return isValid;
}
function isEpisodePage() {
    let currentPath = window.location.pathname;
    let isValid = currentPath.includes('/watch/');
    debugEnable && console.log("[isEpisodePage]: Current path is valid: ", isValid, " - Current path is: ", currentPath);
    return isValid;
}
function isWatchlistPage() {
    let currentPath = window.location.pathname;
    let isValid = currentPath.includes('/watchlist');
    debugEnable && console.log("[isWatchlistPage]: Current path is valid: ", isValid, " - Current path is: ", currentPath);
    return isValid;
}
function isOtherPage() {
    let currentPath = window.location.pathname;
    // Exctract keys from the object and build a regular expression (in case of more languages in the future)
    let validPaths = Object.keys(langList_episodeRegexList).map(key => `/${key}/`);
    let isValidHome = currentPath === "/" || validPaths.includes(currentPath) || validPaths.includes(`${currentPath}/`);
    let isValidOtherFunctions = currentPath.includes("/series") || currentPath.includes("/history") || currentPath.includes("/watch/") || currentPath.includes("/watchlist");
    let isValid = !isValidHome && !isValidOtherFunctions;
    debugEnable && console.log("[isOtherPage]: Current path is valid: ", isValid, " - Current path is: ", currentPath);
    return isValid;
}
// Generic function to censor titles if have (' - ') separator or not from any of the cssSelectorList["TITLES"] selectors
function censorTitleGeneric(selector) {
    const elementsWithTitle = document.querySelectorAll(selector);
    if (elementsWithTitle.length === 0) {
        debugEnable && console.log("[censorTitleGeneric]: No elements found with selector: ", selector);
        return;
    }
    elementsWithTitle.forEach(element => {
        const content = element.textContent;
        if (content.includes("[Title Censored]")) {
            debugEnable && console.log("[censorTitleGeneric]: Title already censored");
            return; 
        }
        const parts = content.split(" - ");
        let newContent = parts.length > 1 ? parts[0] + " - [Title Censored]" : "[Title Censored]";
        element.textContent = newContent;
    });
    debugEnable && console.log("[censorTitleGeneric]: Censored all elements with selector: ", selector);

    titleCensored = true;
    if (docTitleCensored && (isEpisodePage() && urlCensored)) {
        document.documentElement.style.filter = 'none';
    }
}
// Determines if the user is logged in
function isLogged() {
    if (document.querySelector('.user-menu-account-section')) {
        debugEnable && console.log('[isLogged]: User is logged in');
        return true;
    } else {
        debugEnable && console.log('[isLogged]: User is NOT logged in');
        return false;
    }
}
// Main code block
function mainLogic() {
    debugEnable && console.log("[mainLogic]: START");
    const homeContinueWatching = document.querySelector('.erc-feed-continue-watching-item');
    const historyListSite = document.querySelector('.erc-history-content')
    let notLogged = !isLogged();
    let notHomeContinueWatchingOnHomePage = isHomePage() && !homeContinueWatching;
    let notHistoryListSiteOnHistoryPage = isHistoryPage() && !historyListSite;
    // If not logged (no censorable elements) or not home continue watching on home page (no censorable elements) 
    // or not history list site on history page (no censorable elements), then remove blur effect
    debugEnable && console.log("[mainLogic]: Has to remove blur since nothing detected?\nNot logged: ", notLogged, "\nnot home continue watching on home page: ", notHomeContinueWatchingOnHomePage, "\nnot history list site on history page: ", notHistoryListSiteOnHistoryPage);
    if (notLogged || notHomeContinueWatchingOnHomePage || notHistoryListSiteOnHistoryPage) {
        document.documentElement.style.filter = 'none';
        debugEnable && console.log("[mainLogic]: Has to remove blur since nothing detected? Yes. No censorable elements detected. Removing blur effect.");
    } else {
        debugEnable && console.log("[mainLogic]: Has to remove blur since nothing detected? No. Censorable elements detected. Evaluating if blur effect should be applied (again).");
        // If it's supposed to censor, apply blur effect back untils all censoring is done (lines below)
        // Verification if title should be censored (only on home, history, series and episode pages)
        let isTitleCensorshipNeeded = isHomePage() || isHistoryPage() || isSeriesPage() || isEpisodePage();
        let isTitleCensoredCorrectly = !isTitleCensorshipNeeded || titleCensored;

        // Verification if URL should be censored (only on episode pages)
        let isUrlCensorshipNeeded = isEpisodePage();
        let isUrlCensoredCorrectly = !isUrlCensorshipNeeded || urlCensored;

        // Verification if document title should be censored (only on episode pages)
        let isDocTitleCensorshipNeeded = isEpisodePage();
        let isDocTitleCensoredCorrectly = !isDocTitleCensorshipNeeded || docTitleCensored;

        // Final verification if blur effect should be applied again
        if (!isTitleCensoredCorrectly || !isUrlCensoredCorrectly || !isDocTitleCensoredCorrectly) {
            document.documentElement.style.filter = 'blur: 2px;';
            debugEnable && console.log("[mainLogic]: One or more censoring conditions are not met. Applying blur effect again.");
        } else {
            debugEnable && console.log("[mainLogic]: All censoring conditions are met. Not necessary to apply blur effect again.");
        }
    }
    // Makes sure that blur effect is removed when all censoring is done (if censoring wasn't needed, it's removed before)
    if  (
            (isHomePage() && (USER_CONFIG.MODIFY_INSITE_EPISODE_TITLES ? titleCensored : true)) ||
            (isEpisodePage() && (USER_CONFIG.MODIFY_INSITE_EPISODE_TITLES ? titleCensored : true) && 
                                (USER_CONFIG.MODIFY_DOCTITLE_EPISODE_TITLE ? docTitleCensored : true) &&
                                (USER_CONFIG.MODIFY_URL_EPISODE_TITLE ? urlCensored : true)) ||
            (isSeriesPage() && (USER_CONFIG.MODIFY_INSITE_EPISODE_TITLES ? titleCensored : true)) ||
            (isHistoryPage() && (USER_CONFIG.MODIFY_INSITE_EPISODE_TITLES ? titleCensored : true)) ||
            (isWatchlistPage()) ||
            (isOtherPage())
        ){
        document.documentElement.style.filter = 'blur(0px)';
        debugEnable && console.log("[mainLogic]: All needed censorship done. Removing blur effect");
    }
    // Not working at css <style> level, therefore it's done here on each document change to ensure it's applied
    debugEnable && console.log(USER_CONFIG.HIDE_PREMIUM_TRIAL ? "HIDE_PREMIUM_TRIAL (cont): ON, remaining stuff" : "HIDE_PREMIUM_TRIAL (cont): OFF");
    if (USER_CONFIG.HIDE_PREMIUM_TRIAL) {
        const botonWrapper = document.querySelector('.button-wrapper');
        if (botonWrapper) {
            botonWrapper.style.display = 'none';
            debugEnable && console.log("[mainLogic]: HIDE_PREMIUM_TRIAL: Drop-down menu button removed");
        }
        const iconWrapper = document.querySelector('.erc-user-actions > :first-child');
        if (iconWrapper) {
            iconWrapper.style.display = 'none';
            debugEnable && console.log("[mainLogic]: HIDE_PREMIUM_TRIAL: Top navigation bar icon removed");
        }
        const fondo = document.querySelector('.vsc-initialized');
        if (fondo) {
            fondo.style.height = isEpisodePage() ? '0%' : '100%';
            debugEnable && console.log("[mainLogic]: HIDE_PREMIUM_TRIAL: Player background adjusted");
        }
    }
    // Verifies conditions to censor tooltips
    const targetToolTip = document.querySelector('.app-body-wrapper');
    if (USER_CONFIG.MODIFY_TOOLTIPS) {
        debugEnable && onsole.log("[mainLogic-censorToolTips]: USER_CONFIG.MODIFY_TOOLTIPS is enabled.");
        
        if (targetToolTip) {
            debugEnable && console.log("[mainLogic-censorToolTips]: Target tooltip general element (.app-body-wrapper) found.");
            
            if (!isWatchlistPage()) {
                debugEnable && console.log("[mainLogic-censorToolTips]: Not on the watchlist page. Censoring tooltips.");
                censorTooltips();
            } else {
                debugEnable && console.log("[mainLogic-censorToolTips]: On the watchlist page. Skipping tooltip censorship.");
            }
        } else {
            debugEnable && console.log("[mainLogic-censorToolTips]: Target tooltip general element (.app-body-wrapper) not found.");
        }
    } else {
        debugEnable && console.log("[mainLogic-censorToolTips]: USER_CONFIG.MODIFY_TOOLTIPS is not enabled.");
    }
    const targetDocTitle = document.querySelector('head > title');
    // In episode pages operations
    if (isEpisodePage()) {
        debugEnable && console.log("[mainLogic-EP Page exlusive]: On episode page.");
        // Verifies conditions to censor document title (browser's tab) (just on episode pages)
        if (USER_CONFIG.MODIFY_DOCTITLE_EPISODE_TITLE) {
            debugEnable && console.log("[mainLogic-censorDocTitle]: USER_CONFIG.MODIFY_DOCTITLE_EPISODE_TITLE is ON.");
            if (targetDocTitle) {
                debugEnable && console.log("[mainLogic-censorDocTitle]: Modifying document title (browser's tab).");
                censorDocTitle();
            } else {
                debugEnable && console.log("[mainLogic-censorDocTitle]: Document title element not found.");
            }
        } else {
            debugEnable && console.log("[mainLogic-censorDocTitle]: USER_CONFIG.MODIFY_DOCTITLE_EPISODE_TITLE is OFF.");
        }
        // Verifies conditions to censor URL's (just on episode pages)
        if (USER_CONFIG.MODIFY_URL_EPISODE_TITLE) {
            debugEnable && console.log("[mainLogic-censorURL]: USER_CONFIG.MODIFY_URL_EPISODE_TITLE is ON.");
            if (targetDocTitle) {
                debugEnable && console.log("[mainLogic-censorURL]: Modifying URL.");
                censorUrl();
            } else {
                debugEnable && console.log("[mainLogic-censorURL]: Document URL general element (title) not found.");
            }
        } else {
            debugEnable && console.log("[mainLogic-censorURL]: USER_CONFIG.MODIFY_URL_EPISODE_TITLE is OFF.");
        }

    } else {
        debugEnable && console.log("[mainLogic-EP Page exlusive]: Not on episode page.");
    }
    // Verifies conditions to censor episode titles on whatever page is needed. 
    // modifyActive controls if the title should be censored or not to have a more flexible control (advanced)
    if (USER_CONFIG.MODIFY_INSITE_EPISODE_TITLES) {
        debugEnable && console.log("[mainLogic-censorTitleGeneric]: USER_CONFIG.MODIFY_INSITE_EPISODE_TITLES is enabled.");
        for (let key in cssSelectorList["TITLES"]) {
            const config = cssSelectorList["TITLES"][key];
            if (config["modifyActive"]) {
                const selectorString = config["selector"];
                const targetPlayerTitle = document.querySelector(selectorString);
    
                if (targetPlayerTitle) {
                    debugEnable && console.log(`[mainLogic-censorTitleGeneric]: Censoring title for selector: ${selectorString}`);
                    censorTitleGeneric(selectorString);
                } else {
                    debugEnable && console.log(`[mainLogic-censorTitleGeneric]: Target element not found for selector: ${selectorString}`);
                }
            } else {
                debugEnable && console.log(`[mainLogic-censorTitleGeneric]: Modification not active for key: ${key}`);
            }
        }
    } else {
        debugEnable && console.log("[mainLogic-censorTitleGeneric]: USER_CONFIG.MODIFY_INSITE_EPISODE_TITLES is not enabled.");
    }
    
    debugEnable && console.log("[mainLogic]: END");
}

// ----------------------------- v1.2.0 -----------------------------
function extractEpisodeNumber(text) {
    // Regexp to find the episode number after 'E' (ignores possible season number 'S')
    const match = text.match(/(?:S\d+\s*)?E(\d+)/);
    // If there's a match, return the episode number parsed as an integer
    if (match) {
        return parseInt(match[1], 10);
    }
    // If not, return NaN
    return NaN;
}
function timeToSeconds(time) {
    const [minutes, secondsWithMillis] = time.split(':').map(Number);
    return minutes * 60 + secondsWithMillis;
}
function loadJSON() {
    if (USER_CONFIG.FETCH_INSTEAD_OF_RESOURCE) {
        fetch('https://raw.githubusercontent.com/zAlfok/ByeSpoilers-Crunchyroll/master/scripts/crunchyroll_titles_intervals_compactSimplified.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                titleIntervals = data; // Asigna los datos a la variable global
                console.log('Data loaded successfully:', titleIntervals);
            })
            .catch(error => console.error('Error loading JSON:', error));
    } else {
        try {
            const jsonText = GM_getResourceText("TITLE_INTERVALS_JSON");
            titleIntervals = JSON.parse(jsonText);
            debugEnable && console.log("[loadJSON]: Title intervals loaded:", titleIntervals);
        } catch (error) {
            console.error("[loadJSON]: Error loading title intervals:", error, "\nTry to set FETCH_INSTEAD_OF_RESOURCE to true in the USER_CONFIG section.\nTrying to fetch the JSON file instead.");
            fetch('https://raw.githubusercontent.com/zAlfok/ByeSpoilers-Crunchyroll/master/scripts/crunchyroll_titles_intervals_compactSimplified.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    titleIntervals = data; // Asigna los datos a la variable global
                    console.log('Data loaded successfully:', titleIntervals);
                })
                .catch(error => console.error('Error loading JSON:', error));
        }
    }
    }

function initializeMainPage() {
    // Listens to messages from the player iframe
    window.addEventListener('message', function(event) {
        if (event.origin !== "https://static.crunchyroll.com") return;
        debugEnable && console.log("[initializeMainPage]: Main page received message:", event.data);
        
        // If the message contains the current time of the player do the following
        if (event.data.currentTime !== undefined) {
            const iframe = document.querySelector('iframe[src^="https://static.crunchyroll.com"]');
            if (!iframe) {
                debugEnable && console.log("[initializeMainPage]: Player iframe not found");
                return;
            }
            const currentTime = event.data.currentTime;
            debugEnable && console.log("[initializeMainPage]: Current time:", currentTime);
            
            [episodeNumberStr, episodeTitle, seriesName] = getEpisodeTitleFromEpisodeSite();
            episodeNumberInt = extractEpisodeNumber(episodeNumberStr);
            if (titleIntervals[seriesName] && titleIntervals[seriesName][`${episodeNumberInt}`]) {
                const interval = titleIntervals[seriesName][`${episodeNumberInt}`];
                const startTime = timeToSeconds(interval[0]);
                const endTime = timeToSeconds(interval[1]);
                // If current time is within the interval, skip it
                if (currentTime >= startTime-0.5 && currentTime <= endTime+0.5) {

                    debugEnable && console.log("[initializeMainPage]: Skipping interval");
                    // If iframe is found, send a message to the player to skip the interval
                    iframe.contentWindow.postMessage({action: 'setCurrentTime', time: endTime+0.5}, '*');

                } 
            }

        }
    });

    // Ask for the player's current time, every second
    setInterval(function() {
        const iframe = document.querySelector('iframe[src^="https://static.crunchyroll.com"]');
        if (iframe) {
            debugEnable && console.log("[initializeMainPage]: Sending getCurrentTime message (1s interval)");
            iframe.contentWindow.postMessage({action: 'getCurrentTime'}, 'https://static.crunchyroll.com');
        }
    }, 500);
}

function initializePlayerIframe() {
    // Listens to messages from the main page
    window.addEventListener('message', function(event) {
        if (event.origin !== "https://www.crunchyroll.com") return;
        debugEnable && console.log("[initializePlayerIframe]: Player iframe received message:", event.data);
        // Searches for video player
        const player = document.querySelector('video');
        if (!player) {
            debugEnable && console.log("[initializePlayerIframe]: Video player not found in iframe");
            return;
        }
        // Handle received messages
        if (event.data.action === 'getCurrentTime') {
            debugEnable && console.log("[initializePlayerIframe]: Getting current time:", player.currentTime);
            window.parent.postMessage({currentTime: player.currentTime}, 'https://www.crunchyroll.com');
        } else if (event.data.action === 'setCurrentTime') {
            debugEnable && console.log("[initializePlayerIframe]: Setting current time to:", event.data.time);
            player.currentTime = event.data.time;
        }
    });
}

// Execution
try {
    console.log('[Bye Spoilers - Crunchyroll]: Script execution started');
    if (window.location.hostname === "www.crunchyroll.com") {
        console.log("Script running on main Crunchyroll page");
        loadJSON();
        // Blur the page while DOM and script are loading
        document.documentElement.style.filter = 'blur(8px)';
        debugEnable && console.log("[Bye Spoilers - Crunchyroll]: First load blur applied.");
        // Apply cssE style to the page (hidePremiumTrial is not applied here completely, part is done on mainLogic)
        try {
            concatStyleCSS();
            var $newStyleE = document.createElement('style');
            var cssNodeE = document.createTextNode(cssE);
            $newStyleE.appendChild(cssNodeE);
            document.head.appendChild($newStyleE);
            debugEnable && console.log('[ByeSpoilers - Crunchyroll Script]: CSS Applied');
        } catch (e) {
            debugEnable && console.error('[ByeSpoilers - Crunchyroll Script] DEBUG: CSS Error:', e);
        }
        // When the page is loaded, apply the main logic and set a MutationObserver to 
        // apply censorship again when the DOM changes (because of SPA behavior)
        window.addEventListener('load', function () {
            debugEnable && console.log("[Bye Spoilers - Crunchyroll]: Window loaded, executing mainLogic after 0ms timeout");
            setTimeout(mainLogic(),0);
            debugEnable && console.log("[Bye Spoilers - Crunchyroll]: MutationObserver set to apply censorship again when the DOM changes");
            new MutationObserver(() => {
                debugEnable && console.log("[Bye Spoilers - Crunchyroll]: MutationObserver triggered, executing mainLogic");
                mainLogic();
            }).observe(document, { subtree: true, childList: true });
        });

        USER_CONFIG.SKIP_EPISODE_TITLES && initializeMainPage();

    } else if (window.location.hostname === "static.crunchyroll.com") {
        console.log("Script running in video player iframe");
        USER_CONFIG.SKIP_EPISODE_TITLES && initializePlayerIframe();
    }
    console.log('[Bye Spoilers - Crunchyroll]: Script execution finished. Observer keeping track of changes.');

} catch (e) {
    console.error('[Bye Spoilers - Crunchyroll]: There was an error loading the script. If this causes noticeable issues, please leave feedback including this error:', e);
    throw e;
}