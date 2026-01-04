// ==UserScript==
// @name         Douban Username Alias Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       momobitesthedust
// @match        https://www.douban.com/*
// @description  Modify Douban usernames in-script CSV format data. Limitations: (1) Only works on PC Douban (https://www.douban.com), and (2) Supports in-script CSV format data only, as Tampermonkey cannot access local files due to security restrictions.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496783/Douban%20Username%20Alias%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/496783/Douban%20Username%20Alias%20Modifier.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const userCsvData = `
user_id,alias
123,abc
// Add more user ids and aliases as needed
`;

    const userAliasMap = parseCSV(userCsvData);
    modifyUsernameAlias(userAliasMap);

    function parseCSV(data) {
        const lines = data.trim().split('\n');
        const result = {};
        lines.slice(1).forEach(line => {
            const [user_id, alias] = line.split(',');
            if (user_id && alias) {
                result[user_id.trim()] = alias.trim();
            }
        });
        return result;
    }

    function modifyUsernameAlias(userAliasMap) {
        const anchors = document.querySelectorAll('a[href*="https://www.douban.com/people/"]');
        anchors.forEach(anchor => {
            if (anchor.querySelector('img')) {
                return;
            }
            const userIdMatch = anchor.href.match(/people\/([^\/]+)\//);
            if (userIdMatch && userAliasMap[userIdMatch[1]]) {
                const alias = userAliasMap[userIdMatch[1]];
                anchor.textContent = `${anchor.textContent} [${alias}]`;
            }
        });
    }

})();
