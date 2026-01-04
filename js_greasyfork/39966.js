// ==UserScript==
// @name         Bigger Chat
// @version      1.0
// @namespace    https://greasyfork.org/users/120068
// @description  Slightly bigger chat. Easier to read on a 1920 x 1080 monitor.
// @author       BlazingFire007
// @match        https://hordes.io/
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/39966/Bigger%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/39966/Bigger%20Chat.meta.js
// ==/UserScript==

var interval = setInterval(function() {
    if (document.getElementById("ui_chat_channel_all") !== null) {
        document.getElementById("ui_chat_channel_all").style["font-size"] = "1em";
        clearInterval(interval);
    }
}, 30);