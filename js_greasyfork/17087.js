// ==UserScript==
// @name            WME Context Menu
// @namespace       https://greasyfork.org/users/30701-justins83-waze
// @version         2022.01.27.01
// @description     A right-click popup menu for editing segments. Currently integrates with WME Speedhelper and Road Selector to help make it even easier and faster to edit the map.
// @author          TheLastTaterTot
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/editor*
// @include         https://beta.waze.com/*/editor*
// @exclude         https://www.waze.com/user/editor*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/17087/WME%20Context%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/17087/WME%20Context%20Menu.meta.js
// ==/UserScript==

/* global $ */
/* global W */
/* global OL */
/* global require */
/* global I18n */
/* ecmaVersion 2017 */
/* global _ */
/* eslint curly: ["warn", "multi-or-nest"] */

//--------------- DEBUG ----------------
var DEBUG = false;
function cmlog() {
    if (DEBUG) {
	    var debugStyle, debugCode,
	    	args = arguments,
	        argArray = Object.keys(args).map(function(key) {
	            return args[key];
	        });
	        if (argArray[0].constructor === Array) {
	        	debugStyle = argArray[0][1];
	        	debugCode = parseInt(argArray[0][0]);
	        }

	    if (debugCode === DEBUG) {
	    	argArray = argArray.splice(1);
            let logCss = '';
	    	switch (debugStyle) {
	    		case 1: // examine functions
	    			logCss = 'background: #444; color: #6FF';
	    			break;
	    		case 2: // examine eventListeners
	    			logCss = 'background: #CCC; color: #048';
	    			break;
	    		default:
	    			logCss = 'background: #EEE; color: #000; font-weight: bold;';
	    	}

	    	console.debug('%cWMECM: %s', logCss, argArray.join(' '));
	    }
	}
}
//------------------------------------------------------------------------------
var SL = {
    forceBuildNewMenu: true,
    menuResetEvent: true,
    imperial: {
        mphCountries: ['UK', 'US', 'MU', 'AR', 'IC', 'JE', 'GQ', 'CJ', 'BM', 'LI'],
        mph2kph: 1.609344,
        kph2mph: 0.621371192,
        useMPH: null,
        convertUnits: null,
        currentCountry: null
        },
    slSavedMaxElementTotal: 0,
    slSavedMenuElementFlags: false,
    cmMenuContentHTML: null,
    signsContainerHTML: null,
    speedhelperIsPresent: null,
    signsContainerHeight: null
};

var roadTypes = {
        1: "Street",
        2: "Primary Street",
        3: "Freeway",
        4: "Ramp",
        5: "Walking Trail",
        6: "Major Highway",
        7: "Minor Highway",
        8: "Dirt road / 4X4 Trail",
        10: "Pedestrian Boardwalk",
        15: "Ferry",
        16: "Stairway",
        17: "Private Road",
        18: "Railroad",
        19: "Runway/Taxiway",
        20: "Parking Lot Road"
    },
    menuResetEvent_RSel = false,
    contextMenuSettings,
    changeEvent = new Event('change', { 'bubbles': true }),
    focusOut = new Event('focusout', {'bubbles':true}),
    isFirefox = !!~navigator.userAgent.indexOf('irefox'),
    minVersion = '0.3.6';

var ABOrig = {
    Orig: null,
    ANode: null,
    BNode: null
};

var ANodeUturn = null;
var BNodeUturn = null;

try {
	if (isFirefox && localStorage.WME_ContextMenuFF) {
		window.alert('WME Context Menu has been updated to be fully functional in FireFox.\n\nThank you for your patience!');
	    localStorage.removeItem('WME_ContextMenuFF');
	}
} catch(err) {}

//------------------------------------------------------------------------------
if (localStorage.WME_ContextMenu) {
    contextMenuSettings = JSON.parse(localStorage.WME_ContextMenu);
    if (contextMenuSettings.hidden === undefined) {
        contextMenuSettings.hidden = {};
        localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
    }
} else {
    contextMenuSettings = {
        clipboard: 0,
        position: 0,
        pin: false,
        countries: [],
        speedSigns: {default: {
                        speeds: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130],
                        signShape: 'Circle',
                        signBorderColor: '#34444B'
                    }},
        speedhelper: {},
        version: 0,
        hidden: {}
    };
    localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
}

//------------------------------------------------------------------------------
var CMenuVersion = {
    currentVersion: GM_info.script.version,
    lastVersionString: function(){return contextMenuSettings.version;},
    convertToNumericVersion: function(versionString) {
        var vMult = [8000, 400, 20, 1],
            versionNumeric = 0;

        if (versionString) {
            if (versionString.constructor === Array) {
                if (versionString.length === 1)
                    versionString = versionString[0];
                else
                    console.error('WMECM:', 'versionString is an array with more than 1 element.');
            }
            return versionString.match(/(\d)+/g).map(function(d, i) {
                versionNumeric += d * vMult[i];
            }), versionNumeric;
        }
        else
            return null;
    },
    getLastVersionValue: function() {
        return this.convertToNumericVersion(this.lastVersionString());
    },
    updateVersionString: function() {
    	contextMenuSettings.version = this.currentVersion;
        localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
    },
    isUpToDate: function(minimumVersionString) {
        var minVersionVal = this.convertToNumericVersion(minimumVersionString),
            lastVersionVal = this.getLastVersionValue();
        return (lastVersionVal >= minVersionVal) ? true : false;
    }
};
//------------------------------------------------------------------------------
if (!CMenuVersion.isUpToDate(minVersion)) {
    if (contextMenuSettings.speedSigns === undefined) {
        contextMenuSettings.speedSigns = {default: {
                        speeds: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130],
                        signShape: 'Circle',
                        signBorderColor: '#34444B'
                    }};

        contextMenuSettings.speedhelper = {};
        localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);

        //---------- TEMP -------------
        if (localStorage.contextMenuSettings) localStorage.removeItem('contextMenuSettings');
    }
    //CMenuVersion.updateVersionString(minVersion);
}
//------------------------------------------------------------------------------

////////////////////////////////////////////////////////////////////////////////////////////////
var getUnique = function (objArray) {
    var isNotDuplicate = function (comparisonList, checkThisName) {
        var isNotDup = true;
        try {
            for (var c = 0, cLength = comparisonList.length; c < cLength; c++)
                if (comparisonList[c] === checkThisName) isNotDup = false;
        } catch (err) {
            console.error(err);
        }
        return isNotDup;
    };

    try {
        var uniqObjs = [];
        for (var r = objArray.length; r--;)
            if (isNotDuplicate(uniqObjs, objArray[r])) uniqObjs.push(objArray[r]); // && objArray[r] !== ''
        return uniqObjs;
    } catch (err) {
        console.error(err);
    }
};

//----------------------------------------------------------------------
var addPasteItems = function(attrName) {
    if (/primaryStreet|primaryCity/.test(attrName)) {
        let clipboard = document.getElementById('input_' + attrName);
        if (clipboard) {
            let pasteOption = document.createElement('dd');
            pasteOption.className = 'cm-paste';
            pasteOption.innerHTML = clipboard.value;
            pasteOption.name = clipboard.value;

            $('#' + attrName + ' .cm-paste').remove();

            if (document.querySelector('#' + attrName + '>dd'))
                document.getElementById(attrName).insertBefore(pasteOption, document.querySelector('#' + attrName + '>dd'));
            else
                document.getElementById(attrName).appendChild(pasteOption);
            pasteOption.addEventListener('click', function(e) { pasteTo(e, this.parentNode.id, this.name); }, false);
        }
    }
};

var pasteTo = function (e, opt, val) {
    try { // (temporary) really dumb way via DOM nodes:
        switch (opt) {
            case 'cm_primaryStreet':
                $('.full-address').click();
                $('#emptyStreet').prop('checked',false).change();
                $('.form-control.streetName').val(val).change();
                if (!$('.form-control[name=cityName]').val().length) $('#emptyCity').prop('checked',true).change();
                if ($('.form-control[name=stateID]').length) $('.form-control[name=stateID]').val(W.model.states.top.id);
                if ($('.form-control[name=countryID]').length) $('.form-control[name=countryID]').val(W.model.countries.top.id);
                $('.action-buttons>.save-button').click();
                break;
            case 'cm_primaryCity':
                $('.full-address').click();
                $('#emptyCity').prop('checked',false).change();
                $('.form-control[name=cityName]').val(val).change();
                if (!$('.form-control.streetName').val().length) $('#emptyStreet').prop('checked',true).change();
                if ($('.form-control[name=stateID]').length) $('.form-control[name=stateID]').val(W.model.states.top.id);
                if ($('.form-control[name=countryID]').length) $('.form-control[name=countryID]').val(W.model.countries.top.id);
                $('.action-buttons>.save-button').click();
                break;
            /*case 'cm_state':
                var $selState = $('.form-control[name=stateID]>option');
                $selState.map(function(i,opt){ console.info(opt.text); if (opt.text === val) opt.prop('selected','') });
                break;*/
        }
    } catch(err) { console.error(err); }
};

var getTopCityName = function() {
	return W.model.cities.objects[W.model.segments.topCityID].name;
};

//----------------------------------------------------------------------
var addStreetAndCityToRSel = function (segIds, caseSelection) {
    var opAndOr = parseInt(document.getElementById('cmOpAddOr').value),
        opNot = document.getElementById('cmOpNot').classList.contains('active'),
        addConjunction = !!document.getElementById('outRSExpr').innerHTML.length, s;

    switch (caseSelection ^ 0) {
        case 'primaryStreet':
        case 0:
            if (segIds.primaryStreet.length !== 0) {
                for (s = segIds.primaryStreet.length; s--;) {
                    if (addConjunction) {
                        if (opAndOr)
                            document.getElementById('btnRSOr').click();
                        else
                            document.getElementById('btnRSAnd').click();
                    }
                    if (opNot) document.getElementById('btnRSNot').click();
                    //set to primary
                    document.getElementById('selRSAlttStreet').value = 0;
                    document.getElementById('selRSAltCity').value = 0;

                    document.getElementById('btnRSLBkt').click();
                    document.getElementById('inRSStreet').value = W.model.streets.objects[segIds.primaryStreet[s]].name;
                    document.getElementById('btnRSAddStreet').click();
                    //document.getElementById('btnRSAnd').click();
                    document.getElementById('inRSCity').value = W.model.cities.objects[W.model.streets.objects[segIds.primaryStreet[s]].cityID].name;
                    document.getElementById('btnRSAddCity').click();
                    document.getElementById('btnRSRBkt').click();
                }
            }
            break;
        case 'altStreets':
        case 1:
            if (segIds.altStreets.length !== 0) {
                for (s = segIds.primaryStreet.length; s--;) {
                    if (addConjunction) {
                        if (opAndOr) {
                            document.getElementById('btnRSOr').click();
                        } else {
                            document.getElementById('btnRSAnd').click();
                        }
                    }

                    if (opNot) document.getElementById('btnRSNot').click();
                    //set to alt
                    document.getElementById('selRSAlttStreet').value = 1;
                    document.getElementById('selRSAltCity').value = 1;

                    document.getElementById('btnRSLBkt').click();
                    document.getElementById('inRSStreet').value = W.model.streets.objects[segIds.altStreets[s]].name;
                    document.getElementById('btnRSAddStreet').click();
                    //document.getElementById('btnRSAnd').click();
                    document.getElementById('inRSCity').value = W.model.cities.objects[W.model.streets.objects[segIds.altStreets[s]].cityID].name;
                    document.getElementById('btnRSAddCity').click();
                    document.getElementById('btnRSRBkt').click();
                }
            }
            break;
        case 'anyStreet':
        case 2:
            addStreetAndCityToRSel(segIds, 0); //primary
            addStreetAndCityToRSel(segIds, 1); //alt
            break;
    }
};

var addStreetNameToRSel = function (segNames, inputFieldId, altSelId, altVal, addBtnId) {
    var opAndOr = parseInt(document.getElementById('cmOpAddOr').value),
        opNot = document.getElementById('cmOpNot').classList.contains('active'),
        addConjunction = !!document.getElementById('outRSExpr').innerHTML.length;

    for (var n = 0, nLength = segNames.length; n < nLength; n++) {
        if (addConjunction) {
            if (opAndOr)
                document.getElementById('btnRSOr').click();
            else
                document.getElementById('btnRSAnd').click();
        }
        if (opNot) document.getElementById('btnRSNot').click();

        document.getElementById(inputFieldId).value = segNames[n];
        document.getElementById(altSelId).value = altVal ^ 0;
        document.getElementById(addBtnId).click();
        addConjunction = true;
    }
};

var addRoadTypeToRSel = function (ids, inputFieldId, addBtnId) {
    var opAndOr = parseInt(document.getElementById('cmOpAddOr').value),
        opNot = document.getElementById('cmOpNot').classList.contains('active'),
        addConjunction = !!document.getElementById('outRSExpr').innerHTML.length;

    document.getElementById('btnRSLBkt').click();
    for (var n = 0, nLength = ids.length; n < nLength; n++) {
        if (addConjunction) {
            if (opAndOr)
                document.getElementById('btnRSOr').click();
            else
                document.getElementById('btnRSAnd').click();
        }
        if (opNot) document.getElementById('btnRSNot').click();

        document.getElementById(inputFieldId).value = ids[n];
        document.getElementById(addBtnId).click();
        addConjunction = true;
    }
    document.getElementById('btnRSRBkt').click();
};

var copyToClipboard = function(id,str) {
    var $hiddenText;
    if (!document.getElementById('input_' + id)) {
        $hiddenText = $('<input>');
        $hiddenText.prop('id','input_' + id);
        $hiddenText.css('position','fixed');
        $hiddenText.css('top','-100px');
        $hiddenText.css('left','-1000px');
        $hiddenText.css('opacity',0);
        $("body").append($hiddenText);
    } else
        $hiddenText = $('#input_' + id);
    $hiddenText.val(str).select();
    document.execCommand("copy");
    //$temp.remove();
};

var copyTo = function (e, opt, val) {
    if (document.getElementById('cmPinMenu').value) e.stopPropagation();

    if (document.getElementById('cmClipboard').value) {
        copyToClipboard(opt,val);
        if (document.getElementById('cmPinMenu').value) addPasteItems(opt);
    } else {
        try {
            switch (opt) {
                case 'cm_priSC':
                    if (document.getElementById('cmRoadType').classList.contains('active')) {
                        addRoadTypeToRSel(getUnique(val.roadType), 'selRSRoadType', 'btnRSAddRoadType');
                        document.getElementById('btnRSAnd').click();
                        document.getElementById('btnRSLBkt').click();
                        addStreetAndCityToRSel(val, 0);
                        document.getElementById('btnRSRBkt').click();
                    } else
                        addStreetAndCityToRSel(val, 0);
                    break;
                case 'cm_altSC':
                    if (document.getElementById('cmRoadType').classList.contains('active')) {
                        addRoadTypeToRSel(getUnique(val.roadType), 'selRSRoadType', 'btnRSAddRoadType');
                        document.getElementById('btnRSAnd').click();
                        document.getElementById('btnRSLBkt').click();
                        addStreetAndCityToRSel(val, 1);
                        document.getElementById('btnRSRBkt').click();
                    } else
                        addStreetAndCityToRSel(val, 1);
                    break;
                case 'cm_anySC':
                    if (document.getElementById('cmRoadType').classList.contains('active')) {
                        addRoadTypeToRSel(getUnique(val.roadType), 'selRSRoadType', 'btnRSAddRoadType');
                        document.getElementById('btnRSAnd').click();
                        document.getElementById('btnRSLBkt').click();
                        addStreetAndCityToRSel(val, 2);
                        document.getElementById('btnRSRBkt').click();
                    } else
                        addStreetAndCityToRSel(val, 2);
                    break;
                case 'cm_priS':
                    if (document.getElementById('cmRoadType').classList.contains('active')) {
                        addRoadTypeToRSel(getUnique(val.roadType), 'selRSRoadType', 'btnRSAddRoadType');
                        document.getElementById('btnRSAnd').click();
                        document.getElementById('btnRSLBkt').click();
                        addStreetNameToRSel(getUnique(val.primaryStreet), 'inRSStreet', 'selRSAlttStreet', 0, 'btnRSAddStreet');
                        document.getElementById('btnRSRBkt').click();
                    } else
                        addStreetNameToRSel(getUnique(val.primaryStreet), 'inRSStreet', 'selRSAlttStreet', 0, 'btnRSAddStreet');
                    break;
                case 'cm_altS':
                    if (document.getElementById('cmRoadType').classList.contains('active')) {
                        addRoadTypeToRSel(getUnique(val.roadType), 'selRSRoadType', 'btnRSAddRoadType');
                        document.getElementById('btnRSAnd').click();
                        document.getElementById('btnRSLBkt').click();
                        addStreetNameToRSel(getUnique(val.altStreets), 'inRSStreet', 'selRSAlttStreet', 1, 'btnRSAddStreet');
                        document.getElementById('btnRSRBkt').click();
                    } else
                        addStreetNameToRSel(getUnique(val.altStreets), 'inRSStreet', 'selRSAlttStreet', 1, 'btnRSAddStreet');
                    break;
                case 'cm_anyS':
                    if (document.getElementById('cmRoadType').classList.contains('active')) {
                        addRoadTypeToRSel(getUnique(val.roadType), 'selRSRoadType', 'btnRSAddRoadType');
                        document.getElementById('btnRSAnd').click();
                        document.getElementById('btnRSLBkt').click();
                        addStreetNameToRSel(getUnique(val.primaryStreet), 'inRSStreet', 'selRSAlttStreet', 0, 'btnRSAddStreet');
                        addStreetNameToRSel(getUnique(val.altStreets), 'inRSStreet', 'selRSAlttStreet', 1, 'btnRSAddStreet');
                        document.getElementById('btnRSRBkt').click();
                    } else
                        addStreetNameToRSel(getUnique(val.primaryStreet), 'inRSStreet', 'selRSAlttStreet', 0, 'btnRSAddStreet');
                        addStreetNameToRSel(getUnique(val.altStreets), 'inRSStreet', 'selRSAlttStreet', 1, 'btnRSAddStreet');
                    break;
                case 'cm_ids':
                    document.getElementById('inRSSegId').value = val;
                    document.getElementById('btnRSAddSegId').classList.add('btn-info');
                    break;
                case 'cm_primaryStreet':
                    document.getElementById('inRSStreet').value = val;
                    document.getElementById('selRSAlttStreet').value = 0;
                    document.getElementById('btnRSAddStreet').classList.add('btn-info');
                    break;
                case 'cm_altStreets':
                    document.getElementById('inRSStreet').value = val;
                    document.getElementById('selRSAlttStreet').value = 1;
                    document.getElementById('btnRSAddStreet').classList.add('btn-info');
                    break;
                case 'cm_altStreetsAND':
                    document.getElementById('inRSStreet').value = '';
                    break;
                case 'cm_altStreetsOR':
                    document.getElementById('inRSStreet').value = '';
                    break;
                case 'cm_primaryCity':
                    document.getElementById('inRSCity').value = val;
                    document.getElementById('selRSAltCity').value = 0;
                    document.getElementById('btnRSAddCity').classList.add('btn-info');
                    break;
                case 'cm_altCities':
                    document.getElementById('inRSCity').value = val;
                    document.getElementById('selRSAltCity').value = 1;
                    document.getElementById('btnRSAddCity').classList.add('btn-info');
                    break;
                case 'cm_state':
                    document.getElementById('inRSState').value = val;
                    document.getElementById('btnRSAddState').classList.add('btn-info');
                    break;
                case 'cm_roadType':
                    document.getElementById('selRSRoadType').value = val;
                    document.getElementById('btnRSAddRoadType').classList.add('btn-info');
                    break;
                case 'cm_updatedBy':
                    document.getElementById('inRSUpdtd').value = val;
                    document.getElementById('btnRSAddUpdtd').classList.add('btn-info');
                    break;
                case 'cm_createdBy':
                    document.getElementById('inRSCrtd').value = val;
                    document.getElementById('btnRSAddCrtd').classList.add('btn-info');
                    break;
                case 'cm_toCrossroads':
                    break;
            }
        } catch (err) {
            console.error(err);
        }

        // swap panel from selection panel
        try {
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('edit-panel').style.display = 'none';
        } catch (err) {
            console.error(err);
        }

        // switch active tab-content
        try {
            document.querySelector('.tab-content>.active').classList.remove('active');
            document.getElementById('sidepanel-roadselector').classList.add('active');
        } catch (err) {}

        // switch active nav-tab
        try {
            document.querySelector('#user-tabs li.active').classList.remove('active');
            document.getElementById('tabRSel').classList.add('active');
        } catch (err) {}

        // switch to RSel editor tab
        try {
            document.getElementById('roadselector-tabs').children[1].classList.remove('active');
            document.getElementById('roadselector-tabs').children[0].classList.add('active');
            document.getElementById('roadselector-tab-content').children[1].classList.remove('active');
            document.getElementById('roadselector-tab-content').children[0].classList.add('active');
        } catch (err) { /* */ }
    }
};

