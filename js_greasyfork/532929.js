// ==UserScript==
// @name         Mydealz Direktlink statt Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect-Links durch die echte Ziel-URL ersetzen
// @match        https://www.mydealz.de/profile/messages/*
// @author       MD928835
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532929/Mydealz%20Direktlink%20statt%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/532929/Mydealz%20Direktlink%20statt%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('a.link[title]').forEach(a => {
        if (a.href.includes('/visit/privatemessage/')) {
            let url = a.title.trim();
            // Prüfen, ob bereits ein Protokoll vorhanden ist
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url.replace(/^\/+/, '');
            }
            a.href = url;
        }
    });
})();
