// ==UserScript==
// @name        ! 1 unknown client UNPACTHED AGAIN !!!!! OBFUSCATED
// @version      v3.15
// @description  HACK MOD SEND HACK PLES SEND HACK MOD OP HACK
// @match        *://*.moomoo.io/*
// @author       zen, .za
// @run-at       document_idle
// @grant        none
// @icon         https://moomoo.io/img/favicon.png?v=1
// @namespace https://greasyfork.org/users/1417640
// @downloadURL https://update.greasyfork.org/scripts/522535/%21%201%20unknown%20client%20UNPACTHED%20AGAIN%20%21%21%21%21%21%20OBFUSCATED.user.js
// @updateURL https://update.greasyfork.org/scripts/522535/%21%201%20unknown%20client%20UNPACTHED%20AGAIN%20%21%21%21%21%21%20OBFUSCATED.meta.js
// ==/UserScript==
// preplacer causes fps drops , autobull,
// sometimes our anti spike tick wont let u survive from diamond spike ticker
// BTW IF YOU ARE GETTING INVALID CONNECTION ERROR YOU ARE TRYING TO JOIN THE GAME TOO FAST, WAIT A LITTLE BEFORE PRESSING ENTER GAME
// This mod is NOT for Low end pc
let backgroundDiv = document.createElement("div");
backgroundDiv.style.position = "fixed";
backgroundDiv.style.top = "0";
backgroundDiv.style.left = "0";
backgroundDiv.style.width = "100%";
backgroundDiv.style.height = "100%";
backgroundDiv.style.background = "#212121";
backgroundDiv.style.backgroundSize = "cover";
backgroundDiv.style.backgroundRepeat = "no-repeat";
backgroundDiv.style.backgroundPosition = "center";
backgroundDiv.style.display = "flex";
backgroundDiv.style.justifyContent = "center";
backgroundDiv.style.alignItems = "center";
backgroundDiv.style.color = "white";
backgroundDiv.style.fontSize = "35px";
backgroundDiv.style.zIndex = "99999999";
backgroundDiv.style.transition = "0.5s";
backgroundDiv.innerHTML = "\n<style>\nh1 {\nfont-size: 50px;\n}\n</style>\n\n<h1 id=\"loading\">Loading...</h1>\n";
document.body.appendChild(backgroundDiv);
setTimeout(() => {
  backgroundDiv.innerHTML = "\n    <style>\n    h1 {\n        font-size: 50px;\n    }\n    </style>\n    <h1 id=\"loaded\">Game Loaded!</h1>\n    ";
  setTimeout(() => {
    backgroundDiv.style.opacity = "0";
    setTimeout(() => {
      backgroundDiv.style.display = "none";
    }, 500);
  }, 2000);
}, 2500);
const removeSnowflakes = () => {
  const v = document.querySelectorAll(".snowflake");
  v.forEach(p => {
    p.parentNode.removeChild(p);
  });
};
const createSnowflake = function () {
  const v2 = document.createElement("div");
  v2.className = "snowflake";
  v2.style.position = "absolute";
  v2.style.width = "10px";
  v2.style.height = "10px";
  v2.style.background = "#fff";
  v2.style.borderRadius = "50%";
  v2.style.zIndex = "9998";
  v2.style.opacity = Math.random();
  v2.style.left = Math.random() * 100 + "vw";
  v2.style.animation = "fall " + (Math.random() * 2 + 1) + "s linear infinite";
  v2.addEventListener("animationiteration", function () {
    v2.style.left = Math.random() * 100 + "vw";
    v2.style.opacity = Math.random();
  });
  return v2;
};
const styleSnowflakes = document.createElement("style");
styleSnowflakes.textContent = " @keyframes fall { 0% { transform: translateY(-10vh); opacity: 1; } 100% { transform: translateY(110vh); opacity: 0; } } .fast-fall { animation-duration: " + (Math.random() * 1 + 1) + "s; } ";
document.head.appendChild(styleSnowflakes);
const snowflakeContainer = document.createElement("div");
snowflakeContainer.style.position = "absolute";
snowflakeContainer.style.top = "0";
snowflakeContainer.style.left = "0";
snowflakeContainer.style.width = "100%";
snowflakeContainer.style.height = "100%";
snowflakeContainer.style.pointerEvents = "none";
snowflakeContainer.style.zIndex = "9998";
snowflakeContainer.style.display = "none";
document.body.appendChild(snowflakeContainer);
const maxSnowflakes = 40;
for (let i = 0; i < maxSnowflakes; i++) {
  const snowflake = createSnowflake();
  if (Math.random() > 0.7) {
    snowflake.classList.add("fast-fall");
  }
  snowflakeContainer.appendChild(snowflake);
}
(function () {
  'use strict';

  let v3 = document.createElement("script");
  v3.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(v3);
  let v4 = document.createElement("div");
  v4.id = "modSidebar";
  v4.style = "\n        position: fixed; top: 10px; left: 10px; width: 200px;\n        background-color: #2c2f33; color: #fff; padding: 10px;\n        border-radius: 10px; z-index: 1000; font-family: Arial, sans-serif;\n        box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); transition: opacity 0.5s ease,\n        visibility 0.5s ease, transform 0.5s ease; opacity: 0; visibility: hidden;\n        transform: translateX(-220px);\n    ";
  let v5 = document.createElement("div");
  v5.id = "modRightPanel";
  v5.style = "\n        position: fixed; top: 10px; left: 220px; width: 350px;\n        background-color: #2c2f33; color: #fff; padding: 10px;\n        border-radius: 10px; z-index: 1000; font-family: Arial, sans-serif;\n        box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); transition: opacity 0.5s ease,\n        visibility 0.5s ease, transform 0.5s ease; opacity: 0; visibility: hidden;\n        transform: translateX(0);\n    ";
  v4.innerHTML = "\n    <h3 style=\"\n        margin-top: 0;\n        text-align: center;\n        text-shadow: 0 0 5px rgba(255, 192, 203, 0.8),\n                     0 0 10px rgba(255, 192, 203, 0.6),\n                     0 0 15px rgba(255, 192, 203, 0.4);\n        color: #fff;\n    \">\n                 Unknown Client\n    <br>\n    <span class=\"subText\">  Menu By CX  </span>\n    </h3>\n   <div id=\"tabs\">\n    <button id=\"visualTab\" class=\"tab active\">\n        <img src=\"https://i.ibb.co/z5v8XYc/eyebrow-removebg-preview.png\" class=\"tabIcon\"> Visuals\n    </button>\n    <button id=\"combatTab\" class=\"tab\">\n        <img src=\"https://i.ibb.co/85pZqGk/sword-removebg-preview.png\" class=\"tabIcon\"> Combat\n    </button>\n    <button id=\"miscTab\" class=\"tab\">\n        <img src=\"https://i.ibb.co/gytFzqL/more-1-removebg-preview.png\" class=\"tabIcon\"> Misc\n    </button>\n    <button id=\"devTab\" class=\"tab\">\n        <img src=\"https://i.ibb.co/s6nGQS7/web-development-removebg-preview.png\" class=\"tabIcon\"> Developing\n    </button>\n</div>\n\n";
  v5.innerHTML = "\n    <div class=\"right-panel\" onmousedown=\"startDrag(event)\">\n        <div id=\"visualContent\" class=\"content active\">\n            <h4>Visual</h4>\n            <label><input type=\"checkbox\" id=\"healAnim\" checked> Heal/Damage Animations</label><br>\n            <label><input type=\"checkbox\" id=\"notifs\" checked> Notifications</label><br>\n            <label><input type=\"checkbox\" id=\"dmgtext\" checked> Damage Text</label><br>\n            <label><input type=\"checkbox\" id=\"snow\"> Snow</label><br>\n            <label><input type=\"checkbox\" id=\"fakePing\" checked> FakePing</label><br>\n            <label><input type=\"checkbox\" id=\"font\" checked> Font</label><br>\n            <label><input type=\"checkbox\" id=\"placeVis\"> Render Placers</label><br>\n            <label><input type=\"checkbox\" id=\"daytime\"> daytime?</label><br>\n            <label><input type=\"checkbox\" id=\"spinner\"> Spin</label><br>\n            <label><input type=\"checkbox\" id=\"cleanmode\" checked> Cleanmode</label><br>\n            <label><input type=\"checkbox\" id=\"showgrid\"> showGrid?</label><br>\n            <label for=\"playerShadowIntensity\"> Shadow Intensity:</label>\n            <input type=\"range\" id=\"playerShadowIntensity\" class=\"slider\" value=\"10\" min=\"1\" max=\"20\" oninput=\"document.getElementById('shadowIntensityValue').textContent = this.value\">\n            <span id=\"shadowIntensityValue\">10</span>\n            <br>\n            <label for=\"BuildHealth\">BuildHealth Style:</label>\n            <select id=\"BuildHealth\" class=\"styledSelect\">\n                <option value=\"bh1\">Rectangle</option>\n                <option value=\"bh2\">Filled Circle</option>\n                <option value=\"bh3\" selected>Outlined Circle</option>\n            </select><br>\n            <label for=\"Camera\">CameraType:</label>\n            <select id=\"cameramodes\" class=\"styledSelect\">\n                <option value=\"camera1\">still</option>\n                <option value=\"camera2\">smooth</option>\n                <option value=\"camera3\" selected>Smooth + mouse</option>\n            </select><br>\n            <label><input type=\"checkbox\" id=\"combatZoom\" checked> Combat Zoom</label><br>\n            <br>\n        </div>\n    </div>\n        <div id=\"combatContent\" class=\"content\">\n            <h4>Combat</h4>\n            <label><input type=\"checkbox\" id=\"healingBeta\" checked> Heal </label><br>\n            <label><input type=\"checkbox\" id=\"autoPush\" checked> Auto Push</label><br>\n            <label><input type=\"checkbox\" id=\"smartInsta\" checked> AutoInsta</label><br>\n            <label><input type=\"checkbox\" id=\"antispike\" checked> Anti Spike</label><br>\n            <label><input type=\"checkbox\" id=\"slowOT\"> SlowOneTick</label><br>\n            <label><input type=\"checkbox\" id=\"safeWalk\" checked> safewalk</label><br>\n            <label><input type=\"checkbox\" id=\"killChat\" checked> Kill Chat</label><br>\n            <input type=\"text\" id=\"killChatInput\" value=\"Auto-GG_Magma_Mod\" placeholder=\"custom killchat\" oninput=\"document.getElementById('killChat').textContent = this.value\"> <br>\n            <label><input type=\"checkbox\" id=\"autoBuy\" checked> Auto Buy</label><br>\n            <label><input type=\"checkbox\" id=\"autoBuyEquip\" chcked> Auto Buy Equip</label><br>\n            <label><input type=\"checkbox\" id=\"preTick\" checked> PreTick</label><br>\n            <label><input type=\"checkbox\" id=\"revTick\" checked> RevTick</label><br>\n            <label><input type=\"checkbox\" id=\"autoPlace\" checked> Auto Place</label><br>\n            <label><input type=\"checkbox\" id=\"autoReplace\" checked> Auto Replace</label><br>\n            <label><input type=\"checkbox\" id=\"spikeTick\" checked> Spike Tick</label><br>\n            <label><input type=\"checkbox\" id=\"antiTrap\" checked> AntiTrap</label><br>\n            <label><input type=\"checkbox\" id=\"attackDir\" > attackDir</label><br>\n            <label><input type=\"checkbox\" id=\"noDir\" checked> noDir</label><br>\n            <label><input type=\"checkbox\" id=\"showDir\" checked> ShowDir</label><br>\n            <label><input type=\"checkbox\" id=\"autoRespawn\"> AutoRespawn</label><br>\n            <label for=\"AntiBullType\">AntiBullMode:</label>\n            <select id=\"antiBullType\" class=\"styledSelect\">\n            <option value=\"noab\" selected>None</option>\n            <option value=\"abreload\">When Reloaded</option>\n            <option value=\"abalway\" >Primary Reloaded</option>\n            </select><br>\n            </label>\n        </div>\n        <div id=\"miscContent\" class=\"content\">\n            <h4>Misc</h4>\n            <label><input type=\"checkbox\" id=\"weaponGrind\" onclick=\"window.startGrind()\"> Weapon Grinder</label><br>\n            <label><input type=\"checkbox\" id=\"safeAntiSpikeTick\" checked> Safe AntiSpikeTick</label><br>\n            <label><input type=\"checkbox\" id=\"turretCombat\" checked> Turret Gear Combat Assistance</label><br>\n            <label><input type=\"checkbox\" id=\"backupNobull\" checked> Backup Nobull Insta</label><br>\n            <label><input type=\"checkbox\" id=\"autoUpgrade\" checked> Smart Upgrade</label><br>\n            <label><input type=\"checkbox\" id=\"autorespond\" > AutoRespond</label><br>\n            <label><input type=\"checkbox\" id=\"autoSync\" checked> AutoSync (press \"0\")</label><br>\n            <label for=\"AutoInsta\">AutoInsta Mode:</label>\n            <select id=\"AutoInsta\" class=\"styledSelect\">\n            <option value=\"always\">Always Insta</option>\n            <option value=\"smart\" selected>Insta on 5 Shame</option>\n            </select><br>\n            </label>\n            <label for=\"syncMode\">SyncMode:</label>\n            <select id=\"synctype\" class=\"styledSelect\">\n            <option value=\"rangesync\">Ranged</option>\n            <option value=\"meleesync\">Melee</option>\n            <option value=\"instasync\">Insta-sync</option>\n            </select><br>\n        </div>\n\n        <div id=\"devContent\" class=\"content\">\n            <h4>Developer</h4>\n            <label><input type=\"checkbox\" id=\"devMode\" checked> DevMode</label><br>\n            <label>Menu Color: <input type=\"color\" id=\"menuColor\" value=\"#2c2f33\"></label><br>\n            <label>Tab Color: <input type=\"color\" id=\"tabColor\" value=\"#7289da\"></label><br>\n        </div>\n    ";
  document.body.appendChild(v4);
  document.body.appendChild(v5);
  const v6 = document.createElement("style");
  v6.textContent = "\n    .tab {\n        display: flex; align-items: center; width: 100%; padding: 10px;\n        margin-bottom: 5px; background-color: #23272a; color: white;\n        border: none; border-radius: 5px; text-align: left; cursor: pointer;\n        transition: background-color 0.3s ease, transform 0.3s ease;\n    }\n    .tab.active { background-color: #7289da; transform: scale(1.05); }\n    .tab:hover { background-color: #414755; transform: scale(1.05); }\n    .tabIcon {\n        width: 20px; height: 20px; margin-right: 10px;\n        transition: transform 0.3s ease; /* Smooth transition for movement */\n    }\n    .tab:hover .tabIcon {\n        transform: translateX(10px); /* Move icon to the right on hover */\n    }\n    .content { display: none; }\n    .content.active { display: block; }\n    input[type=\"checkbox\"] {\n        background: #999999; position: relative; appearance: none; width: 25px;\n        height: 12px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.2);\n        cursor: pointer; top: 7.5px; left: 0; transition: 0.4s;\n    }\n    input[type=\"checkbox\"]:checked {\n        background: #7289da; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.2);\n    }\n    input[type=\"checkbox\"]::before {\n        content: \"\"; position: absolute; border-radius: 50%; background: white;\n        width: 16px; height: 16px; top: -2px; left: -2px; transition: 0.4s;\n    }\n    input:checked[type=\"checkbox\"]::before { left: 12px; }\n    .customText { padding: 5px; border-radius: 5px; border: 1px solid #555; background: #333; color: #fff; }\n    .styledSelect { background: #333; color: #fff; border: 1px solid #555; border-radius: 5px; padding: 5px; }\n    .menuB {\n        background: linear-gradient(145deg, #4b7bec, #2e86de);\n        color: #fff;\n        border: none;\n        padding: 5px 10px;\n        border-radius: 6px;\n        cursor: pointer;\n        margin-right: 5px;\n        font-size: 12px;\n        font-weight: normal;\n        text-transform: none;\n        transition: all 0.2s ease;\n        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);\n    }\n    .menuB:hover {\n        background: linear-gradient(145deg, #2e86de, #4b7bec);\n        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);\n    }\n    .menuB:active {\n        background: linear-gradient(145deg, #1f4f8b, #2a5d9f);\n        box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.3);\n    }\n";
  document.head.appendChild(v6);
  function f(p2) {
    document.querySelectorAll(".tab").forEach(p3 => p3.classList.remove("active"));
    document.querySelectorAll(".content").forEach(p4 => p4.classList.remove("active"));
    document.getElementById(p2 + "Tab").classList.add("active");
    document.getElementById(p2 + "Content").classList.add("active");
  }
  document.getElementById("visualTab").addEventListener("click", () => f("visual"));
  document.getElementById("combatTab").addEventListener("click", () => f("combat"));
  document.getElementById("miscTab").addEventListener("click", () => f("misc"));
  document.getElementById("devTab").addEventListener("click", () => f("dev"));
  function f2() {
    let v7 = v4.style.opacity === "1";
    v4.style.opacity = v7 ? "0" : "1";
    v4.style.visibility = v7 ? "hidden" : "visible";
    v4.style.transform = v7 ? "translateX(-220px)" : "translateX(0)";
    v5.style.opacity = v7 ? "0" : "1";
    v5.style.visibility = v7 ? "hidden" : "visible";
    v5.style.transform = v7 ? "translateX(220px)" : "translateX(0)";
  }
  document.addEventListener("keydown", p5 => {
    if (p5.key === "Escape") {
      f2();
    }
  });
  document.getElementById("menuColor").addEventListener("input", p6 => {
    const v8 = p6.target.value;
    v4.style.backgroundColor = v8;
    v5.style.backgroundColor = v8;
  });
  document.getElementById("tabColor").addEventListener("input", p7 => {
    const v9 = p7.target.value;
    document.querySelectorAll(".tab, .menuB").forEach(p8 => {
      p8.style.backgroundColor = v9;
    });
  });
})();
const cursorStyles = [{
  name: "Crosshair",
  cursor: "crosshair"
}];
document.body.style.cursor = cursorStyles[0].cursor;
let testMode = window.location.hostname == "127.0.0.1";
let css = document.createElement("style");
css.type = "text/css";
css.appendChild(document.createTextNode("\n\n.actionBarItem {\n    width: 66px;\n    height: 66px;\n    margin-right: 6px;\n    background-color: #00000050;\n    -webkit-border-radius: 0px;\n    -moz-border-radius: 0px;\n    border-radius: 5px;\n    display: inline-block;\n    cursor: pointer;\n    pointer-events: all;\n    background-size: cover;\n    backdrop-filter: blur(1px);\n    box-shadow: 0px 0px 6px #00000050;\n}\n#ageBarContainer {\n    width: 100%;\n    bottom: 120px;\n    text-align: center;\n}\n#ageBar {\n    background-color: #00000050;\n    -webkit-border-radius: 8px;\n    -moz-border-radius: 8px;\n    border-radius: 8px;\n    padding: 5px;\n    width: 314px;\n    height: 10px;\n    display: inline-block;\n    margin-bottom: 8px;\n    backdrop-filter: blur(1px);\n    box-shadow: 0px 0px 6px #00000050;\n}\n\n.gameButton, #leaderboard, .resourceDisplay,\n#mapDisplay, #allianceHolder, #allianceInput,\n.allianceButtonM, #storeHolder, .storeTab, #chatBox {\n    color: #FFF;\n    text-shadow:\n        0 0 5px rgba(173, 216, 230, 0.8),\n        0 0 10px rgba(173, 216, 230, 0.6),\n        0 0 20px rgba(173, 216, 230, 0.4),\n        0 0 30px rgba(173, 216, 230, 0.3);\n    transition: text-shadow 0.3s ease-in-out;\n}\n\n.gameButton:hover, #leaderboard:hover,\n.resourceDisplay:hover, #mapDisplay:hover,\n#allianceHolder:hover, #allianceInput:hover,\n.allianceButtonM:hover, #storeHolder:hover,\n.storeTab:hover, #chatBox:hover {\n    text-shadow:\n        0 0 10px rgba(173, 216, 230, 0.8),\n        0 0 20px rgba(173, 216, 230, 0.6),\n        0 0 30px rgba(173, 216, 230, 0.5),\n        0 0 40px rgba(173, 216, 230, 0.4);\n}\n\n\n"));
document.head.appendChild(css);
document.addEventListener("keydown", function (p9) {
  if (p9.key === "Tab") {
    p9.preventDefault();
  }
  if (p9.key === "F5") {
    p9.preventDefault();
  }
});
function onBoxMouseOver() {
  this.style.transform = "scale(1.05)";
  this.style.transition = "all 0.7s ease-in-out";
}
function onBoxMouseLeave() {
  this.style.transition = "all 0.7s ease-in-out";
  this.style.transform = "scale(1)";
}
function onEnterGameMouseOver() {
  const v10 = document.getElementById("enterGame");
  v10.style.backgroundColor = "rgba(255, 255, 0, 0.2)";
  v10.style.borderRadius = "20px";
  v10.style.transition = "all 0.7s ease-in-out";
}
function onEnterGameMouseLeave() {
  const v11 = document.getElementById("enterGame");
  v11.style.backgroundColor = "rgba(153, 50, 204, 0.3)";
  v11.style.borderRadius = "15px";
  v11.style.transition = "all 0.7s ease-in-out";
}
const boxes = document.querySelectorAll(".menuCard");
boxes.forEach(p10 => {
  p10.style.transition = "transform 1s ease";
  p10.addEventListener("mouseenter", onBoxMouseOver);
  p10.addEventListener("mouseleave", onBoxMouseLeave);
});
const enterGameBox = document.getElementById("enterGame");
enterGameBox.addEventListener("mouseenter", onEnterGameMouseOver);
enterGameBox.addEventListener("mouseleave", onEnterGameMouseLeave);
const guideCardDiv = document.getElementById("guideCard");
if (guideCardDiv) {
  guideCardDiv.style.position = "absolute";
  guideCardDiv.style.width = "300px";
  guideCardDiv.style.height = "200px";
  guideCardDiv.style.top = "100%";
  guideCardDiv.style.left = "41%";
  guideCardDiv.style.zIndex = "9999";
}
let Leuchtturm = false;
setInterval(() => {
  console.clear();
}, 500);
function getEl(p11) {
  return document.getElementById(p11);
}
var EasyStar = function (p12) {
  var v12 = {};
  function f3(p13) {
    if (v12[p13]) {
      return v12[p13].exports;
    }
    var v13 = v12[p13] = {
      i: p13,
      l: false,
      exports: {}
    };
    p12[p13].call(v13.exports, v13, v13.exports, f3);
    v13.l = true;
    return v13.exports;
  }
  f3.m = p12;
  f3.c = v12;
  f3.d = function (p14, p15, p16) {
    if (!f3.o(p14, p15)) {
      Object.defineProperty(p14, p15, {
        enumerable: true,
        get: p16
      });
    }
  };
  f3.r = function (p17) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(p17, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(p17, "__esModule", {
      value: true
    });
  };
  f3.t = function (p18, p19) {
    if (p19 & 1) {
      p18 = f3(p18);
    }
    if (p19 & 8) {
      return p18;
    }
    if (p19 & 4 && typeof p18 == "object" && p18 && p18.__esModule) {
      return p18;
    }
    var v14 = Object.create(null);
    f3.r(v14);
    Object.defineProperty(v14, "default", {
      enumerable: true,
      value: p18
    });
    if (p19 & 2 && typeof p18 != "string") {
      for (var v15 in p18) {
        f3.d(v14, v15, function (p20) {
          return p18[p20];
        }.bind(null, v15));
      }
    }
    return v14;
  };
  f3.n = function (p21) {
    var v16 = p21 && p21.__esModule ? function () {
      return p21.default;
    } : function () {
      return p21;
    };
    f3.d(v16, "f", v16);
    return v16;
  };
  f3.o = function (p22, p23) {
    return Object.prototype.hasOwnProperty.call(p22, p23);
  };
  f3.p = "/bin/";
  return f3(f3.s = 0);
}([function (p24, p25, p26) {
  var v17 = {};
  var vP26 = p26(1);
  var vP262 = p26(2);
  var vP263 = p26(3);
  p24.exports = v17;
  var v18 = 1;
  v17.js = function () {
    var v19;
    var v20;
    var v21;
    var v22 = 1.4;
    var v23 = false;
    var v24 = {};
    var v25 = {};
    var v26 = {};
    var v27 = {};
    var v28 = true;
    var v29 = {};
    var v30 = [];
    var v31 = Number.MAX_VALUE;
    var v32 = false;
    this.setAcceptableTiles = function (p27) {
      if (p27 instanceof Array) {
        v21 = p27;
      } else if (!isNaN(parseFloat(p27)) && isFinite(p27)) {
        v21 = [p27];
      }
    };
    this.enableSync = function () {
      v23 = true;
    };
    this.disableSync = function () {
      v23 = false;
    };
    this.enableDiagonals = function () {
      v32 = true;
    };
    this.disableDiagonals = function () {
      v32 = false;
    };
    this.setGrid = function (p28) {
      v19 = p28;
      for (var v33 = 0; v33 < v19.length; v33++) {
        for (var v34 = 0; v34 < v19[0].length; v34++) {
          v25[v19[v33][v34]] ||= 1;
        }
      }
    };
    this.setTileCost = function (p29, p30) {
      v25[p29] = p30;
    };
    this.setAdditionalPointCost = function (p31, p32, p33) {
      if (v26[p32] === undefined) {
        v26[p32] = {};
      }
      v26[p32][p31] = p33;
    };
    this.removeAdditionalPointCost = function (p34, p35) {
      if (v26[p35] !== undefined) {
        delete v26[p35][p34];
      }
    };
    this.removeAllAdditionalPointCosts = function () {
      v26 = {};
    };
    this.setDirectionalCondition = function (p36, p37, p38) {
      if (v27[p37] === undefined) {
        v27[p37] = {};
      }
      v27[p37][p36] = p38;
    };
    this.removeAllDirectionalConditions = function () {
      v27 = {};
    };
    this.setIterationsPerCalculation = function (p39) {
      v31 = p39;
    };
    this.avoidAdditionalPoint = function (p40, p41) {
      if (v24[p41] === undefined) {
        v24[p41] = {};
      }
      v24[p41][p40] = 1;
    };
    this.stopAvoidingAdditionalPoint = function (p42, p43) {
      if (v24[p43] !== undefined) {
        delete v24[p43][p42];
      }
    };
    this.enableCornerCutting = function () {
      v28 = true;
    };
    this.disableCornerCutting = function () {
      v28 = false;
    };
    this.stopAvoidingAllAdditionalPoints = function () {
      v24 = {};
    };
    this.findPath = function (p44, p45, p46, p47, p48) {
      function f4(p49) {
        if (v23) {
          p48(p49);
        } else {
          setTimeout(function () {
            p48(p49);
          });
        }
      }
      if (v21 === undefined) {
        throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
      }
      if (v19 === undefined) {
        throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
      }
      if (p44 < 0 || p45 < 0 || p46 < 0 || p47 < 0 || p44 > v19[0].length - 1 || p45 > v19.length - 1 || p46 > v19[0].length - 1 || p47 > v19.length - 1) {
        throw new Error("Your start or end point is outside the scope of your grid.");
      }
      if (p44 !== p46 || p45 !== p47) {
        var v35 = v19[p47][p46];
        var v36 = false;
        for (var v37 = 0; v37 < v21.length; v37++) {
          if (v35 === v21[v37]) {
            v36 = true;
            break;
          }
        }
        if (v36 !== false) {
          var v38 = new vP26();
          v38.openList = new vP263(function (p50, p51) {
            return p50.bestGuessDistance() - p51.bestGuessDistance();
          });
          v38.isDoneCalculating = false;
          v38.nodeHash = {};
          v38.startX = p44;
          v38.startY = p45;
          v38.endX = p46;
          v38.endY = p47;
          v38.callback = f4;
          v38.openList.push(f9(v38, v38.startX, v38.startY, null, 1));
          p47 = v18++;
          v29[p47] = v38;
          v30.push(p47);
          return p47;
        }
        f4(null);
      } else {
        f4([]);
      }
    };
    this.cancelPath = function (p52) {
      return p52 in v29 && (delete v29[p52], true);
    };
    this.calculate = function () {
      if (v30.length !== 0 && v19 !== undefined && v21 !== undefined) {
        for (v20 = 0; v20 < v31; v20++) {
          if (v30.length === 0) {
            return;
          }
          if (v23) {
            v20 = 0;
          }
          var v39 = v30[0];
          var v40 = v29[v39];
          if (v40 !== undefined) {
            if (v40.openList.size() !== 0) {
              var v41 = v40.openList.pop();
              if (v40.endX !== v41.x || v40.endY !== v41.y) {
                if ((v41.list = 0) < v41.y) {
                  f5(v40, v41, 0, -1, +f8(v41.x, v41.y - 1));
                }
                if (v41.x < v19[0].length - 1) {
                  f5(v40, v41, 1, 0, +f8(v41.x + 1, v41.y));
                }
                if (v41.y < v19.length - 1) {
                  f5(v40, v41, 0, 1, +f8(v41.x, v41.y + 1));
                }
                if (v41.x > 0) {
                  f5(v40, v41, -1, 0, +f8(v41.x - 1, v41.y));
                }
                if (v32) {
                  if (v41.x > 0 && v41.y > 0 && (v28 || f6(v19, v21, v41.x, v41.y - 1, v41) && f6(v19, v21, v41.x - 1, v41.y, v41))) {
                    f5(v40, v41, -1, -1, v22 * f8(v41.x - 1, v41.y - 1));
                  }
                  if (v41.x < v19[0].length - 1 && v41.y < v19.length - 1 && (v28 || f6(v19, v21, v41.x, v41.y + 1, v41) && f6(v19, v21, v41.x + 1, v41.y, v41))) {
                    f5(v40, v41, 1, 1, v22 * f8(v41.x + 1, v41.y + 1));
                  }
                  if (v41.x < v19[0].length - 1 && v41.y > 0 && (v28 || f6(v19, v21, v41.x, v41.y - 1, v41) && f6(v19, v21, v41.x + 1, v41.y, v41))) {
                    f5(v40, v41, 1, -1, v22 * f8(v41.x + 1, v41.y - 1));
                  }
                  if (v41.x > 0 && v41.y < v19.length - 1 && (v28 || f6(v19, v21, v41.x, v41.y + 1, v41) && f6(v19, v21, v41.x - 1, v41.y, v41))) {
                    f5(v40, v41, -1, 1, v22 * f8(v41.x - 1, v41.y + 1));
                  }
                }
              } else {
                var v42 = [];
                v42.push({
                  x: v41.x,
                  y: v41.y
                });
                for (var v43 = v41.parent; v43 != null;) {
                  v42.push({
                    x: v43.x,
                    y: v43.y
                  });
                  v43 = v43.parent;
                }
                v42.reverse();
                v40.callback(v42);
                delete v29[v39];
                v30.shift();
              }
            } else {
              v40.callback(null);
              delete v29[v39];
              v30.shift();
            }
          } else {
            v30.shift();
          }
        }
      }
    };
    function f5(p53, p54, p55, p56, p57) {
      p55 = p54.x + p55;
      p56 = p54.y + p56;
      if ((v24[p56] === undefined || v24[p56][p55] === undefined) && !!f6(v19, v21, p55, p56, p54)) {
        if ((p56 = f9(p53, p55, p56, p54, p57)).list === undefined) {
          p56.list = 1;
          p53.openList.push(p56);
        } else if (p54.costSoFar + p57 < p56.costSoFar) {
          p56.costSoFar = p54.costSoFar + p57;
          p56.parent = p54;
          p53.openList.updateItem(p56);
        }
      }
    }
    function f6(p58, p59, p60, p61, p62) {
      var v44 = v27[p61] && v27[p61][p60];
      if (v44) {
        var v_0x608561 = f7(p62.x - p60, p62.y - p61);
        if (!function () {
          for (var v45 = 0; v45 < v44.length; v45++) {
            if (v44[v45] === v_0x608561) {
              return true;
            }
          }
          return false;
        }()) {
          return false;
        }
      }
      for (var v46 = 0; v46 < p59.length; v46++) {
        if (p58[p61][p60] === p59[v46]) {
          return true;
        }
      }
      return false;
    }
    function f7(p63, p64) {
      if (p63 === 0 && p64 === -1) {
        return v17.TOP;
      }
      if (p63 === 1 && p64 === -1) {
        return v17.TOP_RIGHT;
      }
      if (p63 === 1 && p64 === 0) {
        return v17.RIGHT;
      }
      if (p63 === 1 && p64 === 1) {
        return v17.BOTTOM_RIGHT;
      }
      if (p63 === 0 && p64 === 1) {
        return v17.BOTTOM;
      }
      if (p63 === -1 && p64 === 1) {
        return v17.BOTTOM_LEFT;
      }
      if (p63 === -1 && p64 === 0) {
        return v17.LEFT;
      }
      if (p63 === -1 && p64 === -1) {
        return v17.TOP_LEFT;
      }
      throw new Error("These differences are not valid: " + p63 + ", " + p64);
    }
    function f8(p65, p66) {
      return v26[p66] && v26[p66][p65] || v25[v19[p66][p65]];
    }
    function f9(p67, p68, p69, p70, p71) {
      if (p67.nodeHash[p69] !== undefined) {
        if (p67.nodeHash[p69][p68] !== undefined) {
          return p67.nodeHash[p69][p68];
        }
      } else {
        p67.nodeHash[p69] = {};
      }
      var v47 = f10(p68, p69, p67.endX, p67.endY);
      var p71 = p70 !== null ? p70.costSoFar + p71 : 0;
      var v47 = new vP262(p70, p68, p69, p71, v47);
      return p67.nodeHash[p69][p68] = v47;
    }
    function f10(p72, p73, p74, p75) {
      var v48;
      var v49;
      if (v32) {
        if ((v48 = Math.abs(p72 - p74)) < (v49 = Math.abs(p73 - p75))) {
          return v22 * v48 + v49;
        } else {
          return v22 * v49 + v48;
        }
      } else {
        return (v48 = Math.abs(p72 - p74)) + (v49 = Math.abs(p73 - p75));
      }
    }
  };
  v17.TOP = "TOP";
  v17.TOP_RIGHT = "TOP_RIGHT";
  v17.RIGHT = "RIGHT";
  v17.BOTTOM_RIGHT = "BOTTOM_RIGHT";
  v17.BOTTOM = "BOTTOM";
  v17.BOTTOM_LEFT = "BOTTOM_LEFT";
  v17.LEFT = "LEFT";
  v17.TOP_LEFT = "TOP_LEFT";
}, function (p76, p77) {
  p76.exports = function () {
    this.pointsToAvoid = {};
    this.startX;
    this.callback;
    this.startY;
    this.endX;
    this.endY;
    this.nodeHash = {};
    this.openList;
  };
}, function (p78, p79) {
  p78.exports = function (p80, p81, p82, p83, p84) {
    this.parent = p80;
    this.x = p81;
    this.y = p82;
    this.costSoFar = p83;
    this.simpleDistanceToTarget = p84;
    this.bestGuessDistance = function () {
      return this.costSoFar + this.simpleDistanceToTarget;
    };
  };
}, function (p85, p86, p87) {
  p85.exports = p87(4);
}, function (p88, p89, p90) {
  var v50;
  var v51;
  (function () {
    var v52;
    var v53;
    var v54;
    var v55;
    var v56;
    var v57;
    var v58;
    var v59;
    var v60;
    var v61;
    var v62;
    var v63;
    var v64;
    var v65;
    var v66;
    function f11(p91) {
      this.cmp = p91 ?? v53;
      this.nodes = [];
    }
    v54 = Math.floor;
    v61 = Math.min;
    v53 = function (p92, p93) {
      if (p92 < p93) {
        return -1;
      } else if (p93 < p92) {
        return 1;
      } else {
        return 0;
      }
    };
    v60 = function (p94, p95, p96, p97, p98) {
      var v67;
      if (p96 == null) {
        p96 = 0;
      }
      if (p98 == null) {
        p98 = v53;
      }
      if (p96 < 0) {
        throw new Error("lo must be non-negative");
      }
      for (p97 == null && (p97 = p94.length); p96 < p97;) {
        if (p98(p95, p94[v67 = v54((p96 + p97) / 2)]) < 0) {
          p97 = v67;
        } else {
          p96 = v67 + 1;
        }
      }
      [].splice.apply(p94, [p96, p96 - p96].concat(p95));
      return p95;
    };
    v57 = function (p99, p100, p101) {
      if (p101 == null) {
        p101 = v53;
      }
      p99.push(p100);
      return v65(p99, 0, p99.length - 1, p101);
    };
    v56 = function (p102, p103) {
      var v68;
      var v69;
      if (p103 == null) {
        p103 = v53;
      }
      v68 = p102.pop();
      if (p102.length) {
        v69 = p102[0];
        p102[0] = v68;
        v66(p102, 0, p103);
      } else {
        v69 = v68;
      }
      return v69;
    };
    v59 = function (p104, p105, p106) {
      var v70;
      if (p106 == null) {
        p106 = v53;
      }
      v70 = p104[0];
      p104[0] = p105;
      v66(p104, 0, p106);
      return v70;
    };
    v58 = function (p107, p108, p109) {
      var v71;
      if (p109 == null) {
        p109 = v53;
      }
      if (p107.length && p109(p107[0], p108) < 0) {
        p108 = (v71 = [p107[0], p108])[0];
        p107[0] = v71[1];
        v66(p107, 0, p109);
      }
      return p108;
    };
    v55 = function (p110, p111) {
      var v72;
      var v73;
      var v74;
      var v75;
      var v76;
      var v77;
      if (p111 == null) {
        p111 = v53;
      }
      v76 = [];
      v73 = 0;
      v74 = (v75 = function () {
        v77 = [];
        for (var v78 = 0, vV54 = v54(p110.length / 2); vV54 >= 0 ? v78 < vV54 : vV54 < v78; vV54 >= 0 ? v78++ : v78--) {
          v77.push(v78);
        }
        return v77;
      }.apply(this).reverse()).length;
      for (; v73 < v74; v73++) {
        v72 = v75[v73];
        v76.push(v66(p110, v72, p111));
      }
      return v76;
    };
    v64 = function (p112, p113, p114) {
      if (p114 == null) {
        p114 = v53;
      }
      if ((p113 = p112.indexOf(p113)) !== -1) {
        v65(p112, 0, p113, p114);
        return v66(p112, p113, p114);
      }
    };
    v62 = function (p115, p116, p117) {
      var v79;
      var v80;
      var v81;
      var v82;
      var v83;
      if (p117 == null) {
        p117 = v53;
      }
      if (!(v80 = p115.slice(0, p116)).length) {
        return v80;
      }
      v55(v80, p117);
      v81 = 0;
      v82 = (v83 = p115.slice(p116)).length;
      for (; v81 < v82; v81++) {
        v79 = v83[v81];
        v58(v80, v79, p117);
      }
      return v80.sort(p117).reverse();
    };
    v63 = function (p118, p119, p120) {
      var v84;
      var v85;
      var v86;
      var v87;
      var v88;
      var v89;
      var v90;
      var v91;
      var v92;
      if (p120 == null) {
        p120 = v53;
      }
      if (p119 * 10 <= p118.length) {
        if (!(v86 = p118.slice(0, p119).sort(p120)).length) {
          return v86;
        }
        v85 = v86[v86.length - 1];
        v87 = 0;
        v89 = (v90 = p118.slice(p119)).length;
        for (; v87 < v89; v87++) {
          if (p120(v84 = v90[v87], v85) < 0) {
            v60(v86, v84, 0, null, p120);
            v86.pop();
            v85 = v86[v86.length - 1];
          }
        }
        return v86;
      }
      v55(p118, p120);
      v92 = [];
      v88 = 0;
      v91 = v61(p119, p118.length);
      for (; v91 >= 0 ? v88 < v91 : v91 < v88; v91 >= 0 ? ++v88 : --v88) {
        v92.push(v56(p118, p120));
      }
      return v92;
    };
    v65 = function (p121, p122, p123, p124) {
      var v93;
      var v94;
      var v95;
      if (p124 == null) {
        p124 = v53;
      }
      v93 = p121[p123];
      while (p122 < p123 && p124(v93, v94 = p121[v95 = p123 - 1 >> 1]) < 0) {
        p121[p123] = v94;
        p123 = v95;
      }
      return p121[p123] = v93;
    };
    v66 = function (p125, p126, p127) {
      var v96;
      var v97;
      var v98;
      var v99;
      var v100;
      if (p127 == null) {
        p127 = v53;
      }
      v97 = p125.length;
      v98 = p125[v100 = p126];
      v96 = p126 * 2 + 1;
      while (v96 < v97) {
        if ((v99 = v96 + 1) < v97 && !(p127(p125[v96], p125[v99]) < 0)) {
          v96 = v99;
        }
        p125[p126] = p125[v96];
        v96 = (p126 = v96) * 2 + 1;
      }
      p125[p126] = v98;
      return v65(p125, v100, p126, p127);
    };
    f11.push = v57;
    f11.pop = v56;
    f11.replace = v59;
    f11.pushpop = v58;
    f11.heapify = v55;
    f11.updateItem = v64;
    f11.nlargest = v62;
    f11.nsmallest = v63;
    f11.prototype.push = function (p128) {
      return v57(this.nodes, p128, this.cmp);
    };
    f11.prototype.pop = function () {
      return v56(this.nodes, this.cmp);
    };
    f11.prototype.peek = function () {
      return this.nodes[0];
    };
    f11.prototype.contains = function (p129) {
      return this.nodes.indexOf(p129) !== -1;
    };
    f11.prototype.replace = function (p130) {
      return v59(this.nodes, p130, this.cmp);
    };
    f11.prototype.pushpop = function (p131) {
      return v58(this.nodes, p131, this.cmp);
    };
    f11.prototype.heapify = function () {
      return v55(this.nodes, this.cmp);
    };
    f11.prototype.updateItem = function (p132) {
      return v64(this.nodes, p132, this.cmp);
    };
    f11.prototype.clear = function () {
      return this.nodes = [];
    };
    f11.prototype.empty = function () {
      return this.nodes.length === 0;
    };
    f11.prototype.size = function () {
      return this.nodes.length;
    };
    f11.prototype.clone = function () {
      var v101 = new f11();
      v101.nodes = this.nodes.slice(0);
      return v101;
    };
    f11.prototype.toArray = function () {
      return this.nodes.slice(0);
    };
    f11.prototype.insert = f11.prototype.push;
    f11.prototype.top = f11.prototype.peek;
    f11.prototype.front = f11.prototype.peek;
    f11.prototype.has = f11.prototype.contains;
    f11.prototype.copy = f11.prototype.clone;
    v52 = f11;
    v50 = [];
    if ((v51 = typeof (v51 = function () {
      return v52;
    }) == "function" ? v51.apply(p89, v50) : v51) !== undefined) {
      p88.exports = v51;
    }
  }).call(this);
}]);
let easystar = new EasyStar.js();
document.getElementById("gameName").innerHTML = "";
$("#gameName").css({
  display: "none"
});
let coolFont = document.createElement("link");
coolFont.rel = "stylesheet";
coolFont.href = "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap";
coolFont.type = "text/css";
document.body.append(coolFont);
let min = document.createElement("script");
min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
document.body.append(min);
window.oncontextmenu = function () {
  return false;
};
let config = window.config;
config.clientSendRate = 9;
config.serverUpdateRate = 9;
config.deathFadeout = 0;
config.playerCapacity = 50;
config.isSandbox = window.location.hostname == "sandbox.moomoo.io";
config.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91b2db"];
config.weaponVariants = [{
  id: 0,
  src: "",
  xp: 0,
  val: 1
}, {
  id: 1,
  src: "_g",
  xp: 3000,
  val: 1.1
}, {
  id: 2,
  src: "_d",
  xp: 7000,
  val: 1.18
}, {
  id: 3,
  src: "_r",
  poison: true,
  xp: 12000,
  val: 1.18
}, {
  id: 4,
  src: "_e",
  poison: true,
  heal: true,
  xp: 24000,
  val: 1.18
}];
config.anotherVisual = true;
config.useWebGl = false;
config.resetRender = true;
function waitTime(p133) {
  return new Promise(p134 => {
    setTimeout(() => {
      p134();
    }, p133);
  });
}
let botSkts = [];
let canStore;
if (typeof Storage !== "undefined") {
  canStore = true;
}
function saveVal(p135, p136) {
  if (canStore) {
    localStorage.setItem(p135, p136);
  }
}
function deleteVal(p137) {
  if (canStore) {
    localStorage.removeItem(p137);
  }
}
function getSavedVal(p138) {
  if (canStore) {
    return localStorage.getItem(p138);
  }
  return null;
}
let gC = function (p139, p140) {
  try {
    let v102 = JSON.parse(getSavedVal(p139));
    if (typeof v102 === "object") {
      return p140;
    } else {
      return v102;
    }
  } catch (_0x3f328e) {
    return p140;
  }
};
function setCommands() {}
function setConfigs() {
  return {};
}
let commands = setCommands();
let configs = setConfigs();
window.removeConfigs = function () {
  for (let v103 in configs) {
    deleteVal(v103, configs[v103]);
  }
};
for (let cF in configs) {
  configs[cF] = gC(cF, configs[cF]);
}
window.changeMenu = function () {};
window.debug = function () {};
window.wasdMode = function () {};
window.startGrind = function () {};
window.connectFillBots = function () {};
window.destroyFillBots = function () {};
window.tryConnectBots = function () {};
window.destroyBots = function () {};
window.resBuild = function () {};
window.toggleBotsCircle = function () {};
window.toggleVisual = function () {};
window.prepareUI = function () {};
window.leave = function () {};
window.ping = 0;
class HtmlAction {
  constructor(p141) {
    this.element = p141;
  }
  add(p142) {
    if (!this.element) {
      return undefined;
    }
    this.element.innerHTML += p142;
  }
  newLine(p143) {
    let v104 = "<br>";
    if (p143 > 0) {
      v104 = "";
      for (let v105 = 0; v105 < p143; v105++) {
        v104 += "<br>";
      }
    }
    this.add(v104);
  }
  checkBox(p144) {
    let v106 = "<input type = \"checkbox\"";
    if (p144.id) {
      v106 += " id = " + p144.id;
    }
    if (p144.style) {
      v106 += " style = " + p144.style.replaceAll(" ", "");
    }
    if (p144.class) {
      v106 += " class = " + p144.class;
    }
    if (p144.checked) {
      v106 += " checked";
    }
    if (p144.onclick) {
      v106 += " onclick = " + p144.onclick;
    }
    v106 += ">";
    this.add(v106);
  }
  text(p145) {
    let v107 = "<input type = \"text\"";
    if (p145.id) {
      v107 += " id = " + p145.id;
    }
    if (p145.style) {
      v107 += " style = " + p145.style.replaceAll(" ", "");
    }
    if (p145.class) {
      v107 += " class = " + p145.class;
    }
    if (p145.size) {
      v107 += " size = " + p145.size;
    }
    if (p145.maxLength) {
      v107 += " maxLength = " + p145.maxLength;
    }
    if (p145.value) {
      v107 += " value = " + p145.value;
    }
    if (p145.placeHolder) {
      v107 += " placeHolder = " + p145.placeHolder.replaceAll(" ", "&nbsp;");
    }
    v107 += ">";
    this.add(v107);
  }
  select(p146) {
    let v108 = "<select";
    if (p146.id) {
      v108 += " id = " + p146.id;
    }
    if (p146.style) {
      v108 += " style = " + p146.style.replaceAll(" ", "");
    }
    if (p146.class) {
      v108 += " class = " + p146.class;
    }
    v108 += ">";
    for (let v109 in p146.option) {
      v108 += "<option value = " + p146.option[v109].id;
      if (p146.option[v109].selected) {
        v108 += " selected";
      }
      v108 += ">" + v109 + "</option>";
    }
    v108 += "</select>";
    this.add(v108);
  }
  button(p147) {
    let v110 = "<button";
    if (p147.id) {
      v110 += " id = " + p147.id;
    }
    if (p147.style) {
      v110 += " style = " + p147.style.replaceAll(" ", "");
    }
    if (p147.class) {
      v110 += " class = " + p147.class;
    }
    if (p147.onclick) {
      v110 += " onclick = " + p147.onclick;
    }
    v110 += ">";
    if (p147.innerHTML) {
      v110 += p147.innerHTML;
    }
    v110 += "</button>";
    this.add(v110);
  }
  selectMenu(p148) {
    let v111 = "<select";
    if (!p148.id) {
      alert("please put id skid");
      return;
    }
    window[p148.id + "Func"] = function () {};
    if (p148.id) {
      v111 += " id = " + p148.id;
    }
    if (p148.style) {
      v111 += " style = " + p148.style.replaceAll(" ", "");
    }
    if (p148.class) {
      v111 += " class = " + p148.class;
    }
    v111 += " onchange = window." + (p148.id + "Func") + "()";
    v111 += ">";
    let v112;
    let v113 = 0;
    for (let v114 in p148.menu) {
      v111 += "<option value = " + ("option_" + v114) + " id = " + ("O_" + v114);
      if (p148.menu[v114]) {
        v111 += " checked";
      }
      v111 += " style = \"color: " + (p148.menu[v114] ? "#000" : "") + "; background: " + (p148.menu[v114] ? "" : "") + ";\">" + v114 + "</option>";
      v113++;
    }
    v111 += "</select>";
    this.add(v111);
    v113 = 0;
    for (let v115 in p148.menu) {
      window[v115 + "Func"] = function () {
        p148.menu[v115] = getEl("check_" + v115).checked ? true : false;
        saveVal(v115, p148.menu[v115]);
        getEl("O_" + v115).style.color = p148.menu[v115] ? "#000" : "#fff";
        getEl("O_" + v115).style.background = p148.menu[v115] ? "#8ecc51" : "#cc5151";
      };
      this.checkBox({
        id: "check_" + v115,
        style: "display: " + (v113 == 0 ? "inline-block" : "none") + ";",
        class: "checkB",
        onclick: "window." + (v115 + "Func") + "()",
        checked: p148.menu[v115]
      });
      v113++;
    }
    v112 = "check_" + getEl(p148.id).value.split("_")[1];
    window[p148.id + "Func"] = function () {
      getEl(v112).style.display = "none";
      v112 = "check_" + getEl(p148.id).value.split("_")[1];
      getEl(v112).style.display = "inline-block";
    };
  }
}
;
class Html {
  constructor() {
    this.element = null;
    this.action = null;
    this.divElement = null;
    this.startDiv = function (p149, p150) {
      let v116 = document.createElement("div");
      if (p149.id) {
        v116.id = p149.id;
      }
      if (p149.style) {
        v116.style = p149.style;
      }
      if (p149.class) {
        v116.className = p149.class;
      }
      this.element.appendChild(v116);
      this.divElement = v116;
      let v117 = new HtmlAction(v116);
      if (typeof p150 == "function") {
        p150(v117);
      }
    };
    this.addDiv = function (p151, p152) {
      let v118 = document.createElement("div");
      if (p151.id) {
        v118.id = p151.id;
      }
      if (p151.style) {
        v118.style = p151.style;
      }
      if (p151.class) {
        v118.className = p151.class;
      }
      if (p151.appendID) {
        getEl(p151.appendID).appendChild(v118);
      }
      this.divElement = v118;
      let v119 = new HtmlAction(v118);
      if (typeof p152 == "function") {
        p152(v119);
      }
    };
  }
  set(p153) {
    this.element = getEl(p153);
    this.action = new HtmlAction(this.element);
  }
  resetHTML(p154) {
    if (p154) {
      this.element.innerHTML = "";
    } else {
      this.element.innerHTML = "";
    }
  }
  setStyle(p155) {
    this.element.style = p155;
  }
  setCSS(p156) {
    this.action.add("<style>" + p156 + "</style>");
  }
}
;
let HTML = new Html();
let menuChatDiv = document.createElement("div");
menuChatDiv.id = "menuChatDiv";
document.body.appendChild(menuChatDiv);
HTML.set("menuChatDiv");
HTML.setStyle("");
HTML.resetHTML();
HTML.setCSS(" ");
HTML.startDiv({
  id: "mChDiv",
  class: "chDiv"
}, p157 => {
  HTML.addDiv({
    id: "mChMain",
    class: "chMainDiv",
    appendID: "mChDiv"
  }, p158 => {});
  p157.text({
    id: "mChBox",
    class: "chMainBox"
  });
});
let menuChats = getEl("mChMain");
let menuChatBox = getEl("mChBox");
let menuCBFocus = false;
let menuChCounts = 0;
menuChatBox.value = "";
menuChatBox.addEventListener("focus", () => {
  menuCBFocus = true;
});
menuChatBox.addEventListener("blur", () => {
  menuCBFocus = false;
});
let menuIndex = 0;
let menus = ["menuMain", "menuConfig", "menuOther"];
window.changeMenu = function () {
  getEl(menus[menuIndex % menus.length]).style.display = "none";
  menuIndex++;
  getEl(menus[menuIndex % menus.length]).style.display = "block";
};
let mStatus = document.createElement("div");
mStatus.id = "status";
getEl("gameUI").appendChild(mStatus);
HTML.set("status");
HTML.setStyle("\n            display: block;\n            position: absolute;\n            color: #ddd;\n            font: 15px Hammersmith One;\n            position: fixed;\n            top: 20px;\n            left: 50%;\n            transform: translateX(-50%);\n            ");
HTML.resetHTML();
HTML.setCSS("\n            .sizing {\n                font-size: 13px;\n            }\n            .mod {\n                font-size: 13px;\n                display: inline-block;\n            }\n            ");
HTML.startDiv({
  id: "uehmod",
  class: "sizing"
}, p159 => {
  p159.add("Ping: ");
  HTML.addDiv({
    id: "pingFps",
    class: "mod",
    appendID: "uehmod"
  }, p160 => {
    p160.add("None");
  });
});
let openMenu = false;
let WS = undefined;
let socketID = undefined;
let useWasd = false;
let secPacket = 0;
let secMax = 120;
let secTime = 1000;
let firstSend = {
  sec: false
};
let game = {
  tick: 0,
  tickQueue: [],
  tickBase: function (p161, p162) {
    if (this.tickQueue[this.tick + p162]) {
      this.tickQueue[this.tick + p162].push(p161);
    } else {
      this.tickQueue[this.tick + p162] = [p161];
    }
  },
  tickRate: 1000 / config.serverUpdateRate,
  tickSpeed: 0,
  lastTick: performance.now()
};
let modConsole = [];
let dontSend = false;
let fpsTimer = {
  last: 0,
  time: 0,
  ltime: 0
};
let lastMoveDir = undefined;
let lastsp = ["unknown1l", 1, "__proto__"];
WebSocket.prototype.nsend = WebSocket.prototype.send;
WebSocket.prototype.send = function (p163) {
  if (!WS) {
    WS = this;
    WS.addEventListener("message", function (p164) {
      getMessage(p164);
    });
    WS.addEventListener("close", p165 => {
      if (p165.code == 4001) {
        window.location.reload();
      }
    });
  }
  if (WS == this) {
    dontSend = false;
    let v120 = new Uint8Array(p163);
    let v121 = window.msgpack.decode(v120);
    let v122 = v121[0];
    v120 = v121[1];
    if (v122 == "6") {
      if (v120[0]) {
        let v123 = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
        let v124;
        v123.forEach(p166 => {
          if (v120[0].indexOf(p166) > -1) {
            v124 = "";
            for (let v125 = 0; v125 < p166.length; ++v125) {
              if (v125 == 1) {
                v124 += String.fromCharCode(0);
              }
              v124 += p166[v125];
            }
            let v126 = new RegExp(p166, "g");
            v120[0] = v120[0].replace(v126, v124);
          }
        });
        v120[0] = v120[0].slice(0, 30);
      }
    } else if (v122 == "L") {
      v120[0] = v120[0] + String.fromCharCode(0).repeat(7);
      v120[0] = v120[0].slice(0, 7);
    } else if (v122 == "M") {
      v120[0].name = v120[0].name == "" ? "unknown" : v120[0].name;
      v120[0].moofoll = true;
      v120[0].skin = v120[0].skin == 10 ? "__proto__" : v120[0].skin;
      lastsp = [v120[0].name, v120[0].moofoll, v120[0].skin];
    } else if (v122 == "D") {
      if (my.lastDir == v120[0] || [null, undefined].includes(v120[0])) {
        dontSend = true;
      } else {
        my.lastDir = v120[0];
      }
    } else if (v122 == "d") {
      if (!v120[2]) {
        dontSend = true;
      } else if (![null, undefined].includes(v120[1])) {
        my.lastDir = v120[1];
      }
    } else if (v122 == "K") {
      if (!v120[1]) {
        dontSend = true;
      }
    } else if (v122 == "S") {
      instaC.wait = !instaC.wait;
      dontSend = true;
    } else if (v122 == "f") {
      if (v120[1]) {
        if (player.moveDir == v120[0]) {
          dontSend = true;
        }
        player.moveDir = v120[0];
      } else {
        dontSend = true;
      }
    }
    if (!dontSend) {
      let v127 = window.msgpack.encode([v122, v120]);
      this.nsend(v127);
      if (!firstSend.sec) {
        firstSend.sec = true;
        setTimeout(() => {
          firstSend.sec = false;
          secPacket = 0;
        }, secTime);
      }
      secPacket++;
    }
  } else {
    this.nsend(p163);
  }
};
function packet(p167) {
  let v128 = Array.prototype.slice.call(arguments, 1);
  let v129 = window.msgpack.encode([p167, v128]);
  WS.send(v129);
}
function origPacket(p168) {
  let v130 = Array.prototype.slice.call(arguments, 1);
  let v131 = window.msgpack.encode([p168, v130]);
  WS.nsend(v131);
}
window.leave = function () {
  origPacket("kys", {
    "frvr is so bad": true,
    "sidney is too good": true,
    "dev are too weak": true
  });
};
let io = {
  send: packet
};
function getMessage(p169) {
  let v132 = new Uint8Array(p169.data);
  let v133 = window.msgpack.decode(v132);
  let v134 = v133[0];
  v132 = v133[1];
  let v135 = {
    A: setInitData,
    C: setupGame,
    D: addPlayer,
    E: removePlayer,
    a: updatePlayers,
    G: updateLeaderboard,
    H: loadGameObject,
    I: loadAI,
    J: animateAI,
    K: gatherAnimation,
    L: wiggleGameObject,
    M: shootTurret,
    N: updatePlayerValue,
    O: updateHealth,
    P: killPlayer,
    Q: killObject,
    R: killObjects,
    S: updateItemCounts,
    T: updateAge,
    U: updateUpgrades,
    V: updateItems,
    X: addProjectile,
    2: allianceNotification,
    3: setPlayerTeam,
    4: setAlliancePlayers,
    5: updateStoreItems,
    6: receiveChat,
    7: updateMinimap,
    8: showText,
    9: pingMap,
    0: pingSocketResponse
  };
  if (v134 == "io-init") {
    socketID = v132[0];
  } else if (v135[v134]) {
    v135[v134].apply(undefined, v132);
  }
}
Math.lerpAngle = function (p170, p171, p172) {
  let v136 = Math.abs(p171 - p170);
  if (v136 > Math.PI) {
    if (p170 > p171) {
      p171 += Math.PI * 2;
    } else {
      p170 += Math.PI * 2;
    }
  }
  let v137 = p171 + (p170 - p171) * p172;
  if (v137 >= 0 && v137 <= Math.PI * 2) {
    return v137;
  }
  return v137 % (Math.PI * 2);
};
CanvasRenderingContext2D.prototype.roundRect = function (p173, p174, p175, p176, p177) {
  if (p175 < p177 * 2) {
    p177 = p175 / 2;
  }
  if (p176 < p177 * 2) {
    p177 = p176 / 2;
  }
  if (p177 < 0) {
    p177 = 0;
  }
  this.beginPath();
  this.moveTo(p173 + p177, p174);
  this.arcTo(p173 + p175, p174, p173 + p175, p174 + p176, p177);
  this.arcTo(p173 + p175, p174 + p176, p173, p174 + p176, p177);
  this.arcTo(p173, p174 + p176, p173, p174, p177);
  this.arcTo(p173, p174, p173 + p175, p174, p177);
  this.closePath();
  return this;
};
function resetMoveDir() {
  keys = {};
  io.send("e");
}
let allChats = [];
let ticks = {
  tick: 0,
  delay: 0,
  time: [],
  manage: []
};
let ais = [];
let players = [];
let alliances = [];
let alliancePlayers = [];
let allianceNotifications = [];
let gameObjects = [];
let liztobj = [];
let projectiles = [];
let deadPlayers = [];
let breakObjects = [];
let player;
let playerSID;
let tmpObj;
let enemy = [];
let nears = [];
let near = [];
let my = {
  reloaded: false,
  waitHit: 0,
  autoAim: false,
  revAim: false,
  ageInsta: true,
  reSync: false,
  bullTick: 0,
  anti0Tick: 0,
  antiSync: false,
  safePrimary: function (p178) {
    return [0, 8].includes(p178.primaryIndex);
  },
  safeSecondary: function (p179) {
    return [10, 11, 14].includes(p179.secondaryIndex);
  },
  lastDir: 0,
  autoPush: false,
  pushData: {}
};
function findID(p180, p181) {
  return p180.find(p182 => p182.id == p181);
}
function findSID(p183, p184) {
  return p183.find(p185 => p185.sid == p184);
}
function findPlayerByID(p186) {
  return findID(players, p186);
}
function findPlayerBySID(p187) {
  return findSID(players, p187);
}
function findAIBySID(p188) {
  return findSID(ais, p188);
}
function findObjectBySid(p189) {
  return findSID(gameObjects, p189);
}
function findProjectileBySid(p190) {
  return findSID(gameObjects, p190);
}
let adCard = getEl("adCard");
adCard.remove();
let promoImageHolder = getEl("promoImgHolder");
promoImageHolder.remove();
let chatButton = getEl("chatButton");
chatButton.remove();
let gameCanvas = getEl("gameCanvas");
let mainContext = gameCanvas.getContext("2d");
$("#mapDisplay").css("background", "url('https://wormax.org/chrome3kafa/moomooio-background.png')");
let mapContext = mapDisplay.getContext("2d");
mapDisplay.width = 300;
mapDisplay.height = 300;
let storeMenu = getEl("storeMenu");
let storeHolder = getEl("storeHolder");
let upgradeHolder = getEl("upgradeHolder");
let upgradeCounter = getEl("upgradeCounter");
let chatBox = getEl("chatBox");
let chatHolder = getEl("chatHolder");
let actionBar = getEl("actionBar");
let leaderboardData = getEl("leaderboardData");
let itemInfoHolder = getEl("itemInfoHolder");
let menuCardHolder = getEl("menuCardHolder");
let mainMenu = getEl("mainMenu");
let diedText = getEl("diedText");
let screenWidth;
let screenHeight;
let maxScreenWidth = config.maxScreenWidth;
let maxScreenHeight = config.maxScreenHeight;
let pixelDensity = 1;
let delta;
let now;
let lastUpdate = performance.now();
let camX;
let camY;
let tmpDir;
let mouseX = 0;
let mouseY = 0;
let allianceMenu = getEl("allianceMenu");
let waterMult = 1;
let waterPlus = 0;
let outlineColor = "#525252";
let darkOutlineColor = "#3d3f42";
let outlineWidth = 5.5;
let firstSetup = true;
let keys = {};
let moveKeys = {
  87: [0, -1],
  38: [0, -1],
  83: [0, 1],
  40: [0, 1],
  65: [-1, 0],
  37: [-1, 0],
  68: [1, 0],
  39: [1, 0]
};
let attackState = 0;
let inGame = false;
let macro = {};
let pads = {
  placeSpawnPads: 0
};
let lastDir;
let lastLeaderboardData = [];
let inWindow = true;
window.onblur = function () {
  inWindow = false;
};
window.onfocus = function () {
  inWindow = true;
  if (player && player.alive) {}
};
let ms = {
  avg: 0,
  max: 0,
  min: 0,
  delay: 0
};
function pingSocketResponse() {
  let v138 = Math.ceil(window.pingTime * 2.6);
  let v139 = window.pingTime;
  const v140 = document.getElementById("pingDisplay");
  v140.innerText = "";
  if (v139 > ms.max || isNaN(ms.max)) {
    ms.max = v139;
  }
  if (v139 < ms.min || isNaN(ms.min)) {
    ms.min = v139;
  }
}
let placeVisible = [];
let preplaceVisible = [];
class Utils {
  constructor() {
    let v141 = Math.abs;
    let v142 = Math.cos;
    let v143 = Math.sin;
    let v144 = Math.pow;
    let v145 = Math.sqrt;
    let v146 = Math.atan2;
    let v147 = Math.PI;
    let vThis = this;
    this.round = function (p191, p192) {
      return Math.round(p191 * p192) / p192;
    };
    this.toRad = function (p193) {
      return p193 * (v147 / 180);
    };
    this.toAng = function (p194) {
      return p194 / (v147 / 180);
    };
    this.randInt = function (p195, p196) {
      return Math.floor(Math.random() * (p196 - p195 + 1)) + p195;
    };
    this.randFloat = function (p197, p198) {
      return Math.random() * (p198 - p197 + 1) + p197;
    };
    this.lerp = function (p199, p200, p201) {
      return p199 + (p200 - p199) * p201;
    };
    this.decel = function (p202, p203) {
      if (p202 > 0) {
        p202 = Math.max(0, p202 - p203);
      } else if (p202 < 0) {
        p202 = Math.min(0, p202 + p203);
      }
      return p202;
    };
    this.getDistance = function (p204, p205, p206, p207) {
      return v145((p206 -= p204) * p206 + (p207 -= p205) * p207);
    };
    this.getDist = function (p208, p209, p210, p211) {
      let v148 = {
        x: p210 == 0 ? p208.x : p210 == 1 ? p208.x1 : p210 == 2 ? p208.x2 : p210 == 3 && p208.x3,
        y: p210 == 0 ? p208.y : p210 == 1 ? p208.y1 : p210 == 2 ? p208.y2 : p210 == 3 && p208.y3
      };
      let v149 = {
        x: p211 == 0 ? p209.x : p211 == 1 ? p209.x1 : p211 == 2 ? p209.x2 : p211 == 3 && p209.x3,
        y: p211 == 0 ? p209.y : p211 == 1 ? p209.y1 : p211 == 2 ? p209.y2 : p211 == 3 && p209.y3
      };
      return v145((v149.x -= v148.x) * v149.x + (v149.y -= v148.y) * v149.y);
    };
    this.getDirection = function (p212, p213, p214, p215) {
      return v146(p213 - p215, p212 - p214);
    };
    this.getDirect = function (p216, p217, p218, p219) {
      let v150 = {
        x: p218 == 0 ? p216.x : p218 == 1 ? p216.x1 : p218 == 2 ? p216.x2 : p218 == 3 && p216.x3,
        y: p218 == 0 ? p216.y : p218 == 1 ? p216.y1 : p218 == 2 ? p216.y2 : p218 == 3 && p216.y3
      };
      let v151 = {
        x: p219 == 0 ? p217.x : p219 == 1 ? p217.x1 : p219 == 2 ? p217.x2 : p219 == 3 && p217.x3,
        y: p219 == 0 ? p217.y : p219 == 1 ? p217.y1 : p219 == 2 ? p217.y2 : p219 == 3 && p217.y3
      };
      return v146(v150.y - v151.y, v150.x - v151.x);
    };
    this.getAngleDist = function (p220, p221) {
      let v152 = v141(p221 - p220) % (v147 * 2);
      if (v152 > v147) {
        return v147 * 2 - v152;
      } else {
        return v152;
      }
    };
    this.isNumber = function (p222) {
      return typeof p222 == "number" && !isNaN(p222) && isFinite(p222);
    };
    this.isString = function (p223) {
      return p223 && typeof p223 == "string";
    };
    this.kFormat = function (p224) {
      if (p224 > 999) {
        return (p224 / 1000).toFixed(1) + "k";
      } else {
        return p224;
      }
    };
    this.sFormat = function (p225) {
      let v153 = [{
        num: 1000,
        string: "k"
      }, {
        num: 1000000,
        string: "m"
      }, {
        num: 1000000000,
        string: "b"
      }, {
        num: 1000000000000,
        string: "q"
      }].reverse();
      let v154 = v153.find(p226 => p225 >= p226.num);
      if (!v154) {
        return p225;
      }
      return (p225 / v154.num).toFixed(1) + v154.string;
    };
    this.capitalizeFirst = function (p227) {
      return p227.charAt(0).toUpperCase() + p227.slice(1);
    };
    this.fixTo = function (p228, p229) {
      return parseFloat(p228.toFixed(p229));
    };
    this.sortByPoints = function (p230, p231) {
      return parseFloat(p231.points) - parseFloat(p230.points);
    };
    this.lineInRect = function (p232, p233, p234, p235, p236, p237, p238, p239) {
      let vP236 = p236;
      let vP238 = p238;
      if (p236 > p238) {
        vP236 = p238;
        vP238 = p236;
      }
      if (vP238 > p234) {
        vP238 = p234;
      }
      if (vP236 < p232) {
        vP236 = p232;
      }
      if (vP236 > vP238) {
        return false;
      }
      let vP237 = p237;
      let vP239 = p239;
      let v155 = p238 - p236;
      if (Math.abs(v155) > 1e-7) {
        let v156 = (p239 - p237) / v155;
        let v157 = p237 - v156 * p236;
        vP237 = v156 * vP236 + v157;
        vP239 = v156 * vP238 + v157;
      }
      if (vP237 > vP239) {
        let vVP239 = vP239;
        vP239 = vP237;
        vP237 = vVP239;
      }
      if (vP239 > p235) {
        vP239 = p235;
      }
      if (vP237 < p233) {
        vP237 = p233;
      }
      if (vP237 > vP239) {
        return false;
      }
      return true;
    };
    this.containsPoint = function (p240, p241, p242) {
      let v158 = p240.getBoundingClientRect();
      let v159 = v158.left + window.scrollX;
      let v160 = v158.top + window.scrollY;
      let v161 = v158.width;
      let v162 = v158.height;
      let v163 = p241 > v159 && p241 < v159 + v161;
      let v164 = p242 > v160 && p242 < v160 + v162;
      return v163 && v164;
    };
    this.mousifyTouchEvent = function (p243) {
      let v165 = p243.changedTouches[0];
      p243.screenX = v165.screenX;
      p243.screenY = v165.screenY;
      p243.clientX = v165.clientX;
      p243.clientY = v165.clientY;
      p243.pageX = v165.pageX;
      p243.pageY = v165.pageY;
    };
    this.hookTouchEvents = function (p244, p245) {
      let v166 = !p245;
      let v167 = false;
      let v168 = false;
      p244.addEventListener("touchstart", this.checkTrusted(f12), v168);
      p244.addEventListener("touchmove", this.checkTrusted(f13), v168);
      p244.addEventListener("touchend", this.checkTrusted(f14), v168);
      p244.addEventListener("touchcancel", this.checkTrusted(f14), v168);
      p244.addEventListener("touchleave", this.checkTrusted(f14), v168);
      function f12(p246) {
        vThis.mousifyTouchEvent(p246);
        window.setUsingTouch(true);
        if (v166) {
          p246.preventDefault();
          p246.stopPropagation();
        }
        if (p244.onmouseover) {
          p244.onmouseover(p246);
        }
        v167 = true;
      }
      function f13(p247) {
        vThis.mousifyTouchEvent(p247);
        window.setUsingTouch(true);
        if (v166) {
          p247.preventDefault();
          p247.stopPropagation();
        }
        if (vThis.containsPoint(p244, p247.pageX, p247.pageY)) {
          if (!v167) {
            if (p244.onmouseover) {
              p244.onmouseover(p247);
            }
            v167 = true;
          }
        } else if (v167) {
          if (p244.onmouseout) {
            p244.onmouseout(p247);
          }
          v167 = false;
        }
      }
      function f14(p248) {
        vThis.mousifyTouchEvent(p248);
        window.setUsingTouch(true);
        if (v166) {
          p248.preventDefault();
          p248.stopPropagation();
        }
        if (v167) {
          if (p244.onclick) {
            p244.onclick(p248);
          }
          if (p244.onmouseout) {
            p244.onmouseout(p248);
          }
          v167 = false;
        }
      }
    };
    this.removeAllChildren = function (p249) {
      while (p249.hasChildNodes()) {
        p249.removeChild(p249.lastChild);
      }
    };
    this.generateElement = function (p250) {
      let v169 = document.createElement(p250.tag || "div");
      function f15(p251, p252) {
        if (p250[p251]) {
          v169[p252] = p250[p251];
        }
      }
      f15("text", "textContent");
      f15("html", "innerHTML");
      f15("class", "className");
      for (let v170 in p250) {
        switch (v170) {
          case "tag":
          case "text":
          case "html":
          case "class":
          case "style":
          case "hookTouch":
          case "parent":
          case "children":
            continue;
          default:
            break;
        }
        v169[v170] = p250[v170];
      }
      if (v169.onclick) {
        v169.onclick = this.checkTrusted(v169.onclick);
      }
      if (v169.onmouseover) {
        v169.onmouseover = this.checkTrusted(v169.onmouseover);
      }
      if (v169.onmouseout) {
        v169.onmouseout = this.checkTrusted(v169.onmouseout);
      }
      if (p250.style) {
        v169.style.cssText = p250.style;
      }
      if (p250.hookTouch) {
        this.hookTouchEvents(v169);
      }
      if (p250.parent) {
        p250.parent.appendChild(v169);
      }
      if (p250.children) {
        for (let v171 = 0; v171 < p250.children.length; v171++) {
          v169.appendChild(p250.children[v171]);
        }
      }
      return v169;
    };
    this.checkTrusted = function (p253) {
      return function (p254) {
        if (p254 && p254 instanceof Event && (p254 && typeof p254.isTrusted == "boolean" ? p254.isTrusted : true)) {
          p253(p254);
        } else {}
      };
    };
    this.randomString = function (p255) {
      let v172 = "";
      let v173 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let v174 = 0; v174 < p255; v174++) {
        v172 += v173.charAt(Math.floor(Math.random() * v173.length));
      }
      return v172;
    };
    this.countInArray = function (p256, p257) {
      let v175 = 0;
      for (let v176 = 0; v176 < p256.length; v176++) {
        if (p256[v176] === p257) {
          v175++;
        }
      }
      return v175;
    };
    this.hexToRgb = function (p258) {
      return p258.slice(1).match(/.{1,2}/g).map(p259 => parseInt(p259, 16));
    };
    this.getRgb = function (p260, p261, p262) {
      return [p260 / 255, p261 / 255, p262 / 255].join(", ");
    };
  }
}
;
class Animtext {
  constructor() {
    this.init = function (p263, p264, p265, p266, p267, p268, p269) {
      this.x = p263;
      this.y = p264;
      this.color = p269;
      this.scale = p265;
      this.startScale = this.scale;
      this.maxScale = p265 * 1.5;
      this.scaleSpeed = 0.7;
      this.speed = p266;
      this.life = p267;
      this.text = p268;
    };
    this.update = function (p270) {
      if (this.life) {
        this.life -= p270;
        this.y -= this.speed * p270;
        this.scale += this.scaleSpeed * p270;
        if (this.scale >= this.maxScale) {
          this.scale = this.maxScale;
          this.scaleSpeed *= -1;
        } else if (this.scale <= this.startScale) {
          this.scale = this.startScale;
          this.scaleSpeed = 0;
        }
        if (this.life <= 0) {
          this.life = 0;
        }
      }
    };
    this.render = function (p271, p272, p273) {
      p271.fillStyle = this.color;
      if (getEl("font").checked) {
        p271.font = this.scale + "px Lilita One";
      } else {
        p271.font = this.scale + "px Hammersmith One";
      }
      p271.fillText(this.text, this.x - p272, this.y - p273);
    };
  }
}
;
class Textmanager {
  constructor() {
    this.texts = [];
    this.stack = [];
    this.update = function (p274, p275, p276, p277) {
      p275.textBaseline = "middle";
      p275.textAlign = "center";
      for (let v177 = 0; v177 < this.texts.length; ++v177) {
        if (this.texts[v177].life) {
          this.texts[v177].update(p274);
          this.texts[v177].render(p275, p276, p277);
        }
      }
    };
    this.showText = function (p278, p279, p280, p281, p282, p283, p284) {
      let v178;
      for (let v179 = 0; v179 < this.texts.length; ++v179) {
        if (!this.texts[v179].life) {
          v178 = this.texts[v179];
          break;
        }
      }
      if (!v178) {
        v178 = new Animtext();
        this.texts.push(v178);
      }
      v178.init(p278, p279, p280, p281, p282, p283, p284);
    };
  }
}
class GameObject {
  constructor(p285) {
    this.sid = p285;
    this.init = function (p286, p287, p288, p289, p290, p291, p292) {
      p291 = p291 || {};
      this.sentTo = {};
      this.gridLocations = [];
      this.active = true;
      this.render = true;
      this.doUpdate = p291.doUpdate;
      this.x = p286;
      this.y = p287;
      this.dir = p288 + Math.PI;
      this.lastDir = p288;
      this.xWiggle = 0;
      this.yWiggle = 0;
      this.visScale = p289;
      this.scale = p289;
      this.type = p290;
      this.id = p291.id;
      this.owner = p292;
      this.name = p291.name;
      this.isItem = this.id != undefined;
      this.group = p291.group;
      this.maxHealth = p291.health;
      this.health = this.maxHealth;
      this.layer = 2;
      if (this.group != undefined) {
        this.layer = this.group.layer;
      } else if (this.type == 0) {
        this.layer = 3;
      } else if (this.type == 2) {
        this.layer = 0;
      } else if (this.type == 4) {
        this.layer = -1;
      }
      this.colDiv = p291.colDiv || 1;
      this.blocker = p291.blocker;
      this.ignoreCollision = p291.ignoreCollision;
      this.dontGather = p291.dontGather;
      this.hideFromEnemy = p291.hideFromEnemy;
      this.friction = p291.friction;
      this.projDmg = p291.projDmg;
      this.dmg = p291.dmg;
      this.pDmg = p291.pDmg;
      this.pps = p291.pps;
      this.zIndex = p291.zIndex || 0;
      this.turnSpeed = p291.turnSpeed;
      this.req = p291.req;
      this.trap = p291.trap;
      this.healCol = p291.healCol;
      this.teleport = p291.teleport;
      this.boostSpeed = p291.boostSpeed;
      this.projectile = p291.projectile;
      this.shootRange = p291.shootRange;
      this.shootRate = p291.shootRate;
      this.shootCount = this.shootRate;
      this.spawnPoint = p291.spawnPoint;
      this.onNear = 0;
      this.breakObj = false;
      this.alpha = p291.alpha || 1;
      this.maxAlpha = p291.alpha || 1;
      this.damaged = 0;
    };
    this.changeHealth = function (p293, p294) {
      this.health += p293;
      return this.health <= 0;
    };
    this.getScale = function (p295, p296) {
      p295 = p295 || 1;
      return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : p295 * 0.6) * (p296 ? 1 : this.colDiv);
    };
    this.visibleToPlayer = function (p297) {
      return !this.hideFromEnemy || this.owner && (this.owner == p297 || this.owner.team && p297.team == this.owner.team);
    };
    this.update = function (p298) {
      if (this.health != this.healthMov) {
        if (this.health < this.healthMov) {
          this.healthMov -= 1.9;
        } else {
          this.healthMov += 1.9;
        }
        if (Math.abs(this.health - this.healthMov) < 1.9) {
          this.healthMov = this.health;
        }
      }
      ;
      if (this.active) {
        if (this.xWiggle) {
          this.xWiggle *= Math.pow(0.99, p298);
        }
        if (this.yWiggle) {
          this.yWiggle *= Math.pow(0.99, p298);
        }
        if (config.anotherVisualTurn) {
          let v180 = UTILS.getAngleDist(this.lastDir, this.dir);
          if (v180 > 0.01) {
            this.dir += v180 / 5;
          } else {
            this.dir = this.lastDir;
          }
        } else if (this.turnSpeed) {
          this.dir += this.turnSpeed * p298;
        }
      } else if (this.alive) {
        this.alpha -= p298 / (200 / this.maxAlpha);
        this.visScale += p298 / (this.scale / 2.5);
        if (this.alpha <= 0) {
          this.alpha = 0;
          this.alive = false;
        }
      }
    };
    this.isTeamObject = function (p299) {
      if (this.owner == null) {
        return true;
      } else {
        return this.owner && p299.sid == this.owner.sid || p299.findAllianceBySid(this.owner.sid);
      }
    };
  }
}
class Items {
  constructor() {
    this.groups = [{
      id: 0,
      name: "food",
      layer: 0
    }, {
      id: 1,
      name: "walls",
      place: true,
      limit: 30,
      layer: 0
    }, {
      id: 2,
      name: "spikes",
      place: true,
      limit: 15,
      layer: 0
    }, {
      id: 3,
      name: "mill",
      place: true,
      limit: 7,
      layer: 1
    }, {
      id: 4,
      name: "mine",
      place: true,
      limit: 1,
      layer: 0
    }, {
      id: 5,
      name: "trap",
      place: true,
      limit: 6,
      layer: -1
    }, {
      id: 6,
      name: "booster",
      place: true,
      limit: 12,
      layer: -1
    }, {
      id: 7,
      name: "turret",
      place: true,
      limit: 2,
      layer: 1
    }, {
      id: 8,
      name: "watchtower",
      place: true,
      limit: 12,
      layer: 1
    }, {
      id: 9,
      name: "buff",
      place: true,
      limit: 4,
      layer: -1
    }, {
      id: 10,
      name: "spawn",
      place: true,
      limit: 1,
      layer: -1
    }, {
      id: 11,
      name: "sapling",
      place: true,
      limit: 2,
      layer: 0
    }, {
      id: 12,
      name: "blocker",
      place: true,
      limit: 3,
      layer: -1
    }, {
      id: 13,
      name: "teleporter",
      place: true,
      limit: 2,
      layer: -1
    }];
    this.projectiles = [{
      indx: 0,
      layer: 0,
      src: "arrow_1",
      dmg: 25,
      speed: 1.6,
      scale: 103,
      range: 1000
    }, {
      indx: 1,
      layer: 1,
      dmg: 25,
      scale: 20
    }, {
      indx: 0,
      layer: 0,
      src: "arrow_1",
      dmg: 35,
      speed: 2.5,
      scale: 103,
      range: 1200
    }, {
      indx: 0,
      layer: 0,
      src: "arrow_1",
      dmg: 30,
      speed: 2,
      scale: 103,
      range: 1200
    }, {
      indx: 1,
      layer: 1,
      dmg: 16,
      scale: 20
    }, {
      indx: 0,
      layer: 0,
      src: "bullet_1",
      dmg: 50,
      speed: 3.6,
      scale: 160,
      range: 1400
    }];
    this.weapons = [{
      id: 0,
      type: 0,
      name: "tool hammer",
      desc: "tool for gathering all resources",
      src: "hammer_1",
      length: 140,
      width: 140,
      xOff: -3,
      yOff: 18,
      dmg: 25,
      range: 65,
      gather: 1,
      speed: 300
    }, {
      id: 1,
      type: 0,
      age: 2,
      name: "hand axe",
      desc: "gathers resources at a higher rate",
      src: "axe_1",
      length: 140,
      width: 140,
      xOff: 3,
      yOff: 24,
      dmg: 30,
      spdMult: 1,
      range: 70,
      gather: 2,
      speed: 400
    }, {
      id: 2,
      type: 0,
      age: 8,
      pre: 1,
      name: "great axe",
      desc: "deal more damage and gather more resources",
      src: "great_axe_1",
      length: 140,
      width: 140,
      xOff: -8,
      yOff: 25,
      dmg: 35,
      spdMult: 1,
      range: 75,
      gather: 4,
      speed: 400
    }, {
      id: 3,
      type: 0,
      age: 2,
      name: "short sword",
      desc: "increased attack power but slower move speed",
      src: "sword_1",
      iPad: 1.3,
      length: 130,
      width: 210,
      xOff: -8,
      yOff: 46,
      dmg: 35,
      spdMult: 0.85,
      range: 110,
      gather: 1,
      speed: 300
    }, {
      id: 4,
      type: 0,
      age: 8,
      pre: 3,
      name: "katana",
      desc: "greater range and damage",
      src: "samurai_1",
      iPad: 1.3,
      length: 130,
      width: 210,
      xOff: -8,
      yOff: 59,
      dmg: 40,
      spdMult: 0.8,
      range: 118,
      gather: 1,
      speed: 300
    }, {
      id: 5,
      type: 0,
      age: 2,
      name: "polearm",
      desc: "long range melee weapon",
      src: "spear_1",
      iPad: 1.3,
      length: 130,
      width: 210,
      xOff: -8,
      yOff: 53,
      dmg: 45,
      knock: 0.2,
      spdMult: 0.82,
      range: 142,
      gather: 1,
      speed: 700
    }, {
      id: 6,
      type: 0,
      age: 2,
      name: "bat",
      desc: "fast long range melee weapon",
      src: "bat_1",
      iPad: 1.3,
      length: 110,
      width: 180,
      xOff: -8,
      yOff: 53,
      dmg: 20,
      knock: 0.7,
      range: 110,
      gather: 1,
      speed: 300
    }, {
      id: 7,
      type: 0,
      age: 2,
      name: "daggers",
      desc: "really fast short range weapon",
      src: "dagger_1",
      iPad: 0.8,
      length: 110,
      width: 110,
      xOff: 18,
      yOff: 0,
      dmg: 20,
      knock: 0.1,
      range: 65,
      gather: 1,
      hitSlow: 0.1,
      spdMult: 1.13,
      speed: 100
    }, {
      id: 8,
      type: 0,
      age: 2,
      name: "stick",
      desc: "great for gathering but very weak",
      src: "stick_1",
      length: 140,
      width: 140,
      xOff: 3,
      yOff: 24,
      dmg: 1,
      spdMult: 1,
      range: 70,
      gather: 7,
      speed: 400
    }, {
      id: 9,
      type: 1,
      age: 6,
      name: "hunting bow",
      desc: "bow used for ranged combat and hunting",
      src: "bow_1",
      req: ["wood", 4],
      length: 120,
      width: 120,
      xOff: -6,
      yOff: 0,
      Pdmg: 25,
      projectile: 0,
      spdMult: 0.75,
      speed: 600
    }, {
      id: 10,
      type: 1,
      age: 6,
      name: "great hammer",
      desc: "hammer used for destroying structures",
      src: "great_hammer_1",
      length: 140,
      width: 140,
      xOff: -9,
      yOff: 25,
      dmg: 10,
      Pdmg: 10,
      spdMult: 0.88,
      range: 75,
      sDmg: 7.5,
      gather: 1,
      speed: 400
    }, {
      id: 11,
      type: 1,
      age: 6,
      name: "wooden shield",
      desc: "blocks projectiles and reduces melee damage",
      src: "shield_1",
      length: 120,
      width: 120,
      shield: 0.2,
      xOff: 6,
      yOff: 0,
      Pdmg: 0,
      spdMult: 0.7
    }, {
      id: 12,
      type: 1,
      age: 8,
      pre: 9,
      name: "crossbow",
      desc: "deals more damage and has greater range",
      src: "crossbow_1",
      req: ["wood", 5],
      aboveHand: true,
      armS: 0.75,
      length: 120,
      width: 120,
      xOff: -4,
      yOff: 0,
      Pdmg: 35,
      projectile: 2,
      spdMult: 0.7,
      speed: 700
    }, {
      id: 13,
      type: 1,
      age: 9,
      pre: 12,
      name: "repeater crossbow",
      desc: "high firerate crossbow with reduced damage",
      src: "crossbow_2",
      req: ["wood", 10],
      aboveHand: true,
      armS: 0.75,
      length: 120,
      width: 120,
      xOff: -4,
      yOff: 0,
      Pdmg: 30,
      projectile: 3,
      spdMult: 0.7,
      speed: 230
    }, {
      id: 14,
      type: 1,
      age: 6,
      name: "mc grabby",
      desc: "steals resources from enemies",
      src: "grab_1",
      length: 130,
      width: 210,
      xOff: -8,
      yOff: 53,
      dmg: 0,
      Pdmg: 0,
      steal: 250,
      knock: 0.2,
      spdMult: 1.05,
      range: 125,
      gather: 0,
      speed: 700
    }, {
      id: 15,
      type: 1,
      age: 9,
      pre: 12,
      name: "musket",
      desc: "slow firerate but high damage and range",
      src: "musket_1",
      req: ["stone", 10],
      aboveHand: true,
      rec: 0.35,
      armS: 0.6,
      hndS: 0.3,
      hndD: 1.6,
      length: 205,
      width: 205,
      xOff: 25,
      yOff: 0,
      Pdmg: 50,
      projectile: 5,
      hideProjectile: true,
      spdMult: 0.6,
      speed: 1500
    }];
    this.list = [{
      group: this.groups[0],
      name: "apple",
      desc: "restores 20 health when consumed",
      req: ["food", 10],
      consume: function (p300) {
        return p300.changeHealth(20, p300);
      },
      scale: 22,
      holdOffset: 15,
      healing: 20,
      itemID: 0,
      itemAID: 16
    }, {
      age: 3,
      group: this.groups[0],
      name: "cookie",
      desc: "restores 40 health when consumed",
      req: ["food", 15],
      consume: function (p301) {
        return p301.changeHealth(40, p301);
      },
      scale: 27,
      holdOffset: 15,
      healing: 40,
      itemID: 1,
      itemAID: 17
    }, {
      age: 7,
      group: this.groups[0],
      name: "cheese",
      desc: "restores 30 health and another 50 over 5 seconds",
      req: ["food", 25],
      consume: function (p302) {
        if (p302.changeHealth(30, p302) || p302.health < 100) {
          p302.dmgOverTime.dmg = -10;
          p302.dmgOverTime.doer = p302;
          p302.dmgOverTime.time = 5;
          return true;
        }
        return false;
      },
      scale: 27,
      holdOffset: 15,
      healing: 30,
      itemID: 2,
      itemAID: 18
    }, {
      group: this.groups[1],
      name: "wood wall",
      desc: "provides protection for your village",
      req: ["wood", 10],
      projDmg: true,
      health: 380,
      scale: 50,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 3,
      itemAID: 19
    }, {
      age: 3,
      group: this.groups[1],
      name: "stone wall",
      desc: "provides improved protection for your village",
      req: ["stone", 25],
      health: 900,
      scale: 50,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 4,
      itemAID: 20
    }, {
      age: 7,
      group: this.groups[1],
      name: "castle wall",
      desc: "provides powerful protection for your village",
      req: ["stone", 35],
      health: 1500,
      scale: 52,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 5,
      itemAID: 21
    }, {
      group: this.groups[2],
      name: "spikes",
      desc: "damages enemies when they touch them",
      req: ["wood", 20, "stone", 5],
      health: 400,
      dmg: 20,
      scale: 49,
      spritePadding: -23,
      holdOffset: 8,
      placeOffset: -5,
      itemID: 6,
      itemAID: 22
    }, {
      age: 5,
      group: this.groups[2],
      name: "greater spikes",
      desc: "damages enemies when they touch them",
      req: ["wood", 30, "stone", 10],
      health: 500,
      dmg: 35,
      scale: 52,
      spritePadding: -23,
      holdOffset: 8,
      placeOffset: -5,
      itemID: 7,
      itemAID: 23
    }, {
      age: 9,
      group: this.groups[2],
      name: "poison spikes",
      desc: "poisons enemies when they touch them",
      req: ["wood", 35, "stone", 15],
      health: 600,
      dmg: 30,
      pDmg: 5,
      scale: 52,
      spritePadding: -23,
      holdOffset: 8,
      placeOffset: -5,
      itemID: 8,
      itemAID: 24
    }, {
      age: 9,
      group: this.groups[2],
      name: "spinning spikes",
      desc: "damages enemies when they touch them",
      req: ["wood", 30, "stone", 20],
      health: 500,
      dmg: 45,
      turnSpeed: 0.001,
      scale: 52,
      spritePadding: -23,
      holdOffset: 8,
      placeOffset: -5,
      itemID: 9,
      itemAID: 25
    }, {
      group: this.groups[3],
      name: "windmill",
      desc: "generates gold over time",
      req: ["wood", 50, "stone", 10],
      health: 400,
      pps: 1,
      turnSpeed: 0,
      spritePadding: 25,
      iconLineMult: 12,
      scale: 45,
      holdOffset: 20,
      placeOffset: 5,
      itemID: 10,
      itemAID: 26
    }, {
      age: 5,
      group: this.groups[3],
      name: "faster windmill",
      desc: "generates more gold over time",
      req: ["wood", 60, "stone", 20],
      health: 500,
      pps: 1.5,
      turnSpeed: 0,
      spritePadding: 25,
      iconLineMult: 12,
      scale: 47,
      holdOffset: 20,
      placeOffset: 5,
      itemID: 11,
      itemAID: 27
    }, {
      age: 8,
      group: this.groups[3],
      name: "power mill",
      desc: "generates more gold over time",
      req: ["wood", 100, "stone", 50],
      health: 800,
      pps: 2,
      turnSpeed: 0,
      spritePadding: 25,
      iconLineMult: 12,
      scale: 47,
      holdOffset: 20,
      placeOffset: 5,
      itemID: 12,
      itemAID: 28
    }, {
      age: 5,
      group: this.groups[4],
      type: 2,
      name: "mine",
      desc: "allows you to mine stone",
      req: ["wood", 20, "stone", 100],
      iconLineMult: 12,
      scale: 65,
      holdOffset: 20,
      placeOffset: 0,
      itemID: 13,
      itemAID: 29
    }, {
      age: 5,
      group: this.groups[11],
      type: 0,
      name: "sapling",
      desc: "allows you to farm wood",
      req: ["wood", 150],
      iconLineMult: 12,
      colDiv: 0.5,
      scale: 110,
      holdOffset: 50,
      placeOffset: -15,
      itemID: 14,
      itemAID: 30
    }, {
      age: 4,
      group: this.groups[5],
      name: "pit trap",
      desc: "pit that traps enemies if they walk over it",
      req: ["wood", 30, "stone", 30],
      trap: true,
      ignoreCollision: true,
      hideFromEnemy: true,
      health: 500,
      colDiv: 0.2,
      scale: 50,
      holdOffset: 20,
      placeOffset: -5,
      alpha: 0.6,
      itemID: 15,
      itemAID: 31
    }, {
      age: 4,
      group: this.groups[6],
      name: "boost pad",
      desc: "provides boost when stepped on",
      req: ["stone", 20, "wood", 5],
      ignoreCollision: true,
      boostSpeed: 1.5,
      health: 150,
      colDiv: 0.7,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 16,
      itemAID: 32
    }, {
      age: 7,
      group: this.groups[7],
      doUpdate: true,
      name: "turret",
      desc: "defensive structure that shoots at enemies",
      req: ["wood", 200, "stone", 150],
      health: 800,
      projectile: 1,
      shootRange: 700,
      shootRate: 2200,
      scale: 43,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 17,
      itemAID: 33
    }, {
      age: 7,
      group: this.groups[8],
      name: "platform",
      desc: "platform to shoot over walls and cross over water",
      req: ["wood", 20],
      ignoreCollision: true,
      zIndex: 1,
      health: 300,
      scale: 43,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 18,
      itemAID: 34
    }, {
      age: 7,
      group: this.groups[9],
      name: "healing pad",
      desc: "standing on it will slowly heal you",
      req: ["wood", 30, "food", 10],
      ignoreCollision: true,
      healCol: 15,
      health: 400,
      colDiv: 0.7,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 19,
      itemAID: 35
    }, {
      age: 9,
      group: this.groups[10],
      name: "spawn pad",
      desc: "you will spawn here when you die but it will dissapear",
      req: ["wood", 100, "stone", 100],
      health: 400,
      ignoreCollision: true,
      spawnPoint: true,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 20,
      itemAID: 36
    }, {
      age: 7,
      group: this.groups[12],
      name: "blocker",
      desc: "blocks building in radius",
      req: ["wood", 30, "stone", 25],
      ignoreCollision: true,
      blocker: 300,
      health: 400,
      colDiv: 0.7,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 21,
      itemAID: 37
    }, {
      age: 7,
      group: this.groups[13],
      name: "teleporter",
      desc: "teleports you to a random point on the map",
      req: ["wood", 60, "stone", 60],
      ignoreCollision: true,
      teleport: true,
      health: 200,
      colDiv: 0.7,
      scale: 45,
      holdOffset: 20,
      placeOffset: -5,
      itemID: 22,
      itemAID: 38
    }];
    this.checkItem = {
      index: function (p303, p304) {
        if ([0, 1, 2].includes(p303)) {
          return 0;
        } else if ([3, 4, 5].includes(p303)) {
          return 1;
        } else if ([6, 7, 8, 9].includes(p303)) {
          return 2;
        } else if ([10, 11, 12].includes(p303)) {
          return 3;
        } else if ([13, 14].includes(p303)) {
          return 5;
        } else if ([15, 16].includes(p303)) {
          return 4;
        } else if ([17, 18, 19, 21, 22].includes(p303)) {
          if ([13, 14].includes(p304)) {
            return 6;
          } else {
            return 5;
          }
        } else if (p303 == 20) {
          if ([13, 14].includes(p304)) {
            return 7;
          } else {
            return 6;
          }
        } else {
          return undefined;
        }
      }
    };
    for (let v181 = 0; v181 < this.list.length; ++v181) {
      this.list[v181].id = v181;
      if (this.list[v181].pre) {
        this.list[v181].pre = v181 - this.list[v181].pre;
      }
    }
    if (typeof window !== "undefined") {
      function f16(p305) {
        for (let v182 = p305.length - 1; v182 > 0; v182--) {
          const v183 = Math.floor(Math.random() * (v182 + 1));
          [p305[v182], p305[v183]] = [p305[v183], p305[v182]];
        }
        return p305;
      }
    }
  }
}
class Objectmanager {
  constructor(p306, p307, p308, p309, p310, p311) {
    let v184 = Math.floor;
    let v185 = Math.abs;
    let v186 = Math.cos;
    let v187 = Math.sin;
    let v188 = Math.pow;
    let v189 = Math.sqrt;
    this.ignoreAdd = false;
    this.hitObj = [];
    this.disableObj = function (p312) {
      p312.active = false;
    };
    let v190;
    this.add = function (p313, p314, p315, p316, p317, p318, p319, p320, p321) {
      v190 = findObjectBySid(p313);
      if (!v190) {
        v190 = gameObjects.find(p322 => !p322.active);
        if (!v190) {
          v190 = new p306(p313);
          gameObjects.push(v190);
        }
      }
      if (p320) {
        v190.sid = p313;
      }
      v190.init(p314, p315, p316, p317, p318, p319, p321);
    };
    this.disableBySid = function (p323) {
      let vFindObjectBySid = findObjectBySid(p323);
      if (vFindObjectBySid) {
        this.disableObj(vFindObjectBySid);
      }
    };
    this.removeAllItems = function (p324, p325) {
      gameObjects.filter(p326 => p326.active && p326.owner && p326.owner.sid == p324).forEach(p327 => this.disableObj(p327));
    };
    this.checkItemLocation = function (p328, p329, p330, p331, p332, p333, p334) {
      let v191 = p307.find(p335 => p335.active && p308.getDistance(p328, p329, p335.x, p335.y) < p330 + (p335.blocker ? p335.blocker : p335.getScale(p331, p335.isItem)));
      if (v191) {
        return false;
      }
      if (!p333 && p332 != 18 && p329 >= p309.mapScale / 2 - p309.riverWidth / 2 && p329 <= p309.mapScale / 2 + p309.riverWidth / 2) {
        return false;
      }
      return true;
    };
    this.customCheckItemLocation = (p336, p337, p338, p339, p340, p341, p342, p343, p344, p345, p346) => {
      let v192 = p344.find(p347 => p347.active && p347.x !== p343.x && p347.y !== p343.y && p347.id !== p343.id && p345.getDistance(p336, p337, p347.x, p347.y) < p338 + (p347.blocker ? p347.blocker : p347.getScale(p339, p347.isItem)));
      if (v192) {
        return false;
      }
      if (!p341 && p340 != 18 && p337 >= p346.mapScale / 2 - p346.riverWidth / 2 && p337 <= p346.mapScale / 2 + p346.riverWidth / 2) {
        return false;
      }
      return true;
    };
  }
}
class Projectile {
  constructor(p348, p349, p350, p351, p352, p353, p354) {
    this.init = function (p355, p356, p357, p358, p359, p360, p361, p362, p363) {
      this.active = true;
      this.tickActive = true;
      this.indx = p355;
      this.x = p356;
      this.y = p357;
      this.x2 = p356;
      this.y2 = p357;
      this.dir = p358;
      this.skipMov = true;
      this.speed = p359;
      this.dmg = p360;
      this.scale = p362;
      this.range = p361;
      this.r2 = p361;
      this.owner = p363;
    };
    this.update = function (p364) {
      if (this.active) {
        let v193 = this.speed * p364;
        if (!this.skipMov) {
          this.x += v193 * Math.cos(this.dir);
          this.y += v193 * Math.sin(this.dir);
          this.range -= v193;
          if (this.range <= 0) {
            this.x += this.range * Math.cos(this.dir);
            this.y += this.range * Math.sin(this.dir);
            v193 = 1;
            this.range = 0;
            this.active = false;
          }
        } else {
          this.skipMov = false;
        }
      }
    };
    this.tickUpdate = function (p365) {
      if (this.tickActive) {
        let v194 = this.speed * p365;
        if (!this.skipMov) {
          this.x2 += v194 * Math.cos(this.dir);
          this.y2 += v194 * Math.sin(this.dir);
          this.r2 -= v194;
          if (this.r2 <= 0) {
            this.x2 += this.r2 * Math.cos(this.dir);
            this.y2 += this.r2 * Math.sin(this.dir);
            v194 = 1;
            this.r2 = 0;
            this.tickActive = false;
          }
        } else {
          this.skipMov = false;
        }
      }
    };
  }
}
;
class Store {
  constructor() {
    this.hats = [{
      id: 45,
      name: "Shame!",
      dontSell: true,
      price: 0,
      scale: 120,
      desc: "hacks are for winners"
    }, {
      id: 51,
      name: "Moo Cap",
      price: 0,
      scale: 120,
      desc: "coolest mooer around"
    }, {
      id: 50,
      name: "Apple Cap",
      price: 0,
      scale: 120,
      desc: "apple farms remembers"
    }, {
      id: 28,
      name: "Moo Head",
      price: 0,
      scale: 120,
      desc: "no effect"
    }, {
      id: 29,
      name: "Pig Head",
      price: 0,
      scale: 120,
      desc: "no effect"
    }, {
      id: 30,
      name: "Fluff Head",
      price: 0,
      scale: 120,
      desc: "no effect"
    }, {
      id: 36,
      name: "Pandou Head",
      price: 0,
      scale: 120,
      desc: "no effect"
    }, {
      id: 37,
      name: "Bear Head",
      price: 0,
      scale: 120,
      desc: "no effect"
    }, {
      id: 38,
      name: "Monkey Head",
      price: 0,
      scale: 120,
      desc: "no effect"
    }, {
      id: 44,
      name: "Polar Head",
      price: 0,
      scale: 120,
      desc: "no effect"
    }, {
      id: 35,
      name: "Fez Hat",
      price: 0,
      scale: 120,
      desc: "no effect"
    }, {
      id: 42,
      name: "Enigma Hat",
      price: 0,
      scale: 120,
      desc: "join the enigma army"
    }, {
      id: 43,
      name: "Blitz Hat",
      price: 0,
      scale: 120,
      desc: "hey everybody i'm blitz"
    }, {
      id: 49,
      name: "Bob XIII Hat",
      price: 0,
      scale: 120,
      desc: "like and subscribe"
    }, {
      id: 57,
      name: "Pumpkin",
      price: 50,
      scale: 120,
      desc: "Spooooky"
    }, {
      id: 8,
      name: "Bummle Hat",
      price: 100,
      scale: 120,
      desc: "no effect"
    }, {
      id: 2,
      name: "Straw Hat",
      price: 500,
      scale: 120,
      desc: "no effect"
    }, {
      id: 15,
      name: "Winter Cap",
      price: 600,
      scale: 120,
      desc: "allows you to move at normal speed in snow",
      coldM: 1
    }, {
      id: 5,
      name: "Cowboy Hat",
      price: 1000,
      scale: 120,
      desc: "no effect"
    }, {
      id: 4,
      name: "Ranger Hat",
      price: 2000,
      scale: 120,
      desc: "no effect"
    }, {
      id: 18,
      name: "Explorer Hat",
      price: 2000,
      scale: 120,
      desc: "no effect"
    }, {
      id: 31,
      name: "Flipper Hat",
      price: 2500,
      scale: 120,
      desc: "have more control while in water",
      watrImm: true
    }, {
      id: 1,
      name: "Marksman Cap",
      price: 3000,
      scale: 120,
      desc: "increases arrow speed and range",
      aMlt: 1.3
    }, {
      id: 10,
      name: "Bush Gear",
      price: 3000,
      scale: 160,
      desc: "allows you to disguise yourself as a bush"
    }, {
      id: 48,
      name: "Halo",
      price: 3000,
      scale: 120,
      desc: "no effect"
    }, {
      id: 6,
      name: "Anti Insta",
      price: 4000,
      scale: 120,
      desc: "reduces damage taken but slows movement",
      spdMult: 0.94,
      dmgMult: 0.75
    }, {
      id: 23,
      name: "Anti Venom Gear",
      price: 4000,
      scale: 120,
      desc: "makes you immune to poison",
      poisonRes: 1
    }, {
      id: 13,
      name: "Medic Gear",
      price: 5000,
      scale: 110,
      desc: "slowly regenerates health over time",
      healthRegen: 3
    }, {
      id: 9,
      name: "Miners Helmet",
      price: 5000,
      scale: 120,
      desc: "earn 1 extra gold per resource",
      extraGold: 1
    }, {
      id: 32,
      name: "Musketeer Hat",
      price: 5000,
      scale: 120,
      desc: "reduces cost of projectiles",
      projCost: 0.5
    }, {
      id: 7,
      name: "Bull Helmet",
      price: 6000,
      scale: 120,
      desc: "increases damage done but drains health",
      healthRegen: -5,
      dmgMultO: 1.5,
      spdMult: 0.96
    }, {
      id: 22,
      name: "Emp Helmet",
      price: 6000,
      scale: 120,
      desc: "turrets won't attack but you move slower",
      antiTurret: 1,
      spdMult: 0.7
    }, {
      id: 12,
      name: "Booster Hat",
      price: 6000,
      scale: 120,
      desc: "increases your movement speed",
      spdMult: 1.16
    }, {
      id: 26,
      name: "Barbarian Armor",
      price: 8000,
      scale: 120,
      desc: "knocks back enemies that attack you",
      dmgK: 0.6
    }, {
      id: 21,
      name: "Plague Mask",
      price: 10000,
      scale: 120,
      desc: "melee attacks deal poison damage",
      poisonDmg: 5,
      poisonTime: 6
    }, {
      id: 46,
      name: "Bull Mask",
      price: 10000,
      scale: 120,
      desc: "bulls won't target you unless you attack them",
      bullRepel: 1
    }, {
      id: 14,
      name: "Windmill Hat",
      topSprite: true,
      price: 10000,
      scale: 120,
      desc: "generates points while worn",
      pps: 1.5
    }, {
      id: 11,
      name: "Spike Gear",
      topSprite: true,
      price: 10000,
      scale: 120,
      desc: "deal damage to players that damage you",
      dmg: 0.45
    }, {
      id: 53,
      name: "Turret Gear",
      topSprite: true,
      price: 10000,
      scale: 120,
      desc: "you become a walking turret",
      turret: {
        proj: 1,
        range: 700,
        rate: 2500
      },
      spdMult: 0.7
    }, {
      id: 20,
      name: "Samurai Armor",
      price: 12000,
      scale: 120,
      desc: "increased attack speed and fire rate",
      atkSpd: 0.78
    }, {
      id: 58,
      name: "Dark Knight",
      price: 12000,
      scale: 120,
      desc: "restores health when you deal damage",
      healD: 0.4
    }, {
      id: 27,
      name: "Scavenger Gear",
      price: 15000,
      scale: 120,
      desc: "earn double points for each kill",
      kScrM: 2
    }, {
      id: 40,
      name: "Tank Gear",
      price: 15000,
      scale: 120,
      desc: "increased damage to buildings but slower movement",
      spdMult: 0.3,
      bDmg: 3.3
    }, {
      id: 52,
      name: "Thief Gear",
      price: 15000,
      scale: 120,
      desc: "steal half of a players gold when you kill them",
      goldSteal: 0.5
    }, {
      id: 55,
      name: "Bloodthirster",
      price: 20000,
      scale: 120,
      desc: "Restore Health when dealing damage. And increased damage",
      healD: 0.25,
      dmgMultO: 1.2
    }, {
      id: 56,
      name: "Assassin Gear",
      price: 20000,
      scale: 120,
      desc: "Go invisible when not moving. Can't eat. Increased speed",
      noEat: true,
      spdMult: 1.1,
      invisTimer: 1000
    }];
    this.accessories = [{
      id: 12,
      name: "Snowball",
      price: 1000,
      scale: 105,
      xOff: 18,
      desc: "no effect"
    }, {
      id: 9,
      name: "Tree Cape",
      price: 1000,
      scale: 90,
      desc: "no effect"
    }, {
      id: 10,
      name: "Stone Cape",
      price: 1000,
      scale: 90,
      desc: "no effect"
    }, {
      id: 3,
      name: "Cookie Cape",
      price: 1500,
      scale: 90,
      desc: "no effect"
    }, {
      id: 8,
      name: "Cow Cape",
      price: 2000,
      scale: 90,
      desc: "no effect"
    }, {
      id: 11,
      name: "Monkey Tail",
      price: 2000,
      scale: 97,
      xOff: 25,
      desc: "Super speed but reduced damage",
      spdMult: 1.35,
      dmgMultO: 0.2
    }, {
      id: 17,
      name: "Apple Basket",
      price: 3000,
      scale: 80,
      xOff: 12,
      desc: "slowly regenerates health over time",
      healthRegen: 1
    }, {
      id: 6,
      name: "Winter Cape",
      price: 3000,
      scale: 90,
      desc: "no effect"
    }, {
      id: 4,
      name: "Skull Cape",
      price: 4000,
      scale: 90,
      desc: "no effect"
    }, {
      id: 5,
      name: "Dash Cape",
      price: 5000,
      scale: 90,
      desc: "no effect"
    }, {
      id: 2,
      name: "Dragon Cape",
      price: 6000,
      scale: 90,
      desc: "no effect"
    }, {
      id: 1,
      name: "Super Cape",
      price: 8000,
      scale: 90,
      desc: "no effect"
    }, {
      id: 7,
      name: "Troll Cape",
      price: 8000,
      scale: 90,
      desc: "no effect"
    }, {
      id: 14,
      name: "Thorns",
      price: 10000,
      scale: 115,
      xOff: 20,
      desc: "no effect"
    }, {
      id: 15,
      name: "Blockades",
      price: 10000,
      scale: 95,
      xOff: 15,
      desc: "no effect"
    }, {
      id: 20,
      name: "Devils Tail",
      price: 10000,
      scale: 95,
      xOff: 20,
      desc: "no effect"
    }, {
      id: 16,
      name: "Sawblade",
      price: 12000,
      scale: 90,
      spin: true,
      xOff: 0,
      desc: "deal damage to players that damage you",
      dmg: 0.15
    }, {
      id: 13,
      name: "Angel Wings",
      price: 15000,
      scale: 138,
      xOff: 22,
      desc: "slowly regenerates health over time",
      healthRegen: 3
    }, {
      id: 19,
      name: "Shadow Wings",
      price: 15000,
      scale: 138,
      xOff: 22,
      desc: "increased movement speed",
      spdMult: 1.1
    }, {
      id: 18,
      name: "Blood Wings",
      price: 20000,
      scale: 178,
      xOff: 26,
      desc: "restores health when you deal damage",
      healD: 0.2
    }, {
      id: 21,
      name: "Corrupt X Wings",
      price: 20000,
      scale: 178,
      xOff: 26,
      desc: "deal damage to players that damage you",
      dmg: 0.25
    }];
  }
}
;
class ProjectileManager {
  constructor(p366, p367, p368, p369, p370, p371, p372, p373, p374) {
    this.addProjectile = function (p375, p376, p377, p378, p379, p380, p381, p382, p383, p384) {
      let v195 = p371.projectiles[p380];
      let v196;
      for (let v197 = 0; v197 < p367.length; ++v197) {
        if (!p367[v197].active) {
          v196 = p367[v197];
          break;
        }
      }
      if (!v196) {
        v196 = new p366(p368, p369, p370, p371, p372, p373, p374);
        v196.sid = p367.length;
        p367.push(v196);
      }
      v196.init(p380, p375, p376, p377, p379, v195.dmg, p378, v195.scale, p381);
      v196.ignoreObj = p382;
      v196.layer = p383 || v195.layer;
      v196.inWindow = p384;
      v196.src = v195.src;
      return v196;
    };
  }
}
;
class AiManager {
  constructor(p385, p386, p387, p388, p389, p390, p391, p392, p393) {
    this.aiTypes = [{
      id: 0,
      src: "cow_1",
      killScore: 150,
      health: 500,
      weightM: 0.8,
      speed: 0.00095,
      turnSpeed: 0.001,
      scale: 72,
      drop: ["food", 50]
    }, {
      id: 1,
      src: "pig_1",
      killScore: 200,
      health: 800,
      weightM: 0.6,
      speed: 0.00085,
      turnSpeed: 0.001,
      scale: 72,
      drop: ["food", 80]
    }, {
      id: 2,
      name: "Bull",
      src: "bull_2",
      hostile: true,
      dmg: 20,
      killScore: 1000,
      health: 1800,
      weightM: 0.5,
      speed: 0.00094,
      turnSpeed: 0.00074,
      scale: 78,
      viewRange: 800,
      chargePlayer: true,
      drop: ["food", 100]
    }, {
      id: 3,
      name: "Bully",
      src: "bull_1",
      hostile: true,
      dmg: 20,
      killScore: 2000,
      health: 2800,
      weightM: 0.45,
      speed: 0.001,
      turnSpeed: 0.0008,
      scale: 90,
      viewRange: 900,
      chargePlayer: true,
      drop: ["food", 400]
    }, {
      id: 4,
      name: "Wolf",
      src: "wolf_1",
      hostile: true,
      dmg: 8,
      killScore: 500,
      health: 300,
      weightM: 0.45,
      speed: 0.001,
      turnSpeed: 0.002,
      scale: 84,
      viewRange: 800,
      chargePlayer: true,
      drop: ["food", 200]
    }, {
      id: 5,
      name: "Quack",
      src: "chicken_1",
      dmg: 8,
      killScore: 2000,
      noTrap: true,
      health: 300,
      weightM: 0.2,
      speed: 0.0018,
      turnSpeed: 0.006,
      scale: 70,
      drop: ["food", 100]
    }, {
      id: 6,
      name: "MOOSTAFA",
      nameScale: 50,
      src: "enemy",
      hostile: true,
      dontRun: true,
      fixedSpawn: true,
      spawnDelay: 60000,
      noTrap: true,
      colDmg: 100,
      dmg: 40,
      killScore: 8000,
      health: 18000,
      weightM: 0.4,
      speed: 0.0007,
      turnSpeed: 0.01,
      scale: 80,
      spriteMlt: 1.8,
      leapForce: 0.9,
      viewRange: 1000,
      hitRange: 210,
      hitDelay: 1000,
      chargePlayer: true,
      drop: ["food", 100]
    }, {
      id: 7,
      name: "Treasure",
      hostile: true,
      nameScale: 35,
      src: "crate_1",
      fixedSpawn: true,
      spawnDelay: 120000,
      colDmg: 200,
      killScore: 5000,
      health: 20000,
      weightM: 0.1,
      speed: 0,
      turnSpeed: 0,
      scale: 70,
      spriteMlt: 1
    }, {
      id: 8,
      name: "MOOFIE",
      src: "wolf_2",
      hostile: true,
      fixedSpawn: true,
      dontRun: true,
      hitScare: 4,
      spawnDelay: 30000,
      noTrap: true,
      nameScale: 35,
      dmg: 10,
      colDmg: 100,
      killScore: 3000,
      health: 7000,
      weightM: 0.45,
      speed: 0.0015,
      turnSpeed: 0.002,
      scale: 90,
      viewRange: 800,
      chargePlayer: true,
      drop: ["food", 1000]
    }];
    this.spawn = function (p394, p395, p396, p397) {
      let v198 = p385.find(p398 => !p398.active);
      if (!v198) {
        v198 = new p386(p385.length, p389, p387, p388, p391, p390, p392, p393);
        p385.push(v198);
      }
      v198.init(p394, p395, p396, p397, this.aiTypes[p397]);
      return v198;
    };
  }
}
;
class AI {
  constructor(p399, p400, p401, p402, p403, p404, p405, p406) {
    this.sid = p399;
    this.isAI = true;
    this.nameIndex = p403.randInt(0, p404.cowNames.length - 1);
    this.init = function (p407, p408, p409, p410, p411) {
      this.x = p407;
      this.y = p408;
      this.startX = p411.fixedSpawn ? p407 : null;
      this.startY = p411.fixedSpawn ? p408 : null;
      this.xVel = 0;
      this.yVel = 0;
      this.zIndex = 0;
      this.dir = p409;
      this.dirPlus = 0;
      this.showName = "aaa";
      this.index = p410;
      this.src = p411.src;
      if (p411.name) {
        this.name = p411.name;
      }
      this.weightM = p411.weightM;
      this.speed = p411.speed;
      this.killScore = p411.killScore;
      this.turnSpeed = p411.turnSpeed;
      this.scale = p411.scale;
      this.maxHealth = p411.health;
      this.leapForce = p411.leapForce;
      this.health = this.maxHealth;
      this.chargePlayer = p411.chargePlayer;
      this.viewRange = p411.viewRange;
      this.drop = p411.drop;
      this.dmg = p411.dmg;
      this.hostile = p411.hostile;
      this.dontRun = p411.dontRun;
      this.hitRange = p411.hitRange;
      this.hitDelay = p411.hitDelay;
      this.hitScare = p411.hitScare;
      this.spriteMlt = p411.spriteMlt;
      this.nameScale = p411.nameScale;
      this.colDmg = p411.colDmg;
      this.noTrap = p411.noTrap;
      this.spawnDelay = p411.spawnDelay;
      this.hitWait = 0;
      this.waitCount = 1000;
      this.moveCount = 0;
      this.targetDir = 0;
      this.active = true;
      this.alive = true;
      this.runFrom = null;
      this.chargeTarget = null;
      this.dmgOverTime = {};
    };
    let v199 = 0;
    let v200 = 0;
    this.animate = function (p412) {
      if (this.animTime > 0) {
        this.animTime -= p412;
        if (this.animTime <= 0) {
          this.animTime = 0;
          this.dirPlus = 0;
          v199 = 0;
          v200 = 0;
        } else if (v200 == 0) {
          v199 += p412 / (this.animSpeed * p404.hitReturnRatio);
          this.dirPlus = p403.lerp(0, this.targetAngle, Math.min(1, v199));
          if (v199 >= 1) {
            v199 = 1;
            v200 = 1;
          }
        } else {
          v199 -= p412 / (this.animSpeed * (1 - p404.hitReturnRatio));
          this.dirPlus = p403.lerp(0, this.targetAngle, Math.max(0, v199));
        }
      }
    };
    this.startAnim = function () {
      this.animTime = this.animSpeed = 600;
      this.targetAngle = Math.PI * 0.8;
      v199 = 0;
      v200 = 0;
    };
  }
}
;
class addCh {
  constructor(p413, p414, p415, p416) {
    this.x = p413;
    this.y = p414;
    this.alpha = 0;
    this.active = true;
    this.alive = false;
    this.chat = p415;
    this.owner = p416;
  }
}
;
class DeadPlayer {
  constructor(p417, p418, p419, p420, p421, p422, p423, p424, p425) {
    this.x = p417;
    this.y = p418;
    this.lastDir = p419;
    this.dir = p419 + Math.PI;
    this.buildIndex = p420;
    this.weaponIndex = p421;
    this.weaponVariant = p422;
    this.skinColor = p423;
    this.scale = p424;
    this.visScale = 0;
    this.name = p425;
    this.alpha = 1;
    this.active = true;
    this.animate = function (p426) {
      let v201 = UTILS.getAngleDist(this.lastDir, this.dir);
      if (v201 > 0.01) {
        this.dir += v201 / 20;
      } else {
        this.dir = this.lastDir;
      }
      if (this.visScale < this.scale) {
        this.visScale += p426 / (this.scale / 2);
        if (this.visScale >= this.scale) {
          this.visScale = this.scale;
        }
      }
      this.alpha -= p426 / 30000;
      if (this.alpha <= 0) {
        this.alpha = 0;
        this.active = false;
      }
    };
  }
}
;
class Player {
  constructor(p427, p428, p429, p430, p431, p432, p433, p434, p435, p436, p437, p438, p439, p440) {
    this.id = p427;
    this.sid = p428;
    this.tmpScore = 0;
    this.team = null;
    this.latestSkin = 0;
    this.oldSkinIndex = 0;
    this.skinIndex = 0;
    this.latestTail = 0;
    this.oldTailIndex = 0;
    this.tailIndex = 0;
    this.hitTime = 0;
    this.lastHit = 0;
    this.showName = "NOOO";
    this.tails = {};
    for (let v202 = 0; v202 < p437.length; ++v202) {
      if (p437[v202].price <= 0) {
        this.tails[p437[v202].id] = 1;
      }
    }
    this.skins = {};
    for (let v203 = 0; v203 < p436.length; ++v203) {
      if (p436[v203].price <= 0) {
        this.skins[p436[v203].id] = 1;
      }
    }
    this.points = 0;
    this.dt = 0;
    this.hidden = false;
    this.itemCounts = {};
    this.isPlayer = true;
    this.pps = 0;
    this.moveDir = undefined;
    this.skinRot = 0;
    this.lastPing = 0;
    this.iconIndex = 0;
    this.skinColor = 0;
    this.dist2 = 0;
    this.aim2 = 0;
    this.maxSpeed = 1;
    this.chat = {
      message: null,
      count: 0
    };
    this.backupNobull = true;
    this.circle = false;
    this.circleRad = 200;
    this.circleRadSpd = 0.1;
    this.cAngle = 0;
    this.spawn = function (p441) {
      this.attacked = false;
      this.timeDamaged = 0;
      this.timeHealed = 0;
      this.pinge = 0;
      this.millPlace = "NOOO";
      this.lastshamecount = 0;
      this.death = false;
      this.spinDir = 0;
      this.sync = false;
      this.antiBull = 0;
      this.bullTimer = 0;
      this.poisonTimer = 0;
      this.active = true;
      this.alive = true;
      this.lockMove = false;
      this.lockDir = false;
      this.minimapCounter = 0;
      this.chatCountdown = 0;
      this.shameCount = 0;
      this.shameTimer = 0;
      this.sentTo = {};
      this.gathering = 0;
      this.gatherIndex = 0;
      this.shooting = {};
      this.shootIndex = 9;
      this.autoGather = 0;
      this.animTime = 0;
      this.animSpeed = 0;
      this.mouseState = 0;
      this.buildIndex = -1;
      this.weaponIndex = 0;
      this.weaponCode = 0;
      this.weaponVariant = 0;
      this.primaryIndex = undefined;
      this.secondaryIndex = undefined;
      this.dmgOverTime = {};
      this.noMovTimer = 0;
      this.maxXP = 300;
      this.XP = 0;
      this.age = 1;
      this.kills = 0;
      this.upgrAge = 2;
      this.upgradePoints = 0;
      this.x = 0;
      this.y = 0;
      this.oldXY = {
        x: 0,
        y: 0
      };
      this.zIndex = 0;
      this.xVel = 0;
      this.yVel = 0;
      this.slowMult = 1;
      this.dir = 0;
      this.dirPlus = 0;
      this.targetDir = 0;
      this.targetAngle = 0;
      this.maxHealth = 100;
      this.health = this.maxHealth;
      this.oldHealth = this.maxHealth;
      this.damaged = 0;
      this.scale = p429.playerScale;
      this.speed = p429.playerSpeed;
      this.resetMoveDir();
      this.resetResources(p441);
      this.items = [0, 3, 6, 10];
      this.weapons = [0];
      this.shootCount = 0;
      this.weaponXP = [];
      this.reloads = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        53: 0
      };
      this.bowThreat = {
        9: 0,
        12: 0,
        13: 0,
        15: 0
      };
      this.damageThreat = 0;
      this.inTrap = false;
      this.canEmpAnti = false;
      this.empAnti = false;
      this.soldierAnti = false;
      this.poisonTick = 0;
      this.bullTick = 0;
      this.setPoisonTick = false;
      this.setBullTick = false;
      this.antiTimer = 2;
    };
    this.resetMoveDir = function () {
      this.moveDir = undefined;
    };
    this.resetResources = function (p442) {
      for (let v204 = 0; v204 < p429.resourceTypes.length; ++v204) {
        this[p429.resourceTypes[v204]] = p442 ? 100 : 0;
      }
    };
    this.getItemType = function (p443) {
      let v205 = this.items.findIndex(p444 => p444 == p443);
      if (v205 != -1) {
        return v205;
      } else {
        return p435.checkItem.index(p443, this.items);
      }
    };
    this.setData = function (p445) {
      this.id = p445[0];
      this.sid = p445[1];
      this.name = p445[2];
      this.x = p445[3];
      this.y = p445[4];
      this.dir = p445[5];
      this.health = p445[6];
      this.maxHealth = p445[7];
      this.scale = p445[8];
      this.skinColor = p445[9];
    };
    this.updateTimer = function () {
      this.bullTimer -= 1;
      if (this.bullTimer <= 0) {
        this.setBullTick = false;
        this.bullTick = game.tick - 1;
        this.bullTimer = p429.serverUpdateRate;
      }
      this.poisonTimer -= 1;
      if (this.poisonTimer <= 0) {
        this.setPoisonTick = false;
        this.poisonTick = game.tick - 1;
        this.poisonTimer = p429.serverUpdateRate;
      }
    };
    this.update = function (p446) {
      if (this.sid == playerSID) {}
      if (this.active) {
        let v206 = {
          skin: findID(p436, this.skinIndex),
          tail: findID(p437, this.tailIndex)
        };
        let v207 = (this.buildIndex >= 0 ? 0.5 : 1) * (p435.weapons[this.weaponIndex].spdMult || 1) * (v206.skin ? v206.skin.spdMult || 1 : 1) * (v206.tail ? v206.tail.spdMult || 1 : 1) * (this.y <= p429.snowBiomeTop ? v206.skin && v206.skin.coldM ? 1 : p429.snowSpeed : 1) * this.slowMult;
        this.maxSpeed = v207;
      }
    };
    let v208 = 0;
    let v209 = 0;
    this.animate = function (p447) {
      if (this.animTime > 0) {
        this.animTime -= p447;
        if (this.animTime <= 0) {
          this.animTime = 0;
          this.dirPlus = 0;
          v208 = 0;
          v209 = 0;
        } else if (v209 == 0) {
          v208 += p447 / (this.animSpeed * p429.hitReturnRatio);
          this.dirPlus = p430.lerp(0, this.targetAngle, Math.min(1, v208));
          if (v208 >= 1) {
            v208 = 1;
            v209 = 1;
          }
        } else {
          v208 -= p447 / (this.animSpeed * (1 - p429.hitReturnRatio));
          this.dirPlus = p430.lerp(0, this.targetAngle, Math.max(0, v208));
        }
      }
    };
    this.startAnim = function (p448, p449) {
      this.animTime = this.animSpeed = p435.weapons[p449].speed;
      this.targetAngle = p448 ? -p429.hitAngle : -Math.PI;
      v208 = 0;
      v209 = 0;
    };
    this.canSee = function (p450) {
      if (!p450) {
        return false;
      }
      let v210 = Math.abs(p450.x - this.x) - p450.scale;
      let v211 = Math.abs(p450.y - this.y) - p450.scale;
      return v210 <= p429.maxScreenWidth / 2 * 1.3 && v211 <= p429.maxScreenHeight / 2 * 1.3;
    };
    this.judgeShame = function () {
      this.lastshamecount = this.shameCount;
      if (this.oldHealth < this.health) {
        if (this.hitTime) {
          let v212 = game.tick - this.hitTime;
          this.lastHit = game.tick;
          this.hitTime = 0;
          if (v212 < 2) {
            this.shameCount++;
          } else {
            this.shameCount = Math.max(0, this.shameCount - 2);
          }
        }
      } else if (this.oldHealth > this.health) {
        this.hitTime = game.tick;
      }
    };
    this.addShameTimer = function () {
      this.shameCount = 0;
      this.shameTimer = 30;
      let vSetInterval = setInterval(() => {
        this.shameTimer--;
        if (this.shameTimer <= 0) {
          clearInterval(vSetInterval);
        }
      }, 1000);
    };
    this.isTeam = function (p451) {
      return this == p451 || this.team && this.team == p451.team;
    };
    this.findAllianceBySid = function (p452) {
      if (this.team) {
        return alliancePlayers.find(p453 => p453 === p452);
      } else {
        return null;
      }
    };
    this.checkCanInsta = function (p454) {
      let v213 = 0;
      if (this.alive && inGame) {
        let v214 = {
          weapon: this.weapons[0],
          variant: this.primaryVariant,
          dmg: this.weapons[0] == undefined ? 0 : p435.weapons[this.weapons[0]].dmg
        };
        let v215 = {
          weapon: this.weapons[1],
          variant: this.secondaryVariant,
          dmg: this.weapons[1] == undefined ? 0 : p435.weapons[this.weapons[1]].Pdmg
        };
        let v216 = this.skins[7] && !p454 ? 1.5 : 1;
        let v217 = v214.variant != undefined ? p429.weaponVariants[v214.variant].val : 1;
        if (v214.weapon != undefined && this.reloads[v214.weapon] == 0) {
          v213 += v214.dmg * v217 * v216;
        }
        if (v215.weapon != undefined && this.reloads[v215.weapon] == 0) {
          v213 += v215.dmg;
        }
        if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
          v213 += 25;
        }
        v213 *= near.skinIndex == 6 ? 0.75 : 1;
        return v213;
      }
      return 0;
    };
    this.manageReload = function () {
      if (this.shooting[53]) {
        this.shooting[53] = 0;
        this.reloads[53] = 2500 - game.tickRate;
      } else if (this.reloads[53] > 0) {
        this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
      }
      if (this.reloads[this.weaponIndex] <= 1000 / 9) {
        let v218 = this.weaponIndex;
        let v219 = liztobj.filter(p455 => (p455.active || p455.alive) && p455.health < p455.maxHealth && p455.group !== undefined && p430.getDist(p455, player, 0, 2) <= p435.weapons[player.weaponIndex].range + p455.scale);
        for (let v220 = 0; v220 < v219.length; v220++) {
          let v221 = v219[v220];
          let v222 = p435.weapons[v218].dmg * p429.weaponVariants[tmpObj[(v218 < 9 ? "prima" : "seconda") + "ryVariant"]].val * (p435.weapons[v218].sDmg || 1) * 3.3;
          let v223 = p435.weapons[v218].dmg * p429.weaponVariants[tmpObj[(v218 < 9 ? "prima" : "seconda") + "ryVariant"]].val * (p435.weapons[v218].sDmg || 1);
          if (v221.health - v223 <= 0 && near.length) {
            place(near.dist2 < near.scale * 1.8 + 50 ? 4 : 2, caf(v221, player) + Math.PI);
          }
        }
      }
      if (this.gathering || this.shooting[1]) {
        if (this.gathering) {
          this.gathering = 0;
          this.reloads[this.gatherIndex] = p435.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
          this.attacked = true;
        }
        if (this.shooting[1]) {
          this.shooting[1] = 0;
          this.reloads[this.shootIndex] = p435.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
          this.attacked = true;
        }
      } else {
        this.attacked = false;
        if (this.buildIndex < 0) {
          if (this.reloads[this.weaponIndex] > 0) {
            this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - 110);
            if (this == player) {
              if (getEl("weaponGrind").checked) {
                for (let v224 = 0; v224 < Math.PI * 2; v224 += Math.PI / 2) {
                  checkPlace(player.getItemType(22), v224);
                }
              }
            }
            if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
              this.antiBull++;
              game.tickBase(() => {
                this.antiBull = 0;
              }, 1);
            }
          }
        }
      }
    };
    this.addDamageThreat = function (p456) {
      let v225 = {
        weapon: this.primaryIndex,
        variant: this.primaryVariant
      };
      v225.dmg = v225.weapon == undefined ? 45 : p435.weapons[v225.weapon].dmg;
      let v226 = {
        weapon: this.secondaryIndex,
        variant: this.secondaryVariant
      };
      v226.dmg = v226.weapon == undefined ? 35 : p435.weapons[v226.weapon].Pdmg;
      let v227 = 1.5;
      let v228 = v225.variant != undefined ? p429.weaponVariants[v225.variant].val : 1.18;
      let v229 = v226.variant != undefined ? [9, 12, 17, 15].includes(v226.weapon) ? 1 : p429.weaponVariants[v226.variant].val : 1.18;
      if (v225.weapon == undefined ? true : this.reloads[v225.weapon] == 0) {
        this.damageThreat += v225.dmg * v228 * v227;
      }
      if (v226.weapon == undefined ? true : this.reloads[v226.weapon] == 0) {
        this.damageThreat += v226.dmg * v229;
      }
      if (this.reloads[53] <= game.tickRate) {
        this.damageThreat += 25;
      }
      this.damageThreat *= p456.skinIndex == 6 ? 0.75 : 1;
      if (!this.isTeam(p456)) {
        if (this.dist2 <= 300) {
          p456.damageThreat += this.damageThreat;
        }
      }
    };
    this.addDamageProbability = function (p457) {
      let v230 = {
        weapon: this.primaryIndex,
        variant: this.primaryVariant
      };
      v230.dmg = v230.weapon == undefined ? 45 : p435.weapons[v230.weapon].dmg;
      let v231 = {
        weapon: this.secondaryIndex,
        variant: this.secondaryVariant
      };
      v231.dmg = v231.weapon == undefined ? 50 : p435.weapons[v231.weapon].Pdmg;
      let v232 = 1.5;
      let v233 = v230.variant != undefined ? p429.weaponVariants[v230.variant].val : 1.18;
      let v234 = v231.variant != undefined ? [9, 12, 17, 15].includes(v231.weapon) ? 1 : p429.weaponVariants[v231.variant].val : 1.18;
      if (v230.weapon == undefined ? true : this.reloads[v230.weapon] == 0) {
        this.damageProbably += v230.dmg * v233 * v232 * 0.75;
      }
      if (v231.weapon == undefined ? true : this.reloads[v231.weapon] == 0) {
        this.damageProbably += v231.dmg * v234;
      }
      this.damageProbably *= 0.75;
      if (!this.isTeam(p457)) {
        if (this.dist2 <= 300) {
          p457.damageProbably += this.damageProbably;
        }
      }
    };
  }
}
;
function sendUpgrade(p458) {
  player.reloads[p458] = 0;
  packet("H", p458);
}
function storeEquip(p459, p460) {
  packet("c", 0, p459, p460);
}
function storeBuy(p461, p462) {
  packet("c", 1, p461, p462);
}
function getVelocity(p463) {
  let vCaf = caf({
    x: p463.olderX,
    y: p463.olderY
  }, p463);
  let vCdf = cdf({
    x: p463.olderX,
    y: p463.olderY
  }, p463);
  let v235 = p463.x + Math.cos(vCaf) * 4 * window.pingTime / 111.1111;
  let v236 = p463.y + Math.sin(vCaf) * 4 * window.pingTime / 111.1111;
  return [vCdf, v235, v236, vCaf];
}
function buyEquip(p464, p465) {
  let v237 = player.skins[6] ? 6 : 0;
  if (player.alive && inGame) {
    if (p465 == 0) {
      if (player.skins[p464]) {
        if (player.latestSkin != p464) {
          packet("c", 0, p464, 0);
        }
      } else if (getEl("autoBuyEquip").checked) {
        let vFindID = findID(hats, p464);
        if (vFindID) {
          if (player.points >= vFindID.price) {
            packet("c", 1, p464, 0);
            packet("c", 0, p464, 0);
          } else if (player.latestSkin != v237) {
            packet("c", 0, v237, 0);
          }
        } else if (player.latestSkin != v237) {
          packet("c", 0, v237, 0);
        }
      } else if (player.latestSkin != v237) {
        packet("c", 0, v237, 0);
      }
    } else if (p465 == 1) {
      if (useWasd && p464 != 11 && p464 != 0) {
        if (player.latestTail != 0) {
          packet("c", 0, 0, 1);
        }
        return;
      }
      if (player.tails[p464]) {
        if (player.latestTail != p464) {
          packet("c", 0, p464, 1);
        }
      } else if (getEl("autoBuyEquip").checked) {
        let vFindID2 = findID(accessories, p464);
        if (vFindID2) {
          if (player.points >= vFindID2.price) {
            packet("c", 1, p464, 1);
            packet("c", 0, p464, 1);
          } else if (player.latestTail != 0) {
            packet("c", 0, 0, 1);
          }
        } else if (player.latestTail != 0) {
          packet("c", 0, 0, 1);
        }
      } else if (player.latestTail != 0) {
        packet("c", 0, 0, 1);
      }
    }
  }
}
function selectToBuild(p466, p467) {
  packet("z", p466, p467);
}
function selectWeapon(p468, p469) {
  if (!p469) {
    player.weaponCode = p468;
  }
  packet("z", p468, 1);
}
function sendAutoGather() {
  packet("K", 1, 1);
}
function sendAtck(p470, p471) {
  packet("F", p470, p471, 1);
}
let placePacketLimiter = false;
let placementsPerTick = 0;
let phantom = [];
function place(p472, p473, p474) {
  try {
    if (p472 == undefined) {
      return;
    }
    let v238 = items.list[player.items[p472]];
    let v239 = player.scale + v238.scale + (v238.placeOffset || 0);
    let v240 = player.x2 + v239 * Math.cos(p473);
    let v241 = player.y2 + v239 * Math.sin(p473);
    if (player.alive && inGame && player.itemCounts[v238.group.id] == undefined ? true : player.itemCounts[v238.group.id] < (config.isSandbox ? 299 : v238.group.limit ? v238.group.limit : 99)) {
      selectToBuild(player.items[p472]);
      sendAtck(1, p473);
      selectWeapon(player.weaponCode, 1);
      if (p474 && getEl("placeVis").checked) {
        placeVisible.push({
          x: v240,
          y: v241,
          name: v238.name,
          scale: v238.scale,
          dir: p473
        });
        game.tickBase(() => {
          placeVisible.shift();
        }, 1);
      }
    }
  } catch (_0x5f3754) {}
}
function checkPlace(p475, p476) {
  try {
    if (p475 == undefined) {
      return;
    }
    let v242 = items.list[player.items[p475]];
    let v243 = player.scale + v242.scale + (v242.placeOffset || 0);
    let v244 = player.x2 + v243 * Math.cos(p476);
    let v245 = player.y2 + v243 * Math.sin(p476);
    if (objectManager.checkItemLocation(v244, v245, v242.scale, 0.6, v242.id, false, player)) {
      place(p475, p476, 1);
    }
  } catch (_0x53d8e2) {}
}
function soldierMult() {
  if (player.latestSkin == 6) {
    return 0.75;
  } else {
    return 1;
  }
}
function healthBased() {
  if (player.health == 100) {
    return 0;
  }
  if (player.skinIndex != 45 && player.skinIndex != 56) {
    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
  }
  return 0;
}
function insat1() {
  io.send("6", "");
  my.autoAim = true;
  selectWeapon(player.weapons[0]);
  buyEquip(7, 0);
  buyEquip(0, 1);
  sendAutoGather();
  setTimeout(() => {
    selectWeapon(player.weapons[1]);
    buyEquip(53, 0);
    setTimeout(() => {
      sendAutoGather();
      my.autoAim = false;
    }, 180);
  }, 100);
}
function getAttacker(p477) {
  let v246 = enemy.filter(p478 => {
    let v247 = {
      three: p478.attacked
    };
    return v247.three;
  });
  return v246;
}
function healer() {
  for (let v248 = 0; v248 < healthBased(); v248++) {
    place(0, getAttackDir());
  }
}
function healer33() {
  for (let v249 = 0; v249 < healthBased(); v249++) {
    place(0, getAttackDir());
  }
}
function healer1() {
  place(0, getAttackDir());
  return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
}
function noshameheal() {
  place(0, getAttackDir());
  if (player.shameCount >= 5) {
    place(0, getAttackDir());
    healer33();
  } else if (player.shameCount <= 4 && player.skinIndex != 6 && player.skinIndex != 22) {
    healer33();
    buyEquip(6, 0);
  } else if (player.shameCount >= 5 && player.skinIndex != 6 && player.skinIndex != 22) {
    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
    healer33();
  }
}
const placedSpikePositions = new Set();
const placedTrapPositions = new Set();
function isPositionValid(p479) {
  const v250 = player.x2;
  const v251 = player.y2;
  const v252 = Math.hypot(p479[0] - v250, p479[1] - v251);
  return v252 > 35;
}
function findAllianceBySid(p480) {
  if (player.team) {
    return alliancePlayers.find(p481 => p481 === p480);
  } else {
    return null;
  }
}
function calculatePossibleTrapPositions(p482, p483, p484) {
  const v253 = [];
  const v254 = 16;
  for (let v255 = 0; v255 < v254; v255++) {
    const v256 = Math.PI * 2 * v255 / v254;
    const v257 = p482 + p484 * Math.cos(v256);
    const v258 = p483 + p484 * Math.sin(v256);
    const v259 = [v257, v258];
    if (!v253.some(p485 => isPositionTooClose(v259, p485))) {
      v253.push(v259);
    }
  }
  return v253;
}
function isPositionTooClose(p486, p487, p488 = 50) {
  const v260 = Math.hypot(p486[0] - p487[0], p486[1] - p487[1]);
  return v260 < p488;
}
function applCxC(p489) {
  if (player.health == 100) {
    return 0;
  }
  if (player.skinIndex != 45 && player.skinIndex != 56) {
    return Math.ceil(p489 / items.list[player.items[0]].healing);
  }
  return 0;
}
function healthBased() {
  if (player.health == 100) {
    return 0;
  }
  if (player.skinIndex != 45 && player.skinIndex != 56) {
    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
  }
  return 0;
}
function calcDmg(p490) {
  if (p490 * player.skinIndex == 6) {
    return 0.75;
  } else {
    return 1;
  }
}
function antirev() {
  if (tmpObj.isPlayer) {
    for (let v261 = 0; v261 < healthBased(); v261++) {
      place(0, getAttackDir());
      if (player.health == 100 && player.shameCount < 6 && player.skinIndex == 6) {
        place(0, getAttackDir());
        console.log("AAAAAAAAAAAAA");
      } else if (player.health == 100 && player.shameCount < 6 && player.skinIndex != 6) {
        place(0, getAttackDir());
        console.log("AAAAAAAAAAAAA");
      } else if (player.health == 96 && player.shameCount < 5 && player.skinIndex == 6) {
        place(0, getAttackDir());
        setTimeout(() => {
          place(0, getAttackDir());
        }, 5);
      } else if (player.health == 25 && player.shameCount < 5 && player.skinIndex == 6) {
        place(0, getAttackDir());
        setTimeout(() => {
          place(0, getAttackDir());
        }, 5);
      } else if (player.health == 10 && player.shameCount < 6 && player.skinIndex == 6) {
        place(0, getAttackDir());
        setTimeout(() => {
          place(0, getAttackDir());
        }, 5);
      } else if (player.health == 50 && player.shameCount < 7 && player.skinIndex != 6) {
        place(0, getAttackDir());
        setTimeout(() => {
          place(0, getAttackDir());
        }, 5);
      }
      if (player.shameCount < 6) {
        setTimeout(() => {
          place(0, getAttackDir());
        }, 30);
      }
    }
  }
}
let slowHeal = function (p491) {
  setTimeout(() => {
    healer();
  }, 25);
};
let isHealing = false;
let delay = 20;
function uziheal() {
  if (!isHealing && player.health < 100) {
    isHealing = true;
    if (player.health < 70) {
      place(0, getAttackDir());
      healer();
      isHealing = false;
    } else {
      const v262 = 5;
      const v263 = Math.ceil((100 - player.health) / 25);
      let v264 = 0;
      function f17() {
        if (v264 < v263) {
          setTimeout(() => {
            place(0, getAttackDir());
            v264++;
            f17();
          }, v262);
        } else {
          isHealing = false;
        }
      }
      f17();
    }
  }
}
function predictHeal() {}
function antiSyncHealing(p492) {
  my.antiSync = true;
  let vSetInterval2 = setInterval(() => {
    if (player.shameCount < 6) {
      place(0, getAttackDir());
    }
  }, 75);
  setTimeout(() => {
    clearInterval(vSetInterval2);
    setTimeout(() => {
      my.antiSync = false;
    }, game.tickRate);
  }, game.tickRate);
}
function biomeGear(p493, p494) {
  if (player.moveDir == undefined && near.dist2 > 300) {
    buyEquip(22, 0);
  }
  if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
    if (p494) {
      return 31;
    }
    buyEquip(31, 0);
  } else if (player.y2 <= config.snowBiomeTop) {
    if (p494) {
      if (enemy && near.dist2 <= 300) {
        return 6;
      } else {
        return 15;
      }
    }
    buyEquip(15, 0);
  } else {
    if (p494) {
      if (enemy && near.dist2 <= 300) {
        return 6;
      } else {
        return 12;
      }
    }
    buyEquip(enemy ? 6 : 12, 0);
  }
  if (p494) {
    return 0;
  }
}
function getPossibleObjDmg(p495) {
  return items.weapons[p495.weapons[p495.weapons[1] ? Number(p495.weapons[1] == 10) : 0]].dmg / 4 * (player.skins[40] ? 3.3 : 1) * (items.weapons[p495.weapons[Number(p495.weapons[1] == 10)]].sDmg || 1);
}
let doStuffPingSet = [];
function smartTick(p496) {
  doStuffPingSet.push(p496);
}
class Combat {
  constructor(p497, p498) {
    this.findSpikeHit = {
      x: 0,
      y: 0,
      spikePosX: 0,
      spikePosY: 0,
      canHit: false,
      spikes: []
    };
    this.spikesNearEnemy = [];
    this.doSpikeHit = function () {
      if (enemy.length) {
        let v265 = gameObjects.find(p499 => p499.active && p499.name == "pit trap" && p499.isTeamObject(player) && p497.getDistance(p499.x, p499.y, near.x2, near.y2) <= 50);
        let v266 = 0.3 + (p498.weapons[player.weapons[0]].knock || 0);
        let v267 = Math.atan2(near.y2 - player.y2, near.x2 - player.x2);
        let v268 = {
          x: near.x2 + v266 * Math.cos(v267) * 224,
          y: near.y2 + v266 * Math.sin(v267) * 224
        };
        if (near.dist2 < p498.weapons[player.weapons[0]].range + 70 && !v265 && near) {
          this.findSpikeHit.x = v268.x;
          this.findSpikeHit.y = v268.y;
        }
        this.findSpikeHit.spikes = gameObjects.filter(p500 => p500.active && p500.dmg && p500.owner.sid == player.sid && p497.getDistance(p500.x, p500.y, v268.x, v268.y) <= 35 + p500.scale);
        for (let v269 = 0; v269 < this.findSpikeHit.spikes.length; v269++) {
          let v270 = this.findSpikeHit.spikes[v269];
          const v271 = p497.getDist(player, v270, 0, 0);
          const v272 = p497.getDist(near, v270, 0, 0);
          const v273 = p497.getDist(v270, near, 0, 0);
          if (v271 > v272 && v273 < 35 + v270.scale + player.scale && (player.primaryDmg >= 35 && player.skinIndex != 6 || player.primaryDmg >= 51)) {
            if (v270 && !v265 && near && near.dist2 <= p498.weapons[player.weapons[0]].range + player.scale * 1.8 && player.reloads[player.weapons[0]] == 0) {
              this.findSpikeHit.canHit = true;
              this.findSpikeHit.spikePosX = v270.x;
              this.findSpikeHit.spikePosY = v270.y;
              if (this.findSpikeHit.canHit) {
                instaC.canSpikeTick = true;
                instaC.syncHit = true;
                if (getEl("revTick").checked && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                  instaC.revTick = true;
                }
              }
              smartTick(() => {
                smartTick(() => {
                  this.findSpikeHit.spikePosX = 0;
                  this.findSpikeHit.spikePosY = 0;
                  this.findSpikeHit.canHit = false;
                });
              });
            }
          } else {
            this.findSpikeHit.spikePosX = 0;
            this.findSpikeHit.spikePosY = 0;
            this.findSpikeHit.canHit = false;
          }
        }
      }
    };
  }
}
let advHeal = [];
let enemyKbSpike = {
  x: null,
  y: null
};
let enemyKbSpike2 = {
  x: null,
  y: null
};
class Traps {
  constructor(p501, p502) {
    this.dist = 0;
    this.aim = 0;
    this.inTrap = false;
    this.replaced = false;
    this.antiTrapped = false;
    this.info = {};
    this.notFast = function () {
      return player.weapons[1] == 10 && (this.info.health > p502.weapons[player.weapons[0]].dmg || player.weapons[0] == 5);
    };
    this.testCanPlace = function (p503, p504 = -(Math.PI / 2), p505 = Math.PI / 2, p506 = Math.PI / 18, p507, p508, p509) {
      try {
        let v274 = p502.list[player.items[p503]];
        let v275 = player.scale + v274.scale + (v274.placeOffset || 0);
        let v276 = {
          attempts: 0,
          placed: 0
        };
        let v277 = [];
        gameObjects.forEach(p510 => {
          v277.push({
            x: p510.x,
            y: p510.y,
            active: p510.active,
            blocker: p510.blocker,
            scale: p510.scale,
            isItem: p510.isItem,
            type: p510.type,
            colDiv: p510.colDiv,
            getScale: function (p511, p512) {
              p511 = p511 || 1;
              return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : p511 * 0.6) * (p512 ? 1 : this.colDiv);
            }
          });
        });
        for (let vP504 = p504; vP504 < p505; vP504 += p506) {
          v276.attempts++;
          let v278 = p507 + vP504;
          let v279 = player.x2 + v275 * Math.cos(v278);
          let v280 = player.y2 + v275 * Math.sin(v278);
          let v281 = v277.find(p513 => p513.active && p501.getDistance(v279, v280, p513.x, p513.y) < v274.scale + (p513.blocker ? p513.blocker : p513.getScale(0.6, p513.isItem)));
          if (v281) {
            continue;
          }
          if (v274.id != 19 && v280 >= config.mapScale / 2 - config.riverWidth / 2 && v280 <= config.mapScale / 2 + config.riverWidth / 2) {
            continue;
          }
          if (!p508 && p509 || useWasd) {
            if (useWasd ? false : p509.inTrap) {
              if (p501.getAngleDist(near.aim2 + Math.PI, v278 + Math.PI) <= Math.PI) {
                place(2, v278, 1);
              } else if (player.items[4] == 15) {
                place(4, v278, 1);
              }
            } else if (p501.getAngleDist(near.aim2, v278) <= config.gatherAngle / 1.5) {
              place(2, v278, 1);
            } else if (player.items[4] == 15) {
              place(4, v278, 1);
            }
          } else {
            place(p503, v278, 1);
          }
          v277.push({
            x: v279,
            y: v280,
            active: true,
            blocker: v274.blocker,
            scale: v274.scale,
            isItem: true,
            type: null,
            colDiv: v274.colDiv,
            getScale: function () {
              return this.scale;
            }
          });
          if (p501.getAngleDist(near.aim2, v278) <= 1) {
            v276.placed++;
          }
        }
        if (v276.placed > 0 && p508 && v274.dmg) {
          if (near.dist2 <= p502.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.spikeTick) {
            instaC.canSpikeTick = true;
          }
        }
      } catch (_0x5d85e8) {}
    };
    this.checkSpikeTick = function () {
      try {
        if (![3, 4, 5].includes(near.primaryIndex)) {
          return false;
        }
        if (getEl("safeAntiSpikeTick").checked || my.autoPush ? false : near.primaryIndex == undefined ? true : near.reloads[near.primaryIndex] > game.tickRate) {
          return false;
        }
        if (near.dist2 <= p502.weapons[near.primaryIndex || 5 || 7 || 4 || 0].range + near.scale * 1.8) {
          buyEquip(26, 0);
          let v282 = p502.list[9];
          let v283 = near.scale + v282.scale + (v282.placeOffset || 0);
          let v284 = 0;
          let v285 = {
            attempts: 0,
            block: "unblocked"
          };
          for (let v286 = -1; v286 <= 1; v286 += 1 / 10) {
            v285.attempts++;
            let v287 = p501.getDirect(player, near, 2, 2) + v286;
            let v288 = near.x2 + v283 * Math.cos(v287);
            let v289 = near.y2 + v283 * Math.sin(v287);
            let v290 = gameObjects.find(p514 => p514.active && p501.getDistance(v288, v289, p514.x, p514.y) < v282.scale + (p514.blocker ? p514.blocker : p514.getScale(0.6, p514.isItem)));
            if (v290) {
              continue;
            }
            if (v289 >= config.mapScale / 2 - config.riverWidth / 2 && v289 <= config.mapScale / 2 + config.riverWidth / 2) {
              continue;
            }
            v284++;
            v285.block = "blocked";
            break;
          }
          if (v284) {
            my.anti0Tick = 1;
            healer();
            buyEquip(6, 0);
            return true;
          }
        }
      } catch (_0x52bca4) {
        return null;
      }
      return false;
    };
    this.protect = function (p515) {
      if (!configs.antiTrap) {
        return;
      }
      if (player.items[4]) {
        this.testCanPlace(2, -(Math.PI / 2), Math.PI / 2, Math.PI / 18, p515 + Math.PI);
        this.antiTrapped = true;
      }
    };
    this.ReTrap = function () {
      let v291 = p502.weapons[player.weaponIndex].range + 70;
      gameObjects.forEach(p516 => {
        if (enemy.length) {
          let v292 = p501.getDist(p516, player, 0, 2);
          let v293 = p501.getDirect(p516, player, 0, 2);
          game.tickBase(() => {
            if (near.dist2 <= v291 && p516.health <= 272.58 && PrePlaceCount < 15 && f25(p516, player) <= v291 || near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1) || player.reloads[player.weaponIndex] * 1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) {
              place(2, v293);
            } else if (near.dist2 > v291 && p516.health <= 272.58 && PrePlaceCount >= 0 && f25(p516, player) <= v291 || near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1) || player.reloads[player.weaponIndex] * 1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) {}
          }, 1);
        }
      });
    };
    function f18(p517, p518) {
      try {
        return Math.hypot((p518.y2 || p518.y) - (p517.y2 || p517.y), (p518.x2 || p518.x) - (p517.x2 || p517.x));
      } catch (_0x5b3b42) {
        return Infinity;
      }
    }
    function f19(p519) {
      return Math.sqrt(p519.xVel * p519.xVel + p519.yVel * p519.yVel);
    }
    function f20(p520) {
      return Math.atan2(p520.yVel, p520.xVel);
    }
    function f21() {
      let v294 = [];
      for (let v295 = 0; v295 < 360; v295 += 250) {
        v294.push(Math.PI / 180 * v295);
      }
      return v294;
    }
    this.protect = function (p521) {
      if (!getEl("antiTrap").checked) {
        return;
      }
      if (player.items[4] && near.dist2 <= 600) {
        this.testCanPlace(2, -(Math.PI / 2), Math.PI / 2, Math.PI / 18, p521 + Math.PI);
        this.antiTrapped = true;
      }
    };
    p501.deg2rad = function (p522) {
      return p522 * (Math.PI / 180);
    };
    this.autoPlace = function () {
      if (secPacket >= 90) {
        return;
      }
      let v296;
      v296 = 250;
      const v297 = 45;
      const v298 = Math.PI / 24;
      if (enemy.length && game.tick % (Math.max(1, parseInt) || 1) === 0) {
        let v299 = {
          inTrap: false
        };
        let v300 = gameObjects.find(p523 => p523.trap && p523.active && p523.isTeamObject(player) && p501.getDist(p523, near, 0, 2) <= near.scale + p523.getScale() + 5);
        v299.inTrap = !!v300;
        if (near.dist2 < 500 && near.dist2 > 350) {
          this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, near.aim2);
        }
        if (near.dist2 <= 300 && (near.dist2 > v296 && !v299.inTrap || autoQ)) {
          if (v299.inTrap && near.dist2 <= 250) {
            checkPlace(2, near.aim2 + Math.PI);
          } else if (player.items[4] == 15) {
            checkPlace(4, near.aim2);
          }
        } else if (!v299.inTrap && (testMode ? enemy.length : near.dist2 <= v296)) {
          let v301 = p501.getDirect(near, player, 0, 2);
          let v302 = 70;
          const vF19 = f19(near);
          const vF20 = f20(near);
          if (near.dist2 <= v296) {
            if (player.items[4] == 15) {
              this.testCanPlace(4, p501.deg2rad(-90), p501.deg2rad(90), Math.PI / 24, v301, v302, {
                inTrap: true,
                enemyVelocity: vF19,
                enemyDirection: vF20
              });
            }
          }
        } else if (v299.inTrap) {
          let v303 = p501.getDirect(v300, player, 0, 2);
          let v304 = 70;
          const vF192 = f19(v300);
          const vF202 = f20(v300);
          if (near.dist2 <= 100) {
            let v305 = Math.random() * Math.PI * 2;
            this.testCanPlace(2, v305, v305 + Math.PI * 2, v298, v303, v297, {
              inTrap: false,
              enemyVelocity: vF192,
              enemyDirection: vF202
            });
          }
        }
      }
    };
    function f22(p524, p525, p526, p527) {
      return Math.atan2(p527 - p525, p526 - p524);
    }
    function f23(p528) {
      const v306 = 20;
      return p528.health < v306;
    }
    function f24() {
      this.info.health <= p502.weapons[player.weaponIndex].dmg * config.weaponVariants[tmpObj[(player.weaponIndex < 9 ? "prima" : "seconda") + "ryVariant"]].val * (p502.weapons[player.weaponIndex].sDmg || 1) * 3.3;
      autoQ = true;
    }
    function f25(p529, p530) {
      return Math.sqrt(Math.pow(p530.y - p529.y, 2) + Math.pow(p530.x - p529.x, 2));
    }
    let v307 = false;
    let v308 = false;
    var v309 = {
      draw3: {
        active: false,
        x: 0,
        y: 0,
        scale: 0
      },
      moveDir: undefined,
      lastPos: {
        x: 0,
        y: 0
      }
    };
    function f26(p531, p532) {
      return p531.x * p532.x + p531.y * p532.y;
    }
    function f27(p533) {
      return Math.sqrt(p533.x * p533.x + p533.y * p533.y);
    }
    function f28(p534, p535) {
      return {
        x: p535.x - p534.x,
        y: p535.y - p534.y
      };
    }
    function f29(p536, p537) {
      let vF28 = f28(p536, p537);
      let v310 = {
        x: Math.cos(player.dir),
        y: Math.sin(player.dir)
      };
      let vF26 = f26(v310, vF28);
      let v311 = f27(v310) * f27(vF28);
      let v312 = vF26 / v311;
      let v313 = Math.acos(v312);
      v313 *= 180 / Math.PI;
      if (v313 < 0) {
        v313 += 360;
      }
      return v313;
    }
    let v314 = false;
    function f30(p538, p539, p540) {
      const v315 = Math.abs(p538 - p539 * Math.cos(Math.atan2(near.yVel, near.xVel)));
      const v316 = 1 - v315 / p540;
      return Math.max(0, Math.min(1, v316));
    }
    this.replacer = function (p541) {
      if (!p541 || !getEl("autoReplace").checked) {
        return;
      }
      if (!inGame) {
        return;
      }
      if (this.antiTrapped) {
        return;
      }
      this.angles = this.angles || [];
      game.tickBase(() => {
        let v317 = p501.getDirect(p541, player, 0, 2);
        let v318 = p501.getDist(p541, player, 0, 2);
        let v319 = Math.PI / 6;
        if (getEl("weaponGrind").checked && v318 <= p502.weapons[player.weaponIndex].range + player.scale) {
          return;
        }
        if (v318 <= 300 && near.dist2 <= 300) {
          let v320 = this.checkSpikeTick();
          let v321 = p502.weapons[near.primaryIndex || 5].range;
          if (!v320 && (near.dist2 <= v321 || traps.inTrap && v318 <= 150)) {
            let v322 = Math.atan2(player.y - p541.y, player.x - p541.x);
            let v323 = p501.getDist(p541, player, 0, 2);
            let v324 = 80;
            let v325 = Math.sqrt(near.xVel * near.xVel + near.yVel * near.yVel);
            let v326 = Math.atan2(near.yVel, near.xVel);
            let v327 = v322 + v325 * Math.cos(v326);
            let v328 = v323 + v325 * Math.sin(v326);
            this.angles.push(v327);
            if (this.angles.length > 5) {
              this.angles.shift();
            }
            let v329 = this.angles.reduce((p542, p543) => p542 + p543, 0) / this.angles.length;
            v329 += v319;
            let v330 = Math.PI / 24 * Math.sin(Date.now() / 1000);
            let v331 = v329 + v330;
            this.testCanPlace(2, v331, v331 + Math.PI * 2, Math.PI / 24, v317, v324);
          } else if (player.items[4] === 15 || near.dist2 <= 100) {
            let v332 = Math.atan2(player.y - p541.y, player.x - p541.x);
            let v333 = p501.getDist(p541, player, 0, 2);
            let v334 = 70;
            let v335 = Math.sqrt(near.xVel * near.xVel + near.yVel * near.yVel);
            let v336 = Math.atan2(near.yVel, near.xVel);
            let v337 = v332 + v335 * Math.cos(v336);
            let v338 = v333 + v335 * Math.sin(v336);
            this.angles.push(v337);
            if (this.angles.length > 5) {
              this.angles.shift();
            }
            let v339 = this.angles.reduce((p544, p545) => p544 + p545, 0) / this.angles.length;
            v339 += v319;
            let v340 = v339 + Math.PI;
            if (player.items[4] == 15) {
              this.testCanPlace(4, v340, v340 + Math.PI * 2, Math.PI / 24, v317, v334);
            }
          }
        }
        let v341 = [];
        gameObjects.forEach(p546 => {
          if (p546.dmg === true && p546.isTeamObj(player)) {
            v341.push(p546);
          }
        });
        if (v308) {
          if (player.items[4] == 15) {
            this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, v317, 1);
          }
          v308 = false;
        }
        let v342 = false;
        v341.forEach(p547 => {
          if (p501.getDist(p547, player, 0, 2) <= 200) {
            let v343 = Math.atan2(p547.y2 - player.y2, p547.x2 - player.x2);
            let v344 = Math.atan2(near.y2 - p547.y2, near.x2 - p547.x2);
            let v345 = p501.nearestAngle(v343, v344);
            let v346 = 87;
            let v347 = player.x2 + v346 * Math.cos(v345);
            let v348 = player.y2 + v346 * Math.sin(v345);
            let v349 = p501.getDist(near, {
              x2: v347,
              y2: v348
            }, 0, 2);
            if (p501.getDist(p541, near, 0, 2) <= 87 && v349 > 1 + v346) {
              place(2, v345);
              v342 = true;
            }
          }
        });
        if (!v342) {
          if (near.dist2 <= 250 && !v307) {
            for (let v350 = 0; v350 < 24; v350 += 2) {
              let v351 = Math.PI * 2 * v350 / 24;
              this.testCanPlace(2, v351, v351 + Math.PI / 24, Math.PI / 24, v317, 1);
              v308 = true;
              break;
            }
          }
          if (v318 <= 250 && near.dist2 <= 250) {
            let v352 = this.checkSpikeTick();
            if (!v352 && near.dist3 <= p502.weapons[near.primaryIndex || 5 || 7 || 4 || 0].range + near.scale * 1.8) {
              for (let v353 = 0; v353 < 24; v353 += 2) {
                let v354 = Math.PI * 2 * v353 / 24;
                this.testCanPlace(2, v354, v354 + Math.PI / 24, Math.PI / 24, v317, 1);
                this.testCanPlace(2, Math.PI / 2, Math.PI / 2, Math.PI / 2, near, v317, 1);
                v307 = true;
                break;
              }
            } else if (player.items[4] == 15) {
              this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, v317, 1);
            }
            this.replaced = true;
          }
        }
      }, 1);
    };
    this.replacer = function (p548) {
      const v355 = gameObjects.filter(p549 => p549.trap && p549.active).sort((p550, p551) => p501.getDist(p550, near, 0, 2) - p501.getDist(p551, near, 0, 2)).find(p552 => {
        const v356 = Math.hypot(p552.y - near.y2, p552.x - near.x2);
        return p552 !== player && (player.sid === p552.owner.sid || findAllianceBySid(p552.owner.sid)) && v356 <= 50;
      });
      if (!p548 || !configs.autoReplace) {
        return;
      }
      if (!inGame) {
        return;
      }
      if (this.antiTrapped) {
        return;
      }
      if (v357 <= p502.weapons[player.weaponIndex].range + player.scale) {
        return;
      }
      let v357 = p501.getDist(p548, player, 0, 2);
      let v358 = p501.getDirect(p548, player, 0, 2);
      if (v357 <= 400 && near.dist2 <= 400) {
        if (near.dist2 < 250) {
          for (let v359 = 0; v359 < Math.PI * 2; v359 += Math.PI / 9) {
            checkPlace(2, near.aim2 + v359);
          }
        } else {
          for (let v360 = 0; v360 < Math.PI * 2; v360 += Math.PI / 9) {
            checkPlace(4, near.aim2 + v360);
          }
        }
        this.replaced = true;
      }
    };
  }
}
;
class Instakill {
  constructor() {
    this.wait = false;
    this.can = false;
    this.isTrue = false;
    this.nobull = false;
    this.ticking = false;
    this.canSpikeTick = false;
    this.canSpikeSync = false;
    this.startTick = false;
    this.readyTick = false;
    this.canCounter = false;
    this.revTick = false;
    this.syncHit = false;
    this.changeType = function (p553) {
      this.wait = false;
      this.isTrue = true;
      my.autoAim = true;
      let v361 = [p553];
      let v362 = near.backupNobull;
      near.backupNobull = false;
      if (p553 == "rev") {
        healer1();
        selectWeapon(player.weapons[1]);
        buyEquip(53, 0);
        sendAutoGather();
        setTimeout(() => {
          selectWeapon(player.weapons[0]);
          buyEquip(7, 0);
          setTimeout(() => {
            sendAutoGather();
            this.isTrue = false;
            my.autoAim = false;
          }, 225);
        }, 100);
      } else if (p553 == "nobull") {
        selectWeapon(player.weapons[0]);
        healer1();
        buyEquip(7, 0);
        sendAutoGather();
        setTimeout(() => {
          selectWeapon(player.weapons[1]);
          buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
          setTimeout(() => {
            sendAutoGather();
            this.isTrue = false;
            my.autoAim = false;
          }, 255);
        }, 105);
      } else if (p553 == "normal") {
        selectWeapon(player.weapons[0]);
        healer1();
        buyEquip(7, 0);
        sendAutoGather();
        game.tickBase(() => {
          selectWeapon(player.weapons[1]);
          buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
          setTimeout(() => {
            sendAutoGather();
            this.isTrue = false;
            my.autoAim = false;
          }, 100);
        }, 1);
      } else {
        setTimeout(() => {
          this.isTrue = false;
          my.autoAim = false;
        }, 50);
      }
    };
    this.syncTry = function () {
      if (getEl("synctype").value == "rangesync") {
        buyEquip(53, 0);
        game.tickBase(() => {
          this.isTrue = true;
          my.autoAim = true;
          selectWeapon(player.weapons[1]);
          sendAutoGather();
          game.tickBase(() => {
            my.autoAim = false;
            this.isTrue = false;
            sendAutoGather();
          }, 1);
        }, 2);
      } else if (getEl("synctype").value == "instasync") {
        return "insta them";
      } else {
        this.isTrue = true;
        my.autoAim = true;
        selectWeapon(player.weapons[0]);
        buyEquip(7, 0);
        buyEquip(21, 1);
        sendAutoGather();
        game.tickBase(() => {
          if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
            selectWeapon(player.weapons[0]);
            buyEquip(53, 0);
            buyEquip(21, 1);
            game.tickBase(() => {
              sendAutoGather();
              this.isTrue = false;
              my.autoAim = false;
            }, 1);
          } else {
            sendAutoGather();
            this.isTrue = false;
            my.autoAim = false;
          }
        }, 1);
      }
      ;
    };
    this.spikeTickType = function () {
      this.isTrue = true;
      my.autoAim = true;
      selectWeapon(player.weapons[0]);
      buyEquip(7, 0);
      buyEquip(21, 1);
      sendAutoGather();
      game.tickBase(() => {
        if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
          selectWeapon(player.weapons[0]);
          buyEquip(53, 0);
          buyEquip(21, 1);
          game.tickBase(() => {
            sendAutoGather();
            this.isTrue = false;
            my.autoAim = false;
          }, 1);
        } else {
          sendAutoGather();
          this.isTrue = false;
          my.autoAim = false;
        }
      }, 1);
    };
    this.counterType = function () {
      this.isTrue = true;
      my.autoAim = true;
      selectWeapon(player.weapons[0]);
      buyEquip(7, 0);
      buyEquip(21, 1);
      sendAutoGather();
      game.tickBase(() => {
        if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
          selectWeapon(player.weapons[0]);
          buyEquip(53, 0);
          buyEquip(21, 1);
          game.tickBase(() => {
            sendAutoGather();
            this.isTrue = false;
            my.autoAim = false;
          }, 1);
        } else {
          sendAutoGather();
          this.isTrue = false;
          my.autoAim = false;
        }
      }, 1);
    };
    this.oneTickType = function () {
      this.isTrue = true;
      my.autoAim = true;
      selectWeapon(player.weapons[1]);
      buyEquip(53, 0);
      packet("f", near.aim2, 1);
      if (player.weapons[1] == 15) {
        my.revAim = true;
        sendAutoGather();
      }
      game.tickBase(() => {
        my.revAim = false;
        selectWeapon(player.weapons[0]);
        buyEquip(7, 0);
        buyEquip(19, 1);
        packet("f", near.aim2, 1);
        if (player.weapons[1] != 15) {
          sendAutoGather();
        }
        game.tickBase(() => {
          sendAutoGather();
          this.isTrue = false;
          my.autoAim = false;
          packet("f", undefined, 1);
        }, 1);
      }, 1);
    };
    this.gotoGoal = function (p554, p555) {
      let vF = p556 => p556 * config.playerScale;
      let v363 = {
        a: p554 - p555,
        b: p554 + p555,
        c: p554 - vF(1),
        d: p554 + vF(1),
        e: p554 - vF(2),
        f: p554 + vF(2),
        g: p554 - vF(4),
        h: p554 + vF(4)
      };
      let vF2 = function (p557, p558) {
        if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && p558 == 0) {
          buyEquip(31, 0);
        } else {
          buyEquip(p557, p558);
        }
      };
      if (enemy.length) {
        let v364 = near.dist2;
        this.ticking = true;
        if (v364 >= v363.a && v364 <= v363.b) {
          vF2(22, 0);
          vF2(11, 1);
          if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
          }
          return {
            dir: undefined,
            action: 1
          };
        } else {
          if (v364 < v363.a) {
            if (v364 >= v363.g) {
              if (v364 >= v363.e) {
                if (v364 >= v363.c) {
                  vF2(40, 0);
                  vF2(21, 1);
                  if (getEl("slowOT").checked) {
                    if (player.buildIndex != player.items[1]) {
                      selectToBuild(player.items[1]);
                    }
                  } else if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                  }
                } else {
                  vF2(26, 0);
                  vF2(21, 1);
                  if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                  }
                }
              } else {
                vF2(26, 0);
                vF2(12, 1);
                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                  selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                }
              }
            } else {
              biomeGear();
              vF2(11, 1);
              if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
              }
            }
            return {
              dir: near.aim2 + Math.PI,
              action: 0
            };
          } else if (v364 > v363.b) {
            if (v364 <= v363.h) {
              if (v364 <= v363.f) {
                if (v364 <= v363.d) {
                  vF2(40, 0);
                  vF2(9, 1);
                  if (getEl("slowOT").checked) {
                    if (player.buildIndex != player.items[1]) {
                      selectToBuild(player.items[1]);
                    }
                  } else if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                  }
                } else {
                  vF2(22, 0);
                  vF2(19, 1);
                  if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                  }
                }
              } else {
                vF2(6, 0);
                vF2(12, 1);
                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                  selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                }
              }
            } else {
              biomeGear();
              vF2(19, 1);
              if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
              }
            }
            return {
              dir: near.aim2,
              action: 0
            };
          }
          return {
            dir: undefined,
            action: 0
          };
        }
      } else {
        this.ticking = false;
        return {
          dir: undefined,
          action: 0
        };
      }
    };
    this.bowMovement = function () {
      let v365 = this.gotoGoal(685, 3);
      if (v365.action) {
        if (player.reloads[53] == 0 && !this.isTrue) {
          this.rangeType("ageInsta");
        } else {
          packet("f", v365.dir, 1);
        }
      } else {
        packet("f", v365.dir, 1);
      }
    };
    this.tickMovement = function () {
      let v366 = this.gotoGoal([10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop ? 240 : player.weapons[1] == 15 ? 250 : player.y2 <= config.snowBiomeTop ? [10, 14].includes(player.weapons[1]) ? 270 : 265 : 275, 3);
      if (v366.action) {
        if (![6, 22].includes(near.skinIndex) && player.reloads[53] == 0 && !this.isTrue) {
          if ([10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop || player.weapons[1] == 15) {
            this.oneTickType();
          } else {
            this.threeOneTickType();
          }
        } else {
          packet("f", v366.dir, 1);
        }
      } else {
        packet("f", v366.dir, 1);
      }
    };
    this.kmTickMovement = function () {
      let v367 = this.gotoGoal(240, 3);
      if (v367.action) {
        if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && (game.tick - near.poisonTick) % config.serverUpdateRate == 8) {
          this.kmTickType();
        } else {
          packet("f", v367.dir, 1);
        }
      } else {
        packet("f", v367.dir, 1);
      }
    };
    this.boostTickMovement = function () {
      let v368 = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 390 : player.weapons[1] == 15 ? 365 : 370;
      let v369 = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1.5 : player.weapons[1] == 15 ? 2 : 3;
      let v370 = this.gotoGoal(v368, v369);
      if (v370.action) {
        if (player.reloads[53] == 0 && !this.isTrue) {
          this.boostTickType();
        } else {
          packet("f", v370.dir, 1);
        }
      } else {
        packet("f", v370.dir, 1);
      }
    };
    this.perfCheck = function (p559, p560) {
      if (p560.weaponIndex == 11 && UTILS.getAngleDist(p560.aim2 + Math.PI, p560.d2) <= config.shieldAngle) {
        return false;
      }
      if (![9, 12, 13, 15].includes(player.weapons[1])) {
        return true;
      }
      let v371 = {
        x: p560.x2 + Math.cos(p560.aim2 + Math.PI) * 70,
        y: p560.y2 + Math.sin(p560.aim2 + Math.PI) * 70
      };
      if (UTILS.lineInRect(p559.x2 - p559.scale, p559.y2 - p559.scale, p559.x2 + p559.scale, p559.y2 + p559.scale, v371.x, v371.y, v371.x, v371.y)) {
        return true;
      }
      let v372 = ais.filter(p561 => p561.visible).find(p562 => {
        if (UTILS.lineInRect(p562.x2 - p562.scale, p562.y2 - p562.scale, p562.x2 + p562.scale, p562.y2 + p562.scale, v371.x, v371.y, v371.x, v371.y)) {
          return true;
        }
      });
      if (v372) {
        return false;
      }
      v372 = gameObjects.filter(p563 => p563.active).find(p564 => {
        let v373 = p564.getScale();
        if (!p564.ignoreCollision && UTILS.lineInRect(p564.x - v373, p564.y - v373, p564.x + v373, p564.y + v373, v371.x, v371.y, v371.x, v371.y)) {
          return true;
        }
      });
      if (v372) {
        return false;
      }
      return true;
    };
  }
}
;
class Autobuy {
  constructor(p565, p566) {
    this.hat = function () {
      p565.forEach(p567 => {
        let vFindID3 = findID(hats, p567);
        if (vFindID3 && !player.skins[p567] && player.points >= vFindID3.price) {
          packet("c", 1, p567, 0);
        }
      });
    };
    this.acc = function () {
      p566.forEach(p568 => {
        let vFindID4 = findID(accessories, p568);
        if (vFindID4 && !player.tails[p568] && player.points >= vFindID4.price) {
          packet("c", 1, p568, 1);
        }
      });
    };
  }
}
;
class Autoupgrade {
  constructor() {
    this.sb = function (p569) {
      p569(3);
      p569(17);
      p569(31);
      p569(23);
      p569(9);
      p569(38);
    };
    this.kh = function (p570) {
      p570(3);
      p570(17);
      p570(31);
      p570(23);
      p570(10);
      p570(38);
      p570(4);
      p570(25);
    };
    this.pb = function (p571) {
      p571(5);
      p571(17);
      p571(32);
      p571(23);
      p571(9);
      p571(38);
    };
    this.ph = function (p572) {
      p572(5);
      p572(17);
      p572(32);
      p572(23);
      p572(10);
      p572(38);
      p572(28);
      p572(25);
    };
    this.db = function (p573) {
      p573(7);
      p573(17);
      p573(31);
      p573(23);
      p573(9);
      p573(34);
    };
    this.km = function (p574) {
      p574(7);
      p574(17);
      p574(31);
      p574(23);
      p574(10);
      p574(38);
      p574(4);
      p574(15);
    };
  }
}
;
class Damages {
  constructor(p575) {
    this.calcDmg = function (p576, p577) {
      return p576 * p577;
    };
    this.getAllDamage = function (p578) {
      return [this.calcDmg(p578, 0.75), p578, this.calcDmg(p578, 1.125), this.calcDmg(p578, 1.5)];
    };
    this.weapons = [];
    for (let v374 = 0; v374 < p575.weapons.length; v374++) {
      let v375 = p575.weapons[v374];
      let v376 = v375.name.split(" ").length <= 1 ? v375.name : v375.name.split(" ")[0] + "_" + v375.name.split(" ")[1];
      this.weapons.push(this.getAllDamage(v374 > 8 ? v375.Pdmg : v375.dmg));
      this[v376] = this.weapons[v374];
    }
  }
}
let tmpList = [];
let UTILS = new Utils();
let items = new Items();
let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
let store = new Store();
let hats = store.hats;
let accessories = store.accessories;
let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
let textManager = new Textmanager();
let traps = new Traps(UTILS, items);
let instaC = new Instakill();
let sCombat = new Combat(UTILS, items);
let autoBuy = new Autobuy([40, 6, 7, 22, 53, 15, 31], [11, 19, 21, 13]);
let autoUpgrade = new Autoupgrade();
let lastDeath;
let minimapData;
let mapMarker = {};
let mapPings = [];
let tmpPing;
let breakTrackers = [];
let pathFindTest = 0;
let grid = [];
let pathFind = {
  active: false,
  grid: 40,
  scale: 1440,
  x: 14400,
  y: 14400,
  chaseNear: false,
  array: [],
  lastX: this.grid / 2,
  lastY: this.grid / 2
};
function sendChat(p579) {
  packet("6", p579.slice(0, 30));
}
let runAtNextTick = [];
function checkProjectileHolder(p580, p581, p582, p583, p584, p585, p586, p587) {
  let v377 = p585 == 0 ? 9 : p585 == 2 ? 12 : p585 == 3 ? 13 : p585 == 5 && 15;
  let v378 = config.playerScale * 2;
  let v379 = {
    x: p585 == 1 ? p580 : p580 - v378 * Math.cos(p582),
    y: p585 == 1 ? p581 : p581 - v378 * Math.sin(p582)
  };
  let v380 = players.filter(p588 => p588.visible && UTILS.getDist(v379, p588, 0, 2) <= p588.scale).sort(function (p589, p590) {
    return UTILS.getDist(v379, p589, 0, 2) - UTILS.getDist(v379, p590, 0, 2);
  })[0];
  if (v380) {
    if (p585 == 1) {
      v380.shooting[53] = 1;
    } else {
      v380.shootIndex = v377;
      v380.shooting[1] = 1;
      antiProj(v380, p582, p583, p584, p585, v377);
    }
  }
}
let projectileCount = 0;
function antiProj(p591, p592, p593, p594, p595, p596) {
  if (!p591.isTeam(player)) {
    tmpDir = UTILS.getDirect(player, p591, 2, 2);
    if (UTILS.getAngleDist(tmpDir, p592) <= 0.2) {
      p591.bowThreat[p596]++;
      if (p595 == 5) {
        projectileCount++;
      }
      setTimeout(() => {
        p591.bowThreat[p596]--;
        if (p595 == 5) {
          projectileCount--;
        }
      }, p593 / p594);
      if (p591.bowThreat[9] >= 1 && (p591.bowThreat[12] >= 1 || p591.bowThreat[15] >= 1)) {
        place(1, p591.aim2);
        my.anti0Tick = 4;
        if (!my.antiSync) {
          antiSyncHealing(4);
        }
      } else if (projectileCount >= 2) {
        place(1, p591.aim2);
        healer();
        buyEquip(22, 0);
        buyEquip(13, 1);
        my.anti0Tick = 4;
        if (!my.antiSync) {
          autoQ = true;
          antiSyncHealing(4);
        }
      } else if (projectileCount === 1) {
        buyEquip(6, 0);
        buyEquip(26, 0);
        healer();
        game.tickBase(() => {}, 2);
      }
    }
  }
}
function showItemInfo(p597, p598, p599) {
  if (player && p597) {
    UTILS.removeAllChildren(itemInfoHolder);
    itemInfoHolder.classList.add("visible");
    UTILS.generateElement({
      id: "itemInfoName",
      text: UTILS.capitalizeFirst(p597.name),
      parent: itemInfoHolder
    });
    UTILS.generateElement({
      id: "itemInfoDesc",
      text: p597.desc,
      parent: itemInfoHolder
    });
    if (p599) {} else if (p598) {
      UTILS.generateElement({
        class: "itemInfoReq",
        text: !p597.type ? "primary" : "secondary",
        parent: itemInfoHolder
      });
    } else {
      for (let v381 = 0; v381 < p597.req.length; v381 += 2) {
        UTILS.generateElement({
          class: "itemInfoReq",
          html: p597.req[v381] + "<span class='itemInfoReqVal'> x" + p597.req[v381 + 1] + "</span>",
          parent: itemInfoHolder
        });
      }
      if (p597.group.limit) {
        UTILS.generateElement({
          class: "itemInfoLmt",
          text: (player.itemCounts[p597.group.id] || 0) + "/" + (config.isSandbox ? 99 : p597.group.limit),
          parent: itemInfoHolder
        });
      }
    }
  } else {
    itemInfoHolder.classList.remove("visible");
  }
}
window.addEventListener("resize", UTILS.checkTrusted(resize));
function resize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  let v382 = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
  gameCanvas.width = screenWidth * pixelDensity;
  gameCanvas.height = screenHeight * pixelDensity;
  gameCanvas.style.width = screenWidth + "px";
  gameCanvas.style.height = screenHeight + "px";
  mainContext.setTransform(v382, 0, 0, v382, (screenWidth * pixelDensity - maxScreenWidth * v382) / 2, (screenHeight * pixelDensity - maxScreenHeight * v382) / 2);
}
resize();
var usingTouch;
const mals = document.getElementById("touch-controls-fullscreen");
mals.style.display = "block";
mals.addEventListener("mousemove", gameInput, false);
function gameInput(p600) {
  mouseX = p600.clientX;
  mouseY = p600.clientY;
}
let clicks = {
  left: false,
  middle: false,
  right: false
};
mals.addEventListener("mousedown", mouseDown, false);
function mouseDown(p601) {
  if (attackState != 1) {
    attackState = 1;
    if (p601.button == 0) {
      my.autoAim = true;
      clicks.left = true;
    } else if (p601.button == 1) {
      clicks.middle = true;
    } else if (p601.button == 2) {
      clicks.right = true;
    }
  }
}
mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));
function mouseUp(p602) {
  if (attackState != 0) {
    attackState = 0;
    if (p602.button == 0) {
      my.autoAim = false;
      clicks.left = false;
    } else if (p602.button == 1) {
      clicks.middle = false;
    } else if (p602.button == 2) {
      clicks.right = false;
    }
  }
}
mals.addEventListener("wheel", wheel, false);
function wheel(p603) {
  if (player.shameCount > 1 && !near) {
    buyEquip(7, 0);
  } else {
    buyEquip(6, 0);
  }
}
function getMoveDir() {
  let v383 = 0;
  let v384 = 0;
  for (let v385 in moveKeys) {
    let v386 = moveKeys[v385];
    v383 += !!keys[v385] * v386[0];
    v384 += !!keys[v385] * v386[1];
  }
  if (v383 == 0 && v384 == 0) {
    return undefined;
  } else {
    return Math.atan2(v384, v383);
  }
}
function getSafeDir() {
  if (!player) {
    return 0;
  }
  if (!player.lockDir) {
    lastDir = Math.atan2(mouseY - screenHeight / 2, mouseX - screenWidth / 2);
  }
  return lastDir || 0;
}
function getAttackDir(p604) {
  if (p604) {
    if (!player) {
      return "0";
    }
    if (my.autoAim || (clicks.left || useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) && player.reloads[player.weapons[0]] == 0) {
      lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
      lastDir = "getSafeDir()";
    } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
      lastDir = "traps.aim";
    } else if (!player.lockDir) {
      if (getEl("noDir").checked) {
        return "undefined";
      }
      lastDir = "getSafeDir()";
    }
    return lastDir;
  } else {
    if (!player) {
      return 0;
    }
    if (my.autoAim || (clicks.left || useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) && player.reloads[player.weapons[0]] == 0) {
      lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? near.aim2 + Math.PI : near.aim2 : getSafeDir();
    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
      lastDir = getSafeDir();
    } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
      lastDir = traps.aim;
    } else if (!player.lockDir) {
      if (getEl("noDir").checked) {
        return undefined;
      }
      lastDir = getSafeDir();
    }
    return lastDir || 0;
  }
}
function getVisualDir() {
  if (!player) {
    return 0;
  }
  if (my.autoAim || (clicks.left || useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) && player.reloads[player.weapons[0]] == 0) {
    lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? near.aim2 + Math.PI : near.aim2 : getSafeDir();
  } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
    lastDir = getSafeDir();
  } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
    lastDir = traps.aim;
  } else if (!player.lockDir) {
    lastDir = getSafeDir();
  }
  return lastDir || 0;
}
function keysActive() {
  return allianceMenu.style.display != "block" && chatHolder.style.display != "block" && !menuCBFocus;
}
function toggleMenuChat() {
  if (menuChatDiv.style.display != "none") {
    let vF3 = function (p605) {
      return {
        found: p605.startsWith("/") && commands[p605.slice(1).split(" ")[0]]
      };
    };
    let vVF3 = vF3(menuChatBox.value);
    if (vVF3.found) {
      if (typeof vVF3.fv.action === "function") {
        vVF3.fv.action(menuChatBox.value);
      }
    } else {
      sendChat(menuChatBox.value);
    }
    menuChatBox.value = "";
    menuChatBox.blur();
  } else if (menuCBFocus) {
    menuChatBox.blur();
  } else {
    menuChatBox.focus();
  }
}
function keyDown(p606) {
  let v387 = p606.which || p606.keyCode || 0;
  if (player && player.alive && keysActive()) {
    if (!keys[v387]) {
      keys[v387] = 1;
      macro[p606.key] = 1;
      if (v387 == 27) {
        openMenu = !openMenu;
        $("#menuDiv").toggle();
        $("#menuChatDiv").toggle();
      } else if (v387 == 69) {
        sendAutoGather();
      } else if (v387 == 67) {
        updateMapMarker();
      } else if (player.weapons[v387 - 49] != undefined) {
        player.weaponCode = player.weapons[v387 - 49];
      } else if (moveKeys[v387]) {
        sendMoveDir();
      } else if (p606.key == "m") {
        pads.placeSpawnPads = !pads.placeSpawnPads;
      } else if (p606.key == "z") {
        mills.place = !mills.place;
      } else if (p606.key == "0") {
        sendChat(".sync");
      } else if (p606.key == "Z") {
        if (typeof window.debug == "function") {
          window.debug();
        }
      } else if (v387 == 32) {
        packet("F", 1, getSafeDir(), 1);
        packet("F", 0, getSafeDir(), 1);
      } else if (p606.key == ",") {
        io.send("6", "syncon");
        project.send(JSON.stringify(["tezt", "ratio"]));
        botSkts.push([botPlayer]);
        for (let v388 = 0; v388 < botz.length; v388++) {
          if (botz[v388][0]) {
            botz[v388][0].zync(near);
            console.log(botz[v388][0]);
          }
          project.send("tezt");
          botSkts.forEach(p607 => {
            p607.zync();
          });
          io.send("S", 1);
        }
      }
    }
  }
}
let intervalId;
document.addEventListener("keydown", function (p608) {
  if (["allianceinput", "chatbox", "nameinput", "storeHolder"].includes(document.activeElement.id.toLowerCase())) {
    return null;
  }
  if (p608.key === "p") {
    songChat = !songChat;
    if (songChat) {
      playSongLyrics();
    }
  }
});
function oneTick() {
  my.autoAim = true;
  buyEquip(53, 0);
  selectWeapon(player.weapons[0]);
  game.tickBase(() => {
    buyEquip(7, 0);
    sendAutoGather();
    game.tickBase(() => {
      sendAutoGather();
      my.autoAim = false;
    }, 1);
  }, 1);
}
let songChat = false;
const lyrics = [{
  line: "I'm going back to 505",
  delay: 0
}, {
  line: "If it's a 7 hour flight",
  delay: 3000
}, {
  line: "Or a 45 minute drive",
  delay: 2000
}, {
  line: "In my imagination",
  delay: 3000
}, {
  line: "You're waiting lying",
  delay: 2000
}, {
  line: "on your side",
  delay: 2000
}, {
  line: "With your hands",
  delay: 2000
}, {
  line: "between your thighs",
  delay: 1000
}, {
  line: "Stop and wait a sec",
  delay: 6000
}, {
  line: "When you look at me",
  delay: 2000
}, {
  line: "like that",
  delay: 2000
}, {
  line: "My darling, what did",
  delay: 1500
}, {
  line: "you expect?",
  delay: 2000
}, {
  line: "I probably still adore you",
  delay: 3000
}, {
  line: "With your hands around",
  delay: 2000
}, {
  line: "my neck",
  delay: 2000
}, {
  line: "Or I did last time",
  delay: 2500
}, {
  line: "I checked",
  delay: 2000
}, {
  line: "Not shy of a spark",
  delay: 7000
}, {
  line: "The knife twists",
  delay: 2500
}, {
  line: "at the thought",
  delay: 2000
}, {
  line: "That I should fall short",
  delay: 2500
}, {
  line: "of the mark",
  delay: 2000
}, {
  line: "Frightened by the bite",
  delay: 3000
}, {
  line: "Though it's no harsher",
  delay: 2500
}, {
  line: "than the bark",
  delay: 2000
}, {
  line: "A middle of adventure",
  delay: 4000
}, {
  line: "Such a perfect place",
  delay: 4000
}, {
  line: "to start",
  delay: 2000
}, {
  line: "I'm going back to 505",
  delay: 7000
}, {
  line: "If it's a 7 hour flight",
  delay: 3000
}, {
  line: "Or a 45 minute drive",
  delay: 2000
}, {
  line: "In my imagination",
  delay: 3000
}, {
  line: "You're waiting lying",
  delay: 2000
}, {
  line: "on your side",
  delay: 2000
}, {
  line: "With your hands",
  delay: 2000
}, {
  line: "between your thighs",
  delay: 1000
}, {
  line: "But I crumble completely",
  delay: 12000
}, {
  line: "When you cry",
  delay: 2500
}, {
  line: "It seems like once again",
  delay: 4000
}, {
  line: "You've had to greet me",
  delay: 2000
}, {
  line: "with goodbye",
  delay: 2000
}, {
  line: "I'm always just about to",
  delay: 3000
}, {
  line: "Go and spoil a surprise",
  delay: 2000
}, {
  line: "Take my hands off",
  delay: 3000
}, {
  line: "of your eyes",
  delay: 2000
}, {
  line: "Too soon",
  delay: 2000
}, {
  line: "I'm going back to 505",
  delay: 7000
}, {
  line: "If it's a 7 hour flight",
  delay: 3000
}, {
  line: "Or a 45 minute drive",
  delay: 2000
}, {
  line: "In my imagination",
  delay: 3000
}, {
  line: "You're waiting lying",
  delay: 2000
}, {
  line: "on your side",
  delay: 2000
}, {
  line: "With your hands",
  delay: 2000
}, {
  line: "between your thighs",
  delay: 1000
}];
function playSongLyrics() {
  let v389 = 0;
  for (let v390 = 0; v390 < lyrics.length; v390++) {
    const {
      line: _0x37349f,
      delay: _0x28153a
    } = lyrics[v390];
    v389 += _0x28153a;
    setTimeout(() => {
      if (songChat) {
        sendChat(_0x37349f);
      }
    }, v389);
  }
}
addEventListener("keydown", UTILS.checkTrusted(keyDown));
function keyUp(p609) {
  if (player && player.alive) {
    let v391 = p609.which || p609.keyCode || 0;
    if (v391 == 13) {
      toggleMenuChat();
    } else if (keysActive()) {
      if (keys[v391]) {
        keys[v391] = 0;
        macro[p609.key] = 0;
        if (moveKeys[v391]) {
          sendMoveDir();
        } else if (p609.key == ",") {
          player.sync = false;
        }
      }
    }
  }
}
window.addEventListener("keyup", UTILS.checkTrusted(keyUp));
function sendMoveDir() {
  if (found) {
    packet("f", undefined, 1);
  } else {
    let vGetMoveDir = getMoveDir();
    if (lastMoveDir == undefined || vGetMoveDir == undefined || Math.abs(vGetMoveDir - lastMoveDir) > 0.3) {
      if (!my.autoPush && !found) {
        packet("f", vGetMoveDir, 1);
      }
      lastMoveDir = vGetMoveDir;
    }
  }
}
function bindEvents() {}
bindEvents();
function chechPathColl(p610) {
  return (player.scale + p610.getScale()) / (player.maxSpeed * items.weapons[player.weaponIndex].spdMult) + (p610.dmg && !p610.isTeamObject(player) ? 35 : 0);
  if (p610.colDiv == 0.5) {
    return p610.scale * p610.colDiv;
  } else if (!p610.isTeamObject(player) && p610.dmg) {
    return p610.scale + player.scale;
  } else if (p610.isTeamObject(player) && p610.trap) {
    return 0;
  } else {
    return p610.scale;
  }
}
function checkObject() {
  let v392 = gameObjects.filter(p611 => player.canSee(p611) && p611.active);
  for (let v393 = 0; v393 < pathFind.grid; v393++) {
    grid[v393] = [];
    for (let v394 = 0; v394 < pathFind.grid; v394++) {
      let v395 = {
        x: player.x2 - pathFind.scale / 2 + pathFind.scale / pathFind.grid * v394,
        y: player.y2 - pathFind.scale / 2 + pathFind.scale / pathFind.grid * v393
      };
      if (UTILS.getDist(pathFind.chaseNear ? near : pathFind, v395, pathFind.chaseNear ? 2 : 0, 0) <= (pathFind.chaseNear ? 35 : 60)) {
        pathFind.lastX = v394;
        pathFind.lastY = v393;
        grid[v393][v394] = 0;
        continue;
      }
      let v396 = v392.find(p612 => UTILS.getDist(p612, v395, 0, 0) <= chechPathColl(p612));
      if (v396) {
        if (v396.trap) {
          grid[v393][v394] = 0;
          continue;
        }
        grid[v393][v394] = 1;
      } else {
        grid[v393][v394] = 0;
      }
    }
  }
}
function createPath() {
  grid = [];
  checkObject();
}
function Pathfinder() {
  pathFind.scale = config.maxScreenWidth / 2 * 1.3;
  if (!traps.inTrap && (pathFind.chaseNear ? enemy.length : true)) {
    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
      packet("f", undefined, 1);
    } else {
      createPath();
      easystar.setGrid(grid);
      easystar.setAcceptableTiles([0]);
      easystar.enableDiagonals();
      easystar.findPath(grid[0].length / 2, grid.length / 2, pathFind.lastX, pathFind.lastY, function (p613) {
        if (p613 === null) {
          pathFind.array = [];
          if (near.dist2 <= items.weapons[player.weapons[0]].range) {
            packet("f", undefined, 1);
          } else {
            packet("f", near.aim2, 1);
          }
        } else {
          pathFind.array = p613;
          if (pathFind.array.length > 1) {
            let v397 = {
              x: player.x2 - pathFind.scale / 2 + pathFind.scale / pathFind.grid * p613[1].x,
              y: player.y2 - pathFind.scale / 2 + pathFind.scale / pathFind.grid * p613[1].y
            };
            packet("f", UTILS.getDirect(v397, player, 0, 2), 1);
          }
        }
      });
      easystar.calculate();
    }
  }
}
let isItemSetted = [];
function updateItemCountDisplay(p614 = undefined) {
  for (let v398 = 3; v398 < items.list.length; ++v398) {
    let v399 = items.list[v398].group.id;
    let v400 = items.weapons.length + v398;
    if (!isItemSetted[v400]) {
      isItemSetted[v400] = document.createElement("div");
      isItemSetted[v400].id = "itemCount" + v400;
      getEl("actionBarItem" + v400).appendChild(isItemSetted[v400]);
      isItemSetted[v400].style = "\n                        display: block;\n                        position: absolute;\n                        padding-left: 5px;\n                        font-size: 20px;\n                        font-family: 'Hammersmith One', cursive;\n                        color: #fff;\n                        ";
      isItemSetted[v400].innerHTML = player.itemCounts[v399] || 0;
    } else if (p614 == v399) {
      isItemSetted[v400].innerHTML = player.itemCounts[p614] || 0;
    }
  }
}
function fgdo(p615, p616) {
  return Math.sqrt(Math.pow(p616.y - p615.y, 2) + Math.pow(p616.x - p615.x, 2));
}
function autoPush() {
  let v401 = liztobj.filter(p617 => p617.trap && p617.active && p617.isTeamObject(player) && UTILS.getDist(p617, near, 0, 2) <= near.scale + p617.getScale() + 5).sort(function (p618, p619) {
    return UTILS.getDist(p618, near, 0, 2) - UTILS.getDist(p619, near, 0, 2);
  })[0];
  if (v401) {
    let v402 = liztobj.filter(p620 => p620.dmg && p620.active && p620.isTeamObject(player) && UTILS.getDist(p620, v401, 0, 0) <= near.scale + v401.scale + p620.scale).sort(function (p621, p622) {
      return UTILS.getDist(p621, near, 0, 2) - UTILS.getDist(p622, near, 0, 2);
    })[0];
    if (v402) {
      let v403 = Math.atan2(near.y2 - v402.y, near.x2 - v402.x);
      let v404 = {
        x: v402.x + Math.cos(UTILS.getDirect(near, v402, 2, 0)) * 250,
        y: v402.y + Math.sin(UTILS.getDirect(near, v402, 2, 0)) * 250,
        x2: v402.x + (UTILS.getDist(near, v402, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, v402, 2, 0)) + Math.cos(25),
        y2: v402.y + (UTILS.getDist(near, v402, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, v402, 2, 0)) + Math.sin(25)
      };
      let v405 = liztobj.filter(p623 => p623.active).find(p624 => {
        let v406 = p624.getScale();
        if (!p624.ignoreCollision && UTILS.lineInRect(p624.x - v406, p624.y - v406, p624.x + v406, p624.y + v406, player.x2, player.y2, v404.x2, v404.y2)) {
          return true;
        }
      });
      if (v405) {
        if (my.autoPush) {
          my.autoPush = false;
          packet("f", lastMoveDir || undefined, 1);
        }
      } else {
        my.autoPush = true;
        my.pushData = {
          x: v402.x + Math.cos(v403),
          y: v402.y + Math.sin(v403),
          x2: player.x2 + 30,
          y2: player.y2 + 30
        };
        let v407 = {
          x: near.x2 + Math.cos(v403) * 30,
          y: near.y2 + Math.sin(v403) * 60
        };
        let v408 = Math.atan2(v407.y - player.y2, v407.x - player.x2);
        packet("f", v408, 1);
        let v409 = player.scale / 10;
        if (UTILS.lineInRect(player.x2 - v409, player.y2 - v409, player.x2 + v409, player.y2 + v409, near.x2, near.y2, v404.x, v404.y)) {
          packet("f", near.aim2, 1);
        } else {
          packet("f", UTILS.getDirect(v404, player, 2, 2), 1);
        }
      }
    } else if (my.autoPush) {
      my.autoPush = false;
      packet("f", lastMoveDir || undefined, 1);
    }
  } else if (my.autoPush) {
    my.autoPush = false;
    packet("f", lastMoveDir || undefined, 1);
  }
}
function knockBackPredict() {
  let v410 = {
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    instax: 0,
    instay: 0,
    turretx: 0,
    turrety: 0
  };
  let v411 = Math.atan2(near.y2 - player.y2, near.x2 - player.x2);
  let vInfinity = Infinity;
  let v412 = gameObjects.filter(p625 => p625.name == "pit trap" && p625.active && p625.isTeamObject(player) && UTILS.getDist(p625, near, 0, 2) <= p625.getScale() + player.scale + 5).sort((p626, p627) => {
    return UTILS.getDist(p626, near, 0, 2) - UTILS.UTILS.getDist(p627, near, 0, 2);
  })[0];
  if (near.dist2 - player.scale * 1.8 <= items.weapons[player.weapons[0]].range && !v412) {
    for (let v413 of gameObjects) {
      let vV410 = v410;
      if (v413.dmg && v413.active && v413.isTeamObject(player)) {
        let v414 = (items.weapons[player.weapons[0]].knock || 0) * items.weapons[player.weapons[0]].range + player.scale * 2;
        let v415 = ![undefined, 9, 12, 13, 15].includes(player.weapons[1]) ? (items.weapons[player.weapons[1]].knock || 0) * items.weapons[player.weapons[1]].range + player.scale * 2 - 10 : player.weapons[1] != undefined ? 60 : 0;
        let v416 = v414 + v415;
        let v417 = player.reloads[53] == 0 ? v414 + v415 + 75 : v416;
        let v418 = near.x2 + v414 * Math.cos(v411);
        let v419 = near.y2 + v414 * Math.sin(v411);
        let v420 = near.x2 + v415 * Math.cos(v411);
        let v421 = near.y2 + v415 * Math.sin(v411);
        let v422 = near.x2 + v416 * Math.cos(v411);
        let v423 = near.y2 + v416 * Math.sin(v411);
        let v424 = near.x2 + v417 * Math.cos(v411);
        let v425 = near.y2 + v417 * Math.sin(v411);
        vV410.x0 = v418;
        vV410.y0 = v419;
        vV410.x1 = v420;
        vV410.y1 = v421;
        vV410.instax = v422;
        vV410.instay = v423;
        vV410.turretx = v424;
        vV410.turrety = v425;
        if (UTILS.getDist({
          x: v418,
          y: v419
        }, v413, 0, 0) <= v413.scale + player.scale && player.reloads[player.weapons[0]] == 0) {
          return "insta them";
        }
        if (UTILS.getDist({
          x: v422,
          y: v423
        }, v413, 0, 0) <= v413.scale + player.scale && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
          return "insta them";
        }
      }
    }
  } else {
    v410 = {
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
      instax: 0,
      instay: 0,
      turretx: 0,
      turrety: 0
    };
  }
  return false;
}
function addDeadPlayer(p628) {
  deadPlayers.push(new DeadPlayer(p628.x, p628.y, p628.dir, p628.buildIndex, p628.weaponIndex, p628.weaponVariant, p628.skinColor, p628.scale, p628.name));
}
function setInitData(p629) {
  alliances = p629.teams;
}
function setupGame(p630) {
  keys = {};
  macro = {};
  playerSID = p630;
  attackState = 0;
  inGame = true;
  packet("F", 0, getAttackDir(), 1);
  my.ageInsta = true;
  if (firstSetup) {
    firstSetup = false;
    gameObjects.length = 0;
    liztobj.length = 0;
  }
}
function addPlayer(p631, p632) {
  let vFindPlayerByID = findPlayerByID(p631[0]);
  if (!vFindPlayerByID) {
    vFindPlayerByID = new Player(p631[0], p631[1], config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories);
    players.push(vFindPlayerByID);
    if (p631[1] != playerSID) {
      notif2("Encountered", p631[2]);
    }
  } else if (p631[1] != playerSID) {
    notif2("Encountered", p631[2]);
  }
  vFindPlayerByID.spawn(p632 ? true : null);
  vFindPlayerByID.visible = false;
  vFindPlayerByID.oldPos = {
    x2: undefined,
    y2: undefined
  };
  vFindPlayerByID.x2 = undefined;
  vFindPlayerByID.y2 = undefined;
  vFindPlayerByID.x3 = undefined;
  vFindPlayerByID.y3 = undefined;
  vFindPlayerByID.setData(p631);
  if (p632) {
    if (!player) {
      window.prepareUI(vFindPlayerByID);
    }
    player = vFindPlayerByID;
    camX = player.x;
    camY = player.y;
    my.lastDir = 0;
    updateItems();
    updateAge();
    updateItemCountDisplay();
    if (player.skins[7]) {
      my.reSync = true;
    }
  }
}
function removePlayer(p633) {
  for (let v426 = 0; v426 < players.length; v426++) {
    if (players[v426].id == p633) {
      players.splice(v426, 1);
      break;
    }
  }
}
Math.getDist = function (p634, p635) {
  try {
    let v427 = p635.x2 || p635.x;
    let v428 = p635.y2 || p635.y;
    let v429 = p634.x2 || p634.x;
    let v430 = p634.y2 || p634.y;
    return Math.sqrt((v429 -= v427) * v429 + (v430 -= v428) * v430);
  } catch (_0x3459c0) {
    return Infinity;
  }
};
Math.getDir = function (p636, p637) {
  try {
    return Math.atan2((p637.y2 || p637.y) - (p636.y2 || p636.y), (p637.x2 || p637.x) - (p636.x2 || p636.x));
  } catch (_0x182e83) {
    return 0;
  }
};
let potSpikeReplace = 0;
function dmgPot() {
  let v431 = 0;
  if (nears.length && player) {
    nears.forEach(p638 => {
      if (Math.getDist(player, p638) <= 300) {
        if (p638.primaryIndex && Math.getDist(player, p638) <= items.weapons[p638.primaryIndex].range + player.scale * 2) {
          if (p638.reloads[p638.primaryIndex] <= 0.2) {
            v431 += items.weapons[p638.primaryIndex].dmg * config.weaponVariants[p638.primaryVariant].val * 1.5;
            if (config.weaponVariants[p638.primaryVariant].src === "_r") {
              v431 += 5;
            }
          } else if (!p638.primaryIndex) {
            v431 += 60;
          }
        }
        if (p638.secondaryIndex && p638.reloads[p638.secondaryIndex] <= 0.2) {
          const v432 = p638.secondaryIndex === 10 ? items.weapons[p638.secondaryIndex].dmg : items.weapons[p638.secondaryIndex].Pdmg;
          v431 += v432;
        } else if (!p638.secondaryIndex) {
          v431 += 50;
        }
        if (p638.reloads[53] <= 0.2 || p638.reloads[53] >= 0.8 && Math.getDist(player, p638) >= 160) {
          v431 += 25;
        } else if (!p638.reloads[53]) {
          v431 += 25;
        }
      }
    });
    liztobj.forEach(p639 => {
      if (p639.dmg && p639.active && p639.ownerSID != player.sid && !p639.isTeamObject(player)) {
        if (Math.getDist(p639, player) <= p639.scale + player.scale + 20) {
          v431 += p639.dmg;
        }
      }
    });
    if (player.skinIndex === 7) {
      v431 += 5;
    } else if (player.skinIndex === 6) {
      v431 = v431 * 0.75;
    } else if (player.skinIndex === 13) {
      v431 = v431 - 3;
    } else if (player.skinIndex === 55) {
      if (player.currentReloads.primary === 1) {
        v431 = v431 - items.weapons[player.weapons[0]].dmg * 0.25;
      }
    } else if (player.skinIndex === 58) {
      if (player.currentReloads.primary === 1) {
        v431 = v431 - items.weapons[player.weapons[0]].dmg * 0.4;
      }
    }
    if (player.tailIndex === 13) {
      v431 = v431 - 3;
    } else if (player.tailIndex === 18) {
      if (player.currentReloads.primary === 1) {
        v431 = v431 - items.weapons[player.weapons[0]].dmg * 0.2;
      }
    }
  }
  return v431;
}
let prevTrap = false;
let prevEnemyBullTick = 0;
let enemyBullTick = 0;
let lastTickDamage = 0;
let skippedTicks = 0;
let countBTicks = 0;
let prevBullTick = 0;
let lastBullTick = 0;
function updateHealth(p640, p641) {
  let vFindPlayerBySID = findPlayerBySID(p640);
  let v433 = {
    weapon: this.secondaryIndex,
    variant: this.secondaryVariant
  };
  if (!vFindPlayerBySID) {
    return;
  }
  if (vFindPlayerBySID) {
    vFindPlayerBySID.oldHealth = vFindPlayerBySID.health;
    vFindPlayerBySID.health = p641;
    vFindPlayerBySID.judgeShame();
    if (vFindPlayerBySID.oldHealth > vFindPlayerBySID.health) {
      vFindPlayerBySID.timeDamaged = Date.now();
      vFindPlayerBySID.damaged = vFindPlayerBySID.oldHealth - vFindPlayerBySID.health;
      let v434 = vFindPlayerBySID.damaged;
      vFindPlayerBySID = findPlayerBySID(p640);
      let v435 = false;
      if (vFindPlayerBySID.health <= 0) {
        if (!vFindPlayerBySID.death) {
          vFindPlayerBySID.death = true;
          addDeadPlayer(vFindPlayerBySID);
        }
      }
      if (vFindPlayerBySID == player) {
        if (vFindPlayerBySID.skinIndex == 7 && (v434 == 5 || vFindPlayerBySID.latestTail == 13 && v434 == 2)) {
          if (my.reSync) {
            my.reSync = false;
            vFindPlayerBySID.setBullTick = true;
          }
          v435 = true;
        }
        let v436 = true;
        let v437 = false;
        let v438 = player.empAnti;
        let v439 = true;
        let v440 = false;
        let v441 = true;
        let v442 = 85;
        let vGetAttacker = getAttacker(v434);
        let v443 = [0.25, 0.45].map(p642 => p642 * items.weapons[player.weapons[0]].dmg);
        let v444 = near.length ? !v435 && v443.includes(v434) && near[0].skinIndex == 11 && near[0].tailIndex == 21 : false;
        function f31(p643) {
          if (v438) {
            setTimeout(() => {
              healer();
            }, p643);
          }
          ;
        }
        ;
        if (vGetAttacker.length) {
          let v445 = vGetAttacker.filter(p644 => {
            if (p644.dist2 <= (p644.weaponIndex < 9 ? 300 : 700)) {
              tmpDir = UTILS.getDirect(player, p644, 2, 2);
              if (UTILS.getAngleDist(tmpDir, p644.d2) <= Math.PI) {
                return p644;
              }
            }
          });
          if (v442 && player.dmg) {
            if (v442) {
              v442 = 65 || 80;
              if (v445.length) {
                let v446 = v444 ? 10 : 10;
                if (v434 > v446 && game.tick - vFindPlayerBySID.antiTimer > 1) {
                  vFindPlayerBySID.canEmpAnti = true;
                  vFindPlayerBySID.antiTimer = game.tick;
                  let v447 = 4;
                  if (vFindPlayerBySID.shameCount < v447) {
                    healer();
                  } else {
                    f31(v442);
                  }
                } else {
                  f31(v442);
                }
              } else {
                f31(v442);
              }
            }
            ;
          }
          ;
        }
        ;
        if (inGame) {
          let v448 = vFindPlayerBySID.weapons[0] == 4 ? 2 : 5;
          let v449 = v434 >= (v444 ? 8 : 20) && vFindPlayerBySID.damageThreat >= 20;
          if (v449 && v441 && game.tick - vFindPlayerBySID.antiTimer > 1) {}
          if (v449 && v440) {
            setTimeout(() => {
              healer();
            }, 120);
          }
          if (v449 && v436 && vFindPlayerBySID.primaryIndex !== "4" && game.tick - vFindPlayerBySID.antiTimer > 1) ;
          if (v434 >= 20 && player.skinIndex == 11 && player.shameCount <= 3) {
            instaC.canCounter = true;
          }
          if (v434 >= 0 && v434 <= 66 && player.shameCount === 4 && vFindPlayerBySID.primaryIndex !== "4") {
            v440 = true;
            v436 = false;
            v437 = false;
            v441 = false;
          } else if (player.shameCount !== 4) {
            v440 = false;
            v436 = true;
            v441 = true;
          }
          if (v434 <= 66 && player.shameCount === 3 && vFindPlayerBySID.primaryIndex !== "4") {
            v436 = false;
          } else if (player.shameCount !== 3) {
            v436 = true;
          }
          if (v434 <= 66 && player.shameCount === 4 && vFindPlayerBySID.primaryIndex !== "4") {
            v437 = true;
          } else if (player.shameCount !== 4) {
            v437 = false;
          }
          if (v434 <= 66 && player.skinIndex != 6 && enemy.weaponIndex === 4) {
            game.tickBase(() => {
              healer1();
            }, 2);
          }
        }
        ;
        let v450 = 100 - player.health;
        if (v434 >= (v444 ? 8 : 20) && vFindPlayerBySID.damageThreat >= 20 && v441 && game.tick - vFindPlayerBySID.antiTimer > 1) {
          if (vFindPlayerBySID.reloads[53] == 0 && vFindPlayerBySID.reloads[vFindPlayerBySID.weapons[1]] == 0) {
            vFindPlayerBySID.canEmpAnti = true;
          } else {
            player.soldierAnti = true;
          }
          vFindPlayerBySID.antiTimer = game.tick;
          let v451 = vFindPlayerBySID.weapons[0] == 4 ? 2 : 5;
          if (vFindPlayerBySID.shameCount < v451) {
            healer();
          } else {
            game.tickBase(() => {
              healer();
            }, 2);
          }
          if (v434 >= (v444 ? 8 : 20) && vFindPlayerBySID.damageThreat >= 20 && v440) {
            setTimeout(() => {
              healer();
            }, 120);
          }
          let v452 = 100 - player.health;
          if (v434 >= (v444 ? 8 : 20) && vFindPlayerBySID.damageThreat >= 20 && v436 && vFindPlayerBySID.primaryIndex !== "4" && game.tick - vFindPlayerBySID.antiTimer > 1) {
            if (vFindPlayerBySID.reloads[53] == 0 && vFindPlayerBySID.reloads[vFindPlayerBySID.weapons[1]] == 0) {
              vFindPlayerBySID.canEmpAnti = true;
            } else {
              player.soldierAnti = true;
            }
            vFindPlayerBySID.antiTimer = game.tick;
            let v453 = vFindPlayerBySID.weapons[0] == 4 ? 2 : 5;
            if (vFindPlayerBySID.shameCount < v453) {
              healer();
            } else {
              game.tickBase(() => {
                healer();
              }, 2);
            }
          }
          if (v434 >= 20 && player.skinIndex == 11 && player.shameCount <= 3) {
            instaC.canCounter = true;
          }
        } else {
          game.tickBase(() => {
            healer();
          }, 2);
        }
      } else {
        vFindPlayerBySID.maxShameCount = Math.max(vFindPlayerBySID.maxShameCount, vFindPlayerBySID.shameCount);
      }
    } else if (!vFindPlayerBySID.setPoisonTick && (vFindPlayerBySID.damaged == 5 || vFindPlayerBySID.latestTail == 13 && vFindPlayerBySID.damaged == 2)) {
      vFindPlayerBySID.setPoisonTick = true;
    }
  }
  if (nears.length && vFindPlayerBySID.shameCount <= 5 && nears.some(p645 => [9, 12, 17, 15].includes(v433.weapon))) {
    if (near.reloads[near.secondaryIndex] == 0) {
      my.empAnti = true;
      my.soldierAnti = false;
    } else {
      my.soldierAnti = true;
      my.empAnti = false;
    }
  }
}
function killPlayer() {
  inGame = false;
  lastDeath = {
    x: player.x,
    y: player.y
  };
}
function updateItemCounts(p646, p647) {
  if (player) {
    player.itemCounts[p646] = p647;
    updateItemCountDisplay(p646);
  }
}
function updateAge(p648, p649, p650) {
  var v454 = document.getElementById("ageText");
  var v455 = document.getElementById("ageBarBody");
  var v456 = document.getElementById("ageBarContainer");
  document.getElementById("woodDisplay").style.display = "none";
  document.getElementById("stoneDisplay").style.display = "none";
  document.getElementById("foodDisplay").style.display = "none";
  if (p648 !== undefined) {
    player.XP = p648;
  }
  if (p649 !== undefined) {
    player.maxXP = p649;
  }
  if (p650 !== undefined) {
    player.age = p650;
  }
  if (player.age >= 9) {
    v454.style.display = "none";
    v455.style.display = "block";
    v456.style.display = "block";
  } else {
    v454.style.display = "none";
    v455.style.display = "block";
    v456.style.display = "block";
    v454.innerHTML = "AGE " + player.age;
    v455.style.width = player.XP / player.maxXP * 100 + "%";
  }
}

function updateUpgrades(p651, p652) {
  player.upgradePoints = p651;
  player.upgrAge = p652;
  if (p651 > 0) {
    tmpList.length = 0;
    UTILS.removeAllChildren(upgradeHolder);
    for (let v458 = 0; v458 < items.weapons.length; ++v458) {
      if (items.weapons[v458].age == p652 && (items.weapons[v458].pre == undefined || player.weapons.indexOf(items.weapons[v458].pre) >= 0)) {
        let v459 = UTILS.generateElement({
          id: "upgradeItem" + v458,
          class: "actionBarItem",
          onmouseout: function () {
            showItemInfo();
          },
          parent: upgradeHolder
        });
        v459.style.backgroundImage = getEl("actionBarItem" + v458).style.backgroundImage;
        tmpList.push(v458);
      }
    }
    for (let v460 = 0; v460 < items.list.length; ++v460) {
      if (items.list[v460].age == p652 && (items.list[v460].pre == undefined || player.items.indexOf(items.list[v460].pre) >= 0)) {
        let v461 = items.weapons.length + v460;
        let v462 = UTILS.generateElement({
          id: "upgradeItem" + v461,
          class: "actionBarItem",
          onmouseout: function () {
            showItemInfo();
          },
          parent: upgradeHolder
        });
        v462.style.backgroundImage = getEl("actionBarItem" + v461).style.backgroundImage;
        tmpList.push(v461);
      }
    }
    for (let v463 = 0; v463 < tmpList.length; v463++) {
      (function (p653) {
        let vGetEl = getEl("upgradeItem" + p653);
        vGetEl.onclick = UTILS.checkTrusted(function () {
          packet("H", p653);
        });
        UTILS.hookTouchEvents(vGetEl);
        if (getEl("autoUpgrade").checked) {
          let vParseInt = parseInt(getEl("autoUpgrade").checked);
          if (tmpList.length == 1) {
            packet("H", p653);
          } else if (["17", "31", "23", vParseInt].find(p654 => vGetEl.id.includes(p654))) {
            packet("H", p653);
          }
        }
      })(tmpList[v463]);
    }
    if (tmpList.length) {
      upgradeHolder.style.display = "block";
      upgradeCounter.style.display = "block";
      upgradeCounter.innerHTML = "SELECT ITEMS (" + p651 + ")";
    } else {
      upgradeHolder.style.display = "none";
      upgradeCounter.style.display = "none";
      showItemInfo();
    }
  } else {
    upgradeHolder.style.display = "none";
    upgradeCounter.style.display = "none";
    showItemInfo();
  }
}
function killObject(p655) {
  let vFindObjectBySid2 = findObjectBySid(p655);
  objectManager.disableBySid(p655);
  if (player) {
    for (let v464 = 0; v464 < breakObjects.length; v464++) {
      if (breakObjects[v464].sid == p655) {
        breakObjects.splice(v464, 1);
        break;
      }
    }
    if (!player.canSee(vFindObjectBySid2)) {
      breakTrackers.push({
        x: vFindObjectBySid2.x,
        y: vFindObjectBySid2.y
      });
    }
    if (breakTrackers.length > 8) {
      breakTrackers.shift();
    }
    traps.replacer(vFindObjectBySid2);
  }
}
function dotProduct(p656, p657) {
  return p656.x * p657.x + p656.y * p657.y;
}
function magnitude(p658) {
  return Math.sqrt(p658.x * p658.x + p658.y * p658.y);
}
function vectorDifference(p659, p660) {
  return {
    x: p660.x - p659.x,
    y: p660.y - p659.y
  };
}
function calculateAngleUsingDotProduct(p661, p662) {
  let vVectorDifference = vectorDifference(p661, p662);
  let v465 = {
    x: Math.cos(player.dir),
    y: Math.sin(player.dir)
  };
  let vDotProduct = dotProduct(v465, vVectorDifference);
  let v466 = magnitude(v465) * magnitude(vVectorDifference);
  let v467 = vDotProduct / v466;
  let v468 = Math.acos(v467);
  v468 *= 180 / Math.PI;
  if (v468 < 0) {
    v468 += 360;
  }
  return v468;
}
function calculatePerfectAngle(p663, p664, p665, p666) {
  return Math.atan2(p666 - p664, p665 - p663);
}
function killObjects(p667) {
  if (player) {
    objectManager.removeAllItems(p667);
  }
}
function setTickout(p668, p669) {
  if (!ticks.manage[ticks.tick + p669]) {
    ticks.manage[ticks.tick + p669] = [p668];
  } else {
    ticks.manage[ticks.tick + p669].push(p668);
  }
}
function isAlly(p670, p671) {
  tmpObj = findPlayerBySID(p670);
  if (!tmpObj) {
    return;
  }
  if (p671) {
    let vFindPlayerBySID2 = findPlayerBySID(p671);
    if (!vFindPlayerBySID2) {
      return;
    }
    if (vFindPlayerBySID2.sid == p670) {
      return true;
    } else if (tmpObj.team) {
      if (tmpObj.team === vFindPlayerBySID2.team) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  if (!tmpObj) {
    return;
  }
  if (player.sid == p670) {
    return true;
  } else if (tmpObj.team) {
    if (tmpObj.team === player.team) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function caf(p672, p673) {
  try {
    return Math.atan2((p673.y2 || p673.y) - (p672.y2 || p672.y), (p673.x2 || p673.x) - (p672.x2 || p672.x));
  } catch (_0x5de0cb) {
    return 0;
  }
}
let found = false;
let autoQ = false;
let autos = {
  insta: {
    todo: false,
    wait: false,
    count: 4,
    shame: 5
  },
  bull: false,
  antibull: 0,
  reloaded: false,
  stopspin: true
};
let placeableSpikes = [];
let placeableTraps = [];
let placeableSpikesPREDICTS = [];
function getDir(p674, p675) {
  try {
    return Math.atan2((p675.y2 || p675.y) - (p674.y2 || p674.y), (p675.x2 || p675.x) - (p674.x2 || p674.x));
  } catch (_0x137f8a) {
    return 0;
  }
}
const getDistance = (p676, p677, p678, p679) => {
  let v469 = p678 - p676;
  let v470 = p679 - p677;
  return Math.sqrt(v469 * v469 + v470 * v470);
};
const getPotentialDamage = (p680, p681) => {
  const v471 = p681.weapons[1] === 10 && !player.reloads[p681.weapons[1]] ? 1 : 0;
  const v472 = p681.weapons[v471];
  if (player.reloads[v472]) {
    return 0;
  }
  const v473 = items.weapons[v472];
  const v474 = getDistance(p680.x, p680.y, p681.x2, p681.y2) <= p680.getScale() + v473.range;
  if (p681.visible && v474) {
    return v473.dmg * (v473.sDmg || 1) * 3.3;
  } else {
    return 0;
  }
};
const findPlacementAngle = (p682, p683, p684) => {
  if (!p684) {
    return null;
  }
  const v475 = Math.PI * 2;
  const v476 = Math.PI / 360;
  const v477 = items.list[p682.items[p683]];
  let v478 = Math.atan2(p684.y - p682.y, p684.x - p682.x);
  let v479 = p682.scale + (v477.scale || 1) + (v477.placeOffset || 0);
  for (let v480 = 0; v480 < v475; v480 += v476) {
    let v481 = [(v478 + v480) % v475, (v478 - v480 + v475) % v475];
    for (let v482 of v481) {
      let v483 = p682.x + v479 * Math.cos(v482);
      let v484 = p682.y + v479 * Math.sin(v482);
      if (objectManager.customCheckItemLocation(v483, v484, v477.scale, 0.6, v477.id, false, p682, p684, gameObjects, UTILS, config)) {
        return v482;
      }
    }
  }
  return null;
};
const AutoReplace = () => {
  const v485 = [];
  const v486 = player.x;
  const v487 = player.y;
  const v488 = gameObjects.length;
  for (let v489 = 0; v489 < v488; v489++) {
    const v490 = gameObjects[v489];
    if (v490.isItem && v490.active && v490.health > 0) {
      let v491 = players.reduce((p685, p686) => p685 + getPotentialDamage(v490, p686), 0);
      if (v490.health <= v491) {
        v485.push(v490);
      }
    }
  }
  const vF5 = () => {
    let v492 = gameObjects.filter(p687 => p687.trap && p687.active && p687.isTeamObject(player) && getDistance(p687.x, p687.y, v486, v487) <= p687.getScale() + 5);
    let v493 = gameObjects.find(p688 => p688.dmg && p688.active && p688.isTeamObject(player) && getDistance(p688.x, p688.y, v486, v487) < 87 && !v492.length);
    const v494 = v493 ? 4 : 2;
    v485.forEach(p689 => {
      let vFindPlacementAngle = findPlacementAngle(player, v494, p689);
      if (vFindPlacementAngle !== null) {
        place(v494, vFindPlacementAngle);
        if (getEl("placeVis").checked) {
          tracker.draw2.active = true;
          tracker.draw2.x = p689.x;
          tracker.draw2.y = p689.y;
          tracker.draw2.scale = p689.scale;
        }
      }
    });
  };
  const v495 = game.tickSpeed - (window.pingTime || 0) + (game.tickSpeed < 110 ? 15 : 15);
  if (near && near.dist2 <= 280) {
    let v496 = window.pingTime;
    if (v496 + 40 < window.pingTime) {
      v496 += 40;
    } else if (v496 + 25 < window.pingTime) {
      v495 += 25;
    }
    setTimeout(vF5, v495);
    tracker.draw2.active = false;
  }
};
let lastPos = {
  x: 0,
  y: 0
};
let mills = {
  x: undefined,
  y: undefined,
  size: function (p690) {
    return p690 * 1.45;
  },
  dist: function (p691) {
    return p691 * 1.8;
  },
  active: config.isSandbox ? false : false,
  count: 0
};
let laztPoz = {};
let oldXY = {
  x: undefined,
  y: undefined
};
function notif2(p692, p693) {
  let v497 = document.getElementById("notification-container");
  if (!v497) {
    v497 = document.createElement("div");
    v497.id = "notification-container";
    v497.style.position = "fixed";
    v497.style.top = "10%";
    v497.style.left = "50%";
    v497.style.transform = "translateX(-50%)";
    v497.style.zIndex = "9999";
    document.body.appendChild(v497);
  }
  const v498 = document.createElement("div");
  v498.innerHTML = p692 + ": " + p693;
  v498.style.fontSize = "1.5rem";
  v498.style.color = "white";
  v498.style.opacity = "0";
  v498.style.transition = "opacity 0.5s ease-in-out";
  v498.style.padding = "10px";
  v498.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  v498.style.borderRadius = "5px";
  v498.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  v498.style.marginBottom = "10px";
  v497.appendChild(v498);
  const v499 = new Audio("https://cdn.glitch.global/4c998580-5aaf-4a1a-8da3-e0c6b9f241a7/Audio_-_notification3_-_Creator_Store%20(1).mp3?v=1709582087126");
  v499.volume = 0.4;
  v499.play();
  setTimeout(function () {
    v498.style.opacity = "1";
  }, 100);
  setTimeout(function () {
    v498.style.opacity = "0";
    setTimeout(function () {
      v498.remove();
    }, 500);
  }, 3000);
}
function notif(p694, p695) {
  let vPlayer = player;
  let vTextManager = textManager;
  if (typeof p694 !== "undefined") {
    vTextManager.showText(vPlayer.x, vPlayer.y, 40, 0.18, 1000, p694, "white");
  }
  if (typeof p695 !== "undefined") {
    vTextManager.showText(vPlayer.x, vPlayer.y + 40, 30, 0.18, 1000, p695, "white");
  }
}
const safeWalk = () => {
  let v500 = false;
  let v501 = null;
  let v502 = false;
  my.autoPush = false;
  pathFind.active = false;
  pathFind.chaseNear = false;
  const v503 = liztobj.sort((p696, p697) => Math.hypot(player.y2 - p696.y, player.x2 - p696.x) - Math.hypot(player.y2 - p697.y, player.x2 - p697.x));
  const v504 = v503.filter(p698 => {
    return (p698.name === "spikes" || p698.name === "greater spikes" || p698.name === "spinning spikes" || p698.name === "poison spikes") && !isAlly(p698.owner.sid) && p698.owner.sid !== player.sid && fgdo(player, p698) < 250 && p698.active;
  });
  const v505 = {
    x: player.x2 + (player.x2 - lastPos.x) * 1.2 + Math.cos(player.moveDir) * 50,
    y: player.y2 + (player.y2 - lastPos.y) * 1.2 + Math.sin(player.moveDir) * 50
  };
  for (let v506 = 0; v506 < v504.length; v506++) {
    if (fgdo(v504[v506], v505) < v504[v506].scale + player.scale + 3) {
      v500 = true;
      v501 = v504[v506];
      break;
    }
  }
  const vF6 = () => {
    packet("D", Math.atan2(v501.y - player.y2, v501.x - player.x2));
  };
  const vF7 = () => {
    my.autoPush = false;
    pathFind.active = false;
    pathFind.chaseNear = false;
    selectWeapon(player.weapons[player.weapons[1] === 10 ? 1 : 0]);
    sendAutoGather();
    buyEquip(40, 0);
    vF6();
    my.waitHit = 1;
    game.tickBase(() => {
      sendAutoGather();
      my.waitHit = 0;
    }, 1);
  };
  if (v500 && !traps.inTrap && !phantom.find(p699 => p699.sid === v501.sid)) {
    if (player.reloads[player.weapons[0]] === 0 && !instaC.isTrue && !clicks.left && !clicks.right && player.reloads[player.weapons[1]] === 0) {
      vF7();
    }
    ;
    packet("e");
    my.autoPush = false;
    pathFind.active = false;
    pathFind.chaseNear = false;
    v502 = true;
    tracker.draw3.active = true;
    tracker.draw3.x = v501.x;
    tracker.draw3.y = v501.y;
    tracker.draw3.scale = v501.scale;
    if (getEl("notifs").checked) {
      notif("Stop!");
    }
  } else {
    v502 = false;
    tracker.draw3.active = false;
    packet("f", lastMoveDir, 1);
  }
  lastPos.x = player.x2;
  lastPos.y = player.y2;
};
function updatePlayers(p700) {
  safeWalk();
  if (player.shameCount > 0) {
    my.reSync = true;
  } else {
    my.reSync = false;
  }
  if (player.shameCount > 4) {
    player.chat.message = "danger";
    player.chat.count = 1000;
  }
  if (near.shameCount > 4) {
    near.chat.message = "killable";
    near.chat.count = 1000;
  }
  if (tmpObj == player) {
    if (!mills.x || !oldXY.x) {
      mills.x = oldXY.x = tmpObj.x2;
    }
    if (!mills.y || !oldXY.y) {
      mills.y = oldXY.y = tmpObj.y2;
    }
  }
  if (textManager.stack.length) {
    let v507 = [];
    let v508 = [];
    let v509 = 0;
    let v510 = 0;
    let v511 = {
      x: null,
      y: null
    };
    let v512 = {
      x: null,
      y: null
    };
    textManager.stack.forEach(p701 => {
      if (p701.value >= 0) {
        if (v509 == 0) {
          v511 = {
            x: p701.x,
            y: p701.y
          };
        }
        v509 += Math.abs(p701.value);
      } else {
        if (v510 == 0) {
          v512 = {
            x: p701.x,
            y: p701.y
          };
        }
        v510 += Math.abs(p701.value);
      }
    });
    if (v510 > 0) {
      textManager.showText(v512.x, v512.y, Math.max(45, Math.min(50, v510)), 0.18, 500, v510, "#8ecc51");
    }
    if (v509 > 0) {
      textManager.showText(v511.x, v511.y, Math.max(45, Math.min(50, v509)), 0.18, 500, v509, "#fff");
    }
    textManager.stack = [];
  }
  if (runAtNextTick.length) {
    runAtNextTick.forEach(p702 => {
      checkProjectileHolder(...p702);
    });
    runAtNextTick = [];
  }
  function f32(p703) {
    let v513 = liztobj.sort((p704, p705) => Math.hypot(p703.y - p704.y, p703.x - p704.x) - Math.hypot(p703.y - p705.y, p703.x - p705.x));
    let v514 = v513.filter(p706 => p706.dmg && cdf(player, p706) < 200 && !p706.isTeamObject(player) && p706.active);
    let v515 = {
      x: p703.x + (player.oldPos.x2 - p703.x) * -2,
      y: p703.y + (player.oldPos.y2 - p703.y) * -2,
      x: player.x2 + (player.oldPos.x2 - player.x2) * -1,
      y: player.y2 + (player.oldPos.y2 - player.y2) * -1
    };
    let v516 = false;
    for (let v517 = 0; v517 < v514.length; v517++) {
      if (cdf(v515, v514[v517]) < player.scale + v514[v517].scale) {
        v516 = true;
      }
    }
    player.oldPos.x2 = p703.x2;
    player.oldPos.y2 = p703.y2;
  }
  game.tick++;
  enemy = [];
  nears = [];
  near = [];
  game.tickSpeed = performance.now() - game.lastTick;
  game.lastTick = performance.now();
  players.forEach(p707 => {
    p707.forcePos = !p707.visible;
    p707.visible = false;
    if (p707.timeHealed - p707.timeDamaged > 0 && p707.lastshamecount < p707.shameCount) {
      p707.pinge = p707.timeHealed - p707.timeDamaged;
    }
  });
  for (let v518 = 0; v518 < p700.length;) {
    tmpObj = findPlayerBySID(p700[v518]);
    if (tmpObj) {
      tmpObj.t1 = tmpObj.t2 === undefined ? game.lastTick : tmpObj.t2;
      tmpObj.t2 = game.lastTick;
      tmpObj.oldPos.x2 = tmpObj.x2;
      tmpObj.oldPos.y2 = tmpObj.y2;
      tmpObj.x1 = tmpObj.x;
      tmpObj.y1 = tmpObj.y;
      tmpObj.x2 = p700[v518 + 1];
      tmpObj.y2 = p700[v518 + 2];
      tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
      tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
      tmpObj.d1 = tmpObj.d2 === undefined ? p700[v518 + 3] : tmpObj.d2;
      tmpObj.d2 = p700[v518 + 3];
      tmpObj.dt = 0;
      tmpObj.buildIndex = p700[v518 + 4];
      tmpObj.weaponIndex = p700[v518 + 5];
      tmpObj.weaponVariant = p700[v518 + 6];
      tmpObj.team = p700[v518 + 7];
      tmpObj.isLeader = p700[v518 + 8];
      tmpObj.oldSkinIndex = tmpObj.skinIndex;
      tmpObj.oldTailIndex = tmpObj.tailIndex;
      tmpObj.skinIndex = p700[v518 + 9];
      tmpObj.tailIndex = p700[v518 + 10];
      tmpObj.iconIndex = p700[v518 + 11];
      tmpObj.zIndex = p700[v518 + 12];
      tmpObj.visible = true;
      tmpObj.update(game.tickSpeed);
      tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
      tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
      tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
      tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
      tmpObj.damageThreat = 0;
      if (tmpObj.skinIndex == 45 && tmpObj.shameTimer <= 0) {
        tmpObj.addShameTimer();
      }
      if (tmpObj.oldSkinIndex == 45 && tmpObj.skinIndex != 45) {
        tmpObj.shameTimer = 0;
        tmpObj.shameCount = 0;
        if (tmpObj == player) {
          healer();
        }
      }
      botSkts.forEach(p708 => {
        p708.showName = "YEAHHH";
      });
      for (let v519 = 0; v519 < players.length; v519++) {
        for (let v520 = 0; v520 < botSkts.length; v520++) {
          if (player.id === v520.id) {
            v520.showName = "YEAHHHHHH";
          }
        }
      }
      if (player.shameCount < 3 && near.dist3 <= 300 && near.reloads[near.primaryIndex] <= game.tickRate * (window.pingTime >= 150 ? 2 : 1)) {
        autoQ = true;
        healer();
      } else {
        if (autoQ) {
          healer();
        }
        autoQ = false;
      }
      if (phantom.length > 0) {
        for (let v521 of phantom) {
          objectManager.disableBySid(v521.sid);
        }
        phantom = [];
      }
      if (tmpObj == player) {
        if (liztobj.length) {
          liztobj.forEach(p709 => {
            p709.onNear = false;
            if (p709.active) {
              if (!p709.onNear && UTILS.getDist(p709, tmpObj, 0, 2) <= p709.scale + items.weapons[tmpObj.weapons[0]].range) {
                p709.onNear = true;
              }
              if (p709.isItem && p709.owner) {
                p709.breakObj = true;
                breakObjects.push({
                  x: p709.x,
                  y: p709.y,
                  sid: p709.sid
                });
              }
            }
          });
          let v522 = liztobj.filter(p710 => p710.trap && p710.active && UTILS.getDist(p710, tmpObj, 0, 2) <= tmpObj.scale + p710.getScale() + 25 && !p710.isTeamObject(tmpObj)).sort(function (p711, p712) {
            return UTILS.getDist(p711, tmpObj, 0, 2) - UTILS.getDist(p712, tmpObj, 0, 2);
          })[0];
          if (v522) {
            let v523 = liztobj.filter(p713 => p713.dmg && cdf(tmpObj, p713) <= tmpObj.scale + v522.scale / 2 && !p713.isTeamObject(tmpObj) && p713.active)[0];
            traps.dist = UTILS.getDist(v522, tmpObj, 0, 2);
            traps.aim = UTILS.getDirect(v523 ? v523 : v522, tmpObj, 0, 2);
            tracker.draw3.active = true;
            traps.protect(caf(v522, tmpObj) - Math.PI);
            traps.inTrap = true;
            traps.info = v522;
          } else {
            if (traps.inTrap) {
              Leuchtturm = true;
              setTimeout(() => {
                Leuchtturm = false;
              }, 240);
            } else {
              Leuchtturm = false;
            }
            traps.inTrap = false;
            traps.info = {};
          }
        } else {
          tracker.draw3.active = false;
          traps.inTrap = false;
        }
      }
      if (tmpObj.weaponIndex < 9) {
        tmpObj.primaryIndex = tmpObj.weaponIndex;
        tmpObj.primaryVariant = tmpObj.weaponVariant;
      } else if (tmpObj.weaponIndex > 8) {
        tmpObj.secondaryIndex = tmpObj.weaponIndex;
        tmpObj.secondaryVariant = tmpObj.weaponVariant;
      }
    }
    v518 += 13;
  }
  if (runAtNextTick.length) {
    runAtNextTick.forEach(p714 => {
      checkProjectileHolder(...p714);
    });
    runAtNextTick = [];
  }
  for (let v524 = 0; v524 < p700.length;) {
    tmpObj = findPlayerBySID(p700[v524]);
    if (tmpObj) {
      if (!tmpObj.isTeam(player)) {
        enemy.push(tmpObj);
        if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + player.scale * 2) {
          nears.push(tmpObj);
        }
      }
      tmpObj.manageReload();
      if (tmpObj != player) {
        tmpObj.addDamageThreat(player);
      }
    }
    v524 += 13;
  }
  if (player && player.alive) {
    if (enemy.length) {
      near = enemy.sort(function (p715, p716) {
        return p715.dist2 - p716.dist2;
      })[0];
    } else {}
    if (game.tickQueue[game.tick]) {
      game.tickQueue[game.tick].forEach(p717 => {
        p717();
      });
      game.tickQueue[game.tick] = null;
    }
    if (advHeal.length) {
      advHeal.forEach(p718 => {
        if (window.pingTime < 150) {
          let v525 = p718[0];
          let v526 = p718[1];
          let v527 = 100 - v526;
          let v528 = p718[2];
          tmpObj = findPlayerBySID(v525);
          let v529 = false;
          if (tmpObj && tmpObj.health <= 0) {
            if (!tmpObj.death) {
              tmpObj.death = true;
              if (tmpObj != player) {
                notif2("KILLED : ", tmpObj.name);
              }
              addDeadPlayer(tmpObj);
            }
          }
          if (tmpObj == player) {
            if (tmpObj.skinIndex == 7 && (v528 == 5 || tmpObj.latestTail == 13 && v528 == 2)) {
              if (my.reSync) {
                my.reSync = false;
                tmpObj.setBullTick = true;
              }
              v529 = true;
            }
            if (inGame) {
              let vGetAttacker2 = getAttacker(v528);
              let v530 = [0.25, 0.45].map(p719 => p719 * items.weapons[player.weapons[0]].dmg * soldierMult());
              let v531 = enemy.length ? !v529 && v530.includes(v528) && near.skinIndex == 11 : false;
              let v532 = 140 - window.pingTime;
              let v533 = 100 - player.health;
              let vF8 = function (p720, p721) {
                if (!p721) {
                  setTimeout(() => {
                    healer();
                  }, p720);
                } else {
                  game.tickBase(() => {
                    healer();
                  }, 2);
                }
              };
              if (getEl("healingBeta").checked) {
                if (enemy.length) {
                  if ([0, 7, 8].includes(near.primaryIndex)) {
                    if (v528 < 75) {
                      vF8(v532);
                    } else {
                      healer();
                    }
                  }
                  if (!Leuchtturm && v528 >= 20 && player.skinIndex == 6 && player.shameCount <= 4 && getEl("antiBullType").value == "abalway" && near.dist2 <= 150 && (player.weapons[0] == 4 || player.weapons[0] == 3) && near.primaryIndex != 5) {
                    instaC.canCounter = true;
                  }
                  if (player.weapons[1] == 11) {
                    if ([15, 9, 12, 13].includes(near.secondaryIndex) && near.reloads[near.secondaryIndex] == 1) {
                      if (v528 < 75) {
                        my.autoAim = true;
                        selectWeapon(player.weapons[1]);
                        vF8(v532);
                        setTimeout(() => {
                          selectWeapon(player.weapons[0]);
                          my.autoAim = false;
                        }, 250);
                      }
                    }
                  } else if (player.weapons[1] == 11) {
                    if (near.skinIndex == 53) {
                      my.autoAim = true;
                      selectWeapon(player.weapons[1]);
                      vF8(v532);
                      setTimeout(() => {
                        selectWeapon(player.weapons[0]);
                        my.autoAim = false;
                      }, 250);
                    }
                  }
                  if ([1, 2, 6].includes(near.primaryIndex)) {
                    if (v528 >= 25 && player.damageThreat + v533 >= 95 && tmpObj.shameCount < 5) {
                      healer();
                    } else {
                      vF8(v532);
                    }
                  }
                  if (near.primaryIndex == 5 && near.secondaryIndex == 10 && traps.inTrap && v533 >= 10 && near.reloads[near.primaryIndex] == 0) {
                    healer();
                  }
                  if (near.primaryIndex == 3) {
                    if (near.secondaryIndex == 15) {
                      if (near.primaryVariant < 2) {
                        if (v528 >= 35 && player.damageThreat + v533 >= 95 && tmpObj.shameCount < 6) {
                          tmpObj.canEmpAnti = true;
                          healer();
                        } else {
                          vF8(v532);
                        }
                      } else if (v528 > 35 && player.damageThreat + v533 >= 95 && tmpObj.shameCount < 6 && game.tick - player.antiTimer > 1) {
                        tmpObj.canEmpAnti = true;
                        tmpObj.antiTimer = game.tick;
                        healer();
                      } else {
                        vF8(v532);
                      }
                    } else if (v528 >= 25 && player.damageThreat + v533 >= 95 && tmpObj.shameCount < 4) {
                      healer();
                    } else {
                      vF8(v532);
                    }
                  }
                  if (near.primaryIndex == 4) {
                    if (near.primaryVariant >= 1) {
                      if (v528 >= 10 && player.damageThreat + v533 >= 95 && tmpObj.shameCount < 4) {
                        healer();
                      } else {
                        vF8(v532);
                      }
                    } else if (v528 >= 35 && player.damageThreat + v533 >= 95 && tmpObj.shameCount < 3) {
                      healer();
                    } else {
                      vF8(v532);
                    }
                  }
                  if ([undefined, 5].includes(near.primaryIndex)) {
                    if (near.secondaryIndex == 10) {
                      if (v533 >= (v531 ? 10 : 20) && tmpObj.damageThreat + v533 >= 80 && tmpObj.shameCount < 6) {
                        healer();
                      } else {
                        vF8(v532);
                      }
                    } else if (near.primaryVariant >= 2 || near.primaryVariant == undefined) {
                      if (v533 >= (v531 ? 15 : 20) && tmpObj.damageThreat + v533 >= 50 && tmpObj.shameCount < 6) {
                        healer();
                      } else {
                        vF8(v532);
                      }
                    } else if ([undefined || 15].includes(near.secondaryIndex)) {
                      if (v528 > (v531 ? 8 : 20) && player.damageThreat >= 25 && game.tick - player.antiTimer > 1) {
                        if (tmpObj.shameCount < 5) {
                          healer();
                        } else {
                          vF8(v532);
                        }
                      } else {
                        vF8(v532);
                      }
                    } else if ([9, 12, 13].includes(near.secondaryIndex)) {
                      if (v533 >= 25 && player.damageThreat + v533 >= 70 && tmpObj.shameCount < 6) {
                        healer();
                      } else {
                        vF8(v532);
                      }
                    } else if (v528 > 25 && player.damageThreat + v533 >= 95) {
                      healer();
                    } else {
                      vF8(v532);
                    }
                  }
                  if (near.primaryIndex == 6) {
                    if (near.secondaryIndex == 15) {
                      if (v528 >= 25 && tmpObj.damageThreat + v533 >= 95 && tmpObj.shameCount < 4) {
                        healer();
                      } else {
                        vF8(v532);
                      }
                    } else if (v528 >= 70 && tmpObj.shameCount < 4) {
                      healer();
                    } else {
                      vF8(v532);
                    }
                  }
                  if (v528 >= 30 && near.reloads[near.secondaryIndex] == 0 && near.dist2 <= 150 && player.skinIndex == 11 && player.tailIndex == 21) {
                    instaC.canCounter = true;
                  }
                } else if (v528 >= 70) {
                  healer();
                } else {
                  vF8(v532);
                }
              } else {
                if (v528 >= (v531 ? 8 : 25) && v533 + player.damageThreat >= 80 && game.tick - player.antiTimer > 1) {
                  if (tmpObj.reloads[53] == 0 && tmpObj.reloads[tmpObj.weapons[1]] == 0) {
                    tmpObj.canEmpAnti = true;
                  } else {
                    player.soldierAnti = true;
                  }
                  tmpObj.antiTimer = game.tick;
                  let v534 = [0, 4, 6, 7, 8].includes(near.primaryIndex) ? 2 : 5;
                  if (tmpObj.shameCount < v534) {
                    healer();
                  } else if (near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) {
                    vF8(v532);
                  } else {
                    vF8(v532, 1);
                  }
                } else if (near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) {
                  vF8(v532);
                } else {
                  vF8(v532, 1);
                }
                if (v528 >= 25 && near.dist2 <= 140 && player.skinIndex == 11 && player.tailIndex == 21) {
                  instaC.canCounter = true;
                }
              }
            } else if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || tmpObj.latestTail == 13 && tmpObj.damaged == 2)) {
              tmpObj.setPoisonTick = true;
            }
          }
        } else {
          let [v535, v536, v537] = p718;
          let v538 = 100 - v536;
          let vFindPlayerBySID3 = findPlayerBySID(v535);
          let v539 = false;
          if (vFindPlayerBySID3 == player) {
            if (vFindPlayerBySID3.skinIndex == 7 && (v537 == 5 || vFindPlayerBySID3.latestTail == 13 && v537 == 2)) {
              if (my.reSync) {
                my.reSync = false;
                vFindPlayerBySID3.setBullTick = true;
                v539 = true;
              }
            }
            if (inGame) {
              let vGetAttacker3 = getAttacker(v537);
              let v540 = [0.25, 0.45].map(p722 => p722 * items.weapons[player.weapons[0]].dmg * soldierMult());
              let v541 = enemy.length ? !v539 && v540.includes(v537) && near.skinIndex == 11 : false;
              let v542 = 60;
              let v543 = 100 - player.health;
              let v544 = [2, 5][[0, 4, 6, 7, 8].includes(near.primaryIndex) ? 0 : 1];
              let vF9 = function (p723, p724) {
                if (!p724) {
                  setTimeout(() => healer(), p723);
                } else {
                  game.tickBase(() => healer(), 2);
                }
              };
              if (getEl("healingBeta").checked) {
                let v545 = [0, 7, 8].includes(near.primaryIndex) ? v537 < 75 : [1, 2, 6].includes(near.primaryIndex) ? v537 >= 25 && player.damageThreat + v543 >= 95 && vFindPlayerBySID3.shameCount < 5 : [undefined, 5].includes(near.primaryIndex) ? v543 >= (v541 ? 15 : 20) && vFindPlayerBySID3.damageThreat + v543 >= 50 && vFindPlayerBySID3.shameCount < 6 : near.primaryIndex == 3 && near.secondaryIndex == 15 ? v537 >= 35 && player.damageThreat + v543 >= 95 && vFindPlayerBySID3.shameCount < 5 && game.tick - player.antiTimer > 1 : near.primaryIndex == 4 ? near.primaryVariant >= 1 ? v537 >= 10 && player.damageThreat + v543 >= 95 && vFindPlayerBySID3.shameCount < 4 : v537 >= 35 && player.damageThreat + v543 >= 95 && vFindPlayerBySID3.shameCount < 3 : near.primaryIndex == 6 && near.secondaryIndex == 15 ? v537 >= 25 && vFindPlayerBySID3.damageThreat + v543 >= 95 && vFindPlayerBySID3.shameCount < 4 : v537 >= 25 && player.damageThreat + v543 >= 95;
                if (v545) {
                  healer();
                } else {
                  vF9(v542);
                }
              } else {
                let v546 = v537 >= (v541 ? 8 : 25) && v543 + player.damageThreat >= 80 && game.tick - player.antiTimer > 1;
                if (v546) {
                  if (vFindPlayerBySID3.reloads[53] == 0 && vFindPlayerBySID3.reloads[vFindPlayerBySID3.weapons[1]] == 0) {
                    vFindPlayerBySID3.canEmpAnti = true;
                  } else {
                    player.soldierAnti = true;
                  }
                  vFindPlayerBySID3.antiTimer = game.tick;
                  if (vFindPlayerBySID3.shameCount < v544) {
                    healer();
                  } else {
                    vF9(v542, near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21) ? 0 : 1);
                  }
                } else {
                  vF9(v542, near.primaryIndex == 7 || player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21) ? 0 : 1);
                }
              }
            } else if (!vFindPlayerBySID3.setPoisonTick && (vFindPlayerBySID3.damaged == 5 || vFindPlayerBySID3.latestTail == 13 && vFindPlayerBySID3.damaged == 2)) {
              vFindPlayerBySID3.setPoisonTick = true;
            }
          }
        }
      });
      advHeal = [];
    }
    players.forEach(p725 => {
      if (!p725.visible && player != p725) {
        p725.reloads = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 0,
          53: 0
        };
      }
      if (p725.setBullTick) {
        p725.bullTimer = 0;
      }
      if (p725.setPoisonTick) {
        p725.poisonTimer = 0;
      }
      p725.updateTimer();
    });
    if (inGame) {
      if (enemy.length) {
        if (!instaC.isTrue && getEl("preTick").checked && my.anti0Tick <= 0) {
          let vKnockBackPredict = knockBackPredict();
          if (vKnockBackPredict == "insta them" && (![9, 12, 13, 15].includes(player.weapons[1]) || near.dist2 <= items.weapons[player.weapons[1]].range + player.scale * 1.8)) {
            instaC.changeType(configs.revTick || player.weapons[1] == 10 ? "rev" : "normal");
            if (getEl("notifs").checked) {
              notif("KBSpikeTick");
            }
          }
          if (vKnockBackPredict == "primary sync") {
            instaC.spikeTickType("rev");
          }
        }
        let v547 = gameObjects.filter(p726 => p726.dmg && p726.active && p726.isTeamObject(player) && UTILS.getDist(p726, near, 0, 3) <= p726.scale + near.scale).sort(function (p727, p728) {
          return UTILS.getDist(p727, near, 0, 2) - UTILS.getDist(p728, near, 0, 2);
        })[0];
        if (v547) {
          if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && getEl("preTick").checked) {
            instaC.canSpikeTick = true;
            instaC.syncHit = true;
            if (getEl("notifs").checked) {
              notif("AKH");
            }
            if (getEl("revTick").checked && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
              instaC.revTick = true;
              if (getEl("notifs").checked) {
                notif("revTick");
              }
            }
          }
        }
        let vUndefined = undefined;
        let v548 = tmpObj.damaged;
        let v549 = gameObjects.filter(p729 => p729.dmg && p729.active && !p729.isTeamObject(player) && UTILS.getDist(p729, player, 0, 3) < p729.scale + 40 + player.scale).sort(function (p730, p731) {
          return UTILS.getDist(p730, player, 0, 5) - UTILS.getDist(p731, player, 0, 5);
        })[0];
        let v550 = v549 && vUndefined <= 45 && near.primaryIndex == [5, 4, 3, 7];
        let v551 = near.skinIndex == 7 && vUndefined <= 60;
        let v552 = near.dist2 <= items.weapons[near.primaryIndex || 5].range + near.scale * 1.2;
        let v553 = near.skinIndex == 7;
        let v554 = near.primaryIndex == 5 && vUndefined >= 45 && f37();
        let v555 = near.secondaryIndex == 0 && vUndefined >= 10 && f38();
        let v556 = near.primaryIndex == 3 && vUndefined >= 30 && f41();
        let v557 = near.secondaryIndex == 15 && vUndefined >= 30 && f40();
        let v558 = near.secondaryIndex == 13 && vUndefined && f34();
        let v559 = near.primaryIndex == 5 && vUndefined && f42();
        let v560 = near.secondaryIndex == 15 && vUndefined && f43();
        let v561 = near.primaryIndex == 5 && vUndefined >= 45 && f39();
        let v562 = near.primaryIndex == 4 && vUndefined >= 33 && f36();
        let v563 = near.secondaryIndex == 9 && vUndefined >= 25 && f35();
        let v564 = [5, 7, 4, 3].includes(near.primaryIndex) && player.damageThreat && vUndefined >= 20;
        let v_0x16c8be = f33;
        let v_0x2bc614 = f37;
        async function f33() {
          while (traps.inTrap) {
            await new Promise(p732 => setTimeout(p732, 1));
            if (v549 && vUndefined >= 70 || v549 && v548 >= 70) {
              while (v549 && vUndefined >= 70 || v549 && v548 >= 70) {
                await new Promise(p733 => setTimeout(p733, 1));
                if (vUndefined <= 70 && !v548) {
                  return;
                }
              }
            }
          }
        }
        async function f34() {
          while (near.secondaryIndex == 13) {
            await new Promise(p734 => setTimeout(p734, 1));
            if (near.primaryIndex == 5 && near.secondaryIndex != 13 && vUndefined >= 37) {
              return;
            }
          }
        }
        async function f35() {
          while (near.secondaryIndex == 9) {
            await new Promise(p735 => setTimeout(p735, 1));
            if (near.primaryIndex == 4 && near.secondaryIndex != 9 && vUndefined >= 30) {
              return;
            }
          }
        }
        async function f36() {
          while (near.primaryIndex == 4) {
            await new Promise(p736 => setTimeout(p736, 1));
            if (near.secondaryIndex == 9 && near.primaryIndex != 4 && vUndefined >= 18) {
              return;
            }
          }
        }
        async function f37() {
          while (near.primaryIndex == 5) {
            await new Promise(p737 => setTimeout(p737, 1));
            if (near.secondaryIndex == 0 && near.primaryIndex != 5 && vUndefined >= 5) {
              return;
            }
          }
        }
        async function f38() {
          while (near.secondaryIndex == 0) {
            await new Promise(p738 => setTimeout(p738, 1));
            if (near.primaryIndex == 5 && near.secondaryIndex != 0 && vUndefined >= 40) {
              return;
            }
          }
        }
        async function f39() {
          while (near.primaryIndex == 5) {
            await new Promise(p739 => setTimeout(p739, 1));
            if (near.secondaryIndex == 15 && near.primaryIndex != 5 && vUndefined >= 30) {
              return;
            }
          }
        }
        async function f40() {
          while (near.secondaryIndex == 15) {
            await new Promise(p740 => setTimeout(p740, 1));
            if (near.primaryIndex == 3 && near.secondaryIndex != 15 && vUndefined >= 20) {
              return;
            }
          }
        }
        async function f41() {
          while (near.primaryIndex == 3) {
            await new Promise(p741 => setTimeout(p741, 1));
            if (near.secondaryIndex == 15 && near.primaryIndex != 3 && vUndefined >= 37) {
              return;
            }
          }
        }
        async function f42() {
          while (near.primaryIndex == 5) {
            await new Promise(p742 => setTimeout(p742, 1));
            if (near.secondaryIndex == 13 && near.primaryIndex != 5 && vUndefined >= 30) {
              return;
            }
          }
        }
        async function f43() {
          while (near.secondaryIndex == 15) {
            await new Promise(p743 => setTimeout(p743, 1));
            if (near.primaryIndex == 5 && near.secondaryIndex != 15 && vUndefined >= 35) {
              return;
            }
          }
        }
        async function f44() {
          while (near.secondaryIndex == 0) {
            await new Promise(p744 => setTimeout(p744, 1));
            if (near.primaryIndex == 4 && near.secondaryIndex != 0 && vUndefined >= 30) {
              return;
            }
          }
        }
        if (instaC.can && !traps.inTrap || traps.inTrap && player.skinIndex == 40) {
          if ([0].includes(near.secondaryIndex) && near.secondaryIndex == 0 && player.damageThreat && f44 && vUndefined >= 10 || v553 && [9].includes(near.secondaryIndex) && near.primaryIndex == 4 && player.damageThreat && v563 && vUndefined >= 10 || v553 && [4].includes(near.primaryIndex) && near.primaryIndex == 4 && player.damageThreat && v562 && vUndefined >= 33 || v553 && [4].includes(near.primaryIndex) && near.primaryIndex == 4 && player.damageThreat && f37 && vUndefined >= 45 || [15].includes(near.secondaryIndex) && near.secondaryIndex == 15 && player.damageThreat && v557 && vUndefined >= 30 || v553 && [3].includes(near.primaryIndex) && near.primaryIndex == 3 && player.damageThreat && v556 && vUndefined >= 30 || [0].includes(near.secondaryIndex) && near.secondaryIndex == 0 && player.damageThreat && v555 && vUndefined >= 10 || v553 && [5].includes(near.primaryIndex) && near.primaryIndex == 5 && player.damageThreat && v554 && vUndefined >= 45 || v553 && [5].includes(near.primaryIndex) && near.primaryIndex == 5 && player.damageThreat && v559 && vUndefined >= 45 || [5].includes(near.primaryIndex) && near.primaryIndex == 5 && player.damageThreat && v561 && vUndefined >= 45 || [15].includes(near.secondaryIndex) && near.secondaryIndex == 15 && player.damageThreat && v560 && vUndefined >= 30 || [0].includes(near.secondaryIndex) && near.secondaryIndex == 13 && player.damageThreat && f34 && vUndefined >= 10) {
            autoQ = true;
            buyEquip(6, 0);
          }
        }
        let v565 = gameObjects.filter(p745 => p745.dmg && p745.active && !p745.isTeamObject(player) && UTILS.getDist(p745, player, 0, 3) < p745.scale + player.scale).sort(function (p746, p747) {
          return UTILS.getDist(p746, player, 0, 2) - UTILS.getDist(p747, player, 0, 2);
        })[0];
        if (v565 && !traps.inTrap) {
          if (near.dist2 <= items.weapons[5].range + near.scale * 1.8) {
            my.anti0Tick = 1;
            buyEquip(6, 0);
          }
          if (v565 && traps.inTrap) {
            if (near.dist3 <= items.weapons[5].range + near.scale * 1.8) {
              my.anti0Tick = 4;
              buyEquip(6, 0);
            }
          }
        }
      }
      if ((useWasd ? true : (player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100)) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || useWasd && Math.floor(Math.random() * 5) == 0) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true(player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near)) {
        if (player.checkCanInsta(true) >= 100) {
          instaC.nobull = useWasd ? false : instaC.canSpikeTick ? false : true;
        } else {
          instaC.nobull = false;
        }
        instaC.can = true;
      } else {
        instaC.can = false;
      }
      if (macro.q) {
        place(0, getAttackDir());
      }
      if (macro.f) {
        place(4, getSafeDir());
      }
      if (macro.v) {
        place(2, getSafeDir());
      }
      if (macro.y) {
        place(5, getSafeDir());
      }
      if (macro.h) {
        place(player.getItemType(22), getSafeDir());
      }
      if (macro.n) {
        place(3, getSafeDir());
      }
      laztPoz.x = player.x;
      laztPoz.y = player.y;
      let v566 = mills.size(items.list[player.items[3]].scale);
      let v567 = mills.dist(items.list[player.items[3]].scale);
      if (UTILS.getDist(mills, player, 0, 2) > v567 + items.list[player.items[3]].placeOffset && game.tick % 2 == 0) {
        if (mills.place) {
          let v568 = {
            x: mills.x,
            y: mills.y
          };
          let v569 = UTILS.getDirect(v568, player, 0, 2);
          checkPlace(3, v569 + UTILS.toRad(v566));
          checkPlace(3, v569 - UTILS.toRad(v566));
          checkPlace(3, v569);
          mills.count = Math.max(0, mills.count - 1);
        }
        mills.x = player.x2;
        mills.y = player.y2;
      }
      if (pads.placeSpawnPads) {
        for (let v570 = 0; v570 < Math.PI * 2; v570 += Math.PI / 2) {
          checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + v570);
        }
      }
      if (instaC.can) {
        instaC.changeType(player.weapons[1] == 10 ? "rev" : "normal");
      }
      if (getEl("smartInsta").checked) {
        if (player.weapons[1] == 15 || player.weapons[1] == 9 || player.weapons[1] == 12 || player.weapons[1] == 13) {
          if (getEl("AutoInsta").value == "smart") {
            if (near.shameCount >= 5 && player.reloads[player.weapons[0]] === 0 && !instaC.isTrue && !clicks.right && player.reloads[player.weapons[1]] === 0 && near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && player.weapons[1] !== 10) {
              instaC.changeType(player.weapons[1] == 9 || player.weapons[1] == 12 || player.weapons[1] == 13 ? "rev" : "normal");
              if (getEl("notifs").checked) {
                notif("AutoInsta:5 Shame");
              }
            }
          }
        }
        if (getEl("AutoInsta").value == "always" && player.reloads[player.weapons[0]] === 0 && !instaC.isTrue && !clicks.right && player.reloads[player.weapons[1]] === 0 && near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && player.weapons[1] !== 10) {
          instaC.changeType(player.weapons[1] == 9 || player.weapons[1] == 12 || player.weapons[1] == 13 ? "rev" : "normal");
        }
      }
      if (instaC.canCounter && !Leuchtturm) {
        instaC.canCounter = false;
        if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
          instaC.counterType();
        }
      }
      if (instaC.canSpikeTick) {
        instaC.canSpikeTick = false;
        if (instaC.revTick) {
          instaC.revTick = false;
          if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
            instaC.changeType("rev");
          }
        } else if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
          instaC.spikeTickType();
          if (instaC.syncHit) {}
        }
      }
      if (!clicks.middle && (clicks.left || clicks.right) && !instaC.isTrue) {
        if (player.weaponIndex != (clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
          selectWeapon(clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
        }
        if (player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
          sendAutoGather();
          my.waitHit = 1;
          game.tickBase(() => {
            sendAutoGather();
            my.waitHit = 0;
          }, 1);
        }
      }
      if (useWasd && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
        if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
          selectWeapon(player.weapons[0]);
        }
        if (player.reloads[player.weapons[0]] == 0 && !my.waitHit) {
          sendAutoGather();
          my.waitHit = 1;
          game.tickBase(() => {
            sendAutoGather();
            my.waitHit = 0;
          }, 1);
        }
        new ver();
      }
      if (getEl("snow").checked) {
        snowflakeContainer.style.display = "block";
      } else {
        snowflakeContainer.style.display = "none";
      }
      if (traps.inTrap) {
        let v571 = liztobj.sort((p748, p749) => fgdo(player, p748) - fgdo(player, p749));
        let v572 = v571.filter(p750 => (p750.name == "spikes" || p750.name == "greater spikes" || p750.name == "spinning spikes" || p750.name == "poison spikes") && fgdo(player, p750) < player.scale + p750.scale + 20 && !isAlly(p750.owner.sid) && p750.active)[0];
        if (!clicks.left && !clicks.right && !instaC.isTrue) {
          if (v572 && player.weapons[1] === 10) {
            tracker.draw3.active = true;
            traps.aim = Math.atan2(v572.y - player.y, v572.x - player.x);
          }
          if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
            tracker.draw3.active = true;
            selectWeapon(traps.notFast() ? player.weapons[1] : player.weapons[0]);
          }
          if (player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
            sendAutoGather();
            my.waitHit = 1;
            game.tickBase(() => {
              sendAutoGather();
              my.waitHit = 0;
            }, 1);
          }
        }
      }
      if (clicks.middle && !traps.inTrap) {
        if (!instaC.isTrue && player.reloads[player.weapons[1]] == 0) {
          if (my.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
            instaC.bowMovement();
          } else {
            instaC.rangeType();
          }
        }
      }
      if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue && (!useWasd || !(near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8))) {
        if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
          if (!my.reloaded) {
            my.reloaded = true;
            let v573 = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
            if (player.weaponIndex != player.weapons[v573] || player.buildIndex > -1) {
              selectWeapon(player.weapons[v573]);
            }
          }
        } else {
          my.reloaded = false;
          if (useWasd) {
            autos.stopspin = false;
          }
          if (player.reloads[player.weapons[0]] > 0) {
            if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
              selectWeapon(player.weapons[0]);
            }
          } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
            if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
              selectWeapon(player.weapons[1]);
            }
            if (useWasd) {
              if (!autos.stopspin) {
                setTimeout(() => {
                  autos.stopspin = true;
                }, 750);
              }
            }
          }
        }
      }
      if (!instaC.isTrue && !traps.inTrap && !traps.replaced) {
        traps.autoPlace();
      }
      if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
        packet("D", getAttackDir());
      }
      let vF10 = function () {
        if (my.anti0Tick > 0 || Leuchtturm) {
          buyEquip(6, 0);
        } else if (clicks.left || clicks.right) {
          if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) && (near && near.dist2 > 140 || !near)) {
            buyEquip(7, 0);
          } else if (clicks.left) {
            buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? 6 : getEl("antiBullType").value == "abreload" && near.antiBull > 0 ? 6 : near.dist2 <= 275 ? getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0 && (player.weapons[0] == 4 || player.weapons[0] == 3) && near.primaryIndex != 5 ? 6 : 6 : 6, 0);
          } else if (clicks.right) {
            buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : player.soldierAnti ? 6 : getEl("antiBullType").value == "abreload" && near.antiBull > 0 ? 6 : near.dist2 <= 275 ? getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0 && (player.weapons[0] == 4 || player.weapons[0] == 3) && near.primaryIndex != 5 ? 6 : 6 : biomeGear(1, 1), 0);
          }
        } else if (traps.inTrap) {
          if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
            buyEquip(40, 0);
          } else if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 7 || 0 && player.skinIndex != 45 || my.reSync) && (near && near.dist2 > 140 || !near)) {
            buyEquip(6, 0);
            setTimeout(() => {
              buyEquip(7, 0);
            }, 120);
          } else {
            buyEquip(player.empAnti || near.dist2 > 300 || !enemy.length ? 22 : 6, 0);
          }
        } else if (player.empAnti || player.soldierAnti) {
          buyEquip(player.empAnti ? 22 : 6, 0);
        } else if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) && (near && near.dist2 > 140 || !near)) {
          buyEquip(7, 0);
          setTimeout(() => {
            buyEquip(7, 0);
          }, 120);
        } else if (near.dist2 <= 275) {
          buyEquip(getEl("antiBullType").value == "abreload" && near.antiBull > 0 ? 6 : getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0 ? 6 : 6, 0);
        } else {
          biomeGear(1);
        }
      };
      let vF11 = function () {
        if (instaC.can && player.checkCanInsta(true) >= 100) {
          buyEquip(21, 1);
        } else if (clicks.left) {
          setTimeout(() => {
            buyEquip(21, 1);
          }, 100);
        } else if (clicks.right) {
          setTimeout(() => {
            buyEquip(21, 1);
          }, 50);
        } else if (near.dist2 <= 350 && !traps.inTrap) {
          buyEquip(19, 1);
        } else if (traps.inTrap) {
          buyEquip(21, 1);
        } else {
          buyEquip(11, 1);
        }
      };
      let vF12 = function () {
        if (my.anti0Tick > 0) {
          buyEquip(6, 0);
        } else if (clicks.left || clicks.right) {
          if (player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) {
            buyEquip(7, 0);
          } else if (clicks.left) {
            buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : 11);
          } else if (clicks.right) {
            buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : 6, 0);
          }
        } else if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
          if (player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) {
            buyEquip(7, 0);
          } else {
            buyEquip(player.reloads[player.weapons[0]] == 0 ? 7 : player.empAnti ? 22 : 6, 0);
          }
        } else if (traps.inTrap) {
          if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
            buyEquip(40, 0);
          } else if (player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) {
            buyEquip(7, 0);
          } else {
            buyEquip(player.empAnti ? 22 : 6, 0);
          }
        } else if (player.empAnti) {
          buyEquip(22, 0);
        } else if (player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45 || my.reSync) {
          buyEquip(7, 0);
        } else {
          buyEquip(6, 0);
        }
        if (clicks.left || clicks.right) {
          if (clicks.left) {
            setTimeout(() => {
              buyEquip(0, 1);
            }, 50);
          } else if (clicks.right) {
            buyEquip(11, 1);
          }
        } else if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
          buyEquip(0, 1);
        } else if (traps.inTrap) {
          buyEquip(0, 1);
        } else {
          buyEquip(11, 1);
        }
      };
      if (near.weaponIndex > 1 && near.dist2 <= 150) {
        buyEquip(6, 0);
      }
      if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
        if (useWasd) {
          vF12();
        } else {
          vF10();
          vF11();
        }
      }
      if (player.alive && inGame && getEl("safeWalk").checked) {
        safeWalk();
      }
      if (getEl("autoPush").checked && enemy.length && !traps.inTrap && !instaC.ticking) {
        autoPush();
      } else if (my.autoPush) {
        my.autoPush = false;
        packet("f", lastMoveDir || undefined, 1);
      }
      if (!my.autoPush && pathFind.active) {
        Pathfinder();
      }
      instaC.ticking &&= false;
      instaC.syncHit &&= false;
      player.empAnti &&= false;
      player.soldierAnti &&= false;
      if (my.anti0Tick > 0) {
        my.anti0Tick--;
      }
      traps.replaced &&= false;
      traps.antiTrapped &&= false;
    }
  }
  if (botSkts.length) {
    botSkts.forEach(p751 => {
      if (true) {
        p751[0].showName = "YEAHHH";
      }
    });
  }
  AutoReplace();
}
for (var i1 = 0; i1 < liztobj.length; i1++) {
  if (liztobj[i1].active && liztobj[i1].health > 0 && UTILS.getDist(liztobj[i1], player, 0, 2) < 150 && getEl("antipush").checked) {
    tracker.draw3.active = true;
    if (liztobj[i1].name.includes("spike") && liztobj[i1]) {
      tracker.draw3.active = true;
      if (liztobj[i1].owner.sid != player.sid && clicks.left == false && tmpObj.reloads[tmpObj.secondaryIndex] == 0) {
        tracker.draw3.active = true;
        selectWeapon(player.weapons[1]);
        buyEquip(40, 0);
        packet("D", UTILS.getDirect(liztobj[i1], player, 0, 2));
        setTickout(() => {
          buyEquip(6, 0);
        }, 1);
      }
    }
  }
  ;
}
function ez(p752, p753, p754) {
  p752.fillStyle = "rgba(0, 255, 255, 0.2)";
  p752.beginPath();
  p752.arc(p753, p754, 55, 0, Math.PI * 2);
  p752.fill();
  p752.closePath();
  p752.globalAlpha = 1;
}
var leaderboard = getEl("leaderboard");
function updateLeaderboard(p755) {
  lastLeaderboardData = p755;
  UTILS.removeAllChildren(leaderboardData);
  let v574 = 1;
  for (let v575 = 0; v575 < p755.length; v575 += 3) {
    (function (p756) {
      UTILS.generateElement({
        class: "leaderHolder",
        parent: leaderboardData,
        children: [UTILS.generateElement({
          class: "leaderboardItem",
          style: "font-family: 'Hammersmith One', cursive; color:" + (p755[p756] == playerSID ? "#fff" : "rgba(255,255,255,0.6)") + "; font-size: 16px;",
          text: p755[p756 + 1] != "" ? p755[p756 + 1] + " " : "unknown"
        }), UTILS.generateElement({
          class: "leaderScore",
          style: "font-family: 'Hammersmith One', cursive; font-size: 16px; color: #fff;",
          text: UTILS.sFormat(p755[p756 + 2]) || "0"
        })]
      });
    })(v575);
    v574++;
  }
}
$("#leaderboard").css({
  "-webkit-border-radius": "0px",
  "-moz-border-radius": "0px",
  "border-radius": "15px",
  "background-color": "transparent",
  "box-shadow": "0 0 5px 2px rgba(255,255,255,0.6)",
  "text-align": "center"
});
var leaderboardElement = document.getElementById("leaderboard");
leaderboardElement.style.position = "fixed";
leaderboardElement.style.top = "10px";
leaderboardElement.style.right = "10px";
var killCounterElement = document.getElementById("killCounter");
killCounterElement.style.position = "fixed";
killCounterElement.style.bottom = "220px";
killCounterElement.style.left = "20px";
killCounterElement.style.width = "25px";
var allianceButton = getEl("allianceButton");
var storeButton = getEl("storeButton");
allianceButton.style.right = "330px";
allianceButton.style.width = "40px";
storeButton.style.right = "270px";
storeButton.style.width = "40px";
function loadGameObject(p757) {
  for (let v576 = 0; v576 < p757.length;) {
    objectManager.add(p757[v576], p757[v576 + 1], p757[v576 + 2], p757[v576 + 3], p757[v576 + 4], p757[v576 + 5], items.list[p757[v576 + 6]], true, p757[v576 + 7] >= 0 ? {
      sid: p757[v576 + 7]
    } : null);
    v576 += 8;
  }
}
function loadAI(p758) {
  for (let v577 = 0; v577 < ais.length; ++v577) {
    ais[v577].forcePos = !ais[v577].visible;
    ais[v577].visible = false;
  }
  if (p758) {
    let v578 = performance.now();
    for (let v579 = 0; v579 < p758.length;) {
      tmpObj = findAIBySID(p758[v579]);
      if (tmpObj) {
        tmpObj.index = p758[v579 + 1];
        tmpObj.t1 = tmpObj.t2 === undefined ? v578 : tmpObj.t2;
        tmpObj.t2 = v578;
        tmpObj.x1 = tmpObj.x;
        tmpObj.y1 = tmpObj.y;
        tmpObj.x2 = p758[v579 + 2];
        tmpObj.y2 = p758[v579 + 3];
        tmpObj.d1 = tmpObj.d2 === undefined ? p758[v579 + 4] : tmpObj.d2;
        tmpObj.d2 = p758[v579 + 4];
        tmpObj.health = p758[v579 + 5];
        tmpObj.dt = 0;
        tmpObj.visible = true;
      } else {
        tmpObj = aiManager.spawn(p758[v579 + 2], p758[v579 + 3], p758[v579 + 4], p758[v579 + 1]);
        tmpObj.x2 = tmpObj.x;
        tmpObj.y2 = tmpObj.y;
        tmpObj.d2 = tmpObj.dir;
        tmpObj.health = p758[v579 + 5];
        if (!aiManager.aiTypes[p758[v579 + 1]].name) {
          tmpObj.name = config.cowNames[p758[v579 + 6]];
        }
        tmpObj.forcePos = true;
        tmpObj.sid = p758[v579];
        tmpObj.visible = true;
      }
      v579 += 7;
    }
  }
}
function animateAI(p759) {
  tmpObj = findAIBySID(p759);
  if (tmpObj) {
    tmpObj.startAnim();
  }
}
function gatherAnimation(p760, p761, p762) {
  tmpObj = findPlayerBySID(p760);
  if (tmpObj) {
    tmpObj.startAnim(p761, p762);
    tmpObj.gatherIndex = p762;
    tmpObj.gathering = 1;
    if (near.dist2 >= 150 && near.dist2 <= 300 && !tmpObj.isTeam(player) && tmpObj.weaponIndex === 5 && tmpObj.primaryVariant >= 1 && !tmpObj.secondaryIndex !== undefined && tmpObj.skinIndex === 53 && (player.canEmpAnti = true)) {
      buyEquip(6, 0);
      healer();
    }
    if (p761) {
      let v580 = objectManager.hitObj;
      objectManager.hitObj = [];
      game.tickBase(() => {
        tmpObj = findPlayerBySID(p760);
        let v581 = items.weapons[p762].dmg * config.weaponVariants[tmpObj[(p762 < 9 ? "prima" : "seconda") + "ryVariant"]].val * (items.weapons[p762].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
        v580.forEach(p763 => {
          p763.health -= v581;
          if (getEl("dmgtext").checked) {
            const v582 = Math.floor(Math.random() * 128) + 128;
            const v583 = Math.floor(Math.random() * 128) + 128;
            const v584 = Math.floor(Math.random() * 128) + 128;
            const v585 = "rgb(" + v582 + ", " + v583 + ", " + v584 + ")";
            textManager.showText(p763.x, p763.y, 30, 0.1, 400, Math.round(v581), v585);
          }
        });
      }, 1);
    }
  }
}
if (nears.filter(p764 => p764.gathering).length > 1) {
  healer();
}
function wiggleGameObject(p765, p766) {
  tmpObj = findObjectBySid(p766);
  if (tmpObj) {
    tmpObj.xWiggle += config.gatherWiggle * Math.cos(p765);
    tmpObj.yWiggle += config.gatherWiggle * Math.sin(p765);
    if (tmpObj.health) {
      tmpObj.damaged = Math.min(255, tmpObj.damaged + 60);
      objectManager.hitObj.push(tmpObj);
    }
  }
}
function shootTurret(p767, p768) {
  tmpObj = findObjectBySid(p767);
  if (tmpObj) {
    if (config.anotherVisual) {
      tmpObj.lastDir = p768;
    } else {
      tmpObj.dir = p768;
    }
    tmpObj.xWiggle += config.gatherWiggle * Math.cos(p768 + Math.PI);
    tmpObj.yWiggle += config.gatherWiggle * Math.sin(p768 + Math.PI);
  }
}
function updatePlayerValue(p769, p770, p771) {
  if (player) {
    player[p769] = p770;
    if (p769 == "points") {
      if (getEl("autoBuy").checked) {
        autoBuy.hat();
        autoBuy.acc();
      }
    } else if (p769 == "kills") {
      if (getEl("killChat").checked) {
        const v586 = document.getElementById("killChatInput").value;
        sendChat(v586);
        setTimeout(() => {
          sendChat(p770 + " =Nubs Which Magmamod killed");
        }, 1000);
      }
    }
  }
}
function updateItems(p772, p773) {
  if (p772) {
    if (p773) {
      player.weapons = p772;
      player.primaryIndex = player.weapons[0];
      player.secondaryIndex = player.weapons[1];
      if (!instaC.isTrue) {
        selectWeapon(player.weapons[0]);
      }
    } else {
      player.items = p772;
    }
  }
  for (let v587 = 0; v587 < items.list.length; v587++) {
    let v588 = items.weapons.length + v587;
    let vGetEl2 = getEl("actionBarItem" + v588);
    vGetEl2.style.display = player.items.indexOf(items.list[v587].id) >= 0 ? "inline-block" : "none";
  }
  for (let v589 = 0; v589 < items.weapons.length; v589++) {
    let vGetEl3 = getEl("actionBarItem" + v589);
    vGetEl3.style.display = player.weapons[items.weapons[v589].type] == items.weapons[v589].id ? "inline-block" : "none";
  }
  let v590 = player.weapons[0] == 3 && player.weapons[1] == 15;
  if (v590) {
    getEl("actionBarItem3").style.display = "none";
    getEl("actionBarItem4").style.display = "inline-block";
  }
}
function addProjectile(p774, p775, p776, p777, p778, p779, p780, p781) {
  projectileManager.addProjectile(p774, p775, p776, p777, p778, p779, null, null, p780, inWindow).sid = p781;
  runAtNextTick.push(Array.prototype.slice.call(arguments));
}
function remProjectile(p782, p783) {
  for (let v591 = 0; v591 < projectiles.length; ++v591) {
    if (projectiles[v591].sid == p782) {
      projectiles[v591].range = p783;
      let v592 = objectManager.hitObj;
      objectManager.hitObj = [];
      game.tickBase(() => {
        let v593 = projectiles[v591].dmg;
        v592.forEach(p784 => {
          if (p784.projDmg) {
            p784.health -= v593;
          }
        });
      }, 1);
    }
  }
}
let noob = false;
let serverReady = true;
var isProd = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");
let wssws = isProd ? "wss" : "ws";
let project = new WebSocket(wssws + "://beautiful-sapphire-toad.glitch.me");
let withSync = true;
project.binaryType = "arraybuffer";
project.onmessage = function (p785) {
  let v594 = p785.data;
  if (v594 == "isready") {
    serverReady = true;
  }
  if (v594 == "fine") {
    noob = false;
  }
  if (v594 == "tezt") {}
  if (v594 == "yeswearesyncer") {
    let v595 = Date.now() - wsDelay;
    withSync = true;
    if (player) {}
  }
};
function allianceNotification(p786, p787) {
  let vFindSID = findSID(bots, p786);
  if (vFindSID) {}
}
function setPlayerTeam(p788, p789) {
  if (player) {
    player.team = p788;
    player.isOwner = p789;
    if (p788 == null) {
      alliancePlayers = [];
    }
  }
}
function setAlliancePlayers(p790) {
  alliancePlayers = p790;
}
function updateStoreItems(p791, p792, p793) {
  if (p793) {
    if (!p791) {
      player.tails[p792] = 1;
    } else {
      player.latestTail = p792;
    }
  } else if (!p791) {
    player.skins[p792] = 1;
    if (p792 == 7) {
      my.reSync = true;
    }
  } else {
    player.latestSkin = p792;
  }
}
function isTeam(p794) {
  return p794 == player || p794.team && p794.team == player.team;
}
function receiveChat(p795, p796, p797) {
  let vFindPlayerBySID4 = findPlayerBySID(p795);
  let v596 = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
  if (player == vFindPlayerBySID4) {
    if (p796.includes(".dc")) {
      setTimeout(() => {
        window.leave();
      }, 50);
    } else if (p796.startsWith(".create")) {
      let v597 = p796.split(" ")[1];
      if (!v597) {
        v597 = "1l1l1l1l1l1l1l";
      }
      packet("L", v597);
    } else if (p796.includes(".leave")) {
      packet("N");
    }
  }
  if (getEl("autoSync").checked) {
    if (isTeam(vFindPlayerBySID4) || player == vFindPlayerBySID4) {
      if (p796.includes(".sync") && !instaC.isTrue && player.reloads[player.weapons[1]] == 0 && player.reloads[player.weapons[0]] == 0) {
        instaC.syncTry();
        sendChat("Delay: " + window.pingTime + "ms");
      }
    }
  }
  if (p796.includes("dc unknownclientuser")) {
    window.leave();
  }
  if (getEl("autorespond").checked) {
    if (p796.includes("mod")) {
      packet("6", "Shut up beggar");
    }
  }
  if (vFindPlayerBySID4) {
    if (!config.anotherVisual) {
      allChats.push(new addCh(vFindPlayerBySID4.x, vFindPlayerBySID4.y, p796, vFindPlayerBySID4));
    } else {
      vFindPlayerBySID4.chatMessage = (p798 => {
        let v598;
        v596.forEach(p799 => {
          if (p798.indexOf(p799) > -1) {
            v598 = "";
            for (var v599 = 0; v599 < p799.length; ++v599) {
              v598 += v598.length ? "o" : "M";
            }
            var v600 = new RegExp(p799, "g");
            p798 = p798.replace(v600, v598);
          }
        });
        return p798;
      })(p796);
      vFindPlayerBySID4.chatCountdown = config.chatCountdown;
    }
  } else {}
}
function updateMinimap(p800) {
  minimapData = p800;
}
function showText(p801, p802, p803, p804, p805) {
  if (getEl("healAnim").checked) {
    textManager.stack.push({
      x: p801,
      y: p802,
      value: p803
    });
  }
}
let bots = [];
let ranLocation = {
  x: UTILS.randInt(35, 14365),
  y: UTILS.randInt(35, 14365)
};
setInterval(() => {
  ranLocation = {
    x: UTILS.randInt(35, 14365),
    y: UTILS.randInt(35, 14365)
  };
}, 60000);
class Bot {
  constructor(p806, p807, p808, p809) {
    this.millPlace = true;
    this.id = p806;
    this.sid = p807;
    this.team = null;
    this.skinIndex = 0;
    this.tailIndex = 0;
    this.hitTime = 0;
    this.iconIndex = 0;
    this.enemy = [];
    this.near = [];
    this.dist2 = 0;
    this.aim2 = 0;
    this.tick = 0;
    this.itemCounts = {};
    this.latestSkin = 0;
    this.latestTail = 0;
    this.points = 0;
    this.tails = {};
    for (let v601 = 0; v601 < p809.length; ++v601) {
      if (p809[v601].price <= 0) {
        this.tails[p809[v601].id] = 1;
      }
    }
    this.skins = {};
    for (let v602 = 0; v602 < p808.length; ++v602) {
      if (p808[v602].price <= 0) {
        this.skins[p808[v602].id] = 1;
      }
    }
    this.spawn = function (p810) {
      this.upgraded = 0;
      this.enemy = [];
      this.near = [];
      this.active = true;
      this.alive = true;
      this.lockMove = false;
      this.lockDir = false;
      this.minimapCounter = 0;
      this.chatCountdown = 0;
      this.shameCount = 0;
      this.shameTimer = 0;
      this.sentTo = {};
      this.gathering = 0;
      this.autoGather = 0;
      this.animTime = 0;
      this.animSpeed = 0;
      this.mouseState = 0;
      this.buildIndex = -1;
      this.weaponIndex = 0;
      this.dmgOverTime = {};
      this.noMovTimer = 0;
      this.maxXP = 300;
      this.XP = 0;
      this.age = 1;
      this.kills = 0;
      this.upgrAge = 2;
      this.upgradePoints = 0;
      this.x = 0;
      this.y = 0;
      this.zIndex = 0;
      this.xVel = 0;
      this.yVel = 0;
      this.slowMult = 1;
      this.dir = 0;
      this.nDir = 0;
      this.dirPlus = 0;
      this.targetDir = 0;
      this.targetAngle = 0;
      this.maxHealth = 100;
      this.health = this.maxHealth;
      this.oldHealth = this.maxHealth;
      this.scale = config.playerScale;
      this.speed = config.playerSpeed;
      this.resetMoveDir();
      this.resetResources(p810);
      this.items = [0, 3, 6, 10];
      this.weapons = [0];
      this.shootCount = 0;
      this.weaponXP = [];
      this.isBot = false;
      this.reloads = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        53: 0
      };
      this.timeZinceZpawn = 0;
      this.whyDie = "";
      this.clearRadius = false;
      this.circlee = 0;
    };
    this.resetMoveDir = function () {
      this.moveDir = undefined;
    };
    this.resetResources = function (p811) {
      for (let v603 = 0; v603 < config.resourceTypes.length; ++v603) {
        this[config.resourceTypes[v603]] = p811 ? 100 : 0;
      }
    };
    this.setData = function (p812) {
      this.id = p812[0];
      this.sid = p812[1];
      this.name = p812[2];
      this.x = p812[3];
      this.y = p812[4];
      this.dir = p812[5];
      this.health = p812[6];
      this.maxHealth = p812[7];
      this.scale = p812[8];
      this.skinColor = p812[9];
    };
    this.judgeShame = function () {
      if (this.oldHealth < this.health) {
        if (this.hitTime) {
          let v604 = this.tick - this.hitTime;
          this.hitTime = 0;
          if (v604 < 2) {
            this.lastshamecount = this.shameCount;
            this.shameCount++;
          } else {
            this.lastshamecount = this.shameCount;
            this.shameCount = Math.max(0, this.shameCount - 2);
          }
        }
      } else if (this.oldHealth > this.health) {
        this.hitTime = this.tick;
      }
    };
    this.manageReloadaa = function () {
      if (this.shooting[53]) {
        this.shooting[53] = 0;
        this.reloads[53] = 2500 - 1000 / 9;
      } else if (this.reloads[53] > 0) {
        this.reloads[53] = Math.max(0, this.reloads[53] - 1000 / 9);
      }
      if (this.gathering || this.shooting[1]) {
        if (this.gathering) {
          this.gathering = 0;
          this.reloads[this.gatherIndex] = items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
          this.attacked = true;
        }
        if (this.shooting[1]) {
          this.shooting[1] = 0;
          this.reloads[this.shootIndex] = items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
          this.attacked = true;
        }
      } else {
        this.attacked = false;
        if (this.buildIndex < 0) {
          if (this.reloads[this.weaponIndex] > 0) {
            this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
          }
        }
      }
    };
    this.closeSockets = function (p813) {
      p813.close();
    };
    this.whyDieChat = function (p814, p815) {
      p814.sendWS("6", "why die XDDD " + p815);
    };
  }
}
;
class BotObject {
  constructor(p816) {
    this.sid = p816;
    this.init = function (p817, p818, p819, p820, p821, p822, p823) {
      p822 = p822 || {};
      this.active = true;
      this.x = p817;
      this.y = p818;
      this.scale = p820;
      this.owner = p823;
      this.id = p822.id;
      this.dmg = p822.dmg;
      this.trap = p822.trap;
      this.teleport = p822.teleport;
      this.isItem = this.id != undefined;
    };
  }
}
;
class BotObjManager {
  constructor(p824, p825) {
    this.disableObj = function (p826) {
      p826.active = false;
      if (config.anotherVisual) {} else {
        p826.alive = false;
      }
    };
    let v605;
    this.add = function (p827, p828, p829, p830, p831, p832, p833, p834, p835) {
      v605 = p825(p827);
      if (!v605) {
        v605 = p824.find(p836 => !p836.active);
        if (!v605) {
          v605 = new BotObject(p827);
          p824.push(v605);
        }
      }
      if (p834) {
        v605.sid = p827;
      }
      v605.init(p828, p829, p830, p831, p832, p833, p835);
    };
    this.disableBySid = function (p837) {
      let vP825 = p825(p837);
      if (vP825) {
        this.disableObj(vP825);
      }
    };
    this.removeAllItems = function (p838, p839) {
      p824.filter(p840 => p840.active && p840.owner && p840.owner.sid == p838).forEach(p841 => this.disableObj(p841));
    };
  }
}
;
let botz = [];
function botSpawn(p842) {
  let v606;
  console.log(WS);
  let v607 = WS.url.split("wss://")[1].split("?")[0];
  v606 = p842 && new WebSocket("wss://" + v607 + "?token=re:" + encodeURIComponent(p842));
  let v608 = new Map();
  botSkts.push([v608]);
  botz.push([v606]);
  let v609;
  let v610 = [];
  let v611 = [];
  let v612 = {
    x: 0,
    y: 0,
    inGame: false,
    closeSocket: false,
    whyDie: ""
  };
  let v613 = {
    x: 0,
    y: 0
  };
  let v614 = 0;
  let v615 = new BotObjManager(v610, function (p843) {
    return findSID(v610, p843);
  });
  v606.binaryType = "arraybuffer";
  v606.first = true;
  v606.sendWS = function (p844) {
    let v616 = Array.prototype.slice.call(arguments, 1);
    let v617 = window.msgpack.encode([p844, v616]);
    v606.send(v617);
  };
  v606.spawn = function () {
    v606.sendWS("M", {
      name: "unknown1l",
      moofoll: 1,
      skin: "__proto__"
    });
  };
  v606.sendUpgrade = function (p845) {
    v606.sendWS("H", p845);
  };
  v606.place = function (p846, p847) {
    try {
      let v618 = items.list[v608.items[p846]];
      if (v608.itemCounts[v618.group.id] == undefined ? true : v608.itemCounts[v618.group.id] < (config.isSandbox ? 296 : v618.group.limit ? v618.group.limit : 296)) {
        v606.sendWS("G", v608.items[p846]);
        v606.sendWS("d", 1, p847);
        v606.sendWS("G", v608.weaponIndex, true);
      }
    } catch (_0x500fa2) {}
  };
  v606.buye = function (p848, p849) {
    let v619 = 0;
    if (v608.alive && v608.inGame) {
      if (p849 == 0) {
        if (v608.skins[p848]) {
          if (v608.latestSkin != p848) {
            v606.sendWS("c", 0, p848, 0);
          }
        } else {
          let vFindID5 = findID(hats, p848);
          if (vFindID5) {
            if (v608.points >= vFindID5.price) {
              v606.sendWS("c", 1, p848, 0);
              v606.sendWS("c", 0, p848, 0);
            } else if (v608.latestSkin != v619) {
              v606.sendWS("c", 0, v619, 0);
            }
          } else if (v608.latestSkin != v619) {
            v606.sendWS("c", 0, v619, 0);
          }
        }
      } else if (p849 == 1) {
        if (v608.tails[p848]) {
          if (v608.latestTail != p848) {
            v606.sendWS("c", 0, p848, 1);
          }
        } else {
          let vFindID6 = findID(accessories, p848);
          if (vFindID6) {
            if (v608.points >= vFindID6.price) {
              v606.sendWS("c", 1, p848, 1);
              v606.sendWS("c", 0, p848, 1);
            } else if (v608.latestTail != 0) {
              v606.sendWS("c", 0, 0, 1);
            }
          } else if (v608.latestTail != 0) {
            v606.sendWS("c", 0, 0, 1);
          }
        }
      }
    }
  };
  v606.fastGear = function () {
    if (v608.y2 >= config.mapScale / 2 - config.riverWidth / 2 && v608.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
      v606.buye(31, 0);
    } else if (v608.moveDir == undefined) {
      v606.buye(22, 0);
    } else if (v608.y2 <= config.snowBiomeTop) {
      v606.buye(15, 0);
    } else {
      v606.buye(12, 0);
    }
  };
  v606.selectWeapon = function (p850) {
    packet("G", p850, 1);
  };
  function f45(p851, p852) {
    try {
      return Math.atan2((p852.y2 || p852.y) - (p851.y2 || p851.y), (p852.x2 || p852.x) - (p851.x2 || p851.x));
    } catch (_0x2209f6) {
      return 0;
    }
  }
  v606.heal = function () {
    if (v608.health < 100) {
      v606.place(0, 0);
    }
  };
  function f46(p853, p854) {
    try {
      return Math.hypot((p854.y2 || p854.y) - (p853.y2 || p853.y), (p854.x2 || p854.x) - (p853.x2 || p853.x));
    } catch (_0x18ce1c) {
      return Infinity;
    }
  }
  let v620 = "no";
  v606.zync = function (p855) {
    if (!v608.millPlace) {
      v620 = "yeah";
      v606.place(5, f45(v608, p855));
      let v621 = {
        x: v608.x + Math.cos(f45(p855, v608) - Math.PI) * 80,
        y: v608.y + Math.sin(f45(p855, v608) - Math.PI) * 80,
        x2: v608.x + Math.cos(f45(p855, v608) - Math.PI) * 80,
        y2: v608.y + Math.sin(f45(p855, v608) - Math.PI) * 80
      };
      function f47(p856, p857, p858, p859) {
        let v622 = Math.sqrt(Math.pow(p858 - p856, 2) + Math.pow(p859 - p857, 2));
        return v622;
      }
      function f48() {
        v606.sendWS("6", f47(v621.x, v621.y, v608.x, v608.y) + "");
        v606.sendWS("D", f45(p855, v608) - Math.PI);
      }
      let vSetInterval3 = setInterval(() => {
        v606.sendWS("G", v608.weapons[1], true);
        if (v614 == 0) {
          v606.sendWS("K", 1);
          v614 = 1;
        }
        setTimeout(() => {
          v606.sendWS("G", v608.weapons[0], true);
        }, 2000);
        v606.buye(53, 0);
        if (f47(v621.x, v621.y, v608.x, v608.y) > 5) {
          v606.sendWS("f", f45(v608, v621));
        } else {
          v606.sendWS("6", f47(v621.x, v621.y, v608.x, v608.y) + "");
          v620 = "no";
          v606.sendWS("f", undefined);
          f48();
          clearInterval(vSetInterval3);
        }
      }, 150);
      setTimeout(() => {
        v620 = "no";
        clearInterval(vSetInterval3);
      }, 500);
    }
  };
  v606.onmessage = function (p860) {
    let v623 = new Uint8Array(p860.data);
    let v624 = window.msgpack.decode(v623);
    let v625 = v624[0];
    v623 = v624[1];
    if (v625 == "io-init") {
      v606.spawn();
    }
    if (v625 == "1") {
      v609 = v623[0];
      console.log(v609);
    }
    if (v625 == "D") {
      if (v623[1]) {
        v608 = new Bot(v623[0][0], v623[0][1], hats, accessories);
        v608.setData(v623[0]);
        v608.inGame = true;
        v608.alive = true;
        v608.x2 = undefined;
        v608.y2 = undefined;
        v608.spawn(1);
        v608.oldHealth = 100;
        v608.health = 100;
        v608.showName = "YEAHHH";
        v613 = {
          x: v623[0][3],
          y: v623[0][4]
        };
        v612.inGame = true;
        if (v606.first) {
          v606.first = false;
          bots.push(v612);
        }
      }
    }
    if (v625 == "P") {
      v606.spawn();
      v608.inGame = false;
      v612.inGame = false;
    }
    if (v625 == "f") {
      let v626 = v623[0];
      v608.tick++;
      v608.enemy = [];
      v608.near = [];
      v606.showName = "YEAHHH";
      v611 = [];
      for (let v627 = 0; v627 < v626.length;) {
        if (v626[v627] == v608.sid) {
          v608.x2 = v626[v627 + 1];
          v608.y2 = v626[v627 + 2];
          v608.d2 = v626[v627 + 3];
          v608.buildIndex = v626[v627 + 4];
          v608.weaponIndex = v626[v627 + 5];
          v608.weaponVariant = v626[v627 + 6];
          v608.team = v626[v627 + 7];
          v608.isLeader = v626[v627 + 8];
          v608.skinIndex = v626[v627 + 9];
          v608.tailIndex = v626[v627 + 10];
          v608.iconIndex = v626[v627 + 11];
          v608.zIndex = v626[v627 + 12];
          v608.visible = true;
          v612.x2 = v608.x2;
          v612.y2 = v608.y2;
        }
        v627 += 13;
      }
      for (let v628 = 0; v628 < v626.length;) {
        tmpObj = findPlayerBySID(v626[v628]);
        if (tmpObj) {
          if (!tmpObj.isTeam(v608)) {
            enemy.push(tmpObj);
            if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + v608.scale * 2) {
              nears.push(tmpObj);
            }
          }
        }
        v628 += 13;
      }
      if (enemy.length) {
        v608.near = enemy.sort(function (p861, p862) {
          return p861.dist2 - p862.dist2;
        })[0];
      }
      if (v614 == 1) {
        v606.sendWS("K", 1);
        v614 = 0;
      }
      if (v612.closeSocket) {
        v608.closeSockets(v606);
      }
      if (v612.whyDie != "") {
        v608.whyDieChat(v606, v612.whyDie);
        v612.whyDie = "";
      }
      if (v608.alive) {
        if (player.team) {
          if (v608.team != player.team && v608.tick % 9 === 0) {
            if (v608.team) {
              v606.sendWS("N");
            }
            v606.sendWS("b", player.team);
          }
        }
        let v629 = items.list[v608.items[3]];
        let v630 = v608.itemCounts[v629.group.id];
        if ((v630 != undefined ? v630 : 0) < 201 && v608.millPlace) {
          if (v608.inGame) {
            v606.sendWS("D", v608.moveDir);
            if (v614 == 0) {
              v606.sendWS("K", 1);
              v614 = 1;
            }
            if (UTILS.getDist(v613, v608, 0, 2) > 90) {
              let v631 = UTILS.getDirect(v613, v608, 0, 2);
              v606.place(3, v631 + 7.7);
              v606.place(3, v631 - 7.7);
              v606.place(3, v631);
              v613 = {
                x: v608.x2,
                y: v608.y2
              };
            }
            if (v608.tick % 90 === 0) {
              let v632 = Math.random() * Math.PI * 2;
              v608.moveDir = v632;
              v606.sendWS("f", v608.moveDir);
            }
          }
          v606.fastGear();
        } else if ((v630 != undefined ? v630 : 0) > 296 && v608.millPlace) {
          v608.millPlace = false;
          v606.fastGear();
        } else if (v608.inGame) {
          if (v610.length > 0) {
            let v633 = v610.filter(p863 => p863.active && p863.isItem && UTILS.getDist(p863, player, 0, 2) <= 600);
            if (getEl("mode").value == "fuckemup") {
              v606.selectWeapon(v608.weapons[1]);
              let v634 = UTILS.getDist(v633[0], v608, 0, 2);
              let v635 = UTILS.getDirect(v633[0], v608, 0, 2);
              v611 = v610.filter(p864 => p864.active && (findSID(v633, p864.sid) ? true : !p864.trap || player.sid != p864.owner.sid && !player.findAllianceBySid(p864.owner.sid)) && p864.isItem && UTILS.getDist(p864, v608, 0, 2) <= items.weapons[v608.weaponIndex].range + p864.scale + 10).sort(function (p865, p866) {
                return UTILS.getDist(p865, v608, 0, 2) - UTILS.getDist(p866, v608, 0, 2);
              })[0];
              if (v611) {
                let v636 = UTILS.getDist(v633[0], v611, 0, 0);
                if (v634 - v636 > 0) {
                  if (findSID(v633, v611.sid) ? true : v611.dmg || v611.trap) {
                    if (v608.moveDir != undefined) {
                      v608.moveDir = undefined;
                      v606.sendWS("f", v608.moveDir);
                      v606.sendWS("D", v608.nDir);
                    }
                  } else {
                    v608.moveDir = v635;
                    v606.sendWS("f", v608.moveDir);
                    v606.sendWS("D", v608.nDir);
                  }
                  if (v608.nDir != UTILS.getDirect(v611, v608, 0, 2)) {
                    v608.nDir = UTILS.getDirect(v611, v608, 0, 2);
                    v606.sendWS("D", v608.nDir);
                  }
                  if (v614 == 0) {
                    v606.sendWS("K", 1);
                    v614 = 1;
                  }
                  v606.buye(40, 0);
                } else {
                  v608.moveDir = v635;
                  v606.sendWS("f", v608.moveDir);
                  v606.sendWS("D", v608.nDir);
                  v606.fastGear();
                }
              } else {
                v608.moveDir = v635;
                v606.sendWS("f", v608.moveDir);
                v606.sendWS("D", v608.nDir);
                v606.fastGear();
              }
            }
          }
          if (v610.length > 0) {
            if (getEl("mode").value == "flex") {
              const v637 = v608.sid * (Math.PI * 2 / v608.sid);
              const v638 = Math.cos(Date.now() * 0.01) * 300 + player.x;
              const v639 = Math.sin(Date.now() * 0.01) * 300 + player.x;
              v606.sendWS("f", Math.atan2(v639 - v608.y, v638 - v608.x));
              const v640 = Math.hypot(v638 - v608.x, v639 - v608.y);
              if (v640 > 22) {
                return;
              }
            }
          }
          if (v610.length > 0) {
            v611 = v610.filter(p867 => p867.active && p867.isItem && UTILS.getDist(p867, v608, 0, 2) <= items.weapons[v608.weaponIndex].range).sort(function (p868, p869) {
              return UTILS.getDist(p868, v608, 0, 2) - UTILS.getDist(p869, v608, 0, 2);
            })[0];
            if (v611) {
              if (v614 == 0) {
                v606.sendWS("K", 1);
                v614 = 1;
              }
              if (v608.nDir != UTILS.getDirect(v611, v608, 0, 2)) {
                v608.nDir = UTILS.getDirect(v611, v608, 0, 2);
                v606.sendWS("D", v608.nDir);
              }
              v606.buye(40, 0);
              v606.buye(11, 1);
            } else {
              v606.fastGear();
              v606.buye(11, 1);
            }
            v606.buye(11, 1);
            if (breakObjects.length > 0 && getEl("mode").value == "clear") {
              v606.selectWeapon(v608.weapons[1]);
              let v641 = UTILS.getDist(breakObjects[0], v608, 0, 2);
              let v642 = UTILS.getDirect(breakObjects[0], v608, 0, 2);
              v611 = v610.filter(p870 => p870.active && (findSID(breakObjects, p870.sid) ? true : !p870.trap || player.sid != p870.owner.sid && !player.findAllianceBySid(p870.owner.sid)) && p870.isItem && UTILS.getDist(p870, v608, 0, 2) <= items.weapons[v608.weaponIndex].range + p870.scale).sort(function (p871, p872) {
                return UTILS.getDist(p871, v608, 0, 2) - UTILS.getDist(p872, v608, 0, 2);
              })[0];
              if (v611) {
                let v643 = UTILS.getDist(breakObjects[0], v611, 0, 0);
                if (v641 - v643 > 0) {
                  if (findSID(breakObjects, v611.sid) ? true : v611.dmg || v611.trap) {
                    if (v608.moveDir != undefined) {
                      v608.moveDir = undefined;
                      v606.sendWS("f", v608.moveDir);
                      v606.sendWS("D", v608.nDir);
                    }
                  } else {
                    v608.moveDir = v642;
                    v606.sendWS("f", v608.moveDir);
                    v606.sendWS("D", v608.nDir);
                  }
                  if (v608.nDir != UTILS.getDirect(v611, v608, 0, 2)) {
                    v608.nDir = UTILS.getDirect(v611, v608, 0, 2);
                    v606.sendWS("D", v608.nDir);
                  }
                  if (v614 == 0) {
                    v606.sendWS("K", 1);
                    v614 = 1;
                  }
                  v606.buye(40, 0);
                  v606.fastGear();
                } else {
                  v608.moveDir = v642;
                  v606.sendWS("f", v608.moveDir);
                  v606.sendWS("D", v608.nDir);
                  v606.fastGear();
                }
              } else {
                v608.moveDir = v642;
                v606.sendWS("f", v608.moveDir);
                v606.sendWS("D", v608.nDir);
                v606.fastGear();
              }
              if (v641 > 300) {
                if (UTILS.getDist(v613, v608, 0, 2) > 90) {
                  let v644 = UTILS.getDirect(v613, v608, 0, 2);
                  v606.place(3, v644 + 7.7);
                  v606.place(3, v644 - 7.7);
                  v606.place(3, v644);
                  v613 = {
                    x: v608.x2,
                    y: v608.y2
                  };
                }
              }
            }
          }
          if (v610.length > 0 && getEl("mode").value == "zync") {
            let v645 = v610.filter(p873 => p873.active && p873.isItem && UTILS.getDist(p873, player, 0, 2) <= items.weapons[v608.weaponIndex].range + p873.scale);
            if (!v645.length) {
              if (v620 == "no") {
                v606.sendWS("D", UTILS.getDirect(player, v608, 0, 2));
              }
              v606.sendWS("f", f45(player, v608) + Math.PI);
            }
            if (v645.length) {
              let v646 = UTILS.getDist(v645[0], v608, 0, 2);
              let v647 = UTILS.getDirect(v645[0], v608, 0, 2);
              v611 = v610.filter(p874 => p874.active && (findSID(v645, p874.sid) ? true : !p874.trap || player.sid != p874.owner.sid && !player.findAllianceBySid(p874.owner.sid)) && p874.isItem && UTILS.getDist(p874, v608, 0, 2) <= items.weapons[v608.weaponIndex].range + p874.scale).sort(function (p875, p876) {
                return UTILS.getDist(p875, v608, 0, 2) - UTILS.getDist(p876, v608, 0, 2);
              })[0];
              if (v611) {
                let v648 = UTILS.getDist(v645[0], v611, 0, 0);
                if (v646 - v648 > 0) {
                  if (findSID(v645, v611.sid) ? true : v611.dmg || v611.trap) {
                    if (v608.moveDir != undefined) {
                      v608.moveDir = undefined;
                      v606.sendWS("f", v608.moveDir);
                      v606.sendWS("D", v608.nDir);
                    }
                  } else {
                    v606.sendWS("D", v608.nDir);
                  }
                  if (v608.nDir != UTILS.getDirect(v611, v608, 0, 2)) {
                    v608.nDir = UTILS.getDirect(v611, v608, 0, 2);
                    v606.sendWS("D", v608.nDir);
                  }
                  if (v614 == 0) {
                    v606.sendWS("K", 1);
                    v614 = 1;
                  }
                  v606.buye(40, 0);
                  v606.fastGear();
                } else {
                  if (v620 == "no") {
                    v606.sendWS("D", UTILS.getDirect(v611, v608, 0, 2));
                  }
                  if (f46(player, v608) <= 110) {
                    v606.sendWS("f", undefined);
                  } else {
                    v606.sendWS("f", f45(player, v608) + Math.PI);
                  }
                }
              } else if (v645.length) {
                if (v620 == "no") {
                  v606.sendWS("D", UTILS.getDirect(v645[0], v608, 0, 2));
                }
                if (f46(player, v608) <= 110) {
                  v606.sendWS("f", undefined);
                } else {
                  v606.sendWS("f", f45(player, v608) + Math.PI);
                }
              } else {
                if (v620 == "no") {
                  v606.sendWS("D", UTILS.getDirect(player, v608, 0, 2));
                }
                if (f46(player, v608) <= 110) {
                  v606.sendWS("f", undefined);
                } else {
                  v606.sendWS("f", f45(player, v608) + Math.PI);
                }
              }
            }
          }
        }
      }
    }
    if (v625 == "H") {
      let v649 = v623[0];
      for (let v650 = 0; v650 < v649.length;) {
        v615.add(v649[v650], v649[v650 + 1], v649[v650 + 2], v649[v650 + 3], v649[v650 + 4], v649[v650 + 5], items.list[v649[v650 + 6]], true, v649[v650 + 7] >= 0 ? {
          sid: v649[v650 + 7]
        } : null);
        v650 += 8;
      }
    }
    if (v625 == "N") {
      let v651 = v623[0];
      let v652 = v623[1];
      if (v608) {
        v608[v651] = v652;
      }
    }
    if (v625 == "O") {
      if (v623[0] == v608.sid) {
        v608.oldHealth = v608.health;
        v608.health = v623[1];
        v608.judgeShame();
        if (v608.oldHealth > v608.health) {
          if (v608.shameCount < 5) {
            for (let v653 = 0; v653 < 2; v653++) {
              v606.place(0, v608.nDir);
            }
          } else {
            setTimeout(() => {
              for (let v654 = 0; v654 < 2; v654++) {
                v606.place(0, v608.nDir);
              }
            }, 95);
          }
        }
      }
    }
    if (v625 == "Q") {
      let v655 = v623[0];
      v615.disableBySid(v655);
    }
    if (v625 == "R") {
      let v656 = v623[0];
      if (v608.alive) {
        v615.removeAllItems(v656);
      }
    }
    if (v625 == "S") {
      let v657 = v623[0];
      let v658 = v623[1];
      if (v608) {
        v608.itemCounts[v657] = v658;
      }
    }
    if (v625 == "U") {
      if (v623[0] > 0) {
        if (getEl("setup").value == "dm") {
          if (v608.upgraded == 0) {
            v606.sendUpgrade(7);
          } else if (v608.upgraded == 1) {
            v606.sendUpgrade(17);
          } else if (v608.upgraded == 2) {
            v606.sendUpgrade(31);
          } else if (v608.upgraded == 3) {
            v606.sendUpgrade(23);
          } else if (v608.upgraded == 4) {
            v606.sendUpgrade(9);
          } else if (v608.upgraded == 5) {
            v606.sendUpgrade(34);
          } else if (v608.upgraded == 6) {
            v606.sendUpgrade(12);
          } else if (v608.upgraded == 7) {
            v606.sendUpgrade(15);
          }
        } else if (getEl("setup").value == "dr") {
          if (v608.upgraded == 0) {
            v606.sendUpgrade(7);
          } else if (v608.upgraded == 1) {
            v606.sendUpgrade(17);
          } else if (v608.upgraded == 2) {
            v606.sendUpgrade(31);
          } else if (v608.upgraded == 3) {
            v606.sendUpgrade(23);
          } else if (v608.upgraded == 4) {
            v606.sendUpgrade(9);
          } else if (v608.upgraded == 5) {
            v606.sendUpgrade(34);
          } else if (v608.upgraded == 6) {
            v606.sendUpgrade(12);
          } else if (v608.upgraded == 7) {
            v606.sendUpgrade(13);
          }
        } else if (getEl("setup").value == "kh") {
          if (v608.upgraded == 0) {
            v606.sendUpgrade(3);
          } else if (v608.upgraded == 1) {
            v606.sendUpgrade(17);
          } else if (v608.upgraded == 2) {
            v606.sendUpgrade(31);
          } else if (v608.upgraded == 3) {
            v606.sendUpgrade(27);
          } else if (v608.upgraded == 4) {
            v606.sendUpgrade(10);
          } else if (v608.upgraded == 5) {
            v606.sendUpgrade(34);
          } else if (v608.upgraded == 6) {
            v606.sendUpgrade(4);
          } else if (v608.upgraded == 7) {
            v606.sendUpgrade(25);
          }
        } else if (getEl("setup").value == "zd") {
          if (v608.upgraded == 0) {
            v606.sendUpgrade(3);
          } else if (v608.upgraded == 1) {
            v606.sendUpgrade(17);
          } else if (v608.upgraded == 2) {
            v606.sendUpgrade(31);
          } else if (v608.upgraded == 3) {
            v606.sendUpgrade(27);
          } else if (v608.upgraded == 4) {
            v606.sendUpgrade(9);
          } else if (v608.upgraded == 5) {
            v606.sendUpgrade(34);
          } else if (v608.upgraded == 6) {
            v606.sendUpgrade(12);
          } else if (v608.upgraded == 7) {
            v606.sendUpgrade(15);
          }
        }
        v608.upgraded++;
      }
    }
    if (v625 == "V") {
      let v659 = v623[0];
      let v660 = v623[1];
      if (v659) {
        if (v660) {
          v608.weapons = v659;
        } else {
          v608.items = v659;
        }
      }
    }
    if (v625 == "5") {
      let v661 = v623[0];
      let v662 = v623[1];
      let v663 = v623[2];
      if (v663) {
        if (!v661) {
          v608.tails[v662] = 1;
        } else {
          v608.latestTail = v662;
        }
      } else if (!v661) {
        v608.skins[v662] = 1;
      } else {
        v608.latestSkin = v662;
      }
    }
    if (v625 == "6") {
      let v664 = v623[0];
      let v665 = v623[1] + "";
      if (v664 == player.sid && v665.includes("syncon")) {
        v606.zync(v608.near);
      }
    }
  };
  v606.onclose = function () {
    v608.inGame = false;
    v612.inGame = false;
  };
}
let spikes = {
  near: [],
  aim: undefined,
  nearSpike: false,
  nearBreak: false
};
let trapData = {
  sid: undefined,
  hitCount: 0
};
let tracker = {
  draw3: {
    active: false,
    x: 0,
    y: 0,
    scale: 0
  },
  draw2: {
    active: false,
    x: 0,
    y: 0,
    scale: 0
  },
  moveDir: undefined,
  lastPos: {
    x: 0,
    y: 0
  }
};
function renderLeaf(p877, p878, p879, p880, p881) {
  let v666 = p877 + p879 * Math.cos(p880);
  let v667 = p878 + p879 * Math.sin(p880);
  let v668 = p879 * 0.4;
  p881.moveTo(p877, p878);
  p881.beginPath();
  p881.quadraticCurveTo((p877 + v666) / 2 + v668 * Math.cos(p880 + Math.PI / 2), (p878 + v667) / 2 + v668 * Math.sin(p880 + Math.PI / 2), v666, v667);
  p881.quadraticCurveTo((p877 + v666) / 2 - v668 * Math.cos(p880 + Math.PI / 2), (p878 + v667) / 2 - v668 * Math.sin(p880 + Math.PI / 2), p877, p878);
  p881.closePath();
  p881.fill();
  p881.stroke();
}
function renderCircle(p882, p883, p884, p885, p886, p887) {
  p885 = p885 || mainContext;
  p885.beginPath();
  p885.arc(p882, p883, p884, 0, Math.PI * 2);
  if (!p887) {
    p885.fill();
  }
  if (!p886) {
    p885.stroke();
  }
}
function renderHealthCircle(p888, p889, p890, p891, p892, p893) {
  p891 = p891 || mainContext;
  p891.beginPath();
  p891.arc(p888, p889, p890, 0, Math.PI * 2);
  if (!p893) {
    p891.fill();
  }
  if (!p892) {
    p891.stroke();
  }
}
function renderStar(p894, p895, p896, p897) {
  let v669 = Math.PI / 2 * 3;
  let v670;
  let v671;
  let v672 = Math.PI / p895;
  p894.beginPath();
  p894.moveTo(0, -p896);
  for (let v673 = 0; v673 < p895; v673++) {
    v670 = Math.cos(v669) * p896;
    v671 = Math.sin(v669) * p896;
    p894.lineTo(v670, v671);
    v669 += v672;
    v670 = Math.cos(v669) * p897;
    v671 = Math.sin(v669) * p897;
    p894.lineTo(v670, v671);
    v669 += v672;
  }
  p894.lineTo(0, -p896);
  p894.closePath();
}
function renderHealthStar(p898, p899, p900, p901) {
  let v674 = Math.PI / 2 * 3;
  let v675;
  let v676;
  let v677 = Math.PI / p899;
  p898.beginPath();
  p898.moveTo(0, -p900);
  for (let v678 = 0; v678 < p899; v678++) {
    v675 = Math.cos(v674) * p900;
    v676 = Math.sin(v674) * p900;
    p898.lineTo(v675, v676);
    v674 += v677;
    v675 = Math.cos(v674) * p901;
    v676 = Math.sin(v674) * p901;
    p898.lineTo(v675, v676);
    v674 += v677;
  }
  p898.lineTo(0, -p900);
  p898.closePath();
}
function renderRect(p902, p903, p904, p905, p906, p907, p908) {
  if (!p908) {
    p906.fillRect(p902 - p904 / 2, p903 - p905 / 2, p904, p905);
  }
  if (!p907) {
    p906.strokeRect(p902 - p904 / 2, p903 - p905 / 2, p904, p905);
  }
}
function renderHealthRect(p909, p910, p911, p912, p913, p914, p915) {
  if (!p915) {
    p913.fillRect(p909 - p911 / 2, p910 - p912 / 2, p911, p912);
  }
  if (!p914) {
    p913.strokeRect(p909 - p911 / 2, p910 - p912 / 2, p911, p912);
  }
}
function renderRectCircle(p916, p917, p918, p919, p920, p921, p922, p923) {
  p921.save();
  p921.translate(p916, p917);
  p920 = Math.ceil(p920 / 2);
  for (let v679 = 0; v679 < p920; v679++) {
    renderRect(0, 0, p918 * 2, p919, p921, p922, p923);
    p921.rotate(Math.PI / p920);
  }
  p921.restore();
}
function renderBlob(p924, p925, p926, p927) {
  let v680 = Math.PI / 2 * 3;
  let v681;
  let v682;
  let v683 = Math.PI / p925;
  let v684;
  p924.beginPath();
  p924.moveTo(0, -p927);
  for (let v685 = 0; v685 < p925; v685++) {
    v684 = UTILS.randInt(p926 + 0.9, p926 * 1.2);
    p924.quadraticCurveTo(Math.cos(v680 + v683) * v684, Math.sin(v680 + v683) * v684, Math.cos(v680 + v683 * 2) * p927, Math.sin(v680 + v683 * 2) * p927);
    v680 += v683 * 2;
  }
  p924.lineTo(0, -p927);
  p924.closePath();
}
function renderTriangle(p928, p929) {
  p929 = p929 || mainContext;
  let v686 = p928 * (Math.sqrt(3) / 2);
  p929.beginPath();
  p929.moveTo(0, -v686 / 2);
  p929.lineTo(-p928 / 2, v686 / 2);
  p929.lineTo(p928 / 2, v686 / 2);
  p929.lineTo(0, -v686 / 2);
  p929.fill();
  p929.closePath();
}
function prepareMenuBackground() {}
const speed = 1;
function renderDeadPlayers(p930, p931) {
  mainContext.fillStyle = "#91b2db";
  const v687 = Date.now();
  deadPlayers.filter(p932 => p932.active).forEach(p933 => {
    if (!p933.startTime) {
      p933.startTime = v687;
      p933.angle = 0;
      p933.radius = 0.1;
    }
    const v688 = v687 - p933.startTime;
    const v689 = 1;
    p933.alpha = Math.max(0, v689 - v688 / 3000);
    p933.animate(delta);
    mainContext.globalAlpha = p933.alpha;
    mainContext.strokeStyle = outlineColor;
    mainContext.save();
    mainContext.translate(p933.x - p930, p933.y - p931);
    p933.radius -= 0.001;
    p933.angle += 10;
    const v690 = 1;
    const v691 = p933.radius * Math.cos(p933.angle);
    const v692 = p933.radius * Math.sin(p933.angle);
    p933.x += v691 * v690;
    p933.y += v692 * v690;
    mainContext.rotate(p933.angle);
    renderDeadPlayer(p933, mainContext);
    mainContext.restore();
    mainContext.fillStyle = "#91b2db";
    if (v688 >= 3000) {
      p933.active = false;
      p933.startTime = null;
    }
  });
}
function renderPlayers(p934, p935, p936) {
  mainContext.globalAlpha = 1;
  mainContext.fillStyle = "#91b2db";
  for (var v693 = 0; v693 < players.length; ++v693) {
    tmpObj = players[v693];
    if (tmpObj.zIndex == p936) {
      tmpObj.animate(delta);
      if (tmpObj.visible) {
        let vParseInt2 = parseInt(document.getElementById("playerShadowIntensity").value, 10);
        tmpObj.skinRot += delta * 0.002;
        tmpDir = !getEl("showDir").checked && !useWasd && tmpObj == player ? getEl("attackDir").checked ? getVisualDir() : getSafeDir() : tmpObj.dir || 0;
        mainContext.save();
        mainContext.translate(tmpObj.x - p934, tmpObj.y - p935);
        mainContext.shadowColor = "rgba(0, 0, 0, 0.5)";
        mainContext.shadowBlur = vParseInt2;
        mainContext.shadowOffsetX = 0;
        mainContext.shadowOffsetY = 0;
        if (getEl("spinner").checked && tmpObj == player) {
          mainContext.rotate(tmpDir + tmpObj.dt);
        } else {
          mainContext.rotate(tmpDir + tmpObj.dirPlus);
        }
        renderPlayer(tmpObj, mainContext);
        mainContext.shadowColor = "none";
        mainContext.shadowBlur = 0;
        mainContext.restore();
      }
    }
  }
}
function renderDeadPlayer(p937, p938) {
  p938 = p938 || mainContext;
  p938.lineWidth = outlineWidth;
  p938.lineJoin = "miter";
  let v694 = Math.PI / 4 * (items.weapons[p937.weaponIndex].armS || 1);
  let v695 = p937.buildIndex < 0 ? items.weapons[p937.weaponIndex].hndS || 1 : 1;
  let v696 = p937.buildIndex < 0 ? items.weapons[p937.weaponIndex].hndD || 1 : 1;
  renderTail2(13, p938, p937);
  if (p937.buildIndex < 0 && !items.weapons[p937.weaponIndex].aboveHand) {
    renderTool(items.weapons[p937.weaponIndex], config.weaponVariants[p937.weaponVariant || 0].src || "", p937.scale, 0, p938);
    if (items.weapons[p937.weaponIndex].projectile != undefined && !items.weapons[p937.weaponIndex].hideProjectile) {
      renderProjectile(p937.scale, 0, items.projectiles[items.weapons[p937.weaponIndex].projectile], mainContext);
    }
  }
  p938.fillStyle = "#ececec";
  renderCircle(p937.scale * Math.cos(v694), p937.scale * Math.sin(v694), 14);
  renderCircle(p937.scale * v696 * Math.cos(-v694 * v695), p937.scale * v696 * Math.sin(-v694 * v695), 14);
  if (p937.buildIndex < 0 && items.weapons[p937.weaponIndex].aboveHand) {
    renderTool(items.weapons[p937.weaponIndex], config.weaponVariants[p937.weaponVariant || 0].src || "", p937.scale, 0, p938);
    if (items.weapons[p937.weaponIndex].projectile != undefined && !items.weapons[p937.weaponIndex].hideProjectile) {
      renderProjectile(p937.scale, 0, items.projectiles[items.weapons[p937.weaponIndex].projectile], mainContext);
    }
  }
  if (p937.buildIndex >= 0) {
    var vGetItemSprite = getItemSprite(items.list[p937.buildIndex]);
    p938.drawImage(vGetItemSprite, p937.scale - items.list[p937.buildIndex].holdOffset, -vGetItemSprite.width / 2);
  }
  renderCircle(0, 0, p937.scale, p938);
  renderSkin2(48, p938, null, p937);
}
function renderPlayer(p939, p940) {
  p940 = p940 || mainContext;
  p940.lineWidth = outlineWidth;
  p940.lineJoin = "miter";
  let v697 = Math.PI / 4 * (items.weapons[p939.weaponIndex].armS || 1);
  let v698 = p939.buildIndex < 0 ? items.weapons[p939.weaponIndex].hndS || 1 : 1;
  let v699 = p939.buildIndex < 0 ? items.weapons[p939.weaponIndex].hndD || 1 : 1;
  let v700 = p939 == player && p939.weapons[0] == 3 && p939.weapons[1] == 15;
  if (p939.tailIndex > 0) {
    renderTailTextureImage(p939.tailIndex, p940, p939);
  }
  if (p939.buildIndex < 0 && !items.weapons[p939.weaponIndex].aboveHand) {
    renderTool(items.weapons[v700 ? 4 : p939.weaponIndex], config.weaponVariants[p939.weaponVariant].src, p939.scale, 0, p940);
    if (items.weapons[p939.weaponIndex].projectile != undefined && !items.weapons[p939.weaponIndex].hideProjectile) {
      renderProjectile(p939.scale, 0, items.projectiles[items.weapons[p939.weaponIndex].projectile], mainContext);
    }
  }
  p940.fillStyle = config.skinColors[p939.skinColor];
  renderCircle(p939.scale * Math.cos(v697), p939.scale * Math.sin(v697), 14);
  renderCircle(p939.scale * v699 * Math.cos(-v697 * v698), p939.scale * v699 * Math.sin(-v697 * v698), 14);
  if (p939.buildIndex < 0 && items.weapons[p939.weaponIndex].aboveHand) {
    renderTool(items.weapons[p939.weaponIndex], config.weaponVariants[p939.weaponVariant].src, p939.scale, 0, p940);
    if (items.weapons[p939.weaponIndex].projectile != undefined && !items.weapons[p939.weaponIndex].hideProjectile) {
      renderProjectile(p939.scale, 0, items.projectiles[items.weapons[p939.weaponIndex].projectile], mainContext);
    }
  }
  if (p939.buildIndex >= 0) {
    var vGetItemSprite2 = getItemSprite(items.list[p939.buildIndex]);
    p940.drawImage(vGetItemSprite2, p939.scale - items.list[p939.buildIndex].holdOffset, -vGetItemSprite2.width / 2);
  }
  renderCircle(0, 0, p939.scale, p940);
  if (p939.skinIndex > 0) {
    p940.rotate(Math.PI / 2);
    renderTextureSkin(p939.skinIndex, p940, null, p939);
  }
}
var skinSprites2 = {};
var skinPointers2 = {};
function renderSkin2(p941, p942, p943, p944) {
  tmpSkin = skinSprites2[p941];
  if (!tmpSkin) {
    var v701 = new Image();
    v701.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    v701.src = "https://moomoo.io/img/hats/hat_" + p941 + ".png";
    skinSprites2[p941] = v701;
    tmpSkin = v701;
  }
  var v702 = p943 || skinPointers2[p941];
  if (!v702) {
    for (var v703 = 0; v703 < hats.length; ++v703) {
      if (hats[v703].id == p941) {
        v702 = hats[v703];
        break;
      }
    }
    skinPointers2[p941] = v702;
  }
  if (tmpSkin.isLoaded) {
    p942.drawImage(tmpSkin, -v702.scale / 2, -v702.scale / 2, v702.scale, v702.scale);
  }
  if (!p943 && v702.topSprite) {
    p942.save();
    p942.rotate(p944.skinRot);
    renderSkin2(p941 + "_top", p942, v702, p944);
    p942.restore();
  }
}
function renderTextureSkin(p945, p946, p947, p948) {
  if (!(tmpSkin = skinSprites[p945 + (txt ? "lol" : 0)])) {
    var v704 = new Image();
    v704.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    v704.src = setSkinTextureImage(p945, "hat", p945);
    skinSprites[p945 + (txt ? "lol" : 0)] = v704;
    tmpSkin = v704;
  }
  var v705 = p947 || skinPointers[p945];
  if (!v705) {
    for (var v706 = 0; v706 < hats.length; ++v706) {
      if (hats[v706].id == p945) {
        v705 = hats[v706];
        break;
      }
    }
    skinPointers[p945] = v705;
  }
  if (tmpSkin.isLoaded) {
    p946.drawImage(tmpSkin, -v705.scale / 2, -v705.scale / 2, v705.scale, v705.scale);
  }
  if (!p947 && v705.topSprite) {
    p946.save();
    p946.rotate(p948.skinRot);
    renderSkin(p945 + "_top", p946, v705, p948);
    p946.restore();
  }
}
var FlareZHat = {
  6: "https://i.imgur.com/HjWADL7.png",
  7: "http://i.imgur.com/wqG2CBb.png"
};
function setSkinTextureImage(p949, p950, p951) {
  if (true) {
    if (FlareZHat[p949] && p950 == "hat") {
      return FlareZHat[p949];
    } else if (p950 == "acc") {
      return ".././img/accessories/access_" + p949 + ".png";
    } else if (p950 == "hat") {
      return ".././img/hats/hat_" + p949 + ".png";
    } else {
      return ".././img/weapons/" + p949 + ".png";
    }
  } else if (p950 == "acc") {
    return ".././img/accessories/access_" + p949 + ".png";
  } else if (p950 == "hat") {
    return ".././img/hats/hat_" + p949 + ".png";
  } else {
    return ".././img/weapons/" + p949 + ".png";
  }
}
let skinSprites = {};
let skinPointers = {};
let tmpSkin;
function renderSkin(p952, p953, p954, p955) {
  tmpSkin = skinSprites[p952];
  if (!tmpSkin) {
    let v707 = new Image();
    v707.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    v707.src = "https://moomoo.io/img/hats/hat_" + p952 + ".png";
    skinSprites[p952] = v707;
    tmpSkin = v707;
  }
  let v708 = p954 || skinPointers[p952];
  if (!v708) {
    for (let v709 = 0; v709 < hats.length; ++v709) {
      if (hats[v709].id == p952) {
        v708 = hats[v709];
        break;
      }
    }
    skinPointers[p952] = v708;
  }
  if (tmpSkin.isLoaded) {
    p953.drawImage(tmpSkin, -v708.scale / 2, -v708.scale / 2, v708.scale, v708.scale);
  }
  if (!p954 && v708.topSprite) {
    p953.save();
    p953.rotate(p955.skinRot);
    renderSkin(p952 + "_top", p953, v708, p955);
    p953.restore();
  }
}
var FlareZAcc = {};
function setTailTextureImage(p956, p957, p958) {
  if (true) {
    if (FlareZAcc[p956] && p957 == "acc") {
      return FlareZAcc[p956];
    } else if (p957 == "acc") {
      return ".././img/accessories/access_" + p956 + ".png";
    } else if (p957 == "hat") {
      return ".././img/hats/hat_" + p956 + ".png";
    } else {
      return ".././img/weapons/" + p956 + ".png";
    }
  } else if (p957 == "acc") {
    return ".././img/accessories/access_" + p956 + ".png";
  } else if (p957 == "hat") {
    return ".././img/hats/hat_" + p956 + ".png";
  } else {
    return ".././img/weapons/" + p956 + ".png";
  }
}
function renderTailTextureImage(p959, p960, p961) {
  if (!(tmpSkin = accessSprites[p959 + (txt ? "lol" : 0)])) {
    var v710 = new Image();
    v710.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    v710.src = setTailTextureImage(p959, "acc");
    accessSprites[p959 + (txt ? "lol" : 0)] = v710;
    tmpSkin = v710;
  }
  var v711 = accessPointers[p959];
  if (!v711) {
    for (var v712 = 0; v712 < accessories.length; ++v712) {
      if (accessories[v712].id == p959) {
        v711 = accessories[v712];
        break;
      }
    }
    accessPointers[p959] = v711;
  }
  if (tmpSkin.isLoaded) {
    p960.save();
    p960.translate(-20 - (v711.xOff || 0), 0);
    if (v711.spin) {
      p960.rotate(p961.skinRot);
    }
    p960.drawImage(tmpSkin, -(v711.scale / 2), -(v711.scale / 2), v711.scale, v711.scale);
    p960.restore();
  }
}
let accessSprites = {};
let accessPointers = {};
var txt = true;
function renderTail(p962, p963, p964) {
  tmpSkin = accessSprites[p962];
  if (!tmpSkin) {
    let v713 = new Image();
    v713.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    v713.src = "https://moomoo.io/img/accessories/access_" + p962 + ".png";
    accessSprites[p962] = v713;
    tmpSkin = v713;
  }
  let v714 = accessPointers[p962];
  if (!v714) {
    for (let v715 = 0; v715 < accessories.length; ++v715) {
      if (accessories[v715].id == p962) {
        v714 = accessories[v715];
        break;
      }
    }
    accessPointers[p962] = v714;
  }
  if (tmpSkin.isLoaded) {
    p963.save();
    p963.translate(-20 - (v714.xOff || 0), 0);
    if (v714.spin) {
      p963.rotate(p964.skinRot);
    }
    p963.drawImage(tmpSkin, -(v714.scale / 2), -(v714.scale / 2), v714.scale, v714.scale);
    p963.restore();
  }
}
var accessSprites2 = {};
var accessPointers2 = {};
function renderTail2(p965, p966, p967) {
  tmpSkin = accessSprites2[p965];
  if (!tmpSkin) {
    var v716 = new Image();
    v716.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    v716.src = "https://moomoo.io/img/accessories/access_" + p965 + ".png";
    accessSprites2[p965] = v716;
    tmpSkin = v716;
  }
  var v717 = accessPointers2[p965];
  if (!v717) {
    for (var v718 = 0; v718 < accessories.length; ++v718) {
      if (accessories[v718].id == p965) {
        v717 = accessories[v718];
        break;
      }
    }
    accessPointers2[p965] = v717;
  }
  if (tmpSkin.isLoaded) {
    p966.save();
    p966.translate(-20 - (v717.xOff || 0), 0);
    if (v717.spin) {
      p966.rotate(p967.skinRot);
    }
    p966.drawImage(tmpSkin, -(v717.scale / 2), -(v717.scale / 2), v717.scale, v717.scale);
    p966.restore();
  }
}
let toolSprites = {};
function renderTool(p968, p969, p970, p971, p972) {
  let v719 = p968.src + (p969 || "");
  let v720 = toolSprites[v719];
  if (!v720) {
    v720 = new Image();
    v720.onload = function () {
      this.isLoaded = true;
    };
    v720.src = "https://moomoo.io/img/weapons/" + v719 + ".png";
    toolSprites[v719] = v720;
  }
  if (v720.isLoaded) {
    p972.drawImage(v720, p970 + p968.xOff - p968.length / 2, p971 + p968.yOff - p968.width / 2, p968.length, p968.width);
  }
}
function renderProjectiles(p973, p974, p975) {
  for (let v721 = 0; v721 < projectiles.length; v721++) {
    tmpObj = projectiles[v721];
    if (tmpObj.active && tmpObj.layer == p973 && tmpObj.inWindow) {
      tmpObj.update(delta);
      if (tmpObj.active && isOnScreen(tmpObj.x - p974, tmpObj.y - p975, tmpObj.scale)) {
        mainContext.save();
        mainContext.translate(tmpObj.x - p974, tmpObj.y - p975);
        mainContext.rotate(tmpObj.dir);
        renderProjectile(0, 0, tmpObj, mainContext, 1);
        mainContext.restore();
      }
    }
  }
  ;
}
let projectileSprites = {};
function renderProjectile(p976, p977, p978, p979, p980) {
  if (p978.src) {
    let v722 = items.projectiles[p978.indx].src;
    let v723 = projectileSprites[v722];
    if (!v723) {
      v723 = new Image();
      v723.onload = function () {
        this.isLoaded = true;
      };
      v723.src = "https://moomoo.io/img/weapons/" + v722 + ".png";
      projectileSprites[v722] = v723;
    }
    if (v723.isLoaded) {
      p979.drawImage(v723, p976 - p978.scale / 2, p977 - p978.scale / 2, p978.scale, p978.scale);
    }
  } else if (p978.indx == 1) {
    p979.fillStyle = "#939393";
    renderCircle(p976, p977, p978.scale, p979);
  }
}
let aiSprites = {};
function renderAI(p981, p982) {
  let v724 = p981.index;
  let v725 = aiSprites[v724];
  if (!v725) {
    let v726 = new Image();
    v726.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    v726.src = "https://moomoo.io/img/animals/" + p981.src + ".png";
    v725 = v726;
    aiSprites[v724] = v725;
  }
  if (v725.isLoaded) {
    let v727 = p981.scale * 1.2 * (p981.spriteMlt || 1);
    p982.drawImage(v725, -v727, -v727, v727 * 2, v727 * 2);
  }
}
function renderWaterBodies(p983, p984, p985, p986) {
  let v728 = config.riverWidth + p986;
  let v729 = config.mapScale / 2 - p984 - v728 / 2;
  if (v729 < maxScreenHeight && v729 + v728 > 0) {
    p985.fillRect(0, v729, maxScreenWidth, v728);
  }
}
let gameObjectSprites = {};
function getResSprite(p987) {
  let v730 = p987.y >= config.mapScale - config.snowBiomeTop ? 2 : p987.y <= config.snowBiomeTop ? 1 : 0;
  let v731 = p987.type + "_" + p987.scale + "_" + v730;
  let v732 = gameObjectSprites[v731];
  if (!v732) {
    let v733 = 6;
    let v734 = document.createElement("canvas");
    v734.width = v734.height = p987.scale * 2.1 + outlineWidth;
    let v735 = v734.getContext("2d");
    v735.translate(v734.width / 2, v734.height / 2);
    v735.rotate(UTILS.randFloat(0, Math.PI));
    v735.strokeStyle = outlineColor;
    v735.lineWidth = outlineWidth;
    if (p987.type == 0) {
      let v736;
      let v737 = 8;
      v735.globalAlpha = cdf(p987, player) <= 250 ? 0.5 : 0.5;
      for (let v738 = 0; v738 < 2; ++v738) {
        v736 = tmpObj.scale * (!v738 ? 1 : 0.5);
        renderBlob(v735, v737, v736, v736 * 0.7);
        v735.fillStyle = !v730 ? !v738 ? "#9ebf57" : "#b4db62" : !v738 ? "#e3f1f4" : "#fff";
        v735.fill();
        if (!v738) {
          v735.stroke();
          v735.globalAlpha = 1;
        }
        if (!v738) {} else {}
      }
    } else if (p987.type == 1) {
      if (v730 == 2) {
        v735.fillStyle = "#606060";
        renderStar(v735, 6, p987.scale * 0.3, p987.scale * 0.71);
        v735.fill();
        v735.stroke();
        v735.fillStyle = "#89a54c";
        renderCircle(0, 0, p987.scale * 0.55, v735);
        v735.fillStyle = "#a5c65b";
        renderCircle(0, 0, p987.scale * 0.3, v735, true);
      } else {
        renderBlob(v735, 6, tmpObj.scale, tmpObj.scale * 0.7);
        v735.fillStyle = v730 ? "#e3f1f4" : "#89a54c";
        v735.fill();
        v735.stroke();
        v735.fillStyle = v730 ? "#6a64af" : "#c15555";
        let v739;
        let v740 = 4;
        let v741 = Math.PI * 2 / v740;
        for (let v742 = 0; v742 < v740; ++v742) {
          v739 = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
          renderCircle(v739 * Math.cos(v741 * v742), v739 * Math.sin(v741 * v742), UTILS.randInt(10, 12), v735);
        }
      }
    } else if (p987.type == 2 || p987.type == 3) {
      v735.fillStyle = p987.type == 2 ? v730 == 2 ? "#938d77" : "#939393" : "#e0c655";
      renderStar(v735, 3, p987.scale, p987.scale);
      v735.fill();
      v735.stroke();
      v735.fillStyle = p987.type == 2 ? v730 == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3";
      renderStar(v735, 3, p987.scale * 0.55, p987.scale * 0.65);
      v735.fill();
    }
    v732 = v734;
    gameObjectSprites[v731] = v732;
  }
  return v732;
}
let itemSprites = [];
function getItemSprite(p988, p989) {
  let v743 = itemSprites[p988.id];
  if (!v743 || p989) {
    let v744 = !p989 ? 20 : 5;
    let v745 = document.createElement("canvas");
    let v746 = !p989 && p988.name == "windmill" ? items.list[4].scale : p988.scale;
    v745.width = v745.height = v746 * 2.5 + outlineWidth + (items.list[p988.id].spritePadding || 0) + v744;
    let v747 = v745.getContext("2d");
    v747.translate(v745.width / 2, v745.height / 2);
    v747.rotate(p989 ? 0 : Math.PI / 2);
    v747.strokeStyle = outlineColor;
    v747.lineWidth = outlineWidth * (p989 ? v745.width / 81 : 1);
    if (!p989) {}
    if (p988.name == "apple") {
      v747.fillStyle = "#c15555";
      renderCircle(0, 0, p988.scale, v747);
      v747.fillStyle = "#89a54c";
      let v748 = -(Math.PI / 2);
      renderLeaf(p988.scale * Math.cos(v748), p988.scale * Math.sin(v748), 25, v748 + Math.PI / 2, v747);
    } else if (p988.name == "cookie") {
      v747.fillStyle = "#cca861";
      renderCircle(0, 0, p988.scale, v747);
      v747.fillStyle = "#937c4b";
      let v749 = 4;
      let v750 = Math.PI * 2 / v749;
      let v751;
      for (let v752 = 0; v752 < v749; ++v752) {
        v751 = UTILS.randInt(p988.scale / 2.5, p988.scale / 1.7);
        renderCircle(v751 * Math.cos(v750 * v752), v751 * Math.sin(v750 * v752), UTILS.randInt(4, 5), v747, true);
      }
    } else if (p988.name == "cheese") {
      v747.fillStyle = "#f4f3ac";
      renderCircle(0, 0, p988.scale, v747);
      v747.fillStyle = "#c3c28b";
      let v753 = 4;
      let v754 = Math.PI * 2 / v753;
      let v755;
      for (let v756 = 0; v756 < v753; ++v756) {
        v755 = UTILS.randInt(p988.scale / 2.5, p988.scale / 1.7);
        renderCircle(v755 * Math.cos(v754 * v756), v755 * Math.sin(v754 * v756), UTILS.randInt(4, 5), v747, true);
      }
    } else if (p988.name == "wood wall" || p988.name == "stone wall" || p988.name == "castle wall") {
      v747.fillStyle = p988.name == "castle wall" ? "#83898e" : p988.name == "wood wall" ? "#a5974c" : "#939393";
      let v757 = p988.name == "castle wall" ? 4 : 3;
      renderStar(v747, v757, p988.scale * 1.1, p988.scale * 1.1);
      v747.fill();
      v747.stroke();
      v747.fillStyle = p988.name == "castle wall" ? "#9da4aa" : p988.name == "wood wall" ? "#c9b758" : "#bcbcbc";
      renderStar(v747, v757, p988.scale * 0.65, p988.scale * 0.65);
      v747.fill();
    } else if (p988.name == "spikes" || p988.name == "greater spikes" || p988.name == "poison spikes" || p988.name == "spinning spikes") {
      v747.fillStyle = p988.name == "poison spikes" ? "#7b935d" : "#939393";
      let v758 = p988.scale * 0.6;
      renderStar(v747, p988.name == "spikes" ? 5 : 6, p988.scale, v758);
      v747.fill();
      v747.stroke();
      v747.fillStyle = "#a5974c";
      renderCircle(0, 0, v758, v747);
      v747.fillStyle = "#c9b758";
      renderCircle(0, 0, v758 / 2, v747, true);
    } else if (p988.name == "windmill" || p988.name == "faster windmill" || p988.name == "power mill") {
      v747.fillStyle = "#a5974c";
      renderCircle(0, 0, v746, v747);
      v747.fillStyle = "#c9b758";
      renderRectCircle(0, 0, v746 * 1.5, 29, 4, v747);
      v747.fillStyle = "#a5974c";
      renderCircle(0, 0, v746 * 0.5, v747);
    } else if (p988.name == "mine") {
      v747.fillStyle = "#939393";
      renderStar(v747, 3, p988.scale, p988.scale);
      v747.fill();
      v747.stroke();
      v747.fillStyle = "#bcbcbc";
      renderStar(v747, 3, p988.scale * 0.55, p988.scale * 0.65);
      v747.fill();
    } else if (p988.name == "sapling") {
      for (let v759 = 0; v759 < 2; ++v759) {
        let v760 = p988.scale * (!v759 ? 1 : 0.5);
        renderStar(v747, 7, v760, v760 * 0.7);
        v747.fillStyle = !v759 ? "#9ebf57" : "#b4db62";
        v747.fill();
        if (!v759) {
          v747.stroke();
        }
      }
    } else if (p988.name == "pit trap") {
      v747.fillStyle = "#a5974c";
      renderStar(v747, 3, p988.scale * 1.1, p988.scale * 1.1);
      v747.fill();
      v747.stroke();
      v747.fillStyle = outlineColor;
      renderStar(v747, 3, p988.scale * 0.65, p988.scale * 0.65);
      v747.fill();
    } else if (p988.name == "boost pad") {
      v747.fillStyle = "#7e7f82";
      renderRect(0, 0, p988.scale * 2, p988.scale * 2, v747);
      v747.fill();
      v747.stroke();
      v747.fillStyle = "#dbd97d";
      renderTriangle(p988.scale * 1, v747);
    } else if (p988.name == "turret") {
      v747.fillStyle = "#a5974c";
      renderCircle(0, 0, p988.scale, v747);
      v747.fill();
      v747.stroke();
      v747.fillStyle = "#939393";
      let v761 = 50;
      renderRect(0, -v761 / 2, p988.scale * 0.9, v761, v747);
      renderCircle(0, 0, p988.scale * 0.6, v747);
      v747.fill();
      v747.stroke();
    } else if (p988.name == "platform") {
      v747.fillStyle = "#cebd5f";
      let v762 = 4;
      let v763 = p988.scale * 2;
      let v764 = v763 / v762;
      let v765 = -(p988.scale / 2);
      for (let v766 = 0; v766 < v762; ++v766) {
        renderRect(v765 - v764 / 2, 0, v764, p988.scale * 2, v747);
        v747.fill();
        v747.stroke();
        v765 += v763 / v762;
      }
    } else if (p988.name == "healing pad") {
      v747.fillStyle = "#7e7f82";
      renderRect(0, 0, p988.scale * 2, p988.scale * 2, v747);
      v747.fill();
      v747.stroke();
      v747.fillStyle = "#db6e6e";
      renderRectCircle(0, 0, p988.scale * 0.65, 20, 4, v747, true);
    } else if (p988.name == "spawn pad") {
      v747.fillStyle = "#7e7f82";
      renderRect(0, 0, p988.scale * 2, p988.scale * 2, v747);
      v747.fill();
      v747.stroke();
      v747.fillStyle = "#71aad6";
      renderCircle(0, 0, p988.scale * 0.6, v747);
    } else if (p988.name == "blocker") {
      v747.fillStyle = "#7e7f82";
      renderCircle(0, 0, p988.scale, v747);
      v747.fill();
      v747.stroke();
      v747.rotate(Math.PI / 4);
      v747.fillStyle = "#db6e6e";
      renderRectCircle(0, 0, p988.scale * 0.65, 20, 4, v747, true);
    } else if (p988.name == "teleporter") {
      v747.fillStyle = "#7e7f82";
      renderCircle(0, 0, p988.scale, v747);
      v747.fill();
      v747.stroke();
      v747.rotate(Math.PI / 4);
      v747.fillStyle = "#d76edb";
      renderCircle(0, 0, p988.scale * 0.5, v747, true);
    }
    v743 = v745;
    if (!p989) {
      itemSprites[p988.id] = v743;
    }
  }
  return v743;
}
function getItemSprite2(p990, p991, p992) {
  let vMainContext = mainContext;
  let v767 = p990.name == "windmill" ? items.list[4].scale : p990.scale;
  vMainContext.save();
  vMainContext.translate(p991, p992);
  vMainContext.rotate(p990.dir);
  vMainContext.strokeStyle = outlineColor;
  vMainContext.lineWidth = outlineWidth;
  if (p990.name == "apple") {
    vMainContext.fillStyle = "#c15555";
    renderCircle(0, 0, p990.scale, vMainContext);
    vMainContext.fillStyle = "#89a54c";
    let v768 = -(Math.PI / 2);
    renderLeaf(p990.scale * Math.cos(v768), p990.scale * Math.sin(v768), 25, v768 + Math.PI / 2, vMainContext);
  } else if (p990.name == "cookie") {
    vMainContext.fillStyle = "#cca861";
    renderCircle(0, 0, p990.scale, vMainContext);
    vMainContext.fillStyle = "#937c4b";
    let v769 = 4;
    let v770 = Math.PI * 2 / v769;
    let v771;
    for (let v772 = 0; v772 < v769; ++v772) {
      v771 = UTILS.randInt(p990.scale / 2.5, p990.scale / 1.7);
      renderCircle(v771 * Math.cos(v770 * v772), v771 * Math.sin(v770 * v772), UTILS.randInt(4, 5), vMainContext, true);
    }
  } else if (p990.name == "cheese") {
    vMainContext.fillStyle = "#f4f3ac";
    renderCircle(0, 0, p990.scale, vMainContext);
    vMainContext.fillStyle = "#c3c28b";
    let v773 = 4;
    let v774 = Math.PI * 2 / v773;
    let v775;
    for (let v776 = 0; v776 < v773; ++v776) {
      v775 = UTILS.randInt(p990.scale / 2.5, p990.scale / 1.7);
      renderCircle(v775 * Math.cos(v774 * v776), v775 * Math.sin(v774 * v776), UTILS.randInt(4, 5), vMainContext, true);
    }
  } else if (p990.name == "wood wall" || p990.name == "stone wall" || p990.name == "castle wall") {
    vMainContext.fillStyle = p990.name == "castle wall" ? "#83898e" : p990.name == "wood wall" ? "#a5974c" : "#939393";
    let v777 = p990.name == "castle wall" ? 4 : 3;
    renderStar(vMainContext, v777, p990.scale * 1.1, p990.scale * 1.1);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.fillStyle = p990.name == "castle wall" ? "#9da4aa" : p990.name == "wood wall" ? "#c9b758" : "#bcbcbc";
    renderStar(vMainContext, v777, p990.scale * 0.65, p990.scale * 0.65);
    vMainContext.fill();
  } else if (p990.name == "spikes" || p990.name == "greater spikes" || p990.name == "poison spikes" || p990.name == "spinning spikes") {
    vMainContext.fillStyle = p990.name == "poison spikes" ? "#7b935d" : "#939393";
    let v778 = p990.scale * 0.6;
    renderStar(vMainContext, p990.name == "spikes" ? 5 : 6, p990.scale, v778);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.fillStyle = "#a5974c";
    renderCircle(0, 0, v778, vMainContext);
    vMainContext.fillStyle = "#c9b758";
    renderCircle(0, 0, v778 / 2, vMainContext, true);
  } else if (p990.name == "windmill" || p990.name == "faster windmill" || p990.name == "power mill") {
    vMainContext.fillStyle = "#a5974c";
    renderCircle(0, 0, v767, vMainContext);
    vMainContext.fillStyle = "#c9b758";
    renderRectCircle(0, 0, v767 * 1.5, 29, 4, vMainContext);
    vMainContext.fillStyle = "#a5974c";
    renderCircle(0, 0, v767 * 0.5, vMainContext);
  } else if (p990.name == "mine") {
    vMainContext.fillStyle = "#939393";
    renderStar(vMainContext, 3, p990.scale, p990.scale);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.fillStyle = "#bcbcbc";
    renderStar(vMainContext, 3, p990.scale * 0.55, p990.scale * 0.65);
    vMainContext.fill();
  } else if (p990.name == "sapling") {
    for (let v779 = 0; v779 < 2; ++v779) {
      let v780 = p990.scale * (!v779 ? 1 : 0.5);
      renderStar(vMainContext, 7, v780, v780 * 0.7);
      vMainContext.fillStyle = !v779 ? "#9ebf57" : "#b4db62";
      vMainContext.fill();
      if (!v779) {
        vMainContext.stroke();
      }
    }
  } else if (p990.name == "pit trap") {
    vMainContext.fillStyle = "#a5974c";
    renderStar(vMainContext, 3, p990.scale * 1.1, p990.scale * 1.1);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.fillStyle = outlineColor;
    renderStar(vMainContext, 3, p990.scale * 0.65, p990.scale * 0.65);
    vMainContext.fill();
  } else if (p990.name == "boost pad") {
    vMainContext.fillStyle = "#7e7f82";
    renderRect(0, 0, p990.scale * 2, p990.scale * 2, vMainContext);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.fillStyle = "#dbd97d";
    renderTriangle(p990.scale * 1, vMainContext);
  } else if (p990.name == "turret") {
    vMainContext.fillStyle = "#a5974c";
    renderCircle(0, 0, p990.scale, vMainContext);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.fillStyle = "#939393";
    let v781 = 50;
    renderRect(0, -v781 / 2, p990.scale * 0.9, v781, vMainContext);
    renderCircle(0, 0, p990.scale * 0.6, vMainContext);
    vMainContext.fill();
    vMainContext.stroke();
  } else if (p990.name == "platform") {
    vMainContext.fillStyle = "#cebd5f";
    let v782 = 4;
    let v783 = p990.scale * 2;
    let v784 = v783 / v782;
    let v785 = -(p990.scale / 2);
    for (let v786 = 0; v786 < v782; ++v786) {
      renderRect(v785 - v784 / 2, 0, v784, p990.scale * 2, vMainContext);
      vMainContext.fill();
      vMainContext.stroke();
      v785 += v783 / v782;
    }
  } else if (p990.name == "healing pad") {
    vMainContext.fillStyle = "#7e7f82";
    renderRect(0, 0, p990.scale * 2, p990.scale * 2, vMainContext);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.fillStyle = "#db6e6e";
    renderRectCircle(0, 0, p990.scale * 0.65, 20, 4, vMainContext, true);
  } else if (p990.name == "spawn pad") {
    vMainContext.fillStyle = "#7e7f82";
    renderRect(0, 0, p990.scale * 2, p990.scale * 2, vMainContext);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.fillStyle = "#71aad6";
    renderCircle(0, 0, p990.scale * 0.6, vMainContext);
  } else if (p990.name == "blocker") {
    vMainContext.fillStyle = "#7e7f82";
    renderCircle(0, 0, p990.scale, vMainContext);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.rotate(Math.PI / 4);
    vMainContext.fillStyle = "#db6e6e";
    renderRectCircle(0, 0, p990.scale * 0.65, 20, 4, vMainContext, true);
  } else if (p990.name == "teleporter") {
    vMainContext.fillStyle = "#7e7f82";
    renderCircle(0, 0, p990.scale, vMainContext);
    vMainContext.fill();
    vMainContext.stroke();
    vMainContext.rotate(Math.PI / 4);
    vMainContext.fillStyle = "#d76edb";
    renderCircle(0, 0, p990.scale * 0.5, vMainContext, true);
  }
  vMainContext.restore();
}
let objSprites = [];
function getObjSprite(p993) {
  let v787 = objSprites[p993.id];
  if (!v787) {
    let v788 = 0;
    let v789 = document.createElement("canvas");
    v789.width = v789.height = p993.scale * 2.5 + outlineWidth + (items.list[p993.id].spritePadding || 0) + v788;
    let v790 = v789.getContext("2d");
    v790.translate(v789.width / 2, v789.height / 2);
    v790.rotate(Math.PI / 2);
    v790.strokeStyle = outlineColor;
    v790.lineWidth = outlineWidth;
    if (p993.name == "spikes" || p993.name == "greater spikes" || p993.name == "poison spikes" || p993.name == "spinning spikes") {
      v790.fillStyle = p993.name == "poison spikes" ? "#7b935d" : "#939393";
      let v791 = p993.scale * 0.6;
      renderStar(v790, p993.name == "spikes" ? 5 : 6, p993.scale, v791);
      v790.fill();
      v790.stroke();
      v790.shadowColor = "rgba(255, 0, 0, 0.8)";
      v790.shadowBlur = 20;
      v790.shadowOffsetX = 0;
      v790.shadowOffsetY = 0;
      v790.fillStyle = "#a5974c";
      renderCircle(0, 0, v791, v790);
      v790.shadowColor = "transparent";
      v790.shadowBlur = 0;
      v790.shadowOffsetX = 0;
      v790.shadowOffsetY = 0;
    } else if (p993.name == "pit trap") {
      v790.fillStyle = "#a5974c";
      renderStar(v790, 3, p993.scale * 1.1, p993.scale * 1.1);
      v790.fill();
      v790.stroke();
      v790.fillStyle = "#cc5151";
      renderStar(v790, 3, p993.scale * 0.65, p993.scale * 0.65);
      v790.fill();
    }
    v787 = v789;
    objSprites[p993.id] = v787;
  }
  return v787;
}
function getMarkSprite(p994, p995, p996, p997) {
  let v792 = {
    x: screenWidth / 2,
    y: screenHeight / 2
  };
  p995.lineWidth = outlineWidth;
  mainContext.globalAlpha = 0.2;
  p995.strokeStyle = outlineColor;
  p995.save();
  p995.translate(p996, p997);
  p995.rotate(34867844010000000000);
  if (p994.name == "spikes" || p994.name == "greater spikes" || p994.name == "poison spikes" || p994.name == "spinning spikes") {
    p995.fillStyle = p994.name == "poison spikes" ? "#7b935d" : "#939393";
    var v793 = p994.scale;
    renderStar(p995, p994.name == "spikes" ? 5 : 6, p994.scale, v793);
    p995.fill();
    p995.stroke();
    p995.fillStyle = "#a5974c";
    renderCircle(0, 0, v793, p995);
    if (player && p994.owner && player.sid != p994.owner.sid && !tmpObj.findAllianceBySid(p994.owner.sid)) {
      p995.fillStyle = "#a34040";
    } else {
      p995.fillStyle = "#c9b758";
    }
    renderCircle(0, 0, v793 / 2, p995, true);
  } else if (p994.name == "turret") {
    renderCircle(0, 0, p994.scale, p995);
    p995.fill();
    p995.stroke();
    p995.fillStyle = "#939393";
    let v794 = 50;
    renderRect(0, -v794 / 2, p994.scale * 0.9, v794, p995);
    renderCircle(0, 0, p994.scale * 0.6, p995);
    p995.fill();
    p995.stroke();
  } else if (p994.name == "teleporter") {
    p995.fillStyle = "#7e7f82";
    renderCircle(0, 0, p994.scale, p995);
    p995.fill();
    p995.stroke();
    p995.rotate(Math.PI / 4);
    p995.fillStyle = "#d76edb";
    renderCircle(0, 0, p994.scale * 0.5, p995, true);
  } else if (p994.name == "platform") {
    p995.fillStyle = "#cebd5f";
    let v795 = 4;
    let v796 = p994.scale * 2;
    let v797 = v796 / v795;
    let v798 = -(p994.scale / 2);
    for (let v799 = 0; v799 < v795; ++v799) {
      renderRect(v798 - v797 / 2, 0, v797, p994.scale * 2, p995);
      p995.fill();
      p995.stroke();
      v798 += v796 / v795;
    }
  } else if (p994.name == "healing pad") {
    p995.fillStyle = "#7e7f82";
    renderRect(0, 0, p994.scale * 2, p994.scale * 2, p995);
    p995.fill();
    p995.stroke();
    p995.fillStyle = "#db6e6e";
    renderRectCircle(0, 0, p994.scale * 0.65, 20, 4, p995, true);
  } else if (p994.name == "spawn pad") {
    p995.fillStyle = "#7e7f82";
    renderRect(0, 0, p994.scale * 2, p994.scale * 2, p995);
    p995.fill();
    p995.stroke();
    p995.fillStyle = "#71aad6";
    renderCircle(0, 0, p994.scale * 0.6, p995);
  } else if (p994.name == "blocker") {
    p995.fillStyle = "#7e7f82";
    renderCircle(0, 0, p994.scale, p995);
    p995.fill();
    p995.stroke();
    p995.rotate(Math.PI / 4);
    p995.fillStyle = "#db6e6e";
    renderRectCircle(0, 0, p994.scale * 0.65, 20, 4, p995, true);
  } else if (p994.name == "windmill" || p994.name == "faster windmill" || p994.name == "power mill") {
    p995.fillStyle = "#a5974c";
    renderCircle(0, 0, p994.scale, p995);
    p995.fillStyle = "#c9b758";
    renderRectCircle(0, 0, p994.scale * 1.5, 29, 4, p995);
    p995.fillStyle = "#a5974c";
    renderCircle(0, 0, p994.scale * 0.5, p995);
  } else if (p994.name == "pit trap") {
    p995.fillStyle = "#a5974c";
    renderStar(p995, 3, p994.scale * 1.1, p994.scale * 1.1);
    p995.fill();
    p995.stroke();
    if (player && p994.owner && player.sid != p994.owner.sid && !tmpObj.findAllianceBySid(p994.owner.sid)) {
      p995.fillStyle = "#a34040";
    } else {
      p995.fillStyle = outlineColor;
    }
    renderStar(p995, 3, p994.scale * 0.65, p994.scale * 0.65);
    p995.fill();
  }
  p995.restore();
}
function isOnScreen(p998, p999, p1000) {
  return p998 + p1000 >= 0 && p998 - p1000 <= maxScreenWidth && p999 + p1000 >= 0 && (p999, p1000, maxScreenHeight);
}
function renderGameObjects(p1001, p1002, p1003) {
  let v800;
  let v801;
  let v802;
  liztobj.forEach(p1004 => {
    tmpObj = p1004;
    if (tmpObj.active && liztobj.includes(p1004) && tmpObj.render) {
      v801 = tmpObj.x + tmpObj.xWiggle - p1002;
      v802 = tmpObj.y + tmpObj.yWiggle - p1003;
      if (p1001 == 0) {
        tmpObj.update(delta);
      }
      mainContext.globalAlpha = tmpObj.alpha;
      if (tmpObj.layer == p1001 && isOnScreen(v801, v802, tmpObj.scale + (tmpObj.blocker || 0))) {
        if (tmpObj.isItem) {
          if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
            v800 = getObjSprite(tmpObj);
          } else {
            v800 = getItemSprite(tmpObj);
          }
          mainContext.save();
          mainContext.translate(v801, v802);
          mainContext.rotate(tmpObj.dir);
          if (!tmpObj.active) {
            mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
          }
          mainContext.drawImage(v800, -(v800.width / 2), -(v800.height / 2));
          if (tmpObj.blocker) {
            mainContext.strokeStyle = "#db6e6e";
            mainContext.globalAlpha = 0.3;
            mainContext.lineWidth = 6;
            renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
          }
          mainContext.restore();
        } else {
          v800 = getResSprite(tmpObj);
          mainContext.drawImage(v800, v801 - v800.width / 2, v802 - v800.height / 2);
        }
      }
      if (p1001 == 3) {
        if (tmpObj.health < tmpObj.maxHealth && getEl("BuildHealth").value == "bh1") {
          mainContext.fillStyle = darkOutlineColor;
          mainContext.roundRect(v801 - config.healthBarWidth / 2 - config.healthBarPad, v802 - config.healthBarPad, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
          mainContext.fill();
          mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
          mainContext.roundRect(v801 - config.healthBarWidth / 2, v802, config.healthBarWidth * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
          mainContext.fill();
        }
        if (tmpObj.health < tmpObj.maxHealth && getEl("BuildHealth").value == "bh2") {
          mainContext.fillStyle = darkOutlineColor;
          mainContext.beginPath();
          mainContext.arc(v801, v802, config.healthBarWidth / 2 + config.healthBarPad, 0, Math.PI * 2);
          mainContext.fill();
          mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
          mainContext.beginPath();
          const v803 = tmpObj.health / tmpObj.maxHealth;
          mainContext.arc(v801, v802, config.healthBarWidth / 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * v803);
          mainContext.lineTo(v801, v802);
          mainContext.fill();
        }
        if (tmpObj.health < tmpObj.maxHealth && getEl("BuildHealth").value == "bh3") {
          const v804 = tmpObj.health / tmpObj.maxHealth * 360 * (Math.PI / 180);
          const v805 = 14;
          const v806 = 22;
          mainContext.save();
          mainContext.lineWidth = 9;
          mainContext.lineCap = "round";
          mainContext.translate(v801, v802);
          mainContext.beginPath();
          mainContext.arc(0, 0, v806, 0, v804);
          mainContext.stroke();
          mainContext.restore();
          mainContext.save();
          mainContext.strokeStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
          mainContext.lineCap = "round";
          mainContext.translate(v801, v802);
          mainContext.beginPath();
          mainContext.arc(0, 0, v806, 0, v804);
          mainContext.stroke();
          mainContext.restore();
        }
      }
    }
  });
  if (p1001 == 0) {
    if (placeVisible.length) {
      placeVisible.forEach(p1005 => {
        v801 = p1005.x - p1002;
        v802 = p1005.y - p1003;
        markObject(p1005, v801, v802);
      });
    }
  }
}
function markObject(p1006, p1007, p1008) {
  yen(mainContext, p1007, p1008);
}
function yen(p1009, p1010, p1011) {
  p1009.fillStyle = "rgba(0, 255, 255, 0.5)";
  p1009.beginPath();
  p1009.arc(p1010, p1011, 55, 0, Math.PI * 2);
  p1009.fill();
  p1009.closePath();
  p1009.globalAlpha = 1;
}
class MapPing {
  constructor(p1012, p1013) {
    this.init = function (p1014, p1015) {
      this.scale = 0;
      this.x = p1014;
      this.y = p1015;
      this.active = true;
    };
    this.update = function (p1016, p1017) {
      if (this.active) {
        this.scale += p1017 * 0.05;
        if (this.scale >= p1013) {
          this.active = false;
        } else {
          p1016.globalAlpha = 1 - Math.max(0, this.scale / p1013);
          p1016.beginPath();
          p1016.arc(this.x / config.mapScale * mapDisplay.width, this.y / config.mapScale * mapDisplay.width, this.scale, 0, Math.PI * 2);
          p1016.stroke();
        }
      }
    };
    this.color = p1012;
  }
}
let relMin = 55;
let relMax = 385;
function getBarColor(p1018, p1019) {
  let vTmpObj = tmpObj;
  if (p1019) {
    if (p1018 <= 0.3703703703703704) {
      return "#8ecc51";
    } else if (p1018 <= 0.7407407407407408) {
      return "hsl(" + relMin + ", 50%, 60%)";
    } else {
      return "#f9f64f";
    }
  } else {
    let v807 = 1 - p1018;
    if (vTmpObj.secondary != 10) {
      let v808 = "hsl(" + Math.round(relMax + v807 * (relMin - relMax)) % 360 + ", 50%, 60%)";
      if (p1018 == 1) {
        return "#f4f259";
      } else {
        return v808;
      }
    } else if (vTmpObj.secondary == 10) {
      let v809 = "hsl(" + Math.round(relMax + v807 * (relMin - relMax)) % 360 + ", 50%, 60%)";
      if (p1018 <= 0.3703703703703704) {
        return "#73bfa2";
      } else if (p1018 <= 0.7407407407407408) {
        return "#8ecc51";
      } else {
        return "#f9f64f";
      }
    }
  }
}
function pingMap(p1020, p1021) {
  tmpPing = mapPings.find(p1022 => !p1022.active);
  if (!tmpPing) {
    tmpPing = new MapPing("#fff", config.mapPingScale);
    mapPings.push(tmpPing);
  }
  tmpPing.init(p1020, p1021);
}
function updateMapMarker() {
  mapMarker.x = player.x;
  mapMarker.y = player.y;
}
function renderMinimap(p1023) {
  if (player && player.alive) {
    mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
    mapContext.lineWidth = 4;
    for (let v810 = 0; v810 < mapPings.length; ++v810) {
      tmpPing = mapPings[v810];
      mapContext.strokeStyle = tmpPing.color;
      tmpPing.update(mapContext, p1023);
    }
    mapContext.globalAlpha = 1;
    mapContext.fillStyle = "#ff0000";
    if (breakTrackers.length) {
      mapContext.fillStyle = "#abcdef";
      mapContext.font = "34px Hammersmith One";
      mapContext.textBaseline = "middle";
      mapContext.textAlign = "center";
      for (let v811 = 0; v811 < breakTrackers.length;) {
        mapContext.fillText("!", breakTrackers[v811].x / config.mapScale * mapDisplay.width, breakTrackers[v811].y / config.mapScale * mapDisplay.height);
        v811 += 2;
      }
    }
    mapContext.globalAlpha = 1;
    mapContext.fillStyle = "#fff";
    renderCircle(player.x / config.mapScale * mapDisplay.width, player.y / config.mapScale * mapDisplay.height, 7, mapContext, true);
    mapContext.fillStyle = "rgba(255,255,255,0.35)";
    if (player.team && minimapData) {
      for (let v812 = 0; v812 < minimapData.length;) {
        renderCircle(minimapData[v812] / config.mapScale * mapDisplay.width, minimapData[v812 + 1] / config.mapScale * mapDisplay.height, 7, mapContext, true);
        v812 += 2;
      }
    }
    if (bots.length) {
      bots.forEach(p1024 => {
        if (p1024.inGame) {
          mapContext.globalAlpha = 1;
          mapContext.strokeStyle = "#cc5151";
          renderCircle(p1024.x2 / config.mapScale * mapDisplay.width, p1024.y2 / config.mapScale * mapDisplay.height, 7, mapContext, false, true);
        }
      });
    }
    if (lastDeath) {
      mapContext.fillStyle = "#fc5553";
      mapContext.font = "34px Hammersmith One";
      mapContext.textBaseline = "middle";
      mapContext.textAlign = "center";
      mapContext.fillText("x", lastDeath.x / config.mapScale * mapDisplay.width, lastDeath.y / config.mapScale * mapDisplay.height);
    }
    if (mapMarker) {
      mapContext.fillStyle = "#fff";
      mapContext.font = "34px Hammersmith One";
      mapContext.textBaseline = "middle";
      mapContext.textAlign = "center";
      mapContext.fillText("x", mapMarker.x / config.mapScale * mapDisplay.width, mapMarker.y / config.mapScale * mapDisplay.height);
    }
  }
}
let crossHairs = ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1200px-Crosshairs_Red.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1200px-Crosshairs_Red.svg.png"];
let crossHairSprites = {};
let iconSprites = {};
let icons = ["crown", "skull"];
function loadIcons() {
  for (let v813 = 0; v813 < icons.length; ++v813) {
    let v814 = new Image();
    v814.onload = function () {
      this.isLoaded = true;
    };
    v814.src = "./../img/icons/" + icons[v813] + ".png";
    iconSprites[icons[v813]] = v814;
  }
  for (let v815 = 0; v815 < crossHairs.length; ++v815) {
    let v816 = new Image();
    v816.onload = function () {
      this.isLoaded = true;
    };
    v816.src = crossHairs[v815];
    crossHairSprites[v815] = v816;
  }
}
loadIcons();
function cdf(p1025, p1026) {
  try {
    return Math.hypot((p1026.y2 || p1026.y) - (p1025.y2 || p1025.y), (p1026.x2 || p1026.x) - (p1025.x2 || p1025.x));
  } catch (_0x216fef) {
    return Infinity;
  }
}
function updateGame() {
  if (gameObjects.length && inGame) {
    gameObjects.forEach(p1027 => {
      if (UTILS.getDistance(p1027.x, p1027.y, player.x, player.y) <= 1200) {
        if (!liztobj.includes(p1027)) {
          liztobj.push(p1027);
          p1027.render = true;
        }
      } else if (liztobj.includes(p1027)) {
        if (UTILS.getDistance(p1027.x, p1027.y, player.x, player.y) >= 1200) {
          p1027.render = false;
          const v817 = liztobj.indexOf(p1027);
          if (v817 > -1) {
            liztobj.splice(v817, 1);
          }
        }
      } else if (UTILS.getDistance(p1027.x, p1027.y, player.x, player.y) >= 1200) {
        p1027.render = false;
        const v818 = liztobj.indexOf(p1027);
        if (v818 > -1) {
          liztobj.splice(v818, 1);
        }
      } else {
        p1027.render = false;
        const v819 = liztobj.indexOf(p1027);
        if (v819 > -1) {
          liztobj.splice(v819, 1);
        }
      }
    });
  }
  mainContext.beginPath();
  mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  mainContext.globalAlpha = 1;
  function f49(p1028, p1029, p1030 = 25) {
    camX = (camX * (p1030 - 1) + p1028) / p1030;
    camY = (camY * (p1030 - 1) + p1029) / p1030;
  }
  if (player) {
    let v820 = player.x;
    let v821 = player.y;
    if (near.dist2 <= 1000 && inGame || !getEl("combatZoom").checked) {
      maxScreenWidth = config.maxScreenWidth * 1;
      maxScreenHeight = config.maxScreenHeight * 1;
    } else {
      maxScreenWidth = config.maxScreenWidth * 1.4;
      maxScreenHeight = config.maxScreenHeight * 1.4;
    }
    let v822 = getEl("cameramodes").value;
    if (v822 === "camera3") {
      f49(v820, v821);
      let v823 = (mouseX - window.innerWidth / 2) / 175;
      let v824 = (mouseY - window.innerHeight / 2) / 175;
      camX += v823;
      camY += v824;
      resize();
      let v825 = UTILS.getDistance(camX, camY, v820, v821);
      let v826 = UTILS.getDirection(v820, v821, camX, camY);
      let v827 = 0.0001;
      let v828 = v825 * v827;
      if (v825 > 1e-19) {
        camX += (v828 * Math.cos(v826) - camX) * v827;
        camY += (v828 * Math.sin(v826) - camY) * v827;
      } else {
        camX = v820;
        camY = v821;
      }
    } else if (v822 === "camera2") {
      f49(v820, v821);
      let v829 = UTILS.getDistance(camX, camY, v820, v821);
      let v830 = UTILS.getDirection(v820, v821, camX, camY);
      let v831 = 0.0001;
      let v832 = v829 * v831;
      if (v829 > 1e-19) {
        camX += (v832 * Math.cos(v830) - camX) * v831;
        camY += (v832 * Math.sin(v830) - camY) * v831;
      } else {
        camX = v820;
        camY = v821;
      }
    } else if (v822 === "camera1") {
      camX = v820;
      camY = v821;
      let v833 = UTILS.getDistance(camX, camY, v820, v821);
      let v834 = UTILS.getDirection(v820, v821, camX, camY);
      let v835 = Math.min(v833 * 0.005 * delta, v833);
      if (v833 > 0.05) {
        camX += v835 * Math.cos(v834);
        camY += v835 * Math.sin(v834);
      } else {
        camX = v820;
        camY = v821;
      }
    } else {
      camX = config.mapScale / 2;
      camY = config.mapScale / 2;
    }
  } else {
    camX = config.mapScale / 2;
    camY = config.mapScale / 2;
  }
  let v836 = now - 1000 / config.serverUpdateRate;
  let v837;
  for (let v838 = 0; v838 < players.length + ais.length; ++v838) {
    tmpObj = players[v838] || ais[v838 - players.length];
    if (tmpObj && tmpObj.visible) {
      if (tmpObj.forcePos) {
        tmpObj.x = tmpObj.x2;
        tmpObj.y = tmpObj.y2;
        tmpObj.dir = tmpObj.d2;
      } else {
        let v839 = tmpObj.t2 - tmpObj.t1;
        let v840 = v836 - tmpObj.t1;
        let v841 = v840 / v839;
        let v842 = 170;
        tmpObj.dt += delta;
        let v843 = Math.min(1.7, tmpObj.dt / v842);
        v837 = tmpObj.x2 - tmpObj.x1;
        tmpObj.x = tmpObj.x1 + v837 * v843;
        v837 = tmpObj.y2 - tmpObj.y1;
        tmpObj.y = tmpObj.y1 + v837 * v843;
        if (config.anotherVisual) {
          tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, v841));
        } else {
          tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, v841));
        }
      }
    }
  }
  let v844 = camX - maxScreenWidth / 2;
  let v845 = camY - maxScreenHeight / 2;
  if (config.snowBiomeTop - v845 <= 0 && config.mapScale - config.snowBiomeTop - v845 >= maxScreenHeight) {
    mainContext.fillStyle = "#b6db66";
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
  } else if (config.mapScale - config.snowBiomeTop - v845 <= 0) {
    mainContext.fillStyle = "#dbc666";
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
  } else if (config.snowBiomeTop - v845 >= maxScreenHeight) {
    mainContext.fillStyle = "#fff";
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
  } else if (config.snowBiomeTop - v845 >= 0) {
    mainContext.fillStyle = "#fff";
    mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - v845);
    mainContext.fillStyle = "#b6db66";
    mainContext.fillRect(0, config.snowBiomeTop - v845, maxScreenWidth, maxScreenHeight - (config.snowBiomeTop - v845));
  } else {
    mainContext.fillStyle = "#b6db66";
    mainContext.fillRect(0, 0, maxScreenWidth, config.mapScale - config.snowBiomeTop - v845);
    mainContext.fillStyle = "#dbc666";
    mainContext.fillRect(0, config.mapScale - config.snowBiomeTop - v845, maxScreenWidth, maxScreenHeight - (config.mapScale - config.snowBiomeTop - v845));
  }
  if (!firstSetup) {
    waterMult += waterPlus * config.waveSpeed * delta;
    if (waterMult >= config.waveMax) {
      waterMult = config.waveMax;
      waterPlus = -1;
    } else if (waterMult <= 1) {
      waterMult = waterPlus = 1;
    }
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "#dbc666";
    renderWaterBodies(v844, v845, mainContext, config.riverPadding);
    mainContext.fillStyle = "#91b2db";
    renderWaterBodies(v844, v845, mainContext, (waterMult - 1) * 250);
  }
  if (getEl("showgrid").checked) {
    mainContext.lineWidth = 4;
    mainContext.strokeStyle = "#000";
    mainContext.globalAlpha = 0.06;
  } else {
    mainContext.lineWidth = 0;
    mainContext.strokeStyle = "#000";
    mainContext.globalAlpha = 0;
  }
  for (let v846 = -camX; v846 < maxScreenWidth; v846 += maxScreenHeight / 18) {
    if (v846 > 0) {
      mainContext.moveTo(v846, 0);
      mainContext.lineTo(v846, maxScreenHeight);
    }
  }
  for (let v847 = -camY; v847 < maxScreenHeight; v847 += maxScreenHeight / 18) {
    if (v847 > 0) {
      mainContext.moveTo(0, v847);
      mainContext.lineTo(maxScreenWidth, v847);
    }
  }
  mainContext.stroke();
  if (pathFind.active) {
    if (pathFind.array && (pathFind.chaseNear ? enemy.length : true)) {
      mainContext.lineWidth = 3;
      mainContext.globalAlpha = 1;
      mainContext.strokeStyle = "cyan";
      mainContext.beginPath();
      pathFind.array.forEach((p1031, p1032) => {
        let v848 = {
          x: pathFind.scale / pathFind.grid * p1031.x,
          y: pathFind.scale / pathFind.grid * p1031.y
        };
        let v849 = {
          x: player.x2 - pathFind.scale / 2 + v848.x - v844,
          y: player.y2 - pathFind.scale / 2 + v848.y - v845
        };
        if (p1032 == 0) {
          mainContext.moveTo(v849.x, v849.y);
        } else {
          mainContext.lineTo(v849.x, v849.y);
        }
      });
      mainContext.stroke();
    }
  }
  mainContext.globalAlpha = 1;
  mainContext.strokeStyle = outlineColor;
  renderDeadPlayers(v844, v845);
  mainContext.globalAlpha = 1;
  mainContext.strokeStyle = outlineColor;
  renderGameObjects(-1, v844, v845);
  mainContext.globalAlpha = 1;
  mainContext.lineWidth = outlineWidth;
  renderProjectiles(0, v844, v845);
  renderPlayers(v844, v845, 0);
  mainContext.globalAlpha = 1;
  for (let v850 = 0; v850 < ais.length; ++v850) {
    tmpObj = ais[v850];
    if (tmpObj.active && tmpObj.visible) {
      tmpObj.animate(delta);
      mainContext.save();
      mainContext.translate(tmpObj.x - v844, tmpObj.y - v845);
      mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - Math.PI / 2);
      renderAI(tmpObj, mainContext);
      mainContext.restore();
    }
  }
  renderGameObjects(0, v844, v845);
  renderProjectiles(1, v844, v845);
  renderGameObjects(1, v844, v845);
  renderPlayers(v844, v845, 1);
  renderGameObjects(2, v844, v845);
  renderGameObjects(3, v844, v845);
  mainContext.fillStyle = "#000";
  mainContext.globalAlpha = 0.09;
  if (v844 <= 0) {
    mainContext.fillRect(0, 0, -v844, maxScreenHeight);
  }
  if (config.mapScale - v844 <= maxScreenWidth) {
    let v851 = Math.max(0, -v845);
    mainContext.fillRect(config.mapScale - v844, v851, maxScreenWidth - (config.mapScale - v844), maxScreenHeight - v851);
  }
  if (v845 <= 0) {
    mainContext.fillRect(-v844, 0, maxScreenWidth + v844, -v845);
  }
  if (config.mapScale - v845 <= maxScreenHeight) {
    let v852 = Math.max(0, -v844);
    let v853 = 0;
    if (config.mapScale - v844 <= maxScreenWidth) {
      v853 = maxScreenWidth - (config.mapScale - v844);
    }
    mainContext.fillRect(v852, config.mapScale - v845, maxScreenWidth - v852 - v853, maxScreenHeight - (config.mapScale - v845));
  }
  if (getEl("daytime").checked) {
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
  } else {
    mainContext.globalAlpha = 1;
    mainContext.fillStyle = "rgba(0, 0, 70, 0.6)";
    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
  }
  if (tracker.draw3.active) {
    mainContext.globalAlpha = 1;
    let v854 = {
      x: tracker.draw3.x - v844,
      y: tracker.draw3.y - v845,
      scale: tracker.draw3.scale
    };
    mainContext.strokeStyle = "#cc5151";
    mainContext.lineWidth = 3.25;
    mainContext.beginPath();
    mainContext.arc(v854.x, v854.y, v854.scale, 0, Math.PI * 2);
    mainContext.stroke();
  }
  if (tracker.draw2.active) {
    mainContext.globalAlpha = 0.5;
    let v855 = {
      x: tracker.draw2.x - v844,
      y: tracker.draw2.y - v845,
      scale: tracker.draw2.scale
    };
    mainContext.fillStyle = "rgba(255, 0, 0, 0.5)";
    mainContext.beginPath();
    mainContext.arc(v855.x, v855.y, v855.scale, 0, Math.PI * 2);
    mainContext.fill();
    mainContext.closePath();
    mainContext.globalAlpha = 1;
  }
  mainContext.strokeStyle = darkOutlineColor;
  mainContext.globalAlpha = 1;
  mainContext.beginPath();
  for (let v856 = 0; v856 < players.length + ais.length; ++v856) {
    tmpObj = players[v856] || ais[v856 - players.length];
    if (tmpObj.visible) {
      mainContext.strokeStyle = darkOutlineColor;
      let v857 = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj.name || "");
      if (v857 != "") {
        mainContext.globalAlpha = 1;
        mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
        mainContext.fillStyle = "#fff";
        mainContext.textBaseline = "middle";
        mainContext.textAlign = "center";
        mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
        mainContext.lineJoin = "round";
        mainContext.strokeText(v857, tmpObj.x - v844, tmpObj.y - v845 - tmpObj.scale - config.nameY);
        mainContext.fillText(v857, tmpObj.x - v844, tmpObj.y - v845 - tmpObj.scale - config.nameY);
        if (tmpObj.isLeader && iconSprites.crown.isLoaded) {
          let v858 = config.crownIconScale;
          let v859 = tmpObj.x - v844 - v858 / 2 - mainContext.measureText(v857).width / 2 - config.crownPad;
          mainContext.drawImage(iconSprites.crown, v859, tmpObj.y - v845 - tmpObj.scale - config.nameY - v858 / 2 - 5, v858, v858);
        }
        if (tmpObj.iconIndex == 1 && iconSprites.skull.isLoaded) {
          let v860 = config.crownIconScale;
          let v861 = tmpObj.x - v844 - v860 / 2 + mainContext.measureText(v857).width / 2 + config.crownPad;
          mainContext.drawImage(iconSprites.skull, v861, tmpObj.y - v845 - tmpObj.scale - config.nameY - v860 / 2 - 5, v860, v860);
        }
        if (tmpObj.isPlayer && instaC.wait && near == tmpObj && (tmpObj.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
          let v862 = tmpObj.scale * 2.2;
          mainContext.drawImage(tmpObj.backupNobull ? crossHairSprites[1] : crossHairSprites[0], tmpObj.x - v844 - v862 / 2, tmpObj.y - v845 - v862 / 2, v862, v862);
        }
      }
      if (!getEl("cleanmode").checked) {
        if (tmpObj.isPlayer) {
          let v863 = tmpObj.x - v844 + mainContext.measureText(v857).width / 2 + config.crownPad;
          let v864 = tmpObj.y - v845 - tmpObj.scale - config.nameY;
          if (tmpObj.iconIndex == 1) {
            v863 = tmpObj.x - v844 - 30 + mainContext.measureText(v857).width / 2 + config.crownPad * 3.5 + 5;
          }
          mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
          if (tmpObj.shameCount > 4) {
            mainContext.fillStyle = "#cc5151";
          } else if (tmpObj.shameCount > 2) {
            mainContext.fillStyle = "#ffff00";
          } else {
            mainContext.fillStyle = tmpObj == player || tmpObj.team && tmpObj.team == player.team ? "#8ecc51" : "#fff";
          }
          mainContext.textBaseline = "middle";
          mainContext.textAlign = "center";
          mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
          mainContext.lineJoin = "round";
          mainContext.strokeText(tmpObj.shameCount, v863, v864);
          mainContext.fillText(tmpObj.shameCount, v863, v864);
        }
      }
      if (tmpObj.health > 0) {
        if (tmpObj.name != "") {
          mainContext.fillStyle = darkOutlineColor;
          mainContext.roundRect(tmpObj.x - v844 - config.healthBarWidth - config.healthBarPad, tmpObj.y - v845 + tmpObj.scale + config.nameY, config.healthBarWidth * 2 + config.healthBarPad * 2, 17, 8);
          mainContext.fill();
          mainContext.fillStyle = tmpObj == player || tmpObj.team && tmpObj.team == player.team ? "#8ecc51" : "#cc5151";
          mainContext.roundRect(tmpObj.x - v844 - config.healthBarWidth, tmpObj.y - v845 + tmpObj.scale + config.nameY + config.healthBarPad, config.healthBarWidth * 2 * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
          mainContext.fill();
        }
        if (tmpObj.isPlayer && !getEl("cleanmode").checked) {
          mainContext.globalAlpha = 1;
          let v865 = {
            primary: tmpObj.primaryIndex == undefined ? 1 : (items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed,
            secondary: tmpObj.secondaryIndex == undefined ? 1 : (items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed,
            turret: (2500 - tmpObj.reloads[53]) / 2500
          };
          if (!tmpObj.currentReloads) {
            tmpObj.currentReloads = {
              primary: v865.primary,
              secondary: v865.secondary,
              turret: v865.turret
            };
          }
          const v866 = 0.3;
          tmpObj.currentReloads.primary = (1 - v866) * tmpObj.currentReloads.primary + v866 * v865.primary;
          tmpObj.currentReloads.secondary = (1 - v866) * tmpObj.currentReloads.secondary + v866 * v865.secondary;
          tmpObj.currentReloads.turret = (1 - v866) * tmpObj.currentReloads.turret + v866 * v865.turret;
          if (tmpObj.currentReloads.secondary < 0.999) {
            let v867 = tmpObj.currentReloads.secondary;
            mainContext.fillStyle = darkOutlineColor;
            mainContext.roundRect(tmpObj.x - v844 + 2 - config.healthBarPad, tmpObj.y - v845 + tmpObj.scale + config.nameY - 13, 47 + config.healthBarPad * 2, 17, 10);
            mainContext.fill();
            mainContext.fillStyle = tmpObj == player || tmpObj.team && tmpObj.team == player.team ? "#8ecc51" : "#cc5151";
            mainContext.roundRect(tmpObj.x - v844 + 2, tmpObj.y - v845 + tmpObj.scale + config.nameY - 13 + config.healthBarPad, v867 * 47, 16 - config.healthBarPad * 2, 10);
            mainContext.fill();
          }
          if (tmpObj.currentReloads.primary < 0.999) {
            let v868 = tmpObj.currentReloads.primary;
            mainContext.fillStyle = darkOutlineColor;
            mainContext.roundRect(tmpObj.x - v844 - 50 - config.healthBarPad, tmpObj.y - v845 + tmpObj.scale + config.nameY - 13, 47 + config.healthBarPad * 2, 17, 10);
            mainContext.fill();
            mainContext.fillStyle = tmpObj == player || tmpObj.team && tmpObj.team == player.team ? "#8ecc51" : "#cc5151";
            mainContext.roundRect(tmpObj.x - v844 - 50, tmpObj.y - v845 + tmpObj.scale + config.nameY - 13 + config.healthBarPad, v868 * 47, 16 - config.healthBarPad * 2, 10);
            mainContext.fill();
          }
          if (tmpObj == player) {}
        }
        if (inGame) {
          f50(0, 20, 20, "rgba(0,0,0,5)", "auto", 6, true);
        }
      }
    }
  }
  function f50(p1033, p1034, p1035, p1036, p1037, p1038 = 0, p1039) {
    let v869 = p1039 == true ? tmpObj.isPlayer && tmpObj != player : tmpObj.isPlayer && tmpObj.sid != player.sid && (!isAlly(tmpObj.sid) || tmpObj.sid == player.sid);
    let v870 = {
      x: screenWidth / 2,
      y: screenHeight / 2
    };
    let v871 = Math.min(1, UTILS.getDistance(0, 0, player.x - tmpObj.x, (player.y - tmpObj.y) * (16 / 9)) * 100 / (config.maxScreenHeight / 2) / v870.y);
    if (v869 && !tmpObj.isTeam(player)) {
      let v872 = Math.sqrt((tmpObj.x - player.x) ** 2 + (tmpObj.x - player.x) ** 2);
      let v873 = player.x + v872 * 0.5 * Math.cos(Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x));
      let v874 = player.y + v872 * 0.5 * Math.sin(Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x));
      mainContext.save();
      mainContext.translate(v873 - v844, v874 - v845);
      mainContext.rotate(Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x) + Math.PI / 2);
      mainContext.fillStyle = p1036;
      mainContext.globalAlpha = p1037 == "auto" ? v871 : p1037;
      mainContext.lineWidth = p1038;
      mainContext.lineCap = "round";
      mainContext.beginPath();
      mainContext.strokeStyle = "transparent";
      mainContext.moveTo(p1033, p1033);
      mainContext.lineTo(p1034, p1034);
      mainContext.lineTo(-p1035, p1035);
      mainContext.fill();
      mainContext.stroke();
      mainContext.closePath();
      mainContext.restore();
    }
  }
  function f51(p1040, p1041, p1042, p1043, p1044, p1045, p1046, p1047) {
    mainContext.save();
    mainContext.translate(p1042 - p1040, p1043 - p1041);
    mainContext.rotate(Math.PI / 4);
    mainContext.rotate(p1046);
    mainContext.globalAlpha = 1;
    mainContext.strokeStyle = p1045;
    mainContext.lineCap = "round";
    mainContext.lineWidth = p1047;
    mainContext.beginPath();
    mainContext.moveTo(-p1044, -p1044);
    mainContext.lineTo(p1044, -p1044);
    mainContext.lineTo(p1044, p1044);
    mainContext.stroke();
    mainContext.closePath();
    mainContext.restore();
  }
  if (player) {
    if (my.autoPush && my.pushData) {
      let v875 = near.dist2;
      mainContext.lineWidth = 5;
      mainContext.globalAlpha = Math.max(0.5, 1 - v875 / 1000000);
      mainContext.lineCap = "round";
      mainContext.beginPath();
      mainContext.strokeStyle = "#FFFFFF";
      let v876 = Math.max(5, Math.min(20, v875 / 100));
      mainContext.setLineDash([v876, v876 * 2]);
      mainContext.moveTo(player.x - v844, player.y - v845);
      let v877 = (player.x + my.pushData.x) / 2 - v844;
      let v878 = (player.y + my.pushData.y) / 2 - v845 - 100;
      mainContext.quadraticCurveTo(v877, v878, my.pushData.x - v844, my.pushData.y - v845);
      mainContext.stroke();
      mainContext.setLineDash([]);
      mainContext.lineWidth = 9;
      mainContext.globalAlpha = 0.2;
      mainContext.stroke();
    }
  }
  mainContext.globalAlpha = 1;
  renderMinimap(delta);
  textManager.update(delta, mainContext, v844, v845);
  for (let v879 = 0; v879 < players.length; ++v879) {
    tmpObj = players[v879];
    if (tmpObj.visible) {
      if (tmpObj.chatCountdown > 0) {
        tmpObj.chatCountdown -= delta;
        if (tmpObj.chatCountdown <= 0) {
          tmpObj.chatCountdown = 0;
        }
        mainContext.font = "22px Lilita One";
        let v880 = mainContext.measureText(tmpObj.chatMessage);
        mainContext.textBaseline = "middle";
        mainContext.textAlign = "center";
        let v881 = tmpObj.x - v844;
        let v882 = tmpObj.y - tmpObj.scale - v845 - 130;
        let v883 = 47;
        let v884 = v880.width + 17;
        mainContext.fillStyle = "rgba(0,0,0,0.2)";
        mainContext.roundRect(v881 - v884 / 2, v882 - v883 / 2, v884, v883, 6);
        mainContext.fill();
        mainContext.fillStyle = "#fff";
        mainContext.fillText(tmpObj.chatMessage, v881, v882);
      }
      if (tmpObj.chat.count > 0) {
        tmpObj.chat.count -= delta;
        if (tmpObj.chat.count <= 0) {
          tmpObj.chat.count = 0;
        }
        mainContext.font = "25px Lilita One";
        let v885 = mainContext.measureText(tmpObj.chat.message);
        mainContext.textBaseline = "middle";
        mainContext.textAlign = "center";
        let v886 = tmpObj.x - v844;
        let v887 = tmpObj.y - tmpObj.scale - v845 + 140;
        let v888 = 47;
        let v889 = v885.width + 17;
        mainContext.fillStyle = "rgba(0,0,0,0)";
        mainContext.roundRect(v886 - v889 / 2, v887 - v888 / 2, v889, v888, 6);
        mainContext.fill();
        mainContext.fillStyle = "#cc5151";
        mainContext.fillText(tmpObj.chat.message, v886, v887);
      } else {
        tmpObj.chat.count = 0;
      }
    }
  }
  if (allChats.length) {
    allChats.filter(p1048 => p1048.active).forEach(p1049 => {
      if (!p1049.alive) {
        if (p1049.alpha <= 1) {
          p1049.alpha += delta / 250;
          if (p1049.alpha >= 1) {
            p1049.alpha = 1;
            p1049.alive = true;
          }
        }
      } else {
        p1049.alpha -= delta / 5000;
        if (p1049.alpha <= 0) {
          p1049.alpha = 0;
          p1049.active = false;
        }
      }
      if (p1049.active) {
        mainContext.font = "20px Hammersmith One";
        let v890 = mainContext.measureText(p1049.chat);
        mainContext.textBaseline = "middle";
        mainContext.textAlign = "center";
        let v891 = p1049.x - v844;
        let v892 = p1049.y - v845 - 90;
        let v893 = 40;
        let v894 = v890.width + 15;
        mainContext.globalAlpha = p1049.alpha;
        mainContext.fillStyle = p1049.owner.isTeam(player) ? "#8ecc51" : "#cc5151";
        mainContext.strokeStyle = "rgb(25, 25, 25)";
        mainContext.strokeText(p1049.owner.name, v891, v892 - 45);
        mainContext.fillText(p1049.owner.name, v891, v892 - 45);
        mainContext.lineWidth = 5;
        mainContext.fillStyle = "#ccc";
        mainContext.strokeStyle = "rgb(25, 25, 25)";
        mainContext.roundRect(v891 - v894 / 2, v892 - v893 / 2, v894, v893, 6);
        mainContext.stroke();
        mainContext.fill();
        mainContext.fillStyle = "#fff";
        mainContext.strokeStyle = "#000";
        mainContext.strokeText(p1049.chat, v891, v892);
        mainContext.fillText(p1049.chat, v891, v892);
        p1049.y -= delta / 100;
      }
    });
  }
  mainContext.globalAlpha = 1;
  renderMinimap(delta);
}
window.requestAnimFrame = function () {
  return null;
};
window.rAF = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (p1050) {
    window.setTimeout(p1050, 1000 / 9);
  };
}();
function doUpdate() {
  now = performance.now();
  delta = now - lastUpdate;
  lastUpdate = now;
  let v895 = performance.now();
  let v896 = v895 - fpsTimer.last;
  if (v896 >= 1000) {
    fpsTimer.ltime = fpsTimer.time * (1000 / v896);
    fpsTimer.last = v895;
    fpsTimer.time = 0;
  }
  fpsTimer.time++;
  let v897 = Math.ceil(window.pingTime * 136136126);
  if (getEl("fakePing").checked) {
    getEl("pingFps").innerHTML = v897 + " | FPS: " + Math.round(fpsTimer.ltime) + " | Packet: " + secPacket + " | AutoMills: " + mills.place + " | CanInsta?: " + instaC.isTrue;
  } else {
    getEl("pingFps").innerHTML = window.pingTime + " | FPS: " + Math.round(fpsTimer.ltime) + " | Packet: " + secPacket + " | AutoMills: " + mills.place + " | CanInsta?: " + instaC.isTrue;
  }
  updateGame();
  rAF(doUpdate);
  ms.avg = Math.round((ms.min + ms.max) / 2);
}
prepareMenuBackground();
doUpdate();
function toggleUseless(p1051) {
  getEl("antiBullType").disabled = p1051;
  getEl("BuildHealth").disabled = p1051;
}
toggleUseless(useWasd);
let changeDays = {};
window.debug = function () {
  my.waitHit = 0;
  my.autoAim = false;
  instaC.isTrue = false;
  traps.inTrap = false;
  my.autoPush = false;
  pathFind.active = false;
  pathFind.chaseNear = false;
  itemSprites = [];
  objSprites = [];
  gameObjectSprites = [];
  sendChat("debugging.");
  setTimeout(() => {
    sendChat("debugging..");
  }, 1000);
  setTimeout(() => {
    sendChat("debugging...");
  }, 2000);
};
window.wasdMode = function () {
  useWasd = !useWasd;
  toggleUseless(useWasd);
};
window.startGrind = function () {
  if (getEl("weaponGrind").checked) {
    for (let v898 = 0; v898 < Math.PI * 2; v898 += Math.PI / 2) {
      checkPlace(player.getItemType(22), v898);
    }
  }
};
let projects = ["adorable-eight-guppy", "galvanized-bittersweet-windshield"];
let botIDS = 0;
window.connectFillBots = function () {
  botSkts = [];
  botIDS = 0;
  for (let v899 = 0; v899 < projects.length; v899++) {
    let v900 = new WebSocket("wss://" + projects[v899] + ".glitch.me");
    v900.binaryType = "arraybuffer";
    v900.onopen = function () {
      v900.ssend = function (p1052) {
        let v901 = Array.prototype.slice.call(arguments, 1);
        let v902 = window.msgpack.encode([p1052, v901]);
        v900.send(v902);
      };
      for (let v903 = 0; v903 < 4; v903++) {
        window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
          action: "homepage"
        }).then(function (p1053) {
          let v904 = WS.url.split("wss://")[1].split("?")[0];
          v900.ssend("bots", "wss://" + v904 + "?token=re:" + encodeURIComponent(p1053), botIDS);
          botSkts.push([v900]);
          botIDS++;
        });
      }
    };
    v900.onmessage = function (p1054) {
      let v905 = new Uint8Array(p1054.data);
      let v906 = window.msgpack.decode(v905);
      let v907 = v906[0];
      v905 = v906[1];
    };
  }
};
window.destroyFillBots = function () {
  botSkts.forEach(p1055 => {
    p1055[0].close();
  });
  botSkts = [];
};
window.tryConnectBots = function () {
  for (let v908 = 0; v908 < (bots.length < 3 ? 3 : 4); v908++) {
    window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
      action: "homepage"
    }).then(function (p1056) {
      botSpawn(p1056);
    });
  }
};
window.destroyBots = function () {
  bots.forEach(p1057 => {
    p1057.closeSocket = true;
  });
  bots = [];
};
window.resBuild = function () {
  if (gameObjects.length) {
    gameObjects.forEach(p1058 => {
      p1058.breakObj = false;
    });
    breakObjects = [];
  }
};
window.toggleBotsCircle = function () {
  player.circle = !player.circle;
};
window.toggleVisual = function () {
  config.anotherVisual = !config.anotherVisual;
  gameObjects.forEach(p1059 => {
    if (p1059.active) {
      p1059.dir = p1059.lastDir;
    }
  });
};
window.prepareUI = function (p1060) {
  resize();
  var v909 = document.getElementById("chatBox");
  var v910 = document.getElementById("chatHolder");
  var v911 = document.createElement("div");
  v911.id = "suggestBox";
  var v912 = [];
  var v913 = 0;
  function f52() {
    if (!usingTouch) {
      if (v910.style.display == "block") {
        if (v909.value) {
          sendChat(v909.value);
        }
        f53();
      } else {
        storeMenu.style.display = "none";
        allianceMenu.style.display = "none";
        v910.style.display = "block";
        v909.focus();
        resetMoveDir();
      }
    } else {
      setTimeout(function () {
        var vPrompt2 = prompt("chat message");
        if (vPrompt2) {
          sendChat(vPrompt2);
        }
      }, 1);
    }
    v909.value = "";
    (() => {
      v913 = 0;
    })();
  }
  function f53() {
    v909.value = "";
    v910.style.display = "none";
  }
  UTILS.removeAllChildren(actionBar);
  for (let v914 = 0; v914 < items.weapons.length + items.list.length; ++v914) {
    (function (p1061) {
      UTILS.generateElement({
        id: "actionBarItem" + p1061,
        class: "actionBarItem",
        onmouseout: function () {
          showItemInfo();
        },
        parent: actionBar
      });
    })(v914);
  }
  for (let v915 = 0; v915 < items.list.length + items.weapons.length; ++v915) {
    (function (p1062) {
      let v916 = document.createElement("canvas");
      v916.width = v916.height = 66;
      let v917 = v916.getContext("2d");
      v917.translate(v916.width / 2, v916.height / 2);
      v917.imageSmoothingEnabled = false;
      v917.webkitImageSmoothingEnabled = false;
      v917.mozImageSmoothingEnabled = false;
      if (items.weapons[p1062]) {
        v917.rotate(Math.PI);
        let v918 = new Image();
        toolSprites[items.weapons[p1062].src] = v918;
        v918.onload = function () {
          this.isLoaded = true;
          let v919 = 1 / (this.height / this.width);
          let v920 = items.weapons[p1062].iPad || 1;
          v917.drawImage(this, -(v916.width * v920 * config.iconPad * v919) / 2, -(v916.height * v920 * config.iconPad) / 2, v916.width * v920 * v919 * config.iconPad, v916.height * v920 * config.iconPad);
          v917.fillStyle = "rgba(0, 0, 70, 0.2)";
          v917.globalCompositeOperation = "source-atop";
          v917.fillRect(-v916.width / 2, -v916.height / 2, v916.width, v916.height);
          getEl("actionBarItem" + p1062).style.backgroundImage = "url(" + v916.toDataURL() + ")";
        };
        v918.src = "./../img/weapons/" + items.weapons[p1062].src + ".png";
        let vGetEl4 = getEl("actionBarItem" + p1062);
        vGetEl4.onclick = UTILS.checkTrusted(function () {
          selectWeapon(p1060.weapons[items.weapons[p1062].type]);
        });
        UTILS.hookTouchEvents(vGetEl4);
      } else {
        let vGetItemSprite3 = getItemSprite(items.list[p1062 - items.weapons.length], true);
        let v921 = Math.min(v916.width - config.iconPadding, vGetItemSprite3.width);
        v917.globalAlpha = 1;
        v917.drawImage(vGetItemSprite3, -v921 / 2, -v921 / 2, v921, v921);
        v917.fillStyle = "rgba(0, 0, 70, 0.1)";
        v917.globalCompositeOperation = "source-atop";
        v917.fillRect(-v921 / 2, -v921 / 2, v921, v921);
        getEl("actionBarItem" + p1062).style.backgroundImage = "url(" + v916.toDataURL() + ")";
        let vGetEl5 = getEl("actionBarItem" + p1062);
        vGetEl5.onclick = UTILS.checkTrusted(function () {
          selectToBuild(p1060.items[p1060.getItemType(p1062 - items.weapons.length)]);
        });
        UTILS.hookTouchEvents(vGetEl5);
      }
    })(v915);
  }
};
window.profineTest = function (p1063) {
  if (p1063) {
    let v922 = p1063 + "";
    v922 = v922.slice(0, config.maxNameLength);
    return v922;
  }
};
var uwu = document.getElementById("foodDisplay");
var da = document.getElementById("woodDisplay");
var das = document.getElementById("stoneDisplay");
var dsa = document.getElementById("killCounter");
var ds312a = document.getElementById("scoreDisplay");
var dsa2 = document.getElementById("chatBox");
var ds312a2 = document.getElementById("leaderboard");
var ds312a3 = document.getElementById("ageText");
var ds312a4 = document.getElementById("actionBar");
var ds312a5 = document.getElementById("pingDisplay");
var ds312a6 = document.getElementById("upgradeCounter");
var elements = [uwu, da, das, dsa, ds312a, dsa2, ds312a2, ds312a3, ds312a4, ds312a5, ds312a6];
elements.forEach(function (p1064) {
  if (p1064) {
    p1064.style.fontFamily = "Lilita One";
  }
});
const getContextHandler = {
  apply(p1065, p1066, p1067) {
    const v923 = p1065.apply(p1066, p1067);
    if (p1066.id == "gameCanvas") {
      context = v923;
    }
    return v923;
  }
};
const requestAnimationFrameHandler = {
  apply(p1068, p1069, p1070) {
    if (context) {
      context.globalAlpha = 0.3;
    }
    return p1068.apply(p1069, p1070);
  }
};
let context = null;
Object.setPrototypeOf(getContextHandler, null);
Object.setPrototypeOf(requestAnimationFrameHandler, null);
HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, getContextHandler);
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, requestAnimationFrameHandler);
// ==UserScript==
// @name         MooMoo.io Script Unpatcher (Any Hack) (All patches, fixes packets)
// @namespace    http://tampermonkey.net/
// @version      100000
// @description  Rewrites packets to most recent version (e.g. 33 -> f)
// @author       JavedPension
// @match        *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520849/MooMooio%20Script%20Unpatcher%20%28Any%20Hack%29%20%28All%20patches%2C%20fixes%20packets%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520849/MooMooio%20Script%20Unpatcher%20%28Any%20Hack%29%20%28All%20patches%2C%20fixes%20packets%29.meta.js
// ==/UserScript==

/* How to use

Copy and paste the code below to the end of your hack.
This technically will auto-fix all hacks after the first update in 2021.

If you do not have msgpack locally referencable, include the `// @require` line in your mod metadata as done above.

*/

const PACKET_MAP = {
    // wont have all old packets, since they conflict with some of the new ones, add them yourself if you want to unpatch mods that are that old.
    "33": "9",
    // "7": "K",
    "ch": "6",
    "pp": "0",
    "13c": "c",

    // most recent packet changes
    "f": "9",
    "a": "9",
    "d": "F",
    "G": "z"
}

let originalSend = WebSocket.prototype.send;

WebSocket.prototype.send = new Proxy(originalSend, {
    apply: ((target, websocket, argsList) => {
        let decoded = msgpack.decode(new Uint8Array(argsList[0]));

        if (PACKET_MAP.hasOwnProperty(decoded[0])) {
            decoded[0] = PACKET_MAP[decoded[0]];
        }

        return target.apply(websocket, [msgpack.encode(decoded)]);
    })
});