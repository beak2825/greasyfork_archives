// ==UserScript==
// @name         Moomoo.io 1.8.0 AutoGG & Interactive Menu
// @description  Press 'Esc' to open the menu and customize the AutoGG message, delay, and toggle keycode. Your settings will be saved even if you reload the page.
// @author       Seryo
// @version      1
// @namespace    https://greasyfork.org/users/1190411
// @match        *://*.moomoo.io/*
// @grant        none
// @license      MIT
// @icon         https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=1005014
// @downloadURL https://update.greasyfork.org/scripts/478501/Moomooio%20180%20AutoGG%20%20Interactive%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/478501/Moomooio%20180%20AutoGG%20%20Interactive%20Menu.meta.js
// ==/UserScript==

const msgpack5 = window.msgpack;

let ws, autoGGEnabled = true;
let menuVisible = false;
let messageSpeed = parseInt(localStorage.getItem("autogg-message-speed"), 10) || 1400;
let toggleKeyCode = parseInt(localStorage.getItem("autogg-toggle-keycode"), 10) || 219;
let editedMessage = localStorage.getItem("autogg-edited-message") || "";
let lastKillCount = 0;
let originalMessageSpeed = messageSpeed;
let originalToggleKeyCode = toggleKeyCode;

function loadSettings() {
  const savedMessageSpeed = localStorage.getItem("autogg-message-speed");
  if (savedMessageSpeed !== null) {
    messageSpeed = parseInt(savedMessageSpeed, 10);
  } else {
    messageSpeed = 1400;
  }

  const savedToggleKeyCode = localStorage.getItem("autogg-toggle-keycode");
  if (savedToggleKeyCode !== null) {
    toggleKeyCode = parseInt(savedToggleKeyCode, 10);
  } else {
    toggleKeyCode = 219;
  }

  const savedEditedMessage = localStorage.getItem("autogg-edited-message");
  if (savedEditedMessage !== null) {
    editedMessage = savedEditedMessage || "";
  }
}

WebSocket.prototype.oldSend = WebSocket.prototype.send;

WebSocket.prototype.send = function (e) {
  if (!ws) {
    [document.ws, ws] = [this, this];
    attachWebSocketListener(this);
  }
  this.oldSend(e);
};

const attachWebSocketListener = (e) => {
  e.addEventListener("message", hookWS);
};

const hookWS = (e) => {};

const sendPacket = (e) => {
  if (ws) {
    ws.send(msgpack5.encode(e));
  }
};

const sendMessageToChat = (e) => {
  setTimeout(() => {
  sendPacket(["6", [e]]);
  }, messageSpeed);
};

function isChatOpen() {
  return document.activeElement.id.toLowerCase() === "chatbox";
}

function isAllianceInputActive() {
  return document.activeElement.id.toLowerCase() === "allianceinput";
}

function shouldHandleHotkeys() {
  return !isChatOpen() && !isAllianceInputActive();
}

const handleMutations = (mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.target.id === "killCounter") {
      const count = parseInt(mutation.target.innerText, 10) || 0;

      if (count === 0) {
        lastKillCount = 0;
      }

      if (count > lastKillCount) {
        lastKillCount = count;
        if (autoGGEnabled) {
          sendMessageToChat(editedMessage);
        }
      }
    }
  }
};

const observer = new MutationObserver(handleMutations);
observer.observe(document, {
  subtree: true,
  childList: true,
});

const gradientColorStyle = document.createElement("style");
gradientColorStyle.textContent = `
  #autogg-character-count {
    transition: color 1s;
    color: #909090;
  }
`;
document.head.appendChild(gradientColorStyle);

function updateCharacterCount() {
  const messageInput = document.getElementById("autogg-message-input");
  const characterCount = document.getElementById("autogg-character-count");
  const newCharacterCount = 30 - messageInput.value.length;

  characterCount.style.transition = "color 1s";

  if (newCharacterCount >= 1) {
    characterCount.style.color = "#909090";
  } else if (newCharacterCount >= 1) {

      const redValue = 255 - (newCharacterCount - 10) * 12;
    const color = `rgb(255, ${redValue}, ${redValue})`;
    characterCount.style.color = color;
  } else {
    characterCount.style.color = "red";
  }

  characterCount.textContent = newCharacterCount;
}

document.addEventListener("keydown", (e) => {
  if (e.keyCode === toggleKeyCode && shouldHandleHotkeys()) {
    if (shouldHandleHotkeys()) {
      autoGGEnabled = !autoGGEnabled;
      document.title = autoGGEnabled ? "𝙲𝚑𝚊𝚝 𝙾𝙽" : "𝙲𝚑𝚊𝚝 𝙾𝙵𝙵";
      console.log("AutoGG is now " + (autoGGEnabled ? "ON" : "OFF"));
      updateAutoGGStatus();
      updateCharacterCount();
    } else if (isChatOpen() && autoGGEnabled) {
      sendMessageToChat(editedMessage);
    }
  }

  if (e.keyCode === 27 && shouldHandleHotkeys() && storeMenu.style.display !== 'block') {
    toggleMenu();
  }
});

function updateAutoGGStatus() {
  const statusText = document.getElementById("autogg-status");
  statusText.textContent = autoGGEnabled ? "On" : "Off";
}

function saveMessage() {
  const messageInput = document.getElementById("autogg-message-input");
  editedMessage = messageInput.value;
  saveSettings();
  updateCharacterCount();
}

function saveSpeed() {
  const speedInput = document.getElementById("autogg-speed-input");
  const newSpeed = parseInt(speedInput.value, 10);

  if (!isNaN(newSpeed) && newSpeed > 0) {
    messageSpeed = newSpeed;
    saveSettings();
  } else {
    alert("Speed must be greater than 0");
  }
}

