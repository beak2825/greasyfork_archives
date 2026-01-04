// ==UserScript==
// @name         Reddit - Fix Other Discussions
// @namespace    jl
// @version      2024.1
// @description  Link other discussions to search
// @author       jl
// @match        *://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496148/Reddit%20-%20Fix%20Other%20Discussions.user.js
// @updateURL https://update.greasyfork.org/scripts/496148/Reddit%20-%20Fix%20Other%20Discussions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const dupeLink = document.evaluate("//a[contains(.,'other discussions')]",document,null,XPathResult.ANY_TYPE,null).iterateNext();
    if(dupeLink){
        const url = document.evaluate("//a[@data-event-action='title']",document,null,XPathResult.ANY_TYPE,null).iterateNext().href;
        dupeLink.href = "https://www.reddit.com/submit?url=" + encodeURI(url);
    }


})();