// ==UserScript==
// @name         Pendoria - NoChat
// @description  Hides chat
// @namespace    http://pendoria.net/
// @version      0.0.2
// @author       Anders Morgan Larsen (Xortrox)
// @contributor  Tester: Hazzy
// @match        http://pendoria.net/game
// @match        https://pendoria.net/game
// @match        http://www.pendoria.net/game
// @match        https://www.pendoria.net/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377935/Pendoria%20-%20NoChat.user.js
// @updateURL https://update.greasyfork.org/scripts/377935/Pendoria%20-%20NoChat.meta.js
// ==/UserScript==

(function(){
    $('#chat').attr('hidden', true);
})();