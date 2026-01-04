// ==UserScript==
// @name         Tiny Modal
// @namespace    http://tampermonkey.net/
// @version      2024-03-28
// @description  Tiny Modal
// @author       NoLongerPure
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// ==/UserScript==

function createModal(content) {
    const modalWrapper = document.createElement('div');
    modalWrapper.id = 'tmModalWrapper';
    modalWrapper.innerHTML = `
        <div id="tmModal">
            <div id="tmModalHeader">
                <span id="tmModalCloseBtn">×</span>
            </div>
            <div id="tmModalContent">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modalWrapper);

    // Style for modal
    const modalStyle = `
        #tmModalWrapper {
            position: fixed;
            top: 50px;
            left: 50px;
            z-index: 9999;
        }
        #tmModal {
            border: 1px solid #ccc;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 200px;
        }
        #tmModalHeader {
            background-color: #f0f0f0;
            padding: 8px;
            border-bottom: 1px solid #ccc;
            cursor: move;
        }
        #tmModalContent {
            padding: 16px;
        }
        #tmModalCloseBtn {
            cursor: pointer;
            float: right;
            font-size: 20px;
        }
    `;
    GM_addStyle(modalStyle);

    // Make modal movable
    const modal = document.getElementById('tmModalWrapper');
    const modalHeader = document.getElementById('tmModalHeader');
    let isDragging = false;
    let offsetX, offsetY;
    let modalWidth = modal.offsetWidth;
    let modalHeight = modal.offsetHeight;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    modalHeader.addEventListener('mousedown', startDragging);
    modalHeader.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        isDragging = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
        document.addEventListener('mousemove', dragModal);
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', dragModal);
    }

    function dragModal(e) {
        if (isDragging) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // Ensure modal does not go past the left edge of the screen
            const leftEdge = Math.max(newX, 0);

            // Ensure modal does not go past the top edge of the screen
            const topEdge = Math.max(newY, 0);

            // Ensure modal does not go past the right edge of the screen
            const rightEdge = Math.min(newX, window.innerWidth - modal.offsetWidth);

            // Ensure modal does not go past the bottom edge of the screen
            const bottomEdge = Math.min(newY, window.innerHeight - modal.offsetHeight);

            modal.style.left = `${Math.min(Math.max(leftEdge, 0), window.innerWidth - modal.offsetWidth)}px`;
            modal.style.top = `${Math.min(Math.max(topEdge, 0), window.innerHeight - modal.offsetHeight)}px`;
        }
    }


    // Close modal when close button is clicked
    const closeBtn = document.getElementById('tmModalCloseBtn');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}
