// ==UserScript==
// @name         Better Curseforge Legacy/New Switch Button
// @version      2.1
// @description  Instead of the useless home pages, "change to legacy/new site" button now redirects to the current page of the legacy or new site.
// @author       Aichi Chikuwa
// @namespace    AichiChikuwa
// @license      CC BY 4.0
// @match        https://www.curseforge.com/*
// @match        https://legacy.curseforge.com/*
// @downloadURL https://update.greasyfork.org/scripts/497060/Better%20Curseforge%20LegacyNew%20Switch%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/497060/Better%20Curseforge%20LegacyNew%20Switch%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentUrl = window.location.href;
    var newUrl;
    var linkElement;

    if (currentUrl.includes("www.curseforge.com")) {
        newUrl = currentUrl.replace('www', 'legacy');
        if (newUrl.includes("search")) {
            var url = new URL(currentUrl);
            var classParam = url.searchParams.get("class");
            var categoriesParam = url.searchParams.get("categories");
            newUrl = `https://legacy.curseforge.com/minecraft/${classParam}/${categoriesParam}`;
        }

        setTimeout(function() {
            // find the top actions ul element
            var topActionsElement = document.querySelector('ul.top-actions');

            if (topActionsElement) {
                // create new list item
                var newListItem = document.createElement('li');

                // create new link element
                var newLink = document.createElement('a');
                newLink.href = newUrl;
                newLink.className = 'link-btn btn-lined';

                // create image element
                var imgElement = document.createElement('img');
                imgElement.src = "https://static-beta.curseforge.com/images/cf_legacy.png";
                imgElement.alt = "legacy flame";
                imgElement.style.marginRight = "5px";
                imgElement.style.verticalAlign = "middle";

                // append image and text to link
                newLink.appendChild(imgElement);
                newLink.appendChild(document.createTextNode("Go to the Legacy version of this page"));

                // add link to list item
                newListItem.appendChild(newLink);

                // insert list item at the beginning of top actions
                topActionsElement.insertBefore(newListItem, topActionsElement.firstChild);
            }
        }, 500);
    } else {
        newUrl = currentUrl.replace('legacy', 'www');

        setTimeout(function() {
            linkElement = document.querySelector('a.top-nav__nav-link[href="https://www.curseforge.com"]');
            if (linkElement) {
                linkElement.href = newUrl;
                var figureElement = linkElement.querySelector('figure.relative');
                // Check if the figure element is found
                if (figureElement) {
                    linkElement.innerHTML = "";
                    linkElement.appendChild(figureElement);
                    linkElement.appendChild(document.createTextNode("Go to the Modern version of this page"));
                }
            }
        }, 500);
    }

    // function to execute when the URL changes
    function onUrlChange() {
        currentUrl = window.location.href;
        if (currentUrl.includes("www.curseforge.com")) {
            newUrl = currentUrl.replace('www', 'legacy');
            if (newUrl.includes("search")) {
                var url = new URL(currentUrl);
                var classParam = url.searchParams.get("class");
                var categoriesParam = url.searchParams.get("categories");
                if (!categoriesParam) {
                    newUrl = `https://legacy.curseforge.com/minecraft/${classParam}`;
                }
                else {
                    newUrl = `https://legacy.curseforge.com/minecraft/${classParam}/${categoriesParam}`;
                }
            }

            // update link href
            var linkElement = document.querySelector('ul.top-actions li:first-child a');
            if (linkElement) {
                linkElement.href = newUrl;
            }
        } else {
            newUrl = currentUrl.replace('legacy', 'www');

            linkElement = document.querySelector('a.top-nav__nav-link[href="https://www.curseforge.com"]');
            if (linkElement) {
                linkElement.href = newUrl;
                var figureElement = linkElement.querySelector('figure.relative');
                // Check if the figure element is found
                if (figureElement) {
                    linkElement.innerHTML = "";
                    linkElement.appendChild(figureElement);
                    linkElement.appendChild(document.createTextNode("Go to the Modern version of this page"));
                }
            }
        }
    }

    // initial trigger on page load
    onUrlChange();

    // listen for changes to the URL
    window.addEventListener('popstate', onUrlChange);

    // for single-page applications, observe changes to the document body
    const observer = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            onUrlChange();
        }
    });

    currentUrl = window.location.href;
    observer.observe(document.body, { childList: true, subtree: true });

})();