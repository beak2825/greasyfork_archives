// ==UserScript==
// @name         1-click feed maintenance
// @namespace    https://greasyfork.org/en/scripts/436097-1-click-feed-maintenance
// @version      4.0.0
// @description  Remove a video or channel from your homepage feed forever, even if you're not logged in to youtube.
// @author       lwkjef
// @match        https://www.youtube.com/
// @match        https://www.youtube.com/?*
// @match        https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436097/1-click%20feed%20maintenance.user.js
// @updateURL https://update.greasyfork.org/scripts/436097/1-click%20feed%20maintenance.meta.js
// ==/UserScript==

/* eslint-env jquery */

// script constants
const scriptName = '1-Click Feed Maintenance Userscript';
const mainPollPeriod_ms = 1000;

(function(){
    'use strict'
    $(document).ready(async function(){
        if (isWatchPage()) {
            if (await GM_getValue(gmTrackWatched) === 'true') {
                const videoId = getWatchPageVideoId();
                if (!videoId) {
                    return;
                }
                await debug(`watch page video id ${videoId}`);
                await rememberWatchedVideo(videoId);
            }
        } else {
            setInterval(mainPollCallback, mainPollPeriod_ms);
        }
    });
}())

const ytPopupContainerSelector = 'ytd-popup-container';
const ytMastheadSelector = 'div#buttons.ytd-masthead';
const ytContentsGridSelector = 'div#contents.ytd-rich-grid-renderer';

async function mainPollCallback() {
    await addMenuToMasthead();
    await addButtonsToVideoNodes();
    await autohideVideoNodes();
    await automarkVideoNodes();
}

// =========================
// Mutex (https://blog.jcoglan.com/2016/07/12/mutexes-and-javascript/)
// =========================

let Mutex = class {
    constructor() {
        this._busy = false;
        this._queue = [];
    }
};

Mutex.prototype.synchronize = function(task) {
    this._queue.push(task);
    if (!this._busy) this._dequeue();
};

Mutex.prototype._dequeue = function() {
    this._busy = true;
    var next = this._queue.shift();

    if (next) {
        this._execute(next);
    } else {
        this._busy = false;
    }
};

Mutex.prototype._execute = function(task) {
    var self = this;

    task().then(function() {
        self._dequeue();
    }, function() {
        self._dequeue();
    });
};

const actionMutex = new Mutex();

// =================================
// 1-Click Feed Maintenance Features
// =================================

// internal GM keys
const gmWatchedVideo = 'watched';
const gmDontLikeVideo = 'dontlike';
const gmDontRecommendChannel = 'dontrecommend';
const gmAutomark = 'automark';
const gmHidepopups = 'hidepopups';
const gmHidelists = 'hidelists';
const gmHidelivestreams = 'hidelivestreams';
const gmHidefundraisers = 'hidefundraisers';
const gmTrackWatched = 'trackwatched';

async function addMenuToMasthead() {
    $(ytPopupContainerSelector).each(async function() {
        if (!$(this).find(`#${ocMenuId}`)[0]) {
            this.appendChild(await createOCMenu());
        }
    });
    $(ytMastheadSelector).each(async function() {
        if (!$(this).find(`#${ocMenuOpenButtonId}`)[0]) {
            this.appendChild(await createButton(ocMenuOpenButtonId, ocMenuButtonText, ocMenuOpen));
        }
    });
}

/*
 * Search the children of the given node for rich items that lack 1-Click Feed Maintenance
 * controls, and add controls to them.
 */
async function addButtonsToVideoNodes() {
    // iterate over each rich item contained in the given node that don't already have buttons
    $(ytContentsGridSelector).find(videoNodeWithoutOCButtonsSelector).each(async function() {
        if (!isShown(this)) {
            await error(`selected video node that is not shown: ${getVideoId(this)}`);
            return;
        }

        if (!$(this).find(`#${ocAlreadyWatchedButtonId}`)[0]) {
            this.appendChild(await createButton(ocAlreadyWatchedButtonId, ocAlreadyWatchedButtonText, alreadyWatchedOnClick));
        }
        if (!$(this).find(`#${ocIDontLikeTheVideoButtonId}`)[0]) {
            this.appendChild(await createButton(ocIDontLikeTheVideoButtonId, ocIDontLikeTheVideoButtonText, iDontLikeTheVideoOnClick));
        }
        if (!$(this).find(`#${ocDontRecommendId}`)[0]) {
            this.appendChild(await createButton(ocDontRecommendId, ocDontRecommendText, dontRecommendOnClick));
        }
        if (await GM_getValue(gmDebug) === 'true') {
            if (!$(this).find(`#${ocDebugId}`)[0]) {
                this.appendChild(await createButton(ocDebugId, ocDebugText, debugOnClick));
            }
        }
    });
}

