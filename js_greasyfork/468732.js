// ==UserScript==
// @name         blockPage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blocks the page by adding a semitransparent white overlay on top of it.
// @author       IgnaV
// @grant        none
// ==/UserScript==
 
const blockPage = () => {
  const overlay = document.createElement("div");
  overlay.id = "page-overlay";
  overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.5);";
  document.body.appendChild(overlay);
};

const unblockPage = () => {
  const overlay = document.querySelector("#page-overlay");
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }
};

