// ==UserScript==
// @name         Low-Quality Lottery Machine
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A simple, low-quality lottery machine with an admin panel
// @author       Alex Howard
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530117/Low-Quality%20Lottery%20Machine.user.js
// @updateURL https://update.greasyfork.org/scripts/530117/Low-Quality%20Lottery%20Machine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let score = 100;
    let modifyer = 1;
    let adminPanelVisible = false;
    let audioMuted = false;

    // Create the lottery container
    let lotteryBox = document.createElement("div");
    lotteryBox.style.position = "fixed";
    lotteryBox.style.top = "50%";
    lotteryBox.style.right = "10px";
    lotteryBox.style.transform = "translateY(-50%)";
    lotteryBox.style.width = "150px";
    lotteryBox.style.height = "230px";
    lotteryBox.style.backgroundColor = "black";
    lotteryBox.style.color = "white";
    lotteryBox.style.padding = "10px";
    lotteryBox.style.textAlign = "center";
    lotteryBox.style.border = "2px solid white";
    lotteryBox.style.fontFamily = "Arial, sans-serif";
    lotteryBox.style.zIndex = "9999";
    document.body.appendChild(lotteryBox);

    let title = document.createElement("div");
    title.innerText = "🎰 Lottery Machine 🎰";
    title.style.fontSize = "14px";
    title.style.marginBottom = "10px";
    lotteryBox.appendChild(title);

    let resultDisplay = document.createElement("div");
    resultDisplay.innerText = "Press Draw!";
    resultDisplay.style.fontSize = "20px";
    resultDisplay.style.marginBottom = "10px";
    resultDisplay.style.fontWeight = "bold";
    lotteryBox.appendChild(resultDisplay);

    let scoreDisplay = document.createElement("div");
    scoreDisplay.innerText = "Score: " + score + " | Current Winrate:" + (modifyer * 0.05);
    scoreDisplay.style.fontSize = "16px";
    scoreDisplay.style.marginBottom = "10px";
    lotteryBox.appendChild(scoreDisplay);

    let soundButton = document.createElement("button");
    soundButton.innerText = "Mute/Unmute";
    soundButton.style.marginTop = "5px";
    soundButton.style.padding = "5px 10px";
    soundButton.style.cursor = "pointer";
    soundButton.style.border = "none";
    soundButton.style.backgroundColor = "white";
    soundButton.style.color = "black";
    soundButton.onclick = function() {
        if (audioMuted == false) {
            audioMuted = true;
        } else {
            audioMuted = false;
        };
    };

    let drawButton = document.createElement("button");
    drawButton.innerText = "Draw!";
    drawButton.style.padding = "5px 10px";
    drawButton.style.fontSize = "14px";
    drawButton.style.cursor = "pointer";
    drawButton.style.border = "none";
    drawButton.style.backgroundColor = "gold";
    drawButton.style.color = "black";
    drawButton.onclick = function() {
        if (score <= 0) return;

        score -= 10;
        let isWin = Math.random() < (0.05 * modifyer);
        resultDisplay.innerText = isWin ? "💰 JACKPOT! 💰" : "😢 Try Again";

        if (isWin) {
            score += 50;
            if (audioMuted == false) {
                let winSound = new Audio("https://www.myinstants.com/media/sounds/i-cant-stop-winning.mp3");
                winSound.play();
            };
        } else {
            if (audioMuted == false) {
                let loseSound = new Audio("https://www.myinstants.com/media/sounds/baby-laughing-meme.mp3");
                loseSound.play();
            };
        }

        scoreDisplay.innerText = "Score: " + score + " | Current Winrate:" + (modifyer * 0.05);

        if (score <= 0) {
            resultDisplay.innerText = "❌ You Lose!";
            lotteryBox.style.transition = "top 1s ease-out, opacity 10s ease-out";
            lotteryBox.style.top = "100%";
            lotteryBox.style.opacity = "0";
            setTimeout(() => lotteryBox.remove(), 1000);
        }
    };
    lotteryBox.appendChild(drawButton);
    lotteryBox.appendChild(soundButton);

    let keysPressed = new Set();

    document.addEventListener("keydown", (event) => {
        keysPressed.add(event.key.toLowerCase());
        checkCombination();
    });

    document.addEventListener("keyup", (event) => {
        keysPressed.delete(event.key.toLowerCase());
    });

    function checkCombination() {
        if (keysPressed.has("shift") && keysPressed.has("a") && keysPressed.has("k")) {
            triggerAdminPanel();
        }
    }

    function triggerAdminPanel() {
        if (adminPanelVisible) return;
        adminPanelVisible = true;

        if (audioMuted == false) {
            let SFX = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect-1.mp3");
            SFX.play();
        };

        let adminPanel = document.createElement("div");
        adminPanel.style.position = "fixed";
        adminPanel.style.top = "50%";
        adminPanel.style.left = "50%";
        adminPanel.style.transform = "translate(-50%, -50%)";
        adminPanel.style.width = "300px";
        adminPanel.style.height = "200px";
        adminPanel.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        adminPanel.style.color = "white";
        adminPanel.style.padding = "15px";
        adminPanel.style.textAlign = "center";
        adminPanel.style.border = "2px solid white";
        adminPanel.style.fontFamily = "Arial, sans-serif";
        adminPanel.style.zIndex = "10000";

        let adminTitle = document.createElement("div");
        adminTitle.innerText = "🔧 Admin Panel 🔧";
        adminTitle.style.fontSize = "18px";
        adminTitle.style.marginBottom = "10px";
        adminPanel.appendChild(adminTitle);

        let modifyButton = document.createElement("button");
        modifyButton.innerText = "Add '421482859835852' to Modifyer";
        modifyButton.style.marginTop = "5px";
        modifyButton.style.padding = "5px 10px";
        modifyButton.style.cursor = "pointer";
        modifyButton.style.border = "none";
        modifyButton.style.backgroundColor = "white";
        modifyButton.style.color = "black";
        modifyButton.onclick = function() {
            modifyer += 421482859835852;
        };

        let closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.marginTop = "15px";
        closeButton.style.padding = "5px 10px";
        closeButton.style.cursor = "pointer";
        closeButton.style.border = "none";
        closeButton.style.backgroundColor = "red";
        closeButton.style.color = "white";
        closeButton.onclick = function() {
            adminPanel.remove();
            adminPanelVisible = false;
        };
        adminPanel.appendChild(closeButton);
        adminPanel.appendChild(modifyButton);

        document.body.appendChild(adminPanel);
    }
})();
