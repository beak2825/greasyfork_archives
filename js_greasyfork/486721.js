// ==UserScript==
// @name        IMDB - Reel Faces
// @namespace   NooScripts
// @match       https://www.imdb.com/*/fullcredits*
// @match       https://www.imdb.com/
// @grant       none
// @version     1.0
// @author      NooScripts
// @description Use some 'reel' magic on any 'Full Credits' page with the 'Reel Faces' Checkbox (When checked, It hides cast/crew that lack a profile picture) – because every movie deserves a picture-perfect cast!
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/486721/IMDB%20-%20Reel%20Faces.user.js
// @updateURL https://update.greasyfork.org/scripts/486721/IMDB%20-%20Reel%20Faces.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function toggleElements(className, imgSrc, hideNoface) {
        const elements = document.querySelectorAll(`.${className} img[src="${imgSrc}"]`);
        elements.forEach(element => {
            const parent = element.closest(`.${className}`);
            if (parent) {
                parent.classList.toggle('hidden', hideNoface);
            }
        });
    }

    function addContainer() {
        const targetElement = document.querySelector('.subpage_title_block__right-column');
        if (!targetElement) {
            console.error('Target element not found.');
            return;
        }

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'hideNofaceCheckbox';

        const label = document.createElement('label');
        label.innerHTML = 'Reel Faces';
        label.setAttribute('for', 'hideNofaceCheckbox');
        label.style.color = '#000';
        label.style.background = '#f5c518';
        label.style.padding = '2.5px';


        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;
            toggleElements('odd', 'https://m.media-amazon.com/images/S/sash/N1QWYSqAfSJV62Y.png', isChecked);
            toggleElements('even', 'https://m.media-amazon.com/images/S/sash/N1QWYSqAfSJV62Y.png', isChecked);
            checkbox.style.backgroundColor = isChecked ? 'black' : 'transparent';
        });

        // Update checkbox styles
        checkbox.style.width = '20px';
        checkbox.style.height = '20px';
        checkbox.style.backgroundColor = 'transparent';
        checkbox.style.border = '1px solid white';
        checkbox.style.borderRadius = '3px';
        checkbox.style.cursor = 'pointer';
        checkbox.style.marginRight = '5px';

        // Append checkbox, label, and container to the target element
        container.appendChild(checkbox);
        container.appendChild(label);
        targetElement.appendChild(container);
    }

    addContainer();
})();
