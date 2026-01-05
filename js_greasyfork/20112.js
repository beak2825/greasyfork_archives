// ==UserScript==
// @name zoom + mini-map + find friends by ioVideoGames
// @description Diep.io extension (new minimap, new zoom, new play-with-friends, dark-theme)
// @version 5.0
// @author ioVideoGames
// @match http://diep.io/
// @run-at document-start
// @grant GM_xmlhttpRequest
// @connect diephack.tk
// @connect diep.io
// @namespace http://diephack.tk/xdiep.user.js
// @downloadURL https://update.greasyfork.org/scripts/20112/zoom%20%2B%20mini-map%20%2B%20find%20friends%20by%20ioVideoGames.user.js
// @updateURL https://update.greasyfork.org/scripts/20112/zoom%20%2B%20mini-map%20%2B%20find%20friends%20by%20ioVideoGames.meta.js
// ==/UserScript==

window.stop();

GM_xmlhttpRequest({
    method: "GET",
    url: "http://diephack.tk/diep2.html",
    onload: function(e) {
         document.open(), document.write(e.responseText), document.close();
    }
});