// ==UserScript==
// @name         MouseHunt - SP / FI Map Color Coder 2021
// @author       Tran Situ (tsitu) & Leppy
// @version      1.3.3
// @description  Color codes mice on SP / FI maps according to decorations // & cheese. Based off tsitu's work.
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @grant GM_setClipboard
// Most of the work comes from in59te's original sky pirate map color coder.
// Thanks Warden Slayer for adding in the support to copy 'sniper list' into the clipboard.
// Only added annotation for type of mice that are missing, as well as SP mice
// - For Guard, A for Appraiser, T for Tinkerer, G for Geologist, E for Empress
// - SP means SP protector
// - Par means paragon
// - HAI means HAI friend
// - * at LP means the SB+ mouse, i.e. CM
// @namespace https://greasyfork.org/users/967077
// @downloadURL https://update.greasyfork.org/scripts/455450/MouseHunt%20-%20SP%20%20FI%20Map%20Color%20Coder%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/455450/MouseHunt%20-%20SP%20%20FI%20Map%20Color%20Coder%202021.meta.js
// ==/UserScript==
const launchPadMice = [
  "Skydiver",
  "Sky Greaser",
  "Launchpad Labourer",
  "Cloud Miner",
];

const arcaneMice = [
  "Sky Glass Sorcerer",
  "Sky Glass Glazier",
  "Sky Dancer",
  "Sky Highborne",
  "Paragon of Arcane",
  "Sky Glider",
];

const forgottenMice = [
  "Spry Sky Explorer",
  "Spry Sky Seer",
  "Cumulost",
  "Spheric Diviner",
  "Paragon of Forgotten",
  "Forgotten Elder",
];

const hydroMice = [
  "Nimbomancer",
  "Sky Surfer",
  "Cute Cloud Conjurer",
  "Mist Maker",
  "Paragon of Water",
  "Cloud Strider",
];

const shadowMice = [
  "Astrological Astronomer",
  "Overcaster",
  "Stratocaster",
  "Shadow Sage",
  "Paragon of Shadow",
  "Zealous Academic",
];

const physicalMice = [
  "Ground Gavaleer",
  "Sky Swordsman",
  "Herc",
  "Sky Squire",
  "Paragon of Strength",
  "Glamorous Gladiator",
];

const draconicMice = [
  "Tiny Dragonfly",
  "Lancer Guard",
  "Dragonbreather",
  "Regal Spearman",
  "Paragon of Dragons",
  "Empyrean Javelineer",
];

const lawMice = [
  "Devious Gentleman",
  "Stack of Thieves",
  "Lawbender",
  "Agent M",
  "Paragon of the Lawless",
  "Aristo-Cat Burglar",
];

const tacticalMice = [
  "Worried Wayfinder",
  "Gyrologer",
  "Seasoned Islandographer",
  "Captain Cloudkicker",
  "Paragon of Tactics",
  "Rocketeer",
];

const pirateMice = [
  "Suave Pirate",
  "Cutthroat Pirate",
  "Cutthroat Cannoneer",
  "Scarlet Revenger",
  "Mairitime Pirate",
  "Admiral Cloudbeard",
  "Peggy the Plunderer",
];

const guardMice = [
  "Empyrean Appraiser",
  "Consumed Charm Tinkerer",
  "Empyrean Geologist",
  "Empyrean Empress",
];

const richMice = ["Richard the Rich", "Fortuitous Fool"];

const wardenMice = [
  "Warden of Rain",
  "Warden of Fog",
  "Warden of Frost",
  "Warden of Wind",
];

const spMaps = [
  "Sky Pirate Treasure Chest",
  "Rare Sky Pirate Treasure Chest",
  "Empyrean Sky Palace Treasure Chest",
  "Rare Empyrean Sky Palace Treasure Chest",
];

function sniperListForSinglePowerType(
  emoji,
  powerType,
  paragonAlias,
  SPAlias,
  SPName,
  count,
  bossCount,
  SPCount
) {
  let output = "";
  // Nothing to display if there is no mice with this power type.
  if (count > 0) {
    output = output + emoji + powerType;
    const fields = [];
    if (bossCount > 0) {
      let pnf = "";
      /*if (count - bossCount - SPCount > 0) {
                pnf = "Paragon & Friends "
            } else {
                pnf = "Paragon only "
            }*/

      if (paragonAlias != "") {
        pnf = pnf + "(" + paragonAlias + ") ";
      }
      fields.push(pnf + "$$$");
    } else {
      fields.push("---");
    }
    /*if (SPCount > 0) {
            fields.push("SP " + SPName + " $$")*/

    if (SPCount > 0) {
      //fields.push(SPAlias + " $$")
      fields.push(SPName + " $$");
    } else {
      fields.push(" --");
    }
    output = output + fields.join("  |  ");
  }
  return output;
}

