// ==UserScript==
// @name         Contador de tropas
// @namespace    http://tampermonkey.net/
// @version      3.5
// @license MIT
// @description  Muestra tropas defensivas u ofensivas con imágenes actualizadas y permite copiar el listado filtrado en un formato específico para mensajes en Grepolis.
// @author       Tu Nombre
// @match        https://*.grepolis.com/game/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/505223/Contador%20de%20tropas.user.js
// @updateURL https://update.greasyfork.org/scripts/505223/Contador%20de%20tropas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uw = unsafeWindow;

    // CSS para la ventana
    GM_addStyle(`
        #GTM_button {
            margin-bottom: 3px;
            cursor: pointer;
        }
        #GTM_window {
            display: none;
            width: 600px;
            z-index: 1100;
            position: absolute;
            top: 100px;
            left: 30vw;
            text-align: center;
            background-color: #f0e6d6;
            border: 2px solid black;
            border-radius: 10px;
            padding: 10px;
        }
        #GTM_close {
            float: right;
            margin-top: -20px;
            cursor: pointer;
            font-size: 18px;
        }
        .GTM_unit {
            display: inline-block;
            margin: 5px;
            text-align: center;
        }
        .GTM_unit img {
            width: 40px;
            height: 40px;
            display: block;
            margin: 0 auto;
        }
        .GTM_unit span {
            display: block;
            margin-top: 5px;
            font-weight: bold;
        }
        .GTM_total {
            font-weight: bold;
            color: red;
            margin-top: 10px;
        }
        #GTM_message_button {
            margin-top: 10px;
            cursor: pointer;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 14px;
        }
        #GTM_message_button:hover {
            background-color: #45a049;
        }
        #GTM_filters {
            margin-bottom: 10px;
        }
        .GTM_filter_button {
            cursor: pointer;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            margin-right: 5px;
        }
        .GTM_filter_button.active {
            background-color: #45a049;
        }
        .GTM_filter_button:hover {
            background-color: #45a049;
        }
    `);

    // Mapeo de unidades defensivas y ofensivas con sus nombres en español e imágenes actualizadas
    const defensiveUnits = {
        "sword": { name: "Espadachín", img: "https://imgur.com/SUCgJU3.png" },
        "archer": { name: "Arquero", img: "https://i.imgur.com/xLOtNgs.png" },
        "hoplite": { name: "Hoplita", img: "https://imgur.com/fjjL6GT.png" },
        "chariot": { name: "Carro", img: "https://i.imgur.com/GpLHnv3.png" },
        "bireme": { name: "Birreme", img: "https://i.imgur.com/kLQCM99.png" },
        "trireme": { name: "Trirreme", img: "https://i.imgur.com/0YlGkCP.png" },
        "fire_ship": { name: "Brulote", img: "https://i.imgur.com/JNfJ3h0.png" }
    };

    const offensiveUnits = {
        "slinger": { name: "Hondero", img: "https://imgur.com/SEgKJTm.png" },
        "rider": { name: "Caballero", img: "https://imgur.com/mFnNJ0E.png" },
        "catapult": { name: "Catapulta", img: "https://i.imgur.com/oFEOsXo.png" },
        "harpy": { name: "Arpía", img: "https://i.imgur.com/PA4uFbi.png" },
        "griffin": { name: "Grifo", img: "https://i.imgur.com/EHb10e5.png" },
        "manticore": { name: "Mantícora", img: "https://i.imgur.com/ttR3Q8x.png" },
        "hydra": { name: "Hidra", img: "https://i.imgur.com/bQTnQv1.png" },
        "flame_ship": { name: "Lanzallamas", img: "https://i.imgur.com/43NVBNT.png" },
        "attack_ship": { name: "Nave Incendiaria", img: "https://i.imgur.com/Y5WorTq.png" },
        "trireme": { name: "Trirreme", img: "https://i.imgur.com/0YlGkCP.png" }
    };

    let currentFilter = 'defensive';

    // Función para extraer la información de las tropas según el filtro
    function getTroopData() {
        let troopData = {};
        try {
            const player_towns = uw.ITowns.towns;
            for (let townId in player_towns) {
                if (player_towns.hasOwnProperty(townId)) {
                    const town = player_towns[townId];
                    const units = town.units();
                    for (let unit in units) {
                        if (units.hasOwnProperty(unit) && units[unit] > 0) {
                            const unitList = currentFilter === 'defensive' ? defensiveUnits : offensiveUnits;
                            if (unitList[unit]) {
                                if (!troopData[unit]) troopData[unit] = 0;
                                troopData[unit] += units[unit];
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error while fetching troop data:", e);
        }
        return troopData;
    }

    // Función para generar el mensaje de texto
    function generateMessageText(troopData) {
        let messageText = 'Tengo las siguientes tropas:\n';
        const unitList = currentFilter === 'defensive' ? defensiveUnits : offensiveUnits;
        for (let unit in unitList) {
            if (troopData.hasOwnProperty(unit)) {
                messageText += `${unitList[unit].name}: ${troopData[unit]}\n`;
            }
        }
        return messageText;
    }

    // Función para copiar el texto al portapapeles
    function copyToClipboard(troopData) {
        const messageText = generateMessageText(troopData);
        GM_setClipboard(messageText, 'text');
        alert('El texto ha sido copiado al portapapeles.');
    }

    // Función para mostrar la ventana con las tropas
    function displayTroopManager() {
        let troopData = getTroopData();
        let troopHtml = '';
        const unitList = currentFilter === 'defensive' ? defensiveUnits : offensiveUnits;

        for (let unit in unitList) {
            if (troopData.hasOwnProperty(unit)) {
                troopHtml += `
                    <div class="GTM_unit">
                        <img src="${unitList[unit].img}" alt="${unitList[unit].name}">
                        <span>${unitList[unit].name}</span>
                        <span>${troopData[unit]}</span>
                    </div>`;
            }
        }

        let windowHtml = `
            <div id="GTM_window">
                <span id="GTM_close">✖</span>
                <h2>Grepolis Troop Manager</h2>
                <div id="GTM_filters">
                    <button id="GTM_defensive_button" class="GTM_filter_button active">Tropas Defensivas</button>
                    <button id="GTM_offensive_button" class="GTM_filter_button">Tropas Ofensivas</button>
                </div>
                <div>${troopHtml}</div>
                <button id="GTM_message_button">Copiar en Portapapeles</button>
            </div>`;

        // Eliminar ventana previa si existe
        const existingWindow = document.getElementById('GTM_window');
        if (existingWindow) existingWindow.remove();

        // Añadir la nueva ventana al cuerpo del documento
        document.body.insertAdjacentHTML('beforeend', windowHtml);

        // Mostrar la ventana
        document.getElementById('GTM_window').style.display = 'block';

        // Funcionalidad del botón de cierre
        document.getElementById('GTM_close').addEventListener('click', function() {
            document.getElementById('GTM_window').style.display = 'none';
        });

        // Funcionalidad del botón de copiar en portapapeles
        document.getElementById('GTM_message_button').addEventListener('click', function() {
            copyToClipboard(troopData);
        });

        // Funcionalidad de los botones de filtro
        document.getElementById('GTM_defensive_button').addEventListener('click', function() {
            currentFilter = 'defensive';
            updateFilterButtons();
            displayTroopManager();
        });

        document.getElementById('GTM_offensive_button').addEventListener('click', function() {
            currentFilter = 'offensive';
            updateFilterButtons();
            displayTroopManager();
        });
    }

    // Función para actualizar los botones de filtro
    function updateFilterButtons() {
        document.getElementById('GTM_defensive_button').classList.toggle('active', currentFilter === 'defensive');
        document.getElementById('GTM_offensive_button').classList.toggle('active', currentFilter === 'offensive');
    }

    // Función para añadir el botón de Troop Manager a la interfaz principal
    function addButton() {
        const buttonHtml = `<li id="GTM_button"><span class="content_wrapper"><span class="button_wrapper"><span class="button"><span class="icon"></span></span></span><span class="name_wrapper"><span class="name">Troops</span></span></span></li>`;
        const menu = document.querySelector("#ui_box > div.nui_main_menu > div.middle > div.content > ul");
        menu.insertAdjacentHTML('beforeend', buttonHtml);

        // Añadir evento al botón
        document.getElementById('GTM_button').addEventListener('click', displayTroopManager);
    }

    // Iniciar el script después de que la página cargue
    window.addEventListener('load', function() {
        addButton();
    });
})();
