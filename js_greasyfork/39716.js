// ==UserScript==
// @name            YouTube (New Design) | Highlight First Watched Video
// @namespace       de.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/53aa0b6eb8b25676fd2b1bcb6b0deca5/raw/
// @version         1.0.0
// @description     Highlight the first watched video in YouTube playlists and subcription feeds
// @author          sidneys
// @icon            https://www.youtube.com/favicon.ico
// @include         http*://www.youtube.com/*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @require         https://greasyfork.org/scripts/38889-greasemonkey-waitforkeyelements-2018/code/Greasemonkey%20%7C%20waitForKeyElements%202018.js
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/39716/YouTube%20%28New%20Design%29%20%7C%20Highlight%20First%20Watched%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/39716/YouTube%20%28New%20Design%29%20%7C%20Highlight%20First%20Watched%20Video.meta.js
// ==/UserScript==

/**
 * @default
 * @constant
 * @global
 */
DEBUG = false;


/**
 * @default
 * @constant
 */
const urlPath = '/feed/subscriptions';

/**
 * Highlight Feed Item
 * @param {HTMLElement} element - div.feed-item-container
 */
let highlightFeedItem = (element) => {
    console.debug('highlightFeedItem');

    // DOM
    const itemElement = element.closest('ytd-shelf-renderer');

    itemElement.style.cssText = `
        border-color: rgb(255, 33, 23) !important;
        border-style: solid !important;
        border-width: 2px !important;
        background-image: linear-gradient(rgba(255, 33, 23, 0.75) 0%, rgba(255, 33, 23, 0.3) 50%) !important;
    `;

    console.debug('First "Watched" Feed Item:', itemElement.querySelector('#video-title').innerText);
};


/**
 * Init
 */
let init = () => {
    console.info('init');

    // Check URL
    if (!location.pathname.startsWith(urlPath)) { return; }


    // Watch feed items
    waitForKeyElements('ytd-thumbnail-overlay-resume-playback-renderer', (item) => {
        highlightFeedItem(item);
    }, true);
};


/**
 * @listens window:Event#load
 */
window.addEventListener('load', () => {
    console.debug('window#load');

    init();
});

/**
 * @listens window:Event#spfdone
 */
window.addEventListener('spfdone', () => {
    console.debug('window#spfdone');

    init();
});
