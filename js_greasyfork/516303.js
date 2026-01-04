// ==UserScript==
// @name         Webtoon.xyz+
// @namespace    github.com/longkidkoolstar
// @version      0.1
// @description  Auto login for Webtoon.xyz with userscript settings
// @author       longkidkoolstar
// @homepage     github.com/longkidkoolstar
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtoon.xyz
// @license      MIT
// @match        https://www.webtoon.xyz/*
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/516303/Webtoonxyz%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/516303/Webtoonxyz%2B.meta.js
// ==/UserScript==

(async function() {
    console.log("User-Script Started");

    // Check if on the user settings page
    if (window.location.href.startsWith("https://www.webtoon.xyz/user-settings/")) {
        const navTabsWrap = document.querySelector(".nav-tabs-wrap ul.nav-tabs");
        const contentArea = document.querySelector("#post-7 > div.entry-content > div > div > div.col-md-9.col-sm-9");

        if (navTabsWrap && contentArea) {
            // Create Userscript Settings tab
            const settingsTab = document.createElement("li");
            settingsTab.innerHTML = `
                <a href="#" id="userscript-settings-tab"><i class="icon ion-md-settings"></i>Userscript Settings</a>
            `;
            navTabsWrap.appendChild(settingsTab);

    // Create Userscript Settings content section
    const settingsContent = document.createElement("div");
    settingsContent.id = "userscript-settings-content";
    settingsContent.innerHTML = `
        <h2 style="font-size: 24px; color: #333;">Webtoon.xyz+ Settings</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); max-width: 400px; margin: 20px auto;">
            <label style="font-size: 16px; color: #333; margin-bottom: 8px; display: block;">
                <input type="checkbox" id="enable-auto-login" style="margin-right: 10px;">
                Enable Auto Login
            </label><br><br>

            <label for="username-input" style="font-size: 14px; color: #555;">Username or Email:</label>
            <input type="text" id="username-input" placeholder="Enter Username or Email" style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 6px; border: 1px solid #ccc; font-size: 14px;"><br><br>
            
            <label for="password-input" style="font-size: 14px; color: #555;">Password:</label>
            <input type="password" id="password-input" placeholder="Enter Password" style="width: 100%; padding: 10px; margin: 5px 0; border-radius: 6px; border: 1px solid #ccc; font-size: 14px;"><br><br>
            
            <button id="save-credentials" style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; width: 100%; transition: all 0.3s ease;">
                Save Credentials
            </button>
        </div>
    `;
    settingsContent.style.display = "none";

    // Add the settings content to the main content area
    contentArea.appendChild(settingsContent);

    // Add hover and click effects using CSS
    const saveButton = document.getElementById("save-credentials");

    // Hover effect: change background color and scale the button slightly
    saveButton.addEventListener("mouseover", () => {
        saveButton.style.backgroundColor = "#45a049";
        saveButton.style.transform = "scale(1.05)";
    });

    // Revert the hover effect when mouse leaves
    saveButton.addEventListener("mouseout", () => {
        saveButton.style.backgroundColor = "#4CAF50";
        saveButton.style.transform = "scale(1)";
    });

    // Click effect: add a slight "pressed" effect and change to red temporarily
    saveButton.addEventListener("mousedown", () => {
        saveButton.style.backgroundColor = "red"; // Change to red during click
        saveButton.style.transform = "scale(0.98)";
    });

    // Revert the click effect after a short delay
    saveButton.addEventListener("mouseup", () => {
        setTimeout(() => {
            saveButton.style.backgroundColor = "#4CAF50"; // Change back to green after the click
        }, 150); // Wait for 150ms before returning to green
        saveButton.style.transform = "scale(1)";
    });



            // Event listener for Userscript Settings tab click
            document.getElementById("userscript-settings-tab").addEventListener("click", (e) => {
                e.preventDefault();

                // Clear any existing active classes from tabs
                navTabsWrap.querySelectorAll("li").forEach(tab => tab.classList.remove("active"));
                // Set the clicked tab to active
                settingsTab.classList.add("active");

                // Hide other content and show settings content
                contentArea.innerHTML = ''; // Clear existing content
                contentArea.appendChild(settingsContent); // Display settings
                settingsContent.style.display = "block";
            });

            // Load and apply existing settings
            const autoLoginEnabled = await GM.getValue("autoLoginEnabled", true);
            document.getElementById("enable-auto-login").checked = autoLoginEnabled;

            const savedUsername = await GM.getValue("username", "");
            const savedPassword = await GM.getValue("password", "");
            document.getElementById("username-input").value = savedUsername;
            document.getElementById("password-input").value = savedPassword;

            // Toggle auto-login setting
            document.getElementById("enable-auto-login").addEventListener("change", async (e) => {
                await GM.setValue("autoLoginEnabled", e.target.checked);
                //alert(`Auto-login ${e.target.checked ? "enabled" : "disabled"}`);
            });

            // Save credentials when the "Save Credentials" button is clicked
            document.getElementById("save-credentials").addEventListener("click", async () => {
                const username = document.getElementById("username-input").value;
                const password = document.getElementById("password-input").value;
                if (username && password) {
                    await GM.setValue("username", username);
                    await GM.setValue("password", password);
                    alert("Credentials saved successfully!");
                } else {
                    alert("Please enter both username and password.");
                }
            });
        }
    }

    // Auto-login logic
    const autoLoginEnabled = await GM.getValue("autoLoginEnabled", true);
    if (autoLoginEnabled) {
        let username = await GM.getValue("username", null);
        let password = await GM.getValue("password", null);

        if (!username || !password) {
            console.log("Username or password not provided. Exiting script.");
            return;
        }

        const signInButton = document.querySelector('a[data-toggle="modal"][data-target="#form-login"].btn-active-modal');
        if (signInButton) {
            signInButton.click();
            console.log("Clicked Sign In button");

            const formCheckInterval = setInterval(() => {
                const loginForm = document.querySelector('form#loginform');
                if (loginForm) {
                    clearInterval(formCheckInterval);
                    loginForm.querySelector('input[name="log"]').value = username;
                    loginForm.querySelector('input[name="pwd"]').value = password;
                    loginForm.querySelector('input[name="rememberme"]').checked = true;
                    loginForm.querySelector('input[type="submit"]').click();
                    console.log("Form submitted with user credentials");
                }
            }, 500);
        } else {
            console.log("Sign In button not found");
        }
    }
})();
