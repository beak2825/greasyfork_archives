// ==UserScript==
// @name         BitPorn Preview Image Injector
// @namespace    https://bitporn.eu/
// @version      1.0
// @description  Lets you preview torrents image
// @author       FenRan
// @match        https://bitporn.eu/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533926/BitPorn%20Preview%20Image%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/533926/BitPorn%20Preview%20Image%20Injector.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function addImagesToDescriptions() {
    document.querySelectorAll(".torrentPreview").forEach((preview) => {
      const imageSrc = preview.getAttribute("data-src");
      if (!imageSrc) return;

      const description = preview
        .closest(".torrent-container")
        ?.querySelector(".torrent-description");
      if (!description) return;

      const img = document.createElement("img");
      img.src = imageSrc;
      img.className = "torrent-preview-thumbnail";
      img.style = "max-width: 300px; display: block; padding: 16px 0;";

      description.insertBefore(img, description.firstChild);
    });
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", addImagesToDescriptions)
    : addImagesToDescriptions();
})();