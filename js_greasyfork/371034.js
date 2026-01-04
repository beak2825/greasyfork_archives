// ==UserScript==
// @name         [Deprecated] Show Twitter List
// @namespace    https://wiki.gslin.org/wiki/ShowTwitterList
// @version      0.20190530.0
// @description  Show twitter list in title.
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/371034/%5BDeprecated%5D%20Show%20Twitter%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/371034/%5BDeprecated%5D%20Show%20Twitter%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Don't run this script inside iframe.
    if (window !== top) {
        return;
    }

    const url_re = new RegExp('^https://twitter\.com/[^/]+(/media)?$');

    if (!document.location.href.match(url_re)) {
        return;
    }

    let user_id = document.querySelector('.ProfileNav[data-user-id]').getAttribute('data-user-id');
    let url = '/i/' + user_id + '/lists';
    console.debug('Trying to fetch ' + url);

    fetch(url).then(res => {
        return res.json();
    }).then(j => {
        let h = document.createElement('div');
        h.innerHTML = j.html;

        console.debug('Got ' + url, h);

        let c = h.querySelector('.membership-checkbox[checked="checked"]');
        if (!c) {
            return;
        }

        let l = c.parentElement.innerText.trim();
        let title = document.getElementsByTagName('title')[0];
        title.innerHTML = '(' + l + ') ' + title.innerHTML;
    });
})();