var getAutoAddToRSelCase = function (addType) {
    var nameClass = ((document.getElementById('cm_pri').checked * document.getElementById('cm_pri').value) + (document.getElementById('cm_alt').checked * document.getElementById('cm_alt').value)) - 1;

    switch (addType) {
        case 'cm_S':
            switch (nameClass) {
                case 0: //primary
                    return 'cm_priS';
                case 1: //alt
                    return 'cm_altS';
                case 2: //any
                    return 'cm_anyS';
            }
            break;
        case 'cm_SC': // cm_SC street and city
            switch (nameClass) {
                case 0: //primary
                    return 'cm_priSC';
                case 1: //alt
                    return 'cm_altSC';
                case 2: //any
                    return 'cm_anySC';
            }
            break;
    }
};

var getSegmentProperties = function (selectedStuff) {
	cmlog([1,1], 'getSegmentProperties()');
    try {
        var s, segments = selectedStuff.segments,
            s_altStObjKeys, s_altSt, s_toConnObjKeys, a, numAlts, k, numKeys;

        var s_ids = {
            ids: {},
            primaryStreet: {},
            altStreets: {},
            altCities: {},
            roadType: {},
            createdBy: {},
            updatedBy: {},
            toCrossroads: {},
            primaryCity: {},
            state: {},
            country: {}
        };

        for (s = segments.length; s--;) {
            if (segments[s].model.attributes.id)
                s_ids.ids[segments[s].model.attributes.id] = null;
            if (segments[s].model.attributes.primaryStreetID) {
                s_ids.primaryStreet[segments[s].model.attributes.primaryStreetID] = null;
                if (W.model.streets.objects[segments[s].model.attributes.primaryStreetID].cityID) {
                    s_ids.primaryCity[W.model.streets.objects[segments[s].model.attributes.primaryStreetID].cityID] = null;
                    if (W.model.cities.objects[W.model.streets.objects[segments[s].model.attributes.primaryStreetID].cityID].attributes.stateID)
                        s_ids.state[W.model.cities.objects[W.model.streets.objects[segments[s].model.attributes.primaryStreetID].cityID].attributes.stateID] = null;

                    s_ids.country[W.model.cities.objects[W.model.streets.objects[segments[s].model.attributes.primaryStreetID].cityID].attributes.countryID] = null;
                }
            }
            s_ids.roadType[segments[s].model.attributes.roadType] = null;
            s_ids.createdBy[segments[s].model.attributes.createdBy] = null;
            if (segments[s].model.attributes.updatedBy)
                s_ids.updatedBy[segments[s].model.attributes.updatedBy] = null;


            s_altSt = segments[s].model.attributes.streetIDs;
            numAlts = s_altSt.length;
            for (a = 0; a < numAlts; a++) {
                try {
                    s_ids.altStreets[s_altSt[a]] = null;
                    s_ids.altCities[W.model.streets.objects[s_altSt[a]].cityID] = null;
                } catch(err) {}
            }

            s_toConnObjKeys = Object.keys(segments[s].model.attributes.toCrossroads);
            numKeys = s_toConnObjKeys.length;
            for (k = 0; k < numKeys; k++) {
                try {
                    if (s_toConnObjKeys[k] !== '')
                        s_ids.toCrossroads[s_toConnObjKeys[k]] = segments[s].model.attributes.toCrossroads[s_toConnObjKeys[k]];
                } catch(err) {}
            }
        }

        var seg_ids = {},
            seg_names = {
                ids: [],
                primaryStreet: [],
                altStreets: [],
                altCities: [],
                roadType: [],
                createdBy: [],
                updatedBy: [],
                toCrossroads: [],
                primaryCity: [],
                state: [],
                country: []
            };

        for (var idKey in s_ids) {
            seg_ids[idKey] = Object.keys(s_ids[idKey]);
            numKeys = seg_ids[idKey].length;

            for (k = 0; k < numKeys; k++) {
                try {
                    if (seg_ids[idKey][k] !== '') {
                        switch (idKey) {
                            case 'primaryStreet':
                                seg_names[idKey][k] = W.model.streets.objects[seg_ids[idKey][k]].name;
                                break;
                            case 'primaryCity':
                                seg_names[idKey][k] = W.model.cities.objects[seg_ids[idKey][k]].attributes.name;
                                break;
                            case 'altStreets':
                                seg_names[idKey][k] = W.model.streets.objects[seg_ids[idKey][k]].name;
                                break;
                            case 'altCities':
                                seg_names[idKey][k] = W.model.cities.objects[seg_ids[idKey][k]].attributes.name;
                                break;
                            case 'state':
                                seg_names[idKey][k] = W.model.states.objects[seg_ids[idKey][k]].name;
                                break;
                            case 'roadType':
                                seg_names[idKey][k] = roadTypes[String(seg_ids[idKey][k])];
                                break;
                            case 'createdBy':
                                seg_names[idKey][k] = W.model.users.objects[seg_ids[idKey][k]].userName;
                                break;
                            case 'updatedBy':
                                seg_names[idKey][k] = W.model.users.objects[seg_ids[idKey][k]].userName;
                                break;
                        }
                    }
                } catch(err) {}
            }
        }
        return {
            ids: seg_ids,
            names: seg_names
        };
    } catch (err) {
        console.error(err);
    }
};

var addHotkeyListener = function() {
	cmlog([1,1], 'addHotkeyListener()');
    window.addEventListener('keydown', menuShortcutKeys, true);
    cmlog([2,2],'Adding global hotkey listener due to mouseenter');
};

var removeHotkeyListener = function() {
	cmlog([1,1], 'removeHotkeyListener()');
    window.removeEventListener('keydown', menuShortcutKeys, true);
    cmlog([2,2],'Removing global hotkey listener due to mouseleave');
};

var handleSelectionChanged = function(e){
    if(!$('#cmPinMenu')[0].value){
        if(!selectedItemsIsSegment(e))
            closeContextMenu();
        else
            setupSegmentContextMenu(e);
    }

    $('#cm_ABCenter').css('display', W.selectionManager.getSelectedFeatures().length !== 1 ? 'none' : 'block');
    $('#cm_UTurn').css('display', W.selectionManager.getSelectedFeatures().length !== 1 ? 'none' : 'block');
    setABOrigValues();
    setUTurnStatus();
}

var setUTurnStatus = function(){
    ANodeUturn = null;
    BNodeUturn = null;
    $('#cm_UTurnA').css('visibility', 'visible');
    $('#cm_UTurnB').css('visibility', 'visible');
    $('#cm_UTurnBoth').css('visibility', 'visible');

    if(W.selectionManager.getSelectedFeatures().length === 1 && W.selectionManager.getSelectedFeatures()[0].model.type === "segment"){
        function validate(seg) {
            if (seg.model.getLockRank() > W.loginManager.user.rank) return false;
            if (!seg.model.arePropertiesEditable()) return false;
            if (seg.model.isDeleted()) return false;

            return true;
        }
        var seg = W.selectionManager.getSelectedFeatures()[0];
        var turnGraph = W.model.getTurnGraph();

        if (validate(seg)) {
            var toNode = null;
            var fromNode = null;

            if (seg.model.attributes.toNodeID)
                toNode = seg.model.getToNode();
            if (seg.model.attributes.fromNodeID)
                fromNode = seg.model.getFromNode();

            if (toNode !== null && toNode.state === null && toNode.attributes.segIDs.length > 1) {
                var turnToNode = turnGraph.getTurnThroughNode(toNode, seg.model, seg.model);
                var toTurnData = turnToNode.getTurnData();

                BNodeUturn = toTurnData.isAllowed();
            }

            if (fromNode !== null && fromNode.state === null && fromNode.attributes.segIDs.length > 1) {
                var turnFromNode = turnGraph.getTurnThroughNode(fromNode, seg.model, seg.model);
                var fromTurnData = turnFromNode.getTurnData();

                ANodeUturn = fromTurnData.isAllowed();
            }
        }
    }

    if(ANodeUturn === null){
        $('#cm_UTurnA').css('visibility', 'hidden');
        $('#cm_UTurnBoth').css('visibility', 'hidden');
    }
    else{
        $('#cm_UTurnA')[0].disabled = false;
        if(ANodeUturn){
            $('#cm_UTurnAIcon').removeClass('closed');
            $('#cm_UTurnAIcon').addClass('open');
        }
        else{
            $('#cm_UTurnAIcon').removeClass('open');
            $('#cm_UTurnAIcon').addClass('closed');
        }
    }
    if(BNodeUturn === null){
        $('#cm_UTurnB').css('visibility', 'hidden');
        $('#cm_UTurnBoth').css('visibility', 'hidden');
    }
    else{
        $('#cm_UTurnB')[0].disabled = false;
        if(BNodeUturn){
            $('#cm_UTurnBIcon').removeClass('closed');
            $('#cm_UTurnBIcon').addClass('open');
        }
        else{
            $('#cm_UTurnBIcon').removeClass('open');
            $('#cm_UTurnBIcon').addClass('closed');
        }
    }
    if(BNodeUturn && ANodeUturn){
        $('#cm_UTurnBothIcon').removeClass('closed');
        $('#cm_UTurnBothIcon').addClass('open');
    }
    else{
        $('#cm_UTurnBothIcon').removeClass('open');
        $('#cm_UTurnBothIcon').addClass('closed');
    }
}

var setABOrigValues = function(){
    if(W.selectionManager.getSelectedFeatures().length === 1){
        ABOrig.Orig = null;
        ABOrig.ANode = {};
        ({x: ABOrig.ANode.lon, y : ABOrig.ANode.lat} = W.selectionManager.getSelectedFeatures()[0].geometry.getVertices()[0]);
        ABOrig.BNode = {};
        ({x: ABOrig.BNode.lon, y : ABOrig.BNode.lat} = W.selectionManager.getSelectedFeatures()[0].geometry.getVertices().slice(-1)[0]);
    }
    else{
        ABOrig.Orig = null;
        ABOrig.ANode = null;
        ABOrig.BNode = null;
    }
}

var closeContextMenu = function () {
	cmlog([1,1], 'closeContextMenu()');
    try {
    	// remove unnecessary hotkey listeners
        window.removeEventListener('keydown', menuShortcutKeys, true);
		document.getElementById('cmContextMenu').removeEventListener('mouseenter', addHotkeyListener, false);
		document.getElementById('cmContextMenu').removeEventListener('mouseleave', removeHotkeyListener, false);
		cmlog([2,2],'Closing menu, so removing all hotkey listeners');
		// remove unnecessary close contextmenu listeners
        window.removeEventListener('click', closeContextMenu, false);
        document.getElementById('toolbar').removeEventListener('mouseenter', closeContextMenu, false);

    	W.selectionManager.events.unregister("selectionchanged", null, setupSegmentContextMenu);
        W.selectionManager.events.unregister("selectionchanged", null, handleSelectionChanged);

        // close the menu
        document.getElementById('cmContextMenu').style.display = 'none';
        SL.menuResetEvent = true;
    } catch (err) {}
};

var addSpecialMenuListeners = function () {
	cmlog([1,1], 'addSpecialMenuListeners()');
    if ($('#cmPinMenu')[0].value) {
        window.removeEventListener('click', closeContextMenu, false);
        document.getElementById('toolbar').removeEventListener('mouseenter', closeContextMenu, false);
    } else {
        window.addEventListener('keydown', menuShortcutKeys, true);
        cmlog([2,2],'Adding just global hotkey listener via addSpecialMenuListeners()');
        //window.addEventListener('click', closeContextMenu, false);
        document.getElementById('toolbar').addEventListener('mouseenter', closeContextMenu, false);
    }
};

var adjustContextMenubar = function(pos) {
	if (pos === 1) {
       	document.getElementById('cmFooterCaret').classList.add('fa-angle-down');
        document.getElementById('cmFooterCaret').classList.remove('fa-angle-up');
        document.getElementById('cmFooter').classList.add('cm-top');
        document.getElementById('cmFooter').classList.remove('cm-bottom');
        document.getElementById('cmFooter').style.marginBottom = '-1px';
        document.getElementById('cmContextMenu').insertBefore(document.getElementById('cmFooter'), document.getElementById('cmContextMenu').children[0]);
	} else {
        document.getElementById('cmFooterCaret').classList.add('fa-angle-up');
        document.getElementById('cmFooterCaret').classList.remove('fa-angle-down');
        document.getElementById('cmFooter').classList.remove('cm-top');
        document.getElementById('cmFooter').classList.add('cm-bottom');
        document.getElementById('cmFooter').style.marginBottom = '0';
        document.getElementById('cmContextMenu').appendChild(document.getElementById('cmFooter'));
	}
};

var hideMenuSection = function(evt, sectionName) {
    var that;
    if (evt) {
        that = evt.target;
        evt.stopPropagation();
    }
    else if (sectionName)
        that = document.querySelector('.cm-menu-section[name=' + sectionName + ']>.cm-hide');

    that.classList.toggle('fa-caret-down');
    that.classList.toggle('fa-caret-up');

    if (that.classList.contains('fa-caret-up')) { //hidden section
        that.parentNode.classList.add('cm-hidden');
        contextMenuSettings.hidden[that.parentNode.getAttribute('name')] = true;
    } else { //revealed section
        that.parentNode.classList.remove('cm-hidden');
        contextMenuSettings.hidden[that.parentNode.getAttribute('name')] = false;
    }

    localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
};

var resetContextMenu = function (contextMenuSettings) {
	cmlog([1,1], 'resetContextMenu()');

    var menuHTML;

    if (menuResetEvent_RSel) document.getElementById('btnRSClear').click();
    menuResetEvent_RSel = false;

    try {
        document.querySelector('#user-tabs a[href="#sidepanel-roadselector"]').parentNode.id = 'tabRSel';
    } catch (err) {}
    // <label for="cm_any" class="btn cm-rsel-options badge cm-badge-right active"><input id="cm_any" type="radio" name="cmOptions" value=2 style="opacity: 0" checked>any</label> //dl - background-color: rgba(177, 210, 220, 0.75);

    if (contextMenuSettings.clipboard === 1) { //RSel
	    document.getElementById('cmContainer').innerHTML =
	    '<div id="cmRSelAutoAdd" class="cm-menu-section cm-rsel">' +
	        '<dl><dt>RSel Auto-Add Names</dt>' +
	            '<dd><div class="btn-group pull-left" data-toggle="buttons">' +
	                    '<label for="cm_pri" class="btn cm-rsel-options cm-badge-left active"><input id="cm_pri" type="checkbox" value=1 checked>&nbsp;Primary</label>' +
	                    '<label for="cm_alt" class="btn cm-rsel-options cm-badge-right active"><input id="cm_alt" type="checkbox" value=2 checked>Alternate&nbsp;</label>' +
	                '</div>' +
	                '<div class="pull-left btn-group" style="margin: 0px 2px">' +
	                    '<button type="button" id="cmRoadType" class="btn cm-rsel-options active">Type</button>' +
	                '</div>' +
	                '<div class="btn-group pull-right">' +
	                    '<button type="button" id="cmOpAddOr" class="btn cm-rsel-options cm-badge-left and" value="0" style="padding-right: 4px;">and</button>' +
	                    '<button type="button" id="cmOpNot" class="btn cm-rsel-options cm-badge-right" style="padding-left: 4px;">!</button>' +
	            '</div></dd>' +
	            '<dd id="cm_SC">All <span id="cm_textSC">Primary/Alt. Street, City</span></dd>' +
	            '<dd id="cm_S">All <span id="cm_textS">Primary/Alt. Street</span></dd>' +
	        '</dl>' +
	    '</div>';
	}
    else
		document.getElementById('cmContainer').innerHTML = '';

    menuHTML = '<div class="cm-menu-header"><dl><dt id="cmMenuHeaderTitle">Copy To Clipboard</dt></dl></div>' +
    '<div id="cmMenuNoContent" class="cm-menu-section" style="display: none;"><dd>No valid segment(s) selected</dd></div>' +
    '<div id="cmMenuContent">' +
        '<div id="cm_street" name="street" class="cm-menu-section">' +
            '<span class="fa fa-caret-down cm-hide"></span><span class="fa fa-caret-up cm-hide"></span>' +
            '<dl id="cm_primaryStreet"><dt>Street</dt></dl>' +
            '<dl id="cm_altStreets"><dt>Alt street</dt></dl>' +
        '</div>' +
        '<div id="cm_city" name="city" class="cm-menu-section">' +
            '<span class="fa fa-caret-down cm-hide"></span><span class="fa fa-caret-up cm-hide"></span>' +
            '<dl id="cm_primaryCity"><dt>City</dt></dl>' +
            '<dl id="cm_altCities"><dt>Alt city</dt></dl>' +
        '</div>' +
        '<div name="state" class="cm-menu-section">' +
            '<span class="fa fa-caret-down cm-hide"></span><span class="fa fa-caret-up cm-hide"></span>' +
            '<dl id="cm_state"><dt>State</dt></dl>' +
        '</div>' +
        '<div name="roadtype" class="cm-menu-section">' +
            '<span class="fa fa-caret-down cm-hide"></span><span class="fa fa-caret-up cm-hide"></span>' +
            '<dl id="cm_roadType"><dt>Road type</dt></dl>' +
        '</div>' +
        '<div name="by" class="cm-menu-section">' +
            '<span class="fa fa-caret-down cm-hide"></span><span class="fa fa-caret-up cm-hide"></span>' +
            '<dl id="cm_updatedBy"><dt>Updated by</dt></dl>' +
            '<dl id="cm_createdBy"><dt>Created by</dt></dl>' +
        '</div>' +
        '<div name="id" class="cm-menu-section">' +
            '<dl><dd id="cm_ids">Segment IDs</dd></dl>' +
    '</div></div>'

    for (var h in contextMenuSettings.hidden) {
        if (contextMenuSettings.hidden[h]) //hideMenuSection(null, h);
            menuHTML = menuHTML.replace(new RegExp('(name="' + h + '" class=")','m'),'$1cm-hidden ');
    }

    document.getElementById('cmContainer').innerHTML += menuHTML;

    $('.cm-hide').click(hideMenuSection);

    // if menu is not pinned
    if (!document.getElementById('cmPinMenu').value && $('#cmContextMenu').css('display') != 'none')
        setTimeout(addSpecialMenuListeners, 250);

    adjustContextMenubar(contextMenuSettings.position);
};

var hidePasteMenu = function(bit) {
    if (bit === undefined) bit = !document.getElementById('cmClipboard').value;

    if ($('.cm-paste').length) {
        $('.cm-paste').each(function(i, node) {
            if (bit) node.style.display = 'none';
            else node.style.display = '';
        });
    }
};

