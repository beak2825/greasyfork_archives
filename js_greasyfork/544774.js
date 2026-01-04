// ==UserScript==
// @name         GreasyFork Order Scripts by Older
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  Añade opción para ordenar por el script más antiguo (fecha de creación ascendente)
// @match        https://greasyfork.org/es/scripts/by-site/drawaria.online*
// @match        https://greasyfork.org/es/scripts/by-site/*
// @match        https://greasyfork.org/es/scripts*
// @match        https://greasyfork.org/*/scripts/by-site/drawaria.online*
// @match        https://greasyfork.org/*/scripts/by-site/*
// @match        https://greasyfork.org/*/scripts*
// @match        https://greasyfork.org/es/users/*
// @match        https://greasyfork.org/*/users/*
// @author YouTubeDrawaria
// @grant none
// @license MIT
// @icon https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @downloadURL https://update.greasyfork.org/scripts/544774/GreasyFork%20Order%20Scripts%20by%20Older.user.js
// @updateURL https://update.greasyfork.org/scripts/544774/GreasyFork%20Order%20Scripts%20by%20Older.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. LOCALIZA LA LISTA Y LA BARRA DE OPCIONES
    function getList() {
        return document.querySelector('#browse-script-list');
    }

    function getOptionBar() {
        // Es la ul de la barra de ordenado
        return document.querySelector('#script-list-sort ul');
    }

    // 2. CREA EL BOTÓN DE ORDEN ANCIENT
    function addOldestButton() {
        const bar = getOptionBar();
        if (!bar || bar.querySelector('.sort-oldest-added')) return;
        const li = document.createElement('li');
        li.className = 'list-option sort-oldest-added';

        const a = document.createElement('a');
        a.href = "#";
        a.textContent = "Más antiguo";
        a.style.fontWeight = "bold";
        a.onclick = function(e){
            e.preventDefault();
            sortByOldest();
        };
        li.appendChild(a);
        bar.appendChild(li);
    }

    // 3. ACCIÓN DE ORDENAMIENTO
    function sortByOldest() {
        const list = getList();
        if (!list) return;
        const items = Array.from(list.querySelectorAll('li[data-script-created-date]'));
        // Ordenar por fecha ascendente (más antiguo primero)
        items.sort(function (a, b) {
            // Usa el valor data-script-created-date, que es YYYY-MM-DD (ISO)
            const da = new Date(a.getAttribute('data-script-created-date'));
            const db = new Date(b.getAttribute('data-script-created-date'));
            return da - db;
        });
        // Eliminar todos los items existentes
        while (list.firstChild) list.removeChild(list.firstChild);
        // Insertar en orden nuevo
        for (const it of items) list.appendChild(it);
    }

    // 4. ESPERA A QUE EL DOM ESTÉ LISTO Y EJECUTA
    function init() {
        addOldestButton();
    }
    // Por si tardan en cargar las opciones
    document.addEventListener('DOMContentLoaded', init);
    setTimeout(init, 1500);

})();
