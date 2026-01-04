// ==UserScript==
// @name         Zoom Shortcuts
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2025.09.04
// @description  Adds configurable shortcuts for all zoom levels
// @author       JustinS83
// @match         *://*.waze.com/*editor*
// @exclude       *://*.waze.com/user/editor*
// @exclude       *://*.waze.com/editor/sdk/*
// @contributionURL  https://github.com/WazeDev/Thank-The-Authors
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382122/Zoom%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/382122/Zoom%20Shortcuts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== CONFIGURATION =====

  /**
   * @typedef {Object} Config
   * @property {{min:number, max:number}} ZOOM_RANGE - Min/max zoom levels supported.
   * @property {string} SETTINGS_KEY - LocalStorage key for settings.
   * @property {string} LOG_PREFIX - Prefix for logging output.
   * @property {number} SETTINGS_VERSION - Settings schema version.
   */
  const CONFIG = {
    ZOOM_RANGE: { min: 10, max: 22 },
    SETTINGS_KEY: 'WMEZoomShortcuts_Settings',
    LOG_PREFIX: GM_info.script.name,
    SETTINGS_VERSION: 1,
  };

  /**
   * List of supported zoom shortcut descriptors.
   * @type {Array<{id:string, label:string, level:number}>}
   */
  const ZOOM_SHORTCUTS = Array.from({ length: CONFIG.ZOOM_RANGE.max - CONFIG.ZOOM_RANGE.min + 1 }, (_, i) => {
    const level = CONFIG.ZOOM_RANGE.min + i;
    return { id: `zoom${level}`, label: `Zoom to ${level}`, level };
  });

  /**
   * Keycode mapping for A-Z and 0-9.
   * @type {Object.<number, string>}
   */
  const KEYCODE_MAP = Object.fromEntries([...Array.from({ length: 26 }, (_, i) => [65 + i, String.fromCharCode(65 + i)]), ...Array.from({ length: 10 }, (_, i) => [48 + i, String(i)])]);

  /**
   * Modifier lookup values for conversion.
   * @type {Object.<string, number>}
   */
  const MOD_LOOKUP = { C: 1, S: 2, A: 4 };

  /**
   * Modifier flag values for combo-to-display.
   * @type {Array<{flag:number, char:string}>}
   */
  const MOD_FLAGS = [
    { flag: 1, char: 'C' },
    { flag: 2, char: 'S' },
    { flag: 4, char: 'A' },
  ];

  /**
   * Settings structure in-memory.
   * @type {{version:number, shortcuts: Object.<string, {raw:string|null, combo:string|null}>}}
   */
  let settings = { version: CONFIG.SETTINGS_VERSION, shortcuts: {} };

  // ===== LOGGING =====

  /**
   * Simple console logger with prefix.
   */
  const log = {
    debug: (msg) => console.debug(CONFIG.LOG_PREFIX, msg),
    error: (msg) => console.error(CONFIG.LOG_PREFIX, msg),
  };

  // ===== KEY CONVERSION =====

  /**
   * Converts a shortcut combo string to raw keycode string for the SDK.
   *
   * WHY WE NEED THIS:
   * The WME SDK is inconsistent in what format it returns for shortcut keys:
   * - On initial load: returns combo format ("0", "A+X", "CS+K")
   * - After user changes: returns raw format ("0,48", "4,65", "3,75")
   * - On page reload: back to combo format again
   *
   * To ensure consistency in our storage, we always convert TO raw format
   * because that's the most reliable format for round-trip storage/retrieval.
   *
   * EXAMPLES:
   * "0" -> "0,48" (single key '0' with no modifiers)
   * "A+X" -> "4,88" (Alt + X)
   * "CS+K" -> "3,75" (Ctrl+Shift + K)
   * "3,75" -> "3,75" (already raw, unchanged)
   *
   * @param {string} comboStr - Shortcut string from SDK (format varies!)
   * @returns {string} Always returns raw format "modifier,keycode"
   */
  function comboToRawKeycodes(comboStr) {
    if (!comboStr || typeof comboStr !== 'string') return comboStr;

    // If already in raw form (modifier,keycode), return unchanged
    if (/^\d+,\d+$/.test(comboStr)) return comboStr;

    // Handle single digit/letter (no modifiers) - SDK returns just "0" but we need "0,48"
    if (/^[A-Z0-9]$/.test(comboStr)) {
      return `0,${comboStr.charCodeAt(0)}`;
    }

    // Handle combo format like "A+X", "CS+K", etc.
    const match = comboStr.match(/^([ACS]+)\+([A-Z0-9])$/);
    if (!match) return comboStr;

    const [, modStr, keyStr] = match;
    const modValue = modStr.split('').reduce((acc, m) => acc | (MOD_LOOKUP[m] || 0), 0);
    return `${modValue},${keyStr.charCodeAt(0)}`;
  }

  /**
   * Converts raw shortcut keycode to display combo for UI/logging.
   *
   * WHY WE NEED THIS:
   * While we store everything in raw format for consistency, we need human-readable
   * combo format for:
   * - Logging/debugging output
   * - Registering shortcuts with SDK (it accepts combo format)
   *
   * This handles the SDK's inconsistent return values by normalizing raw format
   * back to readable combo format.
   *
   * EXAMPLES:
   * "0,48" -> "0" (just the '0' key)
   * "4,88" -> "A+X" (Alt + X)
   * "3,75" -> "CS+K" (Ctrl+Shift + K)
   * "A+X" -> "A+X" (already combo format, unchanged)
   *
   * @param {string} keycodeStr - Raw keycode string "modifier,keycode" or combo format
   * @returns {string|null} Human-readable combo format or null if no shortcut
   */
  function shortcutKeycodesToCombo(keycodeStr) {
    if (!keycodeStr || keycodeStr === 'None') return null;

    // If already in combo form, return unchanged
    if (/^([ACS]+\+)?[A-Z0-9]$/.test(keycodeStr)) return keycodeStr;

    // Handle raw format "modifier,keycode" - convert to readable format
    const parts = keycodeStr.split(',');
    if (parts.length !== 2) return keycodeStr;

    const intMod = parseInt(parts[0], 10);
    const keyNum = parseInt(parts[1], 10);
    if (isNaN(intMod) || isNaN(keyNum)) return keycodeStr;

    const modLetters = MOD_FLAGS.filter(({ flag }) => intMod & flag)
      .map(({ char }) => char)
      .join('');

    const keyChar = KEYCODE_MAP[keyNum] || String(keyNum);

    // Return just the key if no modifiers, otherwise "MOD+KEY"
    return modLetters ? `${modLetters}+${keyChar}` : keyChar;
  }

  // ===== LEGACY SUPPORT =====

  /**
   * Mapping legacy setting keys to new shortcut IDs.
   * Only needed once during legacy migration.
   */
  const LEGACY_MAP = {
    ZoomNew10Shortcut: 'zoom10',
    ZoomNew11Shortcut: 'zoom11',
    Zoom0Shortcut: 'zoom12',
    Zoom1Shortcut: 'zoom13',
    Zoom2Shortcut: 'zoom14',
    Zoom3Shortcut: 'zoom15',
    Zoom4Shortcut: 'zoom16',
    Zoom5Shortcut: 'zoom17',
    Zoom6Shortcut: 'zoom18',
    Zoom7Shortcut: 'zoom19',
    Zoom8Shortcut: 'zoom20',
    Zoom9Shortcut: 'zoom21',
    Zoom10Shortcut: 'zoom22',
  };

  /**
   * Converts a legacy shortcut value to {raw, combo} structure.
   *
   * WHY WE NEED THIS:
   * Legacy settings could be stored in various formats:
   * - Just keycode: "90"
   * - Modifier + keycode: "2,90"
   * - Combo + keycode: "CS+90"
   * - Special values: "-1", "None", null
   *
   * We normalize all of these to our standard {raw, combo} structure.
   *
   * @param {string|number} oldValue - Legacy value, e.g. "2,90", "CS+90", "90", -1
   * @returns {{raw:string|null, combo:string|null}}
   */
  function convertLegacyValue(oldValue) {
    // Handle null, undefined, empty, or disabled values
    if (!oldValue || oldValue === '-1' || oldValue === 'None' || oldValue === -1) {
      return { raw: null, combo: null };
    }

    // Convert to string for consistent processing
    const valueStr = String(oldValue);

    // Normalize common legacy formats
    let normalized = valueStr;

    if (/^\d+$/.test(valueStr)) {
      // Just keycode like "90" → "0,90"
      normalized = `0,${valueStr}`;
    } else if (/^([ACS]+)\+(\d+)$/.test(valueStr)) {
      // Combo + keycode like "CS+90" → "3,90"
      const [, modStr, keyStr] = valueStr.match(/^([ACS]+)\+(\d+)$/);
      const modValue = modStr.split('').reduce((acc, m) => acc | (MOD_LOOKUP[m] || 0), 0);
      normalized = `${modValue},${keyStr}`;
    } else if (/^\d+,\d+$/.test(valueStr)) {
      // Already in raw format like "2,90" - use as-is
      normalized = valueStr;
    } else if (/^([ACS]+\+)?[A-Z0-9]$/.test(valueStr)) {
      // Modern combo format like "CS+Z" or "A" - convert using our standard function
      normalized = comboToRawKeycodes(valueStr);
    }
    // If none match, leave as-is and let shortcutKeycodesToCombo handle it

    const combo = shortcutKeycodesToCombo(normalized);

    log.debug(`Legacy conversion: "${oldValue}" → raw:"${normalized}", combo:"${combo}"`);

    return { raw: normalized, combo };
  }

  /**
   * Migrates legacy keys in loadedSettings to new format.
   *
   * WHY THIS IS NEEDED:
   * Previous versions stored shortcuts with different key names and formats.
   * This function maps old setting keys to new shortcut IDs and converts
   * the values to our normalized {raw, combo} structure.
   *
   * EXAMPLE MIGRATION:
   * "Zoom0Shortcut": "2,90" → settings.shortcuts.zoom12 = {raw: "2,90", combo: "S+Z"}
   *
   * @param {Object} loadedSettings - Loaded settings from storage.
   * @returns {boolean} - True if migration occurred.
   */
  function performMigration(loadedSettings) {
    log.debug('Performing migration from legacy settings...');
    let migrated = false;

    Object.entries(LEGACY_MAP).forEach(([oldKey, newId]) => {
      if (loadedSettings[oldKey] !== undefined) {
        // Only migrate if we don't already have a value for the new key
        if (!settings.shortcuts[newId] || (settings.shortcuts[newId].raw === null && settings.shortcuts[newId].combo === null)) {
          const legacyValue = loadedSettings[oldKey];
          settings.shortcuts[newId] = convertLegacyValue(legacyValue);
          log.debug(`Migrated ${oldKey} (${legacyValue}) → ${newId} (${JSON.stringify(settings.shortcuts[newId])})`);
          migrated = true;
        } else {
          log.debug(`Skipped migration of ${oldKey} → ${newId} (already has value)`);
        }

        // Clean up legacy key regardless
        delete loadedSettings[oldKey];
      }
    });

    if (migrated) {
      settings.version = CONFIG.SETTINGS_VERSION;
      log.debug('Migration completed successfully');
      return true;
    } else {
      log.debug('No legacy settings found to migrate');
      return false;
    }
  }

  // ===== SETTINGS STORAGE =====

  /**
   * Loads settings from localStorage, migrates if legacy, ensures all shortcuts initialized.
   *
   * WHY THIS NEEDS TO HANDLE INCONSISTENT DATA:
   * Due to the SDK's inconsistent return formats, we may have stored bad data before
   * implementing the normalization fixes. This function now:
   * 1. Loads existing settings
   * 2. Normalizes any inconsistent raw/combo pairs
   * 3. Migrates legacy settings if found
   * 4. Ensures all shortcuts have proper structure
   *
   * FIXES CASES LIKE:
   * - raw: "0", combo: "0" → raw: "0,48", combo: "0"
   * - raw: "1", combo: "1" → raw: "0,49", combo: "1"
   * - Missing combo values, malformed raw values, etc.
   */
  function loadSettingsFromStorage() {
    try {
      const stored = localStorage.getItem(CONFIG.SETTINGS_KEY);
      const loadedSettings = stored ? JSON.parse(stored) : {};

      // Copy existing structure
      settings.shortcuts = loadedSettings.shortcuts || {};
      settings.version = loadedSettings.version || 0;

      let needsSave = false;

      // Handle version updates and legacy migration
      if (settings.version < CONFIG.SETTINGS_VERSION) {
        log.debug(`Settings version ${settings.version} < ${CONFIG.SETTINGS_VERSION}, checking for migration...`);

        // Look for any legacy keys and migrate them
        const hasLegacyKeys = Object.keys(loadedSettings).some((key) => key in LEGACY_MAP);
        if (hasLegacyKeys) {
          needsSave = performMigration(loadedSettings);
        } else {
          settings.version = CONFIG.SETTINGS_VERSION;
          needsSave = true;
          log.debug('No legacy settings found, updated version number');
        }
      } else {
        log.debug('Settings are current version, skipping migration check');
      }

      // Ensure all possible shortcut keys initialized AND normalize any bad data
      ZOOM_SHORTCUTS.forEach(({ id }) => {
        if (!settings.shortcuts[id]) {
          // No existing data - initialize empty
          settings.shortcuts[id] = { raw: null, combo: null };
        } else {
          // Existing data - validate and normalize it
          const shortcut = settings.shortcuts[id];

          // Check if we have inconsistent/bad raw data (like raw: "0" instead of "0,48")
          if (shortcut.raw && shortcut.combo) {
            // We have both raw and combo - let's verify they're consistent
            const normalizedRaw = comboToRawKeycodes(shortcut.combo);
            const normalizedCombo = shortcutKeycodesToCombo(shortcut.raw);

            // If our stored raw doesn't match what the combo should produce, fix it
            if (shortcut.raw !== normalizedRaw) {
              log.debug(`Normalizing inconsistent data for ${id}: raw "${shortcut.raw}" → "${normalizedRaw}"`);
              shortcut.raw = normalizedRaw;
              needsSave = true;
            }

            // If our stored combo doesn't match what the raw should produce, fix it
            if (shortcut.combo !== normalizedCombo) {
              log.debug(`Normalizing inconsistent data for ${id}: combo "${shortcut.combo}" → "${normalizedCombo}"`);
              shortcut.combo = normalizedCombo;
              needsSave = true;
            }
          } else if (shortcut.raw && !shortcut.combo) {
            // Have raw but missing combo - regenerate combo
            shortcut.combo = shortcutKeycodesToCombo(shortcut.raw);
            needsSave = true;
            log.debug(`Regenerated missing combo for ${id}: "${shortcut.combo}"`);
          } else if (shortcut.combo && !shortcut.raw) {
            // Have combo but missing raw - regenerate raw
            shortcut.raw = comboToRawKeycodes(shortcut.combo);
            needsSave = true;
            log.debug(`Regenerated missing raw for ${id}: "${shortcut.raw}"`);
          }
        }
      });

      // Save if we made any corrections or migrations
      if (needsSave) {
        localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
        log.debug('Settings saved after normalization/migration');
      }
    } catch (e) {
      log.error(`Error loading settings: ${e.message}`);
      // Reset to defaults if corrupted
      settings = { version: CONFIG.SETTINGS_VERSION, shortcuts: {} };
      ZOOM_SHORTCUTS.forEach(({ id }) => {
        settings.shortcuts[id] = { raw: null, combo: null };
      });
      // Save the reset defaults
      try {
        localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
        log.debug('Reset to default settings due to corruption');
      } catch (saveError) {
        log.error(`Failed to save reset settings: ${saveError.message}`);
      }
    }
  }

  /**
   * Saves current shortcut assignments to localStorage.
   *
   * WHY THIS IS COMPLEX:
   * The WME SDK returns different formats at different times:
   * 1. Initial page load: combo format ("0", "A+X")
   * 2. After user changes shortcuts: raw format ("0,48", "4,88")
   * 3. After page reload: back to combo format
   *
   * We normalize everything to raw format for storage consistency, then convert
   * to combo format for display. This ensures our localStorage always has the
   * same structure regardless of when this function runs.
   *
   * STORAGE FORMAT:
   * {
   *   "zoom10": { "raw": "0,48", "combo": "0" },
   *   "zoom20": { "raw": "4,48", "combo": "A+0" }
   * }
   *
   * @param {Object} sdk - WME SDK object
   */
  function saveSettings(sdk) {
    try {
      const allShortcuts = sdk.Shortcuts.getAllShortcuts();
      allShortcuts.forEach((shortcut) => {
        if (settings.shortcuts[shortcut.shortcutId]) {
          const sdkValue = shortcut.shortcutKeys;
          log.debug(`SDK returned for ${shortcut.shortcutId}: "${sdkValue}" (type: ${typeof sdkValue})`);

          const raw = comboToRawKeycodes(sdkValue);
          const combo = shortcutKeycodesToCombo(raw);

          log.debug(`Converted: raw="${raw}", combo="${combo}"`);

          settings.shortcuts[shortcut.shortcutId] = { raw, combo };
        }
      });

      settings.version = CONFIG.SETTINGS_VERSION;
      localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
      log.debug('Settings saved');
    } catch (e) {
      log.error(`Failed to save settings: ${e.message}`);
    }
  }

  // ===== SHORTCUT REGISTRATION =====

  /**
   * Registers all zoom shortcut combos with SDK.
   *
   * WHY WE USE COMBO FORMAT HERE:
   * The SDK's createShortcut() method expects combo format for shortcutKeys:
   * - Works: shortcutKeys: "A+0"
   * - Works: shortcutKeys: "0"
   * - Doesn't work reliably: shortcutKeys: "4,48"
   *
   * So we store raw format for consistency but pass combo format to SDK.
   * We also handle duplicate key errors by resetting conflicting shortcuts.
   *
   * @param {Object} sdk - WME SDK instance.
   */
  function registerShortcuts(sdk) {
    let needsSave = false;

    ZOOM_SHORTCUTS.forEach(({ id, label, level }) => {
      try {
        // SDK expects combo format, not raw format
        const comboKeys = settings.shortcuts[id]?.combo || null;

        sdk.Shortcuts.createShortcut({
          shortcutId: id,
          shortcutKeys: comboKeys, // Use combo format for SDK
          description: label,
          callback: () => sdk.Map.setZoomLevel({ zoomLevel: level }),
        });
      } catch (e) {
        // Handle duplicate key conflicts by resetting to no shortcut
        if (e.message && e.message.includes('already in use')) {
          log.debug(`Duplicate key detected for ${id}, resetting: ${e.message}`);
          settings.shortcuts[id] = { raw: null, combo: null };
          needsSave = true;

          // Try to register again with null (no shortcut)
          try {
            sdk.Shortcuts.createShortcut({
              shortcutId: id,
              shortcutKeys: null,
              description: label,
              callback: () => sdk.Map.setZoomLevel({ zoomLevel: level }),
            });
            log.debug(`Successfully registered ${id} with no shortcut key`);
          } catch (retryError) {
            log.error(`Failed to register ${id} even with null keys: ${retryError.message}`);
          }
        } else {
          log.error(`Failed to register ${id}: ${e.message}`);
        }
      }
    });

    // Save settings if any duplicates were reset
    if (needsSave) {
      try {
        localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
        log.debug('Settings saved after resolving duplicate shortcuts');
      } catch (saveError) {
        log.error(`Failed to save settings after duplicate resolution: ${saveError.message}`);
      }
    }
  }

  // ===== MAIN ENTRYPOINT =====

  /**
   * Initializes the Zoom Shortcuts script.
   * @param {Object} sdk - SDK instance.
   */
  async function main(sdk) {
    try {
      loadSettingsFromStorage();
      registerShortcuts(sdk);

      // Save on tab/window exit
      window.addEventListener('beforeunload', () => saveSettings(sdk));

      /**
       * Global API exposed for debugging and manual ops.
       */
      window.WMEZoomShortcuts = {
        /** Returns a shallow copy of current settings. */
        settings: () => ({ ...settings }),
        /** Logs assignments to dev console. */
        printCurrentAssignments: () => {
          ZOOM_SHORTCUTS.forEach(({ id, label }) => {
            const combo = settings.shortcuts[id]?.combo || '(none)';
            log.debug(`${label} (${id}): ${combo}`);
          });
        },
        /** Triggers save to localStorage immediately. */
        saveSettings: () => saveSettings(sdk),
        /** Reregisters shortcut keys from settings (for debug). */
        reregisterShortcuts: () => registerShortcuts(sdk),
        /** Returns settings version (for diagnostics). */
        getVersion: () => settings.version,
      };

      window.WMEZoomShortcuts.printCurrentAssignments();
      log.debug('...initialized');
    } catch (e) {
      log.error(`Initialization failed: ${e.message}`);
    }
  }

  // ===== SDK INTEGRATION & INIT =====

  // Block load if SDK isn't present.
  if (!window.SDK_INITIALIZED) {
    log.error('SDK_INITIALIZED promise not found');
    return;
  }

  window.SDK_INITIALIZED.then(() => {
    try {
      const sdk = getWmeSdk({
        scriptId: 'wme-zoom-shortcuts',
        scriptName: 'Zoom Shortcuts',
      });

      if (!sdk) throw new Error('Failed to initialize SDK');
      main(sdk);
    } catch (e) {
      log.error(`SDK initialization failed: ${e.message}`);
    }
  }).catch((e) => log.error(`SDK promise rejected: ${e.message}`));
})();
