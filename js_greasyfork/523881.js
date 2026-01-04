// ==UserScript==
// @name         Bonk IP logger
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Steals IP addresses on Bonk.io with a fancy UI
// @author       Pugsby, with some help from Aspect#8445
// @match        *://bonk.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523881/Bonk%20IP%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/523881/Bonk%20IP%20logger.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(() => {
    console.log('████████████████████████████▀█████▀█████████████\n█▄─▄█▄─▄▄─███▄─▄███─▄▄─█─▄▄▄▄█─▄▄▄▄█▄─▄▄─█▄─▄▄▀█\n██─███─▄▄▄████─██▀█─██─█─██▄─█─██▄─██─▄█▀██─▄─▄█\n▀▄▄▄▀▄▄▄▀▀▀▀▀▄▄▄▄▄▀▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▀▄▄▀\nIP Logger made by Pugsby on greasyfork.')

    const loggedIPs = [];

    // Replace contents of div with id "descriptioninner"
    const descriptionDiv = document.getElementById("descriptioninner");
    if (descriptionDiv) {
        descriptionDiv.innerHTML = `
            <h1>Bonk.io - IP logger</h1>
            <p>
                <small>Made by <a href="https://greasyfork.org/en/users/1422616-pugsby" style="color:black">Pugsby</a></small><br>
                I don't know what to put here lol.<br>
                If you have any suggestions for the IP logger, DM me on discord. <b>@Pugsbyy</b><br>
                Please don't blame me if you go to prison for doxxing people.
            </p>
            <div id="ipBox" style="margin-top: 15px; max-height: 200px; overflow-y: auto; border-top: 1px solid #ccc; padding-top: 10px;">
                <strong>Logged IPs:</strong><br>No IPs logged yet.
            </div>
        `;
    }

    // Create UI elements
    const button = document.createElement('button');
    button.textContent = 'Show IPs';
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 15px';
    button.style.border = 'none';
    button.style.backgroundColor = '#050510';
    button.style.color = 'white';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '5px';
    document.body.appendChild(button);

    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '50%';
    menu.style.left = '20px'; // Position the menu on the left
    menu.style.transform = 'translateY(-50%)'; // Center vertically
    menu.style.backgroundColor = '#fff';
    menu.style.border = '2px solid #4CAF50';
    menu.style.borderRadius = '10px';
    menu.style.padding = '20px';
    menu.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    menu.style.display = 'none';
    menu.style.zIndex = '10000';
    document.body.appendChild(menu);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X'; // Change text to "X"
    closeButton.style.padding = '5px 10px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.color = '#f44336';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px'; // Move to the right side of the menu
    closeButton.onclick = () => {
        menu.style.display = 'none';
    };
    menu.appendChild(closeButton);

    // Override addIceCandidate method
    window.onload = () => {
        let iframe = document.getElementById("maingameframe");
        let w = iframe.contentWindow;

        w.RTCPeerConnection.prototype.addIceCandidate2 = w.RTCPeerConnection.prototype.addIceCandidate;
        w.RTCPeerConnection.prototype.addIceCandidate = function(...args) {
            if (!args[0].address.includes(".local")) {
                loggedIPs.push(args[0].address);
                console.log(args[0].address)
                updateIPList();
            }
            this.addIceCandidate2(...args);
        }
    };

    // Update the IP list display
    function updateIPList() {
        const ipBox = document.getElementById("ipBox");
        if (ipBox) {
            ipBox.innerHTML = '<strong><h2>Logged IPs</h2></strong><br>' + (loggedIPs.length > 0 ? loggedIPs.join('<br>') : 'No IPs logged yet.');
        }
    }

    // Scroll to the IP box on button click
    button.onclick = () => {
        const ipBox = document.getElementById("ipBox");
        if (ipBox) {
            ipBox.scrollIntoView({ behavior: 'smooth' });
        }
    };
})();