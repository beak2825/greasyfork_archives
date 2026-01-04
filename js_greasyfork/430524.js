// ==UserScript==
// @name         Edmunds Dealer Links
// @namespace    https://github.com/freshone
// @version      0.1
// @description  Replaces the dealer site link to directly point to the car's listing, if available
// @author       freshone
// @match        https://www.edmunds.com/*
// @icon         https://www.google.com/s2/favicons?domain=edmunds.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430524/Edmunds%20Dealer%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/430524/Edmunds%20Dealer%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dealers = [
        { hostname: "shift.com", origPath: "/", getDirectUrl: searchDescription, urlPattern: /shift\.com\/s\/[0-9]+/ },
        { hostname: "vroom.com", origPath: "/", getDirectUrl: appendVin, urlPattern: "vroom.com/inventory/"},
        { hostname: "carmax.com", origPath: "/cars", getDirectUrl: appendStockId, urlPattern: "carmax.com/car/"},
        // Carvana mostly does what you'd expect
        // { hostname: "carvana.com", origPath: "/cars", getDirectUrl: appendVehicleId, urlPattern: "carvana.com/vehicle/"},
    ];

    const dealerDescriptionQuery = "div[name='dealer']";
    const dealerLinkQuery = function(baseUrl) { return `div.dealer-overview a[href*='${baseUrl}']` };
    const stockQuery = "div[name='overview']";

    function getVin() {
        const match = window.location.pathname.match(/vin\/([0-9A-Z]+)/);
        const vin = match != null ? match[1] : null;

        if (vin == null) {
            console.warn("VIN not found in current page path: " + window.location.pathname);
        } else {
            console.debug("VIN: " + vin);
        }
        return vin;
    }

    function getStockId() {
        const match = $(stockQuery).text().match(/Stock: ([0-9A-Z]+)/);
        const stockId = match != null ? match[1] : null;
        console.debug("Stock: " + stockId);
        return stockId;
    }

    function getVehicleId(hostname) {
        const match = $(dealerLinkQuery(hostname)).first().attr("href").match(/utm_vehicle_id=([0-9]+)/);
        const vehicleId = match != null ? match[1] : null;
        console.debug("utm_vehicle_id: " + vehicleId);
        return vehicleId;
    }

    // Locates plain text urls in the dealer description
    function searchDescription() {
        for (var desc in $(dealerDescriptionQuery)) {
            const found = $(desc).text().match(this.urlPattern);
            if (found != null) {
                return found;
            }
        }
        return null;
    }

    function appendVin() {
        return appendId(this.urlPattern, getVin());
    }

    function appendStockId() {
        return appendId(this.urlPattern, getStockId());
    }

    function appendVehicleId() {
        return appendId(this.urlPattern, getVehicleId(this.hostname));
    }

    function appendId(url, id) {
        if (id == null) {
            return null;
        }
        return id != null ? url + id : null;
    }

    const success = dealers.some(dealer => {
        const dealerLink = $(dealerLinkQuery(dealer.hostname)).first();

        if (dealerLink.length == 0) {
            console.debug("Dealer is not " + dealer.hostname);
            return false;
        }

        console.info("Dealer is " + dealer.hostname);

        const url = dealer.getDirectUrl();

        if (url == null || url == "") {
            console.info("No direct link found for " + dealer.hostname);
            return false;
        }

        const origHref = dealerLink.attr("href");
        const baseUrl = dealer.hostname + dealer.origPath;
        const newHref = origHref.replace(baseUrl, url);
        console.debug("Original link: " + dealerLink.attr("href"));
        console.debug(`Replacing "${baseUrl}" with "${url}"`);
        console.info("Direct link: " + newHref);
        dealerLink.attr("href", newHref);
        return true;
    });

    if (!success) {
        console.info("No direct links found");
    }
})();
