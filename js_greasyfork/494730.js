// ==UserScript==
// @name         HumanType Pro
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Types your text in a human-like manner so the edit history shows the progress.
// @author       AWarrior
// @match        https://docs.google.com/*
// @icon         https://i.imgur.com/z2gxKWZ.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494730/HumanType%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/494730/HumanType%20Pro.meta.js
// ==/UserScript==

//This was a better option than using match in the script as otherwise you would need to reload the document page if you open a document/slide from going first to docs.google.com.
if (window.location.href.includes("docs.google.com/document/d") || window.location.href.includes("docs.google.com/presentation/d")) {
    // Your script code here
    console.log("Document opened, Human-Typer available!");
    // Add your script logic here

// Create the "Human-Typer" button
const humanTyperButton = document.createElement("div");
humanTyperButton.textContent = "HumanType Pro";
humanTyperButton.classList.add("menu-button", "goog-control", "goog-inline-block");
humanTyperButton.style.userSelect = "none";
humanTyperButton.setAttribute("aria-haspopup", "true");
humanTyperButton.setAttribute("aria-expanded", "false");
humanTyperButton.setAttribute("aria-disabled", "false");
humanTyperButton.setAttribute("role", "menuitem");
humanTyperButton.id = "human-type-pro-button";
humanTyperButton.style.transition = "color 0.3s";

// Create the "Stop" button
const stopButton = document.createElement("div");
stopButton.textContent = "Stop";
stopButton.classList.add("menu-button", "goog-control", "goog-inline-block");
stopButton.style.userSelect = "none";
stopButton.style.color = "red";
stopButton.style.cursor = "pointer";
stopButton.style.transition = "color 0.3s";
stopButton.id = "stop-button";
stopButton.style.display = "none";

// Insert the buttons into the page
const extensionsMenu = document.getElementById("docs-extensions-menu");
extensionsMenu.parentNode.insertBefore(humanTyperButton, extensionsMenu);
humanTyperButton.parentNode.insertBefore(stopButton, humanTyperButton.nextSibling);

let cancelTyping = false;
let typingInProgress = false;
let lowerBoundValue = 60; // Default lower bound value
let upperBoundValue = 140; // Default upper bound value
let pauseDuration = 500; // Default pause duration in milliseconds


// Function to create and show the overlay
function showOverlay() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "50%";
  overlay.style.left = "50%";
  overlay.style.transform = "translate(-50%, -50%)";
  overlay.style.backgroundColor = "#1f1f1f"; // Dark background color
  overlay.style.padding = "20px";
  overlay.style.borderRadius = "8px";
  overlay.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.5)"; // Darker shadow
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.width = "320px";

  const description = document.createElement("p");
  description.textContent = "HumanTyper Pro by AWarrior";
  description.style.fontSize = "14px";
  description.style.color = "#ccc"; // Light grey text color
  description.style.marginBottom = "15px";

  const randomDelayLabel = document.createElement("div");
  randomDelayLabel.style.marginBottom = "5px";
  randomDelayLabel.style.color = "#ccc"; // Light grey text color

  const lowerBoundLabel = document.createElement("label");
  lowerBoundLabel.textContent = "Lower Bound (ms): ";
  lowerBoundLabel.style.color = "#ccc"; // Light grey text color
  const lowerBoundInput = document.createElement("input");
  lowerBoundInput.type = "number";
  lowerBoundInput.min = "0";
  lowerBoundInput.value = lowerBoundValue; // Set the value from the stored variable
  lowerBoundInput.style.marginRight = "10px";
  lowerBoundInput.style.padding = "6px";
  lowerBoundInput.style.border = "1px solid #555"; // Dark grey border
  lowerBoundInput.style.borderRadius = "4px";
  lowerBoundInput.style.color = "#fff"; // White text color
  lowerBoundInput.style.backgroundColor = "#333"; // Dark grey background color

  const upperBoundLabel = document.createElement("label");
  upperBoundLabel.textContent = "Upper Bound (ms): ";
  upperBoundLabel.style.color = "#ccc"; // Light grey text color
  const upperBoundInput = document.createElement("input");
  upperBoundInput.type = "number";
  upperBoundInput.min = "0";
  upperBoundInput.value = upperBoundValue; // Set the value from the stored variable
  upperBoundInput.style.marginRight = "10px";
  upperBoundInput.style.padding = "6px";
  upperBoundInput.style.border = "1px solid #555"; // Dark grey border
  upperBoundInput.style.borderRadius = "4px";
  upperBoundInput.style.color = "#fff"; // White text color
  upperBoundInput.style.backgroundColor = "#333"; // Dark grey background color

  const pauseDurationLabel = document.createElement("label");
  pauseDurationLabel.textContent = "Pause Duration (ms): ";
  pauseDurationLabel.style.color = "#ccc"; // Light grey text color
  const pauseDurationInput = document.createElement("input");
  pauseDurationInput.type = "number";
  pauseDurationInput.min = "0";
  pauseDurationInput.value = pauseDuration;
  pauseDurationInput.style.marginRight = "10px";
  pauseDurationInput.style.padding = "6px";
  pauseDurationInput.style.border = "1px solid #555"; // Dark grey border
  pauseDurationInput.style.borderRadius = "4px";
  pauseDurationInput.style.color = "#fff"; // White text color
  pauseDurationInput.style.backgroundColor = "#333"; // Dark grey background color

    const textField = document.createElement("textarea");
  textField.rows = "5";
  textField.cols = "40";
  textField.placeholder = "Enter your text...";
  textField.style.marginBottom = "10px";
  textField.style.width = "100%";
  textField.style.padding = "8px";
  textField.style.border = "1px solid #555"; // Dark grey border
  textField.style.borderRadius = "4px";
  textField.style.resize = "vertical";
  textField.style.color = "#fff"; // White text color
  textField.style.backgroundColor = "#333"; // Dark grey text area background

  const confirmButton = document.createElement("button");
  confirmButton.textContent = textField.value.trim() === "" ? "Cancel" : "Confirm"; // Change button text based on textfield
  confirmButton.style.padding = "8px 16px";
  confirmButton.style.backgroundColor = "#4CAF50"; // Green button color
  confirmButton.style.color = "#fff"; // White text color
  confirmButton.style.border = "none";
  confirmButton.style.borderRadius = "4px";
  confirmButton.style.cursor = "pointer";
  confirmButton.style.transition = "background-color 0.3s";

  overlay.appendChild(description);
  overlay.appendChild(textField);
  overlay.appendChild(randomDelayLabel);
  overlay.appendChild(lowerBoundLabel);
  overlay.appendChild(lowerBoundInput);
  overlay.appendChild(upperBoundLabel);
  overlay.appendChild(upperBoundInput);
  overlay.appendChild(pauseDurationLabel);
  overlay.appendChild(pauseDurationInput);
  overlay.appendChild(document.createElement("br"));
  overlay.appendChild(confirmButton);
  document.body.appendChild(overlay);

  return new Promise((resolve) => {
    const updateRandomDelayLabel = () => {
      const charCount = textField.value.length;
      const etaLowerBound = Math.ceil((charCount * parseInt(lowerBoundInput.value)) / 60000);
      const etaUpperBound = Math.ceil((charCount * parseInt(upperBoundInput.value)) / 60000);
      randomDelayLabel.textContent = `ETA: ${etaLowerBound} - ${etaUpperBound} minutes`;
    };

    const handleCancelClick = () => {
      cancelTyping = true;
      stopButton.style.display = "none";
    };

    confirmButton.addEventListener("click", () => {
      const userInput = textField.value.trim();
      lowerBoundValue = parseInt(lowerBoundInput.value); // Store the updated value
      upperBoundValue = parseInt(upperBoundInput.value); // Store the updated value
      pauseDuration = parseInt(pauseDurationInput.value); // Store the updated pause duration value


      if (userInput === "") {
        document.body.removeChild(overlay);
        return;
      }

      if (isNaN(lowerBoundValue) || isNaN(upperBoundValue) || lowerBoundValue < 0 || upperBoundValue < lowerBoundValue) return;

      typingInProgress = true; // Typing has started
      stopButton.style.display = "inline"; // Show the stop button
      document.body.removeChild(overlay);
      resolve({ userInput });
    });

    textField.addEventListener("input", () => {
      confirmButton.textContent = textField.value.trim() === "" ? "Cancel" : "Confirm"; // Change button text based on textfield
      updateRandomDelayLabel();
    });

    lowerBoundInput.addEventListener("input", updateRandomDelayLabel);
    upperBoundInput.addEventListener("input", updateRandomDelayLabel);

    stopButton.addEventListener("click", handleCancelClick);
  });
}

