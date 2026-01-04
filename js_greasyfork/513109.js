// ==UserScript==
// @name         IP Logger for Azar
// @namespace    /
// @version      1.0
// @description  Get ip adress and some other information about Azar user
// @author       MultiJump (for TamperMonkey integration) and Yannox (for script)
// @match        https://azarlive.com/*
// @icon         https://avatars.githubusercontent.com/u/42420419?s=48&v=4
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/513109/IP%20Logger%20for%20Azar.user.js
// @updateURL https://update.greasyfork.org/scripts/513109/IP%20Logger%20for%20Azar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function() {
    // Create and style the container for displaying IP addresses
    const ipContainer = document.createElement('div');
    ipContainer.id = 'ip-container';
    ipContainer.style.position = 'fixed';
    ipContainer.style.top = '10px';
    ipContainer.style.right = '10px';
    ipContainer.style.width = '400px';
    ipContainer.style.maxHeight = '500px';
    ipContainer.style.overflowY = 'auto';
    ipContainer.style.backgroundColor = '#f7f9fc';
    ipContainer.style.border = '1px solid #ccc';
    ipContainer.style.borderRadius = '12px';
    ipContainer.style.padding = '20px';
    ipContainer.style.zIndex = '10000';
    ipContainer.style.fontFamily = 'Arial, sans-serif';
    ipContainer.style.fontSize = '14px';
    ipContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    ipContainer.style.color = '#333';
    ipContainer.style.resize = 'both';
    ipContainer.style.overflow = 'auto';
    ipContainer.innerHTML = `
        <div id="drag-handle" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; cursor: move;">
            <h3 style="margin: 0; color: #007bff;">Detected IP Addresses</h3>
            <button id="clear-ip-list" style="padding: 10px 15px; border: none; background-color: #dc3545; color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s;">Clear</button>
            <button id="close-ip-container" style="padding: 10px 15px; border: none; background-color: #dc3545; color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s;">X</button>
        </div>
        <div id="ip-addresses"></div>
        <div id="twitter-button" style="margin-top: 10px; text-align: center;">
            <a href="https://x.com/euphoncaca" target="_blank" style="display: inline-block; background-color: #1da1f2; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 8px; transition: background-color 0.3s;">Suivez-moi sur Twitter</a>
        </div>
    `;
    document.body.appendChild(ipContainer);

    // Add event listener to clear button
    document.getElementById('clear-ip-list').addEventListener('click', () => {
        const ipList = document.getElementById('ip-addresses');
        ipList.innerHTML = '';
    });

    // Add event listener to close button
    document.getElementById('close-ip-container').addEventListener('click', () => {
        document.body.removeChild(ipContainer);
    });

    // Make the container draggable
    function makeDraggable(element, handle) {
        handle = handle || element;
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = (element.offsetTop - posY) + "px";
            element.style.left = (element.offsetLeft - posX) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    makeDraggable(ipContainer, document.getElementById('drag-handle'));

    window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;

    window.RTCPeerConnection = function(...args) {
        const pc = new window.oRTCPeerConnection(...args);

        pc.oaddIceCandidate = pc.addIceCandidate;

        pc.addIceCandidate = function(iceCandidate, ...rest) {
            const fields = iceCandidate.candidate.split(' ');

            if (fields[7] === 'srflx') {
                const ipAddress = fields[4];
                const currentTime = new Date().toLocaleTimeString();
                console.group('Detected IP Address');
                console.log('IP Address:', ipAddress);
                console.groupEnd();

                // Fetch ISP and city information without API key
                fetch(`https://ipapi.co/${ipAddress}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        const ispInfo = data.org || 'Unknown ISP';
                        const cityInfo = data.city || 'Unknown City';
                        const ipList = document.getElementById('ip-addresses');
                        const ipItem = document.createElement('div');
                        ipItem.className = 'ip-item';
                        ipItem.style.display = 'flex';
                        ipItem.style.flexDirection = 'column';
                        ipItem.style.backgroundColor = '#ffffff';
                        ipItem.style.border = '1px solid #ddd';
                        ipItem.style.padding = '15px';
                        ipItem.style.marginBottom = '10px';
                        ipItem.style.borderRadius = '8px';
                        ipItem.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        ipItem.style.transition = 'transform 0.2s, box-shadow 0.2s';
                        ipItem.style.cursor = 'pointer';
                        ipItem.onmouseover = function() {
                            ipItem.style.transform = 'scale(1.02)';
                            ipItem.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                        };
                        ipItem.onmouseout = function() {
                            ipItem.style.transform = 'scale(1)';
                            ipItem.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        };
                        ipItem.innerHTML = `
                            <span><strong>Time:</strong> ${currentTime}</span>
                            <span><strong>IP Address:</strong> ${ipAddress}</span>
                            <span><strong>ISP:</strong> ${ispInfo}</span>
                            <span><strong>City:</strong> ${cityInfo}</span>
                            <button style="margin-top: 10px; padding: 10px 15px; border: none; background-color: #007bff; color: white; border-radius: 8px; cursor: pointer; transition: background-color 0.3s;">Copy</button>
                        `;
                        ipList.appendChild(ipItem);

                        // Add copy functionality to the button
                        const copyButton = ipItem.querySelector('button');
                        copyButton.addEventListener('click', () => {
                            navigator.clipboard.writeText(ipAddress).then(() => {
                                copyButton.textContent = 'Copied!';
                                copyButton.style.backgroundColor = '#28a745';
                                setTimeout(() => {
                                    copyButton.textContent = 'Copy';
                                    copyButton.style.backgroundColor = '#007bff';
                                }, 2000);
                            });
                        });
                    })
                    .catch(error => console.error('Error fetching ISP and city information:', error));
            }

            return pc.oaddIceCandidate(iceCandidate, ...rest);
        }

        return pc;
    }
})();
})();