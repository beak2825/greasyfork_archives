// ==UserScript==
// @name         TxDOT ITS Addons
// @namespace    https://fxzfun.com/userscripts
// @version      1.0.0
// @description  Adds the ability to use url parameters to move the map
// @author       FXZFun
// @match        https://its.txdot.gov/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=its.txdot.gov
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485404/TxDOT%20ITS%20Addons.user.js
// @updateURL https://update.greasyfork.org/scripts/485404/TxDOT%20ITS%20Addons.meta.js
// ==/UserScript==

/* global districtItsViewModel, Microsoft */

(function() {
    'use strict';

    const waitForDependencies = async () => {
        while (
            typeof Microsoft === 'undefined' ||
            typeof Microsoft.Maps.Location === 'undefined' ||
            typeof districtItsViewModel === 'undefined' ||
            typeof districtItsViewModel.map() === 'undefined'
        ) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    };

    const setMapView = async () => {
        const params = new URLSearchParams(location.search);

        await waitForDependencies();

        const lat = params.has('lat') ? params.get('lat') : params.has('latitude') ? params.get('latitude') : '';
        const lng = params.has('lng') ? params.get('lng') : params.has('lon') ? params.get('lon') : params.has('longitude') ? params.get('longitude') : '';
        const zoom = params.has('z') ? parseInt(params.get('z')) : params.has('zoom') ? parseInt(params.get('zoom')) : 10;
        const center = new Microsoft.Maps.Location(lat, lng);

        districtItsViewModel.map().setView({ center, zoom });
    };

    setMapView();

})();
