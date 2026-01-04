// ==UserScript==
// @name         PoE2DB English Language Enforcer
// @namespace    https://greasyfork.org/users/rafagale
// @version      1.0.1
// @description  Enforces English content on the PoE2DB website via URL.
// @author       rafagale
// @match        https://poe2db.tw/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524625/PoE2DB%20English%20Language%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/524625/PoE2DB%20English%20Language%20Enforcer.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const DEFAULT_LANGUAGE_PREFIX = 'us';

    const getSegments = (url) => url.pathname.split('/').filter(Boolean);
    const hasLanguagePrefix = (segments) => /^[a-z]{2}$/i.test(segments[0]);

    const enforceLanguagePrefix = () => {
        const url = new URL(window.location.href);
        const segments = getSegments(url);

        if (hasLanguagePrefix(segments)) {
            if (segments[0] === DEFAULT_LANGUAGE_PREFIX) return;
            segments[0] = DEFAULT_LANGUAGE_PREFIX;
        } else {
            segments.unshift(DEFAULT_LANGUAGE_PREFIX);
        }

        const newPathname = `/${segments.join('/')}`;
        if (url.pathname !== newPathname) {
            url.pathname = newPathname;
            window.location.replace(url.toString());
        }
    };

    enforceLanguagePrefix();
})();
