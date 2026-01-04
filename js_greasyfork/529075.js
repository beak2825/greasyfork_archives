// ==UserScript==
// @name         AO3: Shake Prompt Fill
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license     MIT
// @description  Adds a button to shake an unrevealed fill in a collection
// @author       Jamez
// @match        *://*.archiveofourown.org/collections/*/requests
// @match        *://*.archiveofourown.org/collections/*/signups/*
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529075/AO3%3A%20Shake%20Prompt%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/529075/AO3%3A%20Shake%20Prompt%20Fill.meta.js
// ==/UserScript==
(function($) {
    $(document).ready(function() {
        if (!$('body').hasClass('logged-in')) { return; }

        var base_url = "https://archiveofourown.org/collections/$COLLECTION$/works?commit=Sort+and+Filter&work_search%5Bquery%5D=id%3A$ID$";

        $('.index.group li.work').each(function() {
            var workElement = $(this);
            var workIdMatch = workElement.attr('id').match(/work_(\d+)/);
            if (workIdMatch) {
                var workId = workIdMatch[1];
                var mysteryCheck = workElement.find('div.mystery');
                if (mysteryCheck.length > 0) {
                    var collectionElement = workElement.find('h5 a');
                    if (collectionElement.length > 0) {
                        var collectionName = collectionElement.attr('href').split("/")[2];
                        var workUrl = base_url.replace("$COLLECTION$", collectionName).replace("$ID$", workId);

                        var button = $('<a>', {
                            text: 'Shake Fill',
                            href: workUrl,
                        });

                        var actions = workElement.find('.actions');
                        if (actions.length) {
                            actions.append(button);
                        } else {
                            workElement.append(button);
                        }
                    }
                }
            }
        });
    });
})(window.jQuery);
