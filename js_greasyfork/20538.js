// ==UserScript==
// @name         vertix combo announcer
// @version      0.1.1
// @description  announces vertix kill combos in chat
// @author       pasimko
// @match        http://vertix.io/
// @namespace https://greasyfork.org/users/48620
// @downloadURL https://update.greasyfork.org/scripts/20538/vertix%20combo%20announcer.user.js
// @updateURL https://update.greasyfork.org/scripts/20538/vertix%20combo%20announcer.meta.js
// ==/UserScript==

    announce = function() {
        socket.on("3", function(a) {
            if(2 == a.kd) {chat.sendChat("DOUBLE");}
        });
    };