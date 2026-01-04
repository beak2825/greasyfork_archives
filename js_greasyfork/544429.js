// ==UserScript==
// @name         Bookfusion: Replace all books with Tags List
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces all books section on bookshelf page with a static tag list.  Click all to go to all books.
// @author       typo-ve
// @match        https://www.bookfusion.com/bookshelf*
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/544429/Bookfusion%3A%20Replace%20all%20books%20with%20Tags%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/544429/Bookfusion%3A%20Replace%20all%20books%20with%20Tags%20List.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const htmlString = `
<div class="layout-content-section popular-tags-list">
<div class="tags-list" data-controller="tags-list">
<a class="tags-item is-orange" data-tags-list-target="item" href="/library/books?tags%5B%5D=adventure&list=planned_to_read">adventure</a>
<a class="tags-item is-purple" data-tags-list-target="item" href="/library/books?tags%5B%5D=classics&list=planned_to_read">classics</a>
<a class="tags-item is-green" data-tags-list-target="item" href="/library/books?tags%5B%5D=contemporary&list=planned_to_read">contemporary</a>
<a class="tags-item is-green" data-tags-list-target="item" href="/library/books?tags%5B%5D=crime&list=planned_to_read">crime</a>
<a class="tags-item is-red" data-tags-list-target="item" href="/library/books?tags%5B%5D=horror&list=planned_to_read">horror</a>
<a class="tags-item is-red" data-tags-list-target="item" href="/library/books?tags%5B%5D=humour&list=planned_to_read">humour</a>
<a class="tags-item is-turquoise" data-tags-list-target="item" href="/library/books?tags%5B%5D=mystery&list=planned_to_read">mystery</a>
<a class="tags-item is-turquoise" data-tags-list-target="item" href="/library/books?tags%5B%5D=romance&list=planned_to_read">romance</a>
<a class="tags-item is-purple" data-tags-list-target="item" href="/library/books?tags%5B%5D=science+fiction&list=planned_to_read">science fiction</a>
<a class="tags-item is-purple" data-tags-list-target="item" href="/library/books?tags%5B%5D=suspense&list=planned_to_read">suspense</a>
<a class="tags-item is-purple" data-tags-list-target="item" href="/library/books?tags%5B%5D=thriller&list=planned_to_read">thriller</a>
<a class="tags-item is-yellow" data-tags-list-target="item" href="/library/books?tags%5B%5D=nonfiction&list=planned_to_read">nonfiction</a>
<a class="tags-item is-yellow" data-tags-list-target="item" href="/library/books?tags%5B%5D=technology&list=planned_to_read">technology</a>
</div></div>`;

    function modifyPage() {
        const header = document.querySelector('div.bookshelf-expandable-header');
        if (header) {
            header.innerHTML = htmlString.trim();
        }

        const expandableContent = document.querySelector('div.bookshelf-expandable-content');
        if (expandableContent) {
            expandableContent.remove();
        }

        // Remove "is-active" class from first active bookshelf list item
        // this may be a design mistake, carried over from all page at /library/books
        const activeListItem = document.querySelector('a.bookshelf-lists-item.is-active');
        if (activeListItem) {
            activeListItem.classList.remove('is-active');
        }
    }

    window.addEventListener('load', modifyPage);
})();