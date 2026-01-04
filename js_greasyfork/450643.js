// ==UserScript==
// @name         NEXUS/Global Entry Appointment Monitor
// @namespace    https://ttp.cbp.dhs.gov/
// @version      0.1
// @description  Get you the appointment you deserve!
// @author       You
// @match        https://ttp.cbp.dhs.gov/*
// @icon         https://ttp.cbp.dhs.gov/favicon.ico
// @grant        GM_notification
// @license.     MIT
// @downloadURL https://update.greasyfork.org/scripts/450643/NEXUSGlobal%20Entry%20Appointment%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/450643/NEXUSGlobal%20Entry%20Appointment%20Monitor.meta.js
// ==/UserScript==

const LOCATION_ID = '5446'; // 5020: Blaine (Nexus), 5446: San Francisco, 5420: SeaTac
const DATE_FILTER_REGEX = /"(2022-(09|10|11|12)-\d\d)T/g; // You may change the year/month

(function() {
    'use strict';

    console.log('Running NEXUS Monitor');
    var apptList = new Set();
    let areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));
    setInterval(() => {
        fetch(
            `https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&limit=10&locationId=${LOCATION_ID}&minimum=1`)
            .then(res => res.text())
            .then(res => {
                const dates = new Set([...res.matchAll(DATE_FILTER_REGEX)].map(x=>x[1]));
                console.log(dates);
                if (areSetsEqual(dates, apptList)) return;
                apptList = dates;
                if (!apptList.size) return;
                GM_notification({
                    text: `An appointment(s) is available: ${[...dates].join(' ')}`,
                    title: 'Trusted Traveler Program'
                });
            });
    }, 1000);
})();