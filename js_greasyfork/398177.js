// ==UserScript==
// @name         thisthing
// @description  moves stuff
// @author       loading...
// @version 0.0.1
// @namespace https://github.com/load1n9
// @match        https://boxcritters.com/play/*
// @match        http://boxcritters.com/play/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398177/thisthing.user.js
// @updateURL https://update.greasyfork.org/scripts/398177/thisthing.meta.js
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
        else if (e.keyCode == '65') {
            world.stage.room.rotation += 2
      }
        else if (e.keyCode == '68') {
            world.stage.room.rotation -= 2
      }
        else if (e.keyCode == '87') {
           world.stage.room.skewX += 5
      }
        else if (e.keyCode == '83') {
           world.stage.room.skewX -= 5
      }
        else if (e.keyCode == '81') {
           world.stage.room.scaleY += 0.1
           world.stage.room.scaleX += 0.1
      }
        else if (e.keyCode == '69') {
           world.stage.room.scaleY -= 0.1
           world.stage.room.scaleX -= 0.1
      }

}
})();