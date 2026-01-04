// ==UserScript==
// @name            KickALL en wanderers.io
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Kick all Wanderers io Crash 
// @author       ElHACK000
// @match        https://wanderers.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/476714/KickALL%20en%20wanderersio.user.js
// @updateURL https://update.greasyfork.org/scripts/476714/KickALL%20en%20wanderersio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear el menú en forma de cuadro con bordes
    var menuElement = document.createElement('div');
    menuElement.id = 'kickAllMenu';
    menuElement.innerHTML = '<button id="kickAllButton">KickAll</button>';
    document.body.appendChild(menuElement);

    // Estilo del menú
    GM_addStyle(`
        #kickAllMenu {
            position: fixed;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            background-color: #ccc;
            border: 2px solid #000;
            padding: 10px;
            z-index: 9999;
        }
    `);

    // Agregar el evento click a la opción KickAll
    var kickAllButton = document.getElementById('kickAllButton');
    kickAllButton.addEventListener('click', function() {
        // Enviar el comando "drop"
        app.game.send("drop");
    });
})();
