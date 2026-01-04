// ==UserScript==
// @name         WME Link to Geoportal Papua New Guinea
// @description  Adds buttons to Waze Map Editor to open the Geoportal of Papua New Guinea.
// @namespace    https://github.com/Dwinger2006/Geo_PNG
// @version      2025.02.06.01
// @include      https://*.waze.com/editor*
// @include      https://*.waze.com/*editor*
// @grant        none
// @author       Dancingman81
// @license      MIT
// @syncURL      https://github.com/Dwinger2006/Geo_PNG/raw/main/Geo_PNG.user.js
// @downloadURL https://update.greasyfork.org/scripts/526129/WME%20Link%20to%20Geoportal%20Papua%20New%20Guinea.user.js
// @updateURL https://update.greasyfork.org/scripts/526129/WME%20Link%20to%20Geoportal%20Papua%20New%20Guinea.meta.js
// ==/UserScript==

var PNGGeo_version = '2005.02.06.01';

(function() {
    'use strict';

    // Referenz für das Geoportal-Fenster
    let geoportalWindow = null;

    // Initialisiere die Schaltfläche, sobald WME bereit ist
    function initialize() {
        if (typeof W !== 'undefined' && W.map && W.loginManager && W.loginManager.user) {
            addButton();
        } else {
            console.log("WME ist noch nicht bereit, versuche es erneut...");
            setTimeout(initialize, 1000);
        }
    }

    // Funktion zum Erstellen der Schaltfläche für das Geoportal Papua-Neuguinea
    function createPNGButton() {
        console.log("Erstelle Schaltfläche für Geoportal Papua-Neuguinea");
        var png_btn = document.createElement('button');
        png_btn.style = "width: 285px; height: 24px; font-size: 85%; color: green; border-radius: 5px; border: 0.5px solid lightgrey; background: white; margin-bottom: 10px;";
        png_btn.innerHTML = "Geoportal Papua-Neuguinea";

        png_btn.addEventListener('click', function() {
            if (W.map) {
                let center = W.map.getCenter();
                let zoom = W.map.getZoom();
                let lat = center.lat;
                let lon = center.lon;

                // Konstruiere die URL für das Geoportal mit den aktuellen Koordinaten und Zoom-Level
                var mapsUrl = `https://png-geoportal.org/catalogue/#/map/111?lat=${lat}&lon=${lon}&zoom=${zoom}`;

                console.log("Geoportal-URL:", mapsUrl);

                // Öffne oder fokussiere das Geoportal-Fenster
                if (geoportalWindow && !geoportalWindow.closed) {
                    geoportalWindow.location.href = mapsUrl;
                    geoportalWindow.focus();
                } else {
                    geoportalWindow = window.open(mapsUrl, 'geoportalPNG');
                }
            } else {
                console.error("W.map ist nicht verfügbar.");
            }
        });

        return png_btn;
    }

    // Funktion zum Hinzufügen der Schaltfläche zum WME-Seitenpanel
    function addButton() {
        console.log("Füge Schaltfläche hinzu...");

        // Überprüfe, ob das Panel bereits existiert, um doppelte Einträge zu vermeiden
        if (document.getElementById("sidepanel-png") !== null) {
            console.log("Schaltfläche existiert bereits.");
            return;
        }

        var addon = document.createElement('section');
        addon.id = "png-addon";
        addon.innerHTML = `
        <b><p style="font-family: verdana, sans-serif; font-size: 12px; text-decoration: none;">
        <a href="https://greasyfork.org/de/scripts/526129-wme-link-to-geoportal-papua-new-guinea" target="_blank">
        <b>Link zum PNG Geoportal</b> v${PNGGeo_version}</a></p>`;

        var userTabs = document.getElementById('user-info');
        var navTabs = userTabs?.getElementsByClassName('nav-tabs')[0];
        var tabContent = userTabs?.getElementsByClassName('tab-content')[0];

        if (navTabs && tabContent) {
            var newtab = document.createElement('li');
            newtab.innerHTML = '<a href="#sidepanel-png" data-toggle="tab">Geo PNG</a>';
            navTabs.appendChild(newtab);

            var newtabContent = document.createElement('div');
            newtabContent.id = "sidepanel-png";
            newtabContent.className = "tab-pane";
            newtabContent.appendChild(addon);

            tabContent.appendChild(newtabContent);

            var pngButton = createPNGButton();

            addon.appendChild(pngButton);

            console.log("Schaltfläche erfolgreich hinzugefügt.");
        } else {
            console.error("Konnte das Benutzerinformationspanel nicht finden, um die Schaltfläche hinzuzufügen.");
        }
    }

    // Initialisiere das Skript
    initialize();

})();