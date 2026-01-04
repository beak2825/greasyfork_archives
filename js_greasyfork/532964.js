// ==UserScript==
// @name         github image preview
// @namespace    http://tampermonkey.net/
// @version      2025-04-15.1
// @description  Preview images in a popup previewer instead of opening them in a new tab
// @author       Blake Stacks
// @match        https://github.com/*/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532964/github%20image%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/532964/github%20image%20preview.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const visitedClass = "preview-attached";
  const attachPreviews = () => {
    document.body
      .querySelectorAll(
        `.markdown-body img:not(.${visitedClass}), .comment-body img:not(.${visitedClass})`
      )
      .forEach((img) => {
        const src = img.src;
        const preview = document.createElement("img");
        preview.src = src;
        preview.style.maxWidth = "100%";
        preview.style.maxHeight = "100%";
        preview.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        preview.style.borderRadius = "1em";
        preview.style.border = "2px solid rgba(255,255,255,0.1)";
        preview.style.backgroundColor = "rgba(255,255,255,0.1)";
        preview.style.flexGrow = "1";
        preview.style.flexShrink = "1";

        const previewContainer = document.createElement("div");
        previewContainer.style.maxWidth = "100%";
        previewContainer.style.minHeight = "0";
        previewContainer.style.flexGrow = "1";
        previewContainer.style.flexShrink = "1";
        previewContainer.style.display = "flex";
        previewContainer.style.justifyContent = "center";
        previewContainer.style.alignItems = "center";
        previewContainer.appendChild(preview);

        const previewOverlay = document.createElement("div");
        previewOverlay.style.position = "fixed";
        previewOverlay.style.top = "0";
        previewOverlay.style.left = "0";
        previewOverlay.style.width = "100%";
        previewOverlay.style.height = "100%";
        previewOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        previewOverlay.style.display = "flex";
        previewOverlay.style.flexDirection = "column";
        previewOverlay.style.justifyContent = "center";
        previewOverlay.style.alignItems = "center";
        previewOverlay.style.zIndex = "9998";
        previewOverlay.style.gap = "1em";
        previewOverlay.style.padding = "2em";
        previewOverlay.style.maxHeight = "100%";
        previewOverlay.addEventListener("click", (e) => {
          if (e.target !== previewOverlay) return;
          previewOverlay.remove();
        });

        const closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.backgroundColor = "white";
        closeButton.style.color = "black";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = ".5em";
        closeButton.style.padding = "10px 20px";
        closeButton.addEventListener("click", () => {
          previewOverlay.remove();
        });

        const downloadButton = document.createElement("a");
        downloadButton.href = src;
        downloadButton.download = src.split("/").pop();
        downloadButton.innerText = "Download";
        downloadButton.style.backgroundColor = "white";
        downloadButton.style.color = "black";
        downloadButton.style.border = "none";
        downloadButton.style.borderRadius = ".5em";
        downloadButton.style.padding = "10px 20px";
        downloadButton.style.textDecoration = "none";

        previewOverlay.appendChild(previewContainer);
        previewOverlay.appendChild(closeButton);
        previewOverlay.appendChild(downloadButton);

        img.classList.add(visitedClass);
        img.addEventListener("click", (e) => {
          document.body.appendChild(previewOverlay);
          e.preventDefault();
          e.stopPropagation();
        });
      });
  };
  setInterval(attachPreviews, 10000);
  attachPreviews();
})();
