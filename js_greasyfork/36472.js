// ==UserScript==
// @name         Fanfiction.net: Links to First and Last Chapter
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      1.2
// @license      MIT
// @description  Add links to first and last chapter to Fanfiction.net.
// @author       Vannius
// @match        https://www.fanfiction.net/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36472/Fanfictionnet%3A%20Links%20to%20First%20and%20Last%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/36472/Fanfictionnet%3A%20Links%20to%20First%20and%20Last%20Chapter.meta.js
// ==/UserScript==

(function() {
    // Only multi-chapter story has <SELECT> tags.
    const chapSelectTags = document.getElementsByTagName('SELECT');
    if (!chapSelectTags.length) return;

    // Get data to make links
    const baseUrl = window.location.href.split('/').slice(0, 5).join('/');
    const title = window.location.href.split('/')[6];
    const chapter = Number(window.location.href.split('/')[5]);
    const lastChapter = chapSelectTags[0][chapSelectTags[0].length - 1].value;

    // When current chapter > 2, add link to first chapter.
    if (chapter > 2) {
        for (let i = 0; i < chapSelectTags.length; i++) {
            // Make firstBtn to frist chapter
            const firstBtn = document.createElement('BUTTON');
            firstBtn.className = 'btn';
            firstBtn.type = 'BUTTON';
            firstBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = [baseUrl, 1, title].join('/');
            });
            firstBtn.appendChild(document.createTextNode('« First'));

            // Add firstBtn
            const fragment = document.createDocumentFragment();
            fragment.appendChild(firstBtn);
            fragment.appendChild(document.createTextNode(' '));
            chapSelectTags[i].parentNode.insertBefore(fragment, chapSelectTags[i].previousElementSibling);
        }
    }
    // When current chapter < lastChapter - 1, add link to last chapter.
    if (chapter < lastChapter - 1) {
        for (let i = 0; i < chapSelectTags.length; i++) {
            // Make lastBtn to last chapter
            const lastBtn = document.createElement('BUTTON');
            lastBtn.className = 'btn';
            lastBtn.type = 'BUTTON';
            lastBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = [baseUrl, lastChapter, title].join('/');
            });
            lastBtn.appendChild(document.createTextNode('Last ≫'));

            // Add lastBtn
            const fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode(' '));
            fragment.appendChild(lastBtn);
            chapSelectTags[i].parentNode.appendChild(fragment);
        }
    }
})();