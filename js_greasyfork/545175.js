// ==UserScript==
// @grant          none
// @version        0.0.3
// @author         eye-wave
// @icon           https://raw.githubusercontent.com/eye-wave/greasy-fork/main/packages/chosic-export-spotify/assets/icon.svg
// @license        GPL-3.0+
// @name           chosic.com - export playlist 
// @namespace      Spotify tools
// @match          https://www.chosic.com/*
// @description    Allows exporting playlist from chosic.com to clipboard without loggin in.
// @downloadURL https://update.greasyfork.org/scripts/545175/chosiccom%20-%20export%20playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/545175/chosiccom%20-%20export%20playlist.meta.js
// ==/UserScript==
// ../../utils/src/index.ts
function $(query) {
  return document.querySelectorAll(query);
}
function $s(query) {
  return document.querySelector(query);
}
function copyToClipboard(data) {
  try {
    const text = typeof data === "string" ? data : JSON.stringify(data);
    navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = typeof data === "string" ? data : JSON.stringify(data);
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

// src/main.ts
var btn = $s(".save-playlist>button");
btn && (btn.onclick = () => {
  const list = Array.from($(".fa-spotify"));
  const items = list.reduce((acc, item) => {
    const id = item.getAttribute("data-song-id");
    if (id)
      acc.push(id);
    return acc;
  }, []);
  copyToClipboard(items.join("\n"));
});
