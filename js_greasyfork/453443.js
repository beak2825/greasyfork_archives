// ==UserScript==
// @name         Danbooru Tag Copier
// @namespace    https://greasyfork.org/en/scripts/453443-danbooru-tag-copier
// @version      0.3
// @description  Automatically copy all general tags from danbooru page to your clipboard
// @author       watzon
// @match        https://danbooru.donmai.us/posts/*
// @match        https://booru.allthefallen.moe/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453443/Danbooru%20Tag%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/453443/Danbooru%20Tag%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const copyEmoji = '📋';

    const artistsHeader = document.querySelectorAll('h3.artist-tag-list')[0]
    const copyrightHeader = document.querySelectorAll('h3.copyright-tag-list')[0]
    const characterHeader = document.querySelectorAll('h3.character-tag-list')[0]
    const generalHeader = document.querySelectorAll('h3.general-tag-list')[0]
    const metaHeader = document.querySelectorAll('h3.meta-tag-list')[0]

    const artistsList = document.querySelectorAll('ul.artist-tag-list > li')
    const copyrightList = document.querySelectorAll('ul.copyright-tag-list > li')
    const characterList = document.querySelectorAll('ul.character-tag-list > li')
    const generalList = document.querySelectorAll('ul.general-tag-list > li')
    const metaList = document.querySelectorAll('ul.meta-tag-list > li')

    const copyTags = (list) => {
        console.log(list);
        const tags = Array.from(list).map((li) => li.getAttribute('data-tag-name'));
        const taglist = tags.join(', ');
        console.log(taglist);

        if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return window.clipboardData.setData("Text", taglist);

        }

        else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = taglist;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy"); // Security exception may be thrown by some browsers.
            }
            catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return prompt("Copy to clipboard: Ctrl+C, Enter", taglist);
            }
            finally {
                document.body.removeChild(textarea);
            }
        }
    }

    const lists = [
        [artistsHeader, artistsList],
        [copyrightHeader, copyrightList],
        [characterHeader, characterList],
        [generalHeader, generalList],
        [metaHeader, metaList],
    ];

    for (const [header, list] of lists) {
        if (!header || !list) continue;
        const button = document.createElement('button');
        button.onclick = () => copyTags(list);
        button.innerHTML = copyEmoji;
        button.setAttribute('type', 'button');
        button.setAttribute('title', 'Copy tags to clipboard');
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.padding = '0 4px';
        header.appendChild(button);
    }
})();