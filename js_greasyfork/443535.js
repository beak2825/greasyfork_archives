// ==UserScript==
// @name        CSS Challenges Diff View
// @namespace   https://greasyfork.org/en/users/830433-vintprox
// @description Userscript that allows you to easily see the differences between your result and preview of the challenge. One may say that it's inspired by diff view on CSSBattle, but with more convenience.
// @version     1.0
// @license     MIT
// @author      vintprox
// @match       https://css-challenges.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/443535/CSS%20Challenges%20Diff%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/443535/CSS%20Challenges%20Diff%20View.meta.js
// ==/UserScript==

(function() {
  const output = document.querySelector(".code_container .output");
  if (!output) {
    return;
  }

  const style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(`
    .code_container>.output:after {
      z-index: 10;
      pointer-events: none;
    }
    .diffview {
      position: absolute;
      inset: 0;
      cursor: ew-resize;
      z-index: 1;
      --wipe: 100%;
      --opacity: 100%;
    }
    .diffview::after {
      content: "";
      position: absolute;
      inset: 0 auto;
      left: var(--wipe);
      border-left: 1px solid #c39f76;
      transform: translateX(-50%);
      opacity: var(--opacity);
      mix-blend-mode: difference;
    }
    .diffview-image {
      border: 0 !important;
      clip-path: polygon(var(--wipe) 0, 100% 0, 100% 100%, var(--wipe) 100%);
      pointer-events: none;
    }
  `));
  document.head.appendChild(style);

  const preview = document.querySelector(".code_container .preview");
  const previewImage = preview.querySelector("img");

  const diffview = document.createElement("div");
  diffview.classList.add("diffview");
  output.appendChild(diffview);

  const diffviewImage = document.createElement("img");
  diffviewImage.classList.add("diffview-image");
  diffviewImage.src = previewImage.src;
  diffview.appendChild(diffviewImage);

  const observer = new MutationObserver(mutationList => {
    diffviewImage.src = mutationList[0].target.src;
  });
  observer.observe(previewImage, {attributeFilter: ["src"]});

  diffview.addEventListener("mousemove", _.throttle(e => {
    let wipe = e.offsetX / diffview.offsetWidth * 100;
    let opacity = Math.min(100, Math.max(0, 100 - (e.offsetY - 50) * 1.5 / diffview.offsetHeight * 100));
    diffview.style.setProperty("--wipe", wipe + "%");
    diffview.style.setProperty("--opacity", opacity + "%");
  }, 50, {trailing: false}));

  diffview.addEventListener("mouseleave", e => {
    diffview.style.setProperty("--wipe", "100%");
    diffview.style.setProperty("--opacity", "0%");
  });
})();
