// ==UserScript==
// @name         Melvor anti-lag
// @version      0.3.1
// @description  Adjusts game speed to compensate for lag so that the original intervals match realtime
// @author       8992
// @match        https://*.melvoridle.com/*
// @exclude      https://wiki.melvoridle.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/421556/Melvor%20anti-lag.user.js
// @updateURL https://update.greasyfork.org/scripts/421556/Melvor%20anti-lag.meta.js
// ==/UserScript==

window.lagFactor = {};
window.intervalLog = {};
let lagKeyIncrement = 0;
const skillFunctions = [
  //cutTree,
  startAgility,
  //startCombat,
  createSummon,
  startFishing,
  burnLog,
  startCooking,
  mineRock,
  rockReset,
  startSmithing,
  pickpocket,
  startFletching,
  startCrafting,
  startRunecrafting,
  startHerblore,
  castMagic,
  loadNewEnemy,
  //attackPlayer,
  //regenerateHitpoints,
];

function patchCode(code, match, replacement) {
  const codeString = code
    .toString()
    .replace(match, replacement)
    .replace(/^function (\w+)/, "window.$1 = function");
  return codeString;
}

function editInterval(code, multithread = false) {
  const name = code.match(/(?<=^window\.)[^ =]+/)[0];
  const arr = code.split("setTimeout");
  let multi = "";
  if (multithread) {
    multi = `+ ${/^window[^(]+\(([^\s=,]+)/.exec(code)[1]}`;
  }
  //loop through array backwards to avoid problems with nested setTimeouts
  for (let i = arr.length - 1; i > 0; i--) {
    let b = 0;
    let index = 0;
    let found = -1;
    arr[i].replace(/./gs, (char) => {
      char == "(" ? b++ : char == ")" ? b-- : 0;
      if (found < 0 && b == 0) {
        found = index;
      }
      index++;
      return char;
    });
    //insert interval recording
    let part = arr[i].slice(0, found);
    const close = `recordInterval(KEY, false, null, "${name}"${multi}),`;
    if (part.includes(name)) {
      part = part.replace(
        new RegExp(`(?<!${close.replace(/([\(\)])/g, (m, $1) => `\\${$1}`)})(${name}\\()`, "g"),
        (m, $1) => `${close}${$1}`
      );
    } else {
      part = part.replace(/(}[^}]*$)/s, (m, $1) => `recordInterval(KEY, false, null, "${name}"${multi});${$1}`);
    }
    let edited =
      "setTimeout" +
      part.replace(/,([^,]*$)/s, (m, $1) => `,recordInterval(KEY, true, (${$1}), "${name}"${multi})`) +
      arr[i].slice(found);
    arr[i - 1] += edited;
  }
  return arr[0].replace("(KEY, true)", `(KEY, true, null, "${name}"${multi})`);
}

function recordInterval(KEY, open, baseInterval = null, thread) {
  if (open && baseInterval != null) {
    try {
      intervalLog[thread].timestamps[KEY].I = baseInterval;
      return baseInterval / lagFactor[thread];
    } catch {
      return baseInterval;
    }
  } else if (open) {
    try {
      intervalLog[thread].timestamps[KEY] = { T: new Date() };
    } catch {
      intervalLog[thread] = { timestamps: [], results: [] };
      intervalLog[thread].timestamps[KEY] = { T: new Date() };
      lagFactor[thread] = 1;
    }
  } else if (intervalLog[thread] != undefined && intervalLog[thread].timestamps[KEY] != undefined) {
    intervalLog[thread].results.push({
      T: new Date() - intervalLog[thread].timestamps[KEY].T,
      I: intervalLog[thread].timestamps[KEY].I,
    });
    delete intervalLog[thread].timestamps[KEY];
  }
}

function calcLag() {
  for (thread in intervalLog) {
    const sum = intervalLog[thread].results.reduce(
      (sum, a) => (a.T * a.I == 0 ? sum : { T: sum.T + a.T, I: sum.I + a.I }),
      { T: 0, I: 0 }
    );
    if (sum.T * sum.I == 0) continue;
    lagFactor[thread] = Math.min(1.5, Math.max(1, (lagFactor[thread] * sum.T) / sum.I));
    intervalLog[thread].results = [];
    intervalLog[thread].timestamps = [];
    lagKeyIncrement = 0;
    let s = lagFactor[thread] * 3600 - 3600;
    console.log(
      `[${thread}][${Math.round(sum.T - sum.I)}ms diff.(${(((sum.T - sum.I) / sum.T) * 100).toPrecision(
        2
      )}%)] Speedup adjusted to ${Number(lagFactor[thread].toPrecision(5))}, compensating for approx ${
        s >= 10 ? Math.round(s) : s.toPrecision(2)
      }s of lag per hour`
    );
  }
}

function loadScript() {
  let codeStrings = skillFunctions
    .map((a) => patchCode(a, /{/, `{let KEY = lagKeyIncrement++;recordInterval(KEY, true);`))
    .map((a, i) => editInterval(a, i < 1));
  codeStrings.forEach((a) => eval(a));
  setInterval(() => calcLag(), 120000);
}

let loadCheckInterval = setInterval(() => {
  if (skillFunctions.every((a) => a != undefined)) {
    clearInterval(loadCheckInterval);
    loadScript();
    console.log("Lag compensator loaded");
  }
}, 50);
