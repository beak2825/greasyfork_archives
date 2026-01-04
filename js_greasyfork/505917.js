// ==UserScript==
// @name           Forum.Softpedia.Com Show Full Links Toggle
// @name:ro        Forum.Softpedia.Com Comutator Afisare Link-uri Complete/ in Intregime/ pe Deplin
// @author         NWP
// @description    Toggles to showing the full links within the posts by pressing Ctrl + ] for forum.softpedia.com . Press Ctrl + ] again to return to the original content
// @description:ro Comuta pentru a arata link-urile in intregime din postari prin apasarea Ctrl + ] pentru forum.softpedia.com . Apasa Ctrl + ] din nou pentru a reveni la continutul initial
// @namespace      https://greasyfork.org/users/877912
// @version        0.3
// @license        MIT
// @match          https://forum.softpedia.com/topic/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/505917/ForumSoftpediaCom%20Show%20Full%20Links%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/505917/ForumSoftpediaCom%20Show%20Full%20Links%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isExpanded = true;
    let originalContents = new Map();

    function storeOriginalContent() {
        const posts = document.querySelectorAll('div[itemprop="commentText"].post.entry-content');

        posts.forEach((post, index) => {
            if (!originalContents.has(index)) {
                originalContents.set(index, post.innerHTML);
            }
        });
    }

    function expandAndDisplayLinks() {
        const posts = document.querySelectorAll('div[itemprop="commentText"].post.entry-content');

        posts.forEach(post => {
            const links = post.querySelectorAll('a.bbc_url, a[target="_blank"]');

            links.forEach(link => {
                if (link.href && link.textContent) {
                    if (link.href.startsWith('http://<iframe')) {
                        const inaccessibleMessage = document.createTextNode(' (link-ul nu poate fi accesat)');
                        link.parentNode.insertBefore(inaccessibleMessage, link.nextSibling);
                    } else if (link.href === link.textContent || link.textContent.startsWith('http')) {
                        link.textContent = link.href.replace("http:", "https:");
                    } else if (link.rel === 'noopener' || link.target === '_blank' && link.href.includes('softpedia.com')) {
                        const spaceAndBracketOpen = document.createTextNode(' (');
                        const bracketClose = document.createTextNode(')');

                        const fullUrlLink = document.createElement('a');
                        fullUrlLink.href = link.href;
                        fullUrlLink.textContent = link.href.replace("http:", "https:");
                        fullUrlLink.target = '_blank';
                        fullUrlLink.rel = 'noopener';
                        fullUrlLink.title = link.title;
                        fullUrlLink.className = link.className;

                        link.parentNode.insertBefore(spaceAndBracketOpen, link.nextSibling);
                        link.parentNode.insertBefore(fullUrlLink, spaceAndBracketOpen.nextSibling);
                        link.parentNode.insertBefore(bracketClose, fullUrlLink.nextSibling);
                    }
                }
            });
        });
    }

    function revertToOriginalContent() {
        const posts = document.querySelectorAll('div[itemprop="commentText"].post.entry-content');

        posts.forEach((post, index) => {
            if (originalContents.has(index)) {
                post.innerHTML = originalContents.get(index);
            }
        });
    }

    function toggleExpansion() {
        if (isExpanded) {
            revertToOriginalContent();
        } else {
            expandAndDisplayLinks();
        }
        isExpanded = !isExpanded;
    }

    window.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === ']') {
            toggleExpansion();
        }
    });

    storeOriginalContent();
    toggleExpansion();
})();