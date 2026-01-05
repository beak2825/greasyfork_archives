// ==UserScript==
// @name            WME KeepMyLayers
// @namespace       https://greasyfork.org/users/11629-TheLastTaterTot
// @version         0.4.9
// @description     Resets WME layers to the way you want them, plus other fancy stuff (and bonus features for Beta WME testers).
// @author          TheLastTaterTot
// @include         https://beta.waze.com/*editor/*
// @include         https://www.waze.com/*editor/*
// @exclude         https://www.waze.com/*user/editor/*
// @grant           GM_info
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_listValues
// @run-at          document-start
// @icon            data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/15698/WME%20KeepMyLayers.user.js
// @updateURL https://update.greasyfork.org/scripts/15698/WME%20KeepMyLayers.meta.js
// ==/UserScript==
/* global KMLayersVersion KmLSync */

// PERSISTENT VARS DUE TO INTENTIONAL CLOSURES
var isNotFirefox = !/\bfirefox\b/i.test(navigator.userAgent), //myKMLayers = null,
    isBeta = /beta/.test(location.host), layersResetStatus,
    layersBit = null, kmlReset = false, minKMLVersion = '0.4.8';

// ############################### DEBUG ##################################
/*
// Quiet log outputs from other scripts:
// --- Comment from here and ~25 lines below (up to ###) for public version
var RESET = false; // Set this to true to delete all of KmL's saved settings in Browser and userscript space
myKMLayers = null;

(function() {
    console.__log = console.log;
    console.log = function() {
        var args = arguments;
        //argArray = Object.keys(args).map(function (key) { return args[key] });

        if (args['0'].constructor === String && /^(WMEKmL|WMECM|WMEEE|WMERSH|RSel\sHighlights)$/.test(args['0'].substr(0, 8))) {
            console.__log.apply(console, args);
        }
    };
})();

if (RESET) {
    localStorage.removeItem('WME_KeepMyLayers');
    localStorage.removeItem('WME_KMLSettings');
    localStorage.removeItem('WME_KMLUsageHelper');
    sessionStorage.removeItem('WME_KeepMyLayersIdx');
    GM_deleteValue('WMEKMLayers_Beta');
    GM_deleteValue('WMEKMLayers_Lang');
    GM_deleteValue('WMEKMLayers_Usage');
    GM_deleteValue('WMEKMLayers_Prefs');
    GM_deleteValue('WMEKMLayers_Presets');
}
*/
// ########################################################################
function kmllog() {
    var args = arguments,
        argArray = Object.keys(args).map(function(key) {
            return args[key];
        }),
        kmllogCss = 'background: #444; color: #FF2E9A';
    if (argArray.last == '/') argArray = argArray.splice(-1);
    console.debug('%cWMEKmL: %s', kmllogCss, argArray.join(' '));
}
// ############################### DEBUG ##################################

/* [TODO]:
    fix saving of layers for different locales - assessing
    provide a sync between beta and production editor - in progress
    allow the option to individually choose settings to sync - in progress
    make layers manually sortable or sort ascending
    make adding and removing layer sets easier
    improve UI and user-friendliness - in progress
    create a welcome msg for first time users and a (?) in pref pane to see it again - in progress
    allow setting of other layers that don't show up in the WME Layers menu
    add the ability assign shortcut keys to layer presets
    ---
     add an option to only auto-reset layers for PLs with layers? - reviewed; not important atm
    show a summary of visible layers for each layer set - √
    make it easier to switch among layer presets - √
*/

//========================================================================
//     RRRRRR  EEEEEEE DDDDD   IIIII RRRRRR  EEEEEEE  CCCCC  TTTTTTT
//     RR   RR EE      DD  DD   III  RR   RR EE      CC    C   TTT
//     RRRRRR  EEEEE   DD   DD  III  RRRRRR  EEEEE   CC        TTT
//     RR  RR  EE      DD   DD  III  RR  RR  EE      CC    C   TTT
//     RR   RR EEEEEEE DDDDDD  IIIII RR   RR EEEEEEE  CCCCC    TTT
//========================================================================

var kmlPLlayers = '',
    kmlPLlayerFilters,
    kmlPLhref = false,
    kmlPLhost = false,
    kmlPLpath = false,
    kmlayersBetaChk,
    kmlayersLangChk,
    kmlPLhrefLast20 = location.href.substr(-20);

if (localStorage.WME_KMLSettings) {

    var kmlSettings = localStorage.WME_KMLSettings,
	    kmlayersStartupChk = [/&x\b/.test(kmlSettings), /&b\b/.test(kmlSettings), /&l\b/.test(kmlSettings)],
	    mykml, idx, lF, layersBit, numPresets;

    if ( !kmlayersStartupChk[0] && !~kmlPLhrefLast20.lastIndexOf('&kmlayers') ) { //not a layers-removal redirect?
        if ( /&[^&]*Filter=[^&]*|&layers=(\d+)/.test(location.href) ) { //check for stuff to remove
            kmlPLhref = location.href.match(/&layers=(\d+)/);
            if ( kmlPLhref && kmlPLhref[1] ) {
                kmlPLlayers = '&kmlayers=' + kmlPLhref[1];
            } else { kmlPLlayers = '&kmlayers='; }
            kmlPLhref = location.href.replace(/&[^&]*Filter=[^&]*|&layers=(\d+)/ig,'');

            // Set filters here... although the script can directly reset filters, it can also cause deselection of any selected segments in the PL. KmL will reselect those segments, but it may better to avoid that when possible
			mykml = JSON.parse(localStorage.WME_KeepMyLayers);
			if (mykml.SAVED_PRESETS && mykml.SAVED_PRESETS.length) {
				idx = (sessionStorage.WME_KeepMyLayersIdx) ? parseInt(sessionStorage.WME_KeepMyLayersIdx) : mykml.idx;
		        if ((!idx && idx !== 0) || idx >= mykml.SAVED_PRESETS.length) idx = 0;
				lF = mykml.SAVED_PRESETS[idx].layerFilters;
				layersBit = mykml.SAVED_PRESETS[idx].layersBit;
				if (layersBit) kmlPLlayers = '&layers=' + layersBit + kmlPLlayers;
				else kmlPLlayers = '&layers=1029' + kmlPLlayers;

				if (lF) {
	                kmlPLlayers = '&mapProblemFilter=' + lF.mapProblem +
	                			  '&mapUpdateRequestFilter=' + lF.mapUpdateRequest +
	                			  '&venueFilter=' + lF.venue +
	                			  '&update_requestsFilter=true&problemsFilter=true' +
	                              kmlPLlayers;
                } else {
                    kmlPLlayers = '&mapProblemFilter=0&mapUpdateRequestFilter=0&venueFilter=1&update_requestsFilter=true&problemsFilter=true' +
                                  kmlPLlayers;
                }
			}
        } /*else { // else PL has no layers or filters
            window.history.pushState('', 'Waze Map Editor', location.href.replace(/&[^&]+Filter=[^&]+|&layers=(\d+)/ig,''));
        }*/
    }

    if (kmlayersStartupChk[1] && !/&b=0\b/.test(kmlPLhrefLast20)) { // beta toggle check //&&
        kmlayersBetaChk = GM_getValue("WMEKMLayers_Beta");

        if (kmlayersBetaChk === true && //if set to beta-editor
            !isBeta) { //if PL is not beta.waze.com
            kmlPLhost = 'https://beta.waze.com';
        } else if (kmlayersBetaChk === false && //if set to production editor
            isBeta) { //if PL is not www.waze.com
            kmlPLhost = 'http://www.waze.com';
        }
        kmlPLlayers = '&b=0' + kmlPLlayers;
    }

    if (kmlayersStartupChk[2] && !/&l=0\b/.test(kmlPLhrefLast20)) { // language check
        kmlayersLangChk = GM_getValue("WMEKMLayers_Lang");
        //kmllog('kmlayersLangChk', kmlayersLangChk);
        if (kmlayersLangChk === true || kmlayersLangChk === "true") { //if set to filter out language
            if (location.pathname !== '/editor/') {
                kmlPLpath = '/editor/';
            }
        } else if (kmlayersLangChk) { //is truthy
            var kmlPLpath_exemplar = '/' + kmlayersLangChk + '/editor/';
            if (location.pathname !== kmlPLpath_exemplar) {
                kmlPLpath = kmlPLpath_exemplar;
            }
        }
        kmlPLlayers = '&l=0' + kmlPLlayers;
    }

} else { //no save preferences yet... first time running on this (sub)domain

    if (!/&b=0\b/.test(kmlPLhrefLast20)) { //beta-check not temporarily disabled?
        kmlayersBetaChk = GM_getValue("WMEKMLayers_Beta");

        if (kmlayersBetaChk === true && //if set to beta-editor
            !isBeta) { //if PL is not beta.waze.com
            kmlPLhost = 'https://beta.waze.com';
        } else if (kmlayersBetaChk === false && //if set to production editor
            isBeta) { //if PL is not www.waze.com
            kmlPLhost = 'http://www.waze.com';
        }
        kmlPLlayers = '&b=0' + kmlPLlayers;
    }

    if (!/&l=0\b/.test(kmlPLhrefLast20)) { //prevents accidental looping in case a locale page isn't found
        kmlayersLangChk = GM_getValue("WMEKMLayers_Lang");

        if (kmlayersLangChk === true || kmlayersLangChk === "true") { //if set to filter out language
            if (location.pathname !== '/editor/') {
                kmlPLpath = '/editor/';
            }
        } else if (kmlayersLangChk) { //is truthy
            var kmlPLpath_exemplar = '/' + kmlayersLangChk + '/editor/';
            if (location.pathname !== kmlPLpath_exemplar) {
                kmlPLpath = kmlPLpath_exemplar;
            }
        }
        kmlPLlayers = '&l=0' + kmlPLlayers;
    }
}

switch (true) {
    case (!kmlPLhost && !kmlPLpath && !kmlPLhref): //no modifications are necessary
        break;
    default:
        if (!kmlPLhost) kmlPLhost = location.origin;
        if (!kmlPLpath) kmlPLpath = location.pathname;
        if (kmlPLhref) localStorage.layerFilters = '{"mapProblem":"0","mapUpdateRequest":"0","venue":"1","update_requests":"true","problems":"true"}';
        else kmlPLhref = location.href;

        //remove any query vals greater than 0, and increment query val by 1 to prevent its effects on next refresh
        //if (!kmlPLhref) kmlPLhref = location.href.replace(/(&b|&l)=[1-9]+/,'').replace(/(?!&b=|&l=)0/g,'1');

        //mllog(location.origin, '/');
        //kmllog(location.pathname, '/');
        var kmlPLhref_temp = kmlPLhref.match(/editor\/(.*)/);
        //kmllog(kmlPLhost, kmlPLpath, kmlPLhref_temp[1], kmlPLlayers);


        if (kmlPLhref_temp[1]) location.replace(kmlPLhost + kmlPLpath + kmlPLhref_temp[1] + kmlPLlayers);
        else location.replace(kmlPLhost + kmlPLpath);
}


