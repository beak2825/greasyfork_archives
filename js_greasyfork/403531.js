// ==UserScript==
// @name         ver dentro da base
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match      http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403531/ver%20dentro%20da%20base.user.js
// @updateURL https://update.greasyfork.org/scripts/403531/ver%20dentro%20da%20base.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
window.renderPlayer = function(a, d, c, b, g) {//base transparente:)
  b.save();
  if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
    var e = new Image;
    e.onload = function() {
      this.readyToDraw = !0;
      this.onload = null;
      g == currentSkin && changeSkin(0);
    };
    e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";
    skinSprites[a.skin] = e;
  }
  a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgba(255, 255, 255, 0)", renderCircle(d, c, a.size, b));
  b.restore();
};
   