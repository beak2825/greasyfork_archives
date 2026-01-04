// ==UserScript==
// @name        Superset Schema Toggle Button
// @include      *://*superset*/*
// @grant       none
// @version     1.0.1
// @author      AlecJi
// @description Adds a toggle button to show/hide the schema pane in Superset's interface for better workspace management
// @license MIT
// @namespace https://greasyfork.org/users/1442383
// @downloadURL https://update.greasyfork.org/scripts/528821/Superset%20Schema%20Toggle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/528821/Superset%20Schema%20Toggle%20Button.meta.js
// ==/UserScript==

function createToggleButton() {
    // Check if button already exists to avoid duplicate creation
    if (document.getElementById('schema-toggle-btn')) {
        return;
    }

    const button = document.createElement('button');
    button.id = 'schema-toggle-btn';
    button.textContent = 'Hide Schema';
    button.style.cssText = `
        margin: 10px;
        padding: 8px 16px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        background: #fff;
        cursor: pointer;
        font-size: 14px;
    `;

    // Wait for target container to appear
    function tryAddButton() {
        const targetDiv = document.querySelector('.css-pyvf21');
        if (targetDiv) {
            targetDiv.appendChild(button);

            // Add click event handler
            button.addEventListener('click', () => {
                const schemaPanes = document.getElementsByClassName('schemaPane');
                const isVisible = schemaPanes[0]?.style.display !== 'none';

                Array.from(schemaPanes).forEach(pane => {
                    pane.style.display = isVisible ? 'none' : 'block';
                });

                button.textContent = isVisible ? 'Show Schema' : 'Hide Schema';
            });
        } else {
            // If target container is not ready, retry after delay
            setTimeout(tryAddButton, 1000);
        }
    }

    tryAddButton();
}

// Execute when page is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createToggleButton);
} else {
    createToggleButton();
}