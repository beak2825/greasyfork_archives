// ==UserScript==
// @name         WME - Export Places Educativos a Excel
// @namespace    https://waze.com/
// @version      2025.05.12.01
// @description  Exporta a Excel los places cuyo nombre contenga 'colegio', 'escuela' o 'universidad'.
// @author       Crotalo
// @match        https://www.waze.com/*editor*
// @grant        none
// @require      https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/534768/WME%20-%20Export%20Places%20Educativos%20a%20Excel.user.js
// @updateURL https://update.greasyfork.org/scripts/534768/WME%20-%20Export%20Places%20Educativos%20a%20Excel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForWaze() {
        if (typeof W === 'undefined' || !W.map || !W.model || !W.model.venues) {
            setTimeout(waitForWaze, 1000);
        } else {
            initButton();
        }
    }

    function initButton() {
        const btn = document.createElement('button');
        btn.innerText = 'Exportar Places Educativos';
        btn.style.position = 'absolute';
        btn.style.top = '90px';
        btn.style.right = '10px';
        btn.style.zIndex = 9999;
        btn.style.padding = '6px 12px';
        btn.style.background = '#4CAF50';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';

        btn.onclick = exportPlaces;

        document.body.appendChild(btn);
    }

    function exportPlaces() {
        const venues = W.model.venues.objects;
        const filtered = [];

        for (let id in venues) {
            const venue = venues[id];
            const name = venue.attributes.name ? venue.attributes.name.toLowerCase() : '';

            if (name.includes('colegio') || name.includes('escuela') || name.includes('universidad')) {
                const permalink = generatePermalink(venue);
                filtered.push({
                    Nombre: venue.attributes.name,
                    Permalink: permalink
                });
            }
        }

        if (filtered.length === 0) {
            alert('No se encontraron places educativos en pantalla.');
            return;
        }

        const confirmar = confirm(`Se encontraron ${filtered.length} places educativos. ¿Deseas exportarlos a Excel?`);
        if (!confirmar) {
            return;
        }

        // Generar Excel usando SheetJS
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filtered);
        XLSX.utils.book_append_sheet(wb, ws, "Places Educativos");
        XLSX.writeFile(wb, "places_educativos.xlsx");
    }

    function generatePermalink(venue) {
        const geom = venue.attributes.geoJSONGeometry;
        if (!geom || !geom.coordinates) return "Sin coordenadas";

        let lat, lon;

        if (geom.type === "Point") {
            lon = geom.coordinates[0];
            lat = geom.coordinates[1];
        } else if (geom.type === "Polygon") {
            lon = geom.coordinates[0][0][0];
            lat = geom.coordinates[0][0][1];
        } else {
            return "Sin coordenadas";
        }

        const venueId = venue.attributes.id;
        return `https://www.waze.com/editor?env=row&lat=${lat}&lon=${lon}&zoomLevel=18&venues=${venueId}`;
    }

    waitForWaze();
})();
