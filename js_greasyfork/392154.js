// ==UserScript==
// @name         KPin Checker
// @namespace    http://tampermonkey.net/
// @homepage     https://theusaf.org
// @version      2.0.0
// @license      MIT
// @description  Check the pin of a kahoot game.
// @author       theusaf
// @match        *://play.kahoot.it/*
// @exclude      *://play.kahoot.it/v2/assets/*
// @copyright    2020-2023, Daniel Lau (https://github.com/theusaf/kahoot-antibot)
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/392154/KPin%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/392154/KPin%20Checker.meta.js
// ==/UserScript==

/**
 * PinCheckerMain - The main pin checking function
 */
function main() {
  function listenForTeamMode() {
    document
      .querySelector("[data-functional-selector=team-mode-card]")
      .addEventListener("click", () => {
        console.log("[PIN-CHECKER] - Entered team mode card.");
        setTimeout(() => {
          document
            .querySelector("[data-functional-selector=leave-game-mode-details]")
            .addEventListener("click", () => {
              console.log("[PIN-CHECKER] - Listening again");
              setTimeout(() => listenForTeamMode(), 250);
            });
          document
            .querySelector("[data-functional-selector=start-team-mode-button]")
            .addEventListener("click", () => {
              console.log("[PIN-CHECKER] - Using team mode.");
              window.localStorage.pinCheckerMode = "team";
            });
        }, 250);
      });
  }

  const loader = setInterval(() => {
    if (!document.querySelector("[data-functional-selector=team-mode-card]")) {
      return;
    }
    console.log("[PIN-CHECKER] - Ready!");
    clearInterval(loader);
    listenForTeamMode();

    if (window.localStorage.pinCheckerAutoRelogin === "true") {
      const waiter = setInterval(() => {
        let button = document.querySelector(
          "[data-functional-selector=classic-mode-card]"
        );
        if (window.localStorage.pinCheckerMode === "team") {
          button = document.querySelector(
            "[data-functional-selector=team-mode-card]"
          );
        }
        if (button && !button.disabled) {
          const guestButton = document.querySelector(
            "[data-functional-selector=play-as-guest-button]"
          );
          if (guestButton) {
            guestButton.click();
          }
          button.click();
          if (window.localStorage.pinCheckerMode === "team") {
            setTimeout(() => {
              document
                .querySelector(
                  "[data-functional-selector=start-team-mode-button]"
                )
                .click();
            }, 250);
          }
          window.localStorage.pinCheckerAutoRelogin = false;
          if (
            +window.localStorage.pinCheckerLastQuizIndex <=
            window.kantibotData.kahootInternals.services.game.core.playList
              .length
          ) {
            kantibotData.kahootInternals.services.game.navigation.currentQuizIndex =
              +window.localStorage.pinCheckerLastQuizIndex ?? 0;
          }
          clearInterval(waiter);
          delete window.localStorage.pinCheckerMode;
          delete window.localStorage.pinCheckerLastQuizIndex;
          // check for start button
        }
      }, 500);
    } else {
      delete window.localStorage.pinCheckerMode;
    }
  }, 500);
  let loadChecks = 0;
  const themeLoadChecker = setInterval(() => {
    const errorButton = document.querySelector(
      '[data-functional-selector="dialog-actions"]'
    );
    if (errorButton) {
      clearInterval(themeLoadChecker);
      errorButton.querySelector("button").click();
    } else if (++loadChecks > 10) {
      clearInterval(themeLoadChecker);
    }
  }, 500);

  window.pinCheckerNameList = [];
  window.pinCheckerPin = null;
  window.pinCheckerSendIds = {};
  window.specialData = window.specialData || {};
  window.pinCheckerFalsePositive = false;
  window.pinCheckerFalsePositiveTimeout = null;

  /**
   * ResetGame - Reloads the page
   */
  function resetGame(message) {
    if (window.pinCheckerFalsePositive) {
      return console.log(
        "[PIN-CHECKER] - Detected false-positive broken pin. Not restarting."
      );
    }
    console.error(message || "[PIN-CHECKER] - Pin Broken. Attempting restart.");
    window.localStorage.pinCheckerAutoRelogin = true;
    window.localStorage.pinCheckerLastQuizIndex =
      window.kantibotData.kahootInternals.services.game.navigation.currentQuizIndex;
    window.document.write(
      "<scr" +
        "ipt>" +
        `window.location = "https://play.kahoot.it/v2/${window.location.search}";` +
        "</scr" +
        "ipt>"
    );
  }

  /**
   * concatTokens - From kahoot.js.org. Combines the tokens.
   *
   * @param  {String} headerToken    decoded token
   * @param  {String} challengeToken decoded token 2
   * @returns {String}               The final token
   */
  function concatTokens(headerToken, challengeToken) {
    // Combine the session token and the challenge token together to get the string needed to connect to the websocket endpoint
    let token = "";
    for (let i = 0; i < headerToken.length; i++) {
      const char = headerToken.charCodeAt(i),
        mod = challengeToken.charCodeAt(i % challengeToken.length),
        decodedChar = char ^ mod;
      token += String.fromCharCode(decodedChar);
    }
    return token;
  }

  /**
   * CreateClient - Creates a Kahoot! client to join a game
   * This really only works because kahoot treats kahoot.it, play.kahoot.it, etc as the same thing.
   *
   * @param  {Number} pin The gameid
   */
  function createClient(pin) {
    console.log("[PIN-CHECKER] - Creating client");
    pin += "";
    const sessionRequest = new XMLHttpRequest();
    sessionRequest.open("GET", "/reserve/session/" + pin);
    sessionRequest.send();
    sessionRequest.onload = function () {
      let sessionData;
      try {
        sessionData = JSON.parse(sessionRequest.responseText);
      } catch (e) {
        // probably not found
        return resetGame();
      }
      const headerToken = atob(
        sessionRequest.getResponseHeader("x-kahoot-session-token")
      );
      let { challenge } = sessionData;
      challenge = challenge.replace(/(\u0009|\u2003)/gm, "");
      challenge = challenge.replace(/this /gm, "this");
      challenge = challenge.replace(/ *\. */gm, ".");
      challenge = challenge.replace(/ *\( */gm, "(");
      challenge = challenge.replace(/ *\) */gm, ")");
      challenge = challenge.replace("console.", "");
      challenge = challenge.replace("this.angular.isObject(offset)", "true");
      challenge = challenge.replace("this.angular.isString(offset)", "true");
      challenge = challenge.replace("this.angular.isDate(offset)", "true");
      challenge = challenge.replace("this.angular.isArray(offset)", "true");
      const merger =
          "var _ = {" +
          "    replace: function() {" +
          "        var args = arguments;" +
          "        var str = arguments[0];" +
          "        return str.replace(args[1], args[2]);" +
          "    }" +
          "}; " +
          "var log = function(){};" +
          "return ",
        solver = Function(merger + challenge),
        headerChallenge = solver(),
        finalToken = concatTokens(headerToken, headerChallenge),
        connection = new WebSocket(
          `wss://kahoot.it/cometd/${pin}/${finalToken}`
        ),
        timesync = {};
      let shoken = false,
        clientId = "",
        messageId = 2,
        closed = false,
        name = "";
      connection.addEventListener("error", () => {
        console.error(
          "[PIN-CHECKER] - Socket connection failed. Assuming network connection is lost and realoading page."
        );
        resetGame();
      });
      connection.addEventListener("open", () => {
        connection.send(
          JSON.stringify([
            {
              advice: {
                interval: 0,
                timeout: 60000
              },
              minimumVersion: "1.0",
              version: "1.0",
              supportedConnectionTypes: ["websocket", "long-polling"],
              channel: "/meta/handshake",
              ext: {
                ack: true,
                timesync: {
                  l: 0,
                  o: 0,
                  tc: Date.now()
                }
              },
              id: 1
            }
          ])
        );
      });
      connection.addEventListener("message", (m) => {
        const { data } = m,
          [message] = JSON.parse(data);
        if (message.channel === "/meta/handshake" && !shoken) {
          if (message.ext && message.ext.timesync) {
            shoken = true;
            clientId = message.clientId;
            const { tc, ts, p } = message.ext.timesync,
              l = Math.round((Date.now() - tc - p) / 2),
              o = ts - tc - l;
            Object.assign(timesync, {
              l,
              o,
              get tc() {
                return Date.now();
              }
            });
            connection.send(
              JSON.stringify([
                {
                  advice: { timeout: 0 },
                  channel: "/meta/connect",
                  id: 2,
                  ext: {
                    ack: 0,
                    timesync
                  },
                  clientId
                }
              ])
            );
            // start joining
            setTimeout(() => {
              name = "KCP_" + (Date.now() + "").substr(2);
              connection.send(
                JSON.stringify([
                  {
                    clientId,
                    channel: "/service/controller",
                    id: ++messageId,
                    ext: {},
                    data: {
                      gameid: pin,
                      host: "play.kahoot.it",
                      content: JSON.stringify({
                        device: {
                          userAgent: window.navigator.userAgent,
                          screen: {
                            width: window.screen.width,
                            height: window.screen.height
                          }
                        }
                      }),
                      name,
                      type: "login"
                    }
                  }
                ])
              );
            }, 1000);
          }
        } else if (message.channel === "/meta/connect" && shoken && !closed) {
          connection.send(
            JSON.stringify([
              {
                channel: "/meta/connect",
                id: ++messageId,
                ext: {
                  ack: message.ext.ack,
                  timesync
                },
                clientId
              }
            ])
          );
        } else if (message.channel === "/service/controller") {
          if (message.data && message.data.type === "loginResponse") {
            if (message.data.error === "NONEXISTING_SESSION") {
              // session doesn't exist
              connection.send(
                JSON.stringify([
                  {
                    channel: "/meta/disconnect",
                    clientId,
                    id: ++messageId,
                    ext: {
                      timesync
                    }
                  }
                ])
              );
              connection.close();
              resetGame();
            } else {
              // Check if the client is in the game after 10 seconds
              setTimeout(() => {
                if (!window.pinCheckerNameList.includes(name)) {
                  // Uh oh! the client didn't join!
                  resetGame();
                }
              }, 10e3);
              console.log(
                "[PIN-CHECKER] - Client joined game. Connection is good."
              );
              // good. leave the game.
              connection.send(
                JSON.stringify([
                  {
                    channel: "/meta/disconnect",
                    clientId,
                    id: ++messageId,
                    ext: {
                      timesync
                    }
                  }
                ])
              );
              closed = true;
              setTimeout(() => {
                connection.close();
              }, 500);
            }
          }
        } else if (message.channel === "/service/status") {
          if (message.data.status === "LOCKED") {
            // locked, cannot test
            console.log("[PIN-CHECKER] - Game is locked. Unable to test.");
            closed = true;
            connection.send(
              JSON.stringify([
                {
                  channel: "/meta/disconnect",
                  clientId,
                  id: ++messageId,
                  ext: {
                    timesync
                  }
                }
              ])
            );
            setTimeout(() => {
              connection.close();
            }, 500);
          }
        }
      });
    };
  }

  window.pinCheckerInterval = setInterval(() => {
    if (window.pinCheckerPin) {
      createClient(window.pinCheckerPin);
    }
  }, 60 * 1000);

  /**
   * pinCheckerSendInjector
   * - Checks the sent messages to ensure events are occuring
   * - This is a small fix for a bug in Kahoot.
   *
   * @param  {String} data The sent message.
   */
  window.pinCheckerSendInjector = function pinCheckerSendInjector(data) {
    data = JSON.parse(data)[0];
    const now = Date.now();
    let content = {};
    try {
      content = JSON.parse(data.data.content);
    } catch (e) {
      /* likely no content */
    }
    if (data.data && typeof data.data.id !== "undefined") {
      for (const i in window.pinCheckerSendIds) {
        window.pinCheckerSendIds[i].add(data.data.id);
      }
      // content slides act differently, ignore them
      if (content.gameBlockType === "content") return;

      /**
       * Checks for events and attempts to make sure that it succeeds (doesn't crash)
       * - deprecated, kept in just in case for the moment
       *
       * @param  {Number} data.data.id The id of the action
       */
      switch (data.data.id) {
        case 9: {
          window.pinCheckerSendIds[now] = new Set();
          setTimeout(() => {
            if (!window.pinCheckerSendIds[now].has(1)) {
              // Restart, likely stuck
              resetGame(
                "[PIN-CHECKER] - Detected stuck on loading screen. Reloading the page."
              );
            } else {
              delete window.pinCheckerSendIds[now];
            }
          }, 60e3);
          break;
        }
        case 1: {
          window.pinCheckerSendIds[now] = new Set();
          setTimeout(() => {
            if (!window.pinCheckerSendIds[now].has(2)) {
              // Restart, likely stuck
              resetGame(
                "[PIN-CHECKER] - Detected stuck on get ready screen. Reloading the page."
              );
            } else {
              delete window.pinCheckerSendIds[now];
            }
          }, 60e3);
          break;
        }
        case 2: {
          window.pinCheckerSendIds[now] = new Set();
          // wait up to 5 minutes, assume something wrong
          setTimeout(() => {
            if (
              !window.pinCheckerSendIds[now].has(4) &&
              !window.pinCheckerSendIds[now].has(8)
            ) {
              // Restart, likely stuck
              resetGame(
                "[PIN-CHECKER] - Detected stuck on question answer. Reloading the page."
              );
            } else {
              delete window.pinCheckerSendIds[now];
            }
          }, 300e3);
          break;
        }
      }
    }
  };

  /**
   * closeError
   * - Used when the game is closed and fails to reconnect properly
   */
  window.closeError = function () {
    resetGame("[PIN-CHECKER] - Detected broken disconnected game, reloading!");
  };
}

