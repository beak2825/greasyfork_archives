// ==UserScript==
// @name         StumbleChat Alternate Directory View
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  display all cams for each room on the front page instead of slide show. fix sorting
// @author       You
// @match        https://stumblechat.com/*
// @match        https://www.stumblechat.com/*
// @exclude        https://stumblechat.com/room/*
// @exclude        https://www.stumblechat.com/room/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501796/StumbleChat%20Alternate%20Directory%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/501796/StumbleChat%20Alternate%20Directory%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '200px';
    buttonContainer.style.zIndex = '1000';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.alignItems = 'center';
    document.body.appendChild(buttonContainer);

    const sortButton = document.createElement('button');
    sortButton.innerHTML = 'Alternate View';
    sortButton.style.padding = '10px';
    sortButton.style.backgroundColor = '#00ff0080';
    sortButton.style.color = 'white';
    sortButton.style.border = 'none';
    sortButton.style.borderTopLeftRadius = '5px';
    sortButton.style.borderBottomLeftRadius = '5px';
    sortButton.style.cursor = 'pointer';
    sortButton.style.opacity = '0.8';
    sortButton.style.height = '40px'; // Ensure both buttons have the same height
    buttonContainer.appendChild(sortButton);

    const settingsButton = document.createElement('button');
    settingsButton.innerHTML = '⚙️';
    settingsButton.style.padding = '10px';
    settingsButton.style.backgroundColor = 'blue';
    settingsButton.style.color = 'white';
    settingsButton.style.border = 'none';
    settingsButton.style.borderTopRightRadius = '5px';
    settingsButton.style.borderBottomRightRadius = '5px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.opacity = '0.8';
    settingsButton.style.height = '40px'; // Ensure both buttons have the same height
    buttonContainer.appendChild(settingsButton);

    let originalContent = '';
    let sortedContainerWidth = '80%';
    let roomInfoBorderColor = 'orange';
    let gridTemplateColumnsMinmax = '300px';
    let showCameras = false;
    let conspiracyTalkRoom = null;

    function removeConspiracyTalkRoom() {
        const rooms = document.querySelectorAll('.grid-item');
        rooms.forEach(room => {
            const roomName = room.querySelector('.roomname h3').textContent;
            if (roomName.toLowerCase() === 'conspiracytalk') {
                conspiracyTalkRoom = room.cloneNode(true);
                room.remove();
            }
        });
    }

    function sortRooms() {
        const content = document.querySelector('.content');
        if (!originalContent) {
            originalContent = content.innerHTML;
        }

        const rooms = Array.from(document.querySelectorAll('.grid-item'));
        if (conspiracyTalkRoom) {
            rooms.push(conspiracyTalkRoom.cloneNode(true));
        }

        rooms.sort((a, b) => {
            const aBroadcasters = parseInt(a.querySelector('.detailbadge.broadcast').textContent);
            const bBroadcasters = parseInt(b.querySelector('.detailbadge.broadcast').textContent);
            const aUsers = parseInt(a.querySelector('.detailbadge.users').textContent);
            const bUsers = parseInt(b.querySelector('.detailbadge.users').textContent);

            if (aBroadcasters === bBroadcasters) {
                return bUsers - aUsers;
            }
            return bBroadcasters - aBroadcasters;
        });

        content.innerHTML = '';

        const sortedContainer = document.createElement('div');
        sortedContainer.style.display = 'flex';
        sortedContainer.style.flexDirection = 'column';
        sortedContainer.style.alignItems = 'center';
        sortedContainer.style.width = sortedContainerWidth;
        sortedContainer.style.margin = '0 auto';

        rooms.forEach(room => {
            const roomName = room.querySelector('.roomname h3').textContent;
            const broadcasters = room.querySelector('.detailbadge.broadcast').textContent;
            const users = room.querySelector('.detailbadge.users').textContent;
            const roomLink = room.querySelector('.slideshow a').getAttribute('href');

            const roomInfo = document.createElement('div');
            roomInfo.style.margin = '10px';
            roomInfo.style.padding = '10px';
            roomInfo.style.borderRadius = '1rem';
            roomInfo.style.backgroundColor = '#00000080';
            roomInfo.style.width = '100%';
            roomInfo.style.textAlign = 'center';
            roomInfo.style.color = 'white';
            roomInfo.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            roomInfo.style.border = `2px solid ${roomInfoBorderColor}`;
            roomInfo.style.cursor = 'pointer';

            if (roomName.toLowerCase() === 'conspiracytalk') {
                roomInfo.innerHTML = `
                    <h1 style="font-family: Impact; color: red; animation: flash 1s infinite;">PEDO ROOM</h1>
                `;
                roomInfo.style.cursor = 'pointer';

                const toggleButton = document.createElement('button');
                toggleButton.innerHTML = '💀';
                toggleButton.style.position = 'absolute';
                toggleButton.style.bottom = '10px';
                toggleButton.style.left = '10px';
                toggleButton.style.backgroundColor = 'transparent';
                toggleButton.style.border = 'none';
                toggleButton.style.color = 'white';
                toggleButton.style.fontSize = '20px';
                toggleButton.style.cursor = 'pointer';
                toggleButton.addEventListener('click', () => {
                    showCameras = !showCameras;
                    if (showCameras) {
                        roomInfo.innerHTML = `
                            <h3>${roomName}</h3>
                            <p>Broadcasters: ${broadcasters}</p>
                            <p>Users: ${users}</p>
                        `;
                        const slideshow = room.querySelector('.slideshow').cloneNode(true);
                        const slides = slideshow.querySelectorAll('.slides');
                        const gridContainer = document.createElement('div');
                        gridContainer.style.display = 'grid';
                        gridContainer.style.gridTemplateColumns = `repeat(auto-fill, minmax(${gridTemplateColumnsMinmax}, 1fr))`;
                        gridContainer.style.gap = '5px';
                        gridContainer.style.padding = '5px';
                        gridContainer.style.justifyContent = 'center';
                        gridContainer.style.borderRadius = '5px';

                        slides.forEach(slide => {
                            const img = slide.querySelector('img');
                            if (img) {
                                const imgContainer = document.createElement('div');
                                imgContainer.style.borderRadius = '5px';
                                imgContainer.style.overflow = 'hidden';
                                img.style.width = '100%';
                                img.style.height = 'auto';
                                imgContainer.appendChild(img.cloneNode(true));
                                gridContainer.appendChild(imgContainer);
                            }
                        });

                        roomInfo.appendChild(gridContainer);
                    } else {
                        roomInfo.innerHTML = `
                            <h1 style="font-family: Impact; color: red; animation: flash 1s infinite;">PEDO ROOM</h1>
                        `;
                    }
                    roomInfo.appendChild(toggleButton);
                });
                roomInfo.appendChild(toggleButton);

                roomInfo.addEventListener('click', () => {
                    alert('What is on your harddrive?');
                });
            } else {
                roomInfo.innerHTML = `
                    <h3>${roomName}</h3>
                    <p>Broadcasters: ${broadcasters}</p>
                    <p>Users: ${users}</p>
                `;
                roomInfo.addEventListener('click', () => {
                    window.location.href = roomLink;
                });
            }

            const slideshow = room.querySelector('.slideshow').cloneNode(true);
            const slides = slideshow.querySelectorAll('.slides');
            const gridContainer = document.createElement('div');
            gridContainer.style.display = 'grid';
            gridContainer.style.gridTemplateColumns = `repeat(auto-fill, minmax(${gridTemplateColumnsMinmax}, 1fr))`;
            gridContainer.style.gap = '5px';
            gridContainer.style.padding = '5px';
            gridContainer.style.justifyContent = 'center';
            gridContainer.style.borderRadius = '5px';

            slides.forEach(slide => {
                const img = slide.querySelector('img');
                if (img) {
                    const imgContainer = document.createElement('div');
                    imgContainer.style.borderRadius = '5px';
                    imgContainer.style.overflow = 'hidden';
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    imgContainer.appendChild(img.cloneNode(true));
                    gridContainer.appendChild(imgContainer);
                }
            });

            roomInfo.appendChild(gridContainer);
            sortedContainer.appendChild(roomInfo);
        });

        content.appendChild(sortedContainer);

        sortButton.innerHTML = 'Show Original View';
        sortButton.style.backgroundColor = '#ff000080';
        sortButton.removeEventListener('click', sortRooms);
        sortButton.addEventListener('click', showOriginalView);
    }

    function showOriginalView() {
        const content = document.querySelector('.content');
        content.innerHTML = originalContent;
        removeConspiracyTalkRoom();

        sortButton.innerHTML = 'Alternate View';
        sortButton.style.backgroundColor = '#00ff0080';
        sortButton.removeEventListener('click', showOriginalView);
        sortButton.addEventListener('click', sortRooms);
    }

    function openSettings() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '60px'; // Positioned below the settings button
        modal.style.right = '200px'; // Align with the settings button
        modal.style.zIndex = '1001';
        modal.style.backgroundColor = '#000000cc';
        modal.style.padding = '20px';
        modal.style.borderRadius = '1rem';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        modal.style.color = '#ffff33';

        const form = document.createElement('form');
        form.style.display = 'grid';
        form.style.gridTemplateColumns = 'auto 1fr';
        form.style.gap = '10px';
        form.innerHTML = `
            <label for="gridTemplateColumnsMinmax">Cam Size:</label>
            <input type="range" id="gridTemplateColumnsMinmax" min="100" max="500" value="${gridTemplateColumnsMinmax.replace('px', '')}" step="1">

            <label for="sortedContainerWidth">Width:</label>
            <input type="range" id="sortedContainerWidth" min="20" max="100" value="${sortedContainerWidth.replace('%', '')}" step="1">

            <label for="roomInfoBorderColor">Border Color:</label>
            <input type="color" id="roomInfoBorderColor" value="${roomInfoBorderColor}">

            <button type="button" id="saveSettings" style="background-color: blue; color: white; border-radius: 5px; padding: 5px; width: 50%;">Save</button>
            <button type="button" id="closeSettings" style="background-color: red; color: white; border-radius: 5px; padding: 5px; width: 50%;">Cancel</button>
        `;

        modal.appendChild(form);
        document.body.appendChild(modal);

        const saveButton = document.getElementById('saveSettings');
        saveButton.addEventListener('click', () => {
            gridTemplateColumnsMinmax = `${document.getElementById('gridTemplateColumnsMinmax').value}px`;
            sortedContainerWidth = `${document.getElementById('sortedContainerWidth').value}%`;
            roomInfoBorderColor = document.getElementById('roomInfoBorderColor').value;
            document.body.removeChild(modal);
            showOriginalView();
            sortRooms();
        });

        const closeButton = document.getElementById('closeSettings');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    settingsButton.addEventListener('click', openSettings);
    sortButton.addEventListener('click', sortRooms);

    // Wait 1 second and then toggle alternate view and back to original view to remove the room
    setTimeout(() => {
        sortRooms();
    }, 1000);

    // CSS for flashing text
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes flash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();
