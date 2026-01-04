// ==UserScript==
// @name         WME EZRoad Mod日本語対応版
// @namespace    https://greasyfork.org/users/1087400
// @version      2.5.9.6
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
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js

// @downloadURL https://update.greasyfork.org/scripts/546777/WME%20EZRoad%20Mod%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%AF%BE%E5%BF%9C%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/546777/WME%20EZRoad%20Mod%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%AF%BE%E5%BF%9C%E7%89%88.meta.js
// ==/UserScript==

/*Script modified from WME EZRoad (https://greasyfork.org/en/scripts/518381-wme-ezsegments) original author: Michaelrosstarr and thanks to him*/

(function main() {
  'use strict';
  const updateMessage = `
<b>2.5.9.6 - 2025-08-05</b><br>
- Bug fix: Enhanced "Copy Connected Segment Attribute" logic.<br>`;
  const scriptName = GM_info.script.name;
  const scriptVersion = GM_info.script.version;
  const downloadUrl = 'https://greasyfork.org/scripts/528552-wme-ezroad-mod/code/wme-ezroad-mod.user.js';
  const forumURL = 'https://greasyfork.org/scripts/528552-wme-ezroad-mod/feedback';
  let wmeSDK;

  // 道路タイプの日本語名を追加
  const roadTypes = [
    { id: 1, name: '高速道路', value: 3, shortcutKey: 'S+1' },
    { id: 2, name: 'ランプ', value: 4, shortcutKey: 'S+2' },
    { id: 3, name: '国道', value: 6, shortcutKey: 'S+3' },
    { id: 4, name: '県道', value: 7, shortcutKey: 'S+4' },
    { id: 5, name: '主要地方道', value: 2, shortcutKey: 'S+5' },
    { id: 6, name: '一般道路', value: 1, shortcutKey: 'S+6' },
    { id: 7, name: '狭い道路', value: 22, shortcutKey: 'S+7' },
    { id: 8, name: 'オフロード', value: 8, shortcutKey: 'S+8' },
    { id: 9, name: '駐車場内通路', value: 20, shortcutKey: 'S+9' },
    { id: 10, name: '私道', value: 17, shortcutKey: 'S+0' },
    { id: 11, name: 'フェリー', value: 15, shortcutKey: 'A+1' },
    { id: 12, name: '鉄道', value: 18, shortcutKey: 'A+2' },
    { id: 13, name: '滑走路', value: 19, shortcutKey: 'A+3' },
    { id: 14, name: '歩道', value: 5, shortcutKey: 'A+4' },
    { id: 15, name: '歩行者エリア', value: 10, shortcutKey: 'A+5' },
    { id: 16, name: '階段', value: 16, shortcutKey: 'A+6' },
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
    const hasAddress = (id) => {
      const addr = wmeSDK.DataModel.Segments.getAddress({ segmentId: id });
      return addr && !addr.isEmpty;
    };
    while (segmentIDsToSearch.length > 0) {
      const startSegmentID = segmentIDsToSearch.pop();
      const connectedSegmentIDs = getConnectedSegmentIDs(startSegmentID);
      const hasAddrSegmentId = connectedSegmentIDs.find(hasAddress);
      if (hasAddrSegmentId) {
        return wmeSDK.DataModel.Segments.getAddress({ segmentId: hasAddrSegmentId });
      }
      nonMatches.push(startSegmentID);
      connectedSegmentIDs.forEach((segmentID) => {
        if (!nonMatches.includes(segmentID) && !segmentIDsToSearch.includes(segmentID)) {
          segmentIDsToSearch.push(segmentID);
        }
      });
    }
    return null;
  }

  const saveOptions = (options) => {
    window.localStorage.setItem('WME_EZRoads_Mod_Options', JSON.stringify(options));
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
              if (WazeWrap?.Alerts) {
                WazeWrap.Alerts.success('EZRoads Mod', `Selected road type: <b>${rt.name}</b>`, false, false, 1500);
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

    log('Completed Init');
  };

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
          if (WazeWrap?.Alerts) {
            WazeWrap.Alerts.error('EZRoads Mod Beta', 'Segment could not be deleted. Please check for restrictions or junctions.');
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
                  wmeSDK.DataModel.Segments.updateSegment({
                    segmentId: id,
                    fwdSpeedLimit: connectedSeg.fwdSpeedLimit,
                    revSpeedLimit: connectedSeg.revSpeedLimit,
                    roadType: connectedSeg.roadType,
                    lockRank: connectedSeg.lockRank,
                  });
                  wmeSDK.DataModel.Segments.updateAddress({
                    segmentId: id,
                    primaryStreetId: connectedSeg.primaryStreetId,
                    alternateStreetIds: connectedSeg.alternateStreetIds || [],
                  });
                  // Copy paved/unpaved
                  const isUnpaved = connectedSeg.flagAttributes && connectedSeg.flagAttributes.unpaved === true;
                  let toggled = false;
                  const segPanel = openPanel;
                  if (segPanel) {
                    const unpavedIcon = segPanel.querySelector('.w-icon-unpaved-fill');
                    if (unpavedIcon) {
                      const unpavedChip = unpavedIcon.closest('wz-checkable-chip');
                      if (unpavedChip) {
                        if (isUnpaved !== (seg.flagAttributes && seg.flagAttributes.unpaved === true)) {
                          unpavedChip.click();
                          toggled = true;
                        }
                      }
                    }
                    if (!toggled) {
                      try {
                        const wzCheckbox = segPanel.querySelector('wz-checkbox[name="unpaved"]');
                        if (wzCheckbox) {
                          const hiddenInput = wzCheckbox.querySelector('input[type="checkbox"][name="unpaved"]');
                          if (hiddenInput && hiddenInput.checked !== isUnpaved) {
                            hiddenInput.click();
                            toggled = true;
                          }
                        }
                      } catch (e) {
                        log('Fallback to non-compact mode unpaved toggle method failed: ' + e);
                      }
                    }
                  }
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
                  wmeSDK.DataModel.Segments.updateSegment({
                    segmentId: id,
                    fwdSpeedLimit: connectedSeg.fwdSpeedLimit,
                    revSpeedLimit: connectedSeg.revSpeedLimit,
                    roadType: connectedSeg.roadType,
                    lockRank: connectedSeg.lockRank,
                  });
                  wmeSDK.DataModel.Segments.updateAddress({
                    segmentId: id,
                    primaryStreetId: connectedSeg.primaryStreetId,
                    alternateStreetIds: connectedSeg.alternateStreetIds || [],
                  });
                  // Copy paved/unpaved
                  const isUnpaved = connectedSeg.flagAttributes && connectedSeg.flagAttributes.unpaved === true;
                  let toggled = false;
                  const segPanel = openPanel;
                  if (segPanel) {
                    const unpavedIcon = segPanel.querySelector('.w-icon-unpaved-fill');
                    if (unpavedIcon) {
                      const unpavedChip = unpavedIcon.closest('wz-checkable-chip');
                      if (unpavedChip) {
                        if (isUnpaved !== (seg.flagAttributes && seg.flagAttributes.unpaved === true)) {
                          unpavedChip.click();
                          toggled = true;
                        }
                      }
                    }
                    if (!toggled) {
                      try {
                        const wzCheckbox = segPanel.querySelector('wz-checkbox[name="unpaved"]');
                        if (wzCheckbox) {
                          const hiddenInput = wzCheckbox.querySelector('input[type="checkbox"][name="unpaved"]');
                          if (hiddenInput && hiddenInput.checked !== isUnpaved) {
                            hiddenInput.click();
                            toggled = true;
                          }
                        }
                      } catch (e) {
                        log('Fallback to non-compact mode unpaved toggle method failed: ' + e);
                      }
                    }
                  }
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
          if (WazeWrap?.Alerts) {
            WazeWrap.Alerts.info('EZRoads Mod', alertMessageParts.join('<br>'), false, false, 5000);
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

                // If speedValue is 0 or less, treat as unset (undefined)
                const speedToSet = !isNaN(speedValue) && speedValue > 0 ? speedValue : undefined;
                const seg = wmeSDK.DataModel.Segments.getById({
                  segmentId: id,
                });
                if (seg.fwdSpeedLimit !== speedToSet || seg.revSpeedLimit !== speedToSet) {
                  wmeSDK.DataModel.Segments.updateSegment({
                    segmentId: id,
                    fwdSpeedLimit: speedToSet,
                    revSpeedLimit: speedToSet,
                  });
                  alertMessageParts.push(`Speed Limit: <b>${speedToSet !== undefined ? speedToSet : 'unset'}</b>`);
                  updatedSpeedLimit = true;
                } else {
                  log(`Segment ID: ${id} already has the target speed limit: ${speedToSet}. Skipping update.`);
                  alertMessageParts.push(`Speed Limit: <b>${speedToSet !== undefined ? speedToSet : 'unset'} exists. Skipping update.</b>`);
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
          // 2. If not found, try connected segment's city
          if (!city) {
            const connectedAddress = getFirstConnectedSegmentAddress(id);
            if (connectedAddress && connectedAddress.city && connectedAddress.city.id) {
              city = wmeSDK.DataModel.Cities.getById({ cityId: connectedAddress.city.id });
            }
          }
          // 3. If still not found, fallback to none
          if (!city) {
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
            street = wmeSDK.DataModel.Streets.getStreet({ cityId: city.id, streetName });
            if (!street) {
              street = wmeSDK.DataModel.Streets.addStreet({ streetName, cityId: city.id });
            }
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
            wmeSDK.DataModel.Segments.updateAddress({
              segmentId: id,
              primaryStreetId: street.id,
              alternateStreetIds: newAltStreetIds.length > 0 ? newAltStreetIds : undefined,
            });
          } else {
            // New/empty street fallback
            let autoCity = getTopCity() || getEmptyCity();
            let autoStreet = wmeSDK.DataModel.Streets.getStreet({ cityId: autoCity.id, streetName: '' });
            if (!autoStreet) {
              autoStreet = wmeSDK.DataModel.Streets.addStreet({ streetName: '', cityId: autoCity.id });
            }
            street = autoStreet;
            city = autoCity;
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
          if (WazeWrap?.Alerts) {
            WazeWrap.Alerts.info('EZRoads Mod', `セグメントを更新しました: ${message}`, false, false, 5000);
          } else {
            alert('EZRoads Mod: セグメントを更新しました');
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
        if (WazeWrap?.Alerts) {
          WazeWrap.Alerts.success('EZRoads Mod', 'Lock Levels saved!', false, false, 1500);
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
        if (WazeWrap?.Alerts) {
          WazeWrap.Alerts.success('EZRoads Mod', 'Speed Values saved!', false, false, 1500);
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
        text: '道路名を未設定にする',
        key: 'setStreet',
        tooltip: '選択したセグメントの道路名を未設定にします。チェックを外すと道路名は変更されません。',
      },
      {
        id: 'setStreetCity',
        text: '市区町村を未設定にする',
        key: 'setStreetCity',
        tooltip: 'チェックすると市区町村を未設定にします。チェックを外すと自動で市区町村が設定されます。',
      },
      {
        id: 'autosave',
        text: '自動保存',
        key: 'autosave',
        tooltip: 'セグメントの更新後に自動的に保存します。',
      },
      {
        id: 'unpaved',
        text: '未舗装に設定',
        key: 'unpaved',
        tooltip: 'セグメントを未舗装に設定します。チェックを外すと舗装済みになります。',
      },
      {
        id: 'setLock',
        text: 'ロックレベルを設定',
        key: 'setLock',
        tooltip: '選択した道路タイプのロックレベルを設定します。',
      },
      {
        id: 'updateSpeed',
        text: '制限速度を更新',
        key: 'updateSpeed',
        tooltip: '選択した道路タイプの制限速度を更新します。',
      },
      {
        id: 'copySegmentName',
        text: '接続セグメントから名称をコピー',
        key: 'copySegmentName',
        tooltip: '接続されたセグメントから道路名と市区町村をコピーします。',
      },
      {
        id: 'copySegmentAttributes',
        text: '接続セグメントから属性をコピー',
        key: 'copySegmentAttributes',
        tooltip: '接続されたセグメントからすべての主要な属性をコピーします。有効にすると自動保存以外のオプションは無効になります。',
      }
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
      const otherClass = option.key !== 'autosave' && option.key !== 'copySegmentAttributes' ? 'ezroadsmod-other-checkbox' : '';
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
        } else if (option.key !== 'autosave') {
          // If any other checkbox (except autosave) is checked, uncheck copySegmentAttributes
          if ($(`#${option.id}`).prop('checked')) {
            $('#copySegmentAttributes').prop('checked', false);
            update('copySegmentAttributes', false);
          }
          update(option.key, $(`#${option.id}`).prop('checked'));
        } else {
          // Autosave
          update(option.key, $(`#${option.id}`).prop('checked'));
        }
      });
      return div;
    };

    // -- Set up the tab for the script
    wmeSDK.Sidebar.registerScriptTab().then(({ tabLabel, tabPane }) => {
      tabLabel.innerText = 'EZRoads Mod';
      tabLabel.title = '道路を簡単に更新';

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
		<div>バージョン: <b>${scriptVersion}</b></div>
		<div>ショートカットキー: <kbd>G</kbd></div>
		<div style="font-size: 0.8em;">WMEのキーボード設定で変更可能です</div>
		</div>`);
      scriptContentPane.append(header);

      // Road type and options header
      const roadTypeHeader = $(`<div class="ezroads-section">
        <div style="display: flex; align-items: center;">
        <div style="flex-grow: 1; text-align: center;">道路タイプ</div>
        <div style="width: 80px; text-align: center;">ロック</div>
        <div style="width: 60px; text-align: center;">速度</div>
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
            <h5>追加オプション</h5>
            <div id="additional-options"></div>
        </div>`);
      scriptContentPane.append(additionalSection);

      const additionalOptions = additionalSection.find('#additional-options');
      checkboxOptions.forEach((option) => {
        additionalOptions.append(createCheckbox(option));
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
      const resetButton = $(`<button class="ezroadsmod-reset-button">すべてのオプションをリセット</button>`);
      resetButton.on('click', function () {
        if (confirm('すべてのオプションをデフォルト値にリセットしますか？ページが再読み込みされます！')) {
          resetOptions();
        }
      });
      scriptContentPane.append(resetButton);

      // --- Export/Import Config UI ---
      const exportImportSection = $(
        `<div class="ezroadsmod-section" style="margin-top:10px;">
          <button id="ezroadsmod-export-btn" style="margin-right:8px;">エクスポート</button>
          <button id="ezroadsmod-import-btn">インポート</button>
          <input id="ezroadsmod-import-input" type="text" placeholder="ここに設定を貼り付け" style="width:60%;margin-left:8px;">
        </div>`
      );
      scriptContentPane.append(exportImportSection);

      // Export logic
      $(document).on('click', '#ezroadsmod-export-btn', function () {
        const options = getOptions();
        const exportData = {
          locks: options.locks,
          speeds: options.speeds,
        };
        const exportStr = JSON.stringify(exportData, null, 2);
        // Copy to clipboard
        navigator.clipboard.writeText(exportStr).then(
          () => {
            if (WazeWrap?.Alerts) {
              WazeWrap.Alerts.success('EZRoads Mod', 'Lock/Speed config copied to clipboard!', false, false, 2000);
            } else {
              alert('Lock/Speed config copied to clipboard!');
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
          if (WazeWrap?.Alerts) {
            WazeWrap.Alerts.success('EZRoads Mod', 'Config imported and applied!', false, false, 2000);
          } else {
            alert('Config imported and applied!');
          }
        } else {
          alert('Config missing lock/speed data!');
        }
      });
    });
  };
  function scriptupdatemonitor() {
    if (WazeWrap?.Ready) {
      bootstrap({ scriptUpdateMonitor: { downloadUrl } });
      WazeWrap.Interface.ShowScriptUpdate(scriptName, scriptVersion, updateMessage, downloadUrl, forumURL);
    } else {
      setTimeout(scriptupdatemonitor, 250);
    }
  }
  // Start the "scriptupdatemonitor"
  scriptupdatemonitor();
  console.log(`${scriptName} initialized.`);

  /*
Change Log

Version
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
