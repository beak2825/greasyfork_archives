// ==UserScript==
// @name         Nhentai Manga Loader
// @namespace    http://www.nhentai.net
// @version      6.3.5
// @author       longkidkoolstar
// @description  Loads nhentai manga chapters into one page in a long strip format with image scaling, click events, and a dark mode for reading.
// @match        https://nhentai.net/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://i.imgur.com/S0x03gs.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/509272/Nhentai%20Manga%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/509272/Nhentai%20Manga%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let loadedPages = 0; // Track loaded pages
    let totalPages = 0; // Track total pages
    let loadingImages = 0; // Track loading images
    let totalImages = 0; // Track total images
    let freshloadedcache = false;
    const mangaId = extractMangaId(window.location.href);
    
    // Image scaling variables
    let zoomStep = 5; // Amount to change zoom by
    let originalZoom = 100; // Store original zoom level
    let currentZoom = 100; // Default zoom level (100%)
    
    // Load saved zoom level if available
    (async function() {
        const savedZoom = await GM.getValue('savedZoomLevel', 100);
        currentZoom = savedZoom;
        originalZoom = savedZoom;
        
        // Apply saved zoom on page load
        const style = document.createElement('style');
        style.id = 'manga-zoom-style';
        style.textContent = `.manga-page-container img { max-width: ${currentZoom}%; }`;
        document.head.appendChild(style);
    })();

// Function to handle image scaling/zooming
function changeImageZoom(action) {
    // Calculate the current scroll ratio to maintain position after zoom
    const scrollRatio = window.scrollY / document.body.scrollHeight;
    
    // Update zoom level based on action
    if (action === 'increase') {
        currentZoom += zoomStep;
    } else if (action === 'decrease') {
        currentZoom -= zoomStep;
    } else if (action === 'reset') {
        currentZoom = originalZoom;
    } else if (action === 'apply_saved') {
        // Just apply the current zoom level without changing it
        // This is used when loading a saved zoom level
    }
    
    // Limit zoom between 10% and 200%
    currentZoom = Math.max(10, Math.min(currentZoom, 200));
    
    // Apply the zoom to all manga images
    const style = document.createElement('style');
    style.id = 'manga-zoom-style';
    style.textContent = `.manga-page-container img { max-width: ${currentZoom}%; }`;
    
    // Remove any existing zoom style and add the new one
    const existingStyle = document.getElementById('manga-zoom-style');
    if (existingStyle) {
        existingStyle.remove();
    }
    document.head.appendChild(style);
    
    // Update zoom display if it exists
    const zoomValue = document.querySelector('.zoom-value');
    if (zoomValue) {
        zoomValue.textContent = `${currentZoom}%`;
    }
    
    // Maintain scroll position after zoom
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight * scrollRatio);
    }, 10);
    
    return currentZoom;
}

// Add keyboard shortcuts for zooming
document.addEventListener('keydown', function(e) {
    // Don't trigger shortcuts if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // Plus key or = key: zoom in
    if (e.keyCode === 187 || e.keyCode === 107) { // = or numpad +
        changeImageZoom('increase');
    }
    // Minus key: zoom out
    else if (e.keyCode === 189 || e.keyCode === 109) { // - or numpad -
        changeImageZoom('decrease');
    }
    // 0 key: reset zoom
    else if (e.keyCode === 48 || e.keyCode === 96) { // 0 or numpad 0
        changeImageZoom('reset');
    }
});

// Add this new function to handle jumping to pages
function handleJumpToPage(input) {
    const targetPage = parseInt(input.value);
    if (isNaN(targetPage) || targetPage < 1 || targetPage > totalPages) {
        alert(`Please enter a valid page number between 1 and ${totalPages}`);
        return;
    }

    const pageContainers = document.querySelectorAll('.manga-page-container');
    const targetContainer = Array.from(pageContainers).find(container => {
        const img = container.querySelector('img');
        return img && parseInt(img.alt.replace('Page ', '')) === targetPage;
    });

    if (targetContainer) {
        // Page is loaded, scroll to it
        if (/Mobi/i.test(navigator.userAgent)) {
            // Get the offset from the top of the document instead of viewport
            const offsetTop = targetContainer.offsetTop; // Add 5px to the top offset
            // Scroll to the absolute position
            window.scrollTo({
                top: offsetTop,
                left: 0,
                behavior: 'instant' // Use 'instant' for consistent behavior
            });
        } else {
            targetContainer.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Page not loaded, redirect to it
        const mangaId = extractMangaId(window.location.href);
        loadSpecificPage(targetPage, mangaId);
    }

    // Clear the input after jumping
    input.value = '';
}


    (async () => {
        const value = JSON.parse(localStorage.getItem('redirected'));
        if (value === null) {
            localStorage.setItem('redirected', JSON.stringify(false)); // Flag to track if the page has been redirected
        }
    })();

    // Helper to create custom style sheets for elements
    function addCustomStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            #manga-container {
                max-width: 100vw;
                margin: 0 auto;
                padding: 0;
            }
            .manga-page-container {
                position: relative;
                display: block;
                margin: 0;
            }
            .manga-page-container img {
                max-width: 100%;
                display: block;
                margin: 3px auto;
                border-radius: 0;
                transition: all 0.3s ease;
                box-shadow: none;
            }
            .ml-counter {
                background-color: #222;
                color: white;
                border-radius: 10px;
                width: 40px;
                margin-left: auto;
                margin-right: auto;
                margin-top: -8.8px;
                padding-left: 5px;
                padding-right: 5px;
                border: 1px solid white;
                z-index: 100;
                position: relative;
                font-size: 9px;
                font-family: 'Open Sans', sans-serif;
                top: 4px;
            }
            .exit-btn {
                background-color: #e74c3c;
                color: white;
                padding: 5px 10px;
                font-size: 14px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                margin: 10px auto;
                display: block;
                text-align: center;
            }
            .exit-btn:hover {
                background-color: #c0392b;
            }
            .exit-btn:active {
                background-color: #a93226;
            }
            .ml-stats {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                border-radius: 8px;
                padding: 3px;
                z-index: 1000;
                font-family: 'Open Sans', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }
            .ml-stats-content {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            .ml-button {
                cursor: pointer;
                margin-left: 5px;
            }
            .ml-box {
                display: none;
                background-color: #333;
                color: white;
                padding: 10px;
                border-radius: 5px;
                margin-top: 5px;
                width: 230px;
            }
            .zoom-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 5px;
                padding: 5px;
                background-color: #444;
                border-radius: 4px;
            }
            .zoom-button {
                background-color: #555;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 2px 8px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .zoom-button:hover {
                background-color: #666;
            }
            .zoom-value {
                color: white;
                font-size: 12px;
                margin: 0 5px;
            }
        `;
        document.head.appendChild(style);
    }

//------------------------------------------------------------------------------**Remove this when transfer over to Nhentai+**------------------------------------------------------------------------------

let isPopupVisible = false; // Flag to track if the popup is visible

function showPopupForSavedPosition(message, onConfirm, options = {}) {
    const existingPopup = document.getElementById('popup');
    if (existingPopup) {
        document.body.removeChild(existingPopup);
    }

    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.innerHTML = `
        <div class="popup-content" role="alert">
            <p>${message}</p>
            <button class="confirm-btn">${options.confirmText || 'Yes'}</button>
            <button class="cancel-btn">${options.cancelText || 'No'}</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Set the popup visibility flag
    isPopupVisible = true; 

    // Add CSS styling for the popup
    const style = document.createElement('style');
    style.textContent = `
        #popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            border-radius: 5px;
            z-index: 9999;
            padding: 15px;
            max-width: 300px;
            text-align: center;
        }
        .popup-content {
            position: relative;
            padding: 10px;
        }
        .confirm-btn,
        .cancel-btn {
            margin-top: 10px;
            background: none;
            border: none;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            transition: color 0.3s, transform 0.3s;
            margin: 0 5px; /* Space between buttons */
        }
        .confirm-btn:hover,
        .cancel-btn:hover {
            color: #ff0000; /* Change color on hover */
            transform: scale(1.1); /* Slightly enlarge on hover */
        }
    `;
    document.head.appendChild(style);

    // Handle confirmation button click
    document.querySelector('.confirm-btn').addEventListener('click', function() {
        document.body.removeChild(popup);
        document.head.removeChild(style);
        isPopupVisible = false; // Reset the flag when popup is closed
        if (onConfirm) onConfirm(); // Call the onConfirm callback
    });

    // Handle cancel button click
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        document.body.removeChild(popup);
        document.head.removeChild(style);
        isPopupVisible = false; // Reset the flag when popup is closed
    });

    // Auto-close feature based on options
    const duration = options.duration || 10000; // Default to 10 seconds if not specified
    setTimeout(() => {
        if (document.body.contains(popup)) {
            document.body.removeChild(popup);
            document.head.removeChild(style);
            isPopupVisible = false; // Reset the flag when auto-closed
        }
    }, duration); // Use the specified duration
}



//------------------------------------------------------------------------------**Remove this when transfer over to Nhentai+**------------------------------------------------------------------------------

// Function to extract manga ID from URL
function extractMangaId(url) {
    const match = url.match(/\/g\/(\d+)/);
    return match ? match[1] : null;
}

function getCurrentPage(entry) {
  const pageElements = document.querySelectorAll('.manga-page-container');
  for (let i = 0; i < pageElements.length; i++) {
    if (entry.target === pageElements[i]) {
      const imgElement = pageElements[i].querySelector('img');
      const altText = imgElement.alt;
      const pageNumber = parseInt(altText.replace('Page ', ''));
      return pageNumber;
    }
  }
  return 1; // Default to page 1 if no current page is found
}


    // Create the "Exit" button
    function createExitButton() {
        const button = document.createElement('button');
        button.textContent = 'Exit';
        button.className = 'exit-btn';
        return button;
    }

    // Add page counter below the image
    function addPageCounter(pageNumber) {
        const counter = document.createElement('div');
        counter.className = 'ml-counter';
        counter.textContent = `${pageNumber}`;
        return counter;
    }

    // Update stats display
    function updateStats() {
        const statsContainer = document.querySelector('.ml-stats-pages');
        const statsBox = document.querySelector('.ml-floating-msg');

        // Always update the header counter, even while settings are open
        if (statsContainer) {
            statsContainer.textContent = `${loadedPages}/${totalPages} loaded`;
        }

        // Only rewrite the floating stats box when not in settings mode
        if (statsBox && !statsBox.querySelector('.jump-controls') && statsBox.dataset.mode !== 'settings') {
            statsBox.innerHTML = `<strong>Stats:</strong>
<span class="ml-loading-images">${loadingImages} images loading</span>
<span class="ml-total-images">${totalImages} images in chapter</span>
<span class="ml-loaded-pages">${loadedPages} pages parsed</span>`;
        }
    }

// Declare reloadMode at the top level
let reloadMode = false; // Flag to track reload mode
let hasSavedFinished = false; // Prevent double-saving completion when reaching the end