/*
 * Double-check whether those videos have previously been marked as watched or blocked
 * by this script (and Youtube is ignoring that). If so, then re-mark them and hide them.
 */
async function autohideVideoNodes() {
    $(ytContentsGridSelector).find(videoNodeShownSelector).each(async function() {
        if (!isShown(this)) {
            await error(`selected video node that is not shown: ${getVideoId(this)}`);
            return;
        }

        if (await GM_getValue(gmHidelists) === 'true') {
            const listId = getListId(this);
            if (listId) {
                await debug(`hide list mode enabled; hiding list id ${listId}`);
                hide(this);
                return;
            }
        }

        if (await GM_getValue(gmHidelivestreams) === 'true') {
            const videoId = getLivestreamId(this);
            if (videoId) {
                await debug(`hide livestream mode enabled; hiding livestream id ${videoId}`);
                hide(this);
                return;
            }
        }

        if (await GM_getValue(gmHidefundraisers) === 'true') {
            const videoId = getFundraiserId(this);
            if (videoId) {
                await debug(`hide fundraiser mode enabled; hiding fundraiser id ${videoId}`);
                hide(this);
                return;
            }
        }
    });
}

async function automarkVideoNodes() {
    if (await GM_getValue(gmAutomark) === 'true') {
        $(ytContentsGridSelector).find(videoNodeShownSelector).each(async function() {
            await automarkByVideoIdState(this);
            await automarkByChannelIdState(this);
        });
    }
}

/*
 * Look up whether this userscript has previously watched or blocked the given video node
 * (and Youtube is ignoring that). If so, then re-mark it and hide it again.
 */
async function automarkByVideoIdState(videoNode) {
    if (!isShown(videoNode)) {
        await error(`automarkByVideoIdState given video node that is not shown: ${videoNode}`);
        return;
    }

    const videoId = getVideoId(videoNode);
    if (!videoId) {
        return;
    }

    const videoIdValue = await GM_getValue(videoId);
    if (!videoIdValue) {
        return;
    }

    await debug(`automarkByVideoIdState found persisted state for video id ${videoId}: ${videoIdValue}, waiting for node to ready`);
    const videoDropdownButtonSelector = getVideoDropdownButtonSelector(videoId);
    await awaitNodeAdded(videoDropdownButtonSelector);

    if (videoIdValue === gmWatchedVideo) {
        await debug(`automarkByVideoIdState marking watched video id ${videoId}`);
        await markAlreadyWatched(videoNode);

        await debug(`automarkByVideoIdState hiding watched video id ${videoId}`);
        hide(videoNode);
    } else if (videoIdValue === gmDontLikeVideo) {
        await debug(`automarkByVideoIdState marking blocked video id ${videoId}`);
        await markDontLike(videoNode);

        await debug(`automarkByVideoIdState hiding video for blocked video id ${videoId}`);
        hide(videoNode);
    }
}

/*
 * Look up whether this userscript has previously blocked the channel of the given video node
 * (and Youtube is ignoring that). If so, then re-mark it and hide it again.
 */
async function automarkByChannelIdState(videoNode) {
    if (!isShown(videoNode)) {
        await error(`automarkByChannelIdState given video node that is not shown: ${videoNode}`);
        return;
    }

    const videoId = getVideoId(videoNode);
    const channelId = getChannelId(videoNode);
    if (!videoId || !channelId) {
        return;
    }

    const channelIdValue = await GM_getValue(channelId);
    if (!channelIdValue) {
        return;
    }

    await debug(`automarkByChannelIdState found persisted state for channel id ${channelId} of video id ${videoId}: ${channelIdValue}, waiting for node to ready`);
    const videoDropdownButtonSelector = getVideoDropdownButtonSelector(videoId);
    await awaitNodeAdded(videoDropdownButtonSelector);

    if (channelIdValue === gmDontRecommendChannel) {
        await debug(`automarkByChannelIdState marking blocked channel id ${channelId}`);
        await markDontRecommend(videoNode);

        await debug(`automarkByChannelIdState hiding video ${videoId} for blocked channel id ${channelId}`);
        hide(videoNode);
    }
}

// =================================
// 1-Click Feed Maintenance Controls
// =================================

// oc control element ids
const ocAlreadyWatchedButtonId = 'oc-already-watched';
const ocIDontLikeTheVideoButtonId = 'oc-dont-like';
const ocDontRecommendId = 'oc-dont-recommend';
const ocDebugId = 'oc-debug';

// oc control labels
const ocAlreadyWatchedButtonText = 'Already Watched';
const ocIDontLikeTheVideoButtonText = 'Block Video';
const ocDontRecommendText = 'Block Channel';
const ocDebugText = 'Debug';

/*
 * "already watched" oc button callback
 */