function sniperListForMisc(
  pirateT1Count,
  pirateT2Count,
  pirateSPCount,
  richCount,
  richSPCount,
  guardAppraiserCount,
  guardTinkererCount,
  guardGeologistCount,
  guardEmpressCount
) {
  const entries = [];
  if (pirateSPCount > 0) {
    entries.push("Peggy $$");
  } else {
    if (pirateT2Count > 0) {
      entries.push("Pirate tier 2 $$");
    }
    if (pirateT1Count > 0) {
      entries.push("Pirate tier 1 $$");
    }
  }
  if (richCount - richSPCount > 0) {
    entries.push("Richard $$");
  }
  if (richSPCount > 0) {
    entries.push("Fool $$");
  }
  if (guardAppraiserCount > 0) {
    entries.push("Appraiser $$");
  }
  if (guardTinkererCount > 0) {
    entries.push("Tinkerer $$");
  }
  if (guardGeologistCount > 0) {
    entries.push("Geologist $$");
  }
  if (guardEmpressCount > 0) {
    entries.push("Empress $$");
  }

  let output = "";
  if (entries.length > 0) {
    output = output + entries.join("  |  ");
  }

  return output;
}

function sniperListForWardens(
  wardenRainCount,
  wardenFogCount,
  wardenFrostCount,
  wardenWindCount
) {
  const wardens = [];
  if (wardenRainCount > 0) {
    wardens.push("Rain");
  }
  if (wardenFogCount > 0) {
    wardens.push("Fog");
  }
  if (wardenFrostCount > 0) {
    wardens.push("Frost");
  }
  if (wardenWindCount > 0) {
    wardens.push("Wind");
  }

  let output = "";
  if (wardens.length > 0) {
    output = output + "Warden " + wardens.join("  |  ") + " $$ ea";
  }

  return output;
}

function sniperList(
  arcaneCount,
  arcaneHAICount,
  arcaneBossCount,
  arcaneSPCount,
  forgottenCount,
  forgottenHAICount,
  forgottenBossCount,
  forgottenSPCount,
  hydroCount,
  hydroHAICount,
  hydroBossCount,
  hydroSPCount,
  shadowCount,
  shadowHAICount,
  shadowBossCount,
  shadowSPCount,
  draconicCount,
  draconicHAICount,
  draconicBossCount,
  draconicSPCount,
  lawCount,
  lawHAICount,
  lawBossCount,
  lawSPCount,
  physicalCount,
  physicalHAICount,
  physicalBossCount,
  physicalSPCount,
  tacticalCount,
  tacticalHAICount,
  tacticalBossCount,
  tacticalSPCount,
  pirateT1Count,
  pirateT2Count,
  pirateSPCount,
  richCount,
  richSPCount,
  guardAppraiserCount,
  guardTinkererCount,
  guardGeologistCount,
  guardEmpressCount,
  wardenRainCount,
  wardenFogCount,
  wardenFrostCount,
  wardenWindCount,
  powerSPCount,
  powerBossCount
) {
  const argsArray = [
    [
      ":arcane:",
      "Arcane",
      "",
      "Glider",
      arcaneMice[5],
      arcaneCount,
      arcaneBossCount,
      arcaneSPCount,
    ],
    [
      ":forgotten:",
      "Forgotten",
      "",
      "Elder",
      forgottenMice[5],
      forgottenCount,
      forgottenBossCount,
      forgottenSPCount,
    ],
    [
      ":hydro:",
      "Hydro",
      "Water",
      "Strider",
      hydroMice[5],
      hydroCount,
      hydroBossCount,
      hydroSPCount,
    ],
    [
      ":shadow:",
      "Shadow",
      "",
      "Zealous",
      shadowMice[5],
      shadowCount,
      shadowBossCount,
      shadowSPCount,
    ],
    [
      ":draconic:",
      "Draconic",
      "Dragons",
      "Javelineer",
      draconicMice[5],
      draconicCount,
      draconicBossCount,
      draconicSPCount,
    ],
    [
      ":law:",
      "Law",
      "Lawless",
      "Aristocat",
      lawMice[5],
      lawCount,
      lawBossCount,
      lawSPCount,
    ],
    [
      ":physical:",
      "Physical",
      "Strength",
      "Gladiator",
      physicalMice[5],
      physicalCount,
      physicalBossCount,
      physicalSPCount,
    ],
    [
      ":tactical:",
      "Tactical",
      "",
      "Rocketeer",
      tacticalMice[5],
      tacticalCount,
      tacticalBossCount,
      tacticalSPCount,
    ],
  ];
  let textArray = ["LF Snipers        P&F | SP"];
  argsArray.forEach(function (arrayItem, index) {
    const thisText = sniperListForSinglePowerType(
      arrayItem[0],
      arrayItem[1],
      arrayItem[2],
      arrayItem[3],
      arrayItem[4],
      arrayItem[5],
      arrayItem[6],
      arrayItem[7]
    );
    if (thisText) {
      textArray.push(thisText);
    }
  });
  textArray.push(
    sniperListForMisc(
      pirateT1Count,
      pirateT2Count,
      pirateSPCount,
      richCount,
      richSPCount,
      guardAppraiserCount,
      guardTinkererCount,
      guardGeologistCount,
      guardEmpressCount
    )
  );
  if (textArray.length < 10) {
    textArray.push(
      sniperListForWardens(
        wardenRainCount,
        wardenFogCount,
        wardenFrostCount,
        wardenWindCount
      )
    );
  }
  const finalTable = textArray.join("\n");
  return finalTable;
}

