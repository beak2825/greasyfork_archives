// ==UserScript==
// @name        Retro Wiki Screenshot Viewer
// @version     1.0.7
// @description A screenshot viewer for the Retro wikis.
// @author      J.C. Fields
// @namespace   jcfields.dev
// @homepageURL https://github.com/jcfieldsdev/user-scripts
// @icon        https://jcfieldsdev.github.io/user-scripts/sonic.png
// @match       https://*.segaretro.org/*
// @match       https://*.necretro.org/*
// @match       https://info.sonicretro.org/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/473495/Retro%20Wiki%20Screenshot%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/473495/Retro%20Wiki%20Screenshot%20Viewer.meta.js
// ==/UserScript==

"use strict";

const SCREENSHOT_QUERY = ".bobscreen a, .bobtransform a";
const FULL_IMAGE_QUERY = ".fullImageLink a";
const CATEGORIES_QUERY = ".mw-normal-catlinks ul";
const FILE_INFO_QUERY = ".fileInfo";

const DEFAULT_RATIO = 4 / 3;
const IMAGE_WIDTH = "85%";
const IMAGE_HEIGHT = "90%";
const THUMBNAIL_HEIGHT = 80;
const Z_INDEX = "10000001"; // ridiculously large number needed for NEC Retro
const NOT_AVAILABLE = "Notavailable.svg";

const SONIC_HOST = "info.sonicretro.org";
const SEGA_HOST = "segaretro.org";
const NEC_HOST = "necretro.org";
const CDN_HOST = "retrocdn.net";
const SONIC_LINK_BG = "https://retrocdn.net/images/3/35/Sonicretro-round.svg";
const SEGA_LINK_BG = "https://retrocdn.net/images/3/32/Segaretro-round.svg";
const NEC_LINK_BG = "https://retrocdn.net/images/7/7d/Necretro-round.svg";
const CDN_LINK_BG = "https://retrocdn.net/images/6/69/Retrocdn-round.svg";

const LOADING_IMAGE =
`iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAMAAACo9wirAAAACGFjVEwAAAACAAAAAPONk3AAAAAtUEx
URQAAADA5oQAAAH+E4Fpgwf7CoaMUAP39/cKAWqGhoaGl/VpaWv8mAMHBwVsGADRdwA0AAAABdFJOUwB
A5thmAAAAGmZjVEwAAAAAAAAAIAAAACgAAAAAAAAAAAAeAGQAAPVXCRQAAAEqSURBVDjLrZLRkoQgDAS
TCAkhq///uZeA1t1K9OmmateHbgODAPxbysgL3kaenIKIrV0OAOI3x0itbvTh4F0YTv1jlFWAEOrW+zk
j2cbcwymUtGR02FKheIswuvRp9G8jSuLgEoa/7497yTC6EA2jiDwLbhT/R1iP6hSkUyJMYwpjoWwCYux
SpClpS3mrwWsloifhSsopvrjD46iN0wE0FA/zUsF//i4G4xVPGm+2eDC3FTtF5Gt/i8GtkdlZokGyhk9
loVjBua1c1ZgFKRqgmd75bmYiGjfCy7qwKPuuZgS4gZ8EJCPiJAhCGMZjQnAD3o33EQVejd0vwzRUc8H
j3EunPYB4jnBDVTnhsn88fNDhn1yXZUgHDyUMn3G7GaSfK3QcZnzmV3jID/TCC88xkfIlAAAAGmZjVEw
AAAABAAAAEAAAAAgAAAAQAAAAIAAeAGQAALJsbRcAAABFZmRBVAAAAAI4y1XNQQoAMQhD0TSLQFC8/3G
nylBaF8J/IIJr2biGdDzCCEtyrz0jOkACKlZD7GKfZKrlr4FknZovvBMfhkgB1UqcFLwAAAAbdEVYdFN
vZnR3YXJlAEFQTkcgQXNzZW1ibGVyIDIuN8Hj04gAAAAASUVORK5CYII=`;

