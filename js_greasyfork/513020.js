// ==UserScript==
// @name         Copy Images in One Click Freepik
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Provides buttons to copy image URLs and images themselves to clipboard.
// @author       GreatFireDragon
// @match        https://*.freepik.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freepik.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513020/Copy%20Images%20in%20One%20Click%20Freepik.user.js
// @updateURL https://update.greasyfork.org/scripts/513020/Copy%20Images%20in%20One%20Click%20Freepik.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply CSS styles for UI elements
    GM_addStyle(`
        body #__next:nth-child(4) { background-color: red; visibility: hidden; height: 0; width: 0; }
        div[data-ssm], figure[data-cy] > aside, figure[data-cy] figcaption { display: none; }
        .smiley-wrapper, .heart-wrapper { position: absolute; top: 0; right: 0; padding: 5px; background-color: grey; opacity: 0.3; transition: 1s; cursor: copy; }
        .heart-wrapper { right: 31px; }
        .smiley-wrapper:hover, .heart-wrapper:hover { opacity: 1; }
        @keyframes backgroundColorChange { 0% { background-color: initial; } 50% { background-color: #01cd5d; scale: 2; } 100% { background-color: initial; } }
        .copied { animation: backgroundColorChange 0.5s ease-in-out infinite; }
        figure.clicked { filter: grayscale(100%); transition: filter 0.5s; }
        figure.clicked:hover { filter: grayscale(0%); }
        button#clearTakenImages { color: #cacaca; font-weight: bold; transition: 0.5s; }
        button#clearTakenImages:hover { scale: 1.2; }
    `);

    // Constants
    const CLICKED_CLASS = "clicked";
    const SMILEY_WRAPPER_CLASS = "smiley-wrapper";
    const HEART_WRAPPER_CLASS = "heart-wrapper";
    const COPIED_CLASS = "copied";
    const SMILEY_EMOJI = "😀";
    const HEART_EMOJI = "😍";
    const CLEAR_BUTTON_ID = "clearTakenImages";
    let urlsToCopy = [];

    // Load clicked images from local storage
    function loadClickedImages() {
        const clickedImages = localStorage.getItem("clickedImages");
        return clickedImages ? JSON.parse(clickedImages) : [];
    }

    // Save clicked image to local storage
    function saveClickedImage(url) {
        const clickedImages = loadClickedImages();
        if (!clickedImages.includes(url)) {
            clickedImages.push(url);
            localStorage.setItem("clickedImages", JSON.stringify(clickedImages));
        }
    }

    // Apply clicked class to previously clicked images
    function applyClickedClass() {
        const clickedImages = loadClickedImages();
        const allFigures = document.querySelectorAll("figure[data-cy]");
        allFigures.forEach(figure => {
            const imgElement = figure.querySelector("img");
            if (imgElement && clickedImages.includes(imgElement.src)) {
                figure.classList.add(CLICKED_CLASS);
            }
        });
    }

    // Handle smiley click event
    function handleSmileyClick(event, figure, imgElement) {
        const url = imgElement.src;
        saveClickedImage(url);
        figure.classList.add(CLICKED_CLASS);
        if (event.shiftKey || event.ctrlKey) {
            urlsToCopy.push(url);
            setCopiedState(event.target);
        } else {
            navigator.clipboard.writeText(url).then(() => {
                setCopiedState(event.target);
            });
        }
    }

    // Handle heart click event
    function handleHeartClick(figure, imgElement) {
        const url = imgElement.src;
        saveClickedImage(url);
        figure.classList.add(CLICKED_CLASS);
        copyImageToClipboard(url, figure);
    }

    // Copy image to clipboard
    function copyImageToClipboard(url, figure) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (xhr.status === 200) {
                const blob = xhr.response;
                const reader = new FileReader();
                reader.onloadend = function () {
                    const img = new Image();
                    img.src = reader.result;
                    img.onload = function () {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(function (blob) {
                            const item = new ClipboardItem({ "image/png": blob });
                            navigator.clipboard.write([item]).then(() => {
                                setCopiedState(figure.querySelector(`.${HEART_WRAPPER_CLASS}`));
                            }).catch(err => console.error("Failed to copy image:", err));
                        }, "image/png");
                    };
                };
                reader.readAsDataURL(blob);
            }
        };
        xhr.send();
    }

    // Set the copied state for UI feedback
    function setCopiedState(element) {
        element.classList.add(COPIED_CLASS);
        setTimeout(() => element.classList.remove(COPIED_CLASS), 500);
    }

    // Add smiley and heart buttons to images
    function addButtonsToImages() {
        const allFigures = document.querySelectorAll("figure[data-cy]");
        allFigures.forEach(figure => {
            const imgElement = figure.querySelector("img");
            if (!imgElement) return;

            addButton(SMILEY_EMOJI, SMILEY_WRAPPER_CLASS, figure, imgElement, handleSmileyClick);
            addButton(HEART_EMOJI, HEART_WRAPPER_CLASS, figure, imgElement, handleHeartClick);
        });
        applyClickedClass();
    }

    // Create and append button to a figure element
    function addButton(emoji, className, figure, imgElement, eventHandler) {
        if (!figure.querySelector(`.${className}`)) {
            const buttonDiv = document.createElement("div");
            buttonDiv.textContent = emoji;
            buttonDiv.classList.add(className);
            buttonDiv.addEventListener("click", (event) => eventHandler(event, figure, imgElement));
            figure.appendChild(buttonDiv);
        }
    }

    // Clear clicked images from local storage
    function clearClickedImages() {
        localStorage.removeItem("clickedImages");
        const allFigures = document.querySelectorAll(`figure.${CLICKED_CLASS}`);
        allFigures.forEach(figure => figure.classList.remove(CLICKED_CLASS));
    }

    // Add a button to clear clicked images
    function addClearButton() {
        if (!document.getElementById(CLEAR_BUTTON_ID)) {
            const clearButton = document.createElement("button");
            clearButton.id = CLEAR_BUTTON_ID;
            clearButton.textContent = "Clear Taken Images";
            clearButton.addEventListener("click", clearClickedImages);
            document.body.appendChild(clearButton);
        }
    }

    // Handle keyup event for copying URLs
    document.addEventListener("keyup", (event) => {
        if (event.key === "Shift" || event.key === "Control") {
            if (urlsToCopy.length > 0) {
                const urlsString = urlsToCopy.join(" ");
                navigator.clipboard.writeText(urlsString).then(() => {
                    urlsToCopy = [];
                });
            }
        }
    });

    // Observe mutations to dynamically add buttons
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList" || mutation.type === "attributes") {
                addButtonsToImages();
                addClearButton();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial setup
    addButtonsToImages();
    addClearButton();
})();