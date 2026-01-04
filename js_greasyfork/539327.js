// ==UserScript==
// @name         Scenexe2.io noDark
// @namespace    http://tampermonkey.net/
// @version      2025-06-13
// @description  Sry cobal :3
// @author       Codi-luvr
// @match        https://scenexe2.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scenexe2.io
// @license CC BY-NC 4.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539327/Scenexe2io%20noDark.user.js
// @updateURL https://update.greasyfork.org/scripts/539327/Scenexe2io%20noDark.meta.js
// ==/UserScript==
 
// This script is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
// You may not use this script for commercial purposes.
 
const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
const originalFillStyle = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "fillStyle");
 
Object.defineProperty(CanvasRenderingContext2D.prototype, "fillStyle", {
  set(value) {
    this.__skipDarkness = typeof value === "string" && value.includes("rgba(0, 0, 0");
    originalFillStyle.set?.call(this, value);
  },
  get() {
    return originalFillStyle.get?.call(this) || "rgba(0,0,0,0)";
  }
});
 
CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
  if (this.__skipDarkness) return;
  return originalFillRect.call(this, x, y, w, h);
};