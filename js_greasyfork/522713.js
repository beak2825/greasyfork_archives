// ==UserScript==
// @name         Clear all cookies
// @namespace    https://greasyfork.org/en/scripts/522713-clear-all-cookies
// @version      0.2
// @description  Tries to recreate going into incognito mode for a website without actually opening an incognito tab
// @author       TetteDev
// @license      MIT
// @match        *://*/*
// @icon         https://icons.duckduckgo.com/ip2/tampermonkey.net.ico
// @grant        GM_cookie
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522713/Clear%20all%20cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/522713/Clear%20all%20cookies.meta.js
// ==/UserScript==

const ClearEverything = async (e) => {
    const f5KeyCode = 116;
    if ((e = e === null ? null : (e || window.event)) !== null // ClearEverything wasnt called from tampermonkey GUI
       && !(e.altKey && (e.keyCode == f5KeyCode || e.code === 'F5'))) return;

    // Gets and clears all present httpOnly cookies for the current document url
    const activeCookies = await GM.cookie.list({ url: window.location.href, partitionKey: {} })
    .catch(err => { debugger; });
    activeCookies.forEach(cookie => {
        GM_cookie.delete({ name: cookie.name, url: window.location.href, partitionKey: {} }, function(error) {
            if (error) {
                debugger;
                console.error(error);
            }
        });
    });

    unsafeWindow.document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
    unsafeWindow.caches.keys().then(keys => {
        keys.forEach(key => unsafeWindow.caches.delete(key))
    });
    unsafeWindow.indexedDB.databases().then(dbs => {
        dbs.forEach(db => unsafeWindow.indexedDB.deleteDatabase(db.name))
    })
    unsafeWindow.sessionStorage.clear();
    unsafeWindow.localStorage.clear();
    location.reload();
};

(function() {
    'use strict';
    document.addEventListener("keyup", ClearEverything);
    GM_registerMenuCommand("Simulate new Session (ALT+F5)", function(event) {
        ClearEverything(null);
    }, { autoClose: true });
})();