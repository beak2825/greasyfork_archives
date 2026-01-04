// ==UserScript==
// @name         thepiratebay.org Status Text
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Higlight Green VIP and Trusted torrents in search
// @author       SergoZar
// @match        https://thepiratebay.org/search.php*
// @icon         https://thepiratebay.org/favicon.ico
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488830/thepiratebayorg%20Status%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/488830/thepiratebayorg%20Status%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var images = document.querySelectorAll("img");
    var statuses = ["VIP", "Trusted"];
    for (var img of images){
        if (statuses.includes(img.alt)){
            var span = document.createElement("div");
            span.innerText = img.alt;
            span.style = `color:       lightgreen;
                          font-weight: bold;
                          padding:     3px 4px;
                          display:     inline-block;`
            img.parentNode.style.background = "black";
            img.parentNode.style.width = "96px";
            img.after(span);
        }
    }

})();