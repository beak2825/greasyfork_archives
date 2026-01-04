// ==UserScript==
// @name           FacilMap OSM Analysis Tools
// @namespace      https://facilmap.org/
// @description    Adds links to FacilMap OSM Analysis Tools to OpenStreetMap feature and changeset pages.
// @include        https://www.openstreetmap.org/changeset/*
// @include        https://www.openstreetmap.org/relation/*
// @include        https://www.openstreetmap.org/way/*
// @include        https://www.openstreetmap.org/node/*
// @license        BSD-2
// @version 0.0.1.20250310074008
// @downloadURL https://update.greasyfork.org/scripts/529372/FacilMap%20OSM%20Analysis%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/529372/FacilMap%20OSM%20Analysis%20Tools.meta.js
// ==/UserScript==

const m = location.pathname.match(/^\/(changeset|relation|way|node)\/(\d+)/);
if (m) {
    const [, type, id] = m;

    if (type === "changeset") {
        document.querySelector(".browse-section .details").insertAdjacentHTML("afterend", `<ul class="list-unstyled"></ul>`);
    }
    if (["relation", "way", "node", "changeset"].includes(type)) {
        document.querySelector(".browse-section ul").insertAdjacentHTML("beforeend", `<li><a href="https://facilmap.org/#q=${type}%20${id}" target="_blank">Open on FacilMap</a></li>`);
    }
    if (["relation", "way"].includes(type)) {
        document.querySelector(".browse-section ul").insertAdjacentHTML("beforeend", `<li><a href="https://facilmap.org/#q=blame%20${type}%20${id}" target="_blank">Blame on FacilMap</a></li>`);
    }
}