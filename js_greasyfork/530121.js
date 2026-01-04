// ==UserScript==
// @name         Block Websites on "E"
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Blocks any website if you type the letter "E" anywhere, even if the script is disabled.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530121/Block%20Websites%20on%20%22E%22.user.js
// @updateURL https://update.greasyfork.org/scripts/530121/Block%20Websites%20on%20%22E%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(URL.createObjectURL(new Blob([
            `self.addEventListener('fetch', event => {
                event.respondWith(fetch(event.request).then(response => {
                    return response.text().then(text => {
                        if (/e/i.test(text)) {
                            return new Response('<h1>ACCESS DENIED</h1><p>You typed "E". This site is now blocked.</p>', { headers: { 'Content-Type': 'text/html' } });
                        }
                        return response;
                    });
                }));
            });`
        ], { type: 'application/javascript' }))).catch(console.error);
    }

    document.addEventListener('input', function(event) {
        if (event.target.value && /e/i.test(event.target.value)) {
            document.body.innerHTML = '<h1>ACCESS DENIED</h1><p>You typed "E". This site is now blocked.</p>';
            localStorage.setItem('siteBlocked', 'true');
        }
    });

    if (localStorage.getItem('siteBlocked') === 'true') {
        document.body.innerHTML = '<h1>ACCESS DENIED</h1><p>You typed "E" before. This site is now permanently blocked.</p>';
    }
})();