// ==UserScript==
// @name         YouTube Keyboard Shortcuts: like/dislike, backup/restore position, change speed, picture-in-picture…
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @description  Adds keyboard shortcuts [ and ] for liking and disliking videos, B and R to Back up and Restore position, H to use picture-in-picture, { and } to change playback speed.
// @author       https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.18
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=youtube.com&sz=128
// @downloadURL https://update.greasyfork.org/scripts/437708/YouTube%20Keyboard%20Shortcuts%3A%20likedislike%2C%20backuprestore%20position%2C%20change%20speed%2C%20picture-in-picture%E2%80%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/437708/YouTube%20Keyboard%20Shortcuts%3A%20likedislike%2C%20backuprestore%20position%2C%20change%20speed%2C%20picture-in-picture%E2%80%A6.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

/**
 * Keyboard shortcuts on regular video player:
 * [ to like a video
 * ] to dislike it
 * h to enable/disable Picture-in-Picture (PiP)
 * b to back up the current time (where you are in the video)
 * r to jump back to the backed up time ("r" for restore)
 * shift-] – or "}" – to increase playback speed
 * shift-[ – or "{" – to decrease playback speed
 * x to go forward by 5 seconds
 * z to go back by 5 seconds
 * shift + x to go forward by 1 second
 * shift + z to go back by 1 second
 * u to "undo" a time jump and go back to where you were just playing
 *
 * Keyboard shortcuts on "shorts" video player are all of the above, plus:
 * w to use the regular YouTube player if you're watching a short in the feed-based "Shorts" player
 * shift + w: switch to regular player, but open it in a new tab in order not to lose the current Shorts feed
 */

/****************************************************************************************************/
/*                                                                                                  */
/*                               Change these constants to configure the script                     */

const PLAYBACK_RATE_STEP = 0.05; // change playback rate by 5% when pressing the shortcut keys (see above which keys those are)
const SHOW_NOTIFICATIONS = true;
const NOTIFICATIONS_INCLUDE_EMOJIS = true;
const NOTIFICATION_DURATION_MILLIS = 2000; // how long – in milliseconds – to keep a like/dislike notification visible.
const REMOVE_FEEDBACK_SHARED_WITH_CREATOR = true; // if true, remove the notification on dislike that says "feedback shared with the creator". Set to false to keep the default YouTube behavior.
const MIN_TIME_BETWEEN_KEYPRESSES_MS = 70; // how long – in milliseconds – to wait before handling any repeated key presses. This is to prevent time scrubs from going too fast. Continuous events come as fast as every ~30ms if the repeat rate is set to the highest setting.
const SAVED_POSITIONS_TTL_SEC = 3600; // 1h by default, how long to keep track of saved positions by video ID (with [B], to be restored with [R]). This allows saving positions for multiple videos, forgetting them after 1h.

/****************************************************************************************************/

var lastToastElement = null;
function showNotification(message) {
    if (!SHOW_NOTIFICATIONS) {
        return;
    }
    if (lastToastElement !== null) { // delete if still visible
        lastToastElement.remove();
        lastToastElement = null;
    }

    const toast = document.createElement('tp-yt-paper-toast');
    toast.innerText = message;
    toast.classList.add('toast-open');

    const styleProps = {
        outline: 'none',
        position: 'fixed',
        left: '0',
        bottom: '12px',
        maxWidth: '297.547px',
        maxHeight: '48px',
        zIndex: '2202',
        opacity: '1',
    };
    for (const prop in styleProps) {
        toast.style[prop] = styleProps[prop];
    }

    document.body.appendChild(toast);
    lastToastElement = toast;

    // needed otherwise the notification won't show
    setTimeout(() => {
        toast.style.display = 'block';
    }, 0);

    // preserves the animation
    setTimeout(() => {
        toast.style.transform = 'none';
    }, 10);

    setTimeout(() => {
        toast.style.transform = 'translateY(200%)';
    }, Math.max(0, NOTIFICATION_DURATION_MILLIS));
}

