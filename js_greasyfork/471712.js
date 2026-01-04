// ==UserScript==
// @name         Playback Shortcuts
// @namespace    endorh
// @version      1.1
// @description  Adds playback shortcuts to video players. ('Ctrl + >'/'Ctrl + <' to change playback rate, 'Ctrl + .' to enter PiP)
// @author       endorh
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471712/Playback%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/471712/Playback%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // == UserSettings ==

    // Hotkeys
    let enterPiPHotkey = (e) => e.key == '.' && e.ctrlKey
    let decreasePlaybackRateHotkey = (e) => e.key == '<' && e.ctrlKey
    let increasePlaybackRateHotkey = (e) => e.key == '>' && e.ctrlKey

    // Playback rate steps (must be sorted!)
    let playbackRates = [
        0.01, 0.025, 0.05, 0.1, 0.15, 0.20,
        0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
        2.5, 3, 3.5, 4, 5, 7.5, 10, 15, 20
    ] // Extra playback steps
    // let playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] // Classic YouTube rate steps

    // Playback overlay fade timeout in ms
    let fadeTimeout = 350 // ms

    // CSS style of the overlay. The overlay consists of three divs:
    // - outer container (sibling to the video element)
    //     It's applied the `globalPlaybackRateOverlayFadeOut` class after `fadeTimeout` ms
    //     have happened since the last playback rate change
    // - container (child to the outer container)
    //     Has the .globalPlaybackRateOverlayContainer class
    //     Its `position` should be `absolute`, as its actual position rectangle is updated
    //     on every playback rate change to match that of the video.
    //     Should be entirely transparent, not interactable and have a high z-index.
    // - overlay (child to the container)
    //     Its content is set to `${video.playbackRate}x` after each playback rate change.
    //     Can be centered with respect to its parent, which should match the dimensions of
    //     the video.
    //     Should be semitransparent to not disturb the video.
    GM_addStyle(`
        /* Container style */
        .globalPlaybackRateOverlayContainer {
            position: absolute;
            transition: opacity 0.05s;
            pointer-events: none;
            z-index: 2147483647;
        }

        /* Container style after fadeTimeout */
        .globalPlaybackRateOverlayFadeOut {
            transition: opacity 0.35s;
            opacity: 0%;
        }

        /* Overlay div style */
        .globalPlaybackRateOverlay {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            padding: 0.5em;
            font-size: 24px;
            border-radius: 0.25em;

            color: #FEFEFEFE !important;
            background-color: #000000A0 !important;
        }
    `)

    // Set to true to enable console messages
    let debug = false

    // Set to true to enable console warnings
    let warn = debug || true

    // Set to false if a website is using modification observers near the video element
    // to detect added overlays, breaking the video.
    let useOverlay = true



    // == Script ==
    // Object to preserve state across events
    let state = {};

    // Add the keyboard hook
    document.addEventListener('keydown', function(e) {
        if (enterPiPHotkey(e)) {
            if (enterPiP()) {
                if (debug) console.info("Entered PiP")
            }
        } else if (decreasePlaybackRateHotkey(e)) {
            if (modifyPlaybackRate(false)) {
                if (debug) console.info("Decreased playback rate")
                e.preventDefault()
            }
        } else if (increasePlaybackRateHotkey(e)) {
            if (modifyPlaybackRate(true)) {
                if (debug) console.info("Increased playback rate")
                e.preventDefault()
            }
        }
    })

    function findVideoElement() {
        // Find video element
        let videos = [...document.getElementsByTagName('video')]
        var video = null
        if (videos.length == 0) {
            if (debug) console.info("No video found.")
            return null
        } else if (videos.length == 1) {
            video = videos[0]
        } else {
            if (warn) console.warn("Multiple videos found, using only the first video found")
            if (debug) console.log(videos);
            video = videos[0]
        }
        return video
    }

    // Enter PiP (Picture-in-Picture)
    function enterPiP() {
        let video = findVideoElement()
        if (video == null) return false
        let doc = video.ownerDocument
        // Toggle Picture-in-Picture
        if (doc.pictureInPictureElement != video) {
            if (doc.pictureInPictureElement) {
                doc.exitPictureInPicture()
            }
            video.requestPictureInPicture()
        } else doc.exitPictureInPicture()
        return true
    }

    // Modify the playback
    function modifyPlaybackRate(faster) {
        let video = findVideoElement()
        if (video == null) return false

        // Current playback rate
        let pr = video.playbackRate

        // Find target playback (comparisons use a 1e-7 delta to avoid rounding nonsense)
        let target = faster? playbackRates.find(r => r > pr + 1e-7) : playbackRates.findLast(r => r < pr - 1e-7)
        if (debug) console.info("Changing playbackRate: " + pr + " -> " + target)

        // Set playback rate
        video.playbackRate = target
        if (debug) console.log("Modified playbackRate: " + video.playbackRate)

        // Check changed playback rate
        if (warn && video.playbackRate != target) {
            console.warn("Could not modify playbackRate!\nTarget: " + target + "\nActual: " + video.playbackRate)
        }

        // Display overlay with the final playback rate
        if (useOverlay) updateOverlay(video, video.playbackRate);
        return true
    }

    // Display an overlay with the updated playback rate
    function updateOverlay(v, rate) {
        // Reuse previous overlay
        var container = null
        if (state.overlay !== undefined) {
            if (state.timeout !== undefined) clearTimeout(state.timeout)
            container = state.overlay
        } else container = document.createElement('div')

        // Inline positions and rate value
        let parent = v.parentElement
        let r = v.getBoundingClientRect()
        let p = parent.getBoundingClientRect()
        let html = `
        <div class="globalPlaybackRateOverlayContainer" style="
            left: ${r.left - p.left}px;
            right: ${r.right - p.left}px;
            top: ${r.top - p.top}px;
            bottom: ${r.bottom - p.top}px;
            width: ${r.width}px;
            height: ${r.height}px;
        ">
            <div class="globalPlaybackRateOverlay">
                ${rate}x
            </div>
        </div>
        `
        container.innerHTML = html

        // Remove fade out
        container.classList.remove("globalPlaybackRateOverlayFadeOut")

        // Add overlay
        if (state.overlay !== undefined && state.overlay.parentElement != v.parentElement) {
            state.overlay.parentElement.removeChild(state.overlay)
            state.overlay = undefined
        }
        if (state.overlay === undefined) {
            v.parentElement.appendChild(container)
            state.overlay = container
        }

        // Set timeout for the fade out animation
        state.timeout = setTimeout(function() {
            container.classList.add("globalPlaybackRateOverlayFadeOut")
            state.timeout = undefined
        }, fadeTimeout);
    }
})();