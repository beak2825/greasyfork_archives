// ==UserScript==
// @name         Etiquetador de Usuarios para Menéame
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Añade etiquetas personalizadas a los nombres de los usuarios en Menéame con edición controlada
// @author       Fernando_x
// @match        https://*.meneame.net/*
// @grant        none
// @license      public domain
// @downloadURL https://update.greasyfork.org/scripts/497304/Etiquetador%20de%20Usuarios%20para%20Men%C3%A9ame.user.js
// @updateURL https://update.greasyfork.org/scripts/497304/Etiquetador%20de%20Usuarios%20para%20Men%C3%A9ame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para guardar etiquetas
    function guardarEtiqueta(usuario, etiqueta) {
        localStorage.setItem(usuario, etiqueta);
    }

    // Función para cargar etiquetas
    function cargarEtiqueta(usuario) {
        return localStorage.getItem(usuario);
    }

    // Añadir campos de etiqueta a cada comentario
    document.querySelectorAll('.comment').forEach(function(elem) {
        const usuarioElem = elem.querySelector('.username');
        const usuario = usuarioElem.textContent.trim();
        const etiquetaExistente = cargarEtiqueta(usuario) || '';

        const contenedorEtiqueta = document.createElement('span');
        const inputEtiqueta = document.createElement('input');
        inputEtiqueta.type = 'text';
        inputEtiqueta.value = etiquetaExistente;
        inputEtiqueta.style.marginLeft = '5px';
        inputEtiqueta.style.fontSize = 'smaller';
        inputEtiqueta.style.width = '150px';
        inputEtiqueta.disabled = true; // Hacer el input no editable inicialmente

        const botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';
        botonEditar.style.marginLeft = '5px';
        botonEditar.style.fontSize = 'smaller';

        // Evento para hacer la etiqueta editable
        botonEditar.addEventListener('click', function() {
            inputEtiqueta.disabled = false;
            inputEtiqueta.focus(); // Enfocar en el input para editar inmediatamente
        });

        // Evento para guardar la etiqueta al presionar Enter y hacerla no editable
        inputEtiqueta.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                guardarEtiqueta(usuario, inputEtiqueta.value);
                inputEtiqueta.disabled = true;
            }
        });

        contenedorEtiqueta.appendChild(inputEtiqueta);
        contenedorEtiqueta.appendChild(botonEditar);
        usuarioElem.parentNode.insertBefore(contenedorEtiqueta, usuarioElem.nextSibling);
    });
})();
