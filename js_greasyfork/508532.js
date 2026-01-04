// ==UserScript==
// @name        RichDarts - Remote input connection hub for Autodarts
// @namespace   https://greasyfork.org/en/users/913506-dotty-dev
// @match       *://lidarts.org/game/*
// @match       *://play.autodarts.io/*
// @match       *://login.autodarts.io/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_openInTab
// @grant       GM_getTab
// @grant       GM_saveTab
// @grant       GM_notification
// @version     2.1.2
// @author      dotty-dev
// @license     MIT
// @description Connect a lidarts.org game with autodarts.io to automatically enter thrown scores into lidarts. This is a proof of concept and may break or don't function as expected, if you need to correct scores you will have to use autodarts to create the correct score. Manual score input is not possible while the script is running. Lidarts example can be used to implement other sites.
// @downloadURL https://update.greasyfork.org/scripts/508532/RichDarts%20-%20Remote%20input%20connection%20hub%20for%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/508532/RichDarts%20-%20Remote%20input%20connection%20hub%20for%20Autodarts.meta.js
// ==/UserScript==
/*jshint esversion: 11 */
/*jshint laxbreak:true */

let websocketListenerActive = false;

function listen(fn) {
  fn = fn || console.log;

  let property = Object.getOwnPropertyDescriptor(
    MessageEvent.prototype,
    "data"
  );

  const data = property.get;

  // wrapper that replaces getter
  function lookAtMessage() {
    let socket = this.currentTarget instanceof WebSocket;

    if (!socket) {
      return data.call(this);
    }

    let msg = data.call(this);

    Object.defineProperty(this, "data", { value: msg }); //anti-loop
    fn({ data: msg, socket: this.currentTarget, event: this });
    return msg;
  }

  property.get = lookAtMessage;

  Object.defineProperty(MessageEvent.prototype, "data", property);
}

function tryParseJSONObject(jsonString) {
  try {
    var o = JSON.parse(jsonString);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}

  return jsonString;
}

function injectWebsocketListener() {
  if (websocketListenerActive === false) {
    websocketListenerActive = true;
    let observer = new MutationObserver(function () {
      if (document.head) {
        observer.disconnect();
        listen(({ data }) => {
          const adObj = tryParseJSONObject(data);
          const score = adObj?.data?.turnScore;
          if (typeof score === "number") {
            GM_setValue("adScore", score);
          }
        });
      }
    });
    observer.observe(document, { subtree: true, childList: true });
  }
}

