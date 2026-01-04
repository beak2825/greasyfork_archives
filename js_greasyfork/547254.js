// ==UserScript==
// @name         DartConnect API Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přidá tlačítko "API JSON" přímo do horního headeru na stránce Matches
// @author       JV
// @license      MIT
// @match        https://tv.dartconnect.com/event/*/matches*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547254/DartConnect%20API%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/547254/DartConnect%20API%20Button.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // z URL zjistíme eventId
  const match = window.location.href.match(/event\/([^/]+)/);
  const eventId = match ? match[1] : null;
  if (!eventId) return;

  const apiUrl = `https://tv.dartconnect.com/event/${eventId}/state/all?fetch_type=initial`;

  // vytvoření tlačítka
  const btn = document.createElement("button");
  btn.textContent = "API JSON";
  btn.style.marginLeft = "12px";
  btn.style.padding = "4px 10px";
  btn.style.background = "#2563eb"; // modrá (tailwind blue-600)
  btn.style.color = "white";
  btn.style.fontWeight = "bold";
  btn.style.border = "none";
  btn.style.borderRadius = "4px";
  btn.style.cursor = "pointer";

  btn.addEventListener("click", () => {
    window.open(apiUrl, "_blank");
  });

  // vložíme tlačítko do headeru (vedle názvu eventu)
  const header = document.querySelector("header#header .pdc-header h1");
  if (header) {
    header.parentElement.appendChild(btn);
  } else {
    // fallback: přidáme tlačítko na začátek body
    document.body.insertBefore(btn, document.body.firstChild);
  }
})();