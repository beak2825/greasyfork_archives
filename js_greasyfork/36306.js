// ==UserScript==
// @name          Spoiler-free Crunchyroll
// @description   Hide name, image, and description of episodes
// @author        TimeBomb
// @namespace     https://greasyfork.org/users/160017
// @version       0.10
// @copyright     2024
// @run-at        document-start
// @match         https://www.crunchyroll.com/*
// @downloadURL https://update.greasyfork.org/scripts/36306/Spoiler-free%20Crunchyroll.user.js
// @updateURL https://update.greasyfork.org/scripts/36306/Spoiler-free%20Crunchyroll.meta.js
// ==/UserScript==

// USER CONFIGS BEGIN
const USER_CONFIG = {
    // true: Blur episode images on Continue Watching and Your Watchlist and Series pages and Next/Previous episode
    EPISODE_IMAGES: true,

    // true: Blur episode names on Continue Watching and Your Watchlist and Series pages and Next/Previous episode.
    EPISODE_NAMES: true,

    // true: Blur episode name that you're currently watching
    PLAYER_EPISODE_NAME: true,

    // true: Blur episode description that you're currently watching, visible below the player
    PLAYER_EPISODE_DESCRIPTION: true,

    // true: Censors episode name from the title of the page (visible in your browser tab). Series name and episode number still visible.
    TITLE_EPISODE_NAME: true,

    // true: Censor episode name when hovering over certain parts of the website that show episode name in a tooltip. Also blurs on-hover specific-episode title+description.
    // WARNING: This may very slightly impact performance while the site loads. Might be noticeable on old machines.
    TOOLTIPS: true,

    // true: Censors URL (replaces it) when viewing episode. Off by default, change false to true to enable it.
    // WARNING: This will modify your browser history.
    // (This works on any page with "/watch/" in the URL)
    CENSOR_URLS_WITH_EPISODE_NAME: false,
};
// USER CONFIGS END, DO NOT EDIT ANYTHING BELOW

const DEBUG = false;

