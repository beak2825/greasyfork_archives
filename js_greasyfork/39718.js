// ==UserScript==
// @name            YouTube (New Design) | Compact Subscription Feed
// @namespace       de.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/1aec97019cde4fe37619e36eb730b216/raw/
// @version         1.0.0
// @description     Optimized YouTube Subscription feed list view with more information on less space
// @author          sidneys
// @icon            https://www.youtube.com/favicon.ico
// @include         http*://www.youtube.com/*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @require         https://greasyfork.org/scripts/38889-greasemonkey-waitforkeyelements-2018/code/Greasemonkey%20%7C%20waitForKeyElements%202018.js
// @run-at          document-end
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39718/YouTube%20%28New%20Design%29%20%7C%20Compact%20Subscription%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/39718/YouTube%20%28New%20Design%29%20%7C%20Compact%20Subscription%20Feed.meta.js
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
 * Inject Stylesheet
 */
let injectStylesheet = () => {
    console.debug('injectStylesheet');

    GM_addStyle(`
    /* ==========================================================================
       GLOBAL
       ========================================================================== */

    .hide
    {
        opacity: 0 !important;
    }


    /* ==========================================================================
       LIST
       ========================================================================== */

    /* Container
       ========================================================================== */

    .layout-list div#content
    {
        position: relative !important;
        margin-top: 2% !important;
        width: 95% !important;
    }

    .layout-list div.branded-page-v2-primary-col > div.yt-card
    {
        margin-top: 0 !important;
    }

    /* Header
       ========================================================================== */

    .layout-list ol.section-list > li:first-child div.feed-item-container
    {
        border-top: none !important;
        background-image: linear-gradient(to bottom, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.25)) !important;
        background-repeat: no-repeat !important;
        background-size: 100% 45px !important;
    }

    .layout-list ol.section-list > li:first-child div.feed-item-container div.menu-container
    {
        margin-bottom: 20px !important;
    }

    .layout-list ol.section-list > li:first-child div.feed-item-container div.shelf-title-table
    {
        display: table !important;
        width: 100% !important;
    }

    .layout-list ol.section-list > li:first-child div.feed-item-container div.shelf-title-table h2
    {
        display: none !important;
    }

    .layout-list ol.section-list > li:first-child div.feed-item-container div.shelf-title-table .menu-container
    {
        display: block !important;
    }

    /* ==========================================================================
       ITEM
       ========================================================================== */

    /* Stripes
       ========================================================================== */

    .layout-list #contents.ytd-section-list-renderer > *.ytd-section-list-renderer:nth-child(odd)
    {
        background-color: rgba(0, 0, 0, 0.1) !important;
    }

    /* Container
       ========================================================================== */

    .layout-list ytd-shelf-renderer
    {
        border-bottom: 1px solid #5a5a5a !important;
        border-top: none !important;
        padding-bottom: 12px !important;
        padding-top: 12px !important;
    }

    .layout-list .text-wrapper.ytd-video-renderer
    {
        max-width: none !important;
    }

    .layout-list .grid-subheader.ytd-shelf-renderer
    {
        display: none !important;
    }

    .layout-list #contents.ytd-shelf-renderer
    {
        margin-top: 0 !important;
    }

    .layout-list ytd-expanded-shelf-contents-renderer
    {
        margin-bottom: 0 !important;
    }

    /* Thumbnail
       ========================================================================== */

    .layout-list ytd-thumbnail
    {
        width: 72px !important;
        height: auto !important;
        margin-left: 16px !important;
    }

    .layout-list ytd-thumbnail-overlay-time-status-renderer
    {
        color: rgb(118, 118, 118) !important;
        font-size: 12px !important;
        background-color: transparent !important;
        bottom: 15% !important;
    }

    .layout-list ytd-thumbnail-overlay-resume-playback-renderer:before
    {
        top: -37px !important;
        width: 72px !important;
        height: 41px !important;
        line-height: 36px !important;
        font-size: 1em !important;
    }

    .layout-list ytd-thumbnail-overlay-resume-playback-renderer:after
    {
        font-size: 0.75rem !important;
        font-weight: !important;
    }

    /* Title
       ========================================================================== */

    /*.layout-list #title-wrapper.ytd-video-renderer
    {
        padding: 4px 0 !important;
        display: block !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        max-width: none !important;
        margin-right: 50px !important;
    }*/

    .layout-list #video-title.ytd-video-renderer
    {
        font-size: 13px !important;
        line-height: 1.3em !important;
        font-weight: 500 !important;
        display: inline !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        background: none !important;
    }

    .layout-list .badge-style-type-verified.ytd-badge-supported-renderer
    {
        margin: 0 0 0 5px !important;
    }

    /* Channel
       ========================================================================== */

    .layout-list a.yt-simple-endpoint.yt-formatted-string
    {
        color: #1ea4e8 !important;
    }

    /* Description
       ========================================================================== */

    .layout-list #description-text.ytd-video-renderer
    {
        max-width: 70% !important;
        margin-top: 4px !important;
        display: none !important;
    }

    /* Badges
       ========================================================================== */

    .layout-list ytd-video-meta-block #byline-container
    {
        display: none !important;
    }

    /* Time
       ========================================================================== */

    .layout-list span.timestamp.ytd-video-meta-block
    {
        float: right !important;
        position: absolute !important;
        right: 0 !important;
        margin-right: 16px !important;
    }

    .layout-list span.timestamp.ytd-video-meta-block br
    {
        display: none !important;
    }
    `);
};

