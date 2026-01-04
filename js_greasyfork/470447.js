// ==UserScript==
// @name         Bonk.io ChatGPT Integration
// @namespace    https://greasyfork.org/en/users/1122101
// @version      1.1
// @description  Type /cmds in the bonk chat to get started
// @author       rats410
// @match        https://bonk.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470447/Bonkio%20ChatGPT%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/470447/Bonkio%20ChatGPT%20Integration.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var lobbyChatInput = document.getElementById("newbonklobby_chat_input");
  var lobbyChatContent = document.getElementById("newbonklobby_chat_content");
  var gameChatInput = document.getElementById("ingamechatinputtext");
  var gameChatContent = document.getElementById("ingamechatcontent");
  var apiKey = null;
  var isChatGPTGeneratingResponse = false;

  apiKey = localStorage.getItem("chatGPTApiKey");

  function displayCommands() {
    var commandsMessage = "All Commands: /key, /setup, /credits, /cmds";

    var commandsDiv = document.createElement("div");
    commandsDiv.className = "chat-content-message ng-binding";
    commandsDiv.textContent = commandsMessage;
    commandsDiv.style.color = "#008000"; // Green

    if (lobbyChatContent) {
      lobbyChatContent.appendChild(commandsDiv);
    }

    if (gameChatContent) {
      gameChatContent.appendChild(commandsDiv.cloneNode(true));
    }
  }

  function listenForCommands() {
    if (lobbyChatInput && lobbyChatContent) {
      lobbyChatInput.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
          var chatValue = lobbyChatInput.value.trim();
          if (chatValue.startsWith("/cmds")) {
            displayCommands();
            lobbyChatInput.value = "";
            e.preventDefault();
          } else if (chatValue.startsWith("/key")) {
            handleKeyCommand(chatValue);
            lobbyChatInput.value = "";
            e.preventDefault();
          } else if (isChatGPTCommand(chatValue)) {
            communicateWithChatGPT(chatValue);
            e.preventDefault();
          } else if (chatValue.startsWith("/setup")) {
            showSetupInstructions();
            lobbyChatInput.value = "";
            e.preventDefault();
          } else if (chatValue.startsWith("/credits")) {
            displayCredits();
            lobbyChatInput.value = "";
            e.preventDefault();
          }
        }
      });
    }

    if (gameChatInput && gameChatContent) {
      gameChatInput.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
          var chatValue = gameChatInput.value.trim();
          if (chatValue.startsWith("/cmds")) {
            displayCommands();
            gameChatInput.value = "";
            e.preventDefault();
          } else if (chatValue.startsWith("/key")) {
            handleKeyCommand(chatValue);
            gameChatInput.value = "";
            e.preventDefault();
          } else if (isChatGPTCommand(chatValue)) {
            communicateWithChatGPT(chatValue);
            e.preventDefault();
          } else if (chatValue.startsWith("/setup")) {
            showSetupInstructions();
            gameChatInput.value = "";
            e.preventDefault();
          } else if (chatValue.startsWith("/credits")) {
            displayCredits();
            gameChatInput.value = "";
            e.preventDefault();
          }
        }
      });
    }
  }

  listenForCommands();

  function handleKeyCommand(command) {
    var args = command.substr(1).trim().split(" ");
    var commandName = args[0].toLowerCase();

    if (commandName === "key") {
      if (args.length >= 2) {
        apiKey = args.slice(1).join(" ").trim();
        localStorage.setItem("chatGPTApiKey", apiKey);
        displayInChat("API key set successfully. ChatGPT is ready to use.", "system");
      } else {
        displayInChat("No API key provided. Set API key with /key [API key here]", "system");
      }
    } else {
      // Ignore
    }
  }

  function isChatGPTCommand(message) {
  return (
    message.toLowerCase().includes("gpt") ||
    message.toLowerCase().includes("chatgpt")
  );
}

  const gptData = {
    model: "gpt-3.5-turbo",
    max_tokens: 2048,
    user: "1",
    temperature: 1,
    frequency_penalty: 0.2,
    presence_penalty: -1,
    stop: ["#", ";"]
  };

  function communicateWithChatGPT(message) {
  if (isChatGPTGeneratingResponse) {
    return;
  }
  isChatGPTGeneratingResponse = true;

  if (apiKey) {
    var requestPayload = {
      messages: [{ role: 'user', content: message }],
      ...gptData
    };

    var oHttp = new XMLHttpRequest();
    oHttp.open("POST", "https://api.openai.com/v1/chat/completions");
    oHttp.setRequestHeader("Accept", "application/json");
    oHttp.setRequestHeader("Content-Type", "application/json");
    oHttp.setRequestHeader("Authorization", "Bearer " + apiKey);

    oHttp.onreadystatechange = function() {
      if (oHttp.readyState === 4) {
        if (oHttp.status === 200) {
          var response = JSON.parse(oHttp.responseText);
          if (response.choices && response.choices.length > 0) {
            var reply = response.choices[0].message.content;
            newbonklobby_chat_input.value = "ChatGPT: " + reply;
            simulateEnterKeyPress(newbonklobby_chat_input);
          } else {
            displayInChat("Failed to generate a response from ChatGPT", "system");
          }
        } else {
          displayInChat("An error occurred while communicating with ChatGPT", "system");
        }
        isChatGPTGeneratingResponse = false;
      }
    };

    oHttp.send(JSON.stringify(requestPayload));
  } else {
    displayInChat("No API key provided. Set API key with /key [API key here] first", "system");
    isChatGPTGeneratingResponse = false;
  }
}

function simulateEnterKeyPress(element) {
  var event = new KeyboardEvent("keydown", {
    keyCode: 13,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}

  function simulatePublicChatMessage(message) {
    var chatMessageEvent = new Event('message', { bubbles: true });
    var messageData = { type: "public", content: "ChatGPT: " + message };
    Object.defineProperty(chatMessageEvent, 'data', { value: JSON.stringify(messageData) });
    document.dispatchEvent(chatMessageEvent);
  }

  function displayInChat(message, messageType) {
    var chatMessage = document.createElement("div");
    chatMessage.className = "chat-content-message";
    chatMessage.textContent = message;

    if (messageType === "system") {
      chatMessage.style.color = "#808080"; // Gray
    }

    if (lobbyChatContent) {
      lobbyChatContent.appendChild(chatMessage);
    }

    if (gameChatContent) {
      gameChatContent.appendChild(chatMessage.cloneNode(true));
    }
  }

  function showSetupInstructions() {
    var setupInstructions =
      "Use /key [API key here] to link your GPT (stored securely)." +
      "Use phrases like 'hey gpt' or 'gpt' to talk to ChatGPT.";

    var setupMessage = document.createElement("div");
    setupMessage.className = "chat-content-message";
    setupMessage.textContent = setupInstructions;
    setupMessage.style.color = "#C0C0C0"; // Silver

    if (lobbyChatContent) {
      lobbyChatContent.appendChild(setupMessage);
    }

    if (gameChatContent) {
      gameChatContent.appendChild(setupMessage.cloneNode(true));
    }
  }

  function displayCredits() {
    var creditsMessage =
      "Thanks to LEGENDBOSS123 and iNeonz for their helpful Userscripts!";

    var creditsDiv = document.createElement("div");
    creditsDiv.className = "chat-content-message";
    creditsDiv.textContent = creditsMessage;
    creditsDiv.style.color = "#FFD700"; // Gold

    if (lobbyChatContent) {
      lobbyChatContent.appendChild(creditsDiv);
    }

    if (gameChatContent) {
      gameChatContent.appendChild(creditsDiv.cloneNode(true));
    }
  }
})();
