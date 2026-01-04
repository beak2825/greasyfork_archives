// ==UserScript==
// @name        SourceForge Instant Download
// @namespace   mevanlc
// @license     MIT
// @match       https://*.sourceforge.net/projects/*/files/*/download
// @match       https://*.sf.net/projects/*/files/*/download
// @grant       none
// @version     1.4
// @author      -
// @description Bypass SourceForge download timer and disable post-download redirect
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/501322/SourceForge%20Instant%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/501322/SourceForge%20Instant%20Download.meta.js
// ==/UserScript==

(() => {
    const interval = setInterval(() => {
        if (SF && SF.downloader && SF.downloader.cancelCountdown && SF.downloader.cancelRedirect) {
            clearInterval(interval);
            SF.downloader.cancelCountdown();
            SF.downloader.cancelRedirect();
        }
    }, 100);
})();