async function alreadyWatchedOnClick(e) {
    e.preventDefault();
    const videoNode = e.target.parentNode;
    const videoId = getVideoId(videoNode);
    await markAlreadyWatched(videoNode);
    await debug(`hiding watched video id ${videoId}`);
    hide(videoNode);
    await rememberWatchedVideo(videoId);
}

/*
 * "I dont like the video" oc button callback
 */
async function iDontLikeTheVideoOnClick(e) {
    e.preventDefault();
    const videoNode = e.target.parentNode;
    const videoId = getVideoId(videoNode);
    await markDontLike(videoNode);
    await debug(`hiding blocked video id ${videoId}`);
    hide(videoNode);
    await rememberBlockedVideo(videoId);
}

/*
 * "dont recommend" oc button callback
 */
async function dontRecommendOnClick(e) {
    e.preventDefault();
    const videoNode = e.target.parentNode;
    const videoId = getVideoId(videoNode);
    const channelId = getChannelId(videoNode);
    await markDontRecommend(videoNode);
    await debug(`hiding blocked channel video id ${videoId}`);
    hide(videoNode);
    await rememberBlockedChannel(channelId);
}

/*
 * "debug" oc button callback
 */
async function debugOnClick(e) {
    e.preventDefault();
    const videoNode = e.target.parentNode;
    log(`video id: ${getVideoId(videoNode)}`);
    log(`list id: ${getListId(videoNode)}`);
    log(`livestream id: ${getLivestreamId(videoNode)}`);
    log(`fundraiser id: ${getFundraiserId(videoNode)}`);
    log(`channel id: ${getChannelId(videoNode)}`);
}

async function rememberWatchedVideo(videoId) {
    if (videoId) {
        await debug(`remembering watched video id ${videoId}`);
        await GM_setValue(videoId, gmWatchedVideo);
    }
}

async function rememberBlockedVideo(videoId) {
    if (videoId) {
        await debug(`remembering blocked video id ${videoId}`);
        await GM_setValue(videoId, gmDontLikeVideo);
    }
}

async function rememberBlockedChannel(channelId) {
    if (channelId) {
        await debug(`remembering blocked channel id ${channelId}`);
        await GM_setValue(channelId, gmDontRecommendChannel);
    }
}

// =============================
// 1-Click Feed Maintenance Menu
// =============================

// oc menu element ids
const ocMenuId = 'oc-menu';
const ocMenuOpenButtonId = 'oc-menu-open-button';
const ocMenuCheckboxId = 'oc-menu-checkbox';
const ocMenuLabelId = 'oc-menu-label';
const ocMenuButtonContainerId = 'oc-menu-buttons';
const ocMenuExportButtonId = 'oc-menu-export-button';
const ocMenuSaveButtonId = 'oc-menu-save-button';
const ocMenuCancelButtonId = 'oc-menu-cancel-button';

// oc menu labels
const ocMenuButtonText = '1-Click Config';
const ocMenuExportButtonText = 'Export';
const ocMenuSaveButtonText = 'Save';
const ocMenuCancelButtonText = 'Cancel';

// oc menu jQuery selectors
const ocMenuSelector = '#oc-menu';

/*
 * Create the oc menu.
 */
async function createOCMenu() {
    const menu = document.createElement(divTag);
    menu.id = ocMenuId;
    menu.class = ytPopupContainerClass;
    menu.style.background = 'white';
    menu.style.position = 'fixed';
    menu.style.width = '200px';
    menu.style.height = '200px';
    menu.style.zIndex = 10000;
    menu.style.display = 'none';

    menu.appendChild(createCheckboxOCMenuItem(gmDebug));
    menu.appendChild(createCheckboxOCMenuItem(gmAutomark));
    menu.appendChild(createCheckboxOCMenuItem(gmHidepopups));
    menu.appendChild(createCheckboxOCMenuItem(gmHidelists));
    menu.appendChild(createCheckboxOCMenuItem(gmHidelivestreams));
    menu.appendChild(createCheckboxOCMenuItem(gmHidefundraisers));
    menu.appendChild(createCheckboxOCMenuItem(gmTrackWatched));

    const menuButtonContainer = createContainer(ocMenuButtonContainerId);
    menuButtonContainer.appendChild(createButton(ocMenuExportButtonId, ocMenuExportButtonText, ocMenuExport));
    menuButtonContainer.appendChild(createButton(ocMenuSaveButtonId, ocMenuSaveButtonText, ocMenuSave));
    menuButtonContainer.appendChild(createButton(ocMenuCancelButtonId, ocMenuCancelButtonText, ocMenuCancel));
    menu.appendChild(menuButtonContainer);

    return menu;
}

/*
 * Onclick for oc menu open button in yt masthead; open the oc menu.
 */
