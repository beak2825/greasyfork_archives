// ==UserScript==
// @name        WME Place Harmonizer
// @namespace   WazeUSA
// @version     2025.05.19.000
// @description Harmonizes, formats, and locks a selected place
// @author      WMEPH Development Group
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require     https://greasyfork.org/scripts/37486-wme-utils-hoursparser/code/WME%20Utils%20-%20HoursParser.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require     https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @license     GNU GPL v3
// @connect     greasyfork.org
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/28690/WME%20Place%20Harmonizer.user.js
// @updateURL https://update.greasyfork.org/scripts/28690/WME%20Place%20Harmonizer.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */
/* global _ */
/* global WazeWrap */
/* global LZString */
/* global HoursParser */
/* global I18n */
/* global google */
/* global turf */

/* eslint-disable max-classes-per-file */

(function main() {
    'use strict';

    // Script update info

    // BE SURE TO SET THIS TO NULL OR AN EMPTY STRING WHEN RELEASING A NEW UPDATE.
    const _SCRIPT_UPDATE_MESSAGE = '';
    const _CSS = `
    #edit-panel .venue-feature-editor {
        overflow: initial;
    }
    #sidebar .wmeph-pane {
        width: auto;
        padding: 8px !important;
    }
    #WMEPH_banner .wmeph-btn { 
        background-color: #fbfbfb;
        box-shadow: 0 2px 0 #aaa;
        border: solid 1px #bbb;
        font-weight:normal;
        margin-bottom: 2px;
        margin-right:4px
    }
    .wmeph-btn, .wmephwl-btn {
        height: 19px;
        font-family: "Boing", sans-serif;
    }
    .btn.wmeph-btn {
        padding: 0px 3px;
    }
    .btn.wmephwl-btn {
        padding: 0px 1px 0px 2px;
        height: 18px;
        box-shadow: 0 2px 0 #b3b3b3;
    }
    
    #WMEPH_banner .banner-row {
        padding:2px 4px;
        cursor: default;
    }
    #WMEPH_banner .banner-row.red {
        color:#b51212;
        background-color:#f0dcdc;
    }
    #WMEPH_banner .banner-row.blue {
        color:#3232e6;
        background-color:#dcdcf0;
    }
    #WMEPH_banner .banner-row.yellow {
        color:#584a04;
        background-color:#f0f0c2;
    }
    #WMEPH_banner .banner-row.gray {
        color:#3a3a3a;
        background-color:#eeeeee;
    }
    #WMEPH_banner .banner-row.orange {
        color:#754900;
        background-color:#ffd389
    }
    #WMEPH_banner .banner-row.lightgray {
        color:#3a3a3a;
        background-color: #f5f5f5;
    }
    #WMEPH_banner .banner-row .dupe {
        padding-left:8px;
    }
    #WMEPH_banner {
        background-color:#fff;
        color:black; font-size:14px;
        padding-top:8px;
        padding-bottom:8px;
        margin-left:4px;
        margin-right:4px;
        line-height:18px;
        margin-top:2px;
        border: solid 1px #8d8c8c;
        border-radius: 6px;
        margin-bottom: 4px;
    }
    #WMEPH_banner input[type=text] {
        font-size: 13px !important;
        height:22px !important;
        font-family: "Open Sans", Alef, helvetica, sans-serif !important;
    }
    #WMEPH_banner div:last-child {
        padding-bottom: 3px !important;
    }
    #wmeph-run-panel {
        padding-bottom: 6px;
        padding-top: 3px;
        width: 290;
        color: black;
        font-size: 15px;
        margin-right: auto;
        margin-left: 4px;
    }
    #WMEPH_tools div {
        padding-bottom: 2px !important;
    }
    .wmeph-fat-btn {
        padding-left:8px;
        padding-right:8px;
        padding-top:4px;
        margin-right:3px;
        display:inline-block;
        font-weight:normal;
        height:24px;
        font-family: "Boing", sans-serif;
    }
    .ui-autocomplete {
        max-height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
    } 
    .wmeph-hr {
        border-color: #ccc;
    }
    .wmeph-hr {
        border-color: #ccc;
    }
    
    @keyframes highlight {
        0% {
            background: #ffff99; 
        }
        100% {
            background: none;
        }
    }
    
    .highlight {
        animation: highlight 1.5s;
    }

    .google-logo {
        /*font-size: 16px*/
    }
    .google-logo.red{
        color: #ea4335
    }
    .google-logo.blue {
        color: #4285f4
    }
    .google-logo.orange {
        color: #fbbc05
    }
    .google-logo.green {
        color: #34a853
    }
    `;

    let MultiAction;
    let UpdateObject;
    let UpdateFeatureGeometry;
    let UpdateFeatureAddress;
    let OpeningHour;

    const SCRIPT_VERSION = GM_info.script.version.toString(); // pull version from header
    const SCRIPT_NAME = GM_info.script.name;
    const IS_BETA_VERSION = /Beta/i.test(SCRIPT_NAME); //  enables dev messages and unique DOM options if the script is called "... Beta"
    const BETA_VERSION_STR = IS_BETA_VERSION ? 'Beta' : ''; // strings to differentiate DOM elements between regular and beta script

    class Country {
        countryCode;
        countryName;
        categoryInfos;
        pnh;
        regions;
        /** @type {PnhEntry[]} */
        closedChains;

        /**
         * Creates an instance of Country.
         * @param {string} code Country code, e.g. USA, CAN
         * @param {string} name Country name, for display purposes
         * @param {PnhCategoryInfos} categoryInfos
         * @param {PnhEntry[]} pnh
         * @memberof Country
         */
        constructor(code, name, allSpreadsheetData, categoryColumnIndex, pnhColumnIndex, regions) {
            this.countryCode = code;
            this.countryName = name;
            this.categoryInfos = new PnhCategoryInfos();
            Pnh.processCategories(Pnh.processImportedDataColumn(allSpreadsheetData, categoryColumnIndex), this.categoryInfos);
            this.pnh = Pnh.processPnhSSRows(allSpreadsheetData, pnhColumnIndex, this);
            this.closedChains = this.pnh.filter(entry => entry.chainIsClosed);
            this.regions = regions;
        }
    }

    const PNH_DATA = {
        /** @type {Country} */
        USA: null,
        /** @type {Country} */
        CAN: null
    };

    const DEFAULT_HOURS_TEXT = 'Paste hours here';
    const MAX_CACHE_SIZE = 25000;
    const PROD_DOWNLOAD_URL = 'https://greasyfork.org/scripts/28690-wme-place-harmonizer/code/WME%20Place%20Harmonizer.user.js';
    const BETA_DOWNLOAD_URL = 'YUhSMGNITTZMeTluY21WaGMzbG1iM0pyTG05eVp5OXpZM0pwY0hSekx6STROamc1TFhkdFpTMXdiR0ZqWlMxb1lYSnRiMjVwZW1WeUxXSmxkR0V2WTI5a1pTOVhUVVVsTWpCUWJHRmpaU1V5TUVoaGNtMXZibWw2WlhJbE1qQkNaWFJoTG5WelpYSXVhbk09';

    let _resultsCache = {};
    let _initAlreadyRun = false; // This is used to skip a couple things if already run once.  This could probably be handled better...
    let _textEntryValues = null; // Store the values entered in text boxes so they can be re-added when the banner is reassembled.

    // Userlists
    let _wmephDevList;
    let _wmephBetaList;

    let _shortcutParse;
    let _modifKey = 'Alt+';

    // Whitelisting vars
    let _venueWhitelist;
    const WL_BUTTON_TEXT = 'WL';
    const WL_LOCAL_STORE_NAME = 'WMEPH-venueWhitelistNew';
    const WL_LOCAL_STORE_NAME_COMPRESSED = 'WMEPH-venueWhitelistCompressed';

    // Dupe check vars
    let _dupeLayer;
    let _dupeIDList = [];
    let _dupeHNRangeList;
    let _dupeHNRangeDistList;

    // Web search Window forming:
    let _searchResultsWindowSpecs = `"resizable=yes, top=${Math.round(window.screen.height * 0.1)}, left=${
        Math.round(window.screen.width * 0.3)}, width=${Math.round(window.screen.width * 0.7)}, height=${Math.round(window.screen.height * 0.8)}"`;
    const SEARCH_RESULTS_WINDOW_NAME = '"WMEPH Search Results"';
    let _wmephMousePosition;
    let _cloneMaster = null;

    // Banner Buttons objects
    let _buttonBanner2;
    let _servicesBanner;
    let _dupeBanner;

    let _disableHighlightTest = false; // Set to true to temporarily disable highlight checks immediately when venues change.

    const USER = {
        ref: null,
        rank: null,
        name: null,
        isBetaUser: false,
        isDevUser: false
    };
    const SETTING_IDS = {
        sfUrlWarning: 'SFURLWarning', // Warning message for first time using localized storefinder URL.
        gLinkWarning: 'GLinkWarning' // Warning message for first time using Google search to not to use the Google info itself.
    };
    const URLS = {
        forum: 'https://www.waze.com/discuss/t/178574',
        usaPnh: 'https://docs.google.com/spreadsheets/d/1-f-JTWY5UnBx-rFTa4qhyGMYdHBZWNirUTOgn222zMY/edit#gid=0',
        placesWiki: 'https://wazeopedia.waze.com/wiki/USA/Places',
        restAreaWiki: 'https://wazeopedia.waze.com/wiki/USA/Rest_areas#Adding_a_Place',
        uspsWiki: 'https://wazeopedia.waze.com/wiki/USA/Places/Post_office'
    };
    class Region {
        static #defaultNewChainRequestEntryIds = ['entry.925969794', 'entry.1970139752', 'entry.1749047694'];
        static #defaultApproveChainRequestEntryIds = ['entry.925969794', 'entry.50214576', 'entry.1749047694'];
        regionCode;
        #formId;
        #newChainRequestEntryIds;
        #approveChainRequestEntryIds;

        constructor(regionCode, formId, newChainRequestEntryIds, approveChainRequestEntryIds) {
            this.regionCode = regionCode;
            this.#formId = formId;
            this.#newChainRequestEntryIds = newChainRequestEntryIds ?? Region.#defaultNewChainRequestEntryIds;
            this.#approveChainRequestEntryIds = approveChainRequestEntryIds ?? Region.#defaultApproveChainRequestEntryIds;
        }

        #getFormUrl(entryIds, entryValues) {
            const entryValuesUrl = entryValues.map((value, idx) => `${entryIds[idx]}=${value}`).join('&');
            return `https://docs.google.com/forms/d/${this.#formId}/viewform?${entryValuesUrl}`;
        }

        getNewChainFormUrl(entryValues) {
            return this.#getFormUrl(this.#newChainRequestEntryIds, entryValues);
        }

        getApproveChainFormUrl(entryValues) {
            return this.#getFormUrl(this.#approveChainRequestEntryIds, entryValues);
        }
    }

    let _userLanguage;
    // lock levels are offset by one
    const LOCK_LEVEL_2 = 1;
    const LOCK_LEVEL_4 = 3;

    // An enum to help clarify flag severity levels
    const SEVERITY = {
        GREEN: 0,
        BLUE: 1,
        YELLOW: 2,
        RED: 3,
        // 4 isn't used anymore
        PINK: 5,
        // TODO: There is also 'lock' and 'lock1' severity. Add those here? Also investigate 'adLock' severity (is it still useful in WME???).
        ORANGE: 6
    };

    const CAT = {
        AIRPORT: 'AIRPORT',
        // ART_GALLERY: 'ART_GALLERY',
        // ARTS_AND_CRAFTS: 'ARTS_AND_CRAFTS',
        ATM: 'ATM',
        // BAKERY: 'BAKERY',
        BANK_FINANCIAL: 'BANK_FINANCIAL',
        BAR: 'BAR',
        // BEACH: 'BEACH',
        // BED_AND_BREAKFAST: 'BED_AND_BREAKFAST',
        // BOOKSTORE: 'BOOKSTORE',
        BRIDGE: 'BRIDGE',
        // BUS_STATION: 'BUS_STATION',
        // CAFE: 'CAFE',
        CAMPING_TRAILER_PARK: 'CAMPING_TRAILER_PARK',
        CANAL: 'CANAL',
        // CAR_DEALERSHIP: 'CAR_DEALERSHIP',
        CAR_RENTAL: 'CAR_RENTAL',
        // CAR_SERVICES: 'CAR_SERVICES',
        // CAR_WASH: 'CAR_WASH',
        // CASINO: 'CASINO',
        CHARGING_STATION: 'CHARGING_STATION',
        CEMETERY: 'CEMETERY',
        // CITY_HALL: 'CITY_HALL',
        // CLUB: 'CLUB',
        COLLEGE_UNIVERSITY: 'COLLEGE_UNIVERSITY',
        CONSTRUCTION_SITE: 'CONSTRUCTION_SITE',
        CONVENIENCE_STORE: 'CONVENIENCE_STORE',
        CONVENTIONS_EVENT_CENTER: 'CONVENTIONS_EVENT_CENTER',
        COTTAGE_CABIN: 'COTTAGE_CABIN',
        // COURTHOUSE: 'COURTHOUSE',
        CULTURE_AND_ENTERTAINEMENT: 'CULTURE_AND_ENTERTAINEMENT',
        // CURRENCY_EXCHANGE: 'CURRENCY_EXCHANGE',
        DAM: 'DAM',
        // DEPARTMENT_STORE: 'DEPARTMENT_STORE',
        DESSERT: 'DESSERT',
        DOCTOR_CLINIC: 'DOCTOR_CLINIC',
        // ELECTRONICS: 'ELECTRONICS',
        // EMBASSY_CONSULATE: 'EMBASSY_CONSULATE',
        // EMERGENCY_SHELTER: 'EMERGENCY_SHELTER',
        // FACTORY_INDUSTRIAL: 'FACTORY_INDUSTRIAL',
        FARM: 'FARM',
        // FASHION_AND_CLOTHING: 'FASHION_AND_CLOTHING',
        // FAST_FOOD: 'FAST_FOOD',
        FERRY_PIER: 'FERRY_PIER',
        FIRE_DEPARTMENT: 'FIRE_DEPARTMENT',
        // FLOWERS: 'FLOWERS',
        FOOD_AND_DRINK: 'FOOD_AND_DRINK',
        // FOOD_COURT: 'FOOD_COURT',
        FOREST_GROVE: 'FOREST_GROVE',
        // FURNITURE_HOME_STORE: 'FURNITURE_HOME_STORE',
        // GAME_CLUB: 'GAME_CLUB',
        // GARAGE_AUTOMOTIVE_SHOP: 'GARAGE_AUTOMOTIVE_SHOP',
        GAS_STATION: 'GAS_STATION',
        // GIFTS: 'GIFTS',
        GOLF_COURSE: 'GOLF_COURSE',
        // GOVERNMENT: 'GOVERNMENT',
        GYM_FITNESS: 'GYM_FITNESS',
        // HARDWARE_STORE: 'HARDWARE_STORE',
        HOSPITAL_MEDICAL_CARE: 'HOSPITAL_MEDICAL_CARE',
        HOSPITAL_URGENT_CARE: 'HOSPITAL_URGENT_CARE',
        // HOSTEL: 'HOSTEL',
        HOTEL: 'HOTEL',
        // ICE_CREAM: 'ICE_CREAM',
        // INFORMATION_POINT: 'INFORMATION_POINT',
        ISLAND: 'ISLAND',
        // JEWELRY: 'JEWELRY',
        JUNCTION_INTERCHANGE: 'JUNCTION_INTERCHANGE',
        // KINDERGARDEN: 'KINDERGARDEN',
        // LAUNDRY_DRY_CLEAN: 'LAUNDRY_DRY_CLEAN',
        // LIBRARY: 'LIBRARY',
        LODGING: 'LODGING',
        // MARKET: 'MARKET',
        // MILITARY: 'MILITARY',
        MOVIE_THEATER: 'MOVIE_THEATER',
        // MUSEUM: 'MUSEUM',
        // MUSIC_STORE: 'MUSIC_STORE',
        // MUSIC_VENUE: 'MUSIC_VENUE',
        NATURAL_FEATURES: 'NATURAL_FEATURES',
        OFFICES: 'OFFICES',
        // ORGANIZATION_OR_ASSOCIATION: 'ORGANIZATION_OR_ASSOCIATION',
        OTHER: 'OTHER',
        // OUTDOORS: 'OUTDOORS',
        PARK: 'PARK',
        PARKING_LOT: 'PARKING_LOT',
        PERSONAL_CARE: 'PERSONAL_CARE',
        PET_STORE_VETERINARIAN_SERVICES: 'PET_STORE_VETERINARIAN_SERVICES',
        // PERFORMING_ARTS_VENUE: 'PERFORMING_ARTS_VENUE',
        PHARMACY: 'PHARMACY',
        // PHOTOGRAPHY: 'PHOTOGRAPHY',
        PLAYGROUND: 'PLAYGROUND',
        // PLAZA: 'PLAZA',
        POLICE_STATION: 'POLICE_STATION',
        // POOL: 'POOL',
        POST_OFFICE: 'POST_OFFICE',
        // PRISON_CORRECTIONAL_FACILITY: 'PRISON_CORRECTIONAL_FACILITY',
        // PROFESSIONAL_AND_PUBLIC: 'PROFESSIONAL_AND_PUBLIC',
        // PROMENADE: 'PROMENADE',
        // RACING_TRACK: 'RACING_TRACK',
        RELIGIOUS_CENTER: 'RELIGIOUS_CENTER',
        RESIDENCE_HOME: 'RESIDENCE_HOME',
        REST_AREAS: 'REST_AREAS',
        RESTAURANT: 'RESTAURANT',
        RIVER_STREAM: 'RIVER_STREAM',
        SCENIC_LOOKOUT_VIEWPOINT: 'SCENIC_LOOKOUT_VIEWPOINT',
        SCHOOL: 'SCHOOL',
        SEA_LAKE_POOL: 'SEA_LAKE_POOL',
        SEAPORT_MARINA_HARBOR: 'SEAPORT_MARINA_HARBOR',
        SHOPPING_AND_SERVICES: 'SHOPPING_AND_SERVICES',
        SHOPPING_CENTER: 'SHOPPING_CENTER',
        // SKI_AREA: 'SKI_AREA',
        // SPORTING_GOODS: 'SPORTING_GOODS',
        SPORTS_COURT: 'SPORTS_COURT',
        STADIUM_ARENA: 'STADIUM_ARENA',
        SUBWAY_STATION: 'SUBWAY_STATION',
        SUPERMARKET_GROCERY: 'SUPERMARKET_GROCERY',
        SWAMP_MARSH: 'SWAMP_MARSH',
        // SWIMMING_POOL: 'SWIMMING_POOL',
        // TAXI_STATION: 'TAXI_STATION',
        // THEATER: 'THEATER',
        // THEME_PARK: 'THEME_PARK',
        // TELECOM: 'TELECOM',
        // TOURIST_ATTRACTION_HISTORIC_SITE: 'TOURIST_ATTRACTION_HISTORIC_SITE',
        // TOY_STORE: 'TOY_STORE',
        // TRAIN_STATION: 'TRAIN_STATION',
        TRANSPORTATION: 'TRANSPORTATION',
        // TRASH_AND_RECYCLING_FACILITIES: 'TRASH_AND_RECYCLING_FACILITIES',
        // TRAVEL_AGENCY: 'TRAVEL_AGENCY',
        TUNNEL: 'TUNNEL'
        // ZOO_AQUARIUM: 'ZOO_AQUARIUM',
    };

    let _catTransWaze2Lang; // pulls the category translations
    const EV_PAYMENT_METHOD = {
        APP: 'APP',
        CREDIT: 'CREDIT',
        DEBIT: 'DEBIT',
        MEMBERSHIP_CARD: 'MEMBERSHIP_CARD',
        ONLENE_PAYMENT: 'ONLINE_PAYMENT',
        PLUG_IN_AUTO_CHARGER: 'PLUG_IN_AUTO_CHARGE',
        OTHER: 'OTHER'
    };
    // Common payment types found at: https://wazeopedia.waze.com/wiki/USA/Places/EV_charging_station
    const COMMON_EV_PAYMENT_METHODS = {
        'Blink Charging': [
            EV_PAYMENT_METHOD.APP,
            EV_PAYMENT_METHOD.MEMBERSHIP_CARD,
            EV_PAYMENT_METHOD.PLUG_IN_AUTO_CHARGER,
            EV_PAYMENT_METHOD.OTHER
        ],
        ChargePoint: [
            EV_PAYMENT_METHOD.APP,
            EV_PAYMENT_METHOD.CREDIT,
            EV_PAYMENT_METHOD.DEBIT,
            EV_PAYMENT_METHOD.MEMBERSHIP_CARD
        ],
        'Electrify America': [
            EV_PAYMENT_METHOD.APP,
            EV_PAYMENT_METHOD.CREDIT,
            EV_PAYMENT_METHOD.DEBIT,
            EV_PAYMENT_METHOD.MEMBERSHIP_CARD,
            EV_PAYMENT_METHOD.PLUG_IN_AUTO_CHARGER
        ],
        EVgo: [
            EV_PAYMENT_METHOD.APP,
            EV_PAYMENT_METHOD.CREDIT,
            EV_PAYMENT_METHOD.DEBIT,
            EV_PAYMENT_METHOD.MEMBERSHIP_CARD,
            EV_PAYMENT_METHOD.PLUG_IN_AUTO_CHARGER
        ],
        SemaConnect: [
            EV_PAYMENT_METHOD.APP,
            EV_PAYMENT_METHOD.MEMBERSHIP_CARD,
            EV_PAYMENT_METHOD.OTHER
        ],
        Tesla: [
            EV_PAYMENT_METHOD.PLUG_IN_AUTO_CHARGER
        ]
    };
    const WME_SERVICES_ARRAY = ['VALLET_SERVICE', 'DRIVETHROUGH', 'WI_FI', 'RESTROOMS', 'CREDIT_CARDS', 'RESERVATIONS', 'OUTSIDE_SEATING',
        'AIR_CONDITIONING', 'PARKING_FOR_CUSTOMERS', 'DELIVERIES', 'TAKE_AWAY', 'CURBSIDE_PICKUP', 'WHEELCHAIR_ACCESSIBLE', 'DISABILITY_PARKING'];
    const COLLEGE_ABBREVIATIONS = ['USF', 'USFSP', 'UF', 'UCF', 'UA', 'UGA', 'FSU', 'UM', 'SCP', 'FAU', 'FIU'];
    // Change place.name to title case
    const TITLECASE_SETTINGS = {
        ignoreWords: 'an|and|as|at|by|for|from|hhgregg|in|into|of|on|or|the|to|with'.split('|'),
        // eslint-disable-next-line max-len
        capWords: '3M|AAA|AMC|AOL|AT&T|ATM|BBC|BLT|BMV|BMW|BP|CBS|CCS|CGI|CISCO|CJ|CNG|CNN|CVS|DHL|DKNY|DMV|DSW|EMS|ER|ESPN|FCU|FCUK|FDNY|GNC|H&M|HP|HSBC|IBM|IHOP|IKEA|IRS|JBL|JCPenney|KFC|LLC|MBNA|MCA|MCI|NBC|NYPD|PDQ|PNC|TCBY|TNT|TV|UPS|USA|USPS|VW|XYZ|ZZZ'.split('|'),
        specWords: 'd\'Bronx|iFix|ExtraMile|ChargePoint|EVgo|SemaConnect'.split('|')
    };
    const PRIMARY_CATS_TO_IGNORE_MISSING_PHONE_URL = [
        CAT.ISLAND,
        CAT.SEA_LAKE_POOL,
        CAT.RIVER_STREAM,
        CAT.CANAL,
        CAT.JUNCTION_INTERCHANGE,
        CAT.SCENIC_LOOKOUT_VIEWPOINT
    ];
    const PRIMARY_CATS_TO_FLAG_GREEN_MISSING_PHONE_URL = [
        CAT.BRIDGE,
        CAT.FOREST_GROVE,
        CAT.DAM,
        CAT.TUNNEL,
        CAT.CEMETERY
    ];
    const ANY_CATS_TO_FLAG_GREEN_MISSING_PHONE_URL = [CAT.REST_AREAS];
    const REGIONS_THAT_WANT_PLA_PHONE_URL = ['SER'];
    const CHAIN_APPROVAL_PRIMARY_CATS_TO_IGNORE = [
        CAT.POST_OFFICE,
        CAT.BRIDGE,
        CAT.FOREST_GROVE,
        CAT.DAM,
        CAT.TUNNEL,
        CAT.CEMETERY,
        CAT.ISLAND,
        CAT.SEA_LAKE_POOL,
        CAT.RIVER_STREAM,
        CAT.CANAL,
        CAT.JUNCTION_INTERCHANGE,
        CAT.SCENIC_LOOKOUT_VIEWPOINT
    ];
    const CATS_THAT_DONT_NEED_NAMES = [
        CAT.SEA_LAKE_POOL
    ];
    const BAD_URL = 'badURL';
    const BAD_PHONE = 'badPhone';
    // Feeds that are not in use and it's safe to delete the place. Use regex.
    const FEEDS_TO_SKIP = [/^google$/i, /^yext\d?/i, /^wazeads$/i, /^parkme$/i, /^navads(na)?$/i];
    // Do not highlight places if any of these are the primary category.
    const CATS_TO_IGNORE_CUSTOMER_PARKING_HIGHLIGHT = [
        CAT.BRIDGE,
        CAT.CANAL,
        CAT.CHARGING_STATION,
        CAT.CONSTRUCTION_SITE,
        CAT.ISLAND,
        CAT.JUNCTION_INTERCHANGE,
        CAT.NATURAL_FEATURES,
        CAT.PARKING_LOT,
        CAT.RESIDENCE_HOME,
        CAT.RIVER_STREAM,
        CAT.SEA_LAKE_POOL,
        CAT.SWAMP_MARSH,
        CAT.TUNNEL
    ];
    const dec = s => atob(atob(s));

    // Split out state-based data
    let _psStateIx;
    let _psState2LetterIx;
    let _psRegionIx;
    let _psGoogleFormStateIx;
    let _psDefaultLockLevelIx;
    // var _ps_requirePhone_ix;
    // var _ps_requireURL_ix;
    let _psAreaCodeIx;
    let _stateDataTemp;
    let _areaCodeList = '800,822,833,844,855,866,877,888'; //  include toll free non-geographic area codes

    let _layer;

    const UPDATED_FIELDS = {
        name: {
            updated: false,
            selector: '#venue-edit-general wz-text-input[name="name"]',
            shadowSelector: 'input',
            tab: 'general'
        },
        aliases: {
            updated: false,
            selector: '#venue-edit-general > div.aliases.form-group > wz-list',
            tab: 'general'
        },
        address: {
            updated: false,
            selector: '#venue-edit-general div.address-edit-view div.full-address-container',
            tab: 'general'
        },
        categories: {
            updated: false,
            selector: '#venue-edit-general > div.categories-control.form-group > wz-card',
            shadowSelector: 'div',
            tab: 'general'
        },
        description: {
            updated: false,
            selector: '#venue-edit-general wz-textarea[name="description"]',
            shadowSelector: 'textarea',
            tab: 'general'
        },
        lockRank: {
            updated: false,
            selector: '#venue-edit-general > div.lock-edit',
            tab: 'general'
        },
        externalProvider: {
            updated: false,
            selector: '#venue-edit-general > div.external-providers-control.form-group > wz-list',
            tab: 'general'
        },
        brand: { updated: false, selector: '.venue .brand .select2-container', tab: 'general' },
        url: {
            updated: false,
            selector: '#venue-url',
            shadowSelector: 'input',
            tab: 'more-info'
        },
        phone: {
            updated: false,
            selector: '#venue-phone',
            shadowSelector: 'input',
            tab: 'more-info'
        },
        openingHours: {
            updated: false,
            selector: '#venue-edit-more-info div.opening-hours.form-group > wz-list',
            tab: 'more-info'
        },
        cost: {
            updated: false,
            selector: '#venue-edit-more-info wz-select[name="costType"]',
            shadowSelector: 'div.select-box',
            tab: 'more-info'
        },
        canExit: { updated: false, selector: '.venue label[for="can-exit-checkbox"]', tab: 'more-info' },
        hasTBR: { updated: false, selector: '.venue label[for="has-tbr"]', tab: 'more-info' },
        lotType: { updated: false, selector: '#venue-edit-more-info > form > div:nth-child(1) > wz-radio-group', tab: 'more-info' },
        parkingSpots: {
            updated: false,
            selector: '#venue-edit-more-info wz-select[name="estimatedNumberOfSpots"]',
            shadowSelector: '#select-wrapper > div',
            tab: 'more-info'
        },
        lotElevation: { updated: false, selector: '.venue .lot-checkbox', tab: 'more-info' },
        evNetwork: { updated: false, selector: '', tab: 'general' },
        evPaymentMethods: {
            updated: false,
            selector: '#venue-edit-general > div.charging-station-controls div.wz-multiselect > wz-card',
            shadowSelector: 'div',
            tab: 'general'
        },
        evCostType: {
            updated: false,
            selector: '#venue-edit-general > div.charging-station-controls > wz-select',
            shadowSelector: '#select-wrapper > div > div',
            tab: 'general'
        },

        getFieldProperties() {
            return Object.keys(this)
                .filter(key => this[key].hasOwnProperty('updated'))
                .map(key => this[key]);
        },
        getUpdatedTabNames() {
            return uniq(this.getFieldProperties()
                .filter(prop => prop.updated)
                .map(prop => prop.tab));
        },
        // checkAddedNode(addedNode) {
        //     this.getFieldProperties()
        //         .filter(prop => prop.updated && addedNode.querySelector(prop.selector))
        //         .forEach(prop => {
        //             $(prop.selector).css({ 'background-color': '#dfd' });
        //             $(`a[href="#venue-edit-${prop.tab}"]`).css({ 'background-color': '#dfd' });
        //         });
        // },
        reset() {
            this.clearEditPanelHighlights();
            this.getFieldProperties().forEach(prop => {
                prop.updated = false;
            });
        },
        init() {
            ['VALLET_SERVICE', 'DRIVETHROUGH', 'WI_FI', 'RESTROOMS', 'CREDIT_CARDS', 'RESERVATIONS', 'OUTSIDE_SEATING', 'AIR_CONDITIONING',
                'PARKING_FOR_CUSTOMERS', 'DELIVERIES', 'TAKE_AWAY', 'WHEELCHAIR_ACCESSIBLE', 'DISABILITY_PARKING', 'CURBSIDE_PICKUP', 'CARPOOL_PARKING',
                'EV_CHARGING_STATION', 'CAR_WASH', 'SECURITY', 'AIRPORT_SHUTTLE']
                .forEach(service => {
                    const propName = `services_${service}`;
                    this[propName] = { updated: false, selector: `.venue label[for="service-checkbox-${service}"]`, tab: 'more-info' };
                });

            // 5/24/2019 (mapomatic) This observer doesn't seem to work anymore.  I've added the updateEditPanelHighlights
            // function that can be called after harmonizePlaceGo runs.

            // const observer = new MutationObserver(mutations => {
            //     mutations.forEach(mutation => {
            //         // Mutation is a NodeList and doesn't support forEach like an array
            //         for (let i = 0; i < mutation.addedNodes.length; i++) {
            //             const addedNode = mutation.addedNodes[i];
            //             // Only fire up if it's a node
            //             if (addedNode.nodeType === Node.ELEMENT_NODE) {
            //                 _UPDATED_FIELDS.checkAddedNode(addedNode);
            //             }
            //         }
            //     });
            // });
            // observer.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });

            W.selectionManager.events.register('selectionchanged', null, () => errorHandler(() => this.reset()));
        },
        getTabElement(tabName) {
            let tabText;
            if (tabName === 'more-info') {
                tabText = 'More info';
            } else if (tabName === 'general') {
                tabText = 'General';
            } else {
                return null;
            }
            const tabElements = document.querySelector('#edit-panel div.venue-edit-section > wz-tabs')?.shadowRoot?.querySelectorAll('.wz-tab-label');
            if (tabElements) {
                return [...tabElements].filter(elem => elem.textContent === tabText)[0];
            }
            return null;
        },
        clearEditPanelHighlights() {
            this.getFieldProperties().filter(prop => prop.updated).forEach(prop => {
                if (prop.shadowSelector) {
                    $(document.querySelector(prop.selector)?.shadowRoot?.querySelector(prop.shadowSelector)).css('background-color', '');
                } else {
                    $(prop.selector).css({ 'background-color': '' });
                }
                $(this.getTabElement(prop.tab)).css({ 'background-color': '' });
            });
        },
        // Highlight fields in the editor panel that have been updated by WMEPH.
        updateEditPanelHighlights() {
            // This setTimeout is necessary to get some highlights to work.
            setTimeout(() => {
                this.getFieldProperties().filter(prop => prop.updated).forEach(prop => {
                    if (prop.shadowSelector) {
                        $(document.querySelector(prop.selector)?.shadowRoot?.querySelector(prop.shadowSelector)).css('background-color', '#dfd');
                    } else {
                        $(prop.selector).css({ 'background-color': '#dfd' });
                    }
                    $(this.getTabElement(prop.tab)).css({ 'background-color': '#dfd' });
                });
            }, 100);
        },
        checkNewAttributes(newAttributes, venue) {
            const checkAttribute = name => {
                if (newAttributes.hasOwnProperty(name)
                    && JSON.stringify(venue.attributes[name]) !== JSON.stringify(newAttributes[name])) {
                    UPDATED_FIELDS[name].updated = true;
                }
            };
            checkAttribute('categories');
            checkAttribute('name');
            checkAttribute('openingHours');
            checkAttribute('description');
            checkAttribute('aliases');
            checkAttribute('url');
            checkAttribute('phone');
            checkAttribute('lockRank');
        }
    };

    class PnhCategoryInfos {
        #categoriesById = {};
        #categoriesByName = {};

        add(categoryInfo) {
            this.#categoriesById[categoryInfo.id] = categoryInfo;
            this.#categoriesByName[categoryInfo.name.toUpperCase()] = categoryInfo;
        }

        getById(id) {
            return this.#categoriesById[id];
        }

        getByName(name) {
            return this.#categoriesByName[name.toUpperCase()];
        }

        toArray() {
            return Object.values(this.#categoriesById);
        }
    }

    class PnhEntry {
        /** @type {string} */
        order;

        /** @type {string */
        name;

        /** @type {string[]} */
        aliases;

        /** @type {string} */
        primaryCategory;

        /** @type {string[]} */
        altCategories;

        /** @type {string} */
        description;

        /** @type {string} */
        url;

        /** @type {string} */
        notes;

        /** @type {string[]} */
        regions;

        /**
         * If this is true, the PNH entry should be ignored.
         * @type {boolean}
         * */
        disabled;

        /** @type {Symbol} */
        forceCategoryMatching;

        flagsToAdd = {};

        flagsToRemove = {};

        /** @type {string[]} */
        servicesToAdd = [];

        /** @type {string[]} */
        servicesToRemove = [];

        /** @type {string} */
        forceBrand;

        /** @type {RegExp} */
        localUrlCheckRegEx;

        /** @type {RegExp} */
        localizationRegEx;

        /** @type {string} */
        recommendedPhone;

        /**
         * Prevent name change
         * @type {boolean}
         */
        keepName = false;

        /** @type {string} */
        optionalAlias;

        /** @type {boolean} */
        chainIsClosed;

        /**
         * Value is -1 if no value has been set in PNH.
         * @type {number}
         */
        brandParentLevel = -1;

        /** @type {boolean} */
        strMatchAny;

        /** @type {string[]} */
        spaceMatchList;

        /** @type {boolean} */
        pharmhours;

        /** @type {boolean} */
        notABank;

        /** @type {boolean} */
        optionCat2;

        /** @type {boolean} */
        optionName2;

        /** @type {boolean} */
        altName2Desc;

        /** @type {boolean} */
        subFuel;

        /** @type {RegExp} */
        regexNameMatch;

        /** @type {number} */
        lockAt;

        /** @type {boolean} */
        noUpdateAlias;

        /** @type {boolean} */
        betaEnable;

        /** @type {string[]} */
        searchnameword;

        /** @type {string[]} */
        searchNameList;

        /** @type {boolean} */
        hasSpecialCases = false;

        /**
         * true if the PNH entry is invalid and should be skipped
         * @type {boolean}
         */
        invalid = false;

        /**
         *
         * @param {string[]} columnHeaders
         * @param {string} rowString A pipe-separated string with all of the PNH entry's data
         * @param {Country} country
         */
        constructor(columnHeaders, rowString, country) {
            const parseResult = this.#parseSpreadsheetRow(columnHeaders, rowString, country);
            if (!this.invalid && (!this.disabled || this.betaEnable)) {
                this.#buildSearchNameList(parseResult);
            }
        }

        /**
         * Makes a string uppercase, then removes AND (anywhere), THE (only at the beginning),
         * and any non-alphanumeric characters.
         * @param {string} str
         */
        static #tighten(str) {
            return str.toUpperCase().replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '');
        }

        /**
         * Makes a string uppercase and removes any non-alphanumeric characters except for commas.
         * @param {string} str
         */
        static #stripNonAlphaKeepCommas(str) {
            return str.toUpperCase().replace(/[^A-Z0-9,]/g, '');
        }

        /**
         *
         * @param {string[]} columnHeaders
         * @param {string} rowString
         * @param {Country} country
         * @returns
         */
        #parseSpreadsheetRow(columnHeaders, rowString, country) {
            /**  Contains values needed for immediate processing, but not to be stored in the PnhEntry */
            const result = {
                searchnamebase: null,
                searchnamemid: null,
                searchnameend: null,
                skipAltNameMatch: null,
                warningMessages: []
            };

            try {
                const columnValues = rowString.split('|');

                // Do any preprocessing here:
                const disabled = columnValues[columnHeaders.indexOf(Pnh.SSHeader.disable)].trim();
                if (disabled === '1') {
                    // If the row is disabled, no need to process the rest of it.
                    this.disabled = true;
                    return result;
                }

                // Step through columns and process the row values.
                columnHeaders.forEach((header, i) => {
                    try {
                        if (Pnh.COLUMNS_TO_IGNORE.includes(header)) return;

                        // If an invalid value is found, don't bother parsing the rest of the row data.
                        if (!this.invalid) {
                            let value = columnValues[i].trim();
                            if (!value.length) {
                                value = undefined;
                            } else if (header === Pnh.SSHeader.aliases) {
                                // TODO: Are these two checks really needed?
                                if (value.startsWith('(')) {
                                    value = undefined; // ignore aliases if the cell starts with paren
                                } else {
                                    value = value.replace(/,[^A-za-z0-9]*/g, ','); // tighten up commas if more than one alias.
                                }
                            }

                            switch (header) {
                                case Pnh.SSHeader.order:
                                case Pnh.SSHeader.description:
                                case Pnh.SSHeader.notes:
                                case Pnh.SSHeader.displaynote:
                                case Pnh.SSHeader.sfurl:
                                case Pnh.SSHeader.sfurllocal:
                                    header = header.substring(3);
                                    this[header] = value;
                                    break;
                                case Pnh.SSHeader.url:
                                    if (value) this.url = normalizeURL(value);
                                    break;
                                case Pnh.SSHeader.searchnamebase:
                                    result.searchnamebase = value;
                                    break;
                                case Pnh.SSHeader.searchnamemid:
                                    result.searchnamemid = value;
                                    break;
                                case Pnh.SSHeader.searchnameend:
                                    result.searchnameend = value;
                                    break;
                                case Pnh.SSHeader.searchnameword:
                                    this.searchnameword = value?.toUpperCase().replace(/, /g, ',').split(',');
                                    break;
                                case Pnh.SSHeader.name:
                                    if (value?.toUpperCase() !== 'PLEASE REUSE') {
                                        this.name = value;
                                    } else {
                                        // No need to post warning here. Just skip it.
                                        this.invalid = true;
                                    }
                                    break;
                                case Pnh.SSHeader.aliases:
                                    this.aliases = value?.split(',').map(v => v.trim()) || [];
                                    break;
                                case Pnh.SSHeader.category1:
                                    if (value) {
                                        this.primaryCategory = country.categoryInfos.getByName(value)?.id;
                                        if (typeof this.primaryCategory === 'undefined') {
                                            result.warningMessages.push(`Unrecognized primary category value: ${value}`);
                                        }
                                    } else {
                                        result.warningMessages.push('No primary category assigned. PNH entry will be ignored!');
                                        this.invalid = true;
                                    }
                                    break;
                                case Pnh.SSHeader.category2:
                                    this.altCategories = value?.split(',').map(v => v.trim()).map(catName => {
                                        const cat = country.categoryInfos.getByName(catName)?.id;
                                        if (!cat) {
                                            result.warningMessages.push(`Unrecognized alternate category: ${catName}`);
                                        }
                                        return cat;
                                    }).filter(cat => typeof cat === 'string');
                                    break;
                                case Pnh.SSHeader.region:
                                    if (value) {
                                        this.regions = value.toUpperCase().split(',').map(v => v.trim());
                                        // TODO: Check for valid regions.
                                    } else {
                                        // If no regions, ignore it.
                                        this.invalid = true;
                                        result.warningMessages.push('No regions specified. PNH entry will be ignored!');
                                    }
                                    break;
                                case Pnh.SSHeader.disable:
                                    // Handled the '1' case earlier in preprocessing
                                    if (value === 'altName') {
                                        result.skipAltNameMatch = true;
                                    } else if (value) {
                                        result.warningMessages.push(`Unrecognized value in ${Pnh.SSHeader.disable} column: ${value}`);
                                    }
                                    return;
                                case Pnh.SSHeader.forcecat:
                                    if (!value || value === '0') {
                                        this.forceCategoryMatching = Pnh.ForceCategoryMatchingType.NONE;
                                    } else if (value === '1') {
                                        this.forceCategoryMatching = Pnh.ForceCategoryMatchingType.PRIMARY;
                                    } else if (value === '2') {
                                        this.forceCategoryMatching = Pnh.ForceCategoryMatchingType.ANY;
                                    } else {
                                        result.warningMessages.push(`Unrecognized value in ${Pnh.SSHeader.forcecat} column: ${value}`);
                                    }
                                    break;
                                case Pnh.SSHeader.speccase:
                                    if (value) {
                                        this.hasSpecialCases = true;
                                        value = value.split(',').map(v => v.trim());
                                        /* eslint-disable no-cond-assign */
                                        value.forEach(specialCase => {
                                            let match;
                                            if (match = specialCase.match(/^buttOn_(.*)/i)) {
                                                const [, scFlag] = match;
                                                switch (scFlag) {
                                                    case 'addCat2':
                                                        // flag = new Flag.AddCat2();
                                                        break;
                                                    case 'addPharm':
                                                    case 'addSuper':
                                                    case 'appendAMPM':
                                                    case 'addATM':
                                                    case 'addConvStore':
                                                        this.flagsToAdd[scFlag] = true;
                                                        break;
                                                    default:
                                                        result.warningMessages.push(`Unrecognized ph_specCase value: ${specialCase}`);
                                                }
                                            } else if (match = specialCase.match(/^buttOff_(.+)/i)) {
                                                const [, scFlag] = match;
                                                switch (scFlag) {
                                                    case 'addConvStore':
                                                        this.flagsToRemove[scFlag] = true;
                                                        break;
                                                    default:
                                                        result.warningMessages.push(`Unrecognized ph_specCase value: ${specialCase}`);
                                                }
                                                // } else if (match = specCase.match(/^messOn_(.+)/i)) {
                                                //    [, scFlag] = match;
                                                //    _buttonBanner[scFlag].active = true;
                                                // } else if (match = specCase.match(/^messOff_(.+)/i)) {
                                                //    [, scFlag] = match;
                                                //    _buttonBanner[scFlag].active = false;
                                            } else if (match = specialCase.match(/^psOn_(.+)/i)) {
                                                const [, scFlag] = match;
                                                // TODO: Add check for valid services.
                                                this.servicesToAdd.push(scFlag);
                                            } else if (match = specialCase.match(/^psOff_(.+)/i)) {
                                                const [, scFlag] = match;
                                                // TODO: Add check for valid services.
                                                this.servicesToRemove.push(scFlag);
                                            } else if (match = specialCase.match(/forceBrand<>([^,<]+)/i)) {
                                                // If brand is going to be forced, use that.  Otherwise, use existing brand.
                                                [, this.forceBrand] = match;
                                            } else if (match = specialCase.match(/^localURL_(.+)/i)) {
                                                // parseout localURL data if exists (meaning place can have a URL distinct from the chain URL
                                                [, this.localURLcheck] = new RegExp(match, 'i');
                                            } else if (match = specialCase.match(/^checkLocalization<>(.+)/i)) {
                                                const [, localizationString] = match;
                                                this.localizationRegEx = new RegExp(localizationString, 'g');
                                            } else if (match = specialCase.match(/phone<>(.*?)<>/)) {
                                                [, this.recommendedPhone] = match;
                                            } else if (/keepName/g.test(specialCase)) {
                                                this.keepName = true;
                                            } else if (match = specialCase.match(/^optionAltName<>(.+)/i)) {
                                                [, this.optionalAlias] = match;
                                            } else if (/^closed$/i.test(specialCase)) {
                                                this.chainIsClosed = true;
                                            } else if (match = specialCase.match(/^brandParent(\d+)/)) {
                                                try {
                                                    this.brandParentLevel = parseInt(match[1], 10);
                                                } catch {
                                                    result.warningMessages.push(`Invalid forceBrand value: ${specialCase}`);
                                                }
                                            } else if (/^strMatchAny$/i.test(specialCase)) {
                                                this.strMatchAny = true;
                                            } else if (/^pharmhours$/i.test(specialCase)) {
                                                this.pharmhours = true;
                                            } else if (/^notABank$/i.test(specialCase)) {
                                                this.notABank = true;
                                            } else if (/^optionCat2$/i.test(specialCase)) {
                                                this.optionCat2 = true;
                                            } else if (/^optionName2$/i.test(specialCase)) {
                                                this.optionName2 = true;
                                            } else if (/^altName2Desc$/i.test(specialCase)) {
                                                this.altName2Desc = true;
                                            } else if (/^subFuel$/i.test(specialCase)) {
                                                this.subFuel = true;
                                            } else if (match = specialCase.match(/^regexNameMatch<>(.+)<>/i)) {
                                                this.regexNameMatch = new RegExp(match[1].replace(/\\/, '\\').replace(/<or>/g, '|'), 'i');
                                            } else if (match = specialCase.match(/^lockAt(\d)$/i)) {
                                                try {
                                                    this.lockAt = parseInt(match[1], 10);
                                                    if (this.lockAt < 1 || this.lockAt > 6) {
                                                        throw new Error();
                                                    }
                                                } catch {
                                                    result.warningMessages.push(`Invalid ph_speccase lockAt value (must be between 1 and 6): ${specialCase}`);
                                                }
                                            } else if (/^noUpdateAlias$/i.test(specialCase)) {
                                                this.noUpdateAlias = true;
                                            } else if (/^betaEnable$/i.test(specialCase)) {
                                                this.betaEnable = true;
                                            } else {
                                                result.warningMessages.push(`Unrecognized ph_speccase value: ${specialCase}`);
                                            }
                                        });
                                        /* eslint-enable no-cond-assign */
                                    }
                                    break;
                                case '': // Ignore this
                                    break;
                                default:
                                        // Ignore unrecognized headers here.
                            }
                        }
                    } catch (ex) {
                        result.warningMessages.push(`An unexpected error occurred while processing column: ${header}. PNH entry will be ignored.`);
                    }
                }); // END ROW PROCESSING

                // Do any post-processing of row values here:
                if (this.strMatchAny || this.primaryCategory === CAT.HOTEL) {
                    // NOTE: the replace functions here are not the same as the #tighten function, so don't use that.
                    this.spaceMatchList = [this.name.toUpperCase().replace(/ AND /g, ' ').replace(/^THE /g, '').replace(/[^A-Z0-9 ]/g, ' ').replace(/ {2,}/g, ' ')];
                    if (this.searchnameword) {
                        this.spaceMatchList.push(...this.searchnameword);
                    }
                }
            } catch (ex) {
                result.warningMessages.push(`An unexpected error occurred while parsing. PNH entry will be ignored! :\n${ex.toString()}`);
                this.disabled = true;
            }

            if (result.warningMessages.length) {
                console.warn(`WMEPH ${country.countryName}:`, `PNH Order # ${this.order} parsing issues:\n- ${result.warningMessages.join('\n- ')}`);
            }
            return result;
        }

        #buildSearchNameList(parseResult) {
            let newNameList = [PnhEntry.#tighten(this.name)];

            if (!parseResult.skipAltNameMatch) {
                // Add any aliases
                newNameList = newNameList.concat(this.aliases.map(alias => PnhEntry.#tighten(alias)));
            }

            // The following code sets up alternate search names as outlined in the PNH dataset.
            // Formula, with P = PNH primary; A1, A2 = PNH aliases; B1, B2 = base terms; M1, M2 = mid terms; E1, E2 = end terms
            // Search list will build: P, A, B, PM, AM, BM, PE, AE, BE, PME, AME, BME.
            // Multiple M terms are applied singly and in pairs (B1M2M1E2).  Multiple B and E terms are applied singly (e.g B1B2M1 not used).
            // Any doubles like B1E2=P are purged at the end to eliminate redundancy.
            if (!isNullOrWhitespace(parseResult.searchnamebase)) { // If base terms exist, otherwise only the primary name is matched
                newNameList = newNameList.concat(PnhEntry.#stripNonAlphaKeepCommas(parseResult.searchnamebase).split(','));

                if (!isNullOrWhitespace(parseResult.searchnamemid)) {
                    let pnhSearchNameMid = PnhEntry.#stripNonAlphaKeepCommas(parseResult.searchnamemid).split(',');
                    if (pnhSearchNameMid.length > 1) { // if there are more than one mid terms, it adds a permutation of the first 2
                        pnhSearchNameMid = pnhSearchNameMid
                            .concat([pnhSearchNameMid[0] + pnhSearchNameMid[1], pnhSearchNameMid[1] + pnhSearchNameMid[0]]);
                    }
                    const midLen = pnhSearchNameMid.length;
                    // extend the list by adding Mid terms onto the SearchNameBase names
                    for (let extix = 1, len = newNameList.length; extix < len; extix++) {
                        for (let midix = 0; midix < midLen; midix++) {
                            newNameList.push(newNameList[extix] + pnhSearchNameMid[midix]);
                        }
                    }
                }

                if (!isNullOrWhitespace(parseResult.searchnameend)) {
                    const pnhSearchNameEnd = PnhEntry.#stripNonAlphaKeepCommas(parseResult.searchnameend).split(',');
                    const endLen = pnhSearchNameEnd.length;
                    // extend the list by adding End terms onto all the SearchNameBase & Base+Mid names
                    for (let extix = 1, len = newNameList.length; extix < len; extix++) {
                        for (let endix = 0; endix < endLen; endix++) {
                            newNameList.push(newNameList[extix] + pnhSearchNameEnd[endix]);
                        }
                    }
                }
            }

            // Clear out any empty entries
            newNameList = newNameList.filter(name => name.length > 1);

            // Next, add extensions to the search names based on the WME place category
            const categoryInfo = this.primaryCategory;
            const appendWords = [];
            if (categoryInfo) {
                if (categoryInfo.id === CAT.HOTEL) {
                    appendWords.push('HOTEL');
                } else if (categoryInfo.id === CAT.BANK_FINANCIAL && !this.notABank) {
                    appendWords.push('BANK', 'ATM');
                } else if (categoryInfo.id === CAT.SUPERMARKET_GROCERY) {
                    appendWords.push('SUPERMARKET');
                } else if (categoryInfo.id === CAT.GYM_FITNESS) {
                    appendWords.push('GYM');
                } else if (categoryInfo.id === CAT.GAS_STATION) {
                    appendWords.push('GAS', 'GASOLINE', 'FUEL', 'STATION', 'GASSTATION');
                } else if (categoryInfo.id === CAT.CAR_RENTAL) {
                    appendWords.push('RENTAL', 'RENTACAR', 'CARRENTAL', 'RENTALCAR');
                }
                appendWords.forEach(word => { newNameList = newNameList.concat(newNameList.map(name => name + word)); });
            }

            // Add entries for word/spelling variations
            Pnh.WORD_VARIATIONS.forEach(variationsList => addSpellingVariants(newNameList, variationsList));

            this.searchNameList = uniq(newNameList);
        }

        /**
         *  Function that checks current place against the Harmonization Data.  Returns place data or "NoMatch"
         * @param {string} name
         * @param {string} state2L
         * @param {string} region3L
         * @param {string} country
         * @param {string[]} categories
         * @param {venue} venue
         * @returns
         */
        getMatchInfo(name, state2L, region3L, country, categories, venue, venueNameSpace) {
            const matchInfo = {
                isMatch: false,
                allowMultiMatch: true, // TODO: This can probably be removed
                matchOutOfRegion: false
            };
            let nameMatch = false;

            // Name Matching
            if (this.regexNameMatch) {
                nameMatch = this.regexNameMatch.test(venue.attributes.name);
            } else if (this.strMatchAny || this.primaryCategory === CAT.HOTEL) {
                // Match any part of WME name with either the PNH name or any spaced names
                matchInfo.allowMultiMatch = true; // TODO: This can probably be removed

                for (let nmix = 0; nmix < this.spaceMatchList.length; nmix++) {
                    if (venueNameSpace.includes(` ${this.spaceMatchList[nmix]} `)) {
                        nameMatch = true;
                        break;
                    }
                }
            } else {
                // Split all possible search names for the current PNH entry
                const { searchNameList } = this;

                // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB )
                const venueNameNoNum = name.replace(/[^A-Z]/g, '');

                /*
                 * I could not find strMatchStart or strMatchEnd in the PNH spreadsheet. Assuming these
                 * are no longer needed.
                 */
                // if (specCases.includes('strMatchStart')) {
                //     //  Match the beginning part of WME name with any search term
                //     for (let nmix = 0; nmix < searchNameList.length; nmix++) {
                //         if (name.startsWith(searchNameList[nmix]) || venueNameNoNum.startsWith(searchNameList[nmix])) {
                //             PNHStringMatch = true;
                //         }
                //     }
                // } else if (specCases.includes('strMatchEnd')) {
                //     //  Match the end part of WME name with any search term
                //     for (let nmix = 0; nmix < searchNameList.length; nmix++) {
                //         if (name.endsWith(searchNameList[nmix]) || venueNameNoNum.endsWith(searchNameList[nmix])) {
                //             PNHStringMatch = true;
                //         }
                //     }
                /* } else */ if (searchNameList.includes(name) || searchNameList.includes(venueNameNoNum)) {
                    // full match of any term only
                    nameMatch = true;
                }
            }

            // if a match was found:
            if (nameMatch) { // Compare WME place name to PNH search name list
                logDev(`Matched PNH Order No.: ${this.order}`);

                const PNHPriCat = this.primaryCategory; // Primary category of PNH data
                let PNHForceCat = this.forceCategoryMatching; // Primary category of PNH data

                // Gas stations only harmonized if the WME place category is already gas station (prevents Costco Gas becoming Costco Store)
                if (categories[0] === CAT.GAS_STATION || PNHPriCat === CAT.GAS_STATION) {
                    PNHForceCat = Pnh.ForceCategoryMatchingType.PRIMARY;
                }

                // Name and primary category match
                matchInfo.isMatch = (PNHForceCat === Pnh.ForceCategoryMatchingType.PRIMARY && categories.indexOf(PNHPriCat) === 0)
                    // Name and any category match
                    || (PNHForceCat === Pnh.ForceCategoryMatchingType.ANY && categories.includes(PNHPriCat))
                    // Name only match
                    || (PNHForceCat === Pnh.ForceCategoryMatchingType.NONE);
            }

            if (!(this.regions.includes(state2L) || this.regions.includes(region3L) // if the WME-selected venue matches the state, region
                || this.regions.includes(country) //  OR if the country code is in the data then it is approved for all regions therein
                || $('#WMEPH-RegionOverride').prop('checked'))) { // OR if region override is selected (dev setting)
                matchInfo.matchOutOfRegion = true;
            }

            return matchInfo;
        }
    }

    /** "Namespace" for classes and methods related to handling PNH spreadsheet data */
    class Pnh {
        static #SPREADSHEET_ID = '1pBz4l4cNapyGyzfMJKqA4ePEFLkmz2RryAt1UV39B4g';
        static #SPREADSHEET_RANGE = '2019.01.20.001!A2:L';
        static #SPREADSHEET_MODERATORS_RANGE = 'Moderators!A1:F';
        static #API_KEY = 'YTJWNVBVRkplbUZUZVVObU1YVXpSRVZ3ZW5OaFRFSk1SbTR4VGxKblRURjJlRTFYY3pOQ2NXZElPQT09';
        /** Columns that can be ignored when importing */
        static COLUMNS_TO_IGNORE = ['temp_field', 'ph_services', 'ph_national', 'logo', ''];
        static WORD_VARIATIONS = null;
        static MODERATORS = {};
        // vars for category name checking
        /** @type {string[]} */
        static HOSPITAL_PART_MATCH;
        /** @type {string[]} */
        static HOSPITAL_FULL_MATCH;
        /** @type {string[]} */
        static ANIMAL_PART_MATCH;
        /** @type {string[]} */
        static ANIMAL_FULL_MATCH;
        /** @type {string[]} */
        static SCHOOL_PART_MATCH;
        /** @type {string[]} */
        static SCHOOL_FULL_MATCH;

        static ForceCategoryMatchingType = Object.freeze({
            NONE: Symbol('none'),
            PRIMARY: Symbol('primary'),
            ANY: Symbol('any')
        });

        static SSHeader = Object.freeze({
            order: 'ph_order',
            name: 'ph_name',
            aliases: 'ph_aliases',
            category1: 'ph_category1',
            category2: 'ph_category2',
            description: 'ph_description',
            url: 'ph_url',
            notes: 'ph_notes',
            region: 'ph_region',
            disable: 'ph_disable',
            forcecat: 'ph_forcecat',
            displaynote: 'ph_displaynote',
            speccase: 'ph_speccase',
            searchnamebase: 'ph_searchnamebase',
            searchnamemid: 'ph_searchnamemid',
            searchnameend: 'ph_searchnameend',
            searchnameword: 'ph_searchnameword',
            sfurl: 'ph_sfurl',
            sfurllocal: 'ph_sfurllocal',
            toValueArray: () => Object.values(Pnh.SSHeader).filter(v => typeof v === 'string')
        });

        /**
         * Function that checks current place against the Harmonization Data. Returns place data, "NoMatch", or "Approval Needed"
         * @param {string} name The venue's base name, i.e. everything before a hyphen or parentheses
         * @param {string} state2L The 2-letter state abbreviation
         * @param {string} region3L The 3-letter region abbreviation
         * @param {string} country The country code
         * @param {string[]} categories The venue's current category array
         * @param {venue} venue The venue object
         * @param {boolean} [closedChainsOnly] Use true if only finding closed chains, i.e. when doing map highlights
         * @returns
         */
        static findMatch(name, state2L, region3L, country, categories, venue, closedChainsOnly) {
            if (country !== PNH_DATA.USA.countryCode && country !== PNH_DATA.CAN.countryCode) {
                return ['NoMatch'];
            }
            if (venue.isParkingLot()) {
                return ['NoMatch'];
            }
            /** @type {PnhEntry[]} */
            const pnhData = closedChainsOnly ? PNH_DATA[country].closedChains : PNH_DATA[country].pnh;
            const matchPNHRegionData = []; // array of matched data with regional approval
            const pnhOrderNum = [];
            const pnhNameTemp = [];
            let matchOutOfRegion = false; // tracks match status
            let matchInRegion = false;

            name = name.toUpperCase().replace(/ AND /g, ' ').replace(/^THE /g, '');
            const venueNameSpace = ` ${name.replace(/[^A-Z0-9 ]/g, ' ').replace(/ {2,}/g, ' ')} `;
            name = name.replace(/[^A-Z0-9]/g, ''); // Clear all non-letter and non-number characters ( HOLLYIVY PUB #23 -- > HOLLYIVYPUB23 )

            // for each entry in the PNH list (skipping headers at index 0)
            for (let pnhIdx = 0; pnhIdx < pnhData.length; pnhIdx++) {
                const pnhEntry = pnhData[pnhIdx];
                const matchInfo = pnhEntry.getMatchInfo(name, state2L, region3L, country, categories, venue, venueNameSpace);
                if (matchInfo.isMatch) {
                    // if (!matchInfo.allowMultiMatch) {
                    //     return [pnhEntry];
                    // }
                    if (matchInfo.matchOutOfRegion) {
                        // PNH match found (once true, stays true)
                        matchOutOfRegion = true;
                        // temp name for approval return
                        pnhNameTemp.push(pnhEntry.name);

                        // temp order number for approval return
                        pnhOrderNum.push(pnhEntry.order);
                    } else {
                        matchInRegion = true;
                        matchPNHRegionData.push(pnhEntry);
                    }
                }
            } // END loop through PNH entries

            // If name & region match was found:
            if (matchInRegion) {
                return matchPNHRegionData;
            }
            if (matchOutOfRegion) { // if a name match was found but not for region, prod the user to get it approved
                return ['ApprovalNeeded', pnhNameTemp, pnhOrderNum];
            }
            if (matchPNHRegionData.length) {
                return matchOutOfRegion;
            }
            // if no match was found, suggest adding the place to the sheet if it's a chain
            return ['NoMatch'];
        }

        static #validatePnhSSColumnHeaders(headers) {
            let valid = true;
            const expectedHeaders = Pnh.SSHeader.toValueArray();

            // Warn if extra headers are found in the spreadsheet.
            headers.forEach(header => {
                // temp_field currently exists on the USA sheet but may not be needed
                if (header.length && header !== 'temp_field' && !expectedHeaders.includes(header)
                    && !Pnh.COLUMNS_TO_IGNORE.includes(header)) {
                    console.warn(`WMEPH: Unexpected column header found in PNH spreadsheet: ${header}`);
                }
            });

            // Return invalid if expected headers are not found in spreadsheet.
            expectedHeaders.forEach(header => {
                if (!headers.includes(header)) {
                    console.error(`WMEPH: Column header missing from PNH spreadsheet data: ${header}`);
                    valid = false;
                }
            });

            return valid;
        }

        /**
         *
         * @param {string[]} rows
         * @param {Country} country
         * @returns {PnhEntry[]}
         */
        static processPnhSSRows(allData, columnIndex, country) {
            const rows = this.processImportedDataColumn(allData, columnIndex);
            const columnHeaders = rows.splice(0, 1)[0].split('|').map(h => h.trim());

            // Canada's spreadsheet is missing 'ph_order' in the first column header.
            if (!columnHeaders[0].length) columnHeaders[0] = Pnh.SSHeader.order;

            if (!Pnh.#validatePnhSSColumnHeaders(columnHeaders)) {
                throw new Error('WMEPH: WMEPH exiting due to missing spreadsheet column headers.');
            }
            return rows.map(row => new PnhEntry(columnHeaders, row, country))
                .filter(entry => !entry.disabled && !entry.invalid);
        }

        static processImportedDataColumn(allData, columnIndex) {
            return allData.filter(row => row.length >= columnIndex + 1).map(row => row[columnIndex]);
        }

        static #getSpreadsheetUrl(id, range, key) {
            return `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?${dec(key)}`;
        }

        static async downloadAllData() {
            await this.downloadPnhData();
            await this.#downloadPnhModerators();
        }

        static downloadPnhData() {
            log('PNH data download started...');
            return new Promise((resolve, reject) => {
                const url = this.#getSpreadsheetUrl(this.#SPREADSHEET_ID, this.#SPREADSHEET_RANGE, this.#API_KEY);

                $.getJSON(url).done(res => {
                    const { values } = res;
                    if (values[0][0].toLowerCase() === 'obsolete') {
                        WazeWrap.Alerts.error(SCRIPT_NAME, 'You are using an outdated version of WMEPH that doesn\'t work anymore. Update or disable the script.');
                        return;
                    }

                    // This needs to be performed before makeNameCheckList() is called.
                    Pnh.WORD_VARIATIONS = Pnh.processImportedDataColumn(values, 11).slice(1).map(row => row.toUpperCase().replace(/[^A-z0-9,]/g, '').split(','));

                    PNH_DATA.USA = new Country('USA', 'USA', values, 3, 0, {
                        NWR: new Region('NWR', '1hv5hXBlGr1pTMmo4n3frUx1DovUODbZodfDBwwTc7HE'),
                        SWR: new Region('SWR', '1Qf2N4fSkNzhVuXJwPBJMQBmW0suNuy8W9itCo1qgJL4'),
                        HI: new Region('HI', '1K7Dohm8eamIKry3KwMTVnpMdJLaMIyDGMt7Bw6iqH_A', null, ['entry.1497446659', 'entry.50214576', 'entry.1749047694']),
                        PLN: new Region('PLN', '1ycXtAppoR5eEydFBwnghhu1hkHq26uabjUu8yAlIQuI'),
                        SCR: new Region('SCR', '1KZzLdlX0HLxED5Bv0wFB-rWccxUp2Mclih5QJIQFKSQ'),
                        GLR: new Region('GLR', '19btj-Qt2-_TCRlcS49fl6AeUT95Wnmu7Um53qzjj9BA'),
                        SAT: new Region(
                            'SAT',
                            '1bxgK_20Jix2ahbmUvY1qcY0-RmzUBT6KbE5kjDEObF8',
                            ['entry.2063110249', 'entry.2018912633', 'entry.1924826395'],
                            ['entry.2063110249', 'entry.123778794', 'entry.1924826395']
                        ),
                        SER: new Region(
                            'SER',
                            '1jYBcxT3jycrkttK5BxhvPXR240KUHnoFMtkZAXzPg34',
                            ['entry.822075961', 'entry.1422079728', 'entry.1891389966'],
                            ['entry.822075961', 'entry.607048307', 'entry.1891389966']
                        ),
                        ATR: new Region('ATR', '1v7JhffTfr62aPSOp8qZHA_5ARkBPldWWJwDeDzEioR0'),
                        NER: new Region('NER', '1UgFAMdSQuJAySHR0D86frvphp81l7qhEdJXZpyBZU6c'),
                        NOR: new Region('NOR', '1iYq2rd9HRd-RBsKqmbHDIEBGuyWBSyrIHC6QLESfm4c'),
                        MAR: new Region('MAR', '1PhL1iaugbRMc3W-yGdqESoooeOz-TJIbjdLBRScJYOk')
                    });
                    PNH_DATA.CAN = new Country('CAN', 'Canada', values, 3, 2, {
                        CA_EN: new Region(
                            'CA_EN',
                            '13JwXsrWPNmCdfGR5OVr5jnGZw-uNGohwgjim-JYbSws',
                            ['entry_839085807', 'entry_1067461077', 'entry_318793106', 'entry_1149649663'],
                            ['entry_839085807', 'entry_1125435193', 'entry_318793106', 'entry_1149649663']
                        ),
                        QC: new Region(
                            'QC',
                            '13JwXsrWPNmCdfGR5OVr5jnGZw-uNGohwgjim-JYbSws',
                            ['entry_839085807', 'entry_1067461077', 'entry_318793106', 'entry_1149649663'],
                            ['entry_839085807', 'entry_1125435193', 'entry_318793106', 'entry_1149649663']
                        )
                    });
                    PNH_DATA.states = Pnh.processImportedDataColumn(values, 1);

                    const WMEPHuserList = Pnh.processImportedDataColumn(values, 4)[1].split('|');
                    const betaix = WMEPHuserList.indexOf('BETAUSERS');
                    _wmephDevList = [];
                    _wmephBetaList = [];
                    for (let ulix = 1; ulix < betaix; ulix++) _wmephDevList.push(WMEPHuserList[ulix].toLowerCase().trim());
                    for (let ulix = betaix + 1; ulix < WMEPHuserList.length; ulix++) _wmephBetaList.push(WMEPHuserList[ulix].toLowerCase().trim());

                    const processTermsCell = (termsValues, colIdx) => Pnh.processImportedDataColumn(termsValues, colIdx)[1]
                        .toLowerCase().split('|').map(value => value.trim());
                    this.HOSPITAL_PART_MATCH = processTermsCell(values, 5);
                    this.HOSPITAL_FULL_MATCH = processTermsCell(values, 6);
                    this.ANIMAL_PART_MATCH = processTermsCell(values, 7);
                    this.ANIMAL_FULL_MATCH = processTermsCell(values, 8);
                    this.SCHOOL_PART_MATCH = processTermsCell(values, 9);
                    this.SCHOOL_FULL_MATCH = processTermsCell(values, 10);

                    log('PNH data download completed');
                    resolve();
                }).fail(res => {
                    const message = res.responseJSON && res.responseJSON.error ? res.responseJSON.error : 'See response error message above.';
                    console.error('WMEPH failed to load spreadsheet:', message);
                    reject();
                });
            });
        }

        static #downloadPnhModerators() {
            log('PNH moderators download started...');
            return new Promise(resolve => {
                const url = Pnh.#getSpreadsheetUrl(Pnh.#SPREADSHEET_ID, Pnh.#SPREADSHEET_MODERATORS_RANGE, Pnh.#API_KEY);

                $.getJSON(url).done(res => {
                    const { values } = res;

                    try {
                        values.forEach(regionArray => {
                            const region = regionArray[0];
                            const mods = regionArray.slice(3);
                            Pnh.MODERATORS[region] = mods;
                        });
                    } catch (ex) {
                        Pnh.MODERATORS['?'] = ['Error downloading moderators!'];
                    }

                    // delete Texas region, if it exists
                    delete Pnh.MODERATORS.TX;

                    log('PNH moderators download completed');
                    resolve();
                }).fail(res => {
                    const message = res.responseJSON && res.responseJSON.error ? res.responseJSON.error : 'See response error message above.';
                    console.error('WMEPH failed to load moderator list:', message);
                    Pnh.MODERATORS['?'] = ['Error downloading moderators!'];
                    resolve();
                });
            });
        }

        static processCategories(categoryDataRows, categoryInfos) {
            let headers;
            let pnhServiceKeys;
            let wmeServiceIds;
            const splitValues = (value => (value.trim() ? value.split(',').map(v => v.trim()) : []));
            categoryDataRows.forEach((row, iRow) => {
                row = row.split('|');
                if (iRow === 0) {
                    headers = row;
                } else if (iRow === 1) {
                    pnhServiceKeys = row;
                } else if (iRow === 2) {
                    wmeServiceIds = row;
                } else {
                    const categoryInfo = {
                        services: []
                    };
                    row.forEach((value, iCol) => {
                        const headerValue = headers[iCol].trim();
                        value = value.trim();
                        switch (headerValue) {
                            case 'pc_wmecat':
                                categoryInfo.id = value;
                                break;
                            case 'pc_transcat':
                                categoryInfo.name = value;
                                break;
                            case 'pc_catparent':
                                categoryInfo.parent = value;
                                break;
                            case 'pc_point':
                                categoryInfo.point = value;
                                break;
                            case 'pc_area':
                                categoryInfo.area = value;
                                break;
                            case 'pc_regpoint':
                                categoryInfo.regPoint = splitValues(value);
                                break;
                            case 'pc_regarea':
                                categoryInfo.regArea = splitValues(value);
                                break;
                            case 'pc_lock1':
                                categoryInfo.lock1 = splitValues(value);
                                break;
                            case 'pc_lock2':
                                categoryInfo.lock2 = splitValues(value);
                                break;
                            case 'pc_lock3':
                                categoryInfo.lock3 = splitValues(value);
                                break;
                            case 'pc_lock4':
                                categoryInfo.lock4 = splitValues(value);
                                break;
                            case 'pc_lock5':
                                categoryInfo.lock5 = splitValues(value);
                                break;
                            case 'pc_rare':
                                categoryInfo.rare = splitValues(value);
                                break;
                            case 'pc_parent':
                                categoryInfo.disallowedParent = splitValues(value);
                                break;
                            case 'pc_message':
                                categoryInfo.messagae = value;
                                break;
                            case 'ps_valet':
                            case 'ps_drivethru':
                            case 'ps_wifi':
                            case 'ps_restrooms':
                            case 'ps_cc':
                            case 'ps_reservations':
                            case 'ps_outside':
                            case 'ps_ac':
                            case 'ps_parking':
                            case 'ps_deliveries':
                            case 'ps_takeaway':
                            case 'ps_wheelchair':
                                if (value) {
                                    categoryInfo.services.push({ wmeId: wmeServiceIds[iCol], pnhKey: pnhServiceKeys[iCol] });
                                }
                                break;
                            case '':
                                // ignore blank column
                                break;
                            default:
                                throw new Error(`WMEPH: Unexpected category data from PNH sheet: ${headerValue}`);
                        }
                    });
                    categoryInfos.add(categoryInfo);
                }
            });
        }
    }

    // KB Shortcut object
    const SHORTCUT = {
        allShortcuts: {}, // All the shortcuts are stored in this array
        add(shortcutCombo, callback, opt) {
            // Provide a set of default options
            const defaultOptions = {
                type: 'keydown', propagate: false, disableInInput: false, target: document, keycode: false
            };
            if (!opt) {
                opt = defaultOptions;
            } else {
                Object.keys(defaultOptions).forEach(dfo => {
                    if (typeof opt[dfo] === 'undefined') { opt[dfo] = defaultOptions[dfo]; }
                });
            }
            let ele = opt.target;
            if (typeof opt.target === 'string') { ele = document.getElementById(opt.target); }
            // var ths = this;
            shortcutCombo = shortcutCombo.toLowerCase();
            // The function to be called at keypress
            // eslint-disable-next-line func-names
            const func = function keyPressFunc(e) {
                e = e || window.event;
                if (opt.disableInInput) { // Don't enable shortcut keys in Input, Textarea fields
                    let element;
                    if (e.target) {
                        element = e.target;
                    } else if (e.srcElement) {
                        element = e.srcElement;
                    }
                    if (element.nodeType === 3) { element = element.parentNode; }
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') { return; }
                }
                // Find Which key is pressed
                let code;
                if (e.keyCode) {
                    code = e.keyCode;
                } else if (e.which) {
                    code = e.which;
                }
                let character = String.fromCharCode(code).toLowerCase();
                if (code === 188) { character = ','; } // If the user presses , when the type is onkeydown
                if (code === 190) { character = '.'; } // If the user presses , when the type is onkeydown
                const keys = shortcutCombo.split('+');
                // Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
                let kp = 0;
                // Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
                const shiftNums = {
                    '`': '~',
                    1: '!',
                    2: '@',
                    3: '#',
                    4: '$',
                    5: '%',
                    6: '^',
                    7: '&',
                    8: '*',
                    9: '(',
                    0: ')',
                    '-': '_',
                    '=': '+',
                    ';': ':',
                    '\'': '"',
                    ',': '<',
                    '.': '>',
                    '/': '?',
                    '\\': '|'
                };
                // Special Keys - and their codes
                const specialKeys = {
                    esc: 27,
                    escape: 27,
                    tab: 9,
                    space: 32,
                    return: 13,
                    enter: 13,
                    backspace: 8,
                    scrolllock: 145,
                    // eslint-disable-next-line camelcase
                    scroll_lock: 145,
                    scroll: 145,
                    capslock: 20,
                    // eslint-disable-next-line camelcase
                    caps_lock: 20,
                    caps: 20,
                    numlock: 144,
                    // eslint-disable-next-line camelcase
                    num_lock: 144,
                    num: 144,
                    pause: 19,
                    break: 19,
                    insert: 45,
                    home: 36,
                    delete: 46,
                    end: 35,
                    pageup: 33,
                    // eslint-disable-next-line camelcase
                    page_up: 33,
                    pu: 33,
                    pagedown: 34,
                    // eslint-disable-next-line camelcase
                    page_down: 34,
                    pd: 34,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    f1: 112,
                    f2: 113,
                    f3: 114,
                    f4: 115,
                    f5: 116,
                    f6: 117,
                    f7: 118,
                    f8: 119,
                    f9: 120,
                    f10: 121,
                    f11: 122,
                    f12: 123
                };
                const modifiers = {
                    shift: { wanted: false, pressed: false },
                    ctrl: { wanted: false, pressed: false },
                    alt: { wanted: false, pressed: false },
                    meta: { wanted: false, pressed: false } // Meta is Mac specific
                };
                if (e.ctrlKey) { modifiers.ctrl.pressed = true; }
                if (e.shiftKey) { modifiers.shift.pressed = true; }
                if (e.altKey) { modifiers.alt.pressed = true; }
                if (e.metaKey) { modifiers.meta.pressed = true; }
                for (let i = 0; i < keys.length; i++) {
                    const k = keys[i];
                    // Modifiers
                    if (k === 'ctrl' || k === 'control') {
                        kp++;
                        modifiers.ctrl.wanted = true;
                    } else if (k === 'shift') {
                        kp++;
                        modifiers.shift.wanted = true;
                    } else if (k === 'alt') {
                        kp++;
                        modifiers.alt.wanted = true;
                    } else if (k === 'meta') {
                        kp++;
                        modifiers.meta.wanted = true;
                    } else if (k.length > 1) { // If it is a special key
                        if (specialKeys[k] === code) { kp++; }
                    } else if (opt.keycode) {
                        if (opt.keycode === code) { kp++; }
                    } else if (character === k) { // The special keys did not match
                        kp++;
                    } else if (shiftNums[character] && e.shiftKey) { // Stupid Shift key bug created by using lowercase
                        character = shiftNums[character];
                        if (character === k) { kp++; }
                    }
                }

                if (kp === keys.length && modifiers.ctrl.pressed === modifiers.ctrl.wanted && modifiers.shift.pressed === modifiers.shift.wanted
                    && modifiers.alt.pressed === modifiers.alt.wanted && modifiers.meta.pressed === modifiers.meta.wanted) {
                    callback(e);
                    if (!opt.propagate) { // Stop the event
                        // e.cancelBubble is supported by IE - this will kill the bubbling process.
                        e.cancelBubble = true;
                        e.returnValue = false;
                        // e.stopPropagation works in Firefox.
                        if (e.stopPropagation) {
                            e.stopPropagation();
                            e.preventDefault();
                        }

                        // 5/19/2019 (MapOMatic) Not sure if this return value is necessary.
                        // eslint-disable-next-line consistent-return
                        return false;
                    }
                }
            };
            this.allShortcuts[shortcutCombo] = { callback: func, target: ele, event: opt.type };
            // Attach the function with the event
            if (ele.addEventListener) {
                ele.addEventListener(opt.type, func, false);
            } else if (ele.attachEvent) {
                ele.attachEvent(`on${opt.type}`, func);
            } else {
                ele[`on${opt.type}`] = func;
            }
        },
        // Remove the shortcut - just specify the shortcut and I will remove the binding
        remove(shortcutCombo) {
            shortcutCombo = shortcutCombo.toLowerCase();
            const binding = this.allShortcuts[shortcutCombo];
            delete (this.allShortcuts[shortcutCombo]);
            if (!binding) { return; }
            const type = binding.event;
            const ele = binding.target;
            const { callback } = binding;
            if (ele.detachEvent) {
                ele.detachEvent(`on${type}`, callback);
            } else if (ele.removeEventListener) {
                ele.removeEventListener(type, callback, false);
            } else {
                ele[`on${type}`] = false;
            }
        }
    }; // END Shortcut function

    function errorHandler(callback, ...args) {
        try {
            callback(...args);
        } catch (ex) {
            console.error(`${SCRIPT_NAME}:`, ex);
        }
    }

    function isNullOrWhitespace(str) {
        return !str?.trim().length;
    }

    function getSelectedVenue() {
        const objects = W.selectionManager.getSelectedDataModelObjects();
        // Be sure to check for features.length === 1, in case multiple venues are currently selected.
        return objects.length === 1 && objects[0].type === 'venue' ? objects[0] : null;
    }

    function getVenueLonLat(venue) {
        const pt = venue.getOLGeometry().getCentroid();
        return new OpenLayers.LonLat(pt.x, pt.y);
    }

    function isAlwaysOpen(venue) {
        return is247Hours(venue.attributes.openingHours);
    }

    function is247Hours(openingHours) {
        return openingHours.length === 1 && openingHours[0].days.length === 7 && openingHours[0].isAllDay();
    }

    function isEmergencyRoom(venue) {
        return /(?:emergency\s+(?:room|department|dept))|\b(?:er|ed)\b/i.test(venue.attributes.name);
    }

    function isRestArea(venue) {
        return venue.attributes.categories.includes(CAT.REST_AREAS) && /rest\s*area/i.test(venue.attributes.name);
    }

    function getPvaSeverity(pvaValue, venue) {
        const isER = pvaValue === 'hosp' && isEmergencyRoom(venue);
        let severity;
        if (pvaValue === '' || pvaValue === '0' || (pvaValue === 'hosp' && !isER)) {
            severity = SEVERITY.RED;
        } else if (pvaValue === '2') {
            severity = SEVERITY.BLUE;
        } else if (pvaValue === '3') {
            severity = SEVERITY.YELLOW;
        } else {
            severity = SEVERITY.GREEN;
        }
        return severity;
    }

    function addPURWebSearchButton() {
        const purLayerObserver = new MutationObserver(panelContainerChanged);
        purLayerObserver.observe($('#map #panel-container')[0], { childList: true, subtree: true });

        function panelContainerChanged() {
            if (!$('#WMEPH-HidePURWebSearch').prop('checked')) {
                const $panelNav = $('.place-update-edit .place-update > div > span');
                if ($('#PHPURWebSearchButton').length === 0 && $panelNav.length) {
                    const $btn = $('<div>').css({
                        paddingLeft: '15px',
                        paddingBottom: '8px'
                    }).append(
                        $('<button>', {
                            class: 'btn btn-danger', id: 'PHPURWebSearchButton', title: 'Search Google for this place. Do not copy info from 3rd party sources!'
                        }) // NOTE: Don't use btn-block class. Causes conflict with URO+ "Done" button.
                            .css({
                                marginTop: '-10px',
                                fontSize: '14px'
                            })
                            .text('Google')
                            .click(() => { openWebSearch(); })
                    );
                    $panelNav.after($btn);
                }
            }
        }

        function buildSearchUrl(searchName, address) {
            searchName = searchName
                .replace(/[/]/g, ' ')
                .trim();
            address = address
                .replace(/No street, /, '')
                .replace(/No address/, '')
                .replace(/CR-/g, 'County Rd ')
                .replace(/SR-/g, 'State Hwy ')
                .replace(/US-/g, 'US Hwy ')
                .replace(/ CR /g, ' County Rd ')
                .replace(/ SR /g, ' State Hwy ')
                .replace(/ US /g, ' US Hwy ')
                .replace(/$CR /g, 'County Rd ')
                .replace(/$SR /g, 'State Hwy ')
                .replace(/$US /g, 'US Hwy ')
                .trim();

            searchName = encodeURIComponent(searchName + (address.length > 0 ? `, ${address}` : ''));
            return `http://www.google.com/search?q=${searchName}`;
        }

        function openWebSearch() {
            const nameElem = $('.place-update-edit.panel .name');
            let name = null;
            let addr = null;
            if (nameElem.length) {
                name = $('.place-update-edit.panel .name').first().text();
                addr = $('.place-update-edit.panel .address').first().text();
            } else {
                name = $('.place-update-edit.panel .changes div div')[0].textContent;
                addr = $('.place-update-edit.panel .changes div div')[1].textContent;
            }
            if (!name) return;
            if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
                window.open(buildSearchUrl(name, addr));
            } else {
                window.open(buildSearchUrl(name, addr), SEARCH_RESULTS_WINDOW_NAME, _searchResultsWindowSpecs);
            }
        }
    }

    function addSpellingVariants(nameList, spellingVariantList) {
        for (let spellingOneIdx = 0; spellingOneIdx < spellingVariantList.length; spellingOneIdx++) {
            const spellingOne = spellingVariantList[spellingOneIdx];
            const namesToCheck = nameList.filter(name => name.includes(spellingOne));
            for (let spellingTwoIdx = 0; spellingTwoIdx < spellingVariantList.length; spellingTwoIdx++) {
                if (spellingTwoIdx !== spellingOneIdx) {
                    const spellingTwo = spellingVariantList[spellingTwoIdx];
                    namesToCheck.forEach(name => {
                        const newName = name.replace(spellingOne, spellingTwo);
                        if (!nameList.includes(newName)) nameList.push(newName);
                    });
                }
            }
        }
    }

    function uniq(arrayIn) {
        return [...new Set(arrayIn)];
    }

    function clickGeneralTab() {
        // Make sure the General tab is selected before clicking on the external provider element.
        // These selector strings are very specific.  Could probably make them more generalized for robustness.
        const containerSelector = '#edit-panel > div > div.venue-feature-editor > div > div.venue-edit-section > wz-tabs';
        const shadowSelector = 'div > div > div > div > div:nth-child(1)';
        document.querySelector(containerSelector).shadowRoot.querySelector(shadowSelector).click();
    }

    // Whitelist stringifying and parsing
    function saveWhitelistToLS(compress) {
        let wlString = JSON.stringify(_venueWhitelist);
        if (compress) {
            if (wlString.length < 4800000) { // Also save to regular storage as a back up
                localStorage.setItem(WL_LOCAL_STORE_NAME, wlString);
            }
            wlString = LZString.compressToUTF16(wlString);
            localStorage.setItem(WL_LOCAL_STORE_NAME_COMPRESSED, wlString);
        } else {
            localStorage.setItem(WL_LOCAL_STORE_NAME, wlString);
        }
    }
    function loadWhitelistFromLS(decompress) {
        let wlString;
        if (decompress) {
            wlString = localStorage.getItem(WL_LOCAL_STORE_NAME_COMPRESSED);
            wlString = LZString.decompressFromUTF16(wlString);
        } else {
            wlString = localStorage.getItem(WL_LOCAL_STORE_NAME);
        }
        _venueWhitelist = JSON.parse(wlString);
    }
    function backupWhitelistToLS(compress) {
        let wlString = JSON.stringify(_venueWhitelist);
        if (compress) {
            wlString = LZString.compressToUTF16(wlString);
            localStorage.setItem(WL_LOCAL_STORE_NAME_COMPRESSED + Math.floor(Date.now() / 1000), wlString);
        } else {
            localStorage.setItem(WL_LOCAL_STORE_NAME + Math.floor(Date.now() / 1000), wlString);
        }
    }

    function log(...args) {
        console.log(`WMEPH${IS_BETA_VERSION ? '-β' : ''}:`, ...args);
    }
    function logDev(...args) {
        if (USER.isDevUser) {
            console.debug(`WMEPH${IS_BETA_VERSION ? '-β' : ''} (dev):`, ...args);
        }
    }

    function zoomPlace() {
        const venue = getSelectedVenue();
        if (venue) {
            W.map.moveTo(getVenueLonLat(venue), 7);
        } else {
            W.map.moveTo(_wmephMousePosition, 5);
        }
    }

    function nudgeVenue(venue) {
        const newGeometry = structuredClone(venue.getGeometry());
        const moveNegative = Math.random() > 0.5;
        const nudgeDistance = 0.00000001 * (moveNegative ? -1 : 1);
        if (venue.isPoint()) {
            newGeometry.coordinates[0] += nudgeDistance;
        } else {
            // Be sure to edit the 2nd coordinate. Editing the 1st would also require editing the last,
            // otherwise the polygon is not "complete" and another point (geonode) may be added behind the scenes
            // to complete it.
            newGeometry.coordinates[0][1][0] += nudgeDistance;
        }
        const action = new UpdateFeatureGeometry(venue, W.model.venues, venue.getGeometry(), newGeometry);
        const mAction = new MultiAction([action], { description: 'Place nudged by WMEPH' });
        W.model.actionManager.add(mAction);
    }

    function sortWithIndex(toSort) {
        for (let i = 0; i < toSort.length; i++) {
            toSort[i] = [toSort[i], i];
        }
        toSort.sort((left, right) => (left[0] < right[0] ? -1 : 1));
        toSort.sortIndices = [];
        for (let j = 0; j < toSort.length; j++) {
            toSort.sortIndices.push(toSort[j][1]);
            // eslint-disable-next-line prefer-destructuring
            toSort[j] = toSort[j][0];
        }
        return toSort;
    }

    function destroyDupeLabels() {
        _dupeLayer.destroyFeatures();
        _dupeLayer.setVisibility(false);
    }

    // When a dupe is deleted, delete the dupe label
    function deleteDupeLabel() {
        setTimeout(() => {
            const actionsList = W.model.actionManager.getActions();
            const lastAction = actionsList[actionsList.length - 1];
            if (typeof lastAction !== 'undefined' && lastAction.hasOwnProperty('object') && lastAction.object.hasOwnProperty('state') && lastAction.object.state === 'Delete') {
                if (_dupeIDList.includes(lastAction.object.attributes.id)) {
                    if (_dupeIDList.length === 2) {
                        destroyDupeLabels();
                    } else {
                        const deletedDupe = _dupeLayer.getFeaturesByAttribute('dupeID', lastAction.object.attributes.id);
                        _dupeLayer.removeFeatures(deletedDupe);
                        _dupeIDList.splice(_dupeIDList.indexOf(lastAction.object.attributes.id), 1);
                    }
                    log('Deleted a dupe');
                }
            }
        }, 20);
    }

    //  Whitelist a flag. Returns true if successful. False if not.
    function whitelistAction(venueID, wlKeyName) {
        const venue = getSelectedVenue();
        let addressTemp = venue.getAddress();
        if (addressTemp.hasOwnProperty('attributes')) {
            addressTemp = addressTemp.attributes;
        }
        if (!addressTemp.country) {
            WazeWrap.Alerts.error(SCRIPT_NAME, 'Whitelisting requires an address. Enter the place\'s address and try again.');
            return false;
        }
        const centroid = venue.getOLGeometry().getCentroid();
        const venueGPS = OpenLayers.Layer.SphericalMercator.inverseMercator(centroid.x, centroid.y);
        if (!_venueWhitelist.hasOwnProperty(venueID)) { // If venue is NOT on WL, then add it.
            _venueWhitelist[venueID] = {};
        }
        _venueWhitelist[venueID][wlKeyName] = { active: true }; // WL the flag for the venue
        _venueWhitelist[venueID].city = addressTemp.city.getName(); // Store city for the venue
        _venueWhitelist[venueID].state = addressTemp.state.getName(); // Store state for the venue
        _venueWhitelist[venueID].country = addressTemp.country.getName(); // Store country for the venue
        _venueWhitelist[venueID].gps = venueGPS; // Store GPS coords for the venue
        saveWhitelistToLS(true); // Save the WL to local storage
        wmephWhitelistCounter();
        _buttonBanner2.clearWL.active = true;

        // Remove venue from the results cache so it can be updated again.
        delete _resultsCache[venue.attributes.id];
        return true;
    }

    // Keep track of how many whitelists have been added since the last pull, alert if over a threshold (100?)
    function wmephWhitelistCounter() {
        // eslint-disable-next-line camelcase
        localStorage.WMEPH_WLAddCount = parseInt(localStorage.WMEPH_WLAddCount, 10) + 1;
        if (localStorage.WMEPH_WLAddCount > 50) {
            WazeWrap.Alerts.warning(SCRIPT_NAME, 'Don\'t forget to periodically back up your Whitelist data using the Pull option in the WMEPH settings tab.');
            // eslint-disable-next-line camelcase
            localStorage.WMEPH_WLAddCount = 2;
        }
    }

    function createObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // Mutation is a NodeList and doesn't support forEach like an array
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const addedNode = mutation.addedNodes[i];
                    // Only fire up if it's a node
                    if (addedNode.querySelector && addedNode.querySelector('.tab-scroll-gradient')) {
                        // Normally, scrolling happens inside the tab-content div.  When WMEPH adds stuff outside the venue div, it effectively breaks that
                        // and causes scrolling to occur at the main content div under edit-panel.  That's actually OK, but need to disable a couple
                        // artifacts that "stick around" with absolute positioning.
                        $('#edit-panel .venue').removeClass('separator-line');
                        $('#edit-panel .tab-scroll-gradient').css({ display: 'none' });
                    }
                }
            });
        });
        observer.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });
    }

    function appendServiceButtonIconCss() {
        const cssArray = [
            '.serv-247 { width: 73px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAAAyCAYAAAAQlvbeAAAD8GlDQ1BJQ0MgUHJvZmlsZQAAOI2NVd1v21QUP4lvXKQWP6Cxjg4Vi69VU1u5GxqtxgZJk6XpQhq5zdgqpMl1bhpT1za2021Vn/YCbwz4A4CyBx6QeEIaDMT2su0BtElTQRXVJKQ9dNpAaJP2gqpwrq9Tu13GuJGvfznndz7v0TVAx1ea45hJGWDe8l01n5GPn5iWO1YhCc9BJ/RAp6Z7TrpcLgIuxoVH1sNfIcHeNwfa6/9zdVappwMknkJsVz19HvFpgJSpO64PIN5G+fAp30Hc8TziHS4miFhheJbjLMMzHB8POFPqKGKWi6TXtSriJcT9MzH5bAzzHIK1I08t6hq6zHpRdu2aYdJYuk9Q/881bzZa8Xrx6fLmJo/iu4/VXnfH1BB/rmu5ScQvI77m+BkmfxXxvcZcJY14L0DymZp7pML5yTcW61PvIN6JuGr4halQvmjNlCa4bXJ5zj6qhpxrujeKPYMXEd+q00KR5yNAlWZzrF+Ie+uNsdC/MO4tTOZafhbroyXuR3Df08bLiHsQf+ja6gTPWVimZl7l/oUrjl8OcxDWLbNU5D6JRL2gxkDu16fGuC054OMhclsyXTOOFEL+kmMGs4i5kfNuQ62EnBuam8tzP+Q+tSqhz9SuqpZlvR1EfBiOJTSgYMMM7jpYsAEyqJCHDL4dcFFTAwNMlFDUUpQYiadhDmXteeWAw3HEmA2s15k1RmnP4RHuhBybdBOF7MfnICmSQ2SYjIBM3iRvkcMki9IRcnDTthyLz2Ld2fTzPjTQK+Mdg8y5nkZfFO+se9LQr3/09xZr+5GcaSufeAfAww60mAPx+q8u/bAr8rFCLrx7s+vqEkw8qb+p26n11Aruq6m1iJH6PbWGv1VIY25mkNE8PkaQhxfLIF7DZXx80HD/A3l2jLclYs061xNpWCfoB6WHJTjbH0mV35Q/lRXlC+W8cndbl9t2SfhU+Fb4UfhO+F74GWThknBZ+Em4InwjXIyd1ePnY/Psg3pb1TJNu15TMKWMtFt6ScpKL0ivSMXIn9QtDUlj0h7U7N48t3i8eC0GnMC91dX2sTivgloDTgUVeEGHLTizbf5Da9JLhkhh29QOs1luMcScmBXTIIt7xRFxSBxnuJWfuAd1I7jntkyd/pgKaIwVr3MgmDo2q8x6IdB5QH162mcX7ajtnHGN2bov71OU1+U0fqqoXLD0wX5ZM005UHmySz3qLtDqILDvIL+iH6jB9y2x83ok898GOPQX3lk3Itl0A+BrD6D7tUjWh3fis58BXDigN9yF8M5PJH4B8Gr79/F/XRm8m241mw/wvur4BGDj42bzn+Vmc+NL9L8GcMn8F1kAcXgSteGGAAAACXBIWXMAABcSAAAXEgFnn9JSAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAOKklEQVRoBe2aeXDV1RXHsxMCBLKQhACSACK7QEGWsm8qimUphQJVClSoLR2oMLXTzgBT/6HTgbZWB2sdmJEZEKoFVDq2MhAEEUwVYbQBNYSdsATCDgl5/XzP+/3Cj5e3BWylMzkz93e3c84999xzzz33vhcTUwd1GqjTQJ0G7h0NxN47otyVJJqHO5equ+JUR/zf1YC7UnEMo+TWv+5RXd7R8jXradu2bdOkpKRJEE3JzMzMdYhdy4qWV0g8CRUOXGX4QFKSKSu5dbefpq8FXN61YpaYmPjIjRs3VjRq1Ghe+/btkx1iV7a7yY1VOCWJuSnD5/PF9+7dO5V6llLr1q0bb9myJcHtJxfuXcHTTz+dCIMsJpq5aNEi8Y4GJF/MlStXcsiS4+LiSnv27FnmELoKdxf0TnKHVfDMlDd9+vRGDzzwwHdyc3NfRPh3QN1F2p2SkvJudnb2n+mbwuQyHRZ3qiijy8vL+77D+29Tp05tGwVPo5swYQI7LWkF+BWpqalzPXSaQ/xdJhsj2Iqpo2rw4MGZGzZsWHT27NnvUW9KMoiNjdXKWSotLZ147ty5t8eMGfOr9evXl4AgWltdQ4780USqBgwY0Oyjjz76IeVepKbXr1+v75CG42d9lZWVeViQ6CqbN29ecuHCBZH6unbtOnrv3r1j2YqxFRUVkkn4ISE+Pp4N4zOcqqqquAYNGpxiAf60cuXKkkAl2cCjR4/OZDv95tKlSz+Ca3z9+vWLc3JytqCQDy5evFiRlZXV88SJE4/Q1+7UqVOTt23bdm3atGnPwvA8bcYjpDS3OoRXhWBxWOqMa9eu9VYX9WtMOmpF79u3LxeabEjPNm7c+IR4CJhoD7JpKkcCLfzNmzcNjbEth/54QkLCaiq3Kckmt3Tp0vpLliz5taOgq+np6a9zeizftWvXHphVigMKem3QoEEj9uzZs6S8vLx7WVnZ2B07dnxK1x9J0U7QxsNiB508eXI2dPJ5Ar+U/nK4r41z+fLlvlheZpMmTd5KTk7+zCVA1i0qo0C3KWQOTiJbtdPVq1f7YHUZIMp4vsJKzwYSmXDdu3fvW69evcN0+jC5lY899liaB1E42ucGDz/88HA0/zEVH36qcOTIkflOV6SJSkExmzZtqocVvSJ6Vk1L6cNq90+cOLGz+oFQfIyeycW1aNHC6Mn/Qt2Vzfr9LKL7PvHEEz2Z77/AllZP4iOfCkZpjNlW8+mUwMUcp4MdRA3uHVhlq2Nl0ylfIZ1v1arVWHJBqMn5e51+FmQ4DSUkCVahvDZK6tKlSxoTexu6Sg4Sr9OmycCVM1Iew2IthOIy6XqzZs2Wvfzyyyl+FjGx7mTEhIXwxbEX76ccx/7+BCEKHUT3OHWqNilTEkp9DyuQmTfGrwyFh9qFHwqsn1Mx5dChQ5NBSmWczQSBx0Xg+oRQxE67jc2p1o3t1pttdpRJbvf2OWUpP1wSH1/nzp37HT9+XAdUCrtoK1b0u1mzZmnhpR+fV0kxWE4Op5kcXgx79OYzzzxjPkj1IKDBY4YPH34c3L0qo6CMF154IUllwCbiL9b8bt68eRC+bCRCffjQQw8tAEPhhcD4+ovhv5yyWWCk4n/OE7u58VG09LZYTz75ZAYK0u7pSCrnUFqzc+fOY5Stn7x6WxhjzCwOc99OTLQTi9ozZMiQa0ICQg5M4FeJJZULiai3iomHxAXFVoaQIY9T8ZfUk7GAFa+++uonZ86cKRYPxlUWCQzpyJEjmlgCx/xmLPBQJKJg/YQeY5B5qPpw/u8PGzbs74F4riXZxLZu3Xp0/vz5Cx5//PGxrPCLgcjB6igpzo1rdJRGAJtcUVHRJEKJ/mzpgr59+74nGrbODYc2EhPrVxBLbNMXmriMjIzidevWyY+qL9wiOUP48WbOnJmNFU2gsTHp/H333beOMOYk5Wj5uPxC5iYs+zkbSyoAy4fzXK0Ty6Gwfg+11YnB2nMS6hQ5A+04tx8eiyjLcRdFON1sYaHtgNP+NzQXO3ToMIZcEDimv7Xm13gQcD5Fl2I7X1pa2juzZ8/W9hXcxse1JH/Xra+QbkO81VVdsn5W89vEE13VylYpGTVq1HUHI3BFrU5s9V18SdemTZtuJrzY7HLzbLNI4xofHHYvUmsU9TnbzT1gXHbhcvGvYsc04OAYRVlWVE60vmb58uWnKKv/NtlDKUlItyFS94INpGOSwFKr2ASfcBqz3+ogBfK1ep8+fTqAPx6cS/i/VQSt8mVubOOQhh1XOCYXi5NPOalhw4ZnJk+efNEljjbH4tuhZPm0GPlgZPtHtLTR4tmke/ToMRpfoquAAs9t48aNa+UwkBJdsLJCA475hTRW4azX4stSHATjhZIXUY8UJxkvvRjgzyyI5EbwW4dPNJnRr127Nh7X8DwEis3O5Ofn/8Ah9sodDb+QODap5378XBpb5nWwtLKX8AvzQlDYwBzzQ+k/gDKKevXqNcjBFS/r9ygpnE+ysTl1O0G3n1Terl27UR5eTjFkZvS4hHYsrraobgo7+/XrF2xxq5kYUXUtckETshNq9abV40+fPj1UJJjruw8++KAUJvCuhso+Vr7xwYMHf0K5JXHIKxy7BUIEpOBA8NIH9lmde2UmStUTzWW27emgSGEaeR3oTLhiimEH7J47d+5RBz2YPGE4Be+yCXAqSDkKIH0I+znXi4EOeuAErd6xY8ep9F/g5No5cODA/ABcw6mNJbFtZ8Kjggmu5YLcMICfU62R2TjaaiyUwhsp5IQzFyHX1mBEUwOMCcFWXyb7Ib0apJyV1HOKwITwF2/VFdFiaW/RUkG4725JL26gkkJdcN1JJjHJFfDz4duWBI7nqQcWjZ5tn4/T3y56/No/+/fvn+YgemW6jTZa7QmvasqUKS127979c54U7O0H57cJZ/3mbRxvVWxQ3ppGEDgOYtU/7tat20anO6RAt8iDl1566aVUgtc89RJb6fogEL9IW8XG5ETrwduRfFoMi71j+/bt51QGItH7sUJ8TZFjx47N4Lj9AzgXSFVYx5vjx49v7dAETtrqWF0GgsiKrmFF7i1dR754uslCALbbQtosmGSszpQFCf7MviYHvm8ItVNcakvatGnzLaff+jy4gUWTR1sNuZfS6YO+FDcwLBr6SMzVX6Ujt6CgYA4O8ynqjVjB9zjNnnvjjTeKqQvHuwoSyCeB9u/fPx2rG8opWDxp0qT1tAt0fZDzd5PqgmR94J3AFnaV416wjaf6gTxSJtemMk6lWl1qN27cmMVi9BATrlBHeH0oURnwyu9v8XxdYTxN1UVTkH65WLZs2bO8QM6hR9HpB1wJFrPtDlA2nGoKf8EmxF0qnxeFKTSlEGGnrVq1ahblT/EHVZi7O2nlUlY6cdQIcl2Scwj0NJbudFex3g9YnFPqE3CpbUHmg0cRVhHtyWbj8bqazXNOU/HBkrTQB1W+UxDTGCLqRN6LFlAsQ/PSdiknmX4EFAjH8Kx26yPFxfCI3oUYREKIzhIKqi67bd7cGcNw3PG4mQ8Ex4BfUZqxfQuoVHAZDXVgONi3ZSYnW/5ntOplo4J56MlYEGwO/h7nG8ySRKTtksT9Zh7vzwuYXBordx4L+j0W8WanTub3xEITCgRrw6z1aKWLbBn0FUw6hjueKTCAQPgNSHlOLsuS5eg2XkqqvnJwpUmDbw5tNwgDTh4+fJiiTTKYHOoT2HxUYPzmZLqAl2BRn6sNqO73V2vx5QHup6CX4yIkwBmc5ILCwsJEh4UYhwXilwQe49JBknkrKfgLTGrPILVk8mvIdb0pJaKeTrkJSfh6xLPxsGpF1+fxR+9jCbmUBZFksX7e3xuwdf8Kvt34edMSf0Ekej+W52sEnCAylULH5MsQ7hfOL7ZCrTVTD/+QRZS0kE4fEyninadDMMSWLVs+LxysaJVcgYMTSR6z3kcffbQ7+F+KntBljfcN2+ETVWaDzZgxI523ldeg0Mkira+aN29efYdDsO0Sjrl4iiZS0tv2IvDsgit/Rlmg8MDkoi0J5aym7mPRvEGk8MKByczP9P1ZdG1hHxYeLKgNyaPGpHl7HsmPkKPwIxKwEKtazul2lbLrv8JNOHBVtVXdoz5UXsOfoDC3Tbnx5NfiNjzxdmf7X0S0bbQLasjvb6755Z6pN3jhn+cw2OdgBMpbk5AWdxAh+1itdOdn7XQcdSUh+waedLc7lLKsUBN1293JOSRfX4bTbQm3XBR0EX9ZHRJEOwJOXzGS7nkVWKL7MBgVuWsdpqQvvviiK1eI3rz0xej3cx7rB/JiN+3YsWPlCBeL4oIypU9xSzxmfIQfLAud9+aguGEaXQVXeSxJ6NZeXFwsR53IC+ZXOPdjDh+XxqkGzfRTeix+qD+BrdzGBd6gtEuiBldJNhhH6gAoc1GQIt/EAwcOjKA+wlFCSKYIIfo49vwaVmkaZWnTFE8eLZgjhkdyQKjg00/vixcvlizJ+KUCIufjUTI1GVi0Bix8W9HoMAJ0tYoapCRjRFzUcM6cOTqO96KgCgSN5WHKx8rFqhyBo5Sk+OMQT7jRrG4wdkdp/Iz0JRNSwCewcXl/SsW6FGnr7eokW8fti2qso0ePYug3dUMoYm4F8NMpJ4iK3o/KF38Uz+/pimsUrGV7cpWjSpyEurZEUigoQUH+IgclZOqu6GCYzyRS7obivkRRRSp7+4JyCmjEcmJx1oqLmmGJjQK6/++rpnCeaBXY6v1nq14jnFnd6WLUWinu6eYSamC13Wm6G8Hdsb08bDvwBqStfJCtsoc/fOm6cycQjP+d8LknaTS5LK4i95PLHdTBvaiBWsUL3+AE3K3yDYpQN3SdBuo08D/QwH8AR/fmWzJvX3QAAAAASUVORK5CYII=) top center no-repeat; }',
            '.serv-ac { width: 50px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-credit { width: 73px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-deliveries { width: 86px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-drivethru { width: 78px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-outdoor { width: 73px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-parking { width: 46px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-reservations { width: 55px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-restrooms { width: 49px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-takeaway { width: 34px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-valet { width: 50px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-wheelchair { width: 50px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
            '.serv-wifi { width: 67px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAyCAYAAAAHtGYXAAAD8GlDQ1BJQ0MgUHJvZmlsZQAAOI2NVd1v21QUP4lvXKQWP6Cxjg4Vi69VU1u5GxqtxgZJk6XpQhq5zdgqpMl1bhpT1za2021Vn/YCbwz4A4CyBx6QeEIaDMT2su0BtElTQRXVJKQ9dNpAaJP2gqpwrq9Tu13GuJGvfznndz7v0TVAx1ea45hJGWDe8l01n5GPn5iWO1YhCc9BJ/RAp6Z7TrpcLgIuxoVH1sNfIcHeNwfa6/9zdVappwMknkJsVz19HvFpgJSpO64PIN5G+fAp30Hc8TziHS4miFhheJbjLMMzHB8POFPqKGKWi6TXtSriJcT9MzH5bAzzHIK1I08t6hq6zHpRdu2aYdJYuk9Q/881bzZa8Xrx6fLmJo/iu4/VXnfH1BB/rmu5ScQvI77m+BkmfxXxvcZcJY14L0DymZp7pML5yTcW61PvIN6JuGr4halQvmjNlCa4bXJ5zj6qhpxrujeKPYMXEd+q00KR5yNAlWZzrF+Ie+uNsdC/MO4tTOZafhbroyXuR3Df08bLiHsQf+ja6gTPWVimZl7l/oUrjl8OcxDWLbNU5D6JRL2gxkDu16fGuC054OMhclsyXTOOFEL+kmMGs4i5kfNuQ62EnBuam8tzP+Q+tSqhz9SuqpZlvR1EfBiOJTSgYMMM7jpYsAEyqJCHDL4dcFFTAwNMlFDUUpQYiadhDmXteeWAw3HEmA2s15k1RmnP4RHuhBybdBOF7MfnICmSQ2SYjIBM3iRvkcMki9IRcnDTthyLz2Ld2fTzPjTQK+Mdg8y5nkZfFO+se9LQr3/09xZr+5GcaSufeAfAww60mAPx+q8u/bAr8rFCLrx7s+vqEkw8qb+p26n11Aruq6m1iJH6PbWGv1VIY25mkNE8PkaQhxfLIF7DZXx80HD/A3l2jLclYs061xNpWCfoB6WHJTjbH0mV35Q/lRXlC+W8cndbl9t2SfhU+Fb4UfhO+F74GWThknBZ+Em4InwjXIyd1ePnY/Psg3pb1TJNu15TMKWMtFt6ScpKL0ivSMXIn9QtDUlj0h7U7N48t3i8eC0GnMC91dX2sTivgloDTgUVeEGHLTizbf5Da9JLhkhh29QOs1luMcScmBXTIIt7xRFxSBxnuJWfuAd1I7jntkyd/pgKaIwVr3MgmDo2q8x6IdB5QH162mcX7ajtnHGN2bov71OU1+U0fqqoXLD0wX5ZM005UHmySz3qLtDqILDvIL+iH6jB9y2x83ok898GOPQX3lk3Itl0A+BrD6D7tUjWh3fis58BXDigN9yF8M5PJH4B8Gr79/F/XRm8m241mw/wvur4BGDj42bzn+Vmc+NL9L8GcMn8F1kAcXgSteGGAAAACXBIWXMAABcSAAAXEgFnn9JSAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAMAElEQVRoBdWafWzVVxnHb18pLW2BFkqEuVI3XjIYc7rhcEuGBAU3QRbmG9G4GU34QzOzhJhFkZBFjSS+xGXq3sxi1InZdGyoDGUsIhUIClOIMjIqY8zSN/pOS9vr53t6nl9Ob2/vvdze8nKSp+f8znnO8/I9zzm/59xf82ITV/IRnQcNjqGigv5KqCBhPM5zP3QOSjZXclXEJ8pZkbG5LGboUILQyVOnTp3X29t7B/2F8Xh8OvWyyZMn31hQUFBy8eJFuuIx2qJ4f39/W19f39HCwsLXh4aGeunrKS0t3dfc3HyKeRcD2Qa49I0bmFyBkQyEm6dMmbKwqKhozcDAwA04dPvg4GCMdiwvb1htfn5+DIdjqkU47sbFJ3CsFBcXqynE6ql3tbe376+pqTnU2NjYbTzUirBxgTJeMASCrDbLry8vL/8Uq7oIEJbj4Gw5KyehE4BwuqOj43mAaWJOHrVFg6sFAlERU61x6qGSkpL5kyZNug8QawBljmSpUL+GnoOM7ejs7NznOof/mE9mUzCUumkTU3ONHtU8AeGsrqysnMuqPQg9IAC88wrv/Tz/AicOnzt37iz8vVC4mjxmVHS2lFVXV8+/cOHCGoAW4LMUTZ52s9V+1d3d/SJ8rV6iIiXZmeOHR1fZgBEpYdVqEfkgqyMQ5vgVrQeUJ1mtQ4wdhxLPD9tSDKUtsk8rPEIGeusA5T2cOeuIvFWAPlfbj0U4AvA/OH/+/LOBZOkbMT8Yy7opw+zkL2R1vsCWeAuKl5WVxYmOgxySy+EpTNCgOSIZJRnZFM3TfJMTyQCQ2djwNc6nk9gQx4b4tGnTXsa+JRHT8NzgcXzNaDWnT59+Hc5v53QXAPGKior9rManET8lUCH+aE7Qn6tmMvk1gPIw1CBAsKsLUL6DwhKvVEBmuxiR3RKiUgb6G1HUrmiAWgnXL9GvfMFKThSasAxqi5gIeEC4ARB+Si0b49i8j+hZFsiKeIO+jJoGxGwEbpdwIkMR8WvCcGkg4XKDEKiOmnLS7I0RuWuUmwgU7G2kvTbizCJq3d5n9ecSDYe0Jdgeb4P6I4HQqwGEwBzXDEEpx/aXtG2IENn/NBwWyRFwiQISn+0QrCUajvpoOMHZcHPAmLGwYI6aYWjLcDNe8uxZ9Xj3t/lQTlT/CCD6BQqLuQPZZZBKWh9MyPWg+S9tDULtAPWC4flOwKUYGjp/KfOkTvzhfG9CxpVAdYVtci9+tHhAfk+ncheVCJBE4wTEAFQLEDvIHRbz7t7b1dX1AH0NkCZmmsiYE6P4WZ3FZJqzyEsGyEl0MC8hO+3n7nGEbTlI3pDHtjx69uzZZvSFxWQqb8g0wxQgLs8gOlbgkzLgSvzaRTa8nrEuyPGEYJijioiXMG4xicxOLldfgflNyMZppiySKbJER6+2OazIWhIl3VXmkyjd6bNUd0/RXUWkPsBxqTlzGsgoXyXEL+DAbhKpv9H3DmQlctI6UtSyR/YPECGrseE52hXofAG5n6OtrNjfmLyjrEotjNpTizHqL0TEBtpvQZkCEfIVA+rHcGQjoN6G3Ao5SjT0AcZ/IV28WgD7AEa1A0QePNIv3aXMmUGt+4hd3t6R8fD9rKen5zA2qdg2MOCHe8f+6+wj6lYi55dESDX2Pdra2voNprjjwQTO5KA8QAjrjJCyOi9TAtIVyTA5RazmeoDYozeQ5HHeNAP0TmrlJQuhtDIJ6VkA8wFkbCPd38vcfr0mqUVPIuMmyIpFoz2nqp1uIuQe5Aygp4OFWWETJCiGsVu8olMw2FsjrdFMNRBiOL4aEF5BkQBVanwC2hzIM51hbUCqdrYEtfGBx6SVyP8x8s/ITmS2o+OHRE4iKDZnrNp0xFi078tO6Dz0ETeBxgZ1okiH0se9FHurjCVU/Q4sDKsBgM3I6Fc0oOQk4G5mfEbCZHM8MihhPHwUj+Qn8r6LldwEII165WPzaXQp4qxEi2MdSWrjmVZVVfWibEbObx0fq+e2BwOPBRMTjQiGXNPAmsX8fZALYQQrsZkXMIsvXPVgKOOmbDEg3SSAvx1drylKpJvnrYE0czboGtU0nnIWcyWj+vUtpnC5E2Q+QXOS6xi9Gr47qkyQLkf1OhcwrAEZd0cc4wcgEDWiKd2mX6/gR6ABRTYR8gxjdZ473WKKzeT4KaMdTyfEbQ1AWIDz/5QRhOspDLo1MGKUkkhb7hqhjs+wuo3Yo7PkIAfvLV5NyDOWZvk7Yjtq0oiOMWba1riFaPqPX41d8C72/BpPB+YYorPqDp1dChh/lU0ctn9Amtka8mSlJNkkEzoL9A9pFVD6AoyW1tp4srkT2SfwTfcMDvJ6nSPUjwZKc7pAJkxnhDssAeQAyuq8Qrd1AuWZNM0JzZUzImubvkzkGE+Rb3wQ25oECAu2xfdlI8/kjqgjQaD9mJRwep+ibWfEpQARAjBCSZIHAyfSn4QnsUtzVD7LdhnSWwY77xnuckD7ZvIqE0ecMaCst823oVZS6LX8Oq0sVfNHXcToSyySoT2stFm5jKiEbx/vJmeoI/X+KFvuVg7hYs6iPOT3Ma4Lo13G5KS1aaYtryNniNR/OZw38sv5TuoOKCWwKQf9ZBlRChj/4JSeh+Gb+OV7G31yTganK3LE7g5Kwm7i7XMXBq4EiDu4fxTSjr6f8NzJHeQItW7Lu9GnC5q+ogl4A5PmmMX0FWHzLmQtZ+G+yS15KzNsLOnkTMHIZ9Uex/iSlpaWjUjS9w/NTbdakXJykXtZ8YcAdAUGOudx9AzPbVyaBunLA4AC+ipJsa+jlsFD9L0CWN/lxvuqOiiRzOHHpH8dj7Yy8n8CGE8x/4l0c9OBkVQTnZcCxEL27yZuiJ9XBFD+jYNPAe6Btra2BgDS9VnFbClmbBEArQefT1JPpe5n/hNct7fA1wJluj1hjelgFf8FPeS6mNGp5Eq5u7hx4J7kdNfttQdQ9NtIdaqJ4RgRsoizZBvh3qvDkPrPjE/1PE5HyJ+knYmtSaal75LgTIQ7HhxfxdlwXk4Ahn6UrQ1UyBGdOQrnZKTxSBeRshJ6AzAEyB7Ghu8Rw3N5TFkytTulkGwG5VgMgz8EEB0CAnqerslemJx0PP45XSVeA2Uhb4j9Pn/YS79F2KXIS6cvZ+Nm1HQOLpcWEx1/QroBoUjIpggM2xJLAPoYUaIIsRu2gZWN7Amb4wwmEh6SsQCi/7x5r9eWLRChsU4+kXEX1AwYfehY7RlsIUL+K9Y2Y2Zi5HEiQj/wPOytsVVNNE4rqnnJKJHXnp0s5G/x0fF3Bir84FUTIQ4MRYX2NG+AvRg4LYWR6QyXvGQ8Tg+/W9QB+mmBTn2/1+PGfDurKhfhK6OVGRaQR6wiMdO/Jv2ORKdNfVBiui6jXUZK7rCOHGIuv1CXkGQN8HyRiKrne4ayThXJDhM7zcsngXoTEJ4lX/k6Waq9WZKBJxkZl1yAYcqG8Aff8t7me8fPfWfoiLoMuBiv2+/B+1V1Aob7ZsKzHjvYAt/i/7Yep90JJQIiHmWwz1BVAfwxy1bdwFXyR989luLkEm9P4kpFzwLCvyK7aW8jGtZB9wOCvvS7n/BIuLaOIUfdkSzPc81Vbk/zBtiovU79Pzy4L9ELzoMNbAHlJ/r5/jY/nuw8ECBXNSgyeizD5Vc+Th6Ws9CX1UERv84W27L5gLBDbwtIPxmo2Njw0wT9TWb4eFTpgHOHYzIh/LdeDefCArZTF1fqPZ5Hq6tDVtdUOT3EebBd5wgH5Pt4FlAam/AoyDUY2Jy0OEd4C1RxC8XPfDlvusND1rU5R94QGBT9n5hlsHqe0GIGTagShDsnOSQbcLKHV3Apq29OauVVBJizh9flMkDTl/kz9HX5sRA0unJfLhcYzvKmpqYugNB9hZ1SpOu8PlrpRw7bAmrP5Oe6LwoM6I88q1xWO4dVTuxf5xAgvJ/Ds4mtoE+Cz/EqrTK1fN5cyvPLvGn0qbKe/lRZrE27ZmsHCInShwGkm2u+nD4GQNvJK/SbRw+kz4TH8XCF99Ki5pp1OpXhDhCcvhsw9hMhLZwlvVAn7WZep79h8uwrAcSVQl2A2Cu4lnYppNenPhGchnRYyrYJPzTREZX/AwdlnJJulTNcAAAAAElFTkSuQmCC) top center no-repeat; }',
            '.serv-curbside { width: 65px; height: 65px; display: inline-block; background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAABaCAQAAABKrS2DAAAACXBIWXMAABYlAAAWJQFJUiTwAAAFmmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE2LTAyLTE3VDA5OjMzOjQ0LTA1OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wNy0xMlQxNzowNjoxNC0wNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wNy0xMlQxNzowNjoxNC0wNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTNiZTY4ZmItODFjNy00ZWRj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) top center no-repeat; }'
        ];
        $('head').append($('<style>', { type: 'text/css' }).html(cssArray.join('\n')));
    }

    function onVenuesChanged(venueProxies) {
        logDev('onVenuesChanged');
        deleteDupeLabel();

        const venue = getSelectedVenue();
        if (venueProxies.map(proxy => proxy.attributes.id).includes(venue?.attributes.id)) {
            if ($('#WMEPH_banner').length) {
                const actions = W.model.actionManager.getActions();
                const lastAction = actions[actions.length - 1];
                if (lastAction?._venue?.attributes?.id === venue.attributes.id && lastAction._navigationPoint) {
                    harmonizePlaceGo(venue, 'harmonize');
                }
            }

            updateWmephPanel();
        }
    }

    // This should be called after new venues are saved (using venues'objectssynced' event), so the new IDs can be retrieved and used
    // to replace the temporary IDs in the whitelist.  If WME errors during save, this function may not run.  At that point, the
    // temporary IDs can no longer be traced to the new IDs so the WL for those new venues will be orphaned, and the temporary IDs
    // will be removed from the WL store the next time the script starts.
    function syncWL(newVenues) {
        newVenues.forEach(newVenue => {
            const oldID = newVenue._prevID;
            const newID = newVenue.attributes.id;
            if (oldID && newID && _venueWhitelist[oldID]) {
                _venueWhitelist[newID] = _venueWhitelist[oldID];
                delete _venueWhitelist[oldID];
            }
        });
        saveWhitelistToLS(true);
    }

    function toggleXrayMode(enable) {
        localStorage.setItem('WMEPH_xrayMode_enabled', $('#layer-switcher-item_wmeph_x-ray_mode').prop('checked'));

        const commentsLayer = W.map.getLayerByUniqueName('mapComments');
        const gisLayer = W.map.getLayerByUniqueName('__wmeGISLayers');
        const satLayer = W.map.getLayerByUniqueName('satellite_imagery');
        const roadLayer = W.map.roadLayers[0];
        const commentRuleSymb = commentsLayer.styleMap.styles.default.rules[0].symbolizer;
        if (enable) {
            _layer.styleMap.styles.default.rules = _layer.styleMap.styles.default.rules.filter(rule => rule.wmephDefault !== 'default');
            roadLayer.opacity = 0.25;
            satLayer.opacity = 0.25;
            commentRuleSymb.Polygon.strokeColor = '#888';
            commentRuleSymb.Polygon.fillOpacity = 0.2;
            if (gisLayer) gisLayer.setOpacity(0.4);
        } else {
            _layer.styleMap.styles.default.rules = _layer.styleMap.styles.default.rules.filter(rule => rule.wmephStyle !== 'xray');
            roadLayer.opacity = 1;
            satLayer.opacity = 1;
            commentRuleSymb.Polygon.strokeColor = '#fff';
            commentRuleSymb.Polygon.fillOpacity = 0.4;
            if (gisLayer) gisLayer.setOpacity(1);
            initializeHighlights();
            _layer.redraw();
        }
        commentsLayer.redraw();
        roadLayer.redraw();
        satLayer.redraw();
        if (!enable) return;

        const defaultPointRadius = 6;
        const ruleGenerator = (value, symbolizer) => new W.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: '==',
                value,
                evaluate(feature) {
                    const attr = feature.attributes.wazeFeature?._wmeObject?.attributes;
                    return attr?.wmephSeverity === this.value;
                }
            }),
            symbolizer,
            wmephStyle: 'xray'
        });

        const severity0 = ruleGenerator(0, {
            Point: {
                strokeWidth: 1.67,
                strokeColor: '#888',
                pointRadius: 5,
                fillOpacity: 0.25,
                fillColor: 'white',
                zIndex: 0
            },
            Polygon: {
                strokeWidth: 1.67,
                strokeColor: '#888',
                fillOpacity: 0
            }
        });

        const severityLock = ruleGenerator('lock', {
            Point: {
                strokeColor: 'white',
                fillColor: '#080',
                fillOpacity: 1,
                strokeLinecap: 1,
                strokeDashstyle: '4 2',
                strokeWidth: 2.5,
                pointRadius: defaultPointRadius
            },
            Polygon: {
                strokeColor: 'white',
                fillColor: '#0a0',
                fillOpacity: 0.4,
                strokeDashstyle: '4 2',
                strokeWidth: 2.5
            }
        });

        const severity1 = ruleGenerator(1, {
            strokeColor: 'white',
            strokeWidth: 2,
            pointRadius: defaultPointRadius,
            fillColor: '#0055ff'
        });

        const severityLock1 = ruleGenerator('lock1', {
            pointRadius: defaultPointRadius,
            fillColor: '#0055ff',
            strokeColor: 'white',
            strokeLinecap: '1',
            strokeDashstyle: '4 2',
            strokeWidth: 2.5
        });

        const severity2 = ruleGenerator(2, {
            Point: {
                fillColor: '#ca0',
                strokeColor: 'white',
                strokeWidth: 2,
                pointRadius: defaultPointRadius

            },
            Polygon: {
                fillColor: '#ff0',
                strokeColor: 'white',
                strokeWidth: 2,
                fillOpacity: 0.4
            }
        });

        const severity3 = ruleGenerator(3, {
            strokeColor: 'white',
            strokeWidth: 2,
            pointRadius: defaultPointRadius,
            fillColor: '#ff0000'
        });

        const severity4 = ruleGenerator(4, {
            fillColor: '#f42',
            strokeLinecap: 1,
            strokeWidth: 2,
            strokeDashstyle: '4 2'
        });

        const severityHigh = ruleGenerator(5, {
            fillColor: 'black',
            strokeColor: '#f4a',
            strokeLinecap: 1,
            strokeWidth: 4,
            strokeDashstyle: '4 2',
            pointRadius: defaultPointRadius
        });

        const severityAdLock = ruleGenerator('adLock', {
            pointRadius: 12,
            fillColor: 'yellow',
            fillOpacity: 0.4,
            strokeColor: '#000',
            strokeLinecap: 1,
            strokeWidth: 10,
            strokeDashstyle: '4 2'
        });

        _layer.styleMap.styles.default.rules.push(...[severity0, severityLock, severity1,
            severityLock1, severity2, severity3, severity4, severityHigh, severityAdLock]);

        _layer.redraw();
    }

    function initializeHighlights() {
        OpenLayers.Renderer.symbol.triangle = [0, -10, 10, 10, -10, 10, 0, -10]; // [0, 10, 10, -10, -10, -10, 0, 10];

        const ruleGenerator = (value, symbolizer) => new W.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: '==',
                value,
                evaluate(feature) {
                    const attr = feature.attributes.wazeFeature?._wmeObject?.attributes;
                    return attr?.wmephSeverity === this.value;
                }
            }),
            symbolizer,
            wmephStyle: 'default'
        });

        const rppRule = new W.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: '==',
                value: true,
                evaluate(feature) {
                    return feature.attributes.wazeFeature?._wmeObject.isResidential();
                }
            }),
            symbolizer: {
                graphicName: 'triangle',
                pointRadius: 7
            },
            wmephStyle: 'default'
        });

        const severity0 = ruleGenerator(0, {
            pointRadius: 5,
            externalGraphic: '',
            label: '',
            strokeWidth: 4,
            strokeColor: '#24ff14',
            fillColor: '#ba85bf'
        });

        const severityLock = ruleGenerator('lock', {
            pointRadius: 5,
            externalGraphic: '',
            label: '',
            strokeColor: '#24ff14',
            strokeLinecap: 1,
            strokeDashstyle: '7 2',
            strokeWidth: 5,
            fillColor: '#ba85bf'
        });

        const severity1 = ruleGenerator(1, {
            strokeColor: '#0055ff',
            strokeWidth: 4,
            externalGraphic: '',
            label: '',
            pointRadius: 7,
            fillColor: '#ba85bf'
        });

        const severityLock1 = ruleGenerator('lock1', {
            pointRadius: 5,
            strokeColor: '#0055ff',
            strokeLinecap: 1,
            strokeDashstyle: '7 2',
            externalGraphic: '',
            label: '',
            strokeWidth: 5,
            fillColor: '#ba85bf'
        });

        const severity2 = ruleGenerator(2, {
            strokeColor: '#ff0',
            strokeWidth: 6,
            externalGraphic: '',
            label: '',
            pointRadius: 8,
            fillColor: '#ba85bf'
        });

        const severity3 = ruleGenerator(3, {
            strokeColor: '#ff0000',
            strokeWidth: 4,
            externalGraphic: '',
            label: '',
            pointRadius: 8,
            fillColor: '#ba85bf'
        });

        const severity4 = ruleGenerator(4, {
            fillColor: 'black',
            fillOpacity: 0.35,
            strokeColor: '#f42',
            strokeLinecap: 1,
            strokeWidth: 13,
            externalGraphic: '',
            label: '',
            strokeDashstyle: '4 2'
        });

        const severityHigh = ruleGenerator(5, {
            pointRadius: 12,
            fillColor: 'black',
            fillOpacity: 0.4,
            strokeColor: '#f4a',
            strokeLinecap: 1,
            strokeWidth: 10,
            externalGraphic: '',
            label: '',
            strokeDashstyle: '4 2'
        });

        const severity6 = ruleGenerator(6, {
            strokeColor: '#f80',
            strokeWidth: 6,
            externalGraphic: '',
            label: '',
            pointRadius: 10,
            fillColor: '#ba85bf'
        });

        const severityAdLock = ruleGenerator('adLock', {
            pointRadius: 1,
            fillColor: 'yellow',
            fillOpacity: 0.4,
            strokeColor: '#000',
            strokeLinecap: 1,
            strokeWidth: 10,
            externalGraphic: '',
            label: '',
            strokeDashstyle: '4 2'
        });

        function plaTypeRuleGenerator(value, symbolizer) {
            return new W.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: '==',
                    value,
                    evaluate(feature) {
                        const attr = feature.attributes.wazeFeature?._wmeObject?.attributes;

                        if (attr
                            && $('#WMEPH-PLATypeFill').prop('checked')
                            && attr.categoryAttributes && attr.categoryAttributes.PARKING_LOT
                            && attr.categories.includes(CAT.PARKING_LOT)) {
                            const type = attr.categoryAttributes.PARKING_LOT.parkingType;
                            return (!type && this.value === 'public') || (type && (type.toLowerCase() === this.value));
                        }
                        return undefined;
                    }
                }),
                symbolizer,
                wmephStyle: 'default'
            });
        }

        const publicPLA = plaTypeRuleGenerator('public', {
            fillColor: '#0000FF',
            fillOpacity: '0.25'
        });
        const restrictedPLA = plaTypeRuleGenerator('restricted', {
            fillColor: '#FFFF00',
            fillOpacity: '0.3'
        });
        const privatePLA = plaTypeRuleGenerator('private', {
            fillColor: '#FF0000',
            fillOpacity: '0.25'
        });

        _layer.styleMap.styles.default.rules.push(...[severity0, severityLock, severity1, severityLock1, severity2,
            severity3, severity4, severity6, severityHigh, severityAdLock, rppRule, publicPLA, restrictedPLA, privatePLA]);
    }

    /**
    * To highlight a place, set the wmephSeverity attribute to the desired highlight level.
    * @param venues {array of venues, or single venue} Venues to check for highlights.
    * @param force {boolean} Force recalculation of highlights, rather than using cached results.
    */
    function applyHighlightsTest(venues, force) {
        logDev('applyHighlightsTest');
        if (!_layer) return;

        // Make sure venues is an array, or convert it to one if not.
        if (venues) {
            if (!Array.isArray(venues)) {
                venues = [venues];
            }
        } else {
            venues = [];
        }

        const storedBannServ = _servicesBanner;
        const storedBannButt2 = _buttonBanner2;
        const t0 = performance.now();
        const doHighlight = $('#WMEPH-ColorHighlighting').prop('checked');
        const disableRankHL = $('#WMEPH-DisableRankHL').prop('checked');

        venues.forEach(venue => {
            if (venue && venue.type === 'venue' && venue.attributes) {
                // Highlighting logic would go here
                // Severity can be: 0, 'lock', 1, 2, 3, 4, or 'high'. Set to
                // anything else to use default WME style.
                if (doHighlight && !(disableRankHL && venue.attributes.lockRank > USER.rank - 1)) {
                    try {
                        const { id } = venue.attributes;
                        let severity;
                        let cachedResult;
                        // eslint-disable-next-line no-cond-assign
                        if (force || !isNaN(id) || ((cachedResult = _resultsCache[id]) === undefined) || (venue.updatedOn > cachedResult.u)) {
                            severity = harmonizePlaceGo(venue, 'highlight');
                            if (isNaN(id)) _resultsCache[id] = { s: severity, u: venue.updatedOn || -1 };
                        } else {
                            severity = cachedResult.s;
                        }
                        venue.attributes.wmephSeverity = severity;
                    } catch (err) {
                        console.error('WMEPH highlight error: ', err);
                    }
                } else {
                    venue.attributes.wmephSeverity = 'default';
                }
            }
        });

        // Trim the cache if it's over the max size limit.
        const keys = Object.keys(_resultsCache);
        if (keys.length > MAX_CACHE_SIZE) {
            const trimSize = MAX_CACHE_SIZE * 0.8;
            for (let i = keys.length - 1; i > trimSize; i--) {
                delete _resultsCache[keys[i]];
            }
        }

        const venue = getSelectedVenue();
        if (venue) {
            venue.attributes.wmephSeverity = harmonizePlaceGo(venue, 'highlight');
            _servicesBanner = storedBannServ;
            _buttonBanner2 = storedBannButt2;
        }
        logDev(`Ran highlighter in ${Math.round((performance.now() - t0) * 10) / 10} milliseconds.`);
        logDev(`WMEPH cache size: ${Object.keys(_resultsCache).length}`);
    }

    // Set up CH loop
    function bootstrapWmephColorHighlights() {
        if (localStorage.getItem('WMEPH-ColorHighlighting') === '1') {
            // Add listeners
            W.model.venues.on('objectschanged', e => errorHandler(() => {
                if (!_disableHighlightTest) {
                    applyHighlightsTest(e, true);
                    _layer.redraw();
                }
            }));

            // 2023-03-30 - beforefeaturesadded no longer works because data model objects may be reloaded without re-adding map features.
            // The wmephSeverity property is stored in the venue data model object. One workaround to look into would be to
            // store the wmephSeverity in the feature.
            // W.map.venueLayer.events.register('beforefeaturesadded', null, e => errorHandler(() => applyHighlightsTest(e.features.map(f => f.model))));
            W.model.venues.on('objectsadded', venues => {
                applyHighlightsTest(venues);
                _layer.redraw();
            });

            // Clear the cache (highlight severities may need to be updated).
            _resultsCache = {};

            // Apply the colors
            applyHighlightsTest(W.model.venues.getObjectArray());
            _layer.redraw();
        } else {
            // reset the colors to default
            applyHighlightsTest(W.model.venues.getObjectArray());
            _layer.redraw();
        }
    }

    // Change place.name to title case
    function titleCase(str) {
        if (!str) {
            return str;
        }
        str = str.trim();
        const parensParts = str.match(/\(.*?\)/g);
        if (parensParts) {
            for (let i = 0; i < parensParts.length; i++) {
                str = str.replace(parensParts[i], `%${i}%`);
            }
        }

        // Get indexes of Mac followed by a cap, as in MacMillan.
        const macIndexes = [];
        const macRegex = /\bMac[A-Z]/g;
        let macMatch;
        // eslint-disable-next-line no-cond-assign
        while ((macMatch = macRegex.exec(str)) !== null) {
            macIndexes.push(macMatch.index);
        }

        const allCaps = (str === str.toUpperCase());
        // Cap first letter of each word
        str = str.replace(/([A-Za-z\u00C0-\u017F][^\s-/]*) */g, txt => {
            // If first letter is lower case, followed by a cap, then another lower case letter... ignore it.  Example: iPhone
            if (/^[a-z][A-Z0-9][a-z]/.test(txt)) {
                return txt;
            }
            // If word starts with De/Le/La followed by uppercase then lower case, is 5+ characters long... assume it should be like "DeBerry".
            if (/^([dDlL]e|[lL]a)[A-Z][a-zA-Z\u00C0-\u017F]{2,}/.test(txt)) {
                return txt.charAt(0).toUpperCase() + txt.charAt(1).toLowerCase() + txt.charAt(2) + txt.substr(3).toLowerCase();
            }
            return ((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
            // Cap O'Reilley's, L'Amour, D'Artagnan as long as 5+ letters
            .replace(/\b[oOlLdD]'[A-Za-z']{3,}/g, txt => (((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0).toUpperCase()
                + txt.charAt(1) + txt.charAt(2).toUpperCase() + txt.substr(3).toLowerCase()))
            // Cap McFarley's, as long as 5+ letters long
            .replace(/\b[mM][cC][A-Za-z']{3,}/g, txt => (((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0).toUpperCase()
                + txt.charAt(1).toLowerCase() + txt.charAt(2).toUpperCase() + txt.substr(3).toLowerCase()))
            // anything with an "&" sign, cap the word after &
            .replace(/&\w+/g, txt => (((txt === txt.toUpperCase()) && !allCaps) ? txt : txt.charAt(0) + txt.charAt(1).toUpperCase() + txt.substr(2)))
            // lowercase any from the ignoreWords list
            .replace(/[^ ]+/g, txt => {
                const txtLC = txt.toLowerCase();
                return (TITLECASE_SETTINGS.ignoreWords.includes(txtLC)) ? txtLC : txt;
            })
            // uppercase any from the capWords List
            .replace(/[^ ]+/g, txt => {
                const txtLC = txt.toUpperCase();
                return (TITLECASE_SETTINGS.capWords.includes(txtLC)) ? txtLC : txt;
            })
            // preserve any specific words
            .replace(/[^ ]+/g, txt => {
                const txtUC = txt.toUpperCase();
                return TITLECASE_SETTINGS.specWords.find(specWord => specWord.toUpperCase() === txtUC) || txt;
            })
            // Fix 1st, 2nd, 3rd, 4th, etc.
            .replace(/\b(\d*1)st\b/gi, '$1st')
            .replace(/\b(\d*2)nd\b/gi, '$1nd')
            .replace(/\b(\d*3)rd\b/gi, '$1rd')
            .replace(/\b(\d+)th\b/gi, '$1th');

        // Cap first letter of entire name if it's not something like iPhone or eWhatever.
        if (!/^[a-z][A-Z0-9][a-z]/.test(str)) str = str.charAt(0).toUpperCase() + str.substr(1);
        if (parensParts) {
            for (let i = 0, len = parensParts.length; i < len; i++) {
                str = str.replace(`%${i}%`, parensParts[i]);
            }
        }

        // Fix any Mac... words.
        macIndexes.forEach(idx => {
            str = str.substr(0, idx + 3) + str.substr(idx + 3, 1).toUpperCase() + str.substr(idx + 4);
        });

        return str;
    }

    // normalize phone
    function normalizePhone(s, outputFormat) {
        if (isNullOrWhitespace(s)) return s;
        s = s.replace(/(\d{3}.*[0-9A-Z]{4})\W+(?:extension|ext|xt|x).*/i, '$1');
        let s1 = s.replace(/\D/g, ''); // remove non-number characters

        // Ignore leading 1, and also don't allow area code or exchange to start with 0 or 1 (***USA/CAN specific)
        let m = s1.match(/^1?([2-9]\d{2})([2-9]\d{2})(\d{4})$/);

        if (!m) { // then try alphanumeric matching
            if (s) { s = s.toUpperCase(); }
            s1 = s.replace(/[^0-9A-Z]/g, '').replace(/^\D*(\d)/, '$1').replace(/^1?([2-9][0-9]{2}[0-9A-Z]{7,10})/g, '$1');
            s1 = replaceLetters(s1);

            // Ignore leading 1, and also don't allow area code or exchange to start with 0 or 1 (***USA/CAN specific)
            m = s1.match(/^([2-9]\d{2})([2-9]\d{2})(\d{4})(?:.{0,3})$/);

            if (!m) {
                return BAD_PHONE;
            }
        }
        return phoneFormat(outputFormat, m[1], m[2], m[3]);
    }

    // Alphanumeric phone conversion
    function replaceLetters(number) {
        const conversionMap = _({
            2: /A|B|C/,
            3: /D|E|F/,
            4: /G|H|I/,
            5: /J|K|L/,
            6: /M|N|O/,
            7: /P|Q|R|S/,
            8: /T|U|V/,
            9: /W|X|Y|Z/
        });
        number = typeof number === 'string' ? number.toUpperCase() : '';
        return number.replace(/[A-Z]/g, letter => conversionMap.findKey(re => re.test(letter)));
    }

    // Add array of actions to a MultiAction to be executed at once (counts as one edit for redo/undo purposes)
    function executeMultiAction(actions) {
        if (actions.length > 0) {
            W.model.actionManager.add(new MultiAction(actions));
        }
    }

    // Split localizer (suffix) part of names, like "SUBWAY - inside Walmart".
    function getNameParts(name) {
        const splits = name.match(/(.*?)(\s+[-(–].*)*$/);
        return { base: splits[1], suffix: splits[2] };
    }

    function addUpdateAction(venue, newAttributes, actions, runHarmonizer = false, dontHighlightFields = false) {
        if (Object.keys(newAttributes).length) {
            if (!dontHighlightFields) {
                UPDATED_FIELDS.checkNewAttributes(newAttributes, venue);
            }

            const action = new UpdateObject(venue, newAttributes);
            if (actions) {
                actions.push(action);
            } else {
                W.model.actionManager.add(action);
            }
        }
        if (runHarmonizer) setTimeout(() => harmonizePlaceGo(venue, 'harmonize'), 0);
    }

    function setServiceChecked(servBtn, checked, actions) {
        const servID = WME_SERVICES_ARRAY[servBtn.servIDIndex];
        const checkboxChecked = $(`wz-checkbox[value="${servID}"]`).prop('checked');
        const venue = getSelectedVenue();

        if (checkboxChecked !== checked) {
            UPDATED_FIELDS[`services_${servID}`].updated = true;
        }
        const toggle = typeof checked === 'undefined';
        let noAdd = false;
        checked = (toggle) ? !servBtn.checked : checked;
        if (checkboxChecked === servBtn.checked && checkboxChecked !== checked) {
            servBtn.checked = checked;
            let services;
            if (actions) {
                for (let i = 0; i < actions.length; i++) {
                    const existingAction = actions[i];
                    if (existingAction.newAttributes && existingAction.newAttributes.services) {
                        ({ services } = existingAction.newAttributes);
                    }
                }
            }
            if (!services) {
                services = venue.attributes.services.slice();
            } else {
                noAdd = services.includes(servID);
            }
            if (checked) {
                services.push(servID);
            } else {
                const index = services.indexOf(servID);
                if (index > -1) {
                    services.splice(index, 1);
                }
            }
            if (!noAdd) {
                addUpdateAction(venue, { services }, actions);
            }
        }
        updateServicesChecks(_servicesBanner);
        if (!toggle) servBtn.active = checked;
    }

    // Normalize url
    function normalizeURL(url, makeLowerCase = true) {
        if (!url?.trim().length) {
            return url;
        }

        url = url.replace(/ \(.*/g, ''); // remove anything with parentheses after it
        url = url.replace(/ /g, ''); // remove any spaces
        let m = url.match(/^http:\/\/(.*)$/i); // remove http://
        if (m) { [, url] = m; }
        if (makeLowerCase) { // lowercase the entire domain
            url = url.replace(/[^/]+/i, txt => ((txt === txt.toLowerCase()) ? txt : txt.toLowerCase()));
        } else { // lowercase only the www and com
            url = url.replace(/www\./i, 'www.');
            url = url.replace(/\.com/i, '.com');
        }
        m = url.match(/^(.*)\/pages\/welcome.aspx$/i); // remove unneeded terms
        if (m) { [, url] = m; }
        m = url.match(/^(.*)\/pages\/default.aspx$/i); // remove unneeded terms
        if (m) { [, url] = m; }
        // m = s.match(/^(.*)\/index.html$/i); // remove unneeded terms
        // if (m) { s = m[1]; }
        // m = s.match(/^(.*)\/index.htm$/i); // remove unneeded terms
        // if (m) { s = m[1]; }
        // m = s.match(/^(.*)\/index.php$/i); // remove unneeded terms
        // if (m) { s = m[1]; }
        m = url.match(/^(.*)\/$/i); // remove final slash
        if (m) { [, url] = m; }
        if (!url || url.trim().length === 0 || !/(^https?:\/\/)?\w+\.\w+/.test(url)) url = BAD_URL;
        return url;
    }

    // Only run the harmonization if a venue is selected
    function harmonizePlace() {
        logDev('harmonizePlace');
        // Beta version for approved users only
        if (IS_BETA_VERSION && !USER.isBetaUser) {
            WazeWrap.Alerts.error(SCRIPT_NAME, 'Please sign up to beta-test this script version.<br>Contact MapOMatic or Tonestertm in Discord, or post in the WMEPH forum thread. Thanks.');
            return;
        }
        // Only run if a single place is selected
        const venue = getSelectedVenue();
        if (venue) {
            UPDATED_FIELDS.reset();
            blurAll(); // focus away from current cursor position
            _disableHighlightTest = true;
            harmonizePlaceGo(venue, 'harmonize');
            _disableHighlightTest = false;
            applyHighlightsTest(venue);
        } else { // Remove duplicate labels
            destroyDupeLabels();
        }
    }

    // Abstract flag classes.  Must be declared outside the "Flag" namespace.
    class FlagBase {
        static defaultSeverity = SEVERITY.GREEN;
        static defaultMessage = '';
        static currentFlags;
        #severity;
        #message;
        #noLock;
        /** @type {HarmonizationArgs} */
        args;

        get name() { return this.constructor.name; }

        get severity() { return this.#severity ?? this.constructor.defaultSeverity; }
        set severity(value) { this.#severity = value; }

        get message() { return this.#message ?? this.constructor.defaultMessage; }
        set message(value) { this.#message = value; }

        get noLock() { return this.#noLock ?? this.severity > SEVERITY.BLUE; }
        set noLock(value) { this.#noLock = value; }

        constructor() {
            FlagBase.currentFlags.add(this);
        }

        /**
         *
         * @param {HarmonizationArgs} args
         * @returns
         */
        static eval(args) {
            if (this.venueIsFlaggable(args)) {
                const flag = new this(args);
                flag.args = args;
                return flag;
            }
            return null;
        }
    }
    class ActionFlag extends FlagBase {
        static defaultButtonTooltip = '';
        #buttonText;
        #buttonTooltip;

        get buttonText() { return this.#buttonText ?? this.constructor.defaultButtonText; }
        set buttonText(value) { this.#buttonText = value; }
        get buttonTooltip() { return this.#buttonTooltip ?? this.constructor.defaultButtonTooltip; }
        set buttonTooltip(value) { this.#buttonTooltip = value; }

        // 5/19/2019 (mapomatic) This base class action function doesn't seem to be necessary.
        // action() { } // overwrite this
    }
    class WLFlag extends FlagBase {
        static defaultWLTooltip = 'Whitelist this message';
        #showWL;

        get severity() { return this.constructor.isWhitelisted(this.args) ? SEVERITY.GREEN : super.severity; }
        set severity(value) { super.severity = value; }

        get showWL() { return this.#showWL ?? !this.constructor.isWhitelisted(this.args); }
        set showWL(value) { this.#showWL = value; }

        get wlTooltip() { return this.constructor.defaultWLTooltip; }

        WLaction() {
            const venue = getSelectedVenue();
            if (whitelistAction(venue.attributes.id, this.constructor.WL_KEY)) {
                harmonizePlaceGo(venue, 'harmonize');
            }
        }

        /**
         *
         * @param {HarmonizationArgs} args
         * @returns
         */
        static isWhitelisted(args) {
            return !!args.wl[this.WL_KEY];
        }
    }
    class WLActionFlag extends WLFlag {
        static defaultButtonTooltip = '';
        #buttonText;
        #buttonTooltip;

        get buttonText() { return this.#buttonText ?? this.constructor.defaultButtonText; }
        set buttonText(value) { this.#buttonText = value; }

        get buttonTooltip() { return this.#buttonTooltip ?? this.constructor.defaultButtonTooltip; }
        set buttonTooltip(value) { this.#buttonTooltip = value; }
    }

    /** Namespace to keep flags grouped. */
    const Flag = {
        // 2020-10-5 Disabling HN validity checks for now. See note on HnNonStandard flag for details.
        // HnDashRemoved: class extends FlagBase {
        //     constructor() { super(SEVERITY.GREEN, 'Dash removed from house number. Verify'); }
        // },
        ChainIsClosed: class extends WLFlag {
            static defaultSeverity = SEVERITY.ORANGE;
            static WL_KEY = 'chainIsClosed';

            /**
             *
             * @param {HarmonizationArgs} args
             * @returns
             */
            static venueIsFlaggable(args) {
                return args.chainIsClosed;
            }

            get message() {
                const pnhName = this.args.pnhMatch.name;
                return `Place matched to PNH entry "${pnhName}", which is no longer in business.<br/><br/>`
                + 'Follow the <a target="_blank" href="https://www.waze.com/wiki/USA/Places#Closed">wiki instructions</a> for closed places.';
            }
        },
        FullAddressInference: class extends FlagBase {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Missing address was inferred from nearby segments. Verify the address and run WMEPH again.';

            constructor(inferredAddress) {
                super();
                this.inferredAddress = inferredAddress;
            }

            static eval(args) {
                let result = null;
                if (!args.highlightOnly) {
                    if (!args.addr.state || !args.addr.country) {
                        if (W.map.getZoom() < 4) {
                            if ($('#WMEPH-EnableIAZoom').prop('checked')) {
                                W.map.moveTo(getVenueLonLat(args.venue), 5);
                            } else {
                                WazeWrap.Alerts.error(SCRIPT_NAME, 'No address and the state cannot be determined. Please zoom in and rerun the script. '
                                    + 'You can enable autozoom for this type of case in the options.');
                            }
                            result = { exit: true }; // Don't bother returning a Flag. This will exit the rest of the harmonizePlaceGo function.
                        } else {
                            let inferredAddress = inferAddress(args.venue, 7); // Pull address info from nearby segments
                            inferredAddress = inferredAddress.attributes ?? inferredAddress;

                            if (inferredAddress?.state && inferredAddress.country) {
                                if ($('#WMEPH-AddAddresses').prop('checked')) { // update the venue's address if option is enabled
                                    updateAddress(args.venue, inferredAddress, args.actions);
                                    UPDATED_FIELDS.address.updated = true;
                                    result = new this(inferredAddress);
                                } else if (![CAT.JUNCTION_INTERCHANGE].includes(args.categories[0])) {
                                    new Flag.CityMissing(args);
                                }
                            } else { //  if the inference doesn't work...
                                WazeWrap.Alerts.error(SCRIPT_NAME, 'This place has no address data and the address cannot be inferred from nearby segments. Please edit the address and run WMEPH again.');
                                result = { exit: true }; // Don't bother returning a Flag. This will exit the rest of the harmonizePlaceGo function.
                            }
                        }
                    }
                } else if (!args.addr.state || !args.addr.country) { // only highlighting
                    result = { exit: true };
                    if (args.venue.attributes.adLocked) {
                        result.severity = 'adLock';
                    } else {
                        const cat = args.venue.attributes.categories;
                        if (containsAny(cat, [CAT.HOSPITAL_MEDICAL_CARE, CAT.HOSPITAL_URGENT_CARE, CAT.GAS_STATION])) {
                            logDev('Unaddressed HUC/GS');
                            result.severity = SEVERITY.PINK;
                        } else if (cat.includes(CAT.JUNCTION_INTERCHANGE)) {
                            result.severity = SEVERITY.GREEN;
                        } else {
                            result.severity = SEVERITY.RED;
                        }
                    }
                }
                return result;
            }
        },
        NameMissing: class extends FlagBase {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Name is missing.';

            static venueIsFlaggable(args) {
                return !args.categories.includes(CAT.RESIDENCE_HOME)
                    && (!args.nameBase?.replace(/[^A-Za-z0-9]/g, ''))
                    && ![CAT.ISLAND, CAT.FOREST_GROVE, CAT.SEA_LAKE_POOL, CAT.RIVER_STREAM, CAT.CANAL, CAT.PARKING_LOT].includes(args.categories[0])
                    && !(args.categories.includes(CAT.GAS_STATION) && args.brand);
            }
        },
        GasNameMissing: class extends ActionFlag {
            static defaultSeverity = SEVERITY.RED;
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Use gas brand as station name';

            get message() { return `Name is missing. Use "${this.args.brand}"?`; }

            static venueIsFlaggable(args) {
                return args.categories.includes(CAT.GAS_STATION)
                    && isNullOrWhitespace(args.nameBase)
                    && !isNullOrWhitespace(args.brand);
            }

            action() {
                addUpdateAction(this.args.venue, { name: this.args.brand }, null, true);
            }
        },
        ClearThisUrl: class extends FlagBase {
            static defaultSeverity = SEVERITY.YELLOW;

            // Use this to highlight yellow any venues that have an invalid value and will be
            // auto-corrected when WMEPH is run.
            static venueIsFlaggable(args) {
                return args.categories.includes(CAT.CHARGING_STATION)
                    && args.url
                    && ['https://www.nissan-europe.com/', 'https://www.eco-movement.com/'].includes(args.url);
            }
        },
        ClearThisPhone: class extends FlagBase {
            static defaultSeverity = SEVERITY.YELLOW;

            // Use this to highlight yellow any venues that have an invalid value and will be
            // auto-corrected when WMEPH is run.
            static venueIsFlaggable(args) {
                return args.categories.includes(CAT.CHARGING_STATION)
                    && args.phone === '+33-1-72676914'; // Nissan Europe ph#
            }
        },
        PlaIsPublic: class extends FlagBase {
            static get defaultMessage() {
                // Add the buttons to the message.
                let msg = 'If this does not meet the requirements for a <a href="https://wazeopedia.waze.com/wiki/USA/Places/Parking_lot#Lot_Type" '
                    + 'target="_blank" style="color:5a5a73">public parking lot</a>, change to:<br>';
                msg += [
                    ['RESTRICTED', 'Restricted'],
                    ['PRIVATE', 'Private']
                ].map(
                    btnInfo => $('<button>', { class: 'wmeph-pla-lot-type-btn btn btn-default btn-xs wmeph-btn', 'data-lot-type': btnInfo[0] })
                        .text(btnInfo[1])
                        .prop('outerHTML')
                ).join('');
                return msg;
            }

            static venueIsFlaggable(args) {
                return args.categories.includes(CAT.PARKING_LOT)
                    && args.venue.attributes.categoryAttributes?.PARKING_LOT?.parkingType === 'PUBLIC';
            }

            postProcess() {
                $('.wmeph-pla-lot-type-btn').click(evt => {
                    const lotType = $(evt.currentTarget).data('lot-type');
                    const categoryAttrClone = JSON.parse(JSON.stringify(this.args.venue.attributes.categoryAttributes));
                    categoryAttrClone.PARKING_LOT.parkingType = lotType;
                    UPDATED_FIELDS.lotType.updated = true;
                    addUpdateAction(this.args.venue, { categoryAttributes: categoryAttrClone }, null, true);
                });
            }
        },
        PlaNameMissing: class extends FlagBase {
            static defaultSeverity = SEVERITY.BLUE;
            static get defaultMessage() { return `Name is missing. ${USER.rank < 3 ? 'Request an R3+ lock' : 'Lock to 3+'} to confirm unnamed parking lot.`; }
            noLock = true;

            static venueIsFlaggable(args) {
                return args.categories.includes(CAT.PARKING_LOT)
                    && (!args.nameBase?.replace(/[^A-Za-z0-9]/g, '').length)
                    && args.venue.attributes.lockRank < 2;
            }
        },
        PlaNameNonStandard: class extends WLFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Parking lot names typically contain words like "Parking", "Lot", and/or "Garage"';
            static WL_KEY = 'plaNameNonStandard';
            static defaultWLTooltip = 'Whitelist non-standard PLA name';

            static venueIsFlaggable(args) {
                if (!this.isWhitelisted(args) && args.venue.isParkingLot()) {
                    const name = args.venue.getName();
                    if (name) {
                        const state = args.venue.getAddress().getStateName();
                        const re = state === 'Quebec' ? /\b(parking|stationnement)\b/i : /\b((park[ -](and|&|'?n'?)[ -]ride)|parking|lot|garage|ramp)\b/i;
                        if (!re.test(name)) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        IndianaLiquorStoreHours: class extends WLFlag {
            static defaultMessage = 'If this is a liquor store, check the hours. As of Feb 2018, liquor stores in Indiana are allowed '
                + 'to be open between noon and 8 pm on Sunday.';

            static WL_KEY = 'indianaLiquorStoreHours';
            static defaultWLTooltip = 'Whitelist Indiana liquor store hours';

            static venueIsFlaggable(args) {
                return !args.highlightOnly && !this.isWhitelisted(args)
                    && !args.categories.includes(CAT.RESIDENCE_HOME)
                    && args.addr?.state.getName() === 'Indiana'
                    && /\b(beers?|wines?|liquors?|spirits)\b/i.test(args.nameBase)
                    && !args.openingHours.some(entry => entry.days.includes(0));
            }
        },
        HoursOverlap: class extends FlagBase {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Overlapping hours of operation. Place might not save.';

            static venueIsFlaggable(args) {
                return args.hoursOverlap;
            }
        },
        UnmappedRegion: class extends WLFlag {
            static WL_KEY = 'unmappedRegion';
            static defaultWLTooltip = 'Whitelist unmapped category';
            static #regionsToFlagOther = ['HI', 'NER', 'NOR', 'NWR', 'PLN', 'ATR'];

            get noLock() {
                return Flag.UnmappedRegion.#getRareCategoryInfos(this.args)
                    .some(categoryInfo => (categoryInfo.id === CAT.OTHER
                        && Flag.UnmappedRegion.#regionsToFlagOther.includes(this.args.regionCode)
                        && !this.args.isLocked)
                            || !Flag.UnmappedRegion.isWhitelisted(this.args));
            }

            constructor(args) {
                let showWL = true;
                let severity = SEVERITY.GREEN;
                // let noLock = false;
                let message;
                const categoryNames = [];
                let addOtherMessage = false;

                Flag.UnmappedRegion.#getRareCategoryInfos(args)
                    .forEach(categoryInfo => {
                        if (categoryInfo.id === CAT.OTHER) {
                            if (Flag.UnmappedRegion.#regionsToFlagOther.includes(args.region) && !args.isLocked) {
                                addOtherMessage = true;
                                severity = Math.max(severity, SEVERITY.BLUE);
                                showWL = false;
                                // noLock = true;
                            }
                        } else {
                            if (Flag.UnmappedRegion.isWhitelisted(args)) {
                                showWL = false;
                                severity = Math.max(severity, SEVERITY.GREEN);
                            } else {
                                severity = SEVERITY.YELLOW;
                                // noLock = true;
                            }
                            if (!args.highlightOnly) categoryNames.push(categoryInfo.name);
                        }
                    });
                if (!args.highlightOnly) {
                    const messages = [];
                    if (categoryNames.length === 1) {
                        messages.push(`The <b>${categoryNames[0]}</b> category is usually not mapped in this region.`);
                    } else if (categoryNames.length > 1) {
                        messages.push(`These categories are usually not mapped in this region: ${categoryNames.map(name => `<b>${name}</b>`).join(', ')}`);
                    }
                    if (addOtherMessage) {
                        messages.push('The <b>Other</b> category should only be used if no other category applies. '
                            + 'Manually lock the place to override this flag.');
                    }
                    message = messages.join('<br><br>');
                }
                super();
                this.message = message;
                this.severity = severity;
                // this.noLock = noLock;
                this.showWL = showWL;
            }

            static venueIsFlaggable(args) {
                return !args.categories.includes(CAT.REST_AREAS)
                    && !!this.#getRareCategoryInfos(args).length;
            }

            static #getRareCategoryInfos(args) {
                return args.categories
                    .map(cat => args.pnhCategoryInfos.getById(cat))
                    .filter(pnhCategoryInfo => {
                        const rareLocalities = pnhCategoryInfo.rare;
                        if (rareLocalities.includes(args.state2L) || rareLocalities.includes(args.region) || rareLocalities.includes(args.countryCode)) {
                            if (pnhCategoryInfo.id === CAT.OTHER && this.#regionsToFlagOther.includes(args.region)) {
                                if (!args.isLocked) {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                        return false;
                    });
            }
        },
        RestAreaName: class extends WLFlag {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Rest area name is out of spec. Use the Rest Area wiki button below to view formats.';
            static WL_KEY = 'restAreaName';
            static defaultWLTooltip = 'Whitelist rest area name';

            static venueIsFlaggable(args) {
                return args.countryCode === PNH_DATA.USA.countryCode && args.categories.includes(CAT.REST_AREAS)
                    && !/^Rest Area.* - /.test(args.nameBase + (args.nameSuffix ?? ''));
            }
        },
        RestAreaNoTransportation: class extends ActionFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Rest areas should not use the Transportation category.';
            static defaultButtonText = 'Remove it?';

            static venueIsFlaggable(args) {
                return args.categories.includes(CAT.REST_AREAS)
                    && args.categories.includes(CAT.TRANSPORTATION);
            }

            action() {
                const categories = this.args.venue.getCategories().slice(); // create a copy
                const index = categories.indexOf(CAT.TRANSPORTATION);
                if (index > -1) {
                    categories.splice(index, 1); // remove the category
                    addUpdateAction(this.args.venue, { categories }, null, true);
                } else {
                    harmonizePlaceGo(this.args.venue, 'harmonize');
                }
            }
        },
        RestAreaGas: class extends FlagBase {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Gas stations at Rest Areas should be separate area places.';

            static venueIsFlaggable(args) {
                return args.categories.includes(CAT.REST_AREAS) && args.categories.includes(CAT.GAS_STATION);
            }
        },
        RestAreaScenic: class extends WLActionFlag {
            static WL_KEY = 'restAreaScenic';
            static defaultWLTooltip = 'Whitelist place';
            static defaultMessage = 'Verify that the "Scenic Overlook" category is appropriate for this rest area. If not: ';
            static defaultButtonText = 'Remove it';
            static defaultButtonTooltip = 'Remove "Scenic Overlook" category.';

            static venueIsFlaggable(args) {
                return !this.isWhitelisted(args)
                    && args.categories.includes(CAT.REST_AREAS)
                    && args.categories.includes(CAT.SCENIC_LOOKOUT_VIEWPOINT);
            }

            action() {
                const categories = this.args.venue.getCategories().slice(); // create a copy
                const index = categories.indexOf(CAT.SCENIC_LOOKOUT_VIEWPOINT);
                if (index > -1) {
                    categories.splice(index, 1); // remove the category
                    addUpdateAction(this.args.venue, { categories }, null, true);
                }
            }
        },
        RestAreaSpec: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.RED;
            static WL_KEY = 'restAreaSpec';
            static defaultWLTooltip = 'Whitelist place';
            static defaultMessage = 'Is this a rest area?';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Update with proper categories and services.';

            static venueIsFlaggable(args) {
                return !this.isWhitelisted(args)
                    && !args.categories.includes(CAT.REST_AREAS)
                    && (/rest (?:area|stop)|service plaza/i.test(args.nameBase));
            }

            action() {
                const categories = insertAtIndex(this.args.venue.getCategories(), CAT.REST_AREAS, 0);
                // make it 24/7
                const openingHours = [new OpeningHour({ days: [1, 2, 3, 4, 5, 6, 0], fromHour: '00:00', toHour: '00:00' })];
                addUpdateAction(this.args.venue, { categories, openingHours }, null, true);
            }
        },
        EVChargingStationWarning: class extends FlagBase {
            static defaultMessage = 'Please do not delete EV Charging Stations. Be sure you are completely up to date with the latest guidelines in '
                + '<a href="https://wazeopedia.waze.com/wiki/USA/Places/EV_charging_station" target="_blank">wazeopedia</a>.';

            static venueIsFlaggable(args) {
                return !args.highlightOnly && args.categories.includes(CAT.CHARGING_STATION);
            }
        },
        EVCSAltNameMissing: class extends ActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'Public and restricted EV charging stations should have an alternate name of "EV Charging Station"';
            static defaultButtonText = 'Add it';
            static defaultButtonTooltip = 'Add EVCS alternate name';

            static venueIsFlaggable(args) {
                const evcsAttr = args.venue.attributes.categoryAttributes?.CHARGING_STATION;
                return evcsAttr && args.categories.includes(CAT.CHARGING_STATION)
                    && !args.aliases.some(alias => alias.toLowerCase() === 'ev charging station')
                    && evcsAttr.accessType !== 'PRIVATE'
                    && !args.venue.getName().toLowerCase().includes('(private)');
            }

            action() {
                let aliases = this.args.venue.attributes.aliases.slice();
                aliases = insertAtIndex(aliases, 'EV Charging Station', 0);
                addUpdateAction(this.args.venue, { aliases }, null);
            }
        },
        EVCSPriceMissing: class extends FlagBase {
            static defaultSeverity = SEVERITY.BLUE;
            static get defaultMessage() {
                let msg = 'EVCS price: ';
                [['FREE', 'Free', 'Free'], ['FEE', 'Paid', 'Paid']].forEach(btnInfo => {
                    msg += $('<button>', {
                        id: `wmeph_${btnInfo[0]}`,
                        class: 'wmeph-evcs-cost-type-btn btn btn-default btn-xs wmeph-btn',
                        title: btnInfo[2]
                    })
                        .text(btnInfo[1])
                        .css({
                            padding: '3px',
                            height: '20px',
                            lineHeight: '0px',
                            marginRight: '2px',
                            marginBottom: '1px',
                            minWidth: '18px'
                        })
                        .prop('outerHTML');
                });
                return msg;
            }

            constructor() {
                super();
                this.noLock = true;
            }

            static venueIsFlaggable(args) {
                const evcsAttr = args.venue.attributes.categoryAttributes?.CHARGING_STATION;
                return args.categories.includes(CAT.CHARGING_STATION)
                    && (!evcsAttr?.costType || evcsAttr.costType === 'COST_TYPE_UNSPECIFIED');
            }

            postProcess() {
                $('.wmeph-evcs-cost-type-btn').click(evt => {
                    const selectedValue = $(evt.currentTarget).attr('id').replace('wmeph_', '');
                    let attrClone;
                    if (this.args.venue.attributes.categoryAttributes) {
                        attrClone = JSON.parse(JSON.stringify(this.args.venue.attributes.categoryAttributes));
                    } else {
                        attrClone = {};
                    }
                    attrClone.CHARGING_STATION ??= {};
                    attrClone.CHARGING_STATION.costType = selectedValue;
                    addUpdateAction(this.args.venue, { categoryAttributes: attrClone }, null, true);
                    UPDATED_FIELDS.evCostType.updated = true;
                });
            }
        },
        GasMismatch: class extends WLFlag {
            static defaultSeverity = SEVERITY.RED;
            static WL_KEY = 'gasMismatch';
            static defaultWLTooltip = 'Whitelist gas brand / name mismatch';
            static defaultMessage = '<a href="https://wazeopedia.waze.com/wiki/USA/Places/Gas_station#Name" target="_blank" class="red">'
                + 'Gas brand should typically be included in the place name.</a>';

            static venueIsFlaggable(args) {
                // For gas stations, check to make sure brand exists somewhere in the place name.
                // Remove non - alphanumeric characters first, for more relaxed matching.
                if (args.categories[0] === CAT.GAS_STATION && args.brand) {
                    const compressedName = (args.nameBase + args.nameSuffix ?? '').toUpperCase().replace(/[^a-zA-Z0-9]/g, '');
                    // Some brands may have more than one acceptable name, or the brand listed in WME doesn't match what we want to see in the name.
                    // Ideally, this would be addressed in the PNH spreadsheet somehow, but for now hardcoding is the only option.
                    const compressedBrands = [args.brand.toUpperCase().replace(/[^a-zA-Z0-9]/g, '')];
                    if (args.brand === 'Diamond Gasoline') {
                        compressedBrands.push('DIAMONDOIL');
                    } else if (args.brand === 'Murphy USA') {
                        compressedBrands.push('MURPHY');
                    } else if (args.brand === 'Mercury Fuel') {
                        compressedBrands.push('MERCURY', 'MERCURYPRICECUTTER');
                    } else if (args.brand === 'Carrollfuel') {
                        compressedBrands.push('CARROLLMOTORFUEL', 'CARROLLMOTORFUELS');
                    }
                    if (!compressedBrands.some(compressedBrand => compressedName.includes(compressedBrand))) {
                        return true;
                    }
                }
                return false;
            }
        },
        GasUnbranded: class extends FlagBase {
            //  Unbranded is not used per wiki
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = '"Unbranded" should not be used for the station brand. Change to the correct brand or delete the brand.';

            static venueIsFlaggable(args) {
                return args.categories.includes(CAT.GAS_STATION)
                    && args.brand === 'Unbranded';
            }
        },
        GasMkPrim: class extends ActionFlag {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Gas Station should be the primary category';
            static defaultButtonText = 'Fix';
            static defaultButtonTooltip = 'Make the Gas Station category the primary category.';

            static venueIsFlaggable(args) {
                return args.categories.indexOf(CAT.GAS_STATION) > 0;
            }

            action() {
                // Move Gas category to the first position
                const categories = insertAtIndex(this.args.venue.getCategories(), CAT.GAS_STATION, 0);
                addUpdateAction(this.args.venue, { categories }, null, true);
            }
        },
        IsThisAPilotTravelCenter: class extends ActionFlag {
            static defaultMessage = 'Is this a "Travel Center"?';
            static defaultButtonText = 'Yes';

            static venueIsFlaggable(args) {
                return !args.highlightOnly
                    && args.state2L === 'TN'
                    && args.nameBase.toLowerCase().trim() === 'pilot food mart';
            }

            action() {
                addUpdateAction(this.args.venue, { name: 'Pilot Travel Center' }, null, true);
            }
        },
        HotelMkPrim: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Hotel category is not first';
            static defaultButtonText = 'Fix';
            static defaultButtonTooltip = 'Make the Hotel category the primary category.';
            static WL_KEY = 'hotelMkPrim';
            static defaultWLTooltip = 'Whitelist hotel as secondary category';

            static venueIsFlaggable(args) {
                return args.priPNHPlaceCat === CAT.HOTEL
                    && args.categories.indexOf(CAT.HOTEL) !== 0;
            }

            action() {
                // Insert/move Hotel category in the first position
                const categories = insertAtIndex(this.args.venue.attributes.categories.slice(), CAT.HOTEL, 0);
                addUpdateAction(this.args.venue, { categories }, null, true);
            }
        },
        ChangeToPetVet: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Key words suggest this should be a Pet/Veterinarian category. Change?';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Change to Pet/Veterinarian Category';
            static WL_KEY = 'changeHMC2PetVet';
            static defaultWLTooltip = 'Whitelist Pet/Vet category';

            static venueIsFlaggable(args) {
                if (!this.isWhitelisted(args)) {
                    const testName = name.toLowerCase().replace(/[^a-z]/g, ' ');
                    const testNameWords = testName.split(' ');
                    if ((args.categories.includes(CAT.HOSPITAL_URGENT_CARE) || args.categories.includes(CAT.DOCTOR_CLINIC))
                        && (containsAny(testNameWords, Pnh.ANIMAL_FULL_MATCH) || Pnh.ANIMAL_PART_MATCH.some(match => testName.includes(match)))) {
                        return true;
                    }
                }
                return false;
            }

            action() {
                let updated = false;
                let categories = uniq(this.args.venue.attributes.categories.slice());
                categories.forEach((cat, idx) => {
                    if (cat === CAT.HOSPITAL_URGENT_CARE || cat === CAT.DOCTOR_CLINIC) {
                        categories[idx] = CAT.PET_STORE_VETERINARIAN_SERVICES;
                        updated = true;
                    }
                });
                if (updated) {
                    categories = uniq(categories);
                }
                addUpdateAction(this.args.venue, { categories }, null, true);
            }
        },
        NotASchool: class extends WLFlag {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Key words suggest this should not be School category.';
            static WL_KEY = 'changeSchool2Offices';
            static defaultWLTooltip = 'Whitelist School category';

            static venueIsFlaggable(args) {
                if (!this.isWhitelisted(args)) {
                    const testName = args.nameBase.toLowerCase().replace(/[^a-z]/g, ' ');
                    const testNameWords = testName.split(' ');

                    if (args.categories.includes(CAT.SCHOOL)
                        && (containsAny(testNameWords, Pnh.SCHOOL_FULL_MATCH) || Pnh.SCHOOL_PART_MATCH.some(match => testName.includes(match)))) {
                        return true;
                    }
                }
                return false;
            }
        },
        PointNotArea: class extends WLActionFlag {
            static defaultButtonText = 'Change to point';
            static defaultButtonTooltip = 'Change to Point Place';
            static WL_KEY = 'pointNotArea';
            static defaultWLTooltip = 'Whitelist point (not area)';

            get message() {
                if (this.args.maxAreaSeverity === SEVERITY.RED) {
                    return 'This category should be a point place.';
                }
                return 'This category is usually a point place, but can be an area in some cases. Verify if area is appropriate.';
            }

            constructor(args) {
                let severity;
                let showWL = true;

                const makeGreen = Flag.PointNotArea.isWhitelisted(args)
                    || args.venue.attributes.lockRank >= args.defaultLockLevel;

                if (makeGreen) {
                    showWL = false;
                    severity = SEVERITY.GREEN;
                } else {
                    severity = args.maxAreaSeverity;
                }

                super();
                this.showWL = showWL;
                this.severity = severity;
            }

            static venueIsFlaggable(args) {
                return !args.venue.isPoint()
                    && (args.categories.includes(CAT.RESIDENCE_HOME) || (args.maxAreaSeverity > SEVERITY.BLUE && !args.categories.includes(CAT.REST_AREAS)));
            }

            action() {
                if (this.args.venue.isResidential()) {
                    // 7/1/2022 - Not sure if this is necessary? Can residence be converted to area? Either way, updateFeatureGeometry function no longer works.
                    // const centroid = venue.geometry.getCentroid();
                    // updateFeatureGeometry(venue, new OpenLayers.Geometry.Point(centroid.x, centroid.y));
                } else {
                    $('wz-checkable-chip.geometry-type-control-point').click();
                }
                harmonizePlaceGo(this.args.venue, 'harmonize'); // Rerun the script to update fields and lock
            }
        },
        AreaNotPoint: class extends WLActionFlag {
            static defaultButtonText = 'Change to area';
            static defaultButtonTooltip = 'Change to Area Place';
            static WL_KEY = 'areaNotPoint';
            static defaultWLTooltip = 'Whitelist area (not point)';
            static #collegeAbbrRegExps;

            get message() {
                if (this.args.maxPointSeverity === SEVERITY.RED) {
                    return 'This category should be an area place.';
                }
                return 'This category is usually an area place, but can be a point in some cases. Verify if point is appropriate.';
            }

            constructor(args) {
                let severity;
                let showWL = true;

                const makeGreen = Flag.AreaNotPoint.isWhitelisted(args)
                    || args.venue.attributes.lockRank >= args.defaultLockLevel
                    || (args.maxPointSeverity === SEVERITY.BLUE && Flag.AreaNotPoint.#hasCollegeInName(args.nameBase));

                if (makeGreen) {
                    showWL = false;
                    severity = SEVERITY.GREEN;
                } else {
                    severity = args.maxPointSeverity;
                }

                super();
                this.severity = severity;
                this.showWL = showWL;
            }

            static venueIsFlaggable(args) {
                return args.venue.isPoint()
                    && (args.maxPointSeverity > SEVERITY.GREEN || args.categories.includes(CAT.REST_AREAS));
            }

            static #hasCollegeInName(name) {
                if (!this.#collegeAbbrRegExps) {
                    this.#collegeAbbrRegExps = COLLEGE_ABBREVIATIONS.map(abbr => new RegExp(`\\b${abbr}\\b`, 'g'));
                }
                return this.#collegeAbbrRegExps.some(re => re.test(name));
            }

            action() {
                const { venue } = this.args;
                W.model.actionManager.add(new UpdateFeatureGeometry(venue, venue.model.venues, venue.getOLGeometry(), venue.getPolygonGeometry()));
                harmonizePlaceGo(venue, 'harmonize');
            }
        },
        HnMissing: class extends WLActionFlag {
            static defaultButtonText = 'Add';
            static defaultButtonTooltip = 'Add HN to place';
            static WL_KEY = 'HNWL';
            static defaultWLTooltip = 'Whitelist empty HN';
            static #CATEGORIES_TO_IGNORE = [CAT.BRIDGE, CAT.ISLAND, CAT.FOREST_GROVE, CAT.SEA_LAKE_POOL, CAT.RIVER_STREAM, CAT.CANAL,
                CAT.DAM, CAT.TUNNEL, CAT.JUNCTION_INTERCHANGE];

            static #TEXTBOX_ID = 'WMEPH-HNAdd';
            noBannerAssemble = true;

            get message() {
                let msg = `No HN: <input type="text" id="${Flag.HnMissing.#TEXTBOX_ID}" autocomplete="off" `
                + 'style="font-size:0.85em;width:100px;padding-left:2px;color:#000;" > ';

                if (this.args.categories.includes(CAT.PARKING_LOT) && this.args.venue.attributes.lockRank < 2) {
                    if (USER.rank < 3) {
                        msg += 'Request an R3+ lock to confirm no HN.';
                    } else {
                        msg += 'Lock to R3+ to confirm no HN.';
                    }
                }
                return msg;
            }

            constructor(args) {
                let showWL = true;
                let severity = SEVERITY.RED;
                let noLock = false;
                if (args.state2L === 'PR' || args.categories[0] === CAT.SCENIC_LOOKOUT_VIEWPOINT) {
                    severity = SEVERITY.GREEN;
                    showWL = false;
                } else if (args.categories.includes(CAT.PARKING_LOT)) {
                    showWL = false;
                    if (args.venue.attributes.lockRank < 2) {
                        noLock = true;
                        severity = SEVERITY.BLUE;
                    } else {
                        severity = SEVERITY.GREEN;
                    }
                } else if (Flag.HnMissing.isWhitelisted(args)) {
                    severity = SEVERITY.GREEN;
                    showWL = false;
                } else {
                    noLock = true;
                }

                super();
                this.severity = severity;
                this.showWL = showWL;
                this.noLock = noLock;
            }

            static venueIsFlaggable(args) {
                return args.hasStreet
                    && (!args.currentHN?.replace(/\D/g, ''))
                    && !this.#CATEGORIES_TO_IGNORE.includes(args.categories[0])
                    && !args.categories.includes(CAT.REST_AREAS);
            }

            static #getTextbox() {
                return $(`#${Flag.HnMissing.#TEXTBOX_ID}`);
            }

            action() {
                const newHN = $('#WMEPH-HNAdd').val().replace(/\s+/g, '');
                logDev(newHN);
                const hnTemp = newHN.replace(/[^\d]/g, '');
                const hnTempDash = newHN.replace(/[^\d-]/g, '');
                if (hnTemp > 0 && hnTemp < 1000000) {
                    const action = new UpdateObject(this.args.venue, { houseNumber: hnTempDash });
                    action.wmephDescription = `Changed house # to: ${hnTempDash}`;
                    harmonizePlaceGo(this.args.venue, 'harmonize', [action]); // Rerun the script to update fields and lock
                    UPDATED_FIELDS.address.updated = true;
                } else {
                    Flag.HnMissing.#getTextbox().css({ backgroundColor: '#FDD' }).attr('title', 'Must be a number between 0 and 1000000');
                }
            }

            postProcess() {
                // If pressing enter in the HN entry box, add the HN
                const textbox = Flag.HnMissing.#getTextbox();
                textbox.keyup(evt => {
                    if (evt.keyCode === 13 && textbox.val()) {
                        this.action();
                    }
                });
            }
        },
        HnTooManyDigits: class extends WLFlag {
            static defaultMessage = 'HN contains more than 6 digits. Please verify.';
            static defaultSeverity = SEVERITY.YELLOW;
            static WL_KEY = 'hnTooManyDigits';
            static defaultWLTooltip = 'Whitelist long HN';

            static venueIsFlaggable(args) {
                return !this.isWhitelisted(args)
                    && args.currentHN?.replace(/[^0-9]/g, '').length > 6;
            }
        },
        // 2020-10-5 HN's with letters have been allowed since last year.  Currently, RPPs can be saved with a number
        // followed by up to 4 letters but it's not clear if the app actually searches if only 1, 2, or more letters
        // are present.  Other places can have a more flexible HN (up to 15 characters long, total. A single space between
        // the # and letters. Etc)
        // HnNonStandard: class extends WLFlag {
        //     constructor() {
        //         super(SEVERITY.RED, 'House number is non-standard.', true,
        //             'Whitelist non-standard HN', 'hnNonStandard');
        //     }
        //
        // BELOW IS COPIED FROM harmonizePlaceGo function. To be included in HN flags if enabled again.
        // 2020-10-5 Disabling HN validity checks for now. See the note on the HnNonStandard flag object for more details.
        // if (hasStreet && (!currentHN || currentHN.replace(/\D/g, '').length === 0)) {

        // } else if (currentHN) {
        //     let hnOK = false;
        //     let updateHNflag = false;
        //     const hnTemp = currentHN.replace(/[^\d]/g, ''); // Digits only
        //     const hnTempDash = currentHN.replace(/[^\d-]/g, ''); // Digits and dashes only
        //     if (hnTemp < 1000000 && state2L === 'NY' && addr.city.attributes.name === 'Queens' && hnTempDash.match(/^\d{1,4}-\d{1,4}$/g) !== null) {
        //         updateHNflag = true;
        //         // hnOK = true;
        //     }
        //     if (hnTemp === currentHN && hnTemp < 1000000) { //  general check that HN is 6 digits or less, & that it is only [0-9]
        //         hnOK = true;
        //     }
        //     if (state2L === 'HI' && hnTempDash.match(/^\d{1,2}-\d{1,4}$/g) !== null) {
        //         if (hnTempDash === hnTempDash.match(/^\d{1,2}-\d{1,4}$/g)[0]) {
        //             hnOK = true;
        //         }
        //     }

        //     if (!hnOK) {
        //         _buttonBanner.hnNonStandard = new Flag.HnNonStandard();
        //         if (_wl.hnNonStandard) {
        //             _buttonBanner.hnNonStandard.WLactive = false;
        //             _buttonBanner.hnNonStandard.severity = SEVERITY.GREEN;
        //         } else {
        //             lockOK = false;
        //         }
        //     }
        //     if (updateHNflag) {
        //         _buttonBanner.hnDashRemoved = new Flag.HnDashRemoved();
        //         if (!highlightOnly) {
        //             actions.push(new UpdateObject(venue, { houseNumber: hnTemp }));
        //             _UPDATED_FIELDS.address.updated = true;
        //         } else if (highlightOnly) {
        //             if (venue.attributes.residential) {
        //                 _buttonBanner.hnDashRemoved.severity = SEVERITY.RED;
        //             } else {
        //                 _buttonBanner.hnDashRemoved.severity = SEVERITY.BLUE;
        //             }
        //         }
        //     }
        // }
        //
        // },
        HNRange: class extends WLFlag {
            static defaultMessage = 'House number seems out of range for the street name. Verify.';
            static defaultSeverity = SEVERITY.YELLOW;
            static WL_KEY = 'HNRange';
            static defaultWLTooltip = 'Whitelist HN range';

            static venueIsFlaggable(args) {
                if (!this.isWhitelisted(args) && _dupeHNRangeList.length > 3) {
                    let dhnix;
                    const dupeHNRangeListSorted = [];
                    sortWithIndex(_dupeHNRangeDistList);
                    for (dhnix = 0; dhnix < _dupeHNRangeList.length; dhnix++) {
                        dupeHNRangeListSorted.push(_dupeHNRangeList[_dupeHNRangeDistList.sortIndices[dhnix]]);
                    }
                    // Calculate HN/distance ratio with other venues
                    // var sumHNRatio = 0;
                    const arrayHNRatio = [];
                    for (dhnix = 0; dhnix < dupeHNRangeListSorted.length; dhnix++) {
                        arrayHNRatio.push(Math.abs((parseInt(args.currentHN, 10) - dupeHNRangeListSorted[dhnix]) / _dupeHNRangeDistList[dhnix]));
                    }
                    sortWithIndex(arrayHNRatio);
                    // Examine either the median or the 8th index if length is >16
                    const arrayHNRatioCheckIX = Math.min(Math.round(arrayHNRatio.length / 2), 8);
                    if (arrayHNRatio[arrayHNRatioCheckIX] > 1.4) {
                        // show stats if HN out of range
                        logDev(`HNs: ${dupeHNRangeListSorted}`);
                        logDev(`Distances: ${_dupeHNRangeDistList}`);
                        logDev(`arrayHNRatio: ${arrayHNRatio}`);
                        logDev(`HN Ratio Score: ${arrayHNRatio[Math.round(arrayHNRatio.length / 2)]}`);
                        return true;
                    }
                }
                return false;
            }
        },
        StreetMissing: class extends ActionFlag {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'No street:';
            static defaultButtonText = 'Edit address';
            static defaultButtonTooltip = 'Edit address to add street.';

            constructor(args) {
                super();
                if (args.categories[0] === CAT.SCENIC_LOOKOUT_VIEWPOINT) {
                    this.severity = SEVERITY.BLUE;
                }
            }

            static venueIsFlaggable(args) {
                return args.addr.city
                    && (!args.addr.street || args.addr.street.attributes.isEmpty)
                    && ![CAT.BRIDGE, CAT.ISLAND, CAT.FOREST_GROVE, CAT.SEA_LAKE_POOL, CAT.RIVER_STREAM, CAT.CANAL,
                        CAT.DAM, CAT.TUNNEL, CAT.JUNCTION_INTERCHANGE].includes(args.categories[0])
                    && !args.categories.includes(CAT.REST_AREAS);
            }

            // eslint-disable-next-line class-methods-use-this
            action() {
                clickGeneralTab();
                $('.venue .full-address').click();
                setTimeout(() => {
                    if ($('.empty-street').prop('checked')) {
                        $('.empty-street').click();
                    }
                    setTimeout(() => {
                        const elem = document
                            .querySelector('#venue-edit-general > div:nth-child(1) > div > div > wz-card > form > div:nth-child(2) > div > wz-autocomplete')
                            .shadowRoot.querySelector('#text-input')
                            .shadowRoot.querySelector('#id');
                        elem.focus();
                    }, 100);
                }, 100);
            }
        },
        CityMissing: class extends ActionFlag {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'No city:';
            static defaultButtonText = 'Edit address';
            static defaultButtonTooltip = 'Edit address to add city.';

            constructor(args) {
                super();
                if (args.categories.includes(CAT.RESIDENCE_HOME) && args.highlightOnly) {
                    this.severity = SEVERITY.BLUE;
                }
            }

            static venueIsFlaggable(args) {
                return (!args.addr.city || args.addr.city.attributes.isEmpty)
                    && ![CAT.BRIDGE, CAT.ISLAND, CAT.FOREST_GROVE, CAT.SEA_LAKE_POOL, CAT.RIVER_STREAM, CAT.CANAL,
                        CAT.DAM, CAT.TUNNEL, CAT.JUNCTION_INTERCHANGE].includes(args.categories[0])
                    && !args.categories.includes(CAT.REST_AREAS);
            }

            // eslint-disable-next-line class-methods-use-this
            action() {
                clickGeneralTab();
                $('.venue .full-address').click();
                setTimeout(() => {
                    if ($('.empty-city').prop('checked')) {
                        $('.empty-city').click();
                    }
                    setTimeout(() => {
                        const elem = document
                            .querySelector('#venue-edit-general > div:nth-child(1) > div > div > wz-card > form > div:nth-child(4) > wz-autocomplete')
                            .shadowRoot.querySelector('#text-input')
                            .shadowRoot.querySelector('#id');
                        elem.focus();
                    }, 100);
                }, 100);

                $('.city-name').focus();
            }
        },
        BankType1: class extends FlagBase {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Clarify the type of bank: the name has ATM but the primary category is Offices';

            static venueIsFlaggable(args) {
                return (!args.pnhNameRegMatch || (args.pnhNameRegMatch && args.priPNHPlaceCat === CAT.BANK_FINANCIAL && !args.pnhMatch.notABank))
                    && args.categories[0] === CAT.OFFICES
                    && /\batm\b/i.test(name);
            }
        },
        // TODO: Fix if the name has "(ATM)" or " - ATM" or similar. This flag is not currently catching those.
        BankBranch: class extends ActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'Is this a bank branch office? ';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Is this a bank branch?';

            static venueIsFlaggable(args) {
                let flaggable = false;
                if (!args.priPNHPlaceCat || (args.priPNHPlaceCat === CAT.BANK_FINANCIAL && !args.pnhMatch.notABank)) {
                    const ixBank = args.categories.indexOf(CAT.BANK_FINANCIAL);
                    const ixATM = args.categories.indexOf(CAT.ATM);
                    const ixOffices = args.categories.indexOf(CAT.OFFICES);

                    if (/\batm\b/ig.test(args.nameBase)) {
                        flaggable = ixOffices === 0
                            || (ixBank === -1 && ixATM === -1)
                            || (ixATM === 0 && ixBank > 0)
                            || (ixBank > -1);
                    } else if (ixBank > -1 || ixATM > -1) {
                        flaggable = ixOffices === 0
                            || (ixATM === 0 && ixBank === -1)
                            || (ixBank > 0 && ixATM > 0);
                    } else if (args.priPNHPlaceCat) {
                        flaggable = ixBank === -1 && !(/\bcorporate offices\b/i.test(args.nameSuffix) && ixOffices === 0);
                    }
                }
                return flaggable;
            }

            action() {
                const newAttributes = {};

                const originalCategories = this.args.venue.getCategories();
                const newCategories = insertAtIndex(originalCategories, [CAT.BANK_FINANCIAL, CAT.ATM], 0); // Change to bank and atm cats
                if (!arraysAreEqual(originalCategories, newCategories)) {
                    newAttributes.categories = newCategories;
                }

                // strip ATM from name if present
                const originalName = this.args.venue.getName();
                const newName = originalName.replace(/[- (]*ATM[- )]*/ig, ' ').replace(/^ /g, '').replace(/ $/g, '');
                if (originalName !== newName) {
                    newAttributes.name = newName;
                }

                addUpdateAction(this.args.venue, newAttributes, null, true);
            }
        },
        StandaloneATM: class extends ActionFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Or is this a standalone ATM? ';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Is this a standalone ATM with no bank branch?';

            static venueIsFlaggable(args) {
                let flaggable = false;
                if (!args.priPNHPlaceCat || (args.priPNHPlaceCat === CAT.BANK_FINANCIAL && !args.pnhMatch.notABank)) {
                    const ixBank = args.categories.indexOf(CAT.BANK_FINANCIAL);
                    const ixATM = args.categories.indexOf(CAT.ATM);
                    const ixOffices = args.categories.indexOf(CAT.OFFICES);

                    if (/\batm\b/ig.test(args.nameBase)) {
                        flaggable = ixOffices === 0
                            || (ixBank === -1 && ixATM === -1)
                            || (ixBank > -1);
                    } else if (ixBank > -1 || ixATM > -1) {
                        flaggable = ixOffices === 0
                            || (ixATM === 0 && ixBank === -1)
                            || (ixBank > 0 && ixATM > 0);
                    } else {
                        flaggable = args.priPNHPlaceCat && !(/\bcorporate offices\b/i.test(args.nameSuffix) && ixOffices === 0);
                    }
                }
                return flaggable;
            }

            action() {
                const newAttributes = {};

                const originalName = this.args.venue.getName();
                if (!/\bATM\b/i.test(originalName)) {
                    newAttributes.name = `${originalName} ATM`;
                }

                const atmCategory = [CAT.ATM];
                if (!arraysAreEqual(this.args.venue.getCategories(), atmCategory)) {
                    newAttributes.categories = atmCategory; // Change to ATM only
                }

                addUpdateAction(this.args.venue, newAttributes, null, true);
            }
        },
        BankCorporate: class extends ActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'Or is this the bank\'s corporate offices?';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Is this the bank\'s corporate offices?';

            static venueIsFlaggable(args) {
                let flaggable = false;
                if (!args.priPNHPlaceCat) {
                    flaggable = (/\batm\b/ig.test(args.nameBase) && args.categories.indexOf(CAT.OFFICES) === 0);
                } else if (args.priPNHPlaceCat === CAT.BANK_FINANCIAL && !args.pnhMatch.notABank) {
                    flaggable = !containsAny(args.categories, [CAT.BANK_FINANCIAL, CAT.ATM])
                        && !/\bcorporate offices\b/i.test(args.nameSuffix);
                }
                return flaggable;
            }

            action() {
                const newAttributes = {};

                const officesCategory = [CAT.OFFICES];
                if (!arraysAreEqual(this.args.venue.getCategories(), officesCategory)) {
                    newAttributes.categories = officesCategory;
                }

                // strip ATM from name if present
                const originalName = this.args.venue.getName();
                let newName = originalName
                    .replace(/[- (]*atm[- )]*/ig, ' ')
                    .replace(/^ /g, '')
                    .replace(/ $/g, '')
                    .replace(/ {2,}/g, ' ')
                    .replace(/\s*-\s*corporate\s*offices\s*$/i, '');
                const suffix = ' - Corporate Offices';
                if (!newName.endsWith(suffix)) newName += suffix;
                if (originalName !== newName) {
                    newAttributes.name = newName;
                }

                addUpdateAction(this.args.venue, newAttributes, null, true);
            }
        },
        CatPostOffice: class extends FlagBase {
            static defaultMessage = `The Post Office category is reserved for certain USPS locations. Please be sure to follow <a href="${
                URLS.uspsWiki}" style="color:#3a3a3a;" target="_blank">the guidelines</a>.`;

            static venueIsFlaggable(args) {
                return !args.highlightOnly && args.isUspsPostOffice;
            }
        },
        IgnEdited: class extends FlagBase {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Last edited by an IGN editor';

            static venueIsFlaggable(args) {
                let updatedBy;
                return !args.categories.includes(CAT.RESIDENCE_HOME)
                    && (updatedBy = args.venue.attributes.updatedBy)
                    && /^ign_/i.test(W.model.users.getObjectById(updatedBy)?.userName);
            }
        },
        WazeBot: class extends ActionFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Edited last by an automated process. Please verify information is correct.';
            static defaultButtonText = 'Nudge';
            static defaultButtonTooltip = 'If no other properties need to be updated, click to nudge the place (force an edit).';
            static #botIds = [105774162, 361008095, 338475699, -1, 107668852];
            static #botNames = [/^waze-maint/i, /^waze3rdparty$/i, /^WazeParking1$/i, /^admin$/i, /^avsus$/i];

            static venueIsFlaggable(args) {
                let flaggable = args.venue.isUnchanged() && !args.categories.includes(CAT.RESIDENCE_HOME);
                if (flaggable) {
                    const lastUpdatedById = args.venue.attributes.updatedBy ?? args.venue.attributes.createdBy;
                    flaggable = this.#botIds.includes(lastUpdatedById);
                    if (!flaggable) {
                        const lastUpdatedByName = W.model.users.getObjectById(lastUpdatedById)?.userName;
                        flaggable = (this.#botNames.some(botName => botName.test(lastUpdatedByName)));
                    }
                }
                return flaggable;
            }

            action() {
                nudgeVenue(this.args.venue);
                harmonizePlaceGo(this.args.venue, 'harmonize');
            }
        },
        ParentCategory: class extends WLFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static WL_KEY = 'parentCategory';
            static defaultWLTooltip = 'Whitelist parent Category';

            get message() {
                let msg;
                const badCatInfos = this.args.categories
                    .filter(category => Flag.ParentCategory.categoryIsDisallowedParent(category, this.args))
                    .map(category => this.args.pnhCategoryInfos.getById(category));
                if (badCatInfos.length === 1) {
                    msg = `The <b>${badCatInfos[0].name}</b> parent category is usually not mapped in this region.`;
                } else {
                    msg = 'These parent categories are usually not mapped in this region: ';
                    msg += badCatInfos.map(catInfo => `<b>${catInfo.name}</b>`).join(', ');
                }
                return msg;
            }

            static categoryIsDisallowedParent(category, args) {
                const pnhCategoryInfo = args.pnhCategoryInfos.getById(category);
                const localities = pnhCategoryInfo.disallowedParent;
                return localities.includes(args.state2L) || localities.includes(args.region) || localities.includes(args.countryCode);
            }

            static venueIsFlaggable(args) {
                return args.categories.some(category => this.categoryIsDisallowedParent(category, args));
            }
        },
        CheckDescription: class extends FlagBase {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Description field already contained info; PNH description was added in front of existing. Check for inconsistency or duplicate info.';

            static venueIsFlaggable(args) {
                return args.descriptionInserted;
            }
        },
        Overlapping: class extends FlagBase {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Place points are stacked up.';
        },
        SuspectDesc: class extends WLFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Description field might contain copyrighted info.';
            static WL_KEY = 'suspectDesc';
            static defaultWLTooltip = 'Whitelist description';

            static venueIsFlaggable(args) {
                return !args.venue.isResidential()
                    && args.totalSeverity < SEVERITY.RED
                    && !this.isWhitelisted(args)
                    && /(google|yelp)/i.test(args.description);
            }
        },
        ResiTypeName: class extends WLFlag {
            static defaultMessage = 'The place name suggests a residential place or personalized place of work.  Please verify.';
            static WL_KEY = 'resiTypeName';
            static defaultWLTooltip = 'Whitelist Residential-type name';

            constructor(likelyResidential) {
                super();
                if (likelyResidential) this.severity = SEVERITY.YELLOW;
            }

            // TODO: make this a public method and pass the result to args so args can be passed into vanueIsFlaggable
            static #likelyResidentialName(alphaName) {
                return /^((my|mi|moms|dads)?\s*(home|work|office|casa|house))|(mom|dad)$/i.test(alphaName);
            }

            static #possiblyResidentialName(alphaName, categories) {
                return /('?s|my)\s+(house|home|work)/i.test(alphaName)
                    && !containsAny(categories, [CAT.RESTAURANT, CAT.DESSERT, CAT.BAR]);
            }

            static #isPreflaggable(args) {
                return !args.categories.includes(CAT.RESIDENCE_HOME)
                    && !args.pnhNameRegMatch
                    && !this.isWhitelisted(args)
                    && args.totalSeverity < SEVERITY.RED;
            }

            // TODO
            static #venueIsFlaggable(preflaggable, likelyResidential, alphaName, categories) {
                return preflaggable
                    && (likelyResidential || this.#possiblyResidentialName(alphaName, categories));
            }

            static eval(args) {
                const preflaggable = this.#isPreflaggable(args);
                if (preflaggable) {
                    const alphaName = name.replace(/[^A-Z ]/i, ''); // remove non-alpha characters
                    const likelyResidential = this.#likelyResidentialName(alphaName);
                    if (this.#venueIsFlaggable(preflaggable, likelyResidential, alphaName, args.categories)) return new this(likelyResidential);
                }
                return null;
            }
        },
        Mismatch247: class extends FlagBase {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Hours of operation listed as open 24hrs but not for all 7 days.';

            static venueIsFlaggable(args) {
                return args.openingHours.length === 1
                    && args.openingHours[0].days.length < 7
                    && /^0?0:00$/.test(args.openingHours[0].fromHour)
                    && (/^0?0:00$/.test(args.openingHours[0].toHour) || args.openingHours[0].toHour === '23:59');
            }
        },
        PhoneInvalid: class extends FlagBase {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Phone # is invalid.';

            static venueIsFlaggable(args) {
                if (!args.phone) return false;
                const normalizedPhone = normalizePhone(args.phone, args.outputPhoneFormat);
                return (args.highlightOnly && normalizedPhone !== args.phone)
                    || (!args.highlightOnly && normalizedPhone === BAD_PHONE);
            }
        },
        UrlMismatch: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'Existing URL doesn\'t match the suggested PNH URL. Use the Website button below to verify the existing URL is valid. If not:';
            static defaultButtonText = 'Use PNH URL';
            static defaultButtonTooltip = 'Change URL to the PNH standard';
            static WL_KEY = 'longURL';
            static defaultWLTooltip = 'Whitelist existing URL';

            static venueIsFlaggable(args) {
                // for cases where there is an existing URL in the WME place, and there is a PNH url on queue:
                return !isNullOrWhitespace(args.url)
                    && !isNullOrWhitespace(args.pnhUrl)
                    && args.url !== args.pnhUrl
                    && args.pnhUrl !== BAD_URL;
            }

            action() {
                if (!isNullOrWhitespace(this.args.pnhUrl)) {
                    addUpdateAction(this.args.venue, { url: this.args.pnhUrl }, null, true);
                } else {
                    WazeWrap.Alerts.confirm(
                        SCRIPT_NAME,
                        'URL Matching Error!<br>Click OK to report this error',
                        () => { reportError(); },
                        () => { }
                    );
                }
            }
        },
        UrlAnalytics: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'URL contains analytics queries. Strip them?';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Strip analytics queries from the URL';
            static WL_KEY = 'urlAnalytics';
            static defaultWLTooltip = 'Whitelist existing URL';
            static URL_ANALYTICS_REGEX = /(?<=&|\?)(utm_|y_|(wtextnd)?source=|cmpid=|cid=|otppartnerid=|campaignid=|ref=|cmp=).*?(&|$)/ig;

            static venueIsFlaggable(args) {
                return !isNullOrWhitespace(args.url)
                    && args.url !== args.pnhUrl
                    && Flag.UrlAnalytics.URL_ANALYTICS_REGEX.test(args.url);
            }

            action() {
                const url = Flag.UrlAnalytics.#stripUrlAnalyticsQueries(this.args.url);
                addUpdateAction(this.args.venue, { url }, null, true);
            }

            static #stripUrlAnalyticsQueries(url) {
                // utm_* queries are generally used by Google.
                // y_* queries are used by yext.
                url = url.replace(Flag.UrlAnalytics.URL_ANALYTICS_REGEX, '');

                // Strip the ending ? if all queries were removed.
                url = url.replace(/\?$/, '');

                return url;
            }
        },
        GasNoBrand: class extends FlagBase {
            static defaultSeverity = SEVERITY.BLUE;

            get message() { return `Lock to L${this.args.levelToLock + 1}+ to verify no gas brand.`; }

            constructor() {
                super();
                this.noLock = true;
            }

            static venueIsFlaggable(args) {
                // If gas station is missing brand, don't flag if place is locked as high as user can lock it.
                return args.categories.includes(CAT.GAS_STATION)
                    && !args.brand
                    && args.venue.attributes.lockRank < args.levelToLock;
            }
        },
        SubFuel: class extends WLFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'Make sure this place is for the gas station itself and not the main store building. Otherwise undo and check the categories.';
            static WL_KEY = 'subFuel';
            static defaultWLTooltip = 'Whitelist no gas brand';

            static venueIsFlaggable(args) {
                return !this.isWhitelisted(args)
                    && args.pnhMatch.subFuel
                    && !/\bgas(oline)?\b/i.test(args.venue.attributes.name)
                    && !/\bfuel\b/i.test(args.venue.attributes.name);
            }
        },
        AddCommonEVPaymentMethods: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultButtonText = 'Add network payment methods';
            static defaultButtonTooltip = 'Please verify first! If any are not needed, click the WL button and manually add any needed payment methods.';
            static WL_KEY = 'addCommonEVPaymentMethods';
            static defaultWLTooltip = 'Whitelist common EV payment types';

            get message() {
                const stationAttr = this.args.venue.attributes.categoryAttributes.CHARGING_STATION;
                const { network } = stationAttr;
                let msg = `These common payment methods for the ${network} network are missing. Verify if they are needed here:`;
                this.originalNetwork = stationAttr.network;
                const translations = I18n.translations[I18n.locale].edit.venue.category_attributes.payment_methods;
                const list = COMMON_EV_PAYMENT_METHODS[network]
                    .filter(method => !stationAttr.paymentMethods?.includes(method))
                    .map(method => `- ${translations[method]}`).join('<br>');
                msg += `<br>${list}<br>`;
                return msg;
            }

            static venueIsFlaggable(args) {
                if (args.categories.includes(CAT.CHARGING_STATION) && !this.isWhitelisted(args)) {
                    const stationAttr = args.venue.attributes.categoryAttributes.CHARGING_STATION;
                    const network = stationAttr?.network;
                    return !!(COMMON_EV_PAYMENT_METHODS[network]?.some(method => !stationAttr.paymentMethods?.includes(method)));
                }
                return false;
            }

            action() {
                if (!this.args.venue.isChargingStation()) {
                    WazeWrap.Alerts.info(SCRIPT_NAME, 'This is no longer a charging station. Please run WMEPH again.', false, false);
                    return;
                }

                const stationAttr = this.args.venue.attributes.categoryAttributes.CHARGING_STATION;
                const network = stationAttr?.network;
                if (network !== this.originalNetwork) {
                    WazeWrap.Alerts.info(SCRIPT_NAME, 'EV charging station network has changed. Please run WMEPH again.', false, false);
                    return;
                }

                const newPaymentMethods = stationAttr.paymentMethods?.slice() ?? [];
                const commonPaymentMethods = COMMON_EV_PAYMENT_METHODS[network];
                commonPaymentMethods.forEach(method => {
                    if (!newPaymentMethods.includes(method)) newPaymentMethods.push(method);
                });

                const categoryAttrClone = JSON.parse(JSON.stringify(this.args.venue.getCategoryAttributes()));
                categoryAttrClone.CHARGING_STATION ??= {};
                categoryAttrClone.CHARGING_STATION.paymentMethods = newPaymentMethods;

                UPDATED_FIELDS.evPaymentMethods.updated = true;
                addUpdateAction(this.args.venue, { categoryAttributes: categoryAttrClone }, null, true);
            }
        },
        RemoveUncommonEVPaymentMethods: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultButtonText = 'Remove network payment methods';
            static defaultButtonTooltip = 'Please verify first! If any should NOT be removed, click the WL button and manually remove any unneeded payment methods.';
            static WL_KEY = 'removeUncommonEVPaymentMethods';
            static defaultWLTooltip = 'Whitelist uncommon EV payment types';

            get message() {
                const stationAttr = this.args.venue.attributes.categoryAttributes.CHARGING_STATION;
                const { network } = stationAttr;
                let msg = `These payment methods are uncommon for the ${stationAttr.network} network. Verify if they are needed here:`;
                // Store a copy of the network to check if it has changed in the action() function
                this.originalNetwork = stationAttr.network;
                const translations = I18n.translations[I18n.locale].edit.venue.category_attributes.payment_methods;
                const list = stationAttr.paymentMethods
                    ?.filter(method => !COMMON_EV_PAYMENT_METHODS[network]?.includes(method))
                    .map(method => `- ${translations[method]}`).join('<br>');
                msg += `<br>${list}<br>`;
                return msg;
            }

            static venueIsFlaggable(args) {
                if (args.categories.includes(CAT.CHARGING_STATION) && !this.isWhitelisted(args)) {
                    const stationAttr = args.venue.attributes.categoryAttributes.CHARGING_STATION;
                    const network = stationAttr?.network;
                    return COMMON_EV_PAYMENT_METHODS.hasOwnProperty(network)
                        && !!(stationAttr?.paymentMethods?.some(method => !COMMON_EV_PAYMENT_METHODS[network]?.includes(method)));
                }
                return false;
            }

            action() {
                if (!this.args.venue.isChargingStation()) {
                    WazeWrap.Alerts.info('This is no longer a charging station. Please run WMEPH again.', false, false);
                    return;
                }

                const stationAttr = this.args.venue.attributes.categoryAttributes.CHARGING_STATION;
                const network = stationAttr?.network;
                if (network !== this.originalNetwork) {
                    WazeWrap.Alerts.info(SCRIPT_NAME, 'EV charging station network has changed. Please run WMEPH again.', false, false);
                    return;
                }

                const commonPaymentMethods = COMMON_EV_PAYMENT_METHODS[network];
                const newPaymentMethods = (stationAttr.paymentMethods?.slice() ?? [])
                    .filter(method => commonPaymentMethods?.includes(method));

                const categoryAttrClone = JSON.parse(JSON.stringify(this.args.venue.getCategoryAttributes()));
                categoryAttrClone.CHARGING_STATION ??= {};
                categoryAttrClone.CHARGING_STATION.paymentMethods = newPaymentMethods;

                UPDATED_FIELDS.evPaymentMethods.updated = true;
                addUpdateAction(this.args.venue, { categoryAttributes: categoryAttrClone }, null, true);
            }
        },
        FormatUSPS: class extends FlagBase {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = `Name the post office according to this region's <a href="${
                URLS.uspsWiki}" style="color:#3232e6" target="_blank">standards for USPS post offices</a>`;

            static venueIsFlaggable(args) {
                return args.isUspsPostOffice
                    && !this.isNameOk(this.getCleanNameParts(args.nameBase, args.nameSuffix).join(''), args.state2L, args.addr);
            }

            static getCleanNameParts(name, nameSuffix) {
                name = name.trimLeft().replace(/ {2,}/, ' ');
                if (nameSuffix) {
                    nameSuffix = nameSuffix.trimRight().replace(/\bvpo\b/i, 'VPO').replace(/\bcpu\b/i, 'CPU').replace(/ {2,}/, ' ');
                }
                return [name, nameSuffix || ''];
            }

            static isNameOk(name, state2L, addr) {
                return this.#getPostOfficeRegEx(state2L, addr).test(name);
            }

            static #getPostOfficeRegEx(state2L, addr) {
                return state2L === 'KY'
                    || (state2L === 'NY' && ['Queens', 'Bronx', 'Manhattan', 'Brooklyn', 'Staten Island'].includes(addr.city?.attributes.name))
                    ? /^post office \d{5}( [-–](?: cpu| vpo)?(?: [a-z0-9]+){1,})?$/i
                    : /^post office [-–](?: cpu| vpo)?(?: [a-z0-9]+){1,}$/i;
            }
        },
        MissingUSPSAlt: class extends ActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'USPS post offices must have an alternate name of "USPS".';
            static defaultButtonText = 'Add it';
            static defaultButtonTooltip = 'Add USPS alternate name';

            static venueIsFlaggable(args) {
                return args.isUspsPostOffice
                    && !args.aliases.some(alias => alias.toUpperCase() === 'USPS');
            }

            action() {
                const aliases = this.args.venue.attributes.aliases.slice();
                if (!aliases.some(alias => alias === 'USPS')) {
                    aliases.push('USPS');
                    addUpdateAction(this.args.venue, { aliases }, null, true);
                } else {
                    harmonizePlaceGo(this.args.venue, 'harmonize');
                }
            }
        },
        MissingUSPSZipAlt: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = `No <a href="${URLS.uspsWiki}" style="color:#3232e6;" target="_blank">ZIP code alt name</a>: <input type="text" \
id="WMEPH-zipAltNameAdd"autocomplete="off" style="font-size:0.85em;width:65px;padding-left:2px;color:#000;" title="Enter the ZIP code and click Add">`;

            static defaultButtonText = 'Add';
            static WL_KEY = 'missingUSPSZipAlt';
            static defaultWLTooltip = 'Whitelist missing USPS zip alt name';
            static #TEXTBOX_ID = 'WMEPH-zipAltNameAdd';
            noBannerAssemble = true;

            static venueIsFlaggable(args) {
                return args.isUspsPostOffice
                    && !args.aliases.some(alias => /\d{5}/.test(alias));
            }

            action() {
                const $input = $(`input#${Flag.MissingUSPSZipAlt.#TEXTBOX_ID}`);
                const zip = $input.val().trim();
                if (zip) {
                    if (/^\d{5}/.test(zip)) {
                        const aliases = [].concat(this.args.venue.attributes.aliases);
                        // Make sure zip hasn't already been added.
                        if (!aliases.includes(zip)) {
                            aliases.push(zip);
                            addUpdateAction(this.args.venue, { aliases }, null, true);
                        } else {
                            $input.css({ backgroundColor: '#FDD' }).attr('title', 'Zip code alt name already exists');
                        }
                    } else {
                        $input.css({ backgroundColor: '#FDD' }).attr('title', 'Zip code format error');
                    }
                }
            }

            postProcess() {
                // If pressing enter in the USPS zip code alt entry box...
                const $textbox = $(`#${Flag.MissingUSPSZipAlt.#TEXTBOX_ID}`);
                $textbox.keyup(evt => {
                    if (evt.keyCode === 13 && $(evt.currentTarget).val() !== '') {
                        $('#WMEPH_MissingUSPSZipAlt').click();
                    }
                });

                // Prefill zip code text box
                const zipMatch = (this.args.nameBase + (this.args.nameSuffix ?? '')).match(/\d{5}/);
                if (zipMatch) {
                    $textbox.val(zipMatch[0]);
                }
            }
        },
        MissingUSPSDescription: class extends WLFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = `The first line of the description for a <a href="${
                URLS.uspsWiki}" style="color:#3232e6" target="_blank">USPS post office</a> must be CITY, STATE(2-letter) ZIP, e.g. "Lexington, KY 40511"`;

            static WL_KEY = 'missingUSPSDescription';
            static defaultWLTooltip = 'Whitelist missing USPS address line in description';

            static venueIsFlaggable(args) {
                if (args.isUspsPostOffice) {
                    const lines = args.description?.split('\n');
                    return !lines?.length
                        || !/^.{2,}, [A-Z]{2}\s{1,2}\d{5}$/.test(lines[0]);
                }
                return false;
            }
        },
        CatHotel: class extends FlagBase {
            constructor(args) {
                const pnhName = args.pnhMatch.name;
                super(`Check hotel website for any name localization (e.g. ${pnhName} - Tampa Airport).`);
            }

            static venueIsFlaggable(args) {
                return args.priPNHPlaceCat === CAT.HOTEL
                    && (args.nameBase + (args.nameSuffix || '')).toUpperCase() === args.pnhMatch.name.toUpperCase();
            }
        },
        LocalizedName: class extends WLFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static WL_KEY = 'localizedName';
            static defaultWLTooltip = 'Whitelist localization';

            get message() { return this.args.pnhMatch.displaynote || 'Place needs localization information'; }

            static venueIsFlaggable(args) {
                return args.pnhMatch.localizationRegEx
                    && !args.pnhMatch.localizationRegEx.test(args.nameBase + (args.nameSuffix || ''));
            }
        },
        SpecCaseMessage: class extends FlagBase {
            static #teslaSC = /tesla supercharger/i;
            static #teslaDC = /tesla destination charger/i;
            static #rivianAN = /<b>rivian adventure network<\/b> charger/i;
            static #rivianW = /<b>rivian waypoints<\/b> charger/i;

            constructor(args) {
                let message = args.pnhMatch.displaynote;

                // 3/23/2023 - This is a temporary solution to add a disambiguator for Tesla & Rivian chargers.
                let isRivian = false;
                const isTesla = Flag.SpecCaseMessage.#teslaSC.test(message) && Flag.SpecCaseMessage.#teslaDC.test(message);
                if (isTesla) {
                    message = message.replace(
                        Flag.SpecCaseMessage.#teslaSC,
                        '<button id="wmeph-tesla-supercharger" class="btn wmeph-btn">Tesla SuperCharger</button>'
                    );
                    message = message.replace(
                        Flag.SpecCaseMessage.#teslaDC,
                        '<button id="wmeph-tesla-destination-charger" class="btn wmeph-btn">Tesla Destination Charger</button>'
                    );
                } else {
                    isRivian = Flag.SpecCaseMessage.#rivianAN.test(message) && Flag.SpecCaseMessage.#rivianW.test(message);
                    if (isRivian) {
                        message = message.replace(
                            Flag.SpecCaseMessage.#rivianAN,
                            '<button id="wmeph-rivian-adventure-network" class="btn wmeph-btn">Rivian Adventure Network charger</button>'
                        );
                        message = message.replace(
                            Flag.SpecCaseMessage.#rivianW,
                            '<button id="wmeph-rivian-waypoints" class="btn wmeph-btn">Rivian Waypoints charger</button>'
                        );
                    }
                }

                super();
                this.message = message;

                if (isTesla) {
                    this.postProcess = () => {
                        $('#wmeph-tesla-supercharger').click(() => {
                            addUpdateAction(args.venue, { name: 'Tesla Supercharger' }, null, true);
                        });
                        $('#wmeph-tesla-destination-charger').click(() => {
                            addUpdateAction(args.venue, { name: 'Tesla Destination Charger' }, null, true);
                        });
                    };
                    this.severity = SEVERITY.RED;
                } else if (isRivian) {
                    this.postProcess = () => {
                        $('#wmeph-rivian-adventure-network').click(() => {
                            addUpdateAction(args.venue, { name: 'Rivian Adventure Network' }, null, true);
                        });
                        $('#wmeph-rivian-waypoints').click(() => {
                            addUpdateAction(args.venue, { name: 'Rivian Waypoints' }, null, true);
                        });
                    };
                    this.severity = SEVERITY.RED;
                }
            }

            static venueIsFlaggable(args) {
                // TODO: Are the pharmhours and drivethruhours checks really needed?
                // They hide the displaynote message if the key words exist in the
                // venue description, but it could be argued it's ok if the message
                // shows up regardless.
                const message = args.pnhMatch.displaynote;
                let showFlag = false;
                if (args.showDispNote && !isNullOrWhitespace(message)) {
                    if (args.pnhMatch.pharmhours) {
                        showFlag = !/\bpharmacy\b\s*\bh(ou)?rs\b/i.test(args.venue.attributes.description);
                        // TODO: figure out what drivethruhours was supposed to be in PNH speccase column
                    } else if (args.pnhMatch.drivethruhours) {
                        showFlag = !/\bdrive[\s-]?(thru|through)\b\s*\bh(ou)?rs\b/i.test(args.venue.attributes.description);
                    } else {
                        showFlag = true;
                    }
                }
                return showFlag;
            }
        },
        PnhCatMess: class extends ActionFlag {
            constructor(venue, pnhCategoryInfo, categories) {
                super();
                this.message = pnhCategoryInfo.message;
                if (categories.includes(CAT.HOSPITAL_URGENT_CARE)) {
                    this.buttonText = 'Change to Doctor/Clinic';
                    this.actionType = 'changeToDoctorClinic';
                }
                this.venue = venue;
            }

            static #venueIsFlaggable(highlightOnly, pnhCategoryInfo) {
                return !highlightOnly && !isNullOrWhitespace(pnhCategoryInfo.message);
            }

            static eval(venue, pnhCategoryInfo, categories, highlightOnly) {
                return this.#venueIsFlaggable(highlightOnly, pnhCategoryInfo) ? new this(venue, pnhCategoryInfo, categories) : null;
            }

            action() {
                if (this.actionType === 'changeToDoctorClinic') {
                    const categories = uniq(this.venue.attributes.categories.slice());
                    const indexOfHospital = categories.indexOf(CAT.HOSPITAL_URGENT_CARE);
                    if (indexOfHospital > -1) {
                        categories[indexOfHospital] = CAT.DOCTOR_CLINIC;
                        addUpdateAction(this.venue, { categories }, null, true);
                    }
                }
            }
        },
        ExtProviderMissing: class extends ActionFlag {
            static defaultButtonTooltip = 'If no other properties need to be updated, click to nudge the place (force an edit).';
            static #categoriesToIgnore = [CAT.BRIDGE, CAT.TUNNEL, CAT.JUNCTION_INTERCHANGE, CAT.NATURAL_FEATURES, CAT.ISLAND,
                CAT.SEA_LAKE_POOL, CAT.RIVER_STREAM, CAT.CANAL, CAT.SWAMP_MARSH];

            get message() {
                let msg = 'No Google link';
                msg += this.makeRed()
                    ? ' and place has not been edited for over 6 months. Edit a property (or nudge) and save to reset the 6 month timer: '
                    : ': ';
                return msg;
            }

            get severity() { return this.makeRed() ? SEVERITY.RED : super.severity; }
            set severity(value) { super.severity = value; }

            get buttonText() { return this.makeRed() ? 'Nudge' : ''; }

            set buttonText(value) { super.buttonText = value; }

            constructor() {
                super();
                this.value2 = 'Add';
                this.title2 = 'Add a link to a Google place';
            }

            makeRed() {
                const { venue } = this.args;
                if (this.args.isLocked) {
                    let lastUpdated;
                    if (venue.isNew()) {
                        lastUpdated = Date.now();
                    } else if (venue.attributes.updatedOn) {
                        lastUpdated = venue.attributes.updatedOn;
                    } else {
                        lastUpdated = venue.attributes.createdOn;
                    }
                    const weeksSinceLastUpdate = (Date.now() - lastUpdated) / 604800000;
                    if (weeksSinceLastUpdate >= 26 && !venue.isUpdated() && (!this.args.actions || this.args.actions.length === 0)) {
                        return true;
                    }
                }
                return false;
            }

            static venueIsFlaggable(args) {
                if (USER.rank >= 2 && args.venue.areExternalProvidersEditable() && !(args.categories.includes(CAT.PARKING_LOT) && args.ignoreParkingLots)) {
                    if (!args.categories.some(cat => this.#categoriesToIgnore.includes(cat))) {
                        const provIDs = args.venue.attributes.externalProviderIDs;
                        if (!(provIDs && provIDs.length)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            action() {
                nudgeVenue(this.args.venue);
                harmonizePlaceGo(this.args.venue, 'harmonize'); // Rerun the script to update fields and lock
            }

            action2() {
                clickGeneralTab();
                const venueName = this.args.venue.attributes.name;
                $('wz-button.external-provider-add-new').click();
                setTimeout(() => {
                    clickGeneralTab();
                    setTimeout(() => {
                        const elem = document.querySelector('div.external-provider-edit-form wz-autocomplete').shadowRoot.querySelector('wz-text-input').shadowRoot.querySelector('input');
                        elem.focus();
                        elem.value = venueName;
                        elem.dispatchEvent(new Event('input', { bubbles: true })); // NOTE: jquery trigger('input') and other event calls did not work.
                    }, 100);
                }, 100);
            }

            preProcess() {
                // If no Google link and severity would otherwise allow locking, ask if user wants to lock anyway.
                const { args } = this;
                if (!args.isLocked && this.severity <= SEVERITY.YELLOW) {
                    this.severity = SEVERITY.RED;
                    args.totalSeverity = SEVERITY.RED;
                    if (args.lockOK) {
                        this.buttonText = `Lock anyway? (${args.levelToLock + 1})`;
                        this.buttonTooltip = 'If no Google link exists, lock this place.\nIf there is still no Google link after '
                            + '6 months from the last update date, it will turn red as a reminder to search again.';
                        this.action = () => {
                            addUpdateAction(args.venue, { lockRank: args.levelToLock }, null, true);
                        };
                    }
                }
            }
        },
        UrlMissing: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static get defaultMessage() {
                return `No URL: <input type="text" id="${Flag.UrlMissing.#TEXTBOX_ID}" autocomplete="off"`
                    + ' style="font-size:0.85em;width:100px;padding-left:2px;color:#000;">';
            }

            static defaultButtonText = 'Add';
            static defaultButtonTooltip = 'Add URL to place';
            static WL_KEY = 'urlWL';
            static defaultWLTooltip = 'Whitelist empty URL';
            static #TEXTBOX_ID = 'WMEPH-UrlAdd';
            noBannerAssemble = true;

            static isWhitelisted(args) {
                return super.isWhitelisted(args)
                    || PRIMARY_CATS_TO_FLAG_GREEN_MISSING_PHONE_URL.includes(args.categories[0])
                    || ANY_CATS_TO_FLAG_GREEN_MISSING_PHONE_URL.some(category => args.categories.includes(category));
            }

            static venueIsFlaggable(args) {
                return !args.url?.trim().length
                    && (!args.venue.isParkingLot()
                        || (args.venue.isParkingLot() && REGIONS_THAT_WANT_PLA_PHONE_URL.includes(args.region)))
                    && !PRIMARY_CATS_TO_IGNORE_MISSING_PHONE_URL.includes(args.categories[0]);
            }

            static #getTextbox() {
                return $(`#${Flag.UrlMissing.#TEXTBOX_ID}`);
            }

            action() {
                const $textbox = Flag.UrlMissing.#getTextbox();
                const newUrl = normalizeURL($textbox.val());
                if ((!newUrl?.trim().length) || newUrl === BAD_URL) {
                    $textbox.css({ backgroundColor: '#FDD' }).attr('title', 'Invalid URL format');
                } else {
                    logDev(newUrl);
                    addUpdateAction(this.args.venue, { url: newUrl }, null, true);
                }
            }

            postProcess() {
                // If pressing enter in the URL entry box, add the URL
                const textbox = Flag.UrlMissing.#getTextbox();
                textbox.keyup(evt => {
                    if (evt.keyCode === 13 && textbox.val() !== '') {
                        this.action();
                    }
                });
            }
        },
        InvalidUrl: class extends WLFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'URL appears to be invalid.';
            static WL_KEY = 'invalidUrl';
            static defaultWLTooltip = 'Whitelist bad URL';

            static venueIsFlaggable(args) {
                return args.normalizedUrl === BAD_URL
                    && !this.isWhitelisted(args);
            }
        },
        BadAreaCode: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultButtonText = 'Update';
            static defaultButtonTooltip = 'Update phone #';
            static WL_KEY = 'aCodeWL';
            static defaultWLTooltip = 'Whitelist the area code';
            noBannerAssemble = true;

            get message() {
                return 'Area Code appears to be invalid for this region:<br><input type="text" id="WMEPH-PhoneAdd" autocomplete="off" '
                + `style="font-size:0.85em;width:100px;padding-left:2px;color:#000;" value="${this.args.phone || ''}">`;
            }

            static venueIsFlaggable(args) {
                return args.phone
                    && !this.isWhitelisted(args)
                    // && ['USA', 'CAN'].includes(args.countryCode) // This check shouldn't be needed here.
                    && !_areaCodeList.includes(args.phone.match(/[2-9]\d{2}/)?.[0]);
            }

            action() {
                const newPhone = normalizePhone($('#WMEPH-PhoneAdd').val(), this.args.outputPhoneFormat);
                if (newPhone === BAD_PHONE) {
                    $('input#WMEPH-PhoneAdd').css({ backgroundColor: '#FDD' }).attr('title', 'Invalid phone # format');
                } else {
                    addUpdateAction(this.args.venue, { phone: newPhone }, null, true);
                }
            }
        },
        AddRecommendedPhone: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultButtonText = 'Add';
            static defaultButtonTooltip = 'Add recommended chain phone #';
            static WL_KEY = 'addRecommendedPhone';
            static defaultWLTooltip = 'Whitelist recommended phone #';

            get message() { return `Recommended phone #:<br>${this.args.recommendedPhone}`; }

            static venueIsFlaggable(args) {
                return args.recommendedPhone
                    && !this.isWhitelisted(args)
                    && args.recommendedPhone !== BAD_PHONE
                    && args.recommendedPhone !== normalizePhone(args.phone, args.outputPhoneFormat);
            }

            action() {
                addUpdateAction(this.args.venue, { phone: this.args.recommendedPhone }, null, true);
            }
        },
        PhoneMissing: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'No ph#: <input type="text" id="WMEPH-PhoneAdd" autocomplete="off" style="font-size:0.85em;width:100px;padding-left:2px;color:#000;">';
            static defaultButtonText = 'Add';
            static defaultButtonTooltip = 'Add phone to place';
            static WL_KEY = 'phoneWL';
            static defaultWLTooltip = 'Whitelist empty phone';
            noBannerAssemble = true;

            static isWhitelisted(args) {
                return super.isWhitelisted(args)
                    || PRIMARY_CATS_TO_FLAG_GREEN_MISSING_PHONE_URL.includes(args.categories[0])
                    || ANY_CATS_TO_FLAG_GREEN_MISSING_PHONE_URL.some(category => args.categories.includes(category));
            }

            static venueIsFlaggable(args) {
                return !args.phone
                    && !FlagBase.currentFlags.hasFlag(Flag.AddRecommendedPhone)
                    && (!args.venue.isParkingLot()
                        || (args.venue.isParkingLot() && REGIONS_THAT_WANT_PLA_PHONE_URL.includes(args.region)))
                    && !PRIMARY_CATS_TO_IGNORE_MISSING_PHONE_URL.includes(args.categories[0]);
            }

            action() {
                const newPhone = normalizePhone($('#WMEPH-PhoneAdd').val(), this.args.outputPhoneFormat);
                if (newPhone === BAD_PHONE || !newPhone) {
                    $('input#WMEPH-PhoneAdd').css({ backgroundColor: '#FDD' }).attr('title', 'Invalid phone # format');
                } else {
                    logDev(newPhone);
                    addUpdateAction(this.args.venue, { phone: newPhone }, null, true);
                }
            }

            // eslint-disable-next-line class-methods-use-this
            postProcess() {
                // TODO: Is this needed???
                // If pressing enter in the phone entry box, add the phone
                $('#WMEPH-PhoneAdd').keyup(evt => {
                    if (evt.keyCode === 13 && $('#WMEPH-PhoneAdd').val() !== '') {
                        $('#WMEPH_PhoneMissing').click();
                        $('#WMEPH_BadAreaCode').click();
                    }
                });
            }
        },
        NoHours: class extends WLFlag {
            static WL_KEY = 'noHours';
            static defaultSeverity = SEVERITY.BLUE;
            static defaultWLTooltip = 'Whitelist "No hours"';

            get message() {
                let msg;
                if (!this.args.openingHours.length) {
                    msg = Flag.NoHours.#getHoursHtml();
                } else {
                    msg = Flag.NoHours.#getHoursHtml(true, isAlwaysOpen(this.args.venue));
                }
                return msg;
            }

            static venueIsFlaggable(args) {
                return !containsAny(args.categories, [CAT.STADIUM_ARENA, CAT.CEMETERY, CAT.TRANSPORTATION, CAT.FERRY_PIER, CAT.SUBWAY_STATION,
                    CAT.BRIDGE, CAT.TUNNEL, CAT.JUNCTION_INTERCHANGE, CAT.ISLAND, CAT.SEA_LAKE_POOL, CAT.RIVER_STREAM, CAT.FOREST_GROVE, CAT.CANAL,
                    CAT.SWAMP_MARSH, CAT.DAM]);
            }

            static isWhitelisted(args) {
                return super.isWhitelisted(args)
                    || args.openingHours.length
                    || $('#WMEPH-DisableHoursHL').prop('checked')
                    || containsAny(args.categories, [CAT.SCHOOL, CAT.CONVENTIONS_EVENT_CENTER,
                        CAT.CAMPING_TRAILER_PARK, CAT.COTTAGE_CABIN, CAT.COLLEGE_UNIVERSITY, CAT.GOLF_COURSE, CAT.SPORTS_COURT, CAT.MOVIE_THEATER,
                        CAT.SHOPPING_CENTER, CAT.RELIGIOUS_CENTER, CAT.PARKING_LOT, CAT.PARK, CAT.PLAYGROUND, CAT.AIRPORT, CAT.FIRE_DEPARTMENT,
                        CAT.POLICE_STATION, CAT.SEAPORT_MARINA_HARBOR, CAT.FARM, CAT.SCENIC_LOOKOUT_VIEWPOINT]);
            }

            static #getHoursHtml(hasExistingHours = false, alwaysOpen = false) {
                return $('<span>').append(
                    `${hasExistingHours ? 'Hours' : 'No hours'}:`,
                    !alwaysOpen ? $('<input>', {
                        class: 'btn btn-default btn-xs wmeph-btn',
                        id: 'WMEPH_noHours',
                        title: `Add pasted hours${hasExistingHours ? ' to existing hours' : ''}`,
                        type: 'button',
                        value: 'Add hours',
                        style: 'margin-bottom:4px; margin-right:0px; margin-left:3px;'
                    }) : '',
                    hasExistingHours ? $('<input>', {
                        class: 'btn btn-default btn-xs wmeph-btn',
                        id: 'WMEPH_noHours_2',
                        title: 'Replace existing hours with pasted hours',
                        type: 'button',
                        value: 'Replace all hours',
                        style: 'margin-bottom:4px; margin-right:0px; margin-left:3px;'
                    }) : '',
                    // jquery throws an error when setting autocomplete="off" in a jquery object (must use .autocomplete() function), so just use a string here.
                    // eslint-disable-next-line max-len
                    `<textarea id="WMEPH-HoursPaste" wrap="off" autocomplete="off" style="overflow:auto;width:84%;max-width:84%;min-width:84%;font-size:0.85em;height:24px;min-height:24px;max-height:300px;margin-bottom:-2px;padding-left:3px;color:#AAA;position:relative;z-index:1;">${DEFAULT_HOURS_TEXT}`
                )[0].outerHTML;
            }

            static #getTitle(parseResult) {
                let title;
                if (parseResult.overlappingHours) {
                    title = 'Overlapping hours.  Check the existing hours.';
                } else if (parseResult.sameOpenAndCloseTimes) {
                    title = 'Open/close times cannot be the same.';
                } else {
                    title = 'Can\'t parse, try again';
                }
                return title;
            }

            applyHours(replaceAllHours) {
                let pasteHours = $('#WMEPH-HoursPaste').val();
                if (pasteHours === DEFAULT_HOURS_TEXT) {
                    return;
                }
                logDev(pasteHours);
                pasteHours += !replaceAllHours ? `,${getOpeningHours(this.args.venue).join(',')}` : '';
                $('.nav-tabs a[href="#venue-edit-more-info"]').tab('show');
                const parser = new HoursParser();
                const parseResult = parser.parseHours(pasteHours);
                if (parseResult.hours && !parseResult.overlappingHours && !parseResult.sameOpenAndCloseTimes && !parseResult.parseError) {
                    logDev(parseResult.hours);
                    addUpdateAction(this.args.venue, { openingHours: parseResult.hours }, null, true);
                    $('#WMEPH-HoursPaste').val(DEFAULT_HOURS_TEXT);
                } else {
                    log('Can\'t parse those hours');
                    this.severity = SEVERITY.BLUE;
                    this.WLactive = true;
                    $('#WMEPH-HoursPaste').css({ 'background-color': '#FDD' }).attr({ title: Flag.NoHours.#getTitle(parseResult) });
                }
            }

            onAddHoursClick() {
                this.applyHours();
            }

            onReplaceHoursClick() {
                this.applyHours(true);
            }

            static #getDaysString(days) {
                const dayEnum = {
                    1: 'Mon',
                    2: 'Tue',
                    3: 'Wed',
                    4: 'Thu',
                    5: 'Fri',
                    6: 'Sat',
                    7: 'Sun'
                };
                const dayGroups = [];
                let lastGroup;
                let lastGroupDay = -1;
                days.forEach(day => {
                    if (day !== lastGroupDay + 1) {
                        // Not a consecutive day. Start a new group.
                        lastGroup = [];
                        dayGroups.push(lastGroup);
                    }
                    lastGroup.push(day);
                    lastGroupDay = day;
                });

                // Process the groups into strings
                const groupString = [];
                dayGroups.forEach(group => {
                    if (group.length < 3) {
                        group.forEach(day => {
                            groupString.push(dayEnum[day]);
                        });
                    } else {
                        const firstDay = dayEnum[group[0]];
                        const lastDay = dayEnum[group[group.length - 1]];
                        groupString.push(`${firstDay}–${lastDay}`);
                    }
                });
                if (groupString.length === 1 && groupString[0] === 'Mon–Sun') return 'Every day';
                return groupString.join(', ');
            }

            static #formatAmPm(time24Hrs) {
                const re = /^(\d{1,2}):(\d{2})/;
                const match = time24Hrs.match(re);
                if (match) {
                    let hour = parseInt(match[1], 10);
                    const minute = match[2];
                    let suffix;
                    if (hour === 12 && minute === '00') {
                        return 'noon';
                    }
                    if (hour === 0) {
                        if (minute === '00') {
                            return 'midnight';
                        }
                        hour = 12;
                        suffix = 'am';
                    } else if (hour < 12) {
                        suffix = 'am';
                    } else {
                        suffix = 'pm';
                        if (hour > 12) hour -= 12;
                    }
                    return `${hour}${minute === '00' ? '' : `:${minute}`} ${suffix}`;
                }
                return time24Hrs;
            }

            static #getHoursString(hoursObject) {
                if (hoursObject.isAllDay()) return 'All day';
                const fromHour = this.#formatAmPm(hoursObject.fromHour);
                const toHour = this.#formatAmPm(hoursObject.toHour);
                return `${fromHour}–${toHour}`;
            }

            static #getOrderedDaysArray(hoursObject) {
                const days = hoursObject.days.slice();
                // Change Sunday value from 0 to 7
                const sundayIndex = days.indexOf(0);
                if (sundayIndex > -1) {
                    days.splice(sundayIndex, 1);
                    days.push(7);
                }
                days.sort(); // Maybe not needed, but just in case
                return days;
            }

            static #getHoursStringArray(hoursObjects) {
                const daysWithHours = [];
                const outputArray = hoursObjects.map(hoursObject => {
                    const days = this.#getOrderedDaysArray(hoursObject);
                    daysWithHours.push(...days);

                    // Concatenate the group strings and append hours range
                    const daysString = this.#getDaysString(days);
                    const hoursString = this.#getHoursString(hoursObject);
                    return `${daysString}:&nbsp&nbsp${hoursString}`;
                });

                // Find closed days
                const closedDays = [1, 2, 3, 4, 5, 6, 7].filter(day => !daysWithHours.includes(day));
                if (closedDays.length) {
                    outputArray.push(`${this.#getDaysString(closedDays)}:&nbsp&nbspCLOSED`);
                }
                return outputArray;
            }

            postProcess() {
                if (this.args.openingHours.length) {
                    const hoursStringArray = Flag.NoHours.#getHoursStringArray(this.args.openingHours);
                    const $hoursTable = $('<div>', {
                        id: 'wmeph-hours-list',
                        style: 'display: inline-block;font-size: 13px;border: 1px solid #aaa;margin: -6px 2px 2px 0px;border-radius: 0px 0px 5px 5px;background-color: #f5f5f5;color: #727272;'
                            + 'padding: 3px 10px 0px 5px !important;z-index: 0;position: relative;min-width: 84%',
                        title: 'Current hours'
                    }).append(
                        hoursStringArray
                            .map((entry, idx) => `<div${idx < hoursStringArray.length - 1 ? ' style="border-bottom: 1px solid #ddd;"' : ''}>${entry}</div>`)
                            .join('')
                    );

                    $('#WMEPH-HoursPaste').after($hoursTable);
                }
                // NOTE: Leave these wrapped in the "() => ..." functions, to make sure "this" is bound properly.
                $('#WMEPH_noHours').click(() => this.onAddHoursClick());
                $('#WMEPH_noHours_2').click(() => this.onReplaceHoursClick());

                // If pasting or dropping into hours entry box
                function resetHoursEntryHeight() {
                    const $sel = $('#WMEPH-HoursPaste');
                    $sel.focus();
                    const oldText = $sel.val();
                    if (oldText === DEFAULT_HOURS_TEXT) {
                        $sel.val('');
                    }

                    // A small delay to allow window to process pasted text before running.
                    setTimeout(() => {
                        const text = $sel.val();
                        const elem = $sel[0];
                        const lineCount = (text.match(/\n/g) || []).length + 1;
                        const height = lineCount * 18 + 6 + (elem.scrollWidth > elem.clientWidth ? 20 : 0);
                        $sel.css({ height: `${height}px` });
                    }, 0);
                }

                $('#WMEPH-HoursPaste').after($('<i>', {
                    id: 'wmeph-paste-hours-btn',
                    class: 'fa fa-paste',
                    style: 'font-size: 17px;position: relative;vertical-align: top;top: 2px;right: -5px;margin-right: 3px;color: #6c6c6c;cursor: pointer;',
                    title: 'Paste from the clipboard'
                })); // , $('<i>', {
                //     id: 'wmeph-clear-hours-btn',
                //     class: 'fa fa-trash-o',
                //     style: 'font-size: 17px;position: relative;right: -5px;bottom: 6px;color: #6c6c6c;cursor: pointer;margin-left: 5px;',
                //     title: 'Clear pasted hours'
                // }));

                $('#wmeph-paste-hours-btn').click(() => {
                    navigator.clipboard.readText().then(cliptext => {
                        $('#WMEPH-HoursPaste').val(cliptext);
                        resetHoursEntryHeight();
                    }, err => console.error(err));
                });

                // $('#wmeph-clear-hours-btn').click(() => {
                //     $('#WMEPH-HoursPaste').val(null);
                //     resetHoursEntryHeight();
                // });

                $('#WMEPH-HoursPaste')
                    .bind('paste', resetHoursEntryHeight)
                    .bind('drop', resetHoursEntryHeight)
                    .bind('dragenter', evt => {
                        const $control = $(evt.currentTarget);
                        const text = $control.val();
                        if (text === DEFAULT_HOURS_TEXT) {
                            $control.val('');
                        }
                    }).keydown(evt => {
                        // If pressing enter in the hours entry box then parse the entry, or newline if CTRL or SHIFT.
                        resetHoursEntryHeight();
                        if (evt.keyCode === 13) {
                            if (evt.ctrlKey) {
                                // Simulate a newline event (shift + enter)
                                const target = evt.currentTarget;
                                const text = target.value;
                                const selStart = target.selectionStart;
                                target.value = `${text.substr(0, selStart)}\n${text.substr(target.selectionEnd, text.length - 1)}`;
                                target.selectionStart = selStart + 1;
                                target.selectionEnd = selStart + 1;
                                return true;
                            }
                            if (!(evt.shiftKey || evt.ctrlKey) && $(evt.currentTarget).val().length) {
                                evt.stopPropagation();
                                evt.preventDefault();
                                evt.returnValue = false;
                                evt.cancelBubble = true;
                                $('#WMEPH_noHours').click();
                                return false;
                            }
                        }
                        return true;
                    }).focus(evt => {
                        const target = evt.currentTarget;
                        if (target.value === DEFAULT_HOURS_TEXT) {
                            target.value = '';
                        }
                        target.style.color = 'black';
                    }).blur(evt => {
                        const target = evt.currentTarget;
                        if (target.value === '') {
                            target.value = DEFAULT_HOURS_TEXT;
                            target.style.color = '#999';
                        }
                    });
            }
        },
        OldHours: class extends ActionFlag {
            static defaultSeverity = SEVERITY.YELLOW;
            static #categoriesToCheck;
            static #parentCategoriesToCheck = [CAT.SHOPPING_AND_SERVICES, CAT.FOOD_AND_DRINK, CAT.CULTURE_AND_ENTERTAINEMENT];

            get message() {
                let msg = 'Last updated over 3 years ago. Verify hours are correct.';
                if (this.args.venue.isUnchanged()) msg += ' If everything is current, nudge this place and save.';
                return msg;
            }

            get buttonText() {
                return this.args.venue.isUnchanged() ? 'Nudge' : null;
            }

            get severity() {
                return this.args.venue.isUnchanged() ? super.severity : SEVERITY.GREEN;
            }

            static venueIsFlaggable(args) {
                this.#initializeCategoriesToCheck(args.pnhCategoryInfos);
                return !args.venue.isResidential()
                    && this.#venueIsOld(args.venue) // Check uses the updated logic now
                    && args.openingHours?.length
                    && args.categories.some(cat => this.#categoriesToCheck.includes(cat));
            }

            static #initializeCategoriesToCheck(pnhCategoryInfos) {
                if (!this.#categoriesToCheck) {
                    this.#categoriesToCheck = pnhCategoryInfos
                        .toArray()
                        .filter(pnhCategoryInfo => this.#parentCategoriesToCheck.includes(pnhCategoryInfo.parent))
                        .map(catInfo => catInfo.id);
                    this.#categoriesToCheck.push(...this.#parentCategoriesToCheck);
                }
            }

            static #venueIsOld(venue) {
                // Get the timestamp, prioritizing updatedOn, falling back to createdOn
                const lastUpdatedTimestamp = venue.attributes.updatedOn ?? venue.attributes.createdOn;

                // If neither timestamp exists, we can't determine age, so return false
                if (!lastUpdatedTimestamp) {
                    return false;
                }

                const lastUpdatedDate = new Date(lastUpdatedTimestamp);

                // Calculate the date exactly 3 years ago from the current time
                const threeYearsAgo = new Date(); // Gets current date and time
                threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3); // Sets the year back by 3

                // Check if the last updated date is before the date 3 years ago
                return lastUpdatedDate < threeYearsAgo;
            }

            action() {
                nudgeVenue(this.args.venue);
                harmonizePlaceGo(this.args.venue, 'harmonize');
            }
        },
        PlaLotTypeMissing: class extends FlagBase {
            static defaultSeverity = SEVERITY.RED;
            static get defaultMessage() {
                return `Lot type: ${
                    [['PUBLIC', 'Public'], ['RESTRICTED', 'Restricted'], ['PRIVATE', 'Private']]
                        .map(btnInfo => $('<button>', { class: 'wmeph-pla-lot-type-btn btn btn-default btn-xs wmeph-btn', 'data-lot-type': btnInfo[0] })
                            .text(btnInfo[1])
                            .prop('outerHTML')).join('')
                }`;
            }

            static venueIsFlaggable(args) {
                if (args.categories.includes(CAT.PARKING_LOT)) {
                    const catAttr = args.venue.attributes.categoryAttributes;
                    const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                    if (!parkAttr || !parkAttr.parkingType) {
                        return true;
                    }
                }
                return false;
            }

            postProcess() {
                $('.wmeph-pla-lot-type-btn').click(evt => {
                    const lotType = $(evt.currentTarget).data('lot-type');
                    const categoryAttrClone = JSON.parse(JSON.stringify(this.args.venue.attributes.categoryAttributes));
                    categoryAttrClone.PARKING_LOT = categoryAttrClone.PARKING_LOT ?? {};
                    categoryAttrClone.PARKING_LOT.parkingType = lotType;
                    UPDATED_FIELDS.lotType.updated = true;
                    addUpdateAction(this.args.venue, { categoryAttributes: categoryAttrClone }, null, true);
                });
            }
        },
        PlaCostTypeMissing: class extends FlagBase {
            static defaultSeverity = SEVERITY.BLUE;
            static get defaultMessage() {
                return `Parking cost: ${
                    [['FREE', 'Free', 'Free'], ['LOW', '$', 'Low'], ['MODERATE', '$$', 'Moderate'], ['EXPENSIVE', '$$$', 'Expensive']]
                        .map(btnInfo => $('<button>', { id: `wmeph_${btnInfo[0]}`, class: 'wmeph-pla-cost-type-btn btn btn-default btn-xs wmeph-btn', title: btnInfo[2] })
                            .text(btnInfo[1])
                            .css({
                                padding: '3px',
                                height: '20px',
                                lineHeight: '0px',
                                marginRight: '2px',
                                marginBottom: '1px',
                                minWidth: '18px'
                            })
                            .prop('outerHTML')).join('')
                }`;
            }

            static venueIsFlaggable(args) {
                const parkingAttr = args.venue.attributes.categoryAttributes?.PARKING_LOT;
                return args.categories.includes(CAT.PARKING_LOT)
                    && (!parkingAttr?.costType || parkingAttr.costType === 'UNKNOWN');
            }

            postProcess() {
                $('.wmeph-pla-cost-type-btn').click(evt => {
                    const selectedValue = $(evt.currentTarget).attr('id').replace('wmeph_', '');
                    let attrClone;
                    if (this.args.venue.attributes.categoryAttributes) {
                        attrClone = JSON.parse(JSON.stringify(this.args.venue.attributes.categoryAttributes));
                    } else {
                        attrClone = {};
                    }
                    attrClone.PARKING_LOT ??= {};
                    attrClone.PARKING_LOT.costType = selectedValue;
                    addUpdateAction(this.args.venue, { categoryAttributes: attrClone }, null, true);
                    UPDATED_FIELDS.cost.updated = true;
                });
            }
        },
        PlaPaymentTypeMissing: class extends ActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'Parking isn\'t free. Select payment type(s) from the "More info" tab. ';
            static defaultButtonText = 'Go there';

            static venueIsFlaggable(args) {
                if (args.categories.includes(CAT.PARKING_LOT)) {
                    const catAttr = args.venue.attributes.categoryAttributes;
                    const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                    if (parkAttr && parkAttr.costType && parkAttr.costType !== 'FREE' && parkAttr.costType !== 'UNKNOWN' && (!parkAttr.paymentType || !parkAttr.paymentType.length)) {
                        return true;
                    }
                }
                return false;
            }

            // eslint-disable-next-line class-methods-use-this
            action() {
                document.querySelector('#edit-panel wz-tab.venue-edit-tab-more-info').isActive = true;
                // The setTimeout is necessary to allow the previous action to do its thing. A pause isn't needed, just a new thread.
                setTimeout(() => document.querySelector('#venue-edit-more-info wz-select[name="costType"]').scrollIntoView(), 0);
            }
        },
        PlaLotElevationMissing: class extends ActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'No lot elevation. Is it street level?';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Click if street level parking only, or select other option(s) in the More Info tab.';
            noLock = true;

            static venueIsFlaggable(args) {
                if (args.categories.includes(CAT.PARKING_LOT)) {
                    const catAttr = args.venue.attributes.categoryAttributes;
                    const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                    if (!parkAttr || !parkAttr.lotType || parkAttr.lotType.length === 0) {
                        return true;
                    }
                }
                return false;
            }

            action() {
                const attrClone = JSON.parse(JSON.stringify(this.args.venue.attributes.categoryAttributes));
                attrClone.PARKING_LOT = attrClone.PARKING_LOT ?? {};
                attrClone.PARKING_LOT.lotType = ['STREET_LEVEL'];
                addUpdateAction(this.args.venue, { categoryAttributes: attrClone }, null, true);
            }
        },
        PlaSpaces: class extends FlagBase {
            static get defaultMessage() {
                const msg = '# of parking spaces is set to 1-10.<br><b><i>If appropriate</i></b>, select another option:';
                const $btnDiv = $('<div>');
                let btnIdx = 0;
                [
                    ['R_11_TO_30', '11-30'], ['R_31_TO_60', '31-60'], ['R_61_TO_100', '61-100'],
                    ['R_101_TO_300', '101-300'], ['R_301_TO_600', '301-600'], ['R_600_PLUS', '601+']
                ].forEach(btnInfo => {
                    if (btnIdx === 3) $btnDiv.append('<br>');
                    $btnDiv.append(
                        $('<button>', { id: `wmeph_${btnInfo[0]}`, class: 'wmeph-pla-spaces-btn btn btn-default btn-xs wmeph-btn' })
                            .text(btnInfo[1])
                            .css({
                                padding: '3px',
                                height: '20px',
                                lineHeight: '0px',
                                marginTop: '2px',
                                marginRight: '2px',
                                marginBottom: '1px',
                                width: '64px'
                            })
                    );
                    btnIdx++;
                });
                return msg + $btnDiv.prop('outerHTML');
            }

            static venueIsFlaggable(args) {
                if (!args.highlightOnly && args.categories.includes(CAT.PARKING_LOT)) {
                    const catAttr = args.venue.attributes.categoryAttributes;
                    const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                    if (!parkAttr || !parkAttr.estimatedNumberOfSpots || parkAttr.estimatedNumberOfSpots === 'R_1_TO_10') {
                        return true;
                    }
                }
                return false;
            }
        },
        NoPlaStopPoint: class extends ActionFlag {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'Entry/exit point has not been created.';
            static defaultButtonText = 'Add point';
            static defaultButtonTooltip = 'Add an entry/exit point';

            static venueIsFlaggable(args) {
                return args.categories.includes(CAT.PARKING_LOT)
                    && !args.venue.attributes.entryExitPoints?.length;
            }

            action() {
                $('wz-button.navigation-point-add-new').click();
                harmonizePlaceGo(this.args.venue, 'harmonize');
            }
        },
        PlaStopPointUnmoved: class extends FlagBase {
            static defaultSeverity = SEVERITY.BLUE;
            static defaultMessage = 'Entry/exit point has not been moved.';

            static venueIsFlaggable(args) {
                const attr = args.venue.attributes;
                if (args.venue.isParkingLot() && attr.entryExitPoints?.length) {
                    const stopPoint = attr.entryExitPoints[0].getPoint().coordinates;
                    const areaCenter = turf.centroid(args.venue.getGeometry()).geometry.coordinates;
                    return stopPoint[0] === areaCenter[0] && stopPoint[1] === areaCenter[1];
                }
                return false;
            }
        },
        PlaCanExitWhileClosed: class extends ActionFlag {
            static defaultMessage = 'Can cars exit when lot is closed? ';
            static defaultButtonText = 'Yes';

            static venueIsFlaggable(args) {
                return !args.highlightOnly
                    && args.categories.includes(CAT.PARKING_LOT)
                    && !args.venue.attributes.categoryAttributes?.PARKING_LOT?.canExitWhileClosed
                    && ($('#WMEPH-ShowPLAExitWhileClosed').prop('checked') || !(args.openingHours.length === 0 || is247Hours(args.openingHours)));
            }

            action() {
                const attrClone = JSON.parse(JSON.stringify(this.args.venue.attributes.categoryAttributes));
                attrClone.PARKING_LOT = attrClone.PARKING_LOT ?? {};
                attrClone.PARKING_LOT.canExitWhileClosed = true;
                addUpdateAction(this.args.venue, { categoryAttributes: attrClone }, null, true);
            }
        },
        PlaHasAccessibleParking: class extends ActionFlag {
            static defaultMessage = 'Does this lot have disability parking? ';
            static defaultButtonText = 'Yes';

            static venueIsFlaggable(args) {
                return !args.highlightOnly
                    && args.categories.includes(CAT.PARKING_LOT)
                    && !(args.venue.attributes.services?.includes('DISABILITY_PARKING'));
            }

            action() {
                const services = this.args.venue.attributes.services?.slice() ?? [];
                services.push('DISABILITY_PARKING');
                addUpdateAction(this.args.venue, { services }, null, true);
                UPDATED_FIELDS.services_DISABILITY_PARKING.updated = true;
            }
        },
        AllDayHoursFixed: class extends FlagBase {
            static defaultSeverity = SEVERITY.YELLOW;
            static defaultMessage = 'Hours were changed from 00:00-23:59 to "All Day"';

            // If highlightOnly, flag place yellow. Running WMEPH on a place will automatically fix the hours, so
            // then this can be green and just display the message.
            get severity() { return this.args.highlightOnly ? super.severity : SEVERITY.GREEN; }

            static venueIsFlaggable(args) {
                return args.almostAllDayHoursEntries.length > 0;
            }
        },
        LocalURL: class extends FlagBase {
            static defaultMessage = 'Some locations for this business have localized URLs, while others use the primary corporate site.'
                + ' Check if a local URL applies to this location.';

            static venueIsFlaggable(args) {
                return args.localUrlRegexString && !(new RegExp(args.localUrlRegexString, 'i')).test(args.url);
            }
        },
        LockRPP: class extends ActionFlag {
            static defaultButtonText = 'Lock';
            static defaultButtonTooltip = 'Lock the residential point';

            get message() {
                let msg = 'Lock at <select id="RPPLockLevel">';
                let ddlSelected = false;
                for (let llix = 1; llix < 6; llix++) {
                    if (llix < USER.rank + 1) {
                        if (!ddlSelected && (this.args.defaultLockLevel === llix - 1 || llix === USER.rank)) {
                            msg += `<option value="${llix}" selected="selected">${llix}</option>`;
                            ddlSelected = true;
                        } else {
                            msg += `<option value="${llix}">${llix}</option>`;
                        }
                    }
                }
                msg += '</select>';
                msg = `Current lock: ${parseInt(this.args.venue.attributes.lockRank, 10) + 1}. ${msg} ?`;
                return msg;
            }

            static venueIsFlaggable(args) {
                // Allow residential point locking by R3+
                return !args.highlightOnly
                    && args.categories.includes(CAT.RESIDENCE_HOME)
                    && (USER.isDevUser || USER.isBetaUser || USER.rank >= 3);
            }

            action() {
                let levelToLock = $('#RPPLockLevel :selected').val() || this.args.defaultLockLevel + 1;
                logDev(`RPPlevelToLock: ${levelToLock}`);

                levelToLock -= 1;
                if (this.args.venue.attributes.lockRank !== levelToLock) {
                    addUpdateAction(this.args.venue, { lockRank: levelToLock }, null, true);
                }
            }
        },
        AddAlias: class extends ActionFlag {
            static defaultButtonText = 'Yes';

            get message() { return `Is there a ${this.args.pnhMatch.optionalAlias} at this location?`; }
            get buttonTooltip() { return `Add ${this.args.pnhMatch.optionalAlias}`; }

            static venueIsFlaggable(args) {
                return args.pnhMatch.optionalAlias
                    && !args.aliases.includes(args.pnhMatch.optionalAlias);
            }

            action() {
                const attr = this.args.venue.attributes;
                const alias = this.args.pnhMatch.optionalAlias;
                let aliases = insertAtIndex(attr.aliases.slice(), alias, 0);
                if (this.args.pnhMatch.altName2Desc && !attr.description.toUpperCase().includes(alias.toUpperCase())) {
                    const description = `${alias}\n${attr.description}`;
                    addUpdateAction(this.args.venue, { description }, null, false);
                }
                aliases = removeUnnecessaryAliases(name, aliases);
                addUpdateAction(this.args.venue, { aliases }, null, true);
            }
        },
        AddCat2: class extends ActionFlag {
            static defaultButtonText = 'Yes';

            get message() { return `Is there a ${_catTransWaze2Lang[this.altCategory]} at this location?`; }
            get buttonTooltip() { return `Add ${_catTransWaze2Lang[this.altCategory]}`; }

            constructor(venue, altCategory) {
                super();
                this.altCategory = altCategory;
                this.venue = venue;
            }

            static eval(args, altCategory) {
                let result = null;
                if (args.pnhMatch.flagsToAdd?.addCat2 && !args.categories.includes(altCategory)) {
                    result = new this(args.venue, altCategory);
                }
                return result;
            }

            action() {
                const categories = insertAtIndex(this.venue.getCategories(), this.altCategory, 1);
                addUpdateAction(this.venue, { categories }, null, true);
            }
        },
        AddPharm: class extends ActionFlag {
            static defaultMessage = 'Is there a Pharmacy at this location?';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Add Pharmacy category';

            static venueIsFlaggable(args) {
                return args.pnhMatch.flagsToAdd?.addPharm && !args.categories.includes(CAT.PHARMACY);
            }

            action() {
                const categories = insertAtIndex(this.args.venue.getCategories(), CAT.PHARMACY, 1);
                addUpdateAction(this.args.venue, { categories }, null, true);
            }
        },
        AddSuper: class extends ActionFlag {
            static defaultMessage = 'Does this location have a supermarket?';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Add Supermarket category';

            static venueIsFlaggable(args) {
                return args.pnhMatch.flagsToAdd?.addSuper && !args.categories.includes(CAT.SUPERMARKET_GROCERY);
            }

            action() {
                const categories = insertAtIndex(this.args.venue.getCategories(), CAT.SUPERMARKET_GROCERY, 1);
                addUpdateAction(this.args.venue, { categories }, null, true);
            }
        },
        AppendAMPM: class extends ActionFlag {
            // Only used on the ARCO gas station PNH entry.
            static defaultMessage = 'Is there an ampm at this location?';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Add ampm to the place';

            static venueIsFlaggable(args) {
                // No need to check for name/catgory. After the action is run, the name will match the "ARCO ampm"
                // PNH entry, which doesn't have this flag.
                return args.pnhMatch.flagsToAdd?.appendAMPM;
            }

            action() {
                const categories = insertAtIndex(this.args.venue.getCategories(), CAT.CONVENIENCE_STORE, 1);
                addUpdateAction(this.args.venue, { name: 'ARCO ampm', url: 'ampm.com', categories }, null, true);
            }
        },
        AddATM: class extends ActionFlag {
            static defaultMessage = 'ATM at location? ';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Add the ATM category to this place';

            static venueIsFlaggable(args) {
                let flaggable = false;
                if (args.pnhMatch.flagsToAdd?.addATM) {
                    flaggable = true;
                } else if (args.pnhMatch.notABank) {
                    // do nothing
                } else if (!args.categories.includes(CAT.ATM) && args.categories.includes(CAT.BANK_FINANCIAL)) {
                    if (args.priPNHPlaceCat === CAT.BANK_FINANCIAL) {
                        if ((args.categories.indexOf(CAT.OFFICES) !== 0)) {
                            flaggable = true;
                        }
                    } else {
                        flaggable = true;
                    }
                }
                return flaggable;
            }

            action() {
                const categories = insertAtIndex(this.args.venue.getCategories(), CAT.ATM, 1); // Insert ATM category in the second position
                addUpdateAction(this.args.venue, { categories }, null, true);
            }
        },
        AddConvStore: class extends ActionFlag {
            static defaultMessage = 'Add convenience store category? ';
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Add the Convenience Store category to this place';

            static venueIsFlaggable(args) {
                return (args.categories.includes(CAT.GAS_STATION)
                    && !args.categories.includes(CAT.CONVENIENCE_STORE)
                    && !this.currentFlags.hasFlag(Flag.SubFuel)) // Don't flag if already asking if this is really a gas station
                    || args.pnhMatch?.flagsToAdd?.addConvStore;
            }

            action() {
                // Insert C.S. category in the second position
                const categories = insertAtIndex(this.args.venue.getCategories(), CAT.CONVENIENCE_STORE, 1);
                addUpdateAction(this.args.venue, { categories }, null, true);
            }
        },
        IsThisAPostOffice: class extends ActionFlag {
            static defaultMessage = `Is this a <a href="${URLS.uspsWiki}" target="_blank" style="color:#3a3a3a">USPS post office</a>? `;
            static defaultButtonText = 'Yes';
            static defaultButtonTooltip = 'Is this a USPS location?';

            static venueIsFlaggable(args) {
                return !args.highlightOnly
                    && args.countryCode === PNH_DATA.USA.countryCode
                    && !args.venue.isParkingLot()
                    && !args.categories.includes(CAT.POST_OFFICE)
                    && /\bUSP[OS]\b|\bpost(al)?\s+(service|office)\b/i.test(args.nameBase.replace(/[/\-.]/g, ''));
            }

            action() {
                const categories = insertAtIndex(this.args.venue.getCategories(), CAT.POST_OFFICE, 0);
                addUpdateAction(this.args.venue, { categories }, null, true);
            }
        },
        ChangeToHospitalUrgentCare: class extends ActionFlag {
            static defaultMessage = 'If this place provides emergency medical care:';
            static defaultButtonText = 'Change to Hospital / Urgent Care';
            static defaultButtonTooltip = 'Change category to Hospital / Urgent Care';

            static venueIsFlaggable(args) {
                return !args.highlightOnly && args.categories.includes(CAT.DOCTOR_CLINIC);
            }

            action() {
                let categories = this.args.venue.getCategories();
                if (!categories.includes(CAT.HOSPITAL_MEDICAL_CARE)) {
                    const indexToReplace = categories.indexOf(CAT.DOCTOR_CLINIC);
                    if (indexToReplace > -1) {
                        categories = categories.slice(); // create a copy
                        categories[indexToReplace] = CAT.HOSPITAL_URGENT_CARE;
                    }
                    addUpdateAction(this.args.venue, { categories });
                }
                harmonizePlaceGo(this.args.venue, 'harmonize');
            }
        },
        NotAHospital: class extends WLActionFlag {
            static defaultSeverity = SEVERITY.RED;
            static defaultMessage = 'Key words suggest this location may not be a hospital or urgent care location.';
            static defaultButtonText = 'Change to Doctor / Clinic';
            static defaultButtonTooltip = 'Change category to Doctor / Clinic';
            static WL_KEY = 'notAHospital';
            static defaultWLTooltip = 'Whitelist category';

            static venueIsFlaggable(args) {
                if (args.categories.includes(CAT.HOSPITAL_URGENT_CARE) && !this.isWhitelisted(args)) {
                    const testName = args.nameBase.toLowerCase().replace(/[^a-z]/g, ' ');
                    const testNameWords = testName.split(' ');
                    return containsAny(testNameWords, Pnh.HOSPITAL_FULL_MATCH) || Pnh.HOSPITAL_PART_MATCH.some(match => testName.includes(match));
                }
                return false;
            }

            action() {
                let categories = this.args.venue.getCategories().slice();
                let updateIt = false;
                if (categories.length) {
                    const idx = categories.indexOf(CAT.HOSPITAL_URGENT_CARE);
                    if (idx > -1) {
                        categories[idx] = CAT.DOCTOR_CLINIC;
                        updateIt = true;
                    }
                    categories = uniq(categories);
                } else {
                    categories.push(CAT.DOCTOR_CLINIC);
                    updateIt = true;
                }
                if (updateIt) {
                    addUpdateAction(this.args.venue, { categories }, null, true);
                } else {
                    harmonizePlaceGo(this.args.venue, 'harmonize');
                }
            }
        },
        ChangeToDoctorClinic: class extends ActionFlag {
            static defaultMessage = 'If this place provides non-emergency medical care: ';
            static defaultButtonText = 'Change to Doctor / Clinic';
            static defaultButtonTooltip = 'Change category to Doctor / Clinic';

            static venueIsFlaggable(args) {
                // Show the Change To Doctor / Clinic button for places with PERSONAL_CARE or OFFICES category
                // The date criteria was added because Doctor/Clinic category was added around then, and it's assumed if the
                // place has been edited since then, people would have already updated the category.
                return !args.highlightOnly
                    && args.venue.attributes.updatedOn < new Date('3/28/2017').getTime()
                    && ((args.categories.includes(CAT.PERSONAL_CARE) && !args.pnhNameRegMatch) || args.categories.includes(CAT.OFFICES));
            }

            action() {
                let categories = this.args.venue.getCategories().slice();
                let updateIt = false;
                if (categories.length) {
                    [CAT.OFFICES, CAT.PERSONAL_CARE].forEach(cat => {
                        const idx = categories.indexOf(cat);
                        if (idx > -1) {
                            categories[idx] = CAT.DOCTOR_CLINIC;
                            updateIt = true;
                        }
                    });
                    categories = uniq(categories);
                } else {
                    categories.push(CAT.DOCTOR_CLINIC);
                    updateIt = true;
                }
                if (updateIt) {
                    addUpdateAction(this.args.venue, { categories });
                }
                harmonizePlaceGo(this.args.venue, 'harmonize');
            }
        },
        TitleCaseName: class extends ActionFlag {
            static defaultButtonText = 'Force Title Case?';
            #confirmChange = false;
            #originalName;
            #titleCaseName;
            noBannerAssemble = true;

            get message() { return `${this.#titleCaseName}${this.args.nameSuffix || ''}`; }
            get buttonTooltip() { return `Rename to: ${this.#titleCaseName}${this.args.nameSuffix || ''}`; }

            constructor(args) {
                super();
                this.#titleCaseName = titleCase(args.nameBase);
                this.#originalName = args.nameBase + (args.nameSuffix || '');
            }

            static venueIsFlaggable(args) {
                return !args.pnhNameRegMatch && args.nameBase !== titleCase(args.nameBase);
            }

            action() {
                let name = this.args.venue.getName();
                if (name === this.#originalName || this.#confirmChange) {
                    const parts = getNameParts(this.#originalName);
                    name = titleCase(parts.base);
                    if (parts.base !== name) {
                        addUpdateAction(this.args.venue, { name: name + (parts.suffix || '') });
                    }
                    harmonizePlaceGo(this.args.venue, 'harmonize');
                } else {
                    $('button#WMEPH_titleCaseName').text('Are you sure?').after(' The name has changed. This will overwrite the new name.');
                    this.#confirmChange = true;
                }
            }
        },
        SFAliases: class extends FlagBase {
            static defaultMessage = 'Unnecessary aliases were removed.';

            static venueIsFlaggable(args) {
                return args.aliasesRemoved;
            }
        },
        PlaceMatched: class extends FlagBase {
            static defaultMessage = 'Place matched from PNH data.';

            static venueIsFlaggable(args) {
                return args.pnhNameRegMatch;
            }
        },
        PlaceLocked: class extends FlagBase {
            static defaultMessage = 'Place locked.';
            constructor(args) {
                super();

                if (args.venue.attributes.lockRank < args.levelToLock) {
                    if (!args.highlightOnly) {
                        logDev('Venue locked!');
                        args.actions.push(new UpdateObject(args.venue, { lockRank: args.levelToLock }));
                        UPDATED_FIELDS.lockRank.updated = true;
                    } else {
                        this.hlLockFlag = true;
                    }
                }
            }

            static venueIsFlaggable(args) {
                return args.lockOK && args.totalSeverity < SEVERITY.YELLOW;
            }
        },
        NewPlaceSubmit: class extends ActionFlag {
            static defaultMessage = 'No PNH match. If it\'s a chain: ';
            static defaultButtonText = 'Submit new chain data';
            static defaultButtonTooltip = 'Submit info for a new chain through the linked form';
            #formUrl;

            constructor(args) {
                super();

                // Make PNH submission link
                const encodedName = encodeURIComponent(args.nameBase);
                const encodedPermalink = encodeURIComponent(args.placePL);
                const encodedUrl = encodeURIComponent(args.newUrl?.trim() ?? '');
                const regionSettings = PNH_DATA[args.countryCode].regions[args.regionCode];
                let entryValues;
                if (['CA_EN', 'QC'].includes(args.region)) {
                    entryValues = [encodedName, encodedUrl, USER.name, encodedPermalink];
                } else {
                    entryValues = [encodedName, encodedUrl, USER.name + args.gFormState];
                }
                this.#formUrl = regionSettings.getNewChainFormUrl(entryValues);
            }

            static venueIsFlaggable(args) {
                return !args.highlightOnly
                    && args.pnhMatch[0] === 'NoMatch'
                    && !args.venue.isParkingLot()
                    && !CHAIN_APPROVAL_PRIMARY_CATS_TO_IGNORE.includes(args.categories[0])
                    && !args.categories.includes(CAT.REST_AREAS);
            }

            action() {
                window.open(this.#formUrl);
            }
        },
        ApprovalSubmit: class extends ActionFlag {
            static defaultMessage = 'PNH data exists but is not approved for this region: ';
            static defaultButtonText = 'Request approval';
            static defaultButtonTooltip = 'Request region/country approval of this place';
            #formUrl;

            constructor(args) {
                super();

                const encodedName = encodeURIComponent(args.pnhMatch[1][0]); // Just do the first match
                const pnhOrderNum = args.pnhMatch[2].join(',');
                const approvalMessage = `Submitted via WMEPH. PNH order number ${pnhOrderNum}`;
                const encodedPermalink = encodeURIComponent(args.placePL);
                const regionSettings = PNH_DATA[args.countryCode].regions[args.regionCode];
                let entryValues;
                if (['CA_EN', 'QC'].includes(args.region)) {
                    entryValues = [encodedName, approvalMessage, USER.name, encodedPermalink];
                } else {
                    entryValues = [encodedName, approvalMessage, USER.name + args.gFormState];
                }
                this.#formUrl = regionSettings.getApproveChainFormUrl(entryValues);
            }

            static venueIsFlaggable(args) {
                return !args.highlightOnly
                    && args.pnhMatch[0] === 'ApprovalNeeded'
                    && !args.venue.isParkingLot()
                    && !CHAIN_APPROVAL_PRIMARY_CATS_TO_IGNORE.includes(args.categories[0])
                    && !args.categories.includes(CAT.REST_AREAS);
            }

            action() {
                window.open(this.#formUrl);
            }
        },
        LocationFinder: class extends ActionFlag {
            static defaultButtonTooltip = 'Look up details about this location on the chain\'s finder web page.';
            static #USPS_LOCATION_FINDER_URL = 'https://tools.usps.com/find-location.htm';
            #storeFinderUrl;
            #isCustom = false;

            get buttonText() { return `Location Finder${this.isCustom ? ' (L)' : ''}`; }

            constructor(venue, storeFinderUrl, isCustom, addr, state2L, venueGPS) {
                super();
                this.isCustom = isCustom;
                this.venue = venue;
                this.#isCustom = isCustom;
                this.#storeFinderUrl = storeFinderUrl;
                this.#processUrl(venue, addr, state2L, venueGPS);
            }

            static #venueIsFlaggable(highlightOnly, storeFinderUrl) {
                return !highlightOnly && storeFinderUrl;
            }

            // TODO: Can this be put into venueIsFlaggable?
            static eval(args) {
                const isUsps = args.countryCode === PNH_DATA.USA.countryCode && !args.categories.includes(CAT.PARKING_LOT)
                    && args.categories.includes(CAT.POST_OFFICE);
                let storeFinderUrl;
                let isCustom = false;
                if (isUsps) {
                    storeFinderUrl = this.#USPS_LOCATION_FINDER_URL;
                } else {
                    storeFinderUrl = args.pnhMatch.sfurllocal;
                    if (storeFinderUrl) {
                        isCustom = true;
                    } else {
                        storeFinderUrl = args.pnhMatch.sfurl;
                    }
                }

                return this.#venueIsFlaggable(args.highlightOnly, storeFinderUrl)
                    ? new this(args.venue, storeFinderUrl, isCustom, args.addr, args.state2L, args.venueGPS)
                    : null;
            }

            #processUrl(venue, addr, state2L, venueGPS) {
                if (this.#isCustom) {
                    const location = venue.getOLGeometry().getCentroid();
                    const { houseNumber } = venue.attributes;

                    const urlParts = this.#storeFinderUrl.replace(/ /g, '').split('<>');
                    let searchStreet = '';
                    let searchCity = '';
                    let searchState = '';
                    if (typeof addr.street.getName() === 'string') {
                        searchStreet = addr.street.getName();
                    }
                    const searchStreetPlus = searchStreet.replace(/ /g, '+');
                    searchStreet = searchStreet.replace(/ /g, '%20');
                    if (typeof addr.city.getName() === 'string') {
                        searchCity = addr.city.getName();
                    }
                    const searchCityPlus = searchCity.replace(/ /g, '+');
                    searchCity = searchCity.replace(/ /g, '%20');
                    if (typeof addr.state.getName() === 'string') {
                        searchState = addr.state.getName();
                    }
                    const searchStatePlus = searchState.replace(/ /g, '+');
                    searchState = searchState.replace(/ /g, '%20');

                    if (!venueGPS) venueGPS = OpenLayers.Layer.SphericalMercator.inverseMercator(location.x, location.y);
                    this.#storeFinderUrl = '';
                    for (let tlix = 1; tlix < urlParts.length; tlix++) {
                        let part = '';
                        switch (urlParts[tlix]) {
                            case 'ph_streetName':
                                part = searchStreet;
                                break;
                            case 'ph_streetNamePlus':
                                part = searchStreetPlus;
                                break;
                            case 'ph_cityName':
                                part = searchCity;
                                break;
                            case 'ph_cityNamePlus':
                                part = searchCityPlus;
                                break;
                            case 'ph_stateName':
                                part = searchState;
                                break;
                            case 'ph_stateNamePlus':
                                part = searchStatePlus;
                                break;
                            case 'ph_state2L':
                                part = state2L;
                                break;
                            case 'ph_latitudeEW':
                                // customStoreFinderLocalURL = customStoreFinderLocalURL + venueGPS[0];
                                break;
                            case 'ph_longitudeNS':
                                // customStoreFinderLocalURL = customStoreFinderLocalURL + venueGPS[1];
                                break;
                            case 'ph_latitudePM':
                                part = venueGPS.lat;
                                break;
                            case 'ph_longitudePM':
                                part = venueGPS.lon;
                                break;
                            case 'ph_latitudePMBuffMin':
                                part = (venueGPS.lat - 0.025).toString();
                                break;
                            case 'ph_longitudePMBuffMin':
                                part = (venueGPS.lon - 0.025).toString();
                                break;
                            case 'ph_latitudePMBuffMax':
                                part = (venueGPS.lat + 0.025).toString();
                                break;
                            case 'ph_longitudePMBuffMax':
                                part = (venueGPS.lon + 0.025).toString();
                                break;
                            case 'ph_houseNumber':
                                part = houseNumber ?? '';
                                break;
                            default:
                                part = urlParts[tlix];
                        }
                        this.#storeFinderUrl += part;
                    }
                }
                if (!/^https?:\/\//.test(this.#storeFinderUrl)) {
                    this.#storeFinderUrl = `http://${this.#storeFinderUrl}`;
                }
            }

            #openStoreFinderWebsite() {
                if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
                    window.open(this.#storeFinderUrl);
                } else {
                    window.open(this.#storeFinderUrl, SEARCH_RESULTS_WINDOW_NAME, _searchResultsWindowSpecs);
                }
            }

            action() {
                // If the user has 'never' opened a localized store finder URL, then warn them (just once)
                if (localStorage.getItem(SETTING_IDS.sfUrlWarning) === '0' && this.#isCustom) {
                    WazeWrap.Alerts.confirm(
                        SCRIPT_NAME,
                        '***Localized store finder sites often show multiple nearby results. Please make sure you pick the right location.'
                            + '<br>Click OK to agree and continue.',
                        () => {
                            localStorage.setItem(SETTING_IDS.sfUrlWarning, '1'); // prevent future warnings
                            this.#openStoreFinderWebsite();
                        },
                        () => { }
                    );
                    return;
                }
                this.#openStoreFinderWebsite();
            }
        }
    }; // END Flag namespace

    class FlagContainer {
        static #flagOrder = [
            Flag.ChainIsClosed,
            Flag.EVChargingStationWarning,
            Flag.PnhCatMess,
            Flag.NotAHospital,
            Flag.NotASchool,
            Flag.FullAddressInference,
            Flag.NameMissing,
            Flag.GasNameMissing,
            Flag.PlaIsPublic,
            Flag.PlaNameMissing,
            Flag.PlaNameNonStandard,
            Flag.IndianaLiquorStoreHours,
            Flag.HoursOverlap,
            Flag.UnmappedRegion,
            Flag.RestAreaName,
            Flag.RestAreaNoTransportation,
            Flag.RestAreaGas,
            Flag.RestAreaScenic,
            Flag.RestAreaSpec,
            Flag.GasMismatch,
            Flag.GasUnbranded,
            Flag.GasMkPrim,
            Flag.IsThisAPilotTravelCenter,
            Flag.HotelMkPrim,
            Flag.ChangeToPetVet,
            Flag.PointNotArea,
            Flag.AreaNotPoint,
            Flag.HnMissing,
            Flag.HnTooManyDigits,
            Flag.HNRange,
            Flag.StreetMissing,
            Flag.CityMissing,
            Flag.BankType1,
            Flag.BankBranch,
            Flag.StandaloneATM,
            Flag.BankCorporate,
            Flag.CatPostOffice,
            Flag.IgnEdited,
            Flag.WazeBot,
            Flag.ParentCategory,
            Flag.CheckDescription,
            Flag.Overlapping,
            Flag.SuspectDesc,
            Flag.ResiTypeName,
            Flag.PhoneInvalid,
            Flag.UrlMismatch,
            Flag.UrlAnalytics,
            Flag.GasNoBrand,
            Flag.SubFuel,
            Flag.FormatUSPS,
            Flag.MissingUSPSAlt,
            Flag.MissingUSPSZipAlt,
            Flag.MissingUSPSDescription,
            Flag.CatHotel,
            Flag.LocalizedName,
            Flag.SpecCaseMessage,
            Flag.ChangeToDoctorClinic,
            Flag.ExtProviderMissing,
            Flag.AddCommonEVPaymentMethods,
            Flag.RemoveUncommonEVPaymentMethods,
            Flag.UrlMissing,
            Flag.InvalidUrl,
            Flag.AddRecommendedPhone,
            Flag.BadAreaCode,
            Flag.PhoneMissing,
            Flag.OldHours,
            Flag.Mismatch247,
            Flag.NoHours,
            Flag.AllDayHoursFixed,
            Flag.EVCSPriceMissing,
            Flag.PlaLotTypeMissing,
            Flag.PlaCostTypeMissing,
            Flag.PlaPaymentTypeMissing,
            Flag.PlaLotElevationMissing,
            Flag.PlaSpaces,
            Flag.NoPlaStopPoint,
            Flag.PlaStopPointUnmoved,
            Flag.PlaCanExitWhileClosed,
            Flag.PlaHasAccessibleParking,
            Flag.LocalURL,
            Flag.LockRPP,
            Flag.AddAlias,
            Flag.EVCSAltNameMissing,
            Flag.AddCat2,
            Flag.AddPharm,
            Flag.AddSuper,
            Flag.AppendAMPM,
            Flag.AddATM,
            Flag.AddConvStore,
            Flag.IsThisAPostOffice,
            Flag.TitleCaseName,
            Flag.ChangeToHospitalUrgentCare,
            Flag.SFAliases,
            Flag.ClearThisPhone,
            Flag.ClearThisUrl,
            Flag.PlaceMatched,
            Flag.PlaceLocked,
            Flag.NewPlaceSubmit,
            Flag.ApprovalSubmit,
            Flag.LocationFinder
        ];

        static #isIndexed = false;
        #flags = [];

        constructor() {
            FlagContainer.#indexFlags();
        }

        static #indexFlags() {
            if (!this.#isIndexed) {
                let displayIndex = 1;
                this.#flagOrder.forEach(flagClass => (flagClass.displayIndex = displayIndex++));
                this.#isIndexed = true;
            }
        }

        add(flag) {
            if (flag) this.#flags.push(flag);
        }

        remove(flagClass) {
            const idx = this.#flags.indexOf(flagClass);
            if (idx > -1) this.#flags.splice(idx, 1);
        }

        getOrderedFlags() {
            return this.#flags.slice().sort((f1, f2) => {
                const idx1 = f1.constructor.displayIndex;
                const idx2 = f2.constructor.displayIndex;

                if (idx1 > idx2) return 1;
                if (idx1 < idx2) return -1;
                return 0;
            });
        }

        hasFlag(flagClass) {
            return this.#flags.some(flag => flag.constructor === flagClass);
        }
    }

    function getServicesBanner() {
        // set up banner action buttons.  Structure:
        // active: false until activated in the script
        // checked: whether the service is already set on the place. Determines grey vs white icon color
        // icon: button icon name
        // value: button text  (Not used for Icons, keep as backup
        // title: tooltip text
        // action: The action that happens if the button is pressed
        return {
            addValet: {
                active: false,
                checked: false,
                icon: 'serv-valet',
                w2hratio: 50 / 50,
                value: 'Valet',
                title: 'Valet service',
                servIDIndex: 0,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addDriveThru: {
                active: false,
                checked: false,
                icon: 'serv-drivethru',
                w2hratio: 78 / 50,
                value: 'DriveThru',
                title: 'Drive-thru',
                servIDIndex: 1,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addWiFi: {
                active: false,
                checked: false,
                icon: 'serv-wifi',
                w2hratio: 67 / 50,
                value: 'WiFi',
                title: 'Wi-Fi',
                servIDIndex: 2,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addRestrooms: {
                active: false,
                checked: false,
                icon: 'serv-restrooms',
                w2hratio: 49 / 50,
                value: 'Restroom',
                title: 'Restrooms',
                servIDIndex: 3,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addCreditCards: {
                active: false,
                checked: false,
                icon: 'serv-credit',
                w2hratio: 73 / 50,
                value: 'CC',
                title: 'Accepts credit cards',
                servIDIndex: 4,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addReservations: {
                active: false,
                checked: false,
                icon: 'serv-reservations',
                w2hratio: 55 / 50,
                value: 'Reserve',
                title: 'Reservations',
                servIDIndex: 5,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addOutside: {
                active: false,
                checked: false,
                icon: 'serv-outdoor',
                w2hratio: 73 / 50,
                value: 'OusideSeat',
                title: 'Outdoor seating',
                servIDIndex: 6,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addAC: {
                active: false,
                checked: false,
                icon: 'serv-ac',
                w2hratio: 50 / 50,
                value: 'AC',
                title: 'Air conditioning',
                servIDIndex: 7,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addParking: {
                active: false,
                checked: false,
                icon: 'serv-parking',
                w2hratio: 46 / 50,
                value: 'Customer parking',
                title: 'Parking',
                servIDIndex: 8,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addDeliveries: {
                active: false,
                checked: false,
                icon: 'serv-deliveries',
                w2hratio: 86 / 50,
                value: 'Delivery',
                title: 'Deliveries',
                servIDIndex: 9,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addTakeAway: {
                active: false,
                checked: false,
                icon: 'serv-takeaway',
                w2hratio: 34 / 50,
                value: 'Take-out',
                title: 'Take-out',
                servIDIndex: 10,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addCurbside: {
                active: true,
                checked: false,
                icon: 'serv-curbside',
                w2hratio: 50 / 50,
                value: 'Curbside pickup',
                title: 'Curbside pickup',
                servIDIndex: 11,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addWheelchair: {
                active: false,
                checked: false,
                icon: 'serv-wheelchair',
                w2hratio: 50 / 50,
                value: 'WhCh',
                title: 'Wheelchair accessible',
                servIDIndex: 12,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            addDisabilityParking: {
                active: false,
                checked: false,
                icon: 'serv-wheelchair',
                w2hratio: 50 / 50,
                value: 'DisabilityParking',
                title: 'Disability parking',
                servIDIndex: 13,
                action(actions, checked) {
                    setServiceChecked(this, checked, actions);
                },
                pnhOverride: false,
                actionOn(actions) {
                    this.action(actions, true);
                },
                actionOff(actions) {
                    this.action(actions, false);
                }
            },
            add247: {
                active: false,
                checked: false,
                icon: 'serv-247',
                w2hratio: 73 / 50,
                value: '247',
                title: 'Hours: Open 24/7',
                action(actions) {
                    if (!_servicesBanner.add247.checked) {
                        const venue = getSelectedVenue();
                        _servicesBanner.add247.checked = true;
                        addUpdateAction(venue, { openingHours: [new OpeningHour({ days: [1, 2, 3, 4, 5, 6, 0], fromHour: '00:00', toHour: '00:00' })] }, actions);
                        // _buttonBanner.noHours = null;
                        // TODO: figure out how to keep the noHours flag without causing an infinite loop when
                        // called from psOn_add247 speccase. Don't call harmonizePlaceGo here.
                    }
                },
                actionOn(actions) {
                    this.action(actions);
                }
            }
        };
    } // END getServicesBanner()

    function getButtonBanner2(venue, placePL) {
        return {
            placesWiki: {
                active: true,
                severity: 0,
                message: '',
                value: 'Places wiki',
                title: 'Open the places Wazeopedia (wiki) page',
                action() {
                    window.open(URLS.placesWiki);
                }
            },
            restAreaWiki: {
                active: false,
                severity: 0,
                message: '',
                value: 'Rest Area wiki',
                title: 'Open the Rest Area wiki page',
                action() {
                    window.open(URLS.restAreaWiki);
                }
            },
            clearWL: {
                active: false,
                severity: 0,
                message: '',
                value: 'Clear place whitelist',
                title: 'Clear all Whitelisted fields for this place',
                action() {
                    WazeWrap.Alerts.confirm(
                        SCRIPT_NAME,
                        'Are you sure you want to clear all whitelisted fields for this place?',
                        () => {
                            delete _venueWhitelist[venue.attributes.id];
                            // Remove venue from the results cache so it can be updated again.
                            delete _resultsCache[venue.attributes.id];
                            saveWhitelistToLS(true);
                            harmonizePlaceGo(venue, 'harmonize');
                        },
                        () => { },
                        'Yes',
                        'No'
                    );
                }
            },
            PlaceErrorForumPost: {
                active: true,
                severity: 0,
                message: '',
                value: 'Report script error',
                title: 'Report a script error',
                action() {
                    reportError({
                        subject: 'WMEPH Bug report: Script Error',
                        message: `Script version: ${SCRIPT_VERSION}${BETA_VERSION_STR}\nPermalink: ${
                            placePL}\nPlace name: ${venue.attributes.name}\nCountry: ${
                            venue.getAddress().getCountry().name}\n--------\nDescribe the error:  \n `
                    });
                }
            }
        };
    } // END getButtonBanner2()

    class HarmonizationArgs {
        venue = null;
        countryCode = null;
        actions = null;
        highlightOnly = true;
        /** @type {SEVERITY} */
        totalSeverity = SEVERITY.GREEN;
        /** @type {number} */
        levelToLock = null;
        lockOK = true;
        isLocked = false;

        // Current venue attributes
        /** @type {string[]} */
        categories = null;
        /** @type {string} */
        nameSuffix = null;
        /** @type {string} */
        nameBase = null;
        /** @type {string[]} */
        aliases = null;
        /** @type {string} */
        description = null;
        /** @type {string} */
        url = null;
        /** @type {string} */
        phone = null;
        /** @type {[]} */
        openingHours = null;

        /**
         * Will temporarily contain an array of information
         * during matching, but eventually contains a single PnhEntry object.
         * @type {PnhEntry}
        */
        pnhMatch = null;
        showDispNote = true;
        hoursOverlap = false;
        descriptionInserted = false;
        aliasesRemoved = false;
        isUspsPostOffice = false;
        maxPointSeverity = SEVERITY.GREEN;
        maxAreaSeverity = SEVERITY.RED;
        almostAllDayHoursEntries = [];
        defaultLockLevel = LOCK_LEVEL_2;
        state2L = 'Unknown';
        regionCode = 'Unknown';
        gFormState = '';
        wl = {};
        outputPhoneFormat = '({0}) {1}-{2}';

        constructor(venue, actions, highlightOnly) {
            this.venue = venue;

            this.highlightOnly = highlightOnly;
            this.addr = venue.getAddress();
            this.addr = this.addr.attributes ?? this.addr;

            this.actions = actions;
            this.categories = venue.attributes.categories.slice();
            const nameParts = getNameParts(venue.attributes.name);
            this.nameSuffix = nameParts.suffix;
            this.nameBase = nameParts.base;
            this.aliases = venue.attributes.aliases.slice();
            this.description = venue.attributes.description;
            this.url = venue.attributes.url;
            this.phone = venue.attributes.phone;
            this.openingHours = venue.attributes.openingHours;
            // Set up a variable (newBrand) to contain the brand. When harmonizing, it may be forced to a new value.
            // Other brand flags should use it since it won't be updated on the actual venue until later.
            this.brand = venue.attributes.brand;
        }
    }

    // Main script
    function harmonizePlaceGo(venue, useFlag, actions) {
        if (useFlag === 'harmonize') logDev('harmonizePlaceGo: useFlag="harmonize"');

        const venueID = venue.attributes.id;

        // Used for collecting all actions to be applied to the model.
        actions = actions || [];

        FlagBase.currentFlags = new FlagContainer();
        const args = new HarmonizationArgs(venue, actions, !useFlag.includes('harmonize'));

        let pnhLockLevel;
        if (!args.highlightOnly) {
            // Uncomment this to test all field highlights.
            // _UPDATED_FIELDS.getFieldProperties().forEach(prop => {
            //     prop.updated = true;
            // });

            // The placePL should only be needed when harmonizing, not when highlighting.
            args.placePL = getCurrentPL() //  set up external post div and pull place PL
                .replace(/&layers=[^&]+(&?)/g, '$1') // remove Permalink Layers
                .replace(/&s=[^&]+(&?)/g, '$1') // remove Permalink Layers
                .replace(/&update_requestsFilter=[^&]+(&?)/g, '$1') // remove Permalink Layers
                .replace(/&problemsFilter=[^&]+(&?)/g, '$1') // remove Permalink Layers
                .replace(/&mapProblemFilter=[^&]+(&?)/g, '$1') // remove Permalink Layers
                .replace(/&mapUpdateRequestFilter=[^&]+(&?)/g, '$1') // remove Permalink Layers
                .replace(/&venueFilter=[^&]+(&?)/g, '$1'); // remove Permalink Layers

            _buttonBanner2 = getButtonBanner2(venue, args.placePL);
            _servicesBanner = getServicesBanner();

            // Update icons to reflect current WME place services
            updateServicesChecks(_servicesBanner);

            // Setting switch for the Places Wiki button
            if ($('#WMEPH-HidePlacesWiki').prop('checked')) {
                _buttonBanner2.placesWiki.active = false;
            }

            if ($('#WMEPH-HideReportError').prop('checked')) {
                _buttonBanner2.PlaceErrorForumPost.active = false;
            }

            // reset PNH lock level
            pnhLockLevel = -1;
        }

        // Some user submitted places have no data in the country, state and address fields.
        const result = Flag.FullAddressInference.eval(args);
        if (result?.exit) return result.severity;
        const inferredAddress = result?.inferredAddress;
        args.addr = inferredAddress ?? args.addr;

        // Check parking lot attributes.
        if (!args.highlightOnly && venue.isParkingLot()) _servicesBanner.addDisabilityParking.active = true;

        // Whitelist breakout if place exists on the Whitelist and the option is enabled
        if (_venueWhitelist.hasOwnProperty(venueID) && (!args.highlightOnly || (args.highlightOnly && !$('#WMEPH-DisableWLHL').prop('checked')))) {
            // Enable the clear WL button if any property is true
            Object.keys(_venueWhitelist[venueID]).forEach(wlKey => { // loop thru the venue WL keys
                if (_venueWhitelist[venueID].hasOwnProperty(wlKey) && (_venueWhitelist[venueID][wlKey].active || false)) {
                    if (!args.highlightOnly) _buttonBanner2.clearWL.active = true;
                    args.wl[wlKey] = _venueWhitelist[venueID][wlKey];
                }
            });
            if (_venueWhitelist[venueID].hasOwnProperty('dupeWL') && _venueWhitelist[venueID].dupeWL.length > 0) {
                if (!args.highlightOnly) _buttonBanner2.clearWL.active = true;
                args.wl.dupeWL = _venueWhitelist[venueID].dupeWL;
            }
            // Update address and GPS info for the place
            if (!args.highlightOnly) {
                // get GPS lat/long coords from place, call as venueGPS.lat, venueGPS.lon
                if (!args.venueGPS) {
                    const centroid = venue.getOLGeometry().getCentroid();
                    args.venueGPS = OpenLayers.Layer.SphericalMercator.inverseMercator(centroid.x, centroid.y);
                }
                _venueWhitelist[venueID].city = args.addr.city.getName(); // Store city for the venue
                _venueWhitelist[venueID].state = args.addr.state.getName(); // Store state for the venue
                _venueWhitelist[venueID].country = args.addr.country.getName(); // Store country for the venue
                _venueWhitelist[venueID].gps = args.venueGPS; // Store GPS coords for the venue
            }
        }

        // Country restrictions (note that FullAddressInference should guarantee country/state exist if highlightOnly is true)
        if (!args.addr.country || !args.addr.state) {
            WazeWrap.Alerts.error(SCRIPT_NAME, 'Country and/or state could not be determined.  Edit the place address and run WMEPH again.');
            return undefined;
        }

        const countryName = args.addr.country.getName();
        const stateName = args.addr.state.getName();
        if (['United States', 'American Samoa', 'Guam', 'Northern Mariana Islands', 'Puerto Rico', 'Virgin Islands (U.S.)'].includes(countryName)) {
            args.countryCode = PNH_DATA.USA.countryCode;
        } else if (countryName === PNH_DATA.CAN.countryName) {
            args.countryCode = PNH_DATA.CAN.countryCode;
        } else {
            if (!args.highlightOnly) {
                WazeWrap.Alerts.error(SCRIPT_NAME, `This script is not currently supported in ${countryName}.`);
            }
            return SEVERITY.RED;
        }

        args.pnhCategoryInfos = PNH_DATA[args.countryCode].categoryInfos;

        // Parse state-based data
        for (let usdix = 1; usdix < PNH_DATA.states.length; usdix++) {
            _stateDataTemp = PNH_DATA.states[usdix].split('|');
            if (stateName === _stateDataTemp[_psStateIx]) {
                args.state2L = _stateDataTemp[_psState2LetterIx];
                args.regionCode = _stateDataTemp[_psRegionIx];
                args.gFormState = _stateDataTemp[_psGoogleFormStateIx];
                if (_stateDataTemp[_psDefaultLockLevelIx].match(/[1-5]{1}/) !== null) {
                    args.defaultLockLevel = _stateDataTemp[_psDefaultLockLevelIx] - 1; // normalize by -1
                } else if (!args.highlightOnly) {
                    WazeWrap.Alerts.warning(SCRIPT_NAME, 'Lock level sheet data is not correct');
                } else {
                    return 3;
                }
                _areaCodeList = `${_areaCodeList},${_stateDataTemp[_psAreaCodeIx]}`;
                break;
            }
            // If State is not found, then use the country
            if (countryName === _stateDataTemp[_psStateIx]) {
                args.state2L = _stateDataTemp[_psState2LetterIx];
                args.regionCode = _stateDataTemp[_psRegionIx];
                args.gFormState = _stateDataTemp[_psGoogleFormStateIx];
                if (_stateDataTemp[_psDefaultLockLevelIx].match(/[1-5]{1}/) !== null) {
                    args.defaultLockLevel = _stateDataTemp[_psDefaultLockLevelIx] - 1; // normalize by -1
                } else if (!args.highlightOnly) {
                    WazeWrap.Alerts.warning(SCRIPT_NAME, 'Lock level sheet data is not correct');
                } else {
                    return 3;
                }
                _areaCodeList = `${_areaCodeList},${_stateDataTemp[_psAreaCodeIx]}`;
                break;
            }
        }
        if (args.state2L === 'Unknown' || args.regionCode === 'Unknown') { // if nothing found:
            if (!args.highlightOnly) {
                /* if (confirm('WMEPH: Localization Error!\nClick OK to report this error')) {
                    // if the category doesn't translate, then pop an alert that will make a forum post to the thread
                    const data = {
                        subject: 'WMEPH Localization Error report',
                        message: `Error report: Localization match failed for "${stateName}".`
                    };
                    if (_PNH_DATA.states.length === 0) {
                        data.message += ' _PNH_DATA.states array is empty.';
                    } else {
                        data.message += ` state2L = ${_stateDataTemp[_psState2LetterIx]}. region = ${_stateDataTemp[_psRegionIx]}`;
                    }
                    reportError(data);
                } */
                WazeWrap.Alerts.confirm(
                    SCRIPT_NAME,
                    'WMEPH: Localization Error!<br>Click OK to report this error',
                    () => {
                        const data = {
                            subject: 'WMEPH Localization Error report',
                            message: `Error report: Localization match failed for "${stateName}".`
                        };
                        if (PNH_DATA.states.length === 0) {
                            data.message += ' _PNH_DATA.states array is empty.';
                        } else {
                            data.message += ` state2L = ${_stateDataTemp[_psState2LetterIx]}. region = ${_stateDataTemp[_psRegionIx]}`;
                        }
                        reportError(data);
                    },
                    () => { }
                );
            }
            return SEVERITY.RED;
        }

        // Gas station treatment (applies to all including PNH)

        if (!args.highlightOnly && args.state2L === 'TN' && args.nameBase.toLowerCase().trim() === 'pilot') {
            // TODO: check what happens here if there's a name suffix.
            args.nameBase = 'Pilot Food Mart';
            addUpdateAction(venue, { name: args.nameBase }, actions);
        }

        // Clear attributes from residential places
        if (venue.attributes.residential) {
            if (!args.highlightOnly) {
                if (!$('#WMEPH-AutoLockRPPs').prop('checked')) {
                    args.lockOK = false;
                }
                if (venue.attributes.name !== '') { // Set the residential place name to the address (to clear any personal info)
                    logDev('Residential Name reset');
                    actions.push(new UpdateObject(venue, { name: '' }));
                    // no field HL
                }
                args.categories = ['RESIDENCE_HOME'];
                if (venue.attributes.description !== null && venue.attributes.description !== '') { // remove any description
                    logDev('Residential description cleared');
                    actions.push(new UpdateObject(venue, { description: null }));
                    // no field HL
                }
                if (venue.attributes.phone !== null && venue.attributes.phone !== '') { // remove any phone info
                    logDev('Residential Phone cleared');
                    actions.push(new UpdateObject(venue, { phone: null }));
                    // no field HL
                }
                if (venue.attributes.url !== null && venue.attributes.url !== '') { // remove any url
                    logDev('Residential URL cleared');
                    actions.push(new UpdateObject(venue, { url: null }));
                    // no field HL
                }
                if (venue.attributes.services.length > 0) {
                    logDev('Residential services cleared');
                    actions.push(new UpdateObject(venue, { services: [] }));
                    // no field HL
                }
            }
        } else if (venue.isParkingLot()
          || (args.nameBase?.trim().length)
          || containsAny(args.categories, CATS_THAT_DONT_NEED_NAMES)) { // for non-residential places
            // Phone formatting
            if (containsAny(['CA', 'CO'], [args.regionCode, args.state2L]) && (/^\d{3}-\d{3}-\d{4}$/.test(venue.attributes.phone))) {
                args.outputPhoneFormat = '{0}-{1}-{2}';
            } else if (args.regionCode === 'SER' && !(/^\(\d{3}\) \d{3}-\d{4}$/.test(venue.attributes.phone))) {
                args.outputPhoneFormat = '{0}-{1}-{2}';
            } else if (args.regionCode === 'GLR') {
                args.outputPhoneFormat = '{0}-{1}-{2}';
            } else if (args.state2L === 'NV') {
                args.outputPhoneFormat = '{0}-{1}-{2}';
            } else if (args.countryCode === PNH_DATA.CAN.countryCode) {
                args.outputPhoneFormat = '+1-{0}-{1}-{2}';
            }

            args.almostAllDayHoursEntries = args.openingHours.filter(hoursEntry => hoursEntry.toHour === '23:59' && /^0?0:00$/.test(hoursEntry.fromHour));
            if (!args.highlightOnly && args.almostAllDayHoursEntries.length) {
                const newHoursEntries = [];
                args.openingHours.forEach(hoursEntry => {
                    const isInvalid = args.almostAllDayHoursEntries.includes(hoursEntry);
                    const newHoursEntry = new OpeningHour({
                        days: hoursEntry.days.slice(),
                        fromHour: isInvalid ? '00:00' : hoursEntry.fromHour,
                        toHour: isInvalid ? '00:00' : hoursEntry.toHour
                    });
                    newHoursEntries.push(newHoursEntry);
                });
                args.openingHours = newHoursEntries;
                addUpdateAction(venue, { openingHours: args.openingHours }, actions);
            }

            // Place Harmonization
            if (!args.highlightOnly) {
                if (venue.isParkingLot() || venue.isResidential()) {
                    args.pnhMatch = ['NoMatch'];
                } else {
                    // check against the PNH list
                    args.pnhMatch = Pnh.findMatch(args.nameBase, args.state2L, args.regionCode, args.countryCode, args.categories, venue);
                }
            } else {
                args.pnhMatch = Pnh.findMatch(args.nameBase, args.state2L, args.regionCode, args.countryCode, args.categories, venue, true);
            }

            args.pnhNameRegMatch = args.pnhMatch?.length
                && args.pnhMatch[0] !== 'NoMatch'
                && args.pnhMatch[0] !== 'ApprovalNeeded'
                && args.pnhMatch[0] !== 'Highlight';

            if (args.pnhNameRegMatch) { // *** Replace place data with PNH data
                let updatePNHName = true;

                // Retrieve the data from the PNH line(s)
                let nsMultiMatch = false;
                const orderList = [];
                if (args.pnhMatch.length > 1) { // If multiple matches, then
                    let maxBrandParentLevel = -1;
                    let pnhMatchHold = args.pnhMatch[0];
                    for (let pnhEntryIdx = 0; pnhEntryIdx < args.pnhMatch.length; pnhEntryIdx++) { // For each of the matches,
                        const pnhEntry = args.pnhMatch[pnhEntryIdx];
                        orderList.push(pnhEntry.order); // Add Order number to a list
                        if (pnhEntry.brandParentLevel > -1) { // If there is a brandParent flag, prioritize by highest match
                            if (pnhEntry.brandParentLevel > maxBrandParentLevel) { // if the match is more specific than the previous ones:
                                maxBrandParentLevel = pnhEntry.brandParentLevel; // Update the brandParent level
                                pnhMatchHold = pnhEntry; // Update the PNH data line
                            }
                        } else { // if any venue has no brandParent structure, use highest brandParent match but post an error
                            nsMultiMatch = true;
                        }
                    }
                    args.pnhMatch = pnhMatchHold;
                } else {
                    [args.pnhMatch] = args.pnhMatch; // Single match
                }

                args.priPNHPlaceCat = args.pnhMatch.primaryCategory;

                // if the location has multiple matches, then pop an alert that will make a forum post to the thread
                if (nsMultiMatch && !args.highlightOnly) {
                    /* if (confirm('WMEPH: Multiple matches found!\nDouble check the script changes.\nClick OK to report this situation.')) {
                        reportError({
                            subject: `Order Nos. "${orderList.join(', ')}" WMEPH Multiple match report`,
                            message: `Error report: PNH Order Nos. "${orderList.join(', ')}" are ambiguous multiple matches.\n \nExample Permalink: ${placePL}`
                        });
                    } */
                    WazeWrap.Alerts.confirm(
                        SCRIPT_NAME,
                        'WMEPH: Multiple matches found!<br>Double check the script changes.<br>Click OK to report this situation.',
                        () => {
                            reportError({
                                subject: `Order Nos. "${orderList.join(', ')}" WMEPH Multiple match report`,
                                message: `Error report: PNH Order Nos. "${orderList.join(', ')}" are ambiguous multiple matches.\n \nExample Permalink: ${args.placePL}`
                            });
                        },
                        () => { }
                    );
                }

                // Check special cases
                if (args.pnhMatch.hasSpecialCases) { // If the special cases column exists
                    // find any button/message flags in the special case (format: buttOn_xyzXyz, etc.)
                    if (args.pnhMatch.flagsToRemove.addConvStore) {
                        FlagBase.currentFlags.remove(Flag.AddConvStore);
                    }
                    // } else if (match = specCase.match(/^messOn_(.+)/i)) {
                    //    [, scFlag] = match;
                    //    _buttonBanner[scFlag].active = true;
                    // } else if (match = specCase.match(/^messOff_(.+)/i)) {
                    //    [, scFlag] = match;
                    //    _buttonBanner[scFlag].active = false;
                    args.pnhMatch.servicesToAdd.forEach(scFlag => {
                        _servicesBanner[scFlag].actionOn(actions);
                        _servicesBanner[scFlag].pnhOverride = true;
                    });
                    args.pnhMatch.servicesToRemove.forEach(scFlag => {
                        _servicesBanner[scFlag].actionOff(actions);
                        _servicesBanner[scFlag].pnhOverride = true;
                    });
                    if (args.pnhMatch.forceBrand) {
                        // If brand is going to be forced, use that.  Otherwise, use existing brand.
                        [, args.brand] = args.pnhMatch.forceBrand;
                    }
                    if (args.pnhMatch.forceBrand && args.priPNHPlaceCat === CAT.GAS_STATION
                        && venue.attributes.brand !== args.pnhMatch.forceBrand) {
                        actions.push(new UpdateObject(venue, { brand: args.pnhMatch.forceBrand }));
                        UPDATED_FIELDS.brand.updated = true;
                        logDev('Gas brand updated from PNH');
                    }
                    if (args.pnhMatch.localizationRegEx) {
                        args.showDispNote = false;
                    }
                    if (args.pnhMatch.recommendedPhone) {
                        args.recommendedPhone = normalizePhone(args.pnhMatch.recommendedPhone, args.outputPhoneFormat);
                    }
                    if (args.pnhMatch.keepName) {
                        // Prevent name change
                        updatePNHName = false;
                    }
                    if (args.pnhMatch.chainIsClosed && !Flag.ChainIsClosed.isWhitelisted(args)) {
                        args.chainIsClosed = true;
                    }
                }

                if (!args.chainIsClosed) {
                    // Category translations
                    const { altCategories } = args.pnhMatch;

                    // name parsing with category exceptions
                    if (args.priPNHPlaceCat === CAT.HOTEL) {
                        const nameToCheck = args.nameBase + (args.nameSuffix || '');
                        if (nameToCheck.toUpperCase() === args.pnhMatch.name.toUpperCase()) { // If no localization
                            args.nameBase = args.pnhMatch.name;
                        } else {
                            // Replace PNH part of name with PNH name
                            const splix = args.nameBase.toUpperCase().replace(/[-/]/g, ' ').indexOf(args.pnhMatch.name.toUpperCase().replace(/[-/]/g, ' '));
                            if (splix > -1) {
                                const frontText = args.nameBase.slice(0, splix);
                                const backText = args.nameBase.slice(splix + args.pnhMatch.name.length);
                                args.nameBase = args.pnhMatch.name;
                                if (frontText.length > 0) { args.nameBase = `${frontText} ${args.nameBase}`; }
                                if (backText.length > 0) { args.nameBase = `${args.nameBase} ${backText}`; }
                                args.nameBase = args.nameBase.replace(/ {2,}/g, ' ');
                            } else {
                                args.nameBase = args.pnhMatch.name;
                            }
                        }
                        if (altCategories && altCategories.length) { // if PNH alts exist
                            insertAtIndex(args.categories, altCategories, 1); //  then insert the alts into the existing category array after the GS category
                        }
                        if (args.categories.includes(CAT.HOTEL)) {
                            // Remove LODGING if it exists
                            const lodgingIdx = args.categories.indexOf(CAT.LODGING);
                            if (lodgingIdx > -1) {
                                args.categories.splice(lodgingIdx, 1);
                            }
                        }
                        // If PNH match, set wifi service.
                        if (args.pnhMatch && !_servicesBanner.addWiFi.checked) {
                            _servicesBanner.addWiFi.action();
                        }
                        // Set hotel hours to 24/7 for all hotels.
                        if (!_servicesBanner.add247.checked) {
                            _servicesBanner.add247.action();
                        }
                    } else if (args.priPNHPlaceCat === CAT.BANK_FINANCIAL && !args.pnhMatch.notABank) {
                        if (/\batm\b/ig.test(args.nameBase)) {
                            args.nameBase = `${args.pnhMatch.name} ATM`;
                        } else {
                            args.nameBase = args.pnhMatch.name;
                        }
                    } else if (args.priPNHPlaceCat === CAT.GAS_STATION) { // for PNH gas stations, don't replace existing sub-categories
                        if (altCategories?.length) { // if PNH alts exist
                            insertAtIndex(args.categories, altCategories, 1); //  then insert the alts into the existing category array after the GS category
                        }
                        args.nameBase = args.pnhMatch.name;
                    } else if (updatePNHName) { // if not a special category then update the name
                        args.nameBase = args.pnhMatch.name;
                        args.categories = insertAtIndex(args.categories, args.priPNHPlaceCat, 0);
                        if (altCategories?.length && !args.pnhMatch.flagsToAdd?.addCat2 && !args.pnhMatch.optionCat2) {
                            args.categories = insertAtIndex(args.categories, altCategories, 1);
                        }
                    } else if (!updatePNHName) {
                        // Strong title case option for non-PNH places
                        Flag.TitleCaseName.eval(venue, args.nameBase, args.nameSuffix);
                    }

                    // *** need to add a section above to allow other permissible categories to remain? (optional)

                    // Parse URL data
                    if (!(args.pnhMatch.localUrlCheckRegEx?.test(args?.url))) {
                        args.pnhUrl = args.pnhMatch.url;
                    }

                    // Parse PNH Aliases
                    if (!args.pnhMatch.noUpdateAlias && (!containsAll(args.aliases, args.pnhMatch.aliases)
                        && args.pnhMatch.aliases?.length && !args.pnhMatch.optionName2)) {
                        args.aliases = insertAtIndex(args.aliases, args.pnhMatch.aliases, 0);
                        addUpdateAction(venue, { aliases: args.aliases }, actions);
                    }

                    // Remove unnecessary parent categories
                    // TODO: This seems like it could be made more efficient.
                    const parentCats = uniq(args.categories.map(category => args.pnhCategoryInfos.getById(category).parent))
                        .filter(parent => parent.trim().length > 0);
                    args.categories = args.categories.filter(cat => !parentCats.includes(cat));

                    // update categories if different and no Cat2 option
                    if (!matchSets(uniq(venue.attributes.categories), uniq(args.categories))) {
                        if (!args.pnhMatch.optionCat2 && !args.pnhMatch.flagsToAdd?.addCat2) {
                            logDev(`Categories updated with ${args.categories}`);
                            addUpdateAction(venue, { categories: args.categories }, actions);
                        } else { // if second cat is optional
                            logDev(`Primary category updated with ${args.priPNHPlaceCat}`);
                            args.categories = insertAtIndex(args.categories, args.priPNHPlaceCat, 0);
                            addUpdateAction(venue, { categories: args.categories });
                        }
                    }
                    // Enable optional 2nd category button
                    Flag.AddCat2.eval(args, altCategories?.[0]);

                    // Description update
                    args.description = args.pnhMatch.description;
                    if (!isNullOrWhitespace(args.description) && !venue.attributes.description.toUpperCase().includes(args.description.toUpperCase())) {
                        if (!isNullOrWhitespace(venue.attributes.description)) {
                            args.descriptionInserted = true;
                        }
                        logDev('Description updated');
                        args.description = `${args.description}\n${venue.attributes.description}`;
                        actions.push(new UpdateObject(venue, { description: args.description }));
                        UPDATED_FIELDS.description.updated = true;
                    }

                    // Special Lock by PNH
                    if (args.pnhMatch.lockAt) {
                        pnhLockLevel = args.pnhMatch.lockAt - 1;
                    }
                }
            } // END PNH match/no-match updates

            if (!args.chainIsClosed) {
                const isPoint = venue.isPoint();
                // NOTE: do not use is2D() function. It doesn't seem to be 100% reliable.
                const isArea = !isPoint;
                let highestCategoryLock = -1;
                // Category/Name-based Services, added to any existing services:
                args.categories.forEach(category => {
                    const pnhCategoryInfo = args.pnhCategoryInfos.getById(category);

                    if (!pnhCategoryInfo) {
                        throw new Error(`WMEPH: Unexpected category: ${category}`);
                    }
                    let pvaPoint = pnhCategoryInfo.point;
                    let pvaArea = pnhCategoryInfo.area;
                    if (pnhCategoryInfo.regPoint.includes(args.state2L) || pnhCategoryInfo.regPoint.includes(args.regionCode)
                        || pnhCategoryInfo.regPoint.includes(args.countryCode)) {
                        pvaPoint = '1';
                        pvaArea = '';
                    } else if (pnhCategoryInfo.regArea.includes(args.state2L) || pnhCategoryInfo.regArea.includes(args.regionCode)
                        || pnhCategoryInfo.regArea.includes(args.countryCode)) {
                        pvaPoint = '';
                        pvaArea = '1';
                    }

                    // If Post Office and VPO or CPU is in the name, always a point.
                    if (args.categories.includes(CAT.POST_OFFICE) && /\b(?:cpu|vpo)\b/i.test(venue.attributes.name)) {
                        pvaPoint = '1';
                        pvaArea = '';
                    }

                    const pointSeverity = getPvaSeverity(pvaPoint, venue);
                    const areaSeverity = getPvaSeverity(pvaArea, venue);

                    if (isPoint && pointSeverity > SEVERITY.GREEN) {
                        args.maxPointSeverity = Math.max(pointSeverity, args.maxPointSeverity);
                    } else if (isArea) {
                        args.maxAreaSeverity = Math.min(areaSeverity, args.maxAreaSeverity);
                    }

                    // TODO: Process this flag outside the loop.
                    Flag.PnhCatMess.eval(venue, pnhCategoryInfo, args.categories, args.highlightOnly);

                    // Set lock level
                    for (let lockix = 1; lockix < 6; lockix++) {
                        const categoryLock = pnhCategoryInfo[`lock${lockix}`];
                        if (lockix - 1 > highestCategoryLock && (categoryLock.includes(args.state2L) || categoryLock.includes(args.regionCode)
                            || categoryLock.includes(args.countryCode))) {
                            highestCategoryLock = lockix - 1; // Offset by 1 since lock ranks start at 0
                        }
                    }
                });

                if (highestCategoryLock > -1) {
                    args.defaultLockLevel = highestCategoryLock;
                }

                if (!args.highlightOnly) {
                    // Update name:
                    if ((args.nameBase + (args.nameSuffix || '')) !== venue.attributes.name) {
                        logDev('Name updated');
                        addUpdateAction(venue, { name: args.nameBase + (args.nameSuffix || '') }, actions);
                    }

                    // Update aliases
                    const tempAliases = removeUnnecessaryAliases(args.nameBase, args.aliases);
                    if (tempAliases) {
                        args.aliasesRemoved = true;
                        args.aliases = tempAliases;
                        logDev('Alt Names updated');
                        addUpdateAction(venue, { aliases: args.aliases }, actions);
                    }

                    // PNH specific Services:
                    args.categories.forEach(category => {
                        const pnhCategoryInfo = args.pnhCategoryInfos.getById(category);
                        pnhCategoryInfo.services.forEach(service => {
                            const serviceButton = _servicesBanner[service.pnhKey];
                            if (!serviceButton.pnhOverride) {
                                // This section of code previously checked for values of "1", "2", and state/region codes.
                                // A value of "2" or a state/region code would auto-add the service.  However, it was
                                // felt that this was a problem since it is difficult to prove that every place in a
                                // category would *always* offer a specific service.  So now, any value entered in the
                                // spreadsheet cell will only display the service button, not turn it on.
                                serviceButton.active = true;
                            }
                        });
                    });
                }

                args.hoursOverlap = venueHasOverlappingHours(args.openingHours);

                args.isUspsPostOffice = args.countryCode === PNH_DATA.USA.countryCode && !args.categories.includes(CAT.PARKING_LOT)
                    && args.categories.includes(CAT.POST_OFFICE);

                if (!args.highlightOnly) {
                    // Highlight 24/7 button if hours are set that way, and add button for all places
                    if (isAlwaysOpen(venue)) {
                        _servicesBanner.add247.checked = true;
                    }
                    _servicesBanner.add247.active = true;

                    if (!args.hoursOverlap) {
                        const tempHours = args.openingHours.slice();
                        for (let ohix = 0; ohix < args.openingHours.length; ohix++) {
                            if (tempHours[ohix].days.length === 2 && tempHours[ohix].days[0] === 1 && tempHours[ohix].days[1] === 0) {
                                // separate hours
                                logDev('Correcting M-S entry...');
                                tempHours.push(new OpeningHour({ days: [0], fromHour: tempHours[ohix].fromHour, toHour: tempHours[ohix].toHour }));
                                tempHours[ohix].days = [1];
                                args.openingHours = tempHours;
                                addUpdateAction(venue, { openingHours: tempHours }, actions);
                            }
                        }
                    }

                    // URL updating
                    // Invalid EVCS URL imported from PURs. Clear it.
                    if (Flag.ClearThisUrl.venueIsFlaggable(args)) {
                        args.url = null;
                        addUpdateAction(venue, { url: args.url }, actions);
                    }
                    args.normalizedUrl = normalizeURL(args.url);
                    if (args.isUspsPostOffice && args.url !== 'usps.com') {
                        args.url = 'usps.com';
                        addUpdateAction(venue, { url: args.url }, actions);
                    } else if (!args.pnhUrl && args.normalizedUrl !== args.url) {
                        if (args.normalizedUrl !== BAD_URL) {
                            args.url = args.normalizedUrl;
                            logDev('URL formatted');
                            addUpdateAction(venue, { url: args.url }, actions);
                        }
                    } else if (args.pnhUrl && isNullOrWhitespace(args.url)) {
                        args.url = args.pnhUrl;
                        logDev('URL updated');
                        addUpdateAction(venue, { url: args.url }, actions);
                    }

                    if (args.phone) {
                        // Invalid EVCS phone # imported from PURs. Clear it.
                        if (Flag.ClearThisPhone.venueIsFlaggable(args)) {
                            args.phone = null;
                        }
                        const normalizedPhone = normalizePhone(args.phone, args.outputPhoneFormat);
                        if (normalizedPhone !== BAD_PHONE) args.phone = normalizedPhone;
                        if (args.phone !== venue.attributes.phone) {
                            logDev('Phone updated');
                            addUpdateAction(venue, { phone: args.phone }, actions);
                        }
                    }

                    if (args.isUspsPostOffice) {
                        const cleanNameParts = Flag.FormatUSPS.getCleanNameParts(args.nameBase, args.nameSuffix);
                        const nameToCheck = cleanNameParts.join('');
                        if (Flag.FormatUSPS.isNameOk(nameToCheck, args.state2L, args.addr)) {
                            if (nameToCheck !== venue.attributes.name) {
                                [args.nameBase, args.nameSuffix] = cleanNameParts;
                                actions.push(new UpdateObject(venue, { name: nameToCheck }));
                            }
                        }
                    }
                }
            }
        } // END if (!residential && has name)

        if (!args.chainIsClosed) {
            if (!args.highlightOnly && args.categories.includes(CAT.REST_AREAS)) {
                if (venue.attributes.name.match(/^Rest Area.* - /) !== null && args.countryCode === PNH_DATA.USA.countryCode) {
                    const newSuffix = args.nameSuffix.replace(/\bMile\b/i, 'mile');
                    if (args.nameBase + newSuffix !== venue.attributes.name) {
                        addUpdateAction(venue, { name: args.nameBase + newSuffix }, actions);
                        logDev('Lower case "mile"');
                    }
                    // NOTE: I don't know if this else case is needed anymore...
                    // else {
                    //     // The new name matches the original name, so the only change would have been to capitalize "Mile", which
                    //     // we don't want. So remove any previous name-change action.  Note: this feels like a hack and is probably
                    //     // a fragile workaround.  The name shouldn't be capitalized in the first place, unless necessary.
                    //     for (let i = 0; i < actions.length; i++) {
                    //         const action = actions[i];
                    //         if (action.newAttributes?.name) {
                    //             actions.splice(i, 1);
                    //             _UPDATED_FIELDS.name.updated = false;
                    //             break;
                    //         }
                    //     }
                    // }
                }

                // switch to rest area wiki button
                _buttonBanner2.restAreaWiki.active = true;
                _buttonBanner2.placesWiki.active = false;
            }

            args.isLocked = venue.attributes.lockRank >= (pnhLockLevel > -1 ? pnhLockLevel : args.defaultLockLevel);
            args.currentHN = venue.attributes.houseNumber;
            // Check to see if there's an action that is currently updating the house number.
            const updateHnAction = actions && actions.find(action => action.newAttributes && action.newAttributes.houseNumber);
            if (updateHnAction) args.currentHN = updateHnAction.newAttributes.houseNumber;
            // Use the inferred address street if currently no street.
            args.hasStreet = venue.attributes.streetID || (inferredAddress && inferredAddress.street);
            args.ignoreParkingLots = $('#WMEPH-DisablePLAExtProviderCheck').prop('checked');

            if (!venue.isResidential() && (venue.isParkingLot() || (args.nameBase?.trim().length))) {
                if (args.pnhNameRegMatch) {
                    Flag.HotelMkPrim.eval(args);
                    Flag.LocalizedName.eval(args);
                    Flag.AddAlias.eval(args);
                    Flag.AddRecommendedPhone.eval(args);
                    Flag.SubFuel.eval(args);
                    Flag.SpecCaseMessage.eval(args);
                    Flag.LocalURL.eval(args);
                    Flag.UrlMismatch.eval(args);
                    Flag.CheckDescription.eval(args);
                    Flag.LocationFinder.eval(args);
                    Flag.AddPharm.eval(args);
                    Flag.AddSuper.eval(args);
                    Flag.AppendAMPM.eval(args);
                    Flag.PlaceMatched.eval(args);
                } else if (!args.highlightOnly && args.categories.includes(CAT.POST_OFFICE)) {
                    Flag.LocationFinder.eval(args);
                }
                Flag.InvalidUrl.eval(args);
                Flag.SFAliases.eval(args);
                Flag.CatHotel.eval(args);
                Flag.ExtProviderMissing.eval(args);
                Flag.NewPlaceSubmit.eval(args);
                Flag.ApprovalSubmit.eval(args);
                Flag.TitleCaseName.eval(args);
                Flag.BankType1.eval(args);
                Flag.BankBranch.eval(args);
                Flag.StandaloneATM.eval(args);
                Flag.BankCorporate.eval(args);
                Flag.AddATM.eval(args);
                Flag.NoHours.eval(args);
                Flag.Mismatch247.eval(args);
                Flag.HoursOverlap.eval(args);
                Flag.OldHours.eval(args);
                Flag.AllDayHoursFixed.eval(args);
                Flag.IsThisAPostOffice.eval(args);
                Flag.MissingUSPSZipAlt.eval(args);
                Flag.FormatUSPS.eval(args);
                Flag.CatPostOffice.eval(args);
                Flag.MissingUSPSDescription.eval(args);
                Flag.MissingUSPSAlt.eval(args);
                Flag.UrlMissing.eval(args);
                Flag.PhoneInvalid.eval(args);
                Flag.PhoneMissing.eval(args);
                Flag.BadAreaCode.eval(args);
                Flag.ParentCategory.eval(args);
                Flag.ClearThisPhone.eval(args);
                Flag.ClearThisUrl.eval(args);
                Flag.UrlAnalytics.eval(args);
                Flag.EVCSAltNameMissing.eval(args);
            }
            Flag.UnmappedRegion.eval(args);
            Flag.PlaCostTypeMissing.eval(args);
            Flag.PlaLotElevationMissing.eval(args);
            Flag.PlaSpaces.eval(args);
            Flag.PlaLotTypeMissing.eval(args);
            Flag.NoPlaStopPoint.eval(args);
            Flag.PlaStopPointUnmoved.eval(args);
            Flag.PlaCanExitWhileClosed.eval(args);
            Flag.PlaPaymentTypeMissing.eval(args);
            Flag.PlaHasAccessibleParking.eval(args);
            Flag.ChangeToHospitalUrgentCare.eval(args);
            Flag.IsThisAPilotTravelCenter.eval(args);
            Flag.GasMkPrim.eval(args);
            Flag.AddConvStore.eval(args);
            Flag.IndianaLiquorStoreHours.eval(args);
            Flag.PointNotArea.eval(args);
            Flag.GasMismatch.eval(args);
            Flag.EVChargingStationWarning.eval(args);
            Flag.AddCommonEVPaymentMethods.eval(args);
            Flag.RemoveUncommonEVPaymentMethods.eval(args);
            Flag.EVCSPriceMissing.eval(args);
            Flag.NameMissing.eval(args);
            Flag.PlaNameMissing.eval(args);
            Flag.PlaNameNonStandard.eval(args);
            Flag.GasNameMissing.eval(args);
            Flag.PlaIsPublic.eval(args);
            Flag.HnMissing.eval(args);
            Flag.HnTooManyDigits.eval(args);
            Flag.CityMissing.eval(args);
            Flag.StreetMissing.eval(args);
            Flag.NotAHospital.eval(args);
            Flag.ChangeToPetVet.eval(args);
            Flag.ChangeToDoctorClinic.eval(args);
            Flag.NotASchool.eval(args);

            Flag.RestAreaSpec.eval(args);
            Flag.RestAreaScenic.eval(args);
            Flag.RestAreaNoTransportation.eval(args);
            Flag.RestAreaGas.eval(args);
            Flag.RestAreaName.eval(args);
            Flag.AreaNotPoint.eval(args);
        } else {
            Flag.ChainIsClosed.eval(args);
        }

        // update Severity for banner messages
        const orderedFlags = FlagBase.currentFlags.getOrderedFlags();
        orderedFlags.forEach(flag => {
            args.totalSeverity = Math.max(flag.severity, args.totalSeverity);
        });

        let placeLockedFlag;
        if (!args.chainIsClosed) {
            // final updating of desired lock levels
            if (pnhLockLevel !== -1 && !args.highlightOnly) {
                logDev(`PNHLockLevel: ${pnhLockLevel}`);
                args.levelToLock = pnhLockLevel;
            } else {
                args.levelToLock = args.defaultLockLevel;
            }
            if (args.regionCode === 'SER') {
                if (args.categories.includes(CAT.COLLEGE_UNIVERSITY) && args.categories.includes(CAT.PARKING_LOT)) {
                    args.levelToLock = LOCK_LEVEL_4;
                } else if (venue.isPoint() && args.categories.includes(CAT.COLLEGE_UNIVERSITY) && (!args.categories.includes(CAT.HOSPITAL_MEDICAL_CARE)
                    || !args.categories.includes(CAT.HOSPITAL_URGENT_CARE))) {
                    args.levelToLock = LOCK_LEVEL_4;
                }
            }

            if (args.levelToLock > (USER.rank - 1)) { args.levelToLock = (USER.rank - 1); } // Only lock up to the user's level

            // Brand checking (be sure to check this after determining if brand will be forced, when harmonizing)
            Flag.GasNoBrand.eval(args);
            Flag.GasUnbranded.eval(args);

            Flag.IgnEdited.eval(args);
            Flag.WazeBot.eval(args);
            Flag.LockRPP.eval(args);

            // Allow flags to do any additional work before assigning severity and locks
            orderedFlags.forEach(flag => flag.preProcess?.(args));

            if (!args.highlightOnly) {
                // Update the lockOK value if "noLock" is set on any flag.
                args.lockOK &&= !orderedFlags.some(flag => flag.noLock);
                logDev(`Severity: ${args.totalSeverity}; lockOK: ${args.lockOK}`);
            }

            placeLockedFlag = Flag.PlaceLocked.eval(args);

            // Turn off unnecessary buttons
            // TODO: handle this in the flag class
            if (args.categories.includes(CAT.PHARMACY)) {
                FlagBase.currentFlags.remove(Flag.AddPharm);
            }
            if (args.categories.includes(CAT.SUPERMARKET_GROCERY)) {
                FlagBase.currentFlags.remove(Flag.AddSuper);
            }

            // Final alerts for non-severe locations
            Flag.ResiTypeName.eval(args);
            Flag.SuspectDesc.eval(args);

            _dupeHNRangeList = [];
            _dupeBanner = {};
            if (!args.highlightOnly) runDuplicateFinder(venue, args.nameBase, args.aliases, args.addr, args.placePL);
            // Check HN range (this depends on the returned dupefinder data, so must run after it)
            Flag.HNRange.eval(args);
        }

        // Return severity for highlighter (no dupe run))
        if (args.highlightOnly) {
            // get severities from the banners
            args.totalSeverity = SEVERITY.GREEN;
            orderedFlags.forEach(flag => {
                args.totalSeverity = Math.max(flag.severity, args.totalSeverity);
            });

            // Special case flags
            if (venue.attributes.lockRank === 0
                && venue.attributes.categories.some(cat => [CAT.HOSPITAL_MEDICAL_CARE, CAT.HOSPITAL_URGENT_CARE, CAT.GAS_STATION].includes(cat))) {
                args.totalSeverity = SEVERITY.PINK;
            }

            if (args.totalSeverity === SEVERITY.GREEN && placeLockedFlag?.hlLockFlag) {
                args.totalSeverity = 'lock';
            }
            if (args.totalSeverity === SEVERITY.BLUE && placeLockedFlag?.hlLockFlag) {
                args.totalSeverity = 'lock1';
            }
            if (venue.attributes.adLocked) {
                args.totalSeverity = 'adLock';
            }

            return args.totalSeverity;
        }

        if (!args.highlightOnly) {
            // Update icons to reflect current WME place services
            updateServicesChecks(_servicesBanner);

            // Add green highlighting to edit panel fields that have been updated by WMEPH
            UPDATED_FIELDS.updateEditPanelHighlights();

            assembleBanner(args.chainIsClosed);

            executeMultiAction(actions);
        }

        // showOpenPlaceWebsiteButton();
        // showSearchButton();

        // Highlighting will return a value, but no need to return a value here (for end of harmonization).
        // Adding this line to satisfy eslint.
        return undefined;
    } // END harmonizePlaceGo function

    function runDuplicateFinder(venue, name, aliases, addr, placePL) {
        const venueID = venue.attributes.id;
        // Run nearby duplicate place finder function
        if (name.replace(/[^A-Za-z0-9]/g, '').length > 0 && !venue.attributes.residential && !isEmergencyRoom(venue) && !isRestArea(venue)) {
            // don't zoom and pan for results outside of FOV
            let duplicateName = findNearbyDuplicate(name, aliases, venue, !$('#WMEPH-DisableDFZoom').prop('checked'));
            if (duplicateName[1]) {
                new Flag.Overlapping();
            }
            [duplicateName] = duplicateName;
            if (duplicateName.length) {
                if (duplicateName.length + 1 !== _dupeIDList.length && USER.isDevUser) {
                    // If there's an issue with the data return, allow an error report
                    WazeWrap.Alerts.confirm(
                        SCRIPT_NAME,
                        'WMEPH: Dupefinder Error!<br>Click OK to report this',
                        () => {
                            // if the category doesn't translate, then pop an alert that will make a forum post to the thread
                            reportError({
                                subject: 'WMEPH Bug report DupeID',
                                message: `Script version: ${SCRIPT_VERSION}${BETA_VERSION_STR}\nPermalink: ${placePL}\nPlace name: ${
                                    venue.attributes.name}\nCountry: ${addr.country.name}\n--------\nDescribe the error:\nDupeID mismatch with dupeName list`
                            });
                        },
                        () => { }
                    );
                } else {
                    const wlAction = dID => {
                        const wlKey = 'dupeWL';
                        if (!_venueWhitelist.hasOwnProperty(venueID)) { // If venue is NOT on WL, then add it.
                            _venueWhitelist[venueID] = { dupeWL: [] };
                        }
                        if (!_venueWhitelist[venueID].hasOwnProperty(wlKey)) { // If dupeWL key is not in venue WL, then initialize it.
                            _venueWhitelist[venueID][wlKey] = [];
                        }
                        _venueWhitelist[venueID].dupeWL.push(dID); // WL the id for the duplicate venue
                        _venueWhitelist[venueID].dupeWL = uniq(_venueWhitelist[venueID].dupeWL);
                        // Make an entry for the opposite venue
                        if (!_venueWhitelist.hasOwnProperty(dID)) { // If venue is NOT on WL, then add it.
                            _venueWhitelist[dID] = { dupeWL: [] };
                        }
                        if (!_venueWhitelist[dID].hasOwnProperty(wlKey)) { // If dupeWL key is not in venue WL, then initialize it.
                            _venueWhitelist[dID][wlKey] = [];
                        }
                        _venueWhitelist[dID].dupeWL.push(venueID); // WL the id for the duplicate venue
                        _venueWhitelist[dID].dupeWL = uniq(_venueWhitelist[dID].dupeWL);
                        saveWhitelistToLS(true); // Save the WL to local storage
                        wmephWhitelistCounter();
                        _buttonBanner2.clearWL.active = true;
                        harmonizePlaceGo(venue, 'harmonize');
                    };
                    for (let ijx = 1; ijx < duplicateName.length + 1; ijx++) {
                        _dupeBanner[_dupeIDList[ijx]] = {
                            active: true,
                            severity: SEVERITY.YELLOW,
                            message: duplicateName[ijx - 1],
                            WLactive: false,
                            WLvalue: WL_BUTTON_TEXT,
                            wlTooltip: 'Whitelist Duplicate',
                            WLaction: wlAction
                        };
                        if (_venueWhitelist.hasOwnProperty(venueID) && _venueWhitelist[venueID].hasOwnProperty('dupeWL')
                            && _venueWhitelist[venueID].dupeWL.includes(_dupeIDList[ijx])) {
                            // if the dupe is on the whitelist then remove it from the banner
                            _dupeBanner[_dupeIDList[ijx]].active = false;
                        } else {
                            // Otherwise, activate the WL button
                            _dupeBanner[_dupeIDList[ijx]].WLactive = true;
                        }
                    } // END loop for duplicate venues
                }
            }
        }
    }

    // Set up banner messages
    function assembleBanner(chainIsClosed) {
        const flags = FlagBase.currentFlags.getOrderedFlags();
        const venue = getSelectedVenue();
        if (!venue) return;
        logDev('Building banners');
        let dupesFound = 0;
        let $rowDiv;
        let rowDivs = [];
        let totalSeverity = SEVERITY.GREEN;

        const func = elem => ({ id: elem.getAttribute('id'), val: elem.value });
        _textEntryValues = $('#WMEPH_banner input[type="text"]').toArray().map(func);
        _textEntryValues = _textEntryValues.concat($('#WMEPH_banner textarea').toArray().map(func));

        // Setup duplicates banners
        $rowDiv = $('<div class="banner-row yellow">');
        Object.keys(_dupeBanner).forEach(tempKey => {
            const rowData = _dupeBanner[tempKey];
            if (rowData.active) {
                dupesFound += 1;
                const $dupeDiv = $('<div class="dupe">').appendTo($rowDiv);
                $dupeDiv.append($('<span style="margin-right:4px">').html(`&bull; ${rowData.message}`));
                if (rowData.value) {
                    // Nothing happening here yet.
                }
                if (rowData.WLactive && rowData.WLaction) { // If there's a WL option, enable it
                    totalSeverity = Math.max(rowData.severity, totalSeverity);
                    $dupeDiv.append($('<button>', {
                        class: 'btn btn-success btn-xs wmephwl-btn',
                        id: `WMEPH_WL${tempKey}`,
                        title: rowData.wlTooltip
                    }).text(rowData.WLvalue));
                }
            }
        });
        if (dupesFound) { // if at least 1 dupe
            $rowDiv.prepend(`Possible duplicate${dupesFound > 1 ? 's' : ''}:`);
            rowDivs.push($rowDiv);
        }

        // Build banners above the Services
        flags.forEach(flag => {
            $rowDiv = $('<div class="banner-row">');
            let colorClass;
            switch (flag.severity) {
                case SEVERITY.RED:
                    colorClass = 'red';
                    break;
                case SEVERITY.YELLOW:
                    colorClass = 'yellow';
                    break;
                case SEVERITY.BLUE:
                    colorClass = 'blue';
                    break;
                case SEVERITY.GREEN:
                    colorClass = 'gray';
                    break;
                case SEVERITY.ORANGE:
                    colorClass = 'orange';
                    break;
                default:
                    throw new Error(`WMEPH: Unexpected severity value while building banner: ${flag.severity}`);
            }
            $rowDiv.addClass(colorClass);
            if (flag.divId) {
                $rowDiv.attr('id', flag.divId);
            }
            if (flag.message && flag.message.length) {
                $rowDiv.append($('<span>').css({ 'margin-right': '4px' }).append(`&bull; ${flag.message}`));
            }
            if (flag.buttonText) {
                $rowDiv.append($('<button>', {
                    class: 'btn btn-default btn-xs wmeph-btn',
                    id: `WMEPH_${flag.name}`,
                    title: flag.title || ''
                }).css({ 'margin-right': '4px' }).html(flag.buttonText));
            }
            if (flag.value2) {
                $rowDiv.append($('<button>', {
                    class: 'btn btn-default btn-xs wmeph-btn',
                    id: `WMEPH_${flag.name}_2`,
                    title: flag.title2 || ''
                }).css({ 'margin-right': '4px' }).html(flag.value2));
            }
            if (flag.showWL) {
                if (flag.WLaction) { // If there's a WL option, enable it
                    totalSeverity = Math.max(flag.severity, totalSeverity);
                    $rowDiv.append(
                        $('<button>', { class: 'btn btn-success btn-xs wmephwl-btn', id: `WMEPH_WL${flag.name}`, title: flag.wlTooltip })
                            .text('WL')
                    );
                }
            } else {
                totalSeverity = Math.max(flag.severity, totalSeverity);
            }
            if (flag.suffixMessage) {
                $rowDiv.append($('<div>').css({ 'margin-top': '2px' }).append(flag.suffixMessage));
            }

            rowDivs.push($rowDiv);
        });

        if ($('#WMEPH-ColorHighlighting').prop('checked')) {
            venue.attributes.wmephSeverity = totalSeverity;
        }

        if ($('#WMEPH_banner').length === 0) {
            $('<div id="WMEPH_banner">').prependTo('#wmeph-panel');
        } else {
            $('#WMEPH_banner').empty();
        }
        let bgColor;
        switch (totalSeverity) {
            case SEVERITY.BLUE:
                bgColor = 'rgb(50, 50, 230)'; // blue
                break;
            case SEVERITY.YELLOW:
                bgColor = 'rgb(217, 173, 42)'; // yellow
                break;
            case SEVERITY.RED:
                bgColor = 'rgb(211, 48, 48)'; // red
                break;
            case SEVERITY.ORANGE:
                bgColor = 'rgb(255, 127, 0)'; // orange
                break;
            default:
                bgColor = 'rgb(36, 172, 36)'; // green
        }
        $('#WMEPH_banner').css({ 'background-color': bgColor }).append(rowDivs);

        assembleServicesBanner(chainIsClosed);

        //  Build general banners (below the Services)
        rowDivs = [];
        Object.keys(_buttonBanner2).forEach(tempKey => {
            const banner2RowData = _buttonBanner2[tempKey];
            if (banner2RowData.active) { //  If the particular message is active
                $rowDiv = $('<div>');
                $rowDiv.append(banner2RowData.message);
                if (banner2RowData.action) {
                    $rowDiv.append(` <input class="btn btn-info btn-xs wmeph-btn" id="WMEPH_${tempKey}" title="${
                        banner2RowData.title}" style="" type="button" value="${banner2RowData.value}">`);
                }
                rowDivs.push($rowDiv);
                totalSeverity = Math.max(_buttonBanner2[tempKey].severity, totalSeverity);
            }
        });

        if ($('#WMEPH_tools').length === 0) {
            $('#WMEPH_services').after($('<div id="WMEPH_tools">').css({
                // 'background-color': '#eee',
                color: 'black',
                'font-size': '15px',
                // padding: '0px 4px 4px 4px',
                'margin-left': '6px',
                'margin-right': 'auto'
            }));
        } else {
            $('#WMEPH_tools').empty();
        }
        $('#WMEPH_tools').append(rowDivs);

        // Set up Duplicate onclicks
        if (dupesFound) {
            setupButtonsOld(_dupeBanner);
        }
        // Setup bannButt onclicks
        setupButtons(flags);

        // Setup bannButt2 onclicks
        setupButtonsOld(_buttonBanner2);

        // Add click handlers for parking lot helper buttons.
        // TODO: move this to PlaSpaces class
        $('.wmeph-pla-spaces-btn').click(evt => {
            const selectedVenue = getSelectedVenue();
            const selectedValue = $(evt.currentTarget).attr('id').replace('wmeph_', '');
            const existingAttr = selectedVenue.attributes.categoryAttributes.PARKING_LOT;
            const newAttr = {};
            if (existingAttr) {
                Object.keys(existingAttr).forEach(prop => {
                    let value = existingAttr[prop];
                    if (Array.isArray(value)) value = [].concat(value);
                    newAttr[prop] = value;
                });
            }
            newAttr.estimatedNumberOfSpots = selectedValue;
            UPDATED_FIELDS.parkingSpots.updated = true;
            addUpdateAction(selectedVenue, { categoryAttributes: { PARKING_LOT: newAttr } }, null, true);
        });

        // Format "no hours" section and hook up button events.
        $('#WMEPH_WLnoHours').css({ 'vertical-align': 'top' });

        if (_textEntryValues) {
            _textEntryValues.forEach(entry => $(`#${entry.id}`).val(entry.val));
        }

        // Allow flags to do any additional work (hook up events, etc);
        flags.forEach(flag => {
            flag.postProcess?.();
        });

        processGoogleLinks(venue);
    } // END assemble Banner function

    async function processGoogleLinks(venue) {
        const promises = venue.attributes.externalProviderIDs.map(link => _googlePlaces.getPlace(link.attributes.uuid));
        const googleResults = await Promise.all(promises);
        $('#wmeph-google-link-info').remove();
        // Compare to venue to make sure a different place hasn't been selected since the results were requested.
        if (googleResults.length && venue === getSelectedVenue()) {
            const $bannerDiv = $('<div>', { id: 'wmeph-google-link-info' });
            const googleLogoLetter = (letter, colorClass) => $('<span>', { class: 'google-logo' }).addClass(colorClass).text(letter);
            $bannerDiv.append(
                $('<div>', {
                    class: 'banner-row gray',
                    style: 'padding-top: 4px;color: #646464;padding-left: 8px;'
                }).text(' Links').prepend(
                    googleLogoLetter('G', 'blue'),
                    googleLogoLetter('o', 'red'),
                    googleLogoLetter('o', 'orange'),
                    googleLogoLetter('g', 'blue'),
                    googleLogoLetter('l', 'green'),
                    googleLogoLetter('e', 'red')
                ).prepend(
                    $('<i>', {
                        id: 'wmeph-ext-prov-jump',
                        title: 'Jump to external providers section',
                        class: 'fa fa-level-down',
                        style: 'font-size: 15px;float: right;color: cadetblue;cursor: pointer;padding-left: 6px;'
                    })
                )
            );
            venue.attributes.externalProviderIDs.forEach(link => {
                const result = googleResults.find(r => r.placeId === link.attributes.uuid);
                if (result) {
                    const linkStyle = 'margin-left: 5px;text-decoration: none;color: cadetblue;';
                    let $nameSpan;
                    const $row = $('<div>', { class: 'banner-row', style: 'border-top: 1px solid #ccc;' }).append(
                        $('<table>', { style: 'width: 100%' }).append(
                            $('<tbody>').append(
                                $('<tr>').append(
                                    $('<td>').append(
                                        '&bull;',
                                        $nameSpan = $('<span>', {
                                            class:
                                            'wmeph-google-place-name',
                                            style: 'margin-left: 3px;font-weight: normal;'
                                        }).text(`${result.requestStatus !== 'NOT_FOUND' ? result.name : result.placeId}`)
                                    ),
                                    $('<td>', { style: 'text-align: right;font-weight: 500;padding: 2px 2px 2px 0px;min-width: 65px;' }).append(
                                        result.website && result.requestStatus !== 'NOT_FOUND' ? [$('<a>', {
                                            style: linkStyle,
                                            href: result.website,
                                            target: '_blank',
                                            title: 'Open the place\'s website, according to Google'
                                        }).append(
                                            $('<i>', {
                                                class: 'fa fa-external-link',
                                                style: 'font-size: 16px;position: relative;top: 1px;'
                                            })
                                        ),
                                        $('<span>', {
                                            style: 'text-align: center;margin-left: 8px;margin-right: 4px;color: #c5c5c5;cursor: default;'
                                        }).text('|')] : null,
                                        result.requestStatus !== 'NOT_FOUND' ? $('<a>', {
                                            style: linkStyle,
                                            href: result.url,
                                            target: '_blank',
                                            title: 'Open the place in Google Maps'
                                        }).append(
                                            $('<i>', {
                                                class: 'fa fa-map-o',
                                                style: 'font-size: 16px;'
                                            })
                                        ) : null
                                    )
                                )
                            )
                        )
                    );

                    if (result.requestStatus === 'NOT_FOUND') {
                        $row.addClass('red');
                        $row.attr('title', 'This Google place ID was not found. Please update the link in the External Providers section.');
                    } else if (result.business_status === 'CLOSED_PERMANENTLY') {
                        $nameSpan.append(' [CLOSED]');
                        $row.addClass('red');
                        $row.attr('title', 'Google indicates this linked place is permanently closed. Please verify.');
                    } else if (result.business_status === 'CLOSED_TEMPORARILY') {
                        $nameSpan.append(' [TEMPORARILY&nbsp;CLOSED]');
                        $row.addClass('yellow');
                        $row.attr('title', 'Google indicates this linked place is TEMPORARILY closed. Please verify.');
                    } else if (googleResults.filter(otherResult => otherResult.placeId === result.placeId).length > 1) {
                        $nameSpan.append(' [DUPLICATE]');
                        $row.css('background-color', '#fde5c8');
                        $row.attr('title', 'This place is linked more than once. Please remove extra links.');
                    } else {
                        $row.addClass('lightgray');
                    }

                    $bannerDiv.append($row);

                    $row.attr('uuid', result.placeId);
                    if (result.requestStatus !== 'NOT_FOUND') {
                        addGoogleLinkHoverEvent($row);
                    }
                }
            });
            $('#WMEPH_banner').append($bannerDiv);
            $('#wmeph-ext-prov-jump').click(() => {
                const extProvSelector = '#venue-edit-general > div.external-providers-control.form-group';
                document.querySelector('#edit-panel wz-tab.venue-edit-tab-general').isActive = true;
                setTimeout(() => {
                    document.querySelector(extProvSelector).scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        $(extProvSelector).addClass('highlight');
                        setTimeout(() => {
                            $(extProvSelector).removeClass('highlight');
                        }, 1500);
                    }, 250);
                }, 0);
            });
        }
    }

    class GooglePlaceContainer {
        places = new Map();
        pendingRequests = new Map();

        addPlace(placeId, placeData) {
            this.places.set(placeId, placeData);

            const requestsForId = this.pendingRequests.get(placeId);
            if (requestsForId && requestsForId.length > 0) {
                requestsForId.forEach(request => {
                    clearTimeout(request.timeoutId);
                    request.resolve(placeData);
                });
                this.pendingRequests.delete(placeId);
            }
        }

        #removePendingRequest(placeId, requestToRemove) {
            const requests = this.pendingRequests.get(placeId);
            if (!requests) return;

            const index = requests.indexOf(requestToRemove);
            if (index > -1) {
                requests.splice(index, 1);
            }

            if (requests.length === 0) {
                this.pendingRequests.delete(placeId);
            }
        }

        getPlace(placeId, timeoutMs = 3000) {
            if (this.places.has(placeId)) {
                return Promise.resolve(this.places.get(placeId));
            }

            return new Promise((resolve, reject) => {
                let pendingRequest;

                const timeoutId = setTimeout(() => {
                    const error = new Error(`Request for place ID "${placeId}" timed out after ${timeoutMs / 1000} seconds.`);
                    this.#removePendingRequest(placeId, pendingRequest);
                    reject(error);
                }, timeoutMs);

                pendingRequest = { resolve, reject, timeoutId };

                if (!this.pendingRequests.has(placeId)) {
                    this.pendingRequests.set(placeId, []);
                }
                this.pendingRequests.get(placeId).push(pendingRequest);
            });
        }
    }
    const _googlePlaces = new GooglePlaceContainer();
    let _googlePlacePtFeature;
    let _googlePlaceLineFeature;
    let _destroyGooglePlacePointTimeoutId;

    function interceptGoogleGetDetails() {
        if (typeof google === 'undefined' || !google.maps || !google.maps.places || !google.maps.places.PlacesService) {
            console.debug('Google Maps PlacesService not loaded yet.');
            setTimeout(interceptGoogleGetDetails, 500); // Retry until it loads
            return;
        }

        const originalGetDetails = google.maps.places.PlacesService.prototype.getDetails;
        google.maps.places.PlacesService.prototype.getDetails = function interceptedGetDetails(request, callback) {
            console.debug('Intercepted getDetails call:', request);
            const { placeId } = request;
            const customCallback = function(result, status) {
                const googleResult = { ...result };
                googleResult.placeId = placeId;
                googleResult.requestStatus = status;
                _googlePlaces.addPlace(placeId, googleResult);
                console.debug('Intercepted getDetails response:', googleResult, status);
                callback(result, status); // Pass the result to the original callback
            };

            return originalGetDetails.call(this, request, customCallback);
        };

        console.debug('Google Maps PlacesService.getDetails intercepted successfully.');
    }

    function getOLMapExtent() {
        let extent = W.map.getExtent();
        if (Array.isArray(extent)) {
            extent = new OpenLayers.Bounds(extent);
            extent.transform('EPSG:4326', 'EPSG:3857');
        }
        return extent;
    }

    async function drawGooglePlacePoint(uuid) {
        if (!uuid) return;
        const link = await _googlePlaces.getPlace(uuid);
        if (link?.geometry) {
            const coord = link.geometry.location;
            const poiPt = new OpenLayers.Geometry.Point(coord.lng(), coord.lat());
            poiPt.transform(W.Config.map.projection.remote, W.map.getProjectionObject().projCode);
            const placeGeom = W.selectionManager.getSelectedDataModelObjects()[0].getOLGeometry().getCentroid();
            const placePt = new OpenLayers.Geometry.Point(placeGeom.x, placeGeom.y);
            const ext = getOLMapExtent();
            const lsBounds = new OpenLayers.Geometry.LineString([
                new OpenLayers.Geometry.Point(ext.left, ext.bottom),
                new OpenLayers.Geometry.Point(ext.left, ext.top),
                new OpenLayers.Geometry.Point(ext.right, ext.top),
                new OpenLayers.Geometry.Point(ext.right, ext.bottom),
                new OpenLayers.Geometry.Point(ext.left, ext.bottom)]);
            let lsLine = new OpenLayers.Geometry.LineString([placePt, poiPt]);

            // If the line extends outside the bounds, split it so we don't draw a line across the world.
            const splits = lsLine.splitWith(lsBounds);
            let label = '';
            if (splits) {
                let splitPoints;
                splits.forEach(split => {
                    split.components.forEach(component => {
                        if (component.x === placePt.x && component.y === placePt.y) splitPoints = split;
                    });
                });
                lsLine = new OpenLayers.Geometry.LineString([splitPoints.components[0], splitPoints.components[1]]);
                let distance = WazeWrap.Geometry.calculateDistance([poiPt, placePt]);
                let unitConversion;
                let unit1;
                let unit2;
                if (W.model.isImperial) {
                    distance *= 3.28084;
                    unitConversion = 5280;
                    unit1 = ' ft';
                    unit2 = ' mi';
                } else {
                    unitConversion = 1000;
                    unit1 = ' m';
                    unit2 = ' km';
                }
                if (distance > unitConversion * 10) {
                    label = Math.round(distance / unitConversion) + unit2;
                } else if (distance > 1000) {
                    label = (Math.round(distance / (unitConversion / 10)) / 10) + unit2;
                } else {
                    label = Math.round(distance) + unit1;
                }
            }

            destroyGooglePlacePoint(); // Just in case it still exists.
            _googlePlacePtFeature = new OpenLayers.Feature.Vector(poiPt, { poiCoord: true }, {
                pointRadius: 6,
                strokeWidth: 30,
                strokeColor: '#FF0',
                fillColor: '#FF0',
                strokeOpacity: 0.5
            });
            _googlePlaceLineFeature = new OpenLayers.Feature.Vector(lsLine, {}, {
                strokeWidth: 3,
                strokeDashstyle: '12 8',
                strokeColor: '#FF0',
                label,
                labelYOffset: 45,
                fontColor: '#FF0',
                fontWeight: 'bold',
                labelOutlineColor: '#000',
                labelOutlineWidth: 4,
                fontSize: '18'
            });
            W.map.getLayerByUniqueName('venues').addFeatures([_googlePlacePtFeature, _googlePlaceLineFeature]);
            timeoutDestroyGooglePlacePoint();
        }
    }

    // Destroy the point after some time, if it hasn't been destroyed already.
    function timeoutDestroyGooglePlacePoint() {
        if (_destroyGooglePlacePointTimeoutId) clearTimeout(_destroyGooglePlacePointTimeoutId);
        _destroyGooglePlacePointTimeoutId = setTimeout(() => destroyGooglePlacePoint(), 4000);
    }

    // Remove the POI point from the map.
    function destroyGooglePlacePoint() {
        if (_googlePlacePtFeature) {
            _googlePlacePtFeature.destroy();
            _googlePlacePtFeature = null;
            _googlePlaceLineFeature.destroy();
            _googlePlaceLineFeature = null;
        }
    }

    function addGoogleLinkHoverEvent($el) {
        $el.hover(() => drawGooglePlacePoint(getGooglePlaceUuidFromElement($el)), () => destroyGooglePlacePoint());
    }

    function getGooglePlaceUuidFromElement($el) {
        return $el.attr('uuid');
    }

    function assembleServicesBanner(chainIsClosed) {
        if ($('#WMEPH_services').length === 0) {
            $('#WMEPH_banner').after($('<div id="WMEPH_services">').css({
                color: 'black',
                'font-size': '15px',
                'margin-left': '6px'
            }));
        } else {
            $('#WMEPH_services').empty();
        }

        const venue = getSelectedVenue();
        if (venue && !chainIsClosed && !$('#WMEPH-HideServicesButtons').prop('checked')) {
            // setup Add Service Buttons for suggested services
            const rowDivs = [];
            if (!venue.isResidential()) {
                const $rowDiv = $('<div>');
                const servButtHeight = '27';
                const buttons = [];
                Object.keys(_servicesBanner).forEach(tempKey => {
                    const rowData = _servicesBanner[tempKey];
                    if (rowData.active) { //  If the particular service is active
                        const $input = $('<input>', {
                            class: rowData.icon,
                            id: `WMEPH_${tempKey}`,
                            type: 'button',
                            title: rowData.title
                        }).css(
                            {
                                border: 0,
                                'background-size': 'contain',
                                height: '27px',
                                width: `${Math.ceil(servButtHeight * rowData.w2hratio).toString()}px`
                            }
                        );
                        buttons.push($input);
                        if (!rowData.checked) {
                            $input.css({ '-webkit-filter': 'opacity(.3)', filter: 'opacity(.3)' });
                        } else {
                            $input.css({ color: 'green' });
                        }
                        $rowDiv.append($input);
                    }
                });
                if ($rowDiv.length) {
                    $rowDiv.prepend('<span class="control-label" title="Verify all Place services before saving">Services (select any that apply):</span><br>');
                }
                rowDivs.push($rowDiv);
            }
            $('#WMEPH_services').append(rowDivs);

            // Setup bannServ onclicks
            if (!venue.isResidential()) {
                setupButtonsOld(_servicesBanner);
            }
        }
    }

    // Button onclick event handler
    function setupButtons(flags) {
        flags.forEach(flag => { // Loop through the banner possibilities
            if (flag.action && flag.buttonText) { // If there is an action, set onclick
                buttonAction(flag);
            }
            if (flag.action2 && flag.value2) { // If there is an action2, set onclick
                buttonAction2(flag);
            }
            // If there's a WL option, set up onclick
            if (flag.showWL && flag.WLaction) {
                buttonWhitelist(flag);
            }
        });
    }

    function setupButtonsOld(banner) {
        Object.keys(banner).forEach(flagKey => {
            const flag = banner[flagKey];
            if (flag?.active && flag.action && flag.value) {
                buttonActionOld(flagKey, flag);
            }
            if (flag?.WLactive && flag.WLaction) {
                buttonWhitelistOld(flagKey, flag);
            }
        });
    }
    function buttonActionOld(flagKey, flag) {
        const button = document.getElementById(`WMEPH_${flagKey}`);
        button.onclick = () => {
            flag.action();
            if (!flag.noBannerAssemble) harmonizePlaceGo(getSelectedVenue(), 'harmonize');
        };
    }
    function buttonWhitelistOld(flagKey, flag) {
        const button = document.getElementById(`WMEPH_WL${flagKey}`);
        button.onclick = () => {
            if (flagKey.match(/^\d{5,}/) !== null) {
                flag.WLaction(flagKey);
            } else {
                flag.WLaction();
            }
            flag.WLactive = false;
            flag.severity = SEVERITY.GREEN;
        };
        return button;
    }

    function buttonAction(flag) {
        const button = document.getElementById(`WMEPH_${flag.name}`);
        button.onclick = () => {
            flag.action();
            if (!flag.noBannerAssemble) harmonizePlaceGo(getSelectedVenue(), 'harmonize');
        };
        return button;
    }
    function buttonAction2(flag) {
        const button = document.getElementById(`WMEPH_${flag.name}_2`);
        button.onclick = () => {
            flag.action2();
            if (!flag.noBannerAssemble) harmonizePlaceGo(getSelectedVenue(), 'harmonize');
        };
        return button;
    }
    function buttonWhitelist(flag) {
        const button = document.getElementById(`WMEPH_WL${flag.name}`);
        button.onclick = () => {
            if (flag.name.match(/^\d{5,}/) !== null) {
                flag.WLaction(flag.name);
            } else {
                flag.WLaction();
            }
        };
        return button;
    }

    // Helper functions for getting/setting checkbox checked state.
    function isChecked(id) {
        // We could use jquery here, but I assume native is faster.
        return document.getElementById(id).checked;
    }
    function setCheckbox(id, checkedState) {
        if (isChecked(id) !== checkedState) { $(`#${id}`).click(); }
    }
    function setCheckboxes(ids, checkedState) {
        ids.forEach(id => {
            setCheckbox(id, checkedState);
        });
    }

    function onCopyClicked() {
        const venue = getSelectedVenue();
        const attr = venue.attributes;
        _cloneMaster = {};
        _cloneMaster.addr = venue.getAddress();
        if (_cloneMaster.addr.hasOwnProperty('attributes')) {
            _cloneMaster.addr = _cloneMaster.addr.attributes;
        }
        _cloneMaster.houseNumber = attr.houseNumber;
        _cloneMaster.url = attr.url;
        _cloneMaster.phone = attr.phone;
        _cloneMaster.description = attr.description;
        _cloneMaster.services = attr.services;
        _cloneMaster.openingHours = attr.openingHours;
        _cloneMaster.isPLA = venue.isParkingLot();
        logDev('Place Cloned');
    }

    function onPasteClicked() {
        clonePlace();
    }

    function onCheckAllCloneClicked() {
        setCheckboxes(['WMEPH_CPhn', 'WMEPH_CPstr', 'WMEPH_CPcity', 'WMEPH_CPurl', 'WMEPH_CPph', 'WMEPH_CPserv',
            'WMEPH_CPdesc', 'WMEPH_CPhrs'], true);
    }

    function onCheckAddrCloneClicked() {
        setCheckboxes(['WMEPH_CPhn', 'WMEPH_CPstr', 'WMEPH_CPcity'], true);
        setCheckboxes(['WMEPH_CPurl', 'WMEPH_CPph', 'WMEPH_CPserv', 'WMEPH_CPdesc', 'WMEPH_CPhrs'], false);
    }

    function onCheckNoneCloneClicked() {
        setCheckboxes(['WMEPH_CPhn', 'WMEPH_CPstr', 'WMEPH_CPcity', 'WMEPH_CPurl', 'WMEPH_CPph', 'WMEPH_CPserv',
            'WMEPH_CPdesc', 'WMEPH_CPhrs'], false);
    }

    // WMEPH Clone Tool
    function showCloneButton() {
        if (!$('#clonePlace').length) {
            $('#wmeph-run-panel').append(
                $('<div>', { style: 'margin-bottom: 5px' }),
                $('<input>', {
                    class: 'btn btn-warning btn-xs wmeph-btn',
                    id: 'clonePlace',
                    title: 'Copy place info',
                    type: 'button',
                    value: 'Copy',
                    style: 'font-weight: normal'
                }).click(onCopyClicked),
                $('<input>', {
                    class: 'btn btn-warning btn-xs wmeph-btn',
                    id: 'pasteClone',
                    title: 'Apply the Place info. (Ctrl-Alt-O)',
                    type: 'button',
                    value: 'Paste (for checked boxes):',
                    style: 'font-weight: normal; margin-left: 3px;'
                }).click(onPasteClicked),
                '<br>',
                createCloneCheckbox('wmeph-run-panel', 'WMEPH_CPhn', 'HN'),
                createCloneCheckbox('wmeph-run-panel', 'WMEPH_CPstr', 'Str'),
                createCloneCheckbox('wmeph-run-panel', 'WMEPH_CPcity', 'City'),
                createCloneCheckbox('wmeph-run-panel', 'WMEPH_CPurl', 'URL'),
                createCloneCheckbox('wmeph-run-panel', 'WMEPH_CPph', 'Ph'),
                '<br>',
                createCloneCheckbox('wmeph-run-panel', 'WMEPH_CPdesc', 'Desc'),
                createCloneCheckbox('wmeph-run-panel', 'WMEPH_CPserv', 'Serv'),
                createCloneCheckbox('wmeph-run-panel', 'WMEPH_CPhrs', 'Hrs'),
                $('<input>', {
                    class: 'btn btn-info btn-xs wmeph-btn',
                    id: 'checkAllClone',
                    title: 'Check all',
                    type: 'button',
                    value: 'All',
                    style: 'font-weight: normal'
                }).click(onCheckAllCloneClicked),
                $('<input>', {
                    class: 'btn btn-info btn-xs wmeph-btn',
                    id: 'checkAddrClone',
                    title: 'Check address',
                    type: 'button',
                    value: 'Addr',
                    style: 'font-weight: normal; margin-left: 3px;'
                }).click(onCheckAddrCloneClicked),
                $('<input>', {
                    class: 'btn btn-info btn-xs wmeph-btn',
                    id: 'checkNoneClone',
                    title: 'Check none',
                    type: 'button',
                    value: 'None',
                    style: 'font-weight: normal; margin-left: 3px;'
                }).click(onCheckNoneCloneClicked),
                '<br>'
            );
        }
        const venue = getSelectedVenue();
        updateElementEnabledOrVisible($('#pasteClone'), venue?.isApproved() && venue.arePropertiesEditable());
    }

    function onPlugshareSearchClick() {
        const venue = getSelectedVenue();
        const olPoint = venue.getOLGeometry().getCentroid();
        const point = WazeWrap.Geometry.ConvertTo4326(olPoint.x, olPoint.y);
        const url = `https://www.plugshare.com/?latitude=${point.lat}&longitude=${point.lon}&spanLat=.005&spanLng=.005`;
        if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
            window.open(url);
        } else {
            window.open(url, 'WMEPH - PlugShare Search', _searchResultsWindowSpecs);
        }
    }

    function onOpenWebsiteClick() {
        const venue = getSelectedVenue();
        let { url } = venue.attributes;
        if (url.match(/^http/i) === null) {
            url = `http://${url}`;
        }
        try {
            if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
                window.open(url);
            } else {
                window.open(url, SEARCH_RESULTS_WINDOW_NAME, _searchResultsWindowSpecs);
            }
        } catch (ex) {
            console.error(ex);
            WazeWrap.Alerts.error(SCRIPT_NAME, 'Possible invalid URL. Check the place\'s Website field.');
        }
    }

    function onGoogleSearchClick() {
        const venue = getSelectedVenue();
        const addr = venue.getAddress();
        if (addr.hasState()) {
            const url = buildGLink(venue.attributes.name, addr, venue.attributes.houseNumber);
            if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
                window.open(url);
            } else {
                window.open(url, SEARCH_RESULTS_WINDOW_NAME, _searchResultsWindowSpecs);
            }
        } else {
            WazeWrap.Alerts.error(SCRIPT_NAME, 'The state and country haven\'t been set for this place yet.  Edit the address first.');
        }
    }

    function updateElementEnabledOrVisible($elem, props) {
        if (props.hasOwnProperty('visible')) {
            if (props.visible) {
                $elem.show();
            } else {
                $elem.hide();
            }
        }
        if (props.hasOwnProperty('enabled')) {
            $elem.prop('disabled', !props.enabled);
        }
    }

    // Catch PLs and reloads that have a place selected already and limit attempts to about 10 seconds
    function updateWmephPanel(clearBanner = false) {
        logDev(`updateWmephPanel: clearBanner=${clearBanner}`);

        const venue = getSelectedVenue();

        if (!venue) {
            $('#wmeph-panel').remove();
            $('#wmeph-pre-panel').remove();
            return;
        }

        if (!venue.isApproved() || !venue.arePropertiesEditable()) {
            clearBanner = true;
        }

        if (clearBanner) {
            $('#WMEPH_banner').remove();
            $('#WMEPH_services').remove();
            $('#WMEPH_tools').remove();
            $('#wmeph-pre-panel').remove();
        }

        let $wmephPanel;
        let $wmephPrePanel;
        let $wmephRunPanel;
        let $runButton;
        let $websiteButton;
        let $googleSearchButton;
        let $plugshareSearchButton;

        if (!$('#wmeph-panel').length) {
            const devVersSuffix = IS_BETA_VERSION ? '-β' : '';
            $wmephPrePanel = $('<div>', { id: 'wmeph-pre-panel' });
            $wmephPanel = $('<div>', { id: 'wmeph-panel' });
            $wmephRunPanel = $('<div>', { id: 'wmeph-run-panel' });
            $runButton = $('<input>', {
                class: 'btn btn-primary wmeph-fat-btn',
                id: 'runWMEPH',
                title: `Run WMEPH${devVersSuffix} on Place`,
                type: 'button',
                value: `Run WMEPH${devVersSuffix}`
            }).click(() => { harmonizePlace(); });
            $websiteButton = $('<input>', {
                class: 'btn btn-success btn-xs wmeph-fat-btn',
                id: 'WMEPHurl',
                title: 'Open place URL',
                type: 'button',
                value: 'Website'
            }).click(onOpenWebsiteClick);
            $googleSearchButton = $('<input>', {
                class: 'btn btn-danger btn-xs wmeph-fat-btn',
                id: 'wmephSearch',
                title: 'Search the web for this place.  Do not copy info from 3rd party sources!',
                type: 'button',
                value: 'Google'
            }).click(onGoogleSearchClick);
            $plugshareSearchButton = $('<input>', {
                class: 'btn btn-xs btn-danger wmeph-fat-btn',
                id: 'wmephPlugShareSearch',
                title: 'Open PlugShare website',
                type: 'button',
                value: 'PS',
                style: 'background-color: #003ca6; box-shadow:0 2px 0 #5075b9;'
            }).click(onPlugshareSearchClick);

            $('#edit-panel > .contents').prepend(
                $wmephPrePanel,
                $wmephPanel.append(
                    $wmephRunPanel.append(
                        $runButton,
                        $websiteButton,
                        $googleSearchButton,
                        $plugshareSearchButton
                    )
                )
            );
        } else {
            $wmephPrePanel = $('wmeph-pre-panel');
            $wmephPanel = $('#wmeph-panel');
            $wmephRunPanel = $('#wmeph-run-panel');
            $runButton = $('#runWMEPH');
            $websiteButton = $('#WMEPHurl');
            $googleSearchButton = $('#wmephSearch');
            $plugshareSearchButton = $('#wmephPlugShareSearch');
        }

        updateElementEnabledOrVisible($runButton, { enabled: venue.isApproved() && venue.arePropertiesEditable() });
        updateElementEnabledOrVisible($websiteButton, { enabled: venue.attributes.url?.trim().length, visible: !venue.isResidential() });
        updateElementEnabledOrVisible($googleSearchButton, { enabled: !venue.isResidential(), visible: !venue.isResidential() });
        updateElementEnabledOrVisible($plugshareSearchButton, { visible: venue.isChargingStation() });

        if (localStorage.getItem('WMEPH-EnableCloneMode') === '1') {
            showCloneButton();
        }
        // If the user selects a place in the dupe list, don't clear the labels yet
        if (_dupeIDList.includes(venue.attributes.id)) {
            destroyDupeLabels();
        }

        // Check if there's a backend feed
        // TODO: put this in a separate function?
        if (venue) {
            // It doesn't seem to matter what we pass for lon/lat, so use first geometry point.
            const firstPoint = venue.isPoint() ? venue.getGeometry().coordinates : venue.getGeometry().coordinates[0][0];
            const lon = firstPoint[0];
            const lat = firstPoint[1];
            const url = `https://${location.host}/SearchServer/mozi?lon=${lon}&lat=${lat}&format=PROTO_JSON_FULL&venue_id=venues.${venue.getID()}`;
            $.getJSON(url).done(res => {
                let feedNames = res.venue.external_providers
                    ?.filter(prov => !FEEDS_TO_SKIP.some(skipRegex => skipRegex.test(prov.provider)))
                    .map(prov => prov.provider);
                if (feedNames) feedNames = [...new Set(feedNames)]; // Remove duplicates
                if (feedNames?.length) {
                    const $rowDiv = $('<div>')
                        .css({ padding: '3px 4px 0px 4px', 'background-color': 'yellow' });
                    $rowDiv.append(
                        $('<div>').text('PLEASE DO NOT DELETE').css({ 'font-weight': '500' }),
                        $('<div>').text(`Place is connected to the following feed${feedNames.length > 1 ? 's' : ''}:`)
                            .css({ 'font-size': '13px' }),
                        $('<div>').text(feedNames.join(', ')).css({ 'font-size': '13px' })
                    );
                    $wmephPrePanel.append($rowDiv);
                    // Potential code to hide the delete key if needed.
                    // setTimeout(() => $('#delete-button').setAttribute('disabled', true), 200);
                }
            });
        }
    }

    // Function to clone info from a place
    function clonePlace() {
        log('Cloning info...');
        if (_cloneMaster !== null && _cloneMaster.hasOwnProperty('url')) {
            const venue = getSelectedVenue();
            const cloneItems = {};
            let updateItem = false;
            if (isChecked('WMEPH_CPurl')) {
                cloneItems.url = _cloneMaster.url;
                updateItem = true;
            }
            if (isChecked('WMEPH_CPph')) {
                cloneItems.phone = _cloneMaster.phone;
                updateItem = true;
            }
            if (isChecked('WMEPH_CPdesc')) {
                cloneItems.description = _cloneMaster.description;
                updateItem = true;
            }
            if (isChecked('WMEPH_CPserv') && venue.isParkingLot() === _cloneMaster.isPLA) {
                cloneItems.services = _cloneMaster.services;
                updateItem = true;
            }
            if (isChecked('WMEPH_CPhrs')) {
                cloneItems.openingHours = _cloneMaster.openingHours;
                updateItem = true;
            }
            if (updateItem) {
                addUpdateAction(venue, cloneItems);
                logDev('Venue details cloned');
            }

            const copyStreet = isChecked('WMEPH_CPstr');
            const copyCity = isChecked('WMEPH_CPcity');
            const copyHn = isChecked('WMEPH_CPhn');

            if (copyStreet || copyCity || copyHn) {
                const originalAddress = venue.getAddress();
                const newAddress = {
                    street: copyStreet ? _cloneMaster.addr.street : originalAddress.attributes.street,
                    city: copyCity ? _cloneMaster.addr.city : originalAddress.attributes.city,
                    state: copyCity ? _cloneMaster.addr.state : originalAddress.attributes.state,
                    country: copyCity ? _cloneMaster.addr.country : originalAddress.attributes.country,
                    houseNumber: copyHn ? _cloneMaster.addr.houseNumber : originalAddress.attributes.houseNumber
                };
                updateAddress(venue, newAddress);
                logDev('Venue address cloned');
            }
        } else {
            log('Please copy a place');
        }
    }

    // Formats "hour object" into a string.
    function formatOpeningHour(hourEntry) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const hours = `${hourEntry.fromHour}-${hourEntry.toHour}`;
        return hourEntry.days.map(day => `${dayNames[day]} ${hours}`).join(', ');
    }
    // Pull natural text from opening hours
    function getOpeningHours(venue) {
        return venue && venue.attributes.openingHours && venue.attributes.openingHours.map(formatOpeningHour);
    }

    function venueHasOverlappingHours(openingHours) {
        if (openingHours.length < 2) {
            return false;
        }

        for (let day2Ch = 0; day2Ch < 7; day2Ch++) { // Go thru each day of the week
            const daysObj = [];
            for (let hourSet = 0; hourSet < openingHours.length; hourSet++) { // For each set of hours
                if (openingHours[hourSet].days.includes(day2Ch)) { // pull out hours that are for the current day, add 2400 if it goes past midnight, and store
                    const fromHourTemp = openingHours[hourSet].fromHour.replace(/:/g, '');
                    let toHourTemp = openingHours[hourSet].toHour.replace(/:/g, '');
                    if (toHourTemp <= fromHourTemp) {
                        toHourTemp = parseInt(toHourTemp, 10) + 2400;
                    }
                    daysObj.push([fromHourTemp, toHourTemp]);
                }
            }
            if (daysObj.length > 1) { // If there's multiple hours for the day, check them for overlap
                for (let hourSetCheck2 = 1; hourSetCheck2 < daysObj.length; hourSetCheck2++) {
                    for (let hourSetCheck1 = 0; hourSetCheck1 < hourSetCheck2; hourSetCheck1++) {
                        if (daysObj[hourSetCheck2][0] > daysObj[hourSetCheck1][0] && daysObj[hourSetCheck2][0] < daysObj[hourSetCheck1][1]) {
                            return true;
                        }
                        if (daysObj[hourSetCheck2][1] > daysObj[hourSetCheck1][0] && daysObj[hourSetCheck2][1] < daysObj[hourSetCheck1][1]) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    const NO_NUM_SKIP = ['BANK', 'ATM', 'HOTEL', 'MOTEL', 'STORE', 'MARKET', 'SUPERMARKET', 'GYM', 'GAS', 'GASOLINE',
        'GASSTATION', 'CAFE', 'OFFICE', 'OFFICES', 'CARRENTAL', 'RENTALCAR', 'RENTAL', 'SALON', 'BAR',
        'BUILDING', 'LOT', ...COLLEGE_ABBREVIATIONS];

    // Duplicate place finder  ###bmtg
    function findNearbyDuplicate(selectedVenueName, selectedVenueAliases, selectedVenue, recenterOption) {
        // Helper function to prep a name for comparisons.
        const formatName = name => name.toUpperCase().replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '');

        // Remove any previous search labels
        _dupeLayer.destroyFeatures();

        const mapExtent = getOLMapExtent();
        const padFrac = 0.15; // how much to pad the zoomed window

        // generic terms to skip if it's all that remains after stripping numbers
        const allowedTwoLetters = ['BP', 'DQ', 'BK', 'BW', 'LQ', 'QT', 'DB', 'PO'];

        // Make the padded extent
        mapExtent.left += padFrac * (mapExtent.right - mapExtent.left);
        mapExtent.right -= padFrac * (mapExtent.right - mapExtent.left);
        mapExtent.bottom += padFrac * (mapExtent.top - mapExtent.bottom);
        mapExtent.top -= padFrac * (mapExtent.top - mapExtent.bottom);
        let outOfExtent = false;
        let overlappingFlag = false;

        // Initialize the coordinate extents for duplicates
        const selectedCentroid = selectedVenue.getOLGeometry().getCentroid();
        let minLon = selectedCentroid.x;
        let minLat = selectedCentroid.y;
        let maxLon = minLon;
        let maxLat = minLat;

        // Label stuff for display
        const labelFeatures = [];
        const dupeNames = [];
        let labelColorIX = 0;
        const labelColorList = ['#3F3'];

        // Name formatting for the WME place name
        const selectedVenueNameRF = formatName(selectedVenueName);
        let currNameList = [];
        if (selectedVenueNameRF.length > 2 || allowedTwoLetters.includes(selectedVenueNameRF)) {
            currNameList.push(selectedVenueNameRF);
        } else {
            currNameList.push('PRIMNAMETOOSHORT_PJZWX');
        }

        const selectedVenueAttr = selectedVenue.attributes;

        // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB )
        const venueNameNoNum = selectedVenueNameRF.replace(/[^A-Z]/g, '');
        if (((venueNameNoNum.length > 2 && !NO_NUM_SKIP.includes(venueNameNoNum)) || allowedTwoLetters.includes(venueNameNoNum))
            && !selectedVenueAttr.categories.includes(CAT.PARKING_LOT)) {
            // only add de-numbered name if anything remains
            currNameList.push(venueNameNoNum);
        }

        if (selectedVenueAliases.length > 0) {
            for (let aliix = 0; aliix < selectedVenueAliases.length; aliix++) {
                // Format name
                const aliasNameRF = formatName(selectedVenueAliases[aliix]);
                if ((aliasNameRF.length > 2 && !NO_NUM_SKIP.includes(aliasNameRF)) || allowedTwoLetters.includes(aliasNameRF)) {
                    // only add de-numbered name if anything remains
                    currNameList.push(aliasNameRF);
                }
                // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB )
                const aliasNameNoNum = aliasNameRF.replace(/[^A-Z]/g, '');
                if (((aliasNameNoNum.length > 2 && !NO_NUM_SKIP.includes(aliasNameNoNum)) || allowedTwoLetters.includes(aliasNameNoNum))
                    && !selectedVenueAttr.categories.includes(CAT.PARKING_LOT)) {
                    // only add de-numbered name if anything remains
                    currNameList.push(aliasNameNoNum);
                }
            }
        }
        currNameList = uniq(currNameList); //  remove duplicates

        let selectedVenueAddr = selectedVenue.getAddress();
        selectedVenueAddr = selectedVenueAddr.attributes || selectedVenueAddr;
        const selectedVenueHN = selectedVenueAttr.houseNumber;

        const selectedVenueAddrIsComplete = selectedVenueAddr.street !== null && selectedVenueAddr.street.getName() !== null
            && selectedVenueHN && selectedVenueHN.match(/\d/g) !== null;

        const venues = W.model.venues.getObjectArray();
        const selectedVenueId = selectedVenueAttr.id;

        _dupeIDList = [selectedVenueId];
        _dupeHNRangeList = [];
        _dupeHNRangeDistList = [];

        // Get the list of dupes that have been whitelisted.
        const selectedVenueWL = _venueWhitelist[selectedVenueId];
        const whitelistedDupes = selectedVenueWL && selectedVenueWL.dupeWL ? selectedVenueWL.dupeWL : [];

        const excludePLADupes = $('#WMEPH-ExcludePLADupes').prop('checked');
        let randInt = 100;
        // For each place on the map:
        venues.forEach(testVenue => {
            if ((!excludePLADupes || (excludePLADupes && !(selectedVenue.isParkingLot() || testVenue.isParkingLot())))
                && !isEmergencyRoom(testVenue)) {
                const testVenueAttr = testVenue.attributes;
                const testVenueId = testVenueAttr.id;

                // Check for overlapping PP's
                const testCentroid = testVenue.getOLGeometry().getCentroid();
                const pt2ptDistance = selectedCentroid.distanceTo(testCentroid);
                if (selectedVenue.isPoint() && testVenue.isPoint() && pt2ptDistance < 2 && selectedVenueId !== testVenueId) {
                    overlappingFlag = true;
                }

                const testVenueHN = testVenueAttr.houseNumber;
                let testVenueAddr = testVenue.getAddress();
                testVenueAddr = testVenueAddr.attributes || testVenueAddr;

                // get HNs for places on same street
                if (selectedVenueAddrIsComplete && testVenueAddr.street !== null && testVenueAddr.street.getName() !== null
                    && testVenueHN && testVenueHN !== '' && testVenueId !== selectedVenueId
                    && selectedVenueAddr.street.getName() === testVenueAddr.street.getName() && testVenueHN < 1000000) {
                    _dupeHNRangeList.push(parseInt(testVenueHN, 10));
                    _dupeHNRangeDistList.push(pt2ptDistance);
                }

                // Check for duplicates
                // don't do res, the point itself, new points or no name
                if (!whitelistedDupes.includes(testVenueId) && _dupeIDList.length < 6 && pt2ptDistance < 800
                    && !testVenue.isResidential() && testVenueId !== selectedVenueId && !testVenue.isNew()
                    && testVenueAttr.name !== null && testVenueAttr.name.length > 1) {
                    // If venue has a complete address and test venue does, and they are different, then no dupe
                    let suppressMatch = false;
                    if (selectedVenueAddrIsComplete && testVenueAddr.street !== null && testVenueAddr.street.getName() !== null
                        && testVenueHN && testVenueHN.match(/\d/g) !== null) {
                        if (selectedVenueAttr.lockRank > 0 && testVenueAttr.lockRank > 0) {
                            if (selectedVenueAttr.houseNumber !== testVenueHN
                                || selectedVenueAddr.street.getName() !== testVenueAddr.street.getName()) {
                                suppressMatch = true;
                            }
                        } else if (selectedVenueHN !== testVenueHN
                            && selectedVenueAddr.street.getName() !== testVenueAddr.street.getName()) {
                            suppressMatch = true;
                        }
                    }

                    if (!suppressMatch) {
                        let testNameList;
                        // Reformat the testPlace name
                        const strippedTestName = formatName(testVenueAttr.name)
                            .replace(/\s+[-(].*$/, ''); // Remove localization text
                        if ((strippedTestName.length > 2 && !NO_NUM_SKIP.includes(strippedTestName))
                            || allowedTwoLetters.includes(strippedTestName)) {
                            testNameList = [strippedTestName];
                        } else {
                            testNameList = [`TESTNAMETOOSHORTQZJXS${randInt}`];
                            randInt++;
                        }

                        const testNameNoNum = strippedTestName.replace(/[^A-Z]/g, ''); // Clear non-letter characters for alternate match
                        if (((testNameNoNum.length > 2 && !NO_NUM_SKIP.includes(testNameNoNum)) || allowedTwoLetters.includes(testNameNoNum))
                            && !testVenueAttr.categories.includes(CAT.PARKING_LOT)) { //  only add de-numbered name if at least 2 chars remain
                            testNameList.push(testNameNoNum);
                        }

                        // primary name matching loop
                        let nameMatch = false;
                        for (let tnlix = 0; tnlix < testNameList.length; tnlix++) {
                            for (let cnlix = 0; cnlix < currNameList.length; cnlix++) {
                                if ((testNameList[tnlix].includes(currNameList[cnlix]) || currNameList[cnlix].includes(testNameList[tnlix]))) {
                                    nameMatch = true;
                                    break;
                                }
                            }
                            if (nameMatch) { break; } // break if a match found
                        }

                        let altNameMatch = -1;
                        if (!nameMatch && testVenueAttr.aliases.length > 0) {
                            for (let aliix = 0; aliix < testVenueAttr.aliases.length; aliix++) {
                                const aliasNameRF = formatName(testVenueAttr.aliases[aliix]);
                                if ((aliasNameRF.length > 2 && !NO_NUM_SKIP.includes(aliasNameRF)) || allowedTwoLetters.includes(aliasNameRF)) {
                                    testNameList = [aliasNameRF];
                                } else {
                                    testNameList = [`ALIASNAMETOOSHORTQOFUH${randInt}`];
                                    randInt++;
                                }
                                const aliasNameNoNum = aliasNameRF.replace(/[^A-Z]/g, ''); // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB )
                                if (((aliasNameNoNum.length > 2 && !NO_NUM_SKIP.includes(aliasNameNoNum)) || allowedTwoLetters.includes(aliasNameNoNum))
                                    && !testVenueAttr.categories.includes(CAT.PARKING_LOT)) { //  only add de-numbered name if at least 2 characters remain
                                    testNameList.push(aliasNameNoNum);
                                } else {
                                    testNameList.push(`111231643239${randInt}`); //  just to keep track of the alias in question, always add something.
                                    randInt++;
                                }
                            }
                            for (let tnlix = 0; tnlix < testNameList.length; tnlix++) {
                                for (let cnlix = 0; cnlix < currNameList.length; cnlix++) {
                                    if ((testNameList[tnlix].includes(currNameList[cnlix]) || currNameList[cnlix].includes(testNameList[tnlix]))) {
                                        // get index of that match (half of the array index with floor)
                                        altNameMatch = Math.floor(tnlix / 2);
                                        break;
                                    }
                                }
                                if (altNameMatch > -1) { break; } // break from the rest of the alts if a match found
                            }
                        }
                        // If a match was found:
                        if (nameMatch || altNameMatch > -1) {
                            _dupeIDList.push(testVenueAttr.id); // Add the venue to the list of matches
                            _dupeLayer.setVisibility(true); // If anything found, make visible the dupe layer

                            const labelText = nameMatch ? testVenueAttr.name : `${testVenueAttr.aliases[altNameMatch]} (Alt)`;
                            logDev(`Possible duplicate found. WME place: ${selectedVenueName} / Nearby place: ${labelText}`);

                            // Reformat the name into multiple lines based on length
                            const labelTextBuild = [];
                            let maxLettersPerLine = Math.round(2 * Math.sqrt(labelText.replace(/ /g, '').length / 2));
                            maxLettersPerLine = Math.max(maxLettersPerLine, 4);
                            let startIX = 0;
                            let endIX = 0;
                            while (endIX !== -1) {
                                endIX = labelText.indexOf(' ', endIX + 1);
                                if (endIX - startIX > maxLettersPerLine) {
                                    labelTextBuild.push(labelText.substr(startIX, endIX - startIX));
                                    startIX = endIX + 1;
                                }
                            }
                            labelTextBuild.push(labelText.substr(startIX)); // Add last line
                            let labelTextReformat = labelTextBuild.join('\n');
                            // Add photo icons
                            if (testVenueAttr.images.length) {
                                labelTextReformat = `${labelTextReformat} `;
                                for (let phix = 0; phix < testVenueAttr.images.length; phix++) {
                                    if (phix === 3) {
                                        labelTextReformat = `${labelTextReformat}+`;
                                        break;
                                    }
                                    labelTextReformat = `${labelTextReformat}\u25A3`; // add photo icons
                                }
                            }

                            const lonLat = getVenueLonLat(testVenue);
                            if (!mapExtent.containsLonLat(lonLat)) {
                                outOfExtent = true;
                            }
                            minLat = Math.min(minLat, lonLat.lat);
                            minLon = Math.min(minLon, lonLat.lon);
                            maxLat = Math.max(maxLat, lonLat.lat);
                            maxLon = Math.max(maxLon, lonLat.lon);

                            labelFeatures.push(new OpenLayers.Feature.Vector(
                                testCentroid,
                                {
                                    labelText: labelTextReformat,
                                    fontColor: '#fff',
                                    strokeColor: labelColorList[labelColorIX % labelColorList.length],
                                    labelAlign: 'cm',
                                    pointRadius: 25,
                                    dupeID: testVenueId
                                }
                            ));
                            dupeNames.push(labelText);
                        }
                        labelColorIX++;
                    }
                }
            }
        });

        // Add a marker for the working place point if any dupes were found
        if (_dupeIDList.length > 1) {
            const lonLat = getVenueLonLat(selectedVenue);
            if (!mapExtent.containsLonLat(lonLat)) {
                outOfExtent = true;
            }
            minLat = Math.min(minLat, lonLat.lat);
            minLon = Math.min(minLon, lonLat.lon);
            maxLat = Math.max(maxLat, lonLat.lat);
            maxLon = Math.max(maxLon, lonLat.lon);
            // Add photo icons
            let currentLabel = 'Current';
            if (selectedVenueAttr.images.length > 0) {
                for (let ciix = 0; ciix < selectedVenueAttr.images.length; ciix++) {
                    currentLabel = `${currentLabel} `;
                    if (ciix === 3) {
                        currentLabel = `${currentLabel}+`;
                        break;
                    }
                    currentLabel = `${currentLabel}\u25A3`; // add photo icons
                }
            }
            labelFeatures.push(new OpenLayers.Feature.Vector(
                selectedCentroid,
                {
                    labelText: currentLabel,
                    fontColor: '#fff',
                    strokeColor: '#fff',
                    labelAlign: 'cm',
                    pointRadius: 25,
                    dupeID: selectedVenueId
                }
            ));
            _dupeLayer.addFeatures(labelFeatures);
        }

        if (recenterOption && dupeNames.length > 0 && outOfExtent) { // then rebuild the extent to include the duplicate
            const padMult = 1.0;
            mapExtent.left = minLon - (padFrac * padMult) * (maxLon - minLon);
            mapExtent.right = maxLon + (padFrac * padMult) * (maxLon - minLon);
            mapExtent.bottom = minLat - (padFrac * padMult) * (maxLat - minLat);
            mapExtent.top = maxLat + (padFrac * padMult) * (maxLat - minLat);
            W.map.getOLMap().zoomToExtent(mapExtent);
        }
        return [dupeNames, overlappingFlag];
    } // END findNearbyDuplicate function

    // Functions to infer address from nearby segments
    function inferAddress(venue, maxRecursionDepth) {
        let distanceToSegment;
        let foundAddresses = [];
        let i;
        // Ignore pedestrian boardwalk, stairways, runways, and railroads
        const IGNORE_ROAD_TYPES = [10, 16, 18, 19];
        let inferredAddress = {
            country: null,
            city: null,
            state: null,
            street: null
        };
        let n;
        let orderedSegments = [];
        const segments = W.model.segments.getObjectArray();
        let stopPoint;

        // Make sure a place is selected and segments are loaded.
        if (!(venue && segments.length)) {
            return undefined;
        }

        const getFCRank = FC => {
            const typeToFCRank = {
                3: 0, // freeway
                6: 1, // major
                7: 2, // minor
                2: 3, // primary
                1: 4, // street
                20: 5, // PLR
                8: 6 // dirt
            };
            return typeToFCRank[FC] || 100;
        };

        const hasStreetName = segment => {
            if (!segment || segment.type !== 'segment') return false;
            const addr = segment.getAddress();
            return !(addr.isEmpty() || addr.isEmptyStreet());
        };

        const findClosestNode = () => {
            const closestSegment = orderedSegments[0].segment;
            let distanceA;
            let distanceB;
            const nodeA = W.model.nodes.getObjectById(closestSegment.attributes.fromNodeID);
            const nodeB = W.model.nodes.getObjectById(closestSegment.attributes.toNodeID);
            if (nodeA && nodeB) {
                const pt = stopPoint.getPoint ? stopPoint.getPoint() : stopPoint;
                distanceA = pt.distanceTo(nodeA.getOLGeometry());
                distanceB = pt.distanceTo(nodeB.getOLGeometry());
                return distanceA < distanceB ? nodeA.attributes.id : nodeB.attributes.id;
            }
            return undefined;
        };

        const findConnections = (startingNodeID, recursionDepth) => {
            let newNode;

            // Limit search depth to avoid problems.
            if (recursionDepth > maxRecursionDepth) {
                return;
            }

            // Populate variable with segments connected to starting node.
            const connectedSegments = orderedSegments.filter(seg => [seg.fromNodeID, seg.toNodeID].includes(startingNodeID));

            // Check connected segments for address info.
            const keys = Object.keys(connectedSegments);
            for (let idx = 0; idx < keys.length; idx++) {
                const k = keys[idx];
                if (hasStreetName(connectedSegments[k].segment)) {
                    // Address found, push to array.
                    foundAddresses.push({
                        depth: recursionDepth,
                        distance: connectedSegments[k].distance,
                        segment: connectedSegments[k].segment
                    });
                    break;
                } else {
                    // If not found, call function again starting from the other node on this segment.
                    const attr = connectedSegments[k].segment.attributes;
                    newNode = attr.fromNodeID === startingNodeID ? attr.toNodeID : attr.fromNodeID;
                    findConnections(newNode, recursionDepth + 1);
                }
            }
        };

        const { entryExitPoints } = venue.attributes;
        if (entryExitPoints.length) {
            // Get the primary stop point, if one exists.  If none, get the first point.
            stopPoint = entryExitPoints.find(pt => pt.isPrimary()) || entryExitPoints[0];
        } else {
            // If no stop points, just use the venue's centroid.
            stopPoint = venue.getOLGeometry().getCentroid();
        }

        // Go through segment array and calculate distances to segments.
        for (i = 0, n = segments.length; i < n; i++) {
            // Make sure the segment is not an ignored roadType.
            if (!IGNORE_ROAD_TYPES.includes(segments[i].attributes.roadType)) {
                distanceToSegment = (stopPoint.getPoint ? stopPoint.getPoint() : stopPoint).distanceTo(segments[i].getOLGeometry());
                // Add segment object and its distanceTo to an array.
                orderedSegments.push({
                    distance: distanceToSegment,
                    fromNodeID: segments[i].attributes.fromNodeID,
                    segment: segments[i],
                    toNodeID: segments[i].attributes.toNodeID
                });
            }
        }

        // Sort the array with segments and distance.
        orderedSegments = _.sortBy(orderedSegments, 'distance');

        // Check closest segment for address first.
        if (hasStreetName(orderedSegments[0].segment)) {
            inferredAddress = orderedSegments[0].segment.getAddress();
        } else {
            // If address not found on closest segment, try to find address through branching method.
            findConnections(findClosestNode(), 1);
            if (foundAddresses.length > 0) {
                // If more than one address found at same recursion depth, look at FC of segments.
                if (foundAddresses.length > 1) {
                    foundAddresses.forEach(element => {
                        element.fcRank = getFCRank(element.segment.attributes.roadType);
                    });
                    foundAddresses = _.sortBy(foundAddresses, 'fcRank');
                    foundAddresses = _.filter(foundAddresses, {
                        fcRank: foundAddresses[0].fcRank
                    });
                }

                // If multiple segments with same FC, Use address from segment with address that is closest by connectivity.
                if (foundAddresses.length > 1) {
                    foundAddresses = _.sortBy(foundAddresses, 'depth');
                    foundAddresses = _.filter(foundAddresses, {
                        depth: foundAddresses[0].depth
                    });
                }

                // If more than one of the closest segments by connectivity has the same FC, look for
                // closest segment geometrically.
                if (foundAddresses.length > 1) {
                    foundAddresses = _.sortBy(foundAddresses, 'distance');
                }
                console.debug(foundAddresses[0].streetName, foundAddresses[0].depth);
                inferredAddress = foundAddresses[0].segment.getAddress();
            } else {
                // Default to closest if branching method fails.
                // Go through sorted segment array until a country, state, and city have been found.
                const closestElem = orderedSegments.find(element => hasStreetName(element.segment));
                inferredAddress = closestElem ? closestElem.segment.getAddress() || inferredAddress : inferredAddress;
            }
        }
        return inferredAddress;
    } // END inferAddress function

    /**
     * Updates the address for a place.
     * @param feature {WME Venue Object} The place to update.
     * @param address {Object} An object containing the country, state, city, and street
     * @param actions {Array of actions} Optional. If performing multiple actions at once.
     * objects.
     */
    function updateAddress(feature, address, actions) {
        let newAttributes;
        if (feature && address) {
            newAttributes = {
                countryID: address.country.attributes.id,
                stateID: address.state.attributes.id,
                cityName: address.city.getName(),
                emptyCity: address.city.hasName() ? null : true,
                streetName: address.street.getName(),
                emptyStreet: address.street.attributes.isEmpty ? true : null
            };
            const newActions = [];
            newActions.push(new UpdateFeatureAddress(feature, newAttributes));
            if (address.hasOwnProperty('houseNumber')) {
                newActions.push(new UpdateObject(feature, { houseNumber: address.houseNumber }));
            }
            const multiAction = new MultiAction(newActions, { description: 'Update venue address' });
            if (actions) {
                actions.push(multiAction);
            } else {
                W.model.actionManager.add(multiAction);
            }
            logDev('Address inferred and updated');
        }
    }

    // Build a Google search url based on place name and address
    function buildGLink(searchName, addr, HN) {
        let searchHN = '';
        let searchStreet = '';
        let searchCity = '';
        searchName = searchName.replace(/\//g, ' ');
        if (!addr.isEmptyStreet()) {
            searchStreet = `${addr.getStreetName()}, `
                .replace(/CR-/g, 'County Rd ')
                .replace(/SR-/g, 'State Hwy ')
                .replace(/US-/g, 'US Hwy ')
                .replace(/ CR /g, ' County Rd ')
                .replace(/ SR /g, ' State Hwy ')
                .replace(/ US /g, ' US Hwy ')
                .replace(/$CR /g, 'County Rd ')
                .replace(/$SR /g, 'State Hwy ')
                .replace(/$US /g, 'US Hwy ');
            if (HN && searchStreet !== '') {
                searchHN = `${HN} `;
            }
        }
        const city = addr.getCity();
        if (city && !city.isEmpty()) {
            searchCity = `${city.getName()}, `;
        }

        searchName = searchName + (searchName ? ', ' : '') + searchHN + searchStreet
            + searchCity + addr.getStateName();
        return `http://www.google.com/search?q=${encodeURIComponent(searchName)}`;
    }

    // compares two arrays to see if equal, regardless of order
    function matchSets(array1, array2) {
        if (array1.length !== array2.length) { return false; } // compare lengths
        for (let i = 0; i < array1.length; i++) {
            if (!array2.includes(array1[i])) {
                return false;
            }
        }
        return true;
    }

    // function that checks if all elements of target are in array:source
    function containsAll(source, target) {
        if (typeof target === 'undefined' || target === null) return false;
        if (typeof target === 'string') { target = [target]; } // if a single string, convert to an array
        for (let ixx = 0; ixx < target.length; ixx++) {
            if (!source.includes(target[ixx])) {
                return false;
            }
        }
        return true;
    }

    // function that checks if any element of target are in source
    /**
     * Checks if any element of target are in source
     *
     * @param {Array|string} source Source array.
     * @param {Array|string} target Array of items to check against source.
     * @return {boolean} True if any item in target exists in source.
     */
    function containsAny(source, target) {
        if (typeof source === 'string') { source = [source]; } // if a single string, convert to an array
        if (typeof target === 'string') { target = [target]; } // if a single string, convert to an array
        return source.some(item => target.includes(item));
    }

    /**
     * Copies an array, inserts an item or array of items at a specified index, and removes any duplicates.
     * Can be used to move the position of an item in an array.
     *
     * @param {Array} sourceArray Original array. This array is not modified.
     * @param {*} toInsert Item or array of items to insert.
     * @param {Number} atIndex The index to insert at.
     * @return {Array} An array with the new item(s) inserted.
     */
    function insertAtIndex(sourceArray, toInsert, atIndex) {
        const sourceCopy = sourceArray.slice();
        if (!Array.isArray(toInsert)) toInsert = [toInsert];
        sourceCopy.splice(atIndex, 0, ...toInsert);
        return uniq(sourceCopy);
    }

    function arraysAreEqual(array1, array2) {
        return array1.legth === array2.length && array1.every((item, index) => item === array2[index]);
    }

    function removeUnnecessaryAliases(venueName, aliases) {
        const newAliases = [];
        let aliasesRemoved = false;
        venueName = venueName.replace(/['=\\/]/i, '');
        venueName = venueName.toUpperCase().replace(/'/g, '').replace(/(-|\/ | \/| {2,})/g, ' ');
        for (let naix = 0; naix < aliases.length; naix++) {
            if (!venueName.startsWith(aliases[naix].toUpperCase().replace(/'/g, '').replace(/(-|\/ | \/| {2,})/g, ' '))) {
                newAliases.push(aliases[naix]);
            } else {
                aliasesRemoved = true;
            }
        }
        return aliasesRemoved ? newAliases : null;
    }

    // used for phone reformatting
    function phoneFormat(format, ...rest) {
        return format.replace(/{(\d+)}/g, (name, number) => (typeof rest[number] !== 'undefined' ? rest[number] : null));
    }

    function initSettingsCheckbox(settingID) {
        // Associate click event of new checkbox to call saveSettingToLocalStorage with proper ID
        $(`#${settingID}`).click(() => { saveSettingToLocalStorage(settingID); });
        // Load Setting for Local Storage, if it doesn't exist set it to NOT checked.
        // If previously set to 1, then trigger "click" event.
        if (!localStorage.getItem(settingID)) {
            // logDev(settingID + ' not found.');
        } else if (localStorage.getItem(settingID) === '1') {
            $(`#${settingID}`).prop('checked', true);
        }
    }

    // This routine will create a checkbox in the #PlaceHarmonizer tab and will load the setting
    //        settingID:  The #id of the checkbox being created.
    //  textDescription:  The description of the checkbox that will be use
    function createSettingsCheckbox($div, settingID, textDescription) {
        const $checkbox = $('<input>', { type: 'checkbox', id: settingID });
        $div.append(
            $('<div>', { class: 'controls-container' }).css({ paddingTop: '2px' }).append(
                $checkbox,
                $('<label>', { for: settingID }).text(textDescription).css({ whiteSpace: 'pre-line' })
            )
        );
        return $checkbox;
    }

    function onKBShortcutModifierKeyClick() {
        const $modifKeyCheckbox = $('#WMEPH-KBSModifierKey');
        const $shortcutInput = $('#WMEPH-KeyboardShortcut');
        const $warn = $('#PlaceHarmonizerKBWarn');
        const modifKeyNew = $modifKeyCheckbox.prop('checked') ? 'Ctrl+' : 'Alt+';

        _shortcutParse = parseKBSShift($shortcutInput.val());
        $warn.empty(); // remove any warning
        SHORTCUT.remove(_modifKey + _shortcutParse);
        _modifKey = modifKeyNew;
        SHORTCUT.add(_modifKey + _shortcutParse, harmonizePlace);
        $('#PlaceHarmonizerKBCurrent').empty().append(
            `<span style="font-weight:bold">Current shortcut: ${_modifKey}${_shortcutParse}</span>`
        );
    }

    function onKBShortcutChange() {
        const keyId = 'WMEPH-KeyboardShortcut';
        const $warn = $('#PlaceHarmonizerKBWarn');
        const $key = $(`#${keyId}`);
        const oldKey = localStorage.getItem(keyId);
        const newKey = $key.val();

        $warn.empty(); // remove old warning
        if (newKey.match(/^[a-z]{1}$/i) !== null) { // If a single letter...
            _shortcutParse = parseKBSShift(oldKey);
            const shortcutParseNew = parseKBSShift(newKey);
            SHORTCUT.remove(_modifKey + _shortcutParse);
            _shortcutParse = shortcutParseNew;
            SHORTCUT.add(_modifKey + _shortcutParse, harmonizePlace);
            $(localStorage.setItem(keyId, newKey));
            $('#PlaceHarmonizerKBCurrent').empty().append(`<span style="font-weight:bold">Current shortcut: ${_modifKey}${_shortcutParse}</span>`);
        } else { // if not a letter then reset and flag
            $key.val(oldKey);
            $warn.append('<p style="color:red">Only letters are allowed<p>');
        }
    }

    function setCheckedByDefault(id) {
        if (localStorage.getItem(id) === null) {
            localStorage.setItem(id, '1');
        }
    }

    // User pref for KB Shortcut:
    function initShortcutKey() {
        const $current = $('#PlaceHarmonizerKBCurrent');
        const defaultShortcutKey = IS_BETA_VERSION ? 'S' : 'A';
        const shortcutID = 'WMEPH-KeyboardShortcut';
        let shortcutKey = localStorage.getItem(shortcutID);
        const $shortcutInput = $(`#${shortcutID}`);

        // Set local storage to default if none
        if (shortcutKey === null || !/^[a-z]{1}$/i.test(shortcutKey)) {
            localStorage.setItem(shortcutID, defaultShortcutKey);
            shortcutKey = defaultShortcutKey;
        }
        $shortcutInput.val(shortcutKey);

        if (localStorage.getItem('WMEPH-KBSModifierKey') === '1') { // Change modifier key code if checked
            _modifKey = 'Ctrl+';
        }
        _shortcutParse = parseKBSShift(shortcutKey);
        if (!_initAlreadyRun) SHORTCUT.add(_modifKey + _shortcutParse, harmonizePlace);
        $current.empty().append(`<span style="font-weight:bold">Current shortcut: ${_modifKey}${_shortcutParse}</span>`);

        $('#WMEPH-KBSModifierKey').click(onKBShortcutModifierKeyClick);

        // Upon change of the KB letter:
        $shortcutInput.change(onKBShortcutChange);
    }

    function onWLMergeClick() {
        const $wlToolsMsg = $('#PlaceHarmonizerWLToolsMsg');
        const $wlInput = $('#WMEPH-WLInput');

        $wlToolsMsg.empty();
        if ($wlInput.val() === 'resetWhitelist') {
            /* if (confirm('***Do you want to reset all Whitelist data?\nClick OK to erase.')) {
                // if the category doesn't translate, then pop an alert that will make a forum post to the thread
                _venueWhitelist = { '1.1.1': { Placeholder: {} } }; // Populate with a dummy place
                saveWhitelistToLS(true);
            } */
            WazeWrap.Alerts.confirm( // if the category doesn't translate, then pop an alert that will make a forum post to the thread
                SCRIPT_NAME,
                '***Do you want to reset all Whitelist data?<br>Click OK to erase.',
                () => {
                    _venueWhitelist = { '1.1.1': { Placeholder: {} } }; // Populate with a dummy place
                    saveWhitelistToLS(true);
                },
                () => { }
            );
        } else { // try to merge uncompressed WL data
            let wlStringToMerge = validateWLS($('#WMEPH-WLInput').val());
            if (wlStringToMerge) {
                log('Whitelists merged!');
                _venueWhitelist = mergeWL(_venueWhitelist, wlStringToMerge);
                saveWhitelistToLS(true);
                $wlToolsMsg.append('<p style="color:green">Whitelist data merged<p>');
                $wlInput.val('');
            } else { // try compressed WL
                wlStringToMerge = validateWLS(LZString.decompressFromUTF16($('#WMEPH-WLInput').val()));
                if (wlStringToMerge) {
                    log('Whitelists merged!');
                    _venueWhitelist = mergeWL(_venueWhitelist, wlStringToMerge);
                    saveWhitelistToLS(true);
                    $wlToolsMsg.append('<p style="color:green">Whitelist data merged<p>');
                    $wlInput.val('');
                } else {
                    $wlToolsMsg.append('<p style="color:red">Invalid Whitelist data<p>');
                }
            }
        }
    }

    function onWLPullClick() {
        $('#WMEPH-WLInput').val(
            LZString.decompressFromUTF16(
                localStorage.getItem(WL_LOCAL_STORE_NAME_COMPRESSED)
            )
        );
        $('#PlaceHarmonizerWLToolsMsg').empty().append(
            '<p style="color:green">To backup the data, copy & paste the text in the box to a safe location.<p>'
        );
        localStorage.setItem('WMEPH_WLAddCount', 1);
    }

    function onWLStatsClick() {
        const currWLData = JSON.parse(
            LZString.decompressFromUTF16(
                localStorage.getItem(WL_LOCAL_STORE_NAME_COMPRESSED)
            )
        );
        const countryWL = {};
        const stateWL = {};
        const entries = Object.keys(currWLData).filter(key => key !== '1.1.1');

        $('#WMEPH-WLInputBeta').val('');
        entries.forEach(venueKey => {
            const country = currWLData[venueKey].country || 'None';
            const state = currWLData[venueKey].state || 'None';
            countryWL[country] = countryWL[country] + 1 || 1;
            stateWL[state] = stateWL[state] + 1 || 1;
        });

        const getSectionDiv = (title, list) => $('<div>', { style: 'margin-bottom: 10px;' }).append(
            $('<div>', { style: 'font-weight: bold; text-decoration: underline' }).text(title),
            Object.keys(list).map(key => $('<div>').text(`${key}: ${list[key]}`))
        );

        $('#PlaceHarmonizerWLToolsMsg').empty().append(
            $('<div>', { style: 'margin-bottom: 10px;' }).text(`Number of WL places: ${entries.length}`),
            getSectionDiv('States', stateWL),
            getSectionDiv('Countries', countryWL)
        );
    }

    function onWLStateFilterClick() {
        const $wlInput = $('#WMEPH-WLInput');
        const stateToRemove = $wlInput.val().trim();
        let msgColor;
        let msgText;

        if (stateToRemove.length < 2) {
            msgColor = 'red';
            msgText = 'Invalid state. Enter the state name in the "Whitelist string" box above, '
                + 'exactly as it appears in the Stats output.';
        } else {
            const currWLData = JSON.parse(
                LZString.decompressFromUTF16(
                    localStorage.getItem(WL_LOCAL_STORE_NAME_COMPRESSED)
                )
            );
            const venuesToRemove = Object.keys(currWLData).filter(
                venueKey => venueKey !== '1.1.1' && (currWLData[venueKey].state === stateToRemove
                    || (!currWLData[venueKey].state && stateToRemove === 'None'))
            );
            if (venuesToRemove.length > 0) {
                if (localStorage.WMEPH_WLAddCount === '1') {
                    WazeWrap.Alerts.confirm(
                        SCRIPT_NAME,
                        `Are you sure you want to clear all whitelist data for ${stateToRemove}? This CANNOT be undone. `
                        + 'Press OK to delete, cancel to preserve the data.',
                        () => {
                            backupWhitelistToLS(true);
                            venuesToRemove.forEach(venueKey => {
                                delete _venueWhitelist[venueKey];
                            });
                            saveWhitelistToLS(true);
                            $wlInput.val('');
                            $('#PlaceHarmonizerWLToolsMsg').empty().append($('<p>').css({ color: 'green' }).text(`${venuesToRemove.length} venues removed from WL`));
                        },
                        () => { $('#PlaceHarmonizerWLToolsMsg').empty().append($('<p>').css({ color: 'blue' }).text('No changes made')); }
                    );
                    return;
                } // else {
                msgColor = 'red';
                msgText = 'Please backup your WL using the Pull button before removing state data';
                // }
            } else {
                msgColor = 'red';
                msgText = `No data for "${stateToRemove}". Use the state name exactly as listed in the Stats`;
            }
        }
        $('#PlaceHarmonizerWLToolsMsg').empty().append($('<p>').css({ color: msgColor }).text(msgText));
    }

    function onWLShareClick() {
        window.open(`https://docs.google.com/forms/d/1k_5RyOq81Fv4IRHzltC34kW3IUbXnQqDVMogwJKFNbE/viewform?entry.1173700072=${USER.name}`);
    }

    // settings tab
    function initWmephTab() {
        const multicall = (func, names) => names.forEach(name => func(name));

        // Enable certain settings by default if not set by the user:
        multicall(setCheckedByDefault, [
            'WMEPH-ColorHighlighting',
            'WMEPH-ExcludePLADupes',
            'WMEPH-DisablePLAExtProviderCheck'
        ]);

        // Initialize settings checkboxes
        multicall(initSettingsCheckbox, [
            'WMEPH-WebSearchNewTab',
            'WMEPH-DisableDFZoom',
            'WMEPH-EnableIAZoom',
            'WMEPH-HidePlacesWiki',
            'WMEPH-HideReportError',
            'WMEPH-HideServicesButtons',
            'WMEPH-HidePURWebSearch',
            'WMEPH-ExcludePLADupes',
            'WMEPH-ShowPLAExitWhileClosed'
        ]);
        if (USER.isDevUser || USER.isBetaUser || USER.rank >= 2) {
            multicall(initSettingsCheckbox, [
                'WMEPH-DisablePLAExtProviderCheck',
                'WMEPH-AddAddresses',
                'WMEPH-EnableCloneMode',
                'WMEPH-AutoLockRPPs'
            ]);
        }
        multicall(initSettingsCheckbox, ['WMEPH-ColorHighlighting',
            'WMEPH-DisableHoursHL',
            'WMEPH-DisableRankHL',
            'WMEPH-DisableWLHL',
            'WMEPH-PLATypeFill',
            'WMEPH-KBSModifierKey',
            'WMEPH-ShowFilterHighlight'
        ]);

        if (USER.isDevUser) {
            initSettingsCheckbox('WMEPH-RegionOverride');
        }

        // Turn this setting on one time.
        if (!_initAlreadyRun) {
            const runOnceDefaultIgnorePlaGoogleLinkChecks = localStorage.getItem('WMEPH-runOnce-defaultToOff-plaGoogleLinkChecks');
            if (!runOnceDefaultIgnorePlaGoogleLinkChecks) {
                const $chk = $('#WMEPH-DisablePLAExtProviderCheck');
                if (!$chk.prop('checked')) { $chk.trigger('click'); }
            }
            localStorage.setItem('WMEPH-runOnce-defaultToOff-plaGoogleLinkChecks', true);
        }

        initShortcutKey();

        if (localStorage.getItem('WMEPH_WLAddCount') === null) {
            localStorage.setItem('WMEPH_WLAddCount', 2); // Counter to remind of WL backups
        }

        // Reload Data button click event
        $('#WMEPH-ReloadDataBtn').click(async() => {
            $('#WMEPH-ReloadDataBtn').attr('disabled', true);
            await Pnh.downloadPnhData();
            $('#WMEPH-ReloadDataBtn').attr('disabled', false);
        });

        // WL button click events
        $('#WMEPH-WLMerge').click(onWLMergeClick);
        $('#WMEPH-WLPull').click(onWLPullClick);
        $('#WMEPH-WLStats').click(onWLStatsClick);
        $('#WMEPH-WLStateFilter').click(onWLStateFilterClick);
        $('#WMEPH-WLShare').click(onWLShareClick);

        // Color highlighting
        $('#WMEPH-ColorHighlighting').click(bootstrapWmephColorHighlights);
        $('#WMEPH-DisableHoursHL').click(bootstrapWmephColorHighlights);
        $('#WMEPH-DisableRankHL').click(bootstrapWmephColorHighlights);
        $('#WMEPH-DisableWLHL').click(bootstrapWmephColorHighlights);
        $('#WMEPH-PLATypeFill').click(() => applyHighlightsTest(W.model.venues.getObjectArray()));
        $('#WMEPH-ShowFilterHighlight').click(() => {
            if ($('#WMEPH-ShowFilterHighlight').prop('checked')) {
                processFilterHighlights();
            } else {
                clearFilterHighlights();
            }
        });

        _initAlreadyRun = true;
    }

    async function addWmephTab() {
        // Set up the CSS
        GM_addStyle(_CSS);

        const $container = $('<div>');
        const $reloadDataBtn = $('<div style="margin-bottom:6px; text-align:center;"><div style="position:relative; display:inline-block; width:75%"><input id="WMEPH-ReloadDataBtn" style="min-width:90px; width:50%" class="btn btn-success wmeph-fat-btn" type="button" title="Refresh Data" value="Refresh Data"/><div class="checkmark draw"></div></div></div>');
        const $navTabs = $(
            '<ul class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#sidepanel-harmonizer">Harmonize</a></li>'
            + '<li><a data-toggle="tab" href="#sidepanel-highlighter">HL / Scan</a></li>'
            + '<li><a data-toggle="tab" href="#sidepanel-wltools">WL Tools</a></li>'
            + '<li><a data-toggle="tab" href="#sidepanel-pnh-moderators">Moderators</a></li></ul>'
        );
        const $tabContent = $('<div class="tab-content">');
        const $versionDiv = $('<div>').text(`WMEPH ${BETA_VERSION_STR} v${SCRIPT_VERSION}`).css({ color: '#999', fontSize: '13px' });
        const $harmonizerTab = $('<div class="tab-pane wmeph-pane active" id="sidepanel-harmonizer"></div>');
        const $highlighterTab = $('<div class="tab-pane wmeph-pane" id="sidepanel-highlighter"></div>');
        const $wlToolsTab = $('<div class="tab-pane wmeph-pane" id="sidepanel-wltools"></div>');
        const $moderatorsTab = $('<div class="tab-pane wmeph-pane" id="sidepanel-pnh-moderators"></div>');
        $tabContent.append($harmonizerTab, $highlighterTab, $wlToolsTab, $moderatorsTab);
        $container.append($reloadDataBtn, $navTabs, $tabContent, $versionDiv);

        // Harmonizer settings
        createSettingsCheckbox($harmonizerTab, 'WMEPH-WebSearchNewTab', 'Open URL & Search Results in new tab instead of new window');
        createSettingsCheckbox($harmonizerTab, 'WMEPH-DisableDFZoom', 'Disable zoom & center for duplicates');
        createSettingsCheckbox($harmonizerTab, 'WMEPH-EnableIAZoom', 'Enable zoom & center for places with no address');
        createSettingsCheckbox($harmonizerTab, 'WMEPH-HidePlacesWiki', 'Hide "Places Wiki" button in results banner');
        createSettingsCheckbox($harmonizerTab, 'WMEPH-HideReportError', 'Hide "Report script error" button in results banner');
        createSettingsCheckbox($harmonizerTab, 'WMEPH-HideServicesButtons', 'Hide services buttons in results banner');
        createSettingsCheckbox($harmonizerTab, 'WMEPH-HidePURWebSearch', 'Hide "Web Search" button on PUR popups');
        createSettingsCheckbox($harmonizerTab, 'WMEPH-ExcludePLADupes', 'Exclude parking lots when searching for duplicate places');
        createSettingsCheckbox($harmonizerTab, 'WMEPH-ShowPLAExitWhileClosed', 'Always ask if cars can exit parking lots');
        if (USER.isDevUser || USER.isBetaUser || USER.rank >= 2) {
            createSettingsCheckbox($harmonizerTab, 'WMEPH-DisablePLAExtProviderCheck', 'Disable check for "Google place link" on Parking Lot Areas');
            createSettingsCheckbox($harmonizerTab, 'WMEPH-AddAddresses', 'Add detected address fields to places with no address');
            createSettingsCheckbox($harmonizerTab, 'WMEPH-EnableCloneMode', 'Enable place cloning tools');
            createSettingsCheckbox($harmonizerTab, 'WMEPH-AutoLockRPPs', 'Lock residential place points to region default');
        }

        $harmonizerTab.append('<hr class="wmeph-hr" align="center" width="100%">');

        // Add Letter input box
        const $phShortcutDiv = $('<div id="PlaceHarmonizerKB">');
        // eslint-disable-next-line max-len
        $phShortcutDiv.append('<div id="PlaceHarmonizerKBWarn"></div>Shortcut Letter (a-Z): <input type="text" maxlength="1" id="WMEPH-KeyboardShortcut" style="width: 30px;padding-left:8px"><div id="PlaceHarmonizerKBCurrent"></div>');
        createSettingsCheckbox($phShortcutDiv, 'WMEPH-KBSModifierKey', 'Use Ctrl instead of Alt'); // Add Alt-->Ctrl checkbox

        if (USER.isDevUser) { // Override script regionality (devs only)
            $phShortcutDiv.append('<hr class="wmeph-hr" align="center" width="100%"><p>Dev Only Settings:</p>');
            createSettingsCheckbox($phShortcutDiv, 'WMEPH-RegionOverride', 'Disable Region Specificity');
        }

        $harmonizerTab.append(
            $phShortcutDiv,
            '<hr class="wmeph-hr" align="center" width="100%">',
            `<div><a href="${URLS.placesWiki}" target="_blank">Open the WME Places Wiki page</a></div>`,
            `<div><a href="${URLS.forum}" target="_blank">Submit script feedback & suggestions</a></div>`,
            '<hr class="wmeph-hr" align="center" width="95%">'
        );

        // Highlighter settings
        $highlighterTab.append('<p>Highlighter Settings:</p>');
        createSettingsCheckbox($highlighterTab, 'WMEPH-ColorHighlighting', 'Enable color highlighting of map to indicate places needing work');
        createSettingsCheckbox($highlighterTab, 'WMEPH-DisableHoursHL', 'Disable highlighting for missing hours');
        createSettingsCheckbox($highlighterTab, 'WMEPH-DisableRankHL', 'Disable highlighting for places locked above your rank');
        createSettingsCheckbox($highlighterTab, 'WMEPH-DisableWLHL', 'Disable Whitelist highlighting (shows all missing info regardless of WL)');
        createSettingsCheckbox($highlighterTab, 'WMEPH-PLATypeFill', 'Fill parking lots based on type (public=blue, restricted=yellow, private=red)');
        createSettingsCheckbox($highlighterTab, 'WMEPH-ShowFilterHighlight', 'Highlight places without Customer Parking service');
        if (USER.isDevUser || USER.isBetaUser || USER.rank >= 3) {
            // createSettingsCheckbox($highlighterTab 'WMEPH-UnlockedRPPs','Highlight unlocked residential place points');
        }

        // Scanner settings
        // $highlighterTab.append('<hr align="center" width="90%">');
        // $highlighterTab.append('<p>Scanner Settings (coming !soon)</p>');
        // createSettingsCheckbox($highlighterTab, 'WMEPH-PlaceScanner','Placeholder, under development!');

        // Whitelisting settings
        const phWLContentHtml = $(
            '<div id="PlaceHarmonizerWLTools">Whitelist string: <input onClick="this.select();" type="text" id="WMEPH-WLInput" style="width:100%;padding-left:1px;display:block">'
            + '<div style="margin-top:3px;">'
            + '<input class="btn btn-success btn-xs wmeph-fat-btn" id="WMEPH-WLMerge" title="Merge the string into your existing Whitelist" type="button" value="Merge">'
            + '<input class="btn btn-success btn-xs wmeph-fat-btn" id="WMEPH-WLPull" title="Pull your existing Whitelist for backup or sharing" type="button" value="Pull">'
            + '<input class="btn btn-success btn-xs wmeph-fat-btn" id="WMEPH-WLShare" title="Share your Whitelist to a public Google sheet" type="button" value="Share your WL">'
            + '</div>'
            + '<div style="margin-top:12px;">'
            + '<input class="btn btn-info btn-xs wmeph-fat-btn" id="WMEPH-WLStats" title="Display WL stats" type="button" value="Stats">'
            + '<input class="btn btn-danger btn-xs wmeph-fat-btn" id="WMEPH-WLStateFilter" title="Remove all WL items for a state.  Enter the state in the \'Whitelist string\' box." '
            + '     type="button" value="Remove data for 1 State">'
            + '</div>'
            + '</div>'
            + '<div id="PlaceHarmonizerWLToolsMsg" style="margin-top:10px;"></div>'
        );
        $wlToolsTab.append(phWLContentHtml);

        $moderatorsTab.append(
            $('<div>', { style: 'margin-bottom: 10px;' }).text('Moderators are responsible for reviewing chain submissions for their region.'
                + ' If you have questions or suggestions regarding a chain, please contact any of your regional moderators.'),
            $('<table>').append(
                Object.keys(Pnh.MODERATORS).sort().map(region => $('<tr>').append(
                    $('<td>', { class: 'wmeph-mods-table-cell title' }).append(
                        $('<div>').text(region)
                    ),
                    $('<td>', { class: 'wmeph-mods-table-cell' }).append(
                        $('<div>').text(Pnh.MODERATORS[region].join(', '))
                    )
                ))
            )
        );

        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab('WMEPH');
        tabLabel.innerHTML = `<span title="WME Place Harmonizer">WMEPH${IS_BETA_VERSION ? '-β' : ''}</span>`;
        tabPane.innerHTML = $container.html();
        await W.userscripts.waitForElementConnected(tabPane);
        // Fix tab content div spacing.
        $(tabPane).parent().css({ width: 'auto', padding: '8px !important' });
        $('.wmeph-pane').css({ width: 'auto', padding: '8px !important' });
        initWmephTab();
    }

    function createCloneCheckbox(divID, settingID, textDescription) {
        const $checkbox = $('<input>', {
            type: 'checkbox',
            id: settingID
        }).click(() => saveSettingToLocalStorage(settingID))
            .prop('checked', localStorage.getItem(settingID) === '1');

        const $label = $('<label>', { for: settingID, style: 'margin-left: 2px; font-weight: normal' }).text(textDescription);

        return $('<span>', { style: 'margin-right: 6px;' }).append($checkbox, $label);
    }

    // Function to add Shift+ to upper case KBS
    function parseKBSShift(kbs) {
        return (/^[A-Z]{1}$/g.test(kbs) ? 'Shift+' : '') + kbs;
    }

    // Save settings prefs
    function saveSettingToLocalStorage(settingID) {
        localStorage.setItem(settingID, $(`#${settingID}`).prop('checked') ? '1' : '0');
    }

    // This function validates that the inputted text is a JSON
    function validateWLS(jsonString) {
        try {
            const objTry = JSON.parse(jsonString);
            if (objTry && typeof objTry === 'object' && objTry !== null) {
                return objTry;
            }
        } catch (e) {
            // do nothing
        }
        return false;
    }

    // This function merges and updates venues from object wl2 into wl1
    function mergeWL(wl1, wl2) {
        let wlVenue1;
        let wlVenue2;
        Object.keys(wl2).forEach(venueKey => {
            if (wl1.hasOwnProperty(venueKey)) { // if the wl2 venue is in wl1, then update any keys
                wlVenue1 = wl1[venueKey];
                wlVenue2 = wl2[venueKey];
                // loop thru the venue WL keys
                Object.keys(wlVenue2).forEach(wlKey => {
                    // Only update if the wl2 key is active
                    if (wlVenue2.hasOwnProperty(wlKey) && wlVenue2[wlKey].active) {
                        // if the key is in the wl1 venue and it is active, then push any array data onto the key
                        if (wlVenue1.hasOwnProperty(wlKey) && wlVenue1[wlKey].active) {
                            if (wlVenue1[wlKey].hasOwnProperty('WLKeyArray')) {
                                wl1[venueKey][wlKey].WLKeyArray = insertAtIndex(wl1[venueKey][wlKey].WLKeyArray, wl2[venueKey][wlKey].WLKeyArray, 100);
                            }
                        } else {
                            // if the key isn't in the wl1 venue, or if it's inactive, then copy the wl2 key across
                            wl1[venueKey][wlKey] = wl2[venueKey][wlKey];
                        }
                    }
                }); // END subLoop for venue keys
            } else { // if the venue doesn't exist in wl1, then add it
                wl1[venueKey] = wl2[venueKey];
            }
        });
        return wl1;
    }

    // Get services checkbox status
    function getServicesChecks(venue) {
        const servArrayCheck = [];
        for (let wsix = 0; wsix < WME_SERVICES_ARRAY.length; wsix++) {
            if (venue.attributes.services.includes(WME_SERVICES_ARRAY[wsix])) {
                servArrayCheck[wsix] = true;
            } else {
                servArrayCheck[wsix] = false;
            }
        }
        return servArrayCheck;
    }

    function updateServicesChecks() {
        const venue = getSelectedVenue();
        if (venue) {
            if (!_servicesBanner) return;
            const servArrayCheck = getServicesChecks(venue);
            let wsix = 0;
            Object.keys(_servicesBanner).forEach(keys => {
                if (_servicesBanner.hasOwnProperty(keys)) {
                    _servicesBanner[keys].checked = servArrayCheck[wsix]; // reset all icons to match any checked changes
                    _servicesBanner[keys].active = _servicesBanner[keys].active || servArrayCheck[wsix]; // display any manually checked non-active icons
                    wsix++;
                }
            });
            // Highlight 24/7 button if hours are set that way, and add button for all places
            if (isAlwaysOpen(venue)) {
                _servicesBanner.add247.checked = true;
            }
            _servicesBanner.add247.active = true;
        }
    }

    // Focus away from the current cursor focus, to set text box changes
    function blurAll() {
        const tmp = document.createElement('input');
        document.body.appendChild(tmp);
        tmp.focus();
        document.body.removeChild(tmp);
    }

    // Pulls the venue PL
    function getCurrentPL() {
        // Return the current PL

        // 5/22/2019 (mapomatic)
        // I'm not sure what this was supposed to do.  Maybe an attempt to wait until the PL
        // was available when loading WME from PL with a place pre-selected and auto-run WMEPH
        // is turned on?  Whatever the purpose was, it won't work properly because it'll return
        // undefined, and the calling code is expecting a value.

        // if ($('.WazeControlPermalink').length === 0) {
        //     log('Waiting for PL div');
        //     setTimeout(getCurrentPL, 500);
        //     return;
        // }

        let pl = '';
        let elem = $('.WazeControlPermalink .permalink');
        if (elem.length && elem.attr('href').length) {
            pl = $('.WazeControlPermalink .permalink').attr('href');
        } else {
            elem = $('.WazeControlPermalink');
            if (elem.length && elem.children('.fa-link').length) {
                pl = elem.children('.fa-link')[0].href;
            }
        }
        return pl;
    }

    // Sets up error reporting
    function reportError() {
        window.open(URLS.forum, '_blank');
    }

    function updateUserInfo() {
        USER.ref = W.loginManager.user;
        USER.name = USER.ref.getUsername();
        USER.rank = USER.ref.getRank() + 1; // get editor's level (actual level)
        if (!_wmephBetaList || _wmephBetaList.length === 0) {
            if (IS_BETA_VERSION) {
                WazeWrap.Alerts.warning(SCRIPT_NAME, 'Beta user list access issue.  Please post in the GHO or PM/DM MapOMatic about this message.  Script should still work.');
            }
            USER.isBetaUser = false;
            USER.isDevUser = false;
        } else {
            const lcName = USER.name.toLowerCase();
            USER.isDevUser = _wmephDevList.includes(lcName);
            USER.isBetaUser = _wmephBetaList.includes(lcName);
        }
        if (USER.isDevUser) {
            USER.isBetaUser = true; // dev users are beta users
        }
    }

    function onFilterHighlightToggleShortcutKey() {
        $('#WMEPH-ShowFilterHighlight').click();
    }

    function onShowHighlightColorsToggleShortcutKey() {
        $('#WMEPH-ColorHighlighting').click();
    }

    function onWindowBeforeUnload() {
        localStorage.setItem('WMEPH_FilterHighlightShortcut', getShortcutKeys(W.accelerators.Actions.wmephFilterHighlightToggle));
        localStorage.setItem('WMEPH_ColorHighlighting', getShortcutKeys(W.accelerators.Actions.wmephColorHighlightingToggle));
    }

    function getShortcutKeys(shortcutAction) {
        let keys = '';
        const { shortcut } = shortcutAction;
        if (shortcut) {
            if (shortcut.altKey) keys += 'A';
            if (shortcut.shiftKey) keys += 'S';
            if (shortcut.ctrlKey) keys += 'C';
            if (keys.length) keys += '+';
            if (shortcut.keyCode) keys += shortcut.keyCode;
        }
        return keys;
    }

    async function placeHarmonizerInit() {
        interceptGoogleGetDetails();
        updateUserInfo();
        logDev('placeHarmonizerInit'); // Be sure to update User info before calling logDev()

        // Check for script updates.
        const downloadUrl = IS_BETA_VERSION ? dec(BETA_DOWNLOAD_URL) : PROD_DOWNLOAD_URL;
        let updateMonitor;
        try {
            updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, downloadUrl, GM_xmlhttpRequest);
            updateMonitor.start();
        } catch (ex) {
            // Report, but don't stop if ScriptUpdateMonitor fails.
            console.error('WMEPH:', ex);
        }

        _layer = W.map.venueLayer;

        // Add CSS stuff here
        const css = [
            '.wmeph-mods-table-cell { border: solid 1px #bdbdbd; padding-left: 3px; padding-right: 3px; }',
            '.wmeph-mods-table-cell.title { font-weight: bold; }'
        ].join('\n');
        $('head').append(`<style type="text/css">${css}</style>`);

        MultiAction = require('Waze/Action/MultiAction');
        UpdateObject = require('Waze/Action/UpdateObject');
        UpdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry');
        UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
        OpeningHour = require('Waze/Model/Objects/OpeningHour');

        // Append a form div for submitting to the forum, if it doesn't exist yet:
        const tempDiv = document.createElement('div');
        tempDiv.id = 'WMEPH_formDiv';
        tempDiv.style.display = 'none';
        $('body').append(tempDiv);

        _userLanguage = I18n.locale;

        // Array prototype extensions (for Firefox fix)
        // 5/22/2019 (mapomatic) I'm guessing these aren't necessary anymore.  If no one reports any errors after a while, these lines may be deleted.
        // Array.prototype.toSet = function () { return this.reduce(function (e, t) { return e[t] = !0, e; }, {}); };
        // Array.prototype.first = function () { return this[0]; };
        // Array.prototype.isEmpty = function () { return 0 === this.length; };

        appendServiceButtonIconCss();
        UPDATED_FIELDS.init();
        addPURWebSearchButton();

        // Create duplicatePlaceName layer
        _dupeLayer = W.map.getLayerByUniqueName('__DuplicatePlaceNames');
        if (!_dupeLayer) {
            const lname = 'WMEPH Duplicate Names';
            const style = new OpenLayers.Style({
                label: '${labelText}',
                labelOutlineColor: '#333',
                labelOutlineWidth: 3,
                labelAlign: '${labelAlign}',
                fontColor: '${fontColor}',
                fontOpacity: 1.0,
                fontSize: '20px',
                fontWeight: 'bold',
                labelYOffset: -30,
                labelXOffset: 0,
                fill: false,
                strokeColor: '${strokeColor}',
                strokeWidth: 10,
                pointRadius: '${pointRadius}'
            });
            _dupeLayer = new OpenLayers.Layer.Vector(lname, { displayInLayerSwitcher: false, uniqueName: '__DuplicatePlaceNames', styleMap: new OpenLayers.StyleMap(style) });
            _dupeLayer.setVisibility(false);
            W.map.addLayer(_dupeLayer);
        }

        if (localStorage.getItem('WMEPH-featuresExamined') === null) {
            localStorage.setItem('WMEPH-featuresExamined', '0'); // Storage for whether the User has pressed the button to look at updates
        }

        createObserver();

        const xrayMode = localStorage.getItem('WMEPH_xrayMode_enabled') === 'true';
        WazeWrap.Interface.AddLayerCheckbox('Display', 'WMEPH x-ray mode', xrayMode, toggleXrayMode);
        if (xrayMode) setTimeout(() => toggleXrayMode(true), 2000); // Give other layers time to load before enabling.

        // Whitelist initialization
        if (validateWLS(LZString.decompressFromUTF16(localStorage.getItem(WL_LOCAL_STORE_NAME_COMPRESSED))) === false) { // If no compressed WL string exists
            if (validateWLS(localStorage.getItem(WL_LOCAL_STORE_NAME)) === false) { // If no regular WL exists
                _venueWhitelist = { '1.1.1': { Placeholder: {} } }; // Populate with a dummy place
                saveWhitelistToLS(false);
                saveWhitelistToLS(true);
            } else { // if regular WL string exists, then transfer to compressed version
                localStorage.setItem('WMEPH-OneTimeWLBU', localStorage.getItem(WL_LOCAL_STORE_NAME));
                loadWhitelistFromLS(false);
                saveWhitelistToLS(true);
                WazeWrap.Alerts.info(SCRIPT_NAME, 'Whitelists are being converted to a compressed format.  If you have trouble with your WL, please submit an error report.');
            }
        } else {
            loadWhitelistFromLS(true);
        }

        if (USER.name === 'ggrane') {
            _searchResultsWindowSpecs = `"resizable=yes, top=${
                Math.round(window.screen.height * 0.1)}, left=${
                Math.round(window.screen.width * 0.3)}, width=${
                Math.round(window.screen.width * 0.86)}, height=${
                Math.round(window.screen.height * 0.8)}"`;
        }

        // Settings setup
        if (!localStorage.getItem(SETTING_IDS.gLinkWarning)) { // store settings so the warning is only given once
            localStorage.setItem(SETTING_IDS.gLinkWarning, '0');
        }
        if (!localStorage.getItem(SETTING_IDS.sfUrlWarning)) { // store settings so the warning is only given once
            localStorage.setItem(SETTING_IDS.sfUrlWarning, '0');
        }

        WazeWrap.Events.register('mousemove', W.map, e => errorHandler(() => {
            const wmEvts = (W.map.events) ? W.map.events : W.map.getMapEventsListener();
            _wmephMousePosition = W.map.getLonLatFromPixel(wmEvts.getMousePosition(e));
        }));

        // Add zoom shortcut
        SHORTCUT.add('Control+Alt+Z', zoomPlace);

        // Add Color Highlighting shortcut
        SHORTCUT.add('Control+Alt+h', () => {
            $('#WMEPH-ColorHighlighting').trigger('click');
        });

        // Add filter highlight shortcut
        new WazeWrap.Interface.Shortcut(
            'wmephFilterHighlightToggle',
            'Toggle "missing Customer Parking service" highlight',
            'WMEPH',
            'WMEPH',
            localStorage.getItem('WMEPH_FilterHighlightShortcut') ?? '',
            onFilterHighlightToggleShortcutKey,
            null
        ).add();

        // Add color highlighting shortcut
        new WazeWrap.Interface.Shortcut(
            'wmephColorHighlightingToggle',
            'Toggle place color highlighting',
            'WMEPH',
            'WMEPH',
            localStorage.getItem('WMEPH_ColorHighlighting') ?? '',
            onShowHighlightColorsToggleShortcutKey,
            null
        ).add();

        await addWmephTab(); // initialize the settings tab

        // Event listeners
        W.selectionManager.events.register('selectionchanged', null, () => {
            logDev('selectionchanged');
            errorHandler(updateWmephPanel, true);
        });
        W.model.venues.on('objectssynced', () => errorHandler(destroyDupeLabels));
        W.model.venues.on('objectssynced', e => errorHandler(() => syncWL(e)));
        W.model.venues.on('objectschanged', venues => errorHandler(onVenuesChanged, venues));
        window.addEventListener('beforeunload', onWindowBeforeUnload, false);

        // Remove any temporary ID values (ID < 0) from the WL store at startup.
        let removedWLCount = 0;
        Object.keys(_venueWhitelist).forEach(venueID => {
            if (venueID < 0) {
                delete _venueWhitelist[venueID];
                removedWLCount += 1;
            }
        });
        if (removedWLCount > 0) {
            saveWhitelistToLS(true);
            logDev(`Removed ${removedWLCount} venues with temporary ID's from WL store`);
        }

        _catTransWaze2Lang = I18n.translations[_userLanguage].venues.categories; // pulls the category translations

        // Split out state-based data
        const _stateHeaders = PNH_DATA.states[0].split('|');
        _psStateIx = _stateHeaders.indexOf('ps_state');
        _psState2LetterIx = _stateHeaders.indexOf('ps_state2L');
        _psRegionIx = _stateHeaders.indexOf('ps_region');
        _psGoogleFormStateIx = _stateHeaders.indexOf('ps_gFormState');
        _psDefaultLockLevelIx = _stateHeaders.indexOf('ps_defaultLockLevel');
        // ps_requirePhone_ix = _stateHeaders.indexOf('ps_requirePhone');
        // ps_requireURL_ix = _stateHeaders.indexOf('ps_requireURL');
        _psAreaCodeIx = _stateHeaders.indexOf('ps_areacode');

        // Set up Run WMEPH button once place is selected
        updateWmephPanel();

        // Setup highlight colors
        initializeHighlights();

        W.model.venues.on('objectschanged', () => errorHandler(() => {
            if ($('#WMEPH_banner').length > 0) {
                updateServicesChecks();
                assembleServicesBanner();
            }
        }));

        log('Starting Highlighter');
        bootstrapWmephColorHighlights();

        // Set up filter highlights
        if ($('#WMEPH-ShowFilterHighlight').prop('checked')) {
            processFilterHighlights();
        }
        W.model.venues.on('objectschanged', () => errorHandler(processFilterHighlights));
        W.model.venues.on('objectsremoved', () => errorHandler(clearFilterHighlights));
        W.model.venues.on('objectsadded', () => errorHandler(processFilterHighlights));
    } // END placeHarmonizer_init function

    function waitForReady() {
        return new Promise(resolve => {
            function loop() {
                if (typeof W === 'object' && W.userscripts?.state.isReady && WazeWrap?.Ready) {
                    resolve();
                } else {
                    setTimeout(loop, 100);
                }
            }
            loop();
        });
    }

    async function placeHarmonizerBootstrap() {
        log('Waiting for WME and WazeWrap...');
        await waitForReady();
        WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, SCRIPT_VERSION, _SCRIPT_UPDATE_MESSAGE);
        await placeHarmonizerInit();
    }

    function clearFilterHighlights() {
        const layer = W.map.venueLayer;
        layer.removeFeatures(layer.getFeaturesByAttribute('wmephHighlight', '1'));
    }
    function processFilterHighlights() {
        if (!$('#WMEPH-ShowFilterHighlight').prop('checked')) {
            return;
        }
        // clear existing highlights
        clearFilterHighlights();
        const featuresToAdd = [];
        W.model.venues.getObjectArray(v => !v.attributes.services.includes('PARKING_FOR_CUSTOMERS')
            && !CATS_TO_IGNORE_CUSTOMER_PARKING_HIGHLIGHT.includes(v.attributes.categories[0]))
            .forEach(v => {
                let style;
                if (v.isPoint()) {
                    style = {
                        pointRadius: 10,
                        strokeWidth: 10,
                        strokeColor: '#F0F',
                        strokeOpacity: 0.7,
                        fillOpacity: 0,
                        graphicZIndex: -9999,
                        strokeDashstyle: 'solid' // '3 6'
                    };
                } else {
                    style = {
                        strokeWidth: 12,
                        strokeColor: '#F0F',
                        strokeOpacity: 0.7,
                        fillOpacity: 0,
                        graphicZIndex: -9999999999,
                        strokeDashstyle: 'solid' // '3 6'
                    };
                }
                const geometry = v.getOLGeometry().clone();
                const f = new OpenLayers.Feature.Vector(geometry, { wmephHighlight: '1' }, style);
                featuresToAdd.push(f);
            });
        W.map.venueLayer.addFeatures(featuresToAdd);
    }

    function devTestCode() {
        if (W.loginManager.user.getUsername() === 'MapOMatic') {
            // For debugging purposes.  May be removed when no longer needed.
            unsafeWindow.PNH_DATA = PNH_DATA;
            unsafeWindow.WMEPH_FLAG = Flag;
        }
    }

    async function bootstrap() {
        // Quit if another version of WMEPH is already running.
        if (unsafeWindow.wmephRunning) {
            // Don't use WazeWrap alerts here. It isn't loaded yet.
            alert('Multiple versions of WME Place Harmonizer are turned on. Only one will be enabled.');
            return;
        }
        unsafeWindow.wmephRunning = 1;
        // Start downloading the PNH spreadsheet data in the background.  Starts the script once data is ready.
        await Pnh.downloadAllData();
        await placeHarmonizerBootstrap();
        devTestCode();
    }

    bootstrap();
})();
