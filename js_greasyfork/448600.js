// ==UserScript==
// @name         Hide IdleScape ChatBox
// @namespace    SobieskiCodes
// @version      0.2
// @description  Hide's the chatbox while you play IdleScape
// @author       probsjustin
// @match        http*://*idlescape.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448600/Hide%20IdleScape%20ChatBox.user.js
// @updateURL https://update.greasyfork.org/scripts/448600/Hide%20IdleScape%20ChatBox.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var checkExist = setInterval(function() {
        var chatBox = document.getElementsByClassName("play-area-chat-container");
        if (chatBox[0] !== undefined || null) {
            chatBox[0].style.display = 'none';
        }

    }, 3000);
})();

// (function() {
//     while (document.getElementsByClassName("play-area-chat-container") === null || undefined) {
//         var chatBox = document.getElementsByClassName("play-area-chat-container");
//         if (chatBox[0] === undefined || null) {
//             chatBox = document.getElementsByClassName("play-area-chat-container");
//         } else if (chatBox[0].style.display !== 'none') {
//                 chatBox[0].style.display = 'none'
//                 break
//         }
//
//     }
// })();