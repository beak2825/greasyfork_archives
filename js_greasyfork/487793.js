// ==UserScript==
// @name         Infinite Craft Tools
// @author       JoshAtticus
// @version      1.1
// @description  Tools for infinite craft
// @match        https://neal.fun/infinite-craft/
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace https://greasyfork.org/users/1253827
// @downloadURL https://update.greasyfork.org/scripts/487793/Infinite%20Craft%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/487793/Infinite%20Craft%20Tools.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to upload data to Pastebin
  function uploadDataToPastebin(data) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://pastebin.com/api/api_post.php",
        data: "api_option=paste&api_dev_key=YiMYzQBSRWQmmFue-ZdTsV2wcMTBKm-H&api_paste_code=" + encodeURIComponent(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
          if (response.status === 200 && response.responseText.startsWith("https://pastebin.com/")) {
            resolve(response.responseText);
          } else {
            reject(new Error("Failed to upload data to Pastebin."));
          }
        },
        onerror: function() {
          reject(new Error("Failed to upload data to Pastebin."));
        }
      });
    });
  }

  // Function to retrieve data from Pastebin
  function retrieveDataFromPastebin(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
          if (response.status === 200) {
            resolve(response.responseText);
          } else {
            reject(new Error("Failed to retrieve data from Pastebin."));
          }
        },
        onerror: function() {
          reject(new Error("Failed to retrieve data from Pastebin."));
        }
      });
    });
  }

  // Function to clear localStorage and restore from URL
  function clearLocalStorageAndRestoreFromURL(url) {
    if (confirm("This will delete any existing data. Do you want to continue?")) {
      retrieveDataFromPastebin(url)
        .then(data => {
          localStorage.clear();
          const parsedData = JSON.parse(data);
          const infiniteCraftData = parsedData["infinite-craft-data"];
          localStorage.setItem("infinite-craft-data", infiniteCraftData);
          location.reload();
        })
        .catch(error => {
          alert("Failed to retrieve data from the provided URL.");
        });
    }
  }

  // Function to add a new item to the data
  function addItem(name, emoji) {
    const data = JSON.parse(localStorage.getItem("infinite-craft-data"));
    if (data && data.elements) {
      const newItem = {
        text: name,
        emoji: emoji,
        discovered: false
      };
      data.elements.push(newItem);
      localStorage.setItem("infinite-craft-data", JSON.stringify(data));
      alert(`Item '${name}' with emoji '${emoji}' added successfully.`);
      location.reload();
    }
  }

  // Function to delete an item from the data
  function deleteItem(name, emoji, discovered) {
    const data = JSON.parse(localStorage.getItem("infinite-craft-data"));
    if (data && data.elements) {
      const index = data.elements.findIndex(item => item.text === name && item.emoji === emoji);
      if (index !== -1) {
        const item = data.elements[index];
        const message = discovered
          ? `WARNING: THIS IS A FIRST DISCOVERY! IF YOU DELETE IT, YOU WON'T BE ABLE TO GET IT BACK!\n\nAre you sure you want to delete ${name} with emoji ${emoji}?`
          : `Are you sure you want to delete ${name} with emoji ${emoji}?`;
        if (confirm(message)) {
          data.elements.splice(index, 1);
          localStorage.setItem("infinite-craft-data", JSON.stringify(data));
          alert(`Item '${name}' with emoji '${emoji}' deleted successfully.`);
          location.reload();
        }
      } else {
        alert("Item not found.");
      }
    }
  }

  // Function to update item count
  function updateItemCount() {
    const data = JSON.parse(localStorage.getItem("infinite-craft-data"));
    const itemCountElement = document.getElementById("item-count");
    if (itemCountElement) {
      itemCountElement.textContent = `Items: ${data.elements.length}, First Discoveries: ${data.elements.filter(item => item.discovered).length}`;
    }
  }

  // Keydown event listener
  document.addEventListener("keydown", function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      const data = JSON.stringify(localStorage);
      uploadDataToPastebin(data)
        .then(url => {
          const rawURL = url.replace("pastebin.com", "pastebin.com/raw");
          const message = "Data uploaded to Pastebin successfully!\n\nCopy the URL below:\n\n" + rawURL +
            "\n\nUse Ctrl/Cmd + L on another device/browser and paste the URL to load the data.";
          alert(message);
        })
        .catch(error => {
          alert("Failed to upload data to Pastebin.");
        });
    } else if ((event.ctrlKey || event.metaKey) && event.key === "l") {
      event.preventDefault();
      const url = prompt("Enter the URL of the data to restore:");
      if (url) {
        clearLocalStorageAndRestoreFromURL(url);
      }
    } else if ((event.ctrlKey || event.metaKey) && event.key === "n") {
      event.preventDefault();
      const name = prompt("Enter the name of the item:");
      const emoji = prompt("Enter the emoji for the item:");
      if (name && emoji) {
        addItem(name, emoji);
      }
    } else if ((event.ctrlKey || event.metaKey) && event.key === "d") {
      event.preventDefault();
      const name = prompt("Enter the name of the item to delete:");
      if (name) {
        const data = JSON.parse(localStorage.getItem("infinite-craft-data"));
        if (data && data.elements) {
          const item = data.elements.find(item => item.text === name);
          if (item) {
            const message = item.discovered
              ? `WARNING: THIS IS A FIRST DISCOVERY! IF YOU DELETE IT, YOU WON'T BE ABLE TO GET IT BACK!\n\nAre you sure you want to delete ${item.text} with emoji ${item.emoji}?`
              : `Are you sure you want to delete ${item.text} with emoji ${item.emoji}?`;
            if (confirm(message)) {
              deleteItem(item.text, item.emoji, item.discovered);
            }
          } else {
            alert("Item not found.");
          }
        }
      }
    }
  });

  // Display initial count of items and first discoveries
  const itemCountElement = document.createElement("div");
  itemCountElement.id = "item-count";
  itemCountElement.style.position = "fixed";
  itemCountElement.style.bottom = "20px";
  itemCountElement.style.left = "0";
  itemCountElement.style.right = "0";
  itemCountElement.style.textAlign = "center";
  itemCountElement.style.fontSize = "18px";
  itemCountElement.style.fontWeight = "bold";
  itemCountElement.style.color = "#333";
  document.body.appendChild(itemCountElement);
  updateItemCount();

  // Update item count every 1 second
  setInterval(updateItemCount, 1000);
})();