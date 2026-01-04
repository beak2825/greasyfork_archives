// ==UserScript==
// @license MIT
// @name         SkidWare ModMenu - diep.io
// @namespace    bo$$
// @version      v1.1.0
// @description  Spinner, Aimbot, AutoFarm
// @author       Dreamy @C:Mi300(Aimbot+Fov)
// @match        https://diep.io/*
// @match        https://staging.diep.io/*
// @match        https://diep-io.rivet.game/*
// @icon         https://gamesense.pub/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538385/SkidWare%20ModMenu%20-%20diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/538385/SkidWare%20ModMenu%20-%20diepio.meta.js
// ==/UserScript==

// mi300's discord - https://discord.gg/S4CA5w9p8p
// my discord - https://discord.gg/NBN3jgQDGe
const FOV_UPDATE_INTERVAL = 16.6;
const FOV_LERP = 0.1;
let setFov = 0.5;
let foxv = 0.5;
let keyStates = new Map();

const onWheelEvent = event => {setFov += -Math.sign(event.deltaY) * 0.02 * Math.log10(setFov / 0.55 + 1)}
const onKeyDown = event => {keyStates.set(event.keyCode, 1)}
const onKeyUp = event => {keyStates.set(event.keyCode, 0)}

function updateFov(){
  if(typeof window.extern === 'undefined')return;
  if(!window.extern.doesHaveTank())return;
  if(keyStates.get(187)) setFov += 0.01 * Math.log10(setFov / 0.55 + 1);
  if(keyStates.get(189)) setFov -= 0.01 * Math.log10(setFov / 0.55 + 1);

  foxv += (setFov - foxv) * FOV_LERP;
  window.extern.setScreensizeZoom(1, foxv);
}
function init(){
  document.addEventListener("wheel", onWheelEvent);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  setInterval(updateFov, FOV_UPDATE_INTERVAL);
}
init();

let a;
class _a {
  constructor() {
    this.p = {};
    this.v = false;
    document.addEventListener("DOMContentLoaded", this.tu.bind(this));
  }

  tu() {
    if (this.v) return;
    this.v = true;
    const originalGetElementById = HTMLDocument.prototype.getElementById;
    HTMLDocument.prototype.getElementById = function (id) {
      const elem = originalGetElementById.call(document, id);
      if (id === "canvas") return wrapCanvas(elem);
      return elem;
    };

    const originalCreateElement = HTMLDocument.prototype.createElement;
    HTMLDocument.prototype.createElement = function (tag) {
      const elem = originalCreateElement.call(document, tag);
      if (tag === "canvas") return wrapCanvas(elem);
      return elem;
    };

    function wrapCanvas(origCanvas) {
      class HTMLCanvasElementProxy {}
      let proxyCanvas = new HTMLCanvasElementProxy();
      proxyCanvas.width = origCanvas.width;
      proxyCanvas.height = origCanvas.height;
      proxyCanvas.transferControlToOffscreen = origCanvas.transferControlToOffscreen.bind(origCanvas);
      proxyCanvas.toDataURL = origCanvas.toDataURL.bind(origCanvas);
      proxyCanvas.toBlob = origCanvas.toBlob.bind(origCanvas);
      proxyCanvas.captureStream = origCanvas.captureStream.bind(origCanvas);

      proxyCanvas.getContext = function (...args) {
        let ctx = origCanvas.getContext(...args);
        if (args[0] !== "2d") return ctx;
        return new Proxy(ctx, {
          get: function (target, prop) {
            const original = target[prop];
            if (typeof original !== "function") return original;
            if (Object.keys(a.p).includes(prop)) {
              return function (...pArgs) {
                let skip = false;
                a.p[prop].forEach((hook) => {
                  const result = hook(ctx, ...pArgs);
                  if (!result) {
                    skip = true;
                  } else {
                    [ctx, pArgs] = result;
                  }
                });
                if (skip) return;
                return original.apply(target, pArgs);
              };
            }
            return original.bind(target);
          },
          set: function (target, prop, value) {
            target[prop] = value;
            return true;
          },
        });
      };
      return proxyCanvas;
    }

    createUnifiedMenu();
  }

  _(methodName, hookFn) {
    if (Object.keys(a.p).includes(methodName)) {
      a.p[methodName].push(hookFn);
    } else {
      a.p[methodName] = [hookFn];
    }
  }
}
a = new _a();

let spinSpeed = 0.80; 
let isSpinning = false;
let spinAngle = 0;
let isShooting = false;
let isFiring = false;
let isAimbotActive = false;
let playerTank = "Tank";
let playerLevel = 1;
let playerX = 0;
let playerY = 0;
let arrowPos = [0, 0];
let minimapPos = [0, 0];
let minimapSize = [0, 0];
let fov = 0.5;
let text = [];
let tankShapes = [];
let lastPlayers = [];
let players = [];
let lastArc = [Infinity, Infinity];
let mousePressed = false;
let mouseLocked = false;
let mouseX = 0;
let mouseY = 0;
let isAutoFarm = false;  
let neutralSquares = [];  
let neutralPentagons = []; 
let neutralTriangles = [];
let farmPriority = "pentagon";
let isDebug = false;
let hasJoined = false;
const averageEnemyDodgeTime = 1750;
const destroyerAccuracy = true;
const playerVelocityPredictionSampleSize = 50;
const arenaSize = 26000;
const gameStyle = {
  ren_grid_base_alpha: 0.05,
  square: "#ffe869",
  triangle: "#fc7677",
  pentagon: "#768dfc",
  teamBlue: "#00b2e1",
  teamRed: "#f14e54",
  teamPurple: "#bf7ff5",
  teamGreen: "#00e16e",
};
let teamColor = "";
const bulletSpeedOffsets = {
  Skimmer: 0.5,
  Factory: 0.56,
  Annihilator: 0.7,
  Streamliner: 1.1,
  "Auto Gunner": 1.1,
  Gunner: 1.1,
  Predator: 1.4,
  Mothership: 0.48,
  Manager: 0.8,
  Hybrid: 0.7,
  Ranger: 1.5,
  Stalker: 1.5,
  Assassin: 1.5,
  Sniper: 1.5,
  Hunter: 1.4,
  Necromancer: 0.72,
  "Arena Closer": 2,
  Overlord: 0.8,
  Overseer: 0.8,
  Destroyer: 0.7,
};
const predatorStackTime = [
  [50, 500, 1400, 2800],
  [50, 500, 1300, 2700],
  [50, 400, 1200, 2450],
  [50, 300, 1100, 2200],
  [50, 300, 1000, 2100],
  [50, 300, 900, 1800],
  [50, 300, 800, 1700],
  [50, 300, 750, 1500],
];
const hunterStackTime = [
  [50, 1200],
  [50, 1100],
  [50, 1000],
  [50, 950],
  [50, 800],
  [50, 725],
  [50, 700],
  [50, 625],
];
const buildStatLevels = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 30, 33, 36, 39, 42, 45,
];
const statNumbers = {
  1: "healthRegen",
  2: "maxHealth",
  3: "bodyDamage",
  4: "bulletSpeed",
  5: "bulletPenetration",
  6: "bulletDamage",
  7: "reload",
  8: "movementSpeed",
};