function removeBuiltInFeedbackShared(feedbackSharedStartTime) {
    const now = Date.now();
    for (const toastElement of Array.from(document.querySelectorAll('tp-yt-paper-toast'))) {
        if (toastElement.textContent.toLowerCase().includes('feedback shared with the creator')) {
            toastElement.remove();
            return;
        }
    }
    if (now - feedbackSharedStartTime < 1000) {
        const intervalMs = (now - feedbackSharedStartTime < 100) ? 10 : 50; // faster at first
        setTimeout(() => removeBuiltInFeedbackShared(feedbackSharedStartTime), intervalMs);
    }
}

function getVideoId() {
    const url = new URL(location.href);
    if (pageIsRegularWatchViewer()) {
        return url.searchParams.get('v');
    } else if (pageIsYouTubeShortsViewer()) {
        const match = /^\/(shorts)\/([0-9a-zA-Z-_]+)$/.exec(location.pathname);
        return match ? match[2] : null;
    } else {
        return null;
    }
}

function pageIsYouTubeShortsViewer() {
    return /^\/(shorts)/.test(location.pathname);
}

function pageIsRegularWatchViewer() {
    return /^\/(watch)/.test(location.pathname);
}

function isVisible(element) {
    const rect = element.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;
    return (elemTop >= 0) &&
        (elemBottom <= window.innerHeight) &&
        !([rect.left, rect.right, rect.top, rect.bottom].every(val => val === 0)); // some elements are returned with all-zero bounding client rect, they're not visible
}

function findRatingButtonShorts(outerSelector, innerSelector) {
    return Array.from(document.querySelectorAll(outerSelector))
        .filter(e => isVisible(e)) // make sure the element is on screen
        .slice(0, 1) // keep only the first one
        .map(renderer => renderer.querySelector(innerSelector)) // find the button inside
        .find(_ => true) || null; // return the only match, or null if the array is empty (vs undefined for .find())
}

function findLikeDislikeButtons() {
    if (pageIsYouTubeShortsViewer()) {
        // we need to call findRatingButtonShorts with both ID suffixes below, since it could be either of them.
        // this make the IDs either '#like-toggle-button' or '#like-button' for likes, for example. We keep only the first one found.
        const idSuffixes = ['toggle-button', 'button']; // added to '#like' or '#dislike'
        const getFirstButton = (innerSelector, idPrefix) => idSuffixes.map(suffix => findRatingButtonShorts(`ytd-toggle-button-renderer#${idPrefix}-${suffix}`, innerSelector))
            .filter(elt => elt !== null) // remove nulls
            .filter(isVisible)
            .find(_ => true) || null; // keep first object

        return {
            like: getFirstButton('#like-button button', 'like'),
            dislike: getFirstButton('#dislike-button button', 'dislike'),
        };
    } else if (!pageIsRegularWatchViewer()) {
        return { like: null, dislike: null };
    }
    const directLikeButton = document.querySelector('div#segmented-like-button button');
    const directDislikeButton = document.querySelector('div#segmented-dislike-button button');
    if (directLikeButton && directDislikeButton) {
        return {like: directLikeButton, dislike: directDislikeButton};
    }

    const likeButtonFromViewModel = document.querySelector('like-button-view-model button');
    const dislikeButtonFromViewModel = document.querySelector('dislike-button-view-model button');
    if (likeButtonFromViewModel && dislikeButtonFromViewModel) {
        return {like: likeButtonFromViewModel, dislike: dislikeButtonFromViewModel};
    }

    const infoRenderer = document.getElementsByTagName('ytd-video-primary-info-renderer');
    const watchMetadata = document.getElementsByTagName('ytd-watch-metadata');

    var like = null, dislike = null;
    if (watchMetadata.length == 1) {
        const buttons = Array.from(watchMetadata[0].getElementsByTagName('button'));
        const paperButtons = Array.from(watchMetadata[0].getElementsByTagName('tp-yt-paper-button'));
        const allButtons = buttons.concat(paperButtons);
        for (const b of allButtons) {
            if (b.hasAttribute('aria-label')) {
                const hasAriaLabel = (text) => b.getAttribute('aria-label').toLowerCase().indexOf(text) !== -1;
                if (!dislike && hasAriaLabel('dislike')) {
                    dislike = b;
                } else if (!like && !hasAriaLabel('dislike') && hasAriaLabel('like')) { // we didn't match "dislike" so the only other way to match "like" would be the actual like button
                    like = b;
                }
                if (!dislike && hasAriaLabel('disabled')) {
                    dislike = b;
                }
            }
        }
        // last resort: by position
        if (!like && buttons.length > 4) {
            like = buttons[4];
        }
        if (!dislike && buttons.length > 5) {
            dislike = buttons[5];
        }
    }
    return {like, dislike};
}

