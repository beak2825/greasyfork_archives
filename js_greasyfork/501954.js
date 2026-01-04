// ==UserScript==
// @name        add to remote transmission
// @namespace   https://github.com/DoWhileGeek/add-to-remote-transmission
// @description Opens a modal to add magnet links to Transmission with different destination directories.
// @author      DoWhileGeek
// @license     MIT
// @version     1.0.0
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @match       https://webtorrent.io/free-torrents
// @supportURL  https://github.com/DoWhileGeek/add-to-remote-transmission/issues
// @include     https://webtorrent.io/*
// @downloadURL https://update.greasyfork.org/scripts/501954/add%20to%20remote%20transmission.user.js
// @updateURL https://update.greasyfork.org/scripts/501954/add%20to%20remote%20transmission.meta.js
// ==/UserScript==

// Default values (can be set by the user)
var host = GM_getValue("host", "http://127.0.0.1");
var port = GM_getValue("port", "9091");
var username = GM_getValue("username", "");
var password = GM_getValue("password", "");
var subDir = "/transmission/rpc";
var webHost = host + ":" + port + subDir;

// Retrieve options from storage or use default
var options = GM_getValue("options", []);

var currentMagnetLink = null;

function postTorrentByURI(uri, destination, sessionID = null) {
  var req = JSON.stringify({
    method: "torrent-add",
    arguments: {
      filename: uri,
      "download-dir": destination,
    },
  });

  var headers = {
    "User-Agent": "Mozilla/5.0",
    Accept: "text/xml",
    Authorization: "Basic " + btoa(username + ":" + password),
  };

  if (sessionID) {
    headers["X-Transmission-Session-Id"] = sessionID;
  }

  GM_xmlhttpRequest({
    method: "POST",
    url: webHost,
    headers: headers,
    data: req,
    onload: function (response) {
      if (response.status === 200 && response.responseText.match(/success/)) {
        alert("Torrent successfully added!");
      } else if (response.responseText.match(/duplicate torrent/)) {
        alert("Torrent already exists");
      } else if (response.status === 409) {
        var newSessID = response.responseHeaders.match(
          /x-transmission-session-id: ([^\r\n]+)/i
        )[1];
        postTorrentByURI(uri, destination, newSessID);
      } else {
        console.error("Failed to add torrent:", response.responseText);
        alert("Failed to add torrent. Check console for details.");
      }
    },
    onerror: function (response) {
      console.error("Request error:", response);
      alert("Request error. Check console for details.");
    },
    ontimeout: function (response) {
      console.error("Request timeout:", response);
      alert("Request timeout. Check console for details.");
    },
  });
}

function addSelectedTorrent(destination) {
  if (currentMagnetLink && currentMagnetLink.match(/magnet:/)) {
    postTorrentByURI(currentMagnetLink, destination);
  } else {
    alert("No torrent link selected or invalid link.");
  }
}

// Helper function to traverse upwards to find a parent <a> tag
function findParentMagnetLink(element) {
  while (element && element.tagName !== "A") {
    element = element.parentElement;
  }
  return element && element.href && element.href.match(/magnet:/)
    ? element.href
    : null;
}

// Function to create and show the modal
function showModal(event) {
  event.preventDefault();

  // Modal container
  let modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "1000";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  // Modal content
  let modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "white";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "5px";
  modalContent.style.width = "300px";
  modalContent.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  modalContent.style.display = "flex";
  modalContent.style.flexDirection = "column";
  modalContent.style.gap = "8px";

  // Message
  let message = document.createElement("span");
  message.innerText = "Choose an option for the magnet link:";
  //message.style.
  modalContent.appendChild(message);

  // Options
  options
    .filter((option) => option.label !== "" && option.directory !== "")
    .forEach((option) => {
      let button = document.createElement("button");
      button.innerText = option.label;
      button.style.margin = "5px 0";
      button.onclick = function () {
        addSelectedTorrent(option.directory);
        document.body.removeChild(modal);
      };
      modalContent.appendChild(button);
    });

  // Settings button
  let settingsButton = document.createElement("button");
  settingsButton.innerText = "Settings";
  settingsButton.style.margin = "5px 0";
  settingsButton.onclick = function () {
    document.body.removeChild(modal);
    openSettings();
  };
  modalContent.appendChild(settingsButton);

  // Close modal when clicking outside of it
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // Append content to modal
  modal.appendChild(modalContent);

  // Append modal to body
  document.body.appendChild(modal);
}

// Attach event listener to all anchor tags
document.querySelectorAll("a").forEach((anchor) => {
  if (anchor.href.match(/magnet:/)) {
    anchor.addEventListener("click", function (event) {
      currentMagnetLink = anchor.href;
      showModal(event);
    });
  }
});