function getUpgrades() {
  let upgrades = 0;
  for (let i = 0; i < buildStatLevels.length; ++i) {
    upgrades++;
    if (playerLevel < buildStatLevels[i]) break;
  }
  return upgrades;
}
function canUpgrade() {
  const rawStats = window.extern.get_convar("game_stats_build");
  return getUpgrades() - 1 > rawStats.length;
}
function truncateStats() {
  const rawStats = window.extern.get_convar("game_stats_build");
  return rawStats.slice(0, getUpgrades());
}
function getStats() {
  const rawStats = window.extern.get_convar("game_stats_build");
  let stats = {
    healthRegen: 0,
    maxHealth: 0,
    bodyDamage: 0,
    bulletSpeed: 0,
    bulletPenetration: 0,
    bulletDamage: 0,
    reload: 0,
    movementSpeed: 0,
  };
  for (let i = 0; i < rawStats.length; ++i) {
    ++stats[statNumbers[rawStats[i]]];
  }
  return stats;
}

let forcingU = false;
function forceU() {
  if (canUpgrade()) {
    forcingU = true;
    window.extern.onKeyDown(21, 1);
  } else if (forcingU) {
    forcingU = false;
    window.extern.onKeyUp(21, 1);
  }
}
function getTankBulletSpeedOffset(tank) {
  return bulletSpeedOffsets[tank] || 1;
}
function calculateMainBulletSpeed() {
  const speedstat = getStats().bulletSpeed;
  return (
    (20 + speedstat * 3 * getTankBulletSpeedOffset(playerTank)) * 0.03
  );
}
function getDistance(x1, y1, x2, y2) {
  const distX = x1 - x2;
  const distY = y1 - y2;
  return Math.hypot(distX, distY);
}

function calculateTime(player) {
  const distance = getDistance(playerX, playerY, player.wx, player.wy);
  const bulletSpeed = calculateMainBulletSpeed();
  const playerVel = getDistVel(player);
  const relativeBulletToTargetVel = bulletSpeed - playerVel;
  return distance / relativeBulletToTargetVel;
}

function predictPlayer(player, time) {
  const [velX, velY] =
    typeof player.velocity === "undefined"
      ? [0, 0]
      : [(player.velocity[0] || 0), (player.velocity[1] || 0)];
  return [player.wx + time * velX, player.wy + time * velY];
}

function getDistVel(player) {
  let dd = 0;
  let dataPoints = 0;
  for (let i = 1; i < player.positionTable.length; ++i) {
    if (!player.positionTable[i] || !player.positionTable[i - 1]) continue;
    const d =
      getDistance(
        playerX,
        playerY,
        player.positionTable[i].x,
        player.positionTable[i].y
      ) -
      getDistance(
        playerX,
        playerY,
        player.positionTable[i - 1].x,
        player.positionTable[i - 1].y
      );
    const dt =
      player.positionTable[i].timestamp - player.positionTable[i - 1].timestamp;
    dd += d / dt;
    dataPoints++;
  }
  return dataPoints > 0 ? dd / dataPoints : 0;
}

function getPlayerWeight(player) {
  const distanceWeight =
    (1 / getDistance(playerX, playerY, player.wx, player.wy)) * 1000;
  const scoreWeight = Math.min(23536, Math.max(0, player.score || 0)) / 100000;
  return distanceWeight + scoreWeight;
}

function setPlayerPos() {
  const dx = arrowPos[0] - minimapPos[0];
  const dy = arrowPos[1] - minimapPos[1];
  playerX = (dx / minimapSize[0]) * arenaSize;
  playerY = (dy / minimapSize[1]) * arenaSize;
}

function getRenderedWorldPosition(x, y) {
  const mainCanvas = document.getElementById("canvas");
  const midX = x - mainCanvas.width / 2;
  const midY = y - mainCanvas.height / 2;
  const scaledX = midX / (fov / 2.8);
  const scaledY = midY / (fov / 2.8);
  return [playerX + scaledX, playerY + scaledY];
}

function worldToCanvasPosition(x, y) {
  const mainCanvas = document.getElementById("canvas");
  const deltaX = x - playerX;
  const deltaY = y - playerY;
  return [
    mainCanvas.width / 2 + deltaX * (fov / 2.8),
    mainCanvas.height / 2 + deltaY * (fov / 2.8),
  ];
}

function worldToMousePosition(x, y) {
  const deltaX = x - playerX;
  const deltaY = y - playerY;
  return [
    window.innerWidth / 2 + deltaX * (fov / 2.8),
    window.innerHeight / 2 + deltaY * (fov / 2.8),
  ];
}

function parseDiepScore(s) {
  let scoreMultiplier = 1;
  if (s[s.length - 1] === "k") scoreMultiplier = 1000;
  else if (s[s.length - 1] === "m") scoreMultiplier = 1000000;
  else if (!s.includes(".")) {
    if (isNaN(s)) return null;
    const toInt = parseInt(s, 10);
    return isNaN(toInt) ? null : toInt;
  } else return null;
  const toFloat = parseFloat(s.slice(0, -1));
  if (isNaN(toFloat)) return null;
  return toFloat * scoreMultiplier;
}

function getClosestText(arr, x, y) {
  return arr.reduce(function (acc, cur) {
    if (!acc) return cur;
    const distAcc = getDistance(x, y, acc.mx, acc.my);
    const distCur = getDistance(x, y, cur.mx, cur.my);
    return distAcc > distCur ? cur : acc;
  }, null);
}

