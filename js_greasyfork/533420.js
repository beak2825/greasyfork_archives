// ==UserScript==
// @name         Copy Github PR/Issue Title
// @namespace    http://tampermonkey.net/
// @version      2025-07-27
// @description  Add "copy Github PR title or issue title" button
// @author       You
// @match        https://github.com/*/pull/*
// @match        https://github.com/*/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533420/Copy%20Github%20PRIssue%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/533420/Copy%20Github%20PRIssue%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const title_selector = "bdi.markdown-title"
    const copy_svg = (title) => `<clipboard-copy aria-label="Copy" data-copy-feedback="Copied!" value="${title}" data-view-component="true" class="Link--onHover js-copy-branch color-fg-muted d-inline-block ml-1" tabindex="0" role="button">
      <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="#a8a095"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
</clipboard-copy>`
    const h1_selector = `h1:has(${title_selector})`
    const append_copy_button = () => {
        const h1 = document.querySelector(h1_selector)
        const title = h1.querySelector(title_selector).innerText
        h1.insertAdjacentHTML("afterbegin", copy_svg(title))
    }
    append_copy_button()
})();