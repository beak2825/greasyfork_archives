// ==UserScript==
// @name         OGame - Enviar recursos al planeta principal
// @namespace    https://github.com/Sri7ach1
// @version      1.0
// @description  Enviar recursos al planeta principal
// @author       Sri7ach1
// @match        https://*.ogame.gameforge.com/game/index.php?page=*
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/531867/OGame%20-%20Enviar%20recursos%20al%20planeta%20principal.user.js
// @updateURL https://update.greasyfork.org/scripts/531867/OGame%20-%20Enviar%20recursos%20al%20planeta%20principal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function goToFleetPage(colonyId) {
        window.location.href = `https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&cp=${colonyId}`;
    }

    function getMainPlanetName() {
        return localStorage.getItem('ogameMainPlanet') || '';
    }

    function setMainPlanetName(name) {
        localStorage.setItem('ogameMainPlanet', name);
    }

    function getShipsToSend() {
        return parseInt(localStorage.getItem('ogameShipsToSend')) || 25;
    }

    function setShipsToSend(amount) {
        localStorage.setItem('ogameShipsToSend', amount);
    }

    function identifyPlanets() {
        const planets = Array.from(document.querySelectorAll('#planetList .smallplanet'));
        const mainPlanetName = getMainPlanetName();

        const mainPlanet = mainPlanetName ?
            planets.find(planet => planet.querySelector('.planet-name')?.innerText.includes(mainPlanetName)) :
            planets[0];

        if (!mainPlanet) {
            console.error('No se encontró el planeta principal');
            return null;
        }

        const colonies = planets.filter(planet => planet !== mainPlanet);

        const result = {
            mainPlanet: {
                id: mainPlanet.id.replace('planet-', ''),
                coords: mainPlanet.querySelector('.planet-koords').innerText.replace('[','').replace(']',''),
                name: mainPlanet.querySelector('.planet-name').innerText
            },
            colonies: colonies.map(colony => ({
                id: colony.id.replace('planet-', ''),
                coords: colony.querySelector('.planet-koords').innerText.replace('[','').replace(']',''),
                name: colony.querySelector('.planet-name').innerText
            }))
        };

        console.log('Planeta principal:', result.mainPlanet);
        console.log('Colonias:', result.colonies);

        return result;
    }

    async function processColony(colonyId, mainPlanetCoords, shipsToSend) {
        const state = getState();
        const lastReload = parseInt(localStorage.getItem('lastReload') || '0');
        if (Date.now() - lastReload < 1000) {
            console.log('Detectada recarga múltiple, esperando...');
            await new Promise(r => setTimeout(r, 1000));
        }

        if (state?.waitingForNextColony) {
            console.log('Preparando siguiente colonia...');
            const nextIndex = state.currentColonyIndex + 1;
            if (nextIndex < state.colonies.length) {
                saveState(nextIndex, state.colonies, state.mainPlanet, state.shipsToSend, false);
                await new Promise(r => setTimeout(r, 1000));
                goToFleetPage(state.colonies[nextIndex].id);
            } else {
                console.log('¡Proceso completado para todas las colonias!');
                clearState();
            }
            return;
        }

        console.log('Procesando colonia:', colonyId);

        await new Promise(r => setTimeout(r, 1500));

        const cargoShips = document.querySelector('input[name="transporterLarge"]');
        if (cargoShips) {
            console.log('Seleccionando', shipsToSend, 'naves de carga grandes');
            cargoShips.value = '';
            cargoShips.dispatchEvent(new Event('change', { bubbles: true }));
            await new Promise(r => setTimeout(r, 300));

            cargoShips.value = String(shipsToSend);
            cargoShips.dispatchEvent(new Event('change', { bubbles: true }));
            cargoShips.dispatchEvent(new Event('blur', { bubbles: true }));
            await new Promise(r => setTimeout(r, 500));

            console.log('Naves seleccionadas:', cargoShips.value);
        } else {
            console.error('No se encontró el input de naves de carga grandes');
            return;
        }

        const continueBtn = document.querySelector('#continueToFleet2');
        if (continueBtn) {
            continueBtn.click();
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log('Cargando recursos...');
        const allResourcesBtn = document.querySelector('#allresources');
        if (allResourcesBtn) {
            allResourcesBtn.click();
            await new Promise(r => setTimeout(r, 1500));
        }

        console.log('Seleccionando misión de transporte...');
        const missionSelect = document.querySelector('#missions .transportIcon');
        if (missionSelect) {
            missionSelect.click();
            console.log('Misión de transporte seleccionada');
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log('Estableciendo coordenadas destino:', mainPlanetCoords);
        const [galaxy, system, position] = mainPlanetCoords.split(':');

        const galaxyInput = document.querySelector('input[name="galaxy"]');
        const systemInput = document.querySelector('input[name="system"]');
        const positionInput = document.querySelector('input[name="position"]');

        if (galaxyInput && systemInput && positionInput) {
            galaxyInput.value = galaxy;
            galaxyInput.dispatchEvent(new Event('change', { bubbles: true }));
            galaxyInput.dispatchEvent(new Event('keyup', { bubbles: true }));
            await new Promise(r => setTimeout(r, 500));

            systemInput.value = system;
            systemInput.dispatchEvent(new Event('change', { bubbles: true }));
            systemInput.dispatchEvent(new Event('keyup', { bubbles: true }));
            await new Promise(r => setTimeout(r, 500));

            positionInput.value = position;
            positionInput.dispatchEvent(new Event('change', { bubbles: true }));
            positionInput.dispatchEvent(new Event('keyup', { bubbles: true }));
            await new Promise(r => setTimeout(r, 500));
        }

        const planetTargetBtn = document.querySelector('.targetIcon.planet');
        if (planetTargetBtn) {
            planetTargetBtn.click();
            await new Promise(r => setTimeout(r, 500));
        }

        let attempts = 0;
        const maxAttempts = 5;
        let destinationVerified = false;

        while (attempts < maxAttempts && !destinationVerified) {
            await new Promise(r => setTimeout(r, 1000));
            const targetName = document.querySelector('#targetPlanetName');
            if (targetName) {
                console.log('Planeta destino actual:', targetName.textContent);
                if (targetName.textContent.includes('Mydoom')) {
                    console.log('Destino verificado correctamente');
                    destinationVerified = true;
                } else {
                    console.log('El destino aún no es correcto, reintentando...');
                    attempts++;
                }
            }
        }

        if (!destinationVerified) {
            console.error('No se pudo verificar el destino correcto');
            return;
        }

        console.log('Intentando enviar flota...');
        const sendFleetBtn = Array.from(document.querySelectorAll('a span'))
            .find(span => span.textContent === 'Enviar flota')?.parentElement;

        if (sendFleetBtn) {
            console.log('Botón de envío encontrado, enviando flota...');
            saveState(state.currentColonyIndex, state.colonies, state.mainPlanet, state.shipsToSend, true);
            await new Promise(r => setTimeout(r, 500));
            sendFleetBtn.click();
        } else {
            console.error('No se encontró el enlace de envío de flota');
        }
    }

    function saveState(currentColonyIndex, colonies, mainPlanet, shipsToSend, waitingForNextColony = false) {
        const timestamp = Date.now();
        const lastReload = localStorage.getItem('lastReload') || '0';

        if (timestamp - parseInt(lastReload) < 2000) {
            console.log('Evitando recarga múltiple');
            return;
        }

        localStorage.setItem('lastReload', timestamp.toString());
        localStorage.setItem('ogameAutoTransport', JSON.stringify({
            currentColonyIndex,
            colonies,
            mainPlanet,
            shipsToSend,
            inProgress: true,
            waitingForNextColony,
            lastProcessedTime: timestamp
        }));
    }

    function clearState() {
        localStorage.removeItem('ogameAutoTransport');
    }

    function getState() {
        const state = localStorage.getItem('ogameAutoTransport');
        return state ? JSON.parse(state) : null;
    }

    function createButton() {
        const container = document.createElement('div');
        container.style = `
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 9999;
            background: rgba(0,0,0,0.8);
            padding: 10px;
            border-radius: 5px;
        `;

        const selectContainer = document.createElement('div');
        selectContainer.style.marginBottom = '10px';

        const select = document.createElement('select');
        select.style = `
            width: 100%;
            margin-bottom: 5px;
            padding: 5px;
            background: #1b1b1b;
            color: white;
            border: 1px solid #3e3e3e;
        `;

        const planets = Array.from(document.querySelectorAll('#planetList .smallplanet'));
        planets.forEach(planet => {
            const name = planet.querySelector('.planet-name').innerText;
            const option = document.createElement('option');
            option.value = name;
            option.text = name;
            if (name === getMainPlanetName()) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        select.onchange = () => {
            setMainPlanetName(select.value);
        };

        const label = document.createElement('div');
        label.textContent = 'Planeta Principal:';
        label.style.marginBottom = '5px';
        label.style.color = 'white';

        selectContainer.appendChild(label);
        selectContainer.appendChild(select);

        const inputContainer = document.createElement('div');
        inputContainer.style = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 5px;
        `;

        const input = document.createElement('input');
        input.type = 'number';
        input.value = getShipsToSend().toString();
        input.min = '1';
        input.style = `
            width: 60px;
            padding: 5px;
        `;
        input.title = 'Número de naves de carga grandes a enviar';
        
        input.onchange = () => {
            setShipsToSend(parseInt(input.value) || 25);
        };

        const inputLabel = document.createElement('span');
        inputLabel.textContent = 'Naves de Carga Grande';
        inputLabel.style = `
            color: white;
            font-size: 12px;
        `;

        inputContainer.appendChild(input);
        inputContainer.appendChild(inputLabel);

        const btn = document.createElement('button');
        btn.innerHTML = '📦 Enviar a Principal';
        btn.style = `
            display: block;
            padding: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            width: 100%;
        `;

        btn.onclick = async () => {
            const shipsToSend = getShipsToSend();
            const { mainPlanet, colonies } = identifyPlanets();

            if (confirm(`¿Enviar recursos usando ${shipsToSend} naves desde ${colonies.length} colonias al planeta principal?`)) {
                saveState(0, colonies, mainPlanet, shipsToSend);
                goToFleetPage(colonies[0].id);
            }
        };

        container.appendChild(selectContainer);
        container.appendChild(inputContainer);
        container.appendChild(btn);
        document.body.appendChild(container);
    }

    async function init() {
        if (!window.location.href.includes('component=fleetdispatch')) {
            setTimeout(createButton, 2000);
        } else {
            const state = getState();
            if (state && state.inProgress) {
                const lastReload = parseInt(localStorage.getItem('lastReload') || '0');

                if (Date.now() - state.lastProcessedTime > 5 * 60 * 1000) {
                    console.log('Estado expirado, reiniciando proceso...');
                    clearState();
                    return;
                }

                if (Date.now() - lastReload < 2000) {
                    console.log('Recarga detectada muy cercana, esperando...');
                    await new Promise(r => setTimeout(r, 2000));
                }

                console.log(`Continuando proceso: Colonia ${state.currentColonyIndex + 1} de ${state.colonies.length}`);
                await processColony(state.colonies[state.currentColonyIndex].id, state.mainPlanet.coords, state.shipsToSend);
            }
        }
    }

    init().catch(console.error);

})();