function getPlayers() {
  lastPlayers = players;
  players = [];
  for (let aIndex = 0; aIndex < tankShapes.length; ++aIndex) {
    if (tankShapes[aIndex].radius / fov < 19) continue;
    const scoreTextPos = [
      tankShapes[aIndex].x,
      tankShapes[aIndex].y - tankShapes[aIndex].radius * 1.3,
    ];
    const nameTextPos = [
      tankShapes[aIndex].x,
      tankShapes[aIndex].y - tankShapes[aIndex].radius * 2,
    ];
    const closestScoreText = getClosestText(text, ...scoreTextPos);
    const closestNameText = getClosestText(text, ...nameTextPos);
    const distToScore = closestScoreText
      ? getDistance(
          ...scoreTextPos,
          closestScoreText.mx,
          closestScoreText.my
        )
      : Infinity;
    const distToName = closestNameText
      ? getDistance(...nameTextPos, closestNameText.mx, closestNameText.my)
      : Infinity;

    let score = "";
    let name = "";
    if (distToScore < 25) {
      score = parseDiepScore(closestScoreText ? closestScoreText.text : "-1");
    }
    if (distToName < 25) {
      name = closestNameText ? closestNameText.text : "";
    }
    if (score !== "") {
      const [wx, wy] = getRenderedWorldPosition(
        tankShapes[aIndex].x,
        tankShapes[aIndex].y
      );
      players.push({
        wx,
        wy,
        x: tankShapes[aIndex].x,
        y: tankShapes[aIndex].y,
        radius: tankShapes[aIndex].radius,
        name,
        score,
        velocity: undefined,
        teammate: tankShapes[aIndex].fillStyle === gameStyle[teamColor],
      });
    }
  }
}

function matchPlayers() {
  for (let i = 0; i < players.length; ++i) {
    const [x, y] = [players[i].wx, players[i].wy];
    const lastPlayer = lastPlayers.reduce((acc, cur) => {
      if (!acc) return cur;
      const distAcc = getDistance(x, y, acc.wx, acc.wy);
      const distCur = getDistance(x, y, cur.wx, cur.wy);
      return distAcc > distCur ? cur : acc;
    }, null);
    if (
      lastPlayer &&
      getDistance(
        players[i].wx,
        players[i].wy,
        lastPlayer.wx,
        lastPlayer.wy
      ) < 25
    ) {
      players[i].teammate = lastPlayer.teammate || players[i].teammate;
      players[i].positionTable = lastPlayer.positionTable.concat();
      players[i].positionTable.push({
        x: players[i].wx,
        y: players[i].wy,
        timestamp: performance.now(),
      });
      players[i].positionTable.shift();
      players[i].velocity = getVelocity(players[i]);
    } else {
      players[i].positionTable = Array.from(
        new Array(playerVelocityPredictionSampleSize),
        () => null
      );
    }
  }
}

function getVelocity(player) {
  let tx = 0,
    ty = 0;
  let dataPoints = 0;
  for (let i = 1; i < player.positionTable.length; ++i) {
    if (!player.positionTable[i] || !player.positionTable[i - 1]) continue;
    const dx = player.positionTable[i].x - player.positionTable[i - 1].x;
    const dy = player.positionTable[i].y - player.positionTable[i - 1].y;
    const dt =
      player.positionTable[i].timestamp - player.positionTable[i - 1].timestamp;
    tx += dx / dt;
    ty += dy / dt;
    dataPoints++;
  }
  return dataPoints > 0 ? [tx / dataPoints, ty / dataPoints] : [0, 0];
}

