// ==UserScript==
// @name         diep skin saikyou
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SS_tenchan
// @match        *://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405775/diep%20skin%20saikyou.user.js
// @updateURL https://update.greasyfork.org/scripts/405775/diep%20skin%20saikyou.meta.js
// ==/UserScript==

(function() {
    var ctx = document.getElementById("canvas").getContext("2d");
    var madman = new Image();
    madman.src = "https://i.imgur.com/J5vcTjN.png";
    ctx.arc = function(x, y, r) { ctx.drawImage(madman, x - r, y - r, r * 2, r * 2); }
})();