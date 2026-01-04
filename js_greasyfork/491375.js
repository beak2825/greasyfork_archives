// ==UserScript==
// @name         AutoBSC
// @namespace    https://catme0w.org
// @homepageURL  https://github.com/CatMe0w/AutoBSC
// @supportURL   https://github.com/CatMe0w/AutoBSC/issues
// @license      MIT
// @version      0.1.1
// @description  Auto completes Brawl Stars Championship live stream events
// @author       catme0w
// @match        https://event.supercell.com/brawlstars/*
// @icon         https://event.supercell.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491375/AutoBSC.user.js
// @updateURL https://update.greasyfork.org/scripts/491375/AutoBSC.meta.js
// ==/UserScript==

// ==================== Begin AutoBSC Configuration ====================
// Set to false to disable
// Set to true to enable

// Auto send cheer, +5 points
const cheerEnabled = true;

// Auto send poll (choosing MVP), always choose the first option, +100 points
const pollEnabled = true;

// Auto send quiz, always choose the first option, +10 points
const quizEnabled = true;

// Auto send match prediction, always choose the the first option, +10 points
// Note: It's recommended to submit your own prediction before matches start. If the semifinals or grand finals don't follow your previous predictions, you will have chance to submit a new prediction and you can let AutoBSC to do it for you.
const matchPredictionEnabled = true;

// ===================== End AutoBSC Configuration =====================

