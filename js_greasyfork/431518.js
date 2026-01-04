// ==UserScript==
// @name         notif count remover
// @namespace    https://wallex.ir/
// @version      1.1
// @description  remove notification count
// @author       amiwrpremium
// @match        https://wallex.ir/app/*
// @icon         https://www.google.com/s2/favicons?domain=wallex.ir
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431518/notif%20count%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/431518/notif%20count%20remover.meta.js
// ==/UserScript==

(function() {
    document.querySelector('#displayReceivedMessagesCount').remove()
})();