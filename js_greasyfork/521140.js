// ==UserScript==
// @name        TCG Duplicate Checker
// @namespace   finally.idle-pixel.tcg
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.1
// @author      finally
// @description Check other peoples cards for duplicates
// @downloadURL https://update.greasyfork.org/scripts/521140/TCG%20Duplicate%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/521140/TCG%20Duplicate%20Checker.meta.js
// ==/UserScript==

CardData.fetchData();

(() => {
  return new Promise((resolve) => {
    function check() {
      if (window.websocket?.connected_socket && document.getElementById("panel-criptoe-tcg") && CardData.data) {
        resolve();
        return;
      }
      setTimeout(check, 200);
    }
    check();
  });
})().then(() => {
  let tcgData = null;
  let checkPlayerData = null;
  window.websocket.connected_socket.addEventListener("message", (e) => {
    if (!e.data.startsWith("REFRESH_TCG")) return;

    let raw = e.data.split("~");
    let data = [];
    for (let i = 0; i < raw.length;) {
      let id = raw[i++];
      let name = raw[i++];
      let holo = raw[i++] == "true";
      data.push({id, name, holo});
    }
    tcgData = data;
  });
  window.websocket.connected_socket.addEventListener("open", () => {
    window.websocket.send("RFRESH_TCG_CLIENT");
  });

  function addButton(icon, text, callback, parent) {
    let button = document.createElement("a");
    button.innerHTML = `
      <div class="itembox-rings hover">
        <div class="center mt-1">${icon}</div>
        <div class="center mt-2">${text}</div>
      </div>
    `;

    if (parent) {
      parent.appendChild(button);
    }
    else {
      let node = document.querySelector("[data-tooltip='tcg_unknown']");
      node.parentNode.insertBefore(button, node.nextElementSibling);
    }

    button.addEventListener("click", callback);
    return button;
  }

  function filterCards(me) {
    checkCardsDiv.innerHTML = "";

    if (!tcgData || !checkPlayerData) return;

    let a =  me ? tcgData : checkPlayerData;
    let b = !me ? tcgData : checkPlayerData;

    let html = "";
    [false, true].forEach(holo => {
      Object.keys(CardData.data).forEach(name => {
        if (a.find(card => card.name == name && card.holo == holo)) return;
        let duplicates = b.filter(card => card.name == name && card.holo == holo);
        if (duplicates.length < 2) return;

        let id = Math.max.apply(null, duplicates.map(card => card.id));
        html += CardData.getCardHTML(id, name, holo);
      });
    });
    if (html == "") html = "No Duplicates Found";
    if (me) html = html.replaceAll(`onclick='Modals.open_tcg_give_card(null, "0")'`, "");
    checkCardsDiv.innerHTML = html;
  }

  let checkDiv = document.createElement("div");
  checkDiv.style.display = "none";
  let usernameInput = document.createElement("input");
  usernameInput.placeholder = "Username to check";
  checkDiv.appendChild(usernameInput);
  let checkButton = addButton("✅", "Check", () => {
    checkPlayerData = null;
    checkCardsDiv.innerHTML = "";
    duplicatesMeButton.children[0].style.border = "";
    duplicatesThemButton.children[0].style.border = "";

    fetch(`https://idle-pixel.com/tcg/get/?username=${usernameInput.value}`)
      .then(r => r.json())
      .then(j => {
        if (j.error) {
          checkCardsDiv.innerHTML = j.error;
          return;
        }

        if (!j.result || !Array.isArray(j.result)) {
          checkCardsDiv.innerHTML = "No Cards Found";
          return;
        }

        checkPlayerData = j.result.map(card => {
          return {
            id: 0,
            name: card.card,
            holo: card.holo
          };
        });
        duplicatesMeButton.click();
      })
      .catch(console.error);
  }, checkDiv);
  let duplicatesMeButton = addButton("⬅️", "Duplicates For Me", () => {
    duplicatesMeButton.children[0].style.border = "2px solid lightgreen";
    duplicatesThemButton.children[0].style.border = "";
    filterCards(true);
  }, checkDiv);
  let duplicatesThemButton = addButton("➡️", "Duplicates For Them", () => {
    duplicatesMeButton.children[0].style.border = "";
    duplicatesThemButton.children[0].style.border = "2px solid lightgreen";
    filterCards(false);
  }, checkDiv);
  let checkCardsDiv = document.createElement("div");
  checkDiv.appendChild(checkCardsDiv);
  document.getElementById("panel-criptoe-tcg").appendChild(checkDiv);

  let cardsDiv = document.getElementById("tcg-area-context");
  let showCardsButton = addButton("🗂️", "Show Cards", () => {
    showCardsButton.style.display = "none";
    checkPlayerButton.style.display = "";
    checkDiv.style.display = "none";
    cardsDiv.style.display = "";
  });
  let checkPlayerButton = addButton("🔎", "Check Player", () => {
    showCardsButton.style.display = "";
    checkPlayerButton.style.display = "none";
    checkDiv.style.display = "";
    cardsDiv.style.display = "none";
  });
  showCardsButton.style.display = "none";
});