(async function () {
  const site = location.host;
  let lidartLegs = 0;
  let gameSettingsAutodarts = {
    baseScore: 501,
    inMode: "Straight",
    outMode: "Double",
    maxRounds: 80,
    bullMode: "25/50",
    bullOff: "Off",
    matchMode: "Off",
    lobby: "Private",
  };
  let connectionEstablished = false;
  GM_deleteValue("autodartsHeartbeat");
  GM_setValue("startNewGame", false);
  GM_setValue("abortGame", false);

  async function lidartsInit() {
    console.info("RichDarts: we're on lidarts");

    const callerMuter = setInterval(() => {
      let muteLink = document.getElementById("mute");
      muteLink.click();
      if (muteLink.style.display == "none") {
        clearInterval(callerMuter);
      }
    }, 500);
    const gameUrl = location.href;
    const apiUrl = gameUrl.replace("/game/", "/api/game/");
    let gameData = await fetch(apiUrl).then((resp) => resp.json());
    gameSettingsAutodarts.baseScore = gameData.type;
    gameSettingsAutodarts.inMode =
      gameData.in_mode === "si"
        ? "Straight"
        : gameData.in_mode === "di"
        ? "Double"
        : "Master";
    gameSettingsAutodarts.outMode =
      gameData.out_mode === "so"
        ? "Straight"
        : gameData.out_mode === "do"
        ? "Double"
        : "Master";

    GM_setValue("lobbySettings", JSON.stringify(gameSettingsAutodarts));
    const bullNotificationElement = document.querySelector(
      "#closest_to_bull_notification_div"
    );
    const waitForBullOff = setInterval(() => {
      if (
        !bullNotificationElement ||
        bullNotificationElement.style.display == "none"
      ) {
        insertRichDartsButton();
        clearInterval(waitForBullOff);
      }
    }, 500);
  }

  function startLidartsLoop(event) {
    event.preventDefault();
    console.warn(`autodartsHeartbeat: ${GM_getValue("autodartsHeartbeat")}`);
    if (connectionEstablished) {
      GM_notification("RichDarts is already connected");
      return;
    } else {
      GM_setValue("isConnectRichDarts", true);
    }
    if (
      parseInt(document.querySelector(".p1_score").textContent) !=
        gameSettingsAutodarts.baseScore &&
      parseInt(document.querySelector(".p2_score").textContent) !=
        gameSettingsAutodarts.baseScore
    ) {
      GM_notification(
        "Score's don't match base score, please make sure to correct autodarts score!"
      );
    }

    const scoreChangeListener = GM_addValueChangeListener(
      "adScore",
      (key, oldValue, newValue, remote) => {
        const adScore = newValue;
        document.querySelector("#score_value").value = adScore;
      }
    );

    GM_notification("Starting Autodarts Match, please wait");
    openAutodartsTab();
    const richDartsButtons = document.querySelectorAll(".richdarts-connect");

    const adHeartbeatCheck = setInterval(() => {
      let heartbeat = GM_getValue("autodartsHeartbeat");
      if (Date.now() - heartbeat < 20000) {
        if (connectionEstablished === false) {
          connectionEstablished = true;
        }
          richDartsButtons.forEach((el) => {
            let crosshairsClassList =
              el.querySelector(".fa-crosshairs").classList;
            crosshairsClassList.add("text-success");
            crosshairsClassList.remove("text-warning");
            el.querySelector(".richdarts-status").innerText =
              "RichDarts Connected";
          });
      } else if (
        Date.now() - heartbeat > 20000 ||
        !!GM_getValue("autodartsHeartbeat")
      ) {
        console.info("RichDarts: Autodarts connection lost. Stopping loop.");
        connectionEstablished = false;
        clearInterval(adHeartbeatCheck);
        richDartsButtons.forEach((el) => {
          el.disabled = false;
          let crosshairsClassList =
            el.querySelector(".fa-crosshairs").classList;
          crosshairsClassList.remove("text-success");
          crosshairsClassList.add("text-danger");
          el.querySelector(".richdarts-status").innerText =
            "RichDarts disconnected";
        });
      } else {
        console.info(`adHeartbeat: ${heartbeat}`);
        richDartsButtons.forEach((el) => {
          el.disabled = true;
          let crosshairsClassList =
            el.querySelector(".fa-crosshairs").classList;
          crosshairsClassList.add("text-warning");
          crosshairsClassList.remove("text-danger");
          el.querySelector(".richdarts-status").innerText =
            "RichDarts Connecting...";
        });
      }

      let gameCompleted =
        document.querySelector("#confirm_completion").style.display != "none";
      let gameAborted =
        document.querySelector("#game-aborted").style.display != "none";

      if (gameCompleted || gameAborted) {
        GM_setValue("abortGame", true);
        GM_removeValueChangeListener(scoreChangeListener);
      }

      let currentLegsPlayed =
        parseInt(document.querySelector(".p1_legs").textContent) +
        parseInt(document.querySelector(".p2_legs").textContent);
      if (currentLegsPlayed > lidartLegs && !(gameCompleted || gameAborted)) {
        lidartLegs = currentLegsPlayed;
        console.info("RichDarts: starting new Autodarts round");
        GM_setValue("startNewRound", true);
      }
    }, 2500);
  }

  function insertRichDartsButton() {
    const richDartsButtonDummy = document.createElement("div");

    richDartsButtonDummy.innerHTML = /*html*/ `
          <button class="btn btn-primary btn-sm richdarts-connect btn-block mb-3 px-0">
            <span class="fa-stack fa-lg">
              <i class="fas fa-square fa-stack-2x"></i>>
              <i class="fas fa-crosshairs fa-stack-1x text-danger"></i>
            </span>
            <span class="richdarts-status">
              Connect RichDarts
            </span>
          </button>
        `;

    document
      .querySelectorAll(".score_input input.score_value")
      .forEach((el) => {
        el.parentElement.insertAdjacentElement(
          "afterend",
          richDartsButtonDummy.querySelector("button").cloneNode(1)
        );
      });

    document.querySelectorAll(".richdarts-connect").forEach((el) => {
      el.addEventListener("click", startLidartsLoop);
    });
  }

  function autodartsApplySettings(buttons) {
    let settingsClicker = setInterval(() => {
      console.info("RichDarts: trying to apply settings");
      setTimeout(() => {
        buttons?.baseScore.click();
      }, 0);
      setTimeout(() => {
        buttons?.inMode.click();
      }, 50);
      setTimeout(() => {
        buttons?.outMode.click();
      }, 100);
      setTimeout(() => {
        buttons?.maxRounds.click();
      }, 150);
      setTimeout(() => {
        buttons?.bullMode.click();
      }, 200);
      setTimeout(() => {
        buttons?.bullOff.click();
      }, 250);
      setTimeout(() => {
        buttons?.matchMode.click();
      }, 300);
      setTimeout(() => {
        buttons?.lobby.click();
      }, 350);

      if (Object.values(buttons).every((el) => el?.dataset.active === "")) {
        console.info("RichDarts: all settings applied, stopping loop");
        clearInterval(settingsClicker);
        buttons.openButton.click();

        let gameStarter = setInterval(() => {
          console.info("RichDarts: looking for game start button");
          document.querySelectorAll("button").forEach((el) => {
            if (el.innerText === "Start game") {
              if (!el.disabled) {
                el.click();
                clearInterval(gameStarter);
                const gameLoadedCheck = setInterval(() => {
                  if (
                    document.getElementById("ad-ext-game-variant")?.innerText ==
                    "X01"
                  ) {
                    clearInterval(gameLoadedCheck);
                    autodartsSendScores();
                  }
                }, 250);
              }
            }
          });
        }, 250);
      }
    }, 250);
  }

  function autodartsSendScores() {
    let abortButton;
    document
      .querySelector("#ad-ext-game-variant")
      ?.closest(".css-0")
      ?.querySelectorAll("button")
      ?.forEach((el) => {
        if (el.innerText === "Abort") {
          abortButton = el;
        }
      });
    let newGame = false;
    GM_deleteValue("isConnectRichDarts");
    console.info("RichDarts: init sending scores...");
    console.info(
      `autodartsHeartbeat is ${!!GM_getValue("autodartsHeartbeat")}`
    );

    injectWebsocketListener();

    const sendHeartbeat = setInterval(() => {
      GM_setValue("autodartsHeartbeat", Date.now());
    }, 2500);

    const startNewRoundListener = GM_addValueChangeListener(
      "startNewRound",
      (key, oldValue, newValue, remote) => {
        if (newValue === true) {
          GM_setValue("startNewRound", false);
          GM_setValue("isConnectRichDarts", true);
          clearInterval(sendHeartbeat);
          newGame = true;
          let finishButton;
          document
            .querySelector("#ad-ext-turn + div")
            .querySelectorAll("button")
            .forEach((el) => {
              if (el.innerText === "Finish") {
                finishButton = el;
              }
            });
          if (finishButton) {
            finishButton.click();
          } else {
            let i = 0;
            const abortGame = setInterval(() => {
              abortButton.click();
              i++;
              if (i === 3) {
                clearInterval(abortGame);
              }
            }, 500);
          }
          restartOrClose();
        }
      }
    );

    const abortGameListener = GM_addValueChangeListener(
      "abortGame",
      (key, oldValue, newValue, remote) => {
        if (newValue === true) {
          GM_setValue("abortGame", false);
          clearInterval(sendHeartbeat);
          let finishButton;
          document
            .querySelector("#ad-ext-turn + div")
            ?.querySelectorAll("button")
            ?.forEach((el) => {
              if (el.innerText === "Finish") {
                finishButton = el;
              }
            });
          if (finishButton) {
            finishButton.click();
            restartOrClose();
          } else {
            let i = 0;
            const abortGame = setInterval(() => {
              abortButton.click();
              i++;
              if (i === 3) {
                clearInterval(abortGame);
                restartOrClose();
              }
            }, 500);
          }
        }
      }
    );

    function restartOrClose() {
      clearInterval(sendHeartbeat);
      GM_removeValueChangeListener(abortGameListener);
      GM_removeValueChangeListener(startNewRoundListener);
      if (newGame) {
        console.info("RichDarts: Started new round");
        // document.querySelector('a').click();
        setTimeout(() => autodartsInit(), 2000);
      } else {
        GM_notification(
          "Autodarts tabs that were opened by RichDarts will be closed"
        );
        setTimeout(() => {
          window.close();
        }, 2000);
      }
    }
  }

  async function autodartsInit() {
    GM_setValue("abortGame", false);
    GM_setValue("startNewRound", false);
    const isConnect = GM_getValue("isConnectRichDarts");
    if (isConnect) {
      gameSettingsAutodarts = JSON.parse(GM_getValue("lobbySettings"));
      let loopInterval = null;
      console.info("RichDarts: we're on autodarts");
      const autodartsNewLobbyButtons = {
        baseScore: undefined,
        inMode: undefined,
        outMode: undefined,
        maxRounds: undefined,
        bullMode: undefined,
        bullOff: undefined,
        matchMode: undefined,
        lobby: undefined,
        openButton: undefined,
      };
      const x01start = () => {
        console.info("RichDarts: x01start interval running");
        if(location.href !== "https://play.autodarts.io/lobbies/new/x01") {
          clearInterval(loopInterval);
          location.href = "https://play.autodarts.io/lobbies/new/x01";
        }
        if (location.href === "https://play.autodarts.io/lobbies/new/x01") {
          clearInterval(loopInterval);
        }
      };
      setTimeout(() => {
        if (location.href !== "https://play.autodarts.io/lobbies/new/x01") {
          loopInterval = setInterval(x01start, 500);
        }
      },500);

      let settingsElsGetter = setInterval(() => {
        if (
          !Object.values(autodartsNewLobbyButtons).some(
            (val) => val === undefined
          )
        ) {
          clearInterval(settingsElsGetter);
          console.info("RichDarts: all Settings loaded");
          console.info(gameSettingsAutodarts);
          console.info(autodartsNewLobbyButtons);
          autodartsApplySettings(autodartsNewLobbyButtons);
        } else {
          console.info("RichDarts: runningElementGetter");
          document.querySelectorAll(".chakra-text").forEach((el) => {
            switch (el.innerText) {
              case "Base score":
                el.nextSibling.querySelectorAll("button").forEach((el) => {
                  if (el.innerText == gameSettingsAutodarts.baseScore) {
                    autodartsNewLobbyButtons.baseScore = el;
                  }
                });
                break;
              case "In mode":
                el.nextSibling.querySelectorAll("button").forEach((el) => {
                  if (el.innerText == gameSettingsAutodarts.inMode) {
                    autodartsNewLobbyButtons.inMode = el;
                  }
                });
                break;
              case "Out mode":
                el.nextSibling.querySelectorAll("button").forEach((el) => {
                  if (el.innerText == gameSettingsAutodarts.outMode) {
                    autodartsNewLobbyButtons.outMode = el;
                  }
                });
                break;
              case "Max rounds":
                el.nextSibling.querySelectorAll("button").forEach((el) => {
                  if (el.innerText == gameSettingsAutodarts.maxRounds) {
                    autodartsNewLobbyButtons.maxRounds = el;
                  }
                });
                break;
              case "Bull mode":
                el.nextSibling.querySelectorAll("button").forEach((el) => {
                  if (el.innerText == gameSettingsAutodarts.bullMode) {
                    autodartsNewLobbyButtons.bullMode = el;
                  }
                });
                break;
              case "Bull-off":
                el.nextSibling.querySelectorAll("button").forEach((el) => {
                  if (el.innerText == gameSettingsAutodarts.bullOff) {
                    autodartsNewLobbyButtons.bullOff = el;
                  }
                });
                break;
              case "Match mode":
                el.nextSibling.querySelectorAll("button").forEach((el) => {
                  if (el.innerText == gameSettingsAutodarts.matchMode) {
                    autodartsNewLobbyButtons.matchMode = el;
                  }
                });
                break;
              case "Lobby":
                el.nextSibling.querySelectorAll("button").forEach((el) => {
                  if (el.innerText == gameSettingsAutodarts.lobby) {
                    autodartsNewLobbyButtons.lobby = el;
                  }
                });
                break;
              default:
                break;
            }
          });
          document.querySelectorAll("button.chakra-button").forEach((el) => {
            if (el.innerText === "Open Lobby") {
              autodartsNewLobbyButtons.openButton = el;
              el.dataset.active = "";
            }
          });
        }
      }, 200);
    }
  }

  function openAutodartsTab() {
    console.info("RichDarts: trying to open a new tab");
    GM_openInTab("https://play.autodarts.io/lobbies/new/x01", true);
  }

  switch (site) {
    case "play.autodarts.io":
      autodartsInit();
      break;
    case "login.autodarts.io":
      alert(
        "You need to log in to Autodarts for RichDarts to connect your games."
      );
      break;
    case "lidarts.org":
      if (location.pathname !== "/game/create") {
        lidartsInit();
      }
      break;
  }
})();