window.addEventListener("load", function() {
  const overlay = new Overlay();
  overlay.createElements();
  overlay.findScreenshots();
  overlay.populateGallery();

  const reference = new Reference();
  reference.createElement();

  styleLinks();

  window.addEventListener("keyup", function(event) {
    if (overlay.visible) {
      const {key} = event;

      if (key == "Escape") {
        overlay.close();
      }

      if (key == "ArrowLeft") {
        event.preventDefault();
        overlay.loadPrevScreenshot();
      }

      if (key == "ArrowRight") {
        event.preventDefault();
        overlay.loadNextScreenshot();
      }
    }
  });
  window.addEventListener("click", function(event) {
    const element = event.target;

    if (element.closest(SCREENSHOT_QUERY)) {
      overlay.showImage(event, element.closest(SCREENSHOT_QUERY));
    }

    if (element.closest("#screenshotLightbox")) {
      overlay.close();
    }

    if (element.matches(".screenshotThumbnail")) {
      overlay.loadScreenshot(element.dataset.index);
    }

    if (element.matches("#loadPrevScreenshot")) {
      overlay.loadPrevScreenshot();
    }

    if (element.matches("#loadNextScreenshot")) {
      overlay.loadNextScreenshot();
    }
  });
  window.addEventListener("resize", function() {
    overlay.screenshot.resize();
  });
  window.addEventListener("mouseenter", function(event) {
    const element = event.target;

    if (element.matches(".reference a")) {
      reference.open(element);
    }
  }, true);
  window.addEventListener("mouseleave", function(event) {
    const element = event.target;

    if (element.matches(".reference a")) {
      reference.linkOut = true;
      reference.close();
    }

    if (element.matches("#referencePopover")) {
      reference.popOut = true;
      reference.close();
    }
  }, true);

  function styleLinks() {
    const links = Array.from(document.querySelectorAll("a")).filter(function(a){
      return a.hostname == SONIC_HOST
        || a.hostname == SEGA_HOST
        || a.hostname == NEC_HOST
        || a.hostname == CDN_HOST;
    });

    for (const a of links) {
      if (a.hostname == window.location.hostname || a.children.length > 0) {
        continue;
      }

      if (a.hostname == SONIC_HOST) {
        a.style.backgroundImage = `url(${SONIC_LINK_BG})`;
        a.style.color = "#95937d";
      } else if (a.hostname == SEGA_HOST) {
        a.style.backgroundImage = `url(${SEGA_LINK_BG})`;
        a.style.color = "#3f7ef7";
      } else if (a.hostname == NEC_HOST) {
        a.style.backgroundImage = `url(${NEC_LINK_BG})`;
        a.style.color = "#d8433a";
      } else if (a.hostname == CDN_HOST) {
        a.style.backgroundImage = `url(${CDN_LINK_BG})`;
        a.style.color = "#2f5275";
      }

      a.className = ""; // clears existing styling
      a.style.backgroundPosition = "100% 50%";
      a.style.backgroundRepeat = "no-repeat";
      a.style.backgroundSize = "1em 1em";
      a.style.borderBottomStyle = "dotted";
      a.style.borderBottomWidth = "1px";
      a.style.paddingRight = "1.375em";
      a.style.textDecoration = "none";
    }
  }
});

/*
 * Overlay prototype
 */

function Overlay() {
  this.element = null;
  this.screenshot = null;
  this.gallery = null;
  this.link = null;
  this.fileInfo = null;
  this.prevButton = null;
  this.nextButton = null;
  this.categories = null;

  this.index = 0;
  this.allLinks = [];

  this.visible = false;
}

