// ==UserScript==
// @name         JagarZoom
// @namespace    Violentmonkey Scripts
// @version      1.0.2
// @description  Zoom for Jagar.io Ctrl – Zoom in, Alt – Zoom out DRIK ONTOP
// @author       Drik
// @match        https://jagar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532735/JagarZoom.user.js
// @updateURL https://update.greasyfork.org/scripts/532735/JagarZoom.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let zoom = 1.0;
    const minZoom = 0.1;
    const maxZoom = 3.0;

    function setZoom(level) {
        zoom = Math.max(minZoom, Math.min(maxZoom, level));
        if (window.jagarZoomTarget?.scale?.set) {
            window.jagarZoomTarget.scale.set(zoom, zoom);
        }
        const el = document.getElementById("zoomInfo");
        if (el) el.textContent = `Zoom: ${zoom.toFixed(1)}x`;
    }

    function addUI() {
        const el = document.createElement("div");
        el.id = "zoomInfo";
        el.style.position = "absolute";
        el.style.bottom = "10px";
        el.style.right = "10px";
        el.style.background = "rgba(0,0,0,0.7)";
        el.style.color = "#fff";
        el.style.padding = "6px 10px";
        el.style.fontFamily = "monospace";
        el.style.fontSize = "14px";
        el.style.zIndex = "9999";
        el.style.borderRadius = "8px";
        el.textContent = "Zoom: 1.0x";
        document.body.appendChild(el);
    }

    window.addEventListener("keydown", (e) => {
        if (!window.jagarZoomTarget) return;

        if (e.ctrlKey) {
            setZoom(zoom + 0.1);
        } else if (e.altKey) {
            setZoom(zoom - 0.1);
        }
    });

    const interval = setInterval(() => {
        if (window.mouseObject?.parent?.scale?.set) {
            window.jagarZoomTarget = mouseObject.parent;
            console.log("Zoom camera found:", jagarZoomTarget);
            addUI();
            clearInterval(interval);
        }
    }, 500);
})();
