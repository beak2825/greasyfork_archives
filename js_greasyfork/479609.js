// ==UserScript==
// @name         BAD MACRO v0.1
// @version      0.1
// @author       dahlia ingram
// @description  N for trap and mill M for auto heal
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @grant        none
// @icon         https://moomoo.io/img/favicon.png?v=1
// @namespace https://greasyfork.org/users/999612
// @downloadURL https://update.greasyfork.org/scripts/479609/BAD%20MACRO%20v01.user.js
// @updateURL https://update.greasyfork.org/scripts/479609/BAD%20MACRO%20v01.meta.js
// ==/UserScript==
(() => {
  // Constants and Variables
  let ws = null;
  let x = 0;
  let y = 0;
  let msgpack5 = window.msgpack;
  let scale = 45;
  let placeOffset = 5;
  let autoHeal = false;
  let autoMill = false;
  const inventory = {
    primary: null,
    secondary: null,
    food: null,
    wall: null,
    spike: null,
    mill: null,
    mine: null,
    boostPad: null,
    trap: null,
    turret: null,
    spawnpad: null
  };
  const vars = {
    camX: 0,
    camY: 0
  };
  const myPlayer = {
    sid: null,
    x: null,
    y: null,
    dir: null,
    buildIndex: null,
    weaponIndex: null,
    weaponVariant: null,
    team: null,
    isLeader: null,
    skinIndex: null,
    tailIndex: null,
    iconIndex: null
  };

  // Helper Functions

  /**
   * Utility function to join arrays
   * @param {Array} message - The array to join
   * @returns {Array} - Joined array
   */
  const join = message => Array.isArray(message) ? [...message] : [...message];

  /**
   * Hook function for WebSocket
   * @param {object} ms - WebSocket message
   */
  const hookWS = ms => {
    let tmpData = msgpack5.decode(new Uint8Array(ms.data));
    if ((ms = undefined) || (tmpData = (ms = tmpData.length > 1 ? [tmpData[0], ...join(tmpData[1])] : tmpData)[0]) || ms) {
      if ("C" == tmpData && null === myPlayer.sid && (myPlayer.sid = ms[1]) || "a" == tmpData) {
        for (tmpData = 0; tmpData < ms[1].length / 13; tmpData++) {
          let data = ms[1].slice(13 * tmpData, 13 * (tmpData + 1));
          if (data[0] == myPlayer.sid) {
            Object.assign(myPlayer, {
              x: data[1],
              y: data[2],
              dir: data[3],
              buildIndex: data[4],
              weaponIndex: data[5],
              weaponVariant: data[6],
              team: data[7],
              isLeader: data[8],
              skinIndex: data[9],
              tailIndex: data[10],
              iconIndex: data[11]
            });
          }
        }
      }
      vars.camX || (vars.camX = myPlayer.x);
      vars.camY || (vars.camY = myPlayer.y);
      if (y !== myPlayer.y || x !== myPlayer.x) {
        // AUTO HEAL CODE:
          if (autoHeal) {
            place(inventory.food);
          };
           if (autoMill) {
            let angle = Math.atan2(y - myPlayer.y, x - myPlayer.x);
            place(inventory.trap, angle + Math.PI / 2.5);
            place(inventory.mill, angle);
            place(inventory.mill, angle - Math.PI / 2.5);
          }
          x = myPlayer.x;
          y = myPlayer.y;
        }
      }
      cacheItems();
    }
  /**
   * Function to emit a packet
   * @param {string} event - Event type
   * @param {*} a - Parameter a
   * @param {*} b - Parameter b
   * @param {*} c - Parameter c
   * @param {*} m - Parameter m
   * @param {*} r - Parameter r
   */
  const emit = (event, a, b, c, m, r) => ws.send(Uint8Array.from([...msgpack5.encode([event, [a, b, c, m, r]])]));

  /**
   * Function to place an item
   * @param {number} event - Event type
   * @param {number} l - Angle
   */
  const place = (event, l) => {
    emit("G", event, false);
    emit("d", 1, l);
    emit("d", 0, l);
    emit("G", myPlayer.weaponIndex, true);
  };

  /**
   * Function to send a chat message
   * @param {string} event - The chat message
   */
  const chat = event => emit("6", event);

  /**
   * Cache the player's items
   */
  const cacheItems = () => {
    for (let c = 0; c < 9; c++) {
      var _document$getElementB;
      if (((_document$getElementB = document.getElementById(`actionBarItem${c}`)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.offsetParent) !== null) {
        inventory.primary = c;
      }
    }
    for (let s = 9; s < 16; s++) {
      var _document$getElementB2;
      if (((_document$getElementB2 = document.getElementById(`actionBarItem${s}`)) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.offsetParent) !== null) {
        inventory.secondary = s;
      }
    }
    for (let P = 16; P < 19; P++) {
      var _document$getElementB3;
      if (((_document$getElementB3 = document.getElementById(`actionBarItem${P}`)) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.offsetParent) !== null) {
        inventory.food = P - 16;
      }
    }
    for (let f = 19; f < 22; f++) {
      var _document$getElementB4;
      if (((_document$getElementB4 = document.getElementById(`actionBarItem${f}`)) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.offsetParent) !== null) {
        inventory.wall = f - 16;
      }
    }
    for (let _ = 22; _ < 26; _++) {
      var _document$getElementB5;
      if (((_document$getElementB5 = document.getElementById(`actionBarItem${_}`)) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.offsetParent) !== null) {
        inventory.spike = _ - 16;
      }
    }
    for (let u = 26; u < 29; u++) {
      var _document$getElementB6;
      if (((_document$getElementB6 = document.getElementById(`actionBarItem${u}`)) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.offsetParent) !== null) {
        inventory.mill = u - 16;
      }
    }
    for (let I = 29; I < 31; I++) {
      var _document$getElementB7;
      if (((_document$getElementB7 = document.getElementById(`actionBarItem${I}`)) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.offsetParent) !== null) {
        inventory.mine = I - 16;
      }
    }
    for (let p = 31; p < 33; p++) {
      var _document$getElementB8;
      if (((_document$getElementB8 = document.getElementById(`actionBarItem${p}`)) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.offsetParent) !== null) {
        inventory.boostPad = p - 16;
      }
    }
    for (let x = 31; x < 33; x++) {
      var _document$getElementB9;
      if (((_document$getElementB9 = document.getElementById(`actionBarItem${x}`)) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.offsetParent) !== null) {
        inventory.trap = x - 16;
      }
    }
    for (let g = 29; g < 31; g++) {
      var _document$getElementB10;
      if (((_document$getElementB10 = document.getElementById(`actionBarItem${g}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && g !== 36) {
        inventory.turret = g - 16;
      }
    }
    inventory.spawnpad = 36;
  };
     // Event listener for [n] key to toggle autoMill
  document.addEventListener("keydown", event => {
    if (event.keyCode === 78 && document.activeElement.id.toLowerCase() !== 'chatbox') {
      autoMill = !autoMill;
      chat(`Typhoon Mill ${autoMill ? 'on' : 'off'}`);
    }
  });


  // Override WebSocket's send method
  document.msgpack = window.msgpack;
  WebSocket.prototype.oldSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function (event) {
    ws || (document.ws = this, ws = this, document.ws.addEventListener("message", hookWS));
    this.oldSend(event);
  };

    // Event listener for [q] key to toggle autoHeal [changed to n key]
  document.addEventListener("keydown", event => {
    if (event.keyCode === 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {
      autoHeal = !autoHeal;
      chat(`Typhoon Heal ${autoHeal ? 'on' : 'off'}`);
    }
  });
})();
// @             Shortcuts:
// @             - No Hat: Shift
// @             - Bull Helmet: R
// @             - Tank Gear: Z
// @             - Soldier Helmet: G
// @             - Booster Hat: B
// @             - Flipper Hat: Y
// @             - Winter Cap: N
// @             - EMP Helmet: J
// @             - Fluff Head: I
// @             - Turret Gear: T
// @             - Spike Gear: H
// @             - Samurai Armor: U
// @             - Bearbarian Armor: M
// @             Feel free to mix and match.
// @match        *://*.moomoo.io/*
// @namespace    https://greasyfork.org/users/1190411
// @icon         https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
    var macrosToggle = 1;
    var macroEventListener = null;
    var menuVisible = false;
    var isDragging = false;
    var initialX;
    var initialY;

    function isChatOpen() {
        return document.activeElement.id.toLowerCase() === 'chatbox';
    }

    function isAllianceInputActive() {
        return document.activeElement.id.toLowerCase() === 'allianceinput';
    }

    function shouldHandleHotkeys() {
        return !isChatOpen() && !isAllianceInputActive();
    }

    function toggleMacros() {
        macrosToggle = (macrosToggle + 1) % 2;
        document.title = macrosToggle === 1 ? "нaтѕ-on" : "нaтѕ-oғғ";

        var macroStateElement = document.getElementById("macroState");
        macroStateElement.textContent = macrosToggle === 1 ? "On" : "Off";

        if (macrosToggle === 1) {
            macroEventListener = function (e) {
                if (shouldHandleHotkeys()) {
                    switch (e.keyCode) {
                        case 16:
                            storeEquip(0);
                            break;
                        case 82:
                            storeEquip(7);
                            break;
                        case 90:
                            storeEquip(40);
                            break;
                        case 71:
                            storeEquip(6);
                            break;
                        case 66:
                            storeEquip(12);
                            break;
                        case 89:
                            storeEquip(31);
                            break;
                        case 78:
                            storeEquip(15);
                            break;
                        case 74:
                            storeEquip(22);
                            break;
                        case 73:
                            storeEquip(30);
                            break;
                        case 84:
                            storeEquip(53);
                            break;
                        case 77:
                            storeEquip(26);
                            break;
                        case 85:
                            storeEquip(20);
                            break;
                        case 72:
                            storeEquip(11);
                            break;
                    }
                }
            };

            document.addEventListener('keydown', macroEventListener);
        } else {
            document.removeEventListener('keydown', macroEventListener);
            macroEventListener = null;
        }
    }

    function toggleMenu() {
        var menuElement = document.getElementById('hatMacroMenu');
        if (menuVisible) {
            menuElement.style.display = 'none';
            menuVisible = false;
        } else {
            menuElement.style.display = 'block';
            menuVisible = true;
        }
    }

    function dragStart(e) {
        isDragging = true;
        initialX = e.clientX - menuElement.getBoundingClientRect().left;
        initialY = e.clientY - menuElement.getBoundingClientRect().top;
    }

    function dragEnd() {
        isDragging = false;
    }

    function drag(e) {
        if (!isDragging) return;
        menuElement.style.left = (e.clientX - initialX) + 'px';
        menuElement.style.top = (e.clientY - initialY) + 'px';
    }

    var menuElement = null;

    function createMenu() {
        menuElement = document.createElement('div');
        menuElement.id = 'hatMacroMenu';
        menuElement.style.display = 'none';
        menuElement.style.background = 'rgba(0, 0, 0, 0.8)';
        menuElement.style.fontFamily = 'Hammersmith One, sans-serif';
        menuElement.style.position = 'absolute';
        menuElement.style.width = '200px';
        menuElement.style.height = '225px';
        menuElement.style.border = '1.5px solid #000';
        menuElement.style.borderRadius = '8px';
        menuElement.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.8)';
        menuElement.style.top = '20px';
        menuElement.style.right = '20px';
        menuElement.style.zIndex = '9999';
        menuElement.style.overflowY = 'auto';
        menuElement.style.color = '#fff';
        menuElement.style.fontSize = '17px !important';
        menuElement.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.4)';
        menuElement.style.padding = '18px';
        document.body.appendChild(menuElement);

        var tableHTML = `
    <h1 style="font-size: 28px;  margin-top: 15px; text-align: center;">Hat Shortcuts</h1>
<p style="text-align: center;"<span id="macroState">Off</span></p>
    <table style="margin: 0 auto; text-align: center;">
        <td>No Hat</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>Shift</td>
    </tr>
    <tr>
        <td>Bull Helmet</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>R</td>
    </tr>
    <tr>
        <td>Tank Gear</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>Z</td>
    </tr>
    <tr>
        <td>Soldier Helmet</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>G</td>
    </tr>
    <tr>
        <td>Booster Hat</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>B</td>
    </tr>
    <tr>
        <td>Flipper Hat</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>Y</td>
    </tr>
    <tr>
        <td>Winter Cap</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>N</td>
    </tr>
    <tr>
        <td>EMP Helmet</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>J</td>
    </tr>
    <tr>
        <td>Fluff Head</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>I</td>
    </tr>
    <tr>
        <td>Turret Gear</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>T</td>
    </tr>
    <tr>
        <td>Spike Gear</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>H</td>
    </tr>
    <tr>
        <td>Samurai Armor</td>
        <td>&nbsp;&nbsp;&nbsp;</td>
        <td>U</td>
    </tr>
    <tr>
        <td>Bearbarian Armor</td>
        <td>&nbsp;&nbsp;</td>
        <td>M</td>
    </tr>
</table>
        `;

        menuElement.innerHTML = tableHTML;

        menuElement.querySelectorAll('span, td, p').forEach(element => {
            element.style.fontSize = '17px';
            element.style.color = '#fff';
        });

        menuElement.addEventListener('mousedown', dragStart);
        menuElement.addEventListener('mouseup', dragEnd);
        menuElement.addEventListener('mousemove', drag);
    }

    createMenu();

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 80 && !isChatOpen() && !isAllianceInputActive()) {
            toggleMacros();
        } else if (e.keyCode === 27 &&
            document.activeElement.id.toLowerCase() !== 'chatbox' &&
            allianceMenu.style.display !== 'block' &&
            storeMenu.style.display !== 'block') {
            toggleMenu();
        }
    });

    var headerText = document.querySelector('h1').textContent;
    var macrosEnabled = headerText.includes('Macros On');

    if (macrosEnabled) {
        toggleMacros();
    }
})();
