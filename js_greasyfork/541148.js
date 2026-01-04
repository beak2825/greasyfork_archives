// ==UserScript==
// @name         Skin.club Battle Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Trackea ganancias/pérdidas en batallas de cajas de skin.club
// @author       You
// @match        https://skin.club/*
// @match        https://*.skin.club/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541148/Skinclub%20Battle%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/541148/Skinclub%20Battle%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuración del script
    const config = {
        myUsername: 'EvasorFiscal', // Tu nombre de usuario en Skin.club
        maxRetries: 5, // Máximo de reintentos para la detección inicial
        detectionTimeout: 10000, // Tiempo máximo para esperar un elemento en el DOM
        updateInterval: 2000, // Frecuencia de actualización de totales (ms)
        redetectionInterval: 10000, // Frecuencia de re-validación de modos (ms)
        selectors: {
            battleSlot: '.battle-slot',
            currencyText: '.currency-text',
            teamBattle: '.battle-slots.is-team-battle',
            sharingMode: '[data-mode="sharing"], .sharing-mode', // Selectores para modo compartido
            userIndicator: '.user-indicator, .current-player, [data-current-user="true"]' // Indicadores de usuario
        }
    };

    // Variables de estado
    let myScore = 0; // Mi total de ganancias/pérdidas
    let opponents = {}; // Totales de oponentes (y compañero en modo equipo)
    let myBattleSlot = null;
    let trackerElement = null;
    let processedItems = new Set(); // Para evitar contar items duplicados (HACK: A veces los items se duplican en el DOM)
    let currentMode = 'classic'; // classic, team, sharing
    let totalPlayers = 0;
    let mySlotPosition = null; // 1, 2, 3, 4
    let myTeam = null; // 'ct' o 'terrorist'
    let teammateSlotPosition = null;
    let isObserverMode = false; // Indica si estamos observando una batalla de randoms
    let detectionStatus = { // Estado de las detecciones iniciales
        mode: false,
        mySlot: false,
        teamInfo: false
    };
    let retryAttempt = 0; // Contador de reintentos para la inicialización

    // --- Funciones de Utilidad ---

    // awaitFor: Espera a que un elemento aparezca en el DOM.
    // Un pequeño truco para recordar que es asíncrono y que a veces el DOM de Skin.club es lento.
    async function awaitFor(selector, timeout = config.detectionTimeout) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);
            
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // extractValue: Extrae el valor numérico de una skin de su elemento HTML.
    // Que la fuerza me acompañe con esta expresión regular.
    function extractValue(element) {
        const currencyElement = element.querySelector(config.selectors.currencyText);
        if (currencyElement) {
            const text = currencyElement.textContent || currencyElement.innerText;
            const match = text.match(/\$?([\d,]+\.?\d*)/);
            if (match) {
                return parseFloat(match[1].replace(',', ''));
            }
        }
        return 0;
    }

    // --- Funciones de Interfaz (Tracker) ---

    // createTracker: Crea el elemento visual del tracker en la página.
    // Es la base de nuestra interfaz, ¡sin esto no hay tracker!
    function createTracker() {
        trackerElement = document.createElement('div');
        trackerElement.id = 'battle-tracker';
        trackerElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            min-width: 200px;
            border: 2px solid #333;
        `;
        document.body.appendChild(trackerElement);
        updateTrackerDisplay(); // Actualiza el contenido inicial
    }

    // updateTrackerDisplay: Actualiza el contenido del tracker con los datos actuales.
    // Aquí es donde se ve la magia, mostrando los totales y el estado de la batalla.
    function updateTrackerDisplay() {
        if (!trackerElement) return;

        const status = getBattleStatus();

        let modeDisplay = '';
        if (isObserverMode) {
            modeDisplay = '👁️ MODO OBSERVADOR';
        } else {
            switch (currentMode) {
                case 'team':
                    const teamName = myTeam === 'ct' ? 'CT' : 'T';
                    modeDisplay = `🤝 EQUIPO ${teamName} (Slot ${mySlotPosition})`;
                    break;
                case 'sharing':
                    modeDisplay = '🤝 MODO COMPARTIDO';
                    break;
                default:
                    modeDisplay = '⚔️ MODO CLÁSICO';
            }
        }

        let detailsInfo = '';
        if (isObserverMode) {
            // En modo observador, mostrar todos los jugadores
            Object.keys(opponents).forEach((key) => {
                detailsInfo += `<div>Jugador ${key.replace('slot_', '')}: $${opponents[key].toFixed(2)}</div>`;
            });
        } else if (currentMode === 'team') {
            const teammateScore = opponents['teammate'] || 0;
            detailsInfo = `<div>Compañero: $${teammateScore.toFixed(2)}</div>`;
            
            // Mostrar enemigos
            Object.keys(opponents).forEach(key => {
                if (key !== 'teammate') {
                    detailsInfo += `<div>Enemigo ${key.replace('slot_', '')}: $${opponents[key].toFixed(2)}</div>`;
                }
            });
        } else {
            Object.keys(opponents).forEach((key, index) => {
                detailsInfo += `<div>Oponente ${index + 1}: $${opponents[key].toFixed(2)}</div>`;
            });
        }

        const myScoreDisplay = isObserverMode ? 'Observando' : `$${myScore.toFixed(2)}`;

        trackerElement.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <strong>BATTLE TRACKER</strong><br>
                <small>${modeDisplay}</small>
            </div>
            <div>Tu total: ${myScoreDisplay}</div>
            ${detailsInfo}
            <hr style="margin: 10px 0; border-color: #555;">
            <div style="text-align: center; font-weight: bold;">
                ${status}
            </div>
        `;
    }

    // --- Funciones de Detección ---

    // detectGameMode: Detecta el modo de juego actual (clásico, equipo, compartido).
    // El PORQUÉ: Skin.club no tiene una API clara, así que hay que inferir el modo del DOM.
    async function detectGameMode() {
        try {
            // Esperar a que los battle-slots estén disponibles. Es la señal más fiable de que la batalla ha cargado.
            await awaitFor(config.selectors.battleSlot, 5000);
            
            const battleSlots = document.querySelectorAll(config.selectors.battleSlot);
            totalPlayers = battleSlots.length;
            
            if (totalPlayers === 0) {
                console.warn('No se encontraron battle-slots, reintentando...');
                detectionStatus.mode = false;
                return 'classic'; // Fallback por si acaso
            }
            
            const bodyText = document.body.textContent.toLowerCase();
            
            // Detección de modo equipo: busca palabras clave, clases CSS específicas y 4 jugadores
            const hasTeamKeywords = bodyText.includes('counter-terrorist') || bodyText.includes('terrorist');
            const isTeamBattleClass = document.querySelector(config.selectors.teamBattle) !== null;
            const hasFourSlots = totalPlayers === 4;
            
            // Detección de modo compartido: busca palabras clave o selectores específicos
            const hasSharingKeywords = bodyText.includes('sharing') || bodyText.includes('shared') || bodyText.includes('split');
            const hasSharingIndicator = document.querySelector(config.selectors.sharingMode) !== null;
            
            // Determinar modo con prioridad (equipo > compartido > clásico)
            if ((hasTeamKeywords || isTeamBattleClass) && hasFourSlots) {
                currentMode = 'team';
                console.log('✅ Modo TEAM detectado - Indicadores:', {
                    teamKeywords: hasTeamKeywords,
                    teamBattleClass: isTeamBattleClass,
                    fourSlots: hasFourSlots
                });
                await detectTeamInfo();
            } else if (hasSharingKeywords || hasSharingIndicator) {
                currentMode = 'sharing';
                console.log('✅ Modo SHARING detectado - Indicadores:', {
                    sharingKeywords: hasSharingKeywords,
                    sharingIndicator: hasSharingIndicator
                });
            } else {
                currentMode = 'classic';
                console.log('✅ Modo CLASSIC detectado por eliminación');
            }
            
            detectionStatus.mode = true;
            console.log(`Modo final: ${currentMode}, Jugadores: ${totalPlayers}`);
            
            if (currentMode === 'team') {
                console.log(`Mi equipo: ${myTeam}, Posición: ${mySlotPosition}, Compañero: ${teammateSlotPosition}`);
            }
            
            return currentMode;
            
        } catch (error) {
            console.error('❌ Error detectando modo de juego:', error);
            detectionStatus.mode = false;
            return 'classic'; // Fallback
        }
    }

    // detectTeamInfo: Detecta la información del equipo (CT/T y compañero) solo para modo team.
    // El PORQUÉ: Necesitamos saber quién es nuestro compañero para sumar los totales correctamente.
    async function detectTeamInfo() {
        // HACK: Esto solo funciona si myBattleSlot ya fue detectado.
        if (!myBattleSlot) {
            console.warn('No se puede detectar info del equipo: myBattleSlot no encontrado');
            detectionStatus.teamInfo = false;
            return;
        }
        
        try {
            const allSlots = document.querySelectorAll(config.selectors.battleSlot);
            // Encontrar la posición de mi slot (1, 2, 3, 4)
            for (let i = 0; i < allSlots.length; i++) {
                if (allSlots[i] === myBattleSlot) {
                    mySlotPosition = i + 1; // 1-indexed
                    break;
                }
            }
            
            if (!mySlotPosition) {
                console.error('No se pudo determinar la posición del slot');
                detectionStatus.teamInfo = false;
                return;
            }
            
            // Determinar equipo y compañero basado en posición (FIXME: Esto asume un layout fijo, podría romperse si Skin.club cambia el orden)
            if (mySlotPosition === 1 || mySlotPosition === 2) {
                myTeam = 'ct'; // Counter-Terrorist (primeros slots)
                teammateSlotPosition = mySlotPosition === 1 ? 2 : 1;
            } else if (mySlotPosition === 3 || mySlotPosition === 4) {
                myTeam = 'terrorist'; // Terrorist (últimos slots)
                teammateSlotPosition = mySlotPosition === 3 ? 4 : 3;
            }
            
            detectionStatus.teamInfo = true;
            console.log('✅ Info del equipo detectada:', {
                mySlotPosition,
                myTeam,
                teammateSlotPosition
            });
            
        } catch (error) {
            console.error('❌ Error detectando info del equipo:', error);
            detectionStatus.teamInfo = false;
        }
    }

    // findMyBattleSlot: Encuentra el battle-slot que pertenece al usuario actual.
    // El PORQUÉ: Necesitamos saber cuál es nuestro slot para calcular nuestras ganancias.
    async function findMyBattleSlot() {
        try {
            // Esperar a que los battle-slots estén disponibles
            await awaitFor(config.selectors.battleSlot, 5000);
            
            const battleSlots = document.querySelectorAll(config.selectors.battleSlot);
            
            // Método 1: Buscar por nombre de usuario (el más fiable si el nombre es único)
            for (let slot of battleSlots) {
                if (slot.textContent.includes(config.myUsername)) {
                    myBattleSlot = slot;
                    isObserverMode = false;
                    detectionStatus.mySlot = true;
                    console.log('✅ Mi battle-slot encontrado por nombre:', slot);
                    return slot;
                }
            }
            
            // Método 2: Buscar por clases CSS que indiquen slot activo/propio (si el sitio las usa)
            const activeSlot = document.querySelector(config.selectors.userIndicator);
            
            if (activeSlot) {
                myBattleSlot = activeSlot.closest(config.selectors.battleSlot); // Asegurarse de obtener el slot padre
                if (myBattleSlot) {
                    isObserverMode = false;
                    detectionStatus.mySlot = true;
                    console.log('✅ Mi battle-slot encontrado por clase CSS:', myBattleSlot);
                    return myBattleSlot;
                }
            }
            
            // Si no se encuentra EvasorFiscal ni indicadores de usuario, significa que estamos observando una batalla de randoms
            console.log('👁️ EvasorFiscal no encontrado - Activando modo observador');
            isObserverMode = true;
            detectionStatus.mySlot = true; // Marcar como válido para modo observador
            myBattleSlot = null; // No hay slot propio en modo observador
            return 'observer'; // Retornar string para indicar modo observador
            
        } catch (error) {
            console.error('❌ Error buscando mi battle-slot:', error);
            detectionStatus.mySlot = false;
            return null;
        }
    }

    // --- Lógica de Juego y Cálculos ---

    // getBattleStatus: Calcula el resultado de la batalla según el modo de juego.
    // El PORQUÉ: Esto es lo que le dice al usuario si está ganando o perdiendo.
    function getBattleStatus() {
        let status = '';
        
        // Si estamos en modo observador, mostrar estadísticas generales
        if (isObserverMode) {
            const allTotals = Object.values(opponents);
            if (allTotals.length > 0) {
                const maxTotal = Math.max(...allTotals);
                // const minTotal = Math.min(...allTotals); // No usado, pero podría ser útil
                const totalSum = allTotals.reduce((a, b) => a + b, 0);
                
                // Encontrar quién está ganando
                const winningSlot = Object.keys(opponents).find(key => opponents[key] === maxTotal);
                const winningPlayer = winningSlot ? winningSlot.replace('slot_', '') : '?';
                
                status = `<span style="color: #00BCD4;">OBSERVANDO BATALLA</span><br>`;
                status += `Líder: Jugador ${winningPlayer} ($${maxTotal.toFixed(2)})<br>`;
                status += `Total acumulado: $${totalSum.toFixed(2)}`;
            } else {
                status = `<span style="color: #FFC107;">ESPERANDO DATOS...</span>`;
            }
            return status;
        }
        
        switch (currentMode) {
            case 'sharing':
                // En sharing mode, todo se suma y se divide entre todos
                const totalValue = myScore + Object.values(opponents).reduce((a, b) => a + b, 0);
                const sharePerPlayer = totalValue / totalPlayers;
                status = `<span style="color: #FFC107;">SHARING MODE</span><br>Total: $${totalValue.toFixed(2)}<br>Tu parte: $${sharePerPlayer.toFixed(2)}`;
                break;
                
            case 'team':
                // En modo equipo, sumar mi total + compañero vs enemigos
                const teammateScore = opponents['teammate'] || 0;
                const myTeamScore = myScore + teammateScore;
                
                // Sumar totales de equipos enemigos (excluyendo compañero)
                const enemyTeamScore = Object.keys(opponents)
                    .filter(key => key !== 'teammate')
                    .reduce((sum, key) => sum + opponents[key], 0);
                
                const difference = myTeamScore - enemyTeamScore;
                const teamName = myTeam === 'ct' ? 'CT' : 'T';
                
                if (difference > 0) {
                    status = `<span style="color: #4CAF50;">EQUIPO ${teamName} GANANDO +$${difference.toFixed(2)}</span><br>Tu equipo: $${myTeamScore.toFixed(2)} | Enemigos: $${enemyTeamScore.toFixed(2)}`;
                } else if (difference < 0) {
                    status = `<span style="color: #F44336;">EQUIPO ${teamName} PERDIENDO $${Math.abs(difference).toFixed(2)}</span><br>Tu equipo: $${myTeamScore.toFixed(2)} | Enemigos: $${enemyTeamScore.toFixed(2)}`;
                } else {
                    status = `<span style="color: #FFC107;">EQUIPOS EMPATADOS</span><br>Ambos equipos: $${myTeamScore.toFixed(2)}`;
                }
                break;
                
            default: // classic
                const maxOpponent = Math.max(...Object.values(opponents), 0);
                const classicDifference = myScore - maxOpponent;
                
                if (classicDifference > 0) {
                    status = `<span style="color: #4CAF50;">GANANDO +$${classicDifference.toFixed(2)}</span>`;
                } else if (classicDifference < 0) {
                    status = `<span style="color: #F44336;">PERDIENDO $${Math.abs(classicDifference).toFixed(2)}</span>`;
                } else {
                    status = `<span style="color: #FFC107;">EMPATE</span>`;
                }
                break;
        }
        
        return status;
    }

    // calculateTotals: Calcula los totales actuales revisando todos los items de skin.
    // El PORQUÉ: Recorre todos los slots y suma el valor de los items para cada jugador.
    function calculateTotals() {
        const battleSlotAsides = document.querySelectorAll('.battle-slot__aside');
        let newMyScore = 0;
        let newOpponents = {};
        let teammateScore = 0;
        
        battleSlotAsides.forEach((aside) => {
            const inventoryDrops = aside.querySelectorAll('.battle-inventory-drop');
            let slotScore = 0;
            
            inventoryDrops.forEach(drop => {
                const value = extractValue(drop);
                slotScore += value;
            });
            
            // Determinar si este aside pertenece al jugador, compañero o oponente
            const parentBattleSlot = aside.closest(config.selectors.battleSlot);
            const allSlots = document.querySelectorAll(config.selectors.battleSlot);
            let slotPosition = -1;
            
            // Encontrar posición del slot actual
            for (let i = 0; i < allSlots.length; i++) {
                if (allSlots[i] === parentBattleSlot) {
                    slotPosition = i + 1;
                    break;
                }
            }
            
            if (parentBattleSlot && parentBattleSlot.textContent.includes(config.myUsername)) {
                newMyScore = slotScore;
            } else if (currentMode === 'team' && slotPosition === teammateSlotPosition) {
                teammateScore = slotScore;
            } else {
                newOpponents[`slot_${slotPosition}`] = slotScore;
            }
        });
        
        // Para modo equipo, agregar el total del compañero
        if (currentMode === 'team') {
            newOpponents['teammate'] = teammateScore;
        }
        
        // Solo actualizar si hay cambios (para evitar re-renders innecesarios)
        if (newMyScore !== myScore || JSON.stringify(newOpponents) !== JSON.stringify(opponents)) {
            myScore = newMyScore;
            opponents = newOpponents;
            console.log('Totales actualizados - Yo:', myScore, 'Oponentes:', opponents);
            updateTrackerDisplay();
        }
    }

    // observeChanges: Observa cambios en el DOM para detectar nuevas skins.
    // El PORQUÉ: Es la señal más fiable de que nuevos items han aparecido en la batalla.
    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldRecalculate = false;
            
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        // Detectar si se agregó un battle-inventory-drop
                        if (node.classList && node.classList.contains('battle-inventory-drop')) {
                            shouldRecalculate = true;
                        }
                        // O si se agregó un contenedor que podría contener battle-inventory-drop
                        else if (node.querySelector && node.querySelector('.battle-inventory-drop')) {
                            shouldRecalculate = true;
                        }
                    }
                });
            });
            
            if (shouldRecalculate) {
                // HACK: Pequeño delay para asegurar que el DOM se haya actualizado completamente antes de calcular.
                // A veces, el total no se actualiza en batallas muy rápidas. ¿Necesita un delay? Sí, lo necesita.
                setTimeout(calculateTotals, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // --- Funciones de Control ---

    // resetTracker: Resetea el tracker a su estado inicial.
    // Útil para cuando la batalla termina o para empezar de nuevo.
    function resetTracker() {
        myScore = 0;
        opponents = {};
        processedItems.clear();
        updateTrackerDisplay();
        console.log('Tracker reseteado.');
    }

    // addResetButton: Agrega un botón de reset al DOM.
    // Un pequeño extra para la comodidad del usuario.
    function addResetButton() {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 240px;
            background: #F44336;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10001;
            font-size: 12px;
        `;
        resetBtn.onclick = resetTracker;
        document.body.appendChild(resetBtn);
    }

    // retryWithBackoff: Sistema de reintentos con backoff exponencial para inicialización robusta.
    // El PORQUÉ: A veces la página tarda en cargar, así que reintentamos con un poco de paciencia.
    async function retryWithBackoff(fn, maxRetries = config.maxRetries, baseDelay = 1000) {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const result = await fn();
                if (result) return result;
            } catch (error) {
                console.warn(`Intento ${attempt + 1} falló:`, error.message);
            }
            
            if (attempt < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`Reintentando en ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        return null;
    }

    // validateDetections: Valida que todas las detecciones críticas estén completas.
    // El PORQUÉ: Para saber si el tracker está funcionando al 100% o si hay algo raro.
    function validateDetections() {
        const isValid = detectionStatus.mode && detectionStatus.mySlot;
        
        if (currentMode === 'team') {
            return isValid && detectionStatus.teamInfo;
        }
        
        return isValid;
    }

    // updateTrackerWithStatus: Muestra el estado de detección en el tracker (para debugging visual).
    // El PORQUÉ: Así podemos ver rápidamente si el script detectó todo bien.
    function updateTrackerWithStatus() {
        if (!trackerElement) return;
        
        let statusIndicators = '';
        statusIndicators += detectionStatus.mode ? '✅' : '❌';
        statusIndicators += ' Modo | ';
        statusIndicators += detectionStatus.mySlot ? '✅' : '❌';
        statusIndicators += ' Slot';
        
        if (currentMode === 'team') {
            statusIndicators += ' | ';
            statusIndicators += detectionStatus.teamInfo ? '✅' : '❌';
            statusIndicators += ' Equipo';
        }
        
        // Agregar indicador de estado al tracker
        const statusDiv = `<div style="font-size: 10px; color: #888; margin-bottom: 5px;">${statusIndicators}</div>`;
        
        // Actualizar el tracker normal y agregar el estado
        updateTrackerDisplay();
        if (trackerElement) {
            trackerElement.innerHTML = statusDiv + trackerElement.innerHTML;
        }
    }

    // init: Inicialización principal del script.
    // El PORQUÉ: Aquí es donde empieza toda la magia.
    async function init() {
        console.log('🚀 Iniciando Battle Tracker...');
        
        try {
            // Paso 1: Detectar modo de juego
            console.log('📊 Detectando modo de juego...');
            await retryWithBackoff(detectGameMode);
            
            // Paso 2: Encontrar mi slot
            console.log('🔍 Buscando mi battle-slot...');
            await retryWithBackoff(findMyBattleSlot);
            
            // Paso 3: Si es modo team y no estamos en modo observador, detectar info del equipo
            if (currentMode === 'team' && myBattleSlot && !isObserverMode) {
                console.log('👥 Detectando información del equipo...');
                await retryWithBackoff(() => detectTeamInfo());
            }
            
            // Paso 4: Crear interfaz
            console.log('🎨 Creando interfaz...');
            createTracker();
            addResetButton();
            
            // Paso 5: Iniciar observadores
            console.log('👀 Iniciando observadores...');
            observeChanges();
            
            // Paso 6: Calcular totales iniciales
            console.log('💰 Calculando totales iniciales...');
            calculateTotals();
            
            // Validar que todo esté funcionando
            const isValid = validateDetections();
            
            if (isValid) {
                console.log('✅ Battle Tracker inicializado correctamente');
                console.log('Estado final:', {
                    currentMode,
                    totalPlayers,
                    mySlotPosition,
                    myTeam,
                    teammateSlotPosition,
                    isObserverMode
                });
            } else {
                console.warn('⚠️ Battle Tracker inicializado con problemas de detección');
                console.log('Estado de detecciones:', detectionStatus);
            }
            
            // Actualizar tracker con indicadores de estado
            updateTrackerWithStatus();
            
            // Configurar intervalos de actualización
            setInterval(() => {
                calculateTotals();
                updateTrackerWithStatus();
            }, config.updateInterval);
            
            // Re-validar detecciones cada X segundos (FIXME: Esto puede causar re-inicializaciones innecesarias)
            setInterval(async () => {
                if (!validateDetections()) {
                    console.log('🔄 Re-validando detecciones...');
                    retryAttempt++;
                    
                    if (retryAttempt < config.maxRetries) {
                        await init(); // Re-inicializar si hay problemas
                    } else {
                        console.error('❌ Máximo de reintentos alcanzado para re-validación');
                    }
                }
            }, config.redetectionInterval);
            
        } catch (error) {
            console.error('❌ Error durante la inicialización:', error);
            // Crear tracker básico aunque haya errores para que el usuario sepa que algo pasó
            if (!trackerElement) {
                createTracker();
                addResetButton();
            }
        }
    }

    // Iniciar cuando la página esté lista
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 1000); // Pequeño delay para asegurar que el DOM esté listo
        });
    } else {
        setTimeout(init, 1000); // Pequeño delay para asegurar que el DOM esté listo
    }

})();
