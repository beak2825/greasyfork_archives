// ==UserScript==
// @name         Human-Typer (With Deletion) - Google Docs & Slides
// @version      0.2.2
// @description  Types your text in a human-like manner with deletions and edits so the edit history shows a more realistic progress. (Fork of (Ace)³dx) 
// @author       Kap
// @match        https://docs.google.com/*
// @icon         https://i.imgur.com/z2gxKWZ.png
// @namespace https://greasyfork.org/users/1284825
// @downloadURL https://update.greasyfork.org/scripts/491826/Human-Typer%20%28With%20Deletion%29%20-%20Google%20Docs%20%20Slides.user.js
// @updateURL https://update.greasyfork.org/scripts/491826/Human-Typer%20%28With%20Deletion%29%20-%20Google%20Docs%20%20Slides.meta.js
// ==/UserScript==

if (window.location.href.includes("docs.google.com/document/d") || window.location.href.includes("docs.google.com/presentation/d")) {
    console.log("Document opened, Human-Typer available!");

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

    const stopButton = document.createElement("div");
    stopButton.textContent = "Stop";
    stopButton.classList.add("menu-button", "goog-control", "goog-inline-block");
    stopButton.style.userSelect = "none";
    stopButton.style.color = "red";
    stopButton.style.cursor = "pointer";
    stopButton.style.transition = "color 0.3s";
    stopButton.id = "stop-button";
    stopButton.style.display = "none";

    const helpMenu = document.getElementById("docs-help-menu");
    helpMenu.parentNode.insertBefore(humanTyperButton, helpMenu);
    humanTyperButton.parentNode.insertBefore(stopButton, humanTyperButton.nextSibling);

    let cancelTyping = false;
    let typingInProgress = false;
    let lowerBoundValue = 60;
    let upperBoundValue = 140;

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

        const description = document.createElement("p");
        description.textContent = "It's necessary to keep this tab open; otherwise, the script will pause and will resume once you return to it (this behavior is caused by the way the browser functions). Lower bound is the minimum time in milliseconds per character. Upper bound is the maximum time in milliseconds per character. A random delay value will be selected between these bounds for every character in your text, ensuring that the typing appears natural and human-like.";
        description.style.fontSize = "14px";
        description.style.marginBottom = "15px";

        const randomDelayLabel = document.createElement("div");
        randomDelayLabel.style.marginBottom = "5px";

        const lowerBoundLabel = document.createElement("label");
        lowerBoundLabel.textContent = "Lower Bound (ms): ";
        const lowerBoundInput = document.createElement("input");
        lowerBoundInput.type = "number";
        lowerBoundInput.min = "0";
        lowerBoundInput.value = lowerBoundValue;
        lowerBoundInput.style.marginRight = "10px";
        lowerBoundInput.style.padding = "6px";
        lowerBoundInput.style.border = "1px solid #ccc";
        lowerBoundInput.style.borderRadius = "4px";

        const upperBoundLabel = document.createElement("label");
        upperBoundLabel.textContent = "Upper Bound (ms): ";
        const upperBoundInput = document.createElement("input");
        upperBoundInput.type = "number";
        upperBoundInput.min = "0";
        upperBoundInput.value = upperBoundValue;
        upperBoundInput.style.marginRight = "10px";
        upperBoundInput.style.padding = "6px";
        upperBoundInput.style.border = "1px solid #ccc";
        upperBoundInput.style.borderRadius = "4px";

        const confirmButton = document.createElement("button");
        confirmButton.textContent = textField.value.trim() === "" ? "Cancel" : "Confirm";
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
                lowerBoundValue = parseInt(lowerBoundInput.value);
                upperBoundValue = parseInt(upperBoundInput.value);

                if (userInput === "") {
                    document.body.removeChild(overlay);
                    return;
                }

                if (isNaN(lowerBoundValue) || isNaN(upperBoundValue) || lowerBoundValue < 0 || upperBoundValue < lowerBoundValue) return;

                typingInProgress = true;
                stopButton.style.display = "inline";
                document.body.removeChild(overlay);
                resolve({ userInput });
            });

            textField.addEventListener("input", () => {
                confirmButton.textContent = textField.value.trim() === "" ? "Cancel" : "Confirm";
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
        stopButton.style.display = "none";

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
                        resolve();
                    }, delay);
                });
            }

            async function simulateDeletion(inputElement, delay) {
                return new Promise((resolve) => {
                    if (cancelTyping) {
                        stopButton.style.display = "none";
                        console.log("Typing cancelled");
                        resolve();
                        return;
                    }

                    setTimeout(() => {
                        const eventObj = new KeyboardEvent("keydown", {
                            bubbles: true,
                            key: "Backspace",
                            code: "Backspace",
                            keyCode: 8,
                            which: 8,
                            charCode: 8,
                        });

                        inputElement.dispatchEvent(eventObj);
                        console.log(`Deleted character, Delay: ${delay}ms`);
                        resolve();
                    }, delay);
                });
            }

            async function typeStringWithRandomDelay(inputElement, string) {
                const deleteThreshold = 0.01; // Adjust this value to control the frequency of deletions
                const randomSentences = [
                    "I think this sentence might work...",
                    "Let me try typing this instead...",
                    "How about something like this?",
                    "Maybe this will be better...",
                    "Let's see if this makes sense...",
                ];

                let typedText = "";

                for (let i = 0; i < string.length; i++) {
                    if (cancelTyping) {
                        break; // Stop typing if cancelTyping is set to true
                    }

                    const char = string[i];
                    const randomTypingDelay = Math.floor(Math.random() * (upperBoundValue - lowerBoundValue + 1)) + lowerBoundValue;
                    const randomDeletionDelay = Math.floor(Math.random() * (upperBoundValue - lowerBoundValue + 1)) + lowerBoundValue;

                    if (Math.random() < deleteThreshold && typedText.length > 0) {
                        // Pause typing and perform deletion
                        await new Promise((resolve) => setTimeout(resolve, randomDeletionDelay));

                        const wordsToDelete = Math.floor(Math.random() * 5) + 1; // Delete 1 to 5 words
                        const wordsArray = typedText.split(" ");
                        const deletedWords = wordsArray.slice(-wordsToDelete).join(" ");
                        const remainingText = wordsArray.slice(0, -wordsToDelete).join(" ");

                        // Delete the words
                        for (let j = 0; j < deletedWords.length; j++) {
                            if (cancelTyping) {
                                break; // Stop deleting if cancelTyping is set to true
                            }
                            await simulateDeletion(inputElement, randomDeletionDelay);
                        }

                        typedText = remainingText;

                        // Type a random sentence
                        const randomSentence = randomSentences[Math.floor(Math.random() * randomSentences.length)];
                        for (let j = 0; j < randomSentence.length; j++) {
                            if (cancelTyping) {
                                break; // Stop typing the random sentence if cancelTyping is set to true
                            }
                            await simulateTyping(inputElement, randomSentence[j], randomTypingDelay);
                        }

                        // Delete the random sentence
                        for (let j = 0; j < randomSentence.length + 1; j++) {
                            if (cancelTyping) {
                                break; // Stop deleting the random sentence if cancelTyping is set to true
                            }
                            await simulateDeletion(inputElement, randomDeletionDelay);
                        }

                        // Type the deleted words
                        for (let j = 0; j < deletedWords.length; j++) {
                            if (cancelTyping) {
                                break; // Stop typing the deleted words if cancelTyping is set to true
                            }
                            await simulateTyping(inputElement, deletedWords[j], randomTypingDelay);
                        }

                        typedText = remainingText + " " + deletedWords;
                    } else {
                        if (!cancelTyping) {
                            await simulateTyping(inputElement, char, randomTypingDelay);
                            typedText += char;
                        }
                    }
                }

                typingInProgress = false;
                stopButton.style.display = "none";
            }


            typeStringWithRandomDelay(input, userInput);
        }
    });
} else {
    console.log("Document not open, Human-Typer not available.");
}
