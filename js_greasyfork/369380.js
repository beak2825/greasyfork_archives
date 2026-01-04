// ==UserScript==
// @name         Waze Forum Enhancement - Add Beta Permalink
// @namespace    https://greasyfork.org/en/users/190349-skyviewguru
// @version      2018.06.09.3
// @description  Inserts a WME Beta permalink next to production permalinks.
// @author       SkyviewGuru
// @match        https://www.waze.com/forum/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369380/Waze%20Forum%20Enhancement%20-%20Add%20Beta%20Permalink.user.js
// @updateURL https://update.greasyfork.org/scripts/369380/Waze%20Forum%20Enhancement%20-%20Add%20Beta%20Permalink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Locate any hyperlinks with /editor in the URL
    $('a[href*="/editor"]').each(
        function() {
            // Get the URL of the current hyperlink.
            var i=$(this).attr('href');

            // Confirm it's actually a production permalink
            if(/^https:\/\/www.waze.com\/([\w-]+\/)?editor\/?/.test(i)) {
                // Yes, it is. Insert beta PL.
                $(this).after(' <a target="_blank" href="' + i.replace(/www.waze/,'beta.waze') + '">[&beta;]</a>');
            }
        }
    );
})();