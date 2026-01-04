// ==UserScript==
// @name         AGSV-BBS-Helper
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Add link of personal page
// @author       You
// @match        https://bbs.agsvpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agsvpt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492625/AGSV-BBS-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492625/AGSV-BBS-Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const links = document.querySelectorAll('a');

        links.forEach(link => {
            // Check if the link href matches the specific pattern
            let match = link.href.match(/\/u\/(\d+)/);
            if (match) {
                const userId = match[1];
                const newLink = document.createElement('a');
                newLink.href = `https://www.agsvpt.com/userdetails.php?id=${userId}`;
                newLink.innerText = '站内链接';
                newLink.style.marginLeft = '10px';
                newLink.target = "_blank";
                link.parentNode.insertBefore(newLink, link.nextSibling);
            }
        });
})();