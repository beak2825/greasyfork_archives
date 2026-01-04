// ==UserScript==
// @name        AniChart Season Preview
// @namespace   https://github.com/noccu
// @match       https://anichart.net/*
// @grant       GM_addStyle
// @version     1.1
// @author      noccu
// @description Auto-expands descriptions + slightly larger font, x2 speed trailers.
// @downloadURL https://update.greasyfork.org/scripts/471109/AniChart%20Season%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/471109/AniChart%20Season%20Preview.meta.js
// ==/UserScript==

// Config
const PLAYBACK_RATE = 2

// Improve display
GM_addStyle(`
  div.chart-view {
    margin: 0 !important;
  }
  div.card-list {
    grid-column-gap: 1em !important;
    grid-row-gap: 1em !important;
    grid-template-rows: unset !important;
    grid-template-columns: repeat(auto-fill, minmax(31em, 1fr)) !important;
    margin: 1em;
    width: unset !important;
  }
  .media-card {
    height: auto !important;
  }
  .description-wrap {
    font-size: 1.25rem !important;
  }
  .reveal-external-links.body {
    padding-bottom: 10px !important
  }`)

// Logic
const OBSERVER = new MutationObserver(cope);
const noop = function () { }
var CARDS

function expand() {
    for (let c of CARDS) {
        if (c.expanded || !c.__vue__.media) continue
        try {
            let desc = c.getElementsByClassName("description-wrap")[0]
            desc.innerHTML = c.__vue__.media.description
            c.expanded = true
        } catch {}
        // Hack in YT's js api
        try {
            c.__vue__.media.trailer.id += "?enablejsapi=1&autoplay=1&autohide=1"
        } catch {}
    }
}

function cope(records) {
    if (records.length == 1) return // Ignore noise
    for (let r of records) {
        // Ignore own mods
        if (r.target.className == "description-wrap") return
        // Trailers
        if (r.target.id != "app") { break }
        for (let n of r.addedNodes) {
            if (n.nodeType != Node.ELEMENT_NODE) continue
            if (n.classList.contains("trailer-wrap")) {
                domExist("iframe.video", 100, 5).then(v => {
                    // v.id = "yt-trailer"
                    v.onload = () => {
                        // let listen = JSON.stringify({event: 'listening', id: v.id})
                        // v.contentWindow.postMessage(listen, "*")
                        let speed = JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [PLAYBACK_RATE, true] })
                        v.contentWindow.postMessage(speed, "*")
                    }
                })
                return
            }
        }
    }
    // Newly loaded cards
    expand()
}


// Util
function pause(ms) {
    return new Promise(r => setTimeout(r, ms));
}
// interval in ms, timeout in s
async function domExist(selector, interval, timeout) {
    console.log("checking... ", selector);
    timeout = timeout * (1000 / interval);
    let run = 0;
    while (true && run < timeout) {
        run++;
        let domObj = document.querySelector(selector);
        if (domObj) {
            return domObj;
        }
        await pause(interval);
    }
    throw new Error("Dom search failed");
}

domExist(".chart-view > div:not([class])", 500, 15)
    .then(e => {
        CARDS = e.getElementsByClassName("media-card")
        expand()
        OBSERVER.observe(document.getElementById("app"), { childList: true, subtree: true });
    });

// window.addEventListener('message', function (msgEvt) {
//     console.log(msgEvt);
// });