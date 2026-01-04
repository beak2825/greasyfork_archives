// ==UserScript==
// @name         Is it Down? (Updated)
// @version      0.6.1
// @namespace    https://trackerstatus.info/
// @description  Pulls from TrackerStatus API and displays status on supported trackers
// @match        https://redacted.sh/*
// @match        https://orpheus.network/*
// @match        https://passthepopcorn.me/*
// @match        https://broadcasthe.net/*
// @match        https://gazellegames.net/*
// @match        https://alpharatio.cc/*
// @match        https://anthelion.me/*
// @match        https://nebulance.io/*
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508248/Is%20it%20Down%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/508248/Is%20it%20Down%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Settings = {
        showIfStable: false,
        checkInterval: 120000, // check every 2 mins by default
        apiEndpoints: {
            'redacted.sh': 'https://red.trackerstatus.info/api/all/',
            'orpheus.network': 'https://ops.trackerstatus.info/api/all/',
            'passthepopcorn.me': 'https://ptp.trackerstatus.info/api/all/',
            'broadcasthe.net': 'https://btn.trackerstatus.info/api/all/',
            'gazellegames.net': 'https://ggn.trackerstatus.info/api/all/',
            'alpharatio.cc': 'https://ar.trackerstatus.info/api/all/',
            'anthelion.me': 'https://ant.trackerstatus.info/api/all/',
            'nebulance.io': 'https://nbl.trackerstatus.info/api/all/'
        }
    };

    const styles = `
        .tracker-status {
            position: fixed;
            z-index: 9999;
            box-sizing: border-box;
            width: 100%;
            display: none;
            padding: 0.2rem;
            bottom: 0;
            left: 0;
            font-size: 14px;
            text-align: center;
        }
        .tracker-status--stable { background-color: #056B00; }
        .tracker-status--offline { background-color: #A00E0E; }
        .tracker-status--unstable { background-color: #FFA500; }
        .tracker-status--both { background-color: #FF4B33; }
        .tracker-status__message {
            color: white;
            font-weight: bold;
            margin: 0;
        }
        .tracker-status__link {
            color: white;
            text-decoration: underline;
        }
        body {
            transition: margin-bottom 0.3s ease;
        }
    `;

    function createStatusElement() {
        const trackerStatus = document.createElement('div');
        trackerStatus.className = 'tracker-status';

        const message = document.createElement('p');
        message.className = 'tracker-status__message';

        trackerStatus.appendChild(message);
        document.body.append(trackerStatus);

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        return trackerStatus;
    }

    function updateStatus(trackerStatus) {
        const currentDomain = window.location.hostname;
        const apiUrl = Settings.apiEndpoints[currentDomain];

        if (!apiUrl) {
            console.error('No API endpoint found for the current domain');
            return;
        }

        GM.xmlHttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            onload: function(response) {
                const messageElement = trackerStatus.querySelector('.tracker-status__message');

                if (response.status >= 200 && response.status < 400) {
                    const services = JSON.parse(response.responseText);
                    const downServices = Object.entries(services).filter(service => service[1].Status === '0');
                    const unstableServices = Object.entries(services).filter(service => service[1].Status === '2');

                    if (downServices.length > 0 && unstableServices.length > 0) {
                        trackerStatus.className = 'tracker-status tracker-status--both';
                        messageElement.innerHTML = `The following services are currently offline or unstable: ${[...downServices, ...unstableServices].map(service => service[0]).join(', ')}. <a class="tracker-status__link" href="${apiUrl.replace('/api/all/', '')}">More info</a>`;
                        trackerStatus.style.display = 'block';
                    } else if (downServices.length > 0) {
                        trackerStatus.className = 'tracker-status tracker-status--offline';
                        messageElement.innerHTML = `The following services are currently offline: ${downServices.map(service => service[0]).join(', ')}. <a class="tracker-status__link" href="${apiUrl.replace('/api/all/', '')}">More info</a>`;
                        trackerStatus.style.display = 'block';
                    } else if (unstableServices.length > 0) {
                        trackerStatus.className = 'tracker-status tracker-status--unstable';
                        messageElement.innerHTML = `The following services are unstable: ${unstableServices.map(service => service[0]).join(', ')}. <a class="tracker-status__link" href="${apiUrl.replace('/api/all/', '')}">More info</a>`;
                        trackerStatus.style.display = 'block';
                    } else {
                        trackerStatus.className = 'tracker-status tracker-status--stable';
                        messageElement.textContent = 'All systems operational.';
                        trackerStatus.style.display = Settings.showIfStable ? 'block' : 'none';
                    }
                } else {
                    console.error('Error fetching tracker status');
                    trackerStatus.className = 'tracker-status tracker-status--offline';
                    messageElement.innerHTML = 'Error fetching tracker status.';
                    trackerStatus.style.display = 'block';
                }

                const statusHeight = trackerStatus.offsetHeight;
                document.body.style.marginBottom = trackerStatus.style.display !== 'none' ? `${statusHeight}px` : '0';
            },
            onerror: function(error) {
                console.error('Error fetching tracker status:', error);
                const messageElement = trackerStatus.querySelector('.tracker-status__message');
                trackerStatus.className = 'tracker-status tracker-status--offline';
                messageElement.innerHTML = 'Error fetching tracker status.';
                trackerStatus.style.display = 'block';

                const statusHeight = trackerStatus.offsetHeight;
                document.body.style.marginBottom = `${statusHeight}px`;
            }
        });
    }

    const trackerStatus = createStatusElement();
    updateStatus(trackerStatus);
    setInterval(() => updateStatus(trackerStatus), Settings.checkInterval);

    window.addEventListener('resize', () => {
        const statusHeight = trackerStatus.offsetHeight;
        document.body.style.marginBottom = trackerStatus.style.display !== 'none' ? `${statusHeight}px` : '0';
    });
})();