Overlay.prototype.createElements = function() {
  const overlay = document.createElement("div");
  overlay.style.background = "rgba(0, 0, 0, 0.5)";
  overlay.style.color = "inherit";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.height = "100%";
  overlay.style.justifyContent = "space-between";
  overlay.style.left = "0";
  overlay.style.position = "fixed";
  overlay.style.textAlign = "center";
  overlay.style.top = "0";
  overlay.style.visibility = "hidden";
  overlay.style.width = "100%";
  overlay.style.zIndex = Z_INDEX;

  const screenshotLightbox = document.createElement("div");
  screenshotLightbox.id = "screenshotLightbox";
  screenshotLightbox.style.alignItems = "center";
  screenshotLightbox.style.display = "flex";
  screenshotLightbox.style.flexGrow = "1";
  screenshotLightbox.style.justifyContent = "center";

  const screenshotImg = document.createElement("img");
  screenshotImg.style.border = "1px solid #000";
  screenshotImg.style.boxShadow = "8px 8px 16px #000";
  screenshotImg.style.imageRendering = "pixelated";
  screenshotImg.style.visibility = "hidden";

  const loadingImg = document.createElement("img");
  loadingImg.src = "data:image/png;base64," + LOADING_IMAGE;
  loadingImg.style.imageRendering = "pixelated";
  loadingImg.style.left = "50%";
  loadingImg.style.position = "absolute";
  loadingImg.style.top = "50%";
  loadingImg.style.transform = "scale(3) translate(-50%, -50%)";
  loadingImg.style.visibility = "hidden";

  const screenshotGallery = document.createElement("div");
  screenshotGallery.style.background = "rgba(0, 0, 0, 0.5)";
  screenshotGallery.style.display = "flex";
  screenshotGallery.style.flexShrink = "0";
  screenshotGallery.style.gap = "1em";
  screenshotGallery.style.overflowX = "auto";
  screenshotGallery.style.padding = "1em";

  const navBar = document.createElement("div");
  navBar.style.alignItems = "center";
  navBar.style.background = "rgba(0, 0, 0, 0.75)";
  navBar.style.color = "#fff";
  navBar.style.display = "flex";
  navBar.style.flexShrink = "0";
  navBar.style.fontSize = "1.5rem";
  navBar.style.justifyContent = "space-between";

  const linkBar = document.createElement("div");
  linkBar.style.display = "flex";
  linkBar.style.flexDirection = "column";

  const fileInfo = document.createElement("div");
  fileInfo.style.fontSize = "0.75rem";
  fileInfo.style.lineHeight = "100%";
  fileInfo.append(document.createElement("span"));

  const a = document.createElement("a");
  a.style.background = "none";
  a.style.color = "#fff";
  a.style.gap = "1em";
  a.style.overflow = "hidden";
  a.style.textDecoration = "underline";
  a.style.textOverflow = "ellipsis";
  a.style.textShadow = "1px 1px #000";
  a.style.whiteSpace = "nowrap";

  const linkDiv = document.createElement("div");
  linkDiv.append(a);

  const prevButton = document.createElement("button");
  prevButton.id = "loadPrevScreenshot";
  prevButton.textContent = "⬅️";
  prevButton.style.setProperty("background", "none", "important");
  prevButton.style.color = "inherit";
  prevButton.style.fontSize = "inherit";
  prevButton.style.margin = "0";
  prevButton.style.padding = "0.25em 0.5em";

  const nextButton = document.createElement("button");
  nextButton.id = "loadNextScreenshot";
  nextButton.textContent = "➡️";
  nextButton.style.setProperty("background", "none", "important");
  nextButton.style.color = "inherit";
  nextButton.style.fontSize = "inherit";
  nextButton.style.margin = "0";
  nextButton.style.padding = "0.25em 0.5em";

  const categoryDiv = document.createElement("div");
  categoryDiv.style.background = "#000";
  categoryDiv.style.color = "#fff";
  categoryDiv.style.flexShrink = "0";
  categoryDiv.style.padding = "0.5em";
  categoryDiv.append(document.createElement("ul"));

  screenshotLightbox.append(screenshotImg, loadingImg);
  linkBar.append(linkDiv, fileInfo);
  navBar.append(prevButton, linkBar, nextButton);
  overlay.append(screenshotLightbox, screenshotGallery, navBar, categoryDiv);
  document.body.appendChild(overlay);

  this.element = overlay;
  this.screenshot = new Screenshot(screenshotImg, loadingImg);
  this.gallery = screenshotGallery;
  this.link = a;
  this.fileInfo = fileInfo;
  this.prevButton = prevButton;
  this.nextButton = nextButton;
  this.categories = categoryDiv;
};

Overlay.prototype.showImage = function(event, link) {
  // opens image normally if any modifier key is held
  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  const index = this.allLinks.findIndex(function(compareLink) {
    return link == compareLink;
  });

  // only opens links that were filtered into the links array
  if (index < 0) {
    return;
  }

  event.preventDefault();

  this.setIndex(index);
  this.clearFileInfo();
  this.clearCategories();
  this.open(); // opens overlay before fetching anything so loading image shows
  this.loadImage(link);
};

