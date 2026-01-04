// ==UserScript==
// @name         WME Places Name Inspector
// @version      1.0
// @description  Lista todos los nombres de lugares visibles en el mapa de Waze
// @author       mincho77
// @namespace    https://greasyfork.org/en/users/mincho77
// @match        https://www.waze.com/*editor*
// @match        https://beta.waze.com/*editor*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535784/WME%20Places%20Name%20Inspector.user.js
// @updateURL https://update.greasyfork.org/scripts/535784/WME%20Places%20Name%20Inspector.meta.js
// ==/UserScript==

(function() {
'use strict';

//**************************************************************************
// Nombre: waitForWazeReady
// Fecha modificación: 2025-07-12
// Autor: mincho77
// Entradas: callback (function): función a ejecutar cuando WME esté listo
// Salidas: Ninguna
// Descripción: Espera hasta que el entorno de WME esté cargado
//**************************************************************************
function waitForWazeReady(callback)
{
    const interval = setInterval(() => {
        if (typeof W !== "undefined" && W.loginManager && W.map && W.model)
        {
            clearInterval(interval);
            callback();
        }
    }, 500);
}

//**************************************************************************
// Nombre: getVisiblePlaces
// Fecha modificación: 2025-07-12
// Autor: mincho77
// Entradas: Ninguna
// Salidas: Array de objetos con id y nombre del lugar
// Descripción: Filtra los lugares visibles en el viewport actual del mapa
//**************************************************************************
function getVisiblePlaces()
{
    const extent = W.map.getExtent();
    const allPlaces = Object.values(W.model.venues.objects);

    const visiblePlaces = allPlaces.filter(place => {
        const geometry = place.geometry;
        const name = place.attributes.name;
        if (!name || !geometry)
            return false;

        return geometry.getBounds().intersectsBounds(extent);
    });

    return visiblePlaces.map(
      place => ({ id : place.getID(), name : place.attributes.name }));
}

//**************************************************************************
// Nombre: logVisiblePlaces
// Fecha modificación: 2025-07-12
// Autor: mincho77
// Entradas: Ninguna
// Salidas: Ninguna
// Descripción: Muestra por consola los lugares visibles con nombre
//**************************************************************************
function logVisiblePlaces()
{
    const places = getVisiblePlaces();
    console.table(places, [ "id", "name" ]);
    alert(`Se encontraron ${
      places.length} lugares visibles con nombre. Revisa la consola (F12).`);
}

//**************************************************************************
// Nombre: addUI
// Fecha modificación: 2025-07-12
// Autor: mincho77
// Entradas: Ninguna
// Salidas: Ninguna
// Descripción: Agrega un botón a la pestaña de usuario del editor para
// ejecutar el inspector
//**************************************************************************
function addUI()
{
    const tab = document.querySelector("#user-script-tab-content");
    if (!tab)
    {
        console.warn(
          "[WME Places Name Inspector] No se encontró el contenedor de pestaña.");
        return;
    }

    const btn = document.createElement("button");
    btn.textContent = "📍 Listar Places Visibles";
    btn.style.margin = "10px";
    btn.style.padding = "8px 12px";
    btn.style.background = "#2ecc71";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.cursor = "pointer";

    btn.onclick = logVisiblePlaces;
    tab.appendChild(btn);
}

//**************************************************************************
// INICIALIZADOR PRINCIPAL
//**************************************************************************
waitForWazeReady(() => {
    console.log("[WME Places Name Inspector] Script cargado correctamente");
    addUI();
});
})();