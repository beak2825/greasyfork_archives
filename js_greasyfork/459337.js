// ==UserScript==
// @name         YouTube - Force Compact Grid (increases max # videos per row)
// @namespace    https://gist.github.com/lbmaian/8c6961584c0aebf41ee7496609f60bc3
// @version      0.5
// @description  Force YouTube to show compact grid (max 6 videos per row) rather than "slim" grid (max 3 videos per row)
// @author       lbmaian
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/embed/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459337/YouTube%20-%20Force%20Compact%20Grid%20%28increases%20max%20%20videos%20per%20row%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459337/YouTube%20-%20Force%20Compact%20Grid%20%28increases%20max%20%20videos%20per%20row%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;

    const logContext = '[YouTube - Force Compact Grid]';

    var debug;
    if (DEBUG) {
        debug = function(...args) {
            console.debug(logContext, ...args);
        };
    } else {
        debug = function() {};
    }

    function log(...args) {
        console.log(logContext, ...args);
    }

    function info(...args) {
        console.info(logContext, ...args);
    }

    function warn(...args) {
        console.warn(logContext, ...args);
    }

    function error(...args) {
        console.error(logContext, ...args);
    }

    // Updates richGridRenderer data to coerce unknown/slim grid style to compact style.
    function updateResponseData(response, logContext) {
        const tabs = response?.contents?.twoColumnBrowseResultsRenderer?.tabs;
        if (DEBUG) {
            debug(logContext, 'contents.twoColumnBrowseResultsRenderer.tabs (snapshot)', window.structuredClone(tabs));
        }
        if (tabs) {
            for (let i = 0; i < tabs.length; i++) {
                const tab = tabs[i];
                const tabRenderer = tab.tabRenderer;
                if (tabRenderer) {
                    const richGridRenderer = tabRenderer.content?.richGridRenderer;
                    if (richGridRenderer && (!richGridRenderer.style || richGridRenderer.style == 'RICH_GRID_STYLE_SLIM')) {
                        const logTabContext = logContext + ' tab ' + (tabRenderer.title ?? tabRenderer.tabIdentifier ?? i);
                        // /feed/playlists page (and possibly other pages) have additional properties:
                        // layoutSizing: 'RICH_GRID_LAYOUT_SIZING_COMPACT'
                        // layoutType: 'RICH_GRID_LAYOUT_TYPE_COMPACT_LIST'
                        // These need to be deleted when setting style, or otherwise, the page can hang.
                        if (richGridRenderer.layoutSizing) {
                            log(logTabContext, 'tabRenderer.content.richGridRenderer.layoutSizing:', richGridRenderer.layoutSizing, '=> (none)');
                            delete richGridRenderer.layoutSizing;
                        }
                        if (richGridRenderer.layoutType) {
                            log(logTabContext, 'tabRenderer.content.richGridRenderer.layoutType:', richGridRenderer.layoutType, '=> (none)');
                            delete richGridRenderer.layoutType;
                        }
                        log(logTabContext, 'tabRenderer.content.richGridRenderer.style:', richGridRenderer.style, '=> RICH_GRID_STYLE_COMPACT');
                        richGridRenderer.style = 'RICH_GRID_STYLE_COMPACT';
                    }
                }
            }
        }
    }

    // Note: Both of the following commented-out event listeners are too late:
    // ytd-app's own yt-page-data-fetched event listener (onYtPageDataFetched) already fires
    // by the time our own yt-page-data-fetched event listener fires,
    // and yt-navigate-finish fires after yt-page-data-fetched fires.

    // document.addEventListener('yt-page-data-fetched', evt => {
    //     debug('Navigated to', evt.detail.pageData.url);
    //     debug(evt);
    //     updateResponseData(evt.detail.pageData.response, 'yt-page-data-fetched pageData.response');
    // });

    // document.addEventListener('yt-navigate-finish', evt => {
    //     debug('Navigated to', evt.detail.response.url);
    //     debug(evt);
    //     updateResponseData(evt.detail.response.response, 'yt-navigate-finish response.response');
    // });

    const symSetup = Symbol(logContext + ' setup');

    // yt-page-data-fetched event fires on both new page load and channel tab change.
    // Need to hook into ytd-app's ytd-app's own yt-page-data-fetched event listener (onYtPageDataFetched),
    // so that we can modify the data before that event listener fires.
    function setupYtdApp(ytdApp, logContext, errorFunc=error) {
        // ytd-app's prototype is initialized after the element is created,
        // so need to check that the onYtPageDataFetched method exists.
        if (!ytdApp || !ytdApp.onYtPageDataFetched) {
            return errorFunc('unexpectedly could not find ytd-app.onYtPageDataFetched');
        }
        if (ytdApp[symSetup]) {
            return;
        }
        debug('found yt-App', ytdApp, logContext);
        const origOnYtPageDataFetched = ytdApp.onYtPageDataFetched;
        ytdApp.onYtPageDataFetched = function(evt, detail) {
            debug(evt);
            updateResponseData(evt.detail.pageData.response, 'at yt-page-data-fetched pageData.response');
            return origOnYtPageDataFetched.call(this, evt, detail);
        };
        debug('ytd-app onYtPageDataFetched hook set up');
        ytdApp[symSetup] = true;
    }

    // Need to hook into ytd-page-manager's attachPage to hook into ytd-browse.
    function setupYtdPageManager(ytdPageManager, logContext, errorFunc=error) {
        if (!ytdPageManager || !ytdPageManager.attachPage) {
            return errorFunc('unexpectedly could not find ytd-page-manager.attachPage');
        }
        if (ytdPageManager[symSetup]) {
            return;
        }
        debug('found ytd-page-manager', ytdPageManager, logContext);
        const origAttachPage = ytdPageManager.attachPage;
        ytdPageManager.attachPage = function(page) {
            debug('attachPage', page);
            if (page.is === 'ytd-browse') {
                setupYtdBrowse(page, 'at ytd-page-manager.attachPage');
            }
            return origAttachPage.call(this, page);
        };
        debug('ytd-page-manager attachPage hook set up');
        ytdPageManager[symSetup] = true;
    }

    // Need to hook into ytd-browse's computeFluidWidth(data, selectedTab, pageSubtype)
    // (formerly computeRichGridValue(pageSubtype)) to ensure returns false for home page
    // to match that of the subscription/channel pages.
    function setupYtdBrowse(ytdBrowse, logContext, errorFunc=error) {
        if (!ytdBrowse || !ytdBrowse.computeFluidWidth) {
            return errorFunc('unexpectedly could not find ytd-browse.computeFluidWidth');
        }
        if (!ytdBrowse) {
            return errorFunc('unexpectedly could not find ytd-browse');
        }
        if (ytdBrowse[symSetup]) {
            return;
        }
        debug('found ytd-browse', ytdBrowse, logContext);
        const origComputeFluidWidth = ytdBrowse.computeFluidWidth;
        ytdBrowse.computeFluidWidth = function(data, selectedTab, pageSubtype) {
            debug('computeFluidWidth', pageSubtype);
            if (pageSubtype === 'home') {
                return false;
            }
            return origComputeFluidWidth.call(this, pageSubtype);
        };
        debug('ytd-app computeFluidWidth hook set up');
        ytdBrowse[symSetup] = true;
    }

    // Note: Following didn't work to force ytd-browse's computeFluidWidth to return false for home page,
    // since in the EXPERIMENT_FLAGS.rich_grid_browse_compute_kill_switch=false case,
    // that function still ends up returning true for non-channel pages.
    // function setupExperimentFlags(logContext) {
    //     const ytcfg = window.ytcfg;
    //     if (ytcfg) {
    //         const expFlags = ytcfg.get('EXPERIMENT_FLAGS');
    //         if (expFlags && expFlags.rich_grid_browse_compute_kill_switch !== false) {
    //             log(logContext, 'ytcfg.EXPERIMENT_FLAGS.rich_grid_browse_compute_kill_switch:',
    //                 expFlags.rich_grid_browse_compute_kill_switch, '=>', false);
    //             expFlags.rich_grid_browse_compute_kill_switch = false;
    //         }
    //     }
    // }

    // By the time ytd-page-manager's attached event fires, ytd-app both exists
    // and has its prototype initialized as needed in the above setup functions.
    // (This also fires sooner than a MutationObserver would find such a ytd-app.)
    // This is also the perfect hook for hooking into ytd-page-manager,
    // which in turn allows hooking into ytd-browse's computeFluidWidth.
    document.addEventListener('attached', evt => {
        const ytdApp = document.getElementsByTagName('ytd-app')[0];
        debug(evt);
        setupYtdApp(ytdApp, 'at ytd-page-manager.attached');
        const ytdPageManager = evt.srcElement;
        setupYtdPageManager(ytdPageManager, 'at ytd-page-manager.attached');
    });
    // In case, ytd-app somehow already exists at this point.
    const ytdApp = document.getElementsByTagName('ytd-app')[0];
    setupYtdApp(ytdApp, 'at document-start', () => {});
    //setupExperimentFlags('at document-start');

    // Note: updating ytInitialData may not be necessary, since yt-page-data-fetched also fires for new page load,
    // and in that case, the event's detail.pageData.response is the same object as ytInitialData,
    // but DOMContentLoaded sometimes fires before ytd-app's onYtPageDataFetched fires (or rather, before we can hook into it),
    // so this is done just in case.
    document.addEventListener('DOMContentLoaded', evt => {
        debug('ytInitialData', window.ytInitialData);
        updateResponseData(window.ytInitialData, 'at DOMContentLoaded ytInitialData');
        //setupExperimentFlags('at DOMContentLoaded');
    });
})();
