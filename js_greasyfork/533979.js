// ==UserScript==
// @name         Flying OC Alert
// @namespace    http://tampermonkey.net/
// @version      2.0.7
// @description  Blocks you from flying if your OC is about to start.
// @author       NichtGersti [3380912]
// @license      MIT
// @match        https://www.torn.com/page.php?sid=travel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com

// @downloadURL https://update.greasyfork.org/scripts/533979/Flying%20OC%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/533979/Flying%20OC%20Alert.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.addEventListener('load', () => {
        let potentialError = document.querySelector("#skip-to-content")?.textContent?.trim()
        if (potentialError == "Error") {
            console.warn("[Flying OC Alert] You're probably racing. Aborting.");
            return;
        }

        let apiKey = localStorage.getItem("nichtgersti-flying-oc-alert-api-key") ?? '###PDA-APIKEY###'; //Minimal access or above!
        let threshold = localStorage.getItem("nichtgersti-flying-oc-alert-threshold") ?? 10;
        let confirmMethod = localStorage.getItem("nichtgersti-flying-oc-alert-method") ?? "default";
        let confirmPrompt = localStorage.getItem("nichtgersti-flying-oc-alert-prompt") ?? "continue";

        let ocUrl = "https://api.torn.com/v2/user/?selections=organizedcrime&key={apiKey}".replace("{apiKey}", apiKey);


        let solution = Math.floor(Math.random() * 100);
        let addend1 = Math.floor(Math.random() * (solution - 1));
        let addend2 = Math.floor(solution - addend1);

        let confirmTask = undefined;
        let confirmData = undefined;
        if (confirmMethod == "prompt") {
            confirmTask = confirmPrompt;
            confirmData = confirmPrompt;
        }
        else if (confirmMethod == "addition") {
            confirmTask = `${addend1}+${addend2}`;
            confirmData = solution.toString();
        }

        let alertDiv = document.createElement("div");
        alertDiv.id = "flying-oc-alert";
        alertDiv.classList.add("info-msg-cont", "border-round", "m-top10", "green");
        alertDiv.innerHTML = `
            <div class="info-msg border-round messageWrap___phpSP">
                <i class="infoIcon___GLFcq"></i>
                <div class="delimiter">
                    <div class="msg right-round messageContent___LhCmx">
                        <div style="display:flex;justify-content: space-between;align-items: center;">
                            <span style="display:inline-block;vertical-align:middle">Time until your Organized Crime is ready: <span id="flying-oc-alert-timer">Check your API key.</span></span>
                            <div id="flying-oc-settings-button" style="display:inline-block;float:right">
                                <i class="fa fa-cog" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div id="flying-oc-confirm-div" hidden>
                            ${buildConfirm(confirmMethod, confirmTask, confirmData)}
                        </div>
                        <div id="flying-oc-settings" hidden>
                            ${buildSettings()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        let wrapper = document.querySelector("#travel-root .wrapper");
        wrapper.insertBefore(alertDiv, wrapper.lastChild);
        let confirmButton = document.querySelector("#flying-oc-confirm-button");
        confirmButton.addEventListener("click", () => pressConfirm());
        let settingsButton = document.querySelector("#flying-oc-settings-button");
        settingsButton.addEventListener("click", () => openSettings());
        let settingsSaveButton = document.querySelector("#flying-oc-settings-save-button");
        settingsSaveButton.addEventListener("click", () => saveSettings());

        fetch(ocUrl).then( response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
        })
        .then( result => {
            if (result.error) {
                switch (result.error.code){
                    case 2:
                        apiKey = null;
                        localStorage.setItem("nichtgersti-flying-oc-alert-api", null);
                        console.error("[Flying OC Alert] Incorrect Api Key:", result);
                        return;
                    case 9:
                        console.warn("[Flying OC Alert] The API is temporarily disabled, please try again later");
                        return;
                    default:
                        console.error("[Flying OC Alert] Error:", result.error.error);
                        return;
                }
            }

            let infoOc = result.organizedCrime;
            let timeString;
            if (!infoOc || infoOc.status != "Planning") {
                timeString = "You're currently not planning an Organized Crime.";
                document.querySelector("#flying-oc-alert-timer").textContent = timeString;
                return;
            }


            let totalSeconds = infoOc.ready_at - Math.floor(Date.now() / 1000);
            if ((totalSeconds / 3600) < threshold) {
                document.querySelector("#flying-oc-alert").classList.add("red");
                document.querySelector("#flying-oc-alert").classList.remove("green");
                document.querySelector("#flying-oc-confirm-div").hidden = false;
                setHideFlying(true);
            }

            timeString = createTimerString(totalSeconds);
            document.querySelector("#flying-oc-alert-timer").textContent = createTimerString(totalSeconds);

            setInterval((function() {
                let seconds = infoOc.ready_at - Math.floor(Date.now() / 1000);
                document.querySelector("#flying-oc-alert-timer").textContent = createTimerString(seconds);
            }), 10000);

        })
        .catch(error => console.error("[Flying OC Alert] Error:", error));

        function setHideFlying(hide = true) {
            let travelTypeSelector = document.querySelector(".travelTypeSelector___zK5N4") || undefined;
            if (travelTypeSelector && hide) travelTypeSelector.style.display = "none";
            else if (travelTypeSelector) travelTypeSelector.style.removeProperty("display");

            let worldMap = document.querySelector(".worldMap___SvXMZ") || undefined;
            if (worldMap && hide) worldMap.style.display = "none";
            else if (worldMap) worldMap.style.removeProperty("display");

            let destinationPanel = document.querySelector(".destinationPanel___LsJ4v") || undefined;
            if (destinationPanel && hide) destinationPanel.style.display = "none";
            else if (destinationPanel) destinationPanel.style.removeProperty("display");

            let destinationList = document.querySelector(".destinationList___fx7Gb") || undefined;
            if (destinationList && hide) destinationList.style.display = "none";
            else if (destinationList) destinationList.style.removeProperty("display");
        }

        function createTimerString(totalSeconds) {
            if (totalSeconds < 0) {
                return `Your OC is being delayed by someone else!`;
            }

            if (totalSeconds < 60) {
                return `Less than 1 minute!`;
            }

            let days = Math.floor(totalSeconds / 86400);
            let hours = Math.floor(totalSeconds / 3600) % 24;
            let minutes = Math.floor(totalSeconds / 60) % 60;
            let seconds = totalSeconds % 60;

            let timerString = "";
            if (totalSeconds > 86400) timerString += `${days}d `;
            if (totalSeconds > 3600) timerString += `${hours}h `;
            if (totalSeconds > 60) timerString += `${minutes}m`;
            return timerString;
        }

        function buildConfirm(method = confirmMethod, task = undefined, data = undefined) {
            let confirmText = "Confirm to unlock traveling.";

            if (method == "prompt") confirmText = `Write "${task}" to confirm.`;
            else if (method == "addition") confirmText = `Solve "${task}" to confirm.`;

            return `
                <hr style="margin-top:10px;margin-bottom:10px">
                <div style="display:flex;justify-content: space-between;align-items: center;">
                    <span style="display:inline-block;vertical-align:middle">${confirmText}</span>
                    <div style="display:flex;justify-content: space-between;">
                        <input type="text" id="flying-oc-confirm-input" name="flying-oc-confirm-input"${method == "default" ? " hidden" : ""} data="${data}">
                        <div id="flying-oc-confirm-button" class="btn torn-btn btn-action-tab btn-dark-bg">
                            Confirm
                        </div>
                    </div>
                </div>
            `;

        }

        function buildSettings() {
            return `
                <hr style="margin-top:10px;margin-bottom:10px">
                <div style="display:flex;justify-content: space-between;align-items: center;">
                    <div style="display:inline-block;vertical-align:middle">
                        <label for="flying-oc-api-key">API Key (Minimal Access):</label>
                        <input type="text" id="flying-oc-api-key" name="flying-oc-api-key" value="${apiKey}"><br><br>
                        <label for="flying-oc-threshold">Threshold (in hours):</label>
                        <input type="text" id="flying-oc-threshold" name="flying-oc-threshold" value="${threshold}"><br><br>
                        <label for="flying-oc-method">Confirmation Method:</label>
                        <select id="flying-oc-method" name="flying-oc-method">
                            <option value="default"${confirmMethod == "default" ? " selected" : ""}>Default</option>
                            <option value="prompt"${confirmMethod == "prompt" ? " selected" : ""}>Prompt</option>
                            <option value="addition"${confirmMethod == "addition" ? " selected" : ""}>Addition</option>
                        </select><br><br>
                        <label for="flying-oc-prompt">Confirmation Prompt (only if "Prompt" is selected):</label>
                        <input type="text" id="flying-oc-prompt" name="flying-oc-confirm-prompt" value="${confirmPrompt}">
                    </div>
                    <div id="flying-oc-settings-save-button" class="btn torn-btn btn-action-tab btn-dark-bg" style="display:inline-block;float:right">
                        Save
                    </div>
                </div>
            `
        };

        function openSettings(open = !document.querySelector("#flying-oc-settings").hidden) {
            document.querySelector("#flying-oc-settings").hidden = open;
        }

        function saveSettings() {
            let newApiKey = document.querySelector("#flying-oc-api-key").value;
            if (newApiKey.length == 16) {
                apiKey = newApiKey;
                localStorage.setItem("nichtgersti-flying-oc-alert-api-key", apiKey);
            } else document.querySelector("#flying-oc-api-key").value = apiKey;

            let newThreshold = Number.parseInt(document.querySelector("#flying-oc-threshold").value);
            if (newThreshold) {
                threshold = newThreshold;
                localStorage.setItem("nichtgersti-flying-oc-alert-threshold", threshold);
            } else document.querySelector("#flying-oc-threshold").value = threshold;

            confirmMethod = document.querySelector("#flying-oc-method").selectedOptions[0].value;
            localStorage.setItem("nichtgersti-flying-oc-alert-method", confirmMethod);

            confirmPrompt = document.querySelector("#flying-oc-prompt").value;
            localStorage.setItem("nichtgersti-flying-oc-alert-prompt", confirmPrompt);

            console.log("[Flying OC Alert] Settings saved.");
        }

        function pressConfirm() {
            let confirmInput = document.querySelector("#flying-oc-confirm-input");
            if (confirmInput.getAttribute("data") != "undefined" && confirmInput.value != confirmInput.getAttribute("data")) return;
            setHideFlying(false);
            document.querySelector("#flying-oc-confirm-div").hidden = true;
        }
    })
})();