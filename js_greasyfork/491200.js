// ==UserScript==
// @name         Poker Notes
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Shows notes for chosen players on the Torn Poker Table
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=holdem*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491200/Poker%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/491200/Poker%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store selected IDs and their notes
    let selectedIds = {};
    let storedSelectedIdsString = localStorage.getItem('hf-poker-notes');
    if (storedSelectedIdsString) {
        let storedSelectedIds = JSON.parse(storedSelectedIdsString);
        selectedIds = storedSelectedIds;
    }

    // Set variables to use later in the script
    let currentIds = [];
    let reasonsForSmallLeft = 0;
    let reasonsForBigUnder = 0;
    let fullMode = false;

    // Find all player containers
    function fetchPlayers() {
        let wrapper = document.body.querySelector('.holdemWrapper___D71Gy');
        if (!wrapper) {
            // If the page hasn't fully loaded in yet, try again in 100ms
            setTimeout(fetchPlayers, 100);
            return;
        }

        let playerPositioners = wrapper.querySelectorAll('.playerPositioner___nbx0c');
        if (!playerPositioners || playerPositioners.length < 1) {
            // If players haven't fully loaded in yet, try again in 100ms
            setTimeout(fetchPlayers, 100);
            return;
        }

        playerPositioners.forEach(playerPositioner => {
            // Fetch the ID
            let opponent = playerPositioner.querySelector('.opponent___ZyaTg');
            let id = opponent.getAttribute('id').replace('player-', '');

            // Make sure you don't loop through existing IDs multiple times (e.g. when only one thing on the page changes)
            if (!currentIds.includes(id)) {
                createNoteContainer(playerPositioner);
                currentIds.push(id);
            }
        });
    }

    // Create a container for the note icons
    function createNoteContainer(playerPositioner) {
        let opponent = playerPositioner.querySelector('.opponent___ZyaTg');
        let detailsBox = opponent.querySelector('.detailsBox___yzFMQ');

        // Fetch ID from attribute
        let id = opponent.getAttribute('id').replace('player-', '');

        // Fetch name from element's text content
        let nameElement = opponent.querySelector('.name___cESdZ');
        nameElement.style.display = 'flex';
        nameElement.style.flexWrap = 'wrap';
        let name = nameElement.textContent;

        // If there's already an existing div, remove it to start fresh
        let existingDiv = document.getElementById('hf-note-icons-' + id);
        if (existingDiv) {
            existingDiv.remove();
        }

        // Create the div container to later append the note icons to
        let div = document.createElement('div');
        div.className = 'hf-note-icons';
        div.id = 'hf-note-icons-' + id;
        div.style.marginLeft = '5px';
        nameElement.appendChild(div);

        // Check if the ID is part of selectedIds
        if (selectedIds.hasOwnProperty(id)) {
            // ID is part of selectedIds
            createNoteIcon('Hide note', playerPositioner);
            createNoteIcon('Remove note', playerPositioner);
            createNote(playerPositioner);
        } else {
            // ID is not part of selectedIds
            createNoteIcon('Create note', playerPositioner);
        }

        // If windowed mode, be sure to set the detailsBox to auto so that everything fits in the container
        if (window.location.href.includes('Full')) {
            fullMode = true; // Set full mode to true
        } else {
            detailsBox.style.height = 'auto';
        }
    }

    // Create note SVG icon (similar to notes next to chat)
    function createNoteIcon(title, playerPositioner) {
        let opponent = playerPositioner.querySelector('.opponent___ZyaTg');
        let id = opponent.getAttribute('id').replace('player-', '');
        let div = playerPositioner.querySelector('.hf-note-icons');

        // Create svg element
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        svg.setAttribute("viewBox", "10 10 14 14");
        svg.setAttribute("height", "10px");
        svg.setAttribute("title", title);
        svg.style.cursor = 'pointer';

        // Create linear gradient
        let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        let linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        linearGradient.setAttribute("id", "write_default");
        linearGradient.setAttribute("x1", "0.5");
        linearGradient.setAttribute("x2", "0.5");
        linearGradient.setAttribute("y2", "1");
        linearGradient.setAttribute("gradientUnits", "objectBoundingBox");

        let stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0");
        stop1.setAttribute("stop-color", "#8faeb4");

        let stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "1");
        stop2.setAttribute("stop-color", "#638c94");

        linearGradient.appendChild(stop1);
        linearGradient.appendChild(stop2);
        defs.appendChild(linearGradient);
        svg.appendChild(defs);

        // Create path
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M1339.89,1050.11c-1.3-1.29-2.27-1.1-2.27-1.1l-4.53,4.53-5.18,5.19L1327,1063l4.27-.91,5.19-5.18,4.53-4.53S1341.18,1051.41,1339.89,1050.11Zm-8.87,11.47-1.46.31a3.617,3.617,0,0,0-1.45-1.45l.31-1.46.42-.42a2.7,2.7,0,0,1,1.69.91,2.77,2.77,0,0,1,.91,1.69Z");
        path.setAttribute("transform", "translate(-1317 -1039)");

        // Append path to SVG
        svg.appendChild(path);

        // Append SVG
        div.appendChild(svg);

        if (title === 'Hide note') {
            path.setAttribute("fill", "var(--holdem-text-color-main)");

            svg.addEventListener('click', function() {
                let textarea = playerPositioner.querySelector('.hf-textarea');
                if (textarea.classList.contains('hidden')) {
                    // Note is hidden
                    showNote(playerPositioner);
                    svg.setAttribute("title", "Hide note");
                } else {
                    // Note is not hidden
                    hideNote(playerPositioner);
                    svg.setAttribute("title", "Show note");
                }
            });
        } else if (title === 'Create note') {
            path.setAttribute("fill", "var(--default-green-color)");

            // Set an event listener
            svg.addEventListener('click', function() {
                addNote(playerPositioner);
            });
        } else if (title === 'Remove note') {
            path.setAttribute("fill", "var(--default-red-color)");

            svg.addEventListener('click', function() {
                removeNote(playerPositioner)
            });
        }
    }

    // Show the note if it's been hidden
    function showNote(playerPositioner) {
        let textarea = playerPositioner.querySelector('.hf-textarea');

        // Add the 'hidden' class
        textarea.classList.remove('hidden');

        // Show the note
        textarea.style.display = '';

        if (fullMode === false) {
            if (playerPositioner.classList.contains('playerPositioner-2___TGxWN') || playerPositioner.classList.contains('playerPositioner-3___U44Yq')) {
                // If there's a note on the left, be sure to leave the margin for it
                let wrapper = document.body.querySelector('.holdemWrapper___D71Gy');

                wrapper.classList.add('hf-small-left');
                playerPositioner.classList.add('hf-reason-small-left');

                reasonsForSmallLeft++;
            }
        } else if (fullMode === true) {
            if (playerPositioner.classList.contains('playerPositioner-0___lwMZb') || playerPositioner.classList.contains('playerPositioner-1____gnoM') || playerPositioner.classList.contains('playerPositioner-8___Y_w10')) {
                // If there's a note on the bottom, be sure to leave the margin for it
                let watcherPanel = document.body.querySelector('.watcherPanel___pQO7c') || document.body.querySelector('.panel___aS_MO');
                let buttons = watcherPanel.querySelector('.watcherPanelTopRow___e8gzk') || watcherPanel.querySelector('.panelTopRow___LiUCA');
                let logs = watcherPanel.querySelector('.logsPositioner___Fatzd');

                buttons.classList.add('hf-big-under-buttons');
                logs.classList.add('hf-big-under-logs');
                playerPositioner.classList.add('hf-reason-big-under');

                reasonsForBigUnder++;
            }
        }
    }

    // Hide the note
    function hideNote(playerPositioner) {
        let textarea = playerPositioner.querySelector('.hf-textarea');

        // Remove the 'hidden' class
        textarea.classList.add('hidden');

        // Hide the note
        textarea.style.display = 'none';

        if (fullMode === false) {
            if (playerPositioner.classList.contains('hf-reason-small-left')) {
                reasonsForSmallLeft--;
                playerPositioner.classList.remove('hf-reason-small-left');

                if (reasonsForSmallLeft < 1) {
                    // If there are no more notes on the left, remove the extra margin again
                    let wrapper = document.body.querySelector('.holdemWrapper___D71Gy');
                    wrapper.classList.remove('hf-small-left');
                }
            }
        } else if (fullMode === true) {
            if (playerPositioner.classList.contains('hf-reason-big-under')) {
                playerPositioner.classList.remove('hf-reason-big-under');
                reasonsForBigUnder--;

                if (reasonsForBigUnder < 1) {
                    let joined = false;
                    // If there are no more notes on the bottom, remove the extra margin again
                    let watcherPanel = document.body.querySelector('.watcherPanel___pQO7c')

                    if (!watcherPanel) {
                        watcherPanel = document.body.querySelector('.panel___aS_MO');
                        joined = true;
                    }

                    let buttons = watcherPanel.querySelector('.watcherPanelTopRow___e8gzk') || watcherPanel.querySelector('.panelTopRow___LiUCA');
                    let logs = watcherPanel.querySelector('.logsPositioner___Fatzd');

                    if (joined === true) {
                        watcherPanel.classList.remove('hf-big-under-buttons');
                    } else if (joined === false) {
                        buttons.classList.remove('hf-big-under-buttons');
                    }

                    logs.classList.remove('hf-big-under-logs');
                }
            }
        }
    }

    // Create a note for this player
    function addNote(playerPositioner) {
        // Fetch ID
        let opponent = playerPositioner.querySelector('.opponent___ZyaTg');
        let id = opponent.getAttribute('id').replace('player-', '');

        // Add to selected Ids
        selectedIds[id] = '';

        // Change note icons
        createNoteContainer(playerPositioner);
    }

    function removeNote(playerPositioner) {
        // Fetch ID
        let opponent = playerPositioner.querySelector('.opponent___ZyaTg');
        let id = opponent.getAttribute('id').replace('player-', '');

        // Remove from selected Ids
        delete selectedIds[id];

        // Reset the localStorage
        let selectedIdString = JSON.stringify(selectedIds);
        localStorage.setItem('hf-poker-notes', selectedIdString);

        // Remove note
        let textarea = playerPositioner.querySelector('.hf-textarea');
        if (textarea) {
            textarea.remove();
        }

        if (fullMode === false) {
            if (playerPositioner.classList.contains('hf-reason-small-left')) {
                playerPositioner.classList.remove('hf-reason-small-left');
                reasonsForSmallLeft--;

                if (reasonsForSmallLeft < 1) {
                    // If there are no more notes on the left, remove the extra margin again
                    let wrapper = document.body.querySelector('.holdemWrapper___D71Gy');
                    wrapper.classList.remove('hf-small-left');
                }
            }
        } else if (fullMode === true) {
            if (playerPositioner.classList.contains('hf-reason-big-under')) {
                playerPositioner.classList.remove('hf-reason-big-under');
                reasonsForBigUnder--;

                if (reasonsForBigUnder < 1) {
                    // If there are no more notes on the bottom, remove the extra margin again
                    let watcherPanel = document.body.querySelector('.watcherPanel___pQO7c');

                    let joined = false;

                    if (!watcherPanel) {
                        watcherPanel = document.body.querySelector('.panel___aS_MO');
                        joined = true;
                    }

                    let buttons = watcherPanel.querySelector('.watcherPanelTopRow___e8gzk') || watcherPanel.querySelector('.panelTopRow___LiUCA');
                    let logs = watcherPanel.querySelector('.logsPositioner___Fatzd');

                    if (joined === true) {
                        watcherPanel.classList.remove('hf-big-under-buttons');
                    } else if (joined === false) {
                        buttons.classList.remove('hf-big-under-buttons');
                    }

                    logs.classList.remove('hf-big-under-logs');
                }
            }
        }

        // Change note icons
        createNoteContainer(playerPositioner);
    }

    // Create a note for a certain player
    function createNote(playerPositioner) {
        let opponent = playerPositioner.querySelector('.opponent___ZyaTg');
        let id = opponent.getAttribute('id').replace('player-', '');

        let playerWrapper = playerPositioner.querySelector('.playerWrapper___wf5jR');

        // Create the textarea element
        let textarea = document.createElement('textarea');
        textarea.className = 'hf-textarea';
        playerWrapper.appendChild(textarea);

        // Check if id exists in selectedIds
        if (selectedIds.hasOwnProperty(id)) {
            // Get the note corresponding to the id
            let note = selectedIds[id];

            // Set the value of the textarea to the note
            textarea.value = note;
        }

        // Depending on full/window screen, append differently
        if (window.location.href.includes('Full')) {
            addNotesFullScreen(playerPositioner);
        } else {
            addNotesWindowScreen(playerPositioner);
        }

        // Add an event listener to keep in selected Ids
        textarea.addEventListener('change', function() {
            if (textarea.value === '') {
                // Remove from selected Ids
                delete selectedIds[id];
            } else {
                selectedIds[id] = textarea.value;
            }

            let selectedIdString = JSON.stringify(selectedIds);
            localStorage.setItem('hf-poker-notes', selectedIdString);
        });
    }

    // Add notes for full screen modus
    function addNotesFullScreen(playerPositioner) {
        let textarea = playerPositioner.querySelector('.hf-textarea');
        let watcherPanel = document.body.querySelector('.watcherPanel___pQO7c');

        let joined = false;

        if (!watcherPanel) {
            watcherPanel = document.body.querySelector('.panel___aS_MO');
            joined = true;
        }

        // Set the correct height and width for the textarea
        textarea.style.height = '125px';
        textarea.style.width = '135px';

        let bottomClasses = ['playerPositioner-0___lwMZb', 'playerPositioner-1____gnoM', 'playerPositioner-8___Y_w10'];
        let leftClasses = ['playerPositioner-2___TGxWN', 'playerPositioner-3___U44Yq', 'playerPositioner-4___yPONl'];
        let topClasses = ['playerPositioner-5___Ya1fL', 'playerPositioner-6___yUqZq', 'playerPositioner-7___dDxyp'];

        if (bottomClasses.some(className => playerPositioner.classList.contains(className))) {
            // Bottom center || Bottom left || Bottom right
            let buttons = watcherPanel.querySelector('.watcherPanelTopRow___e8gzk') || watcherPanel.querySelector('.panelTopRow___LiUCA');
            let logs = watcherPanel.querySelector('.logsPositioner___Fatzd');

            // Add extra margins to leave space
            if (joined === true) {
                watcherPanel.classList.add('hf-big-under-buttons');
            } else if (joined === false) {
                buttons.classList.add('hf-big-under-buttons');
            }

            logs.classList.add('hf-big-under-logs');
            playerPositioner.classList.add('hf-reason-big-under');

            reasonsForBigUnder++;

            textarea.style.left = '10px';
            textarea.style.top = '150px';
        } else if (leftClasses.some(className => playerPositioner.classList.contains(className))) {
            // Left bottom || Left center || Left top
            textarea.style.top = '10px';
            textarea.style.right = '160px';
        } else if (topClasses.some(className => playerPositioner.classList.contains(className))) {
            // Right top || Right center || Right bottom
            textarea.style.top = '10px';
            textarea.style.left = '160px';
        }
    }

    // Add notes for "windowed" modus
    function addNotesWindowScreen(playerPositioner) {
        let opponent = playerPositioner.querySelector('.opponent___ZyaTg');
        let detailsBox = opponent.querySelector('.detailsBox___yzFMQ');

        // Set heights to auto
        opponent.style.height = 'auto';
        detailsBox.style.height = 'auto';

        let textarea = playerPositioner.querySelector('.hf-textarea');
        let wrapper = document.body.querySelector('.holdemWrapper___D71Gy');

        if (playerPositioner.classList.contains('playerPositioner-2___TGxWN') || playerPositioner.classList.contains('playerPositioner-3___U44Yq')) {
            // Add extra margin if on the left
            wrapper.classList.add('hf-small-left');
            playerPositioner.classList.add('hf-reason-small-left');
            reasonsForSmallLeft++;
        }

        textarea.style.marginBottom = '10px';
        textarea.style.height = '-webkit-fill-available';
        textarea.style.width = '100px';

        let bottomRightClasses = ['playerPositioner-0___lwMZb', 'playerPositioner-5___Ya1fL', 'playerPositioner-6___yUqZq', 'playerPositioner-7___dDxyp', 'playerPositioner-8___Y_w10'];
        let upperLeftClasses = ['playerPositioner-1____gnoM', 'playerPositioner-2___TGxWN', 'playerPositioner-3___U44Yq', 'playerPositioner-4___yPONl'];

        if (bottomRightClasses.some(className => playerPositioner.classList.contains(className))) {
            // Bottom center || Top right || Right top || Right bottom || Bottom right
            textarea.style.top = '10px';
            textarea.style.left = '125px';
        } else if (upperLeftClasses.some(className => playerPositioner.classList.contains(className))) {
            // Bottom left || Left bottom || Left top || Upper left
            textarea.style.top = '10px';
            textarea.style.right = '125px';
        }
    }

    // Define the callback function
    function changePlayer(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Loop through added nodes
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('playerPositioner___nbx0c')) {
                        // A player was added
                        fetchPlayers();
                    }
                });
                // Loop through removed nodes
                mutation.removedNodes.forEach(node => {
                    playerRemoval(node);
                });
            }
        }
    }

    function playerRemoval(node) {
        if (node.nodeType === 1 && node.classList.contains('playerPositioner___nbx0c')) {
            // A player was removed
            // Remove from current IDs
            let opponent = node.querySelector('.opponent___ZyaTg');
            let id = opponent.getAttribute('id').replace('player-', '');
            let index = currentIds.indexOf(id);
            if (index !== -1) {
                currentIds.splice(index, 1);
            }

            if (fullMode === true) {
                if (node.classList.contains('hf-reason-big-under')) {
                    console.log('Reason removed');
                    // If it was a reason for extra margin, remove the reason
                    reasonsForBigUnder--;
                }

                if (reasonsForBigUnder < 1) {
                    console.log('No more notes on the bottom');

                    // If there are no more notes on the bottom, remove the extra margin again
                    // If there are no more notes on the bottom, remove the extra margin again
                    let watcherPanel = document.body.querySelector('.watcherPanel___pQO7c');

                    let joined = false;

                    if (!watcherPanel) {
                        watcherPanel = document.body.querySelector('.panel___aS_MO');
                        joined = true;
                    }

                    let buttons = watcherPanel.querySelector('.watcherPanelTopRow___e8gzk') || watcherPanel.querySelector('.panelTopRow___LiUCA');
                    let logs = watcherPanel.querySelector('.logsPositioner___Fatzd');

                    if (joined === true) {
                        watcherPanel.classList.remove('hf-big-under-buttons');
                    } else if (joined === false) {
                        buttons.classList.remove('hf-big-under-buttons');
                    }

                    logs.classList.remove('hf-big-under-logs');
                }
            } else if (fullMode === false) {
                if (node.classList.contains('hf-reason-small-left')) {
                    // If it was a reason for extra margin, remove the reason
                    reasonsForSmallLeft--;
                }

                if (reasonsForSmallLeft < 1) {
                    let wrapper = document.body.querySelector('.holdemWrapper___D71Gy');
                    wrapper.classList.remove('hf-small-left');
                }
            }
        }
    }

    // This function gets called if the table changes
    function changeTable(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                fetchPlayers();

                if (fullMode === true) {
                    let watcherPanel = document.body.querySelector('.watcherPanel___pQO7c') || document.body.querySelector('.panel___aS_MO');
                    let buttons = watcherPanel.querySelector('.watcherPanelTopRow___e8gzk') || watcherPanel.querySelector('.panelTopRow___LiUCA');
                    let logs = watcherPanel.querySelector('.logsPositioner___Fatzd');

                    buttons.classList.remove('hf-big-under-buttons');
                    logs.classList.remove('hf-big-under-logs');

                    reasonsForBigUnder = 0;
                } else if (fullMode === false) {
                    let wrapper = document.body.querySelector('.holdemWrapper___D71Gy');
                    wrapper.classList.remove('hf-small-left');
                    reasonsForSmallLeft = 0;
                }
            }
        }
    }

    // Watch to see if the players change
    function watchPlayers() {
        // Select the target element
        let playerContainer = document.querySelector('.players___U6bQr');

        // Check if the target element exists before observing
        if (playerContainer) {
            // Options for the observer (specify what mutations to observe)
            let playerConfig = { childList: true };

            // Create a new observer instance and pass the callback function
            let playerObserver = new MutationObserver(changePlayer);

            // Start observing the target node for configured mutations
            playerObserver.observe(playerContainer, playerConfig);
        } else {
            setTimeout(watchPlayers, 100);
            return;
        }
    }

    // Watch to see if the table changes
    function watchTable() {
        // Target div element to observe
        let tableElement = document.querySelector('.table___N1grV');

        // Options for the observer (we're only interested in changes to style attributes)
        let tableConfig = { attributes: true, attributeFilter: ['style'] };

        // Create a MutationObserver instance
        let tableObserver = new MutationObserver(changeTable);

        // Start observing the target node for changes
        if (tableElement) {
            tableObserver.observe(tableElement, tableConfig);
        } else {
            setTimeout(watchTable, 100);
            return;
        }
    }

    // Call functions upon page load
    watchPlayers();
    watchTable();
    fetchPlayers();

    // CSS
    let styles = `
        .hf-textarea {
            display: flex;
            position: absolute;
            resize: none;
            font-size: smaller;
            background: var(--default-bg-3-gradient);
            color: black;
            border: 1px solid var(--holdem-buttons-delimiter);
            border-radius: 4px;
            padding: 5px;
        }

    	.hf-small-left {
		    margin-left: 110px !important;
	    }

        .hf-big-under-buttons {
            margin-top: 270px !important;
        }

        .hf-big-under-logs {
            margin-top: -145px !important;
        }
    `

    // Add CSS stylesheet
    let styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

})();