var populateEditAttributes = function(segInfo, contextMenuSettings){
    $('#cmMenuNoContent')[0].style.display = 'none';
    $('#cmMenuContent')[0].style.display = 'block';

    try{
        let userRank = W.loginManager.user.rank; //0 based rank
        resetContextMenu(contextMenuSettings);
        let elevation = $('select[name="level"]').val(); //have to get the current elevation before we create our interface

        let segLocked;
        if($('.lock-level-displayer').css("display") === "none")
            segLocked= $('input[name="lockRank"]:checked')[0].value; //We have to get the segment lock rank before building the display since we are mimicing the native interface and are going to only display the locked level when it is locked above the user's rank
        else
            segLocked = "LOCKED";

        document.getElementById('cmMenuHeaderTitle').innerHTML = "Edit Attributes";
        document.getElementById('cmMenuContent').innerHTML = '<div class="cm-menu-section"><dd>' +
            `<input type="checkbox" id="cmUnpaved" ${segLocked === "LOCKED" ? 'disabled' : ''}><label for="cmUnpaved">Unpaved</label><br>` +
            `<input type="checkbox" id="cmTunnel" ${segLocked === "LOCKED" ? 'disabled' : ''}><label for="cmTunnel">Tunnel</label><br>` +
            `<input type="checkbox" id="cmHeadlights" ${segLocked === "LOCKED" ? 'disabled' : ''}><label for="cmHeadlights">Headlights</label></dd>` +
            `<dl><dt>Direction</dt><dd class="waze-radio-container"><input type="radio" name="cmdirection" value="-1" id="cmSegDirectionMultiple" data-type="numeric" data-nullable="true"><label for="cmSegDirectionMultiple" style="display:none;">&lt; Multiple &gt;</label><input type="radio" name="cmdirection" value="3" id="cmSegDirectionTwoWay" data-type="numeric" ${segLocked === "LOCKED" ? 'disabled' : ''}><label for="cmSegDirectionTwoWay" style="font-size:11px">${I18n.translations[I18n.currentLocale()].segment.direction[3]}</label><input type="radio" name="cmdirection" value="1" id="cmSegDirectionAB" data-type="numeric" ${segLocked === "LOCKED" ? 'disabled' : ''}><label for="cmSegDirectionAB" style="font-size:11px">${I18n.translations[I18n.currentLocale()].segment.direction[1]}</label><input type="radio" name="cmdirection" value="2" id="cmSegDirectionBA" data-type="numeric" ${segLocked === "LOCKED" ? 'disabled' : ''}><label for="cmSegDirectionBA" style="font-size:11px">${I18n.translations[I18n.currentLocale()].segment.direction[2]}</label><input type="radio" name="cmdirection" value="0" id="cmSegDirectionUnknown" data-type="numeric" ${segLocked === "LOCKED" ? 'disabled' : ''}><label for="cmSegDirectionUnknown" style="display: none;">Unknown</label></dd></dl>` +
            '<dl><dt>Lock</dt><dd class="waze-radio-container">' +
            (segLocked !== "LOCKED" ? ( //if the segment(s) are not locked above the user's rank, display the lock level buttons
            ((segLocked === "MIXED") ? '<input type="radio" name="cmSegmentLock" value="MIXED" id="cmlockRankMulti" data-type="string"><label for="cmlockRankMulti" style="display: inline-block;">&lt; Multiple &gt;</label>' : '') +
            ((segLocked === "AUTO" || segLocked === "MIXED" || (segLocked <= userRank)) ? '<input type="radio" value="AUTO" id="cmlockRankAuto" name="cmSegmentLock"><label for="cmlockRankAuto">Auto</label>' : '') +
            buildLockButtons(segLocked, userRank)
            ) : `<input type="radio" id="cmSegmentLocked" name="cmlockRankDisplay" disabled checked><label for="cmSegmentLocked">${$(`label[for^="lockRankDisplay"]`).text()}</label>`) +
            '</dd></dl>' +
            `<dl><dt>Elevation</dt><dd><select class="form-control" id="cmElevation" name="level" style="display: inline-block; width: 100px; height:20px; padding: 0px 0px 0px 12px !important; margin-right: 10px; margin-bottom:3px;" ${segLocked === "LOCKED" ? 'disabled' : ''}><option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option><option value="0">${I18n.translations[I18n.currentLocale()].edit.segment.levels[0]}</option><option value="-1">-1</option><option value="-2">-2</option><option value="-3">-3</option><option value="-4">-4</option></select></dd><dd><div class="btn waze-btn waze-btn-white" id="cmElevationMinus" style="height: 20px;padding-left: 8px;padding-right: 8px;margin-right: 4px;padding-top: 1px; font-size:11px" ${segLocked === "LOCKED" ? 'disabled' : ''}>-</div><div class="btn waze-btn waze-btn-white" id="cmElevationGround" style="height: 20px;padding-left: 8px;padding-right: 8px;margin-right: 4px;padding-top: 1px; font-size:11px" ${segLocked === "LOCKED" ? 'disabled' : ''}>${I18n.translations[I18n.currentLocale()].edit.segment.levels[0]}</div><div class="btn waze-btn waze-btn-white" id="cmElevationPlus" style="height: 20px;padding-left: 8px;padding-right: 8px;margin-right: 4px;padding-top: 1px; font-size:11px"  ${segLocked === "LOCKED" ? 'disabled' : ''}>+</div></dd></dl>` +
            '</div>';

        $('#cmElevation').val(elevation);

        if($('#headlightsCheckbox').attr("mixed") === 'true')
            $('#cmHeadlights')[0].indeterminate = true;
        else
            $("#cmHeadlights").prop("checked", $('#headlightsCheckbox').prop("checked") === true);

        if($('#unpavedCheckbox').attr("mixed") === 'true')
            $('#cmUnpaved')[0].indeterminate = true;
        else
            $("#cmUnpaved").prop("checked", $('#unpavedCheckbox').prop("checked") === true);

        if($('#tunnelCheckbox').attr("mixed") === 'true')
            $('#cmTunnel')[0].indeterminate = true;
        else
            $("#cmTunnel").prop("checked", $('#tunnelCheckbox').prop("checked") === true);

        if(segLocked !== "LOCKED"){
            $("#cmHeadlights").click(function(){
                $('#headlightsCheckbox').click();
            });

            $('#headlightsCheckbox').click(function(){
                $("#cmHeadlights").prop("checked", $('#headlightsCheckbox').prop("checked") === true);
            });

            $("#cmUnpaved").click(function(){
                $('#unpavedCheckbox').click();
            });

            $('#unpavedCheckbox').click(function(){
                $("#cmUnpaved").prop("checked", $('#unpavedCheckbox').prop("checked") === true);
            });

            $("#cmTunnel").click(function(){
                $('#tunnelCheckbox').click();
            });

            $('#tunnelCheckbox').click(function(){
                $("#cmTunnel").prop("checked", $('#tunnelCheckbox').prop("checked") === true);
            });
        }
        /************** Segment Direction *****************/
        //3 = two way, 1 = A->B, 2 = B->A, 0= Unknown, -1 = multiple
        let segDirection = $('input[name="direction"]:checked')[0].value;
        $(`input[name="cmdirection"][value="${segDirection}"]`).prop("checked", true)

        if(segDirection === "0" || segDirection === "-1"){
            let id = $(`input[name="cmdirection"][value="${segDirection}"]`)[0].id;
            $(`label[for="${id}"]`).css("display", "inline-block");
        }

        $('input[name="direction"]').click(function(){
            $(`input[name="cmdirection"][value="${$(this)[0].value}"]`).prop("checked", true);
            if($(this)[0].value > 0){ //if the user selected a direction, hide the options for Multiple and Unknown (mimic same as native)
                $(`label[for="cmSegDirectionUnknown"]`).css("display", "none");
                $(`label[for="cmSegDirectionMultiple"]`).css("display", "none");
            }
        });

        $('input[name="cmdirection"]').click(function(){
            $(`input[name="direction"][value="${$(this)[0].value}"]`).click();
            if($(this)[0].value > 0){ //if the user selected a direction, hide the options for Multiple and Unknown (mimic same as native)
                $(`label[for="cmSegDirectionUnknown"]`).css("display", "none");
                $(`label[for="cmSegDirectionMultiple"]`).css("display", "none");
            }
        });

        /************* Segment Lock Levels *****************/
        $(`input[name="cmSegmentLock"][value="${segLocked}"]`).prop("checked", true)

        $('input[name="lockRank"]').click(function(){
            $(`input[name="cmSegmentLock"][value="${$(this)[0].value}"]`).prop("checked", true);
            $(`label[for="cmlockRankMulti"]`).css("display", "none");
        });

        //Need a MO because changing the lock level redraws that section so we have to re-establish our click handler
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if ($(mutation.target).hasClass('lock-edit') && mutation.addedNodes.length > 0){
                    $('input[name="lockRank"]').click(function(){
                        $(`input[name="cmSegmentLock"][value="${$(this)[0].value}"]`).prop("checked", true);
                        $(`label[for="cmlockRankMulti"]`).css("display", "none");
                    });
                }
            });
        });

        observer.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });

        $('input[name="cmSegmentLock"]').click(function(){
            $(`input[name="lockRank"][value="${$(this)[0].value}"]`).click();
            $(`label[for="cmlockRankMulti"]`).css("display", "none");
        });

        /****************** Segment Elevation *********************/

        if(segLocked !== "LOCKED"){
            $('#cmElevationPlus').click(function(){
                let level = parseInt($('select[name="level"]').val());
                if (level < 9)
                    $('select[name="level"]').val(level + 1).change();
            });

            $('#cmElevationGround').click(function(){
                let level = parseInt($('select[name="level"]').val());
                if (level !== 0)
                    $('select[name="level"]').val(0).change();
            });

            $('#cmElevationMinus').click(function(){
                let level = parseInt($('select[name="level"]').val());
                if (level > -5)
                    $('select[name="level"]').val(level - 1).change();
            });

            $('.side-panel-section select[name="level"]').change(function(){
                $("#cmElevation").val($(this).val());
            });

            $("#cmElevation").change(function(){
                $('.side-panel-section select[name="level"]').val($(this).val()).change();
            });
        }
    }
    catch (err) {
    	cmlog([1,1], err);
    }
}

function buildLockButtons(segLock, userRank){
    let buttonCode = '';
    if(segLock === "AUTO" || segLock === "MIXED" || segLock <= userRank){
        for(let i=0; i<=userRank; i++)
            buttonCode += `<input type="radio" value="${i}" id="cmlockRank${i}" name="cmSegmentLock"><label for="cmlockRank${i}">${i+1}</label>`;
    }
    else
        buttonCode += `<input type="radio" value="${segLock}" id="cmlockRank${parseInt(segLock)}" name="cmSegmentLock"><label for="cmlockRank${parseInt(segLock)}" disabled>${parseInt(segLock)+1}</label>`;

    return buttonCode;
}

var populateCopyMenu = function (segInfo, contextMenuSettings) {
	cmlog([1,1], 'populateCopyMenu()');

    $('#cmMenuNoContent')[0].style.display = 'none';
    $('#cmMenuContent')[0].style.display = 'block';

    try {
        resetContextMenu(contextMenuSettings);
        var updateNames = Object.keys(segInfo.ids),
            numNames = updateNames.length,
            n, selOption, emptyArr, s_names = {},
            s_ids = {}, sectionElement;

        for (n = numNames; n--;) {
            sectionElement = document.getElementById('cm_' + updateNames[n]);
            if (sectionElement &&
                segInfo.ids[updateNames[n]] &&
                segInfo.ids[updateNames[n]].length) {

                if (updateNames[n] !== 'ids') {
                    emptyArr = 0;
                    s_names[updateNames[n]] = getUnique(segInfo.names[updateNames[n]]);
                    s_ids[updateNames[n]] = getUnique(segInfo.ids[updateNames[n]]);

                    for (var a = 0, aLength = s_ids[updateNames[n]].length; a < aLength; a++) {
                    	try {
	                    	selOption = document.createElement('dd');
	                        if (s_names[updateNames[n]][a]) {
	                            if (s_names[updateNames[n]][a] === '') { //no city or no street
	                                if (/city/i.test(updateNames[n]))
	                                    selOption.innerHTML = 'No City';
	                                else if (/street/i.test(updateNames[n]))
	                                    selOption.innerHTML = 'No Street';
	                                //selOption.name = '';
	                            } else { //add the property value to the menu
	                                selOption.innerHTML = s_names[updateNames[n]][a];
	                                //selOption.name = s_names[updateNames[n]][a];
	                            }
	                            sectionElement.appendChild(selOption);

	                            switch (updateNames[n]) {
	                                case 'roadType':
	                                    selOption.name = s_ids[updateNames[n]][a];
	                                    if (document.getElementById('cmClipboard').value) selOption.name = s_names[updateNames[n]][a];
	                                    selOption.onclick = function (e) {
	                                        //if (document.getElementById('cmPinMenu').value) e.stopPropagation();
	                                        copyTo(e, this.parentNode.id, this.name);
	                                    };
	                                    break;
	                                default:
	                                    selOption.name = s_names[updateNames[n]][a];
	                                    selOption.onclick = function (e) {
	                                        //if (document.getElementById('cmPinMenu').value) e.stopPropagation();
	                                        copyTo(e, this.parentNode.id, this.name);
	                                    };
	                            }
	                        }
                            else
	                            emptyArr++;
	                    } catch(err) { console.error(err); }
                    }

                    // Check if something has been copied into clipboard for pasting...
                    if (document.getElementById('cmClipboard').value) addPasteItems('cm_' + updateNames[n]);

                    // Hide section if nothing to copy
                    if (emptyArr === aLength && !$('#input_cm_' + updateNames[n]).length)
                        sectionElement.style.display = "none";
                        //sectionElement.parentNode.children[0].style.display = "none";
		            else if ($('#input_cm_' + updateNames[n]).length) { //show if something to paste
		            	selOption = document.createElement('dd');
		            	selOption.innerHTML = '&nbsp;';
		            	sectionElement.appendChild(selOption);
		            }
                } else { // Segment IDs
                    selOption = document.getElementById('cm_ids');
                    selOption.name = segInfo.ids[updateNames[n]].join(',');
                    selOption.onclick = function (e) {
                        //if (document.getElementById('cmPinMenu').value) e.stopPropagation();
                        copyTo(e, this.id, this.name);
                    };
                }
                //--------------------------------------------
            } else if (sectionElement && !$('#input_cm_' + updateNames[n]).length) { // Hide section if nothing to copy
                //sectionElement.parentNode.style.display = "none";
                sectionElement.style.display = "none";
                sectionElement.parentNode.children[0].style.display = "none"; //caret-down
                sectionElement.parentNode.children[1].style.display = "none"; //caret-up
            } else if (sectionElement && $('#input_cm_' + updateNames[n]).length) { //show if something to paste
            	selOption = document.createElement('dd');
                if (/city/i.test(updateNames[n]))
                    selOption.innerHTML = 'No City';
                else if (/street/i.test(updateNames[n]))
                    selOption.innerHTML = 'No Street';

                if (selOption.innerHTML.length) {
	                selOption.name = '';
	                sectionElement.appendChild(selOption);
	                selOption.onclick = function (e) {
	                    //if (document.getElementById('cmPinMenu').value) e.stopPropagation();
	                    copyTo(e, this.parentNode.id, this.name);
	                };
	            	sectionElement.appendChild(selOption);
	            }
            }
        }
        // Hide sections if nothing to copy
        if (!s_names.primaryStreet.length && !s_names.altStreets.length && !$('#input_cm_primaryStreet').length)
            document.getElementById('cm_primaryStreet').parentNode.style.display = 'none';

        if (!s_names.primaryCity.length && !s_names.altCities.length && !$('#input_cm_primaryCity').length)
            document.getElementById('cm_primaryCity').parentNode.style.display = 'none';

        if (!s_names.state.length) document.getElementById('cm_state').parentNode.style.display = 'none';

        var numSegments = getSelectedSegmentCount();
        if (!numSegments || numSegments === 0) numSegments = '0 Segment IDs';
        else if (numSegments === 1) numSegments = '1 Segment ID';
        else numSegments = numSegments + ' Segment IDs';
        document.getElementById('cm_ids').innerHTML = numSegments;

        //=================================================================================
        // RSEL-specific menu items
        //=================================================================================
        if (document.getElementById('cmRSel').value) {
            document.getElementById('cmMenuHeaderTitle').innerHTML = 'Send To Road Selector';

            var copyToRSelAndSelect = document.createElement('dd');
            copyToRSelAndSelect.id = 'cm_SCgo';
            copyToRSelAndSelect.zIndex = 1;
            copyToRSelAndSelect.className = 'fa fa-fast-forward pull-right cm-rsel-goselect';
            document.getElementById('cm_SC').parentNode.insertBefore(copyToRSelAndSelect, document.getElementById('cm_SC'));

            var copyToRSelAndSelect2 = copyToRSelAndSelect.cloneNode();
            copyToRSelAndSelect2.id = 'cm_Sgo';
            copyToRSelAndSelect.zIndex = 1;
            document.getElementById('cm_S').parentNode.insertBefore(copyToRSelAndSelect2, document.getElementById('cm_S'));

            document.getElementById('cmRSelAutoAdd').style.display = 'block';

            //name options
            document.getElementById('cm_pri').parentNode.addEventListener('click', function (e) {
                e.stopPropagation();
                var numBtnDown = this.parentNode.getElementsByClassName('active').length;
                if (this.children[0].checked) { //currently checked... decide whether to uncheck
                    this.classList.remove('active');
                    this.children[0].checked = false;
                    if (numBtnDown === 0) {
                        document.getElementById('cm_alt').parentNode.classList.add('active');
                        document.getElementById('cm_alt').checked = true;
                    }
                    document.getElementById('cm_textSC').innerHTML = 'Alt. Street, City';
                    document.getElementById('cm_textS').innerHTML = 'Alt. Street';
                } else { //unchecked
                    this.classList.add('active');
                    this.children[0].checked = true;
                    document.getElementById('cm_textSC').innerHTML = 'Primary/Alt. Street, City';
                    document.getElementById('cm_textS').innerHTML = 'Primary/Alt. Street';
                }
            }, false);
            document.getElementById('cm_alt').parentNode.addEventListener('click', function (e) {
                e.stopPropagation();
                var numBtnDown = this.parentNode.getElementsByClassName('active').length;
                if (this.children[0].checked) { //currently checked... decide whether to uncheck
                    this.classList.remove('active');
                    this.children[0].checked = false;
                    if (numBtnDown === 0) {
                        document.getElementById('cm_pri').parentNode.classList.add('active');
                        document.getElementById('cm_pri').checked = true;
                    }
                    document.getElementById('cm_textSC').innerHTML = 'Primary Street, City';
                    document.getElementById('cm_textS').innerHTML = 'Primary Street';
                } else { //unchecked
                    this.classList.add('active');
                    this.children[0].checked = true;
                    document.getElementById('cm_textSC').innerHTML = 'Primary/Alt. Street, City';
                    document.getElementById('cm_textS').innerHTML = 'Primary/Alt. Street';
                }
            }, false);

            //road type
            document.getElementById('cmRoadType').addEventListener('click', function (e) {
                e.stopPropagation();
                if (document.getElementById('cmRoadType').classList.contains('active'))
                    document.getElementById('cmRoadType').classList.remove('active');
                else
                    document.getElementById('cmRoadType').classList.add('active');
            }, false);

            //operations
            document.getElementById('cmOpAddOr').addEventListener('click', function (e) {
                e.stopPropagation();
                var opToggleLabel = ['and', 'or'],
                    newValue = this.value ^ 1;
                this.innerHTML = opToggleLabel[newValue];
                this.value = newValue;
                //console.info(this.value);
            }, false);

            document.getElementById('cmOpNot').addEventListener('click', function (e) {
                e.stopPropagation();
                if (document.getElementById('cmOpNot').classList.contains('active'))
                    document.getElementById('cmOpNot').classList.remove('active');
                else
                    document.getElementById('cmOpNot').classList.add('active');
            }, false);

            //menu selections
            document.getElementById('cm_SC').addEventListener('click', function (e) {
                copyTo(e, getAutoAddToRSelCase('cm_SC'), segInfo.names);
            }, false);
            document.getElementById('cm_S').addEventListener('click', function (e) {
                copyTo(e, getAutoAddToRSelCase('cm_S'), segInfo.names);
            }, false);

            document.getElementById('cm_SCgo').addEventListener('click', function (e) {
                menuResetEvent_RSel = true;
                copyTo(e, getAutoAddToRSelCase('cm_SC'), segInfo.ids);
                document.getElementById('btnRSSelect').click();
            }, false);
            document.getElementById('cm_Sgo').addEventListener('click', function (e) {
                menuResetEvent_RSel = true;
                copyTo(e, getAutoAddToRSelCase('cm_S'), segInfo.names);
                document.getElementById('btnRSSelect').click();
            }, false);
        }
    } catch (err) {
    	cmlog([1,1], err);
        //console.error(err);
    }
};

//===============================================================================================

