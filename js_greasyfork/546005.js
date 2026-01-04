// ==UserScript==
// @name         MZ - Clasificación
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Mejora visual de las tablas de clasificación
// @author       Oz
// @license MIT
// @match        https://www.managerzone.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546005/MZ%20-%20Clasificaci%C3%B3n.user.js
// @updateURL https://update.greasyfork.org/scripts/546005/MZ%20-%20Clasificaci%C3%B3n.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function agregarEscudos() {
        document.querySelectorAll('.nice_table td:nth-child(2)').forEach(td => {
            if (td.querySelector('.escudo-equipo') || td.querySelector('.escudo-federacion')) return;

            const linkEquipo = td.querySelector('a[href*="tid="]');
            const linkFederacion = td.querySelector('img.fed_badge');

            if (linkEquipo) {
                const equipoID = obtenerIDdesdeURL(linkEquipo.href);
                if (equipoID) {
                    const escudo = crearEscudoEquipo(equipoID);
                    const bandera = td.querySelector('img[src*="flags"]');
                    if (bandera) {
                        bandera.parentNode.insertBefore(escudo, bandera);
                    } else {
                        td.insertBefore(escudo, td.firstChild);
                    }
                    if (linkFederacion) linkFederacion.remove();
                }
            } else if (linkFederacion) {
                const fid = obtenerIDdesdeFID(linkFederacion.src);
                if (fid) {
                    const escudo = crearEscudoFederacion(fid);
                    td.insertBefore(escudo, td.firstChild);
                    linkFederacion.remove();
                }
            }
        });
    }

    function crearEscudoEquipo(equipoID) {
        const img = document.createElement('img');
        img.src = `https://www.managerzone.com/dynimg/badge.php?team_id=${equipoID}&sport=soccer&location=team_main`;
        img.className = 'escudo-equipo';
        img.style.width = '20px';
        img.style.height = '25px';
        img.style.marginRight = '5px';
        img.style.verticalAlign = 'middle';
        return img;
    }

    function crearEscudoFederacion(fid) {
        const img = document.createElement('img');
        img.src = `https://www.managerzone.com/dynimg/pic.php?type=federation&fid=${fid}&size=small&sport=soccer`;
        img.className = 'escudo-federacion';
        img.style.width = '20px';
        img.style.height = '25px';
        img.style.marginRight = '5px';
        img.style.verticalAlign = 'middle';
        return img;
    }

    function obtenerIDdesdeURL(url) {
        const match = url.match(/tid=(\d+)/);
        return match ? match[1] : null;
    }

    function obtenerIDdesdeFID(url) {
        const match = url.match(/fid=(\d+)/);
        return match ? match[1] : null;
    }

    function reemplazarEncabezadosFederacion() {
        const mapeo = {
            'PG': 'V',
            'PE': 'E',
            'PP': 'D',
            'PDD': 'DG'
        };

        document.querySelectorAll('.nice_table th').forEach(th => {
            const texto = th.textContent.trim();
            if (mapeo[texto]) {
                th.textContent = mapeo[texto];
            }
        });
    }

    function iniciarObservador() {
        const observer = new MutationObserver(() => {
            agregarEscudos();

            if (window.location.href.includes("p=federations&sub=league&tab=division")) {
                reemplazarEncabezadosFederacion();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Estilos CSS
    let estilos = `
        .nice_table_container {
            width: 100% !important;
            overflow-x: auto !important;
        }

        .nice_table td:first-child {
            text-align: left !important;
            padding-left: 12px !important;
        }

        .nice_table tr:nth-child(even) {
            background-color: #ffffff !important;
        }
        .nice_table tr:nth-child(odd) {
            background-color: #eeeeee !important;
        }

        .nice_table tr:nth-child(1) {
            background-color: #ffdd57 !important;
            font-weight: bold !important;
            color: #000 !important;
        }

        .nice_table td:nth-child(2) {
            text-align: left !important;
            padding-left: 7px !important;
            font-weight: normal !important;
            white-space: nowrap !important;
            text-transform: uppercase !important;
        }

        .nice_table, .nice_table th, .nice_table td {
            border: none !important;
        }

        .nice_table th, .nice_table td {
            padding: 7px !important;
            text-align: center !important;
        }
    `;

    if (!window.location.href.includes("p=federations&sub=league&tab=division")) {
        estilos += `
            .nice_table th:nth-child(4)::before { content: "V" !important; }
            .nice_table th:nth-child(5)::before { content: "E" !important; }
            .nice_table th:nth-child(6)::before { content: "D" !important; }

            .nice_table th:nth-child(4),
            .nice_table th:nth-child(5),
            .nice_table th:nth-child(6) {
                color: transparent !important;
                position: relative;
            }

            .nice_table th:nth-child(4)::before,
            .nice_table th:nth-child(5)::before,
            .nice_table th:nth-child(6)::before {
                color: black !important;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
            }
        `;
    }

    GM_addStyle(estilos);

    // Ejecutar las funciones principales
    agregarEscudos();
    if (window.location.href.includes("p=federations&sub=league&tab=division")) {
        reemplazarEncabezadosFederacion();
    }

    iniciarObservador();
})();
