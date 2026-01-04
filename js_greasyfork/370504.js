// ==UserScript==
// @name            YouTube: Stop Automatic Video Playback
// @namespace       org.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/02a9025ae1f23aefe1f4ea02e78b0ac8/raw/
// @version         4.7.3
// @description     Stop automatic video playback everywhere. Works on first page load & after navigating.
// @author          sidneys
// @icon            https://www.youtube.com/favicon.ico
// @noframes
// @match           http*://www.youtube.com/*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/370504/YouTube%3A%20Stop%20Automatic%20Video%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/370504/YouTube%3A%20Stop%20Automatic%20Video%20Playback.meta.js
// ==/UserScript==


/**
 * ESLint
 * @global
 */
/* global Debug */
Debug = false


/**
 * Applicable URL paths
 * @default
 * @constant
 */
const urlPathList = [
    '/channel',
    '/watch'
]


/**
 * YouTube API Player States
 * @constant
 * @enum
 */
const PLAYERSTATE = {
    '-1': 'UNSTARTED',
    0: 'ENDED',
    1: 'PLAYING',
    2: 'PAUSED',
    3: 'BUFFERING',
    5: 'CUED'
}


/**
 * Generate a method name for an event name using the DOM convention ("on" + Event Name)
 * @param {String} eventName - Event name (e.g. 'Click')
 * @returns {String} - Method name (e.g. 'onclick')
 */
let getHandlerMethodNameForEventName = eventName => `on${eventName.toLowerCase()}`

/**
 * Lookup the first <video> Element
 * @returns {Element} - <video> Element
 */
let getVideoElement = () => document.querySelector('video')

/**
 * Lookup YouTube Video Player through the DOM
 * @returns {Object} - YouTube Video Player
 */
let getYoutubePlayer = () => {
    console.debug('getYoutubePlayer')

    // Lookup Player element
    const playerElement = document.querySelector('ytd-player')

    // Return the property containing the Player API
    return playerElement && playerElement.player_
}

/**
 * Stop playback on YouTube via the Player API
 * @param {Object} youtubePlayer - YouTube Video Player API
 */
let stopYoutubePlayerPlayback = (youtubePlayer) => {
    console.debug('stopYoutubePlayerPlayback')

    // Get YouTube Video element
    const videoElement = getVideoElement()

    // Playback event types to watch
    const eventTypeList = [ 'play', 'playing', 'timeupdate' ]

    // Iterate playback event types
    eventTypeList.forEach((eventType, eventTypeIndex) => {

        // Playback "Stopper" method, each playback event
        let eventHandler = () => {
            console.debug(`videoElement#${eventType}`)

            // Remove all "Stopper" event handlers by deleting <video>#onplay, <video>#onplaying, <video>#ontimeupdate
            eventTypeList.forEach((eventType) => {
                const handlerMethodName = getHandlerMethodNameForEventName(eventType)

                delete videoElement[handlerMethodName]
                videoElement[handlerMethodName] = null

                // DEBUG
                console.debug('videoElement', 'removing event handler method:', handlerMethodName)
            })

            // Lookup YouTube Player state
            const playerState = youtubePlayer.getPlayerState()

            // Stop video (if it is not already paused)
            if (youtubePlayer.getPlayerState() !== 2) {
                youtubePlayer.pauseVideo()

                // Status
                console.info('Stopped automatic video playback', 'during the', PLAYERSTATE[playerState], 'phase')

                // DEBUG
                console.debug('stopYoutubePlayerPlayback', 'eventType:', eventType, 'playerState:', `${playerState} (${PLAYERSTATE[playerState]})`)
            }
        }

        // Add event handler to video element
        const handlerMethodName = getHandlerMethodNameForEventName(eventType)
        videoElement[handlerMethodName] = eventHandler
    })
}


/**
 * Init
 */
let init = () => {
    console.info('init')

    // Verify URL path
    if (!urlPathList.some(urlPath => window.location.pathname.startsWith(urlPath))) { return }

    // Initiate lookup loop
    let requestId
    let lookup = () => {
        // Lookup YouTube Player
        const youtubePlayer = getYoutubePlayer()

        // Is 1. the Player API available,  2. the Player ready?
        if (!youtubePlayer || (youtubePlayer && !youtubePlayer.isReady())) {
            // DEBUG
            console.debug('❌ YouTube Player API unavailable or Player not ready yet.')

            // Skip loop
            requestId = window.requestAnimationFrame(lookup)

            return
        }

        // Stop Playback
        stopYoutubePlayerPlayback(youtubePlayer)

        // DEBUG
        console.debug('✅ YouTube Player API available and Player ready.')

        // End loop
        window.cancelAnimationFrame(requestId)
    }

    // Initiate loop
    requestId = window.requestAnimationFrame(lookup)
}


/**
 * Handle in-page navigation (modern YouTube)
 * @listens window:Event#yt-navigate-finish
 */
window.addEventListener('yt-navigate-finish', () => {
    console.debug('window#yt-navigate-finish')

    init()
})
