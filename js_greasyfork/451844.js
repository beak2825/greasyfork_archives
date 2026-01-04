// ==UserScript==
// @name        No advs - eurogamer.es
// @namespace   Violentmonkey Scripts
// @match       https://www.eurogamer.es/
// @grant       none
// @version     1.0
// @author      Guille615
// @description 23/9/2022, 8:08:03
// @downloadURL https://update.greasyfork.org/scripts/451844/No%20advs%20-%20eurogameres.user.js
// @updateURL https://update.greasyfork.org/scripts/451844/No%20advs%20-%20eurogameres.meta.js
// ==/UserScript==

function removeElementsByClass(className){
    var elementsToRemove = document.getElementsByClassName(className);
    while(elementsToRemove.length > 0){
        elementsToRemove[0].parentNode.removeChild(elementsToRemove[0]);
    }
}

removeElementsByClass('advert_container');