// ==UserScript==
// @name        Color Tiles Plus
// @namespace   bees' scripts
// @version     1.0
// @match       https://*.gamesaien.com/game/color_tiles/
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js
// @author      beesnation
// @description An enhancement for color tiles. Configure color palette, board settings, time limit and random seed; and press R to instantly reset the board
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474400/Color%20Tiles%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/474400/Color%20Tiles%20Plus.meta.js
// ==/UserScript==

// Hook game init
unsafeWindow.orig_0x4117 = unsafeWindow._0x4117;
unsafeWindow._0x4117 = function(a, b) {
  if (a == "0xeb" && unsafeWindow.exportRoot.mm.modWasHere === undefined) onGameStarting();
  return orig_0x4117(a, b);
};

function onGameStarting() {
  unsafeWindow.exportRoot.mm.modWasHere = true;
  var seed = document.getElementById("seed").value;
  if (seed != "") {
    Math.seedrandom(seed);
  }
  else {
    Math.seedrandom();
  }
  unsafeWindow.timeAll = document.getElementById("timeLimit").valueAsNumber;
  unsafeWindow.nuPerColor = document.getElementById("tilesPerColor").valueAsNumber;
  unsafeWindow.nuMbX = document.getElementById("numColumns").valueAsNumber;
  unsafeWindow.nuMbY = document.getElementById("numRows").valueAsNumber;
  unsafeWindow.numColors = document.getElementById("numColors").valueAsNumber;
  unsafeWindow.arColor = [];

  for (var i=0;i<unsafeWindow.numColors;i++) {
    unsafeWindow.arColor.push(document.getElementById(`palette${i}`).value.slice(1));
  }
}

// Register instant reset button
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyR" && !e.target.matches("input")) {
    unsafeWindow.exportRoot.getChildByName("mzBtReset")._listeners.click[0]()
    unsafeWindow.exportRoot.getChildByName("mzBtPlay")._listeners.click[0]()
  }
})


// Create settings interface
var table = document.getElementById("ta1");
var row = table.insertRow(1);
row.insertCell(0);
var cell = row.insertCell(1);

cell.style["white-space"] = "pre";

let onSettingChanged = function(e) {
  GM_setValue(e.target.id, e.target.value);
}
cell.addEventListener("change", onSettingChanged)

cell.innerHTML = `
  <div style="white-space:nowrap">
    <div>Palette:</div>
    <input type="color" id="palette0" value="${GM_getValue("palette0", "#0066ff")}"/>
    <input type="color" id="palette1" value="${GM_getValue("palette1", "#ff9900")}"/>
    <input type="color" id="palette2" value="${GM_getValue("palette2", "#ff6666")}"/>
    <input type="color" id="palette3" value="${GM_getValue("palette3", "#00cc00")}"/>
    <input type="color" id="palette4" value="${GM_getValue("palette4", "#cc66cc")}"/>
  </div><div style="white-space:nowrap">
    <input type="color" id="palette5" value="${GM_getValue("palette5", "#cc6600")}"/>
    <input type="color" id="palette6" value="${GM_getValue("palette6", "#cccc66")}"/>
    <input type="color" id="palette7" value="${GM_getValue("palette7", "#66cccc")}"/>
    <input type="color" id="palette8" value="${GM_getValue("palette8", "#bbbbbb")}"/>
    <input type="color" id="palette9" value="${GM_getValue("palette9", "#ff88ff")}"/>
  </div>
  <label>Colors: <input type="number" id="numColors" min=1 max=10 value="${GM_getValue("numColors", 10)}" /></label>
  <label>Tiles Per Color: <input type="number" id="tilesPerColor"min=1 max=30 value="${GM_getValue("tilesPerColor", 20)}" /></label>
  <label>Columns: <input type="number" id="numColumns" min=2 max=23 value="${GM_getValue("numColumns", 23)}" /></label>
  <label>Rows: <input type="number" id="numRows" min=2 max=15 value="${GM_getValue("numRows", 15)}" /></label>
  <label>Time Limit: <input type="number" id="timeLimit" min=0 value="${GM_getValue("timeLimit", 120)}" /></label>
  <label>Seed (leave blank for random): <input type="text" id="seed" value="${GM_getValue("seed", "")}" /></label>
  <button onclick="timeAll=0">Give Up</button>
`;