async function ocMenuOpen() {
    $(ocMenuSelector).each(async function() {
        this.style.display = '';
        this.style.left = `${getClientWidth() / 2}px`;
        this.style.top = `${getClientHeight() / 2}px`;
    });
    await restoreOCMenuValues();
}

/*
 * Onclick for export button in oc menu; export all GM values, then close the oc menu.
 */
async function ocMenuExport() {
    await exportGMValues();
    await ocMenuClose();
}

/*
 * Onclick for save button in oc menu; save values currently in oc menu to GM, then close the menu.
 */
async function ocMenuSave() {
    await saveOCMenuValues();
    await ocMenuClose();
}

/*
 * Onclick for cancel button in oc menu; restore the oc menu to existing GM values, then close the oc menu.
 */
async function ocMenuCancel() {
    await restoreOCMenuValues();
    await ocMenuClose();
}

/*
 * Close the oc menu.
 */
async function ocMenuClose() {
    $(ocMenuSelector).each(async function() {
        this.style.display = 'none';
    });
}

/*
 * Save values currently in oc menu to GM
 */
async function saveOCMenuValues() {
    await saveOCMenuItemCheckbox(gmDebug);
    await saveOCMenuItemCheckbox(gmAutomark);
    await saveOCMenuItemCheckbox(gmHidepopups);
    await saveOCMenuItemCheckbox(gmHidelists);
    await saveOCMenuItemCheckbox(gmHidelivestreams);
    await saveOCMenuItemCheckbox(gmHidefundraisers);
    await saveOCMenuItemCheckbox(gmTrackWatched);
}

/*
 * restore the oc menu to existing GM values
 */
async function restoreOCMenuValues() {
    await restoreOCMenuItemCheckbox(gmDebug);
    await restoreOCMenuItemCheckbox(gmAutomark);
    await restoreOCMenuItemCheckbox(gmHidepopups);
    await restoreOCMenuItemCheckbox(gmHidelists);
    await restoreOCMenuItemCheckbox(gmHidelivestreams);
    await restoreOCMenuItemCheckbox(gmHidefundraisers);
    await restoreOCMenuItemCheckbox(gmTrackWatched);
}

/*
 * Create and return a new checkbox for the oc menu.
 */
function createCheckboxOCMenuItem(config) {
    const ocMenuItemContainer = createContainer(getMenuItemContainerId(config));
    const checkbox = document.createElement(inputTag);
    checkbox.id = ocMenuCheckboxId;
    checkbox.type = checkboxType;
    ocMenuItemContainer.appendChild(checkbox);
    const label = document.createElement(labelTag);
    label.id = ocMenuLabelId;
    label.innerHTML = config;
    ocMenuItemContainer.appendChild(label);
    return ocMenuItemContainer;
}

async function restoreOCMenuItemCheckbox(gmKey) {
    $(getOCMenuItemCheckboxSelector(gmKey))[0].checked = await GM_getValue(gmKey) === 'true';
}

async function saveOCMenuItemCheckbox(gmKey) {
    await GM_setValue(gmKey, $(getOCMenuItemCheckboxSelector(gmKey))[0].checked.toString());
}

function getOCMenuItemCheckboxSelector(gmKey) {
    return `#${getMenuItemContainerId(gmKey)} #${ocMenuCheckboxId}`;
}

function getMenuItemContainerId(gmKey) {
    return `oc-menu-container-${gmKey}`
}

// =================
// Youtube functions
// =================

// youtube constants
const ytPopupContainerClass = 'ytd-popup-container';

// youtube jQuery selectors
const ytAppSelector = 'ytd-app';

const videoNodeShownSelector = 'ytd-rich-item-renderer:shown';
const videoNodeWithoutOCButtonsSelector = 'ytd-rich-item-renderer:not(:has(#oc-button)):shown';

const ytPaperDialogSelector = 'ytd-popup-container tp-yt-paper-dialog';
const ytPaperDialogIDontLikeTheVideoSelector = 'ytd-popup-container tp-yt-paper-dialog tp-yt-paper-checkbox:contains("I don\'t like the video")';
const ytPaperDialogIveAlreadyWatchedSelector = 'ytd-popup-container tp-yt-paper-dialog tp-yt-paper-checkbox:contains("I\'ve already watched the video")';
const ytPaperDialogSubmitSelector = 'ytd-popup-container tp-yt-paper-dialog yt-button-shape button:contains("Submit")';
const ytPaperDialogCancelSelector = 'ytd-popup-container tp-yt-paper-dialog yt-button-shape button:contains("Cancel")';

const ytIronDropdownSelector = 'ytd-popup-container tp-yt-iron-dropdown:not(:has(ytd-notification-renderer))';
const ytIronDropdownNotInterestedSelector = 'ytd-popup-container tp-yt-iron-dropdown tp-yt-paper-item:contains("Not interested")';
const ytIronDropdownDontRecommendSelector = 'ytd-popup-container tp-yt-iron-dropdown tp-yt-paper-item:contains("Don\'t recommend channel")';