function getPressedAttribute(button) {
    return button.hasAttribute('aria-pressed') ? button.getAttribute('aria-pressed') : null;
}

function formatTime(timeSec) {
    const hours = Math.floor(timeSec / 3600.0);
    const minutes = Math.floor((timeSec % 3600) / 60);
    const seconds = Math.floor((timeSec % 60));

    return (hours > 0 ? (('' + hours).padStart(2, '0') + ':') : '') +
        ('' + minutes).padStart(2, '0') + ':' +
        ('' + seconds).padStart(2, '0');
}

function formatPlaybackRate(rate) {
    if (rate == Math.floor(rate)) { // integer
        return rate + 'x';
    } else if (rate.toFixed(2).endsWith('0')) { // float, 1 decimal place
        return rate.toFixed(1) + 'x';
    } else { // float, 2 decimal places max
        return rate.toFixed(2) + 'x';
    }
}

function maybePrefixWithEmoji(emoji, message) {
    return NOTIFICATIONS_INCLUDE_EMOJIS ? emoji + ' ' + message : message;
}

function getVideoElement() {
    const videos = Array.from(document.querySelectorAll('video')).filter(v => ! isNaN(v.duration)); // filter the invalid ones
    return videos.length === 0 ? null : videos[0];
}

/** no Ctrl, Alt, or Meta/Cmd modifiers, but could have Shift pressed. */
function hasNoCtrlAltMetaModifiers(event) {
    return !(event.ctrlKey || event.altKey || event.metaKey);
}

/** no modifiers whatsoever, so like above and also "not shift" */
function hasNoModifiers(event) {
    return hasNoCtrlAltMetaModifiers(event) && (!event.shiftKey);
}

/** only one specific modifier is set **/
function onlyModifier(event, expected) {
    const modifiers = ['ctrlKey', 'shiftKey', 'altKey', 'metaKey'];
    for (const mod of modifiers) {
        const expectedValue = (mod == expected); // only true for the expected modifier
        if (event[mod] !== expectedValue) {
            return false;
        }
    }
    return true;
}

function keyPressIsZeroToNine(event) {
    // we're looking for presses like {key: '2', code: 'Digit2'} with no modifiers
    const zeroToNine = [...Array(10).keys()];
    const expectedKeys = new Set(zeroToNine.map((i) => `${i}`));
    const expectedCodes = new Set(zeroToNine.map((i) => `Digit${i}`));
    return hasNoModifiers(event) &&
        event.code === `Digit${event.key}` &&
        expectedKeys.has(event.key) && expectedCodes.has(event.code);
}

function applyDeltaSec(video, deltaTimeSec) {
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + deltaTimeSec));
}

function switchFromShortsToClassicPlayer(videoId, video, openInNewTab) {
    if (videoId !== null) {
        const timeParam = (video === null ? '' : `&t=${ Math.floor(video.currentTime) }`);
        const newURL = `https://youtube.com/watch?v=${ videoId }${ timeParam }`;
        if (openInNewTab) {
            video.pause(); // pause short as we open a new tab
            window.open(newURL, '_blank');
        } else {
            location.href = newURL;
        }
    } else {
        showNotification('Could not switch to the classic player');
    }
}

function switchShortInOutOfFullScreen(video) {
    if (document.fullscreenElement === video) {
        document.exitFullscreen();
    } else {
        video.requestFullscreen();
    }
}

/** swallow keyboard event once we've handled it. */
function stopEvent(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
}

/** returns whether we are in an editable element, where text can be typed in (e.g. comment field, search box, chat input) */
function isContentEditable(element) {
    const present = element.hasAttribute('contenteditable');
    const value = element.getAttribute('contenteditable');
    return (value === 'true' || (present && value === '')); // either set explicitly to true or set without a value
}

