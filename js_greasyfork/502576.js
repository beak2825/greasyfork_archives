// ==UserScript==
// @name         Dim Watched YouTube Videos
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Dim the thumbnails of watched videos on YouTube
// @author       Shaun Mitchell <shaun@shitchell.com>
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/502576/Dim%20Watched%20YouTube%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/502576/Dim%20Watched%20YouTube%20Videos.meta.js
// ==/UserScript==

/** Dim Watched YouTube Videos *************************************************

# What it does

This script will dim the thumbnails of watched videos on YouTube.

# Why?

This makes it easier to identify videos that you haven't watched yet. Especially
on a channel that you watch frequently, it can be hard to parse through all the
videos to find the ones you haven't seen. This makes those unwatched videos
stand out while the watched videos fade into the background.

# Settings

This script uses GM_config to manage settings. You can access the settings by
clicking the "Open Settings" button in the Userscript manager. The following
settings are available:

## thumbnail_opacity (default: 0.3)

This is the opacity of the thumbnail when the video has been watched. Values
must be a decimal between 0-1. Lower values result in more transparent/faded
thumbnails. If relative opacity is enabled, the opacity of a video will be
determined by this value + the percentage of the video watched. i.e.: fully
watched videos will be set to this opacity, but partially watched videos will be
less transparent. e.g.:

- if relative_opacity == true && thumbnail_opacity == 0.5:
    - 100% watched = 0.5 opacity (the full value of thumbnail_opacity)
    - 75% watched = 0.625 opacity
    - 50% watched = 0.75 opacity
    - 25% watched = 0.875 opacity
    - 0% watched = 1.0 opacity (fully visible)
- if relative_opacity == false && thumbnail_opacity == 0.5:
    - 100% watched = 0.5 opacity
    - 75% watched = 0.5 opacity
    - 50% watched = 0.5 opacity
    - 25% watched = 0.5 opacity
    - 0% watched = 1.0 opacity

## use_relative_opacity (default: true)

If true, enables relative opacity, and thumbnail opacity will be determined
relative to the video watch time. If false, the thumbnail opacity will be set
to a fixed value for all watched videos, regardless of how much of the video
has been watched.

## min_watched (default: 0)

The minimum percentage of the video that must be watched for the thumbnail to
be dimmed. If the video has been watched less than this percentage, the
thumbnail will be set to full opacity. e.g.:

- if min_watched == 50:
    - 100% watched = dimmed
    - 75% watched = dimmed
    - 50% watched = dimmed
    - 25% watched = not dimmed
    - 0% watched = not dimmed
*******************************************************************************/

/** To-do
 * - [ ] Add a "Saved!" message to the settings page when settings are
 *       automatically saved
 */

/*******************************************************************************
 Global variables and default configuration
*******************************************************************************/

const DEFAULT_CONFIG = {
    use_relative_opacity: true,
    thumbnail_opacity: 0.3, // percentage, 0-1
    min_watched: 0, // percentage, 0-100
    opaque_on_hover: true,
    debug: "error",
    dim_throttling_ms: 0 // ms
}
const seenQuerySelectors = [
    "ytd-thumbnail-overlay-resume-playback-renderer > div#progress"
];
const parentThumbnailSelectors = [
    "ytd-thumbnail",
    "div#thumbnail.ytd-rich-grid-media"
]
const seenQuerySelector = seenQuerySelectors.join(", ");
const parentThumbnailSelector = parentThumbnailSelectors.join(", ");
const observeParentSelector = "#content";
const logLevels = {
    none: -1,
    log: 0,
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
}


/*******************************************************************************
 Configuration management
*******************************************************************************/

/** GM_config setup
*******************************************************************************/

