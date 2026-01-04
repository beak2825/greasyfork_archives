// ==UserScript==
// @name         Laekna Revive Request
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  Request a revive from the Laekna revive faction in Torn. Works in browser and PDA.
// @author       DirtyArcLitepaw
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      laekna-revive-bot.onrender.com
// @downloadURL https://update.greasyfork.org/scripts/536134/Laekna%20Revive%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/536134/Laekna%20Revive%20Request.meta.js
// ==/UserScript==

'use strict';

setTimeout(renderButton, 500);

GM_addStyle(`
  .laekna {
    box-shadow: inset 0px 1px 0px 0px #8bc4a9;
    background: linear-gradient(to bottom, #1abc9c 5%, #16a085 100%);
    border-radius: 1em;
    border: 1px solid #0e7b65;
    color: white;
    font-size: .75em;
    font-family: Arial;
    padding: .3em .5em;
    cursor: pointer;
    margin-bottom: .7em;
    text-decoration: none;
    text-shadow: 0px 1px 0px #0f5e50;
  }
  .laekna:hover {
    background: linear-gradient(to bottom, #16a085 5%, #1abc9c 100%);
  }
  .laekna:active {
    position: relative;
    top: 1px;
  }
`);

function renderButton() {
  const sidebar = getSidebar();
  if (!sidebar || !sidebar.statusIcons?.icons?.hospital) {
    setTimeout(renderButton, 500);
    return;
  }

  if (!document.getElementById('laekna-button')) {
    let elem = sidebar.windowSize !== 'mobile'
      ? document.querySelector('.life___PlnzK')
      : document.querySelector('.header-buttons-wrapper');

    if (!elem) return;

    const html = `<a href="#" class="laekna" id="laekna-button" title="💉 Request a revive from Laekna.">REQUEST A REVIVE</a>`;
    elem.children[0].insertAdjacentHTML('beforebegin', html);
    document.getElementById('laekna-button').addEventListener('click', sendRequest);
  }

  setTimeout(renderButton, 3000);
}

function capitalizeText(text, options = {}) {
  if (!text) return '';
  if (options.everyWord) {
    return text
      .split(" ")
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }
  return text[0].toUpperCase() + text.slice(1);
}

function getTravelLocation() {
  let country = document.body?.dataset?.country;
  if (!country) return "Torn";
  if (country === "uk") return "United Kingdom";
  if (country === "uae") return "UAE";
  return capitalizeText(country.replaceAll("-", " "), { everyWord: true });
}

function sendRequest() {
  const sidebar = getSidebar();
  const hospitalIcon = sidebar.statusIcons.icons.hospital;
  if (!hospitalIcon) {
    alert('❌ You are not in the hospital!');
    return;
  }

  const pid = sidebar.user.userID;
  const name = sidebar.user.name;
  const faction = sidebar.statusIcons.icons.faction?.subtitle?.split(' of ')[1] || "Unknown";
  const travel = getTravelLocation();

  const data = {
    userID: pid,
    userName: name,
    factionName: faction,
    travelLocation: travel,
    source: "Laekna Revive Request Script"
  };

  const url = "https://laekna-revive-bot.onrender.com/revive";
  const isPDA = navigator.userAgent.includes("Torn PDA");

  if (isPDA && typeof PDA_httpPost === "function") {
    PDA_httpPost(url, { "Content-Type": "application/json" }, JSON.stringify(data))
      .then(response => {
        if (response.status === 200) {
          alert("✅ Your revive request has been sent to Laekna!");
        } else if (response.status === 429) {
          alert("⏳ You’ve recently made a request. Please wait before trying again.");
        } else {
          alert("⚠️ Request failed. Please try again.");
        }
      })
      .catch(err => {
        console.error("PDA error:", err);
        alert("❌ PDA request failed unexpectedly.");
      });
  } else {
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      data: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      onload: res => {
        if (res.status === 200) {
          alert("✅ Your revive request has been sent to Laekna!");
        } else if (res.status === 429) {
          alert("⏳ You’ve recently made a request. Please wait before trying again.");
        } else {
          alert("⚠️ Request failed. Please try again.");
        }
      },
      onerror: () => alert("❌ Could not contact the Laekna revive bot.")
    });
  }
}

function getSidebar() {
  const key = Object.keys(sessionStorage).find(key => /sidebarData\d+/.test(key));
  return JSON.parse(sessionStorage.getItem(key));
}
