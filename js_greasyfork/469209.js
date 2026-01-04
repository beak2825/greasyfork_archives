// ==UserScript==
// @name         Podział łupów jak na SI
// @namespace    
// @version      1.0.1
// @description  Podział łupów jak na SI.
// @match        http*://*.margonem.pl/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469209/Podzia%C5%82%20%C5%82up%C3%B3w%20jak%20na%20SI.user.js
// @updateURL https://update.greasyfork.org/scripts/469209/Podzia%C5%82%20%C5%82up%C3%B3w%20jak%20na%20SI.meta.js
// ==/UserScript==

(function() {
    'use strict';
        GM_addStyle('.new-chat-message .message-part.special-style-4 .mark-message-span { color: orange !important; }');

    // słowa, dla których kolor ma być zmieniony
    var wordsToColor = ["Podział łupów"];

    // tworzenie selektora CSS dla każdego słowa
    var selectors = wordsToColor.map(function(word) {
        return '.chat-message.sys_info.clone .text:contains(' + word + ') { color: #cfc !important; }';
    }).join(' ');

    // dodanie stylów CSS do strony
    GM_addStyle(selectors +
                '.new-chat-message .message-part.special-style-4, ' +
                '.new-chat-message .message-part.special-style-3  { color: #cfc !important; }');
})();