// The rest of the code is not recommended to modify unless you know what you are doing
(function () {
  "use strict";

  let loaded = false;

  let lastCheerId = "";
  let lastPollId = "";
  let lastQuizId = "";
  let lastMatchPredictionId = "";

  const OriginalWebSocket = window.WebSocket;

  class PatchedWebSocket extends OriginalWebSocket {
    constructor(...args) {
      super(...args);

      const originalGet = Object.getOwnPropertyDescriptor(OriginalWebSocket.prototype, "onmessage").get;

      const originalSet = Object.getOwnPropertyDescriptor(OriginalWebSocket.prototype, "onmessage").set;

      Object.defineProperty(this, "onmessage", {
        configurable: true,
        enumerable: true,
        get() {
          return originalGet.call(this);
        },
        set(newOnMessage) {
          const onMessage = (event) => {
            parse(event.data, this);
            newOnMessage(event);
          };
          originalSet.call(this, onMessage);
        },
      });

      const originalSend = this.send;

      this.send = function (data) {
        const parsed = JSON.parse(data);
        const typeId = parsed.payload.typeId;
        if (typeId === lastPollId || typeId === lastQuizId || typeId === lastMatchPredictionId) {
          console.log("[AutoBSC] Ignoring message:", data);
          return;
        }
        console.log("[AutoBSC] Sending message:", data);
        originalSend.call(this, data);
      };
    }
  }

  window.WebSocket = PatchedWebSocket;

  function parse(data, ws) {
    console.log("[AutoBSC] Received message:", data);

    const events = JSON.parse(data);
    const event = events[0];
    const messageType = event.messageType;

    if (messageType === "global_state" && !loaded) {
      setupAutoBsc();
    }

    if (messageType === "cheer" && cheerEnabled) {
      if (event.payload.typeId !== lastCheerId) {
        console.log("[AutoBSC] Sending cheer");

        setTimeout(() => {
          ws.send('{"messageType":"cheer","payload":{"contestantSide":"red","cheers":{"5":1}},"timestamp":' + Date.now() + "}");
          lastCheerId = event.payload.typeId;
        }, 3500);

        setTimeout(() => {
          ws.send('{"messageType":"cheer","payload":{"contestantSide":"blue","cheers":{"5":1}},"timestamp":' + Date.now() + "}");
          lastCheerId = event.payload.typeId;
        }, 4500);
      }
    }

    if (messageType === "poll" && pollEnabled) {
      if (event.payload.typeId !== lastPollId) {
        console.log("[AutoBSC] Sending poll");

        setTimeout(() => {
          ws.send('{"messageType":"poll","payload":{"typeId":"' + event.payload.typeId + '","alternative":0},"timestamp":' + Date.now() + "}");
          lastPollId = event.payload.typeId;
        }, 3500);
      }
    }

    if (messageType === "quiz" && quizEnabled) {
      if (event.payload.typeId !== lastQuizId) {
        console.log("[AutoBSC] Sending quiz");

        setTimeout(() => {
          ws.send('{"messageType":"quiz","payload":{"typeId":"' + event.payload.typeId + '","alternative":0},"timestamp":' + Date.now() + "}");
          lastQuizId = event.payload.typeId;
        }, 3500);
      }
    }

    if (messageType === "match_prediction" && matchPredictionEnabled) {
      if (event.payload.typeId !== lastMatchPredictionId) {
        console.log("[AutoBSC] Sending match prediction");

        setTimeout(() => {
          ws.send(
            '{"messageType":"match_prediction","payload":{"typeId":"' + event.payload.typeId + '","contestantSide":"red"},"timestamp":' + Date.now() + "}"
          );
          lastMatchPredictionId = event.payload.typeId;
        }, 3500);
      }
    }
  }

  function setupLoadedMessage() {
    const interval = setInterval(() => {
      const div = document.getElementsByClassName("Feed__content")[0];
      if (div) {
        div.insertAdjacentHTML("afterbegin", loadedMessageHtml);
        clearInterval(interval);
      }
    }, 500);
  }

  function setupAutoReconnect() {
    const reconnectButtonContainer = document.querySelector("#__layout > div > div:nth-child(5)");
    const reconnectButton = document.querySelector(
      "#__layout > div > div:nth-child(5) > div > div > div > div.baseModal__scroll > div > div > button > div.RectangleButton.RectangleButton--cta > div > div"
    );

    setInterval(() => {
      if (reconnectButtonContainer.style.display !== "none") {
        console.log("[AutoBSC] Reconnecting");
        reconnectButton.click();
      }
    }, 1000);
  }

  function setupAutoBsc() {
    loaded = true;

    setupLoadedMessage();
    setupAutoReconnect();

    console.log("[AutoBSC] AutoBSC loaded");
  }

  const loadedMessageHtml = `<div data-v-de33a6f6="" data-v-48743964="">
  <div
    data-v-9ed8f490=""
    data-v-de33a6f6=""
    class="Container Container--extraTopMargin"
    style="translate: none; rotate: none; scale: none; transform: translate(0px, 0px)"
  >
    <div data-v-7b4ba43f="" data-v-9ed8f490="" class="BaseCard BaseCard--rmedium">
      <div
        data-v-9ed8f490=""
        data-v-7b4ba43f=""
        class="ContentCard ContentCard--disabled ContentCard--inactive ContentCard--isFullWidth ContentCard--isCelebration"
      >
        <div data-v-9ed8f490="" data-v-7b4ba43f="" class="ContentCard__celebration">
          <div data-v-9ed8f490="" data-v-7b4ba43f="" class="ContentCard__celebration__background"></div>
          <div data-v-9ed8f490="" data-v-7b4ba43f="" class="ContentCard__celebration__bottomContainer"></div>
          <div data-v-de33a6f6="" data-v-7b4ba43f="" class="RewardCard">
            <div data-v-de33a6f6="" class="RewardCard__rewardContainer" data-v-7b4ba43f="">
              <div data-v-de33a6f6="" class="RewardCard__reward" style="translate: none; rotate: none; scale: none; transform: translate(0px, 0px)">
                <picture data-v-3740ac92="" data-v-de33a6f6="" class="cms-image cms-image--fullWidth cms-image--loaded cms-image--fullWidth"
                  >
                  <img
                    data-v-3740ac92=""
                    src="https://event.supercell.com/brawlstars/assets/rewards/images/emoji_starr.svg"
                    class="cms-image cms-image--fullWidth cms-image--loaded cms-image--fullWidth"
                /></picture>
              </div>
              <div data-v-de33a6f6="" class="RewardCard__infoContainer">
                <div data-v-de33a6f6="" class="RewardCard__textContainer" style="opacity: 1">
                  <div data-v-de33a6f6="" class="RewardCard__textContainer__title">AutoBSC loaded</div>
                  <div data-v-de33a6f6="" class="RewardCard__textContainer__subTitle">made by catme0w</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
})();