function saveToggleKey() {
  const toggleKeyInput = document.getElementById("autogg-toggle-key-input");
  const newToggleKey = toggleKeyInput.value;
  if (newToggleKey === "") {
    return;
  }
  if (!isNaN(newToggleKey) && newToggleKey >= 0 && newToggleKey <= 255) {
    toggleKeyCode = parseInt(newToggleKey, 10);
    saveSettings();
    updateToggleKeyText();
  } else {
    alert("Key must be between 0 and 255");
  }
}

function saveSettings() {
  localStorage.setItem("autogg-message-speed", messageSpeed);
  localStorage.setItem("autogg-toggle-keycode", toggleKeyCode);
  localStorage.setItem("autogg-edited-message", editedMessage);
}

loadSettings();

function updateToggleKeyText() {
  const toggleKeyLabel = document.getElementById("autogg-toggle-key-label");
  toggleKeyLabel.textContent = `Toggle Key: ${toggleKeyCode}`;
}

function toggleMenu() {
  const menu = document.getElementById("autogg-menu");
  menuVisible = !menuVisible;
  if (menuVisible) {
    const messageInput = document.getElementById("autogg-message-input");
    messageInput.value = editedMessage;
    const speedInput = document.getElementById("autogg-speed-input");
    speedInput.value = messageSpeed.toString();
    const toggleKeyInput = document.getElementById("autogg-toggle-key-input");
    toggleKeyInput.value = toggleKeyCode.toString();
    updateCharacterCount();
  } else {
  }
  menu.style.display = menuVisible ? "block" : "none";
}

const menu = document.createElement("div");
menu.id = "autogg-menu";
menu.style.display = "none";
menu.style.background = 'rgba(0, 0, 0, 0.8)';
menu.style.fontFamily = 'Hammersmith One, sans-serif';
menu.style.position = 'fixed';
menu.style.top = '20px';
menu.style.left = '20px';
menu.style.border = '1px solid #000';
menu.style.borderRadius = '8px';
menu.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.25)';
menu.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.4)';
menu.style.width = '240px';
menu.style.color = '#fff';
menu.style.fontSize = '17px';
menu.style.zIndex = '9999';
menu.style.overflowY = 'auto';
menu.style.padding = '10px';
menu.style.textAlign = 'center';

document.body.appendChild(menu);

const title = document.createElement("h1");
title.style.fontSize = '28px';
title.style.marginTop = '15px';
const autoGGStatus = document.createElement("span");
autoGGStatus.id = "autogg-status";
autoGGStatus.style.fontSize = '28px';
autoGGStatus.style.marginLeft = '10px';
title.appendChild(document.createTextNode("AutoGG"));
title.appendChild(autoGGStatus);
menu.appendChild(title);

updateAutoGGStatus();

const hr1 = document.createElement("hr");
menu.appendChild(hr1);

const messageLabel = document.createElement("label");
messageLabel.textContent = "Edited Message";
const messageInputContainer = document.createElement("div");
messageInputContainer.style.display = "flex";

const messageInput = document.createElement("input");
messageInput.id = "autogg-message-input";
messageInput.name = "autogg-message";
messageInput.type = "text";
messageInput.value = editedMessage;
messageInput.maxLength = 30;
messageInput.setAttribute("autocomplete", "off");
messageInput.style.flex = "1";
messageInput.style.marginRight = "5px";
messageInput.addEventListener("input", updateCharacterCount);

messageInput.style.marginRight = "5px";

const characterCount = document.createElement("span");
characterCount.id = "autogg-character-count";
characterCount.style.fontSize = "12px";
characterCount.style.marginRight = "10px";
characterCount.style.alignSelf = "center";

characterCount.style.color = "#909090";

messageInputContainer.appendChild(messageInput);
messageInputContainer.appendChild(characterCount);

messageLabel.appendChild(messageInputContainer);
menu.appendChild(messageLabel);

const hr2 = document.createElement("hr");
menu.appendChild(hr2);

const speedLabel = document.createElement("label");
speedLabel.textContent = "Message Delay ";
const speedInput = document.createElement("input");
speedInput.id = "autogg-speed-input";
speedInput.name = "autogg-speed";
speedInput.type = "text";
speedInput.value = messageSpeed;
speedInput.maxLength = 4;
speedInput.style.width = "45px";
speedInput.setAttribute("autocomplete", "off");
speedLabel.appendChild(speedInput);
menu.appendChild(speedLabel);

speedInput.addEventListener("input", function () {
  if (this.value.length > 4) {
    this.value = this.value.slice(0, 4);
  }
speedInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});
});

const hr3 = document.createElement("hr");
menu.appendChild(hr3);

const toggleKeyLabel = document.createElement("label");
toggleKeyLabel.textContent = "Toggle Keycode ";
const tKeyInput = document.createElement("input");
tKeyInput.id = "autogg-toggle-key-input";
tKeyInput.name = "autogg-toggle-key";
tKeyInput.type = "text";
tKeyInput.value = toggleKeyCode;
tKeyInput.maxLength = 3;
tKeyInput.style.width = "39px";
tKeyInput.setAttribute("autocomplete", "off");
toggleKeyLabel.appendChild(tKeyInput);
menu.appendChild(toggleKeyLabel);

tKeyInput.addEventListener("input", function () {
  if (this.value.length > 3) {
    this.value = this.value.slice(0, 3);
  }
    tKeyInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});
});

const hr4 = document.createElement("hr");
menu.appendChild(hr4);

const saveButton = document.createElement("button");
saveButton.textContent = "Save";
saveButton.addEventListener("click", () => {
  saveMessage();
  saveSpeed();
  saveToggleKey();
});
loadSettings();
menu.appendChild(saveButton);