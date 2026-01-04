// ==UserScript==
// @name         Rotate Telegram Web
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Addding button to rotate images and videos
// @author       Pink team
// @match        https://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526726/Rotate%20Telegram%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/526726/Rotate%20Telegram%20Web.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function createButton() {
    const button = document.createElement("button");

    button.classList.add("btn-icon");

    button.id = "rotate-button";
    button.innerHTML = `
        <span
            class="tgico button-icon" 
            style="
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            "
        >
            <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="11.98 0.62 190.05 213.4" style="width: 20px; height: 20px;">
               <path fill="currentColor" d="M202 95c0 47-33 85-77 94v25l-69-40 69-40v24a65 65 0 1 0-77-35l-27 13a95 95 0 1 1 181-40z"/>
            </svg>
        </span>
    `;

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const image = document.querySelector(".media-viewer-aspecter img");
      const video = document.querySelector(".ckin__video");

      const mediaElement = image || video;

      if (!mediaElement) return;

      const mover = document.querySelector(".media-viewer-mover");

      const videoThumbnail = document.querySelector(
        ".media-viewer-aspecter .canvas-thumbnail"
      );

      let currentRotation = parseInt(mediaElement.dataset.rotation) || 0;

      currentRotation += 90;

      let originalWidth = mediaElement.dataset.originalWidth;
      let originalHeight = mediaElement.dataset.originalHeight;

      if (!originalWidth || !originalHeight) {
        originalWidth = mover.style.width.replace("px", "");
        originalHeight = mover.style.height.replace("px", "");

        mediaElement.dataset.originalWidth = originalWidth;
        mediaElement.dataset.originalHeight = originalHeight;

        mediaElement.style.minWidth = originalWidth + "px";
        mediaElement.style.minHeight = originalHeight + "px";
      }

      let newWidth, newHeight;

      switch (currentRotation % 360) {
        case 90:
        case 270:
          newWidth = originalHeight;
          newHeight = originalWidth;
          break;
        default:
          newWidth = originalWidth;
          newHeight = originalHeight;
          break;
      }

      mediaElement.dataset.rotation = currentRotation;
      mediaElement.style.transform = `rotate(${currentRotation}deg)`;

      if (videoThumbnail) {
        videoThumbnail.dataset.rotation = currentRotation;
        videoThumbnail.style.transform = `rotate(${currentRotation}deg)`;
      }

      mover.style.width = `${newWidth}px`;
      mover.style.height = `${newHeight}px`;
    });

    return button;
  }

  function addButtonToMediaViewerButtons() {
    const mediaViewerButtons = document.querySelector(".media-viewer-buttons");

    if (mediaViewerButtons && !document.querySelector("#rotate-button")) {
      const downloadButton = mediaViewerButtons.querySelectorAll(".btn-icon")[2];

      downloadButton.after(createButton());
    }

    const mediaViewerAspecter = document.querySelector(
      ".media-viewer-aspecter img"
    );

    if (mediaViewerAspecter) {
      mediaViewerAspecter.style.transition = "transform var(--open-duration)";
    }

    const mediaViewerMover = document.querySelector(".media-viewer-mover");

    if (mediaViewerMover) {
      mediaViewerMover.style.overflow = "visible";
    }

    const video = document.querySelector(".ckin__video");

    if (video) {
      video.style.transition = "transform var(--open-duration)";
    }

    const videoThumbnail = document.querySelector(
      ".media-viewer-aspecter .canvas-thumbnail"
    );

    if (videoThumbnail) {
      videoThumbnail.style.transition = "transform var(--open-duration)";
    }
  }

  const observer = new MutationObserver(() => {
    addButtonToMediaViewerButtons();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  addButtonToMediaViewerButtons();
})();
