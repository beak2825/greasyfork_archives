// ==UserScript==
// @name         Krew.IO CHEAT
// @version      0.1
// @description  Work in progress
// @author       ɹaɹoldxa ʇauɹaʇu!#2036
// @match        ://krew.io/
// @require      https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js
// @namespace https://greasyfork.org/users/673829
// @downloadURL https://update.greasyfork.org/scripts/408294/KrewIO%20CHEAT.user.js
// @updateURL https://update.greasyfork.org/scripts/408294/KrewIO%20CHEAT.meta.js
// ==/UserScript==
(function() {
   'use strict';
   const gui = new dat.GUI();
   var settings = {};
   // settings['Tracers'] = false; (WIP)
   settings['ESP'] = false;
   settings['No Fog'] = false;
   gui.addFolder('Krew.io Mod');
   gui.add(settings, 'ESP', true);
   // gui.add(settings, 'Tracers', true); (WIP)
   gui.add(settings, 'No Fog', true);
   var css = document.createElement('style');
   var styles = '.dg.ac { z-index:9999; }';
   css.appendChild(document.createTextNode(styles));
   document.head.appendChild(css);

   function tick() {
      try {
         var scene = water.parent;
         scene.fog.density = (settings['No Fog'] ? 0 : scene.fog.density = .007);
         var players = scene.children.filter(c => c.children[0] && c.children[0].name == "body");
         players.forEach(player => {
            player.traverse(child => {
               if (child.type == "Mesh" && child.material.color) {
                  if (!child.defaultColor) child.defaultColor = child.material.color;
                  child.material.depthTest = (settings['ESP'] ? false : true);
                  child.material.color = (settings['ESP'] ? {
                     r: 0,
                     g: 1,
                     b: 0
                  } : child.defaultColor);
               }
            })
         });
      } catch (e) {}
      requestAnimationFrame(tick);
   }
   requestAnimationFrame(tick);
})();