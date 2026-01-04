// ==UserScript==
// @name         Bonk.io Room spammer
// @version      1.2
// @description  Creates multiple rooms in Bonk.io
// @author       charliecheats
// @match        https://bonk.io/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1188302
// @downloadURL https://update.greasyfork.org/scripts/498960/Bonkio%20Room%20spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/498960/Bonkio%20Room%20spammer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.onload = function() {
        createGUI();
    };

    function createGUI() {
        
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '1000';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.color = '#fff';
        container.style.fontFamily = 'Arial, sans-serif';

        
        const numRoomsLabel = document.createElement('label');
        numRoomsLabel.textContent = 'Number of Rooms:';
        container.appendChild(numRoomsLabel);

        const numRoomsInput = document.createElement('input');
        numRoomsInput.type = 'number';
        numRoomsInput.value = '17';
        numRoomsInput.style.marginLeft = '10px';
        numRoomsInput.style.marginBottom = '10px';
        container.appendChild(numRoomsInput);

        
        const roomNameLabel = document.createElement('label');
        roomNameLabel.textContent = 'Room Name:';
        container.appendChild(roomNameLabel);

        const roomNameInput = document.createElement('input');
        roomNameInput.type = 'text';
        roomNameInput.value = 'Cloud';
        roomNameInput.style.marginLeft = '10px';
        roomNameInput.style.marginBottom = '10px';
        container.appendChild(roomNameInput);

        
        const createButton = document.createElement('button');
        createButton.textContent = 'Create Rooms';
        createButton.style.display = 'block';
        createButton.style.marginTop = '10px';
        container.appendChild(createButton);

        document.body.appendChild(container);

        createButton.addEventListener('click', function() {
            const numRooms = parseInt(numRoomsInput.value);
            const roomName = roomNameInput.value;
            createRooms(numRooms, roomName);
        });
    }

    function createRooms(numRooms, roomName) {
        for (let i = 1; i <= numRooms; i++) {
            setTimeout(() => {
                createRoom(`${roomName} ${i}`);
            }, i * 1000); 
        }
    }

    function createRoom(roomName) {
        
        const createRoomButton = document.querySelector('#roomlistcreatebutton');
        createRoomButton.click();

        
        setTimeout(() => {
            
            const roomNameInput = document.querySelector('#roomlistcreatewindowgamename');
            roomNameInput.value = roomName;

            
            const finalCreateRoomButton = document.querySelector('#roomlistcreatecreatebutton');
            finalCreateRoomButton.click();
        }, 500); 
    }
})();
