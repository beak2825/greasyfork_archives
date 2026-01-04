// ==UserScript==
// @name         Instituto Nacional de Perinatología
// @namespace    INPER
// @version      0.1.1
// @description  A robarles el oro de nuevo
// @author       You
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/4/43/INPer_logo.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487485/Instituto%20Nacional%20de%20Perinatolog%C3%ADa.user.js
// @updateURL https://update.greasyfork.org/scripts/487485/Instituto%20Nacional%20de%20Perinatolog%C3%ADa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const min = 1;
    const max = 5;
    const webhookUrl = ''

    const uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const playerId = uw.Game?.player_id;
    const worldId = uw.Game?.world_id;
    const csrf = uw.Game?.csrfToken;
    const townId = uw.Game?.townId;
    const seaTownMap = {};

    function buildSeaTownMap() {
        const towns = uw.ITowns.towns;

        for (const id in towns) {
            if (!Object.prototype.hasOwnProperty.call(towns, id)) continue;

            const town = towns[id];

            const availableTrade = town.getAvailableTradeCapacity();
            if (availableTrade <= 100) {
                continue;
            }

            const x = town.getIslandCoordinateX();
            const y = town.getIslandCoordinateY();

            const seaX = Math.floor(x / 100);
            const seaY = Math.floor(y / 100);
            const sea = `${seaX}${seaY}`;

            if (!seaTownMap[sea]) {
                seaTownMap[sea] = {
                    sea,
                    townId: town.getId(),
                    name: town.getName(),
                    x,
                    y,
                    availableTrade,
                    town
                };
            }
        }

        return seaTownMap;
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchDataAndProcess() {
        buildSeaTownMap();

        console.log(seaTownMap);

        let rng = Math.floor(Math.random() * 3);
        const fecha = new Date();

        const arraySonidos = [
            'https://inper.mx/descargas/mp3/03_Pertenencia.mp3',
            'https://inper.mx/descargas/mp3/Felicita.mp3',
            'https://inper.mx/descargas/mp3/02_Clima.mp3'
        ];

        function fetchData(townId) {
            return new Promise((resolve, reject) => {
                const payload = {
                    window_type: "market",
                    tab_type: "premium_exchange",
                    known_data: {
                        models: [],
                        collections: ["Towns"],
                        templates: [],
                    },
                    town_id: townId,
                    nl_init: true
                };

                console.log("[fetchData] Llamando a gpAjax.ajaxGet con payload:", payload);

                uw.gpAjax.ajaxGet('frontend_bridge', 'fetch', payload, true, function () {
                    console.log("[fetchData] Callback gpAjax.ajaxGet -> arguments:", arguments);

                    const resp = arguments[0];

                    if (!resp) {
                        console.warn("[fetchData] Respuesta vacía de gpAjax");
                        reject(new Error("Respuesta vacía de gpAjax"));
                        return;
                    }

                    resolve(resp);
                });
            });
        }

        function getData(townId) {
            return new Promise((resolve, reject) => {
                const payload = {
                    model_url: "PremiumExchange",
                    action_name: "read",
                    town_id: townId,
                    nl_init: true
                };

                console.log("[getData] Llamando a gpAjax.ajaxGet con payload:", payload);

                uw.gpAjax.ajaxGet('frontend_bridge', 'execute', payload, true, function () {
                    console.log("[getData] Callback gpAjax.ajaxGet -> arguments:", arguments);

                    const resp = arguments[0];

                    if (!resp) {
                        console.warn("[getData] Respuesta vacía de gpAjax");
                        reject(new Error("Respuesta vacía de gpAjax"));
                        return;
                    }

                    const useful = resp.json || resp;
                    console.log("[getData] Respuesta procesada (useful):", useful);

                    resolve(useful);
                });
            });
        }

        async function checkPremiumExchangeOnce(townId) {
            try {
                console.log(`\n===== Check PremiumExchange en townId ${townId} =====`);

                const rng = Math.floor(Math.random() * arraySonidos.length);

                await fetchData(townId);

                const data = await getData(townId);
                console.log("[checkPremiumExchangeOnce] Data recibida:", data);

                for (let material in data) {
                    if (material === 'sea_id') continue;

                    const stock = data[material].stock;
                    const capacity = data[material].capacity;
                    const difference = capacity - stock;

                    console.log(`[town ${townId}] ${material} -> stock=${stock}, cap=${capacity}, diff=${difference}`);

                    if (difference >= 1000) {

                        setTimeout(function(){
                            switchTown(townId);
                        },300);
                        reproducirSonido(arraySonidos[rng]);
                        sendDiscordWebhook(material, capacity, stock, difference);
                        return;
                    }
                }

            } catch (e) {
                console.error(`[checkPremiumExchangeOnce] Error en townId ${townId}:`, e);
            }
        }

        async function processSeaTownMapOnce() {
            const seas = Object.values(seaTownMap);

            for (const entry of seas) {
                const delayMs = (1 + Math.random() * 2) * 1000; // 1–3 segundos
                console.log(
                    `Programando checkPremiumExchangeOnce para mar ${entry.sea} ` +
                    `ciudad ${entry.name} (townId=${entry.townId}) en ${Math.round(delayMs)} ms`
                );

                await sleep(delayMs);
                await checkPremiumExchangeOnce(entry.townId);
            }

            console.log("=== Fin de un pase completo por seaTownMap ===");
        }

        processSeaTownMapOnce();

        const minInterval = min * 60 * 1000;
        const maxInterval = max * 60 * 1000;
        const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval) + minInterval);
        const proximaSolicitud = new Date(fecha.getTime() + randomInterval);
        setTimeout(fetchDataAndProcess, randomInterval);
    }


    function sendDiscordWebhook(material, capacity, stock, difference) {

        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: '@everyone \nHay oro de: ' + material + '\n \tHay: ' + difference + '\n\n' +Date()})
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar el webhook a Discord');
            }
        }).catch(error => console.error(error));
    }


    function obtenerHoraFormateada(fecha) {
        const horas = fecha.getHours();
        const minutos = fecha.getMinutes();
        const segundos = fecha.getSeconds();
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    function switchTown(townId) {
        const old = uw.Game.townId;
        uw.Game.townId = townId;
        uw.$.Observer(uw.GameEvents.town.town_switch).publish({
            new_town_id: townId,
            old_town_id: old
        });

        setTimeout(abrirMercado, 300);

    }

    function abrirMercado() {
        uw.MarketWindowFactory.openMarketWindow()
    }


    function reproducirSonido(url) {
        const audio = new Audio(url);
        audio.play();
    }

    setTimeout(
        fetchDataAndProcess
        , 5000);
})();