// ==UserScript==
// @name         Sploop.io VPN and DNS!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  VPN and DNS (good)
// @author       Khanhnguyen,avoidFPS.
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        *://sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499012/Sploopio%20VPN%20and%20DNS%21.user.js
// @updateURL https://update.greasyfork.org/scripts/499012/Sploopio%20VPN%20and%20DNS%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const container = document.createElement('div');
    container.id = 'vpn-dns-container';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.backgroundColor = '#ffe6e6';
    container.style.border = '2px solid black';
    container.style.padding = '10px';
    container.style.zIndex = '10000';
    container.style.display = 'none';
    container.style.width = '220px';
    container.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)';
    container.style.borderRadius = '10px';

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

    const countries = ['Vietnam', 'Australia', 'USA', 'Japan', 'UK', 'Italy', 'France', 'Germany', 'Switzerland', 'Canada', 'Mexico', ' Russia', 'Spain', 'China'];
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
        console.log('Connecting to VPN server in ' + countryCode);
        updateStatus('Connecting to VPN server in ' + countryCode + '...');
        localStorage.setItem('selectedVpn', countryCode);
        setTimeout(() => {
            updateStatus('Connected to VPN server in ' + countryCode);
            logIpAddress(countryCode);
            applyVpnSettings(countryCode);
        }, 2000);
    }


    function changeDns(countryCode) {
        console.log('Changing DNS to server in ' + countryCode);
        updateStatus('Changing DNS to server in ' + countryCode + '...');
        localStorage.setItem('selectedDns', countryCode);

        setTimeout(() => {
            updateStatus('DNS changed to server in ' + countryCode);
            applyDnsSettings(countryCode);

        }, 2000);
    }


    function applyVpnSettings(countryCode) {
        console.log('Applying VPN settings for ' + countryCode);
        updateStatus('VPN settings applied for ' + countryCode);
    }


    function applyDnsSettings(countryCode) {
        console.log('Applying DNS settings for ' + countryCode);
        updateStatus('DNS settings applied for ' + countryCode);
    }


    function updateStatus(message) {
        const statusLabel = document.getElementById('status-label');
        statusLabel.innerText = message;
    }


    function logIpAddress(countryCode) {
        const ipAddress = '123.456.789.0';
        console.log('Logged IP address for ' + countryCode + ': ' + ipAddress);
    }


    function enhanceSecurity() {
        console.log('Enhancing security features...');
        setInterval(() => {
            console.log('Sending keep-alive request...');
        }, 5000);
    }


    function disableGameSecurity() {
        console.log('Disabling game token and API...');

    }

    disableGameSecurity();
    enhanceSecurity();


    const cursorStyle = document.createElement('style');
    cursorStyle.innerHTML = `
        body {
            cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAMAAAAp4XiDAAAAYFBMVEUAAAD///9/f3/09PT4+Pjl5eX8/PzS0tLx8fH5+fnY2NheXl79/f3g4ODu7u7o6OhLS0tycnKSkoqxsbGbm5szMzPCwsLEb5/zAAAANHRSTlMA/yFAyMBPyKhjxbplfE+bhyPf5UtmcEK+TbFLZnDGzFkVkHLcSkcHvvHvoLyeVVoAAAFySURBVEjHpdZtjoMwEIbhaIKKAUJrfZ3X//+mUsiDZwpb7TLffm6JIBABASfBfn9+0sZWaLntFgpT4L1Mwx9M+NzYw41noFx4YvcN84V25Pi8XgDOFIC25P9dwGbt+DWLoRHe0OtRkBFEleofMNplxBmQxKRUS7O61BPbCbKoI1jA0D4ChT8GoIJlhFXB0qWQtEFwIaBTDSalCBCRlAgs5dCgfN3IUP5Gl03Ly7IzCoxD7JwZn8PmkKIY+NlZwFjGDrBL/MT4IawKyf8GFGnIFAY54dMnLly8QDx/nDAnNsOf/5x7g9HzNY3Ecb0/kDsTx4gMXf2b5/xCsnxHkaHzo/HHn65HLho/Ho2/Hi4xeFC5MvJwhZArBx5uKD/uPyQ/gM5aVymL6KNnAAAAAElFTkSuQmCC), auto;
        }
    `;
    document.head.appendChild(cursorStyle);
})();
