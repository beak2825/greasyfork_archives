// ==UserScript==
// @name         Geoguessr Minimap Wizard
// @namespace    alienperfect
// @version      1.1
// @description  Lets you see satellite imagery, terrain, OpenStreetMap, etc.
// @author       Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477953/Geoguessr%20Minimap%20Wizard.user.js
// @updateURL https://update.greasyfork.org/scripts/477953/Geoguessr%20Minimap%20Wizard.meta.js
// ==/UserScript==

// You can design your own map.
// 1. Go to https://mapstyle.withgoogle.com/ and create your own style.
// 2. Replace everything between "// Start" and "// End" below with your own JSON styling.
// 3. Change the name for the map below, if you want.

const customMap = {
    name: "Custom",
    alt: "Show custom map",
    style:
    // Start
    [
        {
            "featureType": "all",
            "elementType": "labels",
            "stylers": [
                {"visibility": "off"}
            ]
        }
    ]
    // End
}

let defaultMap = "roadmap";
let mapList = ["roadmap", "terrain", "satellite", "hybrid", "osm", "custom"];

function getDefaultMap() {
    return localStorage.getItem("@defaultMap") || defaultMap;
}

function setDefaultMap(id) {
    let def = id || defaultMap;
    localStorage.setItem("@defaultMap", def);
    console.log("default map is", id);
}

function setMap(map, id) {
    setDefaultMap(id);
    map.setMapTypeId(id);
}

function addMapSelector(map) {
    const mapSelector = document.createElement("select");

    mapSelector.className = "map-selector";
    mapSelector.title = "Click to change the map";

	mapSelector.addEventListener("change", function() {
        setMap(map, this.value);
    });

    for (let id of mapList) {
        let name = map.mapTypes.get(id).name || id;
        let alt = map.mapTypes.get(id).alt || name;
        let option = document.createElement("option");

        option.style.backgroundColor = "#fff";
        option.textContent = name;
        option.title = alt;
        option.value = id;

        mapSelector.appendChild(option);
    }

    mapSelector.value = getDefaultMap();
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(mapSelector);
}

function loadExtraMaps(map) {
    const OSM = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
            var tilesPerGlobe = 1 << zoom;
            var x = coord.x % tilesPerGlobe;

            if (x < 0) {
                x = tilesPerGlobe+x;
            }

            return (`https://tile.openstreetmap.org/${zoom}/${x}/${coord.y}.png`);
        },
        maxZoom: 18,
        tileSize: new google.maps.Size(256, 256),
        name: "OSM",
        alt: "OpenStreetMap",
    });

    const custom = new google.maps.StyledMapType(
        customMap.style, {name: customMap.name, alt: customMap.alt},
    );

    map.mapTypes.set("osm", OSM);
    map.mapTypes.set("custom", custom);
}

function initGoogleMap() {
    google.maps.Map = class extends google.maps.Map {
        constructor(...args) {
            super(...args);
            loadExtraMaps(this);

            google.maps.event.addListenerOnce(this, "tilesloaded", () => {
                this.setMapTypeId(getDefaultMap());
                addMapSelector(this);

                google.maps.event.addListener(this, "maptypeid_changed", () => {
                    let map = this.getMapTypeId();
                    let defaultMap = getDefaultMap();
                    // If map changed by itself, set it back.
                    if (map !== defaultMap) {
                        this.setMapTypeId(defaultMap);
                        console.log("changed by itself");
                    }
                });
            });
        }
    }
}

function addStyle(css) {
    let style = document.createElement('style');
    let head = document.getElementsByTagName("head")[0];

    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        addStyle(`
            [class*="round-indicator_roundIndicator__"] {
                max-width: fit-content;
            }
            .map-selector {
                background-color: #fff;
                height: 30px;
                max-width = 25%;
                border: 2px solid #fff;
                box-shadow: 0 2px 6px rgba(0,0,0,.3);
                color: rgb(25,25,25);
                cursor: pointer;
                font-family: Roboto, Arial, sans-serif;
                font-size: 15px;
                margin: 10px 10px 22px;
                padding: 0 5px;
                outline: none;
                border-radius: 3px;
                z-index: 100;
            }
        `);

        new MutationObserver(function() {
            let script = document.querySelector("[src*='maps.googleapis.com/maps/api']");

            if (script) {
                this.disconnect();
                script.onload = () => initGoogleMap();
            }
        }).observe(document.head, {childList: true, subtree: true});
    })
})();