SL.checkCountry = function () {
	cmlog([1,1], 'SL.checkCountry()');

    //for (i=1; i<17; i++) {kph=Math.round(i*5*SL.imperial.mph2kph); mph=Math.round(kph*SL.imperial.kph2mph); console.info('kph:',kph,'---','mph:',mph)}
    if (!contextMenuSettings.countries) contextMenuSettings.countries = [];

    var savedNumCountries = contextMenuSettings.countries.length,
        currentNumCountries, currentCountries, convertUnits = false, isImperialCountry = false;

    try {
        currentCountries = [W.model.countries.top.abbr];
        currentNumCountries = 1;
    } catch (err) {
        console.warning('WMECM:', 'Could not find W.model.countries.top. Trying to use W.model.countries.objects instead.');
        try {
            currentCountries = Object.keys(W.model.countries.objects);
            currentNumCountries = currentCountries.length;
        } catch (err) {
            console.warning('WMECM:', 'WME objects might have been changed by Waze. This could be a problem and should be examined.');
            currentCountries = false;
            currentNumCountries = 0;
        }
    }

    var matchCount = 0;
    for (var c = 0; c < currentNumCountries; c++) {
        for (var s = 0; s < savedNumCountries; s++)
            if (currentCountries[c] === contextMenuSettings.countries[s]) matchCount++;
    }

    for (var ic = 0, icLength = SL.imperial.mphCountries.length; ic < icLength; ic++) {
        if (currentCountries[0] === SL.imperial.mphCountries[ic]) {
            isImperialCountry = true;
            break;
        }
    }

    if (isImperialCountry && !W.prefs.attributes.isImperial) convertUnits = 1; //convert metric --> imperial
    else if (!isImperialCountry && W.prefs.attributes.isImperial) convertUnits = 2; //convert imperial --> metric

    SL.imperial.useMPH = isImperialCountry;
    SL.imperial.convertUnits = convertUnits;
    SL.currentCountry = currentCountries[0];

    if (matchCount !== currentNumCountries) {
        contextMenuSettings.countries = currentCountries;
        localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
        SL.forceBuildNewMenu = true;
        return true; //saved for later for implementing a check without having to refresh browser
    } else
        return false;
};

SL.highlightSpeedSigns = function () {
	cmlog([1,1], 'SL.highlightSpeedSigns()');
    //$('#signsholder_cm>div').removeAttr('style'); //reset styles
    $('#signsholder_cm>div:not(#btnCMClearSLs)').removeAttr('class'); //reset classes
    //if (SL.imperial.convertUnits === null) SL.checkCountry();

    // Highlight the current speed limit
    var fwdSL = document.querySelector('input[name="fwdMaxSpeed"]'), fwdSpeedVal,
        revSL = document.querySelector('input[name="revMaxSpeed"]'), revSpeedVal,
        numSegments = getSelectedSegmentCount(),
        fwdSLMenu = document.querySelector('input[name="fwdMaxSpeed_cm'),
		revSLMenu = document.querySelector('input[name="revMaxSpeed_cm'),
		unverFwdChkBox = document.getElementById('fwdMaxSpeedUnverifiedCheckbox'),
		unverRevChkBox = document.getElementById('revMaxSpeedUnverifiedCheckbox'),
		signFwd, signRev;

	if (fwdSL !== null) fwdSpeedVal = fwdSL.valueAsNumber;
	if (revSL !== null) revSpeedVal = revSL.valueAsNumber;

    if ((fwdSpeedVal+revSpeedVal) === 0)
    	return;
    else if ((revSLMenu && revSLMenu.parentNode.style.display === 'none') || revSpeedVal===0)
		revSpeedVal = false;
	else if ((fwdSLMenu && fwdSLMenu.parentNode.style.display === 'none') || fwdSpeedVal===0)
		fwdSpeedVal = false;

    if (SL.imperial.convertUnits === 1) {
        if (fwdSpeedVal) fwdSpeedVal = Math.round(fwdSpeedVal * SL.imperial.kph2mph);
        if (revSpeedVal) revSpeedVal = Math.round(revSpeedVal * SL.imperial.kph2mph);
    } else if (SL.imperial.convertUnits === 2) {
        if (fwdSpeedVal) fwdSpeedVal = Math.round(fwdSpeedVal * SL.imperial.mph2kph);
        if (revSpeedVal) revSpeedVal = Math.round(revSpeedVal * SL.imperial.mph2kph);
	}

	signFwd = document.querySelector('#signsholder_cm>div[id="sign' + fwdSpeedVal + '"]');
	signRev = document.querySelector('#signsholder_cm>div[id="sign' + revSpeedVal + '"]');

    if ((fwdSpeedVal && revSpeedVal) && (fwdSpeedVal === revSpeedVal)) {
        if ((unverFwdChkBox === null && unverRevChkBox === null) || // if both have been verified
            (unverFwdChkBox && unverRevChkBox && unverFwdChkBox.checked === true && unverRevChkBox.checked === true)) {
            if (signFwd) signFwd.className ='cm-sl-verified cm-both';
        } else if ((unverFwdChkBox === null || unverFwdChkBox.checked === true) ||
        	(unverRevChkBox === null || unverRevChkBox.checked === true)) { // only one has been verified
            if (signFwd) signFwd.className ='cm-sl-unverified cm-one';
        } else if (unverFwdChkBox.checked === false && unverRevChkBox.checked === false) { // neither have been verified
            if (signFwd) signFwd.className ='cm-sl-unverified cm-both';
        }
    } else if ((fwdSpeedVal && revSpeedVal) && (fwdSpeedVal !== revSpeedVal)) {
        if ((unverFwdChkBox === null && unverRevChkBox === null) || // if both have been verified -- no checkboxes
            (unverFwdChkBox && unverRevChkBox && unverFwdChkBox.checked === true && unverRevChkBox.checked === true)) { // or both checked
            if (signFwd) signFwd.className ='cm-sl-verified cm-a';
            if (signRev) signRev.className ='cm-sl-verified cm-b';
        } else if (unverFwdChkBox === null || unverFwdChkBox.checked === true) { //fwdSpeedVal checked or no checkbox
            if (signFwd) signFwd.className ='cm-sl-verified cm-a';
            if (signRev)signRev.className ='cm-sl-unverified cm-b';
        } else if (unverRevChkBox === null || unverRevChkBox.checked === true) { //revSpeedVal checked or no checkbox
            if (signFwd) signFwd.className ='cm-sl-unverified cm-a';
            if (signRev)signRev.className ='cm-sl-verified cm-b';
        } else if (unverFwdChkBox.checked === false && unverRevChkBox.checked === false) { //both unchecked
            if (signFwd) signFwd.className ='cm-sl-unverified cm-a';
            if (signRev)signRev.className ='cm-sl-unverified cm-b';
        }
    } else if (fwdSpeedVal && !revSpeedVal) { // no reverse speed has been inputted
        if (document.querySelector('input[name="revMaxSpeed"]') === null) { // if revSpeedVal input does not exist bc this is a oneway road
            if (unverFwdChkBox === null || unverFwdChkBox.checked === true) { // if fwdSpeedVal has been verified
                if (signFwd) signFwd.className ='cm-sl-verified';
            } else if (unverFwdChkBox.checked === false) { //unverified speed on oneway road
                if (signFwd) signFwd.className ='cm-sl-unverified';
            }
        } else { //revSpeedVal input box does exist but is empty
            if (unverFwdChkBox === null || unverFwdChkBox.checked === true) { // if fwdSpeedVal has been verified, then draw green box
                if (signFwd) signFwd.className ='cm-sl-verified cm-a';
            } else if (unverFwdChkBox.checked === false) { //unverified speed on oneway road
                if (signFwd) signFwd.className ='cm-sl-unverified cm-a';
            }
        }
    } else if (revSpeedVal && !fwdSpeedVal) {
        if (document.querySelector('input[name="fwdMaxSpeed"]') === null) { // if fwdSpeedVal input does not exist bc this is a oneway road
            if (unverRevChkBox === null || unverRevChkBox.checked === true) { //revSpeedVal has been verified
                if (signRev)signRev.className ='cm-sl-verified';
            } else if (unverRevChkBox.checked === false) { //unverified speed on oneway road
                if (signRev)signRev.className ='cm-sl-unverified';
            }
        } else { //fwdSpeedVal does exist, but has not been inputted
            if (unverRevChkBox === null || unverRevChkBox.checked === true) { //revSpeedVal has been verified
                signRev.className ='cm-sl-verified cm-b';
            } else if (unverRevChkBox.checked === false) { //unverified speed on oneway road
                if (signRev) signRev.className ='cm-sl-unverified cm-b';
            }
        }
    }

    if (numSegments > 1) $('#signsholder_cm>div.cm-sl-verified').addClass('cm-sl-multisegs');
};

SL.getSpeedLimits = function() {
    var origSignsEl = document.querySelectorAll('#signsholder>div[id^="sign"]'),
        signsEls = document.querySelectorAll('#signsholder_cm>div[id^="sign"]'),
        speedLimits = [];

    if (origSignsEl.length !== 0) signsEls = origSignsEl;

    for (var s = 0, nSigns = signsEls.length; s < nSigns; s++)
        speedLimits.push(signsEls[s].children[0].innerHTML);
    return speedLimits;
};

SL.createSpeedSigns = function() {
    if (!SL.currentCountry) SL.checkCountry();

    var signsHTML = '<div id="btnCMClearSLs" class="fa fa-ban"><div>0</div></div>',
        signsCSSEl, signsCSS, speedLimits, speedSignSettings,
        country = SL.currentCountry,
        signsHolderEl = document.getElementById('signsholder_cm');

    if (document.getElementById('cmSignsWait') !== null ) document.getElementById('cmSignsWait').remove();

    if (SL.speedhelperIsPresent === true || document.getElementById('cmSpeedhelperCSS') !== null) {
        if (document.getElementById('cmSpeedSignsCSS')) {
            document.getElementById('cmSpeedSignsCSS').remove();
            if (document.getElementById('signsholder_cm') !== null) document.getElementById('signsholder_cm').className = '';
        }
        if (contextMenuSettings.speedhelper && contextMenuSettings.speedhelper[country] && contextMenuSettings.speedhelper[country].speeds)
            speedLimits = contextMenuSettings.speedhelper[country].speeds;
        else {
            speedLimits = SL.getSpeedLimits();
            contextMenuSettings.speedhelper[country] = {speeds: speedLimits};
            localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
        }
    } else {
        if (contextMenuSettings.speedSigns[country] !== undefined && contextMenuSettings.speedSigns[country].speeds !== undefined && contextMenuSettings.speedSigns[country].speeds.length !== 0) {
            if (contextMenuSettings.speedSigns[country].signShape === undefined)
                contextMenuSettings.speedSigns[country].signShape = contextMenuSettings.speedSigns.default.signShape;

            if (contextMenuSettings.speedSigns[country].signBorderColor === undefined)
                contextMenuSettings.speedSigns[country].signBorderColor = contextMenuSettings.speedSigns.default.signBorderColor;

            speedSignSettings = contextMenuSettings.speedSigns[country];
            speedLimits = speedSignSettings.speeds;
        } else {
            speedSignSettings = contextMenuSettings.speedSigns.default;
            speedLimits = speedSignSettings.speeds;
            if (SL.imperial.useMPH)
                speedLimits = speedLimits.slice(0,15);
            else
                speedLimits = speedLimits.filter((a,i) => (Number.isInteger(a/10)) ? i : false);
            contextMenuSettings.speedSigns[country] = { speeds: speedLimits,
                                                        signShape: speedSignSettings.signShape,
                                                        signBorderColor: speedSignSettings.signBorderColor};
        }
        localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);

        if (signsHolderEl === null) {
            signsHolderEl = document.createElement('div');
            signsHolderEl.id = 'signsholder_cm';
            document.getElementById('signsContainer').appendChild(signsHolderEl);
        }

        signsCSSEl = document.getElementById('cmSpeedSignsCSS');
        if (signsCSSEl !== null) signsCSSEl.remove();

        signsCSSEl = document.createElement('style');
        signsCSSEl.type = 'text/css';
        signsCSSEl.id = 'cmSpeedSignsCSS';
        signsCSS =
            '#signsholder_cm>div[id^="sign"] { cursor: pointer; float: left; border-color: ' + speedSignSettings.signBorderColor + '; border-style: solid; background-color: #F5FCFF; position: relative; }\n' +
            '#signsholder_cm.cm-sl-circ>div[id^="sign"] { line-height: 1.8; letter-spacing: -0.9px; border-width: 3px; width: 30px; height: 30px; margin: 0px 0px 4px 3px; border-radius: 50%; font-family: helvetica, arial, "open sans"; }\n' +
            '#signsholder_cm.cm-sl-sqr>div[id^="sign"] { line-height: 1.9; letter-spacing: 0.5px; border-width: 2px; width: 30px; height: 30px; margin: 0px 1px 4px 2px; border-radius: 3px; opacity: 0.95; }\n' +
            '#signsholder_cm.cm-sl-circ>#btnCMClearSLs { border: 3px solid transparent; width: 30px; height: 30px; margin: -4px 0px 4px 3px; }\n' +
            '#signsholder_cm.cm-sl-sqr>#btnCMClearSLs { border: 2px solid transparent; width: 30px; height: 30px; margin: -3px 1px 4px 2px; }\n' +
            '#signsholder_cm>div>* { opacity: 1; position: relative; text-align: center; vertical-align: middle; color: #000; font-weight: bold; font-size: 14px; margin-left: -1px; }\n' +
            '#signsholder_cm.cm-sl-sqr>div>* { margin-left: 0; padding-top: 1px; }\n';

        signsCSSEl.innerHTML = signsCSS;
        document.body.appendChild(signsCSSEl);

        switch (speedSignSettings.signShape) {
            case 'Square':
                signsHolderEl.classList.remove('cm-sl-circ');
                signsHolderEl.classList.add('cm-sl-sqr');
                break;
            case 'Circle':
                signsHolderEl.classList.add('cm-sl-circ');
                signsHolderEl.classList.remove('cm-sl-sqr');
                break;
        }
    }

    for (var sl=0, slLength = speedLimits.length; sl < slLength; sl++)
        signsHTML += '<div id="sign' + speedLimits[sl] + '"><div>' + speedLimits[sl] + '</div></div>';

    signsHolderEl.innerHTML = signsHTML;
    SL.signsContainerHTML = document.getElementById('signsContainer').innerHTML;
};

SL.removeSpeedSign = function(evt) {
    var speedVal = evt.target.firstElementChild.innerHTML,
        speedLimits = SL.getSpeedLimits();

    if (/\d+/.test(speedVal)) {
        speedLimits = speedLimits.join().replace(speedVal,'').match(/\d+/g);
        if (SL.speedhelperIsPresent === false)
             contextMenuSettings.speedSigns[SL.currentCountry].speeds = speedLimits;
        else contextMenuSettings.speedhelper[SL.currentCountry].speeds = speedLimits;

        localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
        evt.target.remove();
        SL.signsContainerHTML = document.getElementById('signsContainer').innerHTML;
    }
};

SL.closeSpeedSignsEditor = function () {
    //document.querySelector('#cmMenuHeaderTitle>.fa-pencil').onclick = SL.editSpeedSigns;
    document.getElementById('cmContextMenu').addEventListener('mouseenter', addHotkeyListener, false);
    window.addEventListener('keydown', menuShortcutKeys, true);
    cmlog([2,2],'Removed focus from speed limit edit, so adding global hotkey listener again');
    if (!document.getElementById('cmPinMenu').value) {
        cmlog([2,2], 'Adding event listners to allow menu to close');
        addSpecialMenuListeners();
    }

    document.getElementById('cmMenuSLEdit').remove();
    document.getElementById('btnCMSLEditDone').previousElementSibling.style.color = '';
    document.getElementById('btnCMSLEditDone').remove();
};

SL.saveSpeedSignEdits = function(e) {
    e.stopPropagation();
    var editedSpeedLimits = document.querySelector('#cmMenuSLEdit textarea').value,
        country = SL.currentCountry;

    if (editedSpeedLimits.length !== 0) {
        editedSpeedLimits = editedSpeedLimits.match(/\d+/g);
        contextMenuSettings.speedSigns[country] = {};

        if (SL.speedhelperIsPresent === false) {
            contextMenuSettings.speedSigns[country].speeds = editedSpeedLimits;
            contextMenuSettings.speedSigns[country].signShape = document.querySelector('#cmMenuSLEdit select').value;
            contextMenuSettings.speedSigns[country].signBorderColor = document.querySelector('#cmMenuSLEdit input[name="signBorderColor"]').value;
        }
        else
            contextMenuSettings.speedhelper[country] = {speeds: editedSpeedLimits};
    }

    localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
    SL.createSpeedSigns();
    SL.addListenersToSigns(false);
    //document.querySelector('#cmMenuHeaderTitle>.fa-pencil').onclick = SL.editSpeedSigns;

    setTimeout(SL.closeSpeedSignsEditor,150);
};

SL.editSpeedSigns = function(evt) {
    evt.stopPropagation();
    if (document.getElementById('cmMenuSLEdit') !== null)
        SL.closeSpeedSignsEditor();
    else {
        try {
            document.getElementById('cmContextMenu').removeEventListener('mouseenter', addHotkeyListener, false);
            window.removeEventListener('keydown', menuShortcutKeys, true);
            cmlog([2,2],'removing global hotkey listener');
            if (!document.getElementById('cmPinMenu').value) {
                cmlog([2,2],'Preventing menu from closing by removing event listeners');
                window.removeEventListener('click', closeContextMenu, false);
                document.getElementById('toolbar').removeEventListener('mouseenter', closeContextMenu, false);
            }

            evt.target.style.color = '#FFF';

            SL.checkCountry();
            var speedLimits,
                editSLEl = document.createElement('div'),
                country = SL.currentCountry;

            editSLEl.id = 'cmMenuSLEdit';
            editSLEl.className = 'cm-menu-section';
            editSLEl.style.display = 'block';
            editSLEl.style.padding = '5px 10px';
            editSLEl.style.position = 'relative';
            editSLEl.style.color = '#234350';
            editSLEl.style.fontSize = '10px';
            editSLEl.style.textTransform = 'uppercase';
            editSLEl.style.letterSpacing = '-0.3px';
            editSLEl.style.fontWeight = 'bold';
            if (SL.speedhelperIsPresent !== true && document.getElementById('cmSpeedhelperCSS') === null) {
                if (contextMenuSettings.speedSigns[country] !== undefined && contextMenuSettings.speedSigns[country].speeds !== undefined && contextMenuSettings.speedSigns[country].speeds.length !== 0) {
                    speedSignSettings = contextMenuSettings.speedSigns[country];
                    speedLimits = speedSignSettings.speeds.join(' ');
                } else {
                    speedSignSettings = contextMenuSettings.speedSigns.default;
                    speedLimits = SL.getSpeedLimits().join(' ');
                }

                editSLEl.innerHTML = '<div style="display: flex; position: relative">' +
                '<p style="min-width: 50%">&nbsp;Shape <select style="margin: 3px 0 0; padding: 0px 3px; border-radius: 5px; height: 20px; width: 70px; display: block;"><option selected>Circle</option><option>Square</option></select></p>' +
                '<p style="min-width: 30%;">&nbsp;Border <input type="color" value="' + speedSignSettings.signBorderColor + '" name="signBorderColor" list="signBorderColorList" style="margin: 3px 0 0; display: block; border-radius: 5px; padding: 3px 2px; height: 20px; border-color: transparent; width: 50px; background-color: rgba(255, 255, 255, 0.3);"></input>' +
                '<datalist id="signBorderColorList"><option>#34444B</option><option>#DC0F00</option><option>#03A9F4</option><option>#416B7C</option><option>#888888</option></datalist></p></div>' +
                '<p>&nbsp;Add/Remove Speed Limits<textarea class="form-control" style="max-width: 100%; height: auto; margin: 3px 0px 0px; word-spacing: 2px; font-weight: 600; padding: 2px 8px;">' + speedLimits + '</textarea></p>';

                document.getElementById('cmMenuContent').insertBefore(editSLEl, document.getElementById('cmSpeedLimit'));
                document.querySelector('#cmMenuSLEdit select').value = speedSignSettings.signShape;
            } else {
                if (contextMenuSettings.speedhelper[country] !== undefined) speedLimits = contextMenuSettings.speedhelper[country].speeds.join(' ');
                else speedLimits = SL.getSpeedLimits().join(' ');

                editSLEl.innerHTML =
                '<p>&nbsp;Add/Remove Speed Limits<textarea class="form-control" style="max-width: 100%; height: auto; margin: 3px 0px 0px; word-spacing: 2px; font-weight: 600; padding: 2px 8px;">' + speedLimits + '</textarea></p>';
                document.getElementById('cmMenuContent').insertBefore(editSLEl, document.getElementById('cmSpeedLimit'));
            }
            document.getElementById('cmMenuHeaderTitle').innerHTML += '<span id="btnCMSLEditDone" style="float: right; padding-right: 8px; margin-right: 2px; display: inline-flex; color: greenyellow; border-right: 1px solid #D8E9EF; cursor: pointer;"><i class="fa fa-check fa-fw"></i> DONE</span>';
            document.getElementById('btnCMSLEditDone').onclick = SL.saveSpeedSignEdits;
            document.querySelector('#cmMenuHeaderTitle>.fa-pencil').onclick = SL.editSpeedSigns;
        } catch(err) { console.error(err); }
    }
};