const attemptDuration = 100;
const maxAttempts = 30;
const resolveMutationTimeout_ms = 5000;

/*
 * Open the iron dropdown for the given video node, then click "not interested", "tell us why",
 * then "already watched"
 */
async function markAlreadyWatched(videoNode) {
    actionMutex.synchronize(async function() {
        try {
            const videoId = getVideoId(videoNode);
            await debug(`marking watched video id ${videoId}`);
            await openIronDropdown(videoNode);
            await clickNotInterested(videoNode);
            await clickTellUsWhy(videoNode);
            await clickAlreadyWatched(videoNode);
        } finally {
            // clean up any iron dropdown or paper dialog that were mistakenly left open
            await closeIronDropdown(videoNode);
            await closePaperDialog();
        }
    });
}

/*
 * Open the iron dropdown for the given video node, then click "not interested", "tell us why",
 * then "i don't like this video"
 */
async function markDontLike(videoNode) {
    actionMutex.synchronize(async function() {
        try {
            const videoId = getVideoId(videoNode);
            await debug(`marking blocked video id ${videoId}`);
            await openIronDropdown(videoNode);
            await clickNotInterested(videoNode);
            await clickTellUsWhy(videoNode);
            await clickIDontLikeTheVideo(videoNode);
        } finally {
            // clean up any iron dropdown or paper dialog that were mistakenly left open
            await closeIronDropdown(videoNode);
            await closePaperDialog();
        }
    });
}

/*
 * Open the iron dropdown for the given video node, then click "don't recommend"
 */
async function markDontRecommend(videoNode) {
    actionMutex.synchronize(async function() {
        try {
            const videoId = getVideoId(videoNode);
            await debug(`marking blocked channel video id ${videoId}`);
            await openIronDropdown(videoNode);
            await clickDontRecommend(videoNode);
        } finally {
            // clean up any iron dropdown or paper dialog that were mistakenly left open
            await closeIronDropdown(videoNode);
            await closePaperDialog();
        }
    });
}

/*
 * click menu button on the given video node, wait for iron dropdown to be added, and return iron
 * dropdown node.
 */
async function openIronDropdown(videoNode) {
    const videoId = getVideoId(videoNode);
    const videoDropdownButtonSelector = getVideoDropdownButtonSelector(videoId);

    // if iron dropdown button is completely missing, then nothing to do
    if (!$(videoDropdownButtonSelector).length) {
        warn(`iron dropdown button not found for selector ${videoDropdownButtonSelector}`);
        return;
    }

    // hide iron dropdown, so it doesn't flicker when clicking oc buttons
    if (await GM_getValue(gmHidepopups) === 'true') {
        await hideIronDropdown();
    }

    await doAndAwaitNodeAdded(ytIronDropdownSelector, async function() {
        $(videoDropdownButtonSelector).trigger('click');
    });

    // try to hide again, in case iron dropdown didn't exist the first time
    if (await GM_getValue(gmHidepopups) === 'true') {
        await hideIronDropdown();
    }
}

/*
 * click not interested button on the given iron dropdown node, and wait for tell us why button to be added.
 */
async function clickNotInterested(videoNode) {
    const videoId = getVideoId(videoNode);
    const tellUsWhyButtonSelector = getTellUsWhyButtonSelector(videoId);

    try {
        if (!$(ytIronDropdownNotInterestedSelector).length) {
            warn(`not interested button not found for video id ${getVideoId(videoNode)}`);
            return;
        }
        await doAndAwaitNodeAdded(tellUsWhyButtonSelector, async function() {
            $(ytIronDropdownNotInterestedSelector).trigger('click');
        });
    } finally {
        await closeIronDropdown(videoNode);
    }
}

/*
 * click dont recommend channel button on the given iron dropdown node, and wait for iron dropdown to be
 * removed.
 */
async function clickDontRecommend(videoNode) {
    try {
        if (!$(ytIronDropdownDontRecommendSelector).length) {
            warn(`dont recommend button not found for video id ${getVideoId(videoNode)}`);
            return;
        }
        await doAndAwaitNodeRemoved(ytIronDropdownSelector, async function() {
            $(ytIronDropdownDontRecommendSelector).trigger('click');
        });
    } finally {
        await closeIronDropdown(videoNode);
    }
}

/*
 * click tell us why button on the given video node, wait for paper dialog to be added, and return paper
 * dialog node.
 */
