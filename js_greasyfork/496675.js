// ==UserScript==
// @name         ffs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Aumenta a performance do jogo e diminui a latência, além de implementar um sistema de medidor de ping e FPS.
// @author       You
// @match        https://starve.io/
// @grant        none
// @require      https://unpkg.com/guify@0.12.0/lib/guify.min.js
// @require      https://unpkg.com/guify@0.12.0/lib/guify.min.css
// @downloadURL https://update.greasyfork.org/scripts/496675/ffs.user.js
// @updateURL https://update.greasyfork.org/scripts/496675/ffs.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // Criação do container para o medidor de FPS
    const fpsContainer = document.createElement('div');
    fpsContainer.id = 'fps-meter';
    fpsContainer.style.position = 'fixed';
    fpsContainer.style.bottom = '45px';
    fpsContainer.style.left = '10px';
    fpsContainer.style.color = 'red';
    fpsContainer.style.fontFamily = 'Arial, sans-serif';
    fpsContainer.style.fontSize = '17px';
    fpsContainer.style.fontWeight = 'bold';
    fpsContainer.style.zIndex = '9999';
    fpsContainer.style.padding = '7px';
    fpsContainer.style.borderRadius = '10px';
    fpsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    fpsContainer.style.maxWidth = '140px';
    fpsContainer.style.textAlign = 'center';
    fpsContainer.textContent = 'FPS: --';
    document.body.appendChild(fpsContainer);

    // Criação do container para o medidor de Ping
    const pingContainer = document.createElement('div');
    pingContainer.id = 'ping-meter';
    pingContainer.style.position = 'fixed';
    pingContainer.style.bottom = '10px';
    pingContainer.style.left = '10px';
    pingContainer.style.color = 'red';
    pingContainer.style.fontFamily = 'Arial, sans-serif';
    pingContainer.style.fontSize = '17px';
    pingContainer.style.fontWeight = 'bold';
    pingContainer.style.zIndex = '9999';
    pingContainer.style.padding = '7px';
    pingContainer.style.borderRadius = '10px';
    pingContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    pingContainer.style.maxWidth = '140px';
    pingContainer.style.textAlign = 'center';
    pingContainer.textContent = 'Ping: --';
    document.body.appendChild(pingContainer);

    // Função para medir o ping
    function measurePing() {
        var startTime = performance.now();
        client.oOW.send(JSON.stringify([10, 107, 0, 0]));
        setTimeout(function() {
            var endTime = performance.now();
            var ping = endTime - startTime;
            document.getElementById("ping-meter").innerHTML = "Ping: " + ping.toFixed(2) + "ms";
        }, 100);
    }

    // Função para medir o FPS
    function measureFPS() {
        var frames = 0;
        var lastTime = performance.now();
        requestAnimationFrame(function tick() {
            var currentTime = performance.now();
            frames++;
            if (currentTime - lastTime >= 1000) {
                var fps = frames / ((currentTime - lastTime) / 1000);
                document.getElementById("fps-meter").innerHTML = "FPS: " + fps.toFixed(2);
                frames = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(tick);
        });
    }

    // Funções para atualizar o FPS e Ping periodicamente
    function updateFPS() {
        requestAnimationFrame(function() {
            const startTime = performance.now();
            requestAnimationFrame(function() {
                const endTime = performance.now();
                const fps = Math.min(Math.round(1000 / (endTime - startTime)), 60);
                fpsContainer.textContent = fps + ' FPS';
            });
        });
    }

    function updatePing() {
        pingServer('https://starve.io/favicon.ico', function(ping) {
            pingContainer.textContent = ping + ' ms';
        });
    }

    function pingServer(url, callback) {
        const startTime = performance.now();
        fetch(url, { mode: 'no-cors' })
            .then(response => {
                const endTime = performance.now();
                const ping = endTime - startTime;
                callback(Math.round(ping));
            })
            .catch(error => {
                callback(-1); // Em caso de erro, define o ping como -1
            });
    }

    setInterval(updateFPS, 1000);
    setInterval(updatePing, 1000);

    // Otimizações de performance
    document.body.style.backgroundImage = 'none';

    var canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.width = canvas.width / 2;
        canvas.height = canvas.height / 2;
    }

    // Bloqueio de anúncios
    function blockAds() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.tagName === 'VIDEO' || node.classList.contains('advert')) {
                            node.remove();
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    blockAds();

    var adVideo = document.querySelector('video.wg-ad-player');
    if (adVideo) {
        adVideo.remove();
    } else {
        console.log('Elemento de vídeo do anúncio não encontrado.');
    }


    const Utils = {
        saveSettings: function() {
            const settings = {
                RECIPES_OPACITY: document.getElementById("home_craft").style.opacity,
                CHRONO_QUESTS_OPACITY: document.getElementById("chronoquest").style.opacity,
                SETTINGS_OPACITY: document.getElementById("option_in_game").style.opacity,
                SHOP_OPACITY: document.getElementById("shop_market").style.opacity,
                DROP_CONFIRM_OPACITY: document.getElementById("sure_delete").style.opacity,
                CANCEL_CRAFTING_OPACITY: document.getElementById("cancel_sure_delete").style.opacity
            };
            localStorage.setItem('userSettings', JSON.stringify(settings));
            console.log('Settings saved:', settings);
        },
        loadSettings: function() {
            const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
            return settings;
        }
    };

    // Carregar e aplicar configurações salvas
    const savedSettings = Utils.loadSettings();

    function applySettings(settings) {
        if (settings.RECIPES_OPACITY) document.getElementById("home_craft").style.opacity = settings.RECIPES_OPACITY;
        if (settings.RECIPES_OPACITY) document.querySelector('#recipe_craft.block3').style.opacity = settings.RECIPES_OPACITY;
        if (settings.CHRONO_QUESTS_OPACITY) document.getElementById("chronoquest").style.opacity = settings.CHRONO_QUESTS_OPACITY;
        if (settings.SETTINGS_OPACITY) document.getElementById("option_in_game").style.opacity = settings.SETTINGS_OPACITY;
        if (settings.SHOP_OPACITY) document.getElementById("shop_market").style.opacity = settings.SHOP_OPACITY;
        if (settings.DROP_CONFIRM_OPACITY) document.getElementById("sure_delete").style.opacity = settings.DROP_CONFIRM_OPACITY;
        if (settings.CANCEL_CRAFTING_OPACITY) document.getElementById("cancel_sure_delete").style.opacity = settings.CANCEL_CRAFTING_OPACITY;
    }

    applySettings(savedSettings);

    // Criação do container para o painel Guify
    const container = document.createElement('div');
    container.id = 'guify-container';
    document.body.appendChild(container);

    // Inicialização do painel Guify (oculto por padrão)
    const gui = new guify({
        title: 'Dexter',
        theme: {
            name: "Alex",
            colors: {
                panelBackground: "rgba(0, 0, 0, 0.3)",
                componentBackground: "black",
                componentForeground: "white",
                textPrimary: "white",
                textSecondary: "darkred",
                textHover: "white"
            },
            font: {
                fontFamily: "Baloo Paaji",
                fontSize: "21px",
                fontWeight: "2"
            }
        },
        align: "right",
        width: 650,
        barMode: "none",
        panelMode: "window",
        root: container,
        open: false
    });

    // Adiciona pastas ao painel Guify
    gui.Register({
        type: 'folder',
        label: "<span style='color: darkred; text-shadow: 1px 1px 1px red;'>Opacity</span>"
    });

    gui.Register({
        type: 'folder',
        label: "<span style='color: darkred; text-shadow: 1px 1px 1px red;'>Others</span>"
    });

    gui.Register([
        {
            type: "range",
            label: "<span style='color: darkred; text-shadow: 2px 2px 2px red;'>Recipes Opacity</span>",
            object: {
                RECIPES_OPACITY: parseFloat(savedSettings.RECIPES_OPACITY) || 1
            },
            property: "RECIPES_OPACITY",
            min: 0,
            max: 1,
            step: 0.1,
            onChange: function (value) {
                document.getElementById("home_craft").style.opacity = value;
                document.querySelector('#recipe_craft.block3').style.opacity = value;
                Utils.saveSettings();
            }
        },
        {
            type: "range",
            label: "<span style='color: darkred; text-shadow: 2px 2px 2px red;'>Chrono Quests Opacity</span>",
            object: {
                CHRONO_QUESTS_OPACITY: parseFloat(savedSettings.CHRONO_QUESTS_OPACITY) || 1
            },
            property: "CHRONO_QUESTS_OPACITY",
            min: 0,
            max: 1,
            step: 0.1,
            onChange: function (value) {
                document.getElementById("chronoquest").style.opacity = value;
                Utils.saveSettings();
            }
        },
        {
            type: "range",
            label: "<span style='color: darkred; text-shadow: 2px 2px 2px red;'>Settings Opacity</span>",
            object: {
                SETTINGS_OPACITY: parseFloat(savedSettings.SETTINGS_OPACITY) || 1
            },
            property: "SETTINGS_OPACITY",
            min: 0,
            max: 1,
            step: 0.1,
            onChange: function (value) {
                document.getElementById("option_in_game").style.opacity = value;
                Utils.saveSettings();
            }
        },
        {
            type: "range",
            label: "<span style='color: darkred; text-shadow: 2px 2px 2px red;'>Shop Opacity</span>",
            object: {
                SHOP_OPACITY: parseFloat(savedSettings.SHOP_OPACITY) || 1
            },
            property: "SHOP_OPACITY",
            min: 0,
            max: 1,
            step: 0.1,
            onChange: function (value) {
                document.getElementById("shop_market").style.opacity = value;
                Utils.saveSettings();
            }
        },
        {
            type: "range",
            label: "<span style='color: darkred; text-shadow: 2px 2px 2px red;'>Drop Confirm Opacity</span>",
            object: {
                DROP_CONFIRM_OPACITY: parseFloat(savedSettings.DROP_CONFIRM_OPACITY) || 1
            },
            property: "DROP_CONFIRM_OPACITY",
            min: 0,
            max: 1,
            step: 0.1,
            onChange: function (value) {
                document.getElementById("sure_delete").style.opacity = value;
                Utils.saveSettings();
            }
        },
        {
            type: "range",
            label: "<span style='color: darkred; text-shadow: 2px 2px 2px red;'>Cancel Crafting Opacity</span>",
            object: {
                CANCEL_CRAFTING_OPACITY: parseFloat(savedSettings.CANCEL_CRAFTING_OPACITY) || 1
            },
            property: "CANCEL_CRAFTING_OPACITY",
            min: 0,
            max: 1,
            step: 0.1,
            onChange: function (value) {
                document.getElementById("cancel_sure_delete").style.opacity = value;
                Utils.saveSettings();
            }
        }
    ], {
        folder: "<span style='color: darkred; text-shadow: 1px 1px 1px red;'>Opacity</span>"
    });

})();