//------------------------------------------------------------------------------
SL.reduceSpeedhelperOverhead = function () {
	cmlog([1,1], 'SL.reduceSpeedhelperOverhead()');
    if (document.getElementById('cmSpeedhelperCSS')) document.getElementById('cmSpeedhelperCSS').remove();
    if (document.getElementById('cmSpeedSignsCSS')) {
        document.getElementById('cmSpeedSignsCSS').remove();
        if (document.getElementById('signsholder_cm') !== null) document.getElementById('signsholder_cm').className = '';
    }

    var speedhelperCSSEl = document.createElement('style');
    speedhelperCSSEl.type = 'text/css';
    speedhelperCSSEl.id = 'cmSpeedhelperCSS';
    speedhelperCSSEl.innerHTML =
        '#signsholder_cm>div[id^="sign"], #btnCMClearSLs {margin-bottom: 1px; ' + document.getElementById('signsholder').children[0].getAttribute('style') + '}\n' +
        '#signsholder_cm>div[id^="sign"]>* {' + document.querySelector('#signsholder>div[id^="sign"]>*').getAttribute('style') + '}\n';

    document.body.appendChild(speedhelperCSSEl);

    $('#signsholder_cm>div[id^="sign"]:not([id="signsError"]').removeAttr('style');
    $('#signsholder_cm>div[id^="sign"]>div').removeAttr('style');

    SL.signsContainerHTML = document.getElementById('signsContainer').innerHTML;
    //return document.getElementById('cmMenuContent').innerHTML;
};
//===============================================================================
SL.checkUnits = function(speedVal) {
    if(speedVal === '')
        return speedVal;
    speedVal = Number(speedVal);
    if (SL.imperial.convertUnits === 1)
        return Math.round(speedVal * SL.imperial.mph2kph);
    else if (SL.imperial.convertUnits === 2)
        return Math.round(speedVal * SL.imperial.kph2mph);
    else
        return speedVal;
};

SL.addSpeedSignAB = function(speedVal) {
	var fwdSLMenu = document.querySelector('input[name="fwdMaxSpeed_cm'),
		fwdSL = document.querySelector('input[name="fwdMaxSpeed"]'),
		fwdChkBox = document.getElementById('fwdMaxSpeedUnverifiedCheckbox'),
		prevFwdSpeedVal = fwdSLMenu.value,
		numSegsSelected = getSelectedSegmentCount(),
		pauseTime = (numSegsSelected > 10) ? (50+numSegsSelected) : 0;

    cmlog([5,3],speedVal);
    if (fwdSL.disabled === false) {
    	document.getElementById('cmWaitCover').style.display = 'block';
        speedVal = SL.checkUnits(speedVal);

		requestAnimationFrame(function(){
			var fwdChkBoxMenu = document.getElementById('fwdMaxSpeedUnverifiedCheckbox_cm');
	        if (fwdChkBoxMenu !== null) fwdChkBoxMenu.checked = true;
			fwdSLMenu.value = speedVal;
		});

    	setTimeout(function(){
	    	if (fwdChkBox !== null && speedVal === prevFwdSpeedVal) {
				fwdChkBox.checked = true;
				fwdChkBox.dispatchEvent(changeEvent);
                fwdChkBox.dispatchEvent(focusOut);
			} else if (fwdSL !== null) {
	    		fwdSL.value = speedVal;
	    		fwdSL.dispatchEvent(changeEvent);
                fwdSL.dispatchEvent(focusOut);
                $('input[name="fwdMaxSpeed"]').val(speedVal).change().focusout();
	    		//$(fwdSL).val(speedVal).change();
	    		if (fwdChkBox !== null) setTimeout(function(){fwdChkBox.checked = true;},20);
			}

            if (!document.getElementById('cmPinMenu').value) setTimeout(closeContextMenu, 150);
            else setTimeout(SL.highlightSpeedSigns,50);

			document.getElementById('cmWaitCover').style.display = 'none';
		},pauseTime);
    }
};
SL.addSpeedSignBA = function(speedVal) {
	var revSLMenu = document.querySelector('input[name="revMaxSpeed_cm'),
		revSL = document.querySelector('input[name="revMaxSpeed"]'),
		revChkBox = document.getElementById('revMaxSpeedUnverifiedCheckbox'),
		prevRevSpeedVal = revSLMenu.value,
		numSegsSelected = getSelectedSegmentCount(),
		pauseTime = (numSegsSelected > 10) ? (50+numSegsSelected) : 0;

	cmlog([5,3],speedVal);
    if (revSL.disabled === false) {
    	document.getElementById('cmWaitCover').style.display = 'block';
        speedVal = SL.checkUnits(speedVal);

		requestAnimationFrame(function(){
			var revChkBoxMenu = document.getElementById('revMaxSpeedUnverifiedCheckbox_cm');
			if (revChkBoxMenu !== null) revChkBoxMenu.checked = true;
			revSLMenu.value = speedVal;
		});

    	setTimeout(function(){
	    	if (revChkBox !== null && speedVal === prevRevSpeedVal) {
	    		revChkBox.checked = true;
	    		revChkBox.dispatchEvent(changeEvent);
                revChkBox.dispatchEvent(focusOut);
	    	} else if (revSL !== null) {
	    		revSL.value = speedVal;
	    		revSL.dispatchEvent(changeEvent);
                revSL.dispatchEvent(focusOut);
	    		//$(revSL).val(speedVal).change();
                $('input[name="revMaxSpeed"]').val(speedVal).change().focusout();
	    		if (revChkBox !== null) setTimeout(function(){revChkBox.checked = true;},20);
	    	}

            if (!document.getElementById('cmPinMenu').value) setTimeout(closeContextMenu, 150);
            else setTimeout(SL.highlightSpeedSigns,50);

			document.getElementById('cmWaitCover').style.display = 'none';
		},pauseTime);
    }
};

SL.addSpeedSignBoth = function(speedVal) {
	var fwdSLMenu = document.querySelector('input[name="fwdMaxSpeed_cm'),
		revSLMenu = document.querySelector('input[name="revMaxSpeed_cm'),
		fwdSL = document.querySelector('input[name="fwdMaxSpeed"]'),
		revSL = document.querySelector('input[name="revMaxSpeed"]'),
		fwdChkBox = document.getElementById('fwdMaxSpeedUnverifiedCheckbox'),
		revChkBox = document.getElementById('revMaxSpeedUnverifiedCheckbox'),
		prevFwdSpeedVal, prevRevSpeedVal,
		numSegsSelected = getSelectedSegmentCount(),
		pauseTime = (numSegsSelected > 10) ? 60 : 0;

	cmlog([5,3],speedVal);
	if ((revSLMenu && revSLMenu.parentNode.style.display === 'none') || revSLMenu === null)
		SL.addSpeedSignAB(speedVal);
	else if ((fwdSLMenu && fwdSLMenu.parentNode.style.display === 'none') || fwdSLMenu === null)
		SL.addSpeedSignBA(speedVal);
	else if (fwdSL.disabled === false && revSL.disabled === false) {
    	document.getElementById('cmWaitCover').style.display = 'block';
        speedVal = SL.checkUnits(speedVal);
		prevFwdSpeedVal = fwdSLMenu.value;
		prevRevSpeedVal = revSLMenu.value;

		requestAnimationFrame(function(){
			var fwdChkBoxMenu = document.getElementById('fwdMaxSpeedUnverifiedCheckbox_cm'),
				revChkBoxMenu = document.getElementById('revMaxSpeedUnverifiedCheckbox_cm');
	        if (fwdChkBoxMenu !== null) fwdChkBoxMenu.checked = true;
			if (revChkBoxMenu !== null) revChkBoxMenu.checked = true;
	    	fwdSLMenu.value = speedVal; //$('#cmSpeedLimit input[type="number"]').val(speedVal);
	    	revSLMenu.value = speedVal;
		});

    	setTimeout(function(){
	    	if (fwdChkBox !== null && speedVal === prevFwdSpeedVal) {
				fwdChkBox.checked = true;
				fwdChkBox.dispatchEvent(changeEvent);
                fwdChkBox.dispatchEvent(focusOut);
				//$('#fwdMaxSpeedUnverifiedCheckbox').prop('checked', true).change();
			} else if (fwdSL !== null) {
	    		fwdSL.value = speedVal;
	    		fwdSL.dispatchEvent(changeEvent);
                fwdSL.dispatchEvent(focusOut);
				$('input[name="fwdMaxSpeed"]').val(speedVal).change().focusout();
			}

	    	if (revChkBox !== null && speedVal === prevRevSpeedVal) {
	    		revChkBox.checked = true;
	    		revChkBox.dispatchEvent(changeEvent);
                revChkBox.dispatchEvent(focusOut);
    			//$('#revMaxSpeedUnverifiedCheckbox').prop('checked', true).change();
	    	} else if (revSL !== null) {
    			//revSL.value = speedVal;
    			//revSL.dispatchEvent(changeEvent);
	    		$('input[name="revMaxSpeed"]').val(speedVal).change().focusout();
	    		if (fwdChkBox !== null) setTimeout(function(){fwdChkBox.checked = true;},20);
	    		if (revChkBox !== null) setTimeout(function(){revChkBox.checked = true;},40);
	    	}

            if (fwdSL && parseInt(fwdSL.value) !== parseInt(speedVal)) fwdSL.value = speedVal;
            if (revSL && parseInt(revSL.value) !== parseInt(speedVal)) revSL.value = speedVal;

            if (!document.getElementById('cmPinMenu').value) setTimeout(closeContextMenu, 150);
        	else setTimeout(SL.highlightSpeedSigns,50);

			/*setTimeout(function(){
				try { //do it again just in case... sometimes necessary...
	        		$('input[name="revMaxSpeed"]').val(speedVal).change();
				} catch(err) {}
			}, 150);*/
			document.getElementById('cmWaitCover').style.display = 'none';
		}, pauseTime);
    }
};

SL.addListenersToSigns = function (forceBuildNewMenu) {
    // Add clear SL button:
    /*if (document.getElementById('btnCMClearSLs') === null) {
        document.getElementById('signsholder_cm').innerHTML = '<div id="btnCMClearSLs" class="fa fa-ban"><div id="spd_0">0</div></div>' +
            document.getElementById('signsholder_cm').innerHTML;
    }*/
    var cmSpeedSigns = document.getElementById('signsholder_cm').children;
    for (var ss = cmSpeedSigns.length; ss--;) {
        //--------------------------------------------------------------
        cmSpeedSigns[ss].addEventListener('click', function (e) {
            e.preventDefault();
            var speedVal;
            if (!this.classList.length || !this.classList.contains('cm-sl-verified'))
                speedVal = this.firstElementChild.innerHTML;
            else
                speedVal = 0;

            if (e.shiftKey) { //AB - fwd
                requestAnimationFrame(function(){
                    SL.addSpeedSignAB(speedVal);
                });
            } else if (e.ctrlKey || e.altKey || e.metaKey ) { //BA - rev
                requestAnimationFrame(function(){
                    SL.addSpeedSignBA(speedVal);
                });
            } else {
                requestAnimationFrame(function(){
                    SL.addSpeedSignBoth(speedVal);
                });
            }
        }, false);
        //--------------------------------------------------------------
        cmSpeedSigns[ss].addEventListener('mousedown', function (ev) {
            //console.info(this);
            this.draggable = true;
            if (document.getElementById('cmPinMenu').value) {
                document.getElementById('cmContextMenu').removeEventListener('dragstart', allowMenuDrag, false);
                document.getElementById('cmContextMenu').draggable = false;
                window.addEventListener('mouseup', resetDrag, false);
            }
        }, false);

        cmSpeedSigns[ss].addEventListener('dragstart', function (ev) {
            //console.info(this);
            this.style.opacity = 0.3;
            this.children[0].opacity = 0.7;
            ev.dataTransfer.setData('text', this.children[0].innerHTML);
            ev.dataTransfer.setDragImage(this, ev.offsetX, ev.offsetY);
        }, false);

        cmSpeedSigns[ss].addEventListener('dragend', function (ev) {
            this.style.opacity = '';
            this.children[0].opacity = '';
            this.draggable = false;
            resetDrag();
            window.removeEventListener('mouseup', resetDrag, false);
        }, false);
    }

    //-----------------------------------------------
    var slCurrentElementStatus =
            [!!document.getElementById('fwdMaxSpeedUnverifiedCheckbox'),
            !!document.getElementById('revMaxSpeedUnverifiedCheckbox'),
            !!document.getElementsByName('fwdMaxSpeed').length,
            !!document.getElementsByName('revMaxSpeed').length],
        slMenuElementFlags =
            [!!document.getElementById('fwdMaxSpeedUnverifiedCheckbox_cm')+1,
            !!document.getElementById('revMaxSpeedUnverifiedCheckbox_cm')+1,
            document.getElementsByName('fwdMaxSpeed_cm').length+1,
            document.getElementsByName('revMaxSpeed_cm').length+1];

    for (var cc = 4, slCurrentElementTotal=0; cc--;)
        slCurrentElementTotal += slCurrentElementStatus[cc];

    if (forceBuildNewMenu === null || SL.speedhelperIsPresent === null) {
        /*SL.signsContainerHTML = null;*/
    } else {
        if (forceBuildNewMenu === true && SL.speedhelperIsPresent === true) SL.reduceSpeedhelperOverhead();
        if (forceBuildNewMenu === true || slCurrentElementTotal >= SL.slSavedMaxElementTotal) {
            SL.cmMenuContentHTML = document.getElementById('cmMenuContent').innerHTML;
            SL.slSavedMaxElementTotal = slCurrentElementTotal;
            SL.slSavedMenuElementFlags = slMenuElementFlags;
            cmlog([4,4],'*** SL.cmMenuContentHTML replaced ***');
        }
    }
    SL.highlightSpeedSigns(); // this is necessarily at the end to play catchup bc of the slower initialization times of Speedhelper elements
};

