// ==UserScript==
// @name         Bonk.io abilities mode
// @description  Adds a custom Abilities mode to bonk.io
// @version      0.5
// @author       kklkkj
// @license      MIT
// @namespace    https://github.com/kklkkj/
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436179/Bonkio%20abilities%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/436179/Bonkio%20abilities%20mode.meta.js
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
    `$& v2k[10]["modes"]["abx"] = {
      lobbyName: "Abilities",
      gameStartName: "ABILITIES",
      lobbyDescription: "Each player can be in a different mode",
      tutorialTitle: "Abilities mode",
      tutorialText: "Each player can be in a different mode",
      forceTeams: false,
      forceTeamCount: null,
      editorCanTarget: false
    };
    window.bonkAbilitiesModeMod.modesList=v2k[10]["modes"];
    v2k[10]["lobbyModes"].push("abx");
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
if(T7k[0][4]["mo"] == "abx"){\
if(!T7k[0][4]["modeAbilities"]) T7k[0][4]["modeAbilities"]=[];\
T7k[0][4]["mo"] = T7k[0][4]["modeAbilities"][T7k[653]];\
T7k["abilitiesMode"] = true;\
}`
  );
  checkSrcChange();

  // Change mode back at the end of for loop
  src = src.replace(
    `T7k[4][T7k[653]][T7k[2][215]][T7k[2][216]](new v2k[1](T7k[0][0][T7k[2][41]][T7k[653]][T7k[2][108]],T7k[0][0][T7k[2][41]][T7k[653]][T7k[2][109]]));;}`,
    `$& ;if(T7k["abilitiesMode"]){\
T7k[0][4]["mo"] = "abx";\
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
    `for(T7k[653]=0;T7k[653] < T7k[4][T7k[2][47]];T7k[653]++){if(T7k[4][T7k[653]] && T7k[0][1][T7k[653]] && T7k[0][0][T7k[2][3]] == -1){`,
    `$& ;if(T7k["abilitiesMode"]){\
T7k[0][4]["mo"] = T7k[0][4]["modeAbilities"][T7k[653]];\
};`
  );
  checkSrcChange();

  // Change mode back at end of for loop
  src = src.replace(
    `E9(T7k[653],b7k[41][b7k[5][107]][b7k[5][138]]()[b7k[5][141]],b7k[12],b7k[17]);break;}}}})();};}}`,
    `$& ;if(T7k["abilitiesMode"]){T7k[0][4]["mo"] = "abx";};`
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
    `for(T7k[653]=0;T7k[653] < T7k[4][T7k[2][47]];T7k[653]++){if(T7k[4][T7k[653]] && T7k[4][T7k[653]][T7k[2][150]]){`,
    `$& ;if(T7k["abilitiesMode"]){\
T7k[0][4]["mo"] = T7k[0][4]["modeAbilities"][T7k[653]];\
};`
  );
  checkSrcChange();

  // Change mode at end of for loop
  src = src.replace(
    `for(T7k[826]=0;T7k[826] < T7k[0][0][T7k[2][127]][T7k[2][47]];T7k[826]++){`,
    `;if(T7k["abilitiesMode"]){T7k[0][4]["mo"] = "abx";};$&`
  );
  checkSrcChange();

  // Change mode in player renderer

  src = src.replace(
    `this[l1k[8][149]]=l1k[0][2];`,
    `$& ;\
if (this.gameSettings.mo == "abx") {
  this.gameSettings = JSON.parse(JSON.stringify(this.gameSettings));
  this.gameSettings.mo = this.gameSettings.modeAbilities[l1k[0][4]];
};`
  );
  checkSrcChange();

  // Get game settings and player names

  src = src.replace(
    `this[u6H[2][628]]=function(){G9b.w9b();return u6H[36];};`,
    `$&;\
window.bonkAbilitiesModeMod.getModeAbilities=\
() => { if(!u6H[36].modeAbilities) {u6H[36].modeAbilities=[];}; return u6H[36].modeAbilities; };\
window.bonkAbilitiesModeMod.getPlayerNames = \
() => u6H[44].map(u => {if(u) return u.userName});`
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
          if (["abx", "f", "p"].includes(mode)) continue;
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
