// ==UserScript==
// @name         WME House Numbers to RPP
// @version      2022.05.24.02
// @description  Converts HN to RPP
// @author       davidakachaos
// @include      /^https:\/\/(www|beta)\.waze\.com(\/\w{2,3}|\/\w{2,3}-\w{2,3}|\/\w{2,3}-\w{2,3}-\w{2,3})?\/editor\b/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://greasyfork.org/scripts/38421-wme-utils-navigationpoint/code/WME%20Utils%20-%20NavigationPoint.js?version=251065
// @grant        none
// @namespace WME
// @downloadURL https://update.greasyfork.org/scripts/423319/WME%20House%20Numbers%20to%20RPP.user.js
// @updateURL https://update.greasyfork.org/scripts/423319/WME%20House%20Numbers%20to%20RPP.meta.js
// ==/UserScript==
/* global W */
/* global WazeWrap */
/* global NavigationPoint */
/* global I18n */
/* global OpenLayers */
/* global require */
/* global $ */

// 2022-05-24 HNs includid a slash ('/') are turned into POIs, because RPPs do not support those. New RPP will have a lowercase letter.
// 2021-12-12 HN delete button is back. Navigation Points are added to every segment no matter the type. Improved readability.
// 2021-10-04 Add navigation points when nearest segment is PLR, PR or off-road
// 2021-09-28 Fix house numbers for RPPs
// Update 2020-10-18: Added option to use the alt city name when no city found initial
// Update 2020-10-18: Added option to set a default lock level in the settings

