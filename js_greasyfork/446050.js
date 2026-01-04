// ==UserScript==
// @name        [AO3 Wrangling] Clickable Table Cells
// @description make the entire cell clickable if it has a link
// @version     0.1
// @author      Rhine
// @namespace   https://github.com/RhineCloud
// @include     http*://*archiveofourown.org/tag_wranglers/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/446050/%5BAO3%20Wrangling%5D%20Clickable%20Table%20Cells.user.js
// @updateURL https://update.greasyfork.org/scripts/446050/%5BAO3%20Wrangling%5D%20Clickable%20Table%20Cells.meta.js
// ==/UserScript==

// open in new tab or nah; set to true or false
const OPEN_IN_NEW_TAB = true;

(function($) {
    $('th:has(a), td:has(a)').on('click', function() {
        let target = $(this).find('a').attr('href');
        
        if (OPEN_IN_NEW_TAB) {
            window.open(target, '_blank');
        } else {
            window.location.assign(target);
        }
    });
})(jQuery);