/** returns whether this is a +/-1 or +/-5 shortcut */
function isOneSecFiveSecShortcut(e) {
    return (hasNoModifiers(e) || onlyModifier(e, 'shiftKey')) && (e.code === 'KeyZ' || e.code === 'KeyX');
}

/** keeps track of time passing in the video, enables going back if a jump was made */
function detectTimeJump() {
    const video = getVideoElement();
    const videoId = getVideoId();
    const player = document.getElementById('movie_player');
    if (!video || !videoId || !player) {
        return;
    }

    if (timeJumpMonitor.videoId !== videoId) { // video change (will trigger on first run, that's fine)
        resetTimeJumpMonitor();
    }
    if (timeJumpMonitor.videoId === null) { // not set yet, let's set it
        timeJumpMonitor.videoId = videoId;
    }
    const videoCurrentTime = video.currentTime;
    const previousCurrentTime = timeJumpMonitor.videoCurrentTime;
    timeJumpMonitor.videoCurrentTime = videoCurrentTime; // then update monitor record
    const timeDeltaSec = videoCurrentTime - previousCurrentTime;
    const detectionAllowed = Date.now() >= timeJumpMonitor.disableUntil; // don't detect jumps we triggered with "undo"
    if (detectionAllowed && (timeDeltaSec < 0 || timeDeltaSec >= 0.95 * player.getPlaybackRate())) { // jump detected! going backwards, or going forwards too fast.
        timeJumpMonitor.beforeJump = previousCurrentTime; // remember where we were just half a second ago
    }
}

/** saves video position for current video */
function saveCurrentPosition(videoId, videoCurrentTime) {
    savedPositions[videoId] = {videoTime: videoCurrentTime, savedAt: Date.now() };
    showNotification('Saved position: ' + formatTime(videoCurrentTime));
    cleanupOldSavedPositions();
}

/** restores saved video position for current video (we've already checked that we have a save) */
function restoreSavedPosition(video, videoId) {
    video.currentTime = savedPositions[videoId].videoTime;
    savedPositions[videoId].savedAt = Date.now(); // bump save timestamp so that we don't eventually lose it
    cleanupOldSavedPositions();
}

function cleanupOldSavedPositions() {
    const keys = Object.keys(savedPositions);
    const now = Date.now();
    var deleted = 0;
    for (var key of keys) {
        if (now - savedPositions[key].savedAt > SAVED_POSITIONS_TTL_SEC * 1000) {
            delete savedPositions[key];
            deleted++;
        }
    }
}

// local values that can change when various shortcuts are used
var savedPositions = {}; // keyed by videoId
var lastEventTimeMs = Date.now();
const defaultTimeJumpMonitor = {videoId: null, videoCurrentTime: 0, beforeJump: -1, disableUntil: -1};
var timeJumpMonitor = {};

function resetTimeJumpMonitor() {
    timeJumpMonitor = Object.assign({}, defaultTimeJumpMonitor);
}

setInterval(detectTimeJump, 500); // detect when the user jumps through the video to enable "undo jump"

