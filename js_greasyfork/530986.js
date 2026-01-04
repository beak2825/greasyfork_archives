// ==UserScript==
// @name         Un trait sécurité deux traits danger
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sécurité routière
// @author       Bleh
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530986/Un%20trait%20s%C3%A9curit%C3%A9%20deux%20traits%20danger.user.js
// @updateURL https://update.greasyfork.org/scripts/530986/Un%20trait%20s%C3%A9curit%C3%A9%20deux%20traits%20danger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cellSize = 29.5;
    const commonFill = 'rgba(255, 0, 0, 0.07)';
    const commonStroke = 'rgba(255, 0, 0, 0.15)';

    const creatures = [
        {
            match: name => name.includes("rat") || name.includes("humain-2dih") || name.includes("humain-vtmn"),
            radius: 6,
            fillStyle: commonFill,
            strokeStyle: commonStroke
        },
        {
            match: name => (name.includes("humain") || name.includes("cyclo")) &&
                             !(name.includes("humain-2dih") || name.includes("humain-vtmn")),
            radius: 8,
            fillStyle: commonFill,
            strokeStyle: commonStroke
        }
    ];

    // --- Gestion du canvas ---
    let canvas;
    function getCanvasOverlay() {
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'x_ovl';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '2147483647';
            document.body.appendChild(canvas);
            updateCanvasSize();
        }
        return canvas;
    }
    function updateCanvasSize() {
        if (canvas) {
            canvas.width = document.documentElement.scrollWidth;
            canvas.height = document.documentElement.scrollHeight;
        }
    }

    // --- Cache pour les formes en diamant ---
    const diamondPathCache = {};
    function getDiamondPath(radius) {
        if (!diamondPathCache[radius]) {
            const path = new Path2D();
            for (let dx = -radius; dx <= radius; dx++) {
                for (let dy = -radius; dy <= radius; dy++) {
                    if (Math.abs(dx) + Math.abs(dy) <= radius) {
                        path.rect(dx * cellSize, dy * cellSize, cellSize, cellSize);
                    }
                }
            }
            diamondPathCache[radius] = path;
        }
        return diamondPathCache[radius];
    }
    function drawDiamond(ctx, centerX, centerY, radius, fillStyle, strokeStyle) {
        ctx.save();
        ctx.translate(centerX, centerY);
        const path = getDiamondPath(radius);
        ctx.fillStyle = fillStyle;
        ctx.fill(path);
        ctx.strokeStyle = strokeStyle;
        ctx.stroke(path);
        ctx.restore();
    }

    // --- Cache des éléments DOM (.info_a_afficher) ---
    let cachedInfos = [];
    let cacheNeedsRefresh = true;
    const observer = new MutationObserver(() => {
        cacheNeedsRefresh = true;
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // --- Mise à jour des overlays ---
    function updateOverlays() {
        const cv = getCanvasOverlay();
        updateCanvasSize();
        const ctx = cv.getContext('2d');
        ctx.clearRect(0, 0, cv.width, cv.height);

        if (cacheNeedsRefresh) {
            cachedInfos = Array.from(document.querySelectorAll('.info_a_afficher'));
            cacheNeedsRefresh = false;
        }

        cachedInfos.forEach(info => {
            const name = info.textContent.toLowerCase();
            if (name.includes("bébé")) return;
            creatures.forEach(creature => {
                if (creature.match(name)) {
                    const persoElement = info.closest('.icon_perso');
                    if (!persoElement) return;
                    const rect = persoElement.getBoundingClientRect();
                    const absoluteLeft = rect.left + window.scrollX;
                    const absoluteTop = rect.top + window.scrollY;
                    drawDiamond(ctx, absoluteLeft, absoluteTop, creature.radius, creature.fillStyle, creature.strokeStyle);
                }
            });
        });
    }

    // --- Optimisation des événements (scroll/resize) avec debounce ---
    let scrollResizeTimeout;
    function handleScrollResize() {
        clearTimeout(scrollResizeTimeout);
        scrollResizeTimeout = setTimeout(scheduleUpdate, 50);
    }

    window.addEventListener('resize', () => {
        updateCanvasSize();
        scheduleUpdate();
    });
    window.addEventListener('scroll', handleScrollResize);

    // --- Utilisation de requestAnimationFrame pour synchroniser les mises à jour ---
    let scheduled = false;
    function scheduleUpdate() {
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(() => {
                updateOverlays();
                scheduled = false;
            });
        }
    }

    // --- Boucle principale pour programmer les mises à jour régulières ---
    function loop() {
        scheduleUpdate();
        setTimeout(loop, 500);
    }
    loop();
})();
