// ==UserScript==
// @name         Restore Middle-Click on YouTube Thumbnails with Inline Preview
// @version      1
// @description  Restores the middle-click functionality on YouTube's thumbnails with inline preview enabled.
// @author       Aventuum
// @match        https://www.youtube.com/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/1100865-aventuum
// @downloadURL https://update.greasyfork.org/scripts/468769/Restore%20Middle-Click%20on%20YouTube%20Thumbnails%20with%20Inline%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/468769/Restore%20Middle-Click%20on%20YouTube%20Thumbnails%20with%20Inline%20Preview.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("Restoring middle-click functionality");

  function handlePreviewMiddleClick(event) {
    if (event.pointerType === "mouse" && event.button === 1) {
      event.preventDefault();

      window.open(this.href, "_blank");
    }
  }

  function handleThumbnailMouseEnter(event) {
    const thumbnail = event.currentTarget;
    const preview = document.querySelector("ytd-video-preview");

    const url = thumbnail.querySelector("#thumbnail").href;

    preview.href = url;
    preview.addEventListener("pointerdown", handlePreviewMiddleClick);
    preview.addEventListener("mouseleave", handlePreviewMouseLeave);
  }

  function handlePreviewMouseLeave(event) {
    const preview = event.currentTarget;

    preview.removeEventListener("pointerdown", handlePreviewMiddleClick);
    preview.removeEventListener("mouseleave", handlePreviewMouseLeave);
  }

  function attachMouseEnterListener(thumbnail) {
    thumbnail.addEventListener("mouseenter", handleThumbnailMouseEnter);
  }

  function attachListenersToThumbnails() {
    const thumbnails = Array.from(
      document.querySelectorAll("ytd-thumbnail.ytd-rich-grid-media")
    ).map((child) => child.closest("div#dismissible"));

    thumbnails.forEach((thumbnail) => {
      attachMouseEnterListener(thumbnail);
    });
  }

  function setupMutationObserver() {
    const observer = new MutationObserver(() => {
      attachListenersToThumbnails();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function init() {
    attachListenersToThumbnails();
    setupMutationObserver();
  }

  // Attempt to initialize the script every 2 seconds
  // This is to make sure it runs once the async content is loaded
  const interval = setInterval(() => {
    if (document.querySelector("ytd-thumbnail.ytd-rich-grid-media")) {
      clearInterval(interval);
      init();
    }
  }, 2000);
})();