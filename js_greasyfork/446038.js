// ==UserScript==
// @name GeoGuessr Map Maker lat/lng
// @namespace   ggmmll
// @description Display the current lat/lng in the GeoGuessr Map Maker, can be locked with a right click
// @version 0.4
// @match https://www.geoguessr.com/*
// @require https://openuserjs.org/src/libs/xsanda/Run_code_as_client.js
// @require https://openuserjs.org/src/libs/xsanda/Google_Maps_Promise.js
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446038/GeoGuessr%20Map%20Maker%20latlng.user.js
// @updateURL https://update.greasyfork.org/scripts/446038/GeoGuessr%20Map%20Maker%20latlng.meta.js
// ==/UserScript==

googleMapsPromise.then(() => runAsClient(() => {
    const google = window.google;

    var flag = false

    function getPositionDiv() {
        if (location.pathname.includes("/map-maker/")) {
            let mmm = document.querySelector("[class^=top-bar_topMenu_]")
            if (mmm) {
                let position = document.querySelector("[data-name=position]")
                if (!position) {
                    position = document.createElement("div")
                    position.dataset.name = "position"
                    position.style = "color: var(--ds-color-white-80); font-size: var(--font-size-14); font-weight: 400; line-height: var(--line-height-14);  margin: .5rem; text-align: center"
                    mmm.insertBefore(position, mmm.children[1]);
                }
                return position
            }
        }
    }

    function displayCoordinates(ev) {
        let position = getPositionDiv()
        if (position && !flag) {
            position.innerText = Math.round(ev.latLng.lat() * 10000) / 10000 + "," + Math.round(ev.latLng.lng() * 10000) / 10000
        }
    }

    window.addEventListener("load", (event) => {
        getPositionDiv()
    });

    const oldMap = google.maps.Map;
    google.maps.Map = Object.assign(function (...args) {
        const res = oldMap.apply(this, args);
        this.addListener('mousemove', displayCoordinates);
        this.addListener('rightclick', () => {flag = !flag});
        return res;
    }, {
        prototype: Object.create(oldMap.prototype)
    });
}));
