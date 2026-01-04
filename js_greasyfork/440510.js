// ==UserScript==
// @name         nHentai Autoloader
// @namespace    nHentai Autoloader
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://nhentai.net/*
// @icon         https://nhentai.net/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/440510/nHentai%20Autoloader.user.js
// @updateURL https://update.greasyfork.org/scripts/440510/nHentai%20Autoloader.meta.js
// ==/UserScript==

/**
 * Show full title without hover
 */
function showFullTitle() {
  const covers = document.querySelectorAll(".cover");

  if (covers) {
    covers.forEach((cover) => {
      cover.style.padding = "0";
    });
  }

  const captions = document.querySelectorAll(".caption, .cover img");

  if (captions) {
    captions.forEach((caption) => {
      caption.style.position = "static";
      caption.style.maxHeight = "initial";
    });
  }
}

/**
 * On mobile, the first element you click on each page load
 * will have an onclick attached to it that makes it unclickable
 * unless a popunder appears. A problem if you use adblock.
 **/
function preventOnClickOnAnchors() {
  const anchors = document.querySelectorAll("a");

  if (!anchors) return;

  anchors.forEach((a) => {
    a.onclick = () => {};

    Object.defineProperty(a, "onclick", {
      set: () => {},
    });
  });
}

/**
 * When performing a tag search, also add it to the search bar
 * so that you can easily modify it with more tags
 */
function tagToSearchbar() {
  const tag = document.querySelector(".tag .name");
  const search = document.querySelector(".search input");

  if (!tag || !search) return;

  if (!search.value) search.value = `"${tag.textContent}"`;
}

/**
 * Append future pages on the bottom so that you can read by scrolling
 */
function autoload() {
  const currentImage = document.querySelector("#image-container img");
  const gallery = window._gallery;

  if (!gallery || !currentImage) return;

  const currentImageUrl = currentImage.src;
  const baseImageUrl = currentImageUrl.split("/").slice(0, 5).join("/");
  const currentImageNum = parseInt(currentImageUrl.split("/").slice(-1)[0].split(".")[0]);

  const initialToExtension = {
    j: "jpg",
    p: "png",
    g: "gif",
  };

  const extensions = gallery.images.pages.map((page) => initialToExtension[page.t]);
  let nextImageNum = currentImageNum + 1;

  const loadNextImage = function () {
    if (nextImageNum > extensions.length) return;

    const image = new Image();
    const nextImageExt = extensions[nextImageNum - 1];

    image.style.cssText = `display: block; max-width: ${currentImage.width}px; margin: 20px auto 0 auto;`;
    image.src = `${baseImageUrl}/${nextImageNum}.${nextImageExt}`;
    image.onload = loadNextImage;
    image.onerror = loadNextImage;

    document.body.appendChild(image);

    nextImageNum += 1;
  };

  loadNextImage();
}

/**
 * Bigger Next button, useful especially for mobile
 */
function biggerNavbar() {
  const next = document.querySelector(".next");
  const pagination = document.querySelector(".pagination");

  if (!pagination || !next) return;

  const paginationParent = pagination.parentElement;
  const style = `
    display: block;
    width: 100%;
    text-align: center;
    padding: 10px 0px;
    margin: 20px 0px;
    font-weight: bold;
    background: black;
    border: 1px solid #aaa;
    border-radius: 8px;
    color: white;
  `;

  const bigNext = document.createElement("a");

  bigNext.style = style;
  bigNext.innerHTML = "Next Page";
  bigNext.href = next.href;

  paginationParent.insertBefore(bigNext, pagination);
}

(function () {
  "use strict";

  window.addEventListener("load", () => {
    document.querySelector("#content").style.height = "auto";

    preventOnClickOnAnchors();
    tagToSearchbar();
    autoload();
    biggerNavbar();
    showFullTitle();

    Object.defineProperty(window, "N_BetterJsPop", {
      value: {},
      writable: false,
      enumerable: true,
      configurable: false,
    });
  });
})();
