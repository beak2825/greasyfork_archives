// ==UserScript==
// @name        Chess Compass Analysis for Chess.com
// @namespace      AndyVuj24
// @match       https://www.chess.com/*
// @run-at      document-end
// @grant       none
// @version     1.3.0
// @author      AndyVuj24
// @description This plugin adds buttons next to the chess board allowing for a quick post-game analysis of the current game on screen
// @supportURL  https://github.com/andyvuj24/Chess-Compass-Analysis-for-Chess.com/issues
// @homepageURL https://github.com/andyvuj24/Chess-Compass-Analysis-for-Chess.com
// @downloadURL https://update.greasyfork.org/scripts/416737/Chess%20Compass%20Analysis%20for%20Chesscom.user.js
// @updateURL https://update.greasyfork.org/scripts/416737/Chess%20Compass%20Analysis%20for%20Chesscom.meta.js
// ==/UserScript==

var counter = 0;

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const log = (message, ...data) => {
  if (data.length > 0) {
    return console.log(`[Chess.com Plugin Log]: ${message}`, data);
  }
  return console.log(`[Chess.com Plugin Log]: ${message}`);
};

const isElement = (element) => {
  return element instanceof Element;
};
const isQueryString = (query) => {
  return (
    !isElement(query) && (typeof query == "string" || query instanceof String)
  );
};
const getDOMElement = (request) => {
  if (isElement(request)) {
    return request;
  } else if (isQueryString(request)) {
    return $(request);
  }
  return null;
};

const addStyling = async () => {
  // button styling
  log("Adding styling to page for plugin buttons");
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `.gf-chess-compass-button-container{margin:auto;display:flex;align-items:center;justify-content:center;border-radius:3px;color:#fff;font-size:16px}.gf-chess-compass-button-container>a{width:100%}.gf-chess-compass-button{background-color:#489e5d;width:100%;margin:auto;height:40px;display:flex;align-items:center;justify-content:center;border-radius:3px 3px 0 0;color:#fff;cursor:pointer;font-size:16px;font-weight:500;}.gf-chess-compass-button:hover{background-color:#57b26e}`;
  document.head?.appendChild?.(styleElement);
};

const addButtons = async (element) => {
  // for button element
  const target = getDOMElement(element);

  if (target === null) {
    log("Failed to add buttons to target: ", target);
    return;
  }

  log("Adding buttons to sidebar");
  target?.insertAdjacentHTML(
    "beforebegin",
    '<div><div id="btnPGN" class="gf-chess-compass-button-container"><button class="gf-chess-compass-button">Analyze PGN with Chess Compass</button></div></div>'
  );
  target?.insertAdjacentHTML(
    "beforebegin",
    '<div><div id="btnFEN" class="gf-chess-compass-button-container"><button class="gf-chess-compass-button">Analyze FEN with Chess Compass</button></div></div>'
  );
};

const setupButton = async (id) => {
  log(`Configuring button -> ${id}`);
  const btn = $(id);
  if (id.indexOf("PGN") !== -1) {
    btn.addEventListener("click", function () {
      const data =
        ($("chess-board")
          ?.game.getPGN?.()
          .replace(/\[[^\]]*\]|\{[^\}]*\}/g, "") ||
          [
            ...$$(
              "div.vertical-move-list-component span.vertical-move-list-column:not(.move-timestamps-component)"
            ),
          ]
            .map(({ innerText }) => innerText)
            .join(" ")
            .replace(/\[[^\]]*\]|\{[^\}]*\}/g, "")) ??
        null;
      if (!data) {
        log("Unable to find data for PGN");
        return;
      }

      log("PGN: ", data);
      fetch("https://www.chesscompass.com/api/get_game_id", {
        method: "post",
        body: JSON.stringify({
          gameData: data,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then(({ gameId }) => {
          window.open(
            "https://www.chesscompass.com/analyze/" + gameId,
            "_blank"
          );
        });
    });
  }

  if (id.indexOf("FEN") !== -1) {
    btn.addEventListener("click", function () {
      const data =
        ($("chess-board")?.game.getFEN?.() ||
          $("div.v-board")?.getChessboardInstance?.().state.selectedNode.fen) ??
        null;
      if (!data) {
        log("Unable to find data for FEN");
        return;
      }
      log("FEN: " + data);
      fetch("https://www.chesscompass.com/api/get_game_id", {
        method: "post",
        body: JSON.stringify({
          gameData: data,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then(({ gameId }) => {
          window.open(
            "https://www.chesscompass.com/analyze/" + gameId,
            "_blank"
          );
        });
    });
  }
};

const waitForContainer = async () => {
  const selectors = [
    ".sidebar-component",
    ".sidebar-v5-component",
    "vertical-move-list",
  ];
  return new Promise((resolve, reject) => {
    for (const selector of selectors) {
      log("Initially trying: ", selector);
      const element = $(selector);

      if (element) {
        log("Found container: ", element);
        resolve(main(selector));
        return;
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const nodes = Array.from(mutation.addedNodes);
        for (const node of nodes) {
          for (const selector of selectors) {
            if (node.matches && node.matches(selector)) {
              log("Observer found container: ", node);
              observer.disconnect();
              resolve(main(selector));
              return;
            }
          }
        }
      });
    });

    log("Made container observer");
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
};

const clearAds = async () => {
  log("Clearing ads...");

  const adsToRemove = [
    "#tall-sidebar-ad",
    "#adblocker-check",
    "#board-layout-ad",
  ];

  adsToRemove.forEach((selector) => {
    $$(selector).forEach((el) => {
      el.remove();
      log("Removed Ad: ", el);
    });
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const nodes = Array.from(mutation.addedNodes);
      for (const node of nodes) {
        for (const selector of adsToRemove) {
          if (node.matches && node.matches(selector)) {
            node.remove();
          }
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  log("Ads cleared!");
};

async function main(element) {
  await addStyling();
  await addButtons(element);
  await setupButton("#btnPGN");
  await setupButton("#btnFEN");
  await clearAds();
}

if (["complete", "interactive"].indexOf(document.readyState) > -1) {
  waitForContainer();
} else {
  document.addEventListener("DOMContentLoaded", waitForContainer);
}
