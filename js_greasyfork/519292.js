// ==UserScript==
// @name         Ver usuarios que votaron negativo en Menéame
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Muestra los usuarios que votaron negativo en una noticia en Menéame (si están disponibles en la interfaz)
// @author       TuNombre
// @license      MIT
// @match        https://www.meneame.net/story/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519292/Ver%20usuarios%20que%20votaron%20negativo%20en%20Men%C3%A9ame.user.js
// @updateURL https://update.greasyfork.org/scripts/519292/Ver%20usuarios%20que%20votaron%20negativo%20en%20Men%C3%A9ame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para crear el banner con los usuarios que votaron negativo
    function mostrarUsuariosNegativos(usuarios) {
        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.top = '50px';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.backgroundColor = '#FF5733'; // Rojo para destacar
        banner.style.color = 'white';
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        banner.style.zIndex = '9999';
        banner.style.fontFamily = 'Arial, sans-serif';
        banner.style.fontSize = '16px';
        banner.innerHTML = '<strong>Usuarios que votaron negativo:</strong><br>' + usuarios.join(', ');

        document.body.appendChild(banner);

        // El banner desaparece después de 5 segundos
        setTimeout(() => banner.remove(), 5000);
    }

    // Función para extraer los usuarios que votaron negativo
    function obtenerUsuariosNegativos() {
        const votosNegativos = [];
        
        // Aquí buscamos los elementos que indican los usuarios que han votado negativo
        // Esto es un ejemplo, y necesitarás ajustar el selector de acuerdo a cómo se estructure la página de Menéame
        const usuariosNegativos = document.querySelectorAll('.negative-vote'); // Cambia esto según la estructura de la página

        // Extraemos los nombres de usuario (ajusta el selector según el HTML de la página)
        usuariosNegativos.forEach(usuario => {
            const nombreUsuario = usuario.querySelector('.username'); // Asegúrate de que este selector es correcto
            if (nombreUsuario) {
                votosNegativos.push(nombreUsuario.innerText.trim());
            }
        });

        return votosNegativos;
    }

    // Ejecutar la función cuando la página se haya cargado
    window.addEventListener('load', function() {
        const usuarios = obtenerUsuariosNegativos();
        
        if (usuarios.length > 0) {
            mostrarUsuariosNegativos(usuarios);
        } else {
            console.log('No se han encontrado usuarios que votaron negativo.');
        }
    });
})();