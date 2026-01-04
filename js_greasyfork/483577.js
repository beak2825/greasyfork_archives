// ==UserScript==
// @name         Rental Utils
// @namespace    https://fxzfun.com/userscripts
// @version      2024-08-03
// @description  cleans up the unnecessary junk off the end of urls and links location to vrbo
// @author       FXZFun
// @match        https://*.vrbo.com/*
// @match        https://*.airbnb.com/*
// @icon         https://fxzfun.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483577/Rental%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/483577/Rental%20Utils.meta.js
// ==/UserScript==

/* global __PLUGIN_STATE__ */

(async function() {
    'use strict';
    const pageWindow = window;

    async function getAddress(lat, lng) {
        let r = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${lng}%2C${lat}&f=pjson`);
        let j = await r.json();
        return j.address.Match_addr;
    }

    if (location.host.endsWith('vrbo.com')) {
        if (location.pathname.startsWith("/search")) {
            console.log("adding crime map");
            let lastUrl;
            const iframe = document.createElement("iframe");
            pageWindow.iframee = iframe;
            iframe.src = "https://crimegrade.org/violent-crime-conroe-tx/?fullscreen=true&removeLayers=true&noChurches=true";
            iframe.style = `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.5; pointer-events: none;`;
            let mapEl = document.querySelector('[data-stid="map"]');
            let i = setInterval(() => {
                if (!!mapEl) {
                    clearInterval(i);
                    mapEl.insertAdjacentElement("afterEnd", iframe);
                    mapEl.parentElement.style.position = "relative";
                } else {
                    mapEl = document.querySelector('[data-stid="map"]');
                }
            }, 500);

            let oldPushState = history.pushState;
            history.pushState = function pushState() {
                let ret = oldPushState.apply(this, arguments);
                pageWindow.dispatchEvent(new Event('pushstate'));
                pageWindow.dispatchEvent(new Event('locationchange'));
                return ret;
            };

            let oldReplaceState = history.replaceState;
            history.replaceState = function replaceState() {
                let ret = oldReplaceState.apply(this, arguments);
                pageWindow.dispatchEvent(new Event('replacestate'));
                pageWindow.dispatchEvent(new Event('locationchange'));
                return ret;
            };

            pageWindow.addEventListener('popstate', () => {
                pageWindow.dispatchEvent(new Event('locationchange'));
            });

            //&mapBounds=27.05782%2C-102.02289&mapBounds=34.95454%2C-95.32262
            pageWindow.addEventListener('locationchange', function () {
                const p = new URLSearchParams(location.search);
                const mapBounds = p.getAll("mapBounds");

                let pos = JSON.parse(`[${mapBounds[0]},${mapBounds[1]}]`);
                iframe.contentWindow?.postMessage({"sender": "realtor addons", "message": pos}, "*");
            });

            pageWindow.addEventListener("message", (event) => {
                if (event.data &&
                    event.data.sender == "crime map addons") {
                    console.log("crime map said something");
                    if (event.data.message === "loaded") pageWindow.dispatchEvent(new Event('locationchange'));
                }
            });
        } else {
            const woSearch = window.location.href.replace(window.location.search, '');
            window.history.replaceState(null, null, woSearch);

            const key = Object.keys(__PLUGIN_STATE__.apollo.apolloState).filter(k => k.startsWith('PropertyInfo'))[0];
            const { latitude, longitude } = __PLUGIN_STATE__.apollo.apolloState[key].summary.location.coordinates;

            // const ll = new URLSearchParams(__PLUGIN_STATE__.controllers.stores.staticMap.signedUrlNoPins).get("center").split(',');
            const addr = await getAddress(latitude, longitude);
            console.log(addr);
            const p = document.createElement("a");
            p.target = "_blank";
            p.href = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            p.style = "position: relative;background: #ffffffd1;z-index: 999;";
            p.innerText = addr;
            [...document.querySelectorAll("img")].filter(i => i.src.startsWith("https://maps.googleapis.com"))[0].insertAdjacentElement("afterEnd", p);
        }
    }

    if (location.host.endsWith('airbnb.com')) {
        if (location.pathname.startsWith("/rooms/")) {
            const woSearch = window.location.href.replace(window.location.search, '');
            window.history.replaceState(null, null, woSearch);
            setTimeout(() => window.history.replaceState(null, null, woSearch), 1000);
        }

        if (location.pathname.startsWith("/s/")) {
            let lastUrl;
            const iframe = document.createElement("iframe");
            pageWindow.iframee = iframe;
            iframe.src = "https://crimegrade.org/violent-crime-conroe-tx/?fullscreen=true&removeLayers=true&noChurches=true";
            iframe.style = `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.5; pointer-events: none;`;
            let mapEl = document.querySelector('div[data-testid="map/GoogleMap"]');
            let i = setInterval(() => {
                if (!!mapEl) {
                    clearInterval(i);
                    mapEl.insertAdjacentElement("afterEnd", iframe);
                } else {
                    mapEl = document.querySelector('div[data-testid="map/GoogleMap"]');
                }
            }, 500);

            let oldPushState = history.pushState;
            history.pushState = function pushState() {
                let ret = oldPushState.apply(this, arguments);
                pageWindow.dispatchEvent(new Event('pushstate'));
                pageWindow.dispatchEvent(new Event('locationchange'));
                return ret;
            };

            let oldReplaceState = history.replaceState;
            history.replaceState = function replaceState() {
                let ret = oldReplaceState.apply(this, arguments);
                pageWindow.dispatchEvent(new Event('replacestate'));
                pageWindow.dispatchEvent(new Event('locationchange'));
                return ret;
            };

            pageWindow.addEventListener('popstate', () => {
                pageWindow.dispatchEvent(new Event('locationchange'));
            });

            //&ne_lat=33.90016382905531&ne_lng=-94.76663261971368&sw_lat=28.394655850300225&sw_lng=-100.3890784048296&zoom=7.295276000453701&zoom_level=7.295276000453701
            pageWindow.addEventListener('locationchange', function () {
                const p = new URLSearchParams(location.search);

                let pos = JSON.parse(`[${p.get("ne_lat")},${p.get("ne_lng")},${p.get("sw_lat")},${p.get("sw_lng")}]`);
                iframe.contentWindow?.postMessage({"sender": "realtor addons", "message": pos}, "*");
            });

            pageWindow.addEventListener("message", (event) => {
                if (event.data &&
                    event.data.sender == "crime map addons") {
                    console.log("crime map said something");
                    if (event.data.message === "loaded") pageWindow.dispatchEvent(new Event('locationchange'));
                }
            });
        }
    }
})();
