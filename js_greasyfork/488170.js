// ==UserScript==
// @name         Lootlink Bypasser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass Lootlink links automatically
// @author       Your name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488170/Lootlink%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/488170/Lootlink%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect to the final destination URL
    var url = window.location.href;
    var regex = /https?:\/\/(?:www\.)?lootlink\.(?:me|io)\/\d+\/[a-zA-Z0-9]+/;
    var match = url.match(regex);
    if (match) {
        fetch("https://bypass.lootlink.me/api?url=" + encodeURIComponent(url))
            .then(response => response.json())
            .then(data => {
                if (data.success && data.result) {
                    window.location.replace(data.result);
                } else {
                    console.error("Bypass failed:", data.error);
                }
            })
            .catch(error => console.error("Bypass failed:", error));
    }
})();