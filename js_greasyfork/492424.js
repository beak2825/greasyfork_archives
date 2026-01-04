// ==UserScript==
// @name        Taimanin RPGX Extasy (Johren) - Expand resolution to window size
// @namespace   https://taurussilver.github.io
// @include     https://www.johren.games/games/taimanin-rpgx-extasy-zh-tw/play/*
// @include     https://osapi.johren.net/gadgets/ifr*
// @include     https://prd.taimanin-rpg-extasy.com/game/*
// @grant       GM_addStyle
// @version     1.0.1
// @author      taurussilver
// @run-at      document-end
// @description 4/12/2024, 10:38:05 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/492424/Taimanin%20RPGX%20Extasy%20%28Johren%29%20-%20Expand%20resolution%20to%20window%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/492424/Taimanin%20RPGX%20Extasy%20%28Johren%29%20-%20Expand%20resolution%20to%20window%20size.meta.js
// ==/UserScript==

const TOP_PAGE = "www.johren.games";
const JOHREN_IFRAME_PAGE = "osapi.johren.net";
const GAME_IFRAME_PAGE = "prd.taimanin-rpg-extasy.com";

const MUTATION_OBSERVER_TIMEOUT_MS = 5000;

// Add top-level page styling
GM_addStyle(`
.application-game-play {
  margin-top: 0 !important;
}
.application-game-play .application-game-play-layout {
  max-width: none !important;
}
`);

// Apply styling to the outer iframe which the Johren game page loads.
function applyJohrenIframeStyles() {
  const iframe = document.getElementById("game_frame");
  iframe.removeAttribute("width");
  iframe.removeAttribute("height");
  iframe.style.aspectRatio = "16/9";
  iframe.style.width = "100vw";
  iframe.style.height = "auto";

  const observeIframe = (mutations, observer) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        const width = iframe.style.width;
        const height = iframe.style.height;
        if (width.endsWith("px") || height.endsWith("px")) {
          iframe.style.width = "100vw";
          iframe.style.height = "auto";
          setTimeout(() => {
            observer.disconnect();
          }, MUTATION_OBSERVER_TIMEOUT_MS);
        }
      }
    }
  };

  const mo = new MutationObserver(observeIframe);

  mo.observe(iframe, {
    attributes: true,
  });
}

// Apply styling to the inner nested iframe loaded by the Johren iframe.
// This iframe contains the unity game window.
function applyGameWindowStyles() {
  const iframe = document.getElementById("game_window");
  iframe.removeAttribute("width");
  iframe.removeAttribute("height");
  iframe.style.aspectRatio = "16/9";
  iframe.style.width = "100vw";
  iframe.style.height = "auto !important";
}

// Apply styling to Unity game once it's loaded.
function applyUnityCanvasStyles() {
  const applyStyles = (unityContainer, unityCanvas) => {
    unityContainer.style.aspectRatio = "16/9";
    unityContainer.style.width = "100vw";
    unityContainer.style.height = "auto";

    const observeCanvas = (mutations, observer) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          const width = unityCanvas.style.width;
          const height = unityCanvas.style.height;
          if (width === "1280px" || height === "720px") {
            unityCanvas.style.width = "100%";
            unityCanvas.style.height = "100%";
            setTimeout(() => {
              observer.disconnect();
            }, MUTATION_OBSERVER_TIMEOUT_MS);
          }
        }
      }
    };

    const mo = new MutationObserver(observeCanvas);

    mo.observe(unityCanvas, {
      attributes: true,
    });
  };

  const observeUnity = (mutations, observer) => {
    for (const node of mutations) {
      if (node.type === "childList" && node.addedNodes.length > 0) {
        const addedNode = node.addedNodes[0];
        if (addedNode.tagName === "CANVAS") {
          observer.disconnect();
          const unityContainer = addedNode.parentNode;
          const unityCanvas = addedNode;
          applyStyles(unityContainer, unityCanvas);
        }
      }
    }
  };

  const mo = new MutationObserver(observeUnity);

  mo.observe(document, {
    childList: true,
    subtree: true,
  });
}

switch (window.location.hostname) {
  case TOP_PAGE:
    applyJohrenIframeStyles();
    break;
  case JOHREN_IFRAME_PAGE:
    applyGameWindowStyles();
    break;
  case GAME_IFRAME_PAGE:
    applyUnityCanvasStyles();
    break;
}
