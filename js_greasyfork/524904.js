// ==UserScript==
// @name         My Merge Requests Gitlab
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  Show Link to opened Merge Requests created by user
// @author       0w0miki
// @license      MIT
// @match        https://gitlab.com/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/524904/My%20Merge%20Requests%20Gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/524904/My%20Merge%20Requests%20Gitlab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function $(selector) {
        return document.querySelector(selector);
    }

    function addCreateMrButton(list) {
        let buttonHtml = list.children[0].outerHTML;
        buttonHtml = buttonHtml.replace('assignee_username', 'scope=all&state=opened&author_username');
        buttonHtml = buttonHtml.replace('merge_requests_assigned', 'merge_requests_created');
        buttonHtml = buttonHtml.replaceAll('Assigned', 'Created');
        list.insertAdjacentHTML('beforeend', buttonHtml);
    }

    function updateCreateMRCount(count) {
        document.querySelectorAll('a[data-track-label="merge_requests_created"] span.badge').forEach(node => {
            node.textContent = count;
        });
        $('button[data-track-label="merge_requests_menu"] span').textContent = Number(totalMr) + Number(count);
    }

    const totalMr = Number($('button[data-track-label="merge_requests_menu"] span').textContent);
    const lastMrCount = GM_getValue("open_mr_count") || 0;

    const my_mr_url = $('a[data-track-label="merge_requests_assigned"]').href.replace('assignee_username', 'scope=all&state=opened&author_username');
    const mrList = document.querySelectorAll('ul :has(>li [data-track-label*="merge_requests"])');
    mrList.forEach(list => {
        addCreateMrButton(list);
    });
    updateCreateMRCount(lastMrCount);

    fetch(my_mr_url)
    .then(response => response.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const open_mr_count = doc.querySelector('a#state-opened > span.badge').textContent;
        updateCreateMRCount(open_mr_count);
        GM_setValue("open_mr_count", open_mr_count);
    });
})();
