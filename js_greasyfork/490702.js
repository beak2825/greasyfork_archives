// ==UserScript==
// @name      JetBrains Purchased-Plugin Info
// @name:ja   JetBrainsの有料プラグインに関する情報
// @name:zh-CN JetBrains 付费插件信息
// @name:ru   Информация о платных плагинах JetBrains
// @name:fr   Informations sur les plugins payants de JetBrains
// @namespace http://tampermonkey.net/
// @version   1.1
// @description Get product code from JetBrains plugins
// @description:zh-cn 获取 JetBrains 插件的产品代码
// @description:ru Получение кода продукта из плагинов JetBrains
// @description:fr Obtenez le code du produit à partir des plugins JetBrains
// @description:ja JetBrainsプラグインのプロダクトコードを取得する
// @author    Earmer Carey
// @match     *://plugins.jetbrains.com/plugin/*
// @grant     GM_xmlhttpRequest
// @grant     unsafeWindow
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/490702/JetBrains%20Purchased-Plugin%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/490702/JetBrains%20Purchased-Plugin%20Info.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Settings object to store user preferences
    let settings = {
        disableCopyButton: true, // Default setting
        copyLicense: false,
        licenseeName: "Name",
        assigneeName: "AssiName",
        expirDate: "1970-1-1",
        warningSafari: false,
    };
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('jetbrainsPluginSettings', JSON.stringify(settings));
    }
    // Load settings from localStorage
    function loadSettings() {
        let loadedSettings = localStorage.getItem('jetbrainsPluginSettings');
        if (loadedSettings) {
            settings = JSON.parse(loadedSettings);
        }
    }
    // Initialize settings
    loadSettings();
    if (!settings.warningSafari) {
        console.log(settings.warningSafari);
        let warDiv = document.createElement("div");
        warDiv.style.position = "fixed";
        warDiv.style.top = "50%";
        warDiv.style.left = "50%";
        warDiv.style.transform = "translate(-50%, -50%)";
        warDiv.style.padding = "20px";
        warDiv.style.backgroundColor = "#FFF";
        warDiv.style.border = "1px solid #CCC";
        warDiv.style.borderRadius = "10px";
        let warnP = document.createElement("p");
        warnP.style.fontFamily = "sans-serif";
        warnP.style.color = "#F88";
        warnP.innerText = "If you are using safari \n Please copy the code/license in developer console \n Refresh the page to close";
        warDiv.appendChild(warnP);
        document.body.appendChild(warDiv);
        settings.warningSafari = true;
        saveSettings()
    }
    // Create a container div element to display product code, attribution, and copy button
    let codeDiv = document.createElement("div");
    codeDiv.style.position = "fixed";
    codeDiv.style.top = "80px";
    codeDiv.style.right = "20px";
    codeDiv.style.padding = "10px";
    codeDiv.style.backgroundColor = "#eef";
    codeDiv.style.border = "1px solid #ccc";
    codeDiv.style.borderRadius = "5px";
    codeDiv.style.zIndex = "10000"; // Ensure it's above most other elements

    // Function to create and show the settings panel
    function showSettingsPanel() {
        let panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.top = "50%";
        panel.style.left = "50%";
        panel.style.transform = "translate(-50%, -50%)";
        panel.style.padding = "20px";
        panel.style.backgroundColor = "#FFF";
        panel.style.border = "1px solid #CCC";
        panel.style.borderRadius = "10px";
        panel.style.zIndex = "10001"; // Ensure it's above the codeDiv
        panel.style.padding = "10px";
        // Close button for settings panel
        let closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.fontFamily = "monospace";
        closeButton.style.marginLeft = "500px"
        closeButton.style.marginTop = "20px"
        closeButton.style.borderRadius = "6px";
        closeButton.style.background = "#ddf";
        closeButton.style.border = "1px solid #ccc";
        closeButton.onclick = function() {
            document.body.removeChild(panel);
        };
        // Toggle button for disabling copy button
        let toggleLabel = document.createElement("label");
        toggleLabel.innerText = "Disable copy button when product code is unavailable: ";
        let toggleInput = document.createElement("input");
        toggleInput.type = "checkbox";
        toggleInput.checked = settings.disableCopyButton;
        toggleInput.onchange = function() {
            settings.disableCopyButton = this.checked;
            saveSettings(); // Save whenever the user changes the setting
        };
        let copyLicenseLabel = document.createElement("label");
        copyLicenseLabel.innerText = "Copy License Instead of Copy Product Code (Experiment)";
        let questionlicLabel = document.createElement("a");
        questionlicLabel.innerText = "  ?  ";
        questionlicLabel.target = "_blank";
        questionlicLabel.href = "https://www.earmer.top/2024/03/27/jetbra-server-for-rust/";
        let copyLicenseInput = document.createElement("input");
        copyLicenseInput.type = "checkbox";
        copyLicenseInput.checked = settings.copyLicense;
        copyLicenseInput.onchange = function() {
            settings.copyLicense = copyLicenseInput.checked;
            saveSettings();
        }
        let licNameLabel = document.createElement("label");
        licNameLabel.innerText = "Your Licenses' licensee name: ";
        let licNameInput = document.createElement("input");
        licNameInput.type = "text";
        licNameInput.value = settings.licenseeName;
        licNameInput.onchange = function() {
            settings.licenseeName = this.value;
            console.log(this.value);
            saveSettings(); // Save whenever the user changes the setting
        };
        let assNameLabel = document.createElement("label");
        assNameLabel.innerText = "Your Licenses' assignee name: ";
        let assNameInput = document.createElement("input");
        assNameInput.type = "text";
        assNameInput.value = settings.assigneeName;
        assNameInput.onchange = function() {
            settings.assigneeName = this.value;
            console.log(this.value);
            saveSettings(); // Save whenever the user changes the setting
            // assigneeName
        };
        let expirDateLabel = document.createElement("label");
        expirDateLabel.innerText = "Your Licenses' Expiration Date: ";
        let expirDateInput = document.createElement("input");
        expirDateInput.type = "text";
        expirDateInput.value = settings.expirDate;
        expirDateInput.onchange = function() {
            settings.expirDate = this.value;
            console.log(this.value);
            saveSettings(); // Save whenever the user changes the setting
        };
        // Append elements to the panel
        toggleLabel.appendChild(toggleInput);
        copyLicenseLabel.appendChild(questionlicLabel);
        copyLicenseLabel.appendChild(copyLicenseInput);
        licNameLabel.appendChild(licNameInput);
        assNameLabel.appendChild(assNameInput);
        expirDateLabel.appendChild(expirDateInput);
        panel.appendChild(toggleLabel);
        panel.appendChild(document.createElement("br")); // Line break for better layout
        panel.appendChild(copyLicenseLabel);
        panel.appendChild(document.createElement("br")); // Line break for better layout
        panel.appendChild(licNameLabel);
        panel.appendChild(document.createElement("br")); // Line break for better layout
        panel.appendChild(assNameLabel);
        panel.appendChild(document.createElement("br")); // Line break for better layout
        panel.appendChild(expirDateLabel);
        panel.appendChild(document.createElement("br")); // Line break for better layout
        panel.appendChild(closeButton);
        // Finally, append the panel to the document body
        document.body.appendChild(panel);
    }

    // Create a span element for the product code
    let codeSpan = document.createElement("span");
    codeSpan.style.color = "#333";
    codeSpan.style.fontSize = "16px";
    codeSpan.style.fontFamily = "monospace";
    let copyButton = document.createElement("button");
    copyButton.style.marginLeft = "10px";
    copyButton.textContent = "Copy";
    copyButton.style.background = "#ddf";
    copyButton.style.border = "1px solid #ccc";
    copyButton.style.borderRadius = "6px";
    // Hide the copy button by default
    copyButton.style.display = "none";
    copyButton.addEventListener("click", async function() {
        if (settings.copyLicense === false) {
            console.log(codeSpan.innerText.split(" ")[2]);
            navigator.clipboard.writeText(codeSpan.innerText.split(" ")[2])
                .then(function () {
                    alert("Product code copied to clipboard!");
                    console.log("Product code copied to clipboard");
                })
                .catch(function (error) {
                    alert("Failed to copy product code, open console to know more.");
                    console.error("Failed to copy product code: ", error);
                });
        }
        else {
            const codes = [codeSpan.innerText.split(" ")[2]];
            console.log(codes);
            const lic = settings.licenseeName;
            const ass = settings.assigneeName;
            const expirDate = settings.expirDate;
            let products = Array.from(codes).map((code) => {
                return {
                    code: code,
                    fallbackDate: expirDate,
                    paidUpTo: expirDate
                }
            })

            let data = {
                "licenseeName": lic,
                "assigneeName": ass,
                "assigneeEmail": "",
                "licenseRestriction": "",
                "checkConcurrentUse": false,
                "products": products,
                "metadata": "0120230102PPAA013009",
                "hash": "41472961/0:1563609451",
                "gracePeriodDays": 7,
                "autoProlongated": true,
                "isAutoProlongated": true
            } // For debugging

            console.log(data);

            let resp = await fetch('http://localhost:12306/generateLicense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json())
            console.log(resp.license);
            navigator.clipboard.writeText(resp.license)
                .then(() => {
                    alert("The activation code has been copied to your clipboard");
                })
        }
    });
    // Create a span element for attribution
    let attributionSpan = document.createElement("span");
    attributionSpan.style.color = "#666";
    attributionSpan.style.fontSize = "12px";
    attributionSpan.style.fontFamily = "monospace";
    attributionSpan.textContent = "Plugin By Earmer";
    // Add settings button to the codeDiv
    let settingsButton = document.createElement("button");
    settingsButton.innerText = "Settings";
    settingsButton.onclick = showSettingsPanel;
    settingsButton.style.marginLeft = "10px"
    settingsButton.style.borderRadius = "6px";
    settingsButton.style.background = "#ddf";
    settingsButton.style.border = "1px solid #ccc";
    codeDiv.appendChild(codeSpan);
    codeDiv.appendChild(copyButton);
    codeDiv.appendChild(document.createElement("br"));
    codeDiv.appendChild(attributionSpan);
    codeDiv.appendChild(settingsButton);
    document.body.appendChild(codeDiv);
    // Here you would have the rest of your userscript logic
    // For example, fetching the plugin info, displaying the product code, handling the copy functionality, etc.
    let pluginId = window.location.href.split("/")[4].split("-")[0];
    // request plugin info from api
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://plugins.jetbrains.com/api/plugins/" + pluginId,
        onload: function(response) {
            let pluginInfo = JSON.parse(response.responseText);
            // check if 'purchaseInfo' and 'productCode' exist
            if (pluginInfo.hasOwnProperty("purchaseInfo") && pluginInfo.purchaseInfo.hasOwnProperty("productCode")) {
                codeSpan.innerText = "Product Code: " + pluginInfo.purchaseInfo.productCode;
                // Show the copy button when product code is available
                copyButton.style.display = "inline-block";
            } else {
                codeSpan.innerText = "Product code not available";
                // Hide the copy button when product code is not available
                if (settings.disableCopyButton === true) {
                    console.log(settings.disableCopyButton);
                    copyButton.style.display = "none";
                } else {
                    copyButton.style.display = "inline-block";
                }
            }
        }
    });
})();