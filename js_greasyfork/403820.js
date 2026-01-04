/* eslint-disable nonblock-statement-body-position, brace-style, curly, radix, no-template-curly-in-string */
// ==UserScript==
// @name        WME Place Harmonizer - localizer BB tweak
// @namespace   WazeUSA
// @version     2020.05.20.001.tm
// @description Harmonizes, formats, and locks a selected place
// @author      WMEPH Development Group
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require     https://greasyfork.org/scripts/37486-wme-utils-hoursparser/code/WME%20Utils%20-%20HoursParser.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @license     GNU GPL v3
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403820/WME%20Place%20Harmonizer%20-%20localizer%20BB%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/403820/WME%20Place%20Harmonizer%20-%20localizer%20BB%20tweak.meta.js
// ==/UserScript==

/* global $ */
/* global W */
/* global GM_info */
/* global OL */
/* global _ */
/* global WazeWrap */
/* global LZString */
/* global HoursParser */
/* global GM_addStyle */
/* global unsafeWindow */
/* global I18n */
/* global window */
/* global document */
/* global localStorage */
/* global MutationObserver */
/* global performance */
/* global atob */

// Script update info
const _WHATS_NEW_LIST = { // New in this version
    '2020.05.20.001.tm' : [
        'Tweak bounding box values for better implementation of some localized searches.'
     ],
    '2020.03.31.001': [
        'FIXED: WME removed normalized user rank property.'
    ],
    '2020.03.18.001': [
        'Bug fix for X-Ray Mode, caused by WME changes.'
    ],
    '2020.03.15.001': [
        'FIXED: When clicking the "Use PNH URL" button, a window would open to report an error.'
    ],
    '2020.03.14.001': [
        'Minor bug fix for missing street when using localized store locator.'
    ],
    '2020.01.07.001': [
        'Bug fix due to latest WME release.'
    ],
    '2019.10.30.001': [
        'Switch to WazeWrap alerts and event registrations.'
    ],
    '2019.07.25.001': [
        'More bug fixes for latest WME release.'
    ],
    '2019.07.23.001': [
        'Bug fix for latest WME release.'
    ],
    '2019.05.31.001': [
        'Fixed an issue that was preventing WMEPH from running on some places.'
    ],
    '2019.05.28.001': [
        'Some code optimizations.'
    ],
    '2019.05.24.001': [
        'Fix green highlighting of WMEPH-modified fields in the edit panel.',
        'Remove "auto-run on select" option.',
        'Loosen requirements for Scenic Overlook category.'
    ],
    '2019.05.23.001': [
        'Don\'t display WMEPH buttons when multiple places are selected.',
        'A lot of code maintenance/cleanup',
        'New version # format :)'
    ],
    '1.3.146': [
        'FIXED: Moderator table mistakes, and updated its layout to be more compact.'],
    '1.3.145': [
        'NEW: Added a Moderators tab so people can bug moderators more, and me less :D'],
    '1.3.143': [
        'FIXED: HN entry field in WMEPH banner was not working. Replaced with "Edit Address" button.',
        'FIXED: Adding external provider from WMEPH banner would sometimes go to the Category box.'
    ],
    '1.3.142': [
        'FIXED: The "Nudge" buttons do not work in some cases.  After saving, the place is not nudged.'
    ],
    '1.3.141': [
        'FIXED: WMEPH will not run on places where it finds potential duplicate places.'
    ]
};

const _CSS_ARRAY = [
    '#WMEPH_banner .wmeph-btn { background-color: #fbfbfb; box-shadow: 0 2px 0 #aaa; border: solid 1px #bbb; font-weight:normal; margin-bottom: 2px; margin-right:4px}',
    '.wmeph-btn, .wmephwl-btn { height:19px; }',
    '.btn.wmeph-btn { padding: 0px 3px }',
    '.btn.wmephwl-btn { padding: 0px 1px 0px 2px; height: 18px; box-shadow: 0 2px 0 #b3b3b3;}',
    '#WMEPH_banner .banner-row { padding:2px 4px; }',
    '#WMEPH_banner .banner-row.red { color:#b51212; background-color:#f0dcdc; }',
    '#WMEPH_banner .banner-row.blue { color:#3232e6; background-color:#dcdcf0; }',
    '#WMEPH_banner .banner-row.yellow { color:#584a04; background-color:#f0f0c2; }',
    '#WMEPH_banner .banner-row.gray { color:#3a3a3a; background-color:#eeeeee; }',
    '#WMEPH_banner .banner-row .dupe { padding-left:8px; }',
    '#WMEPH_banner { background-color:#fff; color:black; font-size:14px; padding-top:8px; padding-bottom:8px; margin-left:4px; margin-right:4px; line-height:18px; '
    + 'margin-top:2px; border: solid 1px #8d8c8c; border-radius: 6px; margin-bottom: 4px;}',
    '#WMEPH_banner input[type=text] { font-size: 13px !important; height:22px !important; font-family: "Open Sans", Alef, helvetica, sans-serif !important; }',
    '#WMEPH_banner div:last-child { padding-bottom: 3px !important; }',
    '#WMEPH_runButton { padding-bottom: 6px; padding-top: 3px; width: 290; color: black; font-size: 15px; margin-right: auto; margin-left: 4px; }',
    '#WMEPH_tools div { padding-bottom: 2px !important; }',
    '.wmeph-fat-btn { padding-left:8px; padding-right:8px; padding-top:4px; margin-right:3px; display:inline-block; font-weight:normal; height:24px; }',
    '.ui-autocomplete { max-height: 300px;overflow-y: auto;overflow-x: hidden;} ',
    '.wmeph-hr { border-color: #ccc; }'
];

let MultiAction;
let UpdateObject;
let UpdateFeatureGeometry;
let UpdateFeatureAddress;
let OpeningHour;

const _SCRIPT_VERSION = GM_info.script.version.toString(); // pull version from header
const _SCRIPT_NAME = GM_info.script.name;
const _IS_DEV_VERSION = /Beta/i.test(_SCRIPT_NAME); //  enables dev messages and unique DOM options if the script is called "... Beta"
const _DEV_VERSION_STR = _IS_DEV_VERSION ? 'Beta' : ''; // strings to differentiate DOM elements between regular and beta script
const _PNH_DATA = { USA: {}, CAN: {} };
const _CATEGORY_LOOKUP = {};
const _DEFAULT_HOURS_TEXT = 'Paste Hours Here';
const _MAX_CACHE_SIZE = 25000;
let _wordVariations;
let _resultsCache = {};
let _initAlreadyRun = false; // This is used to skip a couple things if already run once.  This could probably be handled better...
let _countryCode;
let _textEntryValues = null; // Store the values entered in text boxes so they can be re-added when the banner is reassembled.

// vars for cat-name checking
let _hospitalPartMatch;
let _hospitalFullMatch;
let _animalPartMatch;
let _animalFullMatch;
let _schoolPartMatch;
let _schoolFullMatch;

// Userlists
let _wmephDevList;
let _wmephBetaList;

let _shortcutParse;
let _modifKey = 'Alt+';

// Whitelisting vars
let _venueWhitelist;
let _venueWhitelistStr;
let _WLSToMerge;
let _wlKeyName;
const _WL_BUTTON_TEXT = 'WL';
const _WL_LOCAL_STORE_NAME = 'WMEPH-venueWhitelistNew';
const _WL_LOCAL_STORE_NAME_COMPRESSED = 'WMEPH-venueWhitelistCompressed';

// Dupe check vars
let _dupeLayer;
let _dupeIDList = [];
let _dupeHNRangeList;
let _dupeHNRangeDistList;

// Web search Window forming:
let _searchResultsWindowSpecs = `"resizable=yes, top=${Math.round(window.screen.height * 0.1)}, left=${
    Math.round(window.screen.width * 0.3)}, width=${Math.round(window.screen.width * 0.7)}, height=${Math.round(window.screen.height * 0.8)}"`;
const _SEARCH_RESULTS_WINDOW_NAME = '"WMEPH Search Results"';
let _wmephMousePosition;
let _cloneMaster = null;

// Banner Buttons objects
let _buttonBanner;
let _buttonBanner2;
let _servicesBanner;
let _dupeBanner;

let _rppLockString = 'Lock?';
const _PANEL_FIELDS = {}; // the fields for the sidebar
let _disableHighlightTest = false; // Set to true to temporarily disable highlight checks immediately when venues change.
let _wl = {};
const _USER = {
    ref: null,
    rank: null,
    name: null,
    isBetaUser: false,
    isDevUser: false
};
const _SETTING_IDS = {
    sfUrlWarning: 'SFURLWarning', // Warning message for first time using localized storefinder URL.
    gLinkWarning: 'GLinkWarning' // Warning message for first time using Google search to not to use the Google info itself.
};
const _URLS = {
    forum: 'https://www.waze.com/forum/posting.php?mode=reply&f=819&t=215657',
    usaPnh: 'https://docs.google.com/spreadsheets/d/1-f-JTWY5UnBx-rFTa4qhyGMYdHBZWNirUTOgn222zMY/edit#gid=0',
    placesWiki: 'https://wazeopedia.waze.com/wiki/USA/Places',
    restAreaWiki: 'https://wazeopedia.waze.com/wiki/USA/Rest_areas#Adding_a_Place'
};
let _userLanguage;
// lock levels are offset by one
const _LOCK_LEVEL_2 = 1;
const _LOCK_LEVEL_4 = 3;
let _defaultLockLevel = _LOCK_LEVEL_2;
let _pnhLockLevel;
const _PM_USER_LIST = { // user names and IDs for PM functions

    SER: {
        approvalActive: true,
        mods: [
            { id: '16888799', name: 'willdanneriv' },
            // { id: '17083181', name: 'itzwolf' },
            { id: '17077334', name: 'ardan74' }
        ]
    },
    WMEPH: {
        approvalActive: true,
        mods: [
            { id: '2647925', name: 'MapOMatic' }
        ]
    }
};
let _severityButt = 0; // error tracking to determine banner color (action buttons)
let _duplicateName = '';
let _catTransWaze2Lang; // pulls the category translations
let _newName;
let _newURL;
let _tempPNHURL = '';
let _newPhone;
let _newAliases = [];
let _newAliasesTemp = [];
let _newCategories = [];
const _WME_SERVICES_ARRAY = ['VALLET_SERVICE', 'DRIVETHROUGH', 'WI_FI', 'RESTROOMS', 'CREDIT_CARDS', 'RESERVATIONS', 'OUTSIDE_SEATING',
    'AIR_CONDITIONING', 'PARKING_FOR_CUSTOMERS', 'DELIVERIES', 'TAKE_AWAY', 'WHEELCHAIR_ACCESSIBLE', 'DISABILITY_PARKING'];
const _COLLEGE_ABBREVIATIONS = 'USF|USFSP|UF|UCF|UA|UGA|FSU|UM|SCP|FAU|FIU';
// Change place.name to title case
const _TITLECASE_SETTINGS = {
    ignoreWords: 'an|and|as|at|by|for|from|hhgregg|in|into|of|on|or|the|to|with'.split('|'),
    // eslint-disable-next-line max-len
    capWords: '3M|AAA|AMC|AOL|AT&T|ATM|BBC|BLT|BMV|BMW|BP|CBS|CCS|CGI|CISCO|CJ|CNG|CNN|CVS|DHL|DKNY|DMV|DSW|EMS|ER|ESPN|FCU|FCUK|FDNY|GNC|H&M|HP|HSBC|IBM|IHOP|IKEA|IRS|JBL|JCPenney|KFC|LLC|MBNA|MCA|MCI|NBC|NYPD|PDQ|PNC|TCBY|TNT|TV|UPS|USA|USPS|VW|XYZ|ZZZ'.split('|'),
    specWords: 'd\'Bronx|iFix|ExtraMile'.split('|')
};
let _newPlaceURL;
let _approveRegionURL;
let _customStoreFinder = false; // switch indicating place-specific custom store finder url
let _customStoreFinderLocal = false; // switch indicating place-specific custom store finder url with localization option (GPS/addr)
let _customStoreFinderURL = ''; // switch indicating place-specific custom store finder url
let _customStoreFinderLocalURL = ''; // switch indicating place-specific custom store finder url with localization option (GPS/addr)
let _updateURL;

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

let _ixBank;
let _ixATM;
let _ixOffices;
let _layer;

const _UPDATED_FIELDS = {
    name: { updated: false, selector: '.landmark .form-control[name="name"]', tab: 'general' },
    aliases: { updated: false, selector: '.landmark .form-control.alias-name', tab: 'general' },
    address: { updated: false, selector: '.landmark .address-edit span.full-address', tab: 'general' },
    categories: { updated: false, selector: '.landmark .categories.controls .select2-container', tab: 'general' },
    description: { updated: false, selector: '.landmark .form-control[name="description"]', tab: 'general' },
    lock: { updated: false, selector: '.landmark .form-control.waze-radio-container', tab: 'general' },
    externalProvider: { updated: false, selector: '.landmark .external-providers-view', tab: 'general' },
    brand: { updated: false, selector: '.landmark .brand .select2-container', tab: 'general' },
    url: { updated: false, selector: '.landmark .form-control[name="url"]', tab: 'more-info' },
    phone: { updated: false, selector: '.landmark .form-control[name="phone"]', tab: 'more-info' },
    openingHours: { updated: false, selector: '.landmark .opening-hours ul', tab: 'more-info' },
    cost: { updated: false, selector: '.landmark .form-control[name="costType"]', tab: 'more-info' },
    canExit: { updated: false, selector: '.landmark label[for="can-exit-checkbox"]', tab: 'more-info' },
    hasTBR: { updated: false, selector: '.landmark label[for="has-tbr"]', tab: 'more-info' },
    lotType: { updated: false, selector: '.landmark .parking-type-option', tab: 'more-info' },
    parkingSpots: { updated: false, selector: '.landmark .form-control[name="estimatedNumberOfSpots"]', tab: 'more-info' },
    lotElevation: { updated: false, selector: '.landmark .lot-checkbox', tab: 'more-info' },

    getFieldProperties() {
        return Object.keys(this)
            .filter(key => this[key].hasOwnProperty('updated'))
            .map(key => this[key]);
    },
    getUpdatedTabNames() {
        return _.uniq(this.getFieldProperties()
            .filter(prop => prop.updated)
            .map(prop => prop.tab));
    },
    // checkAddedNode(addedNode) {
    //     this.getFieldProperties()
    //         .filter(prop => prop.updated && addedNode.querySelector(prop.selector))
    //         .forEach(prop => {
    //             $(prop.selector).css({ 'background-color': '#dfd' });
    //             $(`a[href="#landmark-edit-${prop.tab}"]`).css({ 'background-color': '#dfd' });
    //         });
    // },
    reset() {
        this.getFieldProperties().forEach(prop => {
            prop.updated = false;
        });
    },
    init() {
        ['VALLET_SERVICE', 'DRIVETHROUGH', 'WI_FI', 'RESTROOMS', 'CREDIT_CARDS', 'RESERVATIONS', 'OUTSIDE_SEATING', 'AIR_CONDITIONING',
            'PARKING_FOR_CUSTOMERS', 'DELIVERIES', 'TAKE_AWAY', 'WHEELCHAIR_ACCESSIBLE', 'DISABILITY_PARKING', 'CARPOOL_PARKING',
            'EV_CHARGING_STATION', 'CAR_WASH', 'SECURITY', 'AIRPORT_SHUTTLE']
            .forEach(service => {
                const propName = `services_${service}`;
                this[propName] = { updated: false, selector: `.landmark label[for="service-checkbox-${service}"]`, tab: 'more-info' };
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
    updateEditPanelHighlights() {
        // Highlight fields in the editor panel that have been updated by WMEPH.
        this.getFieldProperties().filter(prop => prop.updated).forEach(prop => {
            $(prop.selector).css({ 'background-color': '#dfd' });
            $(`a[href="#landmark-edit-${prop.tab}"]`).css({ 'background-color': '#dfd' });
        });
    }
};

// KB Shortcut object
const _SHORTCUT = {
    all_shortcuts: {}, // All the shortcuts are stored in this array
    add(shortcutCombo, callback, opt) {
        // Provide a set of default options
        const defaultOptions = {
            type: 'keydown', propagate: false, disable_in_input: false, target: document, keycode: false
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
            if (opt.disable_in_input) { // Don't enable shortcut keys in Input, Textarea fields
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
                scroll_lock: 145,
                scroll: 145,
                capslock: 20,
                caps_lock: 20,
                caps: 20,
                numlock: 144,
                num_lock: 144,
                num: 144,
                pause: 19,
                break: 19,
                insert: 45,
                home: 36,
                delete: 46,
                end: 35,
                pageup: 33,
                page_up: 33,
                pu: 33,
                pagedown: 34,
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
        this.all_shortcuts[shortcutCombo] = { callback: func, target: ele, event: opt.type };
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
        const binding = this.all_shortcuts[shortcutCombo];
        delete (this.all_shortcuts[shortcutCombo]);
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

function errorHandler(callback) {
    try {
        callback();
    } catch (ex) {
        console.error(`${_SCRIPT_NAME}:`, ex);
    }
}

function isNullOrWhitespace(str) {
    return !str || !str.trim().length;
}

function getHoursHtml(label, defaultText) {
    defaultText = defaultText || _DEFAULT_HOURS_TEXT;
    return $('<span>').append(
        `${label}:`,
        $('<input>', {
            class: 'btn btn-default btn-xs wmeph-btn',
            id: 'WMEPH_noHours',
            title: 'Add pasted hours to existing',
            type: 'button',
            value: 'Add hours',
            style: 'margin-bottom:4px; margin-right:0px'
        }),
        $('<input>', {
            class: 'btn btn-default btn-xs wmeph-btn',
            id: 'WMEPH_noHours_2',
            title: 'Replace existing hours with pasted hours',
            type: 'button',
            value: 'Replace all hours',
            style: 'margin-bottom:4px; margin-right:0px'
        }),
        // jquery throws an error when setting autocomplete="off" in a jquery object (must use .autocomplete() function), so just use a string here.
        // eslint-disable-next-line max-len
        `<textarea id="WMEPH-HoursPaste" wrap="off" autocomplete="off" style="overflow:auto;width:85%;max-width:85%;min-width:85%;font-size:0.85em;height:24px;min-height:24px;max-height:300px;padding-left:3px;color:#AAA">${defaultText}`
    )[0].outerHTML;
}

function getSelectedVenue() {
    const features = WazeWrap.getSelectedFeatures();
    // Be sure to check for features.length === 1, in case multiple venues are currently selected.
    return features.length === 1 && features[0].model.type === 'venue'
        ? features[0].model : undefined;
}

function getVenueLonLat(venue) {
    const pt = venue.geometry.getCentroid();
    return new OL.LonLat(pt.x, pt.y);
}

function isAlwaysOpen(venue) {
    const hours = venue.attributes.openingHours;
    return hours.length === 1 && hours[0].days.length === 7 && hours[0].isAllDay();
}

function isEmergencyRoom(venue) {
    return /(?:emergency\s+(?:room|department|dept))|\b(?:er|ed)\b/i.test(venue.attributes.name);
}

function isRestArea(venue) {
    return venue.attributes.categories.includes('REST_AREAS') && /rest\s*area/i.test(venue.attributes.name);
}

function getPvaSeverity(pvaValue, venue) {
    const isER = pvaValue === 'hosp' && isEmergencyRoom(venue);
    let severity;
    if (pvaValue === '' || pvaValue === '0' || (pvaValue === 'hosp' && !isER)) {
        severity = 3;
    } else if (pvaValue === '2') {
        severity = 1;
    } else if (pvaValue === '3') {
        severity = 2;
    } else {
        severity = 0;
    }
    return severity;
}

function addPURWebSearchButton() {
    const purLayerObserver = new MutationObserver(panelContainerChanged);
    purLayerObserver.observe($('#map #panel-container')[0], { childList: true, subtree: true });

    function panelContainerChanged() {
        if (!$('#WMEPH-HidePURWebSearch').prop('checked')) {
            const $panelNav = $('.place-update-edit.panel .categories.small');
            if ($('#PHPURWebSearchButton').length === 0 && $panelNav.length > 0) {
                const $btn = $('<button>', {
                    class: 'btn btn-primary', id: 'PHPURWebSearchButton', title: 'Search the web for this place.  Do not copy info from 3rd party sources!'
                }) // NOTE: Don't use btn-block class. Causes conflict with URO+ "Done" button.
                    .css({
                        width: '100%', display: 'block', marginTop: '4px', marginBottom: '4px'
                    })
                    .text('Web Search')
                    .click(() => { openWebSearch(); });
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
        const newName = $('.place-update-edit.panel .name').first().text();
        const addr = $('.place-update-edit.panel .address').first().text();
        if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
            window.open(buildSearchUrl(newName, addr));
        } else {
            window.open(buildSearchUrl(newName, addr), _SEARCH_RESULTS_WINDOW_NAME, _searchResultsWindowSpecs);
        }
    }
}

// This function runs at script load, and splits the category dataset into the searchable categories.
function makeCatCheckList(categoryData) {
    const headers = categoryData[0].split('|');
    const idIndex = headers.indexOf('pc_wmecat');
    const nameIndex = headers.indexOf('pc_transcat');

    return categoryData.map(entry => {
        const splits = entry.split('|');
        const id = splits[idIndex].trim();
        if (id.length) {
            _CATEGORY_LOOKUP[splits[nameIndex].trim().toUpperCase()] = id;
        }
        return id;
    });
} // END makeCatCheckList function

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

// This function runs at script load, and builds the search name dataset to compare the WME selected place name to.
function makeNameCheckList(pnhData) {
    const headers = pnhData[0].split('|');
    const nameIdx = headers.indexOf('ph_name');
    const aliasesIdx = headers.indexOf('ph_aliases');
    const category1Idx = headers.indexOf('ph_category1');
    const searchNameBaseIdx = headers.indexOf('ph_searchnamebase');
    const searchNameMidIdx = headers.indexOf('ph_searchnamemid');
    const searchNameEndIdx = headers.indexOf('ph_searchnameend');
    const disableIdx = headers.indexOf('ph_disable');
    const specCaseIdx = headers.indexOf('ph_speccase');
    const tighten = str => str.toUpperCase().replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '');
    const stripNonAlphaKeepCommas = str => str.toUpperCase().replace(/[^A-Z0-9,]/g, '');

    return pnhData.map(entry => {
        const splits = entry.split('|');
        const specCase = splits[specCaseIdx];

        if (splits[disableIdx] !== '1' || specCase.includes('betaEnable')) {
            let newNameList = [tighten(splits[nameIdx])];

            if (splits[disableIdx] !== 'altName') {
                // Add any aliases
                const tempAliases = splits[aliasesIdx];
                if (!isNullOrWhitespace(tempAliases)) {
                    newNameList = newNameList.concat(tempAliases.replace(/,[^A-Za-z0-9]*/g, ',').split(',').map(alias => tighten(alias)));
                }
            }

            // The following code sets up alternate search names as outlined in the PNH dataset.
            // Formula, with P = PNH primary; A1, A2 = PNH aliases; B1, B2 = base terms; M1, M2 = mid terms; E1, E2 = end terms
            // Search list will build: P, A, B, PM, AM, BM, PE, AE, BE, PME, AME, BME.
            // Multiple M terms are applied singly and in pairs (B1M2M1E2).  Multiple B and E terms are applied singly (e.g B1B2M1 not used).
            // Any doubles like B1E2=P are purged at the end to eliminate redundancy.
            const nameBaseStr = splits[searchNameBaseIdx];
            if (!isNullOrWhitespace(nameBaseStr)) { // If base terms exist, otherwise only the primary name is matched
                newNameList = newNameList.concat(stripNonAlphaKeepCommas(nameBaseStr).split(','));

                const nameMidStr = splits[searchNameMidIdx];
                if (!isNullOrWhitespace(nameMidStr)) {
                    let pnhSearchNameMid = stripNonAlphaKeepCommas(nameMidStr).split(',');
                    if (pnhSearchNameMid.length > 1) { // if there are more than one mid terms, it adds a permutation of the first 2
                        pnhSearchNameMid = pnhSearchNameMid.concat([pnhSearchNameMid[0] + pnhSearchNameMid[1], pnhSearchNameMid[1] + pnhSearchNameMid[0]]);
                    }
                    const midLen = pnhSearchNameMid.length;
                    for (let extix = 1, len = newNameList.length; extix < len; extix++) { // extend the list by adding Mid terms onto the SearchNameBase names
                        for (let midix = 0; midix < midLen; midix++) {
                            newNameList.push(newNameList[extix] + pnhSearchNameMid[midix]);
                        }
                    }
                }

                const nameEndStr = splits[searchNameEndIdx];
                if (!isNullOrWhitespace(nameEndStr)) {
                    const pnhSearchNameEnd = stripNonAlphaKeepCommas(nameEndStr).split(',');
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
            const category = splits[category1Idx].toUpperCase().replace(/[^A-Z0-9]/g, '');
            const appendWords = [];
            if (category === 'HOTEL') {
                appendWords.push('HOTEL');
            } else if (category === 'BANKFINANCIAL' && !/\bnotABank\b/.test(specCase)) {
                appendWords.push('BANK', 'ATM');
            } else if (category === 'SUPERMARKETGROCERY') {
                appendWords.push('SUPERMARKET');
            } else if (category === 'GYMFITNESS') {
                appendWords.push('GYM');
            } else if (category === 'GASSTATION') {
                appendWords.push('GAS', 'GASOLINE', 'FUEL', 'STATION', 'GASSTATION');
            } else if (category === 'CARRENTAL') {
                appendWords.push('RENTAL', 'RENTACAR', 'CARRENTAL', 'RENTALCAR');
            }
            appendWords.forEach(word => { newNameList = newNameList.concat(newNameList.map(name => name + word)); });

            // Add entries for word/spelling variations
            _wordVariations.forEach(variationsList => addSpellingVariants(newNameList, variationsList));

            return _.uniq(newNameList).join('|').replace(/\|{2,}/g, '|').replace(/\|+$/g, '');
        } // END if valid line
        return '00';
    });
} // END makeNameCheckList

// Whitelist stringifying and parsing
function saveWhitelistToLS(compress) {
    _venueWhitelistStr = JSON.stringify(_venueWhitelist);
    if (compress) {
        if (_venueWhitelistStr.length < 4800000) { // Also save to regular storage as a back up
            localStorage.setItem(_WL_LOCAL_STORE_NAME, _venueWhitelistStr);
        }
        _venueWhitelistStr = LZString.compressToUTF16(_venueWhitelistStr);
        localStorage.setItem(_WL_LOCAL_STORE_NAME_COMPRESSED, _venueWhitelistStr);
    } else {
        localStorage.setItem(_WL_LOCAL_STORE_NAME, _venueWhitelistStr);
    }
}
function loadWhitelistFromLS(decompress) {
    if (decompress) {
        _venueWhitelistStr = localStorage.getItem(_WL_LOCAL_STORE_NAME_COMPRESSED);
        _venueWhitelistStr = LZString.decompressFromUTF16(_venueWhitelistStr);
    } else {
        _venueWhitelistStr = localStorage.getItem(_WL_LOCAL_STORE_NAME);
    }
    _venueWhitelist = JSON.parse(_venueWhitelistStr);
}
function backupWhitelistToLS(compress) {
    _venueWhitelistStr = JSON.stringify(_venueWhitelist);
    if (compress) {
        _venueWhitelistStr = LZString.compressToUTF16(_venueWhitelistStr);
        localStorage.setItem(_WL_LOCAL_STORE_NAME_COMPRESSED + Math.floor(Date.now() / 1000), _venueWhitelistStr);
    } else {
        localStorage.setItem(_WL_LOCAL_STORE_NAME + Math.floor(Date.now() / 1000), _venueWhitelistStr);
    }
}

function phlog(msg) {
    console.log(`WMEPH${_IS_DEV_VERSION ? '-β' : ''}:`, msg);
}
function phlogdev(msg) {
    if (_USER.isDevUser) {
        console.log(`WMEPH${_IS_DEV_VERSION ? '-β' : ''} (dev):`, msg);
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
    const originalGeometry = venue.geometry.clone();
    if (venue.isPoint()) {
        venue.geometry.x += 0.000000001;
    } else {
        venue.geometry.components[0].components[0].x += 0.000000001;
    }
    W.model.actionManager.add(new UpdateFeatureGeometry(venue, W.model.venues, originalGeometry, venue.geometry));
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
                    _dupeLayer.destroyFeatures();
                    _dupeLayer.setVisibility(false);
                } else {
                    const deletedDupe = _dupeLayer.getFeaturesByAttribute('dupeID', lastAction.object.attributes.id);
                    _dupeLayer.removeFeatures(deletedDupe);
                    _dupeIDList.splice(_dupeIDList.indexOf(lastAction.object.attributes.id), 1);
                }
                phlog('Deleted a dupe');
            }
        }
    }, 20);
}

//  Whitelist an item. Returns true if successful. False if not.
function whitelistAction(itemID, wlKeyName) {
    const venue = getSelectedVenue();
    let addressTemp = venue.getAddress();
    if (addressTemp.hasOwnProperty('attributes')) {
        addressTemp = addressTemp.attributes;
    }
    if (!addressTemp.country) {
        WazeWrap.Alerts.error(_SCRIPT_NAME, 'Whitelisting requires an address. Enter the place\'s address and try again.');
        return false;
    }
    const itemGPS = OL.Layer.SphericalMercator.inverseMercator(venue.attributes.geometry.getCentroid().x, venue.attributes.geometry.getCentroid().y);
    if (!_venueWhitelist.hasOwnProperty(itemID)) { // If venue is NOT on WL, then add it.
        _venueWhitelist[itemID] = {};
    }
    _venueWhitelist[itemID][wlKeyName] = { active: true }; // WL the flag for the venue
    _venueWhitelist[itemID].city = addressTemp.city.attributes.name; // Store city for the venue
    _venueWhitelist[itemID].state = addressTemp.state.name; // Store state for the venue
    _venueWhitelist[itemID].country = addressTemp.country.name; // Store country for the venue
    _venueWhitelist[itemID].gps = itemGPS; // Store GPS coords for the venue
    saveWhitelistToLS(true); // Save the WL to local storage
    wmephWhitelistCounter();
    _buttonBanner2.clearWL.active = true;
    return true;
}

// Keep track of how many whitelists have been added since the last pull, alert if over a threshold (100?)
function wmephWhitelistCounter() {
    localStorage.WMEPH_WLAddCount = parseInt(localStorage.WMEPH_WLAddCount, 10) + 1;
    if (localStorage.WMEPH_WLAddCount > 50) {
        WazeWrap.Alerts.warning(_SCRIPT_NAME, 'Don\'t forget to periodically back up your Whitelist data using the Pull option in the WMEPH settings tab.');
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
                    // Normally, scrolling happens inside the tab-content div.  When WMEPH adds stuff outside the landmark div, it effectively breaks that
                    // and causes scrolling to occur at the main content div under edit-panel.  That's actually OK, but need to disable a couple
                    // artifacts that "stick around" with absolute positioning.
                    $('#edit-panel .landmark').removeClass('separator-line');
                    $('#edit-panel .tab-scroll-gradient').css({ display: 'none' });
                }
            }
        });
    });
    observer.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });
}

