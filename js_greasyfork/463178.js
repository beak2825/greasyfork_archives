// ==UserScript==
// @name         [Deprecated] Kanka Gallery Alphabetical Sort
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Sorts folders and images alphabetically in the Kanka Gallery, keeping folders first.
// @author       Salvatos
// @license      MIT
// @match        https://app.kanka.io/*/gallery*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @downloadURL https://update.greasyfork.org/scripts/463178/%5BDeprecated%5D%20Kanka%20Gallery%20Alphabetical%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/463178/%5BDeprecated%5D%20Kanka%20Gallery%20Alphabetical%20Sort.meta.js
// ==/UserScript==

// Gallery items are loaded in asynchronously, so wait until they appear on the page
observeGallery();

function observeGallery(prev) {
    let observer = new MutationObserver(function(mutations) {
        // Keep watching if only the "loading" temp div is in place
        if (!document.querySelector("#gallery > div > div:nth-child(3).text-center")) {
            observer.disconnect();
            var b = Date.now();
            sortList(b, prev);
        }
    });
    observer.observe(document.getElementById("gallery"), {attributes: false, childList: true, characterData: false, subtree: true});
}

function sortList(b, prev) {
    /* Give the info tile a title so it can be included in the sort */
    document.querySelector("#gallery div.grid > div:has(i.fa-image)").setAttribute("title", "_Info");

	/* To keep folders and images grouped, we prepend to their titles a keyword that will conveniently put folders first alphabetically (skipping those we've already processed in the case of a search's "load more" operation) */
	var folders = document.querySelectorAll("#gallery div.grid > div:has(.md\\\:h-32:not(.cover-background):not([title]))");
	var images = document.querySelectorAll("#gallery div.grid > div:has(:is(.w-full.h-20.md\\\:h-32, .h-16.cover-background)):not([title])");

    // We also add a timestamp so that when pressing "Load more" on a search with many results, each new batch is only sorted internally rather than re-sorting everything and losing track of the new results
	folders.forEach((child) => child.setAttribute("title", "Folders_" + b + ": " + child.querySelector(".grow.truncate").innerText));
	images.forEach((child) => child.setAttribute("title", "Images_" + b + ": " + child.querySelector(".grow.truncate").innerText));

	/* Sort tiles by title */
    var thumbs = document.querySelector("#gallery div.grid");
    [...thumbs.children]
        .sort((a, b) => a.getAttribute("title").localeCompare(b.getAttribute("title")))
        .forEach(el => thumbs.appendChild(el));

    // Create an anchor on the last result to scroll back to when "Load more" is clicked
    document.querySelector("#gallery div.grid > :nth-last-child(2)").id = b;

    if (prev) {
        location.hash = "#" + prev;
    }

    /* Restart the observer to catch navigation between folders */
    observeGallery(b);
}