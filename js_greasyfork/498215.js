// ==UserScript==
// @name         Human-Typer (Automatic) - Google Docs & Slides
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Types your text in a human-like manner so the edit history shows the progress. https://greasyfork.org/en/users/449798-ace-dx
// @author       ∫(Ace)³dx
// @match        https://docs.google.com/*
// @icon         https://i.imgur.com/z2gxKWZ.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498215/Human-Typer%20%28Automatic%29%20-%20Google%20Docs%20%20Slides.user.js
// @updateURL https://update.greasyfork.org/scripts/498215/Human-Typer%20%28Automatic%29%20-%20Google%20Docs%20%20Slides.meta.js
// ==/UserScript==

//This was a better option than using match in the script as otherwise you would need to reload the document page if you open a document/slide from going first to docs.google.com.
if (window.location.href.includes("docs.google.com/document/d") || window.location.href.includes("docs.google.com/presentation/d")) {
    // Your script code here
    console.log("Document opened, Human-Typer available!");
    // Add your script logic here

// Create the "Human-Typer" button
const humanTyperButton = document.createElement("div");
humanTyperButton.textContent = "Human-Typer";
humanTyperButton.classList.add("menu-button", "goog-control", "goog-inline-block");
humanTyperButton.style.userSelect = "none";
humanTyperButton.setAttribute("aria-haspopup", "true");
humanTyperButton.setAttribute("aria-expanded", "false");
humanTyperButton.setAttribute("aria-disabled", "false");
humanTyperButton.setAttribute("role", "menuitem");
humanTyperButton.id = "human-typer-button";
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

const qwertyAdjacency = {
    a: ['q', 'w', 's', 'z'],
    b: ['v', 'f', 'g', 'h', 'n'],
    c: ['x', 'd', 'f', 'v'],
    d: ['s', 'e', 'r', 'f', 'c', 'x'],
    e: ['w', 's', 'd', 'r'],
    f: ['d', 'r', 't', 'g', 'v', 'c'],
    g: ['f', 't', 'y', 'h', 'b', 'v'],
    h: ['g', 'y', 'u', 'j', 'n', 'b'],
    i: ['u', 'j', 'k', 'o'],
    j: ['h', 'u', 'i', 'k', 'n', 'm'],
    k: ['j', 'i', 'o', 'l', 'm', ','],
    l: ['k', 'o', 'p', ';'],
    m: ['n', 'j', 'k', ','],
    n: ['b', 'h', 'j', 'm'],
    o: ['i', 'k', 'l', 'p'],
    p: ['o', 'l', '[', ']'],
    q: ['a', 'w'],
    r: ['e', 'd', 'f', 't'],
    s: ['a', 'w', 'e', 'd', 'x', 'z'],
    t: ['r', 'f', 'g', 'y'],
    u: ['y', 'h', 'j', 'i'],
    v: ['c', 'f', 'g', 'b'],
    w: ['q', 'a', 's', 'e'],
    x: ['z', 's', 'd', 'c'],
    y: ['t', 'g', 'h', 'u'],
    z: ['a', 's', 'x'],
    '0': ['9', 'o', 'p', '['],
    '1': ['q', '2'],
    '2': ['1', 'q', 'w', '3'],
    '3': ['2', 'w', 'e', '4'],
    '4': ['3', 'e', 'r', '5'],
    '5': ['4', 'r', 't', '6'],
    '6': ['5', 't', 'y', '7'],
    '7': ['6', 'y', 'u', '8'],
    '8': ['7', 'u', 'i', '9'],
    '9': ['8', 'i', 'o', '0'],
    '[': ['p', ']', '\\'],
    ']': ['[', '\\', 'p'],
    '\\': [']', '['],
    ';': ['l', 'p', '['],
    '\'': [';', 'l'],
    ',': ['m', 'k', '.'],
    '.': [',', 'k', '/'],
    '/': ['.', 'k', 'l'],
    ' ': ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',']
};

// Insert the buttons into the page
const helpMenu = document.getElementById("docs-help-menu");
helpMenu.parentNode.insertBefore(humanTyperButton, helpMenu);
humanTyperButton.parentNode.insertBefore(stopButton, humanTyperButton.nextSibling);

let cancelTyping = false;
let typingInProgress = false;
let lowerBoundValue = 60; // Default lower bound value
let upperBoundValue = 140; // Default upper bound value
let percentageAccuracy = 95;
let correctionCoefficient = 0.4;