/**
 * PinCheckerInjector - Checks messages and stores the names of players who joined within the last few seconds
 *
 * @param  {String} message The websocket message
 */
function messageInjector(socket, message) {
  function pinCheckerFalsePositiveReset() {
    window.pinCheckerFalsePositive = true;
    clearTimeout(window.pinCheckerFalsePositiveTimeout);
    window.pinCheckerFalsePositiveTimeout = setTimeout(function () {
      window.pinCheckerFalsePositive = false;
    }, 15e3);
  }
  const data = JSON.parse(message.data)[0];
  if (!socket.webSocket.pinCheckClose) {
    socket.webSocket.pinCheckClose = socket.webSocket.onclose;
    socket.webSocket.onclose = function () {
      socket.webSocket.pinCheckClose();
      setTimeout(() => {
        const stillNotConnected = document.querySelector(
          '[data-functional-selector="disconnected-page"]'
        );
        if (stillNotConnected) {
          window.closeError();
        }
      }, 30e3);
    };
  }
  if (!socket.webSocket.pinCheckSend) {
    socket.webSocket.pinCheckSend = socket.webSocket.send;
    socket.webSocket.send = function (data) {
      window.pinCheckerSendInjector(data);
      socket.webSocket.pinCheckSend(data);
    };
  }
  try {
    const part =
      document.querySelector('[data-functional-selector="game-pin"]') ||
      document.querySelector(
        '[data-functional-selector="bottom-bar-game-pin"]'
      );
    if (
      Number(part.innerText) != window.pinCheckerPin &&
      Number(part.innerText) != 0 &&
      !isNaN(Number(part.innerText))
    ) {
      window.pinCheckerPin = Number(part.innerText);
      console.log(
        "[PIN-CHECKER] - Discovered new PIN: " + window.pinCheckerPin
      );
    } else if (Number(part.innerText) == 0 || isNaN(Number(part.innerText))) {
      window.pinCheckerPin = null;
      console.log(
        "[PIN-CHECKER] - PIN is hidden or game is locked. Unable to test."
      );
    }
  } catch (err) {
    /* Unable to get pin, hidden */
  }
  if (data.data && data.data.type === "joined") {
    pinCheckerFalsePositiveReset();
    window.pinCheckerNameList.push(data.data.name);
    setTimeout(() => {
      // remove after 20 seconds (for performance)
      window.pinCheckerNameList.splice(0, 1);
    }, 20e3);
  } else if (data.data && data.data.id === 45) {
    pinCheckerFalsePositiveReset();
  }
}

window.kantibotAddHook({
  prop: "onMessage",
  condition: (target, value) =>
    typeof value === "function" &&
    typeof target.reset === "function" &&
    typeof target.onOpen === "function",
  callback: (target, value) => {
    console.log(target, value);
    target.onMessage = new Proxy(target.onMessage, {
      apply: function (target, thisArg, argumentsList) {
        messageInjector(argumentsList[0], argumentsList[1]);
        return target.apply(thisArg, argumentsList);
      }
    });
    return true;
  }
});

main();
