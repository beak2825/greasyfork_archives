// ==UserScript==
// @name         Información Formas Vida
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Muestra la información proporcionada a la izquierda de la página con una tabla de fondo blanco.
// @author       Rhea
// @match        https://s1-es.ogame.gameforge.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494021/Informaci%C3%B3n%20Formas%20Vida.user.js
// @updateURL https://update.greasyfork.org/scripts/494021/Informaci%C3%B3n%20Formas%20Vida.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Definir un objeto que mapee las clases de los elementos <span> a los números específicos
var numerosPorClase = {
    //Humano
    "lifeformTech11101": 74,
    "lifeformTech11102": 68,
    "lifeformTech11104": 15,
    "lifeformTech11105": 10,
    "lifeformTech11107": 42,
    "lifeformTech11109": 29,
    "lifeformTech11110": 27,
    //RockTal
    "lifeformTech12101": 75,
    "lifeformTech12102": 78,
    "lifeformTech12104": 16,
    "lifeformTech12105": 11,
    "lifeformTech12108": 10,
    "lifeformTech12111": 5,
    //Kaelesh
    "lifeformTech14101": 72,
    "lifeformTech14102": 74,
    "lifeformTech14104": 13,
    "lifeformTech14105": 9,
    "lifeformTech14106": 22,
    "lifeformTech14108": 40,
    "lifeformTech14110": 11,
    //Meca
    "lifeformTech13101": 72,
    "lifeformTech13102": 83,
    "lifeformTech13104": 14,
    "lifeformTech13105": 9,
    "lifeformTech13108": 30,
    "lifeformTech13109": 22,
};

// Función para crear y agregar el número al elemento con clase "level"
var agregarNumero = (elemento, numero) => {
    // Crear un elemento <span> para el número
    var numberSpan = document.createElement('span');
    numberSpan.textContent = numero; // Asignar el número

    // Estilo para el número
    numberSpan.style.fontSize = '11px'; // Tamaño de fuente
    numberSpan.style.color = 'rgb(39, 174, 96)'; // Color del texto
    numberSpan.style.position = 'absolute'; // Posición absoluta para controlar la ubicación
    numberSpan.style.left = '20px'; // Margen a la izquierda de 20px
    numberSpan.style.fontWeight = 'bold'; // Fuente en negrita

    // Añadir el número al elemento
    elemento.appendChild(numberSpan);
};

// Iterar sobre el objeto y asignar los números a los elementos <span>
for (var clase in numerosPorClase) {
    // Buscar los elementos <span> con la clase actual
    var elementos = document.querySelectorAll('span.' + clase);

    // Verificar si se encontraron elementos con la clase actual
    if (elementos.length > 0) {
        // Obtener el número correspondiente a la clase actual
        var numero = numerosPorClase[clase];

        // Iterar sobre los elementos <span> con la clase actual
        elementos.forEach(elemento => {
            // Verificar si el elemento padre tiene un elemento con la clase "level"
            var levelElement = elemento.parentElement.querySelector('.level');
            if (levelElement) {
                // Agregar el número al elemento "level"
                agregarNumero(levelElement, numero);
            } else {
                console.error('No se encontró un elemento con la clase "level" dentro del padre');
            }
        });
    } else {
        console.error('No se encontraron elementos con la clase ' + clase);
    }
}

})();