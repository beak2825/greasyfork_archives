// ==UserScript==
// @name           No Blue Skill Point Box On GLB Homepage
// @namespace      pbr
// @include        http://goallineblitz.com/game/home.pl
// @version        08.12.24
// @description sdfsdf
// @downloadURL https://update.greasyfork.org/scripts/1474/No%20Blue%20Skill%20Point%20Box%20On%20GLB%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/1474/No%20Blue%20Skill%20Point%20Box%20On%20GLB%20Homepage.meta.js
// ==/UserScript==


/* 
 * 
 * pabst did this 08/12/24+
 *
 * 
 */

window.setTimeout( 

function() {
    var boxes = document.getElementsByClassName("content_container_sp");
    for (var i=boxes.length-1; i>-1; i--) {
        var c = boxes[i].getAttribute("class");
        c = c.replace("content_container_sp","content_container");
        boxes[i].setAttribute("class",c);
    }
}

,50);

