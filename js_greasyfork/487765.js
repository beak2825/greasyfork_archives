// ==UserScript==
// @name         Rush Team Bypass
// @namespace    s_ambigious
// @version      2024-01-26
// @description  Remove distractions from Rush Team
// @author       @ambigious
// @match        https://www.gaming-style.com/RushTeam/index.php?page=Game
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaming-style.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487765/Rush%20Team%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/487765/Rush%20Team%20Bypass.meta.js
// ==/UserScript==

window.addEventListener("load", () => {
  const el = Object.assign(document.createElement("iframe"), {
    src: "https://www.gaming-style.com/RushTeam/RushTeamWebGL/index.php",
    frameBorder: "0",
    scrolling: "no",
    allowFullscreen: "true",
  });

  Object.assign(el.style, { width: "100vw", height: "100vh" });

  document.body.replaceChildren(el);
  document.body.style.overflow = "hidden";
});
