// ==UserScript==
// @name          Scenexe2 a Better Nebula Client
// @namespace     http://tampermonkey.net/
// @version       0.3.1 // Version bump for Abyss Portal moved to Stats
// @description   A comprehensive client for Scenexe2.io with stats, zoom, darkness control, and utilities like reconnect.
// @author        1contra (discord), n00bi2761 (for zoom mod, darkness mod), phosphorus2 (for utilities)
// @match         https://scenexe2.io/*
// @grant         none
// @license       CC BY-NC 4.0
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/540893/Scenexe2%20a%20Better%20Nebula%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/540893/Scenexe2%20a%20Better%20Nebula%20Client.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Core CSS Styles (Fredoka One font and client container basics) ---
  var v = document.createElement("style");
  document.head.appendChild(v);
  const v2 = document.createElement("style"); // v2 will hold general client styles
  document.head.appendChild(v2); // Append v2 to head

  // Fredoka One font for entire page
  v.innerHTML = `
    @font-face {
      font-family: 'Fredoka One';
      src: url('https://fonts.gstatic.com/s/fredokaone/v14/k3kUo8kEI-tA1RRcTZGmTlHGCac.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }
    * {
      font-family: 'Fredoka One', sans-serif !important;
    }
  `;

  // General client container styles and transitions, including integrated zoom UI styles
  v2.textContent = `
    #client-container {
      transition: opacity 0.5s ease; /* Only opacity for hide/show */
      display: block; /* Ensure it starts visible for styling consistency */
    }
    #client-container.hidden {
      opacity: 0;
      pointer-events: none;
    }
    .stats-content, .settings-content, .zoom-content { /* Unified styling for internal pages */
      margin: 10px 0;
      font-size: 16px;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      color: white; /* Ensure text is visible */
    }
    #settings-container, #stats-container, #zoom-container {
      display: none; /* Hidden by default, controlled by JS */
      text-align: center;
      font-family: 'Fredoka One', sans-serif;
    }
    .size-knob {
      margin-top: 10px;
      width: 100%;
    }

    /* --- Sub-page Header & Exit Button Styles --- */
    .sub-page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px; /* Spacing below header */
      padding-bottom: 10px;
      border-bottom: 1px solid #e6b800; /* Matching client border */
    }

    .sub-page-title {
      font-size: 18px;
      font-weight: bold;
      color: #ffcc00; /* Orange/yellow for titles */
      margin: 0; /* Remove default margin from h4 */
    }

    .sub-page-exit-btn {
      padding: 5px 10px;
      border: 2px solid #e6b800;
      border-radius: 5px;
      background-color: #ffcc00;
      color: #333; /* Dark text for contrast */
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
    }

    .sub-page-exit-btn:hover {
      background-color: #ffc107;
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(255, 204, 0, 0.4);
    }

    /* --- Zoom Mod UI Styles (adapted for internal client use, themed orange) --- */
    .zoom-mod-controls {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .zoom-mod-slider-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .zoom-mod-slider {
      flex-grow: 1;
      height: 8px;
      border-radius: 4px;
      background: #1a2a4d;
      outline: none;
      -webkit-appearance: none;
    }
    .zoom-mod-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ffcc00;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255, 204, 0, 0.7);
    }
    .zoom-mod-value {
      font-size: 16px;
      font-weight: bold;
      min-width: 40px;
      text-align: center;
    }
    .zoom-mod-buttons {
      display: flex;
      gap: 10px;
      margin-top: 5px;
    }
    .zoom-mod-btn {
      flex: 1;
      padding: 8px;
      background: linear-gradient(135deg, #e6b800, #ffcc00);
      border: 3px solid #e6b800;
      border-radius: 5px;
      color: #000000;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }
    .zoom-mod-btn:hover {
      background: linear-gradient(135deg, #d5a600, #ffc107);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 204, 0, 0.4);
    }
    .zoom-mod-btn:active {
      transform: translateY(1px);
    }
    .zoom-mod-status {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e6b800;
      font-size: 14px;
    }
    .zoom-mod-status span {
      color: #ffcc00;
      font-weight: bold;
    }
  `;

  // --- Global Client Variables ---
  // Moved v54 declaration to the top of this section to ensure it's defined before use.
  const v54 = document.createElement("div"); // Main menu container (holds buttons)
  let v55 = null; // Used for setInterval in stats page (gate timer)
  let v56 = null; // Stores target timestamp for gate opening
  let v57 = 0; // Current index for stats page (0: Player Counts, 1: Rare Spawns, 2: Gate Openings)
  let v58 = false; // Flag for backtick key press (modifier for other shortcuts)
  let v59 = false; // Flag for client menu dragging
  let v60 = { x: 0, y: 0 }; // Mouse offset for dragging
  window.nebulaClientDarknessEnabled = false; // Control flag for darkness removal

  // --- Alert/Confirm/Prompt Suppression ---
  function f12() {
    window.alert = function () {};
    window.confirm = function () { return false; };
    window.prompt = function () { return null; };
  }
  f12(); // Run once on load
  setInterval(f12, 10000); // Re-apply periodically

  // --- Darkness Remover Mod (Integrated) ---
  // Preserve original methods
  const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
  const originalFillStyle = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "fillStyle");

  // Redefine fillStyle to detect darkness and set skip flag based on user setting
  Object.defineProperty(CanvasRenderingContext2D.prototype, "fillStyle", {
    set(value) {
      // Only set skipDarkness if the darkness remover is enabled AND the color is black/dark
      this.skipDarkness = typeof value === "string" && value.includes("rgba(0, 0, 0") && window.nebulaClientDarknessEnabled;
      originalFillStyle.set?.call(this, value);
    },
    get() {
      // Return the original fillStyle or a transparent black if not set (shouldn't happen often)
      return originalFillStyle.get?.call(this) || "rgba(0,0,0,0)";
    }
  });

  // Override fillRect to skip drawing if skipDarkness is true
  CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
    if (this.skipDarkness) return; // Skip drawing if it's identified as darkness to be removed
    return originalFillRect.call(this, x, y, w, h);
  };
  // --- End Darkness Remover Mod ---


  // --- Hiding Specific Game Elements ---
  const vF2 = () => { // Function to hide elements by ID
    const v61 = ["-0", "-1", "-2"]; // IDs of elements to hide (e.g., native game UI)
    v61.forEach(p20 => {
      const v62 = document.getElementById(p20);
      if (v62) {
        v62.style.position = "absolute";
        v62.style.left = "-10000px"; // Move off-screen
      }
    });
  };
  vF2(); // Run once on load
  setInterval(vF2, 10000); // Re-apply periodically

  // --- Nebula Client UI Container ---
  const v63 = document.createElement("div");
  v63.style.position = "fixed";
  v63.id = "client-container";
  v63.style.width = "250px";
  v63.style.height = "420px";
  // Initial positioning will be handled by vF15 on load
  v63.style.backgroundColor = "rgba(30, 30, 30, 0.9)";
  v63.style.border = "2px solid #ffcc00";
  v63.style.borderRadius = "10px";
  v63.style.padding = "15px";
  v63.style.zIndex = "1000";
  v63.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.5)";
  v63.style.color = "#ffffff";
  v63.style.fontFamily = "Fredoka One, sans-serif";

  // Keybind hint display
  const v64 = document.createElement("div");
  v64.innerHTML = "`p - hide menu<br>`o - reposition menu";
  v64.style.position = "absolute";
  v64.style.bottom = "10px";
  v64.style.left = "50%";
  v64.style.transform = "translateX(-50%)";
  v64.style.textAlign = "center";
  v64.style.fontSize = "12px";
  v64.style.color = "#ffffff";
  v64.style.opacity = "0.6";
  v64.style.fontFamily = "Fredoka One, sans-serif";
  v63.appendChild(v64);

  // Client title bar (draggable handle)
  const v65 = document.createElement("div");
  v65.innerText = "Nebula Client";
  v65.style.cursor = "move";
  v65.style.padding = "10px 20px";
  v65.style.background = "linear-gradient(135deg, rgba(255, 204, 0, 0.8), rgba(255, 140, 0, 0.8))";
  v65.style.borderRadius = "10px 10px 5px 5px";
  v65.style.textAlign = "center";
  v65.style.fontFamily = "Fredoka One, sans-serif";
  v65.style.fontSize = "24px";
  v65.style.color = "#333";
  v65.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
  v65.style.position = "relative";
  v65.style.userSelect = "none";
  v65.style.marginBottom = "10px";
  v63.appendChild(v65);

  // Dragging logic for the main client container
  const v66 = 20; // Padding from window edges for clamping
  v65.addEventListener("mousedown", p21 => {
    v59 = true; // Set dragging flag
    const v68 = v63.getBoundingClientRect(); // Get client's current rendered position
    v60.x = p21.clientX - v68.left; // Calculate mouse offset within the client
    v60.y = p21.clientY - v68.top; // Calculate mouse offset
    document.body.style.userSelect = "none"; // Prevent text selection during drag

    // Crucially, remove percentage/transform and set explicit pixel position on drag start
    v63.style.right = 'auto'; // Disable right-side positioning
    v63.style.transform = 'none'; // Remove any transform that might interfere
    v63.style.top = v68.top + 'px'; // Lock current visual position to 'top' CSS property
    v63.style.left = v68.left + 'px'; // Lock current visual position to 'left' CSS property
  });
  document.addEventListener("mousemove", p22 => {
    if (v59) { // If dragging
      let v69 = p22.clientX - v60.x; // Calculate new X position
      let v70 = p22.clientY - v60.y; // Calculate new Y position
      const v71 = window.innerWidth;
      const v72 = window.innerHeight;
      // Clamp movement within window bounds with v66 padding
      v69 = Math.max(v66, Math.min(v69, v71 - v63.offsetWidth - v66));
      v70 = Math.max(v66, Math.min(v70, v72 - v63.offsetHeight - v66));
      v63.style.left = v69 + "px";
      v63.style.top = v70 + "px";
    }
  });
  document.addEventListener("mouseup", () => {
    v59 = false; // Reset dragging flag
    document.body.style.userSelect = ""; // Re-enable text selection
  });

  // --- Button Styling and Creator Function ---
  const v73 = { // Button color theme
    normal: {
      backgroundColor: "#ffcc00",
      borderColor: "#e6b800"
    },
    hover: {
      backgroundColor: "#ffc107",
      borderColor: "#d5a600"
    }
  };
  const vF3 = (p23, p24) => { // Function to create a styled button
    const v74 = document.createElement("button");
    v74.innerText = p23;
    v74.style.width = "100%";
    v74.style.margin = "5px 0";
    v74.style.padding = "10px";
    v74.style.border = "3px solid " + v73.normal.borderColor;
    v74.style.borderRadius = "5px";
    v74.style.backgroundColor = v73.normal.backgroundColor;
    v74.style.color = "#000000";
    v74.style.cursor = "pointer";
    v74.style.transition = "background-color 0.3s, border-color 0.3s, transform 0.3s";
    v74.style.transformOrigin = "center";
    v74.style.fontFamily = "Fredoka One, sans-serif";
    v74.onmouseover = () => {
      v74.style.backgroundColor = v73.hover.backgroundColor;
      v74.style.borderColor = v73.hover.borderColor;
      v74.style.transform = "scale(1.02)";
      v74.style.boxShadow = "0 0 12px rgba(255, 204, 0, 0.1), 0 0 24px rgba(255, 204, 0, 0.2)";
    };
    v74.onmouseout = () => {
      v74.style.backgroundColor = v73.normal.backgroundColor;
      v74.style.borderColor = v73.normal.borderColor;
      v74.style.transform = "scale(1)";
      v74.style.boxShadow = "none";
    };
    v74.onclick = p24; // Assign click handler
    return v74;
  };

  // --- Main Menu Button Actions ---
  // Helper function to hide all sub-page content divs
  const hideAllClientContent = () => {
      v54.style.display = "none"; // Main menu
      v75.style.display = "none"; // Settings
      v77.style.display = "none"; // Stats
      v118.style.display = "none"; // Zoom
  }

  const vF4 = () => { // Switch to Stats Page
    hideAllClientContent();
    v77.style.display = "block";
    vF9(); // Load stats data
  };

  const vF5 = () => { // Toggle Darkness Remover
    window.nebulaClientDarknessEnabled = !window.nebulaClientDarknessEnabled; // Toggle the state
    vVF32.innerText = `Darkness Remover: ${window.nebulaClientDarknessEnabled ? 'ON' : 'OFF'}`;
    // Optionally update button style based on state
    vVF32.style.backgroundColor = window.nebulaClientDarknessEnabled ? '#4CAF50' : v73.normal.backgroundColor; // Green when ON
    vVF32.style.borderColor = window.nebulaClientDarknessEnabled ? '#388E3C' : v73.normal.borderColor;
  };

  const vF7 = () => { // Switch to Settings Page
    hideAllClientContent();
    v75.style.display = "block";
  };
  const showZoomPage = () => { // Switch to Zoom Page
    hideAllClientContent();
    v118.style.display = "block";
    createZoomPageUI(); // Ensure UI is rendered and updated
  };

  const vF_reconnect = () => { // Reconnect action
    // Set q to true if it's a global variable the game might check
    if (typeof q !== 'undefined') {
        window.q = true;
    }
    // Call the global game reconnect function if it exists
    if (typeof window.g === 'function') {
        window.g();
    } else {
        console.warn("window.g() not found. Reconnect functionality might not work.");
    }
  };


  // Create main menu buttons
  // Removed vVF3 ("Start Abyss Farming") as its functionality is now in Stats
  const vVF32 = vF3(`Darkness Remover: ${window.nebulaClientDarknessEnabled ? 'ON' : 'OFF'}`, vF5); // Updated button text and handler
  const vVF33 = vF3("Game status", vF4);
  const vVF34 = vF3("Settings", vF7);
  const vVF35 = vF3("Zoom Control", showZoomPage); // New Zoom Control button
  const vVF36 = vF3("Reconnect", vF_reconnect); // New Reconnect button

  // Append buttons to main menu container
  // v54.appendChild(vVF3); // Removed Abyss Farming button
  v54.appendChild(vVF32);
  v54.appendChild(vVF33);
  v54.appendChild(vVF34);
  v54.appendChild(vVF35);
  v54.appendChild(vVF36); // Add new Reconnect button
  v63.appendChild(v54); // Append main menu to client container

  // --- Settings Page ---
  const v75 = document.createElement("div");
  v75.id = "settings-container";
  v75.style.fontFamily = "Fredoka One, sans-serif";
  v75.innerHTML = `
    <div class="sub-page-header">
      <h4 class="sub-page-title">Settings</h4>
      <button class="sub-page-exit-btn">Exit</button>
    </div>
    <div class="settings-content-area">
      <!-- Font override toggle will be appended here by JS -->
    </div>
  `;
  v63.appendChild(v75);

  const settingsExitButton = v75.querySelector('.sub-page-exit-btn');
  const settingsContentArea = v75.querySelector('.settings-content-area');

  settingsExitButton.onclick = () => {
    hideAllClientContent();
    v54.style.display = "block";
  };

  // Font override toggle switch
  v.disabled = true; // Initially disable the font override style tag
  function f13(p25) { // Function to enable/disable the font style tag
    v.disabled = !p25;
  }
  const v80 = document.createElement("div"); // Container for font override toggle
  v80.style.textAlign = "left";
  v80.style.margin = "20px 0";
  v80.style.display = "flex";
  v80.style.alignItems = "center";
  v80.style.justifyContent = "center";
  const v81 = document.createElement("label");
  v81.innerText = "Override Font: ";
  v81.style.marginRight = "10px";
  v81.style.fontFamily = "Fredoka One, sans-serif";
  v81.style.color = "#ffffff";
  v81.style.fontSize = "16px";
  const v82 = document.createElement("div"); // Container for the switch itself
  v82.style.position = "relative";
  v82.style.display = "inline-block";
  v82.style.width = "40px";
  v82.style.height = "20px";
  v82.style.marginLeft = "10px";
  v82.style.cursor = "pointer";
  const v83 = document.createElement("input"); // Hidden checkbox for toggle state
  v83.type = "checkbox";
  v83.style.opacity = "0";
  v83.style.position = "absolute";
  v83.style.zIndex = "2";
  v83.style.width = "100%";
  v83.style.height = "100%";
  const v84 = document.createElement("span"); // Background track of the switch
  v84.style.position = "absolute";
  v84.style.top = "0";
  v84.style.left = "0";
    v84.style.right = "0";
  v84.style.bottom = "0";
  v84.style.marginTop = "-2px";
  v84.style.marginLeft = "-2px";
  v84.style.backgroundColor = "#777";
  v84.style.borderRadius = "20px";
  v84.style.transition = "0.4s";
  const v85 = document.createElement("span"); // Draggable thumb of the switch
  v85.style.position = "absolute";
  v85.style.height = "18px";
  v85.style.width = "18px";
    v85.style.backgroundColor = "#fff";
  v85.style.borderRadius = "50%";
  v85.style.transition = "0.4s";
  v85.style.zIndex = "1";
  const vF8 = () => { // Update switch visual based on checkbox state
    if (v83.checked) {
      v84.style.backgroundColor = "#4caf50";
      v85.style.transform = "translateX(20px)";
    } else {
      v84.style.backgroundColor = "#777";
      v85.style.transform = "translateX(0)";
    }
  };
  v83.addEventListener("change", p26 => {
    f13(p26.target.checked); // Toggle font style
    vF8(); // Update visual
  });
  vF8(); // Initial visual update
  v82.appendChild(v83);
  v82.appendChild(v84);
  v82.appendChild(v85);
  v80.appendChild(v81);
  v80.appendChild(v82);
  settingsContentArea.appendChild(v80); // Append font override toggle to settings content area

  // --- Utility function for time conversion (from Scenexe2 Utils) ---
  const convert = (n) => {
    let a = Math.floor(n / 1000);
    let b = Math.floor(a / 60);
    let c = a % 60;
    return `${b}m ${c}s`;
  };

  // --- Stats Page ---
  const v77 = document.createElement("div");
  v77.id = "stats-container";
  v77.style.fontFamily = "Fredoka One, sans-serif";
  v77.innerHTML = `
    <div class="sub-page-header">
      <h4 class="sub-page-title">Stats Page</h4>
      <button class="sub-page-exit-btn">Exit</button>
    </div>
    <div class="stats-content-area">
      <!-- Stats content and nav buttons will be appended here by JS -->
    </div>
  `;
  v63.appendChild(v77);

  const statsExitButton = v77.querySelector('.sub-page-exit-btn');
  const statsContentArea = v77.querySelector('.stats-content-area');

  statsExitButton.onclick = () => {
    hideAllClientContent();
    v54.style.display = "block";
    // When exiting stats, clear any active gate timer to prevent background updates
    clearInterval(v55);
    v55 = null;
    if (v89.parentElement) {
        v89.remove(); // Remove the timer display element
    }
  };

  const v87 = ["Player Counts", "Rare Spawns", "Gate Openings"]; // Categories for stats
  const v88 = document.createElement("div"); // Area to display fetched stats
  v88.style.margin = "10px 0";
  v88.style.fontSize = "16px";
  v88.style.padding = "10px";
  v88.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  v88.style.fontFamily = "Fredoka One, sans-serif";
  const v89 = document.createElement("div"); // Area to display gate opening timer
  v89.style.marginTop = "10px";
  v89.style.fontSize = "16px";
  v89.style.fontFamily = "Fredoka One, sans-serif";

  // Function to fetch and display stats from external APIs
  const vF9 = async () => {
    let v90; // API URL
    // Select API URL based on current stat category
    switch (v57) {
      case 0:
        v90 = "https://expandedwater.online:3000/api/messages/1117612925666996254"; // Player Counts
        break;
      case 1:
        v90 = "https://expandedwater.online:3000/api/messages/1187917859742027786"; // Rare Spawns
        break;
      case 2:
        v90 = "https://expandedwater.online:3000/api/messages/1221635977987100874"; // Gate Openings
        break;
    }
    try {
      const v91 = await fetch(v90); // Fetch data
      const v92 = await v91.json(); // Parse JSON response
      v88.innerText = vF10(v92); // Format and display data
    } catch (error) {
      v88.innerText = "Error loading data: " + error.message;
    }
  };
  setInterval(vF9, 10000); // Refresh stats every 10 seconds

  // Function to format fetched API data for display
  const vF10 = p27 => {
    if (!p27.length) {
      // Clear timer and remove element if no data or not in gate openings category
      if (v89.parentElement) {
        clearInterval(v55);
        v55 = null;
        v89.remove();
      }
      return "No data available.";
    }
    const v93 = p27[0]; // Get the first message object
    const v94 = v93.content; // Content of the message
    const v95 = v93.timestamp; // Timestamp of the message

    // Helper to clean up string formatting
    const vF11 = p28 => p28.replace(/^`|`$/g, "").replace(/\s*\{\s*/g, "").replace(/\}\s*$/, "").replace(/^\[\d{2}:\d{2}:\d{2}\]\s*/, "");

    // Function to extract rare spawn name (from original Scenexe2 Utils)
    const extractSpawnName = (c) => {
      const m = c.match(/\]\sSpawned\sa\s(.+?)!/);
      return m ? m[1] : null;
    };

    // Logic for Gate Opening countdown
    const vF12 = p29 => {
      const v96 = p29.match(/will open again in (\d+\.?\d*) (minutes|seconds)/);
      if (!v96) {
        return "Gate opening time not found.";
      }
      const [v97, v98, v99] = v96; // Destructure regex match
      const v100 = v99 === "minutes" ? parseFloat(v98) * 60 * 1000 : parseFloat(v98) * 1000; // Convert time to ms
      const v101 = new Date(v95); // Timestamp of message as Date object
      const v102 = Date.now() - v101.getTime(); // Time elapsed since message was sent
      const v103 = v100 - v102; // Remaining time until gate opens

      if (v103 <= 0) {
        v89.innerText = "Gate is open!"; // Update timer element
        clearInterval(v55); // Stop timer
        v55 = null;
        return;
      }
      // If a new, later gate opening time is detected, update the timer
      if (!v56 || v103 > v56 - Date.now()) { // Ensure new time is indeed later or timer not set
        v56 = Date.now() + v103; // Set target end time
        vF13(); // Start/restart countdown interval
      }
    };

    // Countdown interval for gate opening
    const vF13 = () => {
      // Clear existing interval to prevent multiple timers running
      if (v55) clearInterval(v55);
      v55 = setInterval(() => {
        const v104 = v56 - Date.now(); // Remaining time
        if (v104 <= 0) {
          clearInterval(v55); // Stop timer
          v55 = null;
          v89.innerText = "Gate is open!";
        } else {
          // Use the integrated convert function for better formatting
          v89.innerText = `${convert(v104)} until next gate opening`;
        }
      }, 1000); // Update every second
    };

    // Manage the gate timer display element based on current category
    if (v57 === 2) { // If currently on "Gate Openings"
      if (!v89.parentElement) {
        statsContentArea.appendChild(v89); // Append if not already present
      }
      vF12(v94); // Process gate opening data
    } else { // If not on "Gate Openings"
      if (v89.parentElement) {
        clearInterval(v55); // Stop any running timer
        v55 = null;
        v89.remove(); // Remove the element from DOM
      }
    }

    const vVF11 = vF11(v94); // Cleaned content string

    // Return formatted text based on category
    switch (v57) {
      case 0: // Player Counts
        // Handle both array and comma-separated string formats
        if (Array.isArray(v94)) {
          return v94.filter(p30 => !p30.name.toLowerCase().includes("sand")).map(p31 => vF11(p31.name) + ": " + vF11(p31.playerCount)).join("\n");
        } else {
          return v94.split(",").filter(p32 => !p32.toLowerCase().includes("sand")).map(vF11).join("\n");
        }
      case 1: // Rare Spawns
        const spawnedItem = extractSpawnName(v94);
        const elapsed = Date.now() - v95; // Timestamp from the API message
        return spawnedItem ? `${spawnedItem} (${convert(elapsed)} ago)` : vVF11;
      case 2: // Gate Openings (already handled by vF12/vF13, displays cleaned raw content for initial load)
        return vVF11; // Display cleaned raw content
      default:
        return "No data available.";
    }
  };

  // Navigation buttons for stats categories
  const vF14 = (p33, p34) => { // Function to create prev/next buttons
    const v107 = document.createElement("button");
    v107.innerText = p33 === "prev" ? "<" : ">";
    v107.style.width = "40px";
    v107.style.height = "40px";
    v107.style.border = "2px solid #000000";
    v107.style.borderRadius = "5px";
    v107.style.backgroundColor = "transparent";
    v107.style.color = "#ffcc00";
    v107.style.cursor = "pointer";
    v107.style.fontSize = "24px";
    v107.style.position = "absolute"; // Keep absolute for these, relative to stats-content-area
    v107.style.bottom = "20px";
    v107.style.margin = "0 5px";
    v107.style.display = "flex";
    v107.style.alignItems = "center";
    v107.style.justifyContent = "center";
    v107.style.transition = "background-color 0.3s, transform 0.3s";
    v107.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
    v107.style.transformOrigin = "center";
    if (p33 === "prev") {
      v107.style.left = "20px";
    } else {
      v107.style.right = "20px";
    }
    v107.onmouseover = () => {
      v107.style.backgroundColor = "rgba(255, 204, 0, 0.5)";
      v107.style.transform = "scale(1.1)";
    };
    v107.onmouseout = () => {
      v107.style.backgroundColor = "transparent";
      v107.style.transform = "scale(1)";
    };
    v107.onclick = p34;
    return v107;
  };
  v88.className = "stats-content"; // Assign CSS class for stats content
  const vVF14 = vF14("prev", () => { // Previous button handler
    v57 = (v57 - 1 + v87.length) % v87.length; // Cycle backward
    v88.innerText = ""; // Clear current display
    vF9(); // Load new stats
  });
  const vVF142 = vF14("next", () => { // Next button handler
    v57 = (v57 + 1) % v87.length; // Cycle forward
    v88.innerText = "";
    vF9();
  });

  // Append navigation elements to stats content area
  const v117 = document.createElement("div"); // Container for nav buttons
  v117.style.display = "flex";
  v117.style.justifyContent = "center";
  v117.style.marginTop = "10px";
  v117.appendChild(vVF14);
  v117.appendChild(vVF142);
  statsContentArea.appendChild(v117);
  statsContentArea.appendChild(v88); // Stats content display
  // v89 (gate timer) is appended within vF10 if needed

  // --- Client Repositioning and Keyboard Shortcuts ---
  const vF15 = () => { // Function to reposition the main client container
    const {
      innerWidth: currentWidth,
      innerHeight: currentHeight
    } = window;
    const targetX = currentWidth - v63.offsetWidth - v66; // v66 from right edge
    const targetY = (currentHeight - v63.offsetHeight) / 2; // Vertically center

    // Current position of client from its actual rendered position
    const currentClientRect = v63.getBoundingClientRect();
    const currentClientX = currentClientRect.left;
    const currentClientY = currentClientRect.top;

    const animationDuration = 500; // ms
    const animationSteps = 20;
    let currentStep = 0;

    // Ensure transform is off for direct pixel manipulation during animation
    v63.style.right = 'auto'; // Disable 'right' property if it was set
    v63.style.transform = 'none'; // Ensure no conflicting transforms

    const animateReposition = () => {
      currentStep++;
      const progress = Math.min(currentStep / animationSteps, 1); // Animation progress (0 to 1)

      v63.style.left = currentClientX + (targetX - currentClientX) * progress + "px";
      v63.style.top = currentClientY + (targetY - currentClientY) * progress + "px";

      if (progress < 1) {
        requestAnimationFrame(animateReposition);
      }
    };
    requestAnimationFrame(animateReposition);
  };

  document.addEventListener("keydown", p35 => {
    if (p35.key === "`") { // Backtick key as a modifier
      v58 = true; // Set flag
      return;
    }
    if (v58) { // If backtick was recently pressed
      if (p35.key.toLowerCase() === "p") { // 'p' key to hide/show
        v63.classList.toggle("hidden");
        if (v63.classList.contains("hidden")) {
          // If hiding, delay setting display:none to allow transition
          setTimeout(() => v63.style.display = "none", 500);
        } else {
          // If showing, immediately set display:block then let opacity transition
          v63.style.display = "block";
        }
      } else if (p35.key.toLowerCase() === "o") { // 'o' key to reposition
        vF15();
      }
      v58 = false; // Reset modifier flag after action
    }
  });
  document.addEventListener("keyup", p36 => {
    if (p36.key === "`") {
      // Reset modifier flag after a short delay to allow chained key presses
      setTimeout(() => v58 = false, 500);
    }
  });

  document.body.appendChild(v63); // Append main client container to the body
  window.addEventListener("load", vF15); // Initial positioning on page load
  window.addEventListener("resize", vF15); // Reposition client on window resize


  // --- Zoom Control Functionality ---
  let multiplier = 1.0; // Current zoom multiplier
  const minMul = 0.1; // Minimum zoom
  const maxMul = 2.0; // Maximum zoom
  const stepSize = 0.05; // Zoom step on scroll

  // Hook CanvasRenderingContext2D.prototype.scale to apply custom multiplier
  let trueScale = CanvasRenderingContext2D.prototype.scale;
  function patchedScale(x, y) {
    // Apply the global multiplier to the scaling factors
    return trueScale.call(this, x * multiplier, y * multiplier);
  }

  // Enforce the scale hook periodically
  function enforceScaleHook() {
    if (CanvasRenderingContext2D.prototype.scale !== patchedScale) {
      trueScale = CanvasRenderingContext2D.prototype.scale; // Store original scale if it changed
      CanvasRenderingContext2D.prototype.scale = patchedScale; // Apply patch
    }
  }

  // Force internal game camera values to match the zoom multiplier
  function forceInternalCameraValues() {
    for (const key in window) {
      try {
        const val = window[key];
        // Look for objects in window scope that have set/get methods and relate to 'camera'
        if (val && typeof val === 'object' && typeof val.set === 'function' && typeof val.get === 'function') {
          const name = key.toLowerCase();
          if (name.includes('camera') && !val._patchedByZoomMod) { // Avoid patching already patched objects
            val.set(multiplier); // Set initial camera value
            const originalSet = val.set; // Store original set method
            val.set = () => originalSet.call(val, multiplier); // Override set to always use our multiplier
            val.get = () => multiplier; // Override get to always return our multiplier
            val._patchedByZoomMod = true; // Mark as patched
          }
        }
      } catch (e) {
        // Suppress errors that might occur when inspecting window properties
      }
    }
  }

  // Periodically enforce the scale hook and force camera values
  setInterval(() => {
    enforceScaleHook();
    forceInternalCameraValues();
  }, 100); // Every 100ms

  // Mouse wheel event listener for zooming
  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey) return; // Ignore if Ctrl key is pressed (browser zoom)
    const delta = Math.sign(e.deltaY); // -1 for scroll up, 1 for scroll down
    // Adjust multiplier, clamping within min/max bounds
    multiplier = Math.max(minMul, Math.min(maxMul, multiplier - delta * stepSize));
    multiplier = Math.round(multiplier * 100) / 100; // Round to 2 decimal places
    updateZoomUI(); // Update the zoom UI display
  });

  // --- Zoom UI Integration within Client ---
  const v118 = document.createElement('div'); // New div for Zoom Page content
  v118.id = 'zoom-container';
  v118.style.fontFamily = 'Fredoka One, sans-serif'; // Apply font consistency
  v63.appendChild(v118); // Append to the main client container

  let zoomUIinitialized = false; // Flag to ensure UI is created only once

  function createZoomPageUI() {
    if (zoomUIinitialized) {
        updateZoomUI(); // Just update if already initialized
        return;
    }

    v118.innerHTML = `
      <div class="sub-page-header">
        <h4 class="sub-page-title">Zoom Control</h4>
        <button class="sub-page-exit-btn">Exit</button>
      </div>
      <div class="zoom-content-area">
        <div class="zoom-mod-controls">
          <div class="zoom-mod-slider-container">
            <input type="range" min="${minMul}" max="${maxMul}" step="${stepSize}" value="${multiplier}" class="zoom-mod-slider">
            <div class="zoom-mod-value">${multiplier.toFixed(2)}x</div>
          </div>
          <div class="zoom-mod-buttons">
            <button class="zoom-mod-btn" id="zoom-reset">Reset</button>
            <button class="zoom-mod-btn" id="zoom-max">Max</button>
          </div>
        </div>
        <div class="zoom-mod-status">Scroll to zoom. Current: <span>${multiplier.toFixed(2)}x</span></div>
      </div>
    `;

    const zoomExitButton = v118.querySelector('.sub-page-exit-btn');
    zoomExitButton.onclick = () => {
      hideAllClientContent();
      v54.style.display = "block"; // Show main menu
    };

    const slider = v118.querySelector('.zoom-mod-slider');
    const valueDisplay = v118.querySelector('.zoom-mod-value');
    const statusSpan = v118.querySelector('.zoom-mod-status span');

    // Event listener for slider input
    slider.addEventListener('input', () => {
      multiplier = parseFloat(slider.value);
      multiplier = Math.round(multiplier * 100) / 100;
      updateZoomUI();
    });

    // Event listener for Reset button
    v118.querySelector('#zoom-reset').addEventListener('click', () => {
      multiplier = 1.0;
      updateZoomUI();
    });

    // Event listener for Max button
    v118.querySelector('#zoom-max').addEventListener('click', () => {
      multiplier = maxMul;
      updateZoomUI();
    });

    // Function to update the zoom UI elements
    function updateZoomUI() {
      if (slider && valueDisplay && statusSpan) { // Ensure elements exist before updating
        slider.value = multiplier;
        valueDisplay.textContent = `${multiplier.toFixed(2)}x`;
        statusSpan.textContent = `${multiplier.toFixed(2)}x`;
      }
    }

    zoomUIinitialized = true; // Mark as initialized
    updateZoomUI(); // Initial UI update
  }

})();