(function () {

  function log(m) {
    console.log('%cWME HN2RPP:%c ' + m, 'color: darkcyan; font-weight: bold', 'color: dimgray; font-weight: normal');
  }

  function warn(m) {
    console.warn('WME HN2RPP: ' + m);
  }

  function err(m) {
    console.error('WME HN2RPP: ' + m);
  }


  const d = window.document;
  const q = d.querySelector.bind(d);
  let sm = null; // Waze Selection Manager
  let settings = {};
  let lastDownloadTime = Date.now();
  const oldSegmentsId = [];
  const locales = {
    en: {
      makeRppButtonText: 'HN → RPP',
      delHNButtonText: 'Delete HN',
      noDuplicatesLabel: 'No RPP duplicates',
      displayDeleteButtonLabel: 'Display House Number clearing button \n (BUTTON WILL CLEAR THE WHOLE STREET!)',
      defaultLockLevel: 'Default lock level'
    },
    nl: {
      makeRppButtonText: 'HN → RPP',
      delHNButtonText: 'Удалить HN',
      noDuplicatesLabel: 'Geen duplicaten',
      defaultLockLevel: 'Standaard lock level'
    },
    ru: {
      makeRppButtonText: 'HN → RPP',
      delHNButtonText: 'Видалити HN',
      noDuplicatesLabel: 'Без дубликатов RPP',
      defaultLockLevel: 'Default lock level'
    }
  };

  function txt(id) {
    return locales[I18n.locale] === undefined ? locales['en'][id] : locales[I18n.locale][id];
  }

  // Helper to create dom element with attributes
  function newEl(name, attrs) {
    const el = d.createElement(name);
    for (const attr in attrs) {
      if (el[attr] !== undefined) {
        el[attr] = attrs[attr];
      }
    }
    return el;
  }

  function wait() {
    if (!W || !W.map || !W.model) {
      setTimeout(wait, 1000);
      log('Waiting Waze...');
      return;
    }
    log('Ready...');
    init();
  }

  function initUI() {
    const tabs = q('.nav-tabs'), tabContent = q('#user-info .tab-content');

    if (!tabs || !tabContent) {
      log('Waze UI not ready...');
      setTimeout(initUI, 500);
      return;
    }

    const tabPaneContent = [
      '<h4>WME HN2RPP</h4>',
      `<div class="controls"><div class="controls-container"><label for="hn2rpp-default-lock-level">${txt('defaultLockLevel')}</label><select class="form-control" id="hn2rpp-default-lock-level"><option value="1">1</option>`,
      `<option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option></select></div>`,
      `<div class="controls-container"><input type="checkbox" id="hn2rpp-no-duplicates" /><label for="hn2rpp-no-duplicates">${txt('noDuplicatesLabel')}</label></div>`,
      `<div class="controls-container"><input type="checkbox" id="hn2rpp-delete-button" /><label for="hn2rpp-delete-button" style="white-space:pre;">${txt('displayDeleteButtonLabel')}</label></div></div>`,
    ].join('');

    const tabPane = newEl('div', {id: 'sidepanel-hn2rpp', className: 'tab-pane', innerHTML: tabPaneContent});

    tabs.appendChild(newEl('li', {innerHTML: '<a href="#sidepanel-hn2rpp" data-toggle="tab">HN2RPP</a>'}));
    tabContent.appendChild(tabPane);

    const s = localStorage['hn2rpp'];
    settings = s ? JSON.parse(s) : {noDuplicates: true, defaultLockLevel: 1, displayDeleteButton: false};

    const noDuplicatesInput = q('#hn2rpp-no-duplicates');
    const defaultLockLevelInput = q('#hn2rpp-default-lock-level');
    const displayDeleteButtonInput = q('#hn2rpp-delete-button');

    noDuplicatesInput.checked = settings.noDuplicates;
    noDuplicatesInput.addEventListener('change', updateSettings);

    defaultLockLevelInput.value = settings.defaultLockLevel;
    defaultLockLevelInput.addEventListener('change', updateSettings);

    displayDeleteButtonInput.checked = settings.displayDeleteButton;
    displayDeleteButtonInput.addEventListener('change', showAlert);

    log('UI initialized...');
    const updateMessage = "HNs including a slash will convert into a POI, because RPPs do not support it. HNs converted to RPPs will have lowercase letter."
    WazeWrap.Interface.ShowScriptUpdate("HN to RPP", GM_info.script.version, updateMessage, "", "");
  }

  function init() {
    sm = W.selectionManager;
    sm.events.register('selectionchanged', null, onSelect);
    W.editingMediator.on('change:editingHouseNumbers', onEditingHN);

    const scriptName = 'hn2rpp';

    RegisterKeyboardShortcut(scriptName, 'HN2RPP', 'hn-to-rpp', txt('makeRppButtonText'), makeRPP, '-1');
    RegisterKeyboardShortcut(scriptName, 'HN2RPP', 'delete-hn', txt('delHNButtonText'), delHN, '-1');
    LoadKeyboardShortcuts(scriptName);

    window.addEventListener('beforeunload', () => {
      SaveKeyboardShortcuts(scriptName);
    }, false);

    initUI();
  }

    function showAlert() {
        window.confirm('This button will remove house numbers on the WHOLE street!');
        updateSettings();
    }

  function updateSettings() {
    settings.noDuplicates = q('#hn2rpp-no-duplicates').checked;
    settings.defaultLockLevel = parseInt(q('#hn2rpp-default-lock-level').value);
    settings.displayDeleteButton = q('#hn2rpp-delete-button').checked;
    localStorage['hn2rpp'] = JSON.stringify(settings);
  }

  function onSelect() {
    const fts = sm.getSelectedFeatures();

    if (!fts || fts.length === 0 || fts[0].model.type !== 'segment' || !fts.some(f => f.model.attributes.hasHNs)) {
      return;
    }

    const pane = newEl('div', {className: 'form-group'});
    const makeRppBtn = newEl('button', {
      className: 'waze-btn waze-btn-white action-button',
      style: 'display: inline-block',
      innerText: txt('makeRppButtonText')
    });

    makeRppBtn.addEventListener('click', makeRPP);

    pane.appendChild(makeRppBtn);

    q('#edit-panel .tab-pane').insertBefore(pane, q('#edit-panel .tab-pane .more-actions'));
  }

  function hasDuplicates(rpp, addr) {
    const venues = W.model.venues.objects;
    for (const k in venues) {
      if (venues.hasOwnProperty(k)) {
        const otherRPP = venues[k];
        const otherAddr = otherRPP.getAddress().attributes;
        if (
          rpp.attributes.name == otherRPP.attributes.name
          && rpp.attributes.houseNumber == otherRPP.attributes.houseNumber
          && rpp.attributes.residential == otherRPP.attributes.residential
          && addr.street.name == otherAddr.street.name
          && addr.city.attributes.name == otherAddr.city.attributes.name
          && addr.country.name == otherAddr.country.name
        ) {
          return true;
        } // This is duplicate
      }
    }
    return false;
  }

  function makeRPP() {
    log('Creating RPPs from HouseNumbers');
    const fts = sm.getSelectedFeatures();

    if (!fts || fts.length === 0 || fts[0].model.type !== 'segment' || !fts.some(f => f.model.attributes.hasHNs)) {
      return;
    }
    const segs = [];

    // collect all segments ids with HN
    fts.forEach(f => {
      if (!f.model.attributes.hasHNs) {
        return;
      }
      segs.push(f.model.attributes.id);
    });
    // check the currently loaded housenumber objects
    const objHNs = W.model.segmentHouseNumbers.objects;
    const loadedSegmentsId = segs.filter(function (key) {
      if (Object.keys(objHNs).indexOf(key) >= 0) {
        return false;
      } else {
        return oldSegmentsId.indexOf(key) < 0 || lastDownloadTime < objHNs[key].attributes.updatedOn;
      }
    });
    // Now we must load the housenumbers from the server which have not been loaded in
    if (loadedSegmentsId.length > 0) {
      lastDownloadTime = Date.now();
      $.ajax({
        dataType: 'json',
        url: getDownloadURL(),
        data: {ids: loadedSegmentsId.join(',')},
        success: function (json) {
          if (json.error !== undefined) {
          } else {
            const ids = [];
            if ('undefined' !== typeof (json.segmentHouseNumbers.objects)) {
              for (let k = 0; k < json.segmentHouseNumbers.objects.length; k++) {
                // drawHNLine("JSON", json.segmentHouseNumbers.objects[k]);
                addRppForHN(json.segmentHouseNumbers.objects[k], 'JSON');
              }
            }
          }
        }
      });
    }
    W.model.segmentHouseNumbers.getByIds(segs).forEach(num => {
      addRppForHN(num, 'OBJECT');
    });
  }

  function onEditingHN() {
    if (!settings.displayDeleteButton){
        return;
    }

    const delHNbtn = newEl('div', {
      className: 'toolbar-button',
      style: 'float: left',
      innerText: txt('delHNButtonText')
    });
    delHNbtn.addEventListener('click', delHN);
    setTimeout(() => {
      $('#primary-toolbar').find('.add-house-number').after(delHNbtn);
    }, 500);
  }

  function delHN() {
    selectEntireStreet();

    const fts = sm.getSelectedFeatures();

    if (!fts || fts.length === 0 || fts[0].model.type !== 'segment' || !fts.some(f => f.model.attributes.hasHNs)) {
      return;
    }

    const DeleteHouseNumberAction = require('Waze/Actions/DeleteHouseNumber');
    const segs = [];
    const houseNumbers = W.model.segmentHouseNumbers.getObjectArray();

    fts.forEach(f => {
      if (!f.model.attributes.hasHNs) {
        return;
      }
      segs.push(f.model.attributes.id);
    });

    segs.forEach(segID => {
      houseNumbers.forEach(hn => {
        if (hn.getSegmentId() == segID) {
          W.model.actionManager.add(new DeleteHouseNumberAction(hn));
        }
      });
    });
  }

  function selectEntireStreet() {
    const selectedFeature = sm.getSelectedFeatures()[0];
    if (selectedFeature) {
      const featureStreetId = selectedFeature.model.attributes.primaryStreetID;
      const sameStreetSegments = W.model.segments.getByAttributes({primaryStreetID: featureStreetId});

      W.selectionManager.unselectAll();
      W.selectionManager.setSelectedModels(sameStreetSegments);
    }
  }

  function addRppForHN(num, source) {
    const epsg900913 = new OpenLayers.Projection('EPSG:900913');
    const epsg4326 = new OpenLayers.Projection('EPSG:4326');
    const Landmark = require('Waze/Feature/Vector/Landmark');
    const AddLandmark = require('Waze/Action/AddLandmark');
    const UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
    const seg = W.model.segments.getObjectById(num.segID);
    const addr = seg.getAddress().attributes;
    const houseNumber = num.number.toLocaleLowerCase();
    const streetName = addr.street.name;

    const newAddr = {
      countryID: addr.country.id,
      stateID: addr.state.id,
      cityName: addr.city.attributes.name,
      emptyCity: addr.city.attributes.name ? null : true,
      streetName: streetName,
      houseNumber: houseNumber,
      streetEmpty: !1,
    };


    const res = new Landmark();

    if (source === 'JSON') {
      res.geometry = new OpenLayers.Geometry.Point(num.geometry.coordinates[0], num.geometry.coordinates[1]).transform(epsg4326, epsg900913);
    } else {
      res.geometry = num.geometry.clone();
    }
    // res.geometry.x += 10;
    res.attributes.houseNumber = houseNumber;
    if(houseNumber.includes('/')){
        res.attributes.name = `${streetName} ${houseNumber}`;
        res.attributes.categories = ['OTHER'];
    } else {
        res.attributes.residential = true;
    }
    // set default lock level
    res.attributes.lockRank = settings.defaultLockLevel - 1;

    if (newAddr.emptyCity === true) {
      let cityName = '';
      // If we haven't found a city name, search for a alt city name and use that
      if (addr.altStreets.length > 0) { // segment has alt names
        for (let j = 0; j < seg.attributes.streetIDs.length; j++) {
          const altCity = W.model.cities.getObjectById(W.model.streets.getObjectById(seg.attributes.streetIDs[j]).cityID).attributes;

          if (altCity.name !== null && altCity.englishName !== '') {
            cityName = altCity.name;
            break;
          }
        }
      }
      if (cityName !== '') {
        newAddr.emptyCity = null;
        newAddr.cityName = cityName;
      }
    }

    if (settings.noDuplicates && hasDuplicates(res, addr)) {
      return;
    }

    const closestSeg = WazeWrap.Geometry.findClosestSegment(res.geometry);

    if (closestSeg){
      const distanceToSegment = res.geometry.distanceTo(closestSeg.geometry, {details: true});
      const closestPoint = new OpenLayers.Geometry.Point(1 * distanceToSegment.x1 / 2 + distanceToSegment.x0 / 2, 1 * distanceToSegment.y1 / 2 + distanceToSegment.y0 / 2);
      if (closestPoint) {
        const eep = new NavigationPoint(closestPoint);
        res.attributes.entryExitPoints.push(eep);
      }
    }

    W.model.actionManager.add(new AddLandmark(res));
    W.model.actionManager.add(new UpdateFeatureAddress(res, newAddr));
  }

  function getDownloadURL() {
    let downloadURL = 'https://www.waze.com';
    if (~document.URL.indexOf('https://beta.waze.com')) {
      downloadURL = 'https://beta.waze.com';
    }
    downloadURL += getServer();
    return downloadURL;
  }

  function getServer() {
    return W.Config.api_base + '/HouseNumbers';
  }

  // setup keyboard shortcut's header and add a keyboard shortcuts
  function RegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
    // Figure out what language we are using
    const language = I18n.currentLocale();
    // check for and add keyboard shourt group to WME
    try {
      const x = I18n.translations[language].keyboard_shortcuts.groups[ScriptName].members.length;
    } catch (e) {
      // setup keyboard shortcut's header
      W.accelerators.Groups[ScriptName] = []; // setup your shortcut group
      W.accelerators.Groups[ScriptName].members = []; // set up the members of your group
      I18n.translations[language].keyboard_shortcuts.groups[ScriptName] = []; // setup the shortcuts text
      I18n.translations[language].keyboard_shortcuts.groups[ScriptName].description = ShortcutsHeader; // Scripts header
      I18n.translations[language].keyboard_shortcuts.groups[ScriptName].members = []; // setup the shortcuts text
    }
    // check if the function we plan on calling exists
    if (FunctionToCall && (typeof FunctionToCall == 'function')) {
      I18n.translations[language].keyboard_shortcuts.groups[ScriptName].members[NewShortcut] = ShortcutDescription; // shortcut's text
      W.accelerators.addAction(NewShortcut, {
        group: ScriptName
      }); // add shortcut one to the group
      // clear the short cut other wise the previous shortcut will be reset MWE seems to keep it stored
      const ClearShortcut = '-1';
      let ShortcutRegisterObj = {};
      ShortcutRegisterObj[ClearShortcut] = NewShortcut;
      W.accelerators._registerShortcuts(ShortcutRegisterObj);
      if (ShortcutKeysObj !== null) {
        // add the new shortcut
        ShortcutRegisterObj = {};
        ShortcutRegisterObj[ShortcutKeysObj] = NewShortcut;
        W.accelerators._registerShortcuts(ShortcutRegisterObj);
      }
      // listen for the shortcut to happen and run a function
      W.accelerators.events.register(NewShortcut, null, function () {
        FunctionToCall();
      });
    } else {
      alert('The function ' + FunctionToCall + ' has not been declared');
    }

  }

  // if saved load and set the shortcuts
  function LoadKeyboardShortcuts(ScriptName) {
    if (localStorage[ScriptName + 'KBS']) {
      const LoadedKBS = JSON.parse(localStorage[ScriptName + 'KBS']); // JSON.parse(localStorage['WMEAwesomeKBS']);
      for (let i = 0; i < LoadedKBS.length; i++) {
        W.accelerators._registerShortcuts(LoadedKBS[i]);
      }
    }
  }

  function SaveKeyboardShortcuts(ScriptName) {
    const TempToSave = [];
    for (const name in W.accelerators.Actions) {
      let TempKeys = '';
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
          if (TempKeys !== '') {
            TempKeys += '+';
          }
          if (W.accelerators.Actions[name].shortcut.keyCode) {
            TempKeys += W.accelerators.Actions[name].shortcut.keyCode;
          }
        } else {
          TempKeys = '-1';
        }
        const ShortcutRegisterObj = {};
        ShortcutRegisterObj[TempKeys] = W.accelerators.Actions[name].id;
        TempToSave[TempToSave.length] = ShortcutRegisterObj;
      }
    }
    localStorage[ScriptName + 'KBS'] = JSON.stringify(TempToSave);
  }

  wait();
})();