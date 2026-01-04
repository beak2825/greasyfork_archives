// ==UserScript==
// @name         Danbooru Tags Extractor
// @namespace    https://ns.imgg.dev/userscripts/danbooru-tags-extractor
// @version      0.1
// @description  Generate comma-separated tags from danbooru tags. Useful for image generations.
// @author       You
// @match        https://danbooru.donmai.us/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541854/Danbooru%20Tags%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/541854/Danbooru%20Tags%20Extractor.meta.js
// ==/UserScript==

function extract() {
    const tags = [
        { category: "general", tags: Array.from(document.querySelector('ul.general-tag-list').querySelectorAll('a.search-tag')).map(el => el.innerText) },
        { category: "copyright", tags: document.querySelector('ul.copyright-tag-list') ? Array.from(document.querySelector('ul.copyright-tag-list').querySelectorAll('a.search-tag')).map(el => el.innerText) : [] },
        { category: "character", tags: document.querySelector('ul.character-tag-list') ? Array.from(document.querySelector('ul.character-tag-list').querySelectorAll('a.search-tag')).map(el => el.innerText) : [] },
        { category: "ip", tags: Array.from(document.querySelector('ul.copyright-tag-list').querySelectorAll('a.search-tag')).map(el => el.innerText) },
        { category: "meta", tags: Array.from(document.querySelector('ul.meta-tag-list').querySelectorAll('a.search-tag')).map(el => el.innerText) }
    ]

    return tags
}

(function() {
    'use strict';

    const text = extract().flatMap(el => el.tags).map(el => el.replace("(", "\\(").replace(")", "\\)")).join(', ')

    const content = document.querySelector('#content')

    const notice = document.createElement('div')
    notice.className = "notice notice-small post-notice post-notice-resized"
    notice.style.background = "var(--note-highlight-color)";
    notice.style.display = "flex";
    notice.style.flexDirection = "column";

    notice.innerHTML = `<div style="display:flex;gap:0.5rem;align-items:center"><h6>Extracted Prompt</h6><button onclick="navigator.clipboard.writeText('${text}');this.innerText='Copied';this.style.background='var(--green-3)'">Copy</button></div><textarea readonly rows="4">${text}</textarea>`

    content.prepend(notice)
})();