addEventListener('keypress', function (e) { // handle keypress events
    const tag = e.target.tagName.toLowerCase();
    const nowMs = Date.now();
    if (isContentEditable(e.target) || tag == 'input' || tag == 'textarea' || // key press is in a text field, like the search field or typing a comment
        (nowMs - lastEventTimeMs) < MIN_TIME_BETWEEN_KEYPRESSES_MS) { // it hasn't been long enough since the last keypress
        return;
    }
    lastEventTimeMs = nowMs;

    const player = document.getElementById('movie_player');
    const buttons = findLikeDislikeButtons();
    const video = getVideoElement();
    const videoId = getVideoId();
    if (e.code == 'BracketLeft' && hasNoModifiers(e) && buttons.like) {
        const likePressed = getPressedAttribute(buttons.like);
        if (likePressed === 'true') {
            showNotification(maybePrefixWithEmoji('😭', 'Removed like from video'));
        } else if (likePressed === 'false') {
            showNotification(maybePrefixWithEmoji('❤️', 'Liked video'));
        }
        buttons.like.click();
        stopEvent(e);
    } else if (e.code == 'BracketRight' && hasNoModifiers(e) && buttons.dislike) {
        const dislikePressed = getPressedAttribute(buttons.dislike);
        if (dislikePressed === 'true') {
            showNotification(maybePrefixWithEmoji('😐', 'Removed dislike from video'));
        } else if (dislikePressed === 'false') {
            showNotification(maybePrefixWithEmoji('💔', 'Disliked video'));
            if (REMOVE_FEEDBACK_SHARED_WITH_CREATOR) {
                removeBuiltInFeedbackShared(Date.now());
            }
        }
        buttons.dislike.click();
        stopEvent(e);
    } else if (video && isOneSecFiveSecShortcut(e)) {
        const numSeconds = e.shiftKey ? 1 : 5;
        const multiplier = e.code === 'KeyZ' ? -1 : +1;
        applyDeltaSec(video, multiplier * numSeconds);
    } else if (video && e.code == 'KeyH' && hasNoModifiers(e)) {
        if (document.pictureInPictureElement !== null) { // already in PiP mode
            document.exitPictureInPicture();
        } else { // enable PiP
            if (video.hasAttribute('disablepictureinpicture')) { // just in case it's ever set, let's drop it.
                video.removeAttribute('disablepictureinpicture');
            }
            video.requestPictureInPicture();
        }
        stopEvent(e);
    } else if (video && e.code == 'KeyB' && hasNoModifiers(e)) { // back up current position
        saveCurrentPosition(videoId, video.currentTime);
        stopEvent(e);
    } else if (video && e.code == 'KeyR' && hasNoModifiers(e)) { // restore saved position
        if (videoId && savedPositions[videoId]) {
            restoreSavedPosition(video, videoId);
            stopEvent(e);
        } else {
            showNotification('No saved timestamp found');
        }
    } else if (video && e.code == 'KeyU' && hasNoModifiers(e) && timeJumpMonitor.beforeJump >= 0) { // restore position before a time jump
        video.currentTime = timeJumpMonitor.beforeJump;
        timeJumpMonitor.beforeJump = -1; // turn off
        timeJumpMonitor.disableUntil = Date.now() + 950; // allow a full monitor run before we check again, to avoid detecting this "undo" as a jump itself
    } else if (player && onlyModifier(e, 'shiftKey') && (e.code === 'BracketLeft' || e.code === 'BracketRight')) {
        const multiplier = (e.code === 'BracketLeft' ? -1 : +1);
        player.setPlaybackRate(player.getPlaybackRate() + multiplier * PLAYBACK_RATE_STEP);
        showNotification('Playback rate:' + formatPlaybackRate(player.getPlaybackRate()));
        stopEvent(e);
    } else if (video && pageIsYouTubeShortsViewer()) { // specifically for the "Shorts" viewer:
        if (e.code === 'KeyW' && hasNoCtrlAltMetaModifiers(e)) { // 'w' pressed, potentially with a "shift" modifier
            switchFromShortsToClassicPlayer(videoId, video, e.shiftKey); // if shift is pressed, sets "openInNewTab" to true (last parameter)
            stopEvent(e);
        } else if (hasNoModifiers(e)) { // Re-implement some features from the Watch page, since the Shorts viewer doesn't provide all the same built-in shortcuts:
            var shouldStopEvent = true; // whether we've handled the keyboard event
            if (keyPressIsZeroToNine(e)) { // support '0' … '9' to jump to the corresponding 0% to 90% of the duration
                const percentage = parseInt(e.key) / 10;
                video.currentTime = percentage * video.duration;
            } else if (e.code === 'Comma' || e.code === 'Period') {
                const fps = 30;
                const deltaFrames = (e.code === 'Comma' ? -1 : +1);
                applyDeltaSec(video, deltaFrames / fps);
            } else if (e.code === 'KeyJ' || e.code === 'KeyL') {
                applyDeltaSec(video, (e.code === 'KeyJ' ? -10 : +10));
            } else if (e.code === 'KeyF') {
                switchShortInOutOfFullScreen(video);
            } else { // we didn't take *any* of the branches above
                shouldStopEvent = false;
            }

            if (shouldStopEvent) { // if we did handle the key press for one of the conditions above, then swallow the keyboard event.
                stopEvent(e);
            }
        }
    }
});