// ==UserScript==
// @name         Torn Copy Chat Button [Chat2.0]
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Export chat messages from Torn
// @author       Latinobull14[2881384]
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529530/Torn%20Copy%20Chat%20Button%20%5BChat20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/529530/Torn%20Copy%20Chat%20Button%20%5BChat20%5D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Disable debugging
  const DEBUG = false;

  function debugLog(...args) {
    if (DEBUG) {
      console.log('[Chat Copy Button]', ...args);
    }
  }

  // Helper function to find elements by partial class name
  function getElementByPartialClassName(parent, partialClassName) {
    if (!parent) {
      debugLog(
        'Parent element is null or undefined in getElementByPartialClassName'
      );
      return null;
    }

    try {
      const elements = parent.querySelectorAll('*');
      for (let i = 0; i < elements.length; i++) {
        // Check if element has classList (safer than className)
        if (elements[i].classList && elements[i].classList.length > 0) {
          // Convert classList to array and check each class
          const classArray = Array.from(elements[i].classList);
          for (let j = 0; j < classArray.length; j++) {
            if (classArray[j].includes(partialClassName)) {
              return elements[i];
            }
          }
        } else if (typeof elements[i].className === 'string') {
          // Fallback to className if it's a string
          const classes = elements[i].className.split(' ');
          for (let j = 0; j < classes.length; j++) {
            if (classes[j].includes(partialClassName)) {
              return elements[i];
            }
          }
        }
      }
    } catch (error) {
      debugLog('Error in getElementByPartialClassName:', error);
    }
    return null;
  }

  // Function to find all elements by partial class name
  function getElementsByPartialClassName(parent, partialClassName) {
    if (!parent) {
      debugLog(
        'Parent element is null or undefined in getElementsByPartialClassName'
      );
      return [];
    }

    const result = [];
    try {
      const elements = parent.querySelectorAll('*');
      for (let i = 0; i < elements.length; i++) {
        // Check if element has classList (safer than className)
        if (elements[i].classList && elements[i].classList.length > 0) {
          // Convert classList to array and check each class
          const classArray = Array.from(elements[i].classList);
          for (let j = 0; j < classArray.length; j++) {
            if (classArray[j].includes(partialClassName)) {
              result.push(elements[i]);
              break;
            }
          }
        } else if (typeof elements[i].className === 'string') {
          // Fallback to className if it's a string
          const classes = elements[i].className.split(' ');
          for (let j = 0; j < classes.length; j++) {
            if (classes[j].includes(partialClassName)) {
              result.push(elements[i]);
              break;
            }
          }
        }
      }
    } catch (error) {
      debugLog('Error in getElementsByPartialClassName:', error);
    }
    return result;
  }

  // Function to safely get class name from an element
  function getSafeClassName(element) {
    if (!element) return '';

    try {
      if (element.classList && element.classList.length > 0) {
        return Array.from(element.classList).join(' ');
      } else if (typeof element.className === 'string') {
        return element.className;
      }
    } catch (error) {
      debugLog('Error in getSafeClassName:', error);
    }
    return '';
  }

  // Function to find the chat box body directly
  function findChatBoxBody(chatBoxHeader) {
    try {
      // First, find the parent chat box container
      let chatBox = null;
      let currentElement = chatBoxHeader;

      // Go up the DOM tree to find the chat box container
      while (currentElement && !chatBox) {
        if (getSafeClassName(currentElement).includes('chat-box___')) {
          chatBox = currentElement;
          break;
        }
        currentElement = currentElement.parentElement;
      }

      if (!chatBox) {
        return null;
      }

      // Look for a div with style="height: X" which typically contains the chat body
      const heightDivs = chatBox.querySelectorAll('div[style*="height"]');
      if (heightDivs.length > 0) {
        // The first child of this div is usually the chat-box-body
        for (let i = 0; i < heightDivs.length; i++) {
          const children = heightDivs[i].children;
          for (let j = 0; j < children.length; j++) {
            if (getSafeClassName(children[j]).includes('chat-box-body')) {
              return children[j];
            }
          }

          // If we didn't find it in the children, check if the height div itself contains messages
          const messages = getElementsByPartialClassName(
            heightDivs[i],
            'chat-box-message'
          );
          if (messages.length > 0) {
            return heightDivs[i];
          }
        }
      }

      // Direct search for chat-box-body
      const chatBoxBody = getElementByPartialClassName(
        chatBox,
        'chat-box-body'
      );
      if (chatBoxBody) {
        return chatBoxBody;
      }

      return null;
    } catch (error) {
      debugLog('Error in findChatBoxBody:', error);
      return null;
    }
  }

  // Function to extract and format chat messages based on the actual HTML structure
  function extractChatMessages(chatBoxBody) {
    if (!chatBoxBody) {
      return '';
    }

    let formattedChat = '';
    // Keep track of processed messages to avoid duplicates
    const processedMessages = new Set();
    // Keep track of the current timestamp
    let currentTimestamp = '';
    // Keep track of the last sender
    let lastSender = '';
    // Keep track of the last timestamp-sender combination
    let lastTimestampSender = '';

    try {
      // Find all direct children of the chat box body - these are message groups
      const messageGroups = chatBoxBody.children;

      // Process each message group
      for (let i = 0; i < messageGroups.length; i++) {
        const group = messageGroups[i];

        // Skip the last message timestamp if present
        if (getSafeClassName(group).includes('lastmessage-timestamp')) {
          continue;
        }

        // Check if this group has a timestamp
        const timestampDiv = getElementByPartialClassName(
          group,
          'chat-box-message__timestamp'
        );
        if (timestampDiv) {
          const timestampP = timestampDiv.querySelector('p');
          if (timestampP) {
            currentTimestamp = timestampP.textContent.trim();
          }
        }

        // Find all message divs in this group
        const messageDivs = getElementsByPartialClassName(
          group,
          'chat-box-message'
        );

        // Process each message
        messageDivs.forEach(messageDiv => {
          // Find the sender element
          const senderElement = getElementByPartialClassName(
            messageDiv,
            'chat-box-message__sender'
          );

          // Find the message text element
          const messageElement = getElementByPartialClassName(
            messageDiv,
            'text-message'
          );

          if (senderElement && messageElement) {
            // Extract sender name (remove the colon)
            const senderName = senderElement.textContent
              .trim()
              .replace(':', '');

            // Extract message text and clean it up
            let messageText = messageElement.textContent;

            // Clean up the message text - remove extra whitespace and normalize line breaks
            messageText = messageText.replace(/\s+/g, ' ').trim();

            // Create a unique key for this message to detect duplicates
            const messageKey = `${senderName}-${messageText}`;

            // Skip if we've already processed this message
            if (processedMessages.has(messageKey)) {
              return;
            }

            // Mark this message as processed
            processedMessages.add(messageKey);

            // Create the current timestamp-sender combination
            const currentTimestampSender = `${currentTimestamp} ${senderName}`;

            // Add to formatted chat with optimized formatting
            if (currentTimestamp) {
              if (currentTimestampSender === lastTimestampSender) {
                // Same sender and timestamp - just add the message without header
                formattedChat += `${messageText}\n`;
              } else {
                // New sender or timestamp - add full header with blank line if not the first message
                if (formattedChat !== '') {
                  formattedChat += '\n';
                }
                formattedChat += `${currentTimestamp} ${senderName}:\n${messageText}\n`;
                // Update the last timestamp-sender combination
                lastTimestampSender = currentTimestampSender;
              }
            } else {
              // No timestamp case
              if (senderName === lastSender) {
                // Same sender - just add the message without sender name
                formattedChat += `${messageText}\n`;
              } else {
                // New sender - add sender name with blank line if not the first message
                if (formattedChat !== '') {
                  formattedChat += '\n';
                }
                formattedChat += `${senderName}:\n${messageText}\n`;
                // Update the last sender
                lastSender = senderName;
              }
            }
          }
        });
      }
    } catch (error) {
      debugLog('Error in extractChatMessages:', error);
    }

    return formattedChat;
  }

  // Function to show notification
  function showNotification(message, isError = false, button = null) {
    try {
      // Remove any existing notifications
      const existingNotifications = document.querySelectorAll(
        '.chat-copy-notification'
      );
      existingNotifications.forEach(notification => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      });

      // Create notification container
      const notification = document.createElement('div');
      notification.className = 'chat-copy-notification';
      notification.style.position = 'fixed';
      notification.style.top = '20px'; // Changed from bottom to top
      notification.style.right = '20px';
      notification.style.backgroundColor = isError
        ? 'rgba(200, 0, 0, 0.9)'
        : 'rgba(0, 128, 0, 0.9)';
      notification.style.color = 'white';
      notification.style.padding = '12px 20px';
      notification.style.borderRadius = '4px';
      notification.style.zIndex = '9999';
      notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      notification.style.display = 'flex';
      notification.style.alignItems = 'center';
      notification.style.fontFamily = 'Arial, sans-serif';
      notification.style.fontSize = '14px';

      // Add icon based on success/error
      const icon = document.createElement('div');
      icon.style.marginRight = '10px';
      icon.style.fontSize = '18px';
      icon.textContent = isError ? '❌' : '✅';
      notification.appendChild(icon);

      // Add message
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      notification.appendChild(messageElement);

      // If a button was provided, highlight it briefly
      if (button) {
        const originalColor = button.style.backgroundColor;
        button.style.backgroundColor = isError
          ? 'rgba(255, 0, 0, 0.3)'
          : 'rgba(0, 255, 0, 0.3)';
        setTimeout(() => {
          button.style.backgroundColor = originalColor;
        }, 500);
      }

      document.body.appendChild(notification);

      // Add close button
      const closeButton = document.createElement('div');
      closeButton.textContent = '×';
      closeButton.style.marginLeft = '15px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.fontSize = '18px';
      closeButton.style.fontWeight = 'bold';
      closeButton.addEventListener('click', () => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      });
      notification.appendChild(closeButton);

      // Remove the notification after 3 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          // Fade out animation
          notification.style.transition = 'opacity 0.5s';
          notification.style.opacity = '0';
          setTimeout(() => {
            if (notification.parentNode) {
              document.body.removeChild(notification);
            }
          }, 500);
        }
      }, 3000);
    } catch (error) {
      debugLog('Error showing notification:', error);
    }
  }

  // Function to copy text to clipboard
  function copyToClipboard(text, button) {
    if (!text) {
      showNotification('No chat messages found to copy', true, button);
      return;
    }

    try {
      // Use the newer Clipboard API if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            showNotification('Chat copied to clipboard!', false, button);
          })
          .catch(err => {
            // Fall back to the older method
            copyToClipboardFallback(text, button);
          });
      } else {
        // Use the older method for browsers that don't support the Clipboard API
        copyToClipboardFallback(text, button);
      }
    } catch (error) {
      debugLog('Error in copyToClipboard:', error);
      showNotification('Failed to copy: ' + error.message, true, button);
    }
  }

  // Fallback method for copying to clipboard
  function copyToClipboardFallback(text, button) {
    try {
      // Create a temporary textarea element
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);

      // Select and copy the text
      textarea.select();
      const success = document.execCommand('copy');

      // Remove the temporary element
      document.body.removeChild(textarea);

      if (success) {
        showNotification('Chat copied to clipboard!', false, button);
      } else {
        showNotification('Failed to copy chat. Try again.', true, button);
      }
    } catch (error) {
      debugLog('Error in copyToClipboardFallback:', error);
      showNotification('Failed to copy: ' + error.message, true, button);
    }
  }

  // Function to add the custom button to a chat box header
  function addCustomButton(chatBoxHeader) {
    try {
      // Find the actions container in the header using partial class name
      const actionsContainer = getElementByPartialClassName(
        chatBoxHeader,
        'chat-box-header__actions'
      );
      if (!actionsContainer) {
        return;
      }

      // Check if our button already exists to avoid duplicates
      if (actionsContainer.querySelector('.custom-chat-button')) {
        return;
      }

      // Get the class name of the existing action wrapper buttons for consistent styling
      const existingButtons = actionsContainer.children;
      let actionWrapperClass = '';
      if (existingButtons.length > 0) {
        // Extract the full class name from an existing button
        actionWrapperClass = getSafeClassName(existingButtons[0]);
      } else {
        // Fallback class if no existing buttons are found
        actionWrapperClass =
          'chat-box-header__action-wrapper custom-chat-button';
      }

      // Create the new button with the same styling as the existing buttons
      const customButton = document.createElement('button');
      customButton.type = 'button';
      customButton.className = actionWrapperClass + ' custom-chat-button';
      customButton.title = 'Copy Chat';

      // Create the SVG icon for the button (clipboard icon)
      customButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="custom-chat-icon">
                  <defs>
                      <linearGradient id="custom_button_gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                          <stop offset="0" stop-color="#868686"></stop>
                          <stop offset="1" stop-color="#656565"></stop>
                      </linearGradient>
                  </defs>
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" 
                        fill="url(#custom_button_gradient)"></path>
              </svg>
          `;

      // Add click event listener
      customButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the chat header click event from firing

        try {
          // Find the chat box body directly from the header
          const chatBoxBody = findChatBoxBody(chatBoxHeader);

          if (!chatBoxBody) {
            showNotification(
              'Error: Could not find chat messages',
              true,
              customButton
            );
            return;
          }

          // Extract and format chat messages
          const formattedChat = extractChatMessages(chatBoxBody);

          if (!formattedChat) {
            showNotification(
              'No chat messages found to copy',
              true,
              customButton
            );
            return;
          }

          // Copy to clipboard
          copyToClipboard(formattedChat, customButton);
        } catch (error) {
          debugLog('Error in button click handler:', error);
          showNotification('Error: ' + error.message, true, customButton);
        }
      });

      // Insert the button at the beginning of the actions container (left side)
      actionsContainer.insertBefore(customButton, actionsContainer.firstChild);
    } catch (error) {
      debugLog('Error in addCustomButton:', error);
    }
  }

  // Function to process all chat boxes in the document
  function processChatBoxes() {
    try {
      // Find all chat box headers
      const chatBoxHeaders = getElementsByPartialClassName(
        document,
        'chat-box-header'
      );

      // Add buttons to each header
      chatBoxHeaders.forEach(addCustomButton);

      return chatBoxHeaders.length > 0;
    } catch (error) {
      debugLog('Error in processChatBoxes:', error);
      return false;
    }
  }

  // Function to check for chat containers and monitor for changes
  function monitorChatContainers() {
    try {
      // Find all potential chat container elements
      const chatContainers = [
        ...document.querySelectorAll('.group-chat-box___HzH0r'),
        ...document.querySelectorAll('[class*="chat-app"]'),
        ...document.querySelectorAll('[class*="chat-list"]'),
        ...document.querySelectorAll('[class*="chat-box-wrapper"]'),
      ];

      // Set up mutation observers for each container
      chatContainers.forEach(container => {
        // Skip if we've already set up an observer for this container
        if (container.dataset.chatObserverSet === 'true') {
          return;
        }

        // Mark this container as having an observer
        container.dataset.chatObserverSet = 'true';

        // Create a mutation observer for this container
        const observer = new MutationObserver(function (mutations) {
          // Process any new chat boxes that might have appeared
          processChatBoxes();
        });

        // Start observing the container
        observer.observe(container, {
          childList: true,
          subtree: true,
        });
      });

      // Also observe the body for new chat containers that might appear
      if (!document.body.dataset.chatContainerObserverSet) {
        document.body.dataset.chatContainerObserverSet = 'true';

        const bodyObserver = new MutationObserver(function (mutations) {
          // Check if any new chat containers have been added
          const foundNewContainers = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => {
              if (node.nodeType !== Node.ELEMENT_NODE) return false;

              // Check if this is a chat container or contains one
              const isChatContainer =
                node.className &&
                (node.className.includes('group-chat-box') ||
                  node.className.includes('chat-app') ||
                  node.className.includes('chat-list') ||
                  node.className.includes('chat-box-wrapper'));

              // If it's a container, set up an observer for it
              if (isChatContainer && node.dataset.chatObserverSet !== 'true') {
                node.dataset.chatObserverSet = 'true';

                const containerObserver = new MutationObserver(() => {
                  processChatBoxes();
                });

                containerObserver.observe(node, {
                  childList: true,
                  subtree: true,
                });

                return true;
              }

              // Check if it contains chat containers
              const containsContainers =
                node.querySelector('.group-chat-box___HzH0r') ||
                node.querySelector('[class*="chat-app"]') ||
                node.querySelector('[class*="chat-list"]') ||
                node.querySelector('[class*="chat-box-wrapper"]');

              if (containsContainers) {
                // Run the monitor function again to set up observers for these new containers
                setTimeout(monitorChatContainers, 100);
                return true;
              }

              return false;
            });
          });

          // If we found new containers, process chat boxes
          if (foundNewContainers) {
            processChatBoxes();
          }
        });

        bodyObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    } catch (error) {
      debugLog('Error in monitorChatContainers:', error);
    }
  }

  // Function to initialize the script
  function initialize() {
    try {
      // First, process any existing chat boxes
      const foundExistingChats = processChatBoxes();

      // Set up monitoring for chat containers
      monitorChatContainers();

      // Set up a periodic check for new chat boxes
      setInterval(() => {
        processChatBoxes();
      }, 2000); // Check every 2 seconds

      return foundExistingChats;
    } catch (error) {
      debugLog('Error in initialize:', error);
      return false;
    }
  }

  // Wait for the page to load completely
  window.addEventListener('load', function () {
    // Start the script after a short delay to ensure all elements are loaded
    setTimeout(initialize, 1000);
  });

  // Also run on document ready for faster initialization
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    setTimeout(initialize, 1000);
  }
})();
