// ==UserScript==
// @name                WME Aerial Shifter (Updated API)
// @version             1.7.0
// @description         Adjusts the position and opacity of satellite imagery in WME
// @match               https://beta.waze.com/*editor*
// @match               https://www.waze.com/*editor*
// @grant               none
// @icon                http://s3.amazonaws.com/uso_ss/icon/176646/large.png?1391605696
// @namespace           https://www.waze.com/forum/viewtopic.php?t=53022
// @author              byo
// @contributor         berestovskyy, iainhouse, ragacs
// @downloadURL https://update.greasyfork.org/scripts/525847/WME%20Aerial%20Shifter%20%28Updated%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525847/WME%20Aerial%20Shifter%20%28Updated%20API%29.meta.js
// ==/UserScript==

function initializeAerialShifter() {
    console.log("WME Aerial Shifter: Initializing...");

    // Register a sidebar tab for the script
    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-aerial-shifter");

    // Set tab label
    tabLabel.innerText = 'Aerial Shifter';
    tabLabel.title = 'Adjust satellite imagery position';

    // Create UI inside the tab
    tabPane.innerHTML = `
        <div style="padding: 10px;">
            <label>Horizontal shift (m):</label>
            <input type="number" id="was_sx" min="-100000" max="100000" step="100" value="0">
            <br>
            <label>Vertical shift (m):</label>
            <input type="number" id="was_sy" min="-100000" max="100000" step="100" value="0">
            <br>
            <label>Opacity (%):</label>
            <input type="number" id="was_opacity" min="0" max="100" step="10" value="100">
            <br>
            <button id="was_apply">Apply</button>
            <button id="was_reset">Reset</button>
        </div>
    `;

    // Wait for the tab pane to be available in the DOM
    W.userscripts.waitForElementConnected(tabPane).then(() => {
        console.log("WME Aerial Shifter: UI loaded.");

        // Attach event listeners
        document.getElementById("was_apply").addEventListener("click", applyChanges);
        document.getElementById("was_reset").addEventListener("click", resetDefaults);

        loadSettings();
    });
}

function applyChanges() {
    let shiftX = parseInt(document.getElementById("was_sx").value, 10);
    let shiftY = parseInt(document.getElementById("was_sy").value, 10);
    let opacity = parseInt(document.getElementById("was_opacity").value, 10);

    let metersPerPixel = W.map.getResolution() * 39.37; // Convert to pixels

    // Find the satellite layer dynamically
    let satLayer = W.map.getLayersBy("CLASS_NAME", "OpenLayers.Layer.Google")[0];

    if (!satLayer || !satLayer.div) {
        console.error("WME Aerial Shifter: Satellite layer not found.");
        return;
    }

    // Apply transformation to shift the satellite layer
    satLayer.div.style.transform = `translate(${Math.round(shiftX / metersPerPixel)}px, ${Math.round(shiftY / metersPerPixel)}px)`;

    // Apply opacity change
    satLayer.div.style.opacity = opacity / 100;

    saveSettings(shiftX, shiftY, opacity);
}



function resetDefaults() {
    document.getElementById("was_sx").value = 0;
    document.getElementById("was_sy").value = 0;
    document.getElementById("was_opacity").value = 100;
    applyChanges();
}

function loadSettings() {
    let settings = JSON.parse(localStorage.getItem("wme_aerial_shifter_settings"));
    if (settings) {
        document.getElementById("was_sx").value = settings.shiftX;
        document.getElementById("was_sy").value = settings.shiftY;
        document.getElementById("was_opacity").value = settings.opacity;
    }
}

function saveSettings(shiftX, shiftY, opacity) {
    localStorage.setItem("wme_aerial_shifter_settings", JSON.stringify({
        shiftX,
        shiftY,
        opacity
    }));
}

// Wait for WME to be fully initialized before running the script
if (W?.userscripts?.state.isReady) {
    initializeAerialShifter();
} else {
    document.addEventListener("wme-ready", initializeAerialShifter, { once: true });
}
