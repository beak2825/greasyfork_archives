// ==UserScript==
// @name         maskGPT
// @namespace    chatgpt.mask
// @version      1.0
// @description  change avatar of ChatGPT
// @author       realian
// @license      MIT
// @match        *://chat.openai.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/465183/maskGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/465183/maskGPT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    let uploadedImage = null;
    let characterName = 'Maria';
    let imageHeight = '20vh';
    let imageWidth = '10vh';
    let border = "2px solid #0e0e0e";
    let borderRadius = '10rem';

    // Function to handle the uploaded image
    function handleUploadedImage(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            uploadedImage = new Image();
            uploadedImage.src = e.target.result;
            uploadedImage.style.height = "100%";
            uploadedImage.style.width = "100%";
            uploadedImage.style.objectFit = "cover";
            uploadedImage.style.borderRadius = borderRadius;
            uploadedImage.style.border = border;
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    // Function to handle Avatar manipulation
    function manipulateSvgElements(svgElement) {
        // Check if image uploaded
        if (!uploadedImage) {
            console.log("Image not uploaded.");
            return;
        }
        // Check if the svg element has already been manipulated
        if (svgElement.classList.contains("manipulated")) {
            return;
        }
        svgElement.classList.add("manipulated");
        const grandparentElement = svgElement.parentNode.parentNode;

        // Hide all children of the grandparent element
        grandparentElement.querySelectorAll("*").forEach(child => {
            child.style.display = "none";
        });

        // Add a new child element to the grandparent element
        const newChildElement = document.createElement("div");
        newChildElement.style.height = imageHeight;
        newChildElement.style.width = imageWidth;
        grandparentElement.appendChild(newChildElement);

        newChildElement.appendChild(uploadedImage.cloneNode(true));

    }
    // Function to handle Name append
    function manipulateMarkdownElements(markdownElement) {
        // Check if image uploaded
        if (!uploadedImage) {
            console.log("Image not uploaded.");
            return;
        }
        // Check if the svg element has already been manipulated
        if (markdownElement.classList.contains("manipulated")) {
            return;
        }
        markdownElement.classList.add("manipulated");
        const grandgrandparentElement = markdownElement.parentNode.parentNode.parentNode;


        // Add a new child element to the grandparent element
        const newChildElement = document.createElement("p");
        newChildElement.innerText = characterName;
        newChildElement.style.fontSize = "large";
        newChildElement.style.fontWeight = "bold";
        grandgrandparentElement.insertBefore(newChildElement, grandgrandparentElement.firstChild);

    }

    // Observe DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const svgElement = node.querySelector("svg.h-6.w-6");
                        if (svgElement) {
                            console.log("Changing avatar...");
                            const markdownElement = node.querySelector("div.markdown");
                            manipulateSvgElements(svgElement);
                            manipulateMarkdownElements(markdownElement);
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Inject the input element for uploading an avatar
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.style.color = "black";
    inputElement.accept = "image/*";
    inputElement.addEventListener("change", handleUploadedImage);
    //document.body.appendChild(inputElement);
    // Create input elements for user-defined values
    const characterNameInput = document.createElement("input");
    characterNameInput.type = "text";
    characterNameInput.placeholder = "Character Name";
    characterNameInput.value = "Maria";
    characterNameInput.style.color = 'black';
    const imageHeightInput = document.createElement("input");
    imageHeightInput.type = "text";
    imageHeightInput.placeholder = "Image Height";
    imageHeightInput.value = "20vh";
    imageHeightInput.style.color = 'black';
    const imageWidthInput = document.createElement("input");
    imageWidthInput.type = "text";
    imageWidthInput.placeholder = "Image Width";
    imageWidthInput.value = "10vh";
    imageWidthInput.style.color = 'black';
    const borderRadiusInput = document.createElement("input");
    borderRadiusInput.type = "text";
    borderRadiusInput.placeholder = "Border Radius";
    borderRadiusInput.value = "10rem";
    borderRadiusInput.style.color = 'black';
    const borderInput = document.createElement("input");
    borderInput.type = "text";
    borderInput.placeholder = "Border [e.g. 1px solid black]";
    borderInput.value = "2px solid #0e0e0e";
    borderInput.style.color = 'black';
    // Update the input elements' event listeners
    characterNameInput.addEventListener("input", (event) => {
        characterName = event.target.value;
    });

    imageHeightInput.addEventListener("input", (event) => {
        imageHeight = event.target.value;
    });

    imageWidthInput.addEventListener("input", (event) => {
        imageWidth = event.target.value;
    });

    borderRadiusInput.addEventListener("input", (event) => {
        borderRadius = event.target.value;
    });
    borderInput.addEventListener("input", (event) => {
        border = event.target.value;
    });


    // Deal with initialization
    // Function to manipulate all available svg.h-6.w-6 elements
    function manipulateAllSvgElements() {
        if (!uploadedImage) {
            return;
        }

        const svgElements = document.querySelectorAll("svg.h-6.w-6");
        svgElements.forEach((svgElement) => {
            manipulateSvgElements(svgElement);
        });
    }
    // Function to manipulate all available div.markdown elements
    function manipulateAllMarkdownElements() {
        if (!uploadedImage) {
            return;
        }

        const markdownElements = document.querySelectorAll("div.markdown");
        markdownElements.forEach((markdownElement) => {
            manipulateMarkdownElements(markdownElement);
        });
    }
    function manipulateAll() {
        manipulateAllMarkdownElements();
        manipulateAllSvgElements();
    }
// Function to create a label and input pair
function createLabeledInput(labelText, inputElement) {
    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.display = "block";
    label.style.marginTop = "10px";
    label.style.color = "black";

    const container = document.createElement("div");
    container.appendChild(label);
    container.appendChild(inputElement);

    return container;
  }

    // Inject the button for manipulating all available svg.h-6.w-6 elements
    const manipulateAllButton = document.createElement("button");
    manipulateAllButton.innerText = "Render All";
    manipulateAllButton.style.backgroundColor = "green";
    manipulateAllButton.addEventListener("click", manipulateAll);
    //document.body.appendChild(manipulateAllButton);
    // Create the config button
    const configButton = document.createElement("button");
    configButton.innerText = "Config";
    configButton.style.position = "fixed";
    configButton.style.top = "10px";
    configButton.style.right = "10px";
    configButton.style.zIndex = "10000";
    document.body.appendChild(configButton);

    // Create the popup div
    const popupDiv = document.createElement("div");
    popupDiv.style.display = "none";
    popupDiv.style.position = "fixed";
    popupDiv.style.top = "50%";
    popupDiv.style.left = "50%";
    popupDiv.style.transform = "translate(-50%, -50%)";
    popupDiv.style.backgroundColor = "white";
    popupDiv.style.padding = "20px";
    popupDiv.style.border = "1px solid #ccc";
    popupDiv.style.zIndex = "10001";
    document.body.appendChild(popupDiv);

    // Move the existing buttons and input element into the popup div
    popupDiv.appendChild(inputElement);
    popupDiv.appendChild(document.createElement("br"));
// Add labeled input elements to the popup div
popupDiv.appendChild(createLabeledInput("File:", inputElement));
popupDiv.appendChild(document.createElement("br"));
popupDiv.appendChild(createLabeledInput("Character Name:", characterNameInput));
popupDiv.appendChild(document.createElement("br"));
popupDiv.appendChild(createLabeledInput("Image Height:", imageHeightInput));
popupDiv.appendChild(document.createElement("br"));
popupDiv.appendChild(createLabeledInput("Image Width:", imageWidthInput));
popupDiv.appendChild(document.createElement("br"));
popupDiv.appendChild(createLabeledInput("Border: [format: size style color]", borderInput));
popupDiv.appendChild(document.createElement("br"));
popupDiv.appendChild(createLabeledInput("Border Radius:", borderRadiusInput));
popupDiv.appendChild(document.createElement("br"));
popupDiv.appendChild(manipulateAllButton);
popupDiv.appendChild(document.createElement("br"));

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.backgroundColor = "red";
    closeButton.addEventListener("click", () => {
        popupDiv.style.display = "none";
    });
    popupDiv.appendChild(closeButton);

    // Show the popup div when the config button is clicked
    configButton.addEventListener("click", () => {
        popupDiv.style.display = "block";
    });

})();