// ==UserScript==
// @name         MooMoo.io Mod Menu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mod menu for MooMoo.io
// @author       Your Name
// @match        https://moomoo.io/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489873/MooMooio%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/489873/MooMooio%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create mod menu container
    var menuContainer = document.createElement('div');
    menuContainer.id = 'modMenu';
    document.body.appendChild(menuContainer);

    // Style mod menu
    GM_addStyle(`
        #modMenu {
            position: fixed;
            top: 20px;
            left: 20px; /* Cambiado a la izquierda */
            background-color: rgba(0, 0, 0, 0.5); /* Negro transparente */
            border: 1px solid #000;
            padding: 10px;
            border-radius: 5px;
            color: #fff; /* Texto blanco para mejor visibilidad */
        }
        #modMenu .modOption {
            margin-bottom: 5px;
            display: flex;
            align-items: center;
        }
        #modMenu .modOption label {
            margin-right: 10px;
        }
    `);

    // Add title to mod menu
    var title = document.createElement('div');
    title.textContent = 'Revival Re Mod Menu';
    menuContainer.appendChild(title);

    // Add test options
    addOption('Test 1');
    addOption('Test 2');
    addOption('Test 3');

    function addOption(optionText) {
        var optionContainer = document.createElement('div');
        optionContainer.classList.add('modOption');

        var optionLabel = document.createElement('label');
        optionLabel.textContent = optionText;
        optionContainer.appendChild(optionLabel);

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.width = '15px';
        checkbox.style.height = '15px';
        optionContainer.appendChild(checkbox);

        menuContainer.appendChild(optionContainer);
    }

    // Show/hide mod menu on Escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (menuContainer.style.display === 'none' || !menuContainer.style.display) {
                menuContainer.style.display = 'block';
            } else {
                menuContainer.style.display = 'none';
            }
        }
    });

    // Mostrar el menú al cargar la página
    menuContainer.style.display = 'block';
})();
