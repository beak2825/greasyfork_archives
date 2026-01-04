// ==UserScript==
// @name         Score + Background replacer
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Compact score display with fixed viewport positions and custom background
// @match        https://www.geoguessr.com/*
// @license      MIT
// @icon         https://i.imgur.com/yzhD2N9.png
// @grant        none
// @require      https://update.greasyfork.org/scripts/460322/1408713/Geoguessr%20Styles%20Scan.js
// @downloadURL https://update.greasyfork.org/scripts/533233/Score%20%2B%20Background%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/533233/Score%20%2B%20Background%20replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const backgroundImageUrl = "https://i.imgur.com/KBKHefn.png";

    const applyBackgroundChanges = () => {
        const elements = [
            document.querySelector('[class*="gamemaster-mode_"]'),
            document.body,
            document.querySelector('[class*="views_activeRoundWrapper__"]')
        ];
        elements.forEach(el => el && (el.style.background = `url('${backgroundImageUrl}') no-repeat center center/cover`));
    };

    const CONFIG = {
        positions: [
            { left: '35%', top: '2%', id: 'score-1' },
            { left: '65%', top: '2%', id: 'score-2' }
        ],
        boxColor: '#0C131F',
        boxStyle: {
            padding: '0.5vh 0.7vw',
            fontSize: 'min(3.7vw, 44px)',
            borderRadius: '5px',
            boxShadow: '0 0 5px rgba(0,0,0,0.4)',
            textShadow: '0 0 3px rgba(0,0,0,0.8)'
        }
    };

    let scores = [0, 0]; // Start direct bij 0 om naar 1 te kunnen gaan
    let isVisible = false;
    const scoreElements = [];

    function createScoreElements() {
        scoreElements.forEach(el => el?.remove());
        scoreElements.length = 0;

        CONFIG.positions.forEach((pos, index) => {
            const el = document.createElement('div');
            el.id = pos.id;

            Object.assign(el.style, {
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                transform: 'translate(-50%, 0)',
                zIndex: '9999',
                color: 'white',
                fontSize: CONFIG.boxStyle.fontSize,
                fontWeight: 'bold',
                fontFamily: 'var(--default-font), sans-serif',
                backgroundColor: CONFIG.boxColor,
                padding: CONFIG.boxStyle.padding,
                borderRadius: CONFIG.boxStyle.borderRadius,
                display: 'none',
                opacity: '0',
                transition: 'all 0.2s ease',
                textShadow: CONFIG.boxStyle.textShadow,
                boxShadow: CONFIG.boxStyle.boxShadow,
                whiteSpace: 'nowrap',
                lineHeight: '1.15',
                minWidth: '38px',
                maxWidth: '45px',
                textAlign: 'center',
                overflow: 'hidden'
            });

            el.textContent = scores[index];
            document.body.appendChild(el);
            scoreElements.push(el);
        });
    }

    function toggleVisibility() {
        isVisible = !isVisible;
        scoreElements.forEach(el => {
            if (!el) return;
            el.style.display = isVisible ? 'block' : 'none';
            setTimeout(() => el.style.opacity = isVisible ? '1' : '0', 10);
        });
    }

    function updateScores() {
        scoreElements.forEach((el, index) => {
            if (el) {
                el.textContent = scores[index];
                el.style.transform = 'translate(-50%, 0) scale(1.05)';
                setTimeout(() => el.style.transform = 'translate(-50%, 0) scale(1)', 150);
            }
        });
    }

    function setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Insert' || e.key === 'Home') {
                e.preventDefault();
                toggleVisibility();
                return;
            }

            if (!isVisible) return;

            // Eerst de score aanpassen, dan pas updaten
            switch(e.key) {
                case 'ArrowUp':
                    scores[0]++;
                    updateScores();
                    break;
                case 'ArrowDown':
                    scores[0]--;
                    updateScores();
                    break;
                case 'ArrowRight':
                    scores[1]++;
                    updateScores();
                    break;
                case 'ArrowLeft':
                    scores[1]--;
                    updateScores();
                    break;
            }
        });
    }

    function init() {
        if (!document.body) return setTimeout(init, 100);

        applyBackgroundChanges();
        createScoreElements();
        setupControls();

        new MutationObserver((mutations) => {
            mutations.some(m => m.type === 'childList') &&
            (applyBackgroundChanges(),
             (!scoreElements.length || !document.body.contains(scoreElements[0])) &&
             createScoreElements());
        }).observe(document.body, { childList: true, subtree: true });
    }

    document.readyState === 'complete' ? init() : window.addEventListener('load', init);
})();