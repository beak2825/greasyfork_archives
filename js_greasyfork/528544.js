// ==UserScript==
// @name         Outline already faved
// @namespace    https://github.com/f1r3w4rr10r/fa-utils
// @version      1.0.1
// @description  This automatically outlines submissions, that are already faved.
// @author       f1r3w4rr10r
// @match        https://www.furaffinity.net/gallery/*
// @match        https://www.furaffinity.net/scraps/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528544/Outline%20already%20faved.user.js
// @updateURL https://update.greasyfork.org/scripts/528544/Outline%20already%20faved.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  /**
   * @param {Element} figure
   * @returns {Promise<boolean>}
   */
  async function checkIfFaved(figure) {
    const url = figure.querySelector("a")?.href;
    if (!url) {
      console.error("Could not extract URL from figure.", figure);
      throw new Error(`Could not extract URL from figure.`);
    }

    const result = await fetch(url);
    if (!result.ok) {
      console.error("Could not get faved status.", url, result);
      throw new Error("Could not get faved status");
    }

    const doc = new DOMParser().parseFromString(
      await result.text(),
      "text/html",
    );

    const unfavButton = doc.querySelector('.favorite-nav > [href^="/unfav/"]');
    return unfavButton instanceof HTMLAnchorElement;
  }

  /**
   * @yields {Promise<boolean>}
   */
  async function* iterateFigures() {
    const figures = Array.from(
      document.querySelectorAll("section.gallery figure"),
    );

    for (const figure of figures) {
      const isFaved = await checkIfFaved(figure);
      if (isFaved) figure.classList.add("faved");
      yield isFaved;
    }
  }

  const sheet = new CSSStyleSheet();
  sheet.replaceSync("figure.faved { outline: green 3px solid; }");
  document.adoptedStyleSheets.push(sheet);

  const submissionList = document.querySelector(".submission-list");
  if (!submissionList) throw new Error("Could not find the submission list.");

  const baseMessage = "Selecting faved submissions…";

  const messagePara = document.createElement("p");
  messagePara.textContent = baseMessage;
  submissionList.prepend(messagePara);

  let checked = 0;
  let faved = 0;

  for await (const isFaved of iterateFigures()) {
    if (isFaved) faved += 1;
    checked += 1;

    messagePara.textContent = `${baseMessage} ${faved}/${checked}`;
  }

  messagePara.textContent = `Selected ${faved}/${checked} faved submissions.`;
})();
