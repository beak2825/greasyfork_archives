// ==UserScript==
// @name           Dark Mode - KinoHype.me
// @name:ru        Dark Mode - KinoHype.me
// @namespace      Violentmonkey Scripts
// @match          https://kinohype.me/*
// @grant          none
// @version        1.0
// @author         bershanskiy
// @description    Automatically enables Dark Mode on KinoHype.me based on user's system-wide setting.
// @description:ru Автоматически включает Темный Режим на KinoHype.me в соответствии с системной настройкой.
// @downloadURL https://update.greasyfork.org/scripts/396781/Dark%20Mode%20-%20KinoHypeme.user.js
// @updateURL https://update.greasyfork.org/scripts/396781/Dark%20Mode%20-%20KinoHypeme.meta.js
// ==/UserScript==

const query = "(prefers-color-scheme: dark)";
const CSSClass = "site-dark";
const isCurrentlyDark = () => document.body.classList.contains(CSSClass);

const main = () => {
  const mediaQuery = window.matchMedia(query);

  if (isCurrentlyDark() !== mediaQuery.matches) {
    document.body.classList.toggle(CSSClass);
  }

  mediaQuery.addEventListener("change", e => {
    if (isCurrentlyDark() !== e.matches) {
      document.body.classList.toggle(CSSClass);
    }
  });
}

if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}
