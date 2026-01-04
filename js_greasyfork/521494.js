// ==UserScript==
// @name         Auto Message Boo
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automate messaging with extracted name to boo
// @author       Narender
// @match        https://boo.world/match
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521494/Auto%20Message%20Boo.user.js
// @updateURL https://update.greasyfork.org/scripts/521494/Auto%20Message%20Boo.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ================================
  // CONFIGURATION
  // ================================
  const newMessageButtonXPath = [
    "/html/body/div/main/div[2]/div[7]/div/div[2]/div[2]/div[2]/div[5]",
    "/html/body/div/main/div[2]/div[7]/div/div[2]/div[2]/div[3]/div[5]",
  ];

  const textAreaXPath = [
    "/html/body//textarea",
    "/html/body/div[2]/div/div/div/div[2]/div/div/div/div[4]/div[1]/textarea",
  ];

  const sendButtonXPath = [
    "/html/body//div//img[contains(@src, '/icons/universe/blue/send.svg')]",
    "/html/body/div[2]/div/div/div/div[2]/div/div/div/div[4]/div[2]/div/div/div/img",
  ];


    const messageTemplate = [
        "Hey {name}, Ryan here! Are you single, or is someone already lucky enough to have your heart?",
        "Hi {name}, I’m Ryan! Are you single, or in a relationship right now?",
        "Hey {name}, Ryan here! Just curious—are you single, or taken?",
        "Hi {name}, it’s Ryan! Are you currently single, or seeing someone?",
        "Hey {name}, Ryan here! Are you single, or is there someone special in your life?",
        "Hi {name}, I’m Ryan! Are you single, or with someone already?",
        "Hey {name}, it’s Ryan! Just wondering—are you single, or in a relationship?",
        "Hi {name}, I’m Ryan! Are you single, or is there someone you're into?",
        "Hey {name}, Ryan here! Are you single, or already taken?",
        "Hi {name}, it’s Ryan! Are you single, or in a relationship right now?",
        "Hey {name}, Ryan here! Are you single, or is someone already in the picture?",
        "Hi {name}, I’m Ryan! Are you single, or seeing someone?",
        "Hey {name}, Ryan here! Just wondering—are you single, or is your heart already taken?",
        "Hi {name}, it’s Ryan! Are you single, or already with someone?",
        "Hey {name}, Ryan here! Are you single, or is someone special already in your life?",
        "Hi {name}, I’m Ryan! Are you single, or already taken by someone?",
        "Hey {name}, it’s Ryan! Just curious—are you single, or in a relationship?",
        "Hi {name}, I’m Ryan! Are you single, or seeing someone special?",
        "Hey {name}, Ryan here! Are you single, or in a relationship?",
        "Hi {name}, it’s Ryan! Are you single, or is there someone already in the picture?",
        "Hey {name}, Ryan here! Just curious—are you single, or already in a relationship?",
        "Hi {name}, it’s Ryan! Are you single, or is someone already in your life?",
        "Hey {name}, Ryan here! Are you single, or already seeing someone?",
        "Hi {name}, it’s Ryan! Are you single, or is someone already taking up your time?",
        "Hey {name}, Ryan here! Are you single, or is your heart already with someone?",
        "Hi {name}, I’m Ryan! Are you single, or is there someone special in your life?",
        "Hey {name}, Ryan here! Are you single, or already with someone?",
        "Hi {name}, it’s Ryan! Are you single, or in a relationship?",
        "Hey {name}, Ryan here! Are you single, or already taken by someone special?",
        "Hi {name}, I’m Ryan! Are you single, or already involved with someone?"
    ];


  let iterationCount = 0;
  const MAX_ITERATIONS = 15;
  const RETRY_DELAY = 3000; // 3 seconds

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  // Wait for a specified amount of time
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get an element by its XPath
  function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  // Wait for an element to be available
  async function waitForElement(xpaths, timeout = 60000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      for (let xpath of xpaths) {
        console.log(`Trying xpath ${xpath}`);
        const element = getElementByXPath(xpath);
        if (element) return element;
        await wait(500);
      }
    }
    throw new Error("None of the elements with provided XPaths were found within the timeout");
  }

  // Type a message one character at a time
  async function typeMessage(element, message) {
    for (let char of message) {
      const keydownEvent = new KeyboardEvent("keydown", {
        key: char,
        code: char.charCodeAt(0).toString(),
        keyCode: char.charCodeAt(0),
        which: char.charCodeAt(0),
        bubbles: true,
      });
      element.dispatchEvent(keydownEvent);

      const inputEvent = new Event("input", { bubbles: true });
      element.value += char;
      element.dispatchEvent(inputEvent);

      await wait(150);
    }
  }

  // ================================
  // MESSAGE CREATION & SENDING
  // ================================

  // Get a random message template and personalize it
  function getRandomMessage(name) {
    const randomIndex = Math.floor(Math.random() * messageTemplate.length);
    return messageTemplate[randomIndex].replace("{name}", name);
  }

  // Send a message
  async function sendMessage(textArea, message) {
    console.log(`Sending message: ${message}`);
    textArea.value = ""; // Clear the text area
    await typeMessage(textArea, message);

    // Wait for the send button and click it
    console.log("[+] Waiting for send button");
    const sendButton = await waitForElement(sendButtonXPath);
    console.log("[+] Send button found, sending message");
    sendButton.click();
  }

  // ================================
  // MAIN AUTOMATION
  // ================================

  async function automateMessage() {
    console.log("[+] Waiting for new message button");

    try {
      // Wait for the new message button and click it
      const messageElement = await waitForElement(newMessageButtonXPath);
      console.log("[+] Message button found, clicking");
      messageElement.click();
      await wait(1000); // Wait for 1 second to ensure the text area loads

      console.log("[+] Waiting for text area");
      const textArea = await waitForElement(textAreaXPath);
      console.log("[+] Text area found");

      const nameMatch = textArea.placeholder.match(/Message\s+(\S+)/);
      const name = nameMatch ? nameMatch[1] : "There"; // Fallback to "There" if no name is found

      const personalizedMessage = getRandomMessage(name);
      await sendMessage(textArea, personalizedMessage);

      console.log("[+] Message Sent");
      return Promise.resolve(`Message sent to ${name}.`);
    } catch (error) {
      console.error("Error during message automation:", error.message);
      return Promise.reject("Automation error: " + error.message);
    }
  }

  // ================================
  // REPEATING AUTOMATION
  // ================================

  function repeatAutomation() {
    automateMessage()
      .then((result) => {
        iterationCount++;
        console.log(`[+] Completed iteration ${iterationCount}`);

        if (iterationCount >= MAX_ITERATIONS) {
          console.log("[+] Iteration threshold reached, reloading page...");
          location.reload();
        } else {
          setTimeout(repeatAutomation, RETRY_DELAY); // Retry after a delay
        }
      })
      .catch((error) => {
        console.error("Error in automateMessage, reloading:", error);
        location.reload();
      });
  }

  // Start the automation process once the page is ready
  console.log("[+] Starting Boo message engine...");
  repeatAutomation();
})();
