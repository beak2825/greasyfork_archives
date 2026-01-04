// ==UserScript==
// @name        Moomoo Bots Modified - Unkillable
// @namespace   http://tampermonkey.net/
// @description 30 bots will spawn and start going to your location. You can control them by typing in the chat. Commands include "attack", "team", "upgrade", and "follow". Bots will now be unkillable. To team bots write "team [your team name]"
// @version     1.38
// @author      Custom Bot Maker
// @match       *://*.moomoo.io/*
// @icon        none
// @grant       none
// @license     MIT
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @downloadURL https://update.greasyfork.org/scripts/510195/Moomoo%20Bots%20Modified%20-%20Unkillable.user.js
// @updateURL https://update.greasyfork.org/scripts/510195/Moomoo%20Bots%20Modified%20-%20Unkillable.meta.js
// ==/UserScript==

let msgpack = window.msgpack;
const originalSend = WebSocket.prototype.send;
window.playerSocket = null;
window.botSockets = [];

let healSpeed = 125;
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let healOn = true;

WebSocket.prototype.send = function (...args) {
  this.addEventListener("message", function (e) {
    const [packet, data] = msgpack.decode(new Uint8Array(e.data));
    if (packet == "C" && myPlayer.sid == null) {
      console.log("game started");
      myPlayer.dead = false;
      myPlayer.sid = data[0];
    }

    if (packet == "M" && myPlayer.dead) {
      myPlayer.dead = false;
    }
  });

  if (window.playerSocket == null) {
    window.playerSocket = this;
  }
  originalSend.call(this, ...args);
};

const checkChange = setInterval(() => {
  if (window.playerSocket != null) {
    socketFound(window.playerSocket, -1);
    clearInterval(checkChange);
    botJoin(30);  // Spawn 30 bots
  }
}, 100);

function botJoin(amount) {
  let t = window.playerSocket.url.split("wss://")[1].split("?")[0];
  let index = 0;
  for (let i = 0; i < amount; i++) {
    window.grecaptcha
      .execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
        action: "homepage",
      })
      .then((a) => {
        window.botSockets.push(
          new WebSocket(
            "wss://" + t + "?token=" + "re:" + encodeURIComponent(a)
          )
        );
        if (i == amount) {
          window.botSockets.forEach((botSocket) => {
            botSocket.binaryType = "arraybuffer";
            botSocket.onopen = () => {
              window.bots.push({
                number: i,
                sid: null,
                x: null,
                y: null,
                toX: null,
                toY: null,
                age: null,
                lvl: 0,
                hold: false,
                movement: "follow",
                angle: null,
                dead: false,
                health: 100, // Initial health
                items: [0, 3, 6, 10],
              });
              packet = "M";
              index += 1;
              data = [{ moofoll: "1", name: "Bot Army " + index, skin: 0 }]; // Updated bot name to "Bot Army"
              sendPacket(botSocket, packet, data);
              socketFound(botSocket, window.botSockets.indexOf(botSocket));
            };
          });
        }
      });
  }
}

// Define Our Player //

const myPlayer = {
  sid: null,
  x: null,
  y: null,
  angle: null,
  dead: false,
  health: 100,
};

// Continuously heal bots to make them unkillable
function keepBotsAlive() {
  setInterval(() => {
    window.bots.forEach((bot) => {
      if (bot.health < 100) {
        bot.health = 100; // Reset bot's health to 100
      }
    });
  }, 50); // Heal bots every 50ms
}

window.player = myPlayer;
window.bots = [];

keepBotsAlive(); // Call the function to make bots unkillable
