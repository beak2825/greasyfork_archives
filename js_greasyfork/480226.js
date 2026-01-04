// ==UserScript==
// @name         HoF Revive 2.0 Tracking
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Try to take over the world
// @author       You
// @match        https://www.torn.com/hospital*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/480226/HoF%20Revive%2020%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/480226/HoF%20Revive%2020%20Tracking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'l5EndE9DLFxAg3nU';

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.torn.com/user?selections=personalstats&key=${API_KEY}`,
        onload: function(response) {
            const data = JSON.parse(response.responseText);
            const revives = data.personalstats.revives;
            const box = document.createElement('div');
            const num1 = 4450;
            const num2 = 1600;
            const result = (num1 - revives) * 25;
            const result2 = (result / num2);
            const result3 = Math.round(result2 * 10) / 10;
            // Set font size here (e.g., '16px', '1.2em', etc.)
            box.style.fontSize = '12px';
            box.style.border = '1px solid #ccc';
            box.style.padding = '5px';
            box.innerHTML = `Revives: ${revives} of ${num1} = ${result} energy - ${result3} days to go`;
            const hospital = document.querySelector('#skip-to-content');
            hospital.insertBefore(box, hospital.firstChild);
        }
    });
})();