//--------------------------------------------------------------------------
SL.populateSpeedMenu = function (contextMenuSettings, nodeLabel) {
	cmlog([1,1], 'SL.populateSpeedMenu(contextMenuSettings, ' + nodeLabel + ')');
    $('#cmMenuNoContent')[0].style.display = 'none';
    $('#cmMenuContent')[0].style.display = 'block';

    if (SL.menuResetEvent === true) SL.checkCountry();

    var slCurrentElementStatus = [!!document.getElementById('fwdMaxSpeedUnverifiedCheckbox'),
        !!document.getElementById('revMaxSpeedUnverifiedCheckbox'),
        !!document.getElementsByName('fwdMaxSpeed').length,
        !!document.getElementsByName('revMaxSpeed').length],
        signholderEl, forceBuildNewMenu = SL.forceBuildNewMenu,
        slMenuElementFlags = [!!document.getElementById('fwdMaxSpeedUnverifiedCheckbox_cm')+1,
        !!document.getElementById('revMaxSpeedUnverifiedCheckbox_cm')+1,
        document.getElementsByName('fwdMaxSpeed_cm').length+1,
        document.getElementsByName('revMaxSpeed_cm').length+1];

    if (forceBuildNewMenu === true) {
        SL.forceBuildNewMenu = false;
        SL.menuResetEvent = true;
        SL.slSavedMenuElementFlags = false;
        SL.slSavedMaxElementTotal = 0;
        SL.cmMenuContentHTML = null;
        SL.signsContainerHTML = null;
    }


    if (SL.slSavedMenuElementFlags === false) SL.slSavedMenuElementFlags = slMenuElementFlags;

    for (var cc = 4, slNumSavedElementsMatched = 0, slNumElementsMatched = 0, slCurrentElementTotal=0; cc--;) {
        slNumElementsMatched += (((slMenuElementFlags[cc]*slCurrentElementStatus[cc]-1)>0)===slCurrentElementStatus[cc]);
        slNumSavedElementsMatched += (((SL.slSavedMenuElementFlags[cc]*slCurrentElementStatus[cc]-1)>0)===slCurrentElementStatus[cc]);
        slCurrentElementTotal += slCurrentElementStatus[cc];
    }
    cmlog([4,3], 'SL.slSavedMaxElementTotal', SL.slSavedMaxElementTotal, '| slCurrentElementTotal', slCurrentElementTotal);
    cmlog([4,3], 'slNumSavedElementsMatched', slNumSavedElementsMatched, '| slNumElementsMatched', slNumElementsMatched);
    cmlog([4,3], 'SL.slSavedMenuElementFlags', SL.slSavedMenuElementFlags, '| slMenuElementFlags', slMenuElementFlags);

    if ( forceBuildNewMenu === true || SL.cmMenuContentHTML === null || slNumElementsMatched !== 4 ||
    	(SL.menuResetEvent === true && slNumElementsMatched !== 4) ||
    	(slCurrentElementTotal === 4 && SL.slSavedMaxElementTotal !== 4) ) {

        resetContextMenu(contextMenuSettings);
        document.getElementById('cmMenuHeaderTitle').innerHTML = 'Edit Speed Limits <i class="fa fa-pencil fa-pull-right" style="font-size: 12px; cursor: pointer;"></i>';

        if (SL.cmMenuContentHTML && slNumSavedElementsMatched === 4) {
        	cmlog([4,1],'Replace - Copy Saved and Rebuild');
        	document.getElementById('cmMenuContent').innerHTML = SL.cmMenuContentHTML;
        	SL.menuResetEvent = false;

        } else {
 			SL.menuResetEvent = true;
            try {
    	    	cmlog([4,1],'Replace - Overwrite with Source and Rebuild');
    	    	document.getElementById('cmMenuContent').innerHTML = document.querySelector('#segment-edit-general div.speed-limit').outerHTML;
    	    	let speedLimit = document.getElementById('cmMenuContent').children[0];
                speedLimit.innerHTML = '<div id="signsContainer" style="min-height: ' + ((SL.signsContainerHeight) ? (SL.signsContainerHeight + 'px; ') : 'auto; ') + 'margin-bottom: 10px; opacity: 0.9;"></div><div class="form-inline">' + speedLimit.innerHTML + '</div>';
                speedLimit.id = 'cmSpeedLimit';
                speedLimit.className = 'cm-speed-limit cm-menu-section';

                signholderEl = document.querySelector('#cmSpeedLimit #signsholder');

                if (SL.speedhelperIsPresent !== null && SL.signsContainerHTML !== null)
	    	        document.getElementById('signsContainer').innerHTML = SL.signsContainerHTML;
	    	    else if (signholderEl !== null) {
                    signholderEl.id = 'signsholder_cm';
	    	        document.getElementById('signsContainer').appendChild(document.getElementById('signsholder_cm')); // Move the signs to its own container
	    	        SL.reduceSpeedhelperOverhead();
	    	        SL.createSpeedSigns();
                } else if (document.getElementById('cmSignsWait') === null) {
                        document.getElementById('cmSpeedLimit').innerHTML = '<div id="cmSignsWait"><p><i class="fa fa-spinner fa-pulse fa-lg"></i></p><p>Looking for WME Speedhelper...<br>Please wait a moment.</p></div>' +
                            document.getElementById('cmSpeedLimit').innerHTML;
                }
            } catch (err) {
            	cmlog([4,2],'Replace - Caught. No SpeedHelper or SpeedHelper is not ready.', err);
            }
        }

        //--------------------------------------------------------------------------
        try {
            var wazeVerifyChkBoxLabel = document.querySelectorAll('#segment-edit-general div.speed-limit input[type="checkbox"]+label'),
                wazeChkbox, wazeChkboxSelector;
            // Add event listeners for verified SL checkbox in menu
            for (var cb = 0; cb < wazeVerifyChkBoxLabel.length; cb++) {
                wazeChkbox = wazeVerifyChkBoxLabel[cb].parentNode.children[0];
                let cmChkboxSelector = '#cmSpeedLimit ' + '#' + wazeChkbox.id;

                if (SL.menuResetEvent) document.querySelector(cmChkboxSelector).id = wazeChkbox.id + '_cm';

                document.querySelector(cmChkboxSelector + '_cm').addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.parentNode.children[0].checked = !document.getElementById(this.parentNode.children[0].id.slice(0, -3)).checked;
                }, false);
            }
        } catch (err) {cmlog([4,2], 'wazeVerifyChkBoxLabel', err);}

        //--------------------------------------------------------------------------
        try {
            var wazeSpeedInput = document.querySelectorAll('#segment-edit-general div.speed-limit input[type="number"]'),
                wazeSpeedInputLength = wazeSpeedInput.length,
                cmSpeedInput, cmSpeedInputSelector_orig, cmSpeedInputSelector, nm;

            for (nm = 0; nm < wazeSpeedInputLength; nm++) {
            	cmSpeedInputSelector_orig = '#cmSpeedLimit input[name="' + wazeSpeedInput[nm].name + '"]';
            	cmSpeedInputSelector = '#cmSpeedLimit input[name="' + wazeSpeedInput[nm].name + '_cm"]';

                if (SL.menuResetEvent)
                	document.querySelector(cmSpeedInputSelector_orig).setAttribute('name', wazeSpeedInput[nm].name + '_cm');

                cmSpeedInput = document.querySelector(cmSpeedInputSelector);
                cmSpeedInput.addEventListener('click', function (e) {
                    e.stopPropagation();
                    this.select();
					document.getElementById('cmContextMenu').removeEventListener('mouseenter', addHotkeyListener, false);
                    window.removeEventListener('keydown', menuShortcutKeys, true);
					cmlog([2,2],'Editing speed value, so removing global hotkey listener');
                }, false);

                cmSpeedInput.addEventListener('blur', function (e) {
					document.getElementById('cmContextMenu').addEventListener('mouseenter', addHotkeyListener, false);
                    window.addEventListener('keydown', menuShortcutKeys, true);
                    cmlog([2,2],'Removed focus from speed input field, so adding global hotkey listener again');
                    $('input[name="' + this.name.slice(0, -3) + '"]').val(this.value).change();
                }, false);

                cmSpeedInput.addEventListener('change', function (e) {
                    //e.stopPropagation();
                    $('input[name="' + this.name.slice(0, -3) + '"]').val(this.value).change();
                }, false);
            }
        } catch (err) {cmlog([4,2], 'cmSpeedInput', err);}
		//--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        try { // Try adding some event listeners for closing the menu if not pinned:
            if (!document.getElementById('cmPinMenu').value) {
                document.getElementById('cmContextMenu').addEventListener(
                    'mouseleave',
                    function () {
                        cmlog([2,2], 'Adding event listners to allow menu to close');
                        addSpecialMenuListeners();
                        //$('input[name="fwdMaxSpeed_cm"]').val($('input[name="fwdMaxSpeed"]').val());
                        //$('input[name="revMaxSpeed_cm"]').val($('input[name="revMaxSpeed"]').val());
                    }, false);

                document.getElementById('cmContextMenu').addEventListener(
                    'mouseenter',
                    function () { //prevent menu from closing
                    	cmlog([2,2],'Preventing menu from closing by removing event listeners');
                        window.removeEventListener('click', closeContextMenu, false);
                        document.getElementById('toolbar').removeEventListener('mouseenter', closeContextMenu, false);
                    }, false);
            }
        } catch (err) { cmlog([4,2], 'addSpecialMenuListeners', err); }
                //--------------------------------------------------------------------------
        document.querySelector('#cmMenuHeaderTitle>.fa-pencil').onclick = SL.editSpeedSigns;
        //--------------------------------------------------------------------------

        // Add event listener for clearing SLs of each direction
        let fwdSpeedEl = document.querySelector('input[name="fwdMaxSpeed_cm"]');
        if (fwdSpeedEl) {
        	if (fwdSpeedEl.parentNode.querySelector('.fa-ban') === null) {
	            var clearSignFwd = document.createElement('span');
	            clearSignFwd.className = 'fa fa-ban';
            	fwdSpeedEl.parentNode.insertBefore(clearSignFwd, fwdSpeedEl.parentNode.children[0]);
            	clearSignFwd.addEventListener('click', function() {
                    requestAnimationFrame(function(){
		                SL.addSpeedSignAB('');
		            });
	            }, false);
            }
        }

       	let revSpeedEl = document.querySelector('input[name="revMaxSpeed_cm"]');
        if (revSpeedEl) {
        	if (revSpeedEl.parentNode.querySelector('.fa-ban') === null) {
	            var clearSignRev = document.createElement('span');
	            clearSignRev.className = 'fa fa-ban';
            	revSpeedEl.parentNode.insertBefore(clearSignRev, revSpeedEl.parentNode.children[0]);
            	clearSignRev.addEventListener('click', function() {
                    requestAnimationFrame(function(){
		                SL.addSpeedSignBA('');
		            });
	            }, false);
			}
        }

        // Add event listener for the checkbox
        if (document.getElementById('fwdMaxSpeedUnverifiedCheckbox_cm') !== null) {
            document.getElementById('fwdMaxSpeedUnverifiedCheckbox_cm').parentNode.addEventListener('click', function(e) {
                this.children[0].checked = !this.children[0].checked;
            }, false);
        }
        if (document.getElementById('revMaxSpeedUnverifiedCheckbox_cm') !== null) {
            document.getElementById('revMaxSpeedUnverifiedCheckbox_cm').parentNode.addEventListener('click', function(e) {
                this.children[0].checked = !this.children[0].checked;
            }, false);
        }

        // Add event listeners for drag-drop events
        fwdSpeedEl = document.querySelector('input[name="fwdMaxSpeed_cm"]');
        if (fwdSpeedEl) {
            // Allow drop event
            fwdSpeedEl.addEventListener('dragover', function(ev) {
                if (ev.preventDefault()) ev.preventDefault();
                this.style.border = '1px solid cyan';
                return false;
            }, false);
            fwdSpeedEl.addEventListener('dragleave', function(ev) {
                this.style.border = '';
            }, false);
            // Drop event
            fwdSpeedEl.addEventListener('drop', function(ev) {
                if (ev.preventDefault()) ev.preventDefault();
                var speedVal = ev.dataTransfer.getData('text');
                requestAnimationFrame(function(){
                    SL.addSpeedSignAB(speedVal);
                });
                this.style.border = '';
            }, false);
        }

        revSpeedEl = document.querySelector('input[name="revMaxSpeed_cm"]');
        if (revSpeedEl) {
            // Allow drop event
            revSpeedEl.addEventListener('dragover', function(ev) {
                if (ev.preventDefault()) ev.preventDefault();
                this.style.border = '1px solid cyan';
                return false;
            }, false);
            revSpeedEl.addEventListener('dragleave', function(ev) {
                this.style.border = '';
            }, false);
            // Drop event
            revSpeedEl.addEventListener('drop', function(ev) {
                if (ev.preventDefault()) ev.preventDefault();
                var speedVal = ev.dataTransfer.getData('text');
                requestAnimationFrame(function(){
                    SL.addSpeedSignBA(speedVal);
                });
                this.style.border = '';
            }, false);
        }
        //--------------------------------------------------------------------------

        var waitCount = 0,
            maxWait = 19, //~5 seconds
            signsContainerEl = document.getElementById('signsContainer');

        var waitForSpeedhelper = function () {
            var originalSpeedhelperEl = document.querySelector('#segment-edit-general div.speed-limit #signsholder');

            if (signsContainerEl.children.length === 0 || SL.speedhelperIsPresent === null) {
                if (originalSpeedhelperEl !== null) {
                    SL.menuResetEvent = false;
                    SL.speedhelperIsPresent = true;
                    signsContainerEl.innerHTML = originalSpeedhelperEl.outerHTML;
                    document.querySelector('#signsContainer>#signsholder').id = 'signsholder_cm';
                    setTimeout(function(){SL.signsContainerHeight = $('#signsholder_cm').height();},200);
                    SL.reduceSpeedhelperOverhead();
                    SL.createSpeedSigns();
                    SL.addListenersToSigns(forceBuildNewMenu);

                } else if (waitCount++ < maxWait) {
                    setTimeout(waitForSpeedhelper, 30*waitCount);
                    if (waitCount===10 && SL.speedhelperIsPresent === null) { //~1.5seconds ?
                        SL.createSpeedSigns();
                        SL.addListenersToSigns(null);
                    }
                } else {
                    SL.menuResetEvent = false;
                    SL.signsContainerHeight = false;
                    SL.speedhelperIsPresent = false;
                    SL.createSpeedSigns();
                    SL.addListenersToSigns(forceBuildNewMenu);
                }
            }
            return;
        };
        //------------------------------------------------------
        setTimeout(function () {
            if (signsContainerEl && signsContainerEl.children.length) {
                SL.menuResetEvent = false;
                setTimeout(function(){SL.signsContainerHeight = $('#signsholder_cm').height();},200);
                SL.addListenersToSigns(forceBuildNewMenu);
            } else if (SL.speedhelperIsPresent !== false)
                setTimeout(waitForSpeedhelper, 30);
            else { // SL.speedhelperIsPresent === false
                SL.menuResetEvent = false;
                SL.createSpeedSigns();
                SL.addListenersToSigns(forceBuildNewMenu);
            }
        }, 30); //timeout may be needed for countries with many speedlimit signs loaded by Speedhelper
        //------------------------------------------------------

    }

    var $fwdSL = $('input[name="fwdMaxSpeed"]'), hasFwdSL = ($fwdSL.length && !$fwdSL.prop('disabled')),
    	$revSL = $('input[name="revMaxSpeed"]'), hasRevSL = ($revSL.length && !$revSL.prop('disabled')),
    	hasOnlyOneSL = !(hasFwdSL && hasRevSL),
    	fwdSLMenu = document.querySelector('input[name="fwdMaxSpeed_cm"]'),
    	revSLMenu = document.querySelector('input[name="revMaxSpeed_cm"]'),
    	fwdChkBox, revChkBox, fwdMenuChkBox, revMenuChkBox;

    cmlog([5,3], 'hasFwdSL', hasFwdSL, 'hasRevSL', hasRevSL, 'hasOnlyOneSL', hasOnlyOneSL, 'nodeLabel', nodeLabel);

	if (hasFwdSL || hasRevSL) {
	    fwdMenuChkBox = document.getElementById('fwdMaxSpeedUnverifiedCheckbox_cm');
    	fwdChkBox = document.getElementById('fwdMaxSpeedUnverifiedCheckbox');
	    revMenuChkBox = document.getElementById('revMaxSpeedUnverifiedCheckbox_cm');
	    revChkBox = document.getElementById('revMaxSpeedUnverifiedCheckbox');

	    // Update values of the context menu
	    // Hide input fields that aren't relevant for selected segment(s)
	    if (fwdSLMenu !== null) {
            fwdSLMenu.disabled = false;
			if (hasOnlyOneSL || nodeLabel !== 'B') {
			    if (hasFwdSL) {
					fwdSLMenu.value = $fwdSL.val();
			    	fwdSLMenu.parentNode.style.display = 'inline-block';

				    if (fwdMenuChkBox !== null) {
                        fwdMenuChkBox.disabled = false;
					    if (fwdChkBox !== null) {
					    	fwdMenuChkBox.checked = fwdChkBox.checked;
					    	fwdMenuChkBox.parentNode.style.visibility = 'visible';
					    	fwdMenuChkBox.parentNode.style.display = 'inline-block';
					    } else {
					    	fwdMenuChkBox.parentNode.style.visibility = 'hidden';
					    	fwdMenuChkBox.parentNode.style.display = 'inline-block';
					    }
					}
			    } else {
			    	fwdSLMenu.parentNode.style.display = 'none';
			    	if (fwdMenuChkBox !== null) fwdMenuChkBox.parentNode.style.display = 'none';
			    }
			} else {
				fwdSLMenu.parentNode.style.display = 'none';
		    	 if (fwdMenuChkBox !== null) fwdMenuChkBox.parentNode.style.display = 'none';
		    }
		}

		if (revSLMenu !== null) {
            revSLMenu.disabled = false;
		    if (hasOnlyOneSL || nodeLabel !== 'A') {
			    if (hasRevSL) {
			    	revSLMenu.value = $revSL.val();
			    	revSLMenu.parentNode.style.display = 'inline-block';

				    if (revMenuChkBox !== null) {
                        revMenuChkBox.disabled = false;
					    if (revChkBox !== null) {
					    	revMenuChkBox.checked = revChkBox.checked;
					    	revMenuChkBox.parentNode.style.visibility = 'visible';
					    	revMenuChkBox.parentNode.style.display = 'inline-block';
					    } else {
					    	revMenuChkBox.parentNode.style.visibility = 'hidden';
					    	revMenuChkBox.parentNode.style.display = 'inline-block';
					    }
				    }
			    } else {
			    	revSLMenu.parentNode.style.display = 'none';
			    	if (revMenuChkBox !== null) revMenuChkBox.parentNode.style.display = 'none';
			    }
			} else {
				revSLMenu.parentNode.style.display = 'none';
		    	if (revMenuChkBox !== null) revMenuChkBox.parentNode.style.display = 'none';
		    }
		}

	    SL.highlightSpeedSigns();

    } else {
    	cmlog([4,2],'No SL. Hiding...');
        document.getElementById('cmMenuNoContent').style.display = 'block';
        document.getElementById('cmMenuContent').style.display = 'none';
	}
    //--------------------------------------------------------------------------
};

//==============================================================================================
var selectedItemsIsSegment = function () {
    var sel = W.selectionManager.getSelectedFeatures(), //returns empty array if nothing
        selLength = sel.length,
        s, segments = [];

	cmlog([1,1], 'selectedItemsIsSegment()');
    for (s = 0; s < selLength; s++)
        if (sel[s].model.type === 'segment') segments.push(sel[s]);

    return (segments.length) ? {nodeLabel: false, segments: segments} : false;
};
//----------------------------------------------------------------------------------------------
var selectionIsSegment = function (e) {
	cmlog([1,1], 'selectionIsSegment(e)');
    var sel, selLength, s, segments = [],
        numSelected, eventFeatures, evTarget, nodeLabel = false;

    // First check for segments under cursor (hover/mouseover)
    if (e && e.target)
    	evTarget = $(e.target).get(0); //normalization by jQuery is necessary for FF compatibility
    else
    	evTarget = false;

	if 	(evTarget && evTarget._featureId &&
    	(evTarget._geometryClass === "OpenLayers.Geometry.LineString" ||
         evTarget._geometryClass === "OpenLayers.Geometry.Point")) {

		e.preventDefault();

		if (evTarget._geometryClass === "OpenLayers.Geometry.Point" && evTarget._style) {
            cmlog([1,3], evTarget._featureId, evTarget._geometryClass, evTarget._style.label);

			if (evTarget._style.label === 'A')
				nodeLabel = 'A';
			else if (evTarget._style.label === 'B')
				nodeLabel = 'B';
		}

        sel = W.selectionManager.getSelectedFeatures(); //returns empty array if nothing
        selLength = sel.length;
        eventFeatures = W.map.segmentLayer.getFeatureById(evTarget._featureId); //segment layer -- returns null if nothing

        if (eventFeatures && eventFeatures.model.type === 'segment') {
            segments[0] = eventFeatures; //return result from W.map.segmentLayer.getFeatureById(._featureId) is the same as individual objects within the array returned by W.selectionManager.selectedItems
            try {
            	W.selectionManager.setSelectedModels([eventFeatures.model]); // [eventFeatures.model] is the same as the return result for one seg from W.model.segments.getByIds([id])
        	} catch(err) { cmlog([1,0], '<tantrum>'); console.error(err); }
        }

        //Now check for any selected segments... any duplicates of the hovered
        //segment will be dealt with in the next steps using object literals
        try {
	        for (s = 0; s < selLength; s++)
	            if (sel[s].model.type === 'segment') segments.push(sel[s]);
	    } catch(err) {
			if (e.type === 'selectionchanged') {
		        sel = e.selected;
		        selLength = sel.length;

		        for (s = 0; s < selLength; s++)
		            if (sel[s] && sel[s].model.type === 'segment') segments.push(sel[s]);
		    }
	    }

        document.getElementById('cmMenuNoContent').style.display = 'none';
        document.getElementById('cmMenuContent').style.display = 'block';

        return (segments.length) ? {nodeLabel: nodeLabel, segments: segments} : false; //no segments near cursor

    } else if (e.type === 'selectionchanged') {
        sel = e.selected;
        selLength = sel.length;

        for (s = 0; s < selLength; s++)
            if (sel[s] && sel[s].model.type === 'segment') segments.push(sel[s]);

        return (segments.length) ? {nodeLabel: false, segments: segments} : false; //no segments near cursor

    }
    else
        return false;
};

//----------------------------------------------------------------------------------------------

var setupSegmentContextMenu = function (e) {
	cmlog([1,0],'------------------------------------------------------------');
    cmlog([1,1], 'setupSegmentContextMenu()');
	if (document.getElementById('cmContextMenu') && $('#cmContextMenu')[0].style.display !== 'none') {
		var selectedStuff = selectionIsSegment(e);

	    if (selectedStuff) {
	    	if ($('#cmRSel')[0].value && document.getElementById('cmRSelAutoAdd'))
	    	    $('#cmRSelAutoAdd')[0].style.display = 'block';
            let segInfo;
	        switch (contextMenuSettings.clipboard) {
                case 3:
                    segInfo = getSegmentProperties(selectedStuff);
                    populateEditAttributes(segInfo, contextMenuSettings);
                    window.removeEventListener('click', closeContextMenu, false);
                    break;
	            case 2:
	                SL.populateSpeedMenu(contextMenuSettings, selectedStuff.nodeLabel);
	                break;
	            case 1:
	            case 0:
	                segInfo = getSegmentProperties(selectedStuff);
	                populateCopyMenu(segInfo, contextMenuSettings);
	                break;
	        }
	    } else if ($('#cmPinMenu')[0].value) {
			if (document.getElementById('cmRSelAutoAdd'))
			    $('#cmRSelAutoAdd')[0].style.display = 'none';
	        $('#cmMenuNoContent')[0].style.display = 'block';
	        $('#cmMenuContent')[0].style.display = 'none';
	        return false;
	    } else {
	    	cmlog([1,1],'No segment detected.');
	        return false;
	    }
	} else
		return false;
};

//=======================================================================================
//var pressedKeys = [];
var menuShortcutKeys = function (e) {
	cmlog([1,1], 'menuShortcutKeys()');
    switch (e.which) {
        case 49: //81: //q
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('cmClipboard').click();
            break;
        case 50: //87: //w
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('cmRSel').click();
            break;
        case 51: //69: //e
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('cmSpeed').click();
            break;
        default:
            return false;
    }
};

//--------------------------------------------------------------------------------
var cursorOffsetX, cursorOffsetY;

var moveMenu = function (evt) {
    //cmlog([1],'moveMenu()');
	try {
	    evt.preventDefault();
	    evt.stopPropagation();
	    //evt.dataTransfer.effectAllowed = 'move';
	    requestAnimationFrame( function() {
		    document.getElementById('cmContextMenu').classList.add('cm-drag');
		    document.getElementById('cmContextMenu').style.top = evt.clientY - cursorOffsetY + 'px';
		    document.getElementById('cmContextMenu').style.left = evt.clientX - cursorOffsetX + 'px';
		});
	} catch (err) { console.error(err); }
};

var placeMenu = function (endevt) {
	cmlog([1,1], 'placeMenu()');
    endevt.preventDefault();
    //endevt.dataTransfer.dropEffect = 'move';
	try {
	    //document.getElementById('cmContextMenu').style.display = 'block';
	    setTimeout(function(){document.getElementById('cmContextMenu').classList.remove('cm-drag');},50);
	    if (!isFirefox) {
	    	document.getElementById('cmContextMenu').style.display = 'block';
	    	document.getElementById('cmContextMenu').removeEventListener('drag', moveMenu, false);
	    } else {
	    	window.removeEventListener('mousemove', moveMenu, true);
			window.removeEventListener('mouseup', placeMenu, true);
	    }
	} catch (err) { console.error(err); }
};

var allowMenuDrag = function (startevt) {
	cmlog([1,1], 'allowMenuDrag()');
	//console.info(startevt);
	try {
	    if (document.getElementById('cmContextMenu').draggable) {
	    	document.getElementById('cmContextMenu').classList.add('cm-drag');
	    	if (!isFirefox) {
	    		setTimeout(function(){document.getElementById('cmContextMenu').style.display = 'none';},20);
	    	    cursorOffsetX = startevt.offsetX;
		        cursorOffsetY = startevt.offsetY;
		        document.getElementById('cmContextMenu').addEventListener('drag', moveMenu, false);
			} else {
				startevt.preventDefault();
				startevt.stopPropagation();
		        cursorOffsetX = startevt.layerX;
		        cursorOffsetY = startevt.layerY;
	            window.addEventListener('mousemove', moveMenu, true);
	            window.addEventListener('mouseup', placeMenu, true);
		    }
	    }
	} catch (err) { console.error(err); }
};

