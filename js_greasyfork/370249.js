// ==UserScript==
// @name         Load More on Steam
// @namespace    http://steamcommunity.com
// @version      1.0
// @description  This script automatically clicks Load More button on Steam Chat Logs.
// @author       TEKNO
// @match        https://help.steampowered.com/en/accountdata/GetFriendMessagesLog
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370249/Load%20More%20on%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/370249/Load%20More%20on%20Steam.meta.js
// ==/UserScript==

(function() {
    function clicker() {
        var btn = document.getElementsByClassName("AccountDataLoadMore");
        if(btn.length>0) {
            loadbtn = btn[0];
            loadbtn.click();
        }
        setTimeout(clicker,500);
    }

    clicker();
})();