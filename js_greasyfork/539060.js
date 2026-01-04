// ==UserScript==
// @name         Heritage Chinese Cheater
// @namespace    http://tampermonkey.net/
// @version      2025-06-09
// @description  a cheatkit for heritage chinese
// @license      AGPL-3.0
// @author       You
// @match        *://*.heritagechinese.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heritagechinese.com
// @require      https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/539060/Heritage%20Chinese%20Cheater.user.js
// @updateURL https://update.greasyfork.org/scripts/539060/Heritage%20Chinese%20Cheater.meta.js
// ==/UserScript==
(function (DOMPurify) {
  "use strict";

  window.addEventListener("load", () => {
    const win = unsafeWindow;
    const registerCmd = GM_registerMenuCommand;
    const random = (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min);

    function unescapeString(str) {
      return str
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r")
        .replace(/\\f/g, "\f")
        .replace(/\\b/g, "\b")
        .replace(/\\v/g, "\v");
    }

    registerCmd("Skip Activity/Game", () => {
      if (location.pathname.endsWith("game_runner.html")) {
        win.completeGame({
          stars: 3,
          timeUsed: +prompt("Enter time it took in seconds") || random(52, 86),
          score: 1,
          totalScore: +prompt("Enter score") || random(195, 210),
        });
      }
      win.nextActivity();
    });

    registerCmd("Skip Reading", () => {
      while (!win.karaokePlayer.onLastPage) {
        win.karaokePlayer.displayNextPage();
      }
      document.querySelector("#play-btn").click();
      document.querySelectorAll("vocab").forEach((v) => v.click());
    });

    registerCmd("Show Full Article", () => {
      const article = window.open();
      article.document.head.innerHTML = `
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap" rel="stylesheet">
        <style>
        p { font-size: 1.25rem; font-family: 'Noto Sans SC', 'Arial', sans-serif; }
        h1 { font-size: 2.5rem; font-family: 'Noto Sans SC', 'Arial', sans-serif; }
        </style>
        `;
      article.document.body.innerHTML = `<h1>Loading...</h1>`;
      setTimeout(async () => {
        article.document.body.innerHTML = `
        <h1>Article Text</h1>
        <p>${DOMPurify.sanitize(
          unescapeString(
            JSON.parse(document.querySelector("#activity-data").value)
              .map((item) => item.text || "")
              .join("")
          )
        )
          .replace(/\n/g, "<br>")
          .replace(/[\f\r\b\v]/g, "")
          .replace(/\t/g, "&emsp;")
          .replace(/(<br>){2,}/g, "<br>")}
          </p>
        `;
      }, 500);
    });
  });
})(DOMPurify);