Overlay.prototype.loadImage = function(link) {
  this.screenshot.loading();

  window.fetch(link.href).then(function(response) {
    return response.text();
  }).then(function(text) {
    // gets link to full image from file page
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(text, "text/html");
    const rootElement = htmlDocument.documentElement;
    const fullImageLink = rootElement.querySelector(FULL_IMAGE_QUERY);
    const categoryList = rootElement.querySelector(CATEGORIES_QUERY);
    const fileInfo = rootElement.querySelector(FILE_INFO_QUERY);

    if (fullImageLink != undefined) {
      this.changeScreenshot(link, fullImageLink);
    }

    if (categoryList != undefined) {
      this.fillCategories(categoryList.cloneNode(true));
    }

    if (fileInfo != undefined) {
      this.fillFileInfo(fileInfo.cloneNode(true));
    }

  }.bind(this));
};

Overlay.prototype.changeScreenshot = function(filePageLink, fullImageLink) {
  // checks if overlay is still visible in case it was closed during loading
  if (this.visible) {
    // preserves aspect ratio of original image
    const imgSize = filePageLink.querySelector("img").getBoundingClientRect();
    const ratio = imgSize.width / imgSize.height;

    this.screenshot.change(fullImageLink.href, ratio);
    this.setLink(filePageLink.href);
  }
};

Overlay.prototype.open = function() {
  this.element.style.visibility = "visible";
  this.visible = true;
};

Overlay.prototype.close = function() {
  this.element.style.visibility = "hidden";
  this.screenshot.hide();
  this.visible = false;
};

Overlay.prototype.findScreenshots = function() {
  const links = document.querySelectorAll(SCREENSHOT_QUERY);
  this.allLinks = Array.from(links).filter(function(link) {
    // skips screenshots without links to a file page
    return link.href != undefined
      && new URL(link.href).pathname != "/File:" + NOT_AVAILABLE
      && /\/File:/.test(link.href);
  });
};

Overlay.prototype.loadScreenshot = function(index) {
  this.setIndex(index);
  this.clearCategories();
  this.loadImage(this.allLinks[this.index]);
};

Overlay.prototype.loadPrevScreenshot = function() {
  if (this.index <= 0) {
    return;
  }

  this.setIndex(this.index - 1);
  this.clearCategories();
  this.loadImage(this.allLinks[this.index]);
};

Overlay.prototype.loadNextScreenshot = function() {
  if (this.index >= this.allLinks.length - 1) {
    return;
  }

  this.setIndex(this.index + 1);
  this.clearCategories();
  this.loadImage(this.allLinks[this.index]);
};

Overlay.prototype.setIndex = function(index) {
  this.index = Math.max(0, Math.min(index, this.allLinks.length - 1));

  this.prevButton.disabled = this.index <= 0;
  this.nextButton.disabled = this.index >= this.allLinks.length - 1;

  const thumbnails = document.querySelectorAll(".screenshotThumbnail");

  // highlights active thumbnail
  for (const [i, thumbnail] of Array.from(thumbnails).entries()) {
    if (this.index == i) {
      thumbnail.style.boxShadow = "0 0 8px 4px #fff";
      thumbnail.scrollIntoView();
    } else {
      thumbnail.style.boxShadow = "";
    }
  }
};

Overlay.prototype.setLink = function(href) {
  this.link.href = href;

  const text = href.split("/").pop();
  this.link.textContent = window.decodeURI(text.replaceAll("_", " "));
};

Overlay.prototype.populateGallery = function() {
  for (const [i, link] of this.allLinks.entries()) {
    const sourceImg = link.querySelector("img");

    const thumbnail = new Image();
    thumbnail.className = "screenshotThumbnail";
    thumbnail.src = sourceImg.src;
    thumbnail.style.aspectRatio = DEFAULT_RATIO;
    thumbnail.width = DEFAULT_RATIO * THUMBNAIL_HEIGHT;
    thumbnail.height = THUMBNAIL_HEIGHT;
    thumbnail.style.cursor = "pointer";
    thumbnail.style.imageRendering = "pixelated";
    thumbnail.style.outline = "1px solid #000";
    thumbnail.dataset.index = i;

    // sets aspect ratio after source image is loaded
    sourceImg.addEventListener("load", function() {
      const imgSize = link.querySelector("img").getBoundingClientRect();
      thumbnail.style.aspectRatio = imgSize.width / imgSize.height;
    });

    this.gallery.append(thumbnail);
  }
};