const gmc = new GM_config({
    id: 'GM_config-yt_dwv',
    title: 'Dim Watched YouTube Videos',
    fields: {
        SECTION_main: {
            type: 'hidden',
            section: ['Main settings']
        },
        use_relative_opacity: {
            label: 'Use relative opacity',
            type: 'checkbox',
            default: DEFAULT_CONFIG.use_relative_opacity
        },
        thumbnail_opacity: {
            label: 'Thumbnail opacity',
            type: 'float',
            default: DEFAULT_CONFIG.thumbnail_opacity,
            min: 0,
            max: 1
        },
        min_watched: {
            label: 'Minimum percentage watched',
            type: 'int',
            default: DEFAULT_CONFIG.min_watched,
            min: 0,
            max: 100
        },
        opaque_on_hover: {
            label: 'Opaque on hover',
            type: 'checkbox',
            default: DEFAULT_CONFIG.opaque_on_hover
        },
        SECTION_dev: {
            type: 'hidden',
            section: ['Developer options']
        },
        debug: {
            label: 'Log level',
            type: 'select',
            options: ['off', 'error', 'warn', 'info', 'debug'],
            default: DEFAULT_CONFIG.debug
        },
        dim_throttling_ms: {
            label: 'Dimming throttling (ms)',
            type: 'int',
            default: DEFAULT_CONFIG.dim_throttling_ms,
            min: 0
        }
    },
    css: `
        #GM_config-yt_dwv {
            // background-color: #333;
            background-color: rgba(30, 30, 30, 0.95);
            color: #FFF;
            font-family: Arial, sans-serif;
            padding: 1em;
        }
        #GM_config-yt_dwv .section_header {
            font-size: 1.5em;
            GM_config-yt_dwv: 1em;
            padding: 0.5em;
            color: #CF9FFF;
            border: none;
            border-bottom: 1px solid #CF9FFF;
            text-align: left;
            background: none;
        }
        #GM_config-yt_dwv .reset, #GM_config-yt_dwv .saveclose_buttons {
            display: none;
        }
        // #GM_config-yt_dwv .reset {
        //     color: #CF9FFF;
        // }
        // #GM_config-yt_dwv_saveBtn {
        //     display: none;
        // }
        #GM_config-yt_dwv .config_var {
            margin-bottom: 0.5em;
            font-size: 1em;
        }
        #GM_config-yt_dwv .config_var label.field_label,
        #GM_config-yt_dwv .config_var input,
        #GM_config-yt_dwv .config_var select,
        #GM_config-yt_dwv .config_var textarea {
            font-size: inherit;
            width: 15em;
            display: inline-block;
        }
        #GM_config-yt_dwv .config_var input,
        #GM_config-yt_dwv .config_var textarea {
            outline: none;
            background: none;
            color: #FFF;
            border: none;
            border-bottom: 1px solid white;
            transition: border-color 0.2s;
        }
        #GM_config-yt_dwv .config_var input:focus,
        #GM_config-yt_dwv .config_var textarea:focus {
            border-color: #CF9FFF;
            outline: none;
        }
        #GM_config-yt_dwv .field_label {
            font-weight: bold;
            text-align: right;
        }
        #GM_config-yt_dwv .saveclose_buttons {
            background-color: #CF9FFF;
            color: #333;
            padding: 5px 10px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
        }
        #GM_config-yt_dwv input[type="checkbox"] {
            width: 20px;
            height: 20px;
        }
    `,
    /* default frameStyle
        bottom: auto; border: 1px solid #000; display: none; height: 75%;
        left: 0; margin: 0; max-height: 95%; max-width: 95%; opacity: 0;
        overflow: auto; padding: 0; position: fixed; right: auto; top: 0;
        width: 75%; z-index: 9999;
    */
    frameStyle: `
        // Default
        bottom: auto;
        display: none;
        margin: 0;
        padding: 0;
        overflow: auto;
        opacity: 0;
        position: fixed;
        left: 0;
        right: auto;
        top: 0;
        max-height: 95%;
        max-width: 95%;
        z-index: 9999;
        // Custom
        border: none;
        background-color: transparent;
        height: 50%;
        width: 69em;
        border-radius: 1em;
    `,
    events: {
        open: function(frameDocument, frameWindow, frame) {
            const config = this;

            debug(
                `Calling GM_config onOpen event with:`,
                `frameDocument: ${frameDocument}`,
                `frameWindow: ${frameWindow}`,
                `frame: ${frame}`
            );

            // Add an event listener for 'Esc' key within the GM_config iframe
            frameDocument.addEventListener('keydown', event => {
                if (event.key === 'Escape') config.close();
            });

            // Add a click listener on the main document
            document.addEventListener('mousedown', function clickClose(event) {
                const configFrame = document.querySelector('#GM_config-yt_dwv');
                if (configFrame && !configFrame.contains(event.target))
                    config.close();
                document.removeEventListener('mousedown', clickClose);
            });

            // Add an event listener to each field to save the value on change
            for (const fieldId in config.fields) {
                const field = config.fields[fieldId];
                debug(`Adding event listeners to field ${field.id}`);
                field.node.addEventListener('keyup', function() {
                    debug(`Field ${field.id} keyup, saving`);
                    config.save();
                });
                field.node.addEventListener('change', function() {
                    debug(`Field ${field.id} changed, saving`);
                    config.save();
                });
            }
        },
        close: function(...args) {
            info(`Calling GM_config onClose event with args:`, args);
        },
        save: function(config) { },
        reset: function(config) { },
        init: main // Wait for GM_config to load before running the main script
    }
});
unsafeWindow.gmc = gmc;

