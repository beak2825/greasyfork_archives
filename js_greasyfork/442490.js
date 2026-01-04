// ==UserScript==
// @name        MB: copy tracklist from OTOTOY
// @namespace   https://rinsuki.net
// @match       https://ototoy.jp/_/default/p/*
// @grant       none
// @version     1.0
// @author      rinsuki
// @license     MIT
// @description generates Track List for MusicBrainz, from ototoy.jp album page.
// @downloadURL https://update.greasyfork.org/scripts/442490/MB%3A%20copy%20tracklist%20from%20OTOTOY.user.js
// @updateURL https://update.greasyfork.org/scripts/442490/MB%3A%20copy%20tracklist%20from%20OTOTOY.meta.js
// ==/UserScript==

(() => {
    const tracklist = document.getElementById("tracklist")
    if (tracklist == null) return
    var tracks = ""
    function createTextarea() {
        if (tracks === "") return
        const textarea = document.createElement("textarea")
        textarea.value = tracks
        document.querySelector(".album-addendum").appendChild(textarea)
        tracks = ""
    }
    for (const tr of tracklist.querySelectorAll("tr")) {
        if (tr.classList.contains("disc-row")) {
            createTextarea()
            continue
        }
        const number = tr.querySelector("td:nth-child(1) canvas")
        const title = tr.querySelector("td > span[id^=title-]")
        if (title == null) continue
        const artist = title.parentElement.querySelector("span > a.artist")
        const time = tr.querySelector("td:nth-child(3)")
        tracks += `${number.textContent.trim()}. ${title.textContent.trim()}`
        if (artist != null) tracks += ` - ${artist.textContent.trim()}`
        tracks += ` (${time.textContent.trim()})\n`
    }
    createTextarea()
})()