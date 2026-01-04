// ==UserScript==
// @name         Stackoverflow.com redirect to archive.org
// @namespace    https://wsl.moe/
// @version      2024-10-11
// @description  Auto redirect Stackoverflow to archive.org when super ultra low user experience Cloudflare captcha detected.
// @license      WTFPL
// @author       You
// @match        https://*.stackexchange.com/*
// @match        https://*.stackoverflow.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512190/Stackoverflowcom%20redirect%20to%20archiveorg.user.js
// @updateURL https://update.greasyfork.org/scripts/512190/Stackoverflowcom%20redirect%20to%20archiveorg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let executeCount = 0;
    let intervalId = 0;

    intervalId = setInterval(() => {
        if (executeCount > 10) {
            clearInterval(intervalId);
        }
        if (
            document.body.innerText.indexOf('Ray ID: ') !== -1 &&
            document.getElementsByTagName('a')[0].href.indexOf('utm_source=challenge') !== -1 &&
            document.body.innerHTML.indexOf('/cdn-cgi/challenge-platform/') !== -1
        ) {
            const origUrl = location.href;
            location.href = 'https://web.archive.org/web/' + origUrl;
        }
        executeCount += 1;
    }, 2000);
})();