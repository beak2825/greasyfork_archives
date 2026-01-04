// ==UserScript==
// @name         Netflix keyboard shortcuts
// @namespace    netflix.keyboard
// @version      1.6.2
// @description  Use similar controls as on YouTube when watching Netflix (f for full screen, k to play/pause, c for captions, j and l to go back and forward 10 seconds, a to change audio, p for picture-in-picture, and many more – all configurable)
// @include      https://netflix.com/*
// @include      https://www.netflix.com/*
// @grant        none
// @author       https://chrome.google.com/webstore/detail/netflix-keyboard-shortcut/mjpponglbellandpimdbmmhbhmakcgji
// @downloadURL https://update.greasyfork.org/scripts/420603/Netflix%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/420603/Netflix%20keyboard%20shortcuts.meta.js
// ==/UserScript==

(function() {
    /* global netflix */
    'use strict';
    const debug = false; // set this to true to get debug information as the script processes events, and expose the `player` object as `document.player`.

    // change these constants if you prefer to use different keys (or change the letter to uppercase if you want the shortcut to require the use of Shift)
    // to disable a particular feature, set the value to null.
    const PLAY_PAUSE_KEY = 'k'; // play/pause (same as on YouTube)
    const PICTURE_IN_PICTURE_KEY = 'p'; // turns picture-in-picture on or off
    const ONE_FRAME_FORWARD_KEY = '.'; // when paused, moves ahead by one frame
    const ONE_FRAME_BACKWARD_KEY = ','; // when paused, moves back by one frame
    const NEXT_EPISODE_KEY = 'N'; // (capital `n`) – goes to the very end of the current episode, causing the "Play Next Episode" button to appear.
    const PLAYBACK_SPEED_FASTER = '>'; // increases the playback speed (see `PLAYBACK_SPEED_INCREMENTS` below)
    const PLAYBACK_SPEED_SLOWER = '<'; // decreases the playback speed (see `PLAYBACK_SPEED_INCREMENTS` below)
    const SUBTITLES_ON_OFF_KEY = 'c'; // turns subtitles on or off. see `DEFAULT_SUBTITLES_LANGUAGE` below for a way to pick the language of your choice
    const SUBTITLES_SIZE_KEY = 's'; // changes the size of subtitles (Netflix has 3 options: small/medium/large – this cycles between them)
    const SUBTITLES_NEXT_LANGUAGE_KEY = 'v'; // selects the next subtitles track
    const NEXT_AUDIO_TRACK_KEY = 'a'; // switches audio to the next track
    const MUTE_UNMUTE_KEY = null; // Netflix sets mute/unmute to 'm'. You can use a different key here.
    const VOLUME_UP_KEY = 'PageUp'; // we can't use 'ArrowUp' here since Netflix already handles this event themselves.
    const VOLUME_DOWN_KEY = 'PageDown'; // we can't use 'ArrowDown' here since Netflix already handles this event themselves.
    const NUMBER_KEYS_ENABLED = true; // press key 0 to jump to 0% (start of the video), 1 for 10%… up to 9 for 90%
    const DEBUG_PANEL_KEY = 'd'; // shows the Netflix debug panel

    // the following constants control the visual feedback that's briefly displayed for certain actions
    const FADING_TEXT_DURATION_SEC = 0.75; // duration of fading-out text on key press, in seconds
    const PLAY_PAUSE_SHOW = true; // whether to show the play/pause symbol when `PLAY_PAUSE_KEY` is pressed
    const PLAYBACK_SPEED_CHANGE_SHOW = true; // whether to show the new playback speed on-screen
    const SUBTITLES_NEXT_LANGUAGE_SHOW = true; // whether to show which subtitles language was switched to
    const NEXT_AUDIO_TRACK_SHOW = true; // whether to show which language track audio was switched to
    const NUMBER_KEYS_SHOW = true; // whether to show to which percentage we're jumping when pressing 0..9
    const TIME_SCRUB_SHOW = true; // whether to show to by how many second we're jumping when pressing one of the keys in `TIME_SCRUB`

    // edit the following list to add more time-scrubbing shortcuts.
    // each entry has a `key` and a `time`; `key` is the key to press and `time` is by how much to go forward (or backward if negative), expressed in seconds.
    // non-integral values are supported (e.g. +2.5), and uppercase letters for `key` work too (e.g. you can have `j` for -10s and `J` for -60s)
    const TIME_SCRUB_KEYS = [
        {key: 'j', time: -10}, // go back 10 seconds (same as on YouTube)
        {key: 'l', time: +10}, // go forward 10 seconds (same as on YouTube)
        {key: 'J', time: -60}, // go back 60 seconds
        {key: 'L', time: +60}, // go forward 60 seconds
        {key: '[', time:  -5}, // go back 5 seconds
        {key: ']', time:  +5}, // go forward 5 seconds
    ];

    // edit these values to change the available playback speeds. 1.0 is normal speed, 0.5 is half speed, etc.
    // pressing `PLAYBACK_SPEED_FASTER` goes to the next higher value, and pressing `PLAYBACK_SPEED_SLOWER` goes to the next lower value
    const PLAYBACK_SPEED_INCREMENTS = [
        0.5,
        0.75,
        0.9,
        1.0,
        1.1,
        1.25,
        1.5,
        2.0,
        2.5,
    ];

    // these constants control the behavior of the shortcut keys above
    const VOLUME_DELTA = 0.05; // how much to increase/decrease the volume by (range is 0.0 to 1.0 so 0.05 is 5%)
    const DEFAULT_SUBTITLES_LANGUAGE = 'English'; // change this to have the subtitles key pick a different language by default (when you start from "Off" and press "c"). Example values you can use: 'en', 'fr', 'es', 'zh-Hans', 'zh-Hant'...
    const DEFAULT_FRAMES_PER_SECOND = 24; // how many frames the script considers to be in one second if this information can't be found in the video metadata (this is used for the "next frame"/"previous frame" shortcut which seeks by one second over this amount)

    /***************************************************************************************************************************************************************************************************/

    function detectDuplicateKeyBindings() {
        // first list all individually-set shortcuts
        const mapped = [PLAY_PAUSE_KEY, PICTURE_IN_PICTURE_KEY, ONE_FRAME_FORWARD_KEY, ONE_FRAME_BACKWARD_KEY,
                        SUBTITLES_ON_OFF_KEY, SUBTITLES_SIZE_KEY, SUBTITLES_NEXT_LANGUAGE_KEY, SUBTITLES_NEXT_LANGUAGE_KEY.toUpperCase(),
                        NEXT_AUDIO_TRACK_KEY,NEXT_AUDIO_TRACK_KEY.toUpperCase(), MUTE_UNMUTE_KEY, VOLUME_UP_KEY, VOLUME_DOWN_KEY,
                        PLAYBACK_SPEED_FASTER, PLAYBACK_SPEED_SLOWER, NEXT_EPISODE_KEY, DEBUG_PANEL_KEY];
        TIME_SCRUB_KEYS.map(entry => entry.key).forEach(key => mapped.push(key)); // also add the time-scrub ones
        const mappedNoNulls = mapped.filter(key => key !== null); // remove null since they don't match actual key presses and mean the shortcut is disabled

        const seen = new Set(); // then dedupe and report errors
        mapped.forEach(key => {
            if (seen.has(key)) {
                console.error('Configuration error: the key shortcut "' + key + '" is assigned to at least two different actions');
            } else {
                seen.add(key);
            }
        });
    }
    detectDuplicateKeyBindings(); // called once

    /**
     * Gets a nested property inside an object.
     */
    function getDeepProperty(obj, props) {
        if (typeof obj === 'undefined') {
            return null;
        } else if (typeof obj !== 'object') {
            return obj;
        }
        var cur = obj;
        for (var key of props.split('.')) {
            const isFunction = key.endsWith('()');
            const attrName = isFunction ? key.substring(0, key.length-2) : key;
            if (!cur[attrName]) {
                return null;
            }
            cur = cur[attrName];
            if (isFunction && typeof cur === 'function') {
                cur = cur();
            }
        }
        return cur;
    }

    /**
     * Returns the "Player" object used by the Netflix web app to control video playback.
     * We get the playerApp, then API, then video player object on which we list the session IDs
     * and return the video player for that session ID. Preference is given to a session ID that
     * starts with 'watch-' (some start with e.g. 'motion-billboard-' and are not the content).
     */
    function getPlayer() {
        // uses the `netflix` object, a global variable exposed by the web app
        const videoPlayer = getDeepProperty(netflix, 'appContext.state.playerApp.getAPI().videoPlayer');
        if (videoPlayer && videoPlayer.getVideoPlayerBySessionId && videoPlayer.getAllPlayerSessionIds) {
            const allSessionIds = videoPlayer.getAllPlayerSessionIds();
            const watchSessionIds = allSessionIds.filter(sid => sid.startsWith('watch-'));
            if (watchSessionIds.length > 0) {
                return videoPlayer.getVideoPlayerBySessionId(watchSessionIds[0]); // we can't differentiate them though
            } else if (allSessionIds.length > 0) {
                return videoPlayer.getVideoPlayerBySessionId(allSessionIds[0]); // otherwise just return the first one
            }
        }
        return null;
    }

    /**
     * Returns the `<video>` tag for playing media.
     */
    function getVideoTag() {
        const videos = document.getElementsByTagName('video');
        return (videos && videos.length === 1 ? videos[0] : null);
    }

    function isBoolean(b) {
        return b === true || b === false;
    }

    /**
     * Returns the subtitles track for a given language.
     * Matches full name (e.g. "English") or a BCP 47 language code (e.g. "en")
     */
    function findSubtitlesTrack(player, language) {
        const tracks = player.getTimedTextTrackList();
        var bestTrack = null; // tracks the best choice we've found so far
        for (var i = 0; i < tracks.length; i++) {
            if (tracks[i].displayName === language || tracks[i].bcp47 === language) { // language matches, that's a good start
                if ((bestTrack === null) || // none found yet
                    (bestTrack !== null && bestTrack.trackType !== 'PRIMARY' && tracks[i].trackType === 'PRIMARY')) { // this one is better (PRIMARY vs ASSISTIVE), replace
                    bestTrack = tracks[i];
                    debug && console.log('Best choice so far looking for "' + language + '":', bestTrack);
                }
            }
        }
        return bestTrack;
    }

    /**
     * Returns the next size for subtitles
     */
    function nextSubtitlesSize(currentSize) {
        switch(currentSize) {
            case 'SMALL': return 'MEDIUM';
            case 'MEDIUM': return 'LARGE';
            case 'LARGE': return 'SMALL';
            default: // not found somehow
                return 'MEDIUM';
        }
    }

    var lastSelectedTextTrack = null; // caches the last non-"Off" language to have the `c` key switch between "Off" and that language.
    var preferredTextTrack = null; // caches the preferred language track

    function switchSubtitles(player) {
        // select preferred language, once
        if (preferredTextTrack === null) {
            preferredTextTrack = findPreferredTextTrack(player);
            debug && console.log('Found preferred text track:', preferredTextTrack);
        }

        // first, get current track to see if subtitles are currently visible
        const currentTrack = player.getTimedTextTrack();
        const disabledTrack = findSubtitlesTrack(player, 'Off');
        const currentlyDisabled = (currentTrack !== null && disabledTrack !== null && currentTrack.displayName === disabledTrack.displayName);

        // flip
        if (currentlyDisabled) {
            // do we have a last selected track? if so, switch back to it.
            if (lastSelectedTextTrack && lastSelectedTextTrack.displayName !== 'Off') { // avoid switching from "Off" to "Off"
                player.setTimedTextTrack(lastSelectedTextTrack);
            } else if (preferredTextTrack) { // otherwise, switch to preferred language
                player.setTimedTextTrack(preferredTextTrack);
            } else {
                console.warn("No last selected subtitles track to go back to, and couldn't find subtitles in the preferred language,", DEFAULT_SUBTITLES_LANGUAGE);
            }
        } else { // currently enabled, so we're switching to "Off".
            player.setTimedTextTrack(disabledTrack);
        }
        lastSelectedTextTrack = currentTrack; // and remember what we just switched from
    }

    function findPreferredTextTrack(player) {
        var chosenTrack = findSubtitlesTrack(player, DEFAULT_SUBTITLES_LANGUAGE);
        if (!chosenTrack) {
            console.warn('Could not find subtitles in ' + DEFAULT_SUBTITLES_LANGUAGE + (DEFAULT_SUBTITLES_LANGUAGE !== 'English' ? ', defaulting to English' : ''));
            chosenTrack = findSubtitlesTrack(player, 'English');
            if (!chosenTrack) {
                DEFAULT_SUBTITLES_LANGUAGE !== 'English' && console.warn('Could not find subtitles in English either :-/');
            }
        }
        return chosenTrack; // might be null
    }

    function nextOffset(curOffset, delta, numElements) {
        return (curOffset + delta + numElements) % numElements; // add delta, and then length too so that we don't get a negative modulo
    }

    /**
     * Selects the next track in the list of available audio tracks.
     */
    function selectNeighborAudioTrack(player, delta) {
        const trackList = player.getAudioTrackList();
        const currentTrack = player.getAudioTrack();
        if (!trackList || !currentTrack) {
            console.warn('Could not find the current audio track or the list of audio tracks');
        }

        for (var i = 0; i < trackList.length; i++) {
            if (currentTrack.displayName === trackList[i].displayName) { // found!
                const nextTrack = trackList[nextOffset(i, delta, trackList.length)];
                debug && console.log('Switching audio track to ' + nextTrack.displayName);
                if (NEXT_AUDIO_TRACK_SHOW) {
                    displayText(player, nextTrack.displayName, false);
                }
                player.setAudioTrack(nextTrack);
                return;
            }
        }
    }

    /**
     * Selects the next track in the list of available subtitles tracks.
     */
    function selectNeighborSubtitlesTrack(player, delta) {
        const trackList = player.getTimedTextTrackList();
        const currentTrack = player.getTimedTextTrack();
        if (!trackList || !currentTrack) {
            console.warn('Could not find the current subtitles track or the list of subtitles tracks');
        }

        for (var i = 0; i < trackList.length; i++) {
            if (currentTrack.trackId === trackList[i].trackId) { // found!
                const nextTrack = trackList[nextOffset(i, delta, trackList.length)];
                debug && console.log('Switching subtitles track to ' + nextTrack.displayName);
                if (SUBTITLES_NEXT_LANGUAGE_SHOW) {
                    displayText(player, nextTrack.displayName, false);
                }
                player.setTimedTextTrack(nextTrack);
                return;
            }
        }
    }

    /* Debug panel */
    function toggleDebugPanel() {
        netflix.player.diag.togglePanel('info', null); // also accepts `true` or `false`, but `null` means toggle
    }

    /* Playback speed */
    var savedPlaybackRate = null;

    function changePlaybackSpeed(player, video, delta) {
        const currentSpeed = video.playbackRate;
        var smallestDifference = Number.MAX_VALUE;
        var savedOffset = -1;
        for (var i = 0; i < PLAYBACK_SPEED_INCREMENTS.length; i++) {
            const curDifference = Math.abs(currentSpeed - PLAYBACK_SPEED_INCREMENTS[i]);
            if (curDifference < smallestDifference) {
                savedOffset = i;
                smallestDifference = curDifference;
            }
        }
        // compute new rate, adjust
        const newOffset = limitRange(0, PLAYBACK_SPEED_INCREMENTS.length - 1, savedOffset + delta);
        const newPlaybackRate = PLAYBACK_SPEED_INCREMENTS[newOffset];
        debug && console.log('Found closest rate (', PLAYBACK_SPEED_INCREMENTS[savedOffset], ') to the current rate (', currentSpeed, ')');
        debug && console.log('Setting new playback rate:', newPlaybackRate); // not using `debug` to have *some* way to tell what the current playback rate is

        // Preserve value, adjust now. Display feedback if needed.
        PLAYBACK_SPEED_CHANGE_SHOW && displayText(player, newPlaybackRate + 'x');
        savedPlaybackRate = newPlaybackRate;
        reapplyPlaybackRate();
    }

    function reapplyPlaybackRate() {
        const video = getVideoTag();
        if (video && savedPlaybackRate !== null) {
            video.playbackRate = savedPlaybackRate;
        }
    }

    /*  Frame-by-frame skips & more precise scrubbing  */
    var lastExpectedTimeMillis = null; // tracks where we believe we seek()'d  to the last time we moved frame by frame
    function moveToPosition(player, timeMillis) {
        player.seek(timeMillis);
        lastExpectedTimeMillis = timeMillis;
    }

    // if diagnostics give us the number of frames per second, use that; otherwise use the constant `FRAMES_PER_SECOND`.
    function getFramesPerSecond(player) {
        try {
            const fromDiagnostics = parseFloat(player.getDiagnostics().getGroups().filter(group => 'Framerate' in group)[0].Framerate);
            if (fromDiagnostics > 0 && fromDiagnostics < 200) {
                return fromDiagnostics;
            }
        } catch (error) {}
        return DEFAULT_FRAMES_PER_SECOND;
    }

    /**
     * Skips or goes back one frame (based on factor > 0 or < 0)
     */
    function skipFrame(player, factor) {
        const currentTime = lastExpectedTimeMillis; // use the cached variable that we set when we entered the "paused" state
        const fps = getFramesPerSecond(player);
        const newPosition = limitRange(0, player.getDuration(), currentTime + factor * 1000.0 / fps); // factor is +1 or -1
        debug && console.log('Seek ' + (factor > 0 ? '>' : '<') + ' to:', newPosition, '(assuming',fps,'FPS)');
        moveToPosition(player, newPosition);
    }

    function limitRange(minValue, maxValue, n) {
        return Math.max(minValue, Math.min(maxValue, n));
    }

    /*  Play/Pause state change detection. We need this for frame skips to work, since `getCurrentTime()` might not update with a very short seek() so we keep track of the actual time in `lastExpectedTimeMillis`.  */

    /* Called when the video resumes playing (from being paused) */
    function onPlaybackResumes(player) {
        lastExpectedTimeMillis = null; // clear the current time
    }

    /* Called when the video is paused (from having been playing) */
    function onPlaybackPauses(player) {
        lastExpectedTimeMillis = player.getCurrentTime(); // when entering paused state, mark where we think we are and use this variable rather than `getCurrentTime()` to accurately keep track of the position.
    }

    /**
     * Find the `<video>` tag and installs "onPlay" and "onPause" callbacks if needed.
     * This is called repeatedly in case the `<video>` tag is replaced (e.g. the next episode starts playing)
     */
    function installPlayPauseCallbacks() {
        const video = getVideoTag();
        const player = getPlayer();
        if (!video || !player || video._nfkbdInstalled) { // nfkbd for Netflix Keyboard Controls
            return;
        }
        video.addEventListener('play', function() { onPlaybackResumes(player); });
        video.addEventListener('pause', function() { onPlaybackPauses(player); });
        video._nfkbdInstalled = true;
        debug && console.log('Play/pause callbacks installed');
    }

    /* Installs `<style>` block for fade-out */
    function installStyleBlock() {
        const CIRCLE_TEXT_FONT_SIZE_PX = 80;
        const CIRCLE_DIAMETER_PX = 260;
        const css = '@keyframes fadeOut {' +
              '    0% {' +
              '        opacity: 1;' +
              '    }' +
              '    100% {' +
              '        opacity: 0;' +
              '    }' +
              '}' +
              'h1.nfkbd-text {' +
              '    color: white;' +
              '    font-family: sans-serif;' +
              '    z-index: 2147483647;' +
              '    position: absolute;' +
              '    text-align: center;' +
              '    transform: translate(0%, -50%);' +
              '    animation: fadeOut ease ' + FADING_TEXT_DURATION_SEC + 's;' +
              '}' +
              'h1.nfkbd-no-border {' +
              '    font-size: 72pt;' +
              '    top: 45%;' +
              '    left: 0%;' +
              '    width: 100%;' +
              '    height: 100pt;' +
              '}' +
              'h1.nfkbd-cirled {' +
              '    top: 45%;' +
              '    left: calc(50% - 130px);' +
              '    vertical-align: middle;' +
              '    transform: translate(0%, -50%);' +

              '    border: 3px solid white;' + // white circular border
              '    background: transparent;' +
              '    padding: 0px;' +
              '    padding-top:  calc(120px - ' + (CIRCLE_TEXT_FONT_SIZE_PX/2) + 'px);' + // center the text in the circle
              '    font-size: ' + CIRCLE_TEXT_FONT_SIZE_PX + 'px;' +
              '    border-radius: ' + (CIRCLE_DIAMETER_PX/2) + 'px;' + // half of width and height
              '    width: ' + CIRCLE_DIAMETER_PX + 'px;' +
              '    height: calc(' + CIRCLE_DIAMETER_PX + 'px - (120px - ' + (CIRCLE_TEXT_FONT_SIZE_PX/2) + 'px)); ' + // remove the padding
              '}';

        const style = document.createElement('style');
        style.innerText = css;
        const body = document.querySelector('body');
        body.appendChild(style);
    }

    /**
     * Simulates mouse movement to get the player controls to show
     */
    function simulateMouseEvent(eventType) {
        const scrubber = document.querySelector('div.scrubber-container');
        if (!scrubber) {
            console.warn('Failed to simulate mouse movement');
            return;
        }
        const options = {'bubbles': true, 'button': 0, 'currentTarget': scrubber};
        scrubber.dispatchEvent(new MouseEvent(eventType, options));
    }

    function displayText(player, contents, inCircle) {
        const container = document.querySelector('div.controls-full-hit-zone');
        if (FADING_TEXT_DURATION_SEC <= 0.0 || !container) {
            return; // feature is disabled
        }
        removeAllCurrentText();
        const elt = document.createElement('h1');
        elt.classList.add('nfkbd-text', (inCircle ? 'nfkbd-cirled' : 'nfkbd-no-border'));
        elt.innerHTML = contents;

        // this is kind of hacky, but as far as I know there's no other way to get text to always be visible.
        simulateMouseEvent('mouseover'); // simulate mouse moving onto the scrubbing controls
        setTimeout(function() {
            simulateMouseEvent('mouseout'); // simulate mouse moving out of the scrubbing controls
            setTimeout(function() {
                container.appendChild(elt);
                setTimeout(function() { // schedule removal just before it fades out
                    removeIfStillExists(elt);
                }, 0.9 * (FADING_TEXT_DURATION_SEC * 1000));
            }, 20);
        }, 20);
    }

    function removeAllCurrentText() {
        document.querySelectorAll('h1.nfkbd-text').forEach(removeIfStillExists);
    }

    function removeIfStillExists(elt) {
        if (elt.parentNode && elt.parentNode.contains(elt)) { // remove only if it hasn't already been removed by the clean-up method
            elt.parentNode.removeChild(elt);
        }
    }

    /* called on a timer to install play/pause callbacks or re-adjust  the playback rate */
    function periodicCallback() {
        installPlayPauseCallbacks();
        reapplyPlaybackRate();
    }
    setInterval(periodicCallback, 100);

    installStyleBlock(); // installs the CSS `<style>` block the very first time we load the script

    /**
     * Installs the Netflix player object as `document.player` and a reference to the `<video>` tag as `document.video`.
     */
    function attachDebugObjects() {
        if (debug && (!document.player || !document.video)) {
            const player = getPlayer();
            const video = getVideoTag();
            if (player) {
                document.player = player;
            }
            if (video) {
                document.video = video;
            }
            if (!document.player || !document.video) {
                setTimeout(attachDebugObjects, 500); // try again soon
            }
        }
    }
    debug && attachDebugObjects();

    addEventListener("keydown", function(e) { // we need `keydown` instead of `keypress` to catch arrow presses
        if (e.ctrlKey || e.altKey) { // return early if any modifier key like Control or Alt is part of the key press
            return;
        }
        const KEYCODE_ZERO = 48; // keycode for character '0'
        const video = getVideoTag();
        const player = getPlayer();

        if (e.key === PICTURE_IN_PICTURE_KEY) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else if (video) {
                video.requestPictureInPicture();
            } else {
                console.error('Could not find a <video> tag to start PiP');
            }
        } else if (!player) {
            console.error('/!\\ No player object found, please update this script or report the issue if you are using the latest version');
            return;
        }
        // from now own, we know we have a `player` instance

        const scrubIndex = TIME_SCRUB_KEYS.map(o => o.key).indexOf(e.key);
        if (e.key === PLAY_PAUSE_KEY) {
            PLAY_PAUSE_SHOW && displayText(player, player.getPaused() ? '&#x25B6;' : 'II'); // play/pause
            player.getPaused() ? player.play() : player.pause();
        } else if (scrubIndex > -1) {
            const deltaSec = TIME_SCRUB_KEYS[scrubIndex].time;
            const newPosition = player.getCurrentTime() + deltaSec * 1000.0;
            TIME_SCRUB_SHOW && displayText(player, (deltaSec > 0 ? '+' : '') + deltaSec + 's');
            moveToPosition(player, limitRange(0, player.getDuration(), newPosition));
        } else if (e.key === ONE_FRAME_FORWARD_KEY && player.getPaused()) {
            skipFrame(player, +1);
        } else if (e.key === ONE_FRAME_BACKWARD_KEY && player.getPaused()) {
            skipFrame(player, -1);
        } else if (e.key === NEXT_EPISODE_KEY) {
            moveToPosition(player, 0.9999 * player.getDuration());
        } else if (e.key === PLAYBACK_SPEED_FASTER && video) {
            changePlaybackSpeed(player, video, +1);
        } else if (e.key === PLAYBACK_SPEED_SLOWER && video) {
            changePlaybackSpeed(player, video, -1);
        } else if (e.key === VOLUME_UP_KEY) {
            if (VOLUME_UP_KEY === 'ArrowUp') {
                console.warn('Netflix already raises the volume with "arrow up", we can\'t disable their handling');
            } else {
                player.setVolume(Math.min(1.0, player.getVolume() + VOLUME_DELTA));
            }
        } else if (e.key === VOLUME_DOWN_KEY) {
            if (VOLUME_UP_KEY === 'ArrowDown') {
                console.warn('Netflix already lowers the volume with "arrow down", we can\'t disable their handling');
            } else {
                player.setVolume(Math.max(0.0, player.getVolume() - VOLUME_DELTA));
            }
        } else if (e.key === MUTE_UNMUTE_KEY) {
            if (MUTE_UNMUTE_KEY === 'm') {
                console.warn('Netflix already mutes with "m"');
            } else {
                const muteState = player.getMuted();
                if (isBoolean(muteState)) { // make sure we got a valid state back
                    player.setMuted(!muteState);
                }
            }
        } else if (e.key === NEXT_AUDIO_TRACK_KEY) {
            selectNeighborAudioTrack(player, +1);
        } else if (e.key === NEXT_AUDIO_TRACK_KEY.toUpperCase()) {
            selectNeighborAudioTrack(player, -1);
        } else if (e.key === SUBTITLES_NEXT_LANGUAGE_KEY) {
            selectNeighborSubtitlesTrack(player, +1);
        } else if (e.key === SUBTITLES_NEXT_LANGUAGE_KEY.toUpperCase()) {
            selectNeighborSubtitlesTrack(player, -1);
        } else if (NUMBER_KEYS_ENABLED && e.keyCode >= KEYCODE_ZERO && e.keyCode <= KEYCODE_ZERO + 9) {
            NUMBER_KEYS_SHOW && displayText(player, (e.keyCode - KEYCODE_ZERO) * 10 + '%', true);
            player.seek((e.keyCode - KEYCODE_ZERO) * (player.getDuration() / 10.0));
        } else if (e.key === SUBTITLES_ON_OFF_KEY) {
            switchSubtitles(player); // extracted for readability
        } else if (e.key === SUBTITLES_SIZE_KEY) {
            const currentSettings = player.getTimedTextSettings();
            if (currentSettings && currentSettings.size) {
                player.setTimedTextSettings({size: nextSubtitlesSize(currentSettings.size)});
            } else {
                console.warn('Unable to find current subtitles size');
            }
        } else if (e.key === DEBUG_PANEL_KEY) {
            toggleDebugPanel();
        }
    });
})();