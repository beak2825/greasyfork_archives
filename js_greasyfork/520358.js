// ==UserScript==
// @name        send to qbit for releases.moe
// @description send to qbittorrent directly from seadex
// @namespace   Violentmonkey Scripts
// @match       https://releases.moe/*
// @grant       none
// @version     1.0
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @licence     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520358/send%20to%20qbit%20for%20releasesmoe.user.js
// @updateURL https://update.greasyfork.org/scripts/520358/send%20to%20qbit%20for%20releasesmoe.meta.js
// ==/UserScript==

// Function to set up qBittorrent settings
async function setUpQBittorrentSettings() {
  const qBittorrentUrl = prompt("Enter qBittorrent WEB UI address:", GM_getValue("qBittorrentUrl", ""));
  const username = prompt("Enter qBittorrent WEB UI username:", GM_getValue("username", ""));
  const password = prompt("Enter qBittorrent WEB UI password:", GM_getValue("password", ""));

  GM_setValue("qBittorrentUrl", qBittorrentUrl);
  GM_setValue("username", username);
  GM_setValue("password", password);
  alert("qBittorrent settings saved.");
}

// Function to send torrent to qBittorrent
function sendToQBittorrent(downloadUrl) {
  const qBittorrentUrl = GM_getValue("qBittorrentUrl");
  const username = GM_getValue("username");
  const password = GM_getValue("password");

  if (!qBittorrentUrl || !username || !password) {
    alert("Please configure your qBittorrent settings first.");
    setUpQBittorrentSettings();
    return;
  }

  GM_xmlhttpRequest({
    method: "POST",
    url: `${qBittorrentUrl}/api/v2/auth/login`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    onload: function (authResponse) {
      if (authResponse.status === 200 && authResponse.responseText === "Ok.") {
        GM_xmlhttpRequest({
          method: "POST",
          url: `${qBittorrentUrl}/api/v2/torrents/add`,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          data: `urls=${encodeURIComponent(downloadUrl)}`,
          onload: function (addResponse) {
            if (addResponse.status === 200) {
              alert("Torrent added successfully.");
            } else {
              alert(`Failed to add torrent: ${addResponse.responseText}`);
            }
          },
          onerror: function (error) {
            alert(`Failed to add torrent: ${error.message}`);
          },
        });
      } else {
        alert(`Authentication failed: ${authResponse.responseText} (HTTP ${authResponse.status})`);
      }
    },
    onerror: function (error) {
      alert(`Error during authentication: ${error.message}`);
    },
  });
}

// Register menu command for settings
GM_registerMenuCommand("Configure qBittorrent Settings", setUpQBittorrentSettings);

// Function to add the "qBit" button to links
function addQBitButton(link) {
  // Check if the button already exists
  if (link.parentNode.querySelector("a.qbit-link")) return;

  const newLink = document.createElement("a");
  newLink.innerText = "Nyaa to QBit";
  newLink.href = "#";
  newLink.className = "qbit-link " + link.className;
  const dlUrl = link.href.replace("view", "download") + ".torrent";

  newLink.onclick = function () {
    sendToQBittorrent(dlUrl);
    newLink.innerText = "Adding..."; // Visual feedback
  };
  link.parentNode.appendChild(newLink);
}

// Function to process new nodes for relevant links
function processNewNodes(nodes) {
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const links = node.querySelectorAll("a[href*='nyaa.si']");
      links.forEach(addQBitButton);
    }
  });
}

// Observe dynamically added content efficiently
const observer = new MutationObserver((mutations) => {
  const newNodes = [];
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      newNodes.push(node);
    });
  });

  if (newNodes.length > 0) {
    processNewNodes(newNodes);
  }
});

// Start observing the container where links are added
const container = document.body; // Adjust to a more specific element if possible
observer.observe(container, { childList: true, subtree: true });

// Initial link processing
const initialLinks = document.querySelectorAll("a[href*='nyaa.si']");
initialLinks.forEach(addQBitButton);
