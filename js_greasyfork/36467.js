// ==UserScript==
// @name         AO3: Links to Last Chapter and Entire Works
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      2.1
// @license      MIT
// @description  Add links to last chapter and entire works right after title of story.
// @author       Vannius
// @match        https://archiveofourown.org/*
// @exclude      /^https:\/\/archiveofourown\.org\/(collections\/[^/]+\/)?works\/\d+/
// @exclude      /^https:\/\/archiveofourown\.org\/collections$/
// @exclude      /^https:\/\/archiveofourown\.org\/collections(\?.+)$/
// @downloadURL https://update.greasyfork.org/scripts/36467/AO3%3A%20Links%20to%20Last%20Chapter%20and%20Entire%20Works.user.js
// @updateURL https://update.greasyfork.org/scripts/36467/AO3%3A%20Links%20to%20Last%20Chapter%20and%20Entire%20Works.meta.js
// ==/UserScript==

(function () {
    // Main
    const articles = document.getElementsByClassName('blurb');
    for (let article of articles) {
        // Scrape each article
        const headerTag = article.getElementsByClassName('header module')[0];
        if (headerTag.className === "mystery header picture module") {
            continue;
        }
        const titleTag = headerTag.firstElementChild.firstElementChild;
        const series = titleTag.href.indexOf("/series/") !== -1;

        // When article isn't series page
        if (!series) {
            // Get last chapter
            const lastChapter = article.querySelector('dl .chapters > a');

            // When lastChapter is a link
            if (lastChapter) {
                // Get href
                const splitedHref = titleTag.href.split('/');
                const href = splitedHref[3] === 'collections'
                    ? splitedHref.slice(0, 3).concat(splitedHref.slice(5)).join('/') : titleTag.href;

                // Make link to entire contents
                const entireLink = document.createElement('a');
                entireLink.href = href + "?view_full_work=true";
                entireLink.title = "Entire Contents";
                entireLink.appendChild(document.createTextNode('E'));

                // Make link button to last chapter.
                const lastLink = document.createElement('a');
                lastLink.href = lastChapter.href;
                lastLink.title = "Last Chapter";
                lastLink.appendChild(document.createTextNode('L'));

                // Add link to entire contents and link button to last chapter right after title of story.
                const fragment = document.createDocumentFragment();
                fragment.appendChild(document.createTextNode(' '));
                fragment.appendChild(entireLink);
                fragment.appendChild(document.createTextNode(' '));
                fragment.appendChild(lastLink);

                titleTag.parentNode.insertBefore(fragment, titleTag.nextSibling);
            }
        }
    }
})();