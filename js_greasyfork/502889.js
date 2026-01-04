// ==UserScript==
// @name        Overseer
// @namespace   Violentmonkey Scripts
// @match       https://elgea.illyriad.co.uk/*
// @grant       none
// @version     1.4
// @author      Glyrrin
// @description 8/7/2024, 7:26:16 PM
// @downloadURL https://update.greasyfork.org/scripts/502889/Overseer.user.js
// @updateURL https://update.greasyfork.org/scripts/502889/Overseer.meta.js
// ==/UserScript==

window.addEventListener("load", () => {
  window.clearHistory = function () {
    localStorage.removeItem("history");
  };
  window.storeHistory = function () {
    localStorage.setItem("history", JSON.stringify(window.units));
  };
  window.getHistory = function () {
    let history = localStorage.getItem("history");
    if (history) {
      window.units = JSON.parse(history);
    };
  };


  window.units = [];
  window.movements = [];
  window.updateSpying = function () {
    window.getHistory();
    let canvas = document.querySelector("#historyDisplay");
    if (document.querySelector("#historyDisplay") === null) {
      window.mapDiv = document.querySelector("#mapDiv");


      if (!canvas) {

        var p = document.querySelector("#mapDiv");
        var b = document.getElementById("mapGrid");
        canvas = document.createElement("canvas");
        canvas.setAttribute("id", "historyDisplay");

        canvas.setAttribute("width", "500");
        canvas.setAttribute("height", "500");
        canvas.setAttribute("style", "position:absolute;top:11px;left:15px;");
        canvas.setAttribute("unselectable", "on");
        // canvas.setAttribute("class", dtCanvases[canvases[i]].class);
        window.historyCanvas = canvas;
        p.insertBefore(canvas, b);
      }
      if (document.querySelector("#movementsDiv") === null) {
        let movementsDiv = document.createElement("div");
        movementsDiv.id = "movementsDiv";
        movementsDiv.classList = ["smallBorder"];
        movementsDiv.style.position = "absolute";
        movementsDiv.style.background = "white";
        movementsDiv.style.left = "1030px";
        let movementList = document.createElement("ul");
        movementList.id = "movementList";
        movementsDiv.appendChild(movementList);
        document.body.appendChild(movementsDiv);
      }

      let movementList = document.getElementById("movementList");
      movementList.innerHTML = "";

      window.getAngle = function (unit) { return radToDeg(Math.tan((unit.cy - unit.dy) / (unit.cx - unit.dx))); };
      window.radToDeg = function (radians) { return radians * (180 / Math.PI); };

      window.movements = [];
      for (let code of Object.keys(window.mapData.mu)) {
        let unit = window.mapData.mu[code];
        // console.log(unit);
        window.movements.push(`${unit.rd} ${unit.i} [${unit.cx.toFixed(1)}|${unit.cy.toFixed(1)}]: ${getAngle(unit).toFixed(2)} degrees at ${new Date()}`);
        window.units.push({ code: code, allegiance: unit.rd, type: unit.i, cx: unit.cx, cy: unit.cy, dx: unit.dx, dy: unit.dy, time: (new Date()).getTime() });
      }
      for (let code of Object.keys(window.mapData.mt)) {
        let unit = window.mapData.mt[code];
        // console.log(unit);
        window.movements.push(`${unit.rd} ${unit.d} [${unit.cx.toFixed(1)}|${unit.cy.toFixed(1)}]: ${getAngle(unit).toFixed(2)} degrees at ${new Date()}`);
        window.units.push({ code: code, allegiance: unit.rd, type: unit.d, cx: unit.cx, cy: unit.cy, dx: unit.dx, dy: unit.dy, time: (new Date()).getTime() });
      }
      window.movements.forEach(mv => { movementList.innerHTML += `<li>${mv}</li>`; });

      // window.units.forEach(unit => { movementList.innerHTML += `<li>${JSON.stringify(unit)}</li>`; });
    };
    window.storeHistory();
  };



  window.mapRange = function (value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  };

  window.drawUnits = function () {
    //    console.log(units);
    var canvas = document.getElementById('historyDisplay');
    if (canvas) {

      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 500, 500);

      var sFactor = 500 / ((window.mapData.zoom * 2) + 1);
      let zoom = window.mapData.zoom;
      var rubbish = "";
      let topX = window.mapData.x - zoom;
      let topY = window.mapData.y - zoom;
      let botX = window.mapData.x + zoom;
      let botY = window.mapData.y + zoom;
      for (var i = 0; i < window.units.length; i++) {
        unit = window.units[i];

        // let leftMar = (window.mapData.x - unit.cx) * sFactor;
        // let topMar = (window.mapData.y - unit.cy) * sFactor;
        let leftMar = mapRange(unit.cx, topX, botX, 0, 500);
        let topMar = mapRange(unit.cy, topY, botY, 500, 0);
        ctx.font = "10px serif";
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        if (unit.allegiance === "Neutral") {
          ctx.strokeStyle = "yellow";
          ctx.fillStyle = "yellow";
        } else if (unit.allegiance === "Your" || unit.allegiance === "Yours") {
          ctx.strokeStyle = "blue";
          ctx.fillStyle = "blue";
        } else if (unit.allegiance === "NAP ") {
          ctx.strokeStyle = "lime";
          ctx.fillStyle = "lime";
        } else {
          ctx.strokeStyle = "red";
          ctx.fillStyle = "red";
        }
        ctx.fillText(unit.type[0], leftMar, topMar);
        for (var j = i + 1; j < window.units.length; j++) {
          let otherUnit = window.units[j];
          if (unit.code === otherUnit.code && unit.time < otherUnit.time) {
            let otherLeftMar = mapRange(otherUnit.cx, topX, botX, 0, 500);
            let otherTopMar = mapRange(otherUnit.cy, topY, botY, 500, 0);

            ctx.beginPath(); // Start a new path
            ctx.moveTo(leftMar, topMar); // Move the pen to (30, 50)
            ctx.lineTo(otherLeftMar, otherTopMar); // Draw a line to (150, 100)
            ctx.stroke(); // Render the path
          }

        }
        // console.log(leftMar, topMar);
      }
    }
  };
  drawUnits();

  updateSpying();
  setInterval(() => {
    updateSpying();
  }, 3000);


  setInterval(() => {
    drawUnits();
  }, 100);

});

