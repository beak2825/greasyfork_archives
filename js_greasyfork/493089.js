// ==UserScript==
// @name         AO3: Display what chapter a comment is on in inbox
// @version      2024-04-20
// @description  In the AO3 inbox, display what chapter a comment is on
// @author       ceiaOfSilence
// @license      MIT
// @match        https://archiveofourown.org/users/*/inbox*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1291350
// @downloadURL https://update.greasyfork.org/scripts/493089/AO3%3A%20Display%20what%20chapter%20a%20comment%20is%20on%20in%20inbox.user.js
// @updateURL https://update.greasyfork.org/scripts/493089/AO3%3A%20Display%20what%20chapter%20a%20comment%20is%20on%20in%20inbox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    jQuery(('.heading.byline')).each(function () {
        var commentHeader = this;
        var url = jQuery(this).find("a[href^='/works']").attr('href');
        url = "https://archiveofourown.org" + url;

        jQuery.get(url, function(response) {
            var chapterNumberContainer = jQuery(response).find('span.parent').first();
            if (chapterNumberContainer.length > 0) {
                var chapterNumber = chapterNumberContainer.text().trim().match(/\d+/)[0];
            }
            else {
                chapterNumber = "1";
            }
            var chapter = document.createElement('span');
            chapter.className = 'parent';
            chapter.innerText = `at Chapter ${chapterNumber}`;
            jQuery(commentHeader).append(chapter);
        }).fail(function () {
            console.log('failed to retrieve chapter number');
        });
    })
})();