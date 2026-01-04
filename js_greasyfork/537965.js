// ==UserScript==
// @name         Narrow.One K/D Display Pro
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enhanced K/D display with animations and effects
// @author       Wolfart & Wurenjun
// @match        *://*.narrow.one/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537965/NarrowOne%20KD%20Display%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/537965/NarrowOne%20KD%20Display%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastStats = { kills: 0, deaths: 0 };
    let lastKDLevel = 0;
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    // KD milestone thresholds and their colors
    const kdLevels = [
        { threshold: 2, color: 'darkgreen', message: 'KD Reached 2!' },
        { threshold: 3, color: 'darkblue', message: 'KD Reached 3!' },
        { threshold: 5, color: 'black', message: 'KD Reached 5!' },
        { threshold: 10, color: 'gold', message: 'KD Reached 10!' },
        { threshold: 50, color: '#51035e', message: 'KD Reached 50!' }
    ];

    function createKDUI() {
        const div = document.createElement('div');
        div.id = 'kd-hud';
        div.innerHTML = `Kills: 0 / Deaths: 0 (K/D: 0.00)`;
        Object.assign(div.style, {
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '8px 16px',
            fontSize: '16px',
            fontFamily: 'Bebas Neue, sans-serif',
            borderRadius: '8px',
            zIndex: 9999,
            boxShadow: '0 0 10px rgba(255,255,255,0.2)',
            cursor: 'move',
            userSelect: 'none',
            transition: 'all 0.5s ease-out'
        });

        // Make draggable
        div.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - div.getBoundingClientRect().left;
            offsetY = e.clientY - div.getBoundingClientRect().top;
            div.style.cursor = 'grabbing';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            div.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                div.style.left = `${e.clientX - offsetX}px`;
                div.style.top = `${e.clientY - offsetY}px`;
                div.style.transform = 'none';
            }
        });

        document.body.appendChild(div);
    }

    function showCelebration(message, color) {
        const celebration = document.createElement('div');
        celebration.textContent = message;
        Object.assign(celebration.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '48px',
            fontWeight: 'bold',
            color: color,
            textShadow: '0 0 10px rgba(255,255,255,0.7)',
            zIndex: 10000,
            opacity: '0',
            transition: 'all 1s ease-in-out',
            whiteSpace: 'nowrap'
        });
        document.body.appendChild(celebration);

        // Animate in
        setTimeout(() => {
            celebration.style.opacity = '1';
            celebration.style.transform = 'translate(-50%, -50%) scale(1.2)';
        }, 10);

        // Animate out after 3 seconds
        setTimeout(() => {
            celebration.style.opacity = '0';
            celebration.style.transform = 'translate(-50%, -50%) scale(0.8)';

            // Remove element after animation
            setTimeout(() => {
                celebration.remove();
            }, 1000);
        }, 3000);
    }

    function updateKDUI(kills, deaths) {
        const div = document.getElementById('kd-hud');
        if (!div) return;

        const kd = deaths === 0 ? kills : (kills / deaths).toFixed(2);
        div.textContent = `Kills: ${kills} / Deaths: ${deaths} (K/D: ${kd})`;

        // Calculate current KD level
        const kdValue = deaths === 0 ? kills : kills/deaths;
        let currentLevel = 0;
        let celebrationMessage = '';
        let celebrationColor = '';

        // Check if we reached a new milestone
        for (let i = kdLevels.length - 1; i >= 0; i--) {
            if (kdValue >= kdLevels[i].threshold) {
                currentLevel = kdLevels[i].threshold;
                if (currentLevel > lastKDLevel) {
                    celebrationMessage = kdLevels[i].message;
                    celebrationColor = kdLevels[i].color;
                    lastKDLevel = currentLevel;
                }
                break;
            }
        }

        // Update colors and show celebration if needed
        if (celebrationMessage) {
            // Pulse animation
            div.style.animation = 'pulse 0.5s 3';

            // Show celebration message
            showCelebration(celebrationMessage, celebrationColor);

            // Set the new color
            setTimeout(() => {
                div.style.background = celebrationColor;
                div.style.color = 'white';
                div.style.boxShadow = `0 0 20px ${celebrationColor}`;
            }, 1500);
        } else if (kdValue < 2) {
            // Reset to default if below all thresholds
            div.style.background = 'rgba(0, 0, 0, 0.7)';
            div.style.color = '#fff';
            div.style.boxShadow = '0 0 10px rgba(255,255,255,0.2)';
            lastKDLevel = 0;
        }
    }

    // Add pulse animation to style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        #kd-hud {
            transition: all 0.5s ease-out, background 0.5s ease-out, box-shadow 0.5s ease-out;
        }
    `;
    document.head.appendChild(style);

    function getPlayerStats() {
        const meRow = [...document.querySelectorAll('.playersListItem')]
            .find(row => row.querySelector('.players-list-label')?.textContent.includes('You'));

        if (!meRow) return null;

        const scoreCells = meRow.querySelectorAll('.playersListItemScore');
        const kills = parseInt(scoreCells[1]?.textContent || '0');
        const deaths = parseInt(scoreCells[2]?.textContent || '0');

        return { kills, deaths };
    }

    function tick() {
        const stats = getPlayerStats();
        if (!stats) return;

        if (stats.kills !== lastStats.kills || stats.deaths !== lastStats.deaths) {
            lastStats = stats;
            updateKDUI(stats.kills, stats.deaths);
        }
    }

    function init() {
        createKDUI();
        setInterval(tick, 1000);
    }

    window.addEventListener('load', () => setTimeout(init, 2000));
})();