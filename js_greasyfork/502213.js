// ==UserScript==
// @name        Distance and Speed by Glyrrin
// @namespace   Violentmonkey Scripts
// @match       https://elgea.illyriad.co.uk/*
// @grant       none
// @version     1.6
// @author      Glyrrin
// @description 7/22/2024, 10:36:27 PM
// @downloadURL https://update.greasyfork.org/scripts/502213/Distance%20and%20Speed%20by%20Glyrrin.user.js
// @updateURL https://update.greasyfork.org/scripts/502213/Distance%20and%20Speed%20by%20Glyrrin.meta.js
// ==/UserScript==
window.init = false;

window.addEventListener('load', function () {
  if (window.location.href.indexOf("https://elgea.illyriad.co.uk/#/World/Map") !== -1) {
    window.customSpeed = 7;

    window.distance = function (x0, y0, x1, y1) {
      return Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2));
    };

    window.getAngle = function (x0, y0, x1, y1) {
      var angle = Math.atan2(y1 - y0, x1 - x0);   //radians
      // you need to devide by PI, and MULTIPLY by 180:
      var degrees = 180 * angle / Math.PI;  //degrees
      return (360 + degrees) % 360; //round number, avoid decimal fragments
    };

    window.distanceToTown = function () {
      window.coords = document.querySelector("#coords").innerText.split("|").map(elem => Number(elem));
      window.selX = window.coords[0];
      window.selY = window.coords[1];
      return window.distance(window.selX, window.selY, window.townX, window.townY);
    };

    window.angleToTown = function () {
      window.coords = document.querySelector("#coords").innerText.split("|").map(elem => Number(elem));
      window.selX = window.coords[0];
      window.selY = window.coords[1];
      return window.getAngle(window.selX, window.selY, window.townX, window.townY);
    };

    window.timeSignature = function (hours) {
      let seconds = hours * 3600;
      let h = Math.floor(seconds / 3600);
      seconds -= h * 3600;
      let m = Math.floor(seconds / 60);
      seconds -= m * 60;
      let s = Math.floor(seconds);
      return (`${h}h ${m}m ${s}s`);
    };

    window.updateAddon = function () {
      if (document.querySelector("#distDiv") == null) {
        document.body.addEventListener("keydown", window.changeCustomSpeed);

        let distDiv = document.createElement("div");
        distDiv.id = "distDiv";
        let cotterTimeDiv = document.createElement("div");
        cotterTimeDiv.id = "cotterTime";
        let gathererTimeDiv = document.createElement("div");
        gathererTimeDiv.id = "gathererTime";
        let customTimeDiv = document.createElement("div");
        customTimeDiv.id = "customTime";

        let explainSpan = document.createElement("span");
        explainSpan.style.fontWeight = "bold";
        explainSpan.innerText = "Use the - and = keys to adjust speed";

        document.querySelector("#tileTerrainOverall").insertAdjacentElement("afterEnd", customTimeDiv);
        document.querySelector("#tileTerrainOverall").insertAdjacentElement("afterEnd", explainSpan);
        document.querySelector("#tileTerrainOverall").insertAdjacentElement("afterEnd", gathererTimeDiv);
        document.querySelector("#tileTerrainOverall").insertAdjacentElement("afterEnd", cotterTimeDiv);
        document.querySelector("#tileTerrainOverall").insertAdjacentElement("afterEnd", distDiv);
      } else {
        document.querySelector("#distDiv").innerText = `Dist: ${window.distanceToTown().toFixed(1)}, ${window.angleToTown().toFixed(2)}deg`;
        document.querySelector("#cotterTime").innerText = `Cotters: ${window.timeSignature(window.distanceToTown() / 10)}`;
        document.querySelector("#gathererTime").innerText = `Gatherers: ${window.timeSignature(window.distanceToTown() / 12)}`;
        document.querySelector("#customTime").innerText = `(+/-) Speed ${window.customSpeed}: ${window.timeSignature(window.distanceToTown() / window.customSpeed)}`;
      } 1;
    };

    window.changeCustomSpeed = function (e) {
      if (e.code === "Minus" || e.code === "NumpadSubtract") {
        window.customSpeed--;
        window.updateAddon();
      } else if (e.code === "Equal" || e.code === "NumpadAdd") {
        window.customSpeed++;
        window.updateAddon();
      }
    };

    updateAddon();
    init = true;
  }
});

if (window.location.href.indexOf("https://elgea.illyriad.co.uk/#/World/Map") !== -1) {
  document.querySelector("#MainContentDiv").addEventListener("mousemove", () => {
    window.updateAddon();
  });
}