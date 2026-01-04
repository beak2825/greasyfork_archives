// ==UserScript==
// @name         Press "s" to Startpage (DuckDuckGo)
// @version      0.1
// @description  Press "s" to Startpage in DuckDuckGo. Based on "Press "g" to Google (DuckDuckGo)" by Gea-Suan Lin
// @author       George Georgiou
// @match        https://duckduckgo.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/371031
// @downloadURL https://update.greasyfork.org/scripts/402194/Press%20%22s%22%20to%20Startpage%20%28DuckDuckGo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402194/Press%20%22s%22%20to%20Startpage%20%28DuckDuckGo%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keyup', function(event) {
        if ('input' === document.activeElement.tagName.toLowerCase()) {
            return;
        }
        if ('s' !== event.key) {
            return;
        }

        let q = document.getElementById('search_form_input').value;
        let q_encoded = encodeURIComponent(q).replace(/%20/g, '+');
        let url = 'https://www.startpage.com/do/search?q=' + q_encoded;

        document.location = url;
    });
})();
