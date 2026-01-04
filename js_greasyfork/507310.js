// ==UserScript==
// @name         YouTube Timestamp Keeper
// @namespace    Violentmonkey Scripts
// @version      0.1
// @description  Keep recent timestamp in URL on YouTube
// @author       EtiamNullam
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/507310/YouTube%20Timestamp%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/507310/YouTube%20Timestamp%20Keeper.meta.js
// ==/UserScript==
(function() {
    'use strict'

    /**
     * @param {number} durationMs
     */
    function Watcher(durationMs) {
        const watcher = {}
        let interval = null

        function check() {
            const player = getPlayer()

            if (!player || player.paused) {
                watcher.stop()
            } else {
                updateTimestamp()
            }
        }

        watcher.stop = () => {
            clearInterval(interval)

            interval = null
        }

        watcher.start = () => {
            watcher.stop()

            interval = setInterval(check, durationMs)
        }

        return watcher
    }

    const TIMESTAMP_UPDATE_INTERVAL_MS = 900
    const PLAYER_RETRY_DELAY_MS = 1000

    const watcher = Watcher(TIMESTAMP_UPDATE_INTERVAL_MS)

    const playerActionEvents = [
        { event: 'pause', action: updateTimestamp },
        { event: 'seeked', action: updateTimestamp },
        { event: 'play', action: watcher.start },
        { event: 'pause', action: watcher.stop },
    ]


    function getPlayer() {
        return document.querySelector('video')
    }

    function updateTimestamp() {
        const player = getPlayer()

        if (!player) {
            console.warn('Cannot find player')
            return
        }

        const currentUrl = new URL(window.location.href)
        const secondsElapsed = Math.floor(player.currentTime)
        const { searchParams } = currentUrl

        searchParams.set('t', secondsElapsed + 's')

        currentUrl.search = searchParams.toString()

        window.history.replaceState({}, '', currentUrl)
    }

    function setup() {
        if (window.location.pathname !== '/watch') {
            return
        }

        const player = getPlayer()

        if (!player) {
            console.warn('Cannot find player')
            setTimeout(setup, PLAYER_RETRY_DELAY_MS)

            return
        }

        for (const actionEvent of playerActionEvents) {
            player.addEventListener(actionEvent.event, actionEvent.action)
        }

        updateTimestamp()

        if (!player.paused) {
            watcher.start()
        }
    }

    function cleanUp() {
        const player = getPlayer()

        for (const actionEvent of playerActionEvents) {
            player.removeEventListener(actionEvent.event, actionEvent.action)
        }
    }

    window.addEventListener('yt-navigate-start', cleanUp)
    window.addEventListener('yt-navigate-finish', setup)
    window.addEventListener('beforeunload', updateTimestamp)
})()