async function createStatsWindow() {
    const statsWindow = document.createElement('div');
    statsWindow.className = 'ml-stats';

    // Use a wrapper to keep the button and content aligned
    const statsWrapper = document.createElement('div');
    statsWrapper.style.display = 'flex';
    statsWrapper.style.alignItems = 'center'; // Center vertically

    const collapseButton = document.createElement('span');
    collapseButton.className = 'ml-stats-collapse';
    collapseButton.title = 'Hide stats';
    collapseButton.textContent = '>>';
    collapseButton.style.cursor = 'pointer';
    collapseButton.style.marginRight = '10px'; // Space between button and content
    collapseButton.addEventListener('click', async function() {
        contentContainer.style.display = contentContainer.style.display === 'none' ? 'block' : 'none';
        collapseButton.textContent = contentContainer.style.display === 'none' ? '<<' : '>>';

        // Save the collapse state
        await GM.setValue('statsCollapsed', contentContainer.style.display === 'none');
    });

    const contentContainer = document.createElement('div');
    contentContainer.className = 'ml-stats-content';

    const statsText = document.createElement('span');
    statsText.className = 'ml-stats-pages';
    statsText.textContent = `0/0 loaded`; // Initial stats

    const infoButton = document.createElement('i');
    infoButton.innerHTML = '<i class="fas fa-question-circle"></i>';
    infoButton.title = 'See userscript information and help';
    infoButton.style.marginLeft = '5px';
    infoButton.style.marginRight = '5px'; // Add space to the right
    infoButton.addEventListener('click', function() {
        alert('This userscript loads manga pages in a single view. It is intended to be used for manga reading and saves your previous scroll position amongst other features.');
    });
    
    const moreStatsButton = document.createElement('i');
    moreStatsButton.innerHTML = '<i class="fas fa-chart-pie"></i>';
    moreStatsButton.title = 'See detailed page stats';
    moreStatsButton.style.marginRight = '5px';
    moreStatsButton.addEventListener('click', function() {
        const statsBox = document.querySelector('.ml-floating-msg');
        
        // If stats box is showing stats content, close it
        if (statsBox.style.display === 'block' && statsBox.querySelector('strong').textContent === 'Stats:') {
            statsBox.style.display = 'none';
            return;
        }
        
        // Show stats content
        statsBox.style.display = 'block';
        statsBox.innerHTML = `<strong>Stats:</strong>
<span class="ml-loading-images">${loadingImages} images loading</span>
<span class="ml-total-images">${totalImages} images in chapter</span>
<span class="ml-loaded-pages">${loadedPages} pages parsed</span>`;
    });
    
    // Add new jump page button
    const jumpPageButton = document.createElement('i');
    jumpPageButton.innerHTML = '<i class="fas fa-bullseye"></i>';
    jumpPageButton.title = 'Toggle jump to page';
    jumpPageButton.style.marginRight = '5px';
    jumpPageButton.addEventListener('click', function() {
        const statsBox = document.querySelector('.ml-floating-msg');
        
        // If stats box is showing jump page content, close it
        if (statsBox.style.display === 'block' && statsBox.querySelector('strong').textContent === 'Jump to Page') {
            statsBox.style.display = 'none';
            return;
        }
        
        // Show jump page content
        statsBox.style.display = 'block';
        statsBox.innerHTML = `<strong>Jump to Page</strong>
<div class="jump-controls" style="display: flex; gap: 5px; margin: 5px 0;">
    <button class="jump-first">First</button>
    <input type="number" class="jump-input" min="1" max="${totalPages}" placeholder="1-${totalPages}">
    <button class="jump-last">Last</button>
</div>
<button class="load-saved-position">Load Saved Position</button> 
<button class="jump-go">Go</button>`;

        // Style the input and buttons
        const jumpInput = statsBox.querySelector('.jump-input');
        jumpInput.style.cssText = `
            flex: 2;
            width: 50px;
            background: #444;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 2px 4px;
        `;

        // Style all buttons consistently
        const buttons = statsBox.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.cssText = `
                background-color: #444;
                color: #fff;
                border: 1px solid #555;
                border-radius: 4px;
                padding: 2px 6px;
                cursor: pointer;
                transition: background-color 0.2s;
                width: 100%;
                margin-top: 5px;
                text-align: left;
            `;
        });

        // Special styling for First/Last buttons
        const firstLastButtons = statsBox.querySelectorAll('.jump-first, .jump-last');
        firstLastButtons.forEach(button => {
            button.style.cssText += `
                flex: 1;
                margin-top: 0;
                width: auto;
            `;
        });

        // Add event listeners
        const loadSavedPositionbtn =  statsBox.querySelector('.load-saved-position')
        const jumpGo = statsBox.querySelector('.jump-go');
        const jumpFirst = statsBox.querySelector('.jump-first');
        const jumpLast = statsBox.querySelector('.jump-last');

        loadSavedPositionbtn.addEventListener('click', () => loadSavedPosition(mangaId));
        jumpGo.addEventListener('click', () => handleJumpToPage(jumpInput));
        jumpFirst.addEventListener('click', () => handleJumpToPage({ value: '1' }));
        jumpLast.addEventListener('click', () => handleJumpToPage({ value: totalPages.toString() }));


    });

    const refreshButton = document.createElement('i');
    refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshButton.title = 'Click an image to reload it.';
    refreshButton.addEventListener('click', function() {
        reloadMode = !reloadMode;
        refreshButton.style.color = reloadMode ? 'orange' : '';
        console.log(`Reload mode is now ${reloadMode ? 'enabled' : 'disabled'}.`);
    });
    
    // Add new zoom button
    const zoomButton = document.createElement('i');
    zoomButton.innerHTML = '<i class="fas fa-search"></i>';
    zoomButton.title = 'Adjust image scaling (Shortcuts: +/- to zoom, 0 to reset)';
    zoomButton.style.marginRight = '5px';
    zoomButton.addEventListener('click', function() {
        const statsBox = document.querySelector('.ml-floating-msg');
        
        // If stats box is showing zoom controls, close it
        if (statsBox.style.display === 'block' && statsBox.querySelector('strong').textContent === 'Image Scaling') {
            statsBox.style.display = 'none';
            return;
        }
        
        // Show zoom controls
        statsBox.style.display = 'block';
        statsBox.innerHTML = `<strong>Image Scaling</strong>
<div class="zoom-controls">
    <button class="zoom-button zoom-out">-</button>
    <span class="zoom-value">${currentZoom}%</span>
    <button class="zoom-button zoom-in">+</button>
</div>
<button class="zoom-button zoom-save" style="width: 100%; margin-top: 5px;">Save Zoom Level</button>
<button class="zoom-button zoom-reset" style="width: 100%; margin-top: 5px;">Reset Zoom</button>
<div style="font-size: 11px; margin-top: 5px; color: #aaa;">Keyboard: +/- to zoom, 0 to reset</div>`;
        
        // Add event listeners to zoom buttons
        statsBox.querySelector('.zoom-in').addEventListener('click', () => {
            changeImageZoom('increase');
        });
        
        statsBox.querySelector('.zoom-out').addEventListener('click', () => {
            changeImageZoom('decrease');
        });
        
        statsBox.querySelector('.zoom-save').addEventListener('click', async () => {
            await GM.setValue('savedZoomLevel', currentZoom);
            originalZoom = currentZoom; // Update original zoom to saved value
            
            // Show confirmation message
            const saveButton = statsBox.querySelector('.zoom-save');
            const originalText = saveButton.textContent;
            saveButton.textContent = 'Saved!';
            saveButton.style.backgroundColor = '#4CAF50';
            
            // Reset button text after 1.5 seconds
            setTimeout(() => {
                saveButton.textContent = originalText;
                saveButton.style.backgroundColor = '';
            }, 1500);
        });
        
        statsBox.querySelector('.zoom-reset').addEventListener('click', () => {
            changeImageZoom('reset');
        });
    });

    // Add settings button for batch size and auto-load
    const settingsButton = document.createElement('i');
    settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
    settingsButton.title = 'Loading settings';
    settingsButton.style.marginRight = '5px';
    settingsButton.style.marginLeft = '7px';
    settingsButton.addEventListener('click', async function() {
        const statsBox = document.querySelector('.ml-floating-msg');

        // Toggle close if settings are already open
        if (statsBox && (statsBox.dataset.mode === 'settings' || (statsBox.style.display === 'block' && statsBox.querySelector('strong') && statsBox.querySelector('strong').textContent === 'Loading Settings'))) {
            statsBox.style.display = 'none';
            delete statsBox.dataset.mode;
            return;
        }

        const savedBatch = await GM.getValue('batchSize', 10);
        const savedAuto = await GM.getValue('autoLoadBatches', true);
        const savedLoadAll = await GM.getValue('loadAllBatches', false);
        statsBox.style.display = 'block';
        statsBox.dataset.mode = 'settings';
        statsBox.innerHTML = `<strong>Loading Settings</strong>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px;">
  <label>Batch size</label>
  <input type=\"number\" class=\"ml-setting-batch\" min=\"1\" max=\"100\" value=\"${savedBatch}\" ${savedLoadAll ? 'disabled' : ''}>
  <label>Auto-load next batch</label>
  <input type=\"checkbox\" class=\"ml-setting-autoload\" ${savedAuto ? 'checked' : ''} ${savedLoadAll ? 'disabled' : ''}>
  <label>Load everything</label>
  <input type=\"checkbox\" class=\"ml-setting-loadall\" ${savedLoadAll ? 'checked' : ''}>
</div>
<div style=\"font-size: 11px; margin-top: 6px; color: #aaa;\">When \"Load everything\" is enabled,<br>batch size and auto-load are ignored.</div>
<button class=\"ml-setting-save\" style=\"margin-top: 8px;\">Save</button>`;

        const saveBtn = statsBox.querySelector('.ml-setting-save');
        // Theme styling for the Save button
        saveBtn.style.cssText = `
            background-color: #ed2553;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.05s;
            width: 100%;
            margin-top: 8px;
            text-align: center;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        `;
        saveBtn.addEventListener('mouseenter', () => {
            saveBtn.style.backgroundColor = '#c91c45';
        });
        saveBtn.addEventListener('mouseleave', () => {
            saveBtn.style.backgroundColor = '#ed2553';
        });

        // Toggle disable state when "Load everything" changes
        const batchInput = statsBox.querySelector('.ml-setting-batch');
        const autoInput = statsBox.querySelector('.ml-setting-autoload');
        const loadAllCtrl = statsBox.querySelector('.ml-setting-loadall');
        if (loadAllCtrl) {
            loadAllCtrl.addEventListener('change', () => {
                const isAll = loadAllCtrl.checked;
                if (batchInput) batchInput.disabled = isAll;
                if (autoInput) autoInput.disabled = isAll;
            });
        }
 
        saveBtn.addEventListener('click', async () => {
            const batchVal = parseInt(statsBox.querySelector('.ml-setting-batch')?.value, 10) || 10;
            const autoVal = !!statsBox.querySelector('.ml-setting-autoload')?.checked;
            const loadAllVal = !!statsBox.querySelector('.ml-setting-loadall')?.checked;
            await GM.setValue('batchSize', Math.max(1, Math.min(100, batchVal)));
            await GM.setValue('autoLoadBatches', autoVal);
            await GM.setValue('loadAllBatches', loadAllVal);
            saveBtn.textContent = 'Saved!';
            saveBtn.style.backgroundColor = '#4CAF50';
            setTimeout(() => { statsBox.style.display = 'none'; delete statsBox.dataset.mode; }, 1200);
        });
    });

