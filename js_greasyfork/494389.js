// ==UserScript==
// @name         menu style aa
// @description  menu for me
// @author       Blobby5785
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    const cssStyles = `
        #modMenus {
            display: block;
            padding: 5px;
            background-color: rgba(0, 0, 0, 0.25);
            border-radius: 4px;
            position: absolute;
            left: 0;
            top: 0;
            min-width: 5px;
            max-width: 100px;
            min-height: 5px;
            max-height: 200px;
        }

        .menuItem {
            display: block;
            margin-bottom: 5px;
        }

        .menuItemLabel {
            color: #fff;
            font-size: 12px;
            cursor: pointer;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = cssStyles;
    document.head.appendChild(styleElement);

    const modMenus = document.createElement('div');
    modMenus.id = 'modMenus';
    document.body.appendChild(modMenus);

    const menuItems = document.createElement('div');
    menuItems.id = 'menuItems';
    modMenus.appendChild(menuItems);

    const menuItem = document.createElement('label');
    menuItem.classList.add('menuItem');

    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.id = 'steal';
    menuItem.appendChild(checkboxInput);

    const menuItemLabel = document.createElement('span');
    menuItemLabel.classList.add('menuItemLabel');
    menuItemLabel.textContent = 'Steal';
    menuItem.appendChild(menuItemLabel);

    menuItems.appendChild(menuItem);
})();