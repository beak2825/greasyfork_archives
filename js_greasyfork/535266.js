// ==UserScript==
// @name         Offcloud Persist Login
// @namespace    https://offcloud.com/
// @license      MIT
// @version      1.2
// @description  Makes login session permannent on offcloud.com even after browser restarts.
// @author       blvdmd
// @match        https://offcloud.com/*
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/535266/Offcloud%20Persist%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/535266/Offcloud%20Persist%20Login.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // Stable versions return non-HttpOnly cookies by default only.
    // Set Config Mode to Advanced and change Security > Allow scripts to access cookies to All to change this.
    // More info: https://github.com/Tampermonkey/tampermonkey/issues/465

    const TARGET_TITLE = "Unlock, speed up and easily transfer content from the cloud - Offcloud.com";
    const COOKIE_NAME = "connect.sid";

    async function manageCookie() {
        if (document.title == TARGET_TITLE || top.location.href == 'https://offcloud.com/login') {
            console.log("[Offcloud Manager] Login page detected, making login session permanent.");

            // Gets and clears all present httpOnly cookies for the current document url
            const activeCookies = await GM.cookie.list({ name: COOKIE_NAME, url: window.location.href});

            activeCookies.forEach(cookie => {
                if (cookie.name == COOKIE_NAME && cookie.httpOnly ) {
                    //Delete original session cookie
                    GM_cookie.delete({name: COOKIE_NAME, url: window.location.href}, function (error) {
                        if (error) {
                            console.log(`Session cookie "${COOKIE_NAME}" deletion failed`);
                        }
                    });
                    GM_cookie.set({
                        name: cookie.name,
                        value: cookie.value,
                        domain: cookie.domain,
                        path: cookie.path,
                        secure: false,
                        httpOnly: false,
                        expirationDate: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365) // Expires in 365 days
                    }, function (error) {
                        if (error) {
                            alert(`Error setting cookie with name "${cookie.name}" and value "${cookie.value}"`);
                        }
                    });
                }
            });

        } else {
            console.log("[Offcloud Manager] Not login page, no action taken");
        }
    }

    manageCookie();
})();