function renderOverlay(player, tx, ty, px, py) {
  if (!isDebug) return;
  const ctx = document.getElementById("canvas").getContext("2d");
  const [stx, sty] = worldToCanvasPosition(tx, ty);
  const [spx, spy] = worldToCanvasPosition(px, py);
  ctx.beginPath();
  ctx.arc(stx, sty, 25, Math.PI * 2, 0, 1);
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#ff5294";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(spx, spy, 25, Math.PI * 2, 0, 1);
  ctx.fillStyle = "#52e8ff";
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(stx, sty);
  ctx.lineTo(spx, spy);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function aim() {
  const target = players
    .filter(plr => !plr.teammate)
    .reduce((acc, cur) => {
      if (!acc) return cur;
      return getPlayerWeight(cur) > getPlayerWeight(acc) ? cur : acc;
    }, null);
  const enemyMightDodge =
    destroyerAccuracy &&
    !!target &&
    ["Destroyer", "Hybrid", "Annihilator"].includes(playerTank) &&
    calculateTime(target) >= averageEnemyDodgeTime;

  if (!target || enemyMightDodge || !isAimbotActive || mousePressed) {
    if (mouseLocked) {
      mouseLocked = false;
      window.extern.onTouchMove(-1, mouseX, mouseY, true);
      setTimeout(() => {
        window.extern.onKeyUp(36);
      }, 80);
    }
    return;
  }
  if (!mouseLocked) {
    mouseLocked = true;
    setTimeout(() => {
      isFiring = true;
      window.extern.onKeyDown(36);
    }, 80);
  }

  const [sPX, sPY] = worldToMousePosition(target.wx, target.wy);

  if (sPX != null && sPY != null) {
    if (typeof window.extern.onTouchMove === "function") {
      window.extern.onTouchMove(-1, sPX, sPY, true);
    } else if (typeof window.extern.onMouseMove === "function") {
      window.extern.onMouseMove(sPX, sPY);
    } else {
      window.extern.onTouchMove(-1, sPX, sPY, true);
    }

    setTimeout(() => {
      isFiring = true;
      window.extern.onKeyDown(36);
      setTimeout(() => {
        window.extern.onKeyUp(36);
      }, 50);
    }, 10);
  }
  renderOverlay(target, target.wx, target.wy, target.wx, target.wy);
}

function stack() {
  if (!(window && window.extern)) return;
  const reload = getStats().reload;
  window.extern.onKeyUp(36); // release fire

  if (playerTank === "Hunter") {
    shoot(hunterStackTime[reload][0]);
    setTimeout(() => {
      window.extern.onKeyDown(5);
      window.extern.onKeyUp(5);
    }, hunterStackTime[reload][1]);
  } else if (playerTank === "Predator") {
    shoot(predatorStackTime[reload][0]);
    setTimeout(() => {
      shoot(predatorStackTime[reload][1]);
    }, predatorStackTime[reload][2]);
    setTimeout(() => {
      window.extern.onKeyDown(5);
      window.extern.onKeyUp(5);
    }, predatorStackTime[reload][3]);
  }
}
function shoot(t) {
  isFiring = true;
  window.extern.onKeyDown(36);
  setTimeout(() => {
    window.extern.onKeyUp(36);
  }, t);
}

document.addEventListener("mousedown", function (ev) {
  mousePressed = true;
  if (ev.button === 0) {
    if (mouseLocked) {
      isFiring = true;
      window.extern.onKeyDown(36);
      setTimeout(() => {
        window.extern.onKeyDown(36);
      }, 10);
    }
  }
});
document.addEventListener("mouseup", function (ev) {
  mousePressed = false;
  if (ev.button === 0) {
    window.extern.onKeyUp(36);
  }
});
document.addEventListener("touchstart", function (ev) {
  isShooting = true;
});
document.addEventListener("touchend", function (ev) {
  isShooting = false;
});
document.addEventListener(
  "mousemove",
  function (ev) {
    if (isSpinning) {
      ev.stopImmediatePropagation();
      ev.preventDefault();
    }
  },
  true
);
document.addEventListener(
  "touchmove",
  function (ev) {
    if (isSpinning) {
      ev.stopImmediatePropagation();
      ev.preventDefault();
    }
  },
  true
);
// yes
const KeyToToggleAimbot = "KeyU";
const KeyToStack       = "KeyI";
const KeyToToggleMenu  = "KeyM";

document.addEventListener("keydown", function (ev) {
  if (ev.code === KeyToToggleAimbot) {
    isAimbotActive ^= 1;
    if (window.__common__ && window.__common__.active_gamemode === "sandbox") {
      window.extern &&
        window.extern.inGameNotification(
          "Aimbot Doesn't Work in Sandbox",
          0xF533FF
        );
      isAimbotActive = 0;
    } else {
      window.extern &&
        window.extern.inGameNotification(
          isAimbotActive ? "Aimbot: ON" : "Aimbot: OFF",
          0xF533FF
        );
    }
    const aimbotCheckbox = document.getElementById("aimbot-checkbox");
    if (aimbotCheckbox) aimbotCheckbox.checked = Boolean(isAimbotActive);
  }
  else if (ev.code === KeyToStack) {
    if (["Hunter", "Predator"].includes(playerTank)) {
      stack();
      window.extern &&
        window.extern.inGameNotification("Stacking Bullets...", 0xF533FF);
    }
  }
  else if (ev.code === KeyToToggleMenu) {
    if (!menuContainer) return;
    const isHidden = menuContainer.style.display === "none";
    menuContainer.style.display = isHidden ? "block" : "none";
  }
});
// why am I even doing this?
let ctxTransform;
a._("setTransform", (context, ...args) => {
  ctxTransform = args;
  return [context, args];
});

a._("drawImage", (context, ...args) => {
  if (args[0].renderMethod) {
    const x = ctxTransform[4] + args[1];
    const y = ctxTransform[5] + args[2];
    if (args[0].renderMethod.method === "text") {
      text.push({
        x,
        y,
        cw: args[0].width,
        ch: args[0].height,
        mx: x + args[0].width / 4,
        my: y + args[0].height / 4,
        text: args[0].renderMethod.text,
      });
    }
  }
  return [context, args];
});

a._("strokeText", (context, ...args) => {
  if (context.canvas.id !== "canvas") {
    context.canvas.renderMethod = {
      method: "text",
      text: args[0],
      args,
      fillStyle: context.fillStyle,
    };
    if (args[0].startsWith("Lvl ")) {
      if (args[0][5] === " ") {
        playerLevel = Number(args[0].slice(4, 5));
        playerTank = args[0].slice(6);
      } else {
        playerLevel = Number(args[0].slice(4, 6));
        playerTank = args[0].slice(7);
      }
    }
  }
  return [context, args];
});
a._("arc", (context, ...args) => {
  if (
    context.canvas.id === "canvas" &&
    ctxTransform[4] === lastArc[0] &&
    ctxTransform[5] === lastArc[1]
  ) {
    tankShapes.push({
      x: ctxTransform[4],
      y: ctxTransform[5],
      radius: Math.hypot(ctxTransform[1], ctxTransform[0]),
      fillStyle: context.fillStyle,
    });
    lastArc = [Infinity, Infinity];
  } else {
    lastArc = [ctxTransform[4], ctxTransform[5]];
  }
  return [context, args];
});
// maybe my sister looks hot
a._("stroke", (context, ...args) => {
  if (
    ["#cccccc", "#cdcdcd"].includes(context.fillStyle) &&
    context.strokeStyle === "#000000"
  ) {
    fov = context.globalAlpha / gameStyle.ren_grid_base_alpha;
  }
  return [context, args];
});

a._("strokeRect", (context, ...args) => {
  const t = context.getTransform();
  minimapPos = [t.e, t.f];
  minimapSize = [t.a, t.d];
  return [context, args];
});

// yes i will kill myself one day
let position = 0;
let vertex = [];

a._("beginPath", (context, ...args) => {
  position = 0;
  vertex = [];
  return [context, args];
});
a._("moveTo", (context, ...args) => {
  position = 1;
  vertex.push(args);
  return [context, args];
});
a._("lineTo", (context, ...args) => {
  position++;
  vertex.push(args);
  return [context, args];
});
a._("fill", (context, ...args) => {
  if (
    context.fillStyle === "#000000" &&
    context.globalAlpha > 0.949 &&
    position === 3
  ) {
    arrowPos = getAverage(vertex);
    setPlayerPos();
  }
  else if (
    position === 4 &&
    context.fillStyle &&
    context.fillStyle.toLowerCase().includes("ffe869")
  ) {
    const [rawX, rawY] = getAverage(vertex);
    const centerX = ctxTransform[4] + rawX;
    const centerY = ctxTransform[5] + rawY;
    neutralSquares.push([centerX, centerY]);
  }
  else if (
    position === 5 &&
    context.fillStyle &&
    context.fillStyle.toLowerCase().includes("768dfc")
  ) {
    const [rawX, rawY] = getAverage(vertex);
    const centerX = ctxTransform[4] + rawX;
    const centerY = ctxTransform[5] + rawY;
    neutralPentagons.push([centerX, centerY]);
  }

  else if (
    position === 3 &&
    context.fillStyle &&
    context.fillStyle.toLowerCase().includes("fc7677")
  ) {
    const [rawX, rawY] = getAverage(vertex);
    const centerX = ctxTransform[4] + rawX;
    const centerY = ctxTransform[5] + rawY;
    neutralTriangles.push([centerX, centerY]);
  }

  return [context, args];
});

function getAverage(points) {
  let tx = 0,
    ty = 0;
  points.forEach((point) => {
    tx += point[0];
    ty += point[1];
  });
  return [tx / points.length, ty / points.length];
}

// i hate niggers btw
function onFrame() {
  window.requestAnimationFrame(onFrame);

  getPlayers();
  matchPlayers();

  if (isDebug) {
    const ctx = document.getElementById("canvas").getContext("2d");
    ctx.save();
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 1;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    players.forEach((plr) => {
      if (!plr.teammate) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(plr.x, plr.y);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  forceU();
  aim();
  text = [];
  tankShapes = [];
  getTeam();

  if (isAutoFarm && window.extern && window.extern.doesHaveTank()) {
    if (isDebug) {
      const ctx = document.getElementById("canvas").getContext("2d");
      ctx.save();
      const centerX = ctx.canvas.width / 2;
      const centerY = ctx.canvas.height / 2;

      ctx.strokeStyle = "#9600D6";
      ctx.lineWidth = 1;
      neutralPentagons.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      });

      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 1;
      neutralSquares.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      });
      ctx.strokeStyle = "#FF9900";
      ctx.lineWidth = 1;
      neutralTriangles.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      });

      ctx.restore();
    }

    let targetWorld = null;

    if (farmPriority === "pentagon" && neutralPentagons.length > 0) {
      targetWorld = nearestShapeWorld(neutralPentagons);
    } else if (farmPriority === "square" && neutralSquares.length > 0) {
      targetWorld = nearestShapeWorld(neutralSquares);
    } else if (farmPriority === "triangle" && neutralTriangles.length > 0) {
      targetWorld = nearestShapeWorld(neutralTriangles);
    }
    if (!targetWorld) {
      if (farmPriority !== "pentagon" && neutralPentagons.length > 0) {
        targetWorld = nearestShapeWorld(neutralPentagons);
      } else if (farmPriority !== "square" && neutralSquares.length > 0) {
        targetWorld = nearestShapeWorld(neutralSquares);
      } else if (farmPriority !== "triangle" && neutralTriangles.length > 0) {
        targetWorld = nearestShapeWorld(neutralTriangles);
      }
    }
    if (targetWorld) {
      const [sPX, sPY] = worldToMousePosition(targetWorld[0], targetWorld[1]);
      if (sPX != null && sPY != null) {
        isFiring = true;
        window.extern.onTouchMove(-1, sPX, sPY, true);
        window.extern.onKeyDown(36);
        setTimeout(() => {
          window.extern.onKeyUp(36);
        }, 50);
      }
    }
  }
  neutralSquares = [];
  neutralPentagons = [];
  neutralTriangles = [];
  if (
    isSpinning &&
    !isShooting &&
    !isFiring &&
    window.extern &&
    window.extern.doesHaveTank()
  ) {
    spinAngle += spinSpeed;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const radius = 120;
    const targetX = cx + radius * Math.cos(spinAngle);
    const targetY = cy + radius * Math.sin(spinAngle);
    if (typeof window.extern.onTouchMove === "function") {
      window.extern.onTouchMove(-1, targetX, targetY, true);
    } else if (typeof window.extern.onMouseMove === "function") {
      window.extern.onMouseMove(targetX, targetY);
    }
  }

  if (window.extern && window.extern.doesHaveTank() && !hasJoined) {
    hasJoined = true;
    window.extern.inGameNotification("Welcome to SkidWare. Press M for menu.", 0x6670ff);
  }
}

