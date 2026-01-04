// ==UserScript==
// @name        MOOMOO BOT SCRIPT - WORKING 2023
// @namespace   http://tampermonkey.net/
// @description 3 bots will spawn and start going to your location.
// @version     1.2
// @author      Blue Cyclone
// @match       *://*.moomoo.io/*
// @icon        none
// @grant       none
// @license     MIT
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @downloadURL https://update.greasyfork.org/scripts/481368/MOOMOO%20BOT%20SCRIPT%20-%20WORKING%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/481368/MOOMOO%20BOT%20SCRIPT%20-%20WORKING%202023.meta.js
// ==/UserScript==

let msgpack = window.msgpack;
const originalSend = WebSocket.prototype.send;
window.playerSocket = null;
window.botSockets = [];

let healSpeed = 125;
let ahth = 86;
let ahrp = 2;
let ahtky = 80;
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
    botJoin(3);
  }
}, 100);

function botJoin(amount) {
  let t = window.playerSocket.url.split("wss://")[1].split("?")[0];
  for (i = 0; i < amount; i++) {
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
                angle: null,
                dead: true,
                health: 100,
                items: [0, 3, 6, 10],
              });
              packet = "M";
              data = [{ moofoll: "1", name: atob("Qm90IDop"), skin: 0 }]; // this is the join packet
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
  dead: true,
  health: 100,
};

window.player = myPlayer;

window.bots = [];

function socketFound(socket, indexOfSocket) {
  socket.addEventListener("message", function (message) {
    viewMessage(message, indexOfSocket);
  });

  // DEFINE OUR MIDDLEWARE //

  if (indexOfSocket != -1 && window.bots[indexOfSocket] && !myPlayer.dead) {
    setInterval(() => {
      sendPacket(window.botSockets[indexOfSocket], "6", [
        atob("Qmx1ZSBDeWNsb25lJ3MgQm90cy4="),
      ]);
      window.bots[indexOfSocket].angle = parseFloat(
        Math.atan2(
          myPlayer.y - window.bots[indexOfSocket].y,
          myPlayer.x - window.bots[indexOfSocket].x
        ).toFixed(2)
      );
      sendPacket(window.botSockets[indexOfSocket], "D", [
        window.bots[indexOfSocket].angle,
      ]);
      sendPacket(window.botSockets[indexOfSocket], "a", [
        window.bots[indexOfSocket].angle,
      ]);
      if (window.bots[indexOfSocket].dead) {
        pack = "M";
        dat = [{ moofoll: "1", name: atob("Qm90IDop"), skin: 0 }]; // this is the join packet
        sendPacket(window.botSockets[indexOfSocket], pack, dat);
      }
    }, 1000);
  }

  socket.send = function (...args) {
    const [packet, data] = msgpack.decode(new Uint8Array(args[0]));

    // D is for rotation
    // G switches your item
    // d places your item
    // N is for points
    // a is for movement

    if (!["G", "N", "O", "D"].includes(packet)) {
    }

    if (packet === "a" && data[0] != null) {
    }
    const arr = new Uint8Array(Array.from(msgpack.encode([packet, data])));
    originalSend.call(this, arr);
  };
}

function viewMessage(m, indexOfSocket) {
  const [packet, data] = msgpack.decode(new Uint8Array(m.data));
  // should always work because interceptor is mounted already
  // this sets the bot sid when the game starts
  if (["C"].includes(packet) && indexOfSocket != -1) {
    console.log("SETTING SID", indexOfSocket);
    window.bots[indexOfSocket].sid = data[0];
    window.bots[indexOfSocket].dead = false;
    window.bots[indexOfSocket].health = 100;
  }

  if (packet == "P") {
    indexOfSocket == -1
      ? ((myPlayer.dead = true), (myPlayer.health = 100))
      : (window.bots[indexOfSocket].dead = true);
  }

  if (["a"].includes(packet) && data[0].length > 0) {
    if (indexOfSocket != -1) {
      myData = data[0].slice(
        data[0].indexOf(window.bots[indexOfSocket].sid),
        data[0].indexOf(window.bots[indexOfSocket].sid) + 13
      );
      window.bots[indexOfSocket].x = myData[1];
      window.bots[indexOfSocket].y = myData[2];
    } else {
      myData = data[0].slice(
        data[0].indexOf(myPlayer.sid),
        data[0].indexOf(myPlayer.sid) + 13
      );
      myPlayer.x = myData[1];
      myPlayer.y = myData[2];
    }
    if (indexOfSocket != -1) {
    }
  }
  items = [0, 3, 6, 10];
  if (packet == "V" && !data[1]) {
    window.bots[indexOfSocket].items = data[0];
  }

  if (packet == "O" && indexOfSocket != -1) {
    window.bots[indexOfSocket].health = data[1];
    dist = Math.sqrt(
      Math.pow(myPlayer.x - window.bots[indexOfSocket].x, 2) +
        Math.pow(myPlayer.y - window.bots[indexOfSocket].y, 2)
    );
    if (
      !window.botSockets[indexOfSocket].dead &&
      healOn &&
      window.bots[indexOfSocket].health < ahth &&
      window.bots[indexOfSocket].health > 0 &&
      dist > 200
    ) {
      setTimeout(function () {
        for (let i = 0; i < ahrp; i++) {
          sendPacket(window.botSockets[indexOfSocket], "G", [
            window.bots[indexOfSocket].items[0],
          ]);
          sendPacket(window.botSockets[indexOfSocket], "d", [1]);
          sendPacket(window.botSockets[indexOfSocket], "d", [0]);
        }
      }, healSpeed);
    }
  }

  if (packet == "O" && indexOfSocket == -1) {
    myPlayer.health = data[1];
    if (
      !myPlayer.dead &&
      healOn &&
      myPlayer.health < ahth &&
      myPlayer.health > 0
    ) {
      setTimeout(function () {
        for (let i = 0; i < ahrp; i++) {
          sendPacket(window.playerSocket, "G", [0]);
          sendPacket(window.playerSocket, "d", [1]);
          sendPacket(window.playerSocket, "d", [0]);
        }
      }, healSpeed);
    }
  }
}

function sendPacket(socket, packet, data) {
  const arr = new Uint8Array(Array.from(msgpack.encode([packet, data])));
  socket.send(arr);
}