// Userscript manager menu items
GM_registerMenuCommand('Open Settings', () => gmc.open(), 'o');
GM_registerMenuCommand('Reset Settings', () => {
    gmc.reset();
    gmc.save();
}, 'r');

/** GM_config helper function for async/init
*******************************************************************************/

/**
 * Retrieve a config value
 *
 * This function will retrieve a configuration value from the GM_config object
 * or the default config list if GM_config is not yet initialized. Yay async.
 *
 * @param {String} key  The key of the configuration value to retrieve
 * @returns {any}       The value of the configuration key
 */
function getConfig(key) {
    let source;
    let value;
    if (gmc.isInit) {
        value = gmc.get(key);
        source = "GM_config";
    } else {
        value = DEFAULT_CONFIG[key];
        source = "default"
    }
    debug(`retrieved ${source} config {${key}: ${value}}`);
    return value;
}


/*******************************************************************************
 Utility functions
*******************************************************************************/

/**
 * Log a message to the console if debug mode is enabled
 *
 * This function will log a message to the console if debug mode is enabled in
 * the configuration. If debug mode is disabled, the message will not be logged.
 *
 * @param {String} mode  Console method to use (e.g. "log", "warn", "error")
 * @param {any[]} args   Arguments to log to the console
 * @returns {void}
 */
function log(mode, ...args) {
    if (gmc.isInit) {
        const debugConfig = gmc.get("debug");
        const debugConfigLevel = logLevels[debugConfig];
        const modeLevel = logLevels[mode] || 0;
        const debugEnabled = modeLevel >= debugConfigLevel;
        if (!debugEnabled) return;

        // If the first argument is not a console log method, default to "log" and
        // add "mode" to the arguments list
        if (!["debug", "info", "warn", "error"].includes(mode)) {
            args.unshift(mode);
            mode = "log";
        }

        console[mode](
            `%c[${GM_info.script.name} | ${mode}]`,
            "color: #CF9FFF; font-weight: bold;",
            " ",
            ...args);
    }
}
function debug(...args) { log("debug", ...args); }
function info(...args) { log("info", ...args); }
function warn(...args) { log("warn", ...args); }
function error(...args) { log("error", ...args); }

/**
 * Given a starting node, search for a parent element
 *
 * This function will search for a parent element that matches a given CSS
 * selector starting from a given node. The search will continue up the DOM tree
 * until a matching parent element is found or the maximum distance is reached.
 *
 * @param {HTMLHtmlElement} node  Starting node to search from
 * @param {String} selector       CSS selector to match parent elements against
 * @param {Number} maxDistance    Maximum number of elements before giving up
 * @return {HTMLHtmlElement}      Matching parent element or null if not found
 */
function findParent(node, selector, maxDistance = Infinity) {
    let currentElement = node.parentElement;
    let distance = 0;

    while (currentElement && distance < maxDistance) {
        if (currentElement.matches(selector)) {
            return currentElement; // Return the matching parent element
        }
        // Move up to the next parent
        currentElement = currentElement.parentElement;
        // Increment the distance counter
        distance++;
    }

    // Return null if no match is found within the max distance
    return null;
}

/**
 * Wait for an element to be available in the DOM
 *
 * This function will wait for an element to be available in the DOM before
 * resolving the promise. If the element is already available, the promise will
 * resolve immediately.
 *
 * @link               https://stackoverflow.com/a/61511955
 * @param {String}     A CSS selector to match elements against selector
 * @returns {Promise}  A promise that resolves when the element is found
 */
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


/*******************************************************************************
 Core functions
*******************************************************************************/

/**
 * Dim the thumbnails of watched videos
 *
 * This function will search for watched progress bars on YouTube, attempt to
 * find their associated thumbnail, and dim the thumbnail if the video has been
 * watched. The following configuration options are available:
 * - use_relative_opacity: If true, the thumbnail opacity will be calculated
 *   relative to the percentage watched. If false, the thumbnail opacity will be
 *   set to a fixed value.
 * - thumbnail_opacity: The opacity of the thumbnail when the video has been
 *   watched. This value is used as a lower bound when use_relative_opacity is
 *   true.
 * - min_watched: The minimum percentage of the video that must be watched for
 *   the thumbnail to be dimmed. If the video has been watched less than this
 *   percentage, the thumbnail will be set to full opacity.
 *
 * @returns {void}
 */
