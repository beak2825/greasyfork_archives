// ==UserScript==
// @name         Menú HT
// @version      1.6
// @namespace    _.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._.·-·._
// @description  Curación inteligente, auto trampas, auto placer, y auto chat con menú editable y toggle con ESC
// @author       argentine_BOY .:X0YT0X:.
// @match        *://sploop.io/*
// @icon         https://sploop.io/img/ui/favicon.png
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539240/Men%C3%BA%20HT.user.js
// @updateURL https://update.greasyfork.org/scripts/539240/Men%C3%BA%20HT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let _gameSocket = null;
    let _healthValue = 100;
    let _weaponSlot = 0;
    let _mouseAngle = 0;
    let _intervalIds = {};
    let _healingInProgress = false;
    let _lastHealTime = 0;
    let _lastWeaponSlot = 0; // Variable para rastrear la última arma seleccionada
    let _autoPlacerActive = false;
    let _autoPlacerAngle = 0;
    let _autoChatActive = false;

    const defaultSettings = {
        aiHealEnabled: true,
        autoTrapEnabled: true,
        autoPlacerEnabled: false,
        autoChatEnabled: false,
        healThreshold: 70,
        healRate: 50,
        targetHealth: 100,
        trapInterval: 2000,
        autoPlacerInterval: 500,
        autoChatInterval: 5000 //Intervalo de chat predeterminado.
    };

    const _config = {
        items: {
            food: { id: 2 },
            trap: { id: 7 },
            spike: { key: "r" },
            trap2: { key: "f" }
        },
        settings: { ...defaultSettings },
        chatMessages: [
            "¡Calvos al poder, brillamos con intensidad!",
            "Sin pelo en la cabeza, pero con astucia y bondad.",
            "La calvicie es sexy, ¡un look de celebridad!",
            "Somos el club de los brillantes, ¡pura genialidad!",
            "¡Calvo y orgulloso, la envidia del vecindario!"
        ]
    };

    const _origWS = window.WebSocket;
    const _origSend = WebSocket.prototype.send;

    // Rastrear los mensajes enviados para detectar cambios de arma
    window.WebSocket = function (url, protocols) {
        const ws = new _origWS(url, protocols);
        if (url.includes("sploop")) setTimeout(() => { _gameSocket = ws; }, 10);
        return ws;
    };
    window.WebSocket.prototype = _origWS.prototype;
    WebSocket.prototype.send = function (data) {
        // Interceptar mensajes de cambio de arma
        if (this === _gameSocket && data instanceof Uint8Array && data.length === 2 && data[0] === 0) {
            const weaponId = data[1];
            // Solo guardar si no es comida ni trampa
            if (weaponId !== _config.items.food.id && weaponId !== _config.items.trap.id) {
                _lastWeaponSlot = weaponId;
                _weaponSlot = weaponId;
            }
        }
        _origSend.call(this, data);
        if (_gameSocket !== this && this.url && this.url.includes("sploop")) {
            _gameSocket = this;
        }
    };

    // También capturar pulsaciones de teclas numéricas para cambios de arma
    document.addEventListener('keydown', function(e) {
        // Teclas numéricas 1-9
        if (e.key >= '1' && e.key <= '9') {
            const weaponId = parseInt(e.key) - 1; // Convertir a índice base 0
            _lastWeaponSlot = weaponId;
            _weaponSlot = weaponId;
        }
    });

    const _helpers = {
        useItem: (id) => {
            if (!_gameSocket) return;
            _gameSocket.send(new Uint8Array([0, id]));
        },
        sendAngle: (angle = _mouseAngle) => {
            if (!_gameSocket) return;
            let calculatedAngle = Math.round(65535 * ((angle % 360) * Math.PI / 180 + Math.PI) / (2 * Math.PI));
            _gameSocket.send(new Uint8Array([19, 255 & calculatedAngle, calculatedAngle >> 8 & 255]));
            _gameSocket.send(new Uint8Array([18, 0]));
        },
        resetWeapon: () => {
            if (!_gameSocket) return;
            // Usar la última arma seleccionada en lugar de _weaponSlot
            _gameSocket.send(new Uint8Array([0, _lastWeaponSlot]));

            // Agregar un mensaje de debug al menú
            const debugLabel = document.getElementById("debug-info");
            if (debugLabel) debugLabel.textContent = `Última arma: ${_lastWeaponSlot}`;
        },
        placeItem: (id) => {
            _helpers.useItem(id);
            _helpers.sendAngle();
            setTimeout(() => { _helpers.resetWeapon(); }, 5 + Math.floor(Math.random() * 5));
        },
        pressKey: (key) => {
            // Emula presionar una tecla
            const keyEvent = new KeyboardEvent('keydown', {
                key: key,
                code: 'Key' + key.toUpperCase(),
                keyCode: key.charCodeAt(0),
                which: key.charCodeAt(0),
                bubbles: true
            });
            document.dispatchEvent(keyEvent);

            // Emula soltar la tecla
            setTimeout(() => {
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: key,
                    code: 'Key' + key.toUpperCase(),
                    keyCode: key.charCodeAt(0),
                    which: key.charCodeAt(0),
                    bubbles: true
                });
                document.dispatchEvent(keyUpEvent);
            }, 50);
        },
        simulateClick: () => {
            const canvas = document.getElementById("game-canvas");
            if (!canvas) return;

            // Calcular posición del clic basada en el ángulo actual
            const centerX = canvas.clientWidth / 2;
            const centerY = canvas.clientHeight / 2;
            const distance = 100; // Distancia del clic desde el centro
            const radians = (_autoPlacerAngle * Math.PI) / 180;
            const clickX = centerX + Math.cos(radians) * distance;
            const clickY = centerY + Math.sin(radians) * distance;

            // Crear y despachar eventos de mouse down y up
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: clickX,
                clientY: clickY
            });

            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: clickX,
                clientY: clickY
            });

            canvas.dispatchEvent(mouseDownEvent);

            // Pequeño retraso antes del mouseup
            setTimeout(() => {
                canvas.dispatchEvent(mouseUpEvent);
            }, 10);
        },
        isIngame: () => {
            const homepage = document.getElementById("homepage");
            return homepage && homepage.style.display === "none";
        },
        canPerformAction: () => {
            if (!_helpers.isIngame()) return false;
            const chat = document.getElementById("chat-wrapper");
            const clan = document.getElementById("clan-menu");
            return !(chat && chat.style.display === "block" || clan && clan.style.display === "block");
        },
        startAIHealing: () => {
            if (_healingInProgress) return;
            _healingInProgress = true;
            function healStep() {
                if (!_helpers.canPerformAction() || _healthValue >= _config.settings.targetHealth || !_config.settings.aiHealEnabled) {
                    _healingInProgress = false;
                    return;
                }
                const now = Date.now();
                if (now - _lastHealTime >= _config.settings.healRate) {
                    _helpers.placeItem(_config.items.food.id);
                    _lastHealTime = now;
                    setTimeout(healStep, _config.settings.healRate + Math.floor(Math.random() * 50));
                } else {
                    setTimeout(healStep, 10);
                }
            }
            healStep();
        },
        startTrapLoop: () => {
            if (_intervalIds.trap) clearInterval(_intervalIds.trap);
            _intervalIds.trap = setInterval(() => {
                if (_helpers.canPerformAction() && _config.settings.autoTrapEnabled) {
                    _helpers.placeItem(_config.items.trap.id);
                }
            }, _config.settings.trapInterval + Math.floor(Math.random() * 50));
        },
        startAutoPlacer: () => {
            if (_intervalIds.autoPlacer) clearInterval(_intervalIds.autoPlacer);
            _autoPlacerActive = true;
            _autoPlacerAngle = 0;

            _intervalIds.autoPlacer = setInterval(() => {
                if (!_helpers.canPerformAction() || !_config.settings.autoPlacerEnabled) {
                    return;
                }

                // Incrementar el ángulo para simular el giro
                _autoPlacerAngle = (_autoPlacerAngle + 30) % 360;
                _helpers.sendAngle(_autoPlacerAngle);

                // Place a trap
                _helpers.placeItem(_config.items.spike.id);

                // Actualizar información de debug
                const placerInfo = document.getElementById("placer-info");
                if (placerInfo) placerInfo.textContent = `Auto Placer: ${_autoPlacerAngle}° (Trampa)`;

            }, _config.settings.autoPlacerInterval);
        },
        stopAutoPlacer: () => {
            if (_intervalIds.autoPlacer) {
                clearInterval(_intervalIds.autoPlacer);
                _autoPlacerActive = false;
            }
        },
        sendMessage: (message) => {
	if (!_gameSocket) return;
	const msg = new TextEncoder().encode(message);
	_gameSocket.send(new Uint8Array([7, ...msg]));
        },
        simulateEnter: () => {
            _helpers.pressKey('Enter');
        },
        startAutoChat: () => {
            if (_intervalIds.autoChat) clearInterval(_intervalIds.autoChat);
            _autoChatActive = true;
            let chatIndex = 0;

            _intervalIds.autoChat = setInterval(() => {
                if (!_helpers.canPerformAction() || !_config.settings.autoChatEnabled) {
                    return;
                }

                const message = _config.chatMessages[chatIndex % _config.chatMessages.length];

                // Simulate pressing Enter, typing the message, and pressing Enter again
                _helpers.simulateEnter();
                setTimeout(() => {
                    // Use the direct message sending to bypass chat input
                    _helpers.sendMessage(message);
                    setTimeout(() => {
                        _helpers.simulateEnter();
                    }, 100); // Small delay after sending the message
                }, 100); // Small delay before sending the message
                chatIndex++;
            }, _config.settings.autoChatInterval);
        },
        stopAutoChat: () => {
            if (_intervalIds.autoChat) {
                clearInterval(_intervalIds.autoChat);
                _autoChatActive = false;
            }
        }

    };

    function _setupMouseTracking() {
        document.addEventListener('mousemove', function (event) {
            const canvas = document.getElementById("game-canvas");
            if (!canvas) return;
            const centerX = canvas.clientWidth / 2;
            const centerY = canvas.clientHeight / 2;
            _mouseAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
        });
    }

    function _setupHealthTracking() {
        const _origFillRect = CanvasRenderingContext2D.prototype.fillRect;
        CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
            _origFillRect.call(this, x, y, width, height);
            if (_helpers.isIngame() && this.fillStyle === "#a4cc4f") {
                const prevHealth = _healthValue;
                _healthValue = Math.round(width + 5);
                if (_config.settings.aiHealEnabled && _healthValue < _config.settings.healThreshold && _healthValue > 0 && !_healingInProgress) {
                    _helpers.startAIHealing();
                }
                if (prevHealth > 70 && _healthValue < 30 && !_healingInProgress) {
                    _helpers.startAIHealing();
                }
                const label = document.getElementById("vida-actual");
                if (label) label.textContent = `Vida: ${_healthValue}`;
            }
        };
    }

    function _createMenu() {
        const menu = document.createElement("div");
        menu.id = "sploop-ai-menu";
        menu.style.position = "absolute";
        menu.style.top = "10px";
        menu.style.right = "10px";
        menu.style.zIndex = "9999";
        menu.style.background = "rgba(0,0,0,0.8)";
        menu.style.color = "white";
        menu.style.padding = "10px";
        menu.style.borderRadius = "8px";
        menu.style.display = "none";
        menu.style.fontFamily = "Arial, sans-serif";

        const toggle = (label, settingKey, callback) => {
            const btn = document.createElement("button");
            const update = () => {
                btn.innerText = `${label}: ${_config.settings[settingKey] ? "ON" : "OFF"}`;
                btn.style.background = _config.settings[settingKey] ? "#4CAF50" : "#F44336";
            };
            btn.onclick = () => {
                _config.settings[settingKey] = !_config.settings[settingKey];
                update();
                if (callback) callback(_config.settings[settingKey]);
            };
            update();
            btn.style.margin = "5px";
            menu.appendChild(btn);
        };

        toggle("Curación inteligente", "aiHealEnabled");
        toggle("Auto trampas", "autoTrapEnabled", (enabled) => {
            if (enabled) _helpers.startTrapLoop();
            else clearInterval(_intervalIds.trap);
        });

        // Nuevo botón para Auto Placer
        toggle("Auto Spin (Bow)", "autoPlacerEnabled", (enabled) => {
            if (enabled) _helpers.startAutoPlacer();
            else _helpers.stopAutoPlacer();
        });

        // Auto Chat Toggle
        toggle("Auto Chat (Calvos Rap)", "autoChatEnabled", (enabled) => {
            if (enabled) _helpers.startAutoChat();
            else _helpers.stopAutoChat();
        });

        const sliders = [
            { label: "Curar debajo de", key: "healThreshold", min: 10, max: 100 },
            { label: "Velocidad curación (ms)", key: "healRate", min: 10, max: 500 },
            { label: "Trampas cada (ms)", key: "trapInterval", min: 100, max: 5000 },
            { label: "Velocidad Auto Spin (ms)", key: "autoPlacerInterval", min: 100, max: 2000 },
            { label: "Velocidad Auto Chat (ms)", key: "autoChatInterval", min: 1000, max: 30000 }
        ];

        sliders.forEach(s => {
            const label = document.createElement("label");
            label.innerText = `${s.label}: ${_config.settings[s.key]}`;
            label.style.display = "block";

            const input = document.createElement("input");
            input.type = "range";
            input.min = s.min;
            input.max = s.max;
            input.value = _config.settings[s.key];
            input.oninput = () => {
                _config.settings[s.key] = parseInt(input.value);
                label.innerText = `${s.label}: ${input.value}`;
                if (s.key === "trapInterval") _helpers.startTrapLoop();
                if (s.key === "autoPlacerInterval" && _autoPlacerActive) {
                    _helpers.stopAutoPlacer();
                    _helpers.startAutoPlacer();
                }
                if (s.key === "autoChatInterval" && _autoChatActive) {
                    _helpers.stopAutoChat();
                    _helpers.startAutoChat();
                }
            };

            menu.appendChild(label);
            menu.appendChild(input);
        });

        const healthLabel = document.createElement("div");
        healthLabel.id = "vida-actual";
        healthLabel.innerText = `Vida: ${_healthValue}`;
        healthLabel.style.marginTop = "10px";
        healthLabel.style.fontWeight = "bold";
        menu.appendChild(healthLabel);

        // Añadir información de depuración para ver el arma actual
        const debugInfo = document.createElement("div");
        debugInfo.id = "debug-info";
        debugInfo.innerText = `Última arma: ${_lastWeaponSlot}`;
        debugInfo.style.marginTop = "5px";
        debugInfo.style.fontSize = "12px";
        menu.appendChild(debugInfo);

        // Añadir información del auto placer
        const placerInfo = document.createElement("div");
        placerInfo.id = "placer-info";
        placerInfo.innerText = `Auto Placer: inactivo`;
        placerInfo.style.marginTop = "5px";
        placerInfo.style.fontSize = "12px";
        menu.appendChild(placerInfo);

        document.body.appendChild(menu);

        document.addEventListener("keydown", (e) => {
            if (e.code === "Escape") {
                menu.style.display = menu.style.display === "none" ? "block" : "none";
            }
        });
    }

    function _initialize() {
        _setupMouseTracking();
        _setupHealthTracking();
        _helpers.startTrapLoop();
        const check = setInterval(() => {
            if (document.getElementById("game-canvas")) {
                clearInterval(check);
                setTimeout(_createMenu, 1000);
            }
        }, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", _initialize);
    } else {
        _initialize();
    }
})();

