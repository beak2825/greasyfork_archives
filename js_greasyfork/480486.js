// ==UserScript==
// @name         Arras.io Chat GUI Template
// @description  Allows you to show words above your name in Arras.io
// @namespace    https://google.com/
// @version      1.0.0
// @author       ruubei
// @match        *://arras.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480486/Arrasio%20Chat%20GUI%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/480486/Arrasio%20Chat%20GUI%20Template.meta.js
// ==/UserScript==

(function() {
  let chatOpen = false;
  let chatInput;

  const openChat = () => {
    if (!chatOpen) {
      chatInput = document.createElement('input');
      chatInput.type = 'text';
      chatInput.style.position = 'fixed';
      chatInput.style.bottom = '10px';
      chatInput.style.left = '10px';
      chatInput.style.width = '200px';
      chatInput.style.padding = '5px';
      chatInput.style.border = '1px solid black';
      chatInput.addEventListener('keydown', handleChatInput);
      document.body.appendChild(chatInput);
      chatInput.focus();
      chatOpen = true;
    }
  };

  const closeChat = () => {
    if (chatOpen) {
      document.body.removeChild(chatInput);
      chatOpen = false;
    }
  };

  const handleChatInput = (event) => {
    if (event.key === 'p') {
      const message = chatInput.value.trim();
      if (message !== '') {
        // Replace 'YOUR NAME' with your actual in-game name
        const name = 'YOUR NAME';
        const chatMessage = `^${name}^: ${message}`;
        chatInput.value = '';
        // Replace 'Socket' with the actual variable name for your socket connection
        // For example, if your socket connection variable is '123', replace 'Socket' with '123'
        // You may need to inspect the Arras.io page to find the correct variable name
        // Send the chat message to the server
          Socket.send('m', chatMessage);
      }
      closeChat();
    }
  };

  // Listen for the 'p' key press to open/close the chat GUI
  window.addEventListener('keydown', (event) => {
    if (event.key === 'p') {
      if (!chatOpen) {
        openChat();
      } else {
        closeChat();
      }
    }
  });
})();