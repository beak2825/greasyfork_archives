// ==UserScript==
// @name         Bottless Leaderboard
// @namespace    See all the Non bots in your server
// @version      1.0
// @description  Non bot leaderboard
// @author       𝓝𝑒ⓦ 𝓙ⓐ¢𝓀🕹️
// @match        *://agar.io/*
// @license      MIT
// @icon         https://i.imgur.com/BlocGBz.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495089/Bottless%20Leaderboard.user.js
// @updateURL https://update.greasyfork.org/scripts/495089/Bottless%20Leaderboard.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let popupWindow = null;
    let nicksGlobal = [];
    let nameCountsGlobal = {};
    let flaggedNicks = JSON.parse(localStorage.getItem("agario_enemies")) || [];
    let alarmSoundUrl = localStorage.getItem("alarm_sound_url") || "https://www.myinstants.com/media/sounds/wwe-stone-cold-steve-austin-titantron-hd-full-mp3cut.mp3";
    let enableSound = JSON.parse(localStorage.getItem("enable_sound")) || true;
    let lastPlayTime = 0;

    function createSettingsDiv(parent) {
        let settingsDiv = document.createElement("div");
        settingsDiv.style.padding = "20px";
        settingsDiv.style.background = "linear-gradient(to right, darkblue, black)";
        settingsDiv.style.border = "1px solid black";
        settingsDiv.style.color = "white";

        let soundControl = document.createElement("div");
        soundControl.innerHTML = `
            <label class="switch">
                <input type="checkbox" id="soundCheckbox" ${enableSound ? "checked" : ""}>
                <span class="slider round"></span>
            </label>
            <span id="soundStatus">${enableSound ? "Sound" : "Sound "}</span>`;
        soundControl.style.marginBottom = "10px";
        settingsDiv.appendChild(soundControl);

        let soundLabel = document.createElement("label");
        soundLabel.textContent = "Alarm sound URL:";
        settingsDiv.appendChild(soundLabel);

        let soundInput = document.createElement("input");
        soundInput.type = "text";
        soundInput.value = alarmSoundUrl;
        soundInput.style.display = "block";
        soundInput.style.marginTop = "5px";
        soundInput.style.width = "90%";
        settingsDiv.appendChild(soundInput);

        let inputLabel = document.createElement("label");
        inputLabel.textContent = "Enter enemies (comma separated):";
        inputLabel.style.marginTop = "10px";
        settingsDiv.appendChild(inputLabel);

        let input = document.createElement("input");
        input.type = "text";
        input.style.display = "block";
        input.style.marginTop = "5px";
        input.style.width = "90%";
        settingsDiv.appendChild(input);

        let addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.style.display = "block";
        addButton.style.marginTop = "10px";
        addButton.style.backgroundColor = "green";
        addButton.style.color = "white";
        addButton.style.border = "none";
        addButton.style.padding = "5px 10px";
        addButton.style.cursor = "pointer";
        addButton.style.transition = "background-color 0.3s, transform 0.1s";
        addButton.addEventListener("mouseover", function() {
            addButton.style.backgroundColor = "darkgreen";
        });
        addButton.addEventListener("mouseout", function() {
            addButton.style.backgroundColor = "green";
        });
        addButton.addEventListener("mousedown", function() {
            addButton.style.transform = "translateY(2px)";
        });
        addButton.addEventListener("mouseup", function() {
            addButton.style.transform = "translateY(0)";
        });
        settingsDiv.appendChild(addButton);

        let currentEnemiesLabel = document.createElement("label");
        currentEnemiesLabel.textContent = "Current Enemies:";
        currentEnemiesLabel.style.display = "block";
        currentEnemiesLabel.style.marginTop = "10px";
        settingsDiv.appendChild(currentEnemiesLabel);

        let currentEnemiesDiv = document.createElement("div");
        currentEnemiesDiv.style.display = "flex";
        currentEnemiesDiv.style.flexWrap = "wrap";
        currentEnemiesDiv.style.gap = "10px";
        currentEnemiesDiv.style.marginTop = "5px";
        currentEnemiesDiv.style.padding = "5px";
        currentEnemiesDiv.style.background = "linear-gradient(to right, darkblue, black)";
        settingsDiv.appendChild(currentEnemiesDiv);

        function updateEnemiesDiv() {
            currentEnemiesDiv.innerHTML = "";
            flaggedNicks.forEach((nick, index) => {
                let nickDiv = document.createElement("div");
                nickDiv.style.display = "flex";
                nickDiv.style.alignItems = "center";
                nickDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                nickDiv.style.padding = "5px 10px";
                nickDiv.style.border = "1px solid white";
                nickDiv.style.borderRadius = "1px";
                nickDiv.style.color = "white";

                let nickText = document.createElement("span");
                nickText.textContent = nick;
                nickDiv.appendChild(nickText);

                let removeButton = document.createElement("button");
                removeButton.textContent = "X";
                removeButton.style.marginLeft = "10px";
                removeButton.style.backgroundColor = "red";
                removeButton.style.color = "white";
                removeButton.style.border = "none";
                removeButton.style.borderRadius = "50%";
                removeButton.style.cursor = "pointer";
                removeButton.style.transition = "background-color 0.3s, transform 0.1s";
                removeButton.addEventListener("mousedown", function() {
                    removeButton.style.transform = "translateY(2px)";
                });
                removeButton.addEventListener("mouseup", function() {
                    removeButton.style.transform = "translateY(0)";
                });
                removeButton.addEventListener("click", function() {
                    flaggedNicks.splice(index, 1);
                    localStorage.setItem("agario_enemies", JSON.stringify(flaggedNicks));
                    updateEnemiesDiv();
                });
                nickDiv.appendChild(removeButton);

                currentEnemiesDiv.appendChild(nickDiv);
            });
        }

        updateEnemiesDiv();

        addButton.addEventListener("click", function() {
            let newNicks = input.value.split(",").map(nick => nick.trim()).filter(nick => nick);
            flaggedNicks = flaggedNicks.concat(newNicks);
            localStorage.setItem("agario_enemies", JSON.stringify(flaggedNicks));
            input.value = "";
            updateEnemiesDiv();
        });

        let saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.style.display = "block";
        saveButton.style.marginTop = "10px";
        saveButton.style.backgroundColor = "green";
        saveButton.style.color = "white";
        saveButton.style.border = "none";
        saveButton.style.padding = "5px 10px";
        saveButton.style.cursor = "pointer";
        saveButton.style.transition = "background-color 0.3s, transform 0.1s";
        saveButton.addEventListener("mouseover", function() {
            saveButton.style.backgroundColor = "darkgreen";
        });
        saveButton.addEventListener("mouseout", function() {
            saveButton.style.backgroundColor = "green";
        });
        saveButton.addEventListener("mousedown", function() {
            saveButton.style.transform = "translateY(2px)";
        });
        saveButton.addEventListener("mouseup", function() {
            saveButton.style.transform = "translateY(0)";
        });
        settingsDiv.appendChild(saveButton);

        parent.appendChild(settingsDiv);

        saveButton.addEventListener("click", function() {
            alarmSoundUrl = soundInput.value.trim();
            enableSound = soundControl.querySelector("#soundCheckbox").checked;
            localStorage.setItem("alarm_sound_url", alarmSoundUrl);
            localStorage.setItem("enable_sound", JSON.stringify(enableSound));
            document.getElementById("soundStatus").textContent = enableSound ? "Sound On" : "Sound Off";
            toastr.success("Settings saved!");
        });

        soundControl.querySelector("#soundCheckbox").addEventListener("change", function() {
            enableSound = this.checked;
            document.getElementById("soundStatus").textContent = enableSound ? "Sound On" : "Sound Off";
        });

        let leaderboardDiv = document.createElement("div");
        leaderboardDiv.id = "leaderboardDiv";
        leaderboardDiv.style.marginTop = "20px";
        settingsDiv.appendChild(leaderboardDiv);

        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: red;
                transition: .4s;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
            }
            input:checked + .slider {
                background-color: lightgreen;
            }
            input:checked + .slider:before {
                transform: translateX(26px);
            }
            .slider.round {
                border-radius: 34px;
            }
            .slider.round:before {
                border-radius: 50%;
            }
        `;
        parent.appendChild(style);
    }

    function createTable(nicks, nameCounts) {
        const table = document.createElement("table");
        table.style.fontSize = "15px";
        table.style.borderCollapse = "collapse";
        table.style.margin = "0 auto";
        table.style.color = "white";
        let header = document.createElement("th");
        header.colSpan = "3";
        header.textContent = "NON BOT LIST";
        header.style.textAlign = "center";
        header.style.padding = "15px";
        table.appendChild(header);

        let row = null;
        nicks.forEach((nick, index) => {
            if (index % 3 === 0) {
                row = document.createElement("tr");
                table.appendChild(row);
            }
            let count = nameCounts[nick];
            let cell = document.createElement("td");
            if (count > 1) {
                cell.textContent = `${nick} (${count})`;
                cell.style.color = "red";
                cell.style.fontWeight = "bold";
            } else {
                cell.textContent = nick;
            }
            cell.style.padding = "15px";
            cell.style.textAlign = "center";
            row.appendChild(cell);
        });

        if (!popupWindow || popupWindow.closed) {
            popupWindow = window.open("", "", "width=600,height=600");
            createSettingsDiv(popupWindow.document.body);
        }

        let leaderboardDiv = popupWindow.document.getElementById("leaderboardDiv");
        leaderboardDiv.innerHTML = "";
        leaderboardDiv.style.backgroundColor = "black";
        leaderboardDiv.appendChild(table);
        nicksGlobal = nicks;
        nameCountsGlobal = nameCounts;

        let saveButton = document.createElement("button");
        saveButton.textContent = "Save to CSV";
        saveButton.onclick = saveToCSV;
        saveButton.style.backgroundColor = "blue";
        saveButton.style.color = "white";
        saveButton.style.marginTop = "3px";
        saveButton.style.width = "100%";
        leaderboardDiv.appendChild(saveButton);
    }

    function playSound(url) {
        if (enableSound) {
            const audio = new Audio(url);
            audio.loop = false;
            audio.play();
        }
    }

    function extractNicks() {
        const nameCounts = {};
        if (
            typeof leaderboard !== "undefined" &&
            leaderboard.hasOwnProperty("leaderboard")
        ) {
            let nicks = leaderboard.leaderboard.map((obj) => obj.nick);
            nicks.forEach((nick) => {
                nameCounts[nick] = (nameCounts[nick] || 0) + 1;
            });
            nicks = [...new Set(nicks)];
            createTable(nicks, nameCounts);
            let foundFlaggedNicks = nicks.filter((nick) =>
                flaggedNicks.includes(nick) && nick.trim() !== ""
            );
            let currentTime = Date.now();
            if (foundFlaggedNicks.length > 0 && enableSound && (currentTime - lastPlayTime >= 10000)) {
                if (popupWindow && !popupWindow.closed) {
                    let alertDiv = popupWindow.document.createElement("div");
                    alertDiv.textContent =
                        "Flagged nicks detected: " + foundFlaggedNicks.join(", ");
                    alertDiv.style.color = "red";
                    popupWindow.document
                        .getElementById("leaderboardDiv")
                        .prepend(alertDiv);
                    playSound(alarmSoundUrl);
                    lastPlayTime = currentTime;
                }
            }
        }
    }

    function saveToCSV() {
        let csvContent = "\uFEFF"; // UTF-8 BOM
        csvContent += "nick,count\n";
        nicksGlobal.forEach((nick) => {
            csvContent += `"${nick}",${nameCountsGlobal[nick]}\n`;
        });
        let date = new Date();
        let timestamp =
            date.getFullYear() +
            "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + date.getDate()).slice(-2) +
            "_" +
            ("0" + date.getHours()).slice(-2) +
            "-" +
            ("0" + date.getMinutes()).slice(-2) +
            "-" +
            ("0" + date.getSeconds()).slice(-2);
        let encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "nicks_" + timestamp + ".csv");
        link.click();
    }

    function createStartButton() {
        let button = document.createElement("button");
        button.textContent = "LB #'s";
        button.style.color = "white";
        button.style.fontWeight = "bold";
        button.className = "input-button";
        button.style.textShadow = "1px 1px 1px black";
        document.body.appendChild(button);

        let style = document.createElement("style");
        style.type = "text/css";
       style.innerHTML = `
    @keyframes borderChange {
        0% { border-color: #00008B; } /* Dark Blue */
        20% { border-color: #000000; } /* Black */
        40% { border-color: rgba(106,50,198,0.75); } /* Dark Violet */
        60% { border-color: #00008B; } /* Dark Blue */
        80% { border-color: #000000; } /* Black */
        100% { border-color: #00008B; } /* Dark Blue */
    }
    .input-button {
        border: 5px solid #00008B; /* Initial border color Dark Blue */
        animation: borderChange 4s infinite;
        border-style: outset;
        border-color: rgba(0, 0, 139, 1); /* Dark Blue */
        background: linear-gradient(180deg, rgba(9,9,121,0.75) 0%, rgba(80,6,167,0.75) 50%, rgba(2,0,36,0.75) 100%);
    }
`;

        document.getElementsByTagName("head")[0].appendChild(style);

        let isRunning = false;
        let intervalId = null;

        button.onclick = function () {
            if (!isRunning) {
                button.style.backgroundColor = "rgba(106,50,198,0.75)";
                intervalId = setInterval(extractNicks, 1500);
                isRunning = true;
                toastr.info("Leaderboard Values Started 🟢", {
                    className: "toast-custom-bg",
                });
            } else {
                button.style.backgroundColor = "rgba(55,55,197,0.75)";
                clearInterval(intervalId);
                isRunning = false;
                toastr.info("Leaderboard Values Stopped 🔴", {
                    className: "toast-custom-bg",
                });
            }
        };

        const targetDiv = document.querySelector(".fcols.grow.hinherit");
        if (targetDiv) {
            targetDiv.appendChild(button);
        }
    }

    // Call createStartButton after a delay of 5000 milliseconds
    setTimeout(function() {
        createStartButton();
    }, 5000);

})();
