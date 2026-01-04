// ==UserScript==
// @name         IMVU CID Fetcher
// @namespace    http://brightlittlestars.moe/
// @version      1.5.01
// @description  Fetch your IMVU CID with a minimal, sleek UI and avatar preview.
// @author
// @match        *://www.imvu.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523122/IMVU%20CID%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/523122/IMVU%20CID%20Fetcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const primaryColor = "#0084AC";

    // Prevent duplicate script instances
    if (document.getElementById("toggleCidFetcher") || document.getElementById("cidFetcher")) return;

    // Create toggle button
    const toggleButton = document.createElement("div");
    toggleButton.id = "toggleCidFetcher";
    toggleButton.style = `
        position: fixed; top: 10px; right: 10px; width: 25px; height: 25px;
        background-color: ${primaryColor}; color: white; font-size: 16px;
        font-weight: bold; cursor: pointer; display: flex; align-items: center;
        justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); z-index: 9999;
    `;
    toggleButton.textContent = "→";
    document.body.appendChild(toggleButton);

    // Create input box
    const inputDiv = document.createElement("div");
    inputDiv.id = "cidFetcher";
    inputDiv.style = `
        position: fixed; top: 10px; right: -270px; width: 250px; background-color: white;
        border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 10px; transition: right 0.3s ease-in-out; z-index: 9998;
    `;
    inputDiv.innerHTML = `
        <label for="inputMode" style="font-size: 14px; font-weight: bold;">Select Input Mode:</label>
        <div style="margin: 5px 0;">
            <input type="radio" id="manualMode" name="inputMode" value="manual" style="margin-right: 5px;">
            <label for="manualMode">CID</label>
            <input type="radio" id="fetchMode" name="inputMode" value="fetch" checked style="margin-left: 15px; margin-right: 5px;">
            <label for="fetchMode">Username</label>
        </div>
        <label for="imvuInput" style="font-size: 14px; font-weight: bold;">Enter Username or CID:</label>
        <input type="text" id="imvuInput" placeholder="Username or CID" style="width: 95%; margin-top: 5px; padding: 5px; font-size: 14px; border: 1px solid #ccc; border-radius: 3px;">
        <button id="processInput" style="width: 100%; margin-top: 10px; padding: 8px; font-size: 14px; background-color: ${primaryColor}; color: white; border: none; border-radius: 3px; cursor: pointer;">Submit</button>
        <div id="output" style="margin-top: 10px; font-size: 13px;"></div>
    `;
    document.body.appendChild(inputDiv);

    // Toggle functionality
    toggleButton.addEventListener("click", () => {
        inputDiv.style.right = inputDiv.style.right === "10px" ? "-270px" : "10px";
        toggleButton.textContent = inputDiv.style.right === "10px" ? "→" : "←";
    });

    async function processInput() {
        const inputMode = document.querySelector('input[name="inputMode"]:checked').value;
        const inputValue = document.getElementById("imvuInput").value.trim();
        const outputDiv = document.getElementById("output");

        if (!inputValue) {
            outputDiv.textContent = "Please enter a value!";
            outputDiv.style.color = "red";
            return;
        }

        if (inputMode === "manual") {
            // Manual mode: Use input as CID directly
            displayCidData(inputValue);
        } else {
            // Fetch mode: Fetch CID using username
            outputDiv.innerHTML = `<div style="width: 24px; height: 24px; border: 2px solid #ccc; border-top: 2px solid ${primaryColor}; border-radius: 50%; animation: spin 1s linear infinite; margin: auto;"></div>`;
            outputDiv.style.color = "black";

            const url = `https://www.imvu.com/shop/web_search.php?keywords=${encodeURIComponent(inputValue)}&within=creator_name`;

            try {
                const response = await fetch(url);
                const text = await response.text();
                const match = text.match(/image_avatar\.php\?cid=(\d+)/);

                if (match && match[1]) {
                    displayCidData(match[1]);
                } else {
                    outputDiv.textContent = "User not found! Ensure the username/CID is correct.";
                    outputDiv.style.color = "red";
                }
            } catch (error) {
                console.error("Error fetching CID:", error);
                outputDiv.textContent = "Error fetching data!";
                outputDiv.style.color = "red";
            }
        }
    }

    async function displayCidData(cid) {
        const outputDiv = document.getElementById("output");

        try {
            const apiUrl = `https://api.imvu.com/user/user-${cid}`;
            const apiResponse = await fetch(apiUrl);
            const apiData = await apiResponse.json();


            const userData = apiData.denormalized[`https://api.imvu.com/user/user-${cid}`];

if (userData) {
                    const avatarThumbnailUrl = userData.data?.thumbnail_url;
                    const tagline = userData.data?.tagline || "No tagline provided.";
                    const interests = userData.data?.interests || "No interests provided.";

                    const avatarCardUrl = `https://client-dynamic.imvu.com/api/avatarcard.php?cid=${cid}&viewer_cid=`;
                    const NEXTavatarCardUrl = `https://api.imvu.com/user/user-${cid}`;
                    const HomepageUrl = `https://www.imvu.com/catalog/web_mypage.php?user=${cid}`;
                    const ShopUrl = `https://www.imvu.com/shop/web_search.php?manufacturers_id=${cid}`;
                    const onlineStatusIcon = userData.data.online
                   ? `<span style="color: green; font-size: 12px;">🟢</span>` // Green for online
                   : `<span style="color: red; font-size: 12px;">🔴</span>`; // Red for offline

outputDiv.innerHTML = `
    <div style="border: 1px solid #ccc; border-radius: 10px; padding: 15px; max-width: 300px; background-color: #f9f9f9; text-align: center; font-family: Arial, sans-serif; max-height: 650px; overflow-y: auto;">
        <h3 style="margin: 0; color: ${primaryColor}; font-size: 16px; margin-bottom: 5px;">
            ${userData.data.username}
        </h3>

        <img src="${avatarThumbnailUrl}" alt="Avatar Image" style="width: 140px; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; border: 1px solid #ddd;">
        <h3 style="margin: 0; color: ${primaryColor}; font-size: 16px; margin-bottom: 5px;">Avatar Information</h3>

        <p style="margin: 5px 0; font-size: 12px; font-weight: bold; color: #333;">${onlineStatusIcon} CID: <span style="font-weight: normal;">${cid}</span></p>

        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 5px; font-size: 12px; color: #555;">
            <div style="display: flex; align-items: center;">
                <span style="font-weight: bold; margin-right: 2px;">Age:</span>
                <span>${userData.data.age || "N/A"}</span>
            </div>
            <div style="display: flex; align-items: center;">
                <span style="font-weight: bold; margin-right: 2px;">Gender:</span>
                <span>${userData.data.gender || "N/A"}</span>
            </div>
            <div style="display: flex; align-items: center;">
                <span style="font-weight: bold; margin-right: 2px;">Country:</span>
                <span>${userData.data.country || "N/A"}</span>
            </div>
        </div>

        <p style="margin: 10px 0; font-size: 12px; font-weight: bold; color: ${primaryColor};">Tagline:</p>
        <div style="border: 1px solid #ccc; border-radius: 5px; max-height: 50px; overflow-y: auto; padding: 5px; font-size: 12px; background-color: #f9f9f9; text-align: left;">
            ${tagline || "No tagline available."}
        </div>

        <p style="margin: 10px 0; font-size: 12px; font-weight: bold; color: ${primaryColor};">Interests:</p>
        <div style="border: 1px solid #ccc; border-radius: 5px; max-height: 50px; overflow-y: auto; padding: 5px; font-size: 12px; background-color: #f9f9f9; text-align: left;">
            ${interests || "No interests available."}
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;">

        <div style="text-align: left;">
            <h4 style="margin: 5px 0; font-size: 12px; color: ${primaryColor};">Quick Links:</h4>
            <a href="${HomepageUrl}" target="_blank" style="display: block; color: ${primaryColor}; text-decoration: none; font-size: 12px; margin-bottom: 5px;">
                🏠 Homepage
            </a>
            <a href="${ShopUrl}" target="_blank" style="display: block; color: ${primaryColor}; text-decoration: none; font-size: 12px; margin-bottom: 5px;">
                🛍️ Shop
            </a>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;">

        <div style="text-align: left;">
            <h4 style="margin: 5px 0; font-size: 12px; color: ${primaryColor}; cursor: pointer;" id="toggleAdvancedLinks">
                Advanced Links <span style="font-size: 10px;">▼</span>
            </h4>
            <div id="advancedLinks" style="display: none; margin-left: 10px;">
                <a href="${avatarCardUrl}" target="_blank" style="display: block; color: ${primaryColor}; text-decoration: none; font-size: 12px; margin-bottom: 5px;">
                    📇 Avatar Card URL
                </a>
                <a href="${NEXTavatarCardUrl}" target="_blank" style="display: block; color: ${primaryColor}; text-decoration: none; font-size: 12px;">
                    🔗 Next Avatar Card URL
                </a>
            </div>
        </div>
    </div>
`;

  // Add event listener for toggling advanced links
document.getElementById("toggleAdvancedLinks").addEventListener("click", () => {
    const advancedLinks = document.getElementById("advancedLinks");
    const toggleText = document.querySelector("#toggleAdvancedLinks span");
    if (advancedLinks.style.display === "none") {
        advancedLinks.style.display = "block";
        toggleText.textContent = "▲"; // Change arrow to up
    } else {
        advancedLinks.style.display = "none";
        toggleText.textContent = "▼"; // Change arrow to down
    }
});
            } else {
                outputDiv.textContent = "User data not found!";
                outputDiv.style.color = "red";
            }
        } catch (error) {
            console.error("Error displaying CID data:", error);
            outputDiv.textContent = "Error displaying data!";
            outputDiv.style.color = "red";
        }
    }

    document.getElementById("processInput").addEventListener("click", processInput);
})();
