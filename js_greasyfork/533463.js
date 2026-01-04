// ==UserScript==
// @name        OpenStreetMap GPX Overlay
// @namespace   Violentmonkey Scripts
// @match       *://www.openstreetmap.org/*
// @version     1.5
// @author      CyrilSLi
// @description Overlay and display GPX files (tracks, routes, waypoints) on the OpenStreetMap website. Add files by clicking the sidebar button or ny dragging them onto the map. Clear all files by right-clicking the sidebar button or reloading the site.
// @license     MIT
// @require     https://update.greasyfork.org/scripts/533461/1574689/Get%20OpenStreetMap%20Leaflet%20object.js
// @require     https://cdn.jsdelivr.net/npm/@jitbit/htmlsanitizer@2/HtmlSanitizer.min.js
// @require     https://cdn.jsdelivr.net/npm/gpxparser@3/dist/GPXParser.min.js
// @downloadURL https://update.greasyfork.org/scripts/533463/OpenStreetMap%20GPX%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/533463/OpenStreetMap%20GPX%20Overlay.meta.js
// ==/UserScript==

// https://github.com/gpxstudio/gpx.studio/blob/306ed2ae0e2ab46f32eadcc9d38c441c219cf428/website/src/lib/components/gpx-layer/GPXLayer.ts#L27
const colors = [
    '#ff0000',
    '#0000ff',
    '#46e646',
    '#00ccff',
    '#ff9900',
    '#ff00ff',
    '#ffff32',
    '#288228',
    '#9933ff',
    '#50f0be',
    '#8c645a',
];
var colorIndex = 0;
var gpxLayers;

function prevent(ev) {
    ev.preventDefault();
    ev.stopPropagation();
}
function showFile(file) {
    if (!file.name.toLowerCase().endsWith(".gpx")) {
        return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
        const gpx = new gpxParser();
        gpx.parse(ev.target.result);
        gpx.tracks.concat(gpx.routes).forEach((line) => {
            L.polyline(line.points.map((point) => [point.lat, point.lon]), {
                weight: 5,
                color: colors[colorIndex++ % colors.length]
            }).addTo(gpxLayers);
        });
        gpx.waypoints.forEach((wpt) => {
            txt = document.createElement("textarea");
            txt.innerHTML = HtmlSanitizer.SanitizeHtml(wpt.name ?? "") +
                            ((wpt.name != null && wpt.desc != null) ? "<br>" : "") +
                            HtmlSanitizer.SanitizeHtml(wpt.desc ?? "");
            L.marker([wpt.lat, wpt.lon], {title: wpt.name ?? ""}).addTo(gpxLayers).bindPopup(txt.value);
        });
    });
    reader.readAsText(file, "UTF-8");
}
function buttonAdd(ev) {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".gpx");
    input.setAttribute("multiple", "");
    input.addEventListener("change", (ev) => [...ev.target.files].forEach(showFile));
    input.click();
}
function dragAdd(ev) {
    prevent(ev);
    [...ev.dataTransfer.files].forEach(showFile);
}
function clearFiles(ev) {
    prevent(ev);
    gpxLayers.clearLayers();
}

unsafeWindow.onOSMReady(() => {
    const controlDetect = window.setInterval(() => {
        keyButton = document.getElementsByClassName("control-legend")[0];
        if (keyButton) {
            window.clearInterval(controlDetect);
        }

        gpxLayers = L.layerGroup().addTo(unsafeWindow.userscriptMap);
        gpxButton = keyButton.cloneNode(true);
        keyButton.parentNode.insertBefore(gpxButton, keyButton.nextSibling);
        keyButton.children[0].click();
        keyButton.children[0].click();
        gpxButton.classList.remove("control-key");
        gpxButton.children[0].setAttribute("data-bs-original-title", "Overlay GPX");
        gpxButton.children[0].classList.remove("disabled");
        gpxButton.children[0].style.padding = "10px";
        gpxButton.children[0].innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#ffffff" fill-rule="evenodd" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd"/></svg>`;
        gpxButton.children[0].addEventListener("click", buttonAdd);
        gpxButton.children[0].addEventListener("contextmenu", clearFiles);
        const mapEl = document.getElementById("map");
        mapEl.addEventListener("dragover", prevent);
        mapEl.addEventListener("drop", dragAdd);
    }, 100);
});