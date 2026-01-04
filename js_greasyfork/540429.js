// ==UserScript==
// @name         Vehicle Item Warning - Zed City
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Warns you when you have items in your vehicle on the explore page
// @author       Bennie
// @match        https://www.zed.city/*
// @connect      api.zed.city
// @icon         https://www.zed.city/icons/favicon.svg
// @grant        GM_xmlhttpRequest
// @run-at document-end
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/540429/Vehicle%20Item%20Warning%20-%20Zed%20City.user.js
// @updateURL https://update.greasyfork.org/scripts/540429/Vehicle%20Item%20Warning%20-%20Zed%20City.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let hasFetched = false;
    let banner;

    function fetchVehicleItems() {
        if (hasFetched) return;

        console.log("Fetching vehicle items from API...");
        hasFetched = true;

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.zed.city/loadItems",
            headers: {
                "Accept": "application/json",
                "Referer": "https://www.zed.city/"
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const vehicleItems = data.vehicle_items || [];

                    if (vehicleItems.length > 0) {
                        showWarningBanner(vehicleItems.length);
                    }
                } catch (error) {
                    console.error("JSON Parse Error:", error);
                }
            },
            onerror: function(error) {
                console.error("API Fetch Failed:", error);
            }
        });
    }

    function showWarningBanner(itemCount) {
        if (!window.location.href.includes("/explore")) return;

        let exploreContainer = document.querySelector(".overlay-cont");

        if (!exploreContainer) {
          console.error("Explore container not found!");
          return;
        }

        const banner = document.createElement("div");
        banner.id = "vehicleWarningBanner";
        banner.style.position = "relative";
        banner.style.backgroundColor = "#a61d1d";
        banner.style.color = "white";
        banner.style.border = "black 1px solid";
        banner.style.borderRadius = "4px";
        banner.style.textShadow = "0 0 5px #222";
        banner.style.boxShadow = "inset 0 0 2px #ff6666";
        banner.style.padding = "12px";
        banner.style.textAlign = "center";
        banner.style.zIndex = "1000";
        banner.innerText = `⚠️ You have ${itemCount} item(s) in your vehicle! ⚠️`;
        banner.style.marginBottom = "15px";

        console.log("works");

        const main = document.querySelector("main");
        if (exploreContainer) {
            exploreContainer.insertAdjacentElement("beforebegin", banner);
        } else {
            console.error("Main element not found!");
            return;
        }

    }

    function observePageChanges() {
        const observer = new MutationObserver(() => {
          const main = document.querySelector("main");
            if (main && window.location.href.includes("/explore")) {
            fetchVehicleItems();
        } else if (main && !window.location.href.includes("/explore")) {
            hasFetched = false;
        }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    observePageChanges();

})();