try {
    console.log('Spoiler-free Crunchyroll script loaded')

    // We very briefly hide the <html> tag here, to ensure the user doesn't see unfiltered content
    // The performance impact of applying our custom CSS is so minimal that users shouldn't notice this
    // Once we finish applying our CSS below, we show the page and apply some final filters to truncate episode names that contain the episode number or link
    document.documentElement.style.display = 'none';

    // Developer Note:
    // We are extra performant because most of our filters are just CSS we apply to the <head> prior to loading.
    // We avoid jQuery and try to avoid function calls for performance's sake.
    // Previous, less optimized versions of this script noticably slowed down the page; our performance is great as of 0.3 though.
    // Super fragile custom CSS incoming, good luck if Crunchyroll changes their DOM.

    let cssE = '';

    if (USER_CONFIG.EPISODE_IMAGES) {
        cssE = cssE + '.card figure { filter: blur(20px) }';
        cssE = cssE + '[data-t="watch-list-card"] figure { filter: blur(20px) }';
        cssE = cssE + '[data-t="playable-card-mini"] figure { filter: blur(20px) }';
        cssE = cssE + '.up-next-thumbnail { filter: blur(20px) }';
        cssE = cssE + '.erc-history-collection .collection-item [data-t="episode-card "] > a { filter: blur(20px) }';
        cssE = cssE + '.erc-history-collection .collection-item [data-t="hover-component"] { filter: blur(14px) }';
    }

    if (USER_CONFIG.EPISODE_NAMES) {
        cssE = cssE + '.card h4 a { filter: blur(20px) }';
        cssE = cssE + '[data-t="watch-list-card"] h5 { filter: blur(6px) }';
        cssE = cssE + '[data-t="playable-card-mini"] h4 a { filter: blur(10px) }';
        cssE = cssE + '.erc-history-collection .collection-item [data-t="episode-card "] h4 a { filter: blur(10px) }';
    }

    if (USER_CONFIG.PLAYER_EPISODE_NAME) {
        cssE = cssE + '.current-media-wrapper h1 { filter: blur(12px) }';
    }

    if (USER_CONFIG.PLAYER_EPISODE_DESCRIPTION) {
        cssE = cssE + '.erc-watch-episode [data-t="expandable-section"] { filter: blur(10px) }';
    }

    if (USER_CONFIG.TOOLTIPS) {
        cssE = cssE + '.episode-list [data-t="hover-component"] { filter: blur(10px); }';
    }

    try {
        var $newStyleE = document.createElement('style');
        var cssNodeE = document.createTextNode(cssE);
        $newStyleE.appendChild(cssNodeE);
        document.head.appendChild($newStyleE);
    } catch (e) {
        if (DEBUG) {
            console.error('[Spoiler-Free Crunchyroll Script] DEBUG: CSS Error:', e);
        }
    }
    document.documentElement.style.display = 'inherit';

    function censorUrl() {
        if (location.href.includes('/watch/')) {
            window.setTimeout(() => window.history.replaceState(null, '', 'censored'), 10);
        }
    }

    function censorDocTitle() {
        // Set episode+series name based off specific elements
        const episodeRegex = /Watch on Crunchyroll$/;
        const censoredTitle = '[Episode Name Censored] - Watch on Crunchyroll';
        const $episodeName = document.querySelector('.erc-current-media-info h1.title');
        const $seriesName = document.querySelector('.show-title-link h4, .hero-heading-line h1'); // show-title-link is series name on episode player page, .hero-heading-line is series name on series episode list page
        let episodeName = false;
        let episodeNumber = false;
        let seriesName = $seriesName?.textContent ?? false;
        // Grab episode name from the player page. Expecting format like: "E1 - Episode name here"
        if ($episodeName?.textContent) {
            episodeName = $episodeName.textContent.split(' - ');
            if (episodeName.length > 0) {
                episodeNumber = episodeName[0];
                episodeName = episodeName[1];
            } else {
                if (DEBUG) {
                    console.warn('[Spoiler-Free Crunchyroll Script] DEBUG: Unable to censor episode name in document title, received unexpected episode name format:', $episodeName.textContent)
                }
            }
        }

        // Update document.title based off the above episode and series name vars
        let newDocTitle;
        if (document.title !== censoredTitle && episodeRegex.test(document.title)) {
            if (DEBUG) {
                console.log('[Spoiler-Free Crunchyroll Script] DEBUG: Censoring document.title, original is:', document.title, 'episode name is:', episodeName);
            }
            if (!!seriesName) {
                if (episodeNumber !== false) {
                    newDocTitle = `${seriesName} ${episodeNumber} - Watch on Crunchyroll`;
                } else {
                    newDocTitle = `${seriesName} - Watch on Crunchyroll`;
                }
            } else {
                if (DEBUG) {
                    console.warn('[Spoiler-Free Crunchyroll Script] DEBUG: Unable to include series name in title of censored episode, series name not found on page');
                }
                // We still censor the document title even if we don't know the episode name - we err on the side of preferring to censor.
                newDocTitle = '[Censored Episode Name] - Watch on Crunchyroll';
            }
        }
        if (newDocTitle && newDocTitle !== document.title) {
            document.title = newDocTitle;
        }
    }
    if (USER_CONFIG.TITLE_EPISODE_NAME) {
        // Observe when document title changes, so we can instantly censor it
        const target = document.querySelector('head > title');
        const observer = new MutationObserver(censorDocTitle);
        observer.observe(target, { subtree: true, characterData: true, childList: true });
        censorDocTitle();
    }

    function censorTooltips() {
        const $elements = document.querySelectorAll('.card div a[title], [data-t="playable-card-mini"] a[title], a.erc-up-next-section[title], [data-t="watch-list-card"] a[title], [data-t="episode-card "] a[title], .erc-playable-collection a[title]');
        $elements.forEach($elementWithTitle => {
            const title = $elementWithTitle.getAttribute('title');
            let seasonEpisodeNum = title.split(' - ');
            seasonEpisodeNum = seasonEpisodeNum.length > 0 ? seasonEpisodeNum[0] : false;
            if (seasonEpisodeNum && seasonEpisodeNum !== title) {
                $elementWithTitle.setAttribute('title', seasonEpisodeNum);
            }
        });
        $upNextEpisodeTooltip = document.querySelector('.erc-up-next-section[title]');
        if ($upNextEpisodeTooltip) {
            $upNextEpisodeTooltip.setAttribute('title', '');
        }
    }

    function initCensorTooltips() {
        const target = document.querySelector('.app-body-wrapper');
        if (target) {
            const observer = new MutationObserver(censorTooltips);
            observer.observe(target, { subtree: true, characterData: true, childList: true });
            censorTooltips();
            return true;
        }
        return false;
    }

    // We need to do some things when the HTML on the page finishes loading, e.g. grab the series name to put it in the document title
    document.addEventListener('DOMContentLoaded', function () {
        if (USER_CONFIG.TITLE_EPISODE_NAME) {
            censorDocTitle();
        }

        if (USER_CONFIG.TOOLTIPS) {
           if (!initCensorTooltips()) {
               // Occasionally app-body-wrapper may not have been loaded on DOMContentLoaded, preventing tooltip censorship initialization.
               //   In this scenario, we try to initialize tooltip censorship again after a couple seconds.
               window.setTimeout(() => {
                   if (!initCensorTooltips()) {
                       console.error('There was a problem initiating tooltip censoring.');
                   }
               }, 2000);
            }
        }

        if (USER_CONFIG.CENSOR_URLS_WITH_EPISODE_NAME) {
            censorUrl();
            function tryCensorUrlOnUrlChange() {
                let lastUrl = window.location.href;
                window.setInterval(() => {
                    if (lastUrl !== window.location.href) {
                        lastUrl = window.location.href;
                        censorUrl();
                    }
                }, 10);
            }
            tryCensorUrlOnUrlChange();
        }
    });
} catch (e) {
    console.error('[Spoiler-Free Crunchyroll Script] There was an error loading the script. If this causes noticeable issues, please leave feedback on the greasyfork page and include this error:', e);
    throw e;
}