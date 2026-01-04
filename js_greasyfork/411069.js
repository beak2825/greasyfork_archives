// ==UserScript==
// @name            WME Reload Map Position Fix
// @namespace       https://greasyfork.org/users/166843
// @description     Keeps track of the current map center and zoom and restores it upon reloading.
// @version         2023.03.15.01
// @author          dBsooner
// @grant           none
// @license         GPLv3
// @match           http*://*.waze.com/*editor*
// @exclude         http*://*.waze.com/user/editor*
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/411069/WME%20Reload%20Map%20Position%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/411069/WME%20Reload%20Map%20Position%20Fix.meta.js
// ==/UserScript==

/* global W, $, OpenLayers */

/* Changelog:                                                                           *
 *  2020.09.08.01: Initial release.                                                     *
 *  2020.09.09.01: Check for URL parameters.                                            *
 *  2021.09.01.01: Update to latest WME zoom level changes.                             *
 *  2023.03.15.01: New bootstrap routine.                                               *
 *                 Code structure with new linter options.                              *
 *                 Change @include to @match with @exclude in userscript headers.       *
 *                                                                                      */

(function () {
    'use strict';

    const SETTINGS_STORE_NAME = 'WME_RMPF';

    function log(message) { console.log('WME-RMPF:', message); }

    function updatedSavedMapPosition() {
        const storage = { savedCenter: W.map.getCenter(), savedZoom: W.map.getZoom() };
        localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(storage));
        sessionStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(storage));
    }

    function onWmeReady() {
        const loadedSettings = $.parseJSON(sessionStorage.getItem(SETTINGS_STORE_NAME)) || $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME)),
            savedCenter = (loadedSettings) ? loadedSettings.savedCenter : W.map.getCenter(),
            savedZoom = (loadedSettings) ? loadedSettings.savedZoom : W.map.getZoom(),
            currCenter = W.map.getCenter(),
            currZoom = W.map.getZoom(),
            urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get('lon') && !urlParams.get('lat') && !urlParams.get('zoomLevel') && ((currCenter.lon !== savedCenter.lon) || (currCenter.lat !== savedCenter.lat) || (savedZoom !== currZoom))) {
            log('Changing map position.');
            W.map.getOLMap().moveTo(new OpenLayers.LonLat([savedCenter.lon, savedCenter.lat]), savedZoom);
        }
        W.map.events.register('zoomend', null, updatedSavedMapPosition);
        W.map.events.register('moveend', null, updatedSavedMapPosition);
        window.addEventListener('beforeunload', updatedSavedMapPosition, false);
    }

    function onWmeInitialized() {
        if (W.userscripts?.state?.isReady) {
            log('W is ready and already in "wme-ready" state. Proceeding with initialization.');
            onWmeReady();
        }
        else {
            log('W is ready, but state is not "wme-ready". Adding event listener.');
            document.addEventListener('wme-ready', onWmeReady, { once: true });
        }
    }

    function bootstrap() {
        if (!W) {
            log('W is not available. Adding event listener.');
            document.addEventListener('wme-initialized', onWmeInitialized, { once: true });
        }
        else {
            onWmeInitialized();
        }
    }

    bootstrap();
}
)();
