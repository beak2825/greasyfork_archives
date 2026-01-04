// ==UserScript==
// @name         Chest Esp
// @namespace    http://tampermonkey.net/
// @version      3
// @description  see whats in the chests on gold quest
// @author       You
// @match        https://*.blooket.com/*
// @exclude      https://play.blooket.com/play
// @icon         https://res.cloudinary.com/blooket/image/upload/v1613003832/Blooks/redAstronaut.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466876/Chest%20Esp.user.js
// @updateURL https://update.greasyfork.org/scripts/466876/Chest%20Esp.meta.js
// ==/UserScript==

async function executeScript() {
  var e = Object.values(document.querySelector('body div[class*="camelCase"]'))[1].children[0]._owner["stateNode"];

  e.state.choices.forEach(({ text: e }, t) => {
    var s, t = document.querySelector(`div[class^='styles__choice${t+1}']`);

    if (t && !t.querySelector("div")) {
      s = document.createElement("div");
      s.style.color = "white";
      s.style.fontFamily = "Eczar";
      s.style.fontSize = "2em";
      s.style.display = "flex";
      s.style.justifyContent = "center";
      s.style.transform = "translateY(200px)";
      s.innerText = e;
      t.append(s);
    }
  });
}

setInterval(executeScript, 100);
