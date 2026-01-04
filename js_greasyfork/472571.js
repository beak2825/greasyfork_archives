// ==UserScript==
// @name        ArkhamDB: replace missing images
// @namespace   Violentmonkey Scripts
// @match       https://*.arkhamdb.com/**
// @grant       none
// @version     1.1.7
// @author      @hiflix
// @run-at      document-end
// @license     MIT
// @description Replaces missing card images on arkhamdb. Supports card pages, modals and tooltips.
// @downloadURL https://update.greasyfork.org/scripts/472571/ArkhamDB%3A%20replace%20missing%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/472571/ArkhamDB%3A%20replace%20missing%20images.meta.js
// ==/UserScript==

const IMAGE_BASE_PATH = "https://assets.arkham.build/optimized";

/**
 * Handles most places where card images are displayed (including tooltips and modals).
 * known limitations:
 * - might break at any point without warning.
 * - doesn't handle double-sided cards (e.g. acts).
 * - `reviews` and `faq` might not work in all cases.
 */
function init() {
  tryReplaceBrokenImages();
  replaceFullCards();
  replaceCardPage();
  replaceScansOnly();
  watchCardTooltip();
  watchCardModal();
}

/**
 * Generic handler for places where arkhamdb tries to render a broken image.
 * This might fail due to race conditions with the loading of the site.
 */
function tryReplaceBrokenImages() {
  const url = window.location.href;

  // ignore set pages: we have specialized logic for these.
  if (!isSetPage(url)) {
    document.querySelectorAll("img").forEach((node) => {
      if (node.onerror) {
        node.onerror = "this.dataset.replace = true";
      }
    });

    window.addEventListener(
      "error",
      (evt) => {
        if (evt.target instanceof HTMLImageElement) {
          const match = /.*\/cards\/(.*)\.(?:png|jpg)/.exec(evt.target.src);

          if (
            match?.length === 2 &&
            !evt.target.src.startsWith(IMAGE_BASE_PATH)
          ) {
            evt.target.src = imageUrl(match[1]);
          }
        }
      },
      true
    );
  }
}

/**
 * Replace the "no image" placeholder on card pages with an image.
 * CAVEAT: does not handle double-sided cards.
 */
function replaceCardPage() {
  const url = window.location.href;
  const node = document.querySelector(".no-image");

  if (!isSetPage(url) && node) {
    const id = idFromCardUrl(url);

    const image = htmlFromString(
      `<img class="img-responsive img-vertical-card" src="${imageUrl(id)}" />`
    );

    node.parentNode.replaceChild(image, node);
  }
}

/**
 * Replace empty images on the "scans only" page.
 */
function replaceScansOnly() {
  const url = window.location.href;

  if (isSetPage(url) && (url.includes("/scan") || url.includes("/find"))) {
    document.querySelectorAll("a[href*='/card/'] > img").forEach((image) => {
      // check for empty image "src" attributes, which default to the current url.
      if (image.src === window.location.href) {
        const id = idFromCardUrl(image.parentNode.getAttribute("href"));
        image.src = imageUrl(id);
      }
    });
  }
}

/**
 * Replace the "no image" placeholders on the "full cards" page.
 */
function replaceFullCards() {
  const url = window.location.href;

  if (isSetPage(url) && (url.includes("/card") || url.includes("/find"))) {
    document.querySelectorAll(".no-image").forEach((node) => {
      const id = node
        .closest(".card-block")
        ?.querySelector(".card-name")
        ?.getAttribute("data-code");

      if (id) {
        const image = htmlFromString(
          `<img loading="lazy" class="img-responsive img-vertical-card" src="${imageUrl(
            id
          )}" />`
        );

        node.parentNode.appendChild(image);
        node.remove();
      }
    });
  }
}

/**
 * UNUSED! I suspect we will need this again in the future.
 * Replaces missing FHV investigators in the deck builder / deck list.
 */
function replaceBrokenInvestigators() {
  const REGEX_FHV_INVESTIGATORS = /.*\/cards\/(10.*)\.(?:png|jpg)/;

  const url = window.location.href;

  if (url.includes("/deck/") || url.includes("/decks")) {
    document
      .querySelectorAll(".deck-list-investigator-image")
      .forEach((node) => {
        const match = REGEX_FHV_INVESTIGATORS.exec(
          node.style["background-image"]
        );

        if (match && match.length == 2) {
          node.style["background-image"] = `url(${imageUrl(match[1])})`;
        }
      });
  }

  if (url.endsWith("/decklists")) {
    document.querySelectorAll(".decklist-faction-image img").forEach((node) => {
      const match = REGEX_FHV_INVESTIGATORS.exec(node.src);

      if (match && match.length == 2) {
        node.src = imageUrl(match[1]);
      }
    });
  }

  if (!window.location.pathname || window.location.pathname === "/") {
    document
      .querySelectorAll(".card-thumbnail-investigator")
      .forEach((node) => {
        const match = REGEX_FHV_INVESTIGATORS.exec(
          node.style["background-image"]
        );

        if (match && match.length == 2) {
          node.style["background-image"] = `url(${imageUrl(match[1])})`;
        }
      });
  }
}

/**
 * Watch for the card modal opening, then replace the broken image inside.
 */
function watchCardModal() {
  const modal = document.querySelector("#cardModal");
  if (!modal) return;

  // watch for images being added to the modal DOM.
  // filter for images that have src "undefined".
  const observer = new MutationObserver((mutationList) => {
    const image = mutationList.reduce(
      (acc, { type, addedNodes }) =>
        acc || type !== "childList"
          ? acc
          : Array.from(addedNodes).find((node) =>
              node?.src?.includes("undefined")
            ),
      undefined
    );

    // traverse modal DOM to find card link and update image src.
    if (image) {
      const cardUrl = image
        .closest("#cardModal")
        .querySelector("a[href*='/card/']")
        .getAttribute("href");

      image.src = imageUrl(idFromCardUrl(cardUrl));
    }
  });

  observer.observe(modal, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
  });
}

function watchCardTooltip() {
  const observer = new MutationObserver((mutationList) => {
    // watch for changes on links with a tooltip.
    // once changed, find the corresponding tooltip and update it.
    for (const { target, type } of mutationList) {
      if (
        type === "attributes" &&
        target instanceof HTMLAnchorElement &&
        target.dataset.hasqtip
      ) {
        const tooltipId = target.dataset.hasqtip;
        const id = idFromCardUrl(target.href) || target?.dataset.code;
        const tooltip = document.querySelector(`#qtip-${tooltipId}-content`);

        if (tooltip && !tooltip.querySelector(".card-thumbnail")) {
          const url = imageUrl(id);

          // different card types art cropped differently, try to infer card type from tooltip text.
          const cardType =
            tooltip
              .querySelector(".card-type")
              ?.textContent?.split(".")
              ?.at(0)
              ?.toLowerCase() || "skill";

          const image = htmlFromString(`
            <div class="card-thumbnail card-thumbnail-3x card-thumbnail-${cardType}" style="background-image: url(${url})" />
          `);

          tooltip.prepend(image);
        }
      }
    }
  });

  observer.observe(document.body, {
    attributes: true,
    childList: false,
    characterData: false,
    subtree: true,
  });
}

function imageUrl(id) {
  return `${IMAGE_BASE_PATH}/${id}.avif`;
}

function idFromCardUrl(href) {
  return href.split("/").at(-1);
}

function isSetPage(url) {
  return (
    url.includes("/set/") || url.includes("/cycle/") || url.includes("/find")
  );
}

function htmlFromString(html) {
  const template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

init();
