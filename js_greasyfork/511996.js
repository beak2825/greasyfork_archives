// ==UserScript==
// @name         Allegro Colors Toolbar
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Injects a toolbar with Allegro Colors into webpages using an iframe.
// @author       
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511996/Allegro%20Colors%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/511996/Allegro%20Colors%20Toolbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The HTML content of the toolbar page
    const toolbarHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Allegro Colors Toolbar</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        /* Disable blinking cursor and text selection */
        button,
        #statusMessage,
        li {
          user-select: none;
        }

        /* Static space for the status message */
        #statusMessage {
          width: 200px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        /* Make menu options wider */
        #colorsList li,
        #popupMenuOptions li,
        #nestedMenu li {
          min-width: 150px;
        }
      </style>
    </head>
    <body class="bg-gray-900 text-white">
      <!-- Docked Bottom Panel -->
      <div class="fixed inset-x-0 bottom-0 bg-gray-800 p-4 shadow-lg flex justify-between items-center">
        <!-- Centered Menu Buttons -->
        <div class="flex-1 flex justify-center space-x-4">
          <!-- Allegro Colors Dropdown Menu -->
          <div class="relative">
            <button id="menuButtonColors" class="bg-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-600">
              Allegro Colors
            </button>
            <!-- Pop-up Menu (Upwards) -->
            <div id="popupMenuColors" class="absolute bottom-12 right-0 bg-gray-700 text-white shadow-lg rounded-md hidden">
              <ul class="p-2" id="colorsList"></ul>
            </div>
          </div>
          <!-- Advanced Modal Button -->
          <button id="advancedModalButton" class="bg-purple-700 px-4 py-2 rounded-md hover:bg-purple-600">
            Advanced Modal
          </button>
          <!-- Multi-level Dropdown Button -->
          <div class="relative">
            <button id="menuButtonOptions" class="bg-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-600">
              Options Menu
            </button>
            <!-- Multi-level Pop-up Menu -->
            <div id="popupMenuOptions" class="absolute bottom-12 right-0 bg-gray-700 text-white shadow-lg rounded-md hidden">
              <ul class="p-2">
                <li class="px-4 py-2 hover:bg-gray-600 cursor-pointer">Option 1</li>
                <li class="px-4 py-2 hover:bg-gray-600 cursor-pointer">Option 2</li>
                <li class="relative px-4 py-2 hover:bg-gray-600 cursor-pointer" id="nestedMenuTrigger">Option 3 with Submenu
                  <!-- Nested Menu -->
                  <ul id="nestedMenu" class="absolute left-full top-0 bg-gray-600 text-white shadow-lg rounded-md hidden">
                    <li class="px-4 py-2 hover:bg-gray-500 cursor-pointer">Sub-option 1</li>
                    <li class="px-4 py-2 hover:bg-gray-500 cursor-pointer">Sub-option 2</li>
                  </ul>
                </li>
                <li class="px-4 py-2 hover:bg-gray-600 cursor-pointer">Option 4</li>
                <li class="px-4 py-2 hover:bg-gray-600 cursor-pointer">Option 5</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Status Messages (Right-Aligned) -->
        <div class="text-sm">
          <span id="statusMessage">Status: Ready</span>
        </div>
      </div>
      <!-- Advanced Modal Structure -->
      <div id="advancedModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center hidden">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
          <h2 class="text-2xl font-semibold mb-4">Advanced Modal</h2>
          <p>This modal demonstrates more advanced features and actions.</p>
          <div class="flex space-x-4 mt-4">
            <button id="confirmButton" class="bg-green-700 px-4 py-2 rounded-md hover:bg-green-600">Confirm</button>
            <button id="cancelButton" class="bg-red-700 px-4 py-2 rounded-md hover:bg-red-600">Cancel</button>
          </div>
        </div>
      </div>
      <script>
        // COLORS_ALLEGRO definition
        const COLORS_ALLEGRO = {
          "Beżowy": "beige",
          "Złoty": "gold",
          "Srebrny": "silver",
          "Czarny": "black",
          "Biały": "white",
          "Szary": "gray",
          "Brązowy": "brown",
          "Granatowy": "navy",
          "Żółty": "yellow",
          "Różowy": "pink",
          "Niebieski": "blue",
          "Zielony": "green",
          "Fioletowy": "purple",
          "Pomarańczowy": "orange",
          "Czerwony": "red",
          "Wielokolorowy": "multicolor",
          "Bezbarwny": "transparent"
        };
        // Generate Colors List
        const colorsList = document.getElementById('colorsList');
        Object.keys(COLORS_ALLEGRO).forEach(color => {
          const listItem = document.createElement('li');
          listItem.textContent = color;
          listItem.setAttribute('data-color', COLORS_ALLEGRO[color]);
          listItem.classList.add('px-4', 'py-2', 'hover:bg-gray-600', 'cursor-pointer', 'main-color-option');
          listItem.addEventListener('mouseover', function () {
            listItem.style.backgroundColor = COLORS_ALLEGRO[color]; // Apply color on hover
          });
          listItem.addEventListener('mouseout', function () {
            listItem.style.backgroundColor = ''; // Reset background color on mouse out
          });
          colorsList.appendChild(listItem);
        });
        // Toggle Colors Menu
        document.getElementById('menuButtonColors').addEventListener('click', function () {
          const popupMenu = document.getElementById('popupMenuColors');
          popupMenu.classList.toggle('hidden');
        });
        // Advanced Modal Button
        document.getElementById('advancedModalButton').addEventListener('click', function () {
          document.getElementById('advancedModal').classList.remove('hidden');
        });
        // Confirm and Cancel buttons in Advanced Modal
        document.getElementById('confirmButton').addEventListener('click', function () {
          document.getElementById('statusMessage').textContent = "Status: Confirmed!";
          document.getElementById('advancedModal').classList.add('hidden');
        });
        document.getElementById('cancelButton').addEventListener('click', function () {
          document.getElementById('statusMessage').textContent = "Status: Canceled!";
          document.getElementById('advancedModal').classList.add('hidden');
        });
        // Multi-level Dropdown Toggle
        document.getElementById('menuButtonOptions').addEventListener('click', function () {
          const popupMenu = document.getElementById('popupMenuOptions');
          popupMenu.classList.toggle('hidden');
        });
        // Toggle Nested Menu
        document.getElementById('nestedMenuTrigger').addEventListener('mouseover', function () {
          const nestedMenu = document.getElementById('nestedMenu');
          nestedMenu.classList.remove('hidden');
        });
        document.getElementById('nestedMenuTrigger').addEventListener('mouseout', function () {
          const nestedMenu = document.getElementById('nestedMenu');
          nestedMenu.classList.add('hidden');
        });
        // Example Status Update
        setTimeout(() => {
          document.getElementById('statusMessage').textContent = "Status: Task Completed";
        }, 5000);
      </script>
    </body>
    </html>
    `;

    // Create an iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';

    // Set the srcdoc of the iframe to the toolbar HTML
    iframe.srcdoc = toolbarHTML;

    // Append the iframe to the body
    document.body.appendChild(iframe);

    // Adjust the height of the iframe after it loads
    iframe.onload = function() {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      const toolbarHeight = iframeDocument.querySelector('body').scrollHeight;
      iframe.style.height = toolbarHeight + 'px';
    };

})();
