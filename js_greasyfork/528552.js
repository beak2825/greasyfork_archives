// ==UserScript==
// @name         WME EZRoad Mod
// @namespace    https://greasyfork.org/users/1087400
// @version      2.6.6
// @description  Easily update roads
// @author       https://greasyfork.org/en/users/1087400-kid4rm90s
// @include 	   /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      GNU GPL(v3)
// @connect      greasyfork.org
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @require      https://greasyfork.org/scripts/560385/code/WazeToastr.js

// @downloadURL https://update.greasyfork.org/scripts/528552/WME%20EZRoad%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/528552/WME%20EZRoad%20Mod.meta.js
// ==/UserScript==

/*Script modified from WME EZRoad (https://greasyfork.org/en/scripts/518381-wme-ezsegments) original author: Michaelrosstarr and thanks to him*/

(function main() {
  ('use strict');
  const updateMessage = `<strong>Version 2.6.6 - 2026-01-09:</strong><br>
    - Roundabouts are now excluded from geometry issue checks.<br>
    - Added configurable threshold distance input (0.1-10 meters, step: 0.1m, default: 2m).<br>
    - Threshold distance can be customized per user preference in settings.<br>
    - Fixed geometry issue marker positioning to prevent cropping at higher threshold values.<br>
    - Fixed issue where auto setting up segment city from connected segments could fail in some cases.<br>`;
  const scriptName = GM_info.script.name;
  const scriptVersion = GM_info.script.version;
  const downloadUrl = GM_info.script.downloadURL;
  const forumURL = 'https://greasyfork.org/scripts/528552-wme-ezroad-mod/feedback';
  let wmeSDK;

  const roadTypes = [
    { id: 1, name: 'Motorway', value: 3, shortcutKey: 'S+1' },
    { id: 2, name: 'Ramp', value: 4, shortcutKey: 'S+2' },
    { id: 3, name: 'Major Highway', value: 6, shortcutKey: 'S+3' },
    { id: 4, name: 'Minor Highway', value: 7, shortcutKey: 'S+4' },
    { id: 5, name: 'Primary Street', value: 2, shortcutKey: 'S+5' },
    { id: 6, name: 'Street', value: 1, shortcutKey: 'S+6' },
    { id: 7, name: 'Narrow Street', value: 22, shortcutKey: 'S+7' },
    { id: 8, name: 'Offroad', value: 8, shortcutKey: 'S+8' },
    { id: 9, name: 'Parking Road', value: 20, shortcutKey: 'S+9' },
    { id: 10, name: 'Private Road', value: 17, shortcutKey: 'S+0' },
    { id: 11, name: 'Ferry', value: 15, shortcutKey: 'A+1' },
    { id: 12, name: 'Railway', value: 18, shortcutKey: 'A+2' },
    { id: 13, name: 'Runway', value: 19, shortcutKey: 'A+3' },
    { id: 14, name: 'Foothpath', value: 5, shortcutKey: 'A+4' },
    { id: 15, name: 'Pedestrianised Area', value: 10, shortcutKey: 'A+5' },
    { id: 16, name: 'Stairway', value: 16, shortcutKey: 'A+6' },
  ];
  const defaultOptions = {
    roadType: 1,
    unpaved: false,
    setStreet: false,
    setStreetCity: false,
    setStreetState: false,
    autosave: false,
    setSpeed: 40,
    setLock: false,
    updateSpeed: false,
    copySegmentName: false,
    locks: roadTypes.map((roadType) => ({ id: roadType.id, lock: String(1) })),
    speeds: roadTypes.map((roadType) => ({ id: roadType.id, speed: 40 })),
    copySegmentAttributes: false,
    showSegmentLength: false,
    checkGeometryIssues: false,
    geometryIssueThreshold: 2,
    shortcutKey: 'g',
  };

  const locks = [
    { id: 1, value: '1' },
    { id: 2, value: '2' },
    { id: 3, value: '3' },
    { id: 4, value: '4' },
    { id: 5, value: '5' },
    { id: 6, value: '6' },
    { id: 'HRCS', value: 'HRCS' },
  ];

  const UserRankRequiredForGeometryFix = 3; // Minimum user rank required to use the geometry fix feature - only show for L3 and above (rank >= 2 in SDK)

  const log = (message) => {
    if (typeof message === 'string') {
      console.log('WME_EZRoads_Mod: ' + message);
    } else {
      console.log('WME_EZRoads_Mod: ', message);
    }
  };

  unsafeWindow.SDK_INITIALIZED.then(initScript);

  function initScript() {
    wmeSDK = getWmeSdk({
      scriptId: 'wme-ez-roads-mod',
      scriptName: 'EZ Roads Mod',
    });
    WME_EZRoads_Mod_bootstrap();
  }

  const getCurrentCountry = () => {
    return wmeSDK.DataModel.Countries.getTopCountry();
  };

  const getTopCity = () => {
    return wmeSDK.DataModel.Cities.getTopCity();
  };

  const getAllCities = () => {
    return wmeSDK.DataModel.Cities.getAll();
  };

  // --- NEW: Helper to get all connected segment IDs ---
  function getConnectedSegmentIDs(segmentId) {
    // Returns unique IDs of all segments connected to the given segment
    const segs = [...wmeSDK.DataModel.Segments.getConnectedSegments({ segmentId, reverseDirection: false }), ...wmeSDK.DataModel.Segments.getConnectedSegments({ segmentId, reverseDirection: true })];
    const ids = segs.map((segment) => segment.id);
    // Remove duplicates
    return [...new Set(ids)];
  }

  // --- NEW: Helper to get the first connected segment's address (recursively) ---
  function getFirstConnectedSegmentAddress(segmentId) {
    const nonMatches = [];
    const segmentIDsToSearch = [segmentId];
    const hasValidCity = (id) => {
      const addr = wmeSDK.DataModel.Segments.getAddress({ segmentId: id });
      // Check if address has a city and the city is not empty
      if (addr && addr.city && addr.city.id) {
        const city = wmeSDK.DataModel.Cities.getById({ cityId: addr.city.id });
        return city && !city.isEmpty;
      }
      return false;
    };
    while (segmentIDsToSearch.length > 0) {
      const startSegmentID = segmentIDsToSearch.pop();
      const connectedSegmentIDs = getConnectedSegmentIDs(startSegmentID);
      log(`Checking connected segments for segment ${startSegmentID}: ${connectedSegmentIDs.join(', ')}`);

      const hasValidCitySegmentId = connectedSegmentIDs.find(hasValidCity);
      if (hasValidCitySegmentId) {
        const addr = wmeSDK.DataModel.Segments.getAddress({ segmentId: hasValidCitySegmentId });
        log(`Found valid city in connected segment ${hasValidCitySegmentId}`);
        return addr;
      }
      nonMatches.push(startSegmentID);
      connectedSegmentIDs.forEach((segmentID) => {
        if (!nonMatches.includes(segmentID) && !segmentIDsToSearch.includes(segmentID)) {
          segmentIDsToSearch.push(segmentID);
        }
      });
    }
    log('No valid city found in any connected segments');
    return null;
  }

  // --- Helper to get the direction value from a segment for copying ---
  function getDirectionFromSegment(segment) {
    if (!segment) return null;
    if (segment.isTwoWay) return 'TWO_WAY';
    if (segment.isAtoB) return 'A_TO_B';
    if (segment.isBtoA) return 'B_TO_A';
    return null;
  }

  // --- Helper to copy all flag attributes from one segment to another ---
  function copyFlagAttributes(fromSegmentId, toSegmentId) {
    const fromSeg = wmeSDK.DataModel.Segments.getById({ segmentId: fromSegmentId });
    const toSeg = wmeSDK.DataModel.Segments.getById({ segmentId: toSegmentId });

    if (!fromSeg || !toSeg || !fromSeg.flagAttributes) {
      return;
    }

    const segPanel = openPanel;
    if (!segPanel) {
      log('Segment panel not available for flag attribute updates');
      return;
    }

    // Flag attribute mappings: { flagName: { selectorType, selector, checkedValue } }
    const flagMappings = {
      unpaved: { selectorType: 'checkbox', name: 'unpaved' },
    };

    for (let flagName in flagMappings) {
      const mapping = flagMappings[flagName];
      const fromValue = fromSeg.flagAttributes[flagName] === true;
      const toValue = toSeg.flagAttributes && toSeg.flagAttributes[flagName] === true;

      // Only update if values differ
      if (fromValue === toValue) {
        continue;
      }

      try {
        // Try to find and click the checkbox
        let checkboxFound = false;

        // Try method 1: wz-checkable-chip with icon
        const iconClass = flagName === 'unpaved' ? '.w-icon-unpaved-fill' : `.w-icon-${flagName.toLowerCase()}-fill`;
        const unpavedIcon = segPanel.querySelector(iconClass);
        if (unpavedIcon) {
          const chip = unpavedIcon.closest('wz-checkable-chip');
          if (chip) {
            chip.click();
            checkboxFound = true;
            log(`Updated flag attribute ${flagName} via chip`);
            continue;
          }
        }

        // Try method 2: wz-checkbox with name attribute
        const wzCheckbox = segPanel.querySelector(`wz-checkbox[name="${mapping.name}"]`);
        if (wzCheckbox) {
          const hiddenInput = wzCheckbox.querySelector(`input[type="checkbox"][name="${mapping.name}"]`);
          if (hiddenInput && hiddenInput.checked !== fromValue) {
            hiddenInput.click();
            checkboxFound = true;
            log(`Updated flag attribute ${flagName} via wz-checkbox`);
            continue;
          }
        }

        // Try method 3: regular checkbox
        const regularCheckbox = segPanel.querySelector(`input[type="checkbox"][name="${mapping.name}"]`);
        if (regularCheckbox && regularCheckbox.checked !== fromValue) {
          regularCheckbox.click();
          checkboxFound = true;
          log(`Updated flag attribute ${flagName} via regular checkbox`);
          continue;
        }

        if (!checkboxFound) {
          log(`Could not find UI element for flag attribute ${flagName}`);
        }
      } catch (e) {
        log(`Error updating flag attribute ${flagName}: ${e}`);
      }
    }
  }

  const saveOptions = (options) => {
    window.localStorage.setItem('WME_EZRoads_Mod_Options', JSON.stringify(options));
    // Note: We don't clear current preset here, we check for modifications instead
  };

  const getOptions = () => {
    const savedOptions = JSON.parse(window.localStorage.getItem('WME_EZRoads_Mod_Options')) || {};
    // Deep merge for locks and speeds arrays
    const mergeById = (defaults, saved, key) => {
      if (!Array.isArray(defaults)) return defaults;
      if (!Array.isArray(saved)) return defaults;
      return defaults.map((def) => {
        const found = saved.find((s) => s.id === def.id);
        return found ? { ...def, ...found } : def;
      });
    };
    const mergedLocks = mergeById(
      defaultOptions.locks,
      (savedOptions.locks || []).map((l) => ({ ...l, lock: String(l.lock) })),
      'locks'
    );
    const mergedSpeeds = mergeById(defaultOptions.speeds, savedOptions.speeds || [], 'speeds');
    return {
      ...defaultOptions,
      ...savedOptions,
      locks: mergedLocks,
      speeds: mergedSpeeds,
    };
  };

  const saveCustomPreset = (presetName) => {
    const options = getOptions();
    const presets = getCustomPresets();
    presets[presetName] = {
      locks: options.locks,
      speeds: options.speeds,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem('WME_EZRoads_Mod_CustomPresets', JSON.stringify(presets));
    // If we're saving the current preset, it's now in sync
    const currentPreset = getCurrentPresetName();
    if (currentPreset === presetName) {
      setCurrentPresetName(presetName); // Refresh to confirm it's current
    }
    return true;
  };

  const loadCustomPreset = (presetName) => {
    const presets = getCustomPresets();
    if (!presets[presetName]) return false;
    const options = getOptions();
    options.locks = presets[presetName].locks;
    options.speeds = presets[presetName].speeds;
    saveOptions(options);
    setCurrentPresetName(presetName);
    return true;
  };

  const deleteCustomPreset = (presetName) => {
    const presets = getCustomPresets();
    if (!presets[presetName]) return false;
    delete presets[presetName];
    window.localStorage.setItem('WME_EZRoads_Mod_CustomPresets', JSON.stringify(presets));
    // Clear current preset if we're deleting it
    if (getCurrentPresetName() === presetName) {
      setCurrentPresetName(null);
    }
    return true;
  };

  const getCustomPresets = () => {
    const presets = JSON.parse(window.localStorage.getItem('WME_EZRoads_Mod_CustomPresets')) || {};
    return presets;
  };

  const getCurrentPresetName = () => {
    return window.localStorage.getItem('WME_EZRoads_Mod_CurrentPreset') || null;
  };

  const setCurrentPresetName = (presetName) => {
    if (presetName) {
      window.localStorage.setItem('WME_EZRoads_Mod_CurrentPreset', presetName);
    } else {
      window.localStorage.removeItem('WME_EZRoads_Mod_CurrentPreset');
    }
  };

  const isCurrentPresetModified = () => {
    const currentPresetName = getCurrentPresetName();
    if (!currentPresetName) return false;

    const presets = getCustomPresets();
    const preset = presets[currentPresetName];
    if (!preset) {
      setCurrentPresetName(null);
      return false;
    }

    const currentOptions = getOptions();
    // Compare locks and speeds
    const locksMatch = JSON.stringify(currentOptions.locks) === JSON.stringify(preset.locks);
    const speedsMatch = JSON.stringify(currentOptions.speeds) === JSON.stringify(preset.speeds);

    return !(locksMatch && speedsMatch);
  };

  const WME_EZRoads_Mod_bootstrap = () => {
    if (!document.getElementById('edit-panel') || !wmeSDK.DataModel.Countries.getTopCountry()) {
      setTimeout(WME_EZRoads_Mod_bootstrap, 250);
      return;
    }

    if (wmeSDK.State.isReady) {
      WME_EZRoads_Mod_init();
    } else {
      wmeSDK.Events.once({ eventName: 'wme-ready' }).then(WME_EZRoads_Mod_init());
    }
  };

  let openPanel;

  const WME_EZRoads_Mod_init = () => {
    log('Initing');

    const options = getOptions();
    const shortcutId = 'EZRoad_Mod_QuickUpdate';
    // Only register if not already present
    if (!wmeSDK.Shortcuts.isShortcutRegistered({ shortcutId })) {
      registerShortcut(options.shortcutKey || 'g');
    }

    // --- ENHANCED: Add event listeners to each road-type chip for direct click handling ---
    // Global flag to suppress attribute copy when chip is clicked
    window.suppressCopySegmentAttributes = false;
    function addRoadTypeChipListeners() {
      const chipSelect = document.querySelector('.road-type-chip-select');
      if (!chipSelect) return;
      const chips = chipSelect.querySelectorAll('wz-checkable-chip');
      chips.forEach((chip) => {
        if (!chip._ezroadmod_listener) {
          chip._ezroadmod_listener = true;
          chip.addEventListener('click', function () {
            // Log every chip click for debugging
            log('Chip clicked: value=' + chip.getAttribute('value') + ', checked=' + chip.getAttribute('checked'));
            setTimeout(() => {
              // Only act if this chip is now the selected one (checked="")
              if (chip.getAttribute('checked') === '') {
                const rtValue = parseInt(chip.getAttribute('value'), 10);
                log('Detected chip selection, applying EZRoadMod logic for roadType value: ' + rtValue);
                if (isNaN(rtValue)) return;
                const options = getOptions();
                options.roadType = rtValue;
                saveOptions(options);
                if (typeof updateRoadTypeRadios === 'function') {
                  updateRoadTypeRadios(rtValue);
                }
                const selection = wmeSDK.Editing.getSelection();
                if (selection && selection.objectType === 'segment') {
                  wmeSDK.Editing.setSelection({ selection });
                }
                setTimeout(() => {
                  log('Calling handleUpdate() after chip click for roadType value: ' + rtValue);
                  window.suppressCopySegmentAttributes = true;
                  Promise.resolve(handleUpdate()).finally(() => {
                    window.suppressCopySegmentAttributes = false;
                  });
                }, 100);
              }
            }, 50);
          });
        }
      });
    }

    // Call after panel is available and after any UI changes that might re-render the chips
    setTimeout(addRoadTypeChipListeners, 1200);
    // Also call after every edit panel mutation to re-attach listeners
    // Observe the edit panel for segment changes and add the quick update button
    const roadObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const addedNode = mutation.addedNodes[i];
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            let editSegment = addedNode.querySelector('#segment-edit-general');
            if (editSegment) {
              openPanel = editSegment;
              const parentElement = editSegment.parentNode;
              if (!parentElement.querySelector('[data-ez-roadmod-button="true"]')) {
                log('Creating Quick Set Road button for this panel');
                const quickButton = document.createElement('wz-button');
                quickButton.setAttribute('type', 'button');
                quickButton.setAttribute('style', 'margin-bottom: 5px; width: 100%');
                quickButton.setAttribute('disabled', 'false');
                quickButton.setAttribute('data-ez-roadmod-button', 'true');
                quickButton.setAttribute('id', 'ez-roadmod-quick-button-' + Date.now()); // Unique ID using timestamp
                quickButton.classList.add('send-button', 'ez-comment-button');
                quickButton.textContent = 'Quick Update Segment';
                parentElement.insertBefore(quickButton, editSegment);
                quickButton.addEventListener('mousedown', () => handleUpdate());
                log('Button created for current panel');
              } else {
                log('This panel already has the button, skipping creation');
              }
              // Always re-attach chip listeners after panel mutation
              addRoadTypeChipListeners();
            }
          }
        }
      });
    });
    roadObserver.observe(document.getElementById('edit-panel'), {
      childList: true,
      subtree: true,
    });

    constructSettings();

    function updateRoadTypeRadios(newValue) {
      $(`input[name="defaultRoad"]`).each(function () {
        if (parseInt($(this).attr('data-road-value'), 10) === newValue) {
          $(this).prop('checked', true);
        } else {
          $(this).prop('checked', false);
        }
      });
    }

    // Register shortcut for each road type (move here, after handleUpdate is defined)
    roadTypes.forEach((rt) => {
      const shortcutId = `EZRoad_Mod_SelectRoadType_${rt.id}`;
      // Prevent duplicate shortcut registration
      if (!wmeSDK.Shortcuts.isShortcutRegistered({ shortcutId })) {
        try {
          wmeSDK.Shortcuts.createShortcut({
            callback: () => {
              const options = getOptions();
              options.roadType = rt.value;
              saveOptions(options);
              updateRoadTypeRadios(rt.value);
              if (WazeToastr?.Alerts) {
                WazeToastr.Alerts.success('EZRoads Mod', `Selected road type: <b>${rt.name}</b>`, false, false, 1500);
              }
            },
            description: `Select road type: ${rt.name}`,
            shortcutId,
            shortcutKeys: rt.shortcutKey,
          });
        } catch (e) {
          log(`Shortcut registration failed for ${rt.name}: ${e}`);
        }
      }
    });

    // Initialize segment length display layer
    initSegmentLengthLayer();

    // Inject Geometry Fix Button
    setInterval(addGeometryFixButton, 2000);

    log('Completed Init');
  };

  // ===== Geometry Quality Check Helper =====
  /**
   * Checks if any intermediate geometry nodes are too close to segment endpoints
   * @param {Object} segment - WME segment object
   * @param {number} thresholdMeters - Distance threshold in meters (default: 2)
   * @returns {Object} { hasIssue: boolean, details: Array }
   */
  function checkGeometryNodePlacement(segment, thresholdMeters = 2) {
    if (!segment || !segment.geometry || !segment.geometry.coordinates) {
      return { hasIssue: false, details: [] };
    }

    if (typeof turf === 'undefined') {
      log('ERROR: Turf.js is not loaded!');
      return { hasIssue: false, details: [] };
    }

    const coords = segment.geometry.coordinates;

    // Need at least 3 points (start, intermediate, end) to have geometry nodes
    if (coords.length < 3) {
      return { hasIssue: false, details: [] };
    }

    const nodeA = turf.point(coords[0]); // First coordinate (Node A)
    const nodeB = turf.point(coords[coords.length - 1]); // Last coordinate (Node B)
    const issues = [];

    // Check intermediate points (geometry nodes)
    for (let i = 1; i < coords.length - 1; i++) {
      const geometryNode = turf.point(coords[i]);

      // Calculate distance to Node A
      const distanceToA = turf.distance(geometryNode, nodeA, { units: 'meters' });
      if (distanceToA <= thresholdMeters) {
        issues.push({
          nodeIndex: i,
          distanceToA: distanceToA,
          distanceToB: null,
          closeTo: 'A',
          coordinates: coords[i],
        });
      }

      // Calculate distance to Node B
      const distanceToB = turf.distance(geometryNode, nodeB, { units: 'meters' });
      if (distanceToB <= thresholdMeters) {
        issues.push({
          nodeIndex: i,
          distanceToA: null,
          distanceToB: distanceToB,
          closeTo: 'B',
          coordinates: coords[i],
        });
      }
    }

    return {
      hasIssue: issues.length > 0,
      details: issues,
      segmentId: segment.id,
      totalGeometryNodes: coords.length - 2, // Exclude start and end
    };
  }

  // ===== Segment Length Display Functionality =====
  let segmentLengthContainer = null;
  let segmentLabelCache = []; // Cache segment data and label elements

  // Store last map bounds to detect changes
  let lastBounds = null;
  let lastZoom = null;
  let updateInterval = null;
  let isMapMoving = false;
  let updateFrameRequest = null;

  // Define helper functions first
  function clearSegmentLengthDisplay() {
    if (segmentLengthContainer) {
      segmentLengthContainer.innerHTML = '';
    }
    segmentLabelCache = [];
  }

  // Rebuild segment data and create new labels (expensive - only on zoom/data changes)
  function rebuildSegmentLengthDisplay() {
    const options = getOptions();

    // Update dashboard count if exists (even if hidden)
    const countBadge = document.getElementById('ezroad-geometry-error-count');

    if ((!options.showSegmentLength && !options.checkGeometryIssues) || !segmentLengthContainer) {
      if (countBadge) countBadge.style.display = 'none';
      return;
    }

    clearSegmentLengthDisplay();

    if (typeof turf === 'undefined') {
      log('ERROR: Turf.js is not loaded!');
      return;
    }

    let issueCount = 0;

    try {
      const currentZoom = wmeSDK.Map.getZoomLevel();
      if (currentZoom < 18) {
        if (countBadge) countBadge.style.display = 'none';
        return;
      }

      const allSegments = wmeSDK.DataModel.Segments.getAll();
      let extent = wmeSDK.Map.getMapExtent();

      if (!extent || !allSegments || allSegments.length === 0) {
        if (countBadge) countBadge.style.display = 'none';
        return;
      }

      const mapBounds = {
        west: extent[0],
        south: extent[1],
        east: extent[2],
        north: extent[3],
      };

      // Use a DocumentFragment to batch DOM insertions (Performance optimization)
      const fragment = document.createDocumentFragment();

      allSegments.forEach((segment) => {
        try {
          const geometry = segment.geometry;
          if (!geometry || !geometry.coordinates || geometry.coordinates.length < 2) {
            return;
          }

          // 1. Check for geometry issues (Priority)
          if (options.checkGeometryIssues) {
            // Skip roundabouts (segments that are part of a junction)
            if (segment.junctionId !== null) {
              return;
            }

            const geoResult = checkGeometryNodePlacement(segment, options.geometryIssueThreshold);
            if (geoResult.hasIssue) {
              geoResult.details.forEach((issue) => {
                // Check visibility
                if (issue.coordinates[0] < mapBounds.west || issue.coordinates[0] > mapBounds.east || issue.coordinates[1] < mapBounds.south || issue.coordinates[1] > mapBounds.north) {
                  return;
                }

                issueCount++;

                const pinDiv = document.createElement('div');
                pinDiv.innerHTML = '📍'; // Pin icon
                pinDiv.style.position = 'absolute';
                pinDiv.style.width = '30px';
                pinDiv.style.height = '30px';
                pinDiv.style.display = 'flex';
                pinDiv.style.alignItems = 'center';
                pinDiv.style.justifyContent = 'center';
                pinDiv.style.fontSize = '30px';
                pinDiv.style.pointerEvents = 'none';

                fragment.appendChild(pinDiv);

                segmentLabelCache.push({
                  lon: issue.coordinates[0],
                  lat: issue.coordinates[1],
                  labelDiv: pinDiv,
                  offsetX: 15, // Center of 30px
                  offsetY: 30, // Shift up (full height)
                });
              });
            }
          }

          // 2. Show Segment Length
          if (options.showSegmentLength) {
            const line = turf.lineString(geometry.coordinates);
            const lengthMeters = turf.length(line, { units: 'meters' });

            if (lengthMeters <= 20) {
              const midPointFeature = turf.along(line, lengthMeters / 2, { units: 'meters' });
              const midCoords = midPointFeature.geometry.coordinates;

              if (midCoords[0] >= mapBounds.west && midCoords[0] <= mapBounds.east && midCoords[1] >= mapBounds.south && midCoords[1] <= mapBounds.north) {
                // Create label element
                const labelDiv = document.createElement('div');
                labelDiv.style.position = 'absolute';
                labelDiv.style.width = '30px';
                labelDiv.style.height = '30px';
                labelDiv.style.borderRadius = '50%';
                labelDiv.style.backgroundColor = '#ff6600a1';
                labelDiv.style.display = 'flex';
                labelDiv.style.alignItems = 'center';
                labelDiv.style.justifyContent = 'center';
                labelDiv.style.color = 'white';
                labelDiv.style.fontSize = '12px';
                labelDiv.style.fontWeight = 'bold';
                labelDiv.style.pointerEvents = 'none';
                labelDiv.textContent = Math.round(lengthMeters);

                fragment.appendChild(labelDiv);

                segmentLabelCache.push({
                  lon: midCoords[0],
                  lat: midCoords[1],
                  labelDiv: labelDiv,
                  offsetX: 15,
                  offsetY: 35,
                });
              }
            }
          }
        } catch (err) {
          // Silent error handling
        }
      });

      // Batch append all elements to the DOM
      segmentLengthContainer.appendChild(fragment);

      // Update positions after creating labels
      updateSegmentLabelPositions();

      // Update badge count and icon color
      if (countBadge) {
        if (issueCount > 0 && options.checkGeometryIssues) {
          countBadge.value = issueCount;
          countBadge.style.display = 'inline-flex';

          // Update bug icon color to red when issues found
          const bugIcon = document.getElementById('ezroad-bug-icon');
          if (bugIcon) bugIcon.style.color = '#ff3333ff';
        } else {
          countBadge.style.display = 'none';

          // Update bug icon color to default blue when no issues
          const bugIcon = document.getElementById('ezroad-bug-icon');
          if (bugIcon) bugIcon.style.color = '#33CCFF';
        }
      }
    } catch (error) {
      log('Error rebuilding segment length display: ' + error.message);
    }
  }

  // Fast position update - only updates pixel positions of existing labels
  function updateSegmentLabelPositions() {
    if (!segmentLengthContainer || segmentLabelCache.length === 0) {
      return;
    }

    try {
      segmentLabelCache.forEach((cached) => {
        const pixel = wmeSDK.Map.getMapPixelFromLonLat({
          lonLat: { lon: cached.lon, lat: cached.lat },
        });

        if (pixel && typeof pixel.x === 'number' && typeof pixel.y === 'number') {
          const offX = cached.offsetX || 15;
          const offY = cached.offsetY || 35;
          cached.labelDiv.style.left = pixel.x - offX + 'px';
          cached.labelDiv.style.top = pixel.y - offY + 'px';
        }
      });
    } catch (err) {
      // Silent error handling
    }
  }

  // Poll for map changes and update display
  function checkAndUpdate() {
    // Do not update if map is currently moving
    if (typeof isMapMoving !== 'undefined' && isMapMoving) return;

    const options = getOptions();
    if (!options.showSegmentLength && !options.checkGeometryIssues) {
      if (segmentLengthContainer) segmentLengthContainer.style.display = 'none';
      return;
    } else {
      if (segmentLengthContainer) segmentLengthContainer.style.display = 'block';
    }

    try {
      let extent;
      let currentZoom;

      try {
        extent = wmeSDK.Map.getMapExtent();
        currentZoom = wmeSDK.Map.getZoomLevel();
      } catch (e) {
        return;
      }

      const currentBounds = {
        west: extent[0],
        south: extent[1],
        east: extent[2],
        north: extent[3],
      };

      // Check if map has moved or zoomed
      if (!lastBounds || lastBounds.north !== currentBounds.north || lastBounds.south !== currentBounds.south || lastBounds.east !== currentBounds.east || lastBounds.west !== currentBounds.west || lastZoom !== currentZoom) {
        lastBounds = currentBounds;
        lastZoom = currentZoom;
        rebuildSegmentLengthDisplay();
      }
    } catch (e) {}
  }

  function handleSegmentLengthToggle() {
    const options = getOptions();

    // Update button visibility immediately on toggle
    addGeometryFixButton();

    if (options.showSegmentLength || options.checkGeometryIssues) {
      if (segmentLengthContainer) segmentLengthContainer.style.display = 'block';

      // Ensure polling is active
      if (!updateInterval) {
        updateInterval = setInterval(checkAndUpdate, 500);
      }
      rebuildSegmentLengthDisplay();
    } else {
      if (segmentLengthContainer) segmentLengthContainer.style.display = 'none';
      clearSegmentLengthDisplay();

      // Stop polling
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
    }
  }

  function initSegmentLengthLayer() {
    log('Initializing segment length display layer');

    // Find viewport div - prefer standard class or ID
    // Try SDK method first if possible, though getMapViewportElement might not be exposed on all versions?
    // Docs say getMapViewportElement() returns HTMLElement.
    let viewportDiv;
    try {
      viewportDiv = wmeSDK.Map.getMapViewportElement();
    } catch (e) {
      log('SDK getMapViewportElement failed, trying fallbacks');
    }

    if (!viewportDiv) {
      viewportDiv = document.querySelector('.ol-viewport') || document.querySelector('#WazeMap') || document.querySelector('#map');
    }

    if (!viewportDiv) {
      log('Map viewport not found');
      return;
    }

    // Create div container for length labels
    segmentLengthContainer = document.createElement('div');
    segmentLengthContainer.id = 'ezroad-segment-length-container';
    segmentLengthContainer.style.position = 'absolute';
    segmentLengthContainer.style.top = '0';
    segmentLengthContainer.style.left = '0';
    segmentLengthContainer.style.width = '100%';
    segmentLengthContainer.style.height = '100%';
    segmentLengthContainer.style.pointerEvents = 'none';
    segmentLengthContainer.style.zIndex = '1000';
    segmentLengthContainer.style.display = 'none'; // Hidden by default

    viewportDiv.appendChild(segmentLengthContainer);
    log('Container appended to map viewport');

    // Variables are now defined in outer scope to allow access from handleSegmentLengthToggle
    // lastBounds, lastZoom, updateInterval, isMapMoving, updateFrameRequest

    // Event handlers for map movement using SDK events
    const onMapMove = function () {
      isMapMoving = true;
      // Use requestAnimationFrame to throttle position updates during map movement
      if (updateFrameRequest) {
        return; // Already scheduled
      }

      updateFrameRequest = requestAnimationFrame(() => {
        updateFrameRequest = null;
        const options = getOptions();
        if ((options.showSegmentLength || options.checkGeometryIssues) && segmentLengthContainer && segmentLengthContainer.style.display !== 'none') {
          updateSegmentLabelPositions(); // Fast position update only
        }
      });
    };

    const onMoveEnd = function () {
      isMapMoving = false;
      // Rebuild labels after movement ends (checks if segments entered/left viewport)
      const options = getOptions();
      if ((options.showSegmentLength || options.checkGeometryIssues) && segmentLengthContainer) {
        segmentLengthContainer.style.display = 'block';
        rebuildSegmentLengthDisplay();

        // Update lastBounds/Zoom to prevent redundant update from interval
        try {
          let extent = wmeSDK.Map.getMapExtent();
          lastBounds = {
            west: extent[0],
            south: extent[1],
            east: extent[2],
            north: extent[3],
          };
          lastZoom = wmeSDK.Map.getZoomLevel();
        } catch (e) {}
      }
    };

    const onZoomChanged = function () {
      const options = getOptions();
      if ((options.showSegmentLength || options.checkGeometryIssues) && segmentLengthContainer) {
        rebuildSegmentLengthDisplay(); // Full rebuild on zoom
        try {
          let extent = wmeSDK.Map.getMapExtent();
          lastBounds = {
            west: extent[0],
            south: extent[1],
            east: extent[2],
            north: extent[3],
          };
          lastZoom = wmeSDK.Map.getZoomLevel();
        } catch (e) {}
      }
    };

    // Register SDK event listeners
    wmeSDK.Events.on({
      eventName: 'wme-map-move',
      eventHandler: onMapMove,
    });

    wmeSDK.Events.on({
      eventName: 'wme-map-move-end',
      eventHandler: onMoveEnd,
    });

    wmeSDK.Events.on({
      eventName: 'wme-map-zoom-changed',
      eventHandler: onZoomChanged,
    });

    // Initialize polling if already enabled
    const options = getOptions();
    if (options.showSegmentLength || options.checkGeometryIssues) {
      handleSegmentLengthToggle();
    }

    log('Segment length layer initialized');
  }
  // ===== End Segment Length Display Functionality =====

  // Helper to register the shortcut, avoids duplicate code
  function registerShortcut(shortcutKey) {
    if (!wmeSDK?.Shortcuts) return;
    const shortcutId = 'EZRoad_Mod_QuickUpdate';
    // Always delete before creating to avoid duplicates
    if (wmeSDK.Shortcuts.isShortcutRegistered({ shortcutId })) {
      wmeSDK.Shortcuts.deleteShortcut({ shortcutId });
    }
    try {
      wmeSDK.Shortcuts.createShortcut({
        callback: handleUpdate,
        description: 'Quick Update Segments.',
        shortcutId,
        shortcutKeys: shortcutKey,
      });
      console.log(`[EZRoads Mod] Shortcut '${shortcutKey}' for Quick Update Segments enabled.`);
    } catch (e) {
      // If shortcut registration fails (e.g., conflict), register with no key so it appears in WME UI
      console.warn('[EZRoads Mod] Shortcut registration failed:', e);
      try {
        wmeSDK.Shortcuts.createShortcut({
          callback: handleUpdate,
          description: 'Quick Update Segments.',
          shortcutId,
          shortcutKeys: null, // Register with no key so it appears in WME UI
        });
        console.log('[EZRoads Mod] Registered shortcut with no key due to conflict.');
      } catch (e2) {
        console.error('[EZRoads Mod] Failed to register shortcut with no key:', e2);
      }
      const options = getOptions();
      options.shortcutKey = null;
      saveOptions(options);
    }
  }

  // ===== New Feature: One-click Geometry Fix =====

  async function fixVisibleGeometryIssues() {
    const options = getOptions();
    if (!options.checkGeometryIssues) {
      if (WazeToastr?.Alerts) WazeToastr.Alerts.info('EZRoad Mod', 'Please enable "Check Geometry issues" in settings first.');
      else alert('Please enable "Check Geometry issues" in EZRoad Mod settings first.');
      return;
    }

    const allSegments = wmeSDK.DataModel.Segments.getAll();
    let extent = wmeSDK.Map.getMapExtent();
    if (!extent) return;
    const mapBounds = { west: extent[0], south: extent[1], east: extent[2], north: extent[3] };

    let fixedCount = 0;
    let errors = 0;
    let totalIssueCount = 0;

    // Filter for segments with issues in view
    const segmentsToFix = allSegments.filter((segment) => {
      if (!segment.geometry) return false;

      // Skip roundabouts (segments that are part of a junction)
      if (segment.junctionId !== null) return false;

      // Check functionality
      const result = checkGeometryNodePlacement(segment, options.geometryIssueThreshold);
      if (!result.hasIssue) return false;

      // Initial visibility check of issues
      const visibleIssues = result.details.filter((issue) => issue.coordinates[0] >= mapBounds.west && issue.coordinates[0] <= mapBounds.east && issue.coordinates[1] >= mapBounds.south && issue.coordinates[1] <= mapBounds.north);

      if (visibleIssues.length > 0) {
        totalIssueCount += visibleIssues.length;
        return true;
      }
      return false;
    });

    if (segmentsToFix.length === 0) {
      if (WazeToastr?.Alerts) WazeToastr.Alerts.error('EZRoad Mod', 'No visible geometry issues to fix.');
      else alert('No visible geometry issues to fix.');
      return;
    }

    const performFix = async () => {
      let fixedIssueCount = 0;
      for (const segment of segmentsToFix) {
        try {
          const result = checkGeometryNodePlacement(segment, options.geometryIssueThreshold); // Recalculate to be safe
          if (!result.hasIssue) continue;

          const idxToRemove = new Set(result.details.map((d) => d.nodeIndex));
          const oldCoords = segment.geometry.coordinates;
          const newCoords = oldCoords.filter((_, i) => !idxToRemove.has(i));

          if (newCoords.length < 2) continue; // Should not happen for geometry nodes, but safety

          await wmeSDK.DataModel.Segments.updateSegment({
            segmentId: segment.id,
            geometry: {
              type: 'LineString',
              coordinates: newCoords,
            },
          });
          fixedCount++;
          fixedIssueCount += result.details.length;
        } catch (e) {
          console.error('Failed to fix segment', segment.id, e);
          errors++;
        }
      }

      const msg = fixedIssueCount === fixedCount ? `Fixed ${fixedCount} segments.${errors > 0 ? ` (${errors} errors)` : ''}` : `Fixed ${fixedCount} segments with ${fixedIssueCount} geometry node issues.${errors > 0 ? ` (${errors} errors)` : ''}`;
      if (WazeToastr?.Alerts) WazeToastr.Alerts.success('EZRoad Mod', msg);
      else alert(msg);

      // Refresh display
      rebuildSegmentLengthDisplay();
    };

    const confirmMsg = totalIssueCount === segmentsToFix.length ? `Found ${segmentsToFix.length} segments with geometry issues. Fix them now?` : `Found ${segmentsToFix.length} segments with ${totalIssueCount} geometry node issues. Fix them now?`;

    if (WazeToastr?.Alerts?.confirm) {
      WazeToastr.Alerts.confirm('EZRoad Mod', confirmMsg, performFix, null, 'Fix', 'Cancel');
    } else if (confirm(confirmMsg)) {
      performFix();
    }
  }

  function addGeometryFixButton() {
    const options = getOptions();

    // Check user rank - only show for L3 and above (rank >= 2 in SDK)
    const userInfo = wmeSDK.State.getUserInfo();
    if (!userInfo || userInfo.rank < UserRankRequiredForGeometryFix - 1) {
      // Remove button if it exists and user doesn't have permission
      const existingBtn = document.getElementById('ezroad-fix-geometry-btn');
      if (existingBtn) existingBtn.remove();
      return;
    }

    const prefsItem = document.querySelector('wz-navigation-item[data-for="prefs"]');
    let btn = document.getElementById('ezroad-fix-geometry-btn');

    if (btn) {
      // Update visibility based on option and rank
      btn.style.display = options.checkGeometryIssues ? 'block' : 'none';
      return;
    }

    if (!prefsItem) return;

    btn = document.createElement('wz-button');
    btn.color = 'text';
    btn.size = 'sm';
    btn.style.margin = '20px auto 0 auto';
    btn.id = 'ezroad-fix-geometry-btn';
    btn.type = 'button';

    // Initial visibility based on option
    btn.style.display = options.checkGeometryIssues ? 'block' : 'none';

    // HTML content matching user request style
    btn.innerHTML = `
        <i class="w-icon w-icon-bug-fill" id="ezroad-bug-icon" style="color: #33CCFF"></i>
        <wz-notification-indicator value="0" id="ezroad-geometry-error-count" class="counter" style="display: none;"></wz-notification-indicator>
     `;

    btn.addEventListener('click', fixVisibleGeometryIssues);

    // Insert after prefs
    prefsItem.insertAdjacentElement('afterend', btn);
  }

  const getEmptyCity = () => {
    return (
      wmeSDK.DataModel.Cities.getCity({
        cityName: '',
        countryId: getCurrentCountry().id,
      }) ||
      wmeSDK.DataModel.Cities.addCity({
        cityName: '',
        countryId: getCurrentCountry().id,
      })
    );
  };

  const delayedUpdate = (updateFn, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        updateFn();
        resolve();
      }, delay);
    });
  };

  function getHighestSegLock(segID) {
    const segObj = wmeSDK.DataModel.Segments.getById({ segmentId: segID });
    if (!segObj) {
      console.warn(`Segment object with ID ${segID} not found in DataModel.Segments.`);
      return 1; // Default lock level if segment not found
    }
    const segType = segObj.roadType;
    const checkedSegs = [];
    let forwardLock = null;
    let reverseLock = null;

    function processForNode(forwardID) {
      checkedSegs.push(forwardID);
      const seg = wmeSDK.DataModel.Segments.getById({ segmentId: forwardID });
      if (!seg) return forwardLock;
      const forNodeId = seg.toNodeId;
      if (!forNodeId) return forwardLock;

      // Get all segments connected to this node
      const allSegs = wmeSDK.DataModel.Segments.getAll();
      const forNodeSegs = allSegs.filter((s) => s.fromNodeId === forNodeId || s.toNodeId === forNodeId).map((s) => s.id);

      // Remove the current segment from the list
      const filteredSegs = forNodeSegs.filter((id) => id !== forwardID);

      for (let i = 0; i < filteredSegs.length; i++) {
        const conSegObj = wmeSDK.DataModel.Segments.getById({
          segmentId: filteredSegs[i],
        });
        if (!conSegObj) continue;
        if (conSegObj.roadType !== segType) {
          forwardLock = Math.max(conSegObj.lockRank ?? 0, forwardLock ?? 0);
        } else {
          if (!checkedSegs.includes(conSegObj.id)) {
            const tempRank = processForNode(conSegObj.id);
            forwardLock = Math.max(tempRank ?? 0, forwardLock ?? 0);
          }
        }
      }
      return forwardLock ?? 0;
    }

    function processRevNode(reverseID) {
      checkedSegs.push(reverseID);
      const seg = wmeSDK.DataModel.Segments.getById({ segmentId: reverseID });
      if (!seg) return reverseLock;
      const revNodeId = seg.fromNodeId;
      if (!revNodeId) return reverseLock;

      // Get all segments connected to this node
      const allSegs = wmeSDK.DataModel.Segments.getAll();
      const revNodeSegs = allSegs.filter((s) => s.fromNodeId === revNodeId || s.toNodeId === revNodeId).map((s) => s.id);

      // Remove the current segment from the list
      const filteredSegs = revNodeSegs.filter((id) => id !== reverseID);

      for (let i = 0; i < filteredSegs.length; i++) {
        const conSegObj = wmeSDK.DataModel.Segments.getById({
          segmentId: filteredSegs[i],
        });
        if (!conSegObj) continue;
        if (conSegObj.roadType !== segType) {
          reverseLock = Math.max(conSegObj.lockRank ?? 0, reverseLock ?? 0);
        } else {
          if (!checkedSegs.includes(conSegObj.id)) {
            const tempRank = processRevNode(conSegObj.id);
            reverseLock = Math.max(tempRank ?? 0, reverseLock ?? 0);
          }
        }
      }
      return reverseLock ?? 0;
    }

    let calculatedLock = Math.max(processForNode(segID), processRevNode(segID));
    return Math.min(calculatedLock, 6); // Limit to L6
  }

  function pushCityNameAlert(cityId, alertMessageParts) {
    let cityName = '';
    if (cityId) {
      const city = wmeSDK.DataModel.Cities.getById({ cityId });
      cityName = city && city.name ? city.name : '';
    }
    alertMessageParts.push(`City Name: <b>${cityName || 'None'}</b>`);
  }

  // Helper: Returns true if the roadType is Footpath, Pedestrianised Area, or Stairway
  function isPedestrianType(roadType) {
    return [5, 10, 16].includes(roadType);
  }

  // Helper: If switching between pedestrian and non-pedestrian types, delete and recreate the segment
  function recreateSegmentIfNeeded(segmentId, targetRoadType, copyConnectedNameData) {
    const seg = wmeSDK.DataModel.Segments.getById({ segmentId });
    if (!seg) return segmentId;

    const currentIsPed = isPedestrianType(seg.roadType);
    const targetIsPed = isPedestrianType(targetRoadType);

    if (currentIsPed !== targetIsPed) {
      // Show confirmation dialog before swapping
      let swapMsg = currentIsPed
        ? 'You are about to convert a Pedestrian type segment (Footpath, Pedestrianised Area, or Stairway) to a regular street type. This will delete and recreate the segment. Continue?'
        : 'You are about to convert a regular street segment to a Pedestrian type (Footpath, Pedestrianised Area, or Stairway). This will delete and recreate the segment. Continue?';
      if (!window.confirm(swapMsg)) {
        return null; // Cancel operation
      }
      // Save geometry and address
      const geometry = seg.geometry;
      const oldPrimaryStreetId = seg.primaryStreetId;
      const oldAltStreetIds = seg.alternateStreetIds;

      try {
        wmeSDK.DataModel.Segments.deleteSegment({ segmentId });
      } catch (ex) {
        if (ex instanceof wmeSDK.Errors.InvalidStateError) {
          if (WazeToastr?.Alerts) {
            WazeToastr.Alerts.error('EZRoads Mod Beta', 'Segment could not be deleted. Please check for restrictions or junctions.');
          }
          return null;
        }
      }

      // Create new segment
      const newSegmentId = wmeSDK.DataModel.Segments.addSegment({ geometry, roadType: targetRoadType });

      // Ensure primaryStreetId is valid (not null or undefined)
      let validPrimaryStreetId = oldPrimaryStreetId;
      if (!validPrimaryStreetId) {
        // Use a blank street in the current city
        let segCityId = getTopCity()?.id;
        if (!segCityId) {
          // fallback to country if city is not available
          segCityId = getCurrentCountry()?.id;
        }
        let blankStreet = wmeSDK.DataModel.Streets.getStreet({
          cityId: segCityId,
          streetName: '',
        });
        if (!blankStreet) {
          blankStreet = wmeSDK.DataModel.Streets.addStreet({
            streetName: '',
            cityId: segCityId,
          });
        }
        validPrimaryStreetId = blankStreet.id;
      }

      // Restore address with valid primaryStreetId
      wmeSDK.DataModel.Segments.updateAddress({
        segmentId: newSegmentId,
        primaryStreetId: validPrimaryStreetId,
        alternateStreetIds: oldAltStreetIds,
      });

      // If we have connected segment name data to copy, apply it now
      if (copyConnectedNameData && copyConnectedNameData.primaryStreetId) {
        wmeSDK.DataModel.Segments.updateAddress({
          segmentId: newSegmentId,
          primaryStreetId: copyConnectedNameData.primaryStreetId,
          alternateStreetIds: copyConnectedNameData.alternateStreetIds || [],
        });
      }

      // Reselect new segment
      wmeSDK.Editing.setSelection({ selection: { ids: [newSegmentId], objectType: 'segment' } });

      return newSegmentId;
    }
    return segmentId;
  }

  const handleUpdate = () => {
    const selection = wmeSDK.Editing.getSelection();

    if (!selection || selection.objectType !== 'segment') return;

    log('Updating RoadType');
    const options = getOptions();
    let alertMessageParts = [];
    let updatedRoadType = false;
    let updatedLockLevel = false;
    let updatedSpeedLimit = false;
    let updatedPaved = false;
    let updatedCityName = false;
    let updatedSegmentName = false;
    const updatePromises = [];

    // If copySegmentAttributes is checked, copy all attributes from a connected segment
    if (options.copySegmentAttributes && !window.suppressCopySegmentAttributes) {
      selection.ids.forEach((id) => {
        updatePromises.push(
          delayedUpdate(() => {
            try {
              const seg = wmeSDK.DataModel.Segments.getById({ segmentId: id });
              const fromNode = seg.fromNodeId;
              const connectedSegIds = getConnectedSegmentIDs(id);
              // Gather all segments connected to fromNode (excluding self)
              const fromNodeSegs = connectedSegIds.map((sid) => wmeSDK.DataModel.Segments.getById({ segmentId: sid })).filter((s) => s && (s.fromNodeId === fromNode || s.toNodeId === fromNode) && s.id !== id);
              // Prefer the first fromNode segment with a valid primary street name (and optionally other attributes)
              let preferredSeg = fromNodeSegs.find((s) => {
                if (!s) return false;
                const street = wmeSDK.DataModel.Streets.getById({ streetId: s.primaryStreetId });
                return street && street.name;
              });
              let segsToTry = [];
              if (preferredSeg) {
                segsToTry.push(preferredSeg.id);
                // Add the rest, excluding preferredSeg.id
                segsToTry = segsToTry.concat(connectedSegIds.filter((cid) => cid !== preferredSeg.id));
              } else {
                segsToTry = connectedSegIds;
              }
              let found = false;
              for (let connectedSegId of segsToTry) {
                const connectedSeg = wmeSDK.DataModel.Segments.getById({ segmentId: connectedSegId });
                if (!connectedSeg) continue;
                const street = wmeSDK.DataModel.Streets.getById({ streetId: connectedSeg.primaryStreetId });
                if (street && street.name) {
                  try {
                    wmeSDK.DataModel.Segments.updateSegment({
                      segmentId: id,
                      fwdSpeedLimit: connectedSeg.fwdSpeedLimit,
                      revSpeedLimit: connectedSeg.revSpeedLimit,
                      roadType: connectedSeg.roadType,
                      lockRank: connectedSeg.lockRank,
                      elevationLevel: connectedSeg.elevationLevel,
                      direction: getDirectionFromSegment(connectedSeg),
                    });
                  } catch (updateError) {
                    log('updateSegment error (will retry with individual properties): ' + updateError);
                    // Fallback: try updating properties individually
                    const propsToTry = [
                      { name: 'fwdSpeedLimit', value: connectedSeg.fwdSpeedLimit },
                      { name: 'revSpeedLimit', value: connectedSeg.revSpeedLimit },
                      { name: 'roadType', value: connectedSeg.roadType },
                      { name: 'lockRank', value: connectedSeg.lockRank },
                      { name: 'elevationLevel', value: connectedSeg.elevationLevel },
                      { name: 'direction', value: getDirectionFromSegment(connectedSeg) },
                    ];
                    for (let prop of propsToTry) {
                      try {
                        if (prop.value !== undefined && prop.value !== null) {
                          const updateObj = { segmentId: id };
                          updateObj[prop.name] = prop.value;
                          wmeSDK.DataModel.Segments.updateSegment(updateObj);
                        }
                      } catch (e) {
                        log(`Failed to update ${prop.name}: ` + e);
                      }
                    }
                  }
                  try {
                    wmeSDK.DataModel.Segments.updateAddress({
                      segmentId: id,
                      primaryStreetId: connectedSeg.primaryStreetId,
                      alternateStreetIds: connectedSeg.alternateStreetIds || [],
                    });
                  } catch (addrError) {
                    log('updateAddress error: ' + addrError);
                  }
                  // Copy all flag attributes
                  copyFlagAttributes(connectedSeg.id, id);
                  alertMessageParts.push(`Copied all attributes from connected segment.`);
                  found = true;
                  break;
                }
              }
              // If no connected segment with valid street name was found, fallback to any connected segment (like the other logic)
              if (!found) {
                let fallbackSegId = null;
                const segObj = wmeSDK.DataModel.Segments.getById({ segmentId: id });
                const fromNode = segObj.fromNodeId;
                const toNode = segObj.toNodeId;
                const allSegs = wmeSDK.DataModel.Segments.getAll();
                for (let s of allSegs) {
                  if (s.id !== id && (s.fromNodeId === fromNode || s.toNodeId === fromNode || s.fromNodeId === toNode || s.toNodeId === toNode)) {
                    fallbackSegId = s.id;
                    break;
                  }
                }
                if (fallbackSegId) {
                  const connectedSeg = wmeSDK.DataModel.Segments.getById({ segmentId: fallbackSegId });
                  try {
                    wmeSDK.DataModel.Segments.updateSegment({
                      segmentId: id,
                      fwdSpeedLimit: connectedSeg.fwdSpeedLimit,
                      revSpeedLimit: connectedSeg.revSpeedLimit,
                      roadType: connectedSeg.roadType,
                      lockRank: connectedSeg.lockRank,
                      elevationLevel: connectedSeg.elevationLevel,
                      direction: getDirectionFromSegment(connectedSeg),
                    });
                  } catch (updateError) {
                    log('updateSegment error in fallback (will retry with individual properties): ' + updateError);
                    // Fallback: try updating properties individually
                    const propsToTry = [
                      { name: 'fwdSpeedLimit', value: connectedSeg.fwdSpeedLimit },
                      { name: 'revSpeedLimit', value: connectedSeg.revSpeedLimit },
                      { name: 'roadType', value: connectedSeg.roadType },
                      { name: 'lockRank', value: connectedSeg.lockRank },
                      { name: 'elevationLevel', value: connectedSeg.elevationLevel },
                      { name: 'direction', value: getDirectionFromSegment(connectedSeg) },
                    ];
                    for (let prop of propsToTry) {
                      try {
                        if (prop.value !== undefined && prop.value !== null) {
                          const updateObj = { segmentId: id };
                          updateObj[prop.name] = prop.value;
                          wmeSDK.DataModel.Segments.updateSegment(updateObj);
                        }
                      } catch (e) {
                        log(`Failed to update ${prop.name}: ` + e);
                      }
                    }
                  }
                  try {
                    wmeSDK.DataModel.Segments.updateAddress({
                      segmentId: id,
                      primaryStreetId: connectedSeg.primaryStreetId,
                      alternateStreetIds: connectedSeg.alternateStreetIds || [],
                    });
                  } catch (addrError) {
                    log('updateAddress error in fallback: ' + addrError);
                  }
                  // Copy all flag attributes
                  copyFlagAttributes(connectedSeg.id, id);
                  alertMessageParts.push(`Copied all attributes from connected segment.`);
                  log(`Copied all attributes from connected segment (fallback, no valid street name).`);
                } else {
                  alertMessageParts.push(`No connected segment found to copy attributes.`);
                }
              }
            } catch (error) {
              console.error('Error copying all attributes:', error);
            }
          }, 100)
        );
      });
      Promise.all(updatePromises).then(() => {
        if (alertMessageParts.length) {
          if (WazeToastr?.Alerts) {
            WazeToastr.Alerts.info('EZRoads Mod', alertMessageParts.join('<br>'), false, false, 5000);
          } else {
            alert('EZRoads Mod: ' + alertMessageParts.join('\n'));
          }
        }
        // --- AUTOSAVE LOGIC HERE ---
        if (options.autosave) {
          setTimeout(() => {
            log('Delayed Autosave starting...');
            wmeSDK.Editing.save().then(() => {
              log('Delayed Autosave completed.');
            });
          }, 600);
        }
      });
      return;
    }

    selection.ids.forEach((origId, idx) => {
      let id = origId;
      let copyConnectedNameData = null;
      // --- Pedestrian type switching logic ---
      if (options.roadType) {
        // If copySegmentName is enabled and switching Street → Pedestrian, prefetch connected segment name
        const seg = wmeSDK.DataModel.Segments.getById({ segmentId: id });
        const currentIsPed = isPedestrianType(seg.roadType);
        const targetIsPed = isPedestrianType(options.roadType);
        if (!currentIsPed && targetIsPed && options.copySegmentName) {
          // Find connected segment and store its name info
          const fromNode = seg.fromNodeId;
          const toNode = seg.toNodeId;
          let connectedSegId = null;
          const allSegs = wmeSDK.DataModel.Segments.getAll();
          for (let s of allSegs) {
            if (s.id !== id && (s.fromNodeId === fromNode || s.toNodeId === fromNode || s.fromNodeId === toNode || s.toNodeId === toNode)) {
              connectedSegId = s.id;
              break;
            }
          }
          if (connectedSegId) {
            const connectedSeg = wmeSDK.DataModel.Segments.getById({ segmentId: connectedSegId });
            copyConnectedNameData = {
              primaryStreetId: connectedSeg.primaryStreetId,
              alternateStreetIds: connectedSeg.alternateStreetIds || [],
            };
          }
        }
        const newId = recreateSegmentIfNeeded(id, options.roadType, copyConnectedNameData);
        if (!newId) return; // If failed, skip further updates
        if (newId !== id) {
          id = newId; // Use the new segment ID for further updates
        }
      }

      // Road Type
      updatePromises.push(
        delayedUpdate(() => {
          if (options.roadType) {
            const seg = wmeSDK.DataModel.Segments.getById({ segmentId: id });
            const selectedRoad = roadTypes.find((rt) => rt.value === options.roadType);
            //alertMessageParts.push(`Road Type: <b>${selectedRoad.name}</b>`);
            //updatedRoadType = true;
            log(`Segment ID: ${id}, Current Road Type: ${seg.roadType}, Target Road Type: ${options.roadType}, Target Road Name : ${selectedRoad.name}`); // Log current and target road type
            if (seg.roadType === options.roadType) {
              log(`Segment ID: ${id} already has the target road type: ${options.roadType}. Skipping update.`);
              alertMessageParts.push(`Road Type: <b>${selectedRoad.name} exists. Skipping update.</b>`);
              updatedRoadType = true;
            } else {
              try {
                wmeSDK.DataModel.Segments.updateSegment({
                  segmentId: id,
                  roadType: options.roadType,
                });
                log('Road type updated successfully.');
                alertMessageParts.push(`Road Type: <b>${selectedRoad.name}</b>`);
                updatedRoadType = true;
              } catch (error) {
                console.error('Error updating road type:', error);
              }
            }
          }
        }, 200)
      ); // 200ms delay before road type update

      // Set lock if enabled
      updatePromises.push(
        delayedUpdate(() => {
          if (options.setLock) {
            const rank = wmeSDK.State.getUserInfo().rank;
            const selectedRoad = roadTypes.find((rt) => rt.value === options.roadType);
            if (selectedRoad) {
              let lockSetting = options.locks.find((l) => l.id === selectedRoad.id);
              if (lockSetting) {
                let toLock = lockSetting.lock;
                if (toLock === 'HRCS') {
                  toLock = getHighestSegLock(id);
                } else {
                  toLock = parseInt(toLock, 10);
                  toLock = Math.max(toLock - 1, 0); // Adjust to 0-based rank, ensuring it does not go below 0
                }

                if (rank < toLock) toLock = rank;

                log(toLock);

                try {
                  const seg = wmeSDK.DataModel.Segments.getById({
                    segmentId: id,
                  });
                  let displayLockLevel = toLock === 'HRCS' || isNaN(toLock) ? 'HRCS' : `L${toLock + 1}`;
                  let currentDisplayLockLevel;
                  if (seg.lockRank === 'HRCS') {
                    // Should not happen, but for safety
                    currentDisplayLockLevel = 'HRCS';
                  } else {
                    currentDisplayLockLevel = `L${seg.lockRank + 1}`;
                  }
                  if (seg.lockRank === toLock || (lockSetting.lock === 'HRCS' && currentDisplayLockLevel === displayLockLevel)) {
                    // Compare lock levels
                    log(`Segment ID: ${id} already has the target lock level: ${displayLockLevel}. Skipping update.`);
                    alertMessageParts.push(`Lock Level: <b>${displayLockLevel} exists. Skipping update.</b>`);
                    updatedLockLevel = true;
                  } else {
                    wmeSDK.DataModel.Segments.updateSegment({
                      segmentId: id,
                      lockRank: toLock,
                    });
                    alertMessageParts.push(`Lock Level: <b>${displayLockLevel}</b>`);
                    updatedLockLevel = true;
                  }
                } catch (error) {
                  console.error('Error updating segment lock rank:', error);
                }
              }
            }
          }
        }, 300)
      ); // 250ms delay before lock rank update

      // Speed Limit - use road-specific speed if updateSpeed is enabled
      updatePromises.push(
        delayedUpdate(() => {
          if (options.updateSpeed) {
            const selectedRoad = roadTypes.find((rt) => rt.value === options.roadType);
            if (selectedRoad) {
              const speedSetting = options.speeds.find((s) => s.id === selectedRoad.id);
              log('Selected road for speed: ' + selectedRoad.name);
              log('Speed setting found: ' + (speedSetting ? 'yes' : 'no'));

              if (speedSetting) {
                const speedValue = parseInt(speedSetting.speed, 10);
                log('Speed value to set: ' + speedValue);

                // If speedValue is 0 or less, treat as unset (null for removal)
                // Use null instead of undefined to properly remove speed limits
                const speedToSet = !isNaN(speedValue) && speedValue > 0 ? speedValue : null;
                const seg = wmeSDK.DataModel.Segments.getById({
                  segmentId: id,
                });
                // Compare using loose equality (==) to treat null and undefined as equivalent
                // This ensures we don't try to update when segment already has no speed limit
                const needsUpdate = seg.fwdSpeedLimit != speedToSet || seg.revSpeedLimit != speedToSet;
                log(`Current fwd speed: ${seg.fwdSpeedLimit}, rev speed: ${seg.revSpeedLimit}, target speed: ${speedToSet}, needs update: ${needsUpdate}`);

                if (needsUpdate) {
                  wmeSDK.DataModel.Segments.updateSegment({
                    segmentId: id,
                    fwdSpeedLimit: speedToSet,
                    revSpeedLimit: speedToSet,
                  });
                  alertMessageParts.push(`Speed Limit: <b>${speedToSet !== null ? speedToSet : 'unset'}</b>`);
                  updatedSpeedLimit = true;
                } else {
                  log(`Segment ID: ${id} already has the target speed limit: ${speedToSet}. Skipping update.`);
                  alertMessageParts.push(`Speed Limit: <b>${speedToSet !== null ? speedToSet : 'unset'} exists. Skipping update.</b>`);
                  updatedSpeedLimit = true;
                }
              }
            }
          } else {
            log('Speed updates disabled');
          }
        }, 400)
      ); // 300ms delay before lock rank update

      // Handling the street
      if (options.setStreet || options.setStreetCity || (!options.setStreet && !options.setStreetCity)) {
        let city = null;
        let street = null;
        const segment = wmeSDK.DataModel.Segments.getById({ segmentId: id });
        // --- City assignment logic ---
        if (options.setStreetCity) {
          // Checked: set city as none (empty city)
          city = wmeSDK.DataModel.Cities.getAll().find((city) => city.isEmpty) || wmeSDK.DataModel.Cities.addCity({ cityName: '' });
        } else {
          // Unchecked: try top city, then connected segment's city, then fallback to none
          city = null;
          // 1. Try top city
          city = getTopCity();
          log(`Top city: ${city ? `name="${city.name}", isEmpty=${city.isEmpty}, id=${city.id}` : 'null'}`);

          // 2. If not found or empty, try connected segment's city
          if (!city || city.isEmpty) {
            log('Top city not found or empty, checking connected segments...');
            const connectedAddress = getFirstConnectedSegmentAddress(id);
            if (connectedAddress && connectedAddress.city && connectedAddress.city.id) {
              const connectedCity = wmeSDK.DataModel.Cities.getById({ cityId: connectedAddress.city.id });
              log(`Connected segment city: ${connectedCity ? `name="${connectedCity.name}", isEmpty=${connectedCity.isEmpty}, id=${connectedCity.id}` : 'null'}`);
              // Only use connected city if it's not empty
              if (connectedCity && !connectedCity.isEmpty) {
                city = connectedCity;
              }
            } else {
              log('No connected address found');
            }
          }

          // 3. If still not found or empty, fallback to none
          if (!city || city.isEmpty) {
            log('No valid city found, using empty city');
            city = wmeSDK.DataModel.Cities.getAll().find((city) => city.isEmpty) || wmeSDK.DataModel.Cities.addCity({ cityName: '' });
          }
        }
        // --- Street assignment logic ---
        if (options.setStreet) {
          // Set street name to none and remove all alt street names
          street = wmeSDK.DataModel.Streets.getStreet({
            cityId: city.id,
            streetName: '',
          });
          if (!street) {
            street = wmeSDK.DataModel.Streets.addStreet({
              streetName: '',
              cityId: city.id,
            });
          }
          // Remove all alternate street names
          wmeSDK.DataModel.Segments.updateAddress({
            segmentId: id,
            primaryStreetId: street.id,
            alternateStreetIds: [],
          });
        } else if (options.setStreetCity) {
          // Use the same street name as current, but in the empty city for both primary and all alts
          const currentStreet =
            segment && segment.primaryStreetId
              ? wmeSDK.DataModel.Streets.getById({
                  streetId: segment.primaryStreetId,
                })
              : null;
          const streetName = currentStreet ? currentStreet.name || '' : '';
          street = wmeSDK.DataModel.Streets.getStreet({
            cityId: city.id,
            streetName: streetName,
          });
          if (!street) {
            street = wmeSDK.DataModel.Streets.addStreet({
              streetName: streetName,
              cityId: city.id,
            });
          }
          // For all alternate street names, set them to the empty city as well
          let newAltStreetIds = [];
          if (segment && segment.alternateStreetIds) {
            segment.alternateStreetIds.forEach((altStreetId) => {
              const altStreet = wmeSDK.DataModel.Streets.getById({ streetId: altStreetId });
              if (altStreet && altStreet.name !== undefined) {
                let altInCity = wmeSDK.DataModel.Streets.getStreet({
                  cityId: city.id,
                  streetName: altStreet.name || '',
                });
                if (!altInCity) {
                  altInCity = wmeSDK.DataModel.Streets.addStreet({
                    streetName: altStreet.name || '',
                    cityId: city.id,
                  });
                }
                newAltStreetIds.push(altInCity.id);
              }
            });
          }
          wmeSDK.DataModel.Segments.updateAddress({
            segmentId: id,
            primaryStreetId: street.id,
            alternateStreetIds: newAltStreetIds,
          });
          pushCityNameAlert(city.id, alertMessageParts);
          updatedCityName = true;
        } else {
          // If both setStreet and setStreetCity are unchecked, always update city for primary and alt names
          if (segment && (segment.primaryStreetId || (segment.alternateStreetIds && segment.alternateStreetIds.length))) {
            // Update primary street to new city
            let currentStreet = segment.primaryStreetId ? wmeSDK.DataModel.Streets.getById({ streetId: segment.primaryStreetId }) : null;
            let streetName = currentStreet ? currentStreet.name || '' : '';
            log(`Before getStreet/addStreet: cityId=${city.id}, streetName="${streetName}"`);
            street = wmeSDK.DataModel.Streets.getStreet({ cityId: city.id, streetName });
            if (!street) {
              log(`Street not found, creating new street with cityId=${city.id}, streetName="${streetName}"`);
              street = wmeSDK.DataModel.Streets.addStreet({ streetName, cityId: city.id });
            }
            log(`After getStreet/addStreet: street.id=${street?.id}, street.cityId=${street?.cityId}`);
            // Update alt streets to new city
            let newAltStreetIds = [];
            if (segment && segment.alternateStreetIds && city) {
              segment.alternateStreetIds.forEach((altStreetId) => {
                const altStreet = wmeSDK.DataModel.Streets.getById({ streetId: altStreetId });
                if (altStreet && altStreet.name !== undefined) {
                  let altInCity = wmeSDK.DataModel.Streets.getStreet({
                    cityId: city.id,
                    streetName: altStreet.name || '',
                  });
                  if (!altInCity) {
                    altInCity = wmeSDK.DataModel.Streets.addStreet({
                      streetName: altStreet.name || '',
                      cityId: city.id,
                    });
                  }
                  newAltStreetIds.push(altInCity.id);
                }
              });
            }
            log(`About to updateAddress: cityId=${city.id}, street.id=${street.id}, altStreetIds=${newAltStreetIds.join(',')}`);
            wmeSDK.DataModel.Segments.updateAddress({
              segmentId: id,
              primaryStreetId: street.id,
              alternateStreetIds: newAltStreetIds.length > 0 ? newAltStreetIds : undefined,
            });
          } else {
            // New/empty street fallback - use the city we already determined above (from top city or connected segments)
            log(`Segment has no primary street, using determined city: ${city ? `id=${city.id}, name="${city.name}"` : 'null'}`);
            street = wmeSDK.DataModel.Streets.getStreet({ cityId: city.id, streetName: '' });
            if (!street) {
              street = wmeSDK.DataModel.Streets.addStreet({ streetName: '', cityId: city.id });
            }
            wmeSDK.DataModel.Segments.updateAddress({
              segmentId: id,
              primaryStreetId: street.id,
              alternateStreetIds: undefined,
            });
          }
        }
        log(`City Name: ${city?.name}, City ID: ${city?.id}, Street ID: ${street?.id}`);
      }

      // Updated unpaved handler with SegmentFlagAttributes and fallback
      updatePromises.push(
        delayedUpdate(() => {
          const seg = wmeSDK.DataModel.Segments.getById({ segmentId: id });
          const isPedestrian = isPedestrianType(seg.roadType);
          if (isPedestrian) {
            // Always set as paved for pedestrian types, regardless of checkbox
            const isUnpaved = seg.flagAttributes && seg.flagAttributes.unpaved === true;
            let pavedToggled = false;
            if (isUnpaved) {
              // Click to set as paved
              const unpavedIcon = openPanel.querySelector('.w-icon-unpaved-fill');
              if (unpavedIcon) {
                const unpavedChip = unpavedIcon.closest('wz-checkable-chip');
                if (unpavedChip) {
                  unpavedChip.click();
                  log('Clicked unpaved chip (set to paved for pedestrian type)');
                  pavedToggled = true;
                }
              }
              if (!pavedToggled) {
                try {
                  const wzCheckbox = openPanel.querySelector('wz-checkbox[name="unpaved"]');
                  if (wzCheckbox) {
                    const hiddenInput = wzCheckbox.querySelector('input[type="checkbox"][name="unpaved"]');
                    if (hiddenInput && hiddenInput.checked) {
                      hiddenInput.click();
                      log('Clicked unpaved checkbox (set to paved, non-compact mode, pedestrian type)');
                      pavedToggled = true;
                    }
                  }
                } catch (e) {
                  log('Fallback to non-compact mode paved toggle method failed: ' + e);
                }
              }
              if (pavedToggled) {
                alertMessageParts.push(`Paved Status: <b>Paved (pedestrian type)</b>`);
                updatedPaved = true;
              }
            } else {
              alertMessageParts.push(`Paved Status: <b>Paved (pedestrian type, already set)</b>`);
              updatedPaved = true;
            }
          } else if (options.unpaved) {
            const isUnpaved = seg.flagAttributes && seg.flagAttributes.unpaved === true;
            let unpavedToggled = false;

            if (!isUnpaved) {
              // Only click if segment is not already unpaved
              const unpavedIcon = openPanel.querySelector('.w-icon-unpaved-fill');
              if (unpavedIcon) {
                const unpavedChip = unpavedIcon.closest('wz-checkable-chip');
                if (unpavedChip) {
                  unpavedChip.click();
                  log('Clicked unpaved chip (set to unpaved)');
                  unpavedToggled = true;
                }
              }
              // If new method failed, try the old method as fallback for non-compact mode
              if (!unpavedToggled) {
                try {
                  const wzCheckbox = openPanel.querySelector('wz-checkbox[name="unpaved"]');
                  if (wzCheckbox) {
                    const hiddenInput = wzCheckbox.querySelector('input[type="checkbox"][name="unpaved"]');
                    if (hiddenInput && !hiddenInput.checked) {
                      hiddenInput.click();
                      log('Clicked unpaved checkbox (set to unpaved, non-compact mode)');
                      unpavedToggled = true;
                    }
                  }
                } catch (e) {
                  log('Fallback to non-compact mode unpaved toggle method failed: ' + e);
                }
              }
              if (unpavedToggled) {
                alertMessageParts.push(`Paved Status: <b>Unpaved</b>`);
                updatedPaved = true;
              }
            } else {
              // Already unpaved, no action needed
              alertMessageParts.push(`Paved Status: <b>Unpaved (already set)</b>`);
              updatedPaved = true;
            }
          } else {
            const isUnpaved = seg.flagAttributes && seg.flagAttributes.unpaved === true;
            let pavedToggled = false;

            if (isUnpaved) {
              // Click to set as paved
              const unpavedIcon = openPanel.querySelector('.w-icon-unpaved-fill');
              if (unpavedIcon) {
                const unpavedChip = unpavedIcon.closest('wz-checkable-chip');
                if (unpavedChip) {
                  unpavedChip.click();
                  log('Clicked unpaved chip (set to paved)');
                  pavedToggled = true;
                }
              }
              // If new method failed, try the old method as fallback for non-compact mode
              if (!pavedToggled) {
                try {
                  const wzCheckbox = openPanel.querySelector('wz-checkbox[name="unpaved"]');
                  if (wzCheckbox) {
                    const hiddenInput = wzCheckbox.querySelector('input[type="checkbox"][name="unpaved"]');
                    if (hiddenInput && hiddenInput.checked) {
                      hiddenInput.click();
                      log('Clicked unpaved checkbox (set to paved, non-compact mode)');
                      pavedToggled = true;
                    }
                  }
                } catch (e) {
                  log('Fallback to non-compact mode paved toggle method failed: ' + e);
                }
              }
              if (pavedToggled) {
                alertMessageParts.push(`Paved Status: <b>Paved</b>`);
                updatedPaved = true;
              }
            } else {
              // Already paved, no action needed
              alertMessageParts.push(`Paved Status: <b>Paved (already set)</b>`);
              updatedPaved = true;
            }
          }
        }, 500)
      ); // 500ms delay for unpaved/paved toggle

      // 3a. Copy segment name from connected segment if enabled
      updatePromises.push(
        delayedUpdate(() => {
          if (options.copySegmentName) {
            try {
              const seg = wmeSDK.DataModel.Segments.getById({ segmentId: id });
              const fromNode = seg.fromNodeId;
              const connectedSegIds = getConnectedSegmentIDs(id);
              // Gather all segments connected to fromNode (excluding self)
              const fromNodeSegs = connectedSegIds.map((sid) => wmeSDK.DataModel.Segments.getById({ segmentId: sid })).filter((s) => s && (s.fromNodeId === fromNode || s.toNodeId === fromNode) && s.id !== id);
              // Prefer the first fromNode segment with a name/city/alias
              let preferredSeg = fromNodeSegs.find((s) => {
                if (!s) return false;
                const street = wmeSDK.DataModel.Streets.getById({ streetId: s.primaryStreetId });
                const altStreetIds = s.alternateStreetIds || [];
                let altNames = [];
                altStreetIds.forEach((altId) => {
                  const altStreet = wmeSDK.DataModel.Streets.getById({ streetId: altId });
                  if (altStreet && altStreet.name) altNames.push(altStreet.name);
                });
                return street && (street.name || street.englishName || street.signText || altNames.length > 0);
              });
              let segsToTry = [];
              if (preferredSeg) {
                segsToTry.push(preferredSeg.id);
                // Add the rest, excluding preferredSeg.id
                segsToTry = segsToTry.concat(connectedSegIds.filter((cid) => cid !== preferredSeg.id));
              } else {
                segsToTry = connectedSegIds;
              }
              let found = false;
              for (let connectedSegId of segsToTry) {
                const connectedSeg = wmeSDK.DataModel.Segments.getById({ segmentId: connectedSegId });
                if (!connectedSeg) continue;
                const streetId = connectedSeg.primaryStreetId;
                const altStreetIds = connectedSeg.alternateStreetIds || [];
                let street = wmeSDK.DataModel.Streets.getById({ streetId });
                // Get alternate street names
                let altNames = [];
                altStreetIds.forEach((altId) => {
                  const altStreet = wmeSDK.DataModel.Streets.getById({ streetId: altId });
                  if (altStreet && altStreet.name) altNames.push(altStreet.name);
                });
                // If any connected segment has a name or alias, use it
                if (street && (street.name || street.englishName || street.signText || altNames.length > 0)) {
                  if (options.setStreetCity && street) {
                    const emptyCity = wmeSDK.DataModel.Cities.getAll().find((city) => city.isEmpty) || wmeSDK.DataModel.Cities.addCity({ cityName: '' });
                    // Try to find or create a street with the same name but in the empty city
                    let noneStreet = wmeSDK.DataModel.Streets.getStreet({
                      cityId: emptyCity.id,
                      streetName: street.name || '',
                    });
                    if (!noneStreet) {
                      noneStreet = wmeSDK.DataModel.Streets.addStreet({
                        streetName: street.name || '',
                        cityId: emptyCity.id,
                      });
                    }
                    // For alternate streets, also convert them to the empty city
                    let newAltStreetIds = [];
                    altStreetIds.forEach((altId) => {
                      const altStreet = wmeSDK.DataModel.Streets.getById({ streetId: altId });
                      if (altStreet && altStreet.name) {
                        let altInEmptyCity = wmeSDK.DataModel.Streets.getStreet({
                          cityId: emptyCity.id,
                          streetName: altStreet.name || '',
                        });
                        if (!altInEmptyCity) {
                          altInEmptyCity = wmeSDK.DataModel.Streets.addStreet({
                            streetName: altStreet.name || '',
                            cityId: emptyCity.id,
                          });
                        }
                        newAltStreetIds.push(altInEmptyCity.id);
                      }
                    });
                    wmeSDK.DataModel.Segments.updateAddress({
                      segmentId: id,
                      primaryStreetId: noneStreet.id,
                      alternateStreetIds: newAltStreetIds,
                    });
                    let aliasMsg = altNames.length ? ` (Alternatives: ${altNames.join(', ')})` : '';
                    alertMessageParts.push(`Copied Name: <b>${street.name || ''}</b>${aliasMsg}`);
                    updatedSegmentName = true;
                    pushCityNameAlert(emptyCity.id, alertMessageParts);
                    updatedCityName = true;
                  } else {
                    wmeSDK.DataModel.Segments.updateAddress({
                      segmentId: id,
                      primaryStreetId: streetId,
                      alternateStreetIds: altStreetIds,
                    });
                    let aliasMsg = altNames.length ? ` (Alternatives: ${altNames.join(', ')})` : '';
                    alertMessageParts.push(`Copied Name: <b>${street.name || ''}</b>${aliasMsg}`);
                    updatedSegmentName = true;
                    pushCityNameAlert(street.cityId, alertMessageParts);
                    updatedCityName = true;
                  }
                  found = true;
                  break;
                }
              }
              if (!found) {
                alertMessageParts.push(`Copied Name: <b>None (no connected segment found)</b>`);
                updatedSegmentName = true;
              }
            } catch (error) {
              console.error('Error copying segment name:', error);
            }
          }
        }, 100)
      ); // Run early in the update chain
    });

    Promise.all(updatePromises).then(() => {
      // Always push city name alert if not already set by other actions
      selection.ids.forEach((id) => {
        if (!alertMessageParts.some((part) => part.startsWith('City Name'))) {
          const seg = wmeSDK.DataModel.Segments.getById({ segmentId: id });
          if (seg && seg.primaryStreetId) {
            const street = wmeSDK.DataModel.Streets.getById({
              streetId: seg.primaryStreetId,
            });
            if (street) {
              pushCityNameAlert(street.cityId, alertMessageParts);
              updatedCityName = true;
            }
          }
        }
      });

      const showAlert = () => {
        const updatedFeatures = [];
        if (updatedCityName) updatedFeatures.push(alertMessageParts.find((part) => part.startsWith('City')));
        if (updatedSegmentName) updatedFeatures.push(alertMessageParts.find((part) => part.startsWith('Copied Name')));
        if (updatedRoadType) updatedFeatures.push(alertMessageParts.find((part) => part.startsWith('Road Type')));
        if (updatedLockLevel) updatedFeatures.push(alertMessageParts.find((part) => part.startsWith('Lock Level')));
        if (updatedSpeedLimit) updatedFeatures.push(alertMessageParts.find((part) => part.startsWith('Speed Limit')));
        if (updatedPaved) updatedFeatures.push(alertMessageParts.find((part) => part.startsWith('Paved')));
        const message = updatedFeatures.filter(Boolean).join(', ');
        if (message) {
          if (WazeToastr?.Alerts) {
            WazeToastr.Alerts.info('EZRoads Mod', `Segment updated with: ${message}`, false, false, 3000);
          } else {
            alert('EZRoads Mod: Segment updated (WazeToastr Alerts not available)');
          }
        }
      };

      // Autosave - DELAYED AUTOSAVE
      if (options.autosave) {
        setTimeout(() => {
          log('Delayed Autosave starting...');
          wmeSDK.Editing.save().then(() => {
            log('Delayed Autosave completed.');
            showAlert();
          });
        }, 600); // 1000ms (1 second) delay before autosave
      } else {
        showAlert();
      }
    });
  };

  const constructSettings = () => {
    const localOptions = getOptions();
    let currentRoadType = localOptions.roadType;
    const update = (key, value) => {
      const options = getOptions();
      options[key] = value;
      localOptions[key] = value;
      saveOptions(options);
    };

    // Update lock level for a specific road type
    const updateLockLevel = (roadTypeId, lockLevel) => {
      const options = getOptions();
      const lockIndex = options.locks.findIndex((l) => l.id === roadTypeId);
      if (lockIndex !== -1) {
        options.locks[lockIndex].lock = lockLevel; // Keep as string to handle 'HRCS'
        localOptions.locks = options.locks;
        saveOptions(options);
        // Trigger preset list refresh if settings panel is open
        if ($('#ezroadsmod-presets-list').length) {
          $('#ezroadsmod-presets-list').trigger('refresh-presets');
        }
        if (WazeToastr?.Alerts) {
          WazeToastr.Alerts.success('EZRoads Mod', 'Lock Levels saved!', false, false, 1500);
        } else {
          alert('EZRoads Mod: Lock Levels saved!');
        }
      }
    };

    // Update speed for a specific road type
    const updateSpeed = (roadTypeId, speed) => {
      const options = getOptions();
      const speedIndex = options.speeds.findIndex((s) => s.id === roadTypeId);
      let speedValue = parseInt(speed, 10);
      if (isNaN(speedValue)) {
        speedValue = -1;
      }
      log(`Updating speed for road type ${roadTypeId} to ${speedValue}`);
      if (speedIndex !== -1) {
        options.speeds[speedIndex].speed = speedValue;
        localOptions.speeds = options.speeds;
        saveOptions(options);
        // Trigger preset list refresh if settings panel is open
        if ($('#ezroadsmod-presets-list').length) {
          $('#ezroadsmod-presets-list').trigger('refresh-presets');
        }
        if (WazeToastr?.Alerts) {
          WazeToastr.Alerts.success('EZRoads Mod', 'Speed Values saved!', false, false, 1500);
        } else {
          alert('EZRoads Mod: Speed Values saved!');
        }
      }
    };

    // Reset all options to defaults
    const resetOptions = () => {
      saveOptions(defaultOptions);
      // Refresh the page to reload settings
      window.location.reload();
    };

    // Checkbox option definitions
    const checkboxOptions = [
      {
        id: 'setStreet',
        text: 'Set Street Name to None',
        key: 'setStreet',
        tooltip: 'Sets the street name to None for selected segments. If unchecked, leaves the street name unchanged.',
      },
      {
        id: 'setStreetCity',
        text: 'Set city as none (uncheck to add auto)',
        key: 'setStreetCity',
        tooltip: 'If checked, sets the city to None for selected segments for both primary and alternate streets.. If unchecked, adds the available city name automatically to both primary and alt streets.',
      },
      {
        id: 'autosave',
        text: 'Autosave on Action',
        key: 'autosave',
        tooltip: 'Automatically saves after updating segments.',
      },
      {
        id: 'unpaved',
        text: 'Set as Unpaved (Uncheck for Paved)',
        key: 'unpaved',
        tooltip: 'Sets the segment as unpaved. Uncheck to set as paved.',
      },
      {
        id: 'setLock',
        text: 'Set the lock level',
        key: 'setLock',
        tooltip: 'Sets the lock level for the selected road type. It also enables the lock level dropdown.',
      },
      {
        id: 'updateSpeed',
        text: 'Update speed limits',
        key: 'updateSpeed',
        tooltip: 'Updates the speed limit for the selected road type. it also enables the speed input field.',
      },
      {
        id: 'copySegmentName',
        text: 'Copy connected Segment Name',
        key: 'copySegmentName',
        tooltip: "Copies the name and city from a connected segment to the selected segment. If 'Set city as none' is enabled, the city will be set to none regardless of the copied value.",
      },
      {
        id: 'copySegmentAttributes',
        text: 'Copy Connected Segment Attribute',
        key: 'copySegmentAttributes',
        tooltip:
          'Copies all major attributes (road type, lock level, speed limits, paved/unpaved status, primary and alternate street names, and city) from a connected segment. When enabled, it overrides all other options except Autosave. Use shortcut key or (Quick Update Segment) to apply.',
      },
      {
        id: 'showSegmentLength',
        text: 'Show Segment Length <=20m',
        key: 'showSegmentLength',
        tooltip: 'Displays segment length in an orange circle with white font for segments 20 meters or shorter in the visible map area.',
      },
      {
        id: 'checkGeometryIssues',
        text: 'Check Geometry issues near node',
        key: 'checkGeometryIssues',
        tooltip: 'Checks if any intermediate geometry nodes are too close to the start or end nodes. Configure threshold distance below. Displays a pin icon if an issue is found.',
      },
    ];

    // Helper function to create radio buttons
    const createRadioButton = (roadType) => {
      const id = `road-${roadType.id}`;
      const isChecked = localOptions.roadType === roadType.value;
      const lockSetting = localOptions.locks.find((l) => l.id === roadType.id) || { id: roadType.id, lock: 1 };
      const speedSetting = localOptions.speeds.find((s) => s.id === roadType.id) || { id: roadType.id, speed: 40 };

      const div = $(`<div class="ezroadsmod-option">
            <div class="ezroadsmod-radio-container">
                <input type="radio" id="${id}" name="defaultRoad" data-road-value="${roadType.value}" ${isChecked ? 'checked' : ''}>
                <label for="${id}">${roadType.name}</label>
                <select id="lock-level-${roadType.id}" class="road-lock-level" data-road-id="${roadType.id}" ${!localOptions.setLock ? 'disabled' : ''}>
                    ${locks.map((lock) => `<option value="${lock.value}" ${lockSetting.lock === lock.value ? 'selected' : ''}>${lock.value === 'HRCS' ? 'HRCS' : 'L' + lock.value}</option>`).join('')}
                </select>
                <input type="number" id="speed-${roadType.id}" class="road-speed" data-road-id="${roadType.id}"
                       value="${speedSetting.speed}" min="-1" ${!localOptions.updateSpeed ? 'disabled' : ''}>
            </div>
        </div>`);

      div.find('input[type="radio"]').on('click', () => {
        update('roadType', roadType.value);
        currentRoadType = roadType.value;
      });

      div.find('select').on('change', function () {
        updateLockLevel(roadType.id, $(this).val());
      });

      div.find('input.road-speed').on('change', function () {
        // Get the value as a number
        const speedValue = parseInt($(this).val(), 10);
        // If it's not a number, reset to 0
        if (isNaN(speedValue)) {
          $(this).val(0);
          updateSpeed(roadType.id, 0);
        } else {
          updateSpeed(roadType.id, speedValue);
        }
      });

      return div;
    };

    // Helper function to create checkboxes
    const createCheckbox = (option) => {
      const isChecked = localOptions[option.key];
      const otherClass = option.key !== 'autosave' && option.key !== 'copySegmentAttributes' && option.key !== 'showSegmentLength' && option.key !== 'checkGeometryIssues' ? 'ezroadsmod-other-checkbox' : '';
      const attrClass = option.key === 'copySegmentAttributes' ? 'ezroadsmod-attr-checkbox' : '';

      const div = $(`<div class="ezroadsmod-option">
    <input type="checkbox" id="${option.id}" name="${option.id}" class="${otherClass} ${attrClass}" ${isChecked ? 'checked' : ''} title="${option.tooltip || ''}">
    <label for="${option.id}" title="${option.tooltip || ''}">${option.text}</label>
  </div>`);
      div.on('click', () => {
        // Mutually exclusive logic for setStreet and copySegmentName
        if (option.key === 'setStreet' && $(`#${option.id}`).prop('checked')) {
          $('#copySegmentName').prop('checked', false);
          update('copySegmentName', false);
        }
        if (option.key === 'copySegmentName' && $(`#${option.id}`).prop('checked')) {
          $('#setStreet').prop('checked', false);
          update('setStreet', false);
        }

        // Mutual exclusion logic for copySegmentAttributes and other checkboxes
        if (option.key === 'copySegmentAttributes') {
          if ($(`#${option.id}`).prop('checked')) {
            // Uncheck all other checkboxes except autosave
            $('.ezroadsmod-other-checkbox').each(function () {
              $(this).prop('checked', false);
              const key = $(this).attr('id');
              update(key, false);
            });
            update('copySegmentAttributes', true);
          } else {
            update('copySegmentAttributes', false);
          }
        } else if (option.key !== 'autosave' && option.key !== 'showSegmentLength' && option.key !== 'checkGeometryIssues') {
          // If any other checkbox (except autosave, showSegmentLength, checkGeometryIssues) is checked, uncheck copySegmentAttributes
          if ($(`#${option.id}`).prop('checked')) {
            $('#copySegmentAttributes').prop('checked', false);
            update('copySegmentAttributes', false);
          }
          update(option.key, $(`#${option.id}`).prop('checked'));
        } else {
          // Autosave, showSegmentLength, or checkGeometryIssues
          update(option.key, $(`#${option.id}`).prop('checked'));
        }

        // Handle Segment Length / Geometry Check toggle
        if (option.key === 'showSegmentLength' || option.key === 'checkGeometryIssues' || option.key === 'copySegmentAttributes') {
          handleSegmentLengthToggle();
        }
      });
      return div;
    };

    // -- Set up the tab for the script
    wmeSDK.Sidebar.registerScriptTab().then(({ tabLabel, tabPane }) => {
      tabLabel.innerText = 'EZRoads Mod';
      tabLabel.title = 'Easily Update Roads';

      // Setup base styles
      const styles = $(`<style>
            #ezroadsmod-settings h2, #ezroadsmod-settings h5 {
                margin-top: 0;
                margin-bottom: 10px;
            }
            .ezroadsmod-section {
                margin-bottom: 15px;
            }
            .ezroadsmod-option {
                margin-bottom: 8px;
            }
            .ezroadsmod-radio-container {
                display: flex;
                align-items: center;
            }
            .ezroadsmod-radio-container input[type="radio"] {
                margin-right: 5px;
            }
            .ezroadsmod-radio-container label {
                flex: 1;
                margin-right: 10px;
                text-align: left;
            }
            .ezroadsmod-radio-container select {
                width: 80px;
                margin-left: auto;
                margin-right: 5px;
            }
            .ezroadsmod-radio-container input.road-speed {
                width: 60px;
            }
            .ezroadsmod-reset-button {
                margin-top: 20px;
                padding: 8px 12px;
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            }
            .ezroadsmod-reset-button:hover {
                background-color: #d32f2f;
            }
        </style>`);

      tabPane.innerHTML = '<div id="ezroadsmod-settings"></div>';
      const scriptContentPane = $('#ezroadsmod-settings');
      scriptContentPane.append(styles);

      // Header section
      const header = $(`<div class="ezroadsmod-section">
		<h2>EZRoads Mod</h2>
		<div>Current Version: <b>${scriptVersion}</b></div>
		<div>Update Keybind: <kbd>G</kbd></div>
		<div style="font-size: 0.8em;">You can change it in WME keyboard setting!</div>
		</div>`);
      scriptContentPane.append(header);

      // Road type and options header
      const roadTypeHeader = $(`<div class="ezroads-section">
        <div style="display: flex; align-items: center;">
        <div style="flex-grow: 1; text-align: center;">Road Type</div>
        <div style="width: 80px; text-align: center;">Lock</div>
        <div style="width: 60px; text-align: center;">Speed</div>
        </div>
        </div>`);
      scriptContentPane.append(roadTypeHeader);

      // Road type section with header
      const roadTypeSection = $(`<div class="ezroads-section">
        <div id="road-type-options"></div>
        </div>`);
      scriptContentPane.append(roadTypeSection);

      const roadTypeOptions = roadTypeSection.find('#road-type-options');
      roadTypes.forEach((roadType) => {
        roadTypeOptions.append(createRadioButton(roadType));
      });
      // Additional options section
      const additionalSection = $(`<div class="ezroadsmod-section">
            <h5>Additional Options</h5>
            <div id="additional-options"></div>
        </div>`);
      scriptContentPane.append(additionalSection);

      const additionalOptions = additionalSection.find('#additional-options');
      checkboxOptions.forEach((option) => {
        additionalOptions.append(createCheckbox(option));
      });

      // Add geometry threshold input field
      const geometryThresholdDiv = $(`<div class="ezroadsmod-option" style="margin-left: 20px; margin-top: -5px;">
        <label for="geometryIssueThreshold" style="font-size: 0.9em;">Threshold distance (meters):</label>
        <input type="number" id="geometryIssueThreshold" min="0.1" max="10" step="0.1" value="${
          localOptions.geometryIssueThreshold || 2
        }" style="width: 60px; margin-left: 5px;" title="Distance in meters to check for geometry nodes near segment endpoints">
      </div>`);
      additionalOptions.append(geometryThresholdDiv);

      // Handle geometry threshold input change
      $(document).on('change', '#geometryIssueThreshold', function () {
        let thresholdValue = parseFloat($(this).val());
        if (isNaN(thresholdValue) || thresholdValue < 0.1) {
          thresholdValue = 2;
          $(this).val(2);
        } else if (thresholdValue > 10) {
          thresholdValue = 10;
          $(this).val(10);
        }
        update('geometryIssueThreshold', thresholdValue);
        // Refresh display if geometry check is enabled
        if (localOptions.checkGeometryIssues) {
          rebuildSegmentLengthDisplay();
        }
      });

      // Update all lock dropdowns when setLock checkbox changes
      $(document).on('click', '#setLock', function () {
        const isChecked = $(this).prop('checked');
        $('.road-lock-level').prop('disabled', !isChecked);
      });

      // Update all speed inputs when updateSpeed checkbox changes
      $(document).on('click', '#updateSpeed', function () {
        const isChecked = $(this).prop('checked');
        $('.road-speed').prop('disabled', !isChecked);
        log('Speed update option changed to: ' + isChecked);
      });

      // Reset button section
      const resetButton = $(`<button class="ezroadsmod-reset-button">Reset All Options</button>`);
      resetButton.on('click', function () {
        if (confirm('Are you sure you want to reset all options to default values? It will reload the webpage!')) {
          resetOptions();
        }
      });
      scriptContentPane.append(resetButton);

      // --- Export/Import Config UI ---
      const exportImportSection = $(
        `<div class="ezroadsmod-section" style="margin-top:10px;">
          <div style="display:flex; align-items:center; gap:5px; margin-bottom:5px;">
            <button id="ezroadsmod-export-btn" style="font-size:0.9em;padding:4px 8px;white-space:nowrap;">Export Lock/Speed Config</button>
            <button id="ezroadsmod-import-btn" style="font-size:0.9em;padding:4px 8px;white-space:nowrap;">Import Lock/Speed Config</button>
          </div>
          <input id="ezroadsmod-import-input" type="text" placeholder="Paste config here" style="width:95%;font-size:0.9em;padding:3px;">
        </div>`
      );
      scriptContentPane.append(exportImportSection);

      // Export logic
      $(document).on('click', '#ezroadsmod-export-btn', function () {
        const options = getOptions();
        const presets = getCustomPresets();
        const exportData = {
          locks: options.locks,
          speeds: options.speeds,
          customPresets: presets,
        };
        const exportStr = JSON.stringify(exportData, null, 2);
        // Copy to clipboard
        navigator.clipboard.writeText(exportStr).then(
          () => {
            if (WazeToastr?.Alerts) {
              WazeToastr.Alerts.success('EZRoads Mod', 'Lock/Speed config with all presets copied to clipboard!', false, false, 2000);
            } else {
              alert('Lock/Speed config with all presets copied to clipboard!');
            }
          },
          () => {
            alert('Failed to copy config to clipboard.');
          }
        );
      });

      // Import logic
      $(document).on('click', '#ezroadsmod-import-btn', function () {
        const importStr = $('#ezroadsmod-import-input').val();
        if (!importStr) {
          alert('Please paste a config string to import.');
          return;
        }
        let importData;
        try {
          importData = JSON.parse(importStr);
        } catch (e) {
          alert('Invalid config string!');
          return;
        }
        if (importData.locks && importData.speeds) {
          const options = getOptions();
          options.locks = importData.locks;
          options.speeds = importData.speeds;
          saveOptions(options);
          // Update in-memory localOptions and UI
          localOptions.locks = importData.locks;
          localOptions.speeds = importData.speeds;

          // Import custom presets if they exist
          if (importData.customPresets) {
            window.localStorage.setItem('WME_EZRoads_Mod_CustomPresets', JSON.stringify(importData.customPresets));
            refreshPresetsList();
          }

          // Update lock dropdowns
          $('.road-lock-level').each(function () {
            const roadId = $(this).data('road-id');
            const lockSetting = localOptions.locks.find((l) => l.id == roadId);
            if (lockSetting) $(this).val(lockSetting.lock);
          });
          // Update speed inputs
          $('.road-speed').each(function () {
            const roadId = $(this).data('road-id');
            const speedSetting = localOptions.speeds.find((s) => s.id == roadId);
            if (speedSetting) $(this).val(speedSetting.speed);
          });
          if (WazeToastr?.Alerts) {
            const presetsCount = importData.customPresets ? Object.keys(importData.customPresets).length : 0;
            const message = presetsCount > 0 ? `Config imported with ${presetsCount} preset(s)!` : 'Config imported and applied!';
            WazeToastr.Alerts.success('EZRoads Mod', message, false, false, 2000);
          } else {
            alert('Config imported and applied!');
          }
        } else {
          alert('Config missing lock/speed data!');
        }
      });

      // --- Custom Presets UI ---
      const customPresetsSection = $(
        `<div class="ezroadsmod-section" style="margin-top:15px; padding-top:12px; border-top: 1px solid #ccc;">
          <div style="font-weight:bold; margin-bottom:6px; font-size:0.95em;">Custom Lock/Speed Presets</div>
          <div style="margin-bottom:6px;">
            <input id="ezroadsmod-preset-name" type="text" placeholder="Preset name" style="width:45%;margin-right:5px;font-size:0.9em;padding:3px;">
            <button id="ezroadsmod-save-preset-btn" style="font-size:0.9em;padding:3px 8px;">Save</button>
          </div>
          <div id="ezroadsmod-presets-list" style="margin-top:6px;"></div>
        </div>`
      );
      scriptContentPane.append(customPresetsSection);

      // Function to refresh the presets list UI
      const refreshPresetsList = () => {
        const presets = getCustomPresets();
        const presetsListDiv = $('#ezroadsmod-presets-list');
        presetsListDiv.empty();

        const presetNames = Object.keys(presets);
        const currentPresetName = getCurrentPresetName();
        const isModified = isCurrentPresetModified();

        if (presetNames.length === 0) {
          presetsListDiv.append('<div style="color:#888;font-style:italic;font-size:0.85em;">No presets saved.</div>');
          return;
        }

        presetNames.forEach((presetName) => {
          const presetData = presets[presetName];
          const savedDate = presetData.savedAt ? new Date(presetData.savedAt).toLocaleDateString() : 'Unknown';
          const isCurrent = currentPresetName === presetName && !isModified;
          const currentIndicator = isCurrent ? '<span style="color:#4CAF50; font-weight:bold; margin-right:5px;">Current</span>' : '';

          const presetDiv = $(
            `<div class="ezroadsmod-preset-item" style="margin-bottom:5px; padding:5px 5px 5px 5px; background-color:rgba(128, 128, 128, 0.12); border-radius:3px;">
              <div style="display:flex; align-items:center; justify-content:space-between; padding-right:15px;">
                <div style="font-size:1.0em;">
                  <strong>${presetName}</strong>
                  <span style="font-size:0.85em; color: #949494ff; margin-left:5px;">(${savedDate})</span>
                </div>
                <div style="white-space:nowrap;">
                  ${currentIndicator}
                  <button class="ezroadsmod-load-preset-btn" data-preset-name="${presetName}" style="margin-right:2px;font-size:0.9em;padding:2px 5px;">Load</button>
                  <button class="ezroadsmod-delete-preset-btn" data-preset-name="${presetName}" style="background-color:#f44336; color:white;font-size:0.9em;padding:3px 8px;">Delete</button>
                </div>
              </div>
            </div>`
          );
          presetsListDiv.append(presetDiv);
        });
      };

      // Initial load of presets list
      refreshPresetsList();

      // Add event listener for refreshing presets list when settings change
      $('#ezroadsmod-presets-list').on('refresh-presets', refreshPresetsList);

      // Save preset
      $(document).on('click', '#ezroadsmod-save-preset-btn', function () {
        const presetName = $('#ezroadsmod-preset-name').val().trim();
        if (!presetName) {
          alert('Please enter a preset name.');
          return;
        }

        const presets = getCustomPresets();
        if (presets[presetName]) {
          if (!confirm(`Preset "${presetName}" already exists. Overwrite it?`)) {
            return;
          }
        }

        if (saveCustomPreset(presetName)) {
          $('#ezroadsmod-preset-name').val('');
          refreshPresetsList();
          if (WazeToastr?.Alerts) {
            WazeToastr.Alerts.success('EZRoads Mod', `Preset "${presetName}" saved!`, false, false, 2000);
          } else {
            alert(`Preset "${presetName}" saved!`);
          }
        }
      });

      // Load preset
      $(document).on('click', '.ezroadsmod-load-preset-btn', function () {
        const presetName = $(this).data('preset-name');
        if (loadCustomPreset(presetName)) {
          // Update in-memory localOptions
          const options = getOptions();
          localOptions.locks = options.locks;
          localOptions.speeds = options.speeds;

          // Update lock dropdowns
          $('.road-lock-level').each(function () {
            const roadId = $(this).data('road-id');
            const lockSetting = localOptions.locks.find((l) => l.id == roadId);
            if (lockSetting) $(this).val(lockSetting.lock);
          });

          // Update speed inputs
          $('.road-speed').each(function () {
            const roadId = $(this).data('road-id');
            const speedSetting = localOptions.speeds.find((s) => s.id == roadId);
            if (speedSetting) $(this).val(speedSetting.speed);
          });

          // Refresh the presets list to show the current indicator
          refreshPresetsList();

          if (WazeToastr?.Alerts) {
            WazeToastr.Alerts.success('EZRoads Mod', `Preset "${presetName}" loaded!`, false, false, 2000);
          } else {
            alert(`Preset "${presetName}" loaded!`);
          }
        } else {
          alert(`Failed to load preset "${presetName}".`);
        }
      });

      // Delete preset
      $(document).on('click', '.ezroadsmod-delete-preset-btn', function () {
        const presetName = $(this).data('preset-name');
        if (!confirm(`Are you sure you want to delete preset "${presetName}"?`)) {
          return;
        }

        if (deleteCustomPreset(presetName)) {
          refreshPresetsList();
          if (WazeToastr?.Alerts) {
            WazeToastr.Alerts.success('EZRoads Mod', `Preset "${presetName}" deleted!`, false, false, 2000);
          } else {
            alert(`Preset "${presetName}" deleted!`);
          }
        } else {
          alert(`Failed to delete preset "${presetName}".`);
        }
      });
    });
  };
  function scriptupdatemonitor() {
    if (WazeToastr?.Ready) {
      // Create and start the ScriptUpdateMonitor
      const updateMonitor = new WazeToastr.Alerts.ScriptUpdateMonitor(scriptName, scriptVersion, downloadUrl, GM_xmlhttpRequest);
      updateMonitor.start(2, true); // Check every 2 hours, check immediately

      // Show the update dialog for the current version
      WazeToastr.Interface.ShowScriptUpdate(scriptName, scriptVersion, updateMessage, downloadUrl, forumURL);
    } else {
      setTimeout(scriptupdatemonitor, 250);
    }
  }
  scriptupdatemonitor();
  console.log(`${scriptName} initialized.`);

  /*
Changelog

Version
2.6.6 - 2026-01-09
- Roundabouts (segments with junctionId) are now excluded from geometry issue detection and fixing.
- Added user-configurable threshold distance input field for geometry checks:
  - Range: 0.1 to 10 meters
  - Step: 0.1 meter increments
  - Default: 2 meters
- Users can now customize the distance threshold for detecting geometry nodes too close to segment endpoints.
- Fixed geometry issue marker (pin icon) positioning to prevent cropping when using higher threshold values.
- Consolidated duplicate geometry threshold constants into single configurable option.
- Improved settings UI with threshold input field directly below the "Check Geometry issues" checkbox.
- Threshold changes immediately refresh the map display when geometry checking is enabled.
- Fixed issue where auto setting up segment city from connected segments could fail in some cases.
2.6.5 - 2026-01-07
- Enhanced geometry fix icon: Bug icon changes color to red when geometry issues are detected, blue when no issues found.
- Improved geometry fix confirmation messages to show total count of geometry node issues.
- Fixed geometry fix success message to accurately report both segment count and geometry node count.
- Better visual feedback for geometry quality checking status.
2.6.4 - 2026-01-07
- Fixed checkbox mutual exclusion logic for display features.
- "Show Segment Length ≤20m" and "Check Geometry issues near node" checkboxes now work independently from the "Copy Connected Segment Attribute" option.
- These display options can now be enabled/disabled without affecting or being affected by the Copy Connected Segment Attribute feature.
- Improved user interface behavior and option interactions.
2.6.3 - 2026-01-07
- Added "Show Segment Length ≤20m" feature: Displays segment length in an orange circle overlay for segments 20 meters or shorter.
- Added "Check Geometry issues near node" feature: Detects intermediate geometry nodes that are too close (within 2m) to segment start/end nodes.
- Geometry issues are marked with pin (📍) icons on the map.
- Added one-click geometry fix button (bug icon) in the navigation bar to automatically fix all visible geometry issues (requires L3+ rank).
- Added notification badge showing count of geometry issues in the current view.
- Integrated Turf.js library for accurate geometry calculations and distance measurements.
- New settings toggles for both segment length display and geometry quality checking.
- Optimized performance with efficient map viewport tracking and label caching.
- Fixed various minor bugs and improved code stability.
2.6.2 - 2026-01-05
- Fixed auto city detection when "Set city as none" is unchecked. The script now properly checks connected segments for valid cities instead of defaulting to "None" when the displayed city is empty or unavailable.
2.6.1 - 2025-12-29
- Enhanced "Copy Connected Segment Attribute" feature:
  - Now copies all segment attributes including:
    - Direction (one-way A→B, B→A, or two-way)
    - Forward and reverse speed limits
    - Road type
    - Lock rank
    - Elevation level
    - Primary and alternate street names
    - Unpaved status
2.6.0.0 - 2025-12-28
- Added "Current" preset indicator: Shows which preset is currently loaded with a green badge.
- Current indicator disappears when settings are modified, reappears when saved back to the same preset.
- Fixed speed limit removal: Setting speed to 0 or -1 now properly removes speed limits (uses null instead of undefined).
- Improved speed limit update logic with better comparison handling.
- Preset list automatically refreshes when lock levels or speed values are modified.
2.5.9.8 - 2025-12-27
- Temporarily fix for alerts infos not showing issue.
2.5.9.7 - 2025-12-24
- Added custom preset system for saving and loading lock/speed configurations with custom names.
- Users can now save unlimited presets (e.g., "Custom 1", "Highway Settings", "City Streets").
- Load any saved preset with one click to quickly apply lock/speed settings.
- Delete unwanted presets with confirmation.
- Improved UI: Compact design with better spacing and dark mode support.
- Export/Import buttons reorganized into a cleaner layout.
- Preset items use semi-transparent backgrounds for better theme compatibility.
2.5.9.6 - 2025-08-05
- Bug fix: Enhanced "Copy Connected Segment Attribute" logic.
2.5.9.5 - 2025-07-31
- Minor bug fixes.
2.5.9.3 - 2025-07-04
- Updated logic for speed limit. Now it will not update speed limit set to 0 or -1.
2.5.9.2 - 2025-07-03-01
- improved logic for copy first connected segment name and/or city.
- Able to work with road type button in compact mode.
<b>2.5.9 - 2025-06-23</b><br>
- Added a confirmation popup before changing between Street and Footpath/Pedestrianised Area/Stairway types.<br>
- If you cancel, the segment will not be changed.<br>
- Prevents accidental deletion and recreation of special segment types.<br>
- Segment name copying now works for both one-way and two-way segments when converting to pedestrian types.<br>
- When "Copy connected Segment Name" is on, the script copies the name from the connected segment before conversion and applies it after.<br>
- Improved reliability for segment recreation and name copying.<br>
- Includes all previous improvements and bug fixes.<br>
2.5.8 - 2025-06-21</b><br>
- When "Set Street Name to None" is checked, the primary street is set to none and all alternate street names are removed.<br>
- When "Set city as none" is checked, all primary and alternate city names are set to none (empty city).<br>
- "Set street to none" now only handles the street name.<br>
- Added option for setting city to none.<br>
- Lock and speed settings can be exported or imported.<br>
- In case of shortcut key conflict, the shortcut key becomes null.<br>
- Default shortcut key is now "G".<br>
- Minor code cleanup.<br>
- Other behaviors remain unchanged.<br>
2.5.7.4 - 2025-06-15
        - Set street to none only handles street name now.
	   
        - Added option for setting up city to none.
        - The lock and speed setting can be exported or imported.
        - Incase of the shortcutkey conflict, the shortcut key becomes null.
        - Default shortcut key is now "G".
        - Minor code cleanup.
2.5.7 - 2025-06-13
        - Fixed: Autosave now works when "Copy Connected Segment Attribute" is enabled.
        - When both "Autosave on Action" and "Copy Connected Segment Attribute" are checked, pressing the quick update button or shortcut will copy attributes and then autosave.
        - All other options continue to function as before.
2.5.6 - 2025-06-08.02
        - minor bugfixes and UI improvements.
2.5.5 - 2025-06-08.01
        - Improved mutual exclusion logic for "Copy Connected Segment Attribute" and other checkboxes (except Autosave):
            - Checking "Copy Connected Segment Attribute" now unchecks all other options (except Autosave), but does not disable them.
            - Checking any other option (except Autosave) will uncheck "Copy Connected Segment Attribute".
        - Added tooltips for all checkbox options.
        - Fixed radio button selection logic for road types when using keyboard shortcuts.
        - Minor bugfixes and UI improvements.
2.5.5 - 2025-06-08.01
        - Minor bugfixes
2.5.4 - 2025-06-07.01
		    - Road Types can be selected using keyboard shortcuts.
        - Fully migrated to WME SDK.

2.5.3 - 2025-05-31
        - Improved shortcut keybind logic and UI.
        - The unpaved attribute is now copied in Non-compact mode.
        - Minor bug fixes.
2.5.2 - 2025-05-31
        - Improved shortcut keybind logic and UI.
        - Prevented double alerts and unnecessary alerts when keybind is empty.
        - Minor bug fixes.
2.5.1 - 2025-05-30
        - Added "Copy Connected Segment Attribute" option.
        - When enabled, all other options (except Autosave) are automatically unchecked.
        - Copies all major attributes from a connected segment: speed limit, primary name, alias name, city, paved/unpaved status, and lock level.
        - Ensures mutually exclusive logic for this option in the UI.

2.5.0 - 2025-05-29
        - Improved reliability of the unpaved toggle by adding a 500ms delay and fallback logic for both compact and non-compact UI modes.
        - Now ensures paved/unpaved status is always set correctly, regardless of UI mode.
        - Enhanced update logic: skips redundant updates for road type, lock, and speed if already set.
        - Improved city name and segment name copying logic, with more robust alerts and feedback.
        - UI improvements: disables lock/speed controls when their options are off; mutually exclusive logic for "Set Street To None" and "Copy connected Segment Name".
        - Improved logging for easier debugging and tracking.
        - Bug fixes and code cleanup for better reliability and maintainability.
2.4.9 - 2025-05-22
        - Improved reliability of unpaved toggle (500ms delay).
        - Minor bug fixes and code cleanup 
2.4.8 - 2025-05-21
        - Now pave/unpave works better. When unchecked, the segment will be paved!
2.4.7 - 2025-05-21
       Added support for copying alternative segment name from connected segment
       Thanks to -
        - MapOmatic, without him this would not be possible.
2.4.6 - 2025-05-20
       Added support for copying segment name from connected segment
       Limitation -
        - Currently Alt names wont be copied.
2.4.5 - 2025-05-11
       Added Support for HRCS
       Fixed -
        - Various other bugs        
		
*/
})();
