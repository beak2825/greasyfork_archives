// ==UserScript==
// @name         Reparador universal del botones de YouTube ("Null")
// @name:en      Universal Repair of the YouTube buttons ("Null")
// @namespace    https://greasyfork.org/es/users/1354104-eterve-nallo
// @version      1.4.1
// @description  Repara varios botones si cambian a "null", usando el valor original detectado automáticamente (soporta todos los idiomas).
// @description:en  Repairs several buttons if they change to "NULL", using the original value automatically detected (supports all languages).
// @author       Eterve Nallo
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538954/Reparador%20universal%20del%20botones%20de%20YouTube%20%28%22Null%22%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538954/Reparador%20universal%20del%20botones%20de%20YouTube%20%28%22Null%22%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let nombreOriginalAjustes = null;
    let nombreOriginalSubtitulos = null;
    let nombreOriginalLive = null;
    let nombreOriginalVolumen = null;

    function detectarYGuardarNombre(boton, tipo) {
        const aria = boton.getAttribute("aria-label");
        const titulo = boton.getAttribute("title");

        if (tipo === "ajustes" && titulo && titulo !== "null") {
            nombreOriginalAjustes = titulo;
        }

        if (tipo === "subtitulos" && titulo && titulo !== "null") {
            nombreOriginalSubtitulos = titulo;
        }

        if (tipo === "live") {
            if (aria && aria !== "null") nombreOriginalLive = aria;
            else if (titulo && titulo !== "null") nombreOriginalLive = titulo;
        }

        if (tipo === "volumen") {
            if (aria && aria !== "null") nombreOriginalVolumen = aria;
            else if (titulo && titulo !== "null") nombreOriginalVolumen = titulo;
        }
    }

    function repararSiEsNecesario(boton, tipo) {
        const aria = boton.getAttribute("aria-label");
        const titulo = boton.getAttribute("title");

        if (tipo === "ajustes" && titulo === "null" && nombreOriginalAjustes) {
            boton.setAttribute("title", nombreOriginalAjustes);

            // 💡 Forzar reinicio de tooltip
            boton.dispatchEvent(new Event("mouseleave"));
            setTimeout(() => {
                boton.dispatchEvent(new Event("mouseenter"));
            }, 50);

            console.log("🛠️ Reparado botón de ajustes:", nombreOriginalAjustes);
        }

        if (tipo === "subtitulos" && titulo === "null" && nombreOriginalSubtitulos) {
            boton.setAttribute("title", nombreOriginalSubtitulos);
            console.log("🛠️ Reparado botón de subtítulos:", nombreOriginalSubtitulos);
        }

        if (tipo === "live" && nombreOriginalLive) {
            if (aria === "null") boton.setAttribute("aria-label", nombreOriginalLive);
            if (titulo === "null") boton.setAttribute("title", nombreOriginalLive);
            console.log("🛠️ Reparado badge en vivo:", nombreOriginalLive);
        }

        if (tipo === "volumen" && nombreOriginalVolumen) {
            if (aria === "null") boton.setAttribute("aria-label", nombreOriginalVolumen);
            if (titulo === "null") boton.setAttribute("title", nombreOriginalVolumen);
            console.log("🛠️ Reparado botón de volumen:", nombreOriginalVolumen);
        }
    }

    function monitorearBoton(selector, tipo, atributos) {
        const boton = document.querySelector(selector);
        if (!boton) {
            setTimeout(() => monitorearBoton(selector, tipo, atributos), 250);
            return;
        }

        detectarYGuardarNombre(boton, tipo);

        const observer = new MutationObserver(() => {
            detectarYGuardarNombre(boton, tipo);
            repararSiEsNecesario(boton, tipo);
        });

        observer.observe(boton, {
            attributes: true,
            attributeFilter: atributos
        });
    }

    const bodyObserver = new MutationObserver(() => {
        monitorearBoton(".ytp-settings-button", "ajustes", ["title", "aria-label"]);
        monitorearBoton(".ytp-subtitles-button", "subtitulos", ["title"]);
        monitorearBoton(".ytp-live-badge", "live", ["title", "aria-label"]);
        monitorearBoton(".ytp-volume-panel", "volumen", ["title", "aria-label"]);
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Iniciales
    monitorearBoton(".ytp-settings-button", "ajustes", ["title", "aria-label"]);
    monitorearBoton(".ytp-subtitles-button", "subtitulos", ["title"]);
    monitorearBoton(".ytp-live-badge", "live", ["title", "aria-label"]);
    monitorearBoton(".ytp-volume-panel", "volumen", ["title", "aria-label"]);
})();
