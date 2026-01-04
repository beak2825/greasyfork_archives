// ==UserScript==
// @name         Lowercase name FV CLient addon
// @version      1.0
// @description  FV-client add - on
// @author       M4tr1x#5555
// @match        https://starblast.io/
// @grant        none
// @license      MIT
// @namespace     https://greasyfork.org/en/users/926687-m4tr1x
// @downloadURL https://update.greasyfork.org/scripts/450346/Lowercase%20name%20FV%20CLient%20addon.user.js
// @updateURL https://update.greasyfork.org/scripts/450346/Lowercase%20name%20FV%20CLient%20addon.meta.js
// ==/UserScript==

let g = setInterval(function () {
  try {
    document.querySelector(".player-app, #player input").style.textTransform = "none";
    clearInterval(g)
  }
  catch (e) {}
}, 1);

let x = Object.values(Object.values(module.exports.settings).find(v => v && v.mode)).find(v => v && "function" == typeof v.startModdingMode);
if (x) x.startGame = Function("return " + x.startGame.toString().replace(/\.toUpperCase\(\)/g, ""))();