// ==UserScript==
// @name         Magnet Link Extractor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extract and display magnet links with a single click
// @note         v1.2 updates: 
// @note         - The icon now only appears on pages with magnet links; 
// @note         - Clicking the magnet icon automatically copies all detected magnet links to the clipboard. No additional action is required;
// @note         - The panel now features a selectable design with checkboxes for better user control.
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/518203/Magnet%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/518203/Magnet%20Link%20Extractor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add CSS
    GM_addStyle(`
        #magnet-icon {
            position: fixed;
            top: 50px;
            right: 5px;
            width: 25px;
            height: 25px;
            background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjxzdmcgaGVpZ2h0PSI4MDBweCIgd2lkdGg9IjgwMHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDUxMi4wMTkgNTEyLjAxOSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBzdHlsZT0iZmlsbDojREE0NDUzOyIgZD0iTTM2NC40MzcsMjIzLjAyNkwyMDguMzczLDM3OS4wNTljLTIwLjc4MSwyMC44MTItNTQuNjI1LDIwLjgxMi03NS40MDYsMA0KCWMtMjAuODEzLTIwLjc4MS0yMC44MTMtNTQuNjI1LDAtNzUuNDA3bDE1Ni4wMzEtMTU2LjA2M0wyMDYuMDMsNjQuNjM1TDQ5Ljk5NywyMjAuNjgybDAsMGMtNjYuNjU3LDY2LjY1Ny02Ni42NTcsMTc0LjcwNSwwLDI0MS4zNDUNCgljNjYuNjU3LDY2LjY1NywxNzQuNzIsNjYuNjU3LDI0MS4zNDUsMGwxNTYuMDY0LTE1Ni4wMzJMMzY0LjQzNywyMjMuMDI2eiIvPg0KPHBvbHlnb24gc3R5bGU9ImZpbGw6I0NDRDFEOTsiIHBvaW50cz0iMTMwLjYyMywxNDAuMDU3IDIxMy41OTIsMjIzLjAyNiAyODguOTk4LDE0Ny41ODggMjA2LjAzLDY0LjYzNSAiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNBQUIyQkQ7IiBkPSJNNDY2LjIxOSwyMTkuMjQ1YzEuOTM4LTEuOTM4LDMuMTI1LTQuNjA5LDMuMTI1LTcuNTYyYzAtNS44OTEtNC43ODEtMTAuNjU2LTEwLjY1Ni0xMC42NTYNCgkJYy0yLjkzOCwwLTUuNjI1LDEuMTg4LTcuNTYyLDMuMTI1bC0zMC4xNTYsMzAuMTU2bDAsMGMtMS45MzgsMS45MzgtMy4xMjUsNC41OTQtMy4xMjUsNy41NDZjMCw1Ljg5MSw0Ljc4MSwxMC42NzIsMTAuNjU2LDEwLjY3Mg0KCQljMi45NjksMCw1LjYyNS0xLjIwMyw3LjU2Mi0zLjE0MUw0NjYuMjE5LDIxOS4yNDV6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0FBQjJCRDsiIGQ9Ik01MDguODc1LDI2NC40OGMtMi4wNjItMi4wNzgtNC44MTItMy4xMjUtNy41MzEtMy4xMjVsMCwwaC00Mi42NTZsMCwwDQoJCWMtMi43MTksMC01LjQ2OSwxLjA0Ny03LjUzMSwzLjEyNWMtNC4xODgsNC4xNzItNC4xODgsMTAuOTIyLDAsMTUuMDc4YzIuMDYyLDIuMDk0LDQuODEyLDMuMTI1LDcuNTMxLDMuMTI1aDQyLjY1Ng0KCQljMi43MTksMCw1LjQ2OS0xLjAzMSw3LjUzMS0zLjEyNUM1MTMuMDYzLDI3NS40MDIsNTEzLjA2MywyNjguNjUyLDUwOC44NzUsMjY0LjQ4eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNBQUIyQkQ7IiBkPSJNNDA1Ljg3NSwxNjEuNDc5Yy00LjE1Ni00LjE3Mi0xMC45MDYtNC4xNzItMTUuMDYyLDBjLTIuMDk0LDIuMDc4LTMuMTI1LDQuODEyLTMuMTI1LDcuNTQ3djQyLjY1Nw0KCQljMCwyLjcxOSwxLjAzMSw1LjQ2OSwzLjEyNSw3LjUzMWM0LjE1Niw0LjE4OCwxMC45MDYsNC4xODgsMTUuMDYyLDBjMi4wOTQtMi4wNjIsMy4xMjUtNC44MTIsMy4xMjUtNy41MzFsMCwwdi00Mi42NTdsMCwwDQoJCUM0MDksMTY2LjI5MSw0MDcuOTY5LDE2My41NTcsNDA1Ljg3NSwxNjEuNDc5eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNBQUIyQkQ7IiBkPSJNMzA3Ljg3Myw2MC44NjhMMzA3Ljg3Myw2MC44NjhjMS45MzgtMS45MzgsMy4xMjYtNC41OTQsMy4xMjYtNy41MzENCgkJYzAtNS45MDYtNC43ODItMTAuNjcyLTEwLjY4OC0xMC42NzJjLTIuOTM4LDAtNS41OTQsMS4yMDMtNy41MzEsMy4xMjV2LTAuMDE2bC0zMC4xNTYsMzAuMTg4bDAsMA0KCQljLTEuOTM4LDEuOTIyLTMuMTI1LDQuNTk0LTMuMTI1LDcuNTMxYzAsNS44OTEsNC43ODEsMTAuNjcyLDEwLjY1NiwxMC42NzJjMi45MzgsMCw1LjYyNS0xLjIwMyw3LjUzMS0zLjEyNWwwLDBMMzA3Ljg3Myw2MC44Njh6Ig0KCQkvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNBQUIyQkQ7IiBkPSJNMzUwLjUzMSwxMDYuMTE5Yy0yLjA5NC0yLjA3OC00LjgxMi0zLjEyNS03LjUzMS0zLjEyNWwwLDBoLTQyLjY1N2wwLDANCgkJYy0yLjc1LDAtNS40NjksMS4wNDctNy41NjIsMy4xMjVjLTQuMTU2LDQuMTcyLTQuMTU2LDEwLjkyMiwwLDE1LjA5NGMyLjA5NCwyLjA3OCw0LjgxMiwzLjEyNSw3LjU2MiwzLjEyNUgzNDMNCgkJYzIuNzE5LDAsNS40MzgtMS4wNDcsNy41MzEtMy4xMjVDMzU0LjY4NywxMTcuMDQxLDM1NC42ODcsMTEwLjI5MSwzNTAuNTMxLDEwNi4xMTl6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0FBQjJCRDsiIGQ9Ik0yNDcuNTMsMy4xMThjLTQuMTU2LTQuMTU3LTEwLjkwNi00LjE1Ny0xNS4wOTQsMGMtMi4wNjIsMi4wOTQtMy4xMjUsNC44MTIsMy4xMjUsNy41NjJ2NDIuNjI1DQoJCWMwLDIuNzUsMS4wNjIsNS40NjksMy4xMjUsNy41NjJjNC4xODgsNC4xNTcsMTAuOTM4LDQuMTU3LDE1LjA5NCwwYzIuMDk0LTIuMDk0LDMuMTI1LTQuODEyLDMuMTI1LTcuNTQ3bDAsMFYxMC42NjVsMCwwDQoJCUMyNTAuNjU1LDcuOTMxLDI0OS42MjMsNS4yMTIsMjQ3LjUzLDMuMTE4eiIvPg0KPC9nPg0KPHBvbHlnb24gc3R5bGU9ImZpbGw6I0NDRDFEOTsiIHBvaW50cz0iNDQ3LjQwNiwzMDUuOTk1IDM2NC40MzcsMjIzLjAyNiAyODguOTk4LDI5OC40MzMgMzcxLjk2OCwzODEuNDAzICIvPg0KPC9zdmc+') no-repeat center center;
            background-size: cover;
            cursor: grab;
            z-index: 1000;
            display: none; /* Start hidden */
        }

        #magnet-popup {
            display: none;
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            z-index: 1001;
            padding: 10px;
        }

        #select-options {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .button-group {
            display: flex;
            gap: 3px; /* Adjust this value to change button spacing */
        }

        button {
            cursor: pointer;
            padding: 4px 8px; /* Adjust padding for button size */
            border: none;
            border-radius: 3px;
            font-size: 12px; /* Adjust font size */
        }

        #select-all-btn {
            background: #4CAF50;
            color: white;
        }

        #select-none-btn {
            background: #f44336;
            color: white;
        }

        #copy-selected-btn {
            background: #2196F3;
            color: white;
            margin-left: auto; /* Move to the right */
        }

        #copy-feedback {
            font-size: 12px;
            color: green;
            margin-bottom: 0px; /* Space between feedback and links */
            text-align: center;
            display: none;
            font-weight: normal;
        }

        .magnet-count {
            text-align: left; /* Align the count to the left */
            font-size: 12px; /* Adjust the text size */
            color: #666; /* Set the color */
            margin-top: 2px; /* Add spacing above the count */
            margin-bottom: 5px; /* Add spacing below the count */
        }

        .magnet-item {
            display: flex;
            align-items: center; /* Center-align the checkbox and label */
            margin: 0; /* Reset margins */
            font-family: sans-serif; /* Unified font */
            font-size: 12px; /* Adjust text size */
            font-weight: normal; /* Ensure the text is not bold */
            text-decoration: none;
            color: #333; /* Unified color */
            white-space: nowrap; /* Prevent line breaking */
        }

        .magnet-checkbox {
            appearance: auto; /* Ensure the checkbox retains its native appearance */
            margin-right: 8px; /* Space between checkbox and label */
            width: 16px; /* Optional: Set a consistent width */
            height: 16px; /* Optional: Set a consistent height */
            vertical-align: middle; 
        }

        .magnet-item label {
            margin-left: 2px; /* Space between checkbox and link text */
            font-family: sans-serif; /* Set desired font */
            font-size: 12px; /* Unified size */
            font-weight: normal; /* Ensure normal weight */
            color: #333; /* Unified color */
            white-space: nowrap; /* Prevent line breaking */
            line-height: 16px; /* Match the checkbox height */
        }
    `);

    // Create the floating icon
    const icon = document.createElement('div');
    icon.id = 'magnet-icon';
    document.body.appendChild(icon);

    // Create the popup
    const popup = document.createElement('div');
    popup.id = 'magnet-popup';
    popup.innerHTML = `
        <div id="select-options" class="button-group">
            <button id="select-all-btn">All</button>
            <button id="select-none-btn">None</button>
            <div id="copy-feedback" style="flex: 1; text-align: center; display: none;">Links copied!</div>
            <button id="copy-selected-btn">Copy</button>
        </div>
        <div class="magnet-count">Counts: <span id="magnet-count">0</span></div>
        <div id="magnet-list"></div>
    `;
    document.body.appendChild(popup);

    // Extract magnet links
    function extractMagnetLinks() {
        const links = new Set();
        document.querySelectorAll('a[href^="magnet:?xt="]').forEach(link => {
            if (link.href.startsWith('magnet:?xt=')) {
                links.add(link.href);
            }
        });

        const magnetList = document.getElementById('magnet-list');
        magnetList.innerHTML = ''; // Clear existing content

        Array.from(links).forEach((magnet, index) => {
            const item = document.createElement('div');
            item.className = 'magnet-item';

            item.innerHTML = `
                <input type="checkbox" class="magnet-checkbox" id="magnet-${index}" data-magnet="${magnet}" checked>
                <label for="magnet-${index}" title="${magnet}">${magnet}</label>
            `;

            magnetList.appendChild(item);
        });

        const linkCount = links.size;
        document.getElementById('magnet-count').textContent = linkCount;

        // Show the icon only if links are found
        if (linkCount > 0) {
            icon.style.display = 'block';
        } else {
            icon.style.display = 'none';
        }
    }

    // Handle Select All button
    document.getElementById('select-all-btn').addEventListener('click', () => {
        document.querySelectorAll('.magnet-checkbox').forEach(cb => cb.checked = true);
    });

    // Handle Select None button
    document.getElementById('select-none-btn').addEventListener('click', () => {
        document.querySelectorAll('.magnet-checkbox').forEach(cb => cb.checked = false);
    });

    // Copy selected magnets
    document.getElementById('copy-selected-btn').addEventListener('click', () => {
        const selectedLinks = Array.from(document.querySelectorAll('.magnet-checkbox:checked'))
            .map(cb => cb.dataset.magnet)
            .join('\n');

        if (selectedLinks) {
            navigator.clipboard.writeText(selectedLinks).then(() => {
                const feedback = document.getElementById('copy-feedback');
                feedback.style.display = 'block';
                setTimeout(() => feedback.style.display = 'none', 2500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    });

    // Popup visibility state
    let isPopupVisible = false;

    // Show or hide popup on icon click
    icon.addEventListener('click', () => {
        isPopupVisible = !isPopupVisible;
        popup.style.display = isPopupVisible ? 'block' : 'none';
        if (isPopupVisible) {
            extractMagnetLinks();
            // Default to select all links and copy them
            document.querySelectorAll('.magnet-checkbox').forEach(cb => cb.checked = true);
            document.getElementById('copy-selected-btn').click();
        }
    });

    // Make the icon draggable
    let isDragging = false;
    let offsetX, offsetY;

    icon.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - parseInt(window.getComputedStyle(icon).left || '0');
        offsetY = e.clientY - parseInt(window.getComputedStyle(icon).top || '0');
        icon.style.cursor = 'grabbing';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;

            // Keep icon within viewport bounds
            const maxX = window.innerWidth - icon.offsetWidth;
            const maxY = window.innerHeight - icon.offsetHeight;

            icon.style.left = Math.min(Math.max(0, newX), maxX) + 'px';
            icon.style.top = Math.min(Math.max(0, newY), maxY) + 'px';
        }
    }

    function onMouseUp() {
        isDragging = false;
        icon.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Initial extraction
    extractMagnetLinks();
})();
