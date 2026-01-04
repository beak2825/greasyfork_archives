// ==UserScript==
// @name         WME Wide-Angle Lens Name Homologator
// @namespace    https://greasyfork.org/en/users/mincho77
// @description  Plugin for WME Wide-Angle Lens to normalize place names
// @author       mincho77
// @match        https://*.waze.com/*editor*
// @grant        GM_xmlhttpRequest
// @version      1.4.2
// @license      MIT
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://greasyfork.org/scripts/40641/code/WME%20Wide-Angle%20Lens.user.js
// @downloadURL https://update.greasyfork.org/scripts/529657/WME%20Wide-Angle%20Lens%20Name%20Homologator.user.js
// @updateURL https://update.greasyfork.org/scripts/529657/WME%20Wide-Angle%20Lens%20Name%20Homologator.meta.js
// ==/UserScript==

var WMEWAL_NameHomologator;

(function () {
    'use strict';

    var SCRIPT_NAME = "WMEWAL Name Homologator";
    var SCRIPT_VERSION = "1.3";
    var pluginEnabled = false;
    var settings = {
        NormalizeAltNames: false
    };

    function log(level) {
        var args = Array.prototype.slice.call(arguments, 1);
        console[level](SCRIPT_NAME + ":", args.join(" "));
    }

    function createTab() {
        if (!window.W || !window.W.userscripts) {
            log("error", "W.userscripts is not available.");
            return;
        }
        // Evitar registrar el tab más de una vez
        if (typeof window.W.userscripts.getRegisteredSidebarTabs === "function") {
            var registered = window.W.userscripts.getRegisteredSidebarTabs();
            if (registered.indexOf("WMEWAL_NameHomologator") !== -1) {
                log("warn", "Sidebar tab already registered. Skipping...");
                return;
            }
        }
        // Registrar la pestaña
        var tabData = window.W.userscripts.registerSidebarTab("WMEWAL_NameHomologator");
        var tabLabel = tabData.tabLabel;
        var tabPane = tabData.tabPane;
        tabLabel.innerText = "Name Homologator";
        tabLabel.title = "Homologate Place Names";
        var tabContent = '' +
            '<div>' +
                '<h4>Name Homologator</h4>' +
                '<p>Normalize place names according to predefined rules.</p>' +
                '<label><input type="checkbox" id="homologator-alt-names"> Include Alt Names</label>' +
                '<br><br>' +
                '<button id="homologator-run" class="btn btn-primary">Run</button>' +
                ' <button id="homologator-reset" class="btn btn-secondary">Reset</button>' +
            '</div>';
        tabPane.innerHTML = tabContent;
        addEventListeners();
    }

    function addEventListeners() {
        var runBtn = document.getElementById("homologator-run");
        var resetBtn = document.getElementById("homologator-reset");
        if (runBtn) {
            runBtn.addEventListener("click", runHomologation);
        }
        if (resetBtn) {
            resetBtn.addEventListener("click", resetSettings);
        }
    }

    function runHomologation() {
        log("info", "Running homologation process...");
        pluginEnabled = true;
        var altCheck = document.getElementById("homologator-alt-names");
        settings.NormalizeAltNames = altCheck ? altCheck.checked : false;
        processPlaces();
    }

    function processPlaces() {
        if (!window.W || !window.W.model || !window.W.model.venues) {
            log("error", "WME data model is not available.");
            return;
        }
        var places = W.model.venues.getObjectArray();
        for (var i = 0; i < places.length; i++) {
            var place = places[i];
            var name = place.attributes.name;
            if (name) {
                // Normalización: quita espacios extra
                place.attributes.name = name.trim().replace(/\s+/g, ' ');
            }
            if (settings.NormalizeAltNames && place.attributes.altNames) {
                for (var j = 0; j < place.attributes.altNames.length; j++) {
                    place.attributes.altNames[j] = place.attributes.altNames[j].trim().replace(/\s+/g, ' ');
                }
            }
        }
        log("info", "Homologation completed.");
    }

    function resetSettings() {
        var altCheck = document.getElementById("homologator-alt-names");
        if (altCheck) {
            altCheck.checked = false;
        }
        pluginEnabled = false;
        log("info", "Settings reset.");
    }

    function registerPlugin() {
        if (!window.WMEWAL || !window.WMEWAL.RegisterPlugIn) {
            log("error", "WMEWAL not found. Plugin will not load.");
            return;
        }
        // Define el objeto plugin
        WMEWAL_NameHomologator = {
            Title: SCRIPT_NAME,
            MinimumZoomLevel: 3,
            Active: true,
            GetTab: createTab,
            ScanStarted: function () {
                return pluginEnabled;
            },
            ScanExtent: function (segments, venues) {
                processPlaces();
            },
            ScanComplete: function () {
                log("info", "Scan completed.");
            }
        };
        window.WMEWAL.RegisterPlugIn(WMEWAL_NameHomologator);
        log("info", "Plugin registered successfully.");
    }

    function waitForWMEWAL(attempts) {
        attempts = attempts || 0;
        if (window.WMEWAL && typeof window.WMEWAL.RegisterPlugIn === "function") {
            log("info", "WMEWAL detected. Registering plugin...");
            registerPlugin();
        } else {
            if (attempts < 15) { // 15 intentos de 500ms = 7.5 segundos máximo
                log("warn", "WMEWAL not available yet. Retrying attempt", attempts + 1);
                setTimeout(function () {
                    waitForWMEWAL(attempts + 1);
                }, 500);
            } else {
                log("error", "WMEWAL not found after multiple attempts. Plugin will not load.");
            }
        }
    }

    function init() {
        log("info", "Initializing...");
        if (window.W && window.W.userscripts && window.W.userscripts.state && window.W.userscripts.state.isReady) {
            waitForWMEWAL();
        } else {
            document.addEventListener('wme-ready', function () {
                waitForWMEWAL();
            }, { once: true });
        }
    }

    init();
})();