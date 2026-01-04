// ==UserScript==
// @name         wplace tools
// @name:zh-CN   wplace 工具
// @namespace    http://noxylva.org/
// @version      1.2
// @description  Modifies wplace.live to display coordinates as (Tile X, Tile Y, Pixel X, Pixel Y) and enables jumping to locations using this four-part coordinate format.
// @description:zh-CN 将 wplace.live 的坐标格式替换为 (Tile X, Tile Y, Pixel X, Pixel Y) 四元组显示，并支持通过输入四元坐标快速跳转到指定位置。
// @author       Noxylva
// @match        https://wplace.live/*
// @grant        none
// @run-at       document-start
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/546687/wplace%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/546687/wplace%20tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.wplaceQuadCoordToolbox) {
        return;
    }
    window.wplaceQuadCoordToolbox = true;

    const PIXEL_ART_ZOOM = 11;
    const TILE_SIZE = 1000;

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        const pixelRegex = /backend\.wplace\.live\/s\d+\/pixel\/(\d+)\/(\d+)\?x=(\d+)&y=(\d+)/;
        const match = url.match(pixelRegex);

        if (match) {
            const [_, tileX, tileY, localX, localY] = match.map(Number);
            const coordString = `${tileX}, ${tileY}, ${localX}, ${localY}`;

            const targetElement = document.querySelector(".whitespace-nowrap");
            if (targetElement) {
                targetElement.textContent = coordString;
            }
        }
        return originalFetch.apply(this, args);
    };

    function quadCoordToLatLng(tileX, tileY, localX, localY) {
        const totalPixelX = tileX * TILE_SIZE + localX;
        const totalPixelY = tileY * TILE_SIZE + localY;

        const worldSize = Math.pow(2, PIXEL_ART_ZOOM) * TILE_SIZE;

        const normalizedX = totalPixelX / worldSize;
        const normalizedY = totalPixelY / worldSize;

        const lng = normalizedX * 360 - 180;
        const n = Math.PI - 2 * Math.PI * normalizedY;
        const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));

        return { lat, lng };
    }

    function wplaceGoToQuad(tileX, tileY, localX, localY) {
        const coords = quadCoordToLatLng(tileX, tileY, localX, localY);
        const targetZoom = PIXEL_ART_ZOOM + 2.5;
        const newUrl = `https://wplace.live/?lat=${coords.lat}&lng=${coords.lng}&zoom=${targetZoom}`;
        window.location.href = newUrl;
    }

    function startGoTo() {
        const targetElement = document.querySelector(".whitespace-nowrap");
        let prefill = "";
        if (targetElement && /^\d+,\s*\d+,\s*\d+,\s*\d+$/.test(targetElement.textContent)) {
            prefill = targetElement.textContent;
        }
        const input = prompt("Please enter the target coordinates (Tile X, Tile Y, Pixel X, Pixel Y)", prefill);
        if (!input) return;
        const parts = input.split(',').map(s => parseInt(s.trim(), 10));
        if (parts.length !== 4 || parts.some(isNaN)) {
            return;
        }
        wplaceGoToQuad(parts[0], parts[1], parts[2], parts[3]);
    }

    function injectGoToButton() {
        const targetContainer = document.querySelector("div.absolute.left-2.top-2.z-30");
        if (!targetContainer) return;

        clearInterval(injection_timer);

        const button = document.createElement('button');
        button.title = 'position';
        button.className = 'btn btn-sm btn-circle';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.58 3.963-7.488C20.146 6.848 16.54 3 12 3S3.854 6.848 3.854 12c0 2.908 2.02 5.498 3.963 7.488a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.145.742zM12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" />
            </svg>
        `;
        button.onclick = startGoTo;
        targetContainer.appendChild(button);
    }

    const injection_timer = setInterval(injectGoToButton, 500);

})();