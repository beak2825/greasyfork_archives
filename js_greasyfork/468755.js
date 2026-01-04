// ==UserScript==
// @name        Chess.com: LichessAnalysis
// @namespace   pwa
// @match       https://*chess.com/*
// @icon        https://chess.com/favicon.ico
// @license     MIT
// @grant       none
// @author      pwa
// @description 11/7/2023, 01:01:01 PM
// @version 0.0.1.20230918195716
// @downloadURL https://update.greasyfork.org/scripts/468755/Chesscom%3A%20LichessAnalysis.user.js
// @updateURL https://update.greasyfork.org/scripts/468755/Chesscom%3A%20LichessAnalysis.meta.js
// ==/UserScript==


window.openUrl = function(fen) {
  url = "https://lichess.org/analysis/fromPosition/" + fen.replaceAll(/ /g, "_");
  console.log(`url: ${url}`);
  window.open(url);
}

window.createStockFishIcon = function() {
  let img = document.createElement('img');
  img.id = "AnalyseBoard"
  img.src = "https://img.freepik.com/premium-vector/artificial-intelligence-ai-processor-chip-icon-symbol-vector-illustration_136875-4092.jpg"
  img.style.width = "40px"
  img.style.height = "40px"
  img.style.boxShadow = "0 0 40px greenyellow";
  img.style.marginLeft = "40px";
  img.onclick = () => {
    navigator.clipboard.writeText(window.game.fen);
    openUrl(window.game.fen)
  }
  return img;
}

setInterval(function() {
  if (!document.getElementById("AnalyseBoard")) {
    console.log("[+] addind board analysis icon");
    try {
      document.getElementsByClassName("player-row-wrapper")[0].append(createStockFishIcon())
    } catch {
      console.log("[-] unable to create board analysis icon");
    }
  }
}, 1000);

