/* global Waze */
// ==UserScript==
// @name                WME Geominator
// @author              k-l-b
// @namespace           https://greasyfork.org/en/users/30893-kevin-buley
// @description         Import geojson and manage geojson files
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.05
// @grant               none
// @copyright           2016 Kevin Buley
// @downloadURL https://update.greasyfork.org/scripts/17303/WME%20Geominator.user.js
// @updateURL https://update.greasyfork.org/scripts/17303/WME%20Geominator.meta.js
// ==/UserScript==


/**
 * Sends a simple message to the browser console prepended by our name
 * 
 * @param {string} message the message to be written
 * @returns undefined
 */
function debugLog(message) {
    window.console.log("WME-Geominator:" + message);
    return;
}

/**
 * Find elements matching the given class
 * 
 * @param classname The class name to search for
 * @param node The node to start searching at, or "body"
 * @returns An array of elements of the given class
 */
function getElementsByClassName(classname, node) {
    if (!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length; i < j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
    return a;
}


/**
 * Given a node name, return the HTML element for that node
 * 
 * @param node (description)
 * @returns (description)
 */
function getId(node) {
    return document.getElementById(node);
}

/**
 * Causes the script to wait for the user to be logged 
 * in and for the map to be ready 
 * 
 * @param e Event object
 */
function awaitLogin(e) {
    if (e && e.user === null) {
        return;
    }

    if (typeof Waze === 'undefined' || typeof Waze.loginManager === 'undefined') {
        setTimeout(awaitLogin, 100);
        return;
    }

    if (!Waze.loginManager.hasUser()) {
        Waze.loginManager.events.register("login", null, awaitLogin);
        Waze.loginManager.events.register("loginStatus", null, awaitLogin);
        return;
    }

    if (getId('WazeMap') === null) {
        setTimeout(awaitLogin, 100);
        return;
    }
    
     if (getElementsByClassName('tab-content')[0] === undefined) {
         setTimeout(init, 1000);
     }

    init();
}


function initTab() {
    try {
        // Get handles on the tabs and panels
        var userTabs = getId('user-info');
        var navTabs = getElementsByClassName('nav-tabs',userTabs)[0];
        var tabContent = getElementsByClassName('tab-content', userTabs)[0];
        
        // Create the tab
        var myTab = document.createElement('li');
        myTab.innerHTML = '<a id="sidepanel-geominator-tab" href="#sidepanel-geominator" data-toggle="tab" style="padding: 4px;">Geominator</a>';
        
        // Create the panel
        var myTabPanel = document.createElement('section');
        myTabPanel.id = "sidepanel-geominator";
        myTabPanel.className = "tab-pane";

        // Create the tab content
        var myTabContent = document.createElement('p');
        myTabContent.style.padding = "padding: 8px 16px;";
        myTabContent.id = "geominatorTab";
        myTabContent.innerHTML = '<b>WME Geominator</b><br>';
        initLayers(myTabContent);
        

        // Attach the tab to the tab bar
        navTabs.appendChild(myTab);
        // Attach the content to the panel
        myTabPanel.appendChild(myTabContent);
        // Attach the panel to the sidebar 
        tabContent.appendChild(myTabPanel);
    } catch (err) {
        debugLog(err.message);
    }
}

function addLayerToMap(layer) {
    debugLog("enabled: ");
    return;
}

function removeLayerFromMap() {
    debugLog("removed: ");
    return;
}

function addNewLayer() {
    debugLog("loaded: ");
    return;
}

function deleteLayer() {
    debugLog("deleted: ");
    return;
}

/// layer = {
///     id :            // unique rownumber
///     layerData :     // the data from the loaded map file
///     layerType :     // what type of map file is this?
///     title:          // the name of the layer
///     enabled:        // is this layer turned on?
///     color:          // the color for this layer
///     
function initLayers(geomTab) {
    if ('undefined' === typeof localStorage.GeominatorLayers || !IsJsonString(localStorage.getItem('GeominatorLayers'))) {
        localStorage.setItem('GeominatorLayers', '[]'); 
        debugLog("Something went wrong parsing the localstorage!");
    }
    var layers = JSON.parse(localStorage.GeominatorLayers);
    var layerList = document.createElement('ul');
    for (var i = 0; i < layers.length; i++) {
        var lineItem = document.createElement('li');
        
        var checkBox = document.createElement('input');
        checkBox.type = "checkbox";
        checkBox.id = "cb_geominator_" + layers[i].id;
        checkBox.checked = layers[i].enabled;
        
        var checkLabel = document.createElement('label');
        checkLabel.htmlFor = "cb_geominator_" + layers[i].id;
        checkLabel.appendChild(document.createTextNode(layers[i].title));

        
        
        layerList.insertAdjacentElement('beforeend', lineItem);
        lineItem.insertAdjacentElement('afterbegin', checkLabel);
        lineItem.insertAdjacentElement('afterbegin', checkBox);
    }
    geomTab.insertAdjacentElement('beforeend', layerList);
   return;
}

    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

function setTestData() {
    var testLayerData = [];
    var testLayer1 = {};
    testLayer1.id=1;
    testLayer1.layerData = '{1,2,4,6,23,67,2,664,2565,2}';
    testLayer1.layerType = 'GeoJSON';
    testLayer1.title = 'Map Layer 1';
    testLayer1.enabled = true;
    testLayer1.color = 'red';
    testLayerData[0] = testLayer1;
    testLayerData[1] = {};
    testLayerData[1].id=2;
    testLayerData[1].layerData = '{14,232,34,56,2,6,21,64,25,21}';
    testLayerData[1].layerType = 'GeoJSON';
    testLayerData[1].title = 'some other layer';
    testLayerData[1].enabled = false;
    testLayerData[1].color = 'blue';
    localStorage.setItem('GeominatorLayers', JSON.stringify(testLayerData, null, 4));
}

function init() {
    debugLog("Starting up!");
    if ('undefined' === typeof localStorage.GeominatorLayers || !IsJsonString(localStorage.getItem('GeominatorLayers'))) {
        setTestData();
    }
    initTab();
}
awaitLogin();
