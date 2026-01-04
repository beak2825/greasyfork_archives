// ==UserScript==
// @name         Transformania Time No Escape
// @namespace    http://steamcommunity.com/id/siggo/
// @version      0.1
// @description  Deletes the struggle and slip free buttons for player items!
// @author       Prios
// @match        https://www.transformaniatime.com/
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/472517/Transformania%20Time%20No%20Escape.user.js
// @updateURL https://update.greasyfork.org/scripts/472517/Transformania%20Time%20No%20Escape.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $slipFree = $( 'a:contains("Attempt to slip free from your owner")' ).first();

    if ( $slipFree.length === 0 ) { return }

    var $struggleOut = $( 'a:contains("Fight your transformation and attempt to return to an animate form!")' ).first();

    $slipFree.remove();
    $struggleOut.remove();

})();