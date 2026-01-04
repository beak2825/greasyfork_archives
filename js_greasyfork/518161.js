// ==UserScript==
// @name        Animal Data Helper
// @namespace   finally.idle-pixel.animaldatahelper
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.4
// @author      finally
// @description Collects animal data to figure out T2/T3 odds
// @downloadURL https://update.greasyfork.org/scripts/518161/Animal%20Data%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/518161/Animal%20Data%20Helper.meta.js
// ==/UserScript==

(() => {
  return new Promise((resolve) => {
    function check() {
      if (window.websocket?.connected_socket) {
        resolve();
        return;
      }
      setTimeout(check, 200);
    }
    check();
  });
})().then(() => {
  let currentAnimals = [];
  let slaughterTier = null;
  let slaughterAnimal = null;
  let slaughterAmount = null;

  let slaughterForSpecificTrait = false;
  let slaughterIndefinitely = false;

  let oldSend = window.websocket.connected_socket.send;
  window.websocket.connected_socket.send = (message) => {
    if (message?.startsWith("SLAUGHTER_FOR_TIER_")) {
      let [type, data] = message.split("=");
      slaughterTier = type.split("_").reverse()[0];
      data = data.split("~");
      slaughterAnimal = data[0].split("_")[1];
      slaughterAmount = data[2];
      slaughterForSpecificTrait = false;
      if (data[1].split(",").length !== 12) slaughterForSpecificTrait = true;
      slaughterIndefinitely = false;
      if (slaughterTier == 0) slaughterIndefinitely = true;
    }
    else if (message?.startsWith("ACTIVATE_ANIMAL")) {
      slaughterIndefinitely = false;
      slaughterForSpecificTrait = false;
    }

    return oldSend.apply(window.websocket.connected_socket, [message]);
  };

  function handleAnimalData(raw) {
    if (slaughterIndefinitely || slaughterForSpecificTrait) return;

    let [type, ...data] = raw.split("=");
    data = data.join("=");
    data = data.split("~");

    let animalData = null;
    for (let i = 0; i < data.length; i += 2) {
      if (data[i] != "animal_data") continue;

      animalData = data[i+1];
      break;
    }
    if (!animalData) return;

    animalData = animalData.split("=");
    let firstRun = currentAnimals.length == 0;
    animalData.forEach(data => {
      data = data.split(",");
      if (currentAnimals.indexOf(data[0]) !== -1) return;
      currentAnimals.push(data[0]);

      if (firstRun) return;

      let type = data[1];
      let tier = data[3];
      let reproduced = window[`var_${type}_reproduced`] || 0;

      window.websocket.send(`CUSTOM=ava~ANIMAL2~${type},${tier},${reproduced},1`);
    });
  }

  function handleSlaughterData(data) {
    if (!data) return;
    if (!slaughterTier || !slaughterAnimal || !slaughterAmount) return;
    if (slaughterIndefinitely || slaughterForSpecificTrait) return;

    let success = data[1] !== undefined;
    let amount = ~~(data[1] || data[2]);
    let fails = success ? amount - 1 : amount;
    let reproduced = window[`var_${slaughterAnimal}_reproduced`] || 0;
    let failTier = slaughterTier == 2 ? 1 : 0;

    if (fails > 0) {
      window.websocket.send(`CUSTOM=ava~ANIMAL2~${slaughterAnimal},${failTier},${reproduced},${fails}`);
    }
  }

  window.websocket.connected_socket.addEventListener("message", (message) => {
    if (message.data.indexOf("animal_data") !== -1) {
      handleAnimalData(message.data);
    }

    handleSlaughterData(message.data.match(/OPEN_LOOT_DIALOGUE.*?(?:after\s*(\d+)\s*Kills|killed\s*(\d+)\s*Animals)/));
  });
});