/////////////////////////////////////////////////////////////////////////
var KeepMyLayers = function() {
    var kml = Array(10), //counter
        _W_ = unsafeWindow.Waze,
        _W_map = unsafeWindow.Waze.map,
        _W_model = unsafeWindow.Waze.model,
        kml_translations = unsafeWindow.I18n.translations[unsafeWindow.I18n.locale],
        kml_lFTranslations = {
            closed_problems: [kml_translations.layer_switcher.filters.closed_problems.inactive,
                kml_translations.layer_switcher.filters.closed_problems.active
            ],
            residential: [kml_translations.layer_switcher.filters.residential.inactive,
                kml_translations.layer_switcher.filters.residential.active
            ]
        },
        _$_ = unsafeWindow.$,
        cancelPopup = null, showPopup = true, kmlPLSegIDs = false;

    for (var kmli = 10; kmli--;) { kml[kmli] = 0; } //counter obj
    //kmllog('myKMLayers 0')

    // ---------------------------------------------------------------------
    //----------------------------------------------------------------------
    var kmlElementMap = {
        ids: {
            betaRedirect: 'cbKML_0',
            altPermalink: 'cbKML_1',
            regPermalink: 'cbKML_2',
            syncPrefs: 'cbKML_3',
            syncPresets: 'cbKML_4',
            localeRedirect: 'cbKML_5',
            cityLayer: 'cbKML_6',
            amLayer: 'cbKML_7',
            roadLayer: 'cbKML_8',
            disableRedirect: 'cbKML_9',
            colorTabs: 'cbKML_10'
        },
        idToUsageName: {
            cbKML_0: 'betaToggle',
            cbKML_1: 'altPermalink',
            cbKML_2: 'regPermalink',
            cbKML_3: 'syncPrefs',
            cbKML_4: 'syncPresets',
            cbKML_5: 'locale',
            cbKML_6: 'cityLayerOpacity',
            cbKML_7: 'amLayerOpacity',
            cbKML_8: 'roadLayerOpacity',
            cbKML_9: 'disableAutoReset',
            cbKML_10: 'colorTabsOnly'
        },
        queryCodes: {
            betaRedirect: '&b',
            altPermalink: '&a',
            regPermalink: '&r',
            syncPrefs: '&s',
            syncPresets: '&p',
            localeRedirect: '&l',
            cityLayer: '&1',
            amLayer: '&5',
            roadLayer: '&2',
            disableRedirect: '&x',
            colorTabs: '&t'
        },
        queryCodeList: ['&b', '&a', '&r', '&s', '&p', '&l', '&1', '&5', '&2', '&x', '&t']
    };


    //----------------------------------------------------------------------
    //kmllog('myKMLayers 1')
    try {
        KMLayersVersion = {
            currentVersion: GM_info.script.version,
            lastVersionString: function(){return localStorage.WME_KMLUsageHelper.match(/(?!&v)(?:\d{0,2}\.)+\d{0,2}/);},
            convertToNumericVersion: function(versionString) {
                var vMult = [8000, 400, 20, 1],
                    versionNumeric = 0;

                if (versionString) {
                    if (versionString.constructor === Array) {
                        if (versionString.length === 1) {
                            versionString = versionString[0];
                        } else {
                            console.error('WMEKmL:', 'versionString is an array with more than 1 element.');
                        }
                    }
                    return versionString.match(/(\d)+/g).map(function(d, i) {
                        versionNumeric += d * vMult[i];
                    }), versionNumeric;
                } else {
                    return null;
                }
            },
            getLastVersionValue: function() {
                return this.convertToNumericVersion(this.lastVersionString());
            },
            updateVersionString: function() {
                localStorage.WME_KMLUsageHelper = localStorage.WME_KMLUsageHelper.replace(/&v(?:\d{0,2}\.?)+\d{0,2}|$/, '&v' + this.currentVersion);
                KmLSync.setGM('WMEKMLayers_Usage', localStorage.WME_KMLUsageHelper);
                //this.lastVersionString = this.currentVersion;
            },
            isUpToDate: function(minimumVersionString) {
                var minVersionVal = this.convertToNumericVersion(minimumVersionString),
                    lastVersionVal = this.getLastVersionValue();
                return (lastVersionVal >= minVersionVal) ? true : false;
            }
        };
    } catch(err) { console.error(err); }

    try {
        KmLSync = {
            isBeta: isBeta,
            getGM: GM_getValue,
            setGM: function(gmVar, gmVal) {
                requestAnimationFrame(function() {GM_setValue(gmVar, gmVal);});
            },
            deleteGM: function(gmVar) {
                requestAnimationFrame(function() {GM_deleteValue(gmVar);});
            },
            callGM: function(gmVar, callback) {
                requestAnimationFrame(function() {callback(GM_getValue(gmVar));});
            },
            getPreferencesFromGM: function() {
                return GM_getValue("WMEKMLayers_Prefs");
            },
            getUsageLogFromGM: function() {
                return GM_getValue("WMEKMLayers_Usage");
            },
            getBetaTogValueFromGM: function() {
                return GM_getValue("WMEKMLayers_Beta");
            },
            getLocaleValueFromGM: function() {
                return GM_getValue("WMEKMLayers_Lang");
            },
            getSavedPresetsFromGM: function() {
                return GM_getValue("WMEKMLayers_Presets");
            },
            _GM_DEBUG: {
                listNames: GM_listValues,
                getAll: function() { //shows the values of all saved GM variables
                    var gmVarNames = GM_listValues(),
                        gmValues = {};

                    for (var g=0, gLength = gmVarNames.length; g < gLength; g++) {
                        gmValues[gmVarNames[g]] = GM_getValue(gmVarNames[g]);
                        //console.info(gmVarNames[g], '=', gmValues[gmVarNames[g]]);
                    }
                    return gmValues;
                },
                deleteAll: function() {
                    var gmVarNames = GM_listValues();
                    for (var g=0, gLength=gmVarNames.length; g < gLength; g++) {
                        GM_deleteValue(gmVarNames[g]);
                    }
                }
            },
            _GM_CALLBACKS: {
                prefs: '',
                usage: '',
                beta: '',
                lang: '',
                presets: {}
            },
            _GM_refreshPrefsAttribute: function() {
                this.callGM("WMEKMLayers_Prefs", function(c) {
                    KmLSync._GM_CALLBACKS.prefs = c;
                    //localStorage.WME_KMLSettings = c;
                });
            },
            _GM_refreshUsageAttribute: function() {
                this.callGM("WMEKMLayers_Usage", function(c) {
                    KmLSync._GM_CALLBACKS.usage = c;
                    //localStorage.WME_KMLUsageHelper = c;
                });
            },
            _GM_refreshBetaAttribute: function() {
                this.callGM("WMEKMLayers_Beta", function(c) {
                    KmLSync._GM_CALLBACKS.beta = c;
                });
            },
            _GM_refreshLangAttribute: function() {
                this.callGM("WMEKMLayers_Lang", function(c) {
                    KmLSync._GM_CALLBACKS.lang = c;
                });
            },
            _GM_refreshPresetsToObject: function() {
                this.callGM("WMEKMLayers_Presets", function(c) {
                    KmLSync._GM_CALLBACKS.presets = c;
                });
            },
            setPreferencesInGM: function(gmVal) {
                this.setGM("WMEKMLayers_Prefs", gmVal);
            },
            setUsageLogInGM: function(gmVal) {
                this.setGM("WMEKMLayers_Usage", gmVal);
            },
            setBetaTogValueInGM: function(gmVal) {
                this.setGM("WMEKMLayers_Beta", gmVal);
            },
            setLocaleValueInGM: function(gmVal) {
                this.setGM("WMEKMLayers_Lang", gmVal);
            },
            setSavedPresetsInGM: function(gmVal) {
                this.setGM("WMEKMLayers_Presets", gmVal);
            },
            addThisSettingToLS: function(queryCode) {
                //Add the query code without possibility of duplicating
                localStorage.WME_KMLSettings = localStorage.WME_KMLSettings.replace(new RegExp(queryCode + '|$'), queryCode);
            },
            removeThisSettingFromLS: function(queryCode) {
                localStorage.WME_KMLSettings = localStorage.WME_KMLSettings.replace(queryCode, '');
            },
            updateTheseSettingToLS: function(queryCodes) {
                //this._GM_refreshPrefsAttribute();
                var crossDomainKMLPrefs = this.getPreferencesFromGM(); //this._GM_CALLBACKS.prefs;
                if (crossDomainKMLPrefs) {
                    if (queryCodes.constructor === String) queryCodes = [queryCodes];
                    for (var q = 0, numQueryCodes = queryCodes.length; q < numQueryCodes; q++) {
                        if (~crossDomainKMLPrefs.indexOf(queryCodes[q])) {
                            this.addThisSettingToLS(queryCodes[q]);
                            if (numQueryCodes === 1) return true;
                        } else {
                            this.removeThisSettingFromLS(queryCodes[q]);
                            if (numQueryCodes === 1) return false;
                        }
                    }
                } else {
                    kmllog('Missing crossDomainKMLPrefs for synchronizing ' + queryCodes + ' between Beta and Prod WME.');
                    console.info(this._GM);
                    return null;
                }
            },
            applyBetaProdSettingsToLS: function() {
                // Updates both beta-prod toggle and toggle-friendly PLs features
                var betaToggleSetting = this.updateTheseSettingToLS('&b'),
                    altPLSetting = this.updateTheseSettingToLS('&a');

                // Check if these settings are incongruent...
                // Alt-PL feature should not be enabled if there is no beta-prod toggle
                if (!betaToggleSetting && altPLSetting) {
                    this.removeThisSettingFromLS('&a');
                }
            },
            applyLocaleSettingToLS: function() {
                this.updateTheseSettingToLS('&l');
            },
            applySyncPrefsSettingToLS: function() {
                this.updateTheseSettingToLS('&s');
            },
            applyAllPreferencesToLSFromGM: function() {
                this._GM_refreshPrefsAttribute();
                localStorage.WME_KMLSettings = this.getPreferencesFromGM();
            },
            upsyncAllPreferencesFromLSToGM: function() {
                this.setGM("WMEKMLayers_Prefs", localStorage.WME_KMLSettings);
            },
            getSessionPresetIdx: function(mykmlLocalVar) {
                if (sessionStorage.WME_KeepMyLayersIdx) {
                    var sessionIdx = parseInt(sessionStorage.WME_KeepMyLayersIdx);
                    if ((!sessionIdx && sessionIdx !== 0) || sessionIdx < 0 || sessionIdx >= mykmlLocalVar.SAVED_PRESETS.length)
                        sessionIdx = 0;
                    return sessionIdx;
                } else { return mykmlLocalVar.idx; }
            },
            setSessionPresetIdx: function(idx) {
                sessionStorage.WME_KeepMyLayersIdx = idx;
            },
            setMyKmLPresetIdxInLS: function(idx) {
                localStorage.WME_KeepMyLayers = localStorage.WME_KeepMyLayers.replace(/"idx":(\d+)?/, '"idx":' + idx);
            },
            addMethodsToMyKmLObj: function(mykml) { // Add methods to myKMLayers object
                var that = this;

                mykml.getSessionPresetIdx = function(){
                    if (sessionStorage.WME_KeepMyLayersIdx) {
                        var sessionIdx = parseInt(sessionStorage.WME_KeepMyLayersIdx);
                        if ((!sessionIdx && sessionIdx !== 0) || sessionIdx < 0 ||
                            (sessionIdx >= this.SAVED_PRESETS.length && sessionIdx !== 100)) {
                            this.idx = 0;
                        } else {
                            sessionStorage.WME_KeepMyLayersIdx = sessionIdx;
                            this.idx = sessionIdx;
                        }
                    }
                    return this.idx;
                };
                mykml.setSessionPresetIdx = function(idx) {
                    if (idx === undefined) idx = this.idx;
                    sessionStorage.WME_KeepMyLayersIdx = idx;
                };

                mykml.setMyKmLPresetIdxInLS = function(idx) {
                    if (idx === undefined) idx = this.idx;
                    localStorage.WME_KeepMyLayers = localStorage.WME_KeepMyLayers.replace(/"idx":(\d+)?/, '"idx":' + idx);
                };
                mykml.saveToLocalStorage = function() {
                    if (this.idx >= this.SAVED_PRESETS.length && this.idx !== 100) this.idx = 0;
                    localStorage.WME_KeepMyLayers = JSON.stringify(mykml);
                };
                mykml.mergeMyKmLObjToLocalStorage = function() {
                    var baseMyKmL = JSON.parse(localStorage.WME_KeepMyLayers);

                    if (isNotFirefox) _$_.extend(true, baseMyKmL, this);

                    baseMyKmL.idx = that.getSessionPresetIdx(baseMyKmL);
                    if (baseMyKmL.idx >= baseMyKmL.SAVED_PRESETS.length && this.idx !== 100) baseMyKmL.idx = 0;
                    that.addMethodsToMyKmLObj(baseMyKmL);
                    mykml = baseMyKmL;
                };
                mykml.mergeLocalStorageToMyKmLObj = function() {
                    if (isNotFirefox) {
                        var baseMyKmL = JSON.parse(localStorage.WME_KeepMyLayers);
                        _$_.extend(true, this, baseMyKmL);
                    }
                    if (this.idx >= this.SAVED_PRESETS.length && this.idx !== 100) this.idx = 0; //reset for whatever odd reason the idx is larger than what's available
                    that.addMethodsToMyKmLObj(this);
                };
                /*var hasSavedLayers = function() {
                    if (this.visibleInLayersMenu && Object.keys(this.visibleInLayersMenu).length) {
                        return true;
                    } else {
                        return false;
                    }
                };
                var numPresets = mykml.SAVED_PRESETS.length;
                if (numPresets) {
                    for (var kml_np = numPresets; kml_np--;) {
                        mykml.SAVED_PRESETS[kml_np].hasSavedLayers = hasSavedLayers;
                    }
                }*/
                mykml.resetLayerFilterPreset = function(idx) {
                    if (!idx) idx = this.idx;

                    this.SAVED_PRESETS[idx].layerFilters = {
                        mapProblem: 0,
                        mapUpdateRequest: 0,
                        venue: 1
                    };
                };

                mykml.addNewPreset = function(newKMLayerSetName) {
                    var newIdx = this.SAVED_PRESETS.length;
                    this.idx = newIdx;
                    this.SAVED_PRESETS[newIdx] = {
                        name: newKMLayerSetName,
                        visibleInLayersMenu: {},
                        visibleInLayersMenuRealName: [],
                        layerFilters: {
                            mapProblem: 0,
                            mapUpdateRequest: 0,
                            venue: 1
                        },
                        saved: false
                        //hasSavedLayers: hasSavedLayers
                    };
                };

                mykml.removePreset = function(idx) {
                    if (idx === undefined) idx = this.idx;
                    var maxIndex = this.SAVED_PRESETS.length-1;
                    if (maxIndex > 0) {
                        this.SAVED_PRESETS.splice(idx, 1);
                        if (this.idx === idx) {
                            if (this.idx === maxIndex) this.idx--;
                        } else if (this.idx > idx && this.idx !== 100) {
                            this.idx--;
                        }
                    }
                };
                return mykml;
            },
            saveMyKmLObjToLocalStorage: function(mykmlLocalVar) {
                if (mykmlLocalVar.idx >= mykmlLocalVar.SAVED_PRESETS.length && mykmlLocalVar.idx !== 100) mykmlLocalVar.idx = 0;
                localStorage.WME_KeepMyLayers = JSON.stringify(mykmlLocalVar);
            },
            mergeMyKmLObjToLocalStorage: function(mykmlLocalVar) {
                var baseMyKmL = JSON.parse(localStorage.WME_KeepMyLayers);

                if (isNotFirefox) _$_.extend(true, baseMyKmL, mykmlLocalVar);

                baseMyKmL.idx = this.getSessionPresetIdx(baseMyKmL);
                if (baseMyKmL.idx >= baseMyKmL.SAVED_PRESETS.length && baseMyKmL.idx !== 100) baseMyKmL.idx = 0;
                this.addMethodsToMyKmLObj(baseMyKmL);
                return baseMyKmL;
            },
            mergeLocalStorageToMyKmLObj: function(mykmlLocalVar) {
                if (isNotFirefox) {
                    var baseMyKmL = JSON.parse(localStorage.WME_KeepMyLayers);
                    _$_.extend(true, mykmlLocalVar, baseMyKmL);
                }
                if (mykmlLocalVar.idx >= mykmlLocalVar.SAVED_PRESETS.length && mykmlLocalVar.idx !== 100) mykmlLocalVar.idx = 0;
                this.addMethodsToMyKmLObj(mykmlLocalVar);
                return mykmlLocalVar;
            },
            upsyncSavedPresetsToGMFrom: function(mykmlLocalVar) {
                if (mykmlLocalVar === undefined) mykmlLocalVar = JSON.parse(localStorage.WME_KeepMyLayers);
                if (mykmlLocalVar && mykmlLocalVar.SAVED_PRESETS && mykmlLocalVar.SAVED_PRESETS.length) {
                    this.setGM("WMEKMLayers_Presets", JSON.stringify(mykmlLocalVar.SAVED_PRESETS));
                    return true;
                } else {
                    return false;
                }
            },
            getUniqueNameSavedPresets: function(a,b) { //defaults to 'a' if a and b names match
                var a_l = a.length,
                    b_l = b.length,
                    a_i, b_i,
                    c_obj = {}, c_name, r = [];

                // Store presets in object b into c_obj by name
                for (b_i = 0; b_i < b_l; b_i++) {
                    if (b[b_i] && b[b_i].name) c_obj[b[b_i].name] = b[b_i];
                }
                // Overwrite any duplicate names with whatever is in object a
                for (a_i = 0; a_i < a_l; a_i++) {
                    if (a[a_i] && a[a_i].name) c_obj[a[a_i].name] = a[a_i];
                }
                // Convert back to an array
                for (c_name in c_obj) {
                    r.push(c_obj[c_name]);
                }
                return r;
            },
            combineSavedPresetsToGMLSFrom: function(mykmlLocalVar) {
                var presetsGMString = this.getGM("WMEKMLayers_Presets"),
                    presetsGM;

                if (presetsGMString) {
                    presetsGM = JSON.parse(presetsGMString);
                } else {
                    presetsGM = [];
                }

                if (mykmlLocalVar && mykmlLocalVar.SAVED_PRESETS &&
                    mykmlLocalVar.SAVED_PRESETS.length) {

                    presetsGM = this.getUniqueNameSavedPresets(presetsGM, mykmlLocalVar.SAVED_PRESETS);

                    this.setGM("WMEKMLayers_Presets", JSON.stringify(presetsGM));
                    mykmlLocalVar.syncPresets = true;
                    mykmlLocalVar.SAVED_PRESETS = presetsGM;
                    this.saveMyKmLObjToLocalStorage(mykmlLocalVar);
                    return mykmlLocalVar;
                } else {
                    return false;
                }
            },
            getSavedPresetsFromGMThenToLS: function(mykmlLocalVar) {
                var presetsGMString = this.getGM("WMEKMLayers_Presets"),
                    presetsGM;

                if (mykmlLocalVar === undefined) mykmlLocalVar = JSON.parse(localStorage.WME_KeepMyLayers);

                if (presetsGMString) {
                    presetsGM = JSON.parse(presetsGMString);
                } else {
                    return kmllog('Note - No saved presets were found for syncing.'), mykmlLocalVar;
                }

                if (mykmlLocalVar && mykmlLocalVar.SAVED_PRESETS && mykmlLocalVar.SAVED_PRESETS.length) {
                    //_$_.extend('', mykmlLocalVar.SAVED_PRESETS, presetsGM);
                    mykmlLocalVar.SAVED_PRESETS = presetsGM;

                    this.saveMyKmLObjToLocalStorage(mykmlLocalVar);
                    this.addMethodsToMyKmLObj(mykmlLocalVar);

                    // Cleanup var if necessary
                    for (var kml_p = mykmlLocalVar.SAVED_PRESETS.length; kml_p--;) {
                        if (!mykmlLocalVar.SAVED_PRESETS[kml_p]) {
                            mykmlLocalVar.removePreset(kml_p);
                            saveObj = true;
                        }
                    }

                    return mykmlLocalVar;
                } else {
                    return null;
                }
            },
            hasSettingEnabled: function(queryCode) {
                if (localStorage.WME_KMLSettings === undefined) {
                    return false;
                } else {
                    return !!~localStorage.WME_KMLSettings.indexOf(queryCode);
                }
            },
            hasSeenKMLPopup: function(usageQueryCode) {
                if (localStorage.WME_KMLUsageHelper === undefined) {
                    return false;
                } else {
                    return !!~localStorage.WME_KMLUsageHelper.indexOf(usageQueryCode);
                }
            },
            logKMLUsageHistory: function(usageQueryCode) {
                if (localStorage.WME_KMLUsageHelper === undefined || !~localStorage.WME_KMLUsageHelper.indexOf(usageQueryCode)) {
                    localStorage.WME_KMLUsageHelper += usageQueryCode;
                    this.setGM('WMEKMLayers_Usage', localStorage.WME_KMLUsageHelper);
                    return true;
                } else {
                    return false;
                }
            },
            unlogKMLUsageHistory: function(usageQueryCode) {
                if (~localStorage.WME_KMLUsageHelper.indexOf(usageQueryCode)) {
                    localStorage.WME_KMLUsageHelper = localStorage.WME_KMLUsageHelper.replace(usageQueryCode,'');
                    this.setGM('WMEKMLayers_Usage', localStorage.WME_KMLUsageHelper);
                    return true;
                } else {
                    return false;
                }
            },
            toggleKMLUsageHistory: function(usageQueryCode) {
                if (!~localStorage.WME_KMLUsageHelper.indexOf(usageQueryCode)) {
                    localStorage.WME_KMLUsageHelper += usageQueryCode;
                    this.setGM('WMEKMLayers_Usage', localStorage.WME_KMLUsageHelper);
                    return true;
                } else {
                    localStorage.WME_KMLUsageHelper = localStorage.WME_KMLUsageHelper.replace(usageQueryCode,'');
                    this.setGM('WMEKMLayers_Usage', localStorage.WME_KMLUsageHelper);
                    return false;
                }
            },
            convertToNumericVersion: KMLayersVersion.convertToNumericVersion,
            parseQueryString: function(queryString) {
                return queryString.match(/&[a-z\d\.]+/g);
            },
            getUniqueQueryString: function(queryString) {
                var uniqobj = {},
                    versionStringArray = queryString.match(/&v[\d\.]*/g),
                    versionCompare = 0,
                    numericVer, highestVersion,
                    parsedQueryString = queryString.match(/&[a-uw-z1-9]/g);

                if (versionStringArray && versionStringArray.length > 1) {
                    for (var v = 0, vLength = versionStringArray.length; v < vLength; v++) {
                        numericVer = this.convertToNumericVersion(versionStringArray[v].substr(2));
                        if (versionCompare < numericVer) {
                            highestVersion = versionStringArray[v];
                            versionCompare = numericVer;
                        }
                    }
                } else {
                    highestVersion = '';
                }

                parsedQueryString.map(function(e, i) {
                    var qLetter = e.match(/[a-uw-z1-9]/);
                    if (qLetter) uniqobj[qLetter] = i;
                });

                return '&' + Object.keys(uniqobj).join('&') + highestVersion;
            },
            callCompleted: false,
            waitForResponse: function(nextStep) {
                if (this.callCompleted) {
                    eval(nextStep);
                } else {
                    var that = this;
                    setTimeout(function(that){that.watForResponses(nextStep);}, 100);
                }
            },
            hasNoSetPrefs: (!localStorage.WME_KMLSettings || localStorage.WME_KMLSettings.length === 1)
        };
        KmLSync.hasUpsyncedPreferences = !!KmLSync.getPreferencesFromGM();
    } catch(err) { console.error(err); }

    //kmllog('myKMLayers 2')

    //----------------------------------------------------------------------

	//======================================================================
	//   GGGGG EEEEEEE TTTTTTT     SSSSS    AAA   VV     VV EEEEEEE DDDDD
	//  GG     EE        TTT      SS       AAAAA  VV     VV EE      DD  DD
	// GG  GGG EEEEE     TTT       SSSSS  AA   AA  VV   VV  EEEEE   DD   DD
	// GG   GG EE        TTT           SS AAAAAAA   VV VV   EE      DD   DD
	//  GGGGGG EEEEEEE   TTT       SSSSS  AA   AA    VVV    EEEEEEE DDDDDD
	//======================================================================
	var createNewMyKMLayers = function() {
	    return {
	        reset: false,
	        idx: 0,
	        savedonce: false,
	        runonce: false,
	        syncPresets: false,
	        SAVED_PRESETS: []
	    };
	};

	//==========================================================================
	var checkMyKMLayersObjStructure = function(mykml) {
	    /* ~~~~~~~~ TEMP: upgrade to new data structure ~~~~~~~~~~~~~~~ */
	    var convertMyKMLayers = function(mykml_old) {
	        // Setup new var structure
	        var numPresets = mykml_old.visibleInLayersMenu.length,
	            mykml_new = {
	                reset: false,
	                idx: mykml_old.idx,
	                savedonce: true,
	                runonce: true,
	                SAVED_PRESETS: Array(numPresets)
	            }, lF;

	        if (localStorage.WME_KeepMyLayers_lF) {
	            lF = JSON.parse(localStorage.WME_KeepMyLayers_lF);
	        } else {
	            lF = {
	                mapProblem: 0,
	                mapUpdateRequest: 0,
	                venue: 1
	            };
	        }

	        for (var kml_sp = numPresets; kml_sp--;) {
	            mykml_new.SAVED_PRESETS[kml_sp] = {
	                name: mykml_old.layerSetNames[kml_sp],
	                visibleInLayersMenu: mykml_old.visibleInLayersMenu[kml_sp],
	                visibleInLayersMenuRealName: mykml_old.visibleInLayersMenuRealName[kml_sp],
	                layerFilters: {
	                    mapProblem: lF.mapProblem,
	                    mapUpdateRequest: lF.mapUpdateRequest,
	                    venue: lF.venue
	                },
	                saved: !!(Object.keys(mykml_old.visibleInLayersMenu[kml_sp]).length)
	            };
	        }
	        return mykml_new;
	    };
	    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	    // Check for newest object structure
	    if (mykml.SAVED_PRESETS === undefined) {
	        if (mykml.visibleInLayersMenu !== undefined) { //check that required object key is present
	            // Check for even older object structure and adjust
	            if (mykml.visibleInLayersMenu.constructor !== Array) {
	                var tempHoldingVar = JSON.parse(JSON.stringify(mykml.visibleInLayersMenu));
	                mykml.visibleInLayersMenu = [tempHoldingVar];
	                mykml.layerSetNames = ['My default layers'];
	                mykml.idx = 0;
	            }

	            if (mykml.visibleInLayersMenuRealName === undefined)
	                mykml.visibleInLayersMenuRealName = Array(mykml.layerSetNames.length);

	            mykml = convertMyKMLayers(mykml);
	            localStorage.WME_KeepMyLayers = JSON.parse(mykml);
	            return mykml;
	        } else {
	        	mykml = createNewMyKMLayers();
	        	localStorage.WME_KeepMyLayers = JSON.parse(mykml);
	            return mykml;
	        }
	    } else {
	        return mykml;
	    }
	};

	var getSavedKMLayers = function() {
	    var mykml = {};

	    if (localStorage.WME_KeepMyLayers) {
	        //kmllog('Found some saved settings to load!');
	        mykml = JSON.parse(localStorage.WME_KeepMyLayers);

	        // If KmLSync is undefined, that means this is the first time
	        // getSavedKMLayers() was called for this page load...
	        // so reset mykml.reset bit:
	        if (layersResetStatus === undefined) mykml.reset = false;

	        mykml = checkMyKMLayersObjStructure(mykml);

	        if (sessionStorage.WME_KeepMyLayersIdx) mykml.idx = parseInt(sessionStorage.WME_KeepMyLayersIdx);
	        if ((!mykml.idx && mykml.idx !== 0) ||
                (mykml.idx >= mykml.SAVED_PRESETS.length && mykml.idx !== 100)) {
                    mykml.idx = 0;
            }
            localStorage.WME_KeepMyLayers = JSON.stringify(mykml);
	        //KmLSync.saveMyKmLObjToLocalStorage(mykml);
	        return mykml;

	    } else { // myKMLayers has not been saved yet
	    	mykml = createNewMyKMLayers();
	    	localStorage.WME_KeepMyLayers = JSON.stringify(mykml);
            //KmLSync.saveMyKmLObjToLocalStorage(mykml);
	        return mykml;
	    }
	};

	var getMyKMLayersObject = function(mykml) {
		var saveObj = false;

	    if (mykml === undefined) mykml = getSavedKMLayers();

	    KmLSync.addMethodsToMyKmLObj(mykml);

	    if (mykml.SAVED_PRESETS && !mykml.SAVED_PRESETS.length) {
	        mykml.addNewPreset('My default layers');
	        saveObj = true;
	    } else { // check for empties
            for (var kml_p = mykml.SAVED_PRESETS.length; kml_p--;) {
                if (!mykml.SAVED_PRESETS[kml_p]) {
                    mykml.removePreset(kml_p);
                    saveObj = true;
                }
            }
        }

	    /*if (sessionStorage.WME_KeepMyLayersIdx) {
	    	mykml.idx = parseInt(sessionStorage.WME_KeepMyLayersIdx);
	    	if (mykml.idx >= mykml.SAVED_PRESETS.length) mykml.idx = 0;
	    	saveObj = true;
	    }*/

	    if (saveObj) mykml.saveToLocalStorage();

	    return mykml;
	};

    //======================================================================================
    //  WW     WW   AAA   ZZZZZ EEEEEEE    LL        AAA   YY   YY EEEEEEE RRRRRR   SSSSS
    //  WW     WW  AAAAA     ZZ EE         LL       AAAAA  YY   YY EE      RR   RR SS
    //  WW  W  WW AA   AA   ZZ  EEEEE      LL      AA   AA  YYYYY  EEEEE   RRRRRR   SSSSS
    //  WW WWW WW AAAAAAA  ZZ   EE         LL      AAAAAAA   YYY   EE      RR  RR       SS
    //   WW   WW  AA   AA ZZZZZ EEEEEEE    LLLLLLL AA   AA   YYY   EEEEEEE RR   RR  SSSSS
    //======================================================================================

    // W.map.layers.forEach(function(a,i){console.info('[' + i + ']', a["name"] + ':', a["visibility"])});
    //--------------------------------------------------------------------------
    var getWazeMapLayersFromSwitcher = function(wazeMapLayers) { // get OL layers that show up under the WME Layer switcher panel
        var kml_layIdx = wazeMapLayers.length,
            kml_layerName, kml_layerUniqName, kml_layerHumanReadableName,
            kml_layerSwitcher = {
                accelerator: {},
                uniqueName: {},
                name: {}
            };

        while (kml_layIdx--) {
            kml_layerName = wazeMapLayers[kml_layIdx].accelerator;
            kml_layerUniqName = wazeMapLayers[kml_layIdx].uniqueName;
            kml_layerHumanReadableName = wazeMapLayers[kml_layIdx].name;
            if (kml_layerName !== undefined) { //  accelerator is a marker with high specificity and selectivity of whether the layer appears in the layer switcher menu
                if (kml_layerUniqName !== undefined) { // uniqueName is used by WME for resetting layers to last PL
                    kml_layerSwitcher.uniqueName[kml_layerUniqName] = kml_layIdx;
                    kml_layerSwitcher.accelerator[kml_layerName] = kml_layIdx;
                    kml_layerSwitcher.name[kml_layerName] = kml_layerHumanReadableName;
                } else {
                    kml_layerSwitcher.accelerator[kml_layerName] = kml_layIdx;
                    kml_layerSwitcher.name[kml_layerName] = kml_layerHumanReadableName;
                }
            }
        }
        return kml_layerSwitcher;
    };

    //======================================================================================
    //  SSSSS    AAA   VV    VV EEEEEEE    LL        AAA   YY   YY EEEEEEE RRRRRR   SSSSS
    // SS       AAAAA  VV    VV EE         LL       AAAAA  YY   YY EE      RR   RR SS
    //  SSSSS  AA   AA  VV  VV  EEEEE      LL      AA   AA  YYYYY  EEEEE   RRRRRR   SSSSS
    //      SS AAAAAAA   VVVV   EE         LL      AAAAAAA   YYY   EE      RR  RR       SS
    //  SSSSS  AA   AA    VV    EEEEEEE    LLLLLLL AA   AA   YYY   EEEEEEE RR   RR  SSSSS
    //======================================================================================
    var saveKMLayers = function() {
        //kmllog('saveKMLayers()', '/');
        var kml_j, kml_lname, kml_realname,
            kml_layerSwitcher = getWazeMapLayersFromSwitcher(_W_map.layers),
            kml_layerNames = Object.keys(kml_layerSwitcher.accelerator),
            kml_numLayers = kml_layerNames.length,
            visibleInLayersMenu = {},
            visibleInLayersMenuRealName = [];


        // Get names of visible menu layers
        for (kml_j = kml_numLayers; kml_j--;) {
            kml_lname = kml_layerNames[kml_j];
            kml_realname = kml_layerSwitcher.name[kml_lname];

            if (_W_map.layers[kml_layerSwitcher.accelerator[kml_lname]].getVisibility()) {
                visibleInLayersMenu[kml_lname] = true;
                visibleInLayersMenuRealName.push(kml_realname);
            }
        }

        if (KmLSync.hasSettingEnabled('&p')) myKMLayers = KmLSync.getSavedPresetsFromGMThenToLS(myKMLayers);
        else myKMLayers = KmLSync.mergeMyKmLObjToLocalStorage(myKMLayers); //merge with what's in localStorage, favoring localStorage
        if (myKMLayers.idx !== 100) {
            myKMLayers.SAVED_PRESETS[myKMLayers.idx].visibleInLayersMenu = visibleInLayersMenu; //save only visible
            myKMLayers.SAVED_PRESETS[myKMLayers.idx].visibleInLayersMenuRealName = visibleInLayersMenuRealName;
            myKMLayers.SAVED_PRESETS[myKMLayers.idx].layerFilters = {
                venue: _W_model.venues.getFilter(),
                mapProblem: _W_model.problems.getFilter(),
                mapUpdateRequest: _W_model.mapUpdateRequests.getFilter()
            };
            myKMLayers.SAVED_PRESETS[myKMLayers.idx].layersBit =
                parseInt(document.querySelector('.WazeControlPermalink>a.fa-link').getAttribute('href').replace(/^(?:.*&layers=(\d+).*)$/gi, '$1'));
            myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved = true;
            myKMLayers.savedonce = true;
            myKMLayers.runonce = true; // failsafe

            // Save
            myKMLayers.saveToLocalStorage();
            if (KmLSync.hasSettingEnabled('&p')) KmLSync.upsyncSavedPresetsToGMFrom(myKMLayers);

            document.querySelector('#icnKMLsaveLayers+div.tooltip>.tooltip-inner').innerHTML = '<div style="padding: 0px 24%; line-height: 2.75">&nbsp;SAVED&nbsp;</div>';
            updateKMLayersSaveButton(true);

            requestAnimationFrame(function() {updatePresetSwitcherMenu(kml_layerSwitcher);});
        }
    };

    //=============================================================================
    //     PPPPPP  LL         LL        AAA   YY   YY EEEEEEE RRRRRR   SSSSS
    //     PP   PP LL         LL       AAAAA  YY   YY EE      RR   RR SS
    //     PPPPPP  LL         LL      AA   AA  YYYYY  EEEEE   RRRRRR   SSSSS
    //     PP      LL         LL      AAAAAAA   YYY   EE      RR  RR       SS
    //     PP      LLLLLLL    LLLLLLL AA   AA   YYY   EEEEEEE RR   RR  SSSSS
    //=============================================================================
    var getLayersFromPL = function() {
        var wazelayers = location.href.match(/&layers=(\d*)/);

        if (wazelayers && wazelayers[1]) {
            return wazelayers[1];
        } else {
            return false;
        }
    };

    var convertLayersToObj = function() {
        var kml_layerVisibility_orig = {},
            uniqueLayerVal = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
            kml_uniqueName = ['satellite_imagery', 'cities', 'roads', 'gps_points',
                'area_managers', 'landmarks', 'speed_cameras', 'problems',
                'update_requests', 'editable_areas', 'live_users', 'place_updates'
            ],
            kml_layValIdx = uniqueLayerVal.length;

        if (!layersBit) layersBit = getLayersFromPL();

        if (layersBit) {
        	layersBit = parseInt(layersBit);
            while (kml_layValIdx--) {
                if (layersBit >= uniqueLayerVal[kml_layValIdx]) {
                    layersBit -= uniqueLayerVal[kml_layValIdx];
                    kml_layerVisibility_orig[kml_uniqueName[kml_layValIdx]] = true;
                } else {
                    kml_layerVisibility_orig[kml_uniqueName[kml_layValIdx]] = false;
                }
            }
            return kml_layerVisibility_orig;
        } else {
            return false;
        }
    };

    var setupToggleLayersEvent = function(kml_toggledLayers) {
        if (kml_toggledLayers === undefined) console.error('setupToggleLayersEvent requires an object containing layers that have been toggled!');
        if (myKMLayers.idx !== 100) {
            document.getElementById('icnKMLtempUndo').onclick = function togglePLLayers() {
                var kml_layerSwitcher = getWazeMapLayersFromSwitcher(_W_map.layers),
                    kml_accelNames = Object.keys(kml_layerSwitcher.accelerator),
                    kml_layerVisibility_kmlayers = myKMLayers.SAVED_PRESETS[myKMLayers.idx].visibleInLayersMenu,
                    num_kml_tog = kml_accelNames.length,
                    kml_tog,
                    W_map_layers_idx, toggleLayerStatus;

                for (kml_tog = num_kml_tog; kml_tog--;) {
                    W_map_layers_idx = kml_layerSwitcher.accelerator[kml_accelNames[kml_tog]];

                    //kmllog(kml_accelNames[kml_tog], '=', kml_toggledLayers[kml_accelNames[kml_tog]])
                    if (kml_toggledLayers[kml_accelNames[kml_tog]] !== null && kml_toggledLayers[kml_accelNames[kml_tog]] !== undefined) {

                        kml_toggledLayers[kml_accelNames[kml_tog]] = !kml_toggledLayers[kml_accelNames[kml_tog]];
                        setKMLayerVisibility(W_map_layers_idx, kml_toggledLayers[kml_accelNames[kml_tog]], kml_tog);
                    }
                }
                // Toggle icon
                document.getElementById('icnKMLtempUndo').classList.toggle('fa-eye'); //beta editor - fontawesome 4.x
                document.getElementById('icnKMLtempUndo').classList.toggle('fa-eye-slash'); //beta editor - fontawesome 4.x
            };
        }
    };

        //var enableTogglePLBit = false;
    var enableToggleLayersButton = function() {
        //kmllog('enableToggleLayersButton()');

        if (myKMLayers === undefined) {
        	myKMLayers = getMyKMLayersObject();
        	kmllog('Check scope. Had to retrieve myKMLayers again from localStorage for enableToggleLayersButton().');
        }
        if (layersResetStatus === undefined) layersResetStatus = myKMLayers.reset;

        if (myKMLayers.idx !== 100 && document.getElementById('icnKMLtempUndo') !== null) {
            kml[2] = 0; //reset counter
            //enableTogglePLBit = true;

            if (layersResetStatus &&
            	myKMLayers.SAVED_PRESETS.length && myKMLayers.SAVED_PRESETS[myKMLayers.idx] && myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved) {
                //kmllog('Checking for toggled layers from PL');

                var kml_layerVisibility_orig = convertLayersToObj(), //kml_layerVisibility_kmlayers = myKMLayers.SAVED_PRESETS[myKMLayers.idx].visibleInLayersMenu,
                    kml_layerSwitcher = getWazeMapLayersFromSwitcher(_W_map.layers),
                    kml_layeraccelerators = Object.keys(kml_layerSwitcher.accelerator), // kml_layeruniqueNames = Object.keys(kml_layerSwitcher.uniqueName),
                    num_kml_an = kml_layeraccelerators.length,
                    kml_an,
                    kml_toggledLayers = {},
                    nToggled = 0,
                    W_map_layers_idx, accel2uniqueName, accelName, currentVisibility; //uniqueName2accel,

                if (kml_layerVisibility_orig) { // true only if &kmlayers= is in the URL
                    //console.info(kml_layerVisibility_orig);

                    for (kml_an = 0; kml_an < num_kml_an; kml_an++) {
                        //uniqueName2accel = _W_map.layers[W_map_layers_idx].accelerator;
                        accelName = kml_layeraccelerators[kml_an];
                        W_map_layers_idx = kml_layerSwitcher.accelerator[accelName];
                        accel2uniqueName = _W_map.layers[W_map_layers_idx].uniqueName;

                        currentVisibility = _W_map.layers[W_map_layers_idx].getVisibility();

                        if (currentVisibility && kml_layerVisibility_orig[accel2uniqueName]) {
                            kml_toggledLayers[accelName] = null; //leave it alone
                        } else if (currentVisibility && !kml_layerVisibility_orig[accel2uniqueName]) {
                            kml_toggledLayers[accelName] = true;
                            nToggled++;
                        } else if (!currentVisibility && kml_layerVisibility_orig[accel2uniqueName]) {
                            kml_toggledLayers[accelName] = false;
                            nToggled++;
                        } else if (!currentVisibility && !kml_layerVisibility_orig[accel2uniqueName]) {
                            kml_toggledLayers[accelName] = null; //leave it alone
                        }
                    }

                    // var queryCode = !!(location.href.search(/&kmlayers=(\d*)/)+1);
                    var kmlUndoBtnEl = document.getElementById('icnKMLtempUndo');
                    if (nToggled !== 0) {
                        //kmllog('Layer visibilities were reset to preferred default setting.', '/');
                        kmlUndoBtnEl.classList.remove('kml-icn-off');
                        setupToggleLayersEvent(kml_toggledLayers);

                    } else {
                        kmlUndoBtnEl.classList.add('kml-icn-off');
                        try {
                            document.getElementById('icnKMLtempUndo').removeEventListener('click', togglePLLayers);
                        } catch (err) {}
                    }
                } // else do nothing, as there is nothing to undo bc layers were not reset
            }
        } else if (kml[2]++ < 30) {
            //kmllog(waitTime, 'ms');
            setTimeout(function() {
                enableToggleLayersButton();
            }, 300 + (kml[2] * 50));
        } else {
            console.warn('WMEKmL:',
                'Unable to activate "Undo KMLayers Reset".',
                'Element #icnKMLtempUndo not found on page.');
        }
    };
    //============================================================================================
    // RRRRRR  EEEEEEE  SSSSS  EEEEEEE TTTTTTT    LL        AAA   YY   YY EEEEEEE RRRRRR   SSSSS
    // RR   RR EE      SS      EE        TTT      LL       AAAAA  YY   YY EE      RR   RR SS
    // RRRRRR  EEEEE    SSSSS  EEEEE     TTT      LL      AA   AA  YYYYY  EEEEE   RRRRRR   SSSSS
    // RR  RR  EE           SS EE        TTT      LL      AAAAAAA   YYY   EE      RR  RR       SS
    // RR   RR EEEEEEE  SSSSS  EEEEEEE   TTT      LLLLLLL AA   AA   YYY   EEEEEEE RR   RR  SSSSS
    //============================================================================================
    var reselectSegments = function() {
        var selectSegs, originalZoom;
	    if (kmlPLSegIDs && _W_map.segmentLayer && _W_.selectionManager.selectedItems.length < kmlPLSegIDs.length) {
	        //console.info(_W_map.segmentLayer.selectedFeatures.length, kmlPLSegIDs.length);
	        try { // Temporary solution to reselect segments that got unselected when refreshing the map for filters
	            selectSegs = _W_.model.segments.getByIds(kmlPLSegIDs);
	            originalZoom = _W_map.zoom;
	            if (!selectSegs.length && originalZoom < 2) {
	                _W_map.zoomTo(2);
	                setTimeout(function() {
        	            selectSegs = _W_.model.segments.getByIds(kmlPLSegIDs);
                        _W_.selectionManager.select(selectSegs);
                        kmllog('Segments reselected.');
                        kmlPLSegIDs = null;
                        _W_map.zoomTo(originalZoom);
                    }, 1000);
    	        } else {
                    _W_.selectionManager.select(selectSegs);
                    kmllog('Segments reselected.');
                    kmlPLSegIDs = null;
                }
	        } catch(err) {}
	    } else {
	    	setTimeout(reselectSegments, 500);
	    }
	};

    function setKMLayerVisibility(layerIdx, visibilityStatus, loadOrder) {
        if (loadOrder === undefined) loadOrder = 0;
        // Add an offset to spread out the requests
        setTimeout(function() {
            _W_map.layers[layerIdx].setVisibility(visibilityStatus);
        }, 10 * loadOrder);
    }

    //----------------------------------------------------------------------
    var updateLayerFilters = function(lF) {
        try {
            // Adjust visibility of secondary layer filters (residential, closed URs/MPs)
            var filterSettingsNow = [_W_model.repositoryFilters.get('venue'),
                                     _W_model.repositoryFilters.get('mapUpdateRequest'),
                                     _W_model.repositoryFilters.get('mapProblem')],
                filterSettingsSaved = [lF.venue, lF.mapUpdateRequest, lF.mapProblem];

            // Check if any settings differ from saved:
            if (filterSettingsNow.some(function(f,i){return f^0 !== filterSettingsSaved[i]^0;})) {
                _W_model.repositoryFilters.set('venue', lF.venue);
                _W_model.repositoryFilters.set('mapUpdateRequest', lF.mapUpdateRequest);
                _W_model.repositoryFilters.set('mapProblem', lF.mapProblem);
                _W_.controller.updateModel(true);
                document.querySelector('li[data-layer-id="' + _W_map.landmarkLayer.id + '"] a').innerHTML = kml_lFTranslations.residential[lF.venue ^ 1];
                document.querySelector('li[data-layer-id="' + _W_map.updateRequestLayer.id + '"] a').innerHTML = kml_lFTranslations.closed_problems[lF.mapUpdateRequest ^ 1];
                document.querySelector('li[data-layer-id="' + _W_map.problemLayer.id + '"] a').innerHTML = kml_lFTranslations.closed_problems[lF.mapProblem ^ 1];
            }

            /*if (/&segments=([\d,]+)/.test(location.href)) {
                kmlPLSegIDs = location.href.match(/&segments=([\d,]+)/)[1].split(',');
                setTimeout(reselectSegments, 200);
            }*/

        } catch(err) { kmllog(3,err); console.error(err); }
    };

    var checkLayerFilterStatus = function(enableFilter) {
        //----------------------------
        // Check for filters to remove
        if (myKMLayers.idx !== 100) {
            if (document.getElementById('layer-switcher-menu') !== null) {
                setTimeout(function() {
                	if (!myKMLayers.SAVED_PRESETS[myKMLayers.idx].layerFilters)
                		myKMLayers.resetLayerFilterPreset();

                    var lF = myKMLayers.SAVED_PRESETS[myKMLayers.idx].layerFilters;

                    if (enableFilter) lF[enableFilter] = 1;

                    updateLayerFilters(lF);
    				localStorage.WME_KeepMyLayers = localStorage.WME_KeepMyLayers.replace(/reset":true/, 'reset":false');
    				myKMLayers.reset = true;
    				//kmllog('Layers and filters were reset.');
            		//kmllog('Note - Local layersResetStatus and myKMLayers.reset were set to true. Reset in localStorage was returned to false.');
                }, 1000); //add a few extra ms to allow it to load a bit more just in case
            } else {
            	setTimeout(function(){checkLayerFilterStatus(enableFilter);},500);
            }
        }
     };

    //----------------------------------------------------------------------
    var checkForReqLayers = function() {
        //kmllog('checkForReqLayers()');
        var layerQuery = ['&mapUp', '&ven', '&mapPr', '&bigJ', '&cam'],
            layerAccel = ['toggleUpdateRequests', 'togglePlaces', 'toggleMapProblems', 'toggleJunctionboxes', 'toggleSpeedcameras'],
            excludeLayers = [], permalink;

        permalink = location.href.replace(/&[^&]*Filter=[^&]*/g,'');
        for (var q = layerQuery.length; q--;) {
            if (new RegExp(layerQuery[q],'g').test(permalink))
                excludeLayers.push(layerAccel[q]);
        }
        return (excludeLayers.length) ? excludeLayers : false;
    };

    var checkForReqFilters = function() {
        var layerQuery = ['&ven', '&mapUp','&mapPr'],
            filterName = ['venue', 'mapUpdateRequest', 'mapProblem'],
            excludeFilter = null, permalink;

        permalink = location.href.replace(/&[^&]*Filter=[^&]*/g,'');
        for (var q = layerQuery.length; q--;) {
            if (new RegExp(layerQuery[q],'g').test(permalink)) {
                excludeFilter = filterName[q];
            }
        }
        return excludeFilter;
    };
    //----------------------
    function resetLayersToSavedKMLayers(excludeLayers) {
        //kmllog('resetLayersToSavedKMLayers(' + excludeLayers + ')');
        var checkKMLayer = function(evt) {
            var randomOffset = parseInt(Math.random()*100)+100;
            if (evt.layer && evt.layer.accelerator && evt.layer.getVisibility() !== !!visibleMyKMLayersAccelObj[evt.layer.accelerator]) {
                setTimeout(function(){
                    evt.layer.setVisibility(!!visibleMyKMLayersAccelObj[evt.layer.accelerator]);
                }, randomOffset);
                //kmllog('addlayer event:', evt.layer.accelerator, '=', !!visibleMyKMLayersAccelObj[evt.layer.accelerator]);
                if (/&segments=([\d,]+)/.test(location.href)) {
                    kmlPLSegIDs = location.href.match(/&segments=([\d,]+)/)[1].split(',');
                    setTimeout(reselectSegments, randomOffset+200);
                }
            }
        };

        if (myKMLayers === undefined) {
        	myKMLayers = getMyKMLayersObject();
        	kmllog('Check scope. Had to retrieve myKMLayers again from localStorage for resetLayersToSavedKMLayers().');
        }

        if (myKMLayers &&
        	myKMLayers.SAVED_PRESETS[myKMLayers.idx] !== undefined &&
        	myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved) {

            var togglePlacesAndPURs = false,
                visibleMyKMLayersAccelObj = myKMLayers.SAVED_PRESETS[myKMLayers.idx].visibleInLayersMenu,
                visibleMyKMLayersAccelName = Object.keys(visibleMyKMLayersAccelObj),
                kml_layerSwitcher, kml_switcherName, switcherAccelObj, switcherAccelNames;

            // Adjust layer visibility if necessary
            if (excludeLayers) { for (var e of excludeLayers) { visibleMyKMLayersAccelObj[e] = true; }}
            //----------------------------
            // Add listener for any additional layers that are added to the map
            if (!layersResetStatus) {
                if (isNotFirefox) {
                    try {
                        _W_map.events.register('addlayer', Waze.map, checkKMLayer);
                        kmllog('Now listening for additional layers...');
                    } catch (err) {
                        var numLayers = _W_map.getNumLayers(), ffOverride = true;
                        kmllog('Now waiting for additional layers...');
                    }
                } else {
                    var numLayers = _W_map.getNumLayers();
                    kmllog('Now waiting for additional layers...');
                }
            }
            //----------------------------
            kml_layerSwitcher = getWazeMapLayersFromSwitcher(_W_map.layers);
            switcherAccelObj = kml_layerSwitcher.accelerator;
            switcherAccelNames = Object.keys(switcherAccelObj);

            for (var kml_sw = 0, kml_sw_length = switcherAccelNames.length; kml_sw < kml_sw_length; kml_sw++) {
                kml_switcherName = switcherAccelNames[kml_sw];
                setKMLayerVisibility(switcherAccelObj[kml_switcherName], !!visibleMyKMLayersAccelObj[kml_switcherName], kml_sw);
                //kmllog('switcherAccelNames[' + kml_sw + ']:', kml_switcherName, '=', visibleMyKMLayersAccelObj[kml_switcherName]);
            }
            //----------------------------
            if (!isNotFirefox || ffOverride) {
                var switcherAccelObjNow, switcherAccelNamesNow, numLayersNow,
                    addLayersChecker = setInterval(function() {
                        numLayersNow = _W_map.getNumLayers();

                        if (numLayers < numLayersNow) {
                            numLayers = numLayersNow;
                            //kmllog('Added layer detected...')
                            kml_layerSwitcher = getWazeMapLayersFromSwitcher(_W_map.layers);
                            switcherAccelObjNow = kml_layerSwitcher.accelerator;
                            switcherAccelNamesNow = Object.keys(switcherAccelObjNow);

                            switcherAccelNamesNow.map(function(a) {
                                for (kml_sw of switcherAccelNames) {
                                    if (a === kml_sw) return false;
                                }
                                //kmllog(a);
                                try {
                                    setKMLayerVisibility(switcherAccelObjNow[a], !!visibleMyKMLayersAccelObj[a], parseInt(Math.random()*10));
                                } catch(err) { console.error(err); }
                            });
                        }
                    }, 1000);

                setTimeout(function(){
                    clearInterval(addLayersChecker);
            		kmllog('Stopped waiting for more layers.');
                }, 20000);

            } else if (!layersResetStatus) {
                // Remove listener after 20 seconds and assume all layers have loaded
            	setTimeout(function(){
            		_W_map.events.unregister('addlayer', _W_map, checkKMLayer);
            		kmllog('Stopped listening for more layers.');
            		kmlPLSegIDs = null;
                }, 20000);
            }

            if (!layersResetStatus) {
                checkLayerFilterStatus(checkForReqFilters());
            } else {
                checkLayerFilterStatus(null);
            }
            layersResetStatus = true;


            try {
                document.getElementById('icnKMLtempUndo').classList.toggle('fa-eye', true);
                document.getElementById('icnKMLtempUndo').classList.toggle('fa-eye-slash', false);
            } catch (err) {}

            try {
                if (kmlPLSegIDs) setTimeout(reselectSegments, 100);
            } catch(err) { }
        }
    }

    //----------------------------------------------------------------------
    var userResetOfLayersToSavedKMLayers = function(myKMLayersStatus) {
        //kmllog('userResetOfLayersToSavedKMLayers()');
        if (myKMLayers === undefined) {
        	myKMLayers = getMyKMLayersObject();
        	kmllog('Check scope. Had to retrieve myKMLayers again from localStorage for enableToggleLayersButton().');
        }
        if (myKMLayers.idx !== 100) {
            if (myKMLayersStatus === undefined) myKMLayersStatus = myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved;
            if (myKMLayersStatus) resetLayersToSavedKMLayers(null);
            else return;
        }
    };

    //--------------------------------------------------------------------------------------------
    //  OOOOO  TTTTTTT HH   HH EEEEEEE RRRRRR     LL        AAA   YY   YY EEEEEEE RRRRRR   SSSSS
    // OO   OO   TTT   HH   HH EE      RR   RR    LL       AAAAA  YY   YY EE      RR   RR SS
    // OO   OO   TTT   HHHHHHH EEEEE   RRRRRR     LL      AA   AA  YYYYY  EEEEE   RRRRRR   SSSSS
    // OO   OO   TTT   HH   HH EE      RR  RR     LL      AAAAAAA   YYY   EE      RR  RR       SS
    //  OOOO0    TTT   HH   HH EEEEEEE RR   RR    LLLLLLL AA   AA   YYY   EEEEEEE RR   RR  SSSSS
    //--------------------------------------------------------------------------------------------
    var applyAdditionalKMLSettings = function() {
        //kmllog('applyAdditionalKMLSettings()', '/');
        var kmlSettings = localStorage.WME_KMLSettings,
            citiesLayer = _W_map.getLayersByName('Cities')[0];

        try {
	        if (/&1\b/.test(kmlSettings)) {
	            if (citiesLayer.opacity !== 0.8) {
	                citiesLayer.setOpacity(0.8);
	                //kmllog('Opacity of Cities layer increased.');
	            }
	        } else {
	            if (citiesLayer.opacity === 0.8) {
	                citiesLayer.setOpacity(0.5);
	                //kmllog('Opacity of Cities layer at default.');
	            }
	        }
       } catch(err) { console.error(err); }
        try {
	        if (/&5\b/.test(kmlSettings)) {
	            if (_W_map.managedAreasLayer.options.styleMap.styles.default.defaultStyle.fillOpacity !== 0.1) {

	                _W_map.managedAreasLayer.options.styleMap.styles.default.defaultStyle.fillOpacity = 0.1;
	                _W_map.managedAreasLayer.setZIndex(334);

	                //kmllog('Opacity of AM layer decreased.');
	                try {
	                    unsafeWindow.Waze.controller.reload();
	                } catch (err) {}
	            }
	        } else {
	            if (_W_map.managedAreasLayer.options.styleMap.styles.default.defaultStyle.fillOpacity < 0.3) {
	                _W_map.managedAreasLayer.options.styleMap.styles.default.defaultStyle.fillOpacity = 0.3;
	                _W_map.managedAreasLayer.setZIndex(350);
	                //kmllog('Opacity of AM layer returned to normal.');
	                try {
	                    unsafeWindow.Waze.controller.reload();
	                } catch (err) {}
	            }
	        }
       } catch(err) { console.error(err); }
        try {
	        if (/&2\b/.test(kmlSettings)) {
	            if (_W_map.roadLayers[0].opacity === 1) {
	                _W_map.roadLayers[0].setOpacity(0.82);
	                //kmllog('Opacity of Roads layer decreased.');
	            }
	        } else {
	            if (_W_map.roadLayers[0].opacity !== 1) {
	                _W_map.roadLayers[0].setOpacity(1);
	                //kmllog('Opacity of Roads layer at default.');
	            }
	        }
       } catch(err) { console.error(err); }
    };

    // ---------------------------------------------------------------------
    var runSecondaryKMLayersCheck = function() {
        //kmllog('runSecondaryKMLayersCheck()', '/');
        if (localStorage.WME_KMLSettings === undefined) {
            localStorage.WME_KMLSettings = ':';
        }

        if (/&x\b/.test(localStorage.WME_KMLSettings)) { // user has set WMEKMLayers to be disabled
            kmllog('KeepMyLayers at page load is disabled.');
            return false;
        } else {
        	// hide parts of the PL that may have been added by KmL
        	var layerBit = /^(?:.*&kmlayers=(\d+).*)?$/.exec(location.href);
        	layerBit = (layerBit) ? [layerBit[1]] : [null];
	    	//if (isNotFirefox)
	    	    window.history.pushState('', 'Waze Map Editor', location.href.replace(/&[^&]*Filter=[^&]*|&(km)?layers=\d*|&l=\d/ig,'')); //note: &layers should never make it to this point if KmL is enabled at pageload
            return layerBit; //will still eval as true bc null is enclosed within Array
        }
    };
    /////////////////////////////////////////////////////////////////////////////////////////////
    /////////                                                                           /////////
    /////////                       __ __  __  ___ __                                   /////////
    /////////    ____ ___   __  __ / //_/ /  |/  // /   ____ _ __  __ ___   _____ _____ /////////
    /////////   / __ `__ \ / / / // ,<   / /|_/ // /   / __ `// / / // _ \ / ___// ___/ /////////
    /////////  / / / / / // /_/ // /| | / /  / // /___/ /_/ // /_/ //  __// /   (__  )  /////////
    ///////// /_/ /_/ /_/ \__, //_/ |_|/_/  /_//_____/\__,_/ \__, / \___//_/   /____/   /////////
    /////////            /____/                             /____/                      /////////
    /////////                                                                           /////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    if (/&segments=([\d,]+)/.test(location.href)) kmlPLSegIDs = location.href.match(/&segments=([\d,]+)/)[1].split(',');

    myKMLayers = getMyKMLayersObject();
    myKMLayers.getSessionPresetIdx(); //if session idx does not exist yet, it will set it instead and keep the index in myKMLayers

    // Synchronize layer presets
    if (KmLSync.hasSettingEnabled('&p')) {
        if (myKMLayers.syncPresets) {
            myKMLayers = KmLSync.getSavedPresetsFromGMThenToLS(myKMLayers);
        } else {
            myKMLayers = KmLSync.combineSavedPresetsToGMLSFrom(myKMLayers);
        }
    }
    myKMLayers.getSessionPresetIdx();

    // Synchronize preferences
    if (KmLSync.hasUpsyncedPreferences) {
        if (KmLSync.hasSettingEnabled('&s')) { //Sync all preferences
            //Synchronize by copying over any changes that were made
            if (localStorage.WME_KMLSettings[0] === '!') { //! is inserted at the beginning to indicate syncing all settings
                KmLSync.applyAllPreferencesToLSFromGM();
            } else {
                // First sync
                var mergedPrefsString = KmLSync.getPreferencesFromGM() + localStorage.WME_KMLSettings,
                    uniqueMergedPrefsString = KmLSync.getUniqueQueryString(mergedPrefsString);

                localStorage.WME_KMLSettings = '!:' + uniqueMergedPrefsString;
                KmLSync.upsyncAllPreferencesFromLSToGM();
            }
        } else if (KmLSync.hasNoSetPrefs) {
            KmLSync.applyAllPreferencesToLSFromGM();
        } else { // Sync subset of preferences that must be synced

            //....beta-tog and alt-PL settings between Beta-Prod editors
            KmLSync.applyBetaProdSettingsToLS();
            //....locale specifications between Beta-Prod editors
            //            KmLSync.applyLocaleSettingToLS();
            //....synchronization setting
            //            KmLSync.applySyncPrefsSettingToLS();
            KmLSync.updateTheseSettingToLS(['&s', '&l']);
        }

    } else {
        // ~~~~~~~~~~~~~~~~~TEMP~~~~~~~~~~~~~~~~~~~~
        // adjust for separation of popups for beta-tog and alt-PL in current version
        if (~localStorage.WME_KMLSettings.indexOf('&b') && !~localStorage.WME_KMLSettings.indexOf('&a')) {
            localStorage.WME_KMLSettings += '&a';
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        KmLSync.upsyncAllPreferencesFromLSToGM();
        KmLSync.hasUpsyncedPreferences = !!KmLSync.getPreferencesFromGM();
    }

    // Reset layers
    layersBit = runSecondaryKMLayersCheck(myKMLayers);
    if (myKMLayers.idx !== 100) {
        if (layersBit &&
            myKMLayers.SAVED_PRESETS &&
            myKMLayers.SAVED_PRESETS[myKMLayers.idx] &&
            myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved) {

    		layersBit = layersBit[0];
            resetLayersToSavedKMLayers(checkForReqLayers());
        }
    }
    applyAdditionalKMLSettings();

    //--------------------------------------------------------------------------
    //  First-time Usage Helper
    //--------------------------------------------------------------------------
    // Sync Usage Helper log between Beta and Prod domains
    var usageHelperHistory = KmLSync.getUsageLogFromGM();
    if (usageHelperHistory) {
        localStorage.WME_KMLUsageHelper = usageHelperHistory;
        KmLSync.useFriendlyPLs = !/&f\b/.test(usageHelperHistory);
    } else if (!localStorage.WME_KMLUsageHelper) {
        localStorage.WME_KMLUsageHelper = ':';
        KmLSync.useFriendlyPLs = true;

    }

    //~~~~~~~~~ TEMP ~~~~~~~~~~~~
    // Runs only once per designated update...
    if (!KMLayersVersion.isUpToDate(minKMLVersion)) {
        kmllog('Performed catch-up and clean-up functions for current version', KMLayersVersion.currentVersion);
        KMLayersVersion.updateVersionString();
        // adjust this setting one time for this next update to 0.4.8
        if (KmLSync.hasSeenKMLPopup('&b')) KmLSync.logKMLUsageHistory('&a');
        if (!KmLSync.hasSettingEnabled('&a')) KmLSync.addThisSettingToLS('&r');
        //KmLSync.addThisSettingToLS('&t');
	    KmLSync.upsyncAllPreferencesFromLSToGM();// Note: prefs are always synced via overwrite, but whether they are applied depends on user setting
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //                                                                          //
    //////////////////////////////////////////////////////////////////////////////

    //-----------------------------------------------------------------------------
    //  UU   UU  SSSSS    AAA     GGGGG EEEEEEE    HH   HH EEEEEEE LL      PPPPPP
    //  UU   UU SS       AAAAA   GG     EE         HH   HH EE      LL      PP   PP
    //  UU   UU  SSSSS  AA   AA GG  GGG EEEEE      HHHHHHH EEEEE   LL      PPPPPP
    //  UU   UU      SS AAAAAAA GG   GG EE         HH   HH EE      LL      PP
    //   UUUUU   SSSSS  AA   AA  GGGGGG EEEEEEE    HH   HH EEEEEEE LLLLLLL PP
    //-----------------------------------------------------------------------------
    // PINK POPUPS
    //      Note: For greater flexibility, pink popups require separate event listeners to be specified.
    //            that is, it does not automatically add event listeners, unlike kml tooltips.
    //      offScreenSideProp specifies properties for the fly-in effect.
    var insertKMLPinkPopupCssToDOM = function(popupId, arrowSidePosition, arrowPosDistProp, popupWidth, offScreenSideProp) {
        var usageCssEl = document.createElement('style'),
            arrowPosDistProp2, arrowFeatBorder, arrowFeatMargin, popupIdSelector;

        popupIdSelector = (popupId === '') ?  '' : '#' + popupId;
        if (popupWidth === undefined || popupWidth === '') popupWidth = 'auto';

        switch (arrowSidePosition) {
            case 'top':
                if (arrowPosDistProp === '') arrowPosDistProp = 'left: 50%';
                arrowPosDistProp2 = 'bottom: 100%';
                arrowSpacerMargin = 'margin: 10px 0px';
                arrowFeatBorder = 'border-bottom-color: ';
                arrowFeatMargin = 'margin-left: ';
                break;
            case 'bottom':
                if (arrowPosDistProp === '') arrowPosDistProp = 'left: 50%';
                arrowPosDistProp2 = 'top: 100%';
                arrowSpacerMargin = 'margin: 10px 0px';
                arrowFeatBorder = 'border-top-color: ';
                arrowFeatMargin = 'margin-left: ';
                break;
            case 'right':
                if (arrowPosDistProp === '') arrowPosDistProp = 'top: 50%';
                arrowPosDistProp2 = 'left: 100%';
                arrowSpacerMargin = 'margin: 0px 10px';
                arrowFeatBorder = 'border-left-color: ';
                arrowFeatMargin = 'margin-top: ';
                break;
            case 'left':
                if (arrowPosDistProp === '') arrowPosDistProp = 'top: 50%';
                arrowPosDistProp2 = 'right: 100%;';
                arrowSpacerMargin = 'margin: 0px 10px';
                arrowFeatBorder = 'border-right-color: ';
                arrowFeatMargin = 'margin-top: ';
                break;
        }

        usageCssEl.type = 'text/css';
        usageCssEl.id = 'cssKMLPopup_' + popupId;
        usageCssEl.innerHTML = popupIdSelector + '.kml-popupbox { cursor: pointer; width: ' + popupWidth + '; z-index: 9999; position: relative; background: #D04294; border: 1px solid #cf38a6; border-radius: 4px; box-shadow: 0px 4px 10px rgba(0,0,0,0.8); padding: 10px 10px 8px ; color: #FFF; ' + arrowSpacerMargin + '; overflow: visible; transition: all .2s ease-out 0s;}\n' +
            popupIdSelector + '.kml-popupbox.kml-grow, ' + popupIdSelector + '.kml-popupbox.kml-grow .kml-header, ' + popupIdSelector + '.kml-popupbox.kml-grow h4, ' + popupIdSelector + '.kml-popupbox.kml-grow i.kml-header-icon, ' + popupIdSelector + '.kml-popupbox.kml-grow div.kml-section {width: 150px !important; height: 1px !important; padding: 0; margin: 0; opacity: 0 !important; overflow: hidden !important; font-size: 1px !important; color: transparent !important; line-height: 0.1 !important; overflow: hidden !important; ' + offScreenSideProp + ' !important; }\n' +
            popupIdSelector + '.kml-popupbox:after, ' + popupIdSelector + '.kml-popupbox:before {' + arrowPosDistProp + '; ' + arrowPosDistProp2 + '; border: solid transparent; content: " "; height: 0; width: 0; position: absolute; pointer-events: none; }\n' +
            popupIdSelector + '.kml-popupbox:after { border-color: transparent; ' + arrowFeatBorder + '#cf38a6; border-width: 8px; ' + arrowFeatMargin + '-8px; }\n' +
            popupIdSelector + '.kml-popupbox:before { border-color: transparent; ' + arrowFeatBorder + '#cf38a6; border-width: 9px; ' + arrowFeatMargin + '-9px; }\n';
        document.body.appendChild(usageCssEl);
        return usageCssEl;
    };

    var insertKMLPinkPopupNode = function(popupId, attachmentNode, usageTitle, usageText, popupStyleProps) {
        // popupStyleProps is for specifying the position of the popup container
        var kmlPopupEl = document.createElement('div');
        kmlPopupEl.id = popupId;
        kmlPopupEl.className = 'kml-popupbox kml-grow';
        usageTitle = (usageTitle === '') ? '&nbsp;KMLayers Usage Tip' : '&nbsp;' + usageTitle;

        if (popupStyleProps !== undefined) {
            kmlPopupEl.setAttribute('style', 'position: absolute; ' + popupStyleProps);
        }

        kmlPopupEl.innerHTML = '<div class="kml-header">' +
            '<i class="kml-header-icon fa fa-info-circle pull-left"' +
            ' style="font-size: 26px; margin: auto; color: #54265F; line-height: 28px; height: 28px; width: 28px;"></i>' +
            '<h4 style="margin-top: -5px; margin-bottom: 5px; margin-left: -11px; margin-right: -11px; padding: 4px; padding-left: 36px; font-size: 12pt; font-weight: 600; text-align: left; color: #8D529C; background-color: rgba(255,199,242,0.6);">' +
            usageTitle + '</h4>' +
            '</div><div class="kml-section" style="font-size: 9pt; line-height: normal;">' +
            usageText +
            '</div></div>';

        attachmentNode.appendChild(kmlPopupEl);
        setTimeout(function() { kmlPopupEl.classList.remove('kml-grow'); }, 200);

        return kmlPopupEl;
    };

    var KMLayersUsageHelper = function(kmlHelpTopic, hasSeenOnce) {
        // hasSeenOnce:   [true|false|'none'];
        //                Has the usageHelper popup been displayed at least once before?
        //                  Popup will _not_ display for only boolean `true`
        if (hasSeenOnce !== true) {

            //localStorage.WME_KMLUsageHelper.match(/&0.4(=\d|,\d)*/g)[0].match(/[=|,](\d)/g).map(function(a){return a.substr(-1)})
            var usageTitle, usageText, usageId, popupParentEl;

            switch (kmlHelpTopic) {
                case 'layer_presets_runonce':
                    //document.getElementById('kmlPresetSwitcher').classList.add('kml-keep-open');
                    //document.getElementById('kmlPresetSwitcher').classList.add('open');
                    localStorage.WME_KeepMyLayers = localStorage.WME_KeepMyLayers.replace(/runonce":false/, 'runonce":true');
                    /*document.querySelector('#kmlPresetSwitcher li').classList.toggle('kml-usage-helper');
                    setTimeout(function() {
                        document.querySelector('#kmlPresetSwitcher li').classList.toggle('kml-usage-helper');
                    }, 10000);*/

                    break;

                case 'stay_open_dropdown_menu':
                    popupParentEl = document.getElementById('kmlPresetSwitcher');
                    usageId = 'kmlStayopenPopup';
                    usageTitle = 'Preset-Switcher Menu';
                    usageText = 'Depress the KMLayers menu button to make it stay open on the screen. It will automatically fade and tuck itself away when not in focus. You can add more presets from within the preference pane.<p></p>Tip: Double-clicking on the WME Layers menu will open KeepMyLayers\' preferences.';

                    if (document.getElementById(usageId) === null) {
                        if (popupParentEl) {
                            var kmlStayopenPopupCssEl = insertKMLPinkPopupCssToDOM(usageId, 'top', 'right: 2px', '240px', 'right: -40px');
                            var kmlStayopenPopupEl = insertKMLPinkPopupNode(usageId, popupParentEl, usageTitle, usageText, 'top: 40px; right: 0px;');

                            document.getElementById(usageId).onclick = function() {
                                kmlStayopenPopupEl.classList.toggle('kml-grow');
                                setTimeout(function() {
                                    kmlStayopenPopupEl.remove();
                                    kmlStayopenPopupCssEl.remove();
                                }, 250);
                                if (hasSeenOnce === false) KmLSync.logKMLUsageHistory('&m');
                            };
                        } else {
                            setTimeout(function() {KMLayersUsageHelper('stay_open_dropdown_menu', false);}, 500);
                        }
                    }
                    break;

                case 'beta_toggle':
                    popupParentEl = document.getElementById('map-search').parentNode;
                    usageId = 'kmlBetaTogPopup';
                    usageTitle = 'Beta-Prod Editor Toggle';
                    usageText = 'Switch to Beta (Red) or to Prod (Blue) to force WME to always load in that editing mode. Double-click on the toggle to disable it. <p></p>Note: If you need to switch back and forth between the two, you can either disable the toggle or use the KMLayers-friendly permalinks feature.';

                    if (document.getElementById(usageId) === null) {
                        if (popupParentEl) {
                            var kmlBetaTogPopupCssEl = insertKMLPinkPopupCssToDOM(usageId, 'left', 'top: 22px', '280px', 'left: -60px');
                            var kmlBetaTogPopupEl = insertKMLPinkPopupNode(usageId, popupParentEl, usageTitle, usageText, 'top: 1px; left: 0px;');

                            document.getElementById(usageId).onclick = function() {
                                kmlBetaTogPopupEl.classList.toggle('kml-grow');
                                setTimeout(function() {
                                    kmlBetaTogPopupEl.remove();
                                    kmlBetaTogPopupCssEl.remove();
                                }, 250);
                                if (hasSeenOnce === false) KmLSync.logKMLUsageHistory('&b');
                            };
                        } else {
                            setTimeout(function() {KMLayersUsageHelper('beta_toggle', false);}, 500);
                        }
                    }
                    break;

                case 'alt_permalink':
                    popupParentEl = document.getElementById('kmlPLContainer');
                    usageId = 'kmlAltPLPopup';
                    usageTitle = 'Beta-Prod Toggle-Friendly PLs';
                    usageText = 'These permalinks are Beta-Prod toggle-friendly. They allow you to switch between editors without having to disable the toggle. When PLs are tagged with \"&b=0\", it prevents KMLayers from checking whether to redirect between Beta or Prod editor.<p></p>Hovering over the links and pressing the Shift key turns friendly-PL tagging on or off.';
                    if (document.getElementById(usageId) === null) {
                        if (popupParentEl) {
                            var kmlAltPLPopupCssEl = insertKMLPinkPopupCssToDOM(usageId, 'bottom', 'right: 20px', '320px', 'bottom: -50px');
                            var kmlAltPLPopupEl = insertKMLPinkPopupNode(usageId, popupParentEl, usageTitle, usageText, 'bottom: 23px; right: -15px;');
                            document.getElementById('kmlPLContainer').style.overflow = 'visible';
                            document.getElementById(usageId).onclick = function() {
                                kmlAltPLPopupEl.classList.toggle('kml-grow');
                                setTimeout(function() {
                                    kmlAltPLPopupEl.remove();
                                    kmlAltPLPopupCssEl.remove();
                                    document.getElementById('kmlPLContainer').style.overflow = 'hidden';
                                }, 250);
                                if (hasSeenOnce === false) KmLSync.logKMLUsageHistory('&a');
                            };
                        } else {
                            setTimeout(function() {KMLayersUsageHelper('alt_permalink', false);}, 500);
                        }
                    }
                    break;

            } //switch
        } //if hasSeenOnce is not boolean true
    };
    //-------------------------------------------------------------------------------------
    // TOOLTIPS - on hover event listeners included...
    var getKMLTooltipCssNode = function(cssTooltipSelector, arrowSidePosition, arrowPosDistProp, tooltipStyleProp, cssUniqueId) {
        var tooltipCssEl = document.createElement('style'),
            arrowPosDistProp2, arrowFeatBorder, arrowFeatMargin;

        //(cssTooltipSelector === '') ? tooltipIdSelector = '' : tooltipIdSelector = '#' + cssTooltipSelector;
        if (tooltipStyleProp === undefined || tooltipStyleProp === '') tooltipStyleProp = 'width: auto;';

        switch (arrowSidePosition) {
            case 'top':
                if (arrowPosDistProp === '') arrowPosDistProp = 'left: 50%';
                arrowPosDistProp2 = 'bottom: 100%';
                arrowSpacerMargin = 'margin: 10px 0px';
                arrowFeatBorder = 'border-bottom-color: ';
                arrowFeatMargin = 'margin-left: ';
                break;
            case 'bottom':
                if (arrowPosDistProp === '') arrowPosDistProp = 'left: 50%';
                arrowPosDistProp2 = 'top: 100%';
                arrowSpacerMargin = 'margin: 10px 0px';
                arrowFeatBorder = 'border-top-color: ';
                arrowFeatMargin = 'margin-left: ';
                break;
            case 'right':
                if (arrowPosDistProp === '') arrowPosDistProp = 'top: 50%';
                arrowPosDistProp2 = 'left: 100%';
                arrowSpacerMargin = 'margin: 0px 10px';
                arrowFeatBorder = 'border-left-color: ';
                arrowFeatMargin = 'margin-top: ';
                break;
            case 'left':
                if (arrowPosDistProp === '') arrowPosDistProp = 'top: 50%';
                arrowPosDistProp2 = 'right: 100%;';
                arrowSpacerMargin = 'margin: 0px 10px';
                arrowFeatBorder = 'border-right-color: ';
                arrowFeatMargin = 'margin-top: ';
                break;
        }

        tooltipCssEl.type = 'text/css';
        if (cssUniqueId) tooltipCssEl.id = cssUniqueId;
        tooltipCssEl.innerHTML = cssTooltipSelector + '.kml-tooltip { z-index: 9999; position: absolute; background: rgba(0,0,0,0.8); border-radius: 5px; -webkit-box-shadow: 0 6px 12px rgba(0,0,0,0.175);  box-shadow: 0 6px 12px rgba(0,0,0,0.175); padding: 10px ; color: #FFF; ' + arrowSpacerMargin + '; overflow: visible; pointer-events: none; transition: opacity .2s ease-in 0.4s; ' + tooltipStyleProp + '}\n' +
            cssTooltipSelector + '.kml-tooltip.kml-fade { opacity: 0 !important; transition: opacity .1s linear 0s; }\n' +
            cssTooltipSelector + '.kml-tooltip>.kml-section { font-size: 8pt; line-height: 1.4; word-wrap: break-word; }\n' +
            cssTooltipSelector + '.kml-tooltip:after, ' + cssTooltipSelector + '.kml-tooltip:before {' + arrowPosDistProp + '; ' + arrowPosDistProp2 + '; border: solid transparent; content: ""; height: 0; width: 0; position: absolute; pointer-events: none; }\n' +
            cssTooltipSelector + '.kml-tooltip:after { border-color: transparent; ' + arrowFeatBorder + '#000; border-width: 5px; ' + arrowFeatMargin + '-5px;}\n' +
            cssTooltipSelector + '.kml-tooltip:before { border-color: transparent; ' + arrowFeatBorder + '#000; border-width: 6px; ' + arrowFeatMargin + '-6px;}\n' +
            cssTooltipSelector + '.kml-tooltip>.kml-section ul { list-style: none; margin: 2px 0px; padding: 0px; }\n' + // margin: 2px 2px 2px -20px;
            cssTooltipSelector + '.kml-tooltip>.kml-section ul>li { text-align: left; padding-left: 3px; }\n' +
            cssTooltipSelector + '.kml-tooltip>.kml-section ul>li:before { content: "+"; padding-right: 6px; }\n';
        return tooltipCssEl;
    };

    var getKMLTooltipNode = function(tooltipId, sourceNode, elTooltipStyleProps) {
        // elTooltipStyleProps is for specifying the position of individual tooltips
        var kmlTooltipEl = document.createElement('div');
        if (tooltipId !== '' || tooltipId !== null) kmlTooltipEl.id = tooltipId;
        kmlTooltipEl.className = 'kml-tooltip kml-fade';

        if (elTooltipStyleProps !== undefined) {
            kmlTooltipEl.setAttribute('style', elTooltipStyleProps);
        }

        kmlTooltipEl.innerHTML = '<div class="kml-section">' +
            sourceNode.getAttribute('data-popup-text') + '</div>';

        return kmlTooltipEl;
    };

    var insertKMLTooltip = function(kmlTooltipEl, eventTriggerNode, containerNode, tooltipCssEl) {
        if (containerNode === 'parent' || containerNode === 'sibling') containerNode = eventTriggerNode.parentNode;
        else if (containerNode === 'child') containerNode = eventTriggerNode;

        eventTriggerNode.addEventListener('mouseenter', function(e) {
            cancelPopup = setTimeout(function(){
                if (showPopup) {
                    if (tooltipCssEl !== undefined) document.body.appendChild(tooltipCssEl);
                    kmlTooltipEl.className = 'kml-tooltip kml-fade';
                    kmlTooltipEl.style.display = 'block';
                    containerNode.appendChild(kmlTooltipEl);
                    setTimeout(function(){kmlTooltipEl.classList.remove('kml-fade');},20);
                }
            }, 100);
        }, false);

        eventTriggerNode.addEventListener('mouseleave', function(e) {
            requestAnimationFrame(function(){kmlTooltipEl.classList.add('kml-fade');});
            setTimeout(function() {
                kmlTooltipEl.remove();
                if (tooltipCssEl !== undefined) tooltipCssEl.remove();
            }, 210);
        }, false);
    };

    //============================================================================
    //        KK  KK MM    MM LL         MM    MM EEEEEEE NN   NN UU   UU
    //        KK KK  MMM  MMM LL         MMM  MMM EE      NNN  NN UU   UU
    //        KKKK   MM MM MM LL         MM MM MM EEEEE   NN N NN UU   UU
    //        KK KK  MM    MM LL         MM    MM EE      NN  NNN UU   UU
    //        KK  KK MM    MM LLLLLLL    MM    MM EEEEEEE NN   NN  UUUUU
    //============================================================================
    //drag and dropdown
    var findNodeIndex = function(attr, val) {
        for (var i = 0, iLength = this.length; i < iLength; i++) {
            if (this[i].querySelector('[' + attr + '="' + String(val) + '"]')) return i;
        }
        return null;
    };

    var dragEndPreset = function(ev) {
        //_$_(this.children).each(function(i,node){node.style.opacity = 1;});
        //console.debug('DragEnd:',ev.target);
        ev.preventDefault();
        showPopup = true;

        var presets = document.getElementsByClassName('kml-preset'),
            residualDrag = document.querySelectorAll('.kml-drag'),
            p, pLength = presets.length, residLength = residualDrag.length;

        //_$_('.kml-preset-menu').css('pointer-events', 'none');
        document.querySelector('ul.kml-preset-menu').classList.remove('kml-dragging');
        for (p=0; p<residLength; p++) {
            residualDrag[p].classList.remove('kml-drag');
        }

        for (p=0; p<pLength; p++) {
            presets[p].style.opacity = '';
            presets[p].draggable = false;
            presets[p].removeEventListener('dragover', allowDropPreset, false);
            presets[p].removeEventListener('dragenter', dragEnterPreset, false);
            presets[p].removeEventListener('drop', dropPreset, true);
            presets[p].removeEventListener('dragend', dragEndPreset, false);
        }
        window.removeEventListener('mouseup', dragEndPreset, false);
        ev.stopPropagation();
    };

    var dropPreset = function(ev) {
        //console.debug('Drop:',this);
        if (ev.preventDefault()) ev.preventDefault();

        var presetListEl = document.querySelector('.kml-preset-menu.dropdown-menu'),
            draggedPresetID = ev.dataTransfer.getData('text'),
            draggedPresetEl = document.getElementById('kmlSet_' + draggedPresetID).parentNode,
            targetPresetID = this.getAttribute('value'),
            refNode = presetListEl.childNodes[findNodeIndex.call(presetListEl.childNodes, 'value', targetPresetID)];

        presetListEl.insertBefore(draggedPresetEl, refNode);
        if (startMouseYPos <= ev.offsetY) presetListEl.insertBefore(refNode, draggedPresetEl); //moved down, so insert after instead

        /*if (!this.children[0].classList.contains('active')) this.children[0].classList.add('kml-bugfix');
        if (!draggedPresetEl.classList.contains('active')) draggedPresetEl.classList.add('kml-bugfix');
        if (!refNode.classList.contains('active')) refNode.classList.add('kml-bugfix');*/

        var listElements = document.querySelectorAll('.kml-preset-menu.dropdown-menu>li>a'),
            l, listLength = listElements.length, prevIndex, newSavedPresets = Array(myKMLayers.SAVED_PRESETS.length);

        for (l=0; l<listLength; l++) {
            prevIndex = parseInt(listElements[l].getAttribute('value'));
            newSavedPresets[l] = myKMLayers.SAVED_PRESETS[prevIndex];
            if (listElements[l].classList.contains('active')) {
                myKMLayers.idx = l;
            } else {
                listElements[l].classList.add('kml-bugfix');
            }
            listElements[l].setAttribute('value',l);
            listElements[l].id = 'kmlSet_' + l;
        }
        myKMLayers.SAVED_PRESETS = newSavedPresets;
        myKMLayers.saveToLocalStorage();
        if (KmLSync.hasSettingEnabled('&p')) KmLSync.upsyncSavedPresetsToGMFrom(myKMLayers); //Replaces presets saved in GM-space from current myKMLayers
        myKMLayers.setSessionPresetIdx();
    };

    var allowDropPreset = function(ev) {
        if (ev.preventDefault()) ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
        return false;
    };

    var dragEnterPreset = function(ev) {
        //console.debug('DragEnter:',ev.target);
        //ev.dataTransfer.dropEffect = 'move';
        var listItems = document.querySelectorAll('.kml-preset-menu>li'),
            l, lLength = listItems.length;

        for (l=0; l<lLength; l++) {
            listItems[l].classList.remove('kml-drag');
        }
        this.parentNode.classList.add('kml-drag'); //highlight drop site
    };

    var startMouseYPos;
    var dragStartPreset = function(ev) {
        //console.debug('DragStart:',ev);
        showPopup = false;

        var draggedPresetID = this.getAttribute('value'),
            presets = document.getElementsByClassName('kml-preset'),
            p, pLength = presets.length;

        startMouseYPos = ev.offsetY;
        //console.debug('Dragging preset',parseInt(draggedPresetID)+1);

        ev.dataTransfer.setData('text', draggedPresetID);
        for (p=0; p<pLength; p++) {
            presets[p].addEventListener('drop', dropPreset, true);
        }
        ev.dataTransfer.setDragImage(this, ev.offsetX, ev.offsetY);
        ev.dataTransfer.dropEffect = 'move';

        document.querySelector('ul.kml-preset-menu').classList.add('kml-dragging');

        this.style.opacity = 0.4;
    };
    //-----------------------------------------------------------------------------------
    var enableDragAndDrop = function() {
        //console.debug('enableDragAndDrop()');
        try {
            var elements = document.getElementsByClassName('kml-color-tab'),
                presets = document.getElementsByClassName('kml-preset dropdown-item'),
                p, pLength = presets.length, pp;

            for (p=0; p<pLength; p++) {
                presets[p].addEventListener('dragstart', dragStartPreset, false);
                elements[p].addEventListener('mouseenter',function(e) {
                    clearTimeout(cancelPopup);
                    if (document.getElementsByClassName('kml-tooltip').length)
                        document.getElementsByClassName('kml-tooltip')[0].style.display = 'none';
                    showPopup = false;
                }, false);
                elements[p].addEventListener('mouseleave',function(e) {
                    showPopup = true;
                    if (document.getElementsByClassName('kml-tooltip').length)
                        document.getElementsByClassName('kml-tooltip')[0].style.display = 'block';
                }, false);

                elements[p].addEventListener('mousedown', function(e) {
                    //console.debug('hi');
                    e.stopPropagation();
                    for (pp=0; pp<pLength; pp++) {
                        presets[pp].draggable = true;
                        presets[pp].addEventListener('dragover', allowDropPreset, false);
                        presets[pp].addEventListener('dragenter', dragEnterPreset, false);
                        presets[pp].addEventListener('dragend', dragEndPreset, false);
                    }
                    window.addEventListener('mouseup', dragEndPreset, false);
                }, false);
            }
        } catch(err) {console.error(err);}
    };

    var reopenDrawer = false;
    var insertColorPicker = function(ev){
        ev.stopPropagation();
        if (!document.getElementById('kmlPresetSwitcher').classList.contains('kml-keep-open')) {
            document.getElementById('kmlPresetSwitcher').click();
        }

        var colorPicker, idx, prevIdx;
        if (!document.getElementById('kmlColorPicker')) {
            colorPicker = document.createElement('div');
            colorPicker.id = 'kmlColorPicker';
            colorPicker.className = 'kml-colorpicker';
            colorPicker.innerHTML = '<div class="kml-colorpicker-row">' +
            '<span style="background-color: #BEDCE5;"></span>' +
            '<span style="background-color: #69BF88;"></span>' +
            '<span style="background-color: #FFEB3B;"></span>' +
            '<span style="background-color: #F1921B;"></span>' +
            '<span style="background-color: #DEC1E1;"></span>' +
            '<span style="background-color: #6B589F;"></span>' +
            '</div><div class="kml-colorpicker-row">' +
            '<span style="background-color: #59899E;"></span>' +
            '<span style="background-color: #45B8D1;"></span>' +
            '<span style="background-color: #F7C900;"></span>' +
            '<span style="background-color: #EC4B35;"></span>' +
            '<span style="background-color: #C577D2;"></span>' +
            '<span style="background-color: transparent;"></span>' +
            '</div>';
            this.parentNode.parentNode.insertBefore(colorPicker, this.parentNode);
            colorPicker.classList.add('open-drawer');

            var colorPaletteEls = document.querySelectorAll('#kmlColorPicker>.kml-colorpicker-row>span'),
                c, numColors = colorPaletteEls.length;

            for (c = numColors; c--;) {
                colorPaletteEls[c].addEventListener('mouseup', function(ev) {
                    ev.stopPropagation();
                    idx = parseInt(document.getElementById('kmlColorPicker').nextSibling.getAttribute('value'));
                    tabColor = this.style.backgroundColor;

                    myKMLayers.SAVED_PRESETS[idx].tabColor = tabColor;
                    document.querySelector('#kmlSet_' + idx + '>.kml-color-tab').style.backgroundColor = tabColor;
                    myKMLayers.saveToLocalStorage();
                    if (KmLSync.hasSettingEnabled('&p')) KmLSync.upsyncSavedPresetsToGMFrom(myKMLayers); //Replaces presets saved in GM-space from current myKMLayers
                    document.getElementById('kmlColorPicker').classList.remove('open-drawer');
                    setTimeout(function(){document.getElementById('kmlColorPicker').remove();}, 110);
                }, false);
            }
        } else {
            colorPicker = document.getElementById('kmlColorPicker');
            prevIdx = parseInt(colorPicker.nextSibling.getAttribute('value'));
            idx = parseInt(this.parentNode.getAttribute('value'));
            colorPicker.classList.remove('open-drawer');

            if (prevIdx !== idx) this.parentNode.parentNode.insertBefore(colorPicker, this.parentNode);

            if (prevIdx !== idx || reopenDrawer) {
                setTimeout(function(){
                    colorPicker.classList.add('open-drawer');
                },200);
                reopenDrawer = false;
            } else {
                reopenDrawer = true;
            }
        }
    };

    // Red save button
    var updateKMLayersSaveButton = function(kmlSavedStatus) {
        // Make save button red if nothing saved (nsave)
        setTimeout(function() {
            if (kmlSavedStatus === true) {
                document.getElementById("iKMLnotSaved").style.visibility = 'hidden';
                document.getElementById('icnKMLsaveLayers').classList.remove('kml-icn-off');
                document.getElementById('icnKMLresetLayers').classList.remove('kml-icn-off');
            } else if (kmlSavedStatus === false) {
                document.getElementById("iKMLnotSaved").style.visibility = 'visible';
                document.getElementById('icnKMLsaveLayers').classList.remove('kml-icn-off');
                document.getElementById('icnKMLresetLayers').classList.remove('kml-icn-off');
            } else {
                document.getElementById('icnKMLsaveLayers').classList.add('kml-icn-off');
                document.getElementById('icnKMLresetLayers').classList.add('kml-icn-off');
            }
        }, 300);
    };

	var switchPresets = function(evt) {
        evt.stopPropagation(); // prevent menu from closing upon clicking
        try {
        	this.parentNode.parentNode.querySelector('.active').classList.remove('active');
        } catch(err) {}
        this.classList.add('active');
        if (KmLSync.hasSettingEnabled('&p')) myKMLayers = KmLSync.getSavedPresetsFromGMThenToLS(myKMLayers);
        else myKMLayers = KmLSync.mergeMyKmLObjToLocalStorage(myKMLayers); //merge with what's in localStorage, favoring localStorage in case it has been updated in another window

        var selectedMenuIndex = parseInt(this.getAttribute('value'));

        // Check for "Disable presets at page load" menu selection
        if (selectedMenuIndex === 100) {
            KmLSync.addThisSettingToLS('&x');
            KmLSync.upsyncAllPreferencesFromLSToGM();// Note: prefs are always synced via overwrite, but whether they are applied depends on user setting

            myKMLayers.idx = selectedMenuIndex;
            myKMLayers.setSessionPresetIdx(myKMLayers.idx);
            myKMLayers.setMyKmLPresetIdxInLS(myKMLayers.idx);

            // Change active presets name under the layers menu
            document.getElementById('divKMLlayerName').innerHTML = '<i>No presets</i>';
            updateKMLayersSaveButton(NaN);

        } else {
            if (myKMLayers.idx === 100) {
                KmLSync.removeThisSettingFromLS('&x');
                KmLSync.upsyncAllPreferencesFromLSToGM();// Note: prefs are always synced via overwrite, but whether they are applied depends on user setting
            }
            myKMLayers.idx = selectedMenuIndex;
            myKMLayers.setSessionPresetIdx(myKMLayers.idx);
            myKMLayers.setMyKmLPresetIdxInLS(myKMLayers.idx);

            // Change active presets name under the layers menu
            document.getElementById('divKMLlayerName').innerHTML = myKMLayers.SAVED_PRESETS[myKMLayers.idx].name;

            setTimeout(function() {
                updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
                userResetOfLayersToSavedKMLayers(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
                enableToggleLayersButton(layersResetStatus);
            }, 150);

        }
    };
    var addPreset = function(e) {
    	e.stopPropagation();
    	myKMLayers = getMyKMLayersObject();

        var newPresetName = prompt("Please enter a name for the new preset", ""),
        	newPresetListItem = document.createElement('li');

        if (newPresetName) {
            myKMLayers.addNewPreset(newPresetName);
    		myKMLayers.setSessionPresetIdx();
			myKMLayers.saveToLocalStorage();
	        if (KmLSync.hasSettingEnabled('&p')) KmLSync.upsyncSavedPresetsToGMFrom(myKMLayers); //Replaces presets saved in GM-space from current myKMLayers
			setTimeout(function(){
				updatePresetSwitcherMenu(getWazeMapLayersFromSwitcher(_W_map.layers));
				if (!document.getElementById('kmlPresetSwitcher').classList.contains('kml-keep-open')) {
					document.getElementById('kmlPresetSwitcher').click();
				}
			}, 30);
            //updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
        }
    };

    var removePreset = function(e) {
    	e.stopPropagation();
    	myKMLayers = getMyKMLayersObject();

        if (myKMLayers.SAVED_PRESETS.length > 1) {
        	var confirmDel = confirm('Are you sure you want to delete this preset?'),
        		idx = parseInt(this.parentNode.getAttribute('value')),
        		resetLayers = false;

        	if (confirmDel) {
        		if (idx === myKMLayers.idx) resetLayers = true;
        		myKMLayers.removePreset(idx);
        		myKMLayers.setSessionPresetIdx(myKMLayers.idx);
				myKMLayers.saveToLocalStorage();
		        if (KmLSync.hasSettingEnabled('&p')) KmLSync.upsyncSavedPresetsToGMFrom(myKMLayers); //Replaces presets saved in GM-space from current myKMLayers
				setTimeout(function(){
					updatePresetSwitcherMenu(getWazeMapLayersFromSwitcher(_W_map.layers));
					if (!document.getElementById('kmlPresetSwitcher').classList.contains('kml-keep-open')) {
						document.getElementById('kmlPresetSwitcher').click();
					}
				}, 30);
		        setTimeout(function(){
		        	if (resetLayers && myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved) userResetOfLayersToSavedKMLayers(true);
		        }, 100);

                //updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
            }
        }
    };

    // Dropdown menu for selecting layers
    var updatePresetSwitcherMenu = function(kml_layerSwitcher) {
        try {
            //console.debug(myKMLayers);
            //console.debug(KmLSync);
            if (KmLSync.hasSettingEnabled('&p')) myKMLayers = KmLSync.getSavedPresetsFromGMThenToLS(myKMLayers); //ensure presets are update-to-date by grabbing fresh copy from GM-space
            else myKMLayers = KmLSync.mergeMyKmLObjToLocalStorage(myKMLayers); //merge with what's in localStorage, favoring localStorage in case it has been updated in another window
        } catch (err) { console.debug('updatePresetSwitcherMenu({})'); console.error(err); }

        if (myKMLayers.idx !== 100) {
            updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
        } else {
            updateKMLayersSaveButton(NaN);
        }

        if (kml_layerSwitcher === undefined || kml_layerSwitcher === '') kml_layerSwitcher = getWazeMapLayersFromSwitcher(_W_map.layers);

        var numKMLsets = myKMLayers.SAVED_PRESETS.length,
            findRealNames, missingLayerNames = false,
            layersInTooltipArray, numLayersInTooltip, layerPresetPopup, ltt, layerRealName,
            selStatus, kmlset, htmlText = '<span class="kml-menu-buffer-left"></span>',
            coloredText = Array(2), tabColor;

        if (myKMLayers.savedonce || numKMLsets > 1) { //both checks included as fail-safes
            coloredText[0] = 'kml-text-nsave';
            coloredText[1] = '';

            // Create Layer Preset Menu
            kmlset = -1;
            while (++kmlset < numKMLsets) {
                findRealNames = false;

                // Preset list preview layers [black] popup contents:
                /* ~~~~~~~~~~~~~~~ TEMP: Get real names to update old version of object ~~~~~~~~~~~~~~~ */
                if (myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenuRealName === null ||
                    myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenuRealName === undefined) {
                    myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenuRealName = []; //start with an empty array
                    findRealNames = true;
                } else if (myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenuRealName.length !== Object.keys(myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenu).length) {
                    myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenuRealName = []; //start with an empty array
                    findRealNames = true;
                }

                if (findRealNames) { // Get list of real layer names if not already saved... then build preset preview popup
                    layersInTooltipArray = Object.keys(myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenu).map(function(layerKey) {
                        return layerKey;
                    });
                    numLayersInTooltip = layersInTooltipArray.length;

                    if (numLayersInTooltip === 0) {
                        layerPresetPopup = '<ul style="font-weight: 600;"><li>none</li></ul>';
                    } else {
                        layerPresetPopup = '<ul style="font-weight: 600;">';
                        for (ltt = 0; ltt < numLayersInTooltip; ltt++) {
                            layerRealName = kml_layerSwitcher.name[layersInTooltipArray[ltt]];
                            if (layerRealName !== undefined) {
                                myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenuRealName.push(layerRealName);
                                layerPresetPopup += '<li><span>' + layerRealName + '</span></li>';
                            } else { // ~~~~~~ TEMP ~~~~~~~
                                layerPresetPopup += '<li><span>missing layer? - ' + layersInTooltipArray[ltt] + '</span></li>';
                                missingLayerNames = true;
                            }
                        }
                        layerPresetPopup += '</ul>';
                        //localStorage.WME_KeepMyLayers = JSON.stringify(myKMLayers);
                    }
                } else { // build preset preview popup
                    layersInTooltipArray = myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenuRealName;
                    numLayersInTooltip = myKMLayers.SAVED_PRESETS[kmlset].visibleInLayersMenuRealName.length;
                    if (numLayersInTooltip === 0) {
                        layerPresetPopup = '<ul style="font-weight: 600;"><li><span>none</span></li></ul>';
                    } else {
                        layerPresetPopup = '<ul style="font-weight: 600;">';
                        for (ltt = 0; ltt < numLayersInTooltip; ltt++) {
                            layerPresetPopup += '<li><span>' + layersInTooltipArray[ltt] + '</span></li>';
                        }
                        layerPresetPopup += '</ul>';
                    }
                }
                //---------------------
                // Populate list of custom preset names (main menu)
                selStatus = (kmlset === myKMLayers.idx) ? 'active ' : '';
                tabColor = (myKMLayers.SAVED_PRESETS[kmlset].tabColor) ? myKMLayers.SAVED_PRESETS[kmlset].tabColor : '#BEDCE5';

                htmlText += '<li>' +//data-toggle="tooltip" 'data-placement="left" data-container="menu.kml-preset-menu-container" data-html="true" ' +
                    '<a value=' + kmlset + ' id="kmlSet_' + kmlset + '" ' +
                    'class="kml-preset dropdown-item ' + selStatus + coloredText[0 ^ myKMLayers.SAVED_PRESETS[kmlset].saved] + '" ' +
                    'data-popup-text=\'' + layerPresetPopup + '\' ' +
                    'href="javascript:void(0)">' +
                    '<div title="Click to pick color. Drag tab to reorder." class="kml-color-tab" style="background-color:' + tabColor + '"></div>' +
                    '<span class="fa fa-trash"></span>' +
                    '<span>' + myKMLayers.SAVED_PRESETS[kmlset].name + '</span>' +
                    '</a>' +
                    '</li>';
            } //while-loop
            myKMLayers.saveToLocalStorage();

            // Disable presets menu option
            selStatus = (100 === myKMLayers.idx) ? 'active ' : '';
            layerPresetPopup = '<ul style="font-weight: 600;"><span>Disable auto-reset of layers at page load.</span></ul>';

            htmlText += '<li draggable=false>' +
                '<a draggable=false ondrop="return false;"' +
                ' value="100" id="kmlSet_disable"' +
                ' class="kml-preset ' + selStatus + '"' +
                ' data-popup-text=\'' + layerPresetPopup + '\'' +
                ' href="javascript:void(0)">' +
                //'<div draggable=false ondragstart="return false;" ondrop="return false;" ondragenter="return false;" style="background-color: #BEDCE5; pointer-events: none !important;"></div>' +
                '<span><i>No presets</i></span>' +
                '</a>' +
                '</li>';

            // "Add new preset" button
            htmlText += '<li><span class="kml-menu-buffer-left-bot"></span><div class="kml-menu-add"><i class="fa fa-plus"></i></div></li>';
            document.querySelector('ul[class*=kml-preset-menu]').innerHTML = htmlText;
            if (myKMLayers.idx !== 100) {
                document.getElementById('divKMLlayerName').innerHTML = myKMLayers.SAVED_PRESETS[myKMLayers.idx].name;
            } else {
                document.getElementById('divKMLlayerName').innerHTML = '<i>No presets</i>';
            }
            //_$_('#divKMLlayerName').text(myKMLayers.SAVED_PRESETS[myKMLayers.idx].name);

            // Init preset's layer list tooltips
            var presetMenuListEl = document.querySelectorAll('a.kml-preset'),
                sourceNode, tooltipEl;

            if (document.getElementById('cssKMLpresetTooltips') === null) {
                var presetsTooltipsCssEl = getKMLTooltipCssNode('menu.kml-preset-menu-container ', 'right', 'top: 18px', 'width: 150px; left: -162px; top: 0px; min-height: 39px; transition-delay: 1s', 'cssKMLpresetTooltips');
                document.body.appendChild(presetsTooltipsCssEl);
            }

            //------------------------------------------------------------------------
            // Setup event listeners for each preset switcher menu item
            var trashElements = document.querySelectorAll('#kmlPresetSwitcher span.fa-trash'),
                colorPickerElements = document.getElementsByClassName('kml-color-tab');

            kmlset = -1;
            while (++kmlset < numKMLsets+1) {
                try {
                    presetMenuListEl[kmlset].addEventListener('click', switchPresets, false);
                    presetMenuListEl[kmlset].addEventListener('mouseenter', function(){this.classList.remove('kml-bugfix');}, false);
                    trashElements[kmlset].addEventListener('click',removePreset,false);
                    colorPickerElements[kmlset].addEventListener('click',insertColorPicker,false);
                } catch (err) {}

                // Insert Preset Preview popup elements
                sourceNode = presetMenuListEl[kmlset];
                tooltipEl = getKMLTooltipNode('', sourceNode);
                insertKMLTooltip(tooltipEl, sourceNode, 'parent');
            }

            //------------------------------------------------------------------------
            document.getElementsByClassName('kml-menu-add')[0].addEventListener('click', addPreset, false);
            //for (var t=0, tlength=trashElements.length; t<tlength; t++){ trashElements[t].addEventListener('click',removePreset,false); }

            enableDragAndDrop();

            return missingLayerNames;
        } else {
            return false;
        }
    };

    //===================================================================
    //    BBBBB   EEEEEEE TTTTTTT   AAA      TTTTTTT  OOOOO    GGGGG
    //    BB   B  EE        TTT    AAAAA       TTT   OO   OO  GG
    //    BBBBBB  EEEEE     TTT   AA   AA      TTT   OO   OO GG  GGG
    //    BB   BB EE        TTT   AAAAAAA      TTT   OO   OO GG   GG
    //    BBBBBB  EEEEEEE   TTT   AA   AA      TTT    OOOO0   GGGGGG
    //===================================================================
    // Beta Editor Toggle Button
    var toggleKMLToggle = function(e, disableBetaTog) {

        var enableKMLBetaToggle = function(betaTogGMCallReply) {
            var setBetaTogStateToThis;
            // kmllog('betaTogGMCallReply = ' + betaTogGMCallReply)
            if (betaTogGMCallReply.constructor === String) {
                setBetaTogStateToThis = (betaTogGMCallReply.substr(betaTogGMCallReply.indexOf('-') + 1) === "true");
            } else if (betaTogGMCallReply.constructor === Boolean) {
                setBetaTogStateToThis = betaTogGMCallReply;
            } else {
                // Most likely it has been removed in another window... assume the user wants to re-enable,
                // since they are trying to un-disable the toggle... set toggle state to current editor
                setBetaTogStateToThis = KmLSync.isBeta;
            }

            document.getElementById('cbKMLtoggle').disabled = false;

            // kmllog('WMEKMLayers_Beta = ' + kmlbetaTogGMCallReply)
            //requestAnimationFrame(function() { GM_setValue("WMEKMLayers_Beta", betaTogGMCallReply) });
            KmLSync.setBetaTogValueInGM(setBetaTogStateToThis);
            document.getElementById('cbKMLtoggle').checked = setBetaTogStateToThis;
            document.getElementsByClassName('kml-toggle')[0].classList.remove('disabled');
        };

        var disableKMLBetaToggle = function() {
            var kmlBetaToggleChecked = document.getElementById('cbKMLtoggle').checked,
                kmlBetaToggleGM = 'disabled-' + kmlBetaToggleChecked;

            KmLSync.setBetaTogValueInGM(kmlBetaToggleGM);
            //requestAnimationFrame(function() { GM_setValue("WMEKMLayers_Beta", kmlBetaToggleGM) });
            //kmllog('WMEKMLayers_Beta = ' + kmlBetaToggleGM)
            document.getElementById('cbKMLtoggle').disabled = true;
            document.getElementById('cbKMLtoggle').checked = kmlBetaToggleChecked;
            document.getElementsByClassName('kml-toggle')[0].classList.add('disabled');

        };
        //----------------------------------------------------
        //kmllog('disableBetaTog = ' + disableBetaTog)
        // If no input arg, then check if the toggle on the page is currently disabled
        if (disableBetaTog === undefined || disableBetaTog === null) {
            //kmllog("cbKMLtoggle status: " + document.getElementById('cbKMLtoggle').disabled);
            if (document.getElementById('cbKMLtoggle').disabled) { //enable it... call GM for beta val state (i.e., set as beta or prod mode)
                //kmllog('Enabling Beta Toggle...')
                // If currently disabled, then enable it.
                KmLSync.callGM("WMEKMLayers_Beta", enableKMLBetaToggle);
            } else {
                //kmllog('Disabling Beta Toggle...')
                // Otherwise, disable if currently enabled.
                disableKMLBetaToggle();
            }
        } else if (disableBetaTog) {
            // If toggleKMLToggle is invoked with arguments, and disableBetaTog arg is true, then disable it.
            disableKMLBetaToggle();
        } else {
            KmLSync.callGM("WMEKMLayers_Beta", enableKMLBetaToggle);
        }
    };

    var kmlBetaProdToggle = function(kmlToggleArg) {
        //kmllog('kmlBetaProdToggle()', '/');
        var insertBetaToggleCss = function() {
            var innerBefore, innerAfter, labelBorder, labelBackground, disabledBorder, disabledBackground;

            // CSS for beta-editor toggle
            if (KmLSync.isBeta) { //rgba(250,82,87,0.5)
                innerBefore = 'transparent';
                innerAfter = 'repeating-linear-gradient( 60deg, #93C4D3, #93c4d3 4px, rgba(250, 82, 87, 0.53) 5px, #FF9DA0 7px )';
                labelBorder = "#FA5257";
                labelBackground = labelBorder;
                disabledBorder = 'rgba(250,82,87,0.4)';
                disabledBackground = 'rgba(250,82,87,0.5)';
            } else { //
                innerBefore ='repeating-linear-gradient( 60deg, transparent, transparent 3px, #FC6C70 3px, #FC6C70 8px )';
                innerAfter = 'transparent';
                labelBorder = "#93C4D3";
                labelBackground = labelBorder;
                disabledBorder = 'rgba(147, 196, 211, 0.5)';
                disabledBackground = 'rgba(147, 196, 211, 0.7)';
            }

            var toggleCss = '\
                .kml-toggle-container' + ' { position: absolute; right: 13px; top: 13px; }\n\
                .kml-toggle' + ' { z-index: 0; position: relative; \
                    -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; }\n\
                .kml-toggle-checkbox' + ' { display: none; }\n\
                .kml-toggle-checkbox:checked+.kml-toggle-label .kml-toggle-inner' + ' { margin-left: 0; }\n\
                .kml-toggle-checkbox:checked+.kml-toggle-label .kml-toggle-switch' + ' { right: 2px; }\n\
                .kml-toggle-label' + ' { display: block; background-color: ' + labelBackground + '; border: 2px solid ' + labelBorder + '; border-radius: 23px; width: 40px; height: 23px; margin: 0px; overflow: hidden; cursor: pointer; }\n\
                .kml-toggle-inner' + ' { display: block; width: 200%; margin-left: -100%; transition: all 0.1s cubic-bezier(0.55, 0.09, 0.68, 0.53) 0.15s; }\n\
                .kml-toggle-inner:before, .kml-toggle-inner:after' + ' { display: block; float: left; width: 50%; height: 21px; margin-top: -1px; \
                    padding: 0; box-sizing: border-box; border-radius: 21px; }\n\
                .kml-toggle-inner:before' + ' { content: ""; background: ' + innerBefore + '; }\n\
                .kml-toggle-inner:after' + ' { content: ""; background: ' + innerAfter + '; }\n\
                .kml-toggle-switch' + ' { position: absolute; display: block; background: #F6F7F8; margin: 0px; z-index: 1; \
                    top: 2px; bottom: 2px; right: 19px; width: 19px; height: 19px; border-radius: 50%; \
                    box-shadow: inset 0px 1px 0px #FFF, 0px 2px 4px rgba(0,0,0,0.3); transition: all 0.1s cubic-bezier(0.55, 0.09, 0.68, 0.53) 0.15s; }\n\
                div.kml-toggle.disabled .kml-toggle-label' + ' { border: 3px groove ' + disabledBorder + '; background: ' + disabledBackground + '; }\n\
                div.kml-toggle.disabled .kml-toggle-switch' + ' { right: 3px !important; box-shadow: inset 0px 1px 0px rgba(255,255,255,0.5), 0px 1px 1px rgba(0,0,0,0.3); margin-top: 1px; height: 17px; width: 34px; border-radius: 23px; margin-left: -19px; }\n' + //background: repeating-linear-gradient( 60deg, transparent, transparent 4px, rgba(255,255,255,0.75) 4px, rgba(255,255,255,0.75) 7px );
               'div.kml-toggle.disabled .kml-toggle-inner:before, div.kml-toggle.disabled .kml-toggle-inner:after' + ' { visibility: hidden; }\n\
                div.kml-toggle.disabled label, div.kml-toggle.disabled span { transition: all 0.2s ease-in-out 0s; }';

            document.getElementById('cssKeepMyLayers').innerHTML += toggleCss;
        };

        var insertBetaToggle = function(kmlBetaTogVal) {
            _$_('#user-details').prepend(
                '<div class="kml-toggle-container"><div class="kml-toggle">' +
                '<input type="checkbox" name="kml-toggle" class="kml-toggle-checkbox" id="cbKMLtoggle"' +
                kmlBetaTogVal + '>' +
                '<label class="kml-toggle-label" for="cbKMLtoggle">' +
                '<span class="kml-toggle-inner"></span>' +
                '<span class="kml-toggle-switch"></span></label></div></div>');

            //----- Event listeners for beta/prod toggle -----
            // popup prod/beta indicator helper text
            var kmlTogHelpEl = document.createElement('div');
            kmlTogHelpEl.id = 'kmlTogHelp';
            kmlTogHelpEl.setAttribute('style', 'z-index: 1; position: absolute; right: 43px; top: 0px; font-size: 16px; font-weight: 600; letter-spacing: -0.5px; text-align: center; color: #C0C0C0; line-height: 1.4; border-radius: 8px; padding: 0px 4px; background-color: rgba(242, 243, 244, 0.5); transition-duration: .2s; transition-timing-function: ease-in-out; opacity: 0;');
            document.getElementsByClassName('kml-toggle-container')[0].appendChild(kmlTogHelpEl);

            //-------------------------------------------------------------------------
            var cbKMLtoggleEl = document.getElementById('cbKMLtoggle');

            cbKMLtoggleEl.onclick = function() {
                KmLSync.setBetaTogValueInGM(document.getElementById('cbKMLtoggle').checked);

                setTimeout(function() {
                    switch (true) {
                        case cbKMLtoggleEl.disabled:
                            kmlTogHelpEl.innerHTML = 'DISABLED';
                            break;
                        case cbKMLtoggleEl.checked:
                            kmlTogHelpEl.innerHTML = 'BETA';
                            break;
                        case !cbKMLtoggleEl.checked:
                            kmlTogHelpEl.innerHTML = 'PROD';
                            break;
                    }
                    kmlTogHelpEl.style.opacity = 1;

                    setTimeout(function() {
                        kmlTogHelpEl.style.opacity = 0;
                    }, 800);

                }, 300);
            };

            document.getElementsByClassName('kml-toggle')[0].ondblclick = function(evt) {
                //evt.stopPropagation();
                setTimeout(function() {
                    if (!cbKMLtoggleEl.disabled) {
                        kmlTogHelpEl.innerHTML = 'ENABLED';
                        kmlTogHelpEl.style.opacity = 1;
                    }
                    setTimeout(function() {
                        kmlTogHelpEl.style.opacity = 0;
                    }, 600);
                }, 300);

                toggleKMLToggle(evt);
            };

            //Beta-prod toggle usage helper
            setTimeout(function() {
                KMLayersUsageHelper('beta_toggle', KmLSync.hasSeenKMLPopup('&b'));
            }, 1500);

        };

        //-------------------------------------------------------------------------
        if (document.getElementById('user-details') !== null && document.getElementById('cbKMLtoggle') === null) {
            kml[4] = 0; //reset counter
            var kmlBetaTogVal, kmlBetaGMType;

            //kmllog(kmlToggleArg);
            if (kmlToggleArg === undefined || kmlToggleArg === null) {
                kmlToggleArg = KmLSync.isBeta;
                kmlBetaGMType = kmlToggleArg;
            } else if (kmlToggleArg.constructor === Boolean) {
                kmlBetaGMType = kmlToggleArg;
                KmLSync.setBetaTogValueInGM(kmlToggleArg);
                //requestAnimationFrame(function() { GM_setValue("WMEKMLayers_Beta", kmlToggleArg) });
            } else { //kmlBetaProdToggle('disabled')
                kmlToggleArg = (kmlToggleArg.substr(kmlToggleArg.indexOf('-') + 1) === "true"); //bool string
                kmlBetaGMType = 'disabled';
            }

            (kmlToggleArg) ? kmlBetaTogVal = 'checked' : kmlBetaTogVal = '';
            insertBetaToggleCss();
            insertBetaToggle(kmlBetaTogVal);

            if (/&a\b/.test(localStorage.WME_KMLSettings)) requestAnimationFrame(initAltPermalink);

            // Disable toggle?
            if (kmlBetaGMType === 'disabled') {
                toggleKMLToggle(null, true); // disable toggle
            }

        } else if (_$_('#cbKMLtoggle').length > 0) {
            kml[4] = 0;
            return true;
        } else if (kml[4]++ < 30) {
            var waitTime = 200 + (kml[4] * 50);
            setTimeout(function() {
                kmlBetaProdToggle(kmlToggleArg);
            }, waitTime);
        } else {
            console.warn('WMEKmL:',
                'Unable to insert "Beta-Editor Toggle".',
                'Element #user-details not found on page.');
        }
    };
    //========================================================================
    //              AAA   LL     TTTTTTT      PPPPPP  LL
    //             AAAAA  LL       TTT        PP   PP LL
    //            AA   AA LL       TTT        PPPPPP  LL
    //            AAAAAAA LL       TTT        PP      LL
    //            AA   AA LLLLLLL  TTT        PP      LLLLLLL
    //========================================================================
    var initAltPermalink = function() {

        var getKMLPermalink = function(currPl, inBeta, togSuffix) {
            if (togSuffix === undefined) togSuffix = '';
            if (!KmLSync.useFriendlyPLs) togSuffix = '';

            var kmlShortPL = currPl.substr(currPl.lastIndexOf('editor')).replace(/&[^&]*Filter=[^&]*|&layers=(\d+)/ig,'');
            if (inBeta) {
                return 'https://www.waze.com/' + kmlShortPL + togSuffix;
            } else {
                return 'https://beta.waze.com/' + kmlShortPL + togSuffix;
            }
        };

        var copyAltPLHotkeyEvent = function(e) {
            var tooltipCopiedEl = document.getElementById('kmlPLTooltipCopied');
            if (e.shiftKey) {
                KmLSync.useFriendlyPLs = !KmLSync.toggleKMLUsageHistory('&f');
                var changedThisPl = getKMLPermalink(document.getElementById('wazePermalink').getAttribute('href'), false, '&b=0');
                document.getElementById('tooltipKMLPermalink').innerHTML = changedThisPl.replace(/&b=0/,'<font color="#FF3B49">&b=0</font>');
                document.getElementById('aKMLAltPermalink').setAttribute('href', changedThisPl);
            }
            if (e.metaKey || e.ctrlKey) kmlKeyPresses[0] = true;
            if (e.which === 67) kmlKeyPresses[1] = true;
            if (kmlKeyPresses[0] && kmlKeyPresses[1]) {
                requestAnimationFrame(function() {
                    GM_setClipboard(document.getElementById('aKMLAltPermalink').getAttribute('href'))
                });
                document.getElementById('kmlPLTooltip').style.display = 'none';
                tooltipCopiedEl.style.marginRight = '2px';
                tooltipCopiedEl.style.display = 'block';
                setTimeout(function() {
                    tooltipCopiedEl.style.display = 'none';
                }, 2000);
            }
        };

        var copyPLHotkeyEvent = function(e) {
            var tooltipCopiedEl = document.getElementById('kmlPLTooltipCopied');
            if (e.shiftKey) {
                KmLSync.useFriendlyPLs = !KmLSync.toggleKMLUsageHistory('&f');
                var changedThisPl = getKMLPermalink(document.getElementById('wazePermalink').getAttribute('href'), true, '&b=0');
                document.getElementById('tooltipKMLPermalink').innerHTML = changedThisPl.replace(/&b=0/,'<font color="#92C2D1">&b=0</font>');
                document.getElementById('aKMLPermalink').setAttribute('href', changedThisPl);
            }
            if (e.metaKey || e.ctrlKey) kmlKeyPresses[0] = true;
            if (e.which === 67) kmlKeyPresses[1] = true;
            if (kmlKeyPresses[0] && kmlKeyPresses[1]) {
                requestAnimationFrame(function() {
                    GM_setClipboard(document.getElementById('aKMLPermalink').getAttribute('href'));
                });
                document.getElementById('kmlPLTooltip').style.display = 'none';
                tooltipCopiedEl.style.marginRight = '25px';
                tooltipCopiedEl.style.display = 'block';
                setTimeout(function() {
                    tooltipCopiedEl.style.display = 'none';
                }, 2000);
            }
        };

        // make sure the welcome log-in screen is not up
        //document.getElementById("welcome-popup").className.lastIndexOf('hide') === -1
        if (document.getElementsByClassName('WazeControlPermalink').length && !document.getElementById('kmlPLPlaceholder')) {

            var wazePermalinkEl = document.querySelector('.WazeControlPermalink>a.fa-link'),
                wazeCopyPlNote = wazePermalinkEl.getAttribute('data-original-title'),
                wazeCurrentPl = wazePermalinkEl.getAttribute('href'),
                kmlMapPLContainer = document.createElement('div'),
                kmlPLPlaceholder = document.createElement('div'),
                kmlCurrentPl, kmlPLColor, kmlPermalinkEl,
                kmlCurrentAltPl, kmlAltPLColor, inBetaEditor, kmlAltPermalinkEl;


            wazePermalinkEl.id = 'wazePermalink';

            kmlMapPLContainer.id = 'kmlPL';
            kmlMapPLContainer.style.position = 'absolute';
            kmlMapPLContainer.style.width = '100%';
            kmlMapPLContainer.style.bottom = '0px';
            kmlMapPLContainer.style.right = '0px';
            kmlMapPLContainer.style.visibility = 'hidden';
            kmlMapPLContainer.style.pointerEvents = 'none';
            kmlMapPLContainer.style.zIndex = 4;
            kmlMapPLContainer.innerHTML =
		    '<div class="kml-pl-tooltipbox"><div id="kmlPLTooltip" style="display: none;"></div><div id="kmlPLTooltipCopied" style="display: none;"></div></div>' +
		    '<div id="kmlPLContainer" class="kml-pl-container" style="overflow: hidden;"><div id="kmlPermalink" class="fa-stack"></div><div id="kmlAltPermalink" class="fa-stack"></div></div>';
            document.getElementById('map').appendChild(kmlMapPLContainer);

            kmlPLPlaceholder.id = 'kmlPLPlaceholder';
            kmlPLPlaceholder.style.float = 'right';
            kmlPLPlaceholder.style.position = 'relative';
            kmlPLPlaceholder.style.bottom = '0px';
            kmlPLPlaceholder.style.right = '0px';
            kmlPLPlaceholder.style.height = '25px';
            kmlPLPlaceholder.style.width = '50px';
            kmlPLPlaceholder.style.marginRight = '-4px';
            kmlPLPlaceholder.style.marginLeft = '-21px';
            kmlPLPlaceholder.style.backgroundColor = '#E9E9E9';
            wazePermalinkEl.parentNode.appendChild(kmlPLPlaceholder);
            //------------------------------------------------------------------

            kmlAltPLColor = '#FA5257'; //red
            kmlPLColor = '#59899E'; //blue
            inBetaEditor = false;
            kmlPermalinkEl = document.getElementById('kmlPermalink');
            kmlAltPermalinkEl = document.getElementById('kmlAltPermalink');
            //---------------
            kmlCurrentPl = getKMLPermalink(wazeCurrentPl, !inBetaEditor, '&b=0');
            kmlPermalinkEl.innerHTML = '<a id="aKMLPermalink" href="' + kmlCurrentPl + '"><span class="fa fa-circle fa-stack-1x" style="color: ' + kmlPLColor + ';"></span><span class="fa fa-link fa-stack-1x fa-inverse"></span></a>';
            //---------------
            kmlCurrentAltPl = getKMLPermalink(wazeCurrentPl, inBetaEditor, '&b=0');
            kmlAltPermalinkEl.innerHTML = '<a id="aKMLAltPermalink" href="' + kmlCurrentAltPl + '"><span class="fa fa-circle fa-stack-1x" style="color: ' + kmlAltPLColor + ';"></span><span class="fa fa-link fa-stack-1x fa-inverse"></span></a>';

            //------------------------------------------------------------------
            // PL address popup
            document.getElementById('kmlPLTooltip').innerHTML = '<span id="tooltipKMLPermalink">' + kmlCurrentAltPl + '</span><p></p><b>' + wazeCopyPlNote + '</b>;&nbsp;&nbsp;&nbsp;Press Shift to toggle \'&b=0\'';
            // "Copied" popup
            document.getElementById('kmlPLTooltipCopied').innerHTML = '<b>' + kml_translations.footer.link_copied + '</b>';

            //------------------------------------------------------------------
            var kmlKeyPresses = Array(2);
            //---------------
            kmlAltPermalinkEl.addEventListener('mouseenter', function(e) {
                var changedThisPl = getKMLPermalink(wazePermalinkEl.getAttribute('href'), inBetaEditor, '&b=0');
                document.getElementById('tooltipKMLPermalink').innerHTML = changedThisPl.replace(/&b=0/,'<font color="#FF3B49">&b=0</font>');
                document.getElementById('aKMLAltPermalink').setAttribute('href', changedThisPl);
                document.getElementById('kmlPLTooltip').style.marginRight = '2px';
                document.getElementById('kmlPLTooltip').style.display = 'block';

                window.addEventListener("keydown", copyAltPLHotkeyEvent, false);
            }, false);

            kmlAltPermalinkEl.addEventListener('mouseleave', function() {
                kmlKeyPresses = Array(2);
                document.getElementById('kmlPLTooltip').style.display = 'none';
                document.getElementById('kmlPLTooltipCopied').style.display = 'none';

                window.removeEventListener("keydown", copyAltPLHotkeyEvent);
            }, false);
            //---------------
            kmlPermalinkEl.addEventListener('mouseenter', function(e) {
                var changedThisPl = getKMLPermalink(wazePermalinkEl.getAttribute('href'), !inBetaEditor, '&b=0');
                document.getElementById('tooltipKMLPermalink').innerHTML = changedThisPl.replace(/&b=0/,'<font color="#92C2D1">&b=0</font>');
                document.getElementById('aKMLPermalink').setAttribute('href', changedThisPl);
                document.getElementById('kmlPLTooltip').style.marginRight = '25px';
                document.getElementById('kmlPLTooltip').style.display = 'block';

                window.addEventListener("keydown", copyPLHotkeyEvent, false);
            }, false);

            kmlPermalinkEl.addEventListener('mouseleave', function() {
                kmlKeyPresses = Array(2);
                document.getElementById('kmlPLTooltip').style.display = 'none';
                document.getElementById('kmlPLTooltipCopied').style.display = 'none';

                window.removeEventListener("keydown", copyPLHotkeyEvent);
            }, false);

            try {
                // Hide WME permalink, but allow TB to overrule with display: none;
                wazePermalinkEl.style.visibility = 'hidden';
            } catch (err) {}

            //---------------
            setTimeout(function() {
                KMLayersUsageHelper('alt_permalink', KmLSync.hasSeenKMLPopup('&a'))
            }, 1500);
        } else {
            setTimeout(initAltPermalink, 500);
        }
    };

    //-------------------------
    var initSimplePermalink = function() {
        //var shortenRegularPls = KmLSync.hasSettingEnabled('&r');
        var getKMLPermalink = function(currPl) {
            var kmlShortPL = currPl.substr(currPl.lastIndexOf('editor')).replace(/&[^&]*Filter=[^&]*|&layers=(\d+)/ig,'');
            return location.origin + '/' + kmlShortPL;
        };

        var copyPLHotkeyEvent = function(e) {
            if (e.metaKey || e.ctrlKey) kmlKeyPresses[0] = true;
            if (e.which === 67) kmlKeyPresses[1] = true;
            if (kmlKeyPresses[0] && kmlKeyPresses[1]) {
                requestAnimationFrame(function() {
                    GM_setClipboard(document.getElementById('aKMLPermalink').getAttribute('href'));
                });
                document.getElementById('kmlPLTooltip').style.display = 'none';
                document.getElementById('kmlPLTooltipCopied').style.display = 'block';
                setTimeout(function() {
                    document.getElementById('kmlPLTooltipCopied').style.display = 'none';
                }, 2000);
            }
        };

        if (document.getElementsByClassName('WazeControlPermalink').length && !document.getElementById('kmlPLPlaceholder')) {

            var wazePermalinkEl = document.querySelector('.WazeControlPermalink>a.fa-link'),
                wazeCopyPlNote = wazePermalinkEl.getAttribute('data-original-title'),
                wazeCurrentPl = wazePermalinkEl.getAttribute('href'),
                kmlMapPLContainer = document.createElement('div'),
                kmlPLPlaceholder = document.createElement('div'),
                kmlCurrentPl = getKMLPermalink(wazeCurrentPl), kmlPLColor = '#59899E',
                kmlPermalinkEl;

            wazePermalinkEl.id = 'wazePermalink';

            kmlMapPLContainer.id = 'kmlPL';
            kmlMapPLContainer.style.position = 'absolute';
            kmlMapPLContainer.style.width = '100%';
            kmlMapPLContainer.style.bottom = '0px';
            kmlMapPLContainer.style.right = '0px';
            kmlMapPLContainer.style.visibility = 'hidden';
            kmlMapPLContainer.style.pointerEvents = 'none';
            kmlMapPLContainer.style.zIndex = 4;
            kmlMapPLContainer.innerHTML =
            '<div class="kml-pl-tooltipbox"><div id="kmlPLTooltip" style="display: none;"></div><div id="kmlPLTooltipCopied" style="display: none;"></div></div>' +
            '<div id="kmlPLContainer" class="kml-pl-container" style="overflow: hidden; width: 25px;"><div id="kmlPermalink" class="fa-stack"></div></div>';
            document.getElementById('map').appendChild(kmlMapPLContainer);

            kmlPLPlaceholder.id = 'kmlPLPlaceholder';
            kmlPLPlaceholder.style.float = 'right';
            kmlPLPlaceholder.style.position = 'relative';
            kmlPLPlaceholder.style.bottom = '0px';
            kmlPLPlaceholder.style.right = '0px';
            kmlPLPlaceholder.style.height = '25px';
            kmlPLPlaceholder.style.width = '25px';
            kmlPLPlaceholder.style.marginRight = '-4px';
            kmlPLPlaceholder.style.marginLeft = '-24px';
            kmlPLPlaceholder.style.backgroundColor = '#E9E9E9';
            wazePermalinkEl.parentNode.appendChild(kmlPLPlaceholder);
            //------------------------------------------------------------------
            kmlPermalinkEl = document.getElementById('kmlPermalink');
            kmlPermalinkEl.innerHTML = '<a id="aKMLPermalink" href="' + kmlCurrentPl + '"><span class="fa fa-circle fa-stack-1x" style="color: ' + kmlPLColor + ';"></span><span class="fa fa-link fa-stack-1x fa-inverse"></span></a>';
            //---------------
            // PL address popup
            document.getElementById('kmlPLTooltip').innerHTML = '<span id="tooltipKMLPermalink">' + kmlCurrentPl + '</span><p></p><b>' + wazeCopyPlNote + '</b>';
            // Copied popup
            document.getElementById('kmlPLTooltipCopied').innerHTML = '<b>' + kml_translations.footer.link_copied + '</b>';
            //------------------------------------------------------------------
            var kmlKeyPresses = Array(2);

            kmlPermalinkEl.addEventListener('mouseenter', function(e) {
                var changedThisPl = getKMLPermalink(document.getElementById('wazePermalink').getAttribute('href'));
                document.getElementById('tooltipKMLPermalink').innerHTML = changedThisPl;
                document.getElementById('aKMLPermalink').setAttribute('href', changedThisPl);
                document.getElementById('kmlPLTooltip').style.display = 'block';
                window.addEventListener("keydown", copyPLHotkeyEvent, false);
            }, false);

            kmlPermalinkEl.addEventListener('mouseleave', function() {
                kmlKeyPresses = Array(2);
                document.getElementById('kmlPLTooltip').style.display = 'none';
                document.getElementById('kmlPLTooltipCopied').style.display = 'none';
                window.removeEventListener("keydown", copyPLHotkeyEvent);
            }, false);

            try {
                // Hide WME permalink, but allow TB to overrule with display: none;
                document.getElementById('wazePermalink').style.visibility = 'hidden';
            } catch (err) {}

            //---------------
            /*setTimeout(function() {
                KMLayersUsageHelper('reg_permalink', KmLSync.hasSeenKMLPopup('&r'))
            }, 1500);*/
        } else {
            setTimeout(initSimplePermalink, 500);
        }
    };
    //==============================================================================
    //    PPPPPP  RRRRRR  EEEEEEE FFFFFFF    PPPPPP    AAA   NN   NN EEEEEEE
    //    PP   PP RR   RR EE      FF         PP   PP  AAAAA  NNN  NN EE
    //    PPPPPP  RRRRRR  EEEEE   FFFF       PPPPPP  AA   AA NN N NN EEEEE
    //    PP      RR  RR  EE      FF         PP      AAAAAAA NN  NNN EE
    //    PP      RR   RR EEEEEEE FF         PP      AA   AA NN   NN EEEEEEE
    //==============================================================================
    var selectLanguageLocale = function() {
        var langLocaleEl = document.createElement('div');
        langLocaleEl.id = 'langLocaleEl';
        langLocaleEl.style.display = 'inline-block';
        langLocaleEl.style.margin = '0px';
        langLocaleEl.style.padding = '0px';
        langLocaleEl.innerHTML = '\
            <div class="language-selector">\
            <div class="btn-group pull-right">\
            <a class="btn btn-default dropdown-toggle toggle-language-selector" data-toggle="dropdown" href="#" style="margin: -3px 10px -7px 10px; width: 82px; padding: 3px 0px;">\
            <i class="fa fa-globe"></i>\
            <span class="language_code">none</span>\
            <i class="fa fa-caret-down"></i>\
            </a>\
            <ul class="dropdown-menu locales">\
            <li class="active"><a data-locale="none" href="#">&nbsp;</a></li>\
            <li><a data-locale="af" href="#">Afrikaans</a></li>\
            <li><a data-locale="ar" href="#">العربية</a></li>\
            <li><a data-locale="bg" href="#">Български</a></li>\
            <li><a data-locale="ca" href="#">Català</a></li>\
            <li><a data-locale="cs" href="#">Čeština</a></li>\
            <li><a data-locale="da" href="#">Dansk</a></li>\
            <li><a data-locale="de" href="#">Deutsch</a></li>\
            <li><a data-locale="en-GB" href="#">English (UK)</a></li>\
            <li><a data-locale="en" href="#">English</a></li>\
            <li><a data-locale="es-419" href="#">Español-América Latina</a></li>\
            <li><a data-locale="es" href="#">Español</a></li>\
            <li><a data-locale="fi" href="#">Suomi</a></li>\
            <li><a data-locale="fr" href="#">Français</a></li>\
            <li><a data-locale="gl" href="#">Galego</a></li>\
            <li><a data-locale="he" href="#">עברית</a></li>\
            <li><a data-locale="hu" href="#">Magyar</a></li>\
            <li><a data-locale="it" href="#">Italiano</a></li>\
            <li><a data-locale="ja" href="#">日本語</a></li>\
            <li><a data-locale="ko" href="#">한국어</a></li>\
            <li><a data-locale="lv" href="#">Latviešu</a></li>\
            <li><a data-locale="ms" href="#">Melayu</a></li>\
            <li><a data-locale="nl" href="#">Nederlands</a></li>\
            <li><a data-locale="pl" href="#">Polski</a></li>\
            <li><a data-locale="pt-BR" href="#">Português-Brasil</a></li>\
            <li><a data-locale="pt-PT" href="#">Português</a></li>\
            <li><a data-locale="ro" href="#">Română</a></li>\
            <li><a data-locale="ru" href="#">Русский</a></li>\
            <li><a data-locale="sl" href="#">Slovenščina</a></li>\
            <li><a data-locale="sk" href="#">Slovenčina</a></li>\
            <li><a data-locale="sv" href="#">Svenska</a></li>\
            <li><a data-locale="tr" href="#">Türkçe</a></li>\
            <li><a data-locale="zh" href="#">中文（简体）</a></li>\
            <li><a data-locale="zh-TW" href="#">中文（簡體）</a></li>\
            <li><a data-locale="id" href="#">Bahasa Indonesia</a></li>\
            <li><a data-locale="et" href="#">Eesti</a></li>\
            <li><a data-locale="hr" href="#">Hrvatski</a></li>\
            <li><a data-locale="sr" href="#">Srpski (Latinica)</a></li>\
            <li><a data-locale="no" href="#">Norsk</a></li>\
            </ul>\
            </div>\
            </div>';

        document.getElementById(kmlElementMap.ids.localeRedirect).parentNode.appendChild(langLocaleEl);

        var kmlLocaleSelectorEl = document.querySelectorAll('div.kml-panel div.language-selector ul.dropdown-menu.locales>li>a'),
            numkmlLocaleSelector = kmlLocaleSelectorEl.length,
            kml_ls = -1,
            kmlLocaleValGM = KmLSync.getLocaleValueFromGM();

        //KmLSync._GM_refreshLangAttribute();
        //kmlLocaleValGM = KmLSync._GM_CALLBACKS.lang;
        if (!kmlLocaleValGM || kmlLocaleValGM === true) kmlayersLangChk = 'none'; //Bool true means to use default locale (en)

        while (++kml_ls < numkmlLocaleSelector) {
            if (kmlayersLangChk === kmlLocaleSelectorEl[kml_ls].getAttribute('data-locale')) {
                if (kml_ls) {
                    kmlLocaleSelectorEl[kml_ls].parentNode.className = 'active';
                    document.querySelector('div.kml-panel div.language-selector span.language_code').innerHTML = kmlayersLangChk;
                }
            } else {
                kmlLocaleSelectorEl[kml_ls].parentNode.className = '';
            }

            document.querySelectorAll('div.kml-panel div.language-selector ul.dropdown-menu.locales>li>a')[kml_ls].onclick = function() {
                var langLocale = this.getAttribute('data-locale');

                document.querySelector('div.kml-panel div.language-selector ul.dropdown-menu.locales>li.active').className = '';
                document.querySelector('div.kml-panel div.language-selector span.language_code').innerHTML = langLocale;
                this.parentNode.className = 'active';
            };
        }
    };

    //----------------------------------------------------------------------
    var showKMLPrefsPanel = function() {
        //kmllog('showKMLPrefsPanel()');
        //----------------------------------------------------------
        var mlBetaInitState = KmLSync.isBeta,
            kmlOptions, kmlOptionsHelpTips, kmlSettingsUI = document.createElement('div');

        if (KmLSync.hasSettingEnabled('&p')) myKMLayers = KmLSync.getSavedPresetsFromGMThenToLS(myKMLayers); //updates myKMLayers by replacing presets with those saved in GM-space
        else myKMLayers = getMyKMLayersObject(); //updates myKMLayers by favoring what's saved in localStorage
		requestAnimationFrame(function(){
			updatePresetSwitcherMenu(getWazeMapLayersFromSwitcher(_W_map.layers));
		});
        //----------------------------------------------------------
        // setup checkbox list for UI
        kmlOptions = ['Insert a Beta-Production WME toggle into left side-panel', // &b
            'Replace permalink icon with Beta-Prod toggle-friendly permalinks<br><i>(for beta WME testers)</i>', // &a
            'Replace permalink icon with KmL shortened regular permalinks<br><i>(for all editors)</i>', // &r
            'Synchronize KeepMyLayers preferences between Beta and Prod WME', // &s
            'Synchronize saved presets between Beta and Prod WME', // &p
            'Remove locale from clicked permalinks and force', // &l
            'Increase opacity of cities layer polygons', // layer 1 - &1
            'Reduce opacity of area managers layer polygons', // layer 5 - &5
            'Add a small amount of transparency to roads layer', // layer 2 - &2
            'Disable reset of layers at page load (i.e., manual preset selection)', // &x
            'Show only the color tabs of the Preset Switcher menu when it is hiding off-screen'
        ]; //[5] xx

        kmlOptionsHelpTips = ['The <b>Beta-Prod toggle</b> is added to the top of the left side-panel (near your username). Use it to force permalinks to load in either <font color=&quot;#FF3B49&quot;>Beta</font> or <font color=&quot;#93C4D3&quot;>Production</font> WME. Double-click on toggle to quickly disable. <p></p>Note: If you are not a Beta WME tester, it is unlikely that you will find this feature useful.',
            '<b>Beta-Prod toggle-friendly permalinks</b> (PLs) allow you to easily switch back and forth between Beta and Prod WME without having to disable the toggle.<p></p>Enabling this feature will replace the PL icon in the WME footer with two new options that can ignore the toggle\'s setting: use <font color=&quot;#FF3B49&quot;>red PL</font> for Beta and <font color=&quot;#93C4D3&quot;>blue PL</font> for Prod. You can click on these PLs to switch between editors or for reloading the page. Copy the blue PL for sharing the Prod link while in Beta. Any layers and locales are always removed.<p></p>Hovering over the links and pressing the shift key turns friendly-PL tagging on/off.',
            '(Added to KmL by popular request) Remove all layer and filter specifications from copied permalinks. In addition, presently <b><i>unique to KmL</i></b>, the permalink icon remains clickable even when WME is stuck on the darkened save screen.',
            'Synchronize all your settings under KeepMyLayers Preferences between Beta and Prod editors. This does not include your saved layer presets.',
            'Synchronize your saved layer presets between Beta and Prod editors.<p></p>NOTE: The Presets Sync feature is still being developed. Your first sync will involved combining the presets from both editors and you may have to go into the Preference pane to remove any duplicates. In the future, KMLayers will try to check for this. Also, if you added or removed a preset in another WME window, you will have to click on the KMLayers Presets Switcher button to manually refresh the list.',
            '<b>PL locale removal</b> prevents WME from loading in another language. You can optionally force a specific locale by selecting your desired language from the dropdown menu.<p></p>CAUTION: At the moment, KMLayers is unable to switch back and forth between languages. If you saved your layers while using localized WME, you must load WME with the same locale for your saved layer presets to work. If you switch to a different locale, you will be required to resave your layers. This will be fixed in a forthcoming update.',
            'Increasing the opacity of the cities layer makes it easier to see colored polygons.',
            'Reducing the opacity of the area managers (AMs) layer can make it easier to see the underlying map in a region with many AMs.',
            'Adding transparency to the roads layer makes it possible to see through road segments that cover the satellite imagery.',
            'Disabling auto-reset prevents this script from trying to reset your layers each time WME is reloaded. You can still manually reset layers by clicking on a saved preset under the KMLayers Preset Switcher menu or clicking the magic wand icon under the WME Layers menu.',
            'Get more screen space by having the Preset Switcher menu show only the customizable color tabs when hidden off-screen. You can pick your own colors by clicking directly on the tabs.'
        ];

        kmlSettingsUI.id = 'KMLsettings';
        kmlSettingsUI.className = 'kml-panel-blackout';

        var selectedKML = Array(kmlOptions.length),
            queryList = kmlElementMap.queryCodeList,
            cbKMLSettingsStr;

        //TODO: Clean the following code up....
        if (localStorage.WME_KMLSettings === undefined) {
            localStorage.WME_KMLSettings = ':';
            cbKMLSettingsStr = ':';
        } else {
            cbKMLSettingsStr = localStorage.WME_KMLSettings;
        }

        //  Setup KMLayers settings panel and select checkbox of set options
        for (var kml_s = 0, numKmlOpt = kmlOptions.length; kml_s < numKmlOpt; kml_s++) {
            selectedKML[kml_s] = (~cbKMLSettingsStr.indexOf(queryList[kml_s])) ? ' checked' : '';

            kmlSettingsUI.innerHTML += '<div class="controls-container kml-pref-help">' +
                '<i class="kml-pref-help fa fa-question-circle fa-pull-right" ' +
                'data-popup-text="' + kmlOptionsHelpTips[kml_s] + '" ' +
                'id="' + kmlElementMap.idToUsageName['cbKML_' + kml_s] + 'Help"></i>' +
                '<input type="checkbox" id="cbKML_' + kml_s +
                '" class="checkbox"' + selectedKML[kml_s] +
                '></input>' +
                '<label for="cbKML_' + kml_s + '">' + kmlOptions[kml_s] + '</label>' +
                '</div>';
        }

        kmlSettingsUI.innerHTML =
            '<div class="kml-panel" style="left: 45%">' +
            '  <i id="icnKMLsettings" class="fa fa-cog fa-4x pull-left"></i>' +
            '  <h2>KeepMyLayers Preferences <span style="font-size: 12px; font-weight: 400;">v.' + KMLayersVersion.currentVersion + '</span></h2>' +
            '  <hr class="kml-panel-hr">' +
            '  <div class="kml-panel-section" style="margin-bottom: 13px;">' +
            kmlSettingsUI.innerHTML +
            '  </div>' +
            '  <hr class="kml-panel-hr">' +
            '  <div class="kml-panel-btn">' +
            '    <div id="KMLnote" style="line-height: 1; margin-top: -2px; color: #FF0080; position: absolute; left: 0px; display: inline-block; text-align: left; ' +
            '        width: 63%; padding: 0px 10px; vertical-align: middle">' + //line-height: 15px; height: 40px;
            '' + // notes and layers menu go here
            '    </div>' +
            '    <div style="position: absolute; right: 0px; width: 35%; display: inline-block;">' +
            '      <button id="btnKMLsave" style="width: 85px" class="btn btn-primary kml-panel-btn">Save</button>' +
            '      <button id="btnKMLcancel" class="btn btn-default kml-panel-btn">Cancel</button>' +
            '    </div>' +
            '</div></div>';
        document.getElementById('map').appendChild(kmlSettingsUI);

        //--------------------------------------------------------------------------
        // Adjust yoked options (beta-prod toggle and alt-PL)
        var altPLOptionEl = document.getElementById(kmlElementMap.ids.altPermalink);
        altPLOptionEl.parentNode.style.marginBottom = '4px';
        altPLOptionEl.parentNode.innerHTML = '<span class="fa fa-level-up fa-rotate-90" style="vertical-align: top; color: #DDD; font-size: 16px; margin: auto 6px auto 7px;"></span>' + altPLOptionEl.parentNode.innerHTML;

        var yokeBetaTogAndAltPLOptions = function() {
            var altPLOptionEl = document.getElementById(kmlElementMap.ids.altPermalink);
            if (document.getElementById(kmlElementMap.ids.betaRedirect).checked) {
                altPLOptionEl.removeAttribute('disabled');
                altPLOptionEl.parentNode.style.pointerEvents = 'auto';
                altPLOptionEl.checked = KmLSync.hasSettingEnabled('&a');
            } else {
                altPLOptionEl.setAttribute('disabled', '');
                altPLOptionEl.parentNode.style.pointerEvents = 'none';
                altPLOptionEl.checked = false;
            }
        };

        //--------------------------------------------------------------------------
        // Init Help Tooltips
        var allTooltipsCssEl = getKMLTooltipCssNode('', 'left', 'top: 13px'),
            attachmentNode, tooltipEl;

        document.body.appendChild(allTooltipsCssEl);
        for (kml_s = numKmlOpt; kml_s--;) {
            attachmentNode = document.getElementById(kmlElementMap.idToUsageName['cbKML_' + kml_s] + 'Help');
            tooltipEl = getKMLTooltipNode('', attachmentNode, 'width: 200px; left: 99%; top: 0px;');
            insertKMLTooltip(tooltipEl, attachmentNode, 'parent');
        }

        //--------------------------------------------------------------------------
        // Post note about needing to save their first preset
        if (!myKMLayers.savedonce) {
            if (myKMLayers.SAVED_PRESETS.length <= 1)  {
                document.getElementById('KMLnote').innerHTML =
                    '<span style="font-size:11px">' +
                    'Select some layers under the WME menu and click' +
                    '<div class="fa-stack kml-icn-btn reload-button" style="margin-right: 5px;" title="Save current set of layers"><div class="fa fa-save fa-stack-1x" style="color: #59899e;"></div><div class="fa fa-plus-circle fa-stack-1x" style="font-size: 10px; margin: -3px -5px 3px 5px; text-shadow: 1px -1px 0px white, 2px -2px 0px white; color: crimson;"></div></div>' +
                    'in the bottom corner to save. You can return here later by double-clicking on the Layers icon to add more presets.' +
                    '</span>';
            } else {
                myKMLayers.savedonce = true;
                myKMLayers.saveToLocalStorage();
            }
        // User-Defined Layer Presets
        } else {
            /*
            document.getElementById('KMLnote').innerHTML =
                '<div class="form-inline" style="display: inline-block; vertical-align: middle;">' +
                '   <div style="display: inline-block; vertical-align: middle;">' +
                '<i style="font-size: 16px; margin-right: 5px;" class="kml-pref-help fa fa-question-circle" ' +
                'data-popup-text="Add or remove additional layer presets that can be accessed under the KeepMyLayers menu from the WME toolbar.<p></p>NOTE: The ability to add/remove presets directly from the menu will be added in a later version, but for now, you must do so here in the Preference pane. If you opted to synchronize your presets between Beta and Prod WME, please also see the current usage notes under the help tooltip for that setting above." ' +
                'id="selectKMLPresetsHelp"></i></div>' +
                '   <select id="selKMLset" class="form-control" style="width: 200px;"></select>' +
                '   <div style="display: inline-block; vertical-align: middle;">' +
                '   <div id="addKMLset" style="color: #AAAAAA; margin-left: 4px; display:inline-block; cursor: pointer;" class="fa fa-plus-circle fa-2x"></div>' +
                '   <div id="removeKMLset" style="color: #AAAAAA; margin-left: 4px; display:inline-block; cursor: pointer;" class="fa fa-minus-circle fa-2x"></div>' +
                '</div></div>';

            var presetsTooltipsCssEl = getKMLTooltipCssNode('#tipKMLselectKMLPresetsHelp', 'right', 'top: 13px');

            attachmentNode = document.getElementById('selectKMLPresetsHelp');
            tooltipEl = getKMLTooltipNode('tipKMLselectKMLPresetsHelp', attachmentNode, 'width: 240px; left: -250px; top: 5px;');
            insertKMLTooltip(tooltipEl, attachmentNode, 'parent', presetsTooltipsCssEl);

            for (var kml_sel = 0, numSets = myKMLayers.SAVED_PRESETS.length; kml_sel < numSets; kml_sel++) {
                document.getElementById("selKMLset").add(new Option(myKMLayers.SAVED_PRESETS[kml_sel].name));
            }

            // Event-listeners for layer preset customization buttons
            document.getElementById("selKMLset").selectedIndex = myKMLayers.idx;
            document.getElementById("selKMLset").value = myKMLayers.SAVED_PRESETS[myKMLayers.idx].name;

            document.getElementById("selKMLset").onchange = function() {
                myKMLayers.idx = document.getElementById("selKMLset").selectedIndex;
                updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
            };

            document.getElementById("addKMLset").onclick = function() {
                var newKMLayerSetName = prompt("Please enter a name for the new preset", ""),
                    newKMLayerOpt = document.createElement('option');

                newKMLayerOpt.appendChild(document.createTextNode(newKMLayerSetName));
                document.getElementById("selKMLset").appendChild(newKMLayerOpt);
                myKMLayers.addNewPreset(newKMLayerSetName);
                document.getElementById("selKMLset").selectedIndex = myKMLayers.idx;

                updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
            };

            document.getElementById("removeKMLset").onclick = function() {
                if (myKMLayers.SAVED_PRESETS.length > 1) {
                    var selectedKMLIndex = document.getElementById("selKMLset").selectedIndex;

                    myKMLayers.removePreset(selectedKMLIndex);
                    document.getElementById("selKMLset").removeChild(document.getElementById("selKMLset").options[selectedKMLIndex]);
                    document.getElementById("selKMLset").selectedIndex = myKMLayers.idx;
                    document.getElementById("selKMLset").value = myKMLayers.SAVED_PRESETS[myKMLayers.idx].name;

                    updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
                }
            };
            */
            if (KmLSync.getLocaleValueFromGM()) document.getElementById(kmlElementMap.ids.localeRedirect).checked = true;

            // Monitor for yoked preference settings
            yokeBetaTogAndAltPLOptions();
            document.getElementById(kmlElementMap.ids.betaRedirect).onchange = function(){
                yokeBetaTogAndAltPLOptions();
                if (document.getElementById(kmlElementMap.ids.altPermalink).disabled)
                    document.getElementById(kmlElementMap.ids.regPermalink).removeAttribute('disabled');
            };

            if (document.getElementById(kmlElementMap.ids.altPermalink).checked)
                document.getElementById(kmlElementMap.ids.regPermalink).setAttribute('disabled','');

            document.getElementById(kmlElementMap.ids.altPermalink).onclick = function(){
                if (this.checked) document.getElementById(kmlElementMap.ids.regPermalink).setAttribute('disabled','');
                else document.getElementById(kmlElementMap.ids.regPermalink).removeAttribute('disabled');
            };
        }

        // Add locale dropdown
        selectLanguageLocale();

	    //----------------------------------------------------------------//
	    //                 APPLY AND SAVE PREFERENCES                     //
	    //----------------------------------------------------------------//
	    var applyKMLayersSettings = function(mykml) {
	        console.info(mykml)

	        var storeStr = ':',
	            kmlSyncPresets = false;;

	        if (document.getElementById(kmlElementMap.ids.disableRedirect).checked) storeStr += '&x'; //disable KML

	        if (document.getElementById(kmlElementMap.ids.betaRedirect).checked) {
	            storeStr += '&b'; //beta
	            var kmlCurrBetaHostState = KmLSync.isBeta;
	            setTimeout(function() {
	                kmlBetaProdToggle(kmlCurrBetaHostState);
	            }, 250);
	        } else if (document.getElementsByClassName('kml-toggle-container').length !== 0) {
	            KmLSync.deleteGM("WMEKMLayers_Beta");
	            //requestAnimationFrame(function() { GM_deleteValue("WMEKMLayers_Beta")});
	            document.getElementsByClassName('kml-toggle-container')[0].remove();
	            KmLSync.unlogKMLUsageHistory('&b');
	        }

	        if (document.getElementById(kmlElementMap.ids.altPermalink).checked) {
	            storeStr += '&a'; //alt-PLs
	            KmLSync.unlogKMLUsageHistory('&r');

	            if (document.getElementById('kmlPL') !== null) {
	                document.getElementById('kmlPL').remove();
	                document.getElementById('kmlPLPlaceholder').remove();
	                document.getElementById('wazePermalink').style.visibility = 'visible';
	            }

	            if (document.getElementsByClassName('kml-toggle-container').length !== 0) {
	                requestAnimationFrame(initAltPermalink);
	            }
	        } else {
	            if (document.getElementById('kmlPL') !== null) {
	                KmLSync.unlogKMLUsageHistory('&a');

	                document.getElementById('kmlPL').remove();
	                document.getElementById('kmlPLPlaceholder').remove();
	                document.getElementById('wazePermalink').style.visibility = 'visible';
	            }

	            if (document.getElementById(kmlElementMap.ids.regPermalink).checked) {
	                storeStr += '&r'; //regular-PLs
	                requestAnimationFrame(initSimplePermalink);
	            } else {
	                KmLSync.unlogKMLUsageHistory('&r');
	            }
	        }

	        if (document.getElementById(kmlElementMap.ids.syncPrefs).checked) {
	            storeStr = '!' + storeStr + '&s';
	        }

	        if (document.getElementById(kmlElementMap.ids.syncPresets).checked) {
	            storeStr += '&p';
	            kmlSyncPresets = true;
	            if (mykml && mykml.SAVED_PRESETS && mykml.SAVED_PRESETS.length) {
	                KmLSync.setGM("WMEKMLayers_Presets", JSON.stringify(mykml.SAVED_PRESETS));
	                mykml.syncPresets = true;
	            } else {
	                KmLSync.deleteGM("WMEKMLayers_Presets");
	                mykml.syncPresets = false;
	            }
	        }

	        if (document.getElementById(kmlElementMap.ids.localeRedirect).checked) {
	            storeStr += '&l'; //lang
	            var langLocale = document.querySelector('div.kml-panel div.language-selector span.language_code').innerHTML;
	            if (langLocale === 'none' || langLocale === 'en') {
	                requestAnimationFrame(function() {GM_setValue("WMEKMLayers_Lang", true);});
	            } else {
	                requestAnimationFrame(function() {GM_setValue("WMEKMLayers_Lang", langLocale);});
	            }
	        } else {
	            KmLSync.deleteGM("WMEKMLayers_Lang");
	            //requestAnimationFrame(function() { GM_deleteValue("WMEKMLayers_Lang") });
	        }

	        if (document.getElementById(kmlElementMap.ids.cityLayer).checked) storeStr += '&1'; //city
	        if (document.getElementById(kmlElementMap.ids.amLayer).checked) storeStr += '&5'; //am
	        if (document.getElementById(kmlElementMap.ids.roadLayer).checked) storeStr += '&2'; //roads
            if (document.getElementById(kmlElementMap.ids.colorTabs).checked) {
                storeStr += '&t'; //tabs
                document.getElementById('kmlPresetSwitcher').classList.add('kml-tabbed');
                //if (KmLSync.isBeta) {
                    document.querySelector('.olControlPanZoomBar').style.left = '10px';
                    document.querySelector('.olControlPanZoomBar').style.right = 'auto';
                //}
            } else {
                document.getElementById('kmlPresetSwitcher').classList.remove('kml-tabbed');
                //if (KmLSync.isBeta) {
                    document.querySelector('.olControlPanZoomBar').style.left = '';
                    document.querySelector('.olControlPanZoomBar').style.right = '';
                //}
            }

	        document.getElementById("KMLsettings").remove();

	        localStorage.WME_KMLSettings = storeStr;
	        KmLSync.upsyncAllPreferencesFromLSToGM();// Note: prefs are always synced via overwrite, but whether they are applied depends on user setting

	        requestAnimationFrame(applyAdditionalKMLSettings);
	        //console.info(mykml)
	        return mykml;
	    }; // applyKMLayersSettings()

        // Setup event listeners for Save and Cancel buttons
        document.getElementById('btnKMLsave').onclick = function() {
        	//console.info(myKMLayers);
			myKMLayers.saveToLocalStorage();
	        if (KmLSync.hasSettingEnabled('&p')) KmLSync.upsyncSavedPresetsToGMFrom(myKMLayers); //Replaces presets saved in GM-space from current myKMLayers
        	myKMLayers = applyKMLayersSettings(myKMLayers);
			requestAnimationFrame(function(){updatePresetSwitcherMenu(getWazeMapLayersFromSwitcher(_W_map.layers));});

            if (myKMLayers.idx !== 100 && myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved) userResetOfLayersToSavedKMLayers(true);

        	allTooltipsCssEl.remove();
        	//console.info(myKMLayers);
        };

        document.getElementById('btnKMLcancel').onclick = function() {
            document.getElementById("KMLsettings").remove();
            var tempResetHolder = myKMLayers.reset;
            myKMLayers = getMyKMLayersObject();
            myKMLayers.reset = tempResetHolder;
            if (myKMLayers.idx !== 100) {
                updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
            } else {
                updateKMLayersSaveButton(NaN);
            }
            allTooltipsCssEl.remove();
        };
    };

    //======================================================================================
    //   KK  KK MM    MM LL         BBBBB   UU   UU TTTTTTT TTTTTTT  OOOOO  NN   NN  SSSSS
    //   KK KK  MMM  MMM LL         BB   B  UU   UU   TTT     TTT   OO   OO NNN  NN SS
    //   KKKK   MM MM MM LL         BBBBBB  UU   UU   TTT     TTT   OO   OO NN N NN  SSSSS
    //   KK KK  MM    MM LL         BB   BB UU   UU   TTT     TTT   OO   OO NN  NNN      SS
    //   KK  KK MM    MM LLLLLLL    BBBBBB   UUUUU    TTT     TTT    OOOO0  NN   NN  SSSSS
    //======================================================================================
    var kmlBetaProdToggleCheck = function() {
        //KmLSync._GM_refreshBetaAttribute();
        var kmlBetaToggleGM = KmLSync.getBetaTogValueFromGM(), //KmLSync._GM_CALLBACKS.beta,
            kmlBetaTogSet = KmLSync.hasSettingEnabled('&b');

        // Sync betaTog between prod & beta by relying on the existence of WMEKMLayers_Beta in GM scope
        switch (true) {
            case (!kmlBetaTogSet && kmlBetaToggleGM !== undefined): // if betaTog is not set, but GM var exists
                localStorage.WME_KMLSettings += '&b'; // then add the setting for betaTog to localStorage
                kmlBetaProdToggle(kmlBetaToggleGM); // and insert the betaTog -- let the function decide on its state
                setTimeout(function() {
                    if (document.getElementById(kmlElementMap.ids.betaRedirect) !== null)
                        document.getElementById(kmlElementMap.ids.betaRedirect).checked = true;
                }, 1000);
                break;
            case (kmlBetaTogSet && kmlBetaToggleGM === undefined): // if betaTog is set, but GM var does not exist
                localStorage.WME_KMLSettings = localStorage.WME_KMLSettings.replace('&b', ''); //then remove betaTog from settings and don't insert beta-tog
                KmLSync.deleteGM("WMEKMLayers_Beta");
                setTimeout(function() {
                    if (document.getElementById(kmlElementMap.ids.betaRedirect) !== null)
                        document.getElementById(kmlElementMap.ids.betaRedirect).checked = false;
                }, 1000);
                break;
            case (kmlBetaTogSet && kmlBetaToggleGM !== undefined): // otherwise, if betaTog set in localStorage and GM var exists,
                kmlBetaProdToggle(kmlBetaToggleGM); // insert the betaTog and determine state using GM var value
                break;
        }
    };

    var initKMLPageElements = function() {
        //kmllog('initKMLPageElements()');
        if (document.getElementById("layer-switcher-list") && document.getElementById("icnKMLsaveLayers") === null) {
		    if (myKMLayers === undefined) {
		    	myKMLayers = getMyKMLayersObject();
	        	kmllog('Check scope. Had to retrieve myKMLayers again from localStorage for initKMLPageElements().');
		    }

            kml[6] = 0; //reset counter
            var panelWidth = 560, //mapWidth = document.getElementById('WazeMap').clientWidth,
                kmlStyle = document.createElement("style"),
                kmlStyleCSS;

            // Create CSS container element
            kmlStyle.type = "text/css";
            kmlStyle.id = "cssKeepMyLayers";

            // CSS for KMLayers icons under Layers dropdown menu and etc
            kmlStyleCSS =
                'div.kml-icn { display: block; vertical-align: middle; padding: 9px 0px 0px; margin: 0px; border-top: 1px solid #D4E7ED; font-weight: bold; }\n' +
                '.kml-icn-nsave { font-weight: 400; color: #D36343 !important; }\n' +
                '.kml-icn-btn { position: relative; display: inline-block; float: right; padding-left: 2px; padding-right: 5px; color: #59899e; cursor: pointer;}\n' +
                '.fa-stack.kml-icn-btn { line-height: 1 !important; height: 11px !important; width: 18px !important;}\n' +
                'span.kml-icn-btn { padding: 0; margin: 0px 10px 10px 0px; }\n' +
                '.kml-icn>a:active, .kml-icn>a:focus, .kml-icn>a:hover, .kml-icn>a.active { text-decoration: none; background-image: none; outline: 0; -webkit-box-shadow: none; box-shadow: none; cursor: pointer; }\n' +
                '.kml-icn-off, .kml-icn-off:hover, .kml-icn-off:focus, .kml-icn>a.kml-icn-off, .kml-icn>a:link.kml-icn-off, .kml-icn>a:hover.kml-icn-off, .kml-icn>a.kml-icn-off:focus ' +
                '   { color: #B1D4DF !important; cursor: default !important; pointer-events: none; }\n';

            // CSS for friendly-PL icons
            kmlStyleCSS += `
                .kml-pl-container { height: 25px; width: 50px; position: absolute; bottom: 0; right: 0; line-height: 24px; margin-right: 15px; margin-left: -24px; padding-left: 2px; visibility: visible; pointer-events: auto; }
                .kml-pl-container a:link, .kml-pl-container a:active, .kml-pl-container a:focus { text-decoration: none; background-image: none; outline: 0; -webkit-box-shadow: none; box-shadow: none; }
                .kml-pl-container>.fa-stack { height: 25px; width: 25px; margin-left: -2px; line-height: inherit; }
                .kml-pl-container>.fa-stack .fa-circle { font-size: 26px; line-height: 25px; bottom: 0px; }
                .kml-pl-container>.fa-stack .fa-link { font-size: 16px; line-height: 25px; bottom: 0px; }
                .kml-pl-tooltipbox { max-width: 99%; right: 0; white-space: normal; word-wrap: break-word; word-break: break-all; bottom: 25px; visibility: visible; margin-right: 15px; color: white; font-size: 8pt; background-color: transparent; pointer-events: none; position: absolute; }
                .kml-pl-tooltipbox>div { padding: 5px; border-radius: 5px; background-color: black; }
                .street-view-mode .kml-pl-container, .street-view-mode .kml-pl-tooltipbox { right: 50% !important; }`;

            // CSS for KMLayers popup window panes
            kmlStyleCSS += `
                div.kml-panel-blackout { position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; }
                div.kml-panel-clear { position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background: transparent; z-index: 2001; }
                .kml-panel { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
                    width:` + panelWidth + `px; padding: 10px; margin: 0; overflow: visible !important; word-wrap: normal;
                    background-color: white; box-shadow: 0px 5px 20px #555555; border: 1px solid #858585; border-radius: 10px; }
                .kml-panel-section>.controls-container { position: relative; margin: 2px; padding: 0px 5px; border-radius: 5px; width: 100%; white-space: normal; }
                .kml-panel-section>.controls-container.kml-pref-help:hover { background-color: #EEE; }
                .kml-panel-section>.controls-container>input[type="checkbox"], .kml-panel-section>.controls-container>input[type="checkbox"]:checked { margin: 0 }
                .kml-panel-section>.controls-container>input[type="checkbox"]+label, .kml-panel-section>.controls-container>input[type="checkbox"]:checked+label { display: inline-block; max-width: 500px; word-wrap: normal; white-space: normal !important; line-height: 1.4; margin: auto; }
                .kml-panel-section>.controls-container>input[type="checkbox"]:not(:checked)+label:before, .kml-panel-section>.controls-container>input[type="checkbox"]:checked+label:before { top: 3px; }
                .kml-panel-section>.controls-container>input[type="checkbox"]:not(:checked)+label:after, .kml-panel-section>.controls-container>input[type="checkbox"]:checked+label:after {top: 4px;}
                .kml-panel-section ul.dropdown-menu.locales { max-height: 400px; overflow-y: auto;}
                .kml-panel h2 { margin-top: 10px; margin-bottom: 10px; font-size: 20pt; font-weight: bold; text-align: left; color: #C0C0C0; }
                div.kml-panel-section {display: block; font-size: 11pt; text-align: left; padding: 0px; }
                .kml-panel-hr { display: block; border: 0; height: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.3); margin-top: 8px; margin-bottom: 12px; }
                .kml-panel-btn { margin: 0px 5px 0px; padding: 0px 15px; display: inline-block; height: 32px; }
                div.kml-panel-btn { display: block; position: relative; padding: 0; width: 100%; margin: 15px 0px 8px; vertical-align: middle; }
                .kml-panel ul>li {padding-bottom: 4px}
                i.kml-pref-help { pointer-events: auto; color: #D0D0D0; margin-top: 3px; float: right; }
                i.kml-pref-help:hover, .kml-pref-help:focus, .kml-pref-help:active { color: #9a9a9a; }`;

            // CSS for Preset Switcher Menu
            // #toolbar .toolbar-button:hover:not(.ItemDisabled):not(:disabled) { background-color: transparent; }\n\
            // #kmlPresetSwitcher .dropdown-toggle {-webkit-box-shadow: none; box-shadow: none; }\n\
            var menuWidthVal = 170, menuHideDist, toolbarSepColor, menuHideDistTabbed;

            //if (KmLSync.isBeta) {
                menuHideDist = _$_('#toolbar').height() + 21 - menuWidthVal + 'px';
                toolbarSepColor = '#CFE5EC';
                menuHideDistTabbed = 18 - menuWidthVal + 'px';
            /*} else {
                menuHideDist = _$_('#layer-switcher-menu').width() + 20 - menuWidthVal + 'px';
                toolbarSepColor = '#A8CAD5';
                menuHideDistTabbed = 18 - menuWidthVal + 'px';
            }*/
            //
            kmlStyleCSS += '\
                .kml-usage-helper { right: 0px !important; border: 1px solid #DDD !important; background-color: #FFF !important; transition-delay: 0s; transition-duration: .3s; }\n\
                #kmlPresetSwitcher.dropdown ul.dropdown-menu, menu.kml-preset-menu-container.dropdown-menu>ul { display: block; opacity: 0; transition: opacity 0.1s linear 0s; pointer-events: none;}\n\
                #kmlPresetSwitcher.toolbar-separator, #kmlPresetSwitcher .toolbar-button { cursor: pointer; float: right; position: relative; top: 0px; right: 0px; margin: 0px; font-size: 18px !important; width: 20px !important; }\n\
                #kmlPresetSwitcher .toolbar-button:after { display: none; }\n\
                #kmlPresetSwitcher:hover .toolbar-button.kml-layers-icon {color: #6DA0B6;}\n\
                #kmlPresetSwitcher .kml-preset-menu.dropdown-toggle { border-left: 1px solid ' + toolbarSepColor + '; background-color: #BEDCE5; }\n\
                #kmlPresetSwitcher .toolbar-button.kml-layers-icon { line-height: 0; color: #58889E; width: 13px !important; height: 13px !important; right: 1px; top: 50%;}\n\
                #kmlPresetSwitcher .toolbar-button.kml-layers-icon:hover { color: #6DA0B6; cursor: pointer; }\n\
                #kmlPresetSwitcher .toolbar-button.kml-layers-icon:after, #kmlPresetSwitcher .toolbar-button.kml-layers-icon:before { left: 0px !important; right: 0px !important; width: 10px !important; }\n\
                #kmlPresetSwitcher .toolbar-button.kml-preset-menu:after, #kmlPresetSwitcher .toolbar-button.kml-preset-menu:before { display: none !important; }\n' +
                '.kml-layerbtn-block1 {width: 240%;display: block;height: 0;position: absolute;top: 55%;right: 100%;z-index: 3;}\n' +
                '.kml-layerbtn-block2 {width: 80%;display: block;height: 0;position: absolute;top: 0;right: 100%;z-index: 3;}\n' +
                '#kmlPresetSwitcher:hover .kml-layerbtn-block1 {height: 45%;}\n' +
                '#kmlPresetSwitcher:hover .kml-layerbtn-block2 {height: 100%;}\n';
 			kmlStyleCSS += '\
                 menu.kml-preset-menu-container.dropdown-menu { width: 330px; background: transparent; box-shadow: none; height: 95%; opacity: 1; position: relative; left: 0px; top: initial; overflow-x: hidden; overflow-y: visible; pointer-events: none; border: 0; }\n\
                 menu.kml-preset-menu-container, menu.kml-preset-menu-container>ul.dropdown-menu { z-index: 2; white-space: normal; border-radius: 0px;  margin: 0; padding: 0;}\n\
                 #kmlPresetSwitcher ul.kml-preset-menu>li { min-height: 35px; }\n\
                 #kmlPresetSwitcher ul.kml-preset-menu>li:last-child { min-height: 0; height: 0; }\n\
                 menu.kml-preset-menu-container>ul.dropdown-menu  { width: ' + menuWidthVal + 'px; pointer-events: auto; position: absolute; overflow-y: visible; border: 0; top: 0px;}\n\
                 menu.kml-preset-menu-container>ul.kml-preset-menu>li, #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu:hover>li, #kmlPresetSwitcher.kml-keep-open:hover menu.kml-preset-menu-container>ul.kml-preset-menu>li \
                 	{ position: relative; border-bottom: 2px solid #D4E7ED; color: #5A898F; cursor: pointer;}\n\
                 menu.kml-preset-menu-container li>a { font-size: 12px; letter-spacing: 0px; font-weight: 600; color: #5A898F; word-wrap: break-word; white-space: normal; padding: 10px 16px 10px 20px; background-color: #FFF; position: relative; }\n' +
                '#kmlPresetSwitcher menu.kml-preset-menu-container>ul.kml-preset-menu>li>a.kml-bugfix:hover, #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu>li>a.kml-bugfix:hover \
        			{ background-color: transparent; transition: all 0.15s !important;}\n' +
    			'menu>ul.kml-preset-menu>li>a.active, .kml-keep-open:hover menu>ul.kml-preset-menu>li>a.active \
    				{ opacity: 1; background-color: #DFECF0; }\n' + //#kmlPresetSwitcher.kml-keep-open menu>ul.kml-preset-menu:hover>li>a.active
    			'.kml-keep-open menu>ul.kml-preset-menu>li>a:active, .kml-keep-open menu>ul.kml-preset-menu>li>a.active, .kml-keep-open menu>ul.kml-preset-menu>li>a:focus \
    				{ background-color: rgba(212,231,237,0.5); }\n' +
                '#kmlPresetSwitcher .kml-preset.dropdown-item:focus { background-color: rgba(145, 166, 173, 0.5);}\n' +
                'ul.kml-preset-menu>li>a.kml-text-nsave, .kml-preset-menu>li>a.kml-text-nsave:hover { color: #D36343 !important; }\n' +
                '#kmlPresetSwitcher ul.kml-preset-menu>li:last-child, #kmlPresetSwitcher ul.kml-preset-menu>li:nth-last-child(2), #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu:hover>li:last-child, #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu:hover>li:nth-last-child(2), #kmlPresetSwitcher.kml-keep-open:hover menu.kml-preset-menu-container>ul.kml-preset-menu>li:last-child, #kmlPresetSwitcher.kml-keep-open:hover menu.kml-preset-menu-container>ul.kml-preset-menu>li:nth-last-child(2) \
                    { border: 0; }\n' +
                '.kml-menu-buffer-left { position: absolute; left: -15px; width: 0; height: 100%; cursor: default; }\n' +
                'ul:hover>.kml-menu-buffer {width: 15px;}\n' +
                '.kml-menu-buffer-left-bot { position: absolute; height: 30px; width: 100%; cursor: default; }\n';
            kmlStyleCSS += '\
                ul.kml-preset-menu .kml-menu-add { position: absolute; right: 3px; background-color: #BEDCE5; padding: 2px 10px 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.2), inset 0 4px 8px -4px rgba(0,0,0,0.2); border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; cursor: pointer; }\n' + //border-top: 1px solid rgba(221, 221, 221, 0.7);
				'.kml-color-tab {cursor: move; position: absolute; left: 0; top: -1px; bottom: -1px; box-shadow: inset 0px 1px 0px rgba(0,0,0,0.05), inset 0px -1px 0px rgba(0,0,0,0.05); opacity: 0.6; border: 1px solid rgba(0,0,0,0.05);}\n' +
                '.kml-color-tab, .kml-keep-open.kml-tabbed:hover .kml-color-tab, .kml-keep-open.kml-tabbed ul:hover>li .kml-color-tab, .kml-keep-open.kml-tabbed ul>li>a:hover .kml-color-tab {width: 13px;}\n' +
                '.kml-keep-open.kml-tabbed .kml-color-tab {width: 18px;}\n' +
				'.kml-colorpicker {left: 0; opacity: 0; transition: all 0.1s linear 0s; position: absolute; display: block; top: 1px; width: 112px; height: 35px; background-color: #FFF; outline: #FFF solid 2px; box-shadow: inset -1px -1px 0px rgba(0,0,0,0.1);}\n' +
				'.kml-colorpicker.open-drawer { left: -114px; opacity: 1; transition: all 0.2s linear 0s; }\n' +
				'.kml-colorpicker>.kml-colorpicker-row {display: block; opacity: 0.7; background-color: #FFF; height: 50%; width: 100%; }\n' +
				'.kml-colorpicker>.kml-colorpicker-row>span { float: left; width: 16.6%; height: 100%; }\n' +
				'#kmlPresetSwitcher .fa-trash { position: absolute; right: -18px; top: 12px; color: #92c2d1; cursor: pointer; opacity: 0.8; transition: right 0.3s linear .5s}\n' +
                '#kmlPresetSwitcher menu>ul.kml-preset-menu>li>a:hover .fa-trash {right: 8px;}\n' +
				'#kmlPresetSwitcher .fa-trash:hover { color: crimson; opacity: 1; cursor: pointer; transition-duration: 0.1s; }\n';
			kmlStyleCSS += '\
                .kml-keep-open-runonce menu.kml-preset-menu-container>ul.kml-preset-menu { pointer-events: auto; right: 0px; border: 1px solid #DDD; background-color: #FFF; }\n\
                #kmlPresetSwitcher.kml-keep-open .dropdown-toggle { background-color: #D4e7ed; -webkit-box-shadow: inset 0 3px 5px rgba(0,0,0,0.125); box-shadow: inset 0 3px 5px rgba(0,0,0,0.125); }\n\
    			.kml-keep-open .kml-color-tab { opacity: 0.5; }\n' +
                '#kmlPresetSwitcher.kml-keep-open:hover .kml-color-tab, #kmlPresetSwitcher.kml-keep-open ul:hover>li .kml-color-tab {opacity: 0.7}\n' +
				'#kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu \
					{ pointer-events: auto; opacity: 1; position: absolute; right: ' + menuHideDist + '; width: ' + menuWidthVal + 'px; background-color: rgba(255,255,255,0.5); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }\n' + //border: 1px solid rgba(221, 221, 221, 0.7);
                '#kmlPresetSwitcher.kml-keep-open.kml-tabbed menu.kml-preset-menu-container>ul.kml-preset-menu {right: ' + menuHideDistTabbed+ ';}\n' +
				'#kmlPresetSwitcher.kml-keep-open menu>ul.kml-preset-menu, .kml-keep-open menu>ul.kml-preset-menu>li, .kml-keep-open li>a:active, .kml-keep-open li>a.active, .kml-keep-open li>a:focus, .kml-keep-open .kml-color-tab \
					{ transition: all 1s linear 0.8s; }\n' +
                '#kmlPresetSwitcher.dropdown:hover ul.dropdown-menu, #kmlPresetSwitcher menu.kml-preset-menu-container.dropdown-menu>ul:hover { opacity: 1; transition: opacity 0.25s linear 0s; pointer-events: auto;}\n' +
			 	'.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu>li:active, .kml-keep-open ul.kml-preset-menu>li:focus, #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu:hover>li, #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu>li>a \
					{ opacity: 1; transition: all 0.1s;}\n' +
				'.kml-keep-open menu>ul.kml-preset-menu>li { border-bottom: 2px solid rgba(212,231,237,0.4) }\n' +
    			'.kml-keep-open menu>ul.kml-preset-menu a { background-color: transparent; color: inherit; }\n' + //menu>ul.kml-preset-menu>li>a:focus, .kml-keep-open menu>ul.kml-preset-menu>li>a:focus
				'#kmlPresetSwitcher.kml-keep-open menu>ul.kml-preset-menu:hover>li, #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu>li:hover, #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu:hover>li>a.active, #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu>li>a.active:hover, #kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu>li>a:hover, #kmlPresetSwitcher.dropdown:hover ul.dropdown-menu, .kml-keep-open .kml-preset-menu:hover .kml-color-tab \
					{ opacity: 1; transition: all 0.1s; }\n' + //#kmlPresetSwitcher.kml-keep-open ul.kml-preset-menu>li, #kmlPresetSwitcher.kml-keep-open ul.kml-preset-menu a
				'#kmlPresetSwitcher.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu:hover, #kmlPresetSwitcher.kml-keep-open:hover menu.kml-preset-menu-container>ul.kml-preset-menu \
					{ transition: all 0.2s linear 0.2s; right: 0px; background-color: #FFF; }\n' +
                '#kmlPresetSwitcher menu>ul.kml-preset-menu>li>a:hover, #kmlPresetSwitcher.kml-keep-open menu>ul.kml-preset-menu>li>a:hover, #kmlPresetSwitcher menu>ul.kml-preset-menu>li>a.active:hover, #kmlPresetSwitcher.kml-keep-open menu>ul.kml-preset-menu>li>a.active:hover \
    				{ background-color: #D4e7ed; color: #5A898F; transition-duration: 0.1s; transition-delay: 0s; }\n' + //#kmlPresetSwitcher menu>ul.kml-preset-menu>li:hover,
    			'#kmlPresetSwitcher.dropdown.kml-keep-open:hover menu>ul.kml-preset-menu>li>a>.kml-color-tab, #kmlPresetSwitcher.dropdown.kml-keep-open menu>ul.kml-preset-menu:hover>li>a>.kml-color-tab \
    			    { transition: width 0.2s, opacity 0.2s; }\n' +
                '#kmlPresetSwitcher.dropdown.kml-keep-open menu>ul.kml-preset-menu>li>a>.kml-color-tab \
                    { transition: width 0.5s linear 0.9s, opacity 0.1s linear 1s;}';
            kmlStyleCSS += '' +
                '#kmlPresetSwitcher menu>ul.kml-preset-menu.kml-dragging>li .kml-color-tab, #kmlPresetSwitcher menu>ul.kml-preset-menu.kml-dragging>li span { pointer-events: none; }\n' +
                '#kmlPresetSwitcher menu>ul.kml-preset-menu.kml-dragging>li .kml-preset {pointer-events: auto}\n' + //, #kmlPresetSwitcher menu>ul.kml-preset-menu>li, #kmlPresetSwitcher menu>ul.kml-preset-menu>li .kml-preset, #kmlPresetSwitcher menu>ul.kml-preset-menu>li .kml-color-tab
                '#kmlPresetSwitcher menu.kml-preset-menu-container>ul.kml-preset-menu.kml-dragging>li.kml-drag>a {opacity: 0.9 }\n' +
                '#kmlPresetSwitcher menu.kml-preset-menu-container>ul.kml-preset-menu.kml-dragging>li.kml-drag, #kmlPresetSwitcher menu.kml-preset-menu-container>ul.kml-preset-menu.kml-dragging>li.kml-drag>a, #kmlPresetSwitcher.kml-keep-open:hover menu.kml-preset-menu-container>ul.kml-preset-menu>li.kml-drag>a.active, #kmlPresetSwitcher menu.kml-preset-menu-container>ul.kml-preset-menu>li.kml-drag>a.active, #kmlPresetSwitcher.kml-keep-open menu>ul.kml-preset-menu>li.kml-drag, #kmlPresetSwitcher.kml-keep-open menu>ul.kml-preset-menu>li.kml-drag>a, #kmlPresetSwitcher.dropdown.kml-keep-open menu.kml-preset-menu-container>ul.kml-preset-menu>li.kml-drag>a:hover \
                    { background-color: rgba(0, 54, 77, 0.2); transition: all 0.2s linear 0s !important; }\n';

            //extra CSS fixes that bugged me...
            kmlStyleCSS += '#WMEFP-links :hover, #WMEFP-links :active, #WMEFP-links :focus { outline: 0; -webkit-box-shadow: none; box-shadow: none; }\n' +
                           '#WMEFP-links { max-height: 25px !important; }\n' +
                           '#wmefp-ctcttt { pointer-events: none; white-space: nowrap; }\n' +
                           '#panel-container>.panel { margin-left: 50px; }\n' +
                           '#layer-switcher-list { overflow-y: auto; overflow-x: hidden; max-height: 80vh;}\n' +
                           '#layer-switcher .dropdown-menu .reload-button { font-size: 1.3em; }\n' +
                           '#layer-switcher.kml-double-col menu.dropdown-menu { width: 560px;}\n' +
                           '#layer-switcher.kml-double-col .dropdown-menu .reload-button {position: absolute; right: 6px;}\n' +
                           '#layer-switcher.kml-double-col #layer-switcher-list { overflow-y: hidden; overflow-x: auto; -moz-column-count: 2; -moz-column-gap: 0px; -webkit-column-count: 2; -webkit-column-gap: 0px; column-count: 2; column-gap: 0px; -webkit-column-rule: 2px solid #F9F9F9; -moz-column-rule: 2px solid #F9F9F9; column-rule: 2px solid #F9F9F9; padding-bottom: 10px; }\n';

            kmlStyle.innerHTML = kmlStyleCSS;
            document.head.appendChild(kmlStyle);
            kmlStyleCSS = null;

            // Add save layers icon to Layers switcher dropdown panel
            var kmlDiv = document.createElement("div");
            kmlDiv.className = "kml-icn";
            kmlDiv.innerHTML = '\
                <a href="javascript:void(0)"><div class="fa-stack kml-icn-btn" id="icnKMLsaveLayers" style="margin-right: 2px;" data-toggle="tooltip" title="Save current set of layers"><div class="fa fa-save fa-stack-1x"></div><div id="iKMLnotSaved" class="fa fa-plus-circle fa-stack-1x" style="font-size: 10px; margin: -3px -5px 3px 5px; text-shadow: 1px -1px 0px white, 2px -2px 0px white; color: crimson; visibility: hidden;"></div></div></a>\
                <a href="javascript:void(0)"><div id="icnKMLsettings" class="fa fa-cog kml-icn-btn" data-toggle="tooltip" title="KeepMyLayers preferences"></div></a>\
                <a href="javascript:void(0)"><div id="icnKMLresetLayers" class="fa fa-magic kml-icn-btn" data-toggle="tooltip" title="Reset layers to saved presets"></div></a>\
                <div id="icnKMLtempUndo" class="fa fa-eye kml-icn-btn kml-icn-off" data-toggle="tooltip" title="Toggle layers from permalink"></div>\
                <div id="icnKMLDblCol" class="fa fa-columns kml-icn-btn" data-toggle="tooltip" title="Switch to single/double-column layout"></div>\
                <div id="divKMLlayerName" style="cursor: default; margin-bottom: -4px; padding-left: 14px; color: #93c4d3; line-height: 1;"></div>';


            document.getElementById("layer-switcher-list").parentNode.insertBefore(kmlDiv, document.getElementById("layer-switcher-list").nextSibling);

            //--------------------------------
            // LAYER PRESETS DROPDOWN MENU
            //--------------------------------
            var mapHeight = _$_('#WazeMap').css('height'),
            mapHeight = parseInt(mapHeight.substring(0,mapHeight.length-2)) + 'px';

            window.addEventListener('resize', function(){
                setTimeout(function(){
                    var mapHeight = _$_('#WazeMap').css('height');
                    mapHeight = parseInt(mapHeight.substring(0,mapHeight.length-2)) + 'px';
                    document.querySelector('menu.kml-preset-menu-container').style.height = mapHeight;
                },3000);
            });

            kmlDiv = document.createElement("div");
            kmlDiv.id = 'kmlPresetSwitcher'
            kmlDiv.className = "btn-group dropdown toolbar-separator";
            kmlDiv.style.height = '100%';
            kmlDiv.innerHTML = '<span class="kml-layerbtn-block1"></span><span class="kml-layerbtn-block2"></span>' +
                '<div style="position: absolute; right: 0; top: 0; height: 100%; pointer-events: none; width: 100%;">' +
                '<div class="toolbar-button toolbar-separator kml-preset-menu dropdown-toggle" data-toggle="dropdown">' +
                '<i class="toolbar-button kml-layers-icon fa fa-caret-down fa-lg"></i>' +
                '</div>' +
                '<menu class="kml-preset-menu-container dropdown-menu pull-right dropdown-menu-right" style="height: ' + mapHeight +'">' +
                '<ul class="kml-preset-menu dropdown-menu pull-right dropdown-menu-right">' +
                '<li style="padding: 10px; height: auto;">' +
                    'This is the Preset Switcher menu for KeepMyLayers. ' +
                    'To save your first preset, select some layers under the Layers menu and click on the save icon in the bottom corner.' +
                '</li>' +
                '</ul></menu></div>';

            //if (KmLSync.isBeta) {
                document.getElementById('layer-switcher').parentNode.appendChild(kmlDiv, document.getElementById("layer-switcher"));
                document.querySelector('.controls-container.dropdown-menu').style.right = '20px';
                document.querySelector('.kml-layers-icon.fa-caret-down').style.margin = '-6px -1px';
            /*} else {
                document.getElementById('layer-switcher').parentNode.insertBefore(kmlDiv, document.getElementById("layer-switcher"));
            }*/

            //==============================================================================
            // ADDITIONAL LAYER RESETTINGS
            if (myKMLayers && myKMLayers.SAVED_PRESETS && myKMLayers.SAVED_PRESETS.length) {
                // CHECK FOR DELAYED LAYERS
                try {
                    var tryUpdatingLayerNamesAgain = updatePresetSwitcherMenu();
                } catch (err) { console.debug('catch 2'); console.error(err); }

                    if (tryUpdatingLayerNamesAgain) {
                        //kmllog('Trying to update layers set menu again in 3 seconds...')
                        setTimeout(function() {
                            try {
                                kml_layerSwitcher = getWazeMapLayersFromSwitcher(_W_map.layers);
                                tryUpdatingLayerNamesAgain = updatePresetSwitcherMenu(kml_layerSwitcher);
                            } catch (err) {
                                console.warn(err);
                            }
                        }, 3000);
                    }
                    if (myKMLayers.idx !== 100) {
                        updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
                    } else {
                        updateKMLayersSaveButton(NaN);
                    }
            } else {
                if (myKMLayers.idx !== 100) {
                    updateKMLayersSaveButton(myKMLayers.SAVED_PRESETS[myKMLayers.idx].saved);
                } else {
                    updateKMLayersSaveButton(NaN);
                }
            }


            //==============================================================================
            // Event listeners for buttons under layer menu
            document.getElementById("icnKMLsaveLayers").onclick = saveKMLayers;
            document.getElementById("icnKMLsettings").onclick = showKMLPrefsPanel;
            document.getElementById("icnKMLresetLayers").onclick = userResetOfLayersToSavedKMLayers;
            document.getElementById("icnKMLDblCol").onclick = function(){
                if (document.getElementById('layer-switcher').classList.toggle('kml-double-col')) {
                    KmLSync.addThisSettingToLS('&d');
                    KmLSync.upsyncAllPreferencesFromLSToGM();
                } else {
                    KmLSync.removeThisSettingFromLS('&d');
                    KmLSync.upsyncAllPreferencesFromLSToGM();
                }
            };

            if (KmLSync.hasSettingEnabled('&d')) {
                document.getElementById('layer-switcher').classList.add('kml-double-col');
            }

            try {
                _$_(".kml-icn-btn[data-toggle=tooltip]").tooltip(); //{	placement: 'bottom'	}
            } catch(err) {}

            //------------------ Setup event listeners -------------------
            // Setup event listener for stay open dropdown
            //
            document.getElementById('kmlPresetSwitcher').onclick = function(e) {
                //console.debug('click - #kmlPresetSwitcher');
                if (e.target === this || e.target === document.querySelector('.kml-preset-menu.dropdown-toggle')) {
                	if (this.classList.toggle('kml-keep-open')) this.classList.remove('open');
                }
            };

            document.querySelector('.kml-preset-menu.dropdown-toggle').onclick = function(e) {
                //console.debug('click - .kml-preset-menu.dropdown-toggle');
                if (e.target === this || e.target === document.getElementById('kmlPresetSwitcher')) {
            	    updatePresetSwitcherMenu(getWazeMapLayersFromSwitcher(_W_map.layers));
                }
            };
            if (KmLSync.hasSettingEnabled('&t')) {
                document.getElementById('kmlPresetSwitcher').classList.add('kml-tabbed');
                //if (KmLSync.isBeta) {
                    document.querySelector('.olControlPanZoomBar').style.left = '10px';
                    document.querySelector('.olControlPanZoomBar').style.right = 'auto';
                //}
            }

            // Doubleclick layer menu shortcut for KMLayers preferences panel
            if (document.getElementById("layer-switcher-menu") !== null) {
                document.getElementById("layer-switcher-menu").ondblclick = showKMLPrefsPanel;
            } else {
                document.getElementsByClassName("waze-icon-layers")[0].ondblclick = showKMLPrefsPanel;
            }

            //-------------------------------------------------------------
            // If set, insert beta/prod toggle
            requestAnimationFrame(kmlBetaProdToggleCheck);

            // If set, insert regular simple PL (for all editors)
            if (KmLSync.hasSettingEnabled('&r')) requestAnimationFrame(initSimplePermalink);

        } else if (document.getElementById("icnKMLsaveLayers") !== null) {
            kml[6] = 0;
            return true; //icons already inserted into page
        } else if (kml[6]++ < 30) {
            setTimeout(initKMLPageElements, 200 + (kml[6] * 50));
        } else {
            console.warn('WMEKmL:',
                'Unable to insert WME KeepMyLayers under Layers menu.',
                'Element #layer-switcher-list not found on page.')
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    //kmllog('Loading page elements...');
    initKMLPageElements();

    //Waze.map.events.register("changelayer", Waze.map, dosomething);
    //Waze.map.events.register("visibilitychanged", Waze.map, dosomething);
    window.addEventListener("beforeunload", function() {
        myKMLayers.setSessionPresetIdx();
        console.info(myKMLayers);
		myKMLayers = KmLSync.mergeLocalStorageToMyKmLObj(myKMLayers); //merge, while favoring current myKMLayers
        //if (KmLSync.hasSettingEnabled('&p')) KmLSync.upsyncSavedPresetsToGMFrom(myKMLayers); //comment out for now... all presets should be upsynced already during the appropriate steps
    }, false);

    ////////////////////////////////////////////////////////////////////////////
    // ~~~ TEMP (clean-up) ~~~
    localStorage.removeItem("WME_KML_Settings");
    localStorage.removeItem("WME_KeepMyLayers_lF");
    localStorage.removeItem("WME_KeepMyLayers_lV");
    GM_deleteValue("WMEKML_Beta");
    GM_deleteValue("WMEKML_Lang");
    //kmllog('Done performing cleanup')

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //          NN   NN  OOOOO  TTTTTTT IIIII  CCCCC  EEEEEEE  SSSSS
    //          NNN  NN OO   OO   TTT    III  CC   CC EE      SS
    //          NN N NN OO   OO   TTT    III  CC      EEEEE    SSSSS
    //          NN  NNN OO   OO   TTT    III  CC   CC EE           SS
    //          NN   NN  OOOO0    TTT   IIIII  CCCCC  EEEEEEE  SSSSS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //-------------------------------------------------------------------------
    //  Update Popup Notice
    //-------------------------------------------------------------------------
    var kmlNoticePanel = function(kmlPanelType, kmlVersion, kmlNoticeText, kmlForumURL) {
        var kmlNoticeUIEl = document.createElement("div");
        kmlNoticeUIEl.id = "divKMLnotice";
        kmlNoticeUIEl.innerHTML =
            '<i id="iKMLnotice" class="fa fa-exclamation-circle fa-4x pull-left"></i>' +
            '<h2>WME KMLayers Update</h2>' +
            '<hr class="kml-panel-hr">';
        kmlNoticeUIEl.innerHTML +=
            '<div class="kml-panel-section" style="font-size: 10.1pt">' +
            kmlNoticeText +
            '</div>' +
            '<div style="margin-top: 6px; font-size: 10.1pt">' +
            'For details and screenshots of new features, please visit the forum post <a href="' + kmlForumURL + '" target="_blank">here</a>.' +
            '</div>' +
            '<div style="margin-top:10px; font-size: 8pt;"> ' +
            'Note: This is a one-time alert for WME KMLayers v. ' + kmlVersion +
            '</div>';
        kmlNoticeUIEl.innerHTML += '<hr class="kml-panel-hr">' +
            '<div style="position: relative; width: 70px; display: block; left: 148px; bottom: 0px; margin: 10px; vertical-align: middle; padding: 0">' +
            '<button id="btnKMLokay" style="width: 70px" class="btn btn-primary kml-panel-btn">OK</button></div>' +
            '</div>';

        switch (kmlPanelType) {
            case "child": //requires also opening the settings panel beforehand
                kmlNoticeUIEl.className = "kml-panel";
                kmlNoticeUIEl.style.width = "500px";
                kmlNoticeUIEl.style.height = "270px";
                document.getElementsByClassName("kml-panel")[0].appendChild(kmlNoticeUIEl);
                break;
            case "blackout":
                kmlNoticeUIEl.innerHTML = '<div class="kml-panel" style="width: 420px; padding-left: 15px; padding-right: 15px;">' +
                    kmlNoticeUIEl.innerHTML;
                kmlNoticeUIEl.innerHTML += '</div>';
                kmlNoticeUIEl.className = "kml-panel-blackout"
                document.getElementById("map").appendChild(kmlNoticeUIEl);
                break;
            case "clear":
                kmlNoticeUIEl.innerHTML = '<div class="kml-panel" style="width: 420px; padding-left: 15px; padding-right: 15px;">' +
                    kmlNoticeUIEl.innerHTML;
                kmlNoticeUIEl.innerHTML += '</div>';
                kmlNoticeUIEl.className = "kml-panel-clear"
                document.getElementById("map").appendChild(kmlNoticeUIEl);
                break;
        }

        document.getElementById('btnKMLokay').onclick = function() {
            document.getElementById('divKMLnotice').remove();
            localStorage.WME_KMLUsageHelper += '&v' + KMLayersVersion.currentVersion;
        };
    };

    //-------------------------------------------------------------------------
    //if (!~localStorage.WME_KMLSettings.indexOf('&')) showKMLPrefsPanel();
    /*if (!~localStorage.WME_KMLSettings.indexOf('&' + minKMLVersion)) { //Display update notice
        var kmlNoticeText, kmlForumURL = "https://www.waze.com/forum/viewtopic.php?f=819&t=172335&p=1304954#p1304954";

        kmlNoticeText = 'Woohoo! The update to version 0.4 brings you the following new beta features and bug-fixes:<p>' +
            '<ul><li>Thanks to rickzabel\'s help, the bug that caused part of the URL to repeat itself <i>ad infinitum</i> has been found and squashed</li>' +
            '<li>Double-click on the beta/prod toggle to quickly disable/enable</li>' +
            '<li>Alt-editor permalink added to bottom right corner</li>' +
            '<li>Within the preference pane, you can now add additional layer presets to accommodate various editing contexts </li>' +
            '<li>Double-click on the WME Layer menu icon for easy access to the KMLayers preference pane</li>' +
            '</ul>';

        kmlNoticePanel("blackout", minKMLVersion, kmlNoticeText, kmlForumURL);
    }*/

    setTimeout(function() {
        KMLayersUsageHelper('layer_presets_runonce', myKMLayers.runonce);
        KMLayersUsageHelper('stay_open_dropdown_menu', KmLSync.hasSeenKMLPopup('&m'))
    }, 1000);

};


////////////////////////////////////////////////////////////////////////////
function waitForWazeMap_KMLayers() {
    var waitCount = 0,
        maxWait = 50; //60++ seconds
    //kmllog('Waiting for Waze...', '/');
    var tryInit_KMLayers = function() {
        try {
            if (waitCount < maxWait &&
                "undefined" !== typeof(unsafeWindow) && unsafeWindow.$ &&
                unsafeWindow.Waze && unsafeWindow.I18n &&
                unsafeWindow.Waze.map && unsafeWindow.Waze.model &&
                unsafeWindow.Waze.map.layers && unsafeWindow.Waze.model.repositoryFilters &&
                unsafeWindow.I18n.translations
            ) {
                // Check for login
                if (document.getElementById('user-details') === null) {
                    setTimeout(tryInit_KMLayers, 1000);
                    // Do not increment wait counter... wait is indefinite
                } else {
                    kmllog('Found Waze objects. Attempting to load page add-ons.');
                    KeepMyLayers();
                }

            } else if (waitCount++ < maxWait) {
                setTimeout(tryInit_KMLayers, 50 * waitCount);
            } else {
                console.error(
                    'WMEKmL:',
                    'WME KeepMyLayers failed to load. :(');
            }
        } catch (err) {
            setTimeout(tryInit_KMLayers, 500);
            kmllog('[' + ++waitCount + ']:', 'ruh roh...'); //for catching returns due to an undetected error
            if (waitCount===maxWait) console.error(err);
        }
    };

    tryInit_KMLayers();
}

////////////////////////////////////////////////////////////////////////////
var isReady = false;
document.onreadystatechange = function() {
    //kmllog('<' + document.readyState + '>', '/');
    if (!isReady) {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            isReady = true;
            //kmllog('Inside DOM interactive event interval.', '/');
            requestAnimationFrame(waitForWazeMap_KMLayers);
        }
    }
};
