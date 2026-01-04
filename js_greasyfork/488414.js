// ==UserScript==
// @name         Game Shot message on finished leg for Autodarts
// @version      0.12
// @description  Changes the yellow player card on a finished game to black and adds a glowing animated rainbow border and a "Game Shot!" caption
// @author       dotty-dev
// @license      MIT
// @match        *://play.autodarts.io/*
// @namespace    https://greasyfork.org/en/users/913506-dotty-dev
// @downloadURL https://update.greasyfork.org/scripts/488414/Game%20Shot%20message%20on%20finished%20leg%20for%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/488414/Game%20Shot%20message%20on%20finished%20leg%20for%20Autodarts.meta.js
// ==/UserScript==
/*jshint esversion: 11 */

(function () {
  "use strict";

  const documentObserver = new MutationObserver((mutationRecords) => {
    if (document.querySelectorAll(".observer-running").length === 0) {
      mutationRecords.forEach((record) => {
        if (document.querySelector("#ad-ext-game-variant")) {
          startObserver();
        }
      });
    }
  });

  documentObserver.observe(document, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  });

  const startObserver = () => {
    if (document.querySelectorAll(".observer-running").length === 0) {
      if (document.querySelectorAll("style#game-shot").length < 1) {
        document.head.insertAdjacentHTML(
          "beforeend",
          /*html*/ `
                  <style id="game-shot">
                    .game-shot-message {
                      text-align: center;
                    }

                    .game-shot-animation {
                      position: relative;
                      z-index: 1;
                    }

                    .game-shot-animation .css-8ga5e0 {
                        margin: 0
                    }

                    .game-shot-animation .ad-ext-player-score, .game-shot-animation .game-shot-message {
                        font-size: 3.8em;
                        line-height: 1;
                    }

                    .game-shot-animation > div:first-child {
                      background: linear-gradient(0deg, #000, #272727);
                    }

                    .game-shot-animation:before,
                    .game-shot-animation:after {
                      content: "";
                      position: absolute;
                      left: -2px;
                      top: -2px;
                      background: linear-gradient(
                        45deg,
                        #fb0094,
                        #0000ff,
                        #00ff00,
                        #ffff00,
                        #ff0000,
                        #fb0094,
                        #0000ff,
                        #00ff00,
                        #ffff00,
                        #ff0000
                      );
                      background-size: 400%;
                      width: calc(100% + 4px);
                      height: calc(100% + 4px);
                      z-index: -1;
                      animation: steam 20s linear infinite;
                      border-radius: 5px;
                    }

                    @keyframes steam {
                      0% {
                        background-position: 0 0;
                      }
                      50% {
                        background-position: 400% 0;
                      }
                      100% {
                        background-position: 0 0;
                      }
                    }

                    .game-shot-animation:after {
                      filter: blur(50px);
                    }
                  </style>
                      `
        );
      }

      let winnerCardEl = undefined;
      const gameShotMessageElement = document.createElement("p");
      gameShotMessageElement.classList.add("game-shot-message");
      gameShotMessageElement.textContent = "Game Shot!";

      const gameVariant = document.querySelector("#ad-ext-game-variant");

      const gameShotObserver = new MutationObserver((mutationRecords) => {
        mutationRecords.forEach((mutation) => {
          if (
            winnerCardEl &&
            mutation.target.classList.contains("ad-ext-player-active")
          ) {
            winnerCardEl?.classList.remove("game-shot-animation");
            winnerCardEl = undefined;
            gameShotMessageElement.remove();
          }
          if (
            mutation.target?.classList?.contains("ad-ext-player-winner") &&
            gameVariant != "Bull-off"
          ) {
            console.log(mutation);
            winnerCardEl = document.querySelector(
              ".ad-ext-player-winner"
            ).parentElement;
            winnerCardEl?.classList.add("game-shot-animation");

            let finalScore = winnerCardEl.querySelector(".ad-ext-player-score");
            finalScore?.insertAdjacentElement(
              "afterend",
              gameShotMessageElement
            );

            if (gameVariant.textContent === "X01") {
              console.log("dart counter if triggered");
              const dartsThrown = winnerCardEl
                .querySelector(".ad-ext-player-winner")
                ?.nextSibling.querySelectorAll("p")[1]
                ?.textContent.split("|")[0]
                .trim()
                .split("#")[1]
                .trim();

              finalScore.innerHTML = `${dartsThrown}&nbsp;Darts`;

              const baseScore = document.querySelector("#ad-ext-game-variant")
                .nextSibling.textContent;

              const motivationalMapping = {
                v121: {
                  perfect: 3,
                  splendid: 4,
                  great: 5,
                  nice: 6,
                },
                v170: {
                  perfect: 3,
                  splendid: 5,
                  great: 7,
                  nice: 9,
                },
                v301: {
                  perfect: 6,
                  splendid: 9,
                  great: 12,
                  nice: 15,
                },
                v501: {
                  perfect: 9,
                  splendid: 15,
                  great: 20,
                  nice: 25,
                },
                v701: {
                  perfect: 12,
                  splendid: 18,
                  great: 23,
                  nice: 28,
                },
                v901: {
                  perfect: 16,
                  splendid: 22,
                  great: 27,
                  nice: 32,
                },
              };

              if (
                dartsThrown <= motivationalMapping[`v${baseScore}`]["perfect"]
              ) {
                gameShotMessageElement.textContent = "UNBELIEVABLE!";
              } else if (
                dartsThrown <= motivationalMapping[`v${baseScore}`]["splendid"]
              ) {
                gameShotMessageElement.textContent = "Splendid Game!";
              } else if (
                dartsThrown <= motivationalMapping[`v${baseScore}`]["great"]
              ) {
                gameShotMessageElement.textContent = "Great Game!";
              } else if (
                dartsThrown <= motivationalMapping[`v${baseScore}`]["nice"]
              ) {
                gameShotMessageElement.textContent = "Nice Game!";
              }
            }
          }
        });
      });
      if (document.querySelector("#ad-ext-player-display")) {
        gameShotObserver.observe(
          document.querySelector("#ad-ext-player-display"),
          {
            childList: true,
            attributes: true,
            attributeFilter: ["class"],
            subtree: true,
          }
        );
        gameVariant.parentElement.insertAdjacentHTML(
          "beforeend",
          /*html*/ `<div class="observer-running"></div>`
        );
      }
    }
  };
})();