// Add the mini exit button for refreshing the page
const miniExitButton = document.createElement('button');
miniExitButton.innerHTML = '<i class="fas fa-sign-out-alt"></i>';  // Font Awesome icon for sign out
miniExitButton.title = 'Exit the Manga Loader';
miniExitButton.style.marginLeft = '10px'; // Space between other buttons
miniExitButton.style.backgroundColor = '#e74c3c';  // Red color for the button
miniExitButton.style.color = '#fff';
miniExitButton.style.border = 'none';
miniExitButton.style.padding = '2px 5px';
miniExitButton.style.borderRadius = '5px';
miniExitButton.style.cursor = 'pointer';

// Refresh the page when the button is clicked
miniExitButton.addEventListener('click', function() {
    window.location.reload();  // Refresh the page
});

    // Append all elements to the stats content container
    contentContainer.appendChild(statsText);
    contentContainer.appendChild(infoButton);
    contentContainer.appendChild(moreStatsButton);
    contentContainer.appendChild(jumpPageButton); // Add the new button
    contentContainer.appendChild(zoomButton); // Add the zoom button
    contentContainer.appendChild(refreshButton);
    contentContainer.appendChild(settingsButton); // Add settings button
    contentContainer.appendChild(miniExitButton);

    statsWrapper.appendChild(collapseButton);
    statsWrapper.appendChild(contentContainer);
    statsWindow.appendChild(statsWrapper);

    const statsBox = document.createElement('pre');
    statsBox.className = 'ml-box ml-floating-msg';
    statsBox.style.display = 'none'; // Initially hidden

    // Create the stats content
    const statsContent = `<strong>Stats:</strong>
<span class="ml-loading-images">0 images loading</span>
<span class="ml-total-images">0 images in chapter</span>
<span class="ml-loaded-pages">0 pages parsed</span>`;

    statsBox.innerHTML = statsContent;
    statsWindow.appendChild(statsBox);

    // Check and set initial collapse state
    const collapsed = await GM.getValue('statsCollapsed', false);
    if (collapsed) {
        contentContainer.style.display = 'none';
        collapseButton.textContent = '<<'; // Change to indicate expanded state
    }

    // Add hover effect
    statsWindow.style.transition = 'opacity 0.3s';
    statsWindow.style.opacity = '0.6'; // Dimmed by default

    statsWindow.addEventListener('mouseenter', function() {
        statsWindow.style.opacity = '1'; // Fully visible on hover
    });

    statsWindow.addEventListener('mouseleave', function() {
        statsWindow.style.opacity = '0.6'; // Dim again on mouse leave
    });

    document.body.appendChild(statsWindow);
}
 



// Add the click event to images
function addClickEventToImage(image) {
    image.addEventListener('click', function() {
        if (reloadMode) {
            const imgSrc = image.dataset.src || image.src;
            image.src = ''; // Clear the src to trigger reload
            setTimeout(() => {
                image.src = imgSrc; // Retry loading after clearing
            }, 100); // Short delay to ensure proper reload
        }
    });
}



    // Function to hide specified elements
    function hideElements() {
        const elementsToHide = ['#image-container', '#content', 'nav'];
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

// Add this at the top level to track image loading status
const imageStatus = []; // Array to track the status of each image

// Add an event listener to detect when the user scrolls
window.addEventListener('scroll', logCurrentPage);

// Variable to store the previous page
let previousPage = 0;

// Function to log the current page
function logCurrentPage() {
    // Check if the URL matches the desired pattern
    if (!window.location.href.match(/^https:\/\/nhentai\.net\/g\//)) {
        return; // Exit if the URL is not correct
    }

    // Check if the download button exists
    if (document.querySelector("#download")) {
        return; // Exit if the download button exists
    }

    const currentPage = getCurrentVisiblePage();
    // Do not gate completion on loadedPages when starting mid-chapter
    const pageContainers = document.querySelectorAll('.manga-page-container');
    const lastPageLoaded = Array.from(pageContainers).some(container => {
        const img = container.querySelector('img');
        return img && parseInt(img.alt.replace('Page ', ''), 10) === totalPages;
    });

    // Check if the Load Manga button exists
    const loadMangaButton = document.querySelector('.load-manga-btn');
    if (loadMangaButton) {
        return; // Exit if the Load Manga button exists
    }

    // Trigger completion when near the end (3 pages before) and last page is present
    if (!hasSavedFinished && lastPageLoaded && currentPage >= totalPages - 3 && (!isPopupVisible || freshloadedcache)) {
        previousPage = currentPage;
        hasSavedFinished = true;
        saveFinishedManga(mangaId);
        deleteMangaFromStorage();
    }
}
async function saveFinishedManga(mangaId) {
    try {
        const metadataKey = `metadata_${mangaId}`;
        const cachedMetadata = await GM.getValue(metadataKey, null);

        // Prepare immediate placeholder values
        let mangaTitle = 'Unknown';
        let languageDisplay = 'Unknown';
        if (cachedMetadata) {
            const metadata = JSON.parse(cachedMetadata);
            mangaTitle = metadata.title || mangaTitle;
            languageDisplay = metadata.languageDisplay || languageDisplay;
        }

        const tempCoverSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="120"><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#fff">Cover</text></svg>`;
        const tempCoverImageUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(tempCoverSVG)}`;

        // Save justRead immediately with placeholder cover
        let justRead = JSON.parse(localStorage.getItem('justRead')) || [];
        const existingIndex = justRead.findIndex(manga => manga.id === mangaId);
        if (existingIndex === -1) {
            const placeholderEntry = {
                id: mangaId,
                title: mangaTitle,
                coverImageUrl: tempCoverImageUrl,
                language: languageDisplay
            };
            justRead.push(placeholderEntry);
            localStorage.setItem('justRead', JSON.stringify(justRead));
            await GM.setValue('justRead', JSON.stringify(justRead));
            console.log(`Manga ${mangaId} added to justRead with temporary cover.`);
        } else {
            // Ensure a cover exists even if previous entry lacked one
            if (!justRead[existingIndex].coverImageUrl) {
                justRead[existingIndex].coverImageUrl = tempCoverImageUrl;
                localStorage.setItem('justRead', JSON.stringify(justRead));
                await GM.setValue('justRead', JSON.stringify(justRead));
            }
        }

        // Background: fetch real metadata and update justRead entry
        (async () => {
            let coverImageUrl = null;
            try {
                const response = await fetch(`https://nhentai.net/api/gallery/${mangaId}`);
                const data = await response.json();
                if (data) {
                    mangaTitle = data.title.english || mangaTitle;
                    const mediaId = data.media_id;

                    // Find a working cover image URL
                    const subdomains = ['i1', 'i2', 'i3', 'i4', 'i5', 'i7', 't1', 't2', 't3', 't4', 't5', 't7'];
                    const formats = ['webp', 'png', 'jpg'];
                    coverImageUrl = null;
                    findImage: for (const subdomain of subdomains) {
                        for (const format of formats) {
                            const testUrl = `https://${subdomain}.nhentai.net/galleries/${mediaId}/cover.${format}`;
                            const exists = await new Promise((resolve) => {
                                const img = new Image();
                                img.onload = () => resolve(true);
                                img.onerror = () => resolve(false);
                                img.src = testUrl;
                            });
                            if (exists) {
                                coverImageUrl = testUrl;
                                break findImage;
                            }
                        }
                    }
                    if (!coverImageUrl) {
                        coverImageUrl = `https://t3.nhentai.net/galleries/${mediaId}/cover.jpg`;
                    }

                    // Language processing
                    const languages = data.tags.filter(tag => tag.type === 'language').map(tag => tag.name.toLowerCase());
                    if (languages.includes('english')) {
                        languageDisplay = 'English';
                    } else if (languages.includes('translated') && languages.length === 1) {
                        languageDisplay = 'English';
                    } else if (languages.includes('translated') && languages.length > 1) {
                        const otherLanguages = languages.filter(lang => lang !== 'translated');
                        languageDisplay = otherLanguages.length > 0 ? otherLanguages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(', ') : 'Unknown';
                    } else {
                        languageDisplay = languages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(', ');
                    }
                }
            } catch (e) {
                console.warn(`Background fetch failed for manga ${mangaId}`, e);
            }

            // Update justRead entry with real metadata if available
            try {
                let justReadUpdate = JSON.parse(localStorage.getItem('justRead')) || [];
                const idx = justReadUpdate.findIndex(manga => manga.id === mangaId);
                if (idx !== -1) {
                    const updated = {
                        ...justReadUpdate[idx],
                        title: mangaTitle || justReadUpdate[idx].title,
                        coverImageUrl: coverImageUrl || justReadUpdate[idx].coverImageUrl,
                        language: languageDisplay || justReadUpdate[idx].language
                    };
                    justReadUpdate[idx] = updated;
                    localStorage.setItem('justRead', JSON.stringify(justReadUpdate));
                    await GM.setValue('justRead', JSON.stringify(justReadUpdate));
                    console.log(`Updated justRead for manga ${mangaId} with final metadata.`);
                }

                // Cache metadata for reuse if all fields present
                if (mangaTitle && coverImageUrl && languageDisplay) {
                    await GM.setValue(metadataKey, JSON.stringify({
                        title: mangaTitle,
                        coverImageUrl,
                        languageDisplay
                    }));
                }
            } catch (err) {
                console.warn(`Failed to update justRead/metadata for ${mangaId}`, err);
            }
        })();

    } catch (error) {
        console.error(`Error saving finished manga ${mangaId}:`, error);
    }
}



function getCurrentVisiblePage() {
    const pageContainers = document.querySelectorAll('.manga-page-container');
    let visiblePage = 0;
    const totalPages = pageContainers.length;
    
    // No pages found
    if (totalPages === 0) {
       // console.warn('No page containers found.');
        return visiblePage;
    }
    
    // Determine if device is mobile or desktop based on screen width
    const isMobile = window.innerWidth <= 768; // Common breakpoint for mobile
    
    // Use different thresholds based on device type
    const visibilityThreshold = isMobile ? 70 : 25; // Lower threshold for desktop
    
    pageContainers.forEach((container, index) => {
        const img = container.querySelector('img');
        if (img && img.alt) {
            const pageNumber = parseInt(img.alt.replace('Page ', ''), 10);
            const rect = img.getBoundingClientRect();
            const pageHeight = rect.bottom - rect.top;
            const visibleHeight = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);
            const visiblePercentage = (visibleHeight / pageHeight) * 100;
            
            if (visiblePercentage >= visibilityThreshold) {
                visiblePage = pageNumber;
            }
            
            // Keep the last page logic
            if (index + 1 === totalPages && visiblePercentage >= 10) {
                visiblePage = totalPages;
            }
        }
    });
    
    // Fallback logic prefers DOM displayed page over URL
    if (visiblePage === 0) {
        const domPage = getCurrentPageFromDOM();
        if (domPage) {
            visiblePage = domPage;
        } else {
            const currentPageMatch = window.location.pathname.match(/\/g\/\d+\/(\d+)/);
            if (currentPageMatch) {
                visiblePage = parseInt(currentPageMatch[1], 10);
            }
        }
    }
    
    //console.log("Current visible page determined:", visiblePage);
    return visiblePage;
}


