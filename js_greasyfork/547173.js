// ==UserScript==
// @name         Auto Collect w Mass Mail + SYNC
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Collect user IDs and send messages
// @author       GPT 4.1 & Gemini 2.0 Flash & Kimi K2 & Grok 3 & Gemini 2.5 Pro & Sonic
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/messages.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547173/Auto%20Collect%20w%20Mass%20Mail%20%2B%20SYNC.user.js
// @updateURL https://update.greasyfork.org/scripts/547173/Auto%20Collect%20w%20Mass%20Mail%20%2B%20SYNC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Persistent State ---
  let collectedUsers = [];
  let messagedUsers = [];
  let isPanelExpanded = false;

  // --- Configuration ---
  const CLOUD_WORKER_URL = "https://torn-mail-script-data-sync.winguem.workers.dev"; // Replace with your Cloudflare Worker URL
  const STORAGE_KEY = "torn_userscript_data"; // Unique key for your data

  // --- Zlib Compression/Decompression using Pako ---
  function compressData(data) {
    return new Promise((resolve, reject) => {
      const jsonString = JSON.stringify(data);

      try {
        const compressed = pako.deflate(jsonString, { level: 6 });
        // Convert Uint8Array to regular array for JSON serialization
        const compressedArray = Array.from(compressed);
        resolve(compressedArray);
      } catch (error) {
        reject(error);
      }
    });
  }

  function decompressData(compressedData) {
    return new Promise((resolve, reject) => {
      try {
        // Convert array back to Uint8Array
        const compressedUint8 = new Uint8Array(compressedData);
        const decompressed = pako.inflate(compressedUint8, { to: "string" });
        const data = JSON.parse(decompressed);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  // --- Cloud Storage Functions ---
  async function saveToCloud(data) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: `${CLOUD_WORKER_URL}/save`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          key: STORAGE_KEY,
          data: data,
        }),
        onload: function (response) {
          try {
            const result = JSON.parse(response.responseText);
            if (result.success) {
              resolve(result);
            } else {
              reject(new Error(result.error || "Save failed"));
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: function (error) {
          reject(error);
        },
      });
    });
  }

  async function loadFromCloud() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${CLOUD_WORKER_URL}/load?key=${STORAGE_KEY}`,
        onload: function (response) {
          try {
            const result = JSON.parse(response.responseText);
            if (result.success) {
              resolve(result.data);
            } else {
              reject(new Error(result.error || "Load failed"));
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: function (error) {
          reject(error);
        },
      });
    });
  }

  // --- Save/Load Menu Functions ---
  async function saveDataToCloud() {
    try {
      showToast("Compressing data...", "#33b5e5");

      // Prepare data to save
      const dataToSave = {
        collectedUsers: collectedUsers,
        messagedUsers: messagedUsers,
      };

      // Compress the data
      const compressedData = await compressData(dataToSave);

      // Save to cloud
      await saveToCloud(compressedData);

      showToast("Data saved to cloud successfully!", "#4caf50");
    } catch (error) {
      showToast("Failed to save data to cloud", "#c33");
    }
  }

  async function loadDataFromCloud() {
    try {
      showToast("Loading data from cloud...", "#33b5e5");

      // Load compressed data from cloud
      const compressedData = await loadFromCloud();

      // Decompress the data
      const loadedData = await decompressData(compressedData);

      // Restore the data
      if (loadedData && typeof loadedData === "object") {
        if (Array.isArray(loadedData.collectedUsers)) {
          collectedUsers = loadedData.collectedUsers;
        }
        if (Array.isArray(loadedData.messagedUsers)) {
          messagedUsers = loadedData.messagedUsers;
        }

        // Save to local storage as well
        saveCollectedUsers();
        saveMessagedUsers();

        // Update UI
        updateUIPanel();

        showToast("Data loaded from cloud successfully!", "#4caf50");
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      showToast("Failed to load data from cloud", "#c33");
    }
  }

  // --- Storage ---
  async function loadCollectedUsers() {
    const stored = await GM_getValue("collectedUsers", []);
    collectedUsers = Array.isArray(stored) ? stored : [];
    updateUIPanel();
  }
  function saveCollectedUsers() {
    GM_setValue("collectedUsers", collectedUsers);
  }
  async function loadMessagedUsers() {
    const stored = await GM_getValue("messagedUsers", []);
    messagedUsers = Array.isArray(stored) ? stored : [];
  }
  function saveMessagedUsers() {
    GM_setValue("messagedUsers", messagedUsers);
  }

  // --- Cookie Helpers ---
  function getCookie(cname) {
    const name = cname + "=";
    for (let cookie of decodeURIComponent(document.cookie).split(";")) {
      cookie = cookie.trimLeft();
      if (cookie.includes(name)) {
        return cookie.substring(name.length);
      }
    }
    return "";
  }
  function getRFC() {
    const rfc = getCookie("rfc_v");
    if (!rfc) {
      for (let cookie of document.cookie.split("; ")) {
        cookie = cookie.split("=");
        if (cookie[0] === "rfc_v") {
          return cookie[1];
        }
      }
    }
    return rfc;
  }

  // --- Auto-collect Valid Users ---
  function autoCollectValidUsers() {
    const userListContainer = document.querySelector(".user-info-list-wrap");
    if (!userListContainer) {
      showToast("User list not found.", "#c33");
      return;
    }

    const initialCollectedCount = collectedUsers.length;

    const validSpans = Array.from(
      userListContainer.querySelectorAll(".user-icons span")
    ).filter((s) => s.textContent === "VALID");

    validSpans.forEach((span) => {
      const userLi = span.closest("li");
      if (userLi) {
        const collectButton = userLi.querySelector(
          ".torn-collect-userid-button"
        );
        if (collectButton) {
          // The button's own click handler prevents duplicates
          collectButton.click();
        }
      }
    });

    const newCollectedCount = collectedUsers.length - initialCollectedCount;

    if (newCollectedCount > 0) {
      showToast(`Collected ${newCollectedCount} new valid users.`, "#4caf50");
    } else if (validSpans.length > 0) {
      showToast(
        "All valid users on this page are already collected.",
        "#33b5e5"
      );
    } else {
      showToast("No valid users found on this page.", "#c33");
    }
  }

  // --- UI Panel ---
  function createUIPanel() {
    let panel = document.createElement("div");
    panel.id = "torn-collected-ids-panel";
    panel.style.position = "absolute";
    panel.style.background = "#222";
    panel.style.color = "#fff";
    panel.style.padding = "15px";
    panel.style.borderRadius = "10px";
    panel.style.boxShadow = "0 2.5px 10px rgba(0,0,0,0.3)";
    panel.style.zIndex = "9999";
    panel.style.minWidth = "200px";
    panel.style.maxWidth = "400px";
    panel.style.wordBreak = "break-all";
    panel.style.whiteSpace = "normal";
    panel.style.fontSize = "16px";
    panel.innerHTML = `
      <div id="torn-panel-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div style="font-weight:bold; font-size: 22px;">Collected IDs</div>
      </div>
      <div id="torn-collected-ids-list" style="margin-bottom:10px; word-break:break-all; white-space:normal;"></div>
      <button id="torn-clear-ids-btn" style="font-size:12.5px; padding:2.5px 10px; border-radius:5px; border:none; background:#c33; color:#fff; cursor:pointer;">Clear</button>
      <button id="torn-switch-page-btn" style="font-size:12.5px; padding:2.5px 10px; border-radius:5px; border:none; background:#4caf50; color:#fff; cursor:pointer;">Switch Page</button>
    `;
    document.body.appendChild(panel);

    let originalTop = null;

    function positionPanel() {
      const header = document.querySelector(".header-wrapper-bottom");
      if (header) {
        const rect = header.getBoundingClientRect();
        const intendedTop = rect.bottom + window.scrollY + 8;
        if (originalTop === null) originalTop = intendedTop;
        if (window.scrollY + 20 > originalTop) {
          panel.style.position = "fixed";
          panel.style.top = "20px";
          panel.style.right = "20px";
          panel.style.left = "";
        } else {
          panel.style.position = "absolute";
          panel.style.top = `${intendedTop}px`;
          panel.style.right = "20px";
          panel.style.left = "";
        }
      } else {
        panel.style.position = "fixed";
        panel.style.top = "20px";
        panel.style.right = "20px";
        panel.style.left = "";
      }
    }

    positionPanel();
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel);

    panel.querySelector("#torn-clear-ids-btn").onclick = function () {
      collectedUsers = [];
      updateUIPanel();
      saveCollectedUsers();
    };

    const switchPageButton = panel.querySelector("#torn-switch-page-btn");
    switchPageButton.onclick = async function () {
      if (window.location.href.includes("messages.php")) {
        window.location.href =
          "https://www.torn.com/page.php?sid=UserList&searchConditions=inCompany&searchConditionNot=true&levelFrom=3&lastAction=1&daysOldFrom=400";
      } else {
        window.location.href = "https://www.torn.com/messages.php#/p=compose";
      }
    };

    if (
      window.location.pathname === "/messages.php" &&
      window.location.hash === "#/p=compose"
    ) {
      const sendBtn = document.createElement("button");
      sendBtn.textContent = "Send";
      sendBtn.style.background = "#4caf50";
      sendBtn.style.color = "#fff";
      sendBtn.style.fontSize = "12.5px";
      sendBtn.style.padding = "4px 10px";
      sendBtn.style.borderRadius = "4px";
      sendBtn.style.border = "none";
      sendBtn.style.cursor = "pointer";
      sendBtn.style.transition = "background-color 0.3s, opacity 0.3s";

      sendBtn.addEventListener("animationend", () => {
        sendBtn.classList.remove("torn-glow-once");
      });

      sendBtn.onclick = async function () {
        if (sendBtn.disabled) return;
        if (collectedUsers.length === 0) {
          showToast("No users to message!", "#c33");
          return;
        }
        const user = collectedUsers[0];
        const rfc = getRFC();
        if (!rfc) {
          showToast("Could not get rfc_v cookie!", "#c33");
          return;
        }
        const body = new URLSearchParams({
          step: "sendMessage",
          sendto: `${user.name} [${user.id}]`,
          msg: `<p><span style="font-size: 16px;">Hello! <br>I'm looking for a new team member for my Mining Corp, would you like to join us?</span><br><span style="font-size: 16px;">We are highly motivated to reach higher stars soon.</span><br><span style="font-size: 16px;">I can offer handsome wages, and there's also a $1,000,000 signing bonus.<br>If you&rsquo;re interested, just send over your stats and EE merits so we can talk about pay. Thanks!<br></span></p>`,
          subject: "Are you looking for a job?",
          theanon: "0",
        }).toString();

        try {
          const resp = await fetch(`/messages.php?rfcv=${rfc}`, {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: body,
            credentials: "same-origin",
          });
          if (resp.ok) {
            messagedUsers.push(user);
            collectedUsers.shift();
            updateUIPanel();
            saveCollectedUsers();
            saveMessagedUsers();
            showToast(`Message sent to ${user.name} [${user.id}]!`, "#4caf50");
            startCooldown();
          } else {
            showToast("Failed to send message.", "#c33");
          }
        } catch (e) {
          showToast("Error sending message: " + e, "#c33");
        }
      };
      let cooldown = 0;
      let cooldownInterval = null;

      // --- Beep Sound ---
      function playBeep() {
        try {
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.type = "sine";
          oscillator.frequency.value = 400; // Light beep frequency
          gainNode.gain.value = 0.3; // Volume

          oscillator.start();
          setTimeout(() => {
            oscillator.stop();
          }, 250); // Beep duration
        } catch (e) {
          console.warn("Could not play beep sound:", e);
        }
      }

      function startCooldown() {
        cooldown = 10;
        sendBtn.disabled = true;
        sendBtn.textContent = `Send (${cooldown})`;
        sendBtn.style.background = "#555";
        sendBtn.style.opacity = "0.6";
        sendBtn.style.cursor = "not-allowed";

        cooldownInterval = setInterval(() => {
          cooldown--;
          if (cooldown > 0) {
            sendBtn.textContent = `Send (${cooldown})`;
          } else {
            clearInterval(cooldownInterval);
            sendBtn.disabled = false;
            sendBtn.textContent = "Send";
            sendBtn.style.background = "#4caf50";
            sendBtn.style.opacity = "1";
            sendBtn.style.cursor = "pointer";
            sendBtn.classList.add("torn-glow-once");
            showToast("Cooldown over. Ready for another!", "#4caf50");

            // Play beep sound if there are more users to message
            if (collectedUsers.length > 0) {
              playBeep();
            }
          }
        }, 1000);
      }
      panel.querySelector("#torn-panel-header").appendChild(sendBtn);
    } else if (window.location.href.includes("page.php?sid=UserList")) {
      const autoBtn = document.createElement("button");
      autoBtn.textContent = "Auto";
      autoBtn.style.background = "#4caf50";
      autoBtn.style.color = "#fff";
      autoBtn.style.fontSize = "12.5px";
      autoBtn.style.padding = "4px 10px";
      autoBtn.style.borderRadius = "4px";
      autoBtn.style.border = "none";
      autoBtn.style.cursor = "pointer";
      autoBtn.style.transition = "background-color 0.3s, opacity 0.3s";

      autoBtn.onclick = autoCollectValidUsers;

      panel.querySelector("#torn-panel-header").appendChild(autoBtn);
    }
  }

  // --- Update UI Panel ---
  function updateUIPanel() {
    const listDiv = document.getElementById("torn-collected-ids-list");
    if (listDiv) {
      if (collectedUsers.length === 0) {
        listDiv.textContent = "";
      } else if (!isPanelExpanded) {
        // Collapsed state: show summary
        const count = collectedUsers.length;
        const playerText = count === 1 ? "player" : "players";
        listDiv.innerHTML = `<div id="torn-summary-text" style="cursor: pointer; color: #4caf50; text-decoration: underline;" title="Click to expand">${count} ${playerText} collected.</div>`;

        // Add click handler to expand
        document.getElementById("torn-summary-text").onclick = function () {
          isPanelExpanded = true;
          updateUIPanel();
        };
      } else {
        // Expanded state: show full list with collapse button
        listDiv.innerHTML = `
          <div style="margin-bottom: 10px;">
            <button id="torn-collapse-btn" style="font-size:12.5px; padding:2.5px 10px; border-radius:5px; border:none; background:#33b5e5; color:#fff; cursor:pointer;">Collapse</button>
          </div>
          ${collectedUsers
            .map(
              (entry, idx) =>
                `<div style="display: flex; justify-content: space-between; align-items: center; padding: 1px 0;">
                    <span>${entry.name} - ${entry.id}</span>
                    <span class="torn-remove-entry" data-idx="${idx}" style="color:#f55; cursor:pointer; font-weight:bold; padding-left: 10px;" title="Remove">&#10006;</span>
                  </div>`
            )
            .join("")}
        `;

        // Add click handler for collapse button
        document.getElementById("torn-collapse-btn").onclick = function () {
          isPanelExpanded = false;
          updateUIPanel();
        };

        // Add click handlers for remove buttons
        listDiv.querySelectorAll(".torn-remove-entry").forEach((el) => {
          el.onclick = function () {
            const idx = parseInt(el.getAttribute("data-idx"));
            if (!isNaN(idx)) {
              collectedUsers.splice(idx, 1);
              saveCollectedUsers();
              updateUIPanel();
            }
          };
        });
      }
    }
  }

  // --- Add "Collect ID" Buttons ---
  function addCollectButtons() {
    const userListContainer = document.querySelector(".user-info-list-wrap");
    if (!userListContainer) return;

    const profileLinks = userListContainer.querySelectorAll(
      'a[href*="/profiles.php?XID="]'
    );

    profileLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const match = href.match(/\/profiles\.php\?XID=(\d+)/);

      if (
        match &&
        match[1] &&
        !link.nextElementSibling?.classList.contains(
          "torn-collect-userid-button"
        )
      ) {
        const userID = match[1];
        let username = "";
        for (const node of link.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            username = node.textContent.trim();
            if (username) break;
          }
        }

        // Determine user validity
        let isValid = false;
        const userIcons = link
          .closest("li")
          ?.querySelector(".user-icons ul#iconTray");
        const isMessaged = messagedUsers.some((entry) => entry.id === userID);

        if (isMessaged) {
          isValid = false; // Previously messaged users are always invalid
        } else {
          const jobIcon = Array.from(
            userIcons?.querySelectorAll("li.iconShow") || []
          ).find((icon) =>
            icon.id.match(/icon(21|22|23|24|25|26)___[a-f0-9]+/)
          );
          if (!jobIcon) {
            isValid = true; // Jobless users are valid
          } else {
            const jobTitle = jobIcon.getAttribute("title") || "";
            const validRoles = [
              "Principal in the Education System",
              "Brain Surgeon at the Hospital",
              "Federal Judge at the Courthouse",
            ];
            const validWorkplaces = ["Grocer", "Casino", "Army"];
            const invalidWorkplaces = [
              "Education System",
              "Hospital",
              "Courthouse",
            ];

            // Check for Vice-Principal specifically as invalid
            if (jobTitle.includes("Vice-Principal")) {
              isValid = false;
            }
            // Check if user has a valid role
            else if (validRoles.some((role) => jobTitle.includes(role))) {
              isValid = true;
            }
            // Check if user is in a valid workplace
            else if (
              validWorkplaces.some((place) => jobTitle.includes(place))
            ) {
              isValid = true;
            }
            // Check if user is in an invalid workplace but not in a valid role
            else if (
              invalidWorkplaces.some((place) => jobTitle.includes(place))
            ) {
              isValid = false;
            }
          }
        }

        // Add validity indicator
        if (userIcons) {
          const validitySpan = document.createElement("span");
          validitySpan.style.fontSize = "12px";
          validitySpan.style.fontWeight = "bold";
          validitySpan.style.marginLeft = "5px";
          validitySpan.textContent = isValid ? "VALID" : "INVALID";
          validitySpan.style.color = isValid ? "#00ff00" : "#ff0000";
          userIcons.appendChild(validitySpan);
        }

        const button = document.createElement("button");
        button.textContent = "Collect ID";
        button.classList.add("torn-collect-userid-button");
        button.style.marginLeft = "5px";
        button.style.fontSize = "10px";
        button.style.padding = "2px 5px";
        button.style.cursor = "pointer";
        button.style.border = "1px solid #ccc";
        button.style.borderRadius = "3px";
        button.style.backgroundColor = isMessaged ? "#ff8282" : "#e8e8e8";
        button.style.color = "#000000";
        button.style.lineHeight = "1";
        button.style.verticalAlign = "middle";

        button.addEventListener("click", (e) => {
          e.preventDefault();
          if (!collectedUsers.some((entry) => entry.id === userID)) {
            collectedUsers.push({ name: username, id: userID });
            updateUIPanel();
            saveCollectedUsers();
            button.textContent = "Collected!";
            setTimeout(() => {
              button.textContent = "Collect ID";
            }, 1200);
          }
        });

        link.parentNode.insertBefore(button, link.nextSibling);
      }
    });
  }

  // --- Inject CSS for Glow Animation ---
  function addGlowAnimation() {
    const style = document.createElement("style");
    style.textContent = `
          @keyframes torn-glow-animation {
              0% { box-shadow: 0 0 3px #4caf50; }
              50% { box-shadow: 0 0 15px #4caf50, 0 0 10px #6fdb73 inset; }
              100% { box-shadow: 0 0 3px #4caf50; }
          }
          .torn-glow-once {
              animation: torn-glow-animation 0.8s 1 ease-out;
          }
      `;
    document.head.appendChild(style);
  }

  // --- MutationObserver for Dynamic Content ---
  const observer = new MutationObserver(() => {
    addCollectButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // --- Initial Setup ---
  async function startup() {
    addGlowAnimation();
    await loadMessagedUsers();
    await loadCollectedUsers();
    createUIPanel();
    addCollectButtons();
    updateUIPanel();

    // Register menu commands
    GM_registerMenuCommand("Save Data to Cloud", saveDataToCloud);
    GM_registerMenuCommand("Load Data from Cloud", loadDataFromCloud);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startup);
  } else {
    startup();
  }

  // --- Toast Notification ---
  function showToast(message, color = "#333") {
    let toast = document.getElementById("torn-toast-message");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "torn-toast-message";
      toast.style.position = "fixed";
      toast.style.bottom = "40px";
      toast.style.right = "40px";
      toast.style.background = color;
      toast.style.color = "#fff";
      toast.style.padding = "12px 24px";
      toast.style.borderRadius = "6px";
      toast.style.boxShadow = "0 2.5px 10px rgba(0,0,0,0.3)";
      toast.style.fontSize = "16px";
      toast.style.zIndex = "10000";
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.opacity = "0";
    }, 1800);
  }
})();
