// ==UserScript==
// @name         Hide Passworded Rooms Feature
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Allows you to hide passworded rooms (Because theres too many :>)
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510633/Hide%20Passworded%20Rooms%20Feature.user.js
// @updateURL https://update.greasyfork.org/scripts/510633/Hide%20Passworded%20Rooms%20Feature.meta.js
// ==/UserScript==

(function() {
    'use strict';

     const targetImage = 'graphics/ui/hitbox.svg';
    const newImageSrc = 'https://i.ibb.co/F5RLpmx/hitbox-1.png';

    const images = document.querySelectorAll(`img[src="${targetImage}"]`);

    images.forEach(img => {
        const overlayImage = document.createElement('img');
        overlayImage.src = newImageSrc;
        overlayImage.style.position = 'absolute';
        overlayImage.style.left = img.offsetLeft + 'px';
        overlayImage.style.top = img.offsetTop + 'px';
        overlayImage.style.width = img.width + 'px';
        overlayImage.style.height = img.height + 'px';
        overlayImage.style.pointerEvents = 'none';
        img.parentNode.appendChild(overlayImage);
    });

    let checkbox, label, isChecked = false;

    function hideLockedRooms() {
        const roomRows = document.querySelectorAll('.roomList .scrollBox tr');
        roomRows.forEach(row => {
            const lockIcon = row.querySelector('img[src="graphics/ui/lock-outline-roomlist-2.svg"]');
            if (lockIcon) {
                row.style.display = 'none';
            }
        });
    }

    function showAllRooms() {
        const roomRows = document.querySelectorAll('.roomList .scrollBox tr');
        roomRows.forEach(row => {
            row.style.display = '';
        });
    }

    function toggleCheckbox() {
        isChecked = checkbox.checked;
        if (isChecked) {
            hideLockedRooms();
        } else {
            showAllRooms();
        }
    }

    function createCheckbox() {
        const topBar = document.querySelector('.roomList .topBar');
        topBar.textContent = '';

        const container = document.createElement('div');
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';

        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'hideLockedRooms';
        checkbox.className = 'custom-checkbox';
        checkbox.addEventListener('change', toggleCheckbox);

        label = document.createElement('label');
        label.htmlFor = 'hideLockedRooms';
        label.innerText = 'Hide Passworded';
        label.style.color = '#fff';
        label.style.cursor = 'pointer';
        label.style.marginLeft = '3px';

        container.appendChild(checkbox);
        container.appendChild(label);
        topBar.appendChild(container);

        const style = document.createElement('style');
        style.innerHTML = `
            .custom-checkbox {
                width: 20px;
                height: 20px;
                background: #303030;
                border: 1px solid #222222;
                cursor: pointer;
                position: relative;
                appearance: none;
                display: inline-block;
                outline: none;
            }

            .custom-checkbox:checked {
                background-image: url('graphics/ui/check-light.svg');
                background-size: contain;
                background-repeat: no-repeat;
            }

            .custom-checkbox:focus {
                outline: none;
            }
        `;
        document.head.appendChild(style);
    }

    function checkRoomListVisibility() {
        const roomList = document.querySelector('.roomList');
        if (roomList) {
            const isRoomListVisible = window.getComputedStyle(roomList).display !== 'none' && roomList.style.opacity === '1';
            if (!isRoomListVisible) {
                showAllRooms();
                checkbox.checked = false;
            } else if (isChecked) {
                hideLockedRooms();
            }
        }
    }

    setInterval(function() {
        if (!document.querySelector('#hideLockedRooms')) {
            createCheckbox();
        }
        checkRoomListVisibility();
    }, 1);
})();
