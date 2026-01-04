// ==UserScript==
// @name                WME Satellite Imagery Shifter 2
// @version             1.7.9
// @description         Adjusts the position and transparency of satellite imagery in WME (supports movement in all directions with arrow keys and buttons, maintains position during zoom)
// @match               https://beta.waze.com/*editor*
// @match               https://www.waze.com/*editor*
// @grant               none
// @author              Blue Rabbit
// @icon                https://img.icons8.com/?size=48&id=36210&format=png
// @namespace           https://www.waze.com/forum/viewtopic.php?t=53022
// @contributor         berestovskyy, iainhouse, ragacs
// @downloadURL https://update.greasyfork.org/scripts/530678/WME%20Satellite%20Imagery%20Shifter%202.user.js
// @updateURL https://update.greasyfork.org/scripts/530678/WME%20Satellite%20Imagery%20Shifter%202.meta.js
// ==/UserScript==

function initializeAerialShifter() {
    console.log("WME Satellite Imagery Shifter: Initializing...");

    // Register sidebar tab
    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-aerial-shifter");

    tabLabel.innerText = 'Satellite Adjust';
    tabLabel.title = 'Adjust satellite imagery position';

    tabPane.innerHTML = `
        <div style="padding: 10px; text-align: center; font-size: 16px;">
            <div style="margin-bottom: 15px;">
                <label style="font-size: 18px;">Horizontal Shift (m):</label><br>
                <input type="number" id="was_sx" min="-100000" max="100000" step="10" value="0" style="margin: 0 auto; display: block; font-size: 16px; padding: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="font-size: 18px;">Vertical Shift (m):</label><br>
                <input type="number" id="was_sy" min="-100000" max="100000" step="10" value="0" style="margin: 0 auto; display: block; font-size: 16px; padding: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="font-size: 18px;">Transparency (%):</label><br>
                <input type="number" id="was_opacity" min="0" max="100" step="10" value="100" style="margin: 0 auto; display: block; font-size: 16px; padding: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <button id="was_upleft" style="font-size: 24px; padding: 10px 15px;">↖</button>
                <button id="was_up" style="font-size: 24px; padding: 10px 15px;">↑</button>
                <button id="was_upright" style="font-size: 24px; padding: 10px 15px;">↗</button>
                <br>
                <button id="was_left" style="font-size: 24px; padding: 10px 15px;">←</button>
                <button id="was_right" style="font-size: 24px; padding: 10px 15px;">→</button>
                <br>
                <button id="was_downleft" style="font-size: 24px; padding: 10px 15px;">↙</button>
                <button id="was_down" style="font-size: 24px; padding: 10px 15px;">↓</button>
                <button id="was_downright" style="font-size: 24px; padding: 10px 15px;">↘</button>
            </div>
            <div>
                <button id="was_reset" style="font-size: 18px; padding: 5px 10px;">Reset</button>
            </div>
        </div>
    `;

    W.userscripts.waitForElementConnected(tabPane).then(() => {
        console.log("WME Satellite Imagery Shifter: UI loaded.");

        // Add event listeners to input fields
        const inputs = ['was_sx', 'was_sy', 'was_opacity'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', applyChanges);
        });

        // Add event listeners to buttons
        document.getElementById("was_up").addEventListener("click", () => moveLayer(0, -10));
        document.getElementById("was_down").addEventListener("click", () => moveLayer(0, 10));
        document.getElementById("was_left").addEventListener("click", () => moveLayer(-10, 0));
        document.getElementById("was_right").addEventListener("click", () => moveLayer(10, 0));
        document.getElementById("was_upleft").addEventListener("click", () => moveLayer(-7.07, -7.07));
        document.getElementById("was_upright").addEventListener("click", () => moveLayer(7.07, -7.07));
        document.getElementById("was_downleft").addEventListener("click", () => moveLayer(-7.07, 7.07));
        document.getElementById("was_downright").addEventListener("click", () => moveLayer(7.07, 7.07));
        document.getElementById("was_reset").addEventListener("click", resetDefaults);

        // Monitor zoom events
        W.map.events.register("zoomend", null, applyChanges);

        loadSettings();
        applyChanges();
    });
}

function moveLayer(deltaX, deltaY) {
    // Move layer with button clicks
    let shiftX = (parseInt(document.getElementById("was_sx").value) || 0) + deltaX;
    let shiftY = (parseInt(document.getElementById("was_sy").value) || 0) + deltaY;
    document.getElementById("was_sx").value = Math.round(shiftX);
    document.getElementById("was_sy").value = Math.round(shiftY);
    applyChanges();
}

function applyChanges() {
    // Apply changes
    let shiftX = parseInt(document.getElementById("was_sx").value, 10) || 0;
    let shiftY = parseInt(document.getElementById("was_sy").value, 10) || 0;
    let opacity = parseInt(document.getElementById("was_opacity").value, 10) || 100;

    // Calculate meters per pixel
    let metersPerPixel = W.map.getResolution() * 39.37; // Dynamic calculation based on zoom level

    // Get satellite layer
    let satLayer = W.map.getLayersBy("CLASS_NAME", "OpenLayers.Layer.Google")[0];

    if (!satLayer || !satLayer.div) {
        console.error("WME Satellite Imagery Shifter: Satellite layer not found.");
        return;
    }

    // Apply shift and opacity (convert meters to pixels)
    satLayer.div.style.transform = `translate(${Math.round(shiftX / metersPerPixel)}px, ${Math.round(shiftY / metersPerPixel)}px)`;
    satLayer.div.style.opacity = opacity / 100;

    saveSettings(shiftX, shiftY, opacity);
}

function resetDefaults() {
    // Reset to default values
    document.getElementById("was_sx").value = 0;
    document.getElementById("was_sy").value = 0;
    document.getElementById("was_opacity").value = 100;
    applyChanges();
}

function loadSettings() {
    // Load settings
    let settings = JSON.parse(localStorage.getItem("wme_aerial_shifter_settings"));
    if (settings) {
        document.getElementById("was_sx").value = settings.shiftX || 0;
        document.getElementById("was_sy").value = settings.shiftY || 0;
        document.getElementById("was_opacity").value = settings.opacity || 100;
    }
}

function saveSettings(shiftX, shiftY, opacity) {
    // Save settings
    localStorage.setItem("wme_aerial_shifter_settings", JSON.stringify({
        shiftX,
        shiftY,
        opacity
    }));
}

// Run script when WME is ready
if (W?.userscripts?.state.isReady) {
    initializeAerialShifter();
} else {
    document.addEventListener("wme-ready", initializeAerialShifter, { once: true });
}