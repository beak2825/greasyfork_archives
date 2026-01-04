// ==UserScript==
// @name         show cheese stats in spec
// @namespace    http://tampermonkey.net/
// @version      2.5.7
// @description  asdf
// @author       orz
// @run-at       document-idle
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515708/show%20cheese%20stats%20in%20spec.user.js
// @updateURL https://update.greasyfork.org/scripts/515708/show%20cheese%20stats%20in%20spec.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const replaceBadValues = (n, defaultValue) => {
    // NaN check
    if (Number.isNaN(n) || !Number.isFinite(n)) return defaultValue || 0;
    return n;
  };

  let stats = [];
  const updateStats = function () {
    const index = this.ISGAME
      ? 0
      : parseInt(this.v.canvas.parentElement.getAttribute("data-index-cheese"));
    stats[index]?.forEach((stat) => {
      if (stat.row) {
        stat.row.parentElement.style.left = this.v.queueCanvas.style.left;
        stat.row.parentElement.style.width = this.v.queueCanvas.width + "px";
        stat.row.parentElement.style.marginTop =
          parseInt(this.v.queueCanvas.style.top) +
          parseInt(this.v.queueCanvas.height) +
          20 +
          "px";
        stat.row.style.display = "block";
        var val = stat.calc(this);
        stat.row.children[1].innerHTML = val;
      } else {
        stat.row.style.display = "none";
      }
    });
  };
  const initStat = (index, name, calc, options = {}) => {
    stats[index].push({
      name,
      calc,
      val: 0,
      initialValue: options.initialValue || 0,
    });
  };

  const initStats = () => {
    const slots = document.querySelectorAll(".slot>div");
    slots.forEach((stageEle, i) => {
      stageEle.setAttribute("data-index-cheese", i);
      stats.push([]);
      initGameStats(stageEle, i);
    });

    console.log(stats);
  };
  const initGameStats = (stageEle, index) => {
    initStat(index, "Lines left", (game) => {
      return 100 - game.gamedata.garbageCleared;
    });

    initStat(index, "Blocks placed", (game) => {
      return game.placedBlocks;
    });

    initStat(index, "Block-pace", (game) => {
      let totalLines = 100;
      let linesLeft = 100 - game.gamedata.garbageCleared;
      let linesCleared = totalLines - linesLeft;
      var piecePace = replaceBadValues(
        (linesLeft / linesCleared) * game["placedBlocks"] +
          game["placedBlocks"],
      );
      return piecePace * 0 + 1 ? Math.floor(piecePace) : "0";
    });

    const statsTable = document.createElement("TABLE");
    statsTable.className = "cheese-stats-table";
    stageEle.appendChild(statsTable);

    stats[index].forEach((stat) => {
      const row = document.createElement("div");
      row.style.display = "none";
      const name = document.createElement("div");
      name.className = "cheese-name";
      name.innerHTML = stat.name;
      const val = document.createElement("div");
      val.className = "cheese-val";
      val.id = `${stat.name}-val`;
      val.innerHTML = stat.val;
      row.appendChild(name);
      row.appendChild(val);
      statsTable.appendChild(row);
      stat.row = row;
    });
    /*
  if (typeof Game == "function") {
    let oldQueueBoxFunc = Game.prototype.updateQueueBox;
    Game.prototype.updateQueueBox = function () {
      updateStats.call(this)
      return oldQueueBoxFunc.apply(this, arguments);
    }
  }
  */

    if (typeof Replayer == "function" /* && typeof Game != "function" */) {
      let oldQueueBoxFunc = Replayer.prototype.updateQueueBox;
      Replayer.prototype.updateQueueBox = function () {
        updateStats.call(this);
        return oldQueueBoxFunc.apply(this, arguments);
      };
    }
  };

  window.addEventListener("load", (e) => {
    setTimeout(() => initStats(), 3000);
    var styleSheet = document.createElement("style");
    styleSheet.innerText = `
.cheese-stats-table {
  position: absolute;
  color: #999;
  width: 200px;
}
.cheese-val {
  font-size:30px;
  text-align: center;
}
.cheese-name {
  color: #333;
  font-size: 15px;
  text-align:center;
}
`;
    document.body.appendChild(styleSheet);
  });
})();
