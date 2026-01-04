// ==UserScript==
// @name         Arras.io crosshair pointer
// @version      1.2.0
// @description  Change the mouse pointer to a crosshair. Might improve your Aim..
// @author       AstRatJP
// @match        *://arras.io/*
// @run-at       document-idle
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/446861/Arrasio%20crosshair%20pointer.user.js
// @updateURL https://update.greasyfork.org/scripts/446861/Arrasio%20crosshair%20pointer.meta.js
// ==/UserScript==
const bodyObserver = new MutationObserver((mutations, obs) => {
  const canvas = document.querySelector("#canvas");
  if (canvas) {
    obs.disconnect();

    canvas.style.setProperty("cursor", "crosshair", "important");

    const attrObserver = new MutationObserver(() => {
      canvas.style.setProperty("cursor", "crosshair", "important");
    });

    attrObserver.observe(canvas, {
      attributes: true,
      attributeFilter: ['style']
    });
  }
});

bodyObserver.observe(document.body, {
  childList: true,
  subtree: true
});
