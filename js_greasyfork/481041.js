// ==UserScript==
// @name         Suppress YouTube seconds links
// @namespace    http://tampermonkey.net/
// @description  When opening a video from a playlist, strip out the parameters that make it start at a time
// @license MIT
// @author       Igor Makarov
// @match        *://*.youtube.com/playlist*
// @match        *://*.youtube.com/feed/history*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @version 0.0.1.20241227113853
// @downloadURL https://update.greasyfork.org/scripts/481041/Suppress%20YouTube%20seconds%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/481041/Suppress%20YouTube%20seconds%20links.meta.js
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
        if (url.searchParams && url.searchParams.has('t')) {
            url.searchParams.delete('t');
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

