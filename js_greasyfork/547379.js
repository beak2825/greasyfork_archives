// ==UserScript==
// @name         AnimeTosho NZB Fixer
// @namespace    https://animetosho.org/
// @version      1.0
// @description  Replace .nzb.gz links with .nzb on AnimeTosho so you can save the actula NZB file to your PC instead of the nzb file in a .gz archive
// @author       AnimeIsMyWaifu
// @match        https://animetosho.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547379/AnimeTosho%20NZB%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/547379/AnimeTosho%20NZB%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixNZBLinks() {
        document.querySelectorAll('a[href$=".nzb.gz"]').forEach(link => {
            link.href = link.href.replace(/\.nzb\.gz$/, '.nzb');
        });
    }

    // Run once when page loads
    fixNZBLinks();

    // Observe dynamic changes (for AJAX-loaded content)
    const observer = new MutationObserver(fixNZBLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
