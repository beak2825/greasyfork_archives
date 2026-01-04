// ==UserScript==
// @name         WME HN2RPP
// @version      2024.06.28.1
// @description  Converts HouseNumbers to RPPs
// @author       njs923/nicknick923
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @require      https://greasyfork.org/scripts/38421-wme-utils-navigationpoint/code/WME%20Utils%20-%20NavigationPoint.js
// @grant        none
// @namespace    https://greasyfork.org/users/783417
// @downloadURL https://update.greasyfork.org/scripts/430174/WME%20HN2RPP.user.js
// @updateURL https://update.greasyfork.org/scripts/430174/WME%20HN2RPP.meta.js
// ==/UserScript==
/* global W, NavigationPoint, I18n, OpenLayers, require, $ */
(function() {
    'use strict';

    const d = window.document;
    const q = d.querySelector.bind(d);
    const qa = d.querySelectorAll.bind(d);
    const scriptName = 'hn2rpp';
    let settings = {};
    let lastDownloadTime = Date.now();
    let oldSegmentsId = [];
    let initCount = 0;
    function log(m) { console.log('%cWME HN2RPP:%c ' + m, 'color: darkcyan; font-weight: bold', 'color: dimgray; font-weight: normal'); }
    function warn(m) { console.warn('WME HN2RPP: ' + m); }
    function err(m) { console.error('WME HN2RPP: ' + m); }

    function bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            onWmeReady();
        } else {
            document.addEventListener("wme-ready", onWmeReady, {
                once: true,
            });
        }
    }

    function onWmeReady()
    {
        initCount++;
        if ($)
            { init(); }
        else {
            if (initCount == 100) {
                err('jquery not loaded. Giving up.');
                return;
            }
            setTimeout(onWmeReady, 300);
        }
    }

    function init() {
        log('init');
        W.selectionManager.events.register("selectionchanged", null, onSelect);
        //W.editingMediator.on('change:editingHouseNumbers', onEditingHN);

        RegisterKeyboardShortcut(scriptName, 'HN2RPP', 'hn-to-rpp', txt('makeRPPButtonText'), makeHNRPP, '-1');
        RegisterKeyboardShortcut(scriptName, 'HN2RPP', 'hn-to-rpp-streetside', txt('makeStreetSideRPPButtonText'), makeStreetSideRPP, '-1');
        LoadKeyboardShortcuts(scriptName);

        window.addEventListener("beforeunload", function() {
            SaveKeyboardShortcuts(scriptName);
        }, false);
        initUI();
    }

    async function initUI(){
        const tabPaneContent = [
            '<b>', GM_info.script.name, '</b> ', GM_info.script.version,
            `<div class="controls"><div class="container"><label for="hn2rpp-default-lock-level">${txt('defaultLockLevel')}</label><select id="hn2rpp-default-lock-level"><option value="1">1</option>`,
            `<option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option></select></div>`,
            `<div class="container"><input type="checkbox" id="hn2rpp-no-duplicates" /><label for="hn2rpp-no-duplicates">${txt('noDuplicatesLabel')}</label></div></div>`,
        ].join('');

        var res = W.userscripts.registerSidebarTab(scriptName);
        var tabLabel = res.tabLabel;
        var tabPane = res.tabPane;
        tabLabel.innerText = "HN2RPP";
        tabLabel.title = "Convert HNs to RPPs";
        tabPane.innerHTML = tabPaneContent;
        await W.userscripts.waitForElementConnected(tabPane);

        const s = localStorage.hn2rpp;
        settings = s ? JSON.parse(s) : { noDuplicates: true, defaultLockLevel: 1 };

        const noDuplicatesInput = q('#hn2rpp-no-duplicates');
        const defaultLockLevelInput = q('#hn2rpp-default-lock-level');

        noDuplicatesInput.checked = settings.noDuplicates;
        noDuplicatesInput.addEventListener('change', updateSettings);

        defaultLockLevelInput.value = settings.defaultLockLevel;
        defaultLockLevelInput.addEventListener('change', updateSettings);

        log('UI initialized...');
    }

    function txt(id) {
        let texts = {
            makeRPPButtonText: 'HN→RPP(EP on HN)',
            makeStreetSideRPPButtonText: 'HN→RPP(EP on street)',
            makeRPPTitleText: 'Creates RPPs with entry point (EP) at HN location',
            makeStreetSideRPPTitleText: 'Creates RPPs with entry point (EP) at HN entry point',
            noDuplicatesLabel: 'No RPP duplicates',
            //delHNButtonText: "Delete HN",
            defaultLockLevel: 'Default lock level',
            defaultPlacement: 'Default Entry Point Placement to HN location'
        };

        return texts[id];
    }

    function makeStreetSideRPP() { makeRPP(true); }

    function makeHNRPP() { makeRPP(false); }

    function makeRPP(epAtStreet) {
        log('Creating RPPs from HouseNumbers')
        const features = W.selectionManager.getSelectedFeatures();

        if (!features || features.length === 0 || features[0].featureType !== "segment" || !features.some(f => f._wmeObject.attributes.hasHNs)) return;
        const segments = [];

        // collect all segments ids with HN
        features.forEach(f => {
            if (!f._wmeObject.attributes.hasHNs) return;
            segments.push(f.id);
        });
        // check the currently loaded housenumber objects
        let objHNs = W.model.segmentHouseNumbers.objects;
        let loadedSegmentsId = segments.filter(function(key) {
            if (Object.keys(objHNs).indexOf(key) >= 0) {
                return false;
            } else if (oldSegmentsId.indexOf(key) < 0 || lastDownloadTime < objHNs[key].attributes.updatedOn) {
                return true;
            } else {
                return false;
            }
        });
        // Now we must load the housenumbers from the server which have not been loaded in
        if (loadedSegmentsId.length > 0) {
            lastDownloadTime = Date.now();
            $.ajax({
                dataType: "json",
                url: getDownloadURL(),
                data: {ids: loadedSegmentsId.join(",")},
                success: function(json) {
                    if (json.error !== undefined) {
                    } else {
                        var ids = [];
                        if ("undefined" !== typeof(json.segmentHouseNumbers.objects)) {
                            for (var k = 0; k < json.segmentHouseNumbers.objects.length; k++) {
                                addRPPForHN(json.segmentHouseNumbers.objects[k], 'JSON', epAtStreet)
                            }
                        }
                    }
                }
            });
        }
        W.model.segmentHouseNumbers.getByIds(segments).forEach(num => {
            addRPPForHN(num, 'OBJECT', epAtStreet)
        });
    }

    function addRPPForHN(num, source, epAtStreet){
        const epsg900913 = new OpenLayers.Projection("EPSG:900913");
        const epsg4326 = new OpenLayers.Projection("EPSG:4326");
        const Landmark = require('Waze/Feature/Vector/Landmark');
        const AddLandmark = require('Waze/Action/AddLandmark');
        const UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
        const seg = W.model.segments.getObjectById(num.segID);
        const addr = seg.getAddress(W.model).attributes;
        const hn = num.number;
        const fractionPoint = num.fractionPoint;
        const street = W.model.streets.getObjectById(seg.attributes.primaryStreetID);
        const streetName = street.attributes.name;
        const cityID = street.attributes.cityID;
        const city = W.model.cities.getObjectById(cityID);
        const stateID = city.attributes.stateID;
        const countryID = city.attributes.countryID;
        const houseNumber = hn;
        const geoJSONGeometry = W.userscripts.toGeoJSONGeometry(num.geometry);

        const newAddr = {
            emptyStreet: street.attributes.isEmpty, // TODO: fix this
            stateID,
            countryID,
            cityName: city.attributes.name,
            houseNumber,
            streetName,
            emptyCity: city.attributes.isEmpty // TODO: fix this
        };
        const residential = true;
        const categories = ['RESIDENTIAL'];
        const res = new Landmark({ geoJSONGeometry, categories, residential });
        /*if (source === 'JSON'){
            res.geometry = new OpenLayers.Geometry.Point(num.geometry.coordinates[0], num.geometry.coordinates[1]).transform(epsg4326, epsg900913);
        } else {
            res.geometry = num.geometry.clone();
        } */

        // set default lock level
        res.attributes.lockRank = settings.defaultLockLevel - 1;

        if(newAddr.emptyCity === true){
            let cityName = "";
            // If we haven't found a city name, search for a alt city name and use that
            if(addr.altStreets.length > 0){ //segment has alt names
                for(var j=0;j<seg.attributes.streetIDs.length;j++){
                    var altCity = W.model.cities.getObjectById(W.model.streets.getObjectById(seg.attributes.streetIDs[j]).attributes.cityID).attributes;

                    if(altCity.name !== null && altCity.name !== ""){
                        cityName = altCity.name;
                        break;
                    }
                }
            }
            if(cityName !== ""){
                newAddr.emptyCity = null;
                newAddr.cityName = cityName;
            }
        }

        // Setup a navigation point
        var ep;
        if (epAtStreet)
        {
            // let distanceToSegment = res.geometry.distanceTo(seg.geometry, { details: true });
            // const olPoint = offsetDistance(distanceToSegment.x1, distanceToSegment.y1, res.getOLGeometry().x, res.getOLGeometry().y).transform(epsg4326, epsg900913);
            ep = new NavigationPoint(fractionPoint);
        }
        else
        {
            ep = new NavigationPoint(geoJSONGeometry);
        }

        res.attributes.entryExitPoints.push(ep);

        if (settings.noDuplicates && hasDuplicates(res, addr, hn)) return;

        W.model.actionManager.add(new AddLandmark(res));
        W.model.actionManager.add(new UpdateFeatureAddress(res, newAddr));
    }

    function offsetDistance(x1, y1, x2, y2)
    {
        var xo = x1;
        var yo = y1;

        let dx = x2 - x1;
        let dy = y2 - y1;

        if (dx < 0) xo -= 5;
        else if (dx > 0) xo += 5;

        if (dy < 0) yo -= 5;
        else if (dy > 0) yo += 5;

        return new OpenLayers.Geometry.Point(xo, yo);
    }

    // Helper to create dom element with attributes
    function newEl(name, attrs) {
        const el = d.createElement(name);
        for (let attr in attrs) if (el[attr] !== undefined) el[attr] = attrs[attr];
        return el;
    }

    function updateSettings() {
        settings.noDuplicates = q('#hn2rpp-no-duplicates').checked;
        settings.defaultLockLevel = parseInt(q('#hn2rpp-default-lock-level').value);
        localStorage.hn2rpp = JSON.stringify(settings);
    }

    function onSelect(e) {
        const features = W.selectionManager.getSelectedFeatures();

        if (!features || features.length === 0 || features[0].featureType !== "segment" || !features.some(f => f._wmeObject.attributes.hasHNs)) return;
        let segElem = q('.segment-level-select');
        if (typeof e.tries === 'undefined') { e.tries = 1; }
        else { e.tries++; }
        if (!segElem) {
            if (e.tries > 50) {
                err('could not find segment edit element');
                return;
            }
            // log('seg elem not there yet ' + e.tries);
            setTimeout(function () {onSelect(e);}, 50);
            return;
        }

        const makeRPPBtn = newEl('wz-button', {
            innerText: txt('makeRPPButtonText'),
            title: txt('makeRPPTitleText')});

        const makeRPPStreetSideBtn = newEl('wz-button', {
            innerText: txt('makeStreetSideRPPButtonText'),
            title: txt('makeStreetSideRPPTitleText')});

        makeRPPBtn.setAttribute('color', 'secondary');
        makeRPPBtn.setAttribute('size', 'sm');
        makeRPPStreetSideBtn.setAttribute('color', 'secondary');
        makeRPPStreetSideBtn.setAttribute('size', 'sm');

        makeRPPBtn.addEventListener('click', makeHNRPP);
        makeRPPStreetSideBtn.addEventListener('click', makeStreetSideRPP);

        segElem.append(makeRPPBtn);
        segElem.append(makeRPPStreetSideBtn);

    }

    function hasDuplicates(poi, addr, hn) {
        const venues = W.model.venues.objects;
        for (let k in venues)
        {
            if (venues.hasOwnProperty(k)) {
                const otherPOI = venues[k];
                const otherAddr = otherPOI.getAddress(W.model).attributes;
                if (
                    poi.attributes.name == otherPOI.attributes.name
                    && hn == otherPOI.attributes.houseNumber
                    && poi.attributes.residential == otherPOI.attributes.residential
                    && addr.street.name == otherAddr.street.name
                    && addr.city.attributes.name == otherAddr.city.attributes.name
                    && addr.country.name == otherAddr.country.name
                ) return true; // This is duplicate
            }
        }
        return false;
    }

    function getDownloadURL(){
        let downloadURL = "https://www.waze.com";
        if (~document.URL.indexOf("https://beta.waze.com")) {
            downloadURL = "https://beta.waze.com";
        }
        downloadURL += getServer();
        return downloadURL;
    }

    function getServer(){
        return W.Config.api_base + "/HouseNumbers"
    }

    //setup keyboard shortcut's header and add a keyboard shortcuts
    function RegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
        // Figure out what language we are using
        var language = I18n.currentLocale();
        //check for and add keyboard shourt group to WME
        try {
            var x = I18n.translations[language].keyboard_shortcuts.groups[ScriptName].members.length;
        } catch (e) {
            //setup keyboard shortcut's header
            W.accelerators.Groups[ScriptName] = []; //setup your shortcut group
            W.accelerators.Groups[ScriptName].members = []; //set up the members of your group
            I18n.translations[language].keyboard_shortcuts.groups[ScriptName] = []; //setup the shortcuts text
            I18n.translations[language].keyboard_shortcuts.groups[ScriptName].description = ShortcutsHeader; //Scripts header
            I18n.translations[language].keyboard_shortcuts.groups[ScriptName].members = []; //setup the shortcuts text
        }
        //check if the function we plan on calling exists
        if (FunctionToCall && (typeof FunctionToCall == "function")) {
            I18n.translations[language].keyboard_shortcuts.groups[ScriptName].members[NewShortcut] = ShortcutDescription; //shortcut's text
            W.accelerators.addAction(NewShortcut, {
                group: ScriptName
            }); //add shortcut one to the group
            //clear the short cut other wise the previous shortcut will be reset MWE seems to keep it stored
            var ClearShortcut = '-1';
            var ShortcutRegisterObj = {};
            ShortcutRegisterObj[ClearShortcut] = NewShortcut;
            W.accelerators._registerShortcuts(ShortcutRegisterObj);
            if (ShortcutKeysObj !== null) {
                //add the new shortcut
                ShortcutRegisterObj = {};
                ShortcutRegisterObj[ShortcutKeysObj] = NewShortcut;
                W.accelerators._registerShortcuts(ShortcutRegisterObj);
            }
            //listen for the shortcut to happen and run a function
            W.accelerators.events.register(NewShortcut, null, function() {
                FunctionToCall();
            });
        } else {
            alert('The function ' + FunctionToCall + ' has not been declared');
        }

    }
    //if saved load and set the shortcuts
    function LoadKeyboardShortcuts(ScriptName) {
        if (localStorage[ScriptName + 'KBS']) {
            var LoadedKBS = JSON.parse(localStorage[ScriptName + 'KBS']);
            for (var i = 0; i < LoadedKBS.length; i++) {
                W.accelerators._registerShortcuts(LoadedKBS[i]);
            }
        }
    }

    function SaveKeyboardShortcuts(ScriptName) {
        var TempToSave = [];
        for (var name in W.accelerators.Actions) {
            var TempKeys = "";
            if (W.accelerators.Actions[name].group == ScriptName) {
                if (W.accelerators.Actions[name].shortcut) {
                    if (W.accelerators.Actions[name].shortcut.altKey === true) {
                        TempKeys += 'A';
                    }
                    if (W.accelerators.Actions[name].shortcut.shiftKey === true) {
                        TempKeys += 'S';
                    }
                    if (W.accelerators.Actions[name].shortcut.ctrlKey === true) {
                        TempKeys += 'C';
                    }
                    if (TempKeys !== "") {
                        TempKeys += '+';
                    }
                    if (W.accelerators.Actions[name].shortcut.keyCode) {
                        TempKeys += W.accelerators.Actions[name].shortcut.keyCode;
                    }
                } else {
                    TempKeys = "-1";
                }
                var ShortcutRegisterObj = {};
                ShortcutRegisterObj[TempKeys] = W.accelerators.Actions[name].id;
                TempToSave[TempToSave.length] = ShortcutRegisterObj;
            }
        }
        localStorage[ScriptName + 'KBS'] = JSON.stringify(TempToSave);
    }

    bootstrap();
})();
