// ==UserScript==
// @name         Freundesliste & Info für AutoDarts
// @namespace    Owl
// @version      6.0
// @description  Suche nach Spielernamen und zeige eine Info-Nachricht an, wenn sie gefunden werden.
// @match        https://play.autodarts.io/*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525052/Freundesliste%20%20Info%20f%C3%BCr%20AutoDarts.user.js
// @updateURL https://update.greasyfork.org/scripts/525052/Freundesliste%20%20Info%20f%C3%BCr%20AutoDarts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Freundesliste Script] Starte...");

    let friendList = JSON.parse(localStorage.getItem('friendList')) || [];
    let popupContainer = null;
    let isDragging = false;
    let offsetX, offsetY;
    let isMinimized = false; // Flag für Minimierung
    let isResizing = false; // Flag für das Resizing

    // Speicher-Funktion für die Freundesliste
    function savePlayerList() {
        localStorage.setItem('friendList', JSON.stringify(friendList));
    }

    // Namen in der Freundesliste anzeigen und die Farben aktualisieren
    function updateList(listElement) {
        listElement.innerHTML = '';

        // Liste alphabetisch sortieren, aber online Spieler nach oben verschieben
        friendList.sort((a, b) => {
            if (a.online === b.online) {
                return a.name.localeCompare(b.name);  // Alphabetisch sortieren
            }
            return a.online ? -1 : 1; // Online-Spieler nach oben verschieben
        });

        friendList.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;
            Object.assign(li.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 0',
                color: item.online ? 'green' : 'gray'
            });

            const followButton = document.createElement('a');
            followButton.href = `https://play.autodarts.io/boards/${item.boardId}/follow`;
            followButton.target = '_blank';
            followButton.textContent = 'Match anschauen';
            followButton.style.backgroundColor = '#4299E1';
            followButton.style.color = '#fff';
            followButton.style.border = 'none';
            followButton.style.padding = '4px 8px';
            followButton.style.borderRadius = '4px';
            li.appendChild(followButton);

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            Object.assign(removeBtn.style, {
                marginLeft: '10px',
                backgroundColor: '#C53030',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                cursor: 'pointer'
            });

            removeBtn.addEventListener('click', () => {
                const confirmDelete = window.confirm(`Möchtest du ${item.name} wirklich aus der Freundesliste entfernen?`);
                if (confirmDelete) {
                    friendList = friendList.filter(player => player.name !== item.name);
                    savePlayerList();
                    updateList(listElement);
                }
            });

            li.appendChild(removeBtn);
            listElement.appendChild(li);
        });
    }

    // Spieler überprüfen und die Farben aktualisieren
    function checkPlayers() {
        const playerTags = document.querySelectorAll('p.chakra-text.css-0');
        let foundNames = [];

        playerTags.forEach(tag => {
            const name = tag.textContent.trim().toUpperCase();
            const friend = friendList.find(item => item.name === name);
            if (friend) {
                tag.style.backgroundColor = 'blue';
                tag.style.color = 'white';
                friend.online = true; // Markiere den Spieler als online
                foundNames.push(name);
            } else {
                tag.style.backgroundColor = '';
                tag.style.color = '';
            }
        });

        updateFriendStatus(foundNames);

        // Liste automatisch aktualisieren
        const listElement = document.querySelector('#autodarts-friendlist-popup ul');
        if (listElement) {
            updateList(listElement);
        }
    }

    // Status in der Freundesliste aktualisieren
    function updateFriendStatus(onlineNames) {
        friendList.forEach(friend => {
            friend.online = onlineNames.includes(friend.name.toUpperCase());
        });
        savePlayerList();
    }

    // Popup für die Freundesliste erstellen
    function createPopup() {
        if (popupContainer) return;

        popupContainer = document.createElement('div');
        popupContainer.id = 'autodarts-friendlist-popup';

        Object.assign(popupContainer.style, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            backgroundColor: '#1A202C',
            color: '#E2E8F0',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            zIndex: '99999',
            fontFamily: 'sans-serif',
            width: 'auto',
            minWidth: '300px',
            maxWidth: '80vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            display: 'none'
        });

        // Drag-Bar zum Verschieben
        const dragBar = document.createElement('div');
        dragBar.style.height = '20px';
        dragBar.style.cursor = 'move';
        dragBar.style.marginBottom = '10px';
        popupContainer.appendChild(dragBar);

        dragBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - popupContainer.getBoundingClientRect().left;
            offsetY = e.clientY - popupContainer.getBoundingClientRect().top;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.removeEventListener('mousemove', handleMouseMove);
            });
        });

        function handleMouseMove(e) {
            if (isDragging) {
                popupContainer.style.left = `${e.clientX - offsetX}px`;
                popupContainer.style.top = `${e.clientY - offsetY}px`;
            }
        }

        // Resize-Griff für die Größe
        const resizeHandle = document.createElement('div');
        resizeHandle.style.width = '10px';
        resizeHandle.style.height = '10px';
        resizeHandle.style.backgroundColor = '#4299E1';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.bottom = '0';
        resizeHandle.style.right = '0';
        resizeHandle.style.cursor = 'se-resize';
        popupContainer.appendChild(resizeHandle);

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', () => {
                isResizing = false;
                document.removeEventListener('mousemove', handleResize);
            });
        });

        function handleResize(e) {
            if (isResizing) {
                const width = e.clientX - popupContainer.getBoundingClientRect().left;
                const height = e.clientY - popupContainer.getBoundingClientRect().top;
                popupContainer.style.width = `${width}px`;
                popupContainer.style.height = `${height}px`;
            }
        }

        const closeXButton = document.createElement('button');
        closeXButton.textContent = '×';
        closeXButton.style.position = 'absolute';
        closeXButton.style.top = '4px';
        closeXButton.style.right = '8px';
        closeXButton.style.background = 'transparent';
        closeXButton.style.border = 'none';
        closeXButton.style.color = '#E2E8F0';
        closeXButton.style.fontSize = '20px';
        closeXButton.style.lineHeight = '20px';
        closeXButton.style.cursor = 'pointer';
        closeXButton.addEventListener('click', () => togglePopup(false));
        popupContainer.appendChild(closeXButton);

        const title = document.createElement('h2');
        title.textContent = 'FREUNDESLISTE';
        title.style.marginTop = '0';
        title.style.fontSize = '1.4rem';
        title.style.fontWeight = 'bold';
        popupContainer.appendChild(title);

        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = '-';
        minimizeButton.style.position = 'absolute';
        minimizeButton.style.top = '4px';
        minimizeButton.style.right = '40px';
        minimizeButton.style.background = 'transparent';
        minimizeButton.style.border = 'none';
        minimizeButton.style.color = '#E2E8F0';
        minimizeButton.style.fontSize = '20px';
        minimizeButton.style.lineHeight = '20px';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.addEventListener('click', toggleMinimize);
        popupContainer.appendChild(minimizeButton);

        // Eingabefelder und Button
        const inputWrapper = document.createElement('div');
        inputWrapper.style.display = 'flex';
        inputWrapper.style.marginBottom = '10px';
        popupContainer.appendChild(inputWrapper);

        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.placeholder = 'Spielername';
        inputName.style.flex = '1';
        inputWrapper.appendChild(inputName);

        const inputBoardId = document.createElement('input');
        inputBoardId.type = 'text';
        inputBoardId.placeholder = 'Board ID';
        inputBoardId.style.flex = '1';
        inputWrapper.appendChild(inputBoardId);

        const addButton = document.createElement('button');
        addButton.textContent = 'Hinzufügen';
        addButton.style.padding = '4px 8px';
        inputWrapper.appendChild(addButton);

        const listElement = document.createElement('ul');
        listElement.style.listStyle = 'none';
        popupContainer.appendChild(listElement);

        function addFriend() {
            const name = inputName.value.trim();
            const boardId = inputBoardId.value.trim();
            if (name && boardId) {
                friendList.push({ name: name.toUpperCase(), boardId });
                savePlayerList();
                updateList(listElement);
            }
            inputName.value = '';
            inputBoardId.value = '';
        }

        addButton.addEventListener('click', addFriend);
        inputName.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addFriend();
            }
        });

        updateList(listElement);
        document.body.appendChild(popupContainer);
    }

    // Minimierung des Popups
    function toggleMinimize() {
        if (isMinimized) {
            popupContainer.style.width = 'auto';
            popupContainer.style.height = 'auto';
            popupContainer.style.transform = 'translate(-50%, -50%)';
            isMinimized = false;
        } else {
            popupContainer.style.width = '150px';
            popupContainer.style.height = '50px';
            popupContainer.style.transform = 'translate(0%, -10%)';
            isMinimized = true;
        }
    }

    // Popup sichtbar/unsichtbar schalten
    function togglePopup(forceOpen) {
        if (!popupContainer) {
            createPopup();
        }
        popupContainer.style.display = forceOpen === undefined ? (popupContainer.style.display === 'none' ? 'block' : 'none') : forceOpen ? 'block' : 'none';
    }

    // Menü für die Freundesliste hinzufügen
    function addFriendlistMenuItem(menuContainer) {
        let friendlistLink = document.getElementById('autodarts-friendlist-menu-item');
        if (!friendlistLink) {
            friendlistLink = document.createElement('a');
            friendlistLink.id = 'autodarts-friendlist-menu-item';
            friendlistLink.textContent = 'Freundesliste';
            friendlistLink.style.cursor = 'pointer';
            friendlistLink.addEventListener('click', () => togglePopup());
            menuContainer.appendChild(friendlistLink);
        }
    }

    // Nach der Menüleiste suchen und das Menü hinzufügen
    const intervalId = setInterval(() => {
        const menuContainer = document.querySelector('div.chakra-stack');
        if (menuContainer) {
            addFriendlistMenuItem(menuContainer);
            clearInterval(intervalId);
        }
    }, 1000);

    // Periodisches Überprüfen der Spieler
    setInterval(checkPlayers, 2000);

})();
