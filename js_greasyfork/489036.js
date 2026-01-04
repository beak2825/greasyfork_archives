// ==UserScript==
// @name         [KPX] More Menu Buttons
// @namespace    https://cartelempire.online/
// @version      0.4
// @description  CartelEmpire menu buttons with configuration
// @author       KPCX
// @match        https://cartelempire.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489036/%5BKPX%5D%20More%20Menu%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/489036/%5BKPX%5D%20More%20Menu%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Detect if the user prefers dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Change the text color based on the user's preference
    const textColor = prefersDarkMode ? 'white' : 'black';

    // Apply the text color to the dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.style.color = textColor;
    });

    let newButtons = [
        { name: 'Item Market', link: '/Market' },
        { name: 'Casino', link: '/Casino' },
        { name: 'Club Sicarios', link: '/Town/Club' },
        { name: 'Cartel Armory', link: '/Cartel/Armory' },
        { name: 'Cartel Attack Records', link: '/Cartel/AllFights' },
        { name: 'Armed Surplus', link: '/Town/ArmedSurplus' },
        { name: 'Pharmacy', link: '/Town/Pharmacy' },
        { name: 'Mateos', link: '/Town/Mateos' },
        { name: 'Pet Shop', link: '/PetShop' },
        { name: 'Estate Agent', link: '/Town/EstateAgent' },
        { name: 'Diablos', link: '/Town/Diablos' },
        { name: 'Drug Den', link: '/Town/DrugDen' },
        { name: 'Bounties', link: '/Bounty' },
        { name: 'Dealership', link: '/Town/Dealership' },
        { name: 'Construction', link: '/Town/Construction' },
        { name: 'Hospital', link: '/Hospital' },
        { name: 'Jail', link: '/Jail' },
        { name: 'Cartel War', link: '/Cartel/Territory' },
        { name: 'Beeps', link: 'https://beeps.be/' }
    ];

    // Load the button order from local storage
    const buttonOrder = JSON.parse(localStorage.getItem('buttonOrder'));
    if (buttonOrder) {
        newButtons.sort((a, b) => buttonOrder.indexOf(a.name) - buttonOrder.indexOf(b.name));
    }

    const buttonStates = JSON.parse(localStorage.getItem('buttonStates')) || {};
    const menu = document.getElementById('menu');

    newButtons.forEach(button => {
        if (buttonStates[button.name] !== 'Disabled') {
            const li = document.createElement('li');
            li.style.cssText = 'display: flex; align-items: center';

            const a = document.createElement('a');
            a.className = 'nav-link px-md-0 px-2 leftNavLink';
            a.href = `${button.link}`;
            a.textContent = button.name;
            a.style.marginLeft = '46px';

            li.appendChild(a);
            menu.appendChild(li);
        }
    });

    // Create a function to handle drag start
    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.classList.add('dragging');
        e.target.style.color = 'orange'; // Add this line to change the color to orange when dragging
    }

    // Create a function to handle drag end
    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        e.target.style.color = ''; // Add this line to reset the color after dragging
    }

    // Create a function to handle drag over
    function handleDragOver(e) {
        e.preventDefault();
        const draggable = document.querySelector('.dragging');
        const container = e.target.closest('tr');
        if (container && container.nodeName === 'TR') {
            const rect = container.getBoundingClientRect();
            const offset = e.clientY - rect.top - rect.height / 2;
            container.parentNode.insertBefore(draggable, offset > 0 ? container.nextSibling : container);
        }
    }

    const configureButton = document.createElement('button');
    configureButton.textContent = 'Configure Menu';
    configureButton.style.backgroundColor = 'rgba(33, 37, 41, 1)';
    configureButton.className = 'btn btn-outline-dark mt-2';
    configureButton.style.color = '#fff';
    configureButton.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(33, 37, 41, 1); padding: 8px; z-index: 1000; border: 1px solid transparent';

        // Change the text color of the modal based on the user's preference
        modal.style.color = textColor;

        const table = document.createElement('table');
        table.style.width = '100%'; // Add this line to set the table width to 100%
        newButtons.forEach(button => {
            const tr = document.createElement('tr');
            tr.draggable = true; // Make the table row draggable
            tr.id = button.name; // Give the table row an id
            tr.addEventListener('dragstart', handleDragStart); // Add event listener for drag start
            tr.addEventListener('dragend', handleDragEnd); // Add event listener for drag end
            tr.addEventListener('dragover', handleDragOver); // Add event listener for drag over

            const tdToggle = document.createElement('td');
            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.checked = buttonStates[button.name] !== 'Disabled';
            toggle.addEventListener('change', () => {
                buttonStates[button.name] = toggle.checked ? 'Enabled' : 'Disabled';
            });
            tdToggle.appendChild(toggle);
            tr.appendChild(tdToggle);

            const tdName = document.createElement('td');
            tdName.textContent = button.name;
            tr.appendChild(tdName);

            table.appendChild(tr);
        });

        modal.appendChild(table);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.backgroundColor = 'rgba(33, 37, 41, 1)';
        saveButton.className = 'btn btn-outline-dark mt-2';
        saveButton.style.color = '#fff';
        saveButton.style.marginLeft = '5px';
        saveButton.addEventListener('click', () => {
            localStorage.setItem('buttonStates', JSON.stringify(buttonStates));
            // Save the button order to local storage
            const buttonOrder = Array.from(table.children).map(tr => tr.id);
            localStorage.setItem('buttonOrder', JSON.stringify(buttonOrder));
            location.reload();
        });
        modal.appendChild(saveButton);

        // Add a reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.backgroundColor = 'rgba(33, 37, 41, 1)';
        resetButton.className = 'btn btn-outline-dark mt-2';
        resetButton.style.color = '#fff';
        resetButton.style.marginLeft = '10px';
        resetButton.addEventListener('click', () => {
            localStorage.removeItem('buttonOrder'); // Remove the saved button order from local storage
            location.reload();
        });
        modal.appendChild(resetButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.backgroundColor = 'rgba(33, 37, 41, 1)';
        closeButton.className = 'btn btn-outline-dark mt-2';
        closeButton.style.color = '#fff';
        closeButton.style.marginLeft = '10px';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modal.appendChild(closeButton);

        document.body.appendChild(modal);
    });

    menu.insertBefore(configureButton, menu.firstChild);
})();