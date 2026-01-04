// ==UserScript==
// @name         Enhanced Conceptual Web VPN
// @namespace    https://greasyfork.org/users/123456
// @version      2.0
// @description  An improved conceptual Web VPN interface
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517830/Enhanced%20Conceptual%20Web%20VPN.user.js
// @updateURL https://update.greasyfork.org/scripts/517830/Enhanced%20Conceptual%20Web%20VPN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject Tailwind CSS (you'll need to include this in your actual userscript)
    const tailwindCss = `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = tailwindCss;
    document.head.appendChild(styleElement);

    const vpnHtml = `
        <div id="vpn-container" class="fixed top-0 left-0 bg-gray-100 border border-gray-300 p-4 shadow-md z-50 w-64">
          <h1 class="text-lg font-bold mb-2">Conceptual Web VPN</h1>
          <select id="serverList" class="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Server</option>
            <option value="us-ny">US - New York</option>
            <option value="us-la">US - Los Angeles</option>
            <option value="us-chi">US - Chicago</option>
            <option value="us-sf">US - San Francisco</option>
            <option value="uk-london">UK - London</option>
            <option value="ca-toronto">CA - Toronto</option>
            <option value="au-sydney">AU - Sydney</option>
            <option value="de-berlin">DE - Berlin</option>
            <option value="fr-paris">FR - Paris</option>
            <option value="jp-tokyo">JP - Tokyo</option>
            <option value="sg-singapore">SG - Singapore</option>
            <option value="in-mumbai">IN - Mumbai</option>
            <option value="br-sao-paulo">BR - Sao Paulo</option>
            <option value="za-johannesburg">ZA - Johannesburg</option> 
          </select>
          <button id="connectBtn" class="mt-2 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Connect</button>
          <div id="status" class="mt-2 font-bold">Disconnected</div>
          <button id="fullscreenBtn" class="mt-2 w-full p-2 bg-green-500 text-white rounded hover:bg-green-600">Fullscreen</button>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = vpnHtml;
    document.body.appendChild(div);

    const vpnContainer = document.getElementById('vpn-container');
    const serverList = document.getElementById('serverList');
    const connectBtn = document.getElementById('connectBtn');
    const statusDiv = document.getElementById('status');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    connectBtn.addEventListener('click', () => {
        if (serverList.value) {
            statusDiv.textContent = 'Connecting...';
            setTimeout(() => {
                statusDiv.textContent = 'Connected to ' + serverList.value;
            }, 1000);
        } else {
            statusDiv.textContent = 'Please select a server.';
        }
    });

    let isFullscreen = false;
    fullscreenBtn.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            vpnContainer.classList.add('w-screen', 'h-screen');
            vpnContainer.style.top = '0';
            vpnContainer.style.left = '0';
            vpnContainer.style.transform = '';

        } else {
            vpnContainer.classList.remove('w-screen', 'h-screen');
            vpnContainer.style.width = '64px';
            vpnContainer.style.height = 'auto';

        }
    });


    let isDragging = false;
    let offsetX, offsetY;

    vpnContainer.addEventListener('mousedown', (e) => {
        if (!isFullscreen) return;
        isDragging = true;
        offsetX = e.clientX - vpnContainer.offsetLeft;
        offsetY = e.clientY - vpnContainer.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !isFullscreen) return;
        vpnContainer.style.left = (e.clientX - offsetX) + 'px';
        vpnContainer.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'l' && e.repeatCount === 2) {
            fullscreenBtn.click(); // Toggle fullscreen on Ctrl+L+L
        }
    });
})();