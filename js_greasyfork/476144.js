// ==UserScript==
// @name          c.ai Neo Panel Edit Message
// @namespace     c.ai Neo Panel Edit Message
// @match         https://*.character.ai/chat*
// @version       1.2
// @description   Lets you edit the last message
// @author        vishanka and jenpai
// @license       MIT
// @icon          https://i.imgur.com/iH2r80g.png
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/476144/cai%20Neo%20Panel%20Edit%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/476144/cai%20Neo%20Panel%20Edit%20Message.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Open a WebSocket connection at the start of the script
let socket;

function connectWebSocket() {
  // Check if the WebSocket is closed or undefined
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    // Reopen the WebSocket
    socket = new WebSocket('wss://neo.character.ai/ws/');

    // WebSocket onopen event handler
    socket.addEventListener('open', (event) => {
      console.log('WebSocket opened');
      // Handle any actions you want upon successful WebSocket connection
    });

    // WebSocket onmessage event handler
    socket.addEventListener('message', (event) => {
        try {
            const response = JSON.parse(event.data);
            console.log('[CUSTOM] Received message:', response);

            if (response.command === 'update_turn') {
            window.location.reload();

            }
        } catch (error) {
            console.error('[CUSTOM] Error handling WebSocket message:', error);
        }
    });



    // WebSocket onclose event handler
    socket.addEventListener('close', (event) => {
      console.log('WebSocket closed. Reconnecting...');
      // Reconnect the WebSocket when it's closed
      connectWebSocket();
    });

    // WebSocket onerror event handler
    socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
      // Handle any errors that occur with the WebSocket
    });
  }
}

// Call the function to initiate the WebSocket connection
connectWebSocket();
    // Listen for the WebSocket connection to open
    socket.addEventListener('open', () => {
        console.log('[CUSTOM] WebSocket connection opened.');
    });

    // Listen for errors
    socket.addEventListener('error', (error) => {
        console.error('[CUSTOM] WebSocket error:', error);
    });

    // Listen for the WebSocket connection to close
    socket.addEventListener('close', () => {
        console.log('[CUSTOM] WebSocket connection closed.');
    });



    // Create a button element
const button = document.createElement('button');
button.id = 'editButton';
button.style.position = 'absolute';
button.style.top = '18px';
button.style.width = 'auto';
button.style.height = '18px';
button.style.padding = '0';
button.style.zIndex = '9999';
button.style.border = 'none';
button.style.display = 'flex';
button.style.justifyContent = 'center';
button.style.alignItems = 'center';
button.style.backgroundColor = 'transparent';
button.style.right = '140px';

  // Adjust 'right' style to 20% for phones
function updateRightStyle() {
  if (window.innerWidth <= 600) {
    button.style.right = '20%';
  } else {
    // For other devices
    button.style.right = '140px';
  }
}
// Update the 'left' style initially
updateRightStyle();

// Update the 'left' style when the window is resized
window.addEventListener('resize', updateRightStyle);



const iconContainer = document.createElement('div');
iconContainer.style.display = 'flex';
iconContainer.style.justifyContent = 'center';
iconContainer.style.alignItems = 'center';

// Add the text before the icon in the iconContainer
iconContainer.innerHTML = '<span style="margin-right: 5px; position: relative; top: -3px; color: #C1BBAF; font-weight: bold;">Save</span><svg stroke="currentColor" fill="#C1BBAF" stroke-width="0" viewBox="0 4 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;" data-darkreader-inline-fill="" data-darkreader-inline-stroke=""><path fill="none" d="M0 0h24v24H0z"></path><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"></path></svg>';

// Append the iconContainer to the button
button.appendChild(iconContainer);
// Add mouseover event listener to change background color
button.addEventListener('mouseover', () => {
  button.style.backgroundColor = '#3B362D';
});

// Add mouseout event listener to reset background color
button.addEventListener('mouseout', () => {
  button.style.backgroundColor = 'transparent';
});

// Set the SVG as the innerHTML of the button




const textBox = document.createElement('textarea');
textBox.placeholder = 'Enter new reply';
textBox.style.position = 'absolute';
textBox.style.top = '45px';
textBox.style.left = '60px';
textBox.style.zIndex = '9999';
textBox.style.width = '85%';
textBox.style.resize = 'none';
textBox.style.overflowY = 'auto';
textBox.style.height = '60%';

textBox.addEventListener('input', () => {
  const maxLength = 1000;
  const currentText = textBox.value;

  if (currentText.length > maxLength) {
    textBox.value = currentText.slice(0, maxLength);
  }
});

function updatetextBoxWidth() {
  if (window.innerWidth <= 600) {
    // For phones (screen width <= 600px)
textBox.style.width = '73%';
  } else {
    // For other devices
textBox.style.width = '85%';
  }
}
// Update the 'left' style initially
updatetextBoxWidth();

