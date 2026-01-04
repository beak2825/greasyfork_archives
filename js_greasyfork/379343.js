// ==UserScript==
// @name         selectCustomerFor
// @namespace    csdc
// @version      0.0.2
// @description  select Customer For
// @author       Zoff
// @match        https://users.yoroi.company/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379343/selectCustomerFor.user.js
// @updateURL https://update.greasyfork.org/scripts/379343/selectCustomerFor.meta.js
// ==/UserScript==

var jQuery = window.jQuery;
const customerMapping = {/*
    ric: [
        'AETNA',
        'BPER',
        'Deda Corp',
        'Emaze',
        'Enel',
        'Errevi',
        'Fercam',
        'Ferretti',
        'GUBER',
        'ITAS',
        'HDI Assicurazioni',
        'Hupac',
        'Industrial Wear',
        'O.M.P.',
        'Rhiag',
        'SCM',
        'SOCOGAS',
        'STAFF',
        'TXT'
    ],
    fanto: [
        'A&A',
        'ASTRA',
        'Brunello',
        'CUTICONSAI',
        'Day Risto',
        'Ducati',
        'Sole 24',
        'Graniti Fiandre',
        'Loccioni',
        'MD Spa',
        'MTA Spa',
        'NovaNext ',
        'Poltrona Frau',
        'Refresco',
        'SACBO',
        'SACMI',
        'Stroili',
        'TeamSystem',
        'Terzani'
    ],
    dani: [
        'CED.IS',
        'Valentini'
    ],*/
    ric: '586bc7552316c030967cf2d2',
    dani: '55d5a5b646c21ba921889ccf',
    fanto: '58c01c757d7f6c47ac065fbd',
    deda: [
        '[Dedagroup]'
    ]
};
(function() {
    'use strict';
    let firstRun = true;

    async function doGet(url) {
        const rawResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'x-csrftoken': getCsrfToken(),
            }
        });
        return await rawResponse.json();
    }

    async function realSelect(analyst) {
        if (!(analyst in customerMapping)) {
            alert(`Analyst ${analyst} not found!`);
            return
        }
        if ((typeof customerMapping[analyst]) === 'string') {
            console.log('[STARTED] Loading customers info for '+analyst);
            const customers = (await doGet('https://users.yoroi.company/api/customer')).map(c => ({_id: c._id, name: c.commonName}));
            const user = await doGet('https://users.yoroi.company/api/user/'+customerMapping[analyst]);
            const assignedCustomers = user.assignedCustomers.filter(c => c.preload).map(c => c.customer);
            customerMapping[analyst] = customers.filter(c => assignedCustomers.indexOf(c._id)>=0).map(c => c.name);
            console.log('[COMPLETED] Loading customers info for '+analyst);
        }
        customerMapping[analyst].forEach(customer => {
            const elements = jQuery(`customer-selector-list li div:contains("${customer}")`);
            for (let i=0; i<elements.length; i++) {
                if (jQuery('.fa-square-o', elements[i]).length > 0) {
                    elements[i].click();
                }
            }
        });
    }

    window.selectCustomerFor = function(analyst) {
        if (!analyst) {
            console.log('Available options: ' + Object.keys(customerMapping));
            return;
        }
        if (!jQuery('customer-selector-list').is(':visible')) {
            if (firstRun) {
                jQuery('customer-selector > div > button:nth-child(1)')[0].click();
                firstRun = false;
            }
            setTimeout(() => window.selectCustomerFor(analyst),100);
            return;
        }
        firstRun = true;
        jQuery('button:contains("Deselect ALL")')[0].click();
        analyst.split('+').map(s => s.trim()).forEach(a => realSelect(a));
    }
})();