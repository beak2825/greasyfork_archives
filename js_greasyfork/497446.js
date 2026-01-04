// ==UserScript==
// @name         Remove items without new chapter
// @namespace    http://royalroad.com/
// @version      0.2
// @description  Add dropdown filter for fiction items
// @author       You
// @match        *://www.royalroad.com/my/follows
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497446/Remove%20items%20without%20new%20chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/497446/Remove%20items%20without%20new%20chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        const hideText = "Hide NoNew";
        const showText = "Show All";
        function clickHandling() {
            var allItems = $(".fiction-list-item");
            if (toggleButton.text() === hideText) {
                allItems.each(function() {
                    console.log($(this).text());
                    if ($(this).text().includes('Last Update & Last Read')) {
                        $(this).hide();
                    }
                });
                toggleButton.text(showText);
            } else {
                allItems.each(function() {
                    $(this).show();
                });
                toggleButton.text(hideText);
            }
        }

        let toggleButton = $(`<button class="btn btn-circle btn-sm blue">${hideText}</button>`);
        toggleButton.on('click', function() {
            clickHandling();
        });

        $('.actions').prepend(toggleButton);
        clickHandling();
    });

})();