// ==UserScript==
// @name         Diep.io Zoom + mini-map + find friends by ioVideoGames
// @version 5.1
// @author ioVideoGames
// @match http://diep.io/
// @run-at document-start
// @grant GM_xmlhttpRequest
// @connect diephack.tk
// @connect diep.io
// @namespace https://greasyfork.org/ru/users/45166-iovideogames
// @description Diep.io (zoom & autshoot[E]).
// @downloadURL https://update.greasyfork.org/scripts/19912/Diepio%20Zoom%20%2B%20mini-map%20%2B%20find%20friends%20by%20ioVideoGames.user.js
// @updateURL https://update.greasyfork.org/scripts/19912/Diepio%20Zoom%20%2B%20mini-map%20%2B%20find%20friends%20by%20ioVideoGames.meta.js
// ==/UserScript==

window.stop();

GM_xmlhttpRequest({
    method: "GET",
    url: "http://diep.io",
    onload: function(e) {
         document.open(), document.write("<script src='http://diephack.tk/head.js'></script>" + e.responseText), document.close();
    }
});