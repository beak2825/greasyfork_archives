// ==UserScript==
// @name         Nitro Type Modifier (Username, Title, and Cash)
// @namespace    https://www.youtube.com/@InternetTyper
// @license MIT
// @version      1.0
// @description  Change your username, title, Nitro Cash balance, and GUI style across Nitro Type. Updates garage, dropdown, leagues, and team pages. GUI toggles via Ctrl+B. Nitro Cash is capped at 4,294,967,295.
// @author       Internet Typer
// @match        https://www.nitrotype.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537779/Nitro%20Type%20Modifier%20%28Username%2C%20Title%2C%20and%20Cash%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537779/Nitro%20Type%20Modifier%20%28Username%2C%20Title%2C%20and%20Cash%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalUsername = localStorage.getItem("originalUsername");
    if (!originalUsername) {
        let dropdownElement = document.querySelector(".dropdown--account .type-ellip--account");
        if (dropdownElement && dropdownElement.textContent.trim()) {
            originalUsername = dropdownElement.textContent.trim();
        } else {
            let garageElement = document.querySelector(".df.df--align-center .player-name--container span.type-ellip");
            if (garageElement) {
                originalUsername = garageElement.textContent.trim();
            }
        }
        if (originalUsername) {
            localStorage.setItem("originalUsername", originalUsername);
        }
    }

    // ---------- GUI Setup ----------
    let savedColor = localStorage.getItem("guiColor") || "#3498db"; // Default color for drop shadow/title/hyperlink
    let guiVisible = localStorage.getItem("guiVisible");
    if (guiVisible === null) {
        guiVisible = "true";
        localStorage.setItem("guiVisible", "true");
    }

    let gui = document.createElement("div");
    gui.style.position = "fixed";
    gui.style.top = "20px";
    gui.style.left = "20px";
    gui.style.background = "black"; // Always black background
    gui.style.padding = "15px";
    gui.style.borderRadius = "8px";
    gui.style.color = "white";
    gui.style.fontFamily = "Arial, sans-serif";
    gui.style.zIndex = "1000";
    gui.style.display = (guiVisible === "true") ? "flex" : "none";
    gui.style.flexDirection = "column";
    gui.style.gap = "10px";
    gui.style.boxShadow = `5px 5px 15px ${savedColor}`;

    let header = document.createElement("h3");
    header.innerText = "Nitro Type Modifier";
    header.style.marginBottom = "10px";
    header.style.textAlign = "center";
    header.style.color = savedColor;

    let userLabel = document.createElement("label");
    userLabel.innerText = "Username:";
    userLabel.style.fontWeight = "bold";
    let userInput = document.createElement("input");
    userInput.type = "text";
    userInput.placeholder = "Enter new username (or leave blank)";
    userInput.style.background = "white";
    userInput.style.color = "black";
    userInput.style.padding = "5px";
    userInput.style.border = "none";
    userInput.style.borderRadius = "3px";

    let titleLabel = document.createElement("label");
    titleLabel.innerText = "Title:";
    titleLabel.style.fontWeight = "bold";
    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Enter new title";
    titleInput.style.background = "white";
    titleInput.style.color = "black";
    titleInput.style.padding = "5px";
    titleInput.style.border = "none";
    titleInput.style.borderRadius = "3px";

    let cashLabel = document.createElement("label");
    cashLabel.innerText = "Nitro Cash:";
    cashLabel.style.fontWeight = "bold";
    let cashInput = document.createElement("input");
    cashInput.type = "number";
    cashInput.placeholder = "Enter custom Nitro Cash balance";
    cashInput.style.background = "white";
    cashInput.style.color = "black";
    cashInput.style.padding = "5px";
    cashInput.style.border = "none";
    cashInput.style.borderRadius = "3px";

    let colorLabel = document.createElement("label");
    colorLabel.innerText = "GUI Color:";
    colorLabel.style.fontWeight = "bold";
    let colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = savedColor;
    colorInput.style.border = "none";
    colorInput.style.borderRadius = "3px";

    let applyButton = document.createElement("button");
    applyButton.innerText = "Apply Changes";
    applyButton.style.padding = "8px";
    applyButton.style.border = "none";
    applyButton.style.borderRadius = "5px";
    applyButton.style.background = "gray";
    applyButton.style.color = "white";
    applyButton.style.cursor = "pointer";
    applyButton.style.marginTop = "10px";

    let errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.textAlign = "center";
    errorDiv.style.display = "none";

    let credits = document.createElement("div");
    credits.innerHTML = 'Created by <a href="https://www.youtube.com/@InternetTyper" target="_blank" style="color: lightblue;">@InternetTyper on YouTube</a>';
    credits.style.textAlign = "center";
    credits.style.marginTop = "10px";
    let toggleMsg = document.createElement("div");
    toggleMsg.innerText = 'Press "Ctrl + B" to Close and Open GUI';
    toggleMsg.style.textAlign = "center";
    toggleMsg.style.marginTop = "10px";
    toggleMsg.style.fontSize = "12px";

    gui.appendChild(header);
    gui.appendChild(userLabel);
    gui.appendChild(userInput);
    gui.appendChild(titleLabel);
    gui.appendChild(titleInput);
    gui.appendChild(cashLabel);
    gui.appendChild(cashInput);
    gui.appendChild(colorLabel);
    gui.appendChild(colorInput);
    gui.appendChild(applyButton);
    gui.appendChild(errorDiv);
    gui.appendChild(toggleMsg);
    gui.appendChild(credits);
    document.body.appendChild(gui);

    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.key.toLowerCase() === "b") {
            if (gui.style.display === "none") {
                gui.style.display = "flex";
                localStorage.setItem("guiVisible", "true");
            } else {
                gui.style.display = "none";
                localStorage.setItem("guiVisible", "false");
            }
        }
    });
    function updateGarageUsername(newUsername) {
        let elem = document.querySelector(".df.df--align-center .player-name--container span.type-ellip");
        if (elem) { elem.textContent = newUsername; }
    }
    function updateDropdownUsername(newUsername) {
        let elem = document.querySelector(".dropdown--account .type-ellip--account");
        if (elem) { elem.textContent = newUsername; }
    }
    function updateLeaguesUsername(newUsername) {
        let row = document.querySelector("tr.table-row.is-self");
        if (row) {
            let elem = row.querySelector(".player-name--container span.type-ellip.tss");
            if (elem) { elem.textContent = newUsername; }
        }
    }
    function updateTeamPages(newUsername, newTitle) {
        let rows = document.querySelectorAll("tr.table-row");
        rows.forEach(row => {
            let container = row.querySelector(".player-name--container");
            if (container && container.getAttribute("title") === originalUsername) {
                let tagAnchor = container.querySelector("a.player-name--tag");
                if (tagAnchor) { tagAnchor.textContent = newUsername ? `[${newUsername}]` : ""; }
                let spanEl = container.querySelector("span.type-ellip");
                if (spanEl) { spanEl.textContent = newUsername; }
                let titleEl = row.querySelector("div.tsi.tc-lemon.tsxs");
                if (titleEl) { titleEl.textContent = newTitle ? `"${newTitle}"` : ""; }
            }
        });
    }
    function updateGarageTitle(newTitle) {
        let elem = document.querySelector(".profile-title");
        if (elem) { elem.textContent = newTitle ? `"${newTitle}"` : ""; }
    }
    function updateLeaguesTitle(newTitle) {
        let row = document.querySelector("tr.table-row.is-self");
        if (row) {
            let elem = row.querySelector("div.tsi.tc-lemon.tsxs");
            if (elem) { elem.textContent = newTitle ? `"${newTitle}"` : ""; }
        }
    }

    // ---------- Function: Update GUI Appearance (Color) ----------
    function updateGUIColor(color) {
        localStorage.setItem("guiColor", color);
        gui.style.boxShadow = `5px 5px 15px ${color}`;
        header.style.color = color;
        let creditLink = credits.querySelector("a");
        if (creditLink) { creditLink.style.color = color; }
    }

    function updateCash(newCash) {
        let cashElements = document.querySelectorAll(".as-nitro-cash--prefix");
        cashElements.forEach(element => {
            // Do not change Total Spent (assumed to be inside .stat-box--extras)
            if (element.closest(".stat-box--extras")) return;
            element.textContent = `$${newCash.toLocaleString()}`;
        });
    }

    // ---------- Load Saved Values ----------
    let savedUsername = localStorage.getItem("customUsername");
    let savedTitle = localStorage.getItem("customTitle");
    let savedCash = localStorage.getItem("customCash");
    if (savedUsername !== null) {
        updateGarageUsername(savedUsername);
        updateDropdownUsername(savedUsername);
        updateLeaguesUsername(savedUsername);
        updateTeamPages(savedUsername, savedTitle || "");
        userInput.value = savedUsername;
    }
    if (savedTitle !== null) {
        updateGarageTitle(savedTitle);
        updateLeaguesTitle(savedTitle);
        updateTeamPages(savedUsername || "", savedTitle);
        titleInput.value = savedTitle;
    }
    if (savedCash !== null) {
        let cashVal = parseInt(savedCash, 10);
        updateCash(cashVal);
        cashInput.value = cashVal;
    }
    updateGUIColor(savedColor);

    if (window.location.pathname.includes("/leagues")) {
        setInterval(function() {
            let currUser = localStorage.getItem("customUsername");
            let currTitle = localStorage.getItem("customTitle");
            if (currUser !== null) { updateLeaguesUsername(currUser); }
            if (currTitle !== null) { updateLeaguesTitle(currTitle); }
        }, 2);
    }
    if (window.location.pathname.includes("/team")) {
        setInterval(function() {
            let currUser = localStorage.getItem("customUsername") || "";
            let currTitle = localStorage.getItem("customTitle") || "";
            updateTeamPages(currUser, currTitle);
        }, 2);
    }

    applyButton.onclick = function() {
        let newUsername = userInput.value.trim();
        let newTitle = titleInput.value.trim();
        let cashStr = cashInput.value.trim();
        let newCash = parseInt(cashStr, 10);
        let selectedColor = colorInput.value;

        // Validate Nitro Cash: cap at 4,294,967,295 if exceeded.
        if (newCash > 4294967295) {
            errorDiv.textContent = "Error: Maximum Nitro Cash limit exceeded! Resetting to 4,294,967,295.";
            errorDiv.style.display = "block";
            newCash = 4294967295;
            localStorage.setItem("customCash", newCash);
            cashInput.value = newCash;
        } else {
            errorDiv.style.display = "none";
        }

        localStorage.setItem("customUsername", newUsername);
        localStorage.setItem("customTitle", newTitle);
        updateGarageUsername(newUsername);
        updateDropdownUsername(newUsername);
        updateLeaguesUsername(newUsername);
        updateTeamPages(newUsername, newTitle);
        updateGarageTitle(newTitle);
        updateLeaguesTitle(newTitle);

        updateCash(newCash);
        localStorage.setItem("customCash", newCash);

        updateGUIColor(selectedColor);
    };
    colorInput.oninput = function() {
        updateGUIColor(colorInput.value);
    };

})();



