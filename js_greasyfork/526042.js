// ==UserScript==
// @name         React App to Yahoo Mail Sync (v1.7 - Robust Aira Selectors)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Sync text from React app to Yahoo Mail (More robust version)
// @author       Samuel r Nason Tomaszewski, Yunnuo Zhang
// @match        https://mail.yahoo.com/*
// @match        *://localhost:*/*
// @match        *://192.168.30.7:*
// @match        *://10.*.*.*:*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.focus
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526042/React%20App%20to%20Yahoo%20Mail%20Sync%20%28v17%20-%20Robust%20Aira%20Selectors%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526042/React%20App%20to%20Yahoo%20Mail%20Sync%20%28v17%20-%20Robust%20Aira%20Selectors%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Constants for message types
  const MESSAGE_TYPES = {
    RECIPIENT: "recipient",
    SUBJECT: "subject",
    BODY: "body",
  };

  // Debug logging function
  function debugLog(message) {
    console.log(`[Text Sync Debug] ${message}`);
  }

  // Function to determine message type from button text
  function getMessageType(buttonText) {
    const baseText = buttonText.split(":")[0].trim();
    if (baseText.startsWith("Recipient")) {
      return MESSAGE_TYPES.RECIPIENT;
    } else if (baseText.startsWith("Subject")) {
      return MESSAGE_TYPES.SUBJECT;
    } else if (baseText.startsWith("Body")) {
      return MESSAGE_TYPES.BODY;
    }
    return "";
  }

  // Function to update synced text
  function updateSyncedText(messageType, text) {
    if (messageType) {
      debugLog(`Storing text for type: ${messageType}`);
      GM_setValue("syncedText", {
        type: messageType,
        content: text,
        timestamp: Date.now(),
      });

      // Also store in persistent cache for send operations
      if (messageType === MESSAGE_TYPES.SUBJECT) {
        GM_setValue("lastSubject", text);
      } else if (messageType === MESSAGE_TYPES.BODY) {
        GM_setValue("lastBody", text);
      }
    }
  }

  // Function to check React app state
  function checkReactAppState() {
    // Check text content
    const selectedButton = document.querySelector(".context-button.selected");
    const textDisplay = document.querySelector(
      '.text-display[contenteditable="true"]'
    );

    if (selectedButton && textDisplay) {
      const messageType = getMessageType(selectedButton.textContent);
      const currentText = textDisplay.textContent;
      const lastSync = GM_getValue("syncedText");

      if (!lastSync || lastSync.content !== currentText) {
        if (messageType == MESSAGE_TYPES.RECIPIENT) {
          GM_setValue("recipientContent", currentText);
        } else {
          updateSyncedText(messageType, currentText);
        }
      }
    }

    // Check button states
    const sentButton = document.querySelector(".keyboard-button.sent");
    if (sentButton) {
      const lastTrigger = GM_getValue("buttonTrigger");
      if (sentButton.textContent === "Sent!") {
        if (
          !lastTrigger ||
          lastTrigger.status !== "pending" ||
          lastTrigger.action !== "send"
        ) {
          debugLog("Send button changed to Sent! status");
          GM_setValue("buttonTrigger", {
            timestamp: Date.now(),
            status: "pending",
            action: "send",
          });

          setTimeout(() => {
            const normalButton = document.querySelector(
              ".keyboard-button.sendemail.default"
            );
            if (normalButton && normalButton.textContent === "Send Email") {
              debugLog("Send button returned to normal, resetting trigger");
              GM_setValue("buttonTrigger", {
                timestamp: Date.now(),
                status: "reset",
                action: "send",
              });
            }
          }, 2000);
        }
      } else if (sentButton.textContent === "Start composing") {
        if (
          !lastTrigger ||
          lastTrigger.status !== "pending" ||
          lastTrigger.action !== "compose"
        ) {
          debugLog("Compose button changed to Start composing status");
          GM_setValue("buttonTrigger", {
            timestamp: Date.now(),
            status: "pending",
            action: "compose",
          });

          setTimeout(() => {
            const normalButton = document.querySelector(
              ".keyboard-button.compose.default"
            );
            if (normalButton && normalButton.textContent === "Compose") {
              debugLog("Compose button returned to normal, resetting trigger");
              GM_setValue("buttonTrigger", {
                timestamp: Date.now(),
                status: "reset",
                action: "compose",
              });
            }
          }, 2000);
        }
      }
    }
  }

  // Function to handle React app logic
  function handleReactApp() {
    debugLog("Initializing React app polling");
    setInterval(checkReactAppState, 500);
  }

  // --- MODIFIED SELECTORS OBJECT ---
  // Prioritizes robust ARIA/functional selectors from your HTML
  // and keeps old selectors as fallbacks.
  const selectors = {
    [MESSAGE_TYPES.RECIPIENT]: [
      // --- New, more robust selectors first ---
      'input[aria-labelledby="to"]', // From your HTML (Most stable)
      'input[role="combobox"][id*="to-field"]', // Robust combo
      // --- Original selectors as fallbacks ---
      "#message-to-field",
      '[data-test-id="compose-to-field"]',
      "#to",
    ],
    [MESSAGE_TYPES.SUBJECT]: [
      // --- New, more robust selectors first ---
      'input[aria-label="Subject"]', // From your HTML (Most stable)
      'input[placeholder="Subject"]', // From your HTML (Very stable)
      // --- Original selectors as fallbacks ---
      '[data-test-id="compose-subject"]',
      "#compose-subject-input",
      "#subject",
    ],
    [MESSAGE_TYPES.BODY]: [
      // --- Robust selectors first ---
      'div[role="textbox"][aria-label="Message body"]', // More specific
      '[aria-label="Message body"]', // Original (Good)
      // --- Original selectors as fallbacks ---
      '[data-test-id="compose-editor"]',
      '[data-test-id="rte"]',
      "#editorPlainText",
    ],
  };

  // Function to update Yahoo Mail elements
  function updateYahooMailElement(type, content) {
    let targetElement = null;
    let elementType = "";

    if (type in selectors) {
      for (const selector of selectors[type]) {
        const element = document.querySelector(selector);
        if (element) {
          targetElement = element;
          elementType = type;
          break;
        }
      }
    }

    if (targetElement) {
      debugLog(`Updating ${elementType} element with new content`);

      // Create a focused state tracker
      let wasFocused = document.activeElement === targetElement;

      if (targetElement.getAttribute("contenteditable") === "true") {
        // Handle contenteditable div (message body)
        targetElement.innerHTML = `<div>${content}</div>`;
        const event = new Event("input", { bubbles: true });
        targetElement.dispatchEvent(event);
      } else {
        const isRecipient = type == MESSAGE_TYPES.RECIPIENT;
        if (!isRecipient) {
          // Handle regular input fields
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          ).set;
          nativeInputValueSetter.call(targetElement, content);

          const events = ["input", "change"];
          events.forEach((eventType) => {
            const event = new Event(eventType, { bubbles: true });
            targetElement.dispatchEvent(event);
          });
        }
      }

      // Restore focus if element was focused
      if (wasFocused) {
        targetElement.focus();
        if (targetElement.setSelectionRange) {
          targetElement.setSelectionRange(content.length, content.length);
        }
      }

      // Store the value for recovery
      targetElement.setAttribute("data-synced-value", content);

      // Add focus handler to restore value if cleared
      targetElement.addEventListener("focus", function (e) {
        const syncedValue = this.getAttribute("data-synced-value");
        if (
          syncedValue &&
          (this.getAttribute("contenteditable") === "true"
            ? !this.textContent
            : !this.value)
        ) {
          if (this.getAttribute("contenteditable") === "true") {
            this.innerHTML = `<div>${syncedValue}</div>`;
          } else {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              "value"
            ).set;
            nativeInputValueSetter.call(this, syncedValue);
          }
          this.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    } else {
      debugLog(
        `${elementType} element not found in Yahoo Mail - tried multiple selectors`
      );
    }
  }

  // Function to handle Yahoo Mail logic
  function handleYahooMail() {
    let lastTimestamp = 0;
    let lastButtonTimestamp = 0;
    let sendInProgress = false; // Flag to prevent sync during send
    debugLog("Yahoo Mail handler initialized");

    setInterval(() => {
      // Open compose window if React tab is open
      const reactOpen = GM_getValue("reactOpen");
      if (
        reactOpen &&
        !(
          window.location.href.includes("mail.yahoo.com/d/compose") ||
          window.location.href.includes("mail.yahoo.com/n/compose")
        )
      ) {
        // --- MODIFIED COMPOSE BUTTON SELECTOR ---
        // Try ARIA, then fall back to data-test-id
        const composeButton =
          document.querySelector('button[aria-label*="Compose"]') || // Best: ARIA
          document.querySelector('a[data-test-id="compose-button"]') ||
          document.querySelector(
            'button[data-test-id*="Compose"]' // Flexible data-test-id
          );

        if (composeButton) {
          debugLog("Compose button found, clicking it");
          composeButton.click();
        } else {
          debugLog("Compose button not found in either UI version");
        }
      }

      // Check for button triggers
      const buttonTrigger = GM_getValue("buttonTrigger");
      if (buttonTrigger && buttonTrigger.timestamp > lastButtonTimestamp) {
        lastButtonTimestamp = buttonTrigger.timestamp;

        if (buttonTrigger.status === "pending") {
          if (buttonTrigger.action === "send") {
            debugLog("Send trigger received, preparing to send");
            sendInProgress = true; // Block regular sync during send process
            debugLog("Send in progress flag SET - blocking regular syncs");

            // Safety timeout to reset flag if send fails
            setTimeout(() => {
              if (sendInProgress) {
                sendInProgress = false;
                debugLog("Send in progress flag CLEARED by safety timeout");
              }
            }, 5000);

            // --- MODIFIED RECIPIENT CONTAINER SELECTOR ---
            // Try to find container from the stable input, then fall back
            const recipientContainer =
              document.querySelector('input[aria-labelledby="to"]')?.closest('[class*="to-field"]') || // Find container from the input
              document.querySelector('[data-test-id="compose-header-field-to"]') ||
              document.querySelector('[data-test-id="compose-to-field"]') ||
              document.querySelector('#message-to-field')?.parentElement ||
              document.querySelector('[id*="to-field"]')?.parentElement ||
              document.querySelector('.compose-to-field');

            // --- MODIFIED SEND BUTTON SELECTOR ---
            // Use the `title` attribute from your HTML, fall back to data-test-id
            const sendButton =
              document.querySelector('button[title*="Send"]') || // Best: from your HTML
              document.querySelector(
                'button[data-test-id="compose-send-button"]'
              ); // Fallback

            debugLog(`Container selectors tried. Found: ${!!recipientContainer}`);
            if (recipientContainer) {
              debugLog(`Container element: ${recipientContainer.outerHTML.substring(0, 200)}`);
            }

            if (recipientContainer && sendButton) {
              debugLog("Elements found, preparing to populate all fields before sending");

              // FIRST: Populate subject and body from stored values
              const syncedData = GM_getValue("syncedText");

              // Populate subject
              debugLog("Populating subject field...");
              for (const selector of selectors[MESSAGE_TYPES.SUBJECT]) {
                const subjectElement = document.querySelector(selector);
                if (subjectElement) {
                  const subjectContent = syncedData && syncedData.type === MESSAGE_TYPES.SUBJECT
                    ? syncedData.content
                    : (GM_getValue("lastSubject") || "");

                  if (subjectContent) {
                    const nativeSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      "value"
                    ).set;
                    nativeSetter.call(subjectElement, subjectContent);
                    subjectElement.dispatchEvent(new Event("input", { bubbles: true }));
                    subjectElement.dispatchEvent(new Event("change", { bubbles: true }));
                    debugLog(`Subject populated: ${subjectContent}`);
                    GM_setValue("lastSubject", subjectContent);
                  }
                  break;
                }
              }

              // Populate body
              debugLog("Populating body field...");
              for (const selector of selectors[MESSAGE_TYPES.BODY]) {
                const bodyElement = document.querySelector(selector);
                if (bodyElement) {
                  const bodyContent = syncedData && syncedData.type === MESSAGE_TYPES.BODY
                    ? syncedData.content
                    : (GM_getValue("lastBody") || "");

                  if (bodyContent) {
                    if (bodyElement.getAttribute("contenteditable") === "true") {
                      bodyElement.innerHTML = `<div>${bodyContent}</div>`;
                    } else {
                      const nativeSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        "value"
                      ).set;
                      nativeSetter.call(bodyElement, bodyContent);
                    }
                    bodyElement.dispatchEvent(new Event("input", { bubbles: true }));
                    debugLog(`Body populated: ${bodyContent.substring(0, 50)}...`);
                    GM_setValue("lastBody", bodyContent);
                  }
                  break;
                }
              }

              // Small delay to ensure fields are registered
              setTimeout(() => {
                debugLog("Now creating recipient pill...");

                // Get recipient content
                let recipientContent = GM_getValue("recipientContent");

                // Add a comma to the end if there is not one
                const hasComma = recipientContent.slice(-1) == ",";
                const hasCommaSpace =
                  recipientContent.slice(-2, recipientContent.length) == ", ";
                if (!hasComma && !hasCommaSpace) {
                  recipientContent += ",";
                }

                // Populate the recipient element
                let targetElement = null;
                for (const selector of selectors[MESSAGE_TYPES.RECIPIENT]) {
                  const element = document.querySelector(selector);
                  if (element) {
                    targetElement = element;
                    break;
                  }
                }
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLInputElement.prototype,
                  "value"
                ).set;
                nativeInputValueSetter.call(targetElement, recipientContent);

                const events = ["input", "change"];
                events.forEach((eventType) => {
                  const event = new Event(eventType, { bubbles: true });
                  targetElement.dispatchEvent(event);
                });

                // Click the container to focus the area
                recipientContainer.click();

                // Find the input field within the container
                const inputField = recipientContainer.querySelector(
                  'input[role="combobox"]'
                );
                if (inputField) {
                  debugLog(
                    "Input field found, setting value and triggering events"
                  );

                  // Set the value using the native setter
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value"
                  ).set;
                  nativeInputValueSetter.call(
                    inputField,
                    inputField.getAttribute("data-synced-value") || ""
                  );

                  // Trigger events sequence
                  const events = [
                    new Event("focus", { bubbles: true }),
                    new Event("input", { bubbles: true }),
                    new KeyboardEvent("keydown", {
                      key: "Enter",
                      code: "Enter",
                      keyCode: 13,
                      bubbles: true,
                    }),
                    new KeyboardEvent("keypress", {
                      key: "Enter",
                      code: "Enter",
                      keyCode: 13,
                      bubbles: true,
                    }),
                    new KeyboardEvent("keyup", {
                      key: "Enter",
                      code: "Enter",
                      keyCode: 13,
                      bubbles: true,
                    }),
                  ];

                  events.forEach((event) => {
                    inputField.dispatchEvent(event);
                  });

                  // Wait for pill to be created
                  setTimeout(() => {
                    // Check for pill in both old and new UI
                    const pill =
                      document.querySelector('[data-test-id="pill"]') ||
                      document.querySelector('[data-test-id="y-pill"]');

                    if (pill) {
                      debugLog(
                        "Pill created, checking if send button is enabled"
                      );

                      // VERIFY and RE-POPULATE fields right before sending
                      const verifyAndSend = () => {
                        debugLog("Verifying all fields before send...");

                        // Re-verify and populate subject
                        const subjectValue = GM_getValue("lastSubject") || "";
                        for (const selector of selectors[MESSAGE_TYPES.SUBJECT]) {
                          const subjectElement = document.querySelector(selector);
                          if (subjectElement) {
                            const currentValue = subjectElement.value || "";
                            if (currentValue !== subjectValue && subjectValue) {
                              debugLog(`Re-populating subject: ${subjectValue}`);
                              const nativeSetter = Object.getOwnPropertyDescriptor(
                                window.HTMLInputElement.prototype,
                                "value"
                              ).set;
                              nativeSetter.call(subjectElement, subjectValue);
                              subjectElement.dispatchEvent(new Event("input", { bubbles: true }));
                              subjectElement.dispatchEvent(new Event("change", { bubbles: true }));
                            } else {
                              debugLog(`Subject verified: ${currentValue}`);
                            }
                            break;
                          }
                        }

                        // Re-verify and populate body
                        const bodyValue = GM_getValue("lastBody") || "";
                        for (const selector of selectors[MESSAGE_TYPES.BODY]) {
                          const bodyElement = document.querySelector(selector);
                          if (bodyElement) {
                            const currentValue = bodyElement.getAttribute("contenteditable") === "true"
                              ? bodyElement.textContent
                              : bodyElement.value || "";
                            if (currentValue !== bodyValue && bodyValue) {
                              debugLog(`Re-populating body: ${bodyValue.substring(0, 50)}...`);
                              if (bodyElement.getAttribute("contenteditable") === "true") {
                                bodyElement.innerHTML = `<div>${bodyValue}</div>`;
                              } else {
                                const nativeSetter = Object.getOwnPropertyDescriptor(
                                  window.HTMLInputElement.prototype,
                                  "value"
                                ).set;
                                nativeSetter.call(bodyElement, bodyValue);
                              }
                              bodyElement.dispatchEvent(new Event("input", { bubbles: true }));
                            } else {
                              debugLog(`Body verified: ${currentValue.substring(0, 50)}...`);
                            }
                            break;
                          }
                        }

                        // FORCE re-populate with delay to ensure DOM updates
                        debugLog("Force re-populating all fields with delay before send...");
                        const subjectVal = GM_getValue("lastSubject") || "";
                        const bodyVal = GM_getValue("lastBody") || "";

                        for (const selector of selectors[MESSAGE_TYPES.SUBJECT]) {
                          const subEl = document.querySelector(selector);
                          if (subEl && subjectVal) {
                            // Focus the field
                            subEl.focus();

                            // Set value using native setter
                            const nativeSetter = Object.getOwnPropertyDescriptor(
                              window.HTMLInputElement.prototype,
                              "value"
                            ).set;
                            nativeSetter.call(subEl, subjectVal);

                            // Trigger events
                            subEl.dispatchEvent(new Event("input", { bubbles: true }));
                            subEl.dispatchEvent(new Event("change", { bubbles: true }));

                            // CRITICAL: Blur the subject field to commit the value to React state
                            subEl.blur();

                            debugLog(`Force set subject and blurred: ${subjectVal}`);
                            break;
                          }
                        }

                        for (const selector of selectors[MESSAGE_TYPES.BODY]) {
                          const bodyEl = document.querySelector(selector);
                          if (bodyEl && bodyVal) {
                            if (bodyEl.getAttribute("contenteditable") === "true") {
                              bodyEl.innerHTML = `<div>${bodyVal}</div>`;
                            } else {
                              const nativeSetter = Object.getOwnPropertyDescriptor(
                                window.HTMLInputElement.prototype,
                                "value"
                              ).set;
                              nativeSetter.call(bodyEl, bodyVal);
                            }
                            bodyEl.dispatchEvent(new Event("input", { bubbles: true }));
                            debugLog(`Force set body: ${bodyVal.substring(0, 50)}...`);
                            break;
                          }
                        }

                        // Wait for blur to commit to React state
                        debugLog("Waiting 100ms for blur to commit...");
                        setTimeout(() => {
                          // Final check that subject is still there
                          for (const selector of selectors[MESSAGE_TYPES.SUBJECT]) {
                            const subEl = document.querySelector(selector);
                            if (subEl) {
                              debugLog(`Final subject check before send: "${subEl.value}"`);
                              if (subEl.value !== subjectVal && subjectVal) {
                                debugLog(`WARNING: Subject changed! Re-setting...`);
                                const nativeSetter = Object.getOwnPropertyDescriptor(
                                  window.HTMLInputElement.prototype,
                                  "value"
                                ).set;
                                nativeSetter.call(subEl, subjectVal);
                                subEl.dispatchEvent(new Event("input", { bubbles: true }));
                                subEl.dispatchEvent(new Event("change", { bubbles: true }));
                              }
                              break;
                            }
                          }

                          debugLog("All fields confirmed, clicking send NOW");
                          sendButton.click();
                        }, 100);

                        // Reset flag after send (accounting for the 100ms delay above)
                        setTimeout(() => {
                          sendInProgress = false;
                          debugLog("Send in progress flag CLEARED - resuming regular syncs");
                        }, 1200);
                      };

                      if (
                        !sendButton.hasAttribute("aria-disabled") ||
                        sendButton.getAttribute("aria-disabled") === "false"
                      ) {
                        debugLog("Send button is enabled");
                        verifyAndSend();
                      } else {
                        debugLog("Send button is disabled, waiting...");
                        setTimeout(() => {
                          if (
                            !sendButton.hasAttribute("aria-disabled") ||
                            sendButton.getAttribute("aria-disabled") === "false"
                          ) {
                            debugLog("Send button is now enabled");
                            verifyAndSend();
                          } else {
                            debugLog("Send button still disabled after retry");
                          }
                        }, 1000);
                      }
                    } else {
                      debugLog("Pill not created, send aborted");
                    }
                  }, 500);
                } else {
                  debugLog("Input field not found within container");
                }
              }, 300); // Close the setTimeout for subject/body population
            } else {
              debugLog(
                `Elements not found - Container: ${!!recipientContainer}, Send: ${!!sendButton}`
              );

              // Fallback: Try to work directly with the input field
              if (!recipientContainer && sendButton) {
                debugLog("Attempting fallback: direct input field manipulation");

                let recipientInput = null;
                for (const selector of selectors[MESSAGE_TYPES.RECIPIENT]) {
                  const element = document.querySelector(selector);
                  if (element) {
                    recipientInput = element;
                    debugLog(`Found recipient input with selector: ${selector}`);
                    break;
                  }
                }

                if (recipientInput) {
                  let recipientContent = GM_getValue("recipientContent");

                  // Focus the input
                  recipientInput.focus();

                  // Set value
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value"
                  ).set;
                  nativeInputValueSetter.call(recipientInput, recipientContent);

                  // Trigger events
                  recipientInput.dispatchEvent(new Event("focus", { bubbles: true }));
                  recipientInput.dispatchEvent(new Event("input", { bubbles: true }));
                  recipientInput.dispatchEvent(new KeyboardEvent("keydown", {
                    key: "Enter",
                    code: "Enter",
                    keyCode: 13,
                    bubbles: true,
                  }));
                  recipientInput.dispatchEvent(new KeyboardEvent("keyup", {
                    key: "Enter",
                    code: "Enter",
                    keyCode: 13,
                    bubbles: true,
                  }));

                  debugLog("Fallback method applied, waiting for pill creation");

                  // Wait and check for pill
                  setTimeout(() => {
                    const pill =
                      document.querySelector('[data-test-id="pill"]') ||
                      document.querySelector('[data-test-id="y-pill"]');

                    if (pill) {
                      debugLog("Pill created via fallback, attempting to send");
                      if (
                        !sendButton.hasAttribute("aria-disabled") ||
                        sendButton.getAttribute("aria-disabled") === "false"
                      ) {
                        debugLog("Send button enabled, clicking");
                        sendButton.click();
                        setTimeout(() => {
                          sendInProgress = false;
                          debugLog("Send in progress flag CLEARED (fallback path)");
                        }, 1000);
                      } else {
                        debugLog("Send button disabled, will retry");
                        setTimeout(() => {
                          if (
                            !sendButton.hasAttribute("aria-disabled") ||
                            sendButton.getAttribute("aria-disabled") === "false"
                          ) {
                            sendButton.click();
                            setTimeout(() => {
                              sendInProgress = false;
                              debugLog("Send in progress flag CLEARED (fallback path delayed)");
                            }, 1000);
                          }
                        }, 1000);
                      }
                    } else {
                      debugLog("Pill not created with fallback method");
                    }
                  }, 500);
                } else {
                  debugLog("Recipient input field not found even with all selectors");
                }
              }

              // Additional debug info
              const allSendButtons = document.querySelectorAll(
                'button[data-test-id="compose-send-button"]'
              );
              debugLog(
                `Found ${allSendButtons.length} send buttons with data-test-id`
              );
              allSendButtons.forEach((btn, index) => {
                debugLog(`Button ${index} attributes: ${btn.outerHTML}`);
              });
            }
          } else if (buttonTrigger.action === "compose") {
            debugLog("Compose trigger received, looking for compose button");

            // --- MODIFIED COMPOSE BUTTON SELECTOR ---
            const composeButton =
              document.querySelector('button[aria-label*="Compose"]') || // Best: ARIA
              document.querySelector('a[data-test-id="compose-button"]') ||
              document.querySelector(
                'button[data-test-id*="Compose"]' // Flexible data-test-id
              );

            if (composeButton) {
              debugLog("Compose button found, clicking it");
              composeButton.click();
            } else {
              debugLog("Compose button not found in either UI version");
            }
          }
        } else if (buttonTrigger.status === "reset") {
          debugLog(`${buttonTrigger.action} trigger reset received`);
        }
      }

      // Regular text sync check (but NOT during send operation)
      if (!sendInProgress) {
        const syncedData = GM_getValue("syncedText");
        if (syncedData && syncedData.timestamp > lastTimestamp) {
          lastTimestamp = syncedData.timestamp;
          debugLog(`New synced data received of type: ${syncedData.type}`);
          updateYahooMailElement(syncedData.type, syncedData.content);
        }
      } else {
        debugLog("Skipping sync - send in progress");
      }
    }, 500);
  }

  async function checkReactOpen() {
    GM_setValue(
      "reactOpen",
      !window.location.hostname.includes("mail.yahoo.com")
    );
  }

  // Repeatedly update reactOpen state
  checkReactOpen();
  setInterval(checkReactOpen, 1000);

  // Add delay before initialization
  debugLog("Waiting 1000ms for page to load...");
  setTimeout(() => {
    if (window.location.hostname.includes("mail.yahoo.com")) {
      debugLog("Initializing Yahoo Mail handler (Robust v1.7)");
      handleYahooMail();
    } else {
      debugLog("Initializing React app handler (Robust v1.7)");
      handleReactApp();
    }
  }, 1000);
})();