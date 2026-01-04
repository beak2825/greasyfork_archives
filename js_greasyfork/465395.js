// ==UserScript==
// @name         Audit Trail timestamp Convert
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Convert UNIX timestamp to UTC date
// @author       Hao
// @match        https://audittrail.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465395/Audit%20Trail%20timestamp%20Convert.user.js
// @updateURL https://update.greasyfork.org/scripts/465395/Audit%20Trail%20timestamp%20Convert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideColor = '#A9A9A9';

    const unixTimestampToPT = (timestamp) =>{
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        return formattedDate;
    }

    const unixTimestampToUTC = (timestamp) =>{
        const date = new Date(timestamp * 1000);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();
        const second = date.getUTCSeconds();
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        return formattedDate;
    }

    const createButton = (ptTime, utcTime) => {
        const timezone = document.createElement('span');
        const pt = document.createElement('span');
        pt.innerHTML = 'PT: '+ptTime;
        pt.style.marginLeft = '30px';
        const utc = document.createElement('span');
        utc.innerHTML = 'UTC: '+utcTime;
        utc.style.marginLeft = '30px';
        timezone.append(pt);
        timezone.append(utc);
        return timezone;
    }

    let node = document.querySelector('.drilldown-container');
    let observer = new MutationObserver(mutations => {
        if (document.querySelector("div[class='generic-drilldown list']")){
            const drilldownDoc = document.querySelector("div[class='generic-drilldown list']");
            const timestampDoc = [...drilldownDoc.querySelectorAll("div[class='value copy-target']")].filter(value => /^\D*(\d\D*){10}$/.test(value.innerHTML));
            timestampDoc.map((value, index) => {
                const ptTime = unixTimestampToPT(value.innerHTML);
                const utcTime = unixTimestampToUTC(value.innerHTML);
                value.append(createButton(ptTime, utcTime));
            });
            console.log(timestampDoc);
        }
    });
    let observerOptions = {
        childList: true,
        attributes: true,
        subtree: true,
    }
    observer.observe(node, observerOptions);
})();