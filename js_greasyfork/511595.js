// ==UserScript==
// @name         Autoz Signup Automation Helper
// @author        XettriAleen
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Assists with form filling for signups, including dynamic form detection and email checking, with React compatibility
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/511595/Autoz%20Signup%20Automation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/511595/Autoz%20Signup%20Automation%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Configuration
  const tempMailService = "https://www.1secmail.com/api/v1/";
  const domains = ["1secmail.com", "1secmail.org", "1secmail.net"];
  let tempEmail = "";
  let db;

  // IndexedDB setup
  const dbName = "SignupAutomationDB";
  const storeName = "TempEmailStore";
  const request = indexedDB.open(dbName, 1);

  request.onerror = function (event) {
    console.error("IndexedDB error:", event.target.error);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("IndexedDB opened successfully");
    loadTempEmail();
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore(storeName, { keyPath: "id" });
    console.log("Object store created");
  };

  // Function to save temp email to IndexedDB
  function saveTempEmail(email) {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.put({ id: 1, email: email });

    request.onerror = function (event) {
      console.error("Error saving temp email:", event.target.error);
    };

    request.onsuccess = function (event) {
      console.log("Temp email saved successfully");
    };
  }

  // Function to load temp email from IndexedDB
  function loadTempEmail() {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(1);

    request.onerror = function (event) {
      console.error("Error loading temp email:", event.target.error);
    };

    request.onsuccess = function (event) {
      if (request.result) {
        tempEmail = request.result.email;
        console.log("Loaded temp email:", tempEmail);
      } else {
        console.log("No saved temp email found");
      }
    };
  }

  // Function to generate a temporary email
  async function generateTempEmail() {
    if (!tempEmail) {
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      const randomUsername = Math.random().toString(36).substring(2, 10);
      tempEmail = `${randomUsername}@${randomDomain}`;
      saveTempEmail(tempEmail);
    }
    return tempEmail;
  }

  // Function to check temp email for messages and fetch content
  function checkEmail() {
    if (!tempEmail) {
      console.log("No temporary email available");
      return;
    }

    const [login, domain] = tempEmail.split("@");
    GM_xmlhttpRequest({
      method: "GET",
      url: `${tempMailService}?action=getMessages&login=${login}&domain=${domain}`,
      onload: function (response) {
        if (response.status === 200) {
          const messages = JSON.parse(response.responseText);
          console.log("Temp Email Messages:", messages);
          fetchEmailContents(messages);
        }
      },
    });
  }

  function fetchEmailContents(messages) {
    const [login, domain] = tempEmail.split("@");
    messages.forEach((msg) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${tempMailService}?action=readMessage&login=${login}&domain=${domain}&id=${msg.id}`,
        onload: function (response) {
          if (response.status === 200) {
            const emailContent = JSON.parse(response.responseText);
            msg.body = emailContent.body;
            msg.htmlBody = emailContent.htmlBody;
            displayMessages([msg]); // Display each message as it's fetched
          }
        },
      });
    });
  }

  // Function to display email messages
  function displayMessages(messages) {
    let messageDisplay = document.getElementById("message-display");
    if (!messageDisplay) {
      messageDisplay = document.createElement("div");
      messageDisplay.id = "message-display";
      messageDisplay.style.position = "fixed";
      messageDisplay.style.top = "20px ";
      messageDisplay.style.right = "20px";
      messageDisplay.style.width = "300px ";
      messageDisplay.style.maxHeight = "400px ";
      messageDisplay.style.overflowY = "auto ";
      messageDisplay.style.backgroundColor = "white ";
      messageDisplay.style.border = "1px solid black ";
      messageDisplay.style.padding = "10px ";
      messageDisplay.style.color ="#111111";
      messageDisplay.style.zIndex = "10000000000000000000000000000000000000000000000000000000000000000000000";
      document.body.appendChild(messageDisplay);
    }

    messages.forEach((msg) => {
      const messageElement = document.createElement("div");
      messageElement.style.borderBottom = "1px solid #ccc";
      messageElement.style.padding = "5px";
      messageElement.innerHTML = `
                <strong>From:</strong> ${msg.from}<br>
                <strong>Subject:</strong> ${msg.subject}<br>
                <strong>Date:</strong> ${new Date(
                  msg.date
                ).toLocaleString()}<br>
                <strong>Body:</strong><br>
                <div style="max-height: 100px; overflow-y: auto;">${
                  msg.body
                }</div>
            `;

      // Look for activation links
      const activationLinks = findActivationLinks(msg.htmlBody || msg.body);
      if (activationLinks.length > 0) {
        const activationButton = document.createElement("button");
        activationButton.textContent = "Activate Account";
        activationButton.onclick = () => handleActivation(activationLinks[0]);
        messageElement.appendChild(activationButton);
      }

      messageDisplay.appendChild(messageElement);
    });
  }

  // Function to find activation links in email content
  function findActivationLinks(content) {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
    const activationKeywords = ["activate", "verify", "confirm"];
    const links = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const href = match[2];
      if (
        activationKeywords.some((keyword) =>
          href.toLowerCase().includes(keyword)
        )
      ) {
        links.push(href);
      }
    }

    return links;
  }

  // Function to handle activation link click
  function handleActivation(link) {
    console.log("Activation link clicked:", link);
    window.open(link, "_blank");
  }

  // Function to generate random data
  function generateRandomData() {
    const firstNames = ['John', 'Jane', 'Alex', 'Emma', 'Michael', 'Olivia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const dob = new Date(Math.floor(Math.random() * (new Date().getFullYear() - 1950) + 1950), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
    const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2) + Math.floor(Math.random() * 10) + '!';
    return { name, dob, password };
}




    // Function to fill form fields
    async function fillFormFields(container = document.body) {
        const { name, dob, password } = generateRandomData();
        const fieldMap = {
            email: [/mail/i, /e-mail/i, /login/i],
            password: [/pass/i, /pwd/i],
            name: [/name/i, /full.?name/i],
            firstName: [/first.?name/i, /given.?name/i],
            lastName: [/last.?name/i, /surname/i, /family.?name/i],
            dob: [/birth/i, /dob/i, /date/i]
        };

        const inputs = container.querySelectorAll('input, select, textarea, [contenteditable="true"]');
        for (const input of inputs) {
            const inputId = (input.id || '').toLowerCase();
            const inputName = (input.name || '').toLowerCase();
            const inputType = input.type ? input.type.toLowerCase() : '';
            const placeholder = (input.placeholder || '').toLowerCase();

            for (const [field, patterns] of Object.entries(fieldMap)) {
                if (patterns.some(pattern => pattern.test(inputId) || pattern.test(inputName) || pattern.test(placeholder))) {
                    let value;
                    switch(field) {
                        case 'email': value = tempEmail; break;
                        case 'password': value = password; break;
                        case 'name': value = name; break;
                        case 'firstName': value = name.split(' ')[0]; break;
                        case 'lastName': value = name.split(' ')[1]; break;
                        case 'dob': value = dob; break;
                    }
                    await setInputValue(input, value);
                    break;
                }
            }

            // Handle specific input types not covered by the fieldMap
            if (inputType === 'checkbox' || inputType === 'radio') {
                input.checked = true;
                await triggerEvent(input, 'change');
            } else if (input instanceof HTMLSelectElement && input.options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (input.options.length - 1)) + 1;
                await setInputValue(input, input.options[randomIndex].value);
            }

            // Add a small delay between filling each field
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Trigger form-level events
        const form = container.closest('form');
        if (form) {
            await triggerEvent(form, 'change');
            await triggerEvent(form, 'input');
        }
    }


   // Enhanced function to set input value
   async function setInputValue(input, value) {
    console.log(`Attempting to set value for element:`, input);
    console.log(`Value to be set:`, value);

    const inputType = input.type ? input.type.toLowerCase() : 'text';

    // Method 1: Direct assignment
    input.value = value;

    // Method 2: Using Object.defineProperty
    Object.defineProperty(input, 'value', {
        value: value,
        writable: true
    });

    // Method 3: Using Object.getOwnPropertyDescriptor
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (descriptor && descriptor.set) {
        descriptor.set.call(input, value);
    }

    // Method 4: Simulate user input
    input.focus();
    input.select();
    document.execCommand('insertText', false, value);

    // Method 5: Using keyboard events
    value.split('').forEach(char => {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
        input.dispatchEvent(new KeyboardEvent('keypress', { key: char }));
        input.value += char;
        input.dispatchEvent(new KeyboardEvent('keyup', { key: char }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Method 6: Using InputEvent
    const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: value
    });
    input.dispatchEvent(inputEvent);

    // Trigger common events
    ['focus', 'input', 'change', 'blur'].forEach(eventType => {
        const event = new Event(eventType, { bubbles: true, cancelable: true, composed: true });
        input.dispatchEvent(event);
    });

    // For React-style controlled inputs
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // Store the value as a data attribute
    input.dataset.autoFilledValue = value;

    console.log(`Value set. Current value:`, input.value);

    // Add a small delay to allow for any asynchronous updates
    await new Promise(resolve => setTimeout(resolve, 100));
}

// Helper function to trigger events    
    async function triggerEvent(element, eventType) {
        const event = new Event(eventType, { bubbles: true, cancelable: true, composed: true });
        element.dispatchEvent(event);
        // Add a small delay after each event
        await new Promise(resolve => setTimeout(resolve, 10));
    }

  // Function to add UI buttons
  function addButtons() {
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "auto-signup-buttons";
    buttonContainer.style.position = "fixed ";
    buttonContainer.style.bottom = "20px ";
    buttonContainer.style.right = "20px ";
    buttonContainer.style.zIndex = "10000000000000000000000000000000000000000000000000000000000000000000000 !important";

    const tryAnonymousBtn = createButton("Try Anonymous", main);
    const checkEmailBtn = createButton("Check Email", checkEmail);

    buttonContainer.appendChild(tryAnonymousBtn);
    buttonContainer.appendChild(checkEmailBtn);
    document.body.appendChild(buttonContainer);

    GM_addStyle(`
            #auto-signup-buttons {
                display: flex !important;
                flex-direction: column !important;
            }
            .auto-signup-btn {
                background-color: #4CAF50 !important;
                border: none !important;
                color: white !important;
                padding: 15px 32px !important;
                text-align: center !important;
                text-decoration: none !important;
                display: inline-block !important;
                font-size: 16px !important;
                margin: 4px 2px !important;
                cursor: pointer !important;
                border-radius: 12px !important;
            }
        `);
  }

  function createButton(text, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("auto-signup-btn");
    button.addEventListener("click", onClick);
    return button;
  }

  // Function to detect and fill new forms   
    function detectAndFillNewForms() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            fillFormFields(node);
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    if (mutation.target.tagName === 'INPUT' || mutation.target.tagName === 'SELECT') {
                        const input = mutation.target;
                        if (input.dataset.autoFilledValue && !input.value) {
                            setInputValue(input, input.dataset.autoFilledValue);
                        }
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['value', 'checked']
        });
    }


  // Main function
  async function main() {
    try {
        await generateTempEmail();
        await fillFormFields();
        console.log('Form fields filled automatically');
        console.log('Temporary email:', tempEmail);
        detectAndFillNewForms();
        console.log('Now listening for new form elements');

        // Periodically re-fill forms
        setInterval(async () => {
            const inputs = document.querySelectorAll('input, select, textarea, [contenteditable="true"]');
            for (const input of inputs) {
                if (input.dataset.autoFilledValue && !input.value) {
                    await setInputValue(input, input.dataset.autoFilledValue);
                }
            }
        }, 1000);
    } catch (error) {
        console.error('Error:', error);
    }
}


  // Add the buttons when the script loads
  if (!document.getElementById("auto-signup-buttons")) {
    addButtons();
  }

  // Periodically check if our buttons are still present
  setInterval(() => {
    if (!document.getElementById("auto-signup-buttons")) {
      addButtons();
    }
  }, 5000);
})();
