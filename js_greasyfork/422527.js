// ==UserScript==
// @name         Hide Reddit livestreams
// @namespace    Turtur
// @version      0.3
// @description  An attempt to hide "Top livestream" from Reddit main page.
// @author       Turtur
// @match        https://www.reddit.com/
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @downloadURL https://update.greasyfork.org/scripts/422527/Hide%20Reddit%20livestreams.user.js
// @updateURL https://update.greasyfork.org/scripts/422527/Hide%20Reddit%20livestreams.meta.js
// ==/UserScript==

(function() {
    'use strict';
    waitForKeyElements('a[href*="/rpan/r/" i]', hideLivestream);

    function hideLivestream (jNode) {
        jNode.closest("div:not([class])").hide();
    }

})();