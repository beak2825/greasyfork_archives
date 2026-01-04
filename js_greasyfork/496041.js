// ==UserScript==
// @name         lads-promgen-extension
// @version      1.0.0
// @description  LADS Promgen Extension
// @author       Busung Kim
// @match        https://promgen.linecorp.com/project/**
// @grant        GM_addElement
// @license      MIT
// @namespace https://greasyfork.org/users/1192532
// @downloadURL https://update.greasyfork.org/scripts/496041/lads-promgen-extension.user.js
// @updateURL https://update.greasyfork.org/scripts/496041/lads-promgen-extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const headerElem = Array.from(document.getElementsByClassName('panel-heading')).filter(elem => elem.textContent.startsWith('Hosts'))[0];
    const divElem = GM_addElement(headerElem, 'div', {});
    headerElem.append(divElem);

    const inputElem = GM_addElement(divElem, 'input', {
        type: 'text',
        class: 'form-control',
        placeholder: 'Regex here (e.g. lads-ar0[0-9][0-9].+)',
        style: 'display: inline; width: 70%; margin-right: 10px',
    });

    const buttonElem = GM_addElement(divElem, 'a', {
        class: 'btn btn-warning btn-sm',
        role: 'button',
        textContent: 'Silence',
        style: 'display: inline'
    });
    buttonElem.onclick = async () => {
        silenceAll(inputElem.value);
    }
})();

async function silenceAll(regexPattern = '') {
    const regex = new RegExp(regexPattern);
    const targets = Array.from(document.querySelectorAll('div[class="panel panel-primary"] > table[class="table"] > tbody > tr'))
      .map(row => row.children[1].innerText)
      .filter(hostname => regex.test(hostname));
    const bc = document.querySelector('ol[class="breadcrumb"]');
    const service = bc.children[2].querySelector('li > a').textContent;
    const project = bc.children[3].querySelector('li > a').textContent;
    const now = new Date();

    const body = {
        "labels":
        {
            "service": `${service}`,
            "project": `${project}`,
            "instance": `${targets.map(hostname => `${hostname}:[0-9]*`).join('|')}`
        },
        "duration": "7d",
        "startsAt": `${formatTimestampOneWeekLater(now.getTime())}`,
        "endsAt": `${formatTimestampOneWeekLater(now.getTime() + 7 * 24 * 60 * 60 * 1000)}`,
        "createdBy": "Rocky Linux migration"
    };

    if (!confirm(`Do you want to silence ${targets.length} hosts?\n${targets.join('\n')}`)) {
        return;
    }
    if (targets.length === 0) {
        return;
    }

    await fetch('https://promgen.linecorp.com/proxy/v1/silences', {
        method: 'POST',
        body: JSON.stringify(body)
    });
    location.reload();
}


function formatTimestampOneWeekLater(timestamp = 0) {
    const date = new Date(timestamp);

    const year = date.getFullYear(); // Returns the year (4 digits for 4-digit years)
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based; add 1 to make it 1-based
    const day = date.getDate().toString().padStart(2, '0'); // Returns the day of the month (from 1 to 31)
    const hour = date.getHours().toString().padStart(2, '0'); // Returns the hour (from 0 to 23)
    const minute = date.getMinutes().toString().padStart(2, '0'); // Returns the minutes (from 0 to 59)

    return `${year}-${month}-${day}T${hour}:${minute}`;
}
