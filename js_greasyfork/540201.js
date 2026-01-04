// ==UserScript==
// @name         No-Noise: Smarter Comment Blurrer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blur YouTube, Reddit, Instagram comments containing toxic keywords with click-to-reveal
// @author       @cys28-in
// @match        https://www.youtube.com/*
// @match        https://www.reddit.com/*
// @match        https://www.instagram.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540201/No-Noise%3A%20Smarter%20Comment%20Blurrer.user.js
// @updateURL https://update.greasyfork.org/scripts/540201/No-Noise%3A%20Smarter%20Comment%20Blurrer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // default keywords list
  const negKeywords = ["cringe", "sucks", "boring", "hate", "trash"];
  const posKeywords = [
    "awesome",
    "love",
    "amazing",
    "incredible",
    "wholesome",
    "respect",
  ];

  // load keywords from localStorage or use defaults
  const negativeKeywords = JSON.parse(
    localStorage.getItem("noNoiseNeg") || JSON.stringify(negKeywords)
  );
  const positiveKeywords = JSON.parse(
    localStorage.getItem("noNoisePos") || JSON.stringify(posKeywords)
  );

  // custom style for negative comments
  const NEGATIVE_STYLE = `
    filter: blur(6px);
    transition: filter 0.3s ease-in-out;
    cursor: pointer;
  `;

  // custom style for positive comments
  const POSITIVE_STYLE = `
    background-color: #d6f5d6;
    border-radius: 6px;
    padding: 4px 6px;
    display: inline-block;
  `;

  // function to handle comments
  const observer = new MutationObserver(() => handleComments());
  observer.observe(document.body, { childList: true, subtree: true });

  // main function to handle comments based on platform, which add negative and positive styles to comments
  function handleComments() {
    const selectors = {
      "www.youtube.com": "#content-text",
      "www.reddit.com": "div[data-testid='comment']",
      "www.instagram.com": "ul > div > li > div > div > div > span",
    };

    const selector = selectors[location.hostname];

    if (!selector) return;

    document
      .querySelectorAll(`${selector}:not(.no-noise-scanned)`)
      .forEach((comment) => {
        const text = comment.textContent.toLowerCase();
        comment.classList.add("no-noise-scanned");

        // Negative comments adding blur effect
        if (negativeKeywords.some((word) => text.includes(word))) {
          comment.setAttribute("style", NEGATIVE_STYLE);
          comment.title = "Click to reveal";
          comment.addEventListener(
            "click",
            () => (comment.style.filter = "none"),
            { once: true }
          );
        }

        // Positive comments adding highlight effect
        if (positiveKeywords.some((word) => text.includes(word))) {
          comment.setAttribute("style", POSITIVE_STYLE);
          comment.textContent = "🌟 " + comment.textContent.trim() + " 🌟";
        }
      });
  }

  // update keywords in localStorage
  window.NoNoise = {
    // for negative keywords
    setNeg: () => {
      const newNeg = prompt(
        "Enter negative keywords (comma separated):",
        negativeKeywords.join(",")
      );
      if (newNeg) {
        const arr = newNeg.split(",").map((word) => word.trim().toLowerCase());
        localStorage.setItem("noNoiseNeg", JSON.stringify(arr));
        alert("Negative keywords updated!");
      }
    },
    // for positive keywords
    setPos: () => {
      const newPos = prompt(
        "Enter positive keywords (comma separated):",
        positiveKeywords.join(",")
      );
      if (newPos) {
        const arr = newPos.split(",").map((word) => word.trim().toLowerCase());
        localStorage.setItem("noNoisePos", JSON.stringify(arr));
        alert("Positive keywords updated!");
      }
    },
    // reset all localStorage items and reload the page
    reset: () => {
      localStorage.removeItem("noNoiseNeg");
      localStorage.removeItem("noNoisePos");
      location.reload();
    },
  };
})();
