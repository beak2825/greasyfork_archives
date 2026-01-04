// ==UserScript==
// @name         Internet Archive: Shallow Collections
// @namespace    http://tampermonkey.net/
// @version      2025-05-19
// @description  Redirects from IA collections detail pages to a search for immediate descendants, instead of all recursive descendants.
// @author       aschmitz
// @license      CC0
// @match        https://archive.org/details/*
// @exclude      https://archive.org/details/@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archive.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536170/Internet%20Archive%3A%20Shallow%20Collections.user.js
// @updateURL https://update.greasyfork.org/scripts/536170/Internet%20Archive%3A%20Shallow%20Collections.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // If you want to load a collection with the default view, visit a URL like
    // /details/magazine_rack?full
    if (document.body.querySelectorAll('app-root')[0]?.shadowRoot?.querySelectorAll('collection-page') &&
        !location.search) {
      document.location.href = `${location.pathname}?tab=collection&query=primary_collection%3A${encodeURI(location.pathname.slice(9))}`
    }
})();
