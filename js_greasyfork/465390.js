// ==UserScript==
// @name         Twitch default sort by viewer count without sidebar and footer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set default sort to viewer count on Twitch directory search pages without sidebar and footer
// @match        https://www.twitch.tv/directory/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465390/Twitch%20default%20sort%20by%20viewer%20count%20without%20sidebar%20and%20footer.user.js
// @updateURL https://update.greasyfork.org/scripts/465390/Twitch%20default%20sort%20by%20viewer%20count%20without%20sidebar%20and%20footer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // default Sort on Game Directory from High to Low
    var url = window.location.href;
    if(url.indexOf("?sort=VIEWER_COUNT") == -1) {
        url += "?sort=VIEWER_COUNT";
        window.location.href = url;
    }

    // Remove the sidebar and footer from the page
    var sidebar = document.querySelector('.side-nav');
    sidebar.parentNode.removeChild(sidebar);
    var footer = document.querySelector('footer');
    footer.parentNode.removeChild(footer);
})();