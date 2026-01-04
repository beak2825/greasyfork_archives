// ==UserScript==
// @name       Youtube auto rco=1
// @name:ru    Youtube авто rco=1
// @author     KN13KOMETA
// @version    1.2.1
// @namespace  https://violentmonkey.github.io

// @description       Automatically adds rco=1 to avoid "This video may be inappropriate for some users."
// @description:ru    Автоматически добавляет rco=1 чтобы избежать "Это видео может оказаться неприемлемым для некоторых пользователей."

// @supportURL  https://discord.gg/d4rKqZs
// @homepageURL https://discord.gg/d4rKqZs

// @match  https://www.youtube.com/*
// @run-at document-start

// @license UNLICENSE
// @downloadURL https://update.greasyfork.org/scripts/544924/Youtube%20auto%20rco%3D1.user.js
// @updateURL https://update.greasyfork.org/scripts/544924/Youtube%20auto%20rco%3D1.meta.js
// ==/UserScript==

console.log("Youtube auto rco=1 loaded");

new MutationObserver(_mut => {
  const lc = window.location;

  if (lc.pathname != "/watch") return;
  if (lc.search.indexOf("rco=1") != -1) return;

  console.log("/watch page detected, reloading page with rco=1");
  window.history.replaceState({}, null, lc.href + (lc.search.endsWith("&") ? "rco=1" : "&rco=1"));
  lc.reload();
}).observe(
  document,
  {
    subtree: true,
    childList: true
  }
);
