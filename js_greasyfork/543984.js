// ==UserScript==
// @name         Mestre das Masmorras
// @namespace    http://tampermonkey.net/
// @version      17.1
// @description  Faz as masmorras de fantasia automaticamente.
// @author       Popper
// @match        *://*.popmundo.com/World/Popmundo.aspx/Locale*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/543984/Mestre%20das%20Masmorras.user.js
// @updateURL https://update.greasyfork.org/scripts/543984/Mestre%20das%20Masmorras.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // --- VARIÁVEIS GLOBAIS ---
    let actionIntervalId = null;
    let countdownTimerId = null;
    let isWaitingAfterAttack = false;
    let lifeFullNotified = false;
    let currentScriptState = null;
    let logEntries = [];
    const MAX_LOG_ENTRIES = 500;
    let scriptActive = GM_getValue('scriptActive', false);

    // --- Variáveis do Painel ---
    const THEME_KEY = "dmTheme_v1";
    const MINIMIZED_KEY = "dmMinimized_v1";
    const MAP_DATA_KEY = 'dungeonMapData_v1'; // Mapa da sessão atual
    const MAP_LIBRARY_KEY = 'dungeonMapLibrary_v1'; // Biblioteca de mapas aprendidos
    let currentTheme = GM_getValue(THEME_KEY, 'dark');
    let isMinimized = GM_getValue(MINIMIZED_KEY, false);
    let isDragging = false;
    let dragOffsetX = 0, dragOffsetY = 0;

    // --- Variáveis de Navegação Inteligente ---
    let identifiedMapSignature = null;
    let navigationPath = null;

    // --- FUNÇÕES DE LOG ---
    function loadLogEntries() { try { logEntries = JSON.parse(GM_getValue('logEntries', '[]')); if (!Array.isArray(logEntries)) logEntries = []; } catch (e) { console.error('Erro ao carregar log:', e); logEntries = []; } }
    function saveLogEntries() { try { GM_setValue('logEntries', JSON.stringify(logEntries)); } catch (e) { console.error('Erro ao salvar log:', e); } }
    function addLogEntry(message) { const timestamp = new Date().toLocaleString('pt-BR'); const entry = `[${timestamp}] ${message}`; logEntries.unshift(entry); if (logEntries.length > MAX_LOG_ENTRIES) { logEntries.length = MAX_LOG_ENTRIES; } saveLogEntries(); updateLogDisplay(); }
    function updateLogDisplay() { const logList = document.getElementById('tgh-log-list'); if (!logList) return; logList.innerHTML = ''; const displayEntries = logEntries.slice(0, 50); displayEntries.forEach(entry => { const li = document.createElement('li'); li.textContent = entry; logList.appendChild(li); }); }
    function clearLog() { if (confirm('Tem certeza que deseja limpar todo o histórico de log?')) { logEntries = []; saveLogEntries(); updateLogDisplay(); addLogEntry('Log limpo pelo usuário.'); } }

    // --- FUNÇÕES DE GESTÃO DE MAPAS (BIBLIOTECA E SESSÃO) ---
    function getSessionMapData() { return JSON.parse(sessionStorage.getItem(MAP_DATA_KEY) || '{}'); }
    function saveSessionMapData(mapData) { sessionStorage.setItem(MAP_DATA_KEY, JSON.stringify(mapData)); }
    function getMapLibrary() { return JSON.parse(GM_getValue(MAP_LIBRARY_KEY, '{}')); }
    function saveMapLibrary(library) { GM_setValue(MAP_LIBRARY_KEY, JSON.stringify(library)); updateLibraryInfo(); }
    function clearMapLibrary() { if (confirm('Tem certeza que deseja apagar todos os mapas aprendidos? Esta ação é irreversível.')) { saveMapLibrary({}); addLogEntry('Biblioteca de mapas apagada pelo usuário.'); } }
    function updateLibraryInfo() { const infoEl = document.getElementById('map-library-info'); if (infoEl) { const library = getMapLibrary(); const count = Object.keys(library).length; infoEl.textContent = `O bot já aprendeu ${count} mapa(s).`; } }

    // --- LÓGICA DE NAVEGAÇÃO INTELIGENTE ---
    function generateMapSignature(mapData) {
        const rooms = Object.values(mapData);
        if (rooms.length < 2) return null; // Precisa de pelo menos 2 salas para uma assinatura
        // A assinatura é uma string ordenada das saídas de cada sala relativa à origem (0,0)
        const signature = rooms
            .sort((a, b) => a.x - b.x || a.y - b.y)
            .map(room => `[${room.x},${room.y}:${Object.keys(room.exits).sort().join('')}]`)
            .join('|');
        return signature;
    }

    function identifyMap() {
        if (identifiedMapSignature) return; // Já identificado
        const sessionMap = getSessionMapData();
        const signature = generateMapSignature(sessionMap);
        if (!signature) return;

        const library = getMapLibrary();
        const knownSignatures = Object.keys(library);

        for (const knownSig of knownSignatures) {
            if (knownSig.startsWith(signature) || signature.startsWith(knownSig)) {
                addLogEntry(`MAPA IDENTIFICADO! Usando mapa conhecido.`);
                identifiedMapSignature = knownSig;
                const completeMap = library[knownSig];
                const exitRoom = Object.values(completeMap).find(r => r.content === 'Saída');
                if (exitRoom) {
                    const currentCoords = JSON.parse(sessionStorage.getItem('dungeonCurrentCoords')) || { x: 0, y: 0 };
                    navigationPath = findShortestPath(completeMap, currentCoords, {x: exitRoom.x, y: exitRoom.y});
                    if (navigationPath) {
                        addLogEntry(`Rota mais curta para a saída calculada (${navigationPath.length} movimentos).`);
                    } else {
                        addLogEntry(`AVISO: Saída encontrada no mapa, mas sem rota acessível.`);
                    }
                }
                updateNavigationStatus();
                return;
            }
        }
        updateNavigationStatus();
    }

    function saveLearnedMap() {
        if (identifiedMapSignature) return; // Não salva se já era conhecido
        const sessionMap = getSessionMapData();
        const exitRoom = Object.values(sessionMap).find(r => r.content === 'Saída');
        if (!exitRoom) return; // Só salva mapas completos com saída

        const signature = generateMapSignature(sessionMap);
        if (!signature) return;

        let library = getMapLibrary();
        if (!library[signature]) {
            addLogEntry(`NOVO MAPA APRENDIDO! Salvando na biblioteca.`);
            library[signature] = sessionMap;
            saveMapLibrary(library);
        }
    }

    function findShortestPath(mapData, start, end) {
        const queue = [[start, []]];
        const visited = new Set([`${start.x},${start.y}`]);
        const directionToCoords = { North: {x:0,y:1}, South: {x:0,y:-1}, East: {x:1,y:0}, West: {x:-1,y:0}, NorthEast: {x:1,y:1}, NorthWest: {x:-1,y:1}, SouthEast: {x:1,y:-1}, SouthWest: {x:-1,y:-1} };

        while (queue.length > 0) {
            const [current, path] = queue.shift();

            if (current.x === end.x && current.y === end.y) {
                return path; // Retorna a lista de direções
            }

            const room = mapData[`${current.x},${current.y}`];
            if (room && room.exits) {
                for (const direction of Object.keys(room.exits)) {
                    const move = directionToCoords[direction];
                    if (move) {
                        const next = { x: current.x + move.x, y: current.y + move.y };
                        const nextKey = `${next.x},${next.y}`;
                        if (!visited.has(nextKey) && mapData[nextKey]) {
                            visited.add(nextKey);
                            const newPath = [...path, direction];
                            queue.push([next, newPath]);
                        }
                    }
                }
            }
        }
        return null; // Caminho não encontrado
    }


    // --- FUNÇÕES DE SCAN E DESENHO DO MAPA ---
    function scanRoomAndUpdateMap() {
        const dungeonSvg = document.getElementById('dungeon'); if (!dungeonSvg) return;
        let mapData = getSessionMapData();
        const currentCoords = JSON.parse(sessionStorage.getItem('dungeonCurrentCoords')) || { x: 0, y: 0 };
        const coordKey = `${currentCoords.x},${currentCoords.y}`;
        if (!mapData[coordKey]) { mapData[coordKey] = { x: currentCoords.x, y: currentCoords.y, exits: {}, content: 'Vazio' }; }
        const availableDirections = Array.from(dungeonSvg.querySelectorAll('g[id][display="inline"]')).map(g => g.id).filter(id => ["North", "South", "East", "West", "NorthEast", "NorthWest", "SouthEast", "SouthWest"].includes(id));
        mapData[coordKey].exits = {};
        availableDirections.forEach(dir => mapData[coordKey].exits[dir] = true);
        if (dungeonSvg.querySelector('#Monster[display="inline"], #Boss[display="inline"]')) { mapData[coordKey].content = 'Monstro'; }
        else if (dungeonSvg.querySelector('#Chest[display="inline"]')) { mapData[coordKey].content = 'Baú'; }
        else if (dungeonSvg.querySelector('#PouchOfGold[display="inline"]')) { mapData[coordKey].content = 'Ouro'; }
        else if (dungeonSvg.querySelector('#Exit[display="inline"]')) { mapData[coordKey].content = 'Saída'; saveLearnedMap(); } // Aprende o mapa ao encontrar a saída
        else if (mapData[coordKey].content === 'Monstro') { mapData[coordKey].content = 'Vazio'; }
        saveSessionMapData(mapData);
        identifyMap(); // Tenta identificar o mapa após cada scan
        drawMap();
    }
    function drawMap() {
        const mapData = getSessionMapData();
        const svg = document.getElementById('dungeon-map-svg');
        const container = document.getElementById('map-container');
        if (!svg || !container) return;
        svg.innerHTML = '';
        const rooms = Object.values(mapData);
        if (rooms.length === 0) return;
        const roomSize = 24, spacing = 12, totalSize = roomSize + spacing;
        const strokeColor = 'var(--pm-text-color-secondary)', currentRoomFill = 'var(--pm-accent-color)', defaultRoomFill = 'var(--pm-subtle-bg)', iconColor = 'var(--pm-text-color)', unexploredColor = 'var(--pm-border-color)';
        const pathColor = '#28a745'; // Cor para a rota
        const currentCoords = JSON.parse(sessionStorage.getItem('dungeonCurrentCoords') || '{"x":0,"y":0}');
        const directionToCoords = { North: {x:0,y:1}, South: {x:0,y:-1}, East: {x:1,y:0}, West: {x:-1,y:0}, NorthEast: {x:1,y:1}, NorthWest: {x:-1,y:1}, SouthEast: {x:1,y:-1}, SouthWest: {x:-1,y:-1} };
        function coordKey(c) { return `${c.x},${c.y}`; }
        const allCoords = []; const potentialCoords = new Set();
        rooms.forEach(room => { allCoords.push({x: room.x, y: room.y}); Object.keys(room.exits).forEach(dir => { const move = directionToCoords[dir]; if (move) { const nextCoord = { x: room.x + move.x, y: room.y + move.y }; const cKey = coordKey(nextCoord); if (!mapData[cKey]) { potentialCoords.add(cKey); } } }); });
        potentialCoords.forEach(key => { const [x, y] = key.split(',').map(Number); allCoords.push({x, y}); });
        if (allCoords.length === 0) return;
        const minX = Math.min(...allCoords.map(c => c.x)), maxX = Math.max(...allCoords.map(c => c.x)), minY = Math.min(...allCoords.map(c => c.y)), maxY = Math.max(...allCoords.map(c => c.y));
        const vbX = (minX * totalSize) - spacing*2, vbY = (-maxY * totalSize) - spacing*2, vbW = (maxX - minX + 1) * totalSize + spacing*4, vbH = (maxY - minY + 1) * totalSize + spacing*4;
        svg.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`);
        const drawnConnections = new Set();
        rooms.forEach(room => {
            const x1 = room.x * totalSize, y1 = -room.y * totalSize;
            Object.keys(room.exits).forEach(dir => {
                const move = directionToCoords[dir];
                if(move){
                    const nextCoords = { x: room.x + move.x, y: room.y + move.y };
                    const connectionId = [coordKey(room), coordKey(nextCoords)].sort().join('-');
                    if (drawnConnections.has(connectionId)) return;
                    const x2 = nextCoords.x * totalSize, y2 = -nextCoords.y * totalSize;
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
                    if (mapData[coordKey(nextCoords)]) { line.setAttribute('stroke', strokeColor); line.setAttribute('stroke-width', '1.5'); line.setAttribute('stroke-dasharray', '4 2'); }
                    else { line.setAttribute('stroke', unexploredColor); line.setAttribute('stroke-width', '1.5'); line.setAttribute('stroke-dasharray', '2 3'); }
                    svg.appendChild(line); drawnConnections.add(connectionId);
                }
            });
        });

        if(navigationPath && navigationPath.length > 0) {
            let pathStart = currentCoords;
            for(const dir of navigationPath){
                const move = directionToCoords[dir];
                if(move){
                    const pathEnd = {x: pathStart.x + move.x, y: pathStart.y + move.y};
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', pathStart.x * totalSize); line.setAttribute('y1', -pathStart.y * totalSize);
                    line.setAttribute('x2', pathEnd.x * totalSize); line.setAttribute('y2', -pathEnd.y * totalSize);
                    line.setAttribute('stroke', pathColor); line.setAttribute('stroke-width', '3');
                    svg.appendChild(line);
                    pathStart = pathEnd;
                }
            }
        }

        potentialCoords.forEach(key => { const [x, y] = key.split(',').map(Number); const rectX = x * totalSize - roomSize / 2, rectY = -y * totalSize - roomSize / 2; const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); rect.setAttribute('x', rectX); rect.setAttribute('y', rectY); rect.setAttribute('width', roomSize); rect.setAttribute('height', roomSize); rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', unexploredColor); rect.setAttribute('stroke-width', '1.5'); rect.setAttribute('rx', '4'); rect.setAttribute('stroke-dasharray', '3 3'); svg.appendChild(rect); });
        rooms.forEach(room => { const x = room.x * totalSize - roomSize / 2, y = -room.y * totalSize - roomSize / 2; const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); rect.setAttribute('x', x); rect.setAttribute('y', y); rect.setAttribute('width', roomSize); rect.setAttribute('height', roomSize); rect.setAttribute('fill', (room.x === currentCoords.x && room.y === currentCoords.y) ? currentRoomFill : defaultRoomFill); rect.setAttribute('stroke', strokeColor); rect.setAttribute('stroke-width', '2'); rect.setAttribute('rx', '4'); svg.appendChild(rect); let icon = ''; if (room.content === 'Monstro') icon = 'fa-skull-crossbones'; else if (room.content === 'Baú') icon = 'fa-treasure-chest'; else if (room.content === 'Ouro') icon = 'fa-coins'; else if (room.content === 'Saída') icon = 'fa-dungeon'; else if (room.x === 0 && room.y === 0) icon = 'fa-person-hiking'; if (icon) { const iconEl = document.createElementNS('http://www.w3.org/2000/svg', 'text'); iconEl.setAttribute('x', x + roomSize / 2); iconEl.setAttribute('y', y + roomSize / 2); iconEl.setAttribute('font-family', '"Font Awesome 6 Free"'); iconEl.setAttribute('font-weight', '900'); iconEl.setAttribute('font-size', `${roomSize * 0.6}px`); iconEl.setAttribute('fill', iconColor); iconEl.setAttribute('text-anchor', 'middle'); iconEl.setAttribute('dominant-baseline', 'central'); iconEl.innerHTML = getIconUnicode(icon); svg.appendChild(iconEl); } });
        function getIconUnicode(className) { const icons = { 'fa-skull-crossbones': '&#xf714;', 'fa-treasure-chest': '&#xe43d;', 'fa-coins': '&#xf51e;', 'fa-dungeon': '&#xf6d9;', 'fa-person-hiking': '&#xf6ec;'}; return icons[className] || ''; }
    }


    // --- ROTEADOR E LÓGICA DE PÁGINA ---
    function pageRouter() {
        if (!scriptActive) return;
        if (checkForMonsterHuntExit()) { return; }
        let newState = 'UNKNOWN';
        const onMapPage = document.getElementById('fantasia-health');
        const onDungeonEntryPage = document.querySelector('input[id$="btnStartHunt"]');
        const inDungeon = document.getElementById('dungeon') || document.querySelector('div.box h2[id^="ctl00_cphLeftColumn_ctl01"]') || document.querySelector('input[title="Usar Saída da Caça aos Monstros"]');
        const onPostDeathPage = document.body.textContent.includes('O monstro já foi derrotado.') || document.body.textContent.includes('Você foi derrotado.');
        if (onMapPage) newState = 'MAP'; else if (onDungeonEntryPage) newState = 'DUNGEON_ENTRY'; else if (onPostDeathPage) newState = 'POST_DEATH'; else if (inDungeon) newState = 'IN_DUNGEON';
        if (newState === currentScriptState) { return; }
        currentScriptState = newState;
        clearInterval(actionIntervalId);
        switch (newState) {
            case 'MAP': handleMapPage(); break;
            case 'DUNGEON_ENTRY': handleDungeonEntryPage(); break;
            case 'IN_DUNGEON': handleDungeonPage(); break;
            case 'POST_DEATH': handlePostDeathPage(); break;
        }
    }

    function handleMapPage() {
        addLogEntry('No mapa.');
        sessionStorage.removeItem(MAP_DATA_KEY);
        sessionStorage.removeItem('dungeonVisitedPath');
        sessionStorage.removeItem('dungeonCurrentCoords');
        sessionStorage.removeItem('lastMoveDirection');
        sessionStorage.removeItem('usedSpecialPowers');
        identifiedMapSignature = null;
        navigationPath = null;
        createOrUpdatePanel();
        if (GM_getValue('isRefreshActive', false) && countdownTimerId === null) { startCountdown(GM_getValue('refreshInterval', 5)); }
        startHealthObserver();
    }
    function handleDungeonEntryPage() {
        addLogEntry('Entrada da masmorra. Limpando dados da sessão.');
        sessionStorage.removeItem(MAP_DATA_KEY);
        sessionStorage.removeItem('dungeonVisitedPath');
        sessionStorage.removeItem('dungeonCurrentCoords');
        sessionStorage.removeItem('lastMoveDirection');
        sessionStorage.removeItem('usedSpecialPowers');
        identifiedMapSignature = null;
        navigationPath = null;
        createOrUpdatePanel();
        if (GM_getValue('autoCycleEnabled', false)) startDungeonEntryCountdown();
    }
    function handleDungeonPage() {
        addLogEntry('Dentro da masmorra...');
        createOrUpdatePanel();
        scanRoomAndUpdateMap();
        if (GM_getValue('autoCycleEnabled', false)) actionIntervalId = setInterval(dungeonActionHeartbeat, 2500);
    }
    function handlePostDeathPage() {
        addLogEntry('Resultado da batalha. Voltando para o mapa...');
        const exploreLink = Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/Locale/Compass'));
        if (exploreLink) exploreLink.click(); else addLogEntry('ERRO: Link "Explorar a área" não encontrado.');
    }

    // --- LÓGICA DE AÇÃO PRINCIPAL ---
    function dungeonActionHeartbeat() {
        if (!GM_getValue('autoCycleEnabled', false) || isWaitingAfterAttack || !scriptActive) return;
        scanRoomAndUpdateMap();
        const useExitButton = document.querySelector('input[title="Usar Saída da Caça aos Monstros"]');
        if (useExitButton) { addLogEntry('Confirmando saída da masmorra...'); useExitButton.click(); return; }
        const inCombat = document.querySelector('h3.fe-roll-monster-dice');
        if (inCombat) {
            const combatStatus = getCombatStatus(); addLogEntry(`Status de combate: Vida = ${combatStatus.myhp}`);
            const monsterCount = countMonstersInRoom(); addLogEntry(`Monstros na sala: ${monsterCount}`);
            if (tryUseCalmMusic(combatStatus)) { addLogEntry('Musiquinha calmante usada com sucesso!'); return; }
            if (monsterCount > 1 && tryUseMultiMonsterAbilities()) { return; }
            if (tryUseSpecialPower(combatStatus)) { return; }
            addLogEntry(`Atacando ${inCombat.textContent.trim()}...`); inCombat.click();
            isWaitingAfterAttack = true; setTimeout(() => { isWaitingAfterAttack = false; }, 6000);
            return;
        }

        const dungeonSvg = document.getElementById('dungeon');
        if (dungeonSvg) {
            const monster = dungeonSvg.querySelector('#Monster[display="inline"], #Boss[display="inline"]');
            if (monster) { addLogEntry(`Monstro avistado! Iniciando combate...`); monster.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
            const chest = dungeonSvg.querySelector('#Chest[display="inline"]');
            const exit = dungeonSvg.querySelector('#Exit[display="inline"]');
            if (chest && exit) { addLogEntry('Baú e Saída no mapa! Clicando no ícone da saída...'); exit.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
            const loot = chest || dungeonSvg.querySelector('#PouchOfGold[display="inline"]');
            if (loot) { addLogEntry('Tesouro encontrado! Saqueando...'); loot.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
            if (exit) { addLogEntry('Saída no mapa encontrada! Clicando no ícone...'); exit.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
            exploreDungeon(dungeonSvg);
        }
    }

    // --- LÓGICA DE EXPLORAÇÃO (MODIFICADA) ---
    function exploreDungeon(dungeonSvg) {
        if (navigationPath && navigationPath.length > 0) {
            const nextMove = navigationPath.shift();
            const nextMoveElement = dungeonSvg.querySelector(`#Activate${nextMove}`);
            if (nextMoveElement) {
                const directionToCoords = { North: {x:0,y:1}, South: {x:0,y:-1}, East: {x:1,y:0}, West: {x:-1,y:0}, NorthEast: {x:1,y:1}, NorthWest: {x:-1,y:1}, SouthEast: {x:1,y:-1}, SouthWest: {x:-1,y:-1} };
                let currentCoords = JSON.parse(sessionStorage.getItem('dungeonCurrentCoords')) || { x: 0, y: 0 };
                const move = directionToCoords[nextMove];
                const nextCoords = { x: currentCoords.x + move.x, y: currentCoords.y + move.y };
                sessionStorage.setItem('lastMoveDirection', nextMove);
                sessionStorage.setItem('dungeonCurrentCoords', JSON.stringify(nextCoords));
                addLogEntry(`Seguindo rota para ${nextMove}. Coords: [${nextCoords.x},${nextCoords.y}].`);
                nextMoveElement.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                return;
            } else {
                 addLogEntry(`AVISO: Rota indicava ${nextMove}, mas o caminho não está disponível. Recalculando...`);
                 navigationPath = null;
            }
        }

        const directionToCoords = { North: {x:0,y:1}, South: {x:0,y:-1}, East: {x:1,y:0}, West: {x:-1,y:0}, NorthEast: {x:1,y:1}, NorthWest: {x:-1,y:1}, SouthEast: {x:1,y:-1}, SouthWest: {x:-1,y:-1} };
        const oppositeDirections = {North:"South",South:"North",East:"West",West:"East",NorthEast:"SouthWest",SouthWest:"NorthEast",NorthWest:"SouthEast",SouthEast:"NorthWest"};
        let currentCoords = JSON.parse(sessionStorage.getItem('dungeonCurrentCoords')) || { x: 0, y: 0 };
        let visitedPath = JSON.parse(sessionStorage.getItem('dungeonVisitedPath')) || [];
        if (visitedPath.length === 0) { visitedPath.push(`${currentCoords.x},${currentCoords.y}`); sessionStorage.setItem('dungeonVisitedPath', JSON.stringify(visitedPath)); addLogEntry(`Iniciando mapa. Ponto de partida: [0,0].`); }
        const availableDirections = Array.from(dungeonSvg.querySelectorAll('g[id][display="inline"]')).map(g => g.id).filter(id => Object.keys(directionToCoords).includes(id));
        if (availableDirections.length === 0) { addLogEntry("Preso! Tentando escapar..."); const escapeLink = Array.from(document.querySelectorAll("a")).find(a => a.href.includes("/Locale/AbortAdventure")); if (escapeLink) escapeLink.click(); return; }
        const unvisitedDirections = availableDirections.filter(dir => { const move = directionToCoords[dir]; const nextCoords = { x: currentCoords.x + move.x, y: currentCoords.y + move.y }; return !visitedPath.includes(`${nextCoords.x},${nextCoords.y}`); });
        let bestChoice = null;
        if (unvisitedDirections.length > 0) { bestChoice = unvisitedDirections[Math.floor(Math.random() * unvisitedDirections.length)]; }
        else { const lastMove = sessionStorage.getItem("lastMoveDirection"); const entryDirection = lastMove ? oppositeDirections[lastMove] : null; const backtrackOptions = availableDirections.filter(dir => dir !== entryDirection); bestChoice = backtrackOptions.length > 0 ? backtrackOptions[Math.floor(Math.random() * backtrackOptions.length)] : availableDirections[0]; }
        const nextMoveElement = dungeonSvg.querySelector(`#Activate${bestChoice}`);
        if (nextMoveElement) {
            const move = directionToCoords[bestChoice]; const nextCoords = { x: currentCoords.x + move.x, y: currentCoords.y + move.y };
            sessionStorage.setItem('lastMoveDirection', bestChoice); sessionStorage.setItem('dungeonCurrentCoords', JSON.stringify(nextCoords));
            if (!visitedPath.includes(`${nextCoords.x},${nextCoords.y}`)) { visitedPath.push(`${nextCoords.x},${nextCoords.y}`); sessionStorage.setItem('dungeonVisitedPath', JSON.stringify(visitedPath)); }
            addLogEntry(`Explorando para ${bestChoice}. Coords: [${nextCoords.x},${nextCoords.y}].`);
            nextMoveElement.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
    };


    // --- FUNÇÕES DE SUPORTE E DE UI ---
    function getCombatStatus() {
        const healthContainer = document.querySelector('td.valignmid.right span[title*="Saúde:"]');
        if (!healthContainer) {
            const hearts = document.querySelectorAll('img.fe-hp');
            const deadHearts = document.querySelectorAll('img[src*="HeartOff.png"]');
            return { myhp: hearts.length - deadHearts.length };
        }
        const title = healthContainer.getAttribute('title');
        const match = title.match(/Saúde: (\d+) de (\d+)/);
        if (match) {
            return { myhp: parseInt(match[1], 10) };
        }
        const hearts = healthContainer.querySelectorAll('img.fe-hp');
        const deadHearts = healthContainer.querySelectorAll('img[src*="HeartOff.png"]');
        return { myhp: hearts.length - deadHearts.length };
    }

    function countMonstersInRoom() {
        return document.querySelectorAll('h3.fe-roll-monster-dice').length;
    }

    function tryUseCalmMusic(combatStatus) {
        const ABILITY_NAME = 'Musiquinha calmante';
        const HEALTH_THRESHOLD = 4;
        if (combatStatus.myhp > HEALTH_THRESHOLD) return false;
        const abilityButton = Array.from(document.querySelectorAll('h3.fe-roll-ability-dice')).find(btn => btn.textContent.trim().includes(ABILITY_NAME));
        if (abilityButton) {
            addLogEntry(`Vida baixa! Usando ${ABILITY_NAME}...`);
            abilityButton.click();
            isWaitingAfterAttack = true;
            setTimeout(() => { isWaitingAfterAttack = false; }, 6000);
            return true;
        }
        return false;
    }

    function tryUseMultiMonsterAbilities() {
        const abilities = [{ name: 'Deslizando de joelhos', id: 17 }, { name: 'Performance hipnotizante', id: 18 }];
        const usedAbilities = JSON.parse(sessionStorage.getItem('usedSpecialPowers')) || [];
        for (const ability of abilities) {
            if (usedAbilities.includes(ability.name)) continue;
            const abilityButton = Array.from(document.querySelectorAll('h3.fe-roll-ability-dice')).find(btn => btn.textContent.trim().includes(ability.name));
            if (abilityButton) {
                addLogEntry(`Múltiplos monstros detectados! Usando ${ability.name}...`);
                abilityButton.click();
                usedAbilities.push(ability.name);
                sessionStorage.setItem('usedSpecialPowers', JSON.stringify(usedAbilities));
                isWaitingAfterAttack = true;
                setTimeout(() => { isWaitingAfterAttack = false; }, 6000);
                return true;
            }
        }
        return false;
    }

    function tryUseSpecialPower(combatStatus) {
        const POWER_NAME = 'Hora da Soneca';
        const HEALTH_THRESHOLD = 3;
        if (combatStatus.myhp > HEALTH_THRESHOLD) return false;
        const usedPowers = JSON.parse(sessionStorage.getItem('usedSpecialPowers')) || [];
        if (usedPowers.includes(POWER_NAME)) return false;
        const powerButton = Array.from(document.querySelectorAll('h3.fe-roll-power-dice')).find(btn => btn.textContent.trim().includes(POWER_NAME));
        if (powerButton) {
            addLogEntry(`Usando poder especial: ${POWER_NAME}...`);
            powerButton.click();
            usedPowers.push(POWER_NAME);
            sessionStorage.setItem('usedSpecialPowers', JSON.stringify(usedPowers));
            isWaitingAfterAttack = true;
            setTimeout(() => { isWaitingAfterAttack = false; }, 6000);
            return true;
        }
        return false;
    }

    function checkForMonsterHuntExit() {
        const exitButton = document.querySelector('input[value="Explorar Saída da Caça aos Monstros"]');
        if (exitButton) { addLogEntry("Retornando ao mapa..."); exitButton.click(); return true; }
        return false;
    }

    function performAutoDismount() {
        const dismountButton = document.querySelector('input[value="Desmontar do corcel"]');
        if(!dismountButton) return addLogEntry('ERRO: Botão "Desmontar" não encontrado.');
        addLogEntry('Desmontando do corcel...');
        dismountButton.click();
        const observer = new MutationObserver(() => {
            const dialog = Array.from(document.querySelectorAll(".ui-dialog")).find(d => d.querySelector(".ui-dialog-title")?.textContent.includes("Desmontar do corcel"));
            if(dialog) {
                const yesButton = Array.from(dialog.querySelectorAll(".ui-dialog-buttonset button")).find(b => b.textContent === "Sim");
                if (yesButton) { addLogEntry('Confirmando desmontagem.'); yesButton.click(); observer.disconnect(); }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function performStartHunt() {
        const difficultyDropdown = document.querySelector('select[id$="ddlDifficulty"]');
        if (!difficultyDropdown) return addLogEntry('ERRO: Dropdown de dificuldade não encontrado.');
        difficultyDropdown.value = GM_getValue('dungeonDifficulty', '2');
        addLogEntry(`Dificuldade "${difficultyDropdown.options[difficultyDropdown.selectedIndex].text}" selecionada.`);
        const startButton = document.querySelector('input[id$="btnStartHunt"]');
        if (!startButton) return addLogEntry('ERRO: Botão "Começar a caça" não encontrado.');
        addLogEntry('Iniciando caça...');
        startButton.click();
        const observer = new MutationObserver(() => {
            const dialog = Array.from(document.querySelectorAll(".ui-dialog")).find(d => d.querySelector(".ui-dialog-title")?.textContent.includes("Começar a caça ao monstro"));
            if (dialog) {
                const yesButton = Array.from(dialog.querySelectorAll(".ui-dialog-buttonset button")).find(b => b.textContent === "Sim");
                if (yesButton) { addLogEntry('Confirmando início da caça.'); yesButton.click(); observer.disconnect(); }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function startDungeonEntryCountdown() {
        let seconds = 5;
        let countdownId = setInterval(() => {
            seconds--;
            if (seconds > 0) { addLogEntry(`Iniciando caça em ${seconds}s...`); }
            else { clearInterval(countdownId); performStartHunt(); }
        }, 1000);
    }

    function handleFullHealth() {
        if (lifeFullNotified) return;
        lifeFullNotified = true;
        addLogEntry('VIDA CHEIA! Disparando automação.');
        sendLocalNotification();
        stopCountdown(false);
        if (window.healthObserver) window.healthObserver.disconnect();
        if (GM_getValue('autoCycleEnabled', false)) setTimeout(performAutoDismount, 500);
    }

    function getHealthStatus() {
        const healthBar = document.getElementById('fantasia-health');
        if(!healthBar) return null;
        if(healthBar.style.display === 'none') return { isHidden: true };
        const hearts = healthBar.querySelectorAll('img.fe-hp');
        const deadHearts = healthBar.querySelectorAll('img[src*="HeartOff.png"]');
        return { red: hearts.length - deadHearts.length, white: deadHearts.length, isHidden: false };
    }

    function healthCheck() {
        const status = getHealthStatus();
        if (status && status.isHidden) { handleFullHealth(); }
    }

    function logCurrentStatus() {
        const status = getHealthStatus();
        if(status) {
            if(status.isHidden) { addLogEntry('Status Inicial: Vida Cheia.'); healthCheck(); }
            else { addLogEntry(`Status: ${status.red} ❤️ / ${status.white} 🤍`); }
        } else { addLogEntry('Aguardando dados de vida...'); }
    }

    function startHealthObserver() {
        const healthBar = document.getElementById('fantasia-health');
        if(!healthBar) return;
        const observer = new MutationObserver(healthCheck);
        observer.observe(healthBar, { attributes: true, childList: true, subtree: true });
        window.healthObserver = observer;
        setTimeout(logCurrentStatus, 1500);
    }

    function sendLocalNotification() {
        GM_notification({ title:'Vida Cheia!', text:'O bot irá desmontar e iniciar a caça.', image:'https://www.popmundo.com/Static/Icons/Fantasia/HeartOn.png', highlight:true, onclick:()=>window.focus() });
    }

    function startDragging(e) {
        if (e.target.closest('button')) return;
        isDragging = true;
        const panel = document.getElementById('tgh-control-panel');
        dragOffsetX = e.clientX - panel.offsetLeft;
        dragOffsetY = e.clientY - panel.offsetTop;
        e.preventDefault();
    }

    function drag(e) {
        if (isDragging) {
            const panel = document.getElementById('tgh-control-panel');
            let newX = e.clientX - dragOffsetX;
            let newY = e.clientY - dragOffsetY;
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            panel.style.left = `${newX}px`; panel.style.top = `${newY}px`;
            panel.style.right = 'auto'; panel.style.bottom = 'auto';
        }
    }

    function stopDragging() { isDragging = false; }

    function injectFonts() {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(fontAwesome);
        const googleFonts = document.createElement('link');
        googleFonts.rel = 'stylesheet';
        googleFonts.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
        document.head.appendChild(googleFonts);
    }

    function updateNavigationStatus() {
        const el = document.getElementById('dm-navigation-status');
        if(!el) return;
        if (navigationPath) {
             el.innerHTML = `<i class="fa-solid fa-route" style="color: var(--pm-success-color);"></i> Navegando (Mapa Conhecido)`;
             el.style.borderColor = 'var(--pm-success-color)';
        } else {
             el.innerHTML = `<i class="fa-solid fa-map-signs"></i> Explorando (Mapa Desconhecido)`;
             el.style.borderColor = 'var(--pm-accent-color)';
        }
    }


    function createOrUpdatePanel() {
        if (document.getElementById('tgh-control-panel')) {
            updateLogDisplay();
            updateLibraryInfo();
            updateNavigationStatus();
            drawMap();
            return;
        };

        injectFonts();

        const panel = document.createElement('div');
        panel.id = 'tgh-control-panel';
        panel.className = currentTheme;
        if (isMinimized) panel.classList.add('minimized');

        panel.innerHTML = `
            <div class="pm-panel-header">
                <h4><i class="fa-solid fa-brain"></i> Mestre das Masmorras</h4>
                <div class="pm-header-controls">
                    <button id="pmThemeToggle" title="Alternar Tema"><i class="fa-solid ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i></button>
                    <button id="pmMinimizeToggle" title="${isMinimized ? 'Maximizar' : 'Minimizar'}"><i class="fa-solid ${isMinimized ? 'fa-window-maximize' : 'fa-window-minimize'}"></i></button>
                </div>
            </div>
            <div class="pm-tabs">
                <button class="pm-tab-button active" data-tab="status"><i class="fa-solid fa-gamepad"></i> Status & Log</button>
                <button class="pm-tab-button" data-tab="map"><i class="fa-solid fa-map-location-dot"></i> Mapa</button>
                <button class="pm-tab-button" data-tab="settings"><i class="fa-solid fa-sliders"></i> Configurações</button>
            </div>
            <div class="pm-tab-content-wrapper">
                <div id="tab-status" class="pm-tab-content active">
                    <label class="pm-toggle-label" for="activate-script-checkbox">
                        <input type="checkbox" id="activate-script-checkbox" ${scriptActive ? 'checked' : ''}>
                        <span class="pm-toggle-switch"></span>
                        <span class="pm-toggle-label-text">${scriptActive ? 'Automação Ativada' : 'Automação Desativada'}</span>
                    </label>
                    <div id="dm-navigation-status" class="pm-status-box">Aguardando...</div>
                    <div id="dm-countdown-status" class="pm-status-box" style="margin-top: 8px;">Aguardando...</div>
                    <div class="pm-log-header">
                        <div><i class="fa-solid fa-scroll"></i> Log de Atividades</div>
                        <button id="clear-log-btn" class="pm-clear-button"><i class="fa-solid fa-broom"></i> Limpar</button>
                    </div>
                    <ul id="tgh-log-list"></ul>
                </div>
                <div id="tab-map" class="pm-tab-content">
                    <div class="pm-log-header">
                        <div><i class="fa-solid fa-map"></i> Mapa da Sessão Atual</div>
                    </div>
                     <div id="map-container">
                        <svg id="dungeon-map-svg"></svg>
                    </div>
                </div>
                <div id="tab-settings" class="pm-tab-content">
                    <div>
                        <label for="dungeon-difficulty-select"><i class="fa-solid fa-wand-sparkles"></i> Dificuldade da Masmorra</label>
                        <select id="dungeon-difficulty-select">
                            <option value="1">Molezinha</option>
                            <option value="2">Normal</option>
                            <option value="4">Pesadelo</option>
                        </select>
                    </div>
                     <div style="margin-top: 15px;">
                        <label><i class="fa-solid fa-book-skull"></i> Biblioteca de Mapas</label>
                        <div id="map-library-info" style="font-size: 11px; color: var(--pm-text-color-secondary); margin-bottom: 8px;"></div>
                        <button id="clear-library-btn" class="pm-clear-button" style="width: 100%; padding: 8px;"><i class="fa-solid fa-trash-can"></i> Apagar Mapas Aprendidos</button>
                    </div>
                     <div style="margin-top: 15px;">
                        <label><i class="fa-solid fa-clock-rotate-left"></i> Atualização Automática</label>
                        <input type="number" id="refresh-interval" min="1" value="${GM_getValue('refreshInterval', 5)}" placeholder="Minutos para atualizar...">
                    </div>
                </div>
            </div>`;
        document.body.appendChild(panel);
        updateLogDisplay();
        updateLibraryInfo();
        updateNavigationStatus();
        drawMap();

        const panelHeader = panel.querySelector('.pm-panel-header');
        panelHeader.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
        setupPanelListeners();
    }
    function setupPanelListeners() {
        document.getElementById('clear-library-btn')?.addEventListener('click', clearMapLibrary);
        const difficultySelect = document.getElementById('dungeon-difficulty-select');
        if (difficultySelect) { difficultySelect.value = GM_getValue('dungeonDifficulty', '2'); difficultySelect.addEventListener('change', e => { GM_setValue('dungeonDifficulty', e.target.value); addLogEntry(`Dificuldade alterada para ${e.target.options[e.target.selectedIndex].text}.`); }); }
        document.getElementById('clear-log-btn')?.addEventListener('click', clearLog);
        const activateCheckbox = document.getElementById('activate-script-checkbox');
        const activateLabel = document.querySelector('.pm-toggle-label-text');
        if (activateCheckbox) { activateCheckbox.addEventListener('change', () => { scriptActive = activateCheckbox.checked; GM_setValue('scriptActive', scriptActive); GM_setValue('autoCycleEnabled', scriptActive); if (scriptActive) { activateLabel.textContent = 'Automação Ativada'; addLogEntry('Automação ATIVADA pelo usuário.'); const minutes = parseInt(document.getElementById('refresh-interval').value, 10); GM_setValue('refreshInterval', minutes); GM_setValue('isRefreshActive', true); startCountdown(minutes); currentScriptState = null; pageRouter(); } else { activateLabel.textContent = 'Automação Desativada'; addLogEntry('Automação DESATIVADA pelo usuário.'); GM_setValue('isRefreshActive', false); stopCountdown(); clearInterval(actionIntervalId); } }); }
        const panel = document.getElementById('tgh-control-panel'); const themeToggle = document.getElementById('pmThemeToggle'); const minimizeToggle = document.getElementById('pmMinimizeToggle'); const tabButtons = document.querySelectorAll('.pm-tab-button'); const tabContents = document.querySelectorAll('.pm-tab-content');
        themeToggle?.addEventListener('click', () => { panel.classList.toggle('dark'); panel.classList.toggle('light'); currentTheme = panel.classList.contains('dark') ? 'dark' : 'light'; GM_setValue(THEME_KEY, currentTheme); const icon = themeToggle.querySelector('i'); icon.classList.toggle('fa-sun', currentTheme === 'dark'); icon.classList.toggle('fa-moon', currentTheme === 'light'); });
        minimizeToggle?.addEventListener('click', () => { isMinimized = !isMinimized; panel.classList.toggle('minimized', isMinimized); GM_setValue(MINIMIZED_KEY, isMinimized); const icon = minimizeToggle.querySelector('i'); icon.classList.toggle('fa-window-minimize', !isMinimized); icon.classList.toggle('fa-window-maximize', isMinimized); minimizeToggle.title = isMinimized ? 'Maximizar' : 'Minimizar'; });
        tabButtons.forEach(button => { button.addEventListener('click', () => { tabButtons.forEach(btn => btn.classList.remove('active')); button.classList.add('active'); const tabId = button.getAttribute('data-tab'); tabContents.forEach(content => { content.classList.remove('active'); if (content.id === `tab-${tabId}`) { content.classList.add('active'); } }); }); });
    }
    GM_addStyle(`:root { --pm-font-family: 'Roboto', 'Segoe UI', sans-serif; --pm-shadow-color: rgba(0, 0, 0, 0.15); --pm-success-color: #28a745; --pm-error-color: #dc3545; --pm-accent-color: #0d6efd; } #tgh-control-panel.light { --pm-bg-color: #f8f9fa; --pm-text-color: #212529; --pm-text-color-secondary: #6c757d; --pm-border-color: #dee2e6; --pm-subtle-bg: #ffffff; --pm-input-bg: #ffffff; --pm-input-border: #ced4da; --pm-button-bg: #0d6efd; --pm-button-hover-bg: #0b5ed7; --pm-button-text: #ffffff; --pm-tab-inactive-bg: transparent; --pm-tab-active-bg: #f8f9fa; --pm-tab-hover-bg: #e9ecef; --pm-log-bg: #e9ecef; } #tgh-control-panel.dark { --pm-bg-color: #212529; --pm-text-color: #dee2e6; --pm-text-color-secondary: #adb5bd; --pm-border-color: #495057; --pm-subtle-bg: #343a40; --pm-input-bg: #343a40; --pm-input-border: #6c757d; --pm-button-bg: #0d6efd; --pm-button-hover-bg: #0b5ed7; --pm-button-text: #ffffff; --pm-tab-inactive-bg: transparent; --pm-tab-active-bg: #343a40; --pm-tab-hover-bg: #495057; --pm-log-bg: #343a40; --pm-shadow-color: rgba(0, 0, 0, 0.4); } #tgh-control-panel { position: fixed; top: 20px; right: 20px; background-color: var(--pm-bg-color); border: 1px solid var(--pm-border-color); padding: 0; z-index: 10001; width: 320px; font-family: var(--pm-font-family); font-size: 12px; color: var(--pm-text-color); box-shadow: 0 4px 12px var(--pm-shadow-color); border-radius: 8px; overflow: hidden; } #tgh-control-panel i.fa-solid { margin-right: 6px; width: 1.1em; text-align: center; vertical-align: middle; } .pm-panel-header { background-color: var(--pm-subtle-bg); border-bottom: 1px solid var(--pm-border-color); padding: 8px 12px; cursor: move; user-select: none; display: flex; justify-content: space-between; align-items: center; } .pm-panel-header h4 { margin: 0; font-size: 16px; font-weight: 700; } .pm-header-controls { display: flex; gap: 8px; } .pm-header-controls button { background: none; border: none; color: var(--pm-text-color-secondary); cursor: pointer; font-size: 14px; padding: 0; } .pm-header-controls button:hover { color: var(--pm-accent-color); } #tgh-control-panel.minimized .pm-tabs, #tgh-control-panel.minimized .pm-tab-content-wrapper { display: none; } #tgh-control-panel.minimized { height: auto !important; } .pm-tabs { display: flex; background-color: var(--pm-bg-color); border-bottom: 1px solid var(--pm-border-color); } .pm-tab-button { flex: 1; padding: 10px 5px; border: none; background: var(--pm-tab-inactive-bg); color: var(--pm-text-color-secondary); cursor: pointer; font-size: 12px; font-weight: 400; transition: all 0.25s ease; border-bottom: 3px solid transparent; } .pm-tab-button:hover { background: var(--pm-tab-hover-bg); } .pm-tab-button.active { color: var(--pm-accent-color); border-bottom-color: var(--pm-accent-color); background: var(--pm-tab-active-bg); font-weight: 700; } .pm-tab-content-wrapper { padding: 12px; } .pm-tab-content { display: none; animation: pmFadeIn 0.5s ease; } .pm-tab-content.active { display: block; } @keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } } #tgh-control-panel label { font-size: 12px; color: var(--pm-text-color); margin-bottom: 4px; display: block; font-weight: 400; } .pm-toggle-label { display: flex; align-items: center; font-size: 14px; cursor: pointer; user-select: none; padding: 8px; background-color: var(--pm-subtle-bg); border-radius: 5px; border: 1px solid var(--pm-border-color); margin-bottom: 12px; } .pm-toggle-label input { display: none; } .pm-toggle-switch { position: relative; display: inline-block; width: 40px; height: 20px; background-color: var(--pm-border-color); border-radius: 10px; transition: background-color 0.3s ease; cursor: pointer; margin-right: 10px; } .pm-toggle-switch::before { content: ""; position: absolute; width: 14px; height: 14px; border-radius: 50%; background-color: white; top: 3px; left: 3px; transition: transform 0.3s ease; } .pm-toggle-label input:checked + .pm-toggle-switch { background-color: var(--pm-success-color); } .pm-toggle-label input:checked + .pm-toggle-switch::before { transform: translateX(20px); } #tgh-control-panel input[type="number"], #tgh-control-panel select { width: 100%; padding: 8px 10px; border: 1px solid var(--pm-input-border); background: var(--pm-input-bg); color: var(--pm-text-color); border-radius: 5px; font-size: 12px; box-sizing: border-box; } .pm-status-box { font-size: 12px; padding: 8px 12px; margin-top: 0; background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); border-left: 4px solid var(--pm-accent-color); border-radius: 5px; text-align: center; } .pm-log-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-size: 12px; color: var(--pm-text-color); margin-top: 12px; } .pm-clear-button { background: var(--pm-subtle-bg); border: 1px solid var(--pm-border-color); color: var(--pm-text-color-secondary); font-size: 10px; padding: 3px 8px; border-radius: 5px; cursor: pointer; transition: all 0.2s; } .pm-clear-button:hover { border-color: var(--pm-accent-color); color: var(--pm-accent-color); } #tgh-log-list { font-size: 11px; height: 120px; overflow-y: auto; padding: 8px; background: var(--pm-log-bg); border: 1px solid var(--pm-border-color); border-radius: 5px; color: var(--pm-text-color-secondary); list-style: none; margin: 0; } #tgh-log-list li { padding-bottom: 4px; margin-bottom: 4px; border-bottom: 1px dashed var(--pm-border-color); } #tgh-log-list li:last-child { border-bottom: none; } #map-container { width: 100%; height: 200px; background-color: var(--pm-log-bg); border: 1px solid var(--pm-border-color); border-radius: 5px; overflow: hidden; cursor: grab; } #map-container:active { cursor: grabbing; } #dungeon-map-svg { display: block; width: 100%; height: 100%; }`);
    function updateCountdownStatus(seconds){ const el = document.getElementById('dm-countdown-status'); if(!el) return; if(seconds > 0) { const minutes = Math.floor(seconds / 60); const remainingSeconds = seconds % 60; el.innerHTML = `<i class="fa-solid fa-clock"></i> Atualizando em ${minutes}:${remainingSeconds.toString().padStart(2,"0")}`; } else { el.innerHTML = 'Aguardando atualização...'; } }
    function startCountdown(minutes){ if(minutes <= 0) return; stopCountdown(false); let seconds = minutes * 60; addLogEntry(`Refresh iniciado (${minutes} min).`); updateCountdownStatus(seconds); countdownTimerId = setInterval(() => { seconds--; updateCountdownStatus(seconds); if(seconds <= 0) { clearInterval(countdownTimerId); window.location.reload(); } }, 1000); }
    function stopCountdown(byUser = true){ if(countdownTimerId) { clearInterval(countdownTimerId); countdownTimerId = null; if(byUser) addLogEntry('Refresh parado pelo usuário.'); updateCountdownStatus(0); } }

    // --- PONTO DE ENTRADA DO SCRIPT ---
    window.addEventListener('load', () => {
        loadLogEntries();
        addLogEntry(`Script Mestre das Masmorras v17.1 (IA) iniciado.`);
        createOrUpdatePanel();
        if (scriptActive) {
            addLogEntry('Script já estava ativo. Continuando execução...');
            currentScriptState = null;
            pageRouter();
        }

        const observerTargetCheck = setInterval(() => {
            const targetNode = document.getElementById('ppm-content');
            if (targetNode) {
                clearInterval(observerTargetCheck);
                let observer = new MutationObserver(pageRouter);
                observer.observe(targetNode, { childList: true, subtree: true });
                addLogEntry('Observador de página iniciado com sucesso.');
            }
        }, 500);
    });
})();

