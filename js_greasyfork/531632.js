// ==UserScript==
// @grant          none
// @version        0.0.1
// @author         eye-wave
// @icon           https://raw.githubusercontent.com/eye-wave/greasy-fork/main/packages/spotify-unsupported-fix/assets/icon.svg
// @license        GPL-3.0+
// @name           spotify.com - Unsupported fix
// @namespace      Spotify tools
// @match          https://open.spotify.com/*
// @description    Replaces 'Get the App' button with 'Open in App' instead for unsupported browsers.
// @downloadURL https://update.greasyfork.org/scripts/531632/spotifycom%20-%20Unsupported%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/531632/spotifycom%20-%20Unsupported%20fix.meta.js
// ==/UserScript==
// ../../utils/src/index.ts
function $s(query) {
  return document.querySelector(query);
}

// src/index.ts
var btn = $s("a.primary");
if (btn) {
  const url = "spotify" + location.pathname.replace("/", ":");
  btn.href = url;
  btn.textContent = "Open in App";
}