// Setup dragging for when menu is pinned to page
var dragMenuSetup = function(pinState) {
	if (pinState === undefined) pinState = document.getElementById('cmPinMenu').value;

	var contextMenu = document.getElementById('cmContextMenu'),
		mapDiv = document.getElementById('map');

    if (pinState && contextMenu.draggable === false) {
        contextMenu.draggable = true;
        contextMenu.addEventListener('dragstart', allowMenuDrag, false);

        if (!isFirefox) {
	        mapDiv.addEventListener('drop', placeMenu, false);
	        mapDiv.ondragover = function (e) {
	            e.preventDefault();
	            e.dataTransfer.effectAllowed = 'move';
	            e.dataTransfer.dropEffect = 'move';
	        };
        }
    } else if (!pinState && contextMenu.draggable === true) {
        contextMenu.draggable = false;
    	contextMenu.removeEventListener('dragstart', allowMenuDrag);
        if (!isFirefox)
	        mapDiv.removeEventListener('drop', placeMenu);
    }
};

//for preventing conflicts with SL sign drags
var resetDrag = function() {
    window.removeEventListener('mouseup', resetDrag, false);
    dragMenuSetup();
};

//=======================================================================================
var showPopupPanel = function(updateVersion, updateText, forumURL) {
	var popPanelWidth = 600,
	 	popPanelCSS = document.createElement('style'),
	 	popPanelHTML = document.createElement('div');

	popPanelCSS.type = 'text/css';
	popPanelCSS.id = 'cssCMupdate';
 	popPanelCSS.innerHTML =
		'.cm-panel { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);' +
			' width: ' + popPanelWidth + 'px; padding: 10px 25px; margin: 0; overflow-y: auto; overflow-x: auto; word-wrap: break-word;' +
			' background-color: white; box-shadow: 0px 5px 20px #555555; border: 1px solid #858585; border-radius: 10px; }\n' +
		'.cm-panel .fa-exclamation-circle { margin: -5px 16px 10px 8px; line-height: .9; font-size: 56px;}\n' +
		'.cm-panel-inner { padding: 0px 5px; }\n' +
		'.cm-panel-section {display: block; font-size: 14px; margin-bottom: 10px; text-align: left; padding: 0px; }\n' +
		'.cm-panel h2  { margin-top: 15px; margin-left: 80px; font-size: 32px; font-weight: bold; text-align: left; color: #C0C0C0 }\n' +
		'.cm-panel-hr  { display: block; border: 0; height: 0; border-top: 1px solid rgba(0, 0, 0, 0.1);' +
			' border-bottom: 1px solid rgba(255, 255, 255, 0.3); margin-top: 8px; margin-bottom: 15px; }\n' +
		'.cm-panel .cm-btn-container { position: relative; display: table; margin: 0px auto 8px; vertical-align: middle; padding: 0}\n' +
		'.cm-panel .btn { margin: 0px 5px; padding: 0px 15px; display: inline-block; height: 32px; }\n';

	document.body.appendChild(popPanelCSS);

	popPanelHTML.id = 'divCMupdate';
	popPanelHTML.style.backgroundColor = 'rgba(0,0,0,0.5)';
	popPanelHTML.style.position = 'fixed';
	popPanelHTML.style.top = 0;
	popPanelHTML.style.right = 0;
	popPanelHTML.style.bottom = 0;
	popPanelHTML.style.left = 0;
	popPanelHTML.style.zIndex = 5001;
	popPanelHTML.innerHTML = '<div class="cm-panel">' +
        '<div margin-bottom: 20px; margin-top: 20px;>' +
        '<i class="fa fa-exclamation-circle fa-pull-left"></i>' +
    	'<h2>WMECM Update Notes</h2>' +
        '<hr class="cm-panel-hr"></div>' +
        '<div class="cm-panel-inner"><div class="cm-panel-section">' +
        updateText +
        '</div>' +
        '<div style="margin-top: 10px; font-size: 10.1pt">' +
        'For details and screenshots or to report a bug, please visit the forum post: <a href="' + forumURL + '" target="_blank"><i class="fa fa-external-link"></i></a>' +
        '</div>' +
        '<div style="margin-top: 10px; font-style: italic; font-size: 10px;"> ' +
        'WME Context Menu update for min. version ' + updateVersion +
        '</div></div>' +
        '<hr class="cm-panel-hr">' +
        '<div class="cm-btn-container">' +
        '<button id="btnCMokay" class="btn btn-default">OK</button>' +
        '</div></div>';

    document.body.appendChild(popPanelHTML);

    document.getElementById('btnCMokay').onclick = function() {
        document.getElementById('divCMupdate').remove();
    	document.getElementById('cmUpdateNote').classList.remove('cm-unread');
    	document.getElementById('cssCMupdate').remove();
    	requestAnimationFrame(function(){CMenuVersion.updateVersionString(minVersion);});
    };
};

//=======================================================================================
var switchPanelTo = function(panelName) {
    switch (panelName) {
        case 'clipboard':
            $('#cmClipboard')[0].value = true;
            $('#cmClipboard')[0].classList.remove('toggle-off');
            $('#cmRSel')[0].value = false;
            $('#cmRSel')[0].classList.add('toggle-off');
            $('#cmEditAttributes')[0].classList.add('toggle-off');
            $('#cmEditAttributes')[0].value = false;
            $('#cmSpeed')[0].value = false;
            $('#cmSpeed')[0].parentNode.style.opacity = 0.4;
            $('#cmContextMenu')[0].style.width = '210px';
            break;
        case 'rsel':
            $('#cmClipboard')[0].value = false;
            $('#cmClipboard')[0].classList.add('toggle-off');
            $('#cmRSel')[0].value = true;
            $('#cmRSel')[0].classList.remove('toggle-off');
            $('#cmEditAttributes')[0].classList.add('toggle-off');
            $('#cmEditAttributes')[0].value = false;
            $('#cmSpeed')[0].value = false;
            $('#cmSpeed')[0].parentNode.style.opacity = 0.4;
            $('#cmContextMenu')[0].style.width = '210px';
            break;
        case 'speed':
            $('#cmClipboard')[0].value = false;
            $('#cmClipboard')[0].classList.add('toggle-off');
            $('#cmRSel')[0].value = false;
            $('#cmRSel')[0].classList.add('toggle-off');
            $('#cmEditAttributes')[0].classList.add('toggle-off');
            $('#cmEditAttributes')[0].value = false;
            $('#cmSpeed')[0].value = true;
            $('#cmSpeed')[0].parentNode.style.opacity = 0.84;
            $('#cmContextMenu')[0].style.width = '220px';
            SL.signsContainerHeight = null;
            break;
        case 'editattributes':
            $('#cmClipboard')[0].value = false;
            $('#cmClipboard')[0].classList.add('toggle-off');
            $('#cmRSel')[0].value = false;
            $('#cmRSel')[0].classList.add('toggle-off');
            $('#cmSpeed')[0].value = false;
            $('#cmSpeed')[0].parentNode.style.opacity = 0.4;
            $('#cmEditAttributes')[0].classList.remove('toggle-off');
            $('#cmEditAttributes')[0].value = true;
            $('#cmContextMenu')[0].style.width = '230px';
            break;
    }
};

var showEmptyPanel = function(panelName) {
    switch (panelName) {
        case 'clipboard':
            document.getElementById('cmMenuHeaderTitle').innerHTML = 'Copy To Clipboard';
            document.getElementById('cmMenuNoContent').style.display = 'block';
            document.getElementById('cmMenuContent').style.display = 'none';
            break;
        case 'rsel':
            if (document.getElementById('cmRSelAutoAdd')) document.getElementById('cmRSelAutoAdd').style.display = 'none';
            document.getElementById('cmMenuHeaderTitle').innerHTML = 'Send To Road Selector';
            document.getElementById('cmMenuNoContent').style.display = 'block';
            document.getElementById('cmMenuContent').style.display = 'none';
            break;
        case 'speed':
            document.getElementById('cmMenuHeaderTitle').innerHTML = 'Edit Speed Limits';
            document.getElementById('cmMenuNoContent').style.display = 'block';
            document.getElementById('cmMenuContent').style.display = 'none';
            break;
        case 'editattributes':
            document.getElementById('cmMenuHeaderTitle').innerHTML = 'Edit Attributes';
            document.getElementById('cmMenuNoContent').style.display = 'block';
            document.getElementById('cmMenuContent').style.display = 'none';
            break;
    }
};