async function clickTellUsWhy(videoNode) {
    const videoId = getVideoId(videoNode);
    const tellUsWhyButtonSelector = getTellUsWhyButtonSelector(videoId);

    // if paper dialog button is completely missing, then nothing to do
    if (!$(tellUsWhyButtonSelector).length) {
        warn(`tell us why button not found for video id ${getVideoId(videoNode)}`);
        return;
    }

    // hide paper dialog, so it doesn't flicker when clicking oc buttons
    if (await GM_getValue(gmHidepopups) === 'true') {
        await hidePaperDialog();
    }

    await doAndAwaitNodeAdded(ytPaperDialogSelector, async function() {
        $(tellUsWhyButtonSelector).trigger('click');
    });

    // try to hide again, in case paper dialog didn't exist the first time
    if (await GM_getValue(gmHidepopups) === 'true') {
        await hidePaperDialog();
    }
}

/*
 * click I dont like the video button on the given paper dialog node, click submit button on paper dialog,
 * and wait for paper dialog to be removed.
 */
async function clickIDontLikeTheVideo(videoNode) {
    try {
        if (!$(ytPaperDialogIDontLikeTheVideoSelector).length) {
            warn(`i dont like the video button not found for video id ${getVideoId(videoNode)}`);
            return;
        }
        await doAndAwaitNodeRemoved(ytPaperDialogSelector, async function() {
            $(ytPaperDialogIDontLikeTheVideoSelector).trigger('click');
            await delay(500);
            $(ytPaperDialogSubmitSelector).trigger('click');
        });
    } finally {
        await closePaperDialog();
    }
}

/*
 * click Ive already watched the video button on the given paper dialog node, click submit button on paper
 * dialog, and wait for paper dialog to be removed.
 */
async function clickAlreadyWatched(videoNode) {
    try {
        if (!$(ytPaperDialogIveAlreadyWatchedSelector).length) {
            warn(`ive already watched the video button not found for video id ${getVideoId(videoNode)}`);
            return;
        }
        await doAndAwaitNodeRemoved(ytPaperDialogSelector, async function() {
            $(ytPaperDialogIveAlreadyWatchedSelector).trigger('click');
            await delay(500);
            $(ytPaperDialogSubmitSelector).trigger('click');
        });
    } finally {
        await closePaperDialog();
    }
}

/*
 * If given video node is a list, then get the list id. Otherwise, null.
 */
function getListId(videoNode) {
    const videoTitleLink = $(videoNode).find('a#video-title-link')[0];
    if (!videoTitleLink) {
        return null;
    }

    let match = videoTitleLink.href.match(/\/watch\?v=[^&]*&list=([^&]*)/);
    if (match) {
        return match[1];
    }

    return null;
}

/*
 * If given video node is a livestream, then get the video id. Otherwise, null.
 */
function getLivestreamId(videoNode) {
    const liveNowBadge = $(videoNode).find('div.badge-style-type-live-now')[0];
    if (!liveNowBadge) {
        return null;
    }

    return getVideoId(videoNode);
}

/*
 * If given video node is a fundraiser, then get the video id. Otherwise, null.
 */
function getFundraiserId(videoNode) {
    const fundraiserBadge = $(videoNode).find('div.badge-style-type-ypc')[0];
    if (!fundraiserBadge) {
        return null;
    }

    return getVideoId(videoNode);
}

function getVideoSelector(videoId) {
    return `ytd-rich-item-renderer:has(a#video-title-link[href*="${videoId}"])`;
}

function getVideoDropdownButtonSelector(videoId) {
    return `${getVideoSelector(videoId)} div#menu button`
}

function getTellUsWhyButtonSelector(videoId) {
    return `${getVideoSelector(videoId)} button:contains("Tell us why")`
}

function getVideoId(videoNode) {
    const videoTitleLink = $(videoNode).find('a#video-title-link')[0];
    if (!videoTitleLink) {
        return null;
    }

    let match = videoTitleLink.href.match(/\/watch\?v=([^&]*)/);
    if (match) {
        return match[1];
    }

    return null;
}

function getChannelId(videoNode) {
    const channelName = $(videoNode).find('ytd-channel-name a.yt-simple-endpoint')[0];
    if (!channelName) {
        return null;
    }

    let match = channelName.href.match(/\/c\/([^&]*)/);
    if (match) {
        return match[1];
    }

    match = channelName.href.match(/\/channel\/([^&]*)/);
    if (match) {
        return match[1];
    }

    match = channelName.href.match(/\/user\/([^&]*)/);
    if (match) {
        return match[1];
    }

    return null;
}

function isWatchPage() {
    const match = window.location.href.match(/\/watch/);
    if (!match) {
        return false;
    }
    return true;
}

/*
 * If this script is running on a video watch page, then get the video id from the watch url.
 */
function getWatchPageVideoId() {
    return window.location.href.match(/\/watch\?v=([^&]*)/)[1];
}

async function hideIronDropdown() {
    $(ytIronDropdownSelector).each(async function() {
        hide(this);
    });
}

