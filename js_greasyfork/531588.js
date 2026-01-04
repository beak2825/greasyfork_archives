// ==UserScript==
// @name        显示里屋发帖人
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       https://www.253874.net/*
// @match       http://www.253874.net/*
// @grant       none
// @version     1.0
// @author      Calon
// @description 2025/4/2 20:34:31
// @downloadURL https://update.greasyfork.org/scripts/531588/%E6%98%BE%E7%A4%BA%E9%87%8C%E5%B1%8B%E5%8F%91%E5%B8%96%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/531588/%E6%98%BE%E7%A4%BA%E9%87%8C%E5%B1%8B%E5%8F%91%E5%B8%96%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractUsername(title) {
        const match = title.match(/^【\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} (.*?)】/);
        if (!match) return null;
        let username = match[1];
        // 移除【】及HTML标签
        username = username.replace(/【.*?】|<[^>]*>/g, '').trim();
        username = username.replace(/【.*?.*/g, '').trim();
        return username;
    }

    document.querySelectorAll('a[title]').forEach(link => {
        const title = link.getAttribute('title');
        const username = extractUsername(title);
        if (username) {
            link.textContent = `${username}: ${link.textContent}`;
        }
    });
})();