// Function to delete manga from storage
function deleteMangaFromStorage() {
    const mangaId = window.location.pathname.match(/\/g\/(\d+)/)[1];
    GM.deleteValue(mangaId); // Delete the manga entry

    // Check if metadata exists before attempting to delete it
    GM.getValue(`metadata_${mangaId}`).then(metadata => {
        if (metadata) {
            GM.deleteValue(`metadata_${mangaId}`); // Delete the associated metadata
            console.log(`Metadata for manga ${mangaId} deleted from storage`);
        } else {
            console.log(`No metadata found for manga ${mangaId}, skipping deletion`);
        }
    });

    deleteMangaImageCacheFromLocalStorage(mangaId);
    console.log(`Manga ${mangaId} deleted from storage`);
}

function deleteMangaImageCacheFromLocalStorage(mangaId) {
    const prefix = `imagePage_${mangaId}_`;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
        }
    }
    for (const key of keysToRemove) {
        localStorage.removeItem(key);
    }
    if (keysToRemove.length > 0) {
        console.log(`Deleted ${keysToRemove.length} cached pages from localStorage for manga ${mangaId}`);
    }
}

// Replace the addScrollListener function with the following code
let previousPagex = 0; // Initialize previousPage at the top level

window.addEventListener('scroll', async () => {
    const currentPage = getCurrentVisiblePage();
    //console.log("current page:", currentPage, "last page", previousPagex);
    // Only save the current page if the popup is not visible and the current page is greater than the previous page
    if (!isPopupVisible || freshloadedcache) {
        if (currentPage > previousPagex) {
            console.log(`Current page: ${currentPage}, Previous page: ${previousPagex}`);
            await saveCurrentPosition(mangaId, currentPage);
            previousPagex = currentPage; // Update previousPage to the current page
        }
    }
});
// Log the state of freshloadedcache every second
setInterval(() => {
   // console.log(`Fresh loaded cache state: ${freshloadedcache}`);
}, 1000);


// Load all manga images with page separators and scaling
async function loadMangaImages(mangaId) {
    hideElements();
    createStatsWindow(); // Create the stats window

    const mangaContainer = document.createElement('div');
    mangaContainer.id = 'manga-container';
    document.body.appendChild(mangaContainer);
    

    

    const exitButtonTop = createExitButton();
    mangaContainer.appendChild(exitButtonTop);

    totalPages = parseInt(document.querySelector('.num-pages').textContent.trim());
    totalImages = totalPages; // Update total images for stats
    const initialPage = getAccurateCurrentPage();
    let currentPage = initialPage;

    // Batch loading configuration
    const userBatchSize = await GM.getValue('batchSize', 10);
    const autoLoadBatches = await GM.getValue('autoLoadBatches', true);
    const loadAllBatches = await GM.getValue('loadAllBatches', false);
    const batchSize = Math.max(1, Math.min(100, parseInt(userBatchSize, 10) || 10));

    let lastLoadedPage = 0; // track highest page fully loaded into DOM
    let targetBatchEnd = null; // inclusive page number for current batch
    let nextBatchStartLink = null; // href to begin next batch when user clicks Load More
    let loadMoreEl = null; // UI element at strip end for triggering more

    // Queue for tracking loading images
    const loadingQueue = [];
    const maxConcurrentLoads = /Mobi/.test(navigator.userAgent) ? 10 : 40; // Maximum number of concurrent image loads

    // Create/attach a sentinel UI that lets user load more
    function ensureLoadMoreControl() {
        if (loadAllBatches || loadMoreEl) return;
        loadMoreEl = document.createElement('div');
        loadMoreEl.className = 'ml-load-more';
        loadMoreEl.style.cssText = 'display:flex;align-items:center;justify-content:center;margin:16px 0;padding:10px;border-radius:6px;background:#333;color:#fff;cursor:pointer;user-select:none;';
        loadMoreEl.textContent = `Load more (${batchSize})`;
        loadMoreEl.addEventListener('click', () => {
            startNextBatch();
        });
        mangaContainer.appendChild(loadMoreEl);

        if (autoLoadBatches) {
            const sentinelObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        startNextBatch();
                        sentinelObserver.disconnect();
                    }
                });
            }, { rootMargin: '150px 0px', threshold: 0.1 });
            sentinelObserver.observe(loadMoreEl);
        }
    }

    function removeLoadMoreControl() {
        if (loadMoreEl && loadMoreEl.parentNode) {
            loadMoreEl.parentNode.removeChild(loadMoreEl);
        }
        loadMoreEl = null;
    }

    function startNextBatch() {
        if (!nextBatchStartLink) return;
        removeLoadMoreControl();
        targetBatchEnd = Math.min(totalPages, lastLoadedPage + batchSize);
        loadingQueue.push({ pageNumber: lastLoadedPage + 1, pageUrl: nextBatchStartLink });
        processQueue();
    }

    // Helper to create the page container with images
    function createPageContainer(pageNumber, imgSrc) {
        const container = document.createElement('div');
        container.className = 'manga-page-container';

        // Create the actual image element
        const img = document.createElement('img');
        img.src = ''; // Start with empty src to avoid loading it immediately
        img.dataset.src = imgSrc; // Store the actual src in data attribute
        img.alt = `Page ${pageNumber}`;

        // Add page counter below the image
        const pageCounter = addPageCounter(pageNumber);

        // Append the image and page counter
        container.appendChild(img);
        container.appendChild(pageCounter); // <-- Page number is shown here

          // Add exit button to the bottom of the last loaded page
    if (pageNumber === totalPages) {
        const exitButton = createExitButton();
        container.appendChild(exitButton);
        exitButton.addEventListener('click', () => {
            window.location.reload();
        })
    }

        // Track the image status
        imageStatus[pageNumber] = { src: imgSrc, loaded: false, attempts: 0 };

        // Error handling and event listeners
        addErrorHandlingToImage(img, imgSrc, pageNumber);
        addClickEventToImage(img);
        mangaContainer.appendChild(container);
        lastLoadedPage = Math.max(lastLoadedPage, pageNumber);

        loadedPages++; // Increment loaded pages count
        updateStats(); // Update stats display

        observePageContainer(container); // Observe for lazy loading

        // Save scroll position as soon as page container is created
        const mangaId = extractMangaId(window.location.href);
        const currentPage = getCurrentVisiblePage(); // Get the current visible page number
        if (!isPopupVisible || freshloadedcache) {
           // console.log("load again");
           // saveCurrentPosition(mangaId, currentPage);
        }
        

        // Start loading the actual image for current batch only
        if (targetBatchEnd && pageNumber <= targetBatchEnd) {
            img.src = imgSrc; // Load immediately within batch
        }

        // Mark as loaded on load
        img.onload = () => {
            imageStatus[pageNumber].loaded = true; // Mark as loaded
            loadingImages--; // Decrement loading images count
            updateStats(); // Update loading images count
        };

        return container;
    }







// Add a delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Track if the app is online or offline
let isOnline = navigator.onLine;

// Add event listeners to detect connection state changes
window.addEventListener('offline', () => {
    console.warn('You are offline. Pausing image loading.');
    isOnline = false;
});

window.addEventListener('online', () => {
    console.log('Back online. Resuming image loading.');
    isOnline = true;
    if (loadingQueue.length > 0) {
        processQueue(); // Resume processing the queue
    } else {
        // If queue is empty, manually trigger the next page load
        loadNextBatchOfImages(); // Load the next set of images if queue is empty
    }
});

// Load a single page with error handling, retry logic, and caching
async function loadPage(pageNumber, pageUrl, retryCount = 0) {
    if (loadingImages >= maxConcurrentLoads || !isOnline) {
        return; // Exit if we're at max concurrent loads or offline
    }

    loadingImages++;
    updateStats(); // Update loading images count

    const mangaId = extractMangaId(pageUrl);
    if (!mangaId) {
        console.error(`Could not extract manga ID from URL: ${pageUrl}`);
        loadingImages--;
        updateStats();
        handleFailedImage(pageNumber);
        return;
    }

    // Check cache first
    const cachedImage = getImageFromCache(pageNumber, mangaId);
    if (cachedImage && cachedImage.mangaId === mangaId) {
        console.log(`Loading page ${pageNumber} from cache for manga ${mangaId}`);
        const pageContainer = createPageContainer(pageNumber, cachedImage.imgSrc);
        imageStatus[pageNumber].loaded = true; // Mark as loaded
        
        // Ensure position is saved for cached pages
        const currentPage = pageNumber;
       // console.log("load");
       // saveCurrentPosition(mangaId, currentPage); // Save the position for cached pages
        
        

        loadingImages--;
        updateStats(); // Update loading images count

        // Queue next page only within current batch, else set up for next batch
        if (pageNumber < targetBatchEnd && cachedImage.nextLink) {
            loadingQueue.push({ pageNumber: pageNumber + 1, pageUrl: cachedImage.nextLink });
            processQueue();
        } else if (pageNumber === targetBatchEnd && cachedImage.nextLink) {
            nextBatchStartLink = cachedImage.nextLink;
            if (!loadAllBatches) ensureLoadMoreControl();
        }
        return;
    }

    try {
        const response = await fetch(pageUrl);

        if (response.status === 429) {
            if (retryCount < maxRetries) {
                console.warn(`Rate limit exceeded for page ${pageNumber}. Retrying in ${retryDelay} ms...`);
                await delay(retryDelay); // Wait before retrying
                loadPage(pageNumber, pageUrl, retryCount + 1); // Retry loading the same page
                return;
            } else {
                console.error(`Failed to load page ${pageNumber} after ${maxRetries} attempts.`);
                loadingImages--;
                updateStats(); // Update loading images count
                handleFailedImage(pageNumber); // Handle failed image loading
                return;
            }
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Be robust to markup differences on last page (no anchor wrapping the image)
        const anchorEl = doc.querySelector('#image-container a');
        const imgElement = doc.querySelector('#image-container img') || (anchorEl ? anchorEl.querySelector('img') : null);
        const nextLink = anchorEl ? anchorEl.href : null;
        if (!imgElement) {
            throw new Error(`No image element found for page ${pageNumber}`);
        }
        const imgSrc = imgElement.getAttribute('data-src') || imgElement.src;

        // Save to cache
        saveImageToCache(pageNumber, imgSrc, nextLink, mangaId);

        const pageContainer = createPageContainer(pageNumber, imgSrc);
        imageStatus[pageNumber].loaded = true; // Mark as loaded

        loadingImages--;
        updateStats(); // Update loading images count

        // Queue next page only within current batch, else set up for next batch
        if (pageNumber < targetBatchEnd && nextLink) {
            loadingQueue.push({ pageNumber: pageNumber + 1, pageUrl: nextLink });
            processQueue();
        } else if (pageNumber === targetBatchEnd && nextLink) {
            nextBatchStartLink = nextLink;
            if (!loadAllBatches) ensureLoadMoreControl();
        }
    } catch (err) {
        loadingImages--;
        console.error(err);
        updateStats(); // Update loading images count
        handleFailedImage(pageNumber); // Handle failed image loading
    }
}

// In your processing queue, ensure a delay ONLY after 429 status
async function processQueue() {
    while (loadingQueue.length > 0 && loadingImages < maxConcurrentLoads && isOnline) {
        const { pageNumber, pageUrl } = loadingQueue.shift(); // Get the next page to load
        loadPage(pageNumber, pageUrl); // Load it
    }
}

// Manually trigger the next batch of images if needed
function loadNextBatchOfImages() {
    if (loadingQueue.length === 0 && isOnline) {
        const nextPageNumber = getNextPageNumber(); // Logic to get the next page number
        const nextPageUrl = getNextPageUrl(nextPageNumber); // Logic to get the next page URL

        if (nextPageUrl) {
            loadingQueue.push({ pageNumber: nextPageNumber, pageUrl: nextPageUrl });
            processQueue(); // Resume loading
        }
    }
}

// Configuration for retry logic
const maxRetries = 5; // Maximum number of retries for rate limit
const retryDelay = 5000; // Delay in milliseconds before retrying only on 429 status





    // Handle failed image loading attempts
    function handleFailedImage(pageNumber) {
        if (imageStatus[pageNumber]) {
            imageStatus[pageNumber].attempts++;
            if (imageStatus[pageNumber].attempts <= 3) { // Retry up to 3 times
                console.warn(`Retrying to load image for page ${pageNumber}...`);
                const anchor = document.querySelector('#image-container a');
                const mangaIdForRetry = extractMangaId(window.location.href);
                const fallbackUrl = `${window.location.origin}/g/${mangaIdForRetry}/${pageNumber}/`;
                const retryUrl = anchor ? anchor.href : fallbackUrl;
                loadPage(pageNumber, retryUrl); // Reattempt loading the same page
            } else {
                console.error(`Failed to load image for page ${pageNumber} after 3 attempts.`);
            }
        }
    }



// Establish initial batch boundary
targetBatchEnd = loadAllBatches ? totalPages : Math.min(totalPages, currentPage + batchSize - 1);

const firstImageElement = document.querySelector('#image-container img');
const firstImgSrc = firstImageElement ? (firstImageElement.getAttribute('data-src') || firstImageElement.src) : null;
if (!firstImgSrc) {
    console.error('Could not find first image src within #image-container');
}
createPageContainer(currentPage, firstImgSrc);

const firstAnchor = document.querySelector('#image-container a');
const mangaIdForFirst = extractMangaId(window.location.href);
const nextPageUrlFallback = (currentPage < totalPages) ? `${window.location.origin}/g/${mangaIdForFirst}/${currentPage + 1}/` : null;
const firstImageLink = firstAnchor ? firstAnchor.href : nextPageUrlFallback;
if (currentPage < targetBatchEnd) {
    loadingQueue.push({ pageNumber: currentPage + 1, pageUrl: firstImageLink });
    processQueue();
} else {
    nextBatchStartLink = firstImageLink;
    if (!loadAllBatches) ensureLoadMoreControl();
}

// Observe all image containers for lazy loading
observeAndPreloadImages();

exitButtonTop.addEventListener('click', function() {
    window.location.reload();
});
}

