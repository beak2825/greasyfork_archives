// ==UserScript==
// @name         ResetEra Remove Unread from URL - Unread link in the line under
// @version      1.0
// @description  Removes /unread from the threads' links and adds a "unread" button underneath
// @author       Lordmau5
// @match        https://*.resetera.com/forums/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1117666
// @downloadURL https://update.greasyfork.org/scripts/470014/ResetEra%20Remove%20Unread%20from%20URL%20-%20Unread%20link%20in%20the%20line%20under.user.js
// @updateURL https://update.greasyfork.org/scripts/470014/ResetEra%20Remove%20Unread%20from%20URL%20-%20Unread%20link%20in%20the%20line%20under.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let attempts = 0;

    function tryBustUnread() {
        let cells = document.querySelectorAll('.structItem-cell.structItem-cell--main');
        if (cells.length > 0) {
            cells.forEach(e => {
                let title = e.querySelector('.structItem-title > a:not(.labelLink)');
                let minor = e.querySelector('.structItem-minor > .structItem-parts');

                let url = title.href;
                if (url.includes('/unread')) {
                    title.href = url.replace('/unread', '/');

                    let node = document.createElement('li');
                    let link_node = document.createElement('a');
                    let link_text = document.createTextNode('Unread');
                    link_node.appendChild(link_text);
                    link_node.title = 'Unread';
                    link_node.href = url;
                    node.appendChild(link_node);
                    minor.appendChild(node);
                }
            });
        } else {
            if (attempts++ < 10) {
                setTimeout(tryBustUnread, 250);
            }
        }
    }

    setTimeout(tryBustUnread, 250);
})();