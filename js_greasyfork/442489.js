// ==UserScript==
// @name        MB: copy tracklist from mora
// @namespace   https://rinsuki.net
// @match       https://mora.jp/package/*
// @grant       none
// @version     1.0.1
// @author      rinsuki
// @license     MIT
// @description generates Track List for MusicBrainz, from mora.jp page.
// @downloadURL https://update.greasyfork.org/scripts/442489/MB%3A%20copy%20tracklist%20from%20mora.user.js
// @updateURL https://update.greasyfork.org/scripts/442489/MB%3A%20copy%20tracklist%20from%20mora.meta.js
// ==/UserScript==

const origFunc = Package.renderMain

Package.renderMain = function() {
    origFunc.call(this)
    const json = Package.sfPackageData
    console.log(json)
    var tracks = ""
    for (const track of json.trackList) {
        tracks += `${track.trackNo}. ${track.title} - ${track.artistName} (${track.durationStr})\n`
    }
    if (tracks === "") return
    const textarea = document.createElement("textarea")
    textarea.value = tracks
    textarea.style.width = "100%"
    const desc = document.querySelector("#package_description")
    desc.parentElement.insertBefore(textarea, desc)
    tracks = ""
    const rawLink = SFPath.getPackage(mountPoint, labelId, materialNo) + '/packageMeta.json'
    const rawLinkAnchor = document.createElement("a")
    rawLinkAnchor.href = rawLink
    rawLinkAnchor.textContent = "packageMeta.json"
    rawLinkAnchor.style.fontSize = "1rem"
    rawLinkAnchor.style.textDecoration = "underline"
    desc.parentElement.insertBefore(rawLinkAnchor, desc)
}