humanTyperButton.addEventListener("mouseenter", () => {
  humanTyperButton.classList.add("goog-control-hover");
});

humanTyperButton.addEventListener("mouseleave", () => {
  humanTyperButton.classList.remove("goog-control-hover");
});

stopButton.addEventListener("mouseenter", () => {
  stopButton.classList.add("goog-control-hover");
});

stopButton.addEventListener("mouseleave", () => {
  stopButton.classList.remove("goog-control-hover");
});

humanTyperButton.addEventListener("click", async () => {
  if (typingInProgress) {
    console.log("Typing in progress, please wait...");
    return;
  }

  cancelTyping = false;
  stopButton.style.display = "none"; // Hide the stop button

  const { userInput } = await showOverlay();

  if (userInput !== "") {
    const input = document.querySelector(".docs-texteventtarget-iframe").contentDocument.activeElement;

      async function simulateTyping(inputElement, char, delay) {
          return new Promise((resolve) => {
              if (cancelTyping) {
                  stopButton.style.display = "none";
                  console.log("Typing cancelled");
                  resolve();
                  return;
              }

              setTimeout(() => {
                  let eventObj;
                  if (char === "\n") {
                      eventObj = new KeyboardEvent("keydown", {
                          bubbles: true,
                          key: "Enter",
                          code: "Enter",
                          keyCode: 13,
                          which: 13,
                          charCode: 13,
                      });
                  } else {
                      eventObj = new KeyboardEvent("keypress", {
                          bubbles: true,
                          key: char,
                          charCode: char.charCodeAt(0),
                          keyCode: char.charCodeAt(0),
                          which: char.charCodeAt(0),
                      });
                  }

                  inputElement.dispatchEvent(eventObj);
                  console.log(`Typed: ${char}, Delay: ${delay}ms`);

                  // Pause typing if char is one of the specified characters
                  if (char === '.' || char === ',' || char === ';' || char === ':' || char === "'" || char === '"' || char === ')' || char === '(') {
                      setTimeout(() => {
                          resolve();
                      }, pauseDuration); // pauseDuration is the duration in milliseconds
                  } else {
                      resolve();
                  }
              }, delay);
          });
      }


    async function typeStringWithRandomDelay(inputElement, string) {
      for (let i = 0; i < string.length; i++) {
        const char = string[i];
        const randomDelay = Math.floor(Math.random() * (upperBoundValue - lowerBoundValue + 1)) + lowerBoundValue; // Random delay within the specified range
        await simulateTyping(inputElement, char, randomDelay);
      }

      typingInProgress = false; // Typing has finished
      stopButton.style.display = "none"; // Hide the stop button
    }

    typeStringWithRandomDelay(input, userInput);
  }
});



    }

else {
    console.log("Document not open, Human-Typer not available.");
}