// Settings menu
function openSettings() {
  let settingsModal = document.createElement("div");
  settingsModal.style.position = "fixed";
  settingsModal.style.top = "0";
  settingsModal.style.left = "0";
  settingsModal.style.width = "100%";
  settingsModal.style.height = "100%";
  settingsModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  settingsModal.style.zIndex = "1000";
  settingsModal.style.display = "flex";
  settingsModal.style.justifyContent = "center";
  settingsModal.style.alignItems = "center";

  let settingsContent = document.createElement("div");
  settingsContent.style.backgroundColor = "white";
  settingsContent.style.padding = "20px";
  settingsContent.style.borderRadius = "5px";
  settingsContent.style.width = "350px";
  settingsContent.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  settingsContent.style.display = "flex";
  settingsContent.style.flexDirection = "column";
  settingsContent.style.gap = "8px";
  settingsContent.style.overflow = "hidden";

  let settingsHeader = document.createElement("h4");
  settingsHeader.innerText = "Regular Settings";
  settingsContent.appendChild(settingsHeader);

  // Host setting
  let hostLabel = document.createElement("label");
  hostLabel.innerText = "Host:";
  hostLabel.htmlFor = "hostInput";
  settingsContent.appendChild(hostLabel);

  let hostInput = document.createElement("input");
  hostInput.id = "hostInput";
  hostInput.type = "text";
  hostInput.placeholder = "Host";
  hostInput.value = GM_getValue("host", "");
  settingsContent.appendChild(hostInput);

  // Port setting
  let portLabel = document.createElement("label");
  portLabel.innerText = "Port:";
  portLabel.htmlFor = "portInput";
  settingsContent.appendChild(portLabel);

  let portInput = document.createElement("input");
  portInput.id = "portInput";
  portInput.type = "text";
  portInput.placeholder = "Port";
  portInput.value = GM_getValue("port", "");
  settingsContent.appendChild(portInput);

  // Username setting
  let usernameLabel = document.createElement("label");
  usernameLabel.innerText = "Username:";
  usernameLabel.htmlFor = "usernameInput";
  settingsContent.appendChild(usernameLabel);

  let usernameInput = document.createElement("input");
  usernameInput.id = "usernameInput";
  usernameInput.type = "text";
  usernameInput.placeholder = "Username";
  usernameInput.value = GM_getValue("username", "");
  settingsContent.appendChild(usernameInput);

  // Password setting
  let passwordLabel = document.createElement("label");
  passwordLabel.innerText = "Password:";
  passwordLabel.htmlFor = "passwordInput";
  settingsContent.appendChild(passwordLabel);

  let passwordInput = document.createElement("input");
  passwordInput.id = "passwordInput";
  passwordInput.type = "password";
  passwordInput.placeholder = "Password";
  passwordInput.value = GM_getValue("password", "");
  settingsContent.appendChild(passwordInput);

  let optionsHeader = document.createElement("h4");
  optionsHeader.innerText = "Directory Preset Options";
  settingsContent.appendChild(optionsHeader);

  let optionsContainer = document.createElement("div");
  optionsContainer.style.display = "flex";
  optionsContainer.style.flexDirection = "column";
  optionsContainer.style.gap = "16px"; // Larger gap between option groups
  settingsContent.appendChild(optionsContainer);

  // Ensure there is at least one option
  if (options.length === 0) {
    options.push({ label: "", directory: "" });
  }

  function updateOptionsUI() {
    optionsContainer.innerHTML = "";
    options.forEach((option, index) => {
      let optionDiv = document.createElement("div");
      optionDiv.style.display = "flex";
      optionDiv.style.gap = "5px";
      optionDiv.style.flexWrap = "wrap";
      optionDiv.style.width = "100%";

      let labelInput = document.createElement("input");
      labelInput.type = "text";
      labelInput.placeholder = "Label";
      labelInput.value = option.label;
      labelInput.style.flex = "1";
      optionDiv.appendChild(labelInput);

      let directoryInput = document.createElement("input");
      directoryInput.type = "text";
      directoryInput.placeholder = "Directory";
      directoryInput.value = option.directory;
      directoryInput.style.flex = "2";
      optionDiv.appendChild(directoryInput);

      let removeButton = document.createElement("button");
      removeButton.innerText = "Remove";
      removeButton.disabled = options.length === 1; // Disable if only one option
      removeButton.onclick = function () {
        options.splice(index, 1);
        updateOptionsUI();
      };
      optionDiv.appendChild(removeButton);

      optionsContainer.appendChild(optionDiv);

      // Update options array on input change
      labelInput.addEventListener("input", () => {
        option.label = labelInput.value;
      });
      directoryInput.addEventListener("input", () => {
        option.directory = directoryInput.value;
      });
    });

    let addButton = document.createElement("button");
    addButton.innerText = "Add Option";
    addButton.onclick = function () {
      options.push({ label: "", directory: "" });
      updateOptionsUI();
    };
    optionsContainer.appendChild(addButton);
  }

  updateOptionsUI();

  let saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.style.marginTop = "20px";
  saveButton.onclick = function () {
    GM_setValue("host", hostInput.value);
    GM_setValue("port", portInput.value);
    GM_setValue("username", usernameInput.value);
    GM_setValue("password", passwordInput.value);
    GM_setValue("options", options);
    document.body.removeChild(settingsModal);
  };
  settingsContent.appendChild(saveButton);

  settingsModal.appendChild(settingsContent);
  settingsModal.addEventListener("click", function (event) {
    if (event.target === settingsModal) {
      document.body.removeChild(settingsModal);
    }
  });

  document.body.appendChild(settingsModal);
}
