// ==UserScript==
// @license MIT 
// @name         Monitor Alerts
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  show alert for each blockage event
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528328/Monitor%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/528328/Monitor%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // coded url
    const MONITOR_URL = "http://192.168.1.100:3000/status?param=%7CVCI%20%3B00"; 

    // decoding request part
    let urlParts = MONITOR_URL.split('?'); // Розділяємо URL на базову частину і параметри
    let baseUrl = urlParts[0]; 
    let decodedParams = urlParts[1] ? decodeURIComponent(urlParts[1]) : ''; // decoding parts
    let finalUrl = decodedParams ? `${baseUrl}?${decodedParams}` : baseUrl; // building url

    let lastAlertTexts = new Set(); // remember shown alerts

    function checkStatus() {
        GM_xmlhttpRequest({
            method: "GET",
            url: finalUrl, // use decoded url
            onload: function(response) {
                if (response.status === 200) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, "text/html");

                    let allElements = Array.from(doc.body.querySelectorAll("*:not(script):not(style)"));
                    let errorElements = allElements.filter(el => el.textContent.includes("Blockage"));
                    let currentErrors = new Set(errorElements.map(el => el.textContent.trim()));

                    let newErrors = [...currentErrors].filter(text => !lastAlertTexts.has(text));

                    newErrors.forEach(text => {
                        alert("LMS Issue Detected:\n\n" + text);
                    });

                    lastAlertTexts = new Set([...lastAlertTexts, ...newErrors]);
                }
            }
        });
    }

    setInterval(checkStatus, 2000);
})();