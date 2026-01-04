// ==UserScript==
// @name        Moomoo Bots
// @namespace   http://tampermonkey.net/
// @description 3 bots will spawn and start going to your location. You can control them by typing in the chat. Commands include "attack", "team", "upgrade", and "follow". To team bots write "team [your team name]"
// @version     1.36
// @author      Thomas De Bot Maker
// @match       *://*.moomoo.io/*
// @icon        none
// @grant       none
// @license     MIT
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @downloadURL https://update.greasyfork.org/scripts/482965/Moomoo%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/482965/Moomoo%20Bots.meta.js
// ==/UserScript==


let msgpack = window.msgpack;
const originalSend = WebSocket.prototype.send;
window.playerSocket = null;
window.botSockets = [];

let healSpeed = 125;
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let ahth = 86;
let ahrp = 2;
let ahtky = 80;
let healOn = true;
let bots = 3;

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
  let index = 0;
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
                toX: null,
                toY: null,
                age: null,
                lvl: 0,
                hold: false,
                movement: "follow",
                toX: null,
                toY: null,
                angle: null,
                dead: true,
                health: 100,
                items: [0, 3, 6, 10],
              });
              packet = "M";
              index+=1;
              data = [{ moofoll: "1", name: "MooMoo Bot " + index, skin: 0 }]; // this is the join packet
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
      window.bots[indexOfSocket].angle = parseFloat(
          Math.atan2(
              myPlayer.y - window.bots[indexOfSocket].y,
              myPlayer.x - window.bots[indexOfSocket].x
          ).toFixed(2)
      );
      sendPacket(window.botSockets[indexOfSocket], "D", [
        window.bots[indexOfSocket].angle,
      ]);
      dist = Math.sqrt(
          Math.pow(myPlayer.x - window.bots[indexOfSocket].x, 2) +
          Math.pow(myPlayer.y - window.bots[indexOfSocket].y, 2)
      );
        if(window.bots[indexOfSocket].movement == "follow") {
            sendPacket(window.botSockets[indexOfSocket], "a", [
                window.bots[indexOfSocket].angle,
            ]);
        } else if(window.bots[indexOfSocket].movement == "harvest") {
            sendPacket(window.botSockets[indexOfSocket], "a", [
                window.bots[indexOfSocket].angle,
            ]);
            allBotClick();
        }
      if (window.bots[indexOfSocket].dead) {
        pack = "M";
        dat = [{ moofoll: "1", name: "MooMoo Bot " + (indexOfSocket + 1), skin: 0 }]; // this is the join packet
        sendPacket(window.botSockets[indexOfSocket], pack, dat);
      }
    }, 100);
  }

  socket.send = function (...args) {
    const [packet, data] = msgpack.decode(new Uint8Array(args[0]));

    // D is for rotation
    // G switches your item
    // d places your item
    // N is for points
    // a is for movement
    // H is upgrade
    // b is join clan

    if (!["G", "N", "O", "D"].includes(packet)) {
    }

    if (packet === "a" && data[0] != null) {
    }

    if(packet == 6 && data[0] != null) {
        let message = data[0];
        if(message == "attack") {
            allBotClick();
        } else if(message == "hold") {
            allBotStop();
        } else if(message == "follow") {
            allBotFollow();
        } else if(message == "heal") {
            allBotHeal();
        } else if(message == "upgrade") {
            allBotUpgrade();
        } else if(message == "harvest") {
            allBotHarvest();
        } else if(message == "switch") {
            allBotSwitch();
        } else if(message.substring(0, 4) == "team") {
            allBotTeam(message.substring(5));
        } else if(message.substring(0, 5) == "heal ") {
            heal(+message.substring(5));
        } else if(message.substring(0, 7) == "attack ") {
            botClick(+message.substring(7));
        } else if(message.substring(0, 8) == "upgrade ") {
            upgrade(+message.substring(8));
        } else if(message.substring(0, 7) == "follow ") {
            follow(+message.substring(7));
        } else if(message.substring(0, 5) == "hold ") {
            stop(+message.substring(5));
        } else if(message.substring(0, 7) == "switch ") {
            switchWepon(+message.substring(7));
        }
    }
      if(packet === "H") {
          console.log(packet);
          console.log(data);
      }
    const arr = new Uint8Array(Array.from(msgpack.encode([packet, data])));
    originalSend.call(this, arr);
  };
}

