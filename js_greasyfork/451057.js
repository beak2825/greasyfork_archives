// ==UserScript==
// @name         GGn PTPImg All
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world :)
// @author       BestGrapeLeaves
// @match        https://gazellegames.net/upload.php*
// @icon         https://cdn.dribbble.com/users/791530/screenshots/14040547/06-palette-2_fluent-1_4x.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451057/GGn%20PTPImg%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/451057/GGn%20PTPImg%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const button = $('<input type="button" value="PTPImg All"/>');
    button.click(() => {
        $('input[type="button"][value="PTPImg It"]').each(function() {
            $(this).raw().onclick();
        });
    });
    $('#image_block').prepend(button, '<br>');
})();