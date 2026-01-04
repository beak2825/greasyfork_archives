// ==UserScript==
// @name         Stake Blur
// @namespace    http://tampermonkey.net/
// @version      1.6
// @author       Dave
// @description  Blur Stake Logos
// @match        *://stake.com/*
// @match        *://stake.bet/*
// @match        *://stake.ac/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532921/Stake%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/532921/Stake%20Blur.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const mainBlurValue = "5px";
  const extraBlurValue = "4px";

  const replacements = {
    blackjack: "https://i.postimg.cc/QMT3fZ1V/image.png",
    baccarat: "https://i.postimg.cc/7ZLPMRKT/image-1.png"
  };

  function blurElements(node) {
    node.querySelectorAll("svg.svelte-md2ju7").forEach(el => {
      if (el.getAttribute("viewBox") !== "0 0 396.11 197.92") {
        el.style.filter = `blur(${mainBlurValue})`;
      }
    });
    node.querySelectorAll('svg[width="885"][height="465"]').forEach(el => {
      el.style.filter = `blur(${mainBlurValue})`;
    });
    node.querySelectorAll('img[alt="Stake Logo"], img[alt="stake logo"]').forEach(el => {
      el.style.filter = `blur(${mainBlurValue})`;
    });
    node.querySelectorAll('img[alt="Sports"]').forEach(el => {
      el.style.filter = `blur(${mainBlurValue})`;
    });
    node.querySelectorAll("div.back.svelte-1cwyebm").forEach(el => {
      el.style.filter = `blur(${mainBlurValue})`;
    });
    node.querySelectorAll('img[alt="Stake Originals"]').forEach(el => {
      el.style.filter = `blur(${mainBlurValue})`;
    });
  }

  function blurExtraElements(node) {
    node.querySelectorAll(".back.svelte-mru6at.face-down").forEach(el => {
      el.style.filter = `blur(${extraBlurValue})`;
    });
  }

  function replaceImages(node) {
    Object.keys(replacements).forEach(id => {
      const img = node.querySelector(`#${id}`);
      if (img && img.src !== replacements[id]) {
        img.src = replacements[id];
        img.srcset = ""; // optional: remove srcset to prevent overwriting
      }
    });
  }

  function processNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      blurElements(node);
      blurExtraElements(node);
      replaceImages(node);
    }
  }

  processNode(document);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        processNode(node);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Recheck periodically in case DOM changes dynamically
  setInterval(() => { processNode(document); }, 1000);
})();
