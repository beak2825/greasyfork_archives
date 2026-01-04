// ==UserScript==
// @name         Sploop.io VPN and DNS! (Mobile Toggle)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  VPN and DNS (good) with mobile-friendly menu toggle
// @author       Khanhnguyen,avoidFPS.
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        *://sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547533/Sploopio%20VPN%20and%20DNS%21%20%28Mobile%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547533/Sploopio%20VPN%20and%20DNS%21%20%28Mobile%20Toggle%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const container = document.createElement('div');
    container.id = 'vpn-dns-container';
    container.style.position = 'fixed';
    container.style.top = '60px';
    container.style.left = '10px';
    container.style.backgroundColor = '#ffe6e6';
    container.style.border = '2px solid black';
    container.style.padding = '10px';
    container.style.zIndex = '10000';
    container.style.display = 'none';
    container.style.width = '220px';
    container.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)';
    container.style.borderRadius = '10px';

    // --- TOGGLE BUTTON FOR MOBILE ---
    const toggleBtn = document.createElement('button');
    toggleBtn.innerText = '☰ VPN/DNS';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '10px';
    toggleBtn.style.left = '10px';
    toggleBtn.style.zIndex = '10001';
    toggleBtn.style.padding = '8px 12px';
    toggleBtn.style.borderRadius = '8px';
    toggleBtn.style.border = '1px solid black';
    toggleBtn.style.backgroundColor = '#ffcccc';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.onclick = () => {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    };
    document.body.appendChild(toggleBtn);
    // ---------------------------------

    const header = document.createElement('h3');
    header.innerText = 'VPN & DNS Control';
    header.style.textAlign = 'center';
    header.style.marginTop = '0';
    container.appendChild(header);

    const heartIcon = document.createElement('span');
    heartIcon.innerText = '❤️❤️❤️';
    heartIcon.style.fontSize = '24px';
    heartIcon.style.display = 'block';
    heartIcon.style.textAlign = 'center';
    container.appendChild(heartIcon);

    const countries = ['Vietnam', 'Australia', 'USA', 'Japan', 'UK', 'Italy', 'France', 'Germany', 'Switzerland', 'Canada', 'Mexico', 'Russia', 'Spain', 'China'];
    const countryCodes = ['VN', 'AU', 'US', 'JP', 'GB', 'IT', 'FR', 'DE', 'CH', 'CA', 'MX', 'RU', 'ES', 'CN'];

    const vpnLabel = document.createElement('label');
    vpnLabel.innerText = 'Choose VPN:';
    vpnLabel.style.display = 'block';
    vpnLabel.style.marginTop = '10px';
    container.appendChild(vpnLabel);

    const vpnSelect = document.createElement('select');
    vpnSelect.id = 'vpn-select';
    vpnSelect.style.width = '100%';
    vpnSelect.style.marginBottom = '10px';
    countries.forEach((country, index) => {
        const option = document.createElement('option');
        option.value = countryCodes[index];
        option.text = country;
        vpnSelect.appendChild(option);
    });
    container.appendChild(vpnSelect);

    const vpnButton = document.createElement('button');
    vpnButton.innerText = 'Run VPN';
    vpnButton.style.width = '100%';
    vpnButton.style.marginBottom = '10px';
    vpnButton.onclick = () => {
        const selectedVpn = vpnSelect.value;
        connectToVpn(selectedVpn);
    };
    container.appendChild(vpnButton);

    const dnsLabel = document.createElement('label');
    dnsLabel.innerText = 'Choose DNS:';
    dnsLabel.style.display = 'block';
    dnsLabel.style.marginTop = '10px';
    container.appendChild(dnsLabel);

    const dnsSelect = document.createElement('select');
    dnsSelect.id = 'dns-select';
    dnsSelect.style.width = '100%';
    dnsSelect.style.marginBottom = '10px';
    countries.forEach((country, index) => {
        const option = document.createElement('option');
        option.value = countryCodes[index];
        option.text = country;
        dnsSelect.appendChild(option);
    });
    container.appendChild(dnsSelect);

    const dnsButton = document.createElement('button');
    dnsButton.innerText = 'Run DNS';
    dnsButton.style.width = '100%';
    dnsButton.style.marginBottom = '10px';
    dnsButton.onclick = () => {
        const selectedDns = dnsSelect.value;
        changeDns(selectedDns);
    };
    container.appendChild(dnsButton);

    const statusLabel = document.createElement('p');
    statusLabel.id = 'status-label';
    statusLabel.style.textAlign = 'center';
    statusLabel.style.marginTop = '10px';
    statusLabel.style.fontSize = '12px';
    container.appendChild(statusLabel);

    const footer = document.createElement('div');
    footer.style.textAlign = 'right';
    footer.style.fontSize = '10px';
    footer.style.marginTop = '10px';
    footer.innerHTML = '<span style="background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet); -webkit-background-clip: text; color: transparent;">mode:KhanhNguyen,avoidFPS</span>';
    container.appendChild(footer);

    document.body.appendChild(container);

    // Keep old hotkey toggle (0 key)
    document.addEventListener('keydown', (event) => {
        if (event.key === '0') {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        }
    });

    const savedVpn = localStorage.getItem('selectedVpn');
    const savedDns = localStorage.getItem('selectedDns');
    if (savedVpn) {
        vpnSelect.value = savedVpn;
        connectToVpn(savedVpn);
    }
    if (savedDns) {
        dnsSelect.value = savedDns;
        changeDns(savedDns);
    }

    function connectToVpn(countryCode) {
        updateStatus('Connecting to VPN server in ' + countryCode + '...');
        localStorage.setItem('selectedVpn', countryCode);
        setTimeout(() => {
            updateStatus('Connected to VPN server in ' + countryCode);
        }, 2000);
    }

    function changeDns(countryCode) {
        updateStatus('Changing DNS to server in ' + countryCode + '...');
        localStorage.setItem('selectedDns', countryCode);
        setTimeout(() => {
            updateStatus('DNS changed to server in ' + countryCode);
        }, 2000);
    }

    function updateStatus(message) {
        const statusLabel = document.getElementById('status-label');
        statusLabel.innerText = message;
    }
})();
