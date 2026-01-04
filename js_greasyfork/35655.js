// ==UserScript==
// @name         No Chat
// @version      1.1
// @description  No chat for hordes.io
// @author       BlazingFire007
// @match        https://hordes.io/
// @namespace https://greasyfork.org/users/120068
// @downloadURL https://update.greasyfork.org/scripts/35655/No%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/35655/No%20Chat.meta.js
// ==/UserScript==

(function() {
    var int = setInterval(()=>{
        if (Object.keys(io.managers).length > 1) { io.managers[Object.keys(io.managers)[0]].nsps["/"].close(); clearInterval(int); }
    }, 10);
})();