// ==UserScript==
// @name         [AO3] Bookmark links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Create a bookmark link button at the bottom of every bookmark full blurb
// @grant        none
// @license      MIT
// @match        *://*.archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/468417/%5BAO3%5D%20Bookmark%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/468417/%5BAO3%5D%20Bookmark%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.match('/users/') && document.querySelectorAll('li.bookmark.blurb').length) {
        for (const b of document.querySelectorAll('li.bookmark.blurb')) {
            if (!b.querySelectorAll('.actions[role="navigation"]').length) {
                let ul = document.createElement('ul')
                ul.className = 'actions'
                ul.setAttribute('role','navigation')
                b.appendChild(ul)
            }

            let ul = b.querySelector('.actions[role="navigation"]'),
                li = document.createElement('li'),
                a = document.createElement('a')

            a.textContent = 'Link'
            a.href = '/bookmarks/' + b.id.split('_')[1]

            li.appendChild(a)
            ul.appendChild(li)
            b.appendChild(ul)
        }
    }
})();