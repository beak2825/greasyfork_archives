// ==UserScript==
// @name         thisthing
// @description  moves stuff
// @version 0.0.1
// @namespace https://github.com/load1n9
// @author       loading...
// @match        https://play.boxcritters.com*
// @match        http://play.boxcritters.com*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398244/thisthing.user.js
// @updateURL https://update.greasyfork.org/scripts/398244/thisthing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeydown = checkKey;

    function checkKey(e) {

         e = e || window.event;
         if (e.keyCode == '38') {
            world.stage.room.y -= 10
          }
         else if (e.keyCode == '40') {
            world.stage.room.y += 10
          }
        else if (e.keyCode == '37') {
            world.stage.room.x -= 10
          }
        else if (e.keyCode == '39') {
            world.stage.room.x += 10
      }
        else if (e.keyCode == '221') {
            world.stage.room.rotation += 2
      }
        else if (e.keyCode == '219') {
            world.stage.room.rotation -= 2
      }
        else if (e.keyCode == '191') {
           world.stage.room.skewX += 5
      }
        else if (e.keyCode == '220') {
           world.stage.room.skewX -= 5
      }
        else if (e.keyCode == '187') {
           world.stage.room.scaleY += 0.1
           world.stage.room.scaleX += 0.1
      }
        else if (e.keyCode == '189') {
           world.stage.room.scaleY -= 0.1
           world.stage.room.scaleX -= 0.1
      }

}
})();