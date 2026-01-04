// ==UserScript==
// @name         Suppress YouTube Playlist links
// @namespace    http://tampermonkey.net/
// @description  When opening a video from a playlist, strip out the parameters that make it open in a playlist UI
// @license MIT
// @author       Igor Makarov
// @match        *://*.youtube.com/playlist*
// @match        *://*.youtube.com/feed/history*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @version 0.0.1.20241227113632
// @downloadURL https://update.greasyfork.org/scripts/435502/Suppress%20YouTube%20Playlist%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/435502/Suppress%20YouTube%20Playlist%20links.meta.js
// ==/UserScript==

var hrefsCount = 0;
function modifyLinks() {
    let hrefs = document.querySelectorAll('a');
    if (hrefs.length == hrefsCount) {
        return;
    }
    hrefsCount = hrefs.length;
    hrefs.forEach(link => {
        let href = link.href
        if (!href) {
            return;
        }
        // console.log(`href: ${href}`);
        let url = new URL(href, document.location);
        if (url.searchParams && url.searchParams.has('list')) {
            url.searchParams.delete('list');
        }
        if (url.searchParams && url.searchParams.has('index')) {
            url.searchParams.delete('index');
        }
        if (url.searchParams && url.searchParams.has('pp')) {
            url.searchParams.delete('pp');
        }
        link.href = url
        // console.log(`url: ${url}`);
    });
}

document.addEventListener('DOMContentLoaded', modifyLinks)
let observer = new MutationObserver(e => { modifyLinks() })
observer.observe(document, {
    subtree: true,
    //attributes: true,
    //characterData: true,
    childList: true
})