// Function to create and show the overlay
function showOverlay() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "50%";
  overlay.style.left = "50%";
  overlay.style.transform = "translate(-50%, -50%)";
  overlay.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  overlay.style.padding = "20px";
  overlay.style.borderRadius = "8px";
  overlay.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.1)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.width = "320px";

  const textField = document.createElement("textarea");
  textField.rows = "5";
  textField.cols = "40";
  textField.placeholder = "Enter your text...";
  textField.style.marginBottom = "10px";
  textField.style.width = "100%";
  textField.style.padding = "8px";
  textField.style.border = "1px solid #ccc";
  textField.style.borderRadius = "4px";
  textField.style.resize = "vertical";

    const description = document.createElement("div");
    description.display = "none";

    const title = document.createElement("h2");
    title.textContent = "Human Typer";

    const paragraph1 = document.createElement("p");
    paragraph1.textContent = "It's necessary to keep this tab open; otherwise, the script will pause and will resume once you return to it. (This behavior is caused by the way the browser functions.)";

    const timingInfoHeader = document.createElement("p");
    const timingInfoHeaderBold = document.createElement("strong");
    timingInfoHeaderBold.textContent = "Timing Information:";
    timingInfoHeader.appendChild(timingInfoHeaderBold);

    const timingInfoList = document.createElement("ul");
    const lowerBoundItem = document.createElement("li");
    const lowerBoundBold = document.createElement("strong");
    lowerBoundBold.textContent = "Lower Bound:";
    lowerBoundItem.appendChild(lowerBoundBold);
    lowerBoundItem.appendChild(document.createTextNode(" The minimum time in milliseconds per character."));

    const upperBoundItem = document.createElement("li");
    const upperBoundBold = document.createElement("strong");
    upperBoundBold.textContent = "Upper Bound:";
    upperBoundItem.appendChild(upperBoundBold);
    upperBoundItem.appendChild(document.createTextNode(" The maximum time in milliseconds per character."));

    timingInfoList.appendChild(lowerBoundItem);
    timingInfoList.appendChild(upperBoundItem);

    const randomDelayParagraph = document.createElement("p");
    randomDelayParagraph.textContent = "A random delay value will be selected between these bounds for every character in your text, ensuring that the typing appears natural and human-like.";

    const additionalInfoHeader = document.createElement("p");
    const additionalInfoHeaderBold = document.createElement("strong");
    additionalInfoHeaderBold.textContent = "Additional Information: ";
    additionalInfoHeader.appendChild(additionalInfoHeaderBold);

    const additionalInfoList = document.createElement("ul");
    const accuracyItem = document.createElement("li");
    const accuracyBold = document.createElement("strong");
    accuracyBold.textContent = "Percentage Accuracy: ";
    accuracyItem.appendChild(accuracyBold);
    accuracyItem.appendChild(document.createTextNode("The accuracy of typing. The amount of mistakes is inversely proportional to the percentage accuracy."));

    const correctionCoefficientItem = document.createElement("li");
    const correctionCoefficientBold = document.createElement("strong");
    correctionCoefficientBold.textContent = "Correction Coefficient: ";
    correctionCoefficientItem.appendChild(correctionCoefficientBold);
    correctionCoefficientItem.appendChild(document.createTextNode("Determines the amount of errors made before correcting them. A lower coefficient means mistakes are caught and corrected quicker, and vice versa."));

    additionalInfoList.appendChild(accuracyItem);
    additionalInfoList.appendChild(correctionCoefficientItem);

    description.appendChild(title);
    description.appendChild(paragraph1);
    description.appendChild(timingInfoHeader);
    description.appendChild(timingInfoList);
    description.appendChild(randomDelayParagraph);
    description.appendChild(additionalInfoHeader);
    description.appendChild(additionalInfoList);

    description.style.fontSize = "14px";
    description.style.marginBottom = "15px";



  const randomDelayLabel = document.createElement("div");
  randomDelayLabel.style.marginBottom = "5px";

  const lowerBoundLabel = document.createElement("label");
  lowerBoundLabel.textContent = "Lower Bound (ms): ";
  const lowerBoundInput = document.createElement("input");
  lowerBoundInput.type = "number";
  lowerBoundInput.min = "0";
  lowerBoundInput.value = lowerBoundValue; // Set the value from the stored variable
  lowerBoundInput.style.marginRight = "10px";
  lowerBoundInput.style.padding = "6px";
  lowerBoundInput.style.border = "1px solid #ccc";
  lowerBoundInput.style.borderRadius = "4px";

  const upperBoundLabel = document.createElement("label");
  upperBoundLabel.textContent = "Upper Bound (ms): ";
  const upperBoundInput = document.createElement("input");
  upperBoundInput.type = "number";
  upperBoundInput.min = "0";
  upperBoundInput.value = upperBoundValue; // Set the value from the stored variable
  upperBoundInput.style.marginRight = "10px";
  upperBoundInput.style.padding = "6px";
  upperBoundInput.style.border = "1px solid #ccc";
  upperBoundInput.style.borderRadius = "4px";

  const percentageAccuracyLabel = document.createElement("label");
  percentageAccuracyLabel.textContent = "Percentage Accuracy (%)";
  const percentageAccuracyInput = document.createElement("input");
  percentageAccuracyInput.type = "number";
  percentageAccuracyInput.min = "1";
  percentageAccuracyInput.max = "100";
  percentageAccuracyInput.value = percentageAccuracy; // Set the value from the stored variable
  percentageAccuracyInput.style.width = "138.5px";
  percentageAccuracyInput.style.marginRight = "10px";
  percentageAccuracyInput.style.padding = "6px";
  percentageAccuracyInput.style.border = "1px solid #ccc";
  percentageAccuracyInput.style.borderRadius = "4px";

  const correctionCoefficientLabel = document.createElement("label");
  correctionCoefficientLabel.textContent = "Correction Coefficient (0 - 1)";
  const correctionCoefficientInput = document.createElement("input");
  correctionCoefficientInput.type = "number";
  correctionCoefficientInput.min = "0.01";
  correctionCoefficientInput.max = "1";
  correctionCoefficientInput.step = "0.01";
  correctionCoefficientInput.value = correctionCoefficient; // Set the value from the stored variable
  correctionCoefficientInput.style.width = "138.5px";
  correctionCoefficientInput.style.marginRight = "10px";
  correctionCoefficientInput.style.padding = "6px";
  correctionCoefficientInput.style.border = "1px solid #ccc";
  correctionCoefficientInput.style.borderRadius = "4px";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = textField.value.trim() === "" ? "Cancel" : "Confirm"; // Change button text based on textfield
  confirmButton.style.padding = "8px 16px";
  confirmButton.style.backgroundColor = "#1a73e8";
  confirmButton.style.color = "white";
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
  overlay.appendChild(percentageAccuracyLabel);
  overlay.appendChild(percentageAccuracyInput);
  overlay.appendChild(correctionCoefficientLabel);
  overlay.appendChild(correctionCoefficientInput)
  overlay.appendChild(document.createElement("br"));
  overlay.appendChild(confirmButton);
  document.body.appendChild(overlay);

  return new Promise((resolve) => {
    const updateRandomDelayLabel = () => {
      const charCount = textField.value.length;
      const etaLowerBound = Math.ceil((charCount * parseInt(lowerBoundInput.value)) / 60000);
      const etaUpperBound = Math.ceil((charCount * parseInt(upperBoundInput.value)) / 60000 / (parseInt(percentageAccuracyInput.value) / 100));
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
      percentageAccuracy = parseInt(percentageAccuracyInput.value);
      correctionCoefficient = parseFloat(correctionCoefficientInput.value);

      if (userInput === "") {
        document.body.removeChild(overlay);
        return;
      }

      console.log(correctionCoefficient);
      if (isNaN(lowerBoundValue) || isNaN(upperBoundValue) || lowerBoundValue < 0 || upperBoundValue < lowerBoundValue ||
          isNaN(percentageAccuracy) || percentageAccuracy < 1 || percentageAccuracy > 100 || isNaN(correctionCoefficient) || correctionCoefficient < 0.01 || correctionCoefficient > 1) return;

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
    percentageAccuracyInput.addEventListener("input", updateRandomDelayLabel);

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
          } else if (char === "\b") {
              eventObj = new KeyboardEvent("keydown", {
              bubbles: true,
              key: "Backspace",
              code: "Backspace",
              keyCode: 8,
              which: 8,
              charCode: 8,
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
          resolve();
        }, delay);
      });
    }

    function randomAdjacentCharacter(char) {
        const possibleCharacters = qwertyAdjacency[char];
        return possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
    }

    function updateProgress(currentCharacters, totalCharacters) {
        humanTyperButton.textContent = (currentCharacters / totalCharacters * 100).toFixed(2) + " %";
    }

    async function typeStringWithRandomDelay(inputElement, string) {
      let errors = 0;
      let i = 0;
      const correctProbability = percentageAccuracy / 100;

      while (i < string.length) {
        const randomDelay = Math.floor(Math.random() * (upperBoundValue - lowerBoundValue + 1)) + lowerBoundValue; // Random delay within the specified range

        if (errors > 0 && (i + errors >= string.length || Math.random() < 1 - correctionCoefficient ** errors)) {
            for (let j = 0; j < errors; j++) {
                await simulateTyping(inputElement, '\b', randomDelay);
            }
            errors = 0;
        }


        const currentCharacter = string[i + errors];
        if (Math.random() > correctProbability && currentCharacter in qwertyAdjacency) {
            const errorCharacter = randomAdjacentCharacter(currentCharacter);
            await simulateTyping(inputElement, errorCharacter, randomDelay);
            errors++;
        } else {
            await simulateTyping(inputElement, currentCharacter, randomDelay);
            if (errors > 0) {
                errors++;
            } else {
                i++;
                updateProgress(i, string.length);
            }
        }
      }

      typingInProgress = false; // Typing has finished
      humanTyperButton.textContent = "Human-Typer";
      stopButton.style.display = "none"; // Hide the stop button
    }

    typeStringWithRandomDelay(input, userInput);
  }
});



    }

else {
    console.log("Document not open, Human-Typer not available.");
}