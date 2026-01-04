// ==UserScript==
// @name         Torn Company Loadouts
// @namespace    Apo
// @version      4.1
// @description  Save, load, export, and import worker presets. Hide unnecessary info messages.
// @author       Apollyon [445323]
// @match        https://www.torn.com/companies.php*
// @match        https://pda.torn.com/companies.php*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482214/Torn%20Company%20Loadouts.user.js
// @updateURL https://update.greasyfork.org/scripts/482214/Torn%20Company%20Loadouts.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Adding styles for buttons
    const addStyles = () => {
        const style = document.createElement("style");
        style.innerHTML = `
      .button-3 {
        appearance: none;
        background-color: #2ea44f;
        border: 1px solid rgba(27, 31, 35, .15);
        border-radius: 6px;
        box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        padding: 6px 16px;
        position: relative;
        text-align: center;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        vertical-align: middle;
        white-space: nowrap;
        margin-right: 10px;
        margin-top: 10px;
      }

      .button-3:focus:not(:focus-visible):not(.focus-visible) {
        box-shadow: none;
        outline: none;
      }

      .button-3:hover {
        background-color: #2c974b;
      }

      .button-3:focus {
        box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
        outline: none;
      }

      .button-3:disabled {
        background-color: #94d3a2;
        border-color: rgba(27, 31, 35, .1);
        color: rgba(255, 255, 255, .8);
        cursor: default;
      }

      .button-3:active {
        background-color: #298e46;
        box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
      }

      .button-green {
        background-color: #2ea44f;
      }

      .button-green:hover {
        background-color: #2c974b;
      }

      .button-red {
        background-color: #d73a49;
      }

      .button-red:hover {
        background-color: #c23540;
      }

      .button-blue {
        background-color: #0366d6;
      }

      .button-blue:hover {
        background-color: #035fc4;
      }

      .button-orange {
        background-color: #f66a0a;
      }

      .button-orange:hover {
        background-color: #e36209;
      }

      .button-custom {
        background-color: #00cc99; /* Custom color for Save button */
      }

      .button-custom:hover {
        background-color: #00b386; /* Darker shade for hover */
      }

      /* Dropdown Styles */
      #presetDropdown {
        background-color: #525252; /* Dropdown background color */
        color: #ffffff; /* Dropdown text color */
        border: 1px solid rgba(27, 31, 35, .15);
        border-radius: 6px;
        padding: 6px 16px; /* Adjust padding to match buttons */
        font-family: inherit; /* Inherit font family */
        font-size: 14px; /* Match button font size */
        font-weight: 600; /* Match button font weight */
        cursor: pointer; /* Pointer cursor */
        margin-top: 10px; /* Match button margin */
      }
    `;
        document.head.appendChild(style);
    };

    // Function to save presets to localStorage
    const savePresetsToLocalStorage = () => {
        localStorage.setItem("tornPresets", JSON.stringify(presets));
    };

    // Function to load presets from localStorage
    const loadPresetsFromLocalStorage = () => {
        const storedPresets = localStorage.getItem("tornPresets");
        return storedPresets ? JSON.parse(storedPresets) : [];
    };

    // Array to store presets
    let presets = loadPresetsFromLocalStorage();

    // Function to save presets
    const savePresets = () => {
        const presetName = prompt("Enter a name for the preset:");
        if (!presetName) return; // Cancelled or empty name

        const workerDivs = document.querySelectorAll(".employee-list>li");
        if (!workerDivs.length) {
            console.error("No worker divs found.");
            return;
        }

        const preset = { name: presetName, workers: [] };
        workerDivs.forEach((workerDiv) => {
            const employeeId = workerDiv.getAttribute("data-user");
            const rankDiv = workerDiv.querySelector(".employee-rank");

            if (!rankDiv) {
                console.error("Rank information not found for a worker.");
                return;
            }

            const selectedRank = rankDiv.value;
            preset.workers.push({ employeeId, selectedRank });
        });

        presets.push(preset);
        savePresetsToLocalStorage();
        alert(`Preset '${presetName}' saved successfully!`);

        // Update the dropdown immediately after saving the preset
        updatePresetDropdown();
    };

    // Function to update worker rank
    const updateWorker = (employeeId, selectedRank) => {
        const workerDiv = document.querySelector(`li[data-user='${employeeId}']`);
        if (!workerDiv) {
            console.error(`Worker with ID ${employeeId} not found.`);
            return;
        }
        const rankDiv = workerDiv.querySelector(".employee-rank");
        if (rankDiv) {
            rankDiv.value = selectedRank; // Update the rank
            // Trigger change event if necessary
            rankDiv.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.error(`Rank element not found for worker ID ${employeeId}.`);
        }
    };

    // Function to load presets
    const loadPresets = () => {
        const presetDropdown = document.getElementById("presetDropdown");
        const selectedPresetIndex = presetDropdown.selectedIndex;
        if (selectedPresetIndex === -1) {
            console.log("No preset selected.");
            return; // No preset selected
        }

        const selectedPreset = presets[selectedPresetIndex];
        console.log("Loading preset:", selectedPreset); // Log selected preset
        selectedPreset.workers.forEach(({ employeeId, selectedRank }) => {
            console.log(`Updating worker ID ${employeeId} to rank ${selectedRank}`); // Log updates
            updateWorker(employeeId, selectedRank);
        });
        alert(`Preset '${selectedPreset.name}' loaded successfully!`);
    };

    // Function to delete the selected preset
    const deletePreset = () => {
        const presetDropdown = document.getElementById("presetDropdown");
        const selectedPresetIndex = presetDropdown.selectedIndex;
        if (selectedPresetIndex === -1) return; // No preset selected

        const deletedPresetName = presets[selectedPresetIndex].name;
        presets.splice(selectedPresetIndex, 1);
        savePresetsToLocalStorage();
        alert(`Preset '${deletedPresetName}' deleted successfully!`);
        updatePresetDropdown();
    };

    // Function to export presets
    const exportPresets = () => {
        const presetData = JSON.stringify(presets);
        const textArea = document.createElement("textarea");
        textArea.value = presetData;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Presets exported and copied to clipboard!");
    };

    // Function to import presets
    const importPresets = () => {
        const importedData = prompt("Paste the preset data here:");
        if (!importedData) return; // Cancelled or empty input

        try {
            const importedPresets = JSON.parse(importedData);
            presets = importedPresets;
            savePresetsToLocalStorage();
            alert("Presets imported successfully!");
            updatePresetDropdown();
        } catch (error) {
            alert("Invalid preset data! Please check and try again.");
        }
    };

    // Function to update the preset dropdown menu
    const updatePresetDropdown = () => {
        const existingDropdown = document.getElementById("presetDropdown");
        if (existingDropdown) {
            existingDropdown.parentNode.removeChild(existingDropdown);
        }

        const presetDropdown = document.createElement("select");
        presetDropdown.id = "presetDropdown";

        presets.forEach((preset) => {
            const option = document.createElement("option");
            option.value = preset.name;
            option.text = preset.name;
            presetDropdown.add(option);
        });

        const existingButtonsContainer = document.getElementById("presetButtonsContainer");
        if (existingButtonsContainer) {
            existingButtonsContainer.parentNode.removeChild(existingButtonsContainer);
        }

        const infoMessage = document.querySelector(".info-msg");
        if (infoMessage) {
            const buttonsContainer = document.createElement("div");
            buttonsContainer.id = "presetButtonsContainer";

            // Creating buttons in the desired order
            const loadButton = document.createElement("button");
            loadButton.textContent = "Load Presets";
            loadButton.className = "button-3 button-green"; // Green for Load
            loadButton.addEventListener("click", loadPresets);

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save Presets";
            saveButton.className = "button-3 button-custom"; // Custom color for Save
            saveButton.addEventListener("click", savePresets);

            const importButton = document.createElement("button");
            importButton.textContent = "Import Presets";
            importButton.className = "button-3 button-blue"; // Blue for Import
            importButton.addEventListener("click", importPresets);

            const exportButton = document.createElement("button");
            exportButton.textContent = "Export Presets";
            exportButton.className = "button-3 button-orange"; // Orange for Export
            exportButton.addEventListener("click", exportPresets);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete Preset";
            deleteButton.className = "button-3 button-red"; // Red for Delete
            deleteButton.addEventListener("click", deletePreset);

            // Append buttons in the specified order
            buttonsContainer.appendChild(loadButton);
            buttonsContainer.appendChild(saveButton);
            buttonsContainer.appendChild(importButton);
            buttonsContainer.appendChild(exportButton);
            buttonsContainer.appendChild(deleteButton);

            infoMessage.parentNode.insertBefore(buttonsContainer, infoMessage.nextSibling);
            infoMessage.parentNode.insertBefore(presetDropdown, buttonsContainer.nextSibling);
        }
    };

    // Function to hide the info message
    const hideInfoMessage = () => {
        const infoMessage = document.querySelector(".info-msg");
        if (infoMessage) {
            infoMessage.style.display = "none";
        }
    };

    // Run the script
    addStyles();         // Add the button styles to the document
    updatePresetDropdown(); // Update the dropdown
    hideInfoMessage();   // Hide the info message
})();