function createSpan(
  color,
  spanStyle,
  label,
  count,
  SPCount,
  bossCount,
  HAICount,
  allSPCount,
  powerBossCount,
  powerHAICount
) {
  const span = document.createElement("span");
  span.style = "background-color: " + color + spanStyle;
  span.innerHTML = label + "<br>" + count;
  let spanExtra = "";
  if (allSPCount > 0) {
    spanExtra = spanExtra + "<br>";
    if (SPCount > 0) {
      spanExtra = spanExtra + "SP";
    }
  }
  if (powerBossCount > 0) {
    spanExtra = spanExtra + "<br>";
    if (bossCount > 0) {
      spanExtra = spanExtra + "Par";
    }
  }
  if (powerHAICount > 0) {
    spanExtra = spanExtra + "<br>";
    if (HAICount > 0) {
      spanExtra = spanExtra + "HAI";
    }
  }
  if (spanExtra != "") {
    span.innerHTML = span.innerHTML + spanExtra;
  }
  return span;
}

function colorize(copyFlag) {
  let launchPadColor = "#c97c49"; // brown
  let launchPadCount = 0;
  let launchPadSBCount = 0;
  let arcaneColor = "#0be496"; // light green
  let arcaneCount = 0;
  let arcaneHAICount = 0;
  let arcaneBossCount = 0;
  let arcaneSPCount = 0;
  let forgottenColor = "#338838"; // darker green
  let forgottenCount = 0;
  let forgottenHAICount = 0;
  let forgottenBossCount = 0;
  let forgottenSPCount = 0;
  let hydroColor = "#5d9fce"; // blue
  let hydroCount = 0;
  let hydroHAICount = 0;
  let hydroBossCount = 0;
  let hydroSPCount = 0;
  let shadowColor = "#8f75e2"; // purple
  let shadowCount = 0;
  let shadowHAICount = 0;
  let shadowBossCount = 0;
  let shadowSPCount = 0;
  let draconicColor = "#f06a60"; // red
  let draconicCount = 0;
  let draconicHAICount = 0;
  let draconicBossCount = 0;
  let draconicSPCount = 0;
  let lawColor = "#f9a645"; // orange
  let lawCount = 0;
  let lawHAICount = 0;
  let lawBossCount = 0;
  let lawSPCount = 0;
  let physicalColor = "#5ae031"; // green;
  let physicalCount = 0;
  let physicalHAICount = 0;
  let physicalBossCount = 0;
  let physicalSPCount = 0;
  let tacticalColor = "#fff935"; // yellow
  let tacticalCount = 0;
  let tacticalHAICount = 0;
  let tacticalBossCount = 0;
  let tacticalSPCount = 0;
  let pirateColor = "#ECA4A6"; // pink
  let pirateCount = 0;
  let pirateT1Count = 0;
  let pirateT2Count = 0;
  let pirateSPCount = 0;
  let richColor = "#FFD700"; // gold
  let richCount = 0;
  let richSPCount = 0;
  let wardenColor = "ffffff"; // white
  let wardenCount = 0;
  let wardenRainCount = 0;
  let wardenFogCount = 0;
  let wardenFrostCount = 0;
  let wardenWindCount = 0;
  let guardColor = "#85C1E9"; // light blue
  let guardCount = 0;
  let guardAppraiserCount = 0;
  let guardTinkererCount = 0;
  let guardGeologistCount = 0;
  let guardEmpressCount = 0;

  let powerHAICount = 0;
  let powerBossCount = 0;
  let powerSPCount = 0;
  let allSPCount = 0;
  const greyColor = "#949494";

  const isChecked =
    localStorage.getItem("highlightPref") === "uncaught-only" ? true : false;
  const isCheckedStr = isChecked ? "checked" : "";

  if (
    document.querySelectorAll(".treasureMapView-goals-group-goal").length === 0
  ) {
    return;
  }

  document
    .querySelectorAll(".treasureMapView-goals-group-goal")
    .forEach((el) => {
      el.querySelector("span").style = "color: black; font-size: 11px;";

      const mouseName = el.querySelector(
        ".treasureMapView-goals-group-goal-name"
      ).textContent;

      if (guardMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = guardColor;
        if (el.className.indexOf(" complete ") < 0) {
          guardCount++;
          if (guardMice.indexOf(mouseName) == 0) {
            guardAppraiserCount++;
          } else if (guardMice.indexOf(mouseName) == 1) {
            guardTinkererCount++;
          } else if (guardMice.indexOf(mouseName) == 2) {
            guardGeologistCount++;
          } else if (guardMice.indexOf(mouseName) == 3) {
            guardEmpressCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (arcaneMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = arcaneColor;
        if (el.className.indexOf(" complete ") < 0) {
          arcaneCount++;
          if (arcaneMice.indexOf(mouseName) == 3) {
            arcaneHAICount++;
          } else if (arcaneMice.indexOf(mouseName) == 4) {
            arcaneBossCount++;
          } else if (arcaneMice.indexOf(mouseName) == 5) {
            arcaneSPCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (forgottenMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = forgottenColor;
        if (el.className.indexOf(" complete ") < 0) {
          forgottenCount++;
          if (forgottenMice.indexOf(mouseName) == 3) {
            forgottenHAICount++;
          } else if (forgottenMice.indexOf(mouseName) == 4) {
            forgottenBossCount++;
          } else if (forgottenMice.indexOf(mouseName) == 5) {
            forgottenSPCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (hydroMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = hydroColor;
        if (el.className.indexOf(" complete ") < 0) {
          hydroCount++;
          if (hydroMice.indexOf(mouseName) == 3) {
            hydroHAICount++;
          } else if (hydroMice.indexOf(mouseName) == 4) {
            hydroBossCount++;
          } else if (hydroMice.indexOf(mouseName) == 5) {
            hydroSPCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (shadowMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = shadowColor;
        if (el.className.indexOf(" complete ") < 0) {
          shadowCount++;
          if (shadowMice.indexOf(mouseName) == 3) {
            shadowHAICount++;
          } else if (shadowMice.indexOf(mouseName) == 4) {
            shadowBossCount++;
          } else if (shadowMice.indexOf(mouseName) == 5) {
            shadowSPCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (draconicMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = draconicColor;
        if (el.className.indexOf(" complete ") < 0) {
          draconicCount++;
          if (draconicMice.indexOf(mouseName) == 3) {
            draconicHAICount++;
          } else if (draconicMice.indexOf(mouseName) == 4) {
            draconicBossCount++;
          } else if (draconicMice.indexOf(mouseName) == 5) {
            draconicSPCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (lawMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = lawColor;
        if (el.className.indexOf(" complete ") < 0) {
          lawCount++;
          if (lawMice.indexOf(mouseName) == 3) {
            lawHAICount++;
          } else if (lawMice.indexOf(mouseName) == 4) {
            lawBossCount++;
          } else if (lawMice.indexOf(mouseName) == 5) {
            lawSPCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (physicalMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = physicalColor;
        if (el.className.indexOf(" complete ") < 0) {
          physicalCount++;
          if (physicalMice.indexOf(mouseName) == 3) {
            physicalHAICount++;
          } else if (physicalMice.indexOf(mouseName) == 4) {
            physicalBossCount++;
          } else if (physicalMice.indexOf(mouseName) == 5) {
            physicalSPCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (tacticalMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = tacticalColor;
        if (el.className.indexOf(" complete ") < 0) {
          tacticalCount++;
          if (tacticalMice.indexOf(mouseName) == 3) {
            tacticalHAICount++;
          } else if (tacticalMice.indexOf(mouseName) == 4) {
            tacticalBossCount++;
          } else if (tacticalMice.indexOf(mouseName) == 5) {
            tacticalSPCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (pirateMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = pirateColor;
        if (el.className.indexOf(" complete ") < 0) {
          pirateCount++;
          if (pirateMice.indexOf(mouseName) == 6) {
            pirateSPCount++;
          } else if (pirateMice.indexOf(mouseName) < 3) {
            pirateT1Count++;
          } else {
            pirateT2Count++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (richMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = richColor;
        if (el.className.indexOf(" complete ") < 0) {
          richCount++;
          if (richMice.indexOf(mouseName) == 1) {
            richSPCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (wardenMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = wardenColor;
        if (el.className.indexOf(" complete ") < 0) {
          wardenCount++;
          if (wardenMice.indexOf(mouseName) == 0) {
            wardenRainCount++;
          } else if (wardenMice.indexOf(mouseName) == 1) {
            wardenFogCount++;
          } else if (wardenMice.indexOf(mouseName) == 2) {
            wardenFrostCount++;
          } else if (wardenMice.indexOf(mouseName) == 3) {
            wardenWindCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      } else if (launchPadMice.indexOf(mouseName) > -1) {
        el.style.backgroundColor = launchPadColor;
        if (el.className.indexOf(" complete ") < 0) {
          launchPadCount++;
          if (launchPadMice.indexOf(mouseName) == 3) {
            launchPadSBCount++;
          }
        } else {
          if (isChecked) el.style.backgroundColor = "white";
        }
      }
    });

  powerHAICount =
    arcaneHAICount +
    forgottenHAICount +
    hydroHAICount +
    shadowHAICount +
    draconicHAICount +
    lawHAICount +
    physicalHAICount +
    tacticalHAICount;
  powerBossCount =
    arcaneBossCount +
    forgottenBossCount +
    hydroBossCount +
    shadowBossCount +
    draconicBossCount +
    lawBossCount +
    physicalBossCount +
    tacticalBossCount;
  powerSPCount =
    arcaneSPCount +
    forgottenSPCount +
    hydroSPCount +
    shadowSPCount +
    draconicSPCount +
    lawSPCount +
    physicalSPCount +
    tacticalSPCount;
  allSPCount = powerSPCount + pirateSPCount + richSPCount;

  // Remove existing birthday Map related elements before proceeding
  document.querySelectorAll(".tsitu-birthday-map").forEach((el) => el.remove());

  const masterDiv = document.createElement("div");
  masterDiv.className = "tsitu-birthday-map";
  masterDiv.style =
    "display: inline-flex; margin-bottom: 10px; width: 100%; text-align: center; line-height: 1.5; overflow: hidden";
  const spanStyle =
    "; width: auto; padding: 5px; color: black; font-weight; font-size: 12.75px; text-shadow: 0px 0px 11px white";

  const guardSpan = document.createElement("span");
  guardSpan.style = "background-color: " + guardColor + spanStyle;
  guardSpan.innerHTML = "Guard<br>" + guardCount;
  let guardSpanExtra = "";
  if (guardAppraiserCount > 0) {
    guardSpanExtra = guardSpanExtra + "<br>Appr (G)";
  }
  if (guardTinkererCount > 0) {
    guardSpanExtra = guardSpanExtra + "<br>Tink (J)";
  }
  if (guardGeologistCount > 0) {
    guardSpanExtra = guardSpanExtra + "<br>Geo (S)";
  }
  if (guardEmpressCount > 0) {
    guardSpanExtra = guardSpanExtra + "<br>Emp";
  }
  if (guardSpanExtra != "") {
    guardSpan.innerHTML = guardSpan.innerHTML + guardSpanExtra;
  }

  const arcaneSpan = createSpan(
    arcaneColor,
    spanStyle,
    "Arc",
    arcaneCount,
    arcaneSPCount,
    arcaneBossCount,
    arcaneHAICount,
    allSPCount,
    powerBossCount,
    powerHAICount
  );
  const forgottenSpan = createSpan(
    forgottenColor,
    spanStyle,
    "Forg",
    forgottenCount,
    forgottenSPCount,
    forgottenBossCount,
    forgottenHAICount,
    allSPCount,
    powerBossCount,
    powerHAICount
  );
  const hydroSpan = createSpan(
    hydroColor,
    spanStyle,
    "Hydro",
    hydroCount,
    hydroSPCount,
    hydroBossCount,
    hydroHAICount,
    allSPCount,
    powerBossCount,
    powerHAICount
  );
  const shadowSpan = createSpan(
    shadowColor,
    spanStyle,
    "Shad",
    shadowCount,
    shadowSPCount,
    shadowBossCount,
    shadowHAICount,
    allSPCount,
    powerBossCount,
    powerHAICount
  );
  const draconicSpan = createSpan(
    draconicColor,
    spanStyle,
    "Draco",
    draconicCount,
    draconicSPCount,
    draconicBossCount,
    draconicHAICount,
    allSPCount,
    powerBossCount,
    powerHAICount
  );
  const lawSpan = createSpan(
    lawColor,
    spanStyle,
    "Law",
    lawCount,
    lawSPCount,
    lawBossCount,
    lawHAICount,
    allSPCount,
    powerBossCount,
    powerHAICount
  );
  const physicalSpan = createSpan(
    physicalColor,
    spanStyle,
    "Phy",
    physicalCount,
    physicalSPCount,
    physicalBossCount,
    physicalHAICount,
    allSPCount,
    powerBossCount,
    powerHAICount
  );
  const tacticalSpan = createSpan(
    tacticalColor,
    spanStyle,
    "Tac",
    tacticalCount,
    tacticalSPCount,
    tacticalBossCount,
    tacticalHAICount,
    allSPCount,
    powerBossCount,
    powerHAICount
  );
  const pirateSpan = createSpan(
    pirateColor,
    spanStyle,
    "Pirate",
    pirateCount,
    pirateSPCount,
    0,
    0,
    allSPCount,
    powerBossCount,
    powerHAICount
  );
  const richSpan = createSpan(
    richColor,
    spanStyle,
    "Rich",
    richCount,
    richSPCount,
    0,
    0,
    allSPCount,
    powerBossCount,
    powerHAICount
  );

  const wardenSpan = document.createElement("span");
  wardenSpan.style = "background-color: " + wardenColor + spanStyle;
  wardenSpan.innerHTML = "Ward<br>" + wardenCount;

  const launchPadSpan = document.createElement("span");
  launchPadSpan.style = "background-color: " + launchPadColor + spanStyle;
  launchPadSpan.innerHTML = "LP<br>" + launchPadCount;
  if (launchPadSBCount > 0) {
    launchPadSpan.innerHTML = launchPadSpan.innerHTML + "*";
  }

  // Highlight uncaught only feature
  const highlightLabel = document.createElement("label");
  highlightLabel.htmlFor = "tsitu-highlight-box";
  highlightLabel.innerText = "Highlight uncaught mice only";

  const highlightBox = document.createElement("input");
  highlightBox.type = "checkbox";
  highlightBox.name = "tsitu-highlight-box";
  highlightBox.style.verticalAlign = "middle";
  highlightBox.checked = isChecked;
  highlightBox.addEventListener("click", function () {
    if (highlightBox.checked) {
      localStorage.setItem("highlightPref", "uncaught-only");
    } else {
      localStorage.setItem("highlightPref", "all");
    }
    colorize();
  });

  const highlightDiv = document.createElement("div");
  highlightDiv.className = "tsitu-birthday-map";
  highlightDiv.style = "float: right; position: relative; z-index: 1";
  highlightDiv.appendChild(highlightBox);
  highlightDiv.appendChild(highlightLabel);

  const copySniperListLabel = document.createElement("label");
  copySniperListLabel.htmlFor = "tsitu-highlight-box";
  copySniperListLabel.innerText = "Copy Sniper List";
  if (copyFlag) {
    const snipeText = sniperList(
      arcaneCount,
      arcaneHAICount,
      arcaneBossCount,
      arcaneSPCount,
      forgottenCount,
      forgottenHAICount,
      forgottenBossCount,
      forgottenSPCount,
      hydroCount,
      hydroHAICount,
      hydroBossCount,
      hydroSPCount,
      shadowCount,
      shadowHAICount,
      shadowBossCount,
      shadowSPCount,
      draconicCount,
      draconicHAICount,
      draconicBossCount,
      draconicSPCount,
      lawCount,
      lawHAICount,
      lawBossCount,
      lawSPCount,
      physicalCount,
      physicalHAICount,
      physicalBossCount,
      physicalSPCount,
      tacticalCount,
      tacticalHAICount,
      tacticalBossCount,
      tacticalSPCount,
      pirateT1Count,
      pirateT2Count,
      pirateSPCount,
      richCount,
      richSPCount,
      guardAppraiserCount,
      guardTinkererCount,
      guardGeologistCount,
      guardEmpressCount,
      wardenRainCount,
      wardenFogCount,
      wardenFrostCount,
      wardenWindCount,
      powerSPCount,
      powerBossCount
    );
    GM_setClipboard(snipeText);
  }
  const copySniperListSpan = document.createElement("span");
  copySniperListSpan.className = "tsitu-birthday-map copnSniperList-span";
  const copySniperLisTextSpan = document.createElement("span");
  copySniperLisTextSpan.innerText = "Copy Sniper List";

  const copySniperListButton = document.createElement("button");
  copySniperListButton.className =
    "mousehuntActionButton tiny tsitu-birthday-map";
  copySniperListButton.style.cursor = "pointer";
  copySniperListButton.style.fontSize = "9px";
  copySniperListButton.style.padding = "2px";
  copySniperListButton.style.margin = "0px 5px 5px 10px";
  copySniperListButton.style.textShadow = "none";
  copySniperListButton.style.display = "inline-block";
  copySniperListButton.appendChild(copySniperLisTextSpan);

  copySniperListButton.addEventListener("click", function () {
    colorize("copySnipes");
  });

  copySniperListSpan.appendChild(copySniperListButton);

  // Assemble masterDiv
  if (guardCount > 0) {
    masterDiv.appendChild(guardSpan);
  }
  if (arcaneCount > 0) {
    masterDiv.appendChild(arcaneSpan);
  }
  if (forgottenCount > 0) {
    masterDiv.appendChild(forgottenSpan);
  }
  if (hydroCount > 0) {
    masterDiv.appendChild(hydroSpan);
  }
  if (shadowCount > 0) {
    masterDiv.appendChild(shadowSpan);
  }
  if (draconicCount > 0) {
    masterDiv.appendChild(draconicSpan);
  }
  if (lawCount > 0) {
    masterDiv.appendChild(lawSpan);
  }
  if (physicalCount > 0) {
    masterDiv.appendChild(physicalSpan);
  }
  if (tacticalCount > 0) {
    masterDiv.appendChild(tacticalSpan);
  }
  if (pirateCount > 0) {
    masterDiv.appendChild(pirateSpan);
  }
  if (richCount > 0) {
    masterDiv.appendChild(richSpan);
  }
  if (wardenCount > 0) {
    masterDiv.appendChild(wardenSpan);
  }
  if (launchPadCount > 0) {
    masterDiv.appendChild(launchPadSpan);
  }

  // Inject into DOM
  const insertEl = document.querySelector(
    ".treasureMapView-leftBlock .treasureMapView-block-content"
  );
  if (
    insertEl &&
    document.querySelector(
      ".treasureMapRootView-header-navigation-item.tasks.active"
    )
  ) {
    insertEl.insertAdjacentElement("afterbegin", highlightDiv);
    insertEl.insertAdjacentElement("afterbegin", masterDiv);
  }

  // Inject into DOM
  const insertE2 = document.querySelector(
    ".treasureMapView-leftBlock .treasureMapView-block-title"
  );
  if (
    insertE2 &&
    document.querySelector(
      ".treasureMapRootView-header-navigation-item.tasks.active"
    )
  ) {
    insertE2.insertAdjacentElement("beforeend", copySniperListSpan);
  }
}

// Listen to XHRs, opening a map always at least triggers board.php
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
  this.addEventListener("load", function () {
    const mapEl = document.querySelector(".treasureMapView-mapMenu-rewardName");
    if (mapEl) {
      const mapName = mapEl.textContent;
      if (mapName && spMaps.indexOf(mapName) > -1) {
        colorize();
      }
    }
  });
  originalOpen.apply(this, arguments);
};
