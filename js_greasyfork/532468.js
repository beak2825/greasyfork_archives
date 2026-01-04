// ==UserScript==
// @name         WME Map Overlay (Google + OSM + Traffic + Apple Maps + Waze Live Map)
// @namespace    https://waze.com
// @version      2.96
// @description  Sobreposição de mapas no WME: Google, OSM, Trânsito, Apple Maps, Waze Live Map e agora Mapillary!
// @author       ChatGPT
// @match        https://www.waze.com/*editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532468/WME%20Map%20Overlay%20%28Google%20%2B%20OSM%20%2B%20Traffic%20%2B%20Apple%20Maps%20%2B%20Waze%20Live%20Map%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532468/WME%20Map%20Overlay%20%28Google%20%2B%20OSM%20%2B%20Traffic%20%2B%20Apple%20Maps%20%2B%20Waze%20Live%20Map%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let trafficDiv, sliderContainer, isSliderVisible = false;
    let wazeLiveLayer, gmap, mapillaryDiv, trafficLayerRef;

    function initOverlay() {
        if (typeof W === 'undefined' || typeof W.map === 'undefined') {
            setTimeout(initOverlay, 1000);
            return;
        }

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

        const appleLayer = new OpenLayers.Layer.XYZ(
            "Apple Maps",
            "https://maps.apple.com/frame?map=explore&center=${lat},${lon}&span=${spanX},${spanY}",
            { isBaseLayer: false, opacity: 0.00, visibility: true }
        );

        wazeLiveLayer = new OpenLayers.Layer.XYZ(
            "Waze Live Map",
            "https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png",
            { isBaseLayer: false, opacity: 0.00, visibility: true }
        );

        map.addLayer(wazeLiveLayer);
        map.addLayer(googleBaseLayer);
        map.addLayer(osmLayer);
        map.addLayer(appleLayer);

        sliderContainer = document.createElement("div");
        sliderContainer.style.position = "absolute";
        sliderContainer.style.top = "80px";
        sliderContainer.style.left = "50%";
        sliderContainer.style.transform = "translateX(-50%)";
        sliderContainer.style.zIndex = "1000";
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
                icon: "https://i.ibb.co/rK09xy0d/traffic-layer.jpg",
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
                name: "Mapillary",
                icon: "https://pbs.twimg.com/profile_images/1097399669158825984/aXZ49j3I_400x400.png",
                initial: 0.00,
                onChange: value => {
                    if (mapillaryDiv) mapillaryDiv.style.opacity = value;
                }
            },
            {
                name: "Apple Maps",
                icon: "https://th.bing.com/th/id/R.7bbe9deedfa162a68a224e18fbad2dfc?rik=nsbux2xtDIgyUw&pid=ImgRaw&r=0",
                initial: 0.00,
                onChange: value => appleLayer.setOpacity(value)
            },
            {
                name: "ArcGIS",
                icon: "https://th.bing.com/th/id/OIP.e5Qa0gpEBMxdY1zIgJu5PQHaHa?w=164&h=180&c=7&r=0&o=5&pid=1.7",
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
                const span = 360 / Math.pow(2, zoom);

                if (layer.name === "Google Maps")
                    window.open(`https://www.google.com/maps/@${lat},${lon},${zoom}z`, '_blank');
                if (layer.name === "OSM")
                    window.open(`https://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`, '_blank');
                if (layer.name === "ArcGIS")
                    window.open(`https://www.arcgis.com/apps/Viewer/index.html?appid=3801d24f76d246adb134d43a7a222b2c&center=${lon},${lat}&level=${zoom}`, '_blank');
                if (layer.name === "Apple Maps")
                    window.open(`https://maps.apple.com/frame?map=hybrid&center=${lat}%2C${lon}&span=${span * 0.5}%2C${span}`, '_blank');
                if (layer.name === "Waze Live")
                    window.open(`https://www.waze.com/livemap?lat=${lat}&lon=${lon}&zoom=${zoom}&utm_medium=wme_footer&overlay=false&utm_campaign=default&utm_source=waze_website`, '_blank');
                if (layer.name === "Mapillary")
                    window.open(`https://www.mapillary.com/app/?lat=${lat}&lng=${lon}&z=${zoom - 1}`, '_blank');
            });

            wrapper.appendChild(img);

            if (!layer.isButton && layer.name !== "Apple Maps" && layer.name !== "Mapillary") {
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
        toggleButton.textContent = isSliderVisible ? "Hide Sliders" : "Show Sliders";
        toggleButton.style.position = "absolute";
        toggleButton.style.top = "37px";
        toggleButton.style.left = "50%";
        toggleButton.style.transform = "translateX(-50%)";
        toggleButton.style.zIndex = "2000";
        toggleButton.style.padding = "5px 10px";
        toggleButton.style.backgroundColor = "rgba(10, 25, 50, 0.8)";
        toggleButton.style.color = "white";
        toggleButton.style.border = "1px solid white";
        toggleButton.style.borderRadius = "5px";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.transition = "all 0.3s ease";
        toggleButton.addEventListener("click", () => {
            isSliderVisible = !isSliderVisible;
            sliderContainer.style.display = isSliderVisible ? "flex" : "none";
            toggleButton.textContent = isSliderVisible ? "Hide Sliders" : "Show Sliders";
        });

        document.body.appendChild(toggleButton);
        document.body.appendChild(sliderContainer);

        initTrafficLayer();
        initMapillaryLayer();
    }

    // ✅ NOVA versão simplificada com tiles do Google Traffic
    function initTrafficLayer() {
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
    }

    function initMapillaryLayer() {
        mapillaryDiv = document.createElement("div");
        mapillaryDiv.id = "mapillaryDiv";
        mapillaryDiv.style.position = 'absolute';
        mapillaryDiv.style.top = '0';
        mapillaryDiv.style.left = '0';
        mapillaryDiv.style.right = '0';
        mapillaryDiv.style.bottom = '0';
        mapillaryDiv.style.zIndex = '400';
        mapillaryDiv.style.opacity = '0';
        mapillaryDiv.style.pointerEvents = 'none';

        const iframe = document.createElement("iframe");
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'geolocation';

        mapillaryDiv.appendChild(iframe);
        W.map.olMap.getViewport().appendChild(mapillaryDiv);

        function updateIframe() {
            const center = W.map.getCenter();
            const zoom = W.map.getZoom();
            const lonlat = new OpenLayers.LonLat(center.lon, center.lat);
            lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
            const lat = parseFloat(lonlat.lat.toFixed(6));
            const lon = parseFloat(lonlat.lon.toFixed(6));
            iframe.src = `https://www.mapillary.com/app/?lat=${lat}&lng=${lon}&z=${zoom}`;
        }

        updateIframe();

        WazeWrap.Events.register('moveend', null, updateIframe);
        WazeWrap.Events.register('zoomend', null, updateIframe);
    }

    setTimeout(initOverlay, 2000);

})();