function click() {
    sendPacket(window.playerSocket, "d", [1]);
    sendPacket(window.playerSocket, "d", [0]);
}
function botClick(bot) {
    sendPacket(window.botSockets[bot], "d", [1]);
    sendPacket(window.botSockets[bot], "d", [0]);
}
function upgrade(bot) {
    switch(window.bots[bot].lvl) {
        case 0:
            sendPacket(window.botSockets[bot], "H", [3]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Sword"]);
        break;
        case 1:
            sendPacket(window.botSockets[bot], "H", [17]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Cookie"]);
        break;
        case 2:
            sendPacket(window.botSockets[bot], "H", [31]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Pit-Trap"]);
        break;
        case 3:
            sendPacket(window.botSockets[bot], "H", [23]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Greater Spikes"]);
        break;
        case 4:
            sendPacket(window.botSockets[bot], "H", [9]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Hunting Bow"]);
        break;
        case 5:
            sendPacket(window.botSockets[bot], "H", [33]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Turret"]);
        break;
        case 6:
            sendPacket(window.botSockets[bot], "H", [12]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Crossbow"]);
        break;
        case 7:
            sendPacket(window.botSockets[bot], "H", [15]);
            sendPacket(window.botSockets[bot], "6", ["Unlocked Musket"]);
        break;
    }
    window.bots[bot].lvl+=1;
}
function allBotClick() {
    for(let i = 0; i < window.botSockets.length; i++) {
        botClick(i);
    }
}
function switchWepon(bot) {
    sendPacket(window.botSockets[bot], "G", [
        window.bots[bot].items[0],
    ])
}
function allBotSwitch() {
    for(let i = 0; i < window.botSockets.length; i++) {
        switchWepon(i);
    }
}
function heal(bot) {
    sendPacket(window.botSockets[bot], "G", [
        window.bots[bot].items[0],
    ]);
    sendPacket(window.botSockets[bot], "d", [1]);
    sendPacket(window.botSockets[bot], "d", [0]);
}
function allBotHeal() {
    for(let i = 0; i < window.botSockets.length; i++) {
        heal(i);
    }
}
function allBotUpgrade() {
    for(let i = 0; i < window.botSockets.length; i++) {
        upgrade(i);
    }
}
function allBotHarvest() {
    for(let i = 0; i < window.bots.length; i++) {
        sendPacket(window.botSockets[i], "6", ["Movement Mode: Harvesting"]);
        window.bots[i].movement = "harvest";
        window.bots[i].hold = false;
    }
}
function team(bot, team) {
    sendPacket(window.botSockets[bot], "6", ["Trying to join " + team]);
    sendPacket(window.botSockets[bot], "b", [team]);
}
function allBotTeam(teamToJoin) {
    for(let i = 0; i < window.botSockets.length; i++) {
        team(i, teamToJoin);
    }
}
function stop(bot) {
    window.bots[bot].hold = true;
}
function allBotStop() {
    for(let i = 0; i < window.bots.length; i++) {
        stop(i);
    }
}
function follow(bot) {
    sendPacket(window.botSockets[bot], "6", ["Movement Mode: Following"]);
    window.bots[bot].hold = false;
    window.bots[bot].movement = "follow";
}
function allBotFollow() {
    for(let i = 0; i< window.bots.length; i++) {
        follow(i);
    }
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
      if(!window.bots[indexOfSocket].hold) {
          window.bots[indexOfSocket].x = myData[1] - Math.cos(myPlayer.angle) * 150;
          window.bots[indexOfSocket].y = myData[2] - Math.sin(myPlayer.angle) * 150;
          window.bots[indexOfSocket].toX = myData[1] - Math.cos(myPlayer.angle) * 150;
          window.bots[indexOfSocket].toY = myData[2] - Math.sin(myPlayer.angle) * 150;
      } else {
          window.bots[indexOfSocket].x = window.bots[indexOfSocket].toX;
          window.bots[indexOfSocket].y = window.bots[indexOfSocket].toY;
      }
    } else {
      myData = data[0].slice(
        data[0].indexOf(myPlayer.sid),
        data[0].indexOf(myPlayer.sid) + 13
      );
      myPlayer.x = myData[1];
      myPlayer.y = myData[2];
      myPlayer.angle = myData[3];
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