function nearestShapeWorld(arr) {
  let nearest = null;
  let nearestDist = Infinity;
  for (const [cx, cy] of arr) {
    const [wx, wy] = getRenderedWorldPosition(cx, cy);
    const dist = getDistance(playerX, playerY, wx, wy);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = [wx, wy];
    }
  }
  return nearest;
}


function onGameStart() {
  if (typeof extern === "undefined") return;
  clearInterval(checkGameStart);
  window.requestAnimationFrame(onFrame);

  window.extern.onKeyDown = new Proxy(window.extern.onKeyDown, {
    apply: function (method, context, args) {
      if (args[0] === 36) {
        isFiring = true;
      }
      if (args[0] === 21 && !args[1]) return;
      return Reflect.apply(method, context, args);
    },
  });
  window.extern.onKeyUp = new Proxy(window.extern.onKeyUp, {
    apply: function (method, context, args) {
      if (args[0] === 36) {
        isFiring = false;
      }
      if (args[0] === 21 && !args[1]) return;
      return Reflect.apply(method, context, args);
    },
  });

  const mouseHandler = {
    apply: function (method, context, args) {
      if (!args[3]) {
        [mouseX, mouseY] = [args[1], args[2]];
        if (mouseLocked) return;
      }
      return Reflect.apply(method, context, args);
    },
  };
  window.extern.onTouchStart = new Proxy(window.extern.onTouchStart, mouseHandler);
  window.extern.onTouchMove  = new Proxy(window.extern.onTouchMove,  mouseHandler);
  window.extern.onTouchEnd   = new Proxy(window.extern.onTouchEnd,   mouseHandler);

  window.extern.set_convar = new Proxy(window.extern.set_convar, {
    apply: function (method, context, args) {
      gameStyle[args[0]] = args[1];
      return Reflect.apply(method, context, args);
    },
  });

  window.extern.execute = new Proxy(window.extern.execute, {
    apply: function (method, context, args) {
      if (args[0].startsWith("net_replace_color 3 ")) {
        gameStyle.teamBlue =
          args[0][20] === "0" ? "#" + args[0].slice(22) : args[0].slice(20);
      }
      if (args[0].startsWith("net_replace_color 4 ")) {
        gameStyle.teamRed =
          args[0][20] === "0" ? "#" + args[0].slice(22) : args[0].slice(20);
      }
      if (args[0].startsWith("net_replace_color 5 ")) {
        gameStyle.teamPurple =
          args[0][20] === "0" ? "#" + args[0].slice(22) : args[0].slice(20);
      }
      if (args[0].startsWith("net_replace_color 6 ")) {
        gameStyle.teamGreen =
          args[0][20] === "0" ? "#" + args[0].slice(22) : args[0].slice(20);
      }
      if (args[0].startsWith("net_replace_color 8 ")) {
        gameStyle.square =
          args[0][20] === "0" ? "#" + args[0].slice(22) : args[0].slice(20);
      }
      if (args[0].startsWith("net_replace_color 9 ")) {
        gameStyle.triangle =
          args[0][20] === "0" ? "#" + args[0].slice(22) : args[0].slice(20);
      }
      if (args[0].startsWith("net_replace_color 10 ")) {
        gameStyle.pentagon =
          args[0][21] === "0" ? "#" + args[0].slice(23) : args[0].slice(21);
      }
      return Reflect.apply(method, context, args);
    },
  });
}

const checkGameStart = setInterval(onGameStart, 400);

function getTeam() {
  const partyLinkButton = document.getElementById("copy-party-link");
  if (!partyLinkButton) return;
  switch (partyLinkButton.className) {
    case "active blue":
      teamColor = "teamBlue";
      break;
    case "active purple":
      teamColor = "teamPurple";
      break;
    case "active green":
      teamColor = "teamGreen";
      break;
    case "active red":
      teamColor = "teamRed";
      break;
  }
}

let menuContainer = null;
let isBlackBg = false;
let blackBgDiv = null;

