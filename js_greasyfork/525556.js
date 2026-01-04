// ==UserScript==
// @name        Combat Helper
// @namespace   finally.idle-pixel.combathelper
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.1
// @author      finally
// @description Various combat helper stuff
// @downloadURL https://update.greasyfork.org/scripts/525556/Combat%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/525556/Combat%20Helper.meta.js
// ==/UserScript==

const TRIGGER_REFIGHT = "W";
const HELPER_DIV = document.createElement("div");
HELPER_DIV.id = "combat-helper";
HELPER_DIV.innerHTML = "Wait";
HELPER_DIV.style = `
  display: none;
  position: fixed;
  top: 0;
  left: 50%;
  background: white;
  border: 5px solid black;
  padding: 20px;
`;
document.body.appendChild(HELPER_DIV);

document.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() !== TRIGGER_REFIGHT.toLowerCase()) return;

  let collectAndFight = document.querySelector(".modal.show #modal-loot-collect-and-fight");
  if (collectAndFight) {
    collectAndFight.click();
  }
});

function heal() {
  HELPER_DIV.innerHTML = "Q";
  HELPER_DIV.style.background = "green";
}
function fire() {
  HELPER_DIV.innerHTML = "W";
  HELPER_DIV.style.background = "red";
}
function reflect() {
  HELPER_DIV.innerHTML = "E";
  HELPER_DIV.style.background = "yellow";
}
function invis() {
  HELPER_DIV.innerHTML = "R";
  HELPER_DIV.style.background = "grey";
}
function wait() {
  HELPER_DIV.innerHTML = "Wait";
  HELPER_DIV.style.background = "white";
}
function rainPot() {
  HELPER_DIV.innerHTML = "RAIN POT";
  HELPER_DIV.style.background = "blue";
}

let charge = false;
function guardian_two() {
  if (window.var_combat_countdown_timer > 0 && window.var_fire_cooldown <= 1) {
    fire();
    return;
  }

  if (window.var_guaridan_two_rain == 2 && window.var_invisibility_cooldown <= 0) { //mud rain, cast invis
    invis();
    return;
  }

  if (window.var_rain_potion > 0 && var_rain_potion_timer <= 0) {
    rainPot();
    return;
  }

  if (window.var_hp <= 15) {
    heal();
    return;
  }

  if (window.var_reflect_cooldown <= 1) {
    reflect();
    return;
  }

  wait();
}

function chargestrat() {
  if (charge && window.var_reflect_on == 0 && window.var_hero_invisibile == 0) {
    if (window.var_reflect_cooldown <= 1) {
      reflect();
      return;
    }

    if (window.var_invisibility_cooldown <= 1) {
      invis();
      return;
    }
  }

  if (window.var_combat_countdown_timer > 0 && window.var_fire_cooldown <= 1) {
    fire();
    return;
  }

  if (window.var_hp <= 15) {
    heal();
    return;
  }

  if (window.var_fire_cooldown <= 1) {
    fire();
    return;
  }

  wait();
}

function defaultstrat() {
  if (window.var_combat_countdown_timer > 0 && window.var_fire_cooldown <= 1) {
    fire();
    return;
  }

  if (window.var_hp <= 15) {
    heal();
    return;
  }

  if (window.var_reflect_cooldown <= 1) {
    reflect();
    return;
  }

  if (window.var_fire_cooldown <= 1) {
    fire();
    return;
  }

  wait();
}

let currentMonster = null;
function combatLoop() {
  if (!Combat.in_combat()) {
    HELPER_DIV.style.display = "none";
    return;
  }
  HELPER_DIV.style.display = "";

  if (currentMonster != window.var_monster_name) {
    charge = false;
    currentMonster = window.var_monster_name;
  }

  switch (window.var_monster_name) {
    case "guardian_two":
      guardian_two();
      break;
    case "reaper":
      chargestrat();
      break;
    default:
      defaultstrat();
      break;
  }
}
setInterval(combatLoop, 200);

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
  window.websocket.connected_socket.addEventListener("message", (message) => {
    if (message.data.startsWith("ANIMATE_MONSTER_SPRITE") && message.data.indexOf("charge_animation") != -1) {
      charge = true;
    }
    if (message.data.startsWith("HITSPLAT_ON_MONSTER")) {
      charge = false;
    }
  });
});