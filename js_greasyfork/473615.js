// ==UserScript==
// @name         AUTO OTS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clicks the accept OTS automagically.
// @author       You
// @match        https://play.pokemonshowdown.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473615/AUTO%20OTS.user.js
// @updateURL https://update.greasyfork.org/scripts/473615/AUTO%20OTS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const appReceive = app.receive.bind(app);

    app.receive = (data) => {
        const receivedRoom = data?.startsWith?.('>');

        appReceive(data);

        if (receivedRoom) {
            const roomId = data.slice(1, data.indexOf('\n'));
            if(data.includes("vgc") && data.includes("|init|battle")){
                app.send("/acceptopenteamsheets", roomId);
            }
        }
    };
})();