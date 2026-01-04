// ==UserScript==
// @name         FreeZoom
// @namespace    freezoom
// @version      1
// @description  Allow zooming on every website! Don't let any mobile control freak website tell you when to zoom or not!
// @author       elypter
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36755/FreeZoom.user.js
// @updateURL https://update.greasyfork.org/scripts/36755/FreeZoom.meta.js
// ==/UserScript==

//License: GPL3

(function() {
    viewport = document.querySelector("meta[name=viewport]");
    if(viewport){
        var content = viewport.getAttribute('content').replace("user-scalable=0","user-scalable=1").replace("user-scalable=no","user-scalable=yes");
        viewport.setAttribute('content', content);
    }
})();