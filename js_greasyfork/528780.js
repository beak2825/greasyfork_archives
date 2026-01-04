// ==UserScript==
// @name         Minimap_CW_Game.
// @namespace    http://tampermonkey.net/
// @version      2025-03-05
// @description  Minimap for CW Game.
// @author       You
// @match        https://cw-game.ru/play
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cw-game.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528780/Minimap_CW_Game.user.js
// @updateURL https://update.greasyfork.org/scripts/528780/Minimap_CW_Game.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function getEntityId() {
        const element = document.querySelector('span.MuiTypography-console');
        if (element) {
            const match = element.innerText.match(/controllable entity id: ([a-f0-9]+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    function getPlayersPositions() {
        if (typeof CWGPlayground !== 'undefined' && typeof CWGPlayground.getCats === 'function') {
            const players = CWGPlayground.getCats();
            return players.map(player => {
                if (player.position && player.position.matrix1D && Array.isArray(player.position.matrix1D._data)) {
                    return { id: player.id, x: player.position.matrix1D._data[0], y: player.position.matrix1D._data[1], state: player.state?.value || 0 };
                }
                return null;
            }).filter(pos => pos !== null);
        }
        return [];
    }

    function hideElement() {
        const element = document.querySelector('.MuiBox-root.css-16e7vqz');
        if (element) {
            element.style.display = 'none';
        }
    }
    hideElement();

    let scale = parseFloat(localStorage.getItem('miniMapScale')) || 1;
    let offsetX = 0;
    let offsetY = 0;
    let lastPlayerX = -1;
    let lastPlayerY = -1;
    let forceRedraw = false; 

    const miniMapContainer = document.createElement('div');
    miniMapContainer.style.position = 'fixed';
    miniMapContainer.style.top = '2vh';
    miniMapContainer.style.left = '2vw';
    miniMapContainer.style.display = 'flex';
    miniMapContainer.style.alignItems = 'center';
    document.body.appendChild(miniMapContainer);

    const miniMap = document.createElement('div');
    miniMap.style.width = '20vw';
    miniMap.style.height = '20vh';
    miniMap.style.maxWidth = '250px';
    miniMap.style.maxHeight = '250px';
    miniMap.style.minWidth = '120px';
    miniMap.style.minHeight = '120px';
    miniMap.style.background = 'rgba(0, 0, 0, 0.7)';
    miniMap.style.border = '1px solid #444';
    miniMap.style.borderRadius = '10px';
    miniMap.style.overflow = 'hidden';
    miniMap.style.zIndex = '9999';
    miniMap.style.pointerEvents = 'none';
    miniMapContainer.appendChild(miniMap);

    const canvas = document.createElement('canvas');
    miniMap.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const worldWidth = 9;
    const worldHeight = 6;

    function resizeCanvas() {
        canvas.width = miniMap.clientWidth * scale;
        canvas.height = miniMap.clientHeight * scale;
    }

    function drawMiniMap() {
        const entityId = getEntityId();
        const playersPositions = getPlayersPositions();

        if (playersPositions.length === 0) {
            console.warn("Игроки не загружены, пробуем снова...");
            setTimeout(drawMiniMap, 500);
            return;
        }

        const player = playersPositions.find(p => p.id === entityId);

        if (!forceRedraw && (!player || (player.x === lastPlayerX && player.y === lastPlayerY))) {
            requestAnimationFrame(drawMiniMap);
            return;
        }

        lastPlayerX = player?.x || lastPlayerX;
        lastPlayerY = player?.y || lastPlayerY;

        if (scale > 1) {
            const visibleWidth = worldWidth / scale;
            const visibleHeight = worldHeight / scale;
            offsetX = Math.max(0, Math.min(worldWidth - visibleWidth, lastPlayerX - visibleWidth / 2));
            offsetY = Math.max(0, Math.min(worldHeight - visibleHeight, lastPlayerY - visibleHeight / 2));
        }

        resizeCanvas();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        playersPositions.forEach(player => {
            let color = '#0f0';
            if (player.state === 4) {
                color = '#00f';
            }

            ctx.fillStyle = player.id === entityId ? '#f00' : color;
            ctx.beginPath();
            const drawX = ((player.x - offsetX) / worldWidth) * canvas.width;
            const drawY = ((player.y - offsetY) / worldHeight) * canvas.height;
            ctx.arc(drawX, drawY, Math.max(3, canvas.width * 0.02), 0, Math.PI * 2);
            ctx.fill();
        });

        forceRedraw = false; 

        requestAnimationFrame(drawMiniMap);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.marginLeft = '10px';
    miniMapContainer.appendChild(buttonContainer);

    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.innerText = label;
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.border = 'none';
        button.style.borderRadius = '50%';
        button.style.background = '#444';
        button.style.color = 'white';
        button.style.fontSize = '20px';
        button.style.cursor = 'pointer';
        button.style.marginBottom = '5px';
        button.addEventListener('click', onClick);
        buttonContainer.appendChild(button);
    }

    createButton('+', () => {
        scale = Math.min(2, scale + 0.1);
        localStorage.setItem('miniMapScale', scale);
        forceRedraw = true; 
        resizeCanvas();
        drawMiniMap();
    });

    createButton('-', () => {
        scale = Math.max(0.5, scale - 0.1);
        localStorage.setItem('miniMapScale', scale);
        forceRedraw = true; 
        resizeCanvas();
        drawMiniMap();
    });

    createButton('=', () => {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        localStorage.setItem('miniMapScale', scale);
        forceRedraw = true; 
        resizeCanvas();
        drawMiniMap();
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
        forceRedraw = true; 
        drawMiniMap();
    });

    resizeCanvas();
    drawMiniMap();
})();


