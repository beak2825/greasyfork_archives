// ==UserScript==
// @name         AADL 3 Auto refrech & notification By Gouri Oussama
// @namespace    http://facebook.com/dz.mind.injector1
// @version      1.0
// @description  Sends three Pushbullet notifications with a styled visual indicator and sound when a keyword is found, with a floating ball and an interactive table to select clients and display their information in AADL 3 Dz
// @author       Gouri Oussama
// @match        https://aadl3inscription2024.dz/AR/Inscription-desktop.php
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500514/AADL%203%20Auto%20refrech%20%20notification%20By%20Gouri%20Oussama.user.js
// @updateURL https://update.greasyfork.org/scripts/500514/AADL%203%20Auto%20refrech%20%20notification%20By%20Gouri%20Oussama.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const accessToken = 'o.x23gvFghbhBq9Xeu0A6B7pZYBoxJq1xs'; // Replace with your Pushbullet access token - create account if you don't have and fusion him with your phone with same email
    const keyword = 'للتسجيل'; // Keyword to search for
    let notificationCount = 0; // Notification counter
    const maxNotifications = 3; // Maximum notifications to send
    const audio = new Audio('https://audio-previews.elements.envatousercontent.com/files/192094861/preview.mp3?response-content-disposition=attachment%3B+filename%3D%2295T3CM7-alarm-epic.mp3%22'); // Sound URL

    // Styling for visual indicator
    const visualIndicator = document.createElement('div');
    visualIndicator.style.position = 'fixed';
    visualIndicator.style.bottom = '10px'; // Position at the bottom right
    visualIndicator.style.right = '10px';
    visualIndicator.style.width = '120px';
    visualIndicator.style.height = '120px';
    visualIndicator.style.borderRadius = '50%';
    visualIndicator.style.backgroundColor = 'red'; // Default color, changes to green on keyword found
    visualIndicator.style.display = 'flex';
    visualIndicator.style.alignItems = 'center';
    visualIndicator.style.justifyContent = 'center';
    visualIndicator.style.color = 'white';
    visualIndicator.style.fontSize = '14px';
    visualIndicator.style.fontWeight = 'bold';
    visualIndicator.style.textAlign = 'center';
    visualIndicator.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    visualIndicator.textContent = 'Attendez svp, vous aurez la chance tkt';
    visualIndicator.style.animation = 'floating 2s infinite';
    document.body.appendChild(visualIndicator);

    // Keyframes for floating animation
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        @keyframes floating {
            0% { transform: translateY(-10px); }
            50% { transform: translateY(10px); }
            100% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Client data
    const clients = [
        {
            name: 'client',
            nin: '1098708487422090008',
            ssc: '87220569005645',
            tel: '0671554443847'
        },
        {
            name: 'client',
            nin: '109870841013260008',
            ssc: '87132600876841',
            tel: '066655444'
        },
        {
            name: 'client',
            nin: '119650841051680005',
            ssc: '655168000249',
            tel: '066294874560'
        },
        {
            name: 'client',
            nin: '119730841042040008',
            ssc: '734204000761',
            tel: '069718780716'
        },
        {
            name: 'client',
            nin: '1099305841058780009',
            ssc: '9358780501036',
            tel: '06611799729'
        }
    ];

    // Create select dropdown for clients
    const selectClient = document.createElement('select');
    selectClient.style.position = 'fixed';
    selectClient.style.bottom = '10px'; // Position at the bottom left
    selectClient.style.left = '10px';
    selectClient.style.backgroundColor = 'red';
    selectClient.style.color = 'white';
    selectClient.style.padding = '8px';
    selectClient.style.fontSize = '14px';
    selectClient.style.width = '200px';
    selectClient.innerHTML = clients.map(client => `<option value="${client.name}">${client.name}</option>`).join('');
    document.body.appendChild(selectClient);

    // Info display for selected client
    const infoDisplay = document.createElement('div');
    infoDisplay.style.position = 'fixed';
    infoDisplay.style.bottom = '10px'; // Position at the bottom left
    infoDisplay.style.left = '220px'; // Align to the right of the selectClient dropdown
    infoDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    infoDisplay.style.border = '1px solid #ccc';
    infoDisplay.style.padding = '10px';
    infoDisplay.style.width = '300px';
    infoDisplay.style.zIndex = '9999';
    infoDisplay.style.display = 'none'; // Hidden by default
    document.body.appendChild(infoDisplay);

    // Display client info when selected from dropdown
    selectClient.addEventListener('change', function() {
        const selectedClient = clients.find(client => client.name === this.value);
        if (selectedClient) {
            infoDisplay.innerHTML = `
                <h3>Informations du client sélectionné :</h3>
                <p><strong>NIN :</strong> ${selectedClient.nin}</p>
                <p><strong>SSC :</strong> ${selectedClient.ssc}</p>
                <p><strong>Tél :</strong> ${selectedClient.tel}</p>
            `;
        }
    });

    function checkForKeyword() {
        if (notificationCount >= maxNotifications) {
            clearInterval(checkInterval); // Stop checking every 5 seconds
            return;
        }
        if (document.body.innerText.includes(keyword)) {
            if (notificationCount < maxNotifications) {
                sendPushNotification();
                playSound();
                notificationCount++;
                visualIndicator.style.backgroundColor = 'green';
                visualIndicator.textContent = 'Félicitations';
                visualIndicator.style.animation = 'floating 2s infinite';
                // Show client info and select dropdown
                infoDisplay.style.display = 'block';
                selectClient.style.display = 'block';
            }
            if (notificationCount >= maxNotifications) {
                clearInterval(checkInterval); // Stop checking every 5 seconds
            }
        } else if (notificationCount === 0) {
            visualIndicator.style.backgroundColor = 'red';
            visualIndicator.textContent = 'Attendez svp, vous aurez la chance tkt';
        }
    }

    function sendPushNotification() {
        const data = {
            type: 'note',
            title: 'Mot-clé trouvé',
            body: `Le mot-clé "${keyword}" a été trouvé sur la page.`
        };

        fetch('https://api.pushbullet.com/v2/pushes', {
            method: 'POST',
            headers: {
                'Access-Token': accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                console.log('Notification envoyée avec succès.');
            } else {
                console.error('Erreur lors de l\'envoi de la notification.');
            }
        });
    }

    function playSound() {
        audio.play();
    }

    // Check page every 5 seconds
    const checkInterval = setInterval(checkForKeyword, 5000);

    // Check immediately after page load
    checkForKeyword();
})();
