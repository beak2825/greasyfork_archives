// ==UserScript==
// @name         AnimeBytes Group Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  AB Group highlighter
// @match        https://animebytes.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534122/AnimeBytes%20Group%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/534122/AnimeBytes%20Group%20Highlighter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const episodeHeaders = document.querySelectorAll("tr.edition_info");
  let groupCount = 0;

  episodeHeaders.forEach((header) => {
    const groupClass = `epgroup${groupCount % 2 === 0 ? "1" : "2"}`;
    header.classList.add(groupClass);

    let next = header.nextElementSibling;
    while (next && !next.classList.contains("edition_info")) {
      if (
        next.classList.contains("torrent") ||
        next.className.includes("torrent ")
      ) {
        next.classList.add(groupClass);
      }
      next = next.nextElementSibling;
    }

    groupCount++;
  });

  const style = document.createElement('style');
  style.textContent = `
    tr.epgroup1 {
      background-color: #1c1c1c;
    }
    tr.epgroup2 {
      background-color: #2a2a2a;
    }
  `;
  document.head.appendChild(style);
})();