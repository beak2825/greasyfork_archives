// ==UserScript==
// @name         Bonk.io abilities mode
// @description  Adds a custom Abilities mode to bonk.io
// @version      0.1
// @author       kklkkj
// @license      MIT
// @namespace    https://github.com/kklkkj/
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438108/Bonkio%20abilities%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/438108/Bonkio%20abilities%20mode.meta.js
// ==/UserScript==

/*
  Usable with:
  https://greasyfork.org/en/scripts/433861-code-injector-bonk-io
*/

const injectorName = "AbilitiesMod";

const s = {};
window.bonkAbilitiesModeMod = s;

function injector(bonkCode) {
  let src = bonkCode;

  let prevSrc = src;
  function checkSrcChange() {
    if (src == prevSrc) throw new Error("src didn't change");
    prevSrc = src;
  }

  // Add mode to modes list and get modes list
  src = src.replace(
    `forceTeamCount:2,editorCanTarget:false};`,
    `$& P1R[43]["modes"]["abx"] = {
      lobbyName: "Abilities",
      gameStartName: "ABILITIES",
      lobbyDescription: "Each player can be in a different mode",
      tutorialTitle: "Abilities mode",
      tutorialText: "abilities",
      forceTeams: false,
      forceTeamCount: null,
      editorCanTarget: false
    };
    window.bonkAbilitiesModeMod.modesList=P1R[43]["modes"];
    P1R[43]["lobbyModes"].push("abx");
  `
  );
  checkSrcChange();

  /*

    For loop in step function

    for (O7R[956] = 0; O7R[956] < O7R[0][0]["discs"]["length"]; O7R[956]++) {
      if (O7R[0][0]["discs"][O7R[956]] && B1(O7R[956]) == false) {
        O7R[5][O7R[956]] = {
          a1a: O7R[0][0]["discs"][O7R[956]]["a1a"],
          team: O7R[0][0]["discs"][O7R[956]]["team"],
          extraVelX: 0,
          extraVelY: 0,
          tcd: O7R[0][0]["discs"][O7R[956]]["tcd"],
          ni: false
        };
   */

  // Change mode at the start of for loop
  src = src.replace(
    // `for(O7R[956]=0;O7R[956] < O7R[0][0][O7R[8][41]][O7R[8][47]];O7R[956]++){if(O7R[0][0][O7R[8][41]][O7R[956]] && B1(O7R[956]) == false){`,
    `ni:false};`,
    `$& ;\
if(O7R[0][4]["mo"] == "abx"){\
O7R[0][4]["mo"] = O7R[0][4]["modeAbilities"][O7R[956]];\
O7R["abilitiesMode"] = true;\
}`
  );
  checkSrcChange();

  // Change mode back at the end of for loop
  src = src.replace(
    `O7R[5][O7R[956]][O7R[8][215]][O7R[8][216]](new P1R[2](O7R[0][0][O7R[8][41]][O7R[956]][O7R[8][108]],O7R[0][0][O7R[8][41]][O7R[956]][O7R[8][109]]));;}`,
    `$& ;if(O7R["abilitiesMode"]){\
O7R[0][4]["mo"] = "abx";\
};`
  );
  checkSrcChange();

  /*

    For loop in step function

    for (O7R[956] = 0; O7R[956] < O7R[5]["length"]; O7R[956]++) {
      if (O7R[5][O7R[956]] && O7R[0][1][O7R[956]] && O7R[0][0]["ftu"] == - 1) {

  */

  // Change mode at start of for loop
  src = src.replace(
    `for(O7R[956]=0;O7R[956] < O7R[5][O7R[8][47]];O7R[956]++){if(O7R[5][O7R[956]] && O7R[0][1][O7R[956]] && O7R[0][0][O7R[8][3]] == -1){`,
    `$& ;if(O7R["abilitiesMode"]){\
O7R[0][4]["mo"] = O7R[0][4]["modeAbilities"][O7R[956]];\
};`
  );
  checkSrcChange();

  // Change mode back at end of for loop
  src = src.replace(
    `O7R[25][n7R[2][101]](n7R[52]);}}}}`,
    `$& ;if(O7R["abilitiesMode"]){O7R[0][4]["mo"] = "abx";};`
  );
  checkSrcChange();

  /*

    For loop in step function

    for (O7R[956] = 0; O7R[956] < O7R[5]["length"]; O7R[956]++) {
      if (O7R[5][O7R[956]] && O7R[5][O7R[956]]["swing"]) {
        O7R[98] = O7R[0][0]["discs"][O7R[956]]["swing"];

  */

  // Change mode at start of for loop
  src = src.replace(
    `for(O7R[956]=0;O7R[956] < O7R[5][O7R[8][47]];O7R[956]++){if(O7R[5][O7R[956]] && O7R[5][O7R[956]][O7R[8][150]]){`,
    `$& ;if(O7R["abilitiesMode"]){\
O7R[0][4]["mo"] = O7R[0][4]["modeAbilities"][O7R[956]];\
};`
  );
  checkSrcChange();

  // Change mode at end of for loop
  src = src.replace(
    `for(O7R[182]=0;O7R[182] < O7R[0][0][O7R[8][127]][O7R[8][47]];O7R[182]++)`,
    `;if(O7R["abilitiesMode"]){O7R[0][4]["mo"] = "abx";};$&`
  );
  checkSrcChange();

  // Change mode in player renderer

  src = src.replace(
    `this[K5p[9][149]]=K5p[0][2];`,
    `$& ;\
if (this.gameSettings.mo == "abx") {
  this.gameSettings = JSON.parse(JSON.stringify(this.gameSettings));
  this.gameSettings.mo = this.gameSettings.modeAbilities[K5p[0][4]];
};`
  );
  checkSrcChange();

  // Get game settings and player names

  src = src.replace(
    `this[j0V[7][628]]=function(){return j0V[23];}`,
    `$&;\
window.bonkAbilitiesModeMod.getModeAbilities=\
() => { if(!j0V[23].modeAbilities) {j0V[23].modeAbilities=[];}; return j0V[23].modeAbilities; };\
window.bonkAbilitiesModeMod.getPlayerNames = \
() => j0V[44].map(u => {if(u) return u.userName});`
  );
  checkSrcChange();

  {
    // Lol
    const modeText = document.getElementById("newbonklobby_modetext");
    const settingsButton = document.createElement("div");

    new MutationObserver(() => {
      if (modeText.innerText == "Abilities") {
        settingsButton.style.visibility = "";
      } else {
        settingsButton.style.visibility = "hidden";
      }
    }).observe(modeText, { childList: true });

    document
      .getElementById("newbonklobby_settingsbox")
      .appendChild(settingsButton);
    const sbs = settingsButton.style;
    sbs.position = "absolute";
    sbs.backgroundImage = "url(../graphics/cog.png)";
    sbs.width = "24px";
    sbs.height = "24px";
    sbs.left = "80px";
    sbs.top = "42px";
    settingsButton.className = "brownButton brownButton_classic buttonShadow";

    const settingsContainer = document.createElement("div");
    settingsContainer.id = "bonkLobbyAbilitiesModeSettingsContainer";
    document.getElementById("newbonklobby").appendChild(settingsContainer);
    const scs = settingsContainer.style;
    scs.position = "absolute";
    scs.width = "70%";
    scs.height = "70%";
    scs.left = "15%";
    scs.top = "15%";
    scs.borderRadius = "7px";
    scs.visibility = "hidden";
    scs.backgroundColor = "#cfd8dc";
    scs.transition = "visibility 0.2s, opacity 0.2s";
    scs.outline = "3000px solid rgba(0,0,0,0.30)";
    settingsContainer.className = "windowShadow bt-primary-background";

    const boxTop = document.createElement("div");
    boxTop.className = "newbonklobby_boxtop newbonklobby_boxtop_classic";
    boxTop.innerText = "Abilities";
    settingsContainer.appendChild(boxTop);

    const elementContainer = document.createElement("div");
    elementContainer.className = "newbonklobby_elementcontainer";
    settingsContainer.appendChild(elementContainer);

    const closeButton = document.createElement("div");
    closeButton.className =
      "windowCloseButton brownButton brownButton_classic buttonShadow";
    settingsContainer.appendChild(closeButton);
    closeButton.onclick = () => {
      scs.visibility = "hidden";
      scs.opacity = "0";
    };

    settingsButton.onclick = () => {
      scs.visibility = "";
      scs.opacity = "1";
      elementContainer.innerHTML = "";
      const players = s.getPlayerNames();
      for (const i in players) {
        if (!players[i]) continue;
        const playerContainer = document.createElement("div");
        playerContainer.style.display = "flex";
        playerContainer.style.flexFlow = "row wrap";
        playerContainer.style.justifyContent = "space-between";
        playerContainer.style.padding = "2px 70px";
        const playerLabel = document.createElement("span");
        playerLabel.style.fontFamily = `"futurept_b1"`;
        playerLabel.innerText = players[i];
        playerContainer.appendChild(playerLabel);
        const modeDropdown = document.createElement("select");
        if (!s.getModeAbilities()[i]) {
          const noneSelected = document.createElement("option");
          noneSelected.innerText = "-";
          noneSelected.disabled = true;
          noneSelected.hidden = true;
          noneSelected.selected = true;
          modeDropdown.appendChild(noneSelected);
        }
        for (const mode in s.modesList) {
          if (["abx", "f"].includes(mode)) continue;
          const option = document.createElement("option");
          option.value = mode;
          option.innerText = s.modesList[mode].lobbyName;
          // It doesn't work with Death Arrows or Left Gravity
          option.disabled = ["ard", "lg"].includes(mode);
          if (s.getModeAbilities()[i] == mode) option.selected = true;
          modeDropdown.appendChild(option);
        }
        modeDropdown.onchange = () => {
          s.getModeAbilities()[i] = modeDropdown.value;
        };
        playerContainer.appendChild(modeDropdown);
        elementContainer.appendChild(playerContainer);
      }
    };

    const startButton = document.getElementById("newbonklobby_startbutton");
    new MutationObserver(() => {
      if (startButton.classList.contains("brownButtonDisabled")) {
        settingsButton.classList.add("brownButtonDisabled");
      } else {
        settingsButton.classList.remove("brownButtonDisabled");
      }
    }).observe(startButton, { attributeFilter: ["class"] });
  }

  console.log(`${injectorName} injector run`);
  return src;
}

if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push((bonkCode) => {
  try {
    return injector(bonkCode);
  } catch (error) {
    alert(`${injectorName} failed to load`);
    throw error;
  }
});
console.log(`${injectorName} injector loaded`);
