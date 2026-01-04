// ==UserScript==
// @name         Sahibinden Map Replacer + Interceptor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace Sahibinden map with Leaflet + intercept live marker data
// @author       you
// @match        https://www.sahibinden.com/haritada-emlak-arama*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539796/Sahibinden%20Map%20Replacer%20%2B%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/539796/Sahibinden%20Map%20Replacer%20%2B%20Interceptor.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("✅ Userscript loaded");

  // Global variables
  let classifiedData = [];
  let classifiedLayerGroup = null;
  let metroStations = [];
  let map = null;
  let settings = {
    maxDistance: 5000,
    minPrice: 0,
    maxPrice: 1000000,
  };

  // Intercept XHR for classified markers
  (function interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this._isTargetRequest = method === "GET" && url.includes("/ajax/mapSearch/classified/markers");
      return originalOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
      if (this._isTargetRequest) {
        this.addEventListener("load", function () {
          try {
            const json = JSON.parse(this.responseText);
            console.log("📦 Intercepted Sahibinden classified data");
            if (classifiedLayerGroup && map) {
              updateClassifiedMarkersFromIntercept(json);
            } else {
              // Wait and retry once the map is ready
              const interval = setInterval(() => {
                if (classifiedLayerGroup && map) {
                  updateClassifiedMarkersFromIntercept(json);
                  clearInterval(interval);
                }
              }, 500);
            }
          } catch (e) {
            console.warn("❌ Failed to parse XHR response:", e);
          }
        });
      }
      return originalSend.apply(this, args);
    };
  })();

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function loadStyle(href) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  async function inject() {
    // Load Leaflet and Tweakpane
    loadStyle("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    loadStyle("https://cdn.jsdelivr.net/npm/tweakpane@3.1.0/dist/tweakpane.min.css");

    await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
    await loadScript("https://cdn.jsdelivr.net/npm/tweakpane@3.1.0/dist/tweakpane.min.js");

    const container = document.querySelector(".map-container");
    if (!container) return;

    container.innerHTML = `
      <style>
        #map {
          height: 100vh;
          width: 100%;
        }
        #panel {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
          padding: 8px;
        }
      </style>
      <div id="map"></div>
      <div id="panel"></div>
    `;

    map = L.map("map").setView([38.4237, 27.1428], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    metroStations = [];
    classifiedData = [];
    classifiedLayerGroup = L.layerGroup().addTo(map);

    fetch("https://jsonblob.com/api/jsonBlob/1384651047213129728")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((st) => {
          metroStations.push([st.ENLEM, st.BOYLAM]);
          L.marker([st.ENLEM, st.BOYLAM])
            .bindPopup(`<b>${st.ISTASYON_ADI}</b>`)
            .addTo(map);
        });
      });

    const urlParams = new URLSearchParams(window.location.search);
    const dataFile = urlParams.get("data") || "https://your-server.com/data.json";

    const fileList = {
      "Eşyalı Kapalı Mutfak": "data-mutfak-kapali-esyali.json",
      "Eşyalı Mutfak Seçilmemiş": "data-mutfak-secilmemis-esyali.json",
      "Eşyasız Kapalı Mutfak": "data-mutfak-kapali-esyasiz.json",
      "Eşyasız Mutfak Seçilmemiş": "data-mutfak-secilmemis-esyasiz.json",
    };

    const pane = new Tweakpane.Pane({
      container: document.getElementById("panel"),
    });

    pane.addInput(settings, "maxDistance", {
      min: 0,
      max: 20000,
      step: 100,
      label: "Max Distance (m)",
    }).on("change", updateClassifiedMarkers);

    pane.addInput(settings, "minPrice", {
      min: 0,
      max: 200000,
      step: 1000,
      label: "Min Price (₺)",
    }).on("change", updateClassifiedMarkers);

    pane.addInput(settings, "maxPrice", {
      min: 0,
      max: 200000,
      step: 1000,
      label: "Max Price (₺)",
    }).on("change", updateClassifiedMarkers);

    // Load fallback data if not intercepted
    fetch(dataFile)
      .then((res) => res.json())
      .then((data) => {
        updateClassifiedMarkersFromIntercept(data);
      });
  }

  function parsePriceBin(str) {
    const parts = str.split(" ").map((s) => s.replace(/\D/g, ""));
    return parts.length && +parts[0] * 1000;
  }

  function updateClassifiedMarkersFromIntercept(data) {
    classifiedData.length = 0;
    data.classifiedMarkers.forEach((item) => {
      classifiedData.push({
        coords: [item.lat, item.lon],
        price: parsePriceBin(item.formattedPrice),
        label: item.formattedPrice,
        url: item.url,
      });
    });
    updateClassifiedMarkers();
  }

  function updateClassifiedMarkers() {
    if (!classifiedLayerGroup || !map) return;

    classifiedLayerGroup.clearLayers();

    classifiedData.forEach((item) => {
      const nearest = Math.min(
        ...metroStations.map((m) => map.distance(m, item.coords))
      );

      if (
        nearest <= settings.maxDistance &&
        item.price >= settings.minPrice &&
        item.price <= settings.maxPrice
      ) {
        const marker = L.marker(item.coords, {
          icon: L.icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        });

        marker.on("click", () => {
          window.open(`https://www.sahibinden.com${item.url}`, "_blank");
        });

        marker.addTo(classifiedLayerGroup);
      }
    });
  }

  // Wait until .map-container is available in DOM
  const observer = new MutationObserver(() => {
    const container = document.querySelector(".map-container");
    if (container) {
      observer.disconnect();
      inject();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
