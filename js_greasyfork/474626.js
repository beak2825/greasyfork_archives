// ==UserScript==
// @name        Wixoss Tabletop Simulator Exporter
// @namespace   Violentmonkey Scripts
// @match       https://dexoss.app/deck/*
// @match       https://www.wixosstcg.eu/deck/*
// @grant       none
// @version     1.4
// @author      Riokaru
// @description Adds 'Export to TTS' button for Dexoss and wixosstcg.eu deckbuilders to display decks in JSON format. Made by Riokaru.
// @run-at      document-idle
// @license     MIT
// @icon        https://i.imgur.com/IWLR5R3.png
// @supportURL  https://github.com/ShonTitor/WixossImportTool
// @downloadURL https://update.greasyfork.org/scripts/474626/Wixoss%20Tabletop%20Simulator%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/474626/Wixoss%20Tabletop%20Simulator%20Exporter.meta.js
// ==/UserScript==

function getDexoss() {
  var rows = document.getElementsByClassName("item");
  var cards = [];
  var card_qty = {}
  for (var i=0; i < rows.length; i++) {
      var row = rows[i];
      if (row.getAttribute("role") != "listitem") {
         continue;
      }
      var description = row.getElementsByClassName("description")[0];
      if (!description) {
         continue;
      }
      var code = description.innerHTML;
      var leftContent = row.getElementsByClassName("left")[0];
      var qty = 1;
      if (leftContent) {
          qty = parseInt(leftContent.innerHTML[0])
      }
      card_qty[code] = qty
  }
  for (const code in card_qty) {
      for (var j=0; j < card_qty[code]; j++) {
          cards.push(code);
      }
  }
  return JSON.stringify(cards);
}

function getWixossTCGEU() {
  var rows = document.getElementsByClassName("rowlist");
  var cards = [];
  for (var i=0; i < rows.length; i++) {
      var row = rows[i];
      var qty = row.getElementsByClassName("colqta")[0].innerHTML;
      var cod = row.getElementsByClassName("colcod")[0].innerHTML;
      for (var j=0; j < qty; j++) {
          cards.push(cod);
      }
  }
  return JSON.stringify(cards);
}

function hideModal() {
  document.getElementById("ttsModal").style.display = "none";
}

function showDexoss() {
  document.getElementById("ttsModal").style.display = "block";
  let deck = getDexoss();
  document.getElementById("ttsModalContent").textContent = deck;
  document.getElementById("closeModal").addEventListener("click", hideModal);
}

function showWixossTCGEU() {
  document.getElementById("ttsModal").style.display = "block";
  let deck = getWixossTCGEU();
  document.getElementById("ttsModalContent").textContent = deck;
  document.getElementById("closeModal").addEventListener("click", hideModal);
}

function main() {
  const host = window.location.host;

  const modalString = `
  <div id="ttsModal" style="display: none;position: fixed;z-index: 1;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;background-color: rgb(0,0,0);background-color: rgba(0,0,0,0.4);z-index:10">
  <div style="background-color: #fefefe;margin: 15% auto;padding: 20px;border: 1px solid #888;width: 80%;">
    <span id="closeModal" class="close" style="color: #aaa;float: right;font-size: 28px;font-weight: bold;">&times;</span>
    <h1>Export to Tabletop Simulator</h1>
    <code id="ttsModalContent">Deck</code>
    <br><br>
    <strong>Copy this code and paste it in the Tabletop Simulator Notebook to import your deck.</strong>
  </div>
  </div>`;
  const parser = new DOMParser();
  const modal = parser.parseFromString(modalString, 'text/html');
  document.body.appendChild(modal.documentElement);

  if (host == "dexoss.app") {
    const old_button = document.getElementsByName("export")[0];
    const new_button = document.createElement('button');
    new_button.classList.add('ui', 'grey', 'button');
    new_button.textContent = "Export to TTS";
    new_button.addEventListener("click", showDexoss);

    old_button.insertAdjacentElement('afterend', new_button);
  }
  else if (host == "www.wixosstcg.eu") {
    const old_button = document.getElementById("dropdownMenu1");
    const new_button = document.createElement('button');
    new_button.classList.add('btn', 'btn-primary', 'dropdown-toggle');
    new_button.textContent = "Export to TTS";
    new_button.addEventListener("click", showWixossTCGEU);

    old_button.insertAdjacentElement('afterend', new_button);
  }
}

function check(changes, observer) {
  if(document.querySelector("button[name='export']")) {
      observer.disconnect();
      main();
  }
}

const host = window.location.host;
if (host == "dexoss.app") {
  (new MutationObserver(check)).observe(document, {childList: true, subtree: true});
}
else {
  main();
}