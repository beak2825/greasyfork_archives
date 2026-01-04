// ==UserScript==
// @name         Internet Roadtrip: Dark Souls Location Popup
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @author       joawatte19 + TotallyNotSamm
// @description  Dark Souls style location popup with customizable settings
// @match        https://neal.fun/internet-roadtrip/
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @icon
// @downloadURL https://update.greasyfork.org/scripts/538346/Internet%20Roadtrip%3A%20Dark%20Souls%20Location%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/538346/Internet%20Roadtrip%3A%20Dark%20Souls%20Location%20Popup.meta.js
// ==/UserScript==

(async () => {
  if (!IRF?.isInternetRoadtrip) return;

  const container = await IRF.vdom.container;

  // Settings with defaults
  const settings = {
    volume: 0.8,
    triggerType: 'neighborhood', // 'neighborhood', 'state', 'country'
    popupDuration: 3000,
    colors: {
      neighborhood: '#e3e2e0',
      state: '#ffd700',
      country: '#ff6b6b'
    },
    styles: {
      neighborhood: {
        fontSize: '4rem',
        textShadow: '0 0 8px rgba(0,0,0,0.6), 0 0 2px #ccc',
        borderBottom: '4px solid rgba(227,226,224,0.5)'
      },
      state: {
        fontSize: '5rem',
        textShadow: '0 0 12px rgba(255,215,0,0.8), 0 0 4px #ffd700',
        borderBottom: '6px solid rgba(255,215,0,0.7)',
        fontWeight: 'bold'
      },
      country: {
        fontSize: '6rem',
        textShadow: '0 0 16px rgba(255,107,107,0.9), 0 0 6px #ff6b6b',
        borderBottom: '8px solid rgba(255,107,107,0.8)',
        fontWeight: 'bold',
        letterSpacing: '0.1em'
      }
    }
  };

  // Load saved settings
  const loadSettings = async () => {
    settings.volume = await GM_getValue('ds_volume', 0.8);
    settings.triggerType = await GM_getValue('ds_triggerType', 'neighborhood');
    settings.popupDuration = await GM_getValue('ds_popupDuration', 3000);
    settings.colors.neighborhood = await GM_getValue('ds_color_neighborhood', '#e3e2e0');
    settings.colors.state = await GM_getValue('ds_color_state', '#ffd700');
    settings.colors.country = await GM_getValue('ds_color_country', '#ff6b6b');
  };

  await loadSettings();

  let lastLoc = {};
  let locationHistory = new Map(); // For polling/debouncing

  // Create IRF panel tab
  async function createSettingsTab() {
    const tab = await IRF.ui.panel.createTabFor(GM.info, {
      tabName: "Dark Souls"
    });


    // Create volume control
    const volumeDisplay = document.createElement('span');
    volumeDisplay.textContent = `${Math.round(settings.volume * 100)}%`;

    const volumeLabel = document.createElement('label');
    volumeLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #ccc;';
    volumeLabel.textContent = 'Volume: ';
    volumeLabel.appendChild(volumeDisplay);

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = settings.volume * 100;
    volumeSlider.className = IRF.ui.panel.styles.slider;
    volumeSlider.addEventListener('input', async () => {
      settings.volume = volumeSlider.value / 100;
      volumeDisplay.textContent = `${volumeSlider.value}%`;
      await GM_setValue('ds_volume', settings.volume);
    });

    // Create trigger type select
    const triggerLabel = document.createElement('label');
    triggerLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #ccc;';
    triggerLabel.textContent = 'Trigger Type:';

    const triggerSelect = document.createElement('select');
    triggerSelect.className = IRF.ui.panel.styles.select;
    triggerSelect.innerHTML = `
      <option value="neighborhood" ${settings.triggerType === 'neighborhood' ? 'selected' : ''}>Neighborhood Change</option>
      <option value="state" ${settings.triggerType === 'state' ? 'selected' : ''}>State Change</option>
      <option value="country" ${settings.triggerType === 'country' ? 'selected' : ''}>Country Change</option>
    `;
    triggerSelect.addEventListener('change', async () => {
      settings.triggerType = triggerSelect.value;
      await GM_setValue('ds_triggerType', settings.triggerType);
    });

    // Create duration control
    const durationDisplay = document.createElement('span');
    durationDisplay.textContent = `${settings.popupDuration / 1000}s`;

    const durationLabel = document.createElement('label');
    durationLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #ccc;';
    durationLabel.textContent = 'Duration: ';
    durationLabel.appendChild(durationDisplay);

    const durationSlider = document.createElement('input');
    durationSlider.type = 'range';
    durationSlider.min = '1000';
    durationSlider.max = '8000';
    durationSlider.step = '500';
    durationSlider.value = settings.popupDuration;
    durationSlider.className = IRF.ui.panel.styles.slider;
    durationSlider.addEventListener('input', async () => {
      settings.popupDuration = parseInt(durationSlider.value);
      durationDisplay.textContent = `${settings.popupDuration / 1000}s`;
      await GM_setValue('ds_popupDuration', settings.popupDuration);
    });

    // Create color controls
    const colorLabel = document.createElement('label');
    colorLabel.style.cssText = 'display: block; margin-bottom: 8px; color: #ccc;';
    colorLabel.textContent = 'Colors:';

    const colorGrid = document.createElement('div');
    colorGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;';

    ['neighborhood', 'state', 'country'].forEach(type => {
      const colorDiv = document.createElement('div');
      const colorSubLabel = document.createElement('label');
      colorSubLabel.style.cssText = 'font-size: 12px; color: #aaa;';
      colorSubLabel.textContent = type.charAt(0).toUpperCase() + type.slice(1) + ':';

      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = settings.colors[type];
      colorInput.style.cssText = 'width: 100%; height: 30px; border: none; border-radius: 4px;';
      colorInput.addEventListener('change', async () => {
        settings.colors[type] = colorInput.value;
        await GM_setValue(`ds_color_${type}`, settings.colors[type]);
      });

      colorDiv.appendChild(colorSubLabel);
      colorDiv.appendChild(colorInput);
      colorGrid.appendChild(colorDiv);
    });


    // Create test button
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Popup';
    testButton.style.cssText = 'width: 100%; padding: 8px; margin-top: 15px;';
    testButton.addEventListener('click', () => {
      const loc = container.state.currentLocation;

      // Determine what to show based on trigger type
      let locationText = 'Unknown Location';
      let popupType = 'neighborhood';

      if (loc) {
        switch (settings.triggerType) {
          case 'neighborhood':
            locationText = loc.neighborhood || 'Unknown Neighborhood';
            popupType = 'neighborhood';
            break;
          case 'state':
            locationText = loc.state || 'Unknown State';
            popupType = 'state';
            break;
          case 'country':
            locationText = loc.country || 'Unknown Country';
            popupType = 'country';
            break;
        }
      }

      showPopup(locationText, popupType);
    });

    // Add all elements to tab
    const createSection = (label, input) => {
      const section = document.createElement('div');
      section.style.marginBottom = '15px';
      section.appendChild(label);
      section.appendChild(input);
      return section;
    };

    tab.container.appendChild(createSection(volumeLabel, volumeSlider));
    tab.container.appendChild(createSection(triggerLabel, triggerSelect));
    tab.container.appendChild(createSection(durationLabel, durationSlider));

    const colorSection = document.createElement('div');
    colorSection.style.marginBottom = '15px';
    colorSection.appendChild(colorLabel);
    colorSection.appendChild(colorGrid);
    tab.container.appendChild(colorSection);

    tab.container.appendChild(testButton);
  }


  // Location tracking with debouncing
  function shouldShowPopup(field, value) {
    const now = Date.now();
    const key = `${field}:${value}`;
    const lastShown = locationHistory.get(key);

    console.log(`[DS Debounce] Checking ${key}, last shown: ${lastShown ? new Date(lastShown).toLocaleTimeString() : 'never'}`);

    // Don't show if same location was shown in last 10 minutes
    if (lastShown && (now - lastShown) < 600000) {
      const timeLeft = Math.round((600000 - (now - lastShown)) / 1000);
      console.log(`[DS Debounce] Blocked - ${timeLeft}s remaining`);
      return false;
    }

    locationHistory.set(key, now);
    console.log(`[DS Debounce] Allowed - showing popup`);

    // Clean up old entries (older than 15 minutes)
    for (const [historyKey, timestamp] of locationHistory.entries()) {
      if (now - timestamp > 900000) {
        locationHistory.delete(historyKey);
      }
    }

    return true;
  }

  function getFieldType(field) {
    if (field === 'neighborhood') return 'neighborhood';
    if (field === 'county') return 'neighborhood';
    if (field === 'state') return 'state';
    if (field === 'country') return 'country';
    return 'neighborhood';
  }

  const originalUpdateData = container.methods.updateData;
  
  container.state.updateData = new Proxy(originalUpdateData, {
    apply: (target, thisArg, args) => {
      const result = Reflect.apply(target, thisArg, args);

      const loc = container.state.currentLocation;

      // Only check fields based on trigger type setting
      let fields = [];
      switch (settings.triggerType) {
        case 'neighborhood':
          fields = ["neighborhood", "county"];
          break;
        case 'state':
          fields = ["state"];
          break;
        case 'country':
          fields = ["country"];
          break;
      }

      let changedField = null;
      for (const field of fields) {
        if (loc?.[field] && loc[field] !== lastLoc[field]) {
          changedField = field;
          break;
        }
      }

      const changedValue = changedField ? loc[changedField] : null;
      lastLoc = { ...loc };

      if (changedValue && shouldShowPopup(changedField, changedValue)) {
        const fieldType = getFieldType(changedField);
        showPopup(changedValue, fieldType);
      }

      return result;
    }
  });

  function showPopup(text, type = 'neighborhood') {
    const existing = document.getElementById("ds-location-popup");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "ds-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "#000",
      opacity: "0",
      zIndex: 9998,
      pointerEvents: "none",
      transition: "opacity 1.2s ease-in-out",
    });
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "0.4";
    });

    const popup = document.createElement("div");
    popup.id = "ds-location-popup";
    popup.textContent = text;

    // Base styles
    Object.assign(popup.style, {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%) scale(0.95)",
      color: settings.colors[type],
      fontFamily: "adobe-garamond-pro, Georgia, serif",
      whiteSpace: "nowrap",
      maxWidth: "90vw",
      userSelect: "none",
      zIndex: 9999,
      opacity: "0",
      textAlign: "center",
      lineHeight: "1.2",
      transition: "opacity 1.2s ease-in-out, transform 1.2s ease-in-out, top 1.2s ease-in-out, left 1.2s ease-in-out, font-size 1.2s ease-in-out",
      pointerEvents: "none",
      padding: "1rem",
      paddingBottom: "0.05rem",
      ...settings.styles[type]
    });

    document.body.appendChild(popup);

    // Play sound
    if (settings.volume > 0) {
      const audio = new Audio("https://media.vocaroo.com/mp3/1f7euqkLrXJs");
      audio.volume = settings.volume;
      audio.play().catch(() => {});
    }

    // Fade in
    requestAnimationFrame(() => {
      popup.style.opacity = "1";
      popup.style.transform = "translate(-50%, -50%) scale(1)";
    });

    // Fade out after popup duration
    setTimeout(() => {
      popup.style.opacity = "0";
      popup.style.transform = "translate(-50%, -50%) scale(1.05)";
      overlay.style.opacity = "0";
      setTimeout(() => {
        popup.remove();
        overlay.remove();
      }, 1500);
    }, settings.popupDuration);
  }

  // Initialize settings tab
  setTimeout(createSettingsTab, 0);

  // Manual trigger function. showDSLocationPopup(); 'neighborhood' 'state' 'country'
  const manualTriggers = {
    showDSLocationPopup: (testType = null) => {
      const loc = container.state.currentLocation;
      if (!loc) {
        console.warn("No location data available.");
        return;
      }

      const fields = ["neighborhood", "state", "country"];
      for (const field of fields) {
        if (loc[field]) {
          const fieldType = testType || getFieldType(field);
          showPopup(loc[field], fieldType);
          break;
        }
      }
    },

  };

  // Expose functions to global scope
  Object.assign(window, manualTriggers);

  // Also expose via unsafeWindow
  if (typeof unsafeWindow !== 'undefined') {
    Object.assign(unsafeWindow, manualTriggers);
  }

})();