// menu full chatgpt
function createUnifiedMenu() {
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    /* ===================== skeet.cc-Style Menu (30% Bigger & Draggable) ===================== */

    @font-face {
      font-family: 'SkeetFont';
      src: local('Segoe UI'), local('Arial'), sans-serif;
      /* Fallback: system sans-serif if Segoe UI not present */
    }

    /* ── Main Menu Container ───────────────────────────────────────────────────── */
    .skeet-menu {
      position: fixed;
      /* Initial position at 50px, 50px; will be overridden during dragging */
      top: 50px;
      left: 50px;
      width: 494px;                    /* 380px * 1.3 */
      background-color: #1b1b1b;
      border: 1px solid #2f2f2f;
      border-radius: 6px;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.7);
      font-family: 'SkeetFont', sans-serif;
      color: #e0e0e0;
      font-size: 17px;                 /* 13px * 1.3 */
      user-select: none;
      display: none;                   /* hidden by default; toggled with “M” */
      pointer-events: auto;
      z-index: 9999;
    }

    /* ── Drag Handle (26px high) ─────────────────────────────────────────────────── */
    .skeet-drag-handle {
      height: 26px;                    /* 20px * 1.3 */
      background-color: #2f2f2f;
      border-bottom: 1px solid #2f2f2f;
      cursor: move;
      text-align: center;
      line-height: 26px;               /* same as height, to center text vertically */
      font-size: 17px;                 /* 13px * 1.3 */
      font-weight: 500;
      color: #e0e0e0;
      user-select: none;
    }

    /* ── Sidebar (104px-wide Text Tabs) ────────────────────────────────────────── */
    .skeet-sidebar {
      float: left;
      width: 104px;                    /* 80px * 1.3 */
      background-color: #171717;
      border-right: 1px solid #2f2f2f;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 16px;               /* 12px * 1.3 */
    }

    .skeet-sidebar button {
      width: 83px;                     /* 64px * 1.3 ≈ 83 */
      height: 42px;                    /* 32px * 1.3 ≈ 42 */
      margin: 8px 0;                   /* 6px * 1.3 ≈ 8 */
      background-color: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;
      color: #888888;
      font-size: 17px;                 /* 13px * 1.3 ≈ 17 */
      font-weight: 500;
    }

    .skeet-sidebar button:hover,
    .skeet-sidebar button.active {
      background-color: #2f2f2f;
      color: #00b4ff;
      border-radius: 4px;
    }

    /* ── Content Area (Remaining ≈390px) ────────────────────────────────────────── */
    .skeet-content {
      margin-left: 104px;              /* leave room for sidebar */
      padding: 21px;                   /* 16px * 1.3 ≈ 21 */
      box-sizing: border-box;
    }

    /* Hide all sections by default; only the “.active” one displays */
    .skeet-section {
      display: none;
    }
    .skeet-section.active {
      display: block;
    }

    .skeet-content .section-title {
      font-size: 21px;                 /* 16px * 1.3 ≈ 21 */
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 13px;             /* 10px * 1.3 ≈ 13 */
    }

    /* ── Section Header ───────────────────────────────────────────────────────── */
    .skeet-section .header {
      font-size: 18px;                 /* 14px * 1.3 ≈ 18 */
      font-weight: 500;
      margin-bottom: 10px;             /* 8px * 1.3 ≈ 10 */
      color: #e0e0e0;
    }

    /* ── Toggle Labels (Checkbox + Text) ───────────────────────────────────────── */
    .skeet-toggle-label {
      display: flex;
      align-items: center;
      margin-bottom: 10px;             /* 8px * 1.3 ≈ 10 */
      cursor: pointer;
    }
    .skeet-toggle-label input[type="checkbox"] {
      width: 18px;                     /* 14px * 1.3 ≈ 18 */
      height: 18px;                    /* 14px * 1.3 ≈ 18 */
      margin-right: 10px;              /* 8px * 1.3 ≈ 10 */
      accent-color: #00b4ff;
      cursor: pointer;
      outline: none;
    }
    .skeet-toggle-label span {
      font-size: 17px;                 /* 13px * 1.3 ≈ 17 */
      color: #e0e0e0;
    }

    /* ── Slider (Range Input) ─────────────────────────────────────────────────── */
    .skeet-slider-container {
      display: flex;
      align-items: center;
      margin-bottom: 15px;             /* 12px * 1.3 ≈ 15 */
    }
    .skeet-slider-container span {
      margin-right: 10px;              /* 8px * 1.3 ≈ 10 */
      font-size: 16px;                 /* 12px * 1.3 ≈ 16 */
      color: #cccccc;
      min-width: 91px;                 /* 70px * 1.3 ≈ 91 */
    }
    .skeet-slider {
      flex: 1;
      -webkit-appearance: none;
      width: 100%;
      height: 5px;                     /* 4px * 1.3 ≈ 5 */
      background: #2f2f2f;
      border-radius: 3px;
      cursor: pointer;
      outline: none;
    }
    .skeet-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;                     /* 12px * 1.3 ≈ 16 */
      height: 16px;                    /* 12px * 1.3 ≈ 16 */
      border-radius: 50%;
      background: #00b4ff;
      border: 1px solid #1b1b1b;
      cursor: pointer;
      margin-top: -5px;                /* center thumb (≈ half the thumb height) */
    }
    .skeet-slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #00b4ff;
      border: 1px solid #1b1b1b;
      cursor: pointer;
    }

    /* ── Buttons (Load/Save/Stack etc.) ───────────────────────────────────────── */
    .skeet-button {
      display: inline-block;
      background-color: #2f2f2f;
      color: #e0e0e0;
      font-size: 15px;                 /* 12px * 1.3 ≈ 15 */
      padding: 8px 16px;               /* 6px*1.3≈8  & 12px*1.3≈16 */
      margin-top: 8px;                 /* 6px * 1.3 ≈ 8 */
      border: 1px solid #3f3f3f;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }
    .skeet-button:hover {
      background-color: #3f3f3f;
      border-color: #5f5f5f;
    }
    .skeet-button:active {
      background-color: #5f5f5f;
      border-color: #7f7f7f;
    }

    /* ── Radio Buttons for Farming Priority ───────────────────────────────────── */
    .skeet-radio-group {
      margin-bottom: 10px; /* some spacing */
    }
    .skeet-radio-label {
      display: flex;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;
      font-size: 17px; /* 13px * 1.3 */
      color: #e0e0e0;
    }
    .skeet-radio-label input[type="radio"] {
      margin-right: 8px;
      accent-color: #00b4ff;
      cursor: pointer;
      outline: none;
    }

    /* ── Focus Ring for Keyboard Navigation ──────────────────────────────────── */
    .skeet-menu input:focus-visible,
    .skeet-menu button:focus-visible {
      outline: 2px solid #00b4ff;
      outline-offset: 1px;
    }
  `;
  document.head.appendChild(styleEl);

  menuContainer = document.createElement("div");
  menuContainer.classList.add("skeet-menu");

  const dragHandle = document.createElement("div");
  dragHandle.classList.add("skeet-drag-handle");
  dragHandle.innerText = "Skid Ware";
  menuContainer.appendChild(dragHandle);
  const sidebar = document.createElement("div");
  sidebar.classList.add("skeet-sidebar");

  const tabs = [
    { id: "tab-spin",    label: "Spin"    },
    { id: "tab-aim",     label: "Aim"     },
    { id: "tab-farm",    label: "Farm"    },
    { id: "tab-visuals", label: "Visuals" },
  ];

  tabs.forEach((t, idx) => {
    const btn = document.createElement("button");
    btn.id = t.id + "-btn";
    btn.innerText = t.label;
    btn.title = t.label;
    if (idx === 0) btn.classList.add("active");
    btn.addEventListener("click", () => switchTab(t.id));
    sidebar.appendChild(btn);
  });
  menuContainer.appendChild(sidebar);

  const content = document.createElement("div");
  content.classList.add("skeet-content");
  const spinSection = document.createElement("div");
  spinSection.id = "tab-spin";
  spinSection.classList.add("skeet-section", "active"); 

  const spinTitle = document.createElement("div");
  spinTitle.classList.add("section-title");
  spinTitle.innerText = "Spinner Settings:";
  spinSection.appendChild(spinTitle);

  const spinHeader = document.createElement("div");
  spinHeader.classList.add("header");
  spinHeader.innerText = "• Enable / Disable Spinner:";
  spinSection.appendChild(spinHeader);

  const spinToggleLabel = document.createElement("label");
  spinToggleLabel.classList.add("skeet-toggle-label");
  const spinCheckbox = document.createElement("input");
  spinCheckbox.type = "checkbox";
  spinCheckbox.id = "spinner-checkbox";
  spinCheckbox.checked = isSpinning;
  const spinLabelText = document.createElement("span");
  spinLabelText.innerText = "Enable Spinner";
  spinToggleLabel.appendChild(spinCheckbox);
  spinToggleLabel.appendChild(spinLabelText);
  spinSection.appendChild(spinToggleLabel);

  spinCheckbox.addEventListener("change", function () {
    isSpinning = this.checked;
    if (window.extern) {
      window.extern.inGameNotification(
        isSpinning ? "Spinner: ON" : "Spinner: OFF",
        0xF533FF
      );
    }
  });

  const spinSpeedHeader = document.createElement("div");
  spinSpeedHeader.classList.add("header");
  spinSpeedHeader.innerText = "• Spin Speed:";
  spinSection.appendChild(spinSpeedHeader);

  const spinSpeedContainer = document.createElement("div");
  spinSpeedContainer.classList.add("skeet-slider-container");
  const speedLabelText = document.createElement("span");
  speedLabelText.innerText = `Speed: ${spinSpeed.toFixed(2)}`;
  const spinSlider = document.createElement("input");
  spinSlider.type = "range";
  spinSlider.min = "0";
  spinSlider.max = "2";
  spinSlider.step = "0.01";
  spinSlider.value = spinSpeed.toString();
  spinSlider.classList.add("skeet-slider");

  spinSlider.addEventListener("input", (ev) => {
    spinSpeed = parseFloat(ev.target.value);
    speedLabelText.innerText = `Speed: ${spinSpeed.toFixed(2)}`;
  });
  ["mousedown", "mousemove", "mouseup", "touchstart", "touchmove", "touchend"].forEach((evt) => {
    spinSlider.addEventListener(evt, (e) => e.stopPropagation(), { capture: true, passive: false });
  });

  spinSpeedContainer.appendChild(speedLabelText);
  spinSpeedContainer.appendChild(spinSlider);
  spinSection.appendChild(spinSpeedContainer);

  content.appendChild(spinSection);

  const aimSection = document.createElement("div");
  aimSection.id = "tab-aim";
  aimSection.classList.add("skeet-section");

  const aimTitle = document.createElement("div");
  aimTitle.classList.add("section-title");
  aimTitle.innerText = "Aimbot Settings:";
  aimSection.appendChild(aimTitle);

  const aimHeader = document.createElement("div");
  aimHeader.classList.add("header");
  aimHeader.innerText = "• Enable / Disable Aimbot:";
  aimSection.appendChild(aimHeader);

  const aimToggleLabel = document.createElement("label");
  aimToggleLabel.classList.add("skeet-toggle-label");
  const aimCheckbox = document.createElement("input");
  aimCheckbox.type = "checkbox";
  aimCheckbox.id = "aimbot-checkbox";
  aimCheckbox.checked = isAimbotActive;
  const aimLabelText = document.createElement("span");
  aimLabelText.innerText = "Enable Aimbot";
  aimToggleLabel.appendChild(aimCheckbox);
  aimToggleLabel.appendChild(aimLabelText);
  aimSection.appendChild(aimToggleLabel);

  aimCheckbox.addEventListener("change", function () {
    isAimbotActive = this.checked;
    if (window.extern) {
      window.extern.inGameNotification(
        isAimbotActive ? "Aimbot: ON" : "Aimbot: OFF",
        0xF533FF
      );
    }
  });

  const stackHeader = document.createElement("div");
  stackHeader.classList.add("header");
  stackHeader.innerText = "• Manual Stack (Hunter/Predator):";
  aimSection.appendChild(stackHeader);

  const stackButton = document.createElement("button");
  stackButton.innerText = "Stack Bullets";
  stackButton.classList.add("skeet-button");
  stackButton.addEventListener("click", () => {
    if (["Hunter", "Predator"].includes(playerTank)) {
      stack();
      window.extern &&
        window.extern.inGameNotification("Stacking Bullets...", 0xF533FF);
    } else {
      window.extern &&
        window.extern.inGameNotification("Not Hunter/Predator", 0xF533FF);
    }
  });
  aimSection.appendChild(stackButton);

  content.appendChild(aimSection);

  const farmSection = document.createElement("div");
  farmSection.id = "tab-farm";
  farmSection.classList.add("skeet-section");

  const farmTitle = document.createElement("div");
  farmTitle.classList.add("section-title");
  farmTitle.innerText = "AutoFarm:";
  farmSection.appendChild(farmTitle);

  const farmHeader = document.createElement("div");
  farmHeader.classList.add("header");
  farmHeader.innerText = "• Enable / Disable AutoFarm:";
  farmSection.appendChild(farmHeader);

  const farmToggleLabel = document.createElement("label");
  farmToggleLabel.classList.add("skeet-toggle-label");
  const farmCheckbox = document.createElement("input");
  farmCheckbox.type = "checkbox";
  farmCheckbox.id = "autofarm-checkbox";
  farmCheckbox.checked = isAutoFarm;
  const farmLabelText = document.createElement("span");
  farmLabelText.innerText = "Enable AutoFarm";
  farmToggleLabel.appendChild(farmCheckbox);
  farmToggleLabel.appendChild(farmLabelText);
  farmSection.appendChild(farmToggleLabel);

  farmCheckbox.addEventListener("change", function () {
    isAutoFarm = this.checked;
    if (window.extern) {
      window.extern.inGameNotification(
        isAutoFarm ? "AutoFarm: ON" : "AutoFarm: OFF",
        0xF533FF
      );
    }
  });

  const priorityContainer = document.createElement("div");
  priorityContainer.classList.add("skeet-radio-group");
  const priorityLabel = document.createElement("div");
  priorityLabel.classList.add("header");
  priorityLabel.innerText = "• Farming Priority:";
  farmSection.appendChild(priorityLabel);

  const pentRadioLabel = document.createElement("label");
  pentRadioLabel.classList.add("skeet-radio-label");
  const pentRadio = document.createElement("input");
  pentRadio.type = "radio";
  pentRadio.name = "farm-priority";
  pentRadio.id = "farm-priority-pentagon";
  pentRadio.value = "pentagon";
  pentRadio.checked = (farmPriority === "pentagon");
  const pentLabelText = document.createElement("span");
  pentLabelText.innerText = "Prioritize Pentagons";
  pentRadioLabel.appendChild(pentRadio);
  pentRadioLabel.appendChild(pentLabelText);
  priorityContainer.appendChild(pentRadioLabel);

  pentRadio.addEventListener("change", function () {
    if (this.checked) {
      farmPriority = "pentagon";
      if (window.extern) {
        window.extern.inGameNotification("FarmPriority: Pentagons", 0xF533FF);
      }
    }
  });
  const sqRadioLabel = document.createElement("label");
  sqRadioLabel.classList.add("skeet-radio-label");
  const sqRadio = document.createElement("input");
  sqRadio.type = "radio";
  sqRadio.name = "farm-priority";
  sqRadio.id = "farm-priority-square";
  sqRadio.value = "square";
  sqRadio.checked = (farmPriority === "square");
  const sqLabelText = document.createElement("span");
  sqLabelText.innerText = "Prioritize Squares";
  sqRadioLabel.appendChild(sqRadio);
  sqRadioLabel.appendChild(sqLabelText);
  priorityContainer.appendChild(sqRadioLabel);

  sqRadio.addEventListener("change", function () {
    if (this.checked) {
      farmPriority = "square";
      if (window.extern) {
        window.extern.inGameNotification("FarmPriority: Squares", 0xF533FF);
      }
    }

  });
  const triRadioLabel = document.createElement("label");
  triRadioLabel.classList.add("skeet-radio-label");
  const triRadio = document.createElement("input");
  triRadio.type = "radio";
  triRadio.name = "farm-priority";
  triRadio.id = "farm-priority-triangle";
  triRadio.value = "triangle";
  triRadio.checked = (farmPriority === "triangle");
  const triLabelText = document.createElement("span");
  triLabelText.innerText = "Prioritize Triangles";
  triRadioLabel.appendChild(triRadio);
  triRadioLabel.appendChild(triLabelText);
  priorityContainer.appendChild(triRadioLabel);

  triRadio.addEventListener("change", function () {
    if (this.checked) {
      farmPriority = "triangle";
      if (window.extern) {
        window.extern.inGameNotification("FarmPriority: Triangles", 0xF533FF);
      }
    }
  });

  farmSection.appendChild(priorityContainer);
  content.appendChild(farmSection);
  const visualsSection = document.createElement("div");
  visualsSection.id = "tab-visuals";
  visualsSection.classList.add("skeet-section");

  const visualsTitle = document.createElement("div");
  visualsTitle.classList.add("section-title");
  visualsTitle.innerText = "Debug / Visuals:";
  visualsSection.appendChild(visualsTitle);

  const visualsHeader = document.createElement("div");
  visualsHeader.classList.add("header");
  visualsHeader.innerText = "• Enable / Disable Debug Lines:";
  visualsSection.appendChild(visualsHeader);

  const visualsToggleLabel = document.createElement("label");
  visualsToggleLabel.classList.add("skeet-toggle-label");
  const visualsCheckbox = document.createElement("input");
  visualsCheckbox.type = "checkbox";
  visualsCheckbox.id = "debug-checkbox";
  visualsCheckbox.checked = isDebug;
  const visualsLabelText = document.createElement("span");
  visualsLabelText.innerText = "Enable Debug Lines";
  visualsToggleLabel.appendChild(visualsCheckbox);
  visualsToggleLabel.appendChild(visualsLabelText);
  visualsSection.appendChild(visualsToggleLabel);

  visualsCheckbox.addEventListener("change", function () {
    isDebug = this.checked;
    if (window.extern) {
      window.extern.inGameNotification(
        isDebug ? "Debug Lines: ON" : "Debug Lines: OFF",
        0xF533FF
      );
    }
  });
  const blackBgToggleLabel = document.createElement("label");
  blackBgToggleLabel.classList.add("skeet-toggle-label");
  const blackBgCheckbox = document.createElement("input");
  blackBgCheckbox.type = "checkbox";
  blackBgCheckbox.id = "blackbg-checkbox";
  blackBgCheckbox.checked = isBlackBg;
  const blackBgLabelText = document.createElement("span");
  blackBgLabelText.innerText = "Black Background (buggy on aim)";
  blackBgToggleLabel.appendChild(blackBgCheckbox);
  blackBgToggleLabel.appendChild(blackBgLabelText);
  visualsSection.appendChild(blackBgToggleLabel);

  blackBgCheckbox.addEventListener("change", function () {
    isBlackBg = this.checked;
    if (window.input && typeof window.input.set_convar === "function") {
        window.input.set_convar("ren_background_color",
                                isBlackBg ? "#000000" : "#CDCDCD");
    }
    if (window.extern) {
      window.extern.inGameNotification(
        isBlackBg ? "Black background: ON" : "Black background: OFF",
        0xF533FF
      );
    }
  });
  content.appendChild(visualsSection);
  menuContainer.appendChild(content);
  document.body.appendChild(menuContainer);
  function switchTab(activeId) {
    tabs.forEach((t) => {
      const btn = document.getElementById(t.id + "-btn");
      if (t.id === activeId) btn.classList.add("active");
      else btn.classList.remove("active");
    });
    tabs.forEach((t) => {
      const section = document.getElementById(t.id);
      if (t.id === activeId) section.classList.add("active");
      else section.classList.remove("active");
    });
  }
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  dragHandle.addEventListener("mousedown", function (e) {
    isDragging = true;
    const rect = menuContainer.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    e.preventDefault();
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    const newLeft = e.clientX - dragOffsetX;
    const newTop = e.clientY - dragOffsetY;
    menuContainer.style.left = newLeft + "px";
    menuContainer.style.top = newTop + "px";
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
}

// https://discord.gg/NBN3jgQDGe