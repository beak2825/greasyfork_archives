// ==UserScript==
// @name         Fanfiction.net: Not-Crossover Link
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      1.9
// @license      MIT
// @description  Add link to not-Crossover page to Fanfiction.net.
// @author       Vannius
// @match        https://www.fanfiction.net/crossovers/*
// @match        https://www.fanfiction.net/*Crossovers/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanfiction.net
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/36590/Fanfictionnet%3A%20Not-Crossover%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/36590/Fanfictionnet%3A%20Not-Crossover%20Link.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Config
    const OPEN_IN_NEW_TAB = true;

    // Functions
    // Replace and delete prohibited characters.
    function deleteProhibitedCharacter (text) {
        return text.replace(/('\. |\/| & | - | + )+/g, ' ').replace(/[.,+!:;|☆★！？]+/g, '');
    }

    // Return imgTag with click event
    function addClickToNotCrossover (imgTag, url) {
        imgTag.addEventListener('click', function (e) {
            e.preventDefault();
            // eslint-disable-next-line no-undef
            fetch(url, { method: 'GET', mode: 'same-origin', cache: 'default' })
                .then(response => response.text())
                .then(body => {
                    const doc = document.implementation.createHTMLDocument('myBody');
                    doc.documentElement.innerHTML = body;
                    const content = doc.getElementById('content_wrapper_inner');

                    const list = content.getElementsByClassName('z-list');

                    let destination = '';
                    if (list.length) destination = url; // Bingo.

                    const candidates = content.querySelectorAll('.gui_normal a');
                    if (candidates.length === 1) {
                        destination = candidates[0].href; // Only candidate.
                    } else if (candidates.length > 1) {
                        destination = url; // Suggestion page. There can be several candidates for same fandom.
                    }

                    // Move to Not-Crossover page.
                    if (OPEN_IN_NEW_TAB) {
                        // eslint-disable-next-line no-undef
                        GM_openInTab(destination);
                    } else {
                        window.location.href = destination;
                    }
                }).catch(error => console.log(error));
        });
        return imgTag;
    }

    // Main
    const splitPath = window.location.href.split('/');

    if (/^.+[-_]Crossovers$/.test(splitPath[3]) && splitPath[5] !== '0') {
        // Crossover page of two specific fandoms
        // Scrape each fandom link
        const divTag = document.getElementById('content_wrapper_inner');
        const titleTags = [divTag.children[1], divTag.children[2]];

        for (let titleTag of titleTags) {
            // Make joinTitle by replacing and deleting prohibited symbols
            const joinedTitle = deleteProhibitedCharacter(titleTag.textContent).split(' ').join('-');
            const url = [window.location.origin, 'anime', joinedTitle, ''].join('/');

            // Make link to Not-Crossover
            const imgTag = document.querySelector('#content_wrapper_inner > img');
            const addImgTag = addClickToNotCrossover(imgTag.cloneNode(false), url);
            addImgTag.title = "Not-Crossover";
            addImgTag.style.transform = "scale(-1, 1)";

            // Add link and place adjustment
            const fragment = document.createDocumentFragment();
            fragment.appendChild(addImgTag);
            fragment.appendChild(document.createTextNode(' '));
            imgTag.parentNode.insertBefore(fragment, titleTag);
        }
    } else {
        // Crossover page of one specific fandom
        // Make title and url by splitPath[4] or splitPath[3]
        const title = (splitPath[3] === 'crossovers') ? splitPath[4] : splitPath[3].slice(0, -"-Crossovers".length);
        const url = [window.location.origin, 'anime', title, ''].join('/');

        // Make link to Not-Crossover
        const imgTag = document.querySelector('#content_wrapper_inner > img');
        const addImgTag = addClickToNotCrossover(imgTag.cloneNode(false), url);
        addImgTag.title = "Not-Crossover";
        addImgTag.style.transform = "scale(-1, 1)";

        // Add link and place adjustment
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode(' '));
        fragment.appendChild(addImgTag);
        imgTag.parentNode.insertBefore(fragment, imgTag.nextSibling);

        // Crossover page of one specific fandom and all fandoms
        if (splitPath[5] === '0') {
            splitPath.pop();
            splitPath[6] = '';
            splitPath[5] = splitPath[4];
            splitPath[4] = splitPath[3].slice(0, -"-Crossovers".length);
            splitPath[3] = 'crossovers';
            const selectFandomLink = splitPath.join('/');

            const textNodeTag = document.querySelector('#content_wrapper_inner > img + img').nextSibling;
            const splitText = textNodeTag.textContent.split(/(\n\s+)/g);
            const splitFandomText = splitText.filter(x => /\w/.test(x) && x !== 'Crossovers')[0];
            const selectFandomLinkTag = document.createElement('a');
            selectFandomLinkTag.href = selectFandomLink;
            selectFandomLinkTag.textContent = splitFandomText;

            const fragment = document.createDocumentFragment();
            splitText.filter(x => x).forEach(x => {
                if (/\w/.test(x) && x !== 'Crossovers') {
                    fragment.appendChild(selectFandomLinkTag);
                } else {
                    fragment.appendChild(document.createTextNode(x));
                }
            });
            textNodeTag.parentNode.replaceChild(fragment, textNodeTag);
        }
    }
})();
