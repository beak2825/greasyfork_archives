// NOTE: This program sets the size of the Farmville Live Chat window to be
// about the same size as the Farmville game display. If you'd like a different
// height, change the number in the next line.

var FarmvilleLiveChatHeight = 540 ;

// ==UserScript==
// @name         Tall Farmville Live Chat
// @namespace    https://greasyfork.org/en/users/113539-farmer-otto
// @version      0.1
// @description  Make the Farmville Live Chat window taller than the default.
// @author       Farmer Otto
// @match        https://apps.facebook.com/onthefarm/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28549/Tall%20Farmville%20Live%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/28549/Tall%20Farmville%20Live%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ._3ss is the class of the "YOUR GAMES" and "RECOMENDED GAMES sections at the
    // top of the right column. Hide them to make more room for chat.

    GM_addStyle('._3ss { display: none; }');


    // .uiScrollableAreaWrap is the class of the Live Chat scrollable text area,
    // not including the "Type a message…" input area or Send button. Make it bigger.
    // The value is obtained from the setting near the top of this script.

    GM_addStyle('.uiScrollableAreaWrap { max-height: ' + FarmvilleLiveChatHeight + 'px !important; }');

})();
