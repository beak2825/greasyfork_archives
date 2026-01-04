// ==UserScript==
// @name         ANTerior Designer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Allow users to reorder divs with drag and drop
// @author       EnigmaticBacon
// @match        https://anthelion.me/torrents.php?id=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488935/ANTerior%20Designer.user.js
// @updateURL https://update.greasyfork.org/scripts/488935/ANTerior%20Designer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This script only lets users move box items, so this turns the comment section into a box item
    function makeCommentsIntoBox() {
        const torrentCommentsDiv = document.getElementById('torrent_comments');
        if (torrentCommentsDiv) {
            // First, find the .box.pad div within the reply-box div before clearing the content
            const replyBoxDiv = torrentCommentsDiv.querySelector('#reply_box');
            let boxPadClone = null;
            if (replyBoxDiv) {
                const boxPadDiv = replyBoxDiv.querySelector('.box.pad');
                if (boxPadDiv) {
                    // Clone the div to retain all its contents
                    boxPadClone = boxPadDiv.cloneNode(true);
                }
            }

            // Assign class "post_comments_box" to the div
            torrentCommentsDiv.className = 'box post comments';

            // Clear existing content
            torrentCommentsDiv.innerHTML = '';

            // Create and add the head div with "Post Comment:"
            const headDiv = document.createElement('div');
            headDiv.className = 'head';
            headDiv.innerHTML = '<strong>Post Comment:</strong>';
            torrentCommentsDiv.appendChild(headDiv);

            // If boxPadClone exists, append it
            if (boxPadClone) {
                torrentCommentsDiv.appendChild(boxPadClone);
            }
        }
    }
    makeCommentsIntoBox();

    // To make it such that your settings are saved, we need to be able to differentiate between the boxes. This does that.
    function assignUniqueIdsToBoxes(container) {
        // Ensure the container is defined
        if (!container) return;

        // Select only the first-level children that have the 'box' class
        const boxes = Array.from(container.children).filter(child => child.classList.contains('box'));
        const seenIds = new Set(); // Track seen IDs to ensure uniqueness

        boxes.forEach((box) => {
            let newId = '';
            const strongTag = box.querySelector('strong');
            if (strongTag) {
                // Attempt to use text content from the <strong> tag as the ID
                newId = strongTag.textContent.trim().replace(/[^a-zA-Z0-9-_]/g, '');
            }

            // Check if the generated ID is unique; if not, use the classname
            if (seenIds.has(newId) || newId === '') {
                newId = box.className.trim().replace(/\s+/g, '-');
                let counter = 1;
                let originalNewId = newId;
                while (seenIds.has(newId)) {
                    newId = `${originalNewId}-${counter}`;
                    counter++;
                }
            }

            box.id = newId;
            seenIds.add(newId); // Mark this ID as seen
        });
    }

    const mainColumn = document.querySelector('.main_column');
    const sideBar = document.querySelector('.sidebar');
    assignUniqueIdsToBoxes(mainColumn);
    assignUniqueIdsToBoxes(sideBar);

    // This function is responsible for how the drag/drop behavior works
    function enableDragAndDrop(container) {
        if (!container) return;
        Array.from(container.children).forEach((box) => {
            if (!box.classList.contains('box')) return;
            const dragHandle = box.querySelector('.head') || box.querySelector('.colhead_dark');
            if (!dragHandle) return; // If neither exists, skip this box

            // Only add the hamburger icon if the drag handle is '.head'
            if (dragHandle.classList.contains('head')) {
                const hamburgerIcon = createHamburgerIcon();
                dragHandle.prepend(hamburgerIcon);
                dragHandle.setAttribute('draggable', true);
                dragHandle.style.cursor = 'grab'; // Use 'grab' for better UX
            } else {
                // For '.colhead_dark', make the whole row the drag handle without adding an icon because it fucks with the flex stuff
                dragHandle.setAttribute('draggable', true);
                dragHandle.style.cursor = 'grab';
            }

            let draggedElement = null;
            let placeholder;

            // When we drag an element, lower its opacity as a signifier and use a placeholder to show the space it will occupy
            dragHandle.addEventListener('dragstart', (e) => {
                draggedElement = box;
                e.dataTransfer.setData('text/plain', box.id);
                box.style.opacity = '0.4';

                placeholder = document.createElement('div');
                placeholder.classList.add('placeholder');
                placeholder.style.height = `${box.offsetHeight}px`;
                box.after(placeholder);
            });

            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });

            container.addEventListener('dragenter', (e) => {
                e.preventDefault();
                const targetBox = e.target.closest('.box');
                if (targetBox && targetBox !== draggedElement && placeholder) {
                    const rect = targetBox.getBoundingClientRect();
                    const relY = e.clientY - rect.top;
                    const insertBeforeNode = relY < rect.height / 2 ? targetBox : targetBox.nextSibling;
                    if (placeholder && insertBeforeNode) {
                        container.insertBefore(placeholder, insertBeforeNode);
                    } else if (placeholder) {
                        container.appendChild(placeholder); // Fallback if nextSibling is null
                    }
                }
            });

            // When an item is dropped, save the current layout to local storage
            container.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedElement && placeholder) {
                    placeholder.replaceWith(draggedElement);
                    draggedElement.style.opacity = '';
                    placeholder = null;
                    saveOrder(container);
                }
            });

            box.addEventListener('dragend', (e) => {
                e.preventDefault();
                if (draggedElement) {
                    draggedElement.style.opacity = '';
                    if (placeholder) {
                        placeholder.remove();
                        placeholder = null;
                    }
                    saveOrder(container);
                }
            });
        });
    }

    // Adds hamburger icons to denote dragability
    function createHamburgerIcon() {
        const icon = document.createElement('span');
        icon.innerHTML = '☰';
        icon.style.cursor = 'move';
        icon.style.marginRight = '5px';
        return icon;
    }

    // Saves the order of the box elements to local storage
    function saveOrder(container) {
        const order = Array.from(container.children).filter(child => child.classList.contains('box')).map(div => {
            // Use the ID, a 'data-id' attribute, or the className as a unique identifier
            return div.id || div.getAttribute('data-id') || div.className;
        });
        const key = container === mainColumn ? 'mainColumnOrder' : 'sidebarOrder';
        localStorage.setItem(key, JSON.stringify(order));
    }

    // Loads the order from local storage
    function loadOrder(container) {
        const key = container === mainColumn ? 'mainColumnOrder' : 'sidebarOrder';
        const orderStr = localStorage.getItem(key);
        const order = orderStr ? JSON.parse(orderStr) : [];

        const originalDivs = Array.from(container.children);
        const divMap = {};

        originalDivs.forEach(div => {
            divMap[div.id || div.className] = div;
        });

        // Clear the container to reorder elements
        container.innerHTML = '';

        // Append elements based on the saved order
        order.forEach(key => {
            const div = divMap[key];
            if (div) {
                container.appendChild(div);
                // Remove from the originalDivs array to avoid appending it again
                const index = originalDivs.indexOf(div);
                if (index > -1) {
                    originalDivs.splice(index, 1);
                }
            }
        });

        // Append any remaining original elements that were not in the saved order
        originalDivs.forEach(div => {
            container.appendChild(div);
        });
    }


    function addControlButtons() {
        // Create a container for the control panel
        const controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.right = '20px';
        controlPanel.style.bottom = '20px';
        controlPanel.style.padding = '10px';
        controlPanel.style.borderRadius = '5px';
        controlPanel.style.background = 'rgba(51, 51, 51, 0.5)'; // Semi-transparent background
        controlPanel.style.display = 'flex';
        controlPanel.style.flexDirection = 'column';
        controlPanel.style.alignItems = 'flex-end';
        controlPanel.style.gap = '10px';
        controlPanel.style.zIndex = '1000';
        controlPanel.style.opacity = '0.2'; // Low opacity initially
        controlPanel.style.transition = 'opacity 0.3s';
        controlPanel.title = "Layout Controls";

        // Make the panel fully visible on hover
        controlPanel.addEventListener('mouseenter', () => {
            controlPanel.style.opacity = '1';
        });
        controlPanel.addEventListener('mouseleave', () => {
            controlPanel.style.opacity = '0.2';
        });

        // Create the Reset Layout button
        const resetButton = createButton('Reset Layout', () => {
            localStorage.removeItem('mainColumnOrder');
            localStorage.removeItem('sidebarOrder');
            window.location.reload();
        });

        // Initially create the Lock Layout button
        let lockButton = createButton('Lock Layout', toggleLockLayout);

        // Append buttons to the control panel
        controlPanel.appendChild(resetButton);
        controlPanel.appendChild(lockButton);

        // Append the control panel to the body
        document.body.appendChild(controlPanel);

        function toggleLockLayout() {
            const isLocked = lockButton.textContent.includes('Lock');
            document.querySelectorAll('.head span').forEach(icon => {icon.style.display = isLocked ? 'none' : 'inline-block';});
            document.querySelectorAll('[draggable]').forEach(element => {
                element.setAttribute('draggable', !isLocked);
                element.style.cursor = !isLocked ? 'move' : '';
            });

            lockButton.textContent = isLocked ? 'Unlock Layout' : 'Lock Layout';
            resetButton.style.display = isLocked ? 'none' : 'block';

            // Save the lock state
            localStorage.setItem('layoutLocked', isLocked ? 'true' : 'false');
        }

        function createButton(text, onClickCallback) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.padding = '5px 10px';
            button.style.margin = '2px 0'; // Small margin for visual separation
            button.style.fontSize = '12px';
            button.style.border = '1px solid #777';
            button.style.background = '#333';
            button.style.color = '#fff';
            button.style.cursor = 'pointer';
            button.addEventListener('click', onClickCallback);
            return button;
        }

        // Restore layout lock state on page load
        (function restoreLockState() {
            const layoutLocked = localStorage.getItem('layoutLocked') === 'true';
            if (layoutLocked) {
                toggleLockLayout(); // This will lock or unlock the layout based on the stored value
            }
        })();
    }

    // Initialize drag and drop for both containers
    loadOrder(mainColumn);
    enableDragAndDrop(mainColumn);

    loadOrder(sideBar);
    enableDragAndDrop(sideBar);
    addControlButtons();
})();
