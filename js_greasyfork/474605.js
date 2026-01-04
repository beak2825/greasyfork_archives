// ==UserScript==
// @name         Direct YouTube Description URLs
// @namespace    https://www.jabedmiah.com
// @version      3.4.1
// @description  Changes the masked urls in youtube descriptions to their direct versions.
// @author       Jabed Miah
// @match        *.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @supportURL   https://github.com/miahj1/direct-youtube-description-urls/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474605/Direct%20YouTube%20Description%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/474605/Direct%20YouTube%20Description%20URLs.meta.js
// ==/UserScript==

(new MutationObserver(elementCheck)).observe(document, {childList: true, subtree: true});

function descEventHandler() {
    const descExpanded = document.getElementsByClassName("style-scope ytd-text-inline-expander")[0];
    const allDescUrls = descExpanded.querySelectorAll("a[target='_blank']");

    for (let i = 0; i < allDescUrls.length; i++) {
        if (allDescUrls[i].href === allDescUrls[i].text) { break; }

        allDescUrls[i].href = allDescUrls[i].text = ytUriDecoder(allDescUrls[i].href);
    }
}

function ytUriDecoder(uglyUrl) {
    let directUrl = uglyUrl.split("q=")[1].split("&v")[0];
    return decodeURIComponent(directUrl)
}

function elementCheck(changes, observer) {
    const desc = document.getElementsByClassName("item style-scope ytd-watch-metadata")[2];

    if (desc) {
        ["click", "mouseenter"].forEach((event) => {
            desc.addEventListener(event, descEventHandler);
        });

        observer.disconnect();
    }
}