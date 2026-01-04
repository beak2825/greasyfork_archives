// ==UserScript==
// @name         ROBLOX 2016-ifier
// @version      0.4
// @description  Changes the favicon on Roblox.com to the 2016 icon, several site title changes.
// @author       Unusual98
// @match        *://*.roblox.com/*
// @icon         https://web.archive.org/web/20160118051515im_/http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico
// @namespace https://greasyfork.org/users/1437744
// @downloadURL https://update.greasyfork.org/scripts/527575/ROBLOX%202016-ifier.user.js
// @updateURL https://update.greasyfork.org/scripts/527575/ROBLOX%202016-ifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeFavicon(url) {
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = url;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    changeFavicon('https://web.archive.org/web/20160118051515im_/http://images.rbxcdn.com/7aee41db80c1071f60377c3575a0ed87.ico'); // Change this URL to favicon
})();

(function() {
    'use strict';

    function toCustomCase(str, customWords) {
        return str.split(' ').map(word => customWords[word.toLowerCase()] || word).join(' ');
    }

    function changeTitleCase(customWords) {
        document.title = toCustomCase(document.title, customWords);
    }

    // Example: Change casing of words in the title bar, change title names
    const customCasing = {
     // 'example': 'EXAMPLE',
        'roblox': 'ROBLOX',
        'charts': 'Games'
    };

    changeTitleCase(customCasing);
})();