/*
 * click iron dropdown button on the given video node, and wait for iron dropdown to be removed
 */
async function closeIronDropdown(videoNode) {
    await $(ytIronDropdownSelector).each(async function() {
        // reset visibility in case hidepopups is enabled
        unhide(this);

        // try to close it by clicking
        let attempts = 0;
        while (isShown(this)) {
            clickEmptySpace();
            await delay(attemptDuration);
            attempts = attempts + 1;
            if (attempts > maxAttempts) {
                // if it's still open, then just hide it so we don't block forever on this
                await hideIronDropdown();
                break;
            }
        }

        // even if it's closed, click empty space on the page to try to avoid the scroll-breaking bug
        clickEmptySpace();
    });
}

async function hidePaperDialog() {
    $(ytPaperDialogSelector).each(async function() {
        hide(this);
    });
}

/*
 * click cancel button on the paper dialog, and wait for paper dialog to be removed
 */
async function closePaperDialog() {
    await $(ytPaperDialogSelector).each(async function() {
        // reset visibility in case hidepopups is enabled
        unhide(this);

        // try to close it by clicking empty space on the page
        let attempts = 0;
        while (isShown(this)) {
            clickEmptySpace();
            await delay(attemptDuration);
            attempts = attempts + 1;
            if (attempts > maxAttempts) {
                // if it's still open, then just hide it so we don't block forever on this
                await hidePaperDialog();
                break;
            }
        }

        // even if it's closed, click empty space on the page to try to avoid the scroll-breaking bug
        clickEmptySpace();
    });
}

/*
 * click empty space on the page to trigger youtube events that close dialogs and unblock scrolling
 */
function clickEmptySpace() {
    $(ytAppSelector).trigger('click');
}

// =========================
// lwkjef's standard library
// =========================

// library constants
const divTag = 'div';
const buttonTag = 'button';
const buttonType = 'button';
const inputTag = 'input';
const labelTag = 'label';
const checkboxType = 'checkbox';

// library GM keys
const gmDebug = 'debug';

// library selectors
const rootSelector = ':root';

/*
 * Log the given text if debug mode is enabled.
 */
async function debug(text) {
    if (await GM_getValue(gmDebug) === 'true') {
        log(text);
    }
}

/*
 * Export all GM values as a CSV string, and open browser save file dialog to download it as a file.
 */
async function exportGMValues() {
    const csv = await getGMValuesCSV();
    exportTextFile(csv);
}

/*
 * Export all GM values as a CSV string.
 *
 * Example: 'key,value\nval1,val2'
 */
async function getGMValuesCSV() {
    let csv = 'key,value\and';
    for (const gmKey of await GM_listValues()) {
        csv += `${gmKey},${await GM_getValue(gmKey)}\and`;
    }
    return csv;
}

/*
 * Wait until at least one node matching nodeSelector is added to ancestorNodeSelector.
 */
async function awaitNodeAdded(expectedSelector) {
    await debug(`awaitNodeAdded awaiting ${expectedSelector} added...`);
    const resultNode = await resolveMutation(async function(mutationsList, observer, resolve) {
        const expectedNode = $(expectedSelector)[0];
        if (expectedNode) {
            resolve(expectedNode);
        }
    }, _ => {});
    if (!resultNode) {
        await error(`awaitNodeAdded couldn't resolve addition of ${expectedSelector}`);
    }
    return resultNode;
}

/*
 * Execute the given function, then wait until node is added. ancestorSelector MUST exist and should be as
 * close as possible to target node for efficiency.
 */
async function doAndAwaitNodeAdded(expectedSelector, triggerMutation) {
    const resultNode = await resolveMutation(async function(mutationsList, observer, resolve) {
        const expectedNode = $(expectedSelector)[0];
        if (expectedNode &&
            isShown(expectedNode)) {
            resolve(expectedNode);
        }
    }, triggerMutation);
    if (!resultNode) {
        await error(`doAndAwaitNodeAdded couldn't resolve addition of ${expectedSelector}`);
    }
    return resultNode;
}

/*
 * Execute the given function, then wait until given node is removed. ancestorSelector MUST exist and
 * should be as close as possible to target node for efficiency.
 */
async function doAndAwaitNodeRemoved(expectedSelector, triggerMutation) {
    const resultNode = await resolveMutation(async function(mutationsList, observer, resolve) {
        const expectedNode = $(expectedSelector)[0];
        if (expectedNode &&
            !isShown(expectedNode)) {
            resolve(expectedNode);
        }
    }, triggerMutation);
    if (!resultNode) {
        await error(`doAndAwaitNodeRemoved couldn't resolve removal of ${expectedSelector}`);
    }
    return resultNode;
}

