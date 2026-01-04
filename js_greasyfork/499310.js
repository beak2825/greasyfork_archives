// ==UserScript==
// @name         Claude.ai ShareGPT Exporter
// @description  Adds "Export Chat" buttons to Claude.ai
// @version      1.0
// @author       EndlessReform
// @namespace    https://github.com/EndlessReform/claude-sharegpt-exporter
// @match        https://claude.ai/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499310/Claudeai%20ShareGPT%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/499310/Claudeai%20ShareGPT%20Exporter.meta.js
// ==/UserScript==

/*
NOTES:
- This project is a fork of GeoAnima's fork of "Export Claude.Ai" (https://github.com/TheAlanK/export-claude), licensed under the MIT license.
- The "Export All Chats" option can only be accessed from the https://claude.ai/chats URL.
*/

(function () {
  "use strict";

  const API_BASE_URL = "https://claude.ai/api";

  // Function to make API requests
  function apiRequest(method, endpoint, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        data: data ? JSON.stringify(data) : null,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            resolve(JSON.parse(response.responseText));
          } else {
            reject(
              new Error(
                `API request failed with status ${response.status}: ${response.responseText}`
              )
            );
          }
        },
        onerror: (error) => {
          reject(error);
        },
      });
    });
  }

  // Function to get the organization ID
  async function getOrganizationId() {
    let orgId = GM_getValue("orgId");
    if (typeof orgId === "undefined") {
      const organizations = await apiRequest("GET", "/organizations");
      const new_id = organizations[0].uuid;
      GM_setValue("orgId", new_id);
      return new_id;
    } else {
      return orgId;
    }
  }

  // Function to get all conversations
  async function getAllConversations(orgId) {
    return await apiRequest(
      "GET",
      `/organizations/${orgId}/chat_conversations`
    );
  }

  // Function to get conversation history
  async function getConversationHistory(orgId, chatId) {
    return await apiRequest(
      "GET",
      `/organizations/${orgId}/chat_conversations/${chatId}`
    );
  }

  // Function to download data as a file
  function downloadData(data, filename) {
    return new Promise((resolve, reject) => {
      let content = JSON.stringify(data, null, 2);
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 100);
    });
  }

  function transformChatToConversation(input) {
    const { chat_messages, current_leaf_message_uuid } = input;

    // Map to store messages by their uuid for easy lookup
    const messagesMap = new Map();
    chat_messages.forEach((message) => messagesMap.set(message.uuid, message));

    // Traverse back from the leaf to the root
    let currentMessage = messagesMap.get(current_leaf_message_uuid);
    const conversation = [];

    while (
      currentMessage &&
      currentMessage.parent_message_uuid !==
        "00000000-0000-4000-8000-000000000000"
    ) {
      conversation.unshift({
        from:
          currentMessage.sender === "assistant" ? "gpt" : currentMessage.sender,
        value: currentMessage.text,
      });
      currentMessage = messagesMap.get(currentMessage.parent_message_uuid);
    }

    // Add the root message
    if (currentMessage) {
      conversation.unshift({
        from:
          currentMessage.sender === "assistant" ? "gpt" : currentMessage.sender,
        value: currentMessage.text,
      });
    }

    return { conversations: conversation };
  }

  // Function to export a single chat
  async function exportChat(orgId, chatId, showAlert = true) {
    try {
      const originalChatData = await getConversationHistory(orgId, chatId);
      const chatData = transformChatToConversation(originalChatData);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${originalChatData.name}_${timestamp}.json`;
      await downloadData(chatData, filename);
    } catch (error) {
      alert("Error exporting chat. Please try again later.");
    }
  }

  // Function to export all chats
  async function exportAllChats(format) {
    try {
      const orgId = await getOrganizationId();
      const conversations = await getAllConversations(orgId);
      for (const conversation of conversations) {
        await exportChat(orgId, conversation.uuid, format, false);
      }
    } catch (error) {
      console.error(error);
      alert("Error exporting all chats: see browser console for details");
    }
  }

  // Function to create a button
  function createButton(text, onClick) {
    const style = document.createElement("style");
    // Add the CSS rules to the style element
    style.innerHTML = `
          #gm-export {
            position: fixed;
            top: 10px;
            right: 100px;
            padding: 6px 12px;
            color: hsl(var(--text-400) / var(--tw-text-opacity));
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 16px;
            z-index: 9999;
            border: 1px solid hsl(var(--bg-400));
            box-sizing: border-box;
          }

          #gm-export:hover {
            background-color: hsl(var(--bg-400));
          }
        `;

    // Add the style element to the document head
    document.head.appendChild(style);

    const button = document.createElement("button");
    button.textContent = text;
    button.id = "gm-export";
    button.addEventListener("click", onClick);
    document.body.appendChild(button);
  }

  // Function to remove existing export buttons
  function removeExportButtons() {
    const existingButton = document.getElementById("gm-export");
    if (existingButton) {
      existingButton.parentNode.removeChild(existingButton);
    }
  }

  // Function to initialize the export functionality
  async function initExportFunctionality() {
    removeExportButtons();
    const currentUrl = window.location.href;
    if (currentUrl.includes("/chat/")) {
      const urlParts = currentUrl.split("/");
      const chatId = urlParts[urlParts.length - 1];
      const orgId = await getOrganizationId();
      createButton("Export Chat", async () => {
        await exportChat(orgId, chatId);
      });
    } else if (currentUrl.includes("/chats")) {
      createButton("Export All Chats", async () => {
        const format = prompt("Enter the export format (json or txt):", "json");
        if (format === "json" || format === "txt") {
          await exportAllChats(format);
        } else {
          alert('Invalid export format. Please enter either "json" or "txt".');
        }
      });
    }
  }

  // Function to observe changes in the URL
  function observeUrlChanges(callback) {
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        callback();
      }
    });
    const config = { subtree: true, childList: true };
    observer.observe(document, config);
  }

  // Function to observe changes in the DOM
  function observeDOMChanges(selector, callback) {
    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector);
      if (element) {
        if (document.readyState === "complete") {
          observer.disconnect();
          callback();
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // Function to initialize the script
  async function init() {
    await initExportFunctionality();
    // Observe URL changes and reinitialize export functionality
    observeUrlChanges(async () => {
      await initExportFunctionality();
    });
  }

  // Wait for the desired element to be present in the DOM before initializing the script
  observeDOMChanges(".grecaptcha-badge", init);
})();