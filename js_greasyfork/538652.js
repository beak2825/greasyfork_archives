// ==UserScript==
// @name         Talkomatic.co Remove AFK Inactivity Timeout
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove the annoying inactivity timeout
// @author       zackiboiz
// @match        *://modern.talkomatic.co/html/chatroom.html*
// @match        *://classic.talkomatic.co/room.html*
// @icon         https://icons.duckduckgo.com/ip2/classic.talkomatic.co.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538652/Talkomaticco%20Remove%20AFK%20Inactivity%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/538652/Talkomaticco%20Remove%20AFK%20Inactivity%20Timeout.meta.js
// ==/UserScript==

switch (window.location.hostname) {
    case "modern.talkomatic.co":
        setInterval(() => { // every 5s so it doesn't eat resources (inactivity is ~2m)
            window.resetInactivityTimeout();
            window.inactivityTimeout = null;
        }, 5000);

        break;
    case "classic.talkomatic.co":
        setInterval(() => {
            if (!socket) return;

            socket.emit("anti-afk", {
                author: "@xnor / Zacki"
            });
        }, 5000);

        break;
}