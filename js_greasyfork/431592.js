// ==UserScript==
// @name            WME Open Reporting Tool
// @name:es         WME Abrir Herramienta de Reportes
// @description     Adds a small button in footer toolbar to open the reporting tool in the same coords you are.
// @description:es  Agrega un pequeño botón en la barra de herramientas inferior para abrir la herramienta de reportes en la misma coordenada en la que se encuentra.

// @namespace       https://greasyfork.org/en/users/670818-edward-navarro
// @version         2022.09.19.01

// @author          EdwardNavarro
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/editor*
// @include         https://beta.waze.com/*/editor*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @grant           none
// @icon            https://www.edwardnavarro.com/cdn/wme/wme_ort_icon.svg
// @run-at          document-body
// @downloadURL https://update.greasyfork.org/scripts/431592/WME%20Open%20Reporting%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/431592/WME%20Open%20Reporting%20Tool.meta.js
// ==/UserScript==

(function() {

    'use strict';

    // This script is a refactor of Crotalo's unattended script "WME to reporting tool" (https://greasyfork.org/en/scripts/386906-wme-to-reporting-tool).
    // Crotalo profile: (https://greasyfork.org/en/users/67894-crotalo)

    // ICON
    var icon_svg = "data:image/svg+xml,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'%3E%3Cpath d='M32 8c0-4.415-3.585-8-8-8H8C3.585 0 0 3.585 0 8v16c0 4.415 3.585 8 8 8h16c4.415 0 8-3.585 8-8V8z' fill='%236500ff'/%3E%3Cg fill='%23fff' fill-rule='nonzero'%3E%3Cpath d='M7.07 14.518h.912l1.481-4.358 1.482 4.358h.912L13.96 8.41h-1.111l-1.438 4.497-1.482-4.514h-.895L7.55 12.907 6.113 8.41H4.968l2.101 6.108zM15.044 14.475h1.042v-4.332l1.886 2.842h.034l1.904-2.86v4.35h1.059V8.41H19.84l-1.835 2.868-1.834-2.868h-1.128v6.065zM22.52 14.475h4.512v-.953h-3.454v-1.629h3.023v-.953h-3.023V9.363h3.41V8.41H22.52v6.065z'/%3E%3C/g%3E%3Cpath d='M8.856 23.607c2.205 0 3.909-1.654 3.909-3.725v-.02c0-2.072-1.684-3.705-3.888-3.705-2.205 0-3.909 1.653-3.909 3.725v.02c0 2.072 1.684 3.705 3.888 3.705zm.02-2.113c-.918 0-1.5-.765-1.5-1.612v-.02c0-.837.572-1.593 1.48-1.593.919 0 1.5.766 1.5 1.613v.02c0 .837-.57 1.592-1.48 1.592zM13.418 23.454h2.388v-2.041h.51l1.347 2.04h2.725l-1.663-2.428c.867-.419 1.408-1.143 1.408-2.184v-.02c0-.735-.224-1.266-.653-1.695-.5-.5-1.306-.816-2.572-.816h-3.49v7.144zm2.388-3.746V18.31h1.041c.551 0 .908.225.908.684v.02c0 .44-.347.694-.918.694h-1.03zM22.542 23.454h2.388V18.33h2.102V16.31h-6.593v2.02h2.103v5.124z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E";

    function generateURL() {
        var segment = W.selectionManager.getSegmentSelection().segments[0];
        var projI = new OpenLayers.Projection("EPSG:900913");
        var projE = new OpenLayers.Projection("EPSG:4326");
        var center_lonlat = (new OpenLayers.LonLat(W.map.olMap.center.lon,W.map.olMap.center.lat)).transform(projI,projE);
        var lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
        var lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
        return `https://www.waze.com/reporting?env=row&lat=${lat}&lon=${lon}&zoomLevel=19&lng=${lon}&zoom=19`;
    }

    function openRT() {
        var rtUrl = generateURL();
        window.open(rtUrl, "_blank");
    }

    function init_OPEN_REPORTING_TOOL() {
        try {
            var toolbarWrap = document.querySelector('.WazeControlPermalink');
            if (toolbarWrap !== null) {
                toolbarWrap.insertAdjacentHTML('afterend', `<div class="WazeControlORT" id="WME_ORT" style="margin:0 5px;"><a href="#" id="btn-openrt"><img src="${icon_svg}" width="18" height="18" alt="Open Reporting Tool" title="Open Reporting Tool" /></a></div>`);
                document.getElementById("btn-openrt").addEventListener("click", openRT, false);
                console.info('%c%s','background:green;color:white;padding:5px 10px;','[SUCCESS] WME OPEN REPORTING TOOL >> INITIALIZED');
            } else {
                setTimeout(init_OPEN_REPORTING_TOOL, 1000);
                console.error('%c%s','background:red;color:white;padding:5px 10px;','[ERROR] OPEN REPORTING TOOL >> Could not find necessary Waze map objets. Trying again...');
            }
        } catch (err) {
            setTimeout(init_OPEN_REPORTING_TOOL, 1000);
            console.error('%c%s','background:red;color:white;padding:5px 10px;','[ERROR] WME OPEN REPORTING TOOL >> Failed to initialize.');
            console.error('%c%s','background:red;color:white;padding:5px 10px;','[ERROR] WME OPEN REPORTING TOOL >> Error details: ', err);
        }
    }

    init_OPEN_REPORTING_TOOL();

})();