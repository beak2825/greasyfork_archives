// ==UserScript==
// @name         Wide deck Roll20
// @namespace    https://app.roll20.net/editor/
// @version      0.1
// @description  Wider the cardhand on Roll20
// @author       Lune
// @match        https://app.roll20.net/editor/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403236/Wide%20deck%20Roll20.user.js
// @updateURL https://update.greasyfork.org/scripts/403236/Wide%20deck%20Roll20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function wider(){
        let els = document.getElementsByClassName("handcontainer");
        for(let el of els) {
            if(el) {
                el.style.maxWidth = "100vw";
                el.style.width = "80vw";
                el.style.height = "208px";
            }
        }
        let ctn = document.querySelector("div.deckhands > div > div > div.handcontainer.popover.open > div.cardgroup.ui-sortable");
        if(ctn) {
            ctn.style.display = "flex";
        }
    }

    let int = setInterval(wider, 50);

})();