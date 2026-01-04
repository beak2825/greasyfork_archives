// ==UserScript==
// @name         Yohoho.io Money Hack Button Menu
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Cool money hack menu for yohoho.io with animations and style, coded by Spec
// @author       SpEc
// @match        *://yohoho.io/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/505942/Yohohoio%20Money%20Hack%20Button%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/505942/Yohohoio%20Money%20Hack%20Button%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create menu overlay with gradient and animation
    let menuOverlay = document.createElement("div");
    menuOverlay.style.position = "fixed";
    menuOverlay.style.top = "50%";
    menuOverlay.style.left = "50%";
    menuOverlay.style.transform = "translate(-50%, -50%)";
    menuOverlay.style.padding = "30px";
    menuOverlay.style.background = "linear-gradient(135deg, #1e3c72, #2a5298)";
    menuOverlay.style.borderRadius = "15px";
    menuOverlay.style.color = "#fff";
    menuOverlay.style.zIndex = "10000";
    menuOverlay.style.textAlign = "center";
    menuOverlay.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
    menuOverlay.style.opacity = "0";
    menuOverlay.style.transition = "opacity 0.5s ease-in-out";
    menuOverlay.style.display = "none";
    document.body.appendChild(menuOverlay);

    // Menu animations
    const showMenu = () => {
        menuOverlay.style.display = "block";
        setTimeout(() => {
            menuOverlay.style.opacity = "1";
        }, 10);
    };

    const hideMenu = () => {
        menuOverlay.style.opacity = "0";
        setTimeout(() => {
            menuOverlay.style.display = "none";
        }, 500);
    };

    // Create menu title with gradient text effect
    let menuTitle = document.createElement("h2");
    menuTitle.innerHTML = "Yohoho.io Money Glitch";
    menuTitle.style.marginBottom = "20px";
    menuTitle.style.background = "linear-gradient(90deg, #ff7e5f, #feb47b)";
    menuTitle.style.webkitBackgroundClip = "text";
    menuTitle.style.webkitTextFillColor = "transparent";
    menuOverlay.appendChild(menuTitle);

    // Button creator function with animations
    function createButton(label, amount) {
        let button = document.createElement("button");
        button.innerHTML = label;
        button.style.padding = "15px 30px";
        button.style.margin = "10px";
        button.style.background = "linear-gradient(90deg, #00b09b, #96c93d)";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "30px";
        button.style.cursor = "pointer";
        button.style.fontSize = "16px";
        button.style.transition = "transform 0.2s ease, background 0.3s";
        button.addEventListener("mouseenter", () => button.style.transform = "scale(1.1)");
        button.addEventListener("mouseleave", () => button.style.transform = "scale(1)");
        button.addEventListener("click", () => setCoins(amount));
        menuOverlay.appendChild(button);
    }

    // Add buttons for different amounts
    createButton("Add 10K Coins", 10000);
    createButton("Add 50K Coins", 50000);
    createButton("Add 100K Coins", 100000);
    createButton("Set Coins to 1M", 1000000);

    // Create Close button with color animation
    let closeButton = document.createElement("button");
    closeButton.innerHTML = "Close Menu";
    closeButton.style.padding = "15px 30px";
    closeButton.style.marginTop = "20px";
    closeButton.style.background = "#ff5f6d";
    closeButton.style.background = "linear-gradient(90deg, #ff5f6d, #ffc371)";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "30px";
    closeButton.style.cursor = "pointer";
    closeButton.style.transition = "transform 0.2s ease, background 0.3s";
    closeButton.addEventListener("mouseenter", () => closeButton.style.transform = "scale(1.1)");
    closeButton.addEventListener("mouseleave", () => closeButton.style.transform = "scale(1)");
    closeButton.addEventListener("click", hideMenu);
    menuOverlay.appendChild(closeButton);

    // Create footer with your alias and credits
    let footer = document.createElement("p");
    footer.innerHTML = "Coded by Spec";
    footer.style.marginTop = "20px";
    footer.style.fontSize = "14px";
    footer.style.color = "#ccc";
    footer.style.fontStyle = "italic";
    menuOverlay.appendChild(footer);

    // Function to set coins
    async function setCoins(amount) {
        let sessionId = localStorage.sessionId;
        if (!sessionId) {
            alert("Session ID not found. Make sure you are logged in.");
            return;
        }

        // Fetch session details and modify coins
        let endpoint = (path) => `https://s.${location.hostname}/${path}?s=${sessionId}`;
        var data = {
            gamesStarted: 0,
            coinsOwned: 0,
            playerSkin: 0,
            playerPet: 0,
            playerXP: 0,
            unlockedSkins: [1],
            unlockedPets: [1],
            playerPetLevel: 1,
            lastGameTime: 0,
            lastKills: 0,
            lastScore: 0,
            totalGameTime: 0,
            totalKills: 0,
            totalScore: 0,
            totalWins: 0,
            bestGameTime: 0,
            bestKills: 0,
            bestScore: 0,
            abBotSkillLevel: 1
        };

        // Fetch and update coins
        let loginResponse = await fetch(endpoint("login"));
        let status = loginResponse.status;

        if (status === 200) {
            let responseText = await loginResponse.text();
            data = JSON.parse("{" + responseText.split("{")[1]);
            data.coinsOwned += amount;  // Add coins

            await fetch(endpoint("save"), {
                method: "POST",
                body: JSON.stringify(data)
            });

            alert(`${amount} coins added! Reloading the game...`);
            location.reload();  // Reload the game to reflect changes
        } else {
            alert("Failed to fetch session details. Status: " + status);
        }
    }

    // Create button to open the menu
    let menuButton = document.createElement("button");
    menuButton.innerHTML = "💰 Open Money Glitch Menu 💰";
    menuButton.style.position = "fixed";
    menuButton.style.top = "10px";
    menuButton.style.left = "10px";
    menuButton.style.zIndex = "1000";
    menuButton.style.padding = "12px 20px";
    menuButton.style.background = "linear-gradient(90deg, #7f00ff, #e100ff)";
    menuButton.style.color = "#fff";
    menuButton.style.border = "none";
    menuButton.style.borderRadius = "30px";
    menuButton.style.cursor = "pointer";
    menuButton.style.fontSize = "16px";
    menuButton.style.transition = "transform 0.2s ease, background 0.3s";
    menuButton.addEventListener("mouseenter", () => menuButton.style.transform = "scale(1.1)");
    menuButton.addEventListener("mouseleave", () => menuButton.style.transform = "scale(1)");
    document.body.appendChild(menuButton);

    menuButton.addEventListener("click", showMenu);
})();
