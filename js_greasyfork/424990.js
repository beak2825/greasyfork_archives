// ==UserScript==
// @name         OFans.party IPFS gateway replacer
// @namespace    https://greasyfork.org/users/390979-parliament
// @description  Replaces the currently-broken IPFS gateway used by ofans.party with a different, working one.
// @version      0.1
// @author       parliament
// @match        https://ofans.party/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/424990/OFansparty%20IPFS%20gateway%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/424990/OFansparty%20IPFS%20gateway%20replacer.meta.js
// ==/UserScript==

'use strict';

function replaceAllUris() {
    let links = document.getElementsByTagName("a");
    let images = document.getElementsByTagName("img");

    for (let link of links) {
        let uri = link.getAttribute("href");
        let fixedUri = uri.replace(/ipfs\.greyh\.at/, "ninetailed.ninja");
        link.setAttribute("href", fixedUri);
    }

    for (let image of images) {
        let uri = image.getAttribute("src");
        let fixedUri = uri.replace(/ipfs\.greyh\.at/, "ninetailed.ninja");
        image.setAttribute("src", fixedUri);

        console.log("Old URI: " + uri);
        console.log("New URI: " + fixedUri);
    }
}

var lastTimeout;
let observer = new MutationObserver((changes, observer) => {
    if (lastTimeout !== undefined) {
        window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(replaceAllUris, 200);
});
observer.observe(document, {childList: true, subtree: true});