// ==UserScript==
// @name         watcher
// @namespace    watcher.zero.nao
// @version      0.3
// @description  adds alerts to torn.com
// @author       nao [2669774]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com

// @downloadURL https://update.greasyfork.org/scripts/529345/watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/529345/watcher.meta.js
// ==/UserScript==

const MONEY_THRESHOLD = 1000000;

if (!localStorage.getItem("torn-alert-audio-enabled")) {
  localStorage.setItem("torn-alert-audio-enabled", "true");
}
if (!localStorage.getItem("torn-alert-visual-enabled")) {
  localStorage.setItem("torn-alert-visual-enabled", "true");
}

let audioEnabled = localStorage.getItem("torn-alert-audio-enabled") === "true";
let visualEnabled =
  localStorage.getItem("torn-alert-visual-enabled") === "true";

const audioLink =
  "https://github.com/archimidiz/datum/raw/refs/heads/main/siren.wav";

let audio;
let playSound = false;
let currentHealth;

audio = new Audio(audioLink);
//function initializeAudio() {
//  console.log("audio initialized");
//  document.removeEventListener("click", initializeAudio);
//  document.removeEventListener("keydown", initializeAudio);
//  document.removeEventListener("touchstart", initializeAudio);
//  document.removeEventListener("scroll", initializeAudio);
//  return audio;
//}
//document.addEventListener("click", initializeAudio);
//document.addEventListener("keydown", initializeAudio);
//document.addEventListener("touchstart", initializeAudio);
//document.addEventListener("scroll", initializeAudio);
//
function addStyle() {
  const style = document.createElement("style");
  style.innerHTML = `

  @keyframes blink {
    0% { background-color: red; }
    100% { background-color: transparent; }
  }

  .torn-alert {
    animation: blink 0.3s infinite;
  }
  
  `;

  document.head.appendChild(style);

  const coverDiv = document.createElement("div");
  coverDiv.id = "torn-alert-cover";
  coverDiv.style.position = "fixed";
  coverDiv.style.top = "0";
  coverDiv.style.left = "0";
  coverDiv.style.width = "100%";
  coverDiv.style.height = "100%";
  coverDiv.style.display = "none";
  coverDiv.style.zIndex = "100000000";
  coverDiv.style.pointerEvents = "none";

  document.body.appendChild(coverDiv);
}

function startAlert() {
  const cover = document.getElementById("torn-alert-cover");
  cover.style.display = "block";
  if (visualEnabled) {
    cover.classList.add("torn-alert");
  }
  if (audioEnabled) {
    audio.play();
    audio.onended = () => {
      audio.play();
    };
  }
}

function stopAlert() {
  const cover = document.getElementById("torn-alert-cover");
  cover.style.display = "none";
  cover.classList.remove("torn-alert");
  audio.pause();
  audio.currentTime = 0;
}
addStyle();

function main() {
  checkMoney();
}

function checkMoney() {
  const money = Math.floor(
    parseInt(document.getElementById("user-money").getAttribute("data-money")),
  );

  currentHealth =
    $("a.bar___Bv5Ho:nth-child(4) > div:nth-child(1) > p:nth-child(2)")
      .text()
      .split("/")[0] * 1;
  console.log(money, currentHealth);

  if (money > MONEY_THRESHOLD) {
    startAlert();
  }
}

const wsURL = "wss://ws-centrifugo.torn.com/connection/websocket";
let socket;
let messageQueue = [];
let waitingForResponse = false;

connect();

function connect() {
  socket = new WebSocket(wsURL);

  socket.onopen = function(e) {
    console.log("[WATCHER] Connection established");
    sendData();
    main();
  };

  socket.onerror = function(e) {
    console.error(e); // Use console.error for errors
  };

  socket.onmessage = async function(e) {
    let response = JSON.parse(e.data);
    console.log(response);
    const actions =
      response?.push?.pub?.data?.message?.namespaces?.sidebar?.actions;
    if (actions) console.log(actions);
    if (actions) {
      if (actions.updateMoney) {
        const newMoney = actions.updateMoney.money * 1;
        if (newMoney > MONEY_THRESHOLD) {
          startAlert();
        }
      }
      if (actions.updateLife) {
        const newHealth = actions.updateLife.amount * 1;
        if (newHealth < currentHealth) {
          startAlert();
        }
        currentHealth = newHealth;
      }
    }
    waitingForResponse = false;
    processMessageQueue();
  };

  socket.onclose = function() {
    console.log("[WATCHER] CONNECTION CLOSED!");
    waitingForResponse = false;
    setTimeout(connect, 1000);
  };
}

function sendData() {
  let count = 1;
  let data = JSON.parse($("#websocketConnectionData").text());
  const token = data.token;
  const channel = data.channel;

  const msg1 = {
    "connect": {
      "token": token,
      "name": "js"
    },
    "id": count++
  };

  const msg2 = {
    "subscribe": {
      "channel": channel,
    },
    "id": count++
  };

  enqueueMessage(msg1);
  enqueueMessage(msg2);
  processMessageQueue();
}

function enqueueMessage(message) {
  messageQueue.push(message);
}

function processMessageQueue() {
  if (waitingForResponse || messageQueue.length === 0) {
    return; // Wait for response or no messages to send
  }

  const message = messageQueue.shift(); // Get the next message
  socket.send(JSON.stringify(message));
  waitingForResponse = true; // Set flag to prevent sending another message
}

document.addEventListener("click", function(event) {
  stopAlert();
});

function insertSettigns() {
  const container = document.querySelector("div[class^='content_']");

  if (!container) {
    setTimeout(insertSettigns, 1000);
    return;
  }
  const checkmark = document.createElement("input");
  checkmark.type = "checkbox";
  checkmark.id = "torn-alert-audio-enabled";
  checkmark.checked = audioEnabled;
  checkmark.onchange = function() {
    audioEnabled = checkmark.checked;
    localStorage.setItem("torn-alert-audio-enabled", audioEnabled);
  };

  const label = document.createElement("label");
  label.htmlFor = "torn-alert-audio-enabled";
  label.innerText = "Enable audio";
  label.appendChild(checkmark);

  const checkmark2 = document.createElement("input");
  checkmark2.type = "checkbox";
  checkmark2.id = "torn-alert-visual-enabled";
  checkmark2.checked = visualEnabled;
  checkmark2.onchange = function() {
    visualEnabled = checkmark2.checked;
    localStorage.setItem("torn-alert-visual-enabled", visualEnabled);
  };

  const label2 = document.createElement("label");
  label2.htmlFor = "torn-alert-visual-enabled";
  label2.innerText = "Enable visual";
  label2.appendChild(checkmark2);

  container.appendChild(label);
  container.appendChild(label2);
}

insertSettigns();