// Update the 'left' style when the window is resized
window.addEventListener('resize', updatetextBoxWidth);
// Create a button to toggle the visibility of the textBox
const toggleButton = document.createElement('button');
toggleButton.id = 'toggleButton';
toggleButton.style.position = 'absolute';
toggleButton.style.top = '18px';
toggleButton.style.left = '86.5%';
toggleButton.style.zIndex = '9999';
toggleButton.style.border = 'none';
toggleButton.style.backgroundColor = 'transparent';
toggleButton.style.width = '18px';
toggleButton.style.height = '18px';
toggleButton.style.padding = '0';
toggleButton.style.display = 'flex';
toggleButton.style.justifyContent = 'center';
toggleButton.style.alignItems = 'center';

const svgHTMLtoggle = '<svg stroke="currentColor" fill="#C8C5BE" stroke-width="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;" data-darkreader-inline-fill="" data-darkreader-inline-stroke=""><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 5.63l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41z"></path></svg>';
toggleButton.innerHTML = svgHTMLtoggle;
// Event listener to toggle the visibility of the textBox


toggleButton.addEventListener('click', () => {

const parentDiv = document.querySelector('.swiper');
//const parentDivbutton = document.querySelector('div.swiper-slide:nth-child(1) > div:nth-child(1)');
// Append the text box to the parent div
parentDiv.appendChild(textBox);
parentDiv.appendChild(button);

  if (textBox.style.display === 'none' || textBox.style.display === '') {
    textBox.style.display = 'block';
    button.style.display = 'block';

    toggleButton.style.backgroundColor = '#3B362D';
  } else {
    textBox.style.display = 'none';
    button.style.display = 'none';
    toggleButton.style.backgroundColor = 'transparent';
  }
});

const apiKey = JSON.parse(localStorage.getItem('char_token')).value;
const urlPattern = /^https:\/\/neo\.character\.ai\/turns\/[a-zA-Z0-9-]+\/$/;
let storedURL = null;
let chatId = null;
let turnId = null;

const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    if (urlPattern.test(url)) {
        this._url = url;
        storedURL = url;
    }
    originalOpen.apply(this, arguments);
};

XMLHttpRequest.prototype.send = function() {
    const self = this;
    const originalOnLoad = this.onload;

    this.onload = function() {
        if (self._url && urlPattern.test(self._url)) {
            try {
                if (self.status === 200) {
                    const responseData = JSON.parse(self.responseText);
                    chatId = responseData.turns[0].turn_key.chat_id;
                    turnId = responseData.turns[0].turn_key.turn_id;
                    console.log('Chat ID:', chatId);
                    console.log('Turn ID:', turnId);
                }
            } catch (error) {
                console.error("Error parsing response:", error);
            }
        }

        if (originalOnLoad) {
            originalOnLoad.apply(this, arguments);
        }
    };

    originalSend.apply(this, arguments);
};



button.addEventListener('click', () => {
    try {
        const newContent = textBox.value;

        fetch(storedURL, {
            headers: {
                'Authorization': 'Token ' + apiKey
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.turns && data.turns[0] && data.turns[0].turn_key) {
                chatId = data.turns[0].turn_key.chat_id;
                turnId = data.turns[0].turn_key.turn_id;
                console.log('Chat ID:', chatId);
                console.log('Turn ID:', turnId);

                const commandJson_edit = JSON.stringify({
                    command: "edit_turn_candidate",
                    request_id: "",
                    payload: {
                        turn_key: {
                            chat_id: chatId,
                            turn_id: turnId
                        },
                        new_candidate_raw_content: newContent,
                        origin_id: ""
                    }
                });

                console.log('[CUSTOM] Sending socket message:', JSON.parse(commandJson_edit));
              socket.send(commandJson_edit);

            } else {
                console.error('Unable to retrieve chat_id and turn_id from the response.');
            }
        })
        .catch(error => {
            console.error('Error retrieving data:', error);
        });

    } catch (error) {
        console.error('[CUSTOM] Error sending command over WebSocket:', error);
    }
});



// Function to append the toggleButton to the .swiper element
function appendToggleButtonToSwiper() {
  const parentDiv = document.querySelector('.swiper');
  if (parentDiv) {
    if (!parentDiv.contains(toggleButton)) {
      parentDiv.appendChild(toggleButton);
    }
  }
}

// Mutation observer to watch for changes in the DOM
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // Check if .swiper is added to the DOM
      const swiperElement = document.querySelector('.swiper');
      if (swiperElement) {
        // .swiper is present, append the toggleButton
        appendToggleButtonToSwiper();
      }
    }
  }
});

// Start observing changes in the DOM
observer.observe(document.body, { childList: true, subtree: true });


})();