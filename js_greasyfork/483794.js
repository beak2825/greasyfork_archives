// ==UserScript==
// @name         Beehiiv Link Transparency
// @version      0.2
// @description  Decorate links on a Beehiiv newsletter page (currently targeting Today in Tabs) with title attributes showing the target URLs
// @author       Kevin Shay
// @namespace    https://greasyfork.org/users/154233
// @match        https://www.todayintabs.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/483794/Beehiiv%20Link%20Transparency.user.js
// @updateURL https://update.greasyfork.org/scripts/483794/Beehiiv%20Link%20Transparency.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BEEHIIV_RE = new RegExp('^https://flight.beehiiv.net/v2/clicks/');
    let pathSeen;

    function parseJwt(token) {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(
            decodeURIComponent(
                atob(base64).split('').map(
                    (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join('')
            )
        );
    }

    function extractTargetUrl(redirectUrl) {
        return parseJwt(redirectUrl.replace(BEEHIIV_RE, '')).url;
    }

    function checkLinks() {
        [...document.getElementsByTagName('a')].forEach((el) => {
            if (el.href.match(BEEHIIV_RE)) {
                el.setAttribute('title', extractTargetUrl(el.href));
            } else {
                // Just populate the tooltip with the original URL for UX consistency
                el.setAttribute('title', el.href);
            }
        });
    }

    setInterval(() => {
        if (location.pathname === pathSeen) {
            return;
        }
        pathSeen = location.pathname;
        setTimeout(checkLinks, 1000);
    }, 1000);
})();