function dimWatchedThumbnails(
    minWatched,
    thumbnailOpacity,
    useRelativeOpacity,
    opaqueOnHover
) {
    if (minWatched === undefined)
        minWatched = getConfig("min_watched");
    if (thumbnailOpacity === undefined)
        thumbnailOpacity = getConfig("thumbnail_opacity");
    if (useRelativeOpacity === undefined)
        useRelativeOpacity = getConfig("use_relative_opacity");
    if (opaqueOnHover === undefined)
        opaqueOnHover = getConfig("opaque_on_hover");

    debug(
        `Dimming watched videos with minWatched=${minWatched},`,
        `thumbnailOpacity=${thumbnailOpacity},`,
        `useRelativeOpacity=${useRelativeOpacity}`
    )

    // Collect all of the watched progress bars
    const watchedProgressBars = document.querySelectorAll(seenQuerySelector);

    // Create the combined parent selector
    const parentSelector = parentThumbnailSelector

    if (watchedProgressBars.length > 0)
        info(`Dimming ${watchedProgressBars.length} watched videos`);
    debug('dimming:', watchedProgressBars);
    // Loop over them and try to get their associated thumbnail, dimming it out
    for (const watchedProgressBar of watchedProgressBars) {
        const watchedPercentage = parseInt(watchedProgressBar.style.width);

        debug(
            `Searching for parent of progress bar at ${watchedPercentage}%`,
            watchedProgressBar
        );
        const thumbnail = findParent(watchedProgressBar, parentSelector, 6);
        if (thumbnail === null) {
            error("Could not find parent thumbnail for", watchedProgressBar);
        }
        if (thumbnail) {
            let watchedOpacity;
            if (watchedPercentage < minWatched) {
                debug(
                    `Progress bar ${watchedPercentage} < ${minWatched},`,
                    "setting opacity to 1.0",
                    watchedProgressBar
                );
                watchedOpacity = "";
            } else if (useRelativeOpacity) {
                watchedOpacity = (
                    (
                        thumbnailOpacity * (100 - watchedPercentage) / 100
                    ) + thumbnailOpacity
                );
            } else {
                watchedOpacity = thumbnailOpacity
            }
            debug(
                `${thumbnailOpacity} * (100 - ${watchedPercentage})`,
                `/ 100) + ${thumbnailOpacity} = ${watchedOpacity}`,
                thumbnail
            );
            thumbnail.style.opacity = watchedOpacity;
            if (opaqueOnHover) {
                thumbnail.classList.add("opaque-on-hover");
            }
        }
    }
}

/** Mutation Observer for progress bars
*******************************************************************************/

// Used to throttle the dimming of thumbnails and determine if a dimming is
// scheduled. While a dimming is scheduled, no new dimmings will be scheduled,
// and we can take a break from processing new nodes.
let dimTimeout;

// Throttling function to dim the thumbnails
function scheduleDimThumbnails() {
    if (dimTimeout) {
        debug("Dimming already scheduled, skipping...");
        return
    } else {
        debug("Scheduling dimming...");
        dimTimeout = setTimeout(() => {
            dimTimeout = null;
            dimWatchedThumbnails()
        }, getConfig("dim_throttling_ms"));
    }
}

// Function to process the added nodes
function processAddedNodes(nodes) {
    debug("Processing added nodes:", nodes);
    nodes.forEach(node => {
        // Check if the node matches the seen progress bar selector
        // Note: `nodeType === 1` is an element node
        if (node.nodeType === 1 && node.matches(seenQuerySelector)) {
            info("Found a new progress bar:", node);
            // Queue the dimWatchedThumbnails to run after the dim interval
            scheduleDimThumbnails();
            // Since the scheduled dimming will handle all of the progress bars,
            // we can break out of the loop early
            return;
        }
    });
}

// Mutation observer callback function
function mutationCallback(mutations) {
    if (dimTimeout) return;
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            processAddedNodes(mutation.addedNodes);
        }
    });
}


/*******************************************************************************
 Main script
*******************************************************************************/

function main() {
    'use strict';
    
    info("Dim Watched YouTube Videos loading...");
    
    // Create a class to toggle the opacity if opaque_on_hover is enabled
    GM_addStyle(`
        .opaque-on-hover { transition: opacity 0.2s; }
        .opaque-on-hover:hover { opacity: 1.0 !important; }
    `);
    
    // Wait for the primary element to become available
    info(`waiting for '${observeParentSelector}'...`);
    waitForElement(observeParentSelector).then(el => {
        info("#primary loaded!");
    
        // Dim the progress bars initially
        dimWatchedThumbnails();
    
        // Set up the MutationObserver
        const observeParent = document.querySelector(observeParentSelector);
        const observer = new MutationObserver(mutationCallback);
    
        info("Watching for new thumbnails in", observeParent);
        observer.observe(
            observeParent,
            {childList: true, subtree: true, attributes: false}
        );
    
        // Expose debug tools if needed
        unsafeWindow._dev = { observer, observeParent, gmc, GM_config };
    });
}