/**
 * Feed in list / grid layout?
 * @returns {Boolean} - Page layout
 */
let isListLayout = () => !Boolean(document.querySelector('div.multirow-shelf'));

/**
 * Adapt feed item element
 * @param {HTMLElement} element - Feed item container
 */
let adaptItemLayout = (element) => {
    console.debug('adaptItemLayout');

    // DOM
    const titleElement = element.querySelector('#video-title.ytd-video-renderer');
    const verifiedElement = element.querySelector('#byline-container.ytd-video-meta-block yt-icon.ytd-badge-supported-renderer');
    const channelElement = element.querySelector('a.yt-simple-endpoint.yt-formatted-string');
    const videoMetaDivList = element.querySelectorAll('div.yt-lockup-meta');
    const videoBadgesDiv = element.querySelector('div.yt-lockup-badges');
    const videoLiveSpan = element.querySelector('span.yt-badge-live');
    const videoReminderSpan = element.querySelector('span.yt-uix-livereminder');

    // Create Separator
    let elementSeparator = document.createElement('span');
    elementSeparator.innerText = ' | ';

    // Title
    if (titleElement) {
        titleElement.insertBefore(elementSeparator, titleElement.firstChild);
    }

    // Verified
    if (verifiedElement) {
        titleElement.insertBefore(verifiedElement, titleElement.firstChild);
        verifiedElement.style.marginLeft = '4px';
    }

    // Channel
    if (channelElement && titleElement) {
        titleElement.insertBefore(channelElement, titleElement.firstChild);
    }

    // Live Badge
    if (videoLiveSpan && videoBadgesDiv && videoMetaDivList && videoMetaDivList[0] && videoMetaDivList[0].style) {
        videoBadgesDiv.style.display = 'inline-block';
        videoMetaDivList[0].style.display = 'inline-block';
    }

    // Reminder Badge
    if (videoReminderSpan && videoBadgesDiv && videoMetaDivList && videoMetaDivList[0]) {
        videoBadgesDiv.style.display = 'inline-block';
        videoMetaDivList.forEach((videoMetaDiv) => {
            videoMetaDiv.style.display = 'inline-block';
        });
    }
};

/**
 * Adapt timestamp element
 * @param {HTMLElement} element - Timestamp element
 */
let adaptTimestampLayout = (element) => {
    console.debug('adaptTimestampLayout');

    // DOM
    const itemElement = element.closest('ytd-shelf-renderer');
    const videoMetadataLineDiv = itemElement.querySelector('#metadata-line.ytd-video-meta-block');

    // Create new timestamp element
    const timestampElement = document.createElement('span');
    timestampElement.className = 'timestamp ytd-video-meta-block';
    timestampElement.innerText = element.innerText;
    videoMetadataLineDiv.appendChild(timestampElement);

    // Remove old timestamp element
    element.closest('ytd-thumbnail-overlay-time-status-renderer').parentNode.removeChild(element.closest('ytd-thumbnail-overlay-time-status-renderer'));
};


/**
 * Init
 */
let init = () => {
    console.info('init');

    // Check URL
    if (!location.pathname.startsWith(urlPath)) { return; }

    // Add Stylesheet
    injectStylesheet();

    // Set layout helper class (document.body)
    if (isListLayout()) {
        document.body.classList.add('layout-list');
    } else {
        document.body.classList.remove('layout-list');
    }

    // Watch items
    waitForKeyElements('.layout-list ytd-shelf-renderer', (item) => {
        adaptItemLayout(item);
    });

    // Watch timestamps
    waitForKeyElements('span.ytd-thumbnail-overlay-time-status-renderer', (item) => {
        adaptTimestampLayout(item);
    });
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
