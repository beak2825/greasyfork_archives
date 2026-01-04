// ==UserScript==
// @name         Custom Background Changer
// @version      1.0
// @description  Change the background of a website and replace it with your own custom image!
// @namespace    https://discord.gg/Mw2XjW99K7
// @author       P3ngwen
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529435/Custom%20Background%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/529435/Custom%20Background%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create GUI container
    let gui = document.createElement("div");
    gui.style.position = "fixed";
    gui.style.top = "50px";
    gui.style.right = "20px";
    gui.style.width = "220px";
    gui.style.padding = "10px";
    gui.style.background = "rgba(0, 0, 0, 0.8)";
    gui.style.color = "#fff";
    gui.style.border = "1px solid #ccc";
    gui.style.borderRadius = "8px";
    gui.style.zIndex = "10000";
    gui.style.userSelect = "none";
    gui.style.cursor = "grab";
    gui.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
    document.body.appendChild(gui);

    // Create title bar for dragging and buttons
    let titleBar = document.createElement("div");
    titleBar.style.background = "#444";
    titleBar.style.padding = "8px";
    titleBar.style.display = "flex";
    titleBar.style.justifyContent = "space-between";
    titleBar.style.alignItems = "center";
    titleBar.style.fontWeight = "bold";
    titleBar.style.cursor = "grab";
    gui.appendChild(titleBar);

    let titleText = document.createElement("span");
    titleText.innerText = "Background Changer";
    titleBar.appendChild(titleText);

    // Create minimize button
    let minimizeButton = document.createElement("button");
    minimizeButton.innerText = "-";
    minimizeButton.style.marginLeft = "5px";
    minimizeButton.style.padding = "3px 6px";
    minimizeButton.style.background = "#777";
    minimizeButton.style.color = "white";
    minimizeButton.style.border = "none";
    minimizeButton.style.cursor = "pointer";
    minimizeButton.style.borderRadius = "4px";
    titleBar.appendChild(minimizeButton);

    // Create close button
    let closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.style.marginLeft = "5px";
    closeButton.style.padding = "3px 6px";
    closeButton.style.background = "red";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "4px";
    titleBar.appendChild(closeButton);

    // Create content container
    let content = document.createElement("div");
    gui.appendChild(content);

    // Create upload button
    let uploadLabel = document.createElement("label");
    uploadLabel.innerText = "Upload Image";
    uploadLabel.style.display = "block";
    uploadLabel.style.textAlign = "center";
    uploadLabel.style.background = "#008CBA";
    uploadLabel.style.padding = "6px";
    uploadLabel.style.marginTop = "10px";
    uploadLabel.style.cursor = "pointer";
    uploadLabel.style.borderRadius = "4px";
    content.appendChild(uploadLabel);

    // Create file input (hidden)
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    uploadLabel.appendChild(fileInput);

    // Create remove button
    let removeButton = document.createElement("button");
    removeButton.innerText = "Remove Background";
    removeButton.style.display = "block";
    removeButton.style.width = "100%";
    removeButton.style.marginTop = "10px";
    removeButton.style.padding = "6px";
    removeButton.style.background = "#ff4444";
    removeButton.style.color = "#fff";
    removeButton.style.border = "none";
    removeButton.style.cursor = "pointer";
    removeButton.style.borderRadius = "4px";
    content.appendChild(removeButton);

    // Handle file upload
    fileInput.addEventListener("change", (event) => {
        let file = event.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                let imageUrl = e.target.result;
                GM_setValue("customBackground", imageUrl);
                applyBackground(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    // Remove background
    removeButton.addEventListener("click", () => {
        GM_setValue("customBackground", "");
        document.body.style.backgroundImage = "none";
    });

    // Function to apply background
    function applyBackground(imageUrl) {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";
    }

    // Load saved background
    let savedImage = GM_getValue("customBackground", null);
    if (savedImage) {
        applyBackground(savedImage);
    }

    // Drag functionality
    let isDragging = false, offsetX, offsetY;
    titleBar.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - gui.getBoundingClientRect().left;
        offsetY = e.clientY - gui.getBoundingClientRect().top;
        gui.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            gui.style.left = (e.clientX - offsetX) + "px";
            gui.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        gui.style.cursor = "grab";
    });

    // Minimize functionality
    minimizeButton.addEventListener("click", () => {
        if (content.style.display === "none") {
            content.style.display = "block";
            minimizeButton.innerText = "-";
        } else {
            content.style.display = "none";
            minimizeButton.innerText = "+";
        }
    });

    // Close GUI event
    closeButton.addEventListener("click", () => gui.style.display = "none");

})();
