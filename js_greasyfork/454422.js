// ==UserScript==
// @name         Basecamp Squads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Basecamp theme modifier
// @author       You
// @match        https://3.basecamp.com/4493703/projects
// @icon         https://www.google.com/s2/favicons?sz=64&domain=basecamp.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/454422/Basecamp%20Squads.user.js
// @updateURL https://update.greasyfork.org/scripts/454422/Basecamp%20Squads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const color_codes = {
        FIDELI:"#008080"
    };
    var styleElem = document.head.appendChild(document.createElement("style"));
    document.querySelectorAll(".card__title").forEach(e => {
        if(e.innerHTML.toUpperCase().includes("FIDELI")){
           var color = color_codes.FIDELI;
         }
        let parent_node = e.parentNode.parentNode;
        parent_node.style.backgroundColor = color;
        console.log(parent_node);
        let parent_node_2 = parent_node.querySelector(".card__people");
        parent_node_2.style.background = color;
        styleElem.type = "text/css";
        styleElem.innerHTML = ".card--project .card__people:before {background: none}";
    });
})();