Overlay.prototype.clearFileInfo = function() {
  this.fillFileInfo(document.createElement("span"));
};

Overlay.prototype.fillFileInfo = function(fileInfo) {
  this.fileInfo.querySelector("span").replaceWith(fileInfo);
};

Overlay.prototype.clearCategories = function() {
  this.fillCategories(document.createElement("ul"));
};

Overlay.prototype.fillCategories = function(categoryList) {
  const links = categoryList.querySelectorAll("a");

  if (links.length != undefined) {
    for (const link of Array.from(links)) {
      link.style.background = "#fff";
      link.style.borderRadius = "0.25em";
      link.style.color = "#000";
      link.style.padding = "0.25em 0.5em";
    }
  }

  categoryList.style.display = "flex";
  categoryList.style.fontSize = "0.75rem";
  categoryList.style.gap = "1em";
  categoryList.style.height = "2em";
  categoryList.style.lineHeight = "200%";
  categoryList.style.listStyle = "none";
  categoryList.style.margin = "0";
  categoryList.style.padding = "0";
  categoryList.style.overflowX = "auto";
  categoryList.style.whiteSpace = "nowrap";

  this.categories.querySelector("ul").replaceWith(categoryList);
};

/*
 * Screenshot prototype
 */
function Screenshot(screenshotImg, loadingImg) {
  this.screenshotImg = screenshotImg;
  this.loadingImg = loadingImg;

  this.ratio = DEFAULT_RATIO;
}

Screenshot.prototype.hide = function() {
  this.screenshotImg.style.visibility = "hidden";
  this.loadingImg.style.visibility = "hidden";
};

Screenshot.prototype.loading = function() {
  this.screenshotImg.style.visibility = "hidden";
  this.loadingImg.style.visibility = "visible";
};

Screenshot.prototype.change = function(src, ratio) {
  const image = new Image();
  image.src = src;
  image.addEventListener("load", function() {
    this.screenshotImg.src = image.src;
    this.ratio = ratio || DEFAULT_RATIO;
    this.resize();

    this.screenshotImg.style.visibility = "visible";
    this.loadingImg.style.visibility = "hidden";
  }.bind(this));
};

Screenshot.prototype.resize = function() {
  let width = "", height = "";

  // window is wider than tall
  if (window.innerWidth > this.ratio * window.innerHeight) {
    width  = "auto";
    height = IMAGE_HEIGHT;
  } else { // window is taller than wide
    width  = IMAGE_WIDTH;
    height = "auto";
  }

  this.screenshotImg.style.aspectRatio = this.ratio;
  this.screenshotImg.style.width  = width;
  this.screenshotImg.style.height = height;
};


/*
 * Reference prototype
 */

function Reference() {
  this.element = null;
  this.linkOut = false;
  this.popOut = false;
  this.visible = false;
}

Reference.prototype.createElement = function() {
  const popover = document.createElement("div");
  popover.id = "referencePopover";
  popover.style.background = "#fff";
  popover.style.border = "1px solid #000";
  popover.style.boxShadow = "2px 2px 4px #000";
  popover.style.display = "none";
  popover.style.fontSize = "0.8rem";
  popover.style.padding = "0.5em";
  popover.style.position = "absolute";
  popover.style.width = "20em";

  document.body.appendChild(popover);
  this.element = popover;
};

Reference.prototype.open = function(element) {
  const ref = document.getElementById(element.hash.substring(1));

  if (ref == null) {
    return;
  }

  const text = ref.getElementsByClassName("reference-text")[0];
  this.element.innerHTML = text.innerHTML;

  const bound = event.target.getBoundingClientRect();
  this.element.style.display = "block";
  this.element.style.left = `${bound.left}px`;
  this.element.style.top = `${bound.bottom + window.scrollY}px`;

  this.linkOut = false;
  this.popOut = false;
  this.visible = true;
};

Reference.prototype.close = function() {
  if (this.visible && this.linkOut && this.popOut) {
    this.element.style.display = "none";

    this.linkOut = false;
    this.popOut = false;
    this.visible = false;
  }
};