// ==UserScript==
// @name Imgur Archivist
// @namespace https://reddit.com/u/VladVV/
// @version 0.12
// @description Checks whether dead Imgur links and images are archived and replaces them.
// @author /u/VladVV
// @match *://*/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=archive.org
// @grant none
// @license EUPL v1.2
// @downloadURL https://update.greasyfork.org/scripts/472506/Imgur%20Archivist.user.js
// @updateURL https://update.greasyfork.org/scripts/472506/Imgur%20Archivist.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration options for the script:
    const scriptConfig = {
        DOMElements: {
            // Any DOM element can be added in the format 'tagName' : 'attribute'
            // The attribute will be treated as a URL and replaced with archived URLs
            'A' : 'href',
            'IMG' : 'src'
        },
        archiveIcon: '', //TODO: implement little icon to display inside archived elements
        linkTooltips: {
            // Tooltips when hovering over links. Set to a blank string ("") for nothing.
            available: "Archived image available. (Imgur link is dead)",
            unavailable: "No archived image available. (Imgur link is dead)"
        },
        changeLinkStyleOnHover: true, // Archived links will become green/red; set to false to disable
    };

    // A dictionary to store the dead Imgur URLs and their archived versions
    var imgurArchive = {};

    // A function to check if an Imgur URL is dead or alive
    function checkImgurURL(url) {
        // Force HTTPS to prevent cross-domain request issues
        url = url.replace('http://','https://');
        if (url in imgurArchive) return; //Abort if url has already been checked
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', url);
        xhr.onreadystatechange = function () {
            if (this.readyState === this.DONE) {
                if (this.responseURL.indexOf('removed.png') !== -1 || this.status === 404) {
                    // Imgur image is removed or deleted
                    // Setup a GET request to the archive.org API
                    var archiveUrl = 'https://archive.org/wayback/available?url=' + url;
                    var archiveXhr = new XMLHttpRequest();
                    archiveXhr.open('GET', archiveUrl);
                    archiveXhr.onreadystatechange = function () {
                        if (this.readyState === this.DONE) {
                            var response = JSON.parse(this.responseText);
                            if (response.archived_snapshots.closest) {
                                // Archived image found
                                // Add the dead link and the archived link to the dictionary
                                imgurArchive[url] = response.archived_snapshots.closest.url;
                            } else {
                                // The removed image is not archived :(
                                imgurArchive[url] = false;
                            }
                        }
                    };
                    archiveXhr.send();
                } else {
                    // Imgur image is live; our services aren't needed.
                    imgurArchive[url] = true;
                }
            }
        };
        xhr.send();
    }


    const archive_org_re = /^(?:https?:\/\/)?(?:web\.archive\.org\/web\/\d+\/)/
    // A function to replace an Imgur link with its archived version if it exists in the dictionary
    function replaceImgurLink(link) {
        var url = link.href.replace(archive_org_re, '');
        if (url in imgurArchive) {
            if (imgurArchive[url] !== true && imgurArchive[url] !== false) {
                // Set archive link if not already set
                if (url in imgurArchive) link.setAttribute('href', imgurArchive[url]);

                if (scriptConfig.changeLinkStyleOnHover) {
                    // Save old element attributes to be restored
                    let old_style = link.style; let old_title = link.title;

                    // Set temporary element attributes
                    link.style.color = 'green';
                    link.style.outline = 'thin dotted green';
                    link.title = scriptConfig.linkTooltips.available;

                    // Add event listener to restore old element attributes
                    link.addEventListener('mouseleave', function () {
                        link.style = old_style; link.title = old_title;
                    }, { once: true });
                }
            } else if (imgurArchive[url] === false && scriptConfig.changeLinkStyleOnHover) {
                // Save old element attributes to be restored
                let old_style = link.style; let old_title = link.title;

                // Set temporary element attributes
                link.style.color = 'red';
                link.style.outline = 'thin dotted red';
                link.title = scriptConfig.linkTooltips.unavailable;

                // Add event listener to restore old element attributes
                link.addEventListener('mouseleave', function () {
                    link.style = old_style; link.title = old_title;
                }, { once: true });
            }
        }
    }

    // A list of elements that have already been processed (for dynamic content loading)
    var processed_elements = {};
    function updateURLs() {
        // Get all the relevant elements in the document
        var elements = {};
        for (let el in scriptConfig.DOMElements) {
            elements[el] = Array.from(document.getElementsByTagName(el));
        }
        //var links = Array.from(document.getElementsByTagName('a'));

        // Filter out link tags that have already been processed
        if (processed_elements !== {}) {
            for (let el in elements) {
                for (let i = 0; i < elements[el].length; i++) {
                    if (elements[el][i] in processed_elements) {
                        elements[el].splice(i, 1);
                    } else {
                        if (!processed_elements[el]) processed_elements[el] = [];
                        processed_elements[el].push(elements[el][i]);
                    }
                }
            }
        } else {
            processed_elements = elements;
        }

        // Loop through the elements and check if they are associated with Imgur links
        for (let el in elements) {
            for (let i = 0; i < elements[el].length; i++) {
                let elementURL = elements[el][i][scriptConfig.DOMElements[el]];
                if (elementURL.indexOf('imgur') !== -1 && elementURL.indexOf('archive.org') === -1) {
                    checkImgurURL(elementURL);
                    if (elementURL in imgurArchive) {
                        elements[el][i].setAttribute(scriptConfig.DOMElements[el], imgurArchive[elementURL]);
                    }
                }
            }
        }
    }
    updateURLs();

    // Create an observer instance to respond to new content loaded dynamically by the page
    var observer = new MutationObserver (function (mutations) {
        mutations.forEach (function (mutation) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach (function (node) {
                    var elements = {};
                    if (node.tagName in scriptConfig.DOMElements) {
                        elements[node.tagName] = [node];
                    } else if (node.childNodes && String(node) !== '[object Text]') {
                        for (let el in scriptConfig.DOMElements) {
                            elements[el] = node.querySelectorAll(el);
                        }
                    } else return;
                    for (let el in elements) {
                        for (let i = 0; i < elements[el].length; i++) {
                            let elementURL = elements[el][i][scriptConfig.DOMElements[el]].replace('http://','https://');
                            if (elementURL.indexOf('imgur') !== -1 && elementURL.indexOf('archive.org') === -1) {
                                checkImgurURL(elementURL);
                                if (elementURL in imgurArchive) {
                                    elements[el][i].setAttribute(scriptConfig.DOMElements[el], imgurArchive[elementURL]);
                                }
                                if (!processed_elements[el]) processed_elements[el] = [];
                                processed_elements[el].push(elements[el][i]);
                            }
                        }
                    }
                });
            }
        });
    });
    observer.observe(document.documentElement || document.body, {childList: true, subtree: true});

    // Add an event listener to the whole document that waits for hovers on links
    document.addEventListener('mouseover', function (event) {
        // Get the target element of the hover event
        var target = event.target;
        //Traverse the DOM tree until we find a link (or not)
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
        }
        // If a link is found, replace it with its archived version if possible
        if (target) {
            replaceImgurLink(target);
        }
    });
})();
