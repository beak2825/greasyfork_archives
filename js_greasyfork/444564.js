// ==UserScript==
// @name         Scrape npidb.org
// @namespace    https://alamote.pp.ua
// @match        https://npidb.org/*
// @grant        none
// @version      2.1
// @namespace    AlaMote
// @description  Scrape npidb.org DMEs
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444564/Scrape%20npidborg.user.js
// @updateURL https://update.greasyfork.org/scripts/444564/Scrape%20npidborg.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    let isRunning = false;

    if (location.pathname === '/') {
        addControls();
    } else if (location.pathname.endsWith('.aspx') && location.search.includes('process')) {
        processView();
    } else if (location.search.includes('process')) {
        processListing();
    }

    function processListing() {
        const opened = openLinks();
        if (!opened) {
            console.log('AM: Waiting for DMEs...');
            const interval = setInterval(() => {
                if (openLinks()) {
                    clearInterval(interval);
                    if (location.search.includes('close')) {
                        window.close();
                    }
                }
            }, 1000);
        }

        function openLinks() {
            const input = document.querySelector('#location');
            if (!input) {
                console.log('AM: DMEs not found.');
                return false;
            }

            console.log('AM: Opening DMEs...');
            const links = document.querySelectorAll('table > tbody > tr > td:nth-child(2) > h2 > a');
            if (!links.length) {
                console.log('AM: DMEs listing is empty.');
            }
            for (let i = 0; i < links.length; i++) {
                window.open(location.origin + links.item(i).getAttribute('href') + '?close=true&process=true', '_blank');
            }
            if (location.search.includes('close')) {
                window.close();
            }

            return true;
        }
    }

    function processView() {
        const dme = {
            lbn: document.querySelector('[itemprop="name"].text-success')?.innerText ?? null,
            link: location.origin + location.pathname,
            address: document.querySelector('address[itemprop="address"]')?.innerText ?? null,
            phone: document.querySelector('[itemprop="telephone"]')?.innerText ?? null,
            fax: document.querySelector('[itemprop="faxNumber"]')?.innerText ?? null,
            specialty: document.querySelector('td[itemprop="medicalSpecialty"]')?.innerText ?? null,
            tax_id: document.querySelector('td[itemprop="medicalSpecialty"] + td')?.innerText ?? null,
            specialty_code: document.querySelector('td[itemprop="medicalSpecialty"] + td + td')?.innerText ?? null,
            provider_type: document.querySelector('td[itemprop="medicalSpecialty"] + td + td + td')?.innerText ?? null,
        };

        const h2s = document.querySelectorAll('h2');
        let tableContainer = null;
        for (let i = 0; i < h2s.length; i++) {
            if (h2s.item(i).innerText.trim().startsWith('NPI Profile & details')) {
                tableContainer = h2s.item(i).parentNode?.parentNode;
                break;
            }
        }
        if (tableContainer) {
            const map = {
                'NPI #': 'npi',
                'NPI Number': 'npi',
                'LBN Legal business name': 'lbn',
                'DBA Doing business as': 'dba',
                'Authorized official': 'authorized',
                'Entity': 'entity',
                'Organization subpart 1': 'is_sub_part',
                'Enumeration date': 'enumeration_date',
                'Last updated': 'last_updated',
                'Identifiers': 'identifiers',
            };
            const rows = tableContainer.querySelectorAll('table tr');
            for (let i = 0; i < rows.length; i++) {
                const h = rows.item(i).querySelector('td:first-child');
                if (map[h.innerText.trim()]) {
                    dme[map[h.innerText.trim()]] = rows.item(i).querySelector('td:last-child').innerText.trim()
                }
            }
        }

        localStorage.setItem(`dme_${dme.npi}`, JSON.stringify(dme));
        if (location.search.includes('close')) {
            window.close();
        }
    }

    function run() {
        isRunning = true;
        let start = 1;
        const input = document.getElementById('am_page_number');
        if (input) {
            start = input.value;
        }
        const end = 31;
        console.log(`AM: Starting process from page ${start}`);

        let page = start;
        open(page);

        const checkbox = document.getElementById('auto_process');
        if (checkbox && checkbox.checked) {
            const interval = setInterval(() => {
                if (page > end) {
                    clearInterval(interval);
                }
                open(page);
            }, 10000)
            }

        function open() {
            if (input) {
                input.value = page;
            }
            const label = document.getElementById('processed_dmes');
            if (label) {
                label.innerHTML = 'DMEs saved: ' + Object.keys(localStorage).filter(k => k.startsWith('dme_')).length;
            }
            localStorage.setItem('last_page', page);
            console.log(`AM: Opeining ${page} page`);
            window.open(`https://npidb.org/organizations/suppliers/durable-medical-equipment-medical-supplies_332b00000x/co/?page=${page}&process=true&close=true`, '_blank');
            page++;
        }
    }

    function send() {
        const max = 100;
        const keys = Object.keys(localStorage).filter(k => k.startsWith('dme_'));
        const length = keys.length;
        for (let i = 0; i < Math.ceil(length / max); i++) {
            const dmes = keys.slice(i * max, (i + 1) * max).map(k => localStorage.getItem(k));
            console.log(`Sending ${i + 1} part - ${dmes.length} DMEs...`);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://connect.loca.lt/api/referrals/ancillary/dmes/bulk', true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnMXdlYmFwcCIsImF1ZCI6Imcxd2ViYXBwIiwiaWF0IjoxNjUxODU1MzA1LCJzdWIiOiIyZWU4YTg2ODBlNjg3NWZlNTMwZWIzMDlmMjA0MDM4YWI1NzRiYzFmIn0.cED8dWJ2PxgUaY_qIyQUeNQW44pbIXP7KcmNImtVRUc');
            xhr.send(JSON.stringify(dmes));
        }
        alert(`${length} DMEs have beed saved.`);
    }

    function addControls() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '16px';
        container.style.left = '16px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.padding = '8px';
        container.style.background = 'white';
        container.style.border = '1px solid #ccc';

        const containerRow = document.createElement('div');
        containerRow.style.display = 'flex';
        containerRow.style.alignItems = 'center';

        const label = document.createElement('label');
        label.innerHTML = 'Page';
        label.style.margin = '0';

        const input = document.createElement('input');
        input.id = 'am_page_number';
        input.type = 'number';
        input.value = localStorage.getItem('last_page') ?? 1;
        input.style.marginLeft = '8px';

        const runBtn = document.createElement('button');
        runBtn.innerHTML = 'Run';
        runBtn.style.marginLeft = '8px';
        runBtn.addEventListener('click', () => {
            if (!isRunning) {
                run();
            }
        });

        const sendBtn = document.createElement('button');
        sendBtn.innerHTML = 'Send';
        sendBtn.style.marginLeft = '8px';
        sendBtn.addEventListener('click', send);

        containerRow.appendChild(label);
        containerRow.appendChild(input);
        containerRow.appendChild(runBtn);
        containerRow.appendChild(sendBtn);
        container.appendChild(containerRow);

        const containerRow2 = document.createElement('div');
        containerRow2.style.marginTop = '8px';
        containerRow2.style.display = 'flex';
        containerRow2.style.alignItems = 'center';

        const checkbox = document.createElement('input');
        checkbox.id = 'auto_process';
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.style.marginLeft = '8px';
        checkbox.style.marginTop = '0';

        const checkboxLabel = document.createElement('label');
        checkboxLabel.innerHTML = 'Auto process';
        checkboxLabel.style.margin = '0';

        containerRow2.appendChild(checkboxLabel);
        containerRow2.appendChild(checkbox);
        container.appendChild(containerRow2);

        const containerRow3 = containerRow2.cloneNode();

        const numberLabel = document.createElement('label');
        numberLabel.id = 'processed_dmes';
        numberLabel.style.margin = '0';
        numberLabel.innerHTML = 'DMEs saved: ' + Object.keys(localStorage).filter(k => k.startsWith('dme_')).length;

        containerRow3.appendChild(numberLabel);
        container.appendChild(containerRow3);

        document.body.appendChild(container);
    }

})();