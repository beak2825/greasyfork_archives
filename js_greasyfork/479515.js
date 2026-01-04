// ==UserScript==
// @name         MooMoo.io Auto Heal
// @namespace    https://greasyfork.org/users/1064285-vcrazy-gaming
// @version      0.4
// @description  Simple auto-healing script for MooMoo.io.
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @author       _VcrazY_
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @icon         https://moomoo.io/img/favicon.png?v=1
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479515/MooMooio%20Auto%20Heal.user.js
// @updateURL https://update.greasyfork.org/scripts/479515/MooMooio%20Auto%20Heal.meta.js
// ==/UserScript==
(function () {
  // Variables
  let AUTO_HEAL_SPEED = 120;
  let AUTO_HEAL_ENABLED = true;
  let items = [];
  let weapons = [];
  let inGame = false;
  let tmpHealth = 100;
  let sTime = 0;
  let sCount = 0;
  let msgpack = window.msgpack;
  let ws;
  // WebSocket setup
  ws = new Promise(function (resolve) {
    let {
      send
    } = WebSocket.prototype;
    WebSocket.prototype.send = function (...x) {
      send.apply(this, x);
      this.send = send;
      this.io = function (...datas) {
        const [packet, ...data] = datas;
        this.send(new Uint8Array(Array.from(msgpack.encode([packet, data]))));
      };
      this.addEventListener("message", function (e) {
        const [packet, data] = msgpack.decode(new Uint8Array(e.data));
        let sid = data[0];
        let health = data[1];
        let inventory = {
          food: items[0],
          walls: items[1],
          spikes: items[2],
          mill: items[3],
          mine: items[4],
          trap: items[5],
          booster: items[6],
          turret: items[7],
          watchtower: items[8],
          buff: items[9],
          spawn: items[10],
          sapling: items[11],
          blocker: items[12],
          teleporter: items[13]
        };
        let addEventListener = {
          setupGame: "C",
          updateHealth: "O",
          killPlayer: "P",
          updateItems: "V"
        };
        switch (packet) {
          case addEventListener.setupGame:
            inGame = true;
            items = [0, 3, 6, 10];
            weapons = [0];
            break;
          case addEventListener.updateHealth:
            if (sid) {
              const AUTOHEAL_SPEED = parseInt(document.getElementById('speedInput').value);
              if (inGame && AUTO_HEAL_ENABLED) {
                if (health < 100 && health > 0) {
                  setTimeout(function () {
                    place(inventory.food);
                    place(inventory.food);
                    place(inventory.food);
                    place(inventory.food);
                  }, AUTOHEAL_SPEED);
                }
              }
              if (tmpHealth - health < 0) {
                if (sTime) {
                  let timeHit = Date.now() - sTime;
                  sTime = 0;
                  sCount = timeHit <= 120 ? sCount + 1 : Math.max(0, sCount - 2);
                }
              } else {
                sTime = Date.now();
              }
              tmpHealth = health;
            }
            break;
          case addEventListener.killPlayer:
            inGame = false;
            break;
          case addEventListener.updateItems:
            if (sid) {
              if (health) {
                weapons = sid;
              } else {
                items = sid;
              }
            }
            break;
        }
      });
      resolve(this);
    };
  });

  // Functions
  const sendPacket = function (...datas) {
    const [type, ...data] = datas;
    var binary = msgpack.encode([type, data]);
    ws.then(function (wsInstance) {
      wsInstance.send(new Uint8Array(Array.from(binary)));
    });
  };

  // PLACE
  const place = function (id, ang) {
    if (inGame) {
      sendPacket("z", id, false);
      hit(ang);
      selectWeapon();
    }
  };

  // SELECT WEAPON
  const selectWeapon = function () {
    if (inGame) {
      sendPacket("z", weapons[0], true);
    }
  };

  // HIT
  const hit = function (id, ang) {
    if (inGame) {
      sendPacket("F", 1, ang);
      sendPacket("F", 0, ang);
    }
  };
  // CHAT
  const chat = function (e) {
    if (inGame) {
      sendPacket("6", e);
    }
  };

  // SCRIPT MENU:
  let modMenus = document.createElement("div");
  modMenus.id = "modMenus";
  document.body.append(modMenus);
  modMenus.style.display = "block";
  modMenus.style.padding = "10px";
  modMenus.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
  modMenus.style.borderRadius = "4px";
  modMenus.style.position = "absolute";
  modMenus.style.left = "20px";
  modMenus.style.top = "20px";
  modMenus.style.minWidth = "300px";
  modMenus.style.maxWidth = "290px";
  modMenus.style.minHeight = "400";
  modMenus.style.maxHeight = "700";
  function updateInnerHTML() {
    modMenus.innerHTML = `<h2 style="text-align: center; font-size: 28px;">Auto Heal <span ></span></h2>
    <hr>
    <label for="speedInput">Speed</label>
    <input type="number" id="speedInput" oninput="this.value = this.value.slice(0, 4)" value=${AUTO_HEAL_SPEED}>
    <span id="speedValue"></span>
    <hr>
    <input type="checkbox" checked id="AUTO_HEAL">
    Auto Heal
    <br>`;
  }
  updateInnerHTML();
  // THIS IS HOW SCRIPT MENU IS ON/OFF:
  function getEl(id) {
    return document.getElementById(id);
  }

  // PART OF SCRIPT MENU:
  getEl("AUTO_HEAL").onclick = function () {
    AUTO_HEAL_ENABLED = !AUTO_HEAL_ENABLED;
    chat(`Auto Heal : ${AUTO_HEAL_ENABLED ? 'enabled' : 'disabled'}`);
  };
  getEl("speedInput").oninput = function () {
    chat(`Auto Heal Speed : ${getEl("speedInput").value}`);
  };
})();