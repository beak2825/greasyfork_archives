// ==UserScript==
// @name         Convert to legacy units
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Convert your personal evades.io map into legacy units to use in a sandbox. Open by backtick "`"
// @author       rek
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506033/Convert%20to%20legacy%20units.user.js
// @updateURL https://update.greasyfork.org/scripts/506033/Convert%20to%20legacy%20units.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '50%';
    menuContainer.style.left = '50%';
    menuContainer.style.transform = 'translate(-50%, -50%)';
    menuContainer.style.padding = '20px';
    menuContainer.style.backgroundColor = '#f0f0f0';
    menuContainer.style.border = '1px solid #ccc';
    menuContainer.style.borderRadius = '10px';
    menuContainer.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.2)';
    menuContainer.style.display = 'none';
    menuContainer.style.opacity = 0;
    menuContainer.style.transition = 'opacity 0.5s';
    document.body.appendChild(menuContainer);

    const importButton = document.createElement('button');
    importButton.innerHTML = 'Import Map';
    importButton.style.marginRight = '10px';

    const exportButton = document.createElement('button');
    exportButton.innerHTML = 'Export Map';
    exportButton.disabled = true;

    menuContainer.appendChild(importButton);
    menuContainer.appendChild(exportButton);

    let modifiedContent = '';

    document.addEventListener('keydown', function(event) {
        if (event.key === '`') {
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'block';
                setTimeout(() => {
                    menuContainer.style.opacity = 1;
                }, 10);
            } else {
                menuContainer.style.opacity = 0;
                setTimeout(() => {
                    menuContainer.style.display = 'none';
                }, 500);
            }
        }
    });

    importButton.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.yaml,.txt';

        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                const content = e.target.result;
                modifiedContent = modifySpawnerSpeed(content);
                exportButton.disabled = false;
                alert('File processed successfully!');
            };

            reader.readAsText(file);
        });

        input.click();
    });

    exportButton.addEventListener('click', function() {
        const blob = new Blob([modifiedContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modified_map.yaml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    function modifySpawnerSpeed(content) {
        const regex = /speed:\s*(\d+\.?\d*)/g;
        return content.replace(regex, (match, p1) => {
            const originalSpeed = parseFloat(p1);
            const newSpeed = (originalSpeed / 30).toFixed(2);
            return match.replace(p1, newSpeed);
        });
    }
})();
