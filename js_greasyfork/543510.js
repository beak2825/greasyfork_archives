// ==UserScript==
// @name         WME マップオーバーレイ コンパクト（修正版）
// @namespace    https://waze.com
// @version      7.0
// @description  WMEで主要な地図レイヤー表示。住所コピー（市区町村以下）＋全レイヤー一括オフ（白枠ボタン）
// @author       rabbit
// @match        https://www.waze.com/*editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543510/WME%20%E3%83%9E%E3%83%83%E3%83%97%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%83%AC%E3%82%A4%20%E3%82%B3%E3%83%B3%E3%83%91%E3%82%AF%E3%83%88%EF%BC%88%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543510/WME%20%E3%83%9E%E3%83%83%E3%83%97%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%83%AC%E3%82%A4%20%E3%82%B3%E3%83%B3%E3%83%91%E3%82%AF%E3%83%88%EF%BC%88%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const layers = [
      { name: "Wazeライブ", url: "https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png", hasLink: true },
      { name: "Googleマップ", url: "https://mt.google.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}", hasLink: true },
      { name: "Googleトラフィック", url: "https://mt1.google.com/vt?lyrs=h@159000000,traffic&hl=ja&x=${x}&y=${y}&z=${z}", hasLink: true },
      { name: "OSM", url: "https://tile.openstreetmap.org/${z}/${x}/${y}.png", hasLink: true },
      { name: "GSI", url: "https://cyberjapandata.gsi.go.jp/xyz/std/${z}/${x}/${y}.png", hasLink: false },
      { name: "JARTIC", url: "", hasLink: false }
  ];

  const layerLinks = {
      "Wazeライブ": "https://www.waze.com/livemap",
      "Googleマップ": "https://www.google.com/maps",
      "Googleトラフィック": "https://www.google.com/maps",
      "OSM": "https://www.openstreetmap.org/",
      "GSI": "https://maps.gsi.go.jp/",
      "JARTIC": "https://www.jartic.or.jp/"
  };

  const icons = {
      "Wazeライブ": "https://cdn-images-1.medium.com/max/1200/1*3kS1iOOTBrvtkecae3u2aA.png",
      "Googleマップ": "https://static.vecteezy.com/system/resources/previews/016/716/478/non_2x/google-maps-icon-free-png.png",
      "Googleトラフィック": "https://img.icons8.com/color/200/google-maps-new.png",
      "OSM": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/2048px-Openstreetmap_logo.svg.png",
      "GSI": "https://maps.gsi.go.jp/favicon.ico",
      "JARTIC": "https://www.jartic.or.jp/img/map/map.png",
      "WhereAmI": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%232196F3' d='M256 0C153.8 0 70.6 83.2 70.6 185.4c0 138.6 185.4 310.7 185.4 310.7s185.4-172.1 185.4-310.7C441.4 83.2 358.2 0 256 0zm0 278.7c-51.5 0-93.3-41.8-93.3-93.3s41.8-93.3 93.3-93.3 93.3 41.8 93.3 93.3-41.8 93.3-93.3 93.3z'/%3E%3Ccircle cx='256' cy='185.4' r='46.7' fill='%23FFFFFF'/%3E%3C/svg%3E",
      "ClearAll": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 6L6 18M6 6l12 12'/%3E%3C/svg%3E"
  };

  let layerImgElements = [];

  function initOverlay() {
      if (typeof W === 'undefined' || typeof W.map === 'undefined' || !W.map.olMap) {
          setTimeout(initOverlay, 1000);
          return;
      }

      const map = W.map;

      const tailwindLink = document.createElement('link');
      tailwindLink.rel = 'stylesheet';
      tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      document.head.appendChild(tailwindLink);

      layers.forEach(layer => {
          if (layer.url) {
              if (layer.name.startsWith("Google")) {
                  layer.layerObj = new OpenLayers.Layer.XYZ(layer.name, layer.url, {
                      isBaseLayer: false, opacity: 0.0, visibility: true, zIndex: 5
                  });
              } else {
                  layer.layerObj = new OpenLayers.Layer.XYZ(layer.name, layer.url, {
                      isBaseLayer: false, opacity: 0.0, visibility: true, zIndex: 10
                  });
              }
              map.addLayer(layer.layerObj);
              map.setLayerIndex(layer.layerObj, layer.layerObj.zIndex || 10);
          }
      });

      const container = document.createElement("div");
      container.id = "wme-overlay-container";
      container.className = "absolute bg-gray-800 bg-opacity-95 p-1.5 rounded-md border border-gray-600 shadow-xl flex gap-0.5 font-medium";
      container.style.top = localStorage.getItem('wmeOverlayTop') || "80px";
      container.style.left = localStorage.getItem('wmeOverlayLeft') || "10px";
      container.style.zIndex = "10000";
      container.style.flexDirection = localStorage.getItem('wmeOverlayDirection') || "row";

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = container.style.flexDirection === "row" ? "Up/Down" : "Left/Right";
      toggleBtn.title = "向きを切り替え";
      toggleBtn.className = "w-7 h-7 bg-gray-700 text-white rounded-full border border-gray-500 hover:bg-gray-600 hover:shadow-sm transition-all flex items-center justify-center text-xs";
      toggleBtn.addEventListener("click", () => {
          container.style.flexDirection = container.style.flexDirection === "row" ? "column" : "row";
          container.className = container.className.replace(/flex-(row|col)/, `flex-${container.style.flexDirection}`);
          toggleBtn.textContent = container.style.flexDirection === "row" ? "Up/Down" : "Left/Right";
          dragBar.className = dragBar.className.replace(/w-\d+|h-\d+/, container.style.flexDirection === "row" ? "w-1.5 h-7" : "w-7 h-1.5");
          Array.from(container.querySelectorAll(".layer-wrapper")).forEach(wrapper => {
              wrapper.className = wrapper.className.replace(/flex-(row|col)/, `flex-${container.style.flexDirection === "row" ? "row" : "col"}`);
          });
          localStorage.setItem('wmeOverlayDirection', container.style.flexDirection);
      });
      container.appendChild(toggleBtn);

      const dragBar = document.createElement("div");
      dragBar.className = container.style.flexDirection === "row" ? "w-1.5 h-7 bg-gray-600 rounded-full cursor-grab" : "w-7 h-1.5 bg-gray-600 rounded-full cursor-grab";
      container.appendChild(dragBar);

      const whereAmIWrapper = document.createElement("div");
      whereAmIWrapper.className = `layer-wrapper flex ${container.style.flexDirection === "row" ? "flex-row" : "flex-col"} items-center gap-0.5`;

      const whereAmIIcon = document.createElement("img");
      whereAmIIcon.src = icons["WhereAmI"];
      whereAmIIcon.alt = "現在地";
      whereAmIIcon.title = "現在位置の住所を表示（市区町村以下をコピー）";
      whereAmIIcon.className = "w-7 h-7 rounded-full border-2 border-blue-500 hover:border-blue-400 cursor-pointer transform transition-all hover:scale-105";
      whereAmIIcon.addEventListener("click", showCurrentLocation);
      whereAmIWrapper.appendChild(whereAmIIcon);
      container.appendChild(whereAmIWrapper);

      const clearAllWrapper = document.createElement("div");
      clearAllWrapper.className = `layer-wrapper flex ${container.style.flexDirection === "row" ? "flex-row" : "flex-col"} items-center gap-0.5`;

      const clearAllBtn = document.createElement("img");
      clearAllBtn.src = icons["ClearAll"];
      clearAllBtn.alt = "全解除";
      clearAllBtn.title = "現在表示中のレイヤーをすべて非表示";
      clearAllBtn.className = "w-7 h-7 rounded-full border-2 border-white hover:border-gray-300 cursor-pointer transform transition-all hover:scale-105";
      clearAllBtn.addEventListener("click", () => {
          layerImgElements.forEach(img => {
              if (img.isActive) {
                  img.isActive = false;
                  img.className = img.className.replace(/border-\w+-\d+/, "border-gray-400");
                  const layerName = img.alt;
                  const layer = layers.find(l => l.name === layerName);
                  if (layer && layer.layerObj) {
                      layer.layerObj.setOpacity(0.0);
                  }
              }
          });
      });
      clearAllWrapper.appendChild(clearAllBtn);
      container.appendChild(clearAllWrapper);

      const separator = document.createElement('div');
      separator.className = 'border-l border-gray-500 h-7 mx-0.5';
      container.appendChild(separator);

      layers.forEach(layer => {
          const wrapper = document.createElement("div");
          wrapper.className = `layer-wrapper flex ${container.style.flexDirection === "row" ? "flex-row" : "flex-col"} items-center gap-0.5`;

          const img = document.createElement("img");
          img.src = icons[layer.name];
          img.alt = layer.name;
          img.title = `${layer.name} を切り替え`;
          img.className = "w-7 h-7 rounded-full border-2 border-gray-400 hover:border-blue-400 cursor-pointer transform transition-all hover:scale-105";
          img.isActive = false;

          img.addEventListener("click", () => {
              const center = map.getCenter();
              const zoom = map.getZoom();
              const lonlat = new OpenLayers.LonLat(center.lon, center.lat);
              lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
              const lat = parseFloat(lonlat.lat.toFixed(6));
              const lon = parseFloat(lonlat.lon.toFixed(6));

              if (layer.name === "JARTIC") {
                  window.open(`http://hotmist.ddo.jp/jartic_kisei/@${lat},${lon},${zoom}z`, '_blank');
              } else if (layer.url) {
                  img.isActive = !img.isActive;
                  img.className = img.className.replace(/border-\w+-\d+/, img.isActive ? "border-blue-500" : "border-gray-400");
                  layer.layerObj.setOpacity(img.isActive ? 1.0 : 0.0);
              }
          });

          wrapper.appendChild(img);
          layerImgElements.push(img);

          if (layer.hasLink) {
              const linkBtn = document.createElement("button");
              linkBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>`;
              linkBtn.title = `${layer.name} を開く`;
              linkBtn.className = "w-7 h-7 bg-gray-700 text-white rounded-full border-2 border-gray-500 hover:bg-gray-600 hover:border-blue-400 transition-all flex items-center justify-center";
              linkBtn.addEventListener("click", () => {
                  const center = map.getCenter();
                  const zoom = map.getZoom();
                  const lonlat = new OpenLayers.LonLat(center.lon, center.lat);
                  lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                  const lat = parseFloat(lonlat.lat.toFixed(6));
                  const lon = parseFloat(lonlat.lon.toFixed(6));

                  let url;
                  switch (layer.name) {
                      case "Wazeライブ": url = `https://www.waze.com/livemap?lat=${lat}&lon=${lon}&zoom=${zoom}`; break;
                      case "Googleマップ":
                      case "Googleトラフィック": url = `http://maps.google.com/maps?q=${lat},${lon}&z=${zoom}&hl=ja`; break;
                      case "OSM": url = `https://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`; break;
                      default: url = layerLinks[layer.name]; break;
                  }
                  if (url) window.open(url, "_blank");
              });
              wrapper.appendChild(linkBtn);
          }
          container.appendChild(wrapper);
      });

      document.body.appendChild(container);

      let offsetX, offsetY, isDragging = false;
      dragBar.addEventListener("mousedown", e => {
          isDragging = true;
          offsetX = e.clientX - container.offsetLeft;
          offsetY = e.clientY - container.offsetTop;
          dragBar.className = dragBar.className.replace("cursor-grab", "cursor-grabbing");
      });
      document.addEventListener("mousemove", e => {
          if (!isDragging) return;
          container.style.left = `${e.clientX - offsetX}px`;
          container.style.top = `${e.clientY - offsetY}px`;
      });
      document.addEventListener("mouseup", () => {
          if (isDragging) {
              isDragging = false;
              dragBar.className = dragBar.className.replace("cursor-grabbing", "cursor-grab");
              localStorage.setItem('wmeOverlayTop', container.style.top);
              localStorage.setItem('wmeOverlayLeft', container.style.left);
          }
      });
  }

  async function getAddressFromCoords(lat, lng) {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC4EsYydXSc_bayhY0VfYUmTXAFKaYaVBw&language=ja`);
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return '住所が見つかりません';
    } catch (error) {
      console.error('住所取得エラー:', error);
      return '住所取得エラー';
    }
  }

  async function showCurrentLocation() {
    const center = W.map.getCenter();
    const lonlat = new OpenLayers.LonLat(center.lon, center.lat);
    const proj = new OpenLayers.Projection("EPSG:900913");
    const proj2 = new OpenLayers.Projection("EPSG:4326");
    const transformed = lonlat.transform(proj, proj2);

    const lat = transformed.lat.toFixed(6);
    const lng = transformed.lon.toFixed(6);

    try {
      const fullAddress = await getAddressFromCoords(lat, lng);

      let cleanAddress = fullAddress
        .replace(/M2MM\+WM 日本[,、\s]*/, '')
        .replace(/^日本[,、\s]*/, '')
        .replace(/〒\d{3}-\d{4}[、,]?/, '')
        .replace(/^\d{3}-\d{4}[、,]?/, '')
        .replace(/北海道[,、\s]*/, '').replace(/青森県[,、\s]*/, '').replace(/岩手県[,、\s]*/, '')
        .replace(/宮城県[,、\s]*/, '').replace(/秋田県[,、\s]*/, '').replace(/山形県[,、\s]*/, '')
        .replace(/福島県[,、\s]*/, '').replace(/茨城県[,、\s]*/, '').replace(/栃木県[,、\s]*/, '')
        .replace(/群馬県[,、\s]*/, '').replace(/埼玉県[,、\s]*/, '').replace(/千葉県[,、\s]*/, '')
        .replace(/東京都[,、\s]*/, '').replace(/神奈川県[,、\s]*/, '').replace(/新潟県[,、\s]*/, '')
        .replace(/富山県[,、\s]*/, '').replace(/石川県[,、\s]*/, '').replace(/福井県[,、\s]*/, '')
        .replace(/山梨県[,、\s]*/, '').replace(/長野県[,、\s]*/, '').replace(/岐阜県[,、\s]*/, '')
        .replace(/静岡県[,、\s]*/, '').replace(/愛知県[,、\s]*/, '').replace(/三重県[,、\s]*/, '')
        .replace(/滋賀県[,、\s]*/, '').replace(/京都府[,、\s]*/, '').replace(/大阪府[,、\s]*/, '')
        .replace(/兵庫県[,、\s]*/, '').replace(/奈良県[,、\s]*/, '').replace(/和歌山県[,、\s]*/, '')
        .replace(/鳥取県[,、\s]*/, '').replace(/島根県[,、\s]*/, '').replace(/岡山県[,、\s]*/, '')
        .replace(/広島県[,、\s]*/, '').replace(/山口県[,、\s]*/, '').replace(/徳島県[,、\s]*/, '')
        .replace(/香川県[,、\s]*/, '').replace(/愛媛県[,、\s]*/, '').replace(/高知県[,、\s]*/, '')
        .replace(/福岡県[,、\s]*/, '').replace(/佐賀県[,、\s]*/, '').replace(/長崎県[,、\s]*/, '')
        .replace(/熊本県[,、\s]*/, '').replace(/大分県[,、\s]*/, '').replace(/宮崎県[,、\s]*/, '')
        .replace(/鹿児島県[,、\s]*/, '').replace(/沖縄県[,、\s]*/, '')
        .trim()
        .replace(/^[,、\s]+/, '')
        .replace(/[,、\s]+$/g, '');

      if (!cleanAddress) cleanAddress = fullAddress;

      alert(`現在位置:\n\n緯度: ${lat}\n経度: ${lng}\n\n${fullAddress}\n\n市区町村以下をコピーしました`);
      await navigator.clipboard.writeText(cleanAddress);
    } catch (error) {
      console.error('エラー:', error);
      alert('位置情報の取得エラー');
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    #wme-overlay-container img, #wme-overlay-container button {
      min-width: 28px !important;
      min-height: 28px !important;
      max-width: 28px !important;
      max-height: 28px !important;
      object-fit: contain;
    }
  `;
  document.head.appendChild(style);

  setTimeout(initOverlay, 2000);
})();

