// ==UserScript==
// @name         SeeStack
// @version      0.12
// @description  Add titles to Substack redirect links in Gmail, exposing the target URL
// @author       Kevin Shay
// @namespace    https://greasyfork.org/users/154233
// @match        https://mail.google.com/*
// @require      https://update.greasyfork.org/scripts/472236/1249646/GM%20Fetch.js
// @grant        GM_xmlhttpRequest
// @connect      substack.com
// @downloadURL https://update.greasyfork.org/scripts/480531/SeeStack.user.js
// @updateURL https://update.greasyfork.org/scripts/480531/SeeStack.meta.js
// ==/UserScript==

/* globals gmFetch */
(function() {
    'use strict';

    // Handle both the hash navigation format and the standalone "View entire message" page
    const INDIVIDUAL_EMAIL_RE = new RegExp('(/[a-z]{32})|(permmsgid=msg-f:\\d+)', 'i');
    const ERROR_LOCATION_RE = new RegExp('Refused to connect to "([^]+)"');
    const SUBSTACK_REDIRECT = 'https://substack.com/redirect/';
    const SUBSTACK_REDIRECT_RE = new RegExp(`^${SUBSTACK_REDIRECT}`);

    function getRedirectPromise(url) {
        // GM_xmlhttpRequest is part of the Greasemonkey/Tampermonkey API, allowing HTTP
        // requests that bypass normal browser CORS restrictions;
        // gmFetch wraps it to emulate the fetch API
        return gmFetch(url, {
            method: 'HEAD',
            headers: {
                'User-Agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            },
        }).then((res) => {
            console.log(res.url);
            return res.url;
        }).catch((e) => {
            // FIXME: If GM_fetch and GM_xmlhttpRequest could be told not to follow redirects,
            // we could look at the first redirect response and wouldn't need to rely on errors.
            // (Could also use "@connect *" but that requires the user to adjust settings, and
            // at any rate we don't actually want or need to request the redirected locations.)
            return e.toString().match(ERROR_LOCATION_RE)[1].trim();
        });
    }

    function checkLinks() {
        // Quick heuristic to see if this is even a Substack post at all;
        // if not, no need to bother inspecting the links
        if (!document.body.innerHTML.includes(SUBSTACK_REDIRECT)) {
            return;
        }
        [...document.getElementsByTagName('a')].forEach((el) => {
            if (el.href?.match(SUBSTACK_REDIRECT_RE)) {
                getRedirectPromise(el.href).then((location) => {
                    if (location) {
                        el.setAttribute('title', location);
                    }
                });
            }
        });
    }

    // Alternative that fetches each link on mouseover instead of all at once up front.
    // The problem with this seems to be that once the redirect is resolved and the title
    // attribute is set, you often need to move the mouse again to get the title tooltip
    // to show up, which is annoying and makes it feel like it's not working consistently.
    function checkLinks_mouseover() {
        [...document.getElementsByTagName('a')].forEach((el) => {
            if (el.href?.match(SUBSTACK_REDIRECT_RE)) {
                const elListener = (evt) => {
                    getRedirectPromise(evt.target.href).then((location) => {
                        if (location) {
                            evt.target.setAttribute('title', location);
                        }
                    });
                    el.removeEventListener('mouseover', elListener);
                };
                el.addEventListener('mouseover', elListener);
            }
        });
    }

    function checkCurrentPage() {
        if (!INDIVIDUAL_EMAIL_RE.test(location.href)) {
            return;
        }
        // FIXME: Use a more robust way of waiting for the page content to be ready
        setTimeout(checkLinks, 2000);
    }

    addEventListener('hashchange', checkCurrentPage);
    checkCurrentPage();
})();