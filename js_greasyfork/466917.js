// ==UserScript==
// @name         Movable ChatGPT Dialog
// @namespace    http://your-namespace.com
// @version      3.0
// @description  Adds a movable ChatGPT dialog to the webpage
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466917/Movable%20ChatGPT%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/466917/Movable%20ChatGPT%20Dialog.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Create the dialog container
  var dialogContainer = document.createElement('div');
  dialogContainer.id = 'chat-container';
  dialogContainer.style.position = 'fixed';
  dialogContainer.style.width = '300px';
  dialogContainer.style.height = '400px';
  dialogContainer.style.backgroundColor = '#ffffff';
  dialogContainer.style.border = '1px solid #000000';
  dialogContainer.style.zIndex = '9999';

  // Create the dialog header
  var dialogHeader = document.createElement('div');
  dialogHeader.style.backgroundColor = '#f0f0f0';
  dialogHeader.style.padding = '10px';
  dialogHeader.style.cursor = 'move';
  dialogHeader.textContent = 'ChatGPT Dialog';

  // Append the header to the container
  dialogContainer.appendChild(dialogHeader);

  // Create the dialog content
  var dialogContent = document.createElement('div');
  dialogContent.style.height = 'calc(100% - 40px)';
  dialogContent.style.overflowY = 'scroll';

  // Append the content to the container
  dialogContainer.appendChild(dialogContent);

  // Append the container to the body
  document.body.appendChild(dialogContainer);

  // Function to handle mouse movement
  function handleMouseMove(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;

    dialogContainer.style.left = mouseX + 'px';
    dialogContainer.style.top = mouseY + 'px';
  }

  // Function to handle mouse down event
  function handleMouseDown(event) {
    document.addEventListener('mousemove', handleMouseMove);
  }

  // Function to handle mouse up event
  function handleMouseUp(event) {
    document.removeEventListener('mousemove', handleMouseMove);
  }

  // Register event listeners
  dialogHeader.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);

  // ChatGPT interaction
  var chatContent = document.createElement('div');
  dialogContent.appendChild(chatContent);

  function sendMessage(message) {
    var userMessage = document.createElement('p');
    userMessage.textContent = 'User: ' + message;
    chatContent.appendChild(userMessage);

    // Call the ChatGPT API here to get the response
    var apiKey = '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'; // Replace with your ChatGPT API key
    var apiUrl = 'https://api.openai.com/v1/completions'; // Replace with the actual API URL
    // Send user message to the API
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
      var response = data.response;
      var chatGptMessage = document.createElement('p');
      chatGptMessage.textContent = 'ChatGPT: ' + response;
      chatContent.appendChild(chatGptMessage);

      // Scroll to the bottom of the chat content
      dialogContent.scrollTop = dialogContent.scrollHeight;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  // Retrieve and display previous conversation
  var previousConversation = localStorage.getItem('chatConversation');
  if (previousConversation) {
    chatContent.innerHTML = previousConversation;
  }

  // Prompt the user for the initial message
  var initialMessage = prompt('Please enter your initial message:');
  sendMessage(initialMessage);

  // Example usage of sendMessage function:
  // sendMessage('Hello!');

  // Save conversation to local storage
  function saveConversation() {
    localStorage.setItem('chatConversation', chatContent.innerHTML);
  }

  // Save conversation when the page is unloaded
  window.addEventListener('beforeunload', saveConversation);
})();
