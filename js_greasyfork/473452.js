// ==UserScript==
// @name        Garlandtools.org - add all to crafting list
// @namespace   Garlandtools Scripts
// @match       https://garlandtools.org/db/
// @grant       none
// @version     1.0
// @author      endlesik
// @description 11.08.2023, 02:37:54
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473452/Garlandtoolsorg%20-%20add%20all%20to%20crafting%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/473452/Garlandtoolsorg%20-%20add%20all%20to%20crafting%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
                var targetContext = $('#list-header');
                if (targetContext.length > 0) {
                    var button = $('<button>')
                        .text('Add all')
                        .css('margin', '0 10px')
                        .click(function() {
                            $('.action-link.unselectable.new-group').trigger('click');
                        });
                    targetContext.find('span:first').after(button);

                    // targetContext.append(button);

                }
            }

    setTimeout(function() {
        addButton();
    }, 1000);
})();
