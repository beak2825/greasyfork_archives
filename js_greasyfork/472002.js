// ==UserScript==
// @name        Fediverse@Home
// @namespace   https://github.com/noccu
// @match       *://*/*
// @run-at      document-start
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.1.0
// @author      noccu
// @description Open Fediverse remote profiles on your local instance. Currently supports Misskey & Mastodon.
// @downloadURL https://update.greasyfork.org/scripts/472002/Fediverse%40Home.user.js
// @updateURL https://update.greasyfork.org/scripts/472002/Fediverse%40Home.meta.js
// ==/UserScript==

// const SUPPORTED_PLAFORMS = ["misskey_app", "mastodon"]
var HOME

function check() {
    // Are we on a fedi instance? (Slightly less dumb ver.)
    switch (true) {
        case document.querySelector("meta[name^=app]")?.content == "Misskey":
        case document.getElementById("mastodon") !== undefined:
            break
        default:
            return
    }

    // We are
    HOME = GM_getValue("fediHome")
    if (HOME && HOME == location.origin) {
        return
    }
    GM_registerMenuCommand("Set as home instance", setHome)
    GM_registerMenuCommand("Open on home instance", takeHome)
}

function setHome() {
    if (HOME) {
        var newHome = confirm(`Replace ${HOME} as home instance?`)
    }
    if (!newHome) { return }
    GM_setValue("fediHome", location.origin)
    console.log(`Home instance set to: ${location.origin}`)
}

function takeHome() {
    if (!location.pathname.startsWith("/@")) return
    if (!HOME) {
        alert("No home instance set.")
        return
    }
    let user = location.pathname.substring(1)
    window.location = `${HOME}/${user}@${location.host}`
}

window.addEventListener("DOMContentLoaded", check)
