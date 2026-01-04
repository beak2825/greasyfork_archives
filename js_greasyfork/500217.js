// ==UserScript==
// @name        logUsage
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Logs the dates and times of usage
// @author      IgnaV

// IMPORTANT. Remember to add these lines to your main script:
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

function logUsage(maxRecords = 10) {
    const key = 'logUsage';
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let data = GM_getValue(key, []);

    data.push(currentDateTime);

    if (data.length > maxRecords) {
        data = data.slice(data.length - maxRecords);
    }

    GM_setValue(key, data);
};
