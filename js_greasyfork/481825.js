// ==UserScript==
// @name        Soundgasm Links
// @namespace   Soundgasm
// @match       *://soundgasm.net/u/*/*
// @grant       none
// @version     1.0
// @author      -
// @description Adds direct audio link and player to pages.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481825/Soundgasm%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/481825/Soundgasm%20Links.meta.js
// ==/UserScript==

(function() {

  function source() {
    const source_url = document.getElementById("jp_audio_0").getAttribute("src");
    return source_url;
  }

  function waitForSource(callback, timeout) {
    const start = performance.now();
    const check = setInterval(function() {
      const source = document.getElementById("jp_audio_0");
      if (source !== null) {
        clearInterval(check);
        callback(source);
      } else if (performance.now() - start > timeout) {
        clearInterval(check);
      }
    }, 1000);
  }

  function main() {
    waitForSource(function(source) {
      const container = document.getElementsByClassName("jp-type-single")[0];
      const linebreak = document.createElement("br");
      container.appendChild(linebreak);
      const link = document.createElement("a");
      link.style.setProperty("font-size", "14px");
      link.setAttribute("href", source.getAttribute("src"));
      link.innerHTML = source.getAttribute("src");
      container.appendChild(link);
      const audio = document.createElement("audio");
      audio.style.setProperty("width", "100%");
      audio.setAttribute("src", source.getAttribute("src"));
      audio.setAttribute("type", "audio/mpeg");
      audio.setAttribute("controls", true);
      container.appendChild(audio);
    }, 15000);
  }

  main();
})()
