// ==UserScript==
// @name         x01 Active Player Score Display for Autodarts
// @version      0.8
// @description  Displays only the active player's points and throws and nothing else, please be aware that this script hides any and all controlls once active!
// @author       dotty-dev
// @license      MIT
// @match        *://*.autodarts.io/*
// @match        *://autodarts.io/*
// @namespace    https://greasyfork.org/en/users/913506-dotty-dev
// @downloadURL https://update.greasyfork.org/scripts/489918/x01%20Active%20Player%20Score%20Display%20for%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/489918/x01%20Active%20Player%20Score%20Display%20for%20Autodarts.meta.js
// ==/UserScript==
/*jshint esversion: 11 */

(function () {
  "use strict";

  const uiElements = {};
  const correctionButtonTexts = ["Ok", "Cancel"];

  const documentObserver = new MutationObserver((mutationRecords) => {
    if (mutationRecords[0]?.target.classList.contains("chakra-wrap__list")) {
      uiElements.regularContent = document.querySelector(
        "#ad-ext-player-display"
      ).parentElement.parentElement;
      uiElements.turnRow = document.querySelector("#ad-ext-turn");
      uiElements.playerRow = document.querySelector("#ad-ext-player-display");
      uiElements.activePlayer = document.querySelector(
        ".ad-ext-player-active"
      ).parentElement;
      toggleScoreDisplay();
    } else {
      if (
        (document.querySelector('a[href="/lobbies/new/x01"]') &&
          document.querySelector("#big-score-container")) ||
        (document.querySelector("#big-score-container") &&
          uiElements.bigScoreContainer.parentElement.querySelector(
            ".chakra-heading"
          ) &&
          uiElements.bigScoreContainer.parentElement.querySelector(
            ".chakra-heading"
          ).textContent === "Board has no active match") ||
        document.querySelector('a[href^="/history/matches/"][href$="leg=0"]')
      ) {
        uiElements.bigScoreContainer.remove();
        console.log("Toggling");
      }
    }
  });

  documentObserver.observe(document, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  });

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName == "class") {
        if (mutation.target.classList.contains("ad-ext-player-active")) {
          uiElements.activePlayer = mutation.target.parentElement;
          uiElements.bigScoreContainer.insertAdjacentElement(
            "afterbegin",
            uiElements.activePlayer
          );
          uiElements.playerRow.insertAdjacentElement(
            "afterbegin",
            document.querySelector(".ad-ext-player:not(.ad-ext-player-active)")
              .parentElement
          );
        }
      }
    });
  });

  const toggleScoreDisplay = () => {
    uiElements.activePlayer = document.querySelector(
      ".ad-ext-player-active"
    ).parentElement;

    if (document.querySelectorAll("style#active-player-big-score").length < 1) {
      document.head.insertAdjacentHTML(
        "beforeend",
        /*html*/ `
              <style id="active-player-big-score">
                 #big-score-container {
                  display: flex;
                  flex-direction: column;
                  gap: var(--chakra-space-4);
                  padding: var(--chakra-space-4);
                  width: 100%;
                  height: 100%;
                }

                #big-score-container .ad-ext-player > div:first-child {
                  margin: 0;
                }

                #big-score-container .ad-ext-player-score {
                  margin: 0;
                }

                #big-score-container .ad-ext-player + div *:not(.game-shot-message) {
                  font-size: 5vh;
                  line-height: 5vh;
                }

                #big-score-container .ad-ext-player + div > div > div > div {
                  width: unset;
                  height: unset;
                  padding: 3px;
                }

                #big-score-container .ad-ext-player-score {
                  font-size: 18vh;
                  line-height: 18vh;
                }

                #big-score-container .ad-ext-player-score + *:not(.game-shot-message) ,
                #big-score-container .game-shot-message + * {
                  margin-bottom: 2vh;
                }

                #big-score-container .ad-ext-player .chakra-avatar,
                #big-score-container .ad-ext-player .chakra-avatar__img{
                  height: 10vh;
                  width: 10vh;
                }

                #big-score-container .ad-ext-player-score + *:not(.game-shot-message) *,
                #big-score-container .game-shot-message + * *{
                  font-size: 10vh;
                }

                #big-score-container .ad-ext-player-name + img {
                  height: 10vh;
                  width: 6vh;
                }

                #big-score-container .ad-ext-player > .chakra-container > div {
                  width: calc(var(--chakra-sizes-prose) - 2 * var(--chakra-space-4));
                  max-width: 23vw;
                }

                #big-score-container table {
                  height: 100%;
                  width: 100%;
                  max-width: 100%;
                }


                #big-score-container table td {
                  min-width: clamp(11.5vw, 50%, 11.5vw) !important;
                }

                #big-score-container #ad-ext-turn * {
                  font-size: 12vh;
                  line-height: 1.5;
                }

                #big-score-container .game-shot-animation .ad-ext-player-score {
                  font-size: 16vh;
                  line-height: 1.2;
                }

                #big-score-container .game-shot-animation .game-shot-message {
                  font-size: 8vh;
                  line-height: 1.5;
                }

                #big-score-container .close-score-display {
                  position: absolute;
                  top: 3em;
                  right: 3em;
                  z-index: 999;
                }

                @media (orientation: landscape) {
                  #big-score-container .ad-ext-player-score {
                    font-size: 43vh;
                    line-height: 46vh;
                  }

                  #big-score-container .ad-ext-player > div:nth-child(1) {
                    width: 67%;
                  }

                  #big-score-container .ad-ext-player > div:nth-child(2) {
                    width: 0%;
                  }

                  #big-score-container .ad-ext-player > div:nth-child(3) {
                    width: 33%;
                  }

                  #big-score-container .ad-ext-player table {
                    font-size: 6vh !important;
                  }
                }

                @media (orientation: portrait) {
                  #big-score-container .ad-ext-player-score + *:not(.game-shot-message) ,
                  #big-score-container .game-shot-message + * {
                    margin-bottom: 1vh;
                  }

                  #big-score-container .ad-ext-player-score + *:not(.game-shot-message) *,
                  #big-score-container .game-shot-message + * *{
                    font-size: 5vh;
                  }

                  #big-score-container .ad-ext-player .chakra-avatar,
                  #big-score-container .ad-ext-player .chakra-avatar__img {
                    height: 5vh;
                    width: 5vh;
                  }

                  #big-score-container .ad-ext-player-name + img {
                    height: 5vh;
                    width: 3vh;
                  }

                  #big-score-container .ad-ext-player {
                    flex-direction: row;
                    flex-wrap: wrap;
                  }

                  #big-score-container .ad-ext-player > div:nth-child(3) {
                    position: relative;
                  }

                  #big-score-container .ad-ext-player > .chakra-container {
                    height: unset !important;
                    max-width: unset;
                    display: flex;
                    justify-content: center;
                  }

                  #big-score-container .ad-ext-player > .chakra-container > div{
                    max-width: 35vw;
                  }


                  #big-score-container .ad-ext-player table {
                    font-size: calc(30vh / 6) !important;
                    width: 100%;
                    height: 100%;
                  }

                  #big-score-container .ad-ext-player table td {
                    min-width: 17.5vw !important;
                  }

                  #big-score-container #ad-ext-turn {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                  }

                  #big-score-container #ad-ext-turn * {
                    font-size: 6vh;
                    line-height: 1.5;
                  }
                }

              </style>
              `
      );
    }

    if (document.querySelectorAll("#toggle-score-display").length < 1) {
      const extMenu = document.querySelector("#ad-ext-user-menu-extra");
      extMenu.style.display = "";
      let toggleButton = extMenu.parentElement
        .querySelector("button")
        .cloneNode();
      toggleButton.dataset.index++;
      toggleButton.innerHTML = "Toggle Score Display";
      toggleButton.style.display = "";
      toggleButton.id = "toggle-score-display";

      extMenu.insertAdjacentElement("afterend", toggleButton);
      toggleButton.addEventListener("click", toggleScoreDisplay);
      document.addEventListener("click", (e) => {
        if (
          (correctionButtonTexts.includes(e.target.textContent) ||
            correctionButtonTexts.includes(
              e.target?.closest("button")?.textContent
            )) &&
          document.querySelector("[data-toggled-from-big-score]")
        ) {
          toggleScoreDisplay();
          document
            .querySelector("[data-toggled-from-big-score]")
            .removeAttribute("data-toggled-from-big-score");
        }

        if (
          document.querySelector("#big-score-container") &&
          (e.target.classList.contains("ad-ext-turn-throw") ||
            e.target.closest(".ad-ext-turn-throw"))
        ) {
          e.target.dataset.toggledFromBigScore = true;
          toggleScoreDisplay();
        }
      });
    }

    if (!document.querySelector("#active-player-score-display-toggle")) {
      const infoLine = document.querySelector(
        "#ad-ext-game-variant"
      ).parentElement;
      let toggleButtonTop = infoLine.lastElementChild.cloneNode();
      toggleButtonTop.dataset.index++;
      toggleButtonTop.innerHTML = /*html*/ `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="1.6em" width="1.6em">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M9.94358 3.25H14.0564C15.8942 3.24998 17.3498 3.24997 18.489 3.40314C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.1071 5.38961 22.4392 6.33856 22.5969 7.51098C22.6873 8.18385 22.7244 8.9671 22.7395 9.87428C22.7464 9.91516 22.75 9.95716 22.75 10C22.75 10.0353 22.7476 10.0699 22.7429 10.1039C22.75 10.6696 22.75 11.2818 22.75 11.9436V13C22.75 13.4142 22.4142 13.75 22 13.75C21.5858 13.75 21.25 13.4142 21.25 13V12C21.25 11.5541 21.2499 11.1384 21.248 10.75H2.75199C2.75009 11.1384 2.75 11.5541 2.75 12C2.75 13.9068 2.75159 15.2615 2.88976 16.2892C3.02502 17.2952 3.27869 17.8749 3.7019 18.2981C4.12511 18.7213 4.70476 18.975 5.71085 19.1102C6.73851 19.2484 8.09318 19.25 10 19.25H13C13.4142 19.25 13.75 19.5858 13.75 20C13.75 20.4142 13.4142 20.75 13 20.75H9.94359C8.10583 20.75 6.65019 20.75 5.51098 20.5969C4.33856 20.4392 3.38961 20.1071 2.64124 19.3588C1.89288 18.6104 1.56076 17.6614 1.40314 16.489C1.24997 15.3498 1.24998 13.8942 1.25 12.0564V11.9436C1.24999 11.2818 1.24999 10.6696 1.25714 10.1039C1.25243 10.0699 1.25 10.0352 1.25 10C1.25 9.95716 1.25359 9.91517 1.26049 9.87429C1.27564 8.96711 1.31267 8.18385 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40314C6.65019 3.24997 8.10582 3.24998 9.94358 3.25ZM2.77607 9.25H21.2239C21.2044 8.66327 21.1701 8.15634 21.1102 7.71085C20.975 6.70476 20.7213 6.12511 20.2981 5.7019C19.8749 5.27869 19.2952 5.02502 18.2892 4.88976C17.2615 4.75159 15.9068 4.75 14 4.75H10C8.09318 4.75 6.73851 4.75159 5.71085 4.88976C4.70476 5.02502 4.12511 5.27869 3.7019 5.7019C3.27869 6.12511 3.02502 6.70476 2.88976 7.71085C2.82987 8.15634 2.79564 8.66327 2.77607 9.25ZM18 14.75C16.7574 14.75 15.75 15.7574 15.75 17C15.75 18.2426 16.7574 19.25 18 19.25C19.2426 19.25 20.25 18.2426 20.25 17C20.25 15.7574 19.2426 14.75 18 14.75ZM14.25 17C14.25 14.9289 15.9289 13.25 18 13.25C20.0711 13.25 21.75 14.9289 21.75 17C21.75 17.7643 21.5213 18.4752 21.1287 19.068L22.0303 19.9697C22.3232 20.2626 22.3232 20.7374 22.0303 21.0303C21.7374 21.3232 21.2626 21.3232 20.9697 21.0303L20.068 20.1287C19.4752 20.5213 18.7643 20.75 18 20.75C15.9289 20.75 14.25 19.0711 14.25 17ZM5.25 16C5.25 15.5858 5.58579 15.25 6 15.25H10C10.4142 15.25 10.75 15.5858 10.75 16C10.75 16.4142 10.4142 16.75 10 16.75H6C5.58579 16.75 5.25 16.4142 5.25 16Z"
              fill="#ffffff"></path>
          </g>
        </svg>
      `;
      toggleButtonTop.id = "active-player-score-display-toggle";

      infoLine.insertAdjacentElement("beforeend", toggleButtonTop);

      toggleButtonTop.addEventListener("click", (e) => {
        e.preventDefault();
        toggleScoreDisplay();
      });
    }

    if (document.querySelector("#big-score-container")) {
      console.log(uiElements.regularContent);
      mutationObserver.disconnect();
      uiElements.regularContent.style.height = "100%";
      uiElements.regularContent.style.width = "";
      uiElements.regularContent.style.pointerEvents = "";
      uiElements.regularContent.style.opacity = "";

      uiElements.playerRow.insertAdjacentElement(
        "afterbegin",
        uiElements.activePlayer
      );
      uiElements.playerRow.insertAdjacentElement(
        "afterend",
        uiElements.turnRow
      );
      document.querySelector("#big-score-container").remove();
    } else {
      const gameModeElement = document.querySelector("#ad-ext-game-variant");

      if (gameModeElement && gameModeElement.textContent === "X01") {
        uiElements.regularContent.style.height = "0";
        uiElements.regularContent.style.width = "0";
        uiElements.regularContent.style.opacity = "0";
        uiElements.regularContent.style.pointerEvents = "none";

        uiElements.bigScoreContainer = document.createElement("div");

        uiElements.bigScoreContainer.id = "big-score-container";

        uiElements.bigScoreContainer.insertAdjacentElement(
          "afterbegin",
          uiElements.activePlayer
        );

        uiElements.bigScoreContainer.insertAdjacentHTML(
          "afterbegin",
          /*html*/ `
          <button type="button" class="chakra-button close-score-display" aria-label="Close Score Display">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
          </button>
        `
        );

        uiElements.bigScoreContainer
          .querySelector(".close-score-display")
          .addEventListener("click", toggleScoreDisplay);

        uiElements.bigScoreContainer.insertAdjacentElement(
          "beforeend",
          uiElements.turnRow
        );

        if (document.querySelectorAll("#big-score-container").length === 0) {
          uiElements.regularContent.insertAdjacentElement(
            "afterend",
            uiElements.bigScoreContainer
          );
        }

        mutationObserver.observe(uiElements.playerRow, {
          attributes: true,
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    }
  };
})();