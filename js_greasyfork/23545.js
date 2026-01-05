// ==UserScript==
// @name         Kanpani Girls Reload Button
// @namespace    eight04.blogspot.com
// @version      0.1.0
// @description  Add a button to reload the game.
// @author       eight04 <eight04@gmail.com>
// @match        http://chienese.kanpanigirls.com/general/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23545/Kanpani%20Girls%20Reload%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/23545/Kanpani%20Girls%20Reload%20Button.meta.js
// ==/UserScript==

function init() {
    var parent = document.querySelector("#game_canvas"),
        child = document.querySelector("#game_canvas embed");
        
    if (!parent || !child) {
        setTimeout(init, 1000);
        return;
    }

    var button = document.createElement("button");
    button.type = "button";
    button.textContent = "reload";
    button.onclick = function() {
        parent.removeChild(child);
        setTimeout(function(){
            parent.appendChild(child);
        });
    };
    parent.parentNode.insertBefore(button, parent);
}

init();
