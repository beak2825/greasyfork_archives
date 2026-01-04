// ==UserScript==
// @name         Per domain volume memory.
// @version      1.2
// @description  Store volume changes in localStorage and apply them to all videos on load.
// @author       Polywock
// @match        http://*/*
// @match        https://*/*
// @namespace    https://github.com/polywock
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/446626/Per%20domain%20volume%20memory.user.js
// @updateURL https://update.greasyfork.org/scripts/446626/Per%20domain%20volume%20memory.meta.js
// ==/UserScript==

if (!window.ranScriptFlag) {
    window.ranScriptFlag = true

    // don't let these domains change volume at all.
    const ALWAYS_BLOCK = ["www.listennotes.com", "www.example.com"].includes(document.domain.toLowerCase())

    let blockTimeout
    // block website from changing volume for first 3 seconds.
    let BLOCK_DURATION = 3000

    // add event listener to store latest volume.
    window.addEventListener("volumechange", e => {
        const video = e.target
        if (!(video instanceof HTMLMediaElement)) return

        localStorage.setItem("gs-volume", video.volume)
    }, true)


    // function to get stored volume
    const getStoredVolume = () => {
        let volumeRaw = localStorage.getItem("gs-volume")
        if (volumeRaw) {
            return parseFloat(volumeRaw)
        }
    }

    // block page from changing volume
    const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "volume")
    Object.defineProperty(HTMLMediaElement.prototype, "volume", {configurable: true, enumerable: true, get: desc.get, set: function(value) {
        return (blockTimeout || ALWAYS_BLOCK) ? undefined : desc.set.call(this, value)
    }})

    // on start of video, set volume to the stored one.
    window.addEventListener("loadedmetadata", e => {
        const video = e.target
        if (!(video instanceof HTMLMediaElement)) return
        clearTimeout(blockTimeout)
        blockTimeout = setTimeout(() => { blockTimeout = null }, BLOCK_DURATION)
        desc.set.call(video, getStoredVolume() ?? 0.5)
    }, true)
}