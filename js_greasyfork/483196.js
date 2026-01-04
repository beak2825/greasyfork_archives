// ==UserScript==
// @name         Remove Reddit Collectible Expression Message
// @namespace    http://tampermonkey.net/
// @version      2023-12-27.1
// @description  Removes the annoying Collectible Expression message that is displayed to old.reddit users.
// @author       Infi
// @match        https://www.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483196/Remove%20Reddit%20Collectible%20Expression%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/483196/Remove%20Reddit%20Collectible%20Expression%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var searchText = 'This comment contains a Collectible Expression, which are not available on old Reddit.';
    var comments = document.getElementsByClassName('usertext-body');

    for (var comment of comments) {
        var texts = comment.querySelectorAll('.md > p');

        for (var text of texts) {
            if (text.textContent.includes(searchText)) {
                text.textContent = text.textContent.replace(searchText, '');
            }
        }
    }
})();