function appendServiceButtonIconCss() {
    const cssArray = [
        '.serv-247 { width: 73px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-ac { width: 50px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-credit { width: 73px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-deliveries { width: 86px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-drivethru { width: 78px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-outdoor { width: 73px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-parking { width: 46px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-reservations { width: 55px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-restrooms { width: 49px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAyCAYAAAD1CDOyAAAD8GlDQ1BJQ0MgUHJvZmlsZQAAOI2NVd1v21QUP4lvXKQWP6Cxjg4Vi69VU1u5GxqtxgZJk6XpQhq5zdgqpMl1bhpT1za2021Vn/YCbwz4A4CyBx6QeEIaDMT2su0BtElTQRXVJKQ9dNpAaJP2gqpwrq9Tu13GuJGvfznndz7v0TVAx1ea45hJGWDe8l01n5GPn5iWO1YhCc9BJ/RAp6Z7TrpcLgIuxoVH1sNfIcHeNwfa6/9zdVappwMknkJsVz19HvFpgJSpO64PIN5G+fAp30Hc8TziHS4miFhheJbjLMMzHB8POFPqKGKWi6TXtSriJcT9MzH5bAzzHIK1I08t6hq6zHpRdu2aYdJYuk9Q/881bzZa8Xrx6fLmJo/iu4/VXnfH1BB/rmu5ScQvI77m+BkmfxXxvcZcJY14L0DymZp7pML5yTcW61PvIN6JuGr4halQvmjNlCa4bXJ5zj6qhpxrujeKPYMXEd+q00KR5yNAlWZzrF+Ie+uNsdC/MO4tTOZafhbroyXuR3Df08bLiHsQf+ja6gTPWVimZl7l/oUrjl8OcxDWLbNU5D6JRL2gxkDu16fGuC054OMhclsyXTOOFEL+kmMGs4i5kfNuQ62EnBuam8tzP+Q+tSqhz9SuqpZlvR1EfBiOJTSgYMMM7jpYsAEyqJCHDL4dcFFTAwNMlFDUUpQYiadhDmXteeWAw3HEmA2s15k1RmnP4RHuhBybdBOF7MfnICmSQ2SYjIBM3iRvkcMki9IRcnDTthyLz2Ld2fTzPjTQK+Mdg8y5nkZfFO+se9LQr3/09xZr+5GcaSufeAfAww60mAPx+q8u/bAr8rFCLrx7s+vqEkw8qb+p26n11Aruq6m1iJH6PbWGv1VIY25mkNE8PkaQhxfLIF7DZXx80HD/A3l2jLclYs061xNpWCfoB6WHJTjbH0mV35Q/lRXlC+W8cndbl9t2SfhU+Fb4UfhO+F74GWThknBZ+Em4InwjXIyd1ePnY/Psg3pb1TJNu15TMKWMtFt6ScpKL0ivSMXIn9QtDUlj0h7U7N48t3i8eC0GnMC91dX2sTivgloDTgUVeEGHLTizbf5Da9JLhkhh29QOs1luMcScmBXTIIt7xRFxSBxnuJWfuAd1I7jntkyd/pgKaIwVr3MgmDo2q8x6IdB5QH162mcX7ajtnHGN2bov71OU1+U0fqqoXLD0wX5ZM005UHmySz3qLtDqILDvIL+iH6jB9y2x83ok898GOPQX3lk3Itl0A+BrD6D7tUjWh3fis58BXDigN9yF8M5PJH4B8Gr79/F/XRm8m241mw/wvur4BGDj42bzn+Vmc+NL9L8GcMn8F1kAcXgSteGGAAAACXBIWXMAABcSAAAXEgFnn9JSAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAPgElEQVRoBZ2aeXBV1R3H38sGCWENS1gTAiEsZQthVShbqcDAWARadeqIozDttI78Y8exTm1nurh0GaZ2HO2IM2htoVORVJCtbAJiRQQCsgVQdgiBEELI9l4/31/uudz38hKkZ+a+e87v/PblLDcJhe7ekhzKiy++mDJz5sxW0Wg07GC8/fkA7F67Pg/xnjx5cmvJCjBJDvTvqStFTVmYdhgwYMBzvXv33t6zZ889ffv2LR4+fPj3V65c6Zj7StyThEZkoxWv/Pz8Rbm5ueslIycnZ+PgwYN/Onfu3LYez2ZlBD0aL19EkdGjR2dfvnz5rYaGhpl46UxycnIV7/xwOJyclpb23IkTJ34XEBKJZ3KXscnASSmnT59+pa6u7hn4liHjTCQSyYW2Y3p6+qqCgoIfFxcXlzGW0xp4YprzZAyQgeCmUGpq6m8w4NFWrVotg+EjHTp0eIP+B5WVlSMROr9r167br1279nWQJp5ZM2M5MKq5lJSUx2tqan7bunXrj9q3b/9gVlbWsszMzJUVFRUd6uvrH66urq65cuXKFg+/JceLnd8sH/Py8vpkZ2ef7NWr1zp/xuuMGDHiPuD1pNjywFyzIQ/guK7hDhkyJBMeX/CcInW6uUm9iVA2aXUeOUfod/bmmji+RaF4IgPCOtJmt8cgvX///u3Ub9OmzQFCX8KTt3jx4lTBENQiP+HEt/Ly8iy83Y8o7F2zZs0l5pNIH6uDrVu3XkxKStpYW1vb6auvvsryaJtEokWh7dq1i8Ikgxzt6TGopgZq1Kcu0nk6Ml8/ffr0e60FsTBlSE3xqyI1uwhIixw9etRkqNiR0QdH1ZFmBmtE+Wa/lk54tkOfPn12du/e/RrpMyFISkReYy6K114IwJt4KTAX3/UdSNq+S21FWZ0eCiINGzbsGdIpyrMiAG8iownAQxZcT2TQoEGzbt68+SHFXdO2bdsVFOHXVVVVkwnxVCL0AQIWffzxx9fAVa42WTmANdfEX4Y0sAKOpnDXwTMrIyOjWKlFMRfU1tQ8HIlGv6Qu5+3du/cIuHJuPU9Ma1IkbnbUqFEpFy5ciJSVlR1n7T50+/btXEL+AM/9GNSRNFhBuj392WefyQDVhFLKVhvHo4W3c5Lhn6exJ+zAWZkYUkiNTOfJS05JWUMaPbl///7jHi/hN9FZzOKbExCT50qtq1evFrF+Z+CpU3jmYDwhY3k2hi4BjvjHGDt+/Pj03bt3Vy9YsCD98OHDA5CRR5SvsamWUOzlU6ZMydiyZUsVtRGk82XFG+ELQOlsVoTZeL0I77dnv+gE40wEKKTVeKyMoq4mvcp4iktLS7d4CvvMExjgz7Hjj2GveQjew1EuBzmSXU2/Fr4iTUJWK97p3lgb4NaOHTt+ePDgwb1CoBm/oBGuH6WIR7CBLSekI1gdzsP4Estsa1ExDjEOI7SO+XrGBYBJ5YzX+/Xr94sNGzZcZpyoPnwHUcgPsbktRyktpSXwjuCgFHiZ9rwVTdMHAyLIqsdYGTSQcT0b4c+OHDnyB8ZqSU5xDUyw0ubUqVP/xtP3odirFPMbMClj9UhCsJ8q2JFy7ty5WhiOwqMvgz8K/D8dP358qZjRgoY4OVHOYA/euHFjJSl5necJ/LCdwrU8J6JRxg5XO3mU2jO5t27dSuaZfv369ZfgnUOtLDl06NAbJsn7MQ+oj5cWsXtquXsliNBSf9asWdnsqiUc3MpJkyEerm2AXt/4s5+0B+8Q/CvGjBkzviWezc2x7BZAXw6f0yNHjuwhPKe8WU9hJePhR4CfRSFZrKY0kkLyVszDkSENWMratWsvEpHXoe2Il6cAU6vjcV6199mzZ4eQFjl4+OVPP/3UTgGsfOIfwzfR2MMLHThw4CgR/CMp1wdZY8H1jVA/xE7ZnzwdTgi3seXr1Kh2m0cKKZW0D/gP4axlbOt2ly5dtpOvV0m5+4C55pxk+wd5P5H8b4PB5xwCp1fx93km6JtcD882YZbirRhxC6dNFR8JkZdMCLlfiKcyWYk2aJKWTI13oE5EHFzebFKHN+YyNdixY8cB8nk3tIUTJ07sbgh3+NsQwT0xIsRp2JQBmKTl1cNN9JJuJpcsUdStj5PrcBiiUoctXbo03RlhDPBiPoJqeA4JgJKzKKQPz5w5M8kQ7oTd4f+SfeovynUB8PQxXgPYIEcaQtyeAd96hAvPlKH+HmBDfUd57uG79POGjenIYjBm3759K9DnO5qARwpRUDdKgYd9I3TtJArfRsBFNhnbIdmlZ5NeEyCwSEEUxiMitsZcLqvSDzmJjhKA1ekTYFphJjRihBqIlK083jgJQ7xuKARtEeN54A/0gNLMGSLdbDUketPBWwjvIuGhj5gIL2qHVAHV8HZXjMgjRPvXrVt3QzCNeZ3ifFSiMS26atUqGSQB8sgmcCqJlt0DMGInKXkMpUa4OzLLr1MqxFyMEThM+0wI5UxZ8RdfNejtrR8WAlvpQFNthuAf9SIRprgtEo5BEQbkMnlAiIROR+ABCDmyefPmq4LRnBDzLrl5EEPqwLNIUNwV8LiJsqPff/99OSDE8UQva1I42KCL8Nh+EIQn6Jux8PWnPF5R7jy2QxpnLBoNRhSrdwoT5uNBzGE5+9yjtPCpz+HQQBwBDmHEBZjfj9Fp7NZVhH4v4/Yw7+HR+a87Dm8EgWcRRY4fLR850GE+ScYSOYN6+IqG6W5MNIOAQTDdzyb3X42ph4GMq1lJtmhME64RzZkzx1yiIzhGH4a2J2nVS0jQbIN5K+CuLpQCCZWUEjSR3a3F0BNtGSDiMBtfY26PGzcuF48OhVMpXxVuiSPKDAGvgsI5pTEF6jMiXyXZHIDyilQX6G1Fgu5LmAOumyohoqUFi1u1ZEBwpYj1W/oRvvDAj0fzayJE8cmAvtybS4WlesC7E7H4Aje4csHY/FztaOgbQbrtZ6wD4SRNcC8oJQrHoM/DOV0FCzYpw5yBnDHB+UR9aPyM8ebNePFhiW/0Jkb0QIkqFPpISHgxn3E2Rvzn7bffvu4RJnQZ4fwcZsehKZAwrWyMN9LP5gZoSyL05kIpTXQ9dlZ3bpXxYa7DacBHhJff9+YBBZwhIMWoo0IFih/2kIZJGIVk9QGsyY7NfmFGLVmyRPeK8zAt4JaZL3r4neSVzuY5TmOa4YIXjKbBg0YZpvdDNvhOA8f67g2KGYXMCNkTTdKxQus6AkpLSkr0yUS5Nw6CKoz4UuPJkyfrFdPYL4zxwoULG1BaO3Uum54Z0blzZ93CQtxJ4o8UaYoGj1NCXzNi+LpBMBLAnBFWW0RdNaIvManoyCJfV5eEERLWY9myZa10FmGsNfRzjrpWI3H14OTIq3YGIu02Kz95+msSnqlSln0kJg2AXYW3nFTtMUn0GUY0MXQerl6Gj/61OCkMv+uzZ8+uScLicmqhGIR8jHiHY/XzCNId98CKFSuqPAaJ3eUJo5C1Il0B9wcs0Y9cunTpWcahTp067fDo3eq0nRQLcVdX+uoDnB0U0cfxl/JyjjsZCM2aIotOFln68+GvXbyY+3e9VT3Hipfw5nI+k8znCPE8SGGW1rOO3ns3eZFmJrxbt24XMKSEvWUsm+a7eKgNKfYUd+HVIgLPPItRnwBfD96P+vbtu4vCX0RUdJR3RkSGDh2ahyPmcSj0VzaUr1UEWYAeh247EX8WPp/Az/jLiCSOFZcee+yxJwEuQRntE9fx0jbeasJxQgzgfkgzW3U2bdpUgeIb5S3OT9v4qDaNL4V/9fDC4EnR8M6dOyu55j4thxGRdijWERp53k8f4NMx8s9cRfs5OXjdjh0cGPsw1wma17jSLt61a5fu86agmKSxgUW4Nb1Jap0A6TJHXDuOO0beW2nhUkMgGacLfIgI7OJVgzHFKGu0RCC4qpkjuNEdO3ny5BMzZswoItq/xssEo8FqS3xQtDXGteZtWSIYnkelsFa9N1kNCzms/oRPPAc1R7MDoDrm0YEDBw6gKLsRjX3uJOvNOU8Jz3BFRBPcio3PmbqlpBHyb9kMP0QgUQRNYfYfnHp7M2i3MNw3gr7uHLd5gnKStXBg3BGcXevxdzS2E0oRI0D5kSB24xnKTv0kz3fxpm5upkxRUVFBYWFh4+mvkZO+XgwkfRbwGfIJQGE8yzeAMVmaZq0PRq2RAllehLRMZvLEGMpQ+vDxL8U5ztHpra/0ajJAKWrND5lGhKyS13nysjcefZPCe5Xc9E+jFP5iVpbfa28xan7w5lxCrz+IPMw7RDRK3RypGaOgg7taQl5jnjStOdHF0CqdaEp9NTndN1IWCVkAOWUbhTkHI9qQpy8QwhH0tZRZI9W6onQOxsgjdhwB1g6vaU94i2cFaVAGjwoRcJfwvWUMmv/xFXIoZIPrJnqbvm7CzysB2DNu8rL7A1/z1qPsAJTyPUL/FgpXYpjziHZfzTdgwD/4jrpDfLwWI8gB499eNvky4ufjxgnxYtLJy1WDEQVtLPoe6nuJkOqYEJPnwFKBhUklB7fVCtqEAuOUckNfhgM0806IF2MEuSoP+1728tDnpxWCVofCwVjr1qWCdryCcz5tcx1PRozBXnSakCA/Bs8hOMFuHHzDKyFNEEd9FZl/VaSf0FtCTNQ8I3waz1FNUD1dfLwgQktGBPH8frxhKGGWAk8owCe8x44Wi0BDTNjVXwDc2L2rEfHKiRv3bp+OoUnj/Y3CFq9BvFOYT+QMf4WMp9fYVybRJDD93cCvEVYircMxxc5SrGPx/2UA/EUn/kF6pWaEFdA2YOa0f9micc814RGmBXdO1m59A23HPuBWIO0P2jN0LLibQ6RPTIOXVrtWOMKHM9bXkSwOo3kOyLw+Ouvs5HIsaHTzkSBlyolCd47mD4rBtGnTstjoBiGkD8bMFmzq1Kn9UF79eg5z9tVQ8G/QLGX494dyGcHJYHqAZjz809ijHhCMv9WlMD9GBc93Lv2RU030viGJ8k+haxg7dmy3ixcvvofiU4jGv4D1htFoIkQ3dAMv6mOA/lFlGMeLNdwCH+XKelN7DUv13ZZZRS3CYS6Ni9d7HG3m4bD18NdXjBlKW/r1yN0E/wyMmgT8n+j01OrVq3VSMHopopbICN9Kfa3miP0rmMyDYTnnor8j4AuOGt8jxHOAV5JO7/L58g979uw57vHzPWQSEv84uVEUy+cr+rPwnIeiychYS1Q3cEbLw5D5GNcbmX9D/s+5o+j2GGNAYvZ3oCYIb6VMmDBhNH9H6O+m+NKRznga35UKHYy3UywAumvXp5k0adIg/q4xGEN8mP5NCTnui7mY+XNBzv8DLtltFbPOUeIAAAAASUVORK5CYII=) top center no-repeat; }',
        '.serv-takeaway { width: 34px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-valet { width: 50px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-wheelchair { width: 50px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }',
        '.serv-wifi { width: 67px; height: 50px; display: inline-block; background: transparent url(data:image/png;base64,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) top center no-repeat; }'
    ];
    $('head').append($('<style>', { type: 'text/css' }).html(cssArray.join('\n')));
}

// Function that checks current place against the Harmonization Data.  Returns place data or "NoMatch"
function harmoList(itemName, state2L, region3L, country, itemCats, item, placePL) {
    if (country !== 'USA' && country !== 'CAN') {
        WazeWrap.Alerts.info(_SCRIPT_NAME, 'No PNH data exists for this country.');
        return ['NoMatch'];
    }
    const { pnhNames, pnh: pnhData } = _PNH_DATA[country];
    const pnhHeaders = pnhData[0].split('|');
    const phNameIdx = pnhHeaders.indexOf('ph_name');
    const phCategory1Idx = pnhHeaders.indexOf('ph_category1');
    const phForceCatIdx = pnhHeaders.indexOf('ph_forcecat');
    const phRegionIdx = pnhHeaders.indexOf('ph_region');
    const phOrderIdx = pnhHeaders.indexOf('ph_order');
    const phSpecCaseIdx = pnhHeaders.indexOf('ph_speccase');
    const phSearchNameWordIdx = pnhHeaders.indexOf('ph_searchnameword');
    let approvedRegions; // filled with the regions that are approved for the place, when match is found
    const matchPNHRegionData = []; // array of matched data with regional approval
    let allowMultiMatch = false;
    const pnhOrderNum = [];
    const pnhNameTemp = [];
    let pnhNameMatch = false; // tracks match status

    itemName = itemName.toUpperCase().replace(/ AND /g, ' ').replace(/^THE /g, '');
    const itemNameSpace = ` ${itemName.replace(/[^A-Z0-9 ]/g, ' ').replace(/ {2,}/g, ' ')} `;
    itemName = itemName.replace(/[^A-Z0-9]/g, ''); // Clear all non-letter and non-number characters ( HOLLYIVY PUB #23 -- > HOLLYIVYPUB23 )

    // for each place on the PNH list (skipping headers at index 0)
    for (let pnhIdx = 1, len = pnhNames.length; pnhIdx < len; pnhIdx++) {
        let PNHStringMatch = false;
        const pnhEntry = pnhData[pnhIdx];
        const pnhEntrySplits = pnhEntry.split('|'); // Split the PNH place data into string array

        // Name Matching
        const specCases = pnhEntrySplits[phSpecCaseIdx];
        if (specCases.includes('regexNameMatch')) {
            // Check for regex name matching instead of "standard" name matching.
            const match = specCases.match(/regexNameMatch<>(.+?)<>/i);
            if (match !== null) {
                const reStr = match[1].replace(/\\/, '\\').replace(/<or>/g, '|');
                const re = new RegExp(reStr, 'i');
                PNHStringMatch = re.test(item.attributes.name);
            }
        } else if (specCases.includes('strMatchAny') || pnhEntrySplits[phCategory1Idx] === 'Hotel') {
            // Match any part of WME name with either the PNH name or any spaced names
            allowMultiMatch = true;
            const spaceMatchList = [];
            spaceMatchList.push(pnhEntrySplits[phNameIdx].toUpperCase().replace(/ AND /g, ' ').replace(/^THE /g, '').replace(/[^A-Z0-9 ]/g, ' ').replace(/ {2,}/g, ' '));
            if (pnhEntrySplits[phSearchNameWordIdx] !== '') {
                spaceMatchList.push(...pnhEntrySplits[phSearchNameWordIdx].toUpperCase().replace(/, /g, ',').split(','));
            }
            for (let nmix = 0; nmix < spaceMatchList.length; nmix++) {
                if (itemNameSpace.includes(` ${spaceMatchList[nmix]} `)) {
                    PNHStringMatch = true;
                }
            }
        } else {
            // Split all possible search names for the current PNH entry
            const nameComps = pnhNames[pnhIdx].split('|');

            // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB )
            const itemNameNoNum = itemName.replace(/[^A-Z]/g, '');

            if (specCases.includes('strMatchStart')) {
                //  Match the beginning part of WME name with any search term
                for (let nmix = 0; nmix < nameComps.length; nmix++) {
                    if (itemName.startsWith(nameComps[nmix]) || itemNameNoNum.startsWith(nameComps[nmix])) {
                        PNHStringMatch = true;
                    }
                }
            } else if (specCases.includes('strMatchEnd')) {
                //  Match the end part of WME name with any search term
                for (let nmix = 0; nmix < nameComps.length; nmix++) {
                    if (itemName.endsWith(nameComps[nmix]) || itemNameNoNum.endsWith(nameComps[nmix])) {
                        PNHStringMatch = true;
                    }
                }
            } else if (nameComps.includes(itemName) || nameComps.includes(itemNameNoNum)) {
                // full match of any term only
                PNHStringMatch = true;
            }
        }

        // if a match was found:
        if (PNHStringMatch) { // Compare WME place name to PNH search name list
            phlogdev(`Matched PNH Order No.: ${pnhEntrySplits[phOrderIdx]}`);

            const PNHPriCat = catTranslate(pnhEntrySplits[phCategory1Idx]); // Primary category of PNH data
            let PNHForceCat = pnhEntrySplits[phForceCatIdx]; // Primary category of PNH data

            // Gas stations only harmonized if the WME place category is already gas station (prevents Costco Gas becoming Costco Store)
            if (itemCats[0] === 'GAS_STATION') {
                PNHForceCat = '1';
            }

            let PNHMatchProceed = false;
            if (PNHForceCat === '1' && itemCats.indexOf(PNHPriCat) === 0) {
                // Name and primary category match
                PNHMatchProceed = true;
            } else if (PNHForceCat === '2' && itemCats.includes(PNHPriCat)) {
                // Name and any category match
                PNHMatchProceed = true;
            } else if (PNHForceCat === '0' || PNHForceCat === '') {
                // Name only match
                PNHMatchProceed = true;
            }

            if (PNHMatchProceed) {
                // remove spaces, upper case the approved regions, and split by commas
                approvedRegions = pnhEntrySplits[phRegionIdx].replace(/ /g, '').toUpperCase().split(',');

                if (approvedRegions.includes(state2L) || approvedRegions.includes(region3L) // if the WME-selected item matches the state, region
                    || approvedRegions.includes(country) //  OR if the country code is in the data then it is approved for all regions therein
                    || $('#WMEPH-RegionOverride').prop('checked')) { // OR if region override is selected (dev setting)
                    matchPNHRegionData.push(pnhEntry);
                    _buttonBanner.placeMatched = new Flag.PlaceMatched();
                    if (!allowMultiMatch) {
                        // Return the PNH data string array to the main script
                        return matchPNHRegionData;
                    }
                } else {
                    // PNH match found (once true, stays true)
                    pnhNameMatch = true;

                    // Pull the data line from the PNH data table.  (**Set in array for future multimatch features)
                    // matchPNHData.push(pnhEntry);

                    // temp name for approval return
                    pnhNameTemp.push(pnhEntrySplits[phNameIdx]);

                    // temp order number for approval return
                    pnhOrderNum.push(pnhEntrySplits[phOrderIdx]);
                }
            }
        }
    } // END loop through PNH places

    // If NO (name & region) match was found:
    if (_buttonBanner.placeMatched) {
        return matchPNHRegionData;
    }
    if (pnhNameMatch) { // if a name match was found but not for region, prod the user to get it approved
        _buttonBanner.ApprovalSubmit = new Flag.ApprovalSubmit(region3L, pnhOrderNum, pnhNameTemp, placePL);
        return ['ApprovalNeeded', pnhNameTemp, pnhOrderNum];
    }
    // if no match was found, suggest adding the place to the sheet if it's a chain
    _buttonBanner.NewPlaceSubmit = new Flag.NewPlaceSubmit();
    return ['NoMatch'];
} // END harmoList function

function onObjectsChanged() {
    deleteDupeLabel();

    // This is code to handle updating the banner when changes are made external to the script.
    const venue = getSelectedVenue();
    if ($('#WMEPH_banner').length > 0 && venue) {
        const actions = W.model.actionManager.getActions();
        const lastAction = actions[actions.length - 1];
        if (lastAction && lastAction.object && lastAction.object.type === 'venue' && lastAction.attributes && lastAction.attributes.id === venue.attributes.id) {
            if (lastAction.newAttributes && lastAction.newAttributes.entryExitPoints) {
                harmonizePlaceGo(venue, 'harmonize');
            }
        }
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
        filter: new OL.Filter.Comparison({
            type: '==',
            value,
            evaluate(venue) {
                return venue && venue.model && venue.model.attributes.wmephSeverity === this.value;
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
    const ruleGenerator = (value, symbolizer) => new W.Rule({
        filter: new OL.Filter.Comparison({
            type: '==',
            value,
            evaluate(venue) {
                return venue && venue.model && venue.model.attributes.wmephSeverity === this.value;
            }
        }),
        symbolizer,
        wmephStyle: 'default'
    });

    const severity0 = ruleGenerator(0, {
        pointRadius: 5,
        strokeWidth: 4,
        strokeColor: '#24ff14'
    });

    const severityLock = ruleGenerator('lock', {
        pointRadius: 5,
        strokeColor: '#24ff14',
        strokeLinecap: 1,
        strokeDashstyle: '7 2',
        strokeWidth: 5
    });

    const severity1 = ruleGenerator(1, {
        strokeColor: '#0055ff',
        strokeWidth: 4,
        pointRadius: 7
    });

    const severityLock1 = ruleGenerator('lock1', {
        pointRadius: 5,
        strokeColor: '#0055ff',
        strokeLinecap: 1,
        strokeDashstyle: '7 2',
        strokeWidth: 5
    });

    const severity2 = ruleGenerator(2, {
        strokeColor: '#ff0',
        strokeWidth: 6,
        pointRadius: 8
    });

    const severity3 = ruleGenerator(3, {
        strokeColor: '#ff0000',
        strokeWidth: 4,
        pointRadius: 8
    });

    const severity4 = ruleGenerator(4, {
        fillColor: 'black',
        fillOpacity: 0.35,
        strokeColor: '#f42',
        strokeLinecap: 1,
        strokeWidth: 13,
        strokeDashstyle: '4 2'
    });

    const severityHigh = ruleGenerator(5, {
        pointRadius: 12,
        fillColor: 'black',
        fillOpacity: 0.4,
        strokeColor: '#f4a',
        strokeLinecap: 1,
        strokeWidth: 10,
        strokeDashstyle: '4 2'
    });

    const severityAdLock = ruleGenerator('adLock', {
        pointRadius: 1,
        fillColor: 'yellow',
        fillOpacity: 0.4,
        strokeColor: '#000',
        strokeLinecap: 1,
        strokeWidth: 10,
        strokeDashstyle: '4 2'
    });

    function plaTypeRuleGenerator(value, symbolizer) {
        return new W.Rule({
            filter: new OL.Filter.Comparison({
                type: '==',
                value,
                evaluate(venue) {
                    if ($('#WMEPH-PLATypeFill').prop('checked') && venue && venue.model && venue.model.attributes.categories
                        && venue.model.attributes.categoryAttributes && venue.model.attributes.categoryAttributes.PARKING_LOT
                        && venue.model.attributes.categories.includes('PARKING_LOT')) {
                        const type = venue.model.attributes.categoryAttributes.PARKING_LOT.parkingType;
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
        severity3, severity4, severityHigh, severityAdLock, publicPLA, restrictedPLA, privatePLA]);
}

/**
* To highlight a place, set the wmephSeverity attribute to the desired highlight level.
* @param venues {array of venues, or single venue} Venues to check for highlights.
* @param force {boolean} Force recalculation of highlights, rather than using cached results.
*/
function applyHighlightsTest(venues, force) {
    if (!_layer) return;

    // Make sure venues is an array, or convert it to one if not.
    if (venues) {
        if (!Array.isArray(venues)) {
            venues = [venues];
        }
    } else {
        venues = [];
    }

    const storedBannButt = _buttonBanner;
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
            if (doHighlight && !(disableRankHL && venue.attributes.lockRank > _USER.rank - 1)) {
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
    if (keys.length > _MAX_CACHE_SIZE) {
        const trimSize = _MAX_CACHE_SIZE * 0.8;
        for (let i = keys.length - 1; i > trimSize; i--) {
            delete _resultsCache[keys[i]];
        }
    }

    const venue = getSelectedVenue();
    if (venue) {
        venue.attributes.wmephSeverity = harmonizePlaceGo(venue, 'highlight');
        _buttonBanner = storedBannButt;
        _servicesBanner = storedBannServ;
        _buttonBanner2 = storedBannButt2;
    }
    phlogdev(`Ran highlighter in ${Math.round((performance.now() - t0) * 10) / 10} milliseconds.`);
    phlogdev(`WMEPH cache size: ${Object.keys(_resultsCache).length}`);
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

        W.map.landmarkLayer.events.register('beforefeaturesadded', null, e => errorHandler(() => applyHighlightsTest(e.features.map(f => f.model))));

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
function toTitleCaseStrong(str) {
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
            return (_TITLECASE_SETTINGS.ignoreWords.includes(txtLC)) ? txtLC : txt;
        })
        // uppercase any from the capWords List
        .replace(/[^ ]+/g, txt => {
            const txtLC = txt.toUpperCase();
            return (_TITLECASE_SETTINGS.capWords.includes(txtLC)) ? txtLC : txt;
        })
        // preserve any specific words
        .replace(/[^ ]+/g, txt => {
            const txtUC = txt.toUpperCase();
            return _TITLECASE_SETTINGS.specWords.find(specWord => specWord.toUpperCase() === txtUC) || txt;
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
function normalizePhone(s, outputFormat, returnType, item, region) {
    if (!s && returnType === 'existing') {
        _buttonBanner.phoneMissing = Flag.PhoneMissing.eval(item, _wl, region, outputFormat);
        return s;
    }
    s = s.replace(/(\d{3}.*)\W+(?:extension|ext|xt|x).*/i, '$1');
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
            if (returnType === 'inputted') {
                return 'badPhone';
            }
            _buttonBanner.phoneInvalid = new Flag.PhoneInvalid();
            return s;
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
function executeMultiAction(actions, description) {
    if (actions.length > 0) {
        const mAction = new MultiAction();
        mAction.setModel(W.model);
        mAction._description = description || mAction._description || 'Change(s) made by WMEPH';
        actions.forEach(action => { mAction.doSubAction(action); });
        W.model.actionManager.add(mAction);
    }
}

// Split localizer (suffix) part of names, like "SUBWAY - inside Walmart".
function getNameParts(name) {
    const splits = name.match(/(.*?)(\s+[-(–].*)*$/);
    return { base: splits[1], suffix: splits[2] };
}

function addUpdateAction(venue, updateObj, actions) {
    const action = new UpdateObject(venue, updateObj);
    if (actions) {
        actions.push(action);
    } else {
        W.model.actionManager.add(action);
    }
}

function setServiceChecked(servBtn, checked, actions) {
    const servID = _WME_SERVICES_ARRAY[servBtn.servIDIndex];
    const checkboxChecked = $(`#service-checkbox-${servID}`).prop('checked');
    const venue = getSelectedVenue();

    if (checkboxChecked !== checked) {
        _UPDATED_FIELDS[`services_${servID}`].updated = true;
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
function normalizeURL(s, lc, skipBannerActivate, venue, region) {
    const regionsThatWantPLAUrls = ['SER'];

    if ((!s || s.trim().length === 0) && !skipBannerActivate) {
        // Notify that url is missing and provide web search to find website and gather data (provided for all editors)
        const hasOperator = venue.attributes.brand && W.model.categoryBrands.PARKING_LOT.includes(venue.attributes.brand);
        if (!venue.isParkingLot() || (venue.isParkingLot() && (regionsThatWantPLAUrls.includes(region) || hasOperator))) {
            _buttonBanner.urlMissing = new Flag.UrlMissing();
            if (_wl.urlWL || (venue.isParkingLot() && !hasOperator)) {
                _buttonBanner.urlMissing.severity = 0;
                _buttonBanner.urlMissing.WLactive = false;
            }
        }
        return s;
    }

    s = s.replace(/ \(.*/g, ''); // remove anything with parentheses after it
    s = s.replace(/ /g, ''); // remove any spaces
    let m = s.match(/^http:\/\/(.*)$/i); // remove http://
    if (m) { [, s] = m; }
    if (lc) { // lowercase the entire domain
        s = s.replace(/[^/]+/i, txt => ((txt === txt.toLowerCase()) ? txt : txt.toLowerCase()));
    } else { // lowercase only the www and com
        s = s.replace(/www\./i, 'www.');
        s = s.replace(/\.com/i, '.com');
    }
    m = s.match(/^(.*)\/pages\/welcome.aspx$/i); // remove unneeded terms
    if (m) { [, s] = m; }
    m = s.match(/^(.*)\/pages\/default.aspx$/i); // remove unneeded terms
    if (m) { [, s] = m; }
    // m = s.match(/^(.*)\/index.html$/i); // remove unneeded terms
    // if (m) { s = m[1]; }
    // m = s.match(/^(.*)\/index.htm$/i); // remove unneeded terms
    // if (m) { s = m[1]; }
    // m = s.match(/^(.*)\/index.php$/i); // remove unneeded terms
    // if (m) { s = m[1]; }
    m = s.match(/^(.*)\/$/i); // remove final slash
    if (m) { [, s] = m; }
    if (!s || s.trim().length === 0 || !/(^https?:\/\/)?\w+\.\w+/.test(s)) s = 'badURL';
    return s;
} // END normalizeURL function

// Only run the harmonization if a venue is selected
function harmonizePlace() {
    // Beta version for approved users only
    if (_IS_DEV_VERSION && !_USER.isBetaUser) {
        WazeWrap.Alerts.error(_SCRIPT_NAME, 'Please sign up to beta-test this script version.<br>Send a PM or Slack-DM to MapOMatic or Tonestertm, or post in the WMEPH forum thread. Thanks.');
        return;
    }
    // Only run if a single place is selected
    const venue = getSelectedVenue();
    if (venue) {
        _UPDATED_FIELDS.reset();
        blurAll(); // focus away from current cursor position
        _disableHighlightTest = true;
        harmonizePlaceGo(venue, 'harmonize');
        _disableHighlightTest = false;
        applyHighlightsTest(venue);
    } else { // Remove duplicate labels
        _dupeLayer.destroyFeatures();
    }
}

// Abstract flag classes.  Must be declared outside the "Flag" namespace.
class FlagBase {
    constructor(active, severity, message) {
        this.active = active;
        this.severity = severity;
        this.message = message;
    }
}
class ActionFlag extends FlagBase {
    constructor(active, severity, message, value, title) {
        super(active, severity, message);
        this.value = value;
        this.title = title;
    }

    // 5/19/2019 (mapomatic) This base class action function doesn't seem to be necessary.
    // action() { } // overwrite this
}
class WLFlag extends FlagBase {
    constructor(active, severity, message, WLactive, WLtitle, WLkeyName) {
        super(active, severity, message);
        this.WLactive = WLactive;
        this.WLtitle = WLtitle;
        this.WLkeyName = WLkeyName;
    }

    WLaction() {
        const venue = getSelectedVenue();
        if (whitelistAction(venue.attributes.id, this.WLkeyName)) {
            harmonizePlaceGo(venue, 'harmonize');
        }
    }
}
class WLActionFlag extends WLFlag {
    constructor(active, severity, message, value, title, WLactive, WLtitle, WLkeyName) {
        super(active, severity, message, WLactive, WLtitle, WLkeyName);
        this.value = value;
        this.title = title;
    }

    // 5/19/2019 (mapomatic) This base class action function doesn't seem to be necessary.
    // action() { } // overwrite this
}

// Namespace to keep these grouped.
let Flag = {
    HnDashRemoved: class extends FlagBase {
        constructor() { super(true, 0, 'Dash removed from house number. Verify'); }
    },
    FullAddressInference: class extends FlagBase {
        constructor() { super(true, 3, 'Missing address was inferred from nearby segments. Verify the address and run script again.'); }

        static eval(venue, addr, actions) {
            const result = {};
            if (!addr.state || !addr.country) {
                if (W.map.getZoom() < 4) {
                    if ($('#WMEPH-EnableIAZoom').prop('checked')) {
                        W.map.moveTo(getVenueLonLat(venue), 5);
                    } else {
                        WazeWrap.Alerts.error(_SCRIPT_NAME, 'No address and the state cannot be determined. Please zoom in and rerun the script. '
                            + 'You can enable autozoom for this type of case in the options.');
                    }
                    result.exit = true; //  don't run the rest of the script
                } else {
                    let inferredAddress = inferAddress(7); // Pull address info from nearby segments
                    if (inferredAddress && inferredAddress.attributes) inferredAddress = inferredAddress.attributes;

                    if (inferredAddress && inferredAddress.state && inferredAddress.country) {
                        if ($('#WMEPH-AddAddresses').prop('checked')) { // update the item's address if option is enabled
                            updateAddress(venue, inferredAddress, actions);
                            result.inferredAddress = inferredAddress;
                            _UPDATED_FIELDS.address.updated = true;
                            result.flag = new Flag.FullAddressInference();
                            result.noLock = true;
                        } else if (!['JUNCTION_INTERCHANGE'].includes(_newCategories[0])) {
                            _buttonBanner.cityMissing = new Flag.CityMissing();
                            result.noLock = true;
                        }
                    } else { //  if the inference doesn't work...
                        WazeWrap.Alerts.error(_SCRIPT_NAME, 'This place has no address data and the address cannot be inferred from nearby segments. Please edit the address and run WMEPH again.');
                        result.exit = true; //  don't run the rest of the script
                    }
                }
            }
            return result;
        }

        static evalHL(venue, addr) {
            let result = null;
            if (!addr.state || !addr.country) {
                if (venue.attributes.adLocked) {
                    result = 'adLock';
                } else {
                    const cat = venue.attributes.categories;
                    if (containsAny(cat, ['HOSPITAL_MEDICAL_CARE', 'HOSPITAL_URGENT_CARE', 'GAS_STATION'])) {
                        phlogdev('Unaddressed HUC/GS');
                        result = 5;
                    } else if (cat.includes('JUNCTION_INTERCHANGE')) {
                        result = 0;
                    } else {
                        result = 3;
                    }
                }
            }
            return result;
        }
    },
    NameMissing: class extends FlagBase {
        constructor() { super(true, 3, 'Name is missing.'); }
    },
    PlaIsPublic: class extends FlagBase {
        constructor() {
            super(true, 0, 'If this does not meet the requirements for a <a href="https://wazeopedia.waze.com/wiki/USA/Places/Parking_lot#Lot_Type" '
                + 'target="_blank" style="color:5a5a73">public parking lot</a>, change to:<br>');
        }
    },
    PlaNameMissing: class extends FlagBase {
        constructor() {
            super(true, 1, 'Name is missing.');
            this.message += _USER.rank < 3 ? ' Request an R3+ lock to confirm unnamed parking lot.' : ' Lock to 3+ to confirm unnamed parking lot.';
        }
    },
    PlaNameNonStandard: class extends WLFlag {
        constructor() {
            super(true, 2, 'Parking lot names typically contain words like "Parking", "Lot", and/or "Garage"', true, 'Whitelist non-standard PLA name', 'plaNameNonStandard');
        }

        static eval(venue, wl) {
            const result = { flag: null };
            if (!wl.plaNameNonStandard) {
                const { name } = venue.attributes;
                const state = venue.getAddress().getStateName();
                const re = state === 'Quebec' ? /\b(parking|stationnement)\b/i : /\b((park[ -](and|&|'?n'?)[ -]ride)|parking|lot|garage|ramp)\b/i;
                if (venue.isParkingLot() && name && !re.test(name)) {
                    result.flag = new Flag.PlaNameNonStandard();
                }
            }
            return result;
        }
    },
    IndianaLiquorStoreHours: class extends WLFlag {
        constructor() {
            super(true, 0, 'If this is a liquor store, check the hours.  As of Feb 2018, liquor stores in Indiana are allowed to be open between noon and 8 pm on Sunday.',
                true, 'Whitelist Indiana liquor store hours', 'indianaLiquorStoreHours');
        }

        static eval(venue, name, hpMode) {
            const result = { flag: null };
            if (hpMode.harmFlag && !_wl.indianaLiquorStoreHours
                && [/\bbeers?\b/, /\bwines?\b/, /\bliquor\b/, /\bspirits\b/].some(re => re.test(name))
                && !venue.attributes.openingHours.some(entry => entry.days.includes(0))
                && !venue.isResidential()) {
                const tempAddr = venue.getAddress();
                if (tempAddr && tempAddr.getStateName() === 'Indiana') {
                    result.flag = new Flag.IndianaLiquorStoreHours();
                }
            }
            return result;
        }
    },
    HoursOverlap: class extends FlagBase {
        constructor() { super(true, 3, 'Overlapping hours of operation. Place might not save.'); }
    },
    UnmappedRegion: class extends WLFlag {
        constructor() { super(true, 3, 'This category is usually not mapped in this region.', true, 'Whitelist unmapped category', 'unmappedRegion'); }
    },
    RestAreaName: class extends WLFlag {
        constructor() { super(true, 3, 'Rest area name is out of spec. Use the Rest Area wiki button below to view formats.', true, 'Whitelist rest area name', 'restAreaName'); }
    },
    RestAreaNoTransportation: class extends ActionFlag {
        constructor() { super(true, 2, 'Rest areas should not use the Transportation category.', 'Remove it?'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const ix = _newCategories.indexOf('TRANSPORTATION');
            if (ix > -1) {
                const venue = getSelectedVenue();
                _newCategories.splice(ix, 1);
                _UPDATED_FIELDS.categories.updated = true;
                addUpdateAction(venue, { categories: _newCategories });
                harmonizePlaceGo(venue, 'harmonize');
            }
        }
    },
    RestAreaGas: class extends FlagBase {
        constructor() { super(true, 3, 'Gas stations at Rest Areas should be separate area places.'); }
    },
    RestAreaScenic: class extends WLActionFlag {
        constructor() {
            super(true, 0, 'Verify that the "Scenic Overlook" category is appropriate for this rest area.  If not: ',
                'Remove it', 'Remove "Scenic Overlook" category.', true, 'Whitelist place', 'restAreaScenic');
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const ix = _newCategories.indexOf('SCENIC_LOOKOUT_VIEWPOINT');
            if (ix > -1) {
                const venue = getSelectedVenue();
                _newCategories.splice(ix, 1);
                _UPDATED_FIELDS.categories.updated = true;
                addUpdateAction(venue, { categories: _newCategories });
                harmonizePlaceGo(venue, 'harmonize');
            }
        }
    },
    RestAreaSpec: class extends WLActionFlag {
        constructor() {
            super(true, 3, 'Is this a rest area?',
                'Yes', 'Update with proper categories and services.', true, 'Whitelist place', 'restAreaSpec');
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            const actions = [];
            // update categories according to spec
            _newCategories = insertAtIX(_newCategories, 'REST_AREAS', 0);
            actions.push(new UpdateObject(venue, { categories: _newCategories }));
            _UPDATED_FIELDS.categories.updated = true;

            // make it 24/7
            actions.push(new UpdateObject(venue, {
                openingHours: [new OpeningHour({ days: [1, 2, 3, 4, 5, 6, 0], fromHour: '00:00', toHour: '00:00' })]
            }));
            _UPDATED_FIELDS.openingHours.updated = true;

            _servicesBanner.add247.checked = true;
            _servicesBanner.addParking.actionOn(actions); // add parking service
            _servicesBanner.addWheelchair.actionOn(actions); // add parking service
            _buttonBanner.restAreaSpec.active = false; // reset the display flag

            executeMultiAction(actions);

            _disableHighlightTest = true;
            harmonizePlaceGo(venue, 'harmonize');
            _disableHighlightTest = false;
            applyHighlightsTest(venue);
        }
    },
    GasMismatch: class extends WLFlag {
        constructor() {
            super(true, 3, '<a href="https://wazeopedia.waze.com/wiki/USA/Places/Gas_station#Name" target="_blank" class="red">Gas brand should typically be included in the place name.</a>',
                true, 'Whitelist gas brand / name mismatch', 'gasMismatch');
        }
    },
    GasUnbranded: class extends FlagBase {
        //  Unbranded is not used per wiki
        constructor() {
            super(true, 3, '"Unbranded" should not be used for the station brand. Change to correct brand or '
                + 'use the blank entry at the top of the brand list.');
        }

        static eval(venue, brand) {
            const result = { flag: null };
            if (venue.isGasStation() && brand === 'Unbranded') {
                result.flag = new Flag.GasUnbranded();
                result.noLock = true;
            }
            return result;
        }
    },
    GasMkPrim: class extends ActionFlag {
        constructor() {
            super(true, 3, 'Gas Station is not the primary category', 'Fix', 'Make the Gas Station '
                + 'category the primary category.');
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            // Insert/move Gas category in the first position
            _newCategories = insertAtIX(_newCategories, 'GAS_STATION', 0);
            _UPDATED_FIELDS.categories.updated = true;
            addUpdateAction(venue, { categories: _newCategories });
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    IsThisAPilotTravelCenter: class extends ActionFlag {
        constructor() { super(true, 0, 'Is this a "Travel Center"?', 'Yes', ''); }

        static eval(venue, hpMode, state2L, newName, actions) {
            const result = { flag: null, newName };
            if (hpMode.harmFlag && state2L === 'TN') {
                if (result.newName.toLowerCase().trim() === 'pilot') {
                    result.newName = 'Pilot Food Mart';
                    actions.push(new UpdateObject(venue, { name: result.newName }));
                    _UPDATED_FIELDS.name.updated = true;
                }
                if (result.newName.toLowerCase().trim() === 'pilot food mart') {
                    result.flag = new Flag.IsThisAPilotTravelCenter();
                }
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            _UPDATED_FIELDS.name.updated = true;
            addUpdateAction(venue, { name: 'Pilot Travel Center' });
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    HotelMkPrim: class extends WLActionFlag {
        constructor() {
            super(true, 3, 'Hotel category is not first', 'Fix', 'Make the Hotel category the primary category.',
                true, 'Whitelist hotel as secondary category', 'hotelMkPrim');
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            // Insert/move Hotel category in the first position
            const categories = insertAtIX(venue.attributes.categories.slice(), 'HOTEL', 0);
            _UPDATED_FIELDS.categories.updated = true;
            addUpdateAction(venue, { categories });
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    ChangeToPetVet: class extends WLActionFlag {
        constructor() {
            super(true, 3, 'Key words suggest this should be a Pet/Veterinarian category. Change?', 'Yes', 'Change to Pet/Veterinarian Category',
                true, 'Whitelist Pet/Vet category', 'changeHMC2PetVet');
        }

        static eval(name, categories) {
            const testName = name.toLowerCase().replace(/[^a-z]/g, ' ');
            const testNameWords = testName.split(' ');
            const result = { flag: null, lockOK: true };
            if ((categories.includes('HOSPITAL_URGENT_CARE') || categories.includes('DOCTOR_CLINIC'))
                && (containsAny(testNameWords, _animalFullMatch) || _animalPartMatch.some(match => testName.includes(match)))) {
                if (!_wl.changeHMC2PetVet) {
                    result.flag = new Flag.ChangeToPetVet();
                    result.lockOK = false;
                }
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            let updated = false;
            let categories = _.uniq(venue.attributes.categories.slice());
            categories.forEach((cat, idx) => {
                if (cat === 'HOSPITAL_URGENT_CARE' || cat === 'DOCTOR_CLINIC') {
                    categories[idx] = 'PET_STORE_VETERINARIAN_SERVICES';
                    updated = true;
                }
            });
            if (updated) {
                categories = _.uniq(categories);
                _UPDATED_FIELDS.categories.updated = true;
                addUpdateAction(venue, { categories });
            }
            harmonizePlaceGo(venue, 'harmonize'); // Rerun the script to update fields and lock
        }
    },
    NotASchool: class extends WLFlag {
        constructor() {
            super(true, 3, 'Key words suggest this should not be School category.',
                true, 'Whitelist School category', 'changeSchool2Offices');
        }

        static eval(name, categories) {
            const result = { flag: null, lockOK: true };
            const testName = name.toLowerCase().replace(/[^a-z]/g, ' ');
            const testNameWords = testName.split(' ');

            if (categories.includes('SCHOOL')
                && (containsAny(testNameWords, _schoolFullMatch) || _schoolPartMatch.some(match => testName.includes(match)))) {
                if (!_wl.changeSchool2Offices) {
                    result.flag = new Flag.NotASchool();
                    result.lockOK = false;
                }
            }
            return result;
        }
    },
    PointNotArea: class extends WLActionFlag {
        constructor() {
            super(true, 3, 'This category should be a point place.', 'Change to point', 'Change to point place',
                true, 'Whitelist point (not area)', 'pointNotArea');
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            if (venue.attributes.categories.includes('RESIDENCE_HOME')) {
                const centroid = venue.geometry.getCentroid();
                updateFeatureGeometry(venue, new OL.Geometry.Point(centroid.x, centroid.y));
            } else {
                $('.landmark label.point-btn').click();
            }
            harmonizePlaceGo(venue, 'harmonize'); // Rerun the script to update fields and lock
        }
    },
    AreaNotPoint: class extends WLActionFlag {
        constructor() {
            super(true, 3, 'This category should be an area place.', 'Change to area', 'Change to Area',
                true, 'Whitelist area (not point)', 'areaNotPoint');
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            updateFeatureGeometry(venue, venue.getPolygonGeometry());
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    HnMissing: class extends WLActionFlag {
        constructor(venue) {
            super(true, 3,
                'No HN: <input type="text" id="WMEPH-HNAdd" autocomplete="off" style="font-size:0.85em;width:100px;padding-left:2px;color:#000;" > ',
                'Add', 'Add HN to place', true, 'Whitelist empty HN', 'HNWL');
            this.venue = venue;
            this.noBannerAssemble = true;
            this.badInput = false;
        }

        action() {
            const newHN = $('#WMEPH-HNAdd').val().replace(/\s+/g, '');
            phlogdev(newHN);
            const hnTemp = newHN.replace(/[^\d]/g, '');
            const hnTempDash = newHN.replace(/[^\d-]/g, '');
            if (hnTemp > 0 && hnTemp < 1000000) {
                const action = new UpdateObject(this.venue, { houseNumber: hnTempDash });
                action.wmephDescription = `Changed house # to: ${hnTempDash}`;
                harmonizePlaceGo(this.venue, 'harmonize', [action]); // Rerun the script to update fields and lock
                _UPDATED_FIELDS.address.updated = true;
            } else {
                $('input#WMEPH-HNAdd').css({ backgroundColor: '#FDD' }).attr('title', 'Must be a number between 0 and 1000000');
                this.badInput = true;
            }
        }
    },
    // 2019-5-22 There's an issue in WME where it won't update the address displayed in the side panel
    // when the underlying model is updated.  I changed to the code below for a while, but we've
    // come up with a temporary fix using WW, so using the textbox entry should be OK now.
    // HnMissing: class extends WLActionFlag {
    //     constructor() { super(true, 3, 'No HN:', 'Edit address', 'Edit address to add HN.'); }

    //     // eslint-disable-next-line class-methods-use-this
    //     action() {
    //         $('.nav-tabs a[href="#landmark-edit-general"]').trigger('click');
    //         $('.landmark .full-address').click();
    //         $('input.house-number').focus();
    //     }
    // },
    HnNonStandard: class extends WLFlag {
        constructor() {
            super(true, 3, 'House number is non-standard.', true,
                'Whitelist non-standard HN', 'hnNonStandard');
        }
    },
    HNRange: class extends WLFlag {
        constructor() {
            super(true, 2, 'House number seems out of range for the street name. Verify.', true,
                'Whitelist HN range', 'HNRange');
        }
    },
    StreetMissing: class extends ActionFlag {
        constructor() { super(true, 3, 'No street:', 'Edit address', 'Edit address to add street.'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            $('.nav-tabs a[href="#landmark-edit-general"]').trigger('click');
            $('.landmark .full-address').click();
            if ($('.empty-street').prop('checked')) {
                $('.empty-street').click();
            }
            $('.street-name').focus();
        }
    },
    CityMissing: class extends ActionFlag {
        constructor() { super(true, 3, 'No city:', 'Edit address', 'Edit address to add city.'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            $('.nav-tabs a[href="#landmark-edit-general"]').trigger('click');
            $('.landmark .full-address').click();
            if ($('.empty-city').prop('checked')) {
                $('.empty-city').click();
            }
            $('.city-name').focus();
        }
    },
    BankType1: class extends FlagBase {
        constructor() { super(true, 3, 'Clarify the type of bank: the name has ATM but the primary category is Offices'); }
    },
    BankBranch: class extends ActionFlag {
        constructor() { super(true, 1, 'Is this a bank branch office? ', 'Yes', 'Is this a bank branch?'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            _newCategories = ['BANK_FINANCIAL', 'ATM']; // Change to bank and atm cats
            const tempName = _newName.replace(/[- (]*ATM[- )]*/g, ' ').replace(/^ /g, '').replace(/ $/g, ''); // strip ATM from name if present
            _newName = tempName;
            W.model.actionManager.add(new UpdateObject(venue, { name: _newName, categories: _newCategories }));
            if (tempName !== _newName) _UPDATED_FIELDS.name.updated = true;
            _UPDATED_FIELDS.categories.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    StandaloneATM: class extends ActionFlag {
        constructor() { super(true, 2, 'Or is this a standalone ATM? ', 'Yes', 'Is this a standalone ATM with no bank branch?'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            if (!_newName.includes('ATM')) {
                _newName += ' ATM';
                _UPDATED_FIELDS.name.updated = true;
            }
            _newCategories = ['ATM']; // Change to ATM only
            W.model.actionManager.add(new UpdateObject(venue, { name: _newName, categories: _newCategories }));
            _UPDATED_FIELDS.categories.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    BankCorporate: class extends ActionFlag {
        constructor() { super(true, 1, 'Or is this the bank\'s corporate offices?', 'Yes', 'Is this the bank\'s corporate offices?'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            _newCategories = ['OFFICES']; // Change to offices category
            const tempName = _newName.replace(/[- (]*atm[- )]*/ig, ' ').replace(/^ /g, '').replace(/ $/g, '').replace(/ {2,}/g, ' '); // strip ATM from name if present
            _newName = tempName;
            W.model.actionManager.add(new UpdateObject(venue, { name: `${_newName} - Corporate Offices`, categories: _newCategories }));
            if (_newName !== tempName) _UPDATED_FIELDS.name.updated = true;
            _UPDATED_FIELDS.categories.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    CatPostOffice: class extends FlagBase {
        constructor() {
            super(true, 0,
                'The Post Office category is reserved for certain USPS locations. Please be sure to follow <a href="https://wazeopedia.waze.com/wiki/USA/Places/Post_Office" style="color:#3a3a3a;" target="_blank">the guidelines</a>.');
        }
    },
    IgnEdited: class extends FlagBase {
        constructor() { super(true, 2, 'Last edited by an IGN editor'); }
    },
    WazeBot: class extends ActionFlag {
        constructor() {
            super(true, 2,
                'Edited last by an automated process. Please verify information is correct.', 'Nudge', 'If no other properties need to be updated, click to nudge the place (force an edit).');
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            nudgeVenue(venue);
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    ParentCategory: class extends WLFlag {
        constructor() {
            super(true, 2, 'This parent category is usually not mapped in this region.',
                true, 'Whitelist parent Category', 'parentCategory');
        }
    },
    CheckDescription: class extends FlagBase {
        constructor() {
            super(true, 2,
                'Description field already contained info; PNH description was added in front of existing. Check for inconsistency or duplicate info.');
        }
    },
    Overlapping: class extends FlagBase {
        constructor() { super(true, 2, 'Place points are stacked up.'); }
    },
    SuspectDesc: class extends WLFlag {
        constructor() { super(true, 2, 'Description field might contain copyrighted info.', true, 'Whitelist description', 'suspectDesc'); }
    },
    ResiTypeName: class extends WLFlag {
        constructor() {
            super(true, 2, 'The place name suggests a residential place or personalized place of work.  Please verify.',
                true, 'Whitelist Residential-type name', 'resiTypeName');
        }
    },
    Mismatch247: class extends FlagBase {
        constructor() { super(true, 2, 'Hours of operation listed as open 24hrs but not for all 7 days.'); }
    },
    PhoneInvalid: class extends FlagBase {
        constructor() { super(true, 2, 'Phone invalid.'); }
    },
    AreaNotPointMid: class extends WLFlag {
        constructor() {
            super(true, 2, 'This category is usually an area place, but can be a point in some cases. Verify if point is appropriate.',
                true, 'Whitelist area (not point)', 'areaNotPoint');
        }
    },
    PointNotAreaMid: class extends WLFlag {
        constructor() {
            super(true, 2, 'This category is usually a point place, but can be an area in some cases. Verify if area is appropriate.',
                true, 'Whitelist point (not area)', 'pointNotArea');
        }
    },
    LongURL: class extends WLActionFlag {
        constructor(placePL) {
            super(true, 1, 'Existing URL doesn\'t match the suggested PNH URL. Use the Website button below to verify that existing URL is valid.  If not:',
                'Use PNH URL', 'Change URL to the PNH standard', true, 'Whitelist existing URL', 'longURL');
            this.placePL = placePL;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            if (!isNullOrWhitespace(_tempPNHURL)) {
                W.model.actionManager.add(new UpdateObject(venue, { url: _tempPNHURL }));
                _UPDATED_FIELDS.url.updated = true;
                harmonizePlaceGo(venue, 'harmonize');
                _updateURL = true;
                // // if the category doesn't translate, then pop an alert that will make a forum post to the thread
                // reportError({
                //     subject: 'WMEPH URL comparison Error report',
                //     message: `Error report: URL comparison failed for "${venue.attributes.name}"\nPermalink: ${this.placePL}`
                // });
            } else {
                WazeWrap.Alerts.confirm(
                    _SCRIPT_NAME,
                    'WMEPH: URL Matching Error!<br>Click OK to report this error',
                    () => {
                        reportError({
                            subject: 'WMEPH URL comparison Error report',
                            message: `Error report: URL comparison failed for "${venue.attributes.name}"\nPermalink: ${this.placePL}`
                        });
                    },
                    () => { }
                );
            }
        }
    },
    GasNoBrand: class extends FlagBase {
        constructor() {
            super(true, 1, 'Lock to region standards to verify no gas brand.');
        }

        static eval(venue, brand) {
            const result = { flag: null };
            if (venue.isGasStation() && !brand) {
                result.flag = new Flag.GasNoBrand();
                result.noLock = true;
            }
            return result;
        }
    },
    SubFuel: class extends WLFlag {
        constructor() {
            super(true, 1, 'Make sure this place is for the gas station itself and not the main store building.  Otherwise undo and check the categories.',
                true, 'Whitelist no gas brand', 'subFuel');
        }
    },
    AreaNotPointLow: class extends WLFlag {
        constructor() {
            super(true, 1, 'This category is usually an area place, but can be a point in some cases. Verify if point is appropriate.',
                true, 'Whitelist area (not point)', 'areaNotPoint');
        }
    },
    PointNotAreaLow: class extends WLFlag {
        constructor() {
            super(true, 1, 'This category is usually a point place, but can be an area in some cases. Verify if area is appropriate.',
                true, 'Whitelist point (not area)', 'pointNotArea');
        }
    },
    FormatUSPS: class extends FlagBase {
        constructor() { super(true, 1, 'Name the post office according to this region\'s <a href="https://wazeopedia.waze.com/wiki/USA/Places/Post_Office" style="color:#3232e6" target="_blank"> standards for USPS post offices</a>'); }
    },
    MissingUSPSAlt: class extends FlagBase {
        constructor() { super(true, 1, 'USPS post offices must have an alternate name of "USPS".'); }
    },
    MissingUSPSZipAlt: class extends WLActionFlag {
        constructor() {
            super(true, 1,
                'No <a href="https://wazeopedia.waze.com/wiki/USA/Places/Post_Office" style="color:#3232e6;" target="_blank">ZIP code alt name</a>: <input type="text" id="WMEPH-zipAltNameAdd" autocomplete="off" style="font-size:0.85em;width:65px;padding-left:2px;color:#000;" title="Enter the ZIP code and click Add">',
                'Add', true, 'Whitelist missing USPS zip alt name', 'missingUSPSZipAlt');
            this.noBannerAssemble = true;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const $input = $('input#WMEPH-zipAltNameAdd');
            const zip = $input.val().trim();
            if (zip) {
                if (/^\d{5}/.test(zip)) {
                    const venue = getSelectedVenue();
                    const aliases = [].concat(venue.attributes.aliases);
                    // Make sure zip hasn't already been added.
                    if (!aliases.includes(zip)) {
                        aliases.push(zip);
                        W.model.actionManager.add(new UpdateObject(venue, { aliases }));
                        harmonizePlaceGo(venue, 'harmonize');
                    } else {
                        $input.css({ backgroundColor: '#FDD' }).attr('title', 'Zip code alt name already exists');
                    }
                } else {
                    $input.css({ backgroundColor: '#FDD' }).attr('title', 'Zip code format error');
                }
            }
        }
    },
    MissingUSPSDescription: class extends WLFlag {
        constructor() {
            super(true, 1, 'The first line of the description for a <a href="https://wazeopedia.waze.com/wiki/USA/Places/Post_Office" style="color:#3232e6" target="_blank">USPS post office</a> must be CITY, STATE ZIP, e.g. "Lexington, KY 40511"',
                true, 'Whitelist missing USPS address line in description', 'missingUSPSDescription');
        }
    },
    CatHotel: class extends FlagBase {
        constructor(pnhName) { super(true, 0, `Check hotel website for any name localization (e.g. ${pnhName} - Tampa Airport).`); }
    },
    LocalizedName: class extends WLFlag {
        constructor() {
            super(true, 1, 'Place needs localization information', true, 'Whitelist localization', 'localizedName');
        }

        static eval(name, nameSuffix, specCase, displayNote) {
            const result = { flag: null, updatePnhName: true };
            const match = specCase.match(/^checkLocalization<>(.+)/i);
            if (match) {
                result.updatePnhName = false;
                const [, baseName] = specCase.match(/^checkLocalization<>(.+)/i);
                const baseNameRE = new RegExp(baseName, 'g');
                if ((name + (nameSuffix || '')).match(baseNameRE) === null) {
                    result.flag = new Flag.LocalizedName();
                    if (_wl.localizedName) {
                        result.flag.WLactive = false;
                        result.flag.severity = 0;
                    }
                    if (displayNote) {
                        result.flag.message = displayNote;
                    }
                }
            }
            return result;
        }
    },
    SpecCaseMessage: class extends FlagBase {
        constructor(message) { super(true, 0, message); }
    },
    PnhCatMess: class extends ActionFlag {
        constructor(message) { super(true, 0, message, null, null); }

        static eval(message, categories, hpMode) {
            const result = { flag: null };
            if (hpMode.harmFlag && !isNullOrWhitespace(message)) {
                result.flag = new Flag.PnhCatMess(message);
                if (categories.includes('HOSPITAL_URGENT_CARE')) {
                    result.flag.value = 'Change to Doctor/Clinic';
                    result.flag.actionType = 'changeToDoctorClinic';
                }
            }
            return result;
        }

        action() {
            const venue = getSelectedVenue();
            if (this.actionType === 'changeToDoctorClinic') {
                const categories = _.uniq(venue.attributes.categories.slice());
                const idx = categories.indexOf('HOSPITAL_URGENT_CARE');
                if (idx > -1) {
                    categories[idx] = 'DOCTOR_CLINIC';
                    _UPDATED_FIELDS.categories.updated = true;
                    addUpdateAction(venue, { categories });
                    harmonizePlaceGo(venue, 'harmonize');
                }
            }
        }
    },
    SpecCaseMessageLow: class extends FlagBase {
        constructor(message) { super(true, 0, message); }
    },
    ExtProviderMissing: class extends ActionFlag {
        constructor() {
            super(true, 3, 'No Google link', 'Nudge', 'If no other properties need to be updated, click to nudge the place (force an edit).');
            this.value2 = 'Add';
            this.title2 = 'Add a link to a Google place';
        }

        static eval(venue, isLocked, categories, userRank, ignoreParkingLots, actions) {
            const result = { flag: null };
            if (userRank >= 2 && venue.areExternalProvidersEditable() && !(venue.isParkingLot() && ignoreParkingLots)) {
                const catsToIgnore = ['BRIDGE', 'TUNNEL', 'JUNCTION_INTERCHANGE', 'NATURAL_FEATURES', 'ISLAND',
                    'SEA_LAKE_POOL', 'RIVER_STREAM', 'CANAL', 'SWAMP_MARSH'];
                if (!categories.some(cat => catsToIgnore.includes(cat))) {
                    const provIDs = venue.attributes.externalProviderIDs;
                    if (!(provIDs && provIDs.length)) {
                        result.flag = new Flag.ExtProviderMissing();
                        if (isLocked) {
                            let lastUpdated;
                            if (venue.isNew()) {
                                lastUpdated = Date.now();
                            } else if (venue.attributes.updatedOn) {
                                lastUpdated = venue.attributes.updatedOn;
                            } else {
                                lastUpdated = venue.attributes.createdOn;
                            }
                            const weeksSinceLastUpdate = (Date.now() - lastUpdated) / 604800000;
                            if (weeksSinceLastUpdate >= 26 && !venue.isUpdated() && (!actions || actions.length === 0)) {
                                result.flag.severity = 3;
                                result.flag.message += ' and place has not been edited for over 6 months. Edit a property (or nudge) and save to reset the 6 month timer: ';
                            } else {
                                result.flag.severity = 0;
                                result.flag.message += ': ';
                                delete result.flag.value;
                            }
                        } else {
                            result.flag.severity = 0;
                            result.flag.message += ': ';
                            delete result.flag.value;
                        }
                    }
                }
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            nudgeVenue(venue);
            harmonizePlaceGo(venue, 'harmonize'); // Rerun the script to update fields and lock
        }

        // eslint-disable-next-line class-methods-use-this
        action2() {
            const venue = getSelectedVenue();
            $('div.external-providers-view a').focus().click();
            setTimeout(() => {
                $('a[href="#landmark-edit-general"]').click();
                $('.external-providers-view a.add').focus().mousedown();
                $('div.external-providers-view > div > ul > div > li > div > a').last().mousedown();
                setTimeout(() => $('.select2-input').last().focus().val(venue.attributes.name).trigger('input'), 100);
            }, 100);
        }
    },
    UrlMissing: class extends WLActionFlag {
        constructor() {
            super(
                true,
                1,
                'No URL: <input type="text" id="WMEPH-UrlAdd" autocomplete="off" style="font-size:0.85em;width:100px;padding-left:2px;color:#000;">',
                'Add',
                'Add URL to place',
                true,
                'Whitelist empty URL',
                'urlWL'
            );
            this.noBannerAssemble = true;
            this.badInput = false;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            const newUrl = normalizeURL($('#WMEPH-UrlAdd').val(), true, false, venue);
            if ((!newUrl || newUrl.trim().length === 0) || newUrl === 'badURL') {
                $('input#WMEPH-UrlAdd').css({ backgroundColor: '#FDD' }).attr('title', 'Invalid URL format');
                // this.badInput = true;
            } else {
                phlogdev(newUrl);
                W.model.actionManager.add(new UpdateObject(venue, { url: newUrl }));
                _UPDATED_FIELDS.url.updated = true;
                harmonizePlaceGo(venue, 'harmonize');
            }
        }
    },
    BadAreaCode: class extends WLActionFlag {
        constructor(textValue, outputFormat) {
            super(true, 1, `Area Code mismatch:<br><input type="text" id="WMEPH-PhoneAdd" autocomplete="off" style="font-size:0.85em;width:100px;padding-left:2px;color:#000;" value="${textValue || ''}">`,
                'Update', 'Update phone #', true, 'Whitelist the area code', 'aCodeWL');
            this.outputFormat = outputFormat;
            this.noBannerAssemble = true;
        }

        action() {
            const venue = getSelectedVenue();
            const newPhone = normalizePhone($('#WMEPH-PhoneAdd').val(), this.outputFormat, 'inputted', venue);
            if (newPhone === 'badPhone') {
                $('input#WMEPH-PhoneAdd').css({ backgroundColor: '#FDD' }).attr('title', 'Invalid phone # format');
                this.badInput = true;
            } else {
                this.badInput = false;
                phlogdev(newPhone);
                W.model.actionManager.add(new UpdateObject(venue, { phone: newPhone }));
                _UPDATED_FIELDS.phone.updated = true;
                harmonizePlaceGo(venue, 'harmonize');
            }
        }
    },
    PhoneMissing: class extends WLActionFlag {
        constructor(venue, hasOperator, wl, outputFormat, isPLA) {
            super(true, 1, 'No ph#: <input type="text" id="WMEPH-PhoneAdd" autocomplete="off" style="font-size:0.85em;width:100px;padding-left:2px;color:#000;">',
                'Add', 'Add phone to place', true, 'Whitelist empty phone', 'phoneWL');
            this.noBannerAssemble = true;
            this.badInput = false;
            this.outputFormat = outputFormat;
            this.venue = venue;
            if ((isPLA && !hasOperator) || wl[this.WLkeyName]) {
                this.severity = 0;
                this.WLactive = false;
            }
        }

        static get _regionsThatWantPlaPhones() { return ['SER']; }

        static eval(venue, wl, region, outputFormat) {
            const hasOperator = venue.attributes.brand && W.model.categoryBrands.PARKING_LOT.includes(venue.attributes.brand);
            const isPLA = venue.isParkingLot();
            let flag = null;
            if (!isPLA || (isPLA && (this._regionsThatWantPlaPhones.includes(region) || hasOperator))) {
                flag = new Flag.PhoneMissing(venue, hasOperator, wl, outputFormat, isPLA);
            }
            return flag;
        }

        action() {
            const newPhone = normalizePhone($('#WMEPH-PhoneAdd').val(), this.outputFormat, 'inputted', this.venue);
            if (newPhone === 'badPhone') {
                $('input#WMEPH-PhoneAdd').css({ backgroundColor: '#FDD' }).attr('title', 'Invalid phone # format');
                this.badInput = true;
            } else {
                this.badInput = false;
                phlogdev(newPhone);
                W.model.actionManager.add(new UpdateObject(this.venue, { phone: newPhone }));
                _UPDATED_FIELDS.phone.updated = true;
                harmonizePlaceGo(this.venue, 'harmonize');
            }
        }
    },
    NoHours: class extends WLFlag {
        constructor() { super(true, 1, getHoursHtml('No hours'), true, 'Whitelist "No hours"', 'noHours'); }

        // eslint-disable-next-line class-methods-use-this
        getTitle(parseResult) {
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
            const venue = getSelectedVenue();
            let pasteHours = $('#WMEPH-HoursPaste').val();
            if (pasteHours === _DEFAULT_HOURS_TEXT) {
                return;
            }
            phlogdev(pasteHours);
            pasteHours += !replaceAllHours ? `,${getOpeningHours(venue).join(',')}` : '';
            $('.nav-tabs a[href="#landmark-edit-more-info"]').tab('show');
            const parser = new HoursParser();
            const parseResult = parser.parseHours(pasteHours);
            if (parseResult.hours && !parseResult.overlappingHours && !parseResult.sameOpenAndCloseTimes && !parseResult.parseError) {
                phlogdev(parseResult.hours);
                W.model.actionManager.add(new UpdateObject(venue, { openingHours: parseResult.hours }));
                _UPDATED_FIELDS.openingHours.updated = true;
                $('#WMEPH-HoursPaste').val(_DEFAULT_HOURS_TEXT);
                harmonizePlaceGo(venue, 'harmonize');
            } else {
                phlog('Can\'t parse those hours');
                this.severity = 1;
                this.WLactive = true;
                $('#WMEPH-HoursPaste').css({ 'background-color': '#FDD' }).attr({ title: this.getTitle(parseResult) });
            }
        }

        addHoursAction() {
            this.applyHours();
        }

        replaceHoursAction() {
            this.applyHours(true);
        }
    },
    PlaLotTypeMissing: class extends FlagBase {
        constructor() { super(true, 3, 'Lot type: '); }

        static eval(venue, hpMode) {
            const result = { flag: null };
            if (venue.isParkingLot()) {
                const catAttr = venue.attributes.categoryAttributes;
                const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                if (!parkAttr || !parkAttr.parkingType) {
                    result.flag = new Flag.PlaLotTypeMissing();
                    if (hpMode.harmFlag) {
                        result.noLock = true;
                        result.flag.message += [['PUBLIC', 'Public'], ['RESTRICTED', 'Restricted'], ['PRIVATE', 'Private']].map(
                            btnInfo => $('<button>', { class: 'wmeph-pla-lot-type-btn btn btn-default btn-xs wmeph-btn', 'data-lot-type': btnInfo[0] })
                                .text(btnInfo[1])
                                .css({
                                    padding: '3px', height: '20px', lineHeight: '0px', marginRight: '2px', marginBottom: '1px'
                                })
                                .prop('outerHTML')
                        ).join('');
                    }
                }
            }
            return result;
        }
    },
    PlaCostTypeMissing: class extends FlagBase {
        constructor() { super(true, 1, 'Parking cost: '); }

        static eval(venue, hpMode) {
            const result = { flag: null };
            if (venue.isParkingLot()) {
                const catAttr = venue.attributes.categoryAttributes;
                const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                if (!parkAttr || !parkAttr.costType || parkAttr.costType === 'UNKNOWN') {
                    result.flag = new Flag.PlaCostTypeMissing();
                    if (hpMode.harmFlag) {
                        [['FREE', 'Free', 'Free'], ['LOW', '$', 'Low'], ['MODERATE', '$$', 'Moderate'], ['EXPENSIVE', '$$$', 'Expensive']].forEach(btnInfo => {
                            result.flag.message += $('<button>', { id: `wmeph_${btnInfo[0]}`, class: 'wmeph-pla-cost-type-btn btn btn-default btn-xs wmeph-btn', title: btnInfo[2] })
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
                        result.noLock = true;
                    }
                }
            }
            return result;
        }
    },
    PlaPaymentTypeMissing: class extends ActionFlag {
        constructor() { super(true, 1, 'Parking isn\'t free.  Select payment type(s) from the "More info" tab. ', 'Go there'); }

        static eval(venue) {
            const result = { flag: null };
            if (venue.isParkingLot()) {
                const catAttr = venue.attributes.categoryAttributes;
                const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                if (parkAttr && parkAttr.costType && parkAttr.costType !== 'FREE' && parkAttr.costType !== 'UNKNOWN' && (!parkAttr.paymentType || !parkAttr.paymentType.length)) {
                    result.flag = new Flag.PlaPaymentTypeMissing();
                }
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            $('a[href="#landmark-edit-more-info"]').click();
            $('#payment-checkbox-ELECTRONIC_PASS').focus();
        }
    },
    PlaLotElevationMissing: class extends ActionFlag {
        constructor() { super(true, 1, 'No lot elevation. Is it street level?', 'Yes', 'Click if street level parking only, or select other option(s) in the More Info tab.'); }

        static eval(venue) {
            const result = { flag: null };
            if (venue.isParkingLot()) {
                const catAttr = venue.attributes.categoryAttributes;
                const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                if (!parkAttr || !parkAttr.lotType || parkAttr.lotType.length === 0) {
                    result.flag = new Flag.PlaLotElevationMissing();
                    result.noLock = true;
                }
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            const existingAttr = venue.attributes.categoryAttributes.PARKING_LOT;
            const newAttr = {};
            if (existingAttr) {
                Object.keys(existingAttr).forEach(key => {
                    let value = existingAttr[key];
                    if (Array.isArray(value)) value = [].concat(value);
                    newAttr[key] = value;
                });
            }
            newAttr.lotType = ['STREET_LEVEL'];
            W.model.actionManager.add(new UpdateObject(venue, { categoryAttributes: { PARKING_LOT: newAttr } }));
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    PlaSpaces: class extends FlagBase {
        constructor() {
            super(true, 0, '# of parking spaces is set to 1-10.<br><b><i>If appropriate</i></b>, select another option:');
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
            this.suffixMessage = $btnDiv.prop('outerHTML');
        }

        static eval(venue, hpMode) {
            const result = { flag: null };
            if (hpMode.harmFlag && venue.isParkingLot()) {
                const catAttr = venue.attributes.categoryAttributes;
                const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                if (!parkAttr || !parkAttr.estimatedNumberOfSpots || parkAttr.estimatedNumberOfSpots === 'R_1_TO_10') {
                    result.flag = new Flag.PlaSpaces();
                }
            }
            return result;
        }
    },
    NoPlaStopPoint: class extends ActionFlag {
        constructor() { super(true, 1, 'Entry/exit point has not been created.', 'Add point', 'Add an entry/exit point'); }

        static eval(venue) {
            const result = { flag: null };
            if (venue.isParkingLot() && (!venue.attributes.entryExitPoints || !venue.attributes.entryExitPoints.length)) {
                result.flag = new Flag.NoPlaStopPoint();
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            $('.navigation-point-view .add-button').click();
            harmonizePlaceGo(getSelectedVenue(), 'harmonize');
        }
    },
    PlaStopPointUnmoved: class extends FlagBase {
        constructor() { super(true, 1, 'Entry/exit point has not been moved.'); }

        static eval(venue) {
            const result = { flag: null };
            const attr = venue.attributes;
            if (venue.isParkingLot() && attr.entryExitPoints && attr.entryExitPoints.length) {
                const stopPoint = attr.entryExitPoints[0].getPoint();
                const areaCenter = attr.geometry.getCentroid();
                if (stopPoint.equals(areaCenter)) {
                    result.flag = new Flag.PlaStopPointUnmoved();
                }
            }
            return result;
        }
    },
    PlaCanExitWhileClosed: class extends ActionFlag {
        constructor() { super(true, 0, 'Can cars exit when lot is closed? ', 'Yes', ''); }

        static eval(venue, hpMode) {
            const result = { flag: null };
            if (hpMode.harmFlag && venue.isParkingLot()) {
                const catAttr = venue.attributes.categoryAttributes;
                const parkAttr = catAttr ? catAttr.PARKING_LOT : undefined;
                if (parkAttr && !parkAttr.canExitWhileClosed && ($('#WMEPH-ShowPLAExitWhileClosed').prop('checked') || !(isAlwaysOpen(venue) || venue.attributes.openingHours.length === 0))) {
                    result.flag = new Flag.PlaCanExitWhileClosed();
                }
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            const existingAttr = venue.attributes.categoryAttributes.PARKING_LOT;
            const newAttr = {};
            if (existingAttr) {
                Object.keys(existingAttr).forEach(prop => {
                    let value = existingAttr[prop];
                    if (Array.isArray(value)) value = [].concat(value);
                    newAttr[prop] = value;
                });
            }
            newAttr.canExitWhileClosed = true;
            W.model.actionManager.add(new UpdateObject(venue, { categoryAttributes: { PARKING_LOT: newAttr } }));
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    PlaHasAccessibleParking: class extends ActionFlag {
        constructor() { super(true, 0, 'Does this lot have disability parking? ', 'Yes', ''); }

        static eval(venue, hpMode) {
            const result = { flag: null };
            if (hpMode.harmFlag && venue.isParkingLot()) {
                const { services } = venue.attributes;
                if (!(services && services.includes('DISABILITY_PARKING'))) {
                    result.flag = new Flag.PlaHasAccessibleParking();
                }
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            let { services } = venue.attributes;
            if (services) {
                services = [].concat(services);
            } else {
                services = [];
            }
            services.push('DISABILITY_PARKING');
            W.model.actionManager.add(new UpdateObject(venue, { services }));
            _UPDATED_FIELDS.services_DISABILITY_PARKING.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    AllDayHoursFixed: class extends FlagBase {
        constructor() { super(true, 0, 'Hours were changed from 00:00-23:59 to "All Day"'); }

        static eval(venue, hpMode, actions) {
            const hoursEntries = venue.attributes.openingHours;
            const newHoursEntries = [];
            let updateHours = false;
            let flag = null;
            for (let i = 0, len = hoursEntries.length; i < len; i++) {
                const newHoursEntry = new OpeningHour({
                    days: [].concat(hoursEntries[i].days), fromHour: hoursEntries[i].fromHour, toHour: hoursEntries[i].toHour
                });
                if (newHoursEntry.toHour === '23:59' && /^0?0:00$/.test(newHoursEntry.fromHour)) {
                    if (hpMode.hlFlag) {
                        // Just return a "placeholder" flag to highlight the place.
                        flag = new FlagBase(true, 2, 'invalid all day hours');
                        break;
                    } else if (hpMode.harmFlag) {
                        updateHours = true;
                        newHoursEntry.toHour = '00:00';
                        newHoursEntry.fromHour = '00:00';
                    }
                }
                newHoursEntries.push(newHoursEntry);
            }
            if (updateHours) {
                addUpdateAction(venue, { openingHours: newHoursEntries }, actions);
                _UPDATED_FIELDS.openingHours.updated = true;
                flag = new Flag.AllDayHoursFixed();
            }
            return flag;
        }
    },
    ResiTypeNameSoft: class extends FlagBase {
        constructor() { super(true, 0, 'The place name suggests a residential place or personalized place of work.  Please verify.'); }
    },
    LocalURL: class extends FlagBase {
        constructor() { super(true, 0, 'Some locations for this business have localized URLs, while others use the primary corporate site. Check if a local URL applies to this location.'); }
    },
    LockRPP: class extends ActionFlag {
        constructor() { super(true, 0, 'Lock this residential point?', 'Lock', 'Lock the residential point'); }

        action() {
            const venue = getSelectedVenue();
            let RPPlevelToLock = $('#RPPLockLevel :selected').val() || _defaultLockLevel + 1;
            phlogdev(`RPPlevelToLock: ${RPPlevelToLock}`);

            RPPlevelToLock -= 1;
            W.model.actionManager.add(new UpdateObject(venue, { lockRank: RPPlevelToLock }));
            // no field highlight here
            this.message = `Current lock: ${parseInt(venue.attributes.lockRank, 10) + 1}. ${_rppLockString} ?`;
        }
    },
    AddAlias: class extends ActionFlag {
        constructor(specCases, optionalAlias) {
            super(true, 0, `Is there a ${optionalAlias} at this location?`, 'Yes', `Add ${optionalAlias}`);
            this.specCases = specCases;
            this.optionalAlias = optionalAlias;
        }

        static eval(specCase, specCases, aliases) {
            const result = { flag: null };
            const match = specCase.match(/^optionAltName<>(.+)/i);
            if (match) {
                const [, optionalAlias] = match;
                if (!aliases.includes(optionalAlias)) {
                    result.flag = new Flag.AddAlias(specCases, optionalAlias);
                }
            }
            return result;
        }

        action() {
            const venue = getSelectedVenue();
            let aliases = insertAtIX(venue.attributes.aliases.slice(), this.optionalAlias, 0);
            if (this.specCases.includes('altName2Desc') && !venue.attributes.description.toUpperCase().includes(this.optionalAlias.toUpperCase())) {
                const description = `${this.optionalAlias}\n${venue.attributes.description}`;
                addUpdateAction(venue, { description });
                _UPDATED_FIELDS.description.updated = true;
            }
            aliases = removeSFAliases(name, aliases);
            addUpdateAction(venue, { aliases });
            _UPDATED_FIELDS.aliases.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    AddCat2: class extends ActionFlag {
        constructor() { super(true, 0, '', 'Yes', ''); }

        static eval() {
            const result = { flag: null };
            result.flag = new Flag.AddCat2();
            return result;
        }

        action() {
            const venue = getSelectedVenue();
            _newCategories.push(this.altCategory);
            W.model.actionManager.add(new UpdateObject(venue, { categories: _newCategories }));
            _UPDATED_FIELDS.categories.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    AddPharm: class extends ActionFlag {
        constructor() { super(true, 0, 'Is there a Pharmacy at this location?', 'Yes', 'Add Pharmacy category'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            _newCategories = insertAtIX(_newCategories, 'PHARMACY', 1);
            W.model.actionManager.add(new UpdateObject(venue, { categories: _newCategories }));
            _UPDATED_FIELDS.categories.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    AddSuper: class extends ActionFlag {
        constructor() { super(true, 0, 'Does this location have a supermarket?', 'Yes', 'Add Supermarket category'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            _newCategories = insertAtIX(_newCategories, 'SUPERMARKET_GROCERY', 1);
            W.model.actionManager.add(new UpdateObject(venue, { categories: _newCategories }));
            _UPDATED_FIELDS.categories.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    AppendAMPM: class extends ActionFlag {
        constructor() { super(true, 0, 'Is there an ampm at this location?', 'Yes', 'Add ampm to the place'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            _newCategories = insertAtIX(_newCategories, 'CONVENIENCE_STORE', 1);
            _newName = 'ARCO ampm';
            _newURL = 'ampm.com';
            W.model.actionManager.add(new UpdateObject(venue, { name: _newName, url: _newURL, categories: _newCategories }));
            _UPDATED_FIELDS.name.updated = true;
            _UPDATED_FIELDS.url.updated = true;
            _UPDATED_FIELDS.categories.updated = true;
            _buttonBanner.appendAMPM.active = false; // reset the display flag
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    AddATM: class extends ActionFlag {
        constructor() { super(true, 0, 'ATM at location? ', 'Yes', 'Add the ATM category to this place'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            _newCategories = insertAtIX(_newCategories, 'ATM', 1); // Insert ATM category in the second position
            W.model.actionManager.add(new UpdateObject(venue, { categories: _newCategories }));
            _UPDATED_FIELDS.categories.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    AddConvStore: class extends ActionFlag {
        constructor() { super(true, 0, 'Add convenience store category? ', 'Yes', 'Add the Convenience Store category to this place'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            _newCategories = insertAtIX(_newCategories, 'CONVENIENCE_STORE', 1); // Insert C.S. category in the second position
            W.model.actionManager.add(new UpdateObject(venue, { categories: _newCategories }));
            _UPDATED_FIELDS.categories.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    IsThisAPostOffice: class extends ActionFlag {
        constructor() {
            super(true, 0, 'Is this a <a href="https://wazeopedia.waze.com/wiki/USA/Places/Post_Office" target="_blank" style="color:#3a3a3a">USPS post office</a>? ',
                'Yes', 'Is this a USPS location?');
        }

        static eval(venue, newName) {
            const result = { flag: null };
            const cleanName = newName.toUpperCase().replace(/[/\-.]/g, '');
            if (/\bUSP[OS]\b|\bpost(al)?\s+(service|office)\b/i.test(cleanName)) {
                result.flag = new Flag.IsThisAPostOffice();
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            _newCategories = insertAtIX(_newCategories, 'POST_OFFICE', 0);
            W.model.actionManager.add(new UpdateObject(venue, { categories: _newCategories }));
            _UPDATED_FIELDS.categories.updated = true;
            harmonizePlaceGo(venue, 'harmonize');
        }
    },
    ChangeToHospitalUrgentCare: class extends WLActionFlag {
        constructor(severity, message) {
            super(true, severity, message, 'Change to Hospital / Urgent Care', 'Change category to Hospital / Urgent Care',
                false, 'Whitelist category', 'changetoHospitalUrgentCare');
        }

        static eval(venue, hpMode) {
            const result = { flag: null };
            if (hpMode.harmFlag && venue.attributes.categories.includes('DOCTOR_CLINIC')) {
                result.flag = new Flag.ChangeToHospitalUrgentCare(0, 'If this place provides emergency medical care:');
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            let idx = _newCategories.indexOf('HOSPITAL_MEDICAL_CARE');
            const venue = getSelectedVenue();
            if (idx === -1) idx = _newCategories.indexOf('DOCTOR_CLINIC');
            if (idx > -1) {
                _newCategories[idx] = 'HOSPITAL_URGENT_CARE';
                _UPDATED_FIELDS.categories.updated = true;
                addUpdateAction(venue, { categories: _newCategories });
            }
            harmonizePlaceGo(venue, 'harmonize'); // Rerun the script to update fields and lock
        }
    },
    NotAHospital: class extends WLActionFlag {
        constructor() {
            super(true, 3, 'Key words suggest this location may not be a hospital or urgent care location.', 'Change to Doctor / Clinic', 'Change category to Doctor / Clinic',
                true, 'Whitelist category', 'notAHospital');
        }

        static eval(categories) {
            const result = { flag: null, lockOK: true };
            if (categories.includes('HOSPITAL_URGENT_CARE')) {
                const testName = _newName.toLowerCase().replace(/[^a-z]/g, ' ');
                const testNameWords = testName.split(' ');
                if (containsAny(testNameWords, _hospitalFullMatch) || _hospitalPartMatch.some(match => testName.includes(match))) {
                    if (!_wl.notAHospital) {
                        result.flag = new Flag.NotAHospital();
                        result.lockOK = false;
                    }
                }
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            let categories = venue.attributes.categories.slice();
            let updateIt = false;
            if (categories.length) {
                const idx = categories.indexOf('HOSPITAL_URGENT_CARE');
                if (idx > -1) {
                    categories[idx] = 'DOCTOR_CLINIC';
                    updateIt = true;
                }
                categories = _.uniq(categories);
            } else {
                categories.push('DOCTOR_CLINIC');
                updateIt = true;
            }
            if (updateIt) {
                _UPDATED_FIELDS.categories.updated = true;
                W.model.actionManager.add(new UpdateObject(venue, { categories }));
            }
            harmonizePlaceGo(venue, 'harmonize'); // Rerun the script to update fields and lock
        }
    },
    ChangeToDoctorClinic: class extends WLActionFlag {
        constructor() {
            super(true, 0, 'If this place provides non-emergency medical care: ', 'Change to Doctor / Clinic', 'Change category to Doctor / Clinic', false,
                'Whitelist category', 'changeToDoctorClinic');
        }

        static eval(venue, categories, hpMode, pnhNameRegMatch) {
            const result = { flag: null, lockOK: true };
            if (hpMode.harmFlag && venue.attributes.updatedOn < new Date('3/28/2017').getTime()
                && ((categories.includes('PERSONAL_CARE') && !pnhNameRegMatch) || _newCategories.includes('OFFICES'))) {
                // Show the Change To Doctor / Clinic button for places with PERSONAL_CARE or OFFICES category
                // The date criteria was added because Doctor/Clinic category was added around then, and it's assumed if the
                // place has been edited since then, people would have already updated the category.

                result.flag = new Flag.ChangeToDoctorClinic();
                result.flag.WLactive = null;
            }
            return result;
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            const venue = getSelectedVenue();
            let categories = venue.attributes.categories.slice();
            let updateIt = false;
            if (categories.length) {
                ['OFFICES', 'PERSONAL_CARE'].forEach(cat => {
                    const idx = categories.indexOf(cat);
                    if (idx > -1) {
                        categories[idx] = 'DOCTOR_CLINIC';
                        updateIt = true;
                    }
                });
                categories = _.uniq(categories);
            } else {
                categories.push('DOCTOR_CLINIC');
                updateIt = true;
            }
            if (updateIt) {
                _UPDATED_FIELDS.categories.updated = true;
                W.model.actionManager.add(new UpdateObject(venue, { categories }));
            }
            harmonizePlaceGo(venue, 'harmonize'); // Rerun the script to update fields and lock
        }
    },
    STC: class extends ActionFlag {
        constructor() {
            super(true, 0, '', 'Force Title Case?', 'Force title case to: ');
            this.originalName = null;
            this.confirmChange = false;
            this.noBannerAssemble = true;
        }

        action() {
            const venue = getSelectedVenue();
            let newName = venue.attributes.name;
            if (newName === this.originalName || this.confirmChange) {
                const parts = getNameParts(this.originalName);
                newName = toTitleCaseStrong(parts.base);
                if (parts.base !== newName) {
                    W.model.actionManager.add(new UpdateObject(venue, { name: newName + (parts.suffix || '') }));
                    _UPDATED_FIELDS.name.updated = true;
                }
                harmonizePlaceGo(venue, 'harmonize');
            } else {
                $('button#WMEPH_STC').text('Are you sure?').after(' The name has changed.  This will overwrite the new name.');
                _buttonBanner.STC.confirmChange = true;
            }
        }
    },
    SFAliases: class extends FlagBase {
        constructor() { super(true, 0, 'Unnecessary aliases were removed.'); }
    },
    PlaceMatched: class extends FlagBase {
        constructor() { super(true, 0, 'Place matched from PNH data.'); }
    },
    PlaceLocked: class extends FlagBase {
        constructor() { super(true, 0, 'Place locked.'); }
    },
    NewPlaceSubmit: class extends ActionFlag {
        constructor() {
            super(true, 0, 'No PNH match. If it\'s a chain: ', 'Submit new chain data', 'Submit info for a new chain through the linked form');
        }

        // eslint-disable-next-line class-methods-use-this
        action() {
            window.open(_newPlaceURL);
        }
    },
    ApprovalSubmit: class extends ActionFlag {
        constructor(region, pnhOrderNum, pnhNameTemp, placePL) {
            super(true, 0, 'PNH data exists but is not approved for this region: ', 'Request approval', 'Request region/country approval of this place');
            this.region = region;
            this.pnhOrderNum = pnhOrderNum;
            this.pnhNameTemp = pnhNameTemp;
            this.placePL = placePL;
        }

        action() {
            if (_PM_USER_LIST.hasOwnProperty(this.region) && _PM_USER_LIST[this.region].approvalActive) {
                const forumPMInputs = {
                    subject: `${this.pnhOrderNum} PNH approval for "${this.pnhNameTemp}"`,
                    message: `Please approve "${this.pnhNameTemp}" for the ${this.region} region.  Thanks\n \nPNH order number: ${
                        this.pnhOrderNum}\n \nPermalink: ${this.placePL}\n \nPNH Link: ${_URLS.usaPnh}`,
                    preview: 'Preview',
                    attach_sig: 'on'
                };
                _PM_USER_LIST[this.region].mods.forEach(obj => {
                    forumPMInputs[`address_list[u][${obj.id}]`] = 'to';
                });
                newForumPost('https://www.waze.com/forum/ucp.php?i=pm&mode=compose', forumPMInputs);
            } else {
                window.open(_approveRegionURL);
            }
        }
    },
    PlaceWebsite: class extends ActionFlag {
        // NOTE: This class is now only used to display the store locator button.  It can be updated to remove/change anything that doesn't serve that purpose.
        constructor() { super(true, 0, '', 'Location Finder', 'Look up details about this location on the chain\'s finder web page'); }

        // eslint-disable-next-line class-methods-use-this
        action() {
            let openPlaceWebsiteURL;
            // let linkProceed = true;
            if (_updateURL) {
                // replace WME url with storefinder URLs if they are in the PNH data
                if (_customStoreFinder) {
                    openPlaceWebsiteURL = _customStoreFinderURL;
                } else if (_customStoreFinderLocal) {
                    openPlaceWebsiteURL = _customStoreFinderLocalURL;
                }
                // If the user has 'never' opened a localized store finder URL, then warn them (just once)
                if (localStorage.getItem(_SETTING_IDS.sfUrlWarning) === '0' && _customStoreFinderLocal) {
                    WazeWrap.Alerts.confirm(
                        _SCRIPT_NAME,
                        '***Localized store finder sites often show multiple nearby results. Please make sure you pick the right location.<br>Click OK to agree and continue.',
                        () => {
                            localStorage.setItem(_SETTING_IDS.sfUrlWarning, '1'); // prevent future warnings
                            if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
                                window.open(openPlaceWebsiteURL);
                            } else {
                                window.open(openPlaceWebsiteURL, _SEARCH_RESULTS_WINDOW_NAME, _searchResultsWindowSpecs);
                            }
                        },
                        () => { }
                    );
                    return;
                }
            } else {
                let { url } = getSelectedVenue();
                if (!/^https?:\/\//.test(url)) url = `http://${url}`;
                openPlaceWebsiteURL = url;
            }
            // open the link depending on new window setting
            // if (linkProceed) {
            if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
                window.open(openPlaceWebsiteURL);
            } else {
                window.open(openPlaceWebsiteURL, _SEARCH_RESULTS_WINDOW_NAME, _searchResultsWindowSpecs);
            }
            // }
        }
    }
}; // END Flag namespace

function getButtonBanner() {
    // **** Set up banner action buttons.  Structure:
    // active: false until activated in the script
    // severity: determines the color of the banners and whether locking occurs
    // message: The text before the button option
    // value: button text
    // title: tooltip text
    // action: The action that happens if the button is pressed
    // WL terms are for whitelisting

    return {
        pnhCatMess: null,
        notAHospital: null,
        notASchool: null,
        hnDashRemoved: null,
        fullAddressInference: null,
        nameMissing: null,
        plaIsPublic: null,
        plaNameMissing: null,
        plaNameNonStandard: null,
        indianaLiquorStoreHours: null,
        hoursOverlap: null,
        unmappedRegion: null,
        restAreaName: null,
        restAreaNoTransportation: null,
        restAreaGas: null,
        restAreaScenic: null,
        restAreaSpec: null,
        gasMismatch: null,
        gasUnbranded: null,
        gasMkPrim: null,
        isThisAPilotTravelCenter: null,
        hotelMkPrim: null,
        changeToPetVet: null,
        pointNotArea: null,
        areaNotPoint: null,
        hnMissing: null,
        hnNonStandard: null,
        HNRange: null,
        streetMissing: null,
        cityMissing: null,
        bankType1: null,
        bankBranch: null,
        standaloneATM: null,
        bankCorporate: null,
        catPostOffice: null,
        ignEdited: null,
        wazeBot: null,
        parentCategory: null,
        checkDescription: null,
        overlapping: null,
        suspectDesc: null,
        resiTypeName: null,
        mismatch247: null,
        phoneInvalid: null,
        areaNotPointMid: null,
        pointNotAreaMid: null,
        longURL: null,
        gasNoBrand: null,
        subFuel: null,
        areaNotPointLow: null,
        pointNotAreaLow: null,
        formatUSPS: null,
        missingUSPSAlt: null,
        missingUSPSZipAlt: null,
        missingUSPSDescription: null,
        catHotel: null,
        localizedName: null,
        specCaseMessage: null,
        specCaseMessageLow: null,
        changeToDoctorClinic: null,
        extProviderMissing: null,
        urlMissing: null,
        badAreaCode: null,
        phoneMissing: null,
        noHours: null,
        plaLotTypeMissing: null,
        plaCostTypeMissing: null,
        plaPaymentTypeMissing: null,
        plaLotElevationMissing: null,
        plaSpaces: null,
        noPlaStopPoint: null,
        plaStopPointUnmoved: null,
        plaCanExitWhileClosed: null,
        plaHasAccessibleParking: null,
        allDayHoursFixed: null,
        resiTypeNameSoft: null,
        localURL: null,
        lockRPP: null,
        addAlias: null,
        addCat2: null,
        addPharm: null,
        addSuper: null,
        appendAMPM: null,
        addATM: null,
        addConvStore: null,
        isThisAPostOffice: null,
        STC: null,
        changeToHospitalUrgentCare: null,
        sfAliases: null,
        placeMatched: null,
        placeLocked: null,
        NewPlaceSubmit: null,
        ApprovalSubmit: null,
        PlaceWebsite: null
    };
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
        addWheelchair: {
            active: false,
            checked: false,
            icon: 'serv-wheelchair',
            w2hratio: 50 / 50,
            value: 'WhCh',
            title: 'Wheelchair accessible',
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
        addDisabilityParking: {
            active: false,
            checked: false,
            icon: 'serv-wheelchair',
            w2hratio: 50 / 50,
            value: 'DisabilityParking',
            title: 'Disability parking',
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
                    addUpdateAction(venue, { openingHours: [new OpeningHour({ days: [1, 2, 3, 4, 5, 6, 0], fromHour: '00:00', toHour: '00:00' })] }, actions);
                    _servicesBanner.add247.checked = true;
                    _buttonBanner.noHours = null;
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
                window.open(_URLS.placesWiki);
            }
        },
        restAreaWiki: {
            active: false,
            severity: 0,
            message: '',
            value: 'Rest Area wiki',
            title: 'Open the Rest Area wiki page',
            action() {
                window.open(_URLS.restAreaWiki);
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
                    _SCRIPT_NAME,
                    'Are you sure you want to clear all whitelisted fields for this place?',
                    () => {
                        delete _venueWhitelist[venue.attributes.id];
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
                    message: `Script version: ${_SCRIPT_VERSION}${_DEV_VERSION_STR}\nPermalink: ${
                        placePL}\nPlace name: ${venue.attributes.name}\nCountry: ${
                        venue.getAddress().getCountry().name}\n--------\nDescribe the error:  \n `
                });
            }
        }
    };
} // END getButtonBanner2()

// Main script
function harmonizePlaceGo(item, useFlag, actions) {
    let pnhOrderNum = '';
    let pnhNameTemp = '';
    let pnhNameTempWeb = '';
    let placePL;
    const itemID = item.attributes.id;

    // Used for collecting all actions to be applied to the model.
    actions = actions || [];

    const hpMode = {
        harmFlag: false,
        hlFlag: false,
        scanFlag: false
    };

    if (useFlag.includes('harmonize')) {
        hpMode.harmFlag = true;
        phlog('Running script on selected place...');
    }
    if (useFlag.includes('highlight')) {
        hpMode.hlFlag = true;
    }
    // NOTE: scan is not used yet
    // if (useFlag.includes('scan')) {
    //     hpMode.scanFlag = true;
    // }

    _severityButt = 0;

    // Whitelist: reset flags
    _wl = {
        dupeWL: [],
        restAreaName: false,
        restAreaSpec: false,
        restAreaScenic: false,
        unmappedRegion: false,
        gasMismatch: false,
        hotelMkPrim: false,
        changeToOffice: false,
        changeToDoctorClinic: false,
        changeHMC2PetVet: false,
        changeSchool2Offices: false,
        pointNotArea: false,
        areaNotPoint: false,
        HNWL: false,
        hnNonStandard: false,
        HNRange: false,
        parentCategory: false,
        suspectDesc: false,
        resiTypeName: false,
        longURL: false,
        gasNoBrand: false,
        subFuel: false,
        hotelLocWL: false,
        localizedName: false,
        urlWL: false,
        phoneWL: false,
        aCodeWL: false,
        noHours: false,
        nameMissing: false,
        plaNameMissing: false,
        extProviderMissing: false
    };

    let addr = item.getAddress();
    if (addr.hasOwnProperty('attributes')) {
        addr = addr.attributes;
    }

    _buttonBanner = getButtonBanner();

    if (hpMode.harmFlag) {
        // The placePL should only be needed when harmonizing, not when highlighting.
        placePL = getCurrentPL() //  set up external post div and pull place PL
            .replace(/&layers=[^&]+(&?)/g, '$1') // remove Permalink Layers
            .replace(/&s=[^&]+(&?)/g, '$1') // remove Permalink Layers
            .replace(/&update_requestsFilter=[^&]+(&?)/g, '$1') // remove Permalink Layers
            .replace(/&problemsFilter=[^&]+(&?)/g, '$1') // remove Permalink Layers
            .replace(/&mapProblemFilter=[^&]+(&?)/g, '$1') // remove Permalink Layers
            .replace(/&mapUpdateRequestFilter=[^&]+(&?)/g, '$1') // remove Permalink Layers
            .replace(/&venueFilter=[^&]+(&?)/g, '$1'); // remove Permalink Layers

        _buttonBanner2 = getButtonBanner2(item, placePL);
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
        _pnhLockLevel = -1;
    }

    // If place has hours of 0:00-23:59, highlight yellow or if harmonizing, convert to All Day.
    _buttonBanner.allDayHoursFixed = Flag.AllDayHoursFixed.eval(item, hpMode, actions);

    let lockOK = true; // if nothing goes wrong, then place will be locked
    const { categories } = item.attributes;

    _newCategories = categories.slice();
    const nameParts = getNameParts(item.attributes.name);
    let newNameSuffix = nameParts.suffix;
    _newName = nameParts.base;
    _newAliases = item.attributes.aliases.slice();
    let newDescripion = item.attributes.description;
    _newURL = item.attributes.url;
    let newURLSubmit = '';
    if (_newURL !== null && _newURL !== '') {
        newURLSubmit = _newURL;
    }
    _newPhone = item.attributes.phone;

    let pnhNameRegMatch;

    // Some user submitted places have no data in the country, state and address fields.
    let inferredAddress;
    if (hpMode.harmFlag) {
        const result = Flag.FullAddressInference.eval(item, addr, actions);
        if (result.exit) return undefined;
        _buttonBanner.fullAddressInference = result.flag;
        ({ inferredAddress } = result);
        if (result.inferredAddress) addr = result.inferredAddress;
        if (result.noLock) lockOK = false;
    } else if (hpMode.hlFlag) {
        const result = Flag.FullAddressInference.evalHL(item, addr);
        if (result) return result;
    }

    let result;
    // Check parking lot attributes.
    if (hpMode.harmFlag && item.isParkingLot()) _servicesBanner.addDisabilityParking.active = true;

    result = Flag.PlaCostTypeMissing.eval(item, hpMode);
    _buttonBanner.plaCostTypeMissing = result.flag;
    if (result.noLock) lockOK = false;

    result = Flag.PlaLotElevationMissing.eval(item);
    _buttonBanner.plaLotElevationMissing = result.flag;
    if (result.noLock) lockOK = false;

    result = Flag.PlaSpaces.eval(item, hpMode);
    _buttonBanner.plaSpaces = result.flag;

    result = Flag.PlaLotTypeMissing.eval(item, hpMode);
    _buttonBanner.plaLotTypeMissing = result.flag;
    if (result.noLock) lockOK = false;

    _buttonBanner.noPlaStopPoint = Flag.NoPlaStopPoint.eval(item).flag;
    _buttonBanner.plaStopPointUnmoved = Flag.PlaStopPointUnmoved.eval(item).flag;
    _buttonBanner.plaCanExitWhileClosed = Flag.PlaCanExitWhileClosed.eval(item, hpMode).flag;
    _buttonBanner.plaPaymentTypeMissing = Flag.PlaPaymentTypeMissing.eval(item).flag;
    _buttonBanner.plaHasAccessibleParking = Flag.PlaHasAccessibleParking.eval(item, hpMode).flag;

    // Check categories that maybe should be Hospital / Urgent Care, or Doctor / Clinic.
    _buttonBanner.changeToHospitalUrgentCare = Flag.ChangeToHospitalUrgentCare.eval(item, hpMode).flag;

    // Whitelist breakout if place exists on the Whitelist and the option is enabled

    let itemGPS;
    if (_venueWhitelist.hasOwnProperty(itemID) && (hpMode.harmFlag || (hpMode.hlFlag && !$('#WMEPH-DisableWLHL').prop('checked')))) {
        // Enable the clear WL button if any property is true
        Object.keys(_venueWhitelist[itemID]).forEach(wlKey => { // loop thru the venue WL keys
            if (_venueWhitelist[itemID].hasOwnProperty(wlKey) && (_venueWhitelist[itemID][wlKey].active || false)) {
                if (hpMode.harmFlag) _buttonBanner2.clearWL.active = true;
                _wl[wlKey] = _venueWhitelist[itemID][wlKey];
            }
        });
        if (_venueWhitelist[itemID].hasOwnProperty('dupeWL') && _venueWhitelist[itemID].dupeWL.length > 0) {
            if (hpMode.harmFlag) _buttonBanner2.clearWL.active = true;
            _wl.dupeWL = _venueWhitelist[itemID].dupeWL;
        }
        // Update address and GPS info for the place
        if (hpMode.harmFlag) {
            // get GPS lat/long coords from place, call as itemGPS.lat, itemGPS.lon
            if (!itemGPS) {
                const centroid = item.attributes.geometry.getCentroid();
                itemGPS = OL.Layer.SphericalMercator.inverseMercator(centroid.x, centroid.y);
            }
            _venueWhitelist[itemID].city = addr.city.attributes.name; // Store city for the venue
            _venueWhitelist[itemID].state = addr.state.name; // Store state for the venue
            _venueWhitelist[itemID].country = addr.country.name; // Store country for the venue
            _venueWhitelist[itemID].gps = itemGPS; // Store GPS coords for the venue
        }
    }

    // Country restrictions
    if (hpMode.harmFlag && (addr.county === null || addr.state === null)) {
        WazeWrap.Alerts.error(_SCRIPT_NAME, 'Country and/or state could not be determined.  Edit the place address and run WMEPH again.');
        return undefined;
    }
    const countryName = addr.country.name;
    const stateName = addr.state.name;
    if (countryName === 'United States') {
        _countryCode = 'USA';
    } else if (countryName === 'Canada') {
        _countryCode = 'CAN';
    } else if (countryName === 'American Samoa') {
        _countryCode = 'USA';
    } else if (countryName === 'Guam') {
        _countryCode = 'USA';
    } else if (countryName === 'Northern Mariana Islands') {
        _countryCode = 'USA';
    } else if (countryName === 'Puerto Rico') {
        _countryCode = 'USA';
    } else if (countryName === 'Virgin Islands (U.S.)') {
        _countryCode = 'USA';
    } else {
        if (hpMode.harmFlag) {
            WazeWrap.Alerts.error(_SCRIPT_NAME, 'At present this script is not supported in this country.');
        }
        return 3;
    }

    // Parse state-based data
    let state2L = 'Unknown';
    let region = 'Unknown';
    let gFormState = '';
    for (let usdix = 1; usdix < _PNH_DATA.states.length; usdix++) {
        _stateDataTemp = _PNH_DATA.states[usdix].split('|');
        if (stateName === _stateDataTemp[_psStateIx]) {
            state2L = _stateDataTemp[_psState2LetterIx];
            region = _stateDataTemp[_psRegionIx];
            gFormState = _stateDataTemp[_psGoogleFormStateIx];
            if (_stateDataTemp[_psDefaultLockLevelIx].match(/[1-5]{1}/) !== null) {
                _defaultLockLevel = _stateDataTemp[_psDefaultLockLevelIx] - 1; // normalize by -1
            } else if (hpMode.harmFlag) {
                WazeWrap.Alerts.warning(_SCRIPT_NAME, 'Lock level sheet data is not correct');
            } else if (hpMode.hlFlag) {
                return 3;
            }
            _areaCodeList = `${_areaCodeList},${_stateDataTemp[_psAreaCodeIx]}`;
            break;
        }
        // If State is not found, then use the country
        if (countryName === _stateDataTemp[_psStateIx]) {
            state2L = _stateDataTemp[_psState2LetterIx];
            region = _stateDataTemp[_psRegionIx];
            gFormState = _stateDataTemp[_psGoogleFormStateIx];
            if (_stateDataTemp[_psDefaultLockLevelIx].match(/[1-5]{1}/) !== null) {
                _defaultLockLevel = _stateDataTemp[_psDefaultLockLevelIx] - 1; // normalize by -1
            } else if (hpMode.harmFlag) {
                WazeWrap.Alerts.warning(_SCRIPT_NAME, 'Lock level sheet data is not correct');
            } else if (hpMode.hlFlag) {
                return 3;
            }
            _areaCodeList = `${_areaCodeList},${_stateDataTemp[_psAreaCodeIx]}`;
            break;
        }
    }
    if (state2L === 'Unknown' || region === 'Unknown') { // if nothing found:
        if (hpMode.harmFlag) {
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
                _SCRIPT_NAME,
                'WMEPH: Localization Error!<br>Click OK to report this error',
                () => {
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
                },
                () => { }
            );
        }
        return 3;
    }

    // Gas station treatment (applies to all including PNH)

    result = Flag.IsThisAPilotTravelCenter.eval(item, hpMode, state2L, _newName, actions);
    _buttonBanner.isThisAPilotTravelCenter = result.flag;
    _newName = result.newName;

    if (item.isGasStation()) {
        // If no gas station name, replace with brand name
        if (hpMode.harmFlag && (!_newName || _newName.trim().length === 0) && item.attributes.brand) {
            _newName = item.attributes.brand;
            actions.push(new UpdateObject(item, { name: _newName }));
            _UPDATED_FIELDS.name.updated = true;
        }

        // Add convenience store category to station
        if (!_newCategories.includes('CONVENIENCE_STORE') && !_buttonBanner.subFuel) {
            _buttonBanner.addConvStore = new Flag.AddConvStore();
        }
    } // END Gas Station Checks

    // Note for Indiana editors to check liquor store hours if Sunday hours haven't been added yet.
    _buttonBanner.indianaLiquorStoreHours = Flag.IndianaLiquorStoreHours.eval(item, _newName, hpMode).flag;

    const isLocked = item.attributes.lockRank >= (_pnhLockLevel > -1 ? _pnhLockLevel : _defaultLockLevel);

    // Set up a variable (newBrand) to contain the brand. When harmonizing, it may be forced to a new value.
    // Other brand flags should use it since it won't be updated on the actual venue until later.
    let { brand: newBrand } = item.attributes;
    // Clear attributes from residential places
    if (item.attributes.residential) {
        if (hpMode.harmFlag) {
            if (!$('#WMEPH-AutoLockRPPs').prop('checked')) {
                lockOK = false;
            }
            if (item.attributes.name !== '') { // Set the residential place name to the address (to clear any personal info)
                phlogdev('Residential Name reset');
                actions.push(new UpdateObject(item, { name: '' }));
                // no field HL
            }
            _newCategories = ['RESIDENCE_HOME'];
            // newDescripion = null;
            if (item.attributes.description !== null && item.attributes.description !== '') { // remove any description
                phlogdev('Residential description cleared');
                actions.push(new UpdateObject(item, { description: null }));
                // no field HL
            }
            // newPhone = null;
            if (item.attributes.phone !== null && item.attributes.phone !== '') { // remove any phone info
                phlogdev('Residential Phone cleared');
                actions.push(new UpdateObject(item, { phone: null }));
                // no field HL
            }
            // newURL = null;
            if (item.attributes.url !== null && item.attributes.url !== '') { // remove any url
                phlogdev('Residential URL cleared');
                actions.push(new UpdateObject(item, { url: null }));
                // no field HL
            }
            if (item.attributes.services.length > 0) {
                phlogdev('Residential services cleared');
                actions.push(new UpdateObject(item, { services: [] }));
                // no field HL
            }
        }
        // NOTE: do not use is2D() function. It doesn't seem to be 100% reliable.
        if (!item.isPoint()) {
            _buttonBanner.pointNotArea = new Flag.PointNotArea();
        }
    } else if (item.isParkingLot() || (_newName && _newName.trim().length)) { // for non-residential places
        _buttonBanner.extProviderMissing = Flag.ExtProviderMissing.eval(item, isLocked, _newCategories, _USER.rank, $('#WMEPH-DisablePLAExtProviderCheck').prop('checked'), actions).flag;

        // Place Harmonization
        let pnhMatchData;
        if (hpMode.harmFlag) {
            if (item.isParkingLot()) {
                pnhMatchData = ['NoMatch'];
            } else {
                // check against the PNH list
                pnhMatchData = harmoList(_newName, state2L, region, _countryCode, _newCategories, item, placePL);
            }
        } else if (hpMode.hlFlag) {
            pnhMatchData = ['Highlight'];
        }

        pnhNameRegMatch = false;
        if (pnhMatchData[0] !== 'NoMatch' && pnhMatchData[0] !== 'ApprovalNeeded' && pnhMatchData[0] !== 'Highlight') { // *** Replace place data with PNH data
            pnhNameRegMatch = true;
            let showDispNote = true;
            let updatePNHName = true;
            // Break out the data headers
            const pnhDataHeaders = _PNH_DATA[_countryCode].pnh[0].split('|');
            const phNameIdx = pnhDataHeaders.indexOf('ph_name');
            const phAliasesIdx = pnhDataHeaders.indexOf('ph_aliases');
            const phCategory1Idx = pnhDataHeaders.indexOf('ph_category1');
            const phCategory2Idx = pnhDataHeaders.indexOf('ph_category2');
            const phDescriptionIdx = pnhDataHeaders.indexOf('ph_description');
            const phUrlIdx = pnhDataHeaders.indexOf('ph_url');
            const phOrderIdx = pnhDataHeaders.indexOf('ph_order');
            // var ph_notes_ix = _PNH_DATA_headers.indexOf('ph_notes');
            const phSpecCaseIdx = pnhDataHeaders.indexOf('ph_speccase');
            const phStoreFinderUrlIdx = pnhDataHeaders.indexOf('ph_sfurl');
            const phStoreFinderUrlLocalIdx = pnhDataHeaders.indexOf('ph_sfurllocal');
            // var ph_forcecat_ix = _PNH_DATA_headers.indexOf('ph_forcecat');
            const phDisplayNoteIdx = pnhDataHeaders.indexOf('ph_displaynote');

            // Retrieve the data from the PNH line(s)
            let nsMultiMatch = false;
            const orderList = [];
            if (pnhMatchData.length > 1) { // If multiple matches, then
                let brandParent = -1;
                let pnhMatchDataHold = pnhMatchData[0].split('|');
                for (let pmdix = 0; pmdix < pnhMatchData.length; pmdix++) { // For each of the matches,
                    const pmdTemp = pnhMatchData[pmdix].split('|'); // Split the PNH data line
                    orderList.push(pmdTemp[phOrderIdx]); // Add Order number to a list
                    if (pmdTemp[phSpecCaseIdx].match(/brandParent(\d{1})/) !== null) { // If there is a brandParent flag, prioritize by highest match
                        const [, pmdSpecCases] = pmdTemp[phSpecCaseIdx].match(/brandParent(\d{1})/);
                        if (pmdSpecCases > brandParent) { // if the match is more specific than the previous ones:
                            brandParent = pmdSpecCases; // Update the brandParent level
                            pnhMatchDataHold = pmdTemp; // Update the PNH data line
                        }
                    } else { // if any item has no brandParent structure, use highest brandParent match but post an error
                        nsMultiMatch = true;
                    }
                }
                pnhMatchData = pnhMatchDataHold;
            } else {
                pnhMatchData = pnhMatchData[0].split('|'); // Single match just gets direct split
            }

            const priPNHPlaceCat = catTranslate(pnhMatchData[phCategory1Idx]); // translate primary category to WME code

            // if the location has multiple matches, then pop an alert that will make a forum post to the thread
            if (nsMultiMatch) {
                /* if (confirm('WMEPH: Multiple matches found!\nDouble check the script changes.\nClick OK to report this situation.')) {
                    reportError({
                        subject: `Order Nos. "${orderList.join(', ')}" WMEPH Multiple match report`,
                        message: `Error report: PNH Order Nos. "${orderList.join(', ')}" are ambiguous multiple matches.\n \nExample Permalink: ${placePL}`
                    });
                } */
                WazeWrap.Alerts.confirm(
                    _SCRIPT_NAME,
                    'WMEPH: Multiple matches found!<br>Double check the script changes.<br>Click OK to report this situation.',
                    () => {
                        reportError({
                            subject: `Order Nos. "${orderList.join(', ')}" WMEPH Multiple match report`,
                            message: `Error report: PNH Order Nos. "${orderList.join(', ')}" are ambiguous multiple matches.\n \nExample Permalink: ${placePL}`
                        });
                    },
                    () => { }
                );
            }

            // Check special cases
            let specCases;
            let localURLcheck = '';
            if (phSpecCaseIdx > -1) { // If the special cases column exists
                specCases = pnhMatchData[phSpecCaseIdx]; // pulls the speccases field from the PNH line
                if (!isNullOrWhitespace(specCases)) {
                    specCases = specCases.replace(/, /g, ',').split(','); // remove spaces after commas and split by comma
                }
                for (let scix = 0; scix < specCases.length; scix++) {
                    let scFlag;
                    const specCase = specCases[scix];
                    let match;

                    /* eslint-disable no-cond-assign */

                    // find any button/message flags in the special case (format: buttOn_xyzXyz, etc.)
                    if (match = specCase.match(/^buttOn_(.+)/i)) {
                        [, scFlag] = match;
                        let flag = null;
                        switch (scFlag) {
                            case 'addCat2':
                                // flag = new Flag.AddCat2();
                                break;
                            case 'addPharm':
                                flag = new Flag.AddPharm();
                                break;
                            case 'addSuper':
                                flag = new Flag.AddSuper();
                                break;
                            case 'appendAMPM':
                                flag = new Flag.AppendAMPM();
                                break;
                            case 'addATM':
                                flag = new Flag.AddATM();
                                break;
                            case 'addConvStore':
                                flag = new Flag.AddConvStore();
                                break;
                            default:
                                console.error('WMEPH:', `Could not process specCase value: buttOn_${scFlag}`);
                        }
                        _buttonBanner[scFlag] = flag;
                    } else if (match = specCase.match(/^buttOff_(.+)/i)) {
                        [, scFlag] = match;
                        _buttonBanner[scFlag] = null;
                    } else if (match = specCase.match(/^messOn_(.+)/i)) {
                        [, scFlag] = match;
                        _buttonBanner[scFlag].active = true;
                    } else if (match = specCase.match(/^messOff_(.+)/i)) {
                        [, scFlag] = match;
                        _buttonBanner[scFlag].active = false;
                    } else if (match = specCase.match(/^psOn_(.+)/i)) {
                        [, scFlag] = match;
                        _servicesBanner[scFlag].actionOn(actions);
                        _servicesBanner[scFlag].pnhOverride = true;
                    } else if (match = specCase.match(/^psOff_(.+)/i)) {
                        [, scFlag] = match;
                        _servicesBanner[scFlag].actionOff(actions);
                        _servicesBanner[scFlag].pnhOverride = true;
                    }

                    // If brand is going to be forced, use that.  Otherwise, use existing brand.
                    if (match = /forceBrand<>([^,<]+)/i.exec(pnhMatchData[phSpecCaseIdx])) {
                        [, newBrand] = match;
                    }

                    // parseout localURL data if exists (meaning place can have a URL distinct from the chain URL
                    if (match = specCase.match(/^localURL_(.+)/i)) {
                        [, localURLcheck] = match;
                    }

                    // parse out optional alt-name
                    result = Flag.AddAlias.eval(specCase, specCases, _newAliases);
                    if (result.flag) {
                        _buttonBanner.addAlias = result.flag;
                    }

                    // Gas Station forceBranding
                    if (['GAS_STATION'].includes(priPNHPlaceCat) && (match = specCase.match(/^forceBrand<>(.+)/i))) {
                        const [, forceBrand] = match;
                        if (item.attributes.brand !== forceBrand) {
                            actions.push(new UpdateObject(item, { brand: forceBrand }));
                            _UPDATED_FIELDS.brand.updated = true;
                            phlogdev('Gas brand updated from PNH');
                        }
                    }

                    // Check Localization
                    let displayNote;
                    if (phDisplayNoteIdx > -1 && !isNullOrWhitespace(pnhMatchData[phDisplayNoteIdx])) {
                        displayNote = pnhMatchData[phDisplayNoteIdx];
                    }
                    result = Flag.LocalizedName.eval(_newName, newNameSuffix, specCase, displayNote);
                    if (result.flag) {
                        if (!result.updatePnhName) {
                            updatePNHName = false;
                            showDispNote = false;
                        }
                        _buttonBanner.localizedName = result.flag;
                    }

                    /* eslint-enable no-cond-assign */

                    // Prevent name change
                    if (specCase.match(/keepName/g) !== null) {
                        updatePNHName = false;
                    }
                }
            }

            // If it's a place that also sells fuel, enable the button
            if (pnhMatchData[phSpecCaseIdx] === 'subFuel' && !_newName.toUpperCase().includes('GAS') && !_newName.toUpperCase().includes('FUEL')) {
                _buttonBanner.subFuel = new Flag.SubFuel();
                if (_wl.subFuel) {
                    _buttonBanner.subFuel.WLactive = false;
                }
            }

            // Display any notes for the specific place
            if (showDispNote && phDisplayNoteIdx > -1 && !isNullOrWhitespace(pnhMatchData[phDisplayNoteIdx])) {
                if (containsAny(specCases, ['pharmhours'])) {
                    if (!item.attributes.description.toUpperCase().includes('PHARMACY') || (!item.attributes.description.toUpperCase().includes('HOURS')
                        && !item.attributes.description.toUpperCase().includes('HRS'))) {
                        _buttonBanner.specCaseMessage = new Flag.SpecCaseMessage(pnhMatchData[phDisplayNoteIdx]);
                    }
                } else if (containsAny(specCases, ['drivethruhours'])) {
                    if (!item.attributes.description.toUpperCase().includes('DRIVE') || (!item.attributes.description.toUpperCase().includes('HOURS')
                        && !item.attributes.description.toUpperCase().includes('HRS'))) {
                        if ($('#service-checkbox-DRIVETHROUGH').prop('checked')) {
                            _buttonBanner.specCaseMessage = new Flag.SpecCaseMessage(pnhMatchData[phDisplayNoteIdx]);
                        } else {
                            _buttonBanner.specCaseMessageLow = new Flag.SpecCaseMessageLow(pnhMatchData[phDisplayNoteIdx]);
                        }
                    }
                } else {
                    _buttonBanner.specCaseMessageLow = new Flag.SpecCaseMessageLow(pnhMatchData[phDisplayNoteIdx]);
                }
            }

            // Localized Storefinder code:
            _customStoreFinderLocal = false;
            _customStoreFinderLocalURL = '';
            _customStoreFinder = false;
            _customStoreFinderURL = '';
            if (phStoreFinderUrlIdx > -1) { // if the sfurl column exists...
                if (phStoreFinderUrlLocalIdx > -1 && !isNullOrWhitespace(pnhMatchData[phStoreFinderUrlLocalIdx])) {
                    if (!_buttonBanner.localizedName) {
                        _buttonBanner.PlaceWebsite = new Flag.PlaceWebsite();
                        _buttonBanner.PlaceWebsite.value = 'Location Finder (L)';
                    }
                    const tempLocalURL = pnhMatchData[phStoreFinderUrlLocalIdx].replace(/ /g, '').split('<>');
                    let searchStreet = '';
                    let searchCity = '';
                    let searchState = '';
                    if (typeof addr.street.name === 'string') {
                        searchStreet = addr.street.name;
                    }
                    const searchStreetPlus = searchStreet.replace(/ /g, '+');
                    searchStreet = searchStreet.replace(/ /g, '%20');
                    if (typeof addr.city.attributes.name === 'string') {
                        searchCity = addr.city.attributes.name;
                    }
                    const searchCityPlus = searchCity.replace(/ /g, '+');
                    searchCity = searchCity.replace(/ /g, '%20');
                    if (typeof addr.state.name === 'string') {
                        searchState = addr.state.name;
                    }
                    const searchStatePlus = searchState.replace(/ /g, '+');
                    searchState = searchState.replace(/ /g, '%20');

                    const centroid = item.attributes.geometry.getCentroid();
                    if (!itemGPS) itemGPS = OL.Layer.SphericalMercator.inverseMercator(centroid.x, centroid.y);
                    for (let tlix = 1; tlix < tempLocalURL.length; tlix++) {
                        if (tempLocalURL[tlix] === 'ph_streetName') {
                            _customStoreFinderLocalURL += searchStreet;
                        } else if (tempLocalURL[tlix] === 'ph_streetNamePlus') {
                            _customStoreFinderLocalURL += searchStreetPlus;
                        } else if (tempLocalURL[tlix] === 'ph_cityName') {
                            _customStoreFinderLocalURL += searchCity;
                        } else if (tempLocalURL[tlix] === 'ph_cityNamePlus') {
                            _customStoreFinderLocalURL += searchCityPlus;
                        } else if (tempLocalURL[tlix] === 'ph_stateName') {
                            _customStoreFinderLocalURL += searchState;
                        } else if (tempLocalURL[tlix] === 'ph_stateNamePlus') {
                            _customStoreFinderLocalURL += searchStatePlus;
                        } else if (tempLocalURL[tlix] === 'ph_state2L') {
                            _customStoreFinderLocalURL += state2L;
                        } else if (tempLocalURL[tlix] === 'ph_latitudeEW') {
                            // customStoreFinderLocalURL = customStoreFinderLocalURL + itemGPS[0];
                        } else if (tempLocalURL[tlix] === 'ph_longitudeNS') {
                            // customStoreFinderLocalURL = customStoreFinderLocalURL + itemGPS[1];
                        } else if (tempLocalURL[tlix] === 'ph_latitudePM') {
                            _customStoreFinderLocalURL += itemGPS.lat;
                        } else if (tempLocalURL[tlix] === 'ph_longitudePM') {
                            _customStoreFinderLocalURL += itemGPS.lon;
                        } else if (tempLocalURL[tlix] === 'ph_latitudePMBuffMin') {
                            _customStoreFinderLocalURL += (itemGPS.lat - 0.01).toString();
                        } else if (tempLocalURL[tlix] === 'ph_longitudePMBuffMin') {
                            _customStoreFinderLocalURL += (itemGPS.lon - 0.01).toString();
                        } else if (tempLocalURL[tlix] === 'ph_latitudePMBuffMax') {
                            _customStoreFinderLocalURL += (itemGPS.lat + 0.01).toString();
                        } else if (tempLocalURL[tlix] === 'ph_longitudePMBuffMax') {
                            _customStoreFinderLocalURL += (itemGPS.lon + 0.01).toString();
                        } else if (tempLocalURL[tlix] === 'ph_houseNumber') {
                            _customStoreFinderLocalURL += (item.attributes.houseNumber ? item.attributes.houseNumber : '');
                        } else {
                            _customStoreFinderLocalURL += tempLocalURL[tlix];
                        }
                    }
                    if (_customStoreFinderLocalURL.indexOf('http') !== 0) {
                        _customStoreFinderLocalURL = `http://${_customStoreFinderLocalURL}`;
                    }
                    _customStoreFinderLocal = true;
                } else if (!isNullOrWhitespace(pnhMatchData[phStoreFinderUrlIdx])) {
                    if (!_buttonBanner.localizedName) {
                        _buttonBanner.PlaceWebsite = new Flag.PlaceWebsite();
                    }
                    _customStoreFinderURL = pnhMatchData[phStoreFinderUrlIdx];
                    if (_customStoreFinderURL.indexOf('http') !== 0) {
                        _customStoreFinderURL = `http://${_customStoreFinderURL}`;
                    }
                    _customStoreFinder = true;
                }
            }

            // Category translations
            let altCategories = pnhMatchData[phCategory2Idx];
            if (altCategories && altCategories.length) { //  translate alt-cats to WME code
                altCategories = altCategories.replace(/,[^A-Za-z0-9]*/g, ',').split(','); // tighten and split by comma
                for (let catix = 0; catix < altCategories.length; catix++) {
                    const newAltTemp = catTranslate(altCategories[catix]); // translate altCats into WME cat codes
                    if (newAltTemp === 'ERROR') { // if no translation, quit the loop
                        phlog(`Category ${altCategories[catix]} cannot be translated.`);
                        return undefined;
                    }
                    altCategories[catix] = newAltTemp; // replace with translated element
                }
            }

            // name parsing with category exceptions
            if (['HOTEL'].includes(priPNHPlaceCat)) {
                const nameToCheck = _newName + (newNameSuffix || '');
                if (nameToCheck.toUpperCase() === pnhMatchData[phNameIdx].toUpperCase()) { // If no localization
                    _buttonBanner.catHotel = new Flag.CatHotel(pnhMatchData[phNameIdx]);
                    _newName = pnhMatchData[phNameIdx];
                } else {
                    // Replace PNH part of name with PNH name
                    const splix = _newName.toUpperCase().replace(/[-/]/g, ' ').indexOf(pnhMatchData[phNameIdx].toUpperCase().replace(/[-/]/g, ' '));
                    if (splix > -1) {
                        const frontText = _newName.slice(0, splix);
                        const backText = _newName.slice(splix + pnhMatchData[phNameIdx].length);
                        _newName = pnhMatchData[phNameIdx];
                        if (frontText.length > 0) { _newName = `${frontText} ${_newName}`; }
                        if (backText.length > 0) { _newName = `${_newName} ${backText}`; }
                        _newName = _newName.replace(/ {2,}/g, ' ');
                    } else {
                        _newName = pnhMatchData[phNameIdx];
                    }
                }
                if (altCategories && altCategories.length) { // if PNH alts exist
                    insertAtIX(_newCategories, altCategories, 1); //  then insert the alts into the existing category array after the GS category
                }
                if (_newCategories.indexOf('HOTEL') !== 0) { // If no HOTEL category in the primary, flag it
                    _buttonBanner.hotelMkPrim = new Flag.HotelMkPrim();
                    if (_wl.hotelMkPrim) {
                        _buttonBanner.hotelMkPrim.WLactive = false;
                    } else {
                        lockOK = false;
                    }
                } else if (_newCategories.includes('HOTEL')) {
                    // Remove LODGING if it exists
                    const lodgingIdx = _newCategories.indexOf('LODGING');
                    if (lodgingIdx > -1) {
                        _newCategories.splice(lodgingIdx, 1);
                    }
                }
                // If PNH match, set wifi service.
                if (pnhMatchData && !_servicesBanner.addWiFi.checked) {
                    _servicesBanner.addWiFi.action();
                }
                // Set hotel hours to 24/7 for all hotels.
                if (!_servicesBanner.add247.checked) {
                    _servicesBanner.add247.action();
                }
            } else if (_newCategories.includes('BANK_FINANCIAL') && !pnhMatchData[phSpecCaseIdx].includes('notABank')) {
                // PNH Bank treatment
                _ixBank = item.attributes.categories.indexOf('BANK_FINANCIAL');
                _ixATM = item.attributes.categories.indexOf('ATM');
                _ixOffices = item.attributes.categories.indexOf('OFFICES');
                // if the name contains ATM in it
                if (/\batm\b/ig.test(_newName)) {
                    if (_ixOffices === 0) {
                        _buttonBanner.bankType1 = new Flag.BankType1();
                        _buttonBanner.bankBranch = new Flag.BankBranch();
                        _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                        _buttonBanner.bankCorporate = new Flag.BankCorporate();
                    } else if (_ixBank === -1 && _ixATM === -1) {
                        _buttonBanner.bankBranch = new Flag.BankBranch();
                        _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                    } else if (_ixATM === 0 && _ixBank > 0) {
                        _buttonBanner.bankBranch = new Flag.BankBranch();
                    } else if (_ixBank > -1) {
                        _buttonBanner.bankBranch = new Flag.BankBranch();
                        _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                    }
                    _newName = `${pnhMatchData[phNameIdx]} ATM`;
                    _newCategories = insertAtIX(_newCategories, 'ATM', 0);
                    // Net result: If the place has ATM cat only and ATM in the name, then it will be green and renamed Bank Name ATM
                } else if (_ixBank > -1 || _ixATM > -1) { // if no ATM in name but with a banking category:
                    if (_ixOffices === 0) {
                        _buttonBanner.bankBranch = new Flag.BankBranch();
                    } else if (_ixBank > -1 && _ixATM === -1) {
                        _buttonBanner.addATM = new Flag.AddATM();
                    } else if (_ixATM === 0 && _ixBank === -1) {
                        _buttonBanner.bankBranch = new Flag.BankBranch();
                        _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                    } else if (_ixBank > 0 && _ixATM > 0) {
                        _buttonBanner.bankBranch = new Flag.BankBranch();
                        _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                    }
                    _newName = pnhMatchData[phNameIdx];
                    // Net result: If the place has Bank category first, then it will be green with PNH name replaced
                } else { // for PNH match with neither bank type category, make it a bank
                    _newCategories = insertAtIX(_newCategories, 'BANK_FINANCIAL', 1);
                    _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                    _buttonBanner.bankCorporate = new Flag.BankCorporate();
                }// END PNH bank treatment
            } else if (['GAS_STATION'].includes(priPNHPlaceCat)) { // for PNH gas stations, don't replace existing sub-categories
                if (altCategories && altCategories.length) { // if PNH alts exist
                    insertAtIX(_newCategories, altCategories, 1); //  then insert the alts into the existing category array after the GS category
                }
                if (_newCategories.indexOf('GAS_STATION') !== 0) { // If no GS category in the primary, flag it
                    _buttonBanner.gasMkPrim = new Flag.GasMkPrim();
                    lockOK = false;
                } else {
                    _newName = pnhMatchData[phNameIdx];
                }
            } else if (updatePNHName) { // if not a special category then update the name
                _newName = pnhMatchData[phNameIdx];
                _newCategories = insertAtIX(_newCategories, priPNHPlaceCat, 0);
                if (altCategories && altCategories.length && !specCases.includes('buttOn_addCat2') && !specCases.includes('optionCat2')) {
                    _newCategories = insertAtIX(_newCategories, altCategories, 1);
                }
            } else if (!updatePNHName) {
                // Strong title case option for non-PNH places
                const titleCaseName = toTitleCaseStrong(_newName);
                if (_newName !== titleCaseName) {
                    _buttonBanner.STC = new Flag.STC();
                    _buttonBanner.STC.suffixMessage = `<span style="margin-left: 4px;font-size: 14px">&bull; ${titleCaseName}${newNameSuffix || ''}</span>`;
                    _buttonBanner.STC.title += titleCaseName;
                    _buttonBanner.STC.originalName = _newName + (newNameSuffix || '');
                }
            }

            // *** need to add a section above to allow other permissible categories to remain? (optional)

            // Parse URL data
            let localURLcheckRE;
            if (localURLcheck !== '') {
                if (_newURL !== null || _newURL !== '') {
                    localURLcheckRE = new RegExp(localURLcheck, 'i');
                    if (_newURL.match(localURLcheckRE) !== null) {
                        _newURL = normalizeURL(_newURL, false, true, item, region);
                    } else {
                        _newURL = normalizeURL(pnhMatchData[phUrlIdx], false, true, item, region);
                        _buttonBanner.localURL = new Flag.LocalURL();
                    }
                } else {
                    _newURL = normalizeURL(pnhMatchData[phUrlIdx], false, true, item, region);
                    _buttonBanner.localURL = new Flag.LocalURL();
                }
            } else {
                _newURL = normalizeURL(pnhMatchData[phUrlIdx], false, true, item, region);
            }
            // Parse PNH Aliases
            [_newAliasesTemp] = pnhMatchData[phAliasesIdx].match(/([^(]*)/i);
            if (!isNullOrWhitespace(_newAliasesTemp)) { // make aliases array
                _newAliasesTemp = _newAliasesTemp.replace(/,[^A-za-z0-9]*/g, ','); // tighten up commas if more than one alias.
                _newAliasesTemp = _newAliasesTemp.split(','); // split by comma
            }
            if (!specCases.includes('noUpdateAlias') && (!containsAll(_newAliases, _newAliasesTemp)
                && _newAliasesTemp && _newAliasesTemp.length && !specCases.includes('optionName2'))) {
                _newAliases = insertAtIX(_newAliases, _newAliasesTemp, 0);
            }

            // Remove unnecessary parent categories
            const catData = _PNH_DATA.USA.categories.map(cat => cat.split('|'));
            const catParentIdx = catData[0].indexOf('pc_catparent');
            const catNameIdx = catData[0].indexOf('pc_wmecat');
            const parentCats = _.uniq(_newCategories.map(catName => catData.find(cat => cat[catNameIdx] === catName)[catParentIdx]))
                .filter(parent => parent.trim(' ').length > 0);
            _newCategories = _newCategories.filter(cat => !parentCats.includes(cat));

            // update categories if different and no Cat2 option
            if (!matchSets(_.uniq(item.attributes.categories), _.uniq(_newCategories))) {
                if (!specCases.includes('optionCat2') && !specCases.includes('buttOn_addCat2')) {
                    phlogdev(`Categories updated with ${_newCategories}`);
                    actions.push(new UpdateObject(item, { categories: _newCategories }));
                    // W.model.actionManager.add(new UpdateObject(item, { categories: newCategories }));
                    _UPDATED_FIELDS.categories.updated = true;
                } else { // if second cat is optional
                    phlogdev(`Primary category updated with ${priPNHPlaceCat}`);
                    _newCategories = insertAtIX(_newCategories, priPNHPlaceCat, 0);
                    actions.push(new UpdateObject(item, { categories: _newCategories }));
                    _UPDATED_FIELDS.categories.updated = true;
                }
            }
            // Enable optional 2nd category button
            if (specCases.includes('buttOn_addCat2') && !_newCategories.includes(altCategories[0])) {
                const altCat = altCategories[0];
                // TODO - move logic into flag eval
                _buttonBanner.addCat2 = Flag.AddCat2.eval().flag;
                _buttonBanner.addCat2.message = `Is there a ${_catTransWaze2Lang[altCat]} at this location?`;
                _buttonBanner.addCat2.title = `Add ${_catTransWaze2Lang[altCat]}`;
                _buttonBanner.addCat2.altCategory = altCat;
            }

            // Description update
            newDescripion = pnhMatchData[phDescriptionIdx];
            if (!isNullOrWhitespace(newDescripion) && !item.attributes.description.toUpperCase().includes(newDescripion.toUpperCase())) {
                if (item.attributes.description !== '' && item.attributes.description !== null && item.attributes.description !== ' ') {
                    _buttonBanner.checkDescription = new Flag.CheckDescription();
                }
                phlogdev('Description updated');
                newDescripion = `${newDescripion}\n${item.attributes.description}`;
                actions.push(new UpdateObject(item, { description: newDescripion }));
                _UPDATED_FIELDS.description.updated = true;
            }

            // Special Lock by PNH
            if (specCases.includes('lockAt5')) {
                _pnhLockLevel = 4;
            }
        } else { // if no PNH match found
            if (pnhMatchData[0] === 'ApprovalNeeded') {
                // PNHNameTemp = PNHMatchData[1].join(', ');
                [, [pnhNameTemp]] = pnhMatchData; // Just do the first match
                pnhNameTempWeb = encodeURIComponent(pnhNameTemp);
                pnhOrderNum = pnhMatchData[2].join(',');
            }

            // Strong title case option for non-PNH places
            const titleCaseName = toTitleCaseStrong(_newName);
            if (_newName !== titleCaseName) {
                _buttonBanner.STC = new Flag.STC();
                _buttonBanner.STC.suffixMessage = `<span style="margin-left: 4px;font-size: 14px">&bull; ${titleCaseName}${newNameSuffix || ''}</span>`;
                _buttonBanner.STC.title += titleCaseName;
                _buttonBanner.STC.originalName = _newName + (newNameSuffix || '');
            }

            _newURL = normalizeURL(_newURL, true, false, item, region); // Normalize url

            // Generic Bank treatment
            _ixBank = item.attributes.categories.indexOf('BANK_FINANCIAL');
            _ixATM = item.attributes.categories.indexOf('ATM');
            _ixOffices = item.attributes.categories.indexOf('OFFICES');
            // if the name contains ATM in it
            if (_newName.match(/\batm\b/ig) !== null) {
                if (_ixOffices === 0) {
                    _buttonBanner.bankType1 = new Flag.BankType1();
                    _buttonBanner.bankBranch = new Flag.BankBranch();
                    _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                    _buttonBanner.bankCorporate = new Flag.BankCorporate();
                } else if (_ixBank === -1 && _ixATM === -1) {
                    _buttonBanner.bankBranch = new Flag.BankBranch();
                    _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                } else if (_ixATM === 0 && _ixBank > 0) {
                    _buttonBanner.bankBranch = new Flag.BankBranch();
                } else if (_ixBank > -1) {
                    _buttonBanner.bankBranch = new Flag.BankBranch();
                    _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                }
                // Net result: If the place has ATM cat only and ATM in the name, then it will be green
            } else if (_ixBank > -1 || _ixATM > -1) { // if no ATM in name:
                if (_ixOffices === 0) {
                    _buttonBanner.bankBranch = new Flag.BankBranch();
                } else if (_ixBank > -1 && _ixATM === -1) {
                    _buttonBanner.addATM = new Flag.AddATM();
                } else if (_ixATM === 0 && _ixBank === -1) {
                    _buttonBanner.bankBranch = new Flag.BankBranch();
                    _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                } else if (_ixBank > 0 && _ixATM > 0) {
                    _buttonBanner.bankBranch = new Flag.BankBranch();
                    _buttonBanner.standaloneATM = new Flag.StandaloneATM();
                }
                // Net result: If the place has Bank category first, then it will be green
            } // END generic bank treatment
        } // END PNH match/no-match updates

        // Category/Name-based Services, added to any existing services:
        const catData = _PNH_DATA[_countryCode].categories;
        const catNames = _PNH_DATA[_countryCode].categoryNames;
        const catDataHeaders = catData[0].split('|');
        const catDataKeys = catData[1].split('|');
        let catDataTemp;

        if (hpMode.harmFlag) {
            // Update name:
            if ((_newName + (newNameSuffix || '')) !== item.attributes.name) {
                phlogdev('Name updated');
                actions.push(new UpdateObject(item, { name: _newName + (newNameSuffix || '') }));
                // actions.push(new UpdateObject(item, { name: newName }));
                _UPDATED_FIELDS.name.updated = true;
            }

            // Update aliases
            _newAliases = removeSFAliases(_newName, _newAliases);
            if (_newAliases.some(alias => !item.attributes.aliases.includes(alias)) || _newAliases.length !== item.attributes.aliases.length) {
                phlogdev('Alt Names updated');
                actions.push(new UpdateObject(item, { aliases: _newAliases }));
                _UPDATED_FIELDS.aliases.updated = true;
            }

            // Make PNH submission links
            let regionFormURL = '';
            let newPlaceAddon = '';
            let approvalAddon = '';
            const approvalMessage = `Submitted via WMEPH. PNH order number ${pnhOrderNum}`;
            const encodedTempSubmitName = encodeURIComponent(_newName);
            const encodedPlacePL = encodeURIComponent(placePL);
            const encodedUrlSubmit = encodeURIComponent(newURLSubmit);
            const suffix = _USER.name + gFormState;
            switch (region) {
                case 'NWR': regionFormURL = 'https://docs.google.com/forms/d/1hv5hXBlGr1pTMmo4n3frUx1DovUODbZodfDBwwTc7HE/viewform';
                    newPlaceAddon = `?entry.925969794=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.925969794=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'SWR': regionFormURL = 'https://docs.google.com/forms/d/1Qf2N4fSkNzhVuXJwPBJMQBmW0suNuy8W9itCo1qgJL4/viewform';
                    newPlaceAddon = `?entry.1497446659=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.1497446659=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'HI': regionFormURL = 'https://docs.google.com/forms/d/1K7Dohm8eamIKry3KwMTVnpMdJLaMIyDGMt7Bw6iqH_A/viewform';
                    newPlaceAddon = `?entry.1497446659=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.1497446659=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'PLN': regionFormURL = 'https://docs.google.com/forms/d/1ycXtAppoR5eEydFBwnghhu1hkHq26uabjUu8yAlIQuI/viewform';
                    newPlaceAddon = `?entry.925969794=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.925969794=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'SCR': regionFormURL = 'https://docs.google.com/forms/d/1KZzLdlX0HLxED5Bv0wFB-rWccxUp2Mclih5QJIQFKSQ/viewform';
                    newPlaceAddon = `?entry.925969794=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.925969794=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'TX': regionFormURL = 'https://docs.google.com/forms/d/1x7VM7ofPOKVnWOaX7d70OWXpnVKf6Mkadn4dgYxx4ic/viewform';
                    newPlaceAddon = `?entry.925969794=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.925969794=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'GLR': regionFormURL = 'https://docs.google.com/forms/d/19btj-Qt2-_TCRlcS49fl6AeUT95Wnmu7Um53qzjj9BA/viewform';
                    newPlaceAddon = `?entry.925969794=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.925969794=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'SAT': regionFormURL = 'https://docs.google.com/forms/d/1bxgK_20Jix2ahbmUvY1qcY0-RmzUBT6KbE5kjDEObF8/viewform';
                    newPlaceAddon = `?entry.2063110249=${encodedTempSubmitName}&entry.2018912633=${encodedUrlSubmit}&entry.1924826395=${suffix}`;
                    approvalAddon = `?entry.2063110249=${pnhNameTempWeb}&entry.123778794=${approvalMessage}&entry.1924826395=${suffix}`;
                    break;
                case 'SER': regionFormURL = 'https://docs.google.com/forms/d/1jYBcxT3jycrkttK5BxhvPXR240KUHnoFMtkZAXzPg34/viewform';
                    newPlaceAddon = `?entry.822075961=${encodedTempSubmitName}&entry.1422079728=${encodedUrlSubmit}&entry.1891389966=${suffix}`;
                    approvalAddon = `?entry.822075961=${pnhNameTempWeb}&entry.607048307=${approvalMessage}&entry.1891389966=${suffix}`;
                    break;
                case 'ATR': regionFormURL = 'https://docs.google.com/forms/d/1v7JhffTfr62aPSOp8qZHA_5ARkBPldWWJwDeDzEioR0/viewform';
                    newPlaceAddon = `?entry.925969794=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.925969794=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'NER': regionFormURL = 'https://docs.google.com/forms/d/1UgFAMdSQuJAySHR0D86frvphp81l7qhEdJXZpyBZU6c/viewform';
                    newPlaceAddon = `?entry.925969794=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.925969794=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'NOR': regionFormURL = 'https://docs.google.com/forms/d/1iYq2rd9HRd-RBsKqmbHDIEBGuyWBSyrIHC6QLESfm4c/viewform';
                    newPlaceAddon = `?entry.925969794=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.925969794=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'MAR': regionFormURL = 'https://docs.google.com/forms/d/1PhL1iaugbRMc3W-yGdqESoooeOz-TJIbjdLBRScJYOk/viewform';
                    newPlaceAddon = `?entry.925969794=${encodedTempSubmitName}&entry.1970139752=${encodedUrlSubmit}&entry.1749047694=${suffix}`;
                    approvalAddon = `?entry.925969794=${pnhNameTempWeb}&entry.50214576=${approvalMessage}&entry.1749047694=${suffix}`;
                    break;
                case 'CA_EN': regionFormURL = 'https://docs.google.com/forms/d/13JwXsrWPNmCdfGR5OVr5jnGZw-uNGohwgjim-JYbSws/viewform';
                    newPlaceAddon = `?entry_839085807=${encodedTempSubmitName}&entry_1067461077=${encodedUrlSubmit}&entry_318793106=${
                        _USER.name}&entry_1149649663=${encodedPlacePL}`;
                    approvalAddon = `?entry_839085807=${pnhNameTempWeb}&entry_1125435193=${approvalMessage}&entry_318793106=${
                        _USER.name}&entry_1149649663=${encodedPlacePL}`;
                    break;
                case 'QC': regionFormURL = 'https://docs.google.com/forms/d/13JwXsrWPNmCdfGR5OVr5jnGZw-uNGohwgjim-JYbSws/viewform';
                    newPlaceAddon = `?entry_839085807=${encodedTempSubmitName}&entry_1067461077=${encodedUrlSubmit}&entry_318793106=${
                        _USER.name}&entry_1149649663=${encodedPlacePL}`;
                    approvalAddon = `?entry_839085807=${pnhNameTempWeb}&entry_1125435193=${approvalMessage}&entry_318793106=${
                        _USER.name}&entry_1149649663=${encodedPlacePL}`;
                    break;
                default: regionFormURL = '';
            }
            _newPlaceURL = regionFormURL + newPlaceAddon;
            _approveRegionURL = regionFormURL + approvalAddon;


            // PNH specific Services:

            const servHeaders = [];
            const servKeys = [];
            for (let jjj = 0; jjj < catDataHeaders.length; jjj++) {
                const servHeaderCheck = catDataHeaders[jjj].match(/^ps_/i); // if it's a service header
                if (servHeaderCheck) {
                    servHeaders.push(jjj);
                    servKeys.push(catDataKeys[jjj]);
                }
            }

            if (_newCategories.length > 0) {
                for (let iii = 0; iii < catNames.length; iii++) {
                    if (_newCategories.includes(catNames[iii])) {
                        catDataTemp = catData[iii].split('|');
                        for (let psix = 0; psix < servHeaders.length; psix++) {
                            if (!_servicesBanner[servKeys[psix]].pnhOverride) {
                                if (catDataTemp[servHeaders[psix]] === '1') { // These are automatically added to all countries/regions (if auto setting is on)
                                    _servicesBanner[servKeys[psix]].active = true;
                                    if ($('#WMEPH-EnableServices').prop('checked')) {
                                        // Automatically enable new services
                                        _servicesBanner[servKeys[psix]].actionOn(actions);
                                    }
                                } else if (catDataTemp[servHeaders[psix]] === '2') { // these are never automatically added but shown
                                    _servicesBanner[servKeys[psix]].active = true;
                                } else if (catDataTemp[servHeaders[psix]] !== '') { // check for state/region auto add
                                    _servicesBanner[servKeys[psix]].active = true;
                                    if ($('#WMEPH-EnableServices').prop('checked')) {
                                        const servAutoRegion = catDataTemp[servHeaders[psix]].replace(/,[^A-za-z0-9]*/g, ',').split(',');
                                        // if the sheet data matches the state, region, or username then auto add
                                        if (servAutoRegion.includes(state2L) || servAutoRegion.includes(region)
                                            || servAutoRegion.includes(_USER.name)) {
                                            _servicesBanner[servKeys[psix]].actionOn(actions);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        const isPoint = item.isPoint();
        // NOTE: do not use is2D() function. It doesn't seem to be 100% reliable.
        const isArea = !isPoint;
        let maxPointSeverity = 0;
        let maxAreaSeverity = 3;
        let highestCategoryLock = -1;

        for (let ixPlaceCat = 0; ixPlaceCat < _newCategories.length; ixPlaceCat++) {
            const category = _newCategories[ixPlaceCat];
            const ixPNHCat = catNames.indexOf(category);
            if (ixPNHCat > -1) {
                catDataTemp = catData[ixPNHCat].split('|');
                // CH_DATA_headers
                // pc_area    pc_regpoint    pc_regarea    pc_lock1    pc_lock2    pc_lock3    pc_lock4    pc_lock5    pc_rare    pc_parent    pc_message
                let pvaPoint = catDataTemp[catDataHeaders.indexOf('pc_point')];
                let pvaArea = catDataTemp[catDataHeaders.indexOf('pc_area')];
                const regPoint = catDataTemp[catDataHeaders.indexOf('pc_regpoint')].replace(/,[^A-za-z0-9]*/g, ',').split(',');
                const regArea = catDataTemp[catDataHeaders.indexOf('pc_regarea')].replace(/,[^A-za-z0-9]*/g, ',').split(',');
                if (regPoint.includes(state2L) || regPoint.includes(region) || regPoint.includes(_countryCode)) {
                    pvaPoint = '1';
                    pvaArea = '';
                } else if (regArea.includes(state2L) || regArea.includes(region) || regArea.includes(_countryCode)) {
                    pvaPoint = '';
                    pvaArea = '1';
                }

                // If Post Office and VPO or CPU is in the name, always a point.
                if (_newCategories.includes('POST_OFFICE') && /\b(?:cpu|vpo)\b/i.test(item.attributes.name)) {
                    pvaPoint = '1';
                    pvaArea = '';
                }

                const pointSeverity = getPvaSeverity(pvaPoint, item);
                const areaSeverity = getPvaSeverity(pvaArea, item);

                if (isPoint && pointSeverity > 0) {
                    maxPointSeverity = Math.max(pointSeverity, maxPointSeverity);
                } else if (isArea) {
                    maxAreaSeverity = Math.min(areaSeverity, maxAreaSeverity);
                }

                // display any messages regarding the category
                const catMessage = catDataTemp[catDataHeaders.indexOf('pc_message')];
                _buttonBanner.pnhCatMess = Flag.PnhCatMess.eval(catMessage, _newCategories, hpMode).flag;
                // Unmapped categories
                const catRare = catDataTemp[catDataHeaders.indexOf('pc_rare')].replace(/,[^A-Za-z0-9}]+/g, ',').split(',');
                if (catRare.includes(state2L) || catRare.includes(region) || catRare.includes(_countryCode)) {
                    if (catDataTemp[0] === 'OTHER' && ['GLR', 'NER', 'NWR', 'PLN', 'SCR', 'SER', 'NOR', 'HI', 'SAT'].includes(region)) {
                        if (!isLocked) {
                            _buttonBanner.unmappedRegion = new Flag.UnmappedRegion();
                            _buttonBanner.unmappedRegion.WLactive = false;
                            _buttonBanner.unmappedRegion.severity = 1;
                            _buttonBanner.unmappedRegion.message = 'The "Other" category should only be used if no other category applies.  Manually lock the place to override this flag.';
                            lockOK = false;
                        }
                    } else {
                        _buttonBanner.unmappedRegion = new Flag.UnmappedRegion();
                        if (_wl.unmappedRegion) {
                            _buttonBanner.unmappedRegion.WLactive = false;
                            _buttonBanner.unmappedRegion.severity = 0;
                        } else {
                            lockOK = false;
                        }
                    }
                }
                // Parent Category
                const catParent = catDataTemp[catDataHeaders.indexOf('pc_parent')].replace(/,[^A-Za-z0-9}]+/g, ',').split(',');
                if (catParent.includes(state2L) || catParent.includes(region) || catParent.includes(_countryCode)) {
                    _buttonBanner.parentCategory = new Flag.ParentCategory();
                    if (_wl.parentCategory) {
                        _buttonBanner.parentCategory.WLactive = false;
                    }
                }
                // Set lock level
                for (let lockix = 1; lockix < 6; lockix++) {
                    const catLockTemp = catDataTemp[catDataHeaders.indexOf(`pc_lock${lockix}`)].replace(/,[^A-Za-z0-9}]+/g, ',').split(',');
                    if (lockix - 1 > highestCategoryLock && (catLockTemp.includes(state2L) || catLockTemp.includes(region)
                        || catLockTemp.includes(_countryCode))) {
                        highestCategoryLock = lockix - 1; // Offset by 1 since lock ranks start at 0
                    }
                }
            }
        }

        if (highestCategoryLock > -1) {
            _defaultLockLevel = highestCategoryLock;
        }

        if (isPoint) {
            if (maxPointSeverity === 3) {
                _buttonBanner.areaNotPoint = new Flag.AreaNotPoint();
                if (_wl.areaNotPoint || item.attributes.lockRank >= _defaultLockLevel) {
                    _buttonBanner.areaNotPoint.WLactive = false;
                    _buttonBanner.areaNotPoint.severity = 0;
                } else {
                    lockOK = false;
                }
            } else if (maxPointSeverity === 2) {
                _buttonBanner.areaNotPointMid = new Flag.AreaNotPointMid();
                if (_wl.areaNotPoint || item.attributes.lockRank >= _defaultLockLevel) {
                    _buttonBanner.areaNotPointMid.WLactive = false;
                    _buttonBanner.areaNotPointMid.severity = 0;
                } else {
                    lockOK = false;
                }
            } else if (maxPointSeverity === 1) {
                _buttonBanner.areaNotPointLow = new Flag.AreaNotPointLow();
                if (_wl.areaNotPoint || item.attributes.lockRank >= _defaultLockLevel) {
                    _buttonBanner.areaNotPointLow.WLactive = false;
                    _buttonBanner.areaNotPointLow.severity = 0;
                }
            }
        } else if (maxAreaSeverity === 3) {
            _buttonBanner.pointNotArea = new Flag.PointNotArea();
            if (_wl.pointNotArea || item.attributes.lockRank >= _defaultLockLevel) {
                _buttonBanner.pointNotArea.WLactive = false;
                _buttonBanner.pointNotArea.severity = 0;
            } else {
                lockOK = false;
            }
        } else if (maxAreaSeverity === 2) {
            _buttonBanner.pointNotAreaMid = new Flag.PointNotAreaMid();
            if (_wl.pointNotArea || item.attributes.lockRank >= _defaultLockLevel) {
                _buttonBanner.pointNotAreaMid.WLactive = false;
                _buttonBanner.pointNotAreaMid.severity = 0;
            } else {
                lockOK = false;
            }
        } else if (maxAreaSeverity === 1) {
            _buttonBanner.pointNotAreaLow = new Flag.PointNotAreaLow();
            if (_wl.pointNotArea || item.attributes.lockRank >= _defaultLockLevel) {
                _buttonBanner.pointNotAreaLow.WLactive = false;
                _buttonBanner.pointNotAreaLow.severity = 0;
            }
        }

        const anpNone = _COLLEGE_ABBREVIATIONS.split('|');
        for (let cii = 0; cii < anpNone.length; cii++) {
            const anpNoneRE = new RegExp(`\\b${anpNone[cii]}\\b`, 'g');
            if (_newName.match(anpNoneRE) !== null && _buttonBanner.areaNotPointLow) {
                _buttonBanner.areaNotPointLow.severity = 0;
                _buttonBanner.areaNotPointLow.WLactive = false;
            }
        }

        // Check for missing hours field
        if (item.attributes.openingHours.length === 0) { // if no hours...
            if (!containsAny(_newCategories, ['STADIUM_ARENA', 'CEMETERY', 'TRANSPORTATION', 'FERRY_PIER', 'SUBWAY_STATION',
                'BRIDGE', 'TUNNEL', 'JUNCTION_INTERCHANGE', 'ISLAND', 'SEA_LAKE_POOL', 'RIVER_STREAM', 'FOREST_GROVE', 'CANAL',
                'SWAMP_MARSH', 'DAM'])) {
                _buttonBanner.noHours = new Flag.NoHours();
                if (_wl.noHours || $('#WMEPH-DisableHoursHL').prop('checked') || containsAny(_newCategories, ['SCHOOL', 'CONVENTIONS_EVENT_CENTER',
                    'CAMPING_TRAILER_PARK', 'COTTAGE_CABIN', 'COLLEGE_UNIVERSITY', 'GOLF_COURSE', 'SPORTS_COURT', 'MOVIE_THEATER',
                    'SHOPPING_CENTER', 'RELIGIOUS_CENTER', 'PARKING_LOT', 'PARK', 'PLAYGROUND', 'AIRPORT', 'FIRE_DEPARTMENT', 'POLICE_STATION',
                    'SEAPORT_MARINA_HARBOR', 'FARM', 'SCENIC_LOOKOUT_VIEWPOINT'])) {
                    _buttonBanner.noHours.WLactive = false;
                    _buttonBanner.noHours.severity = 0;
                }
            }
        } else {
            if (item.attributes.openingHours.length === 1) { // if one set of hours exist, check for partial 24hrs setting
                const hoursEntry = item.attributes.openingHours[0];
                if (hoursEntry.days.length < 7 && /^0?0:00$/.test(hoursEntry.fromHour)
                    && (/^0?0:00$/.test(hoursEntry.toHour) || hoursEntry.toHour === '23:59')) {
                    _buttonBanner.mismatch247 = new Flag.Mismatch247();
                }
            }
            _buttonBanner.noHours = new Flag.NoHours();
            _buttonBanner.noHours.severity = 0;
            _buttonBanner.noHours.WLactive = false;
            _buttonBanner.noHours.message = getHoursHtml('Hours');
        }
        if (!checkHours(item.attributes.openingHours)) {
            _buttonBanner.hoursOverlap = new Flag.HoursOverlap();
            _buttonBanner.noHours = new Flag.NoHours();
        } else {
            const tempHours = item.attributes.openingHours.slice();
            for (let ohix = 0; ohix < item.attributes.openingHours.length; ohix++) {
                if (tempHours[ohix].days.length === 2 && tempHours[ohix].days[0] === 1 && tempHours[ohix].days[1] === 0) {
                    // separate hours
                    phlogdev('Correcting M-S entry...');
                    tempHours.push(new OpeningHour({ days: [0], fromHour: tempHours[ohix].fromHour, toHour: tempHours[ohix].toHour }));
                    tempHours[ohix].days = [1];
                    actions.push(new UpdateObject(item, { openingHours: tempHours }));
                }
            }
        }

        if (hpMode.harmFlag) {
            // Highlight 24/7 button if hours are set that way, and add button for all places
            if (isAlwaysOpen(item)) {
                _servicesBanner.add247.checked = true;
            }
            _servicesBanner.add247.active = true;
        }

        // URL updating
        _updateURL = true;
        if (_newURL !== item.attributes.url && !isNullOrWhitespace(_newURL)) {
            if (pnhNameRegMatch && item.attributes.url !== null && item.attributes.url !== '' && _newURL !== 'badURL') { // for cases where there is an existing URL in the WME place, and there is a PNH url on queue:
                let newURLTemp = normalizeURL(_newURL, true, false, item); // normalize
                const itemURL = normalizeURL(item.attributes.url, true, false, item);
                newURLTemp = newURLTemp.replace(/^www\.(.*)$/i, '$1'); // strip www
                const itemURLTemp = itemURL.replace(/^www\.(.*)$/i, '$1'); // strip www
                if (newURLTemp !== itemURLTemp) { // if formatted URLs don't match, then alert the editor to check the existing URL
                    _buttonBanner.longURL = new Flag.LongURL(placePL);
                    if (_wl.longURL) {
                        _buttonBanner.longURL.severity = 0;
                        _buttonBanner.longURL.WLactive = false;
                    }
                    if (hpMode.harmFlag && _updateURL && itemURL !== item.attributes.url) { // Update the URL
                        phlogdev('URL formatted');
                        actions.push(new UpdateObject(item, { url: itemURL }));
                        _UPDATED_FIELDS.url.updated = true;
                    }
                    _updateURL = false;
                    _tempPNHURL = _newURL;
                }
            }
            if (hpMode.harmFlag && _updateURL && _newURL !== 'badURL' && _newURL !== item.attributes.url) { // Update the URL
                phlogdev('URL updated');
                actions.push(new UpdateObject(item, { url: _newURL }));
                _UPDATED_FIELDS.url.updated = true;
            }
        }

        // Phone formatting
        let outputFormat = '({0}) {1}-{2}';
        if (containsAny(['CA', 'CO'], [region, state2L]) && (/^\d{3}-\d{3}-\d{4}$/.test(item.attributes.phone))) {
            outputFormat = '{0}-{1}-{2}';
        } else if (region === 'SER' && !(/^\(\d{3}\) \d{3}-\d{4}$/.test(item.attributes.phone))) {
            outputFormat = '{0}-{1}-{2}';
        } else if (region === 'GLR') {
            outputFormat = '{0}-{1}-{2}';
        } else if (state2L === 'NV') {
            outputFormat = '{0}-{1}-{2}';
        } else if (_countryCode === 'CAN') {
            outputFormat = '+1-{0}-{1}-{2}';
        }
        _newPhone = normalizePhone(item.attributes.phone, outputFormat, 'existing', item, region);

        // Check if valid area code  #LOC# USA and CAN only
        if (!_wl.aCodeWL && (_countryCode === 'USA' || _countryCode === 'CAN')) {
            if (_newPhone !== null && _newPhone.match(/[2-9]\d{2}/) !== null) {
                const areaCode = _newPhone.match(/[2-9]\d{2}/)[0];
                if (!_areaCodeList.includes(areaCode)) {
                    _buttonBanner.badAreaCode = new Flag.BadAreaCode(_newPhone, outputFormat);
                }
            }
        }
        if (hpMode.harmFlag && _newPhone !== item.attributes.phone) {
            phlogdev('Phone updated');
            actions.push(new UpdateObject(item, { phone: _newPhone }));
            _UPDATED_FIELDS.phone.updated = true;
        }

        // Post Office check
        if (_countryCode === 'USA' && !_newCategories.includes('PARKING_LOT')) {
            if (!_newCategories.includes('POST_OFFICE')) {
                _buttonBanner.isThisAPostOffice = Flag.IsThisAPostOffice.eval(item, _newName).flag;
            } else {
                if (hpMode.harmFlag) {
                    _customStoreFinderURL = 'https://tools.usps.com/go/POLocatorAction.action';
                    _customStoreFinder = true;
                    _buttonBanner.PlaceWebsite = new Flag.PlaceWebsite();
                    _buttonBanner.NewPlaceSubmit = null;
                    if (item.attributes.url !== 'usps.com') {
                        actions.push(new UpdateObject(item, { url: 'usps.com' }));
                        _UPDATED_FIELDS.url.updated = true;
                        _buttonBanner.urlMissing = null;
                    }
                }

                let postOfficeRegEx;
                if (state2L === 'KY' || (state2L === 'NY' && addr.city && ['Queens', 'Bronx', 'Manhattan', 'Brooklyn', 'Staten Island'].includes(addr.city.attributes.name))) {
                    postOfficeRegEx = /^post office \d{5}( [-–](?: cpu| vpo)?(?: [a-z]+){1,})?$/i;
                } else {
                    postOfficeRegEx = /^post office [-–](?: cpu| vpo)?(?: [a-z]+){1,}$/i;
                }
                _newName = _newName.trimLeft().replace(/ {2,}/, ' ');
                if (newNameSuffix) {
                    newNameSuffix = newNameSuffix.trimRight().replace(/\bvpo\b/i, 'VPO').replace(/\bcpu\b/i, 'CPU').replace(/ {2,}/, ' ');
                }
                const nameToCheck = _newName + (newNameSuffix || '');
                if (!postOfficeRegEx.test(nameToCheck)) {
                    _buttonBanner.formatUSPS = new Flag.FormatUSPS();
                    lockOK = false;
                } else if (hpMode.harmFlag) {
                    if (nameToCheck !== item.attributes.name) {
                        actions.push(new UpdateObject(item, { name: nameToCheck }));
                    }
                    _buttonBanner.catPostOffice = new Flag.CatPostOffice();
                }
                if (!_newAliases.some(alias => alias.toUpperCase() === 'USPS')) {
                    if (hpMode.harmFlag) {
                        _newAliases.push('USPS');
                        actions.push(new UpdateObject(item, { aliases: _newAliases }));
                        _UPDATED_FIELDS.aliases.updated = true;
                    } else {
                        _buttonBanner.missingUSPSAlt = new Flag.MissingUSPSAlt();
                    }
                }
                if (!_newAliases.some(alias => /\d{5}/.test(alias))) {
                    _buttonBanner.missingUSPSZipAlt = new Flag.MissingUSPSZipAlt();
                    if (_wl.missingUSPSZipAlt) {
                        _buttonBanner.missingUSPSZipAlt.severity = 0;
                        _buttonBanner.missingUSPSZipAlt.WLactive = false;
                    }
                    // If the zip code appears in the primary name, pre-fill it in the text entry box.
                    const zipMatch = _newName.match(/\d{5}/);
                    if (zipMatch) {
                        _buttonBanner.missingUSPSZipAlt.suggestedValue = zipMatch;
                    }
                }
                const descr = item.attributes.description;
                const lines = descr.split('\n');
                if (lines.length < 1 || !/^.{2,}, [A-Z]{2}\s{1,2}\d{5}$/.test(lines[0])) {
                    _buttonBanner.missingUSPSDescription = new Flag.MissingUSPSDescription();
                    if (_wl.missingUSPSDescription) {
                        _buttonBanner.missingUSPSDescription.severity = 0;
                        _buttonBanner.missingUSPSDescription.WLactive = false;
                    }
                }
            }
        } // END Post Office check
    } // END if (!residential && has name)

    // For gas stations, check to make sure brand exists somewhere in the place name.
    // Remove non - alphanumeric characters first, for more relaxed matching.
    if (_newCategories[0] === 'GAS_STATION' && item.attributes.brand) {
        const compressedName = item.attributes.name.toUpperCase().replace(/[^a-zA-Z0-9]/g, '');
        const compressedNewName = _newName.toUpperCase().replace(/[^a-zA-Z0-9]/g, '');
        // Some brands may have more than one acceptable name, or the brand listed in WME doesn't match what we want to see in the name.
        // Ideally, this would be addressed in the PNH spreadsheet somehow, but for now hardcoding is the only option.
        const compressedBrands = [newBrand.toUpperCase().replace(/[^a-zA-Z0-9]/g, '')];
        if (newBrand === 'Diamond Gasoline') {
            compressedBrands.push('DIAMONDOIL');
        } else if (newBrand === 'Murphy USA') {
            compressedBrands.push('MURPHY');
        } else if (newBrand === 'Mercury Fuel') {
            compressedBrands.push('MERCURY', 'MERCURYPRICECUTTER');
        } else if (newBrand === 'Carrollfuel') {
            compressedBrands.push('CARROLLMOTORFUEL', 'CARROLLMOTORFUELS');
        }
        if (compressedBrands.every(compressedBrand => !compressedName.includes(compressedBrand) && !compressedNewName.includes(compressedBrand))) {
            _buttonBanner.gasMismatch = new Flag.GasMismatch();
            if (_wl.gasMismatch) {
                _buttonBanner.gasMismatch.WLactive = false;
            } else {
                lockOK = false;
            }
        }
    }

    // Brand checking (be sure to check this after determining if brand will be forced, when harmonzing)
    result = Flag.GasNoBrand.eval(item, newBrand);
    _buttonBanner.gasNoBrand = result.flag;
    if (result.noLock) lockOK = false;

    result = Flag.GasUnbranded.eval(item, newBrand);
    _buttonBanner.gasUnbranded = result.flag;
    if (result.noLock) lockOK = false;

    // Name check
    if (!item.attributes.residential && (!_newName || _newName.replace(/[^A-Za-z0-9]/g, '').length === 0)) {
        if (item.isParkingLot()) {
            // If it's a parking lot and not locked to R3...
            if (item.attributes.lockRank < 2) {
                lockOK = false;
                _buttonBanner.plaNameMissing = new Flag.PlaNameMissing();
            }
        } else if (!['ISLAND', 'FOREST_GROVE', 'SEA_LAKE_POOL', 'RIVER_STREAM', 'CANAL'].includes(item.attributes.categories[0])) {
            _buttonBanner.nameMissing = new Flag.NameMissing();
            lockOK = false;
        }
    }

    _buttonBanner.plaNameNonStandard = Flag.PlaNameNonStandard.eval(item, _wl).flag;

    // Public parking lot warning message:
    if (item.isParkingLot() && item.attributes.categoryAttributes && item.attributes.categoryAttributes.PARKING_LOT
        && item.attributes.categoryAttributes.PARKING_LOT.parkingType === 'PUBLIC') {
        _buttonBanner.plaIsPublic = new Flag.PlaIsPublic();
        // Add the buttons to the message.
        _buttonBanner.plaIsPublic.message += [
            ['RESTRICTED', 'Restricted'],
            ['PRIVATE', 'Private']
        ].map(
            btnInfo => $('<button>', { class: 'wmeph-pla-lot-type-btn btn btn-default btn-xs wmeph-btn', 'data-lot-type': btnInfo[0] })
                .text(btnInfo[1])
                .prop('outerHTML')
        ).join('');
    }

    // House number / HN check
    let currentHN = item.attributes.houseNumber;
    // Check to see if there's an action that is currently updating the house number.
    const updateHnAction = actions && actions.find(action => action.newAttributes && action.newAttributes.houseNumber);
    if (updateHnAction) currentHN = updateHnAction.newAttributes.houseNumber;
    // Use the inferred address street if currently no street.
    const hasStreet = item.attributes.streetID || (inferredAddress && inferredAddress.street);

    if (hasStreet && (!currentHN || currentHN.replace(/\D/g, '').length === 0)) {
        if (!'BRIDGE|ISLAND|FOREST_GROVE|SEA_LAKE_POOL|RIVER_STREAM|CANAL|DAM|TUNNEL|JUNCTION_INTERCHANGE'.split('|').includes(item.attributes.categories[0])) {
            _buttonBanner.hnMissing = new Flag.HnMissing(item);
            if (state2L === 'PR' || ['SCENIC_LOOKOUT_VIEWPOINT'].includes(item.attributes.categories[0])) {
                _buttonBanner.hnMissing.severity = 0;
                _buttonBanner.hnMissing.WLactive = false;
            } else if (item.isParkingLot()) {
                _buttonBanner.hnMissing.WLactive = false;
                if (item.attributes.lockRank < 2) {
                    lockOK = false;
                    let msgAdd;
                    if (_USER.rank < 3) {
                        msgAdd = 'Request an R3+ lock to confirm no HN.';
                    } else {
                        msgAdd = 'Lock to R3+ to confirm no HN.';
                    }
                    _buttonBanner.hnMissing.suffixMessage = msgAdd;
                    _buttonBanner.hnMissing.severity = 1;
                } else {
                    _buttonBanner.hnMissing.severity = 0;
                }
            } else if (_wl.HNWL) {
                _buttonBanner.hnMissing.severity = 0;
                _buttonBanner.hnMissing.WLactive = false;
            } else {
                lockOK = false;
            }
        }
    } else if (currentHN) {
        let hnOK = false;
        let updateHNflag = false;
        const hnTemp = currentHN.replace(/[^\d]/g, ''); // Digits only
        const hnTempDash = currentHN.replace(/[^\d-]/g, ''); // Digits and dashes only
        if (hnTemp < 1000000 && state2L === 'NY' && addr.city.attributes.name === 'Queens' && hnTempDash.match(/^\d{1,4}-\d{1,4}$/g) !== null) {
            updateHNflag = true;
            hnOK = true;
        }
        if (hnTemp === currentHN && hnTemp < 1000000) { //  general check that HN is 6 digits or less, & that it is only [0-9]
            hnOK = true;
        }
        if (state2L === 'HI' && hnTempDash.match(/^\d{1,2}-\d{1,4}$/g) !== null) {
            if (hnTempDash === hnTempDash.match(/^\d{1,2}-\d{1,4}$/g)[0]) {
                hnOK = true;
            }
        }

        if (!hnOK) {
            _buttonBanner.hnNonStandard = new Flag.HnNonStandard();
            if (_wl.hnNonStandard) {
                _buttonBanner.hnNonStandard.WLactive = false;
                _buttonBanner.hnNonStandard.severity = 0;
            } else {
                lockOK = false;
            }
        }
        if (updateHNflag) {
            _buttonBanner.hnDashRemoved = new Flag.HnDashRemoved();
            if (hpMode.harmFlag) {
                actions.push(new UpdateObject(item, { houseNumber: hnTemp }));
                _UPDATED_FIELDS.address.updated = true;
            } else if (hpMode.hlFlag) {
                if (item.attributes.residential) {
                    _buttonBanner.hnDashRemoved.severity = 3;
                } else {
                    _buttonBanner.hnDashRemoved.severity = 1;
                }
            }
        }
    }

    if ((!addr.city || addr.city.attributes.isEmpty)
        && !'BRIDGE|ISLAND|FOREST_GROVE|SEA_LAKE_POOL|RIVER_STREAM|CANAL|DAM|TUNNEL|JUNCTION_INTERCHANGE'.split('|').includes(item.attributes.categories[0])) {
        _buttonBanner.cityMissing = new Flag.CityMissing();
        if (item.attributes.residential && hpMode.hlFlag) {
            _buttonBanner.cityMissing.severity = 1;
        }
        lockOK = false;
    }
    if (addr.city && (!addr.street || addr.street.isEmpty)
        && !'BRIDGE|ISLAND|FOREST_GROVE|SEA_LAKE_POOL|RIVER_STREAM|CANAL|DAM|TUNNEL|JUNCTION_INTERCHANGE'.split('|').includes(item.attributes.categories[0])) {
        _buttonBanner.streetMissing = new Flag.StreetMissing();
        if (['SCENIC_LOOKOUT_VIEWPOINT'].includes(item.attributes.categories[0])) {
            _buttonBanner.streetMissing.severity = 1;
        } else {
            lockOK = false;
        }
    }

    _buttonBanner.notAHospital = Flag.NotAHospital.eval(_newCategories).flag;

    // CATEGORY vs. NAME checks
    result = Flag.ChangeToPetVet.eval(_newName, _newCategories);
    if (result.flag) {
        _buttonBanner.changeToPetVet = result.flag;
        if (!result.lockOK) lockOK = false;
    }

    result = Flag.ChangeToDoctorClinic.eval(item, _newCategories, hpMode, pnhNameRegMatch);
    if (result.flag) {
        _buttonBanner.changeToPetVet = result.flag;
        if (!result.lockOK) lockOK = false;
    }

    result = Flag.NotASchool.eval(_newName, _newCategories);
    if (result.flag) {
        _buttonBanner.notASchool = result.flag;
        if (!result.lockOK) lockOK = false;
    }

    // Some cats don't need PNH messages and url/phone severities
    if (['BRIDGE', 'FOREST_GROVE', 'DAM', 'TUNNEL', 'CEMETERY'].includes(item.attributes.categories[0])) {
        _buttonBanner.NewPlaceSubmit = null;
        if (_buttonBanner.phoneMissing) {
            _buttonBanner.phoneMissing.severity = 0;
            _buttonBanner.phoneMissing.WLactive = false;
        }
        if (_buttonBanner.urlMissing) {
            _buttonBanner.urlMissing.severity = 0;
            _buttonBanner.urlMissing.WLactive = false;
        }
    } else if (['ISLAND', 'SEA_LAKE_POOL', 'RIVER_STREAM', 'CANAL', 'JUNCTION_INTERCHANGE', 'SCENIC_LOOKOUT_VIEWPOINT'].includes(item.attributes.categories[0])) {
        // Some cats don't need PNH messages and url/phone messages
        _buttonBanner.NewPlaceSubmit = null;
        _buttonBanner.phoneMissing = null;
        _buttonBanner.urlMissing = null;
    }

    // *** Rest Area parsing
    // check rest area name against standard formats or if has the right categories
    const hasRestAreaCategory = categories.includes('REST_AREAS');
    const oldName = item.attributes.name;
    if (/rest area/i.test(oldName) || /rest stop/i.test(oldName) || /service plaza/i.test(oldName) || hasRestAreaCategory) {
        if (hasRestAreaCategory) {
            if (categories.includes('SCENIC_LOOKOUT_VIEWPOINT')) {
                if (!_wl.restAreaScenic) _buttonBanner.restAreaScenic = new Flag.RestAreaScenic();
            }
            if (categories.includes('TRANSPORTATION')) {
                _buttonBanner.restAreaNoTransportation = new Flag.RestAreaNoTransportation();
            }
            if (item.isPoint()) { // needs to be area
                _buttonBanner.areaNotPoint = new Flag.AreaNotPoint();
            }
            _buttonBanner.pointNotArea = null;
            _buttonBanner.unmappedRegion = null;

            if (categories.includes('GAS_STATION')) {
                _buttonBanner.restAreaGas = new Flag.RestAreaGas();
            }

            if (oldName.match(/^Rest Area.* - /) === null) {
                _buttonBanner.restAreaName = new Flag.RestAreaName();
                if (_wl.restAreaName) {
                    _buttonBanner.restAreaName.WLactive = false;
                }
            } else if (hpMode.harmFlag) {
                const newSuffix = newNameSuffix.replace(/Mile/i, 'mile');
                if (_newName + newSuffix !== item.attributes.name) {
                    actions.push(new UpdateObject(item, { name: _newName + newSuffix }));
                    _UPDATED_FIELDS.name.updated = true;
                    phlogdev('Lower case "mile"');
                } else {
                    // The new name matches the original name, so the only change would have been to capitalize "Mile", which
                    // we don't want. So remove any previous name-change action.  Note: this feels like a hack and is probably
                    // a fragile workaround.  The name shouldn't be capitalized in the first place, unless necessary.
                    for (let i = 0; i < actions.length; i++) {
                        const action = actions[i];
                        if (action.newAttributes.name) {
                            actions.splice(i, 1);
                            _UPDATED_FIELDS.name.updated = false;
                            break;
                        }
                    }
                }
            }

            // switch to rest area wiki button
            if (hpMode.harmFlag) {
                _buttonBanner2.restAreaWiki.active = true;
                _buttonBanner2.placesWiki.active = false;
            }

            // missing address ok
            _buttonBanner.streetMissing = null;
            _buttonBanner.cityMissing = null;
            _buttonBanner.hnMissing = null;
            if (_buttonBanner.urlMissing) {
                _buttonBanner.urlMissing.WLactive = false;
                _buttonBanner.urlMissing.severity = 0;
            }
            if (_buttonBanner.phoneMissing) {
                _buttonBanner.phoneMissing.severity = 0;
                _buttonBanner.phoneMissing.WLactive = false;
            }
        } else if (!_wl.restAreaSpec) {
            _buttonBanner.restAreaSpec = new Flag.RestAreaSpec();
        }
    }

    // update Severity for banner messages
    Object.keys(_buttonBanner).forEach(key => {
        if (_buttonBanner[key] && _buttonBanner[key].active) {
            _severityButt = Math.max(_buttonBanner[key].severity, _severityButt);
        }
    });

    if (hpMode.harmFlag) {
        phlogdev(`Severity: ${_severityButt}; lockOK: ${lockOK}`);
    }
    // Place locking
    // final formatting of desired lock levels
    let levelToLock;
    if (_pnhLockLevel !== -1 && hpMode.harmFlag) {
        phlogdev(`PNHLockLevel: ${_pnhLockLevel}`);
        levelToLock = _pnhLockLevel;
    } else {
        levelToLock = _defaultLockLevel;
    }
    if (region === 'SER') {
        if (_newCategories.includes('COLLEGE_UNIVERSITY') && _newCategories.includes('PARKING_LOT')) {
            levelToLock = _LOCK_LEVEL_4;
        } else if (item.isPoint() && _newCategories.includes('COLLEGE_UNIVERSITY') && (!_newCategories.includes('HOSPITAL_MEDICAL_CARE')
            || !_newCategories.includes('HOSPITAL_URGENT_CARE'))) {
            levelToLock = _LOCK_LEVEL_4;
        }
    }

    if (levelToLock > (_USER.rank - 1)) { levelToLock = (_USER.rank - 1); } // Only lock up to the user's level

    // If gas station is missing brand, don't flag if place is locked.
    if (_buttonBanner.gasNoBrand) {
        if (item.attributes.lockRank >= levelToLock) {
            _buttonBanner.gasNoBrand = null;
        } else {
            _buttonBanner.gasNoBrand.message = `Lock to L${levelToLock + 1}+ to verify no gas brand.`;
        }
    }

    // If no Google link and severity would otherwise allow locking, ask if user wants to lock anyway.
    if (!isLocked && _buttonBanner.extProviderMissing && _buttonBanner.extProviderMissing.active && _buttonBanner.extProviderMissing.severity <= 2) {
        _buttonBanner.extProviderMissing.severity = 3;
        _severityButt = 3;
        if (lockOK) {
            _buttonBanner.extProviderMissing.value = `Lock anyway? (${levelToLock + 1})`;
            _buttonBanner.extProviderMissing.title = 'If no Google link exists, lock this place.\nIf there is still no Google link after '
                + '6 months from the last update date, it will turn red as a reminder to search again.';
            _buttonBanner.extProviderMissing.action = () => {
                const action = new UpdateObject(item, { lockRank: levelToLock });
                W.model.actionManager.add(action);
                _UPDATED_FIELDS.lock.updated = true;
                harmonizePlaceGo(item, 'harmonize');
            };
        }
    }

    let hlLockFlag = false;
    if (lockOK && _severityButt < 2) {
        if (item.attributes.lockRank < levelToLock) {
            if (hpMode.harmFlag) {
                phlogdev('Venue locked!');
                actions.push(new UpdateObject(item, { lockRank: levelToLock }));
                _UPDATED_FIELDS.lock.updated = true;
            } else if (hpMode.hlFlag) {
                hlLockFlag = true;
            }
        }
        _buttonBanner.placeLocked = new Flag.PlaceLocked();
    }

    // IGN check
    if (!item.attributes.residential) {
        const updatedBy = W.model.users.getObjectById(item.attributes.updatedBy);
        if (updatedBy && /^ign_/i.test(updatedBy.userName)) {
            _buttonBanner.ignEdited = new Flag.IgnEdited();
        }
    }

    // waze_maint_bot check
    const updatedById = item.attributes.updatedBy ? item.attributes.updatedBy : item.attributes.createdBy;
    const updatedBy = W.model.users.getObjectById(updatedById);
    const updatedByName = updatedBy ? updatedBy.userName : null;
    const botNamesAndIDs = [
        '^waze-maint', '^105774162$',
        '^waze3rdparty$', '^361008095$',
        '^WazeParking1$', '^338475699$',
        '^admin$', '^-1$',
        '^avsus$', '^107668852$'
    ];

    const botRegEx = new RegExp(botNamesAndIDs.join('|'), 'i');
    if (item.isUnchanged() && !item.attributes.residential && updatedById && (botRegEx.test(updatedById.toString())
        || (updatedByName && botRegEx.test(updatedByName)))) {
        _buttonBanner.wazeBot = new Flag.WazeBot();
    }

    // RPP Locking option for R3+
    if (item.attributes.residential) {
        if (_USER.isDevUser || _USER.isBetaUser || _USER.rank >= 3) { // Allow residential point locking by R3+
            _rppLockString = 'Lock at <select id="RPPLockLevel">';
            let ddlSelected = false;
            for (let llix = 1; llix < 6; llix++) {
                if (llix < _USER.rank + 1) {
                    if (!ddlSelected && (_defaultLockLevel === llix - 1 || llix === _USER.rank)) {
                        _rppLockString += `<option value="${llix}" selected="selected">${llix}</option>`;
                        ddlSelected = true;
                    } else {
                        _rppLockString += `<option value="${llix}">${llix}</option>`;
                    }
                }
            }
            _rppLockString += '</select>';
            _buttonBanner.lockRPP = new Flag.LockRPP();
            _buttonBanner.lockRPP.message = `Current lock: ${parseInt(item.attributes.lockRank, 10) + 1}. ${_rppLockString} ?`;
        }
    }

    // Turn off unnecessary buttons
    if (_newCategories.includes('PHARMACY')) {
        if (_buttonBanner.addPharm) _buttonBanner.addPharm = null;
    }
    if (_newCategories.includes('SUPERMARKET_GROCERY')) {
        if (_buttonBanner.addSuper) _buttonBanner.addSuper = null;
    }

    // Final alerts for non-severe locations
    if (!item.attributes.residential && _severityButt < 3) {
        const nameShortSpace = _newName.toUpperCase().replace(/[^A-Z ']/g, '');
        if (nameShortSpace.includes('\'S HOUSE') || nameShortSpace.includes('\'S HOME') || nameShortSpace.includes('\'S WORK')) {
            if (!containsAny(_newCategories, ['RESTAURANT', 'DESSERT', 'BAR']) && !pnhNameRegMatch) {
                _buttonBanner.resiTypeNameSoft = new Flag.ResiTypeNameSoft();
            }
        }
        if (['HOME', 'MY HOME', 'HOUSE', 'MY HOUSE', 'PARENTS HOUSE', 'CASA', 'MI CASA', 'WORK', 'MY WORK', 'MY OFFICE',
            'MOMS HOUSE', 'DADS HOUSE', 'MOM', 'DAD'].includes(nameShortSpace)) {
            _buttonBanner.resiTypeName = new Flag.ResiTypeName();
            if (_wl.resiTypeName) {
                _buttonBanner.resiTypeName.WLactive = false;
            }
            _buttonBanner.resiTypeNameSoft = null;
        }
        if (item.attributes.description.toLowerCase().includes('google') || item.attributes.description.toLowerCase().includes('yelp')) {
            _buttonBanner.suspectDesc = new Flag.SuspectDesc();
            if (_wl.suspectDesc) {
                _buttonBanner.suspectDesc.WLactive = false;
            }
        }
    }

    // Return severity for highlighter (no dupe run))
    if (hpMode.hlFlag) {
        // get severities from the banners
        _severityButt = 0;
        Object.keys(_buttonBanner).forEach(tempKey => {
            if (_buttonBanner[tempKey] && _buttonBanner[tempKey].active) { //  If the particular message is active
                if (_buttonBanner[tempKey].hasOwnProperty('WLactive')) {
                    if (_buttonBanner[tempKey].WLactive) { // If there's a WL option, enable it
                        _severityButt = Math.max(_buttonBanner[tempKey].severity, _severityButt);
                    }
                } else {
                    _severityButt = Math.max(_buttonBanner[tempKey].severity, _severityButt);
                }
            }
        });

        // Special case flags
        if (item.attributes.lockRank === 0 && (item.attributes.categories.includes('HOSPITAL_MEDICAL_CARE')
            || item.attributes.categories.includes('HOSPITAL_URGENT_CARE') || item.isGasStation())) {
            _severityButt = 5;
        }

        if (_severityButt === 0 && hlLockFlag) {
            _severityButt = 'lock';
        }
        if (_severityButt === 1 && hlLockFlag) {
            _severityButt = 'lock1';
        }
        if (item.attributes.adLocked) {
            _severityButt = 'adLock';
        }

        return _severityButt;
    }

    // *** Below here is for harmonization only.  HL ends in previous step.

    // Run nearby duplicate place finder function
    _dupeHNRangeList = [];
    _dupeBanner = {};
    if (_newName.replace(/[^A-Za-z0-9]/g, '').length > 0 && !item.attributes.residential && !isEmergencyRoom(item) && !isRestArea(item)) {
        if ($('#WMEPH-DisableDFZoom').prop('checked')) { // don't zoom and pan for results outside of FOV
            _duplicateName = findNearbyDuplicate(_newName, _newAliases, item, false);
        } else {
            _duplicateName = findNearbyDuplicate(_newName, _newAliases, item, true);
        }
        if (_duplicateName[1]) {
            _buttonBanner.overlapping = new Flag.Overlapping();
        }
        [_duplicateName] = _duplicateName;
        if (_duplicateName.length) {
            if (_duplicateName.length + 1 !== _dupeIDList.length && _USER.isDevUser) { // If there's an issue with the data return, allow an error report
                /* if (confirm('WMEPH: Dupefinder Error!\nClick OK to report this')) {
                    // if the category doesn't translate, then pop an alert that will make a forum post to the thread
                    reportError({
                        subject: 'WMEPH Bug report DupeID',
                        message: `Script version: ${_SCRIPT_VERSION}${_DEV_VERSION_STR}\nPermalink: ${placePL}\nPlace name: ${
                            item.attributes.name}\nCountry: ${addr.country.name}\n--------\nDescribe the error:\nDupeID mismatch with dupeName list`
                    });
                } */
                WazeWrap.Alerts.confirm(
                    _SCRIPT_NAME,
                    'WMEPH: Dupefinder Error!<br>Click OK to report this',
                    () => {
                        // if the category doesn't translate, then pop an alert that will make a forum post to the thread
                        reportError({
                            subject: 'WMEPH Bug report DupeID',
                            message: `Script version: ${_SCRIPT_VERSION}${_DEV_VERSION_STR}\nPermalink: ${placePL}\nPlace name: ${
                                item.attributes.name}\nCountry: ${addr.country.name}\n--------\nDescribe the error:\nDupeID mismatch with dupeName list`
                        });
                    },
                    () => { }
                );
            } else {
                const wlAction = dID => {
                    _wlKeyName = 'dupeWL';
                    if (!_venueWhitelist.hasOwnProperty(itemID)) { // If venue is NOT on WL, then add it.
                        _venueWhitelist[itemID] = { dupeWL: [] };
                    }
                    if (!_venueWhitelist[itemID].hasOwnProperty(_wlKeyName)) { // If dupeWL key is not in venue WL, then initialize it.
                        _venueWhitelist[itemID][_wlKeyName] = [];
                    }
                    _venueWhitelist[itemID].dupeWL.push(dID); // WL the id for the duplicate venue
                    _venueWhitelist[itemID].dupeWL = _.uniq(_venueWhitelist[itemID].dupeWL);
                    // Make an entry for the opposite item
                    if (!_venueWhitelist.hasOwnProperty(dID)) { // If venue is NOT on WL, then add it.
                        _venueWhitelist[dID] = { dupeWL: [] };
                    }
                    if (!_venueWhitelist[dID].hasOwnProperty(_wlKeyName)) { // If dupeWL key is not in venue WL, then initialize it.
                        _venueWhitelist[dID][_wlKeyName] = [];
                    }
                    _venueWhitelist[dID].dupeWL.push(itemID); // WL the id for the duplicate venue
                    _venueWhitelist[dID].dupeWL = _.uniq(_venueWhitelist[dID].dupeWL);
                    saveWhitelistToLS(true); // Save the WL to local storage
                    wmephWhitelistCounter();
                    _buttonBanner2.clearWL.active = true;
                    _dupeBanner[dID].active = false;
                    harmonizePlaceGo(item, 'harmonize');
                };
                for (let ijx = 1; ijx < _duplicateName.length + 1; ijx++) {
                    _dupeBanner[_dupeIDList[ijx]] = {
                        active: true,
                        severity: 2,
                        message: _duplicateName[ijx - 1],
                        WLactive: false,
                        WLvalue: _WL_BUTTON_TEXT,
                        WLtitle: 'Whitelist Duplicate',
                        WLaction: wlAction
                    };
                    if (_venueWhitelist.hasOwnProperty(itemID) && _venueWhitelist[itemID].hasOwnProperty('dupeWL')
                        && _venueWhitelist[itemID].dupeWL.includes(_dupeIDList[ijx])) {
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

    // Check HN range (this depends on the returned dupefinder data, so has to run after it)
    if (_dupeHNRangeList.length > 3) {
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
            arrayHNRatio.push(Math.abs((parseInt(item.attributes.houseNumber, 10) - dupeHNRangeListSorted[dhnix]) / _dupeHNRangeDistList[dhnix]));
        }
        sortWithIndex(arrayHNRatio);
        // Examine either the median or the 8th index if length is >16
        const arrayHNRatioCheckIX = Math.min(Math.round(arrayHNRatio.length / 2), 8);
        if (arrayHNRatio[arrayHNRatioCheckIX] > 1.4) {
            _buttonBanner.HNRange = new Flag.HNRange();
            if (_wl.HNRange) {
                _buttonBanner.HNRange.WLactive = false;
                _buttonBanner.HNRange.active = false;
            }
            if (arrayHNRatio[arrayHNRatioCheckIX] > 5) {
                _buttonBanner.HNRange.severity = 3;
            }
            // show stats if HN out of range
            phlogdev(`HNs: ${dupeHNRangeListSorted}`);
            phlogdev(`Distances: ${_dupeHNRangeDistList}`);
            phlogdev(`arrayHNRatio: ${arrayHNRatio}`);
            phlogdev(`HN Ratio Score: ${arrayHNRatio[Math.round(arrayHNRatio.length / 2)]}`);
        }
    }

    executeMultiAction(actions);

    if (hpMode.harmFlag) {
        // Update icons to reflect current WME place services
        updateServicesChecks(_servicesBanner);

        // Add green highlighting to edit panel fields that have been updated by WMEPH
        _UPDATED_FIELDS.updateEditPanelHighlights();
    }

    if (_buttonBanner.lockRPP) _buttonBanner.lockRPP.message = `Current lock: ${parseInt(item.attributes.lockRank, 10) + 1}. ${_rppLockString} ?`;

    // Assemble the banners
    assembleBanner(); // Make Messaging banners

    showOpenPlaceWebsiteButton();
    showSearchButton();

    // Highlighting will return a value, but no need to return a value here (for end of harmonization).
    // Adding this line to satisfy eslint.
    return undefined;
} // END harmonizePlaceGo function

// Set up banner messages
function assembleBanner() {
    const venue = getSelectedVenue();
    if (!venue) return;
    phlogdev('Building banners');
    let dupesFound = 0;
    let rowData;
    let $rowDiv;
    let rowDivs = [];
    _severityButt = 0;

    const func = elem => ({ id: elem.getAttribute('id'), val: elem.value });
    _textEntryValues = $('#WMEPH_banner input[type="text"]').toArray().map(func);
    _textEntryValues = _textEntryValues.concat($('#WMEPH_banner textarea').toArray().map(func));

    // Setup duplicates banners
    $rowDiv = $('<div class="banner-row yellow">');
    Object.keys(_dupeBanner).forEach(tempKey => {
        rowData = _dupeBanner[tempKey];
        if (rowData.active) {
            dupesFound += 1;
            const $dupeDiv = $('<div class="dupe">').appendTo($rowDiv);
            $dupeDiv.append($('<span style="margin-right:4px">').html(`&bull; ${rowData.message}`));
            if (rowData.value) {
                // Nothing happening here yet.
            }
            if (rowData.WLactive && rowData.WLaction) { // If there's a WL option, enable it
                _severityButt = Math.max(rowData.severity, _severityButt);
                $dupeDiv.append($('<button>', {
                    class: 'btn btn-success btn-xs wmephwl-btn',
                    id: `WMEPH_WL${tempKey}`,
                    title: rowData.WLtitle
                }).text(rowData.WLvalue));
            }
        }
    });
    if (dupesFound) { // if at least 1 dupe
        $rowDiv.prepend(`Possible duplicate${dupesFound > 1 ? 's' : ''}:`);
        rowDivs.push($rowDiv);
    }

    // Build banners above the Services
    Object.keys(_buttonBanner).forEach(tempKey => {
        rowData = _buttonBanner[tempKey];
        if (rowData && rowData.active) { //  If the particular message is active
            $rowDiv = $('<div class="banner-row">');
            if (rowData.severity === 3) {
                $rowDiv.addClass('red');
            } else if (rowData.severity === 2) {
                $rowDiv.addClass('yellow');
            } else if (rowData.severity === 1) {
                $rowDiv.addClass('blue');
            } else if (rowData.severity === 0) {
                $rowDiv.addClass('gray');
            }
            if (rowData.divId) {
                $rowDiv.attr('id', rowData.divId);
            }
            if (rowData.message && rowData.message.length) {
                $rowDiv.append($('<span>').css({ 'margin-right': '4px' }).append(`&bull; ${rowData.message}`));
            }
            if (rowData.value) {
                $rowDiv.append($('<button>', {
                    class: 'btn btn-default btn-xs wmeph-btn',
                    id: `WMEPH_${tempKey}`,
                    title: rowData.title || ''
                }).css({ 'margin-right': '4px' }).html(rowData.value));
            }
            if (rowData.value2) {
                $rowDiv.append($('<button>', {
                    class: 'btn btn-default btn-xs wmeph-btn',
                    id: `WMEPH_${tempKey}_2`,
                    title: rowData.title2 || ''
                }).css({ 'margin-right': '4px' }).html(rowData.value2));
            }
            if (rowData.WLactive) {
                if (rowData.WLaction) { // If there's a WL option, enable it
                    _severityButt = Math.max(rowData.severity, _severityButt);
                    $rowDiv.append(
                        $('<button>', { class: 'btn btn-success btn-xs wmephwl-btn', id: `WMEPH_WL${tempKey}`, title: rowData.WLtitle })
                            .text('WL')
                    );
                }
            } else {
                _severityButt = Math.max(rowData.severity, _severityButt);
            }
            if (rowData.suffixMessage) {
                $rowDiv.append($('<div>').css({ 'margin-top': '2px' }).append(rowData.suffixMessage));
            }

            rowDivs.push($rowDiv);
        }
    });

    if ($('#WMEPH-ColorHighlighting').prop('checked')) {
        venue.attributes.wmephSeverity = _severityButt;
    }

    if ($('#WMEPH_banner').length === 0) {
        $('<div id="WMEPH_banner">').prependTo('.contents');
    } else {
        $('#WMEPH_banner').empty();
    }
    let bgColor;
    switch (_severityButt) {
        case 1:
            bgColor = 'rgb(50, 50, 230)'; // blue
            break;
        case 2:
            bgColor = 'rgb(217, 173, 42)'; // yellow
            break;
        case 3:
            bgColor = 'rgb(211, 48, 48)'; // red
            break;
        default:
            bgColor = 'rgb(36, 172, 36)'; // green
    }
    $('#WMEPH_banner').css({ 'background-color': bgColor }).append(rowDivs);

    assembleServicesBanner();

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
            _severityButt = Math.max(_buttonBanner2[tempKey].severity, _severityButt);
        }
    });

    if ($('#WMEPH_tools').length === 0) {
        $('#WMEPH_services').after($('<div id="WMEPH_tools">').css({
            'background-color': '#eee',
            color: 'black',
            'font-size': '15px',
            padding: '0px 4px 4px 4px',
            'margin-left': '4px',
            'margin-right': 'auto'
        }));
    } else {
        $('#WMEPH_tools').empty();
    }
    $('#WMEPH_tools').append(rowDivs);

    // Set up Duplicate onclicks
    if (dupesFound) {
        setupButtons(_dupeBanner);
    }
    // Setup bannButt onclicks
    setupButtons(_buttonBanner);

    // Setup bannButt2 onclicks
    setupButtons(_buttonBanner2);

    // Prefill zip code text box
    if (_buttonBanner.missingUSPSZipAlt && _buttonBanner.missingUSPSZipAlt.suggestedValue) {
        $('input#WMEPH-zipAltNameAdd').val(_buttonBanner.missingUSPSZipAlt.suggestedValue);
    }

    // Add click handlers for parking lot helper buttons.
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
        W.model.actionManager.add(new UpdateObject(selectedVenue, { categoryAttributes: { PARKING_LOT: newAttr } }));
        harmonizePlaceGo(selectedVenue, 'harmonize');
    });

    $('.wmeph-pla-lot-type-btn').click(evt => {
        const selectedVenue = getSelectedVenue();
        const selectedValue = $(evt.currentTarget).data('lot-type');
        const existingAttr = selectedVenue.attributes.categoryAttributes.PARKING_LOT;
        const newAttr = {};
        if (existingAttr) {
            Object.keys(existingAttr).forEach(prop => {
                let value = existingAttr[prop];
                if (Array.isArray(value)) value = [].concat(value);
                newAttr[prop] = value;
            });
        }
        newAttr.parkingType = selectedValue;
        W.model.actionManager.add(new UpdateObject(selectedVenue, { categoryAttributes: { PARKING_LOT: newAttr } }));
        harmonizePlaceGo(selectedVenue, 'harmonize');
    });

    $('.wmeph-pla-cost-type-btn').click(evt => {
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
        newAttr.costType = selectedValue;
        W.model.actionManager.add(new UpdateObject(selectedVenue, { categoryAttributes: { PARKING_LOT: newAttr } }));
        harmonizePlaceGo(selectedVenue, 'harmonize');
    });

    // If pressing enter in the HN entry box, add the HN
    $('#WMEPH-HNAdd').keyup(evt => {
        if (evt.keyCode === 13 && $('#WMEPH-HNAdd').val() !== '') {
            $('#WMEPH_hnMissing').click();
        }
    });

    // If pressing enter in the phone entry box, add the phone
    $('#WMEPH-PhoneAdd').keyup(evt => {
        if (evt.keyCode === 13 && $('#WMEPH-PhoneAdd').val() !== '') {
            $('#WMEPH_phoneMissing').click();
            $('#WMEPH_badAreaCode').click();
        }
    });

    // If pressing enter in the URL entry box, add the URL
    $('#WMEPH-UrlAdd').keyup(evt => {
        if (evt.keyCode === 13 && $('#WMEPH-UrlAdd').val() !== '') {
            $('#WMEPH_urlMissing').click();
        }
    });

    // If pressing enter in the USPS zip code alt entry box...
    $('#WMEPH-zipAltNameAdd').keyup(evt => {
        if (evt.keyCode === 13 && $(evt.currentTarget).val() !== '') {
            $('#WMEPH_missingUSPSZipAlt').click();
        }
    });

    // If pasting or dropping into hours entry box
    function resetHoursEntryHeight() {
        const $sel = $('#WMEPH-HoursPaste');
        $sel.focus();
        const oldText = $sel.val();
        if (oldText === _DEFAULT_HOURS_TEXT) {
            $sel.val('');
        }

        // A small delay to allow window to process pasted text before running.
        setTimeout(() => {
            const text = $sel.val();
            const elem = $sel[0];
            const lineCount = (text.match(/\n/g) || []).length + 1;
            const height = lineCount * 18 + 6 + (elem.scrollWidth > elem.clientWidth ? 20 : 0);
            $sel.css({ height: `${height}px` });
        }, 100);
    }
    $('#WMEPH-HoursPaste')
        .bind('paste', resetHoursEntryHeight)
        .bind('drop', resetHoursEntryHeight)
        .bind('dragenter', evt => {
            const $control = $(evt.currentTarget);
            const text = $control.val();
            if (text === _DEFAULT_HOURS_TEXT) {
                $control.val('');
            }
        })
        .keydown(evt => {
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
        })
        .focus(evt => {
            const target = evt.currentTarget;
            if (target.value === _DEFAULT_HOURS_TEXT) {
                target.value = '';
            }
            target.style.color = 'black';
        })
        .blur(evt => {
            const target = evt.currentTarget;
            if (target.value === '') {
                target.value = _DEFAULT_HOURS_TEXT;
                target.style.color = '#999';
            }
        });

    // Format "no hours" section and hook up button events.
    $('#WMEPH_WLnoHours').css({ 'vertical-align': 'top' });

    // NOTE: Leave these wrapped in the "() => ..." functions, to make sure "this" is bound properly.
    if (_buttonBanner.noHours) {
        $('#WMEPH_noHours').click(() => _buttonBanner.noHours.addHoursAction());
        $('#WMEPH_noHours_2').click(() => _buttonBanner.noHours.replaceHoursAction());
    }

    if (_textEntryValues) {
        _textEntryValues.forEach(entry => $(`#${entry.id}`).val(entry.val));
    }
} // END assemble Banner function

function assembleServicesBanner() {
    const venue = getSelectedVenue();
    if (venue && !$('#WMEPH-HideServicesButtons').prop('checked')) {
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
                        $input.css({ '-webkit-filter': 'opacity(.25)', filter: 'opacity(.25)' });
                    }
                    $rowDiv.append($input);
                }
            });
            if ($rowDiv.length) {
                $rowDiv.prepend('<span class="control-label">Add services:</span><br>');
            }
            rowDivs.push($rowDiv);
        }
        if ($('#WMEPH_services').length === 0) {
            $('#WMEPH_banner').after($('<div id="WMEPH_services">').css({
                'background-color': '#eee',
                color: 'black',
                'font-size': '15px',
                padding: '4px',
                'margin-left': '4px',
                'margin-right': 'auto'
            }));
        } else {
            $('#WMEPH_services').empty();
        }
        $('#WMEPH_services').append(rowDivs);

        // Setup bannServ onclicks
        if (!venue.isResidential()) {
            setupButtons(_servicesBanner);
        }
    }
}

// Button onclick event handler
function setupButtons(b) {
    Object.keys(b).forEach(tempKey => { // Loop through the banner possibilities
        if (b[tempKey] && b[tempKey].active) { //  If the particular message is active
            if (b[tempKey].action && b[tempKey].value) { // If there is an action, set onclick
                buttonAction(b, tempKey);
            }
            if (b[tempKey].action2 && b[tempKey].value2) { // If there is an action2, set onclick
                buttonAction2(b, tempKey);
            }
            // If there's a WL option, set up onclick
            if (b[tempKey].WLactive && b[tempKey].WLaction) {
                buttonWhitelist(b, tempKey);
            }
        }
    });
}

function buttonAction(b, bKey) {
    const button = document.getElementById(`WMEPH_${bKey}`);
    button.onclick = () => {
        b[bKey].action();
        if (!b[bKey].noBannerAssemble) assembleBanner();
    };
    return button;
}
function buttonAction2(b, bKey) {
    const button = document.getElementById(`WMEPH_${bKey}_2`);
    button.onclick = () => {
        b[bKey].action2();
        if (!b[bKey].noBannerAssemble) assembleBanner();
    };
    return button;
}
function buttonWhitelist(b, bKey) {
    const button = document.getElementById(`WMEPH_WL${bKey}`);
    button.onclick = () => {
        if (bKey.match(/^\d{5,}/) !== null) {
            b[bKey].WLaction(bKey);
        } else {
            b[bKey].WLaction();
        }
        b[bKey].WLactive = false;
        b[bKey].severity = 0;
        assembleBanner();
    };
    return button;
}

// Display run button on place sidebar
function displayRunButton() {
    const betaDelay = 100;
    setTimeout(() => {
        if ($('#WMEPH_runButton').length === 0) {
            $('<div id="WMEPH_runButton">').prependTo('.contents');
        }
        if ($('#runWMEPH').length === 0) {
            const devVersSuffix = _IS_DEV_VERSION ? '-β' : '';
            const strButt1 = `<input class="btn btn-primary wmeph-fat-btn" id="runWMEPH" title="Run WMEPH${
                devVersSuffix} on Place" type="button" value="Run WMEPH${devVersSuffix}">`;
            $('#WMEPH_runButton').append(strButt1);
        }
        const btn = document.getElementById('runWMEPH');
        if (btn !== null) {
            btn.onclick = () => {
                harmonizePlace();
            };
        } else {
            setTimeout(bootstrapRunButton, 100);
        }
        showOpenPlaceWebsiteButton();
        showSearchButton();
    }, betaDelay);
}

// Displays the Open Place Website button.
function showOpenPlaceWebsiteButton() {
    const venue = getSelectedVenue();
    if (venue) {
        let openPlaceWebsiteURL = venue.attributes.url;
        if (openPlaceWebsiteURL && openPlaceWebsiteURL.replace(/[^A-Za-z0-9]/g, '').length > 2) {
            if (!$('#WMEPHurl').length) {
                const strButt1 = '<input class="btn btn-success btn-xs wmeph-fat-btn" id="WMEPHurl" title="Open place URL" type="button" value="Website">';
                $('#runWMEPH').after(strButt1);
                const btn = document.getElementById('WMEPHurl');
                if (btn !== null) {
                    btn.onclick = () => {
                        openPlaceWebsiteURL = venue.attributes.url;
                        if (openPlaceWebsiteURL.match(/^http/i) === null) {
                            openPlaceWebsiteURL = `http://${openPlaceWebsiteURL}`;
                        }
                        if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
                            window.open(openPlaceWebsiteURL);
                        } else {
                            window.open(openPlaceWebsiteURL, _SEARCH_RESULTS_WINDOW_NAME, _searchResultsWindowSpecs);
                        }
                    };
                } else {
                    setTimeout(bootstrapRunButton, 100);
                }
            }
        } else if ($('#WMEPHurl').length) {
            $('#WMEPHurl').remove();
        }
    }
}

function showSearchButton() {
    const venue = getSelectedVenue();
    if (venue && $('#wmephSearch').length === 0) {
        const strButt1 = '<input class="btn btn-danger btn-xs wmeph-fat-btn" id="wmephSearch" title="Search the web for this place.  Do not copy info from 3rd party sources!" '
            + 'type="button" value="Google">';
        $('#WMEPH_runButton').append(strButt1);
        const btn = document.getElementById('wmephSearch');
        if (btn !== null) {
            btn.onclick = () => {
                const addr = venue.getAddress();
                if (addr.hasState()) {
                    const url = buildGLink(venue.attributes.name, addr, venue.attributes.houseNumber);
                    if ($('#WMEPH-WebSearchNewTab').prop('checked')) {
                        window.open(url);
                    } else {
                        window.open(url, _SEARCH_RESULTS_WINDOW_NAME, _searchResultsWindowSpecs);
                    }
                } else {
                    WazeWrap.Alerts.error(_SCRIPT_NAME, 'The state and country haven\'t been set for this place yet.  Edit the address first.');
                }
            };
        } else {
            setTimeout(bootstrapRunButton, 100);
        }
    }
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

// WMEPH Clone Tool
function displayCloneButton() {
    let betaDelay = 80;
    if (_IS_DEV_VERSION) { betaDelay = 300; }
    setTimeout(() => {
        if ($('#WMEPH_runButton').length === 0) {
            $('<div id="WMEPH_runButton">').prependTo('.contents');
        }
        const venue = getSelectedVenue();
        if (venue) {
            showOpenPlaceWebsiteButton();
            if ($('#clonePlace').length === 0) {
                let strButt1 = '<div style="margin-bottom: 3px;"></div><input class="btn btn-warning btn-xs wmeph-btn" '
                    + 'id="clonePlace" title="Copy place info" type="button" value="Copy" style="font-weight:normal">'
                    + ' <input class="btn btn-warning btn-xs wmeph-btn" id="pasteClone" title="Apply the Place info. '
                    + '(Ctrl-Alt-O)" type="button" value="Paste (for checked boxes):" style="font-weight:normal"><br>';
                $('#WMEPH_runButton').append(strButt1);
                createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPhn', 'HN');
                createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPstr', 'Str');
                createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPcity', 'City');
                createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPurl', 'URL');
                createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPph', 'Ph');
                $('#WMEPH_runButton').append('<br>');
                createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPdesc', 'Desc');
                createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPserv', 'Serv');
                createCloneCheckbox('WMEPH_runButton', 'WMEPH_CPhrs', 'Hrs');
                strButt1 = '<input class="btn btn-info btn-xs wmeph-btn" id="checkAllClone" title="Check all" '
                    + 'type="button" value="All" style="font-weight:normal"> <input class="btn btn-info btn-xs '
                    + 'wmeph-btn" id="checkAddrClone" title="Check Address" type="button" value="Addr" style="font-weight:normal">'
                    + ' <input class="btn btn-info btn-xs wmeph-btn" id="checkNoneClone" title="Check none" '
                    + 'type="button" value="None" style="font-weight:normal"><br>';
                $('#WMEPH_runButton').append(strButt1);
            }
            let btn = document.getElementById('clonePlace');
            if (btn !== null) {
                btn.onclick = () => {
                    _cloneMaster = {};
                    _cloneMaster.addr = venue.getAddress();
                    if (_cloneMaster.addr.hasOwnProperty('attributes')) {
                        _cloneMaster.addr = _cloneMaster.addr.attributes;
                    }
                    _cloneMaster.houseNumber = venue.attributes.houseNumber;
                    _cloneMaster.url = venue.attributes.url;
                    _cloneMaster.phone = venue.attributes.phone;
                    _cloneMaster.description = venue.attributes.description;
                    _cloneMaster.services = venue.attributes.services;
                    _cloneMaster.openingHours = venue.attributes.openingHours;
                    _cloneMaster.isPLA = venue.isParkingLot();
                    phlogdev('Place Cloned');
                };
            } else {
                setTimeout(bootstrapRunButton, 100);
                return;
            }
            btn = document.getElementById('pasteClone');
            if (btn !== null) {
                btn.onclick = () => {
                    clonePlace(getSelectedVenue());
                };
            } else {
                setTimeout(bootstrapRunButton, 100);
            }
            btn = document.getElementById('checkAllClone');

            if (btn !== null) {
                btn.onclick = () => {
                    setCheckboxes(['WMEPH_CPhn', 'WMEPH_CPstr', 'WMEPH_CPcity', 'WMEPH_CPurl', 'WMEPH_CPph', 'WMEPH_CPserv',
                        'WMEPH_CPdesc', 'WMEPH_CPhrs'], true);
                };
            } else {
                setTimeout(bootstrapRunButton, 100);
            }
            btn = document.getElementById('checkAddrClone');
            if (btn !== null) {
                btn.onclick = () => {
                    setCheckboxes(['WMEPH_CPhn', 'WMEPH_CPstr', 'WMEPH_CPcity'], true);
                    setCheckboxes(['WMEPH_CPurl', 'WMEPH_CPph', 'WMEPH_CPserv', 'WMEPH_CPdesc', 'WMEPH_CPhrs'], false);
                };
            } else {
                setTimeout(bootstrapRunButton, 100);
            }
            btn = document.getElementById('checkNoneClone');
            if (btn !== null) {
                btn.onclick = () => {
                    setCheckboxes(['WMEPH_CPhn', 'WMEPH_CPstr', 'WMEPH_CPcity', 'WMEPH_CPurl', 'WMEPH_CPph', 'WMEPH_CPserv',
                        'WMEPH_CPdesc', 'WMEPH_CPhrs'], false);
                };
            } else {
                setTimeout(bootstrapRunButton, 100);
            }
        }
    }, betaDelay);
} // END displayCloneButton funtion


// Catch PLs and reloads that have a place selected already and limit attempts to about 10 seconds
function bootstrapRunButton(numAttempts) {
    numAttempts = numAttempts || 0;
    if (numAttempts < 10) {
        if (W.selectionManager.getSelectedFeatures().length === 1) {
            const venue = getSelectedVenue();
            if (venue && venue.isApproved()) {
                displayRunButton();
                showOpenPlaceWebsiteButton();
                showSearchButton();
                getPanelFields();
                if (localStorage.getItem('WMEPH-EnableCloneMode') === '1') {
                    displayCloneButton();
                }
            }
        } else {
            setTimeout(bootstrapRunButton(numAttempts + 1), 1000);
        }
    }
}

// Find field divs
function getPanelFields() {
    let panelFieldsList = $('.form-control');
    for (let pfix = 0; pfix < panelFieldsList.length; pfix++) {
        const pfa = panelFieldsList[pfix].name;
        if (pfa === 'name') {
            _PANEL_FIELDS.name = pfix;
        }
        if (pfa === 'lockRank') {
            _PANEL_FIELDS.lockRank = pfix;
        }
        if (pfa === 'description') {
            _PANEL_FIELDS.description = pfix;
        }
        if (pfa === 'url') {
            _PANEL_FIELDS.url = pfix;
        }
        if (pfa === 'phone') {
            _PANEL_FIELDS.phone = pfix;
        }
        if (pfa === 'brand') {
            _PANEL_FIELDS.brand = pfix;
        }
    }
    const placeNavTabs = $('.nav');
    for (let pfix = 0; pfix < placeNavTabs.length; pfix++) {
        const pfa = placeNavTabs[pfix].innerHTML;
        if (pfa.includes('landmark-edit')) {
            panelFieldsList = placeNavTabs[pfix].children;
            _PANEL_FIELDS.navTabsIX = pfix;
            break;
        }
    }
    for (let pfix = 0; pfix < panelFieldsList.length; pfix++) {
        const pfa = panelFieldsList[pfix].innerHTML;
        if (pfa.includes('landmark-edit-general')) {
            _PANEL_FIELDS.navTabGeneral = pfix;
        }
        if (pfa.includes('landmark-edit-more')) {
            _PANEL_FIELDS.navTabMore = pfix;
        }
    }
}

// Function to clone info from a place
function clonePlace() {
    phlog('Cloning info...');
    if (_cloneMaster !== null && _cloneMaster.hasOwnProperty('url')) {
        const venue = getSelectedVenue();
        const cloneItems = {};
        let updateItem = false;
        if (isChecked('WMEPH_CPhn')) {
            cloneItems.houseNumber = _cloneMaster.houseNumber;
            updateItem = true;
        }
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
            W.model.actionManager.add(new UpdateObject(venue, cloneItems));
            phlogdev('Item details cloned');
        }

        const copyStreet = isChecked('WMEPH_CPstr');
        const copyCity = isChecked('WMEPH_CPcity');

        if (copyStreet || copyCity) {
            const originalAddress = venue.getAddress();
            const itemRepl = {
                street: copyStreet ? _cloneMaster.addr.street : originalAddress.attributes.street,
                city: copyCity ? _cloneMaster.addr.city : originalAddress.attributes.city,
                state: copyCity ? _cloneMaster.addr.state : originalAddress.attributes.state,
                country: copyCity ? _cloneMaster.addr.country : originalAddress.attributes.country
            };
            updateAddress(venue, itemRepl);
            phlogdev('Item address cloned');
        }
    } else {
        phlog('Please copy a place');
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

// function to check overlapping hours
function checkHours(hoursObj) {
    if (hoursObj.length === 1) {
        return true;
    }

    for (let day2Ch = 0; day2Ch < 7; day2Ch++) { // Go thru each day of the week
        const daysObj = [];
        for (let hourSet = 0; hourSet < hoursObj.length; hourSet++) { // For each set of hours
            if (hoursObj[hourSet].days.includes(day2Ch)) { // pull out hours that are for the current day, add 2400 if it goes past midnight, and store
                const fromHourTemp = hoursObj[hourSet].fromHour.replace(/:/g, '');
                let toHourTemp = hoursObj[hourSet].toHour.replace(/:/g, '');
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
                        return false;
                    }
                    if (daysObj[hourSetCheck2][1] > daysObj[hourSetCheck1][0] && daysObj[hourSetCheck2][1] < daysObj[hourSetCheck1][1]) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

// Duplicate place finder  ###bmtg
function findNearbyDuplicate(selectedVenueName, selectedVenueAliases, selectedVenue, recenterOption) {
    // Helper function to prep a name for comparisons.
    const formatName = name => name.toUpperCase().replace(/ AND /g, '').replace(/^THE /g, '').replace(/[^A-Z0-9]/g, '');

    // Remove any previous search labels
    _dupeLayer.destroyFeatures();

    const mapExtent = W.map.getExtent();
    const padFrac = 0.15; // how much to pad the zoomed window

    // generic terms to skip if it's all that remains after stripping numbers
    let noNumSkip = 'BANK|ATM|HOTEL|MOTEL|STORE|MARKET|SUPERMARKET|GYM|GAS|GASOLINE|GASSTATION|CAFE|OFFICE|OFFICES'
        + '|CARRENTAL|RENTALCAR|RENTAL|SALON|BAR|BUILDING|LOT';
    noNumSkip = `${noNumSkip}|${_COLLEGE_ABBREVIATIONS}`.split('|');
    const allowedTwoLetters = ['BP', 'DQ', 'BK', 'BW', 'LQ', 'QT', 'DB', 'PO'];

    // Make the padded extent
    mapExtent.left += padFrac * (mapExtent.right - mapExtent.left);
    mapExtent.right -= padFrac * (mapExtent.right - mapExtent.left);
    mapExtent.bottom += padFrac * (mapExtent.top - mapExtent.bottom);
    mapExtent.top -= padFrac * (mapExtent.top - mapExtent.bottom);
    let outOfExtent = false;
    let overlappingFlag = false;

    // Initialize the coordinate extents for duplicates
    const selectedCentroid = selectedVenue.geometry.getCentroid();
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
    const itemNameNoNum = selectedVenueNameRF.replace(/[^A-Z]/g, '');
    if (((itemNameNoNum.length > 2 && !noNumSkip.includes(itemNameNoNum)) || allowedTwoLetters.includes(itemNameNoNum))
        && !selectedVenueAttr.categories.includes('PARKING_LOT')) {
        // only add de-numbered name if anything remains
        currNameList.push(itemNameNoNum);
    }

    if (selectedVenueAliases.length > 0) {
        for (let aliix = 0; aliix < selectedVenueAliases.length; aliix++) {
            // Format name
            const aliasNameRF = formatName(selectedVenueAliases[aliix]);
            if ((aliasNameRF.length > 2 && !noNumSkip.includes(aliasNameRF)) || allowedTwoLetters.includes(aliasNameRF)) {
                // only add de-numbered name if anything remains
                currNameList.push(aliasNameRF);
            }
            // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB )
            const aliasNameNoNum = aliasNameRF.replace(/[^A-Z]/g, '');
            if (((aliasNameNoNum.length > 2 && !noNumSkip.includes(aliasNameNoNum)) || allowedTwoLetters.includes(aliasNameNoNum))
                && !selectedVenueAttr.categories.includes('PARKING_LOT')) {
                // only add de-numbered name if anything remains
                currNameList.push(aliasNameNoNum);
            }
        }
    }
    currNameList = _.uniq(currNameList); //  remove duplicates

    let selectedVenueAddr = selectedVenue.getAddress();
    selectedVenueAddr = selectedVenueAddr.attributes || selectedVenueAddr;
    const selectedVenueHN = selectedVenueAttr.houseNumber;

    const selectedVenueAddrIsComplete = selectedVenueAddr.street !== null && selectedVenueAddr.street.name !== null
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
            const testCentroid = testVenue.geometry.getCentroid();
            const pt2ptDistance = selectedCentroid.distanceTo(testCentroid);
            if (selectedVenue.isPoint() && testVenue.isPoint() && pt2ptDistance < 2 && selectedVenueId !== testVenueId) {
                overlappingFlag = true;
            }

            const testVenueHN = testVenueAttr.houseNumber;
            let testVenueAddr = testVenue.getAddress();
            testVenueAddr = testVenueAddr.attributes || testVenueAddr;

            // get HNs for places on same street
            if (selectedVenueAddrIsComplete && testVenueAddr.street !== null && testVenueAddr.street.name !== null
                && testVenueHN && testVenueHN !== '' && testVenueId !== selectedVenueId
                && selectedVenueAddr.street.name === testVenueAddr.street.name && testVenueHN < 1000000) {
                _dupeHNRangeList.push(parseInt(testVenueHN, 10));
                _dupeHNRangeDistList.push(pt2ptDistance);
            }

            // Check for duplicates
            // don't do res, the point itself, new points or no name
            if (!whitelistedDupes.includes(testVenueId) && _dupeIDList.length < 6 && pt2ptDistance < 800
                && !testVenue.isResidential() && testVenueId !== selectedVenueId && !testVenue.isNew()
                && testVenueAttr.name !== null && testVenueAttr.name.length > 1) {
                // If item has a complete address and test venue does, and they are different, then no dupe
                let suppressMatch = false;
                if (selectedVenueAddrIsComplete && testVenueAddr.street !== null && testVenueAddr.street.name !== null
                    && testVenueHN && testVenueHN.match(/\d/g) !== null) {
                    if (selectedVenueAttr.lockRank > 0 && testVenueAttr.lockRank > 0) {
                        if (selectedVenueAttr.houseNumber !== testVenueHN
                            || selectedVenueAddr.street.name !== testVenueAddr.street.name) {
                            suppressMatch = true;
                        }
                    } else if (selectedVenueHN !== testVenueHN
                        && selectedVenueAddr.street.name !== testVenueAddr.street.name) {
                        suppressMatch = true;
                    }
                }

                if (!suppressMatch) {
                    let testNameList;
                    // Reformat the testPlace name
                    const strippedTestName = formatName(testVenueAttr.name)
                        .replace(/\s+[-(].*$/, ''); // Remove localization text
                    if ((strippedTestName.length > 2 && !noNumSkip.includes(strippedTestName))
                        || allowedTwoLetters.includes(strippedTestName)) {
                        testNameList = [strippedTestName];
                    } else {
                        testNameList = [`TESTNAMETOOSHORTQZJXS${randInt}`];
                        randInt++;
                    }

                    const testNameNoNum = strippedTestName.replace(/[^A-Z]/g, ''); // Clear non-letter characters for alternate match
                    if (((testNameNoNum.length > 2 && !noNumSkip.includes(testNameNoNum)) || allowedTwoLetters.includes(testNameNoNum))
                        && !testVenueAttr.categories.includes('PARKING_LOT')) { //  only add de-numbered name if at least 2 chars remain
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
                            if ((aliasNameRF.length > 2 && !noNumSkip.includes(aliasNameRF)) || allowedTwoLetters.includes(aliasNameRF)) {
                                testNameList = [aliasNameRF];
                            } else {
                                testNameList = [`ALIASNAMETOOSHORTQOFUH${randInt}`];
                                randInt++;
                            }
                            const aliasNameNoNum = aliasNameRF.replace(/[^A-Z]/g, ''); // Clear non-letter characters for alternate match ( HOLLYIVYPUB23 --> HOLLYIVYPUB )
                            if (((aliasNameNoNum.length > 2 && !noNumSkip.includes(aliasNameNoNum)) || allowedTwoLetters.includes(aliasNameNoNum))
                                && !testVenueAttr.categories.includes('PARKING_LOT')) { //  only add de-numbered name if at least 2 characters remain
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
                        _dupeIDList.push(testVenueAttr.id); // Add the item to the list of matches
                        _dupeLayer.setVisibility(true); // If anything found, make visible the dupe layer

                        const labelText = nameMatch ? testVenueAttr.name : `${testVenueAttr.aliases[altNameMatch]} (Alt)`;
                        phlogdev(`Possible duplicate found. WME place: ${selectedVenueName} / Nearby place: ${labelText}`);

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

                        labelFeatures.push(new OL.Feature.Vector(
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
        labelFeatures.push(new OL.Feature.Vector(
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

// On selection of new item:
function checkSelection() {
    const venue = getSelectedVenue();
    if (venue && venue.isApproved()) {
        displayRunButton();
        getPanelFields();
        if ($('#WMEPH-EnableCloneMode').prop('checked')) {
            displayCloneButton();
        }
        for (let dvtix = 0; dvtix < _dupeIDList.length; dvtix++) {
            if (venue.attributes.id === _dupeIDList[dvtix]) { // If the user selects a place in the dupe list, don't clear the labels yet
                return;
            }
        }
    } else {
        // Remove the run button div if it's being displayed.
        $('#WMEPH_runButton').remove();
    }
    // If the selection is anything else, clear the labels
    _dupeLayer.destroyFeatures();
    _dupeLayer.setVisibility(false);
}

// Functions to infer address from nearby segments
function inferAddress(maxRecursionDepth) {
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

    const venue = getSelectedVenue();

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
            distanceA = pt.distanceTo(nodeA.attributes.geometry);
            distanceB = pt.distanceTo(nodeB.attributes.geometry);
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
        stopPoint = venue.geometry.getCentroid();
    }

    // Go through segment array and calculate distances to segments.
    for (i = 0, n = segments.length; i < n; i++) {
        // Make sure the segment is not an ignored roadType.
        if (!IGNORE_ROAD_TYPES.includes(segments[i].attributes.roadType)) {
            distanceToSegment = (stopPoint.getPoint ? stopPoint.getPoint() : stopPoint).distanceTo(segments[i].geometry);
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
            countryID: address.country.id,
            stateID: address.state.id,
            cityName: address.city.attributes.name,
            emptyCity: address.city.hasName() ? null : true,
            streetName: address.street.name,
            emptyStreet: address.street.isEmpty ? true : null
        };
        const action = new UpdateFeatureAddress(feature, newAttributes);
        if (actions) {
            actions.push(action);
        } else {
            W.model.actionManager.add(action);
        }
        phlogdev('Address inferred and updated');
    }
} // END updateAddress function

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

// WME Category translation from Natural language to object language  (Bank / Financial --> BANK_FINANCIAL)
function catTranslate(natCategories) {
    const catNameUpper = natCategories.trim().toUpperCase();
    if (_CATEGORY_LOOKUP.hasOwnProperty(catNameUpper)) {
        return _CATEGORY_LOOKUP[catNameUpper];
    }

    // if the category doesn't translate, then pop an alert that will make a forum post to the thread
    // Generally this means the category used in the PNH sheet is not close enough to the natural language categories used inside the WME translations
    /* if (confirm('WMEPH: Category Error!\nClick OK to report this error')) {
        reportError({
            subject: 'WMEPH Bug report: no tns',
            message: `Error report: Category "${natCategories}" was not found in the PNH categories sheet.`
        });
    } */
    WazeWrap.Alerts.confirm(
        _SCRIPT_NAME,
        'WMEPH: Category Error!<br>Click OK to report this error',
        () => {
            reportError({
                subject: 'WMEPH Bug report: no tns',
                message: `Error report: Category "${natCategories}" was not found in the PNH categories sheet.`
            });
        },
        () => { }
    );
    return 'ERROR';
} // END catTranslate function

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
    if (typeof (target) === 'string') { target = [target]; } // if a single string, convert to an array
    for (let ixx = 0; ixx < target.length; ixx++) {
        if (!source.includes(target[ixx])) {
            return false;
        }
    }
    return true;
}

// function that checks if any element of target are in source
function containsAny(source, target) {
    if (typeof source === 'string') { source = [source]; } // if a single string, convert to an array
    if (typeof target === 'string') { target = [target]; } // if a single string, convert to an array
    return source.some(tt => target.includes(tt));
}

// Function that inserts a string or a string array into another string array at index ix and removes any duplicates
function insertAtIX(array1, array2, ix) { // array1 is original string, array2 is the inserted string, at index ix
    const arrayNew = array1.slice(); // slice the input array so it doesn't change
    if (typeof (array2) === 'string') { array2 = [array2]; } // if a single string, convert to an array
    if (typeof (array2) === 'object') { // only apply to inserted arrays
        const arrayTemp = arrayNew.splice(ix); // split and hold the first part
        arrayNew.push(...array2); // add the insert
        arrayNew.push(...arrayTemp); // add the tail end of original
    }
    return _.uniq(arrayNew); // remove any duplicates (so the function can be used to move the position of a string)
}

// Function to remove unnecessary aliases
function removeSFAliases(nName, nAliases) {
    const newAliasesUpdate = [];
    nName = nName.toUpperCase().replace(/'/g, '').replace(/-/g, ' ').replace(/\/ /g, ' ').replace(/ \//g, ' ').replace(/ {2,}/g, ' ');
    for (let naix = 0; naix < nAliases.length; naix++) {
        if (!nName.startsWith(nAliases[naix].toUpperCase().replace(/'/g, '').replace(/-/g, ' ').replace(/\/ /g, ' ').replace(/ \//g, ' ').replace(/ {2,}/g, ' '))) {
            newAliasesUpdate.push(nAliases[naix]);
        } else {
            _buttonBanner.sfAliases = new Flag.SFAliases();
        }
    }
    return newAliasesUpdate;
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
        // phlogdev(settingID + ' not found.');
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
    _SHORTCUT.remove(_modifKey + _shortcutParse);
    _modifKey = modifKeyNew;
    _SHORTCUT.add(_modifKey + _shortcutParse, harmonizePlace);
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
        _SHORTCUT.remove(_modifKey + _shortcutParse);
        _shortcutParse = shortcutParseNew;
        _SHORTCUT.add(_modifKey + _shortcutParse, harmonizePlace);
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
    const defaultShortcutKey = _IS_DEV_VERSION ? 'S' : 'A';
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
    if (!_initAlreadyRun) _SHORTCUT.add(_modifKey + _shortcutParse, harmonizePlace);
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
            _SCRIPT_NAME,
            '***Do you want to reset all Whitelist data?<br>Click OK to erase.',
            () => {
                _venueWhitelist = { '1.1.1': { Placeholder: {} } }; // Populate with a dummy place
                saveWhitelistToLS(true);
            },
            () => { }
        );
    } else { // try to merge uncompressed WL data
        _WLSToMerge = validateWLS($('#WMEPH-WLInput').val());
        if (_WLSToMerge) {
            phlog('Whitelists merged!');
            _venueWhitelist = mergeWL(_venueWhitelist, _WLSToMerge);
            saveWhitelistToLS(true);
            $wlToolsMsg.append('<p style="color:green">Whitelist data merged<p>');
            $wlInput.val('');
        } else { // try compressed WL
            _WLSToMerge = validateWLS(LZString.decompressFromUTF16($('#WMEPH-WLInput').val()));
            if (_WLSToMerge) {
                phlog('Whitelists merged!');
                _venueWhitelist = mergeWL(_venueWhitelist, _WLSToMerge);
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
            localStorage.getItem(_WL_LOCAL_STORE_NAME_COMPRESSED)
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
            localStorage.getItem(_WL_LOCAL_STORE_NAME_COMPRESSED)
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
                localStorage.getItem(_WL_LOCAL_STORE_NAME_COMPRESSED)
            )
        );
        const venuesToRemove = Object.keys(currWLData).filter(
            venueKey => venueKey !== '1.1.1' && (currWLData[venueKey].state === stateToRemove
                || (!currWLData[venueKey].state && stateToRemove === 'None'))
        );
        if (venuesToRemove.length > 0) {
            if (localStorage.WMEPH_WLAddCount === '1') {
                /* if (confirm(`Are you sure you want to clear all whitelist data for ${
                    stateToRemove}? This CANNOT be undone. Press OK to delete, cancel to preserve the data.`)) {
                    backupWhitelistToLS(true);
                    venuesToRemove.forEach(venueKey => {
                        delete _venueWhitelist[venueKey];
                    });
                    saveWhitelistToLS(true);
                    msgColor = 'green';
                    msgText = `${venuesToRemove.length} items removed from WL`;
                    $wlInput.val('');
                } else {
                    msgColor = 'blue';
                    msgText = 'No changes made';
                } */
                WazeWrap.Alerts.confirm(
                    _SCRIPT_NAME,
                    `Are you sure you want to clear all whitelist data for ${stateToRemove}? This CANNOT be undone. `
                    + 'Press OK to delete, cancel to preserve the data.',
                    () => {
                        backupWhitelistToLS(true);
                        venuesToRemove.forEach(venueKey => {
                            delete _venueWhitelist[venueKey];
                        });
                        saveWhitelistToLS(true);
                        $wlInput.val('');
                        $('#PlaceHarmonizerWLToolsMsg').empty().append($('<p>').css({ color: 'green' }).text(`${venuesToRemove.length} items removed from WL`));
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
    window.open(`https://docs.google.com/forms/d/1k_5RyOq81Fv4IRHzltC34kW3IUbXnQqDVMogwJKFNbE/viewform?entry.1173700072=${_USER.name}`);
}

// settings tab
function initWmephTab() {
    // Enable certain settings by default if not set by the user:
    setCheckedByDefault('WMEPH-ColorHighlighting');
    setCheckedByDefault('WMEPH-ExcludePLADupes');
    setCheckedByDefault('WMEPH-DisablePLAExtProviderCheck');

    // Initialize settings checkboxes
    initSettingsCheckbox('WMEPH-WebSearchNewTab');
    initSettingsCheckbox('WMEPH-DisableDFZoom');
    initSettingsCheckbox('WMEPH-EnableIAZoom');
    initSettingsCheckbox('WMEPH-HidePlacesWiki');
    initSettingsCheckbox('WMEPH-HideReportError');
    initSettingsCheckbox('WMEPH-HideServicesButtons');
    initSettingsCheckbox('WMEPH-HidePURWebSearch');
    initSettingsCheckbox('WMEPH-ExcludePLADupes');
    initSettingsCheckbox('WMEPH-ShowPLAExitWhileClosed');
    if (_USER.isDevUser || _USER.isBetaUser || _USER.rank >= 2) {
        initSettingsCheckbox('WMEPH-DisablePLAExtProviderCheck');
        initSettingsCheckbox('WMEPH-EnableServices');
        initSettingsCheckbox('WMEPH-AddAddresses');
        initSettingsCheckbox('WMEPH-EnableCloneMode');
        initSettingsCheckbox('WMEPH-AutoLockRPPs');
    }
    initSettingsCheckbox('WMEPH-ColorHighlighting');
    initSettingsCheckbox('WMEPH-DisableHoursHL');
    initSettingsCheckbox('WMEPH-DisableRankHL');
    initSettingsCheckbox('WMEPH-DisableWLHL');
    initSettingsCheckbox('WMEPH-PLATypeFill');
    initSettingsCheckbox('WMEPH-KBSModifierKey');

    if (_USER.isDevUser) {
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

    _initAlreadyRun = true;
}

function addWmephTab() {
    // Set up the CSS
    GM_addStyle(_CSS_ARRAY.join('\n'));

    const $container = $('<div class="active">');
    const $navTabs = $(
        '<ul class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#sidepanel-harmonizer">Harmonize</a></li>'
        + '<li><a data-toggle="tab" href="#sidepanel-highlighter">HL / Scan</a></li>'
        + '<li><a data-toggle="tab" href="#sidepanel-wltools">WL Tools</a></li>'
        + '<li><a data-toggle="tab" href="#sidepanel-pnh-moderators">Moderators</a></li></ul>'
    );
    const $tabContent = $('<div class="tab-content">');
    const $harmonizerTab = $('<div class="tab-pane active" id="sidepanel-harmonizer"></div>');
    const $highlighterTab = $('<div class="tab-pane" id="sidepanel-highlighter"></div>');
    const $wlToolsTab = $('<div class="tab-pane" id="sidepanel-wltools"></div>');
    const $moderatorsTab = $('<div class="tab-pane" id="sidepanel-pnh-moderators"></div>');
    $tabContent.append($harmonizerTab, $highlighterTab, $wlToolsTab, $moderatorsTab);
    $container.append($navTabs, $tabContent);

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
    if (_USER.isDevUser || _USER.isBetaUser || _USER.rank >= 2) {
        createSettingsCheckbox($harmonizerTab, 'WMEPH-DisablePLAExtProviderCheck', 'Disable check for "Google place link" on Parking Lot Areas');
        createSettingsCheckbox($harmonizerTab, 'WMEPH-EnableServices', 'Enable automatic addition of common services');
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

    if (_USER.isDevUser) { // Override script regionality (devs only)
        $phShortcutDiv.append('<hr class="wmeph-hr" align="center" width="100%"><p>Dev Only Settings:</p>');
        createSettingsCheckbox($phShortcutDiv, 'WMEPH-RegionOverride', 'Disable Region Specificity');
    }

    $harmonizerTab.append(
        $phShortcutDiv,
        '<hr class="wmeph-hr" align="center" width="100%">',
        `<div><a href="${_URLS.placesWiki}" target="_blank">Open the WME Places Wiki page</a></div>`,
        `<div><a href="${_URLS.forum}" target="_blank">Submit script feedback & suggestions</a></div>`,
        '<hr class="wmeph-hr" align="center" width="95%">',
    );

    $harmonizerTab.append(
        $('<div>').append(
            $('<div>', { style: 'font-weight: bold; margin-bottom: 6px;' }).text('Recent updates'),
            Object.keys(_WHATS_NEW_LIST).map(
                version => $('<div>').append(
                    $('<div>').text(version),
                    $('<ul>', { style: 'margin-left: -23px;' }).append(
                        _WHATS_NEW_LIST[version].map(textLine => $('<li>').text(textLine))
                    )
                )
            )
        )
    );

    // Highlighter settings
    $highlighterTab.append('<p>Highlighter Settings:</p>');
    createSettingsCheckbox($highlighterTab, 'WMEPH-ColorHighlighting', 'Enable color highlighting of map to indicate places needing work');
    createSettingsCheckbox($highlighterTab, 'WMEPH-DisableHoursHL', 'Disable highlighting for missing hours');
    createSettingsCheckbox($highlighterTab, 'WMEPH-DisableRankHL', 'Disable highlighting for places locked above your rank');
    createSettingsCheckbox($highlighterTab, 'WMEPH-DisableWLHL', 'Disable Whitelist highlighting (shows all missing info regardless of WL)');
    createSettingsCheckbox($highlighterTab, 'WMEPH-PLATypeFill', 'Fill parking lots based on type (public=blue, restricted=yellow, private=red)');
    if (_USER.isDevUser || _USER.isBetaUser || _USER.rank >= 3) {
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

    const pnhModerators = {
        ATR: ['cotero2002', 'nnote'],
        GLR: ['JustinS83'],
        HI: ['Nacron'],
        MAR: ['jr1982jr', 'nzahn1', 'stephenr1966'],
        NER: ['jaywazin', 'SNYOWL'],
        NOR: ['Joyriding', 'PesachZ'],
        NWR: ['dmee92', 'SkyviewGuru'],
        PLN: ['bretmcvey', 'dmee92', 'ehepner1977'],
        SAT: ['crazycaveman', 'whathappened15', 'xanderb'],
        SCR: ['jm6087'],
        SER: ['driving79', 'willdanneriv', 'ardan74', 'itzwolf'],
        SWR: ['tonestertm']
    };

    $moderatorsTab.append(
        $('<div>', { style: 'margin-bottom: 10px;' }).text('Moderators are responsible for reviewing chain submissions for their region.'
            + ' If you have questions or suggestions regarding a chain, please contact any of your regional moderators.'),
        $('<table>').append(
            Object.keys(pnhModerators).map(region => $('<tr>').append(
                $('<td>', { class: 'wmeph-mods-table-cell title' }).append(
                    $('<div>').text(region)
                ),
                $('<td>', { class: 'wmeph-mods-table-cell' }).append(
                    $('<div>').text(pnhModerators[region].join(', '))
                )
            ))
        )
    );

    new WazeWrap.Interface.Tab(`WMEPH${_IS_DEV_VERSION ? '-β' : ''}`, $container.html(), initWmephTab, null);
}

function createCloneCheckbox(divID, settingID, textDescription) {
    $(`#${divID}`).append(`<input type="checkbox" id="${settingID}">${textDescription}</input>&nbsp&nbsp`);
    $(`#${settingID}`).click(() => saveSettingToLocalStorage(settingID));
    if (localStorage.getItem(settingID) === '1') {
        $(`#${settingID}`).trigger('click');
    }
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
                            wl1[venueKey][wlKey].WLKeyArray = insertAtIX(wl1[venueKey][wlKey].WLKeyArray, wl2[venueKey][wlKey].WLKeyArray, 100);
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
    for (let wsix = 0; wsix < _WME_SERVICES_ARRAY.length; wsix++) {
        if (venue.attributes.services.includes(_WME_SERVICES_ARRAY[wsix])) {
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

// Pulls the item PL
function getCurrentPL() {
    // Return the current PL

    // 5/22/2019 (mapomatic)
    // I'm not sure what this was supposed to do.  Maybe an attempt to wait until the PL
    // was available when loading WME from PL with a place pre-selected and auto-run WMEPH
    // is turned on?  Whatever the purpose was, it won't work properly because it'll return
    // undefined, and the calling code is expecting a value.

    // if ($('.WazeControlPermalink').length === 0) {
    //     phlog('Waiting for PL div');
    //     setTimeout(getCurrentPL, 500);
    //     return;
    // }

    if ($('.WazeControlPermalink .permalink').attr('href').length > 0) {
        return $('.WazeControlPermalink .permalink').attr('href');
    }
    if ($('.WazeControlPermalink').children('.fa-link').length > 0) {
        return $('.WazeControlPermalink').children('.fa-link')[0].href;
    }
    return '';
}

// Sets up error reporting
function reportError(data) {
    data.preview = 'Preview';
    data.attach_sig = 'on';
    if (_PM_USER_LIST.hasOwnProperty('WMEPH') && _PM_USER_LIST.WMEPH.approvalActive) {
        data[`address_list[u][${_PM_USER_LIST.WMEPH.modID}]`] = 'to';
        newForumPost('https://www.waze.com/forum/ucp.php?i=pm&mode=compose', data);
    } else {
        data.addbbcode20 = 'to';
        data.notify = 'on';
        newForumPost(`${_URLS.forum}#preview`, data);
    }
} // END reportError function

// Make a populated post on a forum thread
function newForumPost(url, data) {
    const form = document.createElement('form');
    form.target = '_blank';
    form.action = url;
    form.method = 'post';
    form.style.display = 'none';
    Object.keys(data).forEach(k => {
        let input;
        if (k === 'message') {
            input = document.createElement('textarea');
        } else if (k === 'username') {
            input = document.createElement('username_list');
        } else {
            input = document.createElement('input');
        }
        input.name = k;
        input.value = data[k];
        // input.type = 'hidden'; // 2018-07/10 (mapomatic) Not sure if this is required, but was causing an error when setting on the textarea object.
        form.appendChild(input);
    });
    document.getElementById('WMEPH_formDiv').appendChild(form);
    form.submit();
    document.getElementById('WMEPH_formDiv').removeChild(form);
    return true;
} // END newForumPost function

/**
 * Updates the geometry of a place.
 * @param place {Waze venue object} The place to update.
 * @param newGeometry {OL.Geometry} The new geometry for the place.
 */
function updateFeatureGeometry(place, newGeometry) {
    let oldGeometry;
    const model = W.model.venues;
    if (place && place.CLASS_NAME === 'Waze.Feature.Vector.Landmark' && newGeometry && (newGeometry instanceof OL.Geometry.Point
        || newGeometry instanceof OL.Geometry.Polygon)) {
        oldGeometry = place.attributes.geometry;
        W.model.actionManager.add(new UpdateFeatureGeometry(place, model, oldGeometry, newGeometry));
    }
}

function placeHarmonizerInit() {
    _layer = W.map.landmarkLayer;

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

    MultiAction = require('Waze/Action/MultiAction');
    UpdateObject = require('Waze/Action/UpdateObject');
    UpdateFeatureGeometry = require('Waze/Action/UpdateFeatureGeometry');
    UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
    OpeningHour = require('Waze/Model/Objects/OpeningHour');

    // For debugging purposes.  May be removed when no longer needed.
    unsafeWindow.PNH_DATA = _PNH_DATA;

    // Append a form div for submitting to the forum, if it doesn't exist yet:
    const tempDiv = document.createElement('div');
    tempDiv.id = 'WMEPH_formDiv';
    tempDiv.style.display = 'none';
    $('body').append(tempDiv);

    _USER.ref = W.loginManager.user;
    _USER.name = _USER.ref.userName;
    _USER.rank = _USER.ref.rank + 1; // get editor's level (actual level)
    _userLanguage = I18n.locale;

    // Array prototype extensions (for Firefox fix)
    // 5/22/2019 (mapomatic) I'm guessing these aren't necessary anymore.  If no one reports any errors after a while, these lines may be deleted.
    // Array.prototype.toSet = function () { return this.reduce(function (e, t) { return e[t] = !0, e; }, {}); };
    // Array.prototype.first = function () { return this[0]; };
    // Array.prototype.isEmpty = function () { return 0 === this.length; };

    appendServiceButtonIconCss();
    _UPDATED_FIELDS.init();
    addPURWebSearchButton();

    // Create duplicatePlaceName layer
    _dupeLayer = W.map.getLayerByUniqueName('__DuplicatePlaceNames');
    if (!_dupeLayer) {
        const lname = 'WMEPH Duplicate Names';
        const style = new OL.Style({
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
        _dupeLayer = new OL.Layer.Vector(lname, { displayInLayerSwitcher: false, uniqueName: '__DuplicatePlaceNames', styleMap: new OL.StyleMap(style) });
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
    if (validateWLS(LZString.decompressFromUTF16(localStorage.getItem(_WL_LOCAL_STORE_NAME_COMPRESSED))) === false) { // If no compressed WL string exists
        if (validateWLS(localStorage.getItem(_WL_LOCAL_STORE_NAME)) === false) { // If no regular WL exists
            _venueWhitelist = { '1.1.1': { Placeholder: {} } }; // Populate with a dummy place
            saveWhitelistToLS(false);
            saveWhitelistToLS(true);
        } else { // if regular WL string exists, then transfer to compressed version
            localStorage.setItem('WMEPH-OneTimeWLBU', localStorage.getItem(_WL_LOCAL_STORE_NAME));
            loadWhitelistFromLS(false);
            saveWhitelistToLS(true);
            WazeWrap.Alerts.info(_SCRIPT_NAME, 'Whitelists are being converted to a compressed format.  If you have trouble with your WL, please submit an error report.');
        }
    } else {
        loadWhitelistFromLS(true);
    }

    if (_USER.name === 'ggrane') {
        _searchResultsWindowSpecs = `"resizable=yes, top=${
            Math.round(window.screen.height * 0.1)}, left=${
            Math.round(window.screen.width * 0.3)}, width=${
            Math.round(window.screen.width * 0.86)}, height=${
            Math.round(window.screen.height * 0.8)}"`;
    }

    // Settings setup
    if (!localStorage.getItem(_SETTING_IDS.gLinkWarning)) { // store settings so the warning is only given once
        localStorage.setItem(_SETTING_IDS.gLinkWarning, '0');
    }
    if (!localStorage.getItem(_SETTING_IDS.sfUrlWarning)) { // store settings so the warning is only given once
        localStorage.setItem(_SETTING_IDS.sfUrlWarning, '0');
    }

    WazeWrap.Events.register('mousemove', W.map, e => errorHandler(() => {
        const wmEvts = (W.map.events) ? W.map.events : W.map.getMapEventsListener();
        _wmephMousePosition = W.map.getLonLatFromPixel(wmEvts.getMousePosition(e));
    }));

    // Add zoom shortcut
    _SHORTCUT.add('Control+Alt+Z', zoomPlace);

    // Add Color Highlighting shortcut
    _SHORTCUT.add('Control+Alt+h', () => {
        $('#WMEPH-ColorHighlighting').trigger('click');
    });

    addWmephTab(); // initialize the settings tab

    // Event listeners
    W.selectionManager.events.registerPriority('selectionchanged', this, () => errorHandler(checkSelection));
    W.model.venues.on('objectssynced', () => errorHandler(destroyDupeLabels));
    W.model.venues.on('objectssynced', e => errorHandler(() => syncWL(e)));
    W.model.venues.on('objectschanged', () => errorHandler(onObjectsChanged));

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
        phlogdev(`Removed ${removedWLCount} venues with temporary ID's from WL store`);
    }

    if (!_wmephBetaList || _wmephBetaList.length === 0) {
        if (_IS_DEV_VERSION) {
            WazeWrap.Alerts.warning(_SCRIPT_NAME, 'Beta user list access issue.  Please post in the GHO or PM/DM MapOMatic about this message.  Script should still work.');
        }
        _USER.isBetaUser = false;
        _USER.isDevUser = false;
    } else {
        const lcName = _USER.name.toLowerCase();
        _USER.isDevUser = _wmephDevList.includes(lcName);
        _USER.isBetaUser = _wmephBetaList.includes(lcName);
    }
    if (_USER.isDevUser) {
        _USER.isBetaUser = true; // dev users are beta users
    }

    _catTransWaze2Lang = I18n.translations[_userLanguage].venues.categories; // pulls the category translations

    // Split out state-based data
    const _stateHeaders = _PNH_DATA.states[0].split('|');
    _psStateIx = _stateHeaders.indexOf('ps_state');
    _psState2LetterIx = _stateHeaders.indexOf('ps_state2L');
    _psRegionIx = _stateHeaders.indexOf('ps_region');
    _psGoogleFormStateIx = _stateHeaders.indexOf('ps_gFormState');
    _psDefaultLockLevelIx = _stateHeaders.indexOf('ps_defaultLockLevel');
    // ps_requirePhone_ix = _stateHeaders.indexOf('ps_requirePhone');
    // ps_requireURL_ix = _stateHeaders.indexOf('ps_requireURL');
    _psAreaCodeIx = _stateHeaders.indexOf('ps_areacode');

    // Set up Run WMEPH button once place is selected
    bootstrapRunButton();

    // Setup highlight colors
    initializeHighlights();

    W.model.venues.on('objectschanged', () => errorHandler(() => {
        if ($('#WMEPH_banner').length > 0) {
            updateServicesChecks();
            assembleServicesBanner();
        }
    }));

    phlog('Starting Highlighter');
    bootstrapWmephColorHighlights();
} // END placeHarmonizer_init function

function placeHarmonizerBootstrap() {
    if (W && W.loginManager && W.loginManager.user && W.map && WazeWrap && WazeWrap.Ready && W.model.categoryBrands.PARKING_LOT && require) {
        placeHarmonizerInit();
    } else {
        phlog('Waiting for WME map and login...');
        setTimeout(placeHarmonizerBootstrap, 200);
    }
}

const SPREADSHEET_ID = '1pBz4l4cNapyGyzfMJKqA4ePEFLkmz2RryAt1UV39B4g';
const SPREADSHEET_RANGE = '2019.01.20.001!A2:L';
const API_KEY = 'YTJWNVBVRkplbUZUZVVObU1YVXpSRVZ3ZW5OaFRFSk1SbTR4VGxKblRURjJlRTFYY3pOQ2NXZElPQT09';

function downloadPnhData() {
    const dec = s => atob(atob(s));
    const getSpreadsheetUrl = (id, range, key) => `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?${dec(key)}`;

    // TODO change the _PNH_DATA cache to use an object so we don't have to rely on ugly array index lookups.
    const processData1 = (data, colIdx) => data.filter(row => row.length >= colIdx + 1).map(row => row[colIdx]);

    $.getJSON(getSpreadsheetUrl(SPREADSHEET_ID, SPREADSHEET_RANGE, API_KEY)).done(res => {
        const { values } = res;
        if (values[0][0].toLowerCase() === 'obsolete') {
            WazeWrap.Alerts.error(_SCRIPT_NAME, 'You are using an outdated version of WMEPH that doesn\'t work anymore. Update or disable the script.');
            return;
        }

        // This needs to be performed before makeNameCheckList() is called.
        _wordVariations = processData1(values, 11).slice(1).map(row => row.toUpperCase().replace(/[^A-z0-9,]/g, '').split(','));

        _PNH_DATA.USA.pnh = processData1(values, 0);
        _PNH_DATA.USA.pnhNames = makeNameCheckList(_PNH_DATA.USA.pnh);

        _PNH_DATA.states = processData1(values, 1);

        _PNH_DATA.CAN.pnh = processData1(values, 2);
        _PNH_DATA.CAN.pnhNames = makeNameCheckList(_PNH_DATA.CAN.pnh);

        _PNH_DATA.USA.categories = processData1(values, 3);
        _PNH_DATA.USA.categoryNames = makeCatCheckList(_PNH_DATA.USA.categories);

        // For now, Canada uses some of the same settings as USA.
        _PNH_DATA.CAN.categories = _PNH_DATA.USA.categories;
        _PNH_DATA.CAN.categoryNames = _PNH_DATA.USA.categoryNames;

        const WMEPHuserList = processData1(values, 4)[1].split('|');
        const betaix = WMEPHuserList.indexOf('BETAUSERS');
        _wmephDevList = [];
        _wmephBetaList = [];
        for (let ulix = 1; ulix < betaix; ulix++) _wmephDevList.push(WMEPHuserList[ulix].toLowerCase().trim());
        for (let ulix = betaix + 1; ulix < WMEPHuserList.length; ulix++) _wmephBetaList.push(WMEPHuserList[ulix].toLowerCase().trim());

        const processTermsCell = (termsValues, colIdx) => processData1(termsValues, colIdx)[1]
            .toLowerCase().split('|').map(value => value.trim());
        _hospitalPartMatch = processTermsCell(values, 5);
        _hospitalFullMatch = processTermsCell(values, 6);
        _animalPartMatch = processTermsCell(values, 7);
        _animalFullMatch = processTermsCell(values, 8);
        _schoolPartMatch = processTermsCell(values, 9);
        _schoolFullMatch = processTermsCell(values, 10);

        placeHarmonizerBootstrap();
    }).fail(res => {
        const message = res.responseJSON && res.responseJSON.error ? res.responseJSON.error : 'See response error message above.';
        console.error('WMEPH failed to load spreadsheet:', message);
    });
}

function bootstrap() {
    // Quit if another version of WMEPH is already running.
    if (unsafeWindow.wmephRunning) {
        WazeWrap.Alerts.error(_SCRIPT_NAME, 'Multiple versions of Place Harmonizer are turned on.  Only one will be enabled.');
        return;
    }
    unsafeWindow.wmephRunning = 1;
    // Start downloading the PNH spreadsheet data in the background.  Starts the script once data is ready.
    downloadPnhData();
}

bootstrap();
