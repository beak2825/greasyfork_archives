// ==UserScript==
// @name         KodeKloud Enginner SSH Alias Clipboard
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Adds an "Alias SSH" box and copies SSH aliases to the clipboard
// @match        https://engineer.kodekloud.com/task?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493033/KodeKloud%20Enginner%20SSH%20Alias%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/493033/KodeKloud%20Enginner%20SSH%20Alias%20Clipboard.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Define your SSH aliases here
    const sshAliases = `
       alias app01='sshpass -p "Ir0nM@n" ssh -o StrictHostKeyChecking=no tony@172.16.238.10'
       alias app02='sshpass -p "Am3ric@" ssh -o StrictHostKeyChecking=no steve@172.16.238.11'
       alias app03='sshpass -p "BigGr33n" ssh -o StrictHostKeyChecking=no banner@172.16.238.12'
       alias lb01='sshpass -p "Mischi3f" ssh -o StrictHostKeyChecking=no loki@172.16.238.14'
       alias db01='sshpass -p "Sp!dy" ssh -o StrictHostKeyChecking=no peter@172.16.239.10'
       alias tor01='sshpass -p "Bl@kW" ssh -o StrictHostKeyChecking=no natasha@172.16.238.15'
       alias bkp01='sshpass -p "H@wk3y3" ssh -o StrictHostKeyChecking=no clint@172.16.238.16'
       alias mail01='sshpass -p "Gr00T123" ssh -o StrictHostKeyChecking=no groot@172.16.238.17'
       alias jenkins='sshpass -p "j@rv!s" ssh -o StrictHostKeyChecking=no jenkins@172.16.238.19'
    `;

    // Create the "Alias SSH" box
    const aliasBox = document.createElement('div');
    aliasBox.style.position = 'fixed';
    aliasBox.style.left = '200px';
    aliasBox.style.top = '10px';
    aliasBox.style.backgroundColor = '#141414'; // Setting the color to #141414
    aliasBox.style.padding = '5px'; // Reducing padding for a smaller box
    aliasBox.style.borderRadius = '0 10px 0 0'; // Rounded bottom left corner
    aliasBox.innerText = 'Alias SSH';
    aliasBox.style.color = 'white'; // Setting text color to white
    document.body.appendChild(aliasBox);

    // Add a click event to copy the aliases to the clipboard
    aliasBox.addEventListener('click', () => {
        const textarea = document.createElement('textarea');
        textarea.value = sshAliases;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('SSH aliases copied to clipboard!');
    });
})();