async function resolveMutation(onMutation, triggerMutation) {
    await debug(`entering resolveMutation`);
    let observer;
    try {
        const resultNode = await new Promise(resolve => {
            observer = new MutationObserver(async function(mutationsList, observer) {
                onMutation(mutationsList, observer, resolve);
            });
            $(rootSelector).each(async function() {
                observer.observe(this, {attributes: true, childList: true, subtree: true});
            });
            setTimeout(async function() {
                observer.disconnect();
                resolve(null);
            }, resolveMutationTimeout_ms);
            triggerMutation();
        });
        if (!resultNode) {
            await error(`resolveMutation couldn't resolve mutation`);
        }
        return resultNode;
    } finally {
        observer.disconnect();
    }
}

/*
 * Get the current width of the browser, in pixels.
 */
function getClientWidth() {
    return (window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth);
}

/*
 * Get the current height of the browser, in pixels.
 */
function getClientHeight() {
    return (window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight);
}

/*
 * Create and return a new div container with the given id.
 */
function createContainer(id) {
    const container = document.createElement(divTag);
    container.id = id;
    return container;
}

/*
 * Create and return a new button with the given id, text, onclick callback, and css style.
 */
function createButton(id, text, onclick, cssObj = {'background': 'grey', 'margin-left': '2px', 'margin-right': '2px', 'padding': '2px', 'font-size': '14px'}) {
    const button = document.createElement(buttonTag);
    button.id = id;
    button.type = buttonType;
    button.innerHTML = text;
    button.onclick = onclick;
    Object.keys(cssObj).forEach(key => {button.style[key] = cssObj[key]});
    return button;
}

/*
 * Return true if node is displayed and visible, false otherwise.
 */
function isShown(node) {
    return node.style.display !== 'none' && node.style.visibility != 'hidden';
}

/*
 * Hide the given node by setting the visibility style to hidden
 */
function hide(node) {
    node.style.visibility = 'hidden';
}

/*
 * Unhide the given node by unsetting the visibility style (assuming it was set to hidden)
 */
function unhide(node) {
    node.style.visibility = '';
}

/*
 * Prepend the script name to the given text
 */
function prependScriptName(text) {
    return `[${scriptName}] ${text}`;
}

/*
 * Log the given text, prepended by the userscript name, to the browser console at standard log level
 */
function log(text) {
    console.log(prependScriptName(text));
}

/*
 * Log the given text, prepended by the userscript name, to the browser console at warn log level
 */
function warn(text) {
    console.warn(prependScriptName(text));
}

/*
 * Log the given text, prepended by the userscript name, to the browser console at error log level
 */
function error(text) {
    console.error(prependScriptName(text));
}

/*
 * Return a Promise which waits for the given millisecond duration.
 */
async function delay(duration_ms) {
    await new Promise((resolve, reject) => {
        setTimeout(_ => resolve(), duration_ms)
    });
}

/*
 * Return true if strings lowercased are equivalent, false otherwise.
 */
function equalsIgnoreCase(one, two) {
    return one.toLowerCase() === two.toLowerCase();
}

/*
 * Export the given data as a text file and trigger browser to download it.
 *
 * type may be 'text/csv', 'text/html', 'text/vcard', 'text/txt', 'application/csv', etc.
 *
 * Example usage: exportFile('col1,col2\nval1,val2', 'text/csv');
 */
function exportTextFile(data, type='text/csv', charset='utf-8', filename='data.csv') {
    // IMPORTANT: we must manually revoke this object URL to avoid memory leaks!
    const objectURL = window.URL.createObjectURL(new Blob([data], {type: type}));
    // alternatively, we may create object URL manually
    //const objectURL = `data:${type};charset=${charset},${encodeURIComponent(data)}`
    try {
        triggerObjectURL(objectURL, filename);
    }
    finally {
        if (objectURL !== null) {
            window.URL.revokeObjectURL(objectURL);
        }
    }
}

/*
 * Trigger the browser to download the given objectURL as a file.
 */
function triggerObjectURL(objectURL, filename='data.csv') {
    const a = document.createElement('a');
    a.href = objectURL;
    //supported by chrome 14+ and firefox 20+
    a.download = filename;
    const body = document.getElementsByTagName('body')[0];
    //needed for firefox
    body.appendChild(a);
    //supported by chrome 20+ and firefox 5+
    a.click();
    // clean up
    body.removeChild(a);
}

/*
 * jQuery extension to match elements that don't have display none nor css visibility hidden.
 * The built-in :visible selector stil matches elements with css visibility hidden because
 * they reserve space in the layout, but sometimes we want to actually match based on visibility
 * of the content rather than the layout space.
 *
 * https://stackoverflow.com/a/33689304
 */
jQuery.extend(jQuery.expr[':'], {
    shown: function (el, index, selector) {
        return $(el).css('visibility') != 'hidden' && $(el).css('display') != 'none' && !$(el).is(':hidden')
    }
});