// Pre-load next few images while user scrolls
function observeAndPreloadImages() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const imgElement = entry.target.querySelector('img');
          if (imgElement && imgElement.dataset.src) {
            imgElement.src = imgElement.dataset.src; // Load the image
            observer.unobserve(entry.target); // Stop observing after loading
  
            // Save the current position
            const mangaId = extractMangaId(window.location.href);
            const currentPage = getCurrentVisiblePage(entry); // Get the current page number
            if (!isPopupVisible || freshloadedcache) {
                //console.log("preload");
               // saveCurrentPosition(mangaId, currentPage);
            }
          }
        }
      });
    }, {
      rootMargin: '300px 0px', // Load images 300px before they appear
      threshold: 0.1
    });
  
    // Observe each image container
    const imageContainers = document.querySelectorAll('.manga-page-container');
    imageContainers.forEach((container) => observer.observe(container));
  }

// Function to get image data from local storage
function getImageFromCache(pageNumber, mangaId) {
    // console.log("freshloadedcache", freshloadedcache);
     freshloadedcache = true;
     setInterval(() => {
         //console.log("freshloadedcache", freshloadedcache);
         freshloadedcache = false;
     }, 3000)
     const cacheKey = `imagePage_${mangaId}_${pageNumber}`;
     const cachedData = localStorage.getItem(cacheKey);
     if (cachedData) {
         return JSON.parse(cachedData);
     }
     return null;
 }

// Function to save image data to local storage
function saveImageToCache(pageNumber, imgSrc, nextLink, mangaId) {
    const cacheKey = `imagePage_${mangaId}_${pageNumber}`;
    const cacheData = { imgSrc, nextLink, timestamp: Date.now(), mangaId };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
}


  function addErrorHandlingToImage(image, imgSrc, pageNumber) {
    const subdomains = ['i1', 'i2', 'i3', 'i4', 'i5', 'i7']; // Add the alternative subdomains here
    let currentSubdomainIndex = 0;

    function updateImageSource(newSrc) {
        image.src = newSrc;
        image.dataset.src = newSrc; // Update data-src attribute
        updateImageCache(newSrc);
    }

    function updateImageCache(newSrc) {
        const mangaId = extractMangaId(window.location.href);
        const cachedData = getImageFromCache(pageNumber, mangaId);
        if (cachedData) {
            cachedData.imgSrc = newSrc;
            saveImageToCache(pageNumber, newSrc, cachedData.nextLink, mangaId);
            console.log(`Updated cache for page ${pageNumber} with new URL: ${newSrc}`);
        }
    }

    image.onerror = function() {
        console.warn(`Failed to load image: ${imgSrc} on page ${pageNumber}. Retrying...`);
        
        if (!imageStatus[pageNumber].retryCount) {
            imageStatus[pageNumber].retryCount = 0;
        }

        if (imageStatus[pageNumber].retryCount < subdomains.length) {
            imageStatus[pageNumber].retryCount++;
            
            const newSubdomain = subdomains[currentSubdomainIndex];
            const newImgSrc = imgSrc.replace(/i\d/, newSubdomain);

            currentSubdomainIndex = (currentSubdomainIndex + 1) % subdomains.length;
            console.log(`Retrying with new subdomain: ${newSubdomain} for page ${pageNumber}`);
            
            setTimeout(() => {
                updateImageSource(newImgSrc);
                // Update the local storage cache for this page
                const mangaId = extractMangaId(window.location.href);
                const cachedData = getImageFromCache(pageNumber, mangaId);
                if (cachedData) {
                    saveImageToCache(pageNumber, newImgSrc, cachedData.nextLink, mangaId);
                    console.log(`Updated local storage cache for page ${pageNumber} with new URL: ${newImgSrc}`);
                }
            }, 1000);
        } else {
            console.error(`Failed to load image on page ${pageNumber} after multiple attempts.`);
            image.alt = `Failed to load page ${pageNumber}`;
        }
    };

    // Update cache even if image loads successfully from cache
    image.onload = function() {
        updateImageCache(image.src);
    };
}


    // Create an IntersectionObserver to prioritize loading images that are in or near the viewport
// Create an IntersectionObserver to prioritize loading images that are in or near the viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const imgElement = entry.target.querySelector('img');
            if (imgElement && imgElement.dataset.src) {
                imgElement.src = imgElement.dataset.src; // Load the image
                observer.unobserve(entry.target); // Stop observing after loading
                
                // Save the current scroll position as soon as the image starts loading
                const mangaId = extractMangaId(window.location.href);
                const currentPage = getCurrentVisiblePage(); // Get the current visible page number
                if (!isPopupVisible || freshloadedcache) {
                    //console.log("intesect");
                   // saveCurrentPosition(mangaId, currentPage);
                }
            }
            
        }
    });
}, {
    rootMargin: '200px 0px', // Adjust for preloading images slightly outside the viewport
    threshold: 0.1 // Trigger loading when 10% of the image is in view
});

function observePageContainer(container) {
    observer.observe(container); // Observe each page container for lazy loading
}

    
    addCustomStyles();


// Compress data into a string format
function compressData(data) {
    return JSON.stringify(data);
}

// Decompress data from string format
function decompressData(data) {
    return JSON.parse(data);
}

async function storeData(mangaId, pageNum) {
  const existingData = await retrieveData(mangaId);
  const existingPageNum = existingData ? existingData.pageNum : 0;

  if (pageNum > existingPageNum) {
    const currentTime = Date.now();
    const data = { pageNum, lastAccessed: currentTime };
    const compressedData = compressData(data);
    await GM.setValue(mangaId, compressedData);

    // Manage storage size if it exceeds the limit
    await manageStorage();
  }
}

// Retrieve data from Tampermonkey storage
async function retrieveData(mangaId) {
    const compressedData = await GM.getValue(mangaId, null);
    if (compressedData) {
        return decompressData(compressedData);
    }
    return null;
}

// Delete the least recently accessed data if the limit is reached
async function manageStorage() {
    const MAX_ENTRIES = 52;  // Limit to store 50 recent hentai
    const keys = await GM.listValues();
    // Only consider numeric manga ID keys; ignore metadata and other keys like 'justRead'
    const mangaIdKeys = keys.filter(k => /^\d+$/.test(k));
    if (mangaIdKeys.length > MAX_ENTRIES) {
        const entries = [];
        for (let key of mangaIdKeys) {
            const value = await GM.getValue(key);
            const data = decompressData(value);
            if (data && typeof data.lastAccessed === 'number') {
                entries.push({ key, lastAccessed: data.lastAccessed });
            }
        }

        // Sort by last accessed time, oldest first
        entries.sort((a, b) => a.lastAccessed - b.lastAccessed);

        // Remove the oldest entries until we're under the limit
        const excess = entries.length - MAX_ENTRIES;
        for (let i = 0; i < excess; i++) {
            await GM.deleteValue(entries[i].key);
        }
    }
}

let isRestoringPosition = false; // Flag to prevent overwriting saved position



function getCurrentPageFromURL() {
    const match = window.location.pathname.match(/\/g\/\d+\/(\d+)(\/|$)/);
    return match ? parseInt(match[1], 10) : 1; // Default to 1 if not found
}

// Prefer DOM over URL when determining the current page
function getCurrentPageFromDOM() {
    const currentEl = document.querySelector('.page-number .current');
    const numPagesEl = document.querySelector('.page-number .num-pages');
    if (currentEl) {
        const cur = parseInt(currentEl.textContent.trim(), 10);
        if (!Number.isNaN(cur) && cur > 0) {
            if (numPagesEl) {
                const total = parseInt(numPagesEl.textContent.trim(), 10);
                if (!Number.isNaN(total) && total > 0) {
                    return Math.min(cur, total);
                }
            }
            return cur;
        }
    }
    return null;
}

function getAccurateCurrentPage() {
    const domPage = getCurrentPageFromDOM();
    if (domPage) return domPage;
    return getCurrentPageFromURL();
}


