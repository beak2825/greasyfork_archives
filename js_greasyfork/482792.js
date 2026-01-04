// ==UserScript==
// @name        Nightshade
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     0.1.1
// @license     MIT
// @include     *
// @author      naught0
// @description Make the web a bit less blinding
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/482792/Nightshade.user.js
// @updateURL https://update.greasyfork.org/scripts/482792/Nightshade.meta.js
// ==/UserScript==

(() => {
  let enabled = localStorage.getItem("nightshade-enabled") === "true";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 15;
  slider.max = 80;
  slider.defaultValue = localStorage.getItem("nightshade-opacity") ?? 60;

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "row";
  container.style.alignItems = "center";
  container.style.gap = "1rem";
  container.style.minWidth = "64px";
  container.style.width = "128px";
  container.style.background = "transparent";
  container.style.zIndex = 1_000_000;
  container.style.position = "fixed";
  container.style.bottom = "13px";
  container.style.right = "13px";
  container.style.opacity = 0.5;
  container.onmouseover = () => {
    container.style.opacity = 0.85;
  };
  container.onmouseout = () => {
    container.style.opacity = 0.5;
  };

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.left = 0;
  overlay.style.right = 0;
  overlay.style.top = 0;
  overlay.style.bottom = 0;
  overlay.style.backgroundColor = `rgba(0, 0, 0, 0.${enabled ? slider.defaultValue : 0})`;
  overlay.style.zIndex = 999_999;
  overlay.style.height = "100vh";
  overlay.style.width = "100vw";
  overlay.style.overflow = "clip";
  overlay.style.pointerEvents = "none";

  slider.onchange = (e) => {
    overlay.style.backgroundColor = `rgba(0, 0, 0, 0.${e.target.value})`;
    localStorage.setItem("nightshade-opacity", e.target.value);
    slider.defaultValue = e.target.value;
  };

  const btn = document.createElement("button");
  btn.style.all = "unset";
  btn.style.cursor = "pointer";
  btn.innerText = !enabled ? "🌑" : "☀️";
  btn.onclick = () => {
    enabled = !enabled;
    localStorage.setItem("nightshade-enabled", String(enabled));

    if (!enabled) {
      overlay.style.backgroundColor = "transparent";
      btn.innerText = "🌑";
    } else {
      overlay.style.backgroundColor = `rgba(0, 0, 0, 0.${slider.defaultValue})`;
      btn.innerText = "☀️";
    }
  };

  container.appendChild(btn);
  container.appendChild(slider);
  document.body.appendChild(container);
  document.body.prepend(overlay);
})();
