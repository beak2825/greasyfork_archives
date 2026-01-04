// ==UserScript==
// @name         Алгоритмика AI Помощник (Gemini Pro 2.0) - Resizable, Code, Images, Theme, Hide/Show
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  AI помощник с изменением размера, форматированием кода, отправкой изображений, тёмной темой и скрытием/открытием окна
// @author       You (and Bard/Gemini)
// @match        https://learn.algoritmika.org/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=algoritmika.org
// @downloadURL https://update.greasyfork.org/scripts/526463/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC%D0%B8%D0%BA%D0%B0%20AI%20%D0%9F%D0%BE%D0%BC%D0%BE%D1%89%D0%BD%D0%B8%D0%BA%20%28Gemini%20Pro%2020%29%20-%20Resizable%2C%20Code%2C%20Images%2C%20Theme%2C%20HideShow.user.js
// @updateURL https://update.greasyfork.org/scripts/526463/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC%D0%B8%D0%BA%D0%B0%20AI%20%D0%9F%D0%BE%D0%BC%D0%BE%D1%89%D0%BD%D0%B8%D0%BA%20%28Gemini%20Pro%2020%29%20-%20Resizable%2C%20Code%2C%20Images%2C%20Theme%2C%20HideShow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OPENROUTER_API_KEY = "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";
    const YOUR_SITE_URL = "https://learn.algoritmika.org";
    const YOUR_SITE_NAME = "Algoritmika Learn";

    // --- UI Elements ---

    const chatContainer = document.createElement('div');
    chatContainer.classList.add('itSAkr');
    chatContainer.style.cssText = `
        width: 350px;
        height: 500px;
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: flex; /* Default to flex for showing */
        flex-direction: column;
        position: fixed;
        top: 50px;
        right: 20px;
        z-index: 9999;
        border-radius: 8px;
        overflow: hidden;
        font-family: "Cera CY", Helvetica, Arial, sans-serif;
        resize: both;
        min-width: 250px;
        min-height: 200px;
    `;

    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
        background-color: #f0f0f0;
        padding: 8px;
        cursor: move;
        border-bottom: 1px solid #ccc;
        font-weight: bold;
        display: flex; /* Added flex to title bar */
        justify-content: space-between; /* Space buttons to the right */
        align-items: center; /* Vertically align items in title bar */
    `;
    titleBar.textContent = "AI Помощник";
    chatContainer.appendChild(titleBar);

    const messageArea = document.createElement('div');
    messageArea.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        word-wrap: break-word;
    `;
    chatContainer.appendChild(messageArea);

    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      display: flex;
      padding: 10px;
      border-top: 1px solid #ccc;
    `

    const inputField = document.createElement('textarea');
    inputField.style.cssText = `
        flex: 1;
        resize: vertical;
        min-height: 40px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        margin-right: 5px;
        font-family: "Cera CY", Helvetica, Arial, sans-serif;
    `;
    inputField.placeholder = "Введите сообщение...";
    inputContainer.appendChild(inputField);

    const sendButton = document.createElement('button');
    sendButton.textContent = "Отправить";
    sendButton.style.cssText = `
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
        font-family: "Cera CY", Helvetica, Arial, sans-serif;
    `;
    inputContainer.appendChild(sendButton);
    chatContainer.appendChild(inputContainer);

    // --- Theme Toggle Button ---
    const themeButton = document.createElement('button');
    themeButton.textContent = "Тёмная тема";
    themeButton.style.cssText = `
        background-color: #ddd;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: normal; /* Remove bold to match other buttons */
        font-family: "Cera CY", Helvetica, Arial, sans-serif;
    `;
    titleBar.appendChild(themeButton);


    // --- Hide/Show Button ---
    const hideButton = document.createElement('button');
    hideButton.textContent = "Скрыть";
    hideButton.style.cssText = `
        background-color: #ddd;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px; /* Add some spacing from theme button */
        font-weight: normal; /* Remove bold to match other buttons */
        font-family: "Cera CY", Helvetica, Arial, sans-serif;
    `;
    titleBar.insertBefore(hideButton, themeButton); // Insert before theme button

    document.body.appendChild(chatContainer);


    // --- Drag Functionality --- (Same as before)
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
        if (e.target !== themeButton && e.target !== hideButton) { // Prevent dragging when clicking buttons
            isDragging = true;
            dragOffsetX = e.clientX - chatContainer.offsetLeft;
            dragOffsetY = e.clientY - chatContainer.offsetTop;
            titleBar.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            chatContainer.style.left = (e.clientX - dragOffsetX) + 'px';
            chatContainer.style.top = (e.clientY - dragOffsetY) + 'px';
            const maxX = window.innerWidth - chatContainer.offsetWidth;
            const maxY = window.innerHeight - chatContainer.offsetHeight;
            chatContainer.style.left = Math.max(0, Math.min(maxX, chatContainer.offsetLeft)) + 'px';
            chatContainer.style.top = Math.max(0, Math.min(maxY, chatContainer.offsetTop)) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        titleBar.style.cursor = 'move';
    });

    // --- Theme Toggling Functionality ---
    let isDarkMode = false; // Track theme state

    function applyTheme(darkMode) {
        isDarkMode = darkMode;
        chatContainer.style.backgroundColor = darkMode ? '#333' : 'white';
        chatContainer.style.color = darkMode ? 'white' : 'black';
        titleBar.style.backgroundColor = darkMode ? '#555' : '#f0f0f0';
        titleBar.style.borderBottomColor = darkMode ? '#777' : '#ccc';
        inputContainer.style.borderTopColor = darkMode ? '#777' : '#ccc';
        inputField.style.backgroundColor = darkMode ? '#444' : 'white';
        inputField.style.color = darkMode ? 'white' : 'black';
        inputField.style.borderColor = darkMode ? '#777' : '#ccc';
        messageArea.querySelectorAll('div').forEach(messageElement => { // Target message bubbles
            if (messageElement.style.backgroundColor === 'rgb(224, 247, 250)') { // Light blue (You)
                messageElement.style.backgroundColor = darkMode ? '#424242' : '#e0f7fa'; // Darker gray for dark mode "You"
                messageElement.style.color = darkMode ? 'white' : 'black';
            } else if (messageElement.style.backgroundColor === 'rgb(240, 240, 240)') { // Light gray (AI)
                messageElement.style.backgroundColor = darkMode ? '#212121' : '#f0f0f0'; // Darker gray for dark mode "AI"
                messageElement.style.color = darkMode ? 'white' : 'black';
            }
        });

        themeButton.textContent = darkMode ? "Светлая тема" : "Тёмная тема";
    }


    themeButton.addEventListener('click', () => {
        applyTheme(!isDarkMode); // Toggle theme
    });

    // --- Hide/Show Functionality ---
    let isVisible = true; // Track visibility state

    function toggleChatVisibility() {
        isVisible = !isVisible;
        chatContainer.style.display = isVisible ? 'flex' : 'none'; // Toggle display
        hideButton.textContent = isVisible ? "Скрыть" : "Показать";
    }

    hideButton.addEventListener('click', toggleChatVisibility);


    // --- Message Handling and Code Formatting --- (Rest of your message handling code is unchanged)

    // Function to format code blocks
    function formatCode(text) {
        // Basic code block detection (you might need more sophisticated logic)
        const codeRegex = /```(\w+)?\n([\s\S]*?)```/g; // Matches triple backticks with optional language
        return text.replace(codeRegex, (match, language, code) => {
            const pre = document.createElement('pre');
            const codeElement = document.createElement('code');

            if (language) {
                 codeElement.classList.add(`language-${language}`); // For syntax highlighting (if you add a library)
            }


            codeElement.textContent = code;
            pre.appendChild(codeElement);

            // Add copy button
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.style.cssText = `
              margin-top: 5px;
              background-color: #ddd;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              cursor: pointer;
          `;
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(code).then(() => {
                    // Optional: Provide visual feedback (e.g., change button text)
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => { copyButton.textContent = 'Copy'; }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);  // Handle copy errors
                    alert('Failed to copy code.');
                });
            });

            const codeContainer = document.createElement('div'); // Container for pre and button
             codeContainer.style.marginBottom = '8px'; // Add spacing
            codeContainer.appendChild(pre);
            codeContainer.appendChild(copyButton);

            return codeContainer.outerHTML; // Return the whole container as HTML
        });

    }


   function displayMessage(text, sender, imageUrl = null) {
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 4px;
        word-wrap: break-word;
        line-height: 1.4;
    `;

    if (sender === 'You') {
        messageElement.style.backgroundColor = isDarkMode ? '#424242' : '#e0f7fa'; // Dark mode color for "You"
        messageElement.style.textAlign = 'right';
        messageElement.style.marginLeft = 'auto';
        messageElement.style.marginRight = '0';
    } else {
        messageElement.style.backgroundColor = isDarkMode ? '#212121' : '#f0f0f0'; // Dark mode color for "AI"
    }

    if (imageUrl) {
        // Display the image
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.style.maxWidth = '100%'; // Make sure the image fits within the chat
        imgElement.style.height = 'auto';
        imgElement.style.display = 'block'; // Avoid extra spacing
        imgElement.style.marginTop = '4px'; // Space between text and image

        // Text content (if any) comes *before* the image
        if(text) {
          const textSpan = document.createElement('span');
           textSpan.innerHTML = formatCode(text); // Format any code *before* the image
          messageElement.appendChild(textSpan);
        }

        messageElement.appendChild(imgElement); // Add image below any text

    }  else {

       messageElement.innerHTML = formatCode(text);      // Format code blocks within message text
    }


    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


    // --- Image Handling --- (Rest of your image handling code is unchanged)

     function handleImageUpload(file) {
        if (file.type.startsWith('image/')) {  // Important: Check it's an image
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target.result;
                 sendMessage("", imageDataUrl); // Send the image data URL
            };
            reader.readAsDataURL(file);  //  Data URL
        } else {
             alert("Only image files are allowed!"); // Error for non-images
        }
    }


    // Drag-and-drop image upload
    inputField.addEventListener('dragover', (e) => {
        e.preventDefault(); //  drag-and-drop
        inputField.style.backgroundColor = '#f0f8ff'; // Visual cue
    });

    inputField.addEventListener('dragleave', () => {
        inputField.style.backgroundColor = '';
    });

    inputField.addEventListener('drop', (e) => {
        e.preventDefault();
        inputField.style.backgroundColor = '';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
           handleImageUpload(files[0]);  // Handle the first file
        }
    });


    // Paste image from clipboard (Ctrl+V)
    inputField.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                const file = item.getAsFile();
                 handleImageUpload(file);
                return; //  process one image
            }
        }
    });



    // --- API Communication and Main Logic --- (Rest of your API communication code is unchanged)

    async function sendMessage(userMessage, imageUrl = null) {
      displayMessage(userMessage, 'You', imageUrl); // Display user message/image

      const loadingIndicator = document.createElement("div");
      loadingIndicator.textContent = "Подождите...";
      loadingIndicator.style.fontStyle = "italic";
      loadingIndicator.style.color = "gray";
      messageArea.appendChild(loadingIndicator);

       // Construct messages array:
      const messages = [];
      if (userMessage || imageUrl) {
          const userContent = [];
          if(userMessage) {
            userContent.push({
               type: "text",
               text: userMessage,
            });
          }
           if(imageUrl){
            userContent.push({
               type: "image_url",
               image_url: { url: imageUrl },
             });
           }
           messages.push({
               role: "user",
              content: userContent,
           });
      }

      //console.log("Sending messages:", messages); // Debugging: Check the messages

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": YOUR_SITE_URL,
                    "X-Title": YOUR_SITE_NAME,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemini-2.0-pro-exp-02-05:free",
                    "messages": messages
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                const aiResponse = data.choices[0].message.content;
                 messageArea.removeChild(loadingIndicator);
                displayMessage(aiResponse, 'AI');
            } else {
                throw new Error("Unexpected API response format");
            }

        } catch (error) {
            if (messageArea.contains(loadingIndicator)) {
                messageArea.removeChild(loadingIndicator);
            }
            console.error("Error fetching AI response:", error);
            displayMessage(`Ошибка: ${error.message}`, 'AI');
        }
    }


    sendButton.addEventListener('click', () => {
        const userMessage = inputField.value.trim();
        sendMessage(userMessage); //  imageUrl = null here
        inputField.value = ''; // Clear input
    });

    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendButton.click();
        }
    });
})();
