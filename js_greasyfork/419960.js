// ==UserScript==
// @name         Melvor offline cap remover
// @version      0.3.0
// @description  Removes 12hr offline cap
// @author       8992
// @match        https://*.melvoridle.com/*
// @exclude      https://wiki.melvoridle.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/419960/Melvor%20offline%20cap%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/419960/Melvor%20offline%20cap%20remover.meta.js
// ==/UserScript==

let times = null;
let cloudLoaded = false;

let loadCheckInterval = setInterval(() => {
  if (isLoaded && !currentlyCatchingUp && !modalIsOpen) {
    clearInterval(loadCheckInterval);
    extraOffline();
  }
}, 200);

function extraOffline() {
  let offlineData = JSON.parse(window.localStorage.getItem("12hr"));
  if (offlineData != null) {
    //remove limit from updateOffline function then overwrite
    patchCode(updateOffline, /> *43200000/, "== 43200000");
    //"fix" issue with sample_from_binomial
    patchCode(
      sample_from_binomial,
      /(let binomial[^;]+;)/,
      "$1if (binomial.length > numberTrials) return Math.floor(numberTrials * chance);"
    );
    offlineData.timestamp = Math.min(new Date().getTime(), offlineData.timestamp + 43200000);
    console.log(
      `Calculating additional ${Math.floor(
        (new Date().getTime() - offlineData.timestamp) / 1000 / 60 / 60
      )}hrs of offline time`
    );
    window.offline = offlineData;
    offlinePause = true;
    pauseOfflineAction(offline.skill);
    offlineCatchup();
    offlinePause = false;
    window.localStorage.removeItem("12hr");
  }
}

function patchCode(code, match, replacement) {
  const codeString = code
    .toString()
    .replace(match, replacement)
    .replace(/^function (\w+)/, "window.$1 = function");
  eval(codeString);
}

setTimeout(() => {
  //fetch offline save data
  times = {
    0: ["", "-1-", "-2-", "-3-", "-4-"].map((a) => getItem("MI-A04" + a + "offline")),
    1: [],
  };

  const _toggleCharacterSelectionView = toggleCharacterSelectionView;
  window.toggleCharacterSelectionView = () => {
    if (!cloudLoaded) {
      for (let i = 0; i < 5; i++) {
        if (playFabSaves[i] !== null) {
          times[1][i] = getItemFromSave(playFabSaves[i], "offline");
        } else if (storedCloudSaves[i] !== null) {
          times[1][i] = getItemFromSave(storedCloudSaves[i], "offline");
        } else times[1][i] = null;
      }
      cloudLoaded = true;
    }
    _toggleCharacterSelectionView();
  };

  const _selectCharacter = selectCharacter;
  window.selectCharacter = (char, confirmed = false) => {
    if (confirmed || !connectedToCloud) {
      let offline = times[currentView][char];
      if (
        offline != null &&
        typeof offline == "object" &&
        typeof offline.timestamp == "number" &&
        new Date().getTime() - offline.timestamp > 43200000
      ) {
        window.localStorage.setItem("12hr", JSON.stringify(offline));
      } else {
        window.localStorage.removeItem("12hr");
      }
    }
    _selectCharacter(char, confirmed);
  };
}, 100);