async function loadSavedPosition(mangaId) {
    console.log(`Trying to load saved position for: ${mangaId}`);

    const savedData = await retrieveData(mangaId);
    console.log(`Saved data retrieved:`, savedData); // Log the retrieved data

    const savedPage = savedData.pageNum;
    if (savedPage && savedPage >= totalPages - 3) {
        await GM.deleteValue(mangaId);
        console.log(`Saved position deleted for ${mangaId} since it's within 3 pages of the end.`);
        return;
    }

    if (savedData) {
        const savedPage = savedData.pageNum;
        console.log(`Saved page is: ${savedPage}`); // Log the saved page number

        const currentPage = getAccurateCurrentPage(); // Prefer DOM current page when available
        console.log(`Current page is: ${currentPage}`); // Log the current page number

        // Only proceed if the saved page is different from the current one
        if (savedPage && savedPage !== currentPage) {
            console.log(`Restoring to saved page: ${savedPage}`);
            isRestoringPosition = true; // Set the flag before restoring the position

            const pageContainers = document.querySelectorAll('.manga-page-container');
            console.log(`Total page containers loaded: ${pageContainers.length}`); // Log how many pages are loaded

            if (pageContainers.length > 0) {
                // Directly scroll to the saved page
                scrollToSavedPage(pageContainers, savedPage);
            } else {
                console.log(`Waiting for pages to load...`);
                waitForPageContainers(savedPage); // Use a MutationObserver to wait for containers
            }
        } else {
            console.log(`Not restoring saved position for ${mangaId}. Current page is the same as saved page.`);
        }
    } else {
        console.log(`No saved position found for ${mangaId}.`);
    }

    isRestoringPosition = false; // Reset the flag after restoring the position
}

function waitForPageContainers(savedPageWithOffset) {
    const observer = new MutationObserver((mutations, obs) => {
        const pageContainers = document.querySelectorAll('.manga-page-container');
        if (pageContainers.length >= savedPageWithOffset) {
            console.log(`Page containers are now loaded: ${pageContainers.length}`);
            obs.disconnect(); // Stop observing once the pages are loaded
            scrollToSavedPage(pageContainers, savedPageWithOffset); // Scroll to the saved page
        }
    });

    // Observe changes in the DOM (specifically looking for added nodes)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Queue for specific page loading
const specificPageQueue = [];



// Function to load a specific page by redirecting to its URL
async function loadSpecificPage(pageNumber) {
    const mangaId = extractMangaId(window.location.href); // Extract manga ID from current URL
    const pageUrl = `https://nhentai.net/g/${mangaId}/${pageNumber}/`; // Construct the URL for the specific page

    console.log(`Redirecting to page ${pageNumber} at URL: ${pageUrl}`);
    
    localStorage.setItem('redirected', 'true'); // Save the redirected state in local storage
    console.log(`Set redirected flag to true in storage.`); // Log confirmation of setting the flag

    window.location.href = pageUrl; // Redirect to the specific page URL
}

// Function to check if the page is redirected and load manga images
async function checkRedirected() {
    const wasRedirected = JSON.parse(localStorage.getItem('redirected') || 'false'); // Retrieve the redirected state

    if (wasRedirected) {
        const mangaId = extractMangaId(window.location.href);
        console.log(`Loading manga images for manga ID: ${mangaId}`); // Log the manga ID
        loadMangaButton.remove(); // Remove the load manga button since we already did it
        loadMangaImages(mangaId); // Call loadMangaImages after redirection
        console.log(`Reset redirected flag to false in storage.`); // Log confirmation of resetting the flag
        localStorage.setItem('redirected', JSON.stringify(false)); // Reset the flag in storage
    }
}
// Call the function every second
setInterval(checkRedirected, 1000);





async function scrollToSavedPage(pageContainers, savedPage, savedImgSrc) {
    const currentPage = getAccurateCurrentPage(); // Prefer DOM current page when available
    const savedPageIndex = savedPage - currentPage; // Calculate the effective saved page index

    console.log(`Current page: ${currentPage}, Adjusted index for saved page: ${savedPageIndex}`);

    // Check if the adjusted index is out of bounds
    if (savedPageIndex < 0 || savedPageIndex >= pageContainers.length) {
        console.warn(`Adjusted saved page index ${savedPageIndex} is out of bounds.`);
        console.log(`Page ${savedPage} is not loaded yet. Redirecting to its URL.`);
        loadSpecificPage(savedPage); // Redirect to the specific page
        return; // Exit early
    }

    const savedPageElement = pageContainers[savedPageIndex]; // Get the container for the saved page
    const img = savedPageElement.querySelector('img');


        // If the image is loaded
        if (img && img.complete) {
            console.log(`Image for page ${savedPage} loaded. Moving to it.`);
            if (/Mobi/i.test(navigator.userAgent)) {
            const rect = savedPageElement.getBoundingClientRect();
            window.scrollTo(rect.left, rect.top); // teleport on mobile
            } else {
            savedPageElement.scrollIntoView({ behavior: 'smooth' }); // scroll on desktop
            }
        } else {
        console.log(`Image for page ${savedPage} not loaded yet. Redirecting to its URL.`);
        loadSpecificPage(savedPage); // Redirect to the specific page
    }
}

//----------------------------------------------Make the second option later When in Main Script----------------------------------------------

        // If the image is loaded
        // if (img && img.complete) {
        //     console.log(`Image for page ${savedPage} loaded. Scrolling to it.`);
        //     savedPageElement.scrollIntoView({ behavior: 'smooth' });
        // }


        // If the image is loaded
        // if (img && img.complete) {
        //     console.log(`Image for page ${savedPage} loaded. Scrolling to it.`);
        //     savedPageElement.scrollIntoView({ behavior: 'smooth' });
        // }

//----------------------------------------------Make the second option later When in Main Script----------------------------------------------    



function getNextPageUrl(pageNumber) {
    console.log(`Searching for URL for page ${pageNumber}`);
    const pageLink = document.querySelector(`#image-container a[href*='/g/'][href*='/${pageNumber}/']`);
    console.log(`Found page link: ${pageLink}`);
    if (pageLink) {
      return pageLink.href;
    } else {
      console.log(`No URL found for page ${pageNumber}`);
      return null;
    }
  }




// Save the current position without checking for visibility// Save the current position based on the current page
async function saveCurrentPosition(mangaId) {
    const totalPages = document.querySelectorAll('.manga-page-container').length;
    const currentPage = getCurrentVisiblePage(); // Get the current page number from the URL

    // Log the total pages and current page for debugging
    console.log(`Total pages loaded: ${totalPages}, trying to save position for page: ${currentPage}`);

    // Always save the position
    if (!isRestoringPosition) { // Only save if we are not restoring
        await storeData(mangaId, currentPage);
        console.log(`Position saved: Manga ID: ${mangaId}, Page: ${currentPage}`);
    } else {
        console.log(`Not saving position for Manga ID: ${mangaId} as we are restoring.`);
    }
}


// Periodically clean up storage
    manageStorage();


    window.loadMangaButton = document.createElement('button');
    loadMangaButton.textContent = 'Load Manga';
    loadMangaButton.className = 'load-manga-btn';
    loadMangaButton.style.position = 'fixed';
    loadMangaButton.style.bottom = '0';
    loadMangaButton.style.right = '0';
    loadMangaButton.style.padding = '5px';
    loadMangaButton.style.margin = '0 10px 10px 0';
    loadMangaButton.style.zIndex = '9999999999';

if (window.location.href.startsWith("https://nhentai.net/g/")) {
    const buttonsDiv = document.querySelectorAll('.buttons');

    if (buttonsDiv.length > 0) {
        //console.log('Buttons div already exists.');
    } else if (!document.body.contains(loadMangaButton)) {
        document.body.appendChild(loadMangaButton);

        loadMangaButton.addEventListener('click', async function () {
            const mangaId = extractMangaId(window.location.href);
            if (mangaId) {
                loadMangaImages(); // Load the manga images first

                // Check if there's a saved position for the manga
                const savedPosition = await retrieveData(mangaId);
                if (savedPosition) {
                    const savedPage = savedPosition.pageNum;
                    if (savedPage && savedPage >= totalPages - 3) {
                        await GM.deleteValue(mangaId);
                        console.log(`Saved position deleted for ${mangaId} since it's within 3 pages of the end.`);
                    } else {
                        showPopupForSavedPosition("Do you want to load your last saved position?", async () => {
                            await loadSavedPosition(mangaId);
                        }, {
                            confirmText: 'Yes',
                            cancelText: 'No',
                            duration: 10000
                        });
                    }
                } else {
                    console.log('No saved position found for manga ID:', mangaId);
                }
            }
            loadMangaButton.remove();
        });
    }
}
    
    
        
    })();


//---------------------------**Continue Reading**---------------------------------

// Function to add the Continue Reading button to the menu
function addContinueReadingButton() {
    // Create the Continue Reading button
    const continueReadingButtonHtml = `
      <li>
        <a href="/continue_reading/">
          <i class="fa fa-arrow-right"></i>
          Continue Reading
        </a>
      </li>
    `;
    const continueReadingButton = $(continueReadingButtonHtml);

    // Append the Continue Reading button to the dropdown menu and the left menu
    const dropdownMenu = $('ul.dropdown-menu');
    dropdownMenu.append(continueReadingButton);

    const menu = $('ul.menu.left');
    menu.append(continueReadingButton);
}

// Call the function to add the Continue Reading button
addContinueReadingButton();

