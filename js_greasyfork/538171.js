// ==UserScript==
// @name            WME Road Name Helper NP
// @description     Check suffix and common word abbreviations without leaving WME
// @version         2026.01.18.01
// @author          Kid4rm90s
// @license         MIT
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @connect         greasyfork.org
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @namespace       https://greasyfork.org/users/1087400
// @require         https://greasyfork.org/scripts/560385/code/WazeToastr.js
// @connect         greasyfork.org

// @downloadURL https://update.greasyfork.org/scripts/538171/WME%20Road%20Name%20Helper%20NP.user.js
// @updateURL https://update.greasyfork.org/scripts/538171/WME%20Road%20Name%20Helper%20NP.meta.js
// ==/UserScript==

(function () {
  ('use strict');
  const updateMessage = `
Version 2026.01.18.01:
<strong>Fixed :</strong><br> - Fixed name checking for NH39 - KTM Ring Rd.<br>- Fixed for wrong suggestion for KTM Ring Rd.<br>- Fixed for NH77 - Bharatpur Ringroad now suggested as NH77 - Bharatpur Ring Rd.<br>
`;
  const scriptVersion = GM_info.script.version.toString();
  const scriptName = GM_info.script.name;
  const downloadUrl = GM_info.script.downloadURL;
  const forumURL = 'https://greasyfork.org/en/scripts/538171-wme-road-name-helper-np/feedback';
  const SCRIPT_ID = 'wme-road-name-helper-np';
  const SCAN_DEBOUNCE_DELAY = 200; // 200ms delay after map movement stops
  const PROGRESS_UPDATE_THROTTLE = 10; // Update progress every N segments
  const RESCAN_DELAY_AFTER_FIX = 300; // Delay before rescanning after fix
  const MAX_SEGMENTS_TO_DISPLAY = 100; // Limit displayed segments for performance
  const LAYER_NAME = 'WME Road Name Helper NP'; // Layer name for highlighting

  let sdk;
  let currentMapExtent = null;
  let scanTimeout;
  let scannedSegments = [];
  let isScanning = false;
  let eventSubscriptions = [];
  let previewEnabled = localStorage.getItem('wme-rnh-preview-enabled') === 'true';

  // Cached UI elements
  const cachedElements = {
    scanCounter: null,
    fixAllButton: null,
    resultsContainer: null,
    progressBar: null,
    spinner: null,
  };

  // Suffix Abbreviation Data (Abbreviation: FullWord)
  // This is for suffixes that have standard abbreviations
  const wmessa_approvedAbbr = {
    Ally: 'Alley',
    App: 'Approach',
    Arc: 'Arcade',
    Av: 'Avenue',
    Bwlk: 'Boardwalk',
    Bvd: 'Boulevard',
    Brk: 'Break',
    Bypa: 'Bypass',
    Ch: 'Chase',
    Cct: 'Circuit',
    Cl: 'Close',
    Con: 'Concourse',
    Ct: 'Court',
    Cr: 'Crescent',
    Crst: 'Crest',
    Dr: 'Drive',
    Ent: 'Entrance',
    Esp: 'Esplanade',
    Exp: 'Expressway',
    Ftrl: 'Firetrail',
    Fwy: 'Freeway',
    Glde: 'Glade',
    Gra: 'Grange',
    Gr: 'Grove',
    Hwy: 'Highway',
    Mwy: 'Motorway',
    Pde: 'Parade',
    Pwy: 'Parkway',
    Psge: 'Passage',
    Pl: 'Place',
    Plza: 'Plaza',
    Prom: 'Promenade',
    Qys: 'Quays',
    Rtt: 'Retreat',
    Rdge: 'Ridge',
    Rd: 'Road',
    Sq: 'Square',
    Stps: 'Steps',
    St: 'Street',
    Sbwy: 'Subway',
    Tce: 'Terrace',
    Trk: 'Track',
    Trl: 'Trail',
    Vsta: 'Vista',
  };

  // Suffix Suggestion Data (UserTyped/FullWord: CorrectAbbreviation)
  // This is for suffixes that have specific suggestions
  const wmessa_suggestedAbbr = {
    Alley: 'Ally',
    Approach: 'App',
    Arcade: 'Arc',
    Avenue: 'Av',
    Boardwalk: 'Bwlk',
    Boulevard: 'Bvd',
    Blvd: 'Bvd',
    Break: 'Brk',
    //Bypass: 'Bypa',
    Chase: 'Ch',
    Circuit: 'Cct',
    Close: 'Cl',
    Concourse: 'Con',
    Court: 'Ct',
    Crescent: 'Cr',
    Crest: 'Crst',
    Drive: 'Dr',
    Entrance: 'Ent',
    Esplanade: 'Esp',
    Expressway: 'Exp',
    Firetrail: 'Ftrl',
    Freeway: 'Fwy',
    Glade: 'Glde',
    Grange: 'Gra',
    Grove: 'Gr',
    Highway: 'Hwy',
    Ln: 'Lane',
    Marg: 'Marga',
    Motorway: 'Mwy',
    Parade: 'Pde',
    Parkway: 'Pwy',
    Passage: 'Psge',
    Place: 'Pl',
    Plaza: 'Plza',
    Promenade: 'Prom',
    Quays: 'Qys',
    Retreat: 'Rtt',
    Ridge: 'Rdge',
    Road: 'Rd',
    Square: 'Sq',
    Steps: 'Stps',
    Street: 'St',
    Subway: 'Sbwy',
    Terrace: 'Tce',
    Track: 'Trk',
    Trail: 'Trl',
    Vista: 'Vsta',
    रा१: 'रारा०१',
    रा२: 'रारा०२',
    रा३: 'रारा०३',
    रा४: 'रारा०४',
    रा५: 'रारा०५',
    रा६: 'रारा०६',
    रा७: 'रारा०७',
    रा८: 'रारा०८',
    रा९: 'रारा०९',
    रा१०: 'रारा१०',
    रा११: 'रारा११',
    रा१२: 'रारा१२',
    रा१३: 'रारा१३',
    रा१४: 'रारा१४',
    रा१५: 'रारा१५',
    रा१६: 'रारा१६',
    रा१७: 'रारा१७',
    रा१८: 'रारा१८',
    रा१९: 'रारा१९',
    रा२०: 'रारा२०',
    रा२१: 'रारा२१',
    रा२२: 'रारा२२',
    रा२३: 'रारा२३',
    रा२४: 'रारा२४',
    रा२५: 'रारा२५',
    रा२६: 'रारा२६',
    रा२७: 'रारा२७',
    रा२८: 'रारा२८',
    रा२९: 'रारा२९',
    रा३०: 'रारा३०',
    रा३१: 'रारा३१',
    रा३२: 'रारा३२',
    रा३३: 'रारा३३',
    रा३४: 'रारा३४',
    रा३५: 'रारा३५',
    रा३६: 'रारा३६',
    रा३७: 'रारा३७',
    रा३८: 'रारा३८',
    रा३९: 'रारा३९',
    रा४०: 'रारा४०',
    रा४१: 'रारा४१',
    रा४२: 'रारा४२',
    रा४३: 'रारा४३',
    रा४४: 'रारा४४',
    रा४५: 'रारा४५',
    रा४६: 'रारा४६',
    रा४७: 'रारा४७',
    रा४८: 'रारा४८',
    रा४९: 'रारा४९',
    रा५०: 'रारा५०',
    रा५१: 'रारा५१',
    रा५२: 'रारा५२',
    रा५३: 'रारा५३',
    रा५४: 'रारा५४',
    रा५५: 'रारा५५',
    रा५६: 'रारा५६',
    रा५७: 'रारा५७',
    रा५८: 'रारा५८',
    रा५९: 'रारा५९',
    रा६०: 'रारा६०',
    रा६१: 'रारा६१',
    रा६२: 'रारा६२',
    रा६३: 'रारा६३',
    रा६४: 'रारा६४',
    रा६५: 'रारा६५',
    रा६६: 'रारा६६',
    रा६७: 'रारा६७',
    रा६८: 'रारा६८',
    रा६९: 'रारा६९',
    रा७०: 'रारा७०',
    रा७१: 'रारा७१',
    रा७२: 'रारा७२',
    रा७३: 'रारा७३',
    रा७४: 'रारा७४',
    रा७५: 'रारा७५',
    रा७६: 'रारा७६',
    रा७७: 'रारा७७',
    रा७८: 'रारा७८',
    रा७९: 'रारा७९',
    रा८०: 'रारा८०',
    AH02: 'AH2',
    Ringroad: 'Ring Rd',
  };

  // Suffixes that should be preserved in title case (case-insensitive)
  // These words will not be converted to lowercase in title case
  // This is useful for words that are proper nouns or have specific casing requirements.
  const wmessa_preserveCaseWords = [
    'NH01',
    'NH02',
    'NH03',
    'NH04',
    'NH05',
    'NH06',
    'NH07',
    'NH08',
    'NH09',
    'NH10',
    'NH11',
    'NH12',
    'NH13',
    'NH14',
    'NH15',
    'NH16',
    'NH17',
    'NH18',
    'NH19',
    'NH20',
    'NH21',
    'NH22',
    'NH23',
    'NH24',
    'NH25',
    'NH26',
    'NH27',
    'NH28',
    'NH29',
    'NH30',
    'NH31',
    'NH32',
    'NH33',
    'NH34',
    'NH35',
    'NH36',
    'NH37',
    'NH38',
    'NH39',
    'NH40',
    'NH41',
    'NH42',
    'NH43',
    'NH44',
    'NH45',
    'NH46',
    'NH47',
    'NH48',
    'NH49',
    'NH50',
    'NH51',
    'NH52',
    'NH53',
    'NH54',
    'NH55',
    'NH56',
    'NH57',
    'NH58',
    'NH59',
    'NH60',
    'NH61',
    'NH62',
    'NH63',
    'NH64',
    'NH65',
    'NH66',
    'NH67',
    'NH68',
    'NH69',
    'NH70',
    'NH71',
    'NH72',
    'NH73',
    'NH74',
    'NH75',
    'NH76',
    'NH77',
    'NH78',
    'NH79',
    'NH80',
    'AH1',
    'AH2',
    'AH3',
    'AH4',
    'AH5',
    'AH6',
    'AH7',
    'AH8',
    'AH9',
    'AH10',
    'AH42',
    'KTM',
  ];

  // Highway Suffix Suggestion Data (EXACT match only)
  // This is for highway abbreviations that have specific suggestions
  const wmessa_suggestedHwyAbbr = {
    'NH01-': 'NH01 - रारा०१',
    'NH02-': 'NH02 - रारा०२',
    'NH03-': 'NH03 - रारा०३',
    'NH04-': 'NH04 - रारा०४',
    'NH05-': 'NH05 - रारा०५',
    'NH06-': 'NH06 - रारा०६',
    'NH07-': 'NH07 - रारा०७',
    'NH08-': 'NH08 - रारा०८',
    'NH09-': 'NH09 - रारा०९',
    'NH10-': 'NH10 - रारा१०',
    'NH11-': 'NH11 - रारा११',
    'NH12-': 'NH12 - रारा१२',
    'NH13-': 'NH13 - रारा१३',
    'NH14-': 'NH14 - रारा१४',
    'NH15-': 'NH15 - रारा१५',
    'NH16-': 'NH16 - रारा१६',
    'NH17-': 'NH17 - रारा१७',
    'NH18-': 'NH18 - रारा१८',
    'NH19-': 'NH19 - रारा१९',
    'NH20-': 'NH20 - रारा२०',
    'NH21-': 'NH21 - रारा२१',
    'NH22-': 'NH22 - रारा२२',
    'NH23-': 'NH23 - रारा२३',
    'NH24-': 'NH24 - रारा२४',
    'NH25-': 'NH25 - रारा२५',
    'NH26-': 'NH26 - रारा२६',
    'NH27-': 'NH27 - रारा२७',
    'NH28-': 'NH28 - रारा२८',
    'NH29-': 'NH29 - रारा२९',
    'NH30-': 'NH30 - रारा३०',
    'NH31-': 'NH31 - रारा३१',
    'NH32-': 'NH32 - रारा३२',
    'NH33-': 'NH33 - रारा३३',
    'NH34-': 'NH34 - रारा३४',
    'NH35-': 'NH35 - रारा३५',
    'NH36-': 'NH36 - रारा३६',
    'NH37-': 'NH37 - रारा३७',
    'NH38-': 'NH38 - रारा३८',
    'NH39-': 'NH39 - रारा३९',
    'NH40-': 'NH40 - रारा४०',
    'NH41-': 'NH41 - रारा४१',
    'NH42-': 'NH42 - रारा४२',
    'NH43-': 'NH43 - रारा४३',
    'NH44-': 'NH44 - रारा४४',
    'NH45-': 'NH45 - रारा४५',
    'NH46-': 'NH46 - रारा४६',
    'NH47-': 'NH47 - रारा४७',
    'NH48-': 'NH48 - रारा४८',
    'NH49-': 'NH49 - रारा४९',
    'NH50-': 'NH50 - रारा५०',
    'NH51-': 'NH51 - रारा५१',
    'NH52-': 'NH52 - रारा५२',
    'NH53-': 'NH53 - रारा५३',
    'NH54-': 'NH54 - रारा५४',
    'NH55-': 'NH55 - रारा५५',
    'NH56-': 'NH56 - रारा५६',
    'NH57-': 'NH57 - रारा५७',
    'NH58-': 'NH58 - रारा५८',
    'NH59-': 'NH59 - रारा५९',
    'NH60-': 'NH60 - रारा६०',
    'NH61-': 'NH61 - रारा६१',
    'NH62-': 'NH62 - रारा६२',
    'NH63-': 'NH63 - रारा६३',
    'NH64-': 'NH64 - रारा६४',
    'NH65-': 'NH65 - रारा६५',
    'NH66-': 'NH66 - रारा६६',
    'NH67-': 'NH67 - रारा६७',
    'NH68-': 'NH68 - रारा६८',
    'NH69-': 'NH69 - रारा६९',
    'NH70-': 'NH70 - रारा७०',
    'NH71-': 'NH71 - रारा७१',
    'NH72-': 'NH72 - रारा७२',
    'NH73-': 'NH73 - रारा७३',
    'NH74-': 'NH74 - रारा७४',
    'NH75-': 'NH75 - रारा७५',
    'NH76-': 'NH76 - रारा७६',
    'NH77-': 'NH77 - रारा७७',
    'NH78-': 'NH78 - रारा७८',
    'NH79-': 'NH79 - रारा७९',
    'NH80-': 'NH80 - रारा८०',
  };

  // Suffixes with No Standard Abbreviation
  const wmessa_knownNoAbbr = ['Lane', 'Loop', 'Mall', 'Mews', 'Path', 'Ramp', 'Rise', 'View', 'Walk', 'Way'];

  // --- NEW DATA FOR GENERAL WORDS (PRE-SUFFIX) ---
  // General Word Suggestion Data (WordToAbbreviate: Abbreviation)
  const wmessa_generalWordSuggestions = {
    Mount: 'Mt',
    Saint: 'St', // Note: "St" for Saint. Suffix logic handles "St" for Street.
    Fort: 'Ft',
    Marg: 'Marga', // Nepal: "Marg" should be expanded to full word "Marga"
    // Add other common words like "North": "N", "South": "S", etc., if standard for pre-suffix words.
  };

  // General Word Approved Abbreviation Data (Abbreviation: FullWord) - for validation
  const wmessa_generalWordApprovedAbbr = {
    Mt: 'Mount',
    St: 'Saint',
    Ft: 'Fort',
    Marga: 'Marg', // Nepal: "Marga" is the approved full word form
    // e.g. "N": "North", "S": "South"
  };

  function wmessa_titleCase(str) {
    return str
      .split(/\s+/)
      .map(function (txt) {
        // If word matches a preserve-case word (case-insensitive), use the preserved version
        const preserve = wmessa_preserveCaseWords.find((w) => w.toLowerCase() === txt.toLowerCase());
        if (preserve) return preserve;
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      })
      .join(' ');
  }

  let wmessa_valueObserver;

  // Add styles for sidebar panel
  function addSidebarStyles() {
    const styles = [
      '.rnh-container { margin: 10px 5px; }',
      '.rnh-title { font-weight: bold; margin-bottom: 10px; }',
      '.rnh-scan-counter { color: #666; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }',
      '.rnh-spinner { animation: rnh-spin 0.5s infinite linear; }',
      '@keyframes rnh-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }',
      '.rnh-progress-bar { width: 1%; height: 8px; background-color: #4CAF50; margin-bottom: 10px; border: 1px solid #333; transition: width 0.3s ease; display: none; }',
      '.rnh-results { max-height: 400px; overflow-y: auto; }',
      '.rnh-segment-item { padding: 8px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9; cursor: pointer; }',
      '.rnh-segment-item:hover { background: #f0f0f0; border-color: #999; }',
      '.rnh-segment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }',
      '.rnh-segment-id { font-size: 11px; color: #666; cursor: pointer; }',
      '.rnh-segment-id:hover { color: #0066cc; text-decoration: underline; }',
      '.rnh-road-type { font-size: 11px; color: #666; background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }',
      '.rnh-name-row { margin-bottom: 3px; font-size: 12px; }',
      '.rnh-name-label { font-weight: bold; color: #555; min-width: 40px; display: inline-block; }',
      '.rnh-current-name { color: #d32f2f; }',
      '.rnh-suggested-name { color: #388e3c; }',
      '.rnh-fix-button { padding: 4px 8px; font-size: 11px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; }',
      '.rnh-fix-button:hover { background: #45a049; }',
      '.rnh-fix-button:disabled { background: #ccc; cursor: not-allowed; }',
      '.rnh-fix-all-button { width: 100%; padding: 8px; margin-bottom: 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }',
      '.rnh-fix-all-button:hover { background: #1976D2; }',
      '.rnh-fix-all-button:disabled { background: #ccc; cursor: not-allowed; }',
      '.rnh-no-issues { text-align: center; color: #4CAF50; padding: 20px; font-weight: bold; }',
      '.rnh-alt-names { margin-top: 5px; padding-left: 10px; border-left: 2px solid #ddd; }',
      '.rnh-complete-icon { color: #4CAF50; }',
      '.rnh-button-container { margin-bottom: 10px; }',
      '.rnh-preview-container { margin-bottom: 10px; display: flex; align-items: center; gap: 5px; }',
      '.rnh-preview-checkbox { margin: 0; }',
      '.rnh-preview-label { margin: 0; font-size: 13px; cursor: pointer; }',
    ].join('\n');

    GM_addStyle(styles);
  }

  function wmessa_init() {
    // Initialize sidebar panel
    initSidebarPanel();

    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node.classList && node.classList.contains('address-edit-card')) {
              if (wmessa_valueObserver) {
                wmessa_valueObserver.disconnect();
              }
            }
          });

          mutation.addedNodes.forEach((node) => {
            if (node.classList && node.classList.contains('address-edit-card')) {
              setTimeout(() => {
                // Main street name
                const streetNameInput = node.querySelector('wz-autocomplete.street-name');
                if (streetNameInput && streetNameInput.shadowRoot) {
                  const wzTextInput = streetNameInput.shadowRoot.querySelector('wz-text-input');
                  if (wzTextInput) {
                    wmessa_monitor(wzTextInput);
                  } else {
                    console.warn('WMESSA: wz-text-input not found in street-name shadowRoot.');
                  }
                } else {
                  console.warn('WMESSA: street-name input or its shadowRoot not found.');
                }
                // Alt street name(s)
                const altStreetInputs = node.querySelectorAll('wz-autocomplete.alt-street-name');
                altStreetInputs.forEach((altInput) => {
                  if (altInput && altInput.shadowRoot) {
                    const altWzTextInput = altInput.shadowRoot.querySelector('wz-text-input');
                    if (altWzTextInput) {
                      wmessa_monitor(altWzTextInput);
                    } else {
                      console.warn('WMESSA: wz-text-input not found in alt-street-name shadowRoot.');
                    }
                  } else {
                    console.warn('WMESSA: alt-street-name input or its shadowRoot not found.');
                  }
                });
              }, 250);
            }
          });
        }
      });
    });
    const editPanel = document.getElementById('edit-panel');
    if (editPanel) {
      observer.observe(editPanel, { childList: true, subtree: true });
    } else {
      console.warn('WMESSA: Edit panel not found for observer.');
    }
  }

  // Also observe for alt street card (for alt names)
  const altStreetPanelObserver = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.classList && node.classList.contains('edit-alt-street-card')) {
            setTimeout(() => {
              const altStreetInput = node.querySelector('wz-autocomplete.alt-street-name');
              if (altStreetInput && altStreetInput.shadowRoot) {
                const altWzTextInput = altStreetInput.shadowRoot.querySelector('wz-text-input');
                if (altWzTextInput) {
                  wmessa_monitor(altWzTextInput);
                } else {
                  console.warn('WMESSA: wz-text-input not found in alt-street-name shadowRoot (alt card).');
                }
              } else {
                console.warn('WMESSA: alt-street-name input or its shadowRoot not found (alt card).');
              }
            }, 250);
          }
        });
      }
    });
  });
  // Observe the whole document for alt street cards
  altStreetPanelObserver.observe(document.body, { childList: true, subtree: true });

  function wmessa_monitor(element) {
    let abbrContainer = document.createElement('div');
    abbrContainer.id = 'WMESSA_container';
    abbrContainer.innerHTML =
      '<div class="WMESSA_icon" title="WME Standard Suffix Abbreviations"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M4.5 2A2.5 2.5 0 0 0 2 4.5v2.879a2.5 2.5 0 0 0 .732 1.767l4.5 4.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-4.5-4.5A2.5 2.5 0 0 0 7.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" /></svg></div>' +
      '<div id="WMESSA_output">Loading...</div>';

    const statusTextContainer = element.shadowRoot.querySelector('.status-text-container');
    if (!statusTextContainer) {
      console.warn('WMESSA: .status-text-container not found. UI will not be displayed.');
      return;
    }
    statusTextContainer.insertBefore(abbrContainer, statusTextContainer.firstChild);

    let abbrOutput = abbrContainer.querySelector('#WMESSA_output');

    const css = [
      '.status-text-container {width: calc(100% + ' +
        (document.querySelector('#edit-panel .address-edit-card .street-name-row .tts-playback') ? document.querySelector('#edit-panel .address-edit-card .street-name-row .tts-playback').offsetWidth : 0) +
        'px); display: flex; flex-direction: column-reverse;}',
      '#WMESSA_container {display: flex; align-items: center; flex-grow: 1; margin-top: var(--wz-label-margin, 8px); padding: 0 2px; border-radius: 5px; background: #ffffff; color: #ffffff; gap: 5px; cursor: default; transition: background 0.25s linear, color 0.25s linear; font-size: 0.9em;}',
      '#WMESSA_output {color: #000000; white-space: pre-wrap; flex-grow: 1;}',
      '.WMESSA_icon {display: inline-flex; padding: 2px; height: 12px; background: rgba(0,0,0,0.5); border-radius: 3px; flex-shrink: 0; margin-right: 5px;}',
      '.WMESSA_icon svg {height: 100%;}',
      '#WMESSA_container.info {background: #e0f2fe; color: #e0f2fe;}',
      '#WMESSA_container.check {background: #fef3c7; color: #fef3c7; cursor: pointer;}',
      '#WMESSA_container.check:hover {background: #fde68a; color: #fde68a;}',
      '#WMESSA_container.valid {background: #d1fae5; color: #d1fae5;}',
    ].join(' ');
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.textContent = css;
    element.shadowRoot.appendChild(styleElement);

    if (wmessa_valueObserver) {
      wmessa_valueObserver.disconnect();
    }
    wmessa_valueObserver = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
          wmessa_update(element, abbrContainer, abbrOutput);
        }
      }
    });
    wmessa_valueObserver.observe(element, { attributes: true });

    wmessa_update(element, abbrContainer, abbrOutput);

    // Add Tab key support for applying suggestion
    element.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        const abbrContainer = element.shadowRoot.querySelector('#WMESSA_container');
        if (abbrContainer && abbrContainer.classList.contains('check')) {
          const abbrOutput = abbrContainer.querySelector('#WMESSA_output');
          // Simulate click to apply suggestion
          abbrContainer.click();
          e.preventDefault();
        }
      }
    });
  }

  function wmessa_analyzeSuffix(suffix) {
    const suffixLower = suffix.toLowerCase();
    let result = { status: 'info', message: 'No match for suffix.', proposed: suffix, original: suffix };

    const isKnownNoAbbrExact = (sLower) => wmessa_knownNoAbbr.some((kna) => kna.toLowerCase() === sLower);
    const getKnownNoAbbrCased = (sLower) => wmessa_knownNoAbbr.find((kna) => kna.toLowerCase() === sLower);

    // 0. Exact match for highway abbreviations (special case)
    const hwyKey = Object.keys(wmessa_suggestedHwyAbbr).find((key) => key.toLowerCase() === suffixLower);
    if (hwyKey) {
      const suggestedHwy = wmessa_suggestedHwyAbbr[hwyKey];
      if (suggestedHwy.toLowerCase() !== suffixLower) {
        return { status: 'check', message: `Use ${suggestedHwy} for ${hwyKey}`, proposed: suggestedHwy, original: suffix };
      } else {
        return { status: 'valid', message: `${suggestedHwy}`, proposed: suggestedHwy, original: suffix };
      }
    }

    // 1. Exact match: Typed IS an approved abbreviation (e.g., "Rd")
    if (wmessa_approvedAbbr.hasOwnProperty(suffix)) {
      return { status: 'valid', message: `${suffix} for ${wmessa_approvedAbbr[suffix]}`, proposed: suffix, original: suffix };
    }
    const approvedKeyCi = Object.keys(wmessa_approvedAbbr).find((k) => k.toLowerCase() === suffixLower);
    if (approvedKeyCi) {
      return { status: 'valid', message: `${approvedKeyCi} for ${wmessa_approvedAbbr[approvedKeyCi]}`, proposed: approvedKeyCi, original: suffix };
    }

    // 2. Exact match: Typed IS a known non-abbreviated suffix (e.g., "Lane")
    if (isKnownNoAbbrExact(suffixLower)) {
      const casedNoAbbr = getKnownNoAbbrCased(suffixLower) || suffix;
      return { status: 'valid', message: casedNoAbbr, proposed: casedNoAbbr, original: suffix };
    }

    const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const suffixRegex = new RegExp(`^${escapedSuffix}`, 'i');

    // 3. Suggestion: Typed is (prefix of) a full word that should be abbreviated (e.g., "Street" or "Stre" -> "St")
    let suggestFromFullKey = Object.keys(wmessa_suggestedAbbr).find((key) => key.toLowerCase() === suffixLower);
    if (!suggestFromFullKey) {
      suggestFromFullKey = Object.keys(wmessa_suggestedAbbr).find((key) => suffixRegex.test(key));
    }
    if (suggestFromFullKey) {
      const suggestedAbbr = wmessa_suggestedAbbr[suggestFromFullKey];
      if (suggestedAbbr.toLowerCase() !== suffixLower) {
        return { status: 'check', message: `Use ${suggestedAbbr} for ${suggestFromFullKey}`, proposed: suggestedAbbr, original: suffix };
      } else {
        // Typed the same as the suggestion (e.g. typed "Lane", suggested "Lane" because "Ln":"Lane")
        if (isKnownNoAbbrExact(suggestedAbbr.toLowerCase())) {
          const casedNoAbbr = getKnownNoAbbrCased(suggestedAbbr.toLowerCase()) || suggestedAbbr;
          return { status: 'valid', message: casedNoAbbr, proposed: casedNoAbbr, original: suffix };
        }
        const finalApprovedKeyCi = Object.keys(wmessa_approvedAbbr).find((k) => k.toLowerCase() === suggestedAbbr.toLowerCase());
        if (finalApprovedKeyCi) {
          return { status: 'valid', message: `${finalApprovedKeyCi} for ${wmessa_approvedAbbr[finalApprovedKeyCi]}`, proposed: finalApprovedKeyCi, original: suffix };
        }
      }
    }

    // 4. Suggestion: Typed is (prefix of) a known non-abbreviated word (e.g., "Lan" -> "Lane")
    const knownNoAbbrCompletion = wmessa_knownNoAbbr.find((key) => suffixRegex.test(key));
    if (knownNoAbbrCompletion && knownNoAbbrCompletion.toLowerCase() !== suffixLower) {
      return { status: 'check', message: `Use ${knownNoAbbrCompletion}`, proposed: knownNoAbbrCompletion, original: suffix };
    }

    // 5. Suggestion: Typed is (prefix of) an approved abbreviation (e.g., "Al" -> "Ally")
    const approvedAbbrCompletionKey = Object.keys(wmessa_approvedAbbr).find((key) => suffixRegex.test(key));
    if (approvedAbbrCompletionKey && approvedAbbrCompletionKey.toLowerCase() !== suffixLower) {
      return { status: 'check', message: `Use ${approvedAbbrCompletionKey} for ${wmessa_approvedAbbr[approvedAbbrCompletionKey]}`, proposed: approvedAbbrCompletionKey, original: suffix };
    }

    return result;
  }

  function wmessa_update(element, abbrContainer, abbrOutput) {
    abbrContainer.classList.remove('valid', 'check', 'info');
    abbrContainer.onclick = null;
    abbrOutput.innerText = 'Awaiting input...';

    const currentValue = element.value.trim();
    if (!currentValue) {
      return;
    }

    if (currentValue.match(/^The [a-zA-Z0-9\s'-]+$/i) && currentValue.split(/\s+/).length <= 3) {
      // "The x" or "The x y"
      abbrContainer.classList.add('info');
      abbrOutput.innerText = "Do not abbreviate 'The x' names";
      return;
    }

    let currentWords = currentValue.split(/\s+/);
    let proposedWords = [...currentWords];
    let preSuffixChangesMade = false;
    let overallStatus = 'info';
    let messages = [];

    // --- Process Pre-Suffix Words ---
    if (currentWords.length > 1) {
      for (let i = 0; i < currentWords.length - 1; i++) {
        const word = currentWords[i];
        const wordLower = word.toLowerCase();

        const generalApprovedKeyCi = Object.keys(wmessa_generalWordApprovedAbbr).find((k) => k.toLowerCase() === wordLower);
        if (generalApprovedKeyCi) {
          // Word is already an approved general abbreviation
          if (word !== generalApprovedKeyCi) {
            // Correct casing if needed
            proposedWords[i] = generalApprovedKeyCi;
            preSuffixChangesMade = true;
          }
          continue;
        }

        const generalSuggestionKeyCi = Object.keys(wmessa_generalWordSuggestions).find((k) => k.toLowerCase() === wordLower);
        if (generalSuggestionKeyCi) {
          const suggestedGeneralAbbr = wmessa_generalWordSuggestions[generalSuggestionKeyCi];
          if (suggestedGeneralAbbr.toLowerCase() !== wordLower) {
            proposedWords[i] = suggestedGeneralAbbr;
            preSuffixChangesMade = true;
          }
        }
      }
    }

    // --- Process Suffix (last word) ---
    let suffixAnalysis = {
      status: 'info',
      message: currentWords.length > 0 ? 'Awaiting valid suffix.' : 'Awaiting input.',
      proposed: currentWords.length > 0 ? currentWords[currentWords.length - 1] : '',
      original: currentWords.length > 0 ? currentWords[currentWords.length - 1] : '',
    };
    if (currentWords.length > 0) {
      const potentialSuffix = currentWords[currentWords.length - 1];
      suffixAnalysis = wmessa_analyzeSuffix(potentialSuffix);
      proposedWords[currentWords.length - 1] = suffixAnalysis.proposed;
    }

    // --- Combine Results and Determine UI ---
    const finalProposedString = wmessa_titleCase(proposedWords.join(' '));
    const suffixChanged = currentWords.length > 0 && suffixAnalysis.proposed.toLowerCase() !== suffixAnalysis.original.toLowerCase();
    const capitalizationChanged = currentValue !== finalProposedString;
    let anyChangeProposed = preSuffixChangesMade || suffixChanged || capitalizationChanged;

    if (anyChangeProposed) {
      overallStatus = 'check';
      let suggestionDetails = [];
      if (preSuffixChangesMade) suggestionDetails.push('word(s) before suffix');
      if (suffixChanged) suggestionDetails.push('suffix');

      messages.push(`Suggest: "${finalProposedString}"`);
      if (suggestionDetails.length > 0) {
        messages.push(`(Changes to ${suggestionDetails.join(' & ')})`);
      }
      if (suffixChanged && suffixAnalysis.message && suffixAnalysis.message.startsWith('Use ')) {
        messages.push(suffixAnalysis.message); // Add specific suffix suggestion message
      }

      abbrContainer.onclick = function () {
        element.value = finalProposedString;
      };
    } else {
      // No changes proposed, evaluate if current input is valid or just no rules hit
      let allWordsAreStandard = true; // Assume true unless a known full word (that can be abbreviated) is found
      if (currentWords.length > 1) {
        for (let i = 0; i < currentWords.length - 1; i++) {
          const word = currentWords[i];
          const wordLower = word.toLowerCase();
          // Check if it's a full word that *could* be abbreviated, but isn't
          const canBeAbbreviatedKey = Object.keys(wmessa_generalWordSuggestions).find((k) => k.toLowerCase() === wordLower);
          // And it's not already an abbreviation of itself or something else
          const isAbbreviation = Object.keys(wmessa_generalWordApprovedAbbr).find((k) => k.toLowerCase() === wordLower);
          if (canBeAbbreviatedKey && !isAbbreviation) {
            allWordsAreStandard = false;
            break;
          }
        }
      }

      if (suffixAnalysis.status === 'valid' && allWordsAreStandard) {
        overallStatus = 'valid';
        messages.push(suffixAnalysis.message || `"${currentValue}" is standard.`);
      } else {
        overallStatus = 'info'; // Default to info if not perfectly valid or no suggestions
        if (!allWordsAreStandard) {
          messages.push('Consider standard abbreviations for words before suffix.');
        }
        if (suffixAnalysis.status === 'info') {
          messages.push(suffixAnalysis.message || 'Check suffix standards.');
        } else if (suffixAnalysis.status === 'valid' && !allWordsAreStandard) {
          // Suffix is fine, but pre-words are not optimal
          messages.push(`Suffix "${suffixAnalysis.proposed}" is standard.`);
        } else {
          messages.push(suffixAnalysis.message || `Review standards for "${currentValue}"`);
        }
      }
    }

    abbrContainer.classList.add(overallStatus);
    abbrOutput.innerText = messages.filter((m) => m).join('\n') || 'Awaiting input or check standards.';
  }

  // ========== SIDEBAR PANEL FUNCTIONS ==========

  async function initSidebarPanel() {
    try {
      addSidebarStyles();

      const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();

      // Set tab label
      tabLabel.textContent = 'RNH';
      tabLabel.title = 'Road Name Helper';

      // Create main container
      const container = document.createElement('div');
      container.className = 'rnh-container';

      // Title
      const title = document.createElement('wz-overline');
      title.textContent = 'Road Name Helper';
      title.style.marginBottom = '10px';
      container.appendChild(title);

      // Version
      const version = document.createElement('wz-label');
      version.textContent = `Version ${scriptVersion}`;
      version.style.marginBottom = '10px';
      container.appendChild(version);

      // Preview checkbox
      const previewContainer = document.createElement('div');
      previewContainer.className = 'rnh-preview-container';
      const previewCheckbox = document.createElement('input');
      previewCheckbox.type = 'checkbox';
      previewCheckbox.id = 'rnh-preview-checkbox';
      previewCheckbox.className = 'rnh-preview-checkbox';
      previewCheckbox.checked = previewEnabled;
      previewCheckbox.onchange = onPreviewChanged;
      const previewLabel = document.createElement('label');
      previewLabel.htmlFor = 'rnh-preview-checkbox';
      previewLabel.className = 'rnh-preview-label';
      previewLabel.textContent = 'Preview (highlight segments with issues)';
      previewContainer.appendChild(previewCheckbox);
      previewContainer.appendChild(previewLabel);
      container.appendChild(previewContainer);

      // Scan counter
      const scanCounter = document.createElement('div');
      scanCounter.className = 'rnh-scan-counter';
      scanCounter.innerHTML = '<i class="fa fa-check-circle rnh-complete-icon"></i><span>Scanned: 0 segments</span>';
      container.appendChild(scanCounter);
      cachedElements.scanCounter = scanCounter;

      // Progress bar
      const progressBar = document.createElement('div');
      progressBar.className = 'rnh-progress-bar';
      container.appendChild(progressBar);
      cachedElements.progressBar = progressBar;

      // Fix All button
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'rnh-button-container';
      const fixAllButton = document.createElement('button');
      fixAllButton.className = 'rnh-fix-all-button';
      fixAllButton.textContent = 'Fix All Names';
      fixAllButton.disabled = true;
      fixAllButton.onclick = fixAllNames;
      buttonContainer.appendChild(fixAllButton);
      container.appendChild(buttonContainer);
      cachedElements.fixAllButton = fixAllButton;

      // Results container
      const resultsContainer = document.createElement('div');
      resultsContainer.className = 'rnh-results';
      container.appendChild(resultsContainer);
      cachedElements.resultsContainer = resultsContainer;

      tabPane.appendChild(container);

      // Register event handlers and store subscriptions for cleanup
      eventSubscriptions.push(
        sdk.Events.on({
          eventName: 'wme-map-move-end',
          eventHandler: debouncedScan,
        }),
      );

      eventSubscriptions.push(
        sdk.Events.on({
          eventName: 'wme-map-zoom-changed',
          eventHandler: debouncedScan,
        }),
      );

      eventSubscriptions.push(
        sdk.Events.on({
          eventName: 'wme-after-edit',
          eventHandler: debouncedScan,
        }),
      );

      // Initial scan
      debouncedScan();

      // Add cleanup on page unload
      window.addEventListener('beforeunload', cleanup);
    } catch (error) {
      console.error(`${scriptName}: Error initializing sidebar panel:`, error);
    }
  }

  /**
   * Cleanup function to unsubscribe from events and clear timers
   */
  function cleanup() {
    console.log(`${scriptName}: Cleaning up...`);

    // Clear any pending scan timeout
    if (scanTimeout) {
      clearTimeout(scanTimeout);
    }

    // Unsubscribe from all events
    eventSubscriptions.forEach((subscription) => {
      try {
        if (subscription && typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe();
        }
      } catch (err) {
        console.warn(`${scriptName}: Error unsubscribing from event:`, err);
      }
    });
    eventSubscriptions = [];
  }

  /**
   * Debounced scan function to prevent excessive scanning during map movements
   */
  function debouncedScan() {
    clearTimeout(scanTimeout);
    scanTimeout = setTimeout(() => {
      if (!isScanning) {
        scanRoadNames();
      }
    }, SCAN_DEBOUNCE_DELAY);
  }

  function onScreen(geometry) {
    if (!geometry || !currentMapExtent) return false;

    const [left, bottom, right, top] = currentMapExtent;

    if (geometry.type === 'Point') {
      const [lon, lat] = geometry.coordinates;
      return lon >= left && lon <= right && lat >= bottom && lat <= top;
    } else if (geometry.type === 'LineString') {
      return geometry.coordinates.some(([lon, lat]) => lon >= left && lon <= right && lat >= bottom && lat <= top);
    }
    return true;
  }

  /**
   * Scan all on-screen road segments for naming issues
   */
  async function scanRoadNames() {
    if (isScanning) {
      console.log(`${scriptName}: Scan already in progress, skipping...`);
      return;
    }

    isScanning = true;
    try {
      // Get current map extent
      currentMapExtent = sdk.Map.getMapExtent();

      if (!currentMapExtent) {
        throw new Error('Unable to get map extent');
      }

      // Show progress
      updateProgress(true, 1);

      scannedSegments = [];
      const segments = sdk.DataModel.Segments.getAll();
      const onScreenSegments = segments.filter((segment) => onScreen(segment.geometry));

      console.log(`${scriptName}: Scanning ${onScreenSegments.length} on-screen segments...`);

      let processedCount = 0;
      let editableCount = 0;
      const totalCount = onScreenSegments.length;

      for (const segment of onScreenSegments) {
        processedCount++;

        // Check if segment is editable
        if (
          !sdk.DataModel.Segments.hasPermissions({
            permission: 'EDIT_PROPERTIES',
            segmentId: segment.id,
          })
        ) {
          continue;
        }

        editableCount++;
        const issues = [];

        // Get street names from Streets data model using street IDs
        let primaryStreetName = '';
        const altStreetNames = [];

        if (segment.primaryStreetId) {
          try {
            const primaryStreet = sdk.DataModel.Streets.getById({ streetId: segment.primaryStreetId });
            if (primaryStreet?.name) {
              primaryStreetName = primaryStreet.name;

              const analysis = analyzeStreetName(primaryStreet.name);
              if (analysis.needsFix) {
                issues.push({
                  type: 'primary',
                  current: primaryStreet.name,
                  suggested: analysis.suggested,
                  reason: analysis.reason,
                });
              }
            }
          } catch (err) {
            console.warn(`${scriptName}: Error getting primary street ${segment.primaryStreetId}:`, err);
          }
        }

        // Check alternate street names
        if (segment.alternateStreetIds && segment.alternateStreetIds.length > 0) {
          segment.alternateStreetIds.forEach((streetId, index) => {
            try {
              const altStreet = sdk.DataModel.Streets.getById({ streetId });
              if (altStreet?.name) {
                altStreetNames.push(altStreet.name);

                const analysis = analyzeStreetName(altStreet.name);
                if (analysis.needsFix) {
                  issues.push({
                    type: 'alt',
                    index: index,
                    current: altStreet.name,
                    suggested: analysis.suggested,
                    reason: analysis.reason,
                  });
                }
              }
            } catch (err) {
              console.warn(`${scriptName}: Error getting alt street ${streetId}:`, err);
            }
          });
        }

        if (issues.length > 0) {
          scannedSegments.push({
            id: segment.id,
            roadType: segment.roadType,
            primaryStreetId: segment.primaryStreetId,
            alternateStreetIds: segment.alternateStreetIds || [],
            primaryStreetName: primaryStreetName,
            altStreetNames: altStreetNames,
            issues: issues,
          });
        }

        // Update progress periodically
        if (processedCount % PROGRESS_UPDATE_THROTTLE === 0 || processedCount === totalCount) {
          updateProgress(true, (processedCount / totalCount) * 100);
          updateScanCounter(processedCount);
        }
      }

      console.log(`${scriptName}: Scan complete. Total: ${totalCount}, Editable: ${editableCount}, Issues found: ${scannedSegments.length}`);

      // Update UI
      updateProgress(false);
      updateScanCounter(totalCount);
      displayResults();

      // Highlight segments if preview is enabled
      if (previewEnabled) {
        highlightSegments();
      }
    } catch (error) {
      console.error(`${scriptName}: Error scanning road names:`, error);
      updateProgress(false);

      // Show error message to user
      if (cachedElements.resultsContainer) {
        cachedElements.resultsContainer.innerHTML = `<div style="text-align: center; color: #d32f2f; padding: 20px;">⚠️ Error scanning segments. Please try again.</div>`;
      }
    } finally {
      isScanning = false;
    }
  }

  /**
   * Analyze a street name and determine if it needs fixing
   * @param {string} streetName - The street name to analyze
   * @returns {Object} Analysis result with needsFix, suggested, and reason properties
   */
  function analyzeStreetName(streetName) {
    if (!streetName) return { needsFix: false };

    const currentWords = streetName.split(/\s+/);
    let proposedWords = [...currentWords];
    let changed = false;
    let reasons = [];

    // Check for highway patterns first (e.g., "NH41 - रा४१" should become "NH41 - रारा०१")
    const hwyPattern = /^(NH\d{2})\s*-\s*(.+)$/i;
    const hwyMatch = streetName.match(hwyPattern);
    if (hwyMatch) {
      const hwyCode = hwyMatch[1];
      const hwyPart = hwyMatch[2].trim();

      // Preserve highway names ending with approved abbreviations or "Hwy" or "Ring Rd"
      // This includes: "NH41 - Prithvi Hwy", "NH39 - KTM Ring Rd", "NH77 - Bharatpur Ring Rd"
      const approvedSuffixPattern = new RegExp(`\\s+(${Object.keys(wmessa_approvedAbbr).join('|')}|Hwy|Ring\\s+Rd)$`, 'i');
      if (hwyPart.match(approvedSuffixPattern)) {
        return { needsFix: false };
      }

      // Check if the highway part needs fixing (e.g., "Ringroad" -> "Ring Rd")
      const hwyWords = hwyPart.split(/\s+/);
      let hwyProposedWords = [...hwyWords];
      let hwyChanged = false;

      for (let i = 0; i < hwyWords.length; i++) {
        const word = hwyWords[i];
        const wordLower = word.toLowerCase();

        // Check for "Ringroad" -> "Ring Rd"
        if (wordLower === 'ringroad') {
          hwyProposedWords[i] = 'Ring';
          hwyProposedWords.push('Rd');
          hwyChanged = true;
          break;
        }

        // Check general suggestions
        const generalSuggestionKeyCi = Object.keys(wmessa_generalWordSuggestions).find((k) => k.toLowerCase() === wordLower);
        if (generalSuggestionKeyCi) {
          const suggestedGeneralAbbr = wmessa_generalWordSuggestions[generalSuggestionKeyCi];
          if (suggestedGeneralAbbr.toLowerCase() !== wordLower) {
            hwyProposedWords[i] = suggestedGeneralAbbr;
            hwyChanged = true;
          }
        }

        // Check suffix suggestions
        const devanagariSuggestion = wmessa_suggestedAbbr[word];
        if (devanagariSuggestion && devanagariSuggestion !== word) {
          hwyProposedWords[i] = devanagariSuggestion;
          hwyChanged = true;
        }
      }

      if (hwyChanged) {
        const newHwyPart = wmessa_titleCase(hwyProposedWords.join(' '));
        const newSuggestion = `${hwyCode.toUpperCase()} - ${newHwyPart}`;
        if (streetName !== newSuggestion) {
          return {
            needsFix: true,
            suggested: newSuggestion,
            reason: `Highway format: ${hwyPart} → ${newHwyPart}`,
          };
        }
      }

      // Check if exact highway mapping exists
      const hwyKey = `${hwyCode.toUpperCase()}-`;
      const suggestedHwy = wmessa_suggestedHwyAbbr[hwyKey];

      if (suggestedHwy && streetName !== suggestedHwy) {
        return {
          needsFix: true,
          suggested: suggestedHwy,
          reason: `Highway format: ${streetName} → ${suggestedHwy}`,
        };
      }
    }

    // Check for standalone Devanagari abbreviations in any position
    for (let i = 0; i < currentWords.length; i++) {
      const word = currentWords[i];
      const devanagariSuggestion = wmessa_suggestedAbbr[word];
      if (devanagariSuggestion && devanagariSuggestion !== word) {
        proposedWords[i] = devanagariSuggestion;
        changed = true;
        reasons.push(`${word} → ${devanagariSuggestion}`);
      }
    }

    // Process pre-suffix words
    if (currentWords.length > 1) {
      for (let i = 0; i < currentWords.length - 1; i++) {
        const word = currentWords[i];
        const wordLower = word.toLowerCase();

        // Skip if already processed as Devanagari
        if (proposedWords[i] !== currentWords[i]) continue;

        const generalSuggestionKeyCi = Object.keys(wmessa_generalWordSuggestions).find((k) => k.toLowerCase() === wordLower);
        if (generalSuggestionKeyCi) {
          const suggestedGeneralAbbr = wmessa_generalWordSuggestions[generalSuggestionKeyCi];
          if (suggestedGeneralAbbr.toLowerCase() !== wordLower) {
            proposedWords[i] = suggestedGeneralAbbr;
            changed = true;
            reasons.push(`${word} → ${suggestedGeneralAbbr}`);
          }
        }
      }
    }

    // Process suffix (last word) - only if not already processed
    if (currentWords.length > 0 && proposedWords[proposedWords.length - 1] === currentWords[currentWords.length - 1]) {
      const potentialSuffix = currentWords[currentWords.length - 1];
      const suffixAnalysis = wmessa_analyzeSuffix(potentialSuffix);

      if (suffixAnalysis.status === 'check' && suffixAnalysis.proposed.toLowerCase() !== potentialSuffix.toLowerCase()) {
        proposedWords[currentWords.length - 1] = suffixAnalysis.proposed;
        changed = true;
        reasons.push(suffixAnalysis.message || `${potentialSuffix} → ${suffixAnalysis.proposed}`);
      }
    }

    const finalProposed = wmessa_titleCase(proposedWords.join(' '));
    const capitalizationChanged = streetName !== finalProposed;

    if (changed || capitalizationChanged) {
      return {
        needsFix: true,
        suggested: finalProposed,
        reason: reasons.length > 0 ? reasons.join(', ') : 'Capitalization',
      };
    }

    return { needsFix: false };
  }

  function updateProgress(show, percent = 1) {
    const progressBar = cachedElements.progressBar;
    const scanCounter = cachedElements.scanCounter;

    if (!progressBar || !scanCounter) return;

    const spinner = scanCounter.querySelector('i');

    if (show) {
      progressBar.style.display = 'block';
      progressBar.style.width = Math.max(percent, 1) + '%';
      if (spinner) {
        spinner.className = 'fa fa-spinner rnh-spinner';
      }
    } else {
      progressBar.style.display = 'none';
      if (spinner) {
        spinner.className = 'fa fa-check-circle rnh-complete-icon';
      }
    }
  }

  function updateScanCounter(count) {
    const scanCounter = cachedElements.scanCounter;
    if (!scanCounter) return;

    const span = scanCounter.querySelector('span');
    if (span) {
      span.textContent = `Scanned: ${count} segments`;
    }
  }

  /**
   * Display scan results in the sidebar
   */
  function displayResults() {
    const resultsContainer = cachedElements.resultsContainer;
    const fixAllButton = cachedElements.fixAllButton;

    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    if (scannedSegments.length === 0) {
      resultsContainer.innerHTML = '<div class="rnh-no-issues">✓ No issues found!</div>';
      if (fixAllButton) fixAllButton.disabled = true;
      return;
    }

    if (fixAllButton) fixAllButton.disabled = false;

    // Limit displayed segments for performance
    const displaySegments = scannedSegments.slice(0, MAX_SEGMENTS_TO_DISPLAY);
    const hiddenCount = scannedSegments.length - displaySegments.length;

    if (hiddenCount > 0) {
      const warningDiv = document.createElement('div');
      warningDiv.style.cssText = 'text-align: center; color: #ff9800; padding: 10px; background: #fff3e0; margin-bottom: 10px; border-radius: 4px; font-size: 12px;';
      warningDiv.textContent = `⚠️ Showing ${displaySegments.length} of ${scannedSegments.length} segments (limited for performance). Fix these first, then rescan.`;
      resultsContainer.appendChild(warningDiv);
    }

    displaySegments.forEach((segment) => {
      const item = document.createElement('div');
      item.className = 'rnh-segment-item';

      // Add hover event listeners for highlighting
      item.onmouseenter = () => highlightSegmentOnHover(segment.id);
      item.onmouseleave = () => clearHoverHighlight();

      // Header with segment ID and road type
      const header = document.createElement('div');
      header.className = 'rnh-segment-header';

      const segmentId = document.createElement('span');
      segmentId.className = 'rnh-segment-id';
      segmentId.textContent = `Segment #${segment.id}`;
      segmentId.title = 'Click to select segment';
      segmentId.onclick = () => selectSegment(segment.id);

      const roadType = document.createElement('span');
      roadType.className = 'rnh-road-type';
      const roadTypeObj = sdk.DataModel.Segments.getRoadTypes().find((rt) => rt.id === segment.roadType);
      roadType.textContent = roadTypeObj ? roadTypeObj.localizedName : 'Unknown';

      header.appendChild(segmentId);
      header.appendChild(roadType);
      item.appendChild(header);

      // Display issues
      segment.issues.forEach((issue) => {
        const nameRow = document.createElement('div');
        nameRow.className = 'rnh-name-row';

        const label = document.createElement('span');
        label.className = 'rnh-name-label';
        label.textContent = issue.type === 'primary' ? 'Name:' : `Alt ${issue.index + 1}:`;

        const current = document.createElement('span');
        current.className = 'rnh-current-name';
        current.textContent = issue.current;

        const arrow = document.createElement('span');
        arrow.textContent = ' → ';

        const suggested = document.createElement('span');
        suggested.className = 'rnh-suggested-name';
        suggested.textContent = issue.suggested;

        nameRow.appendChild(label);
        nameRow.appendChild(current);
        nameRow.appendChild(arrow);
        nameRow.appendChild(suggested);

        item.appendChild(nameRow);
      });

      // Fix button
      const fixButton = document.createElement('button');
      fixButton.className = 'rnh-fix-button';
      fixButton.textContent = 'Fix';
      fixButton.onclick = () => fixSegmentNames(segment);
      item.appendChild(fixButton);

      resultsContainer.appendChild(item);
    });
  }

  async function selectSegment(segmentId) {
    try {
      const segment = sdk.DataModel.Segments.getById({ segmentId: segmentId });
      if (!segment) {
        console.warn(`${scriptName}: Segment ${segmentId} not found`);
        WazeToastr.Alerts.info(scriptName, `Segment ${segmentId} not found. It may have been deleted.`);
        return;
      }

      // First, select the segment in WME
      sdk.Editing.setSelection({ selection: { ids: [segmentId], objectType: 'segment' } });

      // Then try to center the map on it
      if (!segment.geometry || !segment.geometry.coordinates) {
        console.warn(`${scriptName}: Segment ${segmentId} has no geometry, but selected in editor`);
        return;
      }

      // Calculate center of segment geometry
      if (segment.geometry.type === 'LineString' && segment.geometry.coordinates.length > 0) {
        const coords = segment.geometry.coordinates;

        // Validate the coordinates array
        if (!coords || coords.length === 0) {
          console.warn(`${scriptName}: Segment ${segmentId} has empty coordinates array`);
          return;
        }

        const midIndex = Math.floor(coords.length / 2);
        const centerPoint = coords[midIndex];

        // Validate coordinates
        if (!centerPoint || !Array.isArray(centerPoint) || centerPoint.length < 2) {
          console.error(`${scriptName}: Invalid coordinate format for segment ${segmentId}:`, centerPoint);
          return;
        }

        // Ensure coordinates are numbers (geometry coordinates might be strings)
        const lon = Number(centerPoint[0]);
        const lat = Number(centerPoint[1]);

        // Validate lon/lat are valid numbers
        if (isNaN(lon) || isNaN(lat)) {
          console.error(`${scriptName}: Invalid lon/lat values for segment ${segmentId}: lon=${centerPoint[0]}, lat=${centerPoint[1]}`);
          return;
        }

        console.log(`${scriptName}: Centering map on segment ${segmentId} at [${lon}, ${lat}]`);
        sdk.Map.setMapCenter({ lonLat: { lon, lat } });

        // Zoom to a good level to see the segment
        const currentZoom = sdk.Map.getZoomLevel();
        if (currentZoom < 4) {
          sdk.Map.setZoomLevel({ zoomLevel: 4 });
        }
      }
    } catch (error) {
      console.error(`${scriptName}: Error selecting segment ${segmentId}:`, error);
      // Don't show alert here since the segment is likely still selected in the editor
    }
  }

  /**
   * Fix naming issues for a single segment
   * @param {Object} segment - Segment object with issues to fix
   */
  async function fixSegmentNames(segment) {
    try {
      // Get the current city from the segment's existing streets (preserve city)
      const getCityForStreet = (streetId) => {
        if (!streetId) return null;
        const street = sdk.DataModel.Streets.getById({ streetId });
        return street && street.cityId ? street.cityId : null;
      };

      let newPrimaryStreetId = null;
      const altStreetUpdates = {}; // Only store streets that need updating
      let hasChanges = false;

      // Process each issue
      segment.issues.forEach((issue) => {
        if (issue.type === 'primary') {
          // Get the city from current primary street to preserve it
          const cityId = getCityForStreet(segment.primaryStreetId);
          if (!cityId) {
            console.warn(`${scriptName}: Cannot determine city for primary street, skipping`);
            return;
          }

          // Get or create street with suggested name in the same city
          let street = sdk.DataModel.Streets.getStreet({
            cityId: cityId,
            streetName: issue.suggested,
          });

          if (!street) {
            street = sdk.DataModel.Streets.addStreet({
              streetName: issue.suggested,
              cityId: cityId,
            });
          }

          newPrimaryStreetId = street.id;
          hasChanges = true;
          console.log(`${scriptName}: Primary street "${issue.current}" → "${issue.suggested}" (ID: ${street.id})`);
        } else if (issue.type === 'alt') {
          // Get the city from current alt street to preserve it
          const currentAltStreetId = segment.alternateStreetIds[issue.index];
          const cityId = getCityForStreet(currentAltStreetId);
          if (!cityId) {
            console.warn(`${scriptName}: Cannot determine city for alt street ${issue.index}, skipping`);
            return;
          }

          // Get or create alt street with suggested name in the same city
          let altStreet = sdk.DataModel.Streets.getStreet({
            cityId: cityId,
            streetName: issue.suggested,
          });

          if (!altStreet) {
            altStreet = sdk.DataModel.Streets.addStreet({
              streetName: issue.suggested,
              cityId: cityId,
            });
          }

          altStreetUpdates[issue.index] = altStreet.id;
          hasChanges = true;
          console.log(`${scriptName}: Alt street ${issue.index} "${issue.current}" → "${issue.suggested}" (ID: ${altStreet.id})`);
        }
      });

      // Only update if there are changes
      if (hasChanges) {
        // Build update parameters - only include what actually changed
        const updateParams = {
          segmentId: segment.id,
        };

        // Only include primaryStreetId if it changed
        if (newPrimaryStreetId) {
          updateParams.primaryStreetId = newPrimaryStreetId;
        }

        // Only include alternateStreetIds if at least one alt street changed
        if (Object.keys(altStreetUpdates).length > 0) {
          const newAlternateStreetIds = [...(segment.alternateStreetIds || [])];
          Object.keys(altStreetUpdates).forEach((index) => {
            newAlternateStreetIds[parseInt(index)] = altStreetUpdates[index];
          });
          updateParams.alternateStreetIds = newAlternateStreetIds;
        }

        console.log(`${scriptName}: Updating segment ${segment.id}:`, updateParams);
        await sdk.DataModel.Segments.updateAddress(updateParams);
        console.log(`${scriptName}: Successfully updated segment ${segment.id}`);
      } else {
        console.warn(`${scriptName}: No changes to apply for segment ${segment.id}`);
      }

      // Clear highlight and rescan after update
      if (previewEnabled) {
        sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_NAME });
      }
      setTimeout(() => debouncedScan(), RESCAN_DELAY_AFTER_FIX);
    } catch (error) {
      console.error(`${scriptName}: Error fixing segment ${segment.id}:`, error);
      WazeToastr.Alerts.error(scriptName, `Failed to update segment ${segment.id}. Check console for details.`);
    }
  }

  /**
   * Fix naming issues for all scanned segments
   */
  async function fixAllNames() {
    const fixAllButton = cachedElements.fixAllButton;

    try {
      updateProgress(true, 1);
      if (fixAllButton) {
        fixAllButton.disabled = true;
        fixAllButton.textContent = 'Fixing...';
      }

      let processed = 0;
      let failed = 0;
      const total = scannedSegments.length;

      for (const segment of scannedSegments) {
        try {
          await fixSegmentNames(segment);
          processed++;
        } catch (err) {
          failed++;
          console.error(`${scriptName}: Failed to fix segment ${segment.id}:`, err);
        }
        updateProgress(true, (processed / total) * 100);
      }

      updateProgress(false);

      if (failed > 0) {
        console.warn(`${scriptName}: Fixed ${processed} segments, ${failed} failed`);
      }

      // Rescan to update results
      setTimeout(() => {
        debouncedScan();
      }, RESCAN_DELAY_AFTER_FIX);
    } catch (error) {
      console.error(`${scriptName}: Error fixing all names:`, error);
      updateProgress(false);
    } finally {
      if (fixAllButton) {
        fixAllButton.textContent = 'Fix All Names';
      }
    }
  }

  /**
   * Initialize the highlight layer for previewing segments
   */
  function initLayer() {
    try {
      sdk.Map.addLayer({
        layerName: LAYER_NAME,
        styleRules: [
          {
            style: {
              strokeColor: '#ff8800',
              strokeDashstyle: 'solid',
              strokeWidth: 35,
            },
          },
        ],
      });

      const zIndex = sdk.Map.getLayerZIndex({ layerName: 'roads' }) - 3;
      sdk.Map.setLayerZIndex({ layerName: LAYER_NAME, zIndex });
      sdk.Map.setLayerOpacity({ layerName: LAYER_NAME, opacity: 0.6 });

      // HACK to prevent layer z-index from drifting above roads layer
      const checkLayerZIndex = () => {
        const currentZIndex = sdk.Map.getLayerZIndex({ layerName: LAYER_NAME });
        if (currentZIndex !== zIndex) {
          sdk.Map.setLayerZIndex({ layerName: LAYER_NAME, zIndex });
        }
      };
      setInterval(() => {
        checkLayerZIndex();
      }, 100);
      // END HACK

      console.log(`${scriptName}: Highlight layer initialized`);
    } catch (error) {
      console.error(`${scriptName}: Error initializing layer:`, error);
    }
  }

  /**
   * Highlight a single segment on hover
   * @param {number} segmentId - Segment ID to highlight
   */
  function highlightSegmentOnHover(segmentId) {
    try {
      const segment = sdk.DataModel.Segments.getById({ segmentId });
      if (!segment || !segment.geometry) return;

      const features = [
        {
          type: 'Feature',
          id: 0,
          geometry: segment.geometry,
        },
      ];

      sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_NAME });
      sdk.Map.addFeaturesToLayer({ layerName: LAYER_NAME, features });
    } catch (error) {
      console.error(`${scriptName}: Error highlighting segment on hover:`, error);
    }
  }

  /**
   * Clear hover highlight and restore preview highlights if enabled
   */
  function clearHoverHighlight() {
    if (previewEnabled) {
      // Restore all highlights if preview is enabled
      highlightSegments();
    } else {
      // Clear all highlights
      sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_NAME });
    }
  }

  /**
   * Highlight segments with issues on the map
   */
  function highlightSegments() {
    try {
      if (!previewEnabled) {
        sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_NAME });
        return;
      }

      const features = scannedSegments.map((segment) => {
        const seg = sdk.DataModel.Segments.getById({ segmentId: segment.id });
        return {
          type: 'Feature',
          id: 0,
          geometry: seg.geometry,
        };
      });

      sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_NAME });
      sdk.Map.addFeaturesToLayer({ layerName: LAYER_NAME, features });

      console.log(`${scriptName}: Highlighted ${features.length} segments`);
    } catch (error) {
      console.error(`${scriptName}: Error highlighting segments:`, error);
    }
  }

  /**
   * Handle preview checkbox change
   */
  function onPreviewChanged(event) {
    previewEnabled = event.target.checked;
    localStorage.setItem('wme-rnh-preview-enabled', previewEnabled);
    console.log(`${scriptName}: Preview ${previewEnabled ? 'enabled' : 'disabled'}`);

    if (previewEnabled) {
      highlightSegments();
    } else {
      sdk.Map.removeAllFeaturesFromLayer({ layerName: LAYER_NAME });
    }
  }

  function wmessa_bootstrap() {
    const wmeSdk = getWmeSdk({ scriptId: 'wme-road-name-helper-np', scriptName: 'WME Road Name Helper NP' });
    sdk = wmeSdk;
    sdk.Events.once({ eventName: 'wme-ready' }).then(() => {
      initLayer();
      scriptupdatemonitor();
      wmessa_init();
    });
  }

  function waitForWME() {
    if (!unsafeWindow.SDK_INITIALIZED) {
      setTimeout(waitForWME, 500);
      return;
    }
    unsafeWindow.SDK_INITIALIZED.then(wmessa_bootstrap);
  }
  waitForWME();

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
  /*
Changelog:
Version 2026.01.18.01:
- Fixed name checking for NH39 - KTM Ring Rd.
- Fixed for wrong suggestion for KTM Ring Rd.
- Fixed for NH77 - Bharatpur Ringroad now suggested as NH77 - Bharatpur Ring Rd.
Version 2026.01.16.01:
 - Fixed name checking for NH39 - KTM Ring Rd.
 - Fixed for wrong suggestion for KTM.
2026.01.16.01
- Temporary fix for alerts not displaying properly.
2025.12.02.01
- Added sidebar panel "RNH" (Road Name Helper) for scanning road names
- Automatically scan on-screen segments while panning around
- Display road names with issues including alt names
- One-click fix for individual segments or all at once
- Added Devanagari number mappings from रा१० through रा८०

2025.06.18.01
- Restored AH02 to AH2.

2025.06.15.02
- Added: Typing "AH2" now suggests "AH02"
- Added: Typing "NH01 - रा१" or using suffix "रा१" now suggests "NH01 - रारा०१"
- Improved: Custom suffix and highway code mapping logic for Nepali and highway abbreviations
- Fixed: Suffix suggestion logic for Nepali abbreviations
*/
})();
