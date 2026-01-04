// ==UserScript==
// @name         Reddit Context
// @namespace    http://srsutherland.dev
// @version      2019.04.08.1a
// @description  Automatically add context to reddit links
// @author       srsutherland
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407164/Reddit%20Context.user.js
// @updateURL https://update.greasyfork.org/scripts/407164/Reddit%20Context.meta.js
// ==/UserScript==

(function() {
    $(document.body).on('mousedown', 'a[href*="/comments"]', (e) => {
        const target = e.target;
        const url = new URL(target.href, location.href);
        const commentRegex = /https?:\/\/(www|old|new)\.reddit\.com\/r\/\w+\/comments\/\w+\/\w+\/\w+\//
        const contextDefault = 5;

        // no need to proceed if depth already exists in the query string
        if (url.searchParams.has('context')) {return};

        if (url.href.match(commentRegex)) {
            url.searchParams.set('context', contextDefault);
            target.removeAttribute('data-inbound-url');
            target.href = url.href;
        }
    });
})();
