// ==UserScript==
// @name         WME Places Name Normalizer
// @namespace    https://greasyfork.org/en/users/mincho77
// @version      3.0.0
// @description  Normaliza los nombres de los Places en WME según reglas de capitalización configurables
// @author       mincho77
// @match        https://www.waze.com/editor*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529708/WME%20Places%20Name%20Normalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/529708/WME%20Places%20Name%20Normalizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Palabras a evitar en minúsculas si no son la primera palabra
    const exceptions = ['el', 'la', 'los', 'las', 'de', 'del', 'y'];
    
    // Lista de palabras a no modificar (configurable por el usuario)
    let customExceptions = [];
    
    // Límite de places a modificar
    let maxChanges = 50;
    
    function normalizeName(name) {
        return name.split(' ').map((word, index) => {
            let lower = word.toLowerCase();
            if (customExceptions.includes(lower)) return word; // No cambiar si está en la lista de excepciones
            if (exceptions.includes(lower) && index !== 0) return lower; // Excepción en minúscula si no es la primera palabra
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalizar primera letra
        }).join(' ');
    }
    
    function getPlacesOnScreen() {
        return W.model.venues.objects;
    }
    
    function generateUI() {
        // Crear pestaña de ajustes y listado de lugares a modificar
    }
    
    function applyChanges() {
        // Aplicar cambios seleccionados a los lugares
    }
    
    function saveChanges() {
        // Forzar el guardado de los cambios realizados
    }
    
    function initScript() {
        generateUI();
    }
    
    initScript();
})();