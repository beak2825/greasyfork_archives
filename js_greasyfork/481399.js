// ==UserScript==
// @name         places level wme
// @namespace    http://example.com
// @version      1.0
// @description  Script para seleccionar lugares en Waze según su nivel
// @author       Crotalo
// @match        https://www.waze.com/editor/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/481399/places%20level%20wme.user.js
// @updateURL https://update.greasyfork.org/scripts/481399/places%20level%20wme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Definir el nivel deseado (puedes cambiarlo según tus necesidades)
    const nivelObjetivo = 4;

    // Función para seleccionar lugares según su nivel
    function seleccionarPorNivel() {
        // Obtener todos los lugares en la vista
        const lugares = Waze.model.venues.objects;

        // Iterar sobre los lugares y seleccionar los que coinciden con el nivel objetivo
        for (const id in lugares) {
            if (lugares.hasOwnProperty(id)) {
                const lugar = lugares[id];
                if (lugar && lugar.attributes && lugar.attributes.level === nivelObjetivo) {
                    Waze.selectionManager.setSelectedModels([lugar]);
                }
            }
        }
    }

    // Ejecutar la función al hacer clic en un botón (puedes personalizar esto)
    const botonSeleccionar = document.createElement('button');
    botonSeleccionar.textContent = 'Seleccionar lugares nivel ' + nivelObjetivo;
    botonSeleccionar.style.position = 'absolute';
    botonSeleccionar.style.top = '10px';
    botonSeleccionar.style.left = '10px';
    botonSeleccionar.addEventListener('click', seleccionarPorNivel);

    // Agregar el botón a la interfaz de usuario
    document.body.appendChild(botonSeleccionar);
})();