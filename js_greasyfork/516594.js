// ==UserScript==
// @name         Boltxyz Client
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The most useful and efficient client ever for Bloxd.io. (new features soon!)
// @match        https://bloxd.io/
// @license      GNU GPL v3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516594/Boltxyz%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/516594/Boltxyz%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Title = document.querySelector('.Title.FullyFancyText');
    const LogoContainer = document.querySelector('.LogoContainer');
    const Background = document.querySelector('.HomeBackground');

    if (Title) {
        Title.style.whiteSpace = "nowrap";
        Title.innerText = "Boltxyz Client";
        Title.style.color = "#FFD700";
    }

    if (LogoContainer) {
        LogoContainer.style.display = "none";
    }

    if (Background) {
        Background.style = "background-image: url('https://cdn.pixabay.com/photo/2020/04/30/20/14/sky-5114501_1280.jpg'); filter: blur(4px) brightness(0.5);";
    }

    const customMessage = document.createElement("div");
    customMessage.innerText = "Welcome to Boltxyz Client!";
    customMessage.style.position = "absolute";
    customMessage.style.top = "10px";
    customMessage.style.right = "10px";
    customMessage.style.padding = "10px 20px";
    customMessage.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    customMessage.style.color = "#FFD700";
    customMessage.style.fontSize = "20px";
    customMessage.style.borderRadius = "8px";
    document.body.appendChild(customMessage);

    const customButton = document.createElement("button");
    customButton.innerText = "Activate Boost";
    customButton.style.position = "fixed";
    customButton.style.bottom = "20px";
    customButton.style.right = "20px";
    customButton.style.padding = "10px 20px";
    customButton.style.backgroundColor = "#FFD700";
    customButton.style.color = "#282c34";
    customButton.style.border = "none";
    customButton.style.borderRadius = "8px";
    customButton.style.cursor = "pointer";
    document.body.appendChild(customButton);

    customButton.addEventListener("click", () => {
        alert("Boost activated!");
        console.log("Boost button clicked!");
    });

    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    popup.style.color = "#fff";
    popup.style.padding = "20px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0px 0px 20px rgba(0, 0, 0, 0.5)";
    popup.style.zIndex = "1000";

    const popupContent = document.createElement("div");
    popupContent.innerHTML = `
        <h2 style="margin: 0; color: #FFD700;">Boltxyz World</h2>
        <p>Join the Boltxyz's custom world now! (Lifesteal enabled)</p>
        <p><strong>Name:</strong> boltxyz</p>
    `;
    popup.appendChild(popupContent);

    const playNowButton = document.createElement("button");
    playNowButton.innerText = "Play Now";
    playNowButton.onclick = function() {
        window.location.href = 'https://bloxd.io/?lobby=boltxyz&g=worlds';
    };
    playNowButton.style.backgroundColor = "#0047AB";
    playNowButton.style.color = "#fff";
    playNowButton.style.border = "none";
    playNowButton.style.padding = "10px 20px";
    playNowButton.style.borderRadius = "8px";
    playNowButton.style.cursor = "pointer";
    popup.appendChild(playNowButton);


    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.backgroundColor = "#FF6347";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.padding = "10px 20px";
    closeButton.style.borderRadius = "8px";
    closeButton.style.cursor = "pointer";
    popup.appendChild(closeButton);

    document.body.appendChild(popup);

    closeButton.addEventListener("click", () => {
        popup.style.display = "none";
        console.log("Popup closed");
    });

})();
