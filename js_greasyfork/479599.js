// ==UserScript==
// @name        Auto Cambiar skins
// @namespace   https://github.com/CryptoXSS/
// @version     1.0.2
// @author      CryptoXSS
// @match       *://gota.io/web/*
// @license MIT
// @description cambia de skins con la tecla "B" automaticamente, desactivar "Auto Respawn"
// @icon        https://i.imgur.com/ejxjYj4.gif
// @downloadURL https://update.greasyfork.org/scripts/479599/Auto%20Cambiar%20skins.user.js
// @updateURL https://update.greasyfork.org/scripts/479599/Auto%20Cambiar%20skins.meta.js
// ==/UserScript==



let interval;

document.addEventListener("keydown", function(event) {
  if (event.code === "KeyB") {
    if (!interval) {
      interval = setInterval(checkDisplay, 1500);
      alert("Activado");
    } else {
      clearInterval(interval);
      interval = null;
      alert("Desactivado");
    }
  }
});

const skins = ["n0t1", "n0t2", "n0t3", "n0t4", "bass", "tom", "error", "xzv3", "xzv2", "xzv4", "xzv5", "xzv6", "troll", "super", "error1", "anonymous", "Crypto", "lol", "Uruguay", "messi", "Colombia", "Venezuela", "Argentina", "brasil", "peru", "chile", "russia", "ukraine", "fargetta", "777", "luna1", "github", "123", "stopwar", "passddos", "pika", "pikachu", "illuminati"];
let currentSkin = 0;

function checkDisplay() {
  const mainElement = document.getElementById("main");
  const computedStyle = window.getComputedStyle(mainElement);
  if (computedStyle.display === "block") {
    changeSkin();
  }
}

function changeSkin() {
  console.log("Changing skin");
  document.getElementsByClassName("gota-input")[0].value = skins[currentSkin];
  currentSkin = (currentSkin + 1) % skins.length;
}