//=======================================================================================
var initContextMenu = function () {
	cmlog([1,1], 'initContextMenu()');
    var contextMenuActiveArea = document.createElement('div'),
        contextMenu = document.createElement('div'),
        contextMenuCSS = document.createElement('style'),
        menuCSS;

    try {//opacity: 0.5;
        contextMenuCSS.type = 'text/css';
        menuCSS = '#cmContextMenu { display: block; opacity: 1; }\n' +
        '#cmContextMenu.cm-drag { cursor: move; opacity: 0.75 !important; transition: opacity .1s linear 0s; }\n' +
        '.cm-top { border-top-right-radius: 3px; border-top-left-radius: 3px; }\n' +
        '.cm-bottom { border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; }\n' +
        '#cmFooter+#cmContainer .cm-menu-header>dl, #cmFooter+#cmContainer .cm-menu-header>dl>dt, #cmFooter+#cmContainer .cm-rsel>dl, #cmFooter+#cmContainer .cm-rsel>dl>dt, .cm-rsel+.cm-menu-header>dl, .cm-rsel+.cm-menu-header>dl>dt { border-radius: 0; }\n' +
        '#cmFooter+#cmContainer #cmMenuContent > div:last-child { border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; }\n' +
        '.cm-footer-icns { font-size: 13px; margin: 0px 4px 0px 2px; cursor: pointer; display: inline-table; line-height: 1; }\n' +
        '.cm-footer-icns:active, .cm-footer-icns:focus, .cm-footer-icns.toggle-off:active, .cm-footer-icns.toggle-off:focus { color: #64D8EA; }\n' +
        '.cm-footer-icns.toggle-off, .cm-footer-text.toggle-off { color: #8CBBCC; }\n' +
        '.cm-update-note { z-index: 3; cursor: pointer; color: #59899E; margin-top: -15px; position: relative; float: right; right: 5px; bottom: 2px; opacity: .8; line-height: 1; font-size: 14px; }\n' +
        '.cm-update-note.cm-unread { color: crimson; }\n' +
        'div.cm-menu-header { padding: 0px; border: 0; height: 20px; }\n' +
        '.cm-menu-header dl { background-color: rgba(147, 196, 211, 0.92); padding: 0; border-top-right-radius: 4px; border-top-left-radius: 4px; }\n' +
        '.cm-menu-header dt { padding: 4px 11px; text-transform: uppercase; line-height: 1.3; background-color: rgba(111, 167, 185, 0.7); color: #D8E9EF; font-size: 10px; border-top-right-radius: 3px; border-top-left-radius: 3px; height: 22px; margin-top: 1px; box-shadow: 0px -1px 0px #9ACCDC; }\n' +
        'div.cm_ABCenter { padding: 0px; border: 0; height: 38px; }\n' +
        '.cm_ABCenter dl { background-color: rgba(147, 196, 211, 0.92); padding: 0; border-top-right-radius: 4px; border-top-left-radius: 4px; }\n' +
        '.cm_ABCenter dt { padding: 4px 11px; text-transform: uppercase; line-height: 1.3; background-color: rgba(111, 167, 185, 0.7); color: #D8E9EF; font-size: 10px; border-top-right-radius: 3px; border-top-left-radius: 3px; margin-top: 1px; box-shadow: 0px -1px 0px #9ACCDC; }\n' +
        'div.cm_UTurn { padding: 0px; border: 0; height: 38px; }\n' +
        '.cm_UTurn dl { background-color: rgba(147, 196, 211, 0.92); padding: 0; border-top-right-radius: 4px; border-top-left-radius: 4px; }\n' +
        '.cm_UTurn dt { padding: 4px 11px; text-transform: uppercase; line-height: 1.3; background-color: rgba(111, 167, 185, 0.7); color: #D8E9EF; font-size: 10px; border-top-right-radius: 3px; border-top-left-radius: 3px; margin-top: 1px; box-shadow: 0px -1px 0px #9ACCDC; }\n' +
        'div.cm-menu-section { z-index: 2; border-bottom: 1px solid #416B7C; padding: 2px 0px 3px; background-color: rgba(147, 196, 211, 0.92); }\n' +
        '.cm-menu-section dl { margin: 0; padding: 0; display: block; }\n' +
        '.cm-menu-section dt { font-size: 9px; padding: 0px 6px 0px 20px; margin-top: 2px; text-transform: uppercase; line-height: 1.2; }\n' +
        '.cm-menu-section dd { display: inherit; padding: 0px 14px 0px 20px; font-size: 11px; color: #234350; font-weight: 600; line-height: 1.3; word-break: break-all;}\n' +
        '.cm-menu-section dd:hover, .cm-menu-section dd:active, .cm-menu-section dd:focus { cursor: default; background-color: #BEDCE5; color: #416B7C; }\n' +
        '.cm-menu-section dd:active { color: #64D8EA; }\n';
        menuCSS +=
        '.cm-menu-section .cm-hide.fa-caret-down, .cm-menu-section .cm-hide.fa-caret-up { position: absolute; left: 8px; width: 90%; cursor: pointer; }\n' +
        '.cm-menu-section .cm-hide.fa-caret-down { display: block; }\n' +
        '.cm-menu-section .cm-hide.fa-caret-up { display: none; }\n' +
        '.cm-menu-section.cm-hidden .cm-hide.fa-caret-down { display: none; }\n' +
        '.cm-menu-section.cm-hidden .cm-hide.fa-caret-up { display: block; }\n' +
        '.cm-hidden { height: 19px; }\n' +
        '.cm-hidden dd { display: none; }\n' +
        '.cm-hidden dt, .cm-hidden dl {float: left; margin-right: -12px; color: rgba(255, 255, 255, 0.7); }\n' +
        '.cm-hidden dl:nth-of-type(2)>dt:before { content: "/ "; }\n' +
        'dd.cm-paste { font-style: italic; text-align: right; max-width: 50%; float: right; padding: 0px 10px 0px 5px;}\n' +
        '.cm-paste:before { content: ""; font-style: normal; font-weight: 400; color: black; font-size: 11px; margin-right: 2px; }\n';
        menuCSS +=
        'dd.cm-rsel-goselect { padding-right: 12px; padding-left: 12px; cursor: pointer; }\n' +
        '.cm-menu-section .cm-rsel-goselect:hover { background-color: transparent; color: #d4e7ed; }\n' +
        '.cm-rsel { display: none; border: 0; background-color: rgba(154, 204, 220, 0.9); border-top-right-radius: 3px; border-top-left-radius: 3px; margin-bottom: -1px; }\n' +
        '.cm-rsel>dl { padding-top: 1px; border-top-right-radius: 4px; border-top-left-radius: 4px; }\n' +
        '.cm-rsel>dl>dt { background-color: rgba(111, 167, 185, 0.7); height: 20px; margin-top: -2px; border-top-right-radius: 3px; border-top-left-radius: 3px; padding: 4px 10px; color: #d8e9ef; font-size: 10px; }\n' +
        '.cm-rsel>dl>dt+dd { height: 24px; margin: 0px 0px 3px; padding: 5px 10px 5px 9px; background-color: rgba(228, 248, 255, 0.3); box-shadow: 0px 1px 0px rgba(0,0,0,0.1); }\n' +
        '.cm-rsel-options, cm-rsel-options:focus:hover, cm-rsel-options+input:not(checked) { z-index: 2; background-color: rgba(89, 137, 158, 0.60); color: #D4E7ED; font-weight: bold !important; height: 14px !important; line-height: 1; padding: 3px 6px; font-size: 8px !important; border-radius: 15px; }\n' +
        '.cm-rsel-options:hover { background-color: rgba(89, 137, 158, 0.7); color: white; }\n' +
        '.cm-rsel-options.active:hover { background-color: #274B5A }\n' +
        '.cm-rsel-options.active, .cm-rsel-options:active, .cm-rsel-options:active:focus { color: white; background-color: #3F6271; }\n' +
        '.cm-rsel-options:focus { color: white; }\n' +
        '.cm-rsel-options.and { background-color: #EEE; color: #59899E; border-right: 1px solid #AAA;}\n' +
        '.cm-rsel-options.cm-badge-right { border-left: 1px solid #59899E; }\n';
        menuCSS +=
        '.cm-speed-limit.cm-menu-section { z-index: 3; width: 100%; font-size: 11px; text-align: center; display: inline-block; padding: 10px 8px; }\n' +
        '.cm-speed-limit input[type="number"] { height: 28px; width: 50px; font-size: 12px; padding: 4px 5px; line-height: 1; margin: 0px 2px; }\n' +
        '.cm-speed-limit input[type="checkbox"]+label { color: transparent; width: 10px; margin-left: 5px; vertical-align: middle; }\n' +
        '.cm-speed-limit .controls-container { margin-left: 5px; }\n' +
        '.cm-speed-limit div { border-radius: 3px; display: inline-block; }\n' +
		'div#signsholder_cm>div#btnCMClearSLs { float: left; display: inline-block; cursor: pointer; background-image: none; color: #134C65; font-size: 28px; }\n' +
		'div#signsholder_cm>div#btnCMClearSLs>div {display: none;}\n' +
		'div#signsholder_cm>div#btnCMClearSLs:before { vertical-align: middle; }\n' +
        'div#signsholder_cm>div:not(#btnCMClearSLs):before { position: absolute; background-color: white; color: black; border: 2px solid #00ECE3; font-weight: 400; border-radius: 50%; font-size: 9px; width: 16px; height: 16px; line-height: 12px; text-align: center; margin-left: -10px; margin-top: -3px; box-shadow: 0px 1px 1px gray; z-index: 1; }\n' +
        'div#signsholder_cm>.cm-a:before { content: "A"; }\n' +
        'div#signsholder_cm>.cm-b:before { content: "B"; }\n' +
        '.cm-speed-limit>.form-inline .fa-ban { cursor: pointer; color: #1F576E; padding-right: 8px; font-size: 1.5em; font-weight: bold; vertical-align: middle; margin-bottom: 2px; }\n' +
		'.cm-sl-edit>.fa-pencil:hover, .cm-speed-limit>.form-inline .fa-ban:hover { color: #00ECE3; }\n' +
        '.cm-sl-verified { box-shadow: inset 0px 0px 0px 2px lime; }\n' +
        '.cm-sl-unverified { box-shadow: inset 0px 0px 0px 2px gold; }\n' +
        '.cm-sl-multisegs { box-shadow: inset 0px 0px 0px 3px #333 !important; }\n' +
        '.cm-sl-verified.cm-both { box-shadow: 0px 0px 0px 1px lime, inset 0px 0px 0px 2px greenyellow; }\n' +
        '.cm-sl-unverified.cm-one { box-shadow: 0px 0px 0px 1px lime, inset 0px 0px 0px 2px rgba(255, 235, 59, 1);  }\n' +
        '.cm-sl-unverified.cm-both { box-shadow: 0px 0px 0px 1px orange, inset 0px 0px 0px 2px rgba(255, 235, 59, 1); }\n' +
        '#signsholder_cm>#signsError { float: initial; width: 100%; height: initial; padding: 5px 5px 5px 45px !important; text-align: left; }\n';
        menuCSS+=
            '.cm-node { border-radius:50%; width:16px; height:16px; color:black; background:#fff; border:2px solid #00ece3; cursor:pointer; font-size:12px; user-select: none;}\n' +
            '.cm_UTurn .arrow.uturn.open { background-image: url(//editor-assets.waze.com/production/img/turns96765f551688fd5082b619129499bbb3.png); background-position: -22px -96px; width: 16px; height: 16px; transform: scale(0.74); }\n' +
            '.cm_UTurn .arrow.uturn.open:hover, .cm_UTurn .arrow.uturn.open.hover { background-image: url(//editor-assets.waze.com/production/img/turns96765f551688fd5082b619129499bbb3.png); background-position: -66px -74px; width: 16px; height: 16px; transform: scale(0.74); }\n' +
            '.cm_UTurn .arrow.uturn.closed { cursor:pointer; background-image: url(//editor-assets.waze.com/production/img/turns96765f551688fd5082b619129499bbb3.png); background-position: -22px -74px; width: 16px; height: 16px; transform: scale(0.74); }\n' +
            '.cm_UTurn .arrow.uturn.closed:hover, .cm_UTurn .arrow.uturn.closed.hover { cursor:pointer; background-image: url(//editor-assets.waze.com/production/img/turns96765f551688fd5082b619129499bbb3.png); background-position: -66px -96px; width: 16px; height: 16px; transform: scale(0.74); }\n';

        contextMenuCSS.innerHTML = menuCSS;
        document.head.appendChild(contextMenuCSS);

        //#btnCMAddSL {float: left; display: inline-block; cursor: pointer; color: #134C65; font-size: 24px; padding: 2px; width: 32px; line-height: 1;}
        //#signsContainer.cm-sl-edit>#signsholder_cm>div:not(#btnCMclearSLs):after {content: "x"; position: absolute; background-color: #E53935; color: #FFF; font-weight: 600; border-radius: 50%; font-size: 11px; width: 14px; height: 14px; line-height: 12px; text-align: center; right: -3px; top: -4px; box-shadow: 0px 1px 1px gray;}


        // reminder to self: no need to declare CSS here since this is put into DOM once and does not get destroyed
        contextMenu.id = 'cmContextMenu';
        contextMenu.style.position = 'fixed';
        contextMenu.style.top = '0px';
        contextMenu.style.left = '0px';
        contextMenu.style.width = '210px';
        contextMenu.style.margin = '0px';
        contextMenu.style.padding = '0px';
        contextMenu.style.borderRadius = '4px';
        contextMenu.style.boxShadow = '0px 5px 12px rgba(0, 0, 0, 0.5)';
        contextMenu.style.border = '1px solid rgb(89, 137, 150)';
        contextMenu.style.borderBottom = '1px solid #2D505F';
        contextMenu.style.color = 'white';
        contextMenu.style.zIndex = '5000';
        contextMenu.style.display = 'none';
        contextMenu.style.opacity = 0;

        contextMenu.innerHTML = '<div id="cmContainer" style="z-index: 2; color: white; padding:0; margin:0; position: relative; width: 100%; display: block;"></div>' +
        	'<div id="cmUpdateNote" class="fa fa-exclamation-circle cm-update-note"></div>' +
            '<div id="cm_ABCenter" class="cm_ABCenter" style="text-align:center;"><dl><dt>Jump To...</dt><dd style="padding-top:0px; margin-left:10px;"><span class="cm-node" id="cm_jumpA" style="float:left;">A</span><span id="cm_jumpReturn" style="display:inline-block; margin:0 auto; cursor:pointer; user-select:none;">Return</span><span class="cm-node" id="cm_jumpB" style="float:right; margin-right:10px;">B</span></dd></dl></div>' +
            '<div id="cm_UTurn" class="cm_UTurn" style="text-align:center;"><dl><dt>U-Turns</dt><dd style="padding-top:0px; margin-left:10px;"><span id="cm_UTurnA" style="cursor: pointer;"><span class="cm-node"style="float:left;">A</span><span id="cm_UTurnAIcon" class="arrow uturn closed" style="display:inline-block; float:left;"></span></span><span id="cm_UTurnBoth" style="cursor:pointer;"><span style="display:inline-block; margin:0 auto; user-select:none;">Both</span><span id="cm_UTurnBothIcon" class="arrow uturn closed" style="display:inline-block;"></span></span><span id="cm_UTurnB" style="cursor:pointer;"><span class="cm-node" style="float:right; margin-right:10px;">B</span><span id="cm_UTurnBIcon" class="arrow uturn closed" style="display:inline-block; float:right;"></span></span></dd></dl></div>' +
            '<div id="cmFooter" class="cm-bottom" style="color: #DDEDF3; height: 24px; background-color: rgba(75, 125, 148, 0.85); ' +
            'z-index: 3; padding: 1px 7px 1px; margin: 0; position: relative; width: 100%; display: block;"></div>';


        document.getElementById('map').appendChild(contextMenu);

        document.getElementById('cmFooter').innerHTML =
        '<div style="position: relative; float: left; vertical-align: middle;">' +
        '<i id="cmPinMenu" class="fa fa-thumb-tack cm-footer-icns toggle-off" style="margin: 0 0 0 -3px; padding: 3px 6px;" value=true title="Pin menu" data-toggle="tooltips"></i>' +
        '<span id="cmPinClose" class="cm-footer-text toggle-off" style="cursor: pointer; font-weight: 600; border-left: 1px solid #D4E7ED; padding-left: 8px; text-transform: uppercase; font-size: 10px; letter-spacing: .7px;">Close</span>' +
        '</div>' +
        '<div id="cmFooterCaret" class="fa fa-angle-up cm-footer-icns pull-right" style="position: relative; top: 3px; margin: auto -1px auto 7px; font-weight: bold;"></div>' +
        '<div style="position: relative; height: 21px; border-radius: 20px; border: 1px solid #6EA1B7;  padding: 0px 1px 0px 5px;" class="btn-group pull-right">' +
          '<div style="position: relative; display: inline-block; height: 100%; border-right: 1px solid #6EA1B7; padding-left: 2px; width: 22px;" class="">' +
            '<i id="cmClipboard" value="false" style="font-size: 13px;" class="fa fa-clipboard cm-footer-icns toggle-off" title="Copy to Clipboard" data-toggle="tooltips"></i>' +
          '</div>' +
          '<div style="position: relative; display: inline-block; height: 100%; border-right: 1px solid #6EA1B7;">' +
            '<i id="cmRSel" style="font-size: 14px;" value="false" class="fa fa-road cm-footer-icns toggle-off" title="Copy to WME Road Selector" data-toggle="tooltips"></i>' +
          '</div>' +
          '<div style="position: relative; display: inline-block; width: 20px;  margin: 0; opacity: 0.84;  border-right: 1px solid #6EA1B7;">' +
            '<span id="cmSpeed" style="height: 16px" value="false" title="Edit Speed Limits" class="fa fa-stack">' +
              '<i class="fa fa-circle cm-footer-icns" style="font-size: 15px; width: 15px; color: #EEE; line-height: 14px; position: absolute; left: 0; text-align: center;"></i>' +
              '<i class="fa fa-circle-o cm-footer-icns" style="font-size: 15px; width: 15px; font-weight: 500; color: crimson; line-height: 14px; position: absolute; left: 0; text-align: center;"></i>' +
              '<i class="fa cm-footer-icns" style="font-size: 8px; font-style: normal; width: 15px; color: black; line-height: 14px; position: absolute; left: 0; text-align: center;">S</i>' +
            '</span>' +
          '</div>' +
          '<div style="position: relative; display: inline-block; width: 20px;  margin: 0; opacity: 0.84;">' +
            '<i id="cmEditAttributes" style="font-size: 14px;" value="false" class="fa fa-pencil cm-footer-icns toggle-off" title="Edit Segment Attributes" data-toggle="tooltips"></i>' +
          '</div>' +
        '</div>';

        resetContextMenu(contextMenuSettings);
        hidePasteMenu();

        setTimeout(function () {
            if (contextMenuSettings.clipboard === 0 || (contextMenuSettings.clipboard === 1 && document.getElementById('tabRSel') === null))
                switchPanelTo('clipboard');
        }, 2000);

        if (contextMenuSettings.clipboard === 1) switchPanelTo('rsel');
        else if (contextMenuSettings.clipboard === 2) switchPanelTo('speed');
        else if(contextMenuSettings.clipboard === 3) switchPanelTo('editattributes');

        if (contextMenuSettings.pin) {
            document.getElementById('cmPinMenu').value = true;
            document.getElementById('cmPinMenu').classList.remove('toggle-off');
            document.getElementById('cmPinClose').classList.remove('toggle-off');
        } else {
            document.getElementById('cmPinMenu').value = false;
            document.getElementById('cmPinMenu').classList.add('toggle-off');
            document.getElementById('cmPinClose').classList.add('toggle-off');
        }
        //======================
        // VERSION CHECK
        //======================
		if (!CMenuVersion.isUpToDate(minVersion))
			document.getElementById('cmUpdateNote').classList.add('cm-unread');

		var forumURL = 'https://www.waze.com/forum/viewtopic.php?f=819&t=178371';
		let	updateNotes = 'Hello there! Your friendly right-click WME popup has been recently updated! Within the popup panel, you can now:' +
			'</div><div class="cm-panel-section"><ul>' +
			'<li>Drag-and-drop speed limit signs to input box</li>' +
			'<li>Right-click node A/B to edit speed limit starting from that direction</li>' +
			'<li>Add or remove speed limit signs</li>' +
			'<li>When WME Speedhelper is not running, the popup will create its own customizable speed limit signs</li>' +
			'<li>Some previous bugs were found and squashed</li>' +
			'</ul>' +
			'<p>Enjoy!</p><p>Coming soonish – A better copy-and-paste menu for segment attributes (and maybe Places... who knows.)</p>';

	    document.getElementById('cmUpdateNote').onclick = function(e){
	    	e.stopPropagation();
	    	showPopupPanel(minVersion, updateNotes, forumURL);
	    };

        document.getElementById('cmClipboard').onclick = function (e) {
            try {
                e.stopPropagation();
                switchPanelTo('clipboard');
                contextMenuSettings.clipboard = 0;
                localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);

                var selectedStuff = selectedItemsIsSegment();
                if (selectedStuff) {
                    let segInfo = getSegmentProperties(selectedStuff);
                    populateCopyMenu(segInfo, contextMenuSettings);
                }
                else
                    showEmptyPanel('clipboard');
                hidePasteMenu(false);
            } catch (err) {
                console.error(err);
            }
        };

        document.getElementById('cmRSel').onclick = function (e) {
            try {
                e.stopPropagation();
                if (document.getElementById('tabRSel') !== null) {
                    switchPanelTo('rsel');
                    contextMenuSettings.clipboard = 1;
                    localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);

                    var selectedStuff = selectedItemsIsSegment();
                    if (selectedStuff) {
                        let segInfo = getSegmentProperties(selectedStuff);
                        if (document.getElementById('cmRSelAutoAdd')) document.getElementById('cmRSelAutoAdd').style.display = 'block';
                        populateCopyMenu(segInfo, contextMenuSettings);
                    }
                    else
                        showEmptyPanel('rsel');
                    hidePasteMenu(true);
                }
            } catch (err) {
                console.error(err);
            }
        };

        document.getElementById('cmSpeed').onclick = function (e) {
            try {
                e.stopPropagation();
                switchPanelTo('speed');
                contextMenuSettings.clipboard = 2;
                localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);

                var selectedStuff = selectedItemsIsSegment();
                if (selectedStuff) {
                    SL.menuResetEvent = true;
                    SL.populateSpeedMenu(contextMenuSettings);
                    window.removeEventListener('click', closeContextMenu, false);
                    document.getElementById('toolbar').removeEventListener('mouseenter', closeContextMenu, false);
                }
                else
                    showEmptyPanel('speed');
            } catch (err) {
                console.error(err);
            }
        };

        document.getElementById('cmEditAttributes').onclick = function (e) {
            try {
                e.stopPropagation();
                switchPanelTo('editattributes');
                contextMenuSettings.clipboard = 3;
                localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);

                var selectedStuff = selectedItemsIsSegment();
                if (selectedStuff) {
                    let segInfo = getSegmentProperties(selectedStuff);
                    window.removeEventListener('click', closeContextMenu, false);
                    document.getElementById('toolbar').removeEventListener('mouseenter', closeContextMenu, false);
                    populateEditAttributes(segInfo, contextMenuSettings);
                }
                else
                    showEmptyPanel('editattributes');
            } catch (err) {
                console.error(err);
            }
        };

        document.getElementById('map').addEventListener(
            'contextmenu',
            function (e) {
				cmlog([1,0],'------------------------------------------------------------');
            	cmlog([1,1], 'contextmenu');

                var selectedStuff = selectionIsSegment(e),
                	contextMenu = document.getElementById('cmContextMenu');

                if (selectedStuff) {
                    try {
                        e.stopPropagation();
                        contextMenu.style.display = 'block';
                        contextMenu.style.top = e.clientY - 10 + 'px';
                        contextMenu.style.left = e.clientX + 'px';
                        contextMenu.classList.remove('cm-drag');

                        SL.menuResetEvent = true;
                        setupSegmentContextMenu(e);
                        contextMenu.style.opacity = 1;

                        setABOrigValues();
                        setUTurnStatus();
                        $('#cm_ABCenter').css('display', W.selectionManager.getSelectedFeatures().length !== 1 ? 'none' : 'block');
                        $('#cm_UTurn').css('display', W.selectionManager.getSelectedFeatures().length !== 1 ? 'none' : 'block');

                        window.addEventListener('keydown', menuShortcutKeys, true);
                        W.selectionManager.events.register("selectionchanged", null, handleSelectionChanged);
                        //console.info('WMECM:','Added initial global hotkey listener upon menu open');
                        if (document.getElementById('cmPinMenu').value) {
		                    // use a more selective hotkey listener
		                    //console.info('WMECM:','Menu is pinned, so adding selective hotkey listeners too');
							contextMenu.addEventListener('mouseenter', addHotkeyListener, false);
							contextMenu.addEventListener('mouseleave', removeHotkeyListener, false);

					        W.selectionManager.events.register("selectionchanged", null, setupSegmentContextMenu);
	                    }
                    } catch (err) { console.error(err); }
                } else {
                	// No segment detected... Decide whether to keep the menu open.
                    if (document.getElementById('cmPinMenu').value)
                        return true;
                    else {
                        contextMenu.style.display = 'none';
                        W.selectionManager.events.unregister("selectionchanged", null, handleSelectionChanged);
                        return false;
                    }
                }
            }, true);

        document.getElementById('cmPinMenu').onclick = function (e) {
            try {
                e.stopPropagation();
                if (this.value) { // no pinning
                    this.value = false;
                    this.classList.add('toggle-off');
                    document.getElementById('cmPinClose').classList.add('toggle-off');

                    // remove drag menu listeners
                    dragMenuSetup(false);

                    // closing context menu will remove hotkey listeners & closing contextmenu listeners
                    // they will be reinstated if appropriate upon reopening the menu
                    closeContextMenu();
                } else { // pin menu
                    this.value = true;
                    this.classList.remove('toggle-off');
                    document.getElementById('cmPinClose').classList.remove('toggle-off');

                    // remove listeners that close the menu without clicking close
                    window.removeEventListener('click', closeContextMenu, false);
                    document.getElementById('toolbar').removeEventListener('mouseenter', closeContextMenu, false);

                    // Add dragging menu listeners
                    dragMenuSetup(true);

                    // use a more selective hotkey listener
                    //console.info('WMECM:','Switch to menu pinning, so adding selective hotkey listener');
					document.getElementById('cmContextMenu').addEventListener('mouseenter', addHotkeyListener, false);
					document.getElementById('cmContextMenu').addEventListener('mouseleave', removeHotkeyListener, false);
                }
                contextMenuSettings.pin = !contextMenuSettings.pin;
                localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
            } catch (err) {
                console.error(err);
            }
        };

        document.getElementById('cmPinClose').onclick = closeContextMenu;

        document.getElementById('cmFooterCaret').addEventListener('click', function (e) {
            e.stopPropagation();
            if (this.classList.contains('fa-angle-up')) { //switch to top menubar
                contextMenuSettings.position = 1;
                localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
                adjustContextMenubar(1);
            } else if (this.classList.contains('fa-angle-down')) { //switch to bottom menubar
                contextMenuSettings.position = 0;
                localStorage.WME_ContextMenu = JSON.stringify(contextMenuSettings);
                adjustContextMenubar(0);
            }
        }, false);

        $('#cm_jumpA').click(function(){
            debugger;
            if(ABOrig.Orig === null || (!compareCenterAndNode(W.map.getCenter(), ABOrig.ANode) && !compareCenterAndNode(W.map.getCenter(),ABOrig.BNode)))
                ABOrig.Orig = W.map.getCenter().clone();
            W.map.setCenter(ABOrig.ANode, W.map.zoom);
        });

        $('#cm_jumpB').click(function(){
            if(ABOrig.Orig === null || (!compareCenterAndNode(W.map.getCenter(), ABOrig.ANode) && !compareCenterAndNode(W.map.getCenter(),ABOrig.BNode)))
                ABOrig.Orig = W.map.getCenter().clone();
            W.map.setCenter(ABOrig.BNode, W.map.zoom);
        });

        $('#cm_jumpReturn').click(function(){
            if(ABOrig.Orig !== null)
                W.map.setCenter(ABOrig.Orig, W.map.zoom);
        });

        $('#cm_UTurnA').click(function(){
            let SetTurn = require("Waze/Model/Graph/Actions/SetTurn");
            let seg = W.selectionManager.getSelectedFeatures()[0];
            let turnGraph = W.model.getTurnGraph();
            let fromNode = seg.model.getFromNode();
            let turnFromNode = turnGraph.getTurnThroughNode(fromNode, seg.model, seg.model);
            let fromTurnData = turnFromNode.getTurnData();
            fromTurnData = fromTurnData.withToggledState(!ANodeUturn);
            turnFromNode = turnFromNode.withTurnData(fromTurnData);

            let lf = new SetTurn(turnGraph, turnFromNode);
            W.model.actionManager.add(lf);
            setUTurnStatus();
        });

        $('#cm_UTurnB').click(function(){
            let SetTurn = require("Waze/Model/Graph/Actions/SetTurn");
            let seg = W.selectionManager.getSelectedFeatures()[0];
            let turnGraph = W.model.getTurnGraph();
            let toNode = seg.model.getToNode();
            let turnToNode = turnGraph.getTurnThroughNode(toNode, seg.model, seg.model);
            let toTurnData = turnToNode.getTurnData();
            toTurnData = toTurnData.withToggledState(!BNodeUturn);
            turnToNode = turnToNode.withTurnData(toTurnData);

            let lt = new SetTurn(turnGraph, turnToNode);
            W.model.actionManager.add(lt);
            setUTurnStatus();
        });

        $('#cm_UTurnBoth').click(function(){
            let SetTurn = require("Waze/Model/Graph/Actions/SetTurn");
            let seg = W.selectionManager.getSelectedFeatures()[0];
            let turnGraph = W.model.getTurnGraph();

            let enabled = $('#cm_UTurnBothIcon').hasClass('open');
            //B node
            let toNode = seg.model.getToNode();
            let turnToNode = turnGraph.getTurnThroughNode(toNode, seg.model, seg.model);
            let toTurnData = turnToNode.getTurnData();
            toTurnData = toTurnData.withToggledState(!enabled);
            turnToNode = turnToNode.withTurnData(toTurnData);

            let lt = new SetTurn(turnGraph, turnToNode);
            W.model.actionManager.add(lt);

            //A node
            let fromNode = seg.model.getFromNode();
            let turnFromNode = turnGraph.getTurnThroughNode(fromNode, seg.model, seg.model);
            let fromTurnData = turnFromNode.getTurnData();
            fromTurnData = fromTurnData.withToggledState(!enabled);
            turnFromNode = turnFromNode.withTurnData(fromTurnData);

            let lf = new SetTurn(turnGraph, turnFromNode);
            W.model.actionManager.add(lf);
            setUTurnStatus();
        });

    } catch (err) {
        console.error(err);
    }

    var compareCenterAndNode = function(center, node){
        return (Math.abs(node.lon - center.lon) < .000001 && Math.abs(node.lat - center.lat) < .000001);
    }

    dragMenuSetup();

    var cmWaitCover = document.createElement('div');
    cmWaitCover.id = 'cmWaitCover';
	cmWaitCover.style.display = 'none';
	cmWaitCover.style.position = 'fixed';
	cmWaitCover.style.top = 0; cmWaitCover.style.bottom = '25px'; cmWaitCover.style.left = 0; cmWaitCover.style.right = 0;
	cmWaitCover.style.background = 'transparent';
	cmWaitCover.style.cursor = 'wait';
	cmWaitCover.style.zIndex = '5001';
	document.body.appendChild(cmWaitCover);

    setTimeout(function () {
        try {
            var rselBtnEls = document.querySelectorAll('#RSconditions button');
            for (var b = rselBtnEls.length; b--;) {
                rselBtnEls[b].addEventListener('click', function () {
                    this.classList.remove('btn-info');
                }, false);
            }
        } catch (err) {
            console.error(err);
        }
    }, 1200);

};

var getSelectedSegmentCount = function(){
	let count = _.countBy(W.selectionManager.getSelectedFeatures().map(function(e){return e.model.type}), _.identity).segment;
	if(!count)
		return 0;
	else
		return count;
}

var waitCount = 0, maxWaitCount = 50;
var waitForWaze = function () {
    try {
        if (document.getElementById('cmContextMenu'))
            return true;
        else if (typeof(Waze) !== "undefined" && W.model && W.selectionManager &&
                 W.model.segments && W.model.cities &&
                 W.map && W.map.layers && W.loginManager.user)
            setTimeout(initContextMenu, 1000);
        else if (waitCount++ < maxWaitCount)
            setTimeout(waitForWaze, 1000);
        else
            console.error('WMECM:', 'Failed to start');
    } catch (err) {
        console.error('WMECM:', 'Whoa. Major fail. Please let TheLastTaterTot know about this...');
        console.error(err);
    }
};

waitForWaze();