// Handle continue_reading page
if (window.location.href.includes('/continue_reading')) {
    console.log('Continue reading page detected');
    
    // Remove 404 Not Found elements
    const notFoundHeading = document.querySelector('h1');
    if (notFoundHeading && notFoundHeading.textContent === '404 – Not Found') {
        notFoundHeading.remove();
    }
    
    const notFoundMessage = document.querySelector('p');
    if (notFoundMessage && notFoundMessage.textContent === "Looks like what you're looking for isn't here.") {
        notFoundMessage.remove();
    }

    // Add custom CSS for better styling with dark theme
    const customCSS = document.createElement('style');
    customCSS.textContent = `
        body {
            background-color: #2c2c2c;
            color: #f1f1f1;
            margin: 0;
            padding: 0;
        }
        
        .continue-reading-container {
            width: 95%;
            max-width: 1200px;
            margin: 20px auto;
            font-family: Arial, sans-serif;
            padding: 20px;
            overflow-x: hidden;
            overflow-y: auto;
            /*max-height: 100vh; /* Prevents it from exceeding the screen height */
        }
        
        h1.continue-reading-title {
            text-align: center;
            color: #ed2553;
            margin-bottom: 20px;
        }
        
        table.manga-table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            background-color: #3c3c3c;
            border-radius: 5px;
            overflow: hidden;
            box-sizing: border-box;
            table-layout: fixed;
        }
        
        .manga-table th {
            background-color: #ed2553;
            color: white;
            padding: 12px;
            text-align: left;
        }
        
        .manga-table td {
            padding: 12px;
            border-bottom: 1px solid #4c4c4c;
            word-wrap: break-word;
            vertical-align: top;
        }
        
        /* Adjust column widths to optimize vertical layout */
        .manga-table th:nth-child(1),
        .manga-table td:nth-child(1) {
            width: 30%;
        }
        
        .manga-table th:nth-child(2),
        .manga-table td:nth-child(2) {
            width: 30%;
        }
        
        .manga-table th:nth-child(3),
        .manga-table td:nth-child(3) {
            width: 30%;
        }
        
        .manga-table th:nth-child(4),
        .manga-table td:nth-child(4) {
            width: 30%;
        }
        
        .manga-table th:nth-child(5),
        .manga-table td:nth-child(5) {
            width: 30%;
            text-align: center;
        }
        
        .manga-table tr:hover {
            background-color: #4c4c4c;
        }
        
        .manga-table a {
            color: #ed2553;
            text-decoration: none;
            font-weight: bold;
        }
        
        .manga-table a:hover {
            text-decoration: underline;
        }
        
        .manga-title {
            display: flex;
            align-items: flex-start;
            flex-wrap: wrap;
        }
        
        .manga-cover {
            width: 50px;
            height: 70px;
            margin-right: 10px;
            margin-bottom: 5px;
            object-fit: cover;
            border-radius: 3px;
        }
        
        .manga-title a {
            display: inline-block;
            /* Allow title to wrap properly */
            word-break: break-word;
            overflow-wrap: break-word;
            width: 100%;
            max-height: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4; /* Number of lines to show */
            -webkit-box-orient: vertical;
        }
        
        .progress-bar-container {
            width: 100%;
            background-color: #555;
            height: 8px;
            border-radius: 4px;
            margin-top: 5px;
        }
        
        .progress-bar {
            height: 100%;
            border-radius: 4px;
            background-color: #ed2553;
        }
        
        .language-tag {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            background-color: #555;
            font-size: 12px;
            text-transform: capitalize;
        }
        
        .continue-button {
            display: inline-block;
            padding: 6px 12px;
            background-color: #ed2553;
            color: white !important;
            border-radius: 4px;
            text-align: center;
            transition: background-color 0.2s;
        }
        
        .continue-button:hover {
            background-color: #c91c45;
            text-decoration: none !important;
        }
        
        .loading-indicator {
            text-align: center;
            margin: 20px 0;
            font-size: 16px;
            color: #ed2553;
        }
        
        .img-error {
            border: 2px solid #ed2553;
            position: relative;
        }
        
        .remove-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            color: #ed2553; /* Initial red icon */
            border: 2px solid #ed2553; /* Red border */
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            transition: background-color 0.2s, color 0.2s, transform 0.1s, box-shadow 0.2s;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            margin: 0 auto;
        }

        .remove-button:hover {
            background-color: #ed2553; /* Turns red */
            color: white; /* Icon turns white */
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
            transform: scale(1.1);
        }

        .remove-button:active {
            transform: scale(0.95);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        /* Responsive adjustments for smaller screens */
        @media (max-width: 768px) {
            .continue-reading-container {
                width: 98%;
                padding: 10px;
            }
            
            .manga-table th, 
            .manga-table td {
                padding: 8px 6px;
            }
            
            .manga-cover {
                width: 40px;
                height: 56px;
            }
            
            .continue-button {
                padding: 4px 8px;
                font-size: 14px;
            }
            
            /* For the continue button column */
            .manga-table td:nth-child(4) {
                position: relative;
                vertical-align: middle;
            }
            
            /* Align the continue button to the bottom */
            .manga-table td:nth-child(4) .continue-button {
                position: relative;
                bottom: 8px;
                left: 6px;
            }
        }
    `;
    document.head.appendChild(customCSS);

    // Create container element
    const container = document.createElement('div');
    container.className = 'continue-reading-container';
    document.body.appendChild(container);
    
    // Add title
    const title = document.createElement('h1');
    title.className = 'continue-reading-title';
    title.textContent = 'Continue Reading';
    container.appendChild(title);
    
    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Loading your manga collection...';
    container.appendChild(loadingIndicator);

    // Implement the continue reading page
    const mangaList = [];
    
    // Array of possible subdomains to try
    const subdomains = ['t3', 't', 't1', 't2', 't4', 't5', 't7'];
    
    // Helper function to check if an image URL exists
    function checkImageExists(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

// Helper function to find a working image URL
async function findWorkingImageUrl(mediaId) {
    for (const subdomain of subdomains) {
        // Try both webp and png formats
        const webpUrl = `https://${subdomain}.nhentai.net/galleries/${mediaId}/cover.webp`;
        const pngUrl = `https://${subdomain}.nhentai.net/galleries/${mediaId}/cover.png`;
        const jpgUrl = `https://${subdomain}.nhentai.net/galleries/${mediaId}/cover.jpg`;

        console.log(`Trying cover image URL: ${webpUrl}`);
        const webpExists = await checkImageExists(webpUrl);
        if (webpExists) {
            console.log(`Found working URL: ${webpUrl}`);
            return webpUrl;
        }

        console.log(`Trying cover image URL: ${pngUrl}`);
        const pngExists = await checkImageExists(pngUrl);
        if (pngExists) {
            console.log(`Found working URL: ${pngUrl}`);
            return pngUrl;
        }

        console.log(`Trying cover image URL: ${jpgUrl}`);
        const jpgExists = await checkImageExists(jpgUrl);
        if (jpgExists) {
            console.log(`Found working URL: ${jpgUrl}`);
            return jpgUrl;
        }
    }
    // If all fail, return the default with t3 subdomain as fallback
    return `https://t3.nhentai.net/galleries/${mediaId}/cover.jpg`;
}

// Function to create and display the table
function displayMangaTable() {
    if (mangaList.length === 0) {
        loadingIndicator.textContent = 'No manga found in your collection.';
        return;
    }
    
    // Sort the manga list by most recently read (highest page number to lowest)
    mangaList.sort((a, b) => b.currentPage - a.currentPage);
    console.log('Sorted manga list:', mangaList);

    // Create a table to display the manga list
    const table = document.createElement('table');
    table.className = 'manga-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Manga Title</th>
                <th>Progress</th>
                <th>Language</th>
                <th>Action</th>
                <th>Remove</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    
    const tbody = table.querySelector('tbody');

    // Add each manga to the table
    mangaList.forEach(manga => {
        console.log('Adding manga to table:', manga);
        const row = document.createElement('tr');
        
        // Calculate progress percentage
        const progressPercent = (manga.currentPage / manga.pages) * 100;
        
        row.innerHTML = `
            <td>
                <div class="manga-title">
                    <img class="manga-cover" src="${manga.coverImageUrl}" alt="Cover" onerror="this.classList.add('img-error')">
                    <a href="/g/${manga.id}/" title="${manga.title}">${manga.title}</a>
                </div>
            </td>
            <td>
                <div>Page ${manga.currentPage} of ${manga.pages}</div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progressPercent}%"></div>
                </div>
            </td>
            <td><span class="language-tag">${manga.languageDisplay}</span></td>
            <td><a href="/g/${manga.id}/${manga.currentPage}/" class="continue-button" onclick="localStorage.setItem('redirected', 'true');">Continue Reading</a></td>            
            <td><button class="remove-button" data-id="${manga.id}">X</button></td>
        `;
        tbody.appendChild(row);

        // Remove manga entry from GM storage when 'X' button is clicked
        row.querySelector('.remove-button').addEventListener('click', function() {
            const mangaId = this.getAttribute('data-id');
            console.log(`Attempting to remove manga ID: ${mangaId}`);

            showPopup(
                'Are you sure you want to remove this manga from your continue watching list?',
                {
                    buttons: [
                        { text: 'Yes', action: 'confirm', callback: async () => {
                            // User confirmed, proceed with removal
                            console.log(`Removing manga ID: ${mangaId}`);
                            await GM.deleteValue(mangaId);
                            await GM.deleteValue(`metadata_${mangaId}`);
                            console.log(`Manga ID ${mangaId} removed from GM storage`);
                            row.remove(); // Remove row from table
                        }},
                        { text: 'No', action: 'cancel' }
                    ],
                    closeButton: false, // No separate close button
                    autoClose: false // Do not auto-close
                }
            );
        });
   

    // Remove loading indicator and add the table
    loadingIndicator.remove();
    container.appendChild(table);
    console.log('Table added to page');


            
            // Handle image loading errors and try alternative subdomains
            const imgElement = row.querySelector('.manga-cover');
            imgElement.addEventListener('error', async function() {
                console.log(`Image failed to load: ${manga.coverImageUrl}`);
                
                // Extract media ID from the URL
                const urlParts = manga.coverImageUrl.split('/');
                const mediaId = urlParts[urlParts.length - 2];
                
                // Find a working URL
                const newUrl = await findWorkingImageUrl(mediaId);
                
                if (newUrl !== manga.coverImageUrl) {
                    console.log(`Updating image URL from ${manga.coverImageUrl} to ${newUrl}`);
                    this.src = newUrl;
                    
                    // Update the cached metadata with the working URL
                    const metadataKey = `metadata_${manga.id}`;
                    GM.getValue(metadataKey, null).then(cachedMetadata => {
                        if (cachedMetadata) {
                            const metadata = JSON.parse(cachedMetadata);
                            metadata.coverImageUrl = newUrl;
                            GM.setValue(metadataKey, JSON.stringify(metadata))
                                .then(() => console.log(`Updated cached metadata with new URL for manga ID: ${manga.id}`));
                        }
                    });
                }
            });
        });

        // Remove loading indicator and add the table
        loadingIndicator.remove();
        container.appendChild(table);
        console.log('Table added to page');
    }
    
    // Function to fetch manga data from API and save it to GM.setValue
    async function fetchAndSaveMangaData(mangaId, pageNum) {
        const metadataKey = `metadata_${mangaId}`;
        
        // Try to get cached metadata first
        const cachedMetadata = await GM.getValue(metadataKey, null);
        
        if (cachedMetadata) {
            console.log(`Using cached metadata for manga ID: ${mangaId}`);
            const metadata = JSON.parse(cachedMetadata);
            
            mangaList.push({
                id: mangaId,
                title: metadata.title,
                coverImageUrl: metadata.coverImageUrl,
                languageDisplay: metadata.languageDisplay,
                pages: metadata.pages,
                currentPage: pageNum,
            });
            
            // Check if we have all manga data and display the table
            checkAndDisplayTable();
            return;
        }
        
        // If no cached data, fetch from API
        console.log(`Fetching metadata for manga ID: ${mangaId}`);
        try {
            const response = await fetch(`https://nhentai.net/api/gallery/${mangaId}`);
            const data = await response.json();
            
            if (data) {
                console.log('Fetched manga data:', data);
                const mangaTitle = data.title.english;
                const mediaId = data.media_id;
                
                // Get a working cover image URL with appropriate subdomain
                const coverImageUrl = await findWorkingImageUrl(mediaId);
                
                // Determine which language to display
                let languageDisplay = 'Unknown';
                const languages = data.tags.filter(tag => tag.type === 'language').map(tag => tag.name.toLowerCase());
                if (languages.includes('english')) {
                    languageDisplay = 'English';
                } else if (languages.includes('translated') && languages.length === 1) {
                    languageDisplay = 'English';
                } else if (languages.includes('translated') && languages.length > 1) {
                    // Exclude 'translated' and show other language(s)
                    const otherLanguages = languages.filter(lang => lang !== 'translated');
                    languageDisplay = otherLanguages.length > 0 ? otherLanguages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(', ') : 'Unknown';
                } else {
                    languageDisplay = languages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(', ');
                }
                
                const pages = data.num_pages;
                
                // Create metadata object to cache
                const metadata = {
                    title: mangaTitle,
                    coverImageUrl: coverImageUrl,
                    languageDisplay: languageDisplay,
                    pages: pages,
                    lastUpdated: Date.now()
                };
                
                // Save metadata to GM storage
                await GM.setValue(metadataKey, JSON.stringify(metadata));
                console.log(`Saved metadata for manga ID: ${mangaId}`);
                
                mangaList.push({
                    id: mangaId,
                    title: mangaTitle,
                    coverImageUrl: coverImageUrl,
                    languageDisplay: languageDisplay,
                    pages: pages,
                    currentPage: pageNum,
                });
                
                // Check if we have all manga data and display the table
                checkAndDisplayTable();
            } else {
                console.log('No data found for manga ID:', mangaId);
                checkAndDisplayTable();
            }
        } catch (error) {
            console.error('Error fetching manga data:', error);
            checkAndDisplayTable();
        }
    }
    
    // Counter to track pending fetch operations
    let pendingFetches = 0;
    let totalMangaCount = 0;
    
    // Function to check if all data is fetched and display the table
    function checkAndDisplayTable() {
        pendingFetches--;
        loadingIndicator.textContent = `Loading your manga collection... (${totalMangaCount - pendingFetches}/${totalMangaCount})`;
        
        if (pendingFetches <= 0) {
            displayMangaTable();
        }
    }


    // Function to delete completed manga
    async function deleteCompletedManga() {
        const allKeys = await GM.listValues();
        console.log('All keys:', allKeys);
        
        // Get all manga IDs (numerical keys)
        const mangaIds = allKeys.filter(key => key.match(/^\d+$/));
        
        // Process each manga
        for (const mangaId of mangaIds) {
            console.log('Processing manga ID:', mangaId);
            const mangaData = await GM.getValue(mangaId);
            const mangaDataObject = JSON.parse(mangaData);
            const pagesRead = mangaDataObject.pageNum;
            const metadataKey = `metadata_${mangaId}`;
            const metadata = await GM.getValue(metadataKey);
            const metadataObject = JSON.parse(metadata);
            const totalPages = metadataObject.pages;
            
            // Check if manga is completed (within 3 pages of the end)
            if (pagesRead >= totalPages - 3) {
                console.log(`Deleting completed manga ID: ${mangaId}`);
                await GM.deleteValue(mangaId);
                await GM.deleteValue(metadataKey);
            }
        }
    }


    // Main function to load manga
    async function getStoredManga() {
        const mangaIds = [];
        const allValues = {};
        
        for (const key of await GM.listValues()) {
            const value = await GM.getValue(key);
            allValues[key] = value;
            
            if (key.match(/^\d+$/)) {
                mangaIds.push(key);
            }
        }
        
        console.log('All values:', allValues);
        totalMangaCount = mangaIds.length;
        pendingFetches = totalMangaCount;
        
        if (totalMangaCount === 0) {
            loadingIndicator.textContent = 'No manga found in your collection.';
            return;
        }
        
        // Process each manga
        mangaIds.forEach(mangaId => {
            console.log('Processing manga ID:', mangaId);
            const mangaData = JSON.parse(allValues[mangaId]);
            fetchAndSaveMangaData(mangaId, mangaData.pageNum);
        });
    }
     deleteCompletedManga();
    // Start the process
    getStoredManga();
}

// Resolve incomplete justRead metadata across pages
function resolveJustReadMetadata() {
    try {
        const raw = localStorage.getItem('justRead');
        if (!raw) return;
        const list = JSON.parse(raw) || [];
        const needsUpdate = list.filter(m => {
            const isPlaceholderCover = !m.coverImageUrl || (typeof m.coverImageUrl === 'string' && m.coverImageUrl.startsWith('data:image'));
            const unknownTitle = !m.title || m.title === 'Unknown';
            const unknownLang = !m.language || m.language === 'Unknown';
            return isPlaceholderCover || unknownTitle || unknownLang;
        });
        if (needsUpdate.length === 0) return;

        needsUpdate.forEach(async (m) => {
            const metadataKey = `metadata_${m.id}`;
            try {
                const cached = await GM.getValue(metadataKey, null);
                let title = m.title;
                let languageDisplay = m.language;
                let coverImageUrl = m.coverImageUrl;

                if (cached) {
                    const meta = JSON.parse(cached);
                    title = meta.title || title;
                    coverImageUrl = meta.coverImageUrl || coverImageUrl;
                    languageDisplay = meta.languageDisplay || languageDisplay;
                } else {
                    const resp = await fetch(`https://nhentai.net/api/gallery/${m.id}`);
                    const data = await resp.json();
                    if (data) {
                        title = data.title?.english || title;
                        const mediaId = data.media_id;
                        // Resolve cover: use helper if available, else fallback
                        let workingCover = null;
                        try {
                            if (typeof findWorkingImageUrl === 'function') {
                                workingCover = await findWorkingImageUrl(mediaId);
                            }
                        } catch (_) {
                            // ignore and fallback
                        }
                        if (!workingCover) {
                            // Fallback across broader subdomains and formats
                            const subdomainsAll = ['i1', 'i2', 'i3', 'i4', 'i5', 'i7', 't1', 't2', 't3', 't4', 't5', 't7'];
                            const formats = ['webp', 'png', 'jpg'];
                            for (const sub of subdomainsAll) {
                                for (const fmt of formats) {
                                    const url = `https://${sub}.nhentai.net/galleries/${mediaId}/cover.${fmt}`;
                                    const ok = await new Promise((resolve) => {
                                        const img = new Image();
                                        img.onload = () => resolve(true);
                                        img.onerror = () => resolve(false);
                                        img.src = url;
                                    });
                                    if (ok) { workingCover = url; break; }
                                }
                                if (workingCover) break;
                            }
                        }
                        coverImageUrl = workingCover || coverImageUrl;

                        // Language processing
                        const languages = data.tags.filter(t => t.type === 'language').map(t => t.name.toLowerCase());
                        if (languages.includes('english')) {
                            languageDisplay = 'English';
                        } else if (languages.includes('translated') && languages.length === 1) {
                            languageDisplay = 'English';
                        } else if (languages.includes('translated') && languages.length > 1) {
                            const other = languages.filter(l => l !== 'translated');
                            languageDisplay = other.length > 0 ? other.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ') : 'Unknown';
                        } else {
                            languageDisplay = languages.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ');
                        }

                        // Cache metadata
                        await GM.setValue(metadataKey, JSON.stringify({
                            title,
                            coverImageUrl,
                            languageDisplay
                        }));
                    }
                }

                // Persist back to justRead
                const existingList = JSON.parse(localStorage.getItem('justRead')) || [];
                const idx = existingList.findIndex(x => x.id === m.id);
                if (idx !== -1) {
                    existingList[idx] = {
                        ...existingList[idx],
                        title,
                        coverImageUrl,
                        language: languageDisplay
                    };
                    localStorage.setItem('justRead', JSON.stringify(existingList));
                }
            } catch (err) {
                console.warn(`Failed resolving justRead metadata for ${m.id}`, err);
            }
        });
    } catch (e) {
        console.warn('resolveJustReadMetadata encountered an error', e);
    }
}

// Sync justRead from GM storage to localStorage if needed, then resolve metadata
(async () => {
    try {
        const gmJustRead = await GM.getValue('justRead', null);
        const localJustRead = localStorage.getItem('justRead');
        if (gmJustRead && !localJustRead) {
            localStorage.setItem('justRead', gmJustRead);
            resolveJustReadMetadata();
            await GM.deleteValue('justRead');
        } else {
            resolveJustReadMetadata();
        }
    } catch (e) {
        resolveJustReadMetadata();
    }
})();

//---------------------------**Continue Reading**---------------------------------

//---------------------------**Show-Popup-Function**--------------------------------
function showPopup(message, options = {}) {
    // Default options
    const defaultOptions = {
        timeout: 3000,           // Default timeout of 3 seconds
        width: '250px',          // Default width
        buttons: [],             // Additional buttons besides close
        closeButton: true,       // Show close button
        autoClose: true          // Auto close after timeout
    };

    // Merge default options with provided options
    const settings = { ...defaultOptions, ...options };

    // Create popup element
    const popup = document.createElement('div');
    popup.id = 'popup';

    // Create buttons HTML if provided
    let buttonsHTML = '';
    if (settings.buttons && settings.buttons.length > 0) {
        buttonsHTML = '<div class="popup-buttons">';
        settings.buttons.forEach(button => {
            buttonsHTML += `<button class="popup-btn" data-action="${button.action || ''}">${button.text}</button>`;
        });
        buttonsHTML += '</div>';
    }

    // Create close button HTML if enabled
    const closeButtonHTML = settings.closeButton ?
        '<button class="close-btn">&times;</button>' : '';

    // Populate popup HTML
    popup.innerHTML = `
        <div class="popup-content">
            ${closeButtonHTML}
            <p>${message}</p>
            ${buttonsHTML}
        </div>
    `;
    document.body.appendChild(popup);

    // Add CSS styling for the popup
    const style = document.createElement('style');
    style.textContent = `
        #popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            border-radius: 5px;
            z-index: 9999;
            padding: 15px;
            width: ${settings.width};
            text-align: center;
        }
        .popup-content {
            position: relative;
            padding: 10px;
        }
        .close-btn {
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            transition: color 0.3s, opacity 0.3s;
        }
        .close-btn:hover {
            color: #ff0000;
            opacity: 0.7;
        }
        .popup-buttons {
            margin-top: 15px;
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        .popup-btn {
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 3px;
            padding: 5px 10px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .popup-btn:hover {
            background: #444;
        }
    `;
    document.head.appendChild(style);

    // Function to close the popup
    const closePopup = () => {
        if (document.body.contains(popup)) {
            document.body.removeChild(popup);
            document.head.removeChild(style);
        }
    };

    // Close button event listener
    if (settings.closeButton) {
        const closeBtn = popup.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closePopup);
        }
    }

    // Add event listeners for custom buttons
    if (settings.buttons && settings.buttons.length > 0) {
        const buttons = popup.querySelectorAll('.popup-btn');
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                // Execute the callback if provided
                if (settings.buttons[index].callback && typeof settings.buttons[index].callback === 'function') {
                    settings.buttons[index].callback(e);
                }

                // Close the popup after button click if closeOnClick is true
                if (settings.buttons[index].closeOnClick !== false) {
                    closePopup();
                }
            });
        });
    }

    // Auto-close the popup after the specified timeout
    let timeoutId;
    if (settings.autoClose && settings.timeout > 0) {
        timeoutId = setTimeout(closePopup, settings.timeout);
    }

    // Return an object with methods to control the popup
    return {
        close: closePopup,
        updateMessage: (newMessage) => {
            const messageElement = popup.querySelector('p');
            if (messageElement) {
                messageElement.innerHTML = newMessage;
            }
        },
        resetTimeout: () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (settings.autoClose && settings.timeout > 0) {
                timeoutId = setTimeout(closePopup, settings.timeout);
            }
        }
    };
}
//---------------------------**Show-Popup-Function**--------------------------------
