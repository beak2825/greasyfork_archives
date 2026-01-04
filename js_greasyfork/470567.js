// ==UserScript==
// @name         Bababot AntiDot Plugin
// @namespace    https://github.com/bababoyisntapopularname
// @version      v1.0public
// @license      GPLv3
// @description  Bababot
// @author       Bababoy
// @match        https://pixelplace.io/*
// @icon         https://i.imgur.com/PCn4MjQ.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470567/Bababot%20AntiDot%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/470567/Bababot%20AntiDot%20Plugin.meta.js
// ==/UserScript==

/* antiDot API:
    antiDot(name) -> None:
        creates a new antiDot object with the given name on global scope
    antiDot:
        protectedArea : [ [x1, x2], [y1, y2] ] protects the area defined by protectedArea
        color         : color id (0-38) of pixels to be placed
        targetColor?  : optional color id (0-38) for antiDot to only replace pixels with
        destroy()     : stops the antiDot
        activate()    : activates the antiDot
*/
/* globals Tasker, BababotWS */
function antiDot(globalName) {
  var cfg = {
    protectedArea: undefined,
    color: undefined,
    targetColor: undefined,
  };
  var destroyed = false;
  Bababot.BababotWS.BBY_on("p", function (content) {
    for (let colorPacket of content) {
      let x = colorPacket[0];
      let y = colorPacket[1];
      let color = colorPacket[2];
      if (
        cfg.protectedArea[0][1] > x &&
        x > cfg.protectedArea[0][0] &&
        cfg.protectedArea[1][1] > y &&
        y > cfg.protectedArea[1][0]
      ) {
        if (cfg.targetColor != undefined && cfg.targetColor != color) {
          continue;
        }
        if (color != cfg.color) {
          Bababot.Tasker.addTask({ x: x, y: y, color: cfg.color });
        }
      }
    }
  });
  function destroy() {
    destroyed = true;
  }
  function activate() {
    destroyed = false;
  }
  window[globalName || "stuff"] = {
    config: cfg,
    code: 0,
    tasker: Bababot.Tasker,
    destroy: destroy,
    activate: activate,
  };
}
window.antiDot = antiDot;