// ==UserScript==
// @name            WME POI Shortcuts
// @namespace       https://greasyfork.org/users/45389
// @version         2025.12.27.01
// @description     Various UI changes to make editing faster and easier.
// @author          kid4rm90s & copilot
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license         GNU GPLv3
// @connect         greasyfork.org
// @grant           GM_xmlhttpRequest
// @grant           GM_addElement
// @require         https://greasyfork.org/scripts/560385/code/WazeToastr.js
// @require         https://greasyfork.org/scripts/523706-google-link-enhancer/code/Link%20Enhancer.js
// @downloadURL https://update.greasyfork.org/scripts/545278/WME%20POI%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/545278/WME%20POI%20Shortcuts.meta.js
// ==/UserScript==

/* global WazeToastr */
/* global bootstrap */

https: (function () {
  ('use strict');

  const updateMessage = `
      <strong>Fixed :</strong><br> - Temporary fix for alerts not displaying properly.<br>
      <br>
  `;
  const scriptName = GM_info.script.name;
  const scriptVersion = GM_info.script.version;
  const downloadUrl = 'https://greasyfork.org/scripts/545278-wme-poi-shortcuts/code/wme-poi-shortcuts.user.js';
  const forumURL = 'https://greasyfork.org/scripts/545278-wme-poi-shortcuts/feedback';

  // Gas Station Brand Names for Nepal and Pakistan
  const GAS_STATION_BRANDNAME = {
    Nepal: {
      countryCode: 'NP',
      brandnames: [
        {
          primaryName: 'NOC',
          brand: 'Nepal Oil Corporation',
          aliases: ['NOC'],
          website: 'noc.org.np',
        },
      ],
    },
    Pakistan: {
      countryCode: 'PK',
      brandnames: [
        {
          primaryName: 'Askar 1',
          brand: 'Askar 1',
          aliases: ['Askar 1 Petrol Pump'],
          website: 'askaroil.com.pk',
        },
        {
          primaryName: 'Attock',
          brand: 'Attock',
          aliases: ['Attock Petrol Pump'],
          website: 'apl.com.pk',
        },
        {
          primaryName: 'Be Energy',
          brand: 'BE Energy',
          aliases: ['Be Petrol Pump'],
          website: 'beenergy.com.pk',
        },
        {
          primaryName: 'Byco',
          brand: 'Byco',
          aliases: ['Byco Petrol Pump'],
          website: 'byco.com.pk',
        },
        {
          primaryName: 'Caltex',
          brand: 'Caltex',
          aliases: ['Caltex Petrol Pump'],
          website: 'caltex.com',
        },
        {
          primaryName: 'Go',
          brand: 'Go',
          aliases: ['Go Petrol Pump'],
          website: 'gno.com.pk',
        },
        {
          primaryName: 'Hascol',
          brand: 'Hascol',
          aliases: [''],
          website: 'hascol.com',
        },
        {
          primaryName: 'LaGuardia',
          brand: 'LaGuardia',
          aliases: ['LaGuardia'],
          website: 'laguardia-group.com',
        },
        {
          primaryName: 'N3',
          brand: 'N3',
          aliases: ['N3 Petrol Pump'],
          website: 'n3.com.pk',
        },
        {
          primaryName: 'PSO',
          brand: 'Pakistan State Oil',
          aliases: ['PSO Petrol Pump', 'Pakistan State Oil'],
          website: 'psopk.com',
        },
        {
          primaryName: 'Puma Energy',
          brand: 'Puma',
          aliases: ['Puma'],
          website: 'pumaenergy.com',
        },
        {
          primaryName: 'Shell',
          brand: 'Shell',
          aliases: ['Shell'],
          website: 'shell.com.pk',
        },
        {
          primaryName: 'Taj Petroleum',
          brand: 'TAJ',
          aliases: ['Taj Petrol Pump'],
          website: 'tajcorporation.com',
        },
        {
          primaryName: 'Total Parco',
          brand: 'TOTAL - PARCO',
          aliases: ['Total Parco', 'Total', 'Total Petrol Pump'],
          website: 'totalparco.com.pk',
        },
        {
          primaryName: 'Zoom',
          brand: 'Zoom',
          aliases: ['Zoom Petroleum', 'Zoom Petrol Pump'],
          website: 'zoom.org.pk',
        },
        {
          primaryName: 'Target',
          brand: null,
          aliases: ['Target Petrol Pump'],
          website: 'targetlubricants.com',
        },
      ],
    },
  };
  const CHARGING_STATION_BRANDNAME = {
    Nepal: {
      countryCode: 'NP',
      brandnames: [
        {
          primaryName: 'BYD',
          brand: 'BYD',
          networkName: 'BYD', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'cimex.com.np/charging-stations',
        },
        {
          primaryName: 'CG Motors',
          brand: 'CG Motors',
          networkName: 'CG Motors', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'cg-ev.com/charger-station',
        },
        {
          primaryName: 'MG Motors',
          brand: 'MG Motors',
          networkName: 'MG Motors', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'mgmotors.com.np/locate-ev-charger',
        },
        {
          primaryName: 'Tata Motors',
          brand: 'Tata Motors',
          networkName: 'Tata Motors', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'tatacars.sipradi.com.np/vehicle/charginglocation',
        },
        {
          primaryName: 'Hyundai Motors',
          brand: 'Hyundai Motors',
          networkName: 'Hyundai Motors', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'laxmihyundai.com/charge-points',
        },
        {
          primaryName: 'NEA',
          brand: 'Nepal Electricity Authority',
          networkName: 'Nepal Electricity Authority', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'nea.org.np',
        },
        {
          primaryName: 'ElectriVa',
          brand: 'ElectriVa Nepal',
          networkName: 'ElectriVa Nepal', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'electrivanepal.com/locations',
          openingHours: [{ days: [0, 1, 2, 3, 4, 5, 6], fromHour: '00:00', toHour: '00:00' }], // 24 hours, 7 days a week (days: 0=Sun, 1=Mon, ..., 6=Sat)
          is24_7: true, // Flag for display purposes
        },
        {
          primaryName: 'Yatri',
          brand: 'Yatri',
          networkName: 'Yatri', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'yatrienergy.com/',
        },
        {
          primaryName: 'thee GO',
          brand: 'thee GO',
          networkName: 'thee GO', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'www.theego.com.np/thee-go-chargepoint/',
        },
        {
          primaryName: 'MAW Vriddhi',
          brand: 'Maw Vriddhi',
          networkName: 'Maw Vriddhi', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'mawevcharging.com/',
        },
        {
          primaryName: 'OmodaJaecoo',
          brand: 'OmodaJaecoo',
          networkName: 'Omoda & Jaecoo', // WME dropdown item-id
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT', 'APP'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: 'omodajaecoonepal.com/charging-stations-in-nepal',
        },
        {
          primaryName: 'Charging Station',
          brand: '',
          networkName: '', // WME dropdown "Other" option
          costType: 'FEE', // FREE, FEE, or COST_TYPE_UNSPECIFIED
          paymentMethods: ['ONLINE_PAYMENT', 'OTHER', 'DEBIT'], // WME payment method item-ids
          aliases: ['EV Charging Station'],
          website: '',
        },
      ],
    },
  };

  // Debounce utility to prevent excessive function calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Debounced version of injection functions
  const debouncedInjectSwapButton = debounce((wmeSDK) => injectSwapNamesButton(wmeSDK), 100);
  const debouncedInjectButtonStation = debounce((wmeSDK) => injectButtonStation(wmeSDK), 100);

  // Global variables to track observers and prevent duplicates
  let aliasListObserver = null;
  let observedAliasItems = new Set();
  let nameInputObserved = false;
  let aliasObservers = new Set(); // Track individual alias observers
  let nameAttrObserver = null; // Track name attribute observer

  // Constants for timeouts and delays
  const ALIAS_INJECTION_DELAY = 50;
  const RETRY_INJECTION_DELAY = 100;
  const BRAND_BUTTON_RETRY_DELAY = 150;
  const SCRIPT_UPDATE_MONITOR_DELAY = 250;
  const UI_ELEMENT_WAIT_DELAY = 50;
  const MAX_RETRY_ATTEMPTS = 20; // Prevent infinite recursion

  // Logging utility with consistent prefixes
  const Logger = {
    info: (message, ...args) => console.log(`[WME POI Shortcuts] ${message}`, ...args),
    warn: (message, ...args) => console.warn(`[WME POI Shortcuts] ${message}`, ...args),
    error: (message, ...args) => console.error(`[WME POI Shortcuts] ${message}`, ...args),
  };

  // Helper function to safely disconnect observer
  function disconnectAliasObserver() {
    if (aliasListObserver) {
      try {
        aliasListObserver.disconnect();
        aliasListObserver = null;
      } catch (error) {
        Logger.warn('Error disconnecting alias observer:', error);
        aliasListObserver = null;
      }
    }

    // Disconnect all individual alias observers
    aliasObservers.forEach((observer) => {
      try {
        observer.disconnect();
      } catch (error) {
        Logger.warn('Error disconnecting individual alias observer:', error);
      }
    });
    aliasObservers.clear();

    // Disconnect name attribute observer
    if (nameAttrObserver) {
      try {
        nameAttrObserver.disconnect();
        nameAttrObserver = null;
      } catch (error) {
        Logger.warn('Error disconnecting name attribute observer:', error);
        nameAttrObserver = null;
      }
    }

    observedAliasItems.clear();
    nameInputObserved = false;
  }

  if (typeof unsafeWindow !== 'undefined' && unsafeWindow.SDK_INITIALIZED) {
    unsafeWindow.SDK_INITIALIZED.then(initScript);
  } else if (typeof window.SDK_INITIALIZED !== 'undefined') {
    window.SDK_INITIALIZED.then(initScript);
  } else {
    Logger.error('WME SDK is not available. Script will not run.');
  }

  // Inject custom CSS for grayed out disabled options
  injectCSSWithID('poiDisabledOptionStyle', `select[id^='poiItem'] option:disabled { color: #bbb !important; background: #000000ff !important; }`);

  // Inject CSS for swap names button
  injectCSSWithID(
    'swapNamesButtonStyle',
    `
    .alias-item-action-swap {
      margin-left: 4px !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    .alias-item-action-swap .w-icon-arrow-up {
      font-size: 14px !important;
      color: #ffffff !important;
    }
    .swap-names-container {
      text-align: center;
    }
    .swap-names-container .w-icon-arrow-up {
      margin-right: 4px;
      color: #ffffff !important;
    }
  `
  );

  // --- GLE (Google Link Enhancer) Integration ---
  // GLE settings and messages
  // Load GLE enabled state from localStorage
  let gleEnabled = false;
  let gleShowTempClosed = true;
  let openEditAddressOnRPP = false;
  try {
    gleEnabled = JSON.parse(localStorage.getItem('wme-poi-shortcuts-gle-enabled'));
  } catch (e) {
    gleEnabled = false;
  }
  try {
    gleShowTempClosed = JSON.parse(localStorage.getItem('wme-poi-shortcuts-gle-show-temp-closed'));
  } catch (e) {
    gleShowTempClosed = true;
  }
  try {
    openEditAddressOnRPP = JSON.parse(localStorage.getItem('wme-poi-shortcuts-open-edit-address-rpp'));
  } catch (e) {
    openEditAddressOnRPP = false;
  }
  let GLE = {
    enabled: gleEnabled,
    showTempClosedPOIs: gleShowTempClosed,
    enable() {
      this.enabled = true;
      ToggleExternalProvidersCSS(true);
    },
    disable() {
      this.enabled = false;
      ToggleExternalProvidersCSS(false);
    },
    closedPlace: 'Google indicates this place is permanently closed.\nVerify with other sources or your editor community before deleting.',
    multiLinked: 'Linked more than once already. Please find and remove multiple links.',
    linkedToThisPlace: 'Already linked to this place',
    linkedNearby: 'Already linked to a nearby place',
    linkedToXPlaces: 'This is linked to {0} places',
    badLink: 'Invalid Google link.  Please remove it.',
    tooFar: 'The Google linked place is more than {0} meters from the Waze place.  Please verify the link is correct.',
  };

  // Inject CSS helper
  function injectCSSWithID(id, css) {
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    }
  }

  // Toggle external providers CSS
  function ToggleExternalProvidersCSS(truthiness) {
    if (truthiness) injectCSSWithID('poiExternalProvidersTweaks', '#edit-panel .external-providers-view .select2-container {width:90%; margin-bottom:2px;}');
    else {
      var styles = document.getElementById('poiExternalProvidersTweaks');
      if (styles) styles.parentNode.removeChild(styles);
    }
  }

  function initScript() {
    // initialize the sdk with your script id and script name
    const wmeSDK = typeof unsafeWindow !== 'undefined' && unsafeWindow.getWmeSdk ? unsafeWindow.getWmeSdk({ scriptId: 'wme-poi', scriptName: 'WME POI' }) : getWmeSdk({ scriptId: 'wme-poi', scriptName: 'WME POI' });

    // Store the original GLE config
    const gleConfig = {
      enabled: GLE.enabled,
      showTempClosedPOIs: GLE.showTempClosedPOIs,
      closedPlace: GLE.closedPlace,
      multiLinked: GLE.multiLinked,
      linkedToThisPlace: GLE.linkedToThisPlace,
      linkedNearby: GLE.linkedNearby,
      linkedToXPlaces: GLE.linkedToXPlaces,
      badLink: GLE.badLink,
      tooFar: GLE.tooFar,
    };

    GLE = new GoogleLinkEnhancer();

    //***** Set Google Link Enhancer strings *****
    GLE.strings.closedPlace = gleConfig.closedPlace;
    GLE.strings.multiLinked = gleConfig.multiLinked;
    GLE.strings.linkedToThisPlace = gleConfig.linkedToThisPlace;
    GLE.strings.linkedNearby = gleConfig.linkedNearby;
    GLE.strings.linkedToXPlaces = gleConfig.linkedToXPlaces;
    GLE.strings.badLink = gleConfig.badLink;
    GLE.strings.tooFar = gleConfig.tooFar;

    // Apply the config to the GoogleLinkEnhancer instance AFTER strings are set
    GLE.showTempClosedPOIs = gleConfig.showTempClosedPOIs;

    if (gleConfig.enabled) {
      GLE.enable();
    }
    // query the WME data model
    // Example: Get the currently selected segment if available
    const selection = wmeSDK.Editing.getSelection();
    let mySegment;
    if (selection && selection.objectType === 'segment' && selection.ids && selection.ids.length === 1) {
      mySegment = wmeSDK.DataModel.Segments.getById({ segmentId: selection.ids[0] });
      if (mySegment && mySegment.isAtoB) {
        // do something
      }
    }

    // register to events
    wmeSDK.Events.once({ eventName: 'wme-ready' }).then(() => {
      // Setup custom shortcuts after WME is ready
      setupShortcuts(wmeSDK);
      // Register script sidebar tab for venue dropdown
      registerSidebarScriptTab(wmeSDK);
      // Check for initial venue selection and inject swap button if needed
      setTimeout(() => {
        debouncedInjectButtonStation(wmeSDK);
        debouncedInjectSwapButton(wmeSDK);
      }, 500); // Small delay to ensure UI is fully loaded
    });
    wmeSDK.Events.on({
      eventName: 'wme-map-move',
      eventHandler: () => {
        /* Handle map move events */
      },
    });
    wmeSDK.Events.on({
      eventName: 'wme-map-data-loaded',
      eventHandler: () => {
        /* Handle map data loaded events */
      },
    });
    wmeSDK.Events.on({
      eventName: 'wme-selection-changed',
      eventHandler: () => {
        // Clean up old observers/handlers before setting up new ones
        disconnectAliasObserver();
        $('.gas-station-brand-btn, .charging-station-brand-btn').off('click').remove();
        $('.swap-names-btn').off('click.swapnames').remove();

        debouncedInjectButtonStation(wmeSDK);
        debouncedInjectSwapButton(wmeSDK);

        // Handle edit address for residential venues if setting is enabled
        handleEditAddressForRPP(wmeSDK);
      },
    });
  }

  // --- Persistence Helpers ---
  function getPOIShortcutsConfig() {
    try {
      return JSON.parse(localStorage.getItem('wme-poi-shortcuts-config') || '{}');
    } catch (e) {
      return {};
    }
  }
  function setPOIShortcutsConfig(config) {
    localStorage.setItem('wme-poi-shortcuts-config', JSON.stringify(config));
  }
  function savePOIShortcutItem(itemNumber) {
    const config = getPOIShortcutsConfig();
    config[itemNumber] = {
      category: $(`#poiItem${itemNumber}`).val(),
      lock: $(`#poiLock${itemNumber}`).val(),
      geometry: $(`#poiGeom${itemNumber}`).val(),
    };
    setPOIShortcutsConfig(config);
  }
  function loadPOIShortcutItem(itemNumber) {
    const config = getPOIShortcutsConfig();
    if (config[itemNumber]) {
      $(`#poiItem${itemNumber}`).val(config[itemNumber].category);
      $(`#poiLock${itemNumber}`).val(config[itemNumber].lock);
      $(`#poiGeom${itemNumber}`).val(config[itemNumber].geometry);
    }
  }

  // --- UI Builders ---
  function buildItemList(itemNumber) {
    // Categories and subcategories as per latest WME spec
    const VENUE_CATEGORIES = [
      { key: 'CAR_SERVICES', icon: 'car-services', subs: ['CAR_WASH', 'CHARGING_STATION', 'GARAGE_AUTOMOTIVE_SHOP', 'GAS_STATION'] },
      { key: 'CRISIS_LOCATIONS', icon: 'crisis-locations', subs: ['DONATION_CENTERS', 'SHELTER_LOCATIONS'] },
      {
        key: 'CULTURE_AND_ENTERTAINEMENT',
        icon: 'culture-and-entertainement',
        subs: ['ART_GALLERY', 'CASINO', 'CLUB', 'TOURIST_ATTRACTION_HISTORIC_SITE', 'MOVIE_THEATER', 'MUSEUM', 'MUSIC_VENUE', 'PERFORMING_ARTS_VENUE', 'GAME_CLUB', 'STADIUM_ARENA', 'THEME_PARK', 'ZOO_AQUARIUM', 'RACING_TRACK', 'THEATER'],
      },
      { key: 'FOOD_AND_DRINK', icon: 'food-and-drink', subs: ['RESTAURANT', 'BAKERY', 'DESSERT', 'CAFE', 'FAST_FOOD', 'FOOD_COURT', 'BAR', 'ICE_CREAM'] },
      { key: 'LODGING', icon: 'lodging', subs: ['HOTEL', 'HOSTEL', 'CAMPING_TRAILER_PARK', 'COTTAGE_CABIN', 'BED_AND_BREAKFAST'] },
      { key: 'NATURAL_FEATURES', icon: 'natural-features', subs: ['ISLAND', 'SEA_LAKE_POOL', 'RIVER_STREAM', 'FOREST_GROVE', 'FARM', 'CANAL', 'SWAMP_MARSH', 'DAM'] },
      { key: 'OTHER', icon: 'other', subs: ['CONSTRUCTION_SITE'] },
      { key: 'OUTDOORS', icon: 'outdoors', subs: ['PARK', 'PLAYGROUND', 'BEACH', 'SPORTS_COURT', 'GOLF_COURSE', 'PLAZA', 'PROMENADE', 'POOL', 'SCENIC_LOOKOUT_VIEWPOINT', 'SKI_AREA'] },
      { key: 'PARKING_LOT', icon: 'parking-lot', subs: [] },
      {
        key: 'PROFESSIONAL_AND_PUBLIC',
        icon: 'professional-and-public',
        subs: [
          'COLLEGE_UNIVERSITY',
          'SCHOOL',
          'CONVENTIONS_EVENT_CENTER',
          'GOVERNMENT',
          'LIBRARY',
          'CITY_HALL',
          'ORGANIZATION_OR_ASSOCIATION',
          'PRISON_CORRECTIONAL_FACILITY',
          'COURTHOUSE',
          'CEMETERY',
          'FIRE_DEPARTMENT',
          'POLICE_STATION',
          'MILITARY',
          'HOSPITAL_URGENT_CARE',
          'DOCTOR_CLINIC',
          'OFFICES',
          'POST_OFFICE',
          'RELIGIOUS_CENTER',
          'KINDERGARDEN',
          'FACTORY_INDUSTRIAL',
          'EMBASSY_CONSULATE',
          'INFORMATION_POINT',
          'EMERGENCY_SHELTER',
          'TRASH_AND_RECYCLING_FACILITIES',
        ],
      },
      {
        key: 'SHOPPING_AND_SERVICES',
        icon: 'shopping-and-services',
        subs: [
          'ARTS_AND_CRAFTS',
          'BANK_FINANCIAL',
          'SPORTING_GOODS',
          'BOOKSTORE',
          'PHOTOGRAPHY',
          'CAR_DEALERSHIP',
          'FASHION_AND_CLOTHING',
          'CONVENIENCE_STORE',
          'PERSONAL_CARE',
          'DEPARTMENT_STORE',
          'PHARMACY',
          'ELECTRONICS',
          'FLOWERS',
          'FURNITURE_HOME_STORE',
          'GIFTS',
          'GYM_FITNESS',
          'SWIMMING_POOL',
          'HARDWARE_STORE',
          'MARKET',
          'SUPERMARKET_GROCERY',
          'JEWELRY',
          'LAUNDRY_DRY_CLEAN',
          'SHOPPING_CENTER',
          'MUSIC_STORE',
          'PET_STORE_VETERINARIAN_SERVICES',
          'TOY_STORE',
          'TRAVEL_AGENCY',
          'ATM',
          'CURRENCY_EXCHANGE',
          'CAR_RENTAL',
          'TELECOM',
        ],
      },
      {
        key: 'TRANSPORTATION',
        icon: 'transportation',
        subs: ['AIRPORT', 'BUS_STATION', 'FERRY_PIER', 'SEAPORT_MARINA_HARBOR', 'SUBWAY_STATION', 'TRAIN_STATION', 'BRIDGE', 'TUNNEL', 'TAXI_STATION', 'JUNCTION_INTERCHANGE', 'REST_AREAS', 'CARPOOL_SPOT'],
      },
    ];
    let html = `<select id="poiItem${itemNumber}" style="font-size:10px;height:20px;width:100%;max-width:200px;margin:2px 0;">`;
    VENUE_CATEGORIES.forEach((cat) => {
      try {
        const categoryName = I18n?.translations?.[I18n.currentLocale()]?.venues?.categories?.[cat.key] || cat.key;
        html += `<option value="${cat.key}" data-icon="${cat.icon}" style="font-weight:bold;">${categoryName}</option>`;
        cat.subs.forEach((sub) => {
          const subCategoryName = I18n?.translations?.[I18n.currentLocale()]?.venues?.categories?.[sub] || sub;
          html += `<option value="${sub}" data-icon="${cat.icon}">${subCategoryName}</option>`;
        });
      } catch (e) {
        // Fallback if I18n is not available
        html += `<option value="${cat.key}" data-icon="${cat.icon}" style="font-weight:bold;">${cat.key}</option>`;
        cat.subs.forEach((sub) => {
          html += `<option value="${sub}" data-icon="${cat.icon}">${sub}</option>`;
        });
      }
    });
    html += '</select>';
    return html;
  }
  function buildLockLevelDropdown(itemNumber) {
    // Show lock dropdown for all 10 items
    let html = `<select id="poiLock${itemNumber}" style="margin-left:4px;font-size:10px;height:20px;width:35px;">`;
    for (let i = 0; i <= 4; i++) {
      html += `<option value="${i}">${i + 1}</option>`;
    }
    html += '</select>';
    return html;
  }
  function buildGeometryTypeDropdown(itemNumber) {
    // Dropdown for geometry type: Point or Area
    return `<select id="poiGeom${itemNumber}" style="margin-left:4px;font-size:10px;height:20px;width:55px;">
        <option value="area">Area</option>
        <option value="point">Point</option>
    </select>`;
  }
  function buildItemOption(itemNumber) {
    var $section = $('<div>', { style: 'padding:4px 8px;font-size:10px;', id: 'poiPlaceCat' + itemNumber });
    $section.html(
      [
        `<span style="font-size:10px;font-weight:bold;">Item ${itemNumber}</span>`,
        buildItemList(itemNumber),
        `<div style="display:flex;align-items:center;gap:6px;margin:3px 0 0 0;">
            <label style="font-size:10px;min-width:28px;">Lock</label> ${buildLockLevelDropdown(itemNumber)}
            <label style="font-size:10px;min-width:40px;">Geometry</label> ${buildGeometryTypeDropdown(itemNumber)}
        </div>`,
      ].join(' ')
    );
    return $section.html();
  }
  function buildAllItemOptions() {
    let html = '';
    for (let i = 1; i <= 10; i++) {
      html += buildItemOption(i);
    }
    // Add checkboxes before the keyboard shortcuts message
    html += `
    <div style="margin:12px 0 8px 0; padding:4px 8px; background:transparent; border-radius:4px;">
      <label style="font-size:10px; font-weight:bold;">
        <input type="checkbox" id="_cbEnableGLE" ${GLE && GLE.enabled ? 'checked' : ''} /> Enable Google Link Enhancer
      </label>
      <br>
      <label style="font-size:10px; font-weight:bold; margin-top:4px; display:inline-block;">
        <input type="checkbox" id="_cbOpenEditAddressRPP" ${openEditAddressOnRPP ? 'checked' : ''} /> Open edit address when RPP selected
      </label>
    </div>`;
    html += `<div style='font-size:10px;color:#888;margin-top:8px;'>You can bind keyboard shortcuts using WME's native shortcuts section.</div>`;
    setTimeout(() => {
      for (let i = 1; i <= 10; i++) {
        loadPOIShortcutItem(i);
        //legacy shortcuts key added from here
        // Populate shortcut input with the actual shortcut key
        const shortcutKey = i === 10 ? 'Ctrl+0' : `Ctrl+${i}`;
        $(`#poiShortcut${i}`).val(shortcutKey);
        // legacy shortcuts key added until above
        // Save on change
        $(`#poiItem${i},#poiLock${i},#poiGeom${i}`)
          .off('change.wmepoi')
          .on('change.wmepoi', function () {
            savePOIShortcutItem(i);
            // Prevent duplicate category selection
            // if (this.id.startsWith('poiItem')) {
            //   const selectedCategories = [];
            //   for (let j = 1; j <= 10; j++) {
            //     const val = $(`#poiItem${j}`).val();
            //     if (val) selectedCategories.push(val);
            //   }
            //   for (let j = 1; j <= 10; j++) {
            //     $(`#poiItem${j} option`).prop('disabled', false).removeAttr('title');
            //   }
            //   for (let j = 1; j <= 10; j++) {
            //     const currentVal = $(`#poiItem${j}`).val();
            //     for (const cat of selectedCategories) {
            //       if (cat !== currentVal) {
            //         $(`#poiItem${j} option[value='${cat}']`).prop('disabled', true).attr('title', 'this category is already selected.');
            //       }
            //     }
            //   }
            // }
          });
      }
      // Initial duplicate prevention
      // const selectedCategories = [];
      // for (let j = 1; j <= 10; j++) {
      //   const val = $(`#poiItem${j}`).val();
      //   if (val) selectedCategories.push(val);
      // }
      // for (let j = 1; j <= 10; j++) {
      //   $(`#poiItem${j} option`).prop('disabled', false).removeAttr('title');
      // }
      // for (let j = 1; j <= 10; j++) {
      //   const currentVal = $(`#poiItem${j}`).val();
      //   for (const cat of selectedCategories) {
      //     if (cat !== currentVal) {
      //       $(`#poiItem${j} option[value='${cat}']`).prop('disabled', true).attr('title', 'this category is already selected.');
      //     }
      //   }
      // }
    }, 0);
    return html;
  }
  /*
  // --- wmeSDK Shortcuts Setup ---
  // TODO: Re-enable when wmeSDK fixes shortcuts persistence after page refresh
  /*
  function setupShortcuts(wmeSDK) {
    // Create 10 POI shortcut actions, one for each item
    for (let i = 1; i <= 10; i++) {
      // Assign shortcutKeys: C1-C9, C0 for 10
      const shortcutKey = i === 10 ? 'C0' : `C${i}`;
      const shortcutId = `create-poi-shortcut-${i}`;
      // Remove previous shortcut if registered
      if (wmeSDK.Shortcuts.isShortcutRegistered({ shortcutId })) {
        wmeSDK.Shortcuts.deleteShortcut({ shortcutId });
      }
      // Check if shortcut keys are in use
      if (wmeSDK.Shortcuts.areShortcutKeysInUse({ shortcutKeys: shortcutKey })) {
        Logger.warn(`Shortcut keys ${shortcutKey} already in use, skipping registration for POI Shortcut #${i}`);
        continue;
      }
      wmeSDK.Shortcuts.createShortcut({
        callback: () => {
          // Get selected values from the UI for this item
          const cat = $(`#poiItem${i}`).val();
          const lock = parseInt($(`#poiLock${i}`).val(), 10);
          const geomType = $(`#poiGeom${i}`).val();
          // Geometry: area = drawPolygon, point = drawPoint
          let drawPromise = geomType === 'point' ? wmeSDK.Map.drawPoint() : wmeSDK.Map.drawPolygon();
          drawPromise.then((geometry) => {
            let newVenue = wmeSDK.DataModel.Venues.addVenue({
              category: cat,
              geometry: geometry,
            });
            wmeSDK.Editing.setSelection({
              selection: {
                ids: [newVenue.toString()],
                objectType: 'venue',
              },
            });
            // Only set lock if lock > 0 (lockRank 1-4)
            if (!isNaN(lock) && lock > 0) {
              wmeSDK.DataModel.Venues.updateVenue({
                venueId: newVenue.toString(),
                lockRank: lock,
              });
            }
            // Nepal-specific logic for Gas Station
            const topCountry = wmeSDK.DataModel.Countries.getTopCountry();
            if (topCountry && (topCountry.name === 'Nepal' || topCountry.code === 'NP') && cat === 'GAS_STATION') {
              wmeSDK.DataModel.Venues.updateVenue({
                venueId: newVenue.toString(),
                name: 'NOC',
                brand: 'Nepal Oil Corporation',
              });
            }
          });
        },
        description: `Create POI Shortcut #${i}`,
        shortcutId,
        shortcutKeys: shortcutKey,
      });
    }

    // Shortcuts that click on WME's existing UI buttons for POI creation/modification
    wmeSDK.Shortcuts.createShortcut({
      callback: () => {
        $("wz-icon[name='toll-booth']").parent().trigger('click');
      },
      description: 'Add Toll Booth',
      shortcutId: 'add-toll-booth',
      shortcutKeys: null,
    });

    wmeSDK.Shortcuts.createShortcut({
      callback: () => {
        $("wz-icon[name='railway-crossing']").parent().trigger('click');
      },
      description: 'Add Level Crossing',
      shortcutId: 'add-level-crossing',
      shortcutKeys: null,
    });

    wmeSDK.Shortcuts.createShortcut({
      callback: () => {
        $("wz-icon[name='school-zone']").parent().trigger('click');
      },
      description: 'Create School Zone',
      shortcutId: 'create-school-zone',
      shortcutKeys: null,
    });
  }
  */
  /***********************************************legacy shortcuts below*********************************************** */
  // --- Legacy Shortcuts Setup (Temporary until wmeSDK fixes shortcuts persistence) ---
  function setupShortcuts(wmeSDK) {
    // Legacy shortcuts configuration - maps shortcut numbers to keyboard combos
    var shortcutsConfig = [
      {
        handler: 'WME-POI-Shortcuts_poi1',
        title: 'POI Shortcut 1',
        func: function (ev) {
          createPOIFromShortcut(1, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 1 },
      },
      {
        handler: 'WME-POI-Shortcuts_poi2',
        title: 'POI Shortcut 2',
        func: function (ev) {
          createPOIFromShortcut(2, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 2 },
      },
      {
        handler: 'WME-POI-Shortcuts_poi3',
        title: 'POI Shortcut 3',
        func: function (ev) {
          createPOIFromShortcut(3, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 3 },
      },
      {
        handler: 'WME-POI-Shortcuts_poi4',
        title: 'POI Shortcut 4',
        func: function (ev) {
          createPOIFromShortcut(4, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 4 },
      },
      {
        handler: 'WME-POI-Shortcuts_poi5',
        title: 'POI Shortcut 5',
        func: function (ev) {
          createPOIFromShortcut(5, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 5 },
      },
      {
        handler: 'WME-POI-Shortcuts_poi6',
        title: 'POI Shortcut 6',
        func: function (ev) {
          createPOIFromShortcut(6, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 6 },
      },
      {
        handler: 'WME-POI-Shortcuts_poi7',
        title: 'POI Shortcut 7',
        func: function (ev) {
          createPOIFromShortcut(7, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 7 },
      },
      {
        handler: 'WME-POI-Shortcuts_poi8',
        title: 'POI Shortcut 8',
        func: function (ev) {
          createPOIFromShortcut(8, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 8 },
      },
      {
        handler: 'WME-POI-Shortcuts_poi9',
        title: 'POI Shortcut 9',
        func: function (ev) {
          createPOIFromShortcut(9, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 9 },
      },
      {
        handler: 'WME-POI-Shortcuts_poi10',
        title: 'POI Shortcut 10',
        func: function (ev) {
          createPOIFromShortcut(10, wmeSDK);
        },
        key: null,
        arg: { slotNumber: 10 },
      },
      {
        handler: 'WME-POI-Shortcuts_toll-booth',
        title: 'Add Toll Booth',
        func: function (ev) {
          ensureHazardLayersEnabled('layer-switcher-item_permanent_hazard_toll_booth', () => {
            try {
              WazeToastr.Alerts.info('POI Shortcut', `POI Type: <b>Toll Booth</b>`, false, false, 2000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.info failed:', e);
            }
            $("wz-icon[name='toll-booth']").parent().trigger('click');
          });
        },
        key: -1, // No default key, user can set custom
        arg: {},
      },
      {
        handler: 'WME-POI-Shortcuts_level-crossing',
        title: 'Add Level Crossing',
        func: function (ev) {
          ensureHazardLayersEnabled('layer-switcher-item_permanent_hazard_railroad_crossing', () => {
            try {
              WazeToastr.Alerts.info('POI Shortcut', `POI Type: <b>Level Crossing</b>`, false, false, 2000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.info failed:', e);
            }
            $("wz-icon[name='railway-crossing']").parent().trigger('click');
          });
        },
        key: -1, // No default key, user can set custom
        arg: {},
      },
      {
        handler: 'WME-POI-Shortcuts_school-zone',
        title: 'Create School Zone',
        func: function (ev) {
          ensureHazardLayersEnabled('layer-switcher-item_permanent_hazard_school_zone', () => {
            try {
              WazeToastr.Alerts.info('POI Shortcut', `POI Type: <b>School Zone</b>`, false, false, 2000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.info failed:', e);
            }
            $("wz-icon[name='school-zone']").parent().trigger('click');
          });
        },
        key: -1, // No default key, user can set custom
        arg: {},
      },
      {
        handler: 'WME-POI-Shortcuts_sharp-curves',
        title: 'Create Sharp Curves',
        func: function (ev) {
          ensureHazardLayersEnabled('layer-switcher-item_permanent_hazard_dangerous_curve', () => {
            try {
              WazeToastr.Alerts.info('POI Shortcut', `POI Type: <b>Sharp Curves</b>`, false, false, 2000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.info failed:', e);
            }
            $("wz-icon[name='sharp-curve-ahead']").parent().trigger('click');
          });
        },
        key: -1, // No default key, user can set custom
        arg: {},
      },
      {
        handler: 'WME-POI-Shortcuts_complex-junctions',
        title: 'Create Complex Junctions',
        func: function (ev) {
          ensureHazardLayersEnabled('layer-switcher-item_permanent_hazard_dangerous_intersection', () => {
            try {
              WazeToastr.Alerts.info('POI Shortcut', `POI Type: <b>Complex Junctions</b>`, false, false, 2000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.info failed:', e);
            }
            $("wz-icon[name='dangerous-intersection']").parent().trigger('click');
          });
        },
        key: -1, // No default key, user can set custom
        arg: {},
      },
      {
        handler: 'WME-POI-Shortcuts_multiple-lanes-merging',
        title: 'Create Multiple Lanes Merging',
        func: function (ev) {
          ensureHazardLayersEnabled('layer-switcher-item_permanent_hazard_dangerous_merge', () => {
            try {
              WazeToastr.Alerts.info('POI Shortcut', `POI Type: <b>Multiple Lanes Merging</b>`, false, false, 2000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.info failed:', e);
            }
            $("wz-icon[name='merge-ahead']").parent().trigger('click');
          });
        },
        key: -1, // No default key, user can set custom
        arg: {},
      },
      {
        handler: 'WME-POI-Shortcuts_convert-other-to-residential',
        title: 'Convert OTHER to Residential (Copy Name to House Number)',
        func: function (ev) {
          convertOtherToResidential(wmeSDK);
        },
        key: -1, // No default key, user can set custom shortcut in WME settings
        arg: {},
      },
    ];

    // Register legacy shortcuts
    for (var i = 0; i < shortcutsConfig.length; ++i) {
      WMEKSRegisterKeyboardShortcut('WME-POI-Shortcuts', 'WME POI Shortcuts', shortcutsConfig[i].handler, shortcutsConfig[i].title, shortcutsConfig[i].func, shortcutsConfig[i].key, shortcutsConfig[i].arg);
    }

    WMEKSLoadKeyboardShortcuts('WME-POI-Shortcuts');

    window.addEventListener(
      'beforeunload',
      function () {
        // Clean up observers and event handlers before page unload
        disconnectAliasObserver();
        $(document).off('focusout.wme-poi-shortcuts');
        $(document).off('click.wme-poi-shortcuts-alias');
        WMEKSSaveKeyboardShortcuts('WME-POI-Shortcuts');
      },
      false
    );
  }

  /**
   * Converts OTHER type venues to residential places by copying the primary name
   * to the venue address house number and triggering the conversion button.
   *
   * @param {Object} wmeSDK - The WME SDK instance
   */
  function convertOtherToResidential(wmeSDK) {
    try {
      const venue = getSelectedVenue(wmeSDK);
      if (!venue) return;

      if (!isValidOtherVenue(venue)) return;

      if (!hasValidPrimaryName(venue)) return;

      checkAndUpdateVenueAddress(wmeSDK, venue);
    } catch (error) {
      Logger.error('Error in convertOtherToResidential:', error);
      try {
        WazeToastr.Alerts.error('POI Shortcut', 'An unexpected error occurred during conversion.', false, false, 3000);
      } catch (e) {
        Logger.warn('WazeToastr.Alerts.error failed:', e);
      }
    }
  }

  /**
   * Gets the currently selected venue from WME
   *
   * @param {Object} wmeSDK - The WME SDK instance
   * @returns {Object|null} - The selected venue or null if invalid selection
   */
  function getSelectedVenue(wmeSDK) {
    const selection = wmeSDK.Editing.getSelection();

    if (!selection || selection.objectType !== 'venue' || !selection.ids || selection.ids.length !== 1) {
      try {
        WazeToastr.Alerts.warning('POI Shortcut', 'Please select a venue first.', false, false, 3000);
      } catch (e) {
        Logger.warn('WazeToastr.Alerts.warning failed:', e);
      }
      return null;
    }

    const venueId = selection.ids[0];
    const venue = wmeSDK.DataModel.Venues.getById({ venueId });

    if (!venue) {
      try {
        WazeToastr.Alerts.error('POI Shortcut', 'Venue not found.', false, false, 3000);
      } catch (e) {
        Logger.warn('WazeToastr.Alerts.error failed:', e);
      }
      return null;
    }

    return venue;
  }

  /**
   * Validates if the venue is of type OTHER
   *
   * @param {Object} venue - The venue object
   * @returns {boolean} - True if venue is valid OTHER type
   */
  function isValidOtherVenue(venue) {
    const otherCategories = ['OTHER', 'other'];
    const venueCategories = venue.categories || [];
    const isOther = venueCategories.some((cat) => otherCategories.includes(cat));

    Logger.info('Venue categories:', venueCategories);

    if (!isOther) {
      try {
        WazeToastr.Alerts.warning('POI Shortcut', `This function only works with venues of type OTHER. Actual: ${venueCategories.join(', ')}`, false, false, 3000);
      } catch (e) {
        Logger.warn('WazeToastr.Alerts.warning failed:', e);
      }
      return false;
    }

    return true;
  }

  /**
   * Validates if the venue has a valid primary name
   *
   * @param {Object} venue - The venue object
   * @returns {boolean} - True if venue has valid primary name
   */
  function hasValidPrimaryName(venue) {
    if (!venue.name || !venue.name.trim()) {
      try {
        WazeToastr.Alerts.warning('POI Shortcut', 'Primary name is empty and cannot be used as house number.', false, false, 3000);
      } catch (e) {
        Logger.warn('WazeToastr.Alerts.warning failed:', e);
      }
      return false;
    }

    return true;
  }

  /**
   * Checks venue address and updates it if needed
   *
   * @param {Object} wmeSDK - The WME SDK instance
   * @param {Object} venue - The venue object
   */
  function checkAndUpdateVenueAddress(wmeSDK, venue) {
    checkExistingHouseNumber(wmeSDK, venue)
      .then((hasHouseNumber) => {
        if (hasHouseNumber) {
          try {
            WazeToastr.Alerts.warning('POI Shortcut', 'Venue already has a house number in its address.', false, false, 3000);
          } catch (e) {
            Logger.warn('WazeToastr.Alerts.warning failed:', e);
          }
          return;
        }

        return updateVenueAddressHouseNumber(wmeSDK, venue);
      })
      .then(() => {
        triggerResidentialConversion(venue.name);
      })
      .catch((error) => {
        Logger.error('Error updating venue address:', error);
        try {
          WazeToastr.Alerts.error('POI Shortcut', 'Failed to update venue address.', false, false, 3000);
        } catch (e) {
          Logger.warn('WazeToastr.Alerts.error failed:', e);
        }
      });
  }

  /**
   * Checks if venue already has a house number in its address
   *
   * @param {Object} wmeSDK - The WME SDK instance
   * @param {Object} venue - The venue object
   * @returns {Promise<boolean>} - Promise resolving to true if house number exists
   */
  function checkExistingHouseNumber(wmeSDK, venue) {
    return new Promise((resolve, reject) => {
      try {
        const address = wmeSDK.DataModel.Venues.getAddress({ venueId: venue.id });
        const hasExistingHouseNumber = address && address.houseNumber && address.houseNumber.trim();
        resolve(!!hasExistingHouseNumber);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Updates venue address with the primary name as house number
   *
   * @param {Object} wmeSDK - The WME SDK instance
   * @param {Object} venue - The venue object
   * @returns {Promise<void>} - Promise that resolves when update is complete
   */
  function updateVenueAddressHouseNumber(wmeSDK, venue) {
    return new Promise((resolve, reject) => {
      try {
        wmeSDK.DataModel.Venues.updateAddress({
          venueId: venue.id,
          houseNumber: venue.name,
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Triggers the residential conversion by clicking the convert button
   *
   * @param {string} venueName - The name of the venue being converted
   */
  function triggerResidentialConversion(venueName) {
    // Small delay to ensure UI updates after address change
    setTimeout(() => {
      const buttonClicked = clickConvertToResidentialButton();

      if (buttonClicked) {
        try {
          WazeToastr.Alerts.info('POI Shortcut', `Successfully converted venue "${venueName}" to residential.`, false, false, 1000);
        } catch (e) {
          Logger.warn('WazeToastr.Alerts.info failed:', e);
        }
      } else {
        try {
          WazeToastr.Alerts.warning('POI Shortcut', `House number set to "${venueName}". Please manually click "Convert to residential" button.`, false, false, 3000);
        } catch (e) {
          Logger.warn('WazeToastr.Alerts.warning failed:', e);
        }
      }
    }, 500);
  }

  /**
   * Attempts to click the convert to residential button
   *
   * @returns {boolean} - True if button was found and clicked
   */
  function clickConvertToResidentialButton() {
    const selectors = ['wz-button.toggle-residential-button[color="secondary"][size="sm"]', 'wz-button.toggle-residential-button', '.toggle-residential-control wz-button'];

    for (const selector of selectors) {
      const button = document.querySelector(selector);

      if (button && button.getAttribute('disabled') !== 'true') {
        button.click();
        Logger.info(`Clicked convert to residential button using selector: ${selector}`);
        return true;
      }
    }

    Logger.warn('Convert to residential button not found or disabled');
    return false;
  }

  /**
   * Clicks the edit address button for residential venues when the setting is enabled
   *
   * @param {Object} wmeSDK - The WME SDK instance
   */
  function handleEditAddressForRPP(wmeSDK) {
    if (!openEditAddressOnRPP) {
      Logger.info('Open edit address for RPP is disabled');
      return;
    }
    try {
      const selection = wmeSDK.Editing.getSelection();
      if (!selection || selection.objectType !== 'venue' || !selection.ids || selection.ids.length !== 1) {
        Logger.info('No venue selected or invalid selection');
        return;
      }
      const venueId = selection.ids[0];
      const venue = wmeSDK.DataModel.Venues.getById({ venueId });
      if (!venue) {
        Logger.warn('Venue not found');
        return;
      }
      Logger.info('Venue categories:', venue.categories);
      const isResidential = venue.categories && venue.categories.includes('RESIDENTIAL');
      if (isResidential) {
        Logger.info('Residential venue detected, attempting to click edit address button');
        setTimeout(() => {
          // Only select the exact icon
          const editButton = document.querySelector('i.w-icon.w-icon-pencil-fill.edit-button[aria-disabled="false"]');
          if (editButton) {
            editButton.click();
            Logger.info('Clicked EXACT edit address icon for residential venue');

            // After clicking edit button, wait and then focus house number input inside shadow DOM
            setTimeout(() => {
              const wzTextInput = document.querySelector('wz-text-input[placeholder="Add house number"]');
              if (wzTextInput && wzTextInput.shadowRoot) {
                const input = wzTextInput.shadowRoot.querySelector('input');
                if (input) {
                  input.focus();
                  input.click();
                  if (input.value && input.value.length) {
                    input.setSelectionRange(input.value.length, input.value.length);
                  }
                  Logger.info('Focused and clicked on house number input inside shadow DOM');
                } else {
                  Logger.warn('Input inside shadow DOM not found');
                }
              } else {
                Logger.warn('wz-text-input element or its shadowRoot not found');
              }
            }, 500);
          } else {
            Logger.warn('EXACT edit address icon not found for residential venue');
          }
        }, 300);
      } else {
        Logger.info('Selected venue is not residential, skipping edit address action');
      }
    } catch (error) {
      Logger.error('Error in handleEditAddressForRPP:', error);
    }
  }

  // Function to create POI from shortcut slot
  function createPOIFromShortcut(slotNumber, wmeSDK) {
    try {
      // Get selected values from the UI for this item
      const cat = $(`#poiItem${slotNumber}`).val();
      const lock = parseInt($(`#poiLock${slotNumber}`).val(), 10);
      const geomType = $(`#poiGeom${slotNumber}`).val();

      if (!cat || cat === '') {
        Logger.warn(`POI Shortcut ${slotNumber}: No category selected`);
        return;
      }
      // Show WazeToastr alert with POI info before drawing
      const poiName = $(`#poiItem${slotNumber} option:selected`).text();
      const lockLevel = !isNaN(lock) ? parseInt(lock, 10) + 1 : 1;
      const areaType = geomType === 'point' ? 'Point' : 'Area';
      try {
        WazeToastr.Alerts.info('POI Shortcut', `Selected POI Name: <b>${poiName}</b><br>Lock Level: <b>${lockLevel}</b><br>Type: <b>${areaType}</b>`, false, false, 2500);
      } catch (e) {
        Logger.warn('WazeToastr.Alerts.info failed:', e);
      }

      // Geometry: area = drawPolygon, point = drawPoint
      let drawPromise = geomType === 'point' ? wmeSDK.Map.drawPoint() : wmeSDK.Map.drawPolygon();
      drawPromise
        .then((geometry) => {
          let newVenue = wmeSDK.DataModel.Venues.addVenue({
            category: cat,
            geometry: geometry,
          });

          // Add a small delay to ensure the venue is fully created before selecting it
          setTimeout(() => {
            wmeSDK.Editing.setSelection({
              selection: {
                ids: [newVenue.toString()],
                objectType: 'venue',
              },
            });
          }, 100);

          // Only set lock if lock > 0 (lockRank 1-4)
          if (!isNaN(lock) && lock > 0) {
            setTimeout(() => {
              wmeSDK.DataModel.Venues.updateVenue({
                venueId: newVenue.toString(),
                lockRank: lock,
              });
            }, 200);
          }
        })
        .catch((err) => {
          if (err && err.name === 'InvalidStateError') {
            Logger.info('POI drawing was cancelled by the user.');
          } else {
            Logger.error('Error during POI drawing:', err);
          }
        });
    } catch (error) {
      Logger.error(`Error creating POI from shortcut ${slotNumber}:`, error);
    }
  }

  // Helper function to ensure hazard layer group and specific hazard layer are enabled
  function ensureHazardLayersEnabled(hazardLayerId, callback) {
    try {
      // Wait a bit to ensure the layer UI is ready
      setTimeout(() => {
        // First, ensure the permanent hazards group is enabled
        const hazardGroupToggle = document.getElementById('layer-switcher-group_permanent_hazards');
        if (hazardGroupToggle) {
          // For wz-toggle-switch: checked="" means enabled, checked="false" means disabled
          const checkedAttr = hazardGroupToggle.getAttribute('checked');
          const isGroupEnabled = checkedAttr === '' || checkedAttr === 'true';

          if (!isGroupEnabled) {
            hazardGroupToggle.click();
            // Wait for the group to be enabled before enabling individual layers
            setTimeout(() => {
              enableSpecificHazardLayer(hazardLayerId, callback);
            }, 400);
            return;
          }
        } else {
          Logger.warn('Hazard group toggle not found');
        }

        // If group is already enabled, directly enable the specific layer
        enableSpecificHazardLayer(hazardLayerId, callback);
      }, UI_ELEMENT_WAIT_DELAY);
    } catch (error) {
      Logger.error('Error enabling hazard layers:', error);
      // Execute callback even if there's an error to prevent hanging
      if (callback && typeof callback === 'function') {
        setTimeout(callback, RETRY_INJECTION_DELAY);
      }
    }
  }

  // Helper function to enable a specific hazard layer
  function enableSpecificHazardLayer(hazardLayerId, callback) {
    try {
      if (hazardLayerId) {
        const hazardLayerCheckbox = document.getElementById(hazardLayerId);
        if (hazardLayerCheckbox) {
          // For wz-checkbox: checked="" means enabled, checked="false" means disabled
          const checkedAttr = hazardLayerCheckbox.getAttribute('checked');
          const isLayerEnabled = checkedAttr === '' || checkedAttr === 'true';

          if (!isLayerEnabled) {
            hazardLayerCheckbox.click();
            // Wait for layer to be enabled before executing callback
            setTimeout(() => {
              if (callback && typeof callback === 'function') {
                callback();
              }
            }, 300);
          } else {
            // Layer is already enabled, execute callback immediately
            if (callback && typeof callback === 'function') {
              callback();
            }
          }
        } else {
          Logger.warn(`Hazard layer element not found: ${hazardLayerId}`);
          // Execute callback even if element not found to prevent hanging
          if (callback && typeof callback === 'function') {
            setTimeout(callback, 100);
          }
        }
      } else {
        // No specific layer ID provided, execute callback
        if (callback && typeof callback === 'function') {
          callback();
        }
      }
    } catch (error) {
      Logger.error('Error enabling specific hazard layer:', error);
      // Execute callback even if there's an error to prevent hanging
      if (callback && typeof callback === 'function') {
        setTimeout(callback, RETRY_INJECTION_DELAY);
      }
    }
  }

  // --- Legacy Keyboard Shortcuts System (from WME Street to River PLUS) ---
  function WMEKSRegisterKeyboardShortcut(scriptName, shortcutsHeader, newShortcut, shortcutDescription, functionToCall, shortcutKeysObj, arg) {
    try {
      I18n.translations[I18n.locale].keyboard_shortcuts.groups[scriptName].members.length;
    } catch (c) {
      (W.accelerators.Groups[scriptName] = []),
        (W.accelerators.Groups[scriptName].members = []),
        (I18n.translations[I18n.locale].keyboard_shortcuts.groups[scriptName] = []),
        (I18n.translations[I18n.locale].keyboard_shortcuts.groups[scriptName].description = shortcutsHeader),
        (I18n.translations[I18n.locale].keyboard_shortcuts.groups[scriptName].members = []);
    }
    if (functionToCall && 'function' == typeof functionToCall) {
      (I18n.translations[I18n.locale].keyboard_shortcuts.groups[scriptName].members[newShortcut] = shortcutDescription),
        W.accelerators.addAction(newShortcut, {
          group: scriptName,
        });
      var i = '-1',
        j = {};
      (j[i] = newShortcut),
        W.accelerators._registerShortcuts(j),
        null !== shortcutKeysObj && ((j = {}), (j[shortcutKeysObj] = newShortcut), W.accelerators._registerShortcuts(j)),
        W.accelerators.events.register(newShortcut, null, function () {
          functionToCall(arg);
        });
    } else alert('The function ' + functionToCall + ' has not been declared');
  }

  function WMEKSLoadKeyboardShortcuts(scriptName) {
    Logger.info(`Loading keyboard shortcuts for ${scriptName}`);
    if (localStorage[scriptName + 'KBS']) {
      const shortcuts = JSON.parse(localStorage[scriptName + 'KBS']);
      for (let i = 0; i < shortcuts.length; i++) {
        try {
          W.accelerators._registerShortcuts(shortcuts[i]);
        } catch (error) {
          Logger.error('Error registering shortcut:', error);
        }
      }
    }
  }

  function WMEKSSaveKeyboardShortcuts(scriptName) {
    Logger.info(`Saving keyboard shortcuts for ${scriptName}`);
    try {
      WazeToastr.Alerts.success('POI Shortcut', `Saving keyboard shortcuts for ${scriptName}`, false, false, 3000);
    } catch (e) {
      Logger.warn('WazeToastr.Alerts.success failed:', e);
    }
    const shortcuts = [];
    for (var actionName in W.accelerators.Actions) {
      var shortcutString = '';
      if (W.accelerators.Actions[actionName].group == scriptName) {
        W.accelerators.Actions[actionName].shortcut
          ? (W.accelerators.Actions[actionName].shortcut.altKey === !0 && (shortcutString += 'A'),
            W.accelerators.Actions[actionName].shortcut.shiftKey === !0 && (shortcutString += 'S'),
            W.accelerators.Actions[actionName].shortcut.ctrlKey === !0 && (shortcutString += 'C'),
            '' !== shortcutString && (shortcutString += '+'),
            W.accelerators.Actions[actionName].shortcut.keyCode && (shortcutString += W.accelerators.Actions[actionName].shortcut.keyCode))
          : (shortcutString = '-1');
        var shortcutObj = {};
        (shortcutObj[shortcutString] = W.accelerators.Actions[actionName].id), (shortcuts[shortcuts.length] = shortcutObj);
      }
    }
    localStorage[scriptName + 'KBS'] = JSON.stringify(shortcuts);
  }
  /******************************************legacy shortcuts until here above************************************ */

  function getGasStationCategoryKey() {
    // Use I18n to get the correct category key for gas station
    // Fallback to 'GAS_STATION' if not found
    let locale = typeof I18n !== 'undefined' && I18n.currentLocale ? I18n.currentLocale() : 'en';
    let categories = I18n?.translations?.[locale]?.venues?.categories || {};
    // Find the key for 'Gas Station' or 'Petrol Station' in the current language
    for (const key in categories) {
      if (categories[key] === 'Gas Station' || categories[key] === 'Petrol Station') {
        return key;
      }
    }
    // Fallback to 'GAS_STATION'
    return 'GAS_STATION';
  }

  function getChargingStationCategoryKey() {
    // Charging station category key is consistent across all locales
    return 'CHARGING_STATION';
  }

  /**
   * Convert payment method ID to human-readable label
   * @param {string} paymentMethodId - The payment method ID (e.g., 'ONLINE_PAYMENT', 'APP')
   * @returns {string} - Human-readable label (e.g., 'Online payment', 'App')
   */
  function getPaymentMethodLabel(paymentMethodId) {
    switch (paymentMethodId) {
      case 'APP':
        return 'App';
      case 'CREDIT':
        return 'Credit card';
      case 'DEBIT':
        return 'Debit card';
      case 'MEMBERSHIP_CARD':
        return 'Membership card';
      case 'ONLINE_PAYMENT':
        return 'Online payment';
      case 'OTHER':
        return 'Other';
      case 'PLUG_IN_AUTO_CHARGE':
        return 'Plug-in autocharge';
      default:
        return paymentMethodId;
    }
  }

  /**
   * Set the cost type for a charging station
   * @param {string} costType - The cost type to select: 'FREE', 'FEE', or 'COST_TYPE_UNSPECIFIED'
   * @returns {Promise<boolean>} - Returns promise that resolves to true if selection was successful
   */
  function setChargingStationCostType(costType) {
    return new Promise((resolve) => {
      try {
        // Find the cost wz-select element
        const costSelect = document.querySelector('wz-select[label="Cost"]');
        if (!costSelect) {
          Logger.warn('[Cost Type] wz-select with label "Cost" not found');
          resolve(false);
          return;
        }

        // Wait for shadow root to be attached
        if (!costSelect.shadowRoot) {
          Logger.warn('[Cost Type] Shadow root not attached to wz-select');
          resolve(false);
          return;
        }

        // Find the select box to click and open the dropdown
        const selectBox = costSelect.shadowRoot.querySelector('.select-box');
        if (!selectBox) {
          Logger.warn('[Cost Type] Select box not found in shadow root');
          resolve(false);
          return;
        }

        // Find the wz-menu inside the shadow root
        const menu = costSelect.shadowRoot.querySelector('wz-menu');
        if (!menu) {
          Logger.warn('[Cost Type] wz-menu not found in shadow root');
          resolve(false);
          return;
        }

        Logger.info(`[Cost Type] Setting cost type to: ${costType}`);

        // Click the select box to open the dropdown
        selectBox.click();

        // Wait for menu to open and options to be available
        setTimeout(() => {
          // Find the wz-option elements (they are light DOM children of wz-select)
          const options = costSelect.querySelectorAll('wz-option');

          Logger.info(`[Cost Type] Found ${options.length} cost options`);

          let targetOption = null;
          for (const option of options) {
            const value = option.getAttribute('value');
            Logger.info(`[Cost Type] Checking option: "${value}"`);
            if (value === costType) {
              targetOption = option;
              Logger.info(`[Cost Type] Found matching option for: ${costType}`);
              break;
            }
          }

          if (!targetOption) {
            Logger.warn(`[Cost Type] Option not found for cost type: ${costType}`);
            resolve(false);
            return;
          }

          // Click the option to select it
          targetOption.click();
          Logger.info(`[Cost Type] Successfully set cost type to: ${costType}`);
          resolve(true);
        }, 100);
      } catch (error) {
        Logger.error('[Cost Type] Error setting cost type:', error);
        resolve(false);
      }
    });
  }

  /**
   * Set payment methods for a charging station
   * @param {Array<string>} paymentMethods - Array of payment method item-ids to select (e.g., ['APP', 'CREDIT', 'DEBIT', 'ONLINE_PAYMENT'])
   * @returns {Promise<boolean>} - Returns promise that resolves to true if all selections were successful
   */
  function setChargingStationPaymentMethods(paymentMethods) {
    return new Promise((resolve) => {
      try {
        if (!paymentMethods || !Array.isArray(paymentMethods) || paymentMethods.length === 0) {
          Logger.warn('[Payment Methods] No payment methods provided or invalid format');
          resolve(false);
          return;
        }

        // Find the payment method wz-autocomplete element
        const paymentAutocomplete = document.querySelector('#venue-edit-general wz-autocomplete[placeholder=""]');
        if (!paymentAutocomplete) {
          Logger.warn('[Payment Methods] Payment method wz-autocomplete not found');
          resolve(false);
          return;
        }

        // Wait for shadow root to be attached
        if (!paymentAutocomplete.shadowRoot) {
          Logger.warn('[Payment Methods] Shadow root not attached to wz-autocomplete');
          resolve(false);
          return;
        }

        // Find the wz-text-input inside the shadow root
        const wzTextInput = paymentAutocomplete.shadowRoot.querySelector('wz-text-input');
        if (!wzTextInput) {
          Logger.warn('[Payment Methods] wz-text-input not found in payment autocomplete shadow root');
          resolve(false);
          return;
        }

        // Find the input element inside wz-text-input shadow root
        if (!wzTextInput.shadowRoot) {
          Logger.warn('[Payment Methods] Shadow root not attached to wz-text-input');
          resolve(false);
          return;
        }

        const input = wzTextInput.shadowRoot.querySelector('input');
        if (!input) {
          Logger.warn('[Payment Methods] Input element not found in wz-text-input shadow root');
          resolve(false);
          return;
        }

        Logger.info(`[Payment Methods] Setting ${paymentMethods.length} payment methods: ${paymentMethods.join(', ')}`);

        // Function to remove all existing payment method chips
        const removeAllExistingPaymentMethods = () => {
          return new Promise((resolveRemove) => {
            try {
              // Find the multiselect card that contains the chips
              const multiselectCard = document.querySelector('#venue-edit-general wz-card.wz-multiselect-card .wz-multiselect-card-content');
              if (!multiselectCard) {
                Logger.info('[Payment Methods] No existing payment methods to remove');
                resolveRemove(true);
                return;
              }

              // Find all wz-image-chip elements
              const existingChips = multiselectCard.querySelectorAll('wz-image-chip[removable]');
              if (existingChips.length === 0) {
                Logger.info('[Payment Methods] No existing payment methods found');
                resolveRemove(true);
                return;
              }

              Logger.info(`[Payment Methods] Removing ${existingChips.length} existing payment methods`);

              // Click the remove icon in each chip's shadow root
              const removeChip = (chip, index) => {
                return new Promise((resolveChip) => {
                  if (!chip.shadowRoot) {
                    Logger.warn(`[Payment Methods] Shadow root not found for chip ${index}`);
                    resolveChip(false);
                    return;
                  }

                  // Find the remove icon span inside the shadow root
                  const removeIcon = chip.shadowRoot.querySelector('.remove-icon');
                  if (!removeIcon) {
                    Logger.warn(`[Payment Methods] Remove icon not found for chip ${index}`);
                    resolveChip(false);
                    return;
                  }

                  // Click the remove icon
                  removeIcon.click();
                  Logger.info(`[Payment Methods] Removed existing payment method chip ${index + 1}/${existingChips.length}`);
                  resolveChip(true);
                });
              };

              // Remove all chips sequentially
              const removeChipsSequentially = async () => {
                for (let i = 0; i < existingChips.length; i++) {
                  await removeChip(existingChips[i], i);
                  // Small delay between removals
                  if (i < existingChips.length - 1) {
                    await new Promise((r) => setTimeout(r, 100));
                  }
                }
                Logger.info('[Payment Methods] All existing payment methods removed');
                resolveRemove(true);
              };

              removeChipsSequentially();
            } catch (error) {
              Logger.error('[Payment Methods] Error removing existing payment methods:', error);
              resolveRemove(false);
            }
          });
        };

        // Function to add a single payment method
        const addPaymentMethod = (methodId, index) => {
          return new Promise((resolveMethod) => {
            try {
              // Focus and click the input to open dropdown
              input.focus();
              input.click();
              input.dispatchEvent(new Event('focus', { bubbles: true }));
              input.dispatchEvent(new MouseEvent('click', { bubbles: true }));

              // Wait for menu to open and items to load
              setTimeout(() => {
                // Find the wz-menu inside the shadow root
                const menu = paymentAutocomplete.shadowRoot.querySelector('wz-menu');
                if (!menu) {
                  Logger.warn(`[Payment Methods] wz-menu not found for method ${methodId}`);
                  resolveMethod(false);
                  return;
                }

                // Find all menu items (they are light DOM children of wz-menu)
                const menuItems = menu.querySelectorAll('wz-menu-item');
                Logger.info(`[Payment Methods] Found ${menuItems.length} payment method menu items`);

                // Find the menu item that matches the payment method ID
                let targetMenuItem = null;
                for (const item of menuItems) {
                  const itemId = item.getAttribute('item-id');
                  if (itemId === methodId) {
                    targetMenuItem = item;
                    Logger.info(`[Payment Methods] Found matching menu item for: ${methodId}`);
                    break;
                  }
                }

                if (!targetMenuItem) {
                  Logger.warn(`[Payment Methods] Menu item not found for payment method: ${methodId}`);
                  resolveMethod(false);
                  return;
                }

                // Click the menu item to select it
                targetMenuItem.click();
                Logger.info(`[Payment Methods] Successfully selected payment method: ${methodId}`);
                resolveMethod(true);
              }, 300); // Wait for menu to open
            } catch (error) {
              Logger.error(`[Payment Methods] Error adding payment method ${methodId}:`, error);
              resolveMethod(false);
            }
          });
        };

        // Add payment methods sequentially with delays between each
        const addMethodsSequentially = async () => {
          // First, remove all existing payment methods
          await removeAllExistingPaymentMethods();

          // Wait a bit after removal before adding new ones
          await new Promise((r) => setTimeout(r, 50));

          const results = [];
          for (let i = 0; i < paymentMethods.length; i++) {
            const methodId = paymentMethods[i];
            const success = await addPaymentMethod(methodId, i);
            results.push(success);

            // Wait between selections to avoid conflicts
            if (i < paymentMethods.length - 1) {
              await new Promise((r) => setTimeout(r, 100));
            }
          }

          const allSuccessful = results.every((r) => r === true);
          const successCount = results.filter((r) => r === true).length;

          Logger.info(`[Payment Methods] Added ${successCount}/${paymentMethods.length} payment methods successfully`);
          resolve(allSuccessful);
        };

        addMethodsSequentially();
      } catch (error) {
        Logger.error('[Payment Methods] Error setting payment methods:', error);
        resolve(false);
      }
    });
  }

  /**
   * Programmatically select a charging station network from the WME dropdown
   * Uses multiple approaches: direct menu click, typing simulation, and wz-autocomplete API
   * @param {string} networkName - The network name to select (must match WME's item-id)
   * @param {number} retryCount - Current retry attempt (default: 0)
   * @param {number} maxRetries - Maximum number of retries (default: 10)
   * @returns {Promise<boolean>} - Returns promise that resolves to true if selection was successful
   */
  function selectChargingStationNetwork(networkName, retryCount = 0, maxRetries = 10) {
    return new Promise((resolve) => {
      try {
        // Find the charging station network autocomplete control
        let networkControlDiv = document.querySelector('#venue-edit-general .charging-station-network-control-autocomplete');

        // Try alternative selectors if not found
        if (!networkControlDiv) {
          networkControlDiv = document.querySelector('.charging-station-network-control-autocomplete');
        }

        if (!networkControlDiv) {
          if (retryCount < maxRetries) {
            Logger.info(`[Network Selection] Control div not found, retrying... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              selectChargingStationNetwork(networkName, retryCount + 1, maxRetries).then(resolve);
            }, RETRY_INJECTION_DELAY * 2);
            return;
          }
          Logger.warn('[Network Selection] Charging station network control div not found after retries');
          resolve(false);
          return;
        }

        // Get the wz-autocomplete element (direct child of the div)
        const wzAutocomplete = networkControlDiv.querySelector('wz-autocomplete');
        if (!wzAutocomplete) {
          if (retryCount < maxRetries) {
            Logger.info(`[Network Selection] wz-autocomplete not found, retrying... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              selectChargingStationNetwork(networkName, retryCount + 1, maxRetries).then(resolve);
            }, RETRY_INJECTION_DELAY * 2);
            return;
          }
          Logger.warn('[Network Selection] wz-autocomplete not found after retries');
          resolve(false);
          return;
        }

        // Wait for shadow root to be attached to wz-autocomplete
        if (!wzAutocomplete.shadowRoot) {
          if (retryCount < maxRetries) {
            Logger.info(`[Network Selection] wz-autocomplete shadow root not attached, retrying... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              selectChargingStationNetwork(networkName, retryCount + 1, maxRetries).then(resolve);
            }, RETRY_INJECTION_DELAY * 2);
            return;
          }
          Logger.warn('[Network Selection] wz-autocomplete shadow root not attached after retries');
          resolve(false);
          return;
        }

        // Get wz-text-input from inside wz-autocomplete's shadow DOM
        const textInput = wzAutocomplete.shadowRoot.querySelector('wz-text-input');
        if (!textInput) {
          if (retryCount < maxRetries) {
            Logger.info(`[Network Selection] wz-text-input not found in shadow root, retrying... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              selectChargingStationNetwork(networkName, retryCount + 1, maxRetries).then(resolve);
            }, RETRY_INJECTION_DELAY * 2);
            return;
          }
          Logger.warn('[Network Selection] wz-text-input not found in shadow root after retries');
          resolve(false);
          return;
        }

        // Wait for shadow root to be attached to wz-text-input
        if (!textInput.shadowRoot) {
          if (retryCount < maxRetries) {
            Logger.info(`[Network Selection] wz-text-input shadow root not attached, retrying... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              selectChargingStationNetwork(networkName, retryCount + 1, maxRetries).then(resolve);
            }, RETRY_INJECTION_DELAY * 2);
            return;
          }
          Logger.warn('[Network Selection] wz-text-input shadow root not attached after retries');
          resolve(false);
          return;
        }

        // Get the actual input element from wz-text-input's shadow DOM
        const input = textInput.shadowRoot.querySelector('input');
        if (!input) {
          Logger.warn('[Network Selection] Input element not found in wz-text-input shadow root');
          resolve(false);
          return;
        }

        // Find the wz-menu inside wz-autocomplete's shadow DOM
        const menu = wzAutocomplete.shadowRoot.querySelector('wz-menu');
        if (!menu) {
          Logger.warn('[Network Selection] wz-menu not found in wz-autocomplete shadow root');
          resolve(false);
          return;
        }

        // IMPORTANT: Menu items are loaded dynamically when the dropdown is opened
        // We need to trigger the dropdown to open first, then wait for items to load
        Logger.info('[Network Selection] Opening dropdown to load menu items...');

        // Focus and click the input to open the dropdown
        input.focus();
        input.click();

        // Trigger input event to open dropdown
        input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        input.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
        input.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

        // Wait for menu items to load (they're populated asynchronously)
        setTimeout(() => {
          // Find the menu items - they are LIGHT DOM children of wz-menu (slotted content)
          const menuItems = menu.querySelectorAll('wz-menu-item');

          Logger.info(`[Network Selection] Found ${menuItems.length} menu items after opening dropdown`);

          if (menuItems.length === 0) {
            Logger.warn('[Network Selection] No menu items loaded even after opening dropdown');
            resolve(false);
            return;
          }

          let targetMenuItem = null;

          for (const item of menuItems) {
            const itemId = item.getAttribute('item-id');
            Logger.info(`[Network Selection] Checking menu item: "${itemId}"`);
            if (itemId === networkName) {
              targetMenuItem = item;
              Logger.info(`[Network Selection] Found matching menu item for: ${networkName}`);
              break;
            }
          }

          if (!targetMenuItem) {
            Logger.warn(
              `[Network Selection] Menu item not found for network: "${networkName}". Available items: ${Array.from(menuItems)
                .map((item) => `"${item.getAttribute('item-id')}"`)
                .join(', ')}`
            );
            resolve(false);
            return;
          }

          // Get the display text from the menu item
          const title = targetMenuItem.getAttribute('title') || networkName;

          // Type the network name to filter/highlight the item
          Logger.info(`[Network Selection] Typing network name: ${title}`);

          // Clear and type the network name
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

          setTimeout(() => {
            input.value = title;

            // Dispatch events to trigger autocomplete filtering
            input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

            // Click the menu item directly to select it
            setTimeout(() => {
              targetMenuItem.click();
              Logger.info(`[Network Selection] Successfully selected network: ${networkName}`);
              resolve(true);
            }, 100);
          }, 50);
        }, 300); // Wait 300ms for menu items to load after opening dropdown
      } catch (error) {
        Logger.error('[Network Selection] Error selecting network:', error);
        resolve(false);
      }
    });
  }

  function swapPrimaryAndAliasNames(wmeSDK, aliasIndex = 0) {
    // Only run if a venue is selected
    const selection = wmeSDK.Editing.getSelection();
    if (!selection || selection.objectType !== 'venue' || !selection.ids || selection.ids.length !== 1) {
      Logger.warn('No venue selected for name swapping');
      return;
    }

    const venueId = selection.ids[0];
    const venue = wmeSDK.DataModel.Venues.getById({ venueId });

    if (!venue) {
      Logger.warn('Venue not found');
      return;
    }

    // Check if venue has at least one alias to swap
    if (!venue.aliases || venue.aliases.length === 0) {
      Logger.warn('Venue must have at least one alias to swap');
      return;
    }

    // Validate alias index
    if (aliasIndex < 0 || aliasIndex >= venue.aliases.length) {
      Logger.warn(`Invalid alias index: ${aliasIndex}. Available aliases: ${venue.aliases.length}`);
      return;
    }

    // Get current primary name (can be empty) and target alias
    const currentPrimaryName = venue.name || '';
    const targetAlias = venue.aliases[aliasIndex];

    // Create new aliases array
    let newAliases = [...venue.aliases];

    // If primary name exists, replace the target alias with it
    // If primary name is empty, just remove the target alias
    if (currentPrimaryName.trim() !== '') {
      newAliases[aliasIndex] = currentPrimaryName;
    } else {
      newAliases.splice(aliasIndex, 1); // Remove the alias that becomes primary
    }

    try {
      // Update venue with swapped names
      wmeSDK.DataModel.Venues.updateVenue({
        venueId: venueId,
        name: targetAlias,
        aliases: newAliases,
      });

      Logger.info(`Swapped names: "${currentPrimaryName}" ↔ "${targetAlias}" (alias index: ${aliasIndex})`);
      try {
        WazeToastr.Alerts.info('POI Shortcut', `Swapped names: "<b>${currentPrimaryName}</b>" ↔ "<b>${targetAlias}</b>"`, false, false, 3000);
      } catch (e) {
        Logger.warn('WazeToastr.Alerts.info failed:', e);
      }

      // Re-inject swap buttons so icon appears immediately
      setTimeout(function () {
        injectSwapNamesButton(wmeSDK);
      }, 150);
    } catch (error) {
      Logger.error('Error swapping venue names:', error);
    }
  }

  function injectSwapNamesButton(wmeSDK) {
    // Always disconnect previous observers/listeners before setting up new ones
    disconnectAliasObserver();

    // Remove any existing event handlers to prevent accumulation
    $(document).off('focusout.wme-poi-shortcuts');
    $(document).off('click.wme-poi-shortcuts-alias');
    document.removeEventListener('venueSelected', handleVenueSelected, true);

    // Define handlers with proper scope
    function handleVenueSelected() {
      setTimeout(() => tryInjectSwapButton(), 100);
    }

    // Ensure swap buttons are injected after venue creation and alias addition
    // Listen for venue creation (new venue selection)
    document.addEventListener('venueSelected', handleVenueSelected, true);

    // Listen for alias addition (when alias input loses focus or alias is added)
    $(document).on('focusout.wme-poi-shortcuts', '.alias-item-content input', function () {
      debouncedInjectSwapButton(wmeSDK);
    });

    // Listen for alias addition via button click (if applicable)
    $(document).on('click.wme-poi-shortcuts-alias', '.add-alias-btn', function () {
      debouncedInjectSwapButton(wmeSDK);
    });
    // Clean up existing observer when selection changes
    disconnectAliasObserver();

    // Only run if a venue is selected
    const selection = wmeSDK.Editing.getSelection();
    if (!selection || selection.objectType !== 'venue' || !selection.ids || selection.ids.length !== 1) {
      return;
    }

    const venueId = selection.ids[0];
    const venue = wmeSDK.DataModel.Venues.getById({ venueId });

    if (!venue) return;

    // Setup MutationObserver to watch for changes in aliases list
    function setupAliasObserver() {
      const aliasesList = document.querySelector('.aliases-list');
      const nameInput = document.querySelector('input[placeholder*="name" i], input[name*="name" i], .venue-name input, .place-name input');
      if (!aliasesList && !nameInput) return;

      try {
        // Observe the aliases list for new alias additions (only if not already observing)
        if (aliasesList && !aliasListObserver) {
          aliasListObserver = new MutationObserver((mutations) => {
            let shouldReinject = false;
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                shouldReinject = true;
              }
            });
            if (shouldReinject) {
              debouncedInjectSwapButton(wmeSDK);
            }
          });
          aliasListObserver.observe(aliasesList, { childList: true, subtree: true });
        }

        // Observe existing alias items for text changes (only if not already observed)
        const aliasItems = document.querySelectorAll('div[slot="item-key"].alias-item-content');
        aliasItems.forEach((aliasItem) => {
          const itemKey = aliasItem.outerHTML;
          if (!observedAliasItems.has(itemKey)) {
            observedAliasItems.add(itemKey);
            const aliasObserver = new MutationObserver(() => {
              debouncedInjectSwapButton(wmeSDK);
            });
            aliasObserver.observe(aliasItem, { childList: true, subtree: true, characterData: true });
            // Track this observer for proper cleanup
            aliasObservers.add(aliasObserver);
          }
        });

        // Observe name input for changes (only if not already observed)
        if (nameInput && !nameInputObserved) {
          nameInputObserved = true;
          nameInput.addEventListener('input', () => {
            debouncedInjectSwapButton(wmeSDK);
          });
          // Also observe attribute changes (for autofill etc)
          if (!nameAttrObserver) {
            nameAttrObserver = new MutationObserver(() => {
              debouncedInjectSwapButton(wmeSDK);
            });
            nameAttrObserver.observe(nameInput, { attributes: true });
          }
        }
      } catch (error) {
        Logger.warn('Error setting up alias observer:', error);
      }
    }

    // Wait for the venue aliases section to exist and inject swap buttons
    function tryInjectSwapButton(attemptCount = 0) {
      if (attemptCount >= MAX_RETRY_ATTEMPTS) {
        Logger.warn('Max retry attempts reached for swap button injection');
        return;
      }

      const $aliasItems = $('div[slot="item-key"].alias-item-content').closest('wz-list-item');

      if ($aliasItems.length === 0) {
        // Even if no aliases exist yet, set up observers to catch them when they're added
        setupAliasObserver();
        setTimeout(() => tryInjectSwapButton(attemptCount + 1), RETRY_INJECTION_DELAY);
        return;
      }

      // Setup observer for alias items (in case they weren't set up already)
      setupAliasObserver();

      let foundAliases = false;

      // Process each alias item and add swap button if needed
      $aliasItems.each(function (index) {
        const $aliasItem = $(this);
        const $actionsContainer = $aliasItem.find('div[slot="actions"].alias-item-actions');

        if ($actionsContainer.length === 0) return true; // Continue to next iteration

        // Remove unwanted "To Name" button from other scripts
        $actionsContainer
          .find('div.makePrimary.alias-item-action')
          .filter(function () {
            return $(this).text().trim() === 'To Name';
          })
          .remove();

        // Check if swap button already exists in this specific alias item
        if ($actionsContainer.find('.swap-names-btn').length > 0) {
          foundAliases = true;
          return true; // Continue to next iteration
        }

        // Check if venue has aliases before showing button (primary name can be empty)
        const hasSwappableNames = venue.aliases && venue.aliases.length > 0;
        if (!hasSwappableNames) return true; // Continue to next iteration

        // Create swap button for this specific alias
        const buttonHtml = `
          <wz-button color="blue" size="sm" class="alias-item-action alias-item-action-swap swap-names-btn" title="Swap primary name with this alias" data-alias-index="${index}">
            <i class="w-icon w-icon-arrow-up alias-item-action-icon"></i>
          </wz-button>
        `;

        $actionsContainer.prepend(buttonHtml);
        foundAliases = true;
      });

      // Retry if no aliases found yet
      if (!foundAliases) {
        setTimeout(() => tryInjectSwapButton(attemptCount + 1), RETRY_INJECTION_DELAY);
        return;
      }

      // Attach click handler for all swap buttons
      $('.swap-names-btn')
        .off('click.swapnames')
        .on('click.swapnames', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const aliasIndex = parseInt($(this).attr('data-alias-index') || '0', 10);
          swapPrimaryAndAliasNames(wmeSDK, aliasIndex);
        });

      // If primary name is empty, optionally disable swap buttons
      if (!venue.name || venue.name.trim() === '') {
        // Always enable swap buttons if there are aliases
        $('.swap-names-btn').removeAttr('disabled').attr('title', 'Promote this alias to primary name');
      } else {
        $('.swap-names-btn').removeAttr('disabled').attr('title', 'Swap primary name with this alias');
      }
    }

    // Start the injection process and setup observers immediately
    setupAliasObserver();
    tryInjectSwapButton();
  }

  /**
   * Handles NOC button click with specific business logic for Nepal gas stations
   *
   * This function implements intelligent NOC name management with three distinct cases:
   *
   * CASE 1: Empty Gas Station
   * - Condition: No primary name AND no aliases
   * - Action: Sets "NOC" as primary name
   * - Example: Empty venue → Primary: "NOC", Aliases: []
   *
   * CASE 2: NOC Primary with Aliases (Smart Swap)
   * - Condition: Primary name is "NOC" AND has at least one alias
   * - Action: Swaps primary name with first English alias (uses regex), moves "NOC" to aliases
   * - Prioritizes English over Nepali names when selecting which alias to promote
   * - Example: Primary: "NOC", Aliases: ["नेपाल तेल", "Shell"] → Primary: "Shell", Aliases: ["NOC", "नेपाल तेल"]
   *
   * CASE 3: Non-NOC Primary (Add as Alias)
   * - Condition: Primary name is NOT "NOC" AND "NOC" not in aliases
   * - Action: Adds "NOC" as an additional alias
   * - Example: Primary: "Shell", Aliases: ["Pump"] → Primary: "Shell", Aliases: ["Pump", "NOC"]
   *
   * Additional Features:
   * - Conditionally sets brand to "Nepal Oil Corporation" only if different/empty
   * - Conditionally sets website to "noc.org.np" only if different/empty
   * - Always applies lock rank if different from current (even when no name changes needed)
   * - Uses proper delays to prevent WME update conflicts
   * - Comprehensive error handling to prevent InvalidStateError
   *
   * @param {Object} wmeSDK - The WME SDK instance
   * @param {string} venueId - The venue ID
   * @param {Object} venue - The venue object
   * @param {number} lockRank - The lock rank to apply
   */
  function handleNOCButtonClick(wmeSDK, venueId, venue, lockRank) {
    const currentName = venue.name ? venue.name.trim() : '';
    const currentAliases = Array.isArray(venue.aliases) ? venue.aliases.slice() : [];

    // Helper function to build update object with conditional brand/url setting
    function buildUpdateObject(baseObj) {
      const updateObj = { ...baseObj };

      // Only set brand if it's empty or different from target brand
      if (!venue.brand || venue.brand !== 'Nepal Oil Corporation') {
        updateObj.brand = 'Nepal Oil Corporation';
      }

      // Only set URL if it's empty or different from target URL
      if (!venue.url || venue.url !== 'noc.org.np') {
        updateObj.url = 'noc.org.np';
      }

      return updateObj;
    }

    // Case 1: Gas station has no names - add "NOC" as primary name
    if (!currentName && currentAliases.length === 0) {
      const updateObj = buildUpdateObject({
        venueId: venueId,
        name: 'NOC',
        aliases: [],
      });

      try {
        wmeSDK.DataModel.Venues.updateVenue(updateObj);
        Logger.info('NOC: Added NOC as primary name to empty gas station');

        // Apply lock rank with delay and combined alert
        if (lockRank !== undefined && lockRank !== null && lockRank !== venue.lockRank) {
          setTimeout(() => {
            try {
              wmeSDK.DataModel.Venues.updateVenue({ venueId: venueId, lockRank: lockRank });
              Logger.info('[NOC Debug] lockRank updated successfully:', lockRank);
              try {
                WazeToastr.Alerts.info('NOC Update', `<b>Case 1:</b> Empty gas station updated<br>Primary: <b>NOC</b><br>Brand: <b>Nepal Oil Corporation</b><br>Lock Rank: <b>${venue.lockRank + 1}</b> → <b>${lockRank + 1}</b>`, false, false, 3000);
              } catch (e) {
                Logger.warn('WazeToastr.Alerts.info failed:', e);
              }
            } catch (err) {
              Logger.warn('[NOC Debug] lockRank update failed:', err);
              try {
                WazeToastr.Alerts.warning('NOC Update', `<b>Case 1:</b> Empty gas station updated<br>Primary: <b>NOC</b><br>Brand: <b>Nepal Oil Corporation</b><br>⚠️ Lock rank update failed`, false, false, 3000);
              } catch (e) {
                Logger.warn('WazeToastr.Alerts.warning failed:', e);
              }
            }
          }, RETRY_INJECTION_DELAY * 3);
        } else {
          const lockMessage = lockRank !== undefined && lockRank !== null ? `<br>Lock Rank: <b>${lockRank + 1}</b> (unchanged)` : '';
          try {
            WazeToastr.Alerts.info('NOC Update', `<b>Case 1:</b> Empty gas station updated<br>Primary: <b>NOC</b><br>Brand: <b>Nepal Oil Corporation</b>${lockMessage}`, false, false, 3000);
          } catch (e) {
            Logger.warn('WazeToastr.Alerts.info failed:', e);
          }
        }
      } catch (err) {
        Logger.error('NOC: Error updating venue (Case 1):', err);
        try {
          WazeToastr.Alerts.error('NOC Error', 'Failed to update empty gas station', false, false, 3000);
        } catch (e) {
          Logger.warn('WazeToastr.Alerts.error failed:', e);
        }
        return;
      }
      return;
    }

    // Case 2: Primary name is "NOC" and has aliases - swap primary with English alias preferentially
    if (currentName === 'NOC' && currentAliases.length > 0) {
      // Helper function to detect if text is likely English (uses Latin characters)
      const isEnglish = (text) => /^[a-zA-Z0-9\s\-'&.()]+$/.test(text.trim());

      // Find the first English alias, fallback to first alias if none found
      let selectedAliasIndex = 0;
      for (let i = 0; i < currentAliases.length; i++) {
        if (isEnglish(currentAliases[i])) {
          selectedAliasIndex = i;
          break;
        }
      }

      const newPrimaryName = currentAliases[selectedAliasIndex];
      // Create new aliases array: NOC first, then remaining aliases (excluding the selected one)
      const remainingAliases = currentAliases.filter((_, index) => index !== selectedAliasIndex);
      const newAliases = ['NOC', ...remainingAliases];

      const updateObj = buildUpdateObject({
        venueId: venueId,
        name: newPrimaryName,
        aliases: newAliases,
      });

      try {
        wmeSDK.DataModel.Venues.updateVenue(updateObj);
        Logger.info(`NOC: Swapped NOC with ${newPrimaryName}, NOC is now alias`);

        // Apply lock rank with delay and combined alert
        if (lockRank !== undefined && lockRank !== null && lockRank !== venue.lockRank) {
          setTimeout(() => {
            try {
              wmeSDK.DataModel.Venues.updateVenue({ venueId: venueId, lockRank: lockRank });
              Logger.info('[NOC Debug] lockRank updated successfully:', lockRank);
              try {
                WazeToastr.Alerts.info('NOC Update', `<b>Case 2:</b> Smart swap completed<br>Primary: <b>${newPrimaryName}</b><br>NOC moved to aliases<br>Lock Rank: <b>${venue.lockRank + 1}</b> → <b>${lockRank + 1}</b>`, false, false, 3000);
              } catch (e) {
                Logger.warn('WazeToastr.Alerts.info failed:', e);
              }
            } catch (err) {
              Logger.warn('[NOC Debug] lockRank update failed:', err);
              try {
                WazeToastr.Alerts.warning('NOC Update', `<b>Case 2:</b> Smart swap completed<br>Primary: <b>${newPrimaryName}</b><br>NOC moved to aliases<br>⚠️ Lock rank update failed`, false, false, 3000);
              } catch (e) {
                Logger.warn('WazeToastr.Alerts.warning failed:', e);
              }
            }
          }, RETRY_INJECTION_DELAY * 3);
        } else {
          const lockMessage = lockRank !== undefined && lockRank !== null ? `<br>Lock Rank: <b>${lockRank + 1}</b> (unchanged)` : '';
          try {
            WazeToastr.Alerts.info('NOC Update', `<b>Case 2:</b> Smart swap completed<br>Primary: <b>${newPrimaryName}</b><br>NOC moved to aliases${lockMessage}`, false, false, 3000);
          } catch (e) {
            Logger.warn('WazeToastr.Alerts.info failed:', e);
          }
        }
      } catch (err) {
        Logger.error('NOC: Error updating venue (Case 2):', err);
        try {
          WazeToastr.Alerts.error('NOC Error', 'Failed to swap NOC with alias name', false, false, 3000);
        } catch (e) {
          Logger.warn('WazeToastr.Alerts.error failed:', e);
        }
        return;
      }
      return;
    }

    // Case 3: Primary name is not "NOC" and no "NOC" alias exists - add "NOC" as alias
    if (currentName !== 'NOC' && !currentAliases.includes('NOC')) {
      const newAliases = [...currentAliases, 'NOC'];

      const updateObj = buildUpdateObject({
        venueId: venueId,
        name: currentName,
        aliases: newAliases,
      });

      try {
        wmeSDK.DataModel.Venues.updateVenue(updateObj);
        Logger.info(`NOC: Added NOC as alias to gas station with primary name: ${currentName}`);

        // Apply lock rank with delay and combined alert
        if (lockRank !== undefined && lockRank !== null && lockRank !== venue.lockRank) {
          setTimeout(() => {
            try {
              wmeSDK.DataModel.Venues.updateVenue({ venueId: venueId, lockRank: lockRank });
              Logger.info('[NOC Debug] lockRank updated successfully:', lockRank);
              try {
                WazeToastr.Alerts.info('NOC Update', `<b>Case 3:</b> NOC added as alias<br>Primary: <b>${currentName}</b><br>NOC added to aliases<br>Lock Rank: <b>${venue.lockRank + 1}</b> → <b>${lockRank + 1}</b>`, false, false, 3000);
              } catch (e) {
                Logger.warn('WazeToastr.Alerts.info failed:', e);
              }
            } catch (err) {
              Logger.warn('[NOC Debug] lockRank update failed:', err);
              try {
                WazeToastr.Alerts.warning('NOC Update', `<b>Case 3:</b> NOC added as alias<br>Primary: <b>${currentName}</b><br>NOC added to aliases<br>⚠️ Lock rank update failed`, false, false, 3000);
              } catch (e) {
                Logger.warn('WazeToastr.Alerts.warning failed:', e);
              }
            }
          }, RETRY_INJECTION_DELAY * 3);
        } else {
          const lockMessage = lockRank !== undefined && lockRank !== null ? `<br>Lock Rank: <b>${lockRank + 1}</b> (unchanged)` : '';
          try {
            WazeToastr.Alerts.info('NOC Update', `<b>Case 3:</b> NOC added as alias<br>Primary: <b>${currentName}</b><br>NOC added to aliases${lockMessage}`, false, false, 3000);
          } catch (e) {
            Logger.warn('WazeToastr.Alerts.info failed:', e);
          }
        }
      } catch (err) {
        Logger.error('NOC: Error updating venue (Case 3):', err);
        try {
          WazeToastr.Alerts.error('NOC Error', 'Failed to add NOC as alias', false, false, 3000);
        } catch (e) {
          Logger.warn('WazeToastr.Alerts.error failed:', e);
        }
        return;
      }
      return;
    }

    // Edge case: Primary name is not "NOC" but "NOC" already exists as alias
    if (currentName !== 'NOC' && currentAliases.includes('NOC')) {
      Logger.info('NOC: NOC already exists as alias, checking lock rank');

      // Still apply lock rank if it's different from current
      if (lockRank !== undefined && lockRank !== null && lockRank !== venue.lockRank) {
        setTimeout(() => {
          try {
            wmeSDK.DataModel.Venues.updateVenue({ venueId: venueId, lockRank: lockRank });
            Logger.info(`[NOC Debug] lockRank updated successfully: ${lockRank} (was ${venue.lockRank})`);
            try {
              WazeToastr.Alerts.info('NOC Update', `<b>Edge Case:</b> NOC already in aliases<br>Lock rank updated: <b>${venue.lockRank + 1}</b> → <b>${lockRank + 1}</b>`, false, false, 3000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.info failed:', e);
            }
          } catch (err) {
            Logger.warn('[NOC Debug] lockRank update failed:', err);
            try {
              WazeToastr.Alerts.warning('NOC Update', `<b>Edge Case:</b> NOC already in aliases<br>⚠️ Lock rank update failed`, false, false, 3000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.warning failed:', e);
            }
          }
        }, RETRY_INJECTION_DELAY * 3);
      } else {
        Logger.info('NOC: No changes needed - NOC exists and lock rank unchanged');
        try {
          WazeToastr.Alerts.info('NOC Update', '<b>No Changes:</b> NOC already in aliases<br>Lock rank already correct', false, false, 2500);
        } catch (e) {
          Logger.warn('WazeToastr.Alerts.info failed:', e);
        }
      }
      return;
    }

    // Edge case: Primary name is "NOC" but no aliases
    if (currentName === 'NOC' && currentAliases.length === 0) {
      Logger.info('NOC: Gas station already has NOC as primary name with no aliases, checking lock rank');

      // Still apply lock rank if it's different from current
      if (lockRank !== undefined && lockRank !== null && lockRank !== venue.lockRank) {
        setTimeout(() => {
          try {
            wmeSDK.DataModel.Venues.updateVenue({ venueId: venueId, lockRank: lockRank });
            Logger.info(`[NOC Debug] lockRank updated successfully: ${lockRank} (was ${venue.lockRank})`);
            try {
              WazeToastr.Alerts.info('NOC Update', `<b>Edge Case:</b> NOC already primary<br>Lock rank updated: <b>${venue.lockRank + 1}</b> → <b>${lockRank + 1}</b>`, false, false, 3000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.info failed:', e);
            }
          } catch (err) {
            Logger.warn('[NOC Debug] lockRank update failed:', err);
            try {
              WazeToastr.Alerts.warning('NOC Update', `<b>Edge Case:</b> NOC already primary<br>⚠️ Lock rank update failed`, false, false, 3000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.warning failed:', e);
            }
          }
        }, RETRY_INJECTION_DELAY * 3);
      } else {
        Logger.info('NOC: No changes needed - NOC is primary and lock rank unchanged');
        try {
          WazeToastr.Alerts.info('NOC Update', '<b>No Changes:</b> NOC already primary<br>Lock rank already correct', false, false, 2500);
        } catch (e) {
          Logger.warn('WazeToastr.Alerts.info failed:', e);
        }
      }
      return;
    }
  }

  /**
   * Handles charging station brand/network button clicks
   * Updates primary name, brand, website, aliases, and lock rank
   *
   * @param {Object} wmeSDK - The WME SDK instance
   * @param {string} venueId - The venue ID
   * @param {Object} venue - The venue object
   * @param {string} primaryName - The primary network/brand name
   * @param {string} brand - The brand value
   * @param {string} website - The website URL
   * @param {number} lockRank - The lock rank to apply
   * @param {Array} countryBrands - Array of brand objects for the country
   */
  function handleChargingStationButtonClick(wmeSDK, venueId, venue, primaryName, brand, website, lockRank, countryBrands) {
    try {
      // Find the selected brand object to get its predefined aliases
      const selectedBrandObj = countryBrands ? countryBrands.find((brandObj) => brandObj.primaryName === primaryName) : null;

      // Build aliases array following SDK best practices
      let aliases = Array.isArray(venue.aliases) ? venue.aliases.slice() : [];

      // Add current venue name to aliases if it's different from the selected primaryName
      if (venue.name && venue.name !== primaryName && !aliases.includes(venue.name)) {
        aliases.push(venue.name);
      }

      // Add predefined aliases from the brand data
      if (selectedBrandObj && Array.isArray(selectedBrandObj.aliases)) {
        selectedBrandObj.aliases.forEach((alias) => {
          if (alias && alias.trim() !== '' && !aliases.includes(alias)) {
            aliases.push(alias);
          }
        });
      }

      // Build update object with conditional property setting
      const updateObj = {
        venueId: venueId,
        name: primaryName,
        aliases: aliases,
      };

      // Only set brand if it's different from current
      // Commented out for future use - brand field not currently needed for charging stations
      // if (!venue.brand || venue.brand !== brand) {
      //   updateObj.brand = brand;
      // }

      // Only set URL if it's different from current
      if (website && (!venue.url || venue.url !== website)) {
        updateObj.url = website;
      }

      // Set opening hours if specified in brand data (e.g., ElectriVa is 24/7)
      if (selectedBrandObj && selectedBrandObj.openingHours) {
        updateObj.openingHours = selectedBrandObj.openingHours;
      }

      Logger.info('[Charging Station] Updating with:', updateObj);

      // Apply venue updates using SDK updateVenue method
      wmeSDK.DataModel.Venues.updateVenue(updateObj);
      Logger.info(`[Charging Station] Updated to ${primaryName}`);

      // Select the charging station network from WME dropdown if networkName is available
      if (selectedBrandObj && selectedBrandObj.networkName !== undefined && selectedBrandObj.networkName !== null) {
        setTimeout(() => {
          selectChargingStationNetwork(selectedBrandObj.networkName).then((networkSelected) => {
            if (networkSelected) {
              Logger.info(`[Charging Station] Network dropdown updated to: ${selectedBrandObj.networkName}`);
            } else {
              Logger.warn(`[Charging Station] Failed to update network dropdown for: ${selectedBrandObj.networkName}`);
            }
          });
        }, RETRY_INJECTION_DELAY * 2);
      }

      // Set the cost type from WME dropdown if costType is available
      if (selectedBrandObj && selectedBrandObj.costType) {
        setTimeout(() => {
          setChargingStationCostType(selectedBrandObj.costType).then((costTypeSet) => {
            if (costTypeSet) {
              const costLabel = selectedBrandObj.costType === 'FREE' ? 'Free' : selectedBrandObj.costType === 'FEE' ? 'Paid' : 'Unspecified';
              Logger.info(`[Charging Station] Cost type set to: ${costLabel}`);
            } else {
              Logger.warn(`[Charging Station] Failed to set cost type to: ${selectedBrandObj.costType}`);
            }
          });
        }, RETRY_INJECTION_DELAY * 4); // Wait longer to ensure network dropdown is done
      }

      // Set payment methods from WME dropdown if paymentMethods array is available
      if (selectedBrandObj && selectedBrandObj.paymentMethods && Array.isArray(selectedBrandObj.paymentMethods) && selectedBrandObj.paymentMethods.length > 0) {
        setTimeout(() => {
          setChargingStationPaymentMethods(selectedBrandObj.paymentMethods).then((paymentMethodsSet) => {
            if (paymentMethodsSet) {
              const paymentLabels = selectedBrandObj.paymentMethods.map(getPaymentMethodLabel).join(', ');
              Logger.info(`[Charging Station] Payment methods set to: ${paymentLabels}`);
            } else {
              const paymentLabels = selectedBrandObj.paymentMethods.map(getPaymentMethodLabel).join(', ');
              Logger.warn(`[Charging Station] Failed to set payment methods: ${paymentLabels}`);
            }
          });
        }, RETRY_INJECTION_DELAY * 6); // Wait even longer to avoid conflicts with cost type
      }

      // Apply lock rank with delay to prevent conflicts
      if (lockRank !== undefined && lockRank !== null && lockRank !== venue.lockRank) {
        setTimeout(() => {
          try {
            wmeSDK.DataModel.Venues.updateVenue({ venueId: venueId, lockRank: lockRank });
            Logger.info(`[Charging Station] Lock rank updated to ${lockRank}`);
            // Build additional info message for opening hours and payment methods
            let additionalInfo = '';
            if (selectedBrandObj && selectedBrandObj.is24_7) {
              additionalInfo += '<br><b>Hours:</b> Open 24/7';
            }
            if (selectedBrandObj && selectedBrandObj.paymentMethods && selectedBrandObj.paymentMethods.length > 0) {
              const paymentDisplay = selectedBrandObj.paymentMethods.map(getPaymentMethodLabel).join(', ');
              additionalInfo += `<br><b>Payment:</b> ${paymentDisplay}`;
            }

            try {
              WazeToastr.Alerts.success(
                'Charging Station Updated',
                `<b>Network:</b> ${primaryName}<br><b>Brand:</b> ${brand}<br><b>Aliases:</b> ${aliases.length > 0 ? aliases.join(', ') : 'None'}<br><b>Lock Rank:</b> ${venue.lockRank + 1} → ${lockRank + 1}${additionalInfo}`,
                false,
                false,
                4000
              );
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.success failed:', e);
            }
          } catch (err) {
            Logger.warn('[Charging Station] Lock rank update failed:', err);
            try {
              WazeToastr.Alerts.warning('Charging Station Updated', `<b>Network:</b> ${primaryName}<br><b>Brand:</b> ${brand}<br><b>Aliases:</b> ${aliases.length > 0 ? aliases.join(', ') : 'None'}<br>⚠️ Lock rank update failed`, false, false, 3000);
            } catch (e) {
              Logger.warn('WazeToastr.Alerts.warning failed:', e);
            }
          }
        }, RETRY_INJECTION_DELAY * 3);
      } else {
        const lockMessage = lockRank !== undefined && lockRank !== null ? `<br><b>Lock Rank:</b> ${lockRank + 1} (unchanged)` : '';

        // Build additional info message for opening hours and payment methods
        let additionalInfo = '';
        if (selectedBrandObj && selectedBrandObj.is24_7) {
          additionalInfo += '<br><b>Hours:</b> Open 24/7';
        }
        if (selectedBrandObj && selectedBrandObj.paymentMethods && selectedBrandObj.paymentMethods.length > 0) {
          const paymentDisplay = selectedBrandObj.paymentMethods.map(getPaymentMethodLabel).join(', ');
          additionalInfo += `<br><b>Payment:</b> ${paymentDisplay}`;
        }

        try {
          WazeToastr.Alerts.success('Charging Station Updated', `<b>Network:</b> ${primaryName}<br><b>Brand:</b> ${brand}<br><b>Aliases:</b> ${aliases.length > 0 ? aliases.join(', ') : 'None'}${lockMessage}${additionalInfo}`, false, false, 4000);
        } catch (e) {
          Logger.warn('WazeToastr.Alerts.success failed:', e);
        }
      }
    } catch (error) {
      Logger.error('[Charging Station] Error updating:', error);
      try {
        WazeToastr.Alerts.error('Charging Station Error', `Failed to update to ${primaryName}`, false, false, 3000);
      } catch (e) {
        Logger.warn('WazeToastr.Alerts.error failed:', e);
      }
    }
  }

  /**
   * Handles gas station brand button clicks (non-NOC)
   * Updates primary name, brand, website, aliases, and lock rank
   *
   * @param {Object} wmeSDK - The WME SDK instance
   * @param {string} venueId - The venue ID
   * @param {Object} venue - The venue object
   * @param {string} primaryName - The primary brand name
   * @param {string} brand - The brand value
   * @param {string} website - The website URL
   * @param {number} lockRank - The lock rank to apply
   * @param {Array} countryBrands - Array of brand objects for the country
   */
  function handleGasStationButtonClick(wmeSDK, venueId, venue, primaryName, brand, website, lockRank, countryBrands) {
    try {
      // Find the selected brand object to get its predefined aliases
      const selectedBrandObj = countryBrands ? countryBrands.find((brandObj) => brandObj.primaryName === primaryName) : null;

      // Build aliases array following SDK best practices
      let aliases = Array.isArray(venue.aliases) ? venue.aliases.slice() : [];

      // Add current venue name to aliases if it's different from the selected primaryName
      if (venue.name && venue.name !== primaryName && !aliases.includes(venue.name)) {
        aliases.push(venue.name);
      }

      // Add predefined aliases from the brand data
      if (selectedBrandObj && Array.isArray(selectedBrandObj.aliases)) {
        selectedBrandObj.aliases.forEach((alias) => {
          if (alias && alias.trim() !== '' && !aliases.includes(alias)) {
            aliases.push(alias);
          }
        });
      }

      // Build update object with conditional property setting
      const updateObj = {
        venueId: venueId,
        name: primaryName,
        aliases: aliases,
      };

      // Only set brand if it's different from current
      if (!venue.brand || venue.brand !== brand) {
        updateObj.brand = brand;
      }

      // Only set URL if it's different from current
      if (website && (!venue.url || venue.url !== website)) {
        updateObj.url = website;
      }

      Logger.info('[Gas Station] Updating with:', updateObj);

      // Apply venue updates using SDK updateVenue method
      wmeSDK.DataModel.Venues.updateVenue(updateObj);
      Logger.info(`[Gas Station] Updated to ${primaryName}`);

      // Apply lock rank with delay to prevent conflicts
      if (lockRank !== undefined && lockRank !== null && lockRank !== venue.lockRank) {
        setTimeout(() => {
          try {
            wmeSDK.DataModel.Venues.updateVenue({ venueId: venueId, lockRank: lockRank });
            Logger.info(`[Gas Station] Lock rank updated to ${lockRank}`);
            WazeToastr.Alerts.success(
              'Gas Station Updated',
              `<b>Brand:</b> ${primaryName}<br><b>Company:</b> ${brand}<br><b>Aliases:</b> ${aliases.length > 0 ? aliases.join(', ') : 'None'}<br><b>Lock Rank:</b> ${venue.lockRank + 1} → ${lockRank + 1}`,
              false,
              false,
              3000
            );
          } catch (err) {
            Logger.warn('[Gas Station] Lock rank update failed:', err);
            WazeToastr.Alerts.warning('Gas Station Updated', `<b>Brand:</b> ${primaryName}<br><b>Company:</b> ${brand}<br><b>Aliases:</b> ${aliases.length > 0 ? aliases.join(', ') : 'None'}<br>⚠️ Lock rank update failed`, false, false, 3000);
          }
        }, RETRY_INJECTION_DELAY * 3);
      } else {
        const lockMessage = lockRank !== undefined && lockRank !== null ? `<br><b>Lock Rank:</b> ${lockRank + 1} (unchanged)` : '';
        WazeToastr.Alerts.success('Gas Station Updated', `<b>Brand:</b> ${primaryName}<br><b>Company:</b> ${brand}<br><b>Aliases:</b> ${aliases.length > 0 ? aliases.join(', ') : 'None'}${lockMessage}`, false, false, 3000);
      }
    } catch (error) {
      Logger.error('[Gas Station] Error updating:', error);
      WazeToastr.Alerts.error('Gas Station Error', `Failed to update to ${primaryName}`, false, false, 3000);
    }
  }

  function injectButtonStation(wmeSDK) {
    // Only run if a venue is selected
    const selection = wmeSDK.Editing.getSelection();
    if (!selection || selection.objectType !== 'venue' || !selection.ids || selection.ids.length !== 1) return;

    const venueId = selection.ids[0];
    const venue = wmeSDK.DataModel.Venues.getById({ venueId });
    const topCountry = wmeSDK.DataModel.Countries.getTopCountry();
    const gasStationKey = getGasStationCategoryKey();
    const chargingStationKey = getChargingStationCategoryKey();

    // Check if venue.categories (array) contains the gas station or charging station key and country is Nepal or Pakistan
    const isNepal = !!topCountry && (topCountry.name === 'Nepal' || topCountry.code === 'NP');
    const isPakistan = !!topCountry && (topCountry.name === 'Pakistan' || topCountry.code === 'PK');
    const isGasStation = !!venue && Array.isArray(venue.categories) && venue.categories.includes(gasStationKey);
    const isChargingStation = !!venue && Array.isArray(venue.categories) && venue.categories.includes(chargingStationKey);

    // Only show buttons for Nepal gas/charging stations or Pakistan gas stations
    if (!((isGasStation || isChargingStation) && isNepal) && !(isGasStation && isPakistan)) return;

    // Show brand buttons for Nepal and Pakistan gas stations, and Nepal charging stations
    function tryInjectBrandButtons(attemptCount = 0) {
      if (attemptCount >= MAX_RETRY_ATTEMPTS) {
        Logger.warn('Max retry attempts reached for brand button injection');
        return;
      }

      const $catControl = $('.categories-control');
      if ($catControl.length === 0) {
        setTimeout(() => tryInjectBrandButtons(attemptCount + 1), BRAND_BUTTON_RETRY_DELAY);
        return;
      }
      // Prevent duplicate buttons
      if ($('.gas-station-brand-btn, .charging-station-brand-btn').length > 0) return;

      // Determine which type of station and get relevant brands
      let countryBrands = null;
      let stationTypeName = '';
      let buttonClass = '';
      let categoryKey = '';

      if (isGasStation) {
        stationTypeName = 'Gas Station';
        buttonClass = 'gas-station-brand-btn';
        categoryKey = gasStationKey;
        if (isNepal) {
          countryBrands = GAS_STATION_BRANDNAME.Nepal.brandnames;
        } else if (isPakistan) {
          countryBrands = GAS_STATION_BRANDNAME.Pakistan.brandnames;
        }
      } else if (isChargingStation && isNepal) {
        stationTypeName = 'Charging Station';
        buttonClass = 'charging-station-brand-btn';
        categoryKey = chargingStationKey;
        countryBrands = CHARGING_STATION_BRANDNAME.Nepal.brandnames;
      }

      if (!countryBrands) return;

      // Build buttons for each brand
      let buttonsHtml = `<div class='form-group e85 e85-e85-14'><label class='control-label'>Set ${stationTypeName} Brand</label>`;
      countryBrands.forEach((brandObj) => {
        buttonsHtml += `<button class='waze-btn waze-btn-small waze-btn-white e85 ${buttonClass}' style='border:2px solid #0078d7;border-radius:4px;margin:2px;' data-primary='${brandObj.primaryName}' data-brand='${brandObj.brand}' data-website='${
          brandObj.website || ''
        }' data-category='${categoryKey}'>${brandObj.primaryName}</button> `;
      });
      buttonsHtml += `</div>`;
      $catControl.after(buttonsHtml);

      // Button click handler for both gas station and charging station brands
      $('.gas-station-brand-btn, .charging-station-brand-btn').on('click', function () {
        const primaryName = $(this).attr('data-primary');
        const brand = $(this).attr('data-brand');
        const website = $(this).attr('data-website');
        const categoryKey = $(this).attr('data-category');
        const isChargingStationBtn = $(this).hasClass('charging-station-brand-btn');

        // Read lockRank for the station category from localStorage config
        let lockRank = null;
        let config = {};
        try {
          config = JSON.parse(localStorage.getItem('wme-poi-shortcuts-config') || '{}');
        } catch (e) {
          config = {};
        }
        let foundConfig = false;
        for (let i = 1; i <= 10; i++) {
          if (config[i] && config[i].category === categoryKey) {
            lockRank = parseInt(config[i].lock, 10);
            foundConfig = true;
            break;
          }
        }
        if (!foundConfig || isNaN(lockRank)) {
          lockRank = venue.lockRank && !isNaN(venue.lockRank) ? venue.lockRank : 1;
        }

        // Special handling for NOC button in Nepal
        if (primaryName === 'NOC' && isNepal && isGasStation) {
          handleNOCButtonClick(wmeSDK, venueId, venue, lockRank);
          return; // Exit early for NOC
        }

        // Handle charging station or regular gas station brand updates
        if (isChargingStationBtn) {
          handleChargingStationButtonClick(wmeSDK, venueId, venue, primaryName, brand, website, lockRank, countryBrands);
        } else {
          handleGasStationButtonClick(wmeSDK, venueId, venue, primaryName, brand, website, lockRank, countryBrands);
        }
      });
    }
    tryInjectBrandButtons();
  }

  async function registerSidebarScriptTab(wmeSDK) {
    // Register a script tab in the Scripts sidebar
    try {
      const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab();
      // Add label/icon to the tab
      tabLabel.innerHTML = '<span style="display:flex;align-items:center;"><span style="font-size:16px;margin-right:4px;">⭐</span>POI Shortcuts</span>';
      // Use buildAllItemOptions to show all 10 dropdowns with script info header
      tabPane.innerHTML = `
        <div id='wme-poi-shortcuts-content'>
          <div style="padding: 8px 16px; background: #f5f5f5; border-bottom: 1px solid #ddd; margin-bottom: 10px;">
            <div style="font-weight: bold; font-size: 14px; color: #333;">${scriptName}</div>
            <div style="font-size: 12px; color: #666;">${scriptVersion}</div>
          </div>
          ${buildAllItemOptions()}
        </div>`;
      // Add event listeners for GLE controls
      setTimeout(() => {
        const cbEnableGLE = document.getElementById('_cbEnableGLE');
        if (cbEnableGLE) {
          // Restore checkbox state from localStorage
          cbEnableGLE.checked = !!gleEnabled;
          cbEnableGLE.addEventListener('change', function () {
            // Save state to localStorage
            localStorage.setItem('wme-poi-shortcuts-gle-enabled', JSON.stringify(this.checked));
            if (this.checked) {
              // Enable GLE functionality
              if (GLE && typeof GLE.enable === 'function') {
                GLE.enable();
              }
            } else {
              // Disable GLE functionality completely
              if (GLE && typeof GLE.disable === 'function') {
                GLE.disable();
              }
              // Force map refresh to remove lingering highlights
              setTimeout(() => {
                if (typeof W !== 'undefined' && W.map && W.map.getOLMap()) {
                  const olMap = W.map.getOLMap();
                  if (olMap && typeof olMap.redraw === 'function') {
                    olMap.redraw();
                  }
                }
              }, 100);
            }
            // Update GLE enabled state
            if (GLE) {
              GLE.enabled = this.checked;
            }
          });
        }

        // Add event listener for Open Edit Address on RPP checkbox
        const cbOpenEditAddressRPP = document.getElementById('_cbOpenEditAddressRPP');
        if (cbOpenEditAddressRPP) {
          // Restore checkbox state from localStorage
          cbOpenEditAddressRPP.checked = !!openEditAddressOnRPP;
          cbOpenEditAddressRPP.addEventListener('change', function () {
            // Save state to localStorage
            openEditAddressOnRPP = this.checked;
            localStorage.setItem('wme-poi-shortcuts-open-edit-address-rpp', JSON.stringify(this.checked));
            Logger.info(`Open edit address on RPP setting ${this.checked ? 'enabled' : 'disabled'}`);
          });
        }
      }, 0);
    } catch (e) {
      console.error('Failed to register POI Shortcuts script tab:', e);
    }
  }

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
  Logger.info(`${scriptName} initialized.`);

  /******************************************Changelogs***********************************************************
  2025.12.27.01
  - Temporary fix for alerts not displaying properly.
  2025.11.25.02
        <strong>Charging Station Automation:</strong><br>
      • Automatically sets network, cost type, and payment methods<br>
      • Auto-selects network from dropdown (BYD, CG Motors, Tata, etc.)<br>
      • Sets cost to "Paid" for branded stations<br>
      • Auto-populates payment methods (App, Online, Debit, Other)<br>
      <br>
      <strong>Supported Nepal Charging Stations:</strong><br>
      BYD, CG Motors, MG Motors, Tata Motors, Hyundai Motors, NEA, ElectriVa Nepal, Yatri, thee Go, MAW Vriddhi, OmodaJaecoo<br>
  2025.11.23.01
 - minor bug fixes for thee Go charging stations
  2025.11.13.02
 - minor bug fixes for electriva charging stations
  2025.11.12.01
 - Added ElectriVa charging station brand button for Nepal with aliases, 24/7 hours.
  2025.09.24.02
 - Enhanced NOC Button for Nepal Gas Stations with WazeToastr alert:</b><br>
    • <b>Case 1:</b> Empty gas station → Sets "NOC" as primary name<br>
    • <b>Case 2:</b> "NOC" primary with aliases → Prioritizes English aliases over Nepali<br>
    • <b>Case 3:</b> Non-NOC primary → Adds "NOC" as alias<br>
    • Uses regex to detect English vs Nepali text for smart name swapping<br>
    • Improved error handling and logging
  2025.09.24.01
  - Fixed     * Case 2: "NOC" primary with aliases → Prioritizes English aliases over Nepali<br>
  2025.09.22.01
  -Enhanced NOC Button for Nepal Gas Stations:</b><br>
    * Case 1: Empty gas station → Sets "NOC" as primary name<br>
    * Case 2: "NOC" primary with aliases → Swaps primary with first alias<br>
    * Case 3: Non-NOC primary → Adds "NOC" as alias<br>
  - Fixed InvalidStateError when brand already exists<br>
  - Improved error handling and logging</br>
  2025.09.05.01
  - Minor bug fixes for NOC.
  2025.08.28.01
  - Now when adding or selecting the RPP, it will auto open the address field and will select the house number field automatically
  2025.08.27.02
  - Now when adding or selecting the RPP, it will auto open the address field.
  2025.08.27.01
  - Fixed major memory leaks causing WME slowdowns after prolonged panning:
    * Properly cleanup MutationObservers and event listeners on selection changes
    * Added debouncing to prevent excessive function calls during UI updates
    * Prevented infinite recursion with retry limits for injection functions
    * Tracked and cleaned up individual alias observers to prevent accumulation
    * Added proper cleanup on page unload and selection changes
    * Improved performance by reducing unnecessary DOM queries and event handler registrations
2025.08.23.01
- Bug fixes for swapping POI names.
2025.08.19.04
  - Enhanced "Convert OTHER to Residential" with professional code refactoring and improved reliability.
  - Added comprehensive JSDoc documentation and modular function structure for better maintainability.
  - Improved error handling, user feedback, and multiple fallback strategies for button clicking.
  - Now fully automates the conversion process including clicking the "Convert to residential" button.
  - Compatible with new WME v2.309 house number types for both Residential Point Places (RPP) and venues.
2025.08.19.03
  - Added new shortcut "Convert OTHER to Residential" that prepares OTHER type venues for residential conversion.
  - When conditions are met (venue is OTHER type, name matches pattern like building numbers with Cyrillic characters, no existing house numbers), 
    the function copies the primary name to house numbers. User then manually clicks WME's "Convert to residential" button.
  - Simplified functionality to let WME handle the actual conversion process (RPP, etc.).
2025.08.18.01
  - Fix for multiple name swapping buttons displayed when used with WME PIE.
  2025.08.17.02
  - Fix for swap button not appearing on first venue selection after page refresh.
  - Added initial venue selection check after WME ready event.
2025.08.17.01
  - Re-inject swap buttons so icon appears immediately.
  2025.08.16.03
  - Fix for bug where POI points were not being selected correctly after creation.
  2025.08.16.02
  - Fix for bug where alt names were not adding correctly for gas stations and charging stations button clicked.
  - Charging stations button for Nepal has been added.
  2025.08.16.01
  - Fix for bug where gas station failed to save when gas station button pressed.
2025.08.15.03
  - Added automatic hazard layer group and individual layer enabling for hazard shortcuts.
  - Added support for Sharp Curves.
  - Added support for Complex Junctions.
  - Added support for Multiple Lanes Merge.
2025.08.11.04
  - Added support for updating Pakistan Petroleum brands using buttons.
  - Minor bug fixes.
2025.08.11.03
  - Added support for updating Pakistan Petroleum brands using buttons.
  - Added button colours
2025.08.10.15
  - Enhanced swap names functionality with arrow-up buttons for all aliases
  - Improved button visibility with white icons and proper positioning before delete buttons
  - Added support for swapping primary name with any specific alias (not just first one)
2025.08.10.14
  - Added swap names functionality between primary and alias names using WME SDK
2025.08.10.011
  - Legacy shortcuts key support
  ******************************************************************************************************************/
})();
