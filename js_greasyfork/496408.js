// ==UserScript==
// @name        Miniflux thumbnails
// @namespace   Violentmonkey Scripts
// @description Show thumbnails in entry listing
// @match       *://reader.miniflux.app/*
// @grant       none
// @version     1.2
// @author      -
// @license     WTFPL
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/496408/Miniflux%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/496408/Miniflux%20thumbnails.meta.js
// ==/UserScript==

(() => {
  "use strict"

  const itemList = document.querySelector(".items");

  async function getEntryData(entryId) {
    // load the entry using history route because it doesn't tamper with read status
    const entryUrl = new URL(`/history/entry/${entryId}`, location);
    const response = await fetch(entryUrl, {
      headers: {'Content-Type': 'text/html'}
    });
    const html = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  function getThumbnailUrl(dom) {
    const imageEnclosure = dom.querySelector('.enclosure-image img');
    if (imageEnclosure) {
      return imageEnclosure.src;
    }

    const img = dom.querySelector(".entry-content img");
    if (img) {
      return img.src;
    }

    return null;
  }

  function createThumbnailElement(thumbnailUrl) {
    const thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("entry-thumbnail");
    thumbnailElement.style.float = "right";

    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = thumbnailUrl;
    thumbnailImage.alt = "Thumbnail";
    thumbnailImage.style.maxWidth = "64px";
    thumbnailImage.style.maxHeight = "64px";
    thumbnailImage.style.paddingLeft = "10px";

    const enlargedImage = document.createElement("div");
    enlargedImage.classList.add("enlarged-image");
    enlargedImage.style.display = "none";
    enlargedImage.style.position = "absolute";
    enlargedImage.style.zIndex = "9999";
    enlargedImage.style.backgroundColor = "white";
    enlargedImage.style.padding = "10px";
    enlargedImage.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

    const enlargedImageElement = document.createElement("img");
    enlargedImageElement.src = thumbnailUrl;
    enlargedImageElement.style.maxWidth = "700px";
    enlargedImageElement.style.maxHeight = "700px";

    enlargedImage.appendChild(enlargedImageElement);

    thumbnailElement.addEventListener("mouseenter", (event) => {
      const rect = event.target.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      const viewportHeight = window.innerHeight;
      const isNearBottom = rect.bottom > viewportHeight / 2;

      enlargedImage.style.display = "block";
      enlargedImage.style.right = `${window.innerWidth - rect.left}px`;

      if(isNearBottom) {
          enlargedImage.style.top = `${rect.bottom + scrollY - enlargedImage.offsetHeight}px`
      } else {
        enlargedImage.style.top = `${rect.top + scrollY}px`;
      }
    });

    thumbnailElement.addEventListener("mouseleave", () => {
      enlargedImage.style.display = "none";
    });

    thumbnailElement.appendChild(thumbnailImage);
    thumbnailElement.appendChild(enlargedImage);

    return thumbnailElement;
  }

  async function addThumbnailsToEntries() {
    const entries = itemList.querySelectorAll(".entry-item");

    const promises = Array.from(entries).map(async (entry) => {
      const entryId = entry.dataset.id;
      const entryData = await getEntryData(entryId);
      const thumbnailUrl = getThumbnailUrl(entryData);

      if (thumbnailUrl) {
        const thumbnailElement = createThumbnailElement(thumbnailUrl);
        entry.insertAdjacentElement("afterbegin", thumbnailElement);
      }
    });

    await Promise.all(promises);
  }

  addThumbnailsToEntries();
})();