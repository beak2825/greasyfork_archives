// ==UserScript==
// @name        Faction War Cleaner
// @namespace   Jebster.Torn.FactionWarCleaner
// @author      Jeggy
// @description Adds extra information to different pages all around Torn.
// @include     http://www.torn.com/factions.php?step=your
// @version     1.0.1
// @require     http://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/26367/Faction%20War%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/26367/Faction%20War%20Cleaner.meta.js
// ==/UserScript==


(function() {
    'use strict';
    test();
})();

var found = false;
function test(){
    setTimeout(
        function()
        {
            if($('.faction-respect-wars-wp').length > 0) found = true;
            $('.faction-respect-wars-wp').remove();
            if(!found) test();
            console.log('Looking!');
        }, 25);
}