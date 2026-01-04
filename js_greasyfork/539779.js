// ==UserScript==
// @name         Ranking And Evolution for Drawaria
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Añade rangos visuales dinámicos, barra de XP al dibujar y notificaciones de nivel, para un video más inmersivo de Drawaria.online.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/539779/Ranking%20And%20Evolution%20for%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/539779/Ranking%20And%20Evolution%20for%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuración de Idioma ---
    const translations = {
        es: {
            legend: "⚜️ Leyenda",
            master: "🔥 Maestro",
            expert: "⭐ Experto",
            apprentice: "🎭 Aprendiz",
            player: "👤 Jugador",
            xp_bar_label: "XP: {current} / {next} (Nivel {level})",
            level_up_message: "¡Subida de Nivel! Nivel {level}"
        },
        en: {
            legend: "⚜️ Legend",
            master: "🔥 Master",
            expert: "⭐ Expert",
            apprentice: "🎭 Apprentice",
            player: "👤 Player",
            xp_bar_label: "XP: {current} / {next} (Level {level})",
            level_up_message: "Level Up! Level {level}"
        },
        ru: {
            legend: "⚜️ Легенда",
            master: "🔥 Мастер",
            expert: "⭐ Эксперт",
            apprentice: "🎭 Ученик",
            player: "👤 Игрок",
            xp_bar_label: "Опыт: {current} / {next} (Уровень {level})",
            level_up_message: "Повышение уровня! Уровень {level}"
        }
    };

    const browserLang = (navigator.language || navigator.userLanguage).split('-')[0];
    const lang = translations[browserLang] ? browserLang : 'en'; // Default to English if language not found
    const T = translations[lang];

    // --- 1. ESTRUCTURA DE RANGOS BASE ---
    const RANGOS = [
        { nombre: T.legend,   minPuntos: 6000, color: "#FFD700" }, // Dorado
        { nombre: T.master,    minPuntos: 3000, color: "#E51A4C" }, // Rojo intenso
        { nombre: T.expert,    minPuntos: 1500, color: "#1E90FF" }, // Azul brillante
        { nombre: T.apprentice, color: "#32CD32" }, // Verde
        { nombre: T.player,     minPuntos: 0,    color: "#AAAAAA" }  // Gris
    ].map(r => {
        // Asignar un minPuntos por defecto si no existe (para que el bucle funcione)
        if (r.minPuntos === undefined) r.minPuntos = 0;
        return r;
    });
    // Asegurarnos que el rango más bajo tenga minPuntos: 0
    if (RANGOS[RANGOS.length - 1].minPuntos !== 0) {
        RANGOS.push({ nombre: T.player, minPuntos: 0, color: "#AAAAAA" });
    }

    /**
     * Determina el rango base de un jugador según su puntuación real.
     * @param {number} puntos - La puntuación del jugador.
     * @returns {object} - El objeto del rango correspondiente.
     */
    function obtenerRangoPorPuntosReales(puntos) {
        for (const rango of RANGOS) {
            if (puntos >= rango.minPuntos) {
                return rango;
            }
        }
        return RANGOS[RANGOS.length - 1]; // Jugador
    }

    /**
     * Asigna un rango aleatorio para otros jugadores (para la ilusión del video).
     * @returns {object} - Un objeto de rango aleatorio.
     */
    function obtenerRangoAleatorio() {
        const randomIndex = Math.floor(Math.random() * RANGOS.length);
        return RANGOS[randomIndex];
    }

    /**
     * Actualiza los rangos visuales de todos los jugadores en la UI.
     */
    function actualizarRangosEnUI() {
        const players = document.querySelectorAll('.playerlist-row');
        const selfPlayerNameInput = document.querySelector('#playername');
        // Si el input del nombre del jugador no existe aún, salimos.
        if (!selfPlayerNameInput) return;
        const selfPlayerName = selfPlayerNameInput.value.trim();

        players.forEach(playerRow => {
            // Evita re-procesar si ya tiene un rango asignado en esta carga
            if (playerRow.dataset.rangoAsignado === 'true') {
                return;
            }

            const nameElement = playerRow.querySelector('.playerlist-name');
            if (!nameElement) return;

            const playerName = nameElement.textContent.trim();
            let rangoParaMostrar;

            if (playerName === selfPlayerName) {
                // Para el propio jugador: usa la puntuación real del juego
                const accountScore = parseInt(playerRow.dataset.account_score, 10);
                const roundScore = parseInt(playerRow.dataset.roundscore, 10);
                // Prioriza accountScore, luego roundScore, si ambos son NaN, usa 0.
                const puntuacionReal = !isNaN(accountScore) ? accountScore : (isNaN(roundScore) ? 0 : roundScore);
                rangoParaMostrar = obtenerRangoPorPuntosReales(puntuacionReal);
            } else {
                // Para otros jugadores: asigna un rango aleatorio para la sesión
                // Y lo mantiene fijo.
                if (!playerRow.dataset.randomRankAssigned) {
                    rangoParaMostrar = obtenerRangoAleatorio();
                    // Guarda el rango aleatorio asignado para mantenerlo consistente durante la sesión
                    playerRow.dataset.randomRankAssigned = JSON.stringify(rangoParaMostrar);
                } else {
                    // Si ya se le asignó un rango aleatorio, lo reutiliza
                    rangoParaMostrar = JSON.parse(playerRow.dataset.randomRankAssigned);
                }
            }

            let rankSpan = playerRow.querySelector('.custom-rank-span');
            if (!rankSpan) {
                rankSpan = document.createElement('span');
                rankSpan.className = 'custom-rank-span';
                rankSpan.style.marginRight = '8px';
                rankSpan.style.fontWeight = 'bold';
                // Inserta el span antes del nombre del jugador
                nameElement.prepend(rankSpan);
            }

            rankSpan.textContent = rangoParaMostrar.nombre;
            rankSpan.style.color = rangoParaMostrar.color;
            // Marca la fila como procesada para evitar duplicación y re-procesamiento innecesario
            playerRow.dataset.rangoAsignado = 'true';
        });
    }

    // --- 2. SISTEMA DE XP AL DIBUJAR ---
    let userXP = 0;
    let userSimulatedLevel = 1;
    let xpToNextSimulatedLevel = 100; // XP inicial para el nivel 2
    const XP_MULTIPLIER_PER_LEVEL = 1.1; // Aumenta el XP necesario un 10% por nivel
    const XP_PER_DRAW_SEGMENT = 1; // Cuánta XP se gana por segmento de dibujo

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let drawingXP = 0; // Acumulador de XP en la sesión de dibujo actual para guardado frecuente

    // Cargar XP, nivel y XP para el siguiente nivel desde localStorage
    function loadXPProgress() {
        try {
            const savedXP = localStorage.getItem('drawaria_userXP');
            const savedLevel = localStorage.getItem('drawaria_userLevel');
            const savedXPToNext = localStorage.getItem('drawaria_xpToNext');

            userXP = savedXP !== null ? parseFloat(savedXP) : 0;
            userSimulatedLevel = savedLevel !== null ? parseInt(savedLevel, 10) : 1;
            xpToNextSimulatedLevel = savedXPToNext !== null ? parseFloat(savedXPToNext) : 100;

            // Asegurarse de que los valores sean válidos
            if (isNaN(userXP)) userXP = 0;
            if (isNaN(userSimulatedLevel) || userSimulatedLevel < 1) userSimulatedLevel = 1;
            if (isNaN(xpToNextSimulatedLevel) || xpToNextSimulatedLevel < 100) xpToNextSimulatedLevel = 100;

            console.log(`[DrawariaXP] Progreso cargado: XP=${userXP}, Nivel=${userSimulatedLevel}, Siguiente=${xpToNextSimulatedLevel}`);
        } catch (e) {
            console.error("[DrawariaXP] Error al cargar progreso de XP:", e);
            // Resetear a valores por defecto en caso de error
            userXP = 0;
            userSimulatedLevel = 1;
            xpToNextSimulatedLevel = 100;
        }
    }

    // Guardar XP, nivel y XP para el siguiente nivel en localStorage
    function saveXPProgress() {
        try {
            localStorage.setItem('drawaria_userXP', userXP);
            localStorage.setItem('drawaria_userLevel', userSimulatedLevel);
            localStorage.setItem('drawaria_xpToNext', xpToNextSimulatedLevel);
            // console.log(`[DrawariaXP] Progreso guardado: XP=${userXP}, Nivel=${userSimulatedLevel}, Siguiente=${xpToNextSimulatedLevel}`);
        } catch (e) {
            console.error("[DrawariaXP] Error al guardar progreso de XP:", e);
        }
    }

    // Crear y actualizar la barra de XP
    let xpBarElement;
    let xpFillElement;
    let xpTextElement;

    function createXPBar() {
        xpBarElement = document.createElement('div');
        xpBarElement.id = 'custom-xp-bar';
        xpBarElement.innerHTML = `
            <div id="xp-fill"></div>
            <span id="xp-text"></span>
        `;
        document.body.appendChild(xpBarElement);

        GM_addStyle(`
            #custom-xp-bar {
                position: fixed;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 300px;
                height: 25px;
                background-color: rgba(0, 0, 0, 0.7);
                border-radius: 5px;
                overflow: hidden;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
            #xp-fill {
                height: 100%;
                width: 0%;
                background-color: #4CAF50;
                transition: width 0.2s ease-out;
                position: absolute;
                left: 0;
            }
            #xp-text {
                position: relative;
                color: white;
                font-size: 14px;
                font-weight: bold;
                text-shadow: 1px 1px 2px black;
                z-index: 1;
            }
        `);

        xpFillElement = xpBarElement.querySelector('#xp-fill');
        xpTextElement = xpBarElement.querySelector('#xp-text');
        updateXPBar();
    }

    function updateXPBar() {
        if (!xpFillElement || !xpTextElement) return;

        let percentage = 0;
        if (xpToNextSimulatedLevel > 0) {
            percentage = (userXP / xpToNextSimulatedLevel) * 100;
        }
        if (percentage > 100) percentage = 100; // Cap at 100%

        xpFillElement.style.width = `${percentage}%`;
        xpTextElement.textContent = T.xp_bar_label
            .replace('{current}', Math.floor(userXP))
            .replace('{next}', Math.ceil(xpToNextSimulatedLevel))
            .replace('{level}', userSimulatedLevel);
    }

    // Notificación de "Subida de Nivel"
    function displayLevelUpBadge() {
        const badge = document.createElement('div');
        badge.id = 'level-up-badge';
        badge.textContent = T.level_up_message.replace('{level}', userSimulatedLevel);
        document.body.appendChild(badge);

        GM_addStyle(`
            #level-up-badge {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px 40px;
                background-color: #FF5722; /* Naranja */
                color: white;
                font-size: 28px;
                font-weight: bold;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
                z-index: 10000;
                animation: fadeInOut 3s forwards;
                text-align: center;
                text-shadow: 2px 2px 4px black;
            }
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
            }
        `);

        setTimeout(() => {
            if (badge && badge.parentNode) {
                badge.parentNode.removeChild(badge);
            }
        }, 3000);
    }

    // Detección de dibujo para ganar XP
    function setupDrawingXP() {
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            console.log("[DrawariaXP] Canvas no encontrado. Reintentando...");
            // Espera un poco más antes de reintentar si el canvas aún no está presente
            setTimeout(setupDrawingXP, 1000);
            return;
        }
        console.log("[DrawariaXP] Canvas encontrado, configurando detección de dibujo.");

        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Clic izquierdo
                isDrawing = true;
                lastX = e.clientX;
                lastY = e.clientY;
                drawingXP = 0; // Reiniciar XP de dibujo para esta nueva "sesión"
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                const distanceSquared = dx * dx + dy * dy;

                // Consideramos un segmento de dibujo si se ha movido al menos 10 píxeles
                if (distanceSquared > 100) { // 10^2 = 100
                    userXP += XP_PER_DRAW_SEGMENT;
                    drawingXP += XP_PER_DRAW_SEGMENT; // Acumula XP para el guardado frecuente
                    lastX = e.clientX;
                    lastY = e.clientY;
                    updateXPBar();

                    // Procesar subida de nivel
                    if (userXP >= xpToNextSimulatedLevel) {
                        displayLevelUpBadge();
                        userSimulatedLevel++;
                        // Opcional: Restar la XP necesaria para el nivel anterior si quieres que la XP "sobrante" cuente.
                        // userXP -= xpToNextSimulatedLevel;
                        // Si prefieres resetear XP al 0 al subir de nivel:
                        userXP = 0; // Resetea la XP al cero

                        xpToNextSimulatedLevel = Math.floor(xpToNextSimulatedLevel * XP_MULTIPLIER_PER_LEVEL);
                        // Asegurarse de que la próxima meta de XP sea al menos un poco mayor
                        if (xpToNextSimulatedLevel <= 100) xpToNextSimulatedLevel = 100;

                        updateXPBar(); // Actualiza la barra para reflejar el nuevo nivel
                    }

                    // Guardar progreso cada 10 XP acumuladas en esta sesión de dibujo
                    if (drawingXP >= 10) {
                        saveXPProgress();
                        drawingXP = 0; // Reiniciar contador de guardado
                    }
                }
            }
        });

        canvas.addEventListener('mouseup', () => {
            if (isDrawing) {
                isDrawing = false;
                saveXPProgress(); // Guardar al soltar el botón del ratón
            }
        });

        // Manejo para cuando el usuario sale de la página o la pierde
        window.addEventListener('beforeunload', saveXPProgress);
        window.addEventListener('blur', () => {
            if (isDrawing) {
                isDrawing = false;
                saveXPProgress();
            }
        });
    }


    // --- 3. OBSERVADOR DE CAMBIOS EN LA UI ---
    // Vigila la lista de jugadores para detectar nuevas incorporaciones.
    const playerListContainer = document.getElementById('playerlist');

    if (playerListContainer) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Cuando se añaden nodos a la lista de jugadores...
                    mutation.addedNodes.forEach(node => {
                        // Asegurarse de que es un elemento de fila de jugador y resetear su flag de procesamiento
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('playerlist-row')) {
                            node.dataset.rangoAsignado = 'false';
                        }
                    });
                    // Re-actualizar todos los rangos después de cualquier cambio en la lista
                    actualizarRangosEnUI();
                    break; // Salir del bucle de mutaciones una vez procesado
                }
            }
        });

        // Observar adiciones y eliminaciones de nodos hijos dentro del contenedor de la lista de jugadores
        observer.observe(playerListContainer, { childList: true });
    } else {
        console.log("[DrawariaRank] Contenedor de lista de jugadores no encontrado. Reintentando en 2 segundos.");
        setTimeout(() => {
            if (!playerListContainer) {
                console.error("[DrawariaRank] Contenedor de lista de jugadores no encontrado. El script de rangos no funcionará.");
            }
        }, 2000);
    }

    // --- Inicialización ---
    // Esperar a que el contenido principal de Drawaria esté cargado
    // El evento 'load' puede ser un poco tardío si el script se inyecta pronto.
    // Usaremos un setTimeout o un MutationObserver más específico si es necesario.
    // Por ahora, un setTimeout al 'load' es una buena aproximación.
    window.addEventListener('load', () => {
        // Usamos un pequeño retraso para asegurar que los elementos del juego estén disponibles
        // y para no interferir con la carga inicial del juego.
        setTimeout(() => {
            loadXPProgress();
            createXPBar();
            setupDrawingXP();
            actualizarRangosEnUI(); // Actualizar rangos al cargar la página
            updateXPBar(); // Asegura que la barra de XP se muestre correctamente al inicio

            // Además, podemos observar cambios en los atributos de los jugadores que puedan afectar sus puntuaciones
            // o la lista misma, pero MutationObserver en childList ya cubre la adición/eliminación.
            // Si las puntuaciones se actualizan dinámicamente sin recargar la fila, sería necesario
            // observar atributos o usar una técnica diferente. Por ahora, asumimos que la fila se actualiza.

        }, 2000); // Un retraso de 2 segundos para dar tiempo a que el juego cargue sus elementos.
    });

})();