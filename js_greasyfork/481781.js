// ==UserScript==
// @name         Continue playing MISSAV
// @name:ja      Continue playing MISSAV
// @namespace    http://tampermonkey.net/
// @version      2025-10-18-01
// @description  Prevents the video from stopping when clicking off-screen.
// @description:ja 画面外クリック時に動画が停止するのを防ぎます。
// @author       musuni
// @match        https://missav.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hyperts.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481781/Continue%20playing%20MISSAV.user.js
// @updateURL https://update.greasyfork.org/scripts/481781/Continue%20playing%20MISSAV.meta.js
// ==/UserScript==

'use strict'

const getStackTrace = () => {
    const obj = {}
    Error.captureStackTrace(obj, getStackTrace)
    return obj.stack
}

const pausedByUser = (stackTrace) => {
    return stackTrace.includes('at wt.togglePlay')
}

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const waitUntilPlayerLoaded = async () => {
    while (!window.player || !window.player.pause) {
        console.log('[Continue playing MISSAV] Player is not loaded yet...')
        await sleep(1000)
    }
    console.log('[Continue playing MISSAV] Player is loaded!')
}

waitUntilPlayerLoaded().then(() => {
    window.player.pause = () => {
        if (pausedByUser(getStackTrace())) {
            window.player.media.pause()
        }
    }
})
