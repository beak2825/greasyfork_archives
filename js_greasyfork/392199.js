// ==UserScript==
// @name         Create Hyperlinks
// @namespace    http://haiku-systems.com/
// @version      0.1
// @description  Wraps text links with <a> tags when not recognized by Chrome.
// @author       Haiku Systems LLC
// @match        *
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392199/Create%20Hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/392199/Create%20Hyperlinks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(document).on('DOMSubtreeModified', function () {
        // Are we already doing this?
        if ($(this).data('hsLock')) return;

        // Lock the process.
        $(this).data('hsLock', true);

        // Do a global search/replace in <body>.
        $("body").html($("body").html().replace(/\b\w+:\/\/\/\S+(?!["'])/ig, '<a href="$&">$&</a>'));

        // Unlock the process.
        $(this).data('hsLock', false);
    });
})();