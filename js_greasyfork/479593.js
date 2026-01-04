// ==UserScript==
// @name        New script - gota.io
// @namespace   Violentmonkey Scripts
// @match       https://gota.io/web/
// @grant       none
// @version     1.0
// @author      -
// @description 7/29/2023, 8:52:32 PM
// @downloadURL https://update.greasyfork.org/scripts/479593/New%20script%20-%20gotaio.user.js
// @updateURL https://update.greasyfork.org/scripts/479593/New%20script%20-%20gotaio.meta.js
// ==/UserScript==


let intervalId = null;

function processKeyPress() {
  const playerName = document.querySelector("#context-name").innerText;

  // Mostrar el nombre del jugador en la consola
  console.log("Nombre del jugador:", playerName);

  document.querySelector("#menu-pu_pr").click();
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Y" || event.key === "y") {
    if (!intervalId) {
      
      intervalId = setInterval(processKeyPress, 1000); // Repetir cada 1000 ms (1 segundo)
    } else {
      // Detener el proceso si ya está en ejecución
      clearInterval(intervalId);
      intervalId = null;
    }
  }
});
