// ==UserScript==
// @name         WME Map Overlay (Google + OSM + Traffic + Waze Live Map + JARTIC + MapFan)
// @namespace    https://waze.com
// @version      3.02
// @description  WMEにGoogle、OSM、Traffic、Waze Live Map、JARTIC、MapFanのマップオーバーレイを追加
// @author       ChatGPT & Enhanced by User
// @match        https://www.waze.com/*editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543591/WME%20Map%20Overlay%20%28Google%20%2B%20OSM%20%2B%20Traffic%20%2B%20Waze%20Live%20Map%20%2B%20JARTIC%20%2B%20MapFan%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543591/WME%20Map%20Overlay%20%28Google%20%2B%20OSM%20%2B%20Traffic%20%2B%20Waze%20Live%20Map%20%2B%20JARTIC%20%2B%20MapFan%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let trafficDiv, sliderContainer, isSliderVisible = false;
    let wazeLiveLayer, trafficLayerRef, mapFanLayer;
    let autoHideTimeout;

    function initOverlay() {
        try {
            console.log('WME Map Overlay: Initializing...');
            if (typeof W === 'undefined' || typeof W.map === 'undefined' || !W.map.olMap) {
                console.warn('WME Map Overlay: W or W.map not ready, retrying in 1 second...');
                setTimeout(initOverlay, 1000);
                return;
            }

            console.log('WME Map Overlay: W.map is ready, proceeding with initialization.');

            const map = W.map;

            const googleBaseLayer = new OpenLayers.Layer.XYZ(
                "Google Maps (Base)",
                "https://mt.google.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}",
                { isBaseLayer: false, opacity: 0.00, visibility: true }
            );

            const osmLayer = new OpenLayers.Layer.XYZ(
                "OpenStreetMap",
                "https://tile.openstreetmap.org/${z}/${x}/${y}.png",
                { isBaseLayer: false, opacity: 0.00, visibility: true }
            );

            wazeLiveLayer = new OpenLayers.Layer.XYZ(
                "Waze Live Map",
                "https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png",
                { isBaseLayer: false, opacity: 0.00, visibility: true }
            );

            mapFanLayer = new OpenLayers.Layer.XYZ(
                "MapFan",
                "https://tile.mapfan.com/tile/${z}/${x}/${y}.png", // 仮のタイルURL。実際のURLに置き換える必要あり
                { isBaseLayer: false, opacity: 0.00, visibility: true }
            );

            map.addLayer(wazeLiveLayer);
            map.addLayer(googleBaseLayer);
            map.addLayer(osmLayer);
            map.addLayer(mapFanLayer);

            sliderContainer = document.createElement("div");
            sliderContainer.id = "wme-map-overlay-slider";
            sliderContainer.style.position = "absolute";
            sliderContainer.style.top = "80px";
            sliderContainer.style.left = "50%";
            sliderContainer.style.transform = "translateX(-50%)";
            sliderContainer.style.zIndex = "10000";
            sliderContainer.style.padding = "8px";
            sliderContainer.style.background = "rgba(10, 25, 50, 0.95)";
            sliderContainer.style.borderRadius = "10px";
            sliderContainer.style.border = "1px solid white";
            sliderContainer.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
            sliderContainer.style.display = "none";
            sliderContainer.style.flexDirection = "row";
            sliderContainer.style.gap = "10px";
            sliderContainer.style.fontFamily = "sans-serif";
            sliderContainer.style.transition = "all 0.3s ease";

            const layers = [
                {
                    name: "Waze Live",
                    icon: "https://cdn-images-1.medium.com/max/1200/1*3kS1iOOTBrvtkecae3u2aA.png",
                    initial: 0.00,
                    onChange: value => wazeLiveLayer.setOpacity(value)
                },
                {
                    name: "Google Maps",
                    icon: "https://static.vecteezy.com/system/resources/previews/016/716/478/non_2x/google-maps-icon-free-png.png",
                    initial: 0.00,
                    onChange: value => googleBaseLayer.setOpacity(value)
                },
                {
                    name: "Traffic",
                    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsei4Nf7Elu2h_ZTletrCHWuLlZYWwU9j3wA&s",
                    initial: 0.00,
                    onChange: value => {
                        if (trafficLayerRef) trafficLayerRef.setOpacity(value);
                    }
                },
                {
                    name: "OSM",
                    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/2048px-Openstreetmap_logo.svg.png",
                    initial: 0.00,
                    onChange: value => osmLayer.setOpacity(value)
                },
                {
                    name: "JARTIC",
                    icon: "https://www.jartic.or.jp/img/map/map.png",
                    initial: 0.00,
                    onChange: () => {},
                    isButton: true
                },
                {
                    name: "MapFan",
                    icon: "https://www.mapfan.com/favicon.ico",
                    initial: 0.00,
                    onChange: () => {},
                    isButton: true
                }
            ];

            layers.forEach(layer => {
                const wrapper = document.createElement("div");
                wrapper.style.width = "60px";
                wrapper.style.textAlign = "center";

                const img = document.createElement("img");
                img.src = layer.icon;
                img.alt = layer.name;
                img.title = layer.name;
                img.style.width = "60px";
                img.style.height = "60px";
                img.style.borderRadius = "12px";
                img.style.border = "2px solid white";
                img.style.transition = "transform 0.3s ease, border 0.3s ease";
                img.style.display = "block";
                img.style.marginBottom = "4px";
                img.style.cursor = "pointer";

                img.addEventListener("mouseenter", () => {
                    img.style.transform = "scale(1.1)";
                    img.style.border = "2px solid gold";
                });

                img.addEventListener("mouseleave", () => {
                    img.style.transform = "scale(1)";
                    img.style.border = "2px solid white";
                });

                img.addEventListener("click", () => {
                    const center = W.map.getCenter();
                    const zoom = W.map.getZoom();
                    const lonlat = new OpenLayers.LonLat(center.lon, center.lat);
                    lonlat.transform(
                        new OpenLayers.Projection("EPSG:900913"),
                        new OpenLayers.Projection("EPSG:4326")
                    );
                    const lat = parseFloat(lonlat.lat.toFixed(6));
                    const lon = parseFloat(lonlat.lon.toFixed(6));

                    if (layer.name === "Google Maps")
                        window.open(`https://www.google.com/maps/@${lat},${lon},${zoom}z`, '_blank');
                    if (layer.name === "OSM")
                        window.open(`https://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`, '_blank');
                    if (layer.name === "Waze Live")
                        window.open(`https://www.waze.com/livemap?lat=${lat}&lon=${lon}&zoom=${zoom}&utm_medium=wme_footer&overlay=false&utm_campaign=default&utm_source=waze_website`, '_blank');
                    if (layer.name === "JARTIC")
                        window.open(`http://hotmist.ddo.jp/jartic_kisei/@${lat},${lon},${zoom}z`, '_blank');
                    if (layer.name === "MapFan")
                        window.open(`https://mapfan.com/map/spots/search?c=${lat},${lon},${zoom}&s=std,pc,ja&p=none`, '_blank');
                });

                wrapper.appendChild(img);

                if (!layer.isButton) {
                    const slider = document.createElement("input");
                    slider.type = "range";
                    slider.min = "0";
                    slider.max = "1";
                    slider.step = "0.01";
                    slider.value = layer.initial;
                    slider.style.width = "100%";
                    slider.addEventListener("input", () => {
                        layer.onChange(parseFloat(slider.value));
                    });
                    wrapper.appendChild(slider);
                }

                sliderContainer.appendChild(wrapper);
            });

            const toggleButton = document.createElement("button");
            toggleButton.id = "wme-map-overlay-toggle";
            toggleButton.textContent = isSliderVisible ? "Hide Sliders" : "Show Sliders";
            toggleButton.style.position = "fixed";
            toggleButton.style.top = "37px";
            toggleButton.style.left = "50%";
            toggleButton.style.transform = "translateX(-50%)";
            toggleButton.style.zIndex = "10001";
            toggleButton.style.padding = "8px 12px";
            toggleButton.style.backgroundColor = "rgba(10, 25, 50, 0.9)";
            toggleButton.style.color = "white";
            toggleButton.style.border = "2px solid white";
            toggleButton.style.borderRadius = "8px";
            toggleButton.style.cursor = "pointer";
            toggleButton.style.fontSize = "14px";
            toggleButton.style.fontWeight = "bold";
            toggleButton.style.transition = "all 0.3s ease";
            toggleButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.5)";

            toggleButton.addEventListener("click", () => {
                console.log('WME Map Overlay: Toggle button clicked, isSliderVisible:', isSliderVisible);
                isSliderVisible = !isSliderVisible;
                sliderContainer.style.display = isSliderVisible ? "flex" : "none";
                toggleButton.textContent = isSliderVisible ? "Hide Sliders" : "Show Sliders";

                // スライダー表示時に10秒後に自動非表示
                if (isSliderVisible) {
                    clearTimeout(autoHideTimeout); // 既存のタイマーをクリア
                    autoHideTimeout = setTimeout(() => {
                        isSliderVisible = false;
                        sliderContainer.style.display = "none";
                        toggleButton.textContent = "Show Sliders";
                        console.log('WME Map Overlay: Auto-hiding sliders after 10 seconds');
                    }, 10000); // 10秒後
                } else {
                    clearTimeout(autoHideTimeout); // 非表示時にタイマーをクリア
                }
            });

            console.log('WME Map Overlay: Adding toggle button to DOM');
            document.body.appendChild(toggleButton);
            console.log('WME Map Overlay: Adding slider container to DOM');
            document.body.appendChild(sliderContainer);

            initTrafficLayer();
            console.log('WME Map Overlay: Initialization complete');
        } catch (error) {
            console.error('WME Map Overlay: Initialization failed:', error);
        }
    }

    function initTrafficLayer() {
        try {
            trafficLayerRef = new OpenLayers.Layer.XYZ(
                "Google Traffic",
                "https://mt1.google.com/vt?lyrs=h@159000000,traffic&hl=en&x=${x}&y=${y}&z=${z}",
                {
                    isBaseLayer: false,
                    opacity: 0.00,
                    visibility: true
                }
            );
            W.map.addLayer(trafficLayerRef);
            trafficDiv = trafficLayerRef.div;
            console.log('WME Map Overlay: Traffic layer initialized');
        } catch (error) {
            console.error('WME Map Overlay: Traffic layer initialization failed:', error);
        }
    }

    function waitForWME() {
        console.log('WME Map Overlay: Checking if WME is ready...');
        setTimeout(() => {
            initOverlay();
        }, 2000);
    }

    waitForWME();
})();
