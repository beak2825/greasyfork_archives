// ==UserScript==
// @name        OpenStreetMap & OpenGeofiction Show Nodes
// @namespace   Violentmonkey Scripts
// @match       *://www.openstreetmap.org/*
// @match       *://www.opengeofiction.net/*
// @match       *://opengeofiction.net/*
// @version     1.1
// @author      CyrilSLi
// @description Shows all nearby nodes in query results and displays constituent nodes if a way is selected
// @license     MIT
// @grant       unsafeWindow
// @require     https://update.greasyfork.org/scripts/533461/1574689/Get%20OpenStreetMap%20Leaflet%20object.js
// @downloadURL https://update.greasyfork.org/scripts/536147/OpenStreetMap%20%20OpenGeofiction%20Show%20Nodes.user.js
// @updateURL https://update.greasyfork.org/scripts/536147/OpenStreetMap%20%20OpenGeofiction%20Show%20Nodes.meta.js
// ==/UserScript==

const featureStyle = {
    color: "#FF6200",
    weight: 4,
    opacity: 1,
    fillOpacity: 0.5,
    interactive: false
};
function showQueryNodes(elements) {
    document.getElementById("sidebar_content").insertAdjacentHTML("beforeend", `
        <div id="query-allnodes" class="query-results">
            <h3>All Nodes</h3>
            <div class="mx-n3">
                <ul class="query-results-list list-group list-group-flush" id="allnodes"></ul>
            </div>
        </div>
    `);
    document.getElementById("query-allnodes").style.display = "block";
    const allNodes = document.getElementById("allnodes");
    const nodeMarkers = {};
    elements.forEach((el) => {
        if (el.type === "node") {
            nodeMarkers[el.id] = L.circleMarker([el.lat, el.lon], featureStyle);
            allNodes.insertAdjacentHTML("beforeend", `<li class="list-group-item list-group-item-action">Node <a id="allnodes-${el.id}" class="stretched-link" href="/node/${el.id}">#${el.id}</a></li>`);
            const nodeEl = document.getElementById(`allnodes-${el.id}`);
            nodeEl.addEventListener("mouseenter", (ev) => {
                nodeMarkers[el.id].addTo(userscriptMap);
            });
            nodeEl.addEventListener("mouseleave", (ev) => {
                nodeMarkers[el.id].remove();
            });
            nodeEl.addEventListener("click", (ev) => {
                nodeMarkers[el.id].remove();
            });
        }
    });
    if (!allNodes.innerHTML) {
        allNodes.innerHTML = '<li class="list-group-item">No nodes found</li>';
    }
}
function showWayNodes(elements) {
    const nodeMarkers = [];
    elements.forEach((el) => {
        if (el.type === "node") {
            nodeMarkers.push(L.circleMarker([el.lat, el.lon], featureStyle).addTo(userscriptMap));
        }
    });
    const sidebar = document.getElementById("sidebar_content");
    const observer = new MutationObserver((muts) => {
        if (getComputedStyle(sidebar).display === "none" || !sidebar.getElementsByTagName("h2")[0].textContent.trim().toLowerCase().startsWith("way")) {
            nodeMarkers.forEach((el) => {
                el.remove();
            });
            observer.disconnect();
        }
    });
    observer.observe(document.getElementById("content"), {
        subtree: true,
        childList: true
    });
}

if (window.location.href.includes("openstreetmap")) {
    unsafeWindow.nativeFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(request, headers) {
        const res = await unsafeWindow.nativeFetch(request, headers);
        if (request.includes("query.openstreetmap.org/query-features") &&
            decodeURIComponent(headers.body.toString()).includes("node(around:")) {
            showQueryNodes((await res.clone().json()).elements);
        } else if (request.includes("/api/0.6/way/")) {
            showWayNodes((await res.clone().json()).elements);
        }
        return res;
    }
} else if (window.location.href.includes("opengeofiction")) {
    $(document).ajaxSuccess((ev, xhr, settings) => {
        if (settings.url.includes("overpass.opengeofiction.net/api/interpreter") &&
            decodeURIComponent(settings.data).includes("node(around:")) {
            showQueryNodes(xhr.responseJSON.elements);
        } else if (settings.url.includes("/api/0.6/way/")) {
            showWayNodes([...(xhr.responseXML).firstChild.getElementsByTagName("node")].map((el) => ({
                type: "node",
                lat: el.getAttribute("lat"),
                lon: el.getAttribute("lon